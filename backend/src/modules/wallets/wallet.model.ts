import { Schema, model, Document, Types } from 'mongoose';

export interface IWallet extends Document {
  child_id: Types.ObjectId;
  total_xp: number;
  current_level: number;
  created_at: Date;
  updated_at: Date;
}

const WalletSchema = new Schema<IWallet>({
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true, unique: true },
  total_xp: { type: Number, default: 0, min: 0 },
  current_level: { type: Number, default: 1, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default model<IWallet>('Wallet', WalletSchema);
