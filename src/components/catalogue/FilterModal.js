"use client";

import React, { useState } from "react";
import { X, Check, RotateCcw } from "lucide-react";

export default function FilterModal({ isOpen, onClose, onApply, activeFilters = {}, onReset }) {
  const [selectedGoldAge, setSelectedGoldAge] = useState(activeFilters.goldAge || "");
  const [selectedGoldColor, setSelectedGoldColor] = useState(activeFilters.goldColor || "");
  const [selectedStoneColor, setSelectedStoneColor] = useState(activeFilters.stoneColor || "");
  const [priceRange, setPriceRange] = useState(activeFilters.priceRange || "all");

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      goldAge: selectedGoldAge,
      goldColor: selectedGoldColor,
      stoneColor: selectedStoneColor,
      priceRange
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedGoldAge("");
    setSelectedGoldColor("");
    setSelectedStoneColor("");
    setPriceRange("all");
    onReset();
    onClose();
  };

  const countActive = [selectedGoldAge, selectedGoldColor, selectedStoneColor, priceRange !== "all" ? priceRange : ""].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-emerald-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#00594c] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">Bộ lọc sản phẩm</h3>
            {countActive > 0 && (
              <span className="bg-emerald-400 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">
                {countActive}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm text-gray-700">
          {/* Tuổi vàng */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Tuổi vàng / Hàm lượng</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "41.6Y", label: "10K (41.6Y)" },
                { id: "58.5Y", label: "14K (58.5Y)" },
                { id: "75.0Y", label: "18K (75.0Y)" },
                { id: "99.9Y", label: "24K (99.9Y)" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedGoldAge(selectedGoldAge === item.id ? "" : item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    selectedGoldAge === item.id
                      ? "bg-[#00594c] text-white border-[#00594c] shadow-sm font-semibold"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Màu xi / Màu vàng */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Màu xi trang sức</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "Vàng", label: "Vàng vàng (Yellow)" },
                { id: "Trắng", label: "Vàng trắng (White)" },
                { id: "Hồng", label: "Vàng hồng (Rose)" },
                { id: "Vàng 2 màu", label: "Phối 2 màu" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedGoldColor(selectedGoldColor === item.id ? "" : item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    selectedGoldColor === item.id
                      ? "bg-[#00594c] text-white border-[#00594c] shadow-sm font-semibold"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Màu đá chính */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Màu đá chính</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "Xám", label: "Xám khói / Kim Cương" },
                { id: "Trắng", label: "Trắng CZ / Diamond" },
                { id: "Xanh Emerald", label: "Xanh lục bảo" },
                { id: "Đỏ Ruby", label: "Đỏ Ruby" },
                { id: "Tím Sapphire", label: "Tím Amethyst" },
                { id: "Đen Onyx", label: "Đen Onyx" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedStoneColor(selectedStoneColor === item.id ? "" : item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    selectedStoneColor === item.id
                      ? "bg-[#00594c] text-white border-[#00594c] shadow-sm font-semibold"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Khoảng giá tiền công */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Khoảng giá tiền công</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00594c] bg-white"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under-500k">Dưới 500.000đ</option>
              <option value="500k-1500k">500.000đ - 1.500.000đ</option>
              <option value="1500k-3000k">1.500.000đ - 3.000.000đ</option>
              <option value="above-3000k">Trên 3.000.000đ</option>
            </select>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center text-xs text-gray-600 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Thiết lập lại
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00594c] hover:bg-[#004737] text-white shadow-md transition-all flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
