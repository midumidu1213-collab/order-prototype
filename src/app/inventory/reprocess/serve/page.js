"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Barcode,
  Search,
  Check,
  CheckCircle2,
  Printer,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Boxes,
  X,
  ExternalLink,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  ArrowLeftRight,
  CheckCheck,
  RotateCcw,
  ListFilter,
  ArrowLeft,
  Filter
} from "lucide-react";
import InventorySidebar from "@/components/inventory/InventorySidebar";
import ColumnFilterPopover from "@/components/orders/ColumnFilterPopover";
import ProductionBagPrintModal from "@/components/inventory/ProductionBagPrintModal";
import {
  MOCK_REPROCESS_LOTS,
  MOCK_NEW_SO_TARGETS
} from "@/data/inventoryMockData";

export default function FgIssueServePage() {
  const [newSos, setNewSos] = useState(MOCK_NEW_SO_TARGETS);
  const [oldLots, setOldLots] = useState(MOCK_REPROCESS_LOTS);

  // Chế độ xem: 'list' (Danh Sách Chờ Serve FG) hoặc 'transfer' (Điều Phối Chuyển Component Bag)
  const [viewMode, setViewMode] = useState("list");

  // Tab lọc danh sách chờ serve FG: 'all' | 'waiting' | 'served'
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  // Bag được chọn hiện tại để điều phối
  const [selectedNewBagCode, setSelectedNewBagCode] = useState("SO-261024-001");
  const [selectedOldBagCode, setSelectedOldBagCode] = useState("SO-260800061");

  // Trạng thái đã chuyển linh kiện giữa 2 Bag (true/false cho từng Bag mới)
  const [transferredBags, setTransferredBags] = useState({
    "SO-261024-001": true,
    "SO-261024-002": true
  });

  // Modal in nhãn Bag mới
  const [printModalTarget, setPrintModalTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const barcodeInputRef = useRef(null);

  // Quản lý bộ lọc / sắp xếp trực tiếp trên từng cột (Tham khảo chuẩn DS Đơn hàng ERP - 14 cột chuẩn chỉ)
  const [columnFilters, setColumnFilters] = useState({
    expectedOldBagCode: { sort: null, selectedValues: null, searchQuery: "" },
    originalSoCode: { sort: null, selectedValues: null, searchQuery: "" },
    oldCustomer: { sort: null, selectedValues: null, searchQuery: "" },
    itemCode: { sort: null, selectedValues: null, searchQuery: "" },
    category: { sort: null, selectedValues: null, searchQuery: "" },
    metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
    stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
    totalWeight: { sort: null, selectedValues: null, searchQuery: "" },
    newBagCode: { sort: null, selectedValues: null, searchQuery: "" },
    soCode: { sort: null, selectedValues: null, searchQuery: "" },
    customerName: { sort: null, selectedValues: null, searchQuery: "" },
    serveStatus: { sort: null, selectedValues: null, searchQuery: "" }
  });

  // Cột nào đang mở Popover lọc
  const [activeFilterColKey, setActiveFilterColKey] = useState(null);

  // Bắt query param từ URL nếu có (từ trang Quản lý đơn hoặc kho CXLL điều hướng sang)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const targetParam = params.get("targetBag");
      const oldParam = params.get("oldBag");
      const modeParam = params.get("mode");
      if (targetParam) setSelectedNewBagCode(targetParam);
      if (oldParam) setSelectedOldBagCode(oldParam);
      if (modeParam === "transfer" || targetParam) {
        setViewMode("transfer");
      }
    }
  }, []);

  // Âm thanh Beep mô phỏng súng quét kho
  const playScanBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback
    }
  };

  // Copy helper
  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Đối tượng SO Đích đang chọn
  const selectedNewBag = useMemo(() => {
    return newSos.find((s) => s.newBagCode === selectedNewBagCode) || newSos[0];
  }, [newSos, selectedNewBagCode]);

  // Đối tượng Bag Nguồn (Lô cũ CXLL) tương ứng
  const selectedOldLot = useMemo(() => {
    if (!selectedOldBagCode && selectedNewBag) {
      return oldLots.find((l) => l.bagCode === selectedNewBag.expectedOldBagCode) || oldLots[0];
    }
    return oldLots.find((l) => l.bagCode === selectedOldBagCode) || oldLots[0];
  }, [oldLots, selectedOldBagCode, selectedNewBag]);

  // Kiểm tra trạng thái đã chuyển linh kiện của Bag hiện tại
  const isCurrentTransferred = Boolean(transferredBags[selectedNewBagCode]);

  // Kiểm tra trạng thái đã đóng bag / đã hoàn tất
  const isCurrentServed = selectedNewBag?.serveStatus === "Đã chuyển sang bag mới";

  // Thao tác Điều phối: [Chuyển tất cả] sang Bag mới
  const handleTransferAll = () => {
    playScanBeep();
    setTransferredBags((prev) => ({
      ...prev,
      [selectedNewBagCode]: true
    }));
    setToastMessage({
      type: "info",
      text: `Đã phân bổ toàn bộ linh kiện từ ${selectedOldLot.bagCode} sang ${selectedNewBag.newBagCode}. Vui lòng đối soát bảng trọng lượng trước khi xác nhận cấp!`
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Thao tác Điều phối: [Trả tất cả] về Bag cũ
  const handleRevertAll = () => {
    if (isCurrentServed) {
      alert("Bag này đã được xác nhận cấp và đóng vĩnh viễn, không thể hoàn tác!");
      return;
    }
    playScanBeep();
    setTransferredBags((prev) => ({
      ...prev,
      [selectedNewBagCode]: false
    }));
    setToastMessage({
      type: "warning",
      text: `Đã hoàn trả toàn bộ linh kiện về Bag nguồn ${selectedOldLot.bagCode}.`
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // XÁC NHẬN CẤP VÀ ĐÓNG BAG CŨ (Hành động chốt)
  const handleConfirmServeAndCloseBag = () => {
    if (!isCurrentTransferred) {
      alert("Vui lòng bấm [Chuyển tất cả] để phân bổ linh kiện sang Bag mới trước khi xác nhận cấp!");
      return;
    }

    playScanBeep();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    // 1. Cập nhật trạng thái Bag mới sang 'Đã chuyển sang bag mới'
    setNewSos((prev) =>
      prev.map((s) =>
        s.newBagCode === selectedNewBagCode
          ? {
            ...s,
            serveStatus: "Đã chuyển sang bag mới",
            status: "Đã chuyển sang bag mới",
            wc: "WC-Stamping",
            isScanned: true,
            scannedDate: "29/10/2026",
            scannedTime: timeStr
          }
          : s
      )
    );

    // 2. Cập nhật Lô cũ trong Kho CXLL sang 'Đã chuyển sang bag mới / Đã đóng Bag'
    setOldLots((prev) =>
      prev.map((l) =>
        l.bagCode === selectedOldLot.bagCode
          ? {
            ...l,
            isClosed: true,
            isAlreadyServed: true,
            status: "Đã chuyển sang bag mới",
            serveStatus: "Đã chuyển sang bag mới",
            labelStatus: "Đã hủy nhãn cũ"
          }
          : l
      )
    );

    // 3. Thông báo thành công và mở Modal In Tem
    setToastMessage({
      type: "success",
      text: `Xác nhận cấp thành phẩm thành công! Đã đóng Bag cũ ${selectedOldLot.bagCode} và chuyển sang Bag mới ${selectedNewBag.newBagCode}.`
    });
    setTimeout(() => setToastMessage(null), 4000);

    setTimeout(() => {
      setPrintModalTarget(selectedNewBagCode);
    }, 400);
  };

  // Mở màn hình Điều phối cho một dòng Bag cụ thể
  const handleOpenTransferForBag = (so) => {
    playScanBeep();
    setSelectedNewBagCode(so.newBagCode);
    if (so.expectedOldBagCode) {
      setSelectedOldBagCode(so.expectedOldBagCode);
    }
    setViewMode("transfer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý quét qua Barcode Input
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const code = barcodeInput.trim().toUpperCase();

    // Tìm trong danh sách Bag đích mới
    const matchedNew = newSos.find((s) => s.newBagCode.toUpperCase() === code);
    if (matchedNew) {
      playScanBeep();
      setSelectedNewBagCode(matchedNew.newBagCode);
      if (matchedNew.expectedOldBagCode) {
        setSelectedOldBagCode(matchedNew.expectedOldBagCode);
      }
      setViewMode("transfer");
      setBarcodeInput("");
      return;
    }

    // Tìm trong danh sách Lô cũ CXLL
    const matchedOld = oldLots.find(
      (l) => l.bagCode.toUpperCase() === code || l.labelBarcode?.toUpperCase() === code
    );
    if (matchedOld) {
      playScanBeep();
      setSelectedOldBagCode(matchedOld.bagCode);
      if (matchedOld.targetNewBagCode) {
        setSelectedNewBagCode(matchedOld.targetNewBagCode);
      }
      setViewMode("transfer");
      setBarcodeInput("");
      return;
    }

    alert(`Không tìm thấy Bag nào khớp với mã: ${code}`);
  };

  // 1. Unique Values Map cho từng cột để truyền vào ColumnFilterPopover
  const uniqueValuesMap = useMemo(() => {
    return {
      expectedOldBagCode: Array.from(new Set(newSos.map((s) => s.expectedOldBagCode))).sort(),
      originalSoCode: Array.from(new Set(newSos.map((s) => s.originalSoCode || "SO123456"))).sort(),
      oldCustomer: Array.from(new Set(newSos.map((s) => s.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"))).sort(),
      itemCode: Array.from(new Set(newSos.map((s) => s.itemCode))).sort(),
      category: Array.from(new Set(newSos.map((s) => s.category || s.itemName))).sort(),
      metalWeight: Array.from(new Set(newSos.map((s) => s.metalWeight.toFixed(4)))).sort(),
      stoneWeight: Array.from(new Set(newSos.map((s) => s.stoneWeight > 0 ? s.stoneWeight.toFixed(4) : "—"))).sort(),
      totalWeight: Array.from(new Set(newSos.map((s) => s.totalWeight.toFixed(4)))).sort(),
      newBagCode: Array.from(new Set(newSos.map((s) => s.newBagCode))).sort(),
      soCode: Array.from(new Set(newSos.map((s) => s.soCode))).sort(),
      customerName: Array.from(new Set(newSos.map((s) => s.customerName))).sort(),
      serveStatus: Array.from(new Set(newSos.map((s) => s.serveStatus))).sort()
    };
  }, [newSos]);

  // Kiểm tra cột có đang áp dụng lọc/sắp xếp
  const isColumnFiltered = (colKey) => {
    const f = columnFilters[colKey];
    if (!f) return false;
    return Boolean(f.sort || f.searchQuery || f.selectedValues);
  };

  // Có bất kỳ bộ lọc nào đang kích hoạt
  const isAnyFilterActive = useMemo(() => {
    if (searchQuery.trim()) return true;
    if (activeTab !== "all") return true;
    return Object.keys(columnFilters).some((k) => isColumnFiltered(k));
  }, [searchQuery, activeTab, columnFilters]);

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

  // Đặt lại toàn bộ bộ lọc
  const handleResetAllFilters = () => {
    setColumnFilters({
      expectedOldBagCode: { sort: null, selectedValues: null, searchQuery: "" },
      originalSoCode: { sort: null, selectedValues: null, searchQuery: "" },
      oldCustomer: { sort: null, selectedValues: null, searchQuery: "" },
      itemCode: { sort: null, selectedValues: null, searchQuery: "" },
      category: { sort: null, selectedValues: null, searchQuery: "" },
      metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
      stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
      totalWeight: { sort: null, selectedValues: null, searchQuery: "" },
      newBagCode: { sort: null, selectedValues: null, searchQuery: "" },
      soCode: { sort: null, selectedValues: null, searchQuery: "" },
      customerName: { sort: null, selectedValues: null, searchQuery: "" },
      serveStatus: { sort: null, selectedValues: null, searchQuery: "" }
    });
    setSearchQuery("");
    setActiveTab("all");
    setActiveFilterColKey(null);
  };

  // Danh sách lọc Bag mới cho bảng chờ Serve FG với đầy đủ Filter / Sort / Search theo cột
  const filteredNewSos = useMemo(() => {
    let list = [...newSos];

    // 1. Tab trạng thái
    if (activeTab === "waiting") {
      list = list.filter((s) => s.serveStatus !== "Đã chuyển sang bag mới");
    } else if (activeTab === "served") {
      list = list.filter((s) => s.serveStatus === "Đã chuyển sang bag mới");
    }

    // 2. Global Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.newBagCode.toLowerCase().includes(q) ||
          s.soCode.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.expectedOldBagCode.toLowerCase().includes(q) ||
          (s.originalSoCode && s.originalSoCode.toLowerCase().includes(q)) ||
          (s.oldCustomer && s.oldCustomer.toLowerCase().includes(q)) ||
          (s.itemCode && s.itemCode.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q)) ||
          s.itemName.toLowerCase().includes(q)
      );
    }

    // 3. Lọc theo từng cột (Column Filters)
    Object.keys(columnFilters).forEach((colKey) => {
      const f = columnFilters[colKey];
      if (!f) return;

      // Filter theo SelectedValues (checkbox list)
      if (f.selectedValues instanceof Set) {
        list = list.filter((item) => {
          let val = "";
          if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = item.stoneWeight > 0 ? item.stoneWeight.toFixed(4) : "—";
          else if (colKey === "totalWeight") val = item.totalWeight.toFixed(4);
          else if (colKey === "originalSoCode") val = item.originalSoCode || "SO123456";
          else if (colKey === "oldCustomer") val = item.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
          else if (colKey === "category") val = item.category || item.itemName;
          else val = String(item[colKey] || "");

          return f.selectedValues.has(val);
        });
      }

      // Filter theo SearchQuery trong cột
      if (f.searchQuery && f.searchQuery.trim()) {
        const sq = f.searchQuery.toLowerCase().trim();
        list = list.filter((item) => {
          let val = "";
          if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = item.stoneWeight > 0 ? item.stoneWeight.toFixed(4) : "—";
          else if (colKey === "totalWeight") val = item.totalWeight.toFixed(4);
          else if (colKey === "originalSoCode") val = item.originalSoCode || "SO123456";
          else if (colKey === "oldCustomer") val = item.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
          else if (colKey === "category") val = item.category || item.itemName;
          else val = String(item[colKey] || "");

          return val.toLowerCase().includes(sq);
        });
      }
    });

    // 4. Sắp xếp (Sort) theo cột đang có sort
    const activeSortColKey = Object.keys(columnFilters).find((k) => columnFilters[k]?.sort);
    if (activeSortColKey) {
      const sortType = columnFilters[activeSortColKey].sort; // 'asc' | 'desc'
      list.sort((a, b) => {
        let aVal = a[activeSortColKey];
        let bVal = b[activeSortColKey];

        if (activeSortColKey === "category") {
          aVal = a.category || a.itemName;
          bVal = b.category || b.itemName;
        } else if (activeSortColKey === "oldCustomer") {
          aVal = a.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
          bVal = b.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortType === "asc" ? aVal - bVal : bVal - aVal;
        }

        aVal = String(aVal || "");
        bVal = String(bVal || "");
        return sortType === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    return list;
  }, [newSos, activeTab, searchQuery, columnFilters]);

  // Thông số trọng lượng mẫu chuẩn
  const currentTotalWeight = selectedOldLot?.totalWeight ?? 0.5045;
  const currentStoneWeight = selectedOldLot?.stoneWeight ?? 0.0150;
  const currentMetalWeight = selectedOldLot?.metalWeight ?? (currentTotalWeight - currentStoneWeight);

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans antialiased text-slate-800 overflow-hidden">
      {/* 1. Sidebar Kho Thành Phẩm */}
      <InventorySidebar />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar Navigation */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/inventory/reprocess" className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1">
              <span>← Kho Chờ Xử Lý Lại (CXLL)</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-bold text-slate-800">
              {viewMode === "transfer"
                ? "Cấp thành phẩm (Serve FG)"
                : "Danh Sách Chờ Serve Finish Good (FG)"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {viewMode === "transfer" ? (
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
                <span>Trở Về Danh Sách ({newSos.length})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode("transfer")}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                <span>Mở Màn Hình Cấp Thành Phẩm</span>
              </button>
            )}

            <Link
              href="/orders/11"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Mở chi tiết đơn hàng SO2608011 của QLĐH"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              <span>Đơn Hàng SO2608011</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>

            <Link
              href="/orders/warehouse-picker"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold shadow-2xs transition-colors"
              title="Xem màn hình QLĐH gán phôi và tách 2 luồng"
            >
              <Layers className="h-3.5 w-3.5 text-teal-700" />
              <span>Luồng QLĐH Phân Bổ</span>
            </Link>
          </div>
        </header>

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between transition-all ${toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : toastMessage.type === "warning"
                ? "bg-amber-500 text-white"
                : "bg-teal-700 text-white"
            }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: MÀN HÌNH DANH SÁCH CHỜ SERVE FG (THEO ẢNH 2 & 3)   */}
        {/* ========================================================= */}
        {viewMode === "list" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            {/* Header Thống Kê & Quét Nhanh */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-700" />
                  <span>Danh Sách Chờ Serve Finish Good (FG)</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý chuyển đổi lô phôi từ Kho CXLL sang Bag mới cho đơn hàng làm mới (Routing fix)
                </p>
              </div>

              {/* Ô Quét Barcode Nhanh */}
              <form onSubmit={handleBarcodeSubmit} className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Barcode className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Quét mã Bag mới / Lô cũ..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  Cấp nhanh
                </button>
              </form>
            </div>

            {/* Ô TÌM KIẾM TOÀN CỤC NẰM Ở HÀNG TRÊN (THEO ĐÚNG MŨI TÊN ĐỎ ẢNH 3 & ẢNH 2) */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mã Bag mới, mã SO, khách hàng, mã lô cũ, mã SO cũ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs shadow-2xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="px-3 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Xóa tất cả các điều kiện lọc và tìm kiếm"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Xóa lọc</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="p-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Tải lại danh sách"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bảng Danh Sách Chuẩn Hóa Với ColumnFilterPopover Theo Ảnh 2 & Ảnh 3 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Tab trạng thái */}
              <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${activeTab === "all" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Tất cả ({newSos.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("waiting")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${activeTab === "waiting" ? "bg-white text-amber-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Chờ chuyển bag ({newSos.filter((s) => s.serveStatus !== "Đã chuyển sang bag mới").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("served")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${activeTab === "served" ? "bg-white text-emerald-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Đã chuyển ({newSos.filter((s) => s.serveStatus === "Đã chuyển sang bag mới").length})
                  </button>
                </div>

                {/* Thông báo kết quả lọc */}
                <div className="text-xs text-slate-500">
                  Đang hiển thị <b>{filteredNewSos.length}</b> / {newSos.length} Bag
                </div>
              </div>

              {/* Bảng Dữ Liệu: Hỗ trợ Filter/Sort/Search Theo Từng Cột (Theo Ảnh 2 & 3) */}
              <div className="overflow-x-auto min-h-[420px]">
                <table className="min-w-[1600px] w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px] select-none">
                    <tr>
                      {/* 1. STT */}
                      <th className="py-2.5 px-3 w-12 text-center font-bold text-slate-800">STT</th>

                      {/* 2. MÃ LÔ CŨ */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ LÔ CŨ</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "expectedOldBagCode" ? null : "expectedOldBagCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("expectedOldBagCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã Lô Cũ"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("expectedOldBagCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "expectedOldBagCode" && (
                          <ColumnFilterPopover
                            columnKey="expectedOldBagCode"
                            columnTitle="Mã Lô Cũ"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.expectedOldBagCode}
                            filterState={columnFilters.expectedOldBagCode}
                            onApply={(data) => handleApplyColumnFilter("expectedOldBagCode", data)}
                            onClear={() => handleClearColumnFilter("expectedOldBagCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 3. MÃ SO CŨ */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span className="text-rose-700 font-bold">MÃ SO CŨ</span>
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

                      {/* 4. KHÁCH HÀNG CŨ (MÃ-TÊN) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>KHÁCH HÀNG CŨ (MÃ-TÊN)</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "oldCustomer" ? null : "oldCustomer");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("oldCustomer")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Khách Hàng Cũ"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("oldCustomer") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "oldCustomer" && (
                          <ColumnFilterPopover
                            columnKey="oldCustomer"
                            columnTitle="Khách Hàng Cũ (Mã-Tên)"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.oldCustomer}
                            filterState={columnFilters.oldCustomer}
                            onApply={(data) => handleApplyColumnFilter("oldCustomer", data)}
                            onClear={() => handleClearColumnFilter("oldCustomer")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 5. MÃ ITEM */}
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

                      {/* 6. CHỦNG LOẠI */}
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
                            title="Lọc & sắp xếp cột Chủng Loại"
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

                      {/* 7. TL METAL */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TL METAL</span>
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
                            title="Lọc & sắp xếp TL Metal"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("metalWeight") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "metalWeight" && (
                          <ColumnFilterPopover
                            columnKey="metalWeight"
                            columnTitle="TL Metal"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.metalWeight}
                            filterState={columnFilters.metalWeight}
                            onApply={(data) => handleApplyColumnFilter("metalWeight", data)}
                            onClear={() => handleClearColumnFilter("metalWeight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 8. TL ĐÁ */}
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

                      {/* 9. TỔNG TL */}
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

                      {/* 10. MÃ LÔ MỚI */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span className="text-teal-900 font-bold">MÃ LÔ MỚI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "newBagCode" ? null : "newBagCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("newBagCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã Lô Mới"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("newBagCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "newBagCode" && (
                          <ColumnFilterPopover
                            columnKey="newBagCode"
                            columnTitle="Mã Lô Mới"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.newBagCode}
                            filterState={columnFilters.newBagCode}
                            onApply={(data) => handleApplyColumnFilter("newBagCode", data)}
                            onClear={() => handleClearColumnFilter("newBagCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 11. MÃ SO MỚI */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ SO MỚI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "soCode" ? null : "soCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("soCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã SO Mới"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("soCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "soCode" && (
                          <ColumnFilterPopover
                            columnKey="soCode"
                            columnTitle="Mã SO Mới"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.soCode}
                            filterState={columnFilters.soCode}
                            onApply={(data) => handleApplyColumnFilter("soCode", data)}
                            onClear={() => handleClearColumnFilter("soCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 12. KHÁCH HÀNG MỚI */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>KHÁCH HÀNG MỚI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "customerName" ? null : "customerName");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("customerName")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Khách Hàng Mới"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("customerName") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "customerName" && (
                          <ColumnFilterPopover
                            columnKey="customerName"
                            columnTitle="Khách Hàng Mới"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.customerName}
                            filterState={columnFilters.customerName}
                            onApply={(data) => handleApplyColumnFilter("customerName", data)}
                            onClear={() => handleClearColumnFilter("customerName")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 13. TRẠNG THÁI */}
                      <th className="relative py-2.5 px-3 text-center min-w-[170px] whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <span>TRẠNG THÁI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "serveStatus" ? null : "serveStatus");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("serveStatus")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp Trạng Thái"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("serveStatus") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "serveStatus" && (
                          <ColumnFilterPopover
                            columnKey="serveStatus"
                            columnTitle="Trạng Thái"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.serveStatus}
                            filterState={columnFilters.serveStatus}
                            onApply={(data) => handleApplyColumnFilter("serveStatus", data)}
                            onClear={() => handleClearColumnFilter("serveStatus")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 14. THAO TÁC */}
                      <th className="py-2.5 px-3 text-center min-w-[130px] whitespace-nowrap">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNewSos.map((so, idx) => {
                      const isServed = so.serveStatus === "Đã chuyển sang bag mới";

                      return (
                        <tr
                          key={so.id}
                          className={`hover:bg-slate-50 transition-colors ${isServed ? "bg-emerald-50/15" : ""
                            }`}
                        >
                          {/* 1. STT */}
                          <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>

                          {/* 2. Mã Lô Cũ */}
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {so.expectedOldBagCode}
                            </span>
                          </td>

                          {/* 3. Mã SO Cũ */}
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {so.originalSoCode || "SO123456"}
                            </span>
                          </td>

                          {/* 4. Khách Hàng Cũ (Mã-Tên) */}
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-700 truncate block max-w-[220px]" title={so.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"}>
                              {so.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"}
                            </span>
                          </td>

                          {/* 5. Mã Item */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800">
                              <span className="font-bold truncate max-w-[170px]" title={so.itemCode}>
                                {so.itemCode}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(so.itemCode, e)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Sao chép mã item"
                              >
                                {copiedCode === so.itemCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 6. Chủng Loại */}
                          <td className="py-3 px-3">
                            <span className="font-medium text-slate-800">
                              {so.category || so.itemName}
                            </span>
                          </td>

                          {/* 7. TL Metal */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800">
                            {so.metalWeight.toFixed(4)}
                          </td>

                          {/* 8. TL Đá - Số 0 hiển thị — */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800">
                            {so.stoneWeight > 0 ? (
                              so.stoneWeight.toFixed(4)
                            ) : (
                              <span className="text-slate-300 select-none">—</span>
                            )}
                          </td>

                          {/* 9. Tổng TL */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            {so.totalWeight.toFixed(4)}
                          </td>

                          {/* 10. Mã Lô Mới (Đã bỏ dòng tên SP phụ bên dưới theo note đỏ) */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <strong className="font-mono text-xs text-teal-900 font-bold">
                                {so.newBagCode}
                              </strong>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(so.newBagCode, e)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Sao chép mã lô mới"
                              >
                                {copiedCode === so.newBagCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 11. Mã SO Mới */}
                          <td className="py-3 px-3">
                            <Link
                              href={so.orderDetailUrl || "/orders/11"}
                              className="font-mono font-bold text-teal-800 hover:text-teal-950 underline decoration-dotted"
                              title="Xem chi tiết đơn hàng SO mới"
                            >
                              {so.soCode}
                            </Link>
                          </td>

                          {/* 12. Khách Hàng Mới */}
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 truncate block max-w-[190px]" title={so.customerName}>
                              {so.customerName}
                            </span>
                          </td>

                          {/* 13. Trạng Thái */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {isServed ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 whitespace-nowrap shadow-2xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>Đã chuyển sang bag mới</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 whitespace-nowrap shadow-2xs">
                                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                <span>Chờ chuyển bag</span>
                              </span>
                            )}
                          </td>

                          {/* 14. Thao Tác */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {isServed ? (
                                <button
                                  type="button"
                                  onClick={() => setPrintModalTarget(so.newBagCode)}
                                  className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                  title="In thẻ Bag KHSX mới theo format nhà máy"
                                >
                                  <Printer className="h-3.5 w-3.5 text-emerald-700" />
                                  <span>In mã Bag</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenTransferForBag(so)}
                                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                                  <span>Cấp thành phẩm</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Chân Bảng Tổng Cộng */}
                  <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200 text-[11px]">
                    <tr>
                      <td colSpan={6} className="py-2.5 px-3 text-right">
                        Tổng cộng ({filteredNewSos.length} Bag):
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                        {filteredNewSos.reduce((s, r) => s + r.metalWeight, 0).toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                        {filteredNewSos.reduce((s, r) => s + r.stoneWeight, 0).toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-black">
                        {filteredNewSos.reduce((s, r) => s + r.totalWeight, 0).toFixed(4)}
                      </td>
                      <td colSpan={5} className="py-2.5 px-3 text-center text-[10px] text-slate-500">
                        {filteredNewSos.filter((s) => s.serveStatus === "Đã chuyển sang bag mới").length} đã chuyển / {filteredNewSos.filter((s) => s.serveStatus !== "Đã chuyển sang bag mới").length} chờ chuyển
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: KHÔNG GIAN ĐIỀU PHỐI LIỀN MẠCH THEO IMAGE 1 & 2   */}
        {/* (CỐ ĐỊNH LAYOUT NGANG SIDE-BY-SIDE, THÊM MÃ ITEM THEO NOTE) */}
        {/* ========================================================= */}
        {viewMode === "transfer" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            {/* Header Điều Phối & Breadcrumb (Đổi thành "Cấp thành phẩm" theo chỉ đạo Chị đẹp) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 mr-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Quay lại DS</span>
                  </button>
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-slate-900 text-sm">Cấp thành phẩm (Công đoạn Serve Finish Good)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Đơn hàng đích:</span>
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedNewBag?.soCode || "SO2608011"}
                  </span>
                  <span className="text-slate-600 font-medium truncate max-w-[200px]">
                    {selectedNewBag?.customerName || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC"}
                  </span>
                </div>
              </div>

              {/* Thanh Quét hoặc Nhập Barcode */}
              <form onSubmit={handleBarcodeSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Barcode className="h-4 w-4" />
                </div>
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Quét hoặc nhập mã Bag nguồn / Bag đích (VD: SO-260800063 hoặc SO-261024-003)..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full pl-10 pr-28 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all placeholder:font-sans placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
                >
                  Tra cứu Bag
                </button>
              </form>

              {/* 2 KHUNG BAG NGUỒN & BAG ĐÍCH CỐ ĐỊNH NGANG NHAU (SIDE-BY-SIDE) THEO MŨI TÊN ĐỎ ẢNH 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pt-1">

                {/* Box Trái: Bag nguồn (Xuất đi) */}
                <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl relative group hover:border-slate-400 transition-all">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1">
                    <span className="text-slate-700 uppercase tracking-wide">Bag nguồn (Xuất đi)</span>
                    <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                      Kho CXLL (Đơn hủy SO123456)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-base font-black text-slate-900">
                        {selectedOldLot?.bagCode || "— Chưa chọn Bag"}
                      </strong>
                      <span className="text-xs text-slate-600 font-medium truncate max-w-[190px]">
                        ({selectedOldLot?.itemName || "Vòng Tay Nữ"})
                      </span>
                    </div>
                    {selectedOldLot && (
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        TL: {currentTotalWeight.toFixed(4)} lượng
                      </span>
                    )}
                  </div>
                  {/* Hiển thị Mã Item Bag Nguồn (THEO NOTE ĐỎ ẢNH 1) */}
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Mã Item:</span>
                      <strong className="text-teal-800 font-bold">{selectedOldLot?.itemCode || "GY0BE000144A00A0000000CZWW1048"}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(selectedOldLot?.itemCode, e)}
                      className="text-slate-400 hover:text-slate-600"
                      title="Sao chép mã Item nguồn"
                    >
                      {copiedCode === selectedOldLot?.itemCode ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Box Phải: Bag đích (Nhận vào) - NẰM NGANG VỚI BAG NGUỒN THEO MŨI TÊN ẢNH 1 */}
                <div className="p-3.5 bg-teal-50/60 border border-teal-300 rounded-xl relative group hover:border-teal-400 transition-all">
                  <div className="flex items-center justify-between text-[11px] text-teal-800 font-bold mb-1">
                    <span className="text-teal-900 uppercase tracking-wide">Bag đích (Nhận vào)</span>
                    <span className="text-[10px] font-mono bg-teal-200 text-teal-900 px-2 py-0.5 rounded font-bold">
                      Đơn mới SO2608011
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-base font-black text-teal-950">
                        {selectedNewBag?.newBagCode || "— Chưa chọn Bag"}
                      </strong>
                      <span className="text-xs text-teal-700 font-medium truncate max-w-[190px]">
                        ({selectedNewBag?.itemName || "Vòng Tay Nữ VT-048"})
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isCurrentServed
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}>
                      {selectedNewBag?.serveStatus || "Chờ chuyển bag"}
                    </span>
                  </div>
                  {/* Hiển thị Mã Item Bag Đích (THEO NOTE ĐỎ ẢNH 1) */}
                  <div className="mt-1.5 pt-1.5 border-t border-teal-200/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[10px] text-teal-600 font-sans font-bold uppercase">Mã Item:</span>
                      <strong className="text-teal-900 font-bold">{selectedNewBag?.itemCode || "GY0BE000144A00A0000000CZWW1048"}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(selectedNewBag?.itemCode, e)}
                      className="text-teal-600 hover:text-teal-800"
                      title="Sao chép mã Item đích"
                    >
                      {copiedCode === selectedNewBag?.itemCode ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* BẢNG COMPONENT SO SÁNH NGANG HÀNG TRỰC DIỆN (TINH GỌN, BAG ĐÍCH ĐƯỢC ĐƯA LÊN NGANG HÀNG BAG NGUỒN) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">

              {/* Header Toolbar Tinh Gọn & Cụm Nút Thao Tác Điều Phối */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                    <Boxes className="h-4.5 w-4.5 text-teal-700" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span>Bảng So Sánh & Điều Phối Component Trực Diện</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                        {selectedOldLot?.lop || "AU 61.00 Y"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                      <span>Bag Nguồn: <strong className="font-mono text-slate-800">{selectedOldLot?.bagCode}</strong></span>
                      <span className="text-slate-300">➔</span>
                      <span>Bag Đích: <strong className="font-mono text-teal-800">{selectedNewBag?.newBagCode}</strong></span>
                      <span className="text-slate-400">({selectedNewBag?.customerName || "DNTN Ý NGỌC"})</span>
                    </div>
                  </div>
                </div>

                {/* Cụm Nút Điều Phối Tinh Gọn Nằm Trên Toolbar (Không làm gián đoạn dòng bảng) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTransferAll}
                    disabled={isCurrentTransferred}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${isCurrentTransferred
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-teal-700 hover:bg-teal-800 text-white"
                      }`}
                  >
                    <span>Chuyển tất cả sang Bag đích</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleRevertAll}
                    disabled={!isCurrentTransferred || isCurrentServed}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${!isCurrentTransferred || isCurrentServed
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
                      }`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Trả tất cả</span>
                  </button>
                </div>
              </div>

              {/* Bảng Dữ Liệu So Sánh Ngang Hàng Tuyệt Đối Giữa Bag Nguồn và Bag Đích (Dịch sang trái, bố trí cân đối theo chỉ đạo) */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse table-fixed">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200 text-[11px] select-none">
                    <tr>
                      <th rowSpan={2} className="py-2.5 px-3.5 border-r border-slate-200 w-[36%]">
                        Component (Phụ liệu & Khuôn Cast)
                      </th>
                      <th colSpan={2} className="py-1.5 px-3 text-center border-r border-slate-200 bg-slate-100/70 text-slate-800 w-[28%]">
                        Bag Nguồn ({selectedOldLot?.bagCode})
                      </th>
                      <th rowSpan={2} className="py-2.5 px-2 text-center border-r border-slate-200 w-[6%] bg-slate-50 text-slate-400 font-mono">
                        ➔
                      </th>
                      <th colSpan={2} className="py-1.5 px-3 text-center bg-teal-50/70 text-teal-900 w-[30%]">
                        Bag Đích ({selectedNewBag?.newBagCode})
                      </th>
                    </tr>
                    <tr className="border-t border-slate-200 text-[10px] text-slate-500">
                      <th className="py-1.5 px-3 text-center w-[14%]">Hiện tại</th>
                      <th className="py-1.5 px-3 text-center w-[14%] border-r border-slate-200">Còn lại</th>
                      <th className="py-1.5 px-3 text-center w-[15%] text-emerald-700 font-bold">Nhận thêm (+)</th>
                      <th className="py-1.5 px-3 text-center w-[15%] text-teal-950 font-bold">Sau khi nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">

                    {/* Nhóm: Phụ liệu - Đá */}
                    <tr className="bg-slate-100/70 font-bold text-slate-700 text-[11px]">
                      <td colSpan={6} className="py-1.5 px-3.5">▾ Phụ liệu - Đá</td>
                    </tr>
                    {selectedOldLot?.components?.stones?.length > 0 ? (
                      selectedOldLot.components.stones.map((st, i) => (
                        <tr key={i} className="hover:bg-slate-50/80 text-[11px] transition-colors">
                          <td className="py-2.5 px-3.5 pl-6 font-mono text-slate-800 border-r border-slate-100">
                            <div className="font-bold text-teal-900">{st.code}</div>
                            <div className="text-[10px] text-slate-400 font-sans mt-0.5">{st.name}</div>
                          </td>
                          {/* Nguồn: Hiện tại */}
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                            {st.qty}
                          </td>
                          {/* Nguồn: Còn lại */}
                          <td className="py-2.5 px-3 text-center font-mono font-bold border-r border-slate-200">
                            <span className={isCurrentTransferred ? "text-slate-400" : "text-slate-900"}>
                              {isCurrentTransferred ? "0" : st.qty}
                            </span>
                          </td>
                          {/* Mũi tên chuyển */}
                          <td className="py-2.5 px-2 text-center text-teal-600 font-bold border-r border-slate-200 bg-slate-50/40">
                            ➔
                          </td>
                          {/* Đích: Nhận thêm (+) */}
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                            {isCurrentTransferred ? `+${st.qty}` : "—"}
                          </td>
                          {/* Đích: Sau khi nhận */}
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-teal-950">
                            {isCurrentTransferred ? st.qty : "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-[11px] text-slate-400">
                        <td className="py-2.5 px-3.5 pl-6 italic border-r border-slate-100">Không có đá (Phôi trơn)</td>
                        <td className="py-2.5 px-3 text-center">—</td>
                        <td className="py-2.5 px-3 text-center border-r border-slate-200">—</td>
                        <td className="py-2.5 px-2 text-center border-r border-slate-200 bg-slate-50/40">—</td>
                        <td className="py-2.5 px-3 text-center">—</td>
                        <td className="py-2.5 px-3 text-center">—</td>
                      </tr>
                    )}

                    {/* Nhóm: Khuôn (Cast) / Thân Phôi */}
                    <tr className="bg-slate-100/70 font-bold text-slate-700 text-[11px]">
                      <td colSpan={6} className="py-1.5 px-3.5">▾ Khuôn (Cast) / Thân Phôi</td>
                    </tr>
                    {selectedOldLot?.components?.cast?.map((cs, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 text-[11px] transition-colors">
                        <td className="py-2.5 px-3.5 pl-6 font-mono text-slate-800 border-r border-slate-100">
                          <div className="font-bold text-teal-900">{cs.code}</div>
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5">{cs.name}</div>
                        </td>
                        {/* Nguồn: Hiện tại */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                          {cs.qty}
                        </td>
                        {/* Nguồn: Còn lại */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold border-r border-slate-200">
                          <span className={isCurrentTransferred ? "text-slate-400" : "text-slate-900"}>
                            {isCurrentTransferred ? "0" : cs.qty}
                          </span>
                        </td>
                        {/* Mũi tên chuyển */}
                        <td className="py-2.5 px-2 text-center text-teal-600 font-bold border-r border-slate-200 bg-slate-50/40">
                          ➔
                        </td>
                        {/* Đích: Nhận thêm (+) */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                          {isCurrentTransferred ? `+${cs.qty}` : "—"}
                        </td>
                        {/* Đích: Sau khi nhận */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-teal-950">
                          {isCurrentTransferred ? cs.qty : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Chân Bảng Tóm Tắt Trọng Lượng Ngang Hàng Tuyệt Đối */}
                  <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200 text-[11px]">
                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3.5 text-right font-sans border-r border-slate-200">
                        Tổng trọng lượng:
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-800">
                        {currentTotalWeight.toFixed(4)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">
                        <span className={isCurrentTransferred ? "text-slate-400" : "text-slate-900"}>
                          {isCurrentTransferred ? "0.0000" : currentTotalWeight.toFixed(4)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-teal-600 font-bold border-r border-slate-200 bg-slate-100/50">
                        ➔
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-emerald-700 font-bold">
                        {isCurrentTransferred ? `+${currentTotalWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-teal-950 font-black">
                        {isCurrentTransferred ? currentTotalWeight.toFixed(4) : "—"}
                      </td>
                    </tr>

                    <tr className="border-b border-slate-100">
                      <td className="py-2 px-3.5 text-right font-sans border-r border-slate-200">
                        Trọng lượng đá:
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-800">
                        {currentStoneWeight.toFixed(4)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">
                        <span className={isCurrentTransferred ? "text-slate-400" : "text-slate-900"}>
                          {isCurrentTransferred ? "0.0000" : currentStoneWeight.toFixed(4)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-teal-600 font-bold border-r border-slate-200 bg-slate-100/50">
                        ➔
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-emerald-700 font-bold">
                        {isCurrentTransferred ? (currentStoneWeight > 0 ? `+${currentStoneWeight.toFixed(4)}` : "—") : "—"}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-800 font-bold">
                        {isCurrentTransferred ? (currentStoneWeight > 0 ? currentStoneWeight.toFixed(4) : "—") : "—"}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 px-3.5 text-right font-sans border-r border-slate-200">
                        Trọng lượng kim loại:
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-800">
                        {currentMetalWeight.toFixed(4)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono border-r border-slate-200">
                        <span className={isCurrentTransferred ? "text-slate-400" : "text-slate-900"}>
                          {isCurrentTransferred ? "0.0000" : currentMetalWeight.toFixed(4)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-teal-600 font-bold border-r border-slate-200 bg-slate-100/50">
                        ➔
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-emerald-700 font-bold">
                        {isCurrentTransferred ? `+${currentMetalWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-800 font-bold">
                        {isCurrentTransferred ? currentMetalWeight.toFixed(4) : "—"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* BẢNG XEM TRƯỚC SỰ THAY ĐỔI TRỌNG LƯỢNG (THEO IMAGE 2 & CHỈ ĐẠO BỎ REJECT + GRAM) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Bảng xem trước sự thay đổi trọng lượng (Đối soát kế toán)</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Đơn vị tính: <b>Lượng vàng</b> (Làm tròn 4 số lẻ)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse table-fixed">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th rowSpan={2} className="py-2 px-3 border-r border-slate-200 w-[22%]">
                        Thông số
                      </th>
                      <th colSpan={3} className="py-1 px-3 text-center border-r border-slate-200 bg-slate-100/70 w-[39%]">
                        Bag Nguồn ({selectedOldLot?.bagCode})
                      </th>
                      <th colSpan={3} className="py-1 px-3 text-center bg-teal-50/70 text-teal-900 w-[39%]">
                        Bag Đích ({selectedNewBag?.newBagCode})
                      </th>
                    </tr>
                    <tr className="border-t border-slate-200 text-[10px] text-slate-500">
                      <th className="py-1.5 px-3 text-right w-[13%]">Trước</th>
                      <th className="py-1.5 px-3 text-right w-[13%]">Chuyển (-)</th>
                      <th className="py-1.5 px-3 text-right border-r border-slate-200 w-[13%]">Sau</th>
                      <th className="py-1.5 px-3 text-right w-[13%]">Trước</th>
                      <th className="py-1.5 px-3 text-right w-[13%]">Nhận (+)</th>
                      <th className="py-1.5 px-3 text-right font-bold text-teal-950 w-[13%]">Sau</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] font-mono">

                    {/* 1. Tổng TL */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        Tổng TL
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {currentTotalWeight.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">
                        {isCurrentTransferred ? `-${currentTotalWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 border-r border-slate-200">
                        {isCurrentTransferred ? "—" : currentTotalWeight.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        —
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                        {isCurrentTransferred ? `+${currentTotalWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-teal-950">
                        {isCurrentTransferred ? currentTotalWeight.toFixed(4) : "—"}
                      </td>
                    </tr>

                    {/* 2. TL Đá */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        TL Đá
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {currentStoneWeight > 0 ? currentStoneWeight.toFixed(4) : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">
                        {isCurrentTransferred && currentStoneWeight > 0 ? `-${currentStoneWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 border-r border-slate-200">
                        {isCurrentTransferred ? "—" : (currentStoneWeight > 0 ? currentStoneWeight.toFixed(4) : "—")}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        —
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                        {isCurrentTransferred && currentStoneWeight > 0 ? `+${currentStoneWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-teal-950">
                        {isCurrentTransferred && currentStoneWeight > 0 ? currentStoneWeight.toFixed(4) : "—"}
                      </td>
                    </tr>

                    {/* 3. TL Kim loại */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        TL Kim loại
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {currentMetalWeight.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">
                        {isCurrentTransferred ? `-${currentMetalWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 border-r border-slate-200">
                        {isCurrentTransferred ? "—" : currentMetalWeight.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        —
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                        {isCurrentTransferred ? `+${currentMetalWeight.toFixed(4)}` : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-teal-950">
                        {isCurrentTransferred ? currentMetalWeight.toFixed(4) : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Thanh Nút Hành Động Chân Trang */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Ghi chú:</span>
                  <span>Sau khi bấm xác nhận, Bag cũ sẽ bị hủy nhãn và đóng vĩnh viễn trong kho CXLL.</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPrintModalTarget(selectedNewBagCode)}
                    className="px-3.5 py-2 rounded-lg border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    title="In thẻ Bag KHSX mới theo format nhà máy"
                  >
                    <Printer className="h-4 w-4 text-teal-700" />
                    <span>In Mã Bag (Format KHSX)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    Hủy & Về danh sách
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmServeAndCloseBag}
                    disabled={!isCurrentTransferred}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${!isCurrentTransferred
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : isCurrentServed
                          ? "bg-emerald-700 text-white hover:bg-emerald-800"
                          : "bg-[#005a46] hover:bg-[#004737] text-white"
                      }`}
                  >
                    <CheckCheck className="h-4 w-4 text-amber-300" />
                    <span>
                      {isCurrentServed ? "In lại Thẻ Bag & Xem" : "Xác nhận cấp & Đóng Bag cũ"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL IN THẺ BAG MỚI (FORMAT CHUẨN KHSX THEO ẢNH ĐÍNH KÈM) */}
      {/* ========================================================= */}
      <ProductionBagPrintModal
        isOpen={Boolean(printModalTarget)}
        onClose={() => setPrintModalTarget(null)}
        bagData={newSos.find((s) => s.newBagCode === printModalTarget) || selectedNewBag}
        initialPcs={newSos.find((s) => s.newBagCode === printModalTarget)?.demandQty || 4}
      />
    </div>
  );
}
