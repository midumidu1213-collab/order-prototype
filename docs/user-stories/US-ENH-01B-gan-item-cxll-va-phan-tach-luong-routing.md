# US-ENH-01B: Gán Item CXLL Vào Đơn Hàng & Phân Tách 2 Luồng SX Mới vs Chuyển Đơn

> **Mã Story:** `US-ENH-01B`  
> **Epic:** Task cải tiến / US-ENH-01: Chọn Item Trong Kho Thành Phẩm (Chờ Xử Lý Lại) Vào Đơn Hàng  
> **Module / Feature:** Quản Lý Đơn Hàng & KHSX / Phân Tách Luồng & Chuyển Thông Tin BOM/Routing Sang KHSX  
> **Actor chính:** Nhân viên xử lý đơn hàng (Sale Admin) / Sale / Kỹ sư Kế hoạch sản xuất (Production Planner)  
> **Tài liệu tham chiếu:** [Prototype Chi Tiết Đơn Hàng: /orders/SO2608011](https://dungseva.vercel.app/orders/SO2608011) | [Trạm Cấp TP Serve FG: /inventory/reprocess/serve](https://dungseva.vercel.app/inventory/reprocess/serve)  
> **Trạng thái:** `Ready for Confluence Publish`  

---

## 1. USER STORY *

* **Là một (As a):** Nhân viên xử lý đơn hàng (Sale Admin) / Sale
* **Tôi muốn (I want):** 
    1. Khi một dòng hàng trên đơn (SO) được xác nhận gán phôi từ Kho CXLL, hệ thống tự động phân tách dòng hàng thành 2 luồng sản xuất độc lập:
       * **Luồng 1 (Sản xuất mới):** Áp dụng cho phần số lượng thiếu hụt khách đặt vượt quá tồn kho CXLL (`SL SX Mới = SL Đặt - SL Pick CXLL`).
       * **Luồng 2 (Chuyển đơn phôi CXLL):** Áp dụng cho phần số lượng đã pick từ kho CXLL (`SL Chuyển Đơn = SL Pick CXLL`).
    2. Tự động áp cấu hình BOM & Routing chuẩn xác cho từng luồng:
       * **Với Luồng Sản Xuất Mới:** Gán BOM & Routing thành phẩm chuẩn xưởng kim hoàn.
       * **Với Luồng Chuyển Đơn:** Gán **BOM Chuyển Đơn = 0** và **Routing Chuyển Đơn** (tự động lấy theo cấu hình từ phân hệ Quản Lý Sản Phẩm - QLSP dựa vào: **Chủng loại - Nguyên liệu - Tuổi vàng**).
    3. Khi bấm **`[Chuyển KHSX]`**: Hệ thống chuyển toàn bộ thông tin dòng hàng sang phân hệ KHSX với thông tin BOM/Routing tương ứng với item SX mới hoặc item CXLL chuyển đơn.
* **Để (So that):** Đảm bảo lệnh sản xuất xuống xưởng chính xác 100%, không bị xuất trùng nguyên vật liệu vàng/đá (do BOM chuyển đơn = 0), tận dụng tối đa phôi sẵn có và điều phối dây chuyền xưởng tinh gọn, không qua các khâu đúc/gắn đá thừa thãi.

---

## 2. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC) *

* **AC 1: Tự động phân tách 2 luồng sản xuất trên dòng hàng**
  * **Given (Biết rằng):** Khách đặt dòng hàng với số lượng K pcs (ví dụ: 10 pcs).
  * **When (Khi):** Người dùng xác nhận pick M pcs từ Kho CXLL (với 0 < M < K, ví dụ pick 3 pcs CXLL).
  * **Then (Thì):** Hệ thống tự động phân tách dòng hàng thành 2 phân luồng:
    * `Luồng 1 (Sản xuất mới)`: (K - M) pcs (ví dụ: 7 pcs).
    * `Luồng 2 (Chuyển đơn phôi CXLL)`: M pcs (ví dụ: 3 pcs).
  * **And (Và):** Nếu M = K (pick đủ 100% số lượng từ kho CXLL): Dòng hàng chuyển 100% sang Luồng Chuyển Đơn (0 pcs Sản xuất mới).

* **AC 2: Gán BOM & Routing cho Luồng Chuyển Đơn Phôi CXLL**
  * **Given (Biết rằng):** Phân luồng Chuyển đơn có số lượng M pcs lấy từ Kho CXLL.
  * **Then (Thì):** Hệ thống tự động áp cấu hình Chuyển đơn:
    * **BOM Chuyển Đơn: 0** (Định mức cấp phát vật tư bằng 0, không xuất vàng hạt đúc mới và đá mới vì kế thừa 100% phôi cũ).
    * **Routing Chuyển Đơn:** Tự động gán Routing chuyển đơn cấu hình từ QLSP (lấy theo Chủng loại - Nguyên liệu - Tuổi vàng), tương ứng quy trình tinh giản 5 bước (Routing 2A):
      1. `WC-0111: Serve FG` (Trạm cấp thành phẩm - chuyển phôi từ Bag cũ sang Bag mới)
      2. `WC-0013: Stamping` (Khắc logo/ký hiệu đơn mới, kiểm tra stamp đá: `Số Stamp = TL Đá × 1000`, tẩy xi cũ)
      3. `WC-0020: Polishing` (Đánh bóng làm mới)
      4. `WC-0153: Platting` (Xi mạ theo màu yêu cầu của đơn mới)
      5. `WC-0147: Packing in` (Kiểm tra chất lượng FQC và đóng gói Thẻ Bag mới)

* **AC 3: Hiển thị minh bạch trên giao diện Quản Lý Đơn Hàng**
  * **Given (Biết rằng):** Dòng hàng đã được gán item CXLL.
  * **Then (Thì):** Bảng chi tiết đơn hàng hiển thị trực quan:
    * **Cột Số lượng:** Hiển thị 3 chỉ số tách bạch: `Tổng số lượng`, `SL SX mới` và `SL Gán từ Kho` (SL Chuyển đơn).
    * **Cột Trạng thái BOM/Routing:** Hiển thị rõ trạng thái cấu hình của cả 2 luồng: BOM/Routing SX mới và Routing Chuyển đơn.

* **AC 4: QLĐH chuyển thông tin BOM/Routing xuống KHSX**
  * **Given (Biết rằng):** Dòng hàng đã được gán phôi và phân luồng trên màn hình chi tiết đơn hàng (`/orders/[id]`).
  * **When (Khi):** Cán bộ QLĐH bấm nút **`[Chuyển KHSX]`**.
  * **Then (Thì):** Hệ thống chuyển toàn bộ hồ sơ kỹ thuật (thông tin dòng hàng, số lượng phân tách từng luồng, cấu hình BOM và Routing tương ứng) sang phân hệ KHSX.
  * **And (Và):** Trạng thái dòng đơn chuyển sang `Đã chuyển KHSX`. QLĐH không tự sinh Bag và không can thiệp điều phối kho.

* **AC 5: KHSX tiếp nhận, sinh Thẻ Bag và đẩy lệnh Serve FG xuống Kho Thành Phẩm**
  * **Given (Biết rằng):** Kế hoạch sản xuất (KHSX) tiếp nhận hồ sơ kỹ thuật từ QLĐH.
  * **When (Khi):** Kỹ sư KHSX kiểm tra năng lực và bấm phê duyệt kế hoạch sản xuất:
  * **Then (Thì):** KHSX là bộ phận chính thức:
    * Sinh Thẻ Bag SX Mới gửi sang Xưởng Đúc.
    * Sinh Thẻ Bag Chuyển Đơn (gán mã Bag mới, liên kết với Bag phôi cũ tại Kho CXLL).
    * Đẩy lệnh `Serve FG` xuống Kho Thành Phẩm: Kích hoạt dòng phôi tại Kho CXLL chuyển trạng thái từ `Đã giữ chỗ` sang **`Chờ chuyển bag`** và xuất hiện tại màn hình Trạm Cấp Thành Phẩm (`/inventory/reprocess/serve`).

---

## 3. QUY TẮC NGHIỆP VỤ (BUSINESS RULES) *

* **BR-ALLOC-01 (Quy tắc phân luồng dòng hàng):**
  * Khi `SL Đặt > SL Pick CXLL`: Bắt buộc tách làm 2 luồng độc lập (`Sản xuất mới` và `Chuyển đơn`).
  * Khi `SL Đặt = SL Pick CXLL`: 100% dòng hàng chuyển sang Luồng Chuyển Đơn.
* **BR-ALLOC-02 (Quy tắc BOM Chuyển Đơn = 0):**
  * Định mức cấp phát vật tư của **BOM Chuyển Đơn bắt buộc bằng 0** đối với kim loại vàng đúc và đá phụ liệu.
  * Toàn bộ trọng lượng kim loại và đá của phôi được kế thừa nguyên trạng từ Kho CXLL, ngăn chặn tuyệt đối việc xuất trùng vật tư từ kho nguyên liệu.
* **BR-ALLOC-03 (Routing Chuyển Đơn cấu hình từ QLSP):**
  * Routing Chuyển đơn không nhập thủ công mà được hệ thống tự động map từ danh mục cấu hình trong phân hệ Quản Lý Sản Phẩm (QLSP) dựa trên bộ thuộc tính: **Chủng loại - Nguyên liệu - Tuổi vàng**.
  * Bắt buộc bỏ qua các khâu đúc và gắn đá: Bắt đầu từ trạm `WC-0111: Serve FG` và `WC-0013: Stamping` để đối soát Stamp đá (`Số Stamp = TL Đá × 1000`) trước khi đánh bóng và xi mạ lại.
* **BR-ALLOC-04 (Ranh giới trách nhiệm QLĐH vs KHSX):**
  * QLĐH chỉ có thẩm quyền bàn giao thông tin cấu hình dòng hàng (Số lượng phân luồng, BOM/Routing) sang KHSX.
  * KHSX là bộ phận duy nhất có thẩm quyền sinh mã Thẻ Bag (Work Order) và phát lệnh xuất phôi `Serve FG` xuống Kho Thành Phẩm.
* **BR-ALLOC-05 (Chuyển trạng thái Kho CXLL sang Chờ chuyển bag):** Dòng phôi tại Kho CXLL chỉ chuyển từ `Đã giữ chỗ` sang `Chờ chuyển bag` khi KHSX chính thức phê duyệt kế hoạch sản xuất và sinh Thẻ Bag (không chuyển ngay khi QLĐH mới bấm chuyển KHSX).

---

## 4. THIẾT KẾ (UX/UI) *

* **Link Prototype Chi Tiết Đơn Hàng:** [https://dungseva.vercel.app/orders/SO2608011](https://dungseva.vercel.app/orders/SO2608011)
* **Link Prototype Trạm Cấp Thành Phẩm:** [https://dungseva.vercel.app/inventory/reprocess/serve](https://dungseva.vercel.app/inventory/reprocess/serve)

---

## 5. DANH MỤC DỮ LIỆU & RÀNG BUỘC (DATA DICTIONARY)

### 5.1 Cấu Trúc Phân Luồng Trên Dòng Hàng Đơn (SO Line Item)

| Fields (Tên trường) | Type (Kiểu dữ liệu) | Required | Default value | Rules (Quy tắc & Nghiệp vụ) |
| :--- | :--- | :---: | :--- | :--- |
| **Trạng Thái KHSX** | Enum / Badge | Có | `Chờ duyệt KHSX` | `Chờ duyệt KHSX` ➔ `Đã chuyển KHSX` (KHSX tiếp nhận sẽ lập kế hoạch và sinh 2 Thẻ Bag). |
| **Hình ảnh** | Image | Có | Kế thừa từ Drawing | Hình ảnh Drawing của sản phẩm. |
| **Mã Item** | Dropdown | Có | Kế thừa | Item khi thêm vào đơn hàng sẽ là item gốc. |
| **Mã Drawing** | Dropdown | Có | Kế thừa | Nhập mã Drawing hoặc quét Barcode để lấy thông tin. |
| **Màu xi** | Dropdown | Có | Màu xi gốc | Mặc định lấy màu xi gốc từ Drawing sản phẩm. |
| **Màu đá** | Dropdown | — | Màu đá gốc (nếu có) | Mặc định lấy màu đá (chính) gốc từ Drawing sản phẩm. |
| **Kích thước** | Dropdown | — | Kế thừa | Size / Ni tay sản phẩm. |
| **Yêu cầu thay đổi** | Text | — | Trống | Ghi chú cụ thể yêu cầu khách hàng. |
| **Trọng lượng** | Decimal (4 số lẻ) | — | `0.0000` | Trọng lượng vàng dự kiến trên 1 sản phẩm. |
| **Đơn giá** | Decimal (3 số lẻ) | — | `0.000` | Đơn giá công tạm tính. |
| **Số lượng đặt** | Integer | Có | `1` | Tổng số lượng khách đặt (> 0). |
| **SL Sản Xuất Mới** | Integer | Có | Tự tính | `Tổng SL Đặt - SL Pick CXLL`. Nếu = 0 hiển thị `0`. |
| **SL Chuyển đơn CXLL**| Integer | Có | Kế thừa từ Popup | Số lượng phôi lấy từ Kho CXLL. Nếu = 0 hiển thị `0`. |
| **BOM SX Mới** | Object / JSON | Điều kiện | BOM Chuẩn | Gán định mức vàng đúc mới + đá phụ liệu (khi SL SX Mới > 0). |
| **BOM Chuyển Đơn** | Decimal / Zero | Điều kiện | `0` | **BOM Chuyển Đơn = 0** (không xuất vàng đúc, không xuất đá). |
| **Routing SX Mới** | Text / Enum | Điều kiện | `ROUTING-STD` | Quy trình đúc mới chuẩn (6 bước). |
| **Routing Chuyển Đơn**| Text / Enum | Điều kiện | Tự động từ QLSP | Quy trình chuyển đơn lấy từ QLSP theo Chủng loại - Nguyên liệu - Tuổi vàng (Routing 2A - 5 bước). |

---

## 6. LUỒNG NGHIỆP VỤ LIÊN THÔNG (MERMAID FLOW)

```mermaid
flowchart TD
    subgraph SALES [1. PHÂN HỆ QUẢN LÝ ĐƠN HÀNG - QLĐH]
        Start([Tiếp nhận kết quả pick phôi từ US-ENH-01A]) --> CheckSplit{Tổng SL Đặt > SL Pick CXLL?}
        CheckSplit -- Có chênh lệch --> DualFlow[Tách dòng hàng thành 2 Luồng Kép]
        CheckSplit -- Pick đủ 100% --> SingleTransfer[100% dòng hàng thuộc Luồng Chuyển Đơn]
        
        DualFlow --> FlowNew[Luồng Sản Xuất Mới:<br>SL = SL Đặt - SL CXLL]
        FlowNew --> AssignStd[Gán BOM Đúc Mới + Đá Mới<br>Gán Routing Chuẩn 6 Bước]
        
        DualFlow --> FlowTransfer[Luồng Chuyển Đơn:<br>SL = SL Pick CXLL]
        SingleTransfer --> FlowTransfer
        FlowTransfer --> AssignTransfer[Gán BOM Chuyển Đơn = 0<br>Gán Routing Chuyển Đơn từ QLSP: 5 Bước]
        
        AssignStd --> UpdateSOView[Cập nhật bảng đơn hàng: Hiển thị 3 cột SL & Trạng thái BOM/Routing]
        AssignTransfer --> UpdateSOView
        
        UpdateSOView --> SendToKHSX[Bấm nút: Chuyển KHSX<br>Bàn giao toàn bộ thông tin dòng hàng + BOM + Routing]
    end

    subgraph KHSX [2. PHÂN HỆ KẾ HOẠCH SẢN XUẤT - KHSX]
        SendToKHSX --> ReceiveKHSX[KHSX tiếp nhận hồ sơ đơn từ QLĐH]
        ReceiveKHSX --> PlanProduction[Lên kế hoạch sản xuất & Điều phối xưởng]
        PlanProduction --> ApproveAndGenBag[KHSX Duyệt Kế Hoạch & Sinh Thẻ Bag:<br>• Sinh Bag SX Mới gửi Xưởng Đúc<br>• Sinh Bag Chuyển Đơn liên kết Bag phôi cũ]
        ApproveAndGenBag --> PushServeFG[KHSX phát lệnh Serve FG xuống Kho Thành Phẩm]
    end

    subgraph WAREHOUSE [3. PHÂN HỆ KHO THÀNH PHẨM]
        PushServeFG --> UpdateCXLLStatus[Kho CXLL: Dòng phôi chuyển sang trạng thái 'Chờ chuyển bag']
        UpdateCXLLStatus --> EndServeFG([Đồng bộ sang US-KTP-03: Trạm Cấp TP Serve FG để xuất phôi sang Bag mới])
    end
```
