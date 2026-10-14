# Calendar PWA - Tính năng 1: Màn hình lịch chính

Phác thảo tính năng cho app lịch PWA chạy offline hoàn toàn, cài được trên Android/iOS.

## 1. Yêu cầu

- Chỉ hỗ trợ màn hình portrait.
- Hiển thị 2 tháng cùng lúc, vuốt để chuyển tháng, hai tháng hiển thị trọn vẹn.
- Hiển thị ngày âm/dương.
- Vuốt để xem lịch các năm trước và sau.
- Chọn nhanh tháng của một năm bất kỳ, hỗ trợ xem lại tối đa 80 năm trước và 20 năm sau.

## 2. Bố cục

- **Portrait only:** `"orientation": "portrait"` trong manifest chỉ có tác dụng trên Android. iOS bỏ qua thuộc tính này, nên cần thêm lớp phủ "Vui lòng xoay dọc điện thoại" khi phát hiện landscape (`@media (orientation: landscape)`).
- **2 tháng trên 1 màn hình:** xếp dọc, tháng trên và tháng dưới, mỗi tháng là lưới 7 cột × tối đa 6 hàng. Hai tháng cần vừa trọn màn hình mà không cuộn, nên chiều cao ô tính theo `vh`/`dvh`, không để cố định.
- **Header:** hiển thị `Tháng 10 - 11 / 2026`, bấm vào để mở bộ chọn nhanh tháng/năm.

## 3. Hiển thị ngày dương/âm

- Mỗi ô: số dương to ở giữa, số âm nhỏ bên dưới.
- Ngày mùng 1 âm hiển thị dạng `1/9` (ngày/tháng) để người xem biết đang sang tháng âm mới. Tháng nhuận ghi thêm `nhuận`.
- Tô khác màu cho Chủ nhật, ngày hôm nay, và ngày mùng 1/rằm (15 âm) cho dễ nhìn.
- **Tính offline:** dùng thuật toán đổi âm lịch Việt Nam (thuật toán của Hồ Ngọc Đức, múi giờ UTC+7). Tự cài đặt được bằng khoảng 100 dòng JS, không cần thư viện hay gọi mạng. Lịch Việt khác lịch Trung Quốc ở một số năm do chênh múi giờ, nên không dùng thư viện lịch Trung Quốc.

## 4. Swipe điều hướng

Có hai kiểu chuyển, cần phân biệt rõ để không xung đột cử chỉ:

| Cử chỉ | Hành vi đề xuất |
|---|---|
| Vuốt ngang | Chuyển tháng (trượt cửa sổ 2 tháng) |
| Vuốt dọc | Chuyển năm (trước/sau) |
| Bấm header | Mở bộ chọn nhanh tháng/năm |

Kỹ thuật: dùng Pointer Events cùng ngưỡng khoảng cách và vận tốc, khóa trục ngay khi người dùng bắt đầu vuốt (ngang hoặc dọc) để tránh vuốt chéo gây nhầm. Hiệu ứng trượt bằng CSS `transform`, khoảng 200-300ms.

## 5. Chọn nhanh tháng/năm

- Bottom sheet gồm cột chọn năm (cuộn) và lưới 12 tháng bên dưới.
- **Phạm vi:** tính theo năm hiện tại là 2026, tức từ **1946** đến **2046**. Ngoài khoảng này thì khóa swipe và làm mờ các năm không chọn được.
- Tính phạm vi động theo năm hiện tại của thiết bị, không gán cứng, để app dùng nhiều năm vẫn đúng "80 trước, 20 sau".
- Có nút "Hôm nay" để quay về nhanh.

## 6. Điểm cần chốt

1. **Bước vuốt ngang:** chuyển 1 tháng mỗi lần (cửa sổ trượt: 10-11 → 11-12) hay 2 tháng mỗi lần (10-11 → 12-01)? Đề xuất: 1 tháng vì dễ theo dõi hơn.
2. **Vuốt dọc đổi năm:** nhảy đúng 1 năm giữ nguyên tháng, hay cách khác?
