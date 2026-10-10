"use client";

import React, { useState, use, useMemo, Fragment } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Warehouse, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  FileText, 
  RotateCcw, 
  ArrowRight,
  Info,
  Copy,
  PenLine,
  Ban,
  BadgePercent,
  Download,
  ShieldAlert,
  ImageIcon,
  Trash2,
  ExternalLink,
  Eye,
  Layers,
  PackageCheck,
  Zap,
  Boxes,
  Split,
  X,
  Crown,
  CornerDownRight,
  Tag,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { getOrderById, ALLOWED_SYNC_STATUSES, INITIAL_ORDERS } from "@/data/ordersData";
import { findMatchingWarehouseItems, ROUTING_FG_FIXED } from "@/data/warehouseStockData";
import WarehouseSyncPopup from "@/components/orders/WarehouseSyncPopup";
import SetProductionBagModal from "@/components/orders/SetProductionBagModal";

export default function OrderDetailPage({ params }) {
  // Unwrap params trong Next.js 15/16
  const resolvedParams = use(params);
  // Mặc định lấy đơn ID 11 (SO2608011 - Đơn hàng trong ảnh của Chị đẹp)
  const orderId = resolvedParams?.id || "11";

  const initialOrder = useMemo(() => {
    return getOrderById(orderId) || INITIAL_ORDERS[0];
  }, [orderId]);

  // State quản lý đơn hàng
  const [order, setOrder] = useState(initialOrder);

  // State quản lý Modal Thẻ Bag KHSX cho Sản phẩm Bộ (1 Bag = 1 Bộ)
  const [isBagModalOpen, setIsBagModalOpen] = useState(false);
  const [selectedSetItem, setSelectedSetItem] = useState(null);

  // State quản lý Thu gọn / Mở rộng nhóm Bộ (Mặc định mở ra 4 món)
  const [expandedSets, setExpandedSets] = useState({ 1: true });

  const toggleSetExpand = (stt) => {
    setExpandedSets((prev) => ({
      ...prev,
      [stt]: prev[stt] === undefined ? false : !prev[stt]
    }));
  };

  // Kiểm tra 3 trạng thái hợp lệ để đồng bộ tồn kho: Chờ Kỹ thuật, Đủ thông tin KT, Chờ xác nhận (Chờ duyệt)
  const isSyncAllowed = ALLOWED_SYNC_STATUSES.includes(order.status);

  // Quét kho tìm các mặt hàng khớp 100% với đơn hàng này
  const matchedStockList = useMemo(() => {
    if (!order.items) return [];
    let allMatches = [];
    order.items.forEach((item) => {
      const matches = findMatchingWarehouseItems({
        itemCode: item.itemCode,
        goldType: order.gold,
        size: item.size,
        stoneColor: item.stoneColor
      });
      allMatches = [...allMatches, ...matches];
    });
    return allMatches;
  }, [order]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState("");
  // State quản lý Modal xem Kế hoạch sản xuất 2 luồng (SX Mới & Kho TP)
  const [isProductionPlanModalOpen, setIsProductionPlanModalOpen] = useState(false);
  const [selectedPlanItem, setSelectedPlanItem] = useState(null);

  // Thao tác bấm nút Đồng bộ
  const handleTriggerSync = () => {
    if (!isSyncAllowed) return;

    if (matchedStockList.length > 0) {
      setIsPopupOpen(true);
    } else {
      setSyncToastMessage("Không tìm thấy sản phẩm trong Kho Thành Phẩm khớp 100% với đơn hàng.");
      setTimeout(() => setSyncToastMessage(""), 4000);
    }
  };

  // Xác nhận pick chọn từ Popup kèm thông tin chi tiết Cấp Lô
  const handleConfirmPick = (pickQuantities, pickedLotsSummary = []) => {
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((item) => {
        // Lấy tất cả các lô đã pick cho item này
        const lotsForItem = pickedLotsSummary.filter(
          (l) => l.itemCode?.toLowerCase() === item.itemCode?.toLowerCase()
        );
        const totalPicked = lotsForItem.reduce((sum, l) => sum + (Number(l.pickedQty) || 0), 0);

        if (totalPicked > 0) {
          const newProd = Math.max(0, item.qty - totalPicked);
          return {
            ...item,
            sourceType: newProd === 0 ? "WAREHOUSE_REWORK" : "SPLIT_ALLOCATION",
            qtyFromStock: totalPicked,
            qtyNewProduction: newProd,
            pickedLots: lotsForItem,
            fgRouting: ROUTING_FG_FIXED,
            fgRoutingType: "FG",
            routingStatus: newProd === 0 ? "Routing Cố định (FG - 2 CĐ)" : "2 Luồng: SX Mới + Kho TP (FG)",
            stoneHoldStatus: "PARTIALLY_RELEASED",
            note: item.note && !item.note.startsWith("Đã pick") ? item.note : "---"
          };
        }
        return item;
      });

      return {
        ...prevOrder,
        items: updatedItems
      };
    });

    setIsPopupOpen(false);
    setSyncToastMessage("Đã pick lô kho thành phẩm và gán Routing FG cố định (2 công đoạn: Serve FG → Packing Out) thành công!");
    setTimeout(() => setSyncToastMessage(""), 5000);
  };

  // Hủy đồng bộ trên dòng hàng
  const handleRevertItem = (stt) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((it) => {
        if (it.stt === stt) {
          return {
            ...it,
            sourceType: "NEW_PRODUCTION",
            qtyFromStock: 0,
            qtyNewProduction: it.qty,
            assignedStock: null,
            pickedLots: [],
            fgRouting: null,
            routingStatus: "Đủ BOM/Routing",
            stoneHoldStatus: "HELD_FOR_PRODUCTION",
            note: "---"
          };
        }
        return it;
      })
    }));
  };

  // Xóa dòng sản phẩm khỏi đơn hàng (Hỗ trợ nút action Xóa của Chị đẹp)
  const handleDeleteItem = (stt) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.stt !== stt)
    }));
    setSyncToastMessage(`Đã xóa dòng sản phẩm STT ${stt} khỏi đơn hàng.`);
    setTimeout(() => setSyncToastMessage(""), 3000);
  };

  const totalStockAvailable = matchedStockList.reduce((acc, s) => acc + s.availableQty, 0);

  // Helper render thumbnail ảnh sản phẩm thật 3D
  const renderThumb = (imgSrc, altText = "") => {
    if (imgSrc && imgSrc.startsWith("/")) {
      return (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs mx-auto flex items-center justify-center">
          <img src={imgSrc} alt={altText} className="w-full h-full object-cover rounded-md" />
        </div>
      );
    }
    if (imgSrc === "earrings") {
      return (
        <div className="w-10 h-10 rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center mx-auto text-base shadow-2xs">
          <span>✨</span>
        </div>
      );
    }
    if (imgSrc === "ring") {
      return (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs mx-auto flex items-center justify-center">
          <img src="/images/products/ring-solitaire.jpg" alt={altText} className="w-full h-full object-cover rounded-md" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
        <ImageIcon className="h-5 w-5 text-slate-400" />
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-24 max-w-[1440px] mx-auto px-4 sm:px-6 text-slate-800">
      
      {/* Toast thông báo */}
      {syncToastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005a46] text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
          <span>{syncToastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Breadcrumbs & Nhóm Nút Tác Vụ Chuẩn ERP */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Breadcrumb & Bộ Chuyển Nhanh Đơn Hàng Mẫu */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-800 flex items-center">
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
              Danh sách đơn hàng
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-900">Chi tiết đơn hàng {order.code}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 px-1.5 uppercase">Đơn mẫu:</span>
            <Link
              href="/orders/11"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                String(orderId) === "11"
                  ? "bg-[#005a46] text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              SO2608011
            </Link>
            <Link
              href="/orders/12"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                String(orderId) === "12"
                  ? "bg-[#005a46] text-white shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>SO2608012</span>
            </Link>
          </div>
        </div>

        {/* Hàng nút chức năng góc trên bên phải */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
            <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            Xuất báo giá
          </button>
          <button className="flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#005a46] hover:bg-[#004737] shadow-2xs">
            <PenLine className="h-3.5 w-3.5 mr-1.5" />
            Chỉnh sửa
          </button>
          <button className="flex items-center px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
            <BadgePercent className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            Yêu cầu đổi chiết khấu
          </button>
          <button className="flex items-center px-3 py-1.5 border border-rose-200 rounded-lg bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 shadow-2xs">
            <Ban className="h-3.5 w-3.5 mr-1.5 text-rose-600" />
            Hủy đơn
          </button>
        </div>
      </div>

      {/* CARD THÔNG TIN CHUNG: ĐẦY ĐỦ 100% CÁC TRƯỜNG NHƯ ẢNH CHỤP */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        
        {/* Header khối thông tin đơn hàng (Đã bê cụm Người tạo, Ngày tạo, Nút Đồng bộ tồn kho TP xuống đây) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-[#005a46]" />
            </div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-black text-slate-900 font-mono tracking-tight">{order.code}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-yellow-300 text-yellow-800 bg-yellow-50">
                {order.status}
              </span>
            </div>
          </div>

          {/* Cụm Người tạo, Ngày tạo, Nút Đồng bộ tồn kho TP và Nút In */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right text-slate-500 text-[11px] leading-tight">
              <div>Người tạo: <strong className="text-slate-800">{order.creator || "[04144] - Nguyễn Thị Mỹ Dung"}</strong></div>
              <div>Ngày tạo: <span className="font-medium text-slate-700">{order.createdAt || "04/10/2026 06:38"}</span></div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Nút Đồng bộ tồn kho TP */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={!isSyncAllowed}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-2 transition-all cursor-pointer ${
                    isSyncAllowed
                      ? "bg-[#005a46] hover:bg-[#004737] text-white ring-2 ring-emerald-400/40"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Warehouse className="h-4 w-4" />
                  <span>Đồng bộ tồn kho TP</span>
                  {isSyncAllowed && matchedStockList.length > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {matchedStockList.length}
                    </span>
                  )}
                </button>

                {!isSyncAllowed && (
                  <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-30">
                    <span className="font-bold text-amber-400 flex items-center mb-0.5">
                      <ShieldAlert className="h-3 w-3 mr-1" /> Không thể đồng bộ
                    </span>
                    <span>Chỉ áp dụng khi đơn hàng ở trạng thái: <strong>Chờ kỹ thuật, Đủ thông tin kỹ thuật, Chờ duyệt</strong>.</span>
                  </div>
                )}
              </div>

              <button className="p-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer" title="In đơn hàng">
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tiêu đề THÔNG TIN CHUNG dời xuống theo chỉ đạo của Chị đẹp */}
        <div>
          <span className="text-xs font-bold text-[#005a46] uppercase tracking-wider block">
            Thông tin chung
          </span>
        </div>

        {/* LƯỚI THÔNG TIN CHI TIẾT (Đã tinh gọn, loại bỏ thông tin thừa và chuẩn hóa theo Chị đẹp) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3.5 text-xs">
          
          {/* CỘT 1 */}
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-[11px] block">Mã khách hàng:</span>
              <span className="font-mono font-bold text-slate-800">{order.customerCode || "2037105"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Đội/nhóm phụ trách:</span>
              <span className="font-semibold text-slate-800">{order.team || "TEAM 3_B2B2C_HCM & Miền Đông"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Chất liệu đá:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block font-mono">1</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block flex items-center">
                Chiết khấu: <Info className="h-3 w-3 ml-1 text-slate-400" />
              </span>
              <span className="font-bold text-slate-900">{order.discount || "0%"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Tổng số lượng:</span>
              <span className="font-mono font-black text-slate-900 text-sm">{order.qty} SP</span>
            </div>
          </div>

          {/* CỘT 2 */}
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-[11px] block">Tên khách hàng:</span>
              <span className="font-bold text-slate-900 uppercase">{order.customer || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Tuổi vàng:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-mono">
                {order.gold || "61Y"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Loại đơn hàng:</span>
              <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                {order.type || "Đơn hàng Gia công"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Trọng lượng:</span>
              <span className="font-mono font-bold text-slate-800">{order.weight || "408.0000L"}</span>
              <span className="text-[10px] text-slate-400 ml-1">(Lượng - L)</span>
            </div>
          </div>

          {/* CỘT 3 */}
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-[11px] block">Trạng thái khách hàng:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">{order.customerStatus || "Hiện tại"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Chất liệu:</span>
              <span className="font-semibold text-slate-800">{order.material || "Vàng"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Ngày đặt hàng:</span>
              <span className="font-semibold text-slate-800">{order.date || "04/10/2026"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Tổng tiền tạm tính:</span>
              <span className="font-mono font-bold text-slate-900">{order.tempTotal || "130.000.000"} đ</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Giá sau chiết khấu:</span>
              <span className="font-mono font-black text-rose-700">
                {order.discount === "0%" ? (order.tempTotal || "130.000.000") : (order.finalPrice || order.tempTotal || "130.000.000")} đ
              </span>
            </div>
          </div>

          {/* CỘT 4 */}
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-[11px] block">Trạng thái giữ chỗ đá:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                {order.stoneHoldStatus || "Đã hold đá (100%)"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Địa chỉ giao hàng:</span>
              <span className="font-medium text-slate-800">{order.deliveryAddress || "123 Nguyễn Ái Quốc"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Ghi chú đơn hàng:</span>
              <span className="text-slate-700 italic block">{order.note && order.note !== "--" ? order.note : "--"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* KHỐI BANNER GỢI Ý PHÁT HIỆN TỒN KHO THÀNH PHẨM (CHUẨN FORM TRONG ẢNH) */}
      {isSyncAllowed && matchedStockList.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 flex items-center">
                Phát Hiện Tồn Kho Thành Phẩm Chờ Xử Lý Khớp 100% Thuộc Tính!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Có sẵn <strong>{totalStockAvailable} sản phẩm</strong> trong kho có thể tận dụng để giao ngay cho khách hàng.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="px-5 py-2.5 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 shrink-0 transition-colors cursor-pointer"
          >
            <span>Nhấn mở popup xem chi tiết & pick chọn</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* BẢNG DANH SÁCH SẢN PHẨM TRONG ĐƠN HÀNG (ĐẦY ĐỦ 12 CỘT CHUẨN FORM THỰC TẾ) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#005a46] uppercase tracking-wider">
            Danh Sách Sản Phẩm Trong Đơn Hàng ({order.items?.length || 0} Dòng)
          </h3>
          <span className="text-xs text-slate-500">
            Trạng thái đơn: <strong className="text-slate-800">{order.status}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[11px] tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-3 py-3 text-center w-12">STT</th>
                <th className="px-3 py-3 text-center w-16">Hình ảnh</th>
                <th className="px-4 py-3">Mã Item</th>
                <th className="px-3 py-3">Mã Drawing</th>
                <th className="px-3 py-3 text-center">Màu xi</th>
                <th className="px-3 py-3 text-center">Màu đá</th>
                <th className="px-3 py-3 text-center">Ni/Size</th>
                <th className="px-3 py-3 text-center font-bold">Số lượng</th>
                <th className="px-3 py-3 text-center">Yêu cầu thay đổi</th>
                <th className="px-3 py-3 text-right">Trọng lượng (L)</th>
                <th className="px-4 py-3 text-right">Đơn giá</th>
                <th className="px-3 py-3 text-center">Ghi chú</th>
                <th className="px-3 py-3 text-center whitespace-nowrap min-w-[120px]">Trạng thái BOM/Routing</th>
                <th className="px-3 py-3 text-center whitespace-nowrap min-w-[130px]">SL Pick Kho TP</th>
                <th className="px-3 py-3 text-center w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {order.items?.map((item) => {
                const isSynced = item.sourceType === "WAREHOUSE_REWORK" || item.sourceType === "SPLIT_ALLOCATION";

                // TRƯỜNG HỢP 1: SẢN PHẨM BỘ 4 MÓN (RULE: 1 BAG = 1 BỘ, ĐÓNG CHUNG HỘP)
                if (item.isSet) {
                  return (
                    <React.Fragment key={`set-${item.stt}`}>
                      {/* DÒNG CHA: SẢN PHẨM BỘ */}
                      <tr className="bg-emerald-50/70 border-t-2 border-emerald-400 font-bold hover:bg-emerald-50 transition-colors">
                        {/* STT kèm nút Thu gọn / Mở rộng Bộ */}
                        <td className="px-3 py-3.5 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => toggleSetExpand(item.stt)}
                              className="p-1 rounded-md text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title={expandedSets[item.stt] !== false ? "Thu gọn 4 món trong bộ" : "Mở rộng 4 món trong bộ"}
                            >
                              {expandedSets[item.stt] !== false ? (
                                <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                              ) : (
                                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                              )}
                            </button>
                            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black uppercase shadow-2xs">
                              {item.stt}
                            </span>
                          </div>
                        </td>

                        {/* Hình ảnh Bộ (Ảnh Render thật 3D) */}
                        <td className="px-3 py-3.5 text-center">
                          {renderThumb(item.image, item.setName)}
                        </td>

                        {/* Mã Item & Tên Bộ */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            <div className="font-mono font-bold text-slate-900 text-xs select-all">
                              {item.itemCode}
                            </div>
                            <div className="text-xs text-slate-600 font-sans">
                              {item.setName || item.name}
                            </div>
                          </div>
                        </td>

                        {/* Mã Drawing */}
                        <td className="px-3 py-3.5 font-mono text-slate-800 font-bold">
                          {item.drawingCode}
                        </td>

                        {/* Màu xi */}
                        <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-700">
                          {item.platingColor || "Y0"}
                        </td>

                        {/* Màu đá */}
                        <td className="px-3 py-3.5 text-center text-slate-600 font-semibold">
                          {item.stoneColor || "Trắng CZ"}
                        </td>

                        {/* Ni/Size */}
                        <td className="px-3 py-3.5 text-center font-bold text-slate-400">
                          {item.size || "--"}
                        </td>

                        {/* Số lượng Bộ */}
                        <td className="px-3 py-3.5 text-center">
                          <div className="font-mono font-black text-slate-950 text-sm">
                            {item.qty}
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 block">
                            Bộ (= {item.qty} Bag)
                          </span>
                        </td>

                        {/* Yêu cầu thay đổi */}
                        <td className="px-3 py-3.5 text-center text-slate-600 font-medium">
                          {item.changeReq || "A00"}
                        </td>

                        {/* Trọng lượng */}
                        <td className="px-3 py-3.5 text-right font-mono text-slate-900 font-bold">
                          {item.weight}
                        </td>

                        {/* Đơn giá bộ */}
                        <td className="px-4 py-3.5 text-right">
                          <span className="font-mono font-black text-fuchsia-900 bg-pink-50 px-2 py-1 rounded border border-pink-200 inline-block shadow-2xs">
                            {(item.unitPrice || 0).toLocaleString("vi-VN")}
                          </span>
                        </td>

                        {/* Ghi chú */}
                        <td className="px-3 py-3.5 text-center text-slate-400 text-xs">
                          {item.note || "--"}
                        </td>

                        {/* Trạng thái BOM/Routing & Nút Thẻ Bag */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSetItem(item);
                              setIsBagModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 hover:bg-emerald-200 text-[#005a46] border border-emerald-300 inline-flex items-center space-x-1 cursor-pointer transition-all shadow-2xs hover:scale-105"
                            title="Bấm để xem Thẻ Bag KHSX (1 Bag = 1 Bộ)"
                          >
                            <Boxes className="h-3 w-3 shrink-0 text-[#005a46]" />
                            <span>1 Bag = 1 Bộ ({item.bagCode})</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-70" />
                          </button>
                        </td>

                        {/* SL Pick Kho TP */}
                        <td className="px-3 py-3.5 text-center">
                          <span className="text-slate-300 font-mono text-xs">0</span>
                        </td>

                        {/* Thao tác */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSetItem(item);
                                setIsBagModalOpen(true);
                              }}
                              className="p-1.5 text-[#005a46] hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                              title="Xem chi tiết Thẻ Bag KHSX"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.stt)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa bộ sản phẩm khỏi đơn"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* CÁC DÒNG MÓN CON TRONG BỘ (4 MÓN: VÒNG TAY, DÂY CHUYỀN, NHẪN, BÔNG TAI) - HỖ TRỢ THU GỌN */}
                      {expandedSets[item.stt] !== false && item.components?.map((comp) => (
                        <tr 
                          key={`comp-${comp.stt}`} 
                          className="bg-white hover:bg-slate-50/80 transition-colors border-l-4 border-l-emerald-500"
                        >
                          {/* STT Món con */}
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-400 text-xs pl-2">
                            {comp.stt}
                          </td>

                          {/* Hình ảnh món con (Ảnh Render thật 3D) */}
                          <td className="px-3 py-3 text-center">
                            {renderThumb(comp.image || comp.componentType, comp.name)}
                          </td>

                          {/* Mã Item 30 ký tự (Thụt lề với mũi tên CornerDownRight) */}
                          <td className="px-4 py-3">
                            <div className="pl-2 space-y-0.5">
                              <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-slate-900">
                                <CornerDownRight className="h-3.5 w-3.5 text-emerald-600 shrink-0 inline" />
                                <span>{comp.itemCode}</span>
                              </div>
                              <div className="text-xs text-slate-600 pl-5 font-sans">
                                {comp.name}
                              </div>
                            </div>
                          </td>

                          {/* Mã Drawing */}
                          <td className="px-3 py-3 font-mono text-slate-700 font-semibold">
                            {comp.drawingCode}
                          </td>

                          {/* Màu xi */}
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-600">
                            {comp.platingColor || item.platingColor || "Y0"}
                          </td>

                          {/* Màu đá */}
                          <td className="px-3 py-3 text-center text-slate-500">
                            {comp.stoneColor || item.stoneColor || "Trắng"}
                          </td>

                          {/* Ni/Size */}
                          <td className="px-3 py-3 text-center font-bold text-[#005a46]">
                            {comp.size}
                          </td>

                          {/* Số lượng */}
                          <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                            {comp.qty}
                          </td>

                          {/* Yêu cầu thay đổi */}
                          <td className="px-3 py-3 text-center text-slate-500">
                            A00
                          </td>

                          {/* Trọng lượng */}
                          <td className="px-3 py-3 text-right font-mono text-slate-700 font-medium">
                            {comp.weight}
                          </td>

                          {/* Đơn giá */}
                          <td className="px-4 py-3 text-right">
                            <span className="font-mono text-slate-600 text-xs">
                              {(comp.unitPrice || 0).toLocaleString("vi-VN")}
                            </span>
                          </td>

                          {/* Ghi chú */}
                          <td className="px-3 py-3 text-center text-slate-400 text-xs">
                            {comp.packaging || "--"}
                          </td>

                          {/* Trạng thái BOM/Routing */}
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                              Chung Bag: {item.bagCode}
                            </span>
                          </td>

                          {/* SL Pick Kho TP */}
                          <td className="px-3 py-3 text-center">
                            <span className="text-slate-300 font-mono text-xs">0</span>
                          </td>

                          {/* Thao tác */}
                          <td className="px-3 py-3 text-center text-slate-300 text-xs">
                            —
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                }

                // TRƯỜNG HỢP 2: SẢN PHẨM MUA LẺ (HOẶC MUA LẺ THEO CHỦNG LOẠI TỪ MẪU BỘ)
                return (
                  <tr key={item.stt} className={`hover:bg-slate-50 transition-colors ${isSynced ? "bg-emerald-50/25" : ""}`}>
                    
                    {/* STT */}
                    <td className="px-3 py-3.5 text-center font-bold text-slate-500">{item.stt}</td>

                    {/* Hình ảnh (Ảnh Render thật 3D) */}
                    <td className="px-3 py-3.5 text-center">
                      {renderThumb(item.image, item.name)}
                    </td>

                    {/* Mã Item */}
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs select-all">
                        {item.itemCode?.replace(/\//g, "")}
                      </div>
                      <div className="text-xs text-slate-600 font-sans mt-0.5">
                        {item.name}
                      </div>
                    </td>

                    {/* Mã Drawing */}
                    <td className="px-3 py-3.5 font-mono text-slate-700 font-semibold">
                      {item.drawingCode?.replace(/\//g, "")}
                    </td>

                    {/* Màu xi */}
                    <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-700">
                      {item.platingColor || "Y0"}
                    </td>

                    {/* Màu đá */}
                    <td className="px-3 py-3.5 text-center text-slate-400">
                      {item.stoneColor || "---"}
                    </td>

                    {/* Ni/Size */}
                    <td className="px-3 py-3.5 text-center font-bold text-slate-800">
                      {item.size || "--"}
                    </td>

                    {/* Số lượng */}
                    <td className="px-3 py-3.5 text-center font-mono font-black text-slate-900 text-sm">
                      {item.qty}
                    </td>

                    {/* Yêu cầu thay đổi */}
                    <td className="px-3 py-3.5 text-center text-slate-600 font-medium">
                      {item.changeReq || "A00"}
                    </td>

                    {/* Trọng lượng */}
                    <td className="px-3 py-3.5 text-right font-mono text-slate-800 font-semibold">
                      {item.weight || "0.4500"}
                    </td>

                    {/* Đơn giá */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono font-black text-fuchsia-900 bg-pink-50 px-2 py-1 rounded border border-pink-200 inline-block">
                        {(item.unitPrice || 195000).toLocaleString("vi-VN")}
                      </span>
                    </td>

                    {/* Ghi chú */}
                    <td className="px-3 py-3.5 text-center text-slate-400 text-xs">
                      {item.note || "--"}
                    </td>

                    {/* Trạng thái BOM/Routing (Tách 2 luồng SX Mới & Kho TP Type: FG) */}
                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {item.qtyFromStock > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlanItem(item);
                            setIsProductionPlanModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 hover:bg-emerald-200 text-[#005a46] border border-emerald-300 inline-flex items-center space-x-1 cursor-pointer transition-all shadow-2xs hover:scale-105"
                          title="Bấm để xem chi tiết Kế hoạch sản xuất 2 Luồng (SX Mới & Kho TP)"
                        >
                          <Boxes className="h-3 w-3 shrink-0 text-[#005a46]" />
                          <span>{item.routingStatus || "2 Luồng: SX Mới + Kho TP (FG)"}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-70" />
                        </button>
                      ) : item.isRetailFromSet ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 inline-block">
                          1 Bag/Món lẻ riêng
                        </span>
                      ) : item.routingStatus === "Chờ Routing mới" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                          Chờ Routing mới
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 inline-block">
                          {item.routingStatus || "Đủ BOM/Routing"}
                        </span>
                      )}
                    </td>

                    {/* SL Pick Kho TP: Hiển thị tinh gọn số lượng đã pick chọn từ kho */}
                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {item.qtyFromStock > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlanItem(item);
                            setIsProductionPlanModalOpen(true);
                          }}
                          className="font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md text-xs inline-flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                          title="Bấm xem phân bổ các lô & kế hoạch sản xuất"
                        >
                          <span>{item.qtyFromStock} / {item.qty}</span>
                          <Eye className="h-3 w-3 text-emerald-600" />
                        </button>
                      ) : (
                        <span className="text-slate-300 font-mono text-xs">0</span>
                      )}
                    </td>

                    {/* Thao tác: Gồm nút Hủy pick kho (nếu dòng có pick) và nút Xóa dòng */}
                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        {item.qtyFromStock > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRevertItem(item.stt)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hủy pick kho dòng này (chuyển về SX mới 100%)"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.stt)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa dòng sản phẩm khỏi đơn hàng"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP CHI TIẾT MẶT HÀNG TRONG KHO & PICK CHỌN THEO CẤP LÔ */}
      <WarehouseSyncPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        order={order}
        matchedStockList={matchedStockList}
        onConfirmPick={handleConfirmPick}
      />

      {/* MODAL CHI TIẾT KẾ HOẠCH SẢN XUẤT 2 LUỒNG (SX MỚI & KHO TP - TYPE: FG) */}
      {isProductionPlanModalOpen && selectedPlanItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-[#005a46] via-[#004737] to-[#013328] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <Split className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>Kế Hoạch Sản Xuất & Phân Bổ 2 Luồng</span>
                    <span className="text-[11px] bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                      Routing Type: New vs FG
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    Đơn hàng: <strong className="text-white font-mono">{order.code}</strong> • Item: <strong className="text-white font-mono">{selectedPlanItem.itemCode}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductionPlanModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nội dung Modal */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Thẻ tóm tắt thông số sản phẩm */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tên sản phẩm</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedPlanItem.itemName || "Nhẫn Nữ"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chất liệu & Tuổi vàng</span>
                  <span className="font-bold text-slate-800">Vàng - {order.gold}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ni tay / Size</span>
                  <span className="font-bold text-slate-800">{selectedPlanItem.size || "---"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tổng số lượng đặt</span>
                  <span className="font-black text-slate-900 text-sm font-mono">{selectedPlanItem.qty} món</span>
                </div>
              </div>

              {/* 2 LUỒNG SẢN XUẤT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* LUỒNG 1: SẢN XUẤT MỚI (NEW PRODUCTION) */}
                <div className="border border-sky-200 bg-sky-50/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-sky-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-sky-950 text-sm">Luồng Sản Xuất Mới</h4>
                        <span className="text-[10px] text-sky-700 font-mono">Routing Type: NEW_PROD</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-300 font-mono">
                      {selectedPlanItem.qtyNewProduction || 0} món
                    </span>
                  </div>

                  {selectedPlanItem.qtyNewProduction > 0 ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Quy trình Routing áp dụng:</span>
                        <div className="mt-1 p-2.5 bg-white rounded-lg border border-sky-200 font-medium text-slate-800 leading-relaxed">
                          <strong>Full Routing Sản Xuất Tiêu Chuẩn:</strong>
                          <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-1">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">1. Đúc</span> → 
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">2. Nguội</span> → 
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">3. Gắn đá</span> → 
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">4. Đánh bóng</span> → 
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">5. Xi mạ</span> → 
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">6. KCS Out</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-sky-200 space-y-1">
                        <span className="text-[11px] font-bold text-sky-900 block">Kế hoạch vật tư & Cấp phát:</span>
                        <p className="text-[11px] text-slate-600">
                          • Cấp mới vàng định mức: <strong>{((parseFloat(selectedPlanItem.weight) || 0.5) * selectedPlanItem.qtyNewProduction).toFixed(4)} L</strong>
                        </p>
                        <p className="text-[11px] text-slate-600">
                          • Cấp mới đá theo BOM: <strong>{selectedPlanItem.qtyNewProduction} bộ đá</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/70 rounded-lg border border-sky-200 text-xs text-sky-800 text-center italic">
                      Toàn bộ số lượng đơn hàng (100%) được lấy từ Kho Thành Phẩm. Không phát sinh lệnh đúc & sản xuất mới.
                    </div>
                  )}
                </div>

                {/* LUỒNG 2: KHO THÀNH PHẨM (ROUTING CỐ ĐỊNH - TYPE: FG) */}
                <div className="border border-emerald-300 bg-emerald-50/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-[#005a46] text-white flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-sm">Luồng Kho Thành Phẩm</h4>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">Routing Cố Định (Type: FG)</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                      {selectedPlanItem.qtyFromStock || 0} món
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Routing cố định (Hard 2 công đoạn):</span>
                      <div className="mt-1 p-2.5 bg-white rounded-lg border border-emerald-200 space-y-2">
                        <div className="flex items-start space-x-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#005a46] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                          <div>
                            <strong className="text-slate-900 text-xs">STG-SERVE-FG: Serve FG (Phục vụ kho TP)</strong>
                            <p className="text-[11px] text-slate-500">Điều chuyển hàng từ két kho TP, kiểm tra ngoại quan & ni tay (Thời gian: 0.5 ngày)</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#005a46] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                          <div>
                            <strong className="text-slate-900 text-xs">STG-PACKING-OUT: Packing Out (Đóng gói xuất kho)</strong>
                            <p className="text-[11px] text-slate-500">Hoàn thiện đóng gói, dán tem vỉ theo quy cách đơn mới (Thời gian: 0.5 ngày)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chi tiết các Lô hàng đã pick */}
                    {selectedPlanItem.pickedLots && selectedPlanItem.pickedLots.length > 0 && (
                      <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-[#005a46] block">
                          Chi tiết các Lô hàng đã gán ({selectedPlanItem.pickedLots.length} lô):
                        </span>
                        <div className="space-y-1">
                          {selectedPlanItem.pickedLots.map((lot, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px]">
                              <div>
                                <span className="font-mono font-black text-slate-900 text-xs">{lot.lotCode}</span>
                                {lot.bagCode && (
                                  <span className="text-slate-500 ml-1 font-mono text-[10px]">[{lot.bagCode}]</span>
                                )}
                                <span className="text-slate-500 ml-1.5 font-medium">(SO cũ: {lot.oldOrderCode})</span>
                                {lot.location && (
                                  <span className="text-slate-400 ml-1.5 text-[10px] block sm:inline">• {lot.location.split("(")[0].trim()}</span>
                                )}
                              </div>
                              <div className="font-mono font-black text-emerald-800 text-xs bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                                {lot.pickedQty} món
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 bg-emerald-100/60 rounded-lg text-[11px] text-emerald-950 flex items-center space-x-1.5">
                      <PackageCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Không cấp mới vàng & đá. Tự động giải phóng đá giữ chỗ về kho phụ liệu.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsProductionPlanModalOpen(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL THẺ BAG KHSX & ĐÓNG GÓI BỘ (1 BAG = 1 BỘ) */}
      <SetProductionBagModal
        isOpen={isBagModalOpen}
        onClose={() => setIsBagModalOpen(false)}
        setItem={selectedSetItem}
      />
    </div>
  );
}
