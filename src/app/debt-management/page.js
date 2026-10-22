"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Coins,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Plus,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  SlidersHorizontal,
  ArrowRight,
  Layers,
  Truck,
  Building2,
  ArrowUpDown,
  BookOpen,
  DollarSign,
  Scale,
  Settings,
  FolderOpen
} from "lucide-react";

import {
  DEBT_SUMMARY_METRICS,
  MOCK_DEBT_ACCOUNTS,
  MOCK_IN_TRANSIT_DELIVERIES,
  MANUAL_VOUCHER_TYPES,
  CUSTOMER_PROFILES
} from "@/data/debtBalanceMockData";

export default function DebtManagementPage() {
  // 1. Core State
  const [activeLedgerView, setActiveLedgerView] = useState("viKinhDoanh"); // "viKinhDoanh" | "viKeToan"
  const [activeUnit, setActiveUnit] = useState("luong"); // "luong" | "chi"
  const [activeTab, setActiveTab] = useState("all"); // "all" | "grouped" | "inTransit"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetalFilter, setSelectedMetalFilter] = useState("all"); // "all" | "Vàng" | "Bạc"
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all"); // "all" | "An toàn" | "Cảnh báo"
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedCustomerGroups, setExpandedCustomerGroups] = useState({ CUST_AHOA: true, CUST_100008: true });

  // Sắp xếp (Sorting) State
  const [sortConfig, setSortConfig] = useState({ key: "maDoiChieu", direction: "asc" });
  const [groupSortConfig, setGroupSortConfig] = useState({ key: "stt", direction: "asc" });

  // 2. Modals & Drawer State
  const [selectedAccountForDrawer, setSelectedAccountForDrawer] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucherType, setSelectedVoucherType] = useState("TienCong");
  const [voucherForm, setVoucherForm] = useState({
    customerId: "acc_6",
    refNo: "BT-2610-" + Math.floor(100 + Math.random() * 900),
    amountMoney: "",
    amountGold: "",
    note: ""
  });
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Hệ số quy đổi đơn vị tính (1 Lượng = 10 Chỉ)
  const unitMultiplier = activeUnit === "chi" ? 10 : 1;
  const unitLabel = activeUnit === "chi" ? "Chỉ" : "Lượng";

  // Số liệu tổng hợp theo View (Ví Kinh Doanh vs Ví Kế Toán)
  const summary = DEBT_SUMMARY_METRICS[activeLedgerView];

  // Handler toggle Sort
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleGroupSort = (key) => {
    setGroupSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Lọc và sắp xếp dữ liệu bảng phẳng (Flat View - Tab 1)
  const filteredAccounts = useMemo(() => {
    let result = MOCK_DEBT_ACCOUNTS.filter((acc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        acc.maDoiChieu.toLowerCase().includes(q) ||
        acc.tenSo.toLowerCase().includes(q) ||
        acc.tenKhach.toLowerCase().includes(q);

      const matchMetal = selectedMetalFilter === "all" || acc.loaiNL === selectedMetalFilter;
      const matchStatus = selectedStatusFilter === "all" || acc.trangThaiNo === selectedStatusFilter;

      return matchSearch && matchMetal && matchStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
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

    return result;
  }, [searchQuery, selectedMetalFilter, selectedStatusFilter, sortConfig]);

  // Gom nhóm dữ liệu theo Khách Hàng Cha (Tab 2: Master-Sub Ledger)
  const groupedCustomers = useMemo(() => {
    const map = {};
    filteredAccounts.forEach((acc) => {
      const pId = acc.parentCustomerId;
      const profile = CUSTOMER_PROFILES[pId] || {
        stt: 99,
        maKh: pId.replace("CUST_", ""),
        tenKhach: acc.tenKhach,
        phanLoai: "Đại lý",
        dauKyVang: 0,
        dauKyTien: 0
      };

      if (!map[pId]) {
        map[pId] = {
          parentCustomerId: pId,
          stt: profile.stt,
          maKh: profile.maKh,
          parentName: profile.tenKhach,
          phanLoai: profile.phanLoai,
          dauKyVang: profile.dauKyVang,
          dauKyTien: profile.dauKyTien,
          subLedgers: [],
          totalVangLuong: 0,
          totalQuy24k: 0,
          totalTienCong: 0,
          maxHanMuc: 0,
          hasDiscrepancy: false,
          worstStatus: "An toàn"
        };
      }
      map[pId].subLedgers.push(acc);
      map[pId].totalVangLuong += acc.duNoVangLuong;
      map[pId].totalQuy24k += acc.quy24K;
      map[pId].totalTienCong += acc.duNoTienCong;
      map[pId].maxHanMuc = Math.max(map[pId].maxHanMuc, acc.hanMucTien);
      if (acc.hasDiscrepancy) map[pId].hasDiscrepancy = true;
      if (acc.trangThaiNo === "Cảnh báo" || acc.trangThaiNo === "Vượt hạn mức") {
        map[pId].worstStatus = acc.trangThaiNo;
      }
    });

    let list = Object.values(map);

    if (groupSortConfig.key) {
      list.sort((a, b) => {
        let valA = a[groupSortConfig.key];
        let valB = b[groupSortConfig.key];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = (valB || "").toLowerCase();
        }

        if (valA < valB) return groupSortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return groupSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [filteredAccounts, groupSortConfig]);

  // Tính tổng cộng cho Tab 2 (Grouped Customers)
  const groupedTotals = useMemo(() => {
    return groupedCustomers.reduce(
      (acc, curr) => {
        acc.dauKyVang += curr.dauKyVang;
        acc.dauKyTien += curr.dauKyTien;
        acc.totalQuy24k += curr.totalQuy24k;
        acc.totalTienCong += curr.totalTienCong;
        return acc;
      },
      { dauKyVang: 0, dauKyTien: 0, totalQuy24k: 0, totalTienCong: 0 }
    );
  }, [groupedCustomers]);

  // Toggle chọn dòng
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAccounts.map((a) => a.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpandCustomer = (pId) => {
    setExpandedCustomerGroups((prev) => ({
      ...prev,
      [pId]: !prev[pId]
    }));
  };

  // QUY CHUẨN MÀU SẮC SỐ LIỆU TOÀN DỰ ÁN: SỐ DƯƠNG -> XANH, SỐ ÂM -> ĐỎ, 0 -> "—"
  const renderGoldValue = (val, isPrefixUnit = false) => {
    if (val === 0 || val === null || val === undefined) {
      return <span className="text-slate-400 font-normal select-none">—</span>;
    }
    const scaled = val * unitMultiplier;
    const formatted = Math.abs(scaled).toFixed(4);
    if (scaled > 0) {
      return (
        <span className="text-emerald-700 font-bold">
          +{formatted} {isPrefixUnit && unitLabel}
        </span>
      );
    }
    return (
      <span className="text-rose-600 font-bold">
        -{formatted} {isPrefixUnit && unitLabel}
      </span>
    );
  };

  const renderMoneyValue = (val, isShowSymbol = true) => {
    if (val === 0 || val === null || val === undefined) {
      return <span className="text-slate-400 font-normal select-none">—</span>;
    }
    const formatted = Math.abs(val).toLocaleString("vi-VN");
    if (val > 0) {
      return (
        <span className="text-emerald-700 font-bold">
          +{formatted} {isShowSymbol && "đ"}
        </span>
      );
    }
    return (
      <span className="text-rose-600 font-bold">
        -{formatted} {isShowSymbol && "đ"}
      </span>
    );
  };

  // Xử lý nạp Bút toán mới
  const handleCreateVoucher = (e) => {
    e.preventDefault();
    showToast(`Đã ghi sổ thành công Bút toán [${voucherForm.refNo}] cho khách hàng!`);
    setIsVoucherModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 overflow-hidden">
      {/* ======================================================== */}
      {/* 1. SIDEBAR PHÂN HỆ CÔNG NỢ (Dark Emerald Sevago Theme)   */}
      {/* ======================================================== */}
      <aside className="w-64 bg-[#004737] text-white flex flex-col h-full overflow-y-auto shrink-0 text-xs shadow-xl border-r border-[#00382b] select-none">
        {/* Header Phân Hệ */}
        <div className="h-16 px-4 border-b border-[#00382b] flex items-center justify-between shrink-0 bg-[#00382b]">
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
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

        {/* Tree Menu Phân Hệ Công Nợ */}
        <nav className="flex-1 px-2.5 py-3 space-y-4">
          {/* Nhóm 1: SỔ CÔNG NỢ (KT & KD) */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              SỔ CÔNG NỢ (KT & KD)
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-semibold transition-all text-left ${
                  activeTab === "all" || activeTab === "grouped"
                    ? "bg-[#00382b] text-white shadow-xs border border-emerald-400/30"
                    : "text-emerald-100 hover:bg-[#00382b]/60"
                }`}
              >
                <Scale className="mr-2.5 h-4 w-4 text-amber-300" />
                <span>Bảng Cân Đối Công Nợ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAccountForDrawer(MOCK_DEBT_ACCOUNTS[5]); // Mặc định mở A HOA
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 text-left"
              >
                <div className="flex items-center">
                  <BookOpen className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Sổ Chi Tiết Khách Hàng</span>
                </div>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
                  F17
                </span>
              </button>

              <a
                href="#ma-doi-chieu"
                className="flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60"
              >
                <FolderOpen className="mr-2.5 h-4 w-4 text-emerald-300" />
                <span>Mã Đối Chiếu (Số Nợ)</span>
              </a>
            </div>
          </div>

          {/* Nhóm 2: NGHIỆP VỤ PHÁT SINH */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              NGHIỆP VỤ PHÁT SINH
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("inTransit")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-left transition-colors ${
                  activeTab === "inTransit"
                    ? "bg-[#00382b] text-amber-300 font-bold border border-amber-400/40"
                    : "text-emerald-100 hover:bg-[#00382b]/60"
                }`}
              >
                <div className="flex items-center">
                  <Truck className="mr-2.5 h-4 w-4 text-amber-300" />
                  <span>Tiếp nhận NL (Kho MAT)</span>
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                  {MOCK_IN_TRANSIT_DELIVERIES.length}
                </span>
              </button>

              <a
                href="#hoa-don"
                className="flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60"
              >
                <FileText className="mr-2.5 h-4 w-4 text-emerald-300" />
                <span>Hóa Đơn TP (Kho FGW)</span>
              </a>

              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 text-left"
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Sổ Bút Toán Bất Biến</span>
                </div>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
                  9 GD
                </span>
              </button>
            </div>
          </div>

          {/* Nhóm 3: CẤU HÌNH & CHÍNH SÁCH */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              CẤU HÌNH & CHÍNH SÁCH
            </div>
            <div className="space-y-0.5">
              <a
                href="#han-muc"
                className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60"
              >
                <div className="flex items-center">
                  <ShieldAlert className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Hạn Mức & Cảnh Báo</span>
                </div>
                <span className="text-[9px] bg-emerald-800/80 text-emerald-200 px-1 py-0.5 rounded">
                  F2
                </span>
              </a>

              <Link
                href="/debt-management/rules-config"
                className="flex items-center justify-between px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#00382b]/60 transition-colors"
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2.5 h-4 w-4 text-emerald-300" />
                  <span>Quy Ước Tuổi & Hao Lai</span>
                </div>
                <span className="text-[9px] bg-emerald-800/80 text-emerald-200 px-1 py-0.5 rounded font-mono">
                  F4/F5
                </span>
              </Link>
            </div>
          </div>

          {/* Nhóm 4: PHÂN HỆ LIÊN KẾT */}
          <div>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
              PHÂN HỆ LIÊN KẾT
            </div>
            <div className="space-y-0.5 text-emerald-200/80">
              <Link href="/" className="flex items-center px-3 py-1.5 rounded-lg hover:bg-[#00382b]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2.5"></span>
                <span>Tiếp nhận NL (Kho MAT)</span>
              </Link>
              <Link href="/" className="flex items-center px-3 py-1.5 rounded-lg hover:bg-[#00382b]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2.5"></span>
                <span>Kho Thành Phẩm (FGW)</span>
              </Link>
              <Link href="/" className="flex items-center px-3 py-1.5 rounded-lg hover:bg-[#00382b]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2.5"></span>
                <span>Đơn Hàng Sản Xuất (ORD)</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer Sidebar: Quay lại Bán Hàng */}
        <div className="p-3 border-t border-[#00382b] bg-[#00382b]/40">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/80 text-white font-medium transition-colors"
          >
            <span>Quay lại Bán Hàng</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-300" />
          </Link>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA                                     */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar: ĐÃ LOẠI BỎ TEXT THỪA & NÚT THAO TÁC RỐI ĐỘI HÌNH */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
          {/* Tiêu đề & Breadcrumbs */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-0.5">
              <span>Quản lý công nợ</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">
                Bảng Cân Đối Công Nợ (Theo Mã Đối Chiếu)
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Bảng Cân Đối Công Nợ (Daily Balance Sheet)
            </h1>
          </div>

          {/* Top Controls: Dual-View Toggle, Unit Switcher & Profile */}
          <div className="flex items-center space-x-3">
            {/* Toggle Dual-View Kép (Ví Kế Toán vs Ví Kinh Doanh) */}
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveLedgerView("viKeToan");
                  showToast("Đã chuyển sang Ví Kế Toán (View Ngày Chứng Từ - OrderDate)");
                }}
                className={`px-2.5 py-1.5 rounded-md font-semibold transition-all ${
                  activeLedgerView === "viKeToan"
                    ? "bg-white text-emerald-900 shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ví Kế Toán (Chứng từ)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveLedgerView("viKinhDoanh");
                  showToast("Đã chuyển sang Ví Kinh Doanh (View Ngày Đối Chiếu - ShipDate)");
                }}
                className={`px-2.5 py-1.5 rounded-md font-semibold transition-all ${
                  activeLedgerView === "viKinhDoanh"
                    ? "bg-[#004737] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ví Kinh Doanh (Đối chiếu)
              </button>
            </div>

            {/* ĐVT Toggle (Lượng / Chỉ) */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-0.5 flex items-center text-xs text-amber-950 font-bold">
              <span className="px-2 text-amber-700">ĐVT:</span>
              <button
                type="button"
                onClick={() => setActiveUnit("luong")}
                className={`px-2 py-1 rounded ${
                  activeUnit === "luong" ? "bg-amber-500 text-slate-950 shadow-xs" : "hover:text-amber-700"
                }`}
              >
                Lượng
              </button>
              <button
                type="button"
                onClick={() => setActiveUnit("chi")}
                className={`px-2 py-1 rounded ${
                  activeUnit === "chi" ? "bg-amber-500 text-slate-950 shadow-xs" : "hover:text-amber-700"
                }`}
              >
                Chỉ
              </button>
            </div>

            {/* Profile Pill: CẬP NHẬT CHUẨN TÊN "NGUYỄN THỊ MỸ DUNG" */}
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
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in duration-200">
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
          {/* ======================================================== */}
          {/* 3. BỘ 4 THẺ CHỈ SỐ KPI DYNAMIC                           */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: Tổng Vàng Phải Thu (SIP Nợ) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tổng Vàng Phải Thu (SIP Nợ)
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black tracking-tight">
                  {renderGoldValue(summary.tongVangPhaiThu)}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">{unitLabel}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Dư nợ vàng các Mã Đối Chiếu cần thanh toán cho Sevago
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Quy chuẩn 24K:</span>
                <span className="font-bold text-slate-800">
                  {renderGoldValue(summary.vangNetQuy24K, true)}
                </span>
              </div>
            </div>

            {/* Card 2: Tổng Vàng Phải Trả (SIP Có - Khách gửi trước) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-rose-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tổng Vàng Phải Trả (SIP Có)
                </span>
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <TrendingDown className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-rose-600 tracking-tight">
                  -{summary.tongVangPhaiTra.toFixed(4)}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">{unitLabel}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Số dư vàng khách gửi trước / Quỹ ủy thác bù trừ (KHQQ)
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Đối tác gửi trước:</span>
                <span className="font-bold text-rose-600">3 Đối tác (KHQQ, PNJ, Kim Hưng)</span>
              </div>
            </div>

            {/* Card 3: Tổng Tiền Công Phải Thu */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tổng Tiền Công Phải Thu
                </span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-emerald-700 tracking-tight">
                  +{summary.tongTiềnCongPhaiThu.toLocaleString("vi-VN")}
                </span>
                <span className="text-xs font-bold text-slate-500">đ</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Công nợ tiền công chế tác (Tiền mặt / Chuyển khoản)
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Đã thu trong tháng:</span>
                <span className="font-bold text-emerald-700">+1.240.000.000 đ</span>
              </div>
            </div>

            {/* Card 4: Số Vượt Hạn Mức Tín Dụng */}
            <div
              onClick={() => {
                setSelectedStatusFilter("Cảnh báo");
                showToast("Đã lọc danh sách sổ có cảnh báo hạn mức");
              }}
              className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-400 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Sổ Vượt Hạn Mức Tín Dụng
                </span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {filteredAccounts.filter((a) => a.trangThaiNo === "Cảnh báo").length}
                </span>
                <span className="text-xs font-bold text-slate-500">Sổ Nợ</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Cảnh báo kiểm soát rủi ro tài chính theo hạn mức & tuổi nợ
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-amber-700 font-bold">Cần đôn đốc: K10, A HOA1</span>
                <span className="text-xs text-blue-600 font-bold group-hover:underline">
                  Xem ngay →
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. TABS BỘ VIEW & TOOLBAR (ĐÃ BÊ NÚT THAO TÁC XUỐNG ĐÂY) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Hàng 1: Tabs & Các nút Action (Xuất Excel, In, + Thêm Bút Toán) */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
              {/* 3 Tabs chính */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "all"
                      ? "bg-white text-[#004737] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Tất cả Mã Đối Chiếu</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
                    {filteredAccounts.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("grouped")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "grouped"
                      ? "bg-white text-[#004737] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-amber-600" />
                  <span>Gom Nhóm Khách Hàng (Master-Sub)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-mono font-bold">
                    {groupedCustomers.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("inTransit")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "inTransit"
                      ? "bg-white text-[#004737] shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Truck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Chờ Đối Soát / Đang Đi Đường</span>
                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-mono font-bold">
                    {MOCK_IN_TRANSIT_DELIVERIES.length}
                  </span>
                </button>
              </div>

              {/* NÚT THAO TÁC ĐƯỢC BÊ XUỐNG ĐÂY ĐỂ TRÁNH RỐI ĐỘI HÌNH TRÊN TOPBAR */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => showToast("Đã trích xuất Bảng Cân Đối ra file Excel")}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Xuất Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-600" />
                  <span>In Bảng Cân Đối</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#004737] hover:bg-[#00382b] text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Thêm Bút Toán</span>
                </button>
              </div>
            </div>

            {/* Hàng 2: Bộ lọc Search, Metal, Status */}
            <div className="px-6 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex items-center space-x-2.5 flex-1 max-w-2xl">
                <div className="relative w-72">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo Mã đối chiếu, tên sổ, tên khách..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedMetalFilter}
                  onChange={(e) => setSelectedMetalFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">Tất cả loại NL</option>
                  <option value="Vàng">Vàng</option>
                  <option value="Bạc">Bạc</option>
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái nợ</option>
                  <option value="An toàn">An toàn</option>
                  <option value="Cảnh báo">Cảnh báo</option>
                </select>

                {(searchQuery || selectedMetalFilter !== "all" || selectedStatusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMetalFilter("all");
                      setSelectedStatusFilter("all");
                    }}
                    className="text-xs text-rose-600 hover:underline font-medium"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Đã chọn: <strong className="text-slate-900">{selectedRows.length}</strong> /{" "}
                {filteredAccounts.length}
              </span>
            </div>

            {/* ======================================================== */}
            {/* VIEW 1: BẢNG TẤT CẢ MÃ ĐỐI CHIẾU (HỖ TRỢ SORT CỘT)      */}
            {/* ======================================================== */}
            {activeTab === "all" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            selectedRows.length === filteredAccounts.length &&
                            filteredAccounts.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                        />
                      </th>
                      {/* Cột Mã đối chiếu (Sortable) */}
                      <th
                        onClick={() => handleSort("maDoiChieu")}
                        className="py-3 px-3 w-32 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>MÃ ĐỐI CHIẾU</span>
                          {sortConfig.key === "maDoiChieu" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5 text-emerald-700" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-emerald-700" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                      </th>
                      {/* Cột Tên sổ / Đối tác (Sortable) */}
                      <th
                        onClick={() => handleSort("tenSo")}
                        className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>TÊN SỔ / ĐỐI TÁC</span>
                          {sortConfig.key === "tenSo" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-3.5 w-3.5 text-emerald-700" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-emerald-700" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                      </th>
                      {/* Cột Loại NL */}
                      <th className="py-3 px-3 text-center w-20">LOẠI NL</th>
                      {/* Cột Tuổi quy ước (Sortable) */}
                      <th
                        onClick={() => handleSort("tuoiQuyUoc")}
                        className="py-3 px-3 text-right w-24 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>TUỔI QUY ƯỚC</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      {/* Cột Dư nợ vàng (Sortable) */}
                      <th
                        onClick={() => handleSort("duNoVangLuong")}
                        className="py-3 px-3 text-right w-36 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>DƯ NỢ VÀNG ({unitLabel.toUpperCase()})</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      {/* Cột Quy 24K (Sortable) */}
                      <th
                        onClick={() => handleSort("quy24K")}
                        className="py-3 px-3 text-right w-28 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>QUY 24K</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      {/* Cột Dư nợ tiền công (Sortable) */}
                      <th
                        onClick={() => handleSort("duNoTienCong")}
                        className="py-3 px-3 text-right w-36 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>DƯ NỢ TIỀN CÔNG</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      {/* Cột Hạn mức tiền (Sortable) */}
                      <th
                        onClick={() => handleSort("hanMucTien")}
                        className="py-3 px-3 text-right w-32 cursor-pointer hover:bg-slate-200/70 transition-colors"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>HẠN MỨC TIỀN</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      {/* Cột Trạng thái */}
                      <th className="py-3 px-3 text-center w-28">TRẠNG THÁI</th>
                      {/* Cột Thao tác */}
                      <th className="py-3 px-4 text-center w-28">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAccounts.map((acc) => {
                      const isSelected = selectedRows.includes(acc.id);
                      return (
                        <tr
                          key={acc.id}
                          className={`hover:bg-slate-50 transition-colors group ${
                            isSelected ? "bg-emerald-50/50" : ""
                          }`}
                        >
                          <td className="py-2.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(acc.id)}
                              className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                            />
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="flex items-center space-x-1.5 font-mono font-bold text-slate-900">
                              <span>{acc.maDoiChieu}</span>
                              {acc.isDefault && (
                                <span className="text-[9px] bg-slate-200 text-slate-700 px-1 rounded font-sans font-normal">
                                  Mặc định
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 leading-tight">
                              {acc.tenSo}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">
                              {acc.tenKhach}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                acc.loaiNL === "Vàng"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-slate-200 text-slate-800 border border-slate-300"
                              }`}
                            >
                              {acc.loaiNL}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                            {acc.tuoiQuyUoc.toFixed(2)}%
                          </td>

                          {/* Dư nợ vàng: SỐ DƯƠNG XANH - SỐ ÂM ĐỎ */}
                          <td className="py-2.5 px-3 text-right font-mono">
                            {renderGoldValue(acc.duNoVangLuong)}
                          </td>

                          {/* Quy 24K: SỐ DƯƠNG XANH - SỐ ÂM ĐỎ */}
                          <td className="py-2.5 px-3 text-right font-mono">
                            {renderGoldValue(acc.quy24K)}
                          </td>

                          {/* Dư nợ tiền công: SỐ DƯƠNG XANH - SỐ ÂM ĐỎ */}
                          <td className="py-2.5 px-3 text-right font-mono">
                            {renderMoneyValue(acc.duNoTienCong)}
                          </td>

                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                            {acc.hanMucTien > 0 ? (
                              acc.hanMucTien.toLocaleString("vi-VN") + " đ"
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                acc.trangThaiNo === "An toàn"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {acc.trangThaiNo === "An toàn" ? "An toàn" : "Cảnh báo"}
                            </span>
                          </td>

                          <td className="py-2.5 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedAccountForDrawer(acc)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#004737] hover:text-white text-slate-800 font-bold text-[11px] transition-colors"
                              >
                                Xem Sổ
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  showToast(`Hạn mức của ${acc.maDoiChieu}: ${acc.hanMucTien.toLocaleString("vi-VN")} đ`)
                                }
                                className="px-1.5 py-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                title="Xem hạn mức"
                              >
                                <Settings className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Footer Tổng Cộng Tab 1 */}
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={5} className="py-3 px-4 text-left">
                        Tổng Cộng ({filteredAccounts.length} mã đối chiếu):
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {renderGoldValue(summary.tongVangPhaiThu, true)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {renderGoldValue(summary.vangNetQuy24K)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {renderMoneyValue(summary.tongTiềnCongPhaiThu)}
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: GOM NHÓM KHÁCH HÀNG (ĐÃ BỎ BANNER & BỔ SUNG CỘT) */}
            {/* ======================================================== */}
            {activeTab === "grouped" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <th
                        onClick={() => handleGroupSort("stt")}
                        className="py-3 px-3 w-12 text-center cursor-pointer hover:bg-slate-200/70"
                      >
                        STT
                      </th>
                      <th
                        onClick={() => handleGroupSort("maKh")}
                        className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center space-x-1">
                          <span>MÃ KH</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleGroupSort("parentName")}
                        className="py-3 px-3 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center space-x-1">
                          <span>TÊN KHÁCH HÀNG</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3 px-3 w-32">PHÂN LOẠI</th>
                      <th className="py-3 px-3 w-36">MÃ ĐỐI CHIẾU</th>
                      <th className="py-3 px-3 text-right w-40">DƯ NỢ ĐẦU KỲ</th>
                      <th
                        onClick={() => handleGroupSort("totalQuy24k")}
                        className="py-3 px-3 text-right w-36 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>DƯ NỢ VÀNG CUỐI</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => handleGroupSort("totalTienCong")}
                        className="py-3 px-3 text-right w-36 cursor-pointer hover:bg-slate-200/70"
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>DƯ NỢ CÔNG CUỐI</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="py-3 px-3 text-center w-28">RỦI RO</th>
                      <th className="py-3 px-4 text-center w-24">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupedCustomers.map((group) => {
                      const isExpanded = expandedCustomerGroups[group.parentCustomerId];
                      return (
                        <>
                          {/* Dòng Khách Hàng Cha (Master Row) */}
                          <tr
                            key={group.parentCustomerId}
                            className={`hover:bg-slate-50 transition-colors ${
                              isExpanded ? "bg-emerald-50/20" : ""
                            }`}
                          >
                            {/* STT */}
                            <td className="py-3 px-3 text-center font-bold text-slate-500">
                              {group.stt}
                            </td>

                            {/* Mã Khách Hàng */}
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {group.maKh}
                            </td>

                            {/* Tên Khách Hàng (kèm nút toggle xổ sổ con) */}
                            <td className="py-3 px-3">
                              <div
                                onClick={() => toggleExpandCustomer(group.parentCustomerId)}
                                className="flex items-center space-x-2 cursor-pointer group"
                              >
                                <button className="text-slate-400 group-hover:text-emerald-800">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-emerald-800" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                                <span className="font-bold text-slate-900 text-xs group-hover:text-emerald-900">
                                  {group.parentName}
                                </span>
                              </div>
                            </td>

                            {/* Phân loại khách hàng */}
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                {group.phanLoai}
                              </span>
                            </td>

                            {/* Mã đối chiếu con */}
                            <td className="py-3 px-3">
                              <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                                <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold font-mono">
                                  {group.subLedgers.length} sổ
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[100px]">
                                  {group.subLedgers.map((s) => s.maDoiChieu).join(", ")}
                                </span>
                              </div>
                            </td>

                            {/* Dư nợ đầu kỳ (Vàng ĐK + Tiền ĐK) */}
                            <td className="py-3 px-3 text-right font-mono text-[11px]">
                              <div>Vàng: {renderGoldValue(group.dauKyVang)}</div>
                              <div>Tiền: {renderMoneyValue(group.dauKyTien)}</div>
                            </td>

                            {/* Dư nợ vàng cuối (Quy 24K): SỐ DƯƠNG XANH - SỐ ÂM ĐỎ */}
                            <td className="py-3 px-3 text-right font-mono text-xs">
                              {renderGoldValue(group.totalQuy24k, true)}
                            </td>

                            {/* Dư nợ công cuối: SỐ DƯƠNG XANH - SỐ ÂM ĐỎ */}
                            <td className="py-3 px-3 text-right font-mono text-xs">
                              {renderMoneyValue(group.totalTienCong)}
                            </td>

                            {/* Rủi ro */}
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  group.worstStatus === "An toàn"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {group.worstStatus}
                              </span>
                            </td>

                            {/* Thao tác (action: xem sổ) */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setSelectedAccountForDrawer(group.subLedgers[0])}
                                className="px-2.5 py-1 rounded bg-[#004737] hover:bg-[#00382b] text-white font-bold text-[11px] transition-colors shadow-xs"
                              >
                                Xem Sổ
                              </button>
                            </td>
                          </tr>

                          {/* Dòng mở rộng Sổ Con (Sub-Ledgers) */}
                          {isExpanded &&
                            group.subLedgers.map((sub) => (
                              <tr
                                key={sub.id}
                                className="bg-slate-50/70 border-b border-slate-100 text-[11px]"
                              >
                                <td className="py-2 px-3 text-center text-slate-300">↳</td>
                                <td className="py-2 px-3 font-mono text-slate-600 pl-6">
                                  {sub.maDoiChieu}
                                </td>
                                <td className="py-2 px-3 text-slate-700 font-medium pl-6">
                                  {sub.tenSo}
                                </td>
                                <td className="py-2 px-3">
                                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[9px] font-bold">
                                    {sub.loaiNL} ({sub.tuoiQuyUoc}%)
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-slate-400 font-mono text-[10px]">
                                  {sub.isDefault ? "Mặc định" : "Sổ phụ"}
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-400">—</td>
                                <td className="py-2 px-3 text-right font-mono">
                                  {renderGoldValue(sub.quy24K)}
                                </td>
                                <td className="py-2 px-3 text-right font-mono">
                                  {renderMoneyValue(sub.duNoTienCong)}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {sub.trangThaiNo}
                                  </span>
                                </td>
                                <td className="py-2 px-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedAccountForDrawer(sub)}
                                    className="text-xs font-bold text-emerald-800 hover:underline"
                                  >
                                    Chi tiết
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </>
                      );
                    })}
                  </tbody>
                  {/* BỔ SUNG DÒNG TỔNG CỘNG CHO TAB 2 THEO YÊU CẦU CỦA CHỊ ĐẸP */}
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={5} className="py-3 px-4 text-left">
                        Tổng Cộng ({groupedCustomers.length} Khách hàng):
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[11px]">
                        <div>Vàng: {renderGoldValue(groupedTotals.dauKyVang)}</div>
                        <div>Tiền: {renderMoneyValue(groupedTotals.dauKyTien)}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {renderGoldValue(groupedTotals.totalQuy24k, true)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {renderMoneyValue(groupedTotals.totalTienCong)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: HÀNG ĐANG ĐI ĐƯỜNG / CHỜ ĐỐI SOÁT (IN-TRANSIT)   */}
            {/* ======================================================== */}
            {activeTab === "inTransit" && (
              <div>
                <div className="p-4 bg-blue-50/80 border-b border-blue-200 flex items-center justify-between text-xs text-blue-900">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="font-bold">
                      Danh sách {MOCK_IN_TRANSIT_DELIVERIES.length} lô hàng đã xuất kho nhưng khách
                      chưa ký nhận (Chênh lệch giữa Ví Kế toán và Ví Kinh doanh)
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-700">
                    Bấm "Ký Nhận" sau khi có biên bản giao nhận thực tế
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Số Toa / Phiếu</th>
                        <th className="py-3 px-3">Ngày Xuất Kho</th>
                        <th className="py-3 px-3">Khách Hàng / Mã Đối Chiếu</th>
                        <th className="py-3 px-3">Loại Nghiệp Vụ</th>
                        <th className="py-3 px-3 text-right">TL Vàng Giao</th>
                        <th className="py-3 px-3 text-right">Quy 24K</th>
                        <th className="py-3 px-3 text-right">Tiền Công</th>
                        <th className="py-3 px-3">Nhân Viên Giao</th>
                        <th className="py-3 px-3 text-center">Trạng Thái</th>
                        <th className="py-3 px-4 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_IN_TRANSIT_DELIVERIES.map((del) => (
                        <tr key={del.id} className="hover:bg-blue-50/40">
                          <td className="py-3 px-4 font-mono font-bold text-blue-700">
                            {del.soToa}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600">{del.ngayXuatKho}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{del.tenKhach}</div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Mã Sổ: {del.maDoiChieu}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-slate-800 font-medium">{del.loaiGiaoDich}</span>
                            <div className="text-[10px] text-slate-400 italic">{del.note}</div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono">
                            {renderGoldValue(del.tlVangGiao, true)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono">
                            {renderGoldValue(del.quy24k)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono">
                            {renderMoneyValue(del.tienCong)}
                          </td>
                          <td className="py-3 px-3 text-slate-600">{del.shipper}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {del.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`Đã xác nhận ký nhận thành công cho phiếu [${del.soToa}]! Ghi sổ Ví Kinh Doanh.`);
                              }}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition-colors"
                            >
                              Ký Nhận
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. FLOATING BULK ACTIONS BAR                             */}
        {/* ======================================================== */}
        {selectedRows.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#00382b] text-white px-6 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center space-x-6 z-40 animate-in fade-in slide-in-from-bottom-4">
            <span className="text-xs font-bold">
              Đã chọn <strong className="text-amber-400">{selectedRows.length}</strong> mã đối chiếu
            </span>
            <div className="h-4 w-px bg-emerald-700" />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => showToast(`Đã xuất bảng kê Excel cho ${selectedRows.length} đối tác đã chọn`)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Xuất Excel</span>
              </button>
              <button
                onClick={() => showToast(`Đã gửi Zalo / Email thông báo công nợ cho ${selectedRows.length} đối tác`)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center space-x-1.5"
              >
                <span>Gửi Biên Bản Ký Chốt</span>
              </button>
              <button
                onClick={() => setSelectedRows([])}
                className="text-xs text-slate-300 hover:text-white px-2 py-1"
              >
                Hủy chọn
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. SLIDE-OVER DRAWER: XEM NHANH SỔ CHI TIẾT 1 KHÁCH HÀNG  */}
        {/* ======================================================== */}
        {selectedAccountForDrawer && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setSelectedAccountForDrawer(null)}
            />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
                {/* Drawer Header */}
                <div className="p-6 bg-[#004737] text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                        {selectedAccountForDrawer.maDoiChieu}
                      </span>
                      <span className="text-xs text-emerald-200">
                        Tuổi: {selectedAccountForDrawer.tuoiQuyUoc}%
                      </span>
                      <span className="text-xs bg-emerald-800 text-white px-2 py-0.5 rounded">
                        {selectedAccountForDrawer.loaiNL}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white mt-1">
                      {selectedAccountForDrawer.tenSo}
                    </h2>
                    <p className="text-xs text-emerald-200 truncate">
                      {selectedAccountForDrawer.tenKhach}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAccountForDrawer(null)}
                    className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Dư nợ tổng quan trong Drawer */}
                <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Dư Nợ Vàng ({unitLabel})
                    </span>
                    <span className="text-lg font-black font-mono">
                      {renderGoldValue(selectedAccountForDrawer.duNoVangLuong)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Quy Chuẩn 24K
                    </span>
                    <span className="text-lg font-black font-mono">
                      {renderGoldValue(selectedAccountForDrawer.quy24K)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Dư Nợ Tiền Công
                    </span>
                    <span className="text-lg font-black font-mono">
                      {renderMoneyValue(selectedAccountForDrawer.duNoTienCong)}
                    </span>
                  </div>
                </div>

                {/* Lịch sử giao dịch gần nhất */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-emerald-700" />
                      <span>Nhật ký phát sinh gần nhất (Sổ cái F17)</span>
                    </h3>
                    <span className="text-xs text-slate-500">5 phát sinh mới nhất</span>
                  </div>

                  {selectedAccountForDrawer.recentTransactions.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 font-bold text-slate-700">
                          <tr>
                            <th className="p-2.5">Ngày</th>
                            <th className="p-2.5">Loại & Mã CT</th>
                            <th className="p-2.5 text-right">± Vàng ({unitLabel})</th>
                            <th className="p-2.5 text-right">± Tiền công</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedAccountForDrawer.recentTransactions.map((tx, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-medium text-slate-600">{tx.date}</td>
                              <td className="p-2.5">
                                <div className="font-bold text-slate-900">{tx.type}</div>
                                <div className="text-[10px] text-slate-500">{tx.desc}</div>
                              </td>
                              <td className="p-2.5 text-right font-mono">
                                {renderGoldValue(tx.vang)}
                              </td>
                              <td className="p-2.5 text-right font-mono">
                                {renderMoneyValue(tx.tien)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Chưa có giao dịch phát sinh trong kỳ này.
                    </div>
                  )}

                  {/* Cảnh báo rủi ro & ghi chú */}
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      <span>Ghi chú đối chiếu công nợ</span>
                    </div>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      {selectedAccountForDrawer.discrepancyNote}
                    </p>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      showToast(`Đã phát hành Biên bản đối chiếu mẫu CnoGuiKH cho ${selectedAccountForDrawer.tenSo}`);
                    }}
                    className="px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs flex items-center space-x-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>In Biên Bản CnoGuiKH</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setIsVoucherModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-[#004737] hover:bg-[#00382b] text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Lập Bút Toán</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. MODAL [+ THÊM BÚT TOÁN] (9 LOẠI MANUAL CHUẨN DATAKHAC) */}
        {/* ======================================================== */}
        {isVoucherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 bg-[#004737] text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Thêm Bút Toán Công Nợ (DataKhac)</h3>
                    <p className="text-[11px] text-emerald-200">
                      Hạch toán 9 loại chứng từ nghiệp vụ thủ công vào Sổ cái bất biến
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="text-emerald-200 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateVoucher} className="p-6 space-y-4 text-xs">
                {/* 1. Chọn loại nghiệp vụ manual */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Loại chứng từ nghiệp vụ (*)
                  </label>
                  <select
                    value={selectedVoucherType}
                    onChange={(e) => setSelectedVoucherType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {MANUAL_VOUCHER_TYPES.map((t) => (
                      <option key={t.code} value={t.code}>
                        [{t.code}] - {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {MANUAL_VOUCHER_TYPES.find((t) => t.code === selectedVoucherType)?.desc}
                  </span>
                </div>

                {/* 2. Chọn Khách Hàng / Mã Đối Chiếu */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mã đối chiếu / Sổ nợ nhận phát sinh (*)
                  </label>
                  <select
                    value={voucherForm.customerId}
                    onChange={(e) => setVoucherForm({ ...voucherForm, customerId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    {MOCK_DEBT_ACCOUNTS.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.maDoiChieu} — {acc.tenSo} ({acc.tenKhach})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Giá trị phát sinh (Vàng hoặc Tiền) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Trọng lượng vàng ({unitLabel})
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="0.0000"
                      value={voucherForm.amountGold}
                      onChange={(e) => setVoucherForm({ ...voucherForm, amountGold: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-amber-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Số tiền công (VND)
                    </label>
                    <input
                      type="number"
                      placeholder="0 đ"
                      value={voucherForm.amountMoney}
                      onChange={(e) => setVoucherForm({ ...voucherForm, amountMoney: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Diễn giải chứng từ */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Diễn giải bút toán (*)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Nhập lý do hạch toán / số hóa đơn tham chiếu..."
                    value={voucherForm.note}
                    onChange={(e) => setVoucherForm({ ...voucherForm, note: e.target.value })}
                    required
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsVoucherModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#004737] hover:bg-[#00382b] text-white rounded-lg font-bold shadow-md"
                  >
                    Ghi Sổ Bất Biến
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
