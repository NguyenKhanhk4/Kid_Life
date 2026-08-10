import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { User } from '../src/modules/auth/user.model';
import { ChildProfile } from '../src/modules/child/childProfile.model';
import { Wallet } from '../src/modules/wallet/wallet.model';
import { Pet } from '../src/modules/pet/pet.model';
import { ChildService } from '../src/modules/child/child.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runTest() {
  console.log('🔄 Đang khởi tạo môi trường Integration Test...');
  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ Đã kết nối Database.');
  } catch (error) {
    console.error('❌ Lỗi kết nối DB:', error);
    process.exit(1);
  }

  // Cleanup old test data
  const testEmail = 'integration_test_user@kidlife.local';
  console.log(`\n🧹 Đang dọn dẹp dữ liệu cũ (${testEmail})...`);
  const oldUser = await User.findOne({ email: testEmail });
  if (oldUser) {
    const children = await ChildProfile.find({ parentId: oldUser._id });
    for (const child of children) {
      await Wallet.deleteMany({ childId: child._id });
      await Pet.deleteMany({ childId: child._id });
      await child.deleteOne();
    }
    await oldUser.deleteOne();
  }
  console.log('✅ Dọn dẹp hoàn tất.');

  console.log('\n=============================================');
  console.log('🚀 BẮT ĐẦU CROSS-MODULE INTEGRATION TEST');
  console.log('=============================================');

  try {
    // 1. Create a parent user
    console.log('\n[1] Khởi tạo tài khoản Parent...');
    const parent = await User.create({
      email: testEmail,
      fullName: 'Integration Test Parent',
      passwordHash: 'dummy_hash',
      role: 'PARENT',
      status: 'ACTIVE',
      isEmailVerified: true
    });
    console.log(`✅ Thành công. Parent ID: ${parent._id}`);

    // 2. Use ChildService to create a child
    console.log('\n[2] Gọi ChildService (Dev 1) để tạo hồ sơ con...');
    const childUsername = 'integration_child_123';
    
    // This call is supposed to trigger Dev 3's WalletService and Pet model
    const result = await ChildService.createChild(parent._id.toString(), {
      name: 'Test Child',
      dateOfBirth: '2015-01-01',
      loginUsername: childUsername,
      loginPassword: 'password123'
    });
    
    console.log(`✅ Thành công. Child ID: ${result.child._id}`);
    console.log(`   - Trả về Wallet ID: ${result.walletId}`);
    console.log(`   - Trả về Pet ID: ${result.petId}`);

    // 3. Verify Dev 3's Wallet existence
    console.log('\n[3] Xác minh việc tự động tạo Wallet (Dev 3)...');
    const wallet = await Wallet.findOne({ childId: result.child._id });
    if (!wallet) {
      throw new Error('Wallet was not created!');
    }
    console.log(`✅ Wallet đã được tạo! ID: ${wallet._id}`);

    // 4. Verify Dev 3's Pet existence
    console.log('\n[4] Xác minh việc tự động tạo Pet (Dev 3)...');
    const pet = await Pet.findOne({ childId: result.child._id });
    if (!pet) {
      throw new Error('Pet was not created!');
    }
    console.log(`✅ Pet đã được tạo! Tên: ${pet.name}`);

    console.log('\n🎉 TẤT CẢ CÁC MODULE ĐÃ TÍCH HỢP HOÀN HẢO! 🎉');

  } catch (error) {
    console.error('\n❌ TÍCH HỢP THẤT BẠI:', error);
  } finally {
    console.log('\nĐóng kết nối Database...');
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTest();
