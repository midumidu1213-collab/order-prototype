"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Search, Plus, Trash2, Edit3, Eye, ArrowUpDown } from "lucide-react";

export default function CancelRequestList() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([
    {
      id: 1,
      requestCode: "YCH-2026-001",
      soCode: "CO2806 001",
      totalQty: 5,
      requester: "Nguyễn Văn An",
      requestDate: "20/08/2026",
      approver: "Trần Thị Bích",
      approveDate: "21/08/2026",
      status: "Đã phê duyệt",
      note: "Khách đổi sang chất liệu 75Y",
    },
    {
      id: 2,
      requestCode: "YCH-2026-002",
      soCode: "CO2806 003",
      totalQty: 2,
      requester: "Lê Hoàng Long",
      requestDate: "21/08/2026",
      approver: "-",
      approveDate: "-",
      status: "Chờ phê duyệt",
      note: "Sai kích thước ni tay",
    },
    {
      id: 3,
      requestCode: "YCH-2026-003",
      soCode: "CO2806 005",
      totalQty: 10,
      requester: "Phạm Minh Tú",
      requestDate: "22/08/2026",
      approver: "-",
      approveDate: "-",
      status: "Chờ phê duyệt",
      note: "Khách hủy hợp đồng đợt 1",
    },
    {
      id: 4,
      requestCode: "YCH-2026-004",
      soCode: "CO2806 008",
      totalQty: 1,
      requester: "Nguyễn Văn An",
      requestDate: "18/08/2026",
      approver: "Trần Thị Bích",
      approveDate: "19/08/2026",
      status: "Đã phê duyệt",
      note: "Hủy theo yêu cầu Sale",
    },
    {
      id: 5,
      requestCode: "YCH-2026-005",
      soCode: "CO2806 010",
      totalQty: 3,
      requester: "Vũ Thị Mai",
      requestDate: "15/08/2026",
      approver: "Đặng Quốc Cường",
      approveDate: "16/08/2026",
      status: "Từ chối",
      note: "Hàng đã hoàn thiện xong, không thể hủy",
    },
  ]);

  const handleDelete = (id, code) => {
    if (confirm(`Chị đẹp có chắc chắn muốn xóa yêu cầu "${code}" không ạ?`)) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Đã phê duyệt":
        return "border-green-300 text-green-700 bg-green-50";
      case "Chờ phê duyệt":
        return "border-yellow-300 text-yellow-700 bg-yellow-50";
      case "Từ chối":
        return "border-red-300 text-red-700 bg-red-50";
      default:
        return "border-gray-300 text-gray-700 bg-gray-50";
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "pending" && r.status === "Chờ phê duyệt") ||
      (activeTab === "approved" && r.status === "Đã phê duyệt") ||
      (activeTab === "rejected" && r.status === "Từ chối");

    const matchSearch =
      r.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.soCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requester.toLowerCase().includes(searchTerm.toLowerCase());

    return matchTab && matchSearch;
  });

  const countPending = requests.filter((r) => r.status === "Chờ phê duyệt").length;
  const countApproved = requests.filter((r) => r.status === "Đã phê duyệt").length;
  const countRejected = requests.filter((r) => r.status === "Từ chối").length;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center space-x-1">
        <span>Quản lý đơn hàng</span>
        <span>&gt;</span>
        <span className="font-semibold text-gray-700">Yêu cầu hủy SO</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách yêu cầu hủy SO</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "all"
                ? "border-[#005a46] text-[#005a46] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tất cả ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "pending"
                ? "border-[#005a46] text-[#005a46] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Chờ phê duyệt ({countPending})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "approved"
                ? "border-[#005a46] text-[#005a46] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Đã phê duyệt ({countApproved})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "rejected"
                ? "border-[#005a46] text-[#005a46] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Từ chối ({countRejected})
          </button>
        </nav>
      </div>

      {/* Action Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            Bộ lọc
          </button>
          <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
            Sắp xếp
          </button>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-[#005a46] focus:border-[#005a46] block w-72 pl-9 sm:text-sm border-gray-300 rounded-md border p-1.5"
              placeholder="Tìm theo Mã YC, Mã SO, Người YC..."
            />
          </div>
        </div>

        <div>
          <Link
            href="/cancel-requests/create"
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005a46] hover:bg-[#004737] transition"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo yêu cầu hủy
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã yêu cầu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã SO</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng SL hủy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người yêu cầu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày yêu cầu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người phê duyệt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày phê duyệt</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, index) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-semibold text-[#005a46]">
                      <Link href={`/cancel-requests/create?id=${req.id}`} className="hover:underline">
                        {req.requestCode}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">{req.soCode}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-900 font-bold text-center">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md">{req.totalQty}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-700">{req.requester}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">{req.requestDate}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-700">{req.approver}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">{req.approveDate}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/cancel-requests/create?id=${req.id}`}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                          title="Sửa / Chi tiết"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(req.id, req.requestCode)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-500">
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
