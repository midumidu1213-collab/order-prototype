"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Boxes,
  Search,
  Filter,
  Download,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Copy,
  AlertTriangle,
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import InventorySidebar from "@/components/inventory/InventorySidebar";
import ColumnFilterPopover from "@/components/orders/ColumnFilterPopover";
import { MOCK_COMMERCIAL_INVENTORY } from "@/data/inventoryMockData";

export default function CommercialInventoryPage() {
  const [inventoryList, setInventoryList] = useState(MOCK_COMMERCIAL_INVENTORY);
  
  // Tab trạng thái tồn: 'all' | 'unallocated' | 'allocated' | 'invoice' | 'delivery'
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer xem chi tiết Lô và danh sách Seri
  const [selectedLotForDrawer, setSelectedLotForDrawer] = useState(null);
  
  // Modal xác nhận chuyển Chờ xử lý lại (CXLL)
  const [lotToTransferCxll, setLotToTransferCxll] = useState(null);
  const [transferQty, setTransferQty] = useState(1);
  const [selectedLotIds, setSelectedLotIds] = useState(new Set());
  const [isBatchTransferModalOpen, setIsBatchTransferModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Bộ lọc / sắp xếp trực tiếp trên từng cột (Tham khảo chuẩn DS Đơn hàng ERP)
  const [columnFilters, setColumnFilters] = useState({
    bagCode: { sort: null, selectedValues: null, searchQuery: "" },
    customerCode: { sort: null, selectedValues: null, searchQuery: "" },
    customerName: { sort: null, selectedValues: null, searchQuery: "" },
    soCode: { sort: null, selectedValues: null, searchQuery: "" },
    itemCode: { sort: null, selectedValues: null, searchQuery: "" },
    category: { sort: null, selectedValues: null, searchQuery: "" },
    lop: { sort: null, selectedValues: null, searchQuery: "" },
    totalQty: { sort: null, selectedValues: null, searchQuery: "" },
    status: { sort: null, selectedValues: null, searchQuery: "" },
    weight: { sort: null, selectedValues: null, searchQuery: "" },
    metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
    stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
    createdBy: { sort: null, selectedValues: null, searchQuery: "" },
    createdAt: { sort: null, selectedValues: null, searchQuery: "" },
    dateIn: { sort: null, selectedValues: null, searchQuery: "" }
  });

  // Cột nào đang mở Popover lọc
  const [activeFilterColKey, setActiveFilterColKey] = useState(null);

  // Copy helper
  const handleCopy = (code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // 1. Unique Values Map cho từng cột để truyền vào ColumnFilterPopover
  const uniqueValuesMap = useMemo(() => {
    return {
      bagCode: Array.from(new Set(inventoryList.map((r) => r.bagCode))).sort(),
      customerCode: Array.from(new Set(inventoryList.map((r) => r.customerCode))).sort(),
      customerName: Array.from(new Set(inventoryList.map((r) => r.customerName))).sort(),
      soCode: Array.from(new Set(inventoryList.map((r) => r.soCode || "—"))).sort(),
      itemCode: Array.from(new Set(inventoryList.map((r) => r.itemCode))).sort(),
      category: Array.from(new Set(inventoryList.map((r) => r.category || r.itemName))).sort(),
      lop: Array.from(new Set(inventoryList.map((r) => r.lop))).sort(),
      totalQty: Array.from(new Set(inventoryList.map((r) => `${r.totalQty} psc`))).sort(),
      status: Array.from(new Set(inventoryList.map((r) => r.status))).sort(),
      weight: Array.from(new Set(inventoryList.map((r) => r.weight.toFixed(4)))).sort(),
      metalWeight: Array.from(new Set(inventoryList.map((r) => r.metalWeight.toFixed(4)))).sort(),
      stoneWeight: Array.from(
        new Set(inventoryList.map((r) => (r.stoneWeight > 0 ? r.stoneWeight.toFixed(4) : "—")))
      ).sort(),
      createdBy: Array.from(new Set(inventoryList.map((r) => r.createdBy || "—"))).sort(),
      createdAt: Array.from(new Set(inventoryList.map((r) => r.createdAt || "—"))).sort(),
      dateIn: Array.from(new Set(inventoryList.map((r) => r.dateIn || "—"))).sort()
    };
  }, [inventoryList]);

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

  // Đặt lại toàn bộ bộ lọc
  const handleResetAllFilters = () => {
    setColumnFilters({
      bagCode: { sort: null, selectedValues: null, searchQuery: "" },
      customerCode: { sort: null, selectedValues: null, searchQuery: "" },
      customerName: { sort: null, selectedValues: null, searchQuery: "" },
      soCode: { sort: null, selectedValues: null, searchQuery: "" },
      itemCode: { sort: null, selectedValues: null, searchQuery: "" },
      category: { sort: null, selectedValues: null, searchQuery: "" },
      lop: { sort: null, selectedValues: null, searchQuery: "" },
      totalQty: { sort: null, selectedValues: null, searchQuery: "" },
      status: { sort: null, selectedValues: null, searchQuery: "" },
      weight: { sort: null, selectedValues: null, searchQuery: "" },
      metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
      stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
      createdBy: { sort: null, selectedValues: null, searchQuery: "" },
      createdAt: { sort: null, selectedValues: null, searchQuery: "" },
      dateIn: { sort: null, selectedValues: null, searchQuery: "" }
    });
    setSearchQuery("");
    setActiveFilterColKey(null);
  };

  const isAnyFilterActive = useMemo(() => {
    if (searchQuery.trim()) return true;
    if (activeTab !== "all") return true;
    return Object.keys(columnFilters).some((k) => isColumnFiltered(k));
  }, [searchQuery, activeTab, columnFilters]);

  // Thống kê số lượng theo 4 trạng thái tồn
  const countsByStatus = useMemo(() => {
    return {
      unallocated: inventoryList.filter((r) => r.status === "Chờ phân bổ").length,
      allocated: inventoryList.filter((r) => r.status === "Đã phân bổ").length,
      invoice: inventoryList.filter((r) => r.status === "Chờ lập HĐ").length,
      delivery: inventoryList.filter((r) => r.status === "Chờ giao").length
    };
  }, [inventoryList]);

  // Filter & Search logic
  const filteredData = useMemo(() => {
    let list = [...inventoryList];

    // 1. Filter theo Tab Trạng thái tồn
    if (activeTab === "unallocated") {
      list = list.filter((r) => r.status === "Chờ phân bổ");
    } else if (activeTab === "allocated") {
      list = list.filter((r) => r.status === "Đã phân bổ");
    } else if (activeTab === "invoice") {
      list = list.filter((r) => r.status === "Chờ lập HĐ");
    } else if (activeTab === "delivery") {
      list = list.filter((r) => r.status === "Chờ giao");
    }

    // 2. Filter theo Search chung
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.bagCode.toLowerCase().includes(q) ||
          r.customerCode.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          (r.soCode && r.soCode.toLowerCase().includes(q)) ||
          r.itemCode.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.itemName.toLowerCase().includes(q) ||
          (r.createdBy && r.createdBy.toLowerCase().includes(q))
      );
    }

    // 3. Filter theo từng cột (Column Filters qua Popover)
    Object.keys(columnFilters).forEach((colKey) => {
      const f = columnFilters[colKey];
      if (!f) return;

      if (f.selectedValues instanceof Set) {
        list = list.filter((item) => {
          let val = "";
          if (colKey === "category") val = item.category || item.itemName || "";
          else if (colKey === "totalQty") val = `${item.totalQty} psc`;
          else if (colKey === "weight") val = item.weight.toFixed(4);
          else if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = item.stoneWeight > 0 ? item.stoneWeight.toFixed(4) : "—";
          else val = String(item[colKey] || "—");

          return f.selectedValues.has(val);
        });
      }

      if (f.searchQuery && f.searchQuery.trim()) {
        const sq = f.searchQuery.toLowerCase().trim();
        list = list.filter((item) => {
          let val = "";
          if (colKey === "category") val = `${item.category || ""} ${item.itemName || ""}`;
          else if (colKey === "totalQty") val = `${item.totalQty}`;
          else if (colKey === "weight") val = item.weight.toFixed(4);
          else if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = item.stoneWeight > 0 ? item.stoneWeight.toFixed(4) : "—";
          else val = String(item[colKey] || "");

          return val.toLowerCase().includes(sq);
        });
      }
    });

    // 4. Sort logic
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
  }, [inventoryList, activeTab, searchQuery, columnFilters]);

  // Checkbox chọn nhiều lô (AC 3)
  const isAllSelected = useMemo(() => {
    return filteredData.length > 0 && filteredData.every((r) => selectedLotIds.has(r.id));
  }, [filteredData, selectedLotIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLotIds(new Set());
    } else {
      setSelectedLotIds(new Set(filteredData.map((r) => r.id)));
    }
  };

  const handleToggleSelectRow = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedLotIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Hành động Chuyển Chờ xử lý lại (Thủ kho chuyển khi đơn hàng bị hủy trước khi giao)
  const handleOpenTransferCxllModal = (row, e) => {
    if (e) e.stopPropagation();
    setLotToTransferCxll(row);
    setTransferQty(row.totalQty); // Mặc định chuyển hết lô, cho phép chỉnh lẻ (AC 4)
  };

  // Xác nhận chuyển lô sang kho CXLL (Hỗ trợ chuyển SL lẻ - AC 4)
  const handleConfirmTransferToCxll = () => {
    if (!lotToTransferCxll) return;

    const qtyToTransfer = Math.max(1, Math.min(lotToTransferCxll.totalQty, transferQty));
    const isPartial = qtyToTransfer < lotToTransferCxll.totalQty;

    if (isPartial) {
      // Tách lô: giảm số lượng trên lô gốc tại Kho TP
      setInventoryList((prev) =>
        prev.map((item) => {
          if (item.id === lotToTransferCxll.id) {
            const remain = item.totalQty - qtyToTransfer;
            const ratio = remain / item.totalQty;
            return {
              ...item,
              totalQty: remain,
              weight: item.weight * ratio,
              metalWeight: item.metalWeight * ratio,
              stoneWeight: item.stoneWeight * ratio
            };
          }
          return item;
        })
      );
    } else {
      // Chuyển toàn bộ: rút hẳn lô này khỏi Tồn kho TP sẵn sàng bán
      setInventoryList((prev) => prev.filter((item) => item.id !== lotToTransferCxll.id));
      if (selectedLotForDrawer?.id === lotToTransferCxll.id) {
        setSelectedLotForDrawer(null);
      }
    }

    const transferredBag = lotToTransferCxll.bagCode;
    const transferredText = isPartial 
      ? `Đã chuyển lẻ ${qtyToTransfer}/${lotToTransferCxll.totalQty} psc của lô ${transferredBag} sang Kho CXLL.`
      : `Lô ${transferredBag} (${qtyToTransfer} psc) đã được đưa vào Kho Chờ Xử Lý Lại (CXLL) với trạng thái 'Chờ gán đơn mới'.`;

    setLotToTransferCxll(null);

    // Hiển thị Toast thông báo thành công
    setToastMessage({
      type: "success",
      title: isPartial ? "Chuyển Lẻ Sang CXLL Thành Công" : "Chuyển Chờ Xử Lý Lại Thành Công",
      text: transferredText,
      targetUrl: `/inventory/reprocess?highlight=${transferredBag}`
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  // Xác nhận chuyển hàng loạt các lô đã chọn qua Checkbox (AC 3)
  const handleConfirmBatchTransfer = () => {
    const selectedLots = inventoryList.filter((item) => selectedLotIds.has(item.id));
    if (selectedLots.length === 0) return;

    // Chỉ chuyển các lô hợp lệ (Chờ phân bổ)
    const validLots = selectedLots.filter((item) => item.status === "Chờ phân bổ");
    const blockedLots = selectedLots.filter((item) => item.status !== "Chờ phân bổ");

    if (validLots.length === 0) {
      alert("Không có lô nào hợp lệ để chuyển! Các lô đã chọn đang dính dáng đến DO/Invoice dở dang.");
      return;
    }

    const validIds = new Set(validLots.map((l) => l.id));
    setInventoryList((prev) => prev.filter((item) => !validIds.has(item.id)));
    setSelectedLotIds(new Set());
    setIsBatchTransferModalOpen(false);

    let notifyText = `Đã chuyển thành công ${validLots.length} lô sang Kho Chờ Xử Lý Lại.`;
    if (blockedLots.length > 0) {
      notifyText += ` (Bỏ qua ${blockedLots.length} lô do đang ở trạng thái ${blockedLots.map(b => b.status).join(", ")})`;
    }

    setToastMessage({
      type: "success",
      title: "Chuyển Hàng Loạt Thành Công",
      text: notifyText,
      targetUrl: `/inventory/reprocess`
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  // Helper render Badge trạng thái tồn theo chuẩn
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Chờ phân bổ":
        return (
          <span className="bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Chờ phân bổ</span>
          </span>
        );
      case "Đã phân bổ":
        return (
          <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            <span>Đã phân bổ</span>
          </span>
        );
      case "Chờ lập HĐ":
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>Chờ lập HĐ</span>
          </span>
        );
      case "Chờ giao":
        return (
          <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            <span>Chờ giao</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 overflow-hidden">
      {/* 1. Sidebar Kho Thành Phẩm */}
      <InventorySidebar />

      {/* 2. Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Kho Thành Phẩm</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-bold text-slate-800">Danh Sách Tồn Kho Thành Phẩm</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
              US-08.1: Chuẩn Hóa Sạch
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/inventory/cancel-requests"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
              <span>Tiếp nhận YC Hủy SO (2)</span>
            </Link>
            <Link
              href="/inventory/reprocess"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
              <span>Kho Chờ Xử Lý Lại (40)</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f1f5f9]">
          <div className="max-w-[1600px] mx-auto space-y-4">
            
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold shrink-0">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-slate-900 leading-tight">
                      Danh Sách Tồn Kho Thành Phẩm Sẵn Sàng Bán
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Đã loại trừ 100% các mặt hàng mang trạng thái <em>Chờ xử lý lại</em> theo chuẩn nghiệp vụ US-08.1
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs">
                <span className="text-slate-500 font-medium">Tổng mã Bag khả dụng:</span>
                <strong className="text-emerald-700 font-mono text-sm">{inventoryList.length} Lô</strong>
                <span className="text-slate-300">|</span>
                <span className="text-amber-800 font-medium">Chờ phân bổ:</span>
                <strong className="text-amber-700 font-mono text-sm">{countsByStatus.unallocated} Lô</strong>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">Tổng sản phẩm:</span>
                <strong className="text-emerald-700 font-mono text-sm">
                  {inventoryList.reduce((acc, r) => acc + r.totalQty, 0)} psc
                </strong>
              </div>
            </div>

            {/* Filter Tabs & Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
                
                {/* 4 Tabs Trạng thái tồn chuẩn hóa theo chỉ đạo Chị đẹp */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "all"
                        ? "bg-[#064e3b] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Tất cả ({inventoryList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("unallocated")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "unallocated"
                        ? "bg-amber-600 text-white shadow-xs font-bold"
                        : "text-amber-900 hover:text-amber-950 hover:bg-amber-50"
                    }`}
                  >
                    <span>Chờ phân bổ</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === "unallocated" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"
                    }`}>
                      {countsByStatus.unallocated}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("allocated")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "allocated"
                        ? "bg-teal-700 text-white shadow-xs font-bold"
                        : "text-teal-900 hover:text-teal-950 hover:bg-teal-50"
                    }`}
                  >
                    <span>Đã phân bổ</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === "allocated" ? "bg-white/20 text-white" : "bg-teal-100 text-teal-900"
                    }`}>
                      {countsByStatus.allocated}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("invoice")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "invoice"
                        ? "bg-blue-700 text-white shadow-xs font-bold"
                        : "text-blue-900 hover:text-blue-950 hover:bg-blue-50"
                    }`}
                  >
                    <span>Chờ lập HĐ</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === "invoice" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-900"
                    }`}>
                      {countsByStatus.invoice}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("delivery")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "delivery"
                        ? "bg-purple-700 text-white shadow-xs font-bold"
                        : "text-purple-900 hover:text-purple-950 hover:bg-purple-50"
                    }`}
                  >
                    <span>Chờ giao</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === "delivery" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-900"
                    }`}>
                      {countsByStatus.delivery}
                    </span>
                  </button>
                </div>

                {/* Search & Action Toolbar */}
                <div className="flex items-center space-x-2">
                  {/* Nút Chuyển CXLL hàng loạt khi có chọn Checkbox (AC 3) */}
                  {selectedLotIds.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsBatchTransferModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer animate-in fade-in"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Chuyển CXLL hàng loạt ({selectedLotIds.size} lô)</span>
                    </button>
                  )}

                  {/* Nút Xóa lọc nhanh */}
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

                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm mã Bag, khách hàng, SO, Item..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-64 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all"
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

                  <button
                    type="button"
                    className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="Xuất Excel danh sách tồn kho"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Data Table Bố trí đầy đủ 16 cột chuẩn hóa theo chỉ đạo Chị đẹp */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[1680px]">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px] select-none">
                    <tr>
                      {/* CỘT CHECKBOX CHỌN NHIỀU (AC 3) */}
                      <th className="py-2.5 px-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer"
                          title="Chọn tất cả các lô"
                        />
                      </th>

                      {/* 1. MÃ BAG (LÔ) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ BAG (LÔ)</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "bagCode" ? null : "bagCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("bagCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Mã Bag"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("bagCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "bagCode" && (
                          <ColumnFilterPopover
                            columnKey="bagCode"
                            columnTitle="Mã Bag (Lô)"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.bagCode}
                            filterState={columnFilters.bagCode}
                            onApply={(data) => handleApplyColumnFilter("bagCode", data)}
                            onClear={() => handleClearColumnFilter("bagCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 2. MÃ KHÁCH HÀNG (TÁCH RIÊNG TỪ KHÁCH HÀNG) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ KH</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "customerCode" ? null : "customerCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("customerCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Mã Khách Hàng"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("customerCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "customerCode" && (
                          <ColumnFilterPopover
                            columnKey="customerCode"
                            columnTitle="Mã Khách Hàng"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.customerCode}
                            filterState={columnFilters.customerCode}
                            onApply={(data) => handleApplyColumnFilter("customerCode", data)}
                            onClear={() => handleClearColumnFilter("customerCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 3. TÊN KHÁCH HÀNG (TÁCH RIÊNG TỪ KHÁCH HÀNG) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>TÊN KHÁCH HÀNG</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "customerName" ? null : "customerName");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("customerName")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Tên Khách Hàng"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("customerName") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "customerName" && (
                          <ColumnFilterPopover
                            columnKey="customerName"
                            columnTitle="Tên Khách Hàng"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.customerName}
                            filterState={columnFilters.customerName}
                            onApply={(data) => handleApplyColumnFilter("customerName", data)}
                            onClear={() => handleClearColumnFilter("customerName")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 4. MÃ SO */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ SO</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "soCode" ? null : "soCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("soCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Mã SO"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("soCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "soCode" && (
                          <ColumnFilterPopover
                            columnKey="soCode"
                            columnTitle="Mã SO"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.soCode}
                            filterState={columnFilters.soCode}
                            onApply={(data) => handleApplyColumnFilter("soCode", data)}
                            onClear={() => handleClearColumnFilter("soCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 5. MÃ ITEM (TÁCH TỪ MÃ ITEM & TÊN SP) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ ITEM</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "itemCode" ? null : "itemCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("itemCode")
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

                      {/* 6. CHỦNG LOẠI (TÁCH TỪ MÃ ITEM & TÊN SP) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>CHỦNG LOẠI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "category" ? null : "category");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("category")
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

                      {/* 7. LOẠI / TUỔI */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>LOẠI / TUỔI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "lop" ? null : "lop");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("lop")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Loại / Tuổi"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("lop") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "lop" && (
                          <ColumnFilterPopover
                            columnKey="lop"
                            columnTitle="Loại / Tuổi Vàng"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.lop}
                            filterState={columnFilters.lop}
                            onApply={(data) => handleApplyColumnFilter("lop", data)}
                            onClear={() => handleClearColumnFilter("lop")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 8. TỔNG SL */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TỔNG SL</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "totalQty" ? null : "totalQty");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("totalQty")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Tổng SL"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("totalQty") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "totalQty" && (
                          <ColumnFilterPopover
                            columnKey="totalQty"
                            columnTitle="Tổng Số Lượng"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.totalQty}
                            filterState={columnFilters.totalQty}
                            onApply={(data) => handleApplyColumnFilter("totalQty", data)}
                            onClear={() => handleClearColumnFilter("totalQty")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 9. TRẠNG THÁI TỒN (Chờ phân bổ, Đã phân bổ, Chờ lập HĐ, Chờ giao) */}
                      <th className="relative py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span>TRẠNG THÁI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "status" ? null : "status");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("status")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp cột Trạng Thái"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("status") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "status" && (
                          <ColumnFilterPopover
                            columnKey="status"
                            columnTitle="Trạng Thái Tồn"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.status}
                            filterState={columnFilters.status}
                            onApply={(data) => handleApplyColumnFilter("status", data)}
                            onClear={() => handleClearColumnFilter("status")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 10. TỔNG TL (G) */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TỔNG TL (G)</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "weight" ? null : "weight");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("weight")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp Tổng TL"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("weight") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "weight" && (
                          <ColumnFilterPopover
                            columnKey="weight"
                            columnTitle="Tổng TL (g)"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.weight}
                            filterState={columnFilters.weight}
                            onApply={(data) => handleApplyColumnFilter("weight", data)}
                            onClear={() => handleClearColumnFilter("weight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 11. TL KIM LOẠI (G) - BỔ SUNG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TL KIM LOẠI (G)</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "metalWeight" ? null : "metalWeight");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("metalWeight")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc & sắp xếp TL Kim Loại"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("metalWeight") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "metalWeight" && (
                          <ColumnFilterPopover
                            columnKey="metalWeight"
                            columnTitle="TL Kim Loại (g)"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.metalWeight}
                            filterState={columnFilters.metalWeight}
                            onApply={(data) => handleApplyColumnFilter("metalWeight", data)}
                            onClear={() => handleClearColumnFilter("metalWeight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 12. TL ĐÁ (G) - BỔ SUNG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TL ĐÁ (G)</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "stoneWeight" ? null : "stoneWeight");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("stoneWeight")
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
                            columnTitle="TL Đá (g)"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.stoneWeight}
                            filterState={columnFilters.stoneWeight}
                            onApply={(data) => handleApplyColumnFilter("stoneWeight", data)}
                            onClear={() => handleClearColumnFilter("stoneWeight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 13. NGƯỜI TẠO - BỔ SUNG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>NGƯỜI TẠO</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "createdBy" ? null : "createdBy");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("createdBy")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc theo Người tạo"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("createdBy") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "createdBy" && (
                          <ColumnFilterPopover
                            columnKey="createdBy"
                            columnTitle="Người Tạo"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.createdBy}
                            filterState={columnFilters.createdBy}
                            onApply={(data) => handleApplyColumnFilter("createdBy", data)}
                            onClear={() => handleClearColumnFilter("createdBy")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 14. NGÀY TẠO - BỔ SUNG MỚI THEO CHỈ ĐẠO CHỊ ĐẸP */}
                      <th className="relative py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span>NGÀY TẠO</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "createdAt" ? null : "createdAt");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("createdAt")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc theo Ngày tạo"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("createdAt") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "createdAt" && (
                          <ColumnFilterPopover
                            columnKey="createdAt"
                            columnTitle="Ngày Tạo"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.createdAt}
                            filterState={columnFilters.createdAt}
                            onApply={(data) => handleApplyColumnFilter("createdAt", data)}
                            onClear={() => handleClearColumnFilter("createdAt")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 15. NGÀY NHẬP KHO */}
                      <th className="relative py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span>NGÀY NHẬP KHO</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "dateIn" ? null : "dateIn");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isColumnFiltered("dateIn")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                            }`}
                            title="Lọc theo Ngày nhập kho"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("dateIn") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "dateIn" && (
                          <ColumnFilterPopover
                            columnKey="dateIn"
                            columnTitle="Ngày Nhập Kho"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.dateIn}
                            filterState={columnFilters.dateIn}
                            onApply={(data) => handleApplyColumnFilter("dateIn", data)}
                            onClear={() => handleClearColumnFilter("dateIn")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 16. THAO TÁC (CHUYỂN CHỜ XỬ LÝ LẠI - NÚT ACTIVE KHI LÔ/SERI LÀ CHỜ PHÂN BỔ) */}
                      <th className="py-2.5 px-3 text-center sticky right-0 bg-[#f8fafc] z-10 border-l border-slate-200">
                        <span>THAO TÁC</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((row) => {
                      const isUnallocated = row.status === "Chờ phân bổ";

                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedLotForDrawer(row)}
                          className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                        >
                          {/* CHECKBOX CHỌN DÒNG (AC 3) */}
                          <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedLotIds.has(row.id)}
                              onChange={(e) => handleToggleSelectRow(row.id, e)}
                              className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer"
                            />
                          </td>

                          {/* 1. Mã Bag (Lô) */}
                          <td className="py-3 px-3 font-mono font-bold text-teal-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{row.bagCode}</span>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(row.bagCode, e)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                title="Sao chép mã Bag"
                              >
                                {copiedCode === row.bagCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 2. Mã Khách Hàng (Tách riêng) */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                            {row.customerCode}
                          </td>

                          {/* 3. Tên Khách Hàng (Tách riêng) */}
                          <td className="py-3 px-3 text-slate-900 font-semibold">
                            <div className="truncate max-w-[190px]" title={row.customerName}>
                              {row.customerName}
                            </div>
                          </td>

                          {/* 4. Mã SO */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                            {row.soCode || <span className="text-slate-300 font-normal select-none">—</span>}
                          </td>

                          {/* 5. Mã Item (Tách riêng) */}
                          <td className="py-3 px-3 font-mono text-teal-800 font-bold text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span title={row.itemCode} className="truncate max-w-[180px]">
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

                          {/* 6. Chủng Loại (Tách riêng) */}
                          <td className="py-3 px-3 font-bold text-slate-800 text-xs whitespace-nowrap">
                            {row.category || row.itemName}
                          </td>

                          {/* 7. Loại / Tuổi */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {row.lop}
                            </span>
                          </td>

                          {/* 8. Tổng SL */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {row.totalQty} psc
                          </td>

                          {/* 9. Trạng Thái Tồn */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {renderStatusBadge(row.status)}
                          </td>

                          {/* 10. Tổng TL (g) */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {row.weight.toFixed(4)}
                          </td>

                          {/* 11. TL Kim Loại (g) */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800 whitespace-nowrap">
                            {row.metalWeight ? row.metalWeight.toFixed(4) : "—"}
                          </td>

                          {/* 12. TL Đá (g) */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800 whitespace-nowrap">
                            {row.stoneWeight > 0 ? (
                              row.stoneWeight.toFixed(4)
                            ) : (
                              <span className="text-slate-300 font-normal select-none">—</span>
                            )}
                          </td>

                          {/* 13. Người Tạo */}
                          <td className="py-3 px-3 text-slate-700 whitespace-nowrap text-xs">
                            {row.createdBy || "—"}
                          </td>

                          {/* 14. Ngày Tạo */}
                          <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {row.createdAt || "—"}
                          </td>

                          {/* 15. Ngày Nhập Kho */}
                          <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {row.dateIn || "—"}
                          </td>

                          {/* 16. Thao Tác (Chuyển sang CXLL khi đơn hàng bị hủy trước khi giao) */}
                          <td className="py-3 px-3 text-center sticky right-0 bg-white group-hover:bg-[#f1fcf9] z-10 border-l border-slate-200 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => handleOpenTransferCxllModal(row, e)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer mx-auto"
                              title="Chuyển lô này sang Kho Chờ Xử Lý Lại (CXLL) khi đơn hàng bị hủy trước khi giao"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Chuyển CXLL</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Table Footer */}
                  <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200 text-[11px]">
                    <tr>
                      <td colSpan={8} className="py-2.5 px-3 text-right">
                        Tổng cộng ({filteredData.length} Lô):
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-black whitespace-nowrap">
                        {filteredData.reduce((s, r) => s + r.totalQty, 0)} psc
                      </td>
                      <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 whitespace-nowrap">
                        {filteredData.filter((r) => r.status === "Chờ phân bổ").length} chờ phân bổ / {filteredData.filter((r) => r.status !== "Chờ phân bổ").length} đã gán
                      </td>
                      {/* Tổng TL */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 whitespace-nowrap">
                        {filteredData.reduce((s, r) => s + r.weight, 0).toFixed(4)}
                      </td>
                      {/* Tổng TL Kim loại */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 whitespace-nowrap">
                        {filteredData.reduce((s, r) => s + (r.metalWeight || 0), 0).toFixed(4)}
                      </td>
                      {/* Tổng TL Đá */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 whitespace-nowrap">
                        {filteredData.reduce((s, r) => s + (r.stoneWeight || 0), 0).toFixed(4)}
                      </td>
                      <td colSpan={4}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* 3. MODAL XÁC NHẬN CHUYỂN SANG KHO CHỜ XỬ LÝ LẠI (CXLL) */}
      {lotToTransferCxll && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-900 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Xác Nhận Chuyển Chờ Xử Lý Lại (CXLL)</h3>
                  <p className="text-[11px] text-rose-700 font-normal mt-0.5">
                    Chuyển lô thành phẩm từ Kho Thành Phẩm sang Kho CXLL
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLotToTransferCxll(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Cảnh báo chặn chuyển nếu khác Chờ phân bổ (AC 2) */}
              {lotToTransferCxll.status !== "Chờ phân bổ" ? (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 text-rose-900">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="text-rose-950 block mb-0.5">CHẶN CHUYỂN: Lô đang dính chứng từ giao hàng</strong>
                    Lô <strong>{lotToTransferCxll.bagCode}</strong> hiện đang ở trạng thái <strong>"{lotToTransferCxll.status}"</strong> (đang liên kết với Phiếu giao hàng DO hoặc Invoice). Vui lòng gỡ hoặc hủy chứng từ giao hàng trước khi chuyển sang Kho CXLL!
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    Lô <strong>{lotToTransferCxll.bagCode}</strong> (Đơn hàng: <strong>{lotToTransferCxll.soCode || "SO"}</strong>) thuộc đơn hàng bị hủy trước khi xuất giao. Sau khi chuyển, lô này sẽ được đưa vào <strong>Kho Chờ Xử Lý Lại (CXLL)</strong> với trạng thái <em>Chờ gán đơn mới</em> để Kinh doanh pick chọn làm mới cho đơn hàng mới.
                  </div>
                </div>
              )}

              {/* Ô tùy chọn chuyển SL lẻ (AC 4) */}
              {lotToTransferCxll.status === "Chờ phân bổ" && (
                <div className="space-y-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block">Số lượng chuyển sang CXLL:</label>
                      <span className="text-[10px] text-slate-500">Khách hủy một phần? Cho phép nhập SL lẻ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={lotToTransferCxll.totalQty}
                        value={transferQty}
                        onChange={(e) =>
                          setTransferQty(
                            Math.max(1, Math.min(lotToTransferCxll.totalQty, parseInt(e.target.value) || 1))
                          )
                        }
                        className="w-20 text-center font-bold text-sm font-mono bg-white border border-slate-300 rounded-lg py-1 text-slate-900 focus:ring-1 focus:ring-rose-500"
                      />
                      <span className="text-xs text-slate-500 font-mono">/ {lotToTransferCxll.totalQty} psc</span>
                    </div>
                  </div>

                  {transferQty < lotToTransferCxll.totalQty && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] flex items-center gap-2">
                      <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>
                        Hệ thống sẽ chuyển lẻ <strong>{transferQty} psc</strong> sang Kho CXLL. Còn{" "}
                        <strong>{lotToTransferCxll.totalQty - transferQty} psc</strong> tiếp tục lưu tại Kho TP theo đơn.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Thông số chi tiết lô hàng */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Thông tin đối soát phôi:
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mã Bag (Lô):</span>
                    <strong className="font-mono text-teal-900 text-xs">{lotToTransferCxll.bagCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tổng tồn phôi trong lô:</span>
                    <strong className="text-emerald-700 font-mono text-xs">{lotToTransferCxll.totalQty} psc</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Mã Item (SKU):</span>
                    <div className="font-mono text-slate-800 font-bold text-[11px] truncate" title={lotToTransferCxll.itemCode}>
                      {lotToTransferCxll.itemCode}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Chủng loại:</span>
                    <strong className="text-slate-800">{lotToTransferCxll.category || lotToTransferCxll.itemName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tuổi vàng:</span>
                    <strong className="text-amber-900">{lotToTransferCxll.lop}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tổng trọng lượng:</span>
                    <strong className="font-mono text-slate-900">{lotToTransferCxll.weight.toFixed(4)} g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Vị trí lưu kho:</span>
                    <strong className="text-indigo-800">{lotToTransferCxll.location}</strong>
                  </div>
                </div>
              </div>

              {/* Tóm tắt số lượng seri thuộc lô */}
              {lotToTransferCxll.series?.length > 0 && (
                <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                  <span>Bao gồm <strong>{lotToTransferCxll.series.length} mã seri</strong> thuộc lô này</span>
                  <span className="text-[10px] text-teal-700 font-mono font-bold">Trạng thái: {lotToTransferCxll.status}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setLotToTransferCxll(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              {lotToTransferCxll.status === "Chờ phân bổ" ? (
                <button
                  type="button"
                  onClick={handleConfirmTransferToCxll}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Xác nhận chuyển {transferQty} psc sang CXLL</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-400 text-xs font-semibold cursor-not-allowed opacity-70 flex items-center gap-1.5"
                  title="Chỉ chuyển khi trạng thái là Chờ phân bổ"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Bị chặn chuyển (DO/Invoice dở dang)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3.1. MODAL XÁC NHẬN CHUYỂN CXLL HÀNG LOẠT (AC 3) */}
      {isBatchTransferModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-900 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Xác Nhận Chuyển CXLL Hàng Loạt</h3>
                  <p className="text-[11px] text-rose-700 font-normal mt-0.5">
                    Chuyển {selectedLotIds.size} lô đã chọn sang Kho Chờ Xử Lý Lại
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBatchTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  Bạn đang chuẩn bị chuyển <strong>{selectedLotIds.size} lô phôi</strong> sang Kho CXLL. Hệ thống sẽ tự động kiểm tra chốt chặn: chỉ các lô có trạng thái <strong>Chờ phân bổ</strong> mới được chuyển; các lô đang dính DO hoặc Invoice sẽ tự động bị bỏ qua.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 max-h-56 overflow-y-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Danh sách lô được chọn ({selectedLotIds.size} lô):
                </div>
                <div className="divide-y divide-slate-200/60">
                  {inventoryList
                    .filter((item) => selectedLotIds.has(item.id))
                    .map((item) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between text-[11px]">
                        <div>
                          <strong className="font-mono text-slate-900">{item.bagCode}</strong>
                          <span className="text-slate-500 ml-2">({item.category || item.itemName})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700">{item.totalQty} psc</span>
                          {item.status === "Chờ phân bổ" ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Hợp lệ</span>
                          ) : (
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Chặn (Dính DO)</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBatchTransferModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchTransfer}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Xác nhận chuyển hàng loạt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DRAWER XEM CHI TIẾT LÔ THÀNH PHẨM & DANH SÁCH SERI THUỘC LÔ */}
      {selectedLotForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedLotForDrawer(null)}
          ></div>

          <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  CHI TIẾT LÔ TỒN KHO THÀNH PHẨM
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-mono flex items-center gap-2 mt-0.5">
                  <span>{selectedLotForDrawer.bagCode}</span>
                  {renderStatusBadge(selectedLotForDrawer.status)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLotForDrawer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Box Khách hàng & Mã SO */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-bold uppercase text-slate-500">Thông tin khách hàng & Đơn hàng:</div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Mã khách hàng:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedLotForDrawer.customerCode}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tên khách hàng:</span>
                  <span className="font-bold text-slate-900">{selectedLotForDrawer.customerName}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Mã SO liên kết:</span>
                  <span className="font-mono font-bold text-teal-800">{selectedLotForDrawer.soCode || "—"}</span>
                </div>
              </div>

              {/* Box Chi tiết phôi kim hoàn */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[10px] font-bold uppercase text-slate-500">Thông số kỹ thuật sản phẩm:</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mã Item (SKU):</span>
                  <div className="font-mono text-teal-800 font-bold break-all bg-slate-50 p-1.5 rounded border border-slate-200 mt-0.5 text-[11px]">
                    {selectedLotForDrawer.itemCode}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Chủng loại:</span>
                    <strong className="text-slate-800">{selectedLotForDrawer.category || selectedLotForDrawer.itemName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Loại / Tuổi vàng:</span>
                    <strong className="text-amber-900">{selectedLotForDrawer.lop}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TL Kim loại:</span>
                    <strong className="font-mono text-slate-800">{selectedLotForDrawer.metalWeight?.toFixed(4) || "—"} g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TL Đá:</span>
                    <strong className="font-mono text-slate-800">{selectedLotForDrawer.stoneWeight > 0 ? `${selectedLotForDrawer.stoneWeight.toFixed(4)} g` : "—"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tổng trọng lượng:</span>
                    <strong className="font-mono text-emerald-800 text-sm">{selectedLotForDrawer.weight.toFixed(4)} g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Vị trí két:</span>
                    <strong className="text-indigo-800">{selectedLotForDrawer.location}</strong>
                  </div>
                </div>
              </div>

              {/* Box Người tạo & Ngày nhập */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Người tạo:</span>
                  <strong className="text-slate-700">{selectedLotForDrawer.createdBy || "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ngày tạo:</span>
                  <strong className="font-mono text-slate-700">{selectedLotForDrawer.createdAt || "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ngày nhập kho:</span>
                  <strong className="font-mono text-slate-700">{selectedLotForDrawer.dateIn || "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tổng số lượng:</span>
                  <strong className="font-mono text-emerald-700 text-xs">{selectedLotForDrawer.totalQty} psc</strong>
                </div>
              </div>

              {/* BẢNG SERI CHI TIẾT THUỘC LÔ */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Danh sách Seri thuộc Lô ({selectedLotForDrawer.series?.length || 0} Seri):
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1 SP / 1 Seri</span>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-3">STT</th>
                        <th className="py-1.5 px-3">Mã Seri</th>
                        <th className="py-1.5 px-3 text-right">Trọng Lượng</th>
                        <th className="py-1.5 px-3 text-center">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] font-mono">
                      {selectedLotForDrawer.series?.map((sr, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 text-slate-400 font-sans">{idx + 1}</td>
                          <td className="py-1.5 px-3 font-bold text-teal-900">{sr.seriNo}</td>
                          <td className="py-1.5 px-3 text-right font-bold text-slate-800">{sr.weight.toFixed(4)} g</td>
                          <td className="py-1.5 px-3 text-center">
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-sans bg-amber-100 text-amber-900 border border-amber-200">
                              {sr.status}
                            </span>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={4} className="py-3 text-center text-slate-400 font-sans">
                            Không có danh sách seri con
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Drawer Footer kèm nút Action Chuyển Chờ xử lý lại */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenTransferCxllModal(selectedLotForDrawer)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Chuyển Chờ Xử Lý Lại (CXLL)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLotForDrawer(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3.1. MODAL XÁC NHẬN CHUYỂN CXLL HÀNG LOẠT (AC 3) */}
      {isBatchTransferModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-900 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Xác Nhận Chuyển CXLL Hàng Loạt</h3>
                  <p className="text-[11px] text-rose-700 font-normal mt-0.5">
                    Chuyển {selectedLotIds.size} lô đã chọn sang Kho Chờ Xử Lý Lại
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBatchTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  Bạn đang chuẩn bị chuyển <strong>{selectedLotIds.size} lô phôi</strong> sang Kho CXLL. Hệ thống sẽ tự động kiểm tra chốt chặn: chỉ các lô có trạng thái <strong>Chờ phân bổ</strong> mới được chuyển; các lô đang dính DO hoặc Invoice sẽ tự động bị bỏ qua.
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 max-h-56 overflow-y-auto">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Danh sách lô được chọn ({selectedLotIds.size} lô):
                </div>
                <div className="divide-y divide-slate-200/60">
                  {inventoryList
                    .filter((item) => selectedLotIds.has(item.id))
                    .map((item) => (
                      <div key={item.id} className="py-1.5 flex items-center justify-between text-[11px]">
                        <div>
                          <strong className="font-mono text-slate-900">{item.bagCode}</strong>
                          <span className="text-slate-500 ml-2">({item.category || item.itemName})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700">{item.totalQty} psc</span>
                          {item.status === "Chờ phân bổ" ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Hợp lệ</span>
                          ) : (
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">Chặn (Dính DO)</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBatchTransferModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchTransfer}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Xác nhận chuyển hàng loạt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TOAST THÔNG BÁO HOÀN TẤT */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white border border-emerald-300 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom duration-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-slate-900">{toastMessage.title}</div>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{toastMessage.text}</p>
            {toastMessage.targetUrl && (
              <div className="mt-2">
                <Link
                  href={toastMessage.targetUrl}
                  className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                >
                  <span>Mở Kho Chờ Xử Lý Lại xem lô vừa chuyển</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
