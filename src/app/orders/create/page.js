"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Plus, 
  Upload, 
  ImageIcon, 
  Warehouse, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight
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

  // State các dòng sản phẩm trong đơn hàng
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
      qty: 1,
      customerReq: "Làm kỹ",
      note: "Yêu cầu hoàn thiện cao cấp",
      weight: "3.42g",
      unitPrice: 480000, // Tiền công KH mới
      // Trạng thái nguồn gốc sản phẩm
      sourceType: "NEW_PRODUCTION", // "NEW_PRODUCTION" | "WAREHOUSE_REWORK"
      assignedStock: null, // Chi tiết item kho nếu chọn
      stoneHoldStatus: "HELD_FOR_PRODUCTION" // "HELD_FOR_PRODUCTION" | "RELEASED_TO_STOCK"
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
      size: 48, // Ni 48 (Trong kho có mẫu Ni 48 WP-003)
      qty: 1,
      customerReq: "Tiêu chuẩn",
      note: "-",
      weight: "3.60g",
      unitPrice: 480000,
      sourceType: "NEW_PRODUCTION",
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
      qty: 1,
      customerReq: "Đồng bộ",
      note: "Bộ 3 món (Dây + Lắc + Nhẫn)",
      weight: "28.50g",
      unitPrice: 3200000,
      sourceType: "NEW_PRODUCTION",
      assignedStock: null,
      stoneHoldStatus: "HELD_FOR_PRODUCTION"
    }
  ]);

  // Modal State
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mở modal tra cứu cho dòng được chọn
  const handleOpenStockModal = (item) => {
    setSelectedItemForModal(item);
    setIsModalOpen(true);
  };

  // Chọn Item từ kho thành phẩm
  const handleSelectStockItem = (stockItem) => {
    if (!selectedItemForModal) return;

    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.stt === selectedItemForModal.stt) {
          return {
            ...item,
            sourceType: "WAREHOUSE_REWORK",
            assignedStock: stockItem,
            // Cơ chế cốt lõi: Tự động Nhả 100% đá tạm hold về tồn khả dụng vì phôi kho đã ngậm đủ đá
            stoneHoldStatus: "RELEASED_TO_STOCK",
            // Tiền công tính độc lập theo khách hàng mới
            unitPrice: stockItem.standardLaborPrice || item.unitPrice,
            note: `Lấy từ kho TP (${stockItem.bagCode} - ${stockItem.location})`
          };
        }
        return item;
      })
    );

    setIsModalOpen(false);
    setSelectedItemForModal(null);
  };

  // Hủy chọn từ kho, quay lại sản xuất mới
  const handleRevertToNewProduction = (stt) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.stt === stt) {
          return {
            ...item,
            sourceType: "NEW_PRODUCTION",
            assignedStock: null,
            // Kích hoạt lại việc giữ chỗ đá sản xuất mới
            stoneHoldStatus: "HELD_FOR_PRODUCTION",
            note: "-"
          };
        }
        return item;
      })
    );
  };

  // Thống kê nhanh
  const totalReworkItems = orderItems.filter((i) => i.sourceType === "WAREHOUSE_REWORK").length;
  const totalNewItems = orderItems.filter((i) => i.sourceType === "NEW_PRODUCTION").length;

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
              Hỗ trợ Kho Chờ Xử Lý (Phase 1)
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
              Hệ thống tự động quét Kho Thành Phẩm Chờ Xử Lý Lại và gợi ý các Item khớp 100% thuộc tính
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
                <th className="px-3 py-3 text-center">SL</th>
                <th className="px-3 py-3">Tiền công (KH Mới)</th>
                <th className="px-3 py-3">Nguồn hàng & Trạng thái Đá</th>
                <th className="px-3 py-3 text-center w-40">Tác vụ Kho TP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              {orderItems.map((item) => {
                // Kiểm tra xem trong kho có bao nhiêu item khớp 100%
                const stockMatches = findMatchingWarehouseItems({
                  itemCode: item.itemCode,
                  goldType: item.goldType,
                  size: item.size,
                  stoneColor: item.stoneColor
                });
                const isRework = item.sourceType === "WAREHOUSE_REWORK";

                return (
                  <tr 
                    key={item.stt} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isRework ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    <td className="px-3 py-3 text-center font-bold text-slate-500">
                      {item.stt}
                    </td>

                    {/* Mã Item */}
                    <td className="px-3 py-3">
                      <div className="font-mono font-bold text-slate-900">{item.itemCode}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.itemName}</div>
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

                    {/* Số lượng */}
                    <td className="px-3 py-3 text-center font-bold text-slate-900">
                      {item.qty}
                    </td>

                    {/* Tiền công */}
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {item.unitPrice.toLocaleString("vi-VN")} đ
                    </td>

                    {/* Nguồn hàng & Trạng thái Đá */}
                    <td className="px-3 py-3">
                      {isRework ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="inline-flex items-center font-bold text-[11px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                              <Warehouse className="h-3 w-3 mr-1 text-emerald-700" />
                              Kho TP: {item.assignedStock?.bagCode}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium">
                              ({item.assignedStock?.location})
                            </span>
                          </div>

                          {/* Trạng thái Nhả Đá */}
                          <div className="flex items-center text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600 shrink-0" />
                            Đã NHẢ 100% đá giữ chỗ về kho (Đá có sẵn trên phôi)
                          </div>

                          <div className="text-[10px] text-slate-500 italic">
                            Routing QLSP: Tẩy xi → Khắc logo mới → Xi mạ → KCS
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center font-semibold text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            Sản xuất mới hoàn toàn
                          </span>
                          <div className="text-[10px] text-amber-700 font-medium">
                            • Tạm giữ chỗ Lần 1: 1 viên chủ + đá tấm
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Tác vụ Kho TP */}
                    <td className="px-3 py-3 text-center">
                      {isRework ? (
                        <button
                          type="button"
                          onClick={() => handleRevertToNewProduction(item.stt)}
                          className="inline-flex items-center px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                          title="Hủy gán item kho và quay lại sản xuất mới"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Hủy chọn kho
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenStockModal(item)}
                          className={`inline-flex items-center px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                            stockMatches.length > 0
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-xs animate-pulse"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                          }`}
                        >
                          <Warehouse className="h-3 w-3 mr-1" />
                          {stockMatches.length > 0 ? (
                            <span>Có {stockMatches.length} SP khớp kho</span>
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
            Thành phẩm lấy từ Kho Chờ Xử Lý
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono">
            {totalReworkItems} <span className="text-xs font-bold text-emerald-700">sản phẩm</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            • <strong>Nhả đá hoàn toàn:</strong> Đã gửi lệnh hoàn nhập 100% đá tạm hold về kho phụ liệu khả dụng.<br/>
            • <strong>Rút ngắn tiến độ:</strong> Chỉ cần 2-3 ngày xử lý bề mặt, khắc logo và xi mạ lại.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
            <Layers className="h-4 w-4 mr-1.5 text-slate-500" />
            Sản xuất đúc mới hoàn toàn
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalNewItems} <span className="text-xs font-bold text-slate-500">sản phẩm</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            • <strong>Đang giữ chỗ đá:</strong> Đã hold đá Lần 1 theo định mức BOM tiêu chuẩn.<br/>
            • <strong>Tiến độ thông thường:</strong> 10-15 ngày (Đúc phôi → Nguội → Gắn đá → Xi mạ → KCS).
          </p>
        </div>

        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center">
            <ShieldCheck className="h-4 w-4 mr-1.5 text-indigo-700" />
            Quy trình phối hợp 4 Phân hệ
          </div>
          <p className="text-xs text-indigo-950 leading-relaxed">
            <strong>1. QLĐH:</strong> Chốt SO với item kho khớp 100% và nhả đá.<br/>
            <strong>2. QLSP:</strong> Cập nhật Routing làm mới cho item kho.<br/>
            <strong>3. KHSX:</strong> Tách 2 Planned Order (Nhóm kho vs Nhóm đúc mới).<br/>
            <strong>4. Kho TP:</strong> Xuất phôi theo mã Bag gán giữ chỗ.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 p-4 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="text-xs text-gray-500 flex items-center space-x-2">
          <span className="font-semibold text-gray-700">Đơn hàng đang tạo:</span>
          <span>{orderItems.length} sản phẩm ({totalReworkItems} lấy từ Kho TP, {totalNewItems} đúc mới)</span>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2 border border-gray-300 rounded-xl bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50">
            Lưu nháp
          </button>
          <button className="px-6 py-2 border border-transparent rounded-xl text-xs font-bold text-white bg-[#005a46] hover:bg-[#004737] shadow-sm flex items-center space-x-1.5">
            <span>Xác nhận & Gửi duyệt kỹ thuật</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal Tra cứu Kho Thành Phẩm */}
      <WarehouseStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetItem={selectedItemForModal}
        customerName={customerInfo.name}
        onSelectStock={handleSelectStockItem}
      />
    </div>
  );
}
