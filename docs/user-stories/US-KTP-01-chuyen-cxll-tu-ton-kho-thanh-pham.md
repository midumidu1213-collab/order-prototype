# CS5.E3.US-01: Chuyển Lô Sang Chờ Xử Lý Lại (CXLL) Từ Màn Hình Tồn Kho Thành Phẩm

> **Mã Story:** `CS5.E3.US-01` (hay `US-KTP-01`)  
> **Epic:** CS5.Epic 3: Chờ Xử Lý Lại (Kho Thành Phẩm)  
> **Module / Feature:** Kho Thành Phẩm / Chuyển Lô Sang Chờ Xử Lý Lại (CXLL)  
> **Actor chính:** Quản lý Kho thành phẩm (Thủ kho)  
> **Tài liệu tham chiếu:** [Prototype Kho Thành Phẩm: /inventory](http://localhost:3000/inventory)  
> **Trạng thái:** `Ready for Confluence Publish`  

---

## 1. USER STORY *

* **Là một (As a):** Quản lý Kho thành phẩm
* **Tôi muốn (I want):** 
    1. Khi nhận thông báo một đơn hàng (hoặc một dòng hàng) bị hủy trong lúc hàng vẫn đang nằm tại Kho TP (chưa xuất giao cho khách), tôi có thể bấm nút **`[Chuyển CXLL]`** trực tiếp tại dòng lô hàng đó hoặc chọn nhiều lô qua Checkbox.
    2. **Chỉ các lô ở trạng thái `Chờ phân bổ` mới có thể Chuyển CXLL.** Hệ thống tự động vô hiệu hóa (disable) nút thao tác và checkbox đối với các lô ở trạng thái khác (`Đã phân bổ`, `Chờ lập HĐ`, `Chờ giao`).
    3. Cho phép chuyển số lượng lẻ của lô nếu khách hàng chỉ hủy một phần số lượng của dòng hàng (ví dụ: hủy 2/4 pcs).
    4. Khi xác nhận chuyển thành công: Lô hàng được rút khỏi danh sách Tồn kho TP sẵn sàng giao và tự động đưa sang **Danh sách Chờ xử lý lại** với trạng thái *Chờ gán đơn mới*.
* **Để (So that):** Bảo toàn thành phẩm vật lý trong kho, ngăn chặn tuyệt đối việc chuyển nhầm các lô đang trong quy trình xuất kho/giao hàng, và chuyển sang chờ tái sử dụng cho các đơn hàng mới.

---

## 2. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC) *

* **AC 1: Chuyển sang Chờ xử lý lại (với lô Chờ phân bổ)**
  * **Biết rằng (Given):** Lô hàng đang ở trạng thái `Chờ phân bổ` tại màn hình Danh sách Tồn kho thành phẩm (`/inventory`).
  * **Khi (When):** Thủ kho bấm nút **`[Chuyển CXLL]`** (active) tại dòng tương ứng và bấm xác nhận trên modal đối soát phôi.
  * **Thì (Then):** Hệ thống rút lô hàng khỏi màn hình Tồn kho TP sẵn sàng giao và đưa sang Danh sách Chờ xử lý lại (`/inventory/reprocess`) với trạng thái `Chờ gán đơn mới`.
  * **Và (And):** Hiển thị Toast thông báo thành công kèm đường dẫn mở nhanh kho CXLL.

* **AC 2: Vô hiệu hóa nút Chuyển CXLL với các lô không phải Chờ phân bổ**
  * **Biết rằng (Given):** Lô hàng đang ở trạng thái khác `Chờ phân bổ` (gồm: `Đã phân bổ`, `Chờ lập HĐ`, hoặc `Chờ giao`).
  * **Thì (Then):** Tại bảng dữ liệu:
    * Nút **`[Chuyển CXLL]`** bị vô hiệu hóa (disabled, màu xám mờ `opacity-50`, cursor-not-allowed).
    * Khi rê chuột vào nút: Hiển thị tooltip giải thích: *"Không thể chuyển: Lô đang ở trạng thái '[Trạng thái]'. Chỉ lô Chờ phân bổ mới có thể Chuyển CXLL."*
    * Ô **Checkbox** ở đầu dòng bị khóa (disabled) để không thể chọn hàng loạt.
  * **Và (And):** Tại Drawer xem chi tiết: Nút `[Chuyển Chờ Xử Lý Lại (CXLL)]` cũng bị vô hiệu hóa kèm thông báo cảnh báo rõ ràng.

* **AC 3: Cho phép chọn nhiều lô Chờ phân bổ để chuyển hàng loạt**
  * **Biết rằng (Given):** Nhiều lô hàng đang ở trạng thái `Chờ phân bổ` cùng cần chuyển sang Kho CXLL.
  * **Khi (When):** Thủ kho tick chọn **Checkbox** ở đầu các dòng lô `Chờ phân bổ` (hoặc tick Header để chọn tất cả các lô `Chờ phân bổ`) và bấm nút **`[Chuyển CXLL hàng loạt]`** trên thanh công cụ.
  * **Thì (Then):** Hệ thống mở Modal xác nhận danh sách các lô đã chọn và chuyển đồng thời tất cả các lô hợp lệ sang Kho CXLL với trạng thái `Chờ gán đơn mới`.

* **AC 4: Cho phép chuyển SL lẻ**
  * **Biết rằng (Given):** Khách hàng chỉ hủy một phần số lượng của dòng hàng (ví dụ: hủy 2/4 pcs thuộc lô).
  * **Khi (When):** Thủ kho mở modal chuyển CXLL và nhập số lượng lẻ cần chuyển (VD: nhập 2 pcs).
  * **Thì (Then):** Hệ thống tách lô: 2 pcs được chuyển sang Kho CXLL (`Tồn khả dụng = 2 pcs`), và 2 pcs còn lại tiếp tục lưu giữ tại Tồn kho TP sẵn sàng giao theo đơn hàng.

---

## 3. THIẾT KẾ (UX/UI) *

* **Link Figma / Prototype:** [Màn hình Danh Sách Tồn Kho Thành Phẩm: /inventory](http://localhost:3000/inventory)
* **Ảnh đính kèm:**
  * Bảng danh sách Tồn kho thành phẩm với cột tiêu đề **`MÃ LÔ`**, nút `[Chuyển CXLL]` active chỉ với lô `Chờ phân bổ` và disabled với các trạng thái còn lại:

![Giao diện Tồn kho thành phẩm chuẩn hóa](file:///C:/Users/PowerBI/.gemini/antigravity/brain/b922bdcc-9a9f-48b7-9859-3d492213dc67/.user_uploaded/media_1794195686999_da48f531.jpg)

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES) *

* **BR-KTP-01 (Điều kiện tiên quyết chuyển CXLL):** **Chỉ lô ở trạng thái `Chờ phân bổ` mới có thể Chuyển CXLL.** Các lô ở trạng thái khác (`Đã phân bổ`, `Chờ lập HĐ`, `Chờ giao`) tuyệt đối không thể chuyển do đã dính líu đến quy trình đóng gói, lập hóa đơn hoặc giao hàng dở dang.
* **BR-KTP-02 (Vô hiệu hóa thao tác tại giao diện):**
  * Đối với các dòng không phải `Chờ phân bổ`: Nút `[Chuyển CXLL]` hiển thị ở trạng thái disabled kèm tooltip cảnh báo, Checkbox bị disable không cho chọn.
  * Trong Drawer chi tiết: Nút thao tác chuyển cũng bị disable và hiển thị Alert Box cảnh báo.
* **BR-KTP-03 (Trạng thái đích tại Kho CXLL):** Lô sau khi chuyển thành công sẽ xuất hiện tại DS Chờ xử lý lại với trạng thái `Chờ gán đơn mới` và `Tồn khả dụng = SL đã chuyển`. Đồng thời giảm tồn kho thành phẩm sẵn sàng giao tương ứng.
* **BR-KTP-04 (Tách lô khi chuyển SL lẻ):** Khi chuyển số lượng nhỏ hơn tổng tồn của lô (M < Tổng SL), hệ thống tự động trừ tồn lô gốc tại Kho TP và tạo bản ghi phôi mới tại Kho CXLL với số lượng đúng bằng M.

---

## 5. DANH MỤC DỮ LIỆU & RÀNG BUỘC

### 5.1 Màn hình Danh Sách Tồn Kho Thành Phẩm (`/inventory`)

| Fields (Tên trường) | Type (Kiểu dữ liệu) | Required (Bắt buộc) | Default value (Giá trị mặc định) | Rules (Quy tắc & Nghiệp vụ) |
| :--- | :--- | :---: | :--- | :--- |
| **Checkbox** | Boolean | Không | `Unchecked` | Chỉ active với các dòng có trạng thái `Chờ phân bổ`. Bị disabled với các trạng thái khác. Header Checkbox chỉ chọn tất cả các dòng `Chờ phân bổ`. |
| **Mã Lô** | Text / Font-mono | Có | Tự động sinh | Mã định danh lô hàng hoàn thiện (VD: `SO-260800001`), có nút copy nhanh 1-click. |
| **Mã KH** | Text / Font-mono | Có | Kế thừa từ SO | Mã khách hàng đặt đơn (VD: `2000001`). |
| **Tên Khách Hàng** | Text | Có | Kế thừa từ SO | Tên đầy đủ của khách hàng (VD: `Cty TNHH Vàng Bạc Kim Yến`). |
| **Mã SO** | Text / Font-mono | Có | Kế thừa từ SO | Mã đơn hàng đặt trước đó (VD: `SO2608001`). |
| **Mã Item** | Text / Font-mono | Có | Kế thừa từ SO | Mã sản phẩm 30 ký tự định danh mẫu (SKU). |
| **Chủng Loại** | Text | Có | Kế thừa từ SO | Chủng loại sản phẩm: Nhẫn, Bông tai, Vòng tay, Mặt dây... |
| **Loại / Tuổi Vàng** | Text | Có | Kế thừa từ SO | Hàm lượng tuổi vàng (VD: `AU 61.00 Y`, `AU 75.00 W`). |
| **Tổng SL** | Integer | Có | Kế thừa từ KHSX | Số lượng pcs hoàn thiện trong lô (VD: `10 psc`, `8 psc`). |
| **Trạng Thái** | Enum / Badge | Có | `Chờ phân bổ` | Giá trị: `Chờ phân bổ`, `Đã phân bổ`, `Chờ lập HĐ`, `Chờ giao`. |
| **SL Chuyển (Modal)** | Integer | Có | Bằng Tổng SL | Cho phép nhập số lượng lẻ cần chuyển (1 ≤ SL ≤ Tổng SL), phục vụ AC 4. |
| **Thao Tác** | Action / Button | — | — | Nút `[Chuyển CXLL]`. Active khi trạng thái là `Chờ phân bổ`; Vô hiệu hóa (disabled) khi ở trạng thái khác. |

---

## 6. LUỒNG NGHIỆP VỤ (MERMAID FLOW)

```mermaid
flowchart TD
    Start([1. Mở màn hình Tồn kho TP: /inventory]) --> CheckRowStatus{2. Kiểm tra trạng thái Lô}
    
    CheckRowStatus -->|Trạng thái khác 'Chờ phân bổ'| DisableAction[Vô hiệu hóa nút [Chuyển CXLL] & Khóa Checkbox<br>Hover hiển thị tooltip lý do chặn]
    
    CheckRowStatus -->|Trạng thái = 'Chờ phân bổ'| EnableAction[Kích hoạt nút [Chuyển CXLL] & Checkbox]
    
    EnableAction --> SelectMode{3. Chọn hình thức chuyển}
    SelectMode -->|Chuyển 1 lô| ClickRow[Bấm nút [Chuyển CXLL] tại dòng]
    SelectMode -->|Chuyển nhiều lô| CheckMultiple[Tick chọn các Checkbox Chờ phân bổ -> Bấm [Chuyển CXLL hàng loạt]]
    
    ClickRow --> OpenModal[4. Mở Modal xác nhận đối soát phôi]
    CheckMultiple --> OpenModal
    
    OpenModal --> InputQty{5. Chuyển hết lô hay SL lẻ?}
    InputQty -->|Chuyển hết lô| ConfirmFull[Giữ nguyên SL = Tổng SL của lô]
    InputQty -->|Chuyển SL lẻ| InputPartial[Nhập số lượng lẻ: 1 <= SL < Tổng SL]
    
    ConfirmFull --> ExecTransfer[6. Bấm nút: Xác nhận chuyển CXLL]
    InputPartial --> ExecTransfer
    
    ExecTransfer --> UpdateStock[7. Cập nhật hệ thống:<br>• Giảm/rút tồn kho TP sẵn sàng giao<br>• Đưa sang DS Chờ xử lý lại: /inventory/reprocess<br>• Tồn khả dụng CXLL = SL đã chuyển]
    UpdateStock --> ShowSuccess([8. Bắn Toast thông báo thành công kèm link mở Kho CXLL])
```

---

## 7. GHI CHÚ KỸ THUẬT & VALIDATION (TECH NOTES)

1. **Điều kiện chặn Thao tác (Frontend & Backend Validation):**
   ```text
   Hàm canTransferToReprocess(lot):
     Nếu lot.status === "Chờ phân bổ":
       Trả về true   // Cho phép chuyển
     Ngược lại:
       Trả về false  // Khóa nút và Checkbox, chặn API chuyển
   ```
2. **Quy chuẩn hiển thị UI:**
   - Dòng hợp lệ (`Chờ phân bổ`): Nút `Chuyển CXLL` có màu `bg-rose-50 text-rose-700 border-rose-300`, cursor pointer. Checkbox tick bình thường.
   - Dòng không hợp lệ (`Đã phân bổ`, `Chờ lập HĐ`, `Chờ giao`): Nút `Chuyển CXLL` có màu `bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50`. Checkbox bị `disabled` với `opacity-30 cursor-not-allowed`.
   - Tooltip: Hiển thị thông điệp rõ ràng khi hover chuột vào nút disabled: *"Không thể chuyển: Lô đang ở trạng thái '[Trạng thái]'. Chỉ lô Chờ phân bổ mới có thể Chuyển CXLL."*
3. **Định dạng số và công thức:** Sử dụng Plain text và ký hiệu Unicode (`=`, `+`, `-`, `—`, `≤`, `≥`), tuyệt đối không dùng mã LaTeX.
