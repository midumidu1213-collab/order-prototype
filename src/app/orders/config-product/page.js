"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Check, 
  ChevronRight, 
  CheckSquare, 
  Square, 
  LayoutGrid,
  ShoppingBag,
  X,
  ArrowLeft,
  Eye,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";
import { PRODUCT_CATALOGUE_CONFIG_LIST } from "@/data/productVersionConfigData";

export default function ConfigProductPage() {
  const [products, setProducts] = useState(PRODUCT_CATALOGUE_CONFIG_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'base' | 'routing'
  
  // Bộ lọc mở rộng (Filter Panel)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterProductType, setFilterProductType] = useState("all");
  const [filterChangeType, setFilterChangeType] = useState("all");
  const [filterECStatus, setFilterECStatus] = useState("all"); // 'all' | 'published' | 'unpublished'
  const [filterStatus, setFilterStatus] = useState("all");

  // Sắp xếp (Sort)
  const [sortConfig, setSortConfig] = useState({ key: "stt", direction: "asc" });

  const [selectedIds, setSelectedIds] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("SEVAGO_PUBLISHED_PRODUCT_IDS");
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    }
    // Mặc định chọn các item đang được cấu hình hiển thị trên EC
    return new Set(
      PRODUCT_CATALOGUE_CONFIG_LIST.filter(p => p.isPublishedToEC).map(p => p.id)
    );
  });
  const [toastMessage, setToastMessage] = useState("");

  // Modal 4view 4 góc nhìn chuẩn Video frame 04
  const [view4ModalItem, setView4ModalItem] = useState(null);

  // Modal Chi tiết sản phẩm chuẩn Video frame 12
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Hàm sắp xếp cột
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-gray-300 group-hover:text-gray-500 shrink-0" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-3 w-3 text-emerald-700 shrink-0" />
    ) : (
      <ArrowDown className="h-3 w-3 text-emerald-700 shrink-0" />
    );
  };

  // Danh sách các options cho bộ lọc
  const productTypeOptions = useMemo(() => {
    const set = new Set(products.map(p => p.productType).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const changeTypeOptions = useMemo(() => {
    const set = new Set(products.map(p => p.changeType).filter(t => t && t !== "---"));
    return Array.from(set);
  }, [products]);

  const statusOptions = useMemo(() => {
    const set = new Set(products.map(p => p.status).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterProductType !== "all") count++;
    if (filterChangeType !== "all") count++;
    if (filterECStatus !== "all") count++;
    if (filterStatus !== "all") count++;
    return count;
  }, [filterProductType, filterChangeType, filterECStatus, filterStatus]);

  const handleResetFilters = () => {
    setFilterProductType("all");
    setFilterChangeType("all");
    setFilterECStatus("all");
    setFilterStatus("all");
    setSearchQuery("");
  };

  // Xử lý tìm kiếm, lọc và sắp xếp đa trường
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Lọc theo tab
    if (activeTab === "base") {
      result = result.filter(item => item.isBase !== false && !item.affectsRouting);
    } else if (activeTab === "routing") {
      result = result.filter(item => item.affectsRouting === true || item.isBase === false);
    }

    // 2. Lọc theo Filter Options
    if (filterProductType !== "all") {
      result = result.filter(item => item.productType === filterProductType);
    }
    if (filterChangeType !== "all") {
      result = result.filter(item => item.changeType === filterChangeType);
    }
    if (filterECStatus === "published") {
      result = result.filter(item => selectedIds.has(item.id));
    } else if (filterECStatus === "unpublished") {
      result = result.filter(item => !selectedIds.has(item.id));
    }
    if (filterStatus !== "all") {
      result = result.filter(item => item.status === filterStatus);
    }

    // 3. Tìm kiếm Live Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const matchItemCode = item.itemCode?.toLowerCase().includes(q);
        const matchOldCode = item.oldItemCode?.toLowerCase().includes(q);
        const matchDrawing = item.drawingCode?.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        const matchType = item.productType?.toLowerCase().includes(q);
        const matchCreator = item.creator?.toLowerCase().includes(q);
        const matchStatus = item.status?.toLowerCase().includes(q);
        const matchChangeType = item.changeType?.toLowerCase().includes(q);
        const matchChangeDetail = item.changeDetail?.toLowerCase().includes(q);
        const matchVersion = item.versionLabel?.toLowerCase().includes(q) || item.changeTypeName?.toLowerCase().includes(q);
        return matchItemCode || matchOldCode || matchDrawing || matchNotes || matchType || matchCreator || matchStatus || matchChangeType || matchChangeDetail || matchVersion;
      });
    }

    // 4. Sắp xếp (Sort)
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let valA = a[sortConfig.key] ?? "";
        let valB = b[sortConfig.key] ?? "";

        if (sortConfig.key === "stt") {
          return sortConfig.direction === "asc" ? a.stt - b.stt : b.stt - a.stt;
        }
        if (sortConfig.key === "goldWeight") {
          const numA = parseFloat(a.goldWeight) || 0;
          const numB = parseFloat(b.goldWeight) || 0;
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }

        const comp = String(valA).localeCompare(String(valB), "vi", { numeric: true });
        return sortConfig.direction === "asc" ? comp : -comp;
      });
    }

    return result;
  }, [products, searchQuery, activeTab, filterProductType, filterChangeType, filterECStatus, filterStatus, selectedIds, sortConfig]);

  // Xử lý chọn / bỏ chọn từng dòng
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Xử lý chọn / bỏ chọn tất cả các dòng đang hiển thị
  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.has(p.id));

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        filteredProducts.forEach((p) => next.delete(p.id));
      } else {
        filteredProducts.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  // Nút Cập nhật (Publishing Gate)
  const handleUpdate = () => {
    setProducts((prev) =>
      prev.map((item) => ({
        ...item,
        isPublishedToEC: selectedIds.has(item.id)
      }))
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("SEVAGO_PUBLISHED_PRODUCT_IDS", JSON.stringify(Array.from(selectedIds)));
      window.dispatchEvent(new Event("storage"));
    }
    const count = selectedIds.size;
    setToastMessage(`Đã cập nhật danh sách hiển thị trên E-Catalogue thành công (${count} sản phẩm/phiên bản).`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Breadcrumb chuẩn khớp Video thực tế */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <span>Cấu hình sản phẩm</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-700 font-semibold">Danh sách sản phẩm</span>
      </div>

      {/* 2. Toast thông báo khi cập nhật */}
      {toastMessage && (
        <div className="p-3 bg-emerald-700 text-white rounded-lg shadow-sm flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 bg-emerald-500 rounded-full p-0.5 text-white" />
            <span>{toastMessage}</span>
          </div>
          <Link
            href="/catalogue/product/set-1"
            target="_blank"
            className="underline hover:text-emerald-200 font-bold ml-4"
          >
            Xem trên E-Catalogue ↗
          </Link>
        </div>
      )}

      {/* 3. Card chính: Tiêu đề, Thanh Search & Bảng khớp chuẩn Video thực tế */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Tiêu đề trang */}
        <div className="px-5 pt-4 pb-2">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Cấu hình sản phẩm
          </h1>
        </div>

        {/* Tab lọc nhanh: Tất cả / Bản vẽ chuẩn / Version từ Routing */}
        <div className="px-5 pt-1 flex items-center space-x-2 border-b border-gray-100 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "all"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>Tất cả</span>
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("base")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "base"
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>Bản vẽ chuẩn A00 (Gốc)</span>
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">
              {products.filter(p => !p.affectsRouting).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("routing")}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "routing"
                ? "border-purple-700 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>Phiên bản</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full">
              {products.filter(p => p.affectsRouting).length}
            </span>
          </button>
        </div>

        {/* Thanh công cụ: Search bên trái, Cập nhật + Lọc bên phải */}
        <div className="px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo Mã item / Mã Drawing / Loại SP / Loại thay đổi..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50/60 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-400 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={selectedIds.size === 0}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-2xs ${
                selectedIds.size > 0
                  ? "bg-[#005a46] hover:bg-[#004737] text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Cập nhật</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 border rounded-lg transition-all cursor-pointer relative flex items-center gap-1.5 text-xs font-medium ${
                isFilterOpen || activeFilterCount > 0
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              title="Bộ lọc dữ liệu"
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Link
              href="/catalogue"
              target="_blank"
              className="p-2 border border-emerald-600 bg-emerald-50 rounded-lg text-emerald-800 hover:bg-emerald-100 cursor-pointer flex items-center gap-1 text-xs font-medium"
              title="Mở E-Catalogue"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">E-Catalogue</span>
            </Link>
          </div>
        </div>

        {/* Khối Bộ Lọc Mở Rộng (Filter Panel) */}
        {isFilterOpen && (
          <div className="px-5 py-3 bg-gray-50/90 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            {/* Filter Loại sản phẩm */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Loại sản phẩm
              </label>
              <select
                value={filterProductType}
                onChange={(e) => setFilterProductType(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              >
                <option value="all">Tất cả loại sản phẩm</option>
                {productTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Loại thay đổi */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Loại thay đổi (Routing)
              </label>
              <select
                value={filterChangeType}
                onChange={(e) => setFilterChangeType(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              >
                <option value="all">Tất cả loại thay đổi</option>
                {changeTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Trạng thái E-Catalogue */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Hiển thị trên E-Catalogue
              </label>
              <select
                value={filterECStatus}
                onChange={(e) => setFilterECStatus(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã kích hoạt trên E-C</option>
                <option value="unpublished">Chưa kích hoạt</option>
              </select>
            </div>

            {/* Filter Trạng thái tác nghiệp */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Trạng thái phê duyệt
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-white border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 border border-gray-300 hover:bg-gray-100 rounded-md text-gray-600 hover:text-gray-900 flex items-center gap-1 shrink-0 font-medium cursor-pointer"
                  title="Đặt lại bộ lọc"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Xóa lọc</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dải Chips thể hiện các Filter đang áp dụng */}
        {activeFilterCount > 0 && (
          <div className="px-5 py-2 bg-emerald-50/50 border-b border-emerald-100 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-semibold text-emerald-900">Đang lọc theo:</span>
            {filterProductType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                Loại: {filterProductType}
                <button type="button" onClick={() => setFilterProductType("all")} className="hover:text-emerald-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterChangeType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-medium">
                Thay đổi: {filterChangeType}
                <button type="button" onClick={() => setFilterChangeType("all")} className="hover:text-purple-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterECStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-medium">
                E-C: {filterECStatus === "published" ? "Đã bật" : "Chưa bật"}
                <button type="button" onClick={() => setFilterECStatus("all")} className="hover:text-blue-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-medium">
                Trạng thái: {filterStatus}
                <button type="button" onClick={() => setFilterStatus("all")} className="hover:text-amber-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-emerald-700 underline font-semibold hover:text-emerald-900 ml-1 cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Bảng Danh Sách Sản Phẩm - ĐÚNG THỨ TỰ CỘT 1 -> 7 THEO YÊU CẦU CỦA CHỊ ĐẸP */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-700 uppercase tracking-wider select-none">
              <tr>
                {/* Checkbox chọn */}
                <th className="w-10 px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-gray-500 hover:text-emerald-700 cursor-pointer"
                    title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </th>

                {/* STT */}
                <th 
                  onClick={() => handleSort("stt")}
                  className="w-12 px-2 py-3 text-center cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo STT"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>STT</span>
                    {renderSortIcon("stt")}
                  </div>
                </th>

                {/* CỘT 1: LOẠI SẢN PHẨM (theo đánh dấu số 1 trong ảnh của Chị đẹp) */}
                <th 
                  onClick={() => handleSort("productType")}
                  className="px-3 py-3 min-w-[120px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Loại sản phẩm"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Loại sản phẩm</span>
                    {renderSortIcon("productType")}
                  </div>
                </th>

                {/* CỘT 2: HÌNH RENDER (theo đánh dấu số 2 trong ảnh của Chị đẹp) */}
                <th className="w-20 px-2 py-3 text-center">
                  Hình render
                </th>

                {/* CỘT 3: HÌNH 4VIEW (theo đánh dấu số 3 trong ảnh của Chị đẹp) */}
                <th className="w-20 px-2 py-3 text-center">
                  Hình 4view
                </th>

                {/* CỘT 4: MÃ ITEM (theo đánh dấu số 4 trong ảnh của Chị đẹp) */}
                <th 
                  onClick={() => handleSort("itemCode")}
                  className="px-3 py-3 min-w-[220px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Mã item"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Mã item</span>
                    {renderSortIcon("itemCode")}
                  </div>
                </th>

                {/* CỘT 5: MÃ DRAWING (theo đánh dấu số 5 trong ảnh của Chị đẹp) */}
                <th 
                  onClick={() => handleSort("drawingCode")}
                  className="px-3 py-3 min-w-[140px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Mã drawing"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Mã drawing</span>
                    {renderSortIcon("drawingCode")}
                  </div>
                </th>

                {/* CỘT 6: LOẠI THAY ĐỔI (theo đánh dấu số 6 trong ảnh của Chị đẹp - ví dụ: Khóa) */}
                <th 
                  onClick={() => handleSort("changeType")}
                  className="px-3 py-3 min-w-[130px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Loại thay đổi"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Loại thay đổi</span>
                    {renderSortIcon("changeType")}
                  </div>
                </th>

                {/* CỘT 7: CHI TIẾT THAY ĐỔI (theo đánh dấu số 7 trong ảnh của Chị đẹp - ví dụ: Khóa càng cua) */}
                <th 
                  onClick={() => handleSort("changeDetail")}
                  className="px-3 py-3 min-w-[160px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Chi tiết thay đổi"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Chi tiết thay đổi</span>
                    {renderSortIcon("changeDetail")}
                  </div>
                </th>

                {/* TRỌNG LƯỢNG VÀNG */}
                <th 
                  onClick={() => handleSort("goldWeight")}
                  className="px-3 py-3 text-right min-w-[110px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Trọng lượng vàng"
                >
                  <div className="inline-flex items-center justify-end gap-1 w-full">
                    <span>Trọng lượng vàng</span>
                    {renderSortIcon("goldWeight")}
                  </div>
                </th>

                {/* CÁC CỘT TIẾP THEO */}
                <th className="px-3 py-3 min-w-[130px]">Loại phụ liệu chính</th>
                <th className="px-3 py-3 min-w-[120px]">Loại phụ liệu phụ</th>
                <th className="px-3 py-3 min-w-[120px]">Màu phụ liệu chính</th>
                <th className="px-3 py-3 min-w-[120px]">Màu phụ liệu phụ</th>
                <th className="px-2 py-3 text-center min-w-[80px]">Cấp đá</th>
                <th className="px-3 py-3 text-center min-w-[110px]">E-Catalogue</th>
                
                {/* NGÀY TẠO */}
                <th 
                  onClick={() => handleSort("createdDate")}
                  className="px-3 py-3 min-w-[110px] cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Ngày tạo"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Ngày tạo</span>
                    {renderSortIcon("createdDate")}
                  </div>
                </th>

                <th className="px-3 py-3 min-w-[140px]">Người tạo</th>

                {/* TRẠNG THÁI */}
                <th 
                  onClick={() => handleSort("status")}
                  className="px-3 py-3 min-w-[130px] text-center cursor-pointer hover:bg-gray-100 group"
                  title="Nhấp để sắp xếp theo Trạng thái"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>Trạng thái</span>
                    {renderSortIcon("status")}
                  </div>
                </th>

                <th className="w-16 px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={19} className="py-12 text-center text-gray-400 text-xs">
                    Không tìm thấy sản phẩm hoặc phiên bản nào khớp với bộ lọc và từ khóa tìm kiếm
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const isSelected = selectedIds.has(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-emerald-50/30 transition-colors ${
                        isSelected ? "bg-emerald-50/15" : ""
                      }`}
                    >
                      {/* Checkbox chọn */}
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(p.id)}
                          className="text-gray-400 hover:text-emerald-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-emerald-700" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-300" />
                          )}
                        </button>
                      </td>

                      {/* STT */}
                      <td className="px-2 py-3 text-center font-medium text-gray-500">
                        {idx + 1}
                      </td>

                      {/* CỘT 1: LOẠI SẢN PHẨM */}
                      <td className="px-3 py-3 text-gray-800 font-semibold">
                        {p.productType}
                      </td>

                      {/* CỘT 2: HÌNH RENDER */}
                      <td className="px-2 py-2 text-center">
                        <div
                          onClick={() => setDetailModalItem(p)}
                          className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:border-emerald-600 hover:shadow-xs transition-all flex items-center justify-center bg-gray-50"
                          title="Bấm để xem chi tiết sản phẩm"
                        >
                          <img
                            src={p.renderImage}
                            alt="render"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/products/diamond-solitaire.svg";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* CỘT 3: HÌNH 4VIEW */}
                      <td className="px-2 py-2 text-center">
                        <div
                          onClick={() => setView4ModalItem(p)}
                          className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:border-emerald-600 hover:ring-2 hover:ring-emerald-500/30 transition-all flex items-center justify-center bg-gray-50 group relative"
                          title="Click xem 4 góc nhìn (Mặt trước, Góc nghiêng, Mặt sau, Mặt bên)"
                        >
                          <img
                            src={p.fourViewImage}
                            alt="4view"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/products/4view-technical.svg";
                            }}
                            className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-0 right-0 bg-emerald-800 text-[8px] text-white font-bold px-0.5 rounded-tl leading-none">
                            4V
                          </span>
                        </div>
                      </td>

                      {/* CỘT 4: MÃ ITEM (CHỈ HIỂN THỊ MÃ ITEM, BỎ CHỮ NHỎ THEO GHI CHÚ ĐỎ CỦA CHỊ ĐẸP) */}
                      <td className="px-3 py-3 font-mono text-[11px] font-semibold text-gray-900 break-all">
                        {p.itemCode}
                      </td>

                      {/* CỘT 5: MÃ DRAWING & BADGE VERSION NẾU CÓ */}
                      <td className="px-3 py-3">
                        <div className="font-mono text-xs font-semibold text-gray-800">
                          {p.drawingCode}
                        </div>
                        {p.affectsRouting ? (
                          <div className="mt-1">
                            <span 
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200" 
                              title="Phiên bản phát sinh từ Routing kỹ thuật, bán tiếp trên E-C (Khóa tùy biến)"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                              {p.changeTypeName || p.versionLabel || "Phiên bản Routing"}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              Bản vẽ gốc A00
                            </span>
                          </div>
                        )}
                      </td>

                      {/* CỘT 6: LOẠI THAY ĐỔI (ví dụ: Khóa, Đắp lacquer, Thay Cast) */}
                      <td className="px-3 py-3">
                        {p.changeType && p.changeType !== "---" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {p.changeType}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-mono text-xs">---</span>
                        )}
                      </td>

                      {/* CỘT 7: CHI TIẾT THAY ĐỔI (ví dụ: Khóa càng cua, Móc máy viền men đỏ) */}
                      <td className="px-3 py-3">
                        {p.changeDetail && p.changeDetail !== "---" ? (
                          <span className="text-gray-800 font-medium text-xs">
                            {p.changeDetail}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-mono text-xs">---</span>
                        )}
                      </td>

                      {/* TRỌNG LƯỢNG VÀNG */}
                      <td className="px-3 py-3 text-right font-mono text-gray-800 font-medium">
                        {p.goldWeight}
                      </td>

                      {/* LOẠI PHỤ LIỆU CHÍNH */}
                      <td className="px-3 py-3 text-gray-700">
                        {p.mainSubMaterial}
                      </td>

                      {/* LOẠI PHỤ LIỆU PHỤ */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.extraSubMaterial}
                      </td>

                      {/* MÀU PHỤ LIỆU CHÍNH */}
                      <td className="px-3 py-3 text-gray-700">
                        {p.mainSubMaterialColor}
                      </td>

                      {/* MÀU PHỤ LIỆU PHỤ */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.extraSubMaterialColor}
                      </td>

                      {/* CẤP ĐÁ */}
                      <td className="px-2 py-3 text-center font-mono text-gray-700">
                        {p.stoneQualityGrade}
                      </td>

                      {/* E-CATALOGUE */}
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(p.id)}
                          className="cursor-pointer"
                          title={isSelected ? "Đang bật trên EC (Click để tắt)" : "Chưa bật (Click để bật)"}
                        >
                          {isSelected ? (
                            <div className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-xs">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border border-gray-300 bg-white hover:border-emerald-600 flex items-center justify-center mx-auto" />
                          )}
                        </button>
                      </td>

                      {/* NGÀY TẠO */}
                      <td className="px-3 py-3 font-mono text-[11px] text-gray-600">
                        {p.createdDate}
                      </td>

                      {/* NGƯỜI TẠO */}
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                            {p.creator?.charAt(0)}
                          </div>
                          <span className="text-gray-700 truncate max-w-[110px]">{p.creator}</span>
                        </div>
                      </td>

                      {/* TRẠNG THÁI */}
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center space-x-1.5 text-[11px] font-medium">
                          <span className={`w-2 h-2 rounded-full ${p.statusColor || "bg-gray-400"}`} />
                          <span className="text-gray-700">{p.status}</span>
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setDetailModalItem(p)}
                          className="p-1 text-gray-400 hover:text-emerald-700 rounded hover:bg-gray-100 cursor-pointer"
                          title="Xem chi tiết sản phẩm"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Phân trang */}
        <div className="bg-gray-50/80 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500">
          <div>
            <span>Đã kích hoạt trên E-Catalogue: <strong className="text-emerald-800 font-bold">{selectedIds.size}</strong> sản phẩm</span>
          </div>

          <div className="flex items-center space-x-1 font-medium">
            <span className="px-2 py-1 bg-emerald-800 text-white rounded font-bold">1</span>
            <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">2</span>
            <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">3</span>
            <span className="text-gray-400 px-1">...</span>
            <span className="text-gray-500 text-[11px] ml-2">20 / trang</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MODAL POPUP HÌNH 4VIEW (4 GÓC NHÌN) CHUẨN 100% VIDEO FRAME 04 */}
      {/* ============================================================ */}
      {view4ModalItem && (
        <div 
          onClick={() => setView4ModalItem(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden cursor-default relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <span className="text-emerald-700">:::</span>
                <span>HÌNH ẢNH 4VIEW • {view4ModalItem.drawingCode}</span>
              </div>
              <button
                type="button"
                onClick={() => setView4ModalItem(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lưới 2x2 đúng 4 góc nhìn: 1. Mặt trước, 2. Góc nghiêng, 3. Mặt sau, 4. Mặt bên */}
            <div className="p-4 grid grid-cols-2 gap-3 bg-white">
              {(view4ModalItem.views4 || [
                { id: 1, title: "1. Mặt trước", img: view4ModalItem.renderImage },
                { id: 2, title: "2. Góc nghiêng", img: view4ModalItem.fourViewImage },
                { id: 3, title: "3. Mặt sau", img: view4ModalItem.renderImage },
                { id: 4, title: "4. Mặt bên", img: view4ModalItem.fourViewImage }
              ]).map((view) => (
                <div key={view.id} className="border border-gray-200 rounded-xl p-2 flex flex-col items-center bg-gray-50/40 hover:border-emerald-500 transition-colors">
                  <div className="w-full h-36 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img 
                      src={view.img} 
                      alt={view.title} 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 mt-2 block">
                    {view.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between items-center">
              <span>Mã item: <strong className="font-mono text-gray-800">{view4ModalItem.itemCode}</strong></span>
              <button
                type="button"
                onClick={() => setView4ModalItem(null)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL CHI TIẾT SẢN PHẨM CHUẨN 100% VIDEO FRAME 12           */}
      {/* ============================================================ */}
      {detailModalItem && (
        <div 
          onClick={() => setDetailModalItem(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer overflow-y-auto"
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden cursor-default relative border border-gray-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Chi tiết */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Cấu hình sản phẩm &gt; Chi tiết cấu hình sản phẩm
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">
                  CHI TIẾT SẢN PHẨM: {detailModalItem.drawingCode}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại</span>
              </button>
            </div>

            {/* Nội dung chi tiết khớp frame 12 */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Khung hình ảnh: Hình render & Hình 4view */}
              <div>
                <h3 className="font-bold text-gray-800 text-xs mb-2">Hình ảnh</h3>
                <div className="flex items-center space-x-4">
                  {/* Cột 1: Render */}
                  <div className="border border-gray-200 rounded-xl p-2 w-32 flex flex-col items-center bg-gray-50/50">
                    <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                      <img src={detailModalItem.renderImage} alt="render" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium mt-1.5">Hình render</span>
                  </div>

                  {/* Cột 2: 4view */}
                  <div 
                    onClick={() => {
                      setView4ModalItem(detailModalItem);
                    }}
                    className="border border-gray-200 hover:border-emerald-600 rounded-xl p-2 w-32 flex flex-col items-center bg-gray-50/50 cursor-pointer transition-colors"
                  >
                    <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                      <img src={detailModalItem.fourViewImage} alt="4view" className="w-full h-full object-contain p-1" />
                    </div>
                    <span className="text-[11px] text-emerald-800 font-semibold mt-1.5 flex items-center space-x-1">
                      <span>Hình 4view</span>
                      <Eye className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bảng Thuộc tính khớp chuẩn frame 12 */}
              <div>
                <h3 className="font-bold text-gray-800 text-xs mb-2">Thuộc tính kỹ thuật</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                  {[
                    { label: "Mã item", value: detailModalItem.itemCode, isMono: true },
                    { label: "Mã Drawing", value: detailModalItem.drawingCode, isMono: true },
                    { label: "Mã bộ", value: detailModalItem.setSeriesCode || "---" },
                    { label: "Loại sản phẩm", value: detailModalItem.productType },
                    { label: "Bộ sưu tập", value: detailModalItem.collection || "Lumea" },
                    { label: "Dòng hàng", value: detailModalItem.productionLine || "---" },
                    { label: "Phương pháp sản xuất", value: detailModalItem.productionMethod || "---" },
                    { label: "Nguyên liệu", value: detailModalItem.material || "Vàng" },
                    { label: "Màu xi", value: detailModalItem.platingColor || "Vàng" },
                    { label: "Trọng lượng vàng", value: detailModalItem.goldWeight || "---" },
                    { label: "Loại phụ liệu chính", value: detailModalItem.mainSubMaterial },
                    { label: "Màu phụ liệu chính", value: detailModalItem.mainSubMaterialColor || "---" },
                    { label: "Cấp chất lượng đá", value: detailModalItem.stoneQualityGrade || "1" },
                    { label: "Trạng thái E-Catalogue", value: selectedIds.has(detailModalItem.id) ? "Đang bật hiển thị trên E-Catalogue" : "Chưa kích hoạt" }
                  ].map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-3 px-4 py-2 hover:bg-gray-50/60">
                      <span className="text-gray-500 font-medium">{row.label}</span>
                      <span className={`col-span-2 text-gray-900 font-semibold ${row.isMono ? "font-mono text-[11px] break-all" : ""}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal Chi tiết */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white font-semibold rounded-lg text-xs cursor-pointer"
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
