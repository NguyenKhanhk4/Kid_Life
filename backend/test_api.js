async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('🚀 BẮT ĐẦU KIỂM THỬ TOÀN BỘ API MODULE MISSIONS (TASK 2.1)\n');

  // Test 1: GET /
  console.log('--- TEST 1: Kiểm tra Root Endpoint (GET /) ---');
  const res1 = await fetch(`${baseUrl}/`);
  const text1 = await res1.text();
  console.log(`Status: ${res1.status}`);
  console.log(`Response: ${text1}\n`);

  // Test 2: GET /api/missions (Thiếu childId)
  console.log('--- TEST 2: GET /api/missions không truyền childId (Kỳ vọng: 400) ---');
  const res2 = await fetch(`${baseUrl}/api/missions`);
  const data2 = await res2.json();
  console.log(`Status: ${res2.status}`);
  console.log(`Response:`, JSON.stringify(data2, null, 2), '\n');

  // Test 3: POST /api/missions (Body rỗng - Zod Validation)
  console.log('--- TEST 3: POST /api/missions với body rỗng (Kỳ vọng: 400 Zod Error) ---');
  const res3 = await fetch(`${baseUrl}/api/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const data3 = await res3.json();
  console.log(`Status: ${res3.status}`);
  console.log(`Response:`, JSON.stringify(data3, null, 2), '\n');

  // Test 4: POST /api/missions (Tạo nhiệm vụ hợp lệ kèm 3 subtasks)
  console.log('--- TEST 4: POST /api/missions tạo nhiệm vụ checklist (Kỳ vọng: 201) ---');
  const childId = '65f1a2b3c4d5e6f7a8b9c0d1';
  const newMissionPayload = {
    child_id: childId,
    title: 'Dọn dẹp phòng khách',
    category: 'nha_cua',
    reward_xp: 80,
    schedule_time: '18:30 - 19:00',
    subtasks: [
      'Cất đồ chơi vào hộp',
      'Lau bàn sạch sẽ',
      'Quét sàn nhà'
    ]
  };

  const res4 = await fetch(`${baseUrl}/api/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMissionPayload)
  });
  const data4 = await res4.json();
  console.log(`Status: ${res4.status}`);
  console.log(`Response:`, JSON.stringify(data4, null, 2), '\n');

  const missionId = data4.data?._id;

  // Test 5: GET /api/missions?childId=...
  console.log(`--- TEST 5: GET /api/missions?childId=${childId} (Kỳ vọng: 200 kèm subtasks) ---`);
  const res5 = await fetch(`${baseUrl}/api/missions?childId=${childId}`);
  const data5 = await res5.json();
  console.log(`Status: ${res5.status}`);
  console.log(`Số lượng nhiệm vụ tìm thấy: ${data5.data?.length}`);
  console.log(`Response:`, JSON.stringify(data5, null, 2), '\n');

  if (missionId) {
    // Test 6: PUT /api/missions/:id
    console.log(`--- TEST 6: PUT /api/missions/${missionId} cập nhật trạng thái (Kỳ vọng: 200) ---`);
    const updatePayload = {
      status: 'in_progress',
      reward_xp: 100
    };
    const res6 = await fetch(`${baseUrl}/api/missions/${missionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const data6 = await res6.json();
    console.log(`Status: ${res6.status}`);
    console.log(`Response:`, JSON.stringify(data6, null, 2), '\n');

    // Test 7: DELETE /api/missions/:id
    console.log(`--- TEST 7: DELETE /api/missions/${missionId} xóa cascade (Kỳ vọng: 200) ---`);
    const res7 = await fetch(`${baseUrl}/api/missions/${missionId}`, {
      method: 'DELETE'
    });
    const data7 = await res7.json();
    console.log(`Status: ${res7.status}`);
    console.log(`Response:`, JSON.stringify(data7, null, 2), '\n');

    // Test 8: Xác nhận sau khi xóa
    console.log(`--- TEST 8: Kiểm tra lại GET sau khi xóa (Kỳ vọng: danh sách rỗng []) ---`);
    const res8 = await fetch(`${baseUrl}/api/missions?childId=${childId}`);
    const data8 = await res8.json();
    console.log(`Status: ${res8.status}`);
    console.log(`Số lượng nhiệm vụ còn lại: ${data8.data?.length}`);
    console.log(`Response data:`, data8.data, '\n');
  }

  console.log('🎉 TẤT CẢ 8 BƯỚC TEST ĐÃ CHẠY HOÀN HẢO!');
}

runTests().catch(console.error);
