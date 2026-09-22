"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ALL_MODULES,
  MODULE_CATEGORIES,
  USERS_SAMPLE,
  USER_GUIDE_DATA,
  INITIAL_ADMIN_TREE_DATA
} from "@/data/userGuideData";
import {
  Grid,
  ShoppingCart,
  Users,
  BadgePercent,
  Calculator,
  Bell,
  Search,
  Settings,
  ChevronDown,
  ChevronLeft,
  LayoutGrid,
  FileText,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  X,
  Plus,
  Check,
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
  UserCheck
} from "lucide-react";

import UserModuleGrid from "@/components/user-guide/UserModuleGrid";
import UserCatalog from "@/components/user-guide/UserCatalog";
import UserDetail from "@/components/user-guide/UserDetail";
import AdminModuleGrid from "@/components/user-guide/AdminModuleGrid";
import AdminGuideList from "@/components/user-guide/AdminGuideList";
import AdminTreeConfig from "@/components/user-guide/AdminTreeConfig";
import AdminGuideEditor from "@/components/user-guide/AdminGuideEditor";

export default function UserGuidePage() {
  // Danh sách Modules có thể tạo mới / sửa / xóa thời gian thực
  const [modulesList, setModulesList] = useState(ALL_MODULES);

  // Dữ liệu phân cấp & bài viết thời gian thực
  const [guideData, setGuideData] = useState(USER_GUIDE_DATA);

  // Chế độ xem: "user" (View User) hoặc "admin" (View Admin - Cấu hình)
  const [viewMode, setViewMode] = useState("user"); // "user" | "admin"

  // User & Phân quyền
  const [currentUser, setCurrentUser] = useState(USERS_SAMPLE[0]);

  // Trạng thái điều hướng màn hình:
  // User mode: "user_module_grid" | "user_catalog" | "user_detail"
  // Admin mode: "admin_module_grid" | "admin_guide_list" | "admin_tree_config" | "admin_guide_editor"
  const [currentScreen, setCurrentScreen] = useState("user_module_grid");

  // Module & Feature đang chọn
  const [selectedModuleId, setSelectedModuleId] = useState("sales");
  const [selectedFeatureId, setSelectedFeatureId] = useState("feat_so_create");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [editingGuide, setEditingGuide] = useState(null);

  // Dropdown chuyển đổi Module ở đầu Sidebar
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const moduleDropdownRef = useRef(null);

  // Trạng thái thu gọn Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Đóng module dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        moduleDropdownRef.current &&
        !moduleDropdownRef.current.contains(e.target)
      ) {
        setIsModuleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy thông tin Module hiện tại
  const currentModule = useMemo(() => {
    return (
      modulesList.find((m) => m.id === selectedModuleId) || modulesList[0] || {
        id: "sales",
        name: "Bán Hàng"
      }
    );
  }, [modulesList, selectedModuleId]);

  // Lấy dữ liệu của Module hiện tại
  const currentModuleData = useMemo(() => {
    return (
      guideData[selectedModuleId] || {
        featureGroups: [
          {
            id: `fg_${selectedModuleId}`,
            name: `QUẢN LÝ ${currentModule?.name?.toUpperCase() || ""}`,
            features: [
              {
                id: `feat_${selectedModuleId}_1`,
                name: `Tạo đơn hàng`,
                subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
                guides: []
              }
            ]
          }
        ]
      }
    );
  }, [selectedModuleId, guideData, currentModule]);

  // Lấy tất cả bài viết trong Module hiện tại
  const allGuidesInCurrentModule = useMemo(() => {
    const list = [];
    currentModuleData.featureGroups.forEach((fg) => {
      fg.features.forEach((feat) => {
        if (feat.guides) {
          list.push(...feat.guides);
        }
      });
    });
    return list;
  }, [currentModuleData]);

  // Danh sách tính năng của Module
  const currentFeaturesList = useMemo(() => {
    const list = [];
    currentModuleData.featureGroups.forEach((fg) => {
      fg.features.forEach((feat) => {
        list.push({ ...feat, groupName: fg.name });
      });
    });
    return list;
  }, [currentModuleData]);

  // Tìm feature đang active
  const activeFeature = useMemo(() => {
    return (
      currentFeaturesList.find((f) => f.id === selectedFeatureId) ||
      currentFeaturesList[0]
    );
  }, [currentFeaturesList, selectedFeatureId]);

  // --- ACTIONS CHUYỂN MODULE ---
  const handleSelectModuleGlobal = (modId) => {
    setSelectedModuleId(modId);
    setIsModuleDropdownOpen(false);

    const modData = guideData[modId];
    if (modData && modData.featureGroups[0]?.features[0]) {
      const firstFeat = modData.featureGroups[0].features[0];
      setSelectedFeatureId(firstFeat.id);
    }

    if (viewMode === "user") {
      setCurrentScreen("user_catalog");
    } else {
      setCurrentScreen("admin_guide_list");
    }
  };

  // --- ACTIONS CHO VIEW USER ---
  const handleUserSelectModule = (moduleId) => {
    handleSelectModuleGlobal(moduleId);
  };

  const handleUserSelectGuide = (feature, guide) => {
    if (feature) setSelectedFeatureId(feature.id);
    if (guide) {
      setSelectedGuide(guide);
    } else if (feature?.guides?.[0]) {
      setSelectedGuide(feature.guides[0]);
    } else {
      setSelectedGuide(allGuidesInCurrentModule[0] || null);
    }
    setCurrentScreen("user_detail");
  };

  // --- ACTIONS CHO VIEW ADMIN ---
  const handleAdminSelectModule = (moduleId) => {
    handleSelectModuleGlobal(moduleId);
  };

  const handleOpenCreateGuide = () => {
    setEditingGuide(null);
    setCurrentScreen("admin_guide_editor");
  };

  const handleOpenEditGuide = (guide) => {
    setEditingGuide(guide);
    setCurrentScreen("admin_guide_editor");
  };

  const handleSaveGuide = (guidePayload) => {
    setGuideData((prev) => {
      const mod = prev[selectedModuleId] || { featureGroups: [] };
      let found = false;

      const updatedGroups = mod.featureGroups.map((group) => {
        const updatedFeatures = group.features.map((feat) => {
          if (feat.id === selectedFeatureId) {
            found = true;
            const existingIndex = feat.guides.findIndex(
              (g) => g.id === guidePayload.id
            );
            let updatedGuides;
            if (existingIndex >= 0) {
              updatedGuides = [...feat.guides];
              updatedGuides[existingIndex] = guidePayload;
            } else {
              updatedGuides = [guidePayload, ...feat.guides];
            }
            return { ...feat, guides: updatedGuides };
          }
          return feat;
        });
        return { ...group, features: updatedFeatures };
      });

      if (!found && updatedGroups[0]?.features[0]) {
        updatedGroups[0].features[0].guides = [
          guidePayload,
          ...updatedGroups[0].features[0].guides
        ];
      }

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    setCurrentScreen("admin_guide_list");
  };

  const handleDeleteGuide = (targetModuleId, guideId) => {
    const modId = targetModuleId || selectedModuleId;
    setGuideData((prev) => {
      const mod = prev[modId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((group) => {
        const updatedFeatures = group.features.map((feat) => {
          const updatedGuides = feat.guides.filter((g) => g.id !== guideId);
          return { ...feat, guides: updatedGuides };
        });
        return { ...group, features: updatedFeatures };
      });

      return {
        ...prev,
        [modId]: { ...mod, featureGroups: updatedGroups }
      };
    });
  };

  const handleToggleGuideStatus = (guide) => {
    const nextStatus = guide.status === "active" ? "draft" : "active";
    handleSaveGuide({ ...guide, status: nextStatus });
  };

  // --- 3-LEVEL CRUD CHO CẤU HÌNH (ADMIN TREE CONFIG) ---

  // 1. Tạo Module mới (Cấp 1)
  const handleAddModule = (newModName) => {
    const newModId = `mod_custom_${Date.now()}`;
    const newModuleObj = {
      id: newModId,
      name: newModName,
      icon: "Boxes",
      code: `MOD_${newModName.toUpperCase().replace(/\s+/g, "_")}`,
      categoryCount: 1,
      guideCount: 0
    };

    setModulesList((prev) => [...prev, newModuleObj]);

    setGuideData((prev) => ({
      ...prev,
      [newModId]: {
        featureGroups: [
          {
            id: `fg_${newModId}`,
            name: `QUẢN LÝ ${newModName.toUpperCase()}`,
            features: [
              {
                id: `feat_${newModId}_init`,
                name: `Tổng quan ${newModName}`,
                subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
                guides: []
              }
            ]
          }
        ]
      }
    }));
  };

  // 2. Sửa tên Module (Cấp 1)
  const handleEditModule = (modId, newName) => {
    setModulesList((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, name: newName } : m))
    );
  };

  // 3. Xóa Module (Cấp 1)
  const handleDeleteModule = (modId) => {
    setModulesList((prev) => prev.filter((m) => m.id !== modId));
    setGuideData((prev) => {
      const copy = { ...prev };
      delete copy[modId];
      return copy;
    });

    if (selectedModuleId === modId) {
      setSelectedModuleId(modulesList[0]?.id || "sales");
    }
  };

  // 4. Tạo Tính năng mới (Cấp 2)
  const handleAddFeature = (targetModuleId, featName) => {
    const newFeatId = `feat_${Date.now()}`;
    const newFeatObj = {
      id: newFeatId,
      name: featName,
      subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
      guides: []
    };

    setGuideData((prev) => {
      const mod = prev[targetModuleId] || { featureGroups: [] };
      let updatedGroups;

      if (mod.featureGroups.length === 0) {
        updatedGroups = [
          {
            id: `fg_${targetModuleId}`,
            name: "NHÓM TÍNH NĂNG CHÍNH",
            features: [newFeatObj]
          }
        ];
      } else {
        updatedGroups = mod.featureGroups.map((fg, idx) => {
          if (idx === 0) {
            return { ...fg, features: [...fg.features, newFeatObj] };
          }
          return fg;
        });
      }

      return {
        ...prev,
        [targetModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });
  };

  // 5. Sửa tên Tính năng (Cấp 2)
  const handleEditFeature = (targetModuleId, featId, newFeatName) => {
    setGuideData((prev) => {
      const mod = prev[targetModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((fg) => {
        const updatedFeats = fg.features.map((f) =>
          f.id === featId ? { ...f, name: newFeatName } : f
        );
        return { ...fg, features: updatedFeats };
      });

      return {
        ...prev,
        [targetModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });
  };

  // 6. Xóa Tính năng (Cấp 2)
  const handleDeleteFeature = (targetModuleId, featId) => {
    setGuideData((prev) => {
      const mod = prev[targetModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((fg) => {
        const updatedFeats = fg.features.filter((f) => f.id !== featId);
        return { ...fg, features: updatedFeats };
      });

      return {
        ...prev,
        [targetModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });
  };

  // Mở trình soạn thảo bài viết cho 1 Tính Năng cụ thể từ Cấu hình
  const handleOpenCreateGuideForFeature = (modId, featId) => {
    setSelectedModuleId(modId);
    setSelectedFeatureId(featId);
    setEditingGuide(null);
    setCurrentScreen("admin_guide_editor");
  };

  // Switch giữa User Mode và Admin Mode
  const handleSwitchMode = (mode) => {
    setViewMode(mode);
    if (mode === "user") {
      setCurrentScreen("user_module_grid");
    } else {
      setCurrentScreen("admin_guide_list");
    }
  };

  // Kiểm tra hiển thị Sidebar
  const shouldShowUserSidebar =
    viewMode === "user" && currentScreen === "user_catalog";

  const shouldShowAdminSidebar =
    viewMode === "admin" &&
    [
      "admin_module_grid",
      "admin_guide_list",
      "admin_tree_config",
      "admin_guide_editor"
    ].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f4f7f6] text-gray-900 select-none">
      {/* 1. TOPBAR TOÀN CỤC CHUẨN UI FIGMA */}
      <header className="h-14 bg-white border-b border-gray-200/90 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-2xs z-30">
        {/* Left: App Launcher & Logo Hướng Dẫn Sử Dụng */}
        <div className="flex items-center space-x-3.5">
          {currentScreen === "user_detail" ? (
            <button
              type="button"
              onClick={() => setCurrentScreen("user_catalog")}
              className="inline-flex items-center space-x-1 text-xs font-bold text-gray-800 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{currentModule?.name || "Bán Hàng"}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                title="Ứng dụng liên kết"
              >
                <Grid className="w-5 h-5" />
              </button>

              <Link
                href="/user-guide"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentScreen(
                    viewMode === "user"
                      ? "user_module_grid"
                      : "admin_guide_list"
                  );
                }}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#eb4d4b] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-gray-900 tracking-tight">
                  Hướng Dẫn Sử Dụng
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Center: Chuyển đổi linh hoạt giữa View User & View Admin */}
        <div className="hidden sm:flex items-center bg-gray-100/90 p-1 rounded-xl border border-gray-200 shadow-inner">
          <button
            type="button"
            onClick={() => handleSwitchMode("user")}
            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "user"
                ? "bg-[#004737] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View User (Người Dùng)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("admin")}
            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "admin"
                ? "bg-[#004737] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            View Admin (Cấu Hình & Quản Trị)
          </button>
        </div>

        {/* Right: Thông báo & Profile Sevago Jewelry */}
        <div className="flex items-center space-x-3.5">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center space-x-2.5 pl-2 border-l border-gray-200">
            <div className="w-7 h-7 rounded-full bg-[#004737] text-emerald-100 flex items-center justify-center font-serif text-xs font-bold shadow-2xs">
              {currentUser.avatar}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-none">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* ========================================================= */}
        {/* SIDEBAR VIEW USER */}
        {/* ========================================================= */}
        {shouldShowUserSidebar && (
          <aside
            className={`${
              isSidebarCollapsed ? "w-16" : "w-56 md:w-60"
            } bg-[#004737] text-white flex flex-col h-full shrink-0 border-r border-[#00382b] transition-all duration-200 select-none z-20`}
          >
            {/* Nút Dropdown Phân hệ ở đỉnh Sidebar */}
            <div ref={moduleDropdownRef} className="p-3 border-b border-[#00382b] relative">
              <button
                type="button"
                onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#00382b] hover:bg-[#002f23] rounded-lg text-xs font-bold text-white shadow-inner transition-colors cursor-pointer"
                title="Chuyển sang module khác"
              >
                {!isSidebarCollapsed ? (
                  <>
                    <span className="truncate">{currentModule?.name || "Bán hàng"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-emerald-300 transition-transform ${
                        isModuleDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                ) : (
                  <ShoppingCart className="w-4 h-4 text-emerald-300 mx-auto" />
                )}
              </button>

              {/* Popup Menu chọn Module */}
              {isModuleDropdownOpen && (
                <div className="absolute top-full left-3 right-3 mt-1.5 bg-[#003629] border border-[#005a46] rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto animate-in fade-in-50 zoom-in-98 duration-100 p-1.5 space-y-0.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider border-b border-[#004737] mb-1">
                    Chọn Phân Hệ Nghiệp Vụ
                  </div>
                  {modulesList.map((m) => {
                    const isSelected = m.id === selectedModuleId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModuleGlobal(m.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                          isSelected
                            ? "bg-white text-[#004737] font-bold shadow-xs"
                            : "text-emerald-100 hover:bg-[#004737] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="pt-1 mt-1 border-t border-[#004737]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModuleDropdownOpen(false);
                        setCurrentScreen("user_module_grid");
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-300 hover:bg-[#004737] transition-colors text-left cursor-pointer"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Xem Tất Cả Module</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items Tính năng */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {currentFeaturesList.map((feat, idx) => {
                const isSelected = selectedFeatureId === feat.id;

                return (
                  <button
                    key={feat.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedFeatureId(feat.id);
                      setCurrentScreen("user_catalog");
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#00382b] text-white font-bold shadow-2xs"
                        : "text-emerald-100/80 hover:bg-[#00382b]/60 hover:text-white"
                    }`}
                    title={feat.name}
                  >
                    {idx === 0 && <ShoppingCart className="w-4 h-4 shrink-0 text-emerald-300" />}
                    {idx === 1 && <Users className="w-4 h-4 shrink-0 text-emerald-300" />}
                    {idx === 2 && <BadgePercent className="w-4 h-4 shrink-0 text-emerald-300" />}
                    {idx >= 3 && <Calculator className="w-4 h-4 shrink-0 text-emerald-300" />}

                    {!isSidebarCollapsed && (
                      <span className="truncate">{feat.name}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom: Cài đặt & Ẩn điều hướng */}
            <div className="p-2 border-t border-[#00382b] space-y-1">
              <button
                type="button"
                onClick={() => handleSwitchMode("admin")}
                className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-emerald-200/90 hover:text-white hover:bg-[#00382b] rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Cài đặt</span>}
              </button>

              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-emerald-200/90 hover:text-white hover:bg-[#00382b] rounded-lg transition-colors cursor-pointer"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 shrink-0" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 shrink-0" />
                )}
                {!isSidebarCollapsed && <span>Ẩn điều hướng</span>}
              </button>
            </div>
          </aside>
        )}

        {/* ========================================================= */}
        {/* SIDEBAR VIEW ADMIN (ĐẦY ĐỦ NÚT MODULE & NÚT CẤU HÌNH Ở ĐÁY) */}
        {/* ========================================================= */}
        {shouldShowAdminSidebar && (
          <aside
            className={`${
              isSidebarCollapsed ? "w-16" : "w-56 md:w-60"
            } bg-[#004737] text-white flex flex-col h-full shrink-0 border-r border-[#00382b] transition-all duration-200 select-none z-20`}
          >
            {/* 1. NÚT DROPDOWN CHUYỂN MODULE Ở ĐỈNH SIDEBAR ADMIN */}
            <div ref={moduleDropdownRef} className="p-3 border-b border-[#00382b] relative">
              <button
                type="button"
                onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#00382b] hover:bg-[#002f23] rounded-lg text-xs font-bold text-white shadow-inner transition-colors cursor-pointer"
                title="Chuyển sang module khác"
              >
                {!isSidebarCollapsed ? (
                  <>
                    <span className="truncate">{currentModule?.name || "Bán hàng"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-emerald-300 transition-transform ${
                        isModuleDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                ) : (
                  <ShoppingCart className="w-4 h-4 text-emerald-300 mx-auto" />
                )}
              </button>

              {/* Popup Menu chọn Module trong Admin */}
              {isModuleDropdownOpen && (
                <div className="absolute top-full left-3 right-3 mt-1.5 bg-[#003629] border border-[#005a46] rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto animate-in fade-in-50 zoom-in-98 duration-100 p-1.5 space-y-0.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider border-b border-[#004737] mb-1">
                    Chọn Module Quản Trị
                  </div>
                  {modulesList.map((m) => {
                    const isSelected = m.id === selectedModuleId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModuleGlobal(m.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                          isSelected
                            ? "bg-white text-[#004737] font-bold shadow-xs"
                            : "text-emerald-100 hover:bg-[#004737] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="pt-1 mt-1 border-t border-[#004737]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModuleDropdownOpen(false);
                        setCurrentScreen("admin_module_grid");
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-300 hover:bg-[#004737] transition-colors text-left cursor-pointer"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Xem Tất Cả Module</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. DANH SÁCH CÁC TÍNH NĂNG CON CỦA MODULE */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider">
                {!isSidebarCollapsed && "Tính năng (Cấp 2)"}
              </div>

              {currentFeaturesList.map((feat, idx) => {
                const isSelected =
                  currentScreen === "admin_guide_list" &&
                  selectedFeatureId === feat.id;

                return (
                  <button
                    key={feat.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedFeatureId(feat.id);
                      setCurrentScreen("admin_guide_list");
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#00382b] text-white font-bold shadow-2xs"
                        : "text-emerald-100/80 hover:bg-[#00382b]/60 hover:text-white"
                    }`}
                    title={feat.name}
                  >
                    {idx === 0 && <ShoppingCart className="w-4 h-4 shrink-0 text-emerald-300" />}
                    {idx === 1 && <ShoppingCart className="w-4 h-4 shrink-0 text-emerald-300" />}
                    {idx === 2 && <Users className="w-4 h-4 shrink-0 text-emerald-300" />}
                    {idx >= 3 && <BadgePercent className="w-4 h-4 shrink-0 text-emerald-300" />}

                    {!isSidebarCollapsed && (
                      <span className="truncate">{feat.name}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 3. NÚT CẤU HÌNH & NÚT ẨN ĐIỀU HƯỚNG Ở ĐÁY SIDEBAR ADMIN */}
            <div className="p-2 border-t border-[#00382b] space-y-1">
              {/* NÚT CẤU HÌNH (Gear icon) - Luôn hiển thị ở đáy Sidebar Admin */}
              <button
                type="button"
                onClick={() => setCurrentScreen("admin_tree_config")}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentScreen === "admin_tree_config"
                    ? "bg-white text-[#004737] font-black shadow-xs"
                    : "text-emerald-200/90 hover:text-white hover:bg-[#00382b]"
                }`}
                title="Cấu hình phân cấp 3 tầng (Module > Tính năng > Bài viết)"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Cấu hình (3 Cấp)</span>}
              </button>

              {/* Nút Ẩn điều hướng */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-emerald-200/90 hover:text-white hover:bg-[#00382b] rounded-lg transition-colors cursor-pointer"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 shrink-0" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 shrink-0" />
                )}
                {!isSidebarCollapsed && <span>Ẩn điều hướng</span>}
              </button>
            </div>
          </aside>
        )}

        {/* 3. KHU VỰC NỘI DUNG CHÍNH (MAIN VIEW) */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
          {/* VIEW USER - SCREEN 1: CHỌN MODULE */}
          {viewMode === "user" && currentScreen === "user_module_grid" && (
            <UserModuleGrid onSelectModule={handleUserSelectModule} />
          )}

          {/* VIEW USER - SCREEN 2: DANH MỤC BÀI VIẾT (BANNER SEVAGO JEWELRY) */}
          {viewMode === "user" && currentScreen === "user_catalog" && (
            <UserCatalog
              moduleName={currentModule?.name}
              categoryName={activeFeature?.name || "Đơn hàng (SO)"}
              featureGroups={currentModuleData.featureGroups}
              onSelectGuide={handleUserSelectGuide}
              onGoBackHome={() => setCurrentScreen("user_module_grid")}
            />
          )}

          {/* VIEW USER - SCREEN 3: CHI TIẾT BÀI VIẾT (VIDEO + 4 TABS + PLAYLIST) */}
          {viewMode === "user" && currentScreen === "user_detail" && (
            <UserDetail
              guide={selectedGuide || allGuidesInCurrentModule[0]}
              allGuidesInModule={allGuidesInCurrentModule}
              onSelectGuideFromPlaylist={(g) => setSelectedGuide(g)}
              onGoBackToCatalog={() => setCurrentScreen("user_catalog")}
            />
          )}

          {/* VIEW ADMIN - SCREEN A: HUB CHỌN MODULE */}
          {viewMode === "admin" && currentScreen === "admin_module_grid" && (
            <AdminModuleGrid onSelectModule={handleAdminSelectModule} />
          )}

          {/* VIEW ADMIN - SCREEN B: DANH SÁCH BÀI VIẾT THEO PHÂN HỆ + STATS + BẢNG */}
          {viewMode === "admin" && currentScreen === "admin_guide_list" && (
            <AdminGuideList
              moduleName={currentModule?.name}
              featureName={activeFeature?.name || "Đơn hàng (SO)"}
              guides={activeFeature?.guides || allGuidesInCurrentModule}
              onOpenCreateGuide={handleOpenCreateGuide}
              onOpenEditGuide={handleOpenEditGuide}
              onDeleteGuide={(g) => handleDeleteGuide(selectedModuleId, g.id)}
              onToggleGuideStatus={handleToggleGuideStatus}
              onGoBackHome={() => setCurrentScreen("admin_module_grid")}
            />
          )}

          {/* VIEW ADMIN - SCREEN C: CẤU HÌNH PHÂN CẤP 3 TẦNG (MODULE > TÍNH NĂNG > BÀI VIẾT) */}
          {viewMode === "admin" && currentScreen === "admin_tree_config" && (
            <AdminTreeConfig
              modulesList={modulesList}
              guideData={guideData}
              onAddModule={handleAddModule}
              onEditModule={handleEditModule}
              onDeleteModule={handleDeleteModule}
              onAddFeature={handleAddFeature}
              onEditFeature={handleEditFeature}
              onDeleteFeature={handleDeleteFeature}
              onOpenCreateGuideForFeature={handleOpenCreateGuideForFeature}
              onOpenEditGuide={handleOpenEditGuide}
              onDeleteGuide={handleDeleteGuide}
              onGoBackHome={() => setCurrentScreen("admin_guide_list")}
            />
          )}

          {/* VIEW ADMIN - SCREEN D: FORM TẠO / SỬA BÀI VIẾT 2 PHẦN & 4 TABS */}
          {viewMode === "admin" && currentScreen === "admin_guide_editor" && (
            <AdminGuideEditor
              initialGuide={editingGuide}
              moduleName={currentModule?.name}
              featureName={activeFeature?.name || "Đơn hàng (SO)"}
              onSaveGuide={handleSaveGuide}
              onCancel={() => setCurrentScreen("admin_guide_list")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
