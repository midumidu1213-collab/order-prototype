"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GitCommit,
  ArrowRight,
  ArrowDown,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Boxes,
  Factory,
  ShoppingCart,
  Warehouse,
  Printer,
  Sparkles,
  ExternalLink,
  Info,
  X,
  Zap,
  CornerDownRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  Tag,
  ArrowRightLeft,
  Truck,
  FileCheck,
  HelpCircle,
  Database
} from "lucide-react";

// DỮ LIỆU ĐẶC TẢ CHI TIẾT CÁC BƯỚC CHO CÁC LUỒNG
const WORKFLOW_STEPS_DATA = {
  // DANH SÁCH BƯỚC CỦA LUỒNG HỦY ĐƠN (GỘP CẢ 2 NHÁNH)
  cancel_all: [
    {
      id: "cancel-step-start",
      number: "1.0",
      title: "Khách Hàng Yêu Cầu Hủy Đơn",
      module: "KH",
      moduleName: "Khách Hàng B2B",
      actor: "Khách Hàng (Đại lý / Cửa hàng vàng)",
      screen: "Thông báo từ khách qua Zalo, Email, Điện thoại hoặc cổng E-Catalogue",
      description: "Khách hàng gửi yêu cầu hủy một phần hoặc toàn bộ số lượng sản phẩm của đơn hàng SO gốc.",
      prerequisites: "Đơn hàng đã được tạo trên hệ thống.",
      actions: [
        "Khách liên hệ nhân viên kinh doanh phụ trách.",
        "Nêu rõ lý do hủy (đổi mẫu mã, giảm ngân sách, sai ni tay...).",
        "Khai báo danh sách món hàng / số lượng cần hủy."
      ],
      dataTransition: {
        soCode: "SO Đơn Hàng Gốc",
        bagCode: "Các mã món cần hủy",
        customerStatus: "Khách gửi yêu cầu hủy",
        workCenter: "Kinh Doanh",
        systemState: "Chờ QLĐH tiếp nhận"
      },
      rules: ["Ghi nhận đầy đủ thời điểm khách yêu cầu để làm căn cứ xử lý."]
    },
    {
      id: "cancel-step-init",
      number: "1.1",
      title: "QLĐH Tiếp Nhận & Lập YC Hủy Đơn",
      module: "KD",
      moduleName: "Kinh Doanh (QLĐH)",
      actor: "Nhân viên Bán hàng / QLĐH",
      screen: "Quản Lý Đơn Hàng → Tạo Yêu Cầu Hủy (/cancel-requests/create)",
      description: "QLĐH tiếp nhận yêu cầu từ khách hàng, chọn đơn hàng SO, chọn sản phẩm và nhập số lượng cần hủy. Quy trình được tinh giản tối đa: QLĐH không phải trực tiếp sửa Phiếu giao hàng (DO) tại đây. Hệ thống tự động phát thông báo đến User Đóng gói và Kho TP sau khi Base duyệt.",
      prerequisites: "Có yêu cầu hủy từ khách hàng.",
      actions: [
        "Mở màn hình Quản Lý Yêu Cầu Hủy Đơn → Tạo YC (/cancel-requests/create).",
        "Chọn đơn hàng cần hủy, chọn sản phẩm và nhập số lượng hủy.",
        "Hệ thống hiển thị trạng thái phát sinh DO để tham khảo (nếu có).",
        "Khai báo lý do hủy và gửi trình duyệt Base (Form A hoặc Form B)."
      ],
      dataTransition: {
        soCode: "SO2608001 / SO2608002",
        bagCode: "Danh sách món hủy",
        customerStatus: "Đang xử lý yêu cầu hủy",
        workCenter: "Kinh Doanh",
        systemState: "Tạo YC thành công → Chuyển tiếp Base Request"
      },
      rules: [
        "Cho phép hủy linh hoạt số lượng món hoặc toàn bộ đơn.",
        "QLĐH không bị ép sửa DO tại khâu tạo YC; nhiệm vụ sửa DO do User Đóng gói đảm trách sau duyệt."
      ]
    },
    {
      id: "cancel-step-form-a",
      number: "1.2A",
      title: "Gửi Base Request Form Type A (Hủy Nội Bộ KD)",
      module: "BASE",
      moduleName: "Hệ Thống Base Request (Form Type A)",
      actor: "Trưởng phòng Kinh doanh (TPKD) / Giám đốc Kinh doanh (GĐKD)",
      screen: "Ứng dụng Base Request / Base Workflow (Form Type A)",
      description: "Áp dụng cho đơn CHƯA chuyển KHSX. Chỉ cần cấp thẩm quyền nội bộ Kinh doanh duyệt thỏa thuận thương mại/cọc. Không cần KHSX hay Kho tham gia.",
      prerequisites: "Đơn hàng chưa bấm chuyển KHSX.",
      actions: [
        "Hệ thống tự động chuyển tiếp YC lên Base Form Type A.",
        "TPKD / GĐKD xem xét lý do và chính sách cọc.",
        "Bấm 'Chấp thuận' (Approved) hoặc 'Từ chối'."
      ],
      dataTransition: {
        soCode: "SO Chưa Chuyển KHSX",
        bagCode: "Không phát sinh Bag SX",
        customerStatus: "Duyệt nội bộ KD",
        workCenter: "Base Request",
        systemState: "Base Form Type A Approved"
      },
      rules: ["Tuyệt đối không gửi sang KHSX hay Kho để tránh rườm rà thủ tục."]
    },
    {
      id: "cancel-step-form-b",
      number: "1.2B",
      title: "Gửi Base Request Form Type B (Hủy Đơn KHSX/Kho)",
      module: "BASE",
      moduleName: "Hệ Thống Base Request (Form Type B)",
      actor: "GĐKD + GĐSX / Trưởng KHSX + Quản Lý Kho TP",
      screen: "Ứng dụng Base Request / Base Workflow (Form Type B)",
      description: "Áp dụng cho đơn ĐÃ chuyển KHSX. Cần thẩm quyền liên phòng ban duyệt để đánh giá chi phí dở dang (WIP), tiền công, vàng/đá và phương án xử lý hàng.",
      prerequisites: "Đơn hàng đã bấm chuyển KHSX.",
      actions: [
        "Hệ thống sinh phiếu Base Form Type B kèm thông tin đơn hàng và mã item hủy.",
        "KHSX xác nhận tiến độ xưởng; Kho và Giao Nhận xác nhận phương án tiếp nhận.",
        "Các bên cùng bấm 'Chấp thuận' (Approved) trên Base."
      ],
      dataTransition: {
        soCode: "SO Đã Chuyển KHSX",
        bagCode: "SO-260800061...",
        customerStatus: "Base liên phòng ban đã duyệt",
        workCenter: "Base Request",
        systemState: "Base Form Type B Approved → Kích hoạt Cập nhật SO & Phát 2 Thông Báo"
      },
      rules: ["Sau khi Base duyệt, hệ thống tự động kích hoạt cập nhật SO và phát thông báo song song."]
    },
    {
      id: "cancel-step-update-so-a",
      number: "1.3A",
      title: "QLĐH Cập Nhật SO Gốc (Nội Bộ KD)",
      module: "KD",
      moduleName: "Kinh Doanh (QLĐH)",
      actor: "Hệ thống ERP QLĐH Tự Động",
      screen: "Chi Tiết Đơn Hàng SO (/orders/[id])",
      description: "ERP tự động cập nhật số liệu SO gốc: Tăng SL Đã Hủy, tính lại SL Còn Lại = SL Đặt - SL Hủy. Hoàn tất quy trình hủy nội bộ KD, không tác động kho.",
      prerequisites: "Base Form Type A đã được phê duyệt.",
      actions: [
        "Hệ thống cập nhật lại các chỉ số số lượng trên SO gốc.",
        "Giải phóng hạn mức công nợ hoặc cọc theo quy định.",
        "Ghi nhật ký đơn hàng và kết thúc luồng."
      ],
      dataTransition: {
        soCode: "SO Gốc (Cập nhật)",
        bagCode: "Không có",
        customerStatus: "Đã đối soát giá trị đơn hàng mới",
        workCenter: "Kinh Doanh",
        systemState: "Hoàn tất hủy đơn nội bộ KD"
      },
      rules: ["Không xóa đơn gốc, lưu vết lịch sử đầy đủ."]
    },
    {
      id: "cancel-step-update-so-b",
      number: "1.3B",
      title: "Base Duyệt: Cập Nhật SL SO & Bắn 2 Thông Báo Song Song",
      module: "KD",
      moduleName: "Kinh Doanh (QLĐH) & Hệ Thống",
      actor: "Hệ thống ERP Tự Động",
      screen: "Chi Tiết Đơn Hàng SO & Trung Tâm Thông Báo",
      description: "Khi Base Form Type B được phê duyệt, hệ thống ERP tự động: (1) Cập nhật số lượng SO gốc (SL Đặt, SL Hủy, SL Còn lại); (2) Phát 2 thông báo song song: Bắn thông báo đến User (Đóng gói) để cập nhật/hủy Phiếu giao hàng (DO), và Bắn thông báo đến Kho Thành Phẩm để chuyển các item bị hủy sang DS chờ xử lý lại.",
      prerequisites: "Base Form Type B đã được phê duyệt.",
      actions: [
        "Cập nhật SL Đặt, SL Hủy, SL Còn Lại của SO gốc.",
        "Bắn thông báo đến User (Đóng gói): Yêu cầu kiểm tra & điều chỉnh/hủy Phiếu giao hàng (DO).",
        "Bắn thông báo đến Kho Thành Phẩm: Yêu cầu chuyển các item bị hủy sang DS Chờ xử lý lại (CXLL)."
      ],
      dataTransition: {
        soCode: "SO Gốc (Đã cập nhật SL)",
        bagCode: "SO-260800061...",
        customerStatus: "Đã trừ số lượng hủy",
        workCenter: "Hệ Thống ERP Tự Động",
        systemState: "SO Cập nhật SL + Bắn 2 Thông Báo Song Song (Đóng Gói & Kho TP)"
      },
      rules: [
        "Đảm bảo cập nhật SO tức thì và truyền thông tin minh bạch, độc lập giữa Đóng gói và Kho."
      ]
    },
    {
      id: "cancel-step-wip-run",
      number: "1.4B-WIP",
      title: "Tiếp Tục Sản Xuất Chạy Đến Packing Kho TP",
      module: "SX",
      moduleName: "KHSX & Xưởng Thực Thi (MES)",
      actor: "Quản đốc Xưởng / Thợ Kim Hoàn",
      screen: "Hệ Thống Thực Thi Sản Xuất (MES)",
      description: "Item đang trong chuyền sản xuất (đúc, nguội, gắn đá) TUYỆT ĐỐI KHÔNG DỪNG NGANG. Chuyền tiếp tục gia công hoàn tất đến công đoạn Packing (Kho TP), sau đó chuyển thẳng sang Kho CXLL.",
      prerequisites: "Item thuộc SO hủy đang ở trạng thái 'Đang sản xuất' (WIP).",
      actions: [
        "Xưởng tiếp tục hoàn thiện các công đoạn dang dở để bảo vệ phôi kim hoàn.",
        "Khi phôi chạy đến trạm Packing (Kho TP): Kiểm KCS và nhập kho thành phẩm.",
        "Hệ thống gỡ bỏ thông tin SO cũ, chuyển thẳng sang Kho CXLL."
      ],
      dataTransition: {
        soCode: "SO Đã Hủy",
        bagCode: "SO-260800061 (Gia công hoàn tất)",
        customerStatus: "Gỡ khách hàng cũ",
        workCenter: "WIP → Packing Out → Kho CXLL",
        systemState: "Nhập thẳng Kho CXLL (Tồn khả dụng = SL đã hủy)"
      },
      rules: ["Không dừng ngang chuyền làm đứt gãy phôi và hao hụt vàng."]
    },
    {
      id: "cancel-step-packing-do",
      number: "1.4B-DO",
      title: "User Đóng Gói Chỉnh Sửa / Hủy Phiếu Giao Hàng (DO)",
      module: "GH",
      moduleName: "Giao Nhận & Đóng Gói",
      actor: "User Đóng Gói (Giao Nhận)",
      screen: "Phân Hệ Giao Nhận → Phiếu Giao Hàng (/delivery-orders)",
      description: "Nhận thông báo từ hệ thống, User Đóng gói mở phân hệ Giao Nhận để điều chỉnh giảm số lượng giao hoặc hủy Phiếu giao hàng (DO) tương ứng với item bị hủy, giải phóng chứng từ trước khi hàng được điều chuyển kho.",
      prerequisites: "Base Form Type B đã duyệt; Nhận thông báo hủy đơn từ hệ thống.",
      actions: [
        "User Đóng gói mở chi tiết Phiếu giao hàng (DO) liên quan.",
        "Thao tác giảm số lượng giao của item bị hủy hoặc hủy bỏ phiếu DO nếu hủy trọn đơn.",
        "Lưu thay đổi. Hệ thống gỡ bỏ ràng buộc DO của item này."
      ],
      dataTransition: {
        soCode: "SO Đã Cập Nhật",
        bagCode: "DO đã được điều chỉnh / hủy",
        customerStatus: "Đã gỡ khỏi chuyến giao hàng",
        workCenter: "Giao Nhận (Đóng Gói)",
        systemState: "DO đã xử lý → Giải phóng ràng buộc để Kho TP chuyển CXLL"
      },
      rules: ["Bắt buộc hoàn tất điều chỉnh/hủy DO để Thủ kho có thể chuyển hàng sang CXLL."]
    },
    {
      id: "cancel-step-invoice",
      number: "1.4B-INV",
      title: "Đã Lập Hóa Đơn: Phối Hợp Kế Toán Điều Chỉnh Hóa Đơn",
      module: "KT",
      moduleName: "Kế Toán & Quản Lý Đơn Hàng",
      actor: "Kế toán Bán hàng / QLĐH",
      screen: "Phân Hệ Kế Toán & Quản Lý Đơn Hàng",
      description: "Đơn hàng đã xuất Hóa đơn GTGT điện tử: Kế toán thực hiện lập biên bản điều chỉnh/hủy hóa đơn điện tử theo quy định cơ quan thuế. Sau khi hoàn tất chứng từ thuế, Kho xác nhận chuyển sang Kho CXLL.",
      prerequisites: "Đơn hàng đã xuất Hóa đơn GTGT.",
      actions: [
        "Hệ thống cảnh báo đơn đã xuất Hóa đơn.",
        "Kế toán xử lý biên bản điều chỉnh hóa đơn tài chính.",
        "Kho thành phẩm hoàn tất chuyển sang Kho CXLL sau khi chứng từ thuế hợp lệ."
      ],
      dataTransition: {
        soCode: "SO Đã Hóa Đơn",
        bagCode: "INV-2026-08-0044",
        customerStatus: "Đã điều chỉnh hóa đơn",
        workCenter: "Kế Toán",
        systemState: "Chứng từ hợp lệ → Chuyển sang Kho CXLL"
      },
      rules: ["Tuân thủ chặt chẽ quy định hóa đơn điện tử của cơ quan thuế."]
    },
    {
      id: "cancel-step-wh-confirm",
      number: "1.4B-WH",
      title: "Kho TP Kiểm Tra DO & Xác Nhận Chuyển Kho CXLL",
      module: "KHO",
      moduleName: "Kho Thành Phẩm & CXLL",
      actor: "Thủ kho Thành phẩm",
      screen: "Kho Thành Phẩm → Yêu Cầu Hủy Đơn (/inventory/cancel-requests)",
      description: "Thủ kho mở màn hình tiếp nhận yêu cầu hủy để chuyển item sang Kho CXLL. HỆ THỐNG BẮT BUỘC CHECK DO: Nếu item vẫn còn thuộc Phiếu giao hàng (DO) chưa sửa/hủy → Báo lỗi đỏ và chặn chuyển kho ngay lập tức! Sau khi DO đã được xử lý xong → Thủ kho xác nhận chuyển thành công. Item ghi nhận Tồn khả dụng = SL đã hủy trong DS CXLL.",
      prerequisites: "Base Form Type B đã duyệt; DO đã được điều chỉnh/hủy (không còn ràng buộc DO).",
      actions: [
        "Mở màn hình Kho Thành Phẩm → Tiếp Nhận Yêu Cầu Hủy Đơn.",
        "Bấm nút 'Xác nhận chuyển sang Kho CXLL'.",
        "Hệ thống tự động kiểm tra: Nếu item còn thuộc DO chưa sửa → Báo lỗi đỏ và chặn chuyển kho.",
        "Nếu item hợp lệ: Chuyển trạng thái sang Kho CXLL và ghi nhận Tồn khả dụng = SL đã hủy."
      ],
      dataTransition: {
        soCode: "SO Đã Hủy",
        bagCode: "SO-260800061...",
        customerStatus: "Gỡ thông tin khách cũ",
        workCenter: "Kho CXLL",
        systemState: "Lưu Danh Sách CXLL | Tồn khả dụng = SL đã hủy"
      },
      rules: [
        "Bắt buộc check DO: Còn DO chưa sửa/hủy → Chặn chuyển & Báo lỗi đỏ.",
        "Item ghi nhận Tồn khả dụng = SL đã hủy trong DS CXLL."
      ]
    }
  ],

  // =========================================================================
  // LUỒNG 2: CHUYỂN ĐƠN (TRANSFER / RE-ASSIGN FLOW)
  // =========================================================================
  transfer: [
    {
      id: "trans-step-1",
      number: "2.1",
      title: "QLĐH Gán Item CXLL (Trạng Thái: Đã Gán Đơn Mới / Đã Giữ Chỗ)",
      module: "KD",
      moduleName: "Kinh Doanh (QLĐH)",
      actor: "Nhân viên Bán hàng (Kinh doanh)",
      screen: "QLĐH → Tạo/Chỉnh Đơn Hàng (/orders/create) & Chọn Item Kho (/orders/warehouse-picker)",
      description: "Khi tạo đơn mới hoặc chỉnh đơn, QLĐH chọn kiểm tra và gán item từ kho CXLL vào đơn hàng mới. Ngay khi gán thành công, item CXLL chuyển sang trạng thái: 'Đã gán đơn mới / Đã giữ chỗ', đồng thời trừ tồn khả dụng (Tồn khả dụng = 0) để khóa chống pick trùng giữa các đơn.",
      prerequisites: "Có Lô ở trạng thái 'Chờ gán đơn mới' trong kho CXLL (Tồn khả dụng = 1).",
      actions: [
        "Mở đơn hàng SO2608011 của DOANH NGHIỆP TƯ NHÂN Ý NGỌC.",
        "Chọn sản phẩm, bấm 'Gán item kho CXLL' và chọn lô phôi phù hợp.",
        "Kho CXLL lập tức cập nhật: Tồn khả dụng = 0, gắn cờ 'Đã gán đơn mới / Đã giữ chỗ (SO2608011)'."
      ],
      dataTransition: {
        soCode: "SO2608011",
        bagCode: "Lô cũ SO-260800061 (Kho CXLL)",
        customerStatus: "DNTN Ý NGỌC",
        workCenter: "Kho CXLL (Đã giữ chỗ)",
        systemState: "Trạng thái: 'Đã gán đơn mới / Đã giữ chỗ' | Tồn khả dụng: 0 (Khóa chống pick trùng)"
      },
      rules: [
        "Kho trừ tồn khả dụng tức thời ngay thời điểm Bán hàng gán phôi vào đơn, không đợi đến khi SO Release để bảo vệ tính toàn vẹn tồn kho."
      ]
    },
    {
      id: "trans-step-2",
      number: "2.2",
      title: "Xác Nhận Đơn: Phân Tách 2 Luồng (SX Mới vs Làm Mới Lại)",
      module: "KD",
      moduleName: "Kinh Doanh (QLĐH)",
      actor: "Nhân viên Bán hàng / QLĐH",
      screen: "Chi Tiết Đơn Hàng SO2608011 (/orders/11)",
      description: "QLĐH bấm 'Xác nhận đơn hàng'. Hệ thống tự động phân tách cấu trúc đơn thành 2 luồng rõ rệt: (1) Sản xuất mới: SL sản xuất mới = SL đặt - SL item trong Kho (kế thừa BOM/Routing chuẩn QLSP); (2) Làm mới lại: Dành riêng cho danh sách các item CXLL đã gán (BOM rỗng, áp dụng quy trình làm mới).",
      prerequisites: "Đơn hàng đã được gán phôi kho thành công và hoàn tất thông tin thương mại.",
      actions: [
        "QLĐH kiểm tra bảng phân bổ: SL Đặt = 10, Gán kho = 1 → SX Mới = 9, Làm mới = 1.",
        "Nhấn nút 'Xác nhận đơn hàng & Chuyển KHSX'.",
        "ERP gói dữ liệu và chuyển sang phân hệ KHSX theo 2 luồng xử lý riêng biệt."
      ],
      dataTransition: {
        soCode: "SO2608011 (Đã xác nhận đơn)",
        bagCode: "SX Mới: SL đặt - SL kho | Làm Mới Lại: Item CXLL",
        customerStatus: "DNTN Ý NGỌC",
        workCenter: "Kế Hoạch Sản Xuất",
        systemState: "Đơn xác nhận thành công → Tách 2 luồng: SX mới & Làm mới lại"
      },
      rules: [
        "SL Sản xuất mới = SL Đặt - SL Item trong kho.",
        "Item thuộc kho CXLL tuyệt đối không load BOM vật tư của sản phẩm mới để tránh xuất trùng vàng/đá."
      ]
    },
    {
      id: "trans-step-3",
      number: "2.3",
      title: "KHSX Xử Lý 2 Luồng Riêng Biệt & Release MPS",
      module: "KHSX",
      moduleName: "Kế Hoạch Sản Xuất (KHSX)",
      actor: "Cán bộ Kế hoạch sản xuất / Điều độ",
      screen: "Kế Hoạch Sản Xuất → Quản Lý Lệnh SX (/manufacturing/plans)",
      description: "KHSX nhận thông tin và xử lý theo 2 luồng riêng biệt: (1) Sản xuất mới: quy trình sản xuất đúc mới như hiện tại; (2) Làm mới lại: quy trình Routing fix (làm mới: tẩy xi mạ cũ, đánh bóng, xi mạ mới, KCS). Khi KHSX bấm 'Release MPS' → Tự động chuyển thông tin xuống Kho Thành Phẩm vào 'Danh sách chờ serve Finish Good (FG)' (chờ chuyển bag).",
      prerequisites: "Đơn hàng đã chuyển từ QLĐH sang KHSX.",
      actions: [
        "KHSX mở danh sách đơn, phân bổ lệnh SX: Nhánh SX mới đi đúc phôi; Nhánh làm mới gán Routing fix.",
        "Cấp mã Bag mới theo cú pháp: SO-261024-001.",
        "Bấm 'Release MPS': Đẩy thông tin xuống Kho Thành Phẩm vào DS chờ serve Finish Good (FG)."
      ],
      dataTransition: {
        soCode: "SO2608011",
        bagCode: "Sinh Bag Mới: SO-261024-001 (Routing fix)",
        customerStatus: "DNTN Ý NGỌC",
        workCenter: "KHSX Planning → Release MPS",
        systemState: "Release MPS thành công → Đẩy vào DS Chờ Serve FG (Kho TP)"
      },
      rules: [
        "Hàng làm mới bắt buộc đi theo Routing fix.",
        "KHSX Release MPS là điều kiện kích hoạt xuất hiện trên DS chờ serve FG tại Kho TP."
      ]
    },
    {
      id: "trans-step-4",
      number: "2.4",
      title: "Kho TP: Cấp Thành Phẩm (Serve FG) & In Thẻ Bag Mới (Format KHSX)",
      module: "KHO",
      moduleName: "Kho Thành Phẩm (FG & CXLL)",
      actor: "Thủ kho Thành phẩm",
      screen: "Kho Thành Phẩm → Trạm Serve FG (/inventory/reprocess/serve)",
      description: "Kho xem 'Danh sách chờ serve FG', chọn Cấp thành phẩm hoặc bấm [In mã Bag]: Cho phép nhân viên Kho in thẻ Bag mới theo format chuẩn KHSX (giữ nguyên layout & màu sắc như ảnh đính kèm). Thẻ Bag thể hiện: Bag header cân lại theo số lượng pcs trong lô (TL đá, TL vàng, Tổng TL); SL của Bag component tính theo pcs trong lô; Mã stamp tương ứng với TL đá; Routing chính là Routing fix lấy từ đơn hàng.",
      prerequisites: "KHSX đã Release MPS; Thông tin đã hiển thị trên DS chờ serve FG.",
      actions: [
        "Mở màn hình Trạm Serve FG (/inventory/reprocess/serve).",
        "Bấm 'In Mã Bag' để xuất thẻ lệnh sản xuất chuẩn KHSX (cân lại trọng lượng & SL component theo pcs).",
        "Thực hiện đối soát linh kiện 2 bên, bấm 'Chuyển tất cả' và 'Xác nhận cấp & Đóng Bag cũ'.",
        "Item chuyển trạng thái 'Đã chuyển sang bag mới' và sẵn sàng xuất xưởng theo Routing fix."
      ],
      dataTransition: {
        soCode: "SO2608011",
        bagCode: "Bag cũ đóng → Kích hoạt Bag mới SO-261024-001 (Format KHSX)",
        customerStatus: "DNTN Ý NGỌC",
        workCenter: "WC-Serve FG (Đã chuyển Bag)",
        systemState: "Trạng thái: 'Đã chuyển sang bag mới' | In Thẻ Bag KHSX Chuẩn Format"
      },
      rules: [
        "Bag header cân lại Trọng lượng đá, Trọng lượng kim loại, Tổng TL theo số lượng pcs trong lô.",
        "SL component tính trên số lượng pcs trong lô.",
        "Mỗi mã stamp tương ứng với TL đá (khắc chuẩn tại bước Stamping).",
        "Routing trên thẻ Bag chính là Routing fix lấy từ đơn hàng."
      ]
    },
    {
      id: "trans-step-5",
      number: "2.5",
      title: "Thực Thi Routing Cố Định 3 Công Đoạn",
      module: "SX",
      moduleName: "Trạm Kho CXLL & Xưởng Thực Thi (MES)",
      actor: "Tổ Làm Mới / Kỹ thuật viên xi mạ",
      screen: "Hệ thống Thực Thi Sản Xuất (MES) & Trạm WC",
      description: "Item lần lượt đi qua đúng 3 công đoạn gán cứng: (1) Serve FG: Xuất phôi; (2) Stamping: Tẩy dấu cũ, khắc logo mới DNTN Ý NGỌC và đóng dấu tuổi vàng chuẩn; (3) Packing Out: Kiểm KCS và đóng gói.",
      prerequisites: "Phôi đã được cấp vào Bag mới và có thẻ lữ hành đi kèm.",
      actions: [
        "Trạm 1 (Serve FG): Kho xuất phôi khỏi kho CXLL.",
        "Trạm 2 (Stamping): Xưởng tẩy xi cũ, mài sạch dấu cũ, khắc laser logo Ý NGỌC & xi mạ hoàn thiện.",
        "Trạm 3 (Packing Out): Kiểm KCS ngoại quan, bắn barcode xác nhận hoàn thành công đoạn."
      ],
      dataTransition: {
        soCode: "SO2608011",
        bagCode: "SO-261024-001",
        customerStatus: "DNTN Ý NGỌC",
        workCenter: "Serve FG → Stamping → Packing Out",
        systemState: "Đã hoàn thành 3 công đoạn làm mới, đạt chuẩn KCS"
      },
      rules: [
        "Không được bỏ qua bất kỳ trạm nào trong 3 công đoạn bắt buộc để đảm bảo chất lượng thành phẩm."
      ]
    },
    {
      id: "trans-step-6",
      number: "2.6",
      title: "Nhập Lại Kho Thành Phẩm Sẵn Sàng Giao Hàng",
      module: "KHO",
      moduleName: "Kho Thành Phẩm (FG)",
      actor: "Thủ kho Thành phẩm",
      screen: "Kho Thành Phẩm → Danh Sách Tồn Kho Thương Mại",
      description: "Sau khi hoàn thành trạm Packing Out, sản phẩm được chuyển vào Kho Thành Phẩm. Hệ thống chuyển trạng thái từ 'Đang làm mới' sang 'Sẵn sàng giao hàng' cho đơn SO2608011.",
      prerequisites: "Hoàn tất trạm Packing Out và đạt kiểm định KCS.",
      actions: [
        "Thủ kho quét mã Bag mới SO-261024-001 tại trạm tiếp nhận kho TP.",
        "Hệ thống tự động liên kết sản phẩm vào tiến độ giao hàng của SO2608011.",
        "Chuyển trạng thái: 'Sẵn sàng lập DO'."
      ],
      dataTransition: {
        soCode: "SO2608011",
        bagCode: "SO-261024-001 (Thành phẩm hoàn chỉnh)",
        customerStatus: "DNTN Ý NGỌC",
        workCenter: "Kho Thành Phẩm",
        systemState: "Trạng thái: 'Sẵn sàng giao hàng' | Đã sẵn sàng cho bộ phận điều phối"
      },
      rules: [
        "Sản phẩm sau khi nhập lại kho TP phải được gắn chính xác vào đơn SO2608011, không được xuất bán cho đơn khác."
      ]
    },
    {
      id: "trans-step-7",
      number: "2.7",
      title: "Lập Phiếu Giao Hàng (DO) → Lập Hóa Đơn & Xuất Giao",
      module: "KD",
      moduleName: "Kinh Doanh & Kế Toán Bán Hàng",
      actor: "Nhân viên Điều phối / Kế toán",
      screen: "Quản Lý Đơn Hàng → Lập Phiếu Giao Hàng & Hóa Đơn",
      description: "QLĐH lập Phiếu giao hàng (DO), Kế toán phát hành Hóa đơn tài chính, Kho tiến hành đóng gói niêm phong và bàn giao đơn vị vận chuyển xuất giao khách hàng.",
      prerequisites: "Tất cả sản phẩm của đơn hàng đã nhập kho thành phẩm đầy đủ.",
      actions: [
        "Tạo Phiếu giao hàng (DO) cho đơn SO2608011.",
        "Kế toán phát hành Hóa đơn GTGT điện tử.",
        "Thủ kho xuất kho giao cho đơn vị vận chuyển.",
        "Cập nhật đơn hàng sang trạng thái: 'Đã hoàn tất giao hàng'."
      ],
      dataTransition: {
        soCode: "SO2608011",
        bagCode: "SO-261024-001 (Đã xuất giao)",
        customerStatus: "Đã giao hàng thành công đến DNTN Ý NGỌC",
        workCenter: "Đơn vị vận chuyển / Khách hàng",
        systemState: "Trạng thái đơn hàng: 'Đã hoàn tất' (Closed) | Doanh thu được ghi nhận"
      },
      rules: [
        "Phiếu giao hàng và hóa đơn phải khớp 100% về số lượng, trọng lượng vàng, đá và đơn giá."
      ]
    }
  ]
};

export default function InteractiveWorkflowDiagram() {
  const [activeFlow, setActiveFlow] = useState("cancel"); // 'cancel' | 'transfer'
  const [selectedStep, setSelectedStep] = useState(null);
  const [viewMode, setViewMode] = useState("visual"); // 'visual' | 'matrix' | 'mermaid'

  const currentSteps =
    activeFlow === "cancel"
      ? WORKFLOW_STEPS_DATA.cancel_all
      : WORKFLOW_STEPS_DATA.transfer;

  return (
    <div className="space-y-4">
      {/* 1. THANH ĐIỀU KHIỂN & CHỌN LUỒNG */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800 font-bold">
                <GitCommit className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Sơ Đồ Tương Tác: Luồng Hủy Đơn & Chuyển Đơn (Cross-Module)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Thể hiện tương tác giữa <strong>Kinh Doanh (QLĐH)</strong>, <strong>Hệ Thống Base</strong>, <strong>KHSX & Xưởng</strong>, <strong>Kho Thành Phẩm & CXLL</strong>, cùng ràng buộc <strong>Phiếu Giao Hàng (DO) & Hóa Đơn</strong>.
            </p>
          </div>

          {/* Bộ chọn Luồng & Chế độ xem */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Switcher 2 Luồng Lớn */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveFlow("cancel");
                  setSelectedStep(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeFlow === "cancel"
                    ? "bg-rose-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>1. Luồng Hủy Đơn (Flowchart Cây)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveFlow("transfer");
                  setSelectedStep(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeFlow === "transfer"
                    ? "bg-teal-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>2. Luồng Chuyển Đơn</span>
              </button>
            </div>

            {/* Switcher View Mode */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("visual")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === "visual"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Sơ đồ Flowchart (Trực quan)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("mermaid")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === "mermaid"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Mã Mermaid (BPMN)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${viewMode === "matrix"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Ma trận tác nghiệp
              </button>
            </div>
          </div>
        </div>

        {/* Thanh ghi chú */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Màu sắc quy chuẩn:</span>
            <span className="inline-flex items-center gap-1 text-sky-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Khách hàng
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> QLĐH
            </span>
            <span className="inline-flex items-center gap-1 text-orange-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Điểm kiểm tra (Decision)
            </span>
            <span className="inline-flex items-center gap-1 text-amber-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Base Request
            </span>
            <span className="inline-flex items-center gap-1 text-fuchsia-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></span> Xưởng SX (WIP)
            </span>
            <span className="inline-flex items-center gap-1 text-teal-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Kho TP & CXLL
            </span>
          </div>
          <div className="text-slate-500 italic">
            * Nhấp vào từng khối (Node) trên sơ đồ để xem tài liệu đặc tả tác nghiệp chi tiết.
          </div>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: SƠ ĐỒ FLOWCHART TRỰC QUAN (CHUẨN FORM ẢNH ĐÍNH KÈM) */}
      {viewMode === "visual" && (
        <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
          {activeFlow === "cancel" ? (
            /* ============================================================== */
            /* SƠ ĐỒ FLOWCHART DẠNG CÂY DỌC (VERTICAL TREE FLOWCHART)         */
            /* TÁI HIỆN CHÍNH XÁC 100% THEO ẢNH ĐÍNH KÈM CỦA CHỊ ĐẸP          */
            /* ============================================================== */
            <div className="min-w-[1080px] max-w-5xl mx-auto flex flex-col items-center select-none py-4">

              {/* NODE 1: KHỞI TẠO (OVAL XANH DƯƠNG) */}
              <div
                onClick={() => setSelectedStep(currentSteps[0])}
                className="px-6 py-2.5 rounded-full bg-sky-50 border-2 border-sky-400 text-sky-800 font-bold text-xs shadow-xs cursor-pointer hover:bg-sky-100 hover:border-sky-500 transition-all flex items-center space-x-1.5"
              >
                <span>Khách hàng Yêu Cầu Hủy</span>
              </div>

              {/* MŨI TÊN DỌC */}
              <div className="w-0.5 h-6 bg-slate-300 relative flex items-center justify-center">
                <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
              </div>

              {/* NODE 2: QLĐH TIẾP NHẬN (HỘP XANH LÁ) */}
              <div
                onClick={() => setSelectedStep(currentSteps[1])}
                className="w-96 p-3 bg-white border-2 border-emerald-500 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-600 hover:shadow-md transition-all mt-1"
              >
                <div className="font-bold text-slate-900 text-xs">
                  QLĐH Tiếp Nhận & Lập YC Hủy
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                  Hủy đơn / Hủy món / Hủy SL món
                </div>
                <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 inline-block mt-1 font-bold">
                  ⚡ Tinh giản: Hệ thống tự động bắn thông báo sau duyệt
                </div>
              </div>

              {/* MŨI TÊN DỌC */}
              <div className="w-0.5 h-6 bg-slate-300 relative flex items-center justify-center">
                <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
              </div>

              {/* DECISION 1: ĐƠN HÀNG ĐÃ CHUYỂN KHSX CHƯA? (DIAMOND CAM) */}
              <div className="relative my-1">
                <div className="w-48 h-20 bg-orange-50 border-2 border-orange-500 rounded-xl flex items-center justify-center p-2 text-center shadow-xs rotate-0">
                  <span className="font-bold text-xs text-orange-950">
                    Đơn hàng đã chuyển KHSX chưa?
                  </span>
                </div>
              </div>

              {/* PHÂN NHÁNH 2 CỘT: CHƯA CHUYỂN (TRÁI) vs ĐÃ CHUYỂN (PHẢI) */}
              <div className="w-full flex justify-between gap-12 mt-4 relative">

                {/* SVG ĐƯỜNG KẾT NỐI TỪ DECISION 1 SANG 2 CỘT */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[72%] h-4 border-t-2 border-slate-300">
                  <div className="absolute -top-3.5 left-0 w-0.5 h-3.5 bg-slate-300"></div>
                  <div className="absolute -top-3.5 right-0 w-0.5 h-3.5 bg-slate-300"></div>
                </div>

                {/* ========================================================== */}
                {/* CỘT 1 (BÊN TRÁI): ĐƠN CHƯA CHUYỂN KHSX (NỘI BỘ KD)        */}
                {/* ========================================================== */}
                <div className="flex-1 flex flex-col items-center">
                  {/* Nhãn nhánh */}
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded -mt-2.5 z-10">
                    Chưa chuyển
                  </span>

                  <div className="w-0.5 h-5 bg-slate-300 relative flex items-center justify-center">
                    <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                  </div>

                  {/* Form Type A */}
                  <div
                    onClick={() => setSelectedStep(currentSteps[2])}
                    className="w-68 p-3 rounded-xl bg-amber-50/90 border-2 border-amber-400 text-center shadow-xs cursor-pointer hover:border-amber-500 transition-all"
                  >
                    <div className="text-[10px] uppercase font-bold text-amber-700">Gửi Base Request</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">Form Type A</div>
                    <div className="text-[11px] text-amber-900 mt-0.5 font-medium">
                      Hủy nội bộ Kinh doanh
                    </div>
                  </div>

                  <div className="w-0.5 h-5 bg-slate-300 relative flex items-center justify-center">
                    <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                  </div>

                  {/* Decision: TPKD Duyệt? */}
                  <div className="w-44 h-16 bg-orange-50 border-2 border-orange-500 rounded-xl flex items-center justify-center p-2 text-center shadow-xs">
                    <span className="font-bold text-xs text-orange-950">
                      TPKD / GĐKD phê duyệt?
                    </span>
                  </div>

                  {/* Phân nhánh Từ chối vs Phê duyệt */}
                  <div className="w-full flex justify-between gap-4 mt-3 relative px-2">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-48 h-3 border-t-2 border-slate-300"></div>

                    {/* Từ chối */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-2 z-10">
                        Từ chối
                      </span>
                      <div className="w-0.5 h-4 bg-slate-300"></div>
                      <div className="px-3 py-2 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-[11px] text-center font-medium shadow-2xs">
                        Hủy yêu cầu — Đơn giữ nguyên
                      </div>
                    </div>

                    {/* Phê duyệt */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-2 z-10">
                        Phê duyệt
                      </span>
                      <div className="w-0.5 h-4 bg-slate-300"></div>
                      <div
                        onClick={() => setSelectedStep(currentSteps[4])}
                        className="w-48 p-2.5 bg-white border-2 border-emerald-500 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-600 transition-all"
                      >
                        <div className="font-bold text-xs text-slate-900">
                          QLĐH cập nhật SO gốc:
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                          SL Đặt, SL Hủy, SL Còn lại
                        </div>
                      </div>

                      <div className="w-0.5 h-5 bg-slate-300 relative flex items-center justify-center">
                        <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                      </div>

                      {/* Hoàn tất Hủy Nội Bộ KD */}
                      <div className="px-4 py-2 rounded-full bg-[#15803d] text-white font-bold text-xs shadow-md text-center">
                        Hoàn tất hủy đơn nội bộ KD
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* CỘT 2 (BÊN PHẢI): ĐƠN ĐÃ CHUYỂN KHSX (LIÊN PHÒNG BAN & KHO) */}
                {/* ========================================================== */}
                <div className="flex-1 flex flex-col items-center">
                  {/* Nhãn nhánh */}
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded -mt-2.5 z-10">
                    Đã chuyển
                  </span>

                  <div className="w-0.5 h-5 bg-slate-300 relative flex items-center justify-center">
                    <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                  </div>

                  {/* Form Type B */}
                  <div
                    onClick={() => setSelectedStep(currentSteps[3])}
                    className="w-76 p-3 rounded-xl bg-amber-50/90 border-2 border-amber-400 text-center shadow-xs cursor-pointer hover:border-amber-500 transition-all"
                  >
                    <div className="text-[10px] uppercase font-bold text-amber-700">Gửi Base Request</div>
                    <div className="font-bold text-xs text-slate-900 mt-0.5">Form Type B</div>
                    <div className="text-[11px] text-amber-900 mt-0.5 font-medium">
                      Hủy đơn KHSX/Kho liên phòng ban
                    </div>
                  </div>

                  <div className="w-0.5 h-5 bg-slate-300 relative flex items-center justify-center">
                    <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                  </div>

                  {/* Decision: GĐKD + GĐSX/KHSX + Kho duyệt? */}
                  <div className="w-56 h-16 bg-orange-50 border-2 border-orange-500 rounded-xl flex items-center justify-center p-2 text-center shadow-xs">
                    <span className="font-bold text-xs text-orange-950">
                      GĐKD + GĐSX/KHSX + Kho phê duyệt?
                    </span>
                  </div>

                  {/* Phân nhánh Từ chối vs Phê duyệt */}
                  <div className="w-full flex justify-between gap-4 mt-3 relative px-2">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-64 h-3 border-t-2 border-slate-300"></div>

                    {/* Từ chối */}
                    <div className="w-36 flex flex-col items-center">
                      <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-2 z-10">
                        Từ chối
                      </span>
                      <div className="w-0.5 h-4 bg-slate-300"></div>
                      <div className="px-3 py-2 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-[11px] text-center font-medium shadow-2xs">
                        Hủy yêu cầu — Tiếp tục thực hiện SO
                      </div>
                    </div>

                    {/* Phê duyệt */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-2 z-10">
                        Phê duyệt
                      </span>
                      <div className="w-0.5 h-4 bg-slate-300"></div>

                      {/* CẬP NHẬT SO & BẮN 2 THÔNG BÁO SONG SONG */}
                      <div
                        onClick={() => setSelectedStep(currentSteps[5])}
                        className="w-84 p-2.5 bg-emerald-50/90 border-2 border-emerald-600 rounded-xl text-center shadow-xs cursor-pointer hover:border-emerald-700 transition-all"
                      >
                        <div className="font-bold text-xs text-emerald-950">
                          BASE DUYỆT THÀNH CÔNG:
                        </div>
                        <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
                          Cập nhật SL còn - SL hủy trên SO
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          ⚡ Bắn 2 thông báo song song: (1) User Đóng gói & (2) Kho TP
                        </div>
                      </div>

                      {/* 2 NHÁNH SONG SONG: ĐÓNG GÓI (DO) vs KHO TP (CXLL) */}
                      <div className="w-full flex justify-between gap-4 mt-4 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[85%] h-3 border-t-2 border-slate-300"></div>

                        {/* NHÁNH A: USER ĐÓNG GÓI XỬ LÝ PHIẾU GIAO HÀNG */}
                        <div className="w-48 flex flex-col items-center">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded -mt-2.5 z-10">
                            Nhánh Đóng Gói (DO)
                          </span>
                          <div className="w-0.5 h-4 bg-slate-300"></div>

                          <div
                            onClick={() => setSelectedStep(currentSteps[7])}
                            className="w-full p-2.5 bg-blue-50 border-2 border-blue-400 rounded-xl text-center shadow-xs cursor-pointer hover:border-blue-600 transition-all"
                          >
                            <div className="font-bold text-xs text-blue-950">
                              User Đóng Gói
                            </div>
                            <div className="text-[11px] text-blue-800 font-semibold mt-0.5">
                              Chỉnh sửa / Hủy Phiếu giao hàng (DO)
                            </div>
                            <div className="text-[9px] text-blue-700 italic mt-0.5">
                              Giải phóng item khỏi lịch giao
                            </div>
                          </div>

                          <div className="w-0.5 h-16 bg-slate-300 relative flex items-center justify-center">
                            <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                          </div>
                        </div>

                        {/* NHÁNH B: KHO THÀNH PHẨM CHECK DO & CHUYỂN CXLL */}
                        <div className="flex-1 flex flex-col items-center">
                          <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded -mt-2.5 z-10">
                            Nhánh Kho Thành Phẩm (CXLL)
                          </span>
                          <div className="w-0.5 h-4 bg-slate-300"></div>

                          {/* Thủ kho bấm chuyển */}
                          <div className="w-64 p-2 bg-white border border-teal-400 rounded-xl text-center shadow-2xs">
                            <div className="font-bold text-xs text-teal-950">
                              Kho TP: Chọn "Chuyển sang DS CXLL"
                            </div>
                          </div>

                          <div className="w-0.5 h-4 bg-slate-300 relative flex items-center justify-center">
                            <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                          </div>

                          {/* Decision: Check DO */}
                          <div className="w-60 h-16 bg-orange-50 border-2 border-orange-500 rounded-xl flex items-center justify-center p-2 text-center shadow-xs">
                            <span className="font-bold text-xs text-orange-950 leading-tight">
                              Item có thuộc Phiếu giao hàng (DO) nào không?
                            </span>
                          </div>

                          {/* Phân nhánh Check DO: CÓ (Lỗi) vs KHÔNG (Cho phép) */}
                          <div className="w-full flex justify-between gap-3 mt-3 relative px-1">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-48 h-3 border-t-2 border-slate-300"></div>

                            {/* CÓ DO -> BÁO LỖI ĐỎ */}
                            <div className="w-36 flex flex-col items-center">
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-2 z-10">
                                Có DO
                              </span>
                              <div className="w-0.5 h-3 bg-slate-300"></div>
                              <div className="p-2 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 text-[10px] text-center font-bold shadow-xs">
                                ❌ Báo lỗi: Chặn chuyển kho (Yêu cầu Đóng gói sửa DO trước)
                              </div>
                            </div>

                            {/* KHÔNG / ĐÃ SỬA DO -> HỢP LỆ */}
                            <div className="flex-1 flex flex-col items-center">
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-2 z-10">
                                Không / Đã sửa DO
                              </span>
                              <div className="w-0.5 h-3 bg-slate-300"></div>
                              <div
                                onClick={() => setSelectedStep(currentSteps[8])}
                                className="w-full p-2.5 bg-teal-50 border-2 border-teal-500 rounded-xl text-center shadow-xs cursor-pointer hover:border-teal-600 transition-all"
                              >
                                <div className="font-bold text-xs text-teal-950 leading-tight">
                                  Kho TP xác nhận chuyển sang Kho CXLL
                                </div>
                                <div className="text-[10px] text-teal-800 font-medium mt-0.5">
                                  Hợp lệ: Gỡ SO cũ, sẵn sàng nhập kho CXLL
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ============================================================== */}
                      {/* ĐIỂM HỘI TỤ TOÀN BỘ CỦA NHÁNH ĐÃ CHUYỂN KHSX                   */}
                      {/* THANH NGANG HỘI TỤ TẤT CẢ CÁC NHÁNH                            */}
                      {/* ============================================================== */}
                      <div className="w-full flex flex-col items-center mt-4">
                        {/* Thanh ngang hội tụ liền mạch */}
                        <div className="w-[88%] h-3 border-b-2 border-slate-300 relative">
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-300"></div>
                        </div>

                        <div className="w-0.5 h-4 bg-slate-300 relative flex items-center justify-center">
                          <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                        </div>

                        {/* KHỐI TRỤ DATABASE: LƯU DANH SÁCH CXLL */}
                        <div className="w-88 p-3.5 bg-[#0f766e] text-white rounded-2xl text-center shadow-md border-2 border-teal-700">
                          <div className="flex items-center justify-center space-x-1.5 font-black text-xs uppercase tracking-wider text-teal-200">
                            <Database className="h-4 w-4 text-teal-300" />
                            <span>Lưu Danh Sách CXLL</span>
                          </div>
                          <div className="font-bold text-xs text-white mt-1">
                            Item ghi nhận Tồn khả dụng = SL đã hủy
                          </div>
                          <div className="text-[11px] text-teal-100 mt-0.5">
                            Sẵn sàng pick chọn cho đơn hàng mới (Luồng chuyển đơn)
                          </div>
                        </div>

                        <div className="w-0.5 h-5 bg-slate-300 relative flex items-center justify-center">
                          <ArrowDown className="h-3 w-3 text-slate-400 absolute -bottom-1" />
                        </div>

                        {/* OVAL KẾT THÚC: HOÀN TẤT XỬ LÝ HỦY ĐƠN */}
                        <div className="px-6 py-2.5 rounded-full bg-[#15803d] text-white font-bold text-xs shadow-md text-center">
                          Hoàn tất xử lý hủy đơn
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* LUỒNG 2: SƠ ĐỒ CHUYỂN ĐƠN (3 LÀN BƠI CHUẨN)                    */
            /* ============================================================== */
            <div className="min-w-[1100px] space-y-5">
              <div className="text-xs font-bold text-teal-950 bg-teal-50 border border-teal-200 p-3 rounded-xl flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
                  <span>
                    <strong>Quy Trình Chuyển Đơn Chuẩn:</strong> KD gán item CXLL → Kho trừ tồn (Hold) chống pick trùng → Chuyển KHSX tách 2 luồng: Phôi kho (BOM rỗng, Routing [Serve FG → Stamping → Packing Out]) vs SX Mới (BOM/Routing QLSP) → KHSX sinh MO/Bag mới → Kho CXLL cấp phôi vào Bag mới → Thực thi Routing → Nhập lại Kho TP → Lập DO, Hóa đơn & Giao hàng.
                  </span>
                </span>
                <span className="font-mono text-xs bg-teal-200 text-teal-900 px-2.5 py-1 rounded-lg font-black border border-teal-300 shrink-0">
                  Đơn Mới: SO2608011
                </span>
              </div>

              {/* Sơ đồ Swimlane chuyển đơn */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40 divide-y divide-slate-200">
                {/* Làn 1: Kinh Doanh */}
                <div className="p-4 bg-emerald-50/30 flex items-start gap-4">
                  <div className="w-48 shrink-0 flex items-center gap-2.5 text-emerald-950 font-black text-xs uppercase tracking-wider pt-2">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
                      <ShoppingCart className="h-4 w-4" />
                    </span>
                    <div>
                      <div>Làn 1: Kinh Doanh</div>
                      <div className="text-[10px] text-emerald-700 font-medium lowercase">qlđh & bán hàng</div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-300 shadow-2xs shrink-0 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                      <span>Tạo/Sửa SO2608011</span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-emerald-600 shrink-0" />

                    <div
                      onClick={() => setSelectedStep(currentSteps[0])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-emerald-500 cursor-pointer shadow-xs transition-all w-72 shrink-0 ${selectedStep?.number === "2.1"
                          ? "border-emerald-600 ring-2 ring-emerald-300 shadow-md"
                          : "border-emerald-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.1 • KD & Kho
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Đã Giữ Chỗ
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">Gán Item CXLL Vào Đơn Hàng</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Item CXLL chuyển trạng thái: Đã gán đơn mới / Đã giữ chỗ
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-emerald-600 shrink-0" />

                    <div
                      onClick={() => setSelectedStep(currentSteps[1])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-emerald-600 cursor-pointer shadow-xs transition-all w-80 shrink-0 ${selectedStep?.number === "2.2"
                          ? "border-emerald-600 ring-2 ring-emerald-300 shadow-md"
                          : "border-emerald-400"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-800 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.2 • QLĐH
                        </span>
                        <span className="bg-teal-100 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Tách 2 Luồng
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">Xác Nhận Đơn (Tách 2 Luồng)</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        SX mới (SL đặt - SL kho) và Làm mới lại (Item CXLL)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Làn 2: KHSX */}
                <div className="p-4 bg-amber-50/30 flex items-start gap-4">
                  <div className="w-48 shrink-0 flex items-center gap-2.5 text-amber-950 font-black text-xs uppercase tracking-wider pt-2">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800 shadow-2xs">
                      <Factory className="h-4 w-4" />
                    </span>
                    <div>
                      <div>Làn 2: KHSX</div>
                      <div className="text-[10px] text-amber-700 font-medium lowercase">lập kế hoạch & mo</div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-36 text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                      <CornerDownRight className="h-4 w-4 text-amber-600" />
                      <span>Nhánh Phôi Kho</span>
                    </div>

                    <div
                      onClick={() => setSelectedStep(currentSteps[2])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-amber-500 cursor-pointer shadow-xs transition-all w-88 shrink-0 ${selectedStep?.number === "2.3"
                          ? "border-amber-600 ring-2 ring-amber-300 shadow-md"
                          : "border-amber-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.3 • KHSX
                        </span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Routing fix & MPS
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">
                        KHSX Xử Lý 2 Luồng & Release MPS
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        SX mới (chuẩn) vs Làm mới (Routing fix) → Release MPS đẩy xuống Kho TP
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-teal-600 shrink-0" />

                    <div className="text-amber-800 text-xs font-semibold italic bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-200">
                      → Chuyển thông tin xuống Kho TP (DS Chờ Serve FG)
                    </div>
                  </div>
                </div>

                {/* Làn 3: Kho TP & MES */}
                <div className="p-4 bg-teal-50/30 flex items-start gap-4">
                  <div className="w-48 shrink-0 flex items-center gap-2.5 text-teal-950 font-black text-xs uppercase tracking-wider pt-2">
                    <span className="p-2 rounded-xl bg-teal-100 text-teal-800 shadow-2xs">
                      <Warehouse className="h-4 w-4" />
                    </span>
                    <div>
                      <div>Làn 3: Kho TP & MES</div>
                      <div className="text-[10px] text-teal-700 font-medium lowercase">cấp phôi & làm mới</div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <div
                      onClick={() => setSelectedStep(currentSteps[3])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-teal-500 cursor-pointer shadow-xs transition-all w-80 shrink-0 ${selectedStep?.number === "2.4"
                          ? "border-teal-600 ring-2 ring-teal-300 shadow-md"
                          : "border-teal-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-teal-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.4 • Kho TP
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Serve FG
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">Cấp TP (Serve FG) & Đóng Bag Cũ</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Đối soát TL đá/vàng → Đã chuyển sang bag mới
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-teal-600 shrink-0" />

                    <div
                      onClick={() => setSelectedStep(currentSteps[4])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-teal-500 cursor-pointer shadow-xs transition-all w-76 shrink-0 ${selectedStep?.number === "2.5"
                          ? "border-teal-600 ring-2 ring-teal-300 shadow-md"
                          : "border-teal-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-indigo-700 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.5 • Xưởng Thực Thi
                        </span>
                        <span className="bg-indigo-100 text-indigo-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          3 Công Đoạn
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">Thực Thi Routing Cố Định</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Serve FG → Stamping (khắc logo Ý NGỌC) → Packing Out
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-teal-600 shrink-0" />

                    <div
                      onClick={() => setSelectedStep(currentSteps[5])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-teal-500 cursor-pointer shadow-xs transition-all w-68 shrink-0 ${selectedStep?.number === "2.6"
                          ? "border-teal-600 ring-2 ring-teal-300 shadow-md"
                          : "border-teal-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-teal-800 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.6 • Kho TP
                        </span>
                        <span className="bg-teal-100 text-teal-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Nhập Lại Kho TP
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">Nhập Kho Thành Phẩm</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Sẵn sàng cho bộ phận điều phối giao hàng
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-emerald-600 shrink-0" />

                    <div
                      onClick={() => setSelectedStep(currentSteps[6])}
                      className={`p-3 rounded-xl bg-white border-2 hover:border-emerald-600 cursor-pointer shadow-xs transition-all w-72 shrink-0 ${selectedStep?.number === "2.7"
                          ? "border-emerald-600 ring-2 ring-emerald-300 shadow-md"
                          : "border-emerald-400"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-800 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Bước 2.7 • Giao Vận
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          DO & Hóa Đơn
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1.5">Lập DO → Hóa Đơn & Giao Hàng</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Xuất giao khách hàng Ý NGỌC hoàn tất
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CHẾ ĐỘ MERMAID DIAGRAM (BPMN) */}
      {viewMode === "mermaid" && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Cú Pháp Mermaid Diagram Chuẩn BA / BPMN ({activeFlow === "cancel" ? "Luồng Hủy Đơn Toàn Diện" : "Luồng Chuyển Đơn"})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dễ dàng copy mã vào Jira, Confluence, Notion hoặc tài liệu BRD/SRS của dự án.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const code =
                  activeFlow === "cancel"
                    ? `flowchart TD\n  Start([Khách hàng Yêu Cầu Hủy]) --> QLDH_Init[1. QLĐH Tiếp Nhận & Lập YC Hủy Đơn: Tinh giản tối đa]\n  QLDH_Init --> CheckKHSX{Đơn hàng đã chuyển KHSX chưa?}\n\n  %% Nhánh Chưa Chuyển KHSX\n  CheckKHSX -- Chưa chuyển --> BaseFormA[Gửi Base Request Form Type A - Hủy nội bộ Kinh doanh]\n  BaseFormA --> ApproveA{TPKD / GĐKD phê duyệt?}\n  ApproveA -- Từ chối --> RejectA([Hủy yêu cầu - Đơn giữ nguyên])\n  ApproveA -- Phê duyệt --> UpdateSOA[QLĐH cập nhật SO gốc: SL Đặt, SL Hủy, SL Còn lại]\n  UpdateSOA --> EndA([Hoàn tất hủy đơn nội bộ KD])\n\n  %% Nhánh Đã Chuyển KHSX\n  CheckKHSX -- Đã chuyển --> BaseFormB[Gửi Base Request Form Type B - Hủy đơn KHSX/Kho]\n  BaseFormB --> ApproveB{GĐKD + GĐSX/KHSX + Kho phê duyệt?}\n  ApproveB -- Từ chối --> RejectB([Hủy yêu cầu - Tiếp tục thực hiện SO])\n  ApproveB -- Phê duyệt --> UpdateSOB[2. Khi Base duyệt: Cập nhật SL còn-SL hủy trên SO & Bắn 2 thông báo song song]\n\n  %% 2 Nhánh song song sau duyệt Base\n  UpdateSOB --> NotifyPacking[Bắn thông báo đến User Đóng gói]\n  NotifyPacking --> AdjustDO[3. User Đóng Gói: Chỉnh sửa / Hủy Phiếu giao hàng DO]\n\n  UpdateSOB --> NotifyWh[Bắn thông báo đến Kho Thành Phẩm]\n  NotifyWh --> WhClickTransfer[4. Kho TP: Bấm Chuyển sang DS CXLL]\n  WhClickTransfer --> CheckItemDO{Item có thuộc Phiếu giao hàng DO nào không?}\n  CheckItemDO -- CÓ --> WhErrorDO[❌ Báo lỗi đỏ: Chặn chuyển kho (Yêu cầu Đóng gói sửa DO trước)]\n  AdjustDO -.->|Giải phóng ràng buộc DO| CheckItemDO\n  CheckItemDO -- KHÔNG / Đã sửa DO --> WhConfirmTransfer[Kho TP xác nhận chuyển sang Kho CXLL thành công]\n\n  %% Lưu DS CXLL & Chuyển đơn\n  WhConfirmTransfer --> EnterCXLL[(5. Lưu DS CXLL: Item ghi nhận Tồn khả dụng = SL đã hủy)]\n  EnterCXLL --> TransferNewSO[Cho phép pick chọn cho đơn hàng mới: Luồng chuyển đơn]\n  TransferNewSO --> EndB([Hoàn tất xử lý hủy đơn])`
                    : `flowchart TD\n  subgraph KD["Phân Hệ Kinh Doanh (QLĐH)"]\n    A([Đơn Hàng Mới Phát Sinh SO2608011]) --> B[Bước 2.1: Gán Item CXLL - Trạng Thái: Đã Gán Đơn Mới / Đã Giữ Chỗ]\n    B --> C[Bước 2.2: Xác Nhận Đơn - Tách 2 Luồng: SX Mới (SL Đặt - SL Kho) & Làm Mới Lại (Item CXLL)]\n  end\n\n  subgraph KHSX["Phân Hệ Kế Hoạch Sản Xuất (KHSX)"]\n    C -->|Gói Đơn 2 Luồng| D[Bước 2.3: KHSX Xử Lý 2 Luồng: SX Mới & Làm Mới (Routing fix) -> Release MPS]\n  end\n\n  subgraph KHO_TP["Kho Thành Phẩm (Serve FG & Đóng Bag)"]\n    D -->|Release MPS Đẩy Thông Tin| E[Bước 2.4: Kho Xem DS Chờ Serve FG (Chờ Chuyển Bag) -> Chọn Cấp Thành Phẩm]\n    E --> F[Bước 2.5: Giao Diện Điều Phối Chuyển Bag: Đối Soát TL Đá, TL Kim Loại, Tổng TL]\n    F --> G[Bước 2.6: Xác Nhận Cấp & Đóng Bag Cũ -> Chuyển Trạng Thái: 'Đã Chuyển Sang Bag Mới']\n    G --> H[Bước 2.7: Hoàn Tất Routing Fix -> Nhập Lại Kho TP Sẵn Sàng Giao Hàng]\n  end`;
                navigator.clipboard.writeText(code);
                alert("Đã sao chép mã Mermaid vào Clipboard thành công!");
              }}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              Sao Chép Mã Mermaid
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
            <pre>
              {activeFlow === "cancel"
                ? `flowchart TD
  Start([Khách hàng Yêu Cầu Hủy]) --> QLDH_Init[1. QLĐH Tiếp Nhận & Lập YC Hủy Đơn: Tinh giản tối đa]
  QLDH_Init --> CheckKHSX{Đơn hàng đã chuyển KHSX chưa?}

  %% Nhánh Chưa Chuyển KHSX
  CheckKHSX -- Chưa chuyển --> BaseFormA[Gửi Base Request Form Type A - Hủy nội bộ Kinh doanh]
  BaseFormA --> ApproveA{TPKD / GĐKD phê duyệt?}
  ApproveA -- Từ chối --> RejectA([Hủy yêu cầu - Đơn giữ nguyên])
  ApproveA -- Phê duyệt --> UpdateSOA[QLĐH cập nhật SO gốc: SL Đặt, SL Hủy, SL Còn lại]
  UpdateSOA --> EndA([Hoàn tất hủy đơn nội bộ KD])

  %% Nhánh Đã Chuyển KHSX
  CheckKHSX -- Đã chuyển --> BaseFormB[Gửi Base Request Form Type B - Hủy đơn KHSX/Kho]
  BaseFormB --> ApproveB{GĐKD + GĐSX/KHSX + Kho phê duyệt?}
  ApproveB -- Từ chối --> RejectB([Hủy yêu cầu - Tiếp tục thực hiện SO])
  ApproveB -- Phê duyệt --> UpdateSOB[2. Khi Base duyệt: Cập nhật SL còn-SL hủy trên SO & Bắn 2 thông báo song song]

  %% 2 Nhánh song song sau duyệt Base
  UpdateSOB --> NotifyPacking[Bắn thông báo đến User Đóng gói]
  NotifyPacking --> AdjustDO[3. User Đóng Gói: Chỉnh sửa / Hủy Phiếu giao hàng DO]

  UpdateSOB --> NotifyWh[Bắn thông báo đến Kho Thành Phẩm]
  NotifyWh --> WhClickTransfer[4. Kho TP: Bấm Chuyển sang DS CXLL]
  WhClickTransfer --> CheckItemDO{Item có thuộc Phiếu giao hàng DO nào không?}
  CheckItemDO -- CÓ --> WhErrorDO[❌ Báo lỗi đỏ: Chặn chuyển kho (Yêu cầu Đóng gói sửa DO trước)]
  AdjustDO -.->|Giải phóng ràng buộc DO| CheckItemDO
  CheckItemDO -- KHÔNG / Đã sửa DO --> WhConfirmTransfer[Kho TP xác nhận chuyển sang Kho CXLL thành công]

  %% Lưu DS CXLL & Chuyển đơn
  WhConfirmTransfer --> EnterCXLL[(5. Lưu DS CXLL: Item ghi nhận Tồn khả dụng = SL đã hủy)]
  EnterCXLL --> TransferNewSO[Cho phép pick chọn cho đơn hàng mới: Luồng chuyển đơn]
  TransferNewSO --> EndB([Hoàn tất xử lý hủy đơn])`
                : `flowchart TD
  subgraph KD["Phân Hệ Kinh Doanh (QLĐH)"]
    A([Đơn Hàng Mới Phát Sinh SO2608011]) --> B[Bước 2.1: Gán Item CXLL - Trạng Thái: Đã Gán Đơn Mới / Đã Giữ Chỗ]
    B --> C[Bước 2.2: Xác Nhận Đơn - Tách 2 Luồng: SX Mới (SL Đặt - SL Kho) & Làm Mới Lại (Item CXLL)]
  end

  subgraph KHSX["Phân Hệ Kế Hoạch Sản Xuất (KHSX)"]
    C -->|Gói Đơn 2 Luồng| D[Bước 2.3: KHSX Xử Lý 2 Luồng: SX Mới & Làm Mới (Routing fix) -> Release MPS]
  end

  subgraph KHO_TP["Kho Thành Phẩm (Serve FG & Đóng Bag)"]
    D -->|Release MPS Đẩy Thông Tin| E[Bước 2.4: Kho Xem DS Chờ Serve FG (Chờ Chuyển Bag) -> Chọn Cấp Thành Phẩm]
    E --> F[Bước 2.5: Giao Diện Điều Phối Chuyển Bag: Đối Soát TL Đá, TL Kim Loại, Tổng TL]
    F --> G[Bước 2.6: Xác Nhận Cấp & Đóng Bag Cũ -> Chuyển Trạng Thái: 'Đã Chuyển Sang Bag Mới']
    G --> H[Bước 2.7: Hoàn Tất Routing Fix -> Nhập Lại Kho TP Sẵn Sàng Giao Hàng]
  end`}
            </pre>
          </div>
        </div>
      )}

      {/* 4. CHẾ ĐỘ MA TRẬN TÁC NGHIỆP (MATRIX VIEW) */}
      {viewMode === "matrix" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs text-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
            <span>
              Ma Trận Tác Nghiệp: Phân Định Trách Nhiệm Từng Module ({activeFlow === "cancel" ? "Luồng Hủy Đơn" : "Luồng Chuyển Đơn"})
            </span>
            <span className="text-[11px] text-slate-500 font-normal">Nhấp vào dòng để xem đặc tả chi tiết</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3 w-16 text-center">Bước</th>
                  <th className="py-2.5 px-3 w-40">Phân Hệ</th>
                  <th className="py-2.5 px-4">Tên Thao Tác & Mục Tiêu</th>
                  <th className="py-2.5 px-3 w-44">Người Thực Hiện</th>
                  <th className="py-2.5 px-3 w-44">Điều Kiện Tiên Quyết</th>
                  <th className="py-2.5 px-3 w-44">Trạng Thái Hệ Thống</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentSteps.map((step) => (
                  <tr
                    key={step.id}
                    onClick={() => setSelectedStep(step)}
                    className="hover:bg-teal-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-teal-800">
                      {step.number}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {step.moduleName}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      {step.title}
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                        {step.description}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{step.actor}</td>
                    <td className="py-2.5 px-3 text-slate-600 italic text-[11px] line-clamp-2">
                      {step.prerequisites}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-teal-900 font-semibold">
                      {step.dataTransition.systemState}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MODAL / DRAWER HIỂN THỊ ĐẶC TẢ CHI TIẾT TỪNG BƯỚC */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono bg-teal-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-md">
                  {selectedStep.number}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedStep.title}</h3>
                  <div className="text-[11px] text-teal-300 font-medium">{selectedStep.moduleName}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStep(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Phân hệ phụ trách:</span>
                    <div className="font-bold text-teal-800 mt-0.5">{selectedStep.moduleName}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Người thực hiện:</span>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedStep.actor}</div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Màn hình thao tác:</span>
                  <div className="font-mono text-slate-700 mt-0.5 bg-white p-1.5 rounded border border-slate-200">
                    {selectedStep.screen}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Mục tiêu công việc:</span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{selectedStep.description}</p>
                </div>
              </div>

              <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  <span>Điều kiện tiên quyết (Prerequisites):</span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">{selectedStep.prerequisites}</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Các bước thao tác cụ thể (Step-by-step Actions):</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {selectedStep.actions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-teal-200 bg-teal-50/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px]">
                  <RefreshCw className="h-3.5 w-3.5 text-teal-700" />
                  <span>Chuyển đổi dữ liệu & Trạng thái hệ thống:</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between py-1 border-b border-teal-100">
                    <span className="text-slate-500 font-sans">Mã SO:</span>
                    <span className="font-bold text-slate-800">{selectedStep.dataTransition.soCode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-teal-100">
                    <span className="text-slate-500 font-sans">Mã Bag:</span>
                    <span className="font-bold text-slate-800">{selectedStep.dataTransition.bagCode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-teal-100">
                    <span className="text-slate-500 font-sans">Khách hàng:</span>
                    <span className="font-bold text-slate-800">{selectedStep.dataTransition.customerStatus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-teal-100">
                    <span className="text-slate-500 font-sans">Work Center (WC):</span>
                    <span className="font-bold text-indigo-700">{selectedStep.dataTransition.workCenter}</span>
                  </div>
                  <div className="py-1 text-slate-700 font-sans">
                    <span className="text-slate-500 block text-[10px]">Trạng thái hệ thống:</span>
                    <span className="font-bold text-teal-900">{selectedStep.dataTransition.systemState}</span>
                  </div>
                </div>
              </div>

              <div className="border border-rose-200 bg-rose-50/40 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-700" />
                  <span>Quy định & Lưu ý bắt buộc (Business Rules):</span>
                </div>
                <ul className="space-y-1 pl-1">
                  {selectedStep.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-rose-800 text-[11px] leading-relaxed">
                      <span className="text-rose-500">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Mã bước: {selectedStep.id}</span>
              <button
                type="button"
                onClick={() => setSelectedStep(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
