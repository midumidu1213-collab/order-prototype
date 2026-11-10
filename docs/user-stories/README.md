# Danh mục Tài liệu User Stories - Phân Hệ Kho & Bán Hàng Sevago Jewelry

Thư mục này chứa toàn bộ các User Stories đặc tả chi tiết các phân hệ nghiệp vụ thuộc hệ thống Sevago Jewelry:
1. **Epic: Yêu cầu Hủy SO (Cancel Sales Order Requests)**
2. **CS5.Epic 3: Kho Thành Phẩm & Chờ Xử Lý Lại (CXLL)**

---

## 📑 1. Epic: Yêu Cầu Hủy SO & E-Catalogue

| Mã US | Tên User Story | Phạm vi & Màn hình | Link tài liệu |
| :---: | :--- | :--- | :---: |
| **US-DH-01** | Xem và quản lý danh sách Yêu cầu hủy SO | **Màn hình 1:** Bảng danh sách, bộ lọc Tabs, Live Search, nút Xóa | [`US-DH-01-danh-sach-yeu-cau-huy-so.md`](./US-DH-01-danh-sach-yeu-cau-huy-so.md) |
| **US-DH-02** | Tạo mới và chỉnh sửa Yêu cầu hủy SO | **Màn hình 2:** Form thông tin chung tinh gọn, Subtable chi tiết, Real-time sum | [`US-DH-02-tao-chinh-sua-yeu-cau-huy-so.md`](./US-DH-02-tao-chinh-sua-yeu-cau-huy-so.md) |
| **US-DH-03** | Xem chi tiết Subtable và Phê duyệt nhanh | **Màn hình 3:** Click dòng trượt mở Subtable, Quick Approve / Reject | [`US-DH-03-chi-tiet-subtable-phe-duyet-nhanh.md`](./US-DH-03-chi-tiet-subtable-phe-duyet-nhanh.md) |
| **US-DH-04** | Chọn Item Trong Kho Thành Phẩm (Chờ Xử Lý Lại) Vào Đơn Hàng | **Màn hình 4:** Chi tiết đơn hàng `/orders/:id`, Banner gợi ý, Popup chọn tồn kho, điều tiết giữ chỗ đá | [`US-DH-04-chon-item-kho-thanh-pham-cho-xu-ly-lai.md`](./US-DH-04-chon-item-kho-thanh-pham-cho-xu-ly-lai.md) |
| **US-EC-02** | Quản lý Yêu cầu thay đổi & Version Routing trên E-Catalogue và Admin | **E-Catalogue & QLĐH:** So sánh As-Is vs To-Be, Cascade checkbox 'Khác', Đưa Version Routing lên EC bán tiếp | [`US-EC-02-yeu-cau-thay-doi-va-version-routing.md`](./US-EC-02-yeu-cau-thay-doi-va-version-routing.md) |

---

## 🏭 2. CS5.Epic 3: Kho Thành Phẩm & Chờ Xử Lý Lại (CXLL)

| Mã US | Tên User Story | Phạm vi & Màn hình | Link tài liệu | Link Trải Nghiệm Prototype |
| :---: | :--- | :--- | :---: | :---: |
| **US-KTP-01** | Chuyển Lô Sang Chờ Xử Lý Lại (CXLL) Từ Màn Hình Tồn Kho Thành Phẩm | **Màn hình Kho TP:** Điều chuyển lô Chờ phân bổ sang CXLL, chuyển SL lẻ, kiểm tra Lô có Series / Non-series, tích hợp cân điện tử Lượng (L), chọn Stamp đá, 3 field TL tinh gọn | [`US-KTP-01-chuyen-cxll-tu-ton-kho-thanh-pham.md`](./US-KTP-01-chuyen-cxll-tu-ton-kho-thanh-pham.md) | [Vercel /inventory](https://dungseva.vercel.app/inventory) |
| **US-KTP-02** | Quản Lý Danh Sách Lô Chờ Xử Lý Lại | **Màn hình Kho CXLL:** Quản lý phôi hủy, 1 cột SL duy nhất, cơ chế tự động tách dòng theo trạng thái (`Chờ gán đơn`, `Đã giữ chỗ`, `Chờ chuyển bag`), chống pick trùng | [`US-KTP-02-danh-sach-cho-xu-ly-lai-va-giu-cho.md`](./US-KTP-02-danh-sach-cho-xu-ly-lai-va-giu-cho.md) | [Vercel /inventory/reprocess](https://dungseva.vercel.app/inventory/reprocess) |
| **US-KTP-03** | Trạm Cấp Thành Phẩm (Serve FG) - Chuyển Từ Bag Cũ Sang Bag Mới & In Thẻ Bag KHSX | **Trạm Cấp TP:** Chuyển phôi từ Bag cũ sang Bag mới, đóng Bag cũ, in Thẻ Bag KHSX 2 cột chuẩn nhà máy, sắp xếp cột Lô Mới lên trước Lô Cũ | [`US-KTP-03-tram-cap-thanh-pham-serve-fg-in-the-bag.md`](./US-KTP-03-tram-cap-thanh-pham-serve-fg-in-the-bag.md) | [Vercel /inventory/reprocess/serve](https://dungseva.vercel.app/inventory/reprocess/serve) |

---

## 🔗 Liên kết hệ thống
*   **Vercel Production Deployment:** [https://dungseva.vercel.app/](https://dungseva.vercel.app/)
*   **Kho lưu trữ GitHub (Primary):** [https://github.com/midumidu1213-collab/order-prototype](https://github.com/midumidu1213-collab/order-prototype)
*   **Kho lưu trữ GitHub (Vercel Sync):** [https://github.com/midumidu1213-collab/dungseva](https://github.com/midumidu1213-collab/dungseva)
