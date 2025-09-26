import { Router } from 'express';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// In-memory storage for users when MongoDB is not available
let inMemoryUsers: any[] = [];
let nextUserId = 1;

// Check if MongoDB is connected
const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-change-in-production';

// Helper function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to hash password
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

// Helper function to compare password
const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (isMongoConnected()) {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        totalAnimals: 0,
        isActive: true,
        lastLogin: new Date(),
      });

      await user.save();

      // Generate token
      const token = generateToken((user._id as any).toString());

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          phone: user.phone,
          location: user.location,
          totalAnimals: user.totalAnimals,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      });
    } else {
      // Use in-memory storage
      const existingUser = inMemoryUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: `mem_${nextUserId++}`,
        name,
        email,
        password: hashedPassword,
        profileImage: null,
        phone: null,
        location: null,
        totalAnimals: 0,
        lastLogin: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      inMemoryUsers.push(newUser);

      const token = generateToken(newUser.id);

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          profileImage: newUser.profileImage,
          phone: newUser.phone,
          location: newUser.location,
          totalAnimals: newUser.totalAnimals,
          lastLogin: newUser.lastLogin,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        token,
      });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in endpoint
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (isMongoConnected()) {
      // Find user in MongoDB
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken((user._id as any).toString());

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return res.json({
        message: 'Sign in successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          phone: user.phone,
          location: user.location,
          totalAnimals: user.totalAnimals,
          lastLogin: user.lastLogin,
        },
        token,
      });
    } else {
      // Use in-memory storage
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate token
      const token = generateToken(user.id);

      return res.json({
        message: 'Sign in successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    }
  } catch (error: any) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    if (isMongoConnected()) {
      const user = await UserModel.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ user });
    } else {
      const user = inMemoryUsers.find(u => u.id === decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ user: { ...user, password: undefined } });
    }
  } catch (error: any) {
    console.error('Profile error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { name, phone, location } = req.body;

    if (isMongoConnected()) {
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (location) user.location = location;

      await user.save();

      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          phone: user.phone,
          location: user.location,
          totalAnimals: user.totalAnimals,
          lastLogin: user.lastLogin,
        },
      });
    } else {
      const userIndex = inMemoryUsers.findIndex(u => u.id === decoded.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) inMemoryUsers[userIndex].name = name;
      if (phone) inMemoryUsers[userIndex].phone = phone;
      if (location) inMemoryUsers[userIndex].location = location;

      return res.json({
        message: 'Profile updated successfully',
        user: { ...inMemoryUsers[userIndex], password: undefined },
      });
    }
  } catch (error: any) {
    console.error('Profile update error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
