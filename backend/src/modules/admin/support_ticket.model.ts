import { Schema, model, Document, Types } from 'mongoose';

export interface ISupportTicket extends Document {
  userId: Types.ObjectId;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  },
  { timestamps: true }
);

export default model<ISupportTicket>('SupportTicket', SupportTicketSchema);
