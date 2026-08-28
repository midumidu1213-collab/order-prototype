"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CatalogueCartContext = createContext();

const initialCartItems = [
  // 1. SẢN PHẨM BỘ 4 MÓN
  {
    id: "cart-set-bridal",
    isSet: true,
    productCode: "ST000004A00",
    productName: "Bộ Trang Sức Cưới Kim Cương (4 Món)",
    goldColor: "Trắng",
    goldAge: "18K (75Y)",
    mainStoneColor: "Trắng / Đỏ",
    quantity: 1,
    weight: 0.048,
    wagePrice: 6200000,
    note: "Đóng gói Hộp Cưới Sơn Mài",
    imageType: "set-diamond-bridal",
    components: [
      {
        id: "comp-set-ring",
        itemType: "ring",
        name: "Nhẫn nữ",
        sku: "GY0RG000095A00A00CZBB3CZXX1017",
        weight: 0.010,
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
        name: "Dây chuyền",
        sku: "GY0NE000004B00B00000000000000420",
        weight: 0.018,
        wagePrice: 2200000,
        selectedOption: "42cm",
        optionType: "Chiều dài",
        changeRequest: "—",
        selected: true,
        icon: "📿"
      },
      {
        id: "comp-set-earr",
        itemType: "earrings",
        name: "Bông tai",
        sku: "GY0EG000095A00A000000000000000",
        weight: 0.006,
        wagePrice: 900000,
        selectedOption: null,
        optionType: null,
        changeRequest: "—",
        selected: true,
        icon: "✨"
      },
      {
        id: "comp-set-brac",
        itemType: "bracelet",
        name: "Vòng tay",
        sku: "GY0BE000095A00A00CZBB3CZXX1560",
        weight: 0.014,
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
    weight: 0.010,
    wagePrice: 1500000,
    note: "Chiếc lẻ tặng người thân",
    imageType: "loose-diamond"
  },

  // 3. SẢN PHẨM MUA LẺ KHÁC
  {
    id: "cart-item-kitty",
    isSet: false,
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
    weight: 0.040,
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
      const saved = localStorage.getItem("sevago_catalogue_cart_v3");
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        localStorage.setItem("sevago_catalogue_cart_v3", JSON.stringify(initialCartItems));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sevago_catalogue_cart_v3", JSON.stringify(cartItems));
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
      const newSetItem = {
        id: `cart-set-${Date.now()}`,
        isSet: true,
        productCode: itemConfig.productCode,
        productName: itemConfig.productName,
        goldColor: itemConfig.goldColor,
        goldAge: itemConfig.goldAge,
        mainStoneColor: itemConfig.mainStoneColor,
        changeRequest: itemConfig.changeRequest,
        quantity: setQty,
        weight: itemConfig.weight,
        wagePrice: itemConfig.wagePrice,
        note: itemConfig.note || "",
        imageType: itemConfig.imageType,
        components: itemConfig.components
      };
      setCartItems(prev => [newSetItem, ...prev]);
      showToast(`👑 Đã thêm ${setQty} Bộ [${itemConfig.productCode}] vào giỏ chào hàng!`);
      return;
    }

    const singleQty = Number(itemConfig.quantity) || 1;
    const newItem = {
      id: `cart-${Date.now()}`,
      isSet: false,
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
      weight: itemConfig.weight || 0.010,
      wagePrice: itemConfig.wagePrice || 1500000,
      note: itemConfig.note || "",
      imageType: itemConfig.imageType || "loose-diamond"
    };

    setCartItems(prev => [newItem, ...prev]);
    showToast(`✨ Đã thêm món lẻ ${newItem.productCode.substring(0, 16)}... vào giỏ chào hàng!`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast("🗑️ Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const removeSetComponent = (setId, compId) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === setId && item.isSet) {
        const updatedComps = item.components.filter(c => c.id !== compId);
        const singleSetWeight = updatedComps.reduce((sum, c) => sum + (c.weight || 0), 0);
        const singleSetWage = updatedComps.reduce((sum, c) => sum + (c.wagePrice || 0), 0);
        return {
          ...item,
          components: updatedComps,
          weight: singleSetWeight * (item.quantity || 1),
          wagePrice: singleSetWage * (item.quantity || 1)
        };
      }
      return item;
    }).filter(item => !item.isSet || (item.components && item.components.length > 0)));
    showToast("✂️ Đã loại bớt món khỏi Bộ");
  };

  const updateCartItem = (id, updatedFields) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
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

  // Total weight
  const totalWeight = cartItems.reduce((sum, item) => {
    if (item.isSet && item.components) {
      const singleSetWeight = item.components.reduce((cSum, c) => cSum + (c.weight || 0), 0);
      return sum + (singleSetWeight * (Number(item.quantity) || 1));
    }
    return sum + ((Number(item.weight) || 0) * (Number(item.quantity) || 1));
  }, 0);

  return (
    <CatalogueCartContext.Provider
      value={{
        cartItems,
        orderInfo,
        setOrderInfo,
        addToCart,
        removeFromCart,
        removeSetComponent,
        updateCartItem,
        clearCart,
        totalQuantity,
        totalWeight,
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
