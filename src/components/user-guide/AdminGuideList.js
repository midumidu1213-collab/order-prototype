"use client";

import React, { useState } from "react";
import {
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  SlidersHorizontal,
  RotateCw,
  Edit,
  Lock,
  Unlock,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  User
} from "lucide-react";

export default function AdminGuideList({
  moduleName = "Bán Hàng",
  featureName = "Đơn hàng (SO)",
  guides = [],
  onOpenCreateGuide,
  onOpenEditGuide,
  onDeleteGuide,
  onToggleGuideStatus,
  onGoBackHome
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "draft"
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Tính số liệu thống kê
  const totalCount = guides.length || 12;
  const activeCount = guides.filter((g) => g.status === "active").length || 12;
  const draftCount = guides.filter((g) => g.status === "draft").length || 0;

  // Lọc dữ liệu bảng
  const filteredGuides = guides.filter((g) => {
    const matchSearch =
      !searchQuery.trim() ||
      g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === "all" || (g.status || "active") === statusFilter;

    return matchSearch && matchStatus;
  });

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
        <span className="text-gray-700 font-semibold">{moduleName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold">{featureName}</span>
      </div>

      {/* 2. Tiêu đề Phân hệ */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {featureName}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">
          Quản lý nội dung hướng dẫn thuộc phân hệ {moduleName}
        </p>
      </div>

      {/* 3. Ba Card Thống Kê chuẩn UI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            TỔNG BÀI VIẾT
          </span>
          <div className="text-3xl font-extrabold text-gray-900">
            {totalCount}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            ĐANG PHÁT HÀNH
          </span>
          <div className="text-3xl font-extrabold text-gray-900">
            {activeCount}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            BẢN NHÁP
          </span>
          <div className="text-3xl font-extrabold text-gray-900">
            {draftCount > 0 ? draftCount : 12}
          </div>
        </div>
      </div>

      {/* 4. Khối Danh Sách Bài Hướng Dẫn */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-bold text-gray-900">
          Danh sách bài hướng dẫn
        </h2>

        {/* Toolbar chuẩn */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Nút Bộ lọc */}
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#d8eee6] text-emerald-950 text-xs font-bold rounded-lg border border-[#a2dac7] hover:bg-[#c9e8dc] transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-800" />
              <span>Bộ lọc</span>
              <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[9px] flex items-center justify-center font-bold ml-0.5">
                2
              </span>
            </button>

            {/* Nút Sắp xếp */}
            <button
              type="button"
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <span>Sắp xếp</span>
            </button>

            {/* Ô tìm kiếm */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhà kho"
                className="w-56 sm:w-64 pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 shadow-2xs focus:outline-hidden focus:border-emerald-600 font-medium"
              />
            </div>

            {/* Dropdown Trạng thái */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 font-semibold shadow-2xs focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value="all">Trạng thái Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="draft">Bản nháp</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenCreateGuide}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#004737] hover:bg-[#00382b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bài viết mới</span>
            </button>

            <button
              type="button"
              className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Tùy chỉnh cột hiển thị"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Làm mới bảng"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. Bảng Dữ Liệu Bài Viết Chuẩn UI */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-14 text-center">STT</th>
                  <th className="py-3.5 px-4 w-32">Mã hướng dẫn</th>
                  <th className="py-3.5 px-4">Tên bài hướng dẫn</th>
                  <th className="py-3.5 px-4 w-36">Trạng thái</th>
                  <th className="py-3.5 px-4 w-52">Người tạo</th>
                  <th className="py-3.5 px-4 w-40">Ngày tạo</th>
                  <th className="py-3.5 px-4 w-28 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((guide, idx) => {
                    const isActive = (guide.status || "active") === "active";

                    return (
                      <tr
                        key={guide.id || idx}
                        className="hover:bg-emerald-50/30 transition-colors"
                      >
                        <td className="py-3.5 px-4 text-center text-gray-500 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {guide.code || `AC-${12312 + idx}`}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {guide.shortTitle || guide.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                                : "bg-amber-50 text-amber-700 border border-amber-300"
                            }`}
                          >
                            {isActive ? "Đang hoạt động" : "Bản nháp"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <span className="text-gray-800 truncate">
                              {guide.author || "[03920] - Trần Minh Tuấn"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-medium">
                          {guide.createdAt || "23/07/2024 09:00"}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5 text-gray-500">
                            {/* Nút sửa */}
                            <button
                              type="button"
                              onClick={() => onOpenEditGuide(guide)}
                              className="p-1 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút khóa/mở khóa */}
                            <button
                              type="button"
                              onClick={() => onToggleGuideStatus(guide)}
                              className="p-1 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                              title={isActive ? "Khóa bài" : "Kích hoạt"}
                            >
                              {isActive ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Nút xóa */}
                            <button
                              type="button"
                              onClick={() => onDeleteGuide(guide)}
                              className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      Không có bài viết hướng dẫn nào khớp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân Trang ở đáy */}
          <div className="p-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-gray-400 font-medium text-[11px]">
              Hiển thị 1 - {filteredGuides.length} trên tổng số {totalCount} bài viết
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  disabled
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  disabled
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md bg-[#004737] text-white font-bold cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  3
                </button>
                <span className="px-1 text-gray-400">...</span>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  10
                </button>

                <button
                  type="button"
                  className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative ml-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none pl-3 pr-7 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700 font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
