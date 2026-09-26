// Cấu hình kết nối MongoDB Atlas cho dự án KidLife
import mongoose from 'mongoose';

async function connectDatabase(): Promise<void> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGODB_URI, { dbName: 'kidlife' });
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log('❌ MongoDB connection error:', message);
    process.exit(1);
  }
}

export default connectDatabase;
