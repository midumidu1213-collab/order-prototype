"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CatalogueCartContext = createContext();

const initialCartItems = [
  // 1. SẢN PHẨM BỘ 4 MÓN
  {
    id: "cart-set-bridal",
    isSet: true,
    category: "Bộ trang sức",
    productCode: "ST000004A00",
    productName: "Bộ Trang Sức Cưới Kim Cương (4 Món)",
    goldColor: "Trắng",
    goldAge: "18K (75Y)",
    mainStoneColor: "Trắng / Đỏ",
    quantity: 1,
    goldWeight: 0.0420,
    stoneWeight: 0.0060,
    weight: 0.0480,
    wagePrice: 6200000,
    note: "Đóng gói Hộp Cưới Sơn Mài",
    imageType: "set-diamond-bridal",
    components: [
      {
        id: "comp-set-ring",
        itemType: "ring",
        category: "Nhẫn nữ",
        name: "Nhẫn nữ",
        sku: "GY0RG000095A00A00CZBB3CZXX1017",
        goldWeight: 0.0085,
        stoneWeight: 0.0015,
        weight: 0.0100,
        wagePrice: 1500000,
        selectedOption: "50",
        optionType: "Size Ni",
        changeRequest: "—",
        selected: true,
        icon: "💍"
      },
      {
        id: "comp-set-neck",
        itemType: "necklace",
        category: "Dây chuyền nữ",
        name: "Dây chuyền",
        sku: "GY0NE000004B00B00000000000000420",
        goldWeight: 0.0160,
        stoneWeight: 0.0020,
        weight: 0.0180,
        wagePrice: 2200000,
        selectedOption: "42",
        optionType: "Size",
        changeRequest: "—",
        selected: true,
        icon: "📿"
      },
      {
        id: "comp-set-earr",
        itemType: "earrings",
        category: "Bông tai",
        name: "Bông tai",
        sku: "GY0EG000095A00A000000000000000",
        goldWeight: 0.0050,
        stoneWeight: 0.0010,
        weight: 0.0060,
        wagePrice: 900000,
        selectedOption: "0",
        optionType: "Size",
        changeRequest: "—",
        selected: true,
        icon: "✨"
      },
      {
        id: "comp-set-brac",
        itemType: "bracelet",
        category: "Lắc tay nữ",
        name: "Vòng tay",
        sku: "GY0BE000095A00A00CZBB3CZXX1560",
        goldWeight: 0.0125,
        stoneWeight: 0.0015,
        weight: 0.0140,
        wagePrice: 1600000,
        selectedOption: "54",
        optionType: "Size Ni",
        changeRequest: "—",
        selected: true,
        icon: "💫"
      }
    ]
  },

  // 2. SẢN PHẨM MUA LẺ (CÙNG MÃ NHẪN VỚI BỘ ĐỂ THẤY RÕ SỰ KHÁC BIỆT)
  {
    id: "cart-item-single-ring",
    isSet: false,
    category: "Nhẫn nữ",
    productCode: "GY0RG000095A00A00CZBB3CZXX1017",
    productName: "Nhẫn nữ (Mua lẻ ngoài bộ)",
    mainStoneColor: "Trắng / Đỏ",
    goldColor: "Trắng",
    yckh: "Khắc laser chữ MẸ",
    carvingStyle: "—",
    htjAccessory: "—",
    techGroup: "—",
    niSize: "54",
    quantity: 1,
    goldWeight: 0.0085,
    stoneWeight: 0.0015,
    weight: 0.0100,
    wagePrice: 1500000,
    note: "Chiếc lẻ tặng người thân",
    imageType: "loose-diamond"
  },

  // 3. SẢN PHẨM MUA LẺ KHÁC (Không đá)
  {
    id: "cart-item-kitty",
    isSet: false,
    category: "Lắc tay nữ",
    productCode: "GY0BE000104A00A00000000000560",
    productName: "Lắc tay charm mèo Kitty",
    mainStoneColor: "000",
    goldColor: "Trắng",
    yckh: "—",
    carvingStyle: "—",
    htjAccessory: "—",
    techGroup: "—",
    niSize: "56",
    quantity: 1,
    goldWeight: 0.0400,
    stoneWeight: 0,
    weight: 0.0400,
    wagePrice: 300000,
    note: "",
    imageType: "cat-charm-bracelet"
  }
];

export function CatalogueCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [orderInfo, setOrderInfo] = useState({
    orderCode: "SO2608378",
    status: "Chờ cập nhật",
    customerCode: "200038",
    customerName: "Khách hàng Doanh nghiệp Sen Vàng",
    goldAge: "18K (75Y)",
    material: "Vàng Trắng 18K",
    stoneMaterial: "Kim Cương / Moissanite",
    orderType: "Bán hàng",
    provisionalPrice: "Chờ báo giá",
    discount: "---",
    priceAfterDiscount: "---",
    officialPrice: "Chờ báo giá"
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Load from localStorage if available, or initialize
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sevago_catalogue_cart_v4");
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        localStorage.setItem("sevago_catalogue_cart_v4", JSON.stringify(initialCartItems));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sevago_catalogue_cart_v4", JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (itemConfig) => {
    if (itemConfig.isSet) {
      const setQty = Number(itemConfig.quantity) || 1;
      const comps = itemConfig.components || [];
      const setTotalW = comps.reduce((sum, c) => sum + (c.weight || 0), 0) || itemConfig.weight || 0.0480;
      const setStoneW = comps.reduce((sum, c) => sum + (c.stoneWeight || 0), 0) || itemConfig.stoneWeight || 0.0060;
      const setGoldW = comps.reduce((sum, c) => sum + (c.goldWeight || 0), 0) || itemConfig.goldWeight || (setTotalW - setStoneW);

      const newSetItem = {
        id: `cart-set-${Date.now()}`,
        isSet: true,
        category: itemConfig.category || itemConfig.categoryName || "Bộ trang sức",
        productCode: itemConfig.productCode,
        productName: itemConfig.productName,
        goldColor: itemConfig.goldColor,
        goldAge: itemConfig.goldAge,
        mainStoneColor: itemConfig.mainStoneColor,
        changeRequest: itemConfig.changeRequest,
        quantity: setQty,
        goldWeight: setGoldW,
        stoneWeight: setStoneW,
        weight: setTotalW,
        wagePrice: itemConfig.wagePrice,
        note: itemConfig.note || "",
        imageType: itemConfig.imageType,
        components: comps
      };
      setCartItems(prev => [newSetItem, ...prev]);
      showToast(`👑 Đã thêm ${setQty} Bộ [${itemConfig.productCode}] vào giỏ chào hàng!`);
      return;
    }

    const singleQty = Number(itemConfig.quantity) || 1;
    const hasStone = itemConfig.mainStoneColor !== "000" && itemConfig.mainStoneColor !== "Không đá";
    const singleStoneW = typeof itemConfig.stoneWeight === "number" ? itemConfig.stoneWeight : (hasStone ? 0.0015 : 0);
    const singleTotalW = typeof itemConfig.weight === "number" ? itemConfig.weight : 0.0100;
    const singleGoldW = typeof itemConfig.goldWeight === "number" ? itemConfig.goldWeight : Math.max(0, singleTotalW - singleStoneW);

    const newItem = {
      id: `cart-${Date.now()}`,
      isSet: false,
      category: itemConfig.category || itemConfig.categoryName || "Nhẫn nữ",
      productCode: itemConfig.productCode || "GY0RG000095A00A00CZBB3CZXX1017",
      productName: itemConfig.productName || "Trang sức cao cấp SEVAGO",
      mainStoneColor: itemConfig.mainStoneColor || "Trắng / Đỏ",
      goldColor: itemConfig.goldColor || "Trắng",
      yckh: itemConfig.changeRequest || "—",
      carvingStyle: itemConfig.carvingStyle || "—",
      htjAccessory: itemConfig.htjAccessory || "—",
      techGroup: itemConfig.techGroup || "—",
      niSize: itemConfig.niSize || "54",
      quantity: singleQty,
      goldWeight: singleGoldW,
      stoneWeight: singleStoneW,
      weight: singleTotalW,
      wagePrice: itemConfig.wagePrice || 1500000,
      baseWage: itemConfig.baseWage || itemConfig.wagePrice || 1500000,
      itemDelta: itemConfig.itemDelta || 0,
      note: itemConfig.note || "",
      imageType: itemConfig.imageType || "loose-diamond"
    };

    setCartItems(prev => [newItem, ...prev]);
    showToast(`✨ Đã thêm món lẻ ${newItem.productCode.substring(0, 16)}... vào giỏ chào hàng!`);
  };

  const addBatchToCart = (items) => {
    if (!items || items.length === 0) return;
    const newItems = items.map((itemConfig, idx) => {
      const totalW = typeof itemConfig.weight === "number" ? itemConfig.weight : 0.0294;
      const hasStone = itemConfig.stoneColor !== "000" && itemConfig.mainStoneColor !== "000" && itemConfig.mainStoneColor !== "Không đá";
      const stoneW = typeof itemConfig.stoneWeight === "number" ? itemConfig.stoneWeight : (hasStone ? 0.0030 : 0);
      const goldW = typeof itemConfig.goldWeight === "number" ? itemConfig.goldWeight : Math.max(0, totalW - stoneW);

      return {
        id: `cart-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        isSet: false,
        category: itemConfig.category || itemConfig.categoryName || "Trang sức lẻ",
        productCode: itemConfig.productCode || "GY0RG000095A00A00CZBB3CZXX1017",
        productName: itemConfig.productName || "Trang sức cao cấp SEVAGO",
        mainStoneColor: itemConfig.mainStoneColor || itemConfig.stoneColor || "Trắng",
        goldColor: itemConfig.goldColor || "Vàng",
        yckh: itemConfig.changeRequest || itemConfig.yckh || itemConfig.customerRequest || "—",
        changeRequest: itemConfig.changeRequest || itemConfig.yckh || itemConfig.customerRequest || "—",
        carvingStyle: itemConfig.carvingStyle || "—",
        htjAccessory: itemConfig.htjAccessory || "—",
        techGroup: itemConfig.techGroup || "—",
        size: itemConfig.size || itemConfig.niSize || "20",
        niSize: itemConfig.size || itemConfig.niSize || "20",
        quantity: Number(itemConfig.quantity) || 1,
        goldWeight: goldW,
        stoneWeight: stoneW,
        weight: totalW,
        wagePrice: typeof itemConfig.wagePrice === "number" ? itemConfig.wagePrice : 0,
        priceDisplay: itemConfig.priceDisplay || (itemConfig.wagePrice ? `${itemConfig.wagePrice.toLocaleString()}đ` : "Tính giá sau"),
        isPricePending: itemConfig.isPricePending || itemConfig.priceDisplay === "Tính giá sau" || itemConfig.wagePrice === 0,
        isCustomOrOther: itemConfig.isCustomOrOther || itemConfig.priceDisplay === "Tính giá sau",
        baseWage: itemConfig.baseWage || itemConfig.wagePrice || 0,
        itemDelta: itemConfig.itemDelta || 0,
        note: itemConfig.note || "—",
        imageType: itemConfig.imageType || "ring-men-black"
      };
    });

    setCartItems(prev => [...newItems, ...prev]);
    const totalAddedQty = newItems.reduce((sum, item) => sum + item.quantity, 0);
    showToast(`✨ Đã thêm cả lô ${totalAddedQty} sản phẩm vào giỏ chào hàng thành công!`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast("🗑️ Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const removeSetComponent = (setId, compId) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === setId && item.isSet) {
        const updatedComps = item.components.filter(c => c.id !== compId);
        const singleSetGoldWeight = updatedComps.reduce((sum, c) => sum + (c.goldWeight || 0), 0);
        const singleSetStoneWeight = updatedComps.reduce((sum, c) => sum + (c.stoneWeight || 0), 0);
        const singleSetWeight = updatedComps.reduce((sum, c) => sum + (c.weight || 0), 0);
        const singleSetWage = updatedComps.reduce((sum, c) => sum + (c.wagePrice || 0), 0);
        return {
          ...item,
          components: updatedComps,
          goldWeight: singleSetGoldWeight,
          stoneWeight: singleSetStoneWeight,
          weight: singleSetWeight,
          wagePrice: singleSetWage * (item.quantity || 1)
        };
      }
      return item;
    }).filter(item => !item.isSet || (item.components && item.components.length > 0)));
    showToast("✂️ Đã loại bớt món khỏi Bộ");
  };

  const updateCartItem = (id, updatedFields) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updatedFields };
        if (typeof updatedFields.goldWeight === "number" || typeof updatedFields.stoneWeight === "number") {
          const gw = typeof updated.goldWeight === "number" ? updated.goldWeight : (updated.weight - (updated.stoneWeight || 0));
          const sw = typeof updated.stoneWeight === "number" ? updated.stoneWeight : 0;
          updated.goldWeight = gw;
          updated.stoneWeight = sw;
          updated.weight = gw + sw;
        }
        return updated;
      }
      return item;
    }));
    showToast("✏️ Đã cập nhật thông tin sản phẩm");
  };

  const clearCart = () => {
    setCartItems([]);
    showToast("🧹 Đã làm trống giỏ hàng");
  };

  // Calculate total item count
  const totalQuantity = cartItems.reduce((sum, item) => {
    if (item.isSet) {
      const compsCount = item.components ? item.components.length : 1;
      return sum + (compsCount * (Number(item.quantity) || 1));
    }
    return sum + (Number(item.quantity) || 1);
  }, 0);

  // Total Gold Weight (đã quy đổi theo tuổi vàng)
  const totalGoldWeight = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    if (item.isSet && item.components) {
      const singleSetGoldW = item.components.reduce((cSum, c) => cSum + (c.goldWeight || (c.weight ? c.weight * 0.85 : 0)), 0);
      return sum + (singleSetGoldW * qty);
    }
    const itemGoldW = typeof item.goldWeight === "number" ? item.goldWeight : Math.max(0, (Number(item.weight) || 0) - (Number(item.stoneWeight) || 0));
    return sum + (itemGoldW * qty);
  }, 0);

  // Total Stone Weight
  const totalStoneWeight = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    if (item.isSet && item.components) {
      const singleSetStoneW = item.components.reduce((cSum, c) => cSum + (c.stoneWeight || 0), 0);
      return sum + (singleSetStoneW * qty);
    }
    const itemStoneW = typeof item.stoneWeight === "number" ? item.stoneWeight : 0;
    return sum + (itemStoneW * qty);
  }, 0);

  // Total Weight (Tổng trọng lượng vàng + đá)
  const totalWeight = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    if (item.isSet && item.components) {
      const singleSetWeight = item.components.reduce((cSum, c) => cSum + (c.weight || 0), 0);
      return sum + (singleSetWeight * qty);
    }
    return sum + ((Number(item.weight) || 0) * qty);
  }, 0);

  // Total Wage
  const totalWagePrice = cartItems.reduce((sum, item) => {
    return sum + ((Number(item.wagePrice) || 0) * (Number(item.quantity) || 1));
  }, 0);

  return (
    <CatalogueCartContext.Provider
      value={{
        cartItems,
        orderInfo,
        setOrderInfo,
        addToCart,
        addBatchToCart,
        removeFromCart,
        removeSetComponent,
        updateCartItem,
        clearCart,
        totalQuantity,
        totalGoldWeight,
        totalStoneWeight,
        totalWeight,
        totalWagePrice,
        toastMessage,
        showToast
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00594C] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-400/40 animate-bounce">
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </CatalogueCartContext.Provider>
  );
}

export function useCatalogueCart() {
  const context = useContext(CatalogueCartContext);
  if (!context) {
    throw new Error("useCatalogueCart must be used within CatalogueCartProvider");
  }
  return context;
}
