"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ListOrdered, 
  Split, 
  Plus, 
  CheckCircle, 
  Copy, 
  Trash2, 
  Pencil, 
  Check, 
  Gem,
  Crown,
  Sparkles,
  X,
  CornerDownRight,
  Layers
} from "lucide-react";
import { useCatalogueCart } from "@/context/CatalogueCartContext";

export default function CatalogueCartPage() {
  const router = useRouter();
  const { 
    cartItems, 
    orderInfo, 
    removeFromCart, 
    removeSetComponent,
    updateCartItem, 
    clearCart,
    totalQuantity, 
    totalWeight,
    showToast
  } = useCatalogueCart();

  const [copiedId, setCopiedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmOrder = () => {
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-16">
      
      {/* Top Header Actions Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Action: Quay lại */}
          <Link
            href="/catalogue"
            className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#00594c] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Quay lại E-Catalogue
          </Link>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            <button
              className="flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#00594c] text-white shadow-xs"
            >
              <ListOrdered className="h-4 w-4 mr-1.5" />
              Xem danh sách giỏ hàng
            </button>

            <button
              onClick={() => setIsSplitModalOpen(true)}
              className="flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#00705f] hover:bg-[#00594c] text-white shadow-xs transition-colors"
            >
              <Split className="h-4 w-4 mr-1.5" />
              Tách đơn
            </button>

            <Link
              href="/catalogue"
              className="flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#00705f] hover:bg-[#00594c] text-white shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Thêm sản phẩm
            </Link>

            <button
              onClick={handleConfirmOrder}
              className="flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Xác nhận giỏ hàng
            </button>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* ORDER SUMMARY CARD                                                        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/90 overflow-hidden">
          
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gray-50/70 to-emerald-50/20">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-gray-900 text-sm sm:text-base">
                Mã giỏ hàng: <span className="font-mono text-[#00594c]">{orderInfo.orderCode}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                {orderInfo.status}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-[#00594c]">
              <Gem className="h-4 w-4 text-emerald-600" />
              <span>Khách hàng ID: {orderInfo.customerCode}</span>
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs sm:text-sm">
            <div>
              <span className="text-gray-500 font-medium">Tuổi vàng:</span>{" "}
              <span className="font-bold text-gray-900">{orderInfo.goldAge}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Chất liệu:</span>{" "}
              <span className="font-bold text-gray-900">{orderInfo.material}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Chất liệu đá:</span>{" "}
              <span className="font-bold text-gray-900">{orderInfo.stoneMaterial}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Loại đơn hàng:</span>{" "}
              <span className="font-bold text-[#00594c]">{orderInfo.orderType}</span>
            </div>

            <div>
              <span className="text-gray-500 font-medium">Tổng số lượng:</span>{" "}
              <span className="font-bold text-emerald-800 font-mono text-base">{totalQuantity} món</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Tổng trọng lượng:</span>{" "}
              <span className="font-bold text-gray-900 font-mono">{totalWeight.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Giá tạm tính:</span>{" "}
              <span className="font-bold text-gray-700">{orderInfo.provisionalPrice}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Chiết khấu:</span>{" "}
              <span className="font-bold text-gray-700">{orderInfo.discount}</span>
            </div>

            <div>
              <span className="text-gray-500 font-medium">Giá sau chiết khấu:</span>{" "}
              <span className="font-bold text-gray-700">{orderInfo.priceAfterDiscount}</span>
            </div>
            <div className="sm:col-span-3">
              <span className="text-gray-500 font-medium">Giá chính thức:</span>{" "}
              <span className="font-bold text-gray-700">{orderInfo.officialPrice}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRODUCT LIST TABLE WITH TREE HIERARCHY FOR SETS                           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/90 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-gray-900">Danh sách sản phẩm chào hàng</h3>
              <span className="bg-emerald-100 text-[#00594c] text-xs px-2.5 py-0.5 rounded-full font-bold">
                {totalQuantity} món thành phẩm
              </span>
            </div>
            <span className="text-xs text-gray-500">{cartItems.length} mục đơn hàng</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <h4 className="text-base font-bold text-gray-700">Giỏ hàng chào hàng đang trống</h4>
              <p className="text-xs text-gray-500 mt-1">Chị đẹp hãy chọn sản phẩm từ E-Catalogue để thêm vào danh sách</p>
              <Link
                href="/catalogue"
                className="mt-4 inline-flex items-center px-4 py-2 text-xs font-semibold bg-[#00594c] text-white rounded-xl shadow-xs hover:bg-[#004737]"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Duyệt E-Catalogue ngay
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f2f7f5] text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Mã sản phẩm / Tên món</th>
                    <th className="py-3.5 px-3">Màu đá chính</th>
                    <th className="py-3.5 px-3">YCKH</th>
                    <th className="py-3.5 px-3">Quy cách / Size</th>
                    <th className="py-3.5 px-3 text-center">Số lượng</th>
                    <th className="py-3.5 px-3 text-right">Trọng lượng</th>
                    <th className="py-3.5 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {cartItems.map((item) => {
                    
                    // RENDER CASE 1: SẢN PHẨM BỘ (PARENT + CHILD ROWS)
                    if (item.isSet) {
                      const setQty = Number(item.quantity) || 1;
                      return (
                        <React.Fragment key={item.id}>
                          {/* Parent Set Header Row */}
                          <tr className="bg-emerald-50/70 font-bold border-t-2 border-emerald-300">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-2.5">
                                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center space-x-1">
                                  <Crown className="h-3 w-3 inline" />
                                  <span>BỘ</span>
                                </span>
                                <div>
                                  <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm font-bold text-gray-900">
                                    <span className="text-[#00594c] font-black">{item.productCode}</span>
                                    <button
                                      onClick={() => handleCopy(item.id, item.productCode)}
                                      className="text-gray-400 hover:text-[#00594c] transition-colors p-0.5"
                                      title="Sao chép mã bộ"
                                    >
                                      {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-gray-600 font-sans font-normal mt-0.5">
                                    {item.productName} &bull; <span className="text-gray-400">{item.goldAge} &bull; {item.goldColor}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-xs text-emerald-950 font-semibold">{item.mainStoneColor}</td>
                            <td className="py-3.5 px-3 text-xs text-gray-500">{item.note || "Hộp Cưới VIP"}</td>
                            <td className="py-3.5 px-3 text-xs text-emerald-800 font-bold">
                              {item.components?.length || 0} Món thành phần
                            </td>
                            <td className="py-3.5 px-3 text-center text-xs font-mono font-black text-[#00594c]">
                              {setQty} Bộ
                            </td>
                            <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-900">
                              {(item.weight || 0).toFixed(3)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa toàn bộ set"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>

                          {/* Child Component Rows (Món con trong bộ - Đồng bộ hiển thị Mã SKU) */}
                          {item.components?.map((comp, cIdx) => (
                            <tr key={comp.id} className="bg-white hover:bg-gray-50/90 transition-colors border-l-4 border-l-emerald-500">
                              <td className="py-2.5 px-4 pl-8 sm:pl-10 text-xs">
                                <div className="flex items-start space-x-2">
                                  <CornerDownRight className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="text-sm shrink-0">{comp.icon || "💎"}</span>
                                  <div className="space-y-0.5">
                                    <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-gray-800 tracking-tight">
                                      <span>{comp.sku}</span>
                                      <button
                                        onClick={() => handleCopy(comp.id, comp.sku)}
                                        className="text-gray-400 hover:text-[#00594c] transition-colors p-0.5"
                                        title="Sao chép mã món con"
                                      >
                                        {copiedId === comp.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                                      </button>
                                    </div>
                                    <div className="text-[10.5px] text-gray-500 font-sans">
                                      {comp.name} <span className="text-emerald-700 font-medium">(Món thuộc bộ)</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-xs text-gray-400 font-medium">Theo bộ</td>
                              <td className="py-2.5 px-3 text-xs text-gray-600 font-medium">
                                {comp.changeRequest && comp.changeRequest !== "Chọn loại thay đổi" && comp.changeRequest !== "—" ? (
                                  <span className="text-[#00594c] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {comp.changeRequest}
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="py-2.5 px-3 text-xs font-bold text-[#00594c]">
                                {comp.optionType && comp.selectedOption ? `${comp.optionType}: ${comp.selectedOption}` : "—"}
                              </td>
                              <td className="py-2.5 px-3 text-center text-xs font-mono text-gray-700 font-bold">
                                {setQty}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-xs text-gray-700">
                                {((comp.weight || 0) * setQty).toFixed(3)}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  onClick={() => removeSetComponent(item.id, comp.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors text-[11px]"
                                  title="Loại món này khỏi bộ"
                                >
                                  <Trash2 className="h-3.5 w-3.5 inline" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    }

                    // RENDER CASE 2: SẢN PHẨM ĐƠN LẺ (Đồng bộ format Mã SKU & Tag LẺ)
                    return (
                      <tr key={item.id} className="hover:bg-[#f9fcfb] transition-colors border-t border-gray-100">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2.5">
                            <span className="bg-emerald-100 text-[#00594c] border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center space-x-1">
                              <span>💎 LẺ</span>
                            </span>
                            <div>
                              <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm font-bold text-gray-900">
                                <span className="text-gray-900 font-black">{item.productCode}</span>
                                <button
                                  onClick={() => handleCopy(item.id, item.productCode)}
                                  className="text-gray-400 hover:text-[#00594c] transition-colors p-0.5"
                                  title="Sao chép mã món lẻ"
                                >
                                  {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                              <div className="text-[11px] text-gray-500 font-sans font-normal mt-0.5">
                                {item.productName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs">{item.mainStoneColor || "000"}</td>
                        <td className="py-3.5 px-3 text-xs font-medium">
                          {item.yckh && item.yckh !== "—" ? (
                            <span className="text-[#00594c] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {item.yckh}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="py-3.5 px-3 text-xs font-bold text-gray-800">
                          {item.niSize ? `Size Ni: ${item.niSize}` : "—"}
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-emerald-800 text-xs font-mono">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-gray-900">
                          {((item.weight || 0) * (item.quantity || 1)).toFixed(3)}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa món lẻ"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 text-gray-500 hover:text-[#00594c] hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Chỉnh sửa quy cách"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Chỉnh sửa quy cách sản phẩm</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mã sản phẩm</label>
                <div className="font-mono text-xs font-bold text-gray-800 bg-gray-50 p-2 rounded-lg truncate">
                  {editingItem.productCode}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Size Ni</label>
                  <select
                    value={editingItem.niSize}
                    onChange={(e) => setEditingItem({ ...editingItem, niSize: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                  >
                    {["48", "50", "52", "54", "56", "58", "60"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Màu đá chính</label>
                <input
                  type="text"
                  value={editingItem.mainStoneColor}
                  onChange={(e) => setEditingItem({ ...editingItem, mainStoneColor: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ghi chú / YCKH</label>
                <textarea
                  rows={2}
                  value={editingItem.note || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  updateCartItem(editingItem.id, editingItem);
                  setEditingItem(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-[#00594c] hover:bg-[#004737] text-white rounded-xl shadow-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Order Modal */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center">
                <Split className="h-5 w-5 mr-2 text-[#00594c]" />
                Tách đơn hàng chào hàng
              </h3>
              <button onClick={() => setIsSplitModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Chị đẹp có muốn tách các dòng sản phẩm có tuổi vàng hoặc đặc tính kỹ thuật khác nhau thành 2 đơn SO riêng biệt không?
            </p>
            <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-xl">
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Đơn 1 (Vàng 18K - 75Y - Bộ Hoàng Gia):</span>
                <span>4 Món</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Đơn 2 (Vàng Trắng 10K - Lắc tay lẻ):</span>
                <span>1 Món</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsSplitModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setIsSplitModalOpen(false);
                  showToast("✂️ Đã tách đơn thành công thành 2 mã SO!");
                }}
                className="px-4 py-2 text-xs font-bold bg-[#00594c] text-white rounded-xl"
              >
                Xác nhận tách đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Order Success Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center space-y-4 border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-100 text-[#00594c] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">Xác nhận giỏ hàng thành công!</h3>
            <p className="text-xs text-gray-600">
              Đơn chào hàng <span className="font-mono font-bold text-[#00594c]">{orderInfo.orderCode}</span> ({totalQuantity} món thành phẩm) đã được chuyển tiếp vào hệ thống quản lý SO.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl text-left text-xs space-y-1.5 border border-emerald-100 text-emerald-900 font-medium">
              <div>&bull; <strong>Mã đơn SO:</strong> {orderInfo.orderCode}</div>
              <div>&bull; <strong>Khách hàng:</strong> {orderInfo.customerName} ({orderInfo.customerCode})</div>
              <div>&bull; <strong>Tổng số lượng món:</strong> {totalQuantity} món</div>
              <div>&bull; <strong>Trọng lượng dự kiến:</strong> {totalWeight.toFixed(4)}</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#00594c] hover:bg-[#004737] rounded-xl shadow-md transition-colors text-center"
              >
                Về Quản lý Đơn hàng (ERP)
              </Link>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Tiếp tục chào hàng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
