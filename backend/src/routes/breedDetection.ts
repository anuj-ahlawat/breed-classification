import { Router } from 'express';
import multer from 'multer';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { aiModelService } from '../services/aiModelService';
import { FeedbackModel } from '../models/Feedback';
import { AnimalModel } from '../models/Animal';
import mongoose from 'mongoose';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Check if MongoDB is connected
const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;

// AI Breed Detection endpoint
router.post('/detect', authenticateToken, upload.single('image'), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Process image with AI model
    const result = await aiModelService.predictBreed(req.file.buffer);
    
    // Store the image URI (in production, upload to cloud storage)
    const imageUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    return res.json({
      success: true,
      data: {
        imageUri,
        predictions: result.predictions,
        heatmapData: result.heatmapData,
        processingTime: result.processingTime
      }
    });
  } catch (error) {
    console.error('Breed detection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process image' 
    });
  }
});

// Submit feedback for breed prediction
router.post('/feedback', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      imageUri,
      predictedBreeds,
      userSelectedBreed,
      userRating,
      userComments,
      breedRatings,
      heatmapData
    } = req.body;

    // Validate required fields
    if (!imageUri || !predictedBreeds || !userSelectedBreed || !userRating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Determine if prediction was correct
    const isCorrect = predictedBreeds[0]?.breed === userSelectedBreed;

    const feedbackData = {
      userId,
      imageUri,
      predictedBreeds,
      userSelectedBreed,
      userRating,
      userComments,
      breedRatings: breedRatings || [],
      heatmapData,
      isCorrect
    };

    if (isMongoConnected()) {
      const feedback = await FeedbackModel.create(feedbackData);
      return res.status(201).json(feedback);
    } else {
      // In-memory storage fallback
      const feedback = {
        _id: `feedback_${Date.now()}`,
        ...feedbackData,
        createdAt: new Date()
      };
      return res.status(201).json(feedback);
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Register animal to BPA (Breed Prediction Accuracy) system
router.post('/register-bpa', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      breed,
      animalType,
      age,
      gender,
      tagId,
      location,
      ownerName,
      notes,
      imageUri,
      confidence,
      feedbackId,
      breedRatings
    } = req.body;

    // Validate required fields
    if (!breed || !animalType || !age || !gender || !tagId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const animalData = {
      userId,
      breed,
      animalType,
      age,
      gender,
      tagId,
      location,
      ownerName,
      notes,
      imageUri,
      confidence,
      feedbackId,
      breedRatings: breedRatings || [],
      registrationDate: new Date()
    };

    if (isMongoConnected()) {
      const animal = await AnimalModel.create(animalData);
      return res.status(201).json(animal);
    } else {
      // In-memory storage fallback
      const animal = {
        _id: `animal_${Date.now()}`,
        ...animalData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return res.status(201).json(animal);
    }
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate tagId' });
    }
    console.error('BPA registration error:', error);
    return res.status(500).json({ message: 'Failed to register animal' });
  }
});

// Get feedback statistics
router.get('/feedback/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (isMongoConnected()) {
      const stats = await FeedbackModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalPredictions: { $sum: 1 },
            correctPredictions: { $sum: { $cond: ['$isCorrect', 1, 0] } },
            averageRating: { $avg: '$userRating' }
          }
        },
        {
          $addFields: {
            accuracy: {
              $multiply: [
                { $divide: ['$correctPredictions', '$totalPredictions'] },
                100
              ]
            }
          }
        }
      ]);

      return res.json(stats[0] || {
        totalPredictions: 0,
        correctPredictions: 0,
        averageRating: 0,
        accuracy: 0
      });
    } else {
      // Mock stats for in-memory storage
      return res.json({
        totalPredictions: 0,
        correctPredictions: 0,
        averageRating: 0,
        accuracy: 0
      });
    }
  } catch (error) {
    console.error('Feedback stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch feedback statistics' });
  }
});

// Get breed rating statistics
router.get('/feedback/breed-stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (isMongoConnected()) {
      const breedStats = await FeedbackModel.aggregate([
        { $match: { userId, breedRatings: { $exists: true, $ne: [] } } },
        { $unwind: '$breedRatings' },
        {
          $group: {
            _id: '$breedRatings.breed',
            averageRating: { $avg: '$breedRatings.rating' },
            totalRatings: { $sum: 1 },
            maxRating: { $max: '$breedRatings.rating' },
            minRating: { $min: '$breedRatings.rating' }
          }
        },
        { $sort: { averageRating: -1 } }
      ]);

      return res.json(breedStats);
    } else {
      // Mock stats for in-memory storage
      return res.json([]);
    }
  } catch (error) {
    console.error('Breed stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch breed statistics' });
  }
});

export default router;
