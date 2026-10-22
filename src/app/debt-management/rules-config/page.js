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
  FileSpreadsheet
} from "lucide-react";

import { CUSTOMER_PROFILES } from "@/data/debtBalanceMockData";

// Dữ liệu mẫu cấu hình Quy ước tuổi công nợ & Hao lai theo quyết định của Chị đẹp
export const MOCK_RULES_CONFIG = [
  {
    id: "rule_1",
    stt: 1,
    maKh: "100008",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    tuoiQuyUoc: 61.0, // Tuổi gốc để quy đổi mọi giao dịch
    tuoiGiaoDefault: 61.0,
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.2,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 50.0,
    hanMucTien: 400000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Đại lý sỉ TP.HCM - Mọi giao dịch quy về tuổi 61%"
  },
  {
    id: "rule_2",
    stt: 2,
    maKh: "200055",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    tuoiQuyUoc: 68.0,
    tuoiGiaoDefault: 68.0,
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.25,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 80.0,
    hanMucTien: 500000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Mọi giao dịch tuổi 61, 75 đều quy về tuổi chuẩn 68% của Kim Hưng"
  },
  {
    id: "rule_3",
    stt: 3,
    maKh: "A HOA",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    tuoiQuyUoc: 62.0,
    tuoiGiaoDefault: 62.0,
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
    stt: 4,
    maKh: "TAN_DINH",
    tenKhach: "ĐẠI LÝ VÀNG BẠC TÂN ĐỊNH",
    tuoiQuyUoc: 68.0,
    tuoiGiaoDefault: 68.0,
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
    stt: 5,
    maKh: "KHQQ",
    tenKhach: "QUỸ QUẢN LÝ VÀNG ĐỐI TÁC KHQQ (BÊN THỨ 3)",
    tuoiQuyUoc: 99.99,
    tuoiGiaoDefault: 99.99,
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
    stt: 6,
    maKh: "K_MAI",
    tenKhach: "DOANH NGHIỆP KIM HOÀN MAI",
    tuoiQuyUoc: 62.0,
    tuoiGiaoDefault: 62.0,
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
    stt: 7,
    maKh: "K10",
    tenKhach: "K10 (CHỢ AN ĐÔNG)",
    tuoiQuyUoc: 62.0,
    tuoiGiaoDefault: 62.0,
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
    stt: 8,
    maKh: "TD",
    tenKhach: "TIỆM VÀNG THÀNH DANH (TD)",
    tuoiQuyUoc: 68.0,
    tuoiGiaoDefault: 68.0,
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
    stt: 9,
    maKh: "SJC",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ SJC",
    tuoiQuyUoc: 75.0,
    tuoiGiaoDefault: 75.0,
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
    stt: 10,
    maKh: "PNJ",
    tenKhach: "CÔNG TY CP VÀNG BẠC ĐÁ QUÝ PHÚ NHUẬN (PNJ)",
    tuoiQuyUoc: 75.2,
    tuoiGiaoDefault: 75.2,
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.15,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 800.0,
    hanMucTien: 8000000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Đối tác gia công chiến lược - Theo dõi sheet De_PNJ"
  },
  {
    id: "rule_11",
    stt: 11,
    maKh: "WINSILVER",
    tenKhach: "DOANH NGHIỆP WINSILVER",
    tuoiQuyUoc: 92.5,
    tuoiGiaoDefault: 92.5,
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.1,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 150.0,
    hanMucTien: 200000000,
    hinhThucSo: "Không Sổ",
    status: "Đang áp dụng",
    note: "Chuyên Bạc Ý 925"
  },
  {
    id: "rule_12",
    stt: 12,
    maKh: "DOJI",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ DOJI",
    tuoiQuyUoc: 99.99,
    tuoiGiaoDefault: 99.99,
    laiTrongDinhMuc: 1.0,
    laiNgoaiThreshold: 1.15,
    laiNgoaiPricedAt: "Ngày xuất hóa đơn",
    hanMucVang: 300.0,
    hanMucTien: 1500000000,
    hinhThucSo: "Có Sổ",
    status: "Đang áp dụng",
    note: "Tổ chức chuỗi 99.99%"
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
  const [activeTab, setActiveTab] = useState("rules"); // "rules" | "hh_l2"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "stt", direction: "asc" });
  const [editingRule, setEditingRule] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

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
      return !q || r.maKh.toLowerCase().includes(q) || r.tenKhach.toLowerCase().includes(q) || r.note.toLowerCase().includes(q);
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
    showToast(`Đã lưu cập nhật Quy ước Tuổi & Hao lai cho [${editingRule.maKh}] thành công!`);
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

        <nav className="flex-1 px-2.5 py-3 space-y-4">
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              SỔ CÔNG NỢ (KT & KD)
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
                className="w-full flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60"
              >
                <BookOpen className="mr-2.5 h-4 w-4 text-emerald-300" />
                <span>Sổ Chi Tiết Khách Hàng</span>
              </Link>
            </div>
          </div>

          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              CẤU HÌNH & CHÍNH SÁCH
            </div>
            <div className="space-y-0.5">
              <Link
                href="/debt-management/rules-config"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-bold bg-[#00382b] text-amber-300 shadow-xs border border-amber-400/30"
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2.5 h-4 w-4 text-amber-300" />
                  <span>Quy Ước Tuổi & Hao Lai</span>
                </div>
                <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                  F4/F5
                </span>
              </Link>

              <a
                href="#han-muc"
                className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60"
              >
                <div className="flex items-center">
                  <ShieldAlert className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Hạn Mức & Cảnh Báo</span>
                </div>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
                  F2/F3
                </span>
              </a>
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-[#00382b] bg-[#00382b]/40">
          <Link
            href="/debt-management"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/80 text-white font-medium transition-colors"
          >
            <span>Về Bảng Cân Đối</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-300" />
          </Link>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA                                     */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-0.5">
              <Link href="/debt-management" className="hover:underline">Quản lý công nợ</Link>
              <span>/</span>
              <span>Cấu hình & Chính sách</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Quy Ước Tuổi & Hao Lai</span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Cấu hình Quy Ước Tuổi & Hao Lai (Rules Engine - F4/F5/F6)</span>
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
                <span>Định nghĩa Cốt Lõi: Tuổi Vàng Quy Ước Đối Chiếu Của Khách Hàng</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase">
                  Quy tắc thép
                </span>
              </h2>
              <p className="text-emerald-900 font-medium">
                • <strong>Mỗi khách hàng có 01 Tuổi Vàng Quy Ước duy nhất</strong>: Bất kể khách xuất/nhận hàng với tuổi vàng nào (610, 680, 750, 9999...), hệ thống đều tự động <strong>quy đổi về đúng Tuổi Quy Ước của khách đó</strong> để theo dõi trên sổ nợ (không bắt buộc quy về 24K).
              </p>
              <p className="text-emerald-800 text-[11px]">
                • <strong>Quy chuẩn Hao lai:</strong> <em>Lai trong</em> tính 100% vào tiền công. <em>Lai ngoài (&gt;1.2)</em> thì 1.0 tính vào nguyên liệu vàng, phần thặng dư chênh lệch được quy thành tiền công theo <strong>giá vàng tại thời điểm xuất hóa đơn</strong>.
              </p>
            </div>
          </div>

          {/* Bảng Dữ Liệu Cấu Hình Quy Ước */}
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
                      tenKhach: "",
                      tuoiQuyUoc: 68.0,
                      tuoiGiaoDefault: 68.0,
                      laiTrongDinhMuc: 1.0,
                      laiNgoaiThreshold: 1.2,
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
                  <span>+ Thêm Quy Ước KH</span>
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
                  placeholder="Tìm theo Mã KH, tên khách hàng, ghi chú..."
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
                        onClick={() => handleSort("maKh")}
                        className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center space-x-1">
                          <span>MÃ KH</span>
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
                        onClick={() => handleSort("tuoiQuyUoc")}
                        className="py-3 px-3 text-right w-36 bg-amber-50/60 cursor-pointer hover:bg-amber-100/70 text-amber-950"
                        title="Tuổi vàng quy ước của khách (Mọi GD đều quy về tuổi này)"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>TUỔI QUY ƯỚC C.NỢ</span>
                          <ArrowUpDown className="h-3 w-3 text-amber-700" />
                        </div>
                      </th>
                      <th className="py-3 px-3 text-right w-32">TUỔI GIAO GỐC</th>
                      <th className="py-3 px-3 text-center w-40">TỶ LỆ HAO LAI</th>
                      <th className="py-3 px-3 text-right w-40">HẠN MỨC (VÀNG / TIỀN)</th>
                      <th className="py-3 px-3 text-center w-24">LOẠI SỔ</th>
                      <th className="py-3 px-3 text-center w-28">TRẠNG THÁI</th>
                      <th className="py-3 px-4 text-center w-24">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRules.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">
                          {r.stt}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {r.maKh}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{r.tenKhach}</div>
                          <div className="text-[10px] text-slate-500 italic">{r.note}</div>
                        </td>
                        {/* Cột Tuổi Quy Ước Công Nợ: Điểm nhấn cốt lõi */}
                        <td className="py-3 px-3 text-right font-mono font-black text-amber-800 bg-amber-50/40 text-sm">
                          {r.tuoiQuyUoc.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {r.tuoiGiaoDefault.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="text-[11px] font-semibold text-slate-800">
                            Trong: <span className="text-emerald-700 font-bold">{r.laiTrongDinhMuc.toFixed(1)}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Ngoài: &gt;{r.laiNgoaiThreshold} (Giá HĐ)
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[11px]">
                          <div className="text-amber-700 font-bold">{r.hanMucVang} Lượng</div>
                          <div className="text-emerald-800 font-bold">
                            {r.hanMucTien > 0 ? (r.hanMucTien / 1000000).toLocaleString() + " Tr đ" : "—"}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.hinhThucSo === "Có Sổ"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {r.hinhThucSo}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === "Đang áp dụng"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                                : "bg-amber-50 text-amber-700 border border-amber-300"
                            }`}
                          >
                            {r.status}
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
                      Mã đối tác: {editingRule.maKh || "Mới"}
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
                      Tuổi vàng quy ước C.Nợ (*)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingRule.tuoiQuyUoc}
                      onChange={(e) => setEditingRule({ ...editingRule, tuoiQuyUoc: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-sm font-mono font-black text-amber-800 focus:outline-none"
                    />
                    <span className="text-[10px] text-amber-800 mt-1 block">
                      Mọi GD xuất/nhập quy về tuổi này
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tuổi giao mặc định</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingRule.tuoiGiaoDefault}
                      onChange={(e) => setEditingRule({ ...editingRule, tuoiGiaoDefault: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Định mức Lai trong</label>
                    <input
                      type="number"
                      step="0.05"
                      value={editingRule.laiTrongDinhMuc}
                      onChange={(e) => setEditingRule({ ...editingRule, laiTrongDinhMuc: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">100% tính vào tiền công</span>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Ngưỡng Lai ngoài</label>
                    <input
                      type="number"
                      step="0.05"
                      value={editingRule.laiNgoaiThreshold}
                      onChange={(e) => setEditingRule({ ...editingRule, laiNgoaiThreshold: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">&gt; 1.2 tính tiền theo giá HĐ</span>
                  </div>
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
