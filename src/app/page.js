"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Filter, 
  Search, 
  Plus, 
  RotateCcw, 
  Eye, 
  FileText,
  Copy, 
  Settings, 
  LayoutGrid,
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  X,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  Printer,
  Trash2,
  Check,
  ChevronDown,
  Warehouse,
  Ban,
  PackageCheck
} from "lucide-react";
import { ORDER_TABS_CONFIG, MOCK_ORDER_LIST } from "@/data/orderListMockData";
import ColumnFilterPopover from "@/components/orders/ColumnFilterPopover";

export default function OrderListPage() {
  const router = useRouter();

  // 1. Dữ liệu danh sách đơn hàng (Quản lý qua state để thao tác action thêm/xóa/đổi trạng thái)
  const [orders, setOrders] = useState(MOCK_ORDER_LIST);

  // 2. Tab trạng thái đang active
  const [activeTab, setActiveTab] = useState("ALL");

  // 3. Ô tìm kiếm toàn cục (Global Search)
  const [searchQuery, setSearchQuery] = useState("");

  // 4. Quản lý bộ lọc trực tiếp trên từng cột (Theo đúng yêu cầu ERP không tách hàng thứ 2)
  const [columnFilters, setColumnFilters] = useState({
    code: { sort: null, selectedValues: null, searchQuery: "" },
    customer: { sort: null, selectedValues: null, searchQuery: "" },
    type: { sort: null, selectedValues: null, searchQuery: "" },
    gold: { sort: null, selectedValues: null, searchQuery: "" },
    date: { sort: null, dateCondition: "between", dateFrom: "", dateTo: "" },
    note: { sort: null, selectedValues: null, searchQuery: "" },
    status: { sort: null, selectedValues: null, searchQuery: "" },
    qty: { sort: null, selectedValues: null, searchQuery: "" },
    total: { sort: null, selectedValues: null, searchQuery: "" },
    discount: { sort: null, selectedValues: null, searchQuery: "" },
    programName: { sort: null, selectedValues: null, searchQuery: "" }
  });

  // Cột nào đang mở Popover lọc
  const [activeFilterColKey, setActiveFilterColKey] = useState(null);

  // 5. TÙY CHỈNH KÍCH THƯỚC CỘT (RESIZABLE COLUMNS)
  const [columnWidths, setColumnWidths] = useState({
    select: 46,
    stt: 48,
    code: 140,
    customer: 260,
    type: 145,
    gold: 95,
    date: 155,
    offerTime: 135,
    note: 130,
    status: 160,
    qty: 90,
    total: 135,
    discount: 95,
    programName: 200,
    actions: 120
  });

  // 6. Quản lý Action Menus mở trên từng dòng
  const [activeActionOrderId, setActiveActionOrderId] = useState(null);
  const [activeSettingsOrderId, setActiveSettingsOrderId] = useState(null);

  // Modal đổi trạng thái đơn hàng nhanh
  const [statusModalOrder, setStatusModalOrder] = useState(null);

  // Toast thông báo tương tác
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // 7. Checkbox chọn dòng & Phân trang
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Đóng action dropdown khi click ra ngoài
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveActionOrderId(null);
      setActiveSettingsOrderId(null);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  // Xử lý kéo thả thay đổi kích thước cột (Column Resizing)
  const handleResizeMouseDown = (colKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = columnWidths[colKey] || 100;

    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      setColumnWidths((prev) => ({
        ...prev,
        [colKey]: Math.max(45, startWidth + delta)
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // TÍNH ĐÚNG SỐ LƯỢNG ĐƠN CHO TỪNG TAB TRẠNG THÁI (ĐỒNG BỘ 100% VỚI DỮ LIỆU)
  const tabCounts = useMemo(() => {
    const counts = { ALL: orders.length };
    ORDER_TABS_CONFIG.forEach((tab) => {
      if (tab.id !== "ALL") {
        counts[tab.id] = orders.filter((o) => {
          if (o.status === tab.status) return true;
          if (tab.aliases && tab.aliases.includes(o.status)) return true;
          return false;
        }).length;
      }
    });
    return counts;
  }, [orders]);

  // Xử lý chuyển tab trạng thái
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    // Khi chọn 1 tab trạng thái cụ thể, reset bộ lọc cột status để tránh xung đột
    if (tabId !== "ALL") {
      setColumnFilters((prev) => ({
        ...prev,
        status: { sort: prev.status?.sort || null, selectedValues: null, searchQuery: "" }
      }));
    }
  };

  // Lấy danh sách các giá trị duy nhất của từng cột để đưa vào bộ lọc
  const uniqueValuesMap = useMemo(() => {
    return {
      code: Array.from(new Set(orders.map((o) => o.code).filter(Boolean))),
      customer: Array.from(new Set(orders.map((o) => o.customer).filter(Boolean))),
      type: ["Đơn hàng Gia công", "Đơn hàng Bán"],
      gold: ["61Y", "41.7W", "68Y", "75W"],
      note: Array.from(new Set(orders.map((o) => o.note).filter(Boolean))),
      status: [
        "Chờ cập nhật",
        "Chờ xử lý",
        "Chờ kỹ thuật",
        "Đủ thông tin kỹ thuật",
        "Chờ duyệt đơn hàng",
        "Đã chuyển KHSX",
        "Đang sản xuất",
        "Đang đóng gói",
        "Chờ giao hàng",
        "Hoàn thành",
        "Đã hủy"
      ],
      discount: ["---", "0%", "2%", "3%", "4%", "5%"],
      programName: Array.from(new Set(orders.map((o) => o.programName).filter(Boolean)))
    };
  }, [orders]);

  // Kiểm tra xem một cột có đang áp dụng lọc/sắp xếp không
  const isColumnFiltered = (colKey) => {
    const filter = columnFilters[colKey];
    if (!filter) return false;
    if (filter.sort) return true;
    if (filter.searchQuery && filter.searchQuery.trim() !== "") return true;
    if (filter.selectedValues !== null && filter.selectedValues !== undefined) return true;
    if (filter.dateFrom || filter.dateTo) return true;
    return false;
  };

  // Kiểm tra tổng thể có bất kỳ bộ lọc nào đang bật không
  const isAnyFilterActive = useMemo(() => {
    if (activeTab !== "ALL") return true;
    if (searchQuery.trim() !== "") return true;
    return Object.keys(columnFilters).some((key) => isColumnFiltered(key));
  }, [activeTab, searchQuery, columnFilters]);

  // Xóa toàn bộ bộ lọc
  const handleResetAllFilters = () => {
    setActiveTab("ALL");
    setSearchQuery("");
    setColumnFilters({
      code: { sort: null, selectedValues: null, searchQuery: "" },
      customer: { sort: null, selectedValues: null, searchQuery: "" },
      type: { sort: null, selectedValues: null, searchQuery: "" },
      gold: { sort: null, selectedValues: null, searchQuery: "" },
      date: { sort: null, dateCondition: "between", dateFrom: "", dateTo: "" },
      note: { sort: null, selectedValues: null, searchQuery: "" },
      status: { sort: null, selectedValues: null, searchQuery: "" },
      qty: { sort: null, selectedValues: null, searchQuery: "" },
      total: { sort: null, selectedValues: null, searchQuery: "" },
      discount: { sort: null, selectedValues: null, searchQuery: "" },
      programName: { sort: null, selectedValues: null, searchQuery: "" }
    });
    setActiveFilterColKey(null);
    setCurrentPage(1);
    showToast("Đã đặt lại toàn bộ bộ lọc về mặc định.");
  };

  // Cập nhật bộ lọc cho một cột
  const handleApplyColumnFilter = (colKey, newFilterData) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: newFilterData
    }));
    setActiveFilterColKey(null);
    setCurrentPage(1);
  };

  // Xóa bộ lọc của 1 cột
  const handleClearColumnFilter = (colKey) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: { sort: null, selectedValues: null, searchQuery: "", dateFrom: "", dateTo: "" }
    }));
    setActiveFilterColKey(null);
    setCurrentPage(1);
  };

  // XỬ LÝ LỌC VÀ SẮP XẾP DỮ LIỆU
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 1. Lọc theo Tab trạng thái
    if (activeTab !== "ALL") {
      const tabConfig = ORDER_TABS_CONFIG.find((t) => t.id === activeTab);
      if (tabConfig?.status) {
        result = result.filter((o) => {
          if (o.status === tabConfig.status) return true;
          if (tabConfig.aliases && tabConfig.aliases.includes(o.status)) return true;
          return false;
        });
      }
    }

    // 2. Lọc theo ô tìm kiếm toàn cục
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o) => 
        (o.code && o.code.toLowerCase().includes(q)) ||
        (o.customer && o.customer.toLowerCase().includes(q)) ||
        (o.customerCode && o.customerCode.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.team && o.team.toLowerCase().includes(q)) ||
        (o.phone && o.phone.toLowerCase().includes(q)) ||
        (o.type && o.type.toLowerCase().includes(q)) ||
        (o.gold && o.gold.toLowerCase().includes(q)) ||
        (o.status && o.status.toLowerCase().includes(q)) ||
        (o.note && o.note.toLowerCase().includes(q)) ||
        (o.programName && o.programName.toLowerCase().includes(q))
      );
    }

    // 3. Lọc theo từng cột (Text query, Checkbox values hoặc Date range)
    Object.entries(columnFilters).forEach(([colKey, filter]) => {
      if (!filter) return;

      // 3.1. Lọc Text Query nếu người dùng gõ tìm kiếm trong popover cột
      if (filter.searchQuery && filter.searchQuery.trim() !== "") {
        const q = filter.searchQuery.toLowerCase().trim();
        result = result.filter((o) => {
          if (colKey === "customer") {
            return (
              (o.customer && o.customer.toLowerCase().includes(q)) ||
              (o.customerCode && o.customerCode.toLowerCase().includes(q)) ||
              (o.customerName && o.customerName.toLowerCase().includes(q)) ||
              (o.phone && o.phone.toLowerCase().includes(q))
            );
          }
          const val = String(o[colKey] ?? "");
          return val.toLowerCase().includes(q);
        });
      }

      // 3.2. Lọc danh sách giá trị checkbox
      if (filter.selectedValues !== null && filter.selectedValues !== undefined) {
        result = result.filter((o) => {
          // Bỏ chọn tất cả -> không trả về dòng nào
          if (filter.selectedValues.size === 0) return false;
          const val = String(o[colKey] ?? "---");
          return filter.selectedValues.has(val);
        });
      }

      // 3.3. Lọc theo ngày tháng (date)
      if (colKey === "date" && (filter.dateFrom || filter.dateTo)) {
        result = result.filter((o) => {
          if (!o.date) return false;
          // Format date của order: "DD/MM/YYYY HH:mm"
          const parts = o.date.split(" ")[0].split("/");
          if (parts.length < 3) return true;
          const orderDateStr = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;

          if (filter.dateCondition === "between") {
            if (filter.dateFrom && orderDateStr < filter.dateFrom) return false;
            if (filter.dateTo && orderDateStr > filter.dateTo) return false;
            return true;
          }
          if (filter.dateCondition === "equals") {
            return filter.dateFrom ? orderDateStr === filter.dateFrom : true;
          }
          if (filter.dateCondition === "before") {
            return filter.dateFrom ? orderDateStr <= filter.dateFrom : true;
          }
          if (filter.dateCondition === "after") {
            return filter.dateFrom ? orderDateStr >= filter.dateFrom : true;
          }
          return true;
        });
      }
    });

    // 4. Sắp xếp (Sort) theo cột đang được chọn
    const activeSortCol = Object.entries(columnFilters).find(([_, f]) => f.sort);
    if (activeSortCol) {
      const [colKey, f] = activeSortCol;
      const isAsc = f.sort === "asc";
      result.sort((a, b) => {
        let valA = a[colKey];
        let valB = b[colKey];

        if (colKey === "date") {
          const parseDateTime = (dStr) => {
            if (!dStr) return 0;
            const [dateP, timeP = "00:00"] = dStr.split(" ");
            const [d, m, y] = dateP.split("/");
            const [hh, mm] = timeP.split(":");
            return new Date(y, m - 1, d, hh, mm).getTime();
          };
          const tA = parseDateTime(valA);
          const tB = parseDateTime(valB);
          return isAsc ? tA - tB : tB - tA;
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return isAsc ? valA - valB : valB - valA;
        }
        valA = String(valA ?? "");
        valB = String(valB ?? "");
        return isAsc ? valA.localeCompare(valB, "vi") : valB.localeCompare(valA, "vi");
      });
    }

    return result;
  }, [orders, activeTab, searchQuery, columnFilters]);

  // Phân trang
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));

  // Toggle chọn dòng
  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedOrders.map((o) => o.id)));
    }
  };

  const handleToggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // CÁC THAO TÁC ACTION (ACTIONS TRÊN TỪNG DÒNG ĐƠN HÀNG)
  // 1. Sao chép mã SO
  const handleCopyOrderCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setActiveActionOrderId(null);
    showToast(`Đã sao chép mã đơn hàng ${code} vào bộ nhớ tạm!`);
  };

  // 2. In đơn hàng
  const handlePrintOrder = (order, e) => {
    e.stopPropagation();
    setActiveActionOrderId(null);
    showToast(`Đang mở giao diện in cho đơn hàng ${order.code}...`);
    setTimeout(() => window.print(), 300);
  };

  // 3. Xóa đơn hàng
  const handleDeleteOrder = (orderId, orderCode, e) => {
    e.stopPropagation();
    setActiveSettingsOrderId(null);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Đã xóa đơn hàng ${orderCode} khỏi danh sách thành công.`);
  };

  // 4. Đổi trạng thái đơn hàng nhanh
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => 
      prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    setStatusModalOrder(null);
    showToast(`Đã chuyển trạng thái đơn hàng sang "${newStatus}"!`);
  };

  // Badge trạng thái chuẩn màu
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Đã chuyển KHSX":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {status}
          </span>
        );
      case "Đủ thông tin kỹ thuật":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            {status}
          </span>
        );
      case "Chờ kỹ thuật":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            {status}
          </span>
        );
      case "Chờ duyệt đơn hàng":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-800 border border-orange-200">
            {status}
          </span>
        );
      case "Chờ cập nhật":
      case "Chờ xử lý":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
            {status}
          </span>
        );
      case "Đang sản xuất":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
            {status}
          </span>
        );
      case "Đang đóng gói":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            {status}
          </span>
        );
      case "Chờ giao hàng":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
            {status}
          </span>
        );
      case "Hoàn thành":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-900 border border-emerald-300">
            {status}
          </span>
        );
      case "Đã hủy":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-[1700px] mx-auto px-4 sm:px-6 text-slate-800">
      
      {/* TOAST THÔNG BÁO TÁC VỤ */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005a46] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. BREADCRUMB */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 pt-2">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          Quản lý đơn hàng
        </Link>
        <span>&gt;</span>
        <span className="text-[#005a46] font-semibold">Danh sách đơn hàng</span>
      </div>

      {/* 2. TIÊU ĐỀ TRANG */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Danh sách đơn hàng
        </h1>
      </div>

      {/* 3. TABS TRẠNG THÁI (HIỂN THỊ ĐÚNG SỐ LƯỢNG ĐƠN CHO TỪNG TAB TRẠNG THÁI) */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-5 min-w-max pb-px" aria-label="Tabs">
          {ORDER_TABS_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = tabCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`whitespace-nowrap pb-2.5 px-0.5 border-b-2 font-medium text-xs transition-colors cursor-pointer flex items-center space-x-1 ${
                  isActive
                    ? "border-[#005a46] text-[#005a46] font-bold"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <span>{tab.name}</span>
                <span className={`text-[11px] ${isActive ? "text-[#005a46] font-bold" : "text-slate-500"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. THANH TÌM KIẾM TOÀN CỤC & CÔNG CỤ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="🔍 Tìm kiếm mã đơn, khách hàng, SĐT..."
              className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46] focus:border-[#005a46]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Nút Xóa toàn bộ bộ lọc nếu đang có filter */}
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="flex items-center px-3 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Đặt lại toàn bộ bộ lọc"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* Khối Thêm Mới & Reload */}
        <div className="flex items-center space-x-2 justify-end">
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="p-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            title="Tải lại danh sách"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <Link
            href="/orders/create"
            className="flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#005a46] hover:bg-[#004737] shadow-2xs transition-colors"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>+ Thêm mới</span>
          </Link>
        </div>
      </div>

      {/* Thông báo kết quả lọc */}
      {isAnyFilterActive && (
        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 py-0.5">
          <span>Đang hiển thị kết quả lọc: <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng.</span>
          {activeTab !== "ALL" && (
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
              Trạng thái: {ORDER_TABS_CONFIG.find((t) => t.id === activeTab)?.name}
            </span>
          )}
        </div>
      )}

      {/* 5. BẢNG DỮ LIỆU ĐƠN HÀNG (LỌC TRỰC TIẾP TRÊN CỘT, RESIZABLE COLUMNS, ACTIONS HOẠT ĐỘNG 100%) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto min-h-[460px]">
          <table className="w-full divide-y divide-slate-200 text-left text-xs table-fixed">
            
            {/* THEAD DUY NHẤT: LỌC TRỰC TIẾP TRÊN CỘT QUA POPOVER (KHÔNG TÁCH HÀNG THỨ 2) */}
            <thead className="bg-slate-50 font-bold text-slate-700 text-[11px] select-none">
              <tr>
                {/* 1. Checkbox chọn tất cả */}
                <th
                  style={{ width: `${columnWidths.select}px`, minWidth: `${columnWidths.select}px` }}
                  className="relative px-2.5 py-3 text-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                  />
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("select", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 2. STT */}
                <th
                  style={{ width: `${columnWidths.stt}px`, minWidth: `${columnWidths.stt}px` }}
                  className="relative px-2 py-3 text-center font-bold text-slate-800"
                >
                  STT
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("stt", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 3. Mã đơn hàng */}
                <th
                  style={{ width: `${columnWidths.code}px`, minWidth: `${columnWidths.code}px` }}
                  className="relative px-2.5 py-3"
                >
                  <div className="flex items-center justify-between space-x-1">
                    <span className="font-bold text-slate-800 truncate">Mã đơn hàng</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "code" ? null : "code");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("code")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc & sắp xếp cột Mã đơn hàng"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("code") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "code" && (
                    <ColumnFilterPopover
                      columnKey="code"
                      columnTitle="Mã đơn hàng"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.code}
                      filterState={columnFilters.code}
                      onApply={(data) => handleApplyColumnFilter("code", data)}
                      onClear={() => handleClearColumnFilter("code")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("code", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 4. Khách hàng */}
                <th
                  style={{ width: `${columnWidths.customer}px`, minWidth: `${columnWidths.customer}px` }}
                  className="relative px-2.5 py-3"
                >
                  <div className="flex items-center justify-between space-x-1">
                    <span className="font-bold text-slate-800 truncate">Khách hàng</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "customer" ? null : "customer");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("customer")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc & sắp xếp cột Khách hàng"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("customer") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "customer" && (
                    <ColumnFilterPopover
                      columnKey="customer"
                      columnTitle="Khách hàng"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.customer}
                      filterState={columnFilters.customer}
                      onApply={(data) => handleApplyColumnFilter("customer", data)}
                      onClear={() => handleClearColumnFilter("customer")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("customer", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 5. Loại đơn hàng */}
                <th
                  style={{ width: `${columnWidths.type}px`, minWidth: `${columnWidths.type}px` }}
                  className="relative px-2.5 py-3 text-center"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="font-bold text-slate-800 truncate">Loại đơn hàng</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "type" ? null : "type");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("type")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc Loại đơn hàng"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("type") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "type" && (
                    <ColumnFilterPopover
                      columnKey="type"
                      columnTitle="Loại đơn hàng"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.type}
                      filterState={columnFilters.type}
                      onApply={(data) => handleApplyColumnFilter("type", data)}
                      onClear={() => handleClearColumnFilter("type")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("type", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 6. Tuổi vàng */}
                <th
                  style={{ width: `${columnWidths.gold}px`, minWidth: `${columnWidths.gold}px` }}
                  className="relative px-2 py-3 text-center"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="font-bold text-slate-800 truncate">Tuổi vàng</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "gold" ? null : "gold");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("gold")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc Tuổi vàng"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("gold") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "gold" && (
                    <ColumnFilterPopover
                      columnKey="gold"
                      columnTitle="Tuổi vàng"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.gold}
                      filterState={columnFilters.gold}
                      onApply={(data) => handleApplyColumnFilter("gold", data)}
                      onClear={() => handleClearColumnFilter("gold")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("gold", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 7. Ngày đặt hàng */}
                <th
                  style={{ width: `${columnWidths.date}px`, minWidth: `${columnWidths.date}px` }}
                  className="relative px-2.5 py-3 text-center"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="font-bold text-slate-800 truncate">Ngày đặt hàng</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "date" ? null : "date");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("date")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc & sắp xếp Ngày đặt hàng"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("date") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "date" && (
                    <ColumnFilterPopover
                      columnKey="date"
                      columnTitle="Ngày đặt hàng"
                      columnType="date"
                      uniqueValues={[]}
                      filterState={columnFilters.date}
                      onApply={(data) => handleApplyColumnFilter("date", data)}
                      onClear={() => handleClearColumnFilter("date")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("date", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 8. Thời gian chào hàng */}
                <th
                  style={{ width: `${columnWidths.offerTime}px`, minWidth: `${columnWidths.offerTime}px` }}
                  className="relative px-2 py-3 text-center text-slate-800"
                >
                  <span className="truncate">Thời gian chào hàng</span>
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("offerTime", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 9. Ghi chú */}
                <th
                  style={{ width: `${columnWidths.note}px`, minWidth: `${columnWidths.note}px` }}
                  className="relative px-2.5 py-3 text-center text-slate-800"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="truncate">Ghi chú</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "note" ? null : "note");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("note")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc Ghi chú"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("note") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "note" && (
                    <ColumnFilterPopover
                      columnKey="note"
                      columnTitle="Ghi chú"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.note}
                      filterState={columnFilters.note}
                      onApply={(data) => handleApplyColumnFilter("note", data)}
                      onClear={() => handleClearColumnFilter("note")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("note", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 10. Trạng thái */}
                <th
                  style={{ width: `${columnWidths.status}px`, minWidth: `${columnWidths.status}px` }}
                  className="relative px-2.5 py-3 text-center text-slate-800"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="font-bold truncate">Trạng thái</span>
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
                      title="Lọc Trạng thái"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("status") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "status" && (
                    <ColumnFilterPopover
                      columnKey="status"
                      columnTitle="Trạng thái"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.status}
                      filterState={columnFilters.status}
                      onApply={(data) => handleApplyColumnFilter("status", data)}
                      onClear={() => handleClearColumnFilter("status")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("status", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 11. Số lượng */}
                <th
                  style={{ width: `${columnWidths.qty}px`, minWidth: `${columnWidths.qty}px` }}
                  className="relative px-2.5 py-3 text-right font-bold text-slate-800"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="truncate">Số lượng</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "qty" ? null : "qty");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("qty")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Sắp xếp cột Số lượng"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("qty") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "qty" && (
                    <ColumnFilterPopover
                      columnKey="qty"
                      columnTitle="Số lượng"
                      columnType="sort-only"
                      uniqueValues={[]}
                      filterState={columnFilters.qty}
                      onApply={(data) => handleApplyColumnFilter("qty", data)}
                      onClear={() => handleClearColumnFilter("qty")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("qty", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 12. Tổng tiền */}
                <th
                  style={{ width: `${columnWidths.total}px`, minWidth: `${columnWidths.total}px` }}
                  className="relative px-3 py-3 text-right font-bold text-slate-800"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="truncate">Tổng tiền</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "total" ? null : "total");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("total")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Sắp xếp cột Tổng tiền"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("total") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "total" && (
                    <ColumnFilterPopover
                      columnKey="total"
                      columnTitle="Tổng tiền"
                      columnType="sort-only"
                      uniqueValues={[]}
                      filterState={columnFilters.total}
                      onApply={(data) => handleApplyColumnFilter("total", data)}
                      onClear={() => handleClearColumnFilter("total")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("total", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 13. Chiết khấu */}
                <th
                  style={{ width: `${columnWidths.discount}px`, minWidth: `${columnWidths.discount}px` }}
                  className="relative px-2 py-3 text-center text-slate-800"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="truncate">Chiết khấu</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "discount" ? null : "discount");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("discount")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc cột Chiết khấu"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("discount") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "discount" && (
                    <ColumnFilterPopover
                      columnKey="discount"
                      columnTitle="Chiết khấu"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.discount}
                      filterState={columnFilters.discount}
                      onApply={(data) => handleApplyColumnFilter("discount", data)}
                      onClear={() => handleClearColumnFilter("discount")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("discount", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 14. Tên & loại chương trình */}
                <th
                  style={{ width: `${columnWidths.programName}px`, minWidth: `${columnWidths.programName}px` }}
                  className="relative px-3 py-3 text-left text-slate-800"
                >
                  <div className="flex items-center justify-between space-x-1">
                    <span className="truncate">Tên & loại chương trình</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColKey(activeFilterColKey === "programName" ? null : "programName");
                      }}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isColumnFiltered("programName")
                          ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Lọc Tên chương trình"
                    >
                      <Filter className={`h-3 w-3 ${isColumnFiltered("programName") ? "fill-[#005a46]" : ""}`} />
                    </button>
                  </div>
                  {activeFilterColKey === "programName" && (
                    <ColumnFilterPopover
                      columnKey="programName"
                      columnTitle="Tên & loại chương trình"
                      columnType="select"
                      uniqueValues={uniqueValuesMap.programName}
                      filterState={columnFilters.programName}
                      onApply={(data) => handleApplyColumnFilter("programName", data)}
                      onClear={() => handleClearColumnFilter("programName")}
                      onClose={() => setActiveFilterColKey(null)}
                    />
                  )}
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("programName", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>

                {/* 15. Actions */}
                <th
                  style={{ width: `${columnWidths.actions}px`, minWidth: `${columnWidths.actions}px` }}
                  className="relative px-2.5 py-3 text-center text-slate-800"
                >
                  Actions
                  <div
                    onMouseDown={(e) => handleResizeMouseDown("actions", e)}
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#005a46] z-10"
                  />
                </th>
              </tr>
            </thead>

            {/* TBODY: DỮ LIỆU ĐƠN HÀNG VÀ TÁC VỤ ACTIONS HOẠT ĐỘNG HOÀN TOÀN */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, idx) => {
                  const isChecked = selectedIds.has(order.id);
                  const displayIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  const isProcessing = order.type === "Đơn hàng Gia công";

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isChecked ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      {/* 1. Checkbox chọn dòng */}
                      <td style={{ width: `${columnWidths.select}px` }} className="px-2.5 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(order.id)}
                          className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* 2. STT */}
                      <td style={{ width: `${columnWidths.stt}px` }} className="px-2 py-3 text-center font-mono font-medium text-slate-500">
                        {displayIndex}
                      </td>

                      {/* 3. Mã đơn hàng (Link click xem chi tiết) */}
                      <td style={{ width: `${columnWidths.code}px` }} className="px-2.5 py-3 whitespace-nowrap">
                        <Link
                          href={`/orders/${order.id === 11 ? "11" : order.id}`}
                          className="font-mono font-bold text-[#007a5e] hover:text-[#004737] hover:underline"
                          title="Bấm để xem chi tiết đơn hàng"
                        >
                          {order.code}
                        </Link>
                      </td>

                      {/* 4. Khách hàng */}
                      <td style={{ width: `${columnWidths.customer}px` }} className="px-2.5 py-3 text-slate-800 truncate" title={order.customer}>
                        <span className="font-mono font-bold text-slate-700">{order.customerCode}</span>
                        <span className="text-slate-400 mx-1">-</span>
                        <span className="font-medium text-slate-900">{order.customerName || order.customer}</span>
                      </td>

                      {/* 5. Loại đơn hàng */}
                      <td style={{ width: `${columnWidths.type}px` }} className="px-2.5 py-3 text-center whitespace-nowrap">
                        {isProcessing ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Đơn hàng Gia công
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Đơn hàng Bán
                          </span>
                        )}
                      </td>

                      {/* 6. Tuổi vàng */}
                      <td style={{ width: `${columnWidths.gold}px` }} className="px-2 py-3 text-center font-mono font-bold text-slate-700">
                        {order.gold}
                      </td>

                      {/* 7. Ngày đặt hàng */}
                      <td style={{ width: `${columnWidths.date}px` }} className="px-2.5 py-3 text-center font-mono text-slate-600 whitespace-nowrap">
                        {order.date}
                      </td>

                      {/* 8. Thời gian chào hàng */}
                      <td style={{ width: `${columnWidths.offerTime}px` }} className="px-2 py-3 text-center text-slate-400 font-mono">
                        {order.offerTime || "---"}
                      </td>

                      {/* 9. Ghi chú */}
                      <td style={{ width: `${columnWidths.note}px` }} className="px-2.5 py-3 text-center text-slate-400 truncate font-mono" title={order.note}>
                        {order.note || "---"}
                      </td>

                      {/* 10. Trạng thái */}
                      <td style={{ width: `${columnWidths.status}px` }} className="px-2.5 py-3 text-center whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>

                      {/* 11. Số lượng */}
                      <td style={{ width: `${columnWidths.qty}px` }} className="px-2.5 py-3 text-right font-mono font-bold text-slate-900">
                        {order.qty}
                      </td>

                      {/* 12. Tổng tiền */}
                      <td style={{ width: `${columnWidths.total}px` }} className="px-3 py-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {typeof order.total === "number" ? order.total.toLocaleString("en-US") : order.total}
                      </td>

                      {/* 13. Chiết khấu */}
                      <td style={{ width: `${columnWidths.discount}px` }} className="px-2 py-3 text-center font-mono text-slate-700 font-semibold">
                        {order.discount || "---"}
                      </td>

                      {/* 14. Tên & loại chương trình */}
                      <td style={{ width: `${columnWidths.programName}px` }} className="px-3 py-3 text-left text-slate-600 truncate text-[11px]" title={order.programName}>
                        {order.programName || "---"}
                      </td>

                      {/* 15. Actions: HOẠT ĐỘNG HOÀN TOÀN CẢ 3 NÚT (FileText, LayoutGrid, Settings) */}
                      <td style={{ width: `${columnWidths.actions}px` }} className="px-2.5 py-3 text-center whitespace-nowrap relative">
                        <div className="flex items-center justify-center space-x-1.5 text-slate-400">
                          
                          {/* Nút 1: Xem chi tiết đơn hàng (Icon sổ đỏ/cam) */}
                          <Link
                            href={`/orders/${order.id === 11 ? "11" : order.id}`}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                            title="Xem chi tiết đơn hàng"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </Link>

                          {/* Nút 2: Tác vụ nhanh (Menu lưới LayoutGrid) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionOrderId(activeActionOrderId === order.id ? null : order.id);
                                setActiveSettingsOrderId(null);
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                activeActionOrderId === order.id
                                  ? "bg-[#005a46] text-white"
                                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                              }`}
                              title="Tác vụ đơn hàng"
                            >
                              <LayoutGrid className="h-3.5 w-3.5" />
                            </button>

                            {/* Dropdown Menu Tác Vụ */}
                            {activeActionOrderId === order.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-700 py-1.5 w-56 text-left text-xs animate-in fade-in zoom-in-95 duration-100"
                              >
                                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                  Tác vụ đơn: {order.code}
                                </div>

                                <Link
                                  href={`/orders/${order.id === 11 ? "11" : order.id}`}
                                  className="flex items-center px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#005a46] transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                  <span>Xem chi tiết đơn hàng</span>
                                </Link>

                                <Link
                                  href={`/orders/${order.id === 11 ? "11" : order.id}`}
                                  className="flex items-center px-3 py-2 hover:bg-emerald-50 text-emerald-800 font-semibold transition-colors"
                                >
                                  <Warehouse className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                                  <span>Chọn Item Kho TP / Đồng bộ</span>
                                </Link>

                                <button
                                  type="button"
                                  onClick={(e) => handleCopyOrderCode(order.code, e)}
                                  className="w-full flex items-center px-3 py-2 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                  <span>Sao chép mã đơn hàng</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => handlePrintOrder(order, e)}
                                  className="w-full flex items-center px-3 py-2 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                                >
                                  <Printer className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                  <span>In phiếu đơn hàng</span>
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <Link
                                  href={`/delivery-orders/create`}
                                  className="flex items-center px-3 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                                >
                                  <PackageCheck className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                  <span>Tạo phiếu giao hàng (DO)</span>
                                </Link>

                                <Link
                                  href={`/cancel-requests/create`}
                                  className="flex items-center px-3 py-2 hover:bg-rose-50 text-rose-600 transition-colors"
                                >
                                  <Ban className="h-3.5 w-3.5 mr-2 text-rose-500" />
                                  <span>Yêu cầu hủy SO</span>
                                </Link>
                              </div>
                            )}
                          </div>

                          {/* Nút 3: Cấu hình & Quản lý đơn (Icon bánh răng Settings) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSettingsOrderId(activeSettingsOrderId === order.id ? null : order.id);
                                setActiveActionOrderId(null);
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                activeSettingsOrderId === order.id
                                  ? "bg-slate-800 text-white"
                                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                              }`}
                              title="Cấu hình & quản lý"
                            >
                              <Settings className="h-3.5 w-3.5" />
                            </button>

                            {/* Dropdown Menu Cấu hình / Settings */}
                            {activeSettingsOrderId === order.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-700 py-1.5 w-52 text-left text-xs animate-in fade-in zoom-in-95 duration-100"
                              >
                                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                  Quản lý: {order.code}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveSettingsOrderId(null);
                                    setStatusModalOrder(order);
                                  }}
                                  className="w-full flex items-center px-3 py-2 hover:bg-emerald-50 text-[#005a46] font-semibold transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="h-3.5 w-3.5 mr-2 text-[#005a46]" />
                                  <span>Đổi nhanh trạng thái</span>
                                </button>

                                <Link
                                  href={`/orders/${order.id === 11 ? "11" : order.id}`}
                                  className="flex items-center px-3 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                                >
                                  <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                  <span>Chỉnh sửa thông tin đơn</span>
                                </Link>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteOrder(order.id, order.code, e)}
                                  className="w-full flex items-center px-3 py-2 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2 text-rose-500" />
                                  <span>Xóa đơn hàng</span>
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Trạng thái Không tìm thấy kết quả */
                <tr>
                  <td colSpan={15} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Filter className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">
                        Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="px-3 py-1.5 bg-emerald-50 text-[#005a46] border border-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. PHÂN TRANG (PAGINATION) CHUẨN ERP */}
        <div className="px-4 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Hiển thị <strong>{filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</strong> trong tổng số <strong>{filteredOrders.length}</strong> đơn hàng
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang đầu"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
              if (pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                return (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`min-w-7 h-7 px-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      currentPage === pg
                        ? "bg-[#005a46] text-white"
                        : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {pg}
                  </button>
                );
              }
              if (pg === currentPage - 2 || pg === currentPage + 2) {
                return <span key={pg} className="px-1 text-slate-400">...</span>;
              }
              return null;
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang cuối"
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>

            <span className="text-slate-400 mx-1">|</span>
            <span className="text-slate-500 font-medium">20 / trang</span>
          </div>
        </div>
      </div>

      {/* 7. MODAL ĐỔI NHANH TRẠNG THÁI ĐƠN HÀNG (HỖ TRỢ ACTION SETTINGS) */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Đổi trạng thái đơn hàng: <span className="text-[#005a46] font-mono">{statusModalOrder.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Chọn trạng thái mới để cập nhật cho đơn hàng. Số lượng trên các tab trạng thái sẽ tự động cập nhật ngay lập tức:
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {[
                "Chờ cập nhật",
                "Chờ xử lý",
                "Chờ kỹ thuật",
                "Đủ thông tin kỹ thuật",
                "Chờ duyệt đơn hàng",
                "Đã chuyển KHSX",
                "Đang sản xuất",
                "Đang đóng gói",
                "Chờ giao hàng",
                "Hoàn thành",
                "Đã hủy"
              ].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleUpdateOrderStatus(statusModalOrder.id, st)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    statusModalOrder.status === st
                      ? "bg-emerald-50 text-[#005a46] border border-emerald-300"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span>{st}</span>
                  {statusModalOrder.status === st && <Check className="h-4 w-4 text-[#005a46]" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
