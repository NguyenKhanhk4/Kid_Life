import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  childId: string;
  title: string;
  criteria: string; // The milestone or reason (e.g., 'LEVEL_10_ACHIEVED')
  issuedAt: Date;
  fileUrl: string;
}

const CertificateSchema: Schema = new Schema(
  {
    childId: { type: String, required: true },
    title: { type: String, required: true },
    criteria: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    fileUrl: { type: String, default: '' },
  },
  { timestamps: false }
);

// Prevent issuing the same certificate for the same criteria to the same child
CertificateSchema.index({ childId: 1, criteria: 1 }, { unique: true });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
