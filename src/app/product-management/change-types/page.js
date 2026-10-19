"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Box, 
  Search, 
  Plus, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  ChevronDown,
  Bell,
  X,
  FileText,
  ListFilter,
  CheckCircle2,
  TableProperties
} from "lucide-react";
import { CHANGE_TYPES_CONFIG, ATTRIBUTE_CHANGE_CONFIGS } from "@/data/productVersionConfigData";

export default function ProductManagementChangeTypesPage() {
  const [changeTypes, setChangeTypes] = useState(CHANGE_TYPES_CONFIG);
  const [activeViewTab, setActiveViewTab] = useState("attributes"); // Mặc định hiển thị tab Ma trận thuộc tính theo yêu cầu của Chị đẹp
  const [searchQuery, setSearchQuery] = useState("");
  
  // Khởi tạo từ localStorage nếu có để đồng bộ tức thì sang E-Catalogue
  useEffect(() => {
    try {
      const saved = localStorage.getItem("SEVAGO_CHANGE_TYPES_CONFIG");
      if (saved) {
        setChangeTypes(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load change types from localStorage", e);
    }
  }, []);

  // State quản lý Modal Cập nhật / Thêm mới loại thay đổi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit"); // "edit" | "create"
  const [toastMessage, setToastMessage] = useState("");

  // Form State cho Modal
  const [formData, setFormData] = useState({
    stt: 1,
    code: "",
    name: "",
    status: "Hoạt động",
    // 2 TRƯỜNG CHỌN MỚI BỔ SUNG THEO YÊU CẦU:
    hasTextInput: false, // Nhập chi tiết thay đổi: nhập mô tả thay đổi cho loại thay đổi
    hasCustomSelection: true, // Chọn chi tiết thay đổi: chọn tùy biến thay đổi
    // CẤU HÌNH YÊU CẦU THAY ĐỔI KHÁC (E-CATALOGUE) THEO YÊU CẦU:
    // "not_allowed" (Không được phép) | "optional" (Được phép/không bắt buộc) | "required" (Bắt buộc thay đổi)
    otherChangeConfig: "optional",
    // Phạm vi áp dụng
    productTypes: [
      { code: "AB", name: "Lắc chân nữ", client: true },
      { code: "BF", name: "Lắc dây máy", client: false },
      { code: "BK", name: "Lắc trẻ em", client: false },
      { code: "BM", name: "Lắc tay nam", client: false },
      { code: "BT", name: "Lắc tay nữ", client: true },
      { code: "CB", name: "Kiềng cổ", client: false },
      { code: "NE", name: "Dây chuyền nữ", client: true },
      { code: "NM", name: "Dây chuyền nam", client: false },
      { code: "BE", name: "Vòng tay", client: false },
    ],
    techGroups: [
      { id: "TG-1", name: "Móc máy hoa văn nổi 3D", client: true },
      { id: "TG-2", name: "Men sứ đa sắc viền kim", client: true },
      { id: "TG-3", name: "Men sứ đơn sắc nano", client: true }
    ],
    effects: [
      { code: "CR", name: "Cross 45 + Slash 90", client: true },
      { code: "CR45", name: "Cross 45", client: true },
      { code: "CS", name: "Chữ S", client: true },
      { code: "MO", name: "Moon", client: true },
      { code: "SL45", name: "Slash45", client: true },
      { code: "SL90", name: "Slash90", client: true },
      { code: "TR", name: "Trơn", client: true }
    ],
    accessories: [
      { code: "ACC-1", name: "Khóa hộp tròn vàng", client: true },
      { code: "ACC-2", name: "Dây phụ kiện HTJ 1.5mm", client: true }
    ],
    // Phạm vi ảnh hưởng
    design: true,
    bom: true,
    routing: false,
    // Hiển thị
    showAdmin: true,
    showClient: true,
    customFieldLabel: "Hiệu ứng bào",
    note: ""
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenEdit = (ct) => {
    setModalMode("edit");
    setFormData({
      ...formData,
      stt: ct.stt,
      code: ct.code,
      name: ct.name,
      status: "Hoạt động",
      hasTextInput: !!ct.hasTextInput,
      hasCustomSelection: ct.hasCustomSelection !== false,
      otherChangeConfig: ct.otherChangeConfig || "optional",
      design: ct.design,
      bom: ct.bom,
      routing: ct.routing,
      showAdmin: ct.showAdmin,
      showClient: ct.showClient,
      customFieldLabel: ct.customFieldLabel || "Nhóm kỹ thuật",
      note: ct.note || ""
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      ...formData,
      stt: changeTypes.length + 1,
      code: "",
      name: "",
      status: "Hoạt động",
      hasTextInput: false,
      hasCustomSelection: true,
      otherChangeConfig: "optional",
      design: true,
      bom: true,
      routing: false,
      showAdmin: true,
      showClient: true,
      customFieldLabel: "Nhóm kỹ thuật",
      note: ""
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert("Vui lòng nhập Mã loại và Tên loại thay đổi!");
      return;
    }

    let nextList = [];
    if (modalMode === "edit") {
      nextList = changeTypes.map((item) =>
        item.code === formData.code
          ? {
              ...item,
              name: formData.name,
              hasTextInput: formData.hasTextInput,
              hasCustomSelection: formData.hasCustomSelection,
              otherChangeConfig: formData.otherChangeConfig || "optional",
              design: formData.design,
              bom: formData.bom,
              routing: formData.routing,
              showAdmin: formData.showAdmin,
              showClient: formData.showClient,
              customFieldLabel: formData.customFieldLabel
            }
          : item
      );
      setChangeTypes(nextList);
      showToast(`Đã cập nhật thành công cấu hình loại thay đổi [${formData.code}]!`);
    } else {
      const newItem = {
        stt: changeTypes.length + 1,
        code: formData.code.toUpperCase(),
        name: formData.name,
        productType: "Áp dụng theo danh mục",
        design: formData.design,
        bom: formData.bom,
        routing: formData.routing,
        showAdmin: formData.showAdmin,
        showClient: formData.showClient,
        scope: "Tùy biến",
        note: formData.note || "Tạo mới từ Quản lý sản phẩm",
        hasTextInput: formData.hasTextInput,
        hasCustomSelection: formData.hasCustomSelection,
        otherChangeConfig: formData.otherChangeConfig || "optional",
        customFieldLabel: formData.customFieldLabel,
        customOptions: []
      };
      nextList = [...changeTypes, newItem];
      setChangeTypes(nextList);
      showToast(`Đã thêm mới loại thay đổi [${newItem.code}] thành công!`);
    }

    // Lưu vào localStorage và dispatch event để E-Catalogue đồng bộ tức thì
    try {
      localStorage.setItem("SEVAGO_CHANGE_TYPES_CONFIG", JSON.stringify(nextList));
      window.dispatchEvent(new Event("changeTypesUpdated"));
    } catch (err) {
      console.error(err);
    }

    setIsModalOpen(false);
  };

  const filtered = changeTypes.filter((ct) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      ct.code.toLowerCase().includes(q) ||
      ct.name.toLowerCase().includes(q) ||
      ct.productType.toLowerCase().includes(q) ||
      ct.note.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans antialiased overflow-hidden">
      {/* 1. Sidebar Quản lý sản phẩm duy nhất khớp chuẩn Ảnh 1 & 2 */}
      <aside className="w-60 bg-[#004737] text-white flex flex-col h-full overflow-y-auto shrink-0 text-xs">
        {/* Header Phân hệ QLSP */}
        <div className="h-16 px-4 border-b border-[#00382b] flex items-center justify-between shrink-0 bg-[#00382b]">
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Box className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block leading-none">
                Phân hệ ERP
              </span>
              <span className="text-sm font-bold text-white block truncate leading-tight mt-0.5">
                Quản lý sản phẩm
              </span>
            </div>
          </Link>
        </div>

        {/* Tree Menu QLSP Khớp chuẩn 100% Ảnh 1 & 2 */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Trang chủ
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Cấu hình thông báo
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Thuộc tính sản phẩm
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            <span>BOM/Routing</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
          </a>

          {/* Nhóm Yêu cầu thiết kế (Active) */}
          <div className="space-y-0.5 pt-1">
            <div className="flex items-center justify-between px-3 py-2 text-white bg-[#00382b] rounded-md font-semibold">
              <span>Yêu cầu thiết kế</span>
              <ChevronDown className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div className="pl-3 space-y-0.5 pt-0.5">
              <a href="#" className="block px-3 py-1.5 text-gray-300 hover:text-white rounded-md">
                Yêu cầu từ bộ sưu tập
              </a>
              <Link
                href="/product-management/change-types"
                className="block px-3 py-1.5 bg-emerald-600/30 text-white border border-emerald-500/50 rounded-md font-bold"
              >
                Cấu hình loại thay đổi
              </Link>
              <a href="#" className="block px-3 py-1.5 text-gray-300 hover:text-white rounded-md">
                Yêu cầu từ khách hàng
              </a>
              <a href="#" className="block px-3 py-1.5 text-gray-300 hover:text-white rounded-md">
                Yêu cầu R&D Công nghệ
              </a>
            </div>
          </div>

          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            <span>Sketches 2D</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Drawing No
          </a>
          <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            <span>Item</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Khuôn
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Sample
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-gray-200 hover:bg-[#00382b] rounded-md font-medium">
            Nhu cầu đơn hàng
          </a>
        </nav>

        {/* Nút quay về Quản lý đơn hàng */}
        <div className="p-3 border-t border-[#00382b]">
          <Link
            href="/orders/config-product"
            className="flex items-center justify-center space-x-1.5 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-md font-medium transition-colors text-[11px]"
          >
            <span>← Quay về Quản lý đơn hàng</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar QLSP */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-gray-800">
              Quản lý sản phẩm
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-500 relative cursor-pointer">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                VC
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-800 leading-tight">Lê Văn Châu</span>
                <span className="text-[10px] text-gray-400 leading-tight">Phó phòng</span>
              </div>
            </div>
          </div>
        </header>

        {/* Toast thông báo lưu */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage("")} className="text-emerald-500 hover:text-emerald-700">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Nội dung danh sách khớp 100% Ảnh 1 & Ma trận Thuộc tính Ảnh 2 */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* TAB SWITCHER: CHUYỂN ĐỔI GIỮA MA TRẬN THUỘC TÍNH (ẢNH 2) & DANH SÁCH LOẠI THAY ĐỔI */}
          <div className="flex items-center space-x-2 bg-gray-200/70 p-1.5 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveViewTab("attributes")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeViewTab === "attributes"
                  ? "bg-[#005a46] text-white shadow-xs"
                  : "text-gray-700 hover:bg-white/60"
              }`}
            >
              <TableProperties className="h-4 w-4" />
              <span>Ma trận Cấu hình Thuộc tính (Chuẩn Excel Ảnh 2)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab("types")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeViewTab === "types"
                  ? "bg-[#005a46] text-white shadow-xs"
                  : "text-gray-700 hover:bg-white/60"
              }`}
            >
              <ListFilter className="h-4 w-4" />
              <span>Danh sách Loại thay đổi (10 Loại & Cờ Routing)</span>
            </button>
          </div>

          {activeViewTab === "attributes" ? (
            /* ========================================================================= */
            /* VIEW 1: BẢNG MA TRẬN CẤU HÌNH THUỘC TÍNH THAY ĐỔI (KHỚP 100% EXCEL ẢNH 2) */
            /* ========================================================================= */
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden space-y-4">
              <div className="p-5 pb-3 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 to-white">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center space-x-2">
                    <span>Bảng Ma trận Cấu hình Thuộc tính Thay đổi</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#00594c] px-2 py-0.5 rounded border border-emerald-300">
                      Chuẩn Excel B2B/B2C
                    </span>
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Định nghĩa hình thức nhập liệu (Dropdown vs Ghi chú), phạm vi hiển thị trên E-Catalogue và quyền cấu hình Admin.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center space-x-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Hiển thị E-C: 4 thuộc tính + Loại 'Khác'</span>
                  </span>
                </div>
              </div>

              {/* Bảng Excel 7 Cột Khớp 100% Ảnh 2 */}
              <div className="overflow-x-auto px-5 pb-5">
                <table className="w-full border-collapse text-left text-xs border border-gray-300">
                  <thead className="bg-[#b4c6e7] text-gray-900 font-bold border-b-2 border-gray-400 text-center">
                    <tr>
                      <th className="w-12 px-3 py-3 border border-gray-300">STT</th>
                      <th className="px-4 py-3 min-w-[200px] border border-gray-300 text-left">Thuộc tính</th>
                      <th className="w-40 px-3 py-3 border border-gray-300 bg-[#d9e1f2]">Tùy chọn</th>
                      <th className="w-36 px-3 py-3 border border-gray-300 bg-[#d9e1f2]">Mô tả (Ghi chú)</th>
                      <th className="w-32 px-3 py-3 border border-gray-300 bg-[#c6e0b4]">Hiển thị E_C</th>
                      <th className="w-24 px-3 py-3 border border-gray-300">Admin</th>
                      <th className="px-4 py-3 min-w-[260px] border border-gray-300 text-left">Điều kiện / Ghi chú</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {ATTRIBUTE_CHANGE_CONFIGS.map((attr) => (
                      <tr key={attr.stt} className="hover:bg-amber-50/40 transition-colors">
                        {/* STT */}
                        <td className="px-3 py-2.5 text-center font-bold text-gray-700 border border-gray-300">
                          {attr.stt}
                        </td>

                        {/* Thuộc tính */}
                        <td className="px-4 py-2.5 font-semibold text-gray-900 border border-gray-300">
                          <div className="flex items-center space-x-1.5">
                            <span className={attr.stt === 9 ? "font-bold text-gray-900" : ""}>{attr.name}</span>
                            {attr.isBasicAttr && (
                              <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                                Cơ bản
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Tùy chọn */}
                        <td className="px-3 py-2.5 text-center font-bold border border-gray-300 bg-[#f9fbfd]">
                          {attr.hasOption ? (
                            attr.stt === 9 ? (
                              <div className="space-y-0.5">
                                <span className="text-red-600 font-black text-sm">X</span>
                                <div className="text-[10px] text-red-600 font-semibold leading-tight">
                                  (Móc máy / Lácquer / Móc máy + Lácquer)
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-900 font-black text-sm">X</span>
                            )
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Mô tả (Ghi chú) */}
                        <td className="px-3 py-2.5 text-center font-bold border border-gray-300 bg-[#f9fbfd]">
                          {attr.hasDescription ? (
                            <span className="text-red-600 font-black text-sm">X</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Hiển thị E_C */}
                        <td className="px-3 py-2.5 text-center font-bold border border-gray-300 bg-[#f4f9f2]">
                          {attr.showEC ? (
                            <span className="text-gray-900 font-black text-sm">X</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Admin */}
                        <td className="px-3 py-2.5 text-center font-bold border border-gray-300">
                          {attr.showAdmin ? (
                            <span className="text-gray-900 font-black text-sm">X</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Điều kiện / Ghi chú */}
                        <td className="px-4 py-2.5 text-xs text-gray-700 border border-gray-300 whitespace-pre-line leading-relaxed">
                          {attr.condition || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tóm tắt quy tắc nghiệp vụ vàng của Chị đẹp */}
              <div className="mx-5 mb-5 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
                <div className="font-bold text-sm text-[#00594c] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Quy tắc Vận Hành & Tính Giá (Theo cấu hình Chị đẹp):</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11.5px] leading-relaxed">
                  <li><strong>Tùy chọn:</strong> Yêu cầu thay đổi ở cột thuộc tính ở dạng dropdown.</li>
                  <li><strong>Mô tả:</strong> Yêu cầu thay đổi ở cột thuộc tính ở dạng ghi chú (chỉ hiển thị ở Admin).</li>
                  <li><strong>Cả tùy chọn và mô tả:</strong> Vừa chọn vừa nhập (có checkbox để tích chọn yêu cầu thay đổi khác) &rarr; Nếu có nhập mô tả thì <strong>Giá tính sau</strong>.</li>
                  <li><strong>Trên E-Catalogue:</strong> Chỉ hiển thị các thuộc tính có cờ <code>showEC = true</code> (Khóa, Tăng đơ, Kiểu bào ball, HTJ) + Loại <code>'Khác'</code>. Khi chọn 'Khác', hiển thị ô nhập mô tả thay đổi &rarr; <strong>Tính giá sau</strong>.</li>
                  <li><strong>Tự động tách đơn:</strong> Đơn có Yêu cầu thay đổi là Khác HOẶC có nhập mô tả thay đổi khác thì khi tạo xong tự động tách làm 2 đơn: Đơn chứa Yêu cầu thay đổi khác sẽ ở trạng thái <strong>Chờ xử lý</strong> và Admin có thể tùy chọn lại các thuộc tính kỹ thuật nội bộ (Màu dây, Đắp lacquer, Thay cast, Thay pearl sang ball, Đá phụ).</li>
                </ul>
              </div>

            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: DANH SÁCH LOẠI THAY ĐỔI (BẢNG GỐC 10 LOẠI CÓ CỜ ROUTING)           */
            /* ========================================================================= */
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
              {/* Header Card: Tiêu đề & Nút Thêm mới, Lọc, Reload */}
              <div className="p-5 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  Danh sách Loại thay đổi
                </h1>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="px-3.5 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm mới</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                    title="Tùy chỉnh cột"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChangeTypes(CHANGE_TYPES_CONFIG);
                      showToast("Đã tải lại danh sách loại thay đổi gốc!");
                    }}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                    title="Tải lại"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Input Search */}
              <div className="px-5 py-3 border-b border-gray-100">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm mã loại, tên loại thay đổi..."
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50/60 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 placeholder:text-gray-400"
                  />
                </div>
              </div>

            {/* Bảng Dữ Liệu Khớp 100% Ảnh 1 & 2 kèm hiển thị Cấu hình chi tiết */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="w-12 px-2 py-3 text-center">STT</th>
                    <th className="w-16 px-2 py-3 text-center">Mã loại</th>
                    <th className="px-3 py-3 min-w-[170px]">Tên loại thay đổi</th>
                    <th className="px-3 py-3 min-w-[180px]">Loại sản phẩm</th>
                    
                    {/* CỘT MỚI: CẤU HÌNH CHI TIẾT THAY ĐỔI */}
                    <th className="px-3 py-3 min-w-[170px] text-center bg-emerald-50/40 text-emerald-900 border-x border-emerald-100">
                      Cấu hình chi tiết
                    </th>

                    {/* CỘT MỚI THEO YÊU CẦU: CẤU HÌNH YÊU CẦU THAY ĐỔI KHÁC (EC) */}
                    <th className="px-3 py-3 min-w-[175px] text-center bg-blue-50/40 text-blue-900 border-x border-blue-100">
                      Thay đổi khác (EC)
                    </th>

                    <th className="w-20 px-2 py-3 text-center">Thiết kế</th>
                    <th className="w-18 px-2 py-3 text-center">BOM</th>
                    
                    {/* CỘT ROUTING ĐƯỢC ĐÓNG KHUNG ĐỎ THEO ĐÚNG ẢNH 1 & 2 */}
                    <th className="w-24 px-3 py-3 text-center border-2 border-red-500 bg-red-50/20 text-red-700 font-bold">
                      Routing
                    </th>

                    <th className="w-22 px-2 py-3 text-center">Hiện Admin</th>
                    <th className="w-22 px-2 py-3 text-center">Hiện Client</th>
                    <th className="px-3 py-3 min-w-[140px]">Phạm vi mở rộng</th>
                    <th className="w-20 px-2 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((ct, idx) => (
                    <tr key={ct.code} className="hover:bg-gray-50/70 transition-colors">
                      {/* STT */}
                      <td className="px-2 py-3 text-center font-medium text-gray-500">
                        {idx + 1}
                      </td>

                      {/* Mã loại */}
                      <td className="px-2 py-3 text-center font-bold text-gray-900 font-mono">
                        {ct.code}
                      </td>

                      {/* Tên loại thay đổi */}
                      <td className="px-3 py-3 font-medium text-gray-900">
                        {ct.name}
                      </td>

                      {/* Loại sản phẩm */}
                      <td className="px-3 py-3 text-gray-600 truncate max-w-[200px]" title={ct.productType}>
                        {ct.productType}
                      </td>

                      {/* Cột hiển thị 2 trường cấu hình chi tiết thay đổi */}
                      <td className="px-3 py-3 text-center border-x border-emerald-50 bg-emerald-50/10">
                        <div className="flex flex-col gap-1 items-center justify-center">
                          {ct.hasTextInput && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <FileText className="h-3 w-3 mr-1 text-blue-500" />
                              Nhập mô tả
                            </span>
                          )}
                          {ct.hasCustomSelection && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <ListFilter className="h-3 w-3 mr-1 text-emerald-500" />
                              Chọn tùy biến
                            </span>
                          )}
                          {!ct.hasTextInput && !ct.hasCustomSelection && (
                            <span className="text-gray-300 font-mono">---</span>
                          )}
                        </div>
                      </td>

                      {/* Cột hiển thị Cấu hình yêu cầu thay đổi khác (E-Catalogue) */}
                      <td className="px-3 py-3 text-center border-x border-blue-50 bg-blue-50/10">
                        {ct.otherChangeConfig === "not_allowed" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200" title="Ẩn nút checkbox trên EC">
                            🚫 Không được phép
                          </span>
                        )}
                        {ct.otherChangeConfig === "optional" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200" title="Hiện checkbox không bắt buộc trên EC">
                            ⚡ Được phép (Tùy chọn)
                          </span>
                        )}
                        {ct.otherChangeConfig === "required" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200" title="Hiện checkbox bắt buộc trên EC">
                            🔴 Bắt buộc thay đổi
                          </span>
                        )}
                        {!ct.otherChangeConfig && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            ⚡ Được phép
                          </span>
                        )}
                      </td>

                      {/* Thiết kế */}
                      <td className="px-2 py-3 text-center">
                        {ct.design ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* BOM */}
                      <td className="px-2 py-3 text-center">
                        {ct.bom ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Cột Routing viền đỏ khớp Ảnh 1 */}
                      <td className="px-3 py-3 text-center border-x-2 border-red-500 bg-red-50/10">
                        {ct.routing ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Hiện Admin */}
                      <td className="px-2 py-3 text-center">
                        {ct.showAdmin ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Hiện Client */}
                      <td className="px-2 py-3 text-center">
                        {ct.showClient ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-gray-300 font-mono">---</span>
                        )}
                      </td>

                      {/* Phạm vi mở rộng */}
                      <td className="px-3 py-3 text-gray-600">
                        {ct.scope}
                      </td>

                      {/* Thao tác */}
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-400">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(ct)}
                            className="p-1 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Chỉnh sửa cấu hình loại thay đổi"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Chị đẹp có chắc muốn xóa loại thay đổi [${ct.code}]?`)) {
                                setChangeTypes((prev) => prev.filter((item) => item.code !== ct.code));
                                showToast(`Đã xóa loại thay đổi [${ct.code}]!`);
                              }
                            }}
                            className="p-1 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Phân trang */}
            <div className="bg-gray-50/80 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-xs text-gray-500">
              <span>Hiển thị 1 - {filtered.length} trong tổng số {changeTypes.length}</span>
              <div className="flex items-center space-x-1 font-medium">
                <span className="px-2 py-1 bg-[#004737] text-white rounded font-bold">1</span>
                <span className="text-gray-500 text-[11px] ml-2">10 / trang</span>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL CẬP NHẬT / THÊM MỚI LOẠI THAY ĐỔI (CHUẨN 100% ẢNH 1 THỰC TẾ)    */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
              <h2 className="text-base font-bold text-gray-900">
                {modalMode === "edit" ? "Cập nhật loại thay đổi" : "Thêm mới loại thay đổi"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-gray-700">
              {/* SECTION 1: THÔNG TIN CƠ BẢN */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Thông tin cơ bản
                </h3>
                
                {/* Mã loại * */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Mã loại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    disabled={modalMode === "edit"}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Ví dụ: B, C, D, I, H..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono font-bold focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-600"
                  />
                </div>

                {/* Tên loại * */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Tên loại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Thay kiểu bào ball, Cast, Đắp lacquer - móc máy..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                  />
                </div>

                {/* Trạng thái * */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Tạm ngưng">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION MỚI THEO YÊU CẦU: CẤU HÌNH CHI TIẾT THAY ĐỔI              */}
              {/* ================================================================= */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center">
                    <ListFilter className="h-3.5 w-3.5 mr-1.5 text-emerald-700" />
                    Cấu hình chi tiết thay đổi
                  </h3>
                  <span className="text-[10px] text-gray-400 font-normal">
                    Quyết định cách Client nhập / chọn thông tin
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Trường chọn 1: Nhập chi tiết thay đổi */}
                  <label className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.hasTextInput ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400" : "bg-gray-50/60 border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasTextInput}
                      onChange={(e) => setFormData({ ...formData, hasTextInput: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                    />
                    <div className="ml-3 text-left">
                      <span className="text-xs font-bold text-gray-900 block">
                        Nhập chi tiết thay đổi
                      </span>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        Nhập mô tả thay đổi cho loại thay đổi (Hiển thị trường nhập tự do <b>&quot;Mô tả thay đổi *&quot;</b> dạng ô văn bản để khách hàng/sale gõ chi tiết như ở Ảnh 2).
                      </span>
                    </div>
                  </label>

                  {/* Trường chọn 2: Chọn chi tiết thay đổi */}
                  <label className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.hasCustomSelection ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400" : "bg-gray-50/60 border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.hasCustomSelection}
                      onChange={(e) => setFormData({ ...formData, hasCustomSelection: e.target.checked })}
                      className="mt-0.5 h-4 w-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                    />
                    <div className="ml-3 text-left">
                      <span className="text-xs font-bold text-gray-900 block">
                        Chọn chi tiết thay đổi
                      </span>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        Chọn tùy biến thay đổi (Hiển thị trường chọn dạng dropdown từ danh mục tùy biến: Nhóm kỹ thuật, Hiệu ứng, Item phụ kiện... như ở Ảnh 3).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* ================================================================= */}
              {/* SECTION MỚI THEO YÊU CẦU: CẤU HÌNH YÊU CẦU THAY ĐỔI KHÁC (EC)     */}
              {/* ================================================================= */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-blue-950 uppercase tracking-wider flex items-center">
                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-blue-700" />
                    Cấu hình yêu cầu thay đổi khác (E-Catalogue)
                  </h3>
                  <span className="text-[10px] text-gray-400 font-normal">
                    Quy định nút checkbox trên E-Catalogue
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Option 1: Không được phép thay đổi */}
                  <label className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.otherChangeConfig === "not_allowed" 
                      ? "bg-red-50/50 border-red-300 ring-1 ring-red-400" 
                      : "bg-gray-50/60 border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="radio"
                      name="otherChangeConfig"
                      value="not_allowed"
                      checked={formData.otherChangeConfig === "not_allowed"}
                      onChange={(e) => setFormData({ ...formData, otherChangeConfig: e.target.value })}
                      className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer"
                    />
                    <div className="ml-3 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900">Không được phép thay đổi</span>
                        <span className="text-[10px] font-semibold text-red-700 bg-red-100/70 px-1.5 py-0.2 rounded">Ẩn nút checkbox</span>
                      </div>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        Khi khách hàng/sale chọn loại này trên E-Catalogue, hệ thống sẽ <b>Ẩn hoàn toàn nút checkbox</b> &quot;Yêu cầu thay đổi khác&quot;.
                      </span>
                    </div>
                  </label>

                  {/* Option 2: Được phép thay đổi */}
                  <label className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.otherChangeConfig === "optional" 
                      ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-400" 
                      : "bg-gray-50/60 border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="radio"
                      name="otherChangeConfig"
                      value="optional"
                      checked={formData.otherChangeConfig === "optional"}
                      onChange={(e) => setFormData({ ...formData, otherChangeConfig: e.target.value })}
                      className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="ml-3 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900">Được phép thay đổi</span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">Hiện checkbox (Không bắt buộc)</span>
                      </div>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        Hiển thị nút checkbox &quot;Yêu cầu thay đổi khác&quot; để khách hàng tùy ý tick chọn nếu có nhu cầu bổ sung.
                      </span>
                    </div>
                  </label>

                  {/* Option 3: Bắt buộc thay đổi */}
                  <label className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer ${
                    formData.otherChangeConfig === "required" 
                      ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-400" 
                      : "bg-gray-50/60 border-gray-200 hover:bg-gray-50"
                  }`}>
                    <input
                      type="radio"
                      name="otherChangeConfig"
                      value="required"
                      checked={formData.otherChangeConfig === "required"}
                      onChange={(e) => setFormData({ ...formData, otherChangeConfig: e.target.value })}
                      className="mt-0.5 h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="ml-3 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900">Bắt buộc thay đổi</span>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded">Hiện checkbox (Bắt buộc)</span>
                      </div>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        Hiển thị nút checkbox &quot;Yêu cầu thay đổi khác&quot; ở trạng thái <b>Bắt buộc</b> (tự động chọn và bắt buộc nhập mô tả thay đổi).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 2: PHẠM VI ÁP DỤNG */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Phạm vi áp dụng
                </h3>

                {/* 2.1 Loại sản phẩm * */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-gray-700">
                      Loại sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <button type="button" className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer">
                      Chọn tất cả
                    </button>
                  </div>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white text-gray-400 focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600">
                      <option>Chọn loại sản phẩm</option>
                    </select>
                  </div>
                  
                  {/* Danh sách items loại sản phẩm đã chọn */}
                  <div className="space-y-1.5 pt-1">
                    {formData.productTypes.map((pt, idx) => (
                      <div key={pt.code} className="flex items-center justify-between py-1 px-2.5 bg-gray-50/80 rounded border border-gray-100 hover:bg-gray-100/60">
                        <span className="text-xs text-gray-800 font-medium">
                          {pt.code} - {pt.name}
                        </span>
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-gray-500 font-medium">
                            <span>Client</span>
                            <input
                              type="checkbox"
                              checked={pt.client}
                              onChange={() => {
                                const updated = [...formData.productTypes];
                                updated[idx].client = !updated[idx].client;
                                setFormData({ ...formData, productTypes: updated });
                              }}
                              className="h-3.5 w-3.5 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.productTypes.filter((_, i) => i !== idx);
                              setFormData({ ...formData, productTypes: updated });
                            }}
                            className="text-gray-400 hover:text-red-600 cursor-pointer"
                            title="Xóa"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2.2 Nhóm kỹ thuật */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-gray-700">
                      Nhóm kỹ thuật
                    </label>
                    <button type="button" className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer">
                      Chọn tất cả
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm nhóm kỹ thuật"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* 2.3 Hiệu ứng */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-gray-700">
                      Hiệu ứng
                    </label>
                    <button type="button" className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer">
                      Chọn tất cả
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm hiệu ứng"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs placeholder:text-gray-400"
                    />
                  </div>
                  {/* Danh sách hiệu ứng đã chọn */}
                  <div className="space-y-1.5 pt-1">
                    {formData.effects.map((ef, idx) => (
                      <div key={ef.code} className="flex items-center justify-between py-1 px-2.5 bg-gray-50/80 rounded border border-gray-100 hover:bg-gray-100/60">
                        <span className="text-xs text-gray-800 font-medium">
                          {ef.code} - {ef.name}
                        </span>
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-gray-500 font-medium">
                            <span>Client</span>
                            <input
                              type="checkbox"
                              checked={ef.client}
                              onChange={() => {
                                const updated = [...formData.effects];
                                updated[idx].client = !updated[idx].client;
                                setFormData({ ...formData, effects: updated });
                              }}
                              className="h-3.5 w-3.5 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.effects.filter((_, i) => i !== idx);
                              setFormData({ ...formData, effects: updated });
                            }}
                            className="text-gray-400 hover:text-red-600 cursor-pointer"
                            title="Xóa"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2.4 Item phụ kiện */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-gray-700">
                      Item phụ kiện
                    </label>
                    <button type="button" className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer">
                      Chọn tất cả
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm item phụ kiện"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PHẠM VI ẢNH HƯỞNG */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Phạm vi ảnh hưởng
                </h3>

                {/* Thiết kế */}
                <label className="flex items-start p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.design}
                    onChange={(e) => setFormData({ ...formData, design: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                  />
                  <div className="ml-2.5">
                    <span className="text-xs font-bold text-gray-800 block">Thiết kế</span>
                    <span className="text-[11px] text-gray-500 block">Ảnh hưởng đến bản vẽ 2D/3D</span>
                  </div>
                </label>

                {/* BOM */}
                <label className="flex items-start p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bom}
                    onChange={(e) => setFormData({ ...formData, bom: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                  />
                  <div className="ml-2.5">
                    <span className="text-xs font-bold text-gray-800 block">BOM (Bill of Materials)</span>
                    <span className="text-[11px] text-gray-500 block">Ảnh hưởng đến định mức nguyên vật liệu</span>
                  </div>
                </label>

                {/* Routing (Quy trình) */}
                <label className={`flex items-start p-2.5 rounded-lg border cursor-pointer ${
                  formData.routing ? "border-red-400 bg-red-50/20" : "border-gray-200 hover:bg-gray-50"
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.routing}
                    onChange={(e) => setFormData({ ...formData, routing: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                  />
                  <div className="ml-2.5">
                    <span className="text-xs font-bold text-gray-800 block">
                      Routing (Quy trình)
                      {formData.routing && <span className="ml-2 text-[10px] text-red-600 font-normal">● Đổi mã Drawing & Sinh Version mới</span>}
                    </span>
                    <span className="text-[11px] text-gray-500 block">Ảnh hưởng đến quy trình và thời gian tiêu chuẩn</span>
                  </div>
                </label>
              </div>

              {/* SECTION 4: HIỂN THỊ */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Hiển thị
                </h3>

                {/* Hiện trên Admin */}
                <label className="flex items-start p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAdmin}
                    onChange={(e) => setFormData({ ...formData, showAdmin: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                  />
                  <div className="ml-2.5">
                    <span className="text-xs font-bold text-gray-800 block">Hiện trên Admin</span>
                    <span className="text-[11px] text-gray-500 block">Loại thay đổi xuất hiện ở trang quản trị e-Catalogue</span>
                  </div>
                </label>

                {/* Hiện trên Client */}
                <label className="flex items-start p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showClient}
                    onChange={(e) => setFormData({ ...formData, showClient: e.target.checked })}
                    className="mt-0.5 h-4 w-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-600 cursor-pointer"
                  />
                  <div className="ml-2.5">
                    <span className="text-xs font-bold text-gray-800 block">Hiện trên Client</span>
                    <span className="text-[11px] text-gray-500 block">Loại thay đổi xuất hiện ở trang khách hàng; từng mã trong phạm vi áp dụng còn có công tắc Client riêng</span>
                  </div>
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3 shrink-0 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
