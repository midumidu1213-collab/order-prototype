# USER STORY: US-DO-01 Lập & Quản Lý Vòng Đời Phiếu Giao Hàng (Delivery Order - DO)

## 1. MÔ TẢ USER STORY
* **Là một:** Nhân viên Vận hành kinh doanh (Sales Operations - VHKD)
* **Tôi muốn:** 
  1. Thao tác chọn các Lô (Bag thành phẩm đã sản xuất xong) từ danh sách chờ giao để lập Phiếu Giao hàng (DO) gửi Kho đóng gói và lập hóa đơn.
  2. Phân loại thao tác theo Lô: Lô có mã Series được chọn lẻ từng pcs, Lô không có Series chọn cả lô.
  3. Xử lý chỉnh sửa / hủy DO dựa vào trạng thái Hóa đơn:
     - **Chưa lập hóa đơn:** Cho phép chỉnh sửa/hủy Phiếu giao hàng $\rightarrow$ Kho sẽ phân bổ lại.
     - **Đã lập hóa đơn:** **Không được phép hủy, Chỉ được phép điều chỉnh (không có trường hợp điều chỉnh về 0, $SL \ge 1$)** $\rightarrow$ Gửi YC điều chỉnh đến Kho để Xử lý trực tiếp (không cần duyệt bởi Kho).
  4. Thông tin Yêu cầu điều chỉnh thể hiện đầy đủ, rõ ràng và tính toán lại thành tiền theo số lượng mới.
* **Để:** Tạo chốt chặn kiểm soát chặt chẽ giữa Đơn hàng bán (SO) và Hóa đơn (Invoice), đảm bảo quy tắc 1 DO = 1 Invoice, tối ưu vận hành giao hàng.

---

## 2. MA TRẬN 7 TRẠNG THÁI PHIẾU GIAO HÀNG
1. `Đã phân bổ` (VHKD tạo DO)
2. `Chờ lập hóa đơn` (Chuyển Kho đóng gói)
3. `Chờ giao` (Đã xuất HĐ, chờ giao đi)
4. `Đang giao` (Đang trên đường giao)
5. `Đã giao` (Khách đã nhận hàng thành công)
6. `Chờ giao lại` (Lên lịch giao lại đợt 2)
7. `Đã hủy` (Hủy khi chưa xuất HĐ)

---

## 3. TIÊU CHÍ CHẤP NHẬN (AC)
- **AC-01 (Tạo DO & Phân loại Series):** Lô có Series cho phép chọn lẻ từng pcs; Lô không có Series bắt buộc chọn nguyên cả lô.
- **AC-02 (Chưa lập hóa đơn):** Cho phép Chỉnh sửa/Hủy DO $\rightarrow$ Hệ thống tự động trigger Kho phân bổ lại tồn kho.
- **AC-03 (Đã lập hóa đơn):** KHÔNG được phép hủy, CHỈ được phép điều chỉnh ($SL \ge 1$, không cho về 0).
- **AC-04 (Thông tin YCĐC & Tính lại thành tiền):** Bảng YCĐC hiển thị chi tiết:
  - Khách hàng
  - Loại Nguyên liệu - Hàm lượng - Màu nguyên liệu
  - Mã Lô & Mã Item
  - SL cũ vs SL mới
  - Tổng TL cũ vs Tổng TL mới
  - TL Đá cũ vs TL Đá mới
  - TL Kim loại cũ vs TL Kim loại mới
  - Đơn giá công
  - Tiền công cũ vs Tiền công mới (tính lại theo SL mới)
- **AC-05 (Gửi Kho xử lý):** Gửi YCĐC sang Kho Thành Phẩm để xử lý thực thi ngay, không cần bước duyệt từ Kho.
