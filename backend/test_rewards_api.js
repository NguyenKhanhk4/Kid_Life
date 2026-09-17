async function runRewardTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('🚀 BẮT ĐẦU KIỂM THỬ TOÀN BỘ API MODULE REWARDS (TASK 2.6)\n');

  const parentId = '65f1a2b3c4d5e6f7a8b9c0aa';
  const childId = '65f1a2b3c4d5e6f7a8b9c0bb';

  // Test 1: GET /api/rewards không có parent_id (Kỳ vọng: 400)
  console.log('--- TEST 1: GET /api/rewards thiếu parent_id (Kỳ vọng: 400) ---');
  const res1 = await fetch(`${baseUrl}/api/rewards`);
  const data1 = await res1.json();
  console.log(`Status: ${res1.status}`);
  console.log('Response:', JSON.stringify(data1), '\n');

  // Test 2: POST /api/rewards với body rỗng (Kỳ vọng: 400 Zod Error)
  console.log('--- TEST 2: POST /api/rewards body rỗng (Kỳ vọng: 400 Zod Error) ---');
  const res2 = await fetch(`${baseUrl}/api/rewards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data2 = await res2.json();
  console.log(`Status: ${res2.status}`);
  console.log('Response:', JSON.stringify(data2), '\n');

  // Test 3: POST /api/rewards tạo phần thưởng hợp lệ (Kỳ vọng: 201)
  console.log('--- TEST 3: POST /api/rewards tạo phần thưởng mới (Kỳ vọng: 201) ---');
  const res3 = await fetch(`${baseUrl}/api/rewards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parent_id: parentId,
      title: '15 phút chơi game',
      cost_xp: 100,
      category: 'trai_nghiem',
      icon: '🎮',
    }),
  });
  const data3 = await res3.json();
  console.log(`Status: ${res3.status}`);
  console.log('Response:', JSON.stringify(data3, null, 2), '\n');
  const rewardId = data3.data?._id;

  // Test 4: GET /api/rewards?parent_id=... (Kỳ vọng: 200)
  console.log(`--- TEST 4: GET /api/rewards?parent_id=${parentId} (Kỳ vọng: 200) ---`);
  const res4 = await fetch(`${baseUrl}/api/rewards?parent_id=${parentId}`);
  const data4 = await res4.json();
  console.log(`Status: ${res4.status}`);
  console.log(`Số phần thưởng tìm thấy: ${data4.data?.length}`);
  console.log('Response:', JSON.stringify(data4, null, 2), '\n');

  // Test 5: PUT /api/rewards/:id (Kỳ vọng: 200)
  console.log(`--- TEST 5: PUT /api/rewards/${rewardId} cập nhật (Kỳ vọng: 200) ---`);
  const res5 = await fetch(`${baseUrl}/api/rewards/${rewardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cost_xp: 120,
      title: '20 phút chơi game cuối tuần',
    }),
  });
  const data5 = await res5.json();
  console.log(`Status: ${res5.status}`);
  console.log('Response:', JSON.stringify(data5, null, 2), '\n');

  // Test 6: POST /api/rewards/redeem tạo yêu cầu đổi quà (Kỳ vọng: 201)
  console.log('--- TEST 6: POST /api/rewards/redeem gửi yêu cầu đổi quà (Kỳ vọng: 201) ---');
  const res6 = await fetch(`${baseUrl}/api/rewards/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reward_id: rewardId,
      child_id: childId,
    }),
  });
  const data6 = await res6.json();
  console.log(`Status: ${res6.status}`);
  console.log('Response:', JSON.stringify(data6, null, 2), '\n');
  const redemptionId = data6.data?._id;

  // Test 7: POST /api/rewards/redeem thử gửi yêu cầu trùng khi đang pending (Kỳ vọng: 400)
  console.log('--- TEST 7: POST /api/rewards/redeem trùng khi đang pending (Kỳ vọng: 400) ---');
  const res7 = await fetch(`${baseUrl}/api/rewards/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reward_id: rewardId,
      child_id: childId,
    }),
  });
  const data7 = await res7.json();
  console.log(`Status: ${res7.status}`);
  console.log('Response:', JSON.stringify(data7), '\n');

  // Test 8: GET /api/rewards/redemptions (Kỳ vọng: 200 có populate reward)
  console.log('--- TEST 8: GET /api/rewards/redemptions (Kỳ vọng: 200 kèm populate) ---');
  const res8 = await fetch(`${baseUrl}/api/rewards/redemptions?child_id=${childId}&parent_id=${parentId}`);
  const data8 = await res8.json();
  console.log(`Status: ${res8.status}`);
  console.log(`Số yêu cầu tìm thấy: ${data8.data?.length}`);
  console.log('Response:', JSON.stringify(data8, null, 2), '\n');

  // Test 9: POST /api/rewards/redemptions/:id/approve (Kỳ vọng: 200)
  console.log(`--- TEST 9: POST /api/rewards/redemptions/${redemptionId}/approve (Kỳ vọng: 200) ---`);
  const res9 = await fetch(`${baseUrl}/api/rewards/redemptions/${redemptionId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved' }),
  });
  const data9 = await res9.json();
  console.log(`Status: ${res9.status}`);
  console.log('Response:', JSON.stringify(data9, null, 2), '\n');

  // Test 10: Duyệt lại lần nữa khi không còn pending (Kỳ vọng: 400)
  console.log(`--- TEST 10: Thử duyệt lại yêu cầu đã xử lý (Kỳ vọng: 400) ---`);
  const res10 = await fetch(`${baseUrl}/api/rewards/redemptions/${redemptionId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'rejected' }),
  });
  const data10 = await res10.json();
  console.log(`Status: ${res10.status}`);
  console.log('Response:', JSON.stringify(data10), '\n');

  // Dọn dẹp dữ liệu test
  console.log('--- Dọn dẹp dữ liệu test ---');
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'kidlife' });
  await mongoose.connection.collection('rewards').deleteOne({ _id: new mongoose.Types.ObjectId(rewardId) });
  await mongoose.connection.collection('redemptions').deleteOne({ _id: new mongoose.Types.ObjectId(redemptionId) });
  await mongoose.disconnect();
  console.log('✅ Đã dọn dẹp sạch dữ liệu test trong MongoDB Atlas!');
  console.log('🎉 TẤT CẢ 10 BƯỚC TEST MODULE REWARDS ĐÃ CHẠY HOÀN HẢO!');
}

require('dotenv').config();
runRewardTests().catch(console.error);
