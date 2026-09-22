"use client";

import React from "react";
import { ALL_MODULES } from "@/data/userGuideData";
import { ChevronRight, User } from "lucide-react";

export default function AdminModuleGrid({ onSelectModule }) {
  const displayModules = ALL_MODULES.slice(0, 10);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Tiêu đề trang Hub Admin */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          Bạn cần hướng dẫn module nào?
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Chọn module để xem các nhóm nghiệp vụ và bài viết liên quan.
        </p>
      </div>

      {/* Grid 2x5 các Module */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayModules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => onSelectModule(mod.id)}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
                  <User className="w-4 h-4 fill-white" />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors truncate">
                  {mod.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                  {mod.categoryCount || 3} Mục - {mod.guideCount || 7} Bài Hướng Dẫn
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
