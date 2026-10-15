"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Box, 
  Search, 
  Plus, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ChevronRight,
  ChevronDown,
  Info,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { CHANGE_TYPES_CONFIG } from "@/data/productVersionConfigData";

export default function ProductManagementChangeTypesPage() {
  const [changeTypes, setChangeTypes] = useState(CHANGE_TYPES_CONFIG);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHighlight, setActiveHighlight] = useState(true);

  const filtered = changeTypes.filter((ct) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      ct.code.toLowerCase().includes(q) ||
      ct.name.toLowerCase().includes(q) ||
      ct.productType.toLowerCase().includes(q) ||
      ct.note.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-[#f4f6f8] font-sans antialiased overflow-hidden">
      {/* 1. Sidebar Quản lý sản phẩm (QLSP) chuẩn nhận diện giao diện Ảnh 2 */}
      <aside className="w-64 bg-[#0a2e24] text-white flex flex-col h-full overflow-y-auto shrink-0 border-r border-emerald-950">
        {/* Header Phân hệ QLSP */}
        <div className="h-16 px-4 border-b border-emerald-900 flex items-center justify-between shrink-0 bg-[#06241c]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block leading-none">
                Phân hệ ERP
              </span>
              <span className="text-sm font-bold text-white block truncate leading-tight mt-0.5">
                Quản lý sản phẩm
              </span>
            </div>
          </div>
        </div>

        {/* Chuyển nhanh về QLĐH */}
        <div className="p-2 border-b border-emerald-900/60 bg-emerald-950/40">
          <Link
            href="/orders/config-product"
            className="flex items-center justify-between p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/80 text-white text-xs font-semibold transition-all border border-emerald-600/30"
          >
            <div className="flex items-center space-x-2">
              <span>🛒</span>
              <span>Sang Quản lý đơn hàng</span>
            </div>
            <ArrowRight className="h-3 w-3 text-emerald-300" />
          </Link>
        </div>

        {/* Tree Menu QLSP Khớp Ảnh 2 */}
        <nav className="flex-1 px-2 py-3 space-y-1 text-xs">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider">
            Menu Kỹ Thuật
          </div>

          <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            Trang chủ
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            Cấu hình thông báo
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            Thuộc tính sản phẩm
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            <span>BOM/Routing</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </a>

          {/* Nhóm Yêu cầu thiết kế (Active) */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between px-3 py-2 text-white bg-emerald-900/70 rounded-lg font-bold">
              <span>Yêu cầu thiết kế</span>
              <ChevronDown className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div className="pl-4 space-y-1 pt-1">
              <a href="#" className="block px-3 py-1.5 text-gray-400 hover:text-white rounded-md">
                Yêu cầu từ bộ sưu tập
              </a>
              <Link
                href="/product-management/change-types"
                className="block px-3 py-1.5 bg-red-600/20 text-red-300 border border-red-500/40 rounded-md font-bold"
              >
                • Cấu hình loại thay đổi
              </Link>
              <a href="#" className="block px-3 py-1.5 text-gray-400 hover:text-white rounded-md">
                Yêu cầu từ khách hàng
              </a>
              <a href="#" className="block px-3 py-1.5 text-gray-400 hover:text-white rounded-md">
                Yêu cầu R&D Công nghệ
              </a>
            </div>
          </div>

          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            <span>Sketches 2D</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            Drawing No
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-emerald-900/50 rounded-lg font-medium">
            <span>Item</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </a>
        </nav>

        {/* User Profile Phó phòng */}
        <div className="p-3 border-t border-emerald-900 bg-[#06241c] flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
            VC
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-white block truncate leading-tight">Lê Văn Châu</span>
            <span className="text-[10px] text-amber-400 block leading-tight">Phó phòng Kỹ thuật</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <span className="text-gray-400">Yêu cầu thiết kế</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Cấu hình loại thay đổi
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/orders/config-product"
              className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-700" />
              <span>Xem Cấu hình sản phẩm tại QLĐH</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-4 flex-1 flex flex-col min-w-0">
          {/* Banner Thông Điệp Nghiệp Vụ Cốt Lõi (First Principles) */}
          <div className="bg-gradient-to-r from-red-50 via-amber-50 to-white rounded-xl border border-red-200 p-4 shadow-xs flex items-start space-x-3">
            <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h2 className="text-sm font-bold text-red-950 flex items-center space-x-2">
                <span>QUY CHUẨN KỸ THUẬT: CỜ ROUTING LÀ NGUỒN TẠO DRAWING VERSION CHO E-CATALOGUE</span>
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  Bắt buộc
                </span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Chỉ những loại thay đổi có cờ <strong className="text-red-700 font-bold">[Routing = TÍCH XANH]</strong> (như <span className="underline font-semibold">C - Đắp lacquer</span>, <span className="underline font-semibold">F - Thay Pearl sang Ball</span>, <span className="underline font-semibold">B - Cast</span>) mới làm thay đổi quy trình công nghệ Routing và bắt buộc đổi <strong>Mã Drawing</strong>. Đây là nguồn để hệ thống sinh <strong>Drawing Version</strong> cho E-Catalogue.
              </p>
              <div className="text-[11px] text-gray-500 pt-0.5">
                Các thay đổi không ảnh hưởng Routing (<span className="font-semibold">D - Thay Khóa</span>, <span className="font-semibold">H - Thay kích thước ball</span>, <span className="font-semibold">N - Thay màu dây</span>, đổi ni, màu xi...) giữ nguyên Mã Drawing gốc và không tạo version trên EC.
              </div>
            </div>
          </div>

          {/* Toolbar & Search Bar Khớp Ảnh 2 */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Danh sách Loại thay đổi
              </h1>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="px-3.5 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Thêm mới</span>
                </button>
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                  title="Tùy chỉnh cột"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                  title="Tải lại"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Input Search */}
            <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo Mã loại, Tên loại thay đổi, Ghi chú..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveHighlight(!activeHighlight)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeHighlight
                    ? "bg-red-100 text-red-800 border border-red-300 shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {activeHighlight ? "🔴 Đang làm nổi bật cột Routing" : "⚪ Tắt viền đỏ Routing"}
              </button>
            </div>
          </div>

          {/* Bảng Dữ Liệu Loại Thay Đổi Khớp Ảnh 2 */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="w-12 px-2 py-3 text-center">STT</th>
                    <th className="w-16 px-2 py-3 text-center">Mã loại</th>
                    <th className="px-3 py-3 min-w-[180px]">Tên loại thay đổi</th>
                    <th className="px-3 py-3 min-w-[200px]">Loại sản phẩm</th>
                    <th className="w-20 px-2 py-3 text-center">Thiết kế</th>
                    <th className="w-18 px-2 py-3 text-center">BOM</th>
                    
                    {/* CỘT ROUTING TRỌNG YẾU ĐƯỢC ĐÓNG KHUNG ĐỎ THEO ĐÚNG ẢNH 2 */}
                    <th className={`w-28 px-3 py-3 text-center transition-all ${
                      activeHighlight 
                        ? "bg-red-50 text-red-700 font-black border-2 border-red-500 shadow-sm" 
                        : "bg-gray-50 text-gray-700"
                    }`}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Routing</span>
                        <span className="text-[9px] bg-red-600 text-white px-1 rounded">HOT</span>
                      </div>
                    </th>

                    <th className="w-22 px-2 py-3 text-center">Hiện Admin</th>
                    <th className="w-22 px-2 py-3 text-center">Hiện Client</th>
                    <th className="px-3 py-3 min-w-[140px]">Phạm vi mở rộng</th>
                    <th className="w-20 px-2 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((ct, idx) => {
                    const isRoutingTrue = ct.routing;
                    return (
                      <tr 
                        key={ct.code} 
                        className={`hover:bg-gray-50/80 transition-colors ${
                          isRoutingTrue ? "bg-red-50/20" : ""
                        }`}
                      >
                        {/* STT */}
                        <td className="px-2 py-3 text-center font-medium text-gray-500">
                          {idx + 1}
                        </td>

                        {/* Mã loại */}
                        <td className="px-2 py-3 text-center font-bold text-gray-900 font-mono">
                          {ct.code}
                        </td>

                        {/* Tên loại thay đổi */}
                        <td className="px-3 py-3">
                          <div className="font-bold text-gray-900">{ct.name}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{ct.note}</div>
                        </td>

                        {/* Loại sản phẩm */}
                        <td className="px-3 py-3 text-gray-600 truncate max-w-[220px]">
                          {ct.productType}
                        </td>

                        {/* Thiết kế */}
                        <td className="px-2 py-3 text-center">
                          {ct.design ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <span className="text-gray-300 font-mono">---</span>
                          )}
                        </td>

                        {/* BOM */}
                        <td className="px-2 py-3 text-center">
                          {ct.bom ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <span className="text-gray-300 font-mono">---</span>
                          )}
                        </td>

                        {/* CỘT ROUTING TRỌNG TÂM */}
                        <td className={`px-3 py-3 text-center transition-all ${
                          activeHighlight ? "border-x-2 border-red-500 bg-red-50/40" : ""
                        }`}>
                          {isRoutingTrue ? (
                            <div className="flex flex-col items-center justify-center space-y-0.5">
                              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="h-4 w-4" />
                              </div>
                              <span className="text-[9px] font-black text-red-600 uppercase tracking-tighter">
                                Đổi Drawing!
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300 font-mono text-sm">---</span>
                          )}
                        </td>

                        {/* Hiện Admin */}
                        <td className="px-2 py-3 text-center">
                          {ct.showAdmin ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <span className="text-gray-300 font-mono">---</span>
                          )}
                        </td>

                        {/* Hiện Client */}
                        <td className="px-2 py-3 text-center">
                          {ct.showClient ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <span className="text-gray-300 font-mono">---</span>
                          )}
                        </td>

                        {/* Phạm vi mở rộng */}
                        <td className="px-3 py-3 text-gray-700 font-medium">
                          {ct.scope}
                        </td>

                        {/* Thao tác */}
                        <td className="px-2 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5 text-gray-400">
                            <button type="button" className="p-1 hover:text-emerald-700 rounded hover:bg-gray-100 cursor-pointer">
                              <Edit3 className="h-3.5 w-3.5 text-amber-600" />
                            </button>
                            <button type="button" className="p-1 hover:text-red-700 rounded hover:bg-gray-100 cursor-pointer">
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Phân trang */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
              <span>Hiển thị 1 - {filtered.length} trong tổng số {changeTypes.length} loại thay đổi</span>
              <div className="flex items-center space-x-1 text-xs font-semibold">
                <span className="px-2 py-1 bg-emerald-700 text-white rounded">1</span>
                <span className="text-gray-500 text-[11px] ml-2">10 / trang</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
