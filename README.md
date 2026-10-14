# Lịch Việt PWA - Lịch Âm Dương Song Song

> Ứng dụng Lịch Âm Dương Việt Nam hiển thị 2 tháng song song trên màn hình dọc, vuốt mượt mà, hoạt động hoàn toàn offline và cài đặt được dưới dạng PWA trên Android và iOS.

🌐 **Trải nghiệm trực tiếp tại:** [https://trungnguyenthien.github.io/pwa-vn-calendar/](https://trungnguyenthien.github.io/pwa-vn-calendar/)

---

## ✨ Tính Năng Nổi Bật

### 1. Hiển thị 2 tháng trọn vẹn trên 1 màn hình dọc
- **Bố cục 2 tháng xếp dọc**: Tháng trên và tháng dưới hiển thị song song, vừa khít khung hình không cần cuộn trang (`height: 100dvh`).
- **Lưới 7 cột × 6 hàng**: Tỉ lệ ô tự động co giãn theo chiều cao thiết bị (`clamp()` responsive), tối ưu cho mọi kích thước màn hình điện thoại.
- **Header tương tác**: Hiển thị tháng/năm hiện tại (ví dụ: `Tháng 10 - 11 / 2026`), chạm vào để mở bộ chọn nhanh tháng/năm.

### 2. Âm lịch Việt Nam chuẩn xác & 100% Offline
- **Thuật toán thiên văn Hồ Ngọc Đức (UTC+7)**: Tự cài đặt bằng JavaScript thuần, không gọi API mạng, không phụ thuộc thư viện bên ngoài.
- **Phân biệt Lịch Việt và Lịch Trung Quốc**: Xử lý chính xác các năm có chênh lệch tiết khí do múi giờ.
- **Hiển thị trực quan**:
  - Số dương to ở giữa, số âm nhỏ bên dưới.
  - Ngày mùng 1 âm hiển thị dạng `1/M` (ví dụ `1/9`) để dễ nhận biết bắt đầu tháng âm mới. Tháng nhuận có thêm ký hiệu `nhuận` (ví dụ `1/2 nhuận`).
  - Tô màu nổi bật:
    - **Chủ nhật**: Đỏ cam (`#f43f5e`).
    - **Hôm nay**: Hiệu ứng gradient xanh dạ quang nổi bật.
    - **Mùng 1 & Rằm (15 âm)**: Đánh dấu tag màu riêng biệt (ngày lễ truyền thống).
- **Xem chi tiết ngày**: Chạm vào ngày bất kỳ để xem bảng thông tin đầy đủ về Thứ, Ngày Dương, Ngày Âm, Can Chi của năm và Can Chi của ngày (ví dụ: *Ngày Tân Dậu, năm Bính Ngọ*).

### 3. Cử chỉ điều hướng & Pull-to-Refresh thông minh
- Áp dụng **Pointer Events** hiện đại kèm cơ chế **Khóa trục (Axis Lock)** chống xung đột cử chỉ:
  - ⇄ **Vuốt ngang**: Chuyển sang **cặp 2 tháng mới** mượt mà (ví dụ từ Tháng 10 - 11 sang Tháng 12 - 01), luôn duy trì hiển thị 2 tháng song song hoàn hảo.
  - ⤓ **Kéo xuống (Pull to Refresh)**: Kéo màn hình từ trên xuống để quay về ngày hôm nay tức thì, có hoạt ảnh chỉ báo trực quan và phản hồi mượt mà.
  - Khóa hoàn toàn cử chỉ vuốt dọc chuyển năm/tháng vô ý: user chỉ đổi năm khi chủ động chọn qua Bộ chọn Năm/Tháng.
- Hiệu ứng trượt bằng CSS `transform: translate3d()` với độ trễ 200–240ms siêu mượt (60–120fps).

### 4. Bộ chọn nhanh Tháng / Năm (Bottom Sheet)
- Bấm vào tiêu đề năm ở header (ví dụ: `2026 \n Bính Ngọ`) để mở bảng trượt từ dưới lên (Bottom Sheet). Đây là phương thức duy nhất để đổi nhanh sang các năm khác.
- **Phạm vi động**: Tính tự động theo năm hiện tại của thiết bị: **80 năm trước** đến **20 năm sau** (ví dụ năm 2026: từ **1946** đến **2046**). Ngoài khoảng này sẽ tự động khóa và làm mờ.
- **Thanh cuộn năm 2 dòng siêu tốc**: Thiết kế 2 hàng song song (**Hàng trên: Năm lẻ**, **Hàng dưới: Năm chẵn**) giúp rút ngắn 50% chiều dài cuộn, duyệt 100 năm nhanh chóng; kèm nhãn cố định `Lẻ`/`Chẵn`, nút nhảy nhanh `-10`, `-1`, `+1`, `+10` năm và hiển thị Can Chi tương ứng.
- **Lưới 12 tháng**: Chọn nhanh tháng muốn bắt đầu xem.
- **Nút "Hôm nay"**: Quay về ngày hiện tại tức thì.

### 5. Tối ưu Portrait & Khóa màn hình ngang
- Khai báo `"orientation": "portrait"` trong PWA Manifest cho Android.
- Tích hợp lớp phủ cảnh báo thông minh (`@media (orientation: landscape)`): Khi người dùng xoay ngang điện thoại (hoặc trên iOS / Desktop), màn hình hiển thị hoạt ảnh xoay máy kèm thông báo *"Vui lòng xoay dọc điện thoại để hiển thị 2 tháng trọn vẹn"*.

### 6. Cài đặt PWA & Giao diện Light thanh thoát
- **Giao diện Light chuyên biệt**: Thiết kế thanh thoát, tối giản, các con số dương và âm có độ tương phản cao, cực kỳ rõ nét và dễ đọc.
- Hỗ trợ đầy đủ **Web App Manifest** và **Service Worker**: Tải tài nguyên một lần, sử dụng vĩnh viễn không cần kết nối mạng.
- Cài đặt lên màn hình chính (Add to Home Screen) trên iPhone và Android như một ứng dụng native.

---

## 📱 Hướng Dẫn Cài Đặt Ứng Dụng (PWA)

### Trên iOS (Safari):
1. Mở liên kết: [https://trungnguyenthien.github.io/pwa-vn-calendar/](https://trungnguyenthien.github.io/pwa-vn-calendar/) bằng Safari.
2. Bấm vào nút **Chia sẻ** (biểu tượng hình vuông có mũi tên hướng lên).
3. Chọn **Thêm vào MH chính** (Add to Home Screen).
4. Mở ứng dụng từ màn hình chính để tận hưởng trải nghiệm toàn màn hình (không thanh địa chỉ duyệt web).

### Trên Android (Chrome / Brave / Edge):
1. Truy cập liên kết trên bằng Chrome hoặc trình duyệt bất kỳ.
2. Chọn biểu tượng menu (3 chấm) hoặc banner **"Thêm vào màn hình chính"** / **"Cài đặt ứng dụng"**.
3. Ứng dụng sẽ xuất hiện trên màn hình điện thoại như ứng dụng độc lập.

---

## 🛠 Cấu Trúc Dự Án

```text
pwa-vn-calendar/
├── index.html              # Trang giao diện chính của ứng dụng
├── manifest.json           # Cấu hình PWA Manifest (portrait, icons, theme-color)
├── sw.js                   # Service Worker đảm bảo app chạy offline 100%
├── css/
│   └── style.css           # Toàn bộ thiết kế hệ thống, responsive 100dvh, Bottom Sheet
├── js/
│   ├── lunar.js            # Thuật toán chuyển đổi Âm Dương Lịch Hồ Ngọc Đức & Can Chi
│   └── app.js              # Xử lý render lịch, cử chỉ vuốt chạm, Bottom Sheet, theme
├── icons/
│   ├── favicon.svg         # Vector Favicon logo mặt trăng & mặt trời
│   ├── icon-192.png        # Icon PWA 192x192
│   ├── icon-512.png        # Icon PWA 512x512
│   ├── icon-maskable-192.png
│   ├── icon-maskable-512.png
│   └── apple-touch-icon.png# Icon dành riêng cho iOS
├── calendar-pwa-spec.md    # Đặc tả yêu cầu kỹ thuật ban đầu
└── README.md               # Tài liệu dự án
```

---

## 💻 Chạy Thử Trên Môi Trường Local

Nếu bạn muốn clone mã nguồn và chạy thử trên máy tính:

```bash
# Clone repository
git clone https://github.com/trungnguyenthien/pwa-vn-calendar.git

# Di chuyển vào thư mục dự án
cd pwa-vn-calendar

# Chạy một HTTP server đơn giản (sử dụng Python hoặc npx serve)
python3 -m http.server 8080

# Truy cập trên trình duyệt
# Mở http://localhost:8080 và bật chế độ Device Emulation (chọn iPhone hoặc Pixel)
```

---

## 📄 Bản Quyền & Giấy Phép

- Thuật toán chuyển đổi Âm lịch Việt Nam dựa trên nghiên cứu và mã nguồn mở của **TS. Hồ Ngọc Đức** (Đại học Leipzig).
- Dự án phát hành mã nguồn mở phục vụ cộng đồng.
