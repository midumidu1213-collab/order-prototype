# US-DH-04: Chọn Item Trong Kho Thành Phẩm (Chờ Xử Lý Lại) Vào Đơn Hàng & Phân Luồng KHSX

> **Mã Story:** `US-DH-04`  
> **Module:** Quản lý đơn hàng (Sales Order Management) & Kế hoạch sản xuất (Production Planning)  
> **Feature:** Quản lý Cấp Lô Tồn Kho TP Chờ Xử Lý Lại (1 Lô ~ 1 Bag ≤ 10 món) & Routing Cố Định (FG) Tách 2 Luồng KHSX  
> **Phiên bản:** `2.1` | **Trạng thái:** `Sẵn sàng thẩm định (Ready for Review)`  

---

## 1. Tóm tắt User Story (User Story Statement)

*   **AS A:** Nhân viên Kinh doanh (Sales) / Kỹ thuật viên Đơn hàng / Cán bộ Kế hoạch Sản xuất (QLSP)
*   **I WANT TO:** 
    1. Quét và pick chọn hàng từ các **Lô (Lot / Bag Code)** trong Kho Thành Phẩm (trạng thái Chờ xử lý lại) có thuộc tính khớp 100% (cùng Mã item, cùng Tuổi vàng, Ni tay, Đá) vào đơn hàng mới.
    2. Phản ánh đúng thực tế xưởng kim hoàn: **1 Lô ~ 1 Bag thường có số lượng không quá 10 món**, do đó 1 Item có thể bao gồm nhiều lô/túi khác nhau. Hệ thống cho phép hiển thị số lượng tồn riêng của từng lô và tùy chọn số lượng pick cho từng lô (gõ số lượng lẻ hoặc chọn hết lô).
    3. Tự động gán **Routing Cố Định (Type: FG)** gồm 2 công đoạn hardcoded: `STG-SERVE-FG: Serve FG` và `STG-PACKING-OUT: Packing Out` cho số lượng lấy từ kho.
    4. Tách Kế hoạch sản xuất (KHSX) thành **2 luồng độc lập**: Luồng Sản Xuất Mới (cho phần số lượng còn lại) và Luồng Kho Thành Phẩm (cho phần số lượng đã pick kho).
*   **SO THAT:** Tối ưu hóa tồn kho thành phẩm có sẵn, rút ngắn chu kỳ giao hàng cho khách, tinh gọn quy trình sản xuất (không phải đúc/nguội/gắn đá lại đối với hàng kho), và hiển thị giao diện thoáng đãng, xem trọn vẹn 100% thông tin các cột.

---

## 2. Bối cảnh & Nguyên tắc Cốt lõi (First Principles)

1.  **Thực tế nghiệp vụ Cấp Lô (Lot/Bag) trong Xưởng Kim Hoàn:** 
    *   Mỗi túi hàng (`BagCode`) hay mỗi lô thành phẩm (`LotCode`) trong kho thành phẩm chờ xử lý lại có quy mô nhỏ, **thường không quá 10 món/lô/túi** (ví dụ: 5 món, 8 món, 6 món, 7 món...).
    *   Do đó, khi khách hàng đặt số lượng lớn (ví dụ: 100 món), một dòng sản phẩm (Item) trong đơn có thể được bù đắp từ **nhiều lô khác nhau** trong kho.
    *   Giao diện bắt buộc phải hiển thị cấu trúc phân cấp: **Item Cha (Tổng tồn & Tổng pick) ➔ Các Lô Con (Chi tiết từng lô ≤ 10 món)**, cho phép người dùng tùy chọn pick theo từng lô.
2.  **3 Bước Luồng Xử Lý Chuẩn Nghiệp Vụ:**
    *   **Bước 1 - Pick Lô:** Kinh doanh chọn lô trong kho thành phẩm cùng item, cùng tuổi vàng. Cho phép pick từ nhiều lô khác nhau (chọn hết lô hoặc gõ số lượng lẻ cho từng lô). Số lượng còn lại sau khi trừ đi phần pick kho sẽ tự động chuyển sang luồng **Sản xuất mới**.
    *   **Bước 2 - Gán Routing Cố Định (Type: FG):** Đối với số lượng pick từ kho, hệ thống tự động gán Routing cố định chỉ gồm 2 công đoạn:
        *   `STG-SERVE-FG: Serve FG (Phục vụ kho TP)`: Điều chuyển hàng từ két kho TP theo mã lô, kiểm tra ngoại quan & ni tay (Thời gian: 0.5 ngày).
        *   `STG-PACKING-OUT: Packing Out (Đóng gói xuất kho)`: Hoàn thiện đóng gói, dán tem vỉ theo SO mới và sẵn sàng xuất giao (Thời gian: 0.5 ngày).
    *   **Bước 3 - Phân Luồng KHSX (2 Workflows):** Khi chuyển sang Kế hoạch Sản xuất, dòng hàng được bóc tách làm 2 luồng công việc rõ ràng:
        *   *Luồng 1 (Sản xuất mới):* Áp dụng Full Routing tiêu chuẩn (Đúc → Nguội → Gắn đá → Đánh bóng → Xi mạ → KCS) kèm cấp mới vàng & đá theo BOM.
        *   *Luồng 2 (Kho TP):* Áp dụng Routing Cố Định (Type: FG, 2 công đoạn), không cấp mới vàng/đá và tự động giải phóng lượng đá giữ chỗ tương ứng về kho phụ liệu.

---

## 3. Sơ đồ Luồng Nghiệp vụ (Mermaid Business Flow)

```mermaid
flowchart TD
    Start([1. Mở Chi tiết Đơn hàng: /orders/:id]) --> CheckStatus{2. Trạng thái đơn hợp lệ?<br>Chờ KT / Đủ TT KT / Chờ xác nhận}
    
    CheckStatus -->|Không hợp lệ| HideBanner[Ẩn Banner & Khóa thao tác pick kho]
    CheckStatus -->|Hợp lệ| ScanStock[3. Hệ thống quét tồn kho khớp 100%:<br>Mã Item, Tuổi vàng, Ni tay, Màu đá]
    
    ScanStock --> HasMatch{Có lô tồn kho khớp &<br>SL khả dụng > 0?}
    HasMatch -->|Không có| TableNormal[Bảng đơn hàng hiển thị bình thường]
    HasMatch -->|Có tồn kho| ShowBanner[4. Hiển thị Banner gợi ý tồn kho theo cấp Lô]
    
    ShowBanner --> ClickOpen[5. Bấm 'Nhấn mở popup xem chi tiết & pick chọn']
    ClickOpen --> OpenPopup[6. Hiển thị Popup Mở Rộng: w-96vw max-w-1550px<br>Hiển thị Master-Detail: Item Cha -> Chi tiết từng Lô con <= 10 món]
    
    OpenPopup --> PickAction{7. Kinh doanh tùy chọn SL từng Lô trong Item}
    PickAction -->|Bấm nút 'Hết lô' tại lô con| PickMaxLot[Gán SL pick = SL tồn của lô đó <= 10]
    PickAction -->|Gõ SL lẻ cho từng lô| InputQtyLot[Nhập số lượng lẻ: 0 <= SL <= Tồn lô]
    PickAction -->|Bấm '⚡ Pick hết lô' tại Item| PickAllLots[Tự động pick toàn bộ các lô của Item]
    
    PickAction --> ClickConfirm[8. Bấm nút: 'Xác nhận pick chọn']
    
    ClickConfirm --> Step1[Bước 1: Tính toán phân bổ số lượng:<br>• SL Kho TP = Tổng pick các lô con<br>• SL Còn lại = SL Đặt - SL Kho TP -> Chuyển SX Mới]
    
    Step1 --> Step2[Bước 2: Gán Routing Cố Định Type: FG:<br>• CĐ 1: STG-SERVE-FG: Serve FG<br>• CĐ 2: STG-PACKING-OUT: Packing Out]
    
    Step2 --> Step3[Bước 3: Tách KHSX thành 2 luồng độc lập:<br>• Luồng SX Mới: Full Routing + Cấp mới vàng/đá<br>• Luồng Kho TP: Routing FG + Nhả đá giữ chỗ]
    
    Step3 --> UpdateUI[9. Cập nhật Bảng Dòng Sản Phẩm:<br>• Badge BOM/Routing: '2 Luồng: SX Mới + Kho TP (FG)'<br>• Cột SL Pick Kho TP: 'X / Tổng Đặt'<br>• Click xem Modal Kế Hoạch 2 Luồng chi tiết từng Lô]
```

---

## 4. Quy tắc Nghiệp vụ (Business Rules - BR)

| Mã BR | Tên quy tắc | Nội dung quy tắc chi tiết |
| :---: | :--- | :--- |
| **BR-01** | **Điều kiện trạng thái đơn hàng** | Chỉ kích hoạt khi đơn ở trạng thái tiền sản xuất: `Chờ Kỹ thuật`, `Đủ thông tin KT`, hoặc `Chờ xác nhận (Chờ duyệt)`. |
| **BR-02** | **So khớp 100% thuộc tính** | Bắt buộc khớp đồng thời 4 yếu tố: `Mã Item (30 ký tự)`, `Chất liệu & Tuổi vàng`, `Ni tay/Size`, và `Màu đá/Loại đá`. |
| **BR-03** | **Đặc tả Cấp Lô (1 Lô / Túi $\le$ 10 món)** | Mỗi bản ghi trong kho thành phẩm được định danh bằng `Mã Lô (LotCode)` và `Túi hàng (BagCode)`. Số lượng tồn của mỗi lô nhỏ $\le 10$ món. Một Item có thể gồm nhiều lô tồn kho với ngày nhập kho và vị trí két khác nhau. |
| **BR-04** | **Cơ chế Tùy chọn SL từng Lô trong Item** | Kinh doanh có quyền: (1) Nhập số lượng lẻ cho từng lô con; (2) Click nút **"Hết lô"** để pick toàn bộ tồn của lô đó; (3) Click nút **"⚡ Pick hết lô"** tại thanh Item để chọn nhanh toàn bộ các lô của Item đó. |
| **BR-05** | **Tự động chuyển SL còn lại sang SX Mới** | $\text{SL SX Mới} = \max(0, \text{SL Đặt} - \text{SL Pick Kho})$. Nếu $\text{SL SX Mới} > 0$: Nguồn hàng là `SPLIT_ALLOCATION` (2 luồng). Nếu $\text{SL SX Mới} = 0$: Nguồn hàng là `WAREHOUSE_REWORK` (100% Kho TP). |
| **BR-06** | **Gán Routing Cố Định (Hard 2 Công đoạn - Type: FG)** | Hàng pick từ kho thành phẩm bắt buộc áp dụng mã Routing `RT-FG-FIXED` (Loại: `FG`), gồm đúng 2 công đoạn: `STG-SERVE-FG (Serve FG)` và `STG-PACKING-OUT (Packing Out)`. Tuyệt đối không sinh các công đoạn đúc, làm nguội, gắn đá, xi mạ cho phần hàng kho. |
| **BR-07** | **Phân luồng KHSX (Production Plan Split)** | Khi đơn hàng chuyển sang phân hệ KHSX/Điều độ, hệ thống tự động sinh 2 nhánh lệnh sản xuất con: Nhánh A (SX Mới - Type: NEW_PROD) và Nhánh B (Kho TP - Type: FG) với định mức nguyên vật liệu và tiến độ độc lập. |
| **BR-08** | **Giải phóng giữ chỗ đá (Stone Release)** | Tự động giải phóng đá giữ chỗ tương ứng với số lượng pick từ kho (`PARTIALLY_RELEASED`), tránh chiếm dụng đá tại kho phụ liệu. |
| **BR-09** | **Bố cục Popup mở rộng toàn diện (Full Information)** | Popup được thiết kế với kích thước rộng rãi `w-[96vw] max-w-[1550px]`, đảm bảo hiển thị trọn vẹn 100% các cột thông tin mà không bị co ép hoặc che khuất cột `SL PICK CHỌN`. |

---

## 5. Đặc tả Giao diện & Trường Dữ liệu (UI / Layout Specifications)

### 5.1. Popup Danh Sách Mặt Hàng Trong Kho TP Chờ Xử Lý (WarehouseSyncPopup)
Kích thước: `w-[96vw] max-w-[1550px]`. Cấu trúc phân cấp Master-Detail:

*   **Thanh Tổng quan Item (Item Header Bar):**
    *   Mã Item, Tên sản phẩm, Ni tay, Màu đá.
    *   Badge tổng số lô: `📁 X lô tồn kho (≤ 10 món/lô)`.
    *   Tổng số lượng đặt: `group.orderQty món`.
    *   Tổng tồn kho của Item: `group.totalStockQty món`.
    *   Tóm tắt phân bổ: `Đã chọn pick: A / B món` | `Còn lại SX mới: C món`.
    *   Nút thao tác nhanh: `[⚡ Pick hết lô]` và `[Bỏ chọn]`.

*   **Bảng Các Dòng Lô Con (Lot Rows - hiển thị dưới Item):**

| STT | Tên cột trên Giao diện | Vị trí / Căn lề | Mô tả hiển thị & Tương tác |
| :---: | :--- | :---: | :--- |
| 1 | **Checkbox** | Căn giữa | Chọn/Bỏ chọn riêng lô này. |
| 2 | **MÃ ITEM & THỨ TỰ LÔ** | Căn trái | Ký hiệu nhánh `↳ Lô 1/6:`, Tên sản phẩm. |
| 3 | **LÔ HÀNG (LOT)** | **Căn giữa (Cột đỏ)** | **Nằm ngay giữa MÃ ITEM và SL ĐẶT**. Badge Mã Lô (`LOT-TP-2607-06`), Vị trí két kho bên dưới (`Két K1 - Ngăn A03`). |
| 4 | **SL ĐẶT** | Căn giữa | Số lượng khách đặt của dòng hàng (VD: `100`). |
| 5 | **SL TỒN CỦA LÔ** | Căn giữa | **Badge số lượng tồn khả dụng của lô ($\le 10$ món, VD: `5 món`, `8 món`, `6 món`).** |
| 6 | **MÃ ĐƠN HÀNG CŨ** | Căn giữa | Mã SO cũ kèm icon `ⓘ` (Tooltip: Túi hàng `bagCode`, Lý do tồn kho & Tên khách hàng cũ). |
| 7 | **NGUYÊN LIỆU - TUỔI VÀNG** | Căn giữa | Nhãn tuổi vàng (VD: `Vàng - 61Y`). |
| 8 | **NGÀY NHẬP KHO** | Căn giữa | Ngày sản phẩm vào kho kèm icon Lịch. |
| 9 | **SL PICK CHỌN (TỪNG LÔ)** | **Căn giữa (Rộng rãi w-56)** | **Ô nhập số lượng pick lẻ + Nút chọn nhanh `[Hết lô]` + Nhãn `/ max X`. Thoải mái, không bị cắt xén.** |

*   **Footer Popup:**
    *   Tổng quan 2 luồng: `Tổng SL cần giao` | `Luồng 1: Kho TP (Routing FG - 2 CĐ)` | `Luồng 2: Sản xuất mới (Full Routing)`.
    *   Nút **`[Đóng]`**.
    *   Nút **`[Xác nhận pick chọn (X món Kho TP + Y món SX mới)]`**.

---

## 6. Tiêu chí Chấp nhận (Acceptance Criteria - Gherkin)

### AC 1: Hiển thị đầy đủ thông tin trên Popup mở rộng
*   **Given:** Người dùng mở Popup "Danh Sách Mặt Hàng Trong Kho Thành Phẩm Chờ Xử Lý".
*   **Then:** Popup hiển thị toàn màn hình với độ rộng `w-[96vw] max-w-[1550px]`.
*   **And:** Toàn bộ 9 cột thông tin từ Checkbox đến Cột `SL PICK CHỌN` đều hiển thị rõ ràng, không bị co ép, không bị cắt cụt.

### AC 2: Phản ánh đúng 1 Lô ~ 1 Bag có SL $\le$ 10 món
*   **Given:** Người dùng quan sát danh sách các lô của Item `Nhẫn Nữ - Ni NNU-015`.
*   **Then:** Cột `SL TỒN CỦA LÔ` hiển thị các túi/lô nhỏ có số lượng: `5 món`, `8 món`, `6 món`, `7 món`, `9 món`, `10 món` (tất cả đều $\le 10$ món).
*   **And:** Thanh Item Header hiển thị tổng số lô là `6 lô tồn kho (≤ 10 món/lô)` với tổng tồn khả dụng là `45 món`.

### AC 3: Tùy chọn SL từng lô và nút "Hết lô"
*   **Given:** Người dùng muốn pick từ các lô của Item `Nhẫn Nữ`.
*   **When:** Bấm nút `Hết lô` tại Lô 1 (5 món) và Lô 2 (8 món).
*   **Then:** Dòng Lô 1 được tick và điền `5`, dòng Lô 2 được tick và điền `8`.
*   **And:** Thanh Item Header tự động cập nhật: `Đã chọn pick: 13 / 100 món (2/6 lô)` và `Còn lại SX mới: 87 món`.

### AC 4: Thao tác "⚡ Pick hết lô" trên Item Header
*   **When:** Người dùng click nút `⚡ Pick hết lô` trên thanh Item Header.
*   **Then:** Toàn bộ 6 lô con được tick chọn và điền tối đa số lượng khả dụng của từng lô (tổng 45 món).
*   **And:** Số lượng còn lại chuyển sang Sản xuất mới được cập nhật ngay: $100 - 45 = 55$ món.

---

## 7. Definition of Done (DoD)

- [x] Đã cấu trúc lại dữ liệu tồn kho: Mỗi lô (bag) có số lượng thực tế $\le 10$ món.
- [x] Đã mở rộng Popup `w-[96vw] max-w-[1550px]` giải quyết triệt để lỗi không xem được full thông tin.
- [x] Đã thiết kế giao diện phân cấp Master-Detail: Item Header Bar + Các Lô con thành phần.
- [x] Đã cho phép tùy chọn số lượng từng lô (gõ lẻ hoặc click Hết lô) và pick nhanh toàn bộ lô của Item.
- [x] Đã gán Routing cố định (Type: FG, 2 công đoạn: Serve FG & Packing Out).
- [x] Đã phân tách KHSX thành 2 luồng độc lập (SX Mới & Kho TP).
- [x] Đã build production `npm run build` thành công và deploy lên Vercel.
- [x] Đã đồng bộ tài liệu đặc tả chuẩn BA-Kit vào kho mã nguồn: [`docs/user-stories/US-DH-04-chon-item-kho-thanh-pham-cho-xu-ly-lai.md`](file:///d:/BA/H%E1%BB%8Dc%20AI/order-prototype/docs/user-stories/US-DH-04-chon-item-kho-thanh-pham-cho-xu-ly-lai.md).
