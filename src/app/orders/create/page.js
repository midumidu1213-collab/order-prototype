import Link from "next/link";
import { ChevronLeft, Plus, Upload, ImageIcon } from "lucide-react";

export default function CreateOrder() {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Link>
        <span className="mx-2 text-gray-300">|</span>
        <h2 className="text-lg font-bold text-gray-900">Thêm mới đơn hàng thủ công</h2>
      </div>

      {/* Thông tin chung */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-[#005a46]">Thông tin chung</h3>
        </div>
        <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Row 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã khách hàng <span className="text-red-500">*</span></label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" defaultValue="05/2026" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên khách hàng <span className="text-red-500">*</span></label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" placeholder="-" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Đội/nhóm phụ trách <span className="text-red-500">*</span></label>
            <select className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm">
              <option>-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày đặt hàng <span className="text-red-500">*</span></label>
            <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" defaultValue="2026-05-01" />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Loại đơn hàng <span className="text-red-500">*</span></label>
            <select className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm">
              <option>-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chất liệu <span className="text-red-500">*</span></label>
            <select className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm">
              <option>-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tuổi vàng <span className="text-red-500">*</span></label>
            <select className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm">
              <option>-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tuổi xi/mạ <span className="text-red-500">*</span></label>
            <select className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm">
              <option>-</option>
            </select>
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Số lượng <span className="text-red-500">*</span></label>
            <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" placeholder="-" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trọng lượng <span className="text-red-500">*</span></label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" defaultValue="0.000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá <span className="text-red-500">*</span></label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" defaultValue="0.000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày dự kiến giao <span className="text-red-500">*</span></label>
            <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" defaultValue="2026-05-15" />
          </div>

          {/* Row 4 */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm" placeholder="Nhập ghi chú..."></textarea>
          </div>
        </div>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-base font-semibold leading-6 text-[#005a46]">Thông tin đơn hàng</h3>
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </button>
            <button className="flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-[#005a46] hover:bg-[#004737]">
              <Plus className="h-4 w-4 mr-2" />
              Thêm SP mới
            </button>
          </div>
        </div>
        
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
          <div className="flex space-x-6">
            <button className="text-[#005a46] border-b-2 border-[#005a46] pb-2 text-sm font-medium">C01 (1)</button>
            <button className="text-gray-500 hover:text-gray-700 border-b-2 border-transparent pb-2 text-sm font-medium">C02 (1)</button>
            <button className="text-gray-500 hover:text-gray-700 border-b-2 border-transparent pb-2 text-sm font-medium">C03 (1)</button>
            <button className="text-gray-400 hover:text-gray-600 pb-2"><Plus className="h-5 w-5" /></button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700">Ngày dự kiến giao hàng</label>
                <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Mã sản phẩm <span className="text-red-500">*</span></label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" placeholder="Nhập hoặc quét mã đơn hàng" />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["STT", "Hình Ảnh", "Mã Drawing", "Mã Item", "Màu xi", "Màu đá", "Ni/Size", "Số lượng", "Yêu cầu KH", "Ghi chú", "Trạng thái", "Trọng lượng", "Đơn giá"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{col}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">RG202500006</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select className="border-gray-300 rounded-md text-sm border p-1"><option>X</option></select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select className="border-gray-300 rounded-md text-sm border p-1"><option>Xanh</option></select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">45</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <input type="number" defaultValue="2" className="w-16 border-gray-300 rounded-md text-sm border p-1" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <select className="border-gray-300 rounded-md text-sm border p-1"><option>Làm kỹ</option></select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <input type="text" placeholder="Nhập ghi chú" className="w-24 border-gray-300 rounded-md text-sm border p-1" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">32g</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1.555</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 p-4 flex justify-end space-x-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className="px-6 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          Hủy
        </button>
        <button className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#005a46] hover:bg-[#004737]">
          Xác nhận
        </button>
      </div>
    </div>
  );
}
