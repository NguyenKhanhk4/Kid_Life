# 📘 BẢN THIẾT KẾ CHI TIẾT & BẰNG NHAU 100% CÔNG VIỆC DỰ ÁN KIDLIFE CHO 3 DEV
## (Chuẩn 7 - 7 - 7 Chức Năng | Đầy Đủ Database Schema, API Spec, Frontend Screens & Developer Action Checklist)

Tài liệu này chi tiết hóa toàn bộ **21 Chức năng hệ thống KidLife**, phân chia **CÂN BẰNG NGUYÊN KHỐI 100%: MỖI DEV ĐÚNG 7 CHỨC NĂNG (7 - 7 - 7)**.

Mỗi chức năng bao gồm: **Luồng người dùng (User Flow)**, **API Endpoints (HTTP Method, Path, Params)**, **Cấu trúc Bảng CSDL (DB Schemas)**, **Màn hình Frontend**, và **Danh sách Việc Cần Code (Action Checklist)**.

---

## 🛡️ QUI TRÌNH LẬP TRÌNH SONG SONG (KHÔNG CHỜ NHAU & MERGE KHÔNG CONFLICT)

1. **Giao thức API Types Chung (`shared/types`)**: Các Dev định nghĩa sẵn Data DTOs trong `types/`. Frontend code UI theo DTO, Backend code API theo DTO $\rightarrow$ **Code song song 100% không phụ thuộc**.
2. **Quyền sở hữu Thư mục (Directory Ownership)**: Dev nào quản lý thư mục nào thì chỉ sửa code trong thư mục đó.
3. **Quy trình Git Branch**: Mỗi Dev tạo 1 branch (`feature/dev1-auth-family`, `feature/dev2-tasks-bank`, `feature/dev3-pet-ai-stories`). Khi tạo Pull Request (PR) merge vào `main`, Git sẽ **Auto-Merge 100% mượt mà không có conflict**.

---

## 📊 BẢNG TỔNG QUAN PHÂN CHIA 21 CHỨC NĂNG (CHUẨN 7 - 7 - 7)

| Dev | Phân Vùng Phụ Trách | Số Chức Năng | Thư Mục Backend & Frontend Sở Hữu |
|---|---|---|---|
| **DEV 1** | **Hệ Thống, Tài Khoản, Phân Quyền Gia Đình, Cộng Đồng & Admin** | **7 Chức Năng** | `backend/src/modules/{auth,users,children,community}/`<br>`web/src/modules/{auth,admin}/`, `ParentAccountPage`, `ParentCommunityPage`, `ChildAccountPage` |
| **DEV 2** | **Nhiệm Vụ, Duyệt Bài, Ngân Hàng Ảo, Phần Thưởng & Bài Học Quiz** | **7 Chức Năng** | `backend/src/modules/{missions,submissions,wallet,rewards,lessons,quizzes}/`<br>`ParentTasksPage`, `ParentApprovalPage`, `ParentBankPage`, `ChildTasksPage`, `ChildWalletPage`, `LessonLibraryPage`, `QuizPage` |
| **DEV 3** | **Thú Cưng Gamification, AI Kỹ Năng, Voice Studio, Memory Lane & Điều Ước** | **7 Chức Năng** | `backend/src/modules/{pet,reports,stories,wishes,milestones}/`<br>`ParentAiAnalyticsPage`, `ParentStoryStudioPage`, `ParentMemoryLanePage`, `ChildPetPage`, `ChildStoriesPage`, `ChildWishesPage`, `ViralMilestoneModal` |

---

# 👤 DEVELOPER 1: HỆ THỐNG, TÀI KHOẢN, PHÂN QUYỀN GIA ĐÌNH, CỘNG ĐỒNG & ADMIN (7 CHỨC NĂNG)

### 📂 Thư Mục Sở Hữu (Files & Folders):
- **Backend:** `backend/src/modules/auth/`, `users/`, `children/`, `community/`
- **Frontend:** `web/src/modules/auth/`, `admin/`, `ParentAccountPage.tsx`, `ParentCommunityPage.tsx`, `ChildAccountPage.tsx`
- **Database Tables:** `users`, `children`, `family_members`, `forum_posts`, `forum_comments`, `leaderboards`, `notifications`.

---

### 🛠️ CHI TIẾT 7 CHỨC NĂNG DEV 1:

#### 1.1. Xác Thực & Quản Lý Phiên Đăng Nhập (Auth & Session Engine)
- **User Flow:** User nhập email/mật khẩu $\rightarrow$ Đăng ký/Đăng nhập $\rightarrow$ Backend cấp JWT AccessToken & RefreshToken $\rightarrow$ Chuyển sang màn Chọn Vai Trò (Bố/Mẹ/Con).
- **Backend API:**
  - `POST /api/auth/register` (Body: `{ email, password, fullName, phone }`)
  - `POST /api/auth/login` (Body: `{ email, password }` $\rightarrow$ Trả về `{ token, user }`)
  - `POST /api/auth/refresh-token` (Refresh session)
- **Database Table (`users`):**
  - `id` (UUID, Primary Key), `email` (String, Unique), `password_hash` (String), `full_name` (String), `phone` (String), `role` (Enum: 'admin', 'parent', 'child'), `refresh_token` (Text), `created_at` (Timestamp).
- **Frontend Screens:** `LoginPage.tsx`, `RoleSelectionPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API Auth Controller & Service với Bcrypt & JWT Auth Middleware.
  - [ ] Nối Form Login & Form Register phía React Frontend.

#### 1.2. Đồng Quản Lý Gia Đình & Phân Quyền RBAC (Co-Parenting System)
- **User Flow:** Bố/Mẹ Admin mở Quản lý gia đình $\rightarrow$ Nhập SĐT/Email gửi lời mời thành viên (Vợ/Chồng/Ông/Bà) $\rightarrow$ Thành viên đăng nhập được áp dụng phân quyền RBAC (Bố/Mẹ: Full quyền, Ông/Bà: Chỉ xem nhật ký & tặng quà).
- **Backend API:**
  - `GET /api/family/members` (Lấy danh sách thành viên gia đình)
  - `POST /api/family/invite` (Body: `{ phone, role: 'parent' | 'grandparent' }`)
  - `PUT /api/family/members/:id/role` (Cập nhật quyền thành viên)
- **Database Table (`family_members`):**
  - `id` (UUID), `family_id` (UUID), `user_id` (UUID), `role` (Enum: 'admin', 'parent', 'grandparent'), `phone` (String), `status` (Enum: 'active', 'pending').
- **Frontend Screens:** `ParentAccountPage.tsx` (Section Đồng quản lý gia đình).
- **Action Checklist:**
  - [ ] Viết API quản lý thành viên & middleware kiểm tra quyền RBAC.
  - [ ] Nối bảng thành viên & Modal gửi lời mời trong `ParentAccountPage`.

#### 1.3. Quản Lý Hồ Sơ Các Bé & Đặt Mật Khẩu PIN (Child Profile Management)
- **User Flow:** Bố/Mẹ tạo profile cho con (tên, tuổi, avatar) $\rightarrow$ Đặt mã PIN bảo mật cho bé $\rightarrow$ Chọn tài khoản bé nhanh trên Header Trang Chủ.
- **Backend API:**
  - `GET /api/children` & `POST /api/children` (Body: `{ name, age, avatar, pinCode }`)
  - `PUT /api/children/:id` & `POST /api/children/:id/reset-pin`
- **Database Table (`children`):**
  - `id` (UUID), `parent_id` (UUID), `name` (String), `age` (Int), `avatar` (String), `level` (Int), `xp` (Int), `streak` (Int), `pin_code` (String).
- **Frontend Screens:** `ParentAccountPage.tsx`, `ChildAccountPage.tsx` & Selector đổi bé trên `ParentHomePage.tsx`.
- **Action Checklist:**
  - [ ] Viết API CRUD Child Profile.
  - [ ] Nối Selector `ChildPicker` và Form sửa thông tin bé.

#### 1.4. Diễn Đàn Cộng Đồng Phụ Huynh (Parent Community Forum)
- **User Flow:** Phụ huynh lướt xem các bài viết nuôi dạy con $\rightarrow$ Bấm nút "Đăng bài mới" $\rightarrow$ Thả tim / Bình luận trao đổi thắc mắc dưới các bài viết.
- **Backend API:**
  - `GET /api/community/posts` (Query: `?page=1&tag=kynang`)
  - `POST /api/community/posts` (Body: `{ title, content, tags }`)
  - `POST /api/community/posts/:id/like` & `POST /api/community/posts/:id/comments`
- **Database Tables (`forum_posts`, `forum_comments`):**
  - `forum_posts`: `id`, `author_id`, `title`, `content`, `tags`, `likes_count`, `comments_count`, `created_at`.
  - `forum_comments`: `id`, `post_id`, `author_id`, `comment_text`, `created_at`.
- **Frontend Screens:** `ParentCommunityPage.tsx` (Tab Diễn đàn).
- **Action Checklist:**
  - [ ] Viết API Forum Posts & Comments.
  - [ ] Nối danh sách bài viết & Modal Đăng bài trong React.

#### 1.5. Thử Thách & Bảng Xếp Hạng Gia Đình (Family Leaderboard Engine)
- **User Flow:** Phụ huynh bấm "Tham gia Thử thách 14 ngày tự lập" $\rightarrow$ Hệ thống đưa gia đình vào Bảng xếp hạng Top 50 real-time $\rightarrow$ Hết chu kỳ đếm ngược trao Cúp Vàng & Huy hiệu.
- **Backend API:**
  - `GET /api/community/challenges` & `POST /api/community/challenges/:id/join`
  - `GET /api/community/leaderboard` (Trả về Top 50 gia đình dẫn đầu)
- **Database Tables (`challenges`, `leaderboards`):**
  - `challenges`: `id`, `title`, `description`, `duration_days`, `start_date`, `end_date`.
  - `leaderboards`: `id`, `challenge_id`, `family_id`, `points`, `streak`, `rank`.
- **Frontend Screens:** `ParentCommunityPage.tsx` (Tab Thử thách & Bảng xếp hạng).
- **Action Checklist:**
  - [ ] Viết API Leaderboard xếp hạng theo điểm số.
  - [ ] Nối giao diện Bảng xếp hạng Top 50 gia đình.

#### 1.6. Trung Tâm Thông Báo Đẩy & Cài Đặt (Notifications & Settings)
- **User Flow:** Hệ thống tự gửi thông báo khi bé nộp bài làm, gửi ước nguyện $\rightarrow$ Chuông thông báo hiển thị chấm đỏ $\rightarrow$ Phụ huynh bấm xem danh sách thông báo.
- **Backend API:**
  - `GET /api/notifications` & `PUT /api/notifications/:id/read`
  - `PUT /api/users/change-password`
- **Database Table (`notifications`):**
  - `id` (UUID), `user_id` (UUID), `type` (String), `title` (String), `body` (String), `target_url` (String), `is_read` (Boolean).
- **Frontend Screens:** Header chuông thông báo & Form Cài đặt bảo mật.
- **Action Checklist:**
  - [ ] Viết Notification Service tự phát thông báo sự kiện.
  - [ ] Nối Menu Chuông thông báo trên Header.

#### 1.7. Trang Chủ Admin Quản Trị Hệ Thống (Admin System Dashboard)
- **User Flow:** Admin đăng nhập tài khoản Quản trị $\rightarrow$ Xem tổng quan số lượng gia đình, số bé đăng ký, tổng nhiệm vụ hoàn thành $\rightarrow$ Khóa/Mở khóa tài khoản khi cần.
- **Backend API:** `GET /api/admin/stats`, `GET /api/admin/users`, `PUT /api/admin/users/:id/status`
- **Frontend Screens:** `AdminDashboard.tsx`.
- **Action Checklist:**
  - [ ] Viết API Thống kê tổng hợp Admin Stats.
  - [ ] Nối bảng quản lý User & Thẻ chỉ số trong Admin Dashboard.

---

# 💳 DEVELOPER 2: NHIỆM VỤ, DUYỆT BÀI, NGÂN HÀNG ẢO, PHẦN THƯỞNG & QUIZ (7 CHỨC NĂNG)

### 📂 Thư Mục Sở Hữu (Files & Folders):
- **Backend:** `backend/src/modules/missions/`, `submissions/`, `wallet/`, `rewards/`, `lessons/`, `quizzes/`
- **Frontend:** `ParentTasksPage.tsx`, `ParentApprovalPage.tsx`, `ParentBankPage.tsx`, `ChildTasksPage.tsx`, `ChildWalletPage.tsx`, `LessonLibraryPage.tsx`, `QuizPage.tsx`
- **Database Tables:** `missions`, `subtasks`, `submissions`, `wallets`, `savings_accounts`, `penalties`, `rewards`, `redemptions`, `lessons`, `quizzes`.

---

### 🛠️ CHI TIẾT 7 CHỨC NĂNG DEV 2:

#### 2.1. Tạo & Giao Nhiệm Vụ Multi-step Checklist (Task Creator & Manager)
- **User Flow:** Phụ huynh chọn tạo task đơn lẻ hoặc task chuỗi multi-step (VD: *Dọn phòng khách*: 1. Cất đồ chơi, 2. Lau bàn, 3. Quét sàn) $\rightarrow$ Đặt thưởng XP, khung giờ $\rightarrow$ Phát hành task cho bé.
- **Backend API:**
  - `GET /api/missions?childId=xxx` (Lấy danh sách task)
  - `POST /api/missions` (Body: `{ title, category, xp, time, subtasks: ['Cất đồ chơi', 'Lau bàn'] }`)
  - `PUT/DELETE /api/missions/:id`
- **Database Tables (`missions`, `subtasks`):**
  - `missions`: `id`, `child_id`, `title`, `category`, `reward_xp`, `schedule_time`, `status` ('todo', 'in_progress', 'submitted', 'done').
  - `subtasks`: `id`, `mission_id`, `title`, `is_done`, `step_order`.
- **Frontend Screens:** `ParentTasksPage.tsx` (Task Manager & Modal Tạo Nhiệm Vụ).
- **Action Checklist:**
  - [ ] Viết API CRUD Missions & Subtasks.
  - [ ] Nối Form tạo task Multi-step Checklist phía React.

#### 2.2. Nhiệm Vụ Chuỗi Của Bé & Chụp Ảnh Minh Chứng (Child Checklist & Camera Upload)
- **User Flow:** Bé mở app $\rightarrow$ Tick chọn từng bước checklist task $\rightarrow$ Progress Bar nhảy 100% $\rightarrow$ Bùng nổ **pháo hoa Confetti 🎆** $\rightarrow$ Chụp/Tải ảnh minh chứng nộp cho ba mẹ.
- **Backend API:**
  - `PUT /api/missions/:id/subtasks/:subId` (Cập nhật tick ô checklist)
  - `POST /api/submissions` (Body: `{ missionId, proofImageUrl }` $\rightarrow$ Đổi status thành `submitted`)
- **Database Table (`submissions`):**
  - `id` (UUID), `mission_id` (UUID), `child_id` (UUID), `proof_image_url` (String), `status` ('submitted', 'approved', 'rejected'), `submitted_at` (Timestamp).
- **Frontend Screens:** `ChildTasksPage.tsx` & `ChildHomePage.tsx`.
- **Action Checklist:**
  - [ ] Viết API nộp bài minh chứng & Upload ảnh.
  - [ ] Nối giao diện checklist tick chọn & Confetti hiệu ứng.

#### 2.3. Duyệt Bằng Chứng Nhiệm Vụ & Thưởng XP (Approval Queue & Feedback)
- **User Flow:** Phụ huynh mở Duyệt bài $\rightarrow$ Xem bức ảnh chụp phòng khách sạch sẽ $\rightarrow$ Bấm **"Duyệt & Tặng XP"** (Cộng XP vào ví bé) hoặc **"Yêu cầu nộp lại"** kèm lời nhắn.
- **Backend API:**
  - `GET /api/submissions/pending` (Hàng chờ duyệt bài)
  - `POST /api/submissions/:id/approve` (Body: `{ status: 'approved' | 'rejected', feedback }` $\rightarrow$ Tự động cộng XP vào ví bé)
- **Database Tables:** Cập nhật status `submissions`, `wallets.balance_xp`, `children.xp`.
- **Frontend Screens:** `ParentApprovalPage.tsx` (Tab Duyệt bài).
- **Action Checklist:**
  - [ ] Viết API duyệt bài & Logic tự động cộng XP/Level.
  - [ ] Nối Hàng chờ duyệt bài & Modal xem ảnh minh chứng.

#### 2.4. Ngân Hàng Ảo, Heo Đất & Lãi Suất Kép (Virtual Bank & Piggy Savings)
- **User Flow:** Phụ huynh chỉnh lãi suất (mặc định 5%/tuần). Bé xem Ví tiêu dùng (`1,250 XP`) & Sổ tiết kiệm (`800 XP`). Mỗi ngày hệ thống tự đếm nhảy tiền lãi (`+15 XP/ngày`). Bé bấm **Gửi/Rút tiết kiệm**.
- **Backend API:**
  - `GET /api/wallet?childId=xxx` & `PUT /api/wallet/interest-rate`
  - `POST /api/wallet/deposit` & `POST /api/wallet/withdraw`
- **Database Tables (`wallets`, `wallet_transactions`):**
  - `wallets`: `id`, `child_id`, `balance_xp`, `savings_xp`, `interest_rate_weekly`, `last_interest_date`.
  - `wallet_transactions`: `id`, `wallet_id`, `type`, `amount_xp`, `description`, `created_at`.
- **Frontend Screens:** `ParentBankPage.tsx` & `ChildWalletPage.tsx` (Tab Nuôi heo đất).
- **Action Checklist:**
  - [ ] Viết API ví điểm, nạp/rút heo đất & CronJob đếm tiền lãi hàng ngày.
  - [ ] Nối Form gửi tiết kiệm & biểu đồ số dư trong React.

#### 2.5. Hệ Thống Vé Phạt Kỷ Luật (Penalty Tickets Engine)
- **User Flow:** Phụ huynh xuất "Vé Phạt" kỷ luật (VD: *Chơi game quá giờ (-30 XP)*) $\rightarrow$ Banner màu đỏ xuất hiện phía bé $\rightarrow$ Bé bấm *"Con hứa lần sau cố gắng!"* để đóng vé phạt.
- **Backend API:**
  - `POST /api/wallet/penalties` (Body: `{ childId, reason, amountXP, emoji }` $\rightarrow$ Trừ XP)
  - `PUT /api/wallet/penalties/:id/resolve`
- **Database Table (`penalties`):**
  - `id` (UUID), `child_id` (UUID), `reason` (String), `amount_xp` (Int), `emoji` (String), `status` ('issued', 'resolved').
- **Frontend Screens:** `ParentBankPage.tsx` (Tab Vé phạt) & `ChildWalletPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API xuất vé phạt & trừ XP ví bé.
  - [ ] Nối Form xuất vé phạt & Banner cảnh báo đỏ phía bé.

#### 2.6. Cửa Hàng Đổi Quà Thật & Duyệt Quy Đổi (Reward Shop & Redemption Approval)
- **User Flow:** Phụ huynh thêm phần thưởng (Vật lý, Trải nghiệm, Gia đình) $\rightarrow$ Bé chọn món quà muốn đổi $\rightarrow$ Gửi đề nghị $\rightarrow$ Phụ huynh bấm **"Chấp nhận đổi"** để quy đổi quà.
- **Backend API:**
  - `GET/POST/PUT /api/rewards` (Quản lý quà)
  - `POST /api/rewards/redeem` & `POST /api/rewards/redemptions/:id/approve`
- **Database Tables (`rewards`, `redemptions`):**
  - `rewards`: `id`, `parent_id`, `title`, `cost_xp`, `category`, `icon`, `active`.
  - `redemptions`: `id`, `reward_id`, `child_id`, `status` ('pending', 'approved').
- **Frontend Screens:** `ParentApprovalPage.tsx` (Tab Duyệt thưởng) & `ChildWalletPage.tsx` (Tab Đổi quà).
- **Action Checklist:**
  - [ ] Viết API Cửa hàng quà & duyệt đổi quà.
  - [ ] Nối danh sách quà & nút gửi đề nghị đổi quà.

#### 2.7. Thư Viện Bài Học Kỹ Năng & Trắc Nghiệm Quiz (Lesson Library & Quiz Engine)
- **User Flow:** Bé xem video bài học kỹ năng sống $\rightarrow$ Bấm **"Làm bài đố vui (Quiz)"** $\rightarrow$ Trả lời 3-5 câu trắc nghiệm $\rightarrow$ Đạt điểm tối đa nhận thưởng `+50 XP`.
- **Backend API:**
  - `GET /api/lessons` & `GET /api/quizzes/:id`
  - `POST /api/quizzes/:id/submit` (Chấm điểm & Cộng thưởng XP)
- **Database Tables (`lessons`, `quizzes`, `quiz_questions`):**
  - `lessons`: `id`, `title`, `skill_type`, `age_range`, `duration`, `thumbnail_url`, `author`.
  - `quizzes`: `id`, `lesson_id`, `title`, `pass_score`, `reward_xp`.
  - `quiz_questions`: `id`, `quiz_id`, `question_text`, `options_json`, `correct_index`.
- **Frontend Screens:** `LessonLibraryPage.tsx`, `QuizPage.tsx`, `QuizResultPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API Thư viện bài học & Chấm điểm trắc nghiệm Quiz.
  - [ ] Nối giao diện chọn đáp án trắc nghiệm & màn Kết quả Quiz.

---

# 🐉 DEVELOPER 3: THÚ CƯNG GAMIFICATION, AI KỸ NĂNG, VOICE STUDIO, MEMORY LANE & ĐIỀU ƯỚC (7 CHỨC NĂNG)

### 📂 Thư Mục Sở Hữu (Files & Folders):
- **Backend:** `backend/src/modules/pet/`, `reports/`, `stories/`, `wishes/`, `milestones/`
- **Frontend:** `ParentAiAnalyticsPage.tsx`, `ParentStoryStudioPage.tsx`, `ParentMemoryLanePage.tsx`, `ChildPetPage.tsx`, `ChildStoriesPage.tsx`, `ChildWishesPage.tsx`, `ViralMilestoneModal.tsx`
- **Database Tables:** `pets`, `pet_accessories`, `stories`, `voice_profiles`, `ai_skill_reports`, `memory_photos`, `photobooks`, `child_wishes`, `milestones`.

---

### 🛠️ CHI TIẾT 7 CHỨC NĂNG DEV 3:

#### 3.1. Tiến Hóa Thú Cưng & Chuỗi Streak 14 Ngày (Pet Evolution Engine)
- **User Flow:** Nuôi Rồng Con qua 4 giai đoạn (*Trứng 🥚 → Rồng con 🐉 → Rồng lửa 🐲 → Rồng huyền thoại ⚡*). Theo dõi Streak 14 ngày. Bé bấm **"Cho ăn 🍎"** (tốn 10 XP) để tăng mood vui vẻ.
- **Backend API:** `GET /api/pet?childId=xxx`, `POST /api/pet/feed` (Trừ 10 XP, tăng mood)
- **Database Table (`pets`):**
  - `id` (UUID), `child_id` (UUID), `name` (String), `stage` (Int: 1-4), `level` (Int), `current_xp` (Int), `streak_days` (Int), `mood` (String), `last_fed_time` (Timestamp).
- **Frontend Screens:** `ChildPetPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API Pet status & Logic tính toán tiến hóa theo Streak.
  - [ ] Nối giao diện Rồng Con, thanh XP tiến hóa & Nút cho ăn.

#### 3.2. Tủ Đồ Trang Điểm Thú Cưng (Pet Wardrobe & Accessories Shop)
- **User Flow:** Bé dùng XP đổi các phụ kiện (Mũ party, Kính râm, Vương miện, Áo choàng) $\rightarrow$ Bấm **Mặc thử** đồ mới cho Rồng Con.
- **Backend API:**
  - `GET /api/pet/accessories`
  - `POST /api/pet/accessories/buy` & `POST /api/pet/accessories/equip`
- **Database Tables (`pet_accessories`, `child_pet_accessories`):**
  - `pet_accessories`: `id`, `name`, `icon`, `cost_xp`, `category`.
  - `child_pet_accessories`: `id`, `child_id`, `accessory_id`, `is_equipped`.
- **Frontend Screens:** `ChildPetPage.tsx` (Tủ đồ trang sức).
- **Action Checklist:**
  - [ ] Viết API mua & mặc phụ kiện Pet.
  - [ ] Nối Tủ đồ & Nút bấm mặc phụ kiện lên Avatar Pet.

#### 3.3. Báo Cáo Phân Tích Kỹ Năng AI (AI Skill Analytics Radar Chart)
- **User Flow:** Phụ huynh xem Biểu đồ Radar Chart 4 chỉ số (*Tự lập, Sức khỏe, Trí tuệ, Tình cảm*), so sánh tăng/giảm %. Đọc Khung Lời khuyên AI $\rightarrow$ Bấm **"Áp dụng gợi ý nhiệm vụ AI"** (Tự động phát hành task rèn luyện cho bé).
- **Backend API:**
  - `GET /api/reports/ai-skill?childId=xxx`
  - `POST /api/reports/apply-ai-task` (Tự động tạo task AI cho bé)
- **Database Table (`ai_skill_reports`):**
  - `id`, `child_id`, `month_period`, `tu_lap_score`, `suc_khoe_score`, `tri_tue_score`, `tinh_cam_score`, `ai_recommendation_text`, `suggested_task_json`.
- **Frontend Screens:** `ParentAiAnalyticsPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API tính toán chỉ số Radar Chart & Lời khuyên AI.
  - [ ] Nối SVG Radar Chart & Nút áp dụng nhiệm vụ gợi ý AI.

#### 3.4. AI Voice Studio & Quản Lý Kể Chuyện (Voice Clone Studio & Curated Search)
- **User Flow:** Phụ huynh thu âm 1 phút giọng đọc $\rightarrow$ AI xử lý nhân bản (Voice Clone Mẹ/Bố). Phụ huynh tìm kiếm truyện cổ tích từ Internet $\rightarrow$ Bấm **"+ Thêm vào thư viện bé"**.
- **Backend API:**
  - `POST /api/voice/clone` (Upload file âm thanh mẫu $\rightarrow$ Trả về Voice Model ID)
  - `GET /api/stories/curated` & `POST /api/stories/curated/add-to-child`
- **Database Tables (`voice_profiles`, `curated_stories`):**
  - `voice_profiles`: `id`, `parent_id`, `voice_name`, `voice_model_id`, `status`.
  - `curated_stories`: `id`, `title`, `category`, `moral_lesson`, `duration`, `text_content`.
- **Frontend Screens:** `ParentStoryStudioPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API thu âm Voice Clone & Thư viện truyện.
  - [ ] Nối Studio thu âm 1 phút giọng đọc Mẹ/Bố & Ô tìm kiếm truyện.

#### 3.5. Góc Giờ Kể Chuyện Kỳ Diệu (Child Bedtime Stories Audio Player)
- **User Flow:** Bé mở Góc kể chuyện $\rightarrow$ Chọn 1 trong **8 nhân vật giọng đọc** (*Giọng Mẹ, Giọng Bố, Phù thủy, Robot, Công chúa, Rồng con, Cú mèo, Gấu Bơ*) $\rightarrow$ Phát nhạc đọc truyện kèm nhạc nền BGM du dương.
- **Backend API:**
  - `GET /api/stories/child-library`
  - `GET /api/stories/:id/audio?voiceId=xxx` (Stream file audio theo giọng chọn)
- **Frontend Screens:** `ChildStoriesPage.tsx`.
- **Action Checklist:**
  - [ ] Viết API Audio Stream đọc truyện theo Voice ID.
  - [ ] Nối Bộ chọn 8 nhân vật giọng đọc & Trình phát Audio Player.

#### 3.6. Nhật Ký Hành Trình & AI Video Recap (Memory Lane Premium)
- **User Flow:** Xem album ảnh việc nhà của con xếp theo dòng thời gian. Bấm **"Tạo Video Recap tháng"** (AI tự động dựng video ngắn ghép nhạc), Bấm **"Xuất Photobook PDF"** (Dàn trang tự động 24 trang tạp chí kỷ niệm).
- **Backend API:**
  - `GET /api/memory-lane`
  - `POST /api/memory-lane/recap-video` & `GET /api/memory-lane/photobook-pdf`
- **Database Tables (`memory_photos`, `photobooks`):**
  - `memory_photos`: `id`, `child_id`, `image_url`, `caption`, `date_taken`, `category`, `likes_count`.
  - `photobooks`: `id`, `child_id`, `title`, `total_pages`, `pdf_download_url`.
- **Frontend Screens:** `ParentMemoryLanePage.tsx`.
- **Action Checklist:**
  - [ ] Viết API Album ảnh, Video Recap & Dàn trang PDF Photobook.
  - [ ] Nối Dòng thời gian ảnh, Modal Video Recap & Modal Xem trước Photobook PDF.

#### 3.7. Cây Điều Ước Thần Kỳ & Thiệp Vinh Danh QR Code (Wish Tree & Viral Milestones)
- **User Flow:**
  - *Điều ước:* Bé giữ nút **"Ghi âm giọng nói"** hoặc gõ chữ thủ thỉ ước mơ với ba mẹ (tốn 50 Sao) $\rightarrow$ Gửi sang màn Duyệt điều ước của cha mẹ.
  - *Thiệp vinh danh:* Khi đạt huy hiệu mới, chọn 3 mẫu thiệp (*Hiệp sĩ, Công chúa, Phi hành gia*) $\rightarrow$ RENDER Thiệp vinh danh kỹ thuật số có tên bé & **Mã QR Code** chia sẻ Zalo/Facebook.
- **Backend API:** `POST /api/wishes`, `POST /api/wishes/:id/approve`, `GET /api/milestones/card`
- **Database Tables (`child_wishes`, `milestones`):**
  - `child_wishes`: `id`, `child_id`, `wish_text`, `voice_audio_url`, `cost_stars`, `status`.
  - `milestones`: `id`, `badge_id`, `child_id`, `unlocked_date`, `qr_code_url`.
- **Frontend Screens:** `ChildWishesPage.tsx` & `ViralMilestoneModal.tsx`.
- **Action Checklist:**
  - [ ] Viết API Ghi âm điều ước & Xuất thiệp vinh danh QR code.
  - [ ] Nối Cây ước nguyện thần kỳ & Modal Thiệp Vinh Danh QR Code.

---

## 🚀 LỜI KHUYÊN DÀNH CHO CẢ NHÓM 3 DEV

1. Cả 3 Dev mở file [`Phan_Cong_Work_3_Dev.md`](file:///d:/Kidlife/Phan_Cong_Work_3_Dev.md) này trực tiếp trong IDE để xem phần việc của mình.
2. Mỗi Dev tạo Git Branch riêng đúng tên (`feature/dev1-auth-family`, `feature/dev2-tasks-bank`, `feature/dev3-pet-ai-stories`).
3. Cân bằng công việc đã đạt mức **tối đa 100% (7 - 7 - 7)**, đảm bảo tiến độ dự án KidLife diễn ra suôn sẻ và mượt mà nhất!
