"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import UserGuideSidebar from "@/components/UserGuideSidebar";
import {
  ALL_MODULES,
  MODULE_CATEGORIES,
  USERS_SAMPLE,
  USER_GUIDE_DATA
} from "@/data/userGuideData";
import {
  BookOpen,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  Edit3,
  HelpCircle,
  FolderTree,
  Sparkles,
  Search,
  Check,
  X,
  UserCheck,
  Settings,
  Bell,
  Video,
  Play,
  FileSpreadsheet,
  Download,
  Trash2,
  Link2,
  FileDown,
  ToggleLeft,
  ToggleRight,
  FolderPlus,
  Eye,
  EyeOff,
  CornerDownRight,
  Upload
} from "lucide-react";

export default function UserGuidePage() {
  // Quản trị dữ liệu HDSD thời gian thực để hỗ trợ đầy đủ CRUD
  const [guideData, setGuideData] = useState(USER_GUIDE_DATA);

  // Quản lý User hiện tại và phân quyền (mặc định là Admin để Chị đẹp tiện test full chức năng)
  const [currentUser, setCurrentUser] = useState(USERS_SAMPLE[0]);
  const [usersList, setUsersList] = useState(USERS_SAMPLE);

  // Module được chọn (mặc định là sales)
  const [selectedModuleId, setSelectedModuleId] = useState("sales");

  // Tính năng và bài viết đang được xem
  const [selectedFeatureId, setSelectedFeatureId] = useState("feat_so_create");
  const [selectedGuideId, setSelectedGuideId] = useState("guide_so_01");

  // Bộ lọc trạng thái bài viết (Dành cho Admin/Editor): "all" | "active" | "draft" | "inactive"
  const [statusFilter, setStatusFilter] = useState("all");

  // Milestone đang được chọn để xem tương tác
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  // Tìm kiếm toàn cục (Global Omni-Search)
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingGuideId, setEditingGuideId] = useState(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryTarget, setEditCategoryTarget] = useState(null); // { id, name }
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null); // { id, name, featureCount }
  const [deleteConfirmGuide, setDeleteConfirmGuide] = useState(null);

  // Quản lý Tính năng con trong từng hạng mục
  const [addFeatureModalTarget, setAddFeatureModalTarget] = useState(null); // { groupId, groupName }
  const [newFeatureInputName, setNewFeatureInputName] = useState("");
  const [editFeatureTarget, setEditFeatureTarget] = useState(null); // { groupId, featId, name }
  const [deleteFeatureTarget, setDeleteFeatureTarget] = useState(null); // { groupId, featId, name, guideCount }

  // Dữ liệu form bài viết HDSD chuẩn 11 trường thông tin + trạng thái (active/draft)
  const [guideForm, setGuideForm] = useState({
    title: "",
    status: "active", // "active" | "draft" | "inactive"
    category: "",
    isCustomCategory: false,
    featureName: "",
    applicableScreen: "",
    applicablePath: "/",
    description: "",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoFileName: "",
    documents: [
      { name: "Bieu_mau_import_don_hang_SO_v3.xlsx", size: "32.5 KB", type: "excel" },
      { name: "Chinh_sach_ban_si_tiem_vang_2026.pdf", size: "1.4 MB", type: "pdf" }
    ],
    milestones: [
      { time: "00:15", title: "Khởi tạo đơn hàng & chọn đối tác", action: "Gõ tên hoặc mã khách hàng kiểm tra hạn mức nợ" },
      { time: "01:10", title: "Thêm sản phẩm từ E-Catalogue", action: "Lọc theo tuổi vàng và nhặt mẫu nhẫn" },
      { time: "02:30", title: "Áp dụng chiết khấu & Lưu nháp", action: "Điền mã khuyến mãi và lưu trạng thái Draft" }
    ],
    prerequisites: "Tài khoản có quyền Tạo đơn hàng (SO_CREATE)\nKhách hàng đã tồn tại trên Master Data\nBảng giá niêm yết hiện hành",
    steps: "Bước 1: Vào menu Bán Hàng > Quản lý đơn hàng > Thông tin đơn hàng\nBước 2: Bấm nút + Thêm mới góc trên bên phải\nBước 3: Chọn khách hàng và thêm sản phẩm\nBước 4: Áp mã chiết khấu và bấm Lưu tạm (Draft)",
    expectedResult: "Đơn hàng sinh mã SOxxxxxx ở trạng thái Chờ duyệt / Nháp.",
    importantNotes: "Các trường có dấu (*) bắt buộc điền đầy đủ.\nVới đơn gia công đặc biệt cần đính kèm file 3D.",
    commonErrors: "Không tìm thấy khách hàng khi gõ tên: Kiểm tra trạng thái kích hoạt đối tác trên Master Data."
  });

  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("excel");

  // Đóng search khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Phím tắt Ctrl + K để focus vào ô tìm kiếm toàn cục
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Kiểm tra quyền của User hiện tại với Module đang chọn
  const hasEditPermission = useMemo(() => {
    if (currentUser?.canManageAll) return true;
    if (currentUser?.isEndUser) return false;
    return currentUser?.assignedModules?.includes(selectedModuleId);
  }, [currentUser, selectedModuleId]);

  // Lấy thông tin Module hiện tại
  const currentModule = useMemo(() => {
    return ALL_MODULES.find((m) => m.id === selectedModuleId);
  }, [selectedModuleId]);

  // Lấy cây Nhóm chức năng & Tính năng của Module hiện tại
  const moduleData = useMemo(() => {
    return (
      guideData[selectedModuleId] || {
        featureGroups: [
          {
            id: `fg_${selectedModuleId}_default`,
            name: "Tổng quan nghiệp vụ",
            features: [
              {
                id: `feat_${selectedModuleId}_intro`,
                name: `Giới thiệu module ${currentModule?.name || ""}`,
                guides: [
                  {
                    id: `guide_${selectedModuleId}_intro`,
                    title: `Quy chuẩn vận hành module ${currentModule?.name || ""}`,
                    status: "active",
                    author: "Ban Chuyển Đổi Số Sevago",
                    targetAudience: "Toàn bộ nhân sự liên quan",
                    applicableScreen: `Phân hệ ${currentModule?.name || ""}`,
                    applicablePath: "/",
                    description: `Cung cấp kiến trúc và luồng tác nghiệp chuẩn cho phân hệ ${currentModule?.name || ""}.`,
                    videoUrl: "",
                    documents: [],
                    milestones: [],
                    prerequisites: ["Tài khoản người dùng đã được kích hoạt trên hệ thống."],
                    steps: [
                      { stepNum: 1, title: "Truy cập tính năng", action: "Đăng nhập hệ thống và vào menu tương ứng." },
                      { stepNum: 2, title: "Kiểm tra dữ liệu", action: "Đối soát thông tin đầu vào trước khi xác nhận tác nghiệp." }
                    ],
                    expectedResult: "Hệ thống ghi nhận trạng thái và cập nhật cơ sở dữ liệu thời gian thực.",
                    importantNotes: ["Tuân thủ nghiêm ngặt quy định an toàn dữ liệu và quyền truy cập."],
                    commonErrors: [],
                    relatedGuides: []
                  }
                ]
              }
            ]
          }
        ]
      }
    );
  }, [selectedModuleId, currentModule, guideData]);

  // Lọc bài viết theo vai trò (End-User chỉ thấy 'active', Admin/Editor lọc theo statusFilter)
  const filterGuidesByRoleAndStatus = (guides = []) => {
    if (!guides) return [];
    if (currentUser?.isEndUser) {
      return guides.filter((g) => g.status === "active");
    }
    if (statusFilter === "all") return guides;
    return guides.filter((g) => (g.status || "active") === statusFilter);
  };

  // Lấy danh sách tất cả tính năng trong module hiện tại (có tính đến bộ lọc)
  const allFeaturesInModule = useMemo(() => {
    const list = [];
    moduleData.featureGroups.forEach((fg) => {
      fg.features.forEach((feat) => {
        const visibleGuides = filterGuidesByRoleAndStatus(feat.guides);
        list.push({
          ...feat,
          groupName: fg.name,
          visibleGuides
        });
      });
    });
    return list;
  }, [moduleData, currentUser, statusFilter]);

  // Lấy Tính năng đang chọn
  const currentFeature = useMemo(() => {
    return (
      allFeaturesInModule.find((f) => f.id === selectedFeatureId) ||
      allFeaturesInModule[0]
    );
  }, [allFeaturesInModule, selectedFeatureId]);

  // Lấy Bài HDSD đang chọn
  const currentGuide = useMemo(() => {
    if (!currentFeature || !currentFeature.visibleGuides || currentFeature.visibleGuides.length === 0) {
      return null;
    }
    return (
      currentFeature.visibleGuides.find((g) => g.id === selectedGuideId) ||
      currentFeature.visibleGuides[0]
    );
  }, [currentFeature, selectedGuideId]);

  // Xử lý chuyển module
  const handleSelectModule = (moduleId) => {
    setSelectedModuleId(moduleId);
    const modData = guideData[moduleId];
    if (modData && modData.featureGroups[0]?.features[0]) {
      const firstFeat = modData.featureGroups[0].features[0];
      setSelectedFeatureId(firstFeat.id);
      const visible = filterGuidesByRoleAndStatus(firstFeat.guides);
      if (visible && visible[0]) {
        setSelectedGuideId(visible[0].id);
      }
    } else {
      setSelectedFeatureId(`feat_${moduleId}_intro`);
      setSelectedGuideId(`guide_${moduleId}_intro`);
    }
  };

  // TÌM KIẾM TOÀN CỤC XUYÊN SUỐT TẤT CẢ MODULE
  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase().trim();
    const results = [];

    // Duyệt qua tất cả các module
    ALL_MODULES.forEach((mod) => {
      // Nếu là End-user, chỉ tìm trong các module được cấp quyền
      if (currentUser?.isEndUser && !currentUser?.assignedModules?.includes(mod.id)) {
        return;
      }

      const mData = guideData[mod.id];
      if (!mData || !mData.featureGroups) return;

      mData.featureGroups.forEach((fg) => {
        fg.features.forEach((feat) => {
          const guidesToSearch = feat.guides || [];
          guidesToSearch.forEach((guide) => {
            // End-user chỉ tìm thấy bài active
            if (currentUser?.isEndUser && guide.status !== "active") return;

            const matchTitle = guide.title?.toLowerCase().includes(query);
            const matchDesc = guide.description?.toLowerCase().includes(query);
            const matchScreen = guide.applicableScreen?.toLowerCase().includes(query);
            const matchFeat = feat.name?.toLowerCase().includes(query);
            const matchGroup = fg.name?.toLowerCase().includes(query);

            if (matchTitle || matchDesc || matchScreen || matchFeat || matchGroup) {
              results.push({
                moduleId: mod.id,
                moduleName: mod.name,
                groupName: fg.name,
                featureId: feat.id,
                featureName: feat.name,
                guideId: guide.id,
                title: guide.title,
                status: guide.status || "active",
                applicableScreen: guide.applicableScreen,
                description: guide.description
              });
            }
          });
        });
      });
    });

    return results;
  }, [globalSearchQuery, guideData, currentUser]);

  // Click vào kết quả tìm kiếm để điều hướng tức thì
  const handleSelectSearchResult = (result) => {
    setSelectedModuleId(result.moduleId);
    setSelectedFeatureId(result.featureId);
    setSelectedGuideId(result.guideId);
    setIsSearchOpen(false);
    setGlobalSearchQuery("");
  };

  // Mở modal tạo mới
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingGuideId(null);
    const isNewPlaceholder = currentFeature?.name?.startsWith("Tính năng mới");
    const initFeat = isNewPlaceholder ? "" : currentFeature?.name || "";
    const initScreen = initFeat ? `${currentModule?.name} > ${initFeat}` : "";

    setGuideForm({
      title: "",
      status: "active",
      category: currentFeature?.groupName || "",
      isCustomCategory: false,
      featureName: initFeat,
      applicableScreen: initScreen,
      applicablePath: currentGuide?.applicablePath || "/",
      description: "",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoFileName: "",
      documents: [
        { name: "Bieu_mau_import_don_hang_SO_v3.xlsx", size: "32.5 KB", type: "excel" },
        { name: "Chinh_sach_ban_si_tiem_vang_2026.pdf", size: "1.4 MB", type: "pdf" }
      ],
      milestones: [
        { time: "00:15", title: "Khởi tạo đơn hàng & chọn đối tác", action: "Gõ tên hoặc mã tiệm vàng kiểm tra hạn mức nợ" },
        { time: "01:10", title: "Thêm sản phẩm từ E-Catalogue", action: "Lọc theo tuổi vàng và nhặt mẫu nhẫn" },
        { time: "02:30", title: "Áp dụng chiết khấu & Lưu nháp", action: "Điền mã khuyến mãi và lưu trạng thái Draft" }
      ],
      prerequisites: "Tài khoản có quyền thao tác.\nKhách hàng đã tồn tại trên Master Data.",
      steps: "Bước 1: Đăng nhập vào hệ thống\nBước 2: Mở tính năng tương ứng\nBước 3: Thực hiện nghiệp vụ theo quy chuẩn",
      expectedResult: "Nghiệp vụ hoàn tất và dữ liệu được ghi nhận.",
      importantNotes: "Tuân thủ các trường đánh dấu (*).",
      commonErrors: "Lỗi kết nối: Thử tải lại trang hoặc kiểm tra mạng."
    });
    setIsCreateModalOpen(true);
  };

  // Mở modal chỉnh sửa bài viết
  const handleOpenEditModal = (guide) => {
    if (!guide) return;
    setModalMode("edit");
    setEditingGuideId(guide.id);
    setGuideForm({
      title: guide.title || "",
      status: guide.status || "active",
      category: currentFeature?.groupName || "",
      isCustomCategory: false,
      featureName: currentFeature?.name || "",
      applicableScreen: guide.applicableScreen || "",
      applicablePath: guide.applicablePath || "/",
      description: guide.description || "",
      videoUrl: guide.videoUrl || "",
      documents: guide.documents || [],
      milestones: guide.milestones || [],
      prerequisites: guide.prerequisites ? guide.prerequisites.join("\n") : "",
      steps: guide.steps ? guide.steps.map((s) => s.action).join("\n") : "",
      expectedResult: guide.expectedResult || "",
      importantNotes: guide.importantNotes ? guide.importantNotes.join("\n") : "",
      commonErrors: guide.commonErrors && guide.commonErrors[0] ? `${guide.commonErrors[0].error}: ${guide.commonErrors[0].solution}` : ""
    });
    setIsCreateModalOpen(true);
  };

  // Lưu tạo mới hoặc cập nhật bài viết
  const handleSaveGuideSubmit = (e, targetStatus) => {
    e.preventDefault();
    if (!guideForm.title) return;

    const finalStatus = targetStatus || guideForm.status || "active";

    const guidePayload = {
      id: modalMode === "edit" ? editingGuideId : `guide_custom_${Date.now()}`,
      title: guideForm.title,
      status: finalStatus,
      author: currentUser.name,
      targetAudience: "Nhân viên vận hành",
      applicableScreen: guideForm.applicableScreen || `${currentModule?.name || "Module"} > Màn hình tác nghiệp`,
      applicablePath: guideForm.applicablePath || "/",
      description: guideForm.description || "Tài liệu SOP hướng dẫn thao tác nghiệp vụ.",
      videoUrl: guideForm.videoUrl || "",
      documents: guideForm.documents || [],
      milestones: guideForm.milestones || [],
      prerequisites: guideForm.prerequisites
        ? guideForm.prerequisites.split("\n").filter(Boolean)
        : ["Đã phân quyền tác vụ tương ứng."],
      steps: guideForm.steps
        ? guideForm.steps.split("\n").filter(Boolean).map((s, idx) => ({
            stepNum: idx + 1,
            title: `Bước ${idx + 1}`,
            action: s
          }))
        : [{ stepNum: 1, title: "Thực hiện", action: "Thao tác trên giao diện phần mềm." }],
      expectedResult: guideForm.expectedResult || "Tác vụ hoàn thành thành công.",
      importantNotes: guideForm.importantNotes
        ? guideForm.importantNotes.split("\n").filter(Boolean)
        : [],
      commonErrors: guideForm.commonErrors
        ? [
            {
              error: guideForm.commonErrors,
              cause: "Dữ liệu chưa đồng bộ hoặc thiếu điều kiện tiên quyết.",
              solution: "Thử tải lại trang hoặc kiểm tra danh mục cấu hình."
            }
          ]
        : [],
      relatedGuides: []
    };

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((group) => {
        const updatedFeatures = group.features.map((feat) => {
          if (feat.id !== selectedFeatureId) return feat;

          let guidesList = feat.guides ? [...feat.guides] : [];
          if (modalMode === "edit") {
            guidesList = guidesList.map((g) => (g.id === editingGuideId ? guidePayload : g));
          } else {
            guidesList.unshift(guidePayload);
          }

          // Cập nhật tên tính năng chính xác, xóa bỏ placeholder cũ
          let updatedFeatName = feat.name;
          if (!feat.name || feat.name.startsWith("Tính năng mới") || guideForm.featureName) {
            updatedFeatName = (guideForm.featureName && !guideForm.featureName.startsWith("Tính năng mới"))
              ? guideForm.featureName.trim()
              : guideForm.title.trim();
          }

          return { ...feat, name: updatedFeatName, guides: guidesList };
        });
        return { ...group, features: updatedFeatures };
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    setSelectedGuideId(guidePayload.id);
    setIsCreateModalOpen(false);
  };

  // Toggle trạng thái Active / Inactive của bài viết hiện tại
  const handleToggleGuideStatus = (guide) => {
    if (!guide || !hasEditPermission) return;
    const nextStatus = guide.status === "active" ? "inactive" : "active";

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((group) => {
        const updatedFeatures = group.features.map((feat) => {
          if (feat.id !== selectedFeatureId) return feat;
          const updatedGuides = feat.guides.map((g) => {
            if (g.id === guide.id) {
              return { ...g, status: nextStatus };
            }
            return g;
          });
          return { ...feat, guides: updatedGuides };
        });
        return { ...group, features: updatedFeatures };
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });
  };

  // Xóa bài viết
  const handleConfirmDelete = () => {
    if (!deleteConfirmGuide || !hasEditPermission) return;
    const guideToDeleteId = deleteConfirmGuide.id;

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((group) => {
        const updatedFeatures = group.features.map((feat) => {
          if (feat.id !== selectedFeatureId) return feat;
          const updatedGuides = feat.guides.filter((g) => g.id !== guideToDeleteId);
          return { ...feat, guides: updatedGuides };
        });
        return { ...group, features: updatedFeatures };
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    setDeleteConfirmGuide(null);
    setSelectedGuideId(null);
  };

  // Tạo mới Danh mục (Nhóm tính năng) ở bên ngoài
  const handleCreateCategoryOutside = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !hasEditPermission) return;

    const newGroupId = `fg_${selectedModuleId}_${Date.now()}`;
    const newFeatureId = `feat_${newGroupId}_init`;
    const newGroup = {
      id: newGroupId,
      name: newCategoryName.trim(),
      features: [
        {
          id: newFeatureId,
          name: newCategoryName.trim(),
          guides: []
        }
      ]
    };

    setGuideData((prev) => {
      const mod = prev[selectedModuleId] || { featureGroups: [] };
      return {
        ...prev,
        [selectedModuleId]: {
          ...mod,
          featureGroups: [...mod.featureGroups, newGroup]
        }
      };
    });

    setSelectedFeatureId(newFeatureId);
    setNewCategoryName("");
    setIsAddCategoryModalOpen(false);
  };

  // Cập nhật tên Danh mục (Nhóm tính năng)
  const handleSaveEditCategory = (e) => {
    e.preventDefault();
    if (!editCategoryTarget || !editCategoryTarget.name.trim() || !hasEditPermission) return;

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((g) => {
        if (g.id === editCategoryTarget.id) {
          return { ...g, name: editCategoryTarget.name.trim() };
        }
        return g;
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    setEditCategoryTarget(null);
  };

  // Xóa Danh mục (Nhóm tính năng)
  const handleConfirmDeleteCategory = () => {
    if (!deleteCategoryTarget || !hasEditPermission) return;

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.filter((g) => g.id !== deleteCategoryTarget.id);

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    // Nếu tính năng đang xem thuộc nhóm bị xóa, chuyển sang tính năng còn lại đầu tiên
    const currentGroup = moduleData.featureGroups.find((g) => g.id === deleteCategoryTarget.id);
    const hasActiveFeature = currentGroup?.features.some((f) => f.id === selectedFeatureId);
    if (hasActiveFeature) {
      const remainingGroups = moduleData.featureGroups.filter((g) => g.id !== deleteCategoryTarget.id);
      if (remainingGroups[0]?.features[0]) {
        setSelectedFeatureId(remainingGroups[0].features[0].id);
        if (remainingGroups[0].features[0].guides && remainingGroups[0].features[0].guides[0]) {
          setSelectedGuideId(remainingGroups[0].features[0].guides[0].id);
        }
      } else {
        setSelectedFeatureId(null);
        setSelectedGuideId(null);
      }
    }

    setDeleteCategoryTarget(null);
  };

  // Tạo mới Tính năng con trong một Hạng mục
  const handleCreateFeatureSubmit = (e) => {
    e.preventDefault();
    if (!addFeatureModalTarget || !newFeatureInputName.trim() || !hasEditPermission) return;

    const newFeatId = `feat_${Date.now()}`;
    const newFeat = {
      id: newFeatId,
      name: newFeatureInputName.trim(),
      guides: []
    };

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((g) => {
        if (g.id !== addFeatureModalTarget.groupId) return g;
        return {
          ...g,
          features: [...g.features, newFeat]
        };
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    setSelectedFeatureId(newFeatId);
    setSelectedGuideId(null);
    setNewFeatureInputName("");
    setAddFeatureModalTarget(null);
  };

  // Đổi tên Tính năng con
  const handleSaveEditFeature = (e) => {
    e.preventDefault();
    if (!editFeatureTarget || !editFeatureTarget.name.trim() || !hasEditPermission) return;

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((g) => {
        if (g.id !== editFeatureTarget.groupId) return g;
        return {
          ...g,
          features: g.features.map((f) =>
            f.id === editFeatureTarget.featId ? { ...f, name: editFeatureTarget.name.trim() } : f
          )
        };
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    setEditFeatureTarget(null);
  };

  // Xóa Tính năng con
  const handleConfirmDeleteFeature = () => {
    if (!deleteFeatureTarget || !hasEditPermission) return;

    setGuideData((prev) => {
      const mod = prev[selectedModuleId];
      if (!mod || !mod.featureGroups) return prev;

      const updatedGroups = mod.featureGroups.map((g) => {
        if (g.id !== deleteFeatureTarget.groupId) return g;
        return {
          ...g,
          features: g.features.filter((f) => f.id !== deleteFeatureTarget.featId)
        };
      });

      return {
        ...prev,
        [selectedModuleId]: { ...mod, featureGroups: updatedGroups }
      };
    });

    if (selectedFeatureId === deleteFeatureTarget.featId) {
      const currentGroup = moduleData.featureGroups.find((g) => g.id === deleteFeatureTarget.groupId);
      const remainingInGroup = currentGroup?.features.filter((f) => f.id !== deleteFeatureTarget.featId) || [];
      if (remainingInGroup[0]) {
        setSelectedFeatureId(remainingInGroup[0].id);
        if (remainingInGroup[0].guides && remainingInGroup[0].guides[0]) {
          setSelectedGuideId(remainingInGroup[0].guides[0].id);
        } else {
          setSelectedGuideId(null);
        }
      } else {
        const otherGroups = moduleData.featureGroups.filter((g) => g.id !== deleteFeatureTarget.groupId);
        if (otherGroups[0]?.features[0]) {
          setSelectedFeatureId(otherGroups[0].features[0].id);
          setSelectedGuideId(otherGroups[0].features[0].guides?.[0]?.id || null);
        } else {
          setSelectedFeatureId(null);
          setSelectedGuideId(null);
        }
      }
    }

    setDeleteFeatureTarget(null);
  };

  // Thêm mốc giai đoạn trong modal
  const handleAddMilestone = () => {
    setGuideForm((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { time: "00:00", title: "Mốc hành động mới", action: "Mô tả chi tiết hành động" }
      ]
    }));
  };

  const handleUpdateMilestone = (index, field, value) => {
    setGuideForm((prev) => {
      const updated = [...prev.milestones];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, milestones: updated };
    });
  };

  const handleRemoveMilestone = (index) => {
    setGuideForm((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  // Upload video trực tiếp từ thiết bị
  const handleUploadVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setGuideForm((prev) => ({
      ...prev,
      videoUrl: blobUrl,
      videoFileName: file.name
    }));
  };

  // Thêm tài liệu đính kèm bằng cách gõ tên
  const handleAddDocument = () => {
    if (!newDocName.trim()) return;
    const trimmed = newDocName.trim();
    const ext = trimmed.includes(".") ? trimmed.split(".").pop().toLowerCase() : "xlsx";
    let docType = "other";
    if (["xlsx", "xls", "csv"].includes(ext)) docType = "excel";
    else if (ext === "pdf") docType = "pdf";
    else if (["doc", "docx"].includes(ext)) docType = "word";

    const finalName = trimmed.includes(".") ? trimmed : `${trimmed}.xlsx`;

    setGuideForm((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          name: finalName,
          size: "45.0 KB",
          type: docType
        }
      ]
    }));
    setNewDocName("");
  };

  // Upload tài liệu trực tiếp từ thiết bị (cho phép mọi định dạng hợp lệ)
  const handleUploadDocumentFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploadedDocs = files.map((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let docType = "other";
      if (["xlsx", "xls", "csv"].includes(ext)) docType = "excel";
      else if (ext === "pdf") docType = "pdf";
      else if (["doc", "docx"].includes(ext)) docType = "word";

      return {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: docType
      };
    });

    setGuideForm((prev) => ({
      ...prev,
      documents: [...prev.documents, ...uploadedDocs]
    }));
  };

  const handleRemoveDocument = (index) => {
    setGuideForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Phân quyền user
  const handleToggleUserModule = (userId, moduleId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        if (u.canManageAll) return u;
        const exists = u.assignedModules.includes(moduleId);
        const newModules = exists
          ? u.assignedModules.filter((m) => m !== moduleId)
          : [...u.assignedModules, moduleId];
        const updated = { ...u, assignedModules: newModules };
        if (currentUser.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      })
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f4f7f6]">
      {/* 1. Sidebar Phân Hệ HDSD (Module-level RBAC) */}
      <UserGuideSidebar
        currentUser={currentUser}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          // Nếu đổi sang End-user mà module đang chọn không có quyền thì nhảy về module đầu tiên có quyền
          if (user.isEndUser && !user.assignedModules.includes(selectedModuleId)) {
            handleSelectModule(user.assignedModules[0] || "sales");
          }
        }}
        selectedModuleId={selectedModuleId}
        onSelectModule={handleSelectModule}
        onOpenPermissionModal={() => setIsPermissionModalOpen(true)}
      />

      {/* 2. Cột Cây Tính Năng & Nhóm chức năng (Tầng 2 & 3) */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 shadow-xs">
        {/* Header Cột tính năng + Nút Thêm Nhóm Tính Năng Ngoài */}
        <div className="h-16 px-4 border-b border-gray-200 bg-gray-50/60 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Kiến Trúc Chức Năng
            </span>
            <h3 className="font-bold text-sm text-gray-900 truncate">
              {currentModule?.name || "Module"}
            </h3>
          </div>

          {/* Nút Admin thêm Danh mục (Nhóm tính năng) bên ngoài */}
          {hasEditPermission && (
            <button
              type="button"
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-emerald-100/70 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold transition-colors cursor-pointer border border-emerald-300/80"
              title="Thêm nhóm tính năng mới cho module này"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>+ Nhóm</span>
            </button>
          )}
        </div>

        {/* Bộ lọc trạng thái bài viết dành riêng cho Admin/Editor */}
        {!currentUser?.isEndUser && (
          <div className="px-3 pt-2.5 pb-1 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between text-[11px]">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Trạng thái:</span>
            <div className="inline-flex rounded-lg bg-gray-100 p-0.5 border border-gray-200">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === "all" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === "active" ? "bg-emerald-600 text-white shadow-2xs" : "text-gray-500 hover:text-emerald-800"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === "draft" ? "bg-amber-500 text-white shadow-2xs" : "text-gray-500 hover:text-amber-800"
                }`}
              >
                Nháp
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === "inactive" ? "bg-slate-500 text-white shadow-2xs" : "text-gray-500 hover:text-slate-800"
                }`}
              >
                Ẩn
              </button>
            </div>
          </div>
        )}

        {/* Danh sách Cây: Nhóm chức năng → Tính năng */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {moduleData.featureGroups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100/70 group/cat">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <FolderTree className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span className="uppercase tracking-wide text-[11px] text-gray-600 truncate">
                    {group.name}
                  </span>
                </div>

                {hasEditPermission && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover/cat:opacity-100 transition-opacity shrink-0">
                    {/* Nút Thêm tính năng con vào hạng mục */}
                    <button
                      type="button"
                      onClick={() => setAddFeatureModalTarget({ groupId: group.id, groupName: group.name })}
                      className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center space-x-0.5 cursor-pointer shadow-2xs"
                      title={`Thêm tính năng con vào hạng mục "${group.name}"`}
                    >
                      <Plus className="h-3 w-3" />
                      <span>Tính năng</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCategoryTarget({ id: group.id, name: group.name })}
                      className="p-1 rounded hover:bg-emerald-100 text-gray-400 hover:text-emerald-800 transition-colors cursor-pointer"
                      title="Chỉnh sửa tên danh mục"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteCategoryTarget({
                          id: group.id,
                          name: group.name,
                          featureCount: group.features.length
                        })
                      }
                      className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Xóa danh mục này"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pl-2 space-y-1">
                {group.features.map((feat) => {
                  const isSelected = selectedFeatureId === feat.id;
                  const visibleGuides = filterGuidesByRoleAndStatus(feat.guides);

                  // Tên hiển thị trên cây: Ưu tiên tên bài viết thực tế đã được tạo
                  const displayFeatureName =
                    (visibleGuides.length === 1 && visibleGuides[0]?.title && (!feat.name || feat.name.startsWith("Tính năng mới") || feat.name === group.name))
                      ? visibleGuides[0].title
                      : (!feat.name || feat.name.startsWith("Tính năng mới"))
                      ? (visibleGuides[0]?.title || feat.name)
                      : feat.name;

                  return (
                    <div key={feat.id} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFeatureId(feat.id);
                          if (visibleGuides && visibleGuides[0]) {
                            const hasGuide = visibleGuides.some((g) => g.id === selectedGuideId);
                            if (!hasGuide) {
                              setSelectedGuideId(visibleGuides[0].id);
                            }
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shadow-2xs"
                            : "text-gray-700 hover:bg-gray-100/80 font-medium"
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <FileText
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isSelected ? "text-emerald-700" : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                          <span className="truncate">{displayFeatureName}</span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <span
                            title={`Tính năng này có ${visibleGuides.length} bài viết HDSD`}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                              isSelected
                                ? "bg-emerald-200/80 text-emerald-950"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {visibleGuides.length} bài
                          </span>
                          {hasEditPermission && (
                            <div className="hidden group-hover:flex items-center space-x-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditFeatureTarget({ groupId: group.id, featId: feat.id, name: feat.name });
                                }}
                                className="p-0.5 rounded hover:bg-emerald-200 text-gray-400 hover:text-emerald-900 cursor-pointer"
                                title="Đổi tên tính năng này"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteFeatureTarget({
                                    groupId: group.id,
                                    featId: feat.id,
                                    name: feat.name,
                                    guideCount: feat.guides?.length || 0
                                  });
                                }}
                                className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 cursor-pointer"
                                title="Xóa tính năng này"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Khi tính năng đang chọn có từ 2 bài trở lên, mở rộng hiển thị các bài con trong cây */}
                      {isSelected && visibleGuides.length > 1 && (
                        <div className="ml-3 pl-3 py-1 space-y-1 border-l-2 border-emerald-300">
                          {visibleGuides.map((guide, gIdx) => {
                            const isGuideActive = selectedGuideId === guide.id;
                            return (
                              <button
                                key={guide.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGuideId(guide.id);
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                                  isGuideActive
                                    ? "bg-[#005a46] text-white font-bold shadow-2xs"
                                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium"
                                }`}
                              >
                                <div className="flex items-center space-x-1 min-w-0">
                                  <span className="opacity-60 text-[10px] shrink-0">{gIdx + 1}.</span>
                                  <span className="truncate">{guide.title}</span>
                                </div>
                                <span
                                  className={`text-[9px] px-1 py-0.2 rounded font-bold shrink-0 ml-1 uppercase ${
                                    isGuideActive
                                      ? "bg-white/20 text-white"
                                      : guide.status === "active"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : guide.status === "draft"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {guide.status === "active" ? "Active" : guide.status === "draft" ? "Nháp" : "Ẩn"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Nút Tạo bài HDSD mới (Dành cho Admin / Editor) */}
        <div className="p-3 border-t border-gray-200 bg-gray-50/50">
          {hasEditPermission ? (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs bg-[#005a46] hover:bg-[#004737] text-white cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo HDSD Cho Tính Năng</span>
            </button>
          ) : (
            <div className="text-center py-1">
              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-gray-400">
                <Eye className="h-3.5 w-3.5" />
                <span>Chế độ xem: Chỉ hiển thị bài Active</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Khung Nội Dung Chi Tiết HDSD (Tầng 4 - SOP) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* THANH TÌM KIẾM TOÀN CỤC + Cụm User (Đã bỏ breadcrumb để giao diện thông thoáng) */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-2xs gap-4">
          <div className="flex items-center space-x-2 shrink-0">
            <BookOpen className="h-4 w-4 text-emerald-700" />
            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
              HDSD Tác Nghiệp Hệ Thống
            </span>
          </div>

          {/* KHUNG TÌM KIẾM TOÀN CỤC XUYÊN MODULE (GLOBAL SEARCH BAR) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="h-4 w-4 absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Tìm kiếm trên tất cả module... (Ctrl + K)"
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-gray-100 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-emerald-600 rounded-lg transition-all focus:outline-hidden text-gray-800 placeholder-gray-400 font-medium"
              />
              {globalSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Kết quả tìm kiếm toàn cục */}
            {isSearchOpen && globalSearchQuery.trim() && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 flex flex-col animate-in fade-in-50 zoom-in-98 duration-100">
                <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span>Kết quả tìm kiếm ({globalSearchResults.length} bài)</span>
                  <span className="text-[10px] text-gray-400">Áp dụng tất cả module</span>
                </div>

                <div className="overflow-y-auto p-1.5 divide-y divide-gray-50">
                  {globalSearchResults.length > 0 ? (
                    globalSearchResults.map((res) => (
                      <button
                        key={`${res.moduleId}_${res.guideId}`}
                        type="button"
                        onClick={() => handleSelectSearchResult(res)}
                        className="w-full text-left p-2.5 hover:bg-emerald-50/70 rounded-lg transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {res.moduleName}
                          </span>
                          <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-900 truncate">
                            {res.title}
                          </span>

                          {/* Badge trạng thái trong search */}
                          {res.status === "draft" && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                              Nháp
                            </span>
                          )}
                          {res.status === "inactive" && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold border border-slate-300">
                              Ẩn
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-1">
                          <CornerDownRight className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{res.groupName} &gt; {res.featureName}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-gray-400">
                      Không tìm thấy bài viết nào khớp với từ khóa "{globalSearchQuery}".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cụm User và Thông báo */}
          <div className="flex items-center space-x-3 shrink-0">
            <button className="text-gray-400 hover:text-gray-500 relative cursor-pointer p-1">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center pl-2 border-l border-gray-200">
              <div className="h-8 w-8 rounded-full bg-[#005a46] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {currentUser?.avatar || "US"}
              </div>
              <div className="ml-2 hidden sm:flex flex-col justify-center">
                <span className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold leading-tight">
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết bài SOP + THANH TÁC VỤ CRUD ADMIN */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {currentGuide ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
              {/* THANH CÔNG CỤ QUẢN TRỊ ADMIN (CRUD & Trạng thái Active/Inactive) */}
              {hasEditPermission && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-700">Trạng thái:</span>
                    {currentGuide.status === "active" && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                        <span>Active</span>
                      </span>
                    )}
                    {currentGuide.status === "draft" && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                        <span>Nháp</span>
                      </span>
                    )}
                    {currentGuide.status === "inactive" && (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300">
                        <EyeOff className="h-3 w-3 text-slate-500" />
                        <span>Tạm ẩn</span>
                      </span>
                    )}
                  </div>

                  {/* Nút thao tác Admin: Đổi trạng thái, Sửa, Xóa */}
                  <div className="flex items-center space-x-2">
                    {/* Toggle Active / Inactive */}
                    <button
                      type="button"
                      onClick={() => handleToggleGuideStatus(currentGuide)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-2xs cursor-pointer ${
                        currentGuide.status === "active"
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                      title="Chuyển đổi trạng thái hiển thị cho End-user"
                    >
                      {currentGuide.status === "active" ? (
                        <>
                          <ToggleRight className="h-4 w-4 text-emerald-700" />
                          <span>Tạm ngưng</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4" />
                          <span>Kích hoạt</span>
                        </>
                      )}
                    </button>

                    {/* Sửa bài viết */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(currentGuide)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Sửa bài</span>
                    </button>

                    {/* Xóa bài viết */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmGuide(currentGuide)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 transition-colors cursor-pointer"
                      title="Xóa vĩnh viễn bài hướng dẫn này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CHUYỂN ĐỔI BÀI VIẾT KHI TÍNH NĂNG CÓ NHIỀU HƯỚNG DẪN */}
              {currentFeature?.visibleGuides && currentFeature.visibleGuides.length > 1 && (
                <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
                      <Layers className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Các bài hướng dẫn thuộc tính năng này ({currentFeature.visibleGuides.length} bài):</span>
                    </div>
                    {hasEditPermission && (
                      <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="text-[11px] text-emerald-700 hover:underline font-bold flex items-center cursor-pointer"
                        title="Thêm bài hướng dẫn xử lý lỗi hoặc case thay thế"
                      >
                        <Plus className="h-3 w-3 mr-0.5" /> Thêm bài cho tính năng này
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentFeature.visibleGuides.map((g, idx) => {
                      const isTabActive = g.id === selectedGuideId;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGuideId(g.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                            isTabActive
                              ? "bg-[#005a46] text-white shadow-xs font-bold"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/60"
                          }`}
                        >
                          <FileText
                            className={`h-3.5 w-3.5 ${isTabActive ? "text-emerald-200" : "text-gray-400"}`}
                          />
                          <span className="max-w-[260px] truncate">
                            Bài {idx + 1}: {g.title}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              isTabActive
                                ? "bg-white/20 text-white"
                                : g.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : g.status === "draft"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {g.status === "active" ? "Active" : g.status === "draft" ? "Nháp" : "Ẩn"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1. Header Bài viết & Màn hình áp dụng */}
              <div className="border-b border-gray-100 pb-5">
                <div>
                  {/* Đường dẫn phân cấp gọn gàng */}
                  <div className="text-[11px] font-medium text-gray-400 mb-1.5 flex items-center space-x-1.5">
                    <span className="text-emerald-700 font-semibold">{currentModule?.name}</span>
                    <span>/</span>
                    <span className="text-gray-600 font-medium">
                      {currentFeature?.name && !currentFeature.name.startsWith("Tính năng mới")
                        ? currentFeature.name
                        : currentGuide.title}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      {currentGuide.title}
                    </h2>
                    <span className="text-xs text-gray-500 font-medium">
                      Người tạo: <strong className="text-gray-800">{currentGuide.author || "Administrator"}</strong>
                    </span>
                  </div>
                </div>

                {/* Màn hình áp dụng & Deep Link */}
                {currentGuide.applicableScreen && (
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center">
                      <Link2 className="h-3.5 w-3.5 mr-1.5 text-emerald-700" />
                      Màn hình áp dụng:
                    </span>
                    <span className="text-emerald-950 font-medium">{currentGuide.applicableScreen}</span>
                    {currentGuide.applicablePath && (
                      <Link
                        href={currentGuide.applicablePath}
                        className="ml-auto inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#005a46] hover:bg-[#004737] text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        <span>Mở màn hình này</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Mô tả tóm tắt */}
                {currentGuide.description && (
                  <p className="text-xs text-gray-700 mt-3 italic leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    "{currentGuide.description}"
                  </p>
                )}
              </div>

              {/* 2. Video Hướng Dẫn & Các Mốc Giai Đoạn (Interactive Timestamps) */}
              {(currentGuide.videoUrl || (currentGuide.milestones && currentGuide.milestones.length > 0)) && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 text-white shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Video Thao Tác & Các Mốc Giai Đoạn
                      </h4>
                    </div>
                    {currentGuide.videoUrl && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center">
                        <Play className="h-3 w-3 mr-1 text-amber-400" /> Micro-Learning
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
                    {/* Video Player */}
                    {currentGuide.videoUrl ? (
                      <div className="lg:col-span-7 bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                        <video
                          controls
                          className="w-full max-h-56 object-cover rounded-lg"
                          src={currentGuide.videoUrl}
                        >
                          Trình duyệt không hỗ trợ thẻ video.
                        </video>
                      </div>
                    ) : (
                      <div className="lg:col-span-7 bg-slate-800/60 rounded-lg p-6 flex flex-col items-center justify-center text-center text-xs text-slate-400">
                        <Video className="h-8 w-8 mb-2 text-slate-600" />
                        <span>Chưa đính kèm video clip thao tác.</span>
                      </div>
                    )}

                    {/* Danh sách Các mốc giai đoạn (Milestones / Timestamps) */}
                    <div className="lg:col-span-5 flex flex-col space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        Các mốc thời gian hành động:
                      </span>
                      <div className="space-y-1.5 overflow-y-auto max-h-52 pr-1">
                        {currentGuide.milestones && currentGuide.milestones.length > 0 ? (
                          currentGuide.milestones.map((m, idx) => {
                            const isActive = activeMilestoneIndex === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveMilestoneIndex(idx)}
                                className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start space-x-2 border cursor-pointer ${
                                  isActive
                                    ? "bg-emerald-600/30 border-emerald-400 text-white font-semibold"
                                    : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                                }`}
                              >
                                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 font-bold shrink-0">
                                  {m.time}
                                </span>
                                <div className="min-w-0">
                                  <p className="leading-snug truncate">{m.title}</p>
                                  {m.action && (
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-1">
                                      {m.action}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-xs text-slate-500 italic">Không có mốc thời gian.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Tài Liệu Đính Kèm */}
              {currentGuide.documents && currentGuide.documents.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                    <FileDown className="h-4 w-4 text-emerald-700 mr-2" />
                    Tài liệu & Biểu mẫu đính kèm
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentGuide.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50/60 hover:bg-emerald-50/40 hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {doc.type === "excel" ? (
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <FileSpreadsheet className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{doc.name}</p>
                            <span className="text-[10px] text-gray-500 font-mono">{doc.size}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => alert(`Tải xuống tệp: ${doc.name}`)}
                          className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer shrink-0 ml-2"
                          title="Tải xuống tệp tin"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Điều kiện tiên quyết */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mr-2" />
                  Điều kiện tiên quyết (Prerequisites)
                </h4>
                <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/70 space-y-1.5">
                  {currentGuide.prerequisites && currentGuide.prerequisites.length > 0 ? (
                    currentGuide.prerequisites.map((req, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{req}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">Không có điều kiện đặc biệt.</p>
                  )}
                </div>
              </div>

              {/* 5. Quy trình các bước thực hiện */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mr-2" />
                  Quy trình các bước thực hiện
                </h4>
                <div className="space-y-2.5">
                  {currentGuide.steps &&
                    currentGuide.steps.map((s) => (
                      <div
                        key={s.stepNum}
                        className="flex items-start space-x-3 p-3.5 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {s.stepNum}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900">{s.title}</p>
                          <p className="text-xs text-gray-700 mt-1 leading-relaxed">{s.action}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 6. Kết quả mong đợi */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mr-2" />
                  Kết quả mong đợi
                </h4>
                <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
                  ✓ {currentGuide.expectedResult}
                </div>
              </div>

              {/* 7. Lưu ý quan trọng */}
              {currentGuide.importantNotes && currentGuide.importantNotes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                    Lưu ý quan trọng
                  </h4>
                  <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                    {currentGuide.importantNotes.map((note, idx) => (
                      <p key={idx} className="leading-relaxed">
                        • {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Lỗi thường gặp & Cách xử lý */}
              {currentGuide.commonErrors && currentGuide.commonErrors.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center">
                    <HelpCircle className="h-3.5 w-3.5 text-red-600 mr-1.5" />
                    Lỗi thường gặp & Cách xử lý
                  </h4>
                  <div className="space-y-2">
                    {currentGuide.commonErrors.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-red-50/50 border border-red-200/70 text-xs space-y-1"
                      >
                        <p className="font-bold text-red-900">⚠️ {err.error}</p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Nguyên nhân:</span> {err.cause}
                        </p>
                        <p className="text-emerald-900">
                          <span className="font-semibold text-emerald-800">Khắc phục:</span>{" "}
                          {err.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. Nội dung liên quan */}
              {currentGuide.relatedGuides && currentGuide.relatedGuides.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Nội dung liên quan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentGuide.relatedGuides.map((rel, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (rel.module) handleSelectModule(rel.module);
                          if (rel.linkFeatId) setSelectedFeatureId(rel.linkFeatId);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-100 text-xs font-medium text-gray-800 hover:text-emerald-900 transition-colors border border-gray-200 cursor-pointer"
                      >
                        <ExternalLink className="h-3 w-3 text-emerald-700" />
                        <span>{rel.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-xl border border-gray-200 shadow-xs">
              <BookOpen className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <h3 className="font-bold text-base text-gray-800">Chưa có bài viết HDSD</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                {currentUser?.isEndUser
                  ? "Chưa có tài liệu SOP nào ở trạng thái Active cho tính năng này."
                  : "Tính năng này chưa được cập nhật tài liệu SOP hướng dẫn."}
              </p>
              {hasEditPermission && (
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center space-x-1.5 py-2 px-3 rounded-lg bg-[#005a46] text-white text-xs font-bold hover:bg-[#004737] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Soạn thảo bài HDSD đầu tiên</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: TẠO MỚI / CHỈNH SỬA BÀI VIẾT HDSD (11 TRƯỜNG + QUYỀN LƯU NHÁP / ACTIVE) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
                  <Edit3 className="h-4 w-4 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {modalMode === "edit" ? "Chỉnh Sửa Bài Viết Hướng Dẫn" : "Tạo Bài Viết Hướng Dẫn Mới"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body Form 11 trường */}
            <form
              onSubmit={(e) => handleSaveGuideSubmit(e, "active")}
              className="flex-1 overflow-y-auto p-5 space-y-5 text-xs"
            >
              {/* 1. Tên bài hướng dẫn */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  1. Tên bài hướng dẫn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tạo đơn bán mới, Lập phiếu giao hàng DO..."
                  value={guideForm.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGuideForm((prev) => ({
                      ...prev,
                      title: val,
                      featureName: (!prev.featureName || prev.featureName.startsWith("Tính năng mới")) ? val : prev.featureName,
                      applicableScreen: (!prev.applicableScreen || prev.applicableScreen.includes("Tính năng mới") || prev.applicableScreen.includes("Hạng mục"))
                        ? `${currentModule?.name} > ${val}`
                        : prev.applicableScreen
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-900"
                />
              </div>

              {/* 2 & 3. Module & Danh mục (Nhóm tính năng) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    2. Module (Mặc định module đang mở)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentModule?.name || "Bán Hàng"} (${currentModule?.code || "MOD_SALES"})`}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800">
                      3. Danh mục (Nhóm tính năng) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setGuideForm((prev) => ({ ...prev, isCustomCategory: !prev.isCustomCategory }))
                      }
                      className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      {guideForm.isCustomCategory ? "← Chọn từ danh sách" : "+ Nhập nhóm mới"}
                    </button>
                  </div>
                  {guideForm.isCustomCategory ? (
                    <input
                      type="text"
                      placeholder="Gõ tên nhóm tính năng mới..."
                      value={guideForm.category}
                      onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-emerald-400 rounded-lg focus:outline-hidden focus:border-emerald-600"
                    />
                  ) : (
                    <select
                      value={guideForm.category}
                      onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium cursor-pointer"
                    >
                      <option value="">-- Chọn nhóm tính năng --</option>
                      {moduleData.featureGroups.map((g) => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* 4 & 5. Tính năng & Màn hình áp dụng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    4. Tính năng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tạo đơn hàng (SO), Lập phiếu DO..."
                    value={guideForm.featureName || ""}
                    onChange={(e) => {
                      const newFeat = e.target.value;
                      setGuideForm((prev) => ({
                        ...prev,
                        featureName: newFeat,
                        applicableScreen:
                          prev.applicableScreen.includes(">")
                            ? `${currentModule?.name} > ${newFeat}`
                            : prev.applicableScreen || `${currentModule?.name} > ${newFeat}`
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    5. Màn hình áp dụng (URL / Route)
                  </label>
                  <input
                    type="text"
                    placeholder={`Ví dụ: ${currentModule?.name} > ${guideForm.featureName || "Hạng mục"} (/)`}
                    value={guideForm.applicableScreen}
                    onChange={(e) => setGuideForm({ ...guideForm, applicableScreen: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* 6. Mô tả */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  6. Mô tả quy trình / Mục đích
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt mục đích, phạm vi và đối tượng áp dụng của hướng dẫn này..."
                  value={guideForm.description}
                  onChange={(e) => setGuideForm({ ...guideForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* 7 & 8. Video đính kèm & Tài liệu đính kèm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                {/* 7. Video đính kèm */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800 flex items-center">
                      <Video className="h-3.5 w-3.5 mr-1 text-emerald-700" />
                      7. Video đính kèm
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer flex items-center"
                        title="Chọn file video từ máy tính"
                      >
                        <Upload className="h-3 w-3 mr-0.5" />
                        Tải từ thiết bị
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() =>
                          setGuideForm((prev) => ({
                            ...prev,
                            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                            videoFileName: ""
                          }))
                        }
                        className="text-[11px] text-gray-500 hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        Video mẫu
                      </button>
                    </div>
                  </div>

                  {/* Input ẩn cho file video */}
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    className="hidden"
                    onChange={handleUploadVideoFile}
                  />

                  <input
                    type="text"
                    placeholder="URL video (MP4, YouTube, Loom) hoặc bấm 'Tải từ thiết bị'..."
                    value={guideForm.videoFileName ? `[Tệp thiết bị] ${guideForm.videoFileName}` : guideForm.videoUrl}
                    onChange={(e) =>
                      setGuideForm({ ...guideForm, videoUrl: e.target.value, videoFileName: "" })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-hidden focus:border-emerald-600 text-xs font-medium"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Hỗ trợ chọn file video từ máy tính hoặc dán link clip hướng dẫn.
                  </p>
                </div>

                {/* 8. Tài liệu đính kèm */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800 flex items-center">
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-emerald-700" />
                      8. Tài liệu đính kèm
                    </label>
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer flex items-center"
                      title="Chọn file từ máy tính"
                    >
                      <Upload className="h-3 w-3 mr-0.5" />
                      Tải từ thiết bị
                    </button>
                  </div>

                  {/* Input ẩn cho file tài liệu */}
                  <input
                    type="file"
                    ref={docInputRef}
                    multiple
                    accept=".xlsx,.xls,.csv,.pdf,.doc,.docx,.pptx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleUploadDocumentFiles}
                  />

                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      placeholder="Nhập tên tài liệu (hoặc bấm 'Tải từ thiết bị')..."
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDocument();
                        }
                      }}
                      className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-3.5 py-1.5 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      + Thêm file
                    </button>
                  </div>

                  <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                    {guideForm.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 text-[11px]"
                      >
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <FileText className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate max-w-[220px] font-medium text-gray-800">
                            {doc.name}
                          </span>
                          {doc.size && (
                            <span className="text-[10px] text-gray-400 shrink-0">
                              ({doc.size})
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(idx)}
                          className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer ml-1"
                          title="Xóa tài liệu này"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 9. Các mốc giai đoạn (Milestones & Timestamps) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="font-bold text-gray-900 block">
                      9. Các mốc giai đoạn & Thời gian hành động
                    </label>
                    <span className="text-[10px] text-gray-500">
                      Khoảng thời gian tương ứng với hành động (cho phép thêm nhiều mốc)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Thêm mốc</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {guideForm.milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200">
                      <input
                        type="text"
                        placeholder="00:15"
                        value={m.time}
                        onChange={(e) => handleUpdateMilestone(idx, "time", e.target.value)}
                        className="w-20 px-2 py-1.5 border border-gray-300 rounded font-mono text-center font-bold text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Hành động tương ứng tại mốc này..."
                        value={m.title}
                        onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                        title="Xóa mốc này"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10 & 11. Lưu ý quan trọng & Lỗi thường gặp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-amber-900 mb-1">
                    10. Lưu ý quan trọng
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Các điểm kiểm soát rủi ro, trường bắt buộc..."
                    value={guideForm.importantNotes}
                    onChange={(e) => setGuideForm({ ...guideForm, importantNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-hidden focus:border-amber-600 bg-amber-50/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-900 mb-1">
                    11. Lỗi thường gặp & Cách khắc phục
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Dấu hiệu lỗi: Nguyên nhân và cách tự xử lý..."
                    value={guideForm.commonErrors}
                    onChange={(e) => setGuideForm({ ...guideForm, commonErrors: e.target.value })}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-hidden focus:border-red-600 bg-red-50/20"
                  />
                </div>
              </div>

              {/* Nút bấm Submit: Lưu Nháp hoặc Xuất bản Active */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => handleSaveGuideSubmit(e, "draft")}
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg shadow-2xs cursor-pointer"
                  >
                    Lưu bản nháp (Draft)
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveGuideSubmit(e, "active")}
                    className="px-5 py-2 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg shadow-xs cursor-pointer"
                  >
                    {modalMode === "edit" ? "Cập nhật & Xuất bản (Active)" : "Xuất bản ngay (Active)"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM NHÓM TÍNH NĂNG MỚI (TẠO DANH MỤC Ở NGOÀI) */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <FolderPlus className="h-5 w-5 text-emerald-700" />
                <h3 className="font-bold text-base text-gray-900">Thêm Danh Mục (Nhóm Tính Năng)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategoryOutside} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên nhóm tính năng mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Quản lý công nợ, Báo cáo doanh số..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Gắn trực tiếp vào phân hệ: <strong>{currentModule?.name}</strong>
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Tạo nhóm ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA BÀI VIẾT */}
      {deleteConfirmGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Xác nhận xóa bài viết?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có chắc chắn muốn xóa bài hướng dẫn:
              </p>
              <p className="text-xs font-bold text-red-700 mt-1">
                "{deleteConfirmGuide.title}"
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmGuide(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHỈNH SỬA TÊN DANH MỤC */}
      {editCategoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-emerald-700" />
                <h3 className="font-bold text-base text-gray-900">Đổi Tên Danh Mục (Nhóm Tính Năng)</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditCategoryTarget(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCategoryTarget.name}
                  onChange={(e) =>
                    setEditCategoryTarget({ ...editCategoryTarget, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCategoryTarget(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA DANH MỤC */}
      {deleteCategoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Xác nhận xóa danh mục?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có chắc chắn muốn xóa danh mục:
              </p>
              <p className="text-xs font-bold text-red-700 mt-1">
                "{deleteCategoryTarget.name}"
              </p>
              {deleteCategoryTarget.featureCount > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200 text-left">
                  ⚠️ Danh mục này đang chứa {deleteCategoryTarget.featureCount} tính năng. Các tính năng và bài viết bên trong cũng sẽ bị xóa.
                </p>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCategoryTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: THÊM TÍNH NĂNG CON VÀO HẠNG MỤC */}
      {addFeatureModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-emerald-700" />
                <div>
                  <h3 className="font-bold text-base text-gray-900">Thêm Tính Năng Con Mới</h3>
                  <p className="text-[11px] text-gray-500">
                    Thuộc hạng mục: <strong className="text-emerald-800">{addFeatureModalTarget.groupName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddFeatureModalTarget(null);
                  setNewFeatureInputName("");
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFeatureSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên tính năng con mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ví dụ: Đổi trả hàng, Báo cáo doanh số theo kênh, Quản lý ký gửi..."
                  value={newFeatureInputName}
                  onChange={(e) => setNewFeatureInputName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-900"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Mỗi tính năng con có thể chứa 1 hoặc nhiều bài viết HDSD (Quy trình chuẩn, Xử lý lỗi, Ngoại lệ...).
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddFeatureModalTarget(null);
                    setNewFeatureInputName("");
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Tạo tính năng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHỈNH SỬA TÊN TÍNH NĂNG CON */}
      {editFeatureTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-emerald-700" />
                <h3 className="font-bold text-base text-gray-900">Đổi Tên Tính Năng Con</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditFeatureTarget(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFeature} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Tên tính năng con <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFeatureTarget.name}
                  onChange={(e) =>
                    setEditFeatureTarget({ ...editFeatureTarget, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditFeatureTarget(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA TÍNH NĂNG CON */}
      {deleteFeatureTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Xác nhận xóa tính năng?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có chắc chắn muốn xóa tính năng con:
              </p>
              <p className="text-xs font-bold text-red-700 mt-1">
                "{deleteFeatureTarget.name}"
              </p>
              {deleteFeatureTarget.guideCount > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200 text-left">
                  ⚠️ Tính năng này đang có {deleteFeatureTarget.guideCount} bài viết HDSD. Các bài viết bên trong cũng sẽ bị xóa.
                </p>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteFeatureTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFeature}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CẤU HÌNH & PHÂN QUYỀN MODULE CHO USER */}
      {isPermissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base">Cấu Hình & Phân Quyền Module</h3>
                  <p className="text-xs text-emerald-200">
                    Phân quyền User phụ trách từng Module để tạo và quản lý HDSD
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPermissionModalOpen(false)}
                className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Nguyên tắc phân quyền:</strong> Danh mục Module được cấu hình tập trung từ hệ thống. User chỉ nhìn thấy và được phép tạo/sửa HDSD đối với các Module đã được cấp quyền dưới đây.
                </p>
              </div>

              <div className="space-y-4">
                {usersList.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </div>

                      {user.canManageAll ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                          Toàn quyền (All Modules)
                        </span>
                      ) : user.isEndUser ? (
                        <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-800 font-bold text-[11px] border border-gray-300">
                          End-User (Chỉ xem)
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-800">
                          Đã cấp: {user.assignedModules.length}/{ALL_MODULES.length} Module
                        </span>
                      )}
                    </div>

                    {!user.canManageAll && !user.isEndUser && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 border-t border-gray-200">
                        {ALL_MODULES.map((mod) => {
                          const isChecked = user.assignedModules.includes(mod.id);
                          return (
                            <label
                              key={mod.id}
                              className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                                isChecked
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleUserModule(user.id, mod.id)}
                                className="rounded text-emerald-700 focus:ring-emerald-600"
                              />
                              <span className="truncate text-[11px]">{mod.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPermissionModalOpen(false)}
                className="px-5 py-2 bg-[#005a46] hover:bg-[#004737] text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
