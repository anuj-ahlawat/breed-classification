import { Schema, model, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: string;
  imageUri: string;
  predictedBreeds: {
    breed: string;
    confidence: number;
    rank: number;
  }[];
  userSelectedBreed: string;
  userRating: number; // 1-5 stars
  userComments?: string;
  breedRatings: {
    breed: string;
    rating: number; // 0-10 scale
  }[];
  heatmapData?: {
    breed1: string;
    breed2: string;
    heatmap1Uri: string;
    heatmap2Uri: string;
  };
  isCorrect: boolean;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  userId: { type: String, required: true, index: true },
  imageUri: { type: String, required: true },
  predictedBreeds: [{
    breed: { type: String, required: true },
    confidence: { type: Number, required: true },
    rank: { type: Number, required: true }
  }],
  userSelectedBreed: { type: String, required: true },
  userRating: { type: Number, required: true, min: 1, max: 5 },
  userComments: String,
  breedRatings: [{
    breed: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 }
  }],
  heatmapData: {
    breed1: String,
    breed2: String,
    heatmap1Uri: String,
    heatmap2Uri: String
  },
  isCorrect: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const FeedbackModel = model<IFeedback>('Feedback', feedbackSchema);
