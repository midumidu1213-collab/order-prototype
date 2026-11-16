# CS5.E3.US-01: Chuyển Lô Sang Chờ Xử Lý Lại (CXLL) Từ Màn Hình Tồn Kho Thành Phẩm

> **Mã Story:** `CS5.E3.US-01` (hay `US-KTP-01`)  
> **Epic:** CS5.Epic 3: Chờ Xử Lý Lại (Kho Thành Phẩm)  
> **Module / Feature:** Kho Thành Phẩm / Chuyển Lô Sang Chờ Xử Lý Lại (CXLL)  
> **Actor chính:** Quản lý Kho thành phẩm (Thủ kho)  
> **Tài liệu tham chiếu:** [Prototype Vercel: https://dungseva.vercel.app/inventory](https://dungseva.vercel.app/inventory) | [Localhost: http://localhost:3000/inventory](http://localhost:3000/inventory)  
> **Trạng thái:** `Ready for Confluence Publish`  

---

## 1. USER STORY *

* **Là một (As a):** Quản lý Kho thành phẩm
* **Tôi muốn (I want):** 
    1. Khi nhận thông báo một đơn hàng (hoặc một dòng hàng) bị hủy trong lúc hàng vẫn đang nằm tại Kho TP (chưa xuất giao cho khách), tôi có thể bấm nút **`[Chuyển CXLL]`** trực tiếp tại dòng lô hàng đó hoặc chọn nhiều lô qua Checkbox.
    2. Bảng Tồn kho thành phẩm hiển thị tinh gọn: **Đã bỏ cột `Đã phân bổ`**, chỉ gồm các cột số lượng thiết yếu: `Tổng SL`, `Chờ phân bổ`, `Chờ lập HĐ`, `Chờ giao`.
    3. **Chỉ các lô ở trạng thái `Chờ phân bổ` mới có thể Chuyển CXLL.** Hệ thống tự động vô hiệu hóa (disable) nút thao tác và checkbox đối với các lô ở trạng thái khác (`Chờ lập HĐ`, `Chờ giao`, `Đã phân bổ`).
    4. Cho phép chuyển số lượng lẻ của lô nếu khách hàng chỉ hủy một phần số lượng của dòng hàng (ví dụ: hủy 2/4 pcs).
    5. Modal chuyển CXLL phân tách rõ 2 trường hợp:
       * **Lô có Series:** Chọn mã Series lẻ, kế thừa Stamp và trọng lượng của từng series.
       * **Lô không có Series:** Bắt buộc cân lại Tổng trọng lượng (chuẩn 4 số sau dấu thập phân) và chọn Stamp theo quy tắc: **`Số Stamp = TL Đá × 1000`**.
    6. Khi xác nhận chuyển thành công: Lô hàng được rút khỏi danh sách Tồn kho TP sẵn sàng giao và tự động đưa sang **Danh sách Chờ xử lý lại** với trạng thái *Chờ gán đơn*.
* **Để (So that):** Bảo toàn thành phẩm vật lý trong kho, ngăn chặn tuyệt đối việc chuyển nhầm các lô đang trong quy trình xuất kho/giao hàng, và chuyển sang chờ tái sử dụng cho các đơn hàng mới.

---

## 2. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC) *

* **AC 1: Chuyển sang Chờ xử lý lại (với lô Chờ phân bổ)**
  * **Biết rằng (Given):** Lô hàng đang ở trạng thái `Chờ phân bổ` tại màn hình Danh sách Tồn kho thành phẩm (`/inventory`).
  * **Khi (When):** Thủ kho bấm nút **`[Chuyển CXLL]`** (active) tại dòng tương ứng và bấm xác nhận trên modal đối soát phôi.
  * **Thì (Then):** Hệ thống rút lô hàng khỏi màn hình Tồn kho TP sẵn sàng giao và đưa sang Danh sách Chờ xử lý lại (`/inventory/reprocess`) với trạng thái `Chờ gán đơn`.
  * **Và (And):** Hiển thị Toast thông báo thành công kèm đường dẫn mở nhanh kho CXLL.

* **AC 2: Vô hiệu hóa nút Chuyển CXLL với các lô không phải Chờ phân bổ**
  * **Biết rằng (Given):** Lô hàng đang ở trạng thái khác `Chờ phân bổ` (gồm: `Chờ lập HĐ`, `Chờ giao`, hoặc `Đã phân bổ`).
  * **Thì (Then):** Tại bảng dữ liệu:
    * Nút **`[Chuyển CXLL]`** bị vô hiệu hóa (disabled, màu xám mờ `opacity-50`, cursor-not-allowed).
    * Khi rê chuột vào nút: Hiển thị tooltip giải thích: *"Không thể chuyển: Lô đang ở trạng thái '[Trạng thái]'. Chỉ lô Chờ phân bổ mới có thể Chuyển CXLL."*
    * Ô **Checkbox** ở đầu dòng bị khóa (disabled) để không thể chọn hàng loạt.
  * **Và (And):** Tại Drawer xem chi tiết: Nút `[Chuyển Chờ Xử Lý Lại (CXLL)]` cũng bị vô hiệu hóa kèm thông báo cảnh báo rõ ràng.

* **AC 3: Cho phép chọn nhiều lô Chờ phân bổ để chuyển hàng loạt**
  * **Biết rằng (Given):** Nhiều lô hàng đang ở trạng thái `Chờ phân bổ` cùng cần chuyển sang Kho CXLL.
  * **Khi (When):** Thủ kho tick chọn **Checkbox** ở đầu các dòng lô `Chờ phân bổ` (hoặc tick Header để chọn tất cả các lô `Chờ phân bổ`) và bấm nút **`[Chuyển CXLL hàng loạt]`** trên thanh công cụ.
  * **Thì (Then):** Hệ thống mở Modal xác nhận danh sách các lô đã chọn và chuyển đồng thời tất cả các lô hợp lệ sang Kho CXLL với trạng thái `Chờ gán đơn`.

* **AC 4: Cho phép chuyển SL lẻ**
  * **Biết rằng (Given):** Khách hàng chỉ hủy một phần số lượng của dòng hàng (ví dụ: hủy 2/4 pcs thuộc lô).
  * **Khi (When):** Thủ kho mở modal chuyển CXLL và nhập số lượng lẻ cần chuyển (VD: nhập 2 pcs).
  * **Thì (Then):** Hệ thống tách lô: 2 pcs được chuyển sang Kho CXLL (`SL = 2`), và 2 pcs còn lại tiếp tục lưu giữ tại Tồn kho TP sẵn sàng giao theo đơn hàng.

* **AC 5: Kiểm tra Lô có Series hay Không khi Chuyển CXLL & Tích Hợp Cân**
  * **Biết rằng (Given):** Thủ kho mở modal Chuyển CXLL cho một lô hàng `Chờ phân bổ`. Subtitle modal hiển thị trực tiếp `Mã Lô: [Mã Bag]`.
  * **Khi (When):** Hệ thống kiểm tra đặc tính quản lý series của lô:
    * **Trường hợp 1 (Lô có Series):** 
      * Hệ thống hiển thị danh sách các mã series thuộc lô, mỗi mã series hiển thị đầy đủ: `Mã Series`, badge `Stamp [Mã số]` (ví dụ: Stamp 15, Stamp 24), `TL Kim loại (L)`, `TL Đá (L)`, `Tổng TL (L)`.
      * Thủ kho chọn đúng số lượng mã series cần chuyển (khớp với số lượng chuyển đã nhập).
      * Hệ thống tự động tổng hợp trọng lượng từ các series được chọn: `Tổng TL`, `TL Đá`, và `TL Kim loại = Tổng TL - TL Đá` (đơn vị Lượng - L, chuẩn 4 số sau thập phân).
    * **Trường hợp 2 (Lô không có Series):**
      * Bắt buộc Thủ kho phải **cân lại Tổng trọng lượng (Tổng TL)** thực tế bằng cách nhập tay hoặc bấm nút **`[Lấy số cân]`** tích hợp từ máy cân điện tử tại bàn làm việc (đơn vị tính là Lượng - L, hiển thị chuẩn 4 số sau dấu thập phân `#.####`, ví dụ `1.5000 L`).
      * Bắt buộc **chọn Stamp (quy cách đá chuẩn)**: Áp dụng quy tắc chuẩn **`Số Stamp = TL Đá × 1000`** (ví dụ: `TL Đá = 0.0012` ➔ `Stamp = 1.2`; `TL Đá = 0.0004` ➔ `Stamp = 0.4`; `TL Đá = 0.0150` ➔ `Stamp = 15`...). Quy tắc 1 pcs tương ứng với 1 stamp; hỗ trợ nút `+ Thêm loại Stamp khác` khi lô có nhiều quy cách đá khác nhau (ràng buộc: Tổng SL các Stamp = SL chuyển).
      * Hệ thống tự động tính toán: `TL Kim loại = Tổng TL - TL Đá`.
  * **Thì (Then):** Bảng tóm tắt modal hiển thị tiêu đề tinh gọn **`Trọng lượng chuyển:`** gồm rõ ràng **3 field tách biệt**: `TL Kim loại (L)`, `TL Đá (Stamp) (L)`, `Tổng TL (Cân lại) (L)`. Loại bỏ dòng giải thích công thức và trường `Vị trí lưu kho` để triệt tiêu rác thị giác.

---

## 3. THIẾT KẾ (UX/UI) *

* **Link Prototype:** [Vercel Production: https://dungseva.vercel.app/inventory](https://dungseva.vercel.app/inventory) | [Localhost: http://localhost:3000/inventory](http://localhost:3000/inventory)
* **Bố cục bảng Tồn kho thành phẩm:**
  - Bảng danh sách đã bỏ cột `Đã phân bổ`, chỉ còn: `Mã Lô`, `Mã KH`, `Tên Khách Hàng`, `Mã SO`, `Mã Item`, `Chủng Loại`, `Loại / Tuổi`, `Tổng SL`, `Chờ Phân Bổ`, `Chờ Lập HĐ`, `Chờ Giao`, `Trạng Thái`, `Tổng TL`, `Thao Tác`.
  - Giá trị bằng 0 trong các cột số lượng và trọng lượng luôn hiển thị số `0` hoặc `0.0000`, không để dấu `-` hay `—`.
  - Modal chuyển CXLL hỗ trợ nút `[Lấy số cân]`, dropdown chọn Stamp và tính toán tức thì theo công thức bảo toàn.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES) *

* **BR-KTP-01 (Điều kiện tiên quyết chuyển CXLL):** **Chỉ lô ở trạng thái `Chờ phân bổ` mới có thể Chuyển CXLL.** Các lô ở trạng thái khác (`Chờ lập HĐ`, `Chờ giao`, `Đã phân bổ`) tuyệt đối không thể chuyển do đã dính líu đến quy trình đóng gói, lập hóa đơn hoặc giao hàng dở dang.
* **BR-KTP-02 (Vô hiệu hóa thao tác tại giao diện):**
  * Đối với các dòng không phải `Chờ phân bổ`: Nút `[Chuyển CXLL]` hiển thị ở trạng thái disabled kèm tooltip cảnh báo, Checkbox bị disable không cho chọn.
  * Trong Drawer chi tiết: Nút thao tác chuyển cũng bị disable và hiển thị Alert Box cảnh báo.
* **BR-KTP-03 (Trạng thái đích tại Kho CXLL):** Lô sau khi chuyển thành công sẽ xuất hiện tại DS Chờ xử lý lại với trạng thái `Chờ gán đơn` và `SL = SL đã chuyển`. Đồng thời giảm tồn kho thành phẩm sẵn sàng giao tương ứng.
* **BR-KTP-04 (Tách lô khi chuyển SL lẻ):** Khi chuyển số lượng nhỏ hơn tổng tồn của lô (M < Tổng SL), hệ thống tự động trừ tồn lô gốc tại Kho TP và tạo bản ghi phôi mới tại Kho CXLL với số lượng đúng bằng M.
* **BR-KTP-05 (Cơ chế phân tách Series vs Non-Series & Đơn vị Lượng):**
  * **Lô có Series:** Thừa hưởng trực tiếp mã Stamp và trọng lượng từng series có sẵn trên hệ thống. Số lượng series được chọn phải khớp chính xác với số lượng chuyển. Đơn vị chuẩn là Lượng (L).
  * **Lô không có Series (Hàng xá):** Bắt buộc cân lại Tổng TL thực tế (hỗ trợ nút `[Lấy số cân]` tích hợp máy cân điện tử, chuẩn 4 số sau thập phân) và khai báo phân bổ Stamp cho từng pcs. Quy tắc chuẩn: **`Số Stamp = TL Đá × 1000`** (ví dụ: `TL Đá = 0.0004` ➔ `Stamp = 0.4`; `TL Đá = 0.0012` ➔ `Stamp = 1.2`). Tổng SL pcs các stamp bằng số lượng chuyển.
* **BR-KTP-06 (Bảo toàn công thức tính 3 chỉ tiêu trọng lượng):**
  * Luôn tách bạch 3 field: `TL Kim Loại (L)`, `TL Đá (Stamp) (L)`, `Tổng TL (L)`.
  * Công thức bảo toàn: `TL Kim loại = Tổng TL - TL Đá`. Tuyệt đối không cho phép xác nhận chuyển nếu TL Kim loại tính ra bị âm (TL đá > Tổng TL).
* **BR-KTP-07 (Tối giản giao diện modal & Quy chuẩn hiển thị số 0):**
  * Subtitle Header hiển thị trực tiếp `Mã Lô: [Mã Bag]`.
  * Tiêu đề khung trọng lượng rút ngắn: `Trọng lượng chuyển:`.
  * Ô cân lại Tổng trọng lượng hiển thị chuẩn 4 số thập phân `#.####` (ví dụ: `1.5000 L`).
  * Loại bỏ hoàn toàn trường `Vị trí lưu kho` và dòng hiển thị công thức tính để tránh rác thị giác.
  * Đối với các vị trí có giá trị bằng 0: Số lượng hiển thị `0`, trọng lượng hiển thị `0.0000`, tuyệt đối không để dấu `-` hay `—`.

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
| **Tổng SL** | Integer | Có | Kế thừa từ KHSX | Tổng số lượng pcs hoàn thiện trong lô (VD: `10`, `8`, `6`...). |
| **Chờ Phân Bổ** | Integer | Có | Tính theo trạng thái | Số lượng pcs ở trạng thái `Chờ phân bổ` (sẵn sàng chuyển CXLL). Nếu = 0 hiển thị số `0` rõ ràng (không để dấu - hay —). |
| **Chờ Lập Hóa Đơn** | Integer | Có | Tính theo trạng thái | Số lượng pcs ở trạng thái `Chờ lập HĐ`. Nếu = 0 hiển thị số `0` rõ ràng (không để dấu - hay —). |
| **Chờ Giao** | Integer | Có | Tính theo trạng thái | Số lượng pcs ở trạng thái `Chờ giao` cho khách. Nếu = 0 hiển thị số `0` rõ ràng (không để dấu - hay —). |
| **Trạng Thái** | Enum / Badge | Có | `Chờ phân bổ` | Giá trị: `Chờ phân bổ`, `Đã phân bổ`, `Chờ lập HĐ`, `Chờ giao`. |
| **Tổng TL (g)** | Decimal (4 số lẻ) | Có | Kế thừa từ KHSX | Tổng trọng lượng cân được (VD: `5.0000`). |
| **TL Kim Loại (g)** | Decimal (4 số lẻ) | Có | Kế thừa / Tính toán | Trọng lượng kim loại của lô. Nếu = 0 hiển thị `0.0000`. |
| **TL Đá (g)** | Decimal (4 số lẻ) | Có | Kế thừa từ KHSX | Trọng lượng đá của lô. Nếu không có đá hoặc = 0 hiển thị `0.0000` (tuyệt đối không để dấu - hay —). |
| **SL Chuyển (Modal)** | Integer | Có | Bằng Tổng SL | Cho phép nhập số lượng lẻ cần chuyển (1 ≤ SL ≤ Tổng SL), phục vụ AC 4. |
| **Check Series (Modal)** | Boolean | Có | Tự động nhận | Nhận diện lô có series hay không. Nếu có: chọn mã series kèm hiển thị Stamp. Nếu không: cân lại Tổng TL (có nút lấy số cân) và chọn Stamp (Số Stamp = TL Đá × 1000). |
| **TL Kim Loại (L) (Modal)** | Decimal (4 số lẻ) | Có | Tự động tính | Trọng lượng kim loại của phôi chuyển (đơn vị Lượng - L): `TL Kim loại = Tổng TL - TL Đá`. |
| **TL Đá / Stamp (L) (Modal)** | Decimal (4 số lẻ) | Có | Kế thừa / Tính theo Stamp | Trọng lượng đá của phôi chuyển (lấy từ series hoặc tính từ nhóm stamp khai báo). Nếu = 0 hiển thị `0.0000`. |
| **Tổng TL (L) (Modal)** | Decimal (4 số lẻ) | Có | Kế thừa / Cân lại | Tổng trọng lượng cân lại thực tế của phôi chuyển (đơn vị Lượng - L). |
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
    
    OpenModal --> CheckSeries{Lô có Series hay không?}
    CheckSeries -->|Có Series| PickSeries[Chọn mã Series lẻ<br>Kế thừa Stamp & TL từng series]
    CheckSeries -->|Không Series| ManualWeigh[Cân lại Tổng TL trên cân điện tử<br>Chọn mã Stamp: Số Stamp = TL Đá x 1000]
    
    PickSeries --> ConfirmTransfer[Xác nhận chuyển CXLL]
    ManualWeigh --> ConfirmTransfer
    
    ConfirmTransfer --> UpdateStock[Cập nhật hệ thống:<br>• Rút khỏi Tồn kho TP sẵn sàng giao<br>• Đưa sang DS Chờ xử lý lại: /inventory/reprocess<br>• Trạng thái: Chờ gán đơn, SL = SL đã chuyển]
    UpdateStock --> ShowSuccess([Bắn Toast thông báo thành công kèm link mở Kho CXLL])
```
