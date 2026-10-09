"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  X, 
  Warehouse, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  Info,
  Layers,
  PackageCheck
} from "lucide-react";
import { ROUTING_FG_FIXED } from "@/data/warehouseStockData";

export default function WarehouseSyncPopup({
  isOpen,
  onClose,
  order,
  matchedStockList = [],
  onConfirmPick
}) {
  // State lưu số lượng pick cho từng dòng lô (key là stock.id)
  const [pickQuantities, setPickQuantities] = useState({});
  // State lưu danh sách ID các lô được tick chọn qua Checkbox
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Khởi tạo mặc định khi mở popup
  useEffect(() => {
    if (matchedStockList.length > 0 && order) {
      const initialQty = {};
      const initialSelected = new Set();

      // Nhóm theo itemCode để tính toán không vượt quá SL đặt
      const itemPickTracker = {};

      matchedStockList.forEach((stock) => {
        const orderItem = order.items?.find(
          (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
        );
        const requestedQty = orderItem ? orderItem.qty : 100;
        const currentPickedForItem = itemPickTracker[stock.itemCode] || 0;
        const remainingNeeded = Math.max(0, requestedQty - currentPickedForItem);

        // Mặc định pick tối đa có thể từ lô này mà không vượt quá SL đặt
        const defaultPick = Math.min(stock.availableQty, remainingNeeded);

        initialQty[stock.id] = defaultPick;
        if (defaultPick > 0) {
          initialSelected.add(stock.id);
          itemPickTracker[stock.itemCode] = currentPickedForItem + defaultPick;
        } else {
          initialQty[stock.id] = 0;
        }
      });

      setPickQuantities(initialQty);
      setSelectedIds(initialSelected);
    }
  }, [matchedStockList, order, isOpen]);

  // Nhóm các lô theo ItemCode để quản lý cấp Item và cấp Lô
  const groupedItems = useMemo(() => {
    const groups = [];
    const map = new Map();

    matchedStockList.forEach((stock) => {
      const key = stock.itemCode?.toLowerCase();
      if (!map.has(key)) {
        const orderItem = order?.items?.find(
          (i) => i.itemCode?.toLowerCase() === key
        );
        const newGroup = {
          itemCode: stock.itemCode,
          itemCode30: stock.itemCode30 || stock.itemCode,
          itemName: stock.itemName,
          category: stock.category,
          goldType: stock.goldType,
          size: stock.size,
          stoneColor: stock.stoneColor,
          orderQty: orderItem ? orderItem.qty : 100,
          totalStockQty: 0,
          lots: []
        };
        map.set(key, newGroup);
        groups.push(newGroup);
      }

      const g = map.get(key);
      g.totalStockQty += stock.availableQty;
      g.lots.push(stock);
    });

    return groups;
  }, [matchedStockList, order]);

  if (!isOpen || !order) return null;

  // Toggle chọn / bỏ chọn một Lô
  const handleToggleLot = (stock) => {
    const stockId = stock.id;
    const orderItem = order.items?.find(
      (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
    );
    const maxNeeded = orderItem ? orderItem.qty : 100;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stockId)) {
        next.delete(stockId);
        setPickQuantities((q) => ({ ...q, [stockId]: 0 }));
      } else {
        next.add(stockId);
        // Khi tick chọn, tự động điền SL tồn của lô (hoặc số lượng còn cần)
        const currentOtherLotsPick = matchedStockList
          .filter((s) => s.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase() && s.id !== stockId)
          .reduce((sum, s) => sum + (Number(pickQuantities[s.id]) || 0), 0);
        
        const remainingNeeded = Math.max(0, maxNeeded - currentOtherLotsPick);
        const fillQty = Math.min(stock.availableQty, remainingNeeded > 0 ? remainingNeeded : stock.availableQty);
        setPickQuantities((q) => ({ ...q, [stockId]: fillQty }));
      }
      return next;
    });
  };

  // Nút "Hết lô" (Max) cho một Lô cụ thể
  const handlePickMaxLot = (stock) => {
    const stockId = stock.id;
    const orderItem = order.items?.find(
      (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
    );
    const maxNeeded = orderItem ? orderItem.qty : 100;

    const currentOtherLotsPick = matchedStockList
      .filter((s) => s.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase() && s.id !== stockId)
      .reduce((sum, s) => sum + (Number(pickQuantities[s.id]) || 0), 0);

    const remainingNeeded = Math.max(0, maxNeeded - currentOtherLotsPick);
    const fillQty = Math.min(stock.availableQty, remainingNeeded > 0 ? remainingNeeded : stock.availableQty);

    setSelectedIds((prev) => new Set([...prev, stockId]));
    setPickQuantities((q) => ({ ...q, [stockId]: fillQty }));
  };

  // Thay đổi số lượng gõ tay cho từng Lô
  const handleQtyChange = (stock, value) => {
    const stockId = stock.id;
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > stock.availableQty) num = stock.availableQty;

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

  // Toggle Chọn tất cả / Bỏ chọn tất cả toàn bộ popup
  const handleToggleSelectAllGlobal = () => {
    if (selectedIds.size === matchedStockList.length) {
      setSelectedIds(new Set());
      const cleared = {};
      matchedStockList.forEach((s) => (cleared[s.id] = 0));
      setPickQuantities(cleared);
    } else {
      const allSelected = new Set();
      const filledQty = {};
      const tracker = {};

      matchedStockList.forEach((stock) => {
        const orderItem = order.items?.find(
          (i) => i.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase()
        );
        const maxNeeded = orderItem ? orderItem.qty : 100;
        const currentPicked = tracker[stock.itemCode] || 0;
        const remaining = Math.max(0, maxNeeded - currentPicked);

        const take = Math.min(stock.availableQty, remaining > 0 ? remaining : stock.availableQty);
        filledQty[stock.id] = take;
        allSelected.add(stock.id);
        tracker[stock.itemCode] = currentPicked + take;
      });

      setSelectedIds(allSelected);
      setPickQuantities(filledQty);
    }
  };

  // Tổng số lượng đã pick trên toàn bộ đơn
  const totalPickedCount = Array.from(selectedIds).reduce(
    (acc, id) => acc + (Number(pickQuantities[id]) || 0),
    0
  );

  // Tổng SL đặt của các item khớp trong đơn
  const totalRequestedCount = groupedItems.reduce((acc, g) => acc + g.orderQty, 0);
  const totalNewProductionCount = Math.max(0, totalRequestedCount - totalPickedCount);

  // Xác nhận lưu
  const handleSubmit = () => {
    const finalPicks = {};
    const pickedLotsSummary = [];

    matchedStockList.forEach((stock) => {
      const qty = Number(pickQuantities[stock.id]) || 0;
      if (selectedIds.has(stock.id) && qty > 0) {
        finalPicks[stock.id] = qty;
        pickedLotsSummary.push({
          id: stock.id,
          lotCode: stock.lotCode,
          itemCode: stock.itemCode,
          pickedQty: qty,
          oldOrderCode: stock.oldOrderCode,
          dateInStock: stock.dateInStock,
          location: stock.location
        });
      }
    });

    onConfirmPick(finalPicks, pickedLotsSummary);
  };

  const isAllSelected = matchedStockList.length > 0 && selectedIds.size === matchedStockList.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER POPUP */}
        <div className="bg-gradient-to-r from-[#005a46] via-[#004737] to-[#013328] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <Warehouse className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Danh Sách Mặt Hàng Trong Kho Thành Phẩm Chờ Xử Lý</span>
                <span className="text-[11px] bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                  Quản lý theo Cấp Lô (Lot/Batch)
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Đơn hàng: <strong className="text-white font-mono">{order.code}</strong> • Trạng thái: <span className="bg-white/20 px-1.5 py-0.2 rounded font-semibold">{order.status}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* BANNER NGUYÊN TẮC NGHIỆP VỤ & ROUTING FG CỐ ĐỊNH */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center space-x-2 font-bold text-amber-900 text-[13px]">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Quy tắc khớp 100% thuộc tính & Tách 2 luồng KHSX theo Cấp Lô:</span>
            </div>
            <div className="pl-6 space-y-1 text-slate-700">
              <div>
                • <strong>Kinh doanh pick lô:</strong> Có thể chọn từ nhiều lô, nhập số lượng lẻ cho từng lô hoặc chọn hết lô. Số lượng còn lại sẽ tự động chuyển sang luồng <strong>Sản xuất mới</strong>.
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-900">
                <PackageCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  • <strong>Gán Routing cố định (Type: FG):</strong> Phần số lượng pick từ kho thành phẩm được cố định 2 công đoạn: <span className="font-bold text-[#005a46] bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono">1. Serve FG (Phục vụ kho TP)</span> → <span className="font-bold text-[#005a46] bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono">2. Packing Out (Đóng gói xuất kho)</span>.
                </span>
              </div>
            </div>
          </div>

          {/* BẢNG CHI TIẾT THEO CẤP LÔ (VỊ TRÍ CỘT ĐỎ ĐƯỢC BỔ SUNG CHUẨN XÁC) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700 uppercase tracking-wider text-[11px] whitespace-nowrap">
                <tr>
                  <th className="px-3 py-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAllGlobal}
                      className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                      title="Chọn tất cả các lô"
                    />
                  </th>
                  <th className="px-3 py-3 min-w-[200px]">Mã Item</th>
                  
                  {/* CỘT ĐỎ THEO ĐÚNG YÊU CẦU CỦA CHỊ ĐẸP: CẤP LÔ HÀNG */}
                  <th className="px-3 py-3 text-center bg-emerald-50/70 border-x border-emerald-200 text-[#005a46] font-black w-36">
                    <div className="flex items-center justify-center space-x-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span>LÔ HÀNG (LOT)</span>
                    </div>
                  </th>

                  <th className="px-3 py-3 text-center text-emerald-950 bg-emerald-50/40 w-20">SL Đặt</th>
                  <th className="px-3 py-3 text-center w-28">SL Tồn Kho</th>
                  <th className="px-3 py-3 text-center w-32">Mã Đơn Cũ</th>
                  <th className="px-3 py-3 text-center w-36">Nguyên Liệu - Tuổi Vàng</th>
                  <th className="px-3 py-3 text-center w-28">Ngày Nhập Kho</th>
                  <th className="px-3 py-3 text-center w-40 bg-emerald-50/20">SL PICK CHỌN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {groupedItems.map((group) => {
                  return group.lots.map((lot, lotIdx) => {
                    const isSelected = selectedIds.has(lot.id);
                    const currentPick = pickQuantities[lot.id] || 0;
                    const isFirstLotOfItem = lotIdx === 0;

                    return (
                      <tr 
                        key={lot.id} 
                        className={`transition-colors ${
                          isSelected ? "bg-emerald-50/25" : "hover:bg-slate-50 opacity-80"
                        } ${isFirstLotOfItem && lotIdx !== 0 ? "border-t-2 border-slate-200" : ""}`}
                      >
                        {/* 0. Checkbox chọn Lô */}
                        <td className="px-3 py-3.5 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleLot(lot)}
                            className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                          />
                        </td>

                        {/* 1. Mã Item (Nếu item có nhiều lô, hiển thị nhãn nhóm tinh tế) */}
                        <td className="px-3 py-3.5 align-middle">
                          <div className="font-mono font-bold text-xs text-slate-900 tracking-tight">
                            {(lot.itemCode30 || lot.itemCode)?.replace(/\//g, "")}
                          </div>
                          <div className="text-[11px] text-slate-700 font-bold mt-0.5">
                            {lot.itemName || "Nhẫn Nữ"}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                            <span>Ni {lot.size}</span>
                            <span>• Đá {lot.stoneColor || "Trắng"}</span>
                            {group.lots.length > 1 && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                Lô {lotIdx + 1}/{group.lots.length}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. CỘT ĐỎ: MÃ LÔ HÀNG (LOT CODE) */}
                        <td className="px-3 py-3.5 text-center bg-emerald-50/30 border-x border-emerald-100 align-middle">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono font-black text-xs text-[#005a46] bg-white border border-emerald-300 px-2.5 py-1 rounded-md shadow-2xs">
                              {lot.lotCode || `LOT-${lot.id}`}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5" title={lot.location}>
                              {lot.location ? lot.location.split("(")[0].trim() : "Két K1"}
                            </span>
                          </div>
                        </td>

                        {/* 3. SL Đặt của Item */}
                        <td className="px-3 py-3.5 text-center bg-emerald-50/20 align-middle">
                          <span className="font-mono font-black text-sm text-emerald-950">
                            {group.orderQty}
                          </span>
                        </td>

                        {/* 4. Số Lượng Tồn Kho của Lô này */}
                        <td className="px-3 py-3.5 text-center align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {lot.availableQty} món
                          </span>
                        </td>

                        {/* 5. Mã Đơn Hàng Cũ kèm Tooltip lý do hủy */}
                        <td className="px-3 py-3.5 text-center align-middle">
                          <div className="relative inline-block group">
                            <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 hover:bg-amber-100 hover:border-amber-300 cursor-help transition-colors inline-flex items-center space-x-1">
                              <span>{lot.oldOrderCode || "-"}</span>
                              <Info className="h-3 w-3 text-amber-600" />
                            </span>

                            {/* Tooltip hiển thị lý do hủy khi rê chuột */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none text-left whitespace-normal">
                              <span className="font-bold text-amber-400 flex items-center mb-0.5">
                                📌 Lô: {lot.lotCode || lot.id}
                              </span>
                              <span className="leading-tight text-slate-200">
                                {lot.sourceReason || "Khách hủy do trễ hẹn giao hàng đợt 1"}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700">
                                Đơn cũ: {lot.oldOrderCode} • {lot.oldCustomer || "Khách hàng cũ"}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          </div>
                        </td>

                        {/* 6. Nguyên Liệu - Tuổi Vàng */}
                        <td className="px-3 py-3.5 text-center align-middle">
                          <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 inline-block font-mono">
                            {order.material || "Vàng"} - {lot.goldType}
                          </span>
                        </td>

                        {/* 7. Ngày Nhập Kho */}
                        <td className="px-3 py-3.5 text-center align-middle">
                          <span className="font-mono text-xs font-semibold text-slate-700 inline-flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                            {lot.dateInStock || "-"}
                          </span>
                        </td>

                        {/* 8. SL PICK CHỌN: Có ô nhập lẻ + nút "Hết lô" (Max) */}
                        <td className="px-3 py-3.5 text-center bg-emerald-50/15 align-middle">
                          <div className="flex items-center justify-center space-x-1.5">
                            <input
                              type="number"
                              min="0"
                              max={lot.availableQty}
                              disabled={!isSelected}
                              value={currentPick}
                              onChange={(e) => handleQtyChange(lot, e.target.value)}
                              className={`w-16 px-2 py-1.5 text-center font-mono font-bold text-xs rounded-lg border focus:outline-none transition-all ${
                                isSelected
                                  ? "bg-white border-[#005a46] text-[#005a46] ring-1 ring-[#005a46] shadow-2xs"
                                  : "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
                              }`}
                            />

                            {/* Nút Chọn Hết Lô */}
                            <button
                              type="button"
                              onClick={() => handlePickMaxLot(lot)}
                              className="px-2 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 border border-emerald-300 rounded-md transition-colors cursor-pointer shrink-0"
                              title="Pick toàn bộ số lượng của lô này"
                            >
                              Hết lô
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>

          {/* KHỐI TỔNG HỢP VÀ KẾT QUẢ PHÂN BỔ 2 LUỒNG (SX MỚI & KHO TP) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-slate-500 block text-[11px]">Tổng SL cần giao:</span>
                <span className="font-mono font-black text-slate-900 text-sm">{totalRequestedCount} món</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-emerald-700 font-bold block text-[11px] flex items-center space-x-1">
                  <span>Luồng 1: Kho TP (Routing FG)</span>
                </span>
                <span className="font-mono font-black text-[#005a46] text-base">{totalPickedCount} món</span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-blue-700 font-bold block text-[11px]">Luồng 2: Sản xuất mới (Full Routing):</span>
                <span className="font-mono font-black text-blue-900 text-base">{totalNewProductionCount} món</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic text-right">
              {totalPickedCount > 0 ? (
                <span className="text-emerald-800 font-medium">
                  ✓ Đã phân bổ {totalPickedCount} món từ các lô kho TP • {totalNewProductionCount} món chuyển sản xuất mới
                </span>
              ) : (
                <span>Chưa chọn lô nào (100% sẽ sản xuất mới)</span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={totalPickedCount === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 transition-all cursor-pointer ${
                totalPickedCount > 0
                  ? "bg-[#005a46] hover:bg-[#004737] text-white ring-2 ring-emerald-500/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <PackageCheck className="h-4 w-4" />
              <span>Xác nhận pick chọn ({totalPickedCount} món Kho TP • {totalNewProductionCount} món SX mới)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
