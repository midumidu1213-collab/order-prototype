"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  Tag,
  Boxes,
  Info
} from "lucide-react";

export default function ProductionBagPrintModal({
  isOpen,
  onClose,
  bagData = null,
  initialPcs = 4
}) {
  // Số lượng pcs trong lô (cho phép điều chỉnh để cân lại trọng lượng và nhân số lượng component)
  const [pcsInLot, setPcsInLot] = useState(initialPcs || 4);

  // Chế độ xem Routing: 'fixed' (Routing fix lấy từ đơn hàng: 3 bước chuẩn) hoặc 'full' (Routing đầy đủ 22 bước KHSX gốc)
  const [routingMode, setRoutingMode] = useState("fixed");

  const [copiedCode, setCopiedCode] = useState(null);

  // Dữ liệu fallback nếu không truyền bagData
  const bag = useMemo(() => {
    return {
      bagCode: bagData?.newBagCode || bagData?.bagCode || "TR-261000144",
      itemCode: bagData?.itemCode || "GY11BH000133A00A00CZMM1CZWW1000",
      drawingCode: bagData?.drawingCode || "BH000133A00",
      size: bagData?.sizeNi || bagData?.size || "18",
      orderType: "TRAINNING_ORDER",
      syncCode: "DB-2610067",
      customerCode: bagData?.customerCode || "2037105",
      customerName: bagData?.customerName || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
      goldKarat: bagData?.goldKarat || (bagData?.lop?.includes("75") ? "18" : "18"),
      soCode: bagData?.soCode || "TR2610067",
      note: bagData?.note || "Gán phôi kho CXLL - Routing fix làm mới",
      lineWax: "Sáp 1",
      lineSx: "Line 1",
      // Trọng lượng đơn vị 1 pc (lượng hoặc gram)
      unitMetalWeight: bagData?.metalWeight ? Number((bagData.metalWeight / (bagData.demandQty || 1)).toFixed(4)) : 0.4500,
      unitStoneWeight: bagData?.stoneWeight ? Number((bagData.stoneWeight / (bagData.demandQty || 1)).toFixed(4)) : 0.1500,
      startDate: "SD 30/10/2026",
      castDate: "CD 04/11/2026",
      syncDate: "SD 05/11/2026",
      endDate: "FD 09/11/2026",
      printDate: "31/10/2026 14:35"
    };
  }, [bagData]);

  // Cân lại theo số lượng pcs trong lô
  const calculatedWeights = useMemo(() => {
    const pcs = Math.max(1, Number(pcsInLot) || 1);
    // Trọng lượng đá theo lô
    const stoneWeight = Number((bag.unitStoneWeight * pcs).toFixed(4));
    // Trọng lượng kim loại / vàng theo lô
    const metalWeight = Number((bag.unitMetalWeight * pcs).toFixed(4));
    // Tổng trọng lượng theo lô
    const totalWeight = Number((metalWeight + stoneWeight).toFixed(4));

    // Mã Stamp tương ứng với TL đá theo yêu cầu
    // Format: STP-[TuổiVàng]-D[TLĐá] (Ví dụ: STP-18K-D0.60)
    let stampCode = "STP-18K-KD";
    if (stoneWeight > 0) {
      const stoneFormatted = stoneWeight.toFixed(2);
      stampCode = `STP-${bag.goldKarat || "18"}K-D${stoneFormatted}`;
    }

    return {
      pcs,
      stoneWeight,
      stoneWeightCt: (stoneWeight * 4).toFixed(4), // Trọng lượng đá (ct quy đổi tham chiếu)
      metalWeight,
      totalWeight,
      stampCode
    };
  }, [bag, pcsInLot]);

  // Danh sách COMPONENT HTJ (tính trên pcs trong lô)
  const htjComponents = useMemo(() => {
    const pcs = calculatedWeights.pcs;
    return [
      {
        compCode1: "CBC040TR BR00240",
        stage1: "Filling",
        qty1: 3 * pcs,
        len1: "0.3",
        weight1: "",
        compCode2: "CBC040TR BR00240",
        stage2: "Filling",
        qty2: 2 * pcs,
        len2: "0.2",
        weight2: ""
      },
      {
        compCode1: "HTJP000003",
        stage1: "Assembling",
        qty1: 12 * pcs,
        len1: "",
        weight1: "",
        compCode2: "",
        stage2: "",
        qty2: "",
        len2: "",
        weight2: ""
      }
    ];
  }, [calculatedWeights.pcs]);

  // Danh sách COMPONENT CAST (tính trên pcs trong lô)
  const castComponents = useMemo(() => {
    const pcs = calculatedWeights.pcs;
    return [
      {
        cast: "BH000133A00-MOLD-1-A",
        qty: 1 * pcs,
        mold: "BH000133A00-MOLD-1-A",
        injectionCount: 1 * pcs
      },
      {
        cast: "BH000134A00-MOLD-1-B",
        qty: 1 * pcs,
        mold: "BH000134A00-MOLD-1-B",
        injectionCount: 1 * pcs
      }
    ];
  }, [calculatedWeights.pcs]);

  // Danh sách COMPONENT PHỤ LIỆU - ĐÁ (tính trên pcs trong lô)
  const stoneComponents = useMemo(() => {
    const pcs = calculatedWeights.pcs;
    const baseStones = [
      { code: "CZ10VRDWW11RD1.1", baseQty: 1, nweight: 0.010000, type: "Gắn thường" },
      { code: "CZ10VRDBB11RD1.25", baseQty: 1, nweight: 0.020000, type: "Gắn thường" },
      { code: "CZ10VRDBB10RD1.1", baseQty: 2, nweight: 0.020000, type: "Gắn tay" },
      { code: "CZ10VRDGG11OV1.1", baseQty: 1, nweight: 0.020000, type: "Gắn tay" },
      { code: "CZ10VRDGG11OV1.5", baseQty: 1, nweight: 0.020000, type: "Gắn tay" },
      { code: "CZ10VRDBB11TD4*3", baseQty: 1, nweight: 0.020000, type: "Gắn tay" },
      { code: "CZ10VRDGG11OV1.25", baseQty: 1, nweight: 0.020000, type: "Gắn tay" }
    ];

    const list = baseStones.map((st) => {
      const qty = st.baseQty * pcs;
      const weight = Number((st.nweight * qty).toFixed(6));
      return {
        ...st,
        qty,
        weight: weight.toFixed(6)
      };
    });

    const totalQty = list.reduce((sum, item) => sum + item.qty, 0);
    const totalWeight = list.reduce((sum, item) => sum + Number(item.weight), 0).toFixed(6);

    return {
      list,
      totalQty,
      totalWeight
    };
  }, [calculatedWeights.pcs]);

  // ROUTING FIX LẤY TỪ ĐƠN HÀNG (3 công đoạn chuẩn cho hàng Cấp Thành Phẩm)
  const routingFixSteps = useMemo(() => {
    return [
      {
        stt: 1,
        wcCode: "WC-0111",
        wcName: "Serve Stones / Phôi Cấp Thành Phẩm (Kho CXLL)",
        grade: "Bậc 0",
        stdtime: "0"
      },
      {
        stt: 2,
        wcCode: "WC-0013",
        wcName: `Stamping (Tẩy dấu cũ, khắc dấu mới & Mã Stamp: ${calculatedWeights.stampCode} theo TL đá ${stoneComponents.totalWeight})`,
        grade: "Bậc 0",
        stdtime: "1"
      },
      {
        stt: 3,
        wcCode: "WC-0020",
        wcName: "Packing Out (Kho TP - Kiểm KCS & Nhập kho Thành Phẩm)",
        grade: "Bậc 1",
        stdtime: "3"
      }
    ];
  }, [calculatedWeights.stampCode, stoneComponents.totalWeight]);

  // ROUTING ĐẦY ĐỦ 22 BƯỚC GỐC KHSX (để đối soát khi cần)
  const fullRoutingSteps = [
    { stt: 1, wcCode: "WC-0111", wcName: "Serve Stones", grade: "Bậc 0", stdtime: "0" },
    { stt: 2, wcCode: "WC-0074", wcName: "Wax injection", grade: "Bậc 0", stdtime: "4" },
    { stt: 3, wcCode: "WC-0006", wcName: "Wax setting", grade: "Bậc 0", stdtime: "2" },
    { stt: 4, wcCode: "WC-0007", wcName: "Wax tree", grade: "Bậc 0", stdtime: "0" },
    { stt: 5, wcCode: "WC-0008", wcName: "Flasking", grade: "Bậc 0", stdtime: "0" },
    { stt: 6, wcCode: "WC-0009", wcName: "Burning", grade: "Bậc 0", stdtime: "0" },
    { stt: 7, wcCode: "WC-0133", wcName: "Serve Metal", grade: "Bậc 0", stdtime: "0" },
    { stt: 8, wcCode: "WC-0010", wcName: "Casting", grade: "Bậc 0", stdtime: "0" },
    { stt: 9, wcCode: "WC-0011", wcName: "Spruing", grade: "Bậc 0", stdtime: "0" },
    { stt: 10, wcCode: "WC-0087", wcName: "Serve Casting", grade: "Bậc 0", stdtime: "0" },
    { stt: 11, wcCode: "WC-0086", wcName: "Serve Findings", grade: "Bậc 0", stdtime: "0" },
    { stt: 12, wcCode: "WC-0012", wcName: "Filling", grade: "Bậc 2", stdtime: "15" },
    { stt: 13, wcCode: "WC-0013", wcName: `Stamping (Mã stamp: ${calculatedWeights.stampCode})`, grade: "Bậc 0", stdtime: "1" },
    { stt: 14, wcCode: "WC-0016", wcName: "CST", grade: "Bậc 0", stdtime: "0" },
    { stt: 15, wcCode: "WC-0137", wcName: "Stone check", grade: "Bậc 0", stdtime: "0" },
    { stt: 16, wcCode: "WC-0140", wcName: "Serve Handset Stone Weight", grade: "Bậc 0", stdtime: "0" },
    { stt: 17, wcCode: "WC-0018", wcName: "Setting", grade: "Bậc 0", stdtime: "0" },
    { stt: 18, wcCode: "WC-0019", wcName: "Barreling", grade: "Bậc 0", stdtime: "0" },
    { stt: 19, wcCode: "WC-0086", wcName: "Serve Findings", grade: "Bậc 0", stdtime: "0" },
    { stt: 20, wcCode: "WC-0023", wcName: "Assembling", grade: "Bậc 0", stdtime: "15" },
    { stt: 21, wcCode: "WC-0020", wcName: "Polishing", grade: "Bậc 1", stdtime: "3" },
    { stt: 22, wcCode: "WC-0153", wcName: "Platting", grade: "Bậc 0", stdtime: "0" }
  ];

  const currentRouting = routingMode === "fixed" ? routingFixSteps : fullRoutingSteps;

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white">
      {/* Container Thẻ In */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-300 flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* THANH ĐIỀU KHIỂN TRÊN ĐẦU (ẨN KHI IN) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Printer className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>In Thẻ Lệnh Sản Xuất (Thẻ Bag KHSX)</span>
                <span className="text-[10px] font-mono bg-teal-800 text-teal-200 px-2 py-0.5 rounded border border-teal-600">
                  {bag.bagCode}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Format chuẩn KHSX chuyền xuống • Cấp thành phẩm Kho CXLL
              </p>
            </div>
          </div>

          {/* Công Cụ Cân Chỉnh Số Pcs Trong Lô & Đổi Routing */}
          <div className="flex items-center gap-3">
            {/* Bộ chọn số lượng pcs trong lô */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
              <span className="text-[11px] text-slate-300 px-2 font-medium">
                Số pcs/lô:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 4, 8].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setPcsInLot(qty)}
                    className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                      pcsInLot === qty
                        ? "bg-teal-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {qty}
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={pcsInLot}
                  onChange={(e) => setPcsInLot(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 px-1.5 py-0.5 text-center bg-slate-900 border border-slate-700 rounded text-amber-300 font-bold focus:outline-hidden"
                  title="Nhập số pcs tùy ý"
                />
              </div>
            </div>

            {/* Toggle Routing Fix vs Full */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setRoutingMode("fixed")}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  routingMode === "fixed"
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Routing fix gán cứng lấy từ đơn hàng (3 bước chuẩn: Serve FG -> Stamping -> Packing Out)"
              >
                Routing Fix (3 bước)
              </button>
              <button
                type="button"
                onClick={() => setRoutingMode("full")}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  routingMode === "full"
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Xem toàn bộ 22 công đoạn KHSX gốc"
              >
                Full KHSX (22 bước)
              </button>
            </div>

            {/* Nút In phiếu */}
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In Phiếu (Print)</span>
            </button>

            {/* Nút Đóng */}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NỘI DUNG THẺ IN BAG (GIỮ 100% LAYOUT & MÀU SẮC NHƯ ẢNH)    */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-6 bg-white text-black font-sans print:overflow-visible print:p-0">
          <div className="max-w-[960px] mx-auto border border-slate-200 p-5 bg-white shadow-2xs print:border-none print:shadow-none print:p-0 space-y-4">
            
            {/* PHẦN ĐẦU TRÊN CÙNG: MÃ BAG + BARCODE (TRÁI) & BẢNG COMPONENT HTJ (PHẢI) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* CỘT TRÁI - PHẦN 1: HEADER MÃ BAG & BARCODE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-bold text-xl sm:text-2xl tracking-tight font-sans text-black">
                    {bag.bagCode}
                  </div>
                  
                  {/* SVG Barcode Vector Sắc Nét Chuẩn Công Nghiệp */}
                  <div className="shrink-0 text-right">
                    <svg className="h-10 w-52 sm:w-64" viewBox="0 0 240 42" preserveAspectRatio="none">
                      {/* Barcode lines simulation */}
                      <rect x="0" y="0" width="3" height="38" fill="#000" />
                      <rect x="5" y="0" width="2" height="38" fill="#000" />
                      <rect x="10" y="0" width="5" height="38" fill="#000" />
                      <rect x="18" y="0" width="2" height="38" fill="#000" />
                      <rect x="23" y="0" width="4" height="38" fill="#000" />
                      <rect x="30" y="0" width="2" height="38" fill="#000" />
                      <rect x="34" y="0" width="6" height="38" fill="#000" />
                      <rect x="43" y="0" width="3" height="38" fill="#000" />
                      <rect x="49" y="0" width="2" height="38" fill="#000" />
                      <rect x="54" y="0" width="5" height="38" fill="#000" />
                      <rect x="62" y="0" width="2" height="38" fill="#000" />
                      <rect x="67" y="0" width="4" height="38" fill="#000" />
                      <rect x="74" y="0" width="3" height="38" fill="#000" />
                      <rect x="80" y="0" width="6" height="38" fill="#000" />
                      <rect x="89" y="0" width="2" height="38" fill="#000" />
                      <rect x="94" y="0" width="4" height="38" fill="#000" />
                      <rect x="101" y="0" width="2" height="38" fill="#000" />
                      <rect x="106" y="0" width="5" height="38" fill="#000" />
                      <rect x="114" y="0" width="3" height="38" fill="#000" />
                      <rect x="120" y="0" width="2" height="38" fill="#000" />
                      <rect x="125" y="0" width="6" height="38" fill="#000" />
                      <rect x="134" y="0" width="2" height="38" fill="#000" />
                      <rect x="139" y="0" width="4" height="38" fill="#000" />
                      <rect x="146" y="0" width="3" height="38" fill="#000" />
                      <rect x="152" y="0" width="5" height="38" fill="#000" />
                      <rect x="160" y="0" width="2" height="38" fill="#000" />
                      <rect x="165" y="0" width="4" height="38" fill="#000" />
                      <rect x="172" y="0" width="2" height="38" fill="#000" />
                      <rect x="177" y="0" width="6" height="38" fill="#000" />
                      <rect x="186" y="0" width="3" height="38" fill="#000" />
                      <rect x="192" y="0" width="2" height="38" fill="#000" />
                      <rect x="197" y="0" width="5" height="38" fill="#000" />
                      <rect x="205" y="0" width="2" height="38" fill="#000" />
                      <rect x="210" y="0" width="4" height="38" fill="#000" />
                      <rect x="217" y="0" width="3" height="38" fill="#000" />
                      <rect x="223" y="0" width="5" height="38" fill="#000" />
                      <rect x="231" y="0" width="2" height="38" fill="#000" />
                      <rect x="236" y="0" width="4" height="38" fill="#000" />
                    </svg>
                  </div>
                </div>

                {/* KHỐI 1: THÔNG TIN SẢN PHẨM & CÂN LẠI THEO PCS TRONG LÔ */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide">
                    THÔNG TIN SẢN PHẨM
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] leading-tight">
                    {/* Cột trái info sản phẩm */}
                    <div className="space-y-1">
                      <div>
                        <span className="text-slate-600 inline-block w-20">Mã item</span>
                        <span className="font-semibold text-black break-all">{bag.itemCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-20">Mã drawing</span>
                        <span className="font-semibold text-black">{bag.drawingCode}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-slate-600 inline-block w-20">Size</span>
                        <span className="font-bold text-base text-black">{bag.size}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-20">Số lượng</span>
                        <span className="font-bold text-black text-sm">{calculatedWeights.pcs}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-20">Loại lệnh</span>
                        <span className="text-[10px] font-semibold text-black">{bag.orderType}</span>
                      </div>
                    </div>

                    {/* Cột phải các mốc thời gian */}
                    <div className="space-y-1">
                      <div className="font-bold text-black text-[11px]">CÁC MỐC THỜI GIAN</div>
                      <div>
                        <span className="text-slate-600 inline-block w-24">Ngày bắt đầu</span>
                        <span className="font-semibold text-black">{bag.startDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-24">Ngày đúc</span>
                        <span className="font-semibold text-black">{bag.castDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-24">Ngày đồng bộ</span>
                        <span className="font-semibold text-black">{bag.syncDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-24">Ngày kết thúc</span>
                        <span className="font-semibold text-black">{bag.endDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-24">Ngày in nhãn</span>
                        <span className="font-semibold text-black">{bag.printDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* KHỐI CÂN LẠI TRỌNG LƯỢNG THEO SỐ PCS TRONG LÔ (YÊU CẦU ĐẶC TẢ) */}
                  <div className="mt-2 pt-1.5 border-t border-slate-300 grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded text-[11px] print:bg-transparent print:border print:border-black">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Trọng lượng đá:</span>
                      <strong className="font-mono text-black text-xs">
                        {calculatedWeights.stoneWeight.toFixed(4)} lượng
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Trọng lượng (vàng):</span>
                      <strong className="font-mono text-black text-xs">
                        {calculatedWeights.metalWeight.toFixed(4)} lượng
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tổng trọng lượng:</span>
                      <strong className="font-mono text-black text-xs">
                        {calculatedWeights.totalWeight.toFixed(4)} lượng
                      </strong>
                    </div>
                  </div>
                </div>

                {/* KHỐI 2: MÃ ĐỒNG BỘ */}
                <div className="pt-1">
                  <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide">
                    MÃ ĐỒNG BỘ
                  </div>
                  <div className="text-[11px] font-semibold text-black mt-0.5">
                    {bag.syncCode}
                  </div>
                </div>

                {/* KHỐI 3: THÔNG TIN ĐƠN HÀNG */}
                <div className="space-y-1 pt-1">
                  <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                    <span>THÔNG TIN ĐƠN HÀNG</span>
                    {/* Badge Stamp theo TL đá */}
                    <span className="text-[10px] font-bold text-black bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded print:border-black">
                      Mã Stamp: {calculatedWeights.stampCode}
                    </span>
                  </div>

                  <div className="text-[11px] space-y-1">
                    <div className="flex">
                      <span className="text-slate-600 inline-block w-28">Mã KH</span>
                      <span className="font-semibold text-black">{bag.customerCode} - {bag.customerName}</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-600 inline-block w-28">Tuổi nguyên liệu</span>
                      <span className="font-semibold text-black">{bag.goldKarat}</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-600 inline-block w-28">Mã đơn hàng</span>
                      <span className="font-semibold text-black">{bag.soCode}</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-600 inline-block w-28">Ghi chú</span>
                      <span className="text-slate-800 italic">{bag.note}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div>
                        <span className="text-slate-600 inline-block w-20">Line Wax</span>
                        <span className="font-semibold text-black">{bag.lineWax}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 inline-block w-20">Line SX</span>
                        <span className="font-semibold text-black">{bag.lineSx}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI - PHẦN 1: BẢNG COMPONENT HTJ */}
              <div className="space-y-2">
                <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide">
                  COMPONENT HTJ
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-black text-[10px] leading-tight text-center">
                    <thead>
                      <tr className="bg-slate-100 print:bg-transparent font-semibold border-b border-black">
                        <th className="border border-black py-1 px-1.5 text-left">Comp Code</th>
                        <th className="border border-black py-1 px-1">Cấp tại</th>
                        <th className="border border-black py-1 px-1">Qty</th>
                        <th className="border border-black py-1 px-1">Len</th>
                        <th className="border border-black py-1 px-1">Weight</th>
                        <th className="border border-black py-1 px-1.5 text-left">Comp Code</th>
                        <th className="border border-black py-1 px-1">Cấp tại</th>
                        <th className="border border-black py-1 px-1">Qty</th>
                        <th className="border border-black py-1 px-1">Len</th>
                        <th className="border border-black py-1 px-1">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {htjComponents.map((row, idx) => (
                        <tr key={idx} className="border-b border-black">
                          <td className="border border-black py-1 px-1.5 text-left font-mono font-medium">
                            {row.compCode1}
                          </td>
                          <td className="border border-black py-1 px-1">{row.stage1}</td>
                          <td className="border border-black py-1 px-1 font-bold">{row.qty1}</td>
                          <td className="border border-black py-1 px-1">{row.len1 || "—"}</td>
                          <td className="border border-black py-1 px-1">{row.weight1 || ""}</td>
                          <td className="border border-black py-1 px-1.5 text-left font-mono font-medium">
                            {row.compCode2}
                          </td>
                          <td className="border border-black py-1 px-1">{row.stage2}</td>
                          <td className="border border-black py-1 px-1 font-bold">{row.qty2}</td>
                          <td className="border border-black py-1 px-1">{row.len2 || "—"}</td>
                          <td className="border border-black py-1 px-1">{row.weight2 || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-slate-500 italic">
                  * Số lượng Qty của Component HTJ được tính tự động theo {calculatedWeights.pcs} pcs trong lô.
                </div>
              </div>
            </div>

            {/* PHẦN DƯỚI: COMPONENT CAST & COMPONENT ĐÁ (TRÁI) vs DANH SÁCH BƯỚC THỰC THI (PHẢI) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2 border-t border-slate-200 print:border-black">
              
              {/* CỘT TRÁI - PHẦN 2: BẢNG COMPONENT CAST & COMPONENT ĐÁ */}
              <div className="space-y-4">
                
                {/* 1. COMPONENT CAST */}
                <div className="space-y-1.5">
                  <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide">
                    COMPONENT CAST
                  </div>

                  <table className="w-full border-collapse border border-black text-[10px] leading-tight text-center">
                    <thead>
                      <tr className="bg-slate-100 print:bg-transparent font-semibold border-b border-black">
                        <th className="border border-black py-1 px-2 text-left">Cast</th>
                        <th className="border border-black py-1 px-2">Qty</th>
                        <th className="border border-black py-1 px-2 text-left">Khuôn</th>
                        <th className="border border-black py-1 px-2">Số lần bơm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {castComponents.map((c, idx) => (
                        <tr key={idx} className="border-b border-black">
                          <td className="border border-black py-1 px-2 text-left font-mono font-medium">{c.cast}</td>
                          <td className="border border-black py-1 px-2 font-bold">{c.qty}</td>
                          <td className="border border-black py-1 px-2 text-left font-mono">{c.mold}</td>
                          <td className="border border-black py-1 px-2 font-bold">{c.injectionCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 2. COMPONENT PHỤ LIỆU - ĐÁ */}
                <div className="space-y-1.5">
                  <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide flex items-center justify-between">
                    <span>COMPONENT PHỤ LIỆU - ĐÁ</span>
                    <span className="text-[10px] text-black font-semibold">
                      Stamp: <strong>{calculatedWeights.stampCode}</strong>
                    </span>
                  </div>

                  <table className="w-full border-collapse border border-black text-[10px] leading-tight text-center">
                    <thead>
                      <tr className="bg-slate-100 print:bg-transparent font-semibold border-b border-black">
                        <th className="border border-black py-1 px-2 text-left">Mã đá</th>
                        <th className="border border-black py-1 px-2">Qty</th>
                        <th className="border border-black py-1 px-2 text-right">NWeight</th>
                        <th className="border border-black py-1 px-2 text-right">Weight</th>
                        <th className="border border-black py-1 px-2 text-left">Loại đá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stoneComponents.list.map((st, idx) => (
                        <tr key={idx} className="border-b border-black">
                          <td className="border border-black py-1 px-2 text-left font-mono font-medium">{st.code}</td>
                          <td className="border border-black py-1 px-2 font-bold">{st.qty}</td>
                          <td className="border border-black py-1 px-2 text-right font-mono">{st.nweight.toFixed(6)}</td>
                          <td className="border border-black py-1 px-2 text-right font-mono font-bold">{st.weight}</td>
                          <td className="border border-black py-1 px-2 text-left">{st.type}</td>
                        </tr>
                      ))}
                      {/* Dòng Total */}
                      <tr className="bg-slate-50 print:bg-transparent font-bold border-t border-black">
                        <td className="border border-black py-1 px-2 text-left">Total:</td>
                        <td className="border border-black py-1 px-2 font-bold">{stoneComponents.totalQty}</td>
                        <td className="border border-black py-1 px-2 text-right"></td>
                        <td className="border border-black py-1 px-2 text-right font-mono text-black font-black">
                          {stoneComponents.totalWeight}
                        </td>
                        <td className="border border-black py-1 px-2 text-left text-slate-500 font-normal">
                          (TL đá chuẩn để khắc Stamp)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CỘT PHẢI - PHẦN 2: DANH SÁCH BƯỚC THỰC THI (ROUTING FIX / ROUTING KHSX) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-[#1e40af] font-bold text-xs uppercase tracking-wide">
                    DANH SÁCH BƯỚC THỰC THI
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 print:border-black">
                    {routingMode === "fixed" ? "⚡ Routing Fix Đơn Hàng (3 bước)" : "Toàn bộ 22 bước KHSX"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-black text-[10px] leading-tight">
                    <thead>
                      <tr className="bg-slate-100 print:bg-transparent font-semibold border-b border-black text-center">
                        <th className="border border-black py-1 px-1.5 w-8">STT</th>
                        <th className="border border-black py-1 px-2 w-20 text-left">Mã công đoạn</th>
                        <th className="border border-black py-1 px-2 text-left">WCName</th>
                        <th className="border border-black py-1 px-1.5 w-16">Bậc nghề</th>
                        <th className="border border-black py-1 px-1.5 w-14 text-right">Stdtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRouting.map((step) => {
                        const isStamping = step.wcCode === "WC-0013" || step.wcCode === "WC-STAMP";
                        return (
                          <tr
                            key={step.stt}
                            className={`border-b border-black ${
                              isStamping ? "bg-amber-50/60 print:bg-transparent" : ""
                            }`}
                          >
                            <td className="border border-black py-1 px-1.5 text-center font-bold">
                              {step.stt}
                            </td>
                            <td className="border border-black py-1 px-2 font-mono font-medium">
                              {step.wcCode}
                            </td>
                            <td className="border border-black py-1 px-2">
                              <span className={isStamping ? "font-bold text-black" : ""}>
                                {step.wcName}
                              </span>
                            </td>
                            <td className="border border-black py-1 px-1.5 text-center">
                              {step.grade}
                            </td>
                            <td className="border border-black py-1 px-1.5 text-right font-mono">
                              {step.stdtime}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {routingMode === "fixed" && (
                  <div className="p-2 rounded bg-teal-50 border border-teal-200 text-[10px] text-teal-950 print:bg-transparent print:border print:border-black">
                    <strong>Ghi chú tác nghiệp Cấp thành phẩm:</strong> Item kho CXLL áp dụng Routing fix 3 công đoạn gán cứng, bảo toàn phôi gốc và chỉ thực hiện xuất phôi → khắc dấu Stamp theo TL đá ({calculatedWeights.stampCode}) → đóng gói KCS nhập kho TP.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* THANH FOOTER (ẨN KHI IN) */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Máy in kho: <strong>Zebra ZT411 / Máy in Laser Văn Phòng</strong></span>
            <span>•</span>
            <span>Mã Stamp: <strong className="font-mono text-black">{calculatedWeights.stampCode}</strong></span>
            <span>•</span>
            <span>Số pcs: <strong>{calculatedWeights.pcs}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="px-5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-4 w-4 text-teal-200" />
              <span>In Thẻ Lệnh Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

