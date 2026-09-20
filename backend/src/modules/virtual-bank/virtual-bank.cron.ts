// Chạy processInterest lúc 00:01 AM mỗi ngày
function scheduleDailyInterest(
  processInterestFn: () => Promise<{ accounts_processed: number; total_interest_paid: number }>
) {
  const checkAndRun = async () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 1) {
      console.log('⏰ CronJob: Bắt đầu tính lãi suất hàng ngày...');
      try {
        const result = await processInterestFn();
        console.log(
          `✅ CronJob: Đã tính lãi cho ${result.accounts_processed} tài khoản, tổng ${result.total_interest_paid} XP`
        );
      } catch (error) {
        console.error('❌ CronJob lỗi tính lãi:', error);
      }
    }
  };
  // Kiểm tra mỗi 60 giây
  setInterval(checkAndRun, 60 * 1000);
  console.log('✅ Daily interest CronJob đã được khởi động');
}

export default scheduleDailyInterest;
