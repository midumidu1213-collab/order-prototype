"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  User,
  Info
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { CUSTOMER_REQUESTS_MOCK } from "@/data/productVersionConfigData";

export default function CustomerRequestsPage() {
  const [requests] = useState(CUSTOMER_REQUESTS_MOCK);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        r.requestCode?.toLowerCase().includes(q) ||
        r.originalDrawing?.toLowerCase().includes(q) ||
        r.originalItem?.toLowerCase().includes(q) ||
        r.changeType?.toLowerCase().includes(q) ||
        r.requester?.toLowerCase().includes(q) ||
        r.newDrawing?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery, statusFilter]);

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-sans antialiased overflow-hidden">
      {/* 1. Sidebar Quản lý đơn hàng */}
      <Sidebar />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Breadcrumb */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <span className="text-gray-400">Yêu cầu khách hàng</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Danh sách yêu cầu khách hàng
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/orders/config-product"
              className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-700" />
              <span>Cấu hình sản phẩm (Duyệt lên EC)</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-4 flex-1 flex flex-col min-w-0">
          {/* Card Tiêu đề & Giải thích Luồng */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center space-x-2">
                  <span>Danh sách Yêu cầu khách hàng</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    Tiếp nhận chuyển giao Kỹ thuật QLSP
                  </span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Các yêu cầu thay đổi kỹ thuật từ khách hàng được gửi sang QLSP để cập nhật BOM/Routing. Nếu loại thay đổi ảnh hưởng Routing $\rightarrow$ Hệ thống sẽ sinh Mã Drawing mới (Version mới).
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href="/product-management/change-types"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <span>⚙️ Kiểm tra Cờ Routing tại QLSP</span>
                </Link>
              </div>
            </div>

            {/* Thanh Tìm Kiếm & Bộ Lọc Khớp Ảnh 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-gray-100">
              <button 
                type="button" 
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 flex items-center space-x-1.5 hover:bg-gray-50 cursor-pointer shrink-0"
              >
                <Filter className="h-3.5 w-3.5 text-gray-500" />
                <span>Bộ lọc</span>
              </button>

              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo Mã yêu cầu, Mã đơn, Mã Drawing"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400"
                />
              </div>

              {/* Status Chips */}
              <div className="flex items-center space-x-1 shrink-0 text-xs">
                {["ALL", "Chờ xử lý", "Chờ thiết kế", "Đang xử lý", "Hoàn thành"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      statusFilter === st
                        ? "bg-[#005a46] text-white font-bold"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {st === "ALL" ? "Tất cả" : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bảng Danh Sách Yêu Cầu Khách Hàng Khớp Ảnh 1 */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="w-12 px-2 py-3 text-center">STT</th>
                    <th className="px-3 py-3 min-w-[140px]">Mã yêu cầu kỹ thuật</th>
                    <th className="px-3 py-3 min-w-[130px]">Mã Drawing gốc</th>
                    <th className="px-3 py-3 min-w-[260px]">Mã Item gốc</th>
                    <th className="px-3 py-3 min-w-[180px]">Loại thay đổi</th>
                    <th className="px-3 py-3 min-w-[150px]">Người yêu cầu</th>
                    <th className="px-3 py-3 min-w-[130px]">Ngày tạo</th>
                    <th className="px-3 py-3 min-w-[120px] text-center">Trạng thái</th>
                    <th className="px-3 py-3 min-w-[140px]">Mã Drawing mới</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400 text-xs">
                        Không tìm thấy yêu cầu nào phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req, idx) => (
                      <tr key={req.requestCode} className="hover:bg-gray-50/80 transition-colors">
                        {/* STT */}
                        <td className="px-2 py-3 text-center font-medium text-gray-500">
                          {idx + 1}
                        </td>

                        {/* Mã YCKT */}
                        <td className="px-3 py-3">
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {req.requestCode}
                          </span>
                        </td>

                        {/* Mã Drawing gốc */}
                        <td className="px-3 py-3 font-mono font-semibold text-gray-800">
                          {req.originalDrawing}
                        </td>

                        {/* Mã Item gốc */}
                        <td className="px-3 py-3">
                          <div className="font-mono text-[11px] text-gray-900 break-all">
                            {req.originalItem}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {req.notes}
                          </div>
                        </td>

                        {/* Loại thay đổi */}
                        <td className="px-3 py-3">
                          <div className="font-semibold text-gray-800 flex items-center space-x-1.5">
                            <span>{req.changeType}</span>
                            {req.affectsRouting && (
                              <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded border border-red-200 shrink-0">
                                Đổi Routing
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Người yêu cầu */}
                        <td className="px-3 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                              {req.requester.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{req.requester}</span>
                          </div>
                        </td>

                        {/* Ngày tạo */}
                        <td className="px-3 py-3 text-gray-500 font-mono text-[11px]">
                          {req.createdAt}
                        </td>

                        {/* Trạng thái */}
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${req.statusBadge}`}>
                            • {req.status}
                          </span>
                        </td>

                        {/* Mã Drawing mới */}
                        <td className="px-3 py-3">
                          {req.newDrawing !== "---" ? (
                            <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {req.newDrawing}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-mono">---</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Phân trang */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
              <span>Hiển thị 1 - {filteredRequests.length} trong tổng số {requests.length} yêu cầu</span>
              <div className="flex items-center space-x-1 text-xs font-semibold">
                <span className="px-2 py-1 bg-emerald-700 text-white rounded">1</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">2</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">3</span>
                <span className="text-gray-500 text-[11px] ml-2">20 / trang</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
