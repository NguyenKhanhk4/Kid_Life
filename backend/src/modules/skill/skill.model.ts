import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  description: string;
  ageRange: { min: number; max: number };
  icon?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    ageRange: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
    },
    icon: { type: String },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

SkillSchema.index({ name: 1 });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
