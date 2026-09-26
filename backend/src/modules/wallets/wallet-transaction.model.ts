import { Schema, model, Document, Types } from 'mongoose';

export interface IWalletTransaction extends Document {
  wallet_id: Types.ObjectId;
  child_id: Types.ObjectId;
  amount: number;
  type: string;
  reference_id: Types.ObjectId;
  description: string;
  created_at: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>({
  wallet_id: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: [
      'mission_reward', 'quiz_reward', 'penalty',
      'pet_feed', 'pet_feed_refund', 'pet_streak_bonus', 'pet_accessory_buy', 'pet_accessory_refund',
    ],
    required: true,
  },
  reference_id: { type: Schema.Types.ObjectId, required: true },
  description: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now }
});

export default model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
