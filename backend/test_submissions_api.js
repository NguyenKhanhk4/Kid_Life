async function runSubmissionTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('🚀 BẮT ĐẦU KIỂM THỬ MODULE SUBMISSIONS (TASK 2.2)\n');

  // Bước 0: Tạo 1 mission test với 2 subtasks
  console.log('--- Chuẩn bị: Tạo mission test kèm 2 subtasks ---');
  const childId = '65f1a2b3c4d5e6f7a8b9c0d1';
  const createMissionRes = await fetch(`${baseUrl}/api/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      child_id: childId,
      title: 'Tự rửa chén bát sau ăn',
      category: 'nha_cua',
      reward_xp: 50,
      subtasks: [
        'Tráng sơ chén đĩa bằng nước',
        'Rửa sạch bằng xà phòng và úp lên giá'
      ]
    })
  });
  const missionData = await createMissionRes.json();
  const missionId = missionData.data?._id;
  const subtasks = missionData.data?.subtasks || [];
  console.log(`Mission ID: ${missionId}, Số subtasks: ${subtasks.length}\n`);

  if (subtasks.length >= 2) {
    const sub1 = subtasks[0]._id;
    const sub2 = subtasks[1]._id;

    // Test 1: Tick subtask 1 (50%)
    console.log(`--- TEST 1: Tick subtask 1 (Kỳ vọng: 200, progress_percent = 50) ---`);
    const res1 = await fetch(`${baseUrl}/api/submissions/missions/${missionId}/subtasks/${sub1}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: true })
    });
    const data1 = await res1.json();
    console.log(`Status: ${res1.status}`);
    console.log('Response:', JSON.stringify(data1, null, 2), '\n');

    // Test 2: Tick subtask 2 (100% -> Mission chuyển sang in_progress)
    console.log(`--- TEST 2: Tick subtask 2 (Kỳ vọng: 200, progress_percent = 100) ---`);
    const res2 = await fetch(`${baseUrl}/api/submissions/missions/${missionId}/subtasks/${sub2}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: true })
    });
    const data2 = await res2.json();
    console.log(`Status: ${res2.status}`);
    console.log('Response:', JSON.stringify(data2, null, 2), '\n');

    // Test 3: Kiểm tra mission status đã chuyển sang in_progress chưa
    console.log(`--- TEST 3: Kiểm tra Mission status đã tự động chuyển in_progress chưa ---`);
    const res3 = await fetch(`${baseUrl}/api/missions?childId=${childId}`);
    const data3 = await res3.json();
    const updatedMission = data3.data?.find((m) => m._id === missionId);
    console.log(`Mission Status: ${updatedMission?.status} (Kỳ vọng: in_progress)\n`);

    // Test 4: Test subId không hợp lệ
    console.log(`--- TEST 4: PUT subtask với subId không hợp lệ (Kỳ vọng: 400) ---`);
    const res4 = await fetch(`${baseUrl}/api/submissions/missions/${missionId}/subtasks/invalid-id`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: true })
    });
    const data4 = await res4.json();
    console.log(`Status: ${res4.status}`);
    console.log('Response:', JSON.stringify(data4), '\n');

    // Test 5: Test subId không khớp mission
    console.log(`--- TEST 5: PUT subtask với subId không tồn tại trong mission (Kỳ vọng: 404) ---`);
    const dummySubId = '65f1a2b3c4d5e6f7a8b9c099';
    const res5 = await fetch(`${baseUrl}/api/submissions/missions/${missionId}/subtasks/${dummySubId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: true })
    });
    const data5 = await res5.json();
    console.log(`Status: ${res5.status}`);
    console.log('Response:', JSON.stringify(data5), '\n');
  }

  // Test 6: POST /api/submissions thiếu file ảnh (Kỳ vọng: 400)
  console.log(`--- TEST 6: POST /api/submissions thiếu file ảnh (Kỳ vọng: 400) ---`);
  const formData = new FormData();
  formData.append('mission_id', missionId);
  formData.append('child_id', childId);
  const res6 = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    body: formData
  });
  const data6 = await res6.json();
  console.log(`Status: ${res6.status}`);
  console.log('Response:', JSON.stringify(data6), '\n');

  // Test 7: POST /api/submissions với missionId không tồn tại
  console.log(`--- TEST 7: POST /api/submissions với missionId không tồn tại (Kỳ vọng: 404/Cloudinary handling) ---`);
  const dummyMissionId = '65f1a2b3c4d5e6f7a8b9c099';
  const formWithDummy = new FormData();
  formWithDummy.append('mission_id', dummyMissionId);
  formWithDummy.append('child_id', childId);
  // Tạo 1 blob ảnh mẫu giả lập
  const dummyImage = new Blob(['sample image data'], { type: 'image/png' });
  formWithDummy.append('proof_image', dummyImage, 'test.png');
  const res7 = await fetch(`${baseUrl}/api/submissions`, {
    method: 'POST',
    body: formWithDummy
  });
  const data7 = await res7.json();
  console.log(`Status: ${res7.status}`);
  console.log('Response:', JSON.stringify(data7), '\n');

  // Dọn dẹp mission test
  console.log('--- Dọn dẹp: Xóa mission test ---');
  await fetch(`${baseUrl}/api/missions/${missionId}`, { method: 'DELETE' });
  console.log('✅ Đã dọn dẹp sạch mission test!');
  console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ SUBMISSIONS HOÀN TẤT!');
}

runSubmissionTests().catch(console.error);
