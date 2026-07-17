# TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ DỰ ÁN KIDLIFE

> **Business Analysis & System Analysis Document**
> Nền tảng hỗ trợ phụ huynh giúp trẻ 4–10 tuổi xây dựng thói quen tốt và kỹ năng sống.

---

## THÔNG TIN TÀI LIỆU

| Mục | Nội dung |
|-----|----------|
| **Tên dự án** | KidLife |
| **Loại tài liệu** | Business Analysis & System Analysis (BA/SA Document) |
| **Phiên bản** | 1.0 |
| **Ngày lập** | 09/07/2026 |
| **Người thực hiện** | Nhóm 3 – EXE101_SE1949 |
| **Vai trò tài liệu** | Chuẩn hóa nghiệp vụ trước khi thiết kế Database, API và phát triển Frontend/Backend |
| **Công nghệ** | ReactJS · Node.js/ExpressJS · MongoDB · JWT · AI Service · Cloud Storage · Push Notification · Payment Gateway |

### Cấu trúc tài liệu

Tài liệu được tổ chức theo 5 giai đoạn phân tích tuần tự, gồm 28 mục:

| Giai đoạn | Nội dung | Mục |
|-----------|----------|-----|
| **Giai đoạn 1** | Product Analysis | 1–3 |
| **Giai đoạn 2** | Business Analysis | 4–10 |
| **Giai đoạn 3** | System Analysis | 11–16 |
| **Giai đoạn 4** | Database Analysis | 17–20 |
| **Giai đoạn 5** | Technical Analysis | 21–28 |

### Quy ước ký hiệu

| Ký hiệu | Ý nghĩa |
|---------|---------|
| FR-xxx | Functional Requirement (yêu cầu chức năng) |
| NFR-xxx | Non-functional Requirement (yêu cầu phi chức năng) |
| BR-xxx | Business Rule (quy tắc nghiệp vụ) |
| UC-xxx | Use Case |
| C / R / U / D | Create / Read / Update / Delete |
| ✅ | Được phép / Có quyền |
| ❌ | Không được phép / Không có quyền |
| 🔶 | Được phép có điều kiện |

---

# GIAI ĐOẠN 1. PRODUCT ANALYSIS

## 1. Product Vision

### 1.1. Giới thiệu sản phẩm

**KidLife** là một nền tảng công nghệ giáo dục (EdTech) dành cho gia đình, hỗ trợ **phụ huynh đồng hành cùng con trong độ tuổi 4–10** để xây dựng thói quen tốt và phát triển kỹ năng sống thông qua trải nghiệm học tập được trò chơi hóa (Gamification).

Thay vì để trẻ tiếp xúc thụ động với nội dung số, KidLife biến quá trình rèn luyện kỹ năng sống thành một hành trình có mục tiêu rõ ràng: trẻ học các bài học ngắn, thực hiện **nhiệm vụ hằng ngày** trong đời thực (đánh răng, dọn đồ chơi, chào hỏi lễ phép…), nộp bằng chứng (ảnh/video), được **AI hỗ trợ xác minh** và **phụ huynh phê duyệt**, sau đó nhận **phần thưởng ảo** (điểm, huy hiệu, chăm sóc thú cưng ảo). Chuyên gia (Expert) cung cấp nội dung giáo dục chất lượng, còn Admin vận hành và kiểm duyệt toàn hệ thống.

KidLife định vị là "người bạn đồng hành nuôi dạy con" — kết hợp **giáo dục kỹ năng sống**, **cơ chế tạo động lực bằng game**, và **sự giám sát an toàn của phụ huynh** trong một sản phẩm duy nhất.

### 1.2. Vấn đề giải quyết

| # | Vấn đề của người dùng | Cách KidLife giải quyết |
|---|------------------------|--------------------------|
| 1 | Phụ huynh bận rộn, khó theo sát và duy trì việc rèn thói quen cho con mỗi ngày | Hệ thống nhiệm vụ hằng ngày tự động, nhắc nhở qua thông báo, dashboard theo dõi tiến độ |
| 2 | Trẻ thiếu động lực, dễ chán khi rèn kỹ năng theo cách truyền thống | Gamification: điểm thưởng, huy hiệu, thú cưng ảo, cấp độ (level) tạo hứng thú lâu dài |
| 3 | Nội dung dạy kỹ năng sống trên mạng rời rạc, không phù hợp lứa tuổi, thiếu kiểm chứng | Nội dung do Expert biên soạn, được Admin kiểm duyệt, phân loại theo độ tuổi và kỹ năng |
| 4 | Khó xác minh trẻ có thực sự hoàn thành nhiệm vụ ngoài đời hay không | AI hỗ trợ xác minh bằng chứng (ảnh/video) + phụ huynh phê duyệt cuối cùng (Parent Override) |
| 5 | Lo ngại an toàn khi trẻ nhỏ dùng thiết bị/ứng dụng | Trẻ đăng nhập qua tài khoản do phụ huynh quản lý, không thu thập dữ liệu nhạy cảm, môi trường khép kín |
| 6 | Thiếu công cụ đo lường sự tiến bộ của trẻ theo thời gian | Báo cáo, thống kê tiến độ theo kỹ năng, lịch sử hoàn thành nhiệm vụ |

### 1.3. Khách hàng mục tiêu

| Nhóm | Mô tả | Đặc điểm |
|------|-------|----------|
| **Khách hàng chính (người trả tiền)** | Phụ huynh có con 4–10 tuổi | 28–45 tuổi, quan tâm giáo dục sớm, sẵn sàng chi trả cho công cụ nuôi dạy con, có smartphone |
| **Người dùng cuối (thụ hưởng)** | Trẻ em 4–10 tuổi | Chưa hoặc mới biết đọc, thích trò chơi, hình ảnh sinh động, cần được giám sát khi dùng thiết bị |
| **Đối tác nội dung** | Chuyên gia giáo dục, tâm lý, kỹ năng sống | Cung cấp bài học, quiz, nhiệm vụ mẫu; xây dựng uy tín cá nhân/thu nhập |
| **Phân khúc mở rộng (tương lai)** | Trường mầm non, tiểu học, trung tâm kỹ năng | Sử dụng bản doanh nghiệp để quản lý lớp học |

### 1.4. Giá trị cốt lõi

Toàn bộ sản phẩm KidLife xoay quanh bốn giá trị cốt lõi:

- **An toàn (Safety-first):** Mọi hoạt động của trẻ đều nằm dưới sự giám sát và quyền phê duyệt của phụ huynh; dữ liệu trẻ em được bảo vệ nghiêm ngặt.
- **Tạo động lực (Motivation by design):** Cơ chế game hóa được thiết kế có chủ đích để duy trì thói quen tích cực chứ không gây nghiện thiết bị.
- **Nội dung đáng tin cậy (Trusted content):** Bài học do chuyên gia biên soạn và được kiểm duyệt, phù hợp khoa học phát triển trẻ em.
- **Đồng hành (Parent–child bonding):** Sản phẩm kéo phụ huynh vào hành trình cùng con thay vì thay thế vai trò của phụ huynh.

### 1.5. Giá trị khác biệt (Unique Value Proposition)

| Yếu tố khác biệt | KidLife | Sản phẩm thông thường |
|-------------------|---------|------------------------|
| Đối tượng rèn luyện | Kỹ năng sống & thói quen **ngoài đời thực** | Chủ yếu kiến thức trên màn hình |
| Xác minh hoàn thành | **AI + Phụ huynh phê duyệt** bằng chứng thực tế | Tự khai báo, không kiểm chứng |
| Vai trò phụ huynh | Trung tâm điều phối, có quyền override | Bị động hoặc chỉ xem báo cáo |
| Nguồn nội dung | Hệ sinh thái **Expert** được kiểm duyệt | Nội dung tự tạo hoặc mua sẵn |
| Cơ chế động lực | Thú cưng ảo + ví điểm + huy hiệu gắn với hành vi thực | Điểm số đơn thuần |

> **Tuyên bố khác biệt:** *KidLife là nền tảng duy nhất biến việc rèn kỹ năng sống ngoài đời thực của trẻ thành một trò chơi có kiểm chứng bằng AI và được phụ huynh đồng hành phê duyệt.*

### 1.6. Mục tiêu sản phẩm

- Trở thành công cụ đồng hành nuôi dạy con được phụ huynh Việt tin dùng cho nhóm 4–10 tuổi.
- Xây dựng thư viện nội dung kỹ năng sống phong phú, chuẩn hóa theo độ tuổi.
- Chứng minh mô hình "học qua nhiệm vụ thực tế + game hóa" giúp trẻ duy trì thói quen tốt.
- Vận hành mô hình freemium bền vững: miễn phí thu hút người dùng, gói Premium tạo doanh thu.

---

## 2. Business Goals

### 2.1. Business Goal (Mục tiêu kinh doanh)

| # | Mục tiêu kinh doanh | Diễn giải |
|---|----------------------|-----------|
| BG-1 | Thu hút và giữ chân người dùng | Đạt lượng phụ huynh đăng ký và duy trì hoạt động ổn định qua các giai đoạn |
| BG-2 | Tạo doanh thu qua gói Premium | Chuyển đổi người dùng miễn phí sang trả phí bằng tính năng nâng cao |
| BG-3 | Xây dựng hệ sinh thái nội dung | Thu hút Expert đóng góp nội dung chất lượng, tạo lợi thế cạnh tranh |
| BG-4 | Định vị thương hiệu an toàn & uy tín | Trở thành lựa chọn tin cậy nhờ kiểm duyệt nội dung và bảo vệ trẻ em |
| BG-5 | Tối ưu chi phí vận hành | Tự động hóa xác minh bằng AI, giảm tải kiểm duyệt thủ công |

### 2.2. User Goal (Mục tiêu người dùng)

| Vai trò | Mục tiêu người dùng |
|---------|----------------------|
| **Phụ huynh** | Giúp con hình thành thói quen tốt một cách nhẹ nhàng, theo dõi tiến độ, an tâm về an toàn |
| **Trẻ em** | Học vui, được khen thưởng, chăm sóc thú cưng ảo, cảm thấy hứng thú mỗi ngày |
| **Chuyên gia** | Chia sẻ chuyên môn, xây dựng uy tín, tiếp cận nhiều gia đình |
| **Admin** | Vận hành hệ thống trơn tru, kiểm soát chất lượng nội dung và người dùng |

### 2.3. System Goal (Mục tiêu hệ thống)

- Cung cấp nền tảng ổn định, phản hồi nhanh, hoạt động 24/7 với độ sẵn sàng cao.
- Đảm bảo phân quyền chặt chẽ giữa 4 vai trò, bảo vệ dữ liệu trẻ em.
- Tự động hóa luồng: nhiệm vụ → nộp bằng chứng → AI xác minh → phụ huynh phê duyệt → trao thưởng.
- Hỗ trợ mở rộng khi số lượng người dùng và nội dung tăng.
- Tích hợp linh hoạt với các dịch vụ ngoài (AI, thanh toán, thông báo, lưu trữ).

### 2.4. Success Metrics (KPIs)

| Nhóm | Chỉ số (KPI) | Mục tiêu tham chiếu |
|------|--------------|----------------------|
| Tăng trưởng | Số phụ huynh đăng ký mới / tháng | Tăng trưởng dương liên tục |
| Tương tác | DAU/MAU (tỷ lệ người dùng hoạt động) | ≥ 30% |
| Giữ chân | Retention D7 / D30 | D7 ≥ 40%, D30 ≥ 20% |
| Hành vi cốt lõi | Tỷ lệ nhiệm vụ hoàn thành/ngày trên mỗi trẻ | ≥ 3 nhiệm vụ/ngày |
| Nội dung | Số bài học/quiz được Expert đóng góp và duyệt | Tăng trưởng đều |
| Doanh thu | Tỷ lệ chuyển đổi Free → Premium | ≥ 5% |
| Doanh thu | MRR (doanh thu định kỳ hằng tháng) | Tăng trưởng dương |
| AI | Độ chính xác xác minh của AI (khớp với phê duyệt phụ huynh) | ≥ 85% |
| Vận hành | Thời gian phản hồi API trung bình | < 500ms |
| Hài lòng | CSAT / đánh giá ứng dụng | ≥ 4.5/5 |

---

## 3. Scope Analysis

### 3.1. In Scope (Trong phạm vi)

Các hạng mục được xây dựng trong phạm vi dự án (phiên bản 1.0):

| Nhóm | Hạng mục trong phạm vi |
|------|-------------------------|
| Tài khoản & phân quyền | Đăng ký/đăng nhập, quản lý tài khoản 4 vai trò (Parent, Child, Expert, Admin), JWT, RBAC |
| Quản lý trẻ | Phụ huynh tạo và quản lý nhiều hồ sơ trẻ (ChildProfile) |
| Nội dung giáo dục | CMS bài học (Lesson), Quiz, Question, phân loại theo Skill và độ tuổi |
| Nhiệm vụ | Giao và quản lý nhiệm vụ hằng ngày (Mission), checklist |
| Nộp & xác minh | Trẻ nộp bằng chứng (Submission), AI xác minh, phụ huynh phê duyệt/từ chối |
| Gamification | Điểm thưởng, huy hiệu, cấp độ, thú cưng ảo (Pet), phần thưởng (Reward) |
| Ví & phần thưởng | Ví điểm (Wallet), đổi thưởng, chứng nhận (Certificate) |
| Thông báo | Push Notification, thông báo trong ứng dụng |
| Thanh toán | Đăng ký gói Premium (Subscription), giao dịch (Transaction) qua Payment Gateway |
| Báo cáo | Dashboard tiến độ cho phụ huynh, thống kê vận hành cho Admin |
| AI | Xác minh bằng chứng, gợi ý nội dung cơ bản |
| Tích hợp | AI Service, Cloud Storage, Firebase Cloud Messaging, Payment Gateway, Email |

### 3.2. Out of Scope (Ngoài phạm vi)

Các hạng mục **không** thực hiện trong phiên bản này:

- Mạng xã hội giữa các trẻ / kết bạn / nhắn tin trực tiếp giữa trẻ với nhau.
- Lớp học trực tuyến thời gian thực (video call, livestream) giữa Expert và trẻ.
- Bản dành cho tổ chức/trường học (quản lý lớp, nhiều giáo viên) — thuộc future scope.
- Thương mại điện tử bán đồ chơi/vật phẩm thật.
- Hỗ trợ đa ngôn ngữ ngoài tiếng Việt (ở v1.0).
- Ứng dụng cho thiết bị đeo (smartwatch) và TV.
- Cơ chế AI tự sinh nội dung bài học hoàn chỉnh thay thế Expert.

### 3.3. Future Scope (Phạm vi tương lai)

| Giai đoạn | Định hướng mở rộng |
|-----------|---------------------|
| Ngắn hạn | Đa ngôn ngữ, thêm loại phần thưởng, cá nhân hóa nội dung theo AI |
| Trung hạn | Bản B2B cho trường học/trung tâm, cộng đồng phụ huynh, marketplace nội dung Expert |
| Dài hạn | AI đề xuất lộ trình phát triển cá nhân hóa cho từng trẻ, tích hợp thiết bị đeo, mở rộng độ tuổi (11–14) |

---

# GIAI ĐOẠN 2. BUSINESS ANALYSIS

## 4. Stakeholder Analysis

Phân tích các bên liên quan (stakeholder), gồm cả người dùng và các dịch vụ/hệ thống bên ngoài.

### 4.1. Parent (Phụ huynh)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Người quản lý tài khoản gia đình, giám sát và đồng hành cùng trẻ |
| **Mục tiêu** | Giúp con rèn thói quen tốt, theo dõi tiến độ, đảm bảo an toàn cho con |
| **Lợi ích** | Công cụ nuôi dạy con tiện lợi, an tâm, tiết kiệm thời gian |
| **Trách nhiệm** | Tạo hồ sơ trẻ, giao nhiệm vụ, phê duyệt bằng chứng, quản lý phần thưởng, thanh toán |
| **Mức độ ảnh hưởng** | Rất cao (người ra quyết định & trả tiền) |
| **Mức độ ưu tiên** | Cao nhất |

### 4.2. Child (Trẻ em)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Người dùng cuối trực tiếp học và thực hiện nhiệm vụ |
| **Mục tiêu** | Học vui, hoàn thành nhiệm vụ, nhận thưởng, chăm sóc thú cưng ảo |
| **Lợi ích** | Trải nghiệm học tập thú vị, được ghi nhận và khen thưởng |
| **Trách nhiệm** | Học bài, làm quiz, thực hiện nhiệm vụ, nộp bằng chứng |
| **Mức độ ảnh hưởng** | Cao (người thụ hưởng, quyết định mức độ gắn bó sản phẩm) |
| **Mức độ ưu tiên** | Cao |

### 4.3. Expert (Chuyên gia)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Người sản xuất nội dung giáo dục (bài học, quiz, nhiệm vụ mẫu) |
| **Mục tiêu** | Chia sẻ chuyên môn, xây dựng uy tín, tiếp cận người dùng |
| **Lợi ích** | Kênh phân phối nội dung, thương hiệu cá nhân, thu nhập (tương lai) |
| **Trách nhiệm** | Biên soạn nội dung chất lượng, đúng lứa tuổi, tuân thủ quy định kiểm duyệt |
| **Mức độ ảnh hưởng** | Trung bình – Cao (chất lượng nội dung quyết định giá trị nền tảng) |
| **Mức độ ưu tiên** | Trung bình – Cao |

### 4.4. Admin (Quản trị viên)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Vận hành, kiểm duyệt và quản trị toàn hệ thống |
| **Mục tiêu** | Đảm bảo hệ thống an toàn, nội dung đạt chuẩn, người dùng tuân thủ |
| **Lợi ích** | Kiểm soát chất lượng, giảm rủi ro pháp lý và uy tín |
| **Trách nhiệm** | Duyệt nội dung Expert, quản lý người dùng, cấu hình hệ thống, xử lý vi phạm, xem báo cáo |
| **Mức độ ảnh hưởng** | Rất cao (kiểm soát vận hành) |
| **Mức độ ưu tiên** | Cao |

### 4.5. AI Service (Dịch vụ AI)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Hệ thống hỗ trợ xác minh bằng chứng và gợi ý nội dung |
| **Mục tiêu** | Tự động hóa kiểm tra tính hợp lệ của bằng chứng trẻ nộp |
| **Lợi ích** | Giảm tải phụ huynh/Admin, tăng tốc độ phản hồi |
| **Trách nhiệm** | Phân tích ảnh/video, trả về nhãn và điểm tin cậy (confidence score) |
| **Mức độ ảnh hưởng** | Cao (ảnh hưởng luồng xác minh) |
| **Mức độ ưu tiên** | Cao |

### 4.6. Payment Gateway (Cổng thanh toán)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Xử lý giao dịch thanh toán gói Premium |
| **Mục tiêu** | Thu tiền an toàn, đúng, đối soát chính xác |
| **Lợi ích** | Đảm bảo dòng doanh thu, trải nghiệm thanh toán mượt |
| **Trách nhiệm** | Xử lý thanh toán, hoàn tiền, gửi kết quả giao dịch (webhook) |
| **Mức độ ảnh hưởng** | Cao (liên quan trực tiếp doanh thu) |
| **Mức độ ưu tiên** | Cao |

### 4.7. Notification Service (Dịch vụ thông báo)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Gửi thông báo đẩy (push) và trong ứng dụng |
| **Mục tiêu** | Nhắc nhở, thông báo sự kiện đúng lúc, đúng người |
| **Lợi ích** | Tăng tương tác và tỷ lệ giữ chân |
| **Trách nhiệm** | Gửi thông báo theo trigger, đảm bảo độ tin cậy chuyển phát |
| **Mức độ ảnh hưởng** | Trung bình |
| **Mức độ ưu tiên** | Trung bình |

### 4.8. Cloud Storage (Lưu trữ đám mây)

| Thuộc tính | Nội dung |
|------------|----------|
| **Vai trò** | Lưu trữ tệp media (ảnh/video bằng chứng, hình bài học, avatar) |
| **Mục tiêu** | Lưu trữ an toàn, truy xuất nhanh, chi phí hợp lý |
| **Lợi ích** | Giảm tải hạ tầng nội bộ, khả năng mở rộng lưu trữ |
| **Trách nhiệm** | Lưu, phân phối (CDN), bảo mật quyền truy cập tệp |
| **Mức độ ảnh hưởng** | Trung bình – Cao |
| **Mức độ ưu tiên** | Trung bình – Cao |

### 4.9. Bảng tổng hợp mức độ ảnh hưởng – ưu tiên

| Stakeholder | Ảnh hưởng | Ưu tiên | Chiến lược quản lý |
|-------------|-----------|---------|---------------------|
| Parent | Rất cao | Cao nhất | Quản lý sát, ưu tiên trải nghiệm |
| Admin | Rất cao | Cao | Cung cấp công cụ quản trị mạnh |
| Child | Cao | Cao | Tối ưu trải nghiệm, an toàn |
| AI Service | Cao | Cao | Đảm bảo độ chính xác, fallback |
| Payment Gateway | Cao | Cao | Đảm bảo an toàn giao dịch |
| Expert | TB–Cao | TB–Cao | Khuyến khích đóng góp, kiểm duyệt |
| Cloud Storage | TB–Cao | TB–Cao | Đảm bảo sẵn sàng, bảo mật |
| Notification Service | TB | TB | Giám sát độ tin cậy chuyển phát |

---

## 5. Role Analysis

Hệ thống có 4 vai trò người dùng chính. Mỗi vai trò được phân tích chi tiết dưới đây.

### 5.1. Parent (Phụ huynh)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mô tả** | Tài khoản chủ của gia đình, quản lý toàn bộ hoạt động của (các) trẻ |
| **Mục tiêu** | Rèn thói quen tốt cho con, theo dõi và đảm bảo an toàn |
| **Quyền hạn** | Tạo/sửa/xóa hồ sơ trẻ; giao nhiệm vụ; phê duyệt/từ chối bằng chứng; quản lý ví & phần thưởng; mua gói Premium; xem báo cáo của con; cấu hình quyền truy cập của trẻ |
| **Giới hạn** | Chỉ thao tác trên hồ sơ trẻ thuộc tài khoản mình; không tạo/kiểm duyệt nội dung giáo dục; không quản trị hệ thống hay người dùng khác |
| **Business Goal liên quan** | BG-1 (giữ chân), BG-2 (doanh thu Premium), BG-4 (an toàn) |
| **Chức năng được phép** | Quản lý hồ sơ trẻ, giao/duyệt nhiệm vụ, quản lý ví/thưởng, thanh toán, xem báo cáo, nhận thông báo |
| **Chức năng KHÔNG được phép** | Tạo/duyệt bài học của người khác, quản lý người dùng hệ thống, cấu hình hệ thống, truy cập dữ liệu gia đình khác |

### 5.2. Child (Trẻ em)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mô tả** | Người dùng cuối, đăng nhập bằng hồ sơ do phụ huynh tạo, giao diện thân thiện trẻ em |
| **Mục tiêu** | Học bài, hoàn thành nhiệm vụ, nhận thưởng, chơi cùng thú cưng ảo |
| **Quyền hạn** | Xem/học bài được giao, làm quiz, xem nhiệm vụ, nộp bằng chứng, xem ví điểm, chăm sóc Pet, đổi thưởng trong giới hạn phụ huynh cho phép |
| **Giới hạn** | Không tự thay đổi cấu hình tài khoản, không thanh toán, không tự phê duyệt nhiệm vụ, không xem dữ liệu tài chính, không truy cập nội dung ngoài độ tuổi |
| **Business Goal liên quan** | BG-1 (tương tác & giữ chân) |
| **Chức năng được phép** | Học bài, làm quiz, thực hiện & nộp nhiệm vụ, xem điểm/huy hiệu, chăm sóc Pet, đổi thưởng (có kiểm soát) |
| **Chức năng KHÔNG được phép** | Thanh toán, quản lý hồ sơ, phê duyệt bằng chứng, tạo nội dung, thay đổi phân quyền |

### 5.3. Expert (Chuyên gia)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mô tả** | Người tạo nội dung giáo dục, hoạt động sau khi được Admin phê duyệt tư cách |
| **Mục tiêu** | Đóng góp bài học/quiz/nhiệm vụ chất lượng, xây dựng uy tín |
| **Quyền hạn** | Tạo/sửa/xóa nội dung của chính mình (Lesson, Quiz, Question, Mission mẫu); gửi nội dung để duyệt; xem thống kê nội dung của mình |
| **Giới hạn** | Nội dung phải qua kiểm duyệt Admin mới publish; không truy cập dữ liệu trẻ/phụ huynh; không quản trị hệ thống |
| **Business Goal liên quan** | BG-3 (hệ sinh thái nội dung), BG-4 (uy tín) |
| **Chức năng được phép** | Soạn nội dung, gửi duyệt, chỉnh sửa nội dung của mình, xem thống kê nội dung |
| **Chức năng KHÔNG được phép** | Publish trực tiếp không qua duyệt, sửa nội dung người khác, truy cập dữ liệu người dùng gia đình, quản trị hệ thống |

### 5.4. Admin (Quản trị viên)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mô tả** | Người vận hành và kiểm soát toàn hệ thống |
| **Mục tiêu** | Đảm bảo chất lượng nội dung, an toàn người dùng, hệ thống ổn định |
| **Quyền hạn** | Quản lý toàn bộ người dùng (Parent, Child, Expert); duyệt/từ chối nội dung; khóa/mở tài khoản; cấu hình hệ thống; xem toàn bộ báo cáo & audit log; quản lý gói Premium |
| **Giới hạn** | Không can thiệp phê duyệt nhiệm vụ nội bộ gia đình (thuộc quyền phụ huynh) trừ khi vi phạm chính sách |
| **Business Goal liên quan** | Tất cả (BG-1 → BG-5) |
| **Chức năng được phép** | Quản lý người dùng, kiểm duyệt nội dung, cấu hình hệ thống, xem báo cáo/log, xử lý vi phạm |
| **Chức năng KHÔNG được phép** | Xem mật khẩu người dùng (chỉ dạng mã hóa), tùy tiện can thiệp dữ liệu riêng tư gia đình ngoài phạm vi chính sách |

---

## 6. Module Analysis

Hệ thống được chia thành 13 module chức năng.

### 6.1. Authentication (Xác thực)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Xác thực danh tính và cấp quyền truy cập |
| **Người sử dụng** | Parent, Child, Expert, Admin |
| **Chức năng** | Đăng ký, đăng nhập, đăng xuất, refresh token, quên/đổi mật khẩu, xác thực email |
| **Input** | Email, mật khẩu, thông tin đăng ký, token |
| **Output** | Access token (JWT), refresh token, phiên đăng nhập |
| **Entity liên quan** | User |

### 6.2. User Management (Quản lý người dùng)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Quản lý thông tin tài khoản và hồ sơ trẻ |
| **Người sử dụng** | Parent, Admin |
| **Chức năng** | Xem/cập nhật hồ sơ; Parent tạo/sửa/xóa ChildProfile; Admin quản lý toàn bộ user, khóa/mở tài khoản |
| **Input** | Thông tin cá nhân, hồ sơ trẻ (tên, tuổi, avatar) |
| **Output** | Hồ sơ người dùng, danh sách trẻ, trạng thái tài khoản |
| **Entity liên quan** | User, ChildProfile |

### 6.3. Education CMS (Quản lý nội dung giáo dục)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Tạo, quản lý và kiểm duyệt nội dung học tập |
| **Người sử dụng** | Expert, Admin, (Parent/Child: xem) |
| **Chức năng** | Tạo/sửa/xóa Lesson, Skill; gửi duyệt; Admin duyệt/từ chối/publish; phân loại theo độ tuổi |
| **Input** | Nội dung bài học, media, phân loại kỹ năng/độ tuổi |
| **Output** | Bài học đã publish, thư viện nội dung |
| **Entity liên quan** | Lesson, Skill |

### 6.4. Mission (Nhiệm vụ)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Giao và quản lý nhiệm vụ hằng ngày cho trẻ |
| **Người sử dụng** | Parent (giao/duyệt), Child (thực hiện), Expert (tạo mẫu) |
| **Chức năng** | Tạo nhiệm vụ, gán cho trẻ, đặt lịch/hạn, theo dõi trạng thái, checklist |
| **Input** | Tên nhiệm vụ, mô tả, kỹ năng, điểm thưởng, hạn hoàn thành |
| **Output** | Danh sách nhiệm vụ, trạng thái hoàn thành |
| **Entity liên quan** | Mission, Checklist, ChildProfile, Skill |

### 6.5. Quiz (Trắc nghiệm)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Kiểm tra, củng cố kiến thức qua câu hỏi |
| **Người sử dụng** | Expert (tạo), Child (làm), Parent (xem kết quả) |
| **Chức năng** | Tạo/sửa quiz & câu hỏi, làm quiz, chấm điểm tự động, lưu kết quả |
| **Input** | Câu hỏi, đáp án, lựa chọn của trẻ |
| **Output** | Điểm số, kết quả đúng/sai, điểm thưởng |
| **Entity liên quan** | Quiz, Question, Lesson |

### 6.6. AI Verification (Xác minh bằng AI)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Tự động hỗ trợ xác minh bằng chứng nhiệm vụ |
| **Người sử dụng** | Hệ thống (AI Service), Parent (xem gợi ý & override) |
| **Chức năng** | Phân tích ảnh/video, trả về nhãn + confidence score, gợi ý duyệt/từ chối |
| **Input** | Tệp bằng chứng (ảnh/video), ngữ cảnh nhiệm vụ |
| **Output** | Nhãn nhận diện, điểm tin cậy, khuyến nghị |
| **Entity liên quan** | Submission, AILog, Mission |

### 6.7. Gamification (Trò chơi hóa)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Tạo động lực qua điểm, huy hiệu, cấp độ |
| **Người sử dụng** | Child (thụ hưởng), Parent (theo dõi) |
| **Chức năng** | Tích điểm, lên cấp, mở khóa huy hiệu, bảng thành tích |
| **Input** | Sự kiện hoàn thành (nhiệm vụ, quiz, bài học) |
| **Output** | Điểm, cấp độ, huy hiệu |
| **Entity liên quan** | ChildProfile, Wallet, Reward, Certificate |

### 6.8. Wallet (Ví điểm)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Quản lý số dư điểm thưởng của trẻ |
| **Người sử dụng** | Child (xem/dùng), Parent (quản lý) |
| **Chức năng** | Cộng/trừ điểm, xem lịch sử giao dịch điểm, đổi thưởng |
| **Input** | Sự kiện thưởng, yêu cầu đổi thưởng |
| **Output** | Số dư điểm, lịch sử biến động |
| **Entity liên quan** | Wallet, ChildProfile, Reward |

### 6.9. Pet (Thú cưng ảo)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Tạo gắn kết cảm xúc, duy trì thói quen qua chăm sóc thú cưng |
| **Người sử dụng** | Child |
| **Chức năng** | Nuôi, cho ăn, nâng cấp Pet bằng điểm; Pet phản ánh mức độ chăm chỉ |
| **Input** | Điểm, hành động chăm sóc |
| **Output** | Trạng thái Pet (cấp độ, tâm trạng, ngoại hình) |
| **Entity liên quan** | Pet, ChildProfile, Wallet |

### 6.10. Reward (Phần thưởng)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Quản lý và trao phần thưởng cho trẻ |
| **Người sử dụng** | Parent (tạo/duyệt), Child (đổi) |
| **Chức năng** | Tạo phần thưởng (ảo/thực), đặt giá điểm, trẻ đổi thưởng, phụ huynh duyệt đổi thưởng thực |
| **Input** | Thông tin phần thưởng, yêu cầu đổi |
| **Output** | Phần thưởng đã trao, chứng nhận |
| **Entity liên quan** | Reward, Wallet, Certificate, ChildProfile |

### 6.11. Reporting (Báo cáo)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Cung cấp thống kê tiến độ và vận hành |
| **Người sử dụng** | Parent (tiến độ con), Admin (toàn hệ thống), Expert (nội dung của mình) |
| **Chức năng** | Thống kê tiến độ theo kỹ năng, lịch sử nhiệm vụ, báo cáo doanh thu/người dùng |
| **Input** | Dữ liệu hoạt động, giao dịch, nội dung |
| **Output** | Dashboard, biểu đồ, báo cáo |
| **Entity liên quan** | ChildProfile, Mission, Submission, Transaction, Lesson |

### 6.12. Payment (Thanh toán)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Xử lý đăng ký và thanh toán gói Premium |
| **Người sử dụng** | Parent, Admin |
| **Chức năng** | Chọn gói, thanh toán, gia hạn, hủy, xem lịch sử giao dịch, xử lý webhook |
| **Input** | Lựa chọn gói, thông tin thanh toán |
| **Output** | Trạng thái subscription, hóa đơn/giao dịch |
| **Entity liên quan** | Subscription, Transaction, User |

### 6.13. Notification (Thông báo)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Gửi nhắc nhở và thông báo sự kiện |
| **Người sử dụng** | Parent, Child, Expert, Admin |
| **Chức năng** | Gửi push/in-app theo trigger, đánh dấu đã đọc, cấu hình nhận thông báo |
| **Input** | Sự kiện hệ thống (trigger), người nhận |
| **Output** | Thông báo hiển thị cho người dùng |
| **Entity liên quan** | Notification, User, Mission, Submission |

---

## 7. Feature Analysis

Phân tích tính năng theo Module và theo Vai trò.

### 7.1. Tính năng theo Module

#### Authentication
Đăng ký tài khoản (Parent/Expert); phụ huynh tạo tài khoản đăng nhập cho trẻ; đăng nhập/đăng xuất; JWT access + refresh token; quên mật khẩu qua email; đổi mật khẩu; xác thực email; khóa tạm khi đăng nhập sai nhiều lần.

#### User Management
Xem/cập nhật hồ sơ cá nhân; phụ huynh CRUD hồ sơ trẻ (tên, tuổi, avatar, kỹ năng ưu tiên); Admin xem/tìm kiếm/khóa/mở/xóa người dùng; phê duyệt tư cách Expert.

#### Education CMS
Expert soạn Lesson (nội dung, media, độ tuổi, kỹ năng); tạo/quản lý Skill; gửi duyệt; Admin duyệt/từ chối/publish/gỡ; Parent/Child duyệt xem thư viện theo độ tuổi.

#### Mission
Parent hoặc Expert tạo nhiệm vụ mẫu; Parent gán nhiệm vụ cho trẻ; đặt lịch lặp lại/hạn; Child xem & thực hiện; checklist con; theo dõi trạng thái nhiệm vụ.

#### Quiz
Expert tạo Quiz gắn với Lesson; ngân hàng Question; Child làm quiz; chấm điểm tự động; lưu và hiển thị kết quả; cộng điểm thưởng.

#### AI Verification
Trẻ nộp bằng chứng; AI phân tích ảnh/video; trả nhãn + confidence score; gợi ý duyệt/từ chối; ghi AILog; phụ huynh xem gợi ý và override.

#### Gamification
Tích điểm khi hoàn thành; hệ thống cấp độ (level); mở khóa huy hiệu; bảng thành tích; chuỗi ngày liên tục (streak).

#### Wallet
Ví điểm cho mỗi trẻ; cộng/trừ điểm tự động theo sự kiện; lịch sử biến động điểm; dùng điểm đổi thưởng/nuôi Pet.

#### Pet
Mỗi trẻ có thú cưng ảo; cho ăn/chăm sóc bằng điểm; Pet lên cấp; trạng thái phản ánh mức chăm chỉ; ngoại hình thay đổi theo cấp.

#### Reward
Parent tạo phần thưởng (ảo/thực) và đặt giá điểm; Child đổi thưởng; Parent duyệt yêu cầu đổi thưởng thực; cấp Certificate khi đạt mốc.

#### Reporting
Parent xem tiến độ con theo kỹ năng, lịch sử nhiệm vụ; Expert xem thống kê nội dung; Admin xem báo cáo người dùng, doanh thu, nội dung.

#### Payment
Parent chọn/mua/gia hạn/hủy gói Premium; xử lý qua Payment Gateway; webhook cập nhật trạng thái; lịch sử giao dịch; Admin quản lý gói.

#### Notification
Nhắc nhiệm vụ đến hạn; thông báo bằng chứng cần duyệt; kết quả duyệt; nội dung mới; thanh toán thành công/thất bại; cấu hình nhận thông báo.

### 7.2. Tính năng theo Vai trò

#### Parent
Quản lý hồ sơ trẻ; giao & lên lịch nhiệm vụ; xem hàng đợi bằng chứng, phê duyệt/từ chối (override AI); quản lý ví & phần thưởng; xem báo cáo tiến độ con; mua & quản lý Premium; nhận thông báo; cấu hình giới hạn cho trẻ.

#### Child
Đăng nhập giao diện thân thiện; học bài & làm quiz; xem & thực hiện nhiệm vụ; chụp/quay và nộp bằng chứng; xem điểm, huy hiệu, cấp độ; chăm sóc Pet; đổi thưởng trong giới hạn.

#### Expert
Soạn Lesson/Quiz/Question/nhiệm vụ mẫu; gửi duyệt; chỉnh sửa nội dung của mình; xem thống kê hiệu quả nội dung; nhận thông báo kết quả duyệt.

#### Admin
Quản lý toàn bộ người dùng; duyệt tư cách Expert; kiểm duyệt nội dung; cấu hình hệ thống & gói Premium; xem toàn bộ báo cáo và audit log; xử lý vi phạm/khóa tài khoản.

---

## 8. Functional Requirements (FR)

Danh sách các yêu cầu chức năng, đánh số FR-001 → FR-108, phân nhóm theo module.

### 8.1. Authentication (FR-001 → FR-010)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-001 | Hệ thống cho phép Parent/Expert đăng ký tài khoản bằng email và mật khẩu | Parent, Expert | Cao |
| FR-002 | Hệ thống gửi email xác thực và yêu cầu kích hoạt tài khoản | Parent, Expert | Cao |
| FR-003 | Hệ thống cho phép người dùng đăng nhập và nhận JWT access token | Tất cả | Cao |
| FR-004 | Hệ thống cấp refresh token để gia hạn phiên mà không cần đăng nhập lại | Tất cả | Cao |
| FR-005 | Hệ thống cho phép đăng xuất và thu hồi refresh token | Tất cả | Cao |
| FR-006 | Hệ thống cho phép người dùng yêu cầu đặt lại mật khẩu qua email | Parent, Expert, Admin | Cao |
| FR-007 | Hệ thống cho phép người dùng đổi mật khẩu khi đã đăng nhập | Tất cả | Trung bình |
| FR-008 | Hệ thống cho phép Parent tạo thông tin đăng nhập cho hồ sơ trẻ (không cần email riêng) | Parent | Cao |
| FR-009 | Hệ thống khóa tạm thời tài khoản sau số lần đăng nhập sai vượt ngưỡng | Hệ thống | Trung bình |
| FR-010 | Hệ thống phân quyền truy cập theo vai trò (RBAC) ở mọi API | Hệ thống | Cao |

### 8.2. User Management (FR-011 → FR-021)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-011 | Người dùng có thể xem thông tin hồ sơ cá nhân | Tất cả | Trung bình |
| FR-012 | Người dùng có thể cập nhật hồ sơ cá nhân (tên, avatar, liên hệ) | Parent, Expert, Admin | Trung bình |
| FR-013 | Parent có thể tạo hồ sơ trẻ (tên, ngày sinh, avatar, kỹ năng ưu tiên) | Parent | Cao |
| FR-014 | Parent có thể xem danh sách các hồ sơ trẻ của mình | Parent | Cao |
| FR-015 | Parent có thể cập nhật thông tin hồ sơ trẻ | Parent | Cao |
| FR-016 | Parent có thể xóa/vô hiệu hóa hồ sơ trẻ | Parent | Trung bình |
| FR-017 | Parent có thể cấu hình giới hạn hoạt động cho từng trẻ (đổi thưởng, thời lượng) | Parent | Trung bình |
| FR-018 | Admin có thể tìm kiếm và xem danh sách toàn bộ người dùng | Admin | Cao |
| FR-019 | Admin có thể khóa/mở khóa tài khoản người dùng | Admin | Cao |
| FR-020 | Admin có thể phê duyệt hoặc từ chối tư cách Expert | Admin | Cao |
| FR-021 | Admin có thể xóa tài khoản vi phạm chính sách | Admin | Trung bình |

### 8.3. Education CMS (FR-022 → FR-034)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-022 | Expert có thể tạo bài học (Lesson) với nội dung, media, phân loại độ tuổi và kỹ năng | Expert | Cao |
| FR-023 | Expert có thể cập nhật bài học do mình tạo | Expert | Cao |
| FR-024 | Expert có thể xóa bài học do mình tạo (khi chưa publish) | Expert | Trung bình |
| FR-025 | Expert có thể gửi bài học để Admin kiểm duyệt | Expert | Cao |
| FR-026 | Admin có thể xem danh sách nội dung chờ duyệt | Admin | Cao |
| FR-027 | Admin có thể phê duyệt và publish bài học | Admin | Cao |
| FR-028 | Admin có thể từ chối bài học kèm lý do | Admin | Cao |
| FR-029 | Admin có thể gỡ (unpublish) bài học đã publish | Admin | Trung bình |
| FR-030 | Hệ thống quản lý danh mục Skill (kỹ năng) | Expert, Admin | Trung bình |
| FR-031 | Parent/Child có thể duyệt xem thư viện bài học đã publish theo độ tuổi | Parent, Child | Cao |
| FR-032 | Hệ thống lọc nội dung theo độ tuổi phù hợp với hồ sơ trẻ | Hệ thống | Cao |
| FR-033 | Child có thể xem chi tiết và học một bài học được giao | Child | Cao |
| FR-034 | Hệ thống ghi nhận trạng thái hoàn thành bài học của trẻ | Hệ thống | Cao |

### 8.4. Mission (FR-035 → FR-046)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-035 | Expert có thể tạo nhiệm vụ mẫu (mission template) | Expert | Trung bình |
| FR-036 | Parent có thể tạo nhiệm vụ mới cho trẻ | Parent | Cao |
| FR-037 | Parent có thể gán nhiệm vụ cho một hoặc nhiều trẻ | Parent | Cao |
| FR-038 | Parent có thể đặt điểm thưởng, hạn hoàn thành cho nhiệm vụ | Parent | Cao |
| FR-039 | Parent có thể đặt lịch lặp lại nhiệm vụ (hằng ngày/tuần) | Parent | Trung bình |
| FR-040 | Parent có thể thêm checklist các bước con cho một nhiệm vụ | Parent | Thấp |
| FR-041 | Child có thể xem danh sách nhiệm vụ được giao theo ngày | Child | Cao |
| FR-042 | Child có thể đánh dấu bắt đầu/hoàn thành các mục checklist | Child | Trung bình |
| FR-043 | Parent có thể chỉnh sửa nhiệm vụ chưa hoàn thành | Parent | Trung bình |
| FR-044 | Parent có thể hủy/xóa nhiệm vụ | Parent | Trung bình |
| FR-045 | Hệ thống tự cập nhật trạng thái nhiệm vụ (chờ làm, chờ duyệt, hoàn thành, quá hạn) | Hệ thống | Cao |
| FR-046 | Hệ thống nhắc nhở nhiệm vụ sắp đến hạn qua thông báo | Hệ thống | Trung bình |

### 8.5. Quiz (FR-047 → FR-055)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-047 | Expert có thể tạo quiz gắn với một bài học | Expert | Cao |
| FR-048 | Expert có thể thêm câu hỏi (Question) và đáp án vào quiz | Expert | Cao |
| FR-049 | Expert có thể cập nhật/xóa câu hỏi của quiz | Expert | Trung bình |
| FR-050 | Child có thể làm quiz được giao | Child | Cao |
| FR-051 | Hệ thống chấm điểm quiz tự động | Hệ thống | Cao |
| FR-052 | Hệ thống hiển thị kết quả và đáp án đúng sau khi nộp | Child | Trung bình |
| FR-053 | Hệ thống cộng điểm thưởng vào ví khi trẻ đạt ngưỡng quiz | Hệ thống | Cao |
| FR-054 | Hệ thống lưu lịch sử làm quiz của trẻ | Hệ thống | Trung bình |
| FR-055 | Parent có thể xem kết quả quiz của con | Parent | Trung bình |

### 8.6. AI Verification & Submission (FR-056 → FR-066)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-056 | Child có thể nộp bằng chứng hoàn thành nhiệm vụ (ảnh/video) | Child | Cao |
| FR-057 | Hệ thống lưu tệp bằng chứng lên Cloud Storage | Hệ thống | Cao |
| FR-058 | Hệ thống gửi bằng chứng tới AI Service để phân tích | Hệ thống | Cao |
| FR-059 | AI trả về nhãn nhận diện và điểm tin cậy (confidence score) | Hệ thống | Cao |
| FR-060 | Hệ thống lưu kết quả phân tích AI vào AILog | Hệ thống | Trung bình |
| FR-061 | Hệ thống đưa ra gợi ý duyệt/từ chối dựa trên confidence score | Hệ thống | Cao |
| FR-062 | Parent có thể xem hàng đợi bằng chứng chờ duyệt | Parent | Cao |
| FR-063 | Parent có thể phê duyệt bằng chứng (chấp nhận hoàn thành) | Parent | Cao |
| FR-064 | Parent có thể từ chối bằng chứng kèm lý do và yêu cầu làm lại | Parent | Cao |
| FR-065 | Parent có quyền override kết quả gợi ý của AI (Parent Override) | Parent | Cao |
| FR-066 | Hệ thống trao điểm thưởng tự động khi bằng chứng được duyệt | Hệ thống | Cao |

### 8.7. Gamification, Wallet & Pet (FR-067 → FR-079)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-067 | Hệ thống cộng điểm cho trẻ khi hoàn thành nhiệm vụ/quiz/bài học | Hệ thống | Cao |
| FR-068 | Hệ thống tính cấp độ (level) của trẻ dựa trên tổng điểm/hoạt động | Hệ thống | Trung bình |
| FR-069 | Hệ thống mở khóa huy hiệu (badge) khi đạt điều kiện | Hệ thống | Trung bình |
| FR-070 | Hệ thống theo dõi chuỗi ngày hoạt động liên tục (streak) | Hệ thống | Thấp |
| FR-071 | Child có thể xem điểm, cấp độ và huy hiệu của mình | Child | Trung bình |
| FR-072 | Mỗi trẻ có một ví điểm (Wallet) riêng | Hệ thống | Cao |
| FR-073 | Hệ thống ghi lịch sử biến động điểm trong ví | Hệ thống | Trung bình |
| FR-074 | Child có thể xem số dư và lịch sử điểm | Child | Trung bình |
| FR-075 | Mỗi trẻ có một thú cưng ảo (Pet) | Hệ thống | Trung bình |
| FR-076 | Child có thể dùng điểm để cho ăn/chăm sóc Pet | Child | Trung bình |
| FR-077 | Pet có thể lên cấp và thay đổi ngoại hình theo mức chăm sóc | Hệ thống | Thấp |
| FR-078 | Hệ thống phản ánh trạng thái Pet theo mức độ hoạt động của trẻ | Hệ thống | Thấp |
| FR-079 | Hệ thống ngăn số dư điểm âm khi trừ điểm | Hệ thống | Cao |

### 8.8. Reward & Certificate (FR-080 → FR-087)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-080 | Parent có thể tạo phần thưởng (ảo hoặc thực) với giá điểm | Parent | Cao |
| FR-081 | Parent có thể cập nhật/xóa phần thưởng | Parent | Trung bình |
| FR-082 | Child có thể xem danh sách phần thưởng có thể đổi | Child | Trung bình |
| FR-083 | Child có thể yêu cầu đổi thưởng bằng điểm trong ví | Child | Cao |
| FR-084 | Hệ thống trừ điểm khi đổi thưởng thành công | Hệ thống | Cao |
| FR-085 | Parent phải duyệt yêu cầu đổi phần thưởng thực trước khi hoàn tất | Parent | Cao |
| FR-086 | Hệ thống cấp chứng nhận (Certificate) khi trẻ đạt mốc thành tích | Hệ thống | Thấp |
| FR-087 | Child/Parent có thể xem và tải chứng nhận | Parent, Child | Thấp |

### 8.9. Payment & Subscription (FR-088 → FR-096)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-088 | Parent có thể xem các gói Premium và quyền lợi | Parent | Cao |
| FR-089 | Parent có thể đăng ký/mua gói Premium qua Payment Gateway | Parent | Cao |
| FR-090 | Hệ thống xử lý kết quả thanh toán qua webhook từ Payment Gateway | Hệ thống | Cao |
| FR-091 | Hệ thống kích hoạt quyền lợi Premium khi thanh toán thành công | Hệ thống | Cao |
| FR-092 | Parent có thể gia hạn gói Premium | Parent | Trung bình |
| FR-093 | Parent có thể hủy gia hạn tự động | Parent | Trung bình |
| FR-094 | Parent có thể xem lịch sử giao dịch và hóa đơn | Parent | Trung bình |
| FR-095 | Hệ thống ghi nhận và lưu trạng thái Subscription | Hệ thống | Cao |
| FR-096 | Admin có thể tạo/cấu hình các gói Premium | Admin | Trung bình |

### 8.10. Reporting (FR-097 → FR-102)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-097 | Parent có thể xem dashboard tiến độ của từng trẻ theo kỹ năng | Parent | Cao |
| FR-098 | Parent có thể xem lịch sử nhiệm vụ và tỷ lệ hoàn thành của con | Parent | Trung bình |
| FR-099 | Expert có thể xem thống kê lượt sử dụng nội dung của mình | Expert | Trung bình |
| FR-100 | Admin có thể xem báo cáo tổng số người dùng và tăng trưởng | Admin | Cao |
| FR-101 | Admin có thể xem báo cáo doanh thu và chuyển đổi Premium | Admin | Cao |
| FR-102 | Admin có thể xuất báo cáo (CSV/PDF) | Admin | Thấp |

### 8.11. Notification (FR-103 → FR-108)

| Mã | Yêu cầu chức năng | Vai trò | Ưu tiên |
|----|--------------------|---------|---------|
| FR-103 | Hệ thống gửi thông báo nhắc nhiệm vụ đến hạn cho trẻ/phụ huynh | Hệ thống | Trung bình |
| FR-104 | Hệ thống thông báo cho Parent khi có bằng chứng chờ duyệt | Hệ thống | Cao |
| FR-105 | Hệ thống thông báo cho Child khi bằng chứng được duyệt/từ chối | Hệ thống | Trung bình |
| FR-106 | Hệ thống thông báo cho Expert khi nội dung được duyệt/từ chối | Hệ thống | Trung bình |
| FR-107 | Hệ thống thông báo kết quả thanh toán cho Parent | Hệ thống | Trung bình |
| FR-108 | Người dùng có thể xem, đánh dấu đã đọc và cấu hình nhận thông báo | Tất cả | Thấp |

> **Tổng cộng: 108 Functional Requirements** (nằm trong khoảng yêu cầu 80–120).

---

## 9. Non-functional Requirements (NFR)

| Mã | Nhóm | Yêu cầu phi chức năng |
|----|------|------------------------|
| NFR-01 | **Performance** | Thời gian phản hồi API trung bình < 500ms; tải màn hình chính < 2s với mạng 4G |
| NFR-02 | **Performance** | Hệ thống xử lý được ít nhất 1.000 người dùng đồng thời ở giai đoạn đầu |
| NFR-03 | **Security** | Toàn bộ giao tiếp qua HTTPS/TLS; dữ liệu nhạy cảm mã hóa khi truyền và lưu trữ |
| NFR-04 | **Authentication** | Xác thực bằng JWT; access token ngắn hạn, refresh token có thời hạn và thu hồi được |
| NFR-05 | **Authorization** | Kiểm soát truy cập theo vai trò (RBAC) ở mọi endpoint; từ chối truy cập trái phép (403) |
| NFR-06 | **Privacy** | Tuân thủ nguyên tắc bảo vệ dữ liệu trẻ em; tối thiểu hóa dữ liệu thu thập; không chia sẻ cho bên thứ ba khi chưa đồng ý |
| NFR-07 | **Availability** | Độ sẵn sàng hệ thống ≥ 99.5%/tháng; hạn chế downtime khi bảo trì |
| NFR-08 | **Scalability** | Kiến trúc cho phép mở rộng theo chiều ngang khi lượng người dùng/nội dung tăng |
| NFR-09 | **Reliability** | Luồng nghiệp vụ quan trọng (thanh toán, xác minh) có cơ chế retry và đảm bảo nhất quán |
| NFR-10 | **Maintainability** | Mã nguồn theo chuẩn, tách module rõ ràng, có tài liệu API; dễ bảo trì/mở rộng |
| NFR-11 | **Compatibility** | Frontend chạy tốt trên trình duyệt hiện đại (Chrome, Safari, Edge, Firefox) và responsive mobile |
| NFR-12 | **Backup & Recovery** | Sao lưu CSDL định kỳ hằng ngày; khôi phục được trong thời gian mục tiêu (RTO/RPO xác định) |
| NFR-13 | **Logging** | Ghi log tập trung cho request, lỗi và hành động nhạy cảm; đủ để truy vết sự cố |
| NFR-14 | **Monitoring** | Giám sát sức khỏe hệ thống (uptime, latency, lỗi) và cảnh báo khi vượt ngưỡng |
| NFR-15 | **Usability** | Giao diện trẻ em trực quan, ít chữ, biểu tượng lớn; giao diện phụ huynh rõ ràng, dễ thao tác |
| NFR-16 | **Localization** | Hỗ trợ tiếng Việt đầy đủ; kiến trúc sẵn sàng cho đa ngôn ngữ về sau |

---

## 10. Business Rules

Danh sách quy tắc nghiệp vụ của hệ thống.

| Mã | Quy tắc nghiệp vụ |
|----|--------------------|
| BR-001 | Một tài khoản Parent có thể quản lý nhiều hồ sơ trẻ (ChildProfile) |
| BR-002 | Hồ sơ trẻ chỉ được tạo và quản lý bởi Parent sở hữu; không Parent nào truy cập được hồ sơ trẻ của gia đình khác |
| BR-003 | Trẻ chỉ xem được nội dung phù hợp với độ tuổi khai báo trong hồ sơ |
| BR-004 | Nội dung của Expert phải được Admin phê duyệt mới được publish và hiển thị cho người dùng |
| BR-005 | Expert chỉ được sửa/xóa nội dung do chính mình tạo và khi nội dung chưa được publish |
| BR-006 | Một nhiệm vụ chỉ chuyển sang trạng thái "Hoàn thành" sau khi bằng chứng được Parent phê duyệt |
| BR-007 | AI chỉ đưa ra gợi ý; quyết định cuối cùng về việc duyệt bằng chứng thuộc về Parent (Parent Override) |
| BR-008 | Điểm thưởng chỉ được cộng vào ví khi nhiệm vụ/quiz/bài học được ghi nhận hoàn thành hợp lệ |
| BR-009 | Số dư ví điểm không được phép âm; mọi giao dịch trừ điểm phải kiểm tra đủ số dư |
| BR-010 | Đổi phần thưởng thực (physical reward) phải được Parent phê duyệt trước khi hoàn tất |
| BR-011 | Một trẻ chỉ có duy nhất một ví điểm và một thú cưng ảo |
| BR-012 | Nhiệm vụ quá hạn mà không có bằng chứng hợp lệ sẽ chuyển trạng thái "Quá hạn" và không được cộng điểm |
| BR-013 | Quyền lợi Premium chỉ được kích hoạt sau khi thanh toán thành công được xác nhận qua webhook |
| BR-014 | Khi Subscription hết hạn và không gia hạn, tài khoản trở về gói miễn phí, giữ nguyên dữ liệu |
| BR-015 | Trẻ không được thực hiện bất kỳ giao dịch thanh toán nào |
| BR-016 | Tài khoản bị khóa không thể đăng nhập hoặc thực hiện chức năng cho đến khi được mở |
| BR-017 | Mật khẩu phải được mã hóa (hash) trước khi lưu; không lưu mật khẩu dạng plaintext |
| BR-018 | Mỗi bằng chứng nộp lên đều được lưu vết (AILog) kết quả phân tích của AI |
| BR-019 | Chỉ Admin được thay đổi cấu hình hệ thống và danh sách gói Premium |
| BR-020 | Một nhiệm vụ lặp lại tạo ra các thực thể nhiệm vụ theo lịch, mỗi lần cần bằng chứng riêng |
| BR-021 | Huy hiệu/chứng nhận chỉ được cấp một lần cho mỗi điều kiện đạt được |
| BR-022 | Confidence score dưới ngưỡng cấu hình sẽ mặc định gợi ý "cần Parent xem xét kỹ" |

---

# GIAI ĐOẠN 3. SYSTEM ANALYSIS

## 11. Business Process

Phân tích các quy trình nghiệp vụ chính của hệ thống.

### 11.1. Quy trình rèn thói quen qua nhiệm vụ (quy trình lõi)

```
Parent tạo/giao nhiệm vụ
   → Child nhận & thực hiện nhiệm vụ ngoài đời
   → Child nộp bằng chứng (ảnh/video)
   → Hệ thống lưu bằng chứng + gửi AI phân tích
   → AI trả nhãn + confidence score + gợi ý
   → Parent xem hàng đợi & quyết định (Duyệt / Từ chối)
   → Nếu Duyệt: cộng điểm vào ví → cập nhật Gamification/Pet → thông báo Child
   → Nếu Từ chối: yêu cầu làm lại → Child nộp lại
```

**Mô tả:** Đây là quy trình trung tâm tạo ra giá trị của KidLife. Vai trò AI là hỗ trợ tăng tốc, còn Parent giữ quyền quyết định cuối cùng nhằm đảm bảo an toàn và tính chính xác.

### 11.2. Quy trình sản xuất & kiểm duyệt nội dung

```
Expert soạn nội dung (Lesson/Quiz)
   → Expert gửi duyệt
   → Admin xem hàng đợi kiểm duyệt
   → Admin đánh giá (Duyệt & Publish / Từ chối kèm lý do)
   → Nếu Duyệt: nội dung publish, hiển thị theo độ tuổi → thông báo Expert
   → Nếu Từ chối: Expert chỉnh sửa → gửi lại
```

### 11.3. Quy trình học tập của trẻ

```
Child đăng nhập
   → Xem bài học được giao / thư viện theo độ tuổi
   → Học bài → Làm quiz gắn với bài
   → Hệ thống chấm điểm → cộng điểm thưởng
   → Cập nhật tiến độ kỹ năng → phản ánh vào báo cáo cho Parent
```

### 11.4. Quy trình nâng cấp Premium

```
Parent xem gói Premium
   → Chọn gói & thanh toán qua Payment Gateway
   → Payment Gateway xử lý → gửi webhook kết quả
   → Hệ thống xác nhận → tạo/cập nhật Subscription + Transaction
   → Kích hoạt quyền lợi Premium → thông báo Parent
   → (Hết hạn) Gia hạn hoặc trở về gói miễn phí
```

### 11.5. Quy trình đổi thưởng

```
Child chọn phần thưởng → Yêu cầu đổi bằng điểm
   → Hệ thống kiểm tra đủ số dư
   → Nếu thưởng ảo: trừ điểm ngay → trao thưởng
   → Nếu thưởng thực: tạo yêu cầu chờ Parent duyệt
        → Parent duyệt: trừ điểm → xác nhận trao
        → Parent từ chối: hoàn tất không trừ điểm
```

---

## 12. User Journey

Hành trình người dùng cho từng vai trò.

### 12.1. Parent Journey

| Giai đoạn | Hành động | Cảm xúc/Kỳ vọng |
|-----------|-----------|------------------|
| Nhận biết | Nghe về app giúp rèn thói quen cho con | Tò mò, hy vọng |
| Đăng ký | Tạo tài khoản, xác thực email | Mong nhanh gọn |
| Khởi tạo | Tạo hồ sơ con, thiết lập kỹ năng ưu tiên | Muốn cá nhân hóa |
| Sử dụng hằng ngày | Giao nhiệm vụ, duyệt bằng chứng, xem tiến độ | Tiện lợi, an tâm |
| Gắn bó | Thấy con tiến bộ, cân nhắc nâng Premium | Hài lòng, tin tưởng |
| Nâng cấp | Mua Premium để mở tính năng nâng cao | Thấy xứng đáng |

### 12.2. Child Journey

| Giai đoạn | Hành động | Cảm xúc/Kỳ vọng |
|-----------|-----------|------------------|
| Làm quen | Đăng nhập, gặp thú cưng ảo | Thích thú, tò mò |
| Học & chơi | Học bài, làm quiz vui | Vui, muốn khám phá |
| Nhiệm vụ | Làm nhiệm vụ, chụp ảnh nộp | Có mục tiêu, tự hào |
| Nhận thưởng | Được duyệt, cộng điểm, nuôi Pet | Hào hứng, được ghi nhận |
| Duy trì | Quay lại mỗi ngày vì Pet & huy hiệu | Gắn bó, tạo thói quen |

### 12.3. Expert Journey

| Giai đoạn | Hành động | Cảm xúc/Kỳ vọng |
|-----------|-----------|------------------|
| Tham gia | Đăng ký, chờ Admin duyệt tư cách | Mong được công nhận |
| Soạn nội dung | Tạo bài học/quiz | Muốn công cụ dễ dùng |
| Gửi duyệt | Gửi & chờ kiểm duyệt | Mong duyệt nhanh, phản hồi rõ |
| Publish | Nội dung lên hệ thống | Tự hào, xây uy tín |
| Theo dõi | Xem thống kê lượt dùng | Muốn biết hiệu quả |

### 12.4. Admin Journey

| Giai đoạn | Hành động | Cảm xúc/Kỳ vọng |
|-----------|-----------|------------------|
| Đăng nhập | Truy cập trang quản trị | Cần bảo mật, tổng quan |
| Kiểm duyệt | Duyệt nội dung, tư cách Expert | Cần công cụ hiệu quả |
| Quản lý user | Xử lý tài khoản, vi phạm | Kiểm soát, an toàn |
| Giám sát | Xem báo cáo, log, doanh thu | Nắm bắt vận hành |
| Cấu hình | Thiết lập gói, tham số hệ thống | Linh hoạt điều chỉnh |

---

## 13. Activity Flow

Luồng hoạt động cho các chức năng chính (mô tả dạng các bước tuần tự, gồm nhánh chính và ngoại lệ).

### 13.1. Login

1. Người dùng nhập email/tài khoản và mật khẩu.
2. Hệ thống kiểm tra định dạng đầu vào.
3. Hệ thống xác thực thông tin với CSDL.
4. Nếu hợp lệ → cấp JWT access + refresh token → chuyển vào trang chính theo vai trò.
5. Ngoại lệ: sai thông tin → báo lỗi; sai quá ngưỡng → khóa tạm thời; tài khoản bị khóa → từ chối đăng nhập.

### 13.2. Register

1. Người dùng (Parent/Expert) nhập thông tin đăng ký.
2. Hệ thống kiểm tra email chưa tồn tại và mật khẩu đạt yêu cầu.
3. Hệ thống tạo tài khoản trạng thái "chưa kích hoạt" và gửi email xác thực.
4. Người dùng bấm liên kết xác thực → tài khoản kích hoạt.
5. Ngoại lệ: email đã tồn tại → báo lỗi; email xác thực hết hạn → gửi lại.

### 13.3. Lesson (Học bài)

1. Child chọn bài học được giao hoặc trong thư viện theo độ tuổi.
2. Hệ thống hiển thị nội dung bài học (văn bản, media).
3. Child hoàn thành bài học.
4. Hệ thống ghi nhận trạng thái hoàn thành và có thể gợi ý quiz liên quan.
5. Ngoại lệ: bài học bị gỡ → ẩn khỏi danh sách.

### 13.4. Quiz

1. Child bắt đầu quiz gắn với bài học.
2. Hệ thống hiển thị lần lượt các câu hỏi.
3. Child chọn đáp án và nộp bài.
4. Hệ thống chấm điểm tự động, hiển thị kết quả và đáp án đúng.
5. Nếu đạt ngưỡng → cộng điểm thưởng vào ví.
6. Ngoại lệ: mất kết nối giữa chừng → lưu tạm/cho làm lại.

### 13.5. Mission (Giao & thực hiện nhiệm vụ)

1. Parent tạo nhiệm vụ, đặt điểm thưởng, hạn, gán cho trẻ.
2. Hệ thống hiển thị nhiệm vụ trong danh sách của trẻ.
3. Child thực hiện nhiệm vụ ngoài đời.
4. Child đánh dấu các bước checklist (nếu có).
5. Ngoại lệ: quá hạn không nộp → chuyển trạng thái "Quá hạn".

### 13.6. Submission (Nộp bằng chứng)

1. Child chọn nhiệm vụ và tải lên bằng chứng (ảnh/video).
2. Hệ thống lưu tệp lên Cloud Storage và tạo bản ghi Submission.
3. Hệ thống gửi tệp tới AI Service để phân tích.
4. AI trả nhãn + confidence score → lưu AILog → tạo gợi ý.
5. Trạng thái Submission chuyển "Chờ Parent duyệt" → thông báo Parent.
6. Ngoại lệ: AI Service lỗi/timeout → vẫn chuyển sang chờ Parent duyệt thủ công.

### 13.7. Approval (Phê duyệt)

1. Parent mở hàng đợi bằng chứng chờ duyệt.
2. Parent xem bằng chứng và gợi ý của AI.
3. Parent quyết định: Duyệt hoặc Từ chối (kèm lý do).
4. Nếu Duyệt → nhiệm vụ "Hoàn thành" → cộng điểm → cập nhật Gamification/Pet → thông báo Child.
5. Nếu Từ chối → nhiệm vụ quay lại "Cần làm lại" → thông báo Child.
6. Ngoại lệ: bằng chứng lỗi/không mở được → yêu cầu nộp lại.

### 13.8. Reward (Đổi thưởng)

1. Child xem danh sách phần thưởng và giá điểm.
2. Child yêu cầu đổi một phần thưởng.
3. Hệ thống kiểm tra đủ số dư ví.
4. Thưởng ảo → trừ điểm và trao ngay; Thưởng thực → tạo yêu cầu chờ Parent duyệt.
5. Parent duyệt → trừ điểm và xác nhận trao; từ chối → không trừ điểm.
6. Ngoại lệ: không đủ điểm → từ chối yêu cầu.

### 13.9. Premium (Nâng cấp)

1. Parent xem danh sách gói Premium.
2. Parent chọn gói và tiến hành thanh toán qua Payment Gateway.
3. Payment Gateway xử lý → gửi webhook kết quả.
4. Hệ thống xác nhận → tạo/cập nhật Subscription + Transaction → kích hoạt quyền lợi.
5. Hệ thống thông báo Parent kết quả.
6. Ngoại lệ: thanh toán thất bại → giữ gói hiện tại, thông báo lỗi; webhook trễ → cập nhật khi nhận được.

---

## 14. Use Case Analysis

Mô tả chi tiết các use case tiêu biểu (danh sách rút gọn các UC quan trọng; các UC còn lại tuân theo cấu trúc tương tự).

### UC-01: Đăng nhập

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Đăng nhập hệ thống |
| **Description** | Người dùng xác thực để truy cập chức năng theo vai trò |
| **Primary Actor** | Parent / Child / Expert / Admin |
| **Secondary Actor** | Hệ thống xác thực (JWT) |
| **Preconditions** | Tài khoản đã tồn tại và được kích hoạt/không bị khóa |
| **Trigger** | Người dùng mở trang đăng nhập và gửi thông tin |
| **Main Flow** | 1. Nhập thông tin → 2. Hệ thống xác thực → 3. Cấp token → 4. Vào trang chính theo vai trò |
| **Alternative Flow** | Đăng nhập bằng tài khoản trẻ do Parent tạo (giao diện trẻ em) |
| **Exception Flow** | Sai thông tin → báo lỗi; sai quá ngưỡng → khóa tạm; tài khoản khóa → từ chối |
| **Postconditions** | Phiên đăng nhập được tạo, người dùng truy cập được chức năng theo quyền |

### UC-02: Tạo hồ sơ trẻ

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Tạo hồ sơ trẻ (ChildProfile) |
| **Description** | Parent tạo hồ sơ cho con để quản lý học tập và nhiệm vụ |
| **Primary Actor** | Parent |
| **Secondary Actor** | Không |
| **Preconditions** | Parent đã đăng nhập |
| **Trigger** | Parent chọn "Thêm hồ sơ trẻ" |
| **Main Flow** | 1. Nhập tên, ngày sinh, avatar, kỹ năng ưu tiên → 2. Hệ thống kiểm tra hợp lệ → 3. Tạo hồ sơ + ví + Pet mặc định |
| **Alternative Flow** | Tạo thêm nhiều hồ sơ trẻ khác |
| **Exception Flow** | Thiếu thông tin bắt buộc → báo lỗi; tuổi ngoài 4–10 → cảnh báo |
| **Postconditions** | Hồ sơ trẻ được tạo cùng ví điểm và thú cưng ảo |

### UC-03: Giao nhiệm vụ cho trẻ

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Giao nhiệm vụ |
| **Description** | Parent tạo và gán nhiệm vụ cho trẻ |
| **Primary Actor** | Parent |
| **Secondary Actor** | Notification Service |
| **Preconditions** | Có ít nhất một hồ sơ trẻ |
| **Trigger** | Parent chọn "Tạo nhiệm vụ" |
| **Main Flow** | 1. Nhập thông tin nhiệm vụ, điểm, hạn → 2. Gán cho trẻ → 3. Lưu → 4. Thông báo trẻ |
| **Alternative Flow** | Dùng nhiệm vụ mẫu của Expert; đặt lịch lặp lại |
| **Exception Flow** | Hạn hoàn thành ở quá khứ → báo lỗi |
| **Postconditions** | Nhiệm vụ xuất hiện trong danh sách của trẻ |

### UC-04: Nộp bằng chứng nhiệm vụ

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Nộp bằng chứng |
| **Description** | Trẻ nộp ảnh/video chứng minh hoàn thành nhiệm vụ |
| **Primary Actor** | Child |
| **Secondary Actor** | Cloud Storage, AI Service |
| **Preconditions** | Nhiệm vụ đang ở trạng thái chờ thực hiện |
| **Trigger** | Child chọn "Nộp bằng chứng" |
| **Main Flow** | 1. Tải lên tệp → 2. Lưu Cloud Storage → 3. Gửi AI phân tích → 4. Lưu AILog → 5. Chuyển "Chờ duyệt" → 6. Thông báo Parent |
| **Alternative Flow** | Nộp lại sau khi bị từ chối |
| **Exception Flow** | Tệp lỗi/quá lớn → báo lỗi; AI timeout → chuyển duyệt thủ công |
| **Postconditions** | Submission được tạo, chờ Parent phê duyệt |

### UC-05: Phê duyệt bằng chứng (Parent Override)

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Phê duyệt/từ chối bằng chứng |
| **Description** | Parent quyết định cuối cùng dựa trên bằng chứng và gợi ý AI |
| **Primary Actor** | Parent |
| **Secondary Actor** | AI Service (gợi ý), Notification Service |
| **Preconditions** | Có Submission ở trạng thái "Chờ duyệt" |
| **Trigger** | Parent mở hàng đợi duyệt |
| **Main Flow** | 1. Xem bằng chứng + gợi ý AI → 2. Duyệt → 3. Nhiệm vụ hoàn thành → 4. Cộng điểm → 5. Cập nhật Pet/Gamification → 6. Thông báo Child |
| **Alternative Flow** | Từ chối kèm lý do → nhiệm vụ "Cần làm lại" |
| **Exception Flow** | Bằng chứng lỗi → yêu cầu nộp lại |
| **Postconditions** | Trạng thái nhiệm vụ cập nhật; điểm được trao nếu duyệt |

### UC-06: Kiểm duyệt nội dung Expert

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Kiểm duyệt nội dung |
| **Description** | Admin duyệt/từ chối nội dung do Expert gửi |
| **Primary Actor** | Admin |
| **Secondary Actor** | Expert, Notification Service |
| **Preconditions** | Có nội dung ở trạng thái "Chờ duyệt" |
| **Trigger** | Admin mở hàng đợi kiểm duyệt |
| **Main Flow** | 1. Xem nội dung → 2. Duyệt & Publish → 3. Thông báo Expert |
| **Alternative Flow** | Từ chối kèm lý do → Expert chỉnh sửa gửi lại |
| **Exception Flow** | Nội dung vi phạm nghiêm trọng → từ chối + cảnh báo Expert |
| **Postconditions** | Nội dung được publish hoặc trả về chỉnh sửa |

### UC-07: Đổi thưởng

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Đổi phần thưởng |
| **Description** | Trẻ dùng điểm đổi phần thưởng |
| **Primary Actor** | Child |
| **Secondary Actor** | Parent (duyệt thưởng thực) |
| **Preconditions** | Đủ số dư điểm |
| **Trigger** | Child chọn phần thưởng và yêu cầu đổi |
| **Main Flow** | 1. Kiểm tra số dư → 2. Thưởng ảo: trừ điểm, trao ngay |
| **Alternative Flow** | Thưởng thực: tạo yêu cầu → Parent duyệt → trừ điểm & trao |
| **Exception Flow** | Không đủ điểm → từ chối; Parent từ chối → không trừ điểm |
| **Postconditions** | Điểm được trừ (nếu thành công), phần thưởng được ghi nhận |

### UC-08: Nâng cấp Premium

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Mua gói Premium |
| **Description** | Parent thanh toán để kích hoạt quyền lợi Premium |
| **Primary Actor** | Parent |
| **Secondary Actor** | Payment Gateway |
| **Preconditions** | Parent đã đăng nhập |
| **Trigger** | Parent chọn gói và thanh toán |
| **Main Flow** | 1. Chọn gói → 2. Thanh toán → 3. Webhook xác nhận → 4. Tạo Subscription/Transaction → 5. Kích hoạt quyền lợi → 6. Thông báo |
| **Alternative Flow** | Gia hạn gói đang có |
| **Exception Flow** | Thanh toán thất bại → giữ gói cũ, báo lỗi |
| **Postconditions** | Subscription kích hoạt, quyền lợi Premium áp dụng |

> Các Use Case còn lại (đăng ký, học bài, làm quiz, quản lý người dùng, xem báo cáo, cấu hình hệ thống, quản lý phần thưởng, thông báo…) được mô tả theo cùng cấu trúc 10 thành phần trên.

---

## 15. CRUD Analysis

Phân tích thao tác CRUD trên các Entity chính theo vai trò (C=Create, R=Read, U=Update, D=Delete).

| Entity | Parent | Child | Expert | Admin |
|--------|--------|-------|--------|-------|
| User | R, U (bản thân) | R (bản thân) | R, U (bản thân) | R, U, D |
| ChildProfile | C, R, U, D | R (bản thân) | – | R, D |
| Skill | R | R | C, R, U | C, R, U, D |
| Lesson | R | R | C, R, U, D (của mình) | R, U, D (duyệt/gỡ) |
| Quiz | R | R | C, R, U, D (của mình) | R, D |
| Question | R | R | C, R, U, D (của mình) | R, D |
| Mission | C, R, U, D | R | C (mẫu), R | R, D |
| Checklist | C, R, U, D | R, U (tick) | – | R |
| Submission | R, U (duyệt) | C, R (của mình) | – | R |
| Wallet | R | R (của mình) | – | R |
| Pet | R | R, U (chăm sóc) | – | R |
| Reward | C, R, U, D | R, (yêu cầu đổi) | – | R |
| Certificate | R | R (của mình) | – | R |
| Notification | R, U | R, U | R, U | C, R, U, D |
| Subscription | C, R, U (hủy) | – | – | R, U |
| Transaction | R (của mình) | – | – | R |
| AILog | R (liên quan con) | – | – | R |

*Ghi chú: "của mình" nghĩa là chỉ thao tác trên bản ghi thuộc sở hữu; Admin không xem mật khẩu dạng plaintext.*

---

## 16. Permission Matrix

Ma trận quyền theo chức năng cho 4 vai trò (✅ được phép, ❌ không được phép, 🔶 có điều kiện).

| Nhóm chức năng | Parent | Child | Expert | Admin |
|-----------------|:------:|:-----:|:------:|:-----:|
| Đăng ký/Đăng nhập | ✅ | 🔶 (do Parent tạo) | ✅ | ✅ |
| Quản lý hồ sơ trẻ | ✅ | ❌ | ❌ | 🔶 (quản trị) |
| Học bài / làm quiz | ❌ | ✅ | ❌ | ❌ |
| Tạo nội dung giáo dục | ❌ | ❌ | ✅ | 🔶 |
| Kiểm duyệt nội dung | ❌ | ❌ | ❌ | ✅ |
| Tạo/giao nhiệm vụ | ✅ | ❌ | 🔶 (mẫu) | ❌ |
| Thực hiện & nộp bằng chứng | ❌ | ✅ | ❌ | ❌ |
| Phê duyệt bằng chứng | ✅ | ❌ | ❌ | 🔶 (chính sách) |
| Quản lý ví & điểm | ✅ | 🔶 (xem/dùng) | ❌ | 🔶 |
| Chăm sóc Pet | ❌ | ✅ | ❌ | ❌ |
| Tạo/quản lý phần thưởng | ✅ | ❌ | ❌ | 🔶 |
| Đổi thưởng | 🔶 (duyệt) | ✅ | ❌ | ❌ |
| Thanh toán/Premium | ✅ | ❌ | ❌ | 🔶 (cấu hình) |
| Xem báo cáo tiến độ con | ✅ | 🔶 (của mình) | ❌ | ✅ |
| Xem báo cáo hệ thống | ❌ | ❌ | 🔶 (nội dung mình) | ✅ |
| Quản lý người dùng | ❌ | ❌ | ❌ | ✅ |
| Cấu hình hệ thống | ❌ | ❌ | ❌ | ✅ |
| Nhận/quản lý thông báo | ✅ | ✅ | ✅ | ✅ |

---

# GIAI ĐOẠN 4. DATABASE ANALYSIS

> Cơ sở dữ liệu sử dụng **MongoDB** (document-oriented). Primary Key mặc định là `_id` (ObjectId). "Foreign Key" được hiểu là trường tham chiếu (reference) tới `_id` của collection khác.

## 17. Entity Analysis

### 17.1. User

**Ý nghĩa:** Tài khoản người dùng hệ thống (Parent, Expert, Admin; trẻ có thể đăng nhập qua tài khoản gắn ChildProfile).

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| email | String | | | Email đăng nhập (unique) |
| passwordHash | String | | | Mật khẩu đã mã hóa |
| fullName | String | | | Họ tên |
| role | Enum(parent, expert, admin) | | | Vai trò |
| status | Enum(active, inactive, locked) | | | Trạng thái tài khoản |
| avatarUrl | String | | | Ảnh đại diện |
| isEmailVerified | Boolean | | | Đã xác thực email |
| createdAt | DateTime | | | Ngày tạo |
| updatedAt | DateTime | | | Ngày cập nhật |

**Quan hệ:** 1 User (Parent) — N ChildProfile; 1 User (Expert) — N Lesson; 1 User — N Notification; 1 User — 1 Subscription.

### 17.2. ChildProfile

**Ý nghĩa:** Hồ sơ của một trẻ, thuộc quản lý của Parent.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| parentId | ObjectId | | ✅ (User) | Phụ huynh sở hữu |
| name | String | | | Tên trẻ |
| dateOfBirth | Date | | | Ngày sinh (suy ra tuổi 4–10) |
| avatarUrl | String | | | Ảnh đại diện |
| loginUsername | String | | | Tài khoản đăng nhập của trẻ |
| loginPasswordHash | String | | | Mật khẩu trẻ (mã hóa) |
| preferredSkills | Array(ObjectId) | | ✅ (Skill) | Kỹ năng ưu tiên |
| level | Number | | | Cấp độ hiện tại |
| totalPoints | Number | | | Tổng điểm tích lũy |
| restrictions | Object | | | Cấu hình giới hạn của phụ huynh |
| createdAt | DateTime | | | Ngày tạo |

**Quan hệ:** N ChildProfile — 1 User; 1 ChildProfile — 1 Wallet; 1 ChildProfile — 1 Pet; 1 ChildProfile — N Mission/Submission.

### 17.3. Skill

**Ý nghĩa:** Danh mục kỹ năng sống (vệ sinh, lễ phép, tự lập…).

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| name | String | | | Tên kỹ năng |
| description | String | | | Mô tả |
| ageRange | Object{min,max} | | | Độ tuổi phù hợp |
| icon | String | | | Biểu tượng |
| createdBy | ObjectId | | ✅ (User) | Người tạo (Expert/Admin) |

**Quan hệ:** 1 Skill — N Lesson; 1 Skill — N Mission (Many-to-Many qua tham chiếu).

### 17.4. Lesson

**Ý nghĩa:** Bài học giáo dục do Expert biên soạn.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| title | String | | | Tiêu đề |
| content | String/RichText | | | Nội dung |
| mediaUrls | Array(String) | | | Ảnh/video minh họa |
| skillId | ObjectId | | ✅ (Skill) | Kỹ năng liên quan |
| ageRange | Object{min,max} | | | Độ tuổi phù hợp |
| authorId | ObjectId | | ✅ (User) | Expert tạo |
| status | Enum(draft, pending, published, rejected, unpublished) | | | Trạng thái kiểm duyệt |
| rejectReason | String | | | Lý do từ chối |
| createdAt | DateTime | | | Ngày tạo |

**Quan hệ:** N Lesson — 1 Expert; 1 Lesson — N Quiz; N Lesson — 1 Skill.

### 17.5. Quiz

**Ý nghĩa:** Bộ câu hỏi trắc nghiệm gắn với bài học.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| lessonId | ObjectId | | ✅ (Lesson) | Bài học liên quan |
| title | String | | | Tiêu đề quiz |
| passScore | Number | | | Điểm đạt tối thiểu |
| rewardPoints | Number | | | Điểm thưởng khi đạt |
| authorId | ObjectId | | ✅ (User) | Expert tạo |
| createdAt | DateTime | | | Ngày tạo |

**Quan hệ:** N Quiz — 1 Lesson; 1 Quiz — N Question.

### 17.6. Question

**Ý nghĩa:** Câu hỏi thuộc một quiz.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| quizId | ObjectId | | ✅ (Quiz) | Quiz chứa câu hỏi |
| content | String | | | Nội dung câu hỏi |
| options | Array(String) | | | Các lựa chọn |
| correctIndex | Number | | | Chỉ số đáp án đúng |
| mediaUrl | String | | | Hình minh họa (nếu có) |

**Quan hệ:** N Question — 1 Quiz.

### 17.7. Checklist

**Ý nghĩa:** Danh sách các bước con của một nhiệm vụ.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| missionId | ObjectId | | ✅ (Mission) | Nhiệm vụ chứa checklist |
| items | Array(Object{text, isDone}) | | | Các bước và trạng thái |

**Quan hệ:** 1 Checklist — 1 Mission.

### 17.8. Mission

**Ý nghĩa:** Nhiệm vụ giao cho trẻ thực hiện ngoài đời.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| title | String | | | Tên nhiệm vụ |
| description | String | | | Mô tả |
| childId | ObjectId | | ✅ (ChildProfile) | Trẻ được giao |
| createdBy | ObjectId | | ✅ (User) | Người tạo (Parent/Expert) |
| skillId | ObjectId | | ✅ (Skill) | Kỹ năng liên quan |
| rewardPoints | Number | | | Điểm thưởng |
| dueDate | DateTime | | | Hạn hoàn thành |
| recurrence | Enum(none, daily, weekly) | | | Lịch lặp lại |
| status | Enum(todo, pending_review, completed, overdue, redo) | | | Trạng thái |
| createdAt | DateTime | | | Ngày tạo |

**Quan hệ:** N Mission — 1 ChildProfile; 1 Mission — N Submission; 1 Mission — 1 Checklist.

### 17.9. Submission

**Ý nghĩa:** Bằng chứng trẻ nộp cho một nhiệm vụ.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| missionId | ObjectId | | ✅ (Mission) | Nhiệm vụ liên quan |
| childId | ObjectId | | ✅ (ChildProfile) | Trẻ nộp |
| evidenceUrls | Array(String) | | | Ảnh/video (Cloud Storage) |
| aiResult | Object{label, confidence} | | | Kết quả AI |
| aiLogId | ObjectId | | ✅ (AILog) | Bản ghi log AI |
| status | Enum(submitted, pending_review, approved, rejected) | | | Trạng thái |
| reviewedBy | ObjectId | | ✅ (User) | Parent phê duyệt |
| rejectReason | String | | | Lý do từ chối |
| createdAt | DateTime | | | Ngày nộp |

**Quan hệ:** N Submission — 1 Mission; N Submission — 1 ChildProfile; 1 Submission — 1 AILog.

### 17.10. Wallet

**Ý nghĩa:** Ví điểm thưởng của trẻ.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| childId | ObjectId | | ✅ (ChildProfile) | Chủ ví (1-1) |
| balance | Number | | | Số dư điểm (≥ 0) |
| history | Array(Object{type, amount, refId, createdAt}) | | | Lịch sử biến động |

**Quan hệ:** 1 Wallet — 1 ChildProfile.

### 17.11. Pet

**Ý nghĩa:** Thú cưng ảo gắn với trẻ.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| childId | ObjectId | | ✅ (ChildProfile) | Chủ sở hữu (1-1) |
| name | String | | | Tên thú cưng |
| level | Number | | | Cấp độ |
| mood | Enum(happy, normal, sad) | | | Tâm trạng |
| appearance | String | | | Ngoại hình theo cấp |
| lastFedAt | DateTime | | | Lần chăm sóc gần nhất |

**Quan hệ:** 1 Pet — 1 ChildProfile.

### 17.12. Reward

**Ý nghĩa:** Phần thưởng (ảo/thực) có thể đổi bằng điểm.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| parentId | ObjectId | | ✅ (User) | Người tạo |
| name | String | | | Tên phần thưởng |
| type | Enum(virtual, physical) | | | Loại thưởng |
| pointCost | Number | | | Giá điểm |
| status | Enum(available, redeemed, disabled) | | | Trạng thái |
| createdAt | DateTime | | | Ngày tạo |

**Quan hệ:** N Reward — 1 Parent; N Reward — N ChildProfile (qua yêu cầu đổi).

### 17.13. Certificate

**Ý nghĩa:** Chứng nhận thành tích của trẻ.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| childId | ObjectId | | ✅ (ChildProfile) | Trẻ đạt |
| title | String | | | Tên chứng nhận |
| criteria | String | | | Điều kiện đạt |
| issuedAt | DateTime | | | Ngày cấp |
| fileUrl | String | | | Tệp chứng nhận |

**Quan hệ:** N Certificate — 1 ChildProfile.

### 17.14. Notification

**Ý nghĩa:** Thông báo gửi tới người dùng.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| receiverId | ObjectId | | ✅ (User) | Người nhận |
| type | String | | | Loại thông báo |
| title | String | | | Tiêu đề |
| content | String | | | Nội dung |
| channel | Enum(push, in_app) | | | Kênh gửi |
| priority | Enum(low, normal, high) | | | Mức ưu tiên |
| isRead | Boolean | | | Đã đọc |
| actionUrl | String | | | Liên kết hành động |
| createdAt | DateTime | | | Ngày tạo |

**Quan hệ:** N Notification — 1 User.

### 17.15. Subscription

**Ý nghĩa:** Gói Premium của một tài khoản Parent.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| userId | ObjectId | | ✅ (User) | Chủ tài khoản |
| plan | Enum(free, premium_monthly, premium_yearly) | | | Loại gói |
| status | Enum(active, expired, cancelled) | | | Trạng thái |
| startDate | DateTime | | | Ngày bắt đầu |
| endDate | DateTime | | | Ngày hết hạn |
| autoRenew | Boolean | | | Tự động gia hạn |

**Quan hệ:** 1 Subscription — 1 User; 1 Subscription — N Transaction.

### 17.16. Transaction

**Ý nghĩa:** Giao dịch thanh toán.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| userId | ObjectId | | ✅ (User) | Người thanh toán |
| subscriptionId | ObjectId | | ✅ (Subscription) | Gói liên quan |
| amount | Number | | | Số tiền |
| currency | String | | | Loại tiền |
| gatewayRef | String | | | Mã tham chiếu cổng thanh toán |
| status | Enum(pending, success, failed, refunded) | | | Trạng thái |
| createdAt | DateTime | | | Ngày giao dịch |

**Quan hệ:** N Transaction — 1 User; N Transaction — 1 Subscription.

### 17.17. AILog

**Ý nghĩa:** Nhật ký kết quả phân tích của AI cho mỗi bằng chứng.

| Thuộc tính | Kiểu dữ liệu | PK | FK | Mô tả |
|------------|--------------|:--:|:--:|-------|
| _id | ObjectId | ✅ | | Khóa chính |
| submissionId | ObjectId | | ✅ (Submission) | Bằng chứng liên quan |
| inputRef | String | | | Tham chiếu tệp đầu vào |
| labels | Array(String) | | | Nhãn nhận diện |
| confidence | Number | | | Điểm tin cậy (0–1) |
| recommendation | Enum(approve, review, reject) | | | Khuyến nghị |
| model | String | | | Phiên bản mô hình |
| createdAt | DateTime | | | Thời điểm phân tích |

**Quan hệ:** 1 AILog — 1 Submission.

---

## 18. Relationship Analysis

### 18.1. One-to-One

| Quan hệ | Giải thích lý do |
|---------|-------------------|
| ChildProfile — Wallet | Mỗi trẻ có duy nhất một ví điểm để đảm bảo toàn vẹn số dư |
| ChildProfile — Pet | Mỗi trẻ có một thú cưng ảo đại diện tiến trình cá nhân |
| User — Subscription | Mỗi tài khoản có một trạng thái gói hiện hành duy nhất |
| Submission — AILog | Mỗi lần nộp bằng chứng sinh đúng một bản ghi phân tích AI |

### 18.2. One-to-Many

| Quan hệ | Giải thích lý do |
|---------|-------------------|
| User (Parent) — ChildProfile | Một phụ huynh quản lý nhiều con |
| User (Expert) — Lesson | Một chuyên gia tạo nhiều bài học |
| Lesson — Quiz | Một bài học có thể có nhiều quiz |
| Quiz — Question | Một quiz gồm nhiều câu hỏi |
| ChildProfile — Mission | Một trẻ được giao nhiều nhiệm vụ |
| Mission — Submission | Một nhiệm vụ (lặp lại) có nhiều lần nộp |
| User — Notification | Một người dùng nhận nhiều thông báo |
| Subscription — Transaction | Một gói phát sinh nhiều giao dịch (mua, gia hạn) |
| Mission — Checklist | Một nhiệm vụ có một checklist gồm nhiều mục |

### 18.3. Many-to-Many

| Quan hệ | Cách thể hiện | Giải thích lý do |
|---------|----------------|-------------------|
| ChildProfile — Skill | Mảng `preferredSkills` | Một trẻ quan tâm nhiều kỹ năng; một kỹ năng thuộc nhiều trẻ |
| Lesson — Skill | Tham chiếu | Một bài học có thể phục vụ nhiều kỹ năng (thường 1 chính) |
| ChildProfile — Reward | Bản ghi yêu cầu đổi thưởng | Nhiều trẻ đổi cùng loại thưởng; một trẻ đổi nhiều thưởng |

> **Ghi chú thiết kế:** Với MongoDB, quan hệ 1-N và N-N có thể triển khai bằng **reference** (lưu ObjectId) hoặc **embedding** (nhúng document con). Chọn embedding cho dữ liệu gắn chặt, ít truy vấn độc lập (ví dụ Checklist trong Mission, history trong Wallet); dùng reference cho dữ liệu lớn/độc lập (Lesson, Submission) để tránh document phình to.

---

## 19. Validation Rules

| Mã | Đối tượng | Quy tắc kiểm tra dữ liệu |
|----|-----------|---------------------------|
| VR-01 | User.email | Đúng định dạng email, duy nhất trong hệ thống |
| VR-02 | User.password | Tối thiểu 8 ký tự, gồm chữ và số; lưu dạng hash |
| VR-03 | User.role | Thuộc {parent, expert, admin} |
| VR-04 | ChildProfile.dateOfBirth | Tuổi suy ra nằm trong 4–10 (cảnh báo nếu ngoài) |
| VR-05 | ChildProfile.name | Bắt buộc, 1–50 ký tự |
| VR-06 | Lesson.title | Bắt buộc, 3–150 ký tự |
| VR-07 | Lesson.ageRange | min ≤ max, nằm trong 4–10 |
| VR-08 | Quiz.passScore | Số ≥ 0 và ≤ tổng điểm quiz |
| VR-09 | Question.correctIndex | Chỉ số hợp lệ trong mảng options |
| VR-10 | Question.options | Tối thiểu 2 lựa chọn |
| VR-11 | Mission.rewardPoints | Số nguyên ≥ 0 |
| VR-12 | Mission.dueDate | Không ở quá khứ tại thời điểm tạo |
| VR-13 | Submission.evidenceUrls | Tối thiểu 1 tệp; định dạng ảnh/video hợp lệ; dung lượng ≤ giới hạn |
| VR-14 | Wallet.balance | Luôn ≥ 0 |
| VR-15 | Reward.pointCost | Số nguyên > 0 |
| VR-16 | AILog.confidence | Giá trị trong [0, 1] |
| VR-17 | Subscription.endDate | Sau startDate |
| VR-18 | Transaction.amount | > 0, đúng loại tiền hỗ trợ |
| VR-19 | Notification.channel | Thuộc {push, in_app} |
| VR-20 | Mọi trường bắt buộc | Không được null/rỗng khi tạo bản ghi |

---

## 20. Business Constraints

| Mã | Ràng buộc nghiệp vụ |
|----|----------------------|
| BC-01 | Mỗi ChildProfile bắt buộc thuộc về đúng một Parent (không mồ côi) |
| BC-02 | Không thể xóa Parent khi còn ChildProfile hoạt động (phải xử lý dữ liệu con trước) |
| BC-03 | Chỉ nội dung ở trạng thái `published` mới hiển thị cho Parent/Child |
| BC-04 | Trẻ chỉ được gán/nhìn thấy nội dung phù hợp `ageRange` với tuổi của mình |
| BC-05 | Một Submission được duyệt thì không thể chỉnh sửa lại kết quả (chỉ lưu vết) |
| BC-06 | Điểm thưởng của một nhiệm vụ chỉ được cộng đúng một lần cho mỗi lần hoàn thành hợp lệ |
| BC-07 | Không cho phép trừ điểm khiến Wallet.balance âm |
| BC-08 | Đổi thưởng thực bắt buộc qua bước duyệt của Parent trước khi trừ điểm |
| BC-09 | Quyền lợi Premium chỉ áp dụng khi Subscription.status = active và chưa quá endDate |
| BC-10 | Mỗi trẻ tại một thời điểm chỉ có một Wallet và một Pet đang hoạt động |
| BC-11 | Expert chỉ thao tác trên nội dung có authorId trùng với chính mình |
| BC-12 | Mọi hành động nhạy cảm (duyệt, thanh toán, khóa tài khoản) phải ghi log để truy vết |
| BC-13 | Tài khoản `locked` bị chặn mọi thao tác nghiệp vụ cho đến khi mở khóa |
| BC-14 | Nhiệm vụ `completed` hoặc `overdue` không thể quay lại `todo` (chỉ tạo lần lặp mới) |

---

# GIAI ĐOẠN 5. TECHNICAL ANALYSIS

## 21. API Analysis

Thiết kế REST API theo từng module. Tất cả API dùng chuẩn JSON, base path `/api/v1`. Xác thực qua JWT trong header `Authorization: Bearer <token>` (trừ các endpoint công khai như đăng ký/đăng nhập).

### 21.1. Bảng tổng hợp endpoint theo module

| Module | Method & URL | Chức năng | Auth | Vai trò |
|--------|--------------|-----------|:----:|---------|
| Auth | POST /auth/register | Đăng ký | ❌ | Parent, Expert |
| Auth | POST /auth/login | Đăng nhập | ❌ | Tất cả |
| Auth | POST /auth/refresh | Làm mới token | 🔶 | Tất cả |
| Auth | POST /auth/logout | Đăng xuất | ✅ | Tất cả |
| Auth | POST /auth/forgot-password | Quên mật khẩu | ❌ | Parent, Expert, Admin |
| Auth | POST /auth/reset-password | Đặt lại mật khẩu | 🔶 | Parent, Expert, Admin |
| User | GET /users/me | Xem hồ sơ | ✅ | Tất cả |
| User | PUT /users/me | Cập nhật hồ sơ | ✅ | Parent, Expert, Admin |
| User | GET /users | Danh sách người dùng | ✅ | Admin |
| User | PATCH /users/{id}/status | Khóa/mở tài khoản | ✅ | Admin |
| User | PATCH /experts/{id}/approve | Duyệt tư cách Expert | ✅ | Admin |
| Child | POST /children | Tạo hồ sơ trẻ | ✅ | Parent |
| Child | GET /children | Danh sách trẻ | ✅ | Parent |
| Child | GET /children/{id} | Chi tiết hồ sơ trẻ | ✅ | Parent |
| Child | PUT /children/{id} | Cập nhật hồ sơ trẻ | ✅ | Parent |
| Child | DELETE /children/{id} | Xóa hồ sơ trẻ | ✅ | Parent |
| Skill | GET /skills | Danh sách kỹ năng | ✅ | Tất cả |
| Skill | POST /skills | Tạo kỹ năng | ✅ | Expert, Admin |
| Lesson | POST /lessons | Tạo bài học | ✅ | Expert |
| Lesson | GET /lessons | Danh sách/tìm bài học | ✅ | Tất cả |
| Lesson | GET /lessons/{id} | Chi tiết bài học | ✅ | Tất cả |
| Lesson | PUT /lessons/{id} | Cập nhật bài học | ✅ | Expert |
| Lesson | POST /lessons/{id}/submit | Gửi duyệt | ✅ | Expert |
| Lesson | PATCH /lessons/{id}/moderate | Duyệt/từ chối/publish | ✅ | Admin |
| Quiz | POST /quizzes | Tạo quiz | ✅ | Expert |
| Quiz | GET /quizzes/{id} | Lấy quiz | ✅ | Child, Parent |
| Quiz | POST /quizzes/{id}/submit | Nộp bài quiz | ✅ | Child |
| Mission | POST /missions | Tạo/giao nhiệm vụ | ✅ | Parent |
| Mission | GET /missions | Danh sách nhiệm vụ | ✅ | Parent, Child |
| Mission | PUT /missions/{id} | Cập nhật nhiệm vụ | ✅ | Parent |
| Mission | DELETE /missions/{id} | Xóa nhiệm vụ | ✅ | Parent |
| Submission | POST /missions/{id}/submissions | Nộp bằng chứng | ✅ | Child |
| Submission | GET /submissions?status=pending | Hàng đợi chờ duyệt | ✅ | Parent |
| Submission | PATCH /submissions/{id}/review | Duyệt/từ chối | ✅ | Parent |
| Wallet | GET /children/{id}/wallet | Xem ví | ✅ | Parent, Child |
| Pet | GET /children/{id}/pet | Xem thú cưng | ✅ | Parent, Child |
| Pet | POST /children/{id}/pet/feed | Chăm sóc Pet | ✅ | Child |
| Reward | POST /rewards | Tạo phần thưởng | ✅ | Parent |
| Reward | GET /rewards | Danh sách phần thưởng | ✅ | Parent, Child |
| Reward | POST /rewards/{id}/redeem | Yêu cầu đổi thưởng | ✅ | Child |
| Reward | PATCH /rewards/redemptions/{id}/approve | Duyệt đổi thưởng | ✅ | Parent |
| Report | GET /reports/child/{id} | Báo cáo tiến độ trẻ | ✅ | Parent |
| Report | GET /reports/admin/overview | Báo cáo tổng quan | ✅ | Admin |
| Payment | GET /plans | Danh sách gói | ✅ | Parent |
| Payment | POST /subscriptions | Mua gói Premium | ✅ | Parent |
| Payment | POST /payments/webhook | Nhận webhook thanh toán | 🔶 (chữ ký) | Hệ thống |
| Payment | GET /transactions | Lịch sử giao dịch | ✅ | Parent |
| Notification | GET /notifications | Danh sách thông báo | ✅ | Tất cả |
| Notification | PATCH /notifications/{id}/read | Đánh dấu đã đọc | ✅ | Tất cả |

### 21.2. Đặc tả chi tiết một số API tiêu biểu

#### API: Đăng nhập

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Login |
| **Method** | POST |
| **URL** | /api/v1/auth/login |
| **Description** | Xác thực người dùng và cấp token |
| **Authentication** | Không yêu cầu |
| **Request** | `{ "email": "a@b.com", "password": "******" }` |
| **Response** | `{ "accessToken": "...", "refreshToken": "...", "user": { "id", "role" } }` |
| **Status Code** | 200 OK; 400 Bad Request; 401 Unauthorized; 423 Locked |
| **Validation** | Email đúng định dạng; password không rỗng |
| **Business Rules** | BR-016 (khóa thì từ chối), BR-017 (so khớp hash), FR-009 (khóa khi sai nhiều lần) |

#### API: Tạo hồ sơ trẻ

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Create Child Profile |
| **Method** | POST |
| **URL** | /api/v1/children |
| **Description** | Parent tạo hồ sơ trẻ mới |
| **Authentication** | JWT (role = parent) |
| **Request** | `{ "name", "dateOfBirth", "avatarUrl", "preferredSkills": [] }` |
| **Response** | `{ "id", "name", "walletId", "petId" }` |
| **Status Code** | 201 Created; 400; 401; 403 |
| **Validation** | VR-04, VR-05; tuổi 4–10 |
| **Business Rules** | BR-001, BC-01; tự tạo Wallet & Pet mặc định |

#### API: Nộp bằng chứng

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Submit Evidence |
| **Method** | POST |
| **URL** | /api/v1/missions/{id}/submissions |
| **Description** | Trẻ nộp ảnh/video hoàn thành nhiệm vụ |
| **Authentication** | JWT (role = child) |
| **Request** | multipart/form-data: file(s) + `{ note? }` |
| **Response** | `{ "submissionId", "status": "pending_review", "aiResult": { "label", "confidence" } }` |
| **Status Code** | 201; 400; 401; 413 (file lớn); 422 |
| **Validation** | VR-13; nhiệm vụ đang mở |
| **Business Rules** | BR-006, BR-018; gửi AI, lưu AILog, thông báo Parent |

#### API: Phê duyệt bằng chứng

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Review Submission |
| **Method** | PATCH |
| **URL** | /api/v1/submissions/{id}/review |
| **Description** | Parent duyệt hoặc từ chối bằng chứng |
| **Authentication** | JWT (role = parent, sở hữu trẻ) |
| **Request** | `{ "decision": "approved" \| "rejected", "reason?": "" }` |
| **Response** | `{ "status", "pointsAwarded" }` |
| **Status Code** | 200; 400; 401; 403; 409 (đã duyệt) |
| **Validation** | decision hợp lệ; submission đang chờ duyệt |
| **Business Rules** | BR-006, BR-007, BR-008, BC-05, BC-06 |

#### API: Mua gói Premium

| Thành phần | Nội dung |
|------------|----------|
| **Name** | Create Subscription |
| **Method** | POST |
| **URL** | /api/v1/subscriptions |
| **Description** | Parent khởi tạo thanh toán gói Premium |
| **Authentication** | JWT (role = parent) |
| **Request** | `{ "plan": "premium_monthly", "paymentMethod" }` |
| **Response** | `{ "subscriptionId", "checkoutUrl" \| "status" }` |
| **Status Code** | 201; 400; 401; 402 (thanh toán lỗi) |
| **Validation** | plan hợp lệ |
| **Business Rules** | BR-013, BR-015, BC-09; kích hoạt sau webhook |

---

## 22. Screen Analysis

Danh sách màn hình chính của hệ thống theo vai trò.

### 22.1. Bảng tổng hợp màn hình

| # | Màn hình | Actor | Mục đích |
|---|----------|-------|----------|
| S-01 | Đăng nhập / Đăng ký | Tất cả | Xác thực, tạo tài khoản |
| S-02 | Trang chủ Phụ huynh (Dashboard) | Parent | Tổng quan các con, nhiệm vụ, thông báo |
| S-03 | Quản lý hồ sơ trẻ | Parent | CRUD hồ sơ con |
| S-04 | Tạo/Quản lý nhiệm vụ | Parent | Giao & theo dõi nhiệm vụ |
| S-05 | Hàng đợi phê duyệt bằng chứng | Parent | Duyệt/từ chối submission |
| S-06 | Quản lý phần thưởng & ví | Parent | Tạo thưởng, xem ví con |
| S-07 | Báo cáo tiến độ con | Parent | Thống kê theo kỹ năng |
| S-08 | Gói Premium & Thanh toán | Parent | Mua/gia hạn gói |
| S-09 | Trang chủ Trẻ em | Child | Nhiệm vụ, bài học, Pet |
| S-10 | Học bài | Child | Xem nội dung bài học |
| S-11 | Làm Quiz | Child | Trả lời câu hỏi |
| S-12 | Chi tiết nhiệm vụ & Nộp bằng chứng | Child | Thực hiện, tải bằng chứng |
| S-13 | Ví điểm & Đổi thưởng | Child | Xem điểm, đổi thưởng |
| S-14 | Thú cưng ảo (Pet) | Child | Chăm sóc Pet |
| S-15 | Trang Expert – Soạn nội dung | Expert | Tạo Lesson/Quiz |
| S-16 | Trang Expert – Thống kê | Expert | Xem hiệu quả nội dung |
| S-17 | Trang Admin – Quản lý người dùng | Admin | CRUD, khóa/mở tài khoản |
| S-18 | Trang Admin – Kiểm duyệt nội dung | Admin | Duyệt/từ chối nội dung |
| S-19 | Trang Admin – Báo cáo & cấu hình | Admin | Thống kê, cấu hình hệ thống |
| S-20 | Thông báo | Tất cả | Danh sách thông báo |

### 22.2. Đặc tả chi tiết một số màn hình tiêu biểu

#### S-05: Hàng đợi phê duyệt bằng chứng (Parent)

| Thành phần | Nội dung |
|------------|----------|
| **Purpose** | Cho phép Parent xem và quyết định các bằng chứng chờ duyệt |
| **Actor** | Parent |
| **UI Components** | Danh sách submission, ảnh/video preview, badge gợi ý AI + confidence, nút Duyệt/Từ chối, ô lý do |
| **Input** | Quyết định duyệt/từ chối, lý do (nếu từ chối) |
| **Output** | Trạng thái nhiệm vụ cập nhật, điểm được cộng, thông báo cho trẻ |
| **API sử dụng** | GET /submissions?status=pending; PATCH /submissions/{id}/review |
| **Validation** | Phải chọn quyết định; lý do bắt buộc khi từ chối |
| **Navigation** | Từ Dashboard → hàng đợi duyệt → chi tiết submission |

#### S-12: Chi tiết nhiệm vụ & Nộp bằng chứng (Child)

| Thành phần | Nội dung |
|------------|----------|
| **Purpose** | Cho trẻ xem nhiệm vụ và nộp bằng chứng hoàn thành |
| **Actor** | Child |
| **UI Components** | Mô tả nhiệm vụ, checklist, nút chụp/tải ảnh–video, nút Nộp, trạng thái |
| **Input** | Tệp bằng chứng, tick checklist |
| **Output** | Submission được tạo, trạng thái "Chờ duyệt" |
| **API sử dụng** | GET /missions; POST /missions/{id}/submissions |
| **Validation** | Ít nhất 1 tệp; đúng định dạng, dung lượng cho phép |
| **Navigation** | Trang chủ Trẻ → danh sách nhiệm vụ → chi tiết → nộp |

#### S-09: Trang chủ Trẻ em

| Thành phần | Nội dung |
|------------|----------|
| **Purpose** | Điểm khởi đầu vui nhộn, dẫn trẻ tới nhiệm vụ/bài học/Pet |
| **Actor** | Child |
| **UI Components** | Thú cưng ảo, thanh điểm/level, thẻ nhiệm vụ hôm nay, nút học bài, huy hiệu |
| **Input** | Lựa chọn điều hướng |
| **Output** | Điều hướng tới màn hình tương ứng |
| **API sử dụng** | GET /missions; GET /children/{id}/pet; GET /children/{id}/wallet |
| **Validation** | – |
| **Navigation** | Là màn hình gốc của luồng Trẻ |

#### S-18: Trang Admin – Kiểm duyệt nội dung

| Thành phần | Nội dung |
|------------|----------|
| **Purpose** | Admin duyệt/từ chối nội dung do Expert gửi |
| **Actor** | Admin |
| **UI Components** | Danh sách nội dung chờ duyệt, khung xem trước, nút Duyệt/Publish/Từ chối, ô lý do |
| **Input** | Quyết định kiểm duyệt, lý do |
| **Output** | Nội dung publish hoặc trả về Expert |
| **API sử dụng** | GET /lessons?status=pending; PATCH /lessons/{id}/moderate |
| **Validation** | Lý do bắt buộc khi từ chối |
| **Navigation** | Menu Admin → Kiểm duyệt nội dung → chi tiết |

---

## 23. Navigation Flow

Luồng điều hướng chính cho từng vai trò.

### 23.1. Parent

```
Đăng nhập → Dashboard Phụ huynh
   ├─ Quản lý hồ sơ trẻ → Chi tiết trẻ
   ├─ Nhiệm vụ → Tạo/Sửa nhiệm vụ
   ├─ Hàng đợi phê duyệt → Chi tiết bằng chứng → Duyệt/Từ chối
   ├─ Phần thưởng & Ví → Tạo thưởng / Duyệt đổi thưởng
   ├─ Báo cáo tiến độ con
   ├─ Gói Premium → Thanh toán
   └─ Thông báo
```

### 23.2. Child

```
Đăng nhập → Trang chủ Trẻ (Pet + điểm)
   ├─ Nhiệm vụ hôm nay → Chi tiết → Nộp bằng chứng
   ├─ Học bài → Bài học → Quiz → Kết quả
   ├─ Ví điểm → Đổi thưởng
   └─ Thú cưng ảo → Chăm sóc Pet
```

### 23.3. Expert

```
Đăng nhập → Trang Expert
   ├─ Soạn nội dung → Tạo Lesson/Quiz → Gửi duyệt
   ├─ Nội dung của tôi → Chỉnh sửa / Xem trạng thái
   ├─ Thống kê nội dung
   └─ Thông báo (kết quả duyệt)
```

### 23.4. Admin

```
Đăng nhập → Trang quản trị
   ├─ Quản lý người dùng → Khóa/Mở/Duyệt Expert
   ├─ Kiểm duyệt nội dung → Duyệt/Từ chối/Publish
   ├─ Báo cáo & thống kê
   └─ Cấu hình hệ thống / Gói Premium
```

---

## 24. State Analysis

Phân tích trạng thái (state machine) của các đối tượng có vòng đời.

### 24.1. Mission (Nhiệm vụ)

| Trạng thái | Ý nghĩa | Chuyển tiếp |
|------------|---------|-------------|
| todo | Chờ trẻ thực hiện | → pending_review (khi nộp bằng chứng); → overdue (quá hạn) |
| pending_review | Chờ Parent duyệt | → completed (duyệt); → redo (từ chối) |
| redo | Cần làm lại | → pending_review (nộp lại) |
| completed | Hoàn thành, đã cộng điểm | (kết thúc) |
| overdue | Quá hạn, không cộng điểm | (kết thúc; lần lặp mới tạo bản ghi todo mới) |

### 24.2. Submission (Bằng chứng)

| Trạng thái | Ý nghĩa | Chuyển tiếp |
|------------|---------|-------------|
| submitted | Vừa nộp, đang xử lý AI | → pending_review |
| pending_review | Chờ Parent quyết định | → approved / rejected |
| approved | Được duyệt | (kết thúc) |
| rejected | Bị từ chối | (kết thúc; trẻ có thể nộp submission mới) |

### 24.3. Lesson (Bài học)

| Trạng thái | Ý nghĩa | Chuyển tiếp |
|------------|---------|-------------|
| draft | Đang soạn | → pending |
| pending | Chờ Admin duyệt | → published / rejected |
| rejected | Bị từ chối | → pending (sửa & gửi lại) |
| published | Đang hiển thị | → unpublished |
| unpublished | Đã gỡ | → published (đăng lại) |

### 24.4. Quiz (Lượt làm quiz của trẻ)

| Trạng thái | Ý nghĩa | Chuyển tiếp |
|------------|---------|-------------|
| not_started | Chưa làm | → in_progress |
| in_progress | Đang làm | → submitted |
| submitted | Đã nộp, chấm điểm | → passed / failed |
| passed | Đạt, đã cộng điểm | (kết thúc) |
| failed | Chưa đạt | → in_progress (làm lại) |

### 24.5. Pet (Thú cưng)

| Trạng thái | Ý nghĩa | Chuyển tiếp |
|------------|---------|-------------|
| happy | Được chăm sóc đều | → normal (nếu ít tương tác) |
| normal | Bình thường | → happy / sad |
| sad | Ít được chăm sóc | → normal (khi chăm sóc lại) |
| (level up) | Nâng cấp khi đủ điểm chăm sóc | thay đổi appearance |

### 24.6. Subscription (Gói Premium)

| Trạng thái | Ý nghĩa | Chuyển tiếp |
|------------|---------|-------------|
| active | Đang hiệu lực | → expired (hết hạn); → cancelled (hủy) |
| expired | Hết hạn | → active (gia hạn/mua lại) |
| cancelled | Đã hủy gia hạn | → active (mua lại) |

---

## 25. Notification Analysis

Phân tích các loại thông báo của hệ thống.

| Loại thông báo | Trigger | Receiver | Channel | Priority | Nội dung | Action |
|-----------------|---------|----------|---------|----------|----------|--------|
| Nhắc nhiệm vụ đến hạn | Nhiệm vụ sắp/đến hạn | Child, Parent | Push, In-app | Normal | "Nhiệm vụ X sắp đến hạn" | Mở chi tiết nhiệm vụ |
| Bằng chứng chờ duyệt | Trẻ nộp submission | Parent | Push, In-app | High | "Con vừa nộp bằng chứng cho X" | Mở hàng đợi duyệt |
| Kết quả duyệt bằng chứng | Parent duyệt/từ chối | Child | Push, In-app | Normal | "Nhiệm vụ X được duyệt/cần làm lại" | Mở nhiệm vụ |
| Nội dung được duyệt/từ chối | Admin kiểm duyệt | Expert | Push, In-app | Normal | "Nội dung X đã được duyệt/từ chối" | Mở nội dung |
| Kết quả thanh toán | Webhook Payment Gateway | Parent | Push, In-app | High | "Thanh toán gói Premium thành công/thất bại" | Mở trang gói |
| Đạt huy hiệu/chứng nhận | Trẻ đạt mốc | Child, Parent | In-app | Low | "Con đạt huy hiệu Y" | Mở trang thành tích |
| Sắp hết hạn Premium | Trước ngày endDate | Parent | Push, In-app | Normal | "Gói Premium sắp hết hạn" | Mở trang gia hạn |
| Tài khoản bị khóa | Admin khóa | Parent/Expert | Push, Email | High | "Tài khoản của bạn đã bị khóa" | Liên hệ hỗ trợ |

---

## 26. AI Analysis

### 26.1. AI Features (Tính năng AI)

- **Xác minh bằng chứng nhiệm vụ:** phân tích ảnh/video trẻ nộp để đánh giá mức độ khớp với nội dung nhiệm vụ.
- **Gợi ý quyết định:** đề xuất approve/review/reject kèm điểm tin cậy để hỗ trợ Parent.
- **(Mở rộng) Gợi ý nội dung/nhiệm vụ:** đề xuất bài học/nhiệm vụ phù hợp độ tuổi và kỹ năng.

### 26.2. AI Input

- Tệp bằng chứng (ảnh/video) từ Cloud Storage.
- Ngữ cảnh nhiệm vụ: tiêu đề, mô tả, kỹ năng liên quan, độ tuổi trẻ.

### 26.3. AI Output

- Danh sách nhãn nhận diện (labels).
- Điểm tin cậy `confidence` ∈ [0, 1].
- Khuyến nghị: `approve` / `review` / `reject`.

### 26.4. Verification Flow

```
Submission → gửi AI Service (input: media + ngữ cảnh)
   → AI trả labels + confidence + recommendation
   → Lưu AILog
   → So confidence với ngưỡng cấu hình:
        ≥ ngưỡng cao   → gợi ý "approve"
        trong khoảng    → gợi ý "review" (Parent xem kỹ)
        ≤ ngưỡng thấp   → gợi ý "reject"
   → Parent xem gợi ý và quyết định cuối (Parent Override)
```

### 26.5. Confidence Score

Điểm tin cậy phản ánh mức độ chắc chắn của AI. Hệ thống dùng hai ngưỡng cấu hình (ví dụ 0.85 và 0.5) để phân nhóm gợi ý. Confidence **không** thay quyết định của Parent mà chỉ để sắp xếp ưu tiên và cảnh báo.

### 26.6. Labels

Ví dụ nhãn: `tooth_brushing`, `tidy_room`, `reading`, `hand_washing`, `unclear_image`, `no_person_detected`. Nhãn giúp đối chiếu với kỹ năng của nhiệm vụ.

### 26.7. Limitations (Giới hạn)

- Có thể sai với ảnh mờ, thiếu sáng, góc chụp bất thường.
- Không hiểu đầy đủ ngữ cảnh phức tạp ngoài đời.
- Rủi ro thiên lệch dữ liệu huấn luyện; cần Parent kiểm chứng.
- Không dùng để ra quyết định tự động ảnh hưởng đến trẻ nếu không có Parent.

### 26.8. Parent Override

Parent luôn có quyền phủ quyết gợi ý của AI (duyệt dù AI đề xuất reject, hoặc ngược lại). Đây là nguyên tắc an toàn cốt lõi (BR-007): AI hỗ trợ, con người quyết định.

---

## 27. Security Analysis

| Hạng mục | Giải pháp |
|----------|-----------|
| **JWT** | Access token ký bằng khóa bí mật, thời hạn ngắn (ví dụ 15 phút), chứa userId & role |
| **RBAC** | Middleware kiểm tra vai trò & quyền sở hữu tài nguyên trên từng endpoint |
| **Refresh Token** | Thời hạn dài hơn, lưu an toàn, có thể thu hồi; xoay vòng (rotation) khi dùng |
| **Password Encryption** | Băm mật khẩu bằng bcrypt/argon2 với salt; không lưu plaintext |
| **API Security** | Validate & sanitize đầu vào, chống injection, CORS whitelist, HTTPS bắt buộc |
| **Rate Limiting** | Giới hạn số request theo IP/tài khoản; siết chặt cho endpoint đăng nhập |
| **Data Encryption** | TLS khi truyền; mã hóa trường nhạy cảm khi lưu; ký/giới hạn quyền URL Cloud Storage |
| **Audit Log** | Ghi log hành động nhạy cảm (đăng nhập, duyệt, thanh toán, khóa tài khoản) |
| **Privacy Protection** | Tối thiểu hóa dữ liệu trẻ; kiểm soát truy cập media; ẩn dữ liệu nhạy cảm khỏi log; tuân thủ quy định bảo vệ trẻ em |

**Bổ sung phòng thủ theo tầng:** xác thực → phân quyền → validate dữ liệu → rate limit → mã hóa → giám sát & log, đảm bảo an toàn xuyên suốt vòng đời request.

---

## 28. Integration Analysis

Phân tích các dịch vụ tích hợp bên ngoài.

### 28.1. AI Service

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Phân tích & xác minh bằng chứng nhiệm vụ |
| **Dữ liệu trao đổi** | Gửi: media + ngữ cảnh; Nhận: labels, confidence, recommendation |
| **API sử dụng** | REST/HTTPS tới AI Service (endpoint phân tích ảnh/video) |
| **Rủi ro** | Trễ, timeout, sai kết quả, chi phí, giới hạn quota |
| **Phương án khi không khả dụng** | Chuyển submission sang duyệt thủ công (Parent), hàng đợi retry, cảnh báo Admin |

### 28.2. Cloud Storage

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Lưu trữ media (bằng chứng, ảnh bài học, avatar) |
| **Dữ liệu trao đổi** | Upload/download tệp; URL có ký/hết hạn |
| **API sử dụng** | SDK/REST của nhà cung cấp; presigned URL |
| **Rủi ro** | Lộ URL, chi phí lưu trữ, sự cố nhà cung cấp |
| **Phương án khi không khả dụng** | Retry upload, lưu tạm hàng đợi, thông báo lỗi cho người dùng |

### 28.3. Firebase Cloud Messaging (Push Notification)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Gửi thông báo đẩy tới thiết bị |
| **Dữ liệu trao đổi** | Gửi: device token, tiêu đề, nội dung, payload |
| **API sử dụng** | FCM Admin SDK/HTTP v1 |
| **Rủi ro** | Token hết hạn, gửi trễ, không đến |
| **Phương án khi không khả dụng** | Fallback thông báo in-app, lưu để hiển thị khi mở app, retry |

### 28.4. Payment Gateway

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Xử lý thanh toán gói Premium |
| **Dữ liệu trao đổi** | Gửi: thông tin đơn hàng; Nhận: kết quả qua webhook |
| **API sử dụng** | REST API + Webhook (có xác thực chữ ký) |
| **Rủi ro** | Thanh toán lỗi, webhook trễ/giả mạo, đối soát sai |
| **Phương án khi không khả dụng** | Giữ trạng thái pending, xác thực chữ ký webhook, đối soát định kỳ, retry, thông báo người dùng |

### 28.5. Email Service

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Gửi email xác thực, đặt lại mật khẩu, thông báo quan trọng |
| **Dữ liệu trao đổi** | Gửi: địa chỉ nhận, tiêu đề, nội dung template |
| **API sử dụng** | SMTP/REST của nhà cung cấp email |
| **Rủi ro** | Vào spam, gửi trễ, giới hạn số lượng |
| **Phương án khi không khả dụng** | Hàng đợi gửi lại, dùng nhà cung cấp dự phòng, thông báo in-app |

### 28.6. Analytics Service

| Thuộc tính | Nội dung |
|------------|----------|
| **Mục đích** | Thu thập số liệu hành vi để đo KPI |
| **Dữ liệu trao đổi** | Gửi: sự kiện ẩn danh/định danh tối thiểu |
| **API sử dụng** | SDK/REST của nền tảng analytics |
| **Rủi ro** | Rò rỉ dữ liệu, ảnh hưởng hiệu năng, tuân thủ quyền riêng tư |
| **Phương án khi không khả dụng** | Ghi log nội bộ, gửi bù sau, không chặn luồng chính |

---

## PHỤ LỤC – TỔNG KẾT

Bộ tài liệu đã bao phủ đầy đủ 28 mục qua 5 giai đoạn phân tích:

| Giai đoạn | Mục | Trạng thái |
|-----------|-----|:----------:|
| 1. Product Analysis | 1–3 | ✅ |
| 2. Business Analysis | 4–10 (108 FR, 16 NFR, 22 BR) | ✅ |
| 3. System Analysis | 11–16 | ✅ |
| 4. Database Analysis | 17–20 (17 Entity) | ✅ |
| 5. Technical Analysis | 21–28 | ✅ |

Tài liệu này là cơ sở để chuyển sang thiết kế chi tiết Database (schema MongoDB), đặc tả API đầy đủ, và triển khai Frontend (ReactJS) / Backend (Node.js + ExpressJS).

*— Hết —*
