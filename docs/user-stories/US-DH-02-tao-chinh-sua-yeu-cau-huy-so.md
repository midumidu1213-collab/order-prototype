# US-DH-02: Màn hình Tạo mới và Chỉnh sửa Yêu cầu Hủy SO

> **Mã Story:** `US-DH-02`  
> **Module:** Quản lý đơn hàng (Sales Order Management)  
> **Feature:** Yêu cầu hủy SO (Cancel Sales Order Requests)  

---

## 1. Tóm tắt User Story (User Story Statement)
*   **AS A:** Nhân viên Kinh doanh
*   **I WANT TO:** Tạo mới hoặc chỉnh sửa yêu cầu hủy SO bằng cách chọn các sản phẩm trực thuộc đơn hàng gốc, xem trực quan hình ảnh, trọng lượng, đơn giá và nhập lý do hủy bắt buộc
*   **SO THAT:** Tôi có thể gửi yêu cầu lên cấp quản lý phê duyệt với số lượng, giá trị giảm trừ và lý do hủy minh bạch, hạn chế nhầm lẫn mã hàng.

---

## 2. Luồng Nghiệp vụ (Business Flow)

```mermaid
flowchart TD
    Start([Bấm '+ Tạo yêu cầu hủy' hoặc icon Sửa ✏️]) --> FormView[Hiển thị Màn hình Form: US-DH-02]
    
    FormView --> Step1[1. Thông tin chung: Hệ thống tự sinh Mã YC & Chọn Mã SO cần hủy]
    Step1 --> AutoLoad[Hệ thống tự động tải Tên khách hàng, Loại đơn, Nguyên liệu, Tuổi vàng & Item thuộc SO]
    
    AutoLoad --> Step2[2. Nhập Lý do hủy chung * bắt buộc]
    Step2 --> Step3[3. Khai báo Subtable: Chọn Item trong SO -> Tự động hiển thị Hình ảnh, Trọng lượng, Đơn giá, SL đặt]
    
    Step3 --> InputQty[4. Nhập SL yêu cầu hủy * & Lý do hủy chi tiết nếu có]
    InputQty --> RealtimeCalc[Hệ thống tự động tính Thành tiền hủy = SL hủy x Đơn giá & Tổng giá trị hủy]
    
    RealtimeCalc --> UserAction{Hành động người dùng}
    
    UserAction -->|Bấm '+ Thêm dòng'| AddRow[Thêm dòng Item mới thuộc SO vào Subtable]
    AddRow --> Step3
    
    UserAction -->|Bấm icon Xóa dòng 🗑️| CheckCount{Số dòng > 1?}
    CheckCount -->|Đúng| RemoveRow[Xóa dòng sản phẩm & Cập nhật lại Tổng tiền]
    CheckCount -->|Sai| AlertMinRow[Cảnh báo: Yêu cầu cần tối thiểu 1 sản phẩm]
    RemoveRow --> Step3
    AlertMinRow --> Step3
    
    UserAction -->|Bấm 'Hủy bỏ'| CancelForm[Hủy thao tác & Quay về Danh sách US-DH-01]
    
    UserAction -->|Bấm 'Gửi yêu cầu phê duyệt'| ValidateForm{Kiểm tra 'Lý do hủy chung' & Dữ liệu bắt buộc?}
    ValidateForm -->|Hợp lệ| SaveRecord[Lưu yêu cầu với Trạng thái = 'Chờ phê duyệt']
    ValidateForm -->|Thiếu 'Lý do hủy chung'| ShowError[Báo lỗi: Bắt buộc nhập Lý do hủy chung]
    SaveRecord --> SuccessNotify[Hiển thị Toast thành công & Chuyển hướng sau 1.5s]
    SuccessNotify --> Done([Quay về Màn hình Danh sách US-DH-01])
```

---

## 3. Quy tắc Nghiệp vụ & Ràng buộc Dữ liệu (Business Rules)

### BR 2.1: Cấu trúc Form Thông tin chung (Card 1)
| Trường dữ liệu | Loại Input | Ràng buộc / Validate | Ghi chú hiển thị |
| :--- | :--- | :--- | :--- |
| **Mã yêu cầu** | Text Input | Bắt buộc, Read-only | Tự động sinh theo quy tắc `YCH-YYYY-XXX`. |
| **Mã SO cần hủy** | Select Dropdown | Bắt buộc | Chỉ chọn các SO hợp lệ (VD: `SO2608001`, `SO2608002`...). |
| **Mã - Tên Khách hàng** | Text Input | Tự động (Read-only) | Tự động lấy tên khách hàng từ SO gốc (VD: `2000001 - Cty Kim Yến`). |
| **Loại đơn / Nguyên liệu / Tuổi vàng** | Badge / Card | Tự động (Read-only) | Tự động hiển thị tóm tắt thông tin đơn hàng gốc. |
| **Lý do hủy chung** | Text Input | **Bắt buộc (*)** | Nhập lý do tổng quát của đợt hủy (Max 500 ký tự). |

### BR 2.2: Ràng buộc Bảng chi tiết sản phẩm (Card 2 - Subtable)
| Cột dữ liệu | Loại Input | Ràng buộc / Validate | Ghi chú hiển thị |
| :--- | :--- | :--- | :--- |
| **Hình ảnh** | Image Thumbnail | Tự động (Read-only) | Ảnh mẫu thu nhỏ của sản phẩm vàng/trang sức. |
| **Mã Item (Trong SO)** | Select Dropdown | **Bắt buộc (*)** | **Chỉ hiển thị danh sách các Item thực tế có trong SO đã chọn.** |
| **Trọng lượng** | Text / Badge | Tự động (Read-only) | Trọng lượng sản phẩm từ Master data (VD: `0.85 chỉ (3.19g)`). |
| **Đơn giá** | Number / Currency | Tự động (Read-only) | Đơn giá niêm yết trong SO gốc (Định dạng VND). |
| **SL đặt trong SO** | Text / Badge | Tự động (Read-only) | Số lượng đã đặt ban đầu để người dùng đối soát tránh nhập vượt quá. |
| **SL yêu cầu hủy** | Number Input | **Bắt buộc (*)** | Số nguyên dương (`1 <= SL hủy <= SL đặt trong SO`). |
| **Thành tiền hủy** | Currency | Tự động (Read-only) | Tự động tính: `SL yêu cầu hủy × Đơn giá`. |
| **Lý do hủy chi tiết** | Text Input | **Không bắt buộc (Optional)** | Ghi chú cụ thể cho từng món nếu có (VD: Khách đổi ni tay, lỗi kỹ thuật...). |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria - Gherkin)

### AC 2.1: Lọc Mã Item và hiển thị trực quan thông tin sản phẩm
*   **Given:** Người dùng đang ở màn hình tạo mới `/cancel-requests/create`.
*   **When:** Người dùng chọn `Mã SO cần hủy = "SO2608001"`.
*   **Then:** Dropdown `Mã Item` ở Subtable chỉ hiển thị các sản phẩm thuộc về đơn hàng `SO2608001`.
*   **And:** Các cột `Hình ảnh`, `Trọng lượng`, `Đơn giá`, `SL đặt trong SO` tự động hiển thị thông tin chính xác của sản phẩm được chọn.

### AC 2.2: Tự động tính Thành tiền hủy và Tổng giá trị hủy
*   **Given:** Sản phẩm `GY0RG000086...` có Đơn giá = `5.200.000 đ`.
*   **When:** Người dùng nhập `SL yêu cầu hủy = 2`.
*   **Then:** Cột `Thành tiền hủy` hiển thị `10.400.000 đ` và dòng `Tổng cộng đợt hủy` ở chân bảng tự động cộng dồn giá trị tương ứng.

### AC 2.3: Validate bắt buộc "Lý do hủy chung"
*   **Given:** Người dùng đã chọn Item và số lượng hủy hợp lệ nhưng để trống ô `Lý do hủy chung`.
*   **When:** Người dùng click nút `Gửi yêu cầu phê duyệt`.
*   **Then:** Hệ thống hiển thị cảnh báo lỗi: `"Vui lòng nhập 'Lý do hủy chung' trước khi gửi phê duyệt!"` và chặn không lưu bản ghi.

### AC 2.4: "Lý do hủy chi tiết" là trường không bắt buộc
*   **Given:** Người dùng đã nhập `Lý do hủy chung` và để trống ô `Lý do hủy chi tiết` của từng Item.
*   **When:** Người dùng click `Gửi yêu cầu phê duyệt`.
*   **Then:** Hệ thống vẫn chấp nhận lưu dữ liệu và gửi phê duyệt thành công.

---

## 5. Definition of Done (DoD)
- [x] Đã tích hợp các cột Hình ảnh, Trọng lượng, Đơn giá, Thành tiền hủy vào Subtable.
- [x] Dropdown Mã Item chỉ tải các sản phẩm thuộc SO đang chọn.
- [x] Kiểm tra validate: Bắt buộc Lý do hủy chung, không bắt buộc Lý do chi tiết.
- [x] Đã verify chạy hoàn hảo trên Prototype và đồng bộ GitHub.
