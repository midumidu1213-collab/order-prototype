"use client";

import React, { useState } from "react";
import { 
  X, 
  Check, 
  SlidersHorizontal, 
  Clock, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Save, 
  CheckCircle2,
  Tag
} from "lucide-react";
import { ATTRIBUTE_CHANGE_CONFIGS, ADMIN_INTERNAL_ATTRIBUTES } from "@/data/productVersionConfigData";

export default function AdminTechnicalConfigModal({
  isOpen,
  onClose,
  order,
  onSaveConfig
}) {
  if (!isOpen || !order) return null;

  // Lấy giá trị khởi tạo từ order hoặc mặc định
  const initialData = order.adminConfiguredAttrs || {
    cordColor: "Dây đỏ may mắn",
    lacquerMethod: "Móc máy + Lácquer",
    lacquerTechGroup: "Nhóm 1 - Men sứ đơn sắc phủ nano",
    lacquerNote: "Men nano phủ lòng trong chấu đá",
    castChange: "Đổi cast ổ 6 chấu cao cấp viền kim",
    pearlToBall: "Thay ngọc trai bằng bi vàng 18K khía 5mm",
    sideStone: "4 viên đá CZ phụ 1.2mm giác cắt kim cương",
    officialWage: "250000"
  };

  const [formData, setFormData] = useState({
    cordColor: initialData.cordColor || "Dây đỏ may mắn",
    lacquerMethod: initialData.lacquerMethod || "Móc máy + Lácquer",
    lacquerTechGroup: initialData.lacquerTechGroup || "Nhóm 1 - Men sứ đơn sắc phủ nano",
    lacquerNote: initialData.lacquerNote || "",
    castChange: initialData.castChange || "",
    pearlToBall: initialData.pearlToBall || "",
    sideStone: initialData.sideStone || "",
    officialWage: initialData.officialWage || "250000"
  });

  const [activeTab, setActiveTab] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveConfig) {
      onSaveConfig(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004737] to-[#005a46] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/25 px-2 py-0.5 rounded">
                  Quyền Quản Trị Viên (Admin)
                </span>
                <span className="text-xs font-mono text-emerald-200">
                  {order.code}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                Tùy chọn thuộc tính kỹ thuật nội bộ (Chưa có trên E-C)
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Notice */}
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-950 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <span>
              Đơn này đang ở trạng thái <strong>Chờ xử lý</strong> (Giá công: Tính giá sau). Admin vui lòng định cấu hình kỹ thuật và định giá công chính thức.
            </span>
          </div>
        </div>

        {/* Modal Body: Form 5 thuộc tính kỹ thuật nội bộ Admin */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-gray-800 flex-1">
          
          {/* 1. Thuộc tính 8 trong Bảng: Màu dây (phụ liệu - vải,da) [Tùy chọn -> Dropdown] */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#00594c] flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Màu dây (phụ liệu - vải, da)</span>
              </label>
              <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                Loại: Tùy chọn (Dropdown)
              </span>
            </div>
            <p className="text-[11px] text-gray-500 italic">
              * Ghi chú CNS: CNS đánh giá chỉ lấy cùng loại dây, cùng kích thước.
            </p>
            <select
              value={formData.cordColor}
              onChange={(e) => setFormData({ ...formData, cordColor: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-[#00594c] rounded-xl text-xs font-semibold text-gray-800 outline-none cursor-pointer"
            >
              <option value="Dây đỏ may mắn">Dây đỏ may mắn (Tiêu chuẩn)</option>
              <option value="Dây đen chỉ dù">Dây đen chỉ dù bền chắc</option>
              <option value="Dây ngũ sắc Tây Tạng">Dây ngũ sắc Tây Tạng bình an</option>
              <option value="Dây hồng pastel">Dây hồng pastel trẻ trung</option>
              <option value="Dây da bò nâu cổ điển">Dây da bò nâu cổ điển (1.5mm)</option>
              <option value="Dây da đen bóng sang trọng">Dây da đen bóng sang trọng (1.5mm)</option>
            </select>
          </div>

          {/* 2. Thuộc tính 9 trong Bảng: Đắp lacquer - móc máy [Cả tùy chọn & Mô tả -> Vừa chọn vừa nhập] */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 text-xs flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-[#00594c] flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Đắp lacquer - móc máy (Ảnh hưởng Routing)</span>
              </label>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Loại: Cả tùy chọn & Mô tả
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tùy chọn 1: Phương pháp */}
              <div>
                <span className="text-[11px] font-semibold text-gray-700 block mb-1">Phương pháp thực hiện:</span>
                <select
                  value={formData.lacquerMethod}
                  onChange={(e) => setFormData({ ...formData, lacquerMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 focus:border-[#00594c] rounded-xl text-xs font-semibold text-emerald-950 outline-none cursor-pointer"
                >
                  <option value="Móc máy">Móc máy</option>
                  <option value="Lácquer">Lácquer (Mạ men)</option>
                  <option value="Móc máy + Lácquer">Móc máy + Lácquer (Cả hai)</option>
                </select>
              </div>

              {/* Tùy chọn 2: Nhóm kỹ thuật */}
              <div>
                <span className="text-[11px] font-semibold text-gray-700 block mb-1">Nhóm kỹ thuật:</span>
                <select
                  value={formData.lacquerTechGroup}
                  onChange={(e) => setFormData({ ...formData, lacquerTechGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 focus:border-[#00594c] rounded-xl text-xs font-semibold text-emerald-950 outline-none cursor-pointer"
                >
                  <option value="Nhóm 1 - Men sứ đơn sắc phủ nano">Nhóm 1 - Men sứ đơn sắc nano</option>
                  <option value="Nhóm 2 - Men sứ đa sắc viền kim">Nhóm 2 - Men sứ đa sắc viền kim</option>
                  <option value="Nhóm 3 - Móc máy hoa văn nổi 3D">Nhóm 3 - Móc máy hoa văn nổi 3D</option>
                </select>
              </div>
            </div>

            {/* Phần nhập mô tả / ghi chú */}
            <div>
              <span className="text-[11px] font-semibold text-gray-700 block mb-1">Mô tả / Ghi chú kỹ thuật lacquer:</span>
              <input
                type="text"
                value={formData.lacquerNote}
                onChange={(e) => setFormData({ ...formData, lacquerNote: e.target.value })}
                placeholder="Nhập mô tả chi tiết hoa văn móc máy / vị trí mạ men sứ..."
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs text-gray-800 outline-none focus:ring-1 focus:ring-[#00594c]"
              />
            </div>
          </div>

          {/* 3. Thuộc tính 10 trong Bảng: Thay cast [Mô tả (Ghi chú)] */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#00594c] flex items-center justify-center font-bold text-[10px]">3</span>
                <span>Thay cast (Khuôn đúc, ổ chấu)</span>
              </label>
              <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                Loại: Mô tả (Ghi chú Admin)
              </span>
            </div>
            <textarea
              rows={2}
              value={formData.castChange}
              onChange={(e) => setFormData({ ...formData, castChange: e.target.value })}
              placeholder="Nhập ghi chú yêu cầu thay đổi cast (ví dụ: đổi khuôn ổ 6 chấu cao cấp, thân nhẫn viền bi)..."
              className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-[#00594c] rounded-xl text-xs text-gray-800 outline-none focus:ring-1 focus:ring-[#00594c]"
            />
          </div>

          {/* 4. Thuộc tính 11 trong Bảng: Thay pearl sang ball [Mô tả (Ghi chú)] */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#00594c] flex items-center justify-center font-bold text-[10px]">4</span>
                <span>Thay pearl sang ball (Cấu trúc ngọc trai sang bi)</span>
              </label>
              <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                Loại: Mô tả (Ghi chú Admin)
              </span>
            </div>
            <textarea
              rows={2}
              value={formData.pearlToBall}
              onChange={(e) => setFormData({ ...formData, pearlToBall: e.target.value })}
              placeholder="Nhập ghi chú kỹ thuật thay đổi ngọc trai sang ball kim loại (kích cỡ ball, loại lỗ xỏ)..."
              className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-[#00594c] rounded-xl text-xs text-gray-800 outline-none focus:ring-1 focus:ring-[#00594c]"
            />
          </div>

          {/* 5. Thuộc tính 12 trong Bảng: Đá phụ [Mô tả (Ghi chú)] */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#00594c] flex items-center justify-center font-bold text-[10px]">5</span>
                <span>Đá phụ</span>
              </label>
              <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                Loại: Mô tả (Ghi chú Admin)
              </span>
            </div>
            <textarea
              rows={2}
              value={formData.sideStone}
              onChange={(e) => setFormData({ ...formData, sideStone: e.target.value })}
              placeholder="Nhập chi tiết thay đổi đá phụ (loại đá CZ/Kim cương tấm, kích thước, số lượng viên, cách kết đá chấu/viền)..."
              className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-[#00594c] rounded-xl text-xs text-gray-800 outline-none focus:ring-1 focus:ring-[#00594c]"
            />
          </div>

          {/* ĐỊNH GIÁ CÔNG CHÍNH THỨC */}
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-amber-950 text-xs flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-amber-700" />
                <span>Định giá công chính thức (VNĐ) *</span>
              </label>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                Chuyển từ "Tính giá sau" → Giá chính thức
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={formData.officialWage}
                  onChange={(e) => setFormData({ ...formData, officialWage: e.target.value })}
                  placeholder="Nhập giá công chính thức (ví dụ: 250000)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-400 rounded-xl text-sm font-bold text-[#00594c] outline-none font-mono focus:ring-2 focus:ring-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                  VNĐ
                </span>
              </div>
              <div className="text-right text-xs">
                <div className="text-gray-500">Quy đổi:</div>
                <div className="font-mono font-bold text-[#00594c] text-sm">
                  {Number(formData.officialWage || 0).toLocaleString()} đ
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Đóng
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#005a46] hover:bg-[#004737] text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu cấu hình & Chuyển sang "Đủ thông tin KT"</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
