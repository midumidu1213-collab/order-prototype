"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Coins,
  Search,
  Plus,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  SlidersHorizontal,
  ArrowRight,
  Layers,
  Truck,
  ArrowUpDown,
  BookOpen,
  DollarSign,
  Scale,
  Settings,
  FolderOpen,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  TestTube2,
  Flame,
  Gem,
  Lock,
  Unlock,
  Eye,
  Check,
  RefreshCw
} from "lucide-react";

// Dữ liệu mẫu các phiếu tiếp nhận nguyên liệu CMR tại Kho MAT (Kiểm soát 3 bước - #/ksnl)
export const MOCK_CMR_RECEIVING_LIST = [
  {
    id: "cmr_1",
    cmrCode: "CMR-2610-001",
    date: "28/10/2026",
    maKh: "100008",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    maDoiChieu: "100008",
    loaiNL: "Dẻ thảo (XRF)",
    category: "de_thao",
    // Bước 1: Bao bì
    customerBagWeight: 15.2500, // Cân niêm phong khách
    sevaBagWeight: 15.2450, // Cân thực nhận
    diffBagWeight: 0.0050, // Hụt 0.0050 Lượng (< 0.0100 -> Hợp lệ)
    isPackagingBlocked: false,
    packagingStatus: "Đạt chuẩn",
    // Bước 2: Cân sơ bộ khách khai
    customerTotalWeight: 15.2000,
    customerStoneWeight: 0.2000,
    customerMetalWeight: 15.0000, // 15.2 - 0.2
    customerPurity: 61.0,
    customerEquiv9999: 9.1509, // (15.0 * 61.0) / 99.99
    // Bước 3: Thử nghiệm kỹ thuật & Quang phổ XRF
    measuredPurity: 61.15,
    impuritiesDetected: ["Ni"], // Có tạp chất Niken -> Phạt 0.30%
    impurityDeduction: 0.30,
    effectivePurity: 60.85, // 61.15 - 0.30 = 60.85%
    weightLossNung: 0.0020, // < 0.005 -> Bình thường
    sevaTotalWeight: 15.2000,
    sevaStoneWeight: 0.2005, // Lệch 0.0005 < 0.0010
    sevaMetalWeight: 14.9995, // 15.2000 - 0.2005
    sevaEquiv9999: 9.1281, // (14.9995 * 60.85) / 99.99
    compensationEquiv9999: 0.0228, // max(0, 9.1509 - 9.1281) -> Hụt 0.0228 lượng 24K do tạp chất
    stepStatus: "Bước 3: Hoàn tất kiểm định",
    accountingStatus: "Đã ghi Có (Ví KT)",
    salesStatus: "Đã gán Mã Đối Chiếu (Ví KD)",
    note: "Khấu trừ 0.30% tuổi do lẫn Niken khó phân kim"
  },
  {
    id: "cmr_2",
    cmrCode: "CMR-2610-002",
    date: "28/10/2026",
    maKh: "A HOA",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    maDoiChieu: "A HOA",
    loaiNL: "Hàng hồi (HH)",
    category: "hang_hoi",
    // Bước 1: Bao bì
    customerBagWeight: 20.5000,
    sevaBagWeight: 20.4850,
    diffBagWeight: 0.0150, // Lệch 0.0150 > 0.0100 (1 phân) -> BỊ KHÓA
    isPackagingBlocked: true,
    packagingStatus: "Bị khóa (Lệch > 1 phân)",
    // Bước 2: Khách khai
    customerTotalWeight: 20.4500,
    customerStoneWeight: 0.5000,
    customerMetalWeight: 19.9500,
    customerPurity: 62.0,
    customerEquiv9999: 12.3702,
    // Bước 3: Chưa thực hiện do bị khóa ở Bước 1
    measuredPurity: 0.0,
    impuritiesDetected: [],
    impurityDeduction: 0.0,
    effectivePurity: 0.0,
    weightLossNung: 0.0,
    sevaTotalWeight: 0.0,
    sevaStoneWeight: 0.0,
    sevaMetalWeight: 0.0,
    sevaEquiv9999: 0.0,
    compensationEquiv9999: 0.0,
    stepStatus: "Bước 1: Chờ Giám Đốc Duyệt Mở Khóa",
    accountingStatus: "Tạm treo chứng từ",
    salesStatus: "Chưa ghi nhận",
    note: "Hụt 0.0150 lượng bao bì so với niêm phong -> Đã khóa tự động"
  },
  {
    id: "cmr_3",
    cmrCode: "CMR-2610-003",
    date: "27/10/2026",
    maKh: "200055",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    maDoiChieu: "200055",
    loaiNL: "Dẻ thô (Quầy đúc)",
    category: "de_tho",
    // Bước 1
    customerBagWeight: 10.1000,
    sevaBagWeight: 10.0980,
    diffBagWeight: 0.0020,
    isPackagingBlocked: false,
    packagingStatus: "Đạt chuẩn",
    // Bước 2
    customerTotalWeight: 10.0800,
    customerStoneWeight: 0.0,
    customerMetalWeight: 10.0800,
    customerPurity: 68.0,
    customerEquiv9999: 6.8551,
    // Bước 3
    measuredPurity: 68.10,
    impuritiesDetected: [], // Không có tạp chất lạ
    impurityDeduction: 0.0,
    effectivePurity: 68.10,
    weightLossNung: 0.0015,
    sevaTotalWeight: 10.0800,
    sevaStoneWeight: 0.0,
    sevaMetalWeight: 10.0800,
    sevaEquiv9999: 6.8652,
    compensationEquiv9999: 0.0, // Tuổi thực nhận cao hơn -> không hụt
    stepStatus: "Bước 3: Hoàn tất kiểm định",
    accountingStatus: "Đã ghi Có (Ví KT)",
    salesStatus: "Đã ghi Có (Ví KD)",
    note: "Dẻ thô đúc thu hồi chuẩn 680"
  },
  {
    id: "cmr_4",
    cmrCode: "CMR-2610-004",
    date: "27/10/2026",
    maKh: "TD",
    tenKhach: "TIỆM VÀNG THÀNH DANH (TD)",
    maDoiChieu: "TD",
    loaiNL: "Dẻ L2 (Nấu đúc lại)",
    category: "de_l2",
    // Bước 1
    customerBagWeight: 35.0000,
    sevaBagWeight: 34.9950,
    diffBagWeight: 0.0050,
    isPackagingBlocked: false,
    packagingStatus: "Đạt chuẩn",
    // Bước 2
    customerTotalWeight: 34.9500,
    customerStoneWeight: 0.1500,
    customerMetalWeight: 34.8000,
    customerPurity: 66.0, // Tuổi Dẻ L2 trừ lùi theo F6
    customerEquiv9999: 22.9703,
    // Bước 3
    measuredPurity: 66.20,
    impuritiesDetected: ["Fe"], // Lẫn phôi sắt mài -> Phạt trừ 0.30%
    impurityDeduction: 0.30,
    effectivePurity: 65.90, // 66.20 - 0.30 = 65.90%
    weightLossNung: 0.0060, // > 0.005 -> Cảnh báo hao nung
    sevaTotalWeight: 34.9500,
    sevaStoneWeight: 0.1520, // Lệch đá 0.0020 > 0.0010 (1 ly) -> Cảnh báo đá
    sevaMetalWeight: 34.7980,
    sevaEquiv9999: 22.9341,
    compensationEquiv9999: 0.0362, // Bù trừ hụt 0.0362 lượng 24K vào nợ
    stepStatus: "Bước 3: Hoàn tất kiểm định",
    accountingStatus: "Đã ghi Có (Ví KT)",
    salesStatus: "Đã ghi Có (Ví KD)",
    note: "Lẫn phôi sắt (-0.30%) & Cảnh báo hao nung 0.0060L"
  }
];

export default function MaterialsReceivingPage() {
  const [activeCategory, setActiveCategory] = useState("all"); // "all" | "de_tho" | "de_thao" | "hang_hoi" | "de_l2"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCMRForModal, setSelectedCMRForModal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Lọc dữ liệu theo tab và ô tìm kiếm
  const filteredCMRList = useMemo(() => {
    return MOCK_CMR_RECEIVING_LIST.filter((cmr) => {
      const matchCategory = activeCategory === "all" || cmr.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        cmr.cmrCode.toLowerCase().includes(q) ||
        cmr.tenKhach.toLowerCase().includes(q) ||
        cmr.maKh.toLowerCase().includes(q) ||
        cmr.note.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  // Tổng hợp KPIs trên đầu trang
  const metrics = useMemo(() => {
    let totalCmr = MOCK_CMR_RECEIVING_LIST.length;
    let totalRealMetal = 0;
    let totalEquiv24K = 0;
    let totalCompensation24K = 0;
    let blockedCount = 0;

    MOCK_CMR_RECEIVING_LIST.forEach((c) => {
      totalRealMetal += c.sevaMetalWeight || 0;
      totalEquiv24K += c.sevaEquiv9999 || 0;
      totalCompensation24K += c.compensationEquiv9999 || 0;
      if (c.isPackagingBlocked) blockedCount++;
    });

    return {
      totalCmr,
      totalRealMetal,
      totalEquiv24K,
      totalCompensation24K,
      blockedCount
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 overflow-hidden">
      {/* ======================================================== */}
      {/* 1. SIDEBAR PHÂN HỆ CÔNG NỢ                               */}
      {/* ======================================================== */}
      <aside className="w-64 bg-[#004737] text-white flex flex-col h-full overflow-y-auto shrink-0 text-xs shadow-xl border-r border-[#00382b] select-none">
        <div className="h-16 px-4 border-b border-[#00382b] flex items-center justify-between shrink-0 bg-[#00382b]">
          <Link href="/debt-management" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-amber-300 font-extrabold block leading-none">
                SEVAGO ERP
              </span>
              <span className="text-sm font-bold text-white block truncate leading-tight mt-0.5">
                Quản Lý Công Nợ
              </span>
            </div>
          </Link>
        </div>

        <div className="p-3 space-y-4 flex-1">
          {/* Nhóm 1: TỔNG QUAN & ĐỐI CHIẾU */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              TỔNG QUAN & ĐỐI CHIẾU
            </div>
            <div className="space-y-0.5">
              <Link
                href="/debt-management"
                className="w-full flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 transition-colors"
              >
                <Scale className="mr-2.5 h-4 w-4 text-emerald-300" />
                <span>Bảng Cân Đối Công Nợ</span>
              </Link>
              <Link
                href="/debt-management"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 text-left"
              >
                <div className="flex items-center">
                  <BookOpen className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Sổ Chi Tiết Khách Hàng</span>
                </div>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
                  F17
                </span>
              </Link>
            </div>
          </div>

          {/* Nhóm 2: NGHIỆP VỤ PHÁT SINH */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              NGHIỆP VỤ PHÁT SINH
            </div>
            <div className="space-y-0.5">
              <Link
                href="/debt-management/materials-receiving"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold bg-[#00382b] text-amber-300 border border-emerald-400/40 shadow-xs"
              >
                <div className="flex items-center">
                  <Truck className="mr-2.5 h-4 w-4 text-amber-300" />
                  <span>Tiếp nhận NL (Kho MAT)</span>
                </div>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                  {MOCK_CMR_RECEIVING_LIST.length}
                </span>
              </Link>

              <Link
                href="/debt-management"
                className="flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60"
              >
                <FileText className="mr-2.5 h-4 w-4 text-emerald-300" />
                <span>Hóa Đơn TP (Kho FGW)</span>
              </Link>

              <Link
                href="/debt-management"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 text-left"
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Sổ Bút Toán Bất Biến</span>
                </div>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
                  9 GD
                </span>
              </Link>
            </div>
          </div>

          {/* Nhóm 3: CẤU HÌNH & CHÍNH SÁCH */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              CẤU HÌNH & CHÍNH SÁCH
            </div>
            <div className="space-y-0.5">
              <Link
                href="/debt-management/rules-config"
                className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 transition-colors"
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Quy Ước Tuổi & Hao Lai</span>
                </div>
                <span className="text-[9px] bg-emerald-800/80 text-emerald-200 px-1 py-0.5 rounded font-mono">
                  RULES
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[#00382b] shrink-0 text-center text-emerald-300/70 text-[10px]">
          Kho MAT Tiếp Nhận NL v2.6 · Chuẩn KSNL
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. KHU VỰC CHÍNH: KIỂM SOÁT TIẾP NHẬN NL KHO MAT (F10)   */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-0.5">
              <Link href="/debt-management" className="hover:underline">Quản lý công nợ</Link>
              <span>/</span>
              <span>Nghiệp vụ phát sinh</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Công nợ Tiếp nhận NL (Phiếu CMR)</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Kiểm Soát 3 Bước Tiếp Nhận Nguyên Liệu Kho MAT (`#/ksnl`)</span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#004737] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                MD
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  Nguyễn Thị Mỹ Dung
                </span>
                <span className="text-[10px] text-slate-500 block leading-none">
                  Kế toán Công nợ (S0010)
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Thông báo Toast */}
        {toastMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg("")} className="text-emerald-700 hover:text-emerald-900">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* BANNER ĐÚNG CHUẨN KSNL THEO HÌNH ẢNH CHỊ ĐẸP CUNG CẤP */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-xs text-xs text-emerald-950 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-[#004737] text-amber-300 shrink-0 mt-0.5">
              <TestTube2 className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-emerald-900 text-sm">
                  Quy Chế Ghi Nhận Công Nợ 2 Thời Điểm & 4 Nhóm Nguyên Liệu
                </h2>
                <span className="bg-[#004737] text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Đang xem: Góc nhìn Ví Kế Toán & Ví Kinh Doanh
                </span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                <li>
                  • <strong>Ví Kế toán:</strong> Ghi Có nợ tạm tính ngay khi cân sơ bộ. Sau đo phổ/tính đá nếu lệch → tự sinh bút toán điều chỉnh (`LechDe`).
                </li>
                <li>
                  • <strong>Ví Kinh doanh:</strong> Chỉ ghi Có nợ sau khi từng row nguyên liệu hoàn tất kiểm định chi tiết tại trạm kiểm tra và gán đúng <strong>Mã đối chiếu công nợ (debt_account)</strong>.
                </li>
                <li>
                  • <strong>Hàng hồi mới dạng Đơn hàng:</strong> Nhận dẻ BẢO HÀNH (sửa lỗi kỹ thuật, tiền công sửa 0 VNĐ, xuất giao lại mới chốt nợ).
                </li>
              </ul>
            </div>
          </div>

          {/* 4 THẺ KPI TỔNG HỢP TIẾP NHẬN */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Tổng Phiếu Tiếp Nhận (CMR)
              </span>
              <div className="text-xl font-black text-slate-900 mt-1 font-mono">
                {metrics.totalCmr} Phiếu
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {metrics.blockedCount > 0 ? (
                  <span className="text-rose-600 font-bold">{metrics.blockedCount} phiếu bị khóa bao bì</span>
                ) : (
                  <span className="text-emerald-700 font-bold">100% bao bì niêm phong đạt chuẩn</span>
                )}
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Vàng Kim Loại Thực Nhận
              </span>
              <div className="text-xl font-black text-amber-800 mt-1 font-mono">
                {metrics.totalRealMetal.toFixed(4)} Lượng
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Đã trừ trọng lượng đá kiểm định
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Quy Đổi Vàng 24K (99.99%)
              </span>
              <div className="text-xl font-black text-emerald-800 mt-1 font-mono">
                {metrics.totalEquiv24K.toFixed(4)} Lượng
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Sau khi khấu trừ phạt tạp chất (-0.30%)
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Bù Trừ Hụt 24K Giảm Nợ (CS8)
              </span>
              <div className="text-xl font-black text-rose-600 mt-1 font-mono">
                {metrics.totalCompensation24K > 0 ? `-${metrics.totalCompensation24K.toFixed(4)} Lượng` : "—"}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Giảm trừ số vàng ghi Có cho khách
              </span>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU PHIẾU CMR VÀ QUY TRÌNH 3 BƯỚC */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Toolbar Tabs & Actions */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center space-x-1">
                {[
                  { key: "all", label: "Tất cả nhóm NL", count: MOCK_CMR_RECEIVING_LIST.length },
                  { key: "de_thao", label: "1. Dẻ thảo (XRF)", count: MOCK_CMR_RECEIVING_LIST.filter(c => c.category === "de_thao").length },
                  { key: "hang_hoi", label: "2. Hàng hồi (HH)", count: MOCK_CMR_RECEIVING_LIST.filter(c => c.category === "hang_hoi").length },
                  { key: "de_tho", label: "3. Dẻ thô (Quầy đúc)", count: MOCK_CMR_RECEIVING_LIST.filter(c => c.category === "de_tho").length },
                  { key: "de_l2", label: "4. Dẻ L2 (Nấu lại)", count: MOCK_CMR_RECEIVING_LIST.filter(c => c.category === "de_l2").length }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCategory === tab.key
                        ? "bg-white text-[#004737] shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded-full font-mono">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => showToast("Đã trích xuất danh sách Phiếu CMR ra Excel")}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Xuất Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Mở form lập Phiếu Tiếp Nhận CMR mới tại Quầy Kho MAT")}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#004737] hover:bg-[#00382b] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Lập Phiếu CMR</span>
                </button>
              </div>
            </div>

            {/* Thanh Tìm Kiếm Cột */}
            <div className="px-6 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="relative w-80">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo Mã CMR, Mã KH, tên khách..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Đang hiển thị <strong>{filteredCMRList.length}</strong> phiếu tiếp nhận
              </span>
            </div>

            {/* BẢNG DỮ LIỆU TIẾP NHẬN KHO MAT */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 select-none">
                    <th className="py-3 px-3 w-28">MÃ CMR</th>
                    <th className="py-3 px-3 w-24">NGÀY</th>
                    <th className="py-3 px-3 w-48">KHÁCH HÀNG & MÃ SỔ</th>
                    <th className="py-3 px-3 w-32">NHÓM NGUYÊN LIỆU</th>
                    <th className="py-3 px-2 text-right w-28" title="Bước 1: Bao bì niêm phong">
                      BƯỚC 1: BAO BÌ
                    </th>
                    <th className="py-3 px-2 text-right w-28" title="Bước 2: Cân sơ bộ khách khai">
                      BƯỚC 2: KHÁCH KHAI
                    </th>
                    <th className="py-3 px-3 text-right w-32 bg-emerald-50/50 text-emerald-950" title="Bước 3: Vàng ròng thực nhận">
                      BƯỚC 3: THỰC NHẬN
                    </th>
                    <th className="py-3 px-2 text-right w-28 text-rose-700 font-bold" title="Bù trừ hụt 24K">
                      HỤT 24K BÙ TRỪ
                    </th>
                    <th className="py-3 px-3 text-center w-36">TRẠNG THÁI 2 VÍ</th>
                    <th className="py-3 px-3 text-center w-20">CHI TIẾT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCMRList.map((cmr) => (
                    <tr key={cmr.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {cmr.cmrCode}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {cmr.date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{cmr.tenKhach}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Mã sổ: <strong>{cmr.maDoiChieu}</strong>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                          {cmr.loaiNL}
                        </span>
                      </td>

                      {/* Cột Bước 1: Bao Bì */}
                      <td className="py-3 px-2 text-right font-mono">
                        {cmr.isPackagingBlocked ? (
                          <div className="text-rose-600 font-bold">
                            <span className="block">Khóa &gt;1 phân</span>
                            <span className="text-[10px] text-rose-500 font-normal">
                              Δ: {cmr.diffBagWeight.toFixed(4)}L
                            </span>
                          </div>
                        ) : (
                          <div className="text-emerald-700 font-semibold">
                            <span>Đạt chuẩn</span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              Δ: {cmr.diffBagWeight.toFixed(4)}L
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Cột Bước 2: Khách khai */}
                      <td className="py-3 px-2 text-right font-mono text-[11px]">
                        <div className="text-slate-800 font-bold">{cmr.customerMetalWeight.toFixed(4)}L</div>
                        <div className="text-[10px] text-amber-700">Tuổi: {cmr.customerPurity.toFixed(1)}%</div>
                      </td>

                      {/* Cột Bước 3: Seva Thực Nhận */}
                      <td className="py-3 px-3 text-right font-mono text-[11px] bg-emerald-50/30">
                        {cmr.stepStatus.includes("Bước 1") ? (
                          <span className="text-slate-400 italic">Chưa kiểm tra</span>
                        ) : (
                          <>
                            <div className="font-bold text-emerald-900">{cmr.sevaMetalWeight.toFixed(4)} Lượng</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">
                              Tuổi hiệu lực: {cmr.effectivePurity.toFixed(2)}%
                              {cmr.impurityDeduction > 0 && <span className="text-rose-600 ml-0.5">(-0.3%)</span>}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Cột Bù trừ 24K */}
                      <td className="py-3 px-2 text-right font-mono font-bold text-[11px]">
                        {cmr.compensationEquiv9999 > 0 ? (
                          <span className="text-rose-600">-{cmr.compensationEquiv9999.toFixed(4)}L</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Cột Trạng Thái 2 Ví */}
                      <td className="py-3 px-3 text-center">
                        <div className="space-y-1">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold block bg-blue-50 text-blue-700 border border-blue-200">
                            {cmr.accountingStatus}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold block ${
                              cmr.salesStatus.includes("Đã")
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {cmr.salesStatus}
                          </span>
                        </div>
                      </td>

                      {/* Nút Xem Chi Tiết */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedCMRForModal(cmr)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                          title="Xem biên bản 3 bước"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL CHI TIẾT BIÊN BẢN 3 BƯỚC CỦA PHIẾU CMR */}
        {selectedCMRForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 bg-[#004737] text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TestTube2 className="h-5 w-5 text-amber-300" />
                  <div>
                    <h3 className="font-bold text-sm">
                      Chi Tiết Kiểm Soát Tiếp Nhận 3 Bước: {selectedCMRForModal.cmrCode}
                    </h3>
                    <p className="text-[11px] text-emerald-200">
                      Khách hàng: {selectedCMRForModal.tenKhach} ({selectedCMRForModal.maDoiChieu})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCMRForModal(null)}
                  className="text-emerald-200 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                {/* BƯỚC 1: KIỂM SOÁT BAO BÌ */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                        1
                      </span>
                      <span>Bước 1: Chênh Lệch Trọng Lượng Bao Bì / Niêm Phong</span>
                    </span>
                    {selectedCMRForModal.isPackagingBlocked ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>BỊ KHÓA (Lệch &gt; 1 phân)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>ĐẠT CHUẨN</span>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div>Cân khách khai: <strong>{selectedCMRForModal.customerBagWeight.toFixed(4)} L</strong></div>
                    <div>Cân Seva thực nhận: <strong>{selectedCMRForModal.sevaBagWeight.toFixed(4)} L</strong></div>
                    <div>
                      ΔBao bì:{" "}
                      <strong className={selectedCMRForModal.isPackagingBlocked ? "text-rose-600" : "text-emerald-700"}>
                        {selectedCMRForModal.diffBagWeight.toFixed(4)} Lượng
                      </strong>
                    </div>
                  </div>
                  {selectedCMRForModal.isPackagingBlocked && (
                    <p className="text-[11px] text-rose-700 italic bg-rose-50 p-2 rounded border border-rose-200">
                      Ngưỡng khóa: ΔBao bì &gt; 0.0100 Lượng (1 phân). Bắt buộc Giám Đốc phê duyệt mới mở khóa sang Bước 2!
                    </p>
                  )}
                </div>

                {/* BƯỚC 2: CÂN SƠ BỘ KHÁCH KHAI */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                        2
                      </span>
                      <span>Bước 2: Cân Sơ Bộ Trọng Lượng Khách Khai</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div>Tổng cân: <strong>{selectedCMRForModal.customerTotalWeight.toFixed(4)} L</strong></div>
                    <div>Đá khai: <strong>{selectedCMRForModal.customerStoneWeight.toFixed(4)} L</strong></div>
                    <div>Kim loại: <strong>{selectedCMRForModal.customerMetalWeight.toFixed(4)} L</strong></div>
                    <div>Tuổi khách khai: <strong>{selectedCMRForModal.customerPurity.toFixed(1)}%</strong></div>
                    <div className="col-span-2 text-amber-800">
                      Quy 24K dự kiến: <strong>{selectedCMRForModal.customerEquiv9999.toFixed(4)} Lượng</strong>
                    </div>
                  </div>
                </div>

                {/* BƯỚC 3: THỬ NGHIỆM & QUANG PHỔ XRF */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                        3
                      </span>
                      <span>Bước 3: Thử Nghiệm Kỹ Thuật, Quang Phổ XRF & Bù Trừ 24K</span>
                    </span>
                  </div>

                  {selectedCMRForModal.stepStatus.includes("Bước 1") ? (
                    <p className="text-slate-500 italic">Đang tạm dừng do Bước 1 chưa được mở khóa.</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                        <div>Tuổi đo XRF: <strong>{selectedCMRForModal.measuredPurity.toFixed(2)}%</strong></div>
                        <div>
                          Tạp chất lạ:{" "}
                          <strong>
                            {selectedCMRForModal.impuritiesDetected.length > 0
                              ? selectedCMRForModal.impuritiesDetected.join(", ")
                              : "Không có"}
                          </strong>
                        </div>
                        <div>
                          Phạt tạp chất:{" "}
                          <strong className="text-rose-600">
                            {selectedCMRForModal.impurityDeduction > 0 ? `-${selectedCMRForModal.impurityDeduction.toFixed(2)}%` : "0%"}
                          </strong>
                        </div>
                        <div className="col-span-3 text-emerald-900 bg-white p-2 rounded border border-emerald-300">
                          Tuổi hiệu lực tính nợ:{" "}
                          <strong className="text-sm">
                            {selectedCMRForModal.effectivePurity.toFixed(2)}%
                          </strong>{" "}
                          (Đã trừ phạt nếu có Ni, Fe, Pd, M)
                        </div>
                      </div>

                      <div className="pt-2 border-t border-emerald-200 grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div>Vàng ròng thực nhận: <strong>{selectedCMRForModal.sevaMetalWeight.toFixed(4)} Lượng</strong></div>
                        <div>Quy 24K thực nhận: <strong>{selectedCMRForModal.sevaEquiv9999.toFixed(4)} Lượng</strong></div>
                        <div className="col-span-2 text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 font-bold">
                          Bù trừ hụt 24K (giảm nợ CS8):{" "}
                          {selectedCMRForModal.compensationEquiv9999 > 0
                            ? `-${selectedCMRForModal.compensationEquiv9999.toFixed(4)} Lượng`
                            : "0.0000 Lượng (Không hụt)"}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 italic">
                    Ghi chú: {selectedCMRForModal.note}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCMRForModal(null)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
