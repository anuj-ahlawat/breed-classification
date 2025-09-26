import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

const MONGO_URI = process.env['MONGO_URI'] || 'mongodb://127.0.0.1:27017/SihCow';
const PORT = parseInt(process.env['PORT'] || '4000', 10);

// Health check route
app.get('/health', (_req: any, res: any) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
import animalsRouter from './routes/animals';
import authRouter from './routes/auth';
import breedDetectionRouter from './routes/breedDetection';
import feedbackRouter from './routes/feedback';
app.use('/animals', animalsRouter);
app.use('/auth', authRouter);
app.use('/breed-detection', breedDetectionRouter);
app.use('/feedback', feedbackRouter);

async function start() {
  try {
    console.log('🚀 Starting server...');
    
    // Try to connect to MongoDB with better configuration
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      });
      console.log('✅ MongoDB connected successfully');
      console.log(`   Database: ${mongoose.connection.db?.databaseName}`);
    } catch (mongoErr: any) {
      console.log('⚠️ MongoDB connection failed, running with in-memory storage');
      console.log(`   Error: ${mongoErr.message}`);
      console.log('   To fix MongoDB:');
      console.log('   1. Install: brew install mongodb-community');
      console.log('   2. Start: brew services start mongodb-community');
      console.log('   3. Or start manually: mongod');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🐄 Animals API: http://localhost:${PORT}/animals`);
      console.log(`🤖 Breed Detection API: http://localhost:${PORT}/breed-detection`);
      console.log(`💬 Feedback API: http://localhost:${PORT}/feedback`);
      console.log(`📱 Mobile access: http://10.12.102.8:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
