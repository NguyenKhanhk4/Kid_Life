// Mongoose Schema & Model cho QuizQuestion (Câu Hỏi Trong Quiz)
import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizQuestion extends Document {
  quiz_id: Types.ObjectId;
  question_text: string;
  options: string[];
  correct_answer: string;
  step_order: number;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    question_text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => Array.isArray(val) && val.length >= 2,
        'Mỗi câu hỏi cần ít nhất 2 lựa chọn',
      ],
    },
    correct_answer: {
      type: String,
      required: true,
    },
    step_order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    versionKey: false,
  }
);

export default model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);
