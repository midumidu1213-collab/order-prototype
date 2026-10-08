"use client";

import { useState, use, useMemo } from "react";
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
  Trash2
} from "lucide-react";
import { getOrderById, ALLOWED_SYNC_STATUSES, INITIAL_ORDERS } from "@/data/ordersData";
import { findMatchingWarehouseItems } from "@/data/warehouseStockData";
import WarehouseSyncPopup from "@/components/orders/WarehouseSyncPopup";

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

  // Xác nhận pick chọn từ Popup
  const handleConfirmPick = (pickQuantities) => {
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((item) => {
        let pickedForThisItem = 0;
        let matchedStockItem = null;

        matchedStockList.forEach((stock) => {
          if (stock.itemCode?.toLowerCase() === item.itemCode?.toLowerCase()) {
            const picked = pickQuantities[stock.id] || 0;
            if (picked > 0) {
              pickedForThisItem += picked;
              matchedStockItem = stock;
            }
          }
        });

        if (pickedForThisItem > 0 && matchedStockItem) {
          const newProd = Math.max(0, item.qty - pickedForThisItem);
          return {
            ...item,
            sourceType: newProd === 0 ? "WAREHOUSE_REWORK" : "SPLIT_ALLOCATION",
            qtyFromStock: pickedForThisItem,
            qtyNewProduction: newProd,
            assignedStock: matchedStockItem,
            stoneHoldStatus: "PARTIALLY_RELEASED",
            // Giữ nguyên ghi chú riêng của sản phẩm, không chèn text pick kho theo chỉ đạo của Chị đẹp
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
    setSyncToastMessage("Đã đồng bộ và pick chọn thành công sản phẩm từ Kho Thành Phẩm vào đơn hàng!");
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-800 flex items-center">
            <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
            Danh sách đơn hàng
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-900">Chi tiết đơn hàng {order.code}</span>
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
              <span className="text-slate-700 italic block">{order.note || "Đơn thoả thuận 2/10 (item x 100pcs = 500pcs)"}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phân hệ xử lý</span>
              <span className="text-xs font-bold text-[#005a46] block">Quản lý Sản phẩm (QLSP)</span>
              <span className="text-[11px] text-slate-500 block leading-tight">Đang kiểm tra & cập nhật Routing làm mới</span>
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
                const isItemInStock = matchedStockList.some(
                  (s) => s.itemCode?.toLowerCase() === item.itemCode?.toLowerCase()
                );

                return (
                  <tr key={item.stt} className={`hover:bg-slate-50 transition-colors ${isSynced ? "bg-emerald-50/25" : ""}`}>
                    
                    {/* STT */}
                    <td className="px-3 py-3.5 text-center font-bold text-slate-500">{item.stt}</td>

                    {/* Hình ảnh */}
                    <td className="px-3 py-3.5 text-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                      </div>
                    </td>

                    {/* Mã Item */}
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {item.itemCode?.replace(/\//g, "")}
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
                      {item.size || "---"}
                    </td>

                    {/* Số lượng */}
                    <td className="px-3 py-3.5 text-center font-mono font-black text-slate-900 text-sm">
                      {item.qty}
                    </td>

                    {/* Yêu cầu thay đổi */}
                    <td className="px-3 py-3.5 text-center text-slate-600 font-medium">
                      {item.changeReq || "A00"}
                    </td>

                    {/* Trọng lượng (Đơn vị tính là Lượng - L) */}
                    <td className="px-3 py-3.5 text-right font-mono text-slate-800 font-semibold">
                      {item.weight || "0.5000L"}
                    </td>

                    {/* Đơn giá (Background hồng chữ tím chuẩn như ảnh của Chị đẹp) */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono font-black text-fuchsia-900 bg-pink-50 px-2 py-1 rounded border border-pink-200 inline-block">
                        {(item.unitPrice || 195000).toLocaleString("vi-VN")}
                      </span>
                    </td>

                    {/* Ghi chú */}
                    <td className="px-3 py-3.5 text-center text-slate-400">
                      {item.note || "---"}
                    </td>

                    {/* Trạng thái BOM/Routing (Thêm mới theo chỉ đạo của Chị đẹp) */}
                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {item.routingStatus === "Chờ Routing mới" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                          Chờ Routing mới
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
                          {item.routingStatus || "Đủ BOM/Routing"}
                        </span>
                      )}
                    </td>

                    {/* SL Pick Kho TP: Hiển thị tinh gọn số lượng đã pick chọn từ kho, loại bỏ các nút thừa lộn xộn */}
                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {item.qtyFromStock > 0 ? (
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs inline-block">
                          {item.qtyFromStock} / {item.qty}
                        </span>
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
                            title="Hủy pick kho dòng này"
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

      {/* POPUP CHI TIẾT MẶT HÀNG TRONG KHO & PICK CHỌN (CHUẨN 5 CỘT CỦA CHỊ ĐẸP) */}
      <WarehouseSyncPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        order={order}
        matchedStockList={matchedStockList}
        onConfirmPick={handleConfirmPick}
      />
    </div>
  );
}
