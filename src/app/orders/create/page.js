"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronLeft, 
  Search, 
  Upload, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Copy, 
  Users, 
  UserCheck, 
  Layers, 
  Sparkles,
  ArrowRight,
  Package,
  Calendar,
  Tag
} from "lucide-react";
import OrderItemConfigModal from "@/components/orders/OrderItemConfigModal";
import { CHANGE_TYPES_CONFIG } from "@/data/productVersionConfigData";

// Danh sách đội nhóm mẫu
const TEAMS_LIST = [
  "TEAM 5_B2B2C_Miền Tây",
  "TEAM 1_B2B_Hà Nội",
  "Sale A II Hà Nội",
  "TEAM 3_B2B_Miền Trung",
  "TEAM 2_B2B_Miền Nam"
];

// Danh sách khách hàng mẫu
const CUSTOMERS_LIST = [
  {
    code: "2000001",
    name: "CÔNG TY TNHH MTV TIỆM VÀNG MINH PHÁT- KIM BÌNH",
    status: "Tiềm năng",
    team: "TEAM 5_B2B2C_Miền Tây"
  },
  {
    code: "200121 - SEVATECH",
    name: "Công ty Cổ phần Công nghệ Sevatech",
    status: "VIP",
    team: "TEAM 1_B2B_Hà Nội"
  },
  {
    code: "2000002",
    name: "Công ty TNHH Vàng Bạc Kim Yến",
    status: "Thân thiết",
    team: "Sale A II Hà Nội"
  }
];

export default function OrderCreateOrEditPage() {
  // 1. STATE THÔNG TIN CHUNG (Chuẩn 13 trường theo Ảnh 2)
  const [generalInfo, setGeneralInfo] = useState({
    team: "TEAM 5_B2B2C_Miền Tây",
    customerCode: "2000001",
    customerName: "CÔNG TY TNHH MTV TIỆM VÀNG MINH PHÁT- KIM BÌNH",
    customerStatus: "Tiềm năng",
    orderDate: "2026-10-19",
    orderType: "Đơn hàng Gia công",
    material: "Vàng",
    goldType: "61Y (Vàng 14K)",
    stoneMaterial: "Đá CZ",
    notes: ""
  });

  // 2. STATE DANH SÁCH SẢN PHẨM (Khởi tạo sẵn item chuẩn Ảnh 2 & Ảnh 3)
  const [orderItems, setOrderItems] = useState([
    {
      id: "item-1",
      stt: 1,
      image: "/images/products/gold-chain-bracelet.jpg",
      itemCode: "GW0NM000145A00A00000000CZWW1580",
      drawingCode: "BE000145A00",
      productType: "Dây Chuyền Nam",
      platingColor: "Trắng",
      stoneColor: "Trắng",
      size: 58,
      qty: 1,
      changeType: "Đắp lacquer - móc máy",
      changeTypeDescription: "",
      changeTypeCustomSelection: "Nhóm 1 - Men sứ đơn sắc phủ nano",
      formattedChangeDisplay: "Đắp lacquer - móc máy [Nhóm 1 - Men sứ đơn sắc phủ nano]",
      weight: "3.2120g",
      convertedWeight: "3.2120g",
      price: 645000
    }
  ]);

  // State chọn checkbox trên bảng
  const [selectedItemIds, setSelectedItemIds] = useState(new Set(["item-1"]));

  // State Modal Cấu hình Item (Chuẩn Ảnh 3)
  const [editingItem, setEditingItem] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // State nhập tìm kiếm / quét mã sản phẩm
  const [searchProductCode, setSearchProductCode] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Tự động tính tổng Số lượng, Trọng lượng và Giá
  const summaryTotals = useMemo(() => {
    const totalQty = orderItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    const totalWeight = orderItems.reduce((sum, item) => {
      const num = parseFloat(item.weight ? item.weight.replace("g", "") : 0) || 0;
      return sum + num * (Number(item.qty) || 1);
    }, 0);
    const totalPrice = orderItems.reduce((sum, item) => {
      return sum + (Number(item.price) || 0) * (Number(item.qty) || 1);
    }, 0);

    return {
      qty: totalQty,
      weight: totalWeight.toFixed(4),
      price: totalPrice.toLocaleString("vi-VN")
    };
  }, [orderItems]);

  // Xử lý khi đổi khách hàng -> Tự động điền tên, trạng thái, đội nhóm
  const handleCustomerChange = (code) => {
    const found = CUSTOMERS_LIST.find((c) => c.code === code);
    if (found) {
      setGeneralInfo((prev) => ({
        ...prev,
        customerCode: found.code,
        customerName: found.name,
        customerStatus: found.status,
        team: found.team || prev.team
      }));
    } else {
      setGeneralInfo((prev) => ({
        ...prev,
        customerCode: code
      }));
    }
  };

  // Mở modal cấu hình cho dòng sản phẩm
  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsConfigModalOpen(true);
  };

  // Lưu thông tin sau khi cấu hình từ Modal
  const handleSaveItemConfig = (updatedItem) => {
    setOrderItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );
    setToastMessage(`Đã cập nhật cấu hình cho mã ${updatedItem.itemCode}`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Xóa 1 dòng sản phẩm
  const handleDeleteItem = (id) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Chọn / bỏ chọn 1 dòng
  const handleToggleSelectRow = (id) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Chọn / bỏ chọn tất cả
  const handleToggleSelectAll = () => {
    if (selectedItemIds.size === orderItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(orderItems.map((i) => i.id)));
    }
  };

  // Thêm sản phẩm mới khi quét / gõ mã
  const handleAddProductByCode = (e) => {
    if (e.key === "Enter" && searchProductCode.trim()) {
      const newCode = searchProductCode.trim().toUpperCase();
      const newItem = {
        id: `item-${Date.now()}`,
        stt: orderItems.length + 1,
        image: "/images/products/4view-gold-necklace.svg",
        itemCode: newCode,
        drawingCode: newCode.length > 11 ? newCode.substring(2, 13) : "BE000148A00",
        productType: newCode.includes("RG") ? "Nhẫn Nữ" : "Dây Chuyền Nam",
        platingColor: "Trắng",
        stoneColor: "Trắng",
        size: 58,
        qty: 1,
        changeType: "Không thay đổi",
        changeTypeDescription: "",
        changeTypeCustomSelection: "",
        formattedChangeDisplay: "---",
        weight: "3.2120g",
        convertedWeight: "3.2120g",
        price: 480000
      };
      setOrderItems((prev) => [...prev, newItem]);
      setSearchProductCode("");
      // Mở ngay modal cấu hình item vừa thêm
      setEditingItem(newItem);
      setIsConfigModalOpen(true);
    }
  };

  return (
    <div className="space-y-5 pb-24 text-slate-800">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#00594c] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <Check className="h-4 w-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. BREADCRUMB & HEADER - Chuẩn Ảnh 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <span>Quản lý đơn hàng</span>
            <span>&gt;</span>
            <span className="text-gray-600 font-medium">Tạo mới đơn hàng</span>
          </div>

          {/* Tiêu đề trang chuẩn */}
          <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase">
            Thêm mới đơn hàng thủ công
          </h1>
        </div>

        {/* Nút Quay lại */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1 px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Link>
        </div>
      </div>

      {/* 2. CARD 1: THÔNG TIN CHUNG - Chuẩn 13 trường (Lưới 3 cột x 5 hàng) theo Ảnh 2 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-white">
          <h2 className="text-xs font-black text-[#00594c] uppercase tracking-wider">
            Thông tin chung
          </h2>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* HÀNG 1: 3 CỘT */}
            {/* 1. Đội nhóm phụ trách * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                Đội nhóm phụ trách <span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                value={generalInfo.team}
                onChange={(e) => setGeneralInfo({ ...generalInfo, team: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none transition-all cursor-pointer shadow-2xs"
              >
                {TEAMS_LIST.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 2. Mã khách hàng * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <UserCheck className="h-3.5 w-3.5 mr-1 text-gray-400" />
                Mã khách hàng <span className="text-red-500 ml-0.5">*</span>
              </label>
              <select
                value={generalInfo.customerCode}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none transition-all cursor-pointer shadow-2xs"
              >
                {CUSTOMERS_LIST.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Tên khách hàng * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên khách hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={generalInfo.customerName}
                onChange={(e) => setGeneralInfo({ ...generalInfo, customerName: e.target.value })}
                placeholder="Nhập dữ liệu..."
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none transition-all shadow-2xs"
              />
            </div>

            {/* HÀNG 2: 3 CỘT */}
            {/* 4. Trạng thái khách hàng */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Trạng thái khách hàng
              </label>
              <input
                type="text"
                value={generalInfo.customerStatus}
                onChange={(e) => setGeneralInfo({ ...generalInfo, customerStatus: e.target.value })}
                placeholder="Nhập trạng thái..."
                className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none"
              />
            </div>

            {/* 5. Ngày đặt hàng */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ngày đặt hàng
              </label>
              <input
                type="date"
                value={generalInfo.orderDate}
                onChange={(e) => setGeneralInfo({ ...generalInfo, orderDate: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none transition-all cursor-pointer shadow-2xs"
              />
            </div>

            {/* 6. Loại đơn hàng * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Loại đơn hàng <span className="text-red-500">*</span>
              </label>
              <select
                value={generalInfo.orderType}
                onChange={(e) => setGeneralInfo({ ...generalInfo, orderType: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none transition-all cursor-pointer shadow-2xs"
              >
                <option value="Đơn hàng Gia công">Đơn hàng Gia công</option>
                <option value="Đơn hàng Bán thương mại">Đơn hàng Bán thương mại</option>
                <option value="Đơn hàng Đúc sẵn">Đơn hàng Đúc sẵn</option>
              </select>
            </div>

            {/* HÀNG 3: 3 CỘT */}
            {/* 7. Nguyên liệu * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nguyên liệu <span className="text-red-500">*</span>
              </label>
              <select
                value={generalInfo.material}
                onChange={(e) => setGeneralInfo({ ...generalInfo, material: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none transition-all cursor-pointer shadow-2xs"
              >
                <option value="Vàng">Vàng</option>
                <option value="Bạc">Bạc</option>
                <option value="Bạch kim">Bạch kim</option>
                <option value="N/A">N/A</option>
              </select>
            </div>

            {/* 8. Tuổi * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tuổi <span className="text-red-500">*</span>
              </label>
              <select
                value={generalInfo.goldType}
                onChange={(e) => setGeneralInfo({ ...generalInfo, goldType: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 outline-none transition-all cursor-pointer shadow-2xs"
              >
                <option value="61Y (Vàng 14K)">61Y (Vàng 14K)</option>
                <option value="75Y (Vàng 18K)">75Y (Vàng 18K)</option>
                <option value="75W (Vàng trắng 18K)">75W (Vàng trắng 18K)</option>
                <option value="41.6Y (Vàng 10K)">41.6Y (Vàng 10K)</option>
                <option value="999 (Vàng 24K)">999 (Vàng 24K)</option>
              </select>
            </div>

            {/* 9. Chất liệu đá * */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Chất liệu đá <span className="text-red-500">*</span>
              </label>
              <select
                value={generalInfo.stoneMaterial}
                onChange={(e) => setGeneralInfo({ ...generalInfo, stoneMaterial: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none transition-all cursor-pointer shadow-2xs"
              >
                <option value="Đá CZ">Đá CZ</option>
                <option value="Kim cương tự nhiên">Kim cương tự nhiên</option>
                <option value="Moissanite">Moissanite</option>
                <option value="Synthetic Gemstone">Synthetic Gemstone</option>
                <option value="Không đá">Không đá</option>
              </select>
            </div>

            {/* HÀNG 4: 3 CỘT (Số lượng, Trọng lượng, Giá) */}
            {/* 10. Số lượng */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Số lượng</label>
              <input
                type="text"
                value={summaryTotals.qty}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-gray-800 outline-none"
              />
            </div>

            {/* 11. Trọng lượng */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Trọng lượng</label>
              <input
                type="text"
                value={summaryTotals.weight}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-gray-800 outline-none"
              />
            </div>

            {/* 12. Giá */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Giá</label>
              <input
                type="text"
                value={`${summaryTotals.price} đ`}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold font-mono text-emerald-800 outline-none"
              />
            </div>

            {/* HÀNG 5: GHI CHÚ (Full 3 cột) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ghi chú</label>
              <textarea
                rows={2}
                value={generalInfo.notes}
                onChange={(e) => setGeneralInfo({ ...generalInfo, notes: e.target.value })}
                placeholder="Nhập dữ liệu..."
                className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl p-2.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD 2: THÔNG TIN ĐƠN HÀNG - Chuẩn Toolbar & Table theo Ảnh 2 */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-white">
          <h2 className="text-xs font-black text-[#00594c] uppercase tracking-wider">
            Thông tin đơn hàng
          </h2>
        </div>

        <div className="p-5 space-y-4">
          {/* TOOLBAR: Ô quét mã sản phẩm & Các nút chức năng chuẩn Ảnh 2 */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Input Mã sản phẩm */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchProductCode}
                onChange={(e) => setSearchProductCode(e.target.value)}
                onKeyDown={handleAddProductByCode}
                placeholder={
                  generalInfo.customerCode && generalInfo.material && generalInfo.goldType
                    ? "Nhập hoặc quét mã đơn hàng (Enter để thêm & cấu hình)..."
                    : "Chọn khách hàng, nguyên liệu, tuổi vàng và chất liệu đá trước"
                }
                className="w-full pl-9 pr-24 py-2 border border-gray-300 focus:border-[#00594c] rounded-xl text-xs text-gray-800 placeholder:text-gray-400 outline-none shadow-2xs transition-all"
              />
              {searchProductCode && (
                <button
                  type="button"
                  onClick={() => handleAddProductByCode({ key: "Enter" })}
                  className="absolute right-1.5 top-1.5 px-3 py-1 bg-[#00594c] text-white text-[11px] font-bold rounded-lg shadow-2xs hover:bg-[#004737]"
                >
                  Thêm mã
                </button>
              )}
            </div>

            {/* Các nút bên phải: Thay đổi hàng loạt, Import Excel, Bộ lọc */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={selectedItemIds.size === 0}
                className="px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                Thay đổi hàng loạt
              </button>

              <button
                type="button"
                className="inline-flex items-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 shadow-2xs transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-gray-500" />
                <span>Import Excel</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center space-x-1.5 px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 shadow-2xs transition-colors"
              >
                <Filter className="h-3.5 w-3.5 text-gray-500" />
                <span>Bộ lọc</span>
              </button>
            </div>
          </div>

          {/* TABLE SẢN PHẨM: Đầy đủ các cột chuẩn Ảnh 2 */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-2xs">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/80 font-bold text-gray-700 text-[11px]">
                <tr>
                  <th className="px-3 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={orderItems.length > 0 && selectedItemIds.size === orderItems.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-gray-300 text-[#00594c] focus:ring-[#00594c] cursor-pointer"
                    />
                  </th>
                  <th className="px-2 py-3 w-12 text-center">STT</th>
                  <th className="px-3 py-3 w-16 text-center">Hình ảnh</th>
                  <th className="px-3 py-3 font-semibold">Mã Item</th>
                  <th className="px-3 py-3 font-semibold">Mã Drawing</th>
                  <th className="px-3 py-3 font-semibold">Chủng loại</th>
                  <th className="px-3 py-3 font-semibold">Màu xi</th>
                  <th className="px-3 py-3 font-semibold">Màu đá</th>
                  <th className="px-3 py-3 font-semibold">Ni/Size</th>
                  <th className="px-3 py-3 text-center font-semibold">Số lượng</th>
                  <th className="px-3 py-3 font-semibold">Yêu cầu thay đổi</th>
                  <th className="px-3 py-3 font-semibold">Trọng lượng</th>
                  <th className="px-3 py-3 text-center font-semibold w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orderItems.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-300">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-xs font-medium text-gray-500">
                          Chưa có sản phẩm nào trong đơn hàng
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orderItems.map((item, index) => {
                    const isSelected = selectedItemIds.has(item.id);
                    return (
                      <tr 
                        key={item.id}
                        className={`hover:bg-emerald-50/20 transition-colors ${
                          isSelected ? "bg-emerald-50/30" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(item.id)}
                            className="rounded border-gray-300 text-[#00594c] focus:ring-[#00594c] cursor-pointer"
                          />
                        </td>

                        {/* STT */}
                        <td className="px-2 py-3 text-center font-medium text-gray-500">
                          {index + 1}
                        </td>

                        {/* Hình ảnh */}
                        <td className="px-3 py-3 text-center">
                          <div className="w-10 h-10 mx-auto rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.itemCode}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                        </td>

                        {/* Mã Item */}
                        <td className="px-3 py-3">
                          <div className="font-mono font-bold text-gray-900 line-clamp-1" title={item.itemCode}>
                            {item.itemCode}
                          </div>
                        </td>

                        {/* Mã Drawing */}
                        <td className="px-3 py-3">
                          <span className="font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                            {item.drawingCode || "---"}
                          </span>
                        </td>

                        {/* Chủng loại */}
                        <td className="px-3 py-3 font-medium text-gray-700">
                          {item.productType || "Dây Chuyền Nam"}
                        </td>

                        {/* Màu xi */}
                        <td className="px-3 py-3 text-gray-700">
                          {item.platingColor || "Trắng"}
                        </td>

                        {/* Màu đá */}
                        <td className="px-3 py-3 text-gray-700">
                          {item.stoneColor || "Trắng"}
                        </td>

                        {/* Ni/Size */}
                        <td className="px-3 py-3 font-bold text-gray-800">
                          {item.size || "58"}
                        </td>

                        {/* Số lượng */}
                        <td className="px-3 py-3 text-center font-bold font-mono text-gray-900">
                          {item.qty}
                        </td>

                        {/* Yêu cầu thay đổi - Tích hợp đầy đủ mô tả / custom selection giống EC & Admin */}
                        <td className="px-3 py-3">
                          {item.formattedChangeDisplay && item.formattedChangeDisplay !== "---" ? (
                            <div className="space-y-1 max-w-xs">
                              <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-semibold leading-relaxed">
                                {item.formattedChangeDisplay}
                              </span>
                            </div>
                          ) : item.changeType && item.changeType !== "Không thay đổi" ? (
                            <div className="space-y-1">
                              <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-semibold">
                                {item.changeType}
                              </span>
                              {item.changeTypeCustomSelection && (
                                <div className="text-[10px] text-emerald-800 font-medium">
                                  ↳ {item.changeTypeCustomSelection}
                                </div>
                              )}
                              {item.changeTypeDescription && (
                                <div className="text-[10px] text-gray-500 italic line-clamp-1">
                                  &quot;{item.changeTypeDescription}&quot;
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">---</span>
                          )}
                        </td>

                        {/* Trọng lượng */}
                        <td className="px-3 py-3 font-mono font-medium text-gray-700">
                          {item.weight || "3.2120g"}
                        </td>

                        {/* Actions (Icon Sửa ✏️ & Icon Xóa 🗑️) */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditItem(item)}
                              className="p-1.5 text-gray-500 hover:text-[#00594c] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Cấu hình / Chỉnh sửa Item (Ảnh 3)"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa dòng"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER NÚT BẤM DƯỚI BẢNG: Nút Hủy & Xác nhận chuẩn Ảnh 2 */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <Link
              href="/"
              className="px-6 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Hủy
            </Link>
            <button
              type="button"
              onClick={() => {
                setToastMessage("Đã lưu và xác nhận đơn hàng thành công!");
                setTimeout(() => setToastMessage(""), 3500);
              }}
              className="px-6 py-2 bg-[#00594c] hover:bg-[#004737] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL POPUP CẤU HÌNH ITEM - Chuẩn 100% Ảnh 3 */}
      <OrderItemConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        item={editingItem}
        onSave={handleSaveItemConfig}
      />
    </div>
  );
}
