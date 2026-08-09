import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/kidlife',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || '',
  petFeedCost: parseInt(process.env.PET_FEED_COST || '10', 10),
  payment: {
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
  }
};
