"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ChevronRight,
  Eye,
  AlertTriangle,
  Zap,
  Boxes,
  Copy,
  Check,
  CheckCircle2,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
  GitCommit,
  Calendar,
  ChevronDown,
  Printer
} from "lucide-react";
import InventorySidebar from "@/components/inventory/InventorySidebar";
import InteractiveWorkflowDiagram from "@/components/inventory/InteractiveWorkflowDiagram";
import ColumnFilterPopover from "@/components/orders/ColumnFilterPopover";
import ProductionBagPrintModal from "@/components/inventory/ProductionBagPrintModal";
import { MOCK_REPROCESS_LOTS } from "@/data/inventoryMockData";

export default function ReprocessInventoryPage() {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unassigned' | 'assigned' | 'workflow'
  const [printBagTarget, setPrintBagTarget] = useState(null);

  // Bắt query param ?tab=workflow từ URL để chuyển tab tự động
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["all", "unassigned", "assigned"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("bagCode");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedLotForDrawer, setSelectedLotForDrawer] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Bộ lọc khoảng ngày (Tham khảo DS đơn hàng theo yêu cầu Chị đẹp)
  const [dateRange, setDateRange] = useState({
    dateFrom: "",
    dateTo: ""
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // Đóng popover chọn ngày khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quản lý bộ lọc / sắp xếp trực tiếp trên từng cột (Tham khảo chuẩn DS Đơn hàng ERP - Ảnh 2)
  const [columnFilters, setColumnFilters] = useState({
    bagCode: { sort: null, selectedValues: null, searchQuery: "" },
    itemCode: { sort: null, selectedValues: null, searchQuery: "" },
    category: { sort: null, selectedValues: null, searchQuery: "" },
    originalSoCode: { sort: null, selectedValues: null, searchQuery: "" },
    oldCustomerName: { sort: null, selectedValues: null, searchQuery: "" },
    lop: { sort: null, selectedValues: null, searchQuery: "" },
    availableQty: { sort: null, selectedValues: null, searchQuery: "" },
    assignedQty: { sort: null, selectedValues: null, searchQuery: "" },
    status: { sort: null, selectedValues: null, searchQuery: "" },
    targetNewSoCode: { sort: null, selectedValues: null, searchQuery: "" },
    metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
    stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
    totalWeight: { sort: null, selectedValues: null, searchQuery: "" }
  });

  // Cột nào đang mở Popover lọc
  const [activeFilterColKey, setActiveFilterColKey] = useState(null);

  // Copy helper
  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // 1. Unique Values Map cho từng cột để truyền vào ColumnFilterPopover
  const uniqueValuesMap = useMemo(() => {
    return {
      bagCode: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.bagCode))).sort(),
      itemCode: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.itemCode))).sort(),
      category: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.category || r.itemName))).sort(),
      originalSoCode: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.originalSoCode || "SO123456"))).sort(),
      oldCustomerName: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.oldCustomerName || "—"))).sort(),
      lop: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.lop))).sort(),
      availableQty: Array.from(
        new Set(MOCK_REPROCESS_LOTS.map((r) => (r.availableQty > 0 ? `${r.availableQty}` : "—")))
      ).sort(),
      assignedQty: Array.from(
        new Set(MOCK_REPROCESS_LOTS.map((r) => (r.assignedQty > 0 ? `${r.assignedQty}` : "—")))
      ).sort(),
      status: ["Chờ gán đơn mới", "Đã giữ chỗ", "Đã chuyển đơn"],
      targetNewSoCode: Array.from(
        new Set(MOCK_REPROCESS_LOTS.map((r) => r.targetNewSoCode || "—"))
      ).sort(),
      metalWeight: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.metalWeight.toFixed(4)))).sort(),
      stoneWeight: Array.from(
        new Set(MOCK_REPROCESS_LOTS.map((r) => (r.stoneWeight > 0 ? r.stoneWeight.toFixed(4) : "—")))
      ).sort(),
      totalWeight: Array.from(new Set(MOCK_REPROCESS_LOTS.map((r) => r.totalWeight.toFixed(4)))).sort()
    };
  }, []);

  // Kiểm tra cột có đang áp dụng lọc/sắp xếp
  const isColumnFiltered = (colKey) => {
    const f = columnFilters[colKey];
    if (!f) return false;
    return Boolean(f.sort || f.searchQuery || f.selectedValues);
  };

  // Áp dụng bộ lọc cho một cột
  const handleApplyColumnFilter = (colKey, filterData) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: {
        ...prev[colKey],
        ...filterData
      }
    }));
    setActiveFilterColKey(null);
  };

  // Xóa bộ lọc cho một cột
  const handleClearColumnFilter = (colKey) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: { sort: null, selectedValues: null, searchQuery: "" }
    }));
    setActiveFilterColKey(null);
  };

  // Kiểm tra bộ lọc ngày có đang hoạt động
  const isDateFilterActive = Boolean(dateRange.dateFrom || dateRange.dateTo);

  // Tổng số lượng điều kiện lọc đang kích hoạt
  const isAnyFilterActive = useMemo(() => {
    if (searchQuery.trim()) return true;
    if (isDateFilterActive) return true;
    if (activeTab !== "all") return true;
    return Object.keys(columnFilters).some((k) => isColumnFiltered(k));
  }, [searchQuery, isDateFilterActive, activeTab, columnFilters]);

  // Đặt lại toàn bộ bộ lọc
  const handleResetAllFilters = () => {
    setColumnFilters({
      bagCode: { sort: null, selectedValues: null, searchQuery: "" },
      itemCode: { sort: null, selectedValues: null, searchQuery: "" },
      category: { sort: null, selectedValues: null, searchQuery: "" },
      originalSoCode: { sort: null, selectedValues: null, searchQuery: "" },
      oldCustomerName: { sort: null, selectedValues: null, searchQuery: "" },
      lop: { sort: null, selectedValues: null, searchQuery: "" },
      availableQty: { sort: null, selectedValues: null, searchQuery: "" },
      assignedQty: { sort: null, selectedValues: null, searchQuery: "" },
      status: { sort: null, selectedValues: null, searchQuery: "" },
      targetNewSoCode: { sort: null, selectedValues: null, searchQuery: "" },
      metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
      stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
      totalWeight: { sort: null, selectedValues: null, searchQuery: "" }
    });
    setDateRange({ dateFrom: "", dateTo: "" });
    setSearchQuery("");
    setActiveFilterColKey(null);
  };

  // Filter & Search
  const filteredData = useMemo(() => {
    let list = [...MOCK_REPROCESS_LOTS];

    // 1. Lọc theo Tab trạng thái
    if (activeTab === "unassigned") {
      list = list.filter((r) => r.status === "Chờ gán đơn mới");
    } else if (activeTab === "assigned") {
      list = list.filter((r) => r.status === "Đã giữ chỗ" || r.status === "Đã chuyển đơn");
    }

    // 2. Lọc theo từ khóa tìm kiếm chung
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.bagCode.toLowerCase().includes(q) ||
          r.oldCustomerName.toLowerCase().includes(q) ||
          r.oldCustomerCode.toLowerCase().includes(q) ||
          r.originalSoCode.toLowerCase().includes(q) ||
          (r.targetNewBagCode && r.targetNewBagCode.toLowerCase().includes(q)) ||
          (r.targetNewSoCode && r.targetNewSoCode.toLowerCase().includes(q)) ||
          (r.newCustomerName && r.newCustomerName.toLowerCase().includes(q)) ||
          r.itemCode.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.itemName && r.itemName.toLowerCase().includes(q))
      );
    }

    // 3. Lọc theo khoảng ngày (Tham khảo DS đơn hàng theo yêu cầu Chị đẹp)
    if (dateRange.dateFrom || dateRange.dateTo) {
      const parseDateStr = (str) => {
        if (!str) return null;
        const [d, m, y] = str.split("/");
        return new Date(Number(y), Number(m) - 1, Number(d)).getTime();
      };

      const fromTime = dateRange.dateFrom ? new Date(dateRange.dateFrom).setHours(0, 0, 0, 0) : null;
      const toTime = dateRange.dateTo ? new Date(dateRange.dateTo).setHours(23, 59, 59, 999) : null;

      list = list.filter((r) => {
        const itemTime = parseDateStr(r.dateIn);
        if (!itemTime) return true;
        if (fromTime && itemTime < fromTime) return false;
        if (toTime && itemTime > toTime) return false;
        return true;
      });
    }

    // 4. Lọc theo từng cột (Column Filters qua Popover)
    Object.keys(columnFilters).forEach((colKey) => {
      const f = columnFilters[colKey];
      if (!f) return;

      // Filter theo SelectedValues (checkbox list)
      if (f.selectedValues instanceof Set) {
        list = list.filter((item) => {
          let val = "";
          if (colKey === "itemCode") val = item.itemCode || "";
          else if (colKey === "category") val = item.category || item.itemName || "";
          else if (colKey === "originalSoCode") val = item.originalSoCode || "SO123456";
          else if (colKey === "oldCustomerName") val = item.oldCustomerName || "—";
          else if (colKey === "availableQty") val = item.availableQty > 0 ? `${item.availableQty}` : "—";
          else if (colKey === "assignedQty") val = item.assignedQty > 0 ? `${item.assignedQty}` : "—";
          else if (colKey === "status") val = item.status;
          else if (colKey === "targetNewSoCode") val = item.targetNewSoCode || "—";
          else if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = item.stoneWeight > 0 ? item.stoneWeight.toFixed(4) : "—";
          else if (colKey === "totalWeight") val = item.totalWeight.toFixed(4);
          else val = String(item[colKey] || "");

          return f.selectedValues.has(val);
        });
      }

      // Filter theo SearchQuery trong cột
      if (f.searchQuery && f.searchQuery.trim()) {
        const sq = f.searchQuery.toLowerCase().trim();
        list = list.filter((item) => {
          let val = "";
          if (colKey === "itemCode") val = item.itemCode || "";
          else if (colKey === "category") val = `${item.category || ""} ${item.itemName || ""}`;
          else if (colKey === "originalSoCode") val = item.originalSoCode || "SO123456";
          else if (colKey === "oldCustomerName") val = item.oldCustomerName || "";
          else if (colKey === "availableQty") val = `${item.availableQty}`;
          else if (colKey === "assignedQty") val = `${item.assignedQty}`;
          else if (colKey === "status") val = item.status;
          else if (colKey === "targetNewSoCode") val = `${item.targetNewSoCode || ""} ${item.newCustomerName || ""} ${item.targetNewBagCode || ""}`;
          else if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = item.stoneWeight > 0 ? item.stoneWeight.toFixed(4) : "—";
          else if (colKey === "totalWeight") val = item.totalWeight.toFixed(4);
          else val = String(item[colKey] || "");

          return val.toLowerCase().includes(sq);
        });
      }
    });

    // 5. Sắp xếp (Sort) theo cột đang có sort
    const activeSortColKey = Object.keys(columnFilters).find((k) => columnFilters[k]?.sort);
    if (activeSortColKey) {
      const sortType = columnFilters[activeSortColKey].sort; // 'asc' | 'desc'
      list.sort((a, b) => {
        let aVal = a[activeSortColKey];
        let bVal = b[activeSortColKey];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortType === "asc" ? aVal - bVal : bVal - aVal;
        }

        aVal = String(aVal || "");
        bVal = String(bVal || "");
        return sortType === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    return list;
  }, [activeTab, searchQuery, columnFilters, dateRange]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const unassignedCount = MOCK_REPROCESS_LOTS.filter((r) => r.status === "Chờ gán đơn mới").length;
  const assignedCount = MOCK_REPROCESS_LOTS.length - unassignedCount;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 overflow-hidden">
      {/* 1. Sidebar Kho Thành Phẩm */}
      <InventorySidebar />

      {/* 2. Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar chuẩn, sạch sẽ */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Kho Thành Phẩm</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>Chờ Xử Lý Lại</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-bold text-slate-900">Danh Sách Lô Chờ Xử Lý Lại</span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/inventory/reprocess/serve"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors shadow-xs"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>Trạm Xuất Phôi Làm Mới (Serve FG)</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto space-y-4">

            {/* 1. TABLE CARD (ĐÃ BỎ 3 THẺ KPI THEO CHỈ ĐẠO CỦA CHỊ ĐẸP ĐỂ TỐI ƯU KHÔNG GIAN BẢNG) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* THANH CÔNG CỤ DUY NHẤT (1 HÀNG GỌN GÀNG THEO CHỈ ĐẠO CHỊ ĐẸP) */}
              <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 bg-white">
                {/* Bên trái: Bộ Tabs trạng thái & Sơ đồ luồng */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "all"
                        ? "bg-[#064e3b] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    Tất cả ({MOCK_REPROCESS_LOTS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("unassigned")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "unassigned"
                        ? "bg-amber-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    Chờ gán đơn mới ({unassignedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("assigned")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "assigned"
                        ? "bg-teal-700 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    Đã gán đơn mới ({assignedCount})
                  </button>
                </div>

                {/* Bên phải: Lọc khoảng ngày + Tìm kiếm + Xuất file */}
                {activeTab !== "workflow" ? (
                  <div className="flex items-center space-x-2">
                    {/* BỘ LỌC KHOẢNG NGÀY (THAM KHẢO LỌC Ở DS ĐƠN HÀNG) */}
                    <div className="relative" ref={datePickerRef}>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${isDateFilterActive
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-xs"
                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                        title="Lọc danh sách theo khoảng ngày nhập kho"
                      >
                        <Calendar className="h-3.5 w-3.5 text-emerald-700" />
                        <span>
                          {isDateFilterActive
                            ? `${dateRange.dateFrom ? dateRange.dateFrom.split("-").reverse().slice(0, 2).join("/") : "..."} → ${dateRange.dateTo ? dateRange.dateTo.split("-").reverse().slice(0, 2).join("/") : "..."}`
                            : "Lọc theo ngày"}
                        </span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </button>

                      {/* Popover Lọc Khoảng Ngày */}
                      {showDatePicker && (
                        <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-3.5 animate-in fade-in zoom-in-95 duration-100 text-xs">
                          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 font-bold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-emerald-700" />
                              <span>Lọc theo khoảng ngày vào kho</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowDatePicker(false)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="space-y-2.5">
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                                Từ ngày:
                              </label>
                              <input
                                type="date"
                                value={dateRange.dateFrom}
                                onChange={(e) => setDateRange({ ...dateRange, dateFrom: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                                Đến ngày:
                              </label>
                              <input
                                type="date"
                                value={dateRange.dateTo}
                                onChange={(e) => setDateRange({ ...dateRange, dateTo: e.target.value })}
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                setDateRange({ dateFrom: "", dateTo: "" });
                              }}
                              className="text-[11px] text-rose-600 hover:underline font-semibold"
                            >
                              Đặt lại
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowDatePicker(false)}
                              className="px-3 py-1 bg-[#064e3b] text-white rounded-lg text-xs font-bold hover:bg-[#043d2e] transition-colors"
                            >
                              Áp dụng
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nút Xóa tất cả lọc */}
                    {isAnyFilterActive && (
                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xóa toàn bộ các điều kiện lọc đang chọn"
                      >
                        <X className="h-3 w-3" />
                        <span>Xóa lọc</span>
                      </button>
                    )}

                    {/* Ô Tìm kiếm chung */}
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm mã bag, SO, khách..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-48 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Nút Xuất Excel */}
                    <button
                      type="button"
                      className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 transition-colors"
                      title="Xuất Excel"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("all")}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Boxes className="h-3.5 w-3.5 text-slate-500" />
                      <span>Xem Danh Sách Tồn Kho ({MOCK_REPROCESS_LOTS.length})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* NỘI DUNG CHÍNH: SƠ ĐỒ HOẶC BẢNG DỮ LIỆU */}
              {activeTab === "workflow" ? (
                <div className="p-4 md:p-6 bg-slate-50/50">
                  <InteractiveWorkflowDiagram />
                </div>
              ) : (
                /* Data Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[1380px]">
                    <thead className="bg-[#f8fafc] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px] select-none">
                      <tr>
                        {/* 1. MÃ LÔ */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>MÃ LÔ</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "bagCode" ? null : "bagCode");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("bagCode")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Mã Lô"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("bagCode") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "bagCode" && (
                            <ColumnFilterPopover
                              columnKey="bagCode"
                              columnTitle="Mã Lô"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.bagCode}
                              filterState={columnFilters.bagCode}
                              onApply={(data) => handleApplyColumnFilter("bagCode", data)}
                              onClear={() => handleClearColumnFilter("bagCode")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 2. MÃ ITEM (TÁCH RIÊNG TỪ TÊN SP & MÃ ITEM) */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>MÃ ITEM</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "itemCode" ? null : "itemCode");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("itemCode")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Mã Item"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("itemCode") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "itemCode" && (
                            <ColumnFilterPopover
                              columnKey="itemCode"
                              columnTitle="Mã Item"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.itemCode}
                              filterState={columnFilters.itemCode}
                              onApply={(data) => handleApplyColumnFilter("itemCode", data)}
                              onClear={() => handleClearColumnFilter("itemCode")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 3. CHỦNG LOẠI (TÁCH RIÊNG TỪ TÊN SP & MÃ ITEM) */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>CHỦNG LOẠI</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "category" ? null : "category");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("category")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Chủng loại"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("category") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "category" && (
                            <ColumnFilterPopover
                              columnKey="category"
                              columnTitle="Chủng Loại"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.category}
                              filterState={columnFilters.category}
                              onApply={(data) => handleApplyColumnFilter("category", data)}
                              onClear={() => handleClearColumnFilter("category")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 4. MÃ SO CŨ (BỔ SUNG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP) */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>MÃ SO CŨ</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "originalSoCode" ? null : "originalSoCode");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("originalSoCode")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Mã SO Cũ"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("originalSoCode") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "originalSoCode" && (
                            <ColumnFilterPopover
                              columnKey="originalSoCode"
                              columnTitle="Mã SO Cũ"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.originalSoCode}
                              filterState={columnFilters.originalSoCode}
                              onApply={(data) => handleApplyColumnFilter("originalSoCode", data)}
                              onClear={() => handleClearColumnFilter("originalSoCode")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 5. KHÁCH HÀNG CŨ (BỔ SUNG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP) */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>KHÁCH HÀNG CŨ</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "oldCustomerName" ? null : "oldCustomerName");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("oldCustomerName")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Khách Hàng Cũ"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("oldCustomerName") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "oldCustomerName" && (
                            <ColumnFilterPopover
                              columnKey="oldCustomerName"
                              columnTitle="Khách Hàng Cũ"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.oldCustomerName}
                              filterState={columnFilters.oldCustomerName}
                              onApply={(data) => handleApplyColumnFilter("oldCustomerName", data)}
                              onClear={() => handleClearColumnFilter("oldCustomerName")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 6. TUỔI VÀNG */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>TUỔI VÀNG</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "lop" ? null : "lop");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("lop")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Tuổi Vàng"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("lop") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "lop" && (
                            <ColumnFilterPopover
                              columnKey="lop"
                              columnTitle="Tuổi Vàng"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.lop}
                              filterState={columnFilters.lop}
                              onApply={(data) => handleApplyColumnFilter("lop", data)}
                              onClear={() => handleClearColumnFilter("lop")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 7. SL KHẢ DỤNG (Có thể gán cho đơn khác) */}
                        <th className="relative py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>SL KHẢ DỤNG</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "availableQty" ? null : "availableQty");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("availableQty")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột SL Khả dụng (có thể gán cho đơn khác)"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("availableQty") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "availableQty" && (
                            <ColumnFilterPopover
                              columnKey="availableQty"
                              columnTitle="SL Khả Dụng"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.availableQty}
                              filterState={columnFilters.availableQty}
                              onApply={(data) => handleApplyColumnFilter("availableQty", data)}
                              onClear={() => handleClearColumnFilter("availableQty")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 8. SL ĐÃ GÁN (Phương án B - Gộp giữ chỗ & đã chuyển) */}
                        <th className="relative py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>SL ĐÃ GÁN</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "assignedQty" ? null : "assignedQty");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("assignedQty")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột SL Đã gán (gồm giữ chỗ và đã chuyển)"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("assignedQty") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "assignedQty" && (
                            <ColumnFilterPopover
                              columnKey="assignedQty"
                              columnTitle="SL Đã Gán"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.assignedQty}
                              filterState={columnFilters.assignedQty}
                              onApply={(data) => handleApplyColumnFilter("assignedQty", data)}
                              onClear={() => handleClearColumnFilter("assignedQty")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 8. TRẠNG THÁI KHO */}
                        <th className="relative py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <span>TRẠNG THÁI KHO</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "status" ? null : "status");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("status")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp Trạng Thái Kho"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("status") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "status" && (
                            <ColumnFilterPopover
                              columnKey="status"
                              columnTitle="Trạng Thái Kho"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.status}
                              filterState={columnFilters.status}
                              onApply={(data) => handleApplyColumnFilter("status", data)}
                              onClear={() => handleClearColumnFilter("status")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 9. MÃ ĐƠN HÀNG MỚI (ĐỔI TỪ MÃ BAG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP) */}
                        <th className="relative py-2.5 px-3">
                          <div className="flex items-center justify-between space-x-1">
                            <span>MÃ ĐƠN HÀNG MỚI</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "targetNewSoCode" ? null : "targetNewSoCode");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("targetNewSoCode")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp cột Mã Đơn Hàng Mới"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("targetNewSoCode") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "targetNewSoCode" && (
                            <ColumnFilterPopover
                              columnKey="targetNewSoCode"
                              columnTitle="Mã Đơn Hàng Mới"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.targetNewSoCode}
                              filterState={columnFilters.targetNewSoCode}
                              onApply={(data) => handleApplyColumnFilter("targetNewSoCode", data)}
                              onClear={() => handleClearColumnFilter("targetNewSoCode")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 10. TL VÀNG (L) */}
                        <th className="relative py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>TL VÀNG (L)</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "metalWeight" ? null : "metalWeight");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("metalWeight")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp TL Vàng"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("metalWeight") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "metalWeight" && (
                            <ColumnFilterPopover
                              columnKey="metalWeight"
                              columnTitle="TL Vàng (L)"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.metalWeight}
                              filterState={columnFilters.metalWeight}
                              onApply={(data) => handleApplyColumnFilter("metalWeight", data)}
                              onClear={() => handleClearColumnFilter("metalWeight")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 11. TL ĐÁ */}
                        <th className="relative py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>TL ĐÁ</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "stoneWeight" ? null : "stoneWeight");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("stoneWeight")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp TL Đá"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("stoneWeight") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "stoneWeight" && (
                            <ColumnFilterPopover
                              columnKey="stoneWeight"
                              columnTitle="TL Đá"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.stoneWeight}
                              filterState={columnFilters.stoneWeight}
                              onApply={(data) => handleApplyColumnFilter("stoneWeight", data)}
                              onClear={() => handleClearColumnFilter("stoneWeight")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>

                        {/* 12. TỔNG TL */}
                        <th className="relative py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <span>TỔNG TL</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFilterColKey(activeFilterColKey === "totalWeight" ? null : "totalWeight");
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("totalWeight")
                                  ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                                }`}
                              title="Lọc & sắp xếp Tổng TL"
                            >
                              <Filter className={`h-3 w-3 ${isColumnFiltered("totalWeight") ? "fill-[#005a46]" : ""}`} />
                            </button>
                          </div>
                          {activeFilterColKey === "totalWeight" && (
                            <ColumnFilterPopover
                              columnKey="totalWeight"
                              columnTitle="Tổng TL"
                              columnType="select"
                              uniqueValues={uniqueValuesMap.totalWeight}
                              filterState={columnFilters.totalWeight}
                              onApply={(data) => handleApplyColumnFilter("totalWeight", data)}
                              onClear={() => handleClearColumnFilter("totalWeight")}
                              onClose={() => setActiveFilterColKey(null)}
                            />
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedLotForDrawer(row)}
                          className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                        >
                          {/* 1. Mã Lô (Mã Bag cũ): SO-2608... */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{row.bagCode}</span>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(row.bagCode, e)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                title="Sao chép mã Lô"
                              >
                                {copiedCode === row.bagCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 2. Mã Item (Tách riêng từ Tên SP & Mã Item) */}
                          <td className="py-3 px-3 font-mono text-teal-800 font-bold text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span title={row.itemCode} className="truncate max-w-[190px]">
                                {row.itemCode}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(row.itemCode, e)}
                                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                title="Sao chép mã Item"
                              >
                                {copiedCode === row.itemCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 3. Chủng loại (Tách riêng từ Tên SP & Mã Item) */}
                          <td className="py-3 px-3 font-bold text-slate-800 text-xs whitespace-nowrap">
                            {row.category || row.itemName}
                          </td>

                          {/* 4. Mã SO cũ (Bổ sung mới) */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                            {row.originalSoCode || "SO123456"}
                          </td>

                          {/* 5. Khách hàng cũ (Bổ sung mới) */}
                          <td className="py-3 px-3 text-slate-600 text-xs font-medium">
                            <div className="truncate max-w-[170px]" title={row.oldCustomerName}>
                              {row.oldCustomerName || "Công ty TNHH Vàng Bạc Kim Thành"}
                            </div>
                          </td>

                          {/* 6. Tuổi vàng */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              {row.lop}
                            </span>
                          </td>

                          {/* 7. SL Khả dụng (bỏ pcs theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                            {row.availableQty > 0 ? (
                              <span className="text-emerald-700 font-bold text-xs">{row.availableQty}</span>
                            ) : (
                              <span className="text-slate-300 font-normal select-none">—</span>
                            )}
                          </td>

                          {/* 8. SL Đã gán (Gộp giữ chỗ & đã chuyển theo Phương án B) */}
                          <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                            {row.assignedQty > 0 ? (
                              <span className="text-purple-700 font-bold text-xs">{row.assignedQty}</span>
                            ) : (
                              <span className="text-slate-300 font-normal select-none">—</span>
                            )}
                          </td>

                          {/* 9. Trạng thái kho: Quy chuẩn lại 3 màu sắc tương phản rõ nét theo chỉ đạo Chị đẹp */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {row.status === "Đã chuyển đơn" ? (
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                <span>Đã chuyển đơn</span>
                              </span>
                            ) : row.status === "Đã giữ chỗ" ? (
                              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                                <span>Đã giữ chỗ</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                <span>Chờ gán đơn mới</span>
                              </span>
                            )}
                          </td>

                          {/* 10. Mã Đơn Hàng Mới (Xử lý thông minh khi 1 lô gán cho 2 hoặc nhiều đơn) */}
                          <td className="py-3 px-3">
                            {row.assignedOrders && row.assignedOrders.length > 1 ? (
                              <div className="relative group/multi inline-block">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLotForDrawer(row);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] cursor-pointer hover:bg-indigo-100 transition-colors"
                                  title="Lô gán cho nhiều đơn - Click xem chi tiết"
                                >
                                  <span>{row.assignedOrders.length} Đơn hàng</span>
                                  <ExternalLink className="h-2.5 w-2.5 text-indigo-500" />
                                </button>
                                {/* Popover Tooltip khi hover */}
                                <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-slate-200 rounded-lg shadow-xl p-2.5 hidden group-hover/multi:block z-30 text-left animate-in fade-in zoom-in-95 duration-100">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase pb-1 mb-1.5 border-b border-slate-100 flex justify-between">
                                    <span>Đơn hàng đã gán ({row.assignedOrders.length}):</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {row.assignedOrders.map((ord, oIdx) => (
                                      <div key={oIdx} className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                                        <div className="flex items-center justify-between font-mono font-bold text-teal-800">
                                          <span>{ord.soCode}</span>
                                          <span className="text-[10px] font-sans font-bold text-indigo-700 bg-indigo-50 px-1 rounded">{ord.qty} pcs</span>
                                        </div>
                                        <div className="text-[10px] text-slate-600 truncate">{ord.customerName}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : row.isAssigned ? (
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={row.orderDetailUrl || "#"}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-mono font-bold text-teal-800 hover:text-teal-950 hover:underline text-xs flex items-center gap-1"
                                    title="Xem chi tiết đơn hàng mới trong QLĐH"
                                  >
                                    <span>{row.targetNewSoCode}</span>
                                    <ExternalLink className="h-3 w-3 text-teal-600" />
                                  </Link>
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[180px]">
                                  {row.newCustomerName} {row.targetNewBagCode ? `• Bag: ${row.targetNewBagCode}` : ""}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-normal select-none">—</span>
                            )}
                          </td>

                          {/* 10. TL Vàng (g) */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800 whitespace-nowrap">
                            {row.metalWeight.toFixed(4)}
                          </td>

                          {/* 11. TL Đá (g) - Số 0 hiển thị — */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800 whitespace-nowrap">
                            {row.stoneWeight > 0 ? (
                              row.stoneWeight.toFixed(4)
                            ) : (
                              <span className="text-slate-300 font-normal select-none">—</span>
                            )}
                          </td>

                          {/* 12. Tổng TL (g) */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {row.totalWeight.toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    {/* Footer Tổng Trang (13 cột chuẩn xác) */}
                    <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200 text-[11px]">
                      <tr>
                        <td colSpan={6} className="py-2.5 px-3 text-right">
                          Tổng ({filteredData.length} Lô):
                        </td>
                        {/* 7. Tổng SL Khả Dụng */}
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-black whitespace-nowrap">
                          {filteredData.reduce((s, r) => s + r.availableQty, 0)}
                        </td>
                        {/* 8. Tổng SL Đã Gán (Phương án B) */}
                        <td className="py-2.5 px-3 text-right font-mono text-purple-900 font-black whitespace-nowrap">
                          {filteredData.reduce((s, r) => s + (r.assignedQty || 0), 0)}
                        </td>
                        {/* 9. Thống kê theo Trạng thái thấp nhất */}
                        <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 whitespace-nowrap">
                          {filteredData.filter((r) => r.status === "Chờ gán đơn mới").length} chờ gán / {filteredData.filter((r) => r.status === "Đã giữ chỗ").length} giữ chỗ / {filteredData.filter((r) => r.status === "Đã chuyển đơn").length} đã chuyển
                        </td>
                        {/* 10. Mã đơn hàng mới */}
                        <td></td>
                        {/* 11. Tổng TL Vàng */}
                        <td className="py-2.5 px-3 text-right font-mono text-slate-900 whitespace-nowrap">
                          {filteredData.reduce((s, r) => s + r.metalWeight, 0).toFixed(4)}
                        </td>
                        {/* 12. Tổng TL Đá */}
                        <td className="py-2.5 px-3 text-right font-mono text-slate-900 whitespace-nowrap">
                          {filteredData.reduce((s, r) => s + r.stoneWeight, 0).toFixed(4)}
                        </td>
                        {/* 13. Tổng TL Toàn Bộ */}
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-black whitespace-nowrap">
                          {filteredData.reduce((s, r) => s + r.totalWeight, 0).toFixed(4)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* 3. DRAWER XEM CHI TIẾT LÔ HÀNG */}
      {selectedLotForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedLotForDrawer(null)}
          ></div>

          <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  CHI TIẾT LÔ CHỜ XỬ LÝ LẠI
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-mono">
                  {selectedLotForDrawer.bagCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotForDrawer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Box Thông tin đơn gốc bị hủy & Nguồn chuyển */}
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-rose-800">Nguồn gốc điều chuyển:</span>
                  <span className="font-mono font-bold text-rose-700">{selectedLotForDrawer.originalSoCode}</span>
                </div>
                <div className="text-[11px] text-slate-700 bg-white p-2 rounded border border-rose-200 space-y-0.5">
                  <div className="font-bold text-rose-900">
                    {selectedLotForDrawer.originSource || "Tồn kho thành phẩm (Chờ phân bổ) sang CXLL"}
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    Lý do: {selectedLotForDrawer.originCancelReason || "YC hủy đơn đã được Base phê duyệt"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Khách hàng cũ (Bảo toàn lịch sử):</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedLotForDrawer.oldCustomerName} ({selectedLotForDrawer.oldCustomerCode})
                  </div>
                </div>
              </div>

              {/* Box Cơ cấu số lượng & Trạng thái theo pcs thấp nhất */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-600">Trạng thái Lô (Theo pcs thấp nhất):</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    selectedLotForDrawer.status === "Đã chuyển đơn"
                      ? "bg-blue-100 text-blue-900 border border-blue-300"
                      : selectedLotForDrawer.status === "Đã giữ chỗ"
                      ? "bg-purple-100 text-purple-900 border border-purple-300"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{selectedLotForDrawer.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-200">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Tổng Lô</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{selectedLotForDrawer.totalQty}</span>
                  </div>
                  <div className="bg-emerald-50/60 p-2 rounded border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold block">SL Khả Dụng</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">
                      {selectedLotForDrawer.availableQty > 0 ? selectedLotForDrawer.availableQty : "—"}
                    </span>
                  </div>
                  <div className="bg-purple-50/60 p-2 rounded border border-purple-200">
                    <span className="text-[10px] text-purple-800 font-bold block">SL Đã Gán</span>
                    <span className="font-mono font-bold text-purple-700 text-xs">
                      {selectedLotForDrawer.assignedQty > 0 ? selectedLotForDrawer.assignedQty : "—"}
                    </span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">
                      ({selectedLotForDrawer.holdQty || 0} giữ chỗ / {selectedLotForDrawer.servedQty || 0} đã chuyển)
                    </span>
                  </div>
                </div>
              </div>

              {/* Box Thông tin sản phẩm */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                <div className="text-[10px] font-bold uppercase text-slate-500">Thông số kỹ thuật phôi:</div>
                <div>
                  <span className="text-slate-500">Tên sản phẩm:</span>
                  <div className="font-bold text-slate-800">{selectedLotForDrawer.itemName}</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <span className="text-slate-500">Mã Bản vẽ (Drawing):</span>
                    <div className="font-mono font-bold text-slate-800">{selectedLotForDrawer.drawingCode}</div>
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-500">Hàm lượng vàng:</span>
                    <div className="font-bold text-amber-900">{selectedLotForDrawer.lop}</div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Mã Item (SKU):</span>
                  <div className="font-mono text-teal-800 font-bold break-all bg-white p-1 rounded border border-slate-200 mt-0.5 text-[11px]">
                    {selectedLotForDrawer.itemCode}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500">Ni tay:</span>
                    <div className="font-bold text-slate-800">{selectedLotForDrawer.sizeNi}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Quy cách đá:</span>
                    <div className="font-bold text-slate-800">{selectedLotForDrawer.stoneSpec}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Vị trí két lưu kho:</span>
                    <div className="font-bold text-indigo-700">{selectedLotForDrawer.location}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Ngày nhập kho:</span>
                    <div className="font-mono text-slate-700">{selectedLotForDrawer.dateIn}</div>
                  </div>
                </div>
              </div>

              {/* Box Trọng lượng chi tiết */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1.5">
                <div className="text-[10px] font-bold uppercase text-slate-500">Định mức trọng lượng kim hoàn:</div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Trọng lượng vàng (TL Vàng):</span>
                  <span className="font-mono font-bold text-amber-800">{selectedLotForDrawer.metalWeight.toFixed(4)} L</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Trọng lượng đá (TL Đá):</span>
                  <span className="font-mono font-bold text-blue-700">{selectedLotForDrawer.stoneWeight.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-emerald-800 text-sm">
                  <span>Tổng trọng lượng (Tổng TL):</span>
                  <span className="font-mono">{selectedLotForDrawer.totalWeight.toFixed(4)}</span>
                </div>
              </div>

              {/* Box Kế hoạch gán đơn mới (Hỗ trợ hiển thị đa đơn hàng khi 1 lô gán cho 2 đơn) */}
              <div className={`rounded-lg p-3 border space-y-2 ${selectedLotForDrawer.isAssigned ? "bg-teal-50/50 border-teal-200" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between font-bold">
                  <span className={selectedLotForDrawer.isAssigned ? "text-teal-900" : "text-slate-700"}>Kế hoạch gán đơn mới:</span>
                  <span className="font-mono text-xs">
                    {selectedLotForDrawer.assignedOrders && selectedLotForDrawer.assignedOrders.length > 1
                      ? `${selectedLotForDrawer.assignedOrders.length} Đơn hàng mới`
                      : selectedLotForDrawer.isAssigned
                      ? selectedLotForDrawer.targetNewBagCode
                      : "Chưa gán"}
                  </span>
                </div>
                {selectedLotForDrawer.assignedOrders && selectedLotForDrawer.assignedOrders.length > 1 ? (
                  <div className="space-y-1.5 pt-1">
                    {selectedLotForDrawer.assignedOrders.map((ord, oIdx) => (
                      <div key={oIdx} className="bg-white p-2 rounded border border-slate-200 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between font-bold">
                          <Link
                            href="/orders/11"
                            className="font-mono text-teal-800 underline inline-flex items-center gap-1"
                          >
                            <span>{ord.soCode}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                            {ord.qty} pcs • {ord.status}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[10px]">
                          KH: <strong>{ord.customerName}</strong> • Bag: <span className="font-mono">{ord.bagCode}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedLotForDrawer.isAssigned ? (
                  <div className="text-slate-600 text-[11px]">
                    Đã được gán vào đơn hàng:{" "}
                    <Link
                      href={selectedLotForDrawer.orderDetailUrl || "#"}
                      className="font-mono font-bold text-teal-800 underline inline-flex items-center gap-0.5"
                    >
                      {selectedLotForDrawer.targetNewSoCode}
                      <ExternalLink className="h-3 w-3" />
                    </Link>{" "}
                    của <strong>{selectedLotForDrawer.newCustomerName}</strong>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px]">
                    Lô này đang nằm tại két kho, sẵn sàng để phân hệ Bán hàng pick vào đơn hàng mới.
                  </div>
                )}
              </div>

              {/* Box Quy trình 3 công đoạn gán cứng khi được pick vào đơn mới */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-700">
                    Routing gán cứng (BOM rỗng):
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    3 Trạm cố định
                  </span>
                </div>

                <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Trạm 1: Serve FG */}
                  <div className="flex items-start space-x-2.5 relative pl-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 z-10">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">Serve FG: Xuất cấp phôi kho CXLL</div>
                      <div className="text-[10px] text-slate-500">Đối soát mã bag cũ {selectedLotForDrawer.bagCode}, cấp phôi vào Bag mới theo MO của KHSX</div>
                    </div>
                  </div>

                  {/* Trạm 2: Stamping */}
                  <div className="flex items-start space-x-2.5 relative pl-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 z-10">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-blue-900 text-[11px]">Stamping: Xưởng thực thi đóng dấu / khắc</div>
                      <div className="text-[10px] text-slate-500">Đóng dấu hội, khắc laser logo/tuổi vàng mới theo quy cách khách hàng {selectedLotForDrawer.newCustomerName || "đơn hàng mới"}</div>
                    </div>
                  </div>

                  {/* Trạm 3: Packing Out */}
                  <div className="flex items-start space-x-2.5 relative pl-1">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 z-10">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-purple-900 text-[11px]">Packing Out: KCS & Nhập lại Kho Thành Phẩm</div>
                      <div className="text-[10px] text-slate-500">Bao gói hoàn chỉnh, nhập lại Kho Thành Phẩm → Sẵn sàng lập Phiếu giao hàng (DO) & Hóa đơn (Invoice)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              {/* Nút In Mã Bag KHSX mới nếu đã gán đơn */}
              {selectedLotForDrawer.isAssigned && (
                <button
                  type="button"
                  onClick={() => setPrintBagTarget(selectedLotForDrawer)}
                  className="px-3.5 py-2 rounded-lg border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="In Thẻ Bag KHSX mới theo format chuẩn nhà máy"
                >
                  <Printer className="h-4 w-4" />
                  <span>In Thẻ Bag</span>
                </button>
              )}

              {selectedLotForDrawer.isAlreadyServed ? (
                <div className="flex-1 py-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-center text-xs border border-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Đã chuyển sang Bag mới ({selectedLotForDrawer.targetNewBagCode})</span>
                </div>
              ) : selectedLotForDrawer.isAssigned ? (
                <Link
                  href={`/inventory/reprocess/serve?targetBag=${selectedLotForDrawer.targetNewBagCode}&oldBag=${selectedLotForDrawer.bagCode}`}
                  className="flex-1 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-center text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Cấp Thành Phẩm (Serve FG - Chuyển Bag)</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedLotForDrawer(null)}
                  className="w-full py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL IN THẺ BAG KHSX MỚI */}
      <ProductionBagPrintModal
        isOpen={Boolean(printBagTarget)}
        onClose={() => setPrintBagTarget(null)}
        bagData={
          printBagTarget
            ? {
              bagCode: printBagTarget.targetNewBagCode || `BAG-${printBagTarget.bagCode}`,
              itemCode: printBagTarget.itemCode,
              drawingCode: printBagTarget.drawingCode,
              size: printBagTarget.sizeNi,
              soCode: printBagTarget.targetNewSoCode || "SO2608011",
              customerName: printBagTarget.newCustomerName || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
              metalWeight: printBagTarget.metalWeight,
              stoneWeight: printBagTarget.stoneWeight,
              demandQty: printBagTarget.reprocessQty || 1
            }
            : null
        }
        initialPcs={printBagTarget?.reprocessQty || 4}
      />
    </div>
  );
}
