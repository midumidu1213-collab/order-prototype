"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MODULE_CATEGORIES,
  ALL_MODULES,
  USERS_SAMPLE
} from "@/data/userGuideData";
import {
  BookOpen,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Users,
  BadgePercent,
  Calculator,
  ShoppingBag,
  Boxes,
  Wrench,
  Package,
  Archive,
  Scale,
  Gem,
  CalendarRange,
  Cog,
  Network,
  UserPlus,
  Clock,
  Receipt,
  CheckCircle2,
  Lock,
  ArrowLeft
} from "lucide-react";

// Ánh xạ icon chuỗi sang Component Lucide
const ICON_MAP = {
  ShoppingCart,
  Users,
  BadgePercent,
  Calculator,
  ShoppingBag,
  Boxes,
  Wrench,
  Package,
  Archive,
  Scale,
  Gem,
  CalendarRange,
  Cog,
  ShieldCheck,
  Network,
  UserPlus,
  Clock,
  Receipt,
  UserCheck
};

import SubsystemSwitcher from "@/components/SubsystemSwitcher";

export default function UserGuideSidebar({
  currentUser,
  onSwitchUser,
  selectedModuleId,
  onSelectModule,
  onOpenPermissionModal
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategory = (catId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Lọc các module theo quyền của user hiện tại
  const userAllowedModuleIds = currentUser?.canManageAll
    ? ALL_MODULES.map((m) => m.id)
    : currentUser?.assignedModules || [];

  return (
    <aside className="w-72 bg-[#004737] text-white flex flex-col h-full overflow-y-auto border-r border-[#003d2f] shadow-lg select-none">
      {/* Cục chuyển đổi phân hệ tại đỉnh Sidebar */}
      <SubsystemSwitcher />

      {/* Selector: Chuyển User thử nghiệm Phân Quyền */}
      <div className="p-3 bg-[#003629] border-b border-[#002f23]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase flex items-center">
            <ShieldCheck className="h-3 w-3 mr-1 text-amber-400" />
            Tài khoản xem & Phân quyền
          </span>
        </div>
        <select
          value={currentUser?.id}
          onChange={(e) => {
            const found = USERS_SAMPLE.find((u) => u.id === e.target.value);
            if (found) onSwitchUser(found);
          }}
          className="w-full bg-[#002c21] text-xs text-white rounded-md px-2.5 py-1.5 border border-[#005a46] focus:outline-hidden focus:border-emerald-400 font-medium cursor-pointer"
        >
          {USERS_SAMPLE.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} - {u.role}
            </option>
          ))}
        </select>
      </div>

      {/* Ô tìm kiếm module/tính năng */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            placeholder="Tìm module nghiệp vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#003629] text-xs text-white placeholder-emerald-400/60 pl-8 pr-3 py-1.5 rounded-md border border-[#004f3d] focus:outline-hidden focus:border-emerald-400 transition-colors"
          />
        </div>
      </div>

      {/* Danh sách Modules theo Khối nghiệp vụ - Chỉ hiển thị Module được phân quyền */}
      <nav className="flex-1 px-2 py-2 space-y-3 overflow-y-auto">
        {MODULE_CATEGORIES.map((cat) => {
          // Lọc các module thuộc category mà user có quyền truy cập
          const accessibleModules = cat.modules.filter((m) => {
            const hasPermission = userAllowedModuleIds.includes(m.id);
            const matchesSearch =
              !searchQuery ||
              m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.code.toLowerCase().includes(searchQuery.toLowerCase());
            return hasPermission && matchesSearch;
          });

          // Nếu không có module nào được cấp quyền trong category này thì ẩn category
          if (accessibleModules.length === 0) return null;

          const isCollapsed = collapsedCategories[cat.id];

          return (
            <div key={cat.id} className="space-y-1">
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 hover:text-white transition-colors"
              >
                <span>{cat.name}</span>
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Danh sách module trong category */}
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {accessibleModules.map((module) => {
                    const IconComponent = ICON_MAP[module.icon] || BookOpen;
                    const isSelected = selectedModuleId === module.id;

                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => onSelectModule(module.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-white text-emerald-950 font-bold shadow-sm"
                            : "text-emerald-100 hover:bg-[#00382b] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <IconComponent
                            className={`h-4 w-4 shrink-0 ${
                              isSelected ? "text-emerald-800" : "text-emerald-400"
                            }`}
                          />
                          <span className="truncate">{module.name}</span>
                        </div>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Thông báo nếu không tìm thấy module nào */}
        {userAllowedModuleIds.length === 0 && (
          <div className="p-4 text-center text-xs text-emerald-300/70">
            <Lock className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            Tài khoản hiện tại chưa được cấp quyền truy cập module nào.
          </div>
        )}
      </nav>

      {/* Bottom: Quản trị & Phân quyền Module */}
      <div className="p-3 border-t border-[#003d2f] bg-[#003a2c]">
        <button
          type="button"
          onClick={onOpenPermissionModal}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 hover:text-white text-xs font-semibold border border-emerald-500/30 transition-colors"
        >
          <Settings className="h-3.5 w-3.5 text-amber-400" />
          <span>Cấu hình & Phân quyền</span>
        </button>
      </div>
    </aside>
  );
}
