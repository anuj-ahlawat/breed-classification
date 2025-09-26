import { Schema, model, Document } from 'mongoose';

export interface IAnimal extends Document {
  userId: string;
  breed: string;
  animalType: 'Cattle' | 'Buffalo';
  age: number;
  gender: 'Male' | 'Female';
  tagId: string;
  location?: string;
  ownerName?: string;
  notes?: string;
  imageUri?: string;
  confidence?: number;
  feedbackId?: string;
  breedRatings?: {
    breed: string;
    rating: number;
  }[];
  registrationDate: Date;
}

const animalSchema = new Schema<IAnimal>({
  userId: { type: String, required: true, index: true },
  breed: { type: String, required: true },
  animalType: { type: String, enum: ['Cattle', 'Buffalo'], required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  tagId: { type: String, required: true, unique: true, index: true },
  location: String,
  ownerName: String,
  notes: String,
  imageUri: String,
  confidence: Number,
  feedbackId: String,
  breedRatings: [{
    breed: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 }
  }],
  registrationDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const AnimalModel = model<IAnimal>('Animal', animalSchema);



