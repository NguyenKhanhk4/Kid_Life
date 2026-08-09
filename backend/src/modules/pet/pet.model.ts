import mongoose, { Schema, Document } from 'mongoose';

export type PetMood = 'HAPPY' | 'NEUTRAL' | 'SAD';

export interface IPet extends Document {
  childId: string;
  name: string;
  level: number;
  xp: number;
  mood: PetMood;
  lastFedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema: Schema = new Schema(
  {
    childId: { type: String, required: true, unique: true },
    name: { type: String, default: 'My Pet' },
    level: { type: Number, default: 1, min: 1 },
    xp: { type: Number, default: 0, min: 0 },
    mood: { type: String, enum: ['HAPPY', 'NEUTRAL', 'SAD'], default: 'HAPPY' },
    lastFedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Pet = mongoose.model<IPet>('Pet', PetSchema);
