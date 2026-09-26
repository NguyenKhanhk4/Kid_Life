// Mongoose Schema & Model cho Lesson (Thư Viện Bài Học)
import { Schema, model, Document } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description?: string;
  content: string;
  category: 'hoc_tap' | 'ky_nang' | 'the_chat' | 'sang_tao' | 'khac';
  thumbnail_url?: string;
  reward_xp: number;
  created_at: Date;
  updated_at: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['hoc_tap', 'ky_nang', 'the_chat', 'sang_tao', 'khac'],
    },
    thumbnail_url: {
      type: String,
      default: '',
    },
    reward_xp: {
      type: Number,
      required: true,
      min: 1,
      max: 200,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default model<ILesson>('Lesson', LessonSchema);
