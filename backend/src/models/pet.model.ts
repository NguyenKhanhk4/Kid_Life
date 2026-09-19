import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPet extends Document {
  child_id: Types.ObjectId;
  name: string;
  stage: 1 | 2 | 3 | 4;
  level: number;
  current_xp: number;
  streak_days: number;
  mood: 'sad' | 'neutral' | 'happy' | 'excited';
  last_fed_time: Date | null;
  last_active_date: Date;
}

const PetSchema = new Schema<IPet>({
  child_id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, default: 'Rồng Con' },
  stage: { type: Number, enum: [1, 2, 3, 4], default: 1 },
  level: { type: Number, default: 1 },
  current_xp: { type: Number, default: 0 },
  streak_days: { type: Number, default: 0 },
  mood: { type: String, enum: ['sad', 'neutral', 'happy', 'excited'], default: 'neutral' },
  last_fed_time: { type: Date, default: null },
  last_active_date: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Pet = mongoose.model<IPet>('Pet', PetSchema);
