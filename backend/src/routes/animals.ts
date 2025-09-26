import { Router } from 'express';
import { AnimalModel } from '../models/Animal';
import mongoose from 'mongoose';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// In-memory storage as fallback when MongoDB is not available
let inMemoryAnimals: any[] = [];
let nextId = 1;

// Check if MongoDB is connected
const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (isMongoConnected()) {
      const animals = await AnimalModel.find({ userId }).sort({ createdAt: -1 }).lean();
      return res.json(animals);
    } else {
      // Use in-memory storage
      const userAnimals = inMemoryAnimals
        .filter(animal => animal.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json(userAnimals);
    }
  } catch (err) {
    console.error('Error fetching animals:', err);
    return res.status(500).json({ message: 'Database error' });
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (isMongoConnected()) {
      const animalData = { ...req.body, userId };
      const created = await AnimalModel.create(animalData);
      return res.status(201).json(created);
    } else {
      // Use in-memory storage
      const newAnimal = {
        _id: `mem_${nextId++}`,
        ...req.body,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryAnimals.push(newAnimal);
      return res.status(201).json(newAnimal);
    }
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate tagId' });
    }
    return res.status(400).json({ message: err.message || 'Invalid payload' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    if (isMongoConnected()) {
      const animal = await AnimalModel.findOne({ _id: id, userId });
      if (!animal) return res.status(404).json({ message: 'Animal not found or not owned by user' });
      
      await AnimalModel.findByIdAndDelete(id);
    } else {
      // Use in-memory storage
      const index = inMemoryAnimals.findIndex(animal => animal._id === id && animal.userId === userId);
      if (index === -1) return res.status(404).json({ message: 'Animal not found or not owned by user' });
      inMemoryAnimals.splice(index, 1);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting animal:', err);
    return res.status(500).json({ message: 'Database error' });
  }
});

export default router;


