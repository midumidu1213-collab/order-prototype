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
  Layers,
  FileSpreadsheet,
  Printer,
  Download,
  Clock,
  AlertCircle,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useCatalogueCart } from "@/context/CatalogueCartContext";
import QuotationExportModal from "@/components/catalogue/QuotationExportModal";

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
    totalGoldWeight,
    totalStoneWeight,
    totalWeight,
    totalWagePrice,
    showToast
  } = useCatalogueCart();

  const [copiedId, setCopiedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Quản lý trạng thái thu gọn - mở rộng các sản phẩm Bộ
  const [collapsedSets, setCollapsedSets] = useState({});

  const toggleSetCollapse = (setId) => {
    setCollapsedSets((prev) => ({
      ...prev,
      [setId]: !prev[setId]
    }));
  };

  const setItems = cartItems.filter((i) => i.isSet);
  const hasSetItems = setItems.length > 0;
  const allSetsCollapsed = hasSetItems && setItems.every((i) => collapsedSets[i.id]);

  const toggleAllSets = () => {
    if (allSetsCollapsed) {
      setCollapsedSets({});
    } else {
      const newCollapsed = {};
      setItems.forEach((i) => {
        newCollapsed[i.id] = true;
      });
      setCollapsedSets(newCollapsed);
    }
  };

  // Search & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortField(null);
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60 inline ml-1" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#00594c] inline ml-1 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#00594c] inline ml-1 font-bold" />
    );
  };

  // Lọc sản phẩm
  const filteredCartItems = cartItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.productCode && item.productCode.toLowerCase().includes(q)) ||
      (item.productName && item.productName.toLowerCase().includes(q)) ||
      (item.goldColor && item.goldColor.toLowerCase().includes(q)) ||
      (item.mainStoneColor && item.mainStoneColor.toLowerCase().includes(q)) ||
      (item.size && String(item.size).toLowerCase().includes(q)) ||
      (item.niSize && String(item.niSize).toLowerCase().includes(q)) ||
      (item.changeRequest && item.changeRequest.toLowerCase().includes(q)) ||
      (item.yckh && item.yckh.toLowerCase().includes(q)) ||
      (item.note && item.note.toLowerCase().includes(q))
    );
  });

  // Sắp xếp sản phẩm
  const sortedCartItems = [...filteredCartItems].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "size") {
      valA = a.size || a.niSize || "";
      valB = b.size || b.niSize || "";
    } else if (sortField === "goldWeight") {
      valA = typeof a.goldWeight === "number" ? a.goldWeight : Math.max(0, (Number(a.weight) || 0) - (Number(a.stoneWeight) || 0));
      valB = typeof b.goldWeight === "number" ? b.goldWeight : Math.max(0, (Number(b.weight) || 0) - (Number(b.stoneWeight) || 0));
    } else if (sortField === "stoneWeight") {
      valA = typeof a.stoneWeight === "number" ? a.stoneWeight : 0;
      valB = typeof b.stoneWeight === "number" ? b.stoneWeight : 0;
    } else if (sortField === "weight") {
      valA = Number(a.weight) || 0;
      valB = Number(b.weight) || 0;
    }
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Phân loại các sản phẩm trong giỏ hàng để thực hiện quy tắc Tự Động Tách Đơn của Chị đẹp
  const customItems = cartItems.filter(
    (item) => item.isCustomOrOther || item.changeCategory === "Khác" || (item.hasOtherChange && item.otherChangeDescription?.trim())
  );
  const standardItems = cartItems.filter(
    (item) => !item.isCustomOrOther && item.changeCategory !== "Khác" && !(item.hasOtherChange && item.otherChangeDescription?.trim())
  );
  const hasAutoSplit = customItems.length > 0;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmOrder = () => {
    // Lưu các đơn vào localStorage để Admin Quản lý Đơn hàng (/orders) truy xuất
    try {
      const existingOrdersRaw = localStorage.getItem("SEVAGO_ORDERS_STORE");
      let orderList = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];

      if (hasAutoSplit) {
        // TỰ ĐỘNG TÁCH LÀM 2 ĐƠN THEO ĐÚNG YÊU CẦU:
        // Đơn 1: Đơn chuẩn (nếu có standardItems)
        const stdOrder = {
          id: 11,
          code: `${orderInfo.orderCode || "SO2608011"}-STD`,
          customerCode: orderInfo.customerCode || "2037105",
          customer: orderInfo.customerName || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
          status: "Chờ xác nhận",
          type: "Đơn hàng Tiêu chuẩn",
          qty: standardItems.length,
          items: standardItems,
          total: totalWagePrice ? `${totalWagePrice.toLocaleString()}đ` : "28.000.000đ",
          date: new Date().toLocaleDateString("vi-VN"),
          createdAt: new Date().toLocaleString("vi-VN")
        };

        // Đơn 2: Đơn chứa Yêu cầu thay đổi khác (ở trạng thái CHỜ XỬ LÝ)
        const customOrder = {
          id: 13,
          code: `${orderInfo.orderCode || "SO2608011"}-CUSTOM`,
          customerCode: orderInfo.customerCode || "2037105",
          customer: orderInfo.customerName || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
          status: "Chờ xử lý", // Trạng thái Chờ xử lý theo đúng yêu cầu
          type: "Đơn Gia công đặc biệt (Tách từ E-C)",
          qty: customItems.length,
          items: customItems,
          total: "Tính giá sau",
          isSplitCustomOrder: true,
          hasOtherChangeRequest: true,
          adminConfiguredAttrs: {
            lacquerMachine: "Móc máy + Lácquer",
            lacquerTechGroup: "Nhóm 1 - Men sứ đơn sắc phủ nano",
            lacquerNote: "Men nano phủ lòng trong chấu đá",
            cordColor: "Dây đỏ may mắn",
            castChange: "Đổi cast ổ 6 chấu cao cấp viền kim",
            pearlToBall: "---",
            sideStone: "4 viên đá CZ phụ 1.2mm giác cắt kim cương",
            officialWage: ""
          },
          date: new Date().toLocaleDateString("vi-VN"),
          createdAt: new Date().toLocaleString("vi-VN")
        };

        orderList = [customOrder, stdOrder, ...orderList.filter(o => o.id !== 11 && o.id !== 13)];
      }
      localStorage.setItem("SEVAGO_ORDERS_STORE", JSON.stringify(orderList));
    } catch (e) {
      console.error(e);
    }

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
              onClick={() => setIsQuotationModalOpen(true)}
              className="flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors cursor-pointer"
              title="Xuất Báo Giá Chào Hàng (PDF & Excel)"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              Xuất Báo Giá
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
              <span className="text-gray-500 font-medium">Tổng Trọng lượng vàng:</span>{" "}
              <span className="font-bold text-amber-900 font-mono text-sm">{totalGoldWeight > 0 ? `${totalGoldWeight.toFixed(4)}g` : "—"}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Tổng Trọng lượng đá:</span>{" "}
              <span className="font-bold text-gray-800 font-mono text-sm">{totalStoneWeight > 0 ? `${totalStoneWeight.toFixed(4)}g` : "—"}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Tổng trọng lượng:</span>{" "}
              <span className="font-bold text-gray-950 font-mono text-sm">{totalWeight > 0 ? `${totalWeight.toFixed(4)}g` : "—"}</span>
            </div>

            <div>
              <span className="text-gray-500 font-medium">Giá tạm tính:</span>{" "}
              <span className="font-bold text-[#00594c] font-mono">{totalWagePrice > 0 ? `${totalWagePrice.toLocaleString()}đ` : orderInfo.provisionalPrice}</span>
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
        {/* PRODUCT LIST TABLE WITH TREE HIERARCHY FOR SETS & 10 STANDARDIZED COLUMNS */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/90 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-gray-900">Danh sách sản phẩm chào hàng</h3>
              <span className="bg-emerald-100 text-[#00594c] text-xs px-2.5 py-0.5 rounded-full font-bold">
                {totalQuantity} món thành phẩm
              </span>
            </div>
            
            {/* Search Input Filter & Quick Collapse/Expand All Sets for Cart Items */}
            <div className="flex items-center space-x-3">
              {hasSetItems && (
                <button
                  type="button"
                  onClick={toggleAllSets}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-emerald-200 bg-emerald-50/80 text-[#00594c] hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                  title={allSetsCollapsed ? "Mở rộng tất cả các bộ" : "Thu gọn tất cả các bộ"}
                >
                  {allSetsCollapsed ? (
                    <>
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span>Mở rộng tất cả bộ</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span>Thu gọn tất cả bộ</span>
                    </>
                  )}
                </button>
              )}
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã, màu xi, đá, size..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#00594c] rounded-xl outline-none w-56 sm:w-64 transition-all"
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">{sortedCartItems.length} mục</span>
            </div>
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
                <thead className="bg-[#f2f7f5] text-gray-700 font-semibold border-b border-gray-200 text-xs">
                  <tr>
                    <th className="py-3.5 px-4 cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" onClick={() => handleSort("productCode")}>
                      <div className="flex items-center space-x-1">
                        <span>Mã sản phẩm / Tên món</span>
                        <SortIcon field="productCode" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" onClick={() => handleSort("goldColor")}>
                      <div className="flex items-center space-x-1">
                        <span>Màu xi</span>
                        <SortIcon field="goldColor" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" onClick={() => handleSort("mainStoneColor")}>
                      <div className="flex items-center space-x-1">
                        <span>Màu đá</span>
                        <SortIcon field="mainStoneColor" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" onClick={() => handleSort("size")}>
                      <div className="flex items-center space-x-1">
                        <span>Kích thước / Ni</span>
                        <SortIcon field="size" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Yêu cầu khách hàng</th>
                    <th className="py-3.5 px-3 cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" onClick={() => handleSort("wagePrice")}>
                      <div className="flex items-center space-x-1">
                        <span>Tiền công</span>
                        <SortIcon field="wagePrice" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-center cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" onClick={() => handleSort("quantity")}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Số lượng</span>
                        <SortIcon field="quantity" />
                      </div>
                    </th>
                    {/* CỘT 8: TỔNG TRỌNG LƯỢNG VÀNG */}
                    <th 
                      className="py-3.5 px-3 text-right cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" 
                      onClick={() => handleSort("goldWeight")}
                      title="Tổng Trọng lượng vàng (đã quy đổi theo tuổi vàng)"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Tổng Trọng lượng vàng</span>
                        <SortIcon field="goldWeight" />
                      </div>
                    </th>

                    {/* CỘT 9: TỔNG TRỌNG LƯỢNG ĐÁ */}
                    <th 
                      className="py-3.5 px-3 text-right cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" 
                      onClick={() => handleSort("stoneWeight")}
                      title="Tổng Trọng lượng đá"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Tổng Trọng lượng đá</span>
                        <SortIcon field="stoneWeight" />
                      </div>
                    </th>

                    {/* CỘT 10: TỔNG TRỌNG LƯỢNG */}
                    <th 
                      className="py-3.5 px-3 text-right cursor-pointer hover:bg-emerald-50/50 select-none whitespace-nowrap" 
                      onClick={() => handleSort("weight")}
                      title="Tổng trọng lượng thành phẩm (Vàng + Đá)"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Tổng trọng lượng</span>
                        <SortIcon field="weight" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 whitespace-nowrap">Ghi chú</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {sortedCartItems.map((item) => {
                    
                    // RENDER CASE 1: SẢN PHẨM BỘ (PARENT + CHILD ROWS)
                    if (item.isSet) {
                      const setQty = Number(item.quantity) || 1;
                      const isCollapsed = !!collapsedSets[item.id];
                      const compCount = item.components?.length || 0;

                      return (
                        <React.Fragment key={item.id}>
                          {/* Parent Set Header Row */}
                          <tr className="bg-emerald-50/70 font-bold border-t-2 border-emerald-300">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => toggleSetCollapse(item.id)}
                                  className="p-1 rounded-md hover:bg-emerald-200/80 text-[#00594c] transition-colors cursor-pointer shrink-0"
                                  title={isCollapsed ? "Mở rộng xem chi tiết các món con" : "Thu gọn danh sách món con"}
                                >
                                  {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center space-x-1 shrink-0">
                                  <Crown className="h-3 w-3 inline" />
                                  <span>BỘ</span>
                                </span>
                                <div>
                                  <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm font-bold text-gray-900">
                                    <span className="text-[#00594c] font-black">{item.productCode}</span>
                                    <button
                                      onClick={() => handleCopy(item.id, item.productCode)}
                                      className="text-gray-400 hover:text-[#00594c] transition-colors p-0.5 cursor-pointer"
                                      title="Sao chép mã bộ"
                                    >
                                      {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-gray-600 font-sans font-normal mt-0.5">
                                    {item.productName} &bull; <span className="text-gray-400">{item.goldAge}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            {/* Màu xi */}
                            <td className="py-3.5 px-3 text-xs text-gray-800 font-semibold">{item.goldColor || "Trắng"}</td>
                            {/* Màu đá */}
                            <td className="py-3.5 px-3 text-xs text-emerald-950 font-semibold">{item.mainStoneColor || "—"}</td>
                            {/* Kích thước / Ni (Tích hợp nút bấm Toggle thu gọn / mở rộng tiện lợi) */}
                            <td className="py-3.5 px-3 text-xs">
                              <button
                                type="button"
                                onClick={() => toggleSetCollapse(item.id)}
                                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                                  isCollapsed
                                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 shadow-2xs"
                                    : "bg-emerald-100/90 text-emerald-900 hover:bg-emerald-200 border border-emerald-300"
                                }`}
                                title={isCollapsed ? "Bấm để mở rộng danh sách món con" : "Bấm để thu gọn danh sách món con"}
                              >
                                <span>{compCount} Món thành phần</span>
                                {isCollapsed ? (
                                  <ChevronRight className="h-3.5 w-3.5 text-amber-800" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 text-emerald-800" />
                                )}
                              </button>
                            </td>
                            {/* YCKH */}
                            <td className="py-3.5 px-3 text-xs text-gray-600 font-medium">
                              {item.changeRequest && item.changeRequest !== "—" ? (
                                <span className="text-[#00594c] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {item.changeRequest}
                                </span>
                              ) : "—"}
                            </td>
                            {/* Tiền công */}
                            <td className="py-3.5 px-3 font-mono font-bold text-emerald-700 text-xs">
                              {item.wagePrice ? `${Number(item.wagePrice).toLocaleString()}đ` : "—"}
                            </td>
                            {/* Số lượng */}
                            <td className="py-3.5 px-3 text-center text-xs font-mono font-black text-[#00594c]">
                              {setQty} Bộ
                            </td>
                            {/* TL vàng (quy đổi) */}
                            <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-900 text-xs">
                              {item.goldWeight ? `${(Number(item.goldWeight) * setQty).toFixed(4)}g` : "—"}
                            </td>
                            {/* TL đá */}
                            <td className="py-3.5 px-3 text-right font-mono font-medium text-gray-800 text-xs">
                              {item.stoneWeight ? `${(Number(item.stoneWeight) * setQty).toFixed(4)}g` : "—"}
                            </td>
                            {/* Tổng TL */}
                            <td className="py-3.5 px-3 text-right font-mono font-black text-gray-900 text-xs">
                              {item.weight ? `${(Number(item.weight) * setQty).toFixed(4)}g` : "—"}
                            </td>
                            {/* Ghi chú */}
                            <td className="py-3.5 px-3 text-xs text-gray-500">{item.note || "Hộp Cưới VIP"}</td>
                            {/* Thao tác */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa toàn bộ set"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>

                          {/* Child Component Rows (Món con trong bộ) - Chỉ hiển thị khi KHÔNG thu gọn */}
                          {!isCollapsed && item.components?.map((comp) => (
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
                                        className="text-gray-400 hover:text-[#00594c] transition-colors p-0.5 cursor-pointer"
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
                              {/* Màu xi theo bộ */}
                              <td className="py-2.5 px-3 text-xs text-gray-400 font-medium">Theo bộ</td>
                              {/* Màu đá theo bộ */}
                              <td className="py-2.5 px-3 text-xs text-gray-400 font-medium">Theo bộ</td>
                              {/* Kích thước / Ni */}
                              <td className="py-2.5 px-3 text-xs font-bold text-[#00594c] font-mono">
                                {comp.selectedOption || "—"}
                              </td>
                              {/* YCKH */}
                              <td className="py-2.5 px-3 text-xs text-gray-600 font-medium">
                                {comp.changeRequest && comp.changeRequest !== "Chọn loại thay đổi" && comp.changeRequest !== "—" ? (
                                  <span className="text-[#00594c] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {comp.changeRequest}
                                  </span>
                                ) : "—"}
                              </td>
                              {/* Tiền công */}
                              <td className="py-2.5 px-3 font-mono text-xs text-emerald-700 font-medium">
                                {comp.wagePrice ? `${Number(comp.wagePrice).toLocaleString()}đ` : "—"}
                              </td>
                              {/* Số lượng */}
                              <td className="py-2.5 px-3 text-center text-xs font-mono text-gray-700 font-bold">
                                {setQty}
                              </td>
                              {/* TL vàng (quy đổi) */}
                              <td className="py-2.5 px-3 text-right font-mono text-xs text-amber-900 font-medium">
                                {comp.goldWeight ? `${((comp.goldWeight || 0) * setQty).toFixed(4)}g` : (comp.weight ? `${((comp.weight * 0.85) * setQty).toFixed(4)}g` : "—")}
                              </td>
                              {/* TL đá */}
                              <td className="py-2.5 px-3 text-right font-mono text-xs text-gray-700">
                                {comp.stoneWeight ? `${((comp.stoneWeight || 0) * setQty).toFixed(4)}g` : "—"}
                              </td>
                              {/* Tổng TL */}
                              <td className="py-2.5 px-3 text-right font-mono text-xs text-gray-800 font-bold">
                                {comp.weight ? `${((comp.weight || 0) * setQty).toFixed(4)}g` : "—"}
                              </td>
                              {/* Ghi chú */}
                              <td className="py-2.5 px-3 text-xs text-gray-400">—</td>
                              {/* Thao tác */}
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  onClick={() => removeSetComponent(item.id, comp.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors text-[11px] cursor-pointer"
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

                    // RENDER CASE 2: SẢN PHẨM ĐƠN LẺ & BIẾN THỂ (12 CỘT CHUẨN HÓA)
                    const itemQty = Number(item.quantity) || 1;
                    const itemGoldW = typeof item.goldWeight === "number" ? item.goldWeight : Math.max(0, (Number(item.weight) || 0) - (Number(item.stoneWeight) || 0));
                    const itemStoneW = typeof item.stoneWeight === "number" ? item.stoneWeight : 0;
                    const itemTotalW = typeof item.weight === "number" ? item.weight : (itemGoldW + itemStoneW);

                    const lineGoldWeight = itemGoldW * itemQty;
                    const lineStoneWeight = itemStoneW * itemQty;
                    const lineTotalWeight = itemTotalW * itemQty;
                    const itemWage = Number(item.wagePrice) || 0;

                    return (
                      <tr key={item.id} className="hover:bg-[#f9fcfb] transition-colors border-t border-gray-100">
                        {/* 1. Mã sản phẩm / Tên món */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2.5">
                            <span className="bg-emerald-100 text-[#00594c] border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-2xs flex items-center space-x-1 shrink-0">
                              <span>💎 LẺ</span>
                            </span>
                            <div>
                              <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm font-bold text-gray-900">
                                <span className="text-gray-900 font-black">{item.productCode}</span>
                                <button
                                  onClick={() => handleCopy(item.id, item.productCode)}
                                  className="text-gray-400 hover:text-[#00594c] transition-colors p-0.5 cursor-pointer"
                                  title="Sao chép mã sản phẩm"
                                >
                                  {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                              <div className="text-[11px] text-gray-500 font-sans font-normal mt-0.5 flex flex-wrap items-center gap-1.5">
                                <span>{item.productName}</span>
                                {item.itemDelta > 0 && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                                    +{(item.itemDelta / 1000).toLocaleString()}k tùy biến
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Màu xi */}
                        <td className="py-3.5 px-3 text-xs font-semibold text-gray-800">
                          {item.goldColor || "Vàng"}
                        </td>

                        {/* 3. Màu đá */}
                        <td className="py-3.5 px-3 text-xs font-medium text-gray-800">
                          {item.mainStoneColor || item.stoneColor || "—"}
                        </td>

                        {/* 4. Kích thước / Ni */}
                        <td className="py-3.5 px-3 text-xs font-bold text-[#00594c] font-mono">
                          {item.size || item.niSize || "—"}
                        </td>

                        {/* 5. Yêu cầu khách hàng */}
                        <td className="py-3.5 px-3 text-xs font-medium">
                          {(item.changeRequest && item.changeRequest !== "—" && item.changeRequest !== "Chọn loại thay đổi" && item.changeRequest !== "Không thay đổi") ? (
                            <span className="text-[#00594c] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {item.changeRequest}
                            </span>
                          ) : (item.yckh && item.yckh !== "—" && item.yckh !== "Không thay đổi") ? (
                            <span className="text-[#00594c] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {item.yckh}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-mono">—</span>
                          )}
                        </td>

                        {/* 6. Tiền công */}
                        <td className="py-3.5 px-3 text-xs">
                          {item.isPricePending || item.isCustomOrOther || item.priceDisplay === "Tính giá sau" || itemWage === 0 ? (
                            <span className="inline-flex items-center text-[10px] text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-bold shadow-2xs whitespace-nowrap">
                              <Clock className="w-2.5 h-2.5 mr-1 text-amber-600 animate-pulse" />
                              Tính giá sau
                            </span>
                          ) : (
                            <span className="font-mono font-bold text-emerald-700 text-xs">
                              {itemWage.toLocaleString()}đ
                            </span>
                          )}
                        </td>

                        {/* 7. Số lượng (Input chỉnh trực tiếp) */}
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={itemQty}
                            onChange={(e) => updateCartItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                            className="w-16 px-2 py-1 text-center font-bold text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#00594c] outline-none shadow-2xs mx-auto text-xs font-mono"
                          />
                        </td>

                        {/* 8. Trọng lượng vàng (quy đổi theo tuổi vàng) */}
                        <td className="py-3.5 px-3 text-right font-mono text-xs font-bold text-amber-900">
                          {lineGoldWeight > 0 ? `${lineGoldWeight.toFixed(4)}g` : "—"}
                        </td>

                        {/* 9. Trọng lượng đá */}
                        <td className="py-3.5 px-3 text-right font-mono text-xs text-gray-700">
                          {lineStoneWeight > 0 ? `${lineStoneWeight.toFixed(4)}g` : "—"}
                        </td>

                        {/* 10. Tổng trọng lượng */}
                        <td className="py-3.5 px-3 text-right font-mono text-xs font-black text-gray-950">
                          {lineTotalWeight > 0 ? `${lineTotalWeight.toFixed(4)}g` : "—"}
                        </td>

                        {/* 9. Ghi chú */}
                        <td className="py-3.5 px-3 text-xs text-gray-500 max-w-[140px] truncate" title={item.note}>
                          {item.note && item.note !== "—" ? item.note : <span className="text-gray-300">—</span>}
                        </td>

                        {/* 10. Thao tác */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa món lẻ"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 text-gray-500 hover:text-[#00594c] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
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
                <tfoot className="bg-[#f0f7f4] font-bold text-gray-900 border-t-2 border-emerald-300">
                  <tr>
                    <td colSpan={6} className="py-3 px-4 text-xs font-black uppercase text-[#00594c]">
                      TỔNG CỘNG ({cartItems.length} DÒNG SẢN PHẨM &bull; {totalQuantity} MÓN)
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-xs font-black text-[#00594c]">
                      {totalQuantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs font-bold text-amber-900">
                      {totalGoldWeight > 0 ? `${totalGoldWeight.toFixed(4)}g` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs font-bold text-gray-800">
                      {totalStoneWeight > 0 ? `${totalStoneWeight.toFixed(4)}g` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs font-black text-gray-950">
                      {totalWeight > 0 ? `${totalWeight.toFixed(4)}g` : "—"}
                    </td>
                    <td colSpan={2} className="py-3 px-4 text-center text-xs text-gray-400">
                      —
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Edit Item Modal (Hỗ trợ chỉnh sửa toàn diện Màu xi, Màu đá, Size Ni, YCKH, Số lượng, Ghi chú) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Chỉnh sửa quy cách sản phẩm</h3>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mã sản phẩm / Tên món</label>
                <div className="font-mono text-xs font-bold text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-200 truncate">
                  {editingItem.productCode} &bull; <span className="font-sans font-normal text-gray-600">{editingItem.productName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Màu xi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Màu xi</label>
                  <select
                    value={editingItem.goldColor || "Vàng"}
                    onChange={(e) => setEditingItem({ ...editingItem, goldColor: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 outline-none focus:border-[#00594c]"
                  >
                    {["Vàng", "Trắng", "Hồng", "Hai màu"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Màu đá */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Màu đá chính</label>
                  <select
                    value={editingItem.mainStoneColor || editingItem.stoneColor || "Trắng"}
                    onChange={(e) => setEditingItem({ ...editingItem, mainStoneColor: e.target.value, stoneColor: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 outline-none focus:border-[#00594c]"
                  >
                    {["Trắng", "Xanh dương", "Đen", "Xanh lá", "Đỏ", "Vàng", "Hồng", "Tím", "000"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Size Ni */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kích thước / Size Ni</label>
                  <input
                    type="text"
                    value={editingItem.size || editingItem.niSize || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value, niSize: e.target.value })}
                    placeholder="VD: 18, 20, 54, 42cm..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-bold text-[#00594c] outline-none focus:border-[#00594c]"
                  />
                </div>

                {/* Số lượng */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.quantity || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-bold text-center outline-none focus:border-[#00594c]"
                  />
                </div>
              </div>

              {/* Trọng lượng vàng & Trọng lượng đá */}
              <div className="grid grid-cols-3 gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">TL vàng quy đổi (g)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={typeof editingItem.goldWeight === "number" ? editingItem.goldWeight : 0.0085}
                    onChange={(e) => {
                      const gw = parseFloat(e.target.value) || 0;
                      const sw = typeof editingItem.stoneWeight === "number" ? editingItem.stoneWeight : 0;
                      setEditingItem({ ...editingItem, goldWeight: gw, weight: Number((gw + sw).toFixed(4)) });
                    }}
                    className="w-full p-2 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-950 bg-white outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">TL đá (g)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={typeof editingItem.stoneWeight === "number" ? editingItem.stoneWeight : 0}
                    onChange={(e) => {
                      const sw = parseFloat(e.target.value) || 0;
                      const gw = typeof editingItem.goldWeight === "number" ? editingItem.goldWeight : (editingItem.weight || 0);
                      setEditingItem({ ...editingItem, stoneWeight: sw, weight: Number((gw + sw).toFixed(4)) });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800 bg-white outline-none focus:border-[#00594c]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Tổng TL (g)</label>
                  <input
                    type="text"
                    readOnly
                    value={`${((typeof editingItem.goldWeight === "number" ? editingItem.goldWeight : 0.0085) + (typeof editingItem.stoneWeight === "number" ? editingItem.stoneWeight : 0)).toFixed(4)}g`}
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs font-mono font-black text-gray-900 bg-gray-100 outline-none"
                  />
                </div>
              </div>

              {/* Yêu cầu khách hàng */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Yêu cầu khách hàng (YCKH)</label>
                <input
                  type="text"
                  value={editingItem.changeRequest || editingItem.yckh || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, changeRequest: e.target.value, yckh: e.target.value })}
                  placeholder="VD: A00, Cast, Đắp lacquer, Khắc laser..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs text-gray-800 outline-none focus:border-[#00594c]"
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  rows={2}
                  value={editingItem.note || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                  placeholder="Ghi chú chi tiết thêm..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#00594c]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  updateCartItem(editingItem.id, editingItem);
                  setEditingItem(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-[#00594c] hover:bg-[#004737] text-white rounded-xl shadow-xs cursor-pointer"
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

      {/* Confirm Order Success Modal (Hỗ trợ Tự Động Tách 2 Đơn Hàng) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-xl shadow-2xl space-y-4 border border-emerald-200">
            
            {hasAutoSplit ? (
              <>
                {/* Header Tự động tách đơn */}
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-300">
                    <Split className="h-7 w-7 text-amber-700" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wide">
                      Quy tắc nghiệp vụ: Tự động tách làm 2 đơn
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1">
                      Đã tự động tách thành 2 mã đơn SO!
                    </h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto mt-0.5">
                      Đơn hàng chứa sản phẩm có <b>Yêu cầu thay đổi khác (hoặc chọn 'Khác')</b> nên hệ thống tự động tách làm 2 đơn theo quy chuẩn kỹ thuật.
                    </p>
                  </div>
                </div>

                {/* 2 Card đơn hàng sau khi tách */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Card Đơn 1: Tiêu chuẩn */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Đơn 1: Tiêu chuẩn
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                        Chờ xác nhận
                      </span>
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-[#00594c]">
                        {orderInfo.orderCode || "SO2608011"}-STD
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Số lượng: <b>{standardItems.length} món</b>
                      </div>
                      <div className="text-xs text-gray-600">
                        Giá công: <b>Đã tính theo chuẩn</b>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500 pt-1 border-t border-emerald-100">
                      Sản phẩm tiêu chuẩn sẵn sàng sản xuất.
                    </div>
                  </div>

                  {/* Card Đơn 2: Gia công đặc biệt (Chờ xử lý) */}
                  <div className="p-3.5 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                        Đơn 2: Thay đổi khác
                      </span>
                      <span className="text-[11px] font-black text-amber-950 bg-amber-300 px-2 py-0.5 rounded-md border border-amber-400 animate-pulse">
                        Chờ xử lý
                      </span>
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-amber-950">
                        {orderInfo.orderCode || "SO2608011"}-CUSTOM
                      </div>
                      <div className="text-xs text-gray-700 mt-0.5">
                        Số lượng: <b>{customItems.length} món</b>
                      </div>
                      <div className="text-xs font-bold text-amber-900 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-amber-700" />
                        Giá công: Tính giá sau
                      </div>
                    </div>
                    <div className="text-[11px] text-amber-900 font-medium pt-1 border-t border-amber-200">
                      Admin sẽ tùy chọn lại các thuộc tính cấu hình nội bộ (chưa có trên E-C).
                    </div>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <Link
                    href="/orders/13"
                    className="w-full py-2.5 px-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors text-center flex items-center justify-center space-x-1"
                  >
                    <span>Mở đơn Chờ xử lý (Admin tùy chọn KT)</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                  <Link
                    href="/"
                    className="w-full py-2.5 px-3 text-xs font-bold text-[#00594c] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors text-center"
                  >
                    Về Quản lý Đơn hàng (ERP)
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-[#00594c] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center">Xác nhận giỏ hàng thành công!</h3>
                <p className="text-xs text-gray-600 text-center">
                  Đơn chào hàng <span className="font-mono font-bold text-[#00594c]">{orderInfo.orderCode}</span> ({totalQuantity} món thành phẩm) đã được chuyển tiếp vào hệ thống quản lý SO.
                </p>

                <div className="p-4 bg-emerald-50 rounded-2xl text-left text-xs space-y-1.5 border border-emerald-100 text-emerald-900 font-medium">
                  <div>&bull; <strong>Mã đơn SO:</strong> {orderInfo.orderCode}</div>
                  <div>&bull; <strong>Khách hàng:</strong> {orderInfo.customerName} ({orderInfo.customerCode})</div>
                  <div>&bull; <strong>Tổng số lượng món:</strong> {totalQuantity} món</div>
                  <div>&bull; <strong>Trọng lượng dự kiến:</strong> {totalWeight.toFixed(4)}g (TL vàng quy đổi: {totalGoldWeight.toFixed(4)}g &bull; TL đá: {totalStoneWeight.toFixed(4)}g)</div>
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
              </>
            )}

          </div>
        </div>
      )}

      {/* Quotation Export Modal (Báo Giá E-Catalogue) */}
      <QuotationExportModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        cartItems={cartItems}
        orderInfo={orderInfo}
        totalQuantity={totalQuantity}
        totalWeight={totalWeight}
        onConvertToOrder={() => handleConfirmOrder()}
      />

    </div>
  );
}
