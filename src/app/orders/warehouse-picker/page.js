"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Warehouse, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Split, 
  RotateCcw, 
  Eye, 
  Layers, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Database,
  Diamond,
  FileCheck2,
  Clock,
  Send,
  Sliders
} from "lucide-react";
import JewelryVisual from "@/components/catalogue/JewelryVisual";

export default function WarehousePickerPrototype() {
  // 3 Kịch bản mẫu để demo trực quan
  const SCENARIOS = [
    {
      id: "sc-1",
      name: "Kịch bản 1: Đặt 100 món - Kho có sẵn 80 món (Phân bổ linh hoạt)",
      itemCode: "RG202500006",
      itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
      visualType: "ring-solitaire",
      goldType: "61Y",
      size: 45,
      stoneColor: "Xanh",
      stoneType: "Sapphire Xanh & Kim Cương Tấm",
      requestedQty: 100,
      stockAvailable: 80,
      stockBagCode: "BAG-TP-9901",
      stockLocation: "Két K1 - Ngăn A03 (Lô L-863)",
      stockSource: "Khách cũ hủy đơn đợt 1 (Đã KCS hoàn chỉnh)",
      laborPrice: 480000,
      matchStatus: "FULL_MATCH" // Khớp 100%
    },
    {
      id: "sc-2",
      name: "Kịch bản 2: Đặt 5 bộ - Kho có sẵn 2 bộ (Bộ Emerald Hoàng Gia)",
      itemCode: "SET-EMERALD-01",
      itemName: "Bộ Hoàng Gia Emerald Quý Tộc (Dây + Lắc + Nhẫn)",
      visualType: "set-royal-emerald",
      goldType: "75Y",
      size: 52,
      stoneColor: "Xanh Lục Bảo",
      stoneType: "Emerald Colombia & Kim Cương",
      requestedQty: 5,
      stockAvailable: 2,
      stockBagCode: "BAG-TP-9905",
      stockLocation: "Két K3 - Ngăn C01",
      stockSource: "Khách sỉ hủy đơn nguyên bộ",
      laborPrice: 3200000,
      matchStatus: "FULL_MATCH"
    },
    {
      id: "sc-3",
      name: "Kịch bản 3: Đặt Ni 46 - Kho chỉ có Ni 45 (Lệch Ni - Bắt buộc Đúc Mới)",
      itemCode: "RG202500006",
      itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
      visualType: "ring-solitaire",
      goldType: "61Y",
      size: 46, // Đặt Ni 46 nhưng kho chỉ có 45
      stoneColor: "Xanh",
      stoneType: "Sapphire Xanh & Kim Cương Tấm",
      requestedQty: 20,
      stockAvailable: 0,
      stockBagCode: "None",
      stockLocation: "-",
      stockSource: "Không có thành phẩm Ni 46",
      laborPrice: 480000,
      matchStatus: "MISMATCH_SIZE" // Lệch Ni tay -> Chặn không cho chọn kho
    }
  ];

  // Trạng thái kịch bản hiện tại
  const [activeScenarioId, setActiveScenarioId] = useState("sc-1");
  const currentScenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Trạng thái các bước tương tác
  // 1: Nhập hàng & Hệ thống tự động nhận diện
  // 2: Review đối chiếu thuộc tính 100%
  // 3: Phân bổ số lượng & Điều tiết đá
  // 4: Hoàn tất & Vòng đời chuyển KHSX
  const [currentStep, setCurrentStep] = useState(1);

  // Số lượng lấy từ kho (mặc định lấy tối đa số có sẵn)
  const [selectedStockQty, setSelectedStockQty] = useState(
    Math.min(currentScenario.requestedQty, currentScenario.stockAvailable)
  );

  // Cập nhật khi đổi kịch bản
  const handleSelectScenario = (scId) => {
    setActiveScenarioId(scId);
    const sc = SCENARIOS.find((s) => s.id === scId);
    setSelectedStockQty(Math.min(sc.requestedQty, sc.stockAvailable));
    setCurrentStep(1);
    setOrderStatus("CHO_KY_THUAT");
  };

  // Tính toán số lượng phân bổ
  const qtyFromStock = currentScenario.matchStatus === "FULL_MATCH" ? selectedStockQty : 0;
  const qtyNewProduction = currentScenario.requestedQty - qtyFromStock;

  // Giả lập trạng thái SO trong vòng đời
  // CHO_KY_THUAT -> DU_THONG_TIN_KT -> DA_CHUYEN_KHSX
  const [orderStatus, setOrderStatus] = useState("CHO_KY_THUAT");

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/orders/create" className="hover:text-emerald-800 flex items-center font-medium">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Tạo đơn hàng SO
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Prototype: Chọn Item Kho Thành Phẩm</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-black uppercase rounded-full">
            Interactive Prototype v1.0
          </span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
            Chuẩn Admin KSNL
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#005a46] via-[#004737] to-[#013328] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Warehouse className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/25 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
            <span>Phân hệ Quản Lý Đơn Hàng (QLĐH) & Kho Thành Phẩm Chờ Xử Lý</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Prototype: Nhận Diện, Review & Chọn Item Kho Thành Phẩm
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Mô phỏng trực quan 4 bước: Tự động nhận diện tồn kho khớp 100% $\rightarrow$ Đối chiếu thuộc tính bảo toàn phôi $\rightarrow$ Phân bổ số lượng & Điều tiết nhả đá $\rightarrow$ QLSP duyệt Routing & QLĐH bấm chuyển KHSX.
          </p>
        </div>

        {/* Thanh chọn Kịch bản Demo */}
        <div className="mt-5 pt-4 border-t border-emerald-600/50 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider mr-2">
            Chọn kịch bản kiểm thử:
          </span>
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeScenarioId === sc.id
                  ? "bg-amber-400 text-slate-950 shadow-md ring-2 ring-white"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20 border border-white/10"
              }`}
            >
              {sc.name.split(":")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { step: 1, title: "1. Nhận Diện Tồn Kho", desc: "Quét ngầm khớp 100%" },
            { step: 2, title: "2. Review Đối Chiếu", desc: "Bảo toàn phôi & đá" },
            { step: 3, title: "3. Phân Bổ & Nhả Đá", desc: "Tách kho & đúc mới" },
            { step: 4, title: "4. Chuyển Lệnh KHSX", desc: "Vòng đời & Trách nhiệm" }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                currentStep === s.step
                  ? "bg-emerald-50 border-emerald-500 shadow-xs"
                  : currentStep > s.step
                  ? "bg-slate-50 border-slate-300 opacity-90"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black ${
                  currentStep === s.step ? "text-[#005a46]" : "text-slate-500"
                }`}>
                  {s.title}
                </span>
                {currentStep > s.step ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${
                    currentStep === s.step ? "bg-emerald-600" : "bg-slate-300"
                  }`} />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN INTERACTIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CỘT TRÁI (8 CỘT): VÙNG THAO TÁC & REVIEW TƯƠNG TÁC */}
        <div className="lg:col-span-8 space-y-6">

          {/* BƯỚC 1: NHẬP DÒNG HÀNG & HỆ THỐNG TỰ ĐỘNG NHẬN DIỆN */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center">
                    Bước 1: Nhập Dòng Hàng & Hệ Thống Tự Động Nhận Diện Tồn Kho
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hệ thống quét ngầm thời gian thực ngay khi nhập xong 4 thuộc tính sản phẩm
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono font-bold">
                  SO-LINE #01
                </span>
              </div>

              {/* Form giả lập nhập liệu */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mã Item</label>
                  <div className="font-mono font-bold text-slate-900 text-sm bg-white p-2 rounded-lg border border-slate-200">
                    {currentScenario.itemCode}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Tuổi vàng</label>
                  <div className="font-bold text-emerald-800 text-sm bg-white p-2 rounded-lg border border-slate-200">
                    {currentScenario.goldType}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Ni tay (Size)</label>
                  <div className="font-bold text-slate-900 text-sm bg-white p-2 rounded-lg border border-slate-200">
                    Ni {currentScenario.size}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Màu đá</label>
                  <div className="font-bold text-indigo-900 text-sm bg-white p-2 rounded-lg border border-slate-200">
                    {currentScenario.stoneColor}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Tên sản phẩm</label>
                  <div className="text-xs font-semibold text-slate-800 bg-white p-2 rounded-lg border border-slate-200 truncate">
                    {currentScenario.itemName}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Số lượng khách đặt</label>
                  <div className="font-mono font-black text-emerald-900 text-sm bg-white p-2 rounded-lg border border-emerald-300 flex items-center justify-between">
                    <span>{currentScenario.requestedQty} món</span>
                    <span className="text-[10px] text-slate-400 font-normal">Tạm hold đá 100% (Lần 1)</span>
                  </div>
                </div>
              </div>

              {/* KẾT QUẢ QUÉT TỰ ĐỘNG CỦA HỆ THỐNG */}
              {currentScenario.matchStatus === "FULL_MATCH" ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950 flex items-center">
                          Phát Hiện Tồn Kho Thành Phẩm Khớp 100% Thuộc Tính!
                          <span className="ml-2 text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            Có sẵn {currentScenario.stockAvailable} món
                          </span>
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Mã Bag: <strong>{currentScenario.stockBagCode}</strong> • Vị trí: <strong>{currentScenario.stockLocation}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-emerald-900 bg-white/80 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span>
                      Khách đặt <strong>{currentScenario.requestedQty} món</strong> $\rightarrow$ Kho có sẵn <strong>{currentScenario.stockAvailable} món</strong>. 
                      Có thể tận dụng kho để rút ngắn giao hàng từ 15 ngày xuống 2 ngày!
                    </span>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <span>Đồng bộ thông tin từ kho</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <span>Không có sản phẩm khớp 100% trong kho</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Khách đặt <strong>Ni {currentScenario.size}</strong> nhưng kho chỉ có Ni 45. Theo nguyên tắc 
                    <strong> Bán đúng sản phẩm trong kho (Không cho phép dung sai ni hay sửa cơ khí)</strong>, 
                    hệ thống tự động điều phối đơn hàng sang luồng <strong>Sản xuất đúc mới 100%</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* BƯỚC 2: REVIEW ĐỐI CHIẾU THUỘC TÍNH 100% KHỚP */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center">
                    Bước 2: Review Đối Chiếu Thuộc Tính 100% (Exact Match Gate)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kiểm tra đối chiếu 4 thông số cốt lõi trước khi xác nhận gán vào đơn hàng
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Quay lại bước 1
                </button>
              </div>

              {/* Bảng so sánh Đối chiếu 4 Tiêu chí cốt lõi */}
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Thuộc tính kỹ thuật</th>
                      <th className="px-4 py-3">Yêu cầu Đơn hàng (SO)</th>
                      <th className="px-4 py-3">Hiện trạng Kho Thành Phẩm</th>
                      <th className="px-4 py-3 text-center">Kết quả đối soát</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">1. Kiểu dáng / Mã Item</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{currentScenario.itemCode}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800">{currentScenario.itemCode}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="h-3 w-3 mr-1" /> Trùng 100%
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">2. Tuổi vàng (Karat)</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{currentScenario.goldType}</td>
                      <td className="px-4 py-3 font-bold text-emerald-800">{currentScenario.goldType}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="h-3 w-3 mr-1" /> Cùng hàm lượng
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">3. Kích thước Ni tay</td>
                      <td className="px-4 py-3 font-bold text-slate-900">Ni {currentScenario.size}</td>
                      <td className="px-4 py-3 font-bold text-emerald-800">Ni {currentScenario.size}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="h-3 w-3 mr-1" /> Chuẩn Ni tuyệt đối
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">4. Quy cách Đá trên phôi</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{currentScenario.stoneColor}</td>
                      <td className="px-4 py-3 font-bold text-emerald-800">{currentScenario.stoneType}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="h-3 w-3 mr-1" /> Đã gắn sẵn phôi
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Thông tin pháp lý & Thẻ kho */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Mã Bag / Barcode</span>
                  <span className="font-mono font-black text-slate-900">{currentScenario.stockBagCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Vị trí lưu kho</span>
                  <span className="font-bold text-slate-800">{currentScenario.stockLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Tiền công KH Mới</span>
                  <span className="font-mono font-black text-emerald-800">
                    {currentScenario.laborPrice.toLocaleString("vi-VN")} đ/chiếc
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Trạng thái kho</span>
                  <span className="font-bold text-emerald-700">Khả dụng (Available)</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <span>Chấp nhận đối soát & Sang bước phân bổ số lượng</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 3: PHÂN BỔ SỐ LƯỢNG & ĐIỀU TIẾT ĐÁ */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center">
                    Bước 3: Điều Khiển Phân Bổ Số Lượng & Điều Tiết Nhả Đá
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hỗ trợ kịch bản đặt 100 món, kho có 80 món $\rightarrow$ Tách 80 món kho + 20 món đúc mới
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Quay lại bước 2
                </button>
              </div>

              {/* Slider điều chỉnh phân bổ */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Thanh trượt phân bổ số lượng
                    </span>
                    <span className="text-xs text-slate-500">
                      Tổng đặt: <strong>{currentScenario.requestedQty} món</strong> • Tồn kho tối đa: <strong>{currentScenario.stockAvailable} món</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-600">Lấy từ kho:</span>
                    <input
                      type="number"
                      min="0"
                      max={Math.min(currentScenario.requestedQty, currentScenario.stockAvailable)}
                      value={selectedStockQty}
                      onChange={(e) => setSelectedStockQty(Number(e.target.value))}
                      className="w-20 text-center font-mono font-black text-sm text-emerald-900 border-2 border-emerald-600 rounded-lg p-1 bg-white"
                    />
                    <span className="text-xs font-bold text-slate-600">món</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max={Math.min(currentScenario.requestedQty, currentScenario.stockAvailable)}
                  value={selectedStockQty}
                  onChange={(e) => setSelectedStockQty(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005a46]"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                  <span>0 (Đúc mới 100%)</span>
                  <span>Tối đa kho: {currentScenario.stockAvailable} món</span>
                </div>
              </div>

              {/* MA TRẬN PHÂN BỔ 2 NHÁNH TRỰC QUAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nhánh 1: Kho Thành Phẩm */}
                <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/60 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center text-sm">
                      <Warehouse className="h-4 w-4 mr-1.5 text-emerald-700" />
                      Nhánh A: Lấy từ Kho Thành Phẩm
                    </span>
                    <span className="font-mono font-black text-lg text-emerald-800 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      {qtyFromStock} món
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-emerald-900">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 shrink-0" />
                        Tự động NHẢ {qtyFromStock} phần đá đã tạm hold
                      </div>
                      <p className="text-[11px] text-slate-500 pl-4.5">
                        Phôi kho đã ngậm đủ 100% đá $\rightarrow$ Trả {qtyFromStock} phần đá về tồn kho khả dụng ngay lập tức.
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="font-bold text-slate-700 block text-[11px]">Routing làm mới tại QLSP:</span>
                      <span className="text-[11px] text-indigo-900 font-medium">
                        Tẩy xi $\rightarrow$ Khắc logo/tuổi khách mới $\rightarrow$ Xi mạ mới $\rightarrow$ KCS (2-3 ngày)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nhánh 2: Đúc Mới Bắt Buộc */}
                <div className="p-4 rounded-xl border-2 border-blue-300 bg-blue-50/60 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 flex items-center text-sm">
                      <Layers className="h-4 w-4 mr-1.5 text-blue-700" />
                      Nhánh B: Sản Xuất Đúc Mới
                    </span>
                    <span className="font-mono font-black text-lg text-blue-800 bg-white px-2.5 py-0.5 rounded-lg border border-blue-300">
                      {qtyNewProduction} món
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-blue-900">
                    <div className="bg-white p-2.5 rounded-lg border border-blue-200 space-y-1">
                      <div className="font-bold text-blue-800 flex items-center">
                        <Diamond className="h-3.5 w-3.5 mr-1 text-blue-600 shrink-0" />
                        Duy trì giữ chỗ đá cho {qtyNewProduction} món
                      </div>
                      <p className="text-[11px] text-slate-500 pl-4.5">
                        Tiếp tục hold đá theo định mức BOM đúc mới để xưởng gắn đá khi hoàn thiện phôi.
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-blue-200">
                      <span className="font-bold text-slate-700 block text-[11px]">Quy trình sản xuất tiêu chuẩn:</span>
                      <span className="text-[11px] text-slate-600 font-medium">
                        Đúc phôi $\rightarrow$ Nguội $\rightarrow$ Gắn đá $\rightarrow$ Xi mạ $\rightarrow$ KCS (10-15 ngày)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Xác nhận phân bổ vào Đơn Hàng</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 4: HOÀN TẤT VÀ VÒNG ĐỜI CHUYỂN KHSX */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center">
                    Bước 4: Đồng Bộ Đơn Hàng & Vòng Đời Chuyển KHSX
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Minh họa chính xác: QLSP cập nhật Routing $\rightarrow$ &apos;Đủ thông tin KT&apos; $\rightarrow$ QLĐH bấm Chuyển KHSX
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Chỉnh lại số lượng
                </button>
              </div>

              {/* Hộp trạng thái đơn hàng động */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-bold uppercase">Mã đơn hàng SO</span>
                    <span className="font-mono font-black text-lg text-slate-900">SO2608001</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-600">Trạng thái hiện tại:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      orderStatus === "CHO_KY_THUAT"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : orderStatus === "DU_THONG_TIN_KT"
                        ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse"
                        : "bg-indigo-100 text-indigo-800 border border-indigo-300"
                    }`}>
                      {orderStatus === "CHO_KY_THUAT" && "Chờ Kỹ thuật (QLSP)"}
                      {orderStatus === "DU_THONG_TIN_KT" && "Đủ thông tin kỹ thuật"}
                      {orderStatus === "DA_CHUYEN_KHSX" && "Đã chuyển KHSX"}
                    </span>
                  </div>
                </div>

                {/* 3 MỐC TIẾN TRÌNH RÕ RÀNG */}
                <div className="space-y-3 text-xs">
                  
                  {/* Mốc 1: Gửi QLSP */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    orderStatus === "CHO_KY_THUAT" ? "bg-white border-yellow-300" : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        orderStatus === "CHO_KY_THUAT" ? "bg-yellow-500 text-white" : "bg-emerald-600 text-white"
                      }`}>
                        1
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">QLSP Tiếp nhận & Cập nhật Routing làm mới</span>
                        <span className="text-[11px] text-slate-500">Cấu hình: Tẩy xi $\rightarrow$ Khắc logo/tuổi mới $\rightarrow$ Xi mạ $\rightarrow$ KCS</span>
                      </div>
                    </div>
                    {orderStatus === "CHO_KY_THUAT" && (
                      <button
                        onClick={() => setOrderStatus("DU_THONG_TIN_KT")}
                        className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                      >
                        [Demo: Giả lập QLSP Duyệt]
                      </button>
                    )}
                    {orderStatus !== "CHO_KY_THUAT" && (
                      <span className="text-emerald-700 font-bold flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Đã cập nhật Routing
                      </span>
                    )}
                  </div>

                  {/* Mốc 2: Cập nhật Đủ thông tin KT & QLĐH bấm chuyển */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    orderStatus === "DU_THONG_TIN_KT"
                      ? "bg-white border-blue-400 shadow-xs"
                      : orderStatus === "DA_CHUYEN_KHSX"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-100 border-slate-200 opacity-60"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        orderStatus === "DU_THONG_TIN_KT"
                          ? "bg-blue-600 text-white"
                          : orderStatus === "DA_CHUYEN_KHSX"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-400 text-white"
                      }`}>
                        2
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">
                          QLĐH Kiểm soát & Bấm nút &apos;Chuyển KHSX&apos;
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Hệ thống không tự ý nhảy cóc sang KHSX; Bán hàng kiểm tra và chủ động bấm chuyển lệnh
                        </span>
                      </div>
                    </div>

                    {orderStatus === "DU_THONG_TIN_KT" && (
                      <button
                        onClick={() => setOrderStatus("DA_CHUYEN_KHSX")}
                        className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 cursor-pointer animate-bounce"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Bấm [Chuyển KHSX] ngay</span>
                      </button>
                    )}
                    {orderStatus === "DA_CHUYEN_KHSX" && (
                      <span className="text-emerald-700 font-bold flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Đã chuyển KHSX thành công
                      </span>
                    )}
                  </div>

                  {/* Mốc 3: KHSX Tách Planned Order */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    orderStatus === "DA_CHUYEN_KHSX" ? "bg-white border-indigo-300" : "bg-slate-100 border-slate-200 opacity-60"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        orderStatus === "DA_CHUYEN_KHSX" ? "bg-indigo-600 text-white" : "bg-slate-400 text-white"
                      }`}>
                        3
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">KHSX Tách 2 Lệnh Sản Xuất Kế Hoạch (PO)</span>
                        <span className="text-[11px] text-slate-500">
                          Lệnh A ({qtyFromStock} món kho $\rightarrow$ xuất phôi xi mạ) + Lệnh B ({qtyNewProduction} món $\rightarrow$ đúc mới hoàn toàn)
                        </span>
                      </div>
                    </div>
                    {orderStatus === "DA_CHUYEN_KHSX" && (
                      <span className="text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                        2 Planned Orders Sẵn Sàng
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset demo button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setOrderStatus("CHO_KY_THUAT");
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Làm lại Demo từ đầu</span>
                </button>

                <Link
                  href="/orders/create"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  <span>Xem trên trang Tạo Đơn Hàng thực tế</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI (4 CỘT): VISUAL CARD & REALTIME AUDIT LEDGER */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card Hình ảnh Render 3D của Sản Phẩm */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mô phỏng Phôi & Đá Thực Tế
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {currentScenario.goldType}
              </span>
            </div>

            <div className="w-full h-56 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-2">
              <JewelryVisual type={currentScenario.visualType} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 text-sm">{currentScenario.itemName}</div>
              <div className="text-slate-500 text-[11px] flex justify-between">
                <span>Quy cách: Ni {currentScenario.size}</span>
                <span className="font-mono text-emerald-800 font-bold">{currentScenario.itemCode}</span>
              </div>
              <div className="text-indigo-900 text-[11px] bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                💎 <strong>Đá trên phôi:</strong> {currentScenario.stoneType}
              </div>
            </div>
          </div>

          {/* SỔ CÁI THEO DÕI BIẾN ĐỘNG TỒN KHO ĐÁ (Realtime Stone Audit) */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-5 shadow-lg space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Diamond className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Sổ Cái Điều Tiết Đá (Kho Phụ Liệu)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Live Audit
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>1. Tạm giữ chỗ Lần 1 (Tạo SO):</span>
                <span className="font-mono font-bold text-amber-400">-{currentScenario.requestedQty} viên</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>2. Nhả đá (Lấy {qtyFromStock} món kho):</span>
                <span className="font-mono font-bold text-emerald-400">+{qtyFromStock} viên</span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Thực tế xuất đá (Đúc mới):</span>
                <span className="font-mono font-black text-cyan-300">{qtyNewProduction} viên</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60 leading-relaxed">
              💡 <strong>Nguyên lý:</strong> Vì {qtyFromStock} phôi trong kho đã có sẵn 100% đá, hệ thống lập tức hoàn trả {qtyFromStock} viên về tồn khả dụng, tránh giam đá ảo trong kho.
            </div>
          </div>

          {/* Card Ranh giới 4 Phân hệ (RACI Quick Reference) */}
          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 space-y-3 text-xs">
            <span className="font-bold text-emerald-950 uppercase tracking-wider block text-[11px]">
              Nguyên Tắc Trách Nhiệm 4 Phân Hệ
            </span>
            <ul className="space-y-2 text-emerald-900 text-[11px] leading-relaxed">
              <li className="flex items-start">
                <span className="font-bold mr-1 text-[#005a46]">• QLĐH:</span> Chọn item kho khớp 100%, phát lệnh nhả đá & bấm chuyển KHSX.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-1 text-[#005a46]">• QLSP:</span> Đơn vị duy nhất duyệt Routing làm mới (Tẩy xi, Khắc, Xi mạ, KCS).
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-1 text-[#005a46]">• KHSX:</span> Tách 2 Planned Orders và điều phối nguồn lực xưởng.
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-1 text-[#005a46]">• Kho TP:</span> Khóa giữ Barcode (Allocated) và xuất phôi theo lệnh.
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
