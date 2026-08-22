"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2, Save, Send, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CreateCancelRequest() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    requestCode: "YCH-2026-006",
    soCode: "CO2806 001",
    requester: "Nguyễn Văn An",
    requestDate: new Date().toISOString().split("T")[0],
    approver: "Trần Thị Bích",
    approveDate: "",
    generalReason: "Khách hàng yêu cầu thay đổi thiết kế và hủy các mã cũ",
  });

  // Subtable State
  const [items, setItems] = useState([
    {
      id: 1,
      itemCode: "ITM-RING-61Y-01",
      moCode: "MO-2026-8891",
      qty: 2,
      reason: "Khách đổi sang ni 48",
    },
    {
      id: 2,
      itemCode: "ITM-BRAC-75Y-04",
      moCode: "MO-2026-8892",
      qty: 3,
      reason: "Khách hủy mẫu lắc tay",
    },
  ]);

  const [notification, setNotification] = useState(null);

  // Tính tổng SL hủy từ Subtable
  const totalCancelQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      itemCode: `ITM-ITEM-0${items.length + 1}`,
      moCode: `MO-2026-889${items.length + 3}`,
      qty: 1,
      reason: "Khách yêu cầu hủy",
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) {
      alert("Yêu cầu hủy cần tối thiểu ít nhất 1 sản phẩm chi tiết!");
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotification({
      type: "success",
      message: `Đã tạo thành công yêu cầu hủy "${formData.requestCode}" với tổng số lượng hủy là ${totalCancelQty} SP! Đang chuyển hướng...`,
    });
    setTimeout(() => {
      router.push("/cancel-requests");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/cancel-requests"
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-1.5 shadow-sm transition"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách
          </Link>
          <span className="text-gray-300">|</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tạo mới yêu cầu hủy SO</h1>
            <p className="text-xs text-gray-500">Nhập thông tin yêu cầu và chi tiết các mã sản phẩm cần hủy</p>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-md flex items-center space-x-3 ${
            notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Card 1: Thông tin chung */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#005a46]"></div>
            <h2 className="text-base font-semibold text-gray-900">1. Thông tin chung</h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">Trường có dấu (*) là bắt buộc</span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mã yêu cầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã yêu cầu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              value={formData.requestCode}
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm text-gray-700 font-semibold focus:outline-none cursor-not-allowed"
            />
            <span className="text-xs text-gray-400">Mã sinh tự động theo quy chuẩn</span>
          </div>

          {/* Mã SO */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã SO cần hủy <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.soCode}
              onChange={(e) => setFormData({ ...formData, soCode: e.target.value })}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm font-medium"
            >
              <option value="CO2806 001">CO2806 001 (Khách VIP 1 - 10 SP)</option>
              <option value="CO2806 002">CO2806 002 (Nguyễn Văn A - 5 SP)</option>
              <option value="CO2806 003">CO2806 003 (Đại lý X - 20 SP)</option>
              <option value="CO2806 004">CO2806 004 (Chị Hạnh - 2 SP)</option>
              <option value="CO2806 005">CO2806 005 (Anh Tú - 15 SP)</option>
            </select>
          </div>

          {/* Tổng SL hủy */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tổng SL hủy <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                readOnly
                value={totalCancelQty}
                className="block w-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold rounded-md py-2 px-3 text-sm focus:outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-xs text-emerald-600 font-semibold">Sản phẩm</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">Tự động cộng dồn từ bảng Subtable</span>
          </div>

          {/* Người yêu cầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Người yêu cầu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.requester}
              onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm"
            />
          </div>

          {/* Ngày yêu cầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày yêu cầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm"
            />
          </div>

          {/* Người phê duyệt */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Người phê duyệt dự kiến <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.approver}
              onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm"
            >
              <option value="Trần Thị Bích">Trần Thị Bích (Trưởng phòng Kinh doanh)</option>
              <option value="Đặng Quốc Cường">Đặng Quốc Cường (Giám đốc Kỹ thuật)</option>
              <option value="Hoàng Văn Nam">Hoàng Văn Nam (Quản đốc Xưởng)</option>
            </select>
          </div>

          {/* Ngày phê duyệt */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày phê duyệt</label>
            <input
              type="date"
              value={formData.approveDate}
              onChange={(e) => setFormData({ ...formData, approveDate: e.target.value })}
              placeholder="Để trống nếu đang chờ duyệt"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm text-gray-500"
            />
            <span className="text-xs text-gray-400">Sẽ được cập nhật khi Quản lý duyệt</span>
          </div>

          {/* Ghi chú chung */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Lý do tổng quan / Ghi chú</label>
            <input
              type="text"
              value={formData.generalReason}
              onChange={(e) => setFormData({ ...formData, generalReason: e.target.value })}
              placeholder="Nhập lý do tổng thể của đợt hủy này..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Subtable - Chi tiết sản phẩm hủy */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#005a46]"></div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">2. Chi tiết danh sách sản phẩm hủy (Subtable)</h2>
              <p className="text-xs text-gray-500">Khai báo chi tiết từng Item và Lệnh sản xuất (MO) cần hủy</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center px-3.5 py-1.5 bg-[#005a46] text-white text-xs font-semibold rounded-md hover:bg-[#004737] shadow-sm transition"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Thêm dòng sản phẩm
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Mã Item <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Mã MO (Lệnh SX) <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-36">
                  SL yêu cầu hủy <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Lý do hủy chi tiết <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Xóa</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium text-center">{index + 1}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.itemCode}
                      onChange={(e) => handleItemChange(item.id, "itemCode", e.target.value)}
                      placeholder="VD: ITM-RING-01"
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm focus:ring-[#005a46] focus:border-[#005a46]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.moCode}
                      onChange={(e) => handleItemChange(item.id, "moCode", e.target.value)}
                      placeholder="VD: MO-2026-001"
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm focus:ring-[#005a46] focus:border-[#005a46]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, "qty", parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm font-semibold text-gray-900 focus:ring-[#005a46] focus:border-[#005a46]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.reason}
                      onChange={(e) => handleItemChange(item.id, "reason", e.target.value)}
                      placeholder="Nhập lý do cụ thể..."
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm focus:ring-[#005a46] focus:border-[#005a46]"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold text-gray-900">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right text-sm">
                  Tổng cộng:
                </td>
                <td className="px-4 py-3 text-sm text-[#005a46] font-bold">
                  {totalCancelQty} SP
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 px-6 py-3.5 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.08)] z-10">
        <div className="flex items-center text-xs text-gray-500 space-x-1">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>Vui lòng kiểm tra kỹ số lượng trước khi gửi duyệt</span>
        </div>

        <div className="flex space-x-3">
          <Link
            href="/cancel-requests"
            className="px-5 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#005a46] hover:bg-[#004737] shadow-sm transition"
          >
            <Send className="h-4 w-4 mr-2" />
            Gửi yêu cầu phê duyệt
          </button>
        </div>
      </div>
    </div>
  );
}
