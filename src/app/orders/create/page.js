"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Plus, 
  Upload, 
  Warehouse, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight,
  Split,
  Lightbulb
} from "lucide-react";
import WarehouseStockModal from "@/components/orders/WarehouseStockModal";
import { findMatchingWarehouseItems } from "@/data/warehouseStockData";

export default function CreateOrder() {
  const [customerInfo, setCustomerInfo] = useState({
    code: "2000001",
    name: "Công ty TNHH Vàng Bạc Kim Yến",
    team: "Sale A II Hà Nội",
    goldType: "61Y"
  });

  // Dòng sản phẩm mẫu (với Dòng 1 đặt 100 món để minh họa đúng tình huống: Đặt 100, Kho có 80)
  const [orderItems, setOrderItems] = useState([
    {
      stt: 1,
      drawingCode: "RG202500006",
      itemCode: "RG202500006",
      itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
      goldType: "61Y",
      platingColor: "X",
      stoneColor: "Xanh",
      stoneType: "Sapphire Xanh & CZ",
      size: 45,
      qty: 100, // Khách đặt 100 chiếc!
      customerReq: "Làm kỹ",
      note: "Yêu cầu hoàn thiện cao cấp",
      weight: "3.42g",
      unitPrice: 480000, // Tiền công KH mới
      // Phân bổ số lượng
      sourceType: "NEW_PRODUCTION", // "NEW_PRODUCTION" | "SPLIT_ALLOCATION" | "WAREHOUSE_REWORK"
      qtyFromStock: 0,
      qtyNewProduction: 100,
      assignedStock: null,
      stoneHoldStatus: "HELD_FOR_PRODUCTION" // "HELD_FOR_PRODUCTION" | "PARTIALLY_RELEASED"
    },
    {
      stt: 2,
      drawingCode: "RG202500006",
      itemCode: "RG202500006",
      itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
      goldType: "61Y",
      platingColor: "X",
      stoneColor: "Xanh",
      stoneType: "Sapphire Xanh & CZ",
      size: 48, // Ni 48 (Kho có sẵn 15 chiếc)
      qty: 10,
      customerReq: "Tiêu chuẩn",
      note: "-",
      weight: "3.60g",
      unitPrice: 480000,
      sourceType: "NEW_PRODUCTION",
      qtyFromStock: 0,
      qtyNewProduction: 10,
      assignedStock: null,
      stoneHoldStatus: "HELD_FOR_PRODUCTION"
    },
    {
      stt: 3,
      drawingCode: "SET-EMERALD-01",
      itemCode: "SET-EMERALD-01",
      itemName: "Bộ Hoàng Gia Emerald Quý Tộc",
      goldType: "75Y",
      platingColor: "Vàng",
      stoneColor: "Xanh Lục Bảo",
      stoneType: "Emerald Colombia",
      size: 52,
      qty: 5, // Kho có sẵn 2 bộ
      customerReq: "Đồng bộ",
      note: "Bộ 3 món (Dây + Lắc + Nhẫn)",
      weight: "28.50g",
      unitPrice: 3200000,
      sourceType: "NEW_PRODUCTION",
      qtyFromStock: 0,
      qtyNewProduction: 5,
      assignedStock: null,
      stoneHoldStatus: "HELD_FOR_PRODUCTION"
    }
  ]);

  // Modal State
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở modal review kho cho dòng được chọn
  const handleOpenStockModal = (item) => {
    setSelectedItemForModal(item);
    setIsModalOpen(true);
  };

  // Xác nhận đồng bộ & phân bổ từ modal
  const handleConfirmSync = ({ stockItem, qtyFromStock, qtyNewProduction }) => {
    if (!selectedItemForModal) return;

    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.stt === selectedItemForModal.stt) {
          const isFullWarehouse = qtyNewProduction === 0;
          return {
            ...item,
            sourceType: isFullWarehouse ? "WAREHOUSE_REWORK" : "SPLIT_ALLOCATION",
            assignedStock: stockItem,
            qtyFromStock,
            qtyNewProduction,
            // Cơ chế cốt lõi: Nhả đúng số phần đá tương ứng với số món lấy từ kho
            stoneHoldStatus: "PARTIALLY_RELEASED",
            unitPrice: stockItem.standardLaborPrice || item.unitPrice,
            note: `Đồng bộ kho: ${qtyFromStock} món (${stockItem.bagCode}) + ${qtyNewProduction} món SX mới`
          };
        }
        return item;
      })
    );

    setIsModalOpen(false);
    setSelectedItemForModal(null);
  };

  // Hủy đồng bộ kho, quay lại sản xuất mới hoàn toàn
  const handleRevertToNewProduction = (stt) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.stt === stt) {
          return {
            ...item,
            sourceType: "NEW_PRODUCTION",
            assignedStock: null,
            qtyFromStock: 0,
            qtyNewProduction: item.qty,
            stoneHoldStatus: "HELD_FOR_PRODUCTION",
            note: "-"
          };
        }
        return item;
      })
    );
  };

  // Thống kê nhanh toàn đơn
  const totalQty = orderItems.reduce((acc, i) => acc + i.qty, 0);
  const totalStockAllocated = orderItems.reduce((acc, i) => acc + i.qtyFromStock, 0);
  const totalNewProduction = orderItems.reduce((acc, i) => acc + i.qtyNewProduction, 0);

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách
          </Link>
          <span className="mx-2 text-gray-300">|</span>
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            Thêm mới đơn hàng bán (Sales Order)
            <span className="ml-3 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
              Nhận diện Tồn kho & Phân bổ (Phase 1)
            </span>
          </h2>
        </div>
      </div>

      {/* Thông tin chung */}
      <div className="bg-white shadow-xs rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-[#005a46] uppercase tracking-wider">
            1. Thông tin chung đơn hàng
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mã khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm font-mono font-bold bg-gray-50"
              value={customerInfo.code}
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm font-bold text-gray-900 bg-gray-50"
              value={customerInfo.name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Đội/nhóm phụ trách <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-gray-50 text-gray-700"
              value={customerInfo.team}
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Loại đơn hàng</label>
            <select className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white font-medium">
              <option>Đơn hàng Bán thương mại</option>
              <option>Đơn hàng Gia công</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tuổi vàng chủ đạo</label>
            <select
              value={customerInfo.goldType}
              onChange={(e) => setCustomerInfo({ ...customerInfo, goldType: e.target.value })}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white font-bold text-emerald-800"
            >
              <option value="61Y">61Y (Vàng 14K)</option>
              <option value="75W">75W (Vàng trắng 18K)</option>
              <option value="75Y">75Y (Vàng vàng 18K)</option>
              <option value="41.6Y">41.6Y (Vàng 10K)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ngày đặt hàng</label>
            <input type="date" defaultValue="2026-08-24" className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ngày hẹn giao</label>
            <input type="date" defaultValue="2026-09-05" className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm font-medium" />
          </div>
        </div>
      </div>

      {/* Thông tin dòng sản phẩm */}
      <div className="bg-white shadow-xs rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#005a46] uppercase tracking-wider flex items-center">
              2. Danh sách sản phẩm đặt hàng
              <span className="ml-2 text-xs font-bold text-slate-500 lowercase">({orderItems.length} dòng hàng)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống tự động nhận diện mã item khớp với Kho Chờ Xử Lý và gợi ý nút <strong>Đồng bộ thông tin</strong> để review
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs">
              <Upload className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              Import Excel
            </button>
            <button className="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#005a46] hover:bg-[#004737] shadow-2xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Thêm dòng mới
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 w-12 text-center">STT</th>
                <th className="px-3 py-3">Mã Item / Tên</th>
                <th className="px-3 py-3">Tuổi vàng</th>
                <th className="px-3 py-3">Ni / Size</th>
                <th className="px-3 py-3">Đá / Màu</th>
                <th className="px-3 py-3 text-center">SL Đặt</th>
                <th className="px-3 py-3">Tiền công (KH Mới)</th>
                <th className="px-3 py-3">Kế hoạch Phân bổ & Điều tiết Đá</th>
                <th className="px-3 py-3 text-center w-48">Tác vụ Đồng bộ Kho</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              {orderItems.map((item) => {
                // Tự động quét kiểm tra tồn kho khớp 100%
                const stockMatches = findMatchingWarehouseItems({
                  itemCode: item.itemCode,
                  goldType: item.goldType,
                  size: item.size,
                  stoneColor: item.stoneColor
                });
                const totalStockAvailable = stockMatches.reduce((acc, s) => acc + s.availableQty, 0);

                const isSynced = item.sourceType === "WAREHOUSE_REWORK" || item.sourceType === "SPLIT_ALLOCATION";

                return (
                  <tr 
                    key={item.stt} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSynced ? "bg-emerald-50/25" : ""
                    }`}
                  >
                    <td className="px-3 py-3 text-center font-bold text-slate-500">
                      {item.stt}
                    </td>

                    {/* Mã Item */}
                    <td className="px-3 py-3">
                      <div className="font-mono font-bold text-slate-900">{item.itemCode}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.itemName}</div>
                      
                      {/* GỢI Ý NHẬN DIỆN TỰ ĐỘNG (Smart Suggestion) nếu chưa đồng bộ */}
                      {!isSynced && totalStockAvailable > 0 && (
                        <div className="mt-1 flex items-center space-x-1 text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80">
                          <Lightbulb className="h-3 w-3 text-amber-600 shrink-0" />
                          <span>Kho có sẵn <strong>{totalStockAvailable} món</strong> khớp 100%</span>
                        </div>
                      )}
                    </td>

                    {/* Tuổi vàng */}
                    <td className="px-3 py-3">
                      <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {item.goldType}
                      </span>
                    </td>

                    {/* Ni/Size */}
                    <td className="px-3 py-3">
                      <span className="font-bold text-slate-800">Ni {item.size}</span>
                    </td>

                    {/* Đá */}
                    <td className="px-3 py-3">
                      <div className="font-semibold text-indigo-900">{item.stoneColor}</div>
                      <div className="text-[10px] text-slate-400">{item.stoneType}</div>
                    </td>

                    {/* Số lượng đặt */}
                    <td className="px-3 py-3 text-center font-mono font-black text-sm text-slate-900">
                      {item.qty}
                    </td>

                    {/* Tiền công */}
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {item.unitPrice.toLocaleString("vi-VN")} đ
                    </td>

                    {/* Kế hoạch Phân bổ & Điều tiết Đá */}
                    <td className="px-3 py-3">
                      {isSynced ? (
                        <div className="space-y-1.5">
                          {/* Chi tiết phân bổ */}
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center font-bold text-[11px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                              <Warehouse className="h-3 w-3 mr-1 text-emerald-700" />
                              Kho TP: {item.qtyFromStock} món
                            </span>
                            {item.qtyNewProduction > 0 && (
                              <span className="inline-flex items-center font-bold text-[11px] text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded">
                                <Layers className="h-3 w-3 mr-1 text-blue-700" />
                                Đúc mới: {item.qtyNewProduction} món
                              </span>
                            )}
                          </div>

                          {/* Trạng thái Điều tiết Đá */}
                          <div className="text-[10px] text-emerald-800 font-semibold bg-white p-1.5 rounded border border-emerald-200 space-y-0.5">
                            <div className="flex items-center text-emerald-700 font-bold">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600 shrink-0" />
                              Đã NHẢ {item.qtyFromStock} phần đá giữ chỗ về kho phụ liệu
                            </div>
                            {item.qtyNewProduction > 0 && (
                              <div className="text-blue-700 pl-4">
                                • Giữ chỗ {item.qtyNewProduction} phần đá cho đợt đúc mới
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-500 italic">
                            Chờ QLSP cập nhật Routing → Chuyển &apos;Đủ thông tin KT&apos;
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center font-semibold text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            Sản xuất mới 100% ({item.qty} món)
                          </span>
                          <div className="text-[10px] text-amber-700 font-medium">
                            • Tạm giữ chỗ Lần 1: {item.qty} phần đá (BOM chuẩn)
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Tác vụ Đồng bộ Kho */}
                    <td className="px-3 py-3 text-center">
                      {isSynced ? (
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenStockModal(item)}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                          >
                            Review lại
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevertToNewProduction(item.stt)}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                            title="Hủy phân bổ kho và quay lại sản xuất mới hoàn toàn"
                          >
                            <RotateCcw className="h-3 w-3 inline mr-0.5" />
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenStockModal(item)}
                          className={`inline-flex items-center px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                            totalStockAvailable > 0
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-300" />
                          {totalStockAvailable > 0 ? (
                            <span>Đồng bộ kho ({totalStockAvailable})</span>
                          ) : (
                            <span>Tra cứu kho</span>
                          )}
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

      {/* Card Tóm tắt Điều phối Vật tư & Kế hoạch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
            <Warehouse className="h-4 w-4 mr-1.5 text-emerald-700" />
            1. Sản phẩm lấy từ Kho Chờ Xử Lý
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono">
            {totalStockAllocated} <span className="text-xs font-bold text-emerald-700">món</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            • <strong>Đã nhả đá giữ chỗ:</strong> Hoàn trả 100% đá tương ứng ({totalStockAllocated} phần) về kho phụ liệu khả dụng.<br/>
            • <strong>Rút ngắn tiến độ:</strong> Chỉ cần 2-3 ngày qua xưởng xi mạ & khắc laser.
          </p>
        </div>

        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center">
            <Layers className="h-4 w-4 mr-1.5 text-blue-700" />
            2. Bắt buộc Sản xuất Đúc Mới
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono">
            {totalNewProduction} <span className="text-xs font-bold text-blue-700">món</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            • <strong>Đang giữ chỗ đá:</strong> Duy trì giữ chỗ đá ({totalNewProduction} phần) theo BOM đúc mới.<br/>
            • <strong>Tiến độ:</strong> 10-15 ngày (Đúc phôi → Nguội → Gắn đá → Xi mạ → KCS).
          </p>
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center">
            <ShieldCheck className="h-4 w-4 mr-1.5 text-indigo-700" />
            3. Vòng đời & Ranh giới chuyển KHSX
          </div>
          <p className="text-xs text-indigo-950 leading-relaxed">
            • <strong>QLSP duyệt Routing:</strong> Cập nhật quy trình làm mới.<br/>
            • <strong>Chuyển &apos;Đủ thông tin KT&apos;:</strong> Hệ thống cập nhật trạng thái SO.<br/>
            • <strong>QLĐH bấm Chuyển KHSX:</strong> Bán hàng chủ động chốt gửi lệnh sang KHSX để tách Planned Orders.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 p-4 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="text-xs text-gray-500 flex items-center space-x-2">
          <span className="font-semibold text-gray-700">Tổng đặt hàng:</span>
          <span>
            {totalQty} sản phẩm (<strong>{totalStockAllocated}</strong> lấy từ Kho TP, <strong>{totalNewProduction}</strong> đúc mới)
          </span>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2 border border-gray-300 rounded-xl bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50">
            Lưu nháp đơn hàng
          </button>
          <button className="px-6 py-2 border border-transparent rounded-xl text-xs font-bold text-white bg-[#005a46] hover:bg-[#004737] shadow-sm flex items-center space-x-1.5">
            <span>Xác nhận & Gửi duyệt kỹ thuật (QLSP)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal Review & Đồng bộ Kho Thành Phẩm */}
      <WarehouseStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={selectedItemForModal}
        customerName={customerInfo.name}
        onConfirmSync={handleConfirmSync}
      />
    </div>
  );
}
