# TÀI LIỆU QUY ĐỊNH & HƯỚNG DẪN TÁC NGHIỆP: QUẢN LÝ VÀ ĐƯA DRAWING VERSION LÊN E-CATALOGUE (EC)
**Mã tài liệu:** `HDSD-EC-01` | **Hệ thống:** SEVAGO E-Catalogue (EC) & Quản lý Đơn hàng | **Phiên bản:** `1.0`

---

## PHẦN I: THÔNG TIN CHUNG & NỘI DUNG BÀI VIẾT (Article Meta)

### 1. Tên bài hướng dẫn (*)
**Quy định và Quy trình đưa Phiên bản Bản vẽ Thiết kế (Drawing Version) lên Hệ thống E-Catalogue**

### 2. Màn hình áp dụng & Danh mục (*)
* **Màn hình áp dụng:** 
  - Màn hình Quản trị Sản phẩm E-Catalogue (`/admin/catalogue/products`)
  - Màn hình Chi tiết Sản phẩm E-Catalogue dành cho Khách hàng & Sales (`/catalogue/product/[id]`)
  - Màn hình Lập đơn hàng & Đồng bộ Item (`/orders/create`)
* **Danh mục (*):** Quản lý Sản phẩm & Danh mục Chào hàng (E-Catalogue Management)

### 3. Mô tả ngắn (*)
Tài liệu quy định chi tiết tiêu chí phân định, nguyên tắc đặt mã Drawing (11 ký tự) và quy trình chuẩn hóa để đưa các phiên bản thiết kế (Drawing Version) đã phát sinh lên giao diện E-Catalogue. Mục tiêu giúp Khách hàng tham khảo lịch sử cải tiến, Sales nhận biết chính xác các biến thể thay đổi quy trình công nghệ (Routing) và loại trừ triệt để việc tạo version dư thừa cho các tùy biến thuộc tính đơn hàng thông thường (ni, xi, màu đá, loại khóa).

### 4. Video hướng dẫn
* **Tên file video:** `HDSD_Quan_Ly_Drawing_Version_EC_v1.mp4`
* **Thời lượng:** `05:30`
* **Ảnh thumbnail:** `thumb_drawing_version_management.jpg`

---

### 5. Nội dung tổng quát

#### 5.1. MỤC ĐÍCH & PHẠM VI ÁP DỤNG
* **Mục đích:**
  1. **Chuẩn hóa dữ liệu Master Data:** Định nghĩa rõ ràng ranh giới kỹ thuật giữa **Phiên bản Bản vẽ (Drawing Version)** và **Thuộc tính tùy chọn đơn hàng (Attributes/Options)**.
  2. **Minh bạch hóa lịch sử thiết kế:** Hiển thị trực quan các phiên bản tiền nhiệm và cải tiến (thay cast, đắp lacquer, bào ball...) dưới dạng Thumbnail trực quan kèm Tooltip giải thích trên E-Catalogue để Khách hàng và Sales nhận biết ngay lập tức.
  3. **Tối ưu hóa Routing & Định mức sản xuất:** Đảm bảo mỗi Drawing Version trên EC tương ứng 1-1 với một quy trình công nghệ (Routing) và khuôn đúc (Mold/Cast) cụ thể dưới xưởng, tránh sai sót khi xuất lệnh sản xuất (Production Order).
* **Phạm vi áp dụng:**
  - Bộ phận Kỹ thuật Thiết kế 3D CAD & R&D Khuôn mẫu.
  - Bộ phận Quản trị Danh mục Sản phẩm (Master Data Admin / EC Admin).
  - Khối Kinh doanh, Sales Chào hàng B2B, Chăm sóc Khách hàng và Đại lý tiệm vàng.

#### 5.2. QUY ĐỊNH BỔ SUNG & THUẬT NGỮ CHUYÊN MÔN
* **Mã Drawing (Bản vẽ / Khuôn mẫu):** Chuỗi ký tự chuẩn hóa gồm **đúng 11 ký tự** đại diện cho khuôn gốc và kết cấu cơ học của sản phẩm.
  $$\text{Cấu trúc: } \underbrace{\mathbf{XX}}_{\text{Loại món (2)}} + \underbrace{\mathbf{012345}}_{\text{Mã thiết kế gốc (6)}} + \underbrace{\mathbf{X00}}_{\text{Mã Version Drawing (3)}} = 11\text{ ký tự}$$
  *Ví dụ:* `BE012345A00` $\longrightarrow$ `BE012345B01`.
* **Routing sản xuất:** Chuỗi các nguyên công kỹ thuật tuần tự tại xưởng kim hoàn để tạo ra sản phẩm (Đúc $\rightarrow$ Gọt nguội $\rightarrow$ Đắp men Lacquer $\rightarrow$ Vào đá $\rightarrow$ Bào ball $\rightarrow$ Xi mạ $\rightarrow$ KCS).
* **Thay Cast (Khuôn đúc):** Việc can thiệp chỉnh sửa file 3D CAD làm thay đổi kết cấu khuôn thạch cao/silicon, ổ đá, chấu đá hoặc tỷ lệ phân bổ kim loại.
* **Đắp Lacquer men sứ:** Công đoạn xử lý bề mặt bằng men màu chuyên dụng qua sấy nung nhiệt, làm phát sinh công đoạn riêng biệt trong Routing.

#### 5.3. CÁC LUỒNG THỰC HIỆN CHÍNH
1. **Luồng 1 - Thẩm định tiêu chí phát sinh Version:** R&D và Admin kiểm tra thay đổi có làm đổi Routing/Khuôn hay không.
2. **Luồng 2 - Đặt mã Drawing chuẩn hóa (11 ký tự):** Sinh mã Version mới theo quy tắc kế thừa.
3. **Luồng 3 - Cấu hình hiển thị lên E-Catalogue:** Upload ảnh visual phiên bản, cập nhật mã drawing, gán nhãn ngắn và mô tả tooltip kỹ thuật.
4. **Luồng 4 - Tác nghiệp Chào hàng & Đặt hàng của Sales:** Nhận diện phiên bản trên giao diện, tư vấn khách và chốt đơn đúng mã item.

#### 5.4. BÀI VIẾT LIÊN QUAN
* `HDSD-EC-02`: Quy trình cấu hình Sản phẩm Bộ (Jewelry Suites) và Cặp nhẫn cưới trên E-Catalogue.
* `HDSD-DH-04`: Quy chuẩn định dạng Mã Item 30 ký tự và Đồng bộ Tồn kho Thành phẩm.
* `HDSD-SX-01`: Quy định bốc khuôn và điều độ Lệnh sản xuất theo Mã Drawing.

---

## PHẦN II: ĐĂNG & TÀI LIỆU (4 Tabs chuẩn Form Admin)

### TAB 1: CÁC BƯỚC THỰC HIỆN (Milestones)

| Bước | Tiêu đề bước | Mô tả thao tác | Lưu ý | Mốc video |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Xác thực tiêu chí Version (Routing Check)** | Đối chiếu yêu cầu thay đổi với Ma trận phân loại tại Tab 2. Xác định xem thay đổi có can thiệp cấu trúc khuôn (thay cast) hoặc quy trình (đắp lacquer, bào ball) hay không. | Tuyệt đối **KHÔNG** tạo version nếu chỉ thay đổi Ni, màu xi, màu đá hay loại khóa. | `00:30` |
| **2** | **Khởi tạo Mã Drawing 11 ký tự** | Cấp mã Drawing Version mới kế thừa 8 ký tự đầu của mẫu gốc: <br>• Ký tự 9: Ký tự phân nhóm khuôn (`A`, `B`, `C`...). <br>• Ký tự 10-11: Số thứ tự biến thể (`00`, `01`, `02`...). <br>*Ví dụ:* `BE012345A00` nâng cấp đắp men $\rightarrow$ `BE012345A01`. Thay cast ổ đá $\rightarrow$ `BE012345B00`. | Đảm bảo đúng 11 ký tự, không chứa khoảng trắng hay ký tự đặc biệt. | `01:45` |
| **3** | **Chuẩn bị hình ảnh Visual chuẩn EC** | Chụp hoặc Render ảnh sản phẩm thực tế của phiên bản mới theo tỷ lệ 1:1, phông nền trắng xám chuẩn studio SEVAGO, làm nổi bật rõ điểm khác biệt (màu men lacquer, kiểu chấu mới). | Tên file ảnh chuẩn hóa: `[Mã_Drawing]_visual.jpg` để hệ thống tự động nhận diện. | `02:50` |
| **4** | **Cấu hình Version trên Admin E-Catalogue** | Truy cập `Admin > Sản phẩm > Tab Drawing Versions`: <br>1. Nhập Mã Drawing (11 ký tự). <br>2. Nhập Tên phiên bản ngắn (hiển thị dưới thumbnail, tối đa 15 ký tự). <br>3. Nhập Huy hiệu nhận diện (Tag: `Bản vẽ chuẩn`, `Đắp Lacquer`, `Thay Cast`...). <br>4. Nhập Mô tả kỹ thuật Tooltip (tóm tắt thay đổi routing). <br>5. Đính kèm ảnh Thumbnail. | Ghi rõ nguyên nhân thay đổi kỹ thuật để Sales nắm bắt khi hover chuột. | `03:40` |
| **5** | **Kiểm thử hiển thị & Xuất bản (Publish)** | Mở trang chi tiết sản phẩm trên E-Catalogue: <br>• Kiểm tra Thumbnail hiển thị đủ trong thanh chọn dưới ảnh. <br>• Rê chuột kiểm tra Tooltip hiển thị chuẩn xác tên và mô tả. <br>• Click chọn phiên bản và kiểm tra mã sản phẩm (Item Code 30 ký tự) tự động cập nhật đúng phân đoạn Drawing. | Thử nghiệm trên cả giao diện Desktop và Mobile trước khi lưu trạng thái Hoạt động. | `04:50` |

---

### TAB 2: QUY ĐỊNH NGHIỆP VỤ (Business Rules & Prerequisites)

#### Quy định 1: Ma trận Phân định Version (BẮT BUỘC TUÂN THỦ)
Hệ thống phân định nghiêm ngặt 2 nhóm thay đổi sản phẩm:

| STT | Loại thay đổi | Làm đổi Routing? | Đổi khuôn Cast? | Xử lý trên Hệ thống | Ví dụ minh họa |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | **Bản vẽ tiêu chuẩn gốc** | Không (Gốc) | Không (Gốc) | **Version A00 (Gốc)** | `BE012345A00`: Khuôn cast gốc ban đầu |
| **2** | **Đắp men sứ Lacquer** | **CÓ** (Thêm bước đắp & nung men) | Có thể | **TẠO VERSION MỚI** | `BE012345A01`: Đắp men sứ viền hoa văn |
| **3** | **Thay đổi Cast / Ổ chấu đá** | **CÓ** (Thay khuôn đúc, sửa 3D) | **CÓ** | **TẠO VERSION MỚI** | `BE012345B00`: Thay cast ổ 6 chấu sang chấu chìm |
| **4** | **Bào ball viền đá / Chạm khuôn** | **CÓ** (Thêm kỹ thuật chạm khuôn) | **CÓ** | **TẠO VERSION MỚI** | `BE012345C00`: Họa tiết bào bóng viền đá |
| **5** | **Thay đổi Kích thước (Ni/Size)** | **KHÔNG** | **KHÔNG** | **Thuộc tính Kích thước (Options)** | Ni nhẫn 10-18, Ni lắc 15-19, Dây 40-50cm |
| **6** | **Thay đổi Màu xi / Tuổi vàng** | **KHÔNG** (Cùng bể xi tiêu chuẩn) | **KHÔNG** | **Thuộc tính Màu xi / Tuổi vàng** | Vàng, Trắng, Hồng; 10K, 14K, 18K |
| **7** | **Thay đổi Màu đá chính / Đá phụ** | **KHÔNG** (Cùng thông số ổ chấu) | **KHÔNG** | **Thuộc tính Màu đá** | CZ Trắng, Đỏ Ruby, Xanh Emerald |
| **8** | **Đổi loại khóa thông thường** | **KHÔNG** (Khóa phụ kiện ráp sẵn) | **KHÔNG** | **Yêu cầu thay đổi phụ (Change Request)** | Đổi khóa tròn sang khóa càng cua |
| **9** | **Khắc laser tên riêng / ngày cưới** | **KHÔNG** (Công đoạn hoàn thiện phụ) | **KHÔNG** | **Ghi chú sản phẩm (Note)** | Khắc chữ "H & M 2026" |

#### Quy định 2: Quy chuẩn Đặt Mã Drawing (11 ký tự)
* **Ký tự 1-2 (Loại món - Item Type):** `RG` (Nhẫn), `NL` (Dây chuyền), `EG` (Bông tai), `BE` (Lắc tay/Vòng), `ST` (Bộ), `PD` (Mặt dây).
* **Ký tự 3-8 (Mã thiết kế mẫu):** 6 chữ số định danh mẫu độc nhất (ví dụ `012345`, `000001`).
* **Ký tự 9-11 (Phiên bản Drawing):**
  - Ký tự 9 đại diện cho Thế hệ khuôn cast: `A` (Khuôn chuẩn), `B` (Khuôn biến thể 1), `C` (Khuôn biến thể 2)...
  - Ký tự 10-11 đại diện cho Xử lý công nghệ bổ sung: `00` (Không xử lý thêm), `01` (Men Lacquer), `02` (Bào bóng đặc thù)...
  *Mẫu gốc:* `BE012345A00` $\longrightarrow$ *Thêm men:* `BE012345A01` $\longrightarrow$ *Đổi khuôn ổ:* `BE012345B00`.

#### Quy định 3: Ràng buộc tính đồng nhất trong Cấu hình Mã Item 30 ký tự
* Khi Khách hàng hoặc Sales click chọn một Version Drawing trên E-Catalogue, hệ thống **bắt buộc phải tự động cập nhật phân đoạn ký tự 3-13 trong Mã Item 30 ký tự**:
  $$\mathbf{GY0} + \mathbf{[Mã\ Drawing\ 11\ ký\ tự]} + \mathbf{[Phân\ đoạn\ Option\ 16\ ký\ tự]} = 30\text{ ký tự}$$
* *Ví dụ:* 
  - Chọn Version Gốc: `GY0` + `BE012345A00` + `A00CZRO1CZGG1016` = `GY0BE012345A00A00CZRO1CZGG1016`.
  - Chọn Version Đắp Lacquer: `GY0` + `BE012345A01` + `A00CZRO1CZGG1016` = `GY0BE012345A01A00CZRO1CZGG1016`.

#### Quy định 4: Trải nghiệm UI/UX trên E-Catalogue
1. Không hiển thị các phiên bản dưới dạng văn bản dài dòng gây choáng ngợp. Phải sử dụng **Thẻ Thumbnail hình ảnh trực quan (Visual Cards)** đặt ngay dưới ảnh chính sản phẩm.
2. Thẻ phiên bản được chọn phải có **viền xanh Emerald (#00594c), hiệu ứng nổi bật (ring/shadow) và dấu Checkmark nhận diện**.
3. Khi rê chuột (Hover), hệ thống phải hiển thị **Tooltip nổi bật** nêu rõ: `[Mã Version] • [Tên phiên bản]` và dòng mô tả ngắn giải thích sự thay đổi về mặt kỹ thuật/routing.
4. Tại khu vực chọn kích thước cho từng món trong Bộ: hiển thị song hành **[Mã Drawing kỹ thuật]** bên cạnh **[Dropdown chọn Ni]**, giữ nguyên trường **[Trọng lượng]** ở góc phụ.

---

### TAB 3: LỖI THƯỜNG GẶP & CÁCH XỬ LÝ (Troubleshooting)

| STT | Hiện tượng / Tên lỗi | Nguyên nhân | Cách xử lý |
| :---: | :--- | :--- | :--- |
| **1** | **Tạo thừa Drawing Version khi khách đổi màu xi hoặc đổi Ni** | Nhân viên Master Data hiểu nhầm việc đổi xi (Vàng $\rightarrow$ Trắng) hoặc đổi Ni (12 $\rightarrow$ 14) là một phiên bản thiết kế mới. | **Hủy Drawing Version thừa.** Chuyển thông tin màu xi vào dropdown `Màu xi` và thông tin Ni vào dropdown `Kích thước`. Không phát sinh mã drawing mới. |
| **2** | **Mã Drawing không đủ hoặc vượt quá 11 ký tự** | Nhập thiếu số 0 hoặc gõ thừa ký tự (ví dụ gõ `BE01234A00` chỉ 10 ký tự, hoặc `BE00012345A00` 12 ký tự). | Kiểm tra và chuẩn hóa cấu trúc: 2 chữ cái + 6 chữ số + 3 ký tự version = Đúng 11 ký tự (Ví dụ: `BE012345A00`). |
| **3** | **Ảnh Thumbnail phiên bản bị méo hoặc không load được** | Upload ảnh sai tỷ lệ (ảnh chữ nhật dài) hoặc tên file chứa dấu tiếng Việt/khoảng trắng. | Cắt ảnh về tỷ lệ vuông 1:1, dung lượng dưới 500KB, lưu tên file không dấu dạng `drawing_BE012345B01.jpg`. |
| **4** | **Click đổi phiên bản nhưng mã Item 30 ký tự không đổi** | Cấu hình liên kết giữa Version ID và Drawing Code trong cơ sở dữ liệu bị ngắt quãng. | Kiểm tra lại trường `drawingCode` trong cấu hình Drawing Versions của sản phẩm trong file `catalogueData.js` hoặc cơ sở dữ liệu Master Data. |
| **5** | **Khách hàng không phân biệt được sự khác nhau giữa các version** | Tên phiên bản hoặc mô tả Tooltip ghi chung chung (ví dụ chỉ ghi "Bản vẽ 2", "Mẫu mới"). | Cập nhật lại tên và mô tả kỹ thuật rõ ràng: Ví dụ `A01 • Đắp Lacquer men sứ` kèm mô tả `Đắp men sứ viền hoa văn (thay đổi routing)`. |

---

### TAB 4: BIỂU MẪU ĐÍNH KÈM (Attached Documents)

| STT | Tên tài liệu / Biểu mẫu | Định dạng | Dung lượng | Mục đích sử dụng |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `BM-EC-01_Phieu_De_Xuat_Tao_Drawing_Version.docx` | DOCX | 145 KB | Biểu mẫu dành cho R&D/Kỹ thuật đề xuất tạo version mới khi thay đổi khuôn cast/routing. |
| **2** | `BM-EC-02_Bang_Ma_Tran_Phan_Dinh_Routing_Sevago.xlsx` | XLSX | 320 KB | File bảng tính tra cứu nhanh các nguyên công làm đổi routing để kiểm tra tự động. |
| **3** | `Spec_Drawing_Code_Standard_11_Digits.pdf` | PDF | 510 KB | Tài liệu quy chuẩn kiến trúc mã 11 ký tự và mã Item 30 ký tự toàn hệ thống SEVAGO. |

---
*Tài liệu được ban hành chính thức bởi Ban Quản lý Chất lượng và Bộ phận Phân tích Nghiệp vụ (BA) - SEVAGO.*
