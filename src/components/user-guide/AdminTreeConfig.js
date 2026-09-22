"use client";

import React, { useState } from "react";
import {
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  SlidersHorizontal,
  RotateCw,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  CornerDownRight,
  X,
  Edit2,
  Trash2,
  FolderPlus,
  FilePlus,
  Layers,
  Package,
  FileText,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function AdminTreeConfig({
  modulesList = [],
  guideData = {},
  onAddModule,
  onEditModule,
  onDeleteModule,
  onAddFeature,
  onEditFeature,
  onDeleteFeature,
  onOpenCreateGuideForFeature,
  onOpenEditGuide,
  onDeleteGuide,
  onGoBackHome
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals State
  const [moduleModal, setModuleModal] = useState({ isOpen: false, mode: "create", data: null });
  const [moduleFormName, setModuleFormName] = useState("");

  const [featureModal, setFeatureModal] = useState({ isOpen: false, mode: "create", moduleId: "", data: null });
  const [featureFormName, setFeatureFormName] = useState("");
  const [featureFormModuleId, setFeatureFormModuleId] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: "", id: "", parentId: "", name: "" });

  const toggleNode = (nodeId) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Mở modal tạo Module mới
  const handleOpenCreateModule = () => {
    setModuleFormName("");
    setModuleModal({ isOpen: true, mode: "create", data: null });
  };

  // Mở modal sửa Module
  const handleOpenEditModule = (mod) => {
    setModuleFormName(mod.name);
    setModuleModal({ isOpen: true, mode: "edit", data: mod });
  };

  // Submit Module (Tạo / Sửa)
  const handleSubmitModule = (e) => {
    e.preventDefault();
    if (!moduleFormName.trim()) return;

    if (moduleModal.mode === "create") {
      onAddModule(moduleFormName.trim());
    } else if (moduleModal.mode === "edit" && moduleModal.data) {
      onEditModule(moduleModal.data.id, moduleFormName.trim());
    }
    setModuleModal({ isOpen: false, mode: "create", data: null });
  };

  // Mở modal tạo Tính năng
  const handleOpenCreateFeature = (targetModuleId) => {
    setFeatureFormName("");
    setFeatureFormModuleId(targetModuleId || modulesList[0]?.id || "sales");
    setFeatureModal({ isOpen: true, mode: "create", moduleId: targetModuleId, data: null });
  };

  // Mở modal sửa Tính năng
  const handleOpenEditFeature = (targetModuleId, feat) => {
    setFeatureFormName(feat.name);
    setFeatureFormModuleId(targetModuleId);
    setFeatureModal({ isOpen: true, mode: "edit", moduleId: targetModuleId, data: feat });
  };

  // Submit Tính năng (Tạo / Sửa)
  const handleSubmitFeature = (e) => {
    e.preventDefault();
    if (!featureFormName.trim() || !featureFormModuleId) return;

    if (featureModal.mode === "create") {
      onAddFeature(featureFormModuleId, featureFormName.trim());
    } else if (featureModal.mode === "edit" && featureModal.data) {
      onEditFeature(featureFormModuleId, featureModal.data.id, featureFormName.trim());
    }
    setFeatureModal({ isOpen: false, mode: "create", moduleId: "", data: null });
  };

  // Xác nhận xóa
  const handleConfirmDelete = () => {
    if (deleteConfirm.type === "module") {
      onDeleteModule(deleteConfirm.id);
    } else if (deleteConfirm.type === "feature") {
      onDeleteFeature(deleteConfirm.parentId, deleteConfirm.id);
    } else if (deleteConfirm.type === "guide") {
      onDeleteGuide(deleteConfirm.parentId, deleteConfirm.id);
    }
    setDeleteConfirm({ isOpen: false, type: "", id: "", parentId: "", name: "" });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50/50 p-6 md:p-8 space-y-6">
      {/* 1. Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
        <button
          type="button"
          onClick={onGoBackHome}
          className="hover:text-emerald-800 transition-colors cursor-pointer"
        >
          Trang chủ
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">Cấu hình phân cấp (3 Cấp)</span>
      </div>

      {/* 2. Tiêu đề & Giới thiệu Kiến Trúc 3 Cấp */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Cấu hình Phân Cấp Hệ Thống
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Quản trị 3 cấp: <span className="font-bold text-emerald-900">Cấp 1: Module</span> &gt; <span className="font-bold text-emerald-800">Cấp 2: Tính năng</span> &gt; <span className="font-bold text-gray-700">Cấp 3: Bài viết</span>
          </p>
        </div>

        {/* Nút Tạo Module & Tính Năng Mới */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleOpenCreateModule}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Thêm Module</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateFeature(modulesList[0]?.id)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 text-xs font-bold rounded-lg border border-emerald-300 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-800" />
            <span>+ Thêm Tính Năng</span>
          </button>
        </div>
      </div>

      {/* 3. Toolbar lọc và tìm kiếm */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Bộ lọc */}
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#d8eee6] text-emerald-950 text-xs font-bold rounded-lg border border-[#a2dac7] hover:bg-[#c9e8dc] transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-800" />
            <span>Bộ lọc</span>
            <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[9px] flex items-center justify-center font-bold ml-0.5">
              3
            </span>
          </button>

          {/* Sắp xếp */}
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span>Sắp xếp A-Z</span>
          </button>

          {/* Tìm kiếm */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm Module hoặc Tính năng..."
              className="w-64 pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 shadow-2xs focus:outline-hidden focus:border-emerald-600 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Làm mới bảng"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. BẢNG CÂY THƯ MỤC 3 TẦNG CHUẨN UI FIGMA & FIRST PRINCIPLES */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#eaf7f2] text-gray-900 font-bold border-b border-[#cdeade] text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Tên hiển thị phân cấp (Module &gt; Tính năng &gt; Bài viết)</th>
              <th className="py-3 px-4 w-32 text-center">Số bài viết</th>
              <th className="py-3 px-4 w-44 text-right pr-4">Thao tác quản trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {modulesList.map((mod) => {
              const modData = guideData[mod.id] || { featureGroups: [] };
              const features = [];
              modData.featureGroups.forEach((fg) => {
                if (fg.features) features.push(...fg.features);
              });

              // Tổng số bài trong module
              const totalGuidesInMod = features.reduce(
                (sum, f) => sum + (f.guides?.length || 0),
                0
              );

              const isModCollapsed = collapsedNodes[`mod_${mod.id}`];

              // Lọc theo search
              const matchModName = mod.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchChildFeat = features.some((f) =>
                f.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (searchQuery.trim() && !matchModName && !matchChildFeat) {
                return null;
              }

              return (
                <React.Fragment key={mod.id}>
                  {/* TẦNG 1: CẤP MODULE (Bán hàng, Mua hàng...) */}
                  <tr className="bg-gray-50/80 hover:bg-emerald-50/50 transition-colors border-t border-gray-200">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => toggleNode(`mod_${mod.id}`)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        >
                          {isModCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </button>

                        <div className="w-6 h-6 rounded-md bg-[#004737] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                          M1
                        </div>

                        <span className="text-sm font-bold text-gray-900">
                          {mod.name}
                        </span>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                          {features.length} tính năng
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center text-gray-700 font-bold">
                      {totalGuidesInMod} bài
                    </td>

                    {/* Actions cho Cấp Module */}
                    <td className="py-3 px-4 text-right pr-4">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenCreateFeature(mod.id)}
                          className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                          title="Thêm Tính năng con vào Module này"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModule(mod)}
                          className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                          title="Chỉnh sửa tên Module"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              type: "module",
                              id: mod.id,
                              parentId: "",
                              name: mod.name
                            })
                          }
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                          title="Xóa Module này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* TẦNG 2: CẤP TÍNH NĂNG (Đơn hàng SO, Phiếu giao hàng DO...) */}
                  {!isModCollapsed &&
                    features.map((feat) => {
                      const isFeatCollapsed = collapsedNodes[`feat_${feat.id}`];
                      const guidesCount = feat.guides?.length || 0;

                      return (
                        <React.Fragment key={feat.id}>
                          <tr className="bg-white hover:bg-emerald-50/30 transition-colors">
                            <td className="py-2.5 px-4 pl-10 font-bold text-gray-800">
                              <div className="inline-flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => toggleNode(`feat_${feat.id}`)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                                >
                                  {isFeatCollapsed ? (
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                  )}
                                </button>

                                <div className="w-5 h-5 rounded bg-blue-100 text-blue-800 flex items-center justify-center text-[9px] font-bold">
                                  F2
                                </div>

                                <span className="text-xs font-bold text-gray-900">
                                  {feat.name}
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-4 text-center text-gray-600 font-semibold">
                              {guidesCount} bài
                            </td>

                            {/* Actions cho Cấp Tính năng */}
                            <td className="py-2.5 px-4 text-right pr-4">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => onOpenCreateGuideForFeature(mod.id, feat.id)}
                                  className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                                  title="Soạn bài hướng dẫn mới cho Tính năng này"
                                >
                                  <FilePlus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditFeature(mod.id, feat)}
                                  className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                                  title="Đổi tên Tính năng"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      isOpen: true,
                                      type: "feature",
                                      id: feat.id,
                                      parentId: mod.id,
                                      name: feat.name
                                    })
                                  }
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                                  title="Xóa Tính năng này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* TẦNG 3: CẤP BÀI VIẾT (Tạo đơn bán mới, Xử lý lỗi...) */}
                          {!isFeatCollapsed &&
                            feat.guides?.map((guide, gIdx) => (
                              <tr
                                key={guide.id || gIdx}
                                className="bg-gray-50/30 hover:bg-emerald-50/20 transition-colors"
                              >
                                <td className="py-2 px-4 pl-20 text-gray-700 font-medium">
                                  <div className="inline-flex items-center space-x-2">
                                    <CornerDownRight className="w-3.5 h-3.5 text-gray-400" />
                                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                    <span className="text-xs text-gray-800 font-medium truncate max-w-md">
                                      {guide.title || guide.shortTitle}
                                    </span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                        guide.status === "active"
                                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                          : "bg-amber-100 text-amber-800 border border-amber-200"
                                      }`}
                                    >
                                      {guide.status === "active" ? "Active" : "Nháp"}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-2 px-4 text-center text-gray-400 text-[11px]">
                                  {guide.code || `AC-${12312 + gIdx}`}
                                </td>

                                {/* Actions cho Cấp Bài Viết */}
                                <td className="py-2 px-4 text-right pr-4">
                                  <div className="flex items-center justify-end space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => onOpenEditGuide(guide)}
                                      className="p-1 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                                      title="Chỉnh sửa bài viết"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteConfirm({
                                          isOpen: true,
                                          type: "guide",
                                          id: guide.id,
                                          parentId: mod.id,
                                          name: guide.title
                                        })
                                      }
                                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                      title="Xóa bài viết"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: TẠO / SỬA CẤP 1 - MODULE */}
      {moduleModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                {moduleModal.mode === "create" ? "Thêm Module mới (Cấp 1)" : "Chỉnh sửa tên Module"}
              </h3>
              <button
                type="button"
                onClick={() => setModuleModal({ isOpen: false, mode: "create", data: null })}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModule} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Tên hiển thị Module <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={moduleFormName}
                  onChange={(e) => setModuleFormName(e.target.value)}
                  placeholder="Ví dụ: Kế Toán & Tài Chính, Quản Lý Kho..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setModuleModal({ isOpen: false, mode: "create", data: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {moduleModal.mode === "create" ? "Tạo Module" : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TẠO / SỬA CẤP 2 - TÍNH NĂNG */}
      {featureModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                {featureModal.mode === "create" ? "Thêm Tính Năng Mới (Cấp 2)" : "Chỉnh sửa tên Tính Năng"}
              </h3>
              <button
                type="button"
                onClick={() => setFeatureModal({ isOpen: false, mode: "create", moduleId: "", data: null })}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeature} className="p-6 space-y-4">
              {/* Chọn Module cha */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Thuộc Module (Cấp 1) <span className="text-red-500">*</span>
                </label>
                <select
                  value={featureFormModuleId}
                  onChange={(e) => setFeatureFormModuleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 font-medium focus:outline-hidden focus:border-emerald-600"
                >
                  {modulesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tên Tính Năng */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Tên hiển thị Tính Năng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={featureFormName}
                  onChange={(e) => setFeatureFormName(e.target.value)}
                  placeholder="Ví dụ: Đơn hàng SO, Kiểm kê vàng, Đúc phôi..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setFeatureModal({ isOpen: false, mode: "create", moduleId: "", data: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {featureModal.mode === "create" ? "Tạo Tính Năng" : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: XÁC NHẬN XÓA (MODULE / TÍNH NĂNG / BÀI VIẾT) */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Xác nhận xóa {deleteConfirm.type === "module" ? "Module" : deleteConfirm.type === "feature" ? "Tính năng" : "Bài viết"}?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Chị đẹp có chắc muốn xóa: <strong className="text-gray-900">"{deleteConfirm.name}"</strong>?
              {deleteConfirm.type === "module" && (
                <span className="block mt-1 text-red-600 font-bold text-[11px]">
                  Lưu ý: Toàn bộ tính năng và bài viết con bên trong module này cũng sẽ bị xóa.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, type: "", id: "", parentId: "", name: "" })}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
