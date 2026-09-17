// Mongoose Schema & Model cho FamilyMember — Dev 1 sở hữu
// familyId = user._id của Admin (người tạo gia đình đầu tiên)
import { Schema, model, Document, Types } from 'mongoose';

export interface IFamilyMember extends Document {
  familyId: Types.ObjectId;   // user._id của admin (cha/mẹ chính)
  userId?: Types.ObjectId;    // liên kết nếu đã có User account
  role: 'admin' | 'parent' | 'grandparent';
  phone: string;
  status: 'active' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['admin', 'parent', 'grandparent'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Tránh mời trùng cùng SĐT trong cùng 1 gia đình
FamilyMemberSchema.index({ familyId: 1, phone: 1 }, { unique: true });

export default model<IFamilyMember>('FamilyMember', FamilyMemberSchema);
