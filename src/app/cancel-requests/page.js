"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Filter,
  Search,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Layers,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

export default function CancelRequestList() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState({ 1: true }); // Mặc định mở dòng đầu tiên cho user thấy

  const [toastNotification, setToastNotification] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 1,
      requestCode: "YCH-2026-001",
      baseWorkflowId: "BASE-RQ-18791",
      baseFormType: "Form Type B",
      soTransferType: "Đã chuyển KHSX",
      baseStatus: "Đã duyệt trên Base",
      soCode: "SO2608001",
      customer: "2000001 - Vàng Kim Yến",
      orderOriginalQty: 10,
      totalQty: 5, // SL đã hủy
      remainingQty: 5, // SL còn lại
      requester: "Nguyễn Văn An",
      requestDate: "20/08/2026",
      approver: "Trần Thị Bích (Base Appr.)",
      approveDate: "21/08/2026",
      status: "Đã duyệt",
      deliveryOrderStatus: "DO đã điều chỉnh",
      doCode: "DO-2608-0192",
      hasInvoice: false,
      khsxSyncStatus: "Đã thông báo KHSX",
      inventorySyncStatus: "Đã chuyển vào Kho CXLL",
      note: "Khách đổi sang chất liệu 75W",
      subItems: [
        {
          id: 101,
          itemCode: "GY0RG000086A00A00CZGG3CZKK2008",
          name: "Nhẫn Kim Cương Vàng 61Y (Ni 48)",
          image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&auto=format&fit=crop&q=60",
          weight: "0,2248",
          price: 5200000,
          orderedQty: 5,
          qty: 2, // Hủy
          remaining: 3,
          disposition: "Chuyển SO",
          reason: "Khách đổi sang ni 48",
          targetLocation: "Kho CXLL - Ngăn C01",
        },
        {
          id: 102,
          itemCode: "GY0BC000012B00B00CZGG3CZKK1002",
          name: "Lắc Tay Nữ Ý 61Y (Size 16cm)",
          image: "https://images.unsplash.com/photo-1611591475166-4190b2170366?w=100&auto=format&fit=crop&q=60",
          weight: "0,3512",
          price: 8600000,
          orderedQty: 5,
          qty: 3, // Hủy
          remaining: 2,
          disposition: "Chuyển SO",
          reason: "Khách hủy mẫu lắc tay",
          targetLocation: "Kho CXLL - Ngăn C02",
        },
      ],
    },
    {
      id: 2,
      requestCode: "YCH-2026-002",
      baseWorkflowId: "BASE-RQ-18792",
      baseFormType: "Form Type B",
      soTransferType: "Đã chuyển KHSX",
      baseStatus: "Chờ duyệt trên Base",
      soCode: "SO2608002",
      customer: "2000002 - Bảo Tín",
      orderOriginalQty: 5,
      totalQty: 2,
      remainingQty: 3,
      requester: "Lê Hoàng Long",
      requestDate: "21/08/2026",
      approver: "—",
      approveDate: "—",
      status: "Chờ duyệt",
      deliveryOrderStatus: "Đã đính kèm điều chỉnh DO",
      doCode: "DO-2608-0199",
      hasInvoice: false,
      khsxSyncStatus: "KHSX đã nhận thông báo",
      inventorySyncStatus: "Chờ duyệt Base để tự động sửa DO",
      note: "Sai kích thước ni tay. Đã đính kèm phương án giảm 2 SP trên DO-2608-0199.",
      subItems: [
        {
          id: 201,
          itemCode: "GY0RG000055A00A00CZGG3CZKK1001",
          name: "Nhẫn Nam Đính Đá Topaz 41.6Y",
          image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=100&auto=format&fit=crop&q=60",
          weight: "0,2850",
          price: 4800000,
          orderedQty: 5,
          qty: 2,
          remaining: 3,
          disposition: "Chuyển SO",
          reason: "Sai kích thước ni tay 52",
          targetLocation: "Chờ điều chỉnh DO để chuyển Kho CXLL",
        },
      ],
    },
    {
      id: 3,
      requestCode: "YCH-2026-003",
      baseWorkflowId: "BASE-RQ-18788",
      baseFormType: "Form Type A",
      soTransferType: "Chưa chuyển KHSX",
      baseStatus: "Đã duyệt trên Base",
      soCode: "SO2608003",
      customer: "2000003 - Kim Thành Phát",
      orderOriginalQty: 20,
      totalQty: 10,
      remainingQty: 10,
      requester: "Phạm Minh Tú",
      requestDate: "22/08/2026",
      approver: "TPKD Phê Duyệt (Base Appr.)",
      approveDate: "23/08/2026",
      status: "Đã xử lý", // Đơn nội bộ KD đã hoàn tất cập nhật SO
      deliveryOrderStatus: "Chưa lập DO",
      doCode: "—",
      hasInvoice: false,
      khsxSyncStatus: "Chưa chuyển KHSX (Hủy nội bộ KD)",
      inventorySyncStatus: "Không phát sinh kho",
      note: "Hủy đơn nội bộ KD trước khi phát hành KHSX",
      subItems: [
        {
          id: 301,
          itemCode: "GW0RG000088A00A00CZGG3CZKK4000",
          name: "Bộ Nhẫn Cưới Vàng Trắng 75W",
          image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&auto=format&fit=crop&q=60",
          weight: "0,4500",
          price: 15200000,
          orderedQty: 10,
          qty: 4,
          remaining: 6,
          disposition: "Hủy luôn",
          reason: "Khách giảm ngân sách",
          targetLocation: "Nội bộ KD (Đã trừ SO)",
        },
        {
          id: 302,
          itemCode: "GW0BC000077B00B00CZGG3CZKK5000",
          name: "Vòng Tay Bản Lớn 75W",
          image: "https://images.unsplash.com/photo-1611591475166-4190b2170366?w=100&auto=format&fit=crop&q=60",
          weight: "0,8750",
          price: 28500000,
          orderedQty: 10,
          qty: 6,
          remaining: 4,
          disposition: "Chuyển SO",
          reason: "Hủy theo yêu cầu đại lý",
          targetLocation: "Nội bộ KD (Đã trừ SO)",
        },
      ],
    },
    {
      id: 4,
      requestCode: "YCH-2026-004",
      baseWorkflowId: "BASE-RQ-18775",
      baseFormType: "Form Type A",
      soTransferType: "Chưa chuyển KHSX",
      baseStatus: "Từ chối trên Base",
      soCode: "SO2608004",
      customer: "2000004 - PNJ Diamond",
      orderOriginalQty: 3,
      totalQty: 1,
      remainingQty: 3,
      requester: "Nguyễn Văn An",
      requestDate: "18/08/2026",
      approver: "TPKD Từ chối",
      approveDate: "18/08/2026",
      status: "Từ chối",
      deliveryOrderStatus: "Chưa lập DO",
      doCode: "—",
      hasInvoice: false,
      khsxSyncStatus: "Chưa chuyển KHSX",
      inventorySyncStatus: "Giữ nguyên đơn hàng gốc",
      note: "TPKD từ chối do đã ký hợp đồng cọc không hoàn lại",
      subItems: [
        {
          id: 401,
          itemCode: "SV0PD000021A00A00CZGG3CZKK1100",
          name: "Mặt Dây Chuyền Bạc Đính Đá CZ",
          image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=60",
          weight: "0,2375",
          price: 1200000,
          orderedQty: 3,
          qty: 1,
          remaining: 3,
          disposition: "Chuyển SO",
          reason: "Mặt dây chuyền lỗi đúc",
          targetLocation: "Không chuyển",
        },
      ],
    },
    {
      id: 5,
      requestCode: "YCH-2026-005",
      baseWorkflowId: "BASE-RQ-18760",
      baseFormType: "Form Type B",
      soTransferType: "Đã chuyển KHSX",
      baseStatus: "Đã duyệt trên Base",
      soCode: "SO2608005",
      customer: "2000005 - Minh Châu",
      orderOriginalQty: 6,
      totalQty: 3,
      remainingQty: 3,
      requester: "Vũ Thị Mai",
      requestDate: "15/08/2026",
      approver: "GĐKD + GĐSX Phê Duyệt",
      approveDate: "16/08/2026",
      status: "Đã duyệt",
      deliveryOrderStatus: "Đã lập Hóa đơn",
      doCode: "DO-2608-0145",
      hasInvoice: true,
      khsxSyncStatus: "KHSX đã nhận thông báo",
      inventorySyncStatus: "Chờ Kế toán xử lý hóa đơn",
      note: "Đã xuất hóa đơn GTGT, QLĐH cần phối hợp Kế toán điều chỉnh hóa đơn",
      subItems: [
        {
          id: 501,
          itemCode: "GY0RG000091A00A00CZGG3CZKK9901",
          name: "Nhẫn Đính Hôn Solitaire 61Y",
          image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&auto=format&fit=crop&q=60",
          weight: "0,1950",
          price: 6500000,
          orderedQty: 6,
          qty: 3,
          remaining: 3,
          disposition: "Hủy luôn",
          reason: "Khách trễ hạn thanh toán",
          targetLocation: "Kho CXLL (Sau khi hủy HĐ)",
        },
      ],
    },
  ]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = (id, code, e) => {
    e.stopPropagation();
    if (confirm(`Chị đẹp có chắc chắn muốn xóa yêu cầu "${code}" không ạ?`)) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  // Duyệt qua Base Request
  const handleApproveViaBase = (id, e) => {
    e.stopPropagation();
    const target = requests.find((r) => r.id === id);
    if (!target) return;

    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              baseStatus: "Đã duyệt trên Base",
              status: "Đã duyệt",
              approver: "GĐKD + GĐSX Phê Duyệt",
              approveDate: new Date().toLocaleDateString("vi-VN"),
              deliveryOrderStatus: r.doCode && r.doCode !== "—" ? "DO đã tự động điều chỉnh" : "Chưa lập DO",
              inventorySyncStatus: "Sẵn sàng chuyển sang Kho CXLL",
              khsxSyncStatus: "Đã thông báo KHSX",
            }
          : r
      )
    );

    setToastNotification({
      title: `✅ Duyệt Base thành công: ${target.requestCode} (${target.baseWorkflowId})`,
      details: [
        `Hệ thống TỰ ĐỘNG CẬP NHẬT ĐỒNG THỜI: Số lượng còn lại của ${target.soCode} là ${target.remainingQty} SP`,
        target.doCode && target.doCode !== "—"
          ? `Tự động cập nhật giảm ${target.totalQty} SP trên Phiếu giao hàng ${target.doCode}`
          : `Đơn hàng chưa phát sinh DO giao hàng`,
        `Kho Thành Phẩm nhận tín hiệu hợp lệ: Tiến hành chuyển ngay sang Kho CXLL (Không cần chờ QLĐH cập nhật)`,
      ],
    });

    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  const handleQuickApprove = (id, status, e) => {
    e.stopPropagation();
    if (status === "Đã duyệt") {
      handleApproveViaBase(id, e);
      return;
    }
    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              baseStatus: "Từ chối trên Base",
              status,
              approver: "Trần Thị Bích",
              approveDate: new Date().toLocaleDateString("vi-VN"),
              khsxSyncStatus: "Giữ nguyên kế hoạch",
              inventorySyncStatus: "Giữ nguyên Tồn kho TP",
            }
          : r
      )
    );
  };

  const handleAdjustDO = (id, e) => {
    e.stopPropagation();
    const target = requests.find((r) => r.id === id);
    if (!target) return;

    setRequests(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              deliveryOrderStatus: "DO đã điều chỉnh",
              inventorySyncStatus: "Sẵn sàng chuyển Kho CXLL (Đã sửa DO)",
            }
          : r
      )
    );

    setToastNotification({
      title: `✅ QLĐH đã điều chỉnh Phiếu giao hàng ${target.doCode || "DO"} thành công!`,
      details: [
        `Đã cập nhật lại danh sách hàng trên DO: trừ ${target.totalQty} SP hủy`,
        `Đã gỡ khóa cảnh báo: Mở quyền cho Kho Thành Phẩm thực hiện chuyển lô sang Kho CXLL`,
      ],
    });

    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Đã duyệt":
      case "Đã phê duyệt":
        return "border-green-300 text-green-700 bg-green-50";
      case "Chờ duyệt":
      case "Chờ phê duyệt":
        return "border-yellow-300 text-yellow-700 bg-yellow-50";
      case "Từ chối":
        return "border-red-300 text-red-700 bg-red-50";
      case "Đã hủy":
        return "border-gray-300 text-gray-700 bg-gray-100";
      case "Đã xử lý":
        return "border-blue-300 text-blue-700 bg-blue-50 font-bold";
      default:
        return "border-gray-300 text-gray-700 bg-gray-50";
    }
  };

  // Lọc theo Tab và Search
  const filteredRequests = requests.filter((req) => {
    // Tab filter
    let matchTab = true;
    if (activeTab === "pending") matchTab = req.status === "Chờ duyệt" || req.status === "Chờ phê duyệt";
    else if (activeTab === "approved") matchTab = req.status === "Đã duyệt" || req.status === "Đã phê duyệt";
    else if (activeTab === "rejected") matchTab = req.status === "Từ chối";
    else if (activeTab === "cancelled") matchTab = req.status === "Đã hủy";
    else if (activeTab === "processed") matchTab = req.status === "Đã xử lý";

    // Search filter
    const matchSearch =
      req.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.baseWorkflowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.soCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchTab && matchSearch;
  });

  const countPending = requests.filter((r) => r.status === "Chờ duyệt" || r.status === "Chờ phê duyệt").length;
  const countApproved = requests.filter((r) => r.status === "Đã duyệt" || r.status === "Đã phê duyệt").length;
  const countRejected = requests.filter((r) => r.status === "Từ chối").length;
  const countCancelled = requests.filter((r) => r.status === "Đã hủy").length;
  const countProcessed = requests.filter((r) => r.status === "Đã xử lý").length;

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500">
        <span>Quản lý đơn hàng</span>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900">Yêu cầu hủy SO</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Danh sách Yêu cầu hủy SO</h2>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý phê duyệt Base Request và theo dõi tiến độ đồng bộ KHSX
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/cancel-requests/create"
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005a46] hover:bg-[#004737] transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo yêu cầu hủy
          </Link>
        </div>
      </div>

      {/* Toast Alert Thông Báo Nghiệp Vụ Base Approval */}
      {toastNotification && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950">
                  {toastNotification.title}
                </h4>
                <ul className="text-xs text-emerald-900 space-y-0.5">
                  {toastNotification.details.map((d, i) => (
                    <li key={i} className="flex items-center space-x-1.5 font-medium">
                      <span>•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              ✕ Đóng
            </button>
          </div>
        </div>
      )}

      {/* Tabs Filter - 5 Trạng thái chuẩn */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium transition ${
              activeTab === "all"
                ? "border-[#005a46] text-[#005a46]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tất cả ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium transition ${
              activeTab === "pending"
                ? "border-yellow-600 text-yellow-700 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Chờ duyệt ({countPending})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium transition ${
              activeTab === "approved"
                ? "border-green-600 text-green-700 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Đã duyệt ({countApproved})
          </button>
          <button
            onClick={() => setActiveTab("processed")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium transition ${
              activeTab === "processed"
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Đã xử lý (KHSX) ({countProcessed})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium transition ${
              activeTab === "rejected"
                ? "border-red-600 text-red-700 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Từ chối ({countRejected})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium transition ${
              activeTab === "cancelled"
                ? "border-gray-600 text-gray-800 font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Đã hủy ({countCancelled})
          </button>
        </nav>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Mã YC (YCH-...), Mã Base (BASE-RQ...), Mã SO (SO2608...), Người yêu cầu, Khách hàng..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#005a46] focus:border-[#005a46]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>💡 <b>Quy trình Base:</b> YC hủy gửi lên Base duyệt → QLĐH cập nhật SL còn lại → Thông báo KHSX & Kho TP chuyển lô sang Kho CXLL.</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                  #
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                  STT
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mã YC & Base ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phân loại KHSX & Form Base
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mã SO & Khách hàng
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  SL Đặt
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">
                  SL Đã Hủy
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  SL Còn Lại
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái DO / HĐ
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái Base
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Người duyệt
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái YC
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, index) => {
                  const isExpanded = !!expandedRows[req.id];
                  return (
                    <React.Fragment key={req.id}>
                      <tr
                        onClick={() => toggleRow(req.id)}
                        className={`hover:bg-gray-50/80 cursor-pointer transition select-none ${
                          isExpanded ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        <td className="px-3 py-3.5 text-center text-gray-400">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-[#005a46] mx-auto" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-3.5 text-center font-medium text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-[#005a46]">{req.requestCode}</div>
                          <div className="text-[11px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                            {req.baseWorkflowId}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                            req.soTransferType === "Chưa chuyển KHSX"
                              ? "bg-sky-50 text-sky-800 border-sky-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {req.soTransferType}
                          </span>
                          <div className="text-[10px] text-gray-500 mt-0.5 font-medium">{req.baseFormType}</div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{req.soCode}</div>
                          <div className="text-gray-500 text-xs truncate max-w-xs">{req.customer}</div>
                        </td>
                        <td className="px-3 py-3.5 text-center whitespace-nowrap font-bold text-gray-700">
                          {req.orderOriginalQty} SP
                        </td>
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            -{req.totalQty} SP
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {req.remainingQty} SP
                          </span>
                        </td>
                        <td className="px-3 py-3.5 whitespace-nowrap text-center">
                          {req.deliveryOrderStatus === "Đã đính kèm điều chỉnh DO" ? (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300"
                              title="Yêu cầu đã đính kèm phương án sửa DO. Khi Base duyệt, hệ thống sẽ tự động cập nhật đồng thời SO và DO."
                            >
                              ⚡ {req.doCode}: Đã đính kèm sửa DO
                            </span>
                          ) : req.deliveryOrderStatus === "DO đã tự động điều chỉnh" || req.deliveryOrderStatus === "DO đã điều chỉnh" ? (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300"
                              title="Hệ thống đã tự động cập nhật đồng thời số lượng trên DO cùng với SO khi Base duyệt."
                            >
                              ✓ {req.doCode}: Đã tự động sửa DO
                            </span>
                          ) : req.deliveryOrderStatus === "Đã lập Hóa đơn" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              📄 Đã xuất HĐ
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            req.baseStatus === "Đã duyệt trên Base"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : req.baseStatus === "Chờ duyệt trên Base"
                              ? "bg-amber-50 text-amber-700 border-amber-300 animate-pulse"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}>
                            {req.baseStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap text-xs">
                          <div className="font-medium">{req.approver}</div>
                          <div className="text-gray-400 text-[11px]">{req.approveDate}</div>
                        </td>
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                              req.status
                            )}`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-1.5">
                            {req.baseStatus === "Chờ duyệt trên Base" && (
                              <button
                                onClick={(e) => handleApproveViaBase(req.id, e)}
                                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold shadow-xs transition"
                                title="Giả lập Base Phê duyệt: Cập nhật đồng thời SO & DO"
                              >
                                Duyệt Base
                              </button>
                            )}
                            <Link
                              href={`/cancel-requests/create?id=${req.id}`}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                              title="Sửa / Chi tiết"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={(e) => handleDelete(req.id, req.requestCode, e)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Submenu / Subtable */}
                      {isExpanded && (
                        <tr className="bg-gray-50/70 border-b border-gray-200">
                          <td colSpan={13} className="px-6 py-4">
                            <div className="bg-white rounded-lg border border-emerald-200 p-4 shadow-sm space-y-3">
                              {/* Thông tin liên kết Phiếu Giao Hàng DO */}
                              {req.deliveryOrderStatus === "Đã đính kèm điều chỉnh DO" && (
                                <div className="flex items-start sm:items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 gap-2">
                                  <div className="flex items-start sm:items-center space-x-2">
                                    <span className="text-base">⚡</span>
                                    <div>
                                      <b>Đã đính kèm phương án điều chỉnh Phiếu giao hàng ({req.doCode}):</b> Khi Base duyệt yêu cầu, hệ thống sẽ <b>tự động cập nhật đồng thời</b> số lượng SO và DO. Kho Thành Phẩm sẽ nhận tín hiệu để chuyển ngay sang CXLL mà không cần chờ tác nghiệp thủ công.
                                    </div>
                                  </div>
                                </div>
                              )}
                              {(req.deliveryOrderStatus === "DO đã tự động điều chỉnh" || req.deliveryOrderStatus === "DO đã điều chỉnh") && (
                                <div className="flex items-start sm:items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900 gap-2">
                                  <div className="flex items-start sm:items-center space-x-2">
                                    <span className="text-base">✓</span>
                                    <div>
                                      <b>Đã tự động đồng bộ Phiếu giao hàng ({req.doCode}):</b> Số lượng hủy (-{req.totalQty} SP) đã được trừ đồng thời trên SO và DO khi Base duyệt. Kho Thành Phẩm thực hiện chuyển lô sang <b>Kho CXLL</b> ngay lập tức.
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                                <div className="flex items-center space-x-2">
                                  <div className="h-2 w-2 rounded-full bg-[#005a46]"></div>
                                  <span className="text-sm font-bold text-gray-900">
                                    Chi tiết các mặt hàng yêu cầu hủy ({req.subItems?.length || 0} sản phẩm)
                                  </span>
                                  <span className="text-xs text-gray-500 italic">- Ghi chú: {req.note}</span>
                                </div>

                                {(req.status === "Chờ duyệt" || req.status === "Chờ phê duyệt") && (
                                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={(e) => handleQuickApprove(req.id, "Đã duyệt", e)}
                                      className="flex items-center px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold shadow-sm transition"
                                    >
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Duyệt nhanh
                                    </button>
                                    <button
                                      onClick={(e) => handleQuickApprove(req.id, "Từ chối", e)}
                                      className="flex items-center px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition"
                                    >
                                      <X className="h-3.5 w-3.5 mr-1" />
                                      Từ chối
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase w-10">STT</th>
                                      <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase w-14">Hình ảnh</th>
                                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Mã Item & Tên SP</th>
                                      <th className="px-3 py-2 text-center font-semibold text-gray-600 uppercase w-20">SL Đặt</th>
                                      <th className="px-3 py-2 text-center font-semibold text-rose-600 uppercase w-20">SL Hủy</th>
                                      <th className="px-3 py-2 text-center font-semibold text-emerald-700 uppercase w-20">SL Còn lại</th>
                                      <th className="px-4 py-2 text-right font-semibold text-gray-600 uppercase w-28">Đơn giá</th>
                                      <th className="px-4 py-2 text-right font-semibold text-gray-600 uppercase w-28">Thành tiền hủy</th>
                                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase w-32">Hướng xử lý</th>
                                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase w-48">Vị trí kho đích (Kho CXLL)</th>
                                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Lý do hủy chi tiết</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-100">
                                    {req.subItems?.map((sub, sIdx) => {
                                      const amount = (Number(sub.qty) || 0) * (Number(sub.price) || 0);
                                      return (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                          <td className="px-3 py-2.5 text-gray-500 text-center font-medium">{sIdx + 1}</td>
                                          <td className="px-3 py-2.5 text-center">
                                            {sub.image ? (
                                              <img
                                                src={sub.image}
                                                alt={sub.itemCode}
                                                className="h-8 w-8 object-cover rounded border border-gray-200 mx-auto"
                                              />
                                            ) : (
                                              <span className="text-gray-300">-</span>
                                            )}
                                          </td>
                                          <td className="px-4 py-2.5">
                                            <div className="font-semibold text-gray-900">{sub.itemCode}</div>
                                            <div className="text-gray-500 text-[11px]">{sub.name || "-"}</div>
                                          </td>
                                          <td className="px-3 py-2.5 text-center font-bold text-gray-700">
                                            {sub.orderedQty || (sub.qty + (sub.remaining || 0))} SP
                                          </td>
                                          <td className="px-3 py-2.5 text-center font-bold text-rose-600">
                                            <span className="px-2 py-0.5 bg-rose-50 rounded border border-rose-200">
                                              -{sub.qty} SP
                                            </span>
                                          </td>
                                          <td className="px-3 py-2.5 text-center font-bold text-emerald-700">
                                            <span className="px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                                              {sub.remaining ?? (sub.orderedQty - sub.qty)} SP
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5 text-right font-medium text-gray-800 whitespace-nowrap">
                                            {sub.price ? `${sub.price.toLocaleString("vi-VN")} đ` : "-"}
                                          </td>
                                          <td className="px-4 py-2.5 text-right font-bold text-rose-600 whitespace-nowrap">
                                            {amount ? `-${amount.toLocaleString("vi-VN")} đ` : "-"}
                                          </td>
                                          <td className="px-4 py-2.5 whitespace-nowrap">
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                                sub.disposition === "Chuyển SO"
                                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                  : "bg-red-50 text-red-700 border border-red-200"
                                              }`}
                                            >
                                              {sub.disposition || "Hủy luôn"}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                              📍 {sub.targetLocation || "Kho CXLL"}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5 text-gray-700">{sub.reason || "-"}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-sm text-gray-500">
                    Không tìm thấy yêu cầu hủy SO nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
