"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Check, 
  ChevronRight, 
  CheckSquare, 
  Square, 
  LayoutGrid,
  ShoppingBag
} from "lucide-react";
import { PRODUCT_CATALOGUE_CONFIG_LIST } from "@/data/productVersionConfigData";

export default function ConfigProductPage() {
  const [products, setProducts] = useState(PRODUCT_CATALOGUE_CONFIG_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => {
    // Mặc định chọn các item đang được cấu hình hiển thị trên EC
    return new Set(
      PRODUCT_CATALOGUE_CONFIG_LIST.filter(p => p.isPublishedToEC).map(p => p.id)
    );
  });
  const [toastMessage, setToastMessage] = useState("");
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // Xử lý tìm kiếm đa trường ngầm (theo item cũ, item mới, ghi chú, mã drawing) không cần hiển thị badge thừa
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((item) => {
      const matchItemCode = item.itemCode?.toLowerCase().includes(q);
      const matchOldCode = item.oldItemCode?.toLowerCase().includes(q);
      const matchDrawing = item.drawingCode?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      const matchType = item.productType?.toLowerCase().includes(q);
      const matchVersion = item.versionLabel?.toLowerCase().includes(q);
      return matchItemCode || matchOldCode || matchDrawing || matchNotes || matchType || matchVersion;
    });
  }, [products, searchQuery]);

  // Xử lý chọn / bỏ chọn từng dòng
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Xử lý chọn / bỏ chọn tất cả các dòng đang hiển thị
  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.has(p.id));

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        filteredProducts.forEach((p) => next.delete(p.id));
      } else {
        filteredProducts.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  // Nút Cập nhật (Publishing Gate)
  const handleUpdate = () => {
    setProducts((prev) =>
      prev.map((item) => ({
        ...item,
        isPublishedToEC: selectedIds.has(item.id)
      }))
    );
    const count = selectedIds.size;
    setToastMessage(`Đã cập nhật danh sách hiển thị trên E-Catalogue thành công (${count} sản phẩm/phiên bản).`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Breadcrumb chuẩn khớp Ảnh 3 */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <span>Cấu hình sản phẩm</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-gray-700 font-semibold">Danh sách sản phẩm</span>
      </div>

      {/* 2. Toast thông báo khi cập nhật */}
      {toastMessage && (
        <div className="p-3 bg-emerald-700 text-white rounded-lg shadow-sm flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 bg-emerald-500 rounded-full p-0.5 text-white" />
            <span>{toastMessage}</span>
          </div>
          <Link
            href="/catalogue/product/set-1"
            target="_blank"
            className="underline hover:text-emerald-200 font-bold ml-4"
          >
            Xem trên E-Catalogue ↗
          </Link>
        </div>
      )}

      {/* 3. Card chính: Tiêu đề, Thanh Search & Bảng khớp chuẩn 100% Ảnh 3 */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Tiêu đề trang */}
        <div className="px-5 pt-4 pb-2">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Cấu hình sản phẩm
          </h1>
        </div>

        {/* Thanh công cụ: Search bên trái, Cập nhật + Lọc bên phải */}
        <div className="px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
          {/* Ô tìm kiếm sạch sẽ, không có badge đỏ thừa */}
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo Mã item / Mã Drawing"
              className="w-full pl-9 pr-4 py-2 bg-gray-50/60 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-400 transition-all"
            />
          </div>

          {/* Cụm nút bấm góc phải */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={selectedIds.size === 0}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-2xs ${
                selectedIds.size > 0
                  ? "bg-[#005a46] hover:bg-[#004737] text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Cập nhật</span>
            </button>

            <button
              type="button"
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
              title="Bộ lọc"
            >
              <Filter className="h-4 w-4" />
            </button>

            <Link
              href="/catalogue"
              target="_blank"
              className="p-2 border border-emerald-600 bg-emerald-50 rounded-lg text-emerald-800 hover:bg-emerald-100 cursor-pointer"
              title="Mở E-Catalogue"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bảng Danh Sách Sản Phẩm Khớp 100% Ảnh 3 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-gray-500 hover:text-emerald-700 cursor-pointer"
                    title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="w-12 px-2 py-3 text-center">STT</th>
                <th className="px-3 py-3 min-w-[220px]">Mã item</th>
                <th className="px-3 py-3 min-w-[120px]">Mã drawing</th>
                <th className="w-20 px-2 py-3 text-center">Hình render</th>
                <th className="w-20 px-2 py-3 text-center">Hình 4view</th>
                <th className="px-3 py-3 min-w-[120px]">Loại sản phẩm</th>
                <th className="px-3 py-3 text-right min-w-[110px]">Trọng lượng vàng</th>
                <th className="px-3 py-3 min-w-[120px]">Loại phụ liệu chính</th>
                <th className="px-3 py-3 min-w-[120px]">Loại phụ liệu phụ</th>
                <th className="w-16 px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400 text-xs">
                    Không tìm thấy sản phẩm nào khớp với từ khóa tìm kiếm
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const isSelected = selectedIds.has(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-emerald-50/30 transition-colors ${
                        isSelected ? "bg-emerald-50/15" : ""
                      }`}
                    >
                      {/* Checkbox chọn */}
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(p.id)}
                          className="text-gray-400 hover:text-emerald-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-emerald-700" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-300" />
                          )}
                        </button>
                      </td>

                      {/* STT */}
                      <td className="px-2 py-3 text-center font-medium text-gray-500">
                        {idx + 1}
                      </td>

                      {/* Mã item (30 ký tự) */}
                      <td className="px-3 py-3 font-mono text-[11px] font-medium text-gray-900 break-all">
                        {p.itemCode}
                      </td>

                      {/* Mã drawing */}
                      <td className="px-3 py-3 font-mono text-xs font-semibold text-gray-800">
                        {p.drawingCode}
                      </td>

                      {/* Hình render (Ảnh nội bộ, có fallback an toàn không bao giờ vỡ) */}
                      <td className="px-2 py-2 text-center">
                        <div
                          onClick={() => setPreviewImageModal(p.renderImage)}
                          className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:border-emerald-600 hover:shadow-xs transition-all flex items-center justify-center bg-gray-50"
                          title="Bấm để xem ảnh lớn"
                        >
                          <img
                            src={p.renderImage}
                            alt="render"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/products/diamond-solitaire.svg";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Hình 4view (Ảnh nội bộ kỹ thuật chuẩn CAD, không bao giờ vỡ) */}
                      <td className="px-2 py-2 text-center">
                        <div
                          onClick={() => setPreviewImageModal(p.fourViewImage)}
                          className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:border-emerald-600 hover:shadow-xs transition-all flex items-center justify-center bg-gray-50"
                          title="Bấm để xem bản vẽ 4view"
                        >
                          <img
                            src={p.fourViewImage}
                            alt="4view"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/products/4view-technical.svg";
                            }}
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                      </td>

                      {/* Loại sản phẩm */}
                      <td className="px-3 py-3 text-gray-700">
                        {p.productType}
                      </td>

                      {/* Trọng lượng vàng */}
                      <td className="px-3 py-3 text-right font-mono text-gray-800">
                        {p.goldWeight}
                      </td>

                      {/* Loại phụ liệu chính */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.mainSubMaterial}
                      </td>

                      {/* Loại phụ liệu phụ */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.extraSubMaterial}
                      </td>

                      {/* Actions */}
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-emerald-700 rounded hover:bg-gray-100 cursor-pointer"
                          title="Tùy chọn"
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Phân trang */}
        <div className="bg-gray-50/80 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500">
          <div>
            <span>Đã chọn: <strong className="text-emerald-800">{selectedIds.size}</strong> sản phẩm đưa lên E-Catalogue</span>
          </div>

          <div className="flex items-center space-x-1 font-medium">
            <span className="px-2 py-1 bg-emerald-800 text-white rounded font-bold">1</span>
            <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">2</span>
            <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">3</span>
            <span className="text-gray-400 px-1">...</span>
            <span className="text-gray-500 text-[11px] ml-2">20 / trang</span>
          </div>
        </div>
      </div>

      {/* Modal xem trước ảnh lớn */}
      {previewImageModal && (
        <div 
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100 cursor-pointer"
        >
          <div className="bg-white p-3 rounded-xl max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <img src={previewImageModal} alt="Preview" className="w-full h-auto rounded-lg object-contain max-h-[75vh]" />
            <button 
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
