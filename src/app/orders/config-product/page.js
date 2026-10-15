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
  ShoppingBag,
  X,
  ArrowLeft,
  Eye,
  Layers
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

  // Modal 4view 4 góc nhìn chuẩn Video frame 04
  const [view4ModalItem, setView4ModalItem] = useState(null);

  // Modal Chi tiết sản phẩm chuẩn Video frame 12
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Xử lý tìm kiếm đa trường
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((item) => {
      const matchItemCode = item.itemCode?.toLowerCase().includes(q);
      const matchOldCode = item.oldItemCode?.toLowerCase().includes(q);
      const matchDrawing = item.drawingCode?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      const matchType = item.productType?.toLowerCase().includes(q);
      const matchCreator = item.creator?.toLowerCase().includes(q);
      const matchStatus = item.status?.toLowerCase().includes(q);
      return matchItemCode || matchOldCode || matchDrawing || matchNotes || matchType || matchCreator || matchStatus;
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
      {/* 1. Breadcrumb chuẩn khớp Video thực tế */}
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

      {/* 3. Card chính: Tiêu đề, Thanh Search & Bảng khớp chuẩn Video thực tế */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Tiêu đề trang */}
        <div className="px-5 pt-4 pb-2">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Cấu hình sản phẩm
          </h1>
        </div>

        {/* Thanh công cụ: Search bên trái, Cập nhật + Lọc bên phải */}
        <div className="px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
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

        {/* Bảng Danh Sách Sản Phẩm - ĐẦY ĐỦ CÁC CỘT THỰC TẾ THEO VIDEO CỦA CHỊ ĐẸP */}
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
                <th className="px-3 py-3 min-w-[120px]">Màu phụ liệu chính</th>
                <th className="px-3 py-3 min-w-[120px]">Màu phụ liệu phụ</th>
                <th className="px-2 py-3 text-center min-w-[80px]">Cấp đá</th>
                <th className="px-3 py-3 text-center min-w-[110px]">E-Catalogue</th>
                <th className="px-3 py-3 min-w-[110px]">Ngày tạo</th>
                <th className="px-3 py-3 min-w-[140px]">Người tạo</th>
                <th className="px-3 py-3 min-w-[130px] text-center">Trạng thái</th>
                <th className="w-16 px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={18} className="py-12 text-center text-gray-400 text-xs">
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
                      {/* 1. Checkbox chọn */}
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

                      {/* 2. STT */}
                      <td className="px-2 py-3 text-center font-medium text-gray-500">
                        {idx + 1}
                      </td>

                      {/* 3. Mã item (30 ký tự) */}
                      <td className="px-3 py-3 font-mono text-[11px] font-medium text-gray-900 break-all">
                        {p.itemCode}
                      </td>

                      {/* 4. Mã drawing */}
                      <td className="px-3 py-3 font-mono text-xs font-semibold text-gray-800">
                        {p.drawingCode}
                      </td>

                      {/* 5. Hình render */}
                      <td className="px-2 py-2 text-center">
                        <div
                          onClick={() => setDetailModalItem(p)}
                          className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:border-emerald-600 hover:shadow-xs transition-all flex items-center justify-center bg-gray-50"
                          title="Bấm để xem chi tiết sản phẩm"
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

                      {/* 6. Hình 4view - Bấm vào mở Modal 4 góc nhìn chuẩn Video frame 04 */}
                      <td className="px-2 py-2 text-center">
                        <div
                          onClick={() => setView4ModalItem(p)}
                          className="w-10 h-10 rounded-md border border-gray-200 overflow-hidden mx-auto cursor-pointer hover:border-emerald-600 hover:ring-2 hover:ring-emerald-500/30 transition-all flex items-center justify-center bg-gray-50 group relative"
                          title="Click xem 4 góc nhìn (Mặt trước, Góc nghiêng, Mặt sau, Mặt bên)"
                        >
                          <img
                            src={p.fourViewImage}
                            alt="4view"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/products/4view-technical.svg";
                            }}
                            className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-0 right-0 bg-emerald-800 text-[8px] text-white font-bold px-0.5 rounded-tl leading-none">
                            4V
                          </span>
                        </div>
                      </td>

                      {/* 7. Loại sản phẩm */}
                      <td className="px-3 py-3 text-gray-700 font-medium">
                        {p.productType}
                      </td>

                      {/* 8. Trọng lượng vàng */}
                      <td className="px-3 py-3 text-right font-mono text-gray-800">
                        {p.goldWeight}
                      </td>

                      {/* 9. Loại phụ liệu chính */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.mainSubMaterial}
                      </td>

                      {/* 10. Loại phụ liệu phụ */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.extraSubMaterial}
                      </td>

                      {/* 11. Màu phụ liệu chính (mới từ video) */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.mainSubMaterialColor}
                      </td>

                      {/* 12. Màu phụ liệu phụ (mới từ video) */}
                      <td className="px-3 py-3 text-gray-600">
                        {p.extraSubMaterialColor}
                      </td>

                      {/* 13. Cấp chất lượng đá (mới từ video) */}
                      <td className="px-2 py-3 text-center font-mono text-gray-700">
                        {p.stoneQualityGrade}
                      </td>

                      {/* 14. Cột E-Catalogue (Checkbox xanh lá hiển thị trực tiếp theo video frame 08) */}
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(p.id)}
                          className="cursor-pointer"
                          title={isSelected ? "Đang bật trên EC (Click để tắt)" : "Chưa bật (Click để bật)"}
                        >
                          {isSelected ? (
                            <div className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-xs">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border border-gray-300 bg-white hover:border-emerald-600 flex items-center justify-center mx-auto" />
                          )}
                        </button>
                      </td>

                      {/* 15. Ngày tạo (mới từ video) */}
                      <td className="px-3 py-3 font-mono text-[11px] text-gray-600">
                        {p.createdDate}
                      </td>

                      {/* 16. Người tạo (mới từ video) */}
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                            {p.creator?.charAt(0)}
                          </div>
                          <span className="text-gray-700 truncate max-w-[110px]">{p.creator}</span>
                        </div>
                      </td>

                      {/* 17. Trạng thái (mới từ video) */}
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center space-x-1.5 text-[11px] font-medium">
                          <span className={`w-2 h-2 rounded-full ${p.statusColor || "bg-gray-400"}`} />
                          <span className="text-gray-700">{p.status}</span>
                        </span>
                      </td>

                      {/* 18. Actions - Click xem chi tiết sản phẩm theo frame 12 */}
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setDetailModalItem(p)}
                          className="p-1 text-gray-400 hover:text-emerald-700 rounded hover:bg-gray-100 cursor-pointer"
                          title="Xem chi tiết sản phẩm"
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
            <span>Đã kích hoạt trên E-Catalogue: <strong className="text-emerald-800 font-bold">{selectedIds.size}</strong> sản phẩm</span>
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

      {/* ============================================================ */}
      {/* 4. MODAL POPUP HÌNH 4VIEW (4 GÓC NHÌN) CHUẨN 100% VIDEO FRAME 04 */}
      {/* ============================================================ */}
      {view4ModalItem && (
        <div 
          onClick={() => setView4ModalItem(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden cursor-default relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <span className="text-emerald-700">:::</span>
                <span>HÌNH ẢNH 4VIEW • {view4ModalItem.drawingCode}</span>
              </div>
              <button
                type="button"
                onClick={() => setView4ModalItem(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lưới 2x2 đúng 4 góc nhìn: 1. Mặt trước, 2. Góc nghiêng, 3. Mặt sau, 4. Mặt bên */}
            <div className="p-4 grid grid-cols-2 gap-3 bg-white">
              {(view4ModalItem.views4 || [
                { id: 1, title: "1. Mặt trước", img: view4ModalItem.renderImage },
                { id: 2, title: "2. Góc nghiêng", img: view4ModalItem.fourViewImage },
                { id: 3, title: "3. Mặt sau", img: view4ModalItem.renderImage },
                { id: 4, title: "4. Mặt bên", img: view4ModalItem.fourViewImage }
              ]).map((view) => (
                <div key={view.id} className="border border-gray-200 rounded-xl p-2 flex flex-col items-center bg-gray-50/40 hover:border-emerald-500 transition-colors">
                  <div className="w-full h-36 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img 
                      src={view.img} 
                      alt={view.title} 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 mt-2 block">
                    {view.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between items-center">
              <span>Mã item: <strong className="font-mono text-gray-800">{view4ModalItem.itemCode}</strong></span>
              <button
                type="button"
                onClick={() => setView4ModalItem(null)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL CHI TIẾT SẢN PHẨM CHUẨN 100% VIDEO FRAME 12           */}
      {/* ============================================================ */}
      {detailModalItem && (
        <div 
          onClick={() => setDetailModalItem(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer overflow-y-auto"
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden cursor-default relative border border-gray-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Chi tiết */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Cấu hình sản phẩm &gt; Chi tiết cấu hình sản phẩm
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">
                  CHI TIẾT SẢN PHẨM: {detailModalItem.drawingCode}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại</span>
              </button>
            </div>

            {/* Nội dung chi tiết khớp frame 12 */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Khung hình ảnh: Hình render & Hình 4view */}
              <div>
                <h3 className="font-bold text-gray-800 text-xs mb-2">Hình ảnh</h3>
                <div className="flex items-center space-x-4">
                  {/* Cột 1: Render */}
                  <div className="border border-gray-200 rounded-xl p-2 w-32 flex flex-col items-center bg-gray-50/50">
                    <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                      <img src={detailModalItem.renderImage} alt="render" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium mt-1.5">Hình render</span>
                  </div>

                  {/* Cột 2: 4view */}
                  <div 
                    onClick={() => {
                      setView4ModalItem(detailModalItem);
                    }}
                    className="border border-gray-200 hover:border-emerald-600 rounded-xl p-2 w-32 flex flex-col items-center bg-gray-50/50 cursor-pointer transition-colors"
                  >
                    <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                      <img src={detailModalItem.fourViewImage} alt="4view" className="w-full h-full object-contain p-1" />
                    </div>
                    <span className="text-[11px] text-emerald-800 font-semibold mt-1.5 flex items-center space-x-1">
                      <span>Hình 4view</span>
                      <Eye className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bảng Thuộc tính khớp chuẩn frame 12 */}
              <div>
                <h3 className="font-bold text-gray-800 text-xs mb-2">Thuộc tính kỹ thuật</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                  {[
                    { label: "Mã item", value: detailModalItem.itemCode, isMono: true },
                    { label: "Mã Drawing", value: detailModalItem.drawingCode, isMono: true },
                    { label: "Mã bộ", value: detailModalItem.setSeriesCode || "---" },
                    { label: "Loại sản phẩm", value: detailModalItem.productType },
                    { label: "Bộ sưu tập", value: detailModalItem.collection || "Lumea" },
                    { label: "Dòng hàng", value: detailModalItem.productionLine || "---" },
                    { label: "Phương pháp sản xuất", value: detailModalItem.productionMethod || "---" },
                    { label: "Nguyên liệu", value: detailModalItem.material || "Vàng" },
                    { label: "Màu xi", value: detailModalItem.platingColor || "Vàng" },
                    { label: "Trọng lượng vàng", value: detailModalItem.goldWeight || "---" },
                    { label: "Loại phụ liệu chính", value: detailModalItem.mainSubMaterial },
                    { label: "Màu phụ liệu chính", value: detailModalItem.mainSubMaterialColor || "---" },
                    { label: "Cấp chất lượng đá", value: detailModalItem.stoneQualityGrade || "1" },
                    { label: "Trạng thái E-Catalogue", value: selectedIds.has(detailModalItem.id) ? "Đang bật hiển thị trên E-Catalogue" : "Chưa kích hoạt" }
                  ].map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-3 px-4 py-2 hover:bg-gray-50/60">
                      <span className="text-gray-500 font-medium">{row.label}</span>
                      <span className={`col-span-2 text-gray-900 font-semibold ${row.isMono ? "font-mono text-[11px] break-all" : ""}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal Chi tiết */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
