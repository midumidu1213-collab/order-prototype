"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { 
  ArrowUpAZ, 
  ArrowDownZA, 
  Search, 
  Calendar, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from "lucide-react";

export default function ColumnFilterPopover({
  columnKey,
  columnTitle,
  columnType = "select", // "select" | "date" | "sort-only"
  uniqueValues = [],
  filterState = {},
  onApply,
  onClear,
  onClose
}) {
  const popoverRef = useRef(null);

  // 1. Sort state tạm thời
  const [tempSort, setTempSort] = useState(filterState.sort || null);

  // 2. Ô tìm kiếm giá trị trong popover
  const [searchValue, setSearchValue] = useState(filterState.searchQuery || "");

  // 3. State lọc danh sách giá trị (Checkbox list)
  const [tempSelectedValues, setTempSelectedValues] = useState(() => {
    if (filterState.selectedValues instanceof Set) {
      return new Set(filterState.selectedValues);
    }
    // Mặc định chọn tất cả
    return new Set(uniqueValues.map((v) => String(v)));
  });

  // Đánh dấu người dùng đã tự tay bấm checkbox hoặc nút chọn/bỏ chọn
  const [hasManuallyToggled, setHasManuallyToggled] = useState(false);

  // 4. State lọc ngày tháng (cho cột Ngày đặt hàng)
  const [dateCondition, setDateCondition] = useState(filterState.dateCondition || "between");
  const [dateFrom, setDateFrom] = useState(filterState.dateFrom || "");
  const [dateTo, setDateTo] = useState(filterState.dateTo || "");

  // 5. Bật/tắt accordion "Lọc theo điều kiện"
  const [isConditionOpen, setIsConditionOpen] = useState(true);

  // Đóng popover khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Lọc danh sách giá trị checkbox theo ô tìm kiếm
  const filteredUniqueValues = useMemo(() => {
    if (!searchValue.trim()) return uniqueValues;
    const q = searchValue.toLowerCase().trim();
    return uniqueValues.filter((v) => String(v).toLowerCase().includes(q));
  }, [uniqueValues, searchValue]);

  // Toggle chọn một giá trị checkbox
  const handleToggleValue = (val) => {
    setHasManuallyToggled(true);
    const s = String(val);
    const next = new Set(tempSelectedValues);
    if (next.has(s)) {
      next.delete(s);
    } else {
      next.add(s);
    }
    setTempSelectedValues(next);
  };

  // Chọn tất cả (nếu đang search thì chọn tất cả các item đang hiển thị)
  const handleSelectAll = () => {
    setHasManuallyToggled(true);
    if (searchValue.trim()) {
      const next = new Set(tempSelectedValues);
      filteredUniqueValues.forEach((v) => next.add(String(v)));
      setTempSelectedValues(next);
    } else {
      setTempSelectedValues(new Set(uniqueValues.map((v) => String(v))));
    }
  };

  // Bỏ chọn tất cả (nếu đang search thì bỏ chọn các item đang hiển thị)
  const handleDeselectAll = () => {
    setHasManuallyToggled(true);
    if (searchValue.trim()) {
      const next = new Set(tempSelectedValues);
      filteredUniqueValues.forEach((v) => next.delete(String(v)));
      setTempSelectedValues(next);
    } else {
      setTempSelectedValues(new Set());
    }
  };

  // Xóa bộ lọc của cột này
  const handleResetColumn = () => {
    setTempSort(null);
    setSearchValue("");
    setHasManuallyToggled(false);
    setTempSelectedValues(new Set(uniqueValues.map((v) => String(v))));
    setDateFrom("");
    setDateTo("");
    onClear();
  };

  // Áp dụng bộ lọc
  const handleApply = () => {
    const trimmedQuery = searchValue.trim();

    // Xác định selectedValues:
    let finalSelected = null;

    if (hasManuallyToggled) {
      // Người dùng đã chủ động tích/bỏ chọn checkbox
      finalSelected = tempSelectedValues.size === uniqueValues.length ? null : tempSelectedValues;
    } else if (trimmedQuery) {
      // Người dùng gõ text tìm kiếm nhưng chưa bấm checkbox:
      // Tự động lọc theo các giá trị match với từ khóa tìm kiếm
      finalSelected = new Set(filteredUniqueValues.map((v) => String(v)));
    } else {
      // Không gõ search, không thay đổi checkbox -> Giữ nguyên hoặc bỏ lọc nếu chọn tất cả
      finalSelected = tempSelectedValues.size === uniqueValues.length ? null : tempSelectedValues;
    }

    onApply({
      sort: tempSort,
      searchQuery: trimmedQuery,
      selectedValues: finalSelected,
      dateCondition,
      dateFrom,
      dateTo
    });
  };

  // Bắt sự kiện phím Enter trong ô tìm kiếm
  const handleKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 p-3.5 w-76 text-xs normal-case font-normal animate-in fade-in zoom-in-95 duration-100"
      style={{ minWidth: "285px" }}
    >
      {/* 1. KHỐI SẮP XẾP (SORTING) */}
      <div className="space-y-1 pb-2">
        {columnType === "date" ? (
          <>
            <button
              type="button"
              onClick={() => setTempSort(tempSort === "asc" ? null : "asc")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                tempSort === "asc" ? "bg-emerald-50 text-[#005a46] font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2 text-sm">↑</span>
              <span>Sắp xếp cũ → mới</span>
              {tempSort === "asc" && <Check className="ml-auto h-3.5 w-3.5 text-[#005a46]" />}
            </button>
            <button
              type="button"
              onClick={() => setTempSort(tempSort === "desc" ? null : "desc")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                tempSort === "desc" ? "bg-emerald-50 text-[#005a46] font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2 text-sm">↓</span>
              <span>Sắp xếp mới → cũ</span>
              {tempSort === "desc" && <Check className="ml-auto h-3.5 w-3.5 text-[#005a46]" />}
            </button>
          </>
        ) : columnType === "sort-only" ? (
          <>
            <button
              type="button"
              onClick={() => setTempSort(tempSort === "asc" ? null : "asc")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                tempSort === "asc" ? "bg-emerald-50 text-[#005a46] font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2 text-sm">↑</span>
              <span>Sắp xếp tăng dần (Nhỏ → Lớn)</span>
              {tempSort === "asc" && <Check className="ml-auto h-3.5 w-3.5 text-[#005a46]" />}
            </button>
            <button
              type="button"
              onClick={() => setTempSort(tempSort === "desc" ? null : "desc")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                tempSort === "desc" ? "bg-emerald-50 text-[#005a46] font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2 text-sm">↓</span>
              <span>Sắp xếp giảm dần (Lớn → Nhỏ)</span>
              {tempSort === "desc" && <Check className="ml-auto h-3.5 w-3.5 text-[#005a46]" />}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setTempSort(tempSort === "asc" ? null : "asc")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                tempSort === "asc" ? "bg-emerald-50 text-[#005a46] font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2 text-sm">↑</span>
              <span>Sắp xếp A → Z</span>
              {tempSort === "asc" && <Check className="ml-auto h-3.5 w-3.5 text-[#005a46]" />}
            </button>
            <button
              type="button"
              onClick={() => setTempSort(tempSort === "desc" ? null : "desc")}
              className={`w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                tempSort === "desc" ? "bg-emerald-50 text-[#005a46] font-bold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2 text-sm">↓</span>
              <span>Sắp xếp Z → A</span>
              {tempSort === "desc" && <Check className="ml-auto h-3.5 w-3.5 text-[#005a46]" />}
            </button>
          </>
        )}
      </div>

      <div className="border-t border-slate-100 my-1.5" />

      {/* 2. NÚT XÓA BỘ LỌC CỘT */}
      <button
        type="button"
        onClick={handleResetColumn}
        className="w-full flex items-center px-2 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-left transition-colors cursor-pointer text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-2 text-slate-400 group-hover:text-rose-500" />
        <span>Xóa bộ lọc cột</span>
      </button>

      {columnType !== "sort-only" && (
        <>
          <div className="border-t border-slate-100 my-1.5" />

          {/* 3. KHỐI LỌC THEO ĐIỀU KIỆN (ACCORDION) */}
          <div>
            <button
              type="button"
              onClick={() => setIsConditionOpen(!isConditionOpen)}
              className="w-full flex items-center justify-between px-2 py-1 text-slate-700 font-semibold hover:text-slate-900 cursor-pointer"
            >
              <span>Lọc theo điều kiện</span>
              {isConditionOpen ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {isConditionOpen && (
              <div className="mt-2 space-y-2">
                {/* TH1: Cột ngày tháng (Ngày đặt hàng) */}
                {columnType === "date" ? (
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Điều kiện:</label>
                      <select
                        value={dateCondition}
                        onChange={(e) => setDateCondition(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                      >
                        <option value="between">Trong khoảng</option>
                        <option value="equals">Bằng ngày</option>
                        <option value="before">Trước hoặc bằng ngày</option>
                        <option value="after">Sau hoặc bằng ngày</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 block">Thời gian:</label>
                      {dateCondition === "between" ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] text-slate-400 w-7">Từ:</span>
                            <input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              className="flex-1 px-2 py-1 border border-slate-300 rounded text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                            />
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] text-slate-400 w-7">Đến:</span>
                            <input
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              className="flex-1 px-2 py-1 border border-slate-300 rounded text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                            />
                          </div>
                        </div>
                      ) : (
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46]"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  /* TH2: Cột danh sách giá trị / văn bản (Tuổi vàng, Trạng thái, Khách hàng,...) */
                  <div className="space-y-2">
                    {/* Ô tìm kiếm giá trị */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDownSearch}
                        placeholder="Tìm kiếm giá trị hoặc gõ Enter..."
                        className="w-full pl-7 pr-6 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#005a46] focus:border-[#005a46]"
                      />
                      <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
                      {searchValue && (
                        <button
                          type="button"
                          onClick={() => setSearchValue("")}
                          className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Chọn tất cả / Bỏ chọn + Số lượng đã chọn */}
                    <div className="flex items-center justify-between text-[11px] px-1 text-[#005a46] font-semibold">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="hover:underline cursor-pointer"
                        >
                          Chọn tất cả
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                      <span className="text-slate-400 font-normal text-[10px]">
                        {tempSelectedValues.size}/{uniqueValues.length}
                      </span>
                    </div>

                    {/* Danh sách checkbox giá trị */}
                    <div className="max-h-44 overflow-y-auto space-y-0.5 border border-slate-200 rounded-lg p-1.5 bg-slate-50/50">
                      {filteredUniqueValues.length > 0 ? (
                        filteredUniqueValues.map((val) => {
                          const sVal = String(val);
                          const isChecked = tempSelectedValues.has(sVal);
                          return (
                            <label
                              key={sVal}
                              className="flex items-center space-x-2 px-1.5 py-1 rounded hover:bg-white text-xs cursor-pointer select-none transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleValue(sVal)}
                                className="w-3.5 h-3.5 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer shrink-0"
                              />
                              <span className="truncate text-slate-700 font-medium" title={sVal}>
                                {sVal || "---"}
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <div className="py-3 text-center text-slate-400 text-[11px]">
                          Không tìm thấy giá trị phù hợp
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <div className="border-t border-slate-100 my-2.5" />

      {/* 4. FOOTER THANH TÁC VỤ (Xóa lọc | Đóng | Áp dụng) */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleResetColumn}
          className="text-slate-400 hover:text-rose-600 text-[11px] font-medium cursor-pointer"
        >
          Xóa lọc
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-3.5 py-1 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
