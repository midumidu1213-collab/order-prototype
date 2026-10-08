"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Warehouse, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  Info
} from "lucide-react";

export default function WarehouseSyncPopup({
  isOpen,
  onClose,
  order,
  matchedStockList = [],
  onConfirmPick
}) {
  // State lưu số lượng pick cho từng dòng stock item
  const [pickQuantities, setPickQuantities] = useState({});

  useEffect(() => {
    if (matchedStockList.length > 0 && order) {
      const initial = {};
      matchedStockList.forEach((stock) => {
        const orderItem = order.items?.find(
          (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
        );
        const requestedQty = orderItem ? orderItem.qty : stock.availableQty;
        initial[stock.id] = Math.min(requestedQty, stock.availableQty);
      });
      setPickQuantities(initial);
    }
  }, [matchedStockList, order]);

  if (!isOpen || !order) return null;

  // Tính tổng số lượng pick
  const totalPicked = Object.values(pickQuantities).reduce((acc, v) => acc + (Number(v) || 0), 0);

  const handleQtyChange = (stockId, value, maxAvailable, requestedQty) => {
    let num = Number(value);
    if (isNaN(num) || num < 0) num = 0;
    const maxAllowed = Math.min(maxAvailable, requestedQty);
    if (num > maxAllowed) num = maxAllowed;
    setPickQuantities((prev) => ({
      ...prev,
      [stockId]: num
    }));
  };

  const handleSelectMax = (stockId, maxAvailable, requestedQty) => {
    const maxAllowed = Math.min(maxAvailable, requestedQty);
    setPickQuantities((prev) => ({
      ...prev,
      [stockId]: maxAllowed
    }));
  };

  const handleSubmit = () => {
    onConfirmPick(pickQuantities);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header (Đã bỏ badge KHỚP 100% theo yêu cầu của Chị đẹp) */}
        <div className="bg-gradient-to-r from-[#005a46] via-[#004737] to-[#013328] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <Warehouse className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                Danh Sách Mặt Hàng Trong Kho Thành Phẩm Chờ Xử Lý
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Đơn hàng: <strong className="text-white font-mono">{order.code}</strong> • Trạng thái: <span className="bg-white/20 px-1.5 py-0.2 rounded font-semibold">{order.status}</span>
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

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Cảnh báo quy tắc nghiệp vụ */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950 block text-[13px] mb-0.5">
                Quy tắc khớp 100% thuộc tính & Bán đúng sản phẩm hiện hữu trong kho
              </strong>
              Hệ thống chỉ liệt kê các mặt hàng có <strong>Mã Item, Tuổi vàng, Ni tay và Màu đá trùng khớp hoàn toàn</strong> với dòng đặt hàng. 
              Khi pick chọn item kho, hệ thống sẽ tự động <strong>NHẢ ĐÁ TƯƠNG ỨNG VỀ KHO PHỤ LIỆU</strong> và áp biểu giá tiền công chuẩn của khách hàng hiện tại.
            </div>
          </div>

          {/* BẢNG CHI TIẾT CÁC MẶT HÀNG TRONG KHO (CHUẨN CÁC CỘT THEO GÓP Ý CỦA CHỊ ĐẸP) */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
            <table className="w-full divide-y divide-slate-200 text-left text-xs min-w-[980px]">
              <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[11px] whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3 min-w-[240px]">Mã Item</th>
                  <th className="px-3 py-3 text-center text-emerald-900 bg-emerald-50/50 whitespace-nowrap min-w-[85px]">SL Đặt</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap min-w-[125px]">Số Lượng Tồn Kho</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap min-w-[135px]">Mã Đơn Hàng Cũ</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap min-w-[145px]">Nguyên Liệu - Tuổi Vàng</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap min-w-[115px]">Ngày Nhập Kho</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap min-w-[195px]">Ô Nhập SL Pick Chọn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {matchedStockList.map((stock) => {
                  const currentPick = pickQuantities[stock.id] || 0;
                  const orderItem = order.items?.find(
                    (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
                  );
                  const requestedQty = orderItem ? orderItem.qty : stock.availableQty;

                  return (
                    <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                      {/* Cột 1: Mã Item (Đã bỏ badge 61Y và bỏ vị trí két/ngăn theo yêu cầu của Chị đẹp) */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-xs text-slate-900">{stock.itemCode}</div>
                        <div className="text-[11px] text-slate-600 font-medium">{stock.itemName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                          <span>Ni {stock.size}</span>
                          {stock.stoneColor && stock.stoneColor !== "--" ? (
                            <span>• {stock.stoneColor} ({stock.stoneType})</span>
                          ) : (
                            <span className="text-slate-400">• Không gắn đá</span>
                          )}
                        </div>
                      </td>

                      {/* Cột 2: SL Đặt */}
                      <td className="px-3 py-3.5 text-center bg-emerald-50/30 whitespace-nowrap">
                        <span className="font-mono font-black text-sm text-emerald-950 block">
                          {requestedQty}
                        </span>
                        <span className="text-[10px] text-emerald-700">món đặt</span>
                      </td>

                      {/* Cột 3: Số Lượng Tồn Kho */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {stock.availableQty} món
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Khả dụng</div>
                      </td>

                      {/* Cột 4: Mã Đơn Hàng Cũ (Rê chuột vào xem được lý do hủy) */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div className="relative inline-block group">
                          <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 hover:bg-amber-100 hover:border-amber-300 cursor-help transition-colors inline-flex items-center space-x-1">
                            <span>{stock.oldOrderCode || "-"}</span>
                            <Info className="h-3 w-3 text-amber-600" />
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">Đã hủy đợt trước</div>

                          {/* Tooltip hiển thị lý do hủy khi rê chuột */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-56 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none text-left whitespace-normal">
                            <span className="font-bold text-amber-400 flex items-center mb-0.5">
                              📌 Lý do hủy đơn cũ:
                            </span>
                            <span className="leading-tight text-slate-200">
                              {stock.sourceReason || "Khách hủy do trễ hẹn giao hàng đợt 1"}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700">
                              Khách cũ: {stock.oldCustomer || "Khách hàng cũ"}
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </td>

                      {/* Cột 5: Nguyên Liệu - Tuổi Vàng */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block font-mono">
                          {order.material || "Vàng"} - {stock.goldType}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Chuẩn tuổi</div>
                      </td>

                      {/* Cột 6: Ngày Nhập Kho */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {stock.dateInStock || "-"}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center">
                          <Calendar className="h-3 w-3 mr-0.5 text-slate-400" /> Lưu kho
                        </div>
                      </td>

                      {/* Cột 7: Ô Nhập Số Lượng Pick Chọn (Hiển thị đầy đủ, rộng rãi không bị che khuất) */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap min-w-[195px]">
                        <div className="flex items-center justify-center space-x-1.5">
                          <input
                            type="number"
                            min="0"
                            max={Math.min(stock.availableQty, requestedQty)}
                            value={currentPick}
                            onChange={(e) =>
                              handleQtyChange(stock.id, e.target.value, stock.availableQty, requestedQty)
                            }
                            className="w-20 text-center font-mono font-black text-sm text-emerald-900 border-2 border-emerald-500 rounded-lg py-1 px-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#005a46]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSelectMax(stock.id, stock.availableQty, requestedQty)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg border border-slate-300 transition-colors cursor-pointer shrink-0 shadow-2xs"
                            title="Chọn tối đa số lượng có thể"
                          >
                            Tối đa
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium whitespace-nowrap">
                          Nhu cầu đơn: <strong className="text-slate-800">{requestedQty} món</strong>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer (Bỏ toàn bộ khối tổng hợp phân bổ, chỉ giữ nút Đóng và nút Xác nhận) */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Xác nhận Pick chọn vào Đơn hàng ({totalPicked} món kho)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
