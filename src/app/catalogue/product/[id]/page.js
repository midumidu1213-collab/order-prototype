"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  Minus,
  ZoomIn,
  CheckCircle2,
  Circle,
  Crown,
  Layers,
  SlidersHorizontal,
  Settings2
} from "lucide-react";
import { JEWELRY_PRODUCTS } from "@/data/catalogueData";
import { useCatalogueCart } from "@/context/CatalogueCartContext";
import JewelryVisual from "@/components/catalogue/JewelryVisual";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.id;

  // Find product or fallback to first product
  const product = JEWELRY_PRODUCTS.find((p) => p.id === productId) || JEWELRY_PRODUCTS[0];

  const { addToCart } = useCatalogueCart();

  // State for Single Product
  const [goldColor, setGoldColor] = useState(product.defaultOptions?.goldColor || "Vàng");
  const [niSize, setNiSize] = useState(product.defaultOptions?.niSize || "56");
  const [mainStoneColor, setMainStoneColor] = useState(product.defaultOptions?.mainStoneColor || "Xám");
  const [changeRequest, setChangeRequest] = useState(product.defaultOptions?.changeRequest || "Chọn loại thay đổi");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState(product.defaultOptions?.note || "");

  // State for Set Product (Bộ)
  const [goldAge, setGoldAge] = useState(product.defaultOptions?.goldAge || "18K (75Y)");
  const [activePreviewType, setActivePreviewType] = useState(product.imageType);
  
  // Component Selection state for Set
  const [setOrderQty, setSetOrderQty] = useState(1);
  const [componentStates, setComponentStates] = useState(() => {
    if (!product.components) return [];
    return product.components.map(comp => ({
      ...comp,
      selected: true,
      selectedOption: comp.defaultOption,
      changeRequest: "Chọn loại thay đổi"
    }));
  });

  const [copied, setCopied] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Toggle component selection in Set
  const toggleComponentSelection = (compId) => {
    setComponentStates(prev => prev.map(c => 
      c.id === compId ? { ...c, selected: !c.selected } : c
    ));
  };

  // Change individual component option (Size Ni, Length, etc.)
  const changeComponentOption = (compId, val) => {
    setComponentStates(prev => prev.map(c => 
      c.id === compId ? { ...c, selectedOption: val } : c
    ));
  };

  // Change individual component change request (YCKH)
  const changeComponentChangeRequest = (compId, val) => {
    setComponentStates(prev => prev.map(c => 
      c.id === compId ? { ...c, changeRequest: val } : c
    ));
  };

  // Select all / Deselect all components
  const handleSelectAllComps = (selectAll) => {
    setComponentStates(prev => prev.map(c => ({ ...c, selected: selectAll })));
  };

  // Set Calculations (nhân theo Số lượng Bộ)
  const selectedComps = useMemo(() => componentStates.filter(c => c.selected), [componentStates]);
  const singleSetWeight = useMemo(() => selectedComps.reduce((s, c) => s + (c.weight || 0), 0), [selectedComps]);
  const singleSetWage = useMemo(() => selectedComps.reduce((s, c) => s + (c.wagePrice || 0), 0), [selectedComps]);
  const totalSetWeight = useMemo(() => singleSetWeight * setOrderQty, [singleSetWeight, setOrderQty]);
  const totalSetWage = useMemo(() => singleSetWage * setOrderQty, [singleSetWage, setOrderQty]);
  const totalSetItemCount = useMemo(() => selectedComps.length * setOrderQty, [selectedComps, setOrderQty]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(product.productCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    if (product.isSet) {
      if (selectedComps.length === 0) {
        alert("Chị đẹp vui lòng chọn ít nhất 1 món trong bộ ạ!");
        return;
      }
      addToCart({
        isSet: true,
        productCode: product.productCode,
        productName: product.productName,
        goldColor,
        goldAge,
        mainStoneColor,
        changeRequest,
        quantity: setOrderQty,
        weight: totalSetWeight,
        wagePrice: totalSetWage,
        note,
        imageType: product.imageType,
        components: selectedComps
      });
    } else {
      addToCart({
        isSet: false,
        productCode: product.productCode,
        productName: product.productName,
        mainStoneColor,
        goldColor,
        changeRequest: changeRequest === "Chọn loại thay đổi" ? "—" : changeRequest,
        niSize,
        quantity: Number(quantity) || 1,
        weight: product.weight,
        wagePrice: product.wagePrice,
        note,
        imageType: product.imageType
      });
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-16">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-2 text-gray-500 overflow-hidden">
            <Link href="/catalogue" className="hover:text-[#00594c] font-semibold transition-colors shrink-0">
              Sản phẩm
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <Link 
              href={`/catalogue?category=${product.categoryId}`} 
              className="hover:text-[#00594c] font-semibold transition-colors shrink-0"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-[#00594c] font-bold truncate">
              {product.productCode}
            </span>
          </div>

          <Link
            href="/catalogue"
            className="flex items-center text-xs font-semibold text-[#00594c] hover:underline shrink-0 ml-4"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Về danh mục
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ================================================================= */}
            {/* LEFT COLUMN: Large Product Image Showcase                         */}
            {/* ================================================================= */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full aspect-square bg-gradient-to-b from-gray-50 via-white to-emerald-50/20 rounded-2xl border border-gray-200/80 p-8 flex items-center justify-center relative shadow-inner group">
                <JewelryVisual type={activePreviewType} className="w-full h-full transform group-hover:scale-105 transition-transform duration-500" />
                
                {/* Floating tags */}
                {product.isSet ? (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-200" />
                    <span>BỘ TRANG SỨC (4 MÓN)</span>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 bg-[#00594c]/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                    {product.categoryName}
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 text-gray-400 text-xs flex items-center bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200">
                  <ZoomIn className="h-3.5 w-3.5 mr-1" />
                  Rê chuột để phóng to
                </div>
              </div>

              {/* Thumbnails row / Component Gallery for Sets */}
              {product.isSet ? (
                <div className="w-full mt-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    Bấm để xem chi tiết từng món trong bộ:
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => setActivePreviewType(product.imageType)}
                      className={`p-1.5 rounded-xl border-2 bg-gray-50 transition-all flex flex-col items-center justify-center ${
                        activePreviewType === product.imageType ? "border-[#00594c] ring-2 ring-emerald-500/20 shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="text-base">👑</div>
                      <span className="text-[10px] font-bold text-gray-700 mt-0.5 truncate">Toàn bộ</span>
                    </button>
                    {product.components?.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => setActivePreviewType(comp.imageType)}
                        className={`p-1.5 rounded-xl border-2 bg-gray-50 transition-all flex flex-col items-center justify-center ${
                          activePreviewType === comp.imageType ? "border-[#00594c] ring-2 ring-emerald-500/20 shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="text-base">{comp.icon}</div>
                        <span className="text-[10px] font-bold text-gray-700 mt-0.5 truncate">{comp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 mt-4">
                  {["Góc chụp chính", "Góc nghiêng 45°", "Chi tiết khóa cài"].map((angle, idx) => (
                    <button
                      key={idx}
                      className={`h-16 w-16 rounded-xl border-2 p-1 bg-gray-50 transition-all ${
                        idx === 0 ? "border-[#00594c] shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <JewelryVisual type={product.imageType} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: CONFIGURATOR (SET vs SINGLE PRODUCT)                */}
            {/* ================================================================= */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Product Code Header - Clean and Focused without redundant description */}
              <div className="pb-1">
                <div className="flex items-center justify-between">
                  <h1 className="font-mono text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
                    {product.productCode}
                  </h1>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl text-gray-400 hover:text-[#00594c] hover:bg-emerald-50 transition-colors"
                    title="Sao chép mã sản phẩm"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* =============================================================== */}
              {/* CASE A: SẢN PHẨM BỘ (JEWELRY SUITE / SET) CONFIGURATOR          */}
              {/* =============================================================== */}
              {product.isSet ? (
                <div className="space-y-5">
                  
                  {/* TẦNG 1: THUỘC TÍNH CHUNG (Đã bỏ Tuổi vàng - Chỉ còn 2 cột: Màu xi & Màu đá chính) */}
                  <div className="bg-[#f2f8f6] p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
                    <div className="text-xs font-bold text-[#00594c] uppercase tracking-wider flex items-center">
                      <Settings2 className="h-4 w-4 mr-1.5" />
                      Thuộc tính chung
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Màu xi */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Màu xi</label>
                        <select
                          value={goldColor}
                          onChange={(e) => setGoldColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs"
                        >
                          {product.availableGoldColors?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Màu đá chính */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Màu đá chính</label>
                        <select
                          value={mainStoneColor}
                          onChange={(e) => setMainStoneColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs"
                        >
                          {product.availableStoneColors?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* TẦNG 2: KÍCH THƯỚC SẢN PHẨM & YÊU CẦU THAY ĐỔI */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                        <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                        Kích thước sản phẩm ({selectedComps.length} / {componentStates.length})
                      </div>
                      <div className="space-x-2 text-[11px]">
                        <button
                          onClick={() => handleSelectAllComps(true)}
                          className="text-[#00594c] font-bold hover:underline"
                        >
                          Chọn cả bộ
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleSelectAllComps(false)}
                          className="text-gray-500 hover:text-red-600 font-medium"
                        >
                          Bỏ chọn hết
                        </button>
                      </div>
                    </div>

                    {/* Component Cards List with Size and Yêu cầu thay đổi */}
                    <div className="space-y-2.5">
                      {componentStates.map((comp) => {
                        const isChecked = comp.selected;
                        return (
                          <div
                            key={comp.id}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isChecked
                                ? "bg-white border-emerald-400/90 shadow-xs ring-1 ring-emerald-500/20"
                                : "bg-gray-50/70 border-gray-200 opacity-60"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              {/* Left: Checkbox + Clean Name + SKU + Separate line for TL & Công */}
                              <div className="flex items-start space-x-3 cursor-pointer select-none flex-1" onClick={() => toggleComponentSelection(comp.id)}>
                                <div className="mt-0.5">
                                  {isChecked ? (
                                    <CheckCircle2 className="h-5 w-5 text-[#00594c] fill-emerald-100" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="space-y-0.5">
                                  {/* Dòng 1: Tên món */}
                                  <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                                    <span>{comp.icon}</span>
                                    <span>{comp.name}</span>
                                  </div>
                                  
                                  {/* Dòng 2: Mã sản phẩm */}
                                  <div className="text-[11px] font-mono text-gray-500 tracking-tight">
                                    {comp.sku}
                                  </div>

                                  {/* Dòng 3: Trọng lượng và Tiền công tách xuống cùng 1 dòng */}
                                  <div className="text-[11px] text-gray-600 font-medium pt-0.5">
                                    Trọng lượng: <strong className="text-gray-900 font-mono">{comp.weight}</strong> &bull; Công: <strong className="text-[#00594c]">{comp.priceDisplay}</strong>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Kích thước (nếu có) + Yêu cầu thay đổi */}
                              {isChecked ? (
                                <div className="shrink-0 flex flex-col sm:items-end space-y-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                  {/* 1. Dropdown Kích thước (Chỉ hiển thị với Nhẫn, Dây chuyền, Vòng tay - Bông tai để trống) */}
                                  {comp.options && comp.options.length > 0 ? (
                                    <div className="flex items-center space-x-1.5 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                                      <span className="text-[11px] font-semibold text-gray-600">{comp.optionType}:</span>
                                      <select
                                        value={comp.selectedOption}
                                        onChange={(e) => changeComponentOption(comp.id, e.target.value)}
                                        className="bg-transparent text-xs font-bold text-[#00594c] outline-none cursor-pointer"
                                      >
                                        {comp.options.map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="hidden sm:block h-6" />
                                  )}

                                  {/* 2. Dropdown Yêu cầu thay đổi (YCKH) ở mỗi sản phẩm */}
                                  <div className="flex items-center space-x-1.5 bg-gray-50 hover:bg-white px-2.5 py-1 rounded-xl border border-gray-200 hover:border-emerald-300 focus-within:border-emerald-500 transition-all self-start sm:self-auto">
                                    <span className="text-[10px] text-gray-500 font-medium hidden sm:inline">Yêu cầu:</span>
                                    <select
                                      value={comp.changeRequest || "Chọn loại thay đổi"}
                                      onChange={(e) => changeComponentChangeRequest(comp.id, e.target.value)}
                                      className="bg-transparent text-[11px] font-medium text-gray-700 outline-none cursor-pointer max-w-[170px] truncate"
                                    >
                                      <option value="Chọn loại thay đổi">Yêu cầu thay đổi: Không</option>
                                      <option value="Đổi đá Moissanite">Đổi đá Moissanite</option>
                                      <option value="Đổi tuổi vàng 18K">Đổi tuổi vàng 18K</option>
                                      <option value="Khắc tên laser">Khắc tên laser riêng</option>
                                      <option value="Cắt ngắn bớt">Cắt ngắn bớt chiều dài</option>
                                      <option value="Xi thêm lớp chống trầy">Xi bóng chống trầy</option>
                                    </select>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Số lượng Bộ & Ghi chú */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Số lượng Bộ */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Số lượng Bộ
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setSetOrderQty(q => Math.max(1, q - 1))}
                          className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold text-sm select-none"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={setOrderQty}
                          onChange={(e) => setSetOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full text-center text-xs font-bold text-gray-900 outline-none py-2"
                        />
                        <button
                          type="button"
                          onClick={() => setSetOrderQty(q => q + 1)}
                          className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold text-sm select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Ghi chú đơn hàng cho Bộ
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="VD: Đóng gói Hộp Cưới Sơn Mài..."
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00594c]"
                      />
                    </div>
                  </div>

                  {/* Sticky Summary Bar for Set */}
                  <div className="p-4 bg-gradient-to-r from-[#013b2f] to-[#00594c] text-white rounded-2xl shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-emerald-500/40 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <span className="font-bold text-sm tracking-wide">Thông tin tạm tính:</span>
                      </div>
                      <span className="bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black text-[11px]">
                        {setOrderQty > 1 ? `${setOrderQty} Bộ (${totalSetItemCount} Món)` : `${selectedComps.length} / ${componentStates.length} Món`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-emerald-200">Tổng trọng lượng:</span>{" "}
                        <strong className="text-white font-mono text-sm">{totalSetWeight.toFixed(3)} chỉ</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-200">Tổng tiền công:</span>{" "}
                        <strong className="text-amber-300 text-sm font-bold">{totalSetWage.toLocaleString()}đ</strong>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={selectedComps.length === 0}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-950 transition-all flex items-center justify-center space-x-2 shadow-md ${
                        addedSuccess
                          ? "bg-emerald-300 text-slate-900"
                          : selectedComps.length === 0
                          ? "bg-gray-400 cursor-not-allowed text-gray-700"
                          : "bg-emerald-300 hover:bg-emerald-200 active:scale-98"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="h-5 w-5 text-emerald-950" />
                          <span>Đã thêm Bộ vào giỏ hàng thành công!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            {setOrderQty > 1 
                              ? `Thêm ${setOrderQty} Bộ (${totalSetItemCount} món) vào giỏ chào hàng` 
                              : `Thêm ${selectedComps.length} món vào giỏ chào hàng`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                
                <div className="space-y-4">
                  {/* =============================================================== */}
                  {/* CASE B: SẢN PHẨM ĐƠN LẺ (SINGLE ITEM) CONFIGURATOR              */}
                  {/* =============================================================== */}
                  {/* Specs Bar */}
                  <div className="grid grid-cols-3 gap-2 py-4 px-4 bg-[#f4f9f7] rounded-2xl border border-emerald-100 text-center">
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Trọng lượng</div>
                      <div className="text-sm sm:text-base font-bold text-gray-900 mt-0.5 font-mono">
                        {product.specs.weight}
                      </div>
                    </div>
                    <div className="border-x border-emerald-200/60">
                      <div className="text-xs text-gray-500 font-medium">Loại SP</div>
                      <div className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">
                        {product.specs.productType}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Giá công</div>
                      <div className="text-sm sm:text-base font-bold text-[#00594c] mt-0.5">
                        {product.specs.wage}
                      </div>
                    </div>
                  </div>

                  {/* Form Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Màu xi</label>
                      <select
                        value={goldColor}
                        onChange={(e) => setGoldColor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#00594c]"
                      >
                        {product.availableGoldColors.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kích thước sản phẩm (Size Ni)</label>
                      <select
                        value={niSize}
                        onChange={(e) => setNiSize(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#00594c]"
                      >
                        {product.availableNiSizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Màu đá chính</label>
                      <select
                        value={mainStoneColor}
                        onChange={(e) => setMainStoneColor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#00594c]"
                      >
                        {product.availableStoneColors.map((stone) => (
                          <option key={stone} value={stone}>{stone}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Yêu cầu thay đổi</label>
                      <select
                        value={changeRequest}
                        onChange={(e) => setChangeRequest(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#00594c]"
                      >
                        {product.availableChangeRequests.map((req) => (
                          <option key={req} value={req}>{req}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Số lượng</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1 flex items-center">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="absolute left-2 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full text-center py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c]"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="absolute right-2 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ghi chú</label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nhập ghi chú"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-[#00594c]"
                    />
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <button
                      onClick={handleAddToCart}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
                        addedSuccess
                          ? "bg-emerald-700 ring-4 ring-emerald-300"
                          : "bg-[#00594c] hover:bg-[#004737] active:scale-98 hover:shadow-xl"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="h-5 w-5 text-emerald-200" />
                          <span>Đã thêm vào giỏ chào hàng thành công!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-5 w-5" />
                          <span>Thêm vào danh sách</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-1 pt-2 border-t border-gray-100">
                <span>* Sản phẩm chuẩn quy cách vàng & đá SEVAGO</span>
                <Link href="/catalogue/cart" className="text-[#00594c] font-bold hover:underline flex items-center">
                  Xem giỏ hàng chào hàng &rarr;
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
