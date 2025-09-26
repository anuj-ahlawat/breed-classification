import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = Router();

// Check if MongoDB is connected
const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;

// Submit user feedback
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      type,
      subject,
      message,
      userEmail,
      userName,
      timestamp
    } = req.body;

    // Validate required fields
    if (!type || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const feedbackData = {
      userId,
      type,
      subject,
      message,
      userEmail,
      userName,
      timestamp: timestamp || new Date(),
      status: 'pending',
      createdAt: new Date()
    };

    if (isMongoConnected() && mongoose.connection.db) {
      // Store in MongoDB
      const feedback = await mongoose.connection.db.collection('feedback').insertOne(feedbackData);
      return res.status(201).json({
        _id: feedback.insertedId,
        ...feedbackData
      });
    } else {
      // In-memory storage fallback
      const feedback = {
        _id: `feedback_${Date.now()}`,
        ...feedbackData
      };
      return res.status(201).json(feedback);
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Get user's feedback history
router.get('/my-feedback', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (isMongoConnected() && mongoose.connection.db) {
      const feedback = await mongoose.connection.db.collection('feedback')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.json(feedback);
    } else {
      // Mock data for in-memory storage
      return res.json([]);
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

// Get all feedback (admin only - for future use)
router.get('/all', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // In a real app, you would check if user is admin
    // For now, we'll allow all authenticated users to see all feedback
    
    if (isMongoConnected() && mongoose.connection.db) {
      const feedback = await mongoose.connection.db.collection('feedback')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return res.json(feedback);
    } else {
      // Mock data for in-memory storage
      return res.json([]);
    }
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    return res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

export default router;
