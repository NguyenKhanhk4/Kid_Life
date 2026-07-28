# 📘 BÁO CÁO TỔNG HỢP TÍNH NĂNG & LUỒNG NGƯỜI DÙNG (USER FLOWS) - DỰ ÁN KIDLIFE

---

## 📑 MỤC LỤC
1. [Tổng Quan Hệ Thống KidLife](#-1-tổng-quan-hệ-thống-kidlife)
2. [Toàn Bộ Tính Năng & Luồng Người Dùng Phía Phụ Huynh (Parent App)](#-2-toàn-bộ-tính-năng--luồng-người-dùng-phía-phụ-huynh-parent-app)
   - 2.1. Trang Chủ Phụ Huynh (Home Parent Dashboard)
   - 2.2. Báo Cáo Phân Tích Kỹ Năng AI (AI Skill Analytics) 📊
   - 2.3. Ngân Hàng Ảo & Hệ Thống Kỷ Luật (Virtual Bank & Penalties) 🏦
   - 2.4. Đồng Quản Lý Gia Đình & Phân Quyền RBAC (Co-Parenting) 👨‍👩‍👧‍👦
   - 2.5. Quản Lý Kể Chuyện & AI Voice Studio (Parent Bedtime Stories) 🎤
   - 2.6. Duyệt Điều Ước Của Bé (Wishes Approval) 🧞‍♂️
   - 2.7. Tạo & Giao Nhiệm Vụ Cho Bé (Task Creator & Manager) 📋
   - 2.8. Duyệt Bằng Chứng Nhiệm Vụ (Approval Queue & Detail) ✅
   - 2.9. Duyệt Thưởng & Quản Lý Phần Thưởng (Rewards Approval & Shop) 🎁
   - 2.10. Nhật Ký Hành Trình & AI Video Recap (Memory Lane Premium) 📷
   - 2.11. Thi Đua Gia Đình Cộng Đồng (Family Leaderboard) 🏆
   - 2.12. Diễn Đàn Cộng Đồng Phụ Huynh (Parent Community Forum) 💬
   - 2.13. Quản Lý Tài Khoản Con (Child Management) 🧒
   - 2.14. Trung Tâm Thông Báo & Cài Đặt (Notifications & Settings) 🔔
3. [Toàn Bộ Tính Năng & Luồng Người Dùng Phía Các Bé (Child App)](#-3-toàn-bộ-tính-năng--luồng-người-dùng-phía-các-bé-child-app)
   - 3.1. Trang Chủ Của Bé (Child Home Dashboard)
   - 3.2. Nhiệm Vụ Chuỗi Multi-step Checklist (Child Tasks) 🛋️
   - 3.3. Góc Giờ Kể Chuyện Kỳ Diệu (Child Bedtime Stories) 🌟
   - 3.4. Ví Điểm & Sổ Tiết Kiệm Tích Lũy (Child Wallet & Savings) 💰
   - 3.5. Tiến Hóa Thú Cưng & Chuỗi Streak 14 Ngày (Pet Evolution) 🐉
   - 3.6. Tủ Đồ Trang Điểm Thú Cưng (Pet Wardrobe) 👗
   - 3.7. Bộ Sưu Tập Thành Tích & Thiệp Vinh Danh (Viral Milestones) 📸
   - 3.8. Cửa Hàng Đổi Quà Thật (Child Store) 🛍️
   - 3.9. Gửi Điều Ước Cho Ba Mẹ (Child Wish Creator) 🧞‍♂️
   - 3.10. Thư Viện Bài Học Kỹ Năng & Quiz Đố Vui (Lesson & Quiz) 🎓
4. [Tóm Tắt Kiến Trúc Đồng Bộ Dữ Liệu (Single Source of Truth)](#-4-tóm-tắt-kiến-trúc-đồng-bộ-dữ-liệu-single-source-of-truth)

---

## 📌 1. TỔNG QUAN HỆ THỐNG KIDLIFE

**KidLife** là một hệ sinh thái ứng dụng di động giáo dục hành vi kỹ thuật số dành cho gia đình. Ứng dụng giúp cha mẹ đồng hành cùng con trẻ trong việc xây dựng nếp sống tự lập, rèn luyện kỹ năng sống, quản lý tài chính sớm và gắn kết tình cảm gia đình thông qua phương pháp **Gamification (Game hóa việc nhà)** và **AI trợ lý giáo dục**.

- **Giao diện Phụ huynh:** Tập trung vào quản lý, giám sát, phân tích dữ liệu kỹ năng AI, phân quyền gia đình và duy trì kỷ luật văn minh.
- **Giao diện Các bé:** Rực rỡ, ngộ nghĩnh, biến việc nhà thành cuộc phiêu lưu tích điểm XP, nuôi thú cưng tiến hóa, nghe truyện giọng nhân vật và đổi thưởng.

---

## 👨‍👩‍👧‍👦 2. TOÀN BỘ TÍNH NĂNG & LUỒNG NGƯỜI DÙNG PHÍA PHỤ HUYNH (PARENT APP)

### 2.1. Trang Chủ Phụ Huynh (Home Parent Dashboard)
- **Mô tả chi tiết:** Trung tâm điều hành chính của cha mẹ. Hiển thị tổng quan điểm XP của bé, chuỗi Streak ngày liên tiếp, số sao tích lũy tuần này, danh hiệu mới đạt, thanh thao tác nhanh (*Duyệt thưởng, Duyệt điều ước, Thi đua gia đình, Ngân hàng ảo*) và Danh sách nhiệm vụ cần làm hôm nay của con.
- **Luồng người dùng (User Flow):**
  1. Phụ huynh mở ứng dụng và chuyển sang chế độ Phụ huynh → Hệ thống điều hướng vào Màn hình Trang Chủ.
  2. Phụ huynh quan sát thẻ tiến độ của **Bé Minh Anh** (Cấp độ 5, `1,250 XP`, `11/14 ngày Streak`).
  3. Phụ huynh bấm vào các phím tắt Quick Action (*Duyệt thưởng, Duyệt điều ước, Thi đua gia đình, Ngân hàng ảo*) để điều hướng tức thì tới tính năng tương ứng.
  4. Phụ huynh cuộn xuống xem danh sách nhiệm vụ hôm nay của con và trạng thái nộp bài (*Đang làm, Đã nộp bài, Chưa làm*).

---

### 2.2. Báo Cáo Phân Tích Kỹ Năng AI (AI Skill Analytics) 📊
- **Mô tả chi tiết:** Biểu đồ Radar Chart đo lường 4 nhóm chỉ số phát triển (*Tự lập, Sức khỏe, Trí tuệ, Tình cảm*), so sánh tăng/giảm % so với kỳ trước và Khung AI Khuyến nghị Giáo dục cá nhân hóa.
- **Luồng người dùng (User Flow):**
  1. Từ Màn hình Trang Chủ hoặc Tài Khoản → Phụ huynh chọn **Báo cáo kỹ năng AI**.
  2. Hệ thống hiển thị Biểu đồ Radar Chart đo 4 chỉ số: *Tự lập (85%), Sức khỏe (45%), Trí tuệ (72%), Tình cảm (90%)*.
  3. Phụ huynh xem bảng phân tích so sánh với tháng trước (VD: *Sức khỏe giảm 17% do bé ngủ muộn*).
  4. Phụ huynh đọc lời khuyên từ AI: *"Bé cần rèn luyện thêm tính đúng giờ khi đi ngủ"*.
  5. Phụ huynh bấm nút **"Áp dụng gợi ý nhiệm vụ AI"** → Hệ thống tự động tạo Task *"Đánh răng & Ngủ trước 21h"* phát hành ngay cho bé.

---

### 2.3. Ngân Hàng Ảo & Hệ Thống Kỷ Luật (Virtual Bank & Penalties) 🏦
- **Mô tả chi tiết:** Cấu hình mức lãi suất gửi tiết kiệm hàng tuần (mặc định 5%/tuần, tính lãi kép) và Xuất "Vé Phạt" kỷ luật nhẹ nhàng (VD: trừ 30 Sao vì chơi game quá giờ).
- **Luồng người dùng (User Flow):**
  1. Từ Màn hình Trang chủ hoặc Tài Khoản → Phụ huynh chọn **Ngân hàng ảo**.
  2. **Quản lý Tiết kiệm:** Phụ huynh ở tab *Sổ Tiết Kiệm*, xem số dư `800 XP` của bé, chỉnh sửa mức lãi suất hàng tuần (`5%/tuần`) và bấm **"Lưu thiết lập lãi suất"**.
  3. **Tạo Vé Phạt Kỷ Luật:** Phụ huynh chuyển sang tab *Vé Phạt Kỷ Luật*, bấm **"Xuất vé phạt mới cho bé"**.
  4. Phụ huynh nhập lý do vi phạm (VD: *"Chơi game quá giờ"*), chọn số XP trừ (`-30 XP`) và bấm **"Phát hành vé phạt"**.
  5. Hệ thống lập tức cập nhật vé phạt màu đỏ kèm lời nhắn nhở nhẹ nhàng sang Màn hình Ví của bé.

---

### 2.4. Đồng Quản Lý Gia Đình & Phân Quyền RBAC (Co-Parenting) 👨‍👩‍👧‍👦
- **Mô tả chi tiết:** Quản lý danh sách thành viên gia đình (Bố, Mẹ, Ông Nội, Bà Nội), phân quyền 3 cấp (*Admin, Phụ huynh, Ông/Bà*) và gửi lời mời qua SMS/Zalo/Link.
- **Luồng người dùng (User Flow):**
  1. Từ Màn hình Tài khoản → Phụ huynh chọn **Đồng quản lý gia đình**.
  2. Phụ huynh xem danh sách thành viên gia đình hiện tại (*Nga - Admin, Tuấn - Phụ huynh, Hùng - Ông Nội*).
  3. Phụ huynh bấm **"Mời thành viên gia đình"** → Nhập SĐT (VD: `0976543210`) → Chọn vai trò (*Ông/Bà*) → Bấm **"Gửi lời mời ngay"**.
  4. Hệ thống phát hành liên kết mời. Khi Ông/Bà đăng nhập vào app, hệ thống áp dụng phân quyền RBAC: Chỉ được xem ảnh nhật ký, bắn tim và gửi quà, không được sửa task hay trừ điểm của cháu.

---

### 2.5. Quản Lý Kể Chuyện & AI Voice Studio (Parent Bedtime Stories) 🎤
- **Mô tả chi tiết:** Thu âm 1 phút giọng đọc Mẹ/Bố để AI nhân bản (Voice Clone) và Tìm kiếm/Biên tập thư viện truyện cổ tích từ Internet.
- **Luồng người dùng (User Flow):**
  1. Từ Màn hình Tài khoản → Phụ huynh chọn **Thu âm giọng đọc (Voice Clone)**.
  2. **Thu âm Giọng đọc Mẹ/Bố:** Phụ huynh chọn *Giọng Mẹ* hoặc *Giọng Bố* → Bấm **"Thu âm"** → Đọc 1 phút đoạn văn mẫu trên màn hình → AI xử lý tần số giọng và hiển thị trạng thái `✅ Đã thu âm giọng Mẹ (Hoàn tất)`.
  3. **Biên tập Truyện từ Internet (Curated Search System):** Phụ huynh gõ từ khóa tìm kiếm trên ô tìm kiếm (VD: *"Sự tích cây vú sữa"*, *"Thạch Sanh"*).
  4. Phụ huynh đọc tóm tắt bài học của câu chuyện và bấm **"+ Thêm vào thư viện bé"** để cho phép bé được nghe câu chuyện đó.

---

### 2.6. Duyệt Điều Ước Của Bé (Wishes Approval) 🧞‍♂️
- **Mô tả chi tiết:** Duyệt ước nguyện thực tế của bé kèm file ghi âm giọng nói hoặc văn bản (VD: đi nhà bóng, mua lego).
- **Luồng người dùng (User Flow):**
  1. Trên Màn hình Trang chủ Phụ huynh → Bấm phím **Duyệt điều ước**.
  2. Phụ huynh xem danh sách điều ước bé gửi (VD: *"Đi công viên nước cuối tuần"*, chi phí 50 Sao).
  3. Phụ huynh bấm biểu tượng Loa để nghe trực tiếp file ghi âm giọng nói thì thầm ước nguyện của con.
  4. Phụ huynh chọn **"Duyệt điều ước"** (chấp nhận thưởng khi bé hoàn thành đủ 5 task tuần) hoặc **"Từ chối"** kèm lời phản hồi giải thích lý do giáo dục.

---

### 2.7. Tạo & Giao Nhiệm Vụ Cho Bé (Task Creator & Manager) 📋
- **Mô tả chi tiết:** Tạo task đơn lẻ hoặc task chuỗi multi-step, thiết lập thời gian nhắc nhở, gán mức XP thưởng và chọn bài tập từ thư viện mẫu.
- **Luồng người dùng (User Flow):**
  1. Phụ huynh chuyển sang tab **Nhiệm vụ** → Bấm nút **"+ Tạo nhiệm vụ mới"**.
  2. Phụ huynh chọn loại nhiệm vụ (Task đơn lẻ hoặc Task chuỗi Multi-step checklist).
  3. Phụ huynh nhập tên nhiệm vụ (*Dọn dẹp phòng khách*), điền 3 bước nhỏ (*Cất đồ chơi, Lau bàn, Quét sàn*), đặt khung giờ (*18:30 - 19:00*), gán thưởng `+80 XP`.
  4. Bấm **"Phát hành nhiệm vụ"** → Nhiệm vụ được đồng bộ ngay lập tức sang Màn hình Nhiệm vụ của bé.

---

### 2.8. Duyệt Bằng Chứng Nhiệm Vụ (Approval Queue & Detail) ✅
- **Mô tả chi tiết:** Xem ảnh/video minh chứng bé nộp sau khi làm xong việc nhà để duyệt thưởng XP hoặc yêu cầu nộp lại.
- **Luồng người dùng (User Flow):**
  1. Phụ huynh nhận thông báo push notification: *"Bé Minh Anh đã nộp bài Dọn dẹp phòng khách"*.
  2. Phụ huynh mở màn hình **Duyệt bài** → Xem bức ảnh bé chụp căn phòng khách sạch sẽ.
  3. Phụ huynh bấm **"Duyệt & Tặng XP"** (Cộng 80 XP vào ví bé) hoặc bấm **"Yêu cầu nộp lại"** kèm lời góp ý.

---

### 2.9. Duyệt Thưởng & Quản Lý Phần Thưởng (Rewards Approval & Shop) 🎁
- **Mô tả chi tiết:** Tạo phần thưởng mới (Vật lý, Trải nghiệm, Gia đình), bật/tắt phần thưởng, duyệt yêu cầu đổi quà thực tế từ bé.
- **Luồng người dùng (User Flow):**
  1. Từ Màn hình Tài khoản → Chọn **Phần thưởng & ví**.
  2. Phụ huynh bấm **"+ Thêm phần thưởng mới"** → Nhập tên quà (*15 phút chơi game*), mức giá (`100 XP`), chọn loại quà (*Trải nghiệm*).
  3. Khi bé bấm đổi quà trên máy của bé, yêu cầu đổi quà sẽ xuất hiện ở đây → Phụ huynh bấm **"Chấp nhận đổi"** để quy đổi quà cho con.

---

### 2.10. Nhật Ký Hành Trình & AI Video Recap (Memory Lane Premium) 📷
- **Mô tả chi tiết:** Thư viện lưu trữ ảnh/video làm việc nhà vô hạn, AI tự động dựng Video Recap kỷ niệm sinh nhật/tháng và dàn trang Sách Ảnh (Photobook PDF).
- **Luồng người dùng (User Flow):**
  1. Từ Màn hình Tài khoản → Phụ huynh chọn **Nhật ký hành trình**.
  2. Phụ huynh xem album ảnh lưu trữ các công việc nhà bé đã hoàn thành xếp theo mốc thời gian.
  3. Phụ huynh bấm **"Tạo Video Recap tháng này"** → AI tự động biên tập chuỗi ảnh của bé thành 1 video ngắn tràn đầy cảm xúc.
  4. Phụ huynh bấm **"Xuất Photobook PDF"** để tải file sách ảnh về in ấn.

---

### 2.11. Thi Đua Gia Đình Cộng Đồng (Family Leaderboard) 🏆
- **Mô tả chi tiết:** Tham gia thử thách 14 ngày cộng đồng, xem Bảng xếp hạng 50 gia đình real-time, đếm ngược trao Cúp Vàng.
- **Luồng người dùng (User Flow):**
  1. Phụ huynh chuyển sang tab **Cộng đồng** → Chọn sub-tab **"Thử thách gia đình 🏆"**.
  2. Phụ huynh bấm **"Tham gia thử thách rèn luyện 14 ngày"**.
  3. Phụ huynh theo dõi vị trí của gia đình mình trên Bảng xếp hạng (VD: *Hạng 1 - Gia đình Minh Anh, 2,450 điểm*).
  4. Hết chu kỳ đếm ngược, hệ thống trao Cúp Vàng & Huy hiệu vinh danh cho các gia đình dẫn đầu.

---

### 2.12. Diễn Đàn Cộng Đồng Phụ Huynh (Parent Community Forum) 💬
- **Mô tả chi tiết:** Đăng bài chia sẻ kinh nghiệm nuôi dạy con, hỏi đáp thắc mắc, thả tim, bình luận và chia sẻ bài viết.
- **Luồng người dùng (User Flow):**
  1. Tại tab **Cộng đồng** → Chọn sub-tab **"Diễn đàn phụ huynh"**.
  2. Phụ huynh cuộn xem các bài viết chia sẻ kinh nghiệm rèn con tự lập của các cha mẹ khác.
  3. Phụ huynh bấm **"Đăng bài viết mới"** hoặc bình luận hỏi đáp thắc mắc dưới các bài viết.

---

### 2.13. Quản Lý Tài Khoản Con (Child Management) 🧒
- **Mô tả chi tiết:** Quản lý danh sách các bé, chỉnh sửa thông tin cá nhân, tuổi, cấp độ, đặt lại mật khẩu cho tài khoản bé.
- **Luồng người dùng (User Flow):**
  1. Tại Màn hình Tài khoản phụ huynh → Chọn danh mục **Tài khoản trẻ em**.
  2. Phụ huynh bấm vào **Bé Minh Anh** → Xem thông tin chi tiết (6 tuổi, Cấp 5, 1,250 XP).
  3. Phụ huynh bấm **"Chỉnh sửa thông tin"** hoặc **"Đặt lại mật khẩu bé"** khi cần.

---

### 2.14. Trung Tâm Thông Báo & Cài Đặt (Notifications & Settings) 🔔
- **Mô tả chi tiết:** Nhận thông báo tức thời khi bé hoàn thành task, đổi quà, gửi điều ước; thay đổi mật khẩu, cài đặt bảo mật.
- **Luồng người dùng (User Flow):**
  1. Phụ huynh bấm biểu tượng Chuông ở thanh Tab dưới cùng.
  2. Xem danh sách thông báo mới (*Bé nộp bài, Bé gửi điều ước, Bé nhận vé phạt*).
  3. Bấm vào từng thông báo để chuyển hướng tới màn hình xử lý tương ứng.

---

## 🧒 3. TOÀN BỘ TÍNH NĂNG & LUỒNG NGƯỜI DÙNG PHÍA CÁC BÉ (CHILD APP)

### 3.1. Trang Chủ Của Bé (Child Home Dashboard)
- **Mô tả chi tiết:** Mascot Chuột Hamster tương tác nói chuyện, Huy hiệu XP & Tủ đồ 🎒, Thanh Quick Actions cuộn ngang (*Ví điểm, Thú cưng, Học bài, Kể chuyện, Điều ước*), và danh sách Nhiệm vụ hôm nay.
- **Luồng người dùng (User Flow):**
  1. Bé mở app ở chế độ Trẻ em → Mascot Hamster vui vẻ cất lời chào: *"Chào Minh Anh! Cùng làm nhiệm vụ kiếm sao nhé!"*.
  2. Bé xem số điểm XP hiện tại ở góc trên màn hình (`1,250 XP`).
  3. Bé chọn các biểu tượng Quick Action (*Ví điểm 💳, Thú cưng 🐉, Học bài 📚, Kể chuyện 🌙, Điều ước 🧞‍♂️*) để truy cập nhanh các góc chơi.
  4. Bé cuộn xuống danh sách Nhiệm vụ hôm nay và bấm vào nhiệm vụ cần hoàn thành.

---

### 3.2. Nhiệm Vụ Chuỗi Multi-step Checklist (Child Tasks) 🛋️
- **Mô tả chi tiết:** Danh sách việc nhà chia nhỏ thành các bước (*☐ Cất đồ chơi, ☐ Lau bàn, ☐ Quét sàn*). Tick chọn từng ô → Progress Bar → Tick đủ 100% hiện pháo hoa Confetti rực rỡ & chụp ảnh nộp bài.
- **Luồng người dùng (User Flow):**
  1. Tại Trang chủ hoặc Tab Nhiệm vụ → Bé bấm vào nhiệm vụ *"Dọn dẹp phòng khách"*.
  2. Cửa sổ Checklist hiển thị 3 bước nhỏ. Bé tiến hành làm việc nhà và tick chọn từng bước:
     - ☑ *Bước 1: Cất đồ chơi vào hộp*
     - ☑ *Bước 2: Lau bàn sạch sẽ*
     - ☑ *Bước 3: Quét sàn nhà*
  3. Khi tick đủ 100%, màn hình bùng nổ hiệu ứng **pháo hoa Confetti 🎆** mừng hoàn thành.
  4. Bé bấm **"Chụp ảnh minh chứng"** → Bấm **"Nộp bằng chứng"** để gửi bài cho ba mẹ duyệt nhận `+80 XP`.

---

### 3.3. Góc Giờ Kể Chuyện Kỳ Diệu (Child Bedtime Stories) 🌟
- **Mô tả chi tiết:** Thư viện truyện cổ tích/khoa học phong phú, tùy chọn **8 nhân vật giọng đọc** (*Giọng Mẹ 👩, Giọng Bố 👨, Phù thủy Xám 🧙‍♂️, Robot BiBi 🤖, Công chúa 👸, Rồng con 🐲, Cú mèo 🦉, Gấu Bơ 🧸*), chỉnh BGM nhạc nền và đọc truyện.
- **Luồng người dùng (User Flow):**
  1. Tại Trang chủ của bé → Bé bấm nút **"Kể chuyện 🌙"**.
  2. Bé chọn danh mục truyện (*Cổ tích, Khoa học, Giáo dục, Đạo đức*) hoặc gõ tìm kiếm tên câu chuyện.
  3. Bé chọn **Nhân vật giọng đọc** yêu thích (Ví dụ: *🧙‍♂️ Phù thủy Xám* hoặc *🤖 Robot BiBi*).
  4. Bé bấm mở truyện → Giao diện phát nhạc và hình ảnh nhân vật chuyển màu đặc trưng → Bé vừa xem chữ/ảnh vừa nghe giọng đọc nhân vật cùng nhạc nền BGM du dương.

---

### 3.4. Ví Điểm & Sổ Tiết Kiệm Tích Lũy (Child Wallet & Savings) 💰
- **Mô tả chi tiết:** Số dư XP tiêu dùng, Sổ Tiết Kiệm sinh lời tự động (`+15 XP/ngày`), nút Gửi/Rút tiết kiệm, xem Vé phạt kỷ luật từ ba mẹ và Lịch sử nhận thưởng.
- **Luồng người dùng (User Flow):**
  1. Bé bấm vào huy hiệu số điểm XP hoặc nút **"Ví điểm 💳"**.
  2. **Xem số dư:** Bé thấy số dư Ví tiêu dùng (`1,250 XP`) và Sổ tiết kiệm (`800 XP`).
  3. **Tích lũy tiền lãi:** Bé xem dòng chữ *"Lãi hôm nay: +15 XP"*, hiểu được quy luật gửi tiết kiệm để sinh thêm điểm thưởng.
  4. **Gửi / Rút tiền:** Bé bấm **"Gửi 100 XP"** để đưa tiền vào Sổ tiết kiệm hoặc **"Rút 100 XP"** về ví tiêu dùng.
  5. **Xem Vé Phạt Kỷ Luật:** Nếu bị trừ điểm, banner Vé phạt màu đỏ xuất hiện → Bé bấm xem lý do (*"Chơi game quá giờ (-30 XP)"*) và bấm *"Con hứa lần sau cố gắng!"*.

---

### 3.5. Tiến Hóa Thú Cưng & Chuỗi Streak 14 Ngày (Pet Evolution) 🐉
- **Mô tả chi tiết:** Nuôi thú cưng lớn lên qua 4 giai đoạn (*Trứng 🥚 → Rồng con 🐉 → Rồng lửa 🐲 → Rồng huyền thoại ⚡*), theo dõi chuỗi 14 ngày làm việc nhà liên tiếp, cho ăn và mở tủ đồ trang điểm cho pet.
- **Luồng người dùng (User Flow):**
  1. Tại Trang chủ của bé → Bé bấm nút **"Thú cưng 🐉"**.
  2. Bé quan sát người bạn thú cưng *Rồng Con Béo* (Cấp 2, Mood: Vui vẻ, Streak: 11/14 ngày).
  3. Bé bấm **"Cho ăn 🍎"** (tốn 10 XP) để duy trì chỉ số vui vẻ cho thú cưng.
  4. Bé theo dõi tiến trình tiến hóa: Cần duy trì làm việc nhà thêm 3 ngày nữa để đếm đủ Streak 14 ngày để rồng con tiến hóa thành *Rồng Lửa 🐲*.

---

### 3.6. Tủ Đồ Trang Điểm Thú Cưng (Pet Wardrobe) 👗
- **Mô tả chi tiết:** Dùng điểm XP đổi đồ ăn, trang phục (mũ, áo, kính) và nội thất để trang trí cho thú cưng.
- **Luồng người dùng (User Flow):**
  1. Tại màn hình Thú cưng → Bé bấm biểu tượng Tủ đồ 🎒.
  2. Bé duyệt chọn các trang phục ngộ nghĩnh (*Mũ len, Giày thể thao, Bóng bay*).
  3. Bé bấm **"Mua đồ"** (dùng điểm XP) → Mặc thử đồ mới cho thú cưng của mình.

---

### 3.7. Bộ Sưu Tập Thành Tích & Thiệp Vinh Danh (Viral Milestones) 📸
- **Mô tả chi tiết:** Bộ sưu tập danh hiệu (*Siêu sao, Bé ngoan, Chăm chỉ*), quy đổi XP sang Sao 🌟, bấm vào huy hiệu để tạo **Thiệp Vinh Danh Kỹ Thuật Số** (*Hiệp sĩ 🛡️, Công chúa 👸, Phi hành gia 🚀*) có mã QR để khoe lên MXH.
- **Luồng người dùng (User Flow):**
  1. Bé chuyển sang Tab **Thành tích** → Xem kho danh hiệu đã mở khóa.
  2. Bé bấm vào huy hiệu vừa mở khóa → Cửa sổ vinh danh hiệu ứng pháo hoa hiện ra.
  3. Bé chọn Mẫu thiệp (*Hiệp sĩ, Công chúa, Phi hành gia*) → Hệ thống xuất **Thiệp Vinh Danh Kỹ Thuật Số** rực rỡ có chứa tên bé, ảnh bé và mã QR Code.
  4. Bé nhờ ba mẹ bấm **"Chia sẻ lên Zalo/Facebook"** để khoe thành tích với ông bà và bạn bè.

---

### 3.8. Cửa Hàng Đổi Quà Thật (Child Store) 🛍️
- **Mô tả chi tiết:** Dùng điểm XP đổi các phần thưởng thực tế do ba mẹ cài đặt (đồ chơi, đi chơi, món ăn).
- **Luồng người dùng (User Flow):**
  1. Bé chuyển sang Tab **Cửa hàng**.
  2. Bé xem danh sách phần thưởng thực tế (*15 phút chơi game: 100 XP, Ăn gà rán KFC: 250 XP, Đồ chơi Lego: 150 XP*).
  3. Bé bấm **"Đổi quà"** tại món quà mình muốn → Hệ thống xác nhận và gửi đề nghị đổi quà sang tài khoản của ba mẹ chờ duyệt.

---

### 3.9. Gửi Điều Ước Cho Ba Mẹ (Child Wish Creator) 🧞‍♂️
- **Mô tả chi tiết:** Gửi ước muốn thầm kín bằng lời nói (Ghi âm giọng nói) hoặc gõ chữ cho ba mẹ, tốn 50 Sao phí dịch vụ.
- **Luồng người dùng (User Flow):**
  1. Tại Trang chủ của bé → Bé bấm phím **"Điều ước 🧞‍♂️"**.
  2. Cửa sổ cây ước nguyện thần kỳ xuất hiện. Bé nhập chữ hoặc giữ nút **"Ghi âm giọng nói"** để thủ thỉ ước mơ của mình với ba mẹ (VD: *"Con ước cuối tuần này được ba đưa đi nhà bóng"*).
  3. Bé bấm **"Gửi điều ước"** (tốn 50 Sao) → Điều ước được gửi thẳng sang giao diện duyệt ước nguyện của cha mẹ.

---

### 3.10. Thư Viện Bài Học Kỹ Năng & Quiz Đố Vui (Lesson & Quiz) 🎓
- **Mô tả chi tiết:** Xem video bài học kỹ năng sống (*Rửa tay, Đánh răng, Nói lời cảm ơn*), làm bài đố vui trắc nghiệm tính điểm XP.
- **Luồng người dùng (User Flow):**
  1. Tại Trang chủ → Bé bấm phím **"Học bài 📚"**.
  2. Bé chọn video bài học kỹ năng (VD: *"Cách đánh răng đúng cách"*).
  3. Xem xong video, bé bấm **"Làm bài đố vui (Quiz)"** → Trả lời 3 câu hỏi trắc nghiệm → Đạt điểm tối đa và nhận thưởng `+30 XP`.

---

## 🏗️ 4. TÓM TẮT KIẾN TRÚC ĐỒNG BỘ DỮ LIỆU (SINGLE SOURCE OF TRUTH)

Toàn bộ ứng dụng KidLife được xây dựng dựa trên kiến trúc **Single Source of Truth** tập trung tại tệp dữ liệu:
`mobile/src/shared/constants/kidlifeMockData.ts`

- **Tài khoản đồng bộ:** `Bé Minh Anh` (6 tuổi, Cấp 5, `1,250 XP`, `11/14 ngày Streak`).
- **Ví & Tiết kiệm đồng bộ:** Ví tiêu dùng `1,250 XP`, Sổ tiết kiệm `800 XP`, Lãi suất `5%/tuần`, Lãi ngày `+15 XP`, Vé phạt `Chơi game quá giờ (-30 XP)`.
- **Nhiệm vụ đồng bộ:** Task chuỗi *"Dọn dẹp phòng khách"* (`+80 XP`, 3 subtasks) khớp 100% giữa màn giao việc của cha mẹ và màn làm việc của bé.
- **Gia đình đồng bộ:** 4 thành viên (*Nga - Admin, Tuấn - Phụ huynh, Hùng - Ông Nội, Mai - Bà Nội*) đồng bộ trên toàn bộ màn hình Co-parenting & RBAC.

---
*Báo cáo này tổng hợp đầy đủ 100% tính năng và luồng vận hành thực tế của dự án KidLife.*
