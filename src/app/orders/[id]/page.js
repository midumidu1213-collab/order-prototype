"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Warehouse, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  RotateCcw, 
  Eye, 
  Send, 
  FileText, 
  Check, 
  Printer, 
  Download,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { getOrderById, ALLOWED_SYNC_STATUSES, INITIAL_ORDERS } from "@/data/ordersData";
import { findMatchingWarehouseItems } from "@/data/warehouseStockData";
import WarehouseSyncPopup from "@/components/orders/WarehouseSyncPopup";

export default function OrderDetailPage({ params }) {
  // Unwrap params trong Next.js 15/16
  const resolvedParams = use(params);
  const orderId = resolvedParams?.id || "2";

  // Lấy đơn hàng từ data, nếu không tìm thấy fallback về đơn số 2 (SO2608002 - Chờ Kỹ thuật)
  const initialOrder = useMemo(() => {
    return getOrderById(orderId) || INITIAL_ORDERS[1];
  }, [orderId]);

  // State quản lý đơn hàng hiện tại
  const [order, setOrder] = useState(initialOrder);

  // Kiểm tra trạng thái có được phép đồng bộ kho hay không
  // Chỉ áp dụng: Chờ Kỹ thuật, Đủ thông tin KT, Chờ xác nhận (Chờ duyệt)
  const isSyncAllowed = ALLOWED_SYNC_STATUSES.includes(order.status);

  // Quét danh sách các mặt hàng trong kho khớp 100% với đơn hàng này
  const matchedStockList = useMemo(() => {
    if (!order.items) return [];
    let allMatches = [];
    order.items.forEach((item) => {
      const matches = findMatchingWarehouseItems({
        itemCode: item.itemCode,
        goldType: item.goldType || order.gold,
        size: item.size,
        stoneColor: item.stoneColor
      });
      allMatches = [...allMatches, ...matches];
    });
    return allMatches;
  }, [order]);

  // State điều khiển popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // State hiển thị banner gợi ý sau khi bấm kiểm tra đồng bộ
  const [showSyncSuggestionBanner, setShowSyncSuggestionBanner] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState("");

  // Thao tác khi bấm nút Đồng bộ
  const handleTriggerSync = () => {
    if (!isSyncAllowed) return;

    if (matchedStockList.length > 0) {
      setShowSyncSuggestionBanner(true);
      setIsPopupOpen(true); // Mở ngay popup chi tiết theo yêu cầu của user
    } else {
      setSyncToastMessage("Không tìm thấy sản phẩm trong Kho Thành Phẩm khớp 100% với đơn hàng.");
      setTimeout(() => setSyncToastMessage(""), 4000);
    }
  };

  // Xác nhận pick chọn từ popup
  const handleConfirmPick = (pickQuantities) => {
    // Cập nhật lại các dòng sản phẩm trong đơn hàng
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((item) => {
        // Tìm số lượng pick tương ứng với item này
        let pickedForThisItem = 0;
        let matchedStockItem = null;

        matchedStockList.forEach((stock) => {
          if (stock.itemCode?.toLowerCase() === item.itemCode?.toLowerCase()) {
            const picked = pickQuantities[stock.id] || 0;
            if (picked > 0) {
              pickedForThisItem += picked;
              matchedStockItem = stock;
            }
          }
        });

        if (pickedForThisItem > 0 && matchedStockItem) {
          const newProd = Math.max(0, item.qty - pickedForThisItem);
          return {
            ...item,
            sourceType: newProd === 0 ? "WAREHOUSE_REWORK" : "SPLIT_ALLOCATION",
            qtyFromStock: pickedForThisItem,
            qtyNewProduction: newProd,
            assignedStock: matchedStockItem,
            stoneHoldStatus: "PARTIALLY_RELEASED",
            note: `Đã pick ${pickedForThisItem} món từ Kho TP (${matchedStockItem.bagCode} - SO cũ: ${matchedStockItem.oldOrderCode})`
          };
        }
        return item;
      });

      return {
        ...prevOrder,
        items: updatedItems,
        note: `Đã đồng bộ tồn kho: Lấy từ Kho TP chờ xử lý lại`
      };
    });

    setIsPopupOpen(false);
    setShowSyncSuggestionBanner(false);
    setSyncToastMessage("Đã đồng bộ và pick chọn thành công sản phẩm từ Kho Thành Phẩm vào đơn hàng!");
    setTimeout(() => setSyncToastMessage(""), 5000);
  };

  // Hủy đồng bộ kho trên dòng hàng
  const handleRevertItem = (stt) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) => {
        if (it.stt === stt) {
          return {
            ...it,
            sourceType: "NEW_PRODUCTION",
            qtyFromStock: 0,
            qtyNewProduction: it.qty,
            assignedStock: null,
            stoneHoldStatus: "HELD_FOR_PRODUCTION",
            note: "-"
          };
        }
        return it;
      })
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Chờ cập nhật": return "text-gray-700 bg-gray-100 border-gray-300";
      case "Chờ Kỹ thuật": return "text-yellow-800 bg-yellow-100 border-yellow-300";
      case "Đủ thông tin KT": return "text-blue-800 bg-blue-100 border-blue-300";
      case "Chờ xác nhận": return "text-orange-800 bg-orange-100 border-orange-300";
      case "Đã chuyển KHSX": return "text-indigo-800 bg-indigo-100 border-indigo-300";
      case "Đang SX": return "text-purple-800 bg-purple-100 border-purple-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  // Tính tổng số lượng lấy từ kho
  const totalStockPicked = order.items?.reduce((acc, i) => acc + (i.qtyFromStock || 0), 0) || 0;

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Toast thông báo */}
      {syncToastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005a46] text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
          <span>{syncToastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-800 flex items-center font-medium">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Danh sách đơn hàng
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Chi tiết đơn hàng {order.code}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/orders/warehouse-picker"
            className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-200 transition-colors flex items-center"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-600" />
            Xem Prototype mô phỏng
          </Link>
        </div>
      </div>

      {/* Header Đơn Hàng */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <FileText className="h-6 w-6 text-[#005a46]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-gray-900 font-mono">{order.code}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                {totalStockPicked > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Đã gán {totalStockPicked} món từ Kho TP
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Khách hàng: <strong className="text-gray-900">{order.customer}</strong> • Nhóm: {order.team}
              </p>
            </div>
          </div>

          {/* Action Bar Header */}
          <div className="flex items-center space-x-2.5">
            {/* NÚT ĐỒNG BỘ TỒN KHO THÀNH PHẨM (CHỈ CHO PHÉP Ở 3 TRẠNG THÁI) */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleTriggerSync}
                disabled={!isSyncAllowed}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  isSyncAllowed
                    ? "bg-[#005a46] hover:bg-[#004737] text-white ring-2 ring-emerald-400/40"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
              >
                <Warehouse className="h-4 w-4" />
                <span>Đồng bộ tồn kho TP</span>
                {isSyncAllowed && matchedStockList.length > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {matchedStockList.length}
                  </span>
                )}
              </button>

              {/* Tooltip giải thích trạng thái nếu không được phép */}
              {!isSyncAllowed && (
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-30">
                  <span className="font-bold text-amber-400 flex items-center mb-0.5">
                    <ShieldAlert className="h-3 w-3 mr-1" /> Không thể đồng bộ
                  </span>
                  <span>Chỉ áp dụng khi đơn hàng ở trạng thái: <strong>Chờ kỹ thuật, Đủ thông tin kỹ thuật, Chờ duyệt</strong>.</span>
                </div>
              )}
            </div>

            <button className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Printer className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Thông tin thuộc tính đơn hàng */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Loại đơn hàng</span>
            <span className="font-bold text-slate-800">{order.type}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tuổi vàng</span>
            <span className="font-bold text-emerald-800">{order.gold}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Ngày đặt hàng</span>
            <span className="font-semibold text-slate-800">{order.date}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Ngày hẹn giao</span>
            <span className="font-semibold text-slate-800">{order.expectDate}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tổng số lượng</span>
            <span className="font-mono font-black text-slate-900 text-sm">{order.qty} SP</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tổng giá trị</span>
            <span className="font-mono font-black text-emerald-900 text-sm">{order.total} đ</span>
          </div>
        </div>
      </div>

      {/* BANNER GỢI Ý ĐỒNG BỘ NẾU PHÁT HIỆN HÀNG TRONG KHO */}
      {isSyncAllowed && matchedStockList.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 flex items-center">
                Phát Hiện Tồn Kho Thành Phẩm Chờ Xử Lý Khớp 100% Thuộc Tính!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Có sẵn <strong>{matchedStockList.reduce((acc, s) => acc + s.availableQty, 0)} sản phẩm</strong> trong kho có thể tận dụng để giao ngay cho khách hàng.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <span>Nhấn mở popup xem chi tiết & pick chọn</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* BẢNG CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#005a46] uppercase tracking-wider flex items-center">
            Danh Sách Sản Phẩm Trong Đơn Hàng ({order.items?.length || 0} dòng)
          </h3>
          <span className="text-xs text-gray-500">
            Trạng thái đơn: <strong className="text-emerald-800">{order.status}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="px-3 py-3 w-12 text-center">STT</th>
                <th className="px-3 py-3">Mã Item / Tên</th>
                <th className="px-3 py-3">Tuổi vàng</th>
                <th className="px-3 py-3">Ni / Size</th>
                <th className="px-3 py-3">Đá / Màu</th>
                <th className="px-3 py-3 text-center">SL Đặt</th>
                <th className="px-3 py-3">Nguồn Hàng & Điều Tiết Đá</th>
                <th className="px-3 py-3">Tiền Công (KH Mới)</th>
                <th className="px-3 py-3 text-center w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {order.items?.map((item) => {
                const isSynced = item.sourceType === "WAREHOUSE_REWORK" || item.sourceType === "SPLIT_ALLOCATION";

                return (
                  <tr key={item.stt} className={`hover:bg-slate-50 ${isSynced ? "bg-emerald-50/20" : ""}`}>
                    <td className="px-3 py-3.5 text-center font-bold text-slate-500">{item.stt}</td>
                    
                    <td className="px-3 py-3.5">
                      <div className="font-mono font-bold text-slate-900">{item.itemCode}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{item.itemName}</div>
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {item.goldType || order.gold}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 font-bold text-slate-800">
                      Ni {item.size}
                    </td>

                    <td className="px-3 py-3.5">
                      <div className="font-semibold text-indigo-900">{item.stoneColor}</div>
                      <div className="text-[10px] text-slate-400">{item.stoneType}</div>
                    </td>

                    <td className="px-3 py-3.5 text-center font-mono font-black text-sm text-slate-900">
                      {item.qty}
                    </td>

                    {/* Nguồn hàng & Trạng thái Đá */}
                    <td className="px-3 py-3.5">
                      {isSynced ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-[11px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                              Kho TP: {item.qtyFromStock} món
                            </span>
                            {item.qtyNewProduction > 0 && (
                              <span className="font-bold text-[11px] text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded">
                                Đúc mới: {item.qtyNewProduction} món
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-bold flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600 shrink-0" />
                            Đã NHẢ {item.qtyFromStock} phần đá giữ chỗ về kho phụ liệu
                          </div>
                          <div className="text-[10px] text-slate-500 italic">
                            {item.note}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Sản xuất mới 100%
                          </span>
                          <div className="text-[10px] text-amber-700">
                            • Tạm giữ chỗ Lần 1: {item.qty} phần đá (BOM)
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3.5 font-mono font-bold text-slate-900">
                      {(item.unitPrice || 480000).toLocaleString("vi-VN")} đ
                    </td>

                    <td className="px-3 py-3.5 text-center">
                      {isSynced ? (
                        <button
                          type="button"
                          onClick={() => handleRevertItem(item.stt)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                        >
                          <RotateCcw className="h-3 w-3 inline mr-1" />
                          Hủy chọn kho
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleTriggerSync}
                          disabled={!isSyncAllowed}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                            isSyncAllowed
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                          }`}
                        >
                          Đồng bộ kho
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP XEM CHI TIẾT MẶT HÀNG TRONG KHO & PICK CHỌN (CHUẨN 5 CỘT CỦA USER) */}
      <WarehouseSyncPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        order={order}
        matchedStockList={matchedStockList}
        onConfirmPick={handleConfirmPick}
      />
    </div>
  );
}
