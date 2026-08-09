import mongoose, { Document, Schema } from 'mongoose';

export interface IChecklistItem {
  _id?: mongoose.Types.ObjectId;
  text: string;
  isDone: boolean;
}

export interface IMission extends Document {
  title: string;
  description: string;
  childId: string;
  skillId?: string;
  rewardPoints: number;
  dueDate: Date;
  checklist: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    text: { type: String, required: true },
    isDone: { type: Boolean, default: false },
  },
  { _id: true }
);

const MissionSchema = new Schema<IMission>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    childId: { type: String, required: true, index: true },
    skillId: { type: String },
    rewardPoints: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    checklist: { type: [ChecklistItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);
