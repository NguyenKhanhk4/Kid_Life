# BỘ 7 PROMPT — MODULE DEV 3 (mỗi mục 3.1 → 3.7 là 1 prompt độc lập)

> **Cách dùng:** Mỗi phần bên dưới được bọc trong `===== BẮT ĐẦU PROMPT =====` và `===== KẾT THÚC PROMPT =====`. Copy đúng phần nội dung ở giữa 2 mốc đó, dán làm 1 cuộc trò chuyện riêng với AI code (Claude Code, Cursor...). Không cần dán chung, vì mỗi prompt đã tự đầy đủ ngữ cảnh stack + quy tắc làm việc.

---

## PROMPT 3.1 — Tiến Hóa Thú Cưng & Chuỗi Streak 14 Ngày (Pet Evolution Engine)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"Pet Evolution Engine"** cho ứng dụng nuôi dạy con qua gamification, theo đúng tech stack và đặc tả dưới đây. Làm việc theo từng bước: (1) trình bày kế hoạch schema + API + component, chờ tôi xác nhận, (2) sau khi tôi OK mới viết code đầy đủ, có thể chạy được ngay, không để dở dang kiểu `// implement here`.

### Tech stack bắt buộc
- **Frontend (`web/`):** React 18 + TypeScript + Vite. Routing: React Router v7. State: Redux Toolkit (state cục bộ/global đơn giản) + React Query (data fetching/cache server). Style: Vanilla CSS dùng Design Tokens (biến CSS `--color-*`, `--space-*`... giả định đã có file `web/src/styles/tokens.css`, nếu cần token mới hãy liệt kê rõ tên và giá trị đề xuất). Animation: Framer Motion cho hiệu ứng UI (progress bar, nút bấm), **Rive** (thư viện `@rive-app/react-canvas`) để render nhân vật thú cưng 2D dạng `.riv` với State Machine.
- **Backend (`backend/`):** Node.js + Express.js + TypeScript, kiến trúc `routes → controller → service → model`, validate input bằng `zod`, xử lý lỗi qua middleware `errorHandler` tập trung (giả định đã tồn tại, chỉ cần `next(err)`).
- **DB:** MongoDB + Mongoose. Viết Schema kèm interface TypeScript tương ứng (`IPet extends Document`).
- **Auth:** Giả định có `authMiddleware` gắn `req.user = { childId, parentId, role }`. Chỉ dùng, không code lại.

### Đặc tả chức năng
**User flow:** Bé nuôi "Rồng Con" qua 4 giai đoạn: Trứng 🥚 (stage 1) → Rồng con 🐉 (stage 2) → Rồng lửa 🐲 (stage 3) → Rồng huyền thoại ⚡ (stage 4). App theo dõi streak 14 ngày liên tiếp hoạt động. Bé bấm nút **"Cho ăn 🍎"** (tốn 10 XP) để tăng mood vui vẻ và cộng dồn tiến độ tiến hóa.

**API cần code:**
- `GET /api/pet?childId=xxx` → trả về trạng thái pet hiện tại của bé (tạo mới pet mặc định stage 1 nếu bé chưa có).
- `POST /api/pet/feed` (body: `{ childId }`) → trừ 10 XP của bé (giả định có service `getChildXp`/`deductChildXp` ở module khác — nếu chưa rõ interface, hãy tự định nghĩa 1 interface `IXpService` rõ ràng và ghi chú giả định), tăng `mood`, cập nhật `last_fed_time`, chạy lại logic tính tiến hóa.

**Mongoose Schema `pets`:**
```ts
interface IPet extends Document {
  child_id: Types.ObjectId;
  name: string;
  stage: 1 | 2 | 3 | 4;
  level: number;
  current_xp: number;
  streak_days: number;
  mood: "sad" | "neutral" | "happy" | "excited";
  last_fed_time: Date | null;
  last_active_date: Date; // dùng để tính streak
}
```

**Logic bắt buộc phải code đúng:**
1. Hàm `calculateEvolution(pet)`: định nghĩa ngưỡng XP/level rõ ràng cho từng mốc chuyển stage (ví dụ stage 1→2 ở level 5, 2→3 ở level 15, 3→4 ở level 30 — bạn có thể đề xuất số cụ thể nhưng phải nêu rõ trong phần kế hoạch để tôi duyệt trước khi code).
2. Hàm `updateStreak(pet)`: so sánh `last_active_date` với ngày hiện tại — nếu cách nhau đúng 1 ngày thì `streak_days += 1`, nếu bằng ngày hôm nay thì giữ nguyên, nếu cách hơn 1 ngày thì reset `streak_days = 0`. Khi `streak_days` đạt 14 → có thể cộng thưởng XP bonus (nêu rõ số bonus đề xuất).
3. Validate: nếu XP của bé < 10 thì trả lỗi 400 rõ ràng (`"Không đủ XP để cho ăn"`), không cho trừ âm.
4. Toàn bộ logic tính toán phải nằm ở `pet.service.ts`, controller chỉ gọi service.

### Yêu cầu Frontend
- `ChildPetPage.tsx`: dùng React Query (`usePetQuery`, `useFeedPetMutation`) để lấy/feed pet.
- Render nhân vật rồng bằng component Rive (`<RiveComponent src="/animations/dragon.riv" stateMachines="PetSM" />`), điều khiển input State Machine tên `stage` (number) và trigger `feed` khi bấm nút cho ăn — nêu rõ giả định tên input/trigger để đội thiết kế Rive khớp theo.
- Thanh XP: progress bar animate bằng Framer Motion (`animate` prop trên width/scaleX) khi XP thay đổi.
- Nút "Cho ăn 🍎": dùng `motion.button` với hiệu ứng `whileTap={{ scale: 0.9 }}`, disable khi đang gọi API hoặc không đủ XP, hiển thị toast lỗi nếu API trả lỗi.
- Hiển thị streak counter (ví dụ "🔥 7/14 ngày") với hiệu ứng nhấn mạnh khi đạt mốc 14.
- Style bằng CSS module hoặc file `.css` riêng dùng biến từ `tokens.css`, không dùng Tailwind/CSS-in-JS.

### Checklist bàn giao (bắt buộc liệt kê lại khi xong)
- [ ] Viết API Pet status & Logic tính toán tiến hóa theo Streak.
- [ ] Nối giao diện Rồng Con (Rive), thanh XP tiến hóa & Nút cho ăn.

### Quy tắc chung khi làm việc với tôi
1. Nếu phần nào phụ thuộc module khác chưa có (XP/Sao của bé), hãy định nghĩa rõ interface giả định thay vì tự bịa toàn bộ hệ thống đó.
2. Không giả lập kết quả AI/animation như thể đã tích hợp thật nếu chưa có asset `.riv` — dùng ảnh/CSS animation tạm thay thế và ghi TODO thay thế bằng Rive khi có file thật.
3. Bắt đầu bằng việc trình bày kế hoạch (ngưỡng tiến hóa, cấu trúc file) để tôi duyệt trước khi code.

===== KẾT THÚC PROMPT =====

---

## PROMPT 3.2 — Tủ Đồ Trang Điểm Thú Cưng (Pet Wardrobe & Accessories Shop)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"Pet Wardrobe & Accessories Shop"**, theo đúng tech stack và đặc tả dưới đây. Trình bày kế hoạch trước, chờ tôi xác nhận rồi mới code đầy đủ.

### Tech stack bắt buộc
- **Frontend:** React 18 + TypeScript + Vite, React Router v7, Redux Toolkit (dùng 1 slice `petWardrobeSlice` lưu accessory đang preview tạm thời trước khi lưu — vì đây là state UI tạm thời, chưa cần gọi API ngay), React Query cho fetch/mutate dữ liệu server, Vanilla CSS + Design Tokens, Framer Motion cho hiệu ứng mở tủ đồ/chọn item, **Rive** để layer phụ kiện lên nhân vật rồng (dùng thêm input State Machine dạng `enum`/`number` cho từng slot: `hat`, `glasses`, `crown`, `cape`).
- **Backend:** Node.js + Express + TypeScript (routes → controller → service → model), validate bằng `zod`.
- **DB:** MongoDB + Mongoose.
- **Auth:** dùng `authMiddleware` có sẵn, không code lại.

### Đặc tả chức năng
**User flow:** Bé dùng XP đổi các phụ kiện (Mũ party, Kính râm, Vương miện, Áo choàng) → bấm **"Mặc thử"** để xem thử lên Rồng Con → xác nhận mặc chính thức.

**API cần code:**
- `GET /api/pet/accessories?childId=xxx` → trả về toàn bộ phụ kiện (`pet_accessories`) kèm cờ `is_owned`, `is_equipped` (join với `child_pet_accessories` của bé).
- `POST /api/pet/accessories/buy` (body: `{ childId, accessoryId }`) → kiểm tra đủ XP, kiểm tra chưa sở hữu, trừ XP (dùng interface `IXpService.deductChildXp` giả định như ở module Pet Evolution — nêu rõ nếu bạn định nghĩa lại), tạo bản ghi `child_pet_accessories`.
- `POST /api/pet/accessories/equip` (body: `{ childId, accessoryId }`) → set `is_equipped = true` cho accessory này, đồng thời set `false` cho MỌI accessory khác **cùng category** mà bé sở hữu (transaction hoặc `bulkWrite` để đảm bảo tính nhất quán).

**Mongoose Schema:**
```ts
// pet_accessories
interface IPetAccessory extends Document {
  name: string;
  icon: string; // URL hoặc tên artboard Rive
  cost_xp: number;
  category: "hat" | "glasses" | "crown" | "cape";
}

// child_pet_accessories
interface IChildPetAccessory extends Document {
  child_id: Types.ObjectId;
  accessory_id: Types.ObjectId;
  is_equipped: boolean;
}
```
Thêm compound index `{ child_id: 1, accessory_id: 1 }` unique để tránh mua trùng.

**Logic bắt buộc:**
1. Chặn mua trùng accessory đã sở hữu (trả lỗi 409).
2. Chặn mua nếu XP không đủ (400).
3. `equip` phải đảm bảo invariant: tại một thời điểm, mỗi `category` chỉ có tối đa 1 accessory `is_equipped = true` cho mỗi bé — viết bằng `Model.updateMany` để unequip các accessory cùng category trước, rồi mới equip cái mới, bọc trong Mongoose transaction nếu có replica set, nếu không thì nêu rõ giới hạn.

### Yêu cầu Frontend
- Component tủ đồ (drawer/modal) trong `ChildPetPage.tsx`: dùng Framer Motion `AnimatePresence` để mở/đóng tủ đồ dạng slide-in.
- Grid phụ kiện chia theo `category` (tab hoặc section), mỗi item hiển thị icon, giá XP, trạng thái (đã sở hữu/khóa/đang mặc).
- Khi bấm "Mặc thử": cập nhật `petWardrobeSlice` (Redux) để preview ngay lập tức trên Rive (set input State Machine tương ứng) **trước khi** gọi API `equip`, để trải nghiệm mượt; khi bé xác nhận mới gọi `useEquipAccessoryMutation` (React Query), nếu lỗi thì rollback preview.
- Dùng React Query cho `useAccessoriesQuery`, `useBuyAccessoryMutation`, `useEquipAccessoryMutation`, đảm bảo `invalidateQueries` đúng key sau khi mua/mặc.
- Style bằng CSS thuần + Design Tokens, không dùng thư viện UI ngoài.

### Checklist bàn giao
- [ ] Viết API mua & mặc phụ kiện Pet (đảm bảo invariant mỗi category chỉ 1 accessory equipped).
- [ ] Nối Tủ đồ & Nút bấm mặc phụ kiện lên Avatar Pet (Rive).

### Quy tắc chung
1. Nếu chưa có interface XP service thật, định nghĩa rõ interface giả định, không tự bịa toàn bộ hệ thống XP.
2. Trình bày kế hoạch schema + luồng equip/unequip trước khi code.
3. Code phải chạy được ngay, có xử lý lỗi rõ ràng ở từng endpoint.

===== KẾT THÚC PROMPT =====

---

## PROMPT 3.3 — Báo Cáo Phân Tích Kỹ Năng AI (AI Skill Analytics Radar Chart)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"AI Skill Analytics Radar Chart"** cho phụ huynh, theo tech stack và đặc tả dưới đây. Trình bày kế hoạch trước, chờ xác nhận rồi mới code.

### Tech stack bắt buộc
- **Frontend:** React 18 + TypeScript + Vite, React Router v7, React Query cho fetch data, Redux Toolkit không bắt buộc cho module này (ưu tiên React Query vì đây thuần là server state), Vanilla CSS + Design Tokens, Framer Motion cho hiệu ứng vẽ radar chart (animate từ tâm ra ngoài) và khung lời khuyên AI (fade-in). **Không dùng Rive** ở module này.
- **Backend:** Node.js + Express + TypeScript, validate bằng `zod`.
- **DB:** MongoDB + Mongoose.
- **Auth:** dùng `authMiddleware` có sẵn.

### Đặc tả chức năng
**User flow:** Phụ huynh xem Radar Chart 4 chỉ số (**Tự lập, Sức khỏe, Trí tuệ, Tình cảm**), so sánh tăng/giảm % so với kỳ trước. Đọc khung Lời khuyên AI → bấm **"Áp dụng gợi ý nhiệm vụ AI"** để tự động phát hành task rèn luyện cho bé.

**API cần code:**
- `GET /api/reports/ai-skill?childId=xxx` → trả về report kỳ hiện tại (`month_period` hiện tại) kèm report kỳ trước liền kề để frontend tự tính % thay đổi (hoặc backend tính sẵn field `delta_percent` cho từng chỉ số — chọn cách backend tính sẵn để tránh sai lệch logic 2 nơi).
- `POST /api/reports/apply-ai-task` (body: `{ childId, reportId }`) → đọc `suggested_task_json` của report, gọi sang service Task (giả định `ITaskService.createTask(childId, taskPayload)`, nêu rõ interface giả định) để phát hành nhiệm vụ mới cho bé.

**Mongoose Schema `ai_skill_reports`:**
```ts
interface IAiSkillReport extends Document {
  child_id: Types.ObjectId;
  month_period: string; // "2026-09"
  tu_lap_score: number;    // 0-100
  suc_khoe_score: number;
  tri_tue_score: number;
  tinh_cam_score: number;
  ai_recommendation_text: string;
  suggested_task_json: {
    title: string;
    description: string;
    reward_xp: number;
    category: string;
  };
  created_at: Date;
}
```
Index `{ child_id: 1, month_period: -1 }`.

**Logic bắt buộc:**
1. Viết hàm `generateAiSkillReport(childId, monthPeriod)` trong service — đây là nơi lẽ ra gọi AI thật để tính điểm/lời khuyên. Vì tôi **chưa cung cấp** API key/service AI cụ thể, hãy: (a) định nghĩa rõ interface input/output của hàm, (b) bên trong hiện tại có thể tính điểm tạm bằng công thức đơn giản dựa trên dữ liệu hoạt động của bé (nêu rõ công thức giả định, ví dụ dựa trên số task hoàn thành theo từng category), (c) đánh dấu rõ `// TODO: thay bằng gọi LLM/AI service thật để sinh ai_recommendation_text và suggested_task_json`. **Không tự ý giả vờ đã tích hợp AI thật.**
2. Hàm tính `delta_percent` cho từng chỉ số: `(current - previous) / previous * 100`, xử lý an toàn khi `previous = 0` hoặc không có report kỳ trước (trả `null`, không chia cho 0).
3. `apply-ai-task`: kiểm tra report tồn tại và thuộc đúng `childId`, tránh áp dụng trùng task (có thể thêm field `is_task_applied: boolean` vào schema report để chặn bấm áp dụng nhiều lần).

### Yêu cầu Frontend
- `ParentAiAnalyticsPage.tsx`: dùng React Query `useAiSkillReportQuery(childId)`.
- Vẽ **Radar Chart bằng SVG thuần** (tự viết component `<RadarChart />` nhận props `axes: {label, value}[]`, không dùng thư viện chart ngoài vì stack chỉ có Vanilla CSS) — tính toán polygon điểm bằng lượng giác (`Math.cos/sin` theo góc chia đều cho 4 trục), animate polygon bằng Framer Motion (`motion.polygon` với `initial`/`animate` trên thuộc tính `points` hoặc dùng `pathLength`).
- Hiển thị % thay đổi từng chỉ số cạnh tên trục (mũi tên lên/xuống màu xanh/đỏ theo token màu).
- Khung lời khuyên AI: `motion.div` fade-in, nút "Áp dụng gợi ý nhiệm vụ AI" gọi `useApplyAiTaskMutation`, disable + đổi label thành "Đã áp dụng ✓" sau khi thành công.

### Checklist bàn giao
- [ ] Viết API tính toán chỉ số Radar Chart & Lời khuyên AI (kèm TODO tích hợp AI thật rõ ràng).
- [ ] Nối SVG Radar Chart (tự vẽ, có animation) & Nút áp dụng nhiệm vụ gợi ý AI.

### Quy tắc chung
1. Không tự bịa ra là đã gọi AI thật nếu chưa có service — luôn để TODO rõ ràng kèm công thức tạm thời hợp lý.
2. Định nghĩa rõ interface `ITaskService` giả định nếu module Task chưa có sẵn cho bạn xem.
3. Trình bày kế hoạch (công thức tính điểm tạm, cấu trúc RadarChart) trước khi code.

===== KẾT THÚC PROMPT =====

---

## PROMPT 3.4 — AI Voice Studio & Quản Lý Kể Chuyện (Voice Clone Studio & Curated Search)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"Voice Clone Studio & Curated Story Search"** cho phụ huynh, theo tech stack và đặc tả dưới đây. Trình bày kế hoạch trước, chờ xác nhận rồi mới code.

### Tech stack bắt buộc
- **Frontend:** React 18 + TypeScript + Vite, React Router v7, React Query cho fetch/mutation + polling trạng thái xử lý voice clone, Redux Toolkit không bắt buộc (có thể dùng local state/`useState` cho quy trình ghi âm vì đây là state UI tạm thời trong 1 page), Vanilla CSS + Design Tokens, Framer Motion cho hiệu ứng ghi âm (pulse animation khi đang record) và trạng thái xử lý (spinner/progress). **Không dùng Rive** ở module này.
- **Backend:** Node.js + Express + TypeScript, dùng `multer` để nhận file upload audio, validate bằng `zod` cho các field không phải file.
- **DB:** MongoDB + Mongoose. Với `curated_stories`, tạo text index trên `title`/`category`/`moral_lesson` để hỗ trợ tìm kiếm.
- **Auth:** dùng `authMiddleware` có sẵn.

### Đặc tả chức năng
**User flow:** Phụ huynh thu âm 1 phút giọng đọc → hệ thống AI xử lý nhân bản giọng (Voice Clone Mẹ/Bố). Phụ huynh tìm kiếm truyện cổ tích có sẵn → bấm **"+ Thêm vào thư viện bé"**.

**API cần code:**
- `POST /api/voice/clone` (multipart/form-data: file audio + `voice_name`, `parent_id`) → dùng `multer` nhận file, lưu tạm vào `/uploads/voice-raw/` (hoặc mock S3 URL — nêu rõ TODO thay bằng storage thật), tạo bản ghi `voice_profiles` với `status: "processing"`, sau đó gọi hàm `processVoiceCloning(filePath)` — vì **chưa có** API voice-clone thật, hãy viết hàm này dạng interface rõ ràng, hiện tại có thể mock trả về `voice_model_id` giả sau một khoảng delay giả lập (`setTimeout`/queue đơn giản), rồi update `status: "ready"`. Đánh dấu rõ `// TODO: tích hợp voice-clone AI service thật`.
- `GET /api/stories/curated?keyword=xxx&category=yyy` → tìm kiếm bằng MongoDB text search hoặc regex, phân trang (`page`, `limit`).
- `POST /api/stories/curated/add-to-child` (body: `{ childId, curatedStoryId }`) → thêm truyện vào thư viện riêng của bé (tạo bảng liên kết `child_story_library` nếu chưa có trong đặc tả gốc — bạn tự thêm collection này vì cần thiết để module 3.5 đọc thư viện của bé, nêu rõ lý do thêm).

**Mongoose Schema:**
```ts
// voice_profiles
interface IVoiceProfile extends Document {
  parent_id: Types.ObjectId;
  voice_name: string;
  voice_model_id: string | null;
  status: "processing" | "ready" | "failed";
  source_audio_url: string;
}

// curated_stories
interface ICuratedStory extends Document {
  title: string;
  category: string;
  moral_lesson: string;
  duration: number; // giây
  text_content: string;
}

// child_story_library (mới thêm, cần thiết cho module 3.5)
interface IChildStoryLibrary extends Document {
  child_id: Types.ObjectId;
  curated_story_id: Types.ObjectId;
  added_at: Date;
}
```

**Logic bắt buộc:**
1. Validate file audio: giới hạn dung lượng (ví dụ 15MB), định dạng cho phép (`.mp3`, `.wav`, `.m4a`).
2. Không cho thêm trùng truyện vào thư viện bé (unique compound index `child_id + curated_story_id`).
3. Endpoint tìm kiếm phải hoạt động tốt kể cả khi không có `keyword` (trả toàn bộ theo `category` hoặc mới nhất).

### Yêu cầu Frontend
- `ParentStoryStudioPage.tsx`, chia 2 khu vực: **Studio thu âm** và **Tìm kiếm truyện**.
- Khu thu âm: dùng `MediaRecorder` API (viết custom hook `useAudioRecorder()` trả về `isRecording, startRecording, stopRecording, audioBlob, durationSec`), giới hạn ghi tối đa ~60 giây, hiển thị đồng hồ đếm ngược, dùng Framer Motion cho hiệu ứng pulse quanh nút mic khi đang ghi. Sau khi ghi xong, upload bằng `useCloneVoiceMutation` (React Query, `FormData`), sau đó polling trạng thái bằng `useVoiceProfileStatusQuery` (interval refetch cho đến khi `status !== "processing"`).
- Khu tìm kiếm: input search có debounce (300ms), dùng `useCuratedStoriesQuery(keyword, category)`, danh sách kết quả dạng card, mỗi card có nút "+ Thêm vào thư viện bé" (chọn bé nếu phụ huynh có nhiều con — dropdown chọn `childId`), gọi `useAddToChildLibraryMutation`.
- Style bằng CSS thuần + Design Tokens.

### Checklist bàn giao
- [ ] Viết API thu âm Voice Clone (kèm TODO tích hợp AI thật) & Thư viện truyện (tìm kiếm + thêm vào thư viện bé).
- [ ] Nối Studio thu âm 1 phút giọng đọc Mẹ/Bố & Ô tìm kiếm truyện.

### Quy tắc chung
1. Không giả vờ đã tích hợp voice-clone AI thật — luôn mock rõ ràng kèm TODO.
2. Nếu cần thêm collection mới (`child_story_library`) để module hoạt động hợp lý, phải nêu rõ lý do trước khi thêm.
3. Trình bày kế hoạch trước khi code.

===== KẾT THÚC PROMPT =====

---

## PROMPT 3.5 — Góc Giờ Kể Chuyện Kỳ Diệu (Child Bedtime Stories Audio Player)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"Bedtime Stories Audio Player"** cho bé, theo tech stack và đặc tả dưới đây. Trình bày kế hoạch trước, chờ xác nhận rồi mới code.

### Tech stack bắt buộc
- **Frontend:** React 18 + TypeScript + Vite, React Router v7, Redux Toolkit dùng cho 1 slice `audioPlayerSlice` (lưu track đang phát, trạng thái play/pause, thời gian hiện tại — vì có thể cần mini-player hiển thị xuyên suốt nhiều trang), React Query cho fetch thư viện truyện, Vanilla CSS + Design Tokens, Framer Motion cho chuyển động chọn nhân vật giọng đọc và animation của audio player (sóng âm, nút play/pause). **Không dùng Rive** ở module này (trừ khi 8 nhân vật giọng đọc dùng chung file `.riv` avatar tĩnh — nếu vậy chỉ hiển thị artboard tương ứng, không cần state machine phức tạp).
- **Backend:** Node.js + Express + TypeScript, hỗ trợ HTTP Range Request khi stream audio (bắt buộc để tua bài được).
- **DB:** MongoDB + Mongoose, dùng lại collection `child_story_library` (đã tạo ở module 3.4) và `curated_stories`.
- **Auth:** dùng `authMiddleware` có sẵn.

### Đặc tả chức năng
**User flow:** Bé mở "Góc kể chuyện" → chọn 1 trong **8 nhân vật giọng đọc** (Giọng Mẹ, Giọng Bố, Phù thủy, Robot, Công chúa, Rồng con, Cú mèo, Gấu Bơ) → phát audio đọc truyện kèm nhạc nền BGM du dương.

**API cần code:**
- `GET /api/stories/child-library?childId=xxx` → join `child_story_library` với `curated_stories`, trả danh sách truyện bé đã có trong thư viện.
- `GET /api/stories/:id/audio?voiceId=xxx` → stream file audio tương ứng với `id` truyện + `voiceId` giọng đọc đã chọn. **Bắt buộc hỗ trợ HTTP Range Request** (header `Range`, trả `206 Partial Content` với `Content-Range`, `Accept-Ranges: bytes`) để trình duyệt tua được. Vì chưa có file audio thật cho từng giọng, định nghĩa rõ cấu trúc lưu file dự kiến (ví dụ `/uploads/stories/{storyId}/{voiceId}.mp3`) và nêu TODO nếu file chưa tồn tại thì trả lỗi 404 rõ ràng thay vì crash server.

**Định nghĩa 8 nhân vật giọng đọc (dùng chung, không cần bảng DB riêng, khai báo dạng constant trong code dùng chung FE-BE hoặc enum):**
```ts
type VoiceCharacterId =
  | "mother" | "father" | "witch" | "robot"
  | "princess" | "baby_dragon" | "owl" | "honey_bear";
```

**Logic bắt buộc:**
1. Validate `voiceId` nằm trong danh sách 8 giá trị hợp lệ ở trên, nếu không → 400.
2. Xử lý stream audio đúng chuẩn Range Request (tham khảo pattern `fs.createReadStream(path, { start, end })`).
3. Nếu truyện không có trong thư viện của bé (chưa được thêm ở module 3.4) → trả 403/404 rõ ràng, không cho stream.

### Yêu cầu Frontend
- `ChildStoriesPage.tsx`: dùng React Query `useChildLibraryQuery(childId)` để lấy danh sách truyện.
- Bộ chọn 8 nhân vật giọng đọc: grid avatar, dùng Framer Motion `layoutId` để hiệu ứng chọn (highlight nhân vật đang chọn di chuyển mượt giữa các item), lưu `selectedVoiceId` vào Redux `audioPlayerSlice`.
- Audio player custom (không dùng thẻ `<audio controls>` mặc định, tự build UI): nút play/pause, thanh tiến trình kéo tua (`<input type="range">` hoặc custom), hiển thị thời gian hiện tại/tổng, dùng `useRef<HTMLAudioElement>` để điều khiển phần tử `<audio>` ẩn, đồng bộ state vào `audioPlayerSlice` (currentTime, isPlaying, duration) qua các event `onTimeUpdate`, `onLoadedMetadata`.
- Nhạc nền BGM: phát song song 1 thẻ `<audio>` riêng loop nhạc nền âm lượng thấp hơn giọng đọc (có thể hard-code 1-2 file BGM mặc định, nêu rõ đường dẫn giả định).
- Style bằng CSS thuần + Design Tokens, animation sóng âm (waveform) có thể vẽ đơn giản bằng vài `div` với Framer Motion animate scale liên tục khi `isPlaying = true`.

### Checklist bàn giao
- [ ] Viết API Audio Stream đọc truyện theo Voice ID (hỗ trợ Range Request đầy đủ).
- [ ] Nối Bộ chọn 8 nhân vật giọng đọc & Trình phát Audio Player (custom UI, đồng bộ Redux).

### Quy tắc chung
1. Không bỏ qua việc hỗ trợ Range Request — đây là yêu cầu bắt buộc để trải nghiệm tua nhạc mượt.
2. Nếu file audio thật chưa tồn tại, xử lý lỗi rõ ràng thay vì giả vờ phát được.
3. Trình bày kế hoạch (cấu trúc thư mục audio, luồng đồng bộ Redux) trước khi code.

===== KẾT THÚC PROMPT =====

---

## PROMPT 3.6 — Nhật Ký Hành Trình & AI Video Recap (Memory Lane Premium)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"Memory Lane Premium"** cho phụ huynh, theo tech stack và đặc tả dưới đây. Trình bày kế hoạch trước, chờ xác nhận rồi mới code.

### Tech stack bắt buộc
- **Frontend:** React 18 + TypeScript + Vite, React Router v7, React Query cho fetch ảnh + polling trạng thái job (video recap), Redux Toolkit không bắt buộc, Vanilla CSS + Design Tokens, Framer Motion cho hiệu ứng timeline (stagger animation khi ảnh xuất hiện) và modal preview (`AnimatePresence`). **Không dùng Rive** ở module này.
- **Backend:** Node.js + Express + TypeScript. Vì tạo video và dàn trang PDF là tác vụ nặng, thiết kế theo **hướng xử lý bất đồng bộ (job queue)** — nếu project chưa có hệ thống queue (BullMQ/Redis), hãy mock bằng cơ chế job đơn giản trong Mongo (lưu `status: "pending"|"processing"|"done"|"failed"` và xử lý nền bằng `setTimeout`/`setImmediate`), đồng thời nêu rõ khuyến nghị nâng cấp lên BullMQ + Redis khi lên production.
- **DB:** MongoDB + Mongoose.
- **Auth:** dùng `authMiddleware` có sẵn.

### Đặc tả chức năng
**User flow:** Phụ huynh xem album ảnh việc nhà của con xếp theo dòng thời gian. Bấm **"Tạo Video Recap tháng"** (AI tự động dựng video ngắn ghép nhạc). Bấm **"Xuất Photobook PDF"** (dàn trang tự động 24 trang tạp chí kỷ niệm).

**API cần code:**
- `GET /api/memory-lane?childId=xxx&month=yyyy-mm` → trả ảnh (`memory_photos`) sort theo `date_taken`, group theo ngày/tuần để FE dễ render timeline.
- `POST /api/memory-lane/recap-video` (body: `{ childId, month }`) → tạo job async, trả về `{ jobId, status: "processing" }` ngay lập tức (không block). Viết hàm `generateRecapVideo(jobId)` chạy nền — vì **chưa có** service dựng video AI thật, mock bằng cách sau vài giây set `status: "done"` kèm 1 URL video mẫu, đánh dấu rõ `// TODO: tích hợp service dựng video AI thật (vd: FFmpeg pipeline hoặc API bên thứ 3)`.
- `GET /api/memory-lane/recap-video/:jobId/status` → check trạng thái job (cần thêm endpoint này dù không có trong đặc tả gốc, vì FE cần polling — nêu rõ lý do thêm).
- `GET /api/memory-lane/photobook-pdf?childId=xxx&month=yyyy-mm` → tương tự, tạo/lấy `photobooks` đã dàn trang. Vì **chưa có** thư viện dàn trang PDF thật, mock bằng `pdfkit` tạo 1 PDF đơn giản gồm ảnh + caption (24 trang có thể rút gọn số trang thật theo số ảnh có sẵn, đánh dấu rõ TODO nâng cấp layout tạp chí thật).

**Mongoose Schema:**
```ts
interface IMemoryPhoto extends Document {
  child_id: Types.ObjectId;
  image_url: string;
  caption: string;
  date_taken: Date;
  category: string;
  likes_count: number;
}

interface IPhotobook extends Document {
  child_id: Types.ObjectId;
  title: string;
  total_pages: number;
  pdf_download_url: string;
  status: "pending" | "processing" | "done" | "failed";
}

// Thêm mới để hỗ trợ job video async (cần thiết, nêu rõ lý do)
interface IRecapVideoJob extends Document {
  child_id: Types.ObjectId;
  month_period: string;
  status: "pending" | "processing" | "done" | "failed";
  video_url: string | null;
}
```

**Logic bắt buộc:**
1. Request tạo video/PDF phải trả response ngay (không block chờ xử lý xong) — đúng tinh thần bất đồng bộ.
2. Nếu bé không có ảnh nào trong tháng được chọn → trả lỗi rõ ràng, không tạo job rỗng.
3. Xử lý lỗi trong job nền (try/catch), set `status: "failed"` nếu lỗi, không để job treo mãi ở `"processing"`.

### Yêu cầu Frontend
- `ParentMemoryLanePage.tsx`: timeline dạng grid/scroll dọc, group theo ngày, ảnh xuất hiện với Framer Motion `staggerChildren` khi scroll vào view (dùng `whileInView`).
- Modal "Video Recap": bấm nút → gọi mutation tạo job → hiển thị trạng thái loading → polling status bằng React Query (`refetchInterval` tự tắt khi `status !== "processing"`) → khi xong hiển thị video preview trong modal (`AnimatePresence` cho hiệu ứng mở/đóng).
- Modal "Xem trước Photobook PDF": tương tự, hiển thị nút tải PDF khi có `pdf_download_url`.
- Style bằng CSS thuần + Design Tokens.

### Checklist bàn giao
- [ ] Viết API Album ảnh, Video Recap (job async có polling) & Dàn trang PDF Photobook (kèm TODO tích hợp AI/thư viện dàn trang thật).
- [ ] Nối Dòng thời gian ảnh, Modal Video Recap & Modal Xem trước Photobook PDF.

### Quy tắc chung
1. Không được code video/PDF generation theo kiểu đồng bộ chặn request — bắt buộc thiết kế bất đồng bộ.
2. Không giả vờ đã tích hợp AI dựng video thật — luôn mock rõ ràng kèm TODO.
3. Trình bày kế hoạch (cơ chế job, cấu trúc schema mới) trước khi code.

===== KẾT THÚC PROMPT =====

---

## PROMPT 3.7 — Cây Điều Ước Thần Kỳ & Thiệp Vinh Danh QR Code (Wish Tree & Viral Milestones)

===== BẮT ĐẦU PROMPT =====

Bạn là Senior Fullstack Engineer. Hãy xây dựng chức năng **"Wish Tree & Viral Milestone Card"**, theo tech stack và đặc tả dưới đây. Trình bày kế hoạch trước, chờ xác nhận rồi mới code.

### Tech stack bắt buộc
- **Frontend:** React 18 + TypeScript + Vite, React Router v7, React Query cho fetch/mutation, Redux Toolkit không bắt buộc (state ghi âm có thể dùng local state vì chỉ dùng trong 1 page), Vanilla CSS + Design Tokens, Framer Motion cho hiệu ứng giữ nút ghi âm (long-press: scale tăng dần theo thời gian giữ), hiệu ứng cây điều ước (lá/quả rung nhẹ), và modal chọn mẫu thiệp. **Không dùng Rive** cho module này (trừ khi cây điều ước dùng animation Rive trang trí — nếu vậy chỉ dùng làm background trang trí tĩnh, không có logic).
- **Backend:** Node.js + Express + TypeScript, dùng thư viện `qrcode` (npm) để sinh mã QR dạng data URL hoặc file ảnh.
- **DB:** MongoDB + Mongoose.
- **Auth:** dùng `authMiddleware` có sẵn.

### Đặc tả chức năng
**User flow:**
- *Điều ước:* Bé giữ nút **"Ghi âm giọng nói"** hoặc gõ chữ thủ thỉ ước mơ với ba mẹ (tốn 50 Sao) → gửi sang màn duyệt điều ước của phụ huynh.
- *Thiệp vinh danh:* Khi đạt huy hiệu mới, chọn 1 trong 3 mẫu thiệp (Hiệp sĩ, Công chúa, Phi hành gia) → render thiệp vinh danh kỹ thuật số có tên bé & **mã QR Code** để chia sẻ Zalo/Facebook.

**API cần code:**
- `POST /api/wishes` (body: `{ childId, wishText?, voiceAudioUrl? }`, ít nhất 1 trong 2 field bắt buộc) → kiểm tra đủ 50 Sao (dùng interface `IStarService.deductChildStars` giả định — nêu rõ giả định như các module trước), trừ sao, tạo bản ghi `status: "pending"`.
- `POST /api/wishes/:id/approve` (chỉ phụ huynh gọi được, kiểm tra `req.user.role === "parent"`) → cập nhật `status: "approved"` (hoặc `"rejected"` nếu có body `{ approve: false }`).
- `GET /api/milestones/card?milestoneId=xxx&template=knight|princess|astronaut` → sinh dữ liệu thiệp (tên bé, tên huy hiệu, ngày đạt được) + sinh QR code (dùng `qrcode.toDataURL(shareLink)`) trỏ tới `shareLink` dạng `https://app.example.com/milestone/:milestoneId` (domain giả định, nêu rõ cần thay khi có domain thật), lưu `qr_code_url` vào `milestones` nếu chưa có.

**Mongoose Schema:**
```ts
interface IChildWish extends Document {
  child_id: Types.ObjectId;
  wish_text: string | null;
  voice_audio_url: string | null;
  cost_stars: number;
  status: "pending" | "approved" | "rejected";
}

interface IMilestone extends Document {
  badge_id: Types.ObjectId;
  child_id: Types.ObjectId;
  unlocked_date: Date;
  qr_code_url: string | null;
  card_template: "knight" | "princess" | "astronaut" | null;
}
```

**Logic bắt buộc:**
1. `POST /api/wishes`: validate phải có `wishText` hoặc `voiceAudioUrl`, không được cả hai đều rỗng; kiểm tra đủ 50 sao trước khi trừ (nếu không đủ → 400 rõ ràng, không trừ âm).
2. `approve`: chỉ cho phép chuyển trạng thái từ `"pending"` → `"approved"/"rejected"`, chặn approve lại wish đã xử lý (409).
3. Sinh QR code: cache lại `qr_code_url` sau lần sinh đầu, lần gọi sau nếu đã có `card_template` giống yêu cầu thì trả lại luôn không sinh lại (tối ưu, tránh sinh QR trùng lặp không cần thiết trừ khi đổi template).

### Yêu cầu Frontend
- `ChildWishesPage.tsx`:
  - Nút ghi âm dạng long-press: dùng `onPointerDown`/`onPointerUp` kết hợp `MediaRecorder` (tái dùng hook `useAudioRecorder()` nếu đã viết ở module 3.4, hoặc viết lại tương tự), Framer Motion `motion.button` với `animate={{ scale: isHolding ? 1.3 : 1 }}` tăng dần theo thời gian giữ (có thể dùng `useAnimationControls` để scale mượt theo `setInterval`).
  - Có toggle chuyển sang nhập chữ (`<textarea>`) thay vì ghi âm.
  - Hiển thị cây điều ước: các điều ước đã gửi hiện dạng "quả" trên cây, màu sắc theo `status` (vàng = pending, xanh = approved, xám = rejected), dùng Framer Motion cho hiệu ứng rung nhẹ định kỳ (`animate` loop).
  - Validate đủ 50 sao ở FE trước khi cho bấm gửi (disable + tooltip nếu không đủ), nhưng **vẫn phải** để BE validate lại (không tin tưởng FE).
- `ViralMilestoneModal.tsx`:
  - Modal chọn 1/3 mẫu thiệp (card selector với Framer Motion hover/tap effect).
  - Sau khi chọn, gọi `useMilestoneCardQuery(milestoneId, template)`, render thiệp (canvas hoặc HTML/CSS layout theo từng template) kèm ảnh QR code trả về.
  - Nút chia sẻ Zalo/Facebook: dùng Web Share API (`navigator.share`) nếu trình duyệt hỗ trợ, fallback mở link chia sẻ Facebook (`https://www.facebook.com/sharer/sharer.php?u=...`) hoặc Zalo (`https://sp.zalo.me/share?u=...`) trong tab mới.

### Checklist bàn giao
- [ ] Viết API Ghi âm điều ước (trừ sao, validate) & Xuất thiệp vinh danh QR code (cache QR, 3 template).
- [ ] Nối Cây ước nguyện thần kỳ (long-press ghi âm + hiển thị cây) & Modal Thiệp Vinh Danh QR Code (chọn template + chia sẻ).

### Quy tắc chung
1. Không tin tưởng validate phía FE — luôn validate lại đủ sao và trạng thái ở BE.
2. Nếu chưa có interface `IStarService` thật, định nghĩa rõ giả định, không tự bịa toàn bộ hệ thống Sao.
3. Trình bày kế hoạch (luồng approve, cấu trúc 3 template thiệp) trước khi code.

===== KẾT THÚC PROMPT =====
