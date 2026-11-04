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
  Calculator,
  ShieldCheck,
  History,
  Lock
} from "lucide-react";

import { CUSTOMER_PROFILES } from "@/data/debtBalanceMockData";

// Dữ liệu mẫu cấu hình Quy ước tuổi công nợ & Hao lai theo đặc tả chuẩn Rules Engine (#/rules-settings)
export const MOCK_RULES_CONFIG = [
  {
    id: "rule_1",
    stt: 1,
    maKh: "100008",
    maDoiChieu: "100008",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    stock_fineness: 61.0, // Tuổi vàng xuất kho
    delivery_debt_fineness: 62.0, // Tuổi vàng tính nợ đối tác
    conversionRate: 1.01639, // Math.round((62/61) * 1e5) / 1e5
    lossFactor: 1.639, // (1.01639 - 1) * 100
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "BOD - Anh Phương", reason: "Chính sách đại lý sỉ TP.HCM" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE", // "ACTIVE" | "SUPERSEDED"
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.25,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 50.0,
    hanMucTien: 400000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Đại lý sỉ TP.HCM - Mọi giao dịch quy về tuổi 62%"
  },
  {
    id: "rule_1_r",
    stt: 2,
    maKh: "100008",
    maDoiChieu: "100008_R",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND (Bán Đứt)",
    stock_fineness: 61.0,
    delivery_debt_fineness: 61.0,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "Kế toán trưởng", reason: "Giao dịch bán đứt tiền mặt" },
    isCashOnly_R: true, // Hậu tố _R: Ngắt nợ vàng (W_billed = 0), 100% vào trục Tiền
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 0.0,
    hanMucTien: 400000000,
    hinhThucSo: "Không Sổ",
    status: "Đang áp dụng",
    note: "Sổ bán đứt tiền mặt: W_billed = 0.0000 lượng, 100% nợ tiền"
  },
  {
    id: "rule_2",
    stt: 3,
    maKh: "200055",
    maDoiChieu: "200055",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    stock_fineness: 68.0,
    delivery_debt_fineness: 68.0,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "Kế toán trưởng", reason: "Tuổi xuất chuẩn 680" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.25,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 80.0,
    hanMucTien: 500000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Đại lý sỉ miền Tây - Tuổi quy ước 68%"
  },
  {
    id: "rule_3",
    stt: 4,
    maKh: "A HOA",
    maDoiChieu: "A HOA",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    stock_fineness: 61.0,
    delivery_debt_fineness: 62.0,
    conversionRate: 1.01639,
    lossFactor: 1.639,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "BOD - Anh Phương", reason: "Thỏa thuận hao lai chợ Thiếc" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 40.0,
    hanMucTien: 300000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Khách chợ truyền thống - Đối chiếu tuổi 62%"
  },
  {
    id: "rule_4",
    stt: 5,
    maKh: "TAN_DINH",
    maDoiChieu: "TAN_DINH",
    tenKhach: "ĐẠI LÝ VÀNG BẠC TÂN ĐỊNH",
    stock_fineness: 68.0,
    delivery_debt_fineness: 68.0,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "Kế toán trưởng", reason: "Đại lý chuẩn" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 30.0,
    hanMucTien: 200000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Bán buôn trang sức nữ"
  },
  {
    id: "rule_5",
    stt: 6,
    maKh: "KHQQ",
    maDoiChieu: "KHQQ",
    tenKhach: "QUỸ QUẢN LÝ VÀNG ĐỐI TÁC KHQQ (BÊN THỨ 3)",
    stock_fineness: 99.99,
    delivery_debt_fineness: 99.99,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "BOD - Anh Phương", reason: "Quỹ ủy thác vàng 24K bảo lãnh" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.0,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 500.0,
    hanMucTien: 5000000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Quỹ ủy thác vàng 24K bảo lãnh nợ"
  },
  {
    id: "rule_6",
    stt: 7,
    maKh: "K_MAI",
    maDoiChieu: "K_MAI",
    tenKhach: "DOANH NGHIỆP KIM HOÀN MAI",
    stock_fineness: 62.0,
    delivery_debt_fineness: 62.0,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "Kế toán trưởng", reason: "Khách lẻ tỉnh" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 50.0,
    hanMucTien: 100000000,
    hinhThucSo: "Không Sổ",
    status: "Đang áp dụng",
    note: "Khách tỉnh - Đối chiếu từng toa giao"
  },
  {
    id: "rule_7",
    stt: 8,
    maKh: "K10",
    maDoiChieu: "K10",
    tenKhach: "K10 (CHỢ AN ĐÔNG)",
    stock_fineness: 61.0,
    delivery_debt_fineness: 62.0,
    conversionRate: 1.01639,
    lossFactor: 1.639,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "BOD - Anh Phương", reason: "Đại lý chợ An Đông" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 400.0,
    hanMucTien: 1500000000,
    hinhThucSo: "Có Sổ",
    status: "Cảnh báo nợ",
    note: "Khách chợ quy mô lớn - Dư nợ vàng cao"
  },
  {
    id: "rule_8",
    stt: 9,
    maKh: "TD",
    maDoiChieu: "TD",
    tenKhach: "TIỆM VÀNG THÀNH DANH (TD)",
    stock_fineness: 68.0,
    delivery_debt_fineness: 68.0,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "Kế toán trưởng", reason: "Khách VIP 680" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 500.0,
    hanMucTien: 4000000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Đại lý VIP vàng 680"
  },
  {
    id: "rule_9",
    stt: 10,
    maKh: "SJC",
    maDoiChieu: "SJC",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ SJC",
    stock_fineness: 75.0,
    delivery_debt_fineness: 75.0,
    conversionRate: 1.00000,
    lossFactor: 0.000,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "Kế toán trưởng", reason: "Chuỗi SJC chuẩn 75%" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.15,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 1000.0,
    hanMucTien: 10000000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Tổ chức chuỗi quy chuẩn tuổi 75%"
  },
  {
    id: "rule_10",
    stt: 11,
    maKh: "PNJ",
    maDoiChieu: "PNJ",
    tenKhach: "CÔNG TY CP VÀNG BẠC ĐÁ QUÝ PHÚ NHUẬN (PNJ)",
    stock_fineness: 75.0,
    delivery_debt_fineness: 75.2,
    conversionRate: 1.00267,
    lossFactor: 0.267,
    isInvertedLoss: false,
    bodApproval: { approved: true, approver: "BOD - Anh Phương", reason: "Gia công kỹ thuật cao PNJ" },
    isCashOnly_R: false,
    effective_from: "2026-01-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.15,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 800.0,
    hanMucTien: 8000000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Đối tác gia công chiến lược - Sheet De_PNJ"
  },
  {
    id: "rule_11_spec",
    stt: 12,
    maKh: "VIP_SPEC",
    maDoiChieu: "VIP_SPEC",
    tenKhach: "ĐỐI TÁC NGOẠI LỆ (HAO LAI NGƯỢC)",
    stock_fineness: 68.0, // Xuất kho vàng 680
    delivery_debt_fineness: 61.0, // Nhưng tính nợ tuổi 610
    conversionRate: 0.89706, // 61 / 68
    lossFactor: -10.294, // (0.89706 - 1) * 100
    isInvertedLoss: true, // Cảnh báo Hao lai ngược (-%)
    bodApproval: {
      approved: true,
      approver: "Ban Giám Đốc (BOD)",
      reason: "Chấp thuận chiết khấu thương mại hỗ trợ khai trương chi nhánh mới (Trên 20 ký tự)"
    },
    isCashOnly_R: false,
    effective_from: "2026-10-01",
    effective_to: null,
    versionStatus: "ACTIVE",
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 100.0,
    hanMucTien: 500000000,
    hinhThucSo: "Có Sổ",
    status: "BOD Phê duyệt",
    note: "Hao lai ngược (-10.294%) - Bắt buộc BOD duyệt"
  }
];

// Dữ liệu mẫu bảng quy ước Hàng Hồi (HH) và Dẻ L2 (F6)
export const MOCK_HH_L2_RULES = [
  { id: "hh_1", stt: 1, maKh: "A HOA", tenKhach: "TIỆM VÀNG A HÒA", tuoiGiao: 62.0, tuoiHH: 60.5, tuoiL2: 60.0, ghiChu: "Hàng hồi trừ lùi 1.5 tuổi" },
  { id: "hh_2", stt: 2, maKh: "200055", tenKhach: "TIỆM VÀNG KIM HƯNG", tuoiGiao: 68.0, tuoiHH: 66.5, tuoiL2: 66.0, ghiChu: "Hàng hồi trừ lùi 1.5 tuổi" },
  { id: "hh_3", stt: 3, maKh: "TD", tenKhach: "TIỆM VÀNG THÀNH DANH", tuoiGiao: 68.0, tuoiHH: 66.5, tuoiL2: 66.0, ghiChu: "Dẻ L2 nấu đúc lại" },
  { id: "hh_4", stt: 4, maKh: "PNJ", tenKhach: "PNJ", tuoiGiao: 75.2, tuoiHH: 74.0, tuoiL2: 73.5, ghiChu: "Theo quy chuẩn kỹ thuật PNJ" }
];

export default function RulesConfigPage() {
  const [activeTab, setActiveTab] = useState("rules"); // "rules" | "hh_l2" | "calc_tool"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "stt", direction: "asc" });
  const [editingRule, setEditingRule] = useState(null);
  const [viewingApprovalModal, setViewingApprovalModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // State cho công cụ tính thử nợ vàng (calculateBilledWeight)
  const [calcGrossWeight, setCalcGrossWeight] = useState(10.5000);
  const [calcStockFineness, setCalcStockFineness] = useState(61.0);
  const [calcDeliveryFineness, setCalcDeliveryFineness] = useState(62.0);
  const [calcIsCashOnly, setCalcIsCashOnly] = useState(false);

  // Tính toán realtime của công cụ tính
  const calcResults = useMemo(() => {
    if (calcIsCashOnly) {
      return {
        conversionRate: 1.0,
        lossFactor: 0.0,
        isInverted: false,
        billedWeight: 0.0,
        note: "Mã hậu tố _R (Bán đứt): W_billed = 0.0000 lượng, 100% nợ tiền"
      };
    }
    const stock = calcStockFineness || 1;
    const delivery = calcDeliveryFineness || 1;
    const rate = Math.round((delivery / stock) * 1e5) / 1e5;
    const loss = Math.round((rate - 1) * 100 * 1e3) / 1e3;
    const billed = Math.round(calcGrossWeight * rate * 1e4) / 1e4;
    return {
      conversionRate: rate,
      lossFactor: loss,
      isInverted: delivery < stock,
      billedWeight: billed,
      note: delivery < stock ? "Cảnh báo: Hao lai ngược (-%), cần BOD duyệt!" : "Hao lai gia công hợp lệ"
    };
  }, [calcGrossWeight, calcStockFineness, calcDeliveryFineness, calcIsCashOnly]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const filteredRules = useMemo(() => {
    let list = MOCK_RULES_CONFIG.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        r.maKh.toLowerCase().includes(q) ||
        r.tenKhach.toLowerCase().includes(q) ||
        r.maDoiChieu.toLowerCase().includes(q) ||
        r.note.toLowerCase().includes(q)
      );
    });

    if (sortConfig.key) {
      list.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = (valB || "").toLowerCase();
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [searchQuery, sortConfig]);

  const handleSaveRule = (e) => {
    e.preventDefault();
    // Validate nếu hao lai ngược thì lý do BOD phê duyệt phải >= 20 ký tự
    const stock = parseFloat(editingRule.stock_fineness) || 1;
    const delivery = parseFloat(editingRule.delivery_debt_fineness) || 1;
    const isInverted = delivery < stock;

    if (isInverted) {
      const reason = editingRule.bodApproval?.reason?.trim() || "";
      if (reason.length < 20) {
        alert("LỖI BẮT BUỘC: Phát hiện Hao lai ngược (tuổi giao nợ < tuổi xuất kho)! Lý do phê duyệt của Kế toán trưởng/BOD phải có độ dài tối thiểu 20 ký tự.");
        return;
      }
    }

    const rate = Math.round((delivery / stock) * 1e5) / 1e5;
    const loss = Math.round((rate - 1) * 100 * 1e3) / 1e3;

    showToast(`Đã lưu Quy ước cho [${editingRule.maDoiChieu}]: Tỷ lệ quy đổi = ${rate.toFixed(5)}, Hao lai = ${loss > 0 ? "+" : ""}${loss.toFixed(3)}%!`);
    setEditingRule(null);
  };

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
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 transition-colors"
              >
                <div className="flex items-center">
                  <Truck className="mr-2.5 h-4 w-4 text-amber-300" />
                  <span>Tiếp nhận NL (Kho MAT)</span>
                </div>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                  KSNL
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
                className="flex items-center justify-between px-3 py-2 rounded-lg font-bold bg-[#00382b] text-amber-300 border border-emerald-400/40 shadow-xs"
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2.5 h-4 w-4 text-amber-300" />
                  <span>Quy Ước Tuổi & Hao Lai</span>
                </div>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.5 rounded font-black font-mono">
                  RULES
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[#00382b] shrink-0 text-center text-emerald-300/70 text-[10px]">
          SEVAGO Rules Engine v2.6 · As-Of Active
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. KHU VỰC NỘI DUNG CHÍNH (RULES ENGINE - F4/F5/F6)      */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-0.5">
              <Link href="/debt-management" className="hover:underline">Quản lý công nợ</Link>
              <span>/</span>
              <span>Cấu hình & Chính sách</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Quy Ước Tuổi & Hao Lai (Rules Engine)</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Cấu Hình Quy Ước Tuổi, Hao Lai & Kiểm Soát Hao Lai Ngược (`#/rules-settings`)</span>
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

        {/* Thông báo Toast nếu có */}
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
          {/* Hộp Giải thích Nguyên lý Cốt lõi của Chị đẹp */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 shadow-xs text-xs text-emerald-950 flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-[#004737] text-amber-300 shrink-0 mt-0.5">
              <Coins className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <h2 className="font-bold text-emerald-900 text-sm flex items-center space-x-2">
                <span>Thuật Toán Cốt Lõi: Tỷ Lệ Quy Đổi, Hao Lai (+%) & Chốt Chặn Hao Lai Ngược (-%)</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase">
                  Mã Nguồn Chuẩn
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-200">
                  <div className="font-bold text-emerald-900">1. Tỷ Lệ Quy Đổi (`conversionRate`)</div>
                  <div className="font-mono text-emerald-800 font-bold mt-0.5">delivery_debt_fineness / stock_fineness</div>
                  <div className="text-slate-600 text-[10px] mt-0.5">Lấy 5 số lẻ (Ví dụ: 62 / 61 = 1.01639)</div>
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-emerald-200">
                  <div className="font-bold text-emerald-900">2. Hao Lai Gia Công (% Loss)</div>
                  <div className="font-mono text-emerald-800 font-bold mt-0.5">(conversionRate - 1) × 100</div>
                  <div className="text-slate-600 text-[10px] mt-0.5">Lấy 3 số lẻ (Ví dụ: +1.639% trên lượng giao)</div>
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-rose-200 bg-rose-50/50">
                  <div className="font-bold text-rose-900 flex items-center space-x-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                    <span>3. Chặn Hao Lai Ngược (`isInverted`)</span>
                  </div>
                  <div className="font-mono text-rose-700 font-bold mt-0.5">delivery_fineness &lt; stock_fineness</div>
                  <div className="text-rose-600 text-[10px] mt-0.5">Bắt buộc Kế toán trưởng/BOD duyệt (Lý do ≥ 20 ký tự)</div>
                </div>
              </div>
            </div>
          </div>

          {/* CÔNG CỤ TÍNH THỬ KHỐI LƯỢNG NỢ VÀNG (CALCULATOR WIDGET) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md text-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-sm text-slate-100">
                  Công Cụ Kiểm Thử Thuật Toán Ghi Nợ (`calculateBilledWeight`)
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                  BilledWeight = GrossWeight × conversionRate
                </span>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer text-[11px] text-amber-300">
                <input
                  type="checkbox"
                  checked={calcIsCashOnly}
                  onChange={(e) => setCalcIsCashOnly(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span>Mã Bán Đứt Hậu Tố `_R` (Ngắt nợ vàng, 100% nợ tiền)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Trọng lượng xuất (Lượng)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={calcGrossWeight}
                  onChange={(e) => setCalcGrossWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-mono font-bold text-amber-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tuổi vàng xuất kho (%)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={calcIsCashOnly}
                  value={calcStockFineness}
                  onChange={(e) => setCalcStockFineness(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-mono font-bold text-slate-200 text-xs focus:outline-none disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tuổi tính nợ khách (%)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={calcIsCashOnly}
                  value={calcDeliveryFineness}
                  onChange={(e) => setCalcDeliveryFineness(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 font-mono font-bold text-slate-200 text-xs focus:outline-none disabled:opacity-40"
                />
              </div>

              <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block">Tỷ lệ quy đổi / Hao lai</span>
                <span className="font-mono font-bold text-amber-300 block text-xs">
                  {calcResults.conversionRate.toFixed(5)} ({calcResults.lossFactor > 0 ? "+" : ""}{calcResults.lossFactor.toFixed(3)}%)
                </span>
              </div>

              <div className="p-2 bg-emerald-950/80 rounded-lg border border-emerald-700 text-center">
                <span className="text-[10px] text-emerald-300 block font-semibold">Khối lượng nợ ghi sổ (`W_billed`)</span>
                <span className="font-mono font-black text-emerald-400 block text-sm">
                  {calcResults.billedWeight.toFixed(4)} Lượng
                </span>
              </div>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU CẤU HÌNH QUY ƯỚC */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Toolbar Tabs & Actions */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("rules")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "rules"
                      ? "bg-white text-[#004737] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Quy Ước Tuổi & Hao Lai Khách Hàng (F4/F5)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
                    {filteredRules.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("hh_l2")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "hh_l2"
                      ? "bg-white text-[#004737] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-amber-600" />
                  <span>Quy Ước Hàng Hồi (HH) & Dẻ L2 (F6)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-mono font-bold">
                    {MOCK_HH_L2_RULES.length}
                  </span>
                </button>
              </div>

              {/* Nút thao tác thêm mới & xuất Excel */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => showToast("Đã trích xuất Bảng Quy ước ra Excel")}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Xuất Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRule({
                      stt: filteredRules.length + 1,
                      maKh: "",
                      maDoiChieu: "",
                      tenKhach: "",
                      stock_fineness: 61.0,
                      delivery_debt_fineness: 62.0,
                      conversionRate: 1.01639,
                      lossFactor: 1.639,
                      isInvertedLoss: false,
                      bodApproval: { approved: false, approver: "", reason: "" },
                      isCashOnly_R: false,
                      effective_from: "2026-10-28",
                      effective_to: null,
                      versionStatus: "ACTIVE",
                      laiTrongDinhMuc: 1.0,
                      laiNgoaiThreshold: 1.25,
                      hanMucVang: 50.0,
                      hanMucTien: 300000000,
                      hinhThucSo: "Có Sổ",
                      status: "Đang áp dụng",
                      note: ""
                    });
                  }}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#004737] hover:bg-[#00382b] text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Thêm Quy Ước Mới</span>
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
                  placeholder="Tìm theo Mã KH, mã đối chiếu, tên khách, ghi chú..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Đang hiển thị <strong>{filteredRules.length}</strong> quy ước khách hàng
              </span>
            </div>

            {/* TAB 1: BẢNG QUY ƯỚC CHÍNH (F4/F5) */}
            {activeTab === "rules" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <th
                        onClick={() => handleSort("stt")}
                        className="py-3 px-3 w-12 text-center cursor-pointer hover:bg-slate-200/70"
                      >
                        STT
                      </th>
                      <th
                        onClick={() => handleSort("maDoiChieu")}
                        className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center space-x-1">
                          <span>MÃ ĐỐI CHIẾU</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("tenKhach")}
                        className="py-3 px-3 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center space-x-1">
                          <span>TÊN KHÁCH HÀNG</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("stock_fineness")}
                        className="py-3 px-2 text-right w-24 cursor-pointer hover:bg-slate-200/70"
                        title="Tuổi vàng xuất kho"
                      >
                        XUẤT KHO
                      </th>
                      <th
                        onClick={() => handleSort("delivery_debt_fineness")}
                        className="py-3 px-2 text-right w-24 bg-amber-50/60 cursor-pointer hover:bg-amber-100/70 text-amber-950 font-black"
                        title="Tuổi vàng tính nợ đối tác"
                      >
                        TÍNH NỢ KH
                      </th>
                      <th
                        onClick={() => handleSort("conversionRate")}
                        className="py-3 px-2 text-right w-28 cursor-pointer hover:bg-slate-200/70 font-mono"
                        title="Tỷ lệ quy đổi = delivery / stock (lấy 5 số lẻ)"
                      >
                        TỶ LỆ Q.ĐỔI
                      </th>
                      <th
                        onClick={() => handleSort("lossFactor")}
                        className="py-3 px-3 text-right w-28 cursor-pointer hover:bg-slate-200/70 font-mono"
                        title="Hao lai = (Tỷ lệ - 1) * 100"
                      >
                        HAO LAI (%)
                      </th>
                      <th className="py-3 px-3 text-center w-28">KIỂM SOÁT</th>
                      <th className="py-3 px-3 text-center w-24">HIỆU LỰC</th>
                      <th className="py-3 px-4 text-center w-20">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRules.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">
                          {r.stt}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          <div className="flex items-center space-x-1">
                            <span>{r.maDoiChieu}</span>
                            {r.isCashOnly_R && (
                              <span className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-1 rounded">
                                BÁN ĐỨT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{r.tenKhach}</div>
                          <div className="text-[10px] text-slate-500 italic">{r.note}</div>
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-semibold text-slate-600">
                          {r.stock_fineness.toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-black text-amber-800 bg-amber-50/40 text-xs">
                          {r.delivery_debt_fineness.toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-slate-700">
                          {r.conversionRate.toFixed(5)}
                        </td>
                        {/* Cột Hao Lai: Áp dụng chuẩn màu xanh lá (+), đỏ (-), gạch nếu 0 */}
                        <td className="py-3 px-3 text-right font-mono font-black text-xs">
                          {r.lossFactor > 0 ? (
                            <span className="text-emerald-700">+{r.lossFactor.toFixed(3)}%</span>
                          ) : r.lossFactor < 0 ? (
                            <span className="text-rose-600">{r.lossFactor.toFixed(3)}%</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        {/* Cột Kiểm soát Hao Lai Ngược & Sổ Bán Đứt */}
                        <td className="py-3 px-3 text-center">
                          {r.isInvertedLoss ? (
                            <button
                              type="button"
                              onClick={() => setViewingApprovalModal(r)}
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-300 flex items-center justify-center space-x-1 mx-auto hover:bg-rose-100"
                            >
                              <ShieldAlert className="h-3 w-3" />
                              <span>Hao lai ngược</span>
                            </button>
                          ) : r.isCashOnly_R ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              Ngắt nợ vàng
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Hợp lệ (+%)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                              r.versionStatus === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {r.versionStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setEditingRule(r)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            title="Chỉnh sửa quy ước"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: QUY ƯỚC HÀNG HỒI (HH) & DẺ L2 (F6) */}
            {activeTab === "hh_l2" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-3 w-12 text-center">STT</th>
                      <th className="py-3 px-3 w-32">MÃ KH</th>
                      <th className="py-3 px-3">TÊN KHÁCH HÀNG</th>
                      <th className="py-3 px-3 text-right w-36">TUỔI GIAO GỐC</th>
                      <th className="py-3 px-3 text-right w-36 text-amber-900 bg-amber-50/50">TUỔI HÀNG HỒI (HH)</th>
                      <th className="py-3 px-3 text-right w-36 text-blue-900 bg-blue-50/50">TUỔI DẺ L2</th>
                      <th className="py-3 px-4">GHI CHÚ NGHIỆP VỤ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_HH_L2_RULES.map((hh) => (
                      <tr key={hh.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">{hh.stt}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{hh.maKh}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{hh.tenKhach}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">{hh.tuoiGiao.toFixed(1)}%</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-amber-800 bg-amber-50/30 text-sm">
                          {hh.tuoiHH.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-blue-800 bg-blue-50/30 text-sm">
                          {hh.tuoiL2.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-slate-500">{hh.ghiChu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* MODAL XEM CHI TIẾT PHÊ DUYỆT BOD CHO HAO LAI NGƯỢC */}
        {viewingApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-amber-300" />
                  <h3 className="font-bold text-sm">Phê Duyệt Ngoại Lệ: Hao Lai Ngược (-%)</h3>
                </div>
                <button onClick={() => setViewingApprovalModal(null)} className="text-white hover:opacity-80">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                  <div className="font-bold text-sm mb-1">{viewingApprovalModal.tenKhach} ({viewingApprovalModal.maDoiChieu})</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>Xuất kho: <strong>{viewingApprovalModal.stock_fineness}%</strong></div>
                    <div>Tính nợ: <strong>{viewingApprovalModal.delivery_debt_fineness}%</strong></div>
                    <div className="text-rose-700 col-span-2 font-black">
                      Tỷ lệ hao lai: {viewingApprovalModal.lossFactor.toFixed(3)}% (Xưởng bị hụt vàng!)
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Cấp Thẩm Quyền Phê Duyệt (*)</label>
                  <div className="p-2 bg-slate-100 rounded-lg font-bold text-slate-800">
                    {viewingApprovalModal.bodApproval?.approver || "Ban Giám Đốc (BOD) / Kế toán trưởng"}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Lý do ngoại lệ (Tối thiểu 20 ký tự) (*)</label>
                  <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 italic">
                    "{viewingApprovalModal.bodApproval?.reason || "Chấp thuận chiết khấu thương mại hỗ trợ khai trương chi nhánh mới"}"
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    ✓ Đã kiểm toán hợp lệ ({viewingApprovalModal.bodApproval?.reason?.length || 72} ký tự)
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setViewingApprovalModal(null)}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CẬP NHẬT QUY ƯỚC KHÁCH HÀNG */}
        {editingRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 bg-[#004737] text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Cập nhật Quy Ước Tuổi & Hao Lai</h3>
                    <p className="text-[11px] text-emerald-200">
                      Mã đối chiếu: {editingRule.maDoiChieu || "Mới"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingRule(null)}
                  className="text-emerald-200 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRule} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên khách hàng (*)</label>
                  <input
                    type="text"
                    required
                    value={editingRule.tenKhach}
                    onChange={(e) => setEditingRule({ ...editingRule, tenKhach: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <div>
                    <label className="font-black text-amber-950 block mb-1">
                      Tuổi vàng xuất kho (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editingRule.stock_fineness}
                      onChange={(e) => setEditingRule({ ...editingRule, stock_fineness: parseFloat(e.target.value) })}
                      className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-black text-amber-950 block mb-1">
                      Tuổi tính nợ khách (%) (*)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editingRule.delivery_debt_fineness}
                      onChange={(e) => setEditingRule({ ...editingRule, delivery_debt_fineness: parseFloat(e.target.value) })}
                      className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-black text-amber-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Kiểm tra Hao lai ngược trực tiếp */}
                {editingRule.delivery_debt_fineness < editingRule.stock_fineness && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-2">
                    <div className="flex items-center space-x-1.5 text-rose-800 font-bold">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>CẢNH BÁO: Phát hiện Hao lai ngược (-%)!</span>
                    </div>
                    <p className="text-[11px] text-rose-700">
                      Tuổi giao nợ thấp hơn tuổi xuất kho. Bắt buộc Kế toán trưởng hoặc BOD phê duyệt kèm lý do tối thiểu 20 ký tự:
                    </p>
                    <textarea
                      rows={2}
                      required
                      placeholder="Nhập lý do phê duyệt ngoại lệ (tối thiểu 20 ký tự)..."
                      value={editingRule.bodApproval?.reason || ""}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          isInvertedLoss: true,
                          bodApproval: {
                            ...editingRule.bodApproval,
                            approved: true,
                            approver: "Ban Giám Đốc",
                            reason: e.target.value
                          }
                        })
                      }
                      className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs text-rose-900 focus:outline-none"
                    />
                    <div className="text-right text-[10px] text-rose-600 font-mono">
                      {(editingRule.bodApproval?.reason || "").length} / 20 ký tự
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isCashOnlyCheck"
                    checked={editingRule.isCashOnly_R || false}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        isCashOnly_R: e.target.checked,
                        maDoiChieu: e.target.checked && !editingRule.maDoiChieu.endsWith("_R") ? `${editingRule.maKh}_R` : editingRule.maDoiChieu
                      })
                    }
                    className="rounded text-emerald-700"
                  />
                  <label htmlFor="isCashOnlyCheck" className="font-bold text-slate-800 cursor-pointer">
                    Quy ước Sổ Bán Đứt / Tiền Mặt (Hậu tố `_R`: W_billed = 0, 100% nợ tiền)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hạn mức Vàng (Lượng)</label>
                    <input
                      type="number"
                      value={editingRule.hanMucVang}
                      onChange={(e) => setEditingRule({ ...editingRule, hanMucVang: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-amber-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hạn mức Tiền (VND)</label>
                    <input
                      type="number"
                      value={editingRule.hanMucTien}
                      onChange={(e) => setEditingRule({ ...editingRule, hanMucTien: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingRule(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#004737] hover:bg-[#00382b] text-white rounded-lg font-bold shadow-md"
                  >
                    Lưu Quy Ước
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
