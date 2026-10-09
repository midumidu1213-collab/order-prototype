# US-DH-04: Chọn Item Trong Kho Thành Phẩm (Chờ Xử Lý Lại) Vào Đơn Hàng & Phân Luồng KHSX

> **Mã Story:** `US-DH-04`  
> **Module:** Quản lý đơn hàng (Sales Order Management) & Kế hoạch sản xuất (Production Planning)  
> **Feature:** Quản lý Cấp Lô Tồn Kho TP Chờ Xử Lý Lại & Gán Routing Cố Định (FG) Tách 2 Luồng KHSX  
> **Phiên bản:** `2.0` | **Trạng thái:** `Sẵn sàng thẩm định (Ready for Review)`  

---

## 1. Tóm tắt User Story (User Story Statement)

*   **AS A:** Nhân viên Kinh doanh (Sales) / Kỹ thuật viên Đơn hàng / Cán bộ Kế hoạch Sản xuất (QLSP)
*   **I WANT TO:** 
    1. Quét và pick chọn hàng từ các **Lô (Lot/Batch)** trong Kho Thành Phẩm (trạng thái Chờ xử lý lại) có thuộc tính khớp 100% (cùng Mã item, cùng Tuổi vàng, Ni tay, Đá) vào đơn hàng mới; hỗ trợ chọn từ nhiều lô khác nhau (nhập số lượng lẻ hoặc chọn hết lô).
    2. Tự động gán **Routing Cố Định (Type: FG)** gồm 2 công đoạn hardcoded: `STG-SERVE-FG: Serve FG` và `STG-PACKING-OUT: Packing Out` cho số lượng lấy từ kho.
    3. Tách Kế hoạch sản xuất (KHSX) thành **2 luồng độc lập**: Luồng Sản Xuất Mới (cho phần số lượng còn lại) và Luồng Kho Thành Phẩm (cho phần số lượng đã pick kho).
*   **SO THAT:** Tối ưu hóa tồn kho thành phẩm có sẵn, rút ngắn chu kỳ giao hàng cho khách, tinh gọn quy trình sản xuất (không phải đúc/nguội/gắn đá lại đối với hàng kho), và minh bạch phân bổ lệnh điều độ tại xưởng.

---

## 2. Bối cảnh & Nguyên tắc Cốt lõi (First Principles)

1.  **Kho Thành Phẩm Chờ Xử Lý Lại (FG Rework Warehouse):** 
    Là kho lưu trữ các sản phẩm hoàn chỉnh từ đơn hàng cũ bị hủy/giảm số lượng hoặc hàng triển lãm. Hàng đạt chuẩn chất lượng xuất xưởng, được quản lý nghiêm ngặt theo **Cấp Lô (Lot Code / Bag Code)** kèm vị trí két lưu trữ.
2.  **3 Bước Luồng Xử Lý Chuẩn Nghiệp Vụ:**
    *   **Bước 1 - Pick Lô:** Kinh doanh chọn lô trong kho thành phẩm cùng item, cùng tuổi vàng. Cho phép pick từ nhiều lô khác nhau (chọn hết lô hoặc gõ số lượng lẻ cho từng lô). Số lượng còn lại sau khi trừ đi phần pick kho sẽ tự động chuyển sang luồng **Sản xuất mới**.
    *   **Bước 2 - Gán Routing Cố Định (Type: FG):** Đối với số lượng pick từ kho, hệ thống tự động gán Routing cố định chỉ gồm 2 công đoạn:
        *   `STG-SERVE-FG: Serve FG (Phục vụ kho TP)`: Điều chuyển hàng từ két kho TP, kiểm tra ngoại quan & ni tay (Thời gian: 0.5 ngày).
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
    ClickOpen --> OpenPopup[6. Hiển thị Popup 'Danh Sách Mặt Hàng Trong Kho TP'<br>Giao diện bổ sung CỘT LÔ HÀNG giữa Mã Item & SL Đặt]
    
    OpenPopup --> PickAction{7. Kinh doanh thao tác chọn Lô}
    PickAction -->|Bấm nút 'Hết lô'| PickMax[Gán SL pick = SL khả dụng của lô đó]
    PickAction -->|Gõ SL lẻ cho từng lô| InputQty[Nhập số lượng: 0 <= SL <= Tồn lô]
    PickAction -->|Chọn nhiều lô cho 1 Item| MultiLots[Cộng dồn SL Pick từ các lô]
    
    PickAction --> ClickConfirm[8. Bấm nút: 'Xác nhận (X món)']
    
    ClickConfirm --> Step1[Bước 1: Tính toán phân bổ số lượng:<br>• SL Kho TP = Tổng pick các lô<br>• SL Còn lại = SL Đặt - SL Kho TP -> Chuyển SX Mới]
    
    Step1 --> Step2[Bước 2: Gán Routing Cố Định Type: FG:<br>• CĐ 1: STG-SERVE-FG: Serve FG<br>• CĐ 2: STG-PACKING-OUT: Packing Out]
    
    Step2 --> Step3[Bước 3: Tách KHSX thành 2 luồng độc lập:<br>• Luồng SX Mới: Full Routing + Cấp mới vàng/đá<br>• Luồng Kho TP: Routing FG + Nhả đá giữ chỗ]
    
    Step3 --> UpdateUI[9. Cập nhật Bảng Dòng Sản Phẩm:<br>• Badge BOM/Routing: '2 Luồng: SX Mới + Kho TP (FG)'<br>• Cột SL Pick Kho TP: 'X / Tổng Đặt'<br>• Click xem Modal Kế Hoạch 2 Luồng]
```

---

## 4. Quy tắc Nghiệp vụ (Business Rules - BR)

| Mã BR | Tên quy tắc | Nội dung quy tắc chi tiết |
| :---: | :--- | :--- |
| **BR-01** | **Điều kiện trạng thái đơn hàng** | Chỉ kích hoạt khi đơn ở trạng thái tiền sản xuất: `Chờ Kỹ thuật`, `Đủ thông tin KT`, hoặc `Chờ xác nhận (Chờ duyệt)`. |
| **BR-02** | **So khớp 100% thuộc tính** | Bắt buộc khớp đồng thời 4 yếu tố: `Mã Item (30 ký tự)`, `Chất liệu & Tuổi vàng`, `Ni tay/Size`, và `Màu đá/Loại đá`. |
| **BR-03** | **Quản lý theo Cấp Lô (Lot/Batch)** | Mỗi bản ghi trong kho thành phẩm được định danh bằng `Mã Lô (LotCode)` và `Túi hàng (BagCode)`. Cho phép 1 Item có nhiều lô tồn với ngày nhập kho, vị trí két và số lượng khác nhau. |
| **BR-04** | **Cơ chế Pick Lô linh hoạt** | Kinh doanh có quyền: (1) Nhập số lượng lẻ cho từng lô; (2) Click nút **"Hết lô"** để pick toàn bộ tồn của lô đó; (3) Chọn kết hợp nhiều lô cho cùng 1 item. Tổng số lượng pick không vượt quá số lượng đặt của dòng đơn hàng. |
| **BR-05** | **Tự động chuyển SL còn lại sang SX Mới** | $\text{SL SX Mới} = \max(0, \text{SL Đặt} - \text{SL Pick Kho})$. Nếu $\text{SL SX Mới} > 0$: Nguồn hàng là `SPLIT_ALLOCATION` (2 luồng). Nếu $\text{SL SX Mới} = 0$: Nguồn hàng là `WAREHOUSE_REWORK` (100% Kho TP). |
| **BR-06** | **Gán Routing Cố Định (Hard 2 Công đoạn - Type: FG)** | Hàng pick từ kho thành phẩm bắt buộc áp dụng mã Routing `RT-FG-FIXED` (Loại: `FG`), gồm đúng 2 công đoạn: `STG-SERVE-FG (Serve FG)` và `STG-PACKING-OUT (Packing Out)`. Tuyệt đối không sinh các công đoạn đúc, làm nguội, gắn đá, xi mạ cho phần hàng kho. |
| **BR-07** | **Phân luồng KHSX (Production Plan Split)** | Khi đơn hàng chuyển sang phân hệ KHSX/Điều độ, hệ thống tự động sinh 2 nhánh lệnh sản xuất con: Nhánh A (SX Mới - Type: NEW_PROD) và Nhánh B (Kho TP - Type: FG) với định mức nguyên vật liệu và tiến độ độc lập. |
| **BR-08** | **Giải phóng giữ chỗ đá (Stone Release)** | Tự động giải phóng đá giữ chỗ tương ứng với số lượng pick từ kho (`PARTIALLY_RELEASED`), tránh chiếm dụng đá tại kho phụ liệu. |
| **BR-09** | **Áp dụng bảng giá tiền công SO mới** | Hàng pick từ kho cũ vẫn áp dụng đơn giá tiền công thỏa thuận theo khách hàng của đơn hàng mới. |
| **BR-10** | **Bảo toàn Ghi chú kỹ thuật** | Cột Ghi chú trên bảng đơn hàng chỉ chứa yêu cầu kỹ thuật riêng, không chèn văn bản pick kho rườm rà. Thông tin pick kho được quản lý tập trung qua cột `SL PICK KHO TP` và danh sách `pickedLots`. |

---

## 5. Đặc tả Giao diện & Trường Dữ liệu (UI / Layout Specifications)

### 5.1. Popup Danh Sách Mặt Hàng Trong Kho TP Chờ Xử Lý (WarehouseSyncPopup)
Vị trí cột được chuẩn hóa chính xác theo yêu cầu thực tế của Chị đẹp:

| STT | Tên cột trên Giao diện | Vị trí / Căn lề | Mô tả hiển thị & Tương tác |
| :---: | :--- | :---: | :--- |
| 1 | **Checkbox** | Căn giữa | Chọn/Bỏ chọn Lô hàng. Có checkbox tổng tại header. |
| 2 | **MÃ ITEM** | Căn trái | Mã Item 30 ký tự (in đậm), Tên sản phẩm, Ni tay và Màu đá. |
| 3 | **LÔ HÀNG (LOT)** | **Căn giữa (Cột thêm mới)** | **Nằm ngay giữa MÃ ITEM và SL ĐẶT** (Khung đỏ). Hiển thị Badge Mã Lô (VD: `LOT-TP-2607-02`), Vị trí két kho bên dưới (VD: `Két K1 - Ngăn A03`). |
| 4 | **SL ĐẶT** | Căn giữa | Số lượng khách đặt tại dòng đơn hàng (VD: `100 món`). |
| 5 | **SỐ LƯỢNG TỒN KHO** | Căn giữa | Badge số lượng tồn khả dụng của lô (VD: `15 món`, `25 món`). |
| 6 | **MÃ ĐƠN HÀNG CŨ** | Căn giữa | Mã SO cũ kèm icon `ⓘ` (Tooltip: Lý do tồn kho & Tên khách hàng cũ). |
| 7 | **NGUYÊN LIỆU - TUỔI VÀNG** | Căn giữa | Nhãn tuổi vàng (VD: `Vàng - 61Y`). |
| 8 | **NGÀY NHẬP KHO** | Căn giữa | Ngày sản phẩm vào kho kèm icon Lịch. |
| 9 | **SL PICK CHỌN** | Căn giữa | Ô nhập số lượng pick lẻ + Nút chọn nhanh **`[Hết lô]`** (tự điền tối đa khả dụng). |

*   **Footer Popup:**
    *   Tóm tắt tổng quan thời gian thực: `Tổng pick kho TP: X món` | `SL còn lại SX mới: Y món`.
    *   Nút **`[Đóng]`** (Hủy thao tác).
    *   Nút **`[Xác nhận (X món)]`** (Thực thi gán kho, áp dụng Routing FG và phân luồng KHSX).

---

### 5.2. Hiển thị Trên Bảng Dòng Sản Phẩm Đơn Hàng (/orders/:id)

1.  **Cột `Trạng thái BOM/Routing`:**
    *   Nếu có pick kho: Hiển thị badge tương tác `2 Luồng: SX Mới + Kho TP (FG)` hoặc `Routing Cố định (FG - 2 CĐ)`. Bấm vào mở ngay **Modal Kế Hoạch Sản Xuất 2 Luồng**.
2.  **Cột `SL Pick Kho TP`:**
    *   Hiển thị tỷ lệ số lượng đã pick dạng `{SL Pick} / {SL Đặt}` kèm icon con mắt `👁️` bấm xem phân bổ các lô.
3.  **Cột `Thao tác`:**
    *   Icon **Hoàn tác `⟲`**: Hủy gán kho cho dòng, đưa số lượng về 100% Sản xuất mới.
    *   Icon **Xóa `🗑️`**: Xóa dòng sản phẩm khỏi đơn hàng.

---

### 5.3. Modal Kế Hoạch Sản Xuất & Phân Bổ 2 Luồng (Production Plan Modal)
Bật lên khi click vào badge Routing hoặc cột SL Pick Kho TP:
*   **Header:** Tiêu đề, Mã SO, Mã Item, Tuổi vàng, Ni tay, Tổng số lượng đặt.
*   **Card Luồng 1 (Sản Xuất Mới - Sky Theme):**
    *   Số lượng sản xuất mới: `qtyNewProduction` món.
    *   Loại Routing: `Routing Tiêu Chuẩn (Full Stages: Đúc → Nguội → Gắn đá → Đánh bóng → Xi mạ → KCS)`.
    *   Kế hoạch vật tư: Cấp mới 100% vàng định mức & đá theo BOM.
*   **Card Luồng 2 (Kho Thành Phẩm - Emerald Theme):**
    *   Số lượng kho thành phẩm: `qtyFromStock` món.
    *   Loại Routing: **Routing Cố Định (Type: FG - Hard 2 Công đoạn)**.
        *   `STG-SERVE-FG`: Serve FG (Phục vụ kho TP) - 0.5 ngày.
        *   `STG-PACKING-OUT`: Packing Out (Đóng gói xuất kho) - 0.5 ngày.
    *   Bảng chi tiết các Lô hàng thực tế đã gán (`lotCode`, `oldOrderCode`, `pickedQty`, `location`).
    *   Vật tư: Không cấp mới vàng/đá; giải phóng đá giữ chỗ về kho phụ liệu.

---

## 6. Tiêu chí Chấp nhận (Acceptance Criteria - Gherkin)

### AC 1: Hiển thị Cột Lô Hàng (Lot) đúng vị trí trong Popup
*   **Given:** Người dùng mở Popup "Danh Sách Mặt Hàng Trong Kho Thành Phẩm Chờ Xử Lý".
*   **Then:** Cột **LÔ HÀNG (LOT)** hiển thị ngay giữa cột **MÃ ITEM** và cột **SL ĐẶT**.
*   **And:** Mỗi dòng lô hiển thị rõ Mã Lô (`LOT-TP-2607-02`), Túi hàng (`BAG-TP-9915`) và Vị trí két lưu trữ.

### AC 2: Chọn từ nhiều lô và nút "Hết lô"
*   **Given:** Một Item có 3 lô tồn kho: Lô A (15 món), Lô B (25 món), Lô C (20 món).
*   **When:** Người dùng bấm nút "Hết lô" tại Lô A.
*   **Then:** Ô SL pick của Lô A tự động điền `15`.
*   **When:** Người dùng nhập `10` tại Lô B và `0` tại Lô C.
*   **Then:** Tổng số lượng pick kho là $15 + 10 = 25$ món.
*   **And:** Số lượng còn lại chuyển sang Sản xuất mới là $100 - 25 = 75$ món.

### AC 3: Gán Routing Cố Định (Type: FG) và Phân 2 Luồng KHSX khi Xác nhận
*   **Given:** Người dùng xác nhận pick 60 món từ kho cho dòng sản phẩm có SL đặt là 100 món.
*   **When:** Bấm nút "Xác nhận (60 món)".
*   **Then:** Dòng sản phẩm cập nhật:
    *   `SL Pick Kho TP` = `60 / 100`.
    *   `Trạng thái BOM/Routing` = `2 Luồng: SX Mới + Kho TP (FG)`.
    *   Routing cho phần 60 món được cố định mã `RT-FG-FIXED` (Type: `FG`) gồm đúng 2 công đoạn `STG-SERVE-FG` và `STG-PACKING-OUT`.
    *   KHSX được tách thành 2 luồng: 40 món SX Mới (Full Routing) và 60 món Kho TP (Routing FG).

### AC 4: Mở Modal xem chi tiết KHSX 2 Luồng từ dòng sản phẩm
*   **Given:** Dòng sản phẩm đã được gán kho thành công.
*   **When:** Người dùng click vào badge Routing `2 Luồng: SX Mới + Kho TP (FG)` hoặc click ô `SL Pick Kho TP`.
*   **Then:** Modal "Kế Hoạch Sản Xuất & Phân Bổ 2 Luồng" bật lên hiển thị rõ ràng 2 Card: Luồng 1 (SX Mới: 40 món, Full Routing, cấp vàng/đá) và Luồng 2 (Kho TP: 60 món, Routing FG 2 công đoạn, danh sách các Lô đã gán).

---

## 7. Definition of Done (DoD)

- [x] Đã đánh giá nghiệp vụ và bổ sung cấp Lô (Lot/Batch Code) theo First Principles.
- [x] Đã hoàn thiện giao diện Popup với cột **LÔ HÀNG (LOT)** giữa Mã Item và SL Đặt.
- [x] Đã hỗ trợ chọn từ nhiều lô (nhập lẻ hoặc chọn hết lô).
- [x] Đã thiết lập Routing cố định (Type: FG, 2 công đoạn: Serve FG & Packing Out).
- [x] Đã phân tách KHSX thành 2 luồng độc lập (SX Mới & Kho TP).
- [x] Đã xây dựng Modal tương tác trực quan xem KHSX 2 luồng trên Prototype.
- [x] Đã kiểm thử đầy đủ luồng end-to-end trên môi trường local và build production.
- [x] Đã đồng bộ tài liệu đặc tả chuẩn BA-Kit vào kho mã nguồn: [`docs/user-stories/US-DH-04-chon-item-kho-thanh-pham-cho-xu-ly-lai.md`](file:///d:/BA/H%E1%BB%8Dc%20AI/order-prototype/docs/user-stories/US-DH-04-chon-item-kho-thanh-pham-cho-xu-ly-lai.md).
