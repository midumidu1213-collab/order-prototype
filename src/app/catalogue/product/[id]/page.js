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
  Plus, 
  CheckCircle2,
  Circle,
  Crown,
  Layers,
  Settings2,
  Trash2,
  Maximize2,
  X
} from "lucide-react";
import { JEWELRY_PRODUCTS } from "@/data/catalogueData";
import { useCatalogueCart } from "@/context/CatalogueCartContext";
import JewelryVisual from "@/components/catalogue/JewelryVisual";

// =============================================================================
// PRICING VARIATION RULES (BIẾN THIÊN GIÁ THEO TÙY BIẾN)
// =============================================================================
export const GOLD_COLOR_DELTAS = {
  "Vàng": 0,
  "Trắng": 50000,
  "Hồng": 50000,
  "Vàng hồng": 50000,
  "Vàng 2 màu": 120000
};

export const STONE_COLOR_DELTAS = {
  "Trắng": 0,
  "Xám": 0,
  "Trắng / Đỏ": 0,
  "Xanh Emerald": 30000,
  "Đỏ": 30000,
  "Đỏ Ruby": 30000,
  "Tím Sapphire": 30000,
  "Tím": 30000,
  "Kim Cương Trắng": 450000,
  "Kim Cương Moissanite": 450000
};

// Size Ni deltas (Ni ngoại cỡ > 56 có thêm vàng và công nới)
export const getSizeDelta = (size) => {
  const s = parseInt(size);
  if (s >= 60) return 150000;
  if (s >= 58) return 80000;
  return 0;
};

// Quy tắc làm tròn giá công lên 5,000đ
export const roundUp5k = (val) => {
  const num = Number(val) || 0;
  return Math.ceil(num / 5000) * 5000;
};

// Cấu hình danh mục chi tiết tương ứng với từng Yêu cầu thay đổi
export const CHANGE_REQUEST_CONFIGS = {
  "Không thay đổi": null,
  "Thay kiểu bào ball": {
    subLabel: "Kiểu bào",
    options: ["Cross 45", "Cross 90", "Star 6", "Star 8", "Micro Pave", "Bào hạt lựu"]
  },
  "Đổi sang đá tấm CZ loại 1": {
    subLabel: "Loại đá tấm",
    options: ["CZ Trắng Star Cut", "CZ Swarovski Heart & Arrow", "CZ Đỏ Ruby", "CZ Xanh Emerald"]
  },
  "Đổi tuổi vàng 10K lên 18K": {
    subLabel: "Tuổi vàng chuyển đổi",
    options: ["Vàng 18K (75Y)", "Vàng 14K (58.5Y)", "Vàng 24K (99.9Y)"]
  },
  "Khắc laser chữ/ký hiệu riêng": {
    subLabel: "Kiểu chữ khắc laser",
    options: ["Font In hoa hiện đại (Elegance)", "Font Chữ ký nghệ thuật (Signature)", "Khắc Ngày & Tên lồng trái tim"]
  }
};

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.id;

  // Find product or fallback to first product
  const product = JEWELRY_PRODUCTS.find((p) => p.id === productId) || JEWELRY_PRODUCTS[0];

  const { addToCart, addBatchToCart } = useCatalogueCart();

  // State
  const [goldColor, setGoldColor] = useState(product.defaultOptions?.goldColor || "Vàng");
  const [mainStoneColor, setMainStoneColor] = useState(product.defaultOptions?.mainStoneColor || "Xám");
  const [changeRequest, setChangeRequest] = useState(product.defaultOptions?.changeRequest || "Không thay đổi");
  const [changeRequestDetail, setChangeRequestDetail] = useState(() => {
    const defaultCr = product.defaultOptions?.changeRequest;
    return CHANGE_REQUEST_CONFIGS[defaultCr]?.options?.[0] || "Cross 45";
  });

  const handleSelectChangeRequest = (val) => {
    setChangeRequest(val);
    const config = CHANGE_REQUEST_CONFIGS[val];
    if (config && config.options?.length > 0) {
      setChangeRequestDetail(config.options[0]);
    } else {
      setChangeRequestDetail("");
    }
  };

  const [note, setNote] = useState(product.defaultOptions?.note || "");
  const [activePreviewType, setActivePreviewType] = useState(product.imageType);
  const [copied, setCopied] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Set-specific state: Nhóm kích thước và số lượng từng Bộ (Bộ 1, Bộ 2, +Thêm kích thước cho Bộ 3...)
  const getDefaultCompSizes = () => {
    return (product.components || []).reduce((acc, comp) => {
      if (comp.options && comp.options.length > 0) {
        acc[comp.id] = comp.defaultOption || comp.options[0];
      }
      return acc;
    }, {});
  };

  const [setSizeGroups, setSetSizeGroups] = useState(() => [
    {
      id: "set-group-1",
      nameLabel: "Bộ 1",
      quantity: 1,
      sizes: (product.components || []).reduce((acc, comp) => {
        if (comp.options && comp.options.length > 0) {
          acc[comp.id] = comp.defaultOption || comp.options[0];
        }
        return acc;
      }, {})
    },
    {
      id: "set-group-2",
      nameLabel: "Bộ 2",
      quantity: 1,
      sizes: (product.components || []).reduce((acc, comp) => {
        if (comp.options && comp.options.length > 0) {
          acc[comp.id] = comp.defaultOption || comp.options[0];
        }
        return acc;
      }, {})
    }
  ]);

  const handleAddSetSizeGroup = () => {
    const nextNum = setSizeGroups.length + 1;
    setSetSizeGroups(prev => [
      ...prev,
      {
        id: `set-group-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nameLabel: `Bộ ${nextNum}`,
        quantity: 1,
        sizes: getDefaultCompSizes()
      }
    ]);
  };

  const handleRemoveSetSizeGroup = (groupId) => {
    if (setSizeGroups.length <= 1) return;
    setSetSizeGroups(prev => {
      const filtered = prev.filter(g => g.id !== groupId);
      return filtered.map((g, idx) => ({
        ...g,
        nameLabel: `Bộ ${idx + 1}`
      }));
    });
  };

  const handleUpdateGroupQty = (groupId, newQty) => {
    const val = Math.max(1, parseInt(newQty) || 1);
    setSetSizeGroups(prev => prev.map(g => g.id === groupId ? { ...g, quantity: val } : g));
  };

  const handleUpdateGroupSize = (groupId, compId, sizeVal) => {
    setSetSizeGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        sizes: {
          ...g.sizes,
          [compId]: sizeVal
        }
      };
    }));
  };

  const [componentStates, setComponentStates] = useState(() => {
    return (product.components || []).map(comp => ({
      ...comp,
      selected: true,
      selectedOption: comp.defaultOption
    }));
  });

  // Wholesale Stone Rows allocation
  const [stoneRows, setStoneRows] = useState(() => [
    {
      id: "row-1",
      stoneColor: product.defaultOptions?.mainStoneColor || product.availableStoneColors?.[0] || "Trắng",
      fillQty: 1,
      quantities: {}
    }
  ]);

  const updateRowQty = (rowId, size, newQty) => {
    setStoneRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const q = Math.max(0, parseInt(newQty) || 0);
      const updated = { ...row.quantities };
      if (q === 0) {
        delete updated[size];
      } else {
        updated[size] = q;
      }
      return { ...row, quantities: updated };
    }));
  };

  const updateRowFillQty = (rowId, val) => {
    const q = Math.max(1, parseInt(val) || 1);
    setStoneRows(prev => prev.map(row => row.id === rowId ? { ...row, fillQty: q } : row));
  };

  const changeRowColor = (rowId, color) => {
    setStoneRows(prev => prev.map(row => row.id === rowId ? { ...row, stoneColor: color } : row));
  };

  const addStoneRow = () => {
    const usedColors = stoneRows.map(r => r.stoneColor);
    const available = product.availableStoneColors?.find(c => !usedColors.includes(c)) || product.availableStoneColors?.[0] || "Trắng";
    setStoneRows(prev => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        stoneColor: available,
        fillQty: 1,
        quantities: {}
      }
    ]);
  };

  const removeStoneRow = (rowId) => {
    if (stoneRows.length <= 1) return;
    setStoneRows(prev => prev.filter(r => r.id !== rowId));
  };

  const quickFillRow = (rowId, amount = 1) => {
    const qtyToSet = Math.max(1, parseInt(amount) || 1);
    setStoneRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const newQ = {};
      (product.availableNiSizes || []).forEach(size => {
        newQ[size] = qtyToSet;
      });
      return { ...row, quantities: newQ, fillQty: qtyToSet };
    }));
  };

  const clearRow = (rowId) => {
    setStoneRows(prev => prev.map(row => row.id === rowId ? { ...row, quantities: {} } : row));
  };

  // Wholesale Items calculation with Price Deltas
  const wholesaleItems = useMemo(() => {
    const items = [];
    const goldDelta = GOLD_COLOR_DELTAS[goldColor] || 0;

    stoneRows.forEach(row => {
      const stoneDelta = STONE_COLOR_DELTAS[row.stoneColor] || 0;

      Object.entries(row.quantities || {}).forEach(([size, qty]) => {
        const numQty = parseInt(qty) || 0;
        if (numQty > 0) {
          const sizeDelta = getSizeDelta(size);
          const itemDelta = goldDelta + stoneDelta + sizeDelta;
          const totalItemWage = roundUp5k((product.wagePrice || 0) + itemDelta);

          items.push({
            productCode: product.productCode,
            productName: product.productName,
            mainStoneColor: row.stoneColor,
            goldColor: goldColor,
            changeRequest: (changeRequest && changeRequest !== "Không thay đổi" && changeRequestDetail) 
              ? `${changeRequest} (${changeRequestDetail})` 
              : changeRequest,
            changeRequestDetail: changeRequestDetail,
            niSize: size,
            quantity: numQty,
            weight: product.weight,
            wagePrice: totalItemWage,
            baseWage: product.wagePrice || 0,
            itemDelta,
            note: note,
            imageType: product.imageType,
            category: product.categoryName
          });
        }
      });
    });
    return items;
  }, [stoneRows, goldColor, changeRequest, changeRequestDetail, note, product]);

  const totalWholesaleQty = useMemo(() => {
    return wholesaleItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [wholesaleItems]);

  const totalBaseWage = useMemo(() => {
    return totalWholesaleQty * (product.wagePrice || 0);
  }, [totalWholesaleQty, product.wagePrice]);

  const totalSurcharge = useMemo(() => {
    return wholesaleItems.reduce((sum, item) => sum + (item.itemDelta * item.quantity), 0);
  }, [wholesaleItems]);

  const totalWholesaleWeight = useMemo(() => {
    return totalWholesaleQty * (product.weight || 0);
  }, [totalWholesaleQty, product.weight]);

  const totalWholesaleWage = useMemo(() => {
    return roundUp5k(totalBaseWage + totalSurcharge);
  }, [totalBaseWage, totalSurcharge]);

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

  // Select all / Deselect all components
  const handleSelectAllComps = (selectAll) => {
    setComponentStates(prev => prev.map(c => ({ ...c, selected: selectAll })));
  };

  // Set Calculations (tính theo từng nhóm Bộ trong setSizeGroups)
  const totalSetOrderQty = useMemo(() => {
    return setSizeGroups.reduce((sum, g) => sum + (parseInt(g.quantity) || 0), 0);
  }, [setSizeGroups]);

  const selectedComps = useMemo(() => componentStates.filter(c => c.selected), [componentStates]);
  const singleSetWeight = useMemo(() => selectedComps.reduce((s, c) => s + (c.weight || 0), 0), [selectedComps]);
  const singleSetWage = useMemo(() => selectedComps.reduce((s, c) => s + (c.wagePrice || 0), 0), [selectedComps]);
  const totalSetWeight = useMemo(() => singleSetWeight * totalSetOrderQty, [singleSetWeight, totalSetOrderQty]);
  const totalSetWage = useMemo(() => roundUp5k(singleSetWage * totalSetOrderQty), [singleSetWage, totalSetOrderQty]);
  const totalSetItemCount = useMemo(() => selectedComps.length * totalSetOrderQty, [selectedComps, totalSetOrderQty]);

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
      if (totalSetOrderQty === 0) {
        alert("Chị đẹp vui lòng nhập số lượng cho ít nhất 1 bộ ạ!");
        return;
      }

      // Thêm từng nhóm bộ vào giỏ hàng với thông tin kích thước tương ứng
      setSizeGroups.forEach((group) => {
        const groupQty = parseInt(group.quantity) || 0;
        if (groupQty > 0) {
          const groupWeight = singleSetWeight * groupQty;
          const groupWage = roundUp5k(singleSetWage * groupQty);

          addToCart({
            isSet: true,
            productCode: product.productCode,
            productName: product.productName,
            category: product.categoryName,
            goldColor,
            mainStoneColor,
            changeRequest: (changeRequest && changeRequest !== "Không thay đổi" && changeRequestDetail) 
              ? `${changeRequest} (${changeRequestDetail})` 
              : changeRequest,
            changeRequestDetail,
            quantity: groupQty,
            weight: groupWeight,
            wagePrice: groupWage,
            note: note ? `[${group.nameLabel}] ${note}` : `[${group.nameLabel}]`,
            imageType: product.imageType,
            setNameLabel: group.nameLabel,
            components: selectedComps.map(c => ({
              name: c.name,
              sku: c.sku,
              selectedOption: group.sizes[c.id] || c.defaultOption || c.options?.[0] || "—",
              optionType: c.optionType
            }))
          });
        }
      });
    } else {
      if (wholesaleItems.length === 0) {
        alert("Chị đẹp vui lòng nhập số lượng cho ít nhất 1 kích thước Ni ạ!");
        return;
      }
      if (addBatchToCart) {
        addBatchToCart(wholesaleItems);
      } else {
        wholesaleItems.forEach(item => addToCart(item));
      }
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
            className="flex items-center text-xs font-semibold text-[#00594c] hover:underline shrink-0"
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
            <div className="lg:col-span-6 flex flex-col items-center">
              <div 
                onClick={() => setIsZoomOpen(true)}
                className="w-full aspect-square bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-6 flex items-center justify-center relative shadow-sm group overflow-hidden cursor-zoom-in"
                title="Bấm vào để xem ảnh kích thước đầy đủ"
              >
                <JewelryVisual type={activePreviewType} className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                
                {/* Floating Category Tag */}
                {product.isSet ? (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 pointer-events-none">
                    <Crown className="h-3.5 w-3.5 text-amber-200" />
                    <span>BỘ TRANG SỨC ({product.components?.length || 4} MÓN)</span>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 bg-[#00594c] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
                    {product.categoryName}
                  </div>
                )}

                {/* Hint Xem ảnh kích thước đầy đủ */}
                <div className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Xem ảnh lớn</span>
                </div>
              </div>

              {/* Component Gallery for Sets (Chỉ hiển thị khi là sản phẩm bộ) */}
              {product.isSet && product.components && product.components.length > 0 && (
                <div className="w-full mt-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-600 text-center">
                    Xem chi tiết từng món trong bộ:
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
                    {product.components.map((comp) => (
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
              )}
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: CONFIGURATOR (SET vs SINGLE PRODUCT)                */}
            {/* ================================================================= */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Product Code Header */}
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
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{product.categoryName}</p>
              </div>

              {/* =============================================================== */}
              {/* CASE A: SẢN PHẨM BỘ (JEWELRY SUITE / SET) CONFIGURATOR          */}
              {/* =============================================================== */}
              {product.isSet ? (
                <div className="space-y-5">
                  {/* Specs Bar cho Bộ (2 cột: Trọng lượng & Giá công 1 bộ) */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-6 bg-[#f4f9f7] rounded-2xl border border-emerald-100 text-center items-center">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium">Trọng lượng (1 bộ)</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5 font-mono">
                        {Number(singleSetWeight || 0).toFixed(4)} <span className="text-xs font-normal text-gray-500">Lượng</span>
                      </div>
                    </div>
                    <div className="border-l border-emerald-200/60">
                      <div className="text-[11px] text-gray-500 font-medium">Giá công (1 bộ)</div>
                      <div className="text-base font-bold text-[#00594c] mt-0.5 font-mono">
                        {roundUp5k(singleSetWage).toLocaleString()}đ
                      </div>
                    </div>
                  </div>

                  {/* TẦNG 1: THUỘC TÍNH CHUNG */}
                  <div className="bg-[#f2f8f6] p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
                    <div className="text-xs font-bold text-[#00594c] uppercase tracking-wider flex items-center">
                      <Settings2 className="h-4 w-4 mr-1.5" />
                      Thuộc tính chung
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Màu xi */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Màu xi</label>
                        <select
                          value={goldColor}
                          onChange={(e) => setGoldColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
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
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
                        >
                          {product.availableStoneColors?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Yêu cầu thay đổi */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Yêu cầu thay đổi</label>
                        <select
                          value={changeRequest}
                          onChange={(e) => handleSelectChangeRequest(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
                        >
                          {(product.availableChangeRequests || [
                            "Không thay đổi",
                            "Thay kiểu bào ball",
                            "Đổi sang đá tấm CZ loại 1",
                            "Đổi tuổi vàng 10K lên 18K",
                            "Khắc laser chữ/ký hiệu riêng"
                          ]).map(req => (
                            <option key={req} value={req}>
                              {req !== "Không thay đổi" ? `💎 ${req}` : req}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Chi tiết thay đổi tương ứng cho Bộ */}
                    {CHANGE_REQUEST_CONFIGS[changeRequest] && (
                      <div className="p-3 bg-white/80 rounded-xl border border-emerald-300/80 mt-2 animate-in fade-in duration-200">
                        <label className="block text-[11px] font-semibold text-[#00594c] mb-1.5">
                          {CHANGE_REQUEST_CONFIGS[changeRequest].subLabel}
                        </label>
                        <select
                          value={changeRequestDetail}
                          onChange={(e) => setChangeRequestDetail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-xs cursor-pointer"
                        >
                          {CHANGE_REQUEST_CONFIGS[changeRequest].options.map((opt) => (
                            <option key={opt} value={opt}>
                              💎 {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* TẦNG 2: CÁC MÓN TRONG BỘ */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                        <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                        Các món trong bộ ({selectedComps.length} / {componentStates.length})
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

                    {/* Danh sách các món trong bộ (tinh gọn, chỉ tick chọn, không đặt size ở đây) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {componentStates.map((comp) => {
                        const isChecked = comp.selected;
                        return (
                          <div
                            key={comp.id}
                            onClick={() => toggleComponentSelection(comp.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                              isChecked
                                ? "bg-white border-emerald-400/90 shadow-2xs ring-1 ring-emerald-500/20"
                                : "bg-gray-50/70 border-gray-200 opacity-60 hover:opacity-80"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckCircle2 className="h-4 w-4 text-[#00594c] fill-emerald-100" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="text-xs font-bold text-gray-900 flex items-center space-x-1.5 truncate">
                                <span>{comp.icon}</span>
                                <span className="truncate">{comp.name}</span>
                              </div>
                              <div className="text-[10px] font-mono text-gray-500 truncate">
                                {comp.sku}
                              </div>
                              <div className="text-[10px] text-gray-600 font-medium pt-0.5">
                                TL: <strong className="text-gray-900 font-mono">{Number(comp.weight || 0).toFixed(4)} Lượng</strong> &bull; Công: <strong className="text-[#00594c]">{roundUp5k(comp.wagePrice).toLocaleString()}đ</strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* TẦNG 3: PHÂN BỔ THEO KÍCH THƯỚC BỘ */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                        <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                        Phân bổ theo kích thước bộ
                        <span className="ml-2 bg-emerald-100 text-[#00594c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {setSizeGroups.length} nhóm kích thước
                        </span>
                      </div>

                      {/* Nút + Thêm kích thước */}
                      <button
                        type="button"
                        onClick={handleAddSetSizeGroup}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00594c] border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>+ Thêm kích thước</span>
                      </button>
                    </div>

                    {/* Danh sách từng nhóm Bộ (Bộ 1, Bộ 2, Bộ 3...) */}
                    <div className="space-y-3">
                      {setSizeGroups.map((group, groupIdx) => (
                        <div
                          key={group.id}
                          className="bg-white rounded-2xl border border-gray-200/90 hover:border-emerald-300/80 p-3.5 space-y-3 shadow-2xs transition-all"
                        >
                          {/* Header nhóm: Badge Bộ + Nhập SL Bộ + Nút xóa */}
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <span className="bg-[#00594c] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                                {group.nameLabel || `Bộ ${groupIdx + 1}`}
                              </span>

                              <div className="flex items-center space-x-1.5">
                                <span className="text-[11px] font-semibold text-gray-600">SL:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50/50 overflow-hidden shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateGroupQty(group.id, Math.max(1, (parseInt(group.quantity) || 1) - 1))}
                                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={group.quantity}
                                    onChange={(e) => handleUpdateGroupQty(group.id, e.target.value)}
                                    className="w-12 text-center text-xs font-bold text-gray-900 bg-white py-1 outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateGroupQty(group.id, (parseInt(group.quantity) || 1) + 1)}
                                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-[11px] text-gray-500 font-medium">bộ</span>
                              </div>
                            </div>

                            {/* Nút xóa nhóm bộ */}
                            {setSizeGroups.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSetSizeGroup(group.id)}
                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Xóa nhóm kích thước này"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          {/* Grid dropdown kích thước các món trong bộ */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {selectedComps.filter(c => c.options && c.options.length > 0).map(comp => (
                              <div key={comp.id} className="bg-gray-50/90 rounded-xl p-2 border border-gray-200/80">
                                <div className="flex items-center space-x-1 text-[11px] font-semibold text-gray-700 mb-1 truncate">
                                  <span>{comp.icon}</span>
                                  <span className="truncate">{comp.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] text-gray-400 font-medium shrink-0">{comp.optionType}:</span>
                                  <select
                                    value={group.sizes[comp.id] || comp.defaultOption || comp.options[0]}
                                    onChange={(e) => handleUpdateGroupSize(group.id, comp.id, e.target.value)}
                                    className="w-full bg-white px-1.5 py-1 border border-gray-300 rounded-lg text-xs font-bold text-[#00594c] focus:ring-1 focus:ring-[#00594c] outline-none cursor-pointer"
                                  >
                                    {comp.options.map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TẦNG 4: GHI CHÚ TRÊN SẢN PHẨM */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ghi chú trên sản phẩm
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="VD: Đóng gói hộp cưới riêng, khắc laser..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00594c] shadow-2xs"
                    />
                  </div>

                  {/* TẦNG 5: TẠM TÍNH & NÚT THÊM VÀO GIỎ */}
                  <div className="p-4 bg-[#f0f7f4] border border-emerald-200/90 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200/60">
                      <span className="font-bold text-sm text-gray-900 tracking-tight">Tạm tính:</span>
                      <span className="bg-emerald-100 text-[#00594c] px-2.5 py-0.5 rounded-full font-bold text-xs">
                        {totalSetOrderQty} Bộ ({totalSetItemCount} Món)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 font-medium">Tổng trọng lượng:</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">{totalSetWeight.toFixed(4)} Lượng</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 font-medium">Tổng tiền công:</div>
                        <div className="text-sm font-black text-[#00594c] font-mono mt-0.5">{roundUp5k(totalSetWage).toLocaleString()}đ</div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={selectedComps.length === 0 || totalSetOrderQty === 0}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${
                        addedSuccess
                          ? "bg-emerald-600 text-white"
                          : (selectedComps.length === 0 || totalSetOrderQty === 0)
                          ? "bg-gray-200 cursor-not-allowed text-gray-400"
                          : "bg-[#00594c] hover:bg-[#004737] text-white active:scale-98 shadow-md"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Đã thêm {totalSetOrderQty} Bộ vào giỏ hàng thành công!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            Thêm {totalSetOrderQty} Bộ ({totalSetItemCount} món) vào giỏ hàng
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
                  {/* Specs Bar (2 cột: Trọng lượng theo Lượng & Giá công làm tròn 5000đ) */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-6 bg-[#f4f9f7] rounded-2xl border border-emerald-100 text-center items-center">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium">Trọng lượng</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5 font-mono">
                        {Number(product.weight || 0).toFixed(4)} <span className="text-xs font-normal text-gray-500">Lượng</span>
                      </div>
                    </div>
                    <div className="border-l border-emerald-200/60">
                      <div className="text-[11px] text-gray-500 font-medium">Giá công</div>
                      <div className="text-base font-bold text-[#00594c] mt-0.5 font-mono">
                        {roundUp5k((product.wagePrice || 0) + (GOLD_COLOR_DELTAS[goldColor] || 0)).toLocaleString()}đ
                      </div>
                    </div>
                  </div>

                  {/* Cấu hình chung: Màu xi & Yêu cầu thay đổi */}
                  <div className="bg-[#f8faf9] p-3.5 rounded-2xl border border-gray-200/70 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Màu xi */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Màu xi:</label>
                        <select
                          value={goldColor}
                          onChange={(e) => setGoldColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
                        >
                          {product.availableGoldColors.map((color) => {
                            const delta = GOLD_COLOR_DELTAS[color] || 0;
                            return (
                              <option key={color} value={color}>
                                {color} {delta > 0 ? `(+${(delta / 1000).toLocaleString()}k)` : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Yêu cầu thay đổi */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">Yêu cầu thay đổi:</label>
                        <select
                          value={changeRequest}
                          onChange={(e) => handleSelectChangeRequest(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
                        >
                          {(product.availableChangeRequests || [
                            "Không thay đổi",
                            "Thay kiểu bào ball",
                            "Đổi sang đá tấm CZ loại 1",
                            "Đổi tuổi vàng 10K lên 18K",
                            "Khắc laser chữ/ký hiệu riêng"
                          ]).map((req) => (
                            <option key={req} value={req}>
                              {req !== "Không thay đổi" ? `💎 ${req}` : req}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Chi tiết thay đổi tương ứng xổ ra khi chọn */}
                    {CHANGE_REQUEST_CONFIGS[changeRequest] && (
                      <div className="p-3 bg-[#f0f9f6] rounded-xl border border-emerald-200/90 animate-in fade-in slide-in-from-top-1 duration-200">
                        <label className="block text-[11px] font-semibold text-[#00594c] mb-1.5">
                          {CHANGE_REQUEST_CONFIGS[changeRequest].subLabel}
                        </label>
                        <select
                          value={changeRequestDetail}
                          onChange={(e) => setChangeRequestDetail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-xs cursor-pointer"
                        >
                          {CHANGE_REQUEST_CONFIGS[changeRequest].options.map((opt) => (
                            <option key={opt} value={opt}>
                              💎 {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Phân bổ theo Màu đá & Dải Ni */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                        <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                        Phân bổ Ni theo màu đá
                      </div>
                      <button
                        type="button"
                        onClick={addStoneRow}
                        className="inline-flex items-center text-xs font-bold text-[#00594c] hover:text-[#004737] hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5 mr-0.5" />
                        Thêm màu đá khác
                      </button>
                    </div>

                    {/* List of Stone Rows */}
                    <div className="space-y-3">
                      {stoneRows.map((row) => {
                        const rowTotal = Object.values(row.quantities || {}).reduce((s, q) => s + (parseInt(q) || 0), 0);
                        return (
                          <div
                            key={row.id}
                            className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] font-semibold text-gray-500">Màu đá:</span>
                                <select
                                  value={row.stoneColor}
                                  onChange={(e) => changeRowColor(row.id, e.target.value)}
                                  className="px-2.5 py-1 bg-emerald-50/60 border border-emerald-300 rounded-lg text-xs font-bold text-[#00594c] outline-none"
                                >
                                  {product.availableStoneColors.map((color) => {
                                    const d = STONE_COLOR_DELTAS[color] || 0;
                                    return (
                                      <option key={color} value={color}>
                                        {color} {d > 0 ? `(+${(d / 1000).toLocaleString()}k)` : ""}
                                      </option>
                                    );
                                  })}
                                </select>
                                {rowTotal > 0 && (
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                    {rowTotal} chiếc
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-1.5">
                                {/* Bộ điều khiển điền nhanh số lượng tùy chỉnh */}
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-xs">
                                  <span className="text-[10px] font-medium text-gray-600 px-1 select-none">Mỗi Ni:</span>
                                  <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden h-5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = row.fillQty || 1;
                                        updateRowFillQty(row.id, Math.max(1, cur - 1));
                                      }}
                                      className="px-1 text-gray-500 hover:bg-gray-100 text-[10px] font-bold select-none"
                                      title="Giảm số lượng"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      max="999"
                                      value={row.fillQty ?? 1}
                                      onChange={(e) => updateRowFillQty(row.id, e.target.value)}
                                      className="w-6 text-center text-[11px] font-bold text-gray-900 bg-transparent outline-none p-0"
                                      title="Nhập số lượng cho mỗi Ni"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = row.fillQty || 1;
                                        updateRowFillQty(row.id, cur + 1);
                                      }}
                                      className="px-1 text-gray-500 hover:bg-gray-100 text-[10px] font-bold select-none"
                                      title="Tăng số lượng"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => quickFillRow(row.id, row.fillQty || 1)}
                                    className="ml-1 px-2 py-0.5 bg-[#00594c] hover:bg-[#004737] text-white text-[10px] font-bold rounded transition-colors"
                                    title="Áp dụng số lượng này cho tất cả Ni"
                                  >
                                    Áp dụng
                                  </button>
                                </div>

                                {rowTotal > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => clearRow(row.id)}
                                    className="text-[10px] text-gray-400 hover:text-gray-700 font-medium px-1.5 py-0.5 hover:bg-gray-100 rounded transition-colors"
                                    title="Đặt lại số lượng về 0"
                                  >
                                    Xóa
                                  </button>
                                )}

                                {stoneRows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeStoneRow(row.id)}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                                    title="Xóa dòng màu đá này"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Ni Sizes Grid */}
                            <div>
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {product.availableNiSizes.map((size) => {
                                  const currentQty = row.quantities[size] || 0;
                                  const sizeDelta = getSizeDelta(size);
                                  return (
                                    <div
                                      key={size}
                                      className={`p-1.5 rounded-xl border text-center transition-all ${
                                        currentQty > 0
                                          ? "bg-emerald-50 border-[#00594c] ring-1 ring-emerald-500/20 shadow-xs"
                                          : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
                                      }`}
                                    >
                                      <div className="flex items-center justify-center space-x-0.5">
                                        <span className={`text-[10px] font-bold uppercase tracking-tight ${
                                          currentQty > 0 ? "text-[#00594c]" : "text-gray-500"
                                        }`}>
                                          Ni {size}
                                        </span>
                                        {sizeDelta > 0 && (
                                          <span className="text-[8px] font-black text-amber-700 bg-amber-100/90 px-1 py-0.2 rounded" title="Phụ phí size lớn">
                                            +{sizeDelta / 1000}k
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-center mt-1 space-x-0.5">
                                        <button
                                          type="button"
                                          onClick={() => updateRowQty(row.id, size, currentQty - 1)}
                                          className="h-5 w-5 rounded bg-white hover:bg-gray-200 text-gray-600 border border-gray-200 flex items-center justify-center text-[10px] font-bold"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          value={currentQty === 0 ? "" : currentQty}
                                          placeholder="0"
                                          onChange={(e) => updateRowQty(row.id, size, e.target.value)}
                                          className="w-7 text-center text-xs font-black text-gray-900 bg-transparent outline-none p-0"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => updateRowQty(row.id, size, currentQty + 1)}
                                          className="h-5 w-5 rounded bg-[#00594c] hover:bg-[#004737] text-white flex items-center justify-center text-[10px] font-bold"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ghi chú trên sản phẩm */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Ghi chú trên sản phẩm
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="VD: Đóng túi theo từng màu đá, khắc mã riêng trên sản phẩm..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00594c]"
                    />
                  </div>

                  {/* Summary Card for Wholesale */}
                  <div className="p-4 bg-[#f0f7f4] border border-emerald-200/90 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200/60">
                      <span className="font-bold text-sm text-gray-900 tracking-tight">Tạm tính:</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        totalWholesaleQty > 0
                          ? "bg-emerald-100 text-[#00594c]"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {totalWholesaleQty > 0
                          ? `${totalWholesaleQty} Sản phẩm (${stoneRows.length} Màu)`
                          : "Chưa chọn số lượng"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 font-medium">Tổng trọng lượng:</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          {totalWholesaleWeight.toFixed(4)} Lượng
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 font-medium">Tổng tiền công:</div>
                        <div className="text-sm font-black text-[#00594c] font-mono mt-0.5">
                          {roundUp5k(totalWholesaleWage).toLocaleString()}đ
                        </div>
                      </div>
                    </div>

                    {/* Phụ phí tùy biến (+Δ) nếu có */}
                    {totalSurcharge > 0 && (
                      <div className="text-[11px] text-gray-500 pt-1.5 border-t border-emerald-200/60 flex items-center justify-between">
                        <span>Đã gồm phụ phí tùy biến (+Δ):</span>
                        <span className="font-semibold text-amber-700">+{totalSurcharge.toLocaleString()}đ</span>
                      </div>
                    )}

                    <button
                      onClick={handleAddToCart}
                      disabled={totalWholesaleQty === 0}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${
                        addedSuccess
                          ? "bg-emerald-600 text-white"
                          : totalWholesaleQty === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#00594c] hover:bg-[#004737] text-white active:scale-98 shadow-md"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Đã thêm đơn sỉ {totalWholesaleQty} món vào giỏ hàng!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            {totalWholesaleQty > 0
                              ? `Thêm ${totalWholesaleQty} sản phẩm vào giỏ hàng`
                              : "Vui lòng chọn số lượng Ni để lên đơn"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* LIGHTBOX MODAL: Xem ảnh kích thước đầy đủ                        */}
      {/* ================================================================= */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng [X] */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-full transition-all shadow-xs"
              title="Đóng xem ảnh"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Header thông tin sản phẩm */}
            <div className="text-center mb-4 pr-10">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.categoryName}
              </span>
              <h3 className="font-mono text-lg font-black text-gray-900 mt-1">
                {product.productCode}
              </h3>
            </div>

            {/* Khung hiển thị ảnh lớn chất lượng cao */}
            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
              <JewelryVisual type={activePreviewType} className="w-full h-[65vh] object-contain" />
            </div>
            
            <div className="text-xs text-gray-400 mt-3 text-center">
              Bấm ra ngoài hoặc nút [✕] để đóng
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
