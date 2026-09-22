"use client";

import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  X,
  Download,
  CheckCircle2
} from "lucide-react";

export default function QuotationExportModal({
  isOpen,
  onClose,
  cartItems = [],
  orderInfo = {},
  totalQuantity = 0,
  totalWeight = 0,
  onConvertToOrder
}) {
  const printRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Form parameters that the user/sales rep can adjust before exporting
  const [customerName, setCustomerName] = useState(
    orderInfo.customerName || "Khách hàng Doanh nghiệp Sen Vàng"
  );
  const [contractType, setContractType] = useState(
    orderInfo.orderType || "Bán hàng"
  );
  const [customerStatus, setCustomerStatus] = useState("Khách Cũ");
  const [stampMark, setStampMark] = useState("K.P.T 610");
  const [goldAge, setGoldAge] = useState(orderInfo.goldAge || "18K (75Y)");
  const [haoLai, setHaoLai] = useState("Lai trong");
  const [discountPercent, setDiscountPercent] = useState(5); // Default 5%, can set to 0 to hide discount rows

  if (!isOpen) return null;

  const quoteCode = `BG-ECAT-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;
  const createdDate = new Date().toLocaleDateString("vi-VN");

  // Resolve accurate Category Name (Chủng loại)
  const getItemCategory = (item) => {
    if (item.category && item.category !== "Trang sức") return item.category;
    if (item.categoryName && item.categoryName !== "Trang sức") return item.categoryName;
    if (item.type && item.type !== "Trang sức") return item.type;

    const name = (item.productName || item.name || "").toLowerCase();
    const code = (item.productCode || item.itemCode || item.code || item.sku || "").toUpperCase();

    // Set / Bộ
    if (item.isSet || name.includes("bộ trang sức") || name.startsWith("bộ ")) {
      return "Bộ trang sức";
    }

    // Keyword detection
    if (name.includes("nhẫn nam") || (code.includes("RG") && name.includes("nam"))) return "Nhẫn nam";
    if (name.includes("nhẫn cưới")) return "Nhẫn cưới";
    if (name.includes("nhẫn") || code.includes("RG")) return "Nhẫn nữ";

    if (name.includes("bông tai") || name.includes("hoa tai") || code.includes("EG")) return "Bông tai";

    if (name.includes("dây chuyền nam") || (code.includes("NE") && name.includes("nam"))) return "Dây chuyền nam";
    if (name.includes("dây chuyền") || code.includes("NE")) return "Dây chuyền nữ";

    if (name.includes("mặt dây nam") || (code.includes("PD") && name.includes("nam"))) return "Mặt dây nam";
    if (name.includes("mặt dây") || code.includes("PD")) return "Mặt dây nữ";

    if (name.includes("lắc tay nam") || (code.includes("BE") && name.includes("nam"))) return "Lắc tay nam";
    if (name.includes("lắc tay") || code.includes("BE")) return "Lắc tay nữ";
    if (name.includes("vòng tay")) return "Vòng tay";
    if (name.includes("kiềng")) return "Kiềng cổ";
    if (name.includes("kim cương")) return "Kim cương rời";

    return item.productName || "Nhẫn nữ";
  };

  // Resolve accurate Item Code (Mã Item)
  const getItemCode = (item) => {
    return item.productCode || item.itemCode || item.code || item.sku || "—";
  };

  // Calculate item wage
  const calculateItemWage = (item) => {
    if (item.laborPrice && typeof item.laborPrice === "number") return item.laborPrice;
    if (item.wagePrice && typeof item.wagePrice === "number") return item.wagePrice;
    if (item.isSet && item.setComponents) {
      return item.setComponents.reduce((acc, c) => acc + (c.laborPrice || c.wagePrice || 350000), 0);
    }
    return 450000;
  };

  // Weight per item in Luong (1 Luong = 10 Chi = 37.5g)
  const getItemWeightInLuong = (item) => {
    if (typeof item.weight === "number") {
      return item.weight;
    }
    return 0.0100;
  };

  const totalLaborCost = cartItems.reduce(
    (sum, item) => sum + calculateItemWage(item) * (item.quantity || 1),
    0
  );

  const hasDiscount = Number(discountPercent) > 0;
  const discountAmount = hasDiscount ? Math.round((totalLaborCost * Number(discountPercent)) / 100) : 0;
  const laborAfterDiscount = totalLaborCost - discountAmount;

  // Ensure table has at least 8 rows for traditional invoice paper aesthetic
  const minRows = Math.max(8, cartItems.length);
  const emptyRowCount = Math.max(0, minRows - cartItems.length);

  // Handle Copy to Clipboard for Zalo/Viber
  const handleCopySummary = () => {
    const textLines = [
      `🌟 BẢNG BÁO GIÁ TRANG SỨC SEVAGO JEWELRY 🌟`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏢 CÔNG TY TNHH MTV SEN VÀNG VIỆT NAM`,
      `📄 Mã Báo Giá: ${quoteCode}`,
      `📅 Ngày Lập: ${createdDate}`,
      `👤 Đơn vị nhận báo giá: ${customerName}`,
      `📋 Hợp đồng: ${contractType}`,
      `🏷️ Tình trạng: ${customerStatus}`,
      `🔏 Dấu đóng: ${stampMark || "..."}`,
      `✨ Tuổi vàng: ${goldAge}`,
      `⚖️ Hao lai: ${haoLai}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 DANH SÁCH SẢN PHẨM (${totalQuantity} món):`,
      ...cartItems.map((item, idx) => {
        const itemWage = calculateItemWage(item);
        const itemWeight = getItemWeightInLuong(item);
        const itemQty = item.quantity || 1;
        const lineTotalWage = itemWage * itemQty;
        const categoryTitle = getItemCategory(item);
        const itemCodeStr = getItemCode(item);
        return `${idx + 1}. [${categoryTitle}] ${itemCodeStr} - ${item.productName || item.name} | SL: ${itemQty} | TL: ${itemWeight.toFixed(4)} Lượng | Đơn giá công: ${itemWage.toLocaleString("vi-VN")} đ | Thành tiền: ${lineTotalWage.toLocaleString("vi-VN")} đ`;
      }),
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💰 Tổng tiền công: ${totalLaborCost.toLocaleString("vi-VN")} VNĐ`,
      ...(hasDiscount
        ? [
            `🎁 Chiết khấu tạm tính ${discountPercent}%: -${discountAmount.toLocaleString("vi-VN")} VNĐ`,
            `💵 Tổng tiền công sau chiết khấu: ${laborAfterDiscount.toLocaleString("vi-VN")} VNĐ`
          ]
        : []),
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📞 Tổng đài: 0996 618 618 | Email: sale@sevago.com.vn`
    ];

    navigator.clipboard.writeText(textLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Print PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle Export CSV/Excel
  const handleExportCSV = () => {
    setIsExportingExcel(true);
    try {
      const headers = [
        "STT",
        "Chủng loại",
        "Mã Item",
        "Số lượng",
        "Trọng lượng vàng / SP (Lượng)",
        "Đơn giá công/ SP",
        "Tổng Trọng lượng (Lượng)",
        "Tổng tiền công"
      ];

      const rows = cartItems.map((item, idx) => {
        const itemWage = calculateItemWage(item);
        const itemWeight = getItemWeightInLuong(item);
        const itemQty = item.quantity || 1;
        const lineTotalWeight = itemWeight * itemQty;
        const lineTotalWage = itemWage * itemQty;
        const categoryTitle = getItemCategory(item);
        const itemCodeStr = getItemCode(item);

        return [
          idx + 1,
          `"${categoryTitle}"`,
          `"${itemCodeStr}"`,
          itemQty,
          itemWeight.toFixed(4),
          itemWage,
          lineTotalWeight.toFixed(4),
          lineTotalWage
        ];
      });

      const footerRows = [
        ["", "Tổng tiền công", "", totalQuantity, "", "", totalWeight.toFixed(4), totalLaborCost]
      ];

      if (hasDiscount) {
        footerRows.push([
          "",
          `Chiết khấu tạm tính ${discountPercent}%`,
          "",
          "",
          "",
          "",
          "",
          `-${discountAmount}`
        ]);
        footerRows.push([
          "",
          "Tổng tiền công sau chiết khấu",
          "",
          "",
          "",
          "",
          "",
          laborAfterDiscount
        ]);
      }

      const csvContent =
        "\uFEFF" +
        [
          `CÔNG TY TNHH MTV SEN VÀNG VIỆT NAM`,
          `MST: 309589077, Hotline: 0996 618 618, Email: sale@sevago.com.vn`,
          ``,
          `BẢNG BÁO GIÁ`,
          `Đơn vị nhận báo giá: ${customerName}`,
          `Hợp đồng: ${contractType}`,
          `Tình trạng: ${customerStatus}`,
          `Dấu đóng: ${stampMark || ""}`,
          `Tuổi vàng: ${goldAge}`,
          `Hao lai: ${haoLai}`,
          ``,
          headers.join(","),
          ...rows.map((r) => r.join(",")),
          ...footerRows.map((r) => r.join(","))
        ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Bao_Gia_${customerName.replace(/\s+/g, "_")}_${quoteCode}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden text-gray-900">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER & ACTION BUTTONS                                             */}
        {/* ========================================================================= */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#00382b] to-[#00594c] text-white flex items-center justify-between shadow-md shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                Xuất Báo Giá Chào Hàng E-Catalogue
              </h2>
              <p className="text-[11px] text-emerald-200">
                Mẫu chuẩn biểu mẫu BẢNG BÁO GIÁ • SEVAGO JEWELRY
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={isExportingExcel}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs"
              title="Tải file Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Excel</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shadow-xs"
              title="In / Xuất PDF (A4 Chuẩn)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer ml-2"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY                                                                */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f4f7f5]" id="quotation-print-area">
          
          {/* 1. CONFIGURATION CONTROLS (TÙY CHỈNH THÔNG SỐ TÁC NGHIỆP TRƯỚC KHI IN) */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs print:hidden">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Tên Khách Hàng:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#00594c] focus:bg-white"
                placeholder="Nhập tên khách hàng"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Hợp đồng:
              </label>
              <div className="w-full px-2.5 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 select-none">
                {contractType}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Tình trạng:
              </label>
              <div className="w-full px-2.5 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 select-none">
                {customerStatus}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Dấu đóng:
              </label>
              <input
                type="text"
                value={stampMark}
                onChange={(e) => setStampMark(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#00594c]"
                placeholder="Ví dụ: K.P.T 610"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Tuổi vàng:
              </label>
              <div className="w-full px-2.5 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 select-none">
                {goldAge}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Chiết khấu (%):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-emerald-800 text-center focus:ring-1 focus:ring-[#00594c] focus:bg-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* 2. FORMAL QUOTATION PAPER CONTAINER (KHỚP 100% ẢNH MẪU ĐÍNH KÈM) */}
          <div 
            ref={printRef}
            className="bg-white p-6 sm:p-10 rounded-xl border border-gray-300 shadow-md text-black font-sans space-y-6 max-w-4xl mx-auto print:p-0 print:border-0 print:shadow-none"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {/* ========================================================================= */}
            {/* 1. HEADER SECTION (LOGO SEVAGO & THÔNG TIN DOANH NGHIỆP)                  */}
            {/* ========================================================================= */}
            <div className="flex items-start justify-between gap-6 pb-2">
              {/* Logo SEVAGO JEWELRY */}
              <div className="flex flex-col items-center justify-center shrink-0 w-44">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#004737]" fill="currentColor">
                    <circle cx="50" cy="50" r="45" stroke="#004737" strokeWidth="4" fill="none" />
                    <path d="M50 18 L72 38 L50 82 L28 38 Z" stroke="#004737" strokeWidth="3" fill="none" />
                    <path d="M50 28 L64 42 L50 72 L36 42 Z" fill="#004737" opacity="0.15" />
                    <circle cx="50" cy="38" r="8" fill="#004737" />
                  </svg>
                </div>
                <div className="text-center mt-1">
                  <div className="text-sm font-black tracking-[0.25em] text-[#004737]">SEVAGO</div>
                  <div className="text-[9px] font-bold tracking-[0.3em] text-[#004737]">JEWELRY</div>
                </div>
              </div>

              {/* Thông tin pháp nhân Công ty */}
              <div className="flex-1 text-xs space-y-1 text-gray-900 leading-relaxed pl-4">
                <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide text-black">
                  CÔNG TY TNHH MTV SEN VÀNG VIỆT NAM
                </h1>
                <div className="grid grid-cols-[100px_1fr] text-xs">
                  <span className="font-semibold">Mã số thuế:</span>
                  <span>309589077</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] text-xs">
                  <span className="font-semibold">Trụ sở chính:</span>
                  <span>76 Tăng Nhơn Phú, Phường Tăng Nhơn Phú, Thành phố Hồ Chí Minh,</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] text-xs">
                  <span className="font-semibold">Chi nhánh 1:</span>
                  <span>200 Nguyễn Văn Bá, Phường Thủ Đức, Thành phố Hồ Chí Minh, Việt</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] text-xs">
                  <span className="font-semibold">Tổng đài:</span>
                  <span>0996 618 618</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] text-xs">
                  <span className="font-semibold">Email:</span>
                  <span className="text-blue-600 underline">sale@sevago.com.vn</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. TITLE: BẢNG BÁO GIÁ                                                    */}
            {/* ========================================================================= */}
            <div className="text-center py-2">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-black">
                BẢNG BÁO GIÁ
              </h2>
            </div>

            {/* ========================================================================= */}
            {/* 3. METADATA SECTION (THÔNG TIN ĐƠN VỊ & QUY CHUẨN ĐẶT HÀNG)              */}
            {/* ========================================================================= */}
            <div className="text-xs space-y-1.5 leading-relaxed">
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold underline italic">Đơn vị nhận báo giá</span>
                <span className="font-medium text-black">{customerName || "Tên khách hàng"}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold underline italic">Hợp đồng</span>
                <span className="font-medium text-black">{contractType || "Gia công/ Mua bán"}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold underline italic">Tình trạng</span>
                <span className="font-medium text-black">{customerStatus || "Khách Cũ/Khách Mới"}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold underline italic">Dấu đóng</span>
                <span className="font-medium text-black">{stampMark || "...................................................................."}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold underline italic">Tuổi vàng</span>
                <span className="font-medium text-black">{goldAge || "...................................................................."}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline">
                <span className="font-bold underline italic">Hao lai</span>
                <span className="font-medium text-black">{haoLai || "Lai trong / Lai ngoài"}</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 4. MAIN QUOTATION TABLE (BORDER CHUẨN FORM GIẤY)                          */}
            {/* ========================================================================= */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-xs text-black">
                <thead>
                  <tr className="border-b border-black text-center font-bold">
                    <th className="border border-black p-1.5 w-10">STT</th>
                    <th className="border border-black p-1.5 w-32">Chủng loại</th>
                    <th className="border border-black p-1.5 w-44">Mã Item</th>
                    <th className="border border-black p-1.5 w-16">Số lượng</th>
                    <th className="border border-black p-1.5 w-32">
                      Trọng lượng vàng / SP<br />(Lượng)
                    </th>
                    <th className="border border-black p-1.5 w-28">Đơn giá công/ SP</th>
                    <th className="border border-black p-1.5 w-32">
                      Tổng Trọng lượng<br />(Lượng)
                    </th>
                    <th className="border border-black p-1.5 w-28">Tổng tiền công</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Danh sách các sản phẩm thực tế */}
                  {cartItems.map((item, idx) => {
                    const itemWage = calculateItemWage(item);
                    const itemWeight = getItemWeightInLuong(item);
                    const itemQty = item.quantity || 1;
                    const lineTotalWeight = itemWeight * itemQty;
                    const lineTotalWage = itemWage * itemQty;
                    const categoryTitle = getItemCategory(item);
                    const itemCodeStr = getItemCode(item);

                    return (
                      <tr key={item.id || idx} className="border-b border-black">
                        <td className="border border-black p-1.5 text-center font-medium">
                          {idx + 1}
                        </td>
                        <td className="border border-black p-1.5 font-medium">
                          {categoryTitle}
                        </td>
                        <td className="border border-black p-1.5 font-mono text-[11px]">
                          {itemCodeStr}
                        </td>
                        <td className="border border-black p-1.5 text-center">
                          {itemQty}
                        </td>
                        <td className="border border-black p-1.5 text-right font-mono">
                          {itemWeight.toFixed(4)}
                        </td>
                        <td className="border border-black p-1.5 text-right font-mono">
                          {itemWage.toLocaleString("vi-VN")}
                        </td>
                        <td className="border border-black p-1.5 text-right font-mono">
                          {lineTotalWeight.toFixed(4)}
                        </td>
                        <td className="border border-black p-1.5 text-right font-mono">
                          {lineTotalWage.toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Các dòng trống đệm bảng chuẩn form in */}
                  {Array.from({ length: emptyRowCount }).map((_, eIdx) => (
                    <tr key={`empty-${eIdx}`} className="border-b border-black h-7">
                      <td className="border border-black p-1.5 text-center">
                        {cartItems.length + eIdx + 1}
                      </td>
                      <td className="border border-black p-1.5"></td>
                      <td className="border border-black p-1.5"></td>
                      <td className="border border-black p-1.5"></td>
                      <td className="border border-black p-1.5"></td>
                      <td className="border border-black p-1.5"></td>
                      <td className="border border-black p-1.5"></td>
                      <td className="border border-black p-1.5"></td>
                    </tr>
                  ))}

                  {/* ----------------------------------------------------------------- */}
                  {/* HÀNG 1: TỔNG TIỀN CÔNG (LUÔN HIỂN THỊ)                            */}
                  {/* ----------------------------------------------------------------- */}
                  <tr className="border-b border-black font-bold">
                    <td colSpan={3} className="border border-black p-1.5 text-center font-bold">
                      Tổng tiền công
                    </td>
                    <td className="border border-black p-1.5 text-center font-mono">
                      {totalQuantity}
                    </td>
                    <td className="border border-black p-1.5"></td>
                    <td className="border border-black p-1.5"></td>
                    <td className="border border-black p-1.5 text-right font-mono">
                      {totalWeight.toFixed(4)}
                    </td>
                    <td className="border border-black p-1.5 text-right font-mono">
                      {totalLaborCost.toLocaleString("vi-VN")}
                    </td>
                  </tr>

                  {/* ----------------------------------------------------------------- */}
                  {/* HÀNG 2 & 3: CHIẾT KHẤU TẠM TÍNH & TIỀN CÔNG SAU CHIẾT KHẤU       */}
                  {/* QUY TẮC: NẾU ĐƠN HÀNG KHÔNG CÓ CHIẾT KHẤU (0%), ẨN HOÀN TOÀN 2 HÀNG*/}
                  {/* ----------------------------------------------------------------- */}
                  {hasDiscount && (
                    <>
                      <tr className="border-b border-black font-bold">
                        <td colSpan={3} className="border border-black p-1.5 text-center font-bold">
                          Chiết khấu tạm tính {discountPercent}%
                        </td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5 text-right font-mono text-emerald-900">
                          -{discountAmount.toLocaleString("vi-VN")}
                        </td>
                      </tr>

                      <tr className="border-b border-black font-bold">
                        <td colSpan={3} className="border border-black p-1.5 text-center font-bold">
                          Tổng tiền công sau chiết khấu
                        </td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5"></td>
                        <td className="border border-black p-1.5 text-right font-mono">
                          {laborAfterDiscount.toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* ========================================================================= */}
            {/* 5. SIGNATURE SECTION (KHÁCH HÀNG KÝ TÊN CĂN PHẢI)                         */}
            {/* ========================================================================= */}
            <div className="pt-6 flex justify-end text-xs">
              <div className="text-center w-64 space-y-16">
                <div className="font-bold uppercase tracking-wider text-black">
                  KHÁCH HÀNG (KÝ TÊN)
                </div>
                <div className="border-b border-dashed border-gray-400 w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER                                                              */}
        {/* ========================================================================= */}
        <div className="px-5 py-3 bg-gray-100 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {hasDiscount 
                ? `Đang áp dụng chiết khấu ${discountPercent}% (Hiển thị đầy đủ 3 dòng tổng kết)`
                : "Không có chiết khấu (Đã tự động ẩn 2 dòng Chiết khấu & Sau chiết khấu)"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors cursor-pointer"
            >
              Đóng
            </button>

            {onConvertToOrder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConvertToOrder();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5"
              >
                <span>Chuyển Thành Đơn Hàng SO</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
