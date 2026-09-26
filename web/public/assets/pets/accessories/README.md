# Ảnh phụ kiện thú cưng

Mỗi loại 1 thư mục, tên file `<loại>-NN.png` (vd. `hat/hat-07.png`). Web tự đặt phụ kiện đúng chỗ
trên từng loài / từng stage — không cần căn tay trong ảnh.

| Thư mục     | Loại        | Vị trí trên pet                         | Vị trí đeo* |
|-------------|-------------|-----------------------------------------|-------------|
| `hat/`      | Mũ, bờm     | Trên đỉnh đầu                           | đầu         |
| `crown/`    | Vương miện  | Trên đỉnh đầu                           | đầu         |
| `halo/`     | Hào quang   | Lơ lửng trên đầu                        | đầu         |
| `bow/`      | Nơ          | Cài lệch 1 bên đầu                      | đầu         |
| `glasses/`  | Kính        | Ngang mắt, nghiêng theo đầu             | mặt         |
| `mask/`     | Mặt nạ      | Che mắt / cả mặt                        | mặt         |
| `necklace/` | Vòng cổ     | Dưới cằm                                | cổ          |
| `wings/`    | Cánh        | Sau lưng (vẽ phía sau pet)              | lưng        |

\* Mỗi vị trí đeo chỉ 1 món cùng lúc (đội vương miện thì mũ tự tháo).

## Thêm ảnh mới

1. Bỏ ảnh vào đúng thư mục (PNG, khuyến nghị 1024px trở lên).
2. Nếu ảnh có **nền ô caro vẽ sẵn** (hay gặp khi tải ảnh AI), chạy trong thư mục `web/`:
   `npm run pets:fix-accessories` → xoá nền caro + cắt sát món đồ. Ảnh gốc được sao lưu ở
   `assets-raw/pets/accessories/`, chạy lại bao nhiêu lần cũng được.
3. Kiểm tra vị trí trên mọi loài: `npm run pets:preview-accessories -- <thư mục ra> --items <loại>`
   → ảnh lưới gắn thử lên vài pet. Lệch thì chỉnh riêng ảnh đó ở
   `web/src/features/pet/view/accessory.tuning.json` (mục `items`, xem bên dưới).
4. Thêm vào cửa hàng: Admin → Dữ liệu hệ thống → Phụ kiện thú cưng, đường dẫn `/assets/pets/accessories/<loại>/<file>.png`
   (hoặc thêm tên vào `CATALOG` trong `backend/seed_pet.ts`).

## Chỉnh vị trí (`accessory.tuning.json`)

- `items["hat/hat-01.png"]` — chỉnh riêng 1 ảnh: `scale` (cỡ), `dxRel` / `dyRel` (dời theo bề rộng món đồ,
  dương = sang phải / xuống), `rotate` (độ). Dùng khi hình trong ảnh lệch tâm, vd. kính vẽ góc 3/4.
- `species["cat"]["3"]["hat"]` — chỉnh cho 1 loài/stage (`"*"` = mọi stage): `dx` / `dy` (% ảnh pet), `scale`, `rotate`.
- `anchors` — sửa điểm đo tự động sai (vd. đỉnh đầu bị tính tới đỉnh sừng).
- `eyes` — "mắt ảo" cho ảnh pet không vẽ mắt (quả trứng, mắt nhắm).

Thay ảnh pet thì chạy lại `npm run pets:anchors` để đo lại điểm neo.

## Ảnh chưa dùng được

`halo-05` … `halo-10` và `wings-05`: ảnh gốc vẽ hiệu ứng phát sáng / trong mờ đè lên nền caro nên không
tách sạch nền được (vẫn lộ caro). Cần bản PNG nền trong suốt thật; có rồi thì bỏ đè lên, chạy bước 2–4.
