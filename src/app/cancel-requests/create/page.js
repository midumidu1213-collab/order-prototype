"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2, Send, AlertCircle, CheckCircle2 } from "lucide-react";

// Database chuẩn hóa mẫu theo quy chuẩn mới
const SO_DATABASE = {
  "SO2608001": {
    customer: "2000001 - Công ty TNHH Vàng Bạc Kim Yến",
    orderType: "Đơn hàng Bán",
    material: "Vàng",
    goldAge: "61Y",
    items: [
      { itemCode: "GY0RG000086A00A00CZGG3CZKK2008", itemName: "Nhẫn Kim Cương Vàng 61Y (Ni 48)", orderedQty: 5 },
      { itemCode: "GY0BC000012B00B00CZGG3CZKK1002", itemName: "Lắc Tay Nữ Ý 61Y (Size 16cm)", orderedQty: 3 },
      { itemCode: "GY0NE000099A00A00CZGG3CZKK3001", itemName: "Dây Chuyền Trơn 61Y (Dài 45cm)", orderedQty: 2 },
    ],
  },
  "SO2608002": {
    customer: "2000002 - DNTN Vàng Bạc Bảo Tín",
    orderType: "Đơn hàng Gia công",
    material: "Vàng",
    goldAge: "41.6Y",
    items: [
      { itemCode: "GY0RG000055A00A00CZGG3CZKK1001", itemName: "Nhẫn Nam Đính Đá Topaz 41.6Y", orderedQty: 3 },
      { itemCode: "GY0EA000033B00B00CZGG3CZKK2005", itemName: "Bông Tai Nụ Hoa 41.6Y", orderedQty: 2 },
    ],
  },
  "SO2608003": {
    customer: "2000003 - Tiệm Vàng Kim Thành Phát",
    orderType: "Đơn hàng Bán",
    material: "Vàng",
    goldAge: "75W",
    items: [
      { itemCode: "GW0RG000088A00A00CZGG3CZKK4000", itemName: "Bộ Nhẫn Cưới Vàng Trắng 75W", orderedQty: 10 },
      { itemCode: "GW0BC000077B00B00CZGG3CZKK5000", itemName: "Vòng Tay Bản Lớn 75W", orderedQty: 10 },
    ],
  },
  "SO2608004": {
    customer: "2000004 - Công ty CP Trang Sức PNJ Diamond",
    orderType: "Đơn hàng Gia công",
    material: "Bạc",
    goldAge: "Bạc Ý 925",
    items: [
      { itemCode: "SV0PD000021A00A00CZGG3CZKK1100", itemName: "Mặt Dây Chuyền Bạc Đính Đá CZ", orderedQty: 2 },
    ],
  },
  "SO2608005": {
    customer: "2000005 - Cửa hàng Vàng Bạc Đá Quý Minh Châu",
    orderType: "Đơn hàng Bán",
    material: "Vàng",
    goldAge: "61Y",
    items: [
      { itemCode: "GY0RG000091A00A00CZGG3CZKK9901", itemName: "Nhẫn Đính Hôn Solitaire 61Y", orderedQty: 8 },
      { itemCode: "GY0BR000044A00A00CZGG3CZKK8802", itemName: "Lắc Tay Tennis Kim Cương 61Y", orderedQty: 7 },
    ],
  },
};

export default function CreateCancelRequest() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    requestCode: "YCH-2026-006",
    soCode: "SO2608001",
    generalReason: "",
  });

  const selectedSO = SO_DATABASE[formData.soCode] || {
    customer: "-",
    orderType: "-",
    material: "-",
    goldAge: "-",
    items: [],
  };

  // Subtable State
  const [items, setItems] = useState([
    {
      id: 1,
      itemCode: "GY0RG000086A00A00CZGG3CZKK2008",
      orderedQty: 5,
      qty: 2,
      reason: "Hàng thương hiệu",
    },
    {
      id: 2,
      itemCode: "GY0BC000012B00B00CZGG3CZKK1002",
      orderedQty: 3,
      qty: 3,
      reason: "Khách yêu cầu giảm SL",
    },
  ]);

  const [notification, setNotification] = useState(null);

  // Khi đổi SO -> load item của SO đó
  const handleSOChange = (newSOCode) => {
    setFormData((prev) => ({ ...prev, soCode: newSOCode }));
    const soData = SO_DATABASE[newSOCode];
    if (soData && soData.items.length > 0) {
      setItems([
        {
          id: Date.now(),
          itemCode: soData.items[0].itemCode,
          orderedQty: soData.items[0].orderedQty,
          qty: 1,
          reason: "",
        },
      ]);
    } else {
      setItems([]);
    }
  };

  // Tính tổng SL hủy từ Subtable
  const totalCancelQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const handleAddItem = () => {
    const availableItems = selectedSO.items;
    const defaultItem = availableItems[0] || { itemCode: "", orderedQty: 1 };

    const newItem = {
      id: Date.now(),
      itemCode: defaultItem.itemCode,
      orderedQty: defaultItem.orderedQty,
      qty: 1,
      reason: "",
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
    if (field === "itemCode") {
      const matchedItem = selectedSO.items.find((it) => it.itemCode === value);
      const orderedQty = matchedItem ? matchedItem.orderedQty : 1;
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, itemCode: value, orderedQty: orderedQty, qty: 1 } : item
        )
      );
    } else {
      setItems(
        items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.generalReason.trim()) {
      setNotification({
        type: "error",
        message: "Vui lòng nhập 'Lý do hủy chung' trước khi gửi phê duyệt!",
      });
      return;
    }

    setNotification({
      type: "success",
      message: `Đã tạo thành công yêu cầu hủy "${formData.requestCode}" cho đơn hàng "${formData.soCode}" với tổng số lượng hủy là ${totalCancelQty} SP! Đang chuyển hướng...`,
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
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
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

          {/* Mã SO cần hủy */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã SO cần hủy <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.soCode}
              onChange={(e) => handleSOChange(e.target.value)}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm font-semibold text-[#005a46]"
            >
              <option value="SO2608001">SO2608001 (2000001 - Vàng Kim Yến)</option>
              <option value="SO2608002">SO2608002 (2000002 - Bảo Tín)</option>
              <option value="SO2608003">SO2608003 (2000003 - Kim Thành Phát)</option>
              <option value="SO2608004">SO2608004 (2000004 - PNJ Diamond)</option>
              <option value="SO2608005">SO2608005 (2000005 - Minh Châu)</option>
            </select>
          </div>

          {/* Mã - Tên Khách hàng (Tự động từ SO) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã - Tên Khách hàng (Tự động)
            </label>
            <input
              type="text"
              readOnly
              value={selectedSO.customer}
              className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm font-medium text-gray-800 focus:outline-none cursor-not-allowed truncate"
              title={selectedSO.customer}
            />
            <span className="text-xs text-gray-400">Tự động lấy thông tin từ SO gốc</span>
          </div>

          {/* Thông tin đơn hàng gốc: Loại đơn & Chất liệu / Tuổi vàng */}
          <div className="md:col-span-3 bg-emerald-50/50 border border-emerald-200 rounded-md p-3 flex flex-wrap gap-4 text-xs text-emerald-950 font-medium">
            <div>
              <span className="text-gray-500">Loại đơn hàng: </span>
              <span className="font-bold text-[#005a46]">{selectedSO.orderType}</span>
            </div>
            <div>
              <span className="text-gray-500">Nguyên liệu: </span>
              <span className="font-bold text-[#005a46]">{selectedSO.material}</span>
            </div>
            <div>
              <span className="text-gray-500">Tuổi vàng: </span>
              <span className="font-bold text-[#005a46]">{selectedSO.goldAge}</span>
            </div>
          </div>

          {/* Lý do hủy chung (BẮT BUỘC) */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Lý do hủy chung <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.generalReason}
              onChange={(e) => setFormData({ ...formData, generalReason: e.target.value })}
              placeholder="VD: Khách hàng yêu cầu thay đổi thiết kế / Giảm ngân sách đặt hàng..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[#005a46] focus:border-[#005a46] sm:text-sm font-medium text-gray-900"
            />
            <span className="text-xs text-gray-400">Bắt buộc nhập lý do tổng quát cho đợt yêu cầu hủy này</span>
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
              <p className="text-xs text-gray-500">
                Chọn sản phẩm có trong đơn hàng <b>{formData.soCode}</b> và nhập số lượng cần hủy
              </p>
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
                  Mã Item (Trong đơn hàng) <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-36">
                  SL đặt trong SO
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-40">
                  SL yêu cầu hủy <span className="text-red-500">*</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Lý do hủy chi tiết <span className="text-xs text-gray-400 font-normal">(Không bắt buộc)</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Xóa</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium text-center">{index + 1}</td>

                  {/* Mã Item: Dropdown hiển thị các Item có trong SO */}
                  <td className="px-4 py-3">
                    <select
                      value={item.itemCode}
                      onChange={(e) => handleItemChange(item.id, "itemCode", e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm font-medium text-gray-900 focus:ring-[#005a46] focus:border-[#005a46] bg-white"
                    >
                      {selectedSO.items.map((soItem) => (
                        <option key={soItem.itemCode} value={soItem.itemCode}>
                          {soItem.itemCode} - {soItem.itemName}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* SL đặt trong SO */}
                  <td className="px-4 py-3 text-center">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-sm font-semibold">
                      {item.orderedQty || selectedSO.items.find((it) => it.itemCode === item.itemCode)?.orderedQty || "-"} SP
                    </span>
                  </td>

                  {/* SL yêu cầu hủy */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      max={item.orderedQty || 999}
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, "qty", parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm font-bold text-emerald-800 focus:ring-[#005a46] focus:border-[#005a46] bg-emerald-50/50"
                    />
                  </td>

                  {/* Lý do hủy chi tiết (Không bắt buộc) */}
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.reason}
                      onChange={(e) => handleItemChange(item.id, "reason", e.target.value)}
                      placeholder="VD: Khách đổi ni tay, giảm ngân sách..."
                      className="w-full border border-gray-300 rounded-md py-1.5 px-2.5 text-sm focus:ring-[#005a46] focus:border-[#005a46]"
                    />
                  </td>

                  {/* Xóa dòng */}
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
            <tfoot className="bg-gray-50 font-semibold text-gray-900 border-t border-gray-200">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right text-sm">
                  Tổng SL yêu cầu hủy:
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
          <span>Kiểm tra chính xác danh sách mã Item trước khi gửi phê duyệt</span>
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
