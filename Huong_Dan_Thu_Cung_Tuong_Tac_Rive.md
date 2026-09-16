# 🐲 HƯỚNG DẪN THIẾT KẾ & LẬP TRÌNH THÚ CƯNG TƯƠNG TÁC (INTERACTIVE PET MASCOT)
## (Giải Pháp Nâng Cấp Thú Cưng Tương Tác Sống Động Với Công Nghệ Rive)

Tài liệu này hướng dẫn chi tiết giải pháp biến Thú Cưng (Rồng Con) từ icon tĩnh thành một **Mascot hoạt hình tương tác sống động 2D (Interactive Gamification Mascot)**, cho phép trẻ em bấm/chọc, cho ăn, mặc phụ kiện và theo dõi biểu cảm vui/buồn/tiến hóa theo thời gian thực.

---

## 🎨 1. TỔNG QUAN & LỰA CHỌN CÔNG NGHỆ ĐỒ HỌA

### Why Rive (Rive.app)?
Để thú cưng phản ứng mượt mà trên nền tảng Web App (React) mà không làm chậm thiết bị, công nghệ **Rive (Rive.app)** là lựa chọn số 1 hiện nay:

- **Siêu nhẹ & Sắc nét:** File hoạt họa vector cực nhỏ (vài trăm KB), hiển thị nét căng trên mọi màn hình.
- **Hỗ trợ State Machine (Bộ chuyển trạng thái):** Cho phép gắn xương (Skeletal Animation) và thiết lập các phản ứng thông minh dựa trên hành động của bé.
- **Tích hợp React mượt mà:** Nhúng thư viện `@rive-app/react-canvas` chỉ bằng vài dòng lệnh.

---

## 🎭 2. DANH SÁCH CÁC TRẠNG THÁI PHẢN ỨNG (STATE MACHINE ANIMATIONS)

Animator/Designer sẽ tạo sẵn các bộ trạng thái hoạt hình (States) trong Rive để thú cưng phản ứng sinh động:

| Trạng Thái (State) | Hành Vi Phản Ứng Của Thú Cưng | Kích Hoạt Khi Nào? (Trigger Event) |
|---|---|---|
| **`Idle` (Bình thường)** | Đứng đung đưa thân người, chớp mắt nhẹ nhàng, thỉnh thoảng ngáp ngắn hoặc vẫy đuôi. | Trạng thái mặc định khi bé lướt xem màn hình. |
| **`OnTap` (Chạm/Chọc)** | Nhảy nảy lên vui vẻ, xoay người hoặc nghiêng đầu cười hì hì. | Bé bấm/chạm ngón tay vào người Pet. |
| **`OnFeed` (Cho ăn)** | Há miệng nuốt trái cây/bánh, nhai nhồm nhàm, mắt nhắm lại thả tim `💖 Yum Yum!`. | Bé bấm nút "Cho Rồng Con Ăn" (tốn 10 XP). |
| **`OnSad` (Buồn bã)** | Gục đầu xuống, tai rủ xuống, rơm rớm nước mắt. | Khi bé đứt chuỗi Streak hoặc lười làm việc nhà 3 ngày. |
| **`OnEvolve` (Tiến hóa)** | Bùng nổ pháo hoa hào quang, hóa thân từ *Rồng con 🐉 $\rightarrow$ Rồng lửa 🐲 $\rightarrow$ Hỏa Long ⚡*. | Khi đạt mốc 7, 14, 30 ngày Streak liên tiếp. |
| **`OnEquip` (Trang phục)** | Đội Mũ party, đeo Kính râm, Vương miện khớp theo từng chuyển động xương của Pet. | Khi bé bấm mặc đồ trong Tủ đồ trang sức. |

---

## 🛠️ 3. QUY TRÌNH 4 BƯỚC TRIỂN KHAI CHO ĐỘI NGŨ LẬP TRÌNH

### 🔹 Bước 1: Thiết Kế Mascot Trên Rive App (`.riv`)
1. Designer vẽ mô hình Rồng Con và gắn xương (Skeletal Rigging).
2. Tạo 4 mẫu hoạt hình cho 4 giai đoạn tiến hóa (*Trứng $\rightarrow$ Rồng con $\rightarrow$ Rồng lửa $\rightarrow$ Hỏa Long*).
3. Cấu hình State Machine đặt tên các Triggers: `tap`, `feed`, `isHappy`, `isSad`, `evolve`.
4. Xuất file binary siêu nhẹ `.riv` lưu vào thư mục `web/src/assets/rive/pet.riv`.

### 🔹 Bước 2: Tích Hợp Vào React Component (Frontend Integration)
1. Cài đặt thư viện: `npm install @rive-app/react-canvas`
2. Thay thế thẻ Icon tĩnh bằng Component `<RiveComponent />`.
3. Lắng nghe các sự kiện chuột/chạm (`onClick`, `onTouchStart`). Khi bé nhấp vào Pet $\rightarrow$ Gọi hàm trigger `tapInput.fire()` để Rồng nhảy nhót phản ứng ngay lập tức.

### 🔹 Bước 3: Thêm Bộ Hiệu Ứng Âm Thanh Tương Tác (Sound Effects - SFX)
Chuẩn bị các file âm thanh ngắn `.mp3` chất lượng cao trong `web/public/sounds/`:
- `pet_tap.mp3`: Tiếng kêu "Chít chít / Gầm nhẹ" vui nhộn khi chọc Pet.
- `pet_eat.mp3`: Tiếng "Nhai nhồm nhàm / Yum yum" khi cho ăn.
- `pet_evolve.mp3`: Tiếng nhạc chiến thắng "Tadaa!" vang dội khi tiến hóa.

### 🔹 Bước 4: Đồng Bộ CSDL Backend (Database State Syncing)
- **Database Table (`pets`):** Lưu trữ `stage`, `level`, `current_xp`, `streak_days`, `mood`, `equipped_accessories`.
- **API Endpoints (Do Dev 3 viết):**
  - `GET /api/pet`: Lấy chỉ số sinh tồn & trạng thái Pet.
  - `POST /api/pet/feed`: Trừ 10 XP ví bé, cộng mood vui vẻ, kích hoạt trigger `feed` trên Rive.
  - `POST /api/pet/accessories/equip`: Mặc phụ kiện cho Pet.

---

## 📋 4. HƯỚNG DẪN CHO DEV 3 TRIỂN KHAI TRONG BẢN PHÂN CÔNG

Khi Dev 3 làm **Chức năng 3.1 & 3.2 (Tiến Hóa & Tủ Đồ Thú Cưng)** trong file [`Phan_Cong_Work_3_Dev.md`](file:///d:/Kidlife/Phan_Cong_Work_3_Dev.md):
- Dùng thư viện `@rive-app/react-canvas` để nhúng Mascot.
- Kết nối các sự kiện chạm `onClick` trên màn [`ChildPetPage.tsx`](file:///d:/Kidlife/web/src/modules/child/pages/ChildPetPage.tsx) với State Machine Rive & Âm thanh SFX.
