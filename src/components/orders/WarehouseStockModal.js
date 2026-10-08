"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Warehouse, 
  Sparkles,
  ArrowRight,
  Layers,
  Split
} from "lucide-react";
import { findMatchingWarehouseItems } from "@/data/warehouseStockData";

export default function WarehouseStockModal({
  isOpen,
  onClose,
  targetItem,
  customerName = "Công ty TNHH Vàng Bạc Kim Yến",
  onConfirmSync
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

  // Item kho được chọn
  const primaryStockItem = matchingItems[0] || null;

  // Số lượng lấy từ kho (mặc định lấy tối đa số có sẵn hoặc đủ nhu cầu đặt)
  const maxAvailable = primaryStockItem?.availableQty || 0;
  const requestedQty = targetItem?.qty || 1;

  const [selectedQtyFromStock, setSelectedQtyFromStock] = useState(
    Math.min(requestedQty, maxAvailable)
  );

  useEffect(() => {
    if (primaryStockItem && targetItem) {
      setSelectedQtyFromStock(Math.min(targetItem.qty, primaryStockItem.availableQty));
    }
  }, [primaryStockItem, targetItem]);

  if (!isOpen || !targetItem) return null;

  // Tính toán số lượng phân bổ
  const qtyFromStock = Math.min(Number(selectedQtyFromStock) || 0, maxAvailable);
  const qtyNewProduction = Math.max(0, requestedQty - qtyFromStock);

  const handleConfirm = () => {
    if (!primaryStockItem) return;
    onConfirmSync({
      stockItem: primaryStockItem,
      qtyFromStock,
      qtyNewProduction
    });
  };

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
                Review & Đồng Bộ Tồn Kho Thành Phẩm Chờ Xử Lý Lại
                <span className="ml-2.5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 rounded-full">
                  Khớp 100%
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Bán đúng sản phẩm hiện hữu trong kho • Tự động phân bổ số lượng & nhả đá giữ chỗ
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
              Hệ thống chỉ cho phép đồng bộ sản phẩm khi <strong>trùng khớp 100% cả 4 tiêu chí</strong> (Mã Item, Tuổi vàng, Ni tay, Màu/Loại đá). 
              Tuyệt đối không áp dụng dung sai ni hay thay đá để bảo vệ phôi và cấu trúc chấu.
            </div>
          </div>

          {/* Tiêu chí so khớp cố định từ dòng đơn hàng */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-600" />
                Thông số đơn đặt hàng #{targetItem.stt}
              </span>
              <span className="text-emerald-800 font-bold">Nhu cầu đặt: {requestedQty} món</span>
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

          {/* Thông tin tồn kho và Lựa chọn phân bổ số lượng */}
          {matchingItems.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6">
              <Warehouse className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h5 className="text-sm font-bold text-slate-700">Không có thành phẩm khớp 100% trong kho</h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Kho thành phẩm hiện không có sẵn sản phẩm thỏa mãn đồng thời 4 tiêu chí trên. 
                Dòng hàng này sẽ được giữ nguyên theo luồng <strong>Sản xuất mới hoàn toàn</strong>.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Đóng và tiếp tục Sản xuất mới
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Thẻ thông tin Item kho khớp */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-sm text-[#005a46] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      {primaryStockItem.bagCode}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{primaryStockItem.itemName}</span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Vị trí: {primaryStockItem.location}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-950">
                    Tồn khả dụng trong kho: <span className="text-sm font-black text-emerald-700 font-mono">{primaryStockItem.availableQty} món</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>Đá sẵn trên phôi: <strong className="text-slate-800">{primaryStockItem.stoneType} ({primaryStockItem.stoneQty})</strong></div>
                  <div>Trọng lượng chuẩn: <strong className="text-slate-800">{primaryStockItem.weight}</strong></div>
                  <div>Nguồn gốc tồn: <span className="text-amber-800 font-medium">{primaryStockItem.sourceReason}</span></div>
                </div>

                {/* Phần phân bổ số lượng (Split Allocation) */}
                <div className="pt-2 border-t border-emerald-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-0.5">
                        Số lượng đồng bộ lấy từ Kho Thành Phẩm:
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Khách đặt <strong>{requestedQty} món</strong>. Tối đa lấy từ kho: <strong>{maxAvailable} món</strong>.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={Math.min(requestedQty, maxAvailable)}
                        value={selectedQtyFromStock}
                        onChange={(e) => setSelectedQtyFromStock(Number(e.target.value))}
                        className="w-24 text-center border-2 border-emerald-600 rounded-lg py-1.5 px-2 text-sm font-mono font-black text-emerald-900 focus:outline-none focus:ring-2 focus:ring-[#005a46]"
                      />
                      <span className="text-xs font-bold text-slate-700">món</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box Kế Hoạch Phân Bổ Tự Động (Visual Split Matrix) */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                  <Split className="h-4 w-4 mr-1.5 text-indigo-600" />
                  Kế hoạch phân bổ & Tác vụ tự động sau khi đồng bộ
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Nhánh 1: Kho Thành Phẩm */}
                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center">
                        <Warehouse className="h-4 w-4 mr-1 text-emerald-700" />
                        1. Lấy từ Kho TP Chờ Xử Lý:
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-800">{qtyFromStock} món</span>
                    </div>
                    <ul className="space-y-1 text-emerald-900 text-[11px] leading-relaxed">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Tự động Nhả {qtyFromStock} phần đá</strong> đã tạm giữ chỗ Lần 1 về Kho Phụ Liệu khả dụng.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Áp biểu giá tiền công chuẩn <strong>Khách hàng Mới</strong> ({primaryStockItem.standardLaborPrice.toLocaleString("vi-VN")} đ/chiếc).</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Chuyển QLSP duyệt <strong>Routing làm mới:</strong> Tẩy xi → Khắc logo/tuổi mới → Xi lại → KCS.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Nhánh 2: Sản Xuất Mới */}
                  <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950 flex items-center">
                        <Layers className="h-4 w-4 mr-1 text-blue-700" />
                        2. Bắt buộc Sản Xuất Mới:
                      </span>
                      <span className="font-mono font-black text-sm text-blue-800">{qtyNewProduction} món</span>
                    </div>
                    <ul className="space-y-1 text-blue-900 text-[11px] leading-relaxed">
                      <li className="flex items-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2 mt-1.5 shrink-0"></span>
                        <span><strong>Duy trì giữ chỗ đá</strong> Lần 1 cho {qtyNewProduction} món theo BOM đúc mới.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2 mt-1.5 shrink-0"></span>
                        <span>Đi theo quy trình sản xuất thông thường: Đúc phôi → Nguội → Gắn đá → Xi mạ → KCS.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Lưu ý vòng đời trạng thái */}
                <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-950">
                  <strong>Quy chuẩn vòng đời đơn hàng:</strong> Sau khi QLSP hoàn tất cập nhật Routing làm mới, đơn hàng sẽ chuyển sang trạng thái <strong>"Đủ thông tin kỹ thuật"</strong>. Khi đó, <strong>bộ phận Bán hàng (QLĐH) mới thực hiện thao tác bấm Chuyển KHSX</strong>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>

          {matchingItems.length > 0 && (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Xác nhận Đồng bộ vào Đơn hàng ({qtyFromStock} kho + {qtyNewProduction} đúc mới)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
