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
  // State lưu danh sách ID stock item được tick chọn qua Checkbox
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    if (matchedStockList.length > 0 && order) {
      const initialQty = {};
      const initialSelected = new Set();
      matchedStockList.forEach((stock) => {
        const orderItem = order.items?.find(
          (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
        );
        const requestedQty = orderItem ? orderItem.qty : stock.availableQty;
        // Mặc định SL pick chọn là SL trong kho
        const defaultQty = Math.min(requestedQty, stock.availableQty);
        initialQty[stock.id] = defaultQty;
        initialSelected.add(stock.id);
      });
      setPickQuantities(initialQty);
      setSelectedIds(initialSelected);
    }
  }, [matchedStockList, order]);

  if (!isOpen || !order) return null;

  // Toggle chọn / bỏ chọn từng dòng item
  const handleToggleItem = (stockId, stockAvailable, requestedQty) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stockId)) {
        next.delete(stockId);
        // Khi bỏ chọn thì reset số lượng pick về 0
        setPickQuantities((q) => ({ ...q, [stockId]: 0 }));
      } else {
        next.add(stockId);
        // Khi tick chọn thì mặc định SL pick chọn là SL trong kho
        const defaultQty = Math.min(stockAvailable, requestedQty);
        setPickQuantities((q) => ({ ...q, [stockId]: defaultQty }));
      }
      return next;
    });
  };

  // Toggle Chọn tất cả / Bỏ chọn tất cả
  const handleToggleSelectAll = () => {
    if (selectedIds.size === matchedStockList.length) {
      setSelectedIds(new Set());
      const cleared = {};
      matchedStockList.forEach((s) => (cleared[s.id] = 0));
      setPickQuantities(cleared);
    } else {
      const all = new Set();
      const filled = {};
      matchedStockList.forEach((stock) => {
        all.add(stock.id);
        const orderItem = order.items?.find(
          (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
        );
        const requestedQty = orderItem ? orderItem.qty : stock.availableQty;
        filled[stock.id] = Math.min(requestedQty, stock.availableQty);
      });
      setSelectedIds(all);
      setPickQuantities(filled);
    }
  };

  // Tính tổng số lượng pick cho các item được tick chọn
  const totalPicked = Array.from(selectedIds).reduce(
    (acc, id) => acc + (Number(pickQuantities[id]) || 0),
    0
  );

  const handleQtyChange = (stockId, value, maxAvailable, requestedQty) => {
    let num = Number(value);
    if (isNaN(num) || num < 0) num = 0;
    const maxAllowed = Math.min(maxAvailable, requestedQty);
    if (num > maxAllowed) num = maxAllowed;
    
    // Nếu nhập số lượng > 0 thì tự động tick chọn
    if (num > 0) {
      setSelectedIds((prev) => new Set([...prev, stockId]));
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(stockId);
        return next;
      });
    }

    setPickQuantities((prev) => ({
      ...prev,
      [stockId]: num
    }));
  };

  const handleSelectMax = (stockId, maxAvailable, requestedQty) => {
    const maxAllowed = Math.min(maxAvailable, requestedQty);
    setSelectedIds((prev) => new Set([...prev, stockId]));
    setPickQuantities((prev) => ({
      ...prev,
      [stockId]: maxAllowed
    }));
  };

  const handleSubmit = () => {
    // Chỉ gửi các item được tick chọn và có SL > 0
    const finalPicks = {};
    selectedIds.forEach((id) => {
      finalPicks[id] = pickQuantities[id] || 0;
    });
    onConfirmPick(finalPicks);
  };

  const isAllSelected = matchedStockList.length > 0 && selectedIds.size === matchedStockList.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
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
              Hệ thống chỉ liệt kê các mặt hàng có <strong>Mã item trùng khớp hoàn toàn</strong> với dòng đặt hàng. Khi pick chọn item kho, hệ thống sẽ tự động áp giá tiền công chuẩn của khách hàng hiện tại.
            </div>
          </div>

          {/* BẢNG CHI TIẾT (Đã bổ sung Checkbox, bỏ toàn bộ text phụ dưới các ô, bỏ thanh cuộn ngang) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[11px] whitespace-nowrap">
                <tr>
                  <th className="px-3 py-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                      title="Chọn tất cả"
                    />
                  </th>
                  <th className="px-3 py-3">Mã Item</th>
                  <th className="px-3 py-3 text-center text-emerald-900 bg-emerald-50/50 w-20">SL Đặt</th>
                  <th className="px-3 py-3 text-center w-28">Số Lượng Tồn Kho</th>
                  <th className="px-3 py-3 text-center w-32">Mã Đơn Hàng Cũ</th>
                  <th className="px-3 py-3 text-center w-36">Nguyên Liệu - Tuổi Vàng</th>
                  <th className="px-3 py-3 text-center w-28">Ngày Nhập Kho</th>
                  <th className="px-3 py-3 text-center w-36">SL PICK CHỌN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {matchedStockList.map((stock) => {
                  const isSelected = selectedIds.has(stock.id);
                  const currentPick = pickQuantities[stock.id] || 0;
                  const orderItem = order.items?.find(
                    (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
                  );
                  const requestedQty = orderItem ? orderItem.qty : stock.availableQty;
                  const displayName = stock.itemName ? stock.itemName.replace(/Vàng.*/i, "").trim() : "Nhẫn Nữ";

                  return (
                    <tr 
                      key={stock.id} 
                      className={`transition-colors ${isSelected ? "bg-emerald-50/20" : "hover:bg-slate-50 opacity-75"}`}
                    >
                      {/* Cột 0: Checkbox chọn item */}
                      <td className="px-3 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleItem(stock.id, stock.availableQty, requestedQty)}
                          className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* Cột 1: Mã Item (Mã 30 ký tự, tên Nhẫn Nữ, Màu đá Trắng) */}
                      <td className="px-3 py-3.5">
                        <div className="font-mono font-bold text-xs text-slate-900 tracking-tight">
                          {(stock.itemCode30 || stock.itemCode)?.replace(/\//g, "")}
                        </div>
                        <div className="text-[11px] text-slate-700 font-bold mt-0.5">{displayName || "Nhẫn Nữ"}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                          <span>Ni {stock.size}</span>
                          <span>• Đá {stock.stoneColor || "Trắng"}</span>
                        </div>
                      </td>

                      {/* Cột 2: SL Đặt (Đã bỏ chữ 'món đặt') */}
                      <td className="px-3 py-3.5 text-center bg-emerald-50/30">
                        <span className="font-mono font-black text-sm text-emerald-950">
                          {requestedQty}
                        </span>
                      </td>

                      {/* Cột 3: Số Lượng Tồn Kho (Đã bỏ chữ 'Khả dụng') */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {stock.availableQty} món
                        </span>
                      </td>

                      {/* Cột 4: Mã Đơn Hàng Cũ (Đã bỏ chữ 'Đã hủy đợt trước') */}
                      <td className="px-3 py-3.5 text-center">
                        <div className="relative inline-block group">
                          <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 hover:bg-amber-100 hover:border-amber-300 cursor-help transition-colors inline-flex items-center space-x-1">
                            <span>{stock.oldOrderCode || "-"}</span>
                            <Info className="h-3 w-3 text-amber-600" />
                          </span>

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

                      {/* Cột 5: Nguyên Liệu - Tuổi Vàng (Đã bỏ chữ 'Chuẩn tuổi') */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 inline-block font-mono">
                          {order.material || "Vàng"} - {stock.goldType}
                        </span>
                      </td>

                      {/* Cột 6: Ngày Nhập Kho (Đã bỏ chữ 'Lưu kho') */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="font-mono text-xs font-semibold text-slate-700 inline-flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                          {stock.dateInStock || "-"}
                        </span>
                      </td>

                      {/* Cột 7: SL Pick Chọn */}
                      <td className="px-3 py-3.5 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            max={Math.min(stock.availableQty, requestedQty)}
                            disabled={!isSelected}
                            value={currentPick}
                            onChange={(e) =>
                              handleQtyChange(stock.id, e.target.value, stock.availableQty, requestedQty)
                            }
                            className={`w-24 text-center font-mono font-black text-sm rounded-lg py-1.5 px-2 transition-all ${
                              isSelected
                                ? "text-emerald-900 border-2 border-emerald-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#005a46]"
                                : "text-slate-400 border border-slate-200 bg-slate-50 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer (Nút Đóng bê qua nằm bên trái nút Xác nhận, nút Xác nhận rút gọn) */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end items-center space-x-3">
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
            <span>Xác nhận ({totalPicked} món)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
