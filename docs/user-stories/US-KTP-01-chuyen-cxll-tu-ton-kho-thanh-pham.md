# CS5.E3.US-01: Chuyển Lô Sang Chờ Xử Lý Lại (CXLL) Từ Màn Hình Tồn Kho Thành Phẩm

> **Mã Story:** `CS5.E3.US-01` (hay `US-KTP-01`)  
> **Epic:** CS5.Epic 3: Chờ Xử Lý Lại (Kho Thành Phẩm)  
> **Module / Feature:** Kho Thành Phẩm / Chuyển Lô Sang Chờ Xử Lý Lại (CXLL)  
> **Actor chính:** Quản lý Kho thành phẩm (Thủ kho)  
> **Tài liệu tham chiếu:** [Prototype Kho Thành Phẩm: /inventory](http://localhost:3000/inventory)  
> **Trạng thái:** `Ready for Review`  

---

## 1. USER STORY *

*   **Là một (As a):** Quản lý Kho thành phẩm
*   **Tôi muốn (I want):** 
    1. Khi nhận thông báo một đơn hàng (hoặc một dòng hàng) bị hủy trong lúc hàng vẫn đang nằm tại Kho TP (chưa xuất giao cho khách), tôi có thể bấm nút **`[Chuyển CXLL]`** trực tiếp tại dòng lô hàng đó hoặc chọn nhiều lô qua Checkbox.
    2. Hệ thống tự động kiểm tra chốt chặn: Nếu lô hàng đang dính dáng đến Phiếu giao hàng (DO) hoặc Invoice dở dang, hệ thống cảnh báo và yêu cầu gỡ/hủy chứng từ giao hàng trước.
    3. Cho phép chuyển số lượng lẻ của lô nếu khách hàng chỉ hủy một phần số lượng của dòng hàng (ví dụ: hủy 2/4 pcs).
    4. Khi xác nhận chuyển thành công: Lô hàng được rút khỏi danh sách Tồn kho TP sẵn sàng giao và tự động đưa sang **Danh sách Chờ xử lý lại** với trạng thái *Chờ gán đơn mới*.
*   **Để (So that):** Bảo toàn thành phẩm vật lý trong kho và chuyển sang chờ tái sử dụng cho các đơn hàng mới.

---

## 2. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC) *

*   **AC 1: Chuyển sang Chờ xử lý lại**
    *   **Given (Biết rằng):** Lô hàng đang ở trạng thái `Chờ phân bổ` tại màn hình Danh sách Tồn kho thành phẩm (`/inventory`).
    *   **When (Khi):** Thủ kho bấm nút **`[Chuyển CXLL]`** tại dòng tương ứng và bấm xác nhận trên modal đối soát phôi.
    *   **Then (Thì):** Hệ thống rút lô hàng khỏi màn hình Tồn kho TP sẵn sàng giao và đưa sang Danh sách Chờ xử lý lại (`/inventory/reprocess`) với trạng thái `Chờ gán đơn mới`.
    *   **And (Và):** Hiển thị Toast thông báo thành công kèm đường dẫn mở nhanh kho CXLL.

*   **AC 2: Chặn chuyển nếu lô đang ở trạng thái khác Chờ phân bổ (Đã phân bổ / Chờ lập HĐ / Chờ giao)**
    *   **Biết rằng (Given):** Lô hàng đang ở trạng thái `Đã phân bổ`, `Chờ lập HĐ`, hoặc `Chờ giao` (đang có liên kết với Phiếu giao hàng DO hoặc Invoice dở dang).
    *   **Khi (When):** Thủ kho bấm nút **`[Chuyển CXLL]`**.
    *   **Thì (Then):** Hệ thống chặn thao tác và hiển thị cảnh báo: *"Không thể chuyển: Lô hàng đang dính dáng đến Phiếu giao hàng (DO) hoặc Invoice dở dang. Vui lòng gỡ/hủy chứng từ giao hàng trước khi chuyển!"*.

*   **AC 3: Cho phép chọn nhiều để chuyển**
    *   **Biết rằng (Given):** Khách hàng hủy đơn có nhiều lô hàng khác nhau cùng nằm tại Kho TP.
    *   **Khi (When):** Thủ kho tick chọn **Checkbox** ở đầu các dòng lô cần chuyển và bấm nút **`[Chuyển CXLL hàng loạt]`** trên thanh công cụ.
    *   **Thì (Then):** Hệ thống mở Modal xác nhận danh sách các lô đã chọn và chuyển đồng thời tất cả các lô hợp lệ sang Kho CXLL với trạng thái `Chờ gán đơn mới`.

*   **AC 4: Cho phép chuyển SL lẻ**
    *   **Biết rằng (Given):** Khách hàng chỉ hủy một phần số lượng của dòng hàng (ví dụ: hủy 2/4 pcs thuộc lô).
    *   **Khi (When):** Thủ kho mở popup chuyển CXLL và nhập số lượng lẻ cần chuyển (VD: nhập 2 pcs).
    *   **Thì (Then):** Hệ thống tách lô: 2 pcs được chuyển sang Kho CXLL (`Tồn khả dụng = 2 pcs`), và 2 pcs còn lại tiếp tục lưu giữ tại Tồn kho TP sẵn sàng giao theo đơn hàng.

---

## 3. THIẾT KẾ (UX/UI) *

*   **Link Figma / Prototype:** [Màn hình Danh Sách Tồn Kho Thành Phẩm: /inventory](http://localhost:3000/inventory)
*   **Ảnh đính kèm:**
    *   *Ảnh 1: Cột Checkbox chọn nhiều & Nút Chuyển CXLL tại bảng dữ liệu:*
      
        ![Giao diện Tồn kho thành phẩm có cột Checkbox](file:///C:/Users/PowerBI/.gemini/antigravity/brain/b922bdcc-9a9f-48b7-9859-3d492213dc67/.user_uploaded/media_1793700633195_77f8a797.jpg)

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES) *

*   **BR-KTP-01 (Chốt chặn Phiếu giao hàng DO):** Nếu lô hàng đang thuộc DO chưa hủy hoặc Invoice chưa hủy, hệ thống chặn chuyển và hiển thị thông báo lỗi rõ ràng.
*   **BR-KTP-02 (Trạng thái đích tại Kho CXLL):** Lô sau khi chuyển thành công sẽ xuất hiện tại DS Chờ xử lý lại với trạng thái `Chờ gán đơn mới` và `Tồn khả dụng = SL đã chuyển`. Đồng thời cập nhật giảm số lượng tồn khả dụng thành phẩm sẵn sàng bán.
*   **BR-KTP-03 (Chỉ chuyển khi Chờ phân bổ):** Chỉ cho phép chuyển CXLL khi trạng thái lô là `Chờ phân bổ` (không bị khóa bởi DO hoặc Invoice). Nếu lô đang ở trạng thái khác, nút thao tác sẽ hiển thị cảnh báo yêu cầu xử lý chứng từ giao hàng trước.
*   **BR-KTP-04 (Tách lô khi chuyển SL lẻ):** Khi chuyển số lượng nhỏ hơn tổng tồn của lô ($M < \text{TotalQty}$), hệ thống tự động trừ tồn lô gốc tại Kho TP và tạo bản ghi phôi mới tại Kho CXLL với số lượng đúng bằng $M$.

---

## 5. DANH MỤC DỮ LIỆU & RÀNG BUỘC

### 5.1 Màn hình Danh Sách Tồn Kho Thành Phẩm (`/inventory`)

| Fields (Tên trường) | Type (Kiểu dữ liệu) | Required (Bắt buộc) | Default value (Giá trị mặc định) | Rules (Quy tắc & Nghiệp vụ) |
| :--- | :--- | :---: | :--- | :--- |
| **Checkbox** | Boolean | Không | `Unchecked` | Tick chọn từng dòng hoặc chọn tất cả ở Header để thực hiện chuyển CXLL hàng loạt (AC 3). |
| **Mã Bag (Lô)** | Text / Font-mono | Có | Tự động sinh | Mã định danh lô hàng hoàn thiện (VD: `SO-260800001`), có nút copy nhanh. |
| **Mã KH** | Text / Font-mono | Có | Kế thừa từ SO | Mã khách hàng đặt đơn (VD: `2000001`). |
| **Tên Khách Hàng** | Text | Có | Kế thừa từ SO | Tên đầy đủ của khách hàng (VD: `Cty TNHH Vàng Bạc Kim Yến`). |
| **Mã SO** | Text / Font-mono | Có | Kế thừa từ SO | Mã đơn hàng đặt trước đó (VD: `SO2608001`). |
| **Mã Item** | Text / Font-mono | Có | Kế thừa từ SO | Mã sản phẩm 30 ký tự định danh mẫu (SKU). |
| **Chủng Loại** | Text | Có | Kế thừa từ SO | Chủng loại sản phẩm: Nhẫn, Bông tai, Vòng tay, Mặt dây... |
| **Loại / Tuổi Vàng** | Text | Có | Kế thừa từ SO | Hàm lượng tuổi vàng (VD: `AU 61.00 Y`, `AU 75.00 W`). |
| **Tổng SL** | Integer | Có | Kế thừa từ KHSX | Số lượng pcs hoàn thiện trong lô (VD: `10 psc`, `8 psc`). |
| **Trạng Thái** | Enum / Badge | Có | `Chờ phân bổ` | Giá trị: `Chờ phân bổ`, `Đã phân bổ`, `Chờ lập HĐ`, `Chờ giao`. |
| **SL Chuyển (Modal)** | Integer | Có | Bằng Tổng SL | Cho phép nhập số lượng lẻ cần chuyển ($1 \le \text{SL} \le \text{Tổng SL}$), phục vụ AC 4. |
| **Thao Tác** | Action / Button | — | — | Nút `[Chuyển CXLL]` màu rose-50, mở modal xác nhận đối soát phôi. |

---

## 6. LUỒNG NGHIỆP VỤ (MERMAID FLOW)

```mermaid
flowchart TD
    Start([1. Mở màn hình Tồn kho TP: /inventory]) --> SelectMode{2. Chọn hình thức chuyển}
    
    SelectMode -->|Chuyển từng lô lẻ| ClickRow[Bấm nút [Chuyển CXLL] tại dòng]
    SelectMode -->|Chuyển hàng loạt| CheckMultiple[Tick chọn nhiều Checkbox ở đầu bảng -> Bấm [Chuyển CXLL hàng loạt]]
    
    ClickRow --> OpenModal[3. Mở Modal xác nhận đối soát phôi]
    CheckMultiple --> OpenModal
    
    OpenModal --> CheckStatus{4. Trạng thái lô = 'Chờ phân bổ'?}
    CheckStatus -->|Sai: Đã phân bổ/Chờ lập HĐ/Chờ giao| Block[Chặn chuyển & Cảnh báo: Lô đang dính DO/Invoice dở dang]
    
    CheckStatus -->|Đúng: Chờ phân bổ| InputQty{5. Chuyển hết lô hay SL lẻ?}
    InputQty -->|Chuyển hết lô| ConfirmFull[Giữ nguyên SL = Tổng SL của lô]
    InputQty -->|Chuyển SL lẻ| InputPartial[Nhập số lượng lẻ cần chuyển: 1 <= SL < Tổng SL]
    
    ConfirmFull --> ExecTransfer[6. Bấm nút: Xác nhận chuyển CXLL]
    InputPartial --> ExecTransfer
    
    ExecTransfer --> UpdateStock[7. Cập nhật hệ thống:<br>• Giảm/rút tồn kho TP sẵn sàng giao<br>• Đưa sang DS Chờ xử lý lại: /inventory/reprocess<br>• Tồn khả dụng CXLL = SL đã chuyển]
    UpdateStock --> ShowSuccess([8. Bắn Toast thành công kèm link mở Kho CXLL])
```
