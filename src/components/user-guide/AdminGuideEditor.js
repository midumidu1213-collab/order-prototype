"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Play,
  Trash2,
  Plus,
  Crosshair,
  Download,
  FileSpreadsheet,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

export default function AdminGuideEditor({
  initialGuide = null,
  moduleName = "Bán Hàng",
  featureName = "Đơn hàng (SO)",
  onSaveGuide,
  onCancel
}) {
  const [editorTab, setEditorTab] = useState("steps"); // "steps" | "rules" | "errors" | "templates"
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Dữ liệu Form chuẩn 2 phần
  const [formData, setFormData] = useState({
    title: initialGuide?.title || initialGuide?.shortTitle || "",
    description: initialGuide?.description || "",
    category: featureName,
    applicableScreen: initialGuide?.applicableScreen || "",
    applicablePath: initialGuide?.applicablePath || "/",
    content: initialGuide?.description || "",
    videoUrl: initialGuide?.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
    videoName: initialGuide?.videoUrl ? "video_huong_dan_so.mp4" : "",
    thumbnailName: "",
    relatedGuides: initialGuide?.relatedGuides || [],
    milestones: initialGuide?.milestones?.length
      ? initialGuide.milestones
      : [
          {
            stepNum: 1,
            time: "00:00",
            title: "Truy Cập Phân Hệ & Tạo Mới Đơn Hàng Bán Sỉ (SO)",
            action: "Từ Thanh Điều Hướng Bên Trái Chọn Bán Hàng > Quản Lý Đơn Hàng. Bấm Nút '+' Tạo Đơn Mới Ở Góc Trên Bên Phải Màn Hình.",
            shortcut: "Phím Tắt Nhanh: Alt + N",
            note: "Nhân viên cần kiểm tra kỹ quyền hạn truy cập trước khi thực hiện."
          }
        ],
    prerequisites: initialGuide?.prerequisites?.length
      ? initialGuide.prerequisites
      : [
          "Tài Khoản Nhân Viên Được Cấp Quyền Tạo Đơn Hàng (SO_CREATE).",
          "Tiệm Vàng Đại Lý Đã Tồn Tại Và Ở Trạng Thái Kích Hoạt Trên Phân Hệ Master Data Khách Hàng.",
          "Sản Phẩm Chào Bán Đã Có Giá Niêm Yết Trong Bảng Giá Bán Sỉ Hiện Hành."
        ],
    commonErrors: initialGuide?.commonErrors?.length
      ? initialGuide.commonErrors
      : [
          {
            question: "Không tìm thấy khách hàng khi gõ tên",
            cause: "Khách hàng chưa được phê duyệt kích hoạt trên phân hệ Master Data.",
            solution: "Liên hệ Admin hoặc vào phân hệ Khách hàng kiểm tra trạng thái kích hoạt của hồ sơ."
          },
          {
            question: "Cảnh báo vượt hạn mức công nợ khi gửi duyệt đơn",
            cause: "Khách hàng có nợ quá hạn trên 30 ngày hoặc tổng công nợ vượt hạn mức tín dụng được duyệt.",
            solution: "Liên hệ Quản lý kinh doanh để làm phiếu đề xuất bảo lãnh công nợ đặc biệt."
          }
        ],
    documents: initialGuide?.documents?.length
      ? initialGuide.documents
      : [
          { name: "Bieu_mau_import_don_hang_SO_v3.Xlsx", size: "32.5 KB", type: "excel" },
          { name: "Bieu_mau_import_don_hang_SO_v3.Xlsx", size: "32.5 KB", type: "excel" }
        ]
  });

  // --- Xử lý Steps (Mốc thao tác video) ---
  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          stepNum: prev.milestones.length + 1,
          time: "00:00",
          title: "",
          action: "",
          shortcut: "",
          note: ""
        }
      ]
    }));
  };

  const handleUpdateStep = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.milestones];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, milestones: updated };
    });
  };

  const handleRemoveStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  // --- Xử lý Điều kiện tiên quyết ---
  const handleAddPrerequisite = () => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""]
    }));
  };

  const handleUpdatePrerequisite = (index, val) => {
    setFormData((prev) => {
      const updated = [...prev.prerequisites];
      updated[index] = val;
      return { ...prev, prerequisites: updated };
    });
  };

  const handleRemovePrerequisite = (index) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  // --- Xử lý Lỗi thường gặp ---
  const handleAddError = () => {
    setFormData((prev) => ({
      ...prev,
      commonErrors: [
        ...prev.commonErrors,
        { question: "", cause: "", solution: "" }
      ]
    }));
  };

  const handleUpdateError = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.commonErrors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, commonErrors: updated };
    });
  };

  const handleRemoveError = (index) => {
    setFormData((prev) => ({
      ...prev,
      commonErrors: prev.commonErrors.filter((_, i) => i !== index)
    }));
  };

  // --- Xử lý Đính kèm biểu mẫu ---
  const handleUploadDoc = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: "excel"
          }
        ]
      }));
    }
  };

  const handleRemoveDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Submit
  const handleSave = (targetStatus = "active") => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên bài hướng dẫn!");
      return;
    }

    const payload = {
      ...initialGuide,
      id: initialGuide?.id || `guide_${Date.now()}`,
      code: initialGuide?.code || `AC-${Math.floor(10000 + Math.random() * 90000)}`,
      title: formData.title,
      shortTitle: formData.title,
      status: targetStatus,
      author: initialGuide?.author || "[03920] - Trần Minh Tuấn",
      createdAt: initialGuide?.createdAt || "23/07/2024 09:00",
      duration: "08:00",
      applicableScreen: formData.applicableScreen,
      applicablePath: formData.applicablePath,
      description: formData.description || formData.content,
      videoUrl: formData.videoUrl,
      documents: formData.documents,
      milestones: formData.milestones,
      prerequisites: formData.prerequisites,
      commonErrors: formData.commonErrors
    };

    onSaveGuide(payload);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50/50 p-6 md:p-8 space-y-6">
      {/* 1. Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <button
          type="button"
          onClick={onCancel}
          className="hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Trang chủ
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-700 font-semibold">{moduleName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-700 font-semibold">{featureName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">
          {initialGuide ? "Chỉnh sửa bài hướng dẫn" : "Tạo bài hướng dẫn"}
        </span>
      </div>

      {/* 2. PHẦN 1: THÔNG TIN CHUNG */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-900">Thông tin chung</h2>

        {/* Tên bài hướng dẫn */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">
            Tên bài hướng dẫn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Nhập vào"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:border-emerald-600 font-medium shadow-2xs"
          />
        </div>

        {/* Hai Khung Kéo Thả: Video hướng dẫn & Thumbnail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Upload Video */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Video hướng dẫn
            </label>
            <input
              type="file"
              ref={videoInputRef}
              accept="video/mp4,audio/mp3"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData({
                    ...formData,
                    videoName: e.target.files[0].name
                  });
                }
              }}
              className="hidden"
            />
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2 h-36"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <p className="text-xs font-bold text-gray-700">
                {formData.videoName || "Kéo và thả tệp vào đây hoặc chọn tệp"}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                Định dạng tệp được hỗ trợ: mp3,mp4 Kích thước tệp tải lên tối đa: 50MB
              </p>
            </div>
          </div>

          {/* Upload Thumbnail */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Thumbnail
            </label>
            <input
              type="file"
              ref={thumbInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFormData({
                    ...formData,
                    thumbnailName: e.target.files[0].name
                  });
                }
              }}
              className="hidden"
            />
            <div
              onClick={() => thumbInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2 h-36"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <p className="text-xs font-bold text-gray-700">
                {formData.thumbnailName || "Kéo và thả tệp vào đây hoặc chọn tệp"}
              </p>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">Mô tả</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập vào"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:border-emerald-600 font-medium shadow-2xs"
          />
        </div>

        {/* Danh mục dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600 shadow-2xs cursor-pointer"
            >
              <option value="Đơn hàng (SO)">Đơn hàng (SO)</option>
              <option value="Phiếu giao hàng DO">Phiếu giao hàng DO</option>
              <option value="Yêu cầu huỷ SO">Yêu cầu huỷ SO</option>
              <option value="Chiết khấu">Chiết khấu</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Màn hình áp dụng */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">
            Màn hình áp dụng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.applicableScreen}
            onChange={(e) => setFormData({ ...formData, applicableScreen: e.target.value })}
            placeholder="Dán link ....."
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:border-emerald-600 font-medium shadow-2xs"
          />
        </div>

        {/* Nội dung / Diễn giải */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">
            Nội dung/Diễn giải <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Nhập"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:border-emerald-600 font-medium shadow-2xs resize-y"
          />
        </div>

        {/* Bài viết liên quan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 block">
              Bài viết liên quan
            </label>
            <button
              type="button"
              onClick={() => alert("Mở modal chọn bài viết liên quan trong hệ thống")}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-gray-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Chọn bài viết</span>
            </button>
          </div>

          <div className="p-8 border border-gray-200 rounded-xl bg-gray-50/50 text-center text-xs font-bold text-gray-800">
            Chưa Chọn Bài Viết Liên Quan
          </div>
        </div>
      </div>

      {/* 3. PHẦN 2: THÔNG TIN SÀN (4 TABS CHI TIẾT) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-6 space-y-6">
        <h2 className="text-sm font-bold text-gray-900">Thông tin sàn</h2>

        {/* 4 Tabs Chuyển đổi */}
        <div className="border-b border-gray-200 flex space-x-8 text-xs font-bold">
          <button
            type="button"
            onClick={() => setEditorTab("steps")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              editorTab === "steps"
                ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Các bước thực hiện
          </button>

          <button
            type="button"
            onClick={() => setEditorTab("rules")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              editorTab === "rules"
                ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Quy định nghiệp vụ
          </button>

          <button
            type="button"
            onClick={() => setEditorTab("errors")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              editorTab === "errors"
                ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Lỗi thường gặp & cách xử lý
          </button>

          <button
            type="button"
            onClick={() => setEditorTab("templates")}
            className={`pb-2.5 transition-colors cursor-pointer ${
              editorTab === "templates"
                ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Biểu mẫu
          </button>
        </div>

        {/* TAB 1: CÁC BƯỚC THỰC HIỆN KÈM VIDEO */}
        {editorTab === "steps" && (
          <div className="space-y-6">
            {/* Khung Video Preview */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-md flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 border-2 border-white/80 text-white flex items-center justify-center">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>

              {/* Thanh thêm ghi chú tại mốc thời gian */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-4 py-1.5 bg-white/90 hover:bg-white text-gray-900 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm ghi chú tại 00:00</span>
                </button>
              </div>
            </div>

            {/* Danh sách các bước nhập liệu */}
            <div className="space-y-4">
              {formData.milestones.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50/60 border border-gray-200 rounded-xl space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-900">
                        ✓ Bước {idx + 1}:
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Mốc video :
                      </span>
                      <input
                        type="text"
                        value={step.time || "00:00"}
                        onChange={(e) => handleUpdateStep(idx, "time", e.target.value)}
                        className="w-16 px-2 py-1 bg-white border border-gray-300 rounded text-center text-xs font-bold text-gray-800"
                      />
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-emerald-700"
                        title="Bắt mốc video hiện tại"
                      >
                        <Crosshair className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Xóa bước này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tiêu đề bước */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 block">
                      Tiêu đề bước
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                      placeholder="Nhập vào"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Mô tả thao tác */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 block">
                      Mô tả thao tác
                    </label>
                    <textarea
                      rows={2}
                      value={step.action}
                      onChange={(e) => handleUpdateStep(idx, "action", e.target.value)}
                      placeholder="Nhập"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600 resize-y"
                    />
                  </div>

                  {/* Lưu ý */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 block">
                      Lưu ý
                    </label>
                    <input
                      type="text"
                      value={step.note || ""}
                      onChange={(e) => handleUpdateStep(idx, "note", e.target.value)}
                      placeholder="Nhập vào"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddStep}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl text-xs font-bold text-gray-600 hover:text-emerald-800 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bước mới</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: QUY ĐỊNH NGHIỆP VỤ */}
        {editorTab === "rules" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                Điều Kiện Tiên Quyết ({formData.prerequisites.length})
              </span>

              <button
                type="button"
                onClick={handleAddPrerequisite}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.prerequisites.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-[#84b8a7] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdatePrerequisite(idx, e.target.value)}
                    placeholder="Nhập vào"
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePrerequisite(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                    title="Xóa điều kiện này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LỖI THƯỜNG GẶP & CÁCH XỬ LÝ */}
        {editorTab === "errors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                Ràng Buộc Và Quy Tắc Nghiệp Vụ
              </span>

              <button
                type="button"
                onClick={handleAddError}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.commonErrors.map((err, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50/60 border border-gray-200 rounded-xl space-y-3.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold">
                      Lỗi #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveError(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Xóa lỗi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hiện tượng / Tên lỗi */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 block">
                      Hiện tượng / Tên lỗi
                    </label>
                    <input
                      type="text"
                      value={err.question}
                      onChange={(e) => handleUpdateError(idx, "question", e.target.value)}
                      placeholder="Nhập vào"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Nguyên nhân */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 block">
                      Nguyên nhân
                    </label>
                    <textarea
                      rows={2}
                      value={err.cause}
                      onChange={(e) => handleUpdateError(idx, "cause", e.target.value)}
                      placeholder="Nhập"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600 resize-y"
                    />
                  </div>

                  {/* Cách xử lý */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 block">
                      Cách xử lý
                    </label>
                    <input
                      type="text"
                      value={err.solution}
                      onChange={(e) => handleUpdateError(idx, "solution", e.target.value)}
                      placeholder="Nhập vào"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BIỂU MẪU */}
        {editorTab === "templates" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase">
              TỆP ĐÍNH KÈM ({formData.documents.length})
            </h3>

            {/* Khung tải lên kéo thả */}
            <input
              type="file"
              ref={docInputRef}
              accept=".xls,.xlsx,.csv,.pdf,.doc,.docx"
              onChange={handleUploadDoc}
              className="hidden"
            />
            <div
              onClick={() => docInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-gray-800">
                Kéo và thả tệp vào đây hoặc chọn tệp
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                Định dạng tệp được hỗ trợ: XLS, XLSX; Kích thước tệp tải lên tối đa: 50MB
              </p>
            </div>

            {/* Danh sách tệp đính kèm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {doc.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {doc.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => alert(`Tải xuống: ${doc.name}`)}
                      className="p-1.5 text-gray-500 hover:text-emerald-800 rounded transition-colors cursor-pointer"
                      title="Tải xuống"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Xóa tệp"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. THANH NÚT HÀNH ĐỘNG Ở ĐÁY CHUẨN UI */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={() => handleSave("draft")}
          className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          Lưu & Nháp
        </button>
        <button
          type="button"
          onClick={() => handleSave("active")}
          className="px-6 py-2.5 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}
