import Link from "next/link";
import { Filter, Search, Plus, MoreHorizontal, PenLine, Copy } from "lucide-react";

export default function OrderList() {
  const tabs = [
    "Tất cả (1)", "Chờ cập nhật (1)", "Chờ Kỹ thuật (1)", "Đủ thông tin KT (1)", 
    "Chờ xác nhận (1)", "Đã chuyển KHSX (1)", "Đang SX (1)", "Đang đóng gói (1)", 
    "Chờ giao hàng (1)", "Hoàn thành (1)", "Đã hủy (1)"
  ];

  const mockOrders = [
    { id: 1, code: "SO2608001", customer: "2000001 - Cty TNHH Vàng Bạc Kim Yến", team: "Sale A II Hà Nội", type: "Đơn hàng Bán", gold: "61Y", date: "01/08/2026", expectDate: "15/08/2026", qty: 10, cancelQty: 5, total: "25.000.000", note: "Đã duyệt hủy 5 SP", status: "Chờ cập nhật" },
    { id: 2, code: "SO2608002", customer: "2000002 - DNTN Vàng Bạc Bảo Tín", team: "Sale A II Hà Nội", type: "Đơn hàng Gia công", gold: "41.6Y", date: "02/08/2026", expectDate: "16/08/2026", qty: 5, cancelQty: 0, total: "12.500.000", note: "-", status: "Chờ Kỹ thuật" },
    { id: 3, code: "SO2608003", customer: "2000003 - Tiệm Vàng Kim Thành Phát", team: "Sale B HCM", type: "Đơn hàng Bán", gold: "75W", date: "02/08/2026", expectDate: "16/08/2026", qty: 20, cancelQty: 10, total: "55.000.000", note: "KHSX đã xử lý hủy 10 SP", status: "Chờ Kỹ thuật" },
    { id: 4, code: "SO2608004", customer: "2000004 - Cty CP Trang Sức PNJ Diamond", team: "Sale A II Hà Nội", type: "Đơn hàng Gia công", gold: "41.6Y", date: "03/08/2026", expectDate: "17/08/2026", qty: 2, cancelQty: 0, total: "6.000.000", note: "-", status: "Chờ xác nhận" },
    { id: 5, code: "SO2608005", customer: "2000005 - Cửa hàng VBĐQ Minh Châu", team: "Sale B HCM", type: "Đơn hàng Bán", gold: "61Y", date: "04/08/2026", expectDate: "18/08/2026", qty: 15, cancelQty: 0, total: "35.000.000", note: "-", status: "Đã chuyển KHSX" },
    { id: 6, code: "SO2608006", customer: "2000001 - Cty TNHH Vàng Bạc Kim Yến", team: "Sale A II Hà Nội", type: "Đơn hàng Bán", gold: "61Y", date: "05/08/2026", expectDate: "19/08/2026", qty: 10, cancelQty: 0, total: "25.000.000", note: "-", status: "Đang SX" },
    { id: 7, code: "SO2608007", customer: "2000003 - Tiệm Vàng Kim Thành Phát", team: "Sale B HCM", type: "Đơn hàng Bán", gold: "75W", date: "06/08/2026", expectDate: "20/08/2026", qty: 8, cancelQty: 0, total: "20.000.000", note: "-", status: "Đang đóng gói" },
    { id: 8, code: "SO2608008", customer: "2000002 - DNTN Vàng Bạc Bảo Tín", team: "Sale A II Hà Nội", type: "Đơn hàng Gia công", gold: "41.6Y", date: "07/08/2026", expectDate: "21/08/2026", qty: 1, cancelQty: 0, total: "2.500.000", note: "-", status: "Chờ giao hàng" },
    { id: 9, code: "SO2608009", customer: "2000004 - Cty CP Trang Sức PNJ Diamond", team: "Sale A II Hà Nội", type: "Đơn hàng Bán", gold: "75W", date: "08/08/2026", expectDate: "22/08/2026", qty: 50, cancelQty: 0, total: "150.000.000", note: "Đóng hộp VIP", status: "Hoàn thành" },
    { id: 10, code: "SO2608010", customer: "2000005 - Cửa hàng VBĐQ Minh Châu", team: "Sale B HCM", type: "Đơn hàng Gia công", gold: "61Y", date: "09/08/2026", expectDate: "23/08/2026", qty: 3, cancelQty: 3, total: "7.500.000", note: "Đã duyệt hủy toàn bộ đơn", status: "Đã hủy" },
    { id: 11, code: "SO2608011", customer: "2000001 - Cty TNHH Vàng Bạc Kim Yến", team: "Sale A II Hà Nội", type: "Đơn hàng Bán", gold: "61Y", date: "10/08/2026", expectDate: "24/08/2026", qty: 12, cancelQty: 0, total: "28.000.000", note: "-", status: "Chờ Kỹ thuật" },
    { id: 12, code: "SO2608012", customer: "2000003 - Tiệm Vàng Kim Thành Phát", team: "Sale A II Hà Nội", type: "Đơn hàng Bán", gold: "75W", date: "11/08/2026", expectDate: "25/08/2026", qty: 10, cancelQty: 0, total: "25.000.000", note: "-", status: "Đủ thông tin KT" },
    { id: 13, code: "SO2608013", customer: "2000002 - DNTN Vàng Bạc Bảo Tín", team: "Sale B HCM", type: "Đơn hàng Gia công", gold: "41.6Y", date: "12/08/2026", expectDate: "26/08/2026", qty: 5, cancelQty: 0, total: "15.000.000", note: "-", status: "Đang SX" },
    { id: 14, code: "SO2608014", customer: "2000005 - Cửa hàng VBĐQ Minh Châu", team: "Sale A II Hà Nội", type: "Đơn hàng Bán", gold: "61Y", date: "13/08/2026", expectDate: "27/08/2026", qty: 1, cancelQty: 0, total: "3.500.000", note: "-", status: "Hoàn thành" },
    { id: 15, code: "SO2608015", customer: "2000004 - Cty CP Trang Sức PNJ Diamond", team: "Sale B HCM", type: "Đơn hàng Bán", gold: "75W", date: "14/08/2026", expectDate: "28/08/2026", qty: 30, cancelQty: 0, total: "75.000.000", note: "-", status: "Chờ xác nhận" },
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
      case "Đã hủy": return "text-red-700 bg-red-50 border-red-300 font-bold";
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h2>
          <p className="text-xs text-gray-500 mt-0.5">Theo dõi chi tiết số lượng đặt và số lượng hủy của từng đơn hàng</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                index === 0
                  ? "border-[#005a46] text-[#005a46]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Actions / Filter Bar */}
      <div className="flex justify-between items-center space-x-4">
        <div className="flex space-x-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã SO, tên khách hàng..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#005a46] focus:border-[#005a46]"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            Bộ lọc
          </button>
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
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              {["STT", "Mã đơn hàng", "Khách hàng", "Nhóm phụ trách", "Loại đơn hàng", "Tuổi vàng", "Ngày đặt", "Dự kiến giao", "SL đặt", "SL hủy", "SL còn lại", "Tổng tiền (VND)", "Ghi chú", "Trạng thái"].map((col) => (
                <th key={col} className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
              <th className="px-3 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockOrders.map((order) => {
              const remainingQty = order.qty - (order.cancelQty || 0);
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-3.5 whitespace-nowrap text-gray-500 font-medium">{order.id}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap font-bold text-[#005a46]">{order.code}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap text-gray-700 max-w-xs truncate" title={order.customer}>{order.customer}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap text-gray-500">{order.team}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-[11px] leading-4 font-semibold rounded-full border ${order.type === 'Đơn hàng Bán' ? 'border-green-300 text-green-700 bg-green-50' : 'border-yellow-300 text-yellow-700 bg-yellow-50'}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap font-medium text-gray-700">{order.gold}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap text-gray-500">{order.date}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap text-gray-500">{order.expectDate}</td>
                  
                  {/* SL Đặt */}
                  <td className="px-3 py-3.5 whitespace-nowrap font-bold text-gray-900 text-center">
                    {order.qty} SP
                  </td>

                  {/* Bổ sung Cột SL Hủy */}
                  <td className="px-3 py-3.5 whitespace-nowrap text-center">
                    {order.cancelQty > 0 ? (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-bold">
                        {order.cancelQty} SP
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>

                  {/* SL Còn lại */}
                  <td className="px-3 py-3.5 whitespace-nowrap font-bold text-emerald-800 text-center">
                    {remainingQty} SP
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap font-semibold text-gray-900">{order.total}</td>
                  <td className="px-3 py-3.5 text-gray-500 max-w-xs truncate">{order.note}</td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-[11px] leading-4 font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap font-medium text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button className="p-1 text-gray-400 hover:text-[#005a46] rounded"><PenLine className="h-4 w-4" /></button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded"><Copy className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
