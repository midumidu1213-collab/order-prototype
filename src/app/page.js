"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Filter, 
  Search, 
  Plus, 
  RotateCcw, 
  Eye, 
  Copy, 
  Settings, 
  LayoutGrid,
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  X,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import { ORDER_TABS_CONFIG, MOCK_ORDER_LIST } from "@/data/orderListMockData";

export default function OrderListPage() {
  // 1. State quản lý Tab đang active (Search theo Tab)
  const [activeTab, setActiveTab] = useState("ALL");

  // 2. State quản lý ô tìm kiếm toàn cục (Global Search)
  const [searchQuery, setSearchQuery] = useState("");

  // 3. State bật/tắt hiển thị hàng lọc theo từng cột (Column Filter Row)
  const [showColumnFilters, setShowColumnFilters] = useState(true);

  // 4. State quản lý bộ lọc cho từng cột (Search theo từng cột)
  const [columnFilters, setColumnFilters] = useState({
    code: "",
    customer: "",
    team: "",
    type: "",
    gold: "",
    date: ""
  });

  // 5. State quản lý popover lọc nổi theo từng cột khi bấm vào icon filter ở header
  const [activePopoverColumn, setActivePopoverColumn] = useState(null);

  // 6. State chọn dòng (Checkbox)
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 7. Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Danh sách các tùy chọn cho dropdown lọc cột
  const teamOptions = useMemo(() => {
    const teams = Array.from(new Set(MOCK_ORDER_LIST.map((o) => o.team).filter(Boolean)));
    return teams.sort();
  }, []);

  const typeOptions = ["Đơn hàng Gia công", "Đơn hàng Bán"];
  const goldOptions = ["61Y", "41.7W", "75W", "75Y"];

  // Đếm số lượng đơn thực tế theo từng Tab trong dữ liệu hiện có
  const tabCounts = useMemo(() => {
    const counts = { ALL: MOCK_ORDER_LIST.length };
    ORDER_TABS_CONFIG.forEach((tab) => {
      if (tab.id !== "ALL") {
        const count = MOCK_ORDER_LIST.filter((o) => o.status === tab.status).length;
        counts[tab.id] = count;
      }
    });
    return counts;
  }, []);

  // Xử lý thay đổi bộ lọc từng cột
  const handleColumnFilterChange = (columnKey, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  };

  // Xóa toàn bộ bộ lọc
  const handleResetAllFilters = () => {
    setActiveTab("ALL");
    setSearchQuery("");
    setColumnFilters({
      code: "",
      customer: "",
      team: "",
      type: "",
      gold: "",
      date: ""
    });
    setActivePopoverColumn(null);
    setCurrentPage(1);
  };

  // Kiểm tra xem hiện có bộ lọc nào đang được áp dụng không
  const isAnyFilterActive = useMemo(() => {
    return (
      activeTab !== "ALL" ||
      searchQuery.trim() !== "" ||
      Object.values(columnFilters).some((val) => val !== "")
    );
  }, [activeTab, searchQuery, columnFilters]);

  // Logic lọc dữ liệu kết hợp: Tab + Search chung + Từng cột
  const filteredOrders = useMemo(() => {
    return MOCK_ORDER_LIST.filter((order) => {
      // 1. Lọc theo Tab trạng thái
      if (activeTab !== "ALL") {
        const currentTabConfig = ORDER_TABS_CONFIG.find((t) => t.id === activeTab);
        if (currentTabConfig?.status && order.status !== currentTabConfig.status) {
          return false;
        }
      }

      // 2. Lọc theo ô tìm kiếm toàn cục (Global Search)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchGlobal = 
          order.code?.toLowerCase().includes(query) ||
          order.customer?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query) ||
          order.team?.toLowerCase().includes(query) ||
          order.type?.toLowerCase().includes(query);
        if (!matchGlobal) return false;
      }

      // 3. Lọc theo từng cột (Column Filters)
      // Cột Mã đơn hàng
      if (columnFilters.code.trim() !== "") {
        if (!order.code?.toLowerCase().includes(columnFilters.code.toLowerCase().trim())) {
          return false;
        }
      }

      // Cột Khách hàng
      if (columnFilters.customer.trim() !== "") {
        if (!order.customer?.toLowerCase().includes(columnFilters.customer.toLowerCase().trim())) {
          return false;
        }
      }

      // Cột Đội nhóm phụ trách
      if (columnFilters.team !== "") {
        if (order.team !== columnFilters.team) {
          return false;
        }
      }

      // Cột Loại đơn hàng
      if (columnFilters.type !== "") {
        if (order.type !== columnFilters.type) {
          return false;
        }
      }

      // Cột Tuổi vàng
      if (columnFilters.gold !== "") {
        if (order.gold !== columnFilters.gold) {
          return false;
        }
      }

      // Cột Ngày đặt hàng
      if (columnFilters.date.trim() !== "") {
        if (!order.date?.toLowerCase().includes(columnFilters.date.toLowerCase().trim())) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, searchQuery, columnFilters]);

  // Phân trang dữ liệu
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

  return (
    <div className="space-y-3 pb-16 max-w-[1600px] mx-auto text-slate-800">
      
      {/* 1. Breadcrumbs */}
      <div className="text-xs text-slate-500 flex items-center space-x-1.5 pt-1">
        <span>Quản lý đơn hàng</span>
        <span>&gt;</span>
        <span className="font-semibold text-slate-900">Danh sách đơn hàng</span>
      </div>

      {/* 2. Tiêu đề trang */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Danh sách đơn hàng</h1>
      </div>

      {/* 3. HÀNG TABS: TÌM KIẾM / LỌC THEO TAB (CHUẨN FORM TRONG ẢNH CHỤP) */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-6 min-w-max">
          {ORDER_TABS_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            // Hiển thị số lượng: ưu tiên lấy count từ cấu hình hoặc count thực tế nếu có
            const displayCount = tab.id === "ALL" 
              ? tab.count 
              : tabCounts[tab.id] !== undefined ? `${tab.count} (${tabCounts[tab.id]})` : tab.count;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap pb-2.5 px-0.5 border-b-2 font-medium text-xs transition-colors cursor-pointer flex items-center space-x-1 ${
                  isActive
                    ? "border-[#005a46] text-[#005a46] font-bold"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <span>{tab.name}</span>
                <span className={`text-[11px] ${isActive ? "text-[#005a46] font-bold" : "text-slate-500"}`}>
                  ({tab.id === "ALL" ? tab.count : tab.count})
                </span>
                {tabCounts[tab.id] > 0 && tab.id !== "ALL" && (
                  <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-[#005a46] text-[10px] rounded-full font-bold">
                    {tabCounts[tab.id]} có sẵn
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. THANH TÌM KIẾM TOÀN CỤC & THANH CÔNG CỤ (TOOLBAR) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        
        {/* Khối Tìm kiếm chung & Bật/Tắt Bộ lọc cột */}
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

          {/* Nút Bật / Tắt hàng lọc từng cột */}
          <button
            type="button"
            onClick={() => setShowColumnFilters(!showColumnFilters)}
            className={`flex items-center px-3 py-2 border rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              showColumnFilters
                ? "bg-emerald-50 border-emerald-400 text-[#005a46]"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
            title="Bật/tắt thanh tìm kiếm theo từng cột"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            <span>Bộ lọc cột</span>
          </button>

          {/* Nút Xóa toàn bộ bộ lọc nếu đang có filter */}
          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="flex items-center px-2.5 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Đặt lại toàn bộ bộ lọc"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* Khối Nút Thêm Mới & Reload */}
        <div className="flex items-center space-x-2 justify-end">
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="p-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
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
        <div className="text-xs text-slate-600 flex items-center space-x-2 py-1">
          <span>Đang hiển thị kết quả lọc: <strong>{filteredOrders.length}</strong> / {MOCK_ORDER_LIST.length} đơn hàng.</span>
          {activeTab !== "ALL" && (
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
              Tab: {ORDER_TABS_CONFIG.find((t) => t.id === activeTab)?.name}
            </span>
          )}
          {columnFilters.code && (
            <span className="bg-emerald-50 text-[#005a46] px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              Mã: {columnFilters.code}
            </span>
          )}
          {columnFilters.customer && (
            <span className="bg-emerald-50 text-[#005a46] px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              KH: {columnFilters.customer}
            </span>
          )}
          {columnFilters.team && (
            <span className="bg-emerald-50 text-[#005a46] px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              Nhóm: {columnFilters.team}
            </span>
          )}
          {columnFilters.type && (
            <span className="bg-emerald-50 text-[#005a46] px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              Loại: {columnFilters.type}
            </span>
          )}
          {columnFilters.gold && (
            <span className="bg-emerald-50 text-[#005a46] px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              Vàng: {columnFilters.gold}
            </span>
          )}
          {columnFilters.date && (
            <span className="bg-emerald-50 text-[#005a46] px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
              Ngày: {columnFilters.date}
            </span>
          )}
        </div>
      )}

      {/* 5. BẢNG DỮ LIỆU ĐƠN HÀNG (THEO ĐÚNG CÁC CỘT TRONG ẢNH CHỤP CỦA CHỊ ĐẸP) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-slate-200 text-left text-xs">
            
            {/* HÀNG TIÊU ĐỀ CHÍNH (THEAD) */}
            <thead className="bg-slate-50 font-bold text-slate-700 text-[11px] whitespace-nowrap select-none">
              <tr>
                {/* Cột 1: Checkbox chọn tất cả */}
                <th className="px-3 py-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                  />
                </th>

                {/* Cột 2: STT */}
                <th className="px-3 py-3 text-center w-12 font-bold text-slate-800">STT</th>

                {/* Cột 3: Mã đơn hàng (Kèm icon Filter) */}
                <th className="px-3 py-3">
                  <div className="flex items-center space-x-1.5 cursor-pointer">
                    <span className="font-bold text-slate-800">Mã đơn hàng</span>
                    <button
                      type="button"
                      onClick={() => setShowColumnFilters(true)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                        columnFilters.code ? "text-[#005a46] font-bold" : "text-slate-400"
                      }`}
                      title="Lọc theo Mã đơn hàng"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                  </div>
                </th>

                {/* Cột 4: Khách hàng (Kèm icon Filter) */}
                <th className="px-3 py-3">
                  <div className="flex items-center space-x-1.5 cursor-pointer">
                    <span className="font-bold text-slate-800">Khách hàng</span>
                    <button
                      type="button"
                      onClick={() => setShowColumnFilters(true)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                        columnFilters.customer ? "text-[#005a46] font-bold" : "text-slate-400"
                      }`}
                      title="Lọc theo Khách hàng"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                  </div>
                </th>

                {/* Cột 5: Đội nhóm phụ trách (Kèm icon Filter) */}
                <th className="px-3 py-3">
                  <div className="flex items-center space-x-1.5 cursor-pointer">
                    <span className="font-bold text-slate-800">Đội nhóm phụ trách</span>
                    <button
                      type="button"
                      onClick={() => setShowColumnFilters(true)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                        columnFilters.team ? "text-[#005a46] font-bold" : "text-slate-400"
                      }`}
                      title="Lọc theo Đội nhóm phụ trách"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                  </div>
                </th>

                {/* Cột 6: Loại đơn hàng (Kèm icon Filter) */}
                <th className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1.5 cursor-pointer">
                    <span className="font-bold text-slate-800">Loại đơn hàng</span>
                    <button
                      type="button"
                      onClick={() => setShowColumnFilters(true)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                        columnFilters.type ? "text-[#005a46] font-bold" : "text-slate-400"
                      }`}
                      title="Lọc theo Loại đơn hàng"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                  </div>
                </th>

                {/* Cột 7: Tuổi vàng (Kèm icon Filter) */}
                <th className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1.5 cursor-pointer">
                    <span className="font-bold text-slate-800">Tuổi vàng</span>
                    <button
                      type="button"
                      onClick={() => setShowColumnFilters(true)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                        columnFilters.gold ? "text-[#005a46] font-bold" : "text-slate-400"
                      }`}
                      title="Lọc theo Tuổi vàng"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                  </div>
                </th>

                {/* Cột 8: Ngày đặt hàng (Kèm icon Filter) */}
                <th className="px-3 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1.5 cursor-pointer">
                    <span className="font-bold text-slate-800">Ngày đặt hàng</span>
                    <button
                      type="button"
                      onClick={() => setShowColumnFilters(true)}
                      className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                        columnFilters.date ? "text-[#005a46] font-bold" : "text-slate-400"
                      }`}
                      title="Lọc theo Ngày đặt hàng"
                    >
                      <Filter className="h-3 w-3" />
                    </button>
                  </div>
                </th>

                {/* Cột 9: Thời gian chào hàng */}
                <th className="px-3 py-3 text-center text-slate-800">
                  Thời gian chào hàng
                </th>

                {/* Cột 10: Actions */}
                <th className="px-3 py-3 text-center w-28 text-slate-800">
                  Actions
                </th>
              </tr>

              {/* HÀNG FILTER ROW TỪNG CỘT (HIỂN THỊ KHI BẬT BỘ LỌC) */}
              {showColumnFilters && (
                <tr className="bg-emerald-50/40 border-t border-b border-emerald-100">
                  {/* Ô trống tương ứng checkbox */}
                  <th className="px-2 py-1.5 text-center"></th>

                  {/* Ô trống tương ứng STT */}
                  <th className="px-2 py-1.5 text-center"></th>

                  {/* Input lọc Mã đơn hàng */}
                  <th className="px-2 py-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        value={columnFilters.code}
                        onChange={(e) => handleColumnFilterChange("code", e.target.value)}
                        placeholder="Lọc mã SO..."
                        className="w-full px-2 py-1 text-[11px] font-normal border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                      />
                      {columnFilters.code && (
                        <button
                          type="button"
                          onClick={() => handleColumnFilterChange("code", "")}
                          className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </th>

                  {/* Input lọc Khách hàng */}
                  <th className="px-2 py-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        value={columnFilters.customer}
                        onChange={(e) => handleColumnFilterChange("customer", e.target.value)}
                        placeholder="Lọc tên/mã KH..."
                        className="w-full px-2 py-1 text-[11px] font-normal border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                      />
                      {columnFilters.customer && (
                        <button
                          type="button"
                          onClick={() => handleColumnFilterChange("customer", "")}
                          className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </th>

                  {/* Dropdown lọc Đội nhóm phụ trách */}
                  <th className="px-2 py-1.5">
                    <select
                      value={columnFilters.team}
                      onChange={(e) => handleColumnFilterChange("team", e.target.value)}
                      className="w-full px-1.5 py-1 text-[11px] font-normal border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                    >
                      <option value="">Tất cả đội nhóm</option>
                      {teamOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </th>

                  {/* Dropdown lọc Loại đơn hàng */}
                  <th className="px-2 py-1.5">
                    <select
                      value={columnFilters.type}
                      onChange={(e) => handleColumnFilterChange("type", e.target.value)}
                      className="w-full px-1.5 py-1 text-[11px] font-normal border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                    >
                      <option value="">Tất cả loại đơn</option>
                      {typeOptions.map((tp) => (
                        <option key={tp} value={tp}>{tp}</option>
                      ))}
                    </select>
                  </th>

                  {/* Dropdown lọc Tuổi vàng */}
                  <th className="px-2 py-1.5">
                    <select
                      value={columnFilters.gold}
                      onChange={(e) => handleColumnFilterChange("gold", e.target.value)}
                      className="w-full px-1.5 py-1 text-[11px] font-normal border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                    >
                      <option value="">Tất cả tuổi vàng</option>
                      {goldOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </th>

                  {/* Input lọc Ngày đặt hàng */}
                  <th className="px-2 py-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        value={columnFilters.date}
                        onChange={(e) => handleColumnFilterChange("date", e.target.value)}
                        placeholder="Lọc ngày đặt..."
                        className="w-full px-2 py-1 text-[11px] font-normal border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                      />
                      {columnFilters.date && (
                        <button
                          type="button"
                          onClick={() => handleColumnFilterChange("date", "")}
                          className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </th>

                  {/* Cột thời gian chào hàng */}
                  <th className="px-2 py-1.5 text-center"></th>

                  {/* Nút reset filter */}
                  <th className="px-2 py-1.5 text-center">
                    {isAnyFilterActive && (
                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                        title="Xóa điều kiện lọc cột"
                      >
                        Reset
                      </button>
                    )}
                  </th>
                </tr>
              )}
            </thead>

            {/* THÂN BẢNG DỮ LIỆU (TBODY) */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, idx) => {
                  const isChecked = selectedIds.has(order.id);
                  const displayIndex = (currentPage - 1) * itemsPerPage + idx + 1;

                  // Màu badge Loại đơn hàng chuẩn theo ảnh chụp của Chị đẹp
                  const isProcessing = order.type === "Đơn hàng Gia công";

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isChecked ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      {/* Checkbox chọn dòng */}
                      <td className="px-3 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(order.id)}
                          className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* STT */}
                      <td className="px-3 py-3.5 text-center font-mono font-medium text-slate-500">
                        {displayIndex}
                      </td>

                      {/* Mã đơn hàng (Link click xem chi tiết) */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <Link
                          href={`/orders/${order.id === 11 ? "11" : order.id}`}
                          className="font-mono font-bold text-[#007a5e] hover:text-[#004737] hover:underline"
                          title="Bấm để xem chi tiết đơn hàng"
                        >
                          {order.code}
                        </Link>
                      </td>

                      {/* Khách hàng */}
                      <td className="px-3 py-3.5 text-slate-800 max-w-xs truncate" title={order.customer}>
                        <span className="font-mono font-bold text-slate-700">{order.customerCode}</span>
                        <span className="text-slate-400 mx-1">-</span>
                        <span className="font-medium text-slate-900">{order.customerName || order.customer}</span>
                      </td>

                      {/* Đội nhóm phụ trách */}
                      <td className="px-3 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                        {order.team}
                      </td>

                      {/* Loại đơn hàng (Badge màu vàng cam cho Gia công, xanh lá cho Bán chuẩn ảnh) */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        {isProcessing ? (
                          <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            Đơn hàng Gia công
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Đơn hàng Bán
                          </span>
                        )}
                      </td>

                      {/* Tuổi vàng */}
                      <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-700">
                        {order.gold}
                      </td>

                      {/* Ngày đặt hàng */}
                      <td className="px-3 py-3.5 text-center font-mono text-slate-600">
                        {order.date}
                      </td>

                      {/* Thời gian chào hàng */}
                      <td className="px-3 py-3.5 text-center text-slate-400 font-mono">
                        {order.offerTime || "---"}
                      </td>

                      {/* Actions (3 icons: Sổ/Xem, Lưới, Cài đặt chuẩn ảnh) */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5 text-slate-400">
                          {/* Nút xem chi tiết */}
                          <Link
                            href={`/orders/${order.id === 11 ? "11" : order.id}`}
                            className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded transition-colors"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {/* Nút lưới / tác vụ */}
                          <button
                            type="button"
                            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Tác vụ"
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </button>

                          {/* Nút cài đặt */}
                          <button
                            type="button"
                            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Cấu hình"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Trạng thái Không tìm thấy kết quả */
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Filter className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">
                        Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
                      </p>
                      <p className="text-xs text-slate-400">
                        Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Xóa tất cả bộ lọc".
                      </p>
                      <button
                        type="button"
                        onClick={handleResetAllFilters}
                        className="mt-2 px-3 py-1.5 bg-[#005a46] text-white text-xs font-bold rounded-lg hover:bg-[#004737] cursor-pointer"
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

        {/* 6. PHÂN TRANG (PAGINATION CHUẨN ERP) */}
        <div className="bg-slate-50/70 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 select-none">
          <div className="flex items-center space-x-1.5">
            <span>Hiển thị</span>
            <strong className="text-slate-900">{filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong>
            <span>-</span>
            <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</strong>
            <span>trong tổng số</span>
            <strong className="text-slate-900">{filteredOrders.length}</strong>
            <span>đơn hàng</span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Về trang đầu */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Trang đầu"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Trang trước */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Các số trang */}
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-[#005a46] bg-[#005a46] text-white font-bold"
            >
              1
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              4
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              5
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              30
            </button>

            {/* Trang sau */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Về trang cuối */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Trang cuối"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>

            <select className="border border-slate-300 rounded px-2 py-1 bg-white text-xs text-slate-700 ml-2 focus:outline-none">
              <option>20 / trang</option>
              <option>50 / trang</option>
              <option>100 / trang</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
