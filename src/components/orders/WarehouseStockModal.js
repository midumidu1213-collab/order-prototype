"use client";

import { useMemo } from "react";
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Warehouse, ArrowRight, Sparkles } from "lucide-react";
import { findMatchingWarehouseItems } from "@/data/warehouseStockData";

export default function WarehouseStockModal({
  isOpen,
  onClose,
  targetItem,
  customerName = "Công ty TNHH Vàng Bạc Kim Yến",
  onSelectStock
}) {
  const matchingItems = useMemo(() => {
    if (!targetItem) return [];
    return findMatchingWarehouseItems({
      itemCode: targetItem.itemCode,
      goldType: targetItem.goldType,
      size: targetItem.size,
      stoneColor: targetItem.stoneColor
    });
  }, [targetItem]);

  if (!isOpen || !targetItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005a46] to-[#004737] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <Warehouse className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                Tra Cứu Kho Thành Phẩm Chờ Xử Lý Lại
                <span className="ml-2.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 rounded-full">
                  Phase 1: Khớp 100%
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Bán đúng sản phẩm hiện hữu trong kho • Bảo toàn phôi và chấu đá
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Cảnh báo quy tắc nghiệp vụ cốt lõi (First Principles) */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950 block text-[13px] mb-0.5">
                Quy tắc bắt buộc: Khớp mã Item và thuộc tính 100% (Exact Match Only)
              </strong>
              Hệ thống lọc tự động và <strong>chỉ cho phép chọn đúng sản phẩm có sẵn trong kho</strong> (cùng Mã Item, Tuổi vàng, Ni tay, Màu/Loại đá). 
              Tuyệt đối không áp dụng dung sai ni tay hay cạy đá đổi đá để tránh nứt phôi, hỏng chấu và hao hụt vàng.
            </div>
          </div>

          {/* Tiêu chí so khớp cố định từ dòng hàng hiện tại */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-600" />
              Tiêu chí so khớp từ dòng đơn hàng #{targetItem.stt}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block font-medium">Mã Item</span>
                <span className="font-bold text-slate-900 text-sm">{targetItem.itemCode}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block font-medium">Tuổi vàng</span>
                <span className="font-bold text-emerald-700 text-sm">{targetItem.goldType}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block font-medium">Kích thước Ni tay</span>
                <span className="font-bold text-slate-900 text-sm">Ni {targetItem.size}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 block font-medium">Màu / Quy cách đá</span>
                <span className="font-bold text-indigo-700 text-sm">{targetItem.stoneColor}</span>
              </div>
            </div>
          </div>

          {/* Danh sách kết quả tồn kho */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center">
                <span>Sản phẩm khả dụng trong Kho Thành Phẩm</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {matchingItems.length} sản phẩm khớp
                </span>
              </h4>
              <span className="text-xs text-slate-500">Khách hàng áp giá: <strong className="text-slate-800">{customerName}</strong></span>
            </div>

            {matchingItems.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6">
                <Warehouse className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h5 className="text-sm font-bold text-slate-700">Không tìm thấy Item khớp 100% trong kho</h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Hiện không có thành phẩm nào có đủ cả 4 thông số (Mã {targetItem.itemCode}, {targetItem.goldType}, Ni {targetItem.size}, Đá {targetItem.stoneColor}).
                  Dòng hàng này sẽ được giữ theo quy trình <strong>Sản xuất mới hoàn toàn</strong>.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Đóng và tiếp tục Sản xuất mới
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingItems.map((stock) => (
                  <div
                    key={stock.id}
                    className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-sm text-[#005a46] bg-emerald-100/80 px-2 py-0.5 rounded">
                          {stock.bagCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {stock.itemName}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Vị trí: {stock.location}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                        <span>Đá trên phôi: <strong className="text-slate-800">{stock.stoneType} ({stock.stoneQty})</strong></span>
                        <span>Trọng lượng: <strong className="text-slate-800">{stock.weight}</strong></span>
                        <span>Nguồn gốc: <span className="text-amber-800 font-medium">{stock.sourceReason}</span></span>
                      </div>

                      {/* Cơ chế Điều tiết Đá & Routing */}
                      <div className="pt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="inline-flex items-center text-emerald-800 font-bold bg-emerald-100/90 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                          Hệ thống sẽ NHẢ 100% đá tạm hold về kho phụ liệu
                        </span>
                        <span className="inline-flex items-center text-indigo-800 font-medium bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Routing QLSP: Tẩy xi → Khắc logo/tuổi mới → Xi mạ → KCS
                        </span>
                        <span className="inline-flex items-center text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                          Tiền công KH mới: {stock.standardLaborPrice.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center md:flex-col justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectStock(stock)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        <span>Chọn Item này</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
