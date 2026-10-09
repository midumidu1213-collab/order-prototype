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
  PackageCheck,
  CheckSquare,
  Square,
  Zap,
  FolderOpen,
  ArrowRight
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

  // Khởi tạo mặc định khi mở popup: Tự động pick từ các lô cũ nhất tới mới (FIFO) cho đến khi đủ SL đặt
  useEffect(() => {
    if (matchedStockList.length > 0 && order && isOpen) {
      const initialQty = {};
      const initialSelected = new Set();

      groupedItems.forEach((group) => {
        let remainingNeeded = group.orderQty;

        // Duyệt qua từng lô của item này
        group.lots.forEach((lot) => {
          if (remainingNeeded > 0) {
            const take = Math.min(lot.availableQty, remainingNeeded);
            initialQty[lot.id] = take;
            if (take > 0) {
              initialSelected.add(lot.id);
              remainingNeeded -= take;
            }
          } else {
            initialQty[lot.id] = 0;
          }
        });
      });

      setPickQuantities(initialQty);
      setSelectedIds(initialSelected);
    }
  }, [matchedStockList, order, isOpen, groupedItems]);

  if (!isOpen || !order) return null;

  // Toggle chọn / bỏ chọn một Lô cụ thể
  const handleToggleLot = (stock) => {
    const stockId = stock.id;
    const group = groupedItems.find((g) => g.itemCode?.toLowerCase() === stock.itemCode?.toLowerCase());
    const maxNeeded = group ? group.orderQty : 100;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stockId)) {
        next.delete(stockId);
        setPickQuantities((q) => ({ ...q, [stockId]: 0 }));
      } else {
        next.add(stockId);
        // Khi tick chọn, tự động tính số lượng còn cần cho Item này
        const currentOtherLotsPick = (group?.lots || [])
          .filter((l) => l.id !== stockId && next.has(l.id))
          .reduce((sum, l) => sum + (Number(pickQuantities[l.id]) || 0), 0);
        
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
    setSelectedIds((prev) => new Set([...prev, stockId]));
    setPickQuantities((q) => ({ ...q, [stockId]: stock.availableQty }));
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

  // Chọn toàn bộ các lô của một Item cụ thể
  const handleSelectAllLotsOfGroup = (group) => {
    const nextSelected = new Set(selectedIds);
    const nextQty = { ...pickQuantities };
    let remainingNeeded = group.orderQty;

    group.lots.forEach((lot) => {
      nextSelected.add(lot.id);
      const take = Math.min(lot.availableQty, remainingNeeded > 0 ? remainingNeeded : lot.availableQty);
      nextQty[lot.id] = take;
      remainingNeeded -= take;
    });

    setSelectedIds(nextSelected);
    setPickQuantities(nextQty);
  };

  // Hủy chọn tất cả các lô của một Item cụ thể
  const handleDeselectAllLotsOfGroup = (group) => {
    const nextSelected = new Set(selectedIds);
    const nextQty = { ...pickQuantities };

    group.lots.forEach((lot) => {
      nextSelected.delete(lot.id);
      nextQty[lot.id] = 0;
    });

    setSelectedIds(nextSelected);
    setPickQuantities(nextQty);
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

      groupedItems.forEach((group) => {
        let remainingNeeded = group.orderQty;
        group.lots.forEach((lot) => {
          allSelected.add(lot.id);
          const take = Math.min(lot.availableQty, remainingNeeded > 0 ? remainingNeeded : lot.availableQty);
          filledQty[lot.id] = take;
          remainingNeeded -= take;
        });
      });

      setSelectedIds(allSelected);
      setPickQuantities(filledQty);
    }
  };

  // Tính tổng số lượng đã pick của một Item
  const getItemPickedQty = (group) => {
    return group.lots.reduce((sum, lot) => {
      if (selectedIds.has(lot.id)) {
        return sum + (Number(pickQuantities[lot.id]) || 0);
      }
      return sum;
    }, 0);
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
          bagCode: stock.bagCode,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      {/* POPUP CONTAINER MỞ RỘNG RỘNG RÃI (W-[96VW] MAX-W-[1550PX]) ĐỂ XEM FULL 100% THÔNG TIN */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[96vw] max-w-[1550px] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER POPUP */}
        <div className="bg-gradient-to-r from-[#005a46] via-[#004737] to-[#013328] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <Warehouse className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Danh Sách Mặt Hàng Trong Kho Thành Phẩm Chờ Xử Lý</span>
                <span className="text-[11px] bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                  Quản lý theo Cấp Lô (1 Lô / Túi ≤ 10 món)
                </span>
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Đơn hàng: <strong className="text-white font-mono">{order.code}</strong> • Trạng thái: <span className="bg-white/20 px-2 py-0.5 rounded font-semibold">{order.status}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NỘI DUNG CUỘN CHÍNH */}
        <div className="p-6 space-y-4 max-h-[84vh] overflow-y-auto">
          
          {/* BANNER NGUYÊN TẮC NGHIỆP VỤ & ROUTING FG CỐ ĐỊNH */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-2 font-bold text-amber-900 text-[13px]">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Quy tắc khớp 100% thuộc tính & Tách 2 luồng KHSX theo Cấp Lô:</span>
            </div>
            <div className="pl-6 space-y-1 text-slate-700">
              <div>
                • <strong>1 Lô ~ 1 Bag (SL không quá 10 món):</strong> Một Item trong kho gồm nhiều lô/túi khác nhau. Cho phép tùy chọn số lượng từng lô hoặc chọn hết lô. Số lượng còn lại tự động chuyển sang luồng <strong>Sản xuất mới</strong>.
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-900">
                <PackageCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  • <strong>Gán Routing cố định (Type: FG):</strong> Phần số lượng pick từ kho được cố định 2 công đoạn: <span className="font-bold text-[#005a46] bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono">1. Serve FG (Phục vụ kho TP)</span> → <span className="font-bold text-[#005a46] bg-emerald-100/80 px-1.5 py-0.5 rounded font-mono">2. Packing Out (Đóng gói xuất kho)</span>.
                </span>
              </div>
            </div>
          </div>

          {/* BẢNG CHI TIẾT THEO ITEM VÀ CÁC LÔ CON (KHÔNG BỊ CO ÉP, XEM ĐẦY ĐỦ 100%) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
            <table className="w-full min-w-[1300px] divide-y divide-slate-200 text-left text-xs">
              
              {/* HEADER BẢNG */}
              <thead className="bg-slate-100/90 font-bold text-slate-700 uppercase tracking-wider text-[11px] whitespace-nowrap">
                <tr>
                  <th className="px-3 py-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAllGlobal}
                      className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                      title="Chọn tất cả các lô trên toàn bộ popup"
                    />
                  </th>
                  <th className="px-4 py-3 min-w-[240px]">Mã Item & Sản Phẩm</th>
                  
                  {/* CỘT ĐỎ: CẤP LÔ HÀNG (NẰM GIỮA MÃ ITEM VÀ SL ĐẶT) */}
                  <th className="px-3 py-3 text-center bg-emerald-50/80 border-x border-emerald-200 text-[#005a46] font-black w-44">
                    <div className="flex items-center justify-center space-x-1">
                      <Layers className="h-3.5 w-3.5" />
                      <span>LÔ HÀNG (LOT)</span>
                    </div>
                  </th>

                  <th className="px-3 py-3 text-center text-emerald-950 bg-emerald-50/40 w-24">SL ĐẶT</th>
                  <th className="px-3 py-3 text-center w-36 text-[#005a46] font-black">SL TỒN CỦA LÔ</th>
                  <th className="px-3 py-3 text-center w-32">MÃ ĐƠN CŨ</th>
                  <th className="px-3 py-3 text-center w-36">NGUYÊN LIỆU - TUỔI VÀNG</th>
                  <th className="px-3 py-3 text-center w-32">NGÀY NHẬP KHO</th>
                  <th className="px-4 py-3 text-center min-w-[210px] w-56 bg-emerald-50/30 text-[#005a46] font-black">
                    SL PICK CHỌN (TỪNG LÔ)
                  </th>
                </tr>
              </thead>

              {/* BODY BẢNG: PHÂN CẤP THEO ITEM VÀ CÁC LÔ CON */}
              <tbody className="divide-y divide-slate-100 bg-white">
                {groupedItems.map((group) => {
                  const itemPickedTotal = getItemPickedQty(group);
                  const isItemFullyPicked = itemPickedTotal >= group.orderQty;
                  const itemRemainingNewProd = Math.max(0, group.orderQty - itemPickedTotal);
                  const selectedLotsInGroup = group.lots.filter((l) => selectedIds.has(l.id)).length;

                  return (
                    <tbody key={group.itemCode} className="border-b-2 border-slate-200">
                      
                      {/* 1. THANH TỔNG QUAN ITEM (ITEM GROUP HEADER BAR) */}
                      <tr className="bg-slate-50/95 border-t border-b border-slate-200 font-medium">
                        <td className="px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedLotsInGroup === group.lots.length}
                            onChange={() => {
                              if (selectedLotsInGroup === group.lots.length) {
                                handleDeselectAllLotsOfGroup(group);
                              } else {
                                handleSelectAllLotsOfGroup(group);
                              }
                            }}
                            className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                            title="Chọn / Bỏ chọn toàn bộ lô của item này"
                          />
                        </td>
                        <td colSpan={2} className="px-4 py-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-xs text-slate-900">
                              {group.itemCode30?.replace(/\//g, "")}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              • {group.itemName}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              (Ni: {group.size} | Đá: {group.stoneColor || "Trắng"})
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 font-mono">
                              {group.lots.length} lô tồn kho (≤10 món/lô)
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-black text-xs text-slate-900">
                          {group.orderQty}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-xs text-slate-700">
                          Tổng tồn: <strong className="text-emerald-800">{group.totalStockQty} món</strong>
                        </td>
                        <td colSpan={3} className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center space-x-2 text-[11px]">
                            <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Đã chọn pick: <strong>{itemPickedTotal} / {group.orderQty} món</strong> ({selectedLotsInGroup}/{group.lots.length} lô)
                            </span>
                            <span className="font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200">
                              Còn lại SX mới: <strong>{itemRemainingNewProd} món</strong>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectAllLotsOfGroup(group)}
                              className="px-2 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md transition-colors cursor-pointer"
                              title="Tự động chọn tất cả các lô cho item này"
                            >
                              ⚡ Pick hết lô
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeselectAllLotsOfGroup(group)}
                              className="px-2 py-1 text-[10px] font-medium text-slate-600 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-md transition-colors cursor-pointer"
                              title="Bỏ chọn tất cả các lô của item này"
                            >
                              Bỏ chọn
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* 2. CÁC DÒNG LÔ CON CỦA ITEM (LOT ROWS) */}
                      {group.lots.map((lot, lotIdx) => {
                        const isSelected = selectedIds.has(lot.id);
                        const currentPick = pickQuantities[lot.id] || 0;

                        return (
                          <tr 
                            key={lot.id} 
                            className={`transition-colors ${
                              isSelected ? "bg-emerald-50/20" : "hover:bg-slate-50/70"
                            }`}
                          >
                            {/* Checkbox của từng lô */}
                            <td className="px-3 py-3 text-center align-middle">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleLot(lot)}
                                className="w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] border-slate-300 cursor-pointer"
                              />
                            </td>

                            {/* Cột Tên & Thứ tự Lô */}
                            <td className="px-4 py-3 align-middle">
                              <div className="flex items-center space-x-1.5 pl-3 border-l-2 border-emerald-400">
                                <span className="text-[11px] font-mono font-bold text-slate-500">
                                  ↳ Lô {lotIdx + 1}/{group.lots.length}:
                                </span>
                                <span className="text-xs text-slate-800 font-semibold">
                                  {lot.itemName}
                                </span>
                              </div>
                            </td>

                            {/* CỘT ĐỎ: MÃ LÔ HÀNG (LOT CODE) */}
                            <td className="px-3 py-3 text-center bg-emerald-50/40 border-x border-emerald-200/70 align-middle">
                              <div className="inline-flex flex-col items-center">
                                <span className="font-mono font-black text-xs text-[#005a46] bg-white border border-emerald-300 px-2.5 py-1 rounded-md shadow-2xs">
                                  {lot.lotCode || `LOT-${lot.id}`}
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5" title={lot.location}>
                                  {lot.location ? lot.location.split("(")[0].trim() : "Két K1"}
                                </span>
                              </div>
                            </td>

                            {/* SL Đặt của Item */}
                            <td className="px-3 py-3 text-center bg-emerald-50/15 align-middle font-mono font-bold text-xs text-slate-500">
                              {group.orderQty}
                            </td>

                            {/* SL TỒN CỦA LÔ NÀY (LUÔN <= 10 MÓN THEO CHUẨN THỰC TẾ) */}
                            <td className="px-3 py-3 text-center align-middle">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                                {lot.availableQty} món
                              </span>
                            </td>

                            {/* Mã Đơn Hàng Cũ kèm Tooltip */}
                            <td className="px-3 py-3 text-center align-middle">
                              <div className="relative inline-block group">
                                <span className="font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 hover:bg-amber-100 hover:border-amber-300 cursor-help transition-colors inline-flex items-center space-x-1">
                                  <span>{lot.oldOrderCode || "-"}</span>
                                  <Info className="h-3 w-3 text-amber-600" />
                                </span>

                                {/* Tooltip lý do hủy */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none text-left whitespace-normal">
                                  <span className="font-bold text-amber-400 mb-0.5">
                                    📌 Lô: {lot.lotCode || lot.id} (Túi: {lot.bagCode})
                                  </span>
                                  <span className="leading-tight text-slate-200">
                                    {lot.sourceReason || "Khách hủy do trễ hẹn giao hàng đợt 1"}
                                  </span>
                                  <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700">
                                    SO cũ: {lot.oldOrderCode} • {lot.oldCustomer || "Khách hàng cũ"}
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                                </div>
                              </div>
                            </td>

                            {/* Nguyên Liệu - Tuổi Vàng */}
                            <td className="px-3 py-3 text-center align-middle">
                              <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 inline-block font-mono">
                                Vàng - {lot.goldType}
                              </span>
                            </td>

                            {/* Ngày Nhập Kho */}
                            <td className="px-3 py-3 text-center align-middle">
                              <span className="font-mono text-xs font-semibold text-slate-700 inline-flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                                {lot.dateInStock || "-"}
                              </span>
                            </td>

                            {/* SL PICK CHỌN TỪNG LÔ: RỘNG RÃI, THOÁNG ĐÃNG, KHÔNG BỊ CẮT XÉN */}
                            <td className="px-4 py-3 text-center bg-emerald-50/20 align-middle">
                              <div className="flex items-center justify-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={lot.availableQty}
                                  disabled={!isSelected}
                                  value={currentPick}
                                  onChange={(e) => handleQtyChange(lot, e.target.value)}
                                  className={`w-16 px-2 py-1.5 text-center font-mono font-black text-xs rounded-lg border focus:outline-none transition-all ${
                                    isSelected
                                      ? "bg-white border-[#005a46] text-[#005a46] ring-1 ring-[#005a46] shadow-2xs"
                                      : "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
                                  }`}
                                />

                                {/* Nút Chọn Hết Lô Này */}
                                <button
                                  type="button"
                                  onClick={() => handlePickMaxLot(lot)}
                                  className="px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                                  title={`Pick toàn bộ ${lot.availableQty} món của lô này`}
                                >
                                  Hết lô
                                </button>

                                <span className="text-[10px] text-slate-400 font-mono">
                                  / max {lot.availableQty}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TỔNG KẾT PHÂN BỔ 2 LUỒNG TRONG POPUP */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-slate-500 block text-[11px]">Tổng SL cần giao:</span>
                <span className="font-mono font-black text-sm text-slate-900">{totalRequestedCount} món</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-emerald-700 block text-[11px] font-bold">Luồng 1: Kho TP (Routing FG - 2 CĐ):</span>
                <span className="font-mono font-black text-sm text-emerald-800">{totalPickedCount} món</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-sky-700 block text-[11px] font-bold">Luồng 2: Sản xuất mới (Full Routing):</span>
                <span className="font-mono font-black text-sm text-sky-800">{totalNewProductionCount} món</span>
              </div>
            </div>
            
            <div className="text-right text-[11px] text-slate-500">
              ✓ Đã phân bổ <strong>{totalPickedCount} món</strong> từ <strong>{selectedIds.size} lô</strong> kho TP + <strong>{totalNewProductionCount} món</strong> chuyển sản xuất mới
            </div>
          </div>

        </div>

        {/* FOOTER POPUP */}
        <div className="bg-slate-100/90 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Đã chọn <strong className="text-emerald-800 font-mono">{selectedIds.size}</strong> lô • Tổng số lượng pick kho: <strong className="text-emerald-800 font-mono text-sm">{totalPickedCount}</strong> món
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#005a46] hover:bg-[#004737] shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Xác nhận pick chọn ({totalPickedCount} món Kho TP + {totalNewProductionCount} món SX mới)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
