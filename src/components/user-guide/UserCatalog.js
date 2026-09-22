"use client";

import React, { useState } from "react";
import { Search, ChevronRight } from "lucide-react";

export default function UserCatalog({
  moduleName = "Bán Hàng",
  categoryName = "Đơn hàng (SO)",
  featureGroups = [],
  onSelectGuide,
  onGoBackHome
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50/50 p-6 md:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium mb-4">
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
        <span className="text-gray-900 font-bold">{categoryName}</span>
      </div>

      {/* Thanh Search toàn chiều ngang chuẩn UI */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-lg text-xs text-gray-800 placeholder-gray-400 shadow-2xs focus:outline-hidden focus:border-emerald-600 font-medium"
        />
      </div>

      {/* Các Khối Nghiệp Vụ & Lưới Bài Hướng Dẫn */}
      <div className="space-y-8">
        {featureGroups.map((group) => {
          // Lọc các tính năng khớp tìm kiếm
          const filteredFeatures = group.features.filter((feat) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              feat.name.toLowerCase().includes(q) ||
              (feat.subTitle && feat.subTitle.toLowerCase().includes(q))
            );
          });

          if (filteredFeatures.length === 0) return null;

          return (
            <div key={group.id} className="space-y-3.5">
              {/* Tiêu đề nhóm nghiệp vụ */}
              <h2 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider">
                {group.name}
              </h2>

              {/* Grid 6 Card bài hướng dẫn chuẩn banner Sevago Jewelry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredFeatures.map((feat, idx) => {
                  const firstGuide = feat.guides && feat.guides[0];

                  return (
                    <div
                      key={feat.id || idx}
                      onClick={() => onSelectGuide(feat, firstGuide)}
                      className="bg-white rounded-xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-500/80 transition-all cursor-pointer flex flex-col group"
                    >
                      {/* Banner ảnh bìa Sevago Jewelry xanh ngọc lục bảo */}
                      <div className="h-32 bg-radial from-[#00694f] via-[#004737] to-[#002b21] p-3 flex flex-col items-center justify-center relative overflow-hidden text-center select-none">
                        {/* Hiệu ứng tia sáng sparkle nhẹ */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                        {/* Logo Sevago Jewelry Vector */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full border-2 border-white/90 flex items-center justify-center text-white mb-1 shadow-inner">
                            <span className="font-serif font-black text-xl tracking-tighter">SV</span>
                          </div>
                          <span className="text-[11px] font-serif tracking-[0.2em] font-black text-white uppercase">
                            SEVAGO
                          </span>
                          <span className="text-[7px] tracking-[0.3em] text-emerald-200/90 uppercase font-medium">
                            JEWELRY
                          </span>
                        </div>
                      </div>

                      {/* Thông tin Card */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                            {feat.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 font-medium">
                            {feat.subTitle || "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ"}
                          </p>
                        </div>

                        {/* Footer Card */}
                        <div className="flex items-center space-x-1.5 pt-2 border-t border-gray-100">
                          <div className="w-4 h-4 rounded-full bg-[#004737] flex items-center justify-center text-[8px] font-bold text-white">
                            S
                          </div>
                          <span className="text-[10px] text-gray-600 font-medium">
                            Sevago
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
