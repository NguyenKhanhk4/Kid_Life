// Mongoose Schema & Model cho Quiz (Bộ Câu Hỏi Trắc Nghiệm)
import { Schema, model, Document, Types } from 'mongoose';

export interface IQuiz extends Document {
  lesson_id: Types.ObjectId;
  title: string;
  pass_score: number;
  reward_xp: number;
  created_at: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    pass_score: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
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
  },
  {
    versionKey: false,
  }
);

export default model<IQuiz>('Quiz', QuizSchema);
