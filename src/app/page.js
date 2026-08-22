import Link from "next/link";
import { Filter, Search, Plus, MoreHorizontal, PenLine, Copy } from "lucide-react";

export default function OrderList() {
  const tabs = [
    "Tất cả (1)", "Chờ cập nhật (1)", "Chờ Kỹ thuật (1)", "Đủ thông tin KT (1)", 
    "Chờ xác nhận (1)", "Đã chuyển KHSX (1)", "Đang SX (1)", "Đang đóng gói (1)", 
    "Chờ giao hàng (1)", "Hoàn thành (1)", "Đã hủy (1)"
  ];

  const mockOrders = [
    { id: 1, code: "CO2806 001", customer: "Khách VIP 1", team: "Sale A II Hà Nội", type: "Đơn", gold: "61Y", date: "01/08/2026", expectDate: "15/08/2026", qty: 10, total: "25.000.000", note: "Làm gấp", status: "Chờ cập nhật" },
    { id: 2, code: "CO2806 002", customer: "Nguyễn Văn A", team: "Sale A II Hà Nội", type: "Gia công", gold: "61Y", date: "02/08/2026", expectDate: "16/08/2026", qty: 5, total: "12.500.000", note: "-", status: "Chờ Kỹ thuật" },
    { id: 3, code: "CO2806 003", customer: "Đại lý X", team: "Sale B HCM", type: "Gia công", gold: "75Y", date: "02/08/2026", expectDate: "16/08/2026", qty: 20, total: "55.000.000", note: "-", status: "Chờ Kỹ thuật" },
    { id: 4, code: "CO2806 004", customer: "Chị Hạnh", team: "Sale A II Hà Nội", type: "Gia công", gold: "61Y", date: "03/08/2026", expectDate: "17/08/2026", qty: 2, total: "6.000.000", note: "-", status: "Chờ xác nhận" },
    { id: 5, code: "CO2806 005", customer: "Anh Tú", team: "Sale B HCM", type: "Đơn", gold: "61Y", date: "04/08/2026", expectDate: "18/08/2026", qty: 15, total: "35.000.000", note: "-", status: "Đã chuyển KHSX" },
    { id: 6, code: "CO2806 006", customer: "-", team: "Sale A II Hà Nội", type: "Đơn", gold: "61Y", date: "05/08/2026", expectDate: "19/08/2026", qty: 10, total: "25.000.000", note: "-", status: "Đang SX" },
    { id: 7, code: "CO2806 007", customer: "-", team: "Sale B HCM", type: "Đơn", gold: "61Y", date: "06/08/2026", expectDate: "20/08/2026", qty: 8, total: "20.000.000", note: "-", status: "Đang đóng gói" },
    { id: 8, code: "CO2806 008", customer: "Khách Lẻ", team: "Sale A II Hà Nội", type: "Đơn", gold: "61Y", date: "07/08/2026", expectDate: "21/08/2026", qty: 1, total: "2.500.000", note: "-", status: "Chờ giao hàng" },
    { id: 9, code: "CO2806 009", customer: "Khách VIP 2", team: "Sale A II Hà Nội", type: "Đơn", gold: "75Y", date: "08/08/2026", expectDate: "22/08/2026", qty: 50, total: "150.000.000", note: "Đóng hộp VIP", status: "Hoàn thành" },
    { id: 10, code: "CO2806 010", customer: "Chị Ngọc", team: "Sale B HCM", type: "Gia công", gold: "61Y", date: "09/08/2026", expectDate: "23/08/2026", qty: 3, total: "7.500.000", note: "Hủy do đổi mẫu", status: "Đã hủy" },
    { id: 11, code: "CO2806 011", customer: "-", team: "Sale A II Hà Nội", type: "Đơn", gold: "61Y", date: "10/08/2026", expectDate: "24/08/2026", qty: 12, total: "28.000.000", note: "-", status: "Chờ Kỹ thuật" },
    { id: 12, code: "CO2806 012", customer: "-", team: "Sale A II Hà Nội", type: "Đơn", gold: "61Y", date: "11/08/2026", expectDate: "25/08/2026", qty: 10, total: "25.000.000", note: "-", status: "Đủ thông tin KT" },
    { id: 13, code: "CO2806 013", customer: "-", team: "Sale B HCM", type: "Gia công", gold: "75Y", date: "12/08/2026", expectDate: "26/08/2026", qty: 5, total: "15.000.000", note: "-", status: "Đang SX" },
    { id: 14, code: "CO2806 014", customer: "Anh Minh", team: "Sale A II Hà Nội", type: "Đơn", gold: "61Y", date: "13/08/2026", expectDate: "27/08/2026", qty: 1, total: "3.500.000", note: "-", status: "Hoàn thành" },
    { id: 15, code: "CO2806 015", customer: "Đại lý Y", team: "Sale B HCM", type: "Đơn", gold: "61Y", date: "14/08/2026", expectDate: "28/08/2026", qty: 30, total: "75.000.000", note: "-", status: "Chờ xác nhận" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ cập nhật": return "text-gray-700 bg-gray-50 border-gray-300";
      case "Chờ Kỹ thuật": return "text-yellow-700 bg-yellow-50 border-yellow-300";
      case "Đủ thông tin KT": return "text-blue-700 bg-blue-50 border-blue-300";
      case "Chờ xác nhận": return "text-orange-700 bg-orange-50 border-orange-300";
      case "Đã chuyển KHSX": return "text-indigo-700 bg-indigo-50 border-indigo-300";
      case "Đang SX": return "text-purple-700 bg-purple-50 border-purple-300";
      case "Đang đóng gói": return "text-pink-700 bg-pink-50 border-pink-300";
      case "Chờ giao hàng": return "text-cyan-700 bg-cyan-50 border-cyan-300";
      case "Hoàn thành": return "text-green-700 bg-green-50 border-green-300";
      case "Đã hủy": return "text-red-700 bg-red-50 border-red-300";
      default: return "text-gray-700 bg-gray-50 border-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500">
        <span>Quản lý đơn hàng</span>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900">Danh sách đơn hàng</span>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                index === 0
                  ? "border-[#005a46] text-[#005a46]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="pb-4 px-1 text-gray-400 hover:text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </nav>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center py-2">
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
            <span className="ml-2 bg-[#005a46] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            Sắp xếp
          </button>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-[#005a46] focus:border-[#005a46] block w-64 pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="Tìm kiếm"
            />
          </div>
        </div>
        <div>
          <Link
            href="/orders/create"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#005a46] hover:bg-[#004737]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["STT", "Mã đơn hàng", "Khách hàng", "Nhóm phụ trách", "Loại đơn hàng", "Tuổi vàng", "Ngày đặt hàng", "Ngày dự kiến giao", "Tổng số lượng", "Tổng tiền", "Ghi chú", "Trạng thái"].map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.team}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${order.type === 'Đơn' ? 'border-green-300 text-green-700 bg-green-50' : 'border-yellow-300 text-yellow-700 bg-yellow-50'}`}>
                    {order.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.gold}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.expectDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.note}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-500"><PenLine className="h-4 w-4" /></button>
                  <button className="text-gray-400 hover:text-gray-500"><Copy className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Simplified) */}
      <div className="flex items-center justify-end space-x-2 text-sm text-gray-500 py-2">
        <button className="px-3 py-1 border rounded-md">{"<"}</button>
        <button className="px-3 py-1 border rounded-md bg-[#005a46] text-white">1</button>
        <button className="px-3 py-1 border rounded-md">2</button>
        <button className="px-3 py-1 border rounded-md">3</button>
        <span>...</span>
        <button className="px-3 py-1 border rounded-md">10</button>
        <button className="px-3 py-1 border rounded-md">{">"}</button>
        <select className="border rounded-md px-2 py-1 ml-4"><option>20 / trang</option></select>
      </div>
    </div>
  );
}
