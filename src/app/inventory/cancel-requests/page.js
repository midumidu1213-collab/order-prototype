"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Boxes,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  ArrowRightLeft,
  AlertCircle,
  Eye,
  FileText,
  AlertTriangle,
  Truck,
  RefreshCw,
  Lock
} from "lucide-react";
import InventorySidebar from "@/components/inventory/InventorySidebar";
import { MOCK_WAREHOUSE_CANCEL_REQUESTS } from "@/data/inventoryMockData";

export default function WarehouseCancelRequestsPage() {
  const [requests, setRequests] = useState(MOCK_WAREHOUSE_CANCEL_REQUESTS);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReq, setSelectedReq] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filter & Search
  const filteredRequests = useMemo(() => {
    let list = [...requests];
    if (activeTab === "pending") {
      list = list.filter((r) => r.status === "Chờ chuyển kho CXLL");
    } else if (activeTab === "completed") {
      list = list.filter((r) => r.status === "Đã chuyển vào Kho CXLL");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.cancelReqCode.toLowerCase().includes(q) ||
          r.baseRequestId.toLowerCase().includes(q) ||
          r.soCode.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.itemCode.toLowerCase().includes(q) ||
          r.itemName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, activeTab, searchQuery]);

  // Đếm số lượng chờ chuyển
  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "Chờ chuyển kho CXLL").length;
  }, [requests]);

  // Xử lý mở modal chuyển kho (CHỐT CHẶN BẮT BUỘC CHECK DO)
  const handleOpenTransferModal = (req) => {
    // 1. Kiểm tra chốt chặn Hóa đơn điện tử (Accounting Gate)
    if (req.hasInvoice && !req.accountingConfirmed) {
      setErrorMessage(
        `⚠️ Chốt Chặn Kế Toán (Accounting Gate): Đơn hàng đã xuất hóa đơn điện tử (${req.invoiceCode}). Bắt buộc Kế toán hoàn tất biên bản hủy/điều chỉnh HĐ điện tử ký 2 bên trước khi chuyển kho!`
      );
      setTimeout(() => setErrorMessage(""), 6000);
      return;
    }

    // 2. Kiểm tra chốt chặn Phiếu giao hàng (DO Check - BẮT BUỘC THEO QUY CHUẨN MỚI)
    // Nếu item có Phiếu giao hàng nhưng User Đóng gói CHƯA sửa/hủy DO -> BÁO LỖI VÀ CHẶN CHUYỂN KHO!
    const hasActiveUnmodifiedDO = req.doCode && req.doCode !== "—" && !req.doUpdatedByUser;
    if (hasActiveUnmodifiedDO) {
      setErrorMessage(
        `❌ LỖI RÀNG BUỘC (DO CHECK): Không thể chuyển sang Kho CXLL! Item này vẫn đang nằm trên Phiếu giao hàng ${req.doCode} chưa được điều chỉnh. Yêu cầu bộ phận Đóng gói chỉnh sửa hoặc hủy Phiếu giao hàng trước!`
      );
      setTimeout(() => setErrorMessage(""), 7500);
      return;
    }

    // Hợp lệ: Không thuộc DO nào hoặc User Đóng gói đã cập nhật DO -> Cho phép mở modal chuyển kho
    setErrorMessage("");
    setSelectedReq(req);
    setIsConfirmModalOpen(true);
  };

  // Xác nhận chuyển kho sang CXLL (Tồn khả dụng = SL đã hủy)
  const handleConfirmTransfer = () => {
    if (!selectedReq) return;
    const nowStr =
      new Date().toLocaleDateString("vi-VN") +
      " " +
      new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: "Đã chuyển vào Kho CXLL",
              transferredAt: nowStr
            }
          : r
      )
    );

    setIsConfirmModalOpen(false);
    setToastMessage(
      `Đã chuyển thành công ${selectedReq.cancelQty} SP thuộc đơn ${selectedReq.soCode} sang Danh Sách Chờ Xử Lý Lại (Kho CXLL). Ghi nhận Tồn khả dụng = ${selectedReq.cancelQty} SP (Sẵn sàng pick chọn cho đơn mới)!`
    );

    setTimeout(() => {
      setToastMessage("");
    }, 5500);
  };

  // Xử lý User Đóng Gói cập nhật / hủy Phiếu giao hàng (DO)
  const handlePackingUserUpdateDO = (reqId) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              doUpdatedByUser: true,
              deliveryOrderStatus: `User Đóng gói đã hủy dòng hàng trên ${r.doCode}`
            }
          : r
      )
    );
    setToastMessage(
      "User (Đóng Gói) đã hoàn tất chỉnh sửa/hủy dòng hàng trên Phiếu giao hàng! Kho Thành Phẩm hiện đã đủ điều kiện chuyển hàng sang Kho CXLL."
    );
    setTimeout(() => {
      setToastMessage("");
    }, 5000);
  };

  // Xử lý Kế toán xác nhận hủy hóa đơn điện tử (Accounting Gate)
  const handleAccountingConfirm = (reqId) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              accountingConfirmed: true,
              deliveryOrderStatus: "Kế toán đã duyệt biên bản hủy HĐ (Ký 2 bên)"
            }
          : r
      )
    );
    setToastMessage(
      "Kế toán đã hoàn tất biên bản điều chỉnh/hủy HĐ điện tử ký 2 bên (Theo NĐ 123/2020/NĐ-CP)! Kho Thành Phẩm được mở khóa chuyển hàng sang Kho CXLL."
    );
    setTimeout(() => {
      setToastMessage("");
    }, 5000);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 overflow-hidden">
      {/* 1. Sidebar Kho Thành Phẩm */}
      <InventorySidebar />

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Kho Thành Phẩm</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>KHO THÀNH PHẨM (FG)</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-bold text-slate-800">Tiếp Nhận YC Hủy SO & Chuyển Kho CXLL</span>
            {pendingCount > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                {pendingCount} YC Chờ Chuyển
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/inventory/reprocess"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-teal-600" />
              <span>Xem DS Chờ Xử Lý Lại (CXLL)</span>
            </Link>
          </div>
        </header>

        {/* Toast Notification (Success) */}
        {toastMessage && (
          <div className="bg-emerald-700 text-white px-6 py-3 text-xs font-semibold flex items-center justify-between shadow-md transition-all animate-in slide-in-from-top">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{toastMessage}</span>
            </div>
            <Link
              href="/inventory/reprocess"
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold underline transition-colors"
            >
              Xem ngay trong Kho CXLL →
            </Link>
          </div>
        )}

        {/* Error Notification (DO Check & Accounting Gate) */}
        {errorMessage && (
          <div className="bg-rose-700 text-white px-6 py-3.5 text-xs font-semibold flex items-center justify-between shadow-lg transition-all animate-in slide-in-from-top border-b-2 border-rose-900">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0 animate-bounce" />
              <span className="font-bold">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="text-white/80 hover:text-white px-2 py-0.5 rounded text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Header Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">
                    Tiếp Nhận Yêu Cầu Hủy SO & Chuyển Kho CXLL (Đã Duyệt Base)
                  </h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Chốt Chặn Kiểm Tra DO Tại Kho</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kho tiếp nhận yêu cầu hủy đơn đã duyệt từ Base. <strong>Ràng buộc cốt lõi:</strong> Khi Thủ kho bấm [Chuyển sang CXLL], hệ thống <strong>bắt buộc kiểm tra xem item có còn thuộc Phiếu giao hàng nào không</strong>. Nếu còn nằm trên DO chưa sửa → <strong>Báo lỗi và chặn chuyển</strong>; nếu đã sửa DO hoặc chưa lập DO → Cho phép chuyển vào Kho CXLL với <strong>Tồn khả dụng = SL đã hủy</strong>.
                </p>
              </div>

              {/* Thống kê nhanh */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-center">
                  <span className="text-[11px] text-amber-800 font-medium block">Chờ chuyển</span>
                  <span className="text-lg font-black text-amber-900 font-mono">{pendingCount}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-center">
                  <span className="text-[11px] text-emerald-800 font-medium block">Đã chuyển</span>
                  <span className="text-lg font-black text-emerald-900 font-mono">
                    {requests.filter((r) => r.status === "Đã chuyển vào Kho CXLL").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Bộ Lọc & Tìm Kiếm */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tất cả ({requests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pending")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === "pending" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Clock className="h-3 w-3 text-amber-600" />
                  <span>Chờ chuyển ({pendingCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("completed")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === "completed" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Đã chuyển ({requests.length - pendingCount})</span>
                </button>
              </div>

              {/* Ô Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo Mã YCH, Mã SO, Khách hàng, Item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Bảng Danh Sách YC Hủy */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[11px] tracking-wider whitespace-nowrap">
                    <tr>
                      <th className="px-3 py-3 text-center w-12">STT</th>
                      <th className="px-3 py-3">Mã YC Hủy</th>
                      <th className="px-3 py-3 text-center">Phê Duyệt Base</th>
                      <th className="px-3 py-3">Mã SO</th>
                      <th className="px-4 py-3">Khách Hàng</th>
                      <th className="px-3 py-3">Mã Item</th>
                      <th className="px-4 py-3">Chủng Loại</th>
                      <th className="px-3 py-3 text-center">Mã Drawing</th>
                      <th className="px-3 py-3 text-center">Lô Bag Tồn</th>
                      <th className="px-3 py-3 text-center">SL Hủy</th>
                      <th className="px-3 py-3">Trạng Thái DO / Hóa Đơn</th>
                      <th className="px-3 py-3 text-center">Trạng Thái Kho</th>
                      <th className="px-3 py-3 text-center w-40">Thao Tác Thủ Kho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="px-4 py-8 text-center text-slate-400">
                          Không tìm thấy yêu cầu hủy đơn hàng nào phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req, idx) => {
                        const isPending = req.status === "Chờ chuyển kho CXLL";

                        return (
                          <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* STT */}
                            <td className="px-3 py-3 text-center font-mono font-bold text-slate-400">
                              {idx + 1}
                            </td>

                            {/* Mã YC Hủy */}
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className="font-mono font-bold text-slate-900 block">
                                {req.cancelReqCode}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                Duyệt: {req.approvedDate}
                              </span>
                            </td>

                            {/* Phê Duyệt Base */}
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs inline-flex items-center space-x-1">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Đã duyệt</span>
                              </span>
                            </td>

                            {/* Mã SO */}
                            <td className="px-3 py-3 whitespace-nowrap font-mono font-black text-slate-900 text-xs">
                              {req.soCode}
                            </td>

                            {/* Khách Hàng */}
                            <td className="px-4 py-3 text-xs text-slate-800 font-medium">
                              {req.customerName}
                            </td>

                            {/* Mã Item */}
                            <td className="px-3 py-3 font-mono font-bold text-slate-900 text-xs select-all">
                              {req.itemCode}
                            </td>

                            {/* Chủng Loại */}
                            <td className="px-4 py-3 text-xs text-slate-800 font-medium whitespace-nowrap">
                              {req.itemName}
                            </td>

                            {/* Mã Drawing */}
                            <td className="px-3 py-3 text-center font-mono font-bold text-slate-700 text-xs whitespace-nowrap">
                              {req.drawingCode}
                            </td>

                            {/* Lô Bag Tồn */}
                            <td className="px-3 py-3 text-center font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                              {req.stockBagCode}
                            </td>

                            {/* SL Hủy */}
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span className="font-mono font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md text-xs inline-block">
                                -{req.cancelQty} SP
                              </span>
                            </td>

                            {/* Trạng Thái Phiếu Giao Hàng DO & Hóa Đơn */}
                            <td className="px-3 py-3 whitespace-nowrap">
                              {req.hasInvoice ? (
                                <div className="space-y-1">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-purple-600" />
                                    <span>Đã lập HĐ ({req.invoiceCode || "HĐ"})</span>
                                  </span>
                                  {req.accountingConfirmed ? (
                                    <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                      <span>Kế toán đã duyệt hủy HĐ (Ký 2 bên)</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                                      <Lock className="h-2.5 w-2.5 text-rose-600" />
                                      <span>Chốt chặn KT: Chờ ký BB hủy HĐ</span>
                                    </span>
                                  )}
                                </div>
                              ) : req.doCode && req.doCode !== "—" ? (
                                <div className="space-y-1">
                                  {req.doUpdatedByUser ? (
                                    <div>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                        <span>User Đóng gói đã hủy dòng trên DO</span>
                                      </span>
                                      <span className="text-[10px] text-slate-500 block font-mono">
                                        Phiếu: {req.doCode}
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="flex items-center space-x-1">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                          Phiếu: {req.doCode}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                                          Chưa sửa DO
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handlePackingUserUpdateDO(req.id)}
                                        className="mt-1 px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded text-[10px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                                        title="Mô phỏng: User Đóng gói nhận thông báo và vào sửa/hủy DO"
                                      >
                                        <Truck className="h-2.5 w-2.5 text-sky-600" />
                                        <span>⚡ User Đóng gói sửa/hủy DO</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-slate-500" />
                                  <span>Chưa lập DO (Sẵn sàng)</span>
                                </span>
                              )}
                            </td>

                            {/* Trạng Thái Kho */}
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              {isPending ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-amber-700 animate-pulse" />
                                  <span>Chờ chuyển</span>
                                </span>
                              ) : (
                                <div>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center space-x-1">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                                    <span>Đã chuyển</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                                    {req.transferredAt}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Thao Tác Thủ Kho (Bắt Buộc Check DO & Accounting Gate) */}
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              {isPending ? (
                                req.hasInvoice && !req.accountingConfirmed ? (
                                  <div className="flex flex-col items-center gap-1.5">
                                    <button
                                      type="button"
                                      disabled
                                      className="px-2.5 py-1 bg-slate-200 text-slate-400 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-not-allowed border border-slate-300"
                                      title="Khóa: Cần Kế toán xác nhận biên bản hủy hóa đơn điện tử theo NĐ 123/2020 trước khi chuyển kho"
                                    >
                                      <Lock className="h-3 w-3 text-slate-400" />
                                      <span>Khóa: Chờ Kế toán</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAccountingConfirm(req.id)}
                                      className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded text-[10px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                                      title="Mô phỏng thao tác: Kế toán bấm xác nhận đã ký biên bản hủy HĐ điện tử"
                                    >
                                      <FileText className="h-2.5 w-2.5 text-purple-600" />
                                      <span>Mô phỏng KT duyệt HĐ</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenTransferModal(req)}
                                    className="px-3 py-1.5 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
                                    title="Chuyển sang Kho CXLL (Hệ thống tự động kiểm tra: nếu còn thuộc DO chưa sửa sẽ báo lỗi và chặn chuyển)"
                                  >
                                    <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-300" />
                                    <span>Chuyển sang CXLL</span>
                                  </button>
                                )
                              ) : (
                                <Link
                                  href="/inventory/reprocess"
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1 mx-auto"
                                >
                                  <span>Xem ở Kho CXLL</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ghi chú quy trình nghiệp vụ chuẩn theo đề xuất mới */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start space-x-3">
              <AlertCircle className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5 text-emerald-950">
                  Quy Trình Kiểm Tra & Chuyển Hàng Sang Kho Chờ Xử Lý Lại (CXLL) Chuẩn:
                </strong>
                <p className="text-emerald-800 leading-relaxed">
                  1. <strong>Kinh doanh (QLĐH) yêu cầu hủy đơn:</strong> QLĐH lập yêu cầu hủy đơn trên hệ thống một cách tinh giản (không phải sửa DO thủ công).<br />
                  2. <strong>Khi yêu cầu được duyệt qua Base:</strong> Đơn hàng tự động cập nhật SL còn - SL hủy; đồng thời hệ thống gửi thông báo đến <strong>User Đóng Gói</strong> (để cập nhật/hủy Phiếu giao hàng) và gửi thông báo đến <strong>Kho Thành Phẩm</strong> (để chuyển các item bị hủy sang DS CXLL).<br />
                  3. <strong>Chốt chặn kiểm tra DO tại Kho Thành Phẩm:</strong> Khi Thủ kho bấm [Chuyển sang CXLL], hệ thống <strong>bắt buộc kiểm tra item có còn thuộc Phiếu giao hàng nào không</strong>. Nếu có → Báo lỗi và chặn chuyển! Chỉ khi User Đóng gói đã chỉnh sửa/hủy DO (hoặc đơn chưa lập DO) thì Kho mới được phép chuyển.<br />
                  4. <strong>Ghi nhận Kho CXLL & Luồng chuyển đơn:</strong> Khi chuyển thành công, <strong>Item ghi nhận Tồn khả dụng = SL đã hủy trong DS CXLL</strong> và sẵn sàng pick chọn cho các đơn hàng mới.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* POPUP XÁC NHẬN CHUYỂN KHO CXLL */}
      {isConfirmModalOpen && selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Xác Nhận Chuyển SL SO Sang Kho Chờ Xử Lý Lại
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-md text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã YC Hủy:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReq.cancelReqCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phê duyệt Base:</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedReq.baseRequestId} (Đã Duyệt)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đơn hàng gốc:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReq.soCode} — {selectedReq.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sản phẩm:</span>
                  <span className="font-bold text-slate-800">{selectedReq.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số lượng chuyển:</span>
                  <span className="font-mono font-black text-rose-600 text-sm">{selectedReq.cancelQty} Sản Phẩm</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Tình trạng DO:</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedReq.deliveryOrderStatus || "Chưa lập DO (Hợp lệ)"}
                  </span>
                </div>
                {selectedReq.hasInvoice && (
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-500">Hóa đơn điện tử:</span>
                    <span className="font-bold text-purple-800">
                      {selectedReq.invoiceCode} ({selectedReq.accountingConfirmed ? "Đã ký biên bản hủy" : "Chờ Kế toán"})
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-700 block uppercase font-bold">Từ Vị Trí Hiện Tại</span>
                  <strong className="text-xs text-amber-950 font-mono mt-0.5 block">{selectedReq.currentLocation}</strong>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-[10px] text-teal-700 block uppercase font-bold">Vào Vị Trí Đích</span>
                  <strong className="text-xs text-teal-950 font-mono mt-0.5 block">{selectedReq.reworkLocationTarget}</strong>
                </div>
              </div>

              <p className="text-slate-600 italic text-[11px] bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                Lưu ý: Sau khi xác nhận chuyển, số lượng hủy của đơn SO sẽ được trừ khỏi tồn kho thành phẩm thương mại và chuyển sang trạng thái Chờ xử lý lại (CXLL).
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="px-5 py-2 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Xác nhận chuyển sang Kho CXLL</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
