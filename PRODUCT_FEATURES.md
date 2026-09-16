# Phân Tích Tính Năng Mới Cần Phát Triển (Freemium)

Tài liệu này tập trung mô tả **cực kỳ chi tiết** các tính năng **CHƯA CÓ TRONG DỰ ÁN** (những tính năng cần được lập trình thêm). Các tính năng được phân tích theo "Luồng người dùng (User Flow)" và "Chi tiết kỹ thuật" để đội ngũ phát triển dễ dàng hình dung và triển khai, đồng thời phân loại vào gói **Tài khoản Thường (Free Tier)** và **Tài khoản Premium (Paid Tier)**.

---

## 1. Các Tính Năng Mới Dành Cho Gói Thường (Free Tier)
*Mục đích: Xây dựng phiên bản cơ bản để người dùng "nếm thử" giá trị, đồng thời tích hợp các tính năng Growth Hacking (tăng trưởng) để lan truyền ứng dụng miễn phí ra cộng đồng.*

### 1.1. Chia sẻ Thành tựu lên Mạng xã hội (Viral Milestones) 📸
- **Mô tả chi tiết:** Khi bé đạt được cột mốc quan trọng (Ví dụ: Giữ chuỗi 30 ngày tự giác đánh răng, Đạt 1000 Sao, Đạt huy hiệu "Em bé gọn gàng"), ứng dụng sẽ tạo ra một tấm thiệp kỹ thuật số tuyệt đẹp vinh danh thành tích của bé.
- **Luồng người dùng (User Flow):** Bé hoàn thành task -> App hiển thị Popup pháo hoa chúc mừng -> Nút Call-to-action "Khoe ngay với ông bà/bạn bè" -> Phụ huynh bấm vào -> Chọn mẫu thiệp (Hiệp sĩ, Công chúa, Phi hành gia) -> Share thẳng lên Facebook/Instagram/Zalo.
- **Chi tiết kỹ thuật:** Hệ thống tự động Render ảnh thiệp có gắn Tên của bé, Hình Avatar của bé, Logo KidLife và một **Mã QR Code** nhỏ ở góc. 
- **Lý do ở gói Free:** Đánh mạnh vào tâm lý tự hào, thích "khoe" sự tự lập của con. Bạn bè của phụ huynh trên MXH khi thấy thiệp sẽ quét mã QR để tải app. Đây là cỗ máy thu hút người dùng mới (User Acquisition) hoàn toàn miễn phí.

### 1.2. Thử thách Thi đua Gia đình (Family Leaderboards) 🏆
- **Mô tả chi tiết:** Các sự kiện cộng đồng được tổ chức định kỳ (Weekly/Monthly) để các gia đình (hoặc các bé) tham gia đua top.
- **Luồng người dùng (User Flow):** Phụ huynh vào tab "Cộng đồng" -> Chọn tham gia "Thử thách 14 ngày làm việc nhà không cần nhắc" -> Hệ thống tạo một bảng xếp hạng (Leaderboard) ảo gồm 50 gia đình ngẫu nhiên -> Hằng ngày các bé làm task để tích lũy điểm sự kiện -> Kết thúc sự kiện trao "Cúp Vàng" ảo.
- **Chi tiết kỹ thuật:** Cần xây dựng hệ thống tính điểm theo thời gian thực (Real-time Leaderboard). Cần cơ chế ghép phòng (Matchmaking) để nhóm các bé có cùng độ tuổi vào thi đấu với nhau cho công bằng.
- **Lý do ở gói Free:** Tạo động lực ganh đua, kích thích trẻ em đòi bố mẹ mở app mỗi ngày (tăng cực mạnh chỉ số Retention Rate - Tỷ lệ giữ chân). Thu phí tính năng này sẽ làm giảm lượng người tham gia, mất đi sự sôi nổi.

### 1.3. Nhật Ký Hành Trình (Memory Lane) - Bản Tiêu Chuẩn
- **Mô tả chi tiết:** Tính năng lưu giữ hình ảnh minh chứng làm việc nhà của bé.
- **Giới hạn chức năng (Paywall):**
  - Lưu trữ Cloud bị khóa cứng ở mức: **Tối đa 50 bức ảnh** hoặc video siêu ngắn (dưới 10 giây). Hết dung lượng phải xóa ảnh cũ đi mới lưu được ảnh mới.
  - Giao diện dạng danh sách cuộn dọc cơ bản, không có công cụ tìm kiếm, lọc theo ngày tháng hay tạo Album.





---

## 2. Các Tính Năng Mới Dành Cho Gói Premium (Paid Tier)
*Mục đích: "Bức tường phí" (Paywall) cung cấp các công cụ mạnh mẽ nhất đánh thẳng vào 3 "nỗi đau" lớn nhất: Muốn lưu giữ kỷ niệm tuổi thơ không bao giờ quay lại, muốn có chuyên gia giáo dục đồng hành, và muốn nhàn nhã trong việc dạy con bằng công nghệ.*

### 2.1. Báo cáo Phân tích Kỹ năng AI (AI Skill Analytics) 📊
- **Mô tả chi tiết:** Biến KidLife từ một công cụ "nhắc việc/tick box" đơn thuần thành một chuyên gia phân tích tâm lý và sự phát triển của con.
- **Luồng người dùng & Hiển thị:** 
  - Cuối mỗi tháng, phụ huynh nhận thông báo: *"Báo cáo phát triển tháng 10 của bé Bi đã sẵn sàng!"*.
  - Giao diện hiển thị một **Biểu đồ Radar (Radar Chart)** đo lường 4 chỉ số cốt lõi: *Tự lập* (làm việc cá nhân), *Sức khỏe* (tập thể dục/ngủ sớm), *Trí tuệ* (làm bài tập), *Tình cảm* (giúp đỡ gia đình).
  - Khung "AI Khuyến nghị": *"Tháng này bé Bi phát triển mạnh sự Tự lập, nhưng chỉ số Sức khỏe giảm. Khuyến nghị: Tháng tới hãy giao thêm các Nhiệm vụ như 'Chạy bộ 15 phút' hoặc 'Ngủ trước 10h tối'."*
- **Chi tiết kỹ thuật:** Cần chuẩn hóa hệ thống Tag (Gắn thẻ) cho mỗi Task (VD: Task Quét nhà gắn thẻ 'Tự lập'). Dùng AI xử lý dữ liệu hoàn thành Task hằng ngày để viết ra lời phân tích tự nhiên như con người.

### 2.2. Ngân Hàng Ảo & Hệ Thống Kỷ Luật (Virtual Bank & Penalties)
- **Mô tả chi tiết:** Nâng cấp Ví tiền thành hệ thống giáo dục tài chính sớm.
- **Chi tiết kỹ thuật:**
  - **Sổ Tiết Kiệm & Lãi Suất (Interest Rate):** Bé không tiêu tiền ngay mà chuyển vào "Sổ tiết kiệm". Phụ huynh cài đặt lãi suất (VD: sinh lời 5% mỗi tuần lễ). App có Animation đếm tiền lãi nhảy lên mỗi ngày để dạy trẻ về "Lãi kép" (Compound Interest) và sự kiên nhẫn.
  - **Hệ Thống Phạt (Penalties):** Khi bé hư (ví dụ: Không đánh răng), phụ huynh có thể xuất 1 "Vé Phạt". Trẻ sẽ nhận được thông báo *"Bạn bị trừ 50 Sao vì tội Không đánh răng"*. Vé phạt có thiết kế đồ họa vui nhộn để răn đe nhưng không gây tổn thương tâm lý trẻ.

### 2.3. Nhật Ký Hành Trình (Memory Lane) - Bản Cao Cấp 💖
- **Mô tả chi tiết:** Cuốn Album điện tử vô giá không bao giờ mất của gia đình.
- **Chi tiết kỹ thuật:**
  - **Lưu trữ Vô Hạn:** Cloud storage (như AWS S3) không giới hạn hình ảnh và video chất lượng gốc (Full HD).
  - **AI Video Recap tự động:** Đúng 0h ngày sinh nhật bé, hệ thống âm thầm gom các đoạn clip bé làm việc nhà chăm chỉ nhất trong năm, ghép BGM (nhạc nền) cảm động và hiệu ứng chuyển cảnh để xuất ra 1 video gửi tặng phụ huynh.
  - **Xuất Sách Ảnh (Photobook):** Phụ huynh bấm 1 nút, hệ thống dàn trang PDF toàn bộ hình ảnh và caption trong 1 năm thành định dạng Tạp chí. Phụ huynh tải về để đem ra tiệm in, hoặc app liên kết thẳng với bên thứ 3 (đơn vị in ấn) giao sách tới tận nhà.

### 2.4. Giờ Kể Chuyện (Bedtime Stories) - Bản Cao Cấp 🌟 (Voice Cloning)
- **Mô tả chi tiết:** Thư viện truyện cổ tích, bài học đạo đức khổng lồ được tổng hợp từ internet, kết hợp giọng đọc của chính phụ huynh.
- **Luồng người dùng & Kỹ thuật:**
  - **Kho tàng truyện khổng lồ:** Truy cập không giới hạn vào thư viện hàng ngàn câu chuyện được phân loại chi tiết theo chủ đề (giáo dục, cổ tích, khoa học) và độ tuổi. Tính năng tìm kiếm thông minh giúp phụ huynh dễ dàng chọn truyện theo bài học muốn dạy bé.
  - **Voice Cloning (Vũ khí bí mật chốt sale):** Lần đầu sử dụng, Phụ huynh đọc 1 đoạn văn mẫu dài 1 phút. Hệ thống dùng API (như ElevenLabs) để Clone (nhân bản) giọng nói. Từ ngày hôm sau, bé bấm mở app là sẽ nghe các truyện cổ tích có sẵn bằng **chính giọng nói của Bố/Mẹ**, có kèm cả nhạc nền (BGM) du dương. Rất tuyệt vời cho những đêm bố mẹ phải đi làm ca đêm hoặc đi công tác xa.



### 2.6. Mở Rộng Gia Đình & Đồng Quản Lý (Co-Parenting)
- **Mô tả chi tiết:** Mở khóa mọi giới hạn kết nối của gia đình lớn.
- **Chi tiết kỹ thuật:** Thêm không giới hạn Trẻ em. Tính năng Multi-tenant Role-based Access Control (RBAC): Người tạo tài khoản là Admin (Master Parent), có thể gửi link/SMS mời Vợ/Chồng tham gia. Có thể mời Ông/Bà vào với quyền (Role) chỉ được xem hình ảnh và tặng quà, chứ không được sửa task.

### 2.7. Nhiệm Vụ Chuỗi & Tiến Hóa Thú Cưng (Multi-step & Pet Evolution)
- **Mô tả chi tiết:** Nâng cấp độ khó (Hard Mode) cho các bé lớn tuổi và mở rộng hệ thống Gamification.
- **Chi tiết kỹ thuật:**
  - **Nhiệm vụ Checklist (Multi-step):** Task lớn chia thành nhiều Task nhỏ. VD: Task "Dọn phòng khách" hiện ra 3 ô checkbox (Cất đồ chơi, Lau bàn, Quét sàn). Trẻ phải tick đủ 3 ô mới được tính là Hoàn thành.
  - **Tiến hóa Thú cưng (Pet Evolution):** Thú cưng (Pet) không chỉ ăn uống mà có các giai đoạn lớn lên (Ví dụ: Từ Trứng -> Rồng con -> Rồng lửa). Tuy nhiên để tiến hóa, bé phải giữ chuỗi (Streak) làm việc nhà 14 ngày liên tiếp không đứt đoạn. Nếu lười biếng, thú cưng có thể bị ốm hoặc tụt cấp độ.
