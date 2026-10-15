"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  User
} from "lucide-react";
import { CUSTOMER_REQUESTS_MOCK } from "@/data/productVersionConfigData";

export default function CustomerRequestsPage() {
  const [requests] = useState(CUSTOMER_REQUESTS_MOCK);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const q = searchQuery.toLowerCase().trim();
    return requests.filter((r) => {
      return (
        r.requestCode?.toLowerCase().includes(q) ||
        r.orderCode?.toLowerCase().includes(q) ||
        r.customerName?.toLowerCase().includes(q) ||
        r.originalDrawing?.toLowerCase().includes(q) ||
        r.originalItem?.toLowerCase().includes(q) ||
        r.fullOriginalItem?.toLowerCase().includes(q) ||
        r.changeType?.toLowerCase().includes(q) ||
        r.requester?.toLowerCase().includes(q) ||
        r.newDrawing?.toLowerCase().includes(q) ||
        r.newItemCode?.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb chuẩn khớp Video thực tế */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <span>Yêu cầu khách hàng</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-700 font-semibold">Danh sách yêu cầu khách hàng</span>
      </div>

      {/* Card chính: Tiêu đề, Thanh Search & Bảng khớp chuẩn 100% Video */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Tiêu đề trang */}
        <div className="px-5 pt-4 pb-2">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Danh sách Yêu cầu khách hàng
          </h1>
        </div>

        {/* Thanh công cụ: Nút Bộ lọc & Input Search */}
        <div className="px-5 py-3 flex items-center space-x-3 border-b border-gray-100">
          <button 
            type="button" 
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 flex items-center space-x-1.5 hover:bg-gray-50 cursor-pointer shrink-0"
          >
            <Filter className="h-3.5 w-3.5 text-gray-500" />
            <span>Bộ lọc</span>
          </button>

          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo Mã yêu cầu, Mã đơn, Mã Drawing"
              className="w-full pl-9 pr-4 py-2 bg-gray-50/60 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Bảng Danh Sách Yêu Cầu Khách Hàng - ĐẦY ĐỦ TẤT CẢ CÁC TRƯỜNG THỰC TẾ TỪ VIDEO */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="w-12 px-2 py-3 text-center">STT</th>
                <th className="px-3 py-3 min-w-[130px]">Mã yêu cầu kỹ thuật</th>
                <th className="px-3 py-3 min-w-[110px]">Mã đơn hàng</th>
                <th className="px-3 py-3 min-w-[160px]">Tên khách hàng</th>
                <th className="px-3 py-3 min-w-[120px]">Mã Drawing gốc</th>
                <th className="px-3 py-3 min-w-[200px]">Mã Item gốc</th>
                <th className="px-3 py-3 min-w-[130px]">Loại thay đổi</th>
                <th className="px-3 py-3 min-w-[140px]">Người yêu cầu</th>
                <th className="px-3 py-3 min-w-[120px]">Ngày tạo</th>
                <th className="px-3 py-3 min-w-[110px] text-center">Trạng thái</th>
                <th className="px-3 py-3 min-w-[120px]">Mã Drawing mới</th>
                <th className="px-3 py-3 min-w-[220px]">Mã Item mới</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-400 text-xs">
                    Không tìm thấy yêu cầu nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, idx) => (
                  <tr key={req.requestCode} className="hover:bg-gray-50/80 transition-colors">
                    {/* 1. STT */}
                    <td className="px-2 py-3 text-center font-medium text-gray-500">
                      {idx + 1}
                    </td>

                    {/* 2. Mã YCKT */}
                    <td className="px-3 py-3 font-mono font-medium text-gray-900">
                      {req.requestCode}
                    </td>

                    {/* 3. Mã đơn hàng (mới từ video) */}
                    <td className="px-3 py-3 font-mono text-gray-700">
                      {req.orderCode !== "---" ? (
                        <span className="text-emerald-800 font-semibold">{req.orderCode}</span>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>

                    {/* 4. Tên khách hàng (mới từ video) */}
                    <td className="px-3 py-3 text-gray-800 font-medium truncate max-w-[180px]">
                      {req.customerName}
                    </td>

                    {/* 5. Mã Drawing gốc */}
                    <td className="px-3 py-3 font-mono font-medium text-gray-900">
                      {req.originalDrawing}
                    </td>

                    {/* 6. Mã Item gốc */}
                    <td className="px-3 py-3 font-mono text-[11px] text-gray-800 break-all">
                      {req.originalItem}
                    </td>

                    {/* 7. Loại thay đổi */}
                    <td className="px-3 py-3 font-medium text-gray-800">
                      {req.changeType}
                    </td>

                    {/* 8. Người yêu cầu */}
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                          {req.requester.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{req.requester}</span>
                      </div>
                    </td>

                    {/* 9. Ngày tạo */}
                    <td className="px-3 py-3 text-gray-600 font-mono text-[11px]">
                      {req.createdAt}
                    </td>

                    {/* 10. Trạng thái */}
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center space-x-1.5 text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full ${
                          req.status === "Hoàn thành" 
                            ? "bg-emerald-600" 
                            : req.status === "Đang xử lý" 
                            ? "bg-blue-600" 
                            : req.status === "Chờ thiết kế"
                            ? "bg-amber-500"
                            : "bg-gray-400"
                        }`} />
                        <span className="text-gray-700">{req.status}</span>
                      </span>
                    </td>

                    {/* 11. Mã Drawing mới */}
                    <td className="px-3 py-3 font-mono text-gray-700">
                      {req.newDrawing}
                    </td>

                    {/* 12. Mã Item mới (mới từ video) */}
                    <td className="px-3 py-3 font-mono text-[11px] text-gray-900 break-all">
                      {req.newItemCode !== "---" ? (
                        <span className="text-blue-900 font-medium">{req.newItemCode}</span>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Phân trang */}
        <div className="bg-gray-50/80 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500">
          <span>Hiển thị 1 - {filteredRequests.length} trong tổng số {requests.length}</span>
          <div className="flex items-center space-x-1 font-medium">
            <span className="px-2 py-1 bg-emerald-800 text-white rounded font-bold">1</span>
            <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">2</span>
            <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">3</span>
            <span className="text-gray-500 text-[11px] ml-2">20 / trang</span>
          </div>
        </div>
      </div>
    </div>
  );
}
