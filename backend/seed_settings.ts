import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SystemSetting from './src/modules/admin/system_setting.model';
import User from './src/modules/auth/user.model';

dotenv.config();

const seedSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Find any admin user to attribute the settings to
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found. Cannot seed settings.');
      process.exit(1);
    }

    const defaultSettings = [
      { key: 'wallet.interestRateWeekly', value: 5, description: 'Lãi suất tiết kiệm hàng tuần (%)' },
      { key: 'wish.costStars', value: 50, description: 'Số sao cần để đổi một điều ước' },
      { key: 'pet.streakToEvolve', value: 14, description: 'Số ngày chuỗi để thú cưng tiến hoá' },
    ];

    for (const setting of defaultSettings) {
      await SystemSetting.findOneAndUpdate(
        { key: setting.key },
        { ...setting, updatedBy: admin._id },
        { upsert: true, new: true }
      );
      console.log(`Seeded setting: ${setting.key} = ${setting.value}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedSettings();
