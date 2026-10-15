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
  ChevronDown,
  Bell
} from "lucide-react";
import { CHANGE_TYPES_CONFIG } from "@/data/productVersionConfigData";

export default function ProductManagementChangeTypesPage() {
  const [changeTypes] = useState(CHANGE_TYPES_CONFIG);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased overflow-hidden">
      {/* 1. Sidebar Quản lý sản phẩm duy nhất khớp chuẩn Ảnh 2 */}
      <aside className="w-60 bg-[#004737] text-white flex flex-col h-full overflow-y-auto shrink-0 text-xs">
        {/* Header Phân hệ QLSP */}
        <div className="h-16 px-4 border-b border-[#00382b] flex items-center justify-between shrink-0 bg-[#00382b]">
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Box className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block leading-none">
                Phân hệ ERP
              </span>
              <span className="text-sm font-bold text-white block truncate leading-tight mt-0.5">
                Quản lý sản phẩm
              </span>
            </div>
          </Link>
        </div>

        {/* Tree Menu QLSP Khớp chuẩn 100% Ảnh 2 */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Trang chủ
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Cấu hình thông báo
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Thuộc tính sản phẩm
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            <span>BOM/Routing</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
          </a>

          {/* Nhóm Yêu cầu thiết kế (Active) */}
          <div className="space-y-0.5 pt-1">
            <div className="flex items-center justify-between px-3 py-2 text-white bg-[#00382b] rounded-md font-semibold">
              <span>Yêu cầu thiết kế</span>
              <ChevronDown className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div className="pl-3 space-y-0.5 pt-0.5">
              <a href="#" className="block px-3 py-1.5 text-gray-300 hover:text-white rounded-md">
                Yêu cầu từ bộ sưu tập
              </a>
              <Link
                href="/product-management/change-types"
                className="block px-3 py-1.5 bg-red-600/30 text-white border border-red-500/50 rounded-md font-bold"
              >
                Cấu hình loại thay đổi
              </Link>
              <a href="#" className="block px-3 py-1.5 text-gray-300 hover:text-white rounded-md">
                Yêu cầu từ khách hàng
              </a>
              <a href="#" className="block px-3 py-1.5 text-gray-300 hover:text-white rounded-md">
                Yêu cầu R&D Công nghệ
              </a>
            </div>
          </div>

          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            <span>Sketches 2D</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Drawing No
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            <span>Item</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Khuôn
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Sample
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Nhu cầu đơn hàng
          </a>
        </nav>

        {/* Nút quay về Quản lý đơn hàng */}
        <div className="p-3 border-t border-[#00382b]">
          <Link
            href="/orders/config-product"
            className="flex items-center justify-center space-x-1.5 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-md font-medium transition-colors text-[11px]"
          >
            <span>← Quay về Quản lý đơn hàng</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar QLSP */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-gray-800">
              Quản lý sản phẩm
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-500 relative cursor-pointer">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                VC
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-800 leading-tight">Lê Văn Châu</span>
                <span className="text-[10px] text-gray-400 leading-tight">Phó phòng</span>
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung danh sách khớp 100% Ảnh 2 */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
            {/* Header Card: Tiêu đề & Nút Thêm mới, Lọc, Reload */}
            <div className="p-5 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Danh sách Loại thay đổi
              </h1>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="px-3.5 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm mới</span>
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
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm"
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50/60 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Bảng Dữ Liệu Khớp 100% Ảnh 2 với Cột Routing được đóng khung viền đỏ */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="w-12 px-2 py-3 text-center">STT</th>
                    <th className="w-16 px-2 py-3 text-center">Mã loại</th>
                    <th className="px-3 py-3 min-w-[180px]">Tên loại thay đổi</th>
                    <th className="px-3 py-3 min-w-[200px]">Loại sản phẩm</th>
                    <th className="w-20 px-2 py-3 text-center">Thiết kế</th>
                    <th className="w-18 px-2 py-3 text-center">BOM</th>
                    
                    {/* CỘT ROUTING ĐƯỢC ĐÓNG KHUNG ĐỎ THEO ĐÚNG ẢNH 2 */}
                    <th className="w-24 px-3 py-3 text-center border-2 border-red-500 bg-red-50/20 text-red-700 font-bold">
                      Routing
                    </th>

                    <th className="w-22 px-2 py-3 text-center">Hiện Admin</th>
                    <th className="w-22 px-2 py-3 text-center">Hiện Client</th>
                    <th className="px-3 py-3 min-w-[140px]">Phạm vi mở rộng</th>
                    <th className="w-20 px-2 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((ct, idx) => (
                    <tr key={ct.code} className="hover:bg-gray-50/70 transition-colors">
                      {/* STT */}
                      <td className="px-2 py-3 text-center font-medium text-gray-500">
                        {idx + 1}
                      </td>

                      {/* Mã loại */}
                      <td className="px-2 py-3 text-center font-bold text-gray-900 font-mono">
                        {ct.code}
                      </td>

                      {/* Tên loại thay đổi */}
                      <td className="px-3 py-3 font-medium text-gray-900">
                        {ct.name}
                      </td>

                      {/* Loại sản phẩm */}
                      <td className="px-3 py-3 text-gray-600 truncate max-w-[220px]">
                        {ct.productType}
                      </td>

                      {/* Thiết kế */}
                      <td className="px-2 py-3 text-center">
                        {ct.design ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* BOM */}
                      <td className="px-2 py-3 text-center">
                        {ct.bom ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Cột Routing viền đỏ khớp Ảnh 2 */}
                      <td className="px-3 py-3 text-center border-x-2 border-red-500 bg-red-50/10">
                        {ct.routing ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Hiện Admin */}
                      <td className="px-2 py-3 text-center">
                        {ct.showAdmin ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Hiện Client */}
                      <td className="px-2 py-3 text-center">
                        {ct.showClient ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Phạm vi mở rộng */}
                      <td className="px-3 py-3 text-gray-600">
                        {ct.scope}
                      </td>

                      {/* Thao tác */}
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-400">
                          <button type="button" className="hover:text-amber-600 cursor-pointer">
                            <Edit3 className="h-3.5 w-3.5 text-amber-600" />
                          </button>
                          <button type="button" className="hover:text-red-600 cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Phân trang */}
            <div className="bg-gray-50/80 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500">
              <span>Hiển thị 1 - {filtered.length} trong tổng số {changeTypes.length}</span>
              <div className="flex items-center space-x-1 font-medium">
                <span className="px-2 py-1 bg-emerald-800 text-white rounded font-bold">1</span>
                <span className="text-gray-500 text-[11px] ml-2">10 / trang</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
