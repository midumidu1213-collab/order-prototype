"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Truck,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Send,
  ArrowLeft,
  Sparkles,
  Info,
  ShieldCheck,
  Clock,
  Layers,
  Save,
  Trash2,
  FileCheck,
  DollarSign,
  HelpCircle,
  X,
  QrCode,
  Eye,
  Check,
  Lock,
} from "lucide-react";

function CreateDeliveryOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("editMode") === "in_place" || !!searchParams.get("doId");

  // Initial DO Header State
  const [doCode] = useState(`DO20260827${Math.floor(100 + Math.random() * 900)}`);
  const [customerName] = useState("2000001 - Vàng Kim Yến");
  const [customerCode] = useState("KH001");
  const [purityCode] = useState("AU 75.00 Y");
  const [purityFactor] = useState(0.75); // 75%
  const [shippingAddress, setShippingAddress] = useState(
    "124 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
  );
  const [creator] = useState("Nguyễn Văn An (Sale Admin)");
  const [orderDate] = useState("15/07/2026");

  // Delivery Date & 30-Day SLA Check
  const firstDoDateStr = "2026-07-20";
  const [deliveryDate, setDeliveryDate] = useState("2026-08-28"); // Default is > 30 days
  const [isDelayed30Days, setIsDelayed30Days] = useState(false);
  const [delayDaysCount, setDelayDaysCount] = useState(0);

  // Discount configuration
  const originalDiscountPercent = 5.0; // 5% tier
  const singleSoDiscountPercent = 2.0; // 2% fallback
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(5.0);
  const [discountStatus, setDiscountStatus] = useState("Mặc định"); // "Mặc định" | "Đã giảm" | "Chờ duyệt Base" | "Đã duyệt Base"

  // Base Request Modal
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [baseReason, setBaseReason] = useState(
    "Xưởng sản xuất bị chậm tiến độ khâu đúc nguội do thiếu phôi vàng 75Y; Đề xuất Ban Giám đốc duy trì mức chiết khấu 5% cho khách hàng VIP."
  );
  const [proposedDiscount, setProposedDiscount] = useState("5.0");
  const [toastMessage, setToastMessage] = useState(null);

  // Series Detail Modal state
  const [activeSeriesBagModal, setActiveSeriesBagModal] = useState(null);

  // Bag items in this DO
  const [bags, setBags] = useState([
    {
      id: "BAG-2608-001",
      bagCode: "BAG-2608-001",
      soCode: "SO2608001",
      itemCode: "GY0RG000086A00",
      category: "Nhẫn nữ",
      purityCode: "AU 75.00 Y",
      hasSeries: true,
      totalQtyInStock: 10,
      exportQty: 10,
      stoneWeightPerPsc: 0.2500,
      goldWeightPerPsc: 14.0000,
      laborCostPerPsc: 350000,
      pickedSeries: [
        "SR-2608-001-01", "SR-2608-001-02", "SR-2608-001-03", "SR-2608-001-04", "SR-2608-001-05",
        "SR-2608-001-06", "SR-2608-001-07", "SR-2608-001-08", "SR-2608-001-09", "SR-2608-001-10"
      ]
    },
    {
      id: "BAG-2608-002",
      bagCode: "BAG-2608-002",
      soCode: "SO2608001",
      itemCode: "GY0NL000012B00",
      category: "Dây chuyền",
      purityCode: "AU 75.00 Y",
      hasSeries: true,
      totalQtyInStock: 8,
      exportQty: 8,
      stoneWeightPerPsc: 0.0000,
      goldWeightPerPsc: 21.0000,
      laborCostPerPsc: 520000,
      pickedSeries: [
        "SR-2608-002-01", "SR-2608-002-02", "SR-2608-002-03", "SR-2608-002-04",
        "SR-2608-002-05", "SR-2608-002-06", "SR-2608-002-07", "SR-2608-002-08"
      ]
    },
    {
      id: "BAG-2608-003",
      bagCode: "BAG-2608-003",
      soCode: "SO2608003",
      itemCode: "GY0ER000045C00",
      category: "Bông tai",
      purityCode: "AU 75.00 Y",
      hasSeries: false, // KHÔNG CÓ SERIES -> Khóa cứng, không cho chọn lẻ
      totalQtyInStock: 12,
      exportQty: 12,
      stoneWeightPerPsc: 0.4000,
      goldWeightPerPsc: 7.6000,
      laborCostPerPsc: 280000,
      pickedSeries: []
    },
    {
      id: "BAG-2608-005",
      bagCode: "BAG-2608-005",
      soCode: "SO2608001",
      itemCode: "GY0RG000033A00",
      category: "Nhẫn nữ",
      purityCode: "AU 75.00 Y",
      hasSeries: true,
      totalQtyInStock: 6,
      exportQty: 4, // Partial allocation with series
      stoneWeightPerPsc: 0.2000,
      goldWeightPerPsc: 13.8000,
      laborCostPerPsc: 380000,
      pickedSeries: ["SR-2608-005-01", "SR-2608-005-02", "SR-2608-005-03", "SR-2608-005-04"]
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Evaluate SLA 30 days
  useEffect(() => {
    const firstDate = new Date(firstDoDateStr);
    const planDate = new Date(deliveryDate);
    const diffTime = planDate - firstDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDelayDaysCount(diffDays);

    if (diffDays > 30) {
      setIsDelayed30Days(true);
      if (discountStatus !== "Đã duyệt Base" && discountStatus !== "Chờ duyệt Base") {
        setAppliedDiscountPercent(singleSoDiscountPercent);
        setDiscountStatus("Đã giảm");
      }
    } else {
      setIsDelayed30Days(false);
      if (discountStatus !== "Đã duyệt Base" && discountStatus !== "Chờ duyệt Base") {
        setAppliedDiscountPercent(originalDiscountPercent);
        setDiscountStatus("Mặc định");
      }
    }
  }, [deliveryDate, discountStatus]);

  // Remove Bag
  const handleRemoveBag = (bagId) => {
    if (bags.length <= 1) {
      showToast("⚠️ Phiếu Giao Hàng phải có ít nhất 1 Bag!");
      return;
    }
    setBags(bags.filter((b) => b.id !== bagId));
    showToast("🗑️ Đã bỏ Bag khỏi đợt giao.");
  };

  // Calculations Summary Bar
  const totalExportQty = bags.reduce((acc, b) => acc + (b.exportQty || 0), 0);
  const totalGoldWeight = bags.reduce(
    (acc, b) => acc + (b.exportQty || 0) * b.goldWeightPerPsc,
    0
  );
  const totalStoneWeight = bags.reduce(
    (acc, b) => acc + (b.exportQty || 0) * (b.stoneWeightPerPsc || 0),
    0
  );
  const totalWeight = totalGoldWeight + totalStoneWeight;
  const totalLaborBeforeDiscount = bags.reduce(
    (acc, b) => acc + (b.exportQty || 0) * b.laborCostPerPsc,
    0
  );
  const totalLaborDiscountAmount =
    (totalLaborBeforeDiscount * appliedDiscountPercent) / 100;
  const totalLaborAfterDiscount =
    totalLaborBeforeDiscount - totalLaborDiscountAmount;

  // Send Base Request Approval
  const handleSendBaseRequest = () => {
    setShowBaseModal(false);
    setDiscountStatus("Chờ duyệt Base");
    showToast(
      "🚀 Đã gửi Ticket yêu cầu phê duyệt phục hồi chiết khấu sang Base Request thành công!"
    );
  };

  // Simulate Base Approval
  const handleSimulateBaseApprove = () => {
    setDiscountStatus("Đã duyệt Base");
    setAppliedDiscountPercent(parseFloat(proposedDiscount) || 5.0);
    showToast(
      "✅ Base Request đã Phê duyệt! % Chiết khấu đã được khôi phục 5.0% và Khóa cứng."
    );
  };

  // Forward to Kho Thành Phẩm
  const handleForwardWarehouse = () => {
    showToast(
      `🎉 Đã chuyển DO ${doCode} sang Module Kho thành phẩm! Trạng thái: Chờ lập hóa đơn`
    );
    setTimeout(() => {
      router.push("/delivery-orders");
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005a46] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2.5 border border-emerald-300 animate-in slide-in-from-top duration-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <Link
            href="/delivery-orders"
            className="text-gray-600 hover:text-[#005a46] flex items-center font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Quay lại Danh sách DO
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900">
            {isEditMode ? "Chỉnh Sửa Phiếu Giao Hàng" : "Lập Phiếu Giao Hàng (Delivery Order)"}
          </span>
        </div>
      </div>

      {/* Header Info Card (Đã bỏ badge 1 DO = 1 Invoice & bỏ text hàm lượng thừa) */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2.5 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 text-[#005a46] rounded-xl font-bold">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 font-mono tracking-tight">
                {doCode}
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Khởi tạo ngày 27/08/2026 bởi <b>{creator}</b>
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-gray-500 font-medium">DO đầu tiên trong nhóm:</div>
            <div className="font-mono font-bold text-gray-800">
              DO260720001 (20/07/2026)
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Mã & Tên Khách Hàng (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={customerName}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-bold text-xs"
            />
          </div>

          {/* Loại Nguyên Liệu - Tuổi Vàng (Gọn gàng chỉ AU 75.00 Y) */}
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Loại Nguyên Liệu - Tuổi Vàng
            </label>
            <input
              type="text"
              readOnly
              value={purityCode}
              className="w-full p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-bold font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1 flex items-center justify-between">
              <span>Ngày Giao Hàng Kế Hoạch *</span>
              <span className="text-[10px] text-gray-400">SLA 30d</span>
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg font-medium text-gray-900 text-xs focus:ring-1 focus:ring-[#005a46]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">
              Tỷ Lệ Chiết Khấu DO (%)
            </label>
            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                readOnly
                value={`${appliedDiscountPercent}%`}
                className={`w-full p-2 rounded-lg font-mono font-bold text-center border text-xs ${
                  isDelayed30Days
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                }`}
              />
              {discountStatus === "Chờ duyệt Base" && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-[10px] font-bold shrink-0">
                  Chờ duyệt Base
                </span>
              )}
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-gray-600 font-semibold mb-1">
              Địa Chỉ Giao Hàng Cụ Thể
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 text-xs focus:ring-1 focus:ring-[#005a46]"
            />
          </div>
        </div>

        {/* 30-DAY SLA WARNING BANNER - TINH GỌN KÈM TOOLTIP & NÚT YC CHỈ KHI ĐÃ LẬP PHIẾU */}
        {isDelayed30Days ? (
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <b>Đã tự động giảm chiết khấu về {appliedDiscountPercent}%</b> do quá hạn giao 30 ngày (Chậm {delayDaysCount} ngày).
              </span>
              <div className="group relative cursor-pointer text-amber-700">
                <Info className="h-3.5 w-3.5" />
                <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-64 p-2 bg-gray-900 text-white text-[11px] rounded-lg shadow-lg z-20">
                  Ngày giao kế hoạch ({deliveryDate}) chậm {delayDaysCount} ngày (&gt; 30 ngày) so với DO đầu tiên ({firstDoDateStr}). Hệ thống tự động giảm chiết khấu ưu đãi từ {originalDiscountPercent}% về {singleSoDiscountPercent}%.
                </div>
              </div>
            </div>

            {/* Nút gửi YC chỉ xuất hiện khi đã lập phiếu (Chế độ Edit/Đã phân bổ) */}
            {isEditMode && (
              <div className="flex items-center space-x-2 shrink-0">
                {discountStatus === "Chờ duyệt Base" ? (
                  <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-bold">
                    Chờ duyệt Base
                  </span>
                ) : discountStatus === "Đã duyệt Base" ? (
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold flex items-center border border-green-300">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1 text-green-600" />
                    Đã duyệt phục hồi {appliedDiscountPercent}%
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowBaseModal(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Gửi yêu cầu điều chỉnh chiết khấu
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <b>Giao hàng đúng hạn:</b> Khoảng cách giao hàng là <b>{delayDaysCount} ngày</b> (&le; 30 ngày). Áp dụng <b>{appliedDiscountPercent}% chiết khấu</b>.
            </span>
          </div>
        )}
      </div>

      {/* Bag Items Table: Đổi tên thành DS Lô, Bỏ box ghi chú thừa, Bỏ cột Quản lý Series, Bỏ chủng loại, Thêm TL Kim loại & TL Đá */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden space-y-2 p-3.5">
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
          <Package className="h-4 w-4 text-[#005a46]" />
          <h2 className="text-sm font-bold text-gray-900">
            Danh sách Lô ({bags.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-2.5 py-2 text-center w-8">STT</th>
                <th className="px-2.5 py-2 text-left">Mã Lô (Bag)</th>
                <th className="px-2.5 py-2 text-left">Mã SO</th>
                <th className="px-2.5 py-2 text-left">Mã Item</th>
                <th className="px-2.5 py-2 text-right">SL Tồn</th>
                <th className="px-2.5 py-2 text-center w-28 bg-emerald-50 text-[#005a46]">
                  SL Xuất Đợt Này *
                </th>
                <th className="px-2.5 py-2 text-center">Danh sách Series</th>
                <th className="px-2.5 py-2 text-right font-bold text-amber-900 bg-amber-50/30">TL Kim loại (g)</th>
                <th className="px-2.5 py-2 text-right text-gray-600">TL Đá (g)</th>
                <th className="px-2.5 py-2 text-right font-bold text-purple-900 bg-purple-50/30">Tổng TL (g)</th>
                <th className="px-2.5 py-2 text-right">Đơn giá công</th>
                <th className="px-2.5 py-2 text-right font-bold text-[#005a46]">
                  Tiền công sau CK ({appliedDiscountPercent}%)
                </th>
                <th className="px-2.5 py-2 text-center w-10">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bags.map((bag, idx) => {
                const goldW = bag.exportQty * bag.goldWeightPerPsc;
                const stoneW = bag.exportQty * (bag.stoneWeightPerPsc || 0);
                const totalW = goldW + stoneW;
                const laborTotal = bag.exportQty * bag.laborCostPerPsc;
                const laborAfter = laborTotal * (1 - appliedDiscountPercent / 100);
                const isPartial = bag.hasSeries && bag.exportQty < bag.totalQtyInStock;

                return (
                  <tr key={bag.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-2.5 py-2.5 text-center text-gray-500 font-medium">{idx + 1}</td>
                    <td className="px-2.5 py-2.5 font-bold text-[#005a46] whitespace-nowrap font-mono">
                      {bag.bagCode}
                    </td>
                    <td className="px-2.5 py-2.5 font-semibold text-blue-700 whitespace-nowrap font-mono">
                      {bag.soCode}
                    </td>
                    <td className="px-2.5 py-2.5 whitespace-nowrap font-mono font-medium text-gray-900">
                      {bag.itemCode}
                    </td>

                    <td className="px-2.5 py-2.5 text-right font-medium text-gray-500">
                      {bag.totalQtyInStock}
                    </td>

                    {/* Export Qty Selection */}
                    <td className="px-2.5 py-2 text-center bg-emerald-50/50">
                      {bag.hasSeries ? (
                        <button
                          type="button"
                          onClick={() => setActiveSeriesBagModal(bag)}
                          className="inline-flex items-center px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-400 rounded-lg shadow-2xs text-xs font-bold transition group"
                          title="Click để chọn hoặc bỏ chọn từng mã Series"
                        >
                          <QrCode className="h-3.5 w-3.5 mr-1 text-[#005a46]" />
                          <span>{bag.exportQty} / {bag.totalQtyInStock} pcs</span>
                          {isPartial && (
                            <span className="ml-1 text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-extrabold">
                              Tách
                            </span>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center space-x-1 text-gray-700 font-bold">
                          <span>{bag.exportQty} pcs</span>
                          <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                            Cả lô
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Danh sách Series */}
                    <td className="px-2.5 py-2.5 text-center whitespace-nowrap">
                      {bag.hasSeries ? (
                        <button
                          type="button"
                          onClick={() => setActiveSeriesBagModal(bag)}
                          className="text-[#005a46] hover:underline font-bold text-[11px] flex items-center justify-center mx-auto"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>Xem {bag.pickedSeries?.length || bag.exportQty} mã</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">
                          - (Cả lô)
                        </span>
                      )}
                    </td>

                    {/* TL Kim loại (g) */}
                    <td className="px-2.5 py-2.5 text-right font-mono font-bold text-amber-900 bg-amber-50/20">
                      {goldW.toFixed(4)}
                    </td>

                    {/* TL Đá (g) */}
                    <td className="px-2.5 py-2.5 text-right font-mono text-gray-600">
                      {stoneW.toFixed(4)}
                    </td>

                    {/* Tổng TL (g) */}
                    <td className="px-2.5 py-2.5 text-right font-mono font-bold text-purple-900 bg-purple-50/20">
                      {totalW.toFixed(4)}
                    </td>

                    {/* Đơn giá công */}
                    <td className="px-2.5 py-2.5 text-right text-gray-600 font-medium">
                      {bag.laborCostPerPsc.toLocaleString("vi-VN")} đ
                    </td>

                    {/* Tiền công sau CK */}
                    <td className="px-2.5 py-2.5 text-right font-bold text-[#005a46]">
                      {laborAfter.toLocaleString("vi-VN")} đ
                    </td>

                    <td className="px-2.5 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveBag(bag.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                        title="Bỏ Bag này khỏi DO"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY BAR: 1 HÀNG SUM GỌN GÀNG, TINH TẾ, BỎ THÔNG TIN THỪA */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#005a46] to-[#004737] text-white p-3.5 rounded-xl shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center items-center">
          <div className="bg-white/10 rounded-lg p-2 border border-white/10">
            <span className="block text-[10px] text-emerald-200 uppercase font-semibold">Tổng SL Món</span>
            <span className="text-base font-extrabold text-white font-mono">{totalExportQty} pcs</span>
          </div>

          <div className="bg-white/10 rounded-lg p-2 border border-white/10">
            <span className="block text-[10px] text-amber-300 uppercase font-semibold">Tổng TL Kim Loại</span>
            <span className="text-base font-extrabold text-amber-300 font-mono">{totalGoldWeight.toFixed(4)} g</span>
          </div>

          <div className="bg-white/10 rounded-lg p-2 border border-white/10">
            <span className="block text-[10px] text-emerald-200 uppercase font-semibold">Tổng TL Đá</span>
            <span className="text-base font-extrabold text-white font-mono">{totalStoneWeight.toFixed(4)} g</span>
          </div>

          <div className="bg-white/10 rounded-lg p-2 border border-white/10">
            <span className="block text-[10px] text-purple-300 uppercase font-semibold">Tổng TL</span>
            <span className="text-base font-extrabold text-purple-200 font-mono">{totalWeight.toFixed(4)} g</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-amber-400 text-slate-950 rounded-lg p-2 font-bold shadow-xs">
            <span className="block text-[9px] uppercase tracking-wider text-slate-900 font-extrabold">
              Tiền Công Sau CK ({appliedDiscountPercent}%)
            </span>
            <span className="text-base font-black font-mono">{totalLaborAfterDiscount.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS BAR: 2 NÚT HỦY & XÁC NHẬN */}
      <div className="flex items-center justify-end space-x-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
        <Link
          href="/delivery-orders"
          className="px-5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition border border-gray-300"
        >
          Hủy
        </Link>

        <button
          type="button"
          onClick={() => {
            showToast(`🎉 Đã lập Phiếu Giao Hàng ${doCode} thành công! Trạng thái: Đã phân bổ.`);
            setTimeout(() => {
              router.push("/delivery-orders");
            }, 1200);
          }}
          className="px-6 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center cursor-pointer"
        >
          <Check className="h-4 w-4 mr-1.5" />
          Xác nhận
        </button>
      </div>

      {/* MODAL: CHỌN MÃ SERIES TỪNG PCS CHO LÔ CÓ SERIES */}
      {activeSeriesBagModal && (() => {
        const pickedList = activeSeriesBagModal.pickedSeries || [];
        const goldWPerPsc = activeSeriesBagModal.goldWeightPerPsc || 14.0;
        const stoneWPerPsc = activeSeriesBagModal.stoneWeightPerPsc || 0.25;
        const sumGold = pickedList.length * goldWPerPsc;
        const sumStone = pickedList.length * stoneWPerPsc;
        const sumTotal = sumGold + sumStone;
        const isAllPicked = pickedList.length === activeSeriesBagModal.totalQtyInStock;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-3.5 border border-emerald-200 animate-in zoom-in duration-150 text-xs my-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-emerald-100 text-[#005a46] rounded-xl">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Danh Sách Series - Lô {activeSeriesBagModal.bagCode}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Item: <b>{activeSeriesBagModal.itemCode}</b> - Đang chọn {pickedList.length}/{activeSeriesBagModal.totalQtyInStock} pcs
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSeriesBagModal(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Series Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50 font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-3 py-2 text-center w-8">
                        <input
                          type="checkbox"
                          checked={isAllPicked}
                          onChange={() => {
                            if (isAllPicked) {
                              setBags(prev =>
                                prev.map(b => b.id === activeSeriesBagModal.id ? { ...b, pickedSeries: [], exportQty: 0 } : b)
                              );
                              setActiveSeriesBagModal(prev => ({ ...prev, pickedSeries: [], exportQty: 0 }));
                            } else {
                              const allSeries = Array.from(
                                { length: activeSeriesBagModal.totalQtyInStock },
                                (_, i) => `SR-2608-${activeSeriesBagModal.bagCode.slice(-3)}-0${i + 1}`
                              );
                              setBags(prev =>
                                prev.map(b => b.id === activeSeriesBagModal.id ? { ...b, pickedSeries: allSeries, exportQty: activeSeriesBagModal.totalQtyInStock } : b)
                              );
                              setActiveSeriesBagModal(prev => ({ ...prev, pickedSeries: allSeries, exportQty: activeSeriesBagModal.totalQtyInStock }));
                            }
                          }}
                          className="rounded text-[#005a46] focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="px-3 py-2 text-left">Mã Series</th>
                      <th className="px-3 py-2 text-right font-bold text-amber-900 bg-amber-50/40">TL Vàng (g)</th>
                      <th className="px-3 py-2 text-right text-gray-600">TL Đá (g)</th>
                      <th className="px-3 py-2 text-right font-bold text-purple-900 bg-purple-50/40">Tổng TL (g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {Array.from({ length: activeSeriesBagModal.totalQtyInStock }, (_, i) => {
                      const code = `SR-2608-${activeSeriesBagModal.bagCode.slice(-3)}-0${i + 1}`;
                      const isPicked = pickedList.includes(code);
                      const goldW = activeSeriesBagModal.goldWeightPerPsc || 14.0;
                      const stoneW = activeSeriesBagModal.stoneWeightPerPsc || 0.25;

                      return (
                        <tr
                          key={code}
                          onClick={() => {
                            let nextPicked = [];
                            if (isPicked) {
                              nextPicked = pickedList.filter(c => c !== code);
                            } else {
                              nextPicked = [...pickedList, code];
                            }
                            setBags(prev =>
                              prev.map(b => b.id === activeSeriesBagModal.id ? { ...b, pickedSeries: nextPicked, exportQty: nextPicked.length } : b)
                            );
                            setActiveSeriesBagModal(prev => ({ ...prev, pickedSeries: nextPicked, exportQty: nextPicked.length }));
                          }}
                          className={`hover:bg-emerald-50/50 cursor-pointer transition select-none ${
                            isPicked ? "bg-emerald-50/70 font-medium" : "opacity-70"
                          }`}
                        >
                          <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isPicked}
                              onChange={() => {
                                let nextPicked = [];
                                if (isPicked) {
                                  nextPicked = pickedList.filter(c => c !== code);
                                } else {
                                  nextPicked = [...pickedList, code];
                                }
                                setBags(prev =>
                                  prev.map(b => b.id === activeSeriesBagModal.id ? { ...b, pickedSeries: nextPicked, exportQty: nextPicked.length } : b)
                                );
                                setActiveSeriesBagModal(prev => ({ ...prev, pickedSeries: nextPicked, exportQty: nextPicked.length }));
                              }}
                              className="rounded text-[#005a46] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-2 font-bold font-mono text-[#005a46]">{code}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-amber-900 bg-amber-50/20">{goldW.toFixed(4)}</td>
                          <td className="px-3 py-2 text-right font-mono text-gray-600">{stoneW.toFixed(4)}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-purple-900 bg-purple-50/20">{(goldW + stoneW).toFixed(4)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Realtime Sum Footer */}
              <div className="grid grid-cols-4 gap-2 text-center bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="bg-white p-1.5 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-500 block">Đã chọn</span>
                  <b className="text-[#005a46] font-mono text-xs">{pickedList.length}/{activeSeriesBagModal.totalQtyInStock} pcs</b>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-amber-800 block">Tổng TL Vàng</span>
                  <b className="text-amber-900 font-mono text-xs">{sumGold.toFixed(4)} g</b>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-gray-200">
                  <span className="text-[10px] text-gray-600 block">Tổng TL Đá</span>
                  <b className="text-gray-800 font-mono text-xs">{sumStone.toFixed(4)} g</b>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-purple-200">
                  <span className="text-[10px] text-purple-800 block">Tổng TL</span>
                  <b className="text-purple-900 font-mono text-xs">{sumTotal.toFixed(4)} g</b>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSeriesBagModal(null)}
                  className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg text-xs shadow-xs transition"
                >
                  Xác nhận ({pickedList.length} pcs)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* BASE REQUEST MODAL */}
      {showBaseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-3.5 border border-amber-200 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Gửi Yêu Cầu Phê Duyệt Chiết Khấu (Base Request)
                </h3>
              </div>
              <button
                onClick={() => setShowBaseModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Mức CK Đề Xuất (%)</label>
                <input
                  type="number"
                  value={proposedDiscount}
                  onChange={(e) => setProposedDiscount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Lý do điều chỉnh (gửi BOD duyệt) *</label>
                <textarea
                  rows={3}
                  value={baseReason}
                  onChange={(e) => setBaseReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowBaseModal(false)}
                className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSendBaseRequest}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs flex items-center"
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                Gửi Base Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateDeliveryOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Đang tải màn hình Lập Phiếu Giao Hàng...</div>}>
      <CreateDeliveryOrderContent />
    </Suspense>
  );
}
