# TÀI LIỆU PHÂN TÍCH DỰ ÁN KIDLIFE — GÓC NHÌN DEVELOPER

> **Developer Kickoff Document**
> Chia công việc cho nhóm 3 lập trình viên (Frontend App + Frontend Web + Backend)
> Dựa trên KidLife Business Analysis v1.0
> **Platform:** React Native (Mobile App) + ReactJS (Web Admin/Expert)

---

# PHẦN 1 — TỔNG QUAN HỆ THỐNG

## 1.1. Mục tiêu của hệ thống

Xây dựng nền tảng EdTech (KidLife) giúp phụ huynh đồng hành cùng trẻ 4–10 tuổi rèn thói quen tốt và kỹ năng sống thông qua:

- Hệ thống nhiệm vụ hằng ngày với xác minh bằng chứng (AI + Parent Override)
- Nội dung giáo dục do Expert biên soạn, Admin kiểm duyệt
- Gamification (điểm, huy hiệu, level, thú cưng ảo)
- Mô hình Freemium với gói Premium qua Payment Gateway

## 1.2. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                            │
│              Parent App (iOS/Android) + Child App (iOS/Android)         │
│  ┌──────────────────────┐    ┌──────────────────────┐                  │
│  │    Parent Screens     │    │    Child Screens      │                  │
│  │ Dashboard, Mission,   │    │ Home, Lesson, Quiz,   │                  │
│  │ Approval, Reward,     │    │ Mission, Pet, Wallet,  │                  │
│  │ Report, Payment,      │    │ Reward, Notification   │                  │
│  │ Profile, Notification │    │                        │                  │
│  └──────────────────────┘    └──────────────────────┘                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────┐
│                    WEB APP (ReactJS)                                    │
│              Admin Dashboard + Expert Portal                           │
│  ┌──────────────────────┐    ┌──────────────────────┐                  │
│  │    Admin Dashboard    │    │    Expert Portal      │                  │
│  │ User Management,     │    │ Content Editor,       │                  │
│  │ Content Moderation,  │    │ Lesson/Quiz Manager,  │                  │
│  │ Reports, Config      │    │ Stats, Notification   │                  │
│  └──────────────────────┘    └──────────────────────┘                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    REST API (HTTPS + JWT)
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (Node.js + ExpressJS)                        │
│  ┌────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐           │
│  │ Routes │→│Controllers│→│ Services │→│    Models          │           │
│  └────────┘ └──────────┘ └──────────┘ └───────────────────┘           │
│  ┌──────────────┐ ┌───────────┐ ┌────────────────────────┐            │
│  │ Middlewares   │ │ Validators│ │ Utils (AI, Upload...)  │            │
│  └──────────────┘ └───────────┘ └────────────────────────┘            │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                    DATABASE (MongoDB)                                   │
│  17 Collections: User, ChildProfile, Skill, Lesson, Quiz,              │
│  Question, Mission, Checklist, Submission, Wallet, Pet,                 │
│  Reward, Certificate, Notification, Subscription,                       │
│  Transaction, AILog                                                     │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                                │
│  ┌──────────┐ ┌──────────────┐ ┌─────────┐ ┌──────────────┐          │
│  │AI Service│ │Cloud Storage │ │  FCM    │ │Payment Gateway│          │
│  └──────────┘ └──────────────┘ └─────────┘ └──────────────┘          │
│  ┌──────────────┐ ┌───────────────────┐                               │
│  │Email Service │ │Analytics Service  │                               │
│  └──────────────┘ └───────────────────┘                               │
└────────────────────────────────────────────────────────────────────────┘
```

> **Phân bổ Platform theo Role:**
> - **Parent** → Mobile App (React Native) — chính; có thể mở rộng web sau
> - **Child** → Mobile App (React Native) — giao diện thân thiện trẻ em, camera/upload
> - **Expert** → Web App (ReactJS) — soạn nội dung cần bàn phím/màn hình lớn
> - **Admin** → Web App (ReactJS) — dashboard quản trị cần màn hình lớn

## 1.3. Công nghệ sử dụng

| Tầng | Công nghệ | Ghi chú |
|------|-----------|---------|
| **Mobile App** | React Native (TypeScript) | iOS + Android; dùng cho Parent + Child |
| **Web App** | ReactJS (TypeScript) | SPA; dùng cho Admin Dashboard + Expert Portal |
| **Navigation (App)** | React Navigation | Stack, Tab, Drawer navigator |
| **State Management** | Redux Toolkit / Zustand | Shared giữa App và Web (nếu cùng logic) |
| **HTTP Client** | Axios | Dùng chung cho cả App và Web |
| **UI Kit (App)** | React Native Paper / NativeBase | Giao diện trẻ em sinh động |
| **UI Kit (Web)** | Ant Design / Material UI | Dashboard Admin + Expert |
| **Backend** | Node.js + ExpressJS | RESTful API, base path `/api/v1` |
| **Database** | MongoDB + Mongoose | Document-oriented, 17 collections |
| **Authentication** | JWT (access + refresh token) | Access: ~15 phút, Refresh: dài hơn + rotation |
| **Authorization** | RBAC Middleware | 4 roles: parent, child, expert, admin |
| **File Storage** | Cloud Storage (S3/GCS/Firebase) | Presigned URL, CDN |
| **Push Notification** | Firebase Cloud Messaging (FCM) | Push (App) + In-app (cả App và Web) |
| **Camera/Media** | react-native-image-picker / expo-camera | Chụp ảnh/quay video bằng chứng (App) |
| **Payment** | Payment Gateway (VNPay/MoMo/Stripe) | Webhook + chữ ký xác thực |
| **AI** | AI Service (REST) | Image/video analysis, confidence score |
| **Email** | SMTP/REST (SendGrid/Mailgun) | Xác thực, reset password |
| **Password Hash** | bcrypt / argon2 | Salt + hash |
| **Validation** | Joi / express-validator (BE), Yup/Zod (FE) | Request validation |

## 1.4. Luồng hoạt động tổng quan

```
1. ĐĂNG KÝ/ĐĂNG NHẬP → JWT Token → Phân quyền theo Role
2. PARENT tạo ChildProfile → Tự tạo Wallet + Pet
3. EXPERT soạn Lesson/Quiz → Gửi duyệt → ADMIN duyệt & publish
4. PARENT giao Mission cho Child → Child thực hiện → Nộp bằng chứng
5. Bằng chứng → Cloud Storage → AI phân tích → AILog → Parent duyệt/từ chối
6. Duyệt → Cộng điểm Wallet → Cập nhật Gamification/Pet → Thông báo
7. Child dùng điểm → Đổi Reward / Nuôi Pet
8. PARENT mua Premium → Payment Gateway → Webhook → Subscription kích hoạt
```

---

# PHẦN 2 — ROLE ANALYSIS

## 2.1. Parent (Phụ huynh)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Đăng ký/đăng nhập, quản lý hồ sơ trẻ (CRUD), giao/quản lý nhiệm vụ, phê duyệt bằng chứng (Parent Override), quản lý ví & phần thưởng, mua gói Premium, xem báo cáo tiến độ con, nhận thông báo, cấu hình giới hạn cho trẻ |
| **Quyền hạn** | CRUD ChildProfile, CRUD Mission, CRUD Reward, R/U Submission (duyệt), R Wallet, R Pet, C/R/U Subscription, R Transaction, R AILog (liên quan con), R/U Notification |
| **Màn hình** | S-01 Đăng nhập/Đăng ký, S-02 Dashboard Phụ huynh, S-03 Quản lý hồ sơ trẻ, S-04 Tạo/Quản lý nhiệm vụ, S-05 Hàng đợi phê duyệt, S-06 Quản lý phần thưởng & ví, S-07 Báo cáo tiến độ, S-08 Gói Premium & Thanh toán, S-20 Thông báo |
| **API được gọi** | POST /auth/register, POST /auth/login, POST /auth/logout, GET/PUT /users/me, POST/GET/PUT/DELETE /children, POST/GET/PUT/DELETE /missions, GET /submissions?status=pending, PATCH /submissions/{id}/review, GET /children/{id}/wallet, GET /children/{id}/pet, POST/GET /rewards, PATCH /rewards/redemptions/{id}/approve, GET /reports/child/{id}, GET /plans, POST /subscriptions, GET /transactions, GET/PATCH /notifications |
| **Model thao tác** | User (R,U), ChildProfile (C,R,U,D), Mission (C,R,U,D), Submission (R,U), Wallet (R), Pet (R), Reward (C,R,U,D), Notification (R,U), Subscription (C,R,U), Transaction (R), AILog (R), Checklist (C,R,U,D), Certificate (R) |

## 2.2. Child (Trẻ em)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Đăng nhập (tài khoản do Parent tạo), học bài, làm quiz, xem/thực hiện nhiệm vụ, nộp bằng chứng, xem điểm/huy hiệu/level, chăm sóc Pet, đổi thưởng |
| **Quyền hạn** | R Lesson (published, đúng tuổi), R Quiz, C Submission, R Mission (của mình), R/U Checklist (tick), R Wallet (của mình), R/U Pet (chăm sóc), R Reward, R Certificate (của mình), R/U Notification |
| **Màn hình** | S-01 Đăng nhập, S-09 Trang chủ Trẻ em, S-10 Học bài, S-11 Làm Quiz, S-12 Chi tiết nhiệm vụ & Nộp bằng chứng, S-13 Ví điểm & Đổi thưởng, S-14 Thú cưng ảo, S-20 Thông báo |
| **API được gọi** | POST /auth/login, GET /missions, POST /missions/{id}/submissions, GET /lessons, GET /lessons/{id}, GET /quizzes/{id}, POST /quizzes/{id}/submit, GET /children/{id}/wallet, GET /children/{id}/pet, POST /children/{id}/pet/feed, GET /rewards, POST /rewards/{id}/redeem, GET/PATCH /notifications |
| **Model thao tác** | User (R), Mission (R), Submission (C,R), Checklist (R,U), Lesson (R), Quiz (R), Question (R), Wallet (R), Pet (R,U), Reward (R), Certificate (R), Notification (R,U) |

## 2.3. Expert (Chuyên gia)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Đăng ký/đăng nhập (chờ Admin duyệt tư cách), soạn Lesson/Quiz/Question/Mission mẫu, gửi duyệt, chỉnh sửa nội dung của mình, xem thống kê nội dung |
| **Quyền hạn** | C/R/U/D Lesson (của mình), C/R/U/D Quiz (của mình), C/R/U/D Question (của mình), C/R Skill, C/R Mission (mẫu), R/U Notification |
| **Màn hình** | S-01 Đăng nhập/Đăng ký, S-15 Soạn nội dung, S-16 Thống kê nội dung, S-20 Thông báo |
| **API được gọi** | POST /auth/register, POST /auth/login, GET/PUT /users/me, POST/GET/PUT /lessons, POST /lessons/{id}/submit, POST /quizzes, POST/GET /skills, GET/PATCH /notifications |
| **Model thao tác** | User (R,U), Lesson (C,R,U,D), Quiz (C,R,U,D), Question (C,R,U,D), Skill (C,R,U), Mission (C,R — mẫu), Notification (R,U) |

## 2.4. Admin (Quản trị viên)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Đăng nhập, quản lý toàn bộ người dùng (khóa/mở/xóa), duyệt tư cách Expert, kiểm duyệt nội dung (duyệt/từ chối/publish/gỡ), cấu hình hệ thống & gói Premium, xem toàn bộ báo cáo & audit log |
| **Quyền hạn** | R/U/D User, R/D ChildProfile, C/R/U/D Skill, R/U/D Lesson (duyệt/gỡ), R/D Quiz, R/D Question, R/D Mission, R Submission, R Wallet, R Pet, R Reward, C/R/U/D Notification, R/U Subscription, R Transaction, R AILog, R Certificate |
| **Màn hình** | S-01 Đăng nhập, S-17 Quản lý người dùng, S-18 Kiểm duyệt nội dung, S-19 Báo cáo & cấu hình, S-20 Thông báo |
| **API được gọi** | POST /auth/login, GET /users, PATCH /users/{id}/status, PATCH /experts/{id}/approve, GET /lessons?status=pending, PATCH /lessons/{id}/moderate, GET /reports/admin/overview, GET/PATCH /notifications |
| **Model thao tác** | User (R,U,D), ChildProfile (R,D), Skill (C,R,U,D), Lesson (R,U,D), Quiz (R,D), Question (R,D), Mission (R,D), Submission (R), Notification (C,R,U,D), Subscription (R,U), Transaction (R), AILog (R) |

---

# PHẦN 3 — MODULE ANALYSIS

## 3.1. Authentication

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Xác thực danh tính, cấp/thu hồi token, phân quyền RBAC |
| **Chức năng** | Đăng ký, đăng nhập, đăng xuất, refresh token, quên/đổi mật khẩu, xác thực email, khóa khi sai nhiều |
| **Quan hệ** | → User (tạo tài khoản), → tất cả module (JWT middleware) |
| **Màn hình** | S-01 Đăng nhập / Đăng ký |
| **API** | POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, POST /auth/forgot-password, POST /auth/reset-password |
| **Model** | User |

## 3.2. User Management

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Quản lý tài khoản người dùng và hồ sơ trẻ |
| **Chức năng** | Xem/cập nhật profile, CRUD ChildProfile, Admin quản lý users, duyệt Expert |
| **Quan hệ** | ← Authentication (cần đăng nhập), → Mission/Wallet/Pet/Reward (cần ChildProfile), → Lesson (cần Expert) |
| **Màn hình** | S-03 Quản lý hồ sơ trẻ, S-17 Admin Quản lý người dùng |
| **API** | GET/PUT /users/me, GET /users, PATCH /users/{id}/status, PATCH /experts/{id}/approve, POST/GET/PUT/DELETE /children, GET /children/{id} |
| **Model** | User, ChildProfile |

## 3.3. Education CMS (Lesson + Skill)

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Tạo, quản lý và kiểm duyệt nội dung giáo dục |
| **Chức năng** | CRUD Lesson, quản lý Skill, gửi duyệt, Admin duyệt/publish/gỡ, duyệt xem thư viện theo tuổi |
| **Quan hệ** | ← User (Expert tạo), → Quiz (gắn quiz vào lesson), → Mission (kỹ năng) |
| **Màn hình** | S-10 Học bài, S-15 Expert Soạn nội dung, S-18 Admin Kiểm duyệt |
| **API** | POST/GET/PUT /lessons, GET /lessons/{id}, POST /lessons/{id}/submit, PATCH /lessons/{id}/moderate, GET/POST /skills |
| **Model** | Lesson, Skill |

## 3.4. Quiz

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Kiểm tra, củng cố kiến thức bằng trắc nghiệm |
| **Chức năng** | Expert CRUD Quiz/Question, Child làm quiz, chấm điểm tự động, cộng điểm thưởng |
| **Quan hệ** | ← Lesson (quiz gắn với lesson), → Wallet (cộng điểm khi đạt) |
| **Màn hình** | S-11 Làm Quiz, S-15 Expert Soạn nội dung (phần quiz) |
| **API** | POST /quizzes, GET /quizzes/{id}, POST /quizzes/{id}/submit |
| **Model** | Quiz, Question |

## 3.5. Mission

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Giao và quản lý nhiệm vụ hằng ngày cho trẻ |
| **Chức năng** | CRUD Mission, gán cho trẻ, đặt lịch/hạn, checklist, theo dõi trạng thái |
| **Quan hệ** | ← User/ChildProfile (cần tồn tại), → Submission (bằng chứng hoàn thành), → Wallet (điểm thưởng) |
| **Màn hình** | S-04 Tạo/Quản lý nhiệm vụ, S-12 Chi tiết nhiệm vụ |
| **API** | POST/GET/PUT/DELETE /missions |
| **Model** | Mission, Checklist |

## 3.6. Submission & AI Verification

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Nộp bằng chứng, AI xác minh, Parent phê duyệt |
| **Chức năng** | Child nộp bằng chứng, upload Cloud Storage, gửi AI, lưu AILog, Parent duyệt/từ chối, cộng điểm |
| **Quan hệ** | ← Mission (bằng chứng cho nhiệm vụ), → Wallet (cộng điểm khi duyệt), → Notification (thông báo) |
| **Màn hình** | S-05 Hàng đợi phê duyệt, S-12 Nộp bằng chứng |
| **API** | POST /missions/{id}/submissions, GET /submissions?status=pending, PATCH /submissions/{id}/review |
| **Model** | Submission, AILog |

## 3.7. Gamification

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Tạo động lực qua điểm, huy hiệu, level, streak |
| **Chức năng** | Tích điểm, lên cấp, mở khóa huy hiệu, chuỗi ngày streak |
| **Quan hệ** | ← Mission/Quiz/Lesson (sự kiện hoàn thành), → ChildProfile (level, totalPoints), → Certificate |
| **Màn hình** | S-09 Trang chủ Trẻ (hiển thị level/huy hiệu) |
| **API** | Tích hợp trong các API Mission/Quiz/Lesson |
| **Model** | ChildProfile (level, totalPoints), Certificate |

## 3.8. Wallet

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Quản lý số dư điểm thưởng của trẻ |
| **Chức năng** | Cộng/trừ điểm, xem số dư, lịch sử biến động, đổi thưởng/nuôi Pet |
| **Quan hệ** | ← ChildProfile (1-1), ← Submission/Quiz (cộng điểm), → Reward (trừ điểm), → Pet (cho ăn) |
| **Màn hình** | S-13 Ví điểm & Đổi thưởng |
| **API** | GET /children/{id}/wallet |
| **Model** | Wallet |

## 3.9. Pet

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Tạo gắn kết cảm xúc, duy trì thói quen |
| **Chức năng** | Nuôi/cho ăn/nâng cấp Pet bằng điểm, trạng thái phản ánh mức chăm chỉ |
| **Quan hệ** | ← ChildProfile (1-1), ← Wallet (dùng điểm cho ăn) |
| **Màn hình** | S-09 Trang chủ Trẻ, S-14 Thú cưng ảo |
| **API** | GET /children/{id}/pet, POST /children/{id}/pet/feed |
| **Model** | Pet |

## 3.10. Reward

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Quản lý và trao phần thưởng cho trẻ |
| **Chức năng** | Parent CRUD Reward, Child đổi thưởng, Parent duyệt đổi thưởng thực, cấp Certificate |
| **Quan hệ** | ← Wallet (trừ điểm), ← ChildProfile (đổi thưởng) |
| **Màn hình** | S-06 Quản lý phần thưởng & ví, S-13 Đổi thưởng |
| **API** | POST/GET /rewards, POST /rewards/{id}/redeem, PATCH /rewards/redemptions/{id}/approve |
| **Model** | Reward, Certificate |

## 3.11. Payment

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Xử lý đăng ký và thanh toán gói Premium |
| **Chức năng** | Xem gói, thanh toán, webhook, gia hạn/hủy, lịch sử giao dịch |
| **Quan hệ** | ← User (Parent thanh toán), → Subscription/Transaction |
| **Màn hình** | S-08 Gói Premium & Thanh toán |
| **API** | GET /plans, POST /subscriptions, POST /payments/webhook, GET /transactions |
| **Model** | Subscription, Transaction |

## 3.12. Reporting

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Cung cấp thống kê tiến độ và vận hành |
| **Chức năng** | Tiến độ con theo kỹ năng, thống kê nội dung Expert, báo cáo Admin (users, doanh thu) |
| **Quan hệ** | ← Tất cả module (đọc dữ liệu tổng hợp) |
| **Màn hình** | S-02 Dashboard Phụ huynh, S-07 Báo cáo tiến độ, S-16 Thống kê Expert, S-19 Báo cáo Admin |
| **API** | GET /reports/child/{id}, GET /reports/admin/overview |
| **Model** | Đọc aggregate từ ChildProfile, Mission, Submission, Transaction, Lesson |

## 3.13. Notification

| Hạng mục | Chi tiết |
|----------|----------|
| **Mục đích** | Gửi nhắc nhở và thông báo sự kiện |
| **Chức năng** | Push/in-app theo trigger, đánh dấu đã đọc, cấu hình nhận thông báo |
| **Quan hệ** | ← Tất cả module (trigger thông báo) |
| **Màn hình** | S-20 Thông báo |
| **API** | GET /notifications, PATCH /notifications/{id}/read |
| **Model** | Notification |

---

# PHẦN 4 — DATABASE ANALYSIS

## Tổng hợp 17 Models

### 4.1. User

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Tài khoản người dùng (Parent, Expert, Admin; Child đăng nhập qua ChildProfile) |
| **Thuộc tính chính** | _id, email (unique), passwordHash, fullName, role (enum), status (enum), avatarUrl, isEmailVerified, createdAt, updatedAt |
| **Quan hệ** | 1 User (Parent) → N ChildProfile; 1 User (Expert) → N Lesson; 1 User → N Notification; 1 User → 1 Subscription |
| **CRUD** | C: Auth register; R: tất cả (bản thân), Admin (all); U: bản thân (profile), Admin (status); D: Admin |

### 4.2. ChildProfile

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Hồ sơ trẻ, thuộc quản lý của Parent |
| **Thuộc tính chính** | _id, parentId (FK→User), name, dateOfBirth, avatarUrl, loginUsername, loginPasswordHash, preferredSkills (FK→Skill[]), level, totalPoints, restrictions, createdAt |
| **Quan hệ** | N ChildProfile → 1 User (Parent); 1 ChildProfile → 1 Wallet; 1 ChildProfile → 1 Pet; 1 ChildProfile → N Mission; 1 ChildProfile → N Submission |
| **CRUD** | C: Parent; R: Parent, Child (bản thân), Admin; U: Parent; D: Parent, Admin |

### 4.3. Skill

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Danh mục kỹ năng sống (vệ sinh, lễ phép, tự lập…) |
| **Thuộc tính chính** | _id, name, description, ageRange {min, max}, icon, createdBy (FK→User) |
| **Quan hệ** | 1 Skill → N Lesson; 1 Skill → N Mission (M-N qua tham chiếu) |
| **CRUD** | C: Expert, Admin; R: tất cả; U: Expert (của mình), Admin; D: Admin |

### 4.4. Lesson

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Bài học giáo dục do Expert biên soạn |
| **Thuộc tính chính** | _id, title, content (RichText), mediaUrls[], skillId (FK→Skill), ageRange, authorId (FK→User), status (enum: draft/pending/published/rejected/unpublished), rejectReason, createdAt |
| **Quan hệ** | N Lesson → 1 User (Expert); 1 Lesson → N Quiz; N Lesson → 1 Skill |
| **CRUD** | C: Expert; R: tất cả (published); U: Expert (của mình), Admin (moderate); D: Expert (chưa publish), Admin |

### 4.5. Quiz

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Bộ câu hỏi trắc nghiệm gắn với bài học |
| **Thuộc tính chính** | _id, lessonId (FK→Lesson), title, passScore, rewardPoints, authorId (FK→User), createdAt |
| **Quan hệ** | N Quiz → 1 Lesson; 1 Quiz → N Question |
| **CRUD** | C: Expert; R: tất cả; U: Expert (của mình); D: Expert (của mình), Admin |

### 4.6. Question

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Câu hỏi thuộc một quiz |
| **Thuộc tính chính** | _id, quizId (FK→Quiz), content, options[], correctIndex, mediaUrl |
| **Quan hệ** | N Question → 1 Quiz |
| **CRUD** | C: Expert; R: tất cả; U: Expert (của mình); D: Expert (của mình), Admin |

### 4.7. Mission

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Nhiệm vụ giao cho trẻ thực hiện ngoài đời |
| **Thuộc tính chính** | _id, title, description, childId (FK→ChildProfile), createdBy (FK→User), skillId (FK→Skill), rewardPoints, dueDate, recurrence (enum), status (enum: todo/pending_review/completed/overdue/redo), createdAt |
| **Quan hệ** | N Mission → 1 ChildProfile; 1 Mission → N Submission; 1 Mission → 1 Checklist |
| **CRUD** | C: Parent, Expert (mẫu); R: Parent, Child (của mình), Admin; U: Parent; D: Parent, Admin |

### 4.8. Checklist

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Danh sách bước con của nhiệm vụ |
| **Thuộc tính chính** | _id, missionId (FK→Mission), items [{text, isDone}] |
| **Quan hệ** | 1 Checklist → 1 Mission |
| **CRUD** | C: Parent; R: Parent, Child, Admin; U: Parent, Child (tick); D: Parent |

### 4.9. Submission

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Bằng chứng trẻ nộp cho nhiệm vụ |
| **Thuộc tính chính** | _id, missionId (FK→Mission), childId (FK→ChildProfile), evidenceUrls[], aiResult {label, confidence}, aiLogId (FK→AILog), status (enum: submitted/pending_review/approved/rejected), reviewedBy (FK→User), rejectReason, createdAt |
| **Quan hệ** | N Submission → 1 Mission; N Submission → 1 ChildProfile; 1 Submission → 1 AILog |
| **CRUD** | C: Child; R: Parent, Child (của mình), Admin; U: Parent (review); D: — |

### 4.10. Wallet

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Ví điểm thưởng của trẻ |
| **Thuộc tính chính** | _id, childId (FK→ChildProfile, unique), balance (≥0), history [{type, amount, refId, createdAt}] |
| **Quan hệ** | 1 Wallet ↔ 1 ChildProfile |
| **CRUD** | C: hệ thống (khi tạo ChildProfile); R: Parent, Child (của mình), Admin; U: hệ thống (cộng/trừ điểm); D: — |

### 4.11. Pet

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Thú cưng ảo gắn với trẻ |
| **Thuộc tính chính** | _id, childId (FK→ChildProfile, unique), name, level, mood (enum), appearance, lastFedAt |
| **Quan hệ** | 1 Pet ↔ 1 ChildProfile |
| **CRUD** | C: hệ thống (khi tạo ChildProfile); R: Parent, Child (của mình), Admin; U: Child (chăm sóc), hệ thống (mood/level); D: — |

### 4.12. Reward

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Phần thưởng (ảo/thực) có thể đổi bằng điểm |
| **Thuộc tính chính** | _id, parentId (FK→User), name, type (enum: virtual/physical), pointCost, status (enum), createdAt |
| **Quan hệ** | N Reward → 1 User (Parent); M-N với ChildProfile qua yêu cầu đổi |
| **CRUD** | C: Parent; R: Parent, Child, Admin; U: Parent; D: Parent |

### 4.13. Certificate

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Chứng nhận thành tích của trẻ |
| **Thuộc tính chính** | _id, childId (FK→ChildProfile), title, criteria, issuedAt, fileUrl |
| **Quan hệ** | N Certificate → 1 ChildProfile |
| **CRUD** | C: hệ thống; R: Parent, Child (của mình), Admin; U: —; D: — |

### 4.14. Notification

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Thông báo gửi tới người dùng |
| **Thuộc tính chính** | _id, receiverId (FK→User), type, title, content, channel (enum), priority (enum), isRead, actionUrl, createdAt |
| **Quan hệ** | N Notification → 1 User |
| **CRUD** | C: hệ thống, Admin; R: tất cả (của mình); U: tất cả (đánh dấu đọc); D: Admin |

### 4.15. Subscription

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Gói Premium của tài khoản Parent |
| **Thuộc tính chính** | _id, userId (FK→User, unique), plan (enum), status (enum: active/expired/cancelled), startDate, endDate, autoRenew |
| **Quan hệ** | 1 Subscription ↔ 1 User; 1 Subscription → N Transaction |
| **CRUD** | C: Parent (mua); R: Parent, Admin; U: Parent (hủy), hệ thống (webhook); D: — |

### 4.16. Transaction

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Giao dịch thanh toán |
| **Thuộc tính chính** | _id, userId (FK→User), subscriptionId (FK→Subscription), amount, currency, gatewayRef, status (enum: pending/success/failed/refunded), createdAt |
| **Quan hệ** | N Transaction → 1 User; N Transaction → 1 Subscription |
| **CRUD** | C: hệ thống (webhook); R: Parent (của mình), Admin; U: hệ thống; D: — |

### 4.17. AILog

| Hạng mục | Chi tiết |
|----------|----------|
| **Ý nghĩa** | Nhật ký kết quả AI phân tích bằng chứng |
| **Thuộc tính chính** | _id, submissionId (FK→Submission), inputRef, labels[], confidence (0-1), recommendation (enum), model, createdAt |
| **Quan hệ** | 1 AILog ↔ 1 Submission |
| **CRUD** | C: hệ thống (khi AI trả kết quả); R: Parent (liên quan con), Admin; U: —; D: — |

---

# PHẦN 5 — API ANALYSIS

## 5.1. Authentication Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/auth/register | `{email, password, fullName, role}` | `{userId, message}` | Guest (Parent, Expert) |
| 2 | POST | /api/v1/auth/login | `{email, password}` | `{accessToken, refreshToken, user: {id, role}}` | Tất cả |
| 3 | POST | /api/v1/auth/refresh | `{refreshToken}` | `{accessToken, refreshToken}` | Tất cả (có refresh token) |
| 4 | POST | /api/v1/auth/logout | `{refreshToken}` | `{message}` | Tất cả |
| 5 | POST | /api/v1/auth/forgot-password | `{email}` | `{message}` | Parent, Expert, Admin |
| 6 | POST | /api/v1/auth/reset-password | `{token, newPassword}` | `{message}` | Parent, Expert, Admin |
| 7 | PUT | /api/v1/auth/change-password | `{oldPassword, newPassword}` | `{message}` | Tất cả |
| 8 | POST | /api/v1/auth/verify-email | `{token}` | `{message}` | Parent, Expert |

## 5.2. User Management Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | GET | /api/v1/users/me | — | `{id, email, fullName, role, avatar, status}` | Tất cả |
| 2 | PUT | /api/v1/users/me | `{fullName?, avatarUrl?, phone?}` | `{user}` | Parent, Expert, Admin |
| 3 | GET | /api/v1/users | `?page, limit, role, status, search` | `{users[], total, page}` | Admin |
| 4 | PATCH | /api/v1/users/{id}/status | `{status: "active"/"locked"}` | `{user}` | Admin |
| 5 | PATCH | /api/v1/experts/{id}/approve | `{approved: true/false}` | `{user}` | Admin |
| 6 | DELETE | /api/v1/users/{id} | — | `{message}` | Admin |

## 5.3. Child Profile Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/children | `{name, dateOfBirth, avatarUrl?, preferredSkills[]}` | `{child, walletId, petId}` | Parent |
| 2 | GET | /api/v1/children | — | `{children[]}` | Parent |
| 3 | GET | /api/v1/children/{id} | — | `{child, wallet, pet}` | Parent |
| 4 | PUT | /api/v1/children/{id} | `{name?, avatarUrl?, preferredSkills[]?, restrictions?}` | `{child}` | Parent |
| 5 | DELETE | /api/v1/children/{id} | — | `{message}` | Parent |

## 5.4. Education CMS Module (Lesson + Skill)

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/lessons | `{title, content, mediaUrls[], skillId, ageRange}` | `{lesson}` | Expert |
| 2 | GET | /api/v1/lessons | `?status, skillId, ageMin, ageMax, page, limit` | `{lessons[], total}` | Tất cả |
| 3 | GET | /api/v1/lessons/{id} | — | `{lesson}` | Tất cả |
| 4 | PUT | /api/v1/lessons/{id} | `{title?, content?, mediaUrls[]?, skillId?, ageRange?}` | `{lesson}` | Expert (owner) |
| 5 | DELETE | /api/v1/lessons/{id} | — | `{message}` | Expert (owner, chưa publish), Admin |
| 6 | POST | /api/v1/lessons/{id}/submit | — | `{lesson (status=pending)}` | Expert (owner) |
| 7 | PATCH | /api/v1/lessons/{id}/moderate | `{action: "approve"/"reject"/"unpublish", reason?}` | `{lesson}` | Admin |
| 8 | GET | /api/v1/skills | `?search` | `{skills[]}` | Tất cả |
| 9 | POST | /api/v1/skills | `{name, description, ageRange, icon}` | `{skill}` | Expert, Admin |
| 10 | PUT | /api/v1/skills/{id} | `{name?, description?, ageRange?, icon?}` | `{skill}` | Expert (owner), Admin |
| 11 | DELETE | /api/v1/skills/{id} | — | `{message}` | Admin |

## 5.5. Quiz Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/quizzes | `{lessonId, title, passScore, rewardPoints, questions[]}` | `{quiz}` | Expert |
| 2 | GET | /api/v1/quizzes/{id} | — | `{quiz, questions[]}` | Child, Parent, Expert |
| 3 | PUT | /api/v1/quizzes/{id} | `{title?, passScore?, rewardPoints?}` | `{quiz}` | Expert (owner) |
| 4 | DELETE | /api/v1/quizzes/{id} | — | `{message}` | Expert (owner), Admin |
| 5 | POST | /api/v1/quizzes/{id}/questions | `{content, options[], correctIndex, mediaUrl?}` | `{question}` | Expert |
| 6 | PUT | /api/v1/quizzes/{qId}/questions/{quesId} | `{content?, options[]?, correctIndex?}` | `{question}` | Expert (owner) |
| 7 | DELETE | /api/v1/quizzes/{qId}/questions/{quesId} | — | `{message}` | Expert (owner), Admin |
| 8 | POST | /api/v1/quizzes/{id}/submit | `{answers: [{questionId, selectedIndex}]}` | `{score, passed, pointsAwarded, results[]}` | Child |

## 5.6. Mission Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/missions | `{title, description, childId, skillId, rewardPoints, dueDate, recurrence?, checklist?}` | `{mission}` | Parent |
| 2 | GET | /api/v1/missions | `?childId, status, date, page, limit` | `{missions[]}` | Parent, Child |
| 3 | GET | /api/v1/missions/{id} | — | `{mission, checklist}` | Parent, Child |
| 4 | PUT | /api/v1/missions/{id} | `{title?, description?, rewardPoints?, dueDate?, checklist?}` | `{mission}` | Parent |
| 5 | DELETE | /api/v1/missions/{id} | — | `{message}` | Parent |
| 6 | PATCH | /api/v1/missions/{id}/checklist | `{items: [{text, isDone}]}` | `{checklist}` | Child (tick), Parent |

## 5.7. Submission Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/missions/{id}/submissions | multipart: `files[] + {note?}` | `{submission, aiResult}` | Child |
| 2 | GET | /api/v1/submissions | `?status, childId, page, limit` | `{submissions[]}` | Parent |
| 3 | GET | /api/v1/submissions/{id} | — | `{submission, aiLog}` | Parent |
| 4 | PATCH | /api/v1/submissions/{id}/review | `{decision: "approved"/"rejected", reason?}` | `{submission, pointsAwarded}` | Parent |

## 5.8. Wallet Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | GET | /api/v1/children/{id}/wallet | `?page, limit` (history) | `{balance, history[]}` | Parent, Child |

## 5.9. Pet Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | GET | /api/v1/children/{id}/pet | — | `{pet}` | Parent, Child |
| 2 | POST | /api/v1/children/{id}/pet/feed | `{pointsUsed}` | `{pet, walletBalance}` | Child |

## 5.10. Reward Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | POST | /api/v1/rewards | `{name, type, pointCost, description?}` | `{reward}` | Parent |
| 2 | GET | /api/v1/rewards | `?type, status` | `{rewards[]}` | Parent, Child |
| 3 | PUT | /api/v1/rewards/{id} | `{name?, pointCost?, status?}` | `{reward}` | Parent |
| 4 | DELETE | /api/v1/rewards/{id} | — | `{message}` | Parent |
| 5 | POST | /api/v1/rewards/{id}/redeem | `{childId}` | `{redemption}` | Child |
| 6 | GET | /api/v1/rewards/redemptions | `?status, childId` | `{redemptions[]}` | Parent |
| 7 | PATCH | /api/v1/rewards/redemptions/{id}/approve | `{approved: true/false}` | `{redemption}` | Parent |

## 5.11. Payment Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | GET | /api/v1/plans | — | `{plans[]}` | Parent |
| 2 | POST | /api/v1/subscriptions | `{plan, paymentMethod}` | `{subscriptionId, checkoutUrl}` | Parent |
| 3 | GET | /api/v1/subscriptions/me | — | `{subscription}` | Parent |
| 4 | PATCH | /api/v1/subscriptions/me/cancel | — | `{subscription}` | Parent |
| 5 | POST | /api/v1/payments/webhook | Webhook payload (signed) | `200 OK` | Hệ thống (Payment Gateway) |
| 6 | GET | /api/v1/transactions | `?page, limit` | `{transactions[]}` | Parent |

## 5.12. Reporting Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | GET | /api/v1/reports/child/{id} | `?dateFrom, dateTo, skillId` | `{stats, skillProgress[], missionHistory[]}` | Parent |
| 2 | GET | /api/v1/reports/admin/overview | `?dateFrom, dateTo` | `{totalUsers, newUsers, revenue, premiumConversion, contentStats}` | Admin |
| 3 | GET | /api/v1/reports/expert/content | — | `{lessons[], totalViews, totalQuizAttempts}` | Expert |

## 5.13. Notification Module

| # | Method | Endpoint | Request | Response | Roles |
|---|--------|----------|---------|----------|-------|
| 1 | GET | /api/v1/notifications | `?isRead, page, limit` | `{notifications[], unreadCount}` | Tất cả |
| 2 | PATCH | /api/v1/notifications/{id}/read | — | `{notification}` | Tất cả |
| 3 | PATCH | /api/v1/notifications/read-all | — | `{message}` | Tất cả |

---

# PHẦN 6 — FRONTEND ANALYSIS

> **Quy ước Platform:**
> - 📱 = **React Native** (Mobile App — Parent + Child)
> - 🖥️ = **ReactJS** (Web App — Admin + Expert)
> - 📱🖥️ = **Cả hai** (shared logic, UI riêng từng platform)

### Tổng hợp Platform theo Screen

| Mã | Màn hình | Platform | Ghi chú |
|----|----------|----------|---------|
| S-01a | Login | 📱🖥️ | App: Parent/Child login; Web: Admin/Expert login |
| S-01b | Register | 📱🖥️ | App: Parent register; Web: Expert register |
| S-01c | Forgot Password | 📱🖥️ | Cả hai |
| S-02 | Dashboard Phụ huynh | 📱 | Mobile App |
| S-03 | Quản lý hồ sơ trẻ | 📱 | Mobile App |
| S-04 | Tạo/Quản lý nhiệm vụ | 📱 | Mobile App |
| S-05 | Hàng đợi phê duyệt | 📱 | Mobile App |
| S-06 | Quản lý phần thưởng & ví | 📱 | Mobile App |
| S-07 | Báo cáo tiến độ con | 📱 | Mobile App |
| S-08 | Gói Premium & Thanh toán | 📱 | Mobile App (in-app purchase / deep link) |
| S-09 | Trang chủ Trẻ em | 📱 | Mobile App (giao diện trẻ em) |
| S-10 | Học bài | 📱 | Mobile App |
| S-11 | Làm Quiz | 📱 | Mobile App |
| S-12 | Chi tiết nhiệm vụ & Nộp bằng chứng | 📱 | Mobile App (camera/gallery) |
| S-13 | Ví điểm & Đổi thưởng | 📱 | Mobile App |
| S-14 | Thú cưng ảo (Pet) | 📱 | Mobile App (animation) |
| S-15 | Expert — Soạn nội dung | 🖥️ | Web App (cần rich text editor, màn hình lớn) |
| S-16 | Expert — Thống kê | 🖥️ | Web App |
| S-17 | Admin — Quản lý người dùng | 🖥️ | Web App |
| S-18 | Admin — Kiểm duyệt nội dung | 🖥️ | Web App |
| S-19 | Admin — Báo cáo & cấu hình | 🖥️ | Web App |
| S-20 | Thông báo | 📱🖥️ | App: push + in-app; Web: in-app |

### Cấu trúc thư mục Frontend đề xuất

```
📁 kidlife-app/                    (React Native — Expo hoặc CLI)
├── src/
│   ├── screens/
│   │   ├── auth/                  (Login, Register)
│   │   ├── parent/                (Dashboard, Mission, Approval, Reward, Report, Payment, Profile)
│   │   └── child/                 (Home, Lesson, Quiz, Mission, Pet, Wallet, Reward)
│   ├── components/                (Shared RN components)
│   ├── navigation/                (React Navigation stacks/tabs)
│   ├── services/                  (API calls — Axios)
│   ├── store/                     (Redux/Zustand)
│   ├── hooks/                     (Custom hooks)
│   ├── utils/                     (Helpers)
│   └── assets/                    (Images, fonts)

📁 kidlife-web/                    (ReactJS — Vite hoặc CRA)
├── src/
│   ├── pages/
│   │   ├── auth/                  (Login, Register)
│   │   ├── admin/                 (UserManagement, ContentModeration, Reports, Config)
│   │   └── expert/                (ContentEditor, Stats)
│   ├── components/                (Shared React components)
│   ├── services/                  (API calls — Axios, shared với App nếu dùng monorepo)
│   ├── store/                     (Redux/Zustand)
│   ├── hooks/                     (Custom hooks)
│   └── assets/                    (Images, fonts)
```

---

## 6.1. Authentication Module

### S-01a: Login Screen

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Đăng nhập cho tất cả roles; chuyển giao diện theo role |
| **API** | POST /auth/login |
| **Components** | LoginForm, InputField, PasswordField, Button, ErrorAlert, Logo |
| **State** | email, password, isLoading, error |
| **Form** | email (required, email format), password (required, min 8) |
| **Validation** | Email format, password not empty |
| **Navigation** | → Dashboard tương ứng theo role; → Register; → Forgot Password |

### S-01b: Register Screen

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Đăng ký tài khoản Parent hoặc Expert |
| **API** | POST /auth/register |
| **Components** | RegisterForm, InputField, PasswordField, RoleSelector, Button, ErrorAlert |
| **State** | email, password, confirmPassword, fullName, role, isLoading, error |
| **Form** | email, password, confirmPassword, fullName, role |
| **Validation** | Email unique, password ≥ 8 ký tự (chữ + số), confirm match |
| **Navigation** | → Login; → Verify Email Notice |

### S-01c: Forgot Password Screen

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Gửi email reset password |
| **API** | POST /auth/forgot-password, POST /auth/reset-password |
| **Components** | ForgotPasswordForm, InputField, Button, SuccessMessage |
| **State** | email, isLoading, isSent, error |
| **Validation** | Email format |
| **Navigation** | → Login |

## 6.2. User Management Module

### S-03: Quản lý hồ sơ trẻ (Parent)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem danh sách trẻ, thêm/sửa/xóa hồ sơ trẻ |
| **API** | GET /children, POST /children, PUT /children/{id}, DELETE /children/{id}, GET /skills |
| **Components** | ChildList, ChildCard, AddChildModal, EditChildForm, ConfirmDeleteDialog, AvatarUpload, SkillSelector |
| **State** | children[], selectedChild, isAdding, isEditing, formData, isLoading |
| **Form** | name (required), dateOfBirth (required, tuổi 4-10), avatar, preferredSkills[], loginUsername, loginPassword |
| **Validation** | VR-04 (tuổi 4-10), VR-05 (tên 1-50 ký tự) |
| **Navigation** | Dashboard → Quản lý trẻ → Chi tiết trẻ |

### S-17: Admin — Quản lý người dùng

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Tìm kiếm/lọc users, khóa/mở tài khoản, duyệt Expert |
| **API** | GET /users, PATCH /users/{id}/status, PATCH /experts/{id}/approve, DELETE /users/{id} |
| **Components** | UserTable, SearchBar, FilterBar, UserDetailModal, StatusToggle, ApproveExpertButton, ConfirmDialog, Pagination |
| **State** | users[], filters (role, status, search), pagination, selectedUser, isLoading |
| **Form** | Search input, role filter, status filter |
| **Validation** | — |
| **Navigation** | Admin Dashboard → Quản lý người dùng → Chi tiết |

## 6.3. Education CMS Module

### S-10: Học bài (Child)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Duyệt xem thư viện bài học theo tuổi, xem chi tiết, đánh dấu hoàn thành |
| **API** | GET /lessons, GET /lessons/{id} |
| **Components** | LessonLibrary, LessonCard, LessonDetail, MediaViewer, ProgressBar, CompletionButton |
| **State** | lessons[], selectedLesson, isCompleted, isLoading |
| **Validation** | Lọc theo ageRange |
| **Navigation** | Trang chủ Trẻ → Thư viện bài học → Chi tiết bài |

### S-15: Expert — Soạn nội dung

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Tạo/sửa/xóa Lesson, Quiz, Question; gửi duyệt; xem trạng thái |
| **API** | POST/GET/PUT/DELETE /lessons, POST /lessons/{id}/submit, POST/GET/PUT/DELETE /quizzes, CRUD /questions, GET/POST /skills |
| **Components** | LessonEditor, RichTextEditor, MediaUpload, SkillSelector, AgeRangeSelector, QuizEditor, QuestionEditor, SubmitButton, ContentStatusBadge, ContentList |
| **State** | lessonForm, quizForm, questions[], contentList[], selectedContent, isSubmitting |
| **Form** | title (3-150), content (required), mediaUrls, skillId, ageRange, quiz fields, question fields |
| **Validation** | VR-06 (title 3-150), VR-07 (ageRange), VR-08 (passScore), VR-09 (correctIndex), VR-10 (min 2 options) |
| **Navigation** | Expert Dashboard → Soạn nội dung → Tạo/Sửa → Gửi duyệt |

### S-18: Admin — Kiểm duyệt nội dung

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem danh sách nội dung chờ duyệt, xem trước, duyệt/từ chối/publish/gỡ |
| **API** | GET /lessons?status=pending, PATCH /lessons/{id}/moderate |
| **Components** | ModerationQueue, ContentPreview, ModerationActions, RejectReasonInput, ConfirmDialog |
| **State** | pendingContent[], selectedContent, decision, reason, isLoading |
| **Form** | decision (approve/reject/unpublish), reason (required khi reject) |
| **Validation** | Reason required khi từ chối |
| **Navigation** | Admin Dashboard → Kiểm duyệt → Chi tiết → Duyệt/Từ chối |

## 6.4. Mission Module

### S-04: Tạo/Quản lý nhiệm vụ (Parent)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Tạo, sửa, xóa, gán nhiệm vụ cho trẻ, đặt lịch lặp |
| **API** | POST/GET/PUT/DELETE /missions, GET /children, GET /skills |
| **Components** | MissionList, MissionForm, ChildSelector, SkillSelector, DatePicker, ChecklistEditor, RecurrenceSelector, MissionStatusBadge |
| **State** | missions[], missionForm, selectedMission, children[], isEditing |
| **Form** | title, description, childId, skillId, rewardPoints (≥0), dueDate, recurrence, checklist items[] |
| **Validation** | VR-11 (rewardPoints ≥ 0), VR-12 (dueDate not past), title required |
| **Navigation** | Dashboard → Nhiệm vụ → Tạo/Sửa |

### S-12: Chi tiết nhiệm vụ & Nộp bằng chứng (Child)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem nhiệm vụ, tick checklist, chụp/quay & nộp bằng chứng |
| **API** | GET /missions, GET /missions/{id}, POST /missions/{id}/submissions, PATCH /missions/{id}/checklist |
| **Components** | MissionDetail, ChecklistView, EvidenceUpload, CameraCapture, SubmitButton, StatusBadge |
| **State** | mission, checklist, files[], note, isSubmitting, submissionResult |
| **Form** | files[] (required, ≥1), note (optional) |
| **Validation** | VR-13 (≥1 file, format ảnh/video, dung lượng ≤ limit) |
| **Navigation** | Trang chủ Trẻ → Nhiệm vụ hôm nay → Chi tiết → Nộp |

## 6.5. Submission Module

### S-05: Hàng đợi phê duyệt (Parent)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem danh sách bằng chứng chờ duyệt, xem media + AI gợi ý, duyệt/từ chối |
| **API** | GET /submissions?status=pending, GET /submissions/{id}, PATCH /submissions/{id}/review |
| **Components** | SubmissionQueue, SubmissionCard, MediaPreview, AIConfidenceBadge, ApproveButton, RejectButton, RejectReasonInput |
| **State** | submissions[], selectedSubmission, decision, reason, isLoading |
| **Form** | decision (approved/rejected), reason (required khi reject) |
| **Validation** | Must choose decision; reason required when rejecting |
| **Navigation** | Dashboard → Hàng đợi duyệt → Chi tiết → Duyệt/Từ chối |

## 6.6. Wallet & Gamification Module

### S-13: Ví điểm & Đổi thưởng (Child)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem số dư, lịch sử điểm, danh sách phần thưởng, đổi thưởng |
| **API** | GET /children/{id}/wallet, GET /rewards, POST /rewards/{id}/redeem |
| **Components** | WalletBalance, PointHistory, RewardList, RewardCard, RedeemButton, ConfirmRedeemDialog |
| **State** | wallet, rewards[], selectedReward, isRedeeming |
| **Validation** | Đủ số dư mới cho đổi |
| **Navigation** | Trang chủ Trẻ → Ví điểm → Đổi thưởng |

## 6.7. Pet Module

### S-14: Thú cưng ảo (Child)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem Pet, cho ăn/chăm sóc bằng điểm, xem level/mood/ngoại hình |
| **API** | GET /children/{id}/pet, POST /children/{id}/pet/feed, GET /children/{id}/wallet |
| **Components** | PetDisplay, PetAnimation, FeedButton, PetStatusBar, LevelIndicator, MoodIndicator |
| **State** | pet, walletBalance, isFeedinganimation |
| **Validation** | Đủ điểm mới cho ăn |
| **Navigation** | Trang chủ Trẻ → Thú cưng ảo |

## 6.8. Reward Module

### S-06: Quản lý phần thưởng & ví (Parent)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | CRUD phần thưởng, xem ví con, duyệt yêu cầu đổi thưởng thực |
| **API** | POST/GET/PUT/DELETE /rewards, GET /children/{id}/wallet, GET /rewards/redemptions, PATCH /rewards/redemptions/{id}/approve |
| **Components** | RewardList, RewardForm, RewardCard, WalletOverview, RedemptionQueue, ApproveRedemptionButton |
| **State** | rewards[], rewardForm, redemptions[], wallets[], isEditing |
| **Form** | name, type (virtual/physical), pointCost (>0), description |
| **Validation** | VR-15 (pointCost > 0), name required |
| **Navigation** | Dashboard → Phần thưởng & ví |

## 6.9. Payment Module

### S-08: Gói Premium & Thanh toán (Parent)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem gói, mua, gia hạn, hủy, lịch sử giao dịch |
| **API** | GET /plans, POST /subscriptions, GET /subscriptions/me, PATCH /subscriptions/me/cancel, GET /transactions |
| **Components** | PlanList, PlanCard, CheckoutForm, SubscriptionStatus, TransactionHistory, CancelSubscriptionButton |
| **State** | plans[], currentSubscription, transactions[], selectedPlan, isCheckingOut |
| **Validation** | Plan selection required |
| **Navigation** | Dashboard → Gói Premium → Thanh toán → Kết quả |

## 6.10. Reporting Module

### S-02: Dashboard Phụ huynh

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Tổng quan các con, nhiệm vụ hôm nay, pending submissions, thông báo gần đây |
| **API** | GET /children, GET /missions, GET /submissions?status=pending, GET /notifications |
| **Components** | ChildSummaryCard, TodayMissions, PendingSubmissionsBadge, NotificationPreview, QuickActions |
| **State** | children[], todayMissions[], pendingCount, notifications[] |
| **Navigation** | Entry point → các module con |

### S-07: Báo cáo tiến độ con (Parent)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Thống kê tiến độ theo kỹ năng, lịch sử nhiệm vụ, biểu đồ |
| **API** | GET /reports/child/{id} |
| **Components** | ChildSelector, SkillProgressChart, MissionHistoryTable, DateRangeFilter, StatsCard |
| **State** | selectedChild, reportData, dateRange, isLoading |
| **Navigation** | Dashboard → Báo cáo → Chọn con |

### S-16: Expert — Thống kê nội dung

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem lượt xem, quiz attempts, hiệu quả nội dung |
| **API** | GET /reports/expert/content |
| **Components** | ContentStatsTable, ViewsChart, QuizAttemptsChart |
| **State** | contentStats, isLoading |
| **Navigation** | Expert Dashboard → Thống kê |

### S-19: Admin — Báo cáo & cấu hình

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Báo cáo người dùng, doanh thu, nội dung; cấu hình hệ thống/gói |
| **API** | GET /reports/admin/overview, GET /plans (manage) |
| **Components** | OverviewStats, UserGrowthChart, RevenueChart, ContentStatsChart, SystemConfig, PlanManager |
| **State** | overviewData, dateRange, config, isLoading |
| **Navigation** | Admin Dashboard → Báo cáo / Cấu hình |

## 6.11. Child Home & Notification

### S-09: Trang chủ Trẻ em

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Điểm khởi đầu: Pet, điểm/level, nhiệm vụ hôm nay, nút học bài, huy hiệu |
| **API** | GET /missions, GET /children/{id}/pet, GET /children/{id}/wallet |
| **Components** | PetWidget, PointsBar, LevelBadge, TodayMissionsWidget, LessonButton, BadgeShowcase |
| **State** | childProfile, pet, wallet, todayMissions[] |
| **Navigation** | Entry point → Nhiệm vụ / Học bài / Pet / Ví |

### S-11: Làm Quiz (Child)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Trả lời câu hỏi, xem kết quả, nhận điểm |
| **API** | GET /quizzes/{id}, POST /quizzes/{id}/submit |
| **Components** | QuizPlayer, QuestionCard, OptionSelector, SubmitQuizButton, QuizResult, ScoreDisplay |
| **State** | quiz, currentQuestionIndex, answers[], result, isSubmitting |
| **Validation** | Phải trả lời tất cả câu hỏi |
| **Navigation** | Học bài → Quiz → Kết quả |

### S-20: Thông báo (Tất cả)

| Hạng mục | Chi tiết |
|----------|----------|
| **Chức năng** | Xem danh sách thông báo, đánh dấu đã đọc, nhấn điều hướng |
| **API** | GET /notifications, PATCH /notifications/{id}/read, PATCH /notifications/read-all |
| **Components** | NotificationList, NotificationItem, UnreadBadge, ReadAllButton |
| **State** | notifications[], unreadCount, isLoading |
| **Navigation** | Từ mọi screen → Thông báo → Action URL |

---

# PHẦN 7 — BACKEND ANALYSIS

## 7.1. Authentication Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `authRoutes.js` — POST /register, /login, /refresh, /logout, /forgot-password, /reset-password, /change-password, /verify-email |
| **Controllers** | `authController.js` — register, login, refresh, logout, forgotPassword, resetPassword, changePassword, verifyEmail |
| **Services** | `authService.js` — createUser, authenticateUser, generateTokens, revokeToken, sendVerificationEmail, sendResetEmail, verifyResetToken, hashPassword, comparePassword |
| **Models** | User |
| **Middlewares** | `authMiddleware.js` — verifyToken, verifyRefreshToken; `rateLimiter.js` — loginRateLimit |
| **Validators** | `authValidator.js` — registerSchema, loginSchema, resetPasswordSchema, changePasswordSchema |
| **Utils** | `jwt.js` — sign, verify, decode; `email.js` — sendEmail |
| **Config** | `jwt.config.js` — secret, accessExpiry, refreshExpiry; `email.config.js` |

## 7.2. User Management Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `userRoutes.js` — GET/PUT /me, GET /users, PATCH /users/:id/status, PATCH /experts/:id/approve, DELETE /users/:id; `childRoutes.js` — POST/GET /children, GET/PUT/DELETE /children/:id |
| **Controllers** | `userController.js` — getMe, updateMe, getUsers, updateUserStatus, approveExpert, deleteUser; `childController.js` — createChild, getChildren, getChild, updateChild, deleteChild |
| **Services** | `userService.js` — getProfile, updateProfile, listUsers, lockUnlockUser, approveExpert, deleteUser; `childService.js` — createChildProfile (+ tự tạo Wallet & Pet), listChildren, getChild, updateChild, deleteChild |
| **Models** | User, ChildProfile |
| **Middlewares** | authMiddleware (verifyToken), `roleMiddleware.js` — requireRole(parent/admin), `ownerMiddleware.js` — isChildOwner |
| **Validators** | `userValidator.js` — updateProfileSchema; `childValidator.js` — createChildSchema, updateChildSchema |
| **Utils** | `fileUpload.js` — uploadAvatar |
| **Config** | — |

## 7.3. Education CMS Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `lessonRoutes.js` — CRUD /lessons + /submit + /moderate; `skillRoutes.js` — GET/POST/PUT/DELETE /skills |
| **Controllers** | `lessonController.js` — create, list, getById, update, delete, submitForReview, moderate; `skillController.js` — create, list, update, delete |
| **Services** | `lessonService.js` — CRUD + submitForReview + moderate (approve/reject/unpublish); `skillService.js` — CRUD |
| **Models** | Lesson, Skill |
| **Middlewares** | authMiddleware, roleMiddleware (expert/admin), ownerMiddleware (isLessonOwner) |
| **Validators** | `lessonValidator.js` — createLessonSchema (VR-06, VR-07), moderateSchema; `skillValidator.js` |
| **Utils** | `fileUpload.js` — uploadMedia |
| **Config** | — |

## 7.4. Quiz Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `quizRoutes.js` — CRUD /quizzes, CRUD /quizzes/:id/questions, POST /quizzes/:id/submit |
| **Controllers** | `quizController.js` — createQuiz, getQuiz, updateQuiz, deleteQuiz, submitQuiz; `questionController.js` — addQuestion, updateQuestion, deleteQuestion |
| **Services** | `quizService.js` — CRUD + gradeQuiz + awardPoints; `questionService.js` — CRUD |
| **Models** | Quiz, Question |
| **Middlewares** | authMiddleware, roleMiddleware (expert/child), ownerMiddleware (isQuizOwner) |
| **Validators** | `quizValidator.js` — createQuizSchema (VR-08), submitQuizSchema; `questionValidator.js` — createQuestionSchema (VR-09, VR-10) |
| **Utils** | — |
| **Config** | — |

## 7.5. Mission Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `missionRoutes.js` — CRUD /missions, PATCH /missions/:id/checklist |
| **Controllers** | `missionController.js` — create, list, getById, update, delete, updateChecklist |
| **Services** | `missionService.js` — CRUD + assignToChild + updateStatus + updateChecklist + handleRecurrence + handleOverdue |
| **Models** | Mission, Checklist |
| **Middlewares** | authMiddleware, roleMiddleware (parent/child), ownerMiddleware (isMissionOwner/isAssignedChild) |
| **Validators** | `missionValidator.js` — createMissionSchema (VR-11, VR-12), updateChecklistSchema |
| **Utils** | `scheduler.js` — checkOverdueMissions, createRecurringMissions |
| **Config** | — |

## 7.6. Submission Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `submissionRoutes.js` — POST /missions/:id/submissions, GET /submissions, GET /submissions/:id, PATCH /submissions/:id/review |
| **Controllers** | `submissionController.js` — submit, list, getById, review |
| **Services** | `submissionService.js` — createSubmission (upload + AI call + AILog), listPending, getById, reviewSubmission (approve/reject + awardPoints + updateMission + notify) |
| **Models** | Submission, AILog |
| **Middlewares** | authMiddleware, roleMiddleware (child/parent), ownerMiddleware (isChildOfParent), `uploadMiddleware.js` — multer config |
| **Validators** | `submissionValidator.js` — submitSchema (VR-13), reviewSchema |
| **Utils** | `cloudStorage.js` — uploadFile, getSignedUrl; `aiService.js` — analyzeEvidence |
| **Config** | `ai.config.js` — endpoint, apiKey, confidenceThresholds; `storage.config.js` |

## 7.7. Wallet Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `walletRoutes.js` — GET /children/:id/wallet |
| **Controllers** | `walletController.js` — getWallet |
| **Services** | `walletService.js` — getWallet, addPoints, deductPoints (kiểm tra balance ≥ 0), getHistory |
| **Models** | Wallet |
| **Middlewares** | authMiddleware, roleMiddleware (parent/child), ownerMiddleware |
| **Validators** | — |
| **Utils** | — |
| **Config** | — |

## 7.8. Pet Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `petRoutes.js` — GET /children/:id/pet, POST /children/:id/pet/feed |
| **Controllers** | `petController.js` — getPet, feedPet |
| **Services** | `petService.js` — getPet, feedPet (deduct wallet + update mood/level/appearance), updateMoodBasedOnActivity |
| **Models** | Pet |
| **Middlewares** | authMiddleware, roleMiddleware (child/parent), ownerMiddleware |
| **Validators** | `petValidator.js` — feedSchema (pointsUsed > 0) |
| **Utils** | — |
| **Config** | `pet.config.js` — levelThresholds, moodDecayInterval |

## 7.9. Reward Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `rewardRoutes.js` — CRUD /rewards, POST /rewards/:id/redeem, GET /rewards/redemptions, PATCH /rewards/redemptions/:id/approve |
| **Controllers** | `rewardController.js` — create, list, update, delete, redeem, listRedemptions, approveRedemption |
| **Services** | `rewardService.js` — CRUD + redeemReward (check balance, virtual→trừ ngay, physical→chờ duyệt) + approveRedemption (trừ điểm + trao) |
| **Models** | Reward |
| **Middlewares** | authMiddleware, roleMiddleware (parent/child), ownerMiddleware |
| **Validators** | `rewardValidator.js` — createRewardSchema (VR-15), redeemSchema |
| **Utils** | — |
| **Config** | — |

## 7.10. Payment Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `paymentRoutes.js` — GET /plans, POST /subscriptions, GET /subscriptions/me, PATCH /subscriptions/me/cancel, POST /payments/webhook, GET /transactions |
| **Controllers** | `paymentController.js` — getPlans, createSubscription, getMySubscription, cancelSubscription, handleWebhook, getTransactions |
| **Services** | `paymentService.js` — listPlans, initiatePayment, processWebhook (verify signature + update Subscription/Transaction + activate Premium), cancelSubscription, listTransactions |
| **Models** | Subscription, Transaction |
| **Middlewares** | authMiddleware, roleMiddleware (parent), `webhookMiddleware.js` — verifyWebhookSignature |
| **Validators** | `paymentValidator.js` — createSubscriptionSchema (VR-17, VR-18) |
| **Utils** | `paymentGateway.js` — createCheckoutSession, verifySignature |
| **Config** | `payment.config.js` — gatewayKey, gatewaySecret, webhookSecret, plans[] |

## 7.11. Reporting Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `reportRoutes.js` — GET /reports/child/:id, GET /reports/admin/overview, GET /reports/expert/content |
| **Controllers** | `reportController.js` — getChildReport, getAdminOverview, getExpertContentStats |
| **Services** | `reportService.js` — aggregateChildProgress, aggregateAdminStats, aggregateExpertStats |
| **Models** | Đọc aggregate từ ChildProfile, Mission, Submission, Transaction, Lesson, User |
| **Middlewares** | authMiddleware, roleMiddleware (parent/admin/expert) |
| **Validators** | `reportValidator.js` — dateRangeSchema |
| **Utils** | — |
| **Config** | — |

## 7.12. Notification Module

| Layer | Chi tiết |
|-------|----------|
| **Routes** | `notificationRoutes.js` — GET /notifications, PATCH /notifications/:id/read, PATCH /notifications/read-all |
| **Controllers** | `notificationController.js` — list, markRead, markAllRead |
| **Services** | `notificationService.js` — createNotification (trigger), listByUser, markRead, markAllRead, sendPush (FCM) |
| **Models** | Notification |
| **Middlewares** | authMiddleware |
| **Validators** | — |
| **Utils** | `fcm.js` — sendPushNotification; `notificationTrigger.js` — các trigger event |
| **Config** | `fcm.config.js` — serviceAccount, projectId |

## 7.13. Shared / Common

| Layer | Chi tiết |
|-------|----------|
| **Middlewares** | `authMiddleware.js`, `roleMiddleware.js`, `ownerMiddleware.js`, `errorHandler.js`, `rateLimiter.js`, `corsMiddleware.js`, `loggerMiddleware.js` |
| **Utils** | `jwt.js`, `email.js`, `cloudStorage.js`, `aiService.js`, `paymentGateway.js`, `fcm.js`, `logger.js`, `responseHelper.js` |
| **Config** | `db.config.js`, `app.config.js`, `jwt.config.js`, `email.config.js`, `storage.config.js`, `ai.config.js`, `payment.config.js`, `fcm.config.js` |

---

# PHẦN 8 — DEPENDENCY ANALYSIS

## 8.1. Sơ đồ phụ thuộc

```
Authentication
    ↓
User Management (User + ChildProfile)
    ↓                        ↓
Education CMS ←──────── Mission
(Lesson, Skill, Quiz)       ↓
    ↓                   Submission & AI Verification
    ↓                        ↓
    ↓                   Wallet ←────── Gamification
    ↓                     ↓      ↓
    ↓                   Pet    Reward
    ↓                     ↓
    └──────────────→ Reporting ←────── Payment
                         ↑
                    Notification (cross-cutting, trigger từ mọi module)
```

## 8.2. Phân tích phụ thuộc

| Module | Phụ thuộc trực tiếp | Phải làm trước | Có thể song song |
|--------|---------------------|----------------|-------------------|
| **Authentication** | — | — (làm đầu tiên) | — |
| **User Management** | Authentication | Authentication | — |
| **Education CMS** | Authentication, User | Auth + User | Song song với Mission |
| **Quiz** | Education CMS | Lesson | Song song với Mission |
| **Mission** | User (ChildProfile) | Auth + User | Song song với Lesson |
| **Submission** | Mission, User | Mission | — |
| **Wallet** | User (ChildProfile) | Auth + User | Song song với Mission |
| **Pet** | User (ChildProfile), Wallet | Auth + User + Wallet | — |
| **Reward** | User, Wallet | Auth + User + Wallet | Song song với Pet |
| **Gamification** | User, Wallet | Auth + User + Wallet | Tích hợp vào Submission/Quiz |
| **Payment** | User | Auth + User | Song song với Mission/Lesson |
| **Reporting** | Tất cả (đọc aggregate) | Gần cuối | — |
| **Notification** | Tất cả (trigger) | Auth + User (cơ bản), bổ sung trigger sau | Phần cơ bản có thể song song |

---

# PHẦN 9 — THỨ TỰ CODE

| Thứ tự | Module | Lý do |
|--------|--------|-------|
| **1** | Authentication | Nền tảng cho mọi module; JWT middleware dùng toàn hệ thống |
| **2** | User Management + ChildProfile | Mọi chức năng cần User/ChildProfile; tạo ChildProfile kèm Wallet + Pet |
| **3** | Wallet + Pet (cơ bản) | Tạo cùng lúc với ChildProfile; cần trước khi cộng/trừ điểm |
| **4** | Education CMS (Lesson + Skill) | Nền tảng nội dung; Expert cần sớm để tạo bài |
| **5** | Quiz | Gắn với Lesson; Expert tạo quiz cho bài học |
| **6** | Mission | Cần ChildProfile + Skill; là luồng chính của hệ thống |
| **7** | Submission + AI Verification | Cần Mission; hoàn thiện luồng lõi (nộp → AI → duyệt → cộng điểm) |
| **8** | Reward + Gamification | Cần Wallet hoạt động; hoàn thiện vòng lặp động lực |
| **9** | Payment | Cần User; không phụ thuộc luồng chính, có thể làm song song |
| **10** | Notification | Cross-cutting; thêm trigger vào từng module khi hoàn thành |
| **11** | Reporting + Dashboard | Cần dữ liệu từ tất cả module; làm cuối cùng |

---

# PHẦN 10 — CHIA DATABASE

| Developer | Models | Số lượng | Ghi chú |
|-----------|--------|----------|---------|
| **Developer 1** | User, ChildProfile, Skill, Notification | 4 | Core user data + notification |
| **Developer 2** | Lesson, Quiz, Question, Mission, Checklist, Submission, AILog | 7 | Content + mission flow (luồng chính) |
| **Developer 3** | Wallet, Pet, Reward, Certificate, Subscription, Transaction | 6 | Gamification + Payment |

---

# PHẦN 11 — CHIA BACKEND

## Developer 1 — Auth + User + Notification

| Layer | Module phụ trách |
|-------|-----------------|
| **Routes** | authRoutes, userRoutes, childRoutes, skillRoutes, notificationRoutes |
| **Controllers** | authController, userController, childController, skillController, notificationController |
| **Services** | authService, userService, childService, skillService, notificationService |
| **Models** | User, ChildProfile, Skill, Notification |
| **Middlewares** | authMiddleware, roleMiddleware, ownerMiddleware, rateLimiter, errorHandler, corsMiddleware, loggerMiddleware |
| **Validators** | authValidator, userValidator, childValidator, skillValidator |
| **Utils** | jwt.js, email.js, fcm.js, logger.js, responseHelper.js |
| **Config** | db.config, app.config, jwt.config, email.config, fcm.config |

## Developer 2 — Education CMS + Mission + Submission

| Layer | Module phụ trách |
|-------|-----------------|
| **Routes** | lessonRoutes, quizRoutes, missionRoutes, submissionRoutes |
| **Controllers** | lessonController, quizController, questionController, missionController, submissionController |
| **Services** | lessonService, quizService, questionService, missionService, submissionService |
| **Models** | Lesson, Quiz, Question, Mission, Checklist, Submission, AILog |
| **Middlewares** | uploadMiddleware (multer) |
| **Validators** | lessonValidator, quizValidator, questionValidator, missionValidator, submissionValidator |
| **Utils** | cloudStorage.js, aiService.js, scheduler.js, fileUpload.js |
| **Config** | ai.config, storage.config |

## Developer 3 — Wallet + Pet + Reward + Payment + Reporting

| Layer | Module phụ trách |
|-------|-----------------|
| **Routes** | walletRoutes, petRoutes, rewardRoutes, paymentRoutes, reportRoutes |
| **Controllers** | walletController, petController, rewardController, paymentController, reportController |
| **Services** | walletService, petService, rewardService, paymentService, reportService |
| **Models** | Wallet, Pet, Reward, Certificate, Subscription, Transaction |
| **Middlewares** | webhookMiddleware |
| **Validators** | petValidator, rewardValidator, paymentValidator, reportValidator |
| **Utils** | paymentGateway.js |
| **Config** | payment.config, pet.config |

---

# PHẦN 12 — CHIA FRONTEND

## Developer 1 — Auth + User + Admin + Notification

| Màn hình | Mã | Platform | Mô tả |
|----------|-----|----------|-------|
| Login | S-01a | 📱🖥️ | App: Parent/Child; Web: Admin/Expert |
| Register | S-01b | 📱🖥️ | App: Parent; Web: Expert |
| Forgot Password | S-01c | 📱🖥️ | Cả hai |
| Quản lý hồ sơ trẻ | S-03 | 📱 | React Native (Parent) |
| Admin — Quản lý người dùng | S-17 | 🖥️ | ReactJS (Admin Web) |
| Thông báo | S-20 | 📱🖥️ | App: push + list; Web: dropdown + list |

## Developer 2 — Education + Mission + Submission

| Màn hình | Mã | Mô tả |
|----------|-----|-------|
| Học bài | S-10 | Thư viện bài học (Child) |
| Làm Quiz | S-11 | Trả lời câu hỏi (Child) |
| Expert — Soạn nội dung | S-15 | Tạo Lesson/Quiz |
| Admin — Kiểm duyệt nội dung | S-18 | Duyệt nội dung |
| Tạo/Quản lý nhiệm vụ | S-04 | CRUD Mission (Parent) |
| Chi tiết nhiệm vụ & Nộp bằng chứng | S-12 | Nhiệm vụ + nộp (Child) |
| Hàng đợi phê duyệt | S-05 | Duyệt submission (Parent) |

## Developer 3 — Wallet + Pet + Reward + Payment + Dashboard + Reporting

| Màn hình | Mã | Platform | Mô tả |
|----------|-----|----------|-------|
| Trang chủ Trẻ em | S-09 | 📱 | React Native — Child home |
| Ví điểm & Đổi thưởng | S-13 | 📱 | React Native — Child |
| Thú cưng ảo | S-14 | 📱 | React Native — Child (animation) |
| Quản lý phần thưởng & ví | S-06 | 📱 | React Native — Parent |
| Dashboard Phụ huynh | S-02 | 📱 | React Native — Parent |
| Báo cáo tiến độ con | S-07 | 📱 | React Native — Parent |
| Expert — Thống kê | S-16 | 🖥️ | ReactJS — Expert Web |
| Gói Premium & Thanh toán | S-08 | 📱 | React Native — Parent |
| Admin — Báo cáo & cấu hình | S-19 | 🖥️ | ReactJS — Admin Web |

---

# PHẦN 13 — CHIA COMPONENT

## Developer 1 — Shared + Auth + User + Notification

| Component | Mô tả |
|-----------|-------|
| **Button** | Nút chung (primary, secondary, danger) |
| **InputField** | Input chung (text, email, password, number) |
| **PasswordField** | Input mật khẩu có toggle show/hide |
| **Header** | Header navigation chung |
| **Sidebar** | Sidebar menu chung |
| **Footer** | Footer chung |
| **Layout** | Layout wrapper cho từng role |
| **ErrorAlert** | Hiển thị lỗi |
| **SuccessMessage** | Hiển thị thành công |
| **ConfirmDialog** | Dialog xác nhận |
| **Pagination** | Phân trang |
| **SearchBar** | Ô tìm kiếm |
| **FilterBar** | Bộ lọc |
| **Spinner / Loading** | Loading indicator |
| **Avatar / AvatarUpload** | Hiển thị/upload avatar |
| **LoginForm** | Form đăng nhập |
| **RegisterForm** | Form đăng ký |
| **ForgotPasswordForm** | Form quên mật khẩu |
| **ChildCard** | Card hiển thị hồ sơ trẻ |
| **ChildList** | Danh sách trẻ |
| **AddChildModal** | Modal thêm trẻ |
| **EditChildForm** | Form sửa trẻ |
| **SkillSelector** | Chọn kỹ năng |
| **UserTable** | Bảng người dùng (Admin) |
| **StatusToggle** | Toggle khóa/mở tài khoản |
| **ApproveExpertButton** | Nút duyệt Expert |
| **NotificationList** | Danh sách thông báo |
| **NotificationItem** | Item thông báo |
| **UnreadBadge** | Badge số chưa đọc |
| **ReadAllButton** | Nút đánh dấu đọc hết |
| **RoleSelector** | Chọn role khi đăng ký |
| **Modal** | Modal chung |
| **Tabs** | Tab navigation |
| **Badge** | Badge chung |
| **Toast** | Toast notification |

## Developer 2 — Education + Mission + Submission

| Component | Mô tả |
|-----------|-------|
| **LessonCard** | Card bài học |
| **LessonLibrary** | Thư viện bài học |
| **LessonDetail** | Chi tiết bài học |
| **LessonEditor** | Editor tạo/sửa bài học |
| **RichTextEditor** | Editor nội dung rich text |
| **MediaUpload** | Upload media (ảnh/video) |
| **MediaViewer** | Xem ảnh/video |
| **AgeRangeSelector** | Chọn độ tuổi |
| **ContentStatusBadge** | Badge trạng thái nội dung |
| **ContentList** | Danh sách nội dung (Expert) |
| **QuizEditor** | Editor tạo/sửa quiz |
| **QuestionEditor** | Editor câu hỏi |
| **QuizPlayer** | Giao diện làm quiz |
| **QuestionCard** | Card câu hỏi |
| **OptionSelector** | Chọn đáp án |
| **QuizResult** | Hiển thị kết quả quiz |
| **ScoreDisplay** | Hiển thị điểm |
| **SubmitQuizButton** | Nút nộp quiz |
| **MissionCard** | Card nhiệm vụ |
| **MissionList** | Danh sách nhiệm vụ |
| **MissionForm** | Form tạo/sửa nhiệm vụ |
| **MissionDetail** | Chi tiết nhiệm vụ |
| **MissionStatusBadge** | Badge trạng thái nhiệm vụ |
| **ChildSelector** | Chọn trẻ gán nhiệm vụ |
| **DatePicker** | Chọn ngày |
| **RecurrenceSelector** | Chọn lịch lặp |
| **ChecklistEditor** | Sửa checklist (Parent) |
| **ChecklistView** | Hiển thị/tick checklist (Child) |
| **EvidenceUpload** | Upload bằng chứng |
| **CameraCapture** | Chụp ảnh/quay video |
| **SubmissionQueue** | Hàng đợi duyệt |
| **SubmissionCard** | Card submission |
| **MediaPreview** | Xem trước bằng chứng |
| **AIConfidenceBadge** | Badge confidence AI |
| **ApproveButton** | Nút duyệt |
| **RejectButton** | Nút từ chối |
| **RejectReasonInput** | Nhập lý do từ chối |
| **ModerationQueue** | Hàng đợi kiểm duyệt (Admin) |
| **ContentPreview** | Xem trước nội dung (Admin) |
| **ModerationActions** | Nút duyệt/từ chối (Admin) |
| **ProgressBar** | Thanh tiến trình |
| **CompletionButton** | Nút đánh dấu hoàn thành |
| **SubmitButton** | Nút nộp chung |

## Developer 3 — Wallet + Pet + Reward + Payment + Dashboard + Reporting

| Component | Mô tả |
|-----------|-------|
| **WalletBalance** | Hiển thị số dư |
| **PointHistory** | Lịch sử biến động điểm |
| **PetDisplay** | Hiển thị Pet |
| **PetAnimation** | Animation Pet |
| **FeedButton** | Nút cho ăn |
| **PetStatusBar** | Thanh trạng thái Pet |
| **LevelIndicator** | Hiển thị level |
| **MoodIndicator** | Hiển thị tâm trạng |
| **PetWidget** | Widget Pet nhỏ (trang chủ trẻ) |
| **PointsBar** | Thanh điểm |
| **LevelBadge** | Badge level |
| **TodayMissionsWidget** | Widget nhiệm vụ hôm nay |
| **BadgeShowcase** | Hiển thị huy hiệu |
| **RewardCard** | Card phần thưởng |
| **RewardList** | Danh sách phần thưởng |
| **RewardForm** | Form tạo/sửa phần thưởng |
| **RedeemButton** | Nút đổi thưởng |
| **ConfirmRedeemDialog** | Dialog xác nhận đổi |
| **RedemptionQueue** | Hàng đợi yêu cầu đổi thưởng |
| **ApproveRedemptionButton** | Nút duyệt đổi thưởng |
| **WalletOverview** | Tổng quan ví (Parent) |
| **PlanList** | Danh sách gói Premium |
| **PlanCard** | Card gói Premium |
| **CheckoutForm** | Form thanh toán |
| **SubscriptionStatus** | Trạng thái subscription |
| **TransactionHistory** | Lịch sử giao dịch |
| **CancelSubscriptionButton** | Nút hủy subscription |
| **ChildSummaryCard** | Card tổng quan trẻ (Dashboard) |
| **PendingSubmissionsBadge** | Badge pending (Dashboard) |
| **NotificationPreview** | Preview thông báo (Dashboard) |
| **QuickActions** | Nút nhanh (Dashboard) |
| **ChildSelector** (report) | Chọn trẻ xem báo cáo |
| **SkillProgressChart** | Biểu đồ tiến độ kỹ năng |
| **MissionHistoryTable** | Bảng lịch sử nhiệm vụ |
| **DateRangeFilter** | Bộ lọc ngày |
| **StatsCard** | Card thống kê |
| **OverviewStats** | Thống kê tổng quan (Admin) |
| **UserGrowthChart** | Biểu đồ tăng trưởng users |
| **RevenueChart** | Biểu đồ doanh thu |
| **ContentStatsChart** | Biểu đồ thống kê nội dung |
| **ContentStatsTable** | Bảng thống kê nội dung (Expert) |
| **ViewsChart** | Biểu đồ lượt xem |
| **QuizAttemptsChart** | Biểu đồ quiz attempts |
| **SystemConfig** | Cấu hình hệ thống (Admin) |
| **PlanManager** | Quản lý gói Premium (Admin) |
| **LessonButton** | Nút học bài (trang chủ trẻ) |

---

# PHẦN 14 — CHIA API

## Developer 1 — Auth + User + Notification

| Module | API |
|--------|-----|
| **Auth** | POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, POST /auth/forgot-password, POST /auth/reset-password, PUT /auth/change-password, POST /auth/verify-email |
| **User** | GET /users/me, PUT /users/me, GET /users, PATCH /users/{id}/status, PATCH /experts/{id}/approve, DELETE /users/{id} |
| **Child** | POST /children, GET /children, GET /children/{id}, PUT /children/{id}, DELETE /children/{id} |
| **Skill** | GET /skills, POST /skills, PUT /skills/{id}, DELETE /skills/{id} |
| **Notification** | GET /notifications, PATCH /notifications/{id}/read, PATCH /notifications/read-all |

**Tổng: ~21 endpoints**

## Developer 2 — Education CMS + Mission + Submission

| Module | API |
|--------|-----|
| **Lesson** | POST /lessons, GET /lessons, GET /lessons/{id}, PUT /lessons/{id}, DELETE /lessons/{id}, POST /lessons/{id}/submit, PATCH /lessons/{id}/moderate |
| **Quiz** | POST /quizzes, GET /quizzes/{id}, PUT /quizzes/{id}, DELETE /quizzes/{id}, POST /quizzes/{id}/questions, PUT /quizzes/{qId}/questions/{quesId}, DELETE /quizzes/{qId}/questions/{quesId}, POST /quizzes/{id}/submit |
| **Mission** | POST /missions, GET /missions, GET /missions/{id}, PUT /missions/{id}, DELETE /missions/{id}, PATCH /missions/{id}/checklist |
| **Submission** | POST /missions/{id}/submissions, GET /submissions, GET /submissions/{id}, PATCH /submissions/{id}/review |

**Tổng: ~21 endpoints**

## Developer 3 — Wallet + Pet + Reward + Payment + Reporting

| Module | API |
|--------|-----|
| **Wallet** | GET /children/{id}/wallet |
| **Pet** | GET /children/{id}/pet, POST /children/{id}/pet/feed |
| **Reward** | POST /rewards, GET /rewards, PUT /rewards/{id}, DELETE /rewards/{id}, POST /rewards/{id}/redeem, GET /rewards/redemptions, PATCH /rewards/redemptions/{id}/approve |
| **Payment** | GET /plans, POST /subscriptions, GET /subscriptions/me, PATCH /subscriptions/me/cancel, POST /payments/webhook, GET /transactions |
| **Reporting** | GET /reports/child/{id}, GET /reports/admin/overview, GET /reports/expert/content |

**Tổng: ~19 endpoints**

---

# PHẦN 15 — CHIA GIT

## 15.1. Branch Strategy

```
main                          ← Production (chỉ merge từ develop, qua PR + review)
  │
  └── develop                 ← Integration branch (merge từ feature branches)
        │
        ├── feature/auth-user-notification     ← Developer 1
        │     ├── feature/auth
        │     ├── feature/user-management
        │     ├── feature/child-profile
        │     ├── feature/skill
        │     └── feature/notification
        │
        ├── feature/education-mission-submission  ← Developer 2
        │     ├── feature/lesson-cms
        │     ├── feature/quiz
        │     ├── feature/mission
        │     └── feature/submission-ai
        │
        └── feature/wallet-reward-payment-report  ← Developer 3
              ├── feature/wallet-pet
              ├── feature/reward
              ├── feature/payment
              └── feature/reporting-dashboard
```

## 15.2. Quy tắc

| Quy tắc | Chi tiết |
|----------|----------|
| **Naming Convention** | `feature/<module-name>`, `bugfix/<issue>`, `hotfix/<issue>` |
| **Merge Strategy** | Feature → develop (PR + review ≥1 member); develop → main (PR + review cả team) |
| **Code Review** | Mỗi PR cần ít nhất 1 team member review |
| **Conflict Resolution** | Merge develop vào feature branch thường xuyên (ít nhất 1 lần/ngày) |
| **Shared Files** | Thống nhất interface/contract trước, mỗi module file riêng |
| **Commit Convention** | `feat: `, `fix: `, `refactor: `, `docs: `, `chore: ` |

---

# PHẦN 16 — DEPENDENCY GIỮA 3 DEVELOPER

## 16.1. Sơ đồ phụ thuộc

```
Developer 1 (Auth + User + Notification)
    │
    ├──────────────────→ Developer 2 (Education + Mission + Submission)
    │                         │
    └──────────────────→ Developer 3 (Wallet + Pet + Reward + Payment + Report)
                              │
         Developer 2 ────────→ Developer 3
         (Submission cộng điểm → Wallet)
```

## 16.2. Phân tích chi tiết

| Quan hệ | Chi tiết | Mức độ |
|----------|----------|--------|
| **Dev 2 → Dev 1** | Cần User model, authMiddleware, roleMiddleware, ownerMiddleware, ChildProfile model | **CAO** — phải chờ Dev 1 hoàn thành Auth + User trước |
| **Dev 3 → Dev 1** | Cần User model, ChildProfile model (tạo Wallet + Pet khi tạo child), authMiddleware | **CAO** — phải chờ Dev 1 hoàn thành Auth + User trước |
| **Dev 3 → Dev 2** | Submission approved → gọi walletService.addPoints; Quiz passed → gọi walletService.addPoints | **TRUNG BÌNH** — Dev 3 cung cấp interface walletService, Dev 2 gọi khi duyệt/chấm xong |
| **Dev 2 → Dev 3** | Mission/Submission flow cần Wallet để cộng điểm | **TRUNG BÌNH** — cùng chiều với trên |
| **Dev 1 → Dev 2** | Notification trigger từ Submission (bằng chứng chờ duyệt, kết quả duyệt) | **THẤP** — Dev 1 cung cấp notificationService.create, Dev 2 gọi trigger |
| **Dev 1 → Dev 3** | Notification trigger từ Payment, Reward | **THẤP** — tương tự |

## 16.3. Đề xuất giảm xung đột

| Biện pháp | Chi tiết |
|-----------|----------|
| **1. Interface contract trước** | Tuần đầu: cả 3 thống nhất Model schema (Mongoose), Middleware interface, Service interface (function signatures). Dev 1 tạo skeleton middleware/model trước. |
| **2. File riêng biệt** | Mỗi module có folder riêng: `src/modules/auth/`, `src/modules/lesson/`, `src/modules/wallet/`... Không ai sửa file của module người khác. |
| **3. Shared code tách riêng** | Shared middleware, utils, config đặt trong `src/shared/`. Dev 1 làm chủ shared, Dev 2/3 chỉ import, không sửa. |
| **4. Service interface** | Dev 3 export `walletService.addPoints(childId, amount, ref)` sớm (dù logic chưa xong). Dev 2 import và gọi. Cả hai dev song song. |
| **5. Merge develop thường xuyên** | Mỗi ngày merge develop vào feature branch để phát hiện conflict sớm. |
| **6. PR nhỏ, merge thường xuyên** | Không để PR quá lớn; hoàn thành module con → merge ngay vào develop. |
| **7. Stub/Mock cho cross-module** | Nếu module phụ thuộc chưa xong, dùng stub/mock để tiếp tục code và test. |

## 16.4. Thứ tự khởi động tối ưu

```
Tuần 1:  Dev 1 → Auth + User + ChildProfile + Shared Middleware
         Dev 2 → Setup project structure, Lesson/Quiz Model (draft)
         Dev 3 → Setup Wallet/Pet Model (draft), Payment Gateway nghiên cứu

Tuần 2:  Dev 1 merge Auth+User → develop
         Dev 2 → Lesson + Quiz + Mission (dùng Auth middleware từ Dev 1)
         Dev 3 → Wallet + Pet + Reward (dùng ChildProfile từ Dev 1)

Tuần 3:  Dev 2 → Submission + AI integration
         Dev 3 → Payment + cross-module integration (walletService)
         Dev 1 → Notification + Skill + polish

Tuần 4:  Dev 3 → Reporting + Dashboard
         Dev 2 → Polish + trigger notification
         Dev 1 → Polish + integration testing
         Cả 3 → Integration testing, bug fix, merge → main
```

---

# PHẦN 17 — TASK CHECKLIST

---

## Developer 1 — Auth + User + Notification

### Database Models

| # | Model | Trạng thái |
|---|-------|-----------|
| 1 | User | ☐ |
| 2 | ChildProfile | ☐ |
| 3 | Skill | ☐ |
| 4 | Notification | ☐ |

### Backend API

| # | API | Trạng thái |
|---|-----|-----------|
| 1 | POST /auth/register | ☐ |
| 2 | POST /auth/login | ☐ |
| 3 | POST /auth/refresh | ☐ |
| 4 | POST /auth/logout | ☐ |
| 5 | POST /auth/forgot-password | ☐ |
| 6 | POST /auth/reset-password | ☐ |
| 7 | PUT /auth/change-password | ☐ |
| 8 | POST /auth/verify-email | ☐ |
| 9 | GET /users/me | ☐ |
| 10 | PUT /users/me | ☐ |
| 11 | GET /users | ☐ |
| 12 | PATCH /users/{id}/status | ☐ |
| 13 | PATCH /experts/{id}/approve | ☐ |
| 14 | DELETE /users/{id} | ☐ |
| 15 | POST /children | ☐ |
| 16 | GET /children | ☐ |
| 17 | GET /children/{id} | ☐ |
| 18 | PUT /children/{id} | ☐ |
| 19 | DELETE /children/{id} | ☐ |
| 20 | GET/POST/PUT/DELETE /skills | ☐ |
| 21 | GET /notifications | ☐ |
| 22 | PATCH /notifications/{id}/read | ☐ |
| 23 | PATCH /notifications/read-all | ☐ |

### Backend Modules

| # | Module | File | Trạng thái |
|---|--------|------|-----------|
| 1 | Routes | authRoutes, userRoutes, childRoutes, skillRoutes, notificationRoutes | ☐ |
| 2 | Controllers | authController, userController, childController, skillController, notificationController | ☐ |
| 3 | Services | authService, userService, childService, skillService, notificationService | ☐ |
| 4 | Middlewares | authMiddleware, roleMiddleware, ownerMiddleware, rateLimiter, errorHandler, cors, logger | ☐ |
| 5 | Validators | authValidator, userValidator, childValidator, skillValidator | ☐ |
| 6 | Utils | jwt.js, email.js, fcm.js, logger.js, responseHelper.js | ☐ |
| 7 | Config | db.config, app.config, jwt.config, email.config, fcm.config | ☐ |

### Frontend Screens

| # | Screen | Mã | Trạng thái |
|---|--------|----|-----------|
| 1 | Login | S-01a | ☐ |
| 2 | Register | S-01b | ☐ |
| 3 | Forgot Password | S-01c | ☐ |
| 4 | Quản lý hồ sơ trẻ | S-03 | ☐ |
| 5 | Admin — Quản lý người dùng | S-17 | ☐ |
| 6 | Thông báo | S-20 | ☐ |

### Frontend Components

| # | Component | Trạng thái |
|---|-----------|-----------|
| 1 | Button, InputField, PasswordField | ☐ |
| 2 | Header, Sidebar, Footer, Layout | ☐ |
| 3 | ErrorAlert, SuccessMessage, ConfirmDialog | ☐ |
| 4 | Pagination, SearchBar, FilterBar, Spinner | ☐ |
| 5 | Modal, Tabs, Badge, Toast | ☐ |
| 6 | Avatar, AvatarUpload | ☐ |
| 7 | LoginForm, RegisterForm, ForgotPasswordForm | ☐ |
| 8 | RoleSelector | ☐ |
| 9 | ChildCard, ChildList, AddChildModal, EditChildForm | ☐ |
| 10 | SkillSelector | ☐ |
| 11 | UserTable, StatusToggle, ApproveExpertButton | ☐ |
| 12 | NotificationList, NotificationItem, UnreadBadge, ReadAllButton | ☐ |

### Git Branch

```
feature/auth-user-notification
  ├── feature/auth
  ├── feature/user-management
  ├── feature/child-profile
  ├── feature/skill
  └── feature/notification
```

### Task Summary

| # | Task | Ưu tiên |
|---|------|---------|
| 1 | Setup project structure (Express, MongoDB, folder structure) | 🔴 Cao |
| 2 | Implement User model + ChildProfile model + Skill model | 🔴 Cao |
| 3 | Implement shared middleware (auth, role, owner, error, cors, logger, rateLimiter) | 🔴 Cao |
| 4 | Implement Auth module (register, login, logout, refresh, forgot/reset password, verify email) | 🔴 Cao |
| 5 | Implement User Management module (profile CRUD, Admin user management, approve Expert) | 🔴 Cao |
| 6 | Implement Child Profile module (CRUD + auto-create Wallet/Pet) | 🔴 Cao |
| 7 | Implement Skill module (CRUD) | 🟡 Trung bình |
| 8 | Implement Notification model + module (CRUD, mark read, push via FCM) | 🟡 Trung bình |
| 9 | Implement shared utils (jwt, email, fcm, logger, responseHelper) | 🔴 Cao |
| 10 | Implement Frontend shared components (Button, Input, Layout, Modal, etc.) | 🔴 Cao |
| 11 | Implement Frontend Auth screens (Login, Register, Forgot Password) | 🔴 Cao |
| 12 | Implement Frontend Child Profile management | 🔴 Cao |
| 13 | Implement Frontend Admin User Management | 🟡 Trung bình |
| 14 | Implement Frontend Notification screen | 🟡 Trung bình |

---

## Developer 2 — Education CMS + Mission + Submission

### Database Models

| # | Model | Trạng thái |
|---|-------|-----------|
| 1 | Lesson | ☐ |
| 2 | Quiz | ☐ |
| 3 | Question | ☐ |
| 4 | Mission | ☐ |
| 5 | Checklist | ☐ |
| 6 | Submission | ☐ |
| 7 | AILog | ☐ |

### Backend API

| # | API | Trạng thái |
|---|-----|-----------|
| 1 | POST /lessons | ☐ |
| 2 | GET /lessons | ☐ |
| 3 | GET /lessons/{id} | ☐ |
| 4 | PUT /lessons/{id} | ☐ |
| 5 | DELETE /lessons/{id} | ☐ |
| 6 | POST /lessons/{id}/submit | ☐ |
| 7 | PATCH /lessons/{id}/moderate | ☐ |
| 8 | POST /quizzes | ☐ |
| 9 | GET /quizzes/{id} | ☐ |
| 10 | PUT /quizzes/{id} | ☐ |
| 11 | DELETE /quizzes/{id} | ☐ |
| 12 | POST /quizzes/{id}/questions | ☐ |
| 13 | PUT /quizzes/{qId}/questions/{quesId} | ☐ |
| 14 | DELETE /quizzes/{qId}/questions/{quesId} | ☐ |
| 15 | POST /quizzes/{id}/submit | ☐ |
| 16 | POST /missions | ☐ |
| 17 | GET /missions | ☐ |
| 18 | GET /missions/{id} | ☐ |
| 19 | PUT /missions/{id} | ☐ |
| 20 | DELETE /missions/{id} | ☐ |
| 21 | PATCH /missions/{id}/checklist | ☐ |
| 22 | POST /missions/{id}/submissions | ☐ |
| 23 | GET /submissions | ☐ |
| 24 | GET /submissions/{id} | ☐ |
| 25 | PATCH /submissions/{id}/review | ☐ |

### Backend Modules

| # | Module | File | Trạng thái |
|---|--------|------|-----------|
| 1 | Routes | lessonRoutes, quizRoutes, missionRoutes, submissionRoutes | ☐ |
| 2 | Controllers | lessonController, quizController, questionController, missionController, submissionController | ☐ |
| 3 | Services | lessonService, quizService, questionService, missionService, submissionService | ☐ |
| 4 | Middlewares | uploadMiddleware (multer) | ☐ |
| 5 | Validators | lessonValidator, quizValidator, questionValidator, missionValidator, submissionValidator | ☐ |
| 6 | Utils | cloudStorage.js, aiService.js, scheduler.js, fileUpload.js | ☐ |
| 7 | Config | ai.config, storage.config | ☐ |

### Frontend Screens

| # | Screen | Mã | Trạng thái |
|---|--------|----|-----------|
| 1 | Học bài (Child) | S-10 | ☐ |
| 2 | Làm Quiz (Child) | S-11 | ☐ |
| 3 | Expert — Soạn nội dung | S-15 | ☐ |
| 4 | Admin — Kiểm duyệt nội dung | S-18 | ☐ |
| 5 | Tạo/Quản lý nhiệm vụ (Parent) | S-04 | ☐ |
| 6 | Chi tiết nhiệm vụ & Nộp bằng chứng (Child) | S-12 | ☐ |
| 7 | Hàng đợi phê duyệt (Parent) | S-05 | ☐ |

### Frontend Components

| # | Component | Trạng thái |
|---|-----------|-----------|
| 1 | LessonCard, LessonLibrary, LessonDetail, LessonEditor | ☐ |
| 2 | RichTextEditor, MediaUpload, MediaViewer | ☐ |
| 3 | AgeRangeSelector, ContentStatusBadge, ContentList | ☐ |
| 4 | QuizEditor, QuestionEditor, QuizPlayer, QuestionCard | ☐ |
| 5 | OptionSelector, QuizResult, ScoreDisplay, SubmitQuizButton | ☐ |
| 6 | MissionCard, MissionList, MissionForm, MissionDetail | ☐ |
| 7 | MissionStatusBadge, ChildSelector, DatePicker, RecurrenceSelector | ☐ |
| 8 | ChecklistEditor, ChecklistView | ☐ |
| 9 | EvidenceUpload, CameraCapture | ☐ |
| 10 | SubmissionQueue, SubmissionCard, MediaPreview | ☐ |
| 11 | AIConfidenceBadge, ApproveButton, RejectButton, RejectReasonInput | ☐ |
| 12 | ModerationQueue, ContentPreview, ModerationActions | ☐ |
| 13 | ProgressBar, CompletionButton, SubmitButton | ☐ |

### Git Branch

```
feature/education-mission-submission
  ├── feature/lesson-cms
  ├── feature/quiz
  ├── feature/mission
  └── feature/submission-ai
```

### Task Summary

| # | Task | Ưu tiên |
|---|------|---------|
| 1 | Implement Lesson + Quiz + Question + Mission + Checklist + Submission + AILog models | 🔴 Cao |
| 2 | Implement Lesson module (CRUD, submit for review, moderate) | 🔴 Cao |
| 3 | Implement Skill integration (use from Dev 1) | 🟡 Trung bình |
| 4 | Implement Quiz module (CRUD quiz + questions, submit quiz, auto-grading) | 🔴 Cao |
| 5 | Implement Mission module (CRUD, assign, checklist, recurrence, overdue) | 🔴 Cao |
| 6 | Implement Submission module (submit evidence, upload to cloud, AI call, review) | 🔴 Cao |
| 7 | Implement Cloud Storage util (upload, signed URL) | 🔴 Cao |
| 8 | Implement AI Service util (analyze evidence, parse response) | 🔴 Cao |
| 9 | Implement Scheduler util (overdue check, recurring missions) | 🟡 Trung bình |
| 10 | Cross-module: gọi walletService.addPoints khi approve submission / pass quiz | 🔴 Cao |
| 11 | Cross-module: gọi notificationService.create cho triggers | 🟡 Trung bình |
| 12 | Implement Frontend Lesson screens (Library, Detail, Editor) | 🔴 Cao |
| 13 | Implement Frontend Quiz screens (Player, Result) | 🔴 Cao |
| 14 | Implement Frontend Mission screens (List, Form, Detail) | 🔴 Cao |
| 15 | Implement Frontend Submission screens (Upload, Queue, Review) | 🔴 Cao |
| 16 | Implement Frontend Admin Content Moderation | 🟡 Trung bình |
| 17 | Implement Frontend Expert Content Management | 🟡 Trung bình |

---

## Developer 3 — Wallet + Pet + Reward + Payment + Reporting

### Database Models

| # | Model | Trạng thái |
|---|-------|-----------|
| 1 | Wallet | ☐ |
| 2 | Pet | ☐ |
| 3 | Reward | ☐ |
| 4 | Certificate | ☐ |
| 5 | Subscription | ☐ |
| 6 | Transaction | ☐ |

### Backend API

| # | API | Trạng thái |
|---|-----|-----------|
| 1 | GET /children/{id}/wallet | ☐ |
| 2 | GET /children/{id}/pet | ☐ |
| 3 | POST /children/{id}/pet/feed | ☐ |
| 4 | POST /rewards | ☐ |
| 5 | GET /rewards | ☐ |
| 6 | PUT /rewards/{id} | ☐ |
| 7 | DELETE /rewards/{id} | ☐ |
| 8 | POST /rewards/{id}/redeem | ☐ |
| 9 | GET /rewards/redemptions | ☐ |
| 10 | PATCH /rewards/redemptions/{id}/approve | ☐ |
| 11 | GET /plans | ☐ |
| 12 | POST /subscriptions | ☐ |
| 13 | GET /subscriptions/me | ☐ |
| 14 | PATCH /subscriptions/me/cancel | ☐ |
| 15 | POST /payments/webhook | ☐ |
| 16 | GET /transactions | ☐ |
| 17 | GET /reports/child/{id} | ☐ |
| 18 | GET /reports/admin/overview | ☐ |
| 19 | GET /reports/expert/content | ☐ |

### Backend Modules

| # | Module | File | Trạng thái |
|---|--------|------|-----------|
| 1 | Routes | walletRoutes, petRoutes, rewardRoutes, paymentRoutes, reportRoutes | ☐ |
| 2 | Controllers | walletController, petController, rewardController, paymentController, reportController | ☐ |
| 3 | Services | walletService, petService, rewardService, paymentService, reportService | ☐ |
| 4 | Middlewares | webhookMiddleware | ☐ |
| 5 | Validators | petValidator, rewardValidator, paymentValidator, reportValidator | ☐ |
| 6 | Utils | paymentGateway.js | ☐ |
| 7 | Config | payment.config, pet.config | ☐ |

### Frontend Screens

| # | Screen | Mã | Trạng thái |
|---|--------|----|-----------|
| 1 | Trang chủ Trẻ em | S-09 | ☐ |
| 2 | Ví điểm & Đổi thưởng | S-13 | ☐ |
| 3 | Thú cưng ảo | S-14 | ☐ |
| 4 | Quản lý phần thưởng & ví (Parent) | S-06 | ☐ |
| 5 | Dashboard Phụ huynh | S-02 | ☐ |
| 6 | Báo cáo tiến độ con | S-07 | ☐ |
| 7 | Expert — Thống kê | S-16 | ☐ |
| 8 | Gói Premium & Thanh toán | S-08 | ☐ |
| 9 | Admin — Báo cáo & cấu hình | S-19 | ☐ |

### Frontend Components

| # | Component | Trạng thái |
|---|-----------|-----------|
| 1 | WalletBalance, PointHistory | ☐ |
| 2 | PetDisplay, PetAnimation, FeedButton, PetStatusBar | ☐ |
| 3 | LevelIndicator, MoodIndicator, PetWidget | ☐ |
| 4 | PointsBar, LevelBadge, TodayMissionsWidget, BadgeShowcase, LessonButton | ☐ |
| 5 | RewardCard, RewardList, RewardForm, RedeemButton, ConfirmRedeemDialog | ☐ |
| 6 | RedemptionQueue, ApproveRedemptionButton, WalletOverview | ☐ |
| 7 | PlanList, PlanCard, CheckoutForm, SubscriptionStatus | ☐ |
| 8 | TransactionHistory, CancelSubscriptionButton | ☐ |
| 9 | ChildSummaryCard, PendingSubmissionsBadge, NotificationPreview, QuickActions | ☐ |
| 10 | ChildSelector (report), DateRangeFilter, StatsCard | ☐ |
| 11 | SkillProgressChart, MissionHistoryTable | ☐ |
| 12 | OverviewStats, UserGrowthChart, RevenueChart, ContentStatsChart | ☐ |
| 13 | ContentStatsTable, ViewsChart, QuizAttemptsChart | ☐ |
| 14 | SystemConfig, PlanManager | ☐ |

### Git Branch

```
feature/wallet-reward-payment-report
  ├── feature/wallet-pet
  ├── feature/reward
  ├── feature/payment
  └── feature/reporting-dashboard
```

### Task Summary

| # | Task | Ưu tiên |
|---|------|---------|
| 1 | Implement Wallet + Pet + Reward + Certificate + Subscription + Transaction models | 🔴 Cao |
| 2 | Implement Wallet module (get wallet, addPoints, deductPoints, history) | 🔴 Cao |
| 3 | Implement Pet module (get, feed, mood update, level up) | 🟡 Trung bình |
| 4 | Implement Reward module (CRUD, redeem, approve redemption) | 🔴 Cao |
| 5 | Implement Certificate module (auto-issue on milestones) | 🟢 Thấp |
| 6 | Implement Payment module (plans, subscriptions, webhook, transactions) | 🔴 Cao |
| 7 | Implement Payment Gateway util (checkout session, signature verify) | 🔴 Cao |
| 8 | Implement Webhook middleware (verify signature) | 🔴 Cao |
| 9 | Implement Reporting module (child report, admin overview, expert stats) | 🟡 Trung bình |
| 10 | Cross-module: export walletService interface cho Dev 2 gọi | 🔴 Cao |
| 11 | Cross-module: gọi notificationService.create cho triggers | 🟡 Trung bình |
| 12 | Implement Frontend Child Home screen (S-09) | 🔴 Cao |
| 13 | Implement Frontend Wallet & Redeem screen (S-13) | 🔴 Cao |
| 14 | Implement Frontend Pet screen (S-14) | 🟡 Trung bình |
| 15 | Implement Frontend Reward Management screen (S-06) | 🔴 Cao |
| 16 | Implement Frontend Parent Dashboard (S-02) | 🔴 Cao |
| 17 | Implement Frontend Child Report screen (S-07) | 🟡 Trung bình |
| 18 | Implement Frontend Premium & Payment screen (S-08) | 🔴 Cao |
| 19 | Implement Frontend Admin Report & Config screen (S-19) | 🟡 Trung bình |
| 20 | Implement Frontend Expert Stats screen (S-16) | 🟢 Thấp |
| 21 | Implement Charts components (Skill Progress, Revenue, Growth, etc.) | 🟡 Trung bình |

---

## Bảng tổng hợp khối lượng công việc

| Hạng mục | Developer 1 | Developer 2 | Developer 3 |
|----------|:-----------:|:-----------:|:-----------:|
| **Models** | 4 | 7 | 6 |
| **API Endpoints** | ~21 | ~25 | ~19 |
| **Backend Modules** | 5 (Auth, User, Child, Skill, Notification) | 4 (Lesson, Quiz, Mission, Submission) | 5 (Wallet, Pet, Reward, Payment, Report) |
| **📱 App Screens (RN)** | 3 (Login, Register, ChildProfile) + shared Auth | 5 (Lesson, Quiz, Mission, Submission, Approval) | 7 (Home, Wallet, Pet, Reward, Dashboard, Report, Payment) |
| **🖥️ Web Screens (React)** | 3 (Login, Register, Admin UserMgmt) + Notification | 2 (Expert Content, Admin Moderation) | 2 (Expert Stats, Admin Report & Config) |
| **Components (riêng)** | ~33 (bao gồm shared App + Web) | ~41 | ~44 |
| **Mức độ phức tạp** | Trung bình (shared cả 2 platform, Auth phức tạp) | Cao (luồng chính, AI integration, camera upload) | Cao (Payment, Pet animation, charts) |
| **Platform chính** | 📱🖥️ Cả hai (Auth shared + Admin web) | 📱 App chính + 🖥️ Expert/Admin web | 📱 App chính + 🖥️ Expert/Admin web |
| **Git Branches** | feature/auth-user-notification | feature/education-mission-submission | feature/wallet-reward-payment-report |
| **Ưu tiên bắt đầu** | 🥇 Đầu tiên (nền tảng) | 🥈 Sau khi Auth+User xong | 🥈 Sau khi Auth+User xong |

### Phân bổ Platform theo Developer

| Developer | React Native (App) | ReactJS (Web) | Backend |
|-----------|:------------------:|:-------------:|:-------:|
| **Dev 1** | Auth screens (Parent/Child), ChildProfile, Notification | Auth screens (Admin/Expert), Admin User Management, Notification | Auth, User, Child, Skill, Notification |
| **Dev 2** | Lesson, Quiz, Mission Detail, Submission Upload (Camera) | Expert Content Editor, Admin Content Moderation | Lesson, Quiz, Mission, Submission |
| **Dev 3** | Child Home, Wallet, Pet, Reward (Child/Parent), Dashboard, Report, Payment | Expert Stats, Admin Report & Config | Wallet, Pet, Reward, Payment, Report |

> **Lưu ý quan trọng:** Mỗi Developer làm **Full Stack** cho module của mình: Backend API + App Screen (React Native) + Web Screen (ReactJS). Điều này giảm thiểu giao tiếp cross-team và cho phép mỗi người kiểm soát end-to-end module mình phụ trách.

---

*— Hết tài liệu phân tích dự án KidLife — Góc nhìn Developer —*
