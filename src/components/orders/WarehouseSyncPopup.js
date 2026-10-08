"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Warehouse, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Check, 
  Layers,
  ArrowRight
} from "lucide-react";

export default function WarehouseSyncPopup({
  isOpen,
  onClose,
  order,
  matchedStockList = [],
  onConfirmPick
}) {
  // State lưu số lượng pick cho từng dòng stock item
  // key là stock.id, value là số lượng pick
  const [pickQuantities, setPickQuantities] = useState({});

  useEffect(() => {
    // Khởi tạo mặc định: pick tối đa số lượng có thể (bằng min giữa nhu cầu đặt và tồn kho)
    if (matchedStockList.length > 0 && order) {
      const initial = {};
      matchedStockList.forEach((stock) => {
        // Tìm dòng hàng tương ứng trong đơn hàng
        const orderItem = order.items?.find(
          (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
        );
        const requestedQty = orderItem ? orderItem.qty : stock.availableQty;
        // Mặc định lấy tối đa số tồn nhưng không vượt quá nhu cầu đặt
        initial[stock.id] = Math.min(requestedQty, stock.availableQty);
      });
      setPickQuantities(initial);
    }
  }, [matchedStockList, order]);

  if (!isOpen || !order) return null;

  // Tính tổng số lượng pick
  const totalPicked = Object.values(pickQuantities).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const totalOrderQty = order.items?.reduce((acc, i) => acc + i.qty, 0) || order.qty;
  const remainingForNewProduction = Math.max(0, totalOrderQty - totalPicked);

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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005a46] via-[#004737] to-[#013328] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <Warehouse className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                Danh Sách Mặt Hàng Trong Kho Thành Phẩm Chờ Xử Lý
                <span className="ml-2.5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 rounded-full">
                  Khớp 100%
                </span>
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

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
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

          {/* BẢNG CHI TIẾT CÁC MẶT HÀNG TRONG KHO */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Mã Item</th>
                  <th className="px-4 py-3 text-center">Số Lượng Tồn Kho</th>
                  <th className="px-4 py-3 text-center">Mã Đơn Hàng Cũ</th>
                  <th className="px-4 py-3 text-center">Ngày Nhập Kho</th>
                  <th className="px-4 py-3 text-center w-48">Ô Nhập SL Pick Chọn</th>
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
                      {/* Cột 1: Mã Item */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-sm text-slate-900">{stock.itemCode}</div>
                        <div className="text-[11px] text-slate-600 font-medium">{stock.itemName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">{stock.goldType}</span>
                          <span>Ni {stock.size}</span>
                          <span>• {stock.stoneColor} ({stock.stoneType})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Vị trí: <strong className="text-slate-700">{stock.location}</strong> ({stock.bagCode})
                        </div>
                      </td>

                      {/* Cột 2: Số Lượng Tồn Kho */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {stock.availableQty} món
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Khả dụng</div>
                      </td>

                      {/* Cột 3: Mã Đơn Hàng Cũ */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          {stock.oldOrderCode || "-"}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Đã hủy đợt trước</div>
                      </td>

                      {/* Cột 4: Ngày Nhập Kho */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {stock.dateInStock || "-"}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center">
                          <Calendar className="h-3 w-3 mr-0.5" /> Lưu kho
                        </div>
                      </td>

                      {/* Cột 5: Ô Nhập Số Lượng Pick Chọn */}
                      <td className="px-4 py-3.5 text-center">
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
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded border border-slate-300 transition-colors"
                            title="Chọn tối đa số lượng có thể"
                          >
                            Tối đa
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Nhu cầu đơn: <strong>{requestedQty} món</strong>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* BOX TÓM TẮT KẾT QUẢ PHÂN BỔ & NHẢ ĐÁ */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Layers className="h-4 w-4 mr-1.5 text-emerald-700" />
                Tổng hợp phân bổ đơn hàng sau khi pick chọn
              </span>
              <span className="text-slate-500 font-semibold text-xs">
                Tổng nhu cầu đơn hàng: <strong className="text-slate-900">{totalOrderQty} món</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950">1. Lấy từ Kho Thành Phẩm:</span>
                  <span className="font-mono font-black text-emerald-800 text-sm">{totalPicked} món</span>
                </div>
                <div className="text-[11px] text-emerald-800 flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 shrink-0" />
                  <span>Tự động <strong>NHẢ {totalPicked} phần đá</strong> đã tạm hold về kho phụ liệu.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-950">2. Bắt buộc Sản Xuất Mới:</span>
                  <span className="font-mono font-black text-blue-800 text-sm">{remainingForNewProduction} món</span>
                </div>
                <div className="text-[11px] text-blue-800">
                  • Tiếp tục duy trì giữ chỗ đá cho {remainingForNewProduction} món theo BOM đúc mới.
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
              📌 <strong>Vòng đời tiếp theo:</strong> Sau khi xác nhận, thông tin được gửi sang QLSP để cập nhật Routing làm mới. Khi QLSP duyệt xong, đơn hàng sẽ chuyển sang trạng thái <strong>&apos;Đủ thông tin kỹ thuật&apos;</strong> để QLĐH bấm chuyển KHSX.
            </div>
          </div>

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
