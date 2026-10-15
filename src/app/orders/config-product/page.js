"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  CheckSquare, 
  Square, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Eye,
  Info
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { PRODUCT_CATALOGUE_CONFIG_LIST } from "@/data/productVersionConfigData";

export default function ConfigProductPage() {
  const [products, setProducts] = useState(PRODUCT_CATALOGUE_CONFIG_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => {
    // Mặc định chọn các item đang có isPublishedToEC = true
    const initialSelected = new Set(
      PRODUCT_CATALOGUE_CONFIG_LIST.filter(p => p.isPublishedToEC).map(p => p.id)
    );
    return initialSelected;
  });
  const [filterType, setFilterType] = useState("ALL"); // ALL | OLD_ITEMS | NEW_ITEMS | PUBLISHED | UNPUBLISHED
  const [toastMessage, setToastMessage] = useState("");
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // Xử lý tìm kiếm đa trường: Mã item, Mã item cũ, Mã Drawing, Ghi chú, Loại sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Lọc theo tab/loại
      if (filterType === "OLD_ITEMS" && !item.isOldItem && !item.oldItemCode?.startsWith("PW")) return false;
      if (filterType === "NEW_ITEMS" && item.isOldItem) return false;
      if (filterType === "PUBLISHED" && !selectedIds.has(item.id)) return false;
      if (filterType === "UNPUBLISHED" && selectedIds.has(item.id)) return false;

      // 2. Lọc theo chuỗi tìm kiếm (Search Query)
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchItemCode = item.itemCode?.toLowerCase().includes(q);
      const matchOldCode = item.oldItemCode?.toLowerCase().includes(q);
      const matchDrawing = item.drawingCode?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      const matchType = item.productType?.toLowerCase().includes(q);
      const matchVersion = item.versionLabel?.toLowerCase().includes(q);

      return matchItemCode || matchOldCode || matchDrawing || matchNotes || matchType || matchVersion;
    });
  }, [products, searchQuery, filterType, selectedIds]);

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
    setToastMessage(`Đã cập nhật xuất bản thành công! ${count} sản phẩm/phiên bản sẽ hiển thị trên E-Catalogue.`);
    setTimeout(() => setToastMessage(""), 4500);
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-sans antialiased overflow-hidden">
      {/* 1. Sidebar Quản lý đơn hàng */}
      <Sidebar />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Breadcrumb */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <span className="text-gray-400">Cấu hình</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-800 font-bold">Cấu hình sản phẩm</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Danh sách sản phẩm
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/product-management/change-types"
              className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors"
              title="Xem cấu hình loại thay đổi có cờ Routing tại QLSP"
            >
              <span>⚙️ Sang QLSP: Cấu hình loại thay đổi</span>
            </Link>

            <Link
              href="/catalogue/product/set-1"
              target="_blank"
              className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Xem trực tiếp trên E-Catalogue</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Toast thông báo */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3.5 bg-emerald-700 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 bg-emerald-500 rounded-full p-0.5 text-white" />
              <span>{toastMessage}</span>
            </div>
            <Link
              href="/catalogue/product/set-1"
              className="underline hover:text-emerald-200 font-bold ml-4 shrink-0 flex items-center space-x-1"
            >
              <span>Kiểm tra ngay</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <div className="p-6 space-y-4 flex-1 flex flex-col min-w-0">
          {/* Card Tiêu đề & Thanh Search Đa Năng */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center space-x-2">
                  <span>Cấu hình sản phẩm</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Cổng duyệt xuất bản E-Catalogue
                  </span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chọn các Item và Drawing Version hợp lệ để kích hoạt hiển thị cho Sale và Khách hàng trên E-Catalogue.
                </p>
              </div>

              {/* Nút Cập nhật xuất bản */}
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>Cập nhật ({selectedIds.size} đã chọn)</span>
                </button>
              </div>
            </div>

            {/* Thanh Tìm Kiếm Đa Trường có Ghi chú đỏ theo đúng ảnh thực tế của Chị đẹp */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 pt-1 border-t border-gray-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo Mã item / Mã Drawing"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Ghi chú đỏ nổi bật theo đúng yêu cầu */}
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg shrink-0">
                <Info className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>Cho phép search item cũ, item mới, ghi chú, ..</span>
              </div>
            </div>

            {/* Filter Chips hỗ trợ thao tác nhanh */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-gray-400 font-bold mr-1">Lọc nhanh:</span>
              <button
                type="button"
                onClick={() => setFilterType("ALL")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === "ALL"
                    ? "bg-[#005a46] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tất cả ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("PUBLISHED")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === "PUBLISHED"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                Đang bật trên EC ({selectedIds.size})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("UNPUBLISHED")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === "UNPUBLISHED"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Chưa bật ({products.length - selectedIds.size})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("OLD_ITEMS")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === "OLD_ITEMS"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                Mã Item cũ (PW...)
              </button>
              <button
                type="button"
                onClick={() => setFilterType("NEW_ITEMS")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === "NEW_ITEMS"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
                }`}
              >
                Mã Item mới (GY...)
              </button>
            </div>
          </div>

          {/* Bảng Dữ Liệu Sản Phẩm Khớp 100% Ảnh 3 của Chị đẹp */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-left text-xs">
                {/* Header Bảng */}
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
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
                    <th className="px-3 py-3 min-w-[240px]">Mã item (30 ký tự)</th>
                    <th className="px-3 py-3 min-w-[130px]">Mã drawing</th>
                    <th className="w-18 px-2 py-3 text-center">Hình render</th>
                    <th className="w-18 px-2 py-3 text-center">Hình 4view</th>
                    <th className="px-3 py-3 min-w-[120px]">Loại sản phẩm</th>
                    <th className="px-3 py-3 text-right min-w-[110px]">Trọng lượng vàng</th>
                    <th className="px-3 py-3 min-w-[110px]">Loại phụ liệu chính</th>
                    <th className="px-3 py-3 min-w-[110px]">Loại phụ liệu phụ</th>
                    <th className="px-3 py-3 min-w-[140px] text-center">Hiển thị EC</th>
                    <th className="w-16 px-2 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                {/* Body Bảng */}
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-gray-400 text-xs">
                        Không tìm thấy sản phẩm nào khớp với từ khóa "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p, idx) => {
                      const isSelected = selectedIds.has(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-emerald-50/40 transition-colors ${
                            isSelected ? "bg-emerald-50/20" : ""
                          }`}
                        >
                          {/* Checkbox chọn */}
                          <td className="px-3 py-2.5 text-center">
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
                          <td className="px-2 py-2.5 text-center font-medium text-gray-500">
                            {idx + 1}
                          </td>

                          {/* Mã item */}
                          <td className="px-3 py-2.5">
                            <div className="font-mono text-[11px] font-bold text-gray-900 break-all">
                              {p.itemCode}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5 flex items-center space-x-1.5">
                              {p.isOldItem && (
                                <span className="bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">
                                  Item Cũ
                                </span>
                              )}
                              <span>{p.notes}</span>
                            </div>
                          </td>

                          {/* Mã drawing */}
                          <td className="px-3 py-2.5">
                            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {p.drawingCode}
                            </span>
                            <div className="text-[10px] text-gray-500 mt-0.5">
                              {p.versionLabel}
                            </div>
                          </td>

                          {/* Hình render */}
                          <td className="px-2 py-2 text-center">
                            <div 
                              onClick={() => setPreviewImageModal(p.renderImage)}
                              className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all flex items-center justify-center group"
                              title="Click để phóng to ảnh render"
                            >
                              <img
                                src={p.renderImage}
                                alt="render"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                          </td>

                          {/* Hình 4view */}
                          <td className="px-2 py-2 text-center">
                            <div 
                              onClick={() => setPreviewImageModal(p.fourViewImage)}
                              className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all flex items-center justify-center group"
                              title="Click để phóng to ảnh 4view"
                            >
                              <img
                                src={p.fourViewImage}
                                alt="4view"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                          </td>

                          {/* Loại sản phẩm */}
                          <td className="px-3 py-2.5 text-gray-700 font-medium">
                            {p.productType}
                          </td>

                          {/* Trọng lượng vàng */}
                          <td className="px-3 py-2.5 text-right font-mono text-gray-800 font-semibold">
                            {p.goldWeight}
                          </td>

                          {/* Loại phụ liệu chính */}
                          <td className="px-3 py-2.5 text-gray-600">
                            {p.mainSubMaterial}
                          </td>

                          {/* Loại phụ liệu phụ */}
                          <td className="px-3 py-2.5 text-gray-600">
                            {p.extraSubMaterial}
                          </td>

                          {/* Trạng thái hiển thị E-Catalogue */}
                          <td className="px-3 py-2.5 text-center">
                            {isSelected ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <Check className="h-3 w-3" />
                                <span>Hiện trên EC</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                                Ẩn
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-2 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(p.id)}
                              className="p-1 text-gray-400 hover:text-emerald-700 rounded hover:bg-gray-100 cursor-pointer"
                              title={isSelected ? "Bỏ chọn hiển thị" : "Bật hiển thị lên EC"}
                            >
                              <Layers className="h-4 w-4" />
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
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Hiển thị 1 - {filteredProducts.length} trong tổng số {products.length} sản phẩm</span>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-emerald-700">Đã chọn: {selectedIds.size} item</span>
              </div>

              <div className="flex items-center space-x-1 text-xs font-semibold">
                <span className="px-2 py-1 bg-emerald-700 text-white rounded">1</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">2</span>
                <span className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded cursor-pointer">3</span>
                <span className="text-gray-400 px-1">...</span>
                <span className="text-gray-500 text-[11px] ml-2">20 / trang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Phóng To Hình Ảnh */}
        {previewImageModal && (
          <div 
            onClick={() => setPreviewImageModal(null)}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
          >
            <div className="bg-white p-2 rounded-2xl max-w-lg shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <img src={previewImageModal} alt="Preview" className="w-full h-auto rounded-xl object-contain max-h-[80vh]" />
              <button 
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
