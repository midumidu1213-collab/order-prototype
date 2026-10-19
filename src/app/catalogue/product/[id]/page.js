"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  CheckCircle2,
  Circle,
  Crown,
  Layers,
  Settings2,
  Trash2,
  Maximize2,
  X,
  Clock
} from "lucide-react";
import { JEWELRY_PRODUCTS } from "@/data/catalogueData";
import { CHANGE_TYPES_CONFIG, EC_ALLOWED_CHANGE_REQUESTS, ATTRIBUTE_CHANGE_CONFIGS } from "@/data/productVersionConfigData";
import { useCatalogueCart } from "@/context/CatalogueCartContext";
import JewelryVisual from "@/components/catalogue/JewelryVisual";

// =============================================================================
// PRICING VARIATION RULES (BIẾN THIÊN GIÁ THEO TÙY BIẾN)
// =============================================================================
export const GOLD_COLOR_DELTAS = {
  "Vàng": 0,
  "Trắng": 50000,
  "Hồng": 50000,
  "Vàng hồng": 50000,
  "Vàng 2 màu": 120000
};

export const STONE_COLOR_DELTAS = {
  "Trắng": 0,
  "Xám": 0,
  "Trắng / Đỏ": 0,
  "Xanh Emerald": 30000,
  "Đỏ": 30000,
  "Đỏ Ruby": 30000,
  "Tím Sapphire": 30000,
  "Tím": 30000,
  "Kim Cương Trắng": 450000,
  "Kim Cương Moissanite": 450000
};

// Size Ni deltas (Ni ngoại cỡ > 56 có thêm vàng và công nới)
export const getSizeDelta = (size) => {
  const s = parseInt(size);
  if (s >= 60) return 150000;
  if (s >= 58) return 80000;
  return 0;
};

// Quy tắc làm tròn giá công lên 5,000đ
export const roundUp5k = (val) => {
  const num = Number(val) || 0;
  return Math.ceil(num / 5000) * 5000;
};

// Cấu hình danh mục chi tiết tương ứng với từng Yêu cầu thay đổi
export const CHANGE_REQUEST_CONFIGS = {
  "Không thay đổi": null,
  "Thay kiểu bào ball": {
    subLabel: "Kiểu bào",
    options: ["Cross 45", "Cross 90", "Star 6", "Star 8", "Micro Pave", "Bào hạt lựu"]
  },
  "Đổi sang đá tấm CZ loại 1": {
    subLabel: "Loại đá tấm",
    options: ["CZ Trắng Star Cut", "CZ Swarovski Heart & Arrow", "CZ Đỏ Ruby", "CZ Xanh Emerald"]
  },
  "Đổi tuổi vàng 10K lên 18K": {
    subLabel: "Tuổi vàng chuyển đổi",
    options: ["Vàng 18K (75Y)", "Vàng 14K (58.5Y)", "Vàng 24K (99.9Y)"]
  },
  "Khắc laser chữ/ký hiệu riêng": {
    subLabel: "Kiểu chữ khắc laser",
    options: ["Font In hoa hiện đại (Elegance)", "Font Chữ ký nghệ thuật (Signature)", "Khắc Ngày & Tên lồng trái tim"]
  }
};

// Cấu hình các tùy chọn cho Yêu cầu thay đổi E-Catalogue chuẩn (Chỉ hiển thị các thuộc tính có cờ Hiển thị E_C + Khác)
export const EC_CHANGE_REQUEST_OPTIONS = {
  "Không thay đổi": [],
  "Khóa (khóa càng cua/mỏ vịt)": [
    "Khóa càng cua",
    "Khóa mỏ vịt",
    "Khóa tròn lò xo",
    "Khóa hộp bấm"
  ],
  "Tăng đơ (đổi/bỏ)": [
    "Đổi loại tăng đơ chữ nhật",
    "Đổi loại tăng đơ hình tim",
    "Bỏ tăng đơ"
  ],
  "Kiểu bào ball": [
    "CR - Cross 45",
    "CS - Chữ S",
    "MO - Moon",
    "SL45 - Slash 45",
    "TR - Trơn"
  ],
  "Thay kích thước dây HTJ (Tăng/giảm size)": [
    "Tăng size (+0.2mm)",
    "Giảm size (-0.2mm)",
    "Dây HTJ 1.2mm",
    "Dây HTJ 1.5mm"
  ],
  "Khác": []
};

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.id;

  // Find product or fallback to first product
  const product = JEWELRY_PRODUCTS.find((p) => p.id === productId) || JEWELRY_PRODUCTS[0];

  const { addToCart, addBatchToCart } = useCatalogueCart();

  // State cho 3 thuộc tính cơ bản
  const [goldColor, setGoldColor] = useState(product.defaultOptions?.goldColor || "Vàng");
  const [mainStoneColor, setMainStoneColor] = useState(product.defaultOptions?.mainStoneColor || "Trắng");
  const [selectedSize, setSelectedSize] = useState(product.defaultOptions?.niSize || "15");

  // =========================================================================
  // ĐỒNG BỘ CẤU HÌNH LOẠI THAY ĐỔI TỪ QUẢN LÝ SẢN PHẨM (QLSP)
  // =========================================================================
  const [changeTypesList, setChangeTypesList] = useState(CHANGE_TYPES_CONFIG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("SEVAGO_CHANGE_TYPES_CONFIG");
      if (saved) {
        setChangeTypesList(JSON.parse(saved));
      }
    } catch (e) {}

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("SEVAGO_CHANGE_TYPES_CONFIG");
        if (saved) setChangeTypesList(JSON.parse(saved));
      } catch (e) {}
    };

    window.addEventListener("changeTypesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("changeTypesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // State Yêu cầu thay đổi E-Catalogue chuẩn: (dropdown) -> dropdown
  const [ecChangeCategory, setEcChangeCategory] = useState("Không thay đổi");
  const [ecChangeDetail, setEcChangeDetail] = useState("");
  const [formError, setFormError] = useState("");

  // Yêu cầu thay đổi khác: tick chọn -> hiện trường nhập mô tả thay đổi (thay thế trường ghi chú hiện tại)
  const [hasOtherChange, setHasOtherChange] = useState(false);
  const [otherChangeDescription, setOtherChangeDescription] = useState("");

  // Tìm đối tượng cấu hình QLSP của loại thay đổi đang chọn
  const currentChangeTypeConfig = useMemo(() => {
    if (ecChangeCategory === "Không thay đổi" || ecChangeCategory === "Khác") {
      return null;
    }
    return changeTypesList.find((ct) => {
      const cat = ecChangeCategory.toLowerCase();
      const name = ct.name.toLowerCase();
      const code = ct.code.toLowerCase();
      return (
        cat === name ||
        cat === code ||
        cat.includes(name) ||
        name.includes(cat) ||
        (cat.includes("khóa") && code === "D") ||
        (cat.includes("tăng đơ") && code === "T") ||
        (cat.includes("bào ball") && code === "I") ||
        (cat.includes("htj") && code === "G") ||
        (cat.includes("lacquer") && code === "C") ||
        (cat.includes("cast") && code === "B")
      );
    });
  }, [ecChangeCategory, changeTypesList]);

  // Xác định chế độ hiển thị của nút Checkbox "Yêu cầu thay đổi khác":
  // 1. "is_other": Nếu chọn Yêu cầu thay đổi = Khác -> Hiển thị trực tiếp ô nhập mô tả (ẩn checkbox)
  // 2. "hidden": Nếu cấu hình = không được phép thay đổi -> Ẩn nút checkbox
  // 3. "optional": Nếu cấu hình = được phép thay đổi -> Hiển thị nút checkbox (không bắt buộc)
  // 4. "required": Nếu cấu hình = bắt buộc thay đổi -> Hiển thị nút checkbox (bắt buộc)
  const otherChangeMode = useMemo(() => {
    if (ecChangeCategory === "Khác") {
      return "is_other";
    }
    if (ecChangeCategory === "Không thay đổi") {
      return "optional";
    }
    const cfg = currentChangeTypeConfig?.otherChangeConfig || "optional";
    if (cfg === "not_allowed") return "hidden";
    if (cfg === "required") return "required";
    return "optional";
  }, [ecChangeCategory, currentChangeTypeConfig]);

  // Phản ứng tự động đồng bộ trạng thái hasOtherChange theo otherChangeMode
  useEffect(() => {
    if (otherChangeMode === "hidden") {
      setHasOtherChange(false);
      setOtherChangeDescription("");
    } else if (otherChangeMode === "required" || otherChangeMode === "is_other") {
      setHasOtherChange(true);
    }
  }, [otherChangeMode]);

  // Nghiệp vụ theo yêu cầu của Chị đẹp:
  // - Nếu chọn Loại thay đổi là "Khác" HOẶC (có checkbox thay đổi khác và có nhập mô tả)
  // -> Giá công: "Tính giá sau"
  // -> Khi tạo đơn tự động tách đơn đặc biệt ở trạng thái Chờ xử lý
  const isCustomOrOther = useMemo(() => {
    return ecChangeCategory === "Khác" || (hasOtherChange && otherChangeDescription.trim().length > 0);
  }, [ecChangeCategory, hasOtherChange, otherChangeDescription]);

  const handleSelectEcChangeCategory = (cat) => {
    setEcChangeCategory(cat);
    setFormError("");
    const subOpts = EC_CHANGE_REQUEST_OPTIONS[cat];
    if (subOpts && subOpts.length > 0) {
      setEcChangeDetail(subOpts[0]);
    } else {
      setEcChangeDetail("");
    }
  };

  const [changeRequest, setChangeRequest] = useState(product.defaultOptions?.changeRequest || "Không thay đổi");
  const [changeRequestDetail, setChangeRequestDetail] = useState(() => {
    const defaultCr = product.defaultOptions?.changeRequest;
    return CHANGE_REQUEST_CONFIGS[defaultCr]?.options?.[0] || "Cross 45";
  });
  const [changeRequestText, setChangeRequestText] = useState("");
  const [singleQty, setSingleQty] = useState(1);
  const [addedToListSuccess, setAddedToListSuccess] = useState(false);

  // Tìm cấu hình loại thay đổi từ Master Data QLSP
  const matchedChangeTypeConfig = useMemo(() => {
    return changeTypesList.find(
      (ct) =>
        ct.name.toLowerCase() === changeRequest.toLowerCase() ||
        ct.code.toLowerCase() === changeRequest.toLowerCase() ||
        changeRequest.toLowerCase().includes(ct.name.toLowerCase())
    );
  }, [changeRequest, changeTypesList]);

  const handleSelectChangeRequest = (val) => {
    setChangeRequest(val);
    const matched = changeTypesList.find(
      (ct) =>
        ct.name.toLowerCase() === val.toLowerCase() ||
        ct.code.toLowerCase() === val.toLowerCase() ||
        val.toLowerCase().includes(ct.name.toLowerCase())
    );
    if (matched && matched.customOptions && matched.customOptions.length > 0) {
      setChangeRequestDetail(matched.customOptions[0]);
    } else {
      const config = CHANGE_REQUEST_CONFIGS[val];
      if (config && config.options?.length > 0) {
        setChangeRequestDetail(config.options[0]);
      } else {
        setChangeRequestDetail("");
      }
    }
  };

  const handleAddStandardSingleToCart = () => {
    // 1. Kiểm tra validation theo quy tắc nghiệp vụ
    if (ecChangeCategory === "Khác" && !otherChangeDescription.trim()) {
      setFormError("Vui lòng nhập mô tả yêu cầu thay đổi!");
      return;
    }
    if (otherChangeMode === "required" && !otherChangeDescription.trim()) {
      setFormError("Vui lòng nhập mô tả yêu cầu thay đổi khác (bắt buộc)!");
      return;
    }
    setFormError("");

    // Tổng hợp các thuộc tính đã tùy biến trên E-Catalogue
    const customList = [];
    if (ecChangeCategory !== "Không thay đổi" && ecChangeCategory !== "Khác" && ecChangeDetail) {
      customList.push(`${ecChangeCategory}: ${ecChangeDetail}`);
    }
    if (ecChangeCategory === "Khác" && otherChangeDescription.trim()) {
      customList.push(`Yêu cầu thay đổi khác: ${otherChangeDescription.trim()}`);
    } else if (hasOtherChange && otherChangeDescription.trim()) {
      customList.push(`Khác: ${otherChangeDescription.trim()}`);
    }

    const changeRequestSummary = customList.length > 0 ? customList.join(" • ") : "Chuẩn";

    addToCart({
      id: `${product.id}-${goldColor}-${mainStoneColor}-${selectedSize}-${Date.now()}`,
      productCode: product.productCode,
      productName: product.productName,
      categoryName: product.categoryName,
      goldColor,
      mainStoneColor,
      size: selectedSize,
      changeCategory: ecChangeCategory !== "Không thay đổi" ? ecChangeCategory : "",
      changeDetail: ecChangeDetail,
      hasOtherChange: hasOtherChange || ecChangeCategory === "Khác",
      otherChangeDescription: otherChangeDescription,
      changeRequest: changeRequestSummary,
      // Quy tắc tách đơn & tính giá sau theo yêu cầu của Chị đẹp
      isCustomOrOther: isCustomOrOther,
      isPricePending: isCustomOrOther,
      priceDisplay: isCustomOrOther ? "Tính giá sau" : (product.specs?.wage || "205,000đ"),
      // Trường note được thay thế bằng mô tả thay đổi khác khi tick chọn
      note: otherChangeDescription,
      qty: Number(singleQty) || 1,
      wagePrice: isCustomOrOther ? 0 : (product.wagePrice || 205000),
      totalWage: isCustomOrOther ? 0 : ((product.wagePrice || 205000) * (Number(singleQty) || 1)),
      weight: product.goldWeight || "0.4500g",
      imageType: product.imageType
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleAddToDraftList = () => {
    setAddedToListSuccess(true);
    setTimeout(() => setAddedToListSuccess(false), 2500);
  };

  const [note, setNote] = useState(product.defaultOptions?.note || "");
  const [activePreviewType, setActivePreviewType] = useState(product.imageType);
  const [copied, setCopied] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Các version thay đổi ảnh hưởng đến drawing (thay cast, đắp lacquer...)
  const drawingVersions = useMemo(() => {
    if (product.drawingVersions && product.drawingVersions.length > 0) {
      return product.drawingVersions;
    }
    const baseDrawing = product.drawingCode || "ST000001A00";
    const prefix10 = product.productCode ? product.productCode.slice(0, 10) : "GY0ST00000";
    const suffix17 = product.productCode ? product.productCode.slice(13) : "A00CZRO1CZGG1000";

    return [
      {
        id: "v-std",
        code: "A00",
        drawingCode: baseDrawing,
        productCode: product.productCode,
        name: "Bản vẽ chuẩn",
        tag: "Bản vẽ chuẩn",
        desc: "Khuôn cast gốc tiêu chuẩn",
        badge: "Gốc",
        imageType: product.imageType
      },
      {
        id: "v-lacquer",
        code: "A01",
        drawingCode: baseDrawing.replace(/A00$/, "A01"),
        productCode: `${prefix10}A01${suffix17}`,
        name: "Đắp Lacquer men sứ",
        tag: "Đắp Lacquer",
        desc: "Đắp men sứ viền hoa văn (thay đổi drawing)",
        badge: "Lacquer",
        imageType: product.imageType
      },
      {
        id: "v-cast",
        code: "B00",
        drawingCode: baseDrawing.replace(/A00$/, "B00"),
        productCode: `${prefix10}B00${suffix17}`,
        name: "Thay Cast ổ chấu",
        tag: "Thay Cast",
        desc: "Thay kết cấu khuôn ổ đá (thay đổi drawing)",
        badge: "Thay Cast",
        imageType: product.imageType
      },
      {
        id: "v-ball",
        code: "C00",
        drawingCode: baseDrawing.replace(/A00$/, "C00"),
        productCode: `${prefix10}C00${suffix17}`,
        name: "Bào Ball viền đá",
        tag: "Bào Ball",
        desc: "Họa tiết bào bóng viền đá (thay đổi drawing)",
        badge: "Bào Ball",
        imageType: product.imageType
      }
    ];
  }, [product]);

  const [selectedVersionId, setSelectedVersionId] = useState("v-std");
  const activeVersion = drawingVersions.find(v => v.id === selectedVersionId) || drawingVersions[0];
  const displayProductCode = activeVersion?.productCode || product.productCode;
  const displayDrawingCode = activeVersion?.drawingCode || product.drawingCode;

  // Set / Pair-specific state: Nhóm kích thước và số lượng từng Bộ/Cặp
  const getDefaultCompModels = () => {
    return (product.components || []).reduce((acc, comp) => {
      acc[comp.id] = comp.defaultModel || (comp.availableModels && comp.availableModels[0]?.type) || "default";
      return acc;
    }, {});
  };

  const getCompActiveModel = (comp, group) => {
    if (!comp.availableModels || comp.availableModels.length === 0) return comp;
    const currentType = group?.models?.[comp.id] || comp.defaultModel || comp.availableModels[0].type;
    return comp.availableModels.find(m => m.type === currentType) || comp.availableModels[0];
  };

  const getDefaultCompSizes = (modelsMap) => {
    return (product.components || []).reduce((acc, comp) => {
      if (comp.availableModels && comp.availableModels.length > 0) {
        const mType = modelsMap?.[comp.id] || comp.defaultModel || comp.availableModels[0].type;
        const targetModel = comp.availableModels.find(m => m.type === mType) || comp.availableModels[0];
        acc[comp.id] = targetModel.defaultOption || targetModel.options?.[0] || "0";
      } else {
        acc[comp.id] = comp.defaultOption || (comp.options && comp.options[0]) || "0";
      }
      return acc;
    }, {});
  };

  const getDefaultCompChangeRequests = () => {
    return (product.components || []).reduce((acc, comp) => {
      acc[comp.id] = (comp.availableChangeRequests && comp.availableChangeRequests[0]) || "Không thay đổi";
      return acc;
    }, {});
  };

  const groupPrefix = product.isPair ? "Cặp" : "Bộ";

  const [quickAddedToast, setQuickAddedToast] = useState("");

  const [setSizeGroups, setSetSizeGroups] = useState(() => {
    const initModels = getDefaultCompModels();
    return [
      {
        id: "set-group-1",
        nameLabel: `${groupPrefix} 1`,
        quantity: 1,
        laserText: "",
        models: initModels,
        sizes: getDefaultCompSizes(initModels),
        changeRequests: (product.components || []).reduce((acc, comp) => {
          acc[comp.id] = (comp.availableChangeRequests && comp.availableChangeRequests[0]) || "Không thay đổi";
          return acc;
        }, {})
      }
    ];
  });

  const handleAddSetSizeGroup = () => {
    const nextNum = setSizeGroups.length + 1;
    const initModels = getDefaultCompModels();
    setSetSizeGroups(prev => [
      ...prev,
      {
        id: `set-group-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nameLabel: `${groupPrefix} ${nextNum}`,
        quantity: 1,
        laserText: "",
        models: initModels,
        sizes: getDefaultCompSizes(initModels),
        changeRequests: getDefaultCompChangeRequests()
      }
    ]);
  };

  const handleRemoveSetSizeGroup = (groupId) => {
    if (setSizeGroups.length <= 1) return;
    setSetSizeGroups(prev => {
      const filtered = prev.filter(g => g.id !== groupId);
      return filtered.map((g, idx) => ({
        ...g,
        nameLabel: `${groupPrefix} ${idx + 1}`
      }));
    });
  };

  const handleUpdateGroupQty = (groupId, newQty) => {
    const val = Math.max(1, parseInt(newQty) || 1);
    setSetSizeGroups(prev => prev.map(g => g.id === groupId ? { ...g, quantity: val } : g));
  };

  const handleUpdateGroupModel = (groupId, compId, modelType) => {
    setSetSizeGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const comp = (product.components || []).find(c => c.id === compId);
      const targetModel = comp?.availableModels?.find(m => m.type === modelType);
      const newDefSize = targetModel?.defaultOption || targetModel?.options?.[0] || "0";
      return {
        ...g,
        models: {
          ...g.models,
          [compId]: modelType
        },
        sizes: {
          ...g.sizes,
          [compId]: newDefSize
        }
      };
    }));
  };

  const handleUpdateGroupSize = (groupId, compId, sizeVal) => {
    setSetSizeGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        sizes: {
          ...g.sizes,
          [compId]: sizeVal
        }
      };
    }));
  };

  const handleUpdateGroupChangeRequest = (groupId, compId, crVal) => {
    setSetSizeGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        changeRequests: {
          ...g.changeRequests,
          [compId]: crVal
        }
      };
    }));
  };

  const handleUpdateGroupLaserText = (groupId, text) => {
    setSetSizeGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        laserText: text
      };
    }));
  };

  // Cấu hình kiểu Cặp mặc định: 1 Nhẫn Nam (RM) + 1 Nhẫn Nữ (RG), có thể chọn thêm lựa chọn nếu cần
  const [pairPreset, setPairPreset] = useState("traditional");

  const handleApplyPairPreset = (preset) => {
    setPairPreset(preset);
    if (preset === "traditional") {
      setSetSizeGroups(prev => prev.map(g => ({
        ...g,
        models: { "ring-1": "male", "ring-2": "female" },
        sizes: {
          "ring-1": g.sizes?.["ring-1"] && ["54", "56", "58", "60", "62", "64"].includes(g.sizes["ring-1"]) ? g.sizes["ring-1"] : "58",
          "ring-2": g.sizes?.["ring-2"] && ["48", "50", "52", "54", "56"].includes(g.sizes["ring-2"]) ? g.sizes["ring-2"] : "52"
        }
      })));
    } else if (preset === "two_female") {
      setSetSizeGroups(prev => prev.map(g => ({
        ...g,
        models: { "ring-1": "female", "ring-2": "female" },
        sizes: {
          "ring-1": g.sizes?.["ring-1"] && ["48", "50", "52", "54", "56"].includes(g.sizes["ring-1"]) ? g.sizes["ring-1"] : "52",
          "ring-2": g.sizes?.["ring-2"] && ["48", "50", "52", "54", "56"].includes(g.sizes["ring-2"]) ? g.sizes["ring-2"] : "50"
        }
      })));
    } else if (preset === "two_male") {
      setSetSizeGroups(prev => prev.map(g => ({
        ...g,
        models: { "ring-1": "male", "ring-2": "male" },
        sizes: {
          "ring-1": g.sizes?.["ring-1"] && ["54", "56", "58", "60", "62", "64"].includes(g.sizes["ring-1"]) ? g.sizes["ring-1"] : "58",
          "ring-2": g.sizes?.["ring-2"] && ["54", "56", "58", "60", "62", "64"].includes(g.sizes["ring-2"]) ? g.sizes["ring-2"] : "56"
        }
      })));
    }
  };

  const handleDuplicateGroup = (groupId) => {
    const target = setSizeGroups.find(g => g.id === groupId);
    if (!target) return;
    const nextNum = setSizeGroups.length + 1;
    setSetSizeGroups(prev => [
      ...prev,
      {
        ...target,
        id: `set-group-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nameLabel: `${groupPrefix} ${nextNum}`,
        quantity: 1
      }
    ]);
  };

  const handleAddPresetPair = (s1, s2, label) => {
    const nextNum = setSizeGroups.length + 1;
    const initModels = pairPreset === "two_female"
      ? { "ring-1": "female", "ring-2": "female" }
      : pairPreset === "two_male"
      ? { "ring-1": "male", "ring-2": "male" }
      : { "ring-1": "male", "ring-2": "female" };

    setSetSizeGroups(prev => [
      ...prev,
      {
        id: `set-group-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nameLabel: `${groupPrefix} ${nextNum}`,
        quantity: 1,
        laserText: "",
        models: initModels,
        sizes: {
          "ring-1": s1 || (initModels["ring-1"] === "male" ? "58" : "52"),
          "ring-2": s2 || (initModels["ring-2"] === "male" ? "58" : "52")
        },
        changeRequests: getDefaultCompChangeRequests()
      }
    ]);
    if (label) {
      setQuickAddedToast(`Đã thêm ${groupPrefix} ${nextNum}: Ni ${s1} & Ni ${s2}`);
      setTimeout(() => setQuickAddedToast(""), 2200);
    }
  };

  // Chọn nhanh cặp Ni phổ biến (1-Click) áp dụng tức thì cho Cặp đầu tiên
  const handleApplyQuickNiToFirstPair = (mNi, fNi) => {
    setSetSizeGroups(prev => {
      if (prev.length === 0) {
        return [{
          id: `set-group-${Date.now()}`,
          nameLabel: "Cặp 1",
          quantity: 1,
          laserText: "",
          models: { "ring-1": "male", "ring-2": "female" },
          sizes: { "ring-1": mNi, "ring-2": fNi },
          changeRequests: getDefaultCompChangeRequests()
        }];
      }
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        sizes: {
          ...updated[0].sizes,
          "ring-1": mNi,
          "ring-2": fNi
        }
      };
      return updated;
    });
    setQuickAddedToast(`Đã áp dụng: Nam Ni ${mNi} & Nữ Ni ${fNi}`);
    setTimeout(() => setQuickAddedToast(""), 2000);
  };



  // Wholesale Stone Rows allocation
  const [stoneRows, setStoneRows] = useState(() => [
    {
      id: "row-1",
      stoneColor: product.defaultOptions?.mainStoneColor || product.availableStoneColors?.[0] || "Trắng",
      fillQty: 1,
      quantities: {}
    }
  ]);

  const updateRowQty = (rowId, size, newQty) => {
    setStoneRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const q = Math.max(0, parseInt(newQty) || 0);
      const updated = { ...row.quantities };
      if (q === 0) {
        delete updated[size];
      } else {
        updated[size] = q;
      }
      return { ...row, quantities: updated };
    }));
  };

  const updateRowFillQty = (rowId, val) => {
    const q = Math.max(1, parseInt(val) || 1);
    setStoneRows(prev => prev.map(row => row.id === rowId ? { ...row, fillQty: q } : row));
  };

  const changeRowColor = (rowId, color) => {
    setStoneRows(prev => prev.map(row => row.id === rowId ? { ...row, stoneColor: color } : row));
  };

  const addStoneRow = () => {
    const usedColors = stoneRows.map(r => r.stoneColor);
    const available = product.availableStoneColors?.find(c => !usedColors.includes(c)) || product.availableStoneColors?.[0] || "Trắng";
    setStoneRows(prev => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        stoneColor: available,
        fillQty: 1,
        quantities: {}
      }
    ]);
  };

  const removeStoneRow = (rowId) => {
    if (stoneRows.length <= 1) return;
    setStoneRows(prev => prev.filter(r => r.id !== rowId));
  };

  const quickFillRow = (rowId, amount = 1) => {
    const qtyToSet = Math.max(1, parseInt(amount) || 1);
    setStoneRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const newQ = {};
      (product.availableNiSizes || []).forEach(size => {
        newQ[size] = qtyToSet;
      });
      return { ...row, quantities: newQ, fillQty: qtyToSet };
    }));
  };

  const clearRow = (rowId) => {
    setStoneRows(prev => prev.map(row => row.id === rowId ? { ...row, quantities: {} } : row));
  };

  // Wholesale Items calculation with Price Deltas
  const wholesaleItems = useMemo(() => {
    const items = [];
    const goldDelta = GOLD_COLOR_DELTAS[goldColor] || 0;

    stoneRows.forEach(row => {
      const stoneDelta = STONE_COLOR_DELTAS[row.stoneColor] || 0;

      Object.entries(row.quantities || {}).forEach(([size, qty]) => {
        const numQty = parseInt(qty) || 0;
        if (numQty > 0) {
          const sizeDelta = getSizeDelta(size);
          const itemDelta = goldDelta + stoneDelta + sizeDelta;
          const totalItemWage = roundUp5k((product.wagePrice || 0) + itemDelta);

          items.push({
            productCode: product.productCode,
            productName: product.productName,
            mainStoneColor: row.stoneColor,
            goldColor: goldColor,
            changeRequest: (changeRequest && changeRequest !== "Không thay đổi" && changeRequestDetail) 
              ? `${changeRequest} (${changeRequestDetail})` 
              : changeRequest,
            changeRequestDetail: changeRequestDetail,
            niSize: size,
            quantity: numQty,
            weight: product.weight,
            wagePrice: totalItemWage,
            baseWage: product.wagePrice || 0,
            itemDelta,
            note: note,
            imageType: product.imageType,
            category: product.categoryName
          });
        }
      });
    });
    return items;
  }, [stoneRows, goldColor, changeRequest, changeRequestDetail, note, product]);

  const totalWholesaleQty = useMemo(() => {
    return wholesaleItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [wholesaleItems]);

  const totalBaseWage = useMemo(() => {
    return totalWholesaleQty * (product.wagePrice || 0);
  }, [totalWholesaleQty, product.wagePrice]);

  const totalSurcharge = useMemo(() => {
    return wholesaleItems.reduce((sum, item) => sum + (item.itemDelta * item.quantity), 0);
  }, [wholesaleItems]);

  const totalWholesaleWeight = useMemo(() => {
    return totalWholesaleQty * (product.weight || 0);
  }, [totalWholesaleQty, product.weight]);

  const totalWholesaleWage = useMemo(() => {
    return roundUp5k(totalBaseWage + totalSurcharge);
  }, [totalBaseWage, totalSurcharge]);



  // Set / Pair Calculations (tính linh hoạt theo model từng chiếc trong nhóm)
  const allComps = useMemo(() => product.components || [], [product.components]);

  const groupCalculations = useMemo(() => {
    return setSizeGroups.map(group => {
      const gQty = parseInt(group.quantity) || 1;
      let gWeight = 0;
      let gWage = 0;
      allComps.forEach(comp => {
        const activeModel = getCompActiveModel(comp, group);
        gWeight += (activeModel.weight || comp.weight || 0);
        gWage += (activeModel.wagePrice || comp.wagePrice || 0);
      });
      return {
        groupId: group.id,
        singleWeight: gWeight,
        singleWage: gWage,
        totalWeight: gWeight * gQty,
        totalWage: roundUp5k(gWage * gQty),
        quantity: gQty
      };
    });
  }, [setSizeGroups, allComps]);

  const totalSetOrderQty = useMemo(() => {
    return setSizeGroups.reduce((sum, g) => sum + (parseInt(g.quantity) || 0), 0);
  }, [setSizeGroups]);

  const totalSetWeight = useMemo(() => {
    return groupCalculations.reduce((sum, gc) => sum + gc.totalWeight, 0);
  }, [groupCalculations]);

  const totalSetWage = useMemo(() => {
    return groupCalculations.reduce((sum, gc) => sum + gc.totalWage, 0);
  }, [groupCalculations]);

  const singleSetWeight = groupCalculations[0]?.singleWeight || 0;
  const singleSetWage = groupCalculations[0]?.singleWage || 0;
  const totalSetItemCount = useMemo(() => allComps.length * totalSetOrderQty, [allComps, totalSetOrderQty]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayProductCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    if (product.isSet) {
      if (totalSetOrderQty === 0) {
        alert(`Chị đẹp vui lòng nhập số lượng cho ít nhất 1 ${product.isPair ? "cặp" : "bộ"} ạ!`);
        return;
      }

      // Thêm từng nhóm bộ/cặp vào giỏ hàng với thông tin kích thước và model tương ứng
      setSizeGroups.forEach((group, gIdx) => {
        const groupQty = parseInt(group.quantity) || 0;
        if (groupQty > 0) {
          const calc = groupCalculations[gIdx] || { singleWeight: singleSetWeight, singleWage: singleSetWage };
          const groupWeight = calc.singleWeight * groupQty;
          const groupWage = roundUp5k(calc.singleWage * groupQty);

          const groupLaserTag = group.laserText ? `[Khắc laser: "${group.laserText}"]` : "";
          const versionTag = activeVersion ? `[Version: ${activeVersion.name} (${activeVersion.code})]` : "";
          const groupNoteParts = [`[${group.nameLabel}]`, versionTag, groupLaserTag, note].filter(Boolean);
          const fullGroupNote = groupNoteParts.join(" ");

          addToCart({
            isSet: true,
            isPair: !!product.isPair,
            productCode: displayProductCode,
            productName: product.productName,
            drawingCode: displayDrawingCode,
            drawingVersion: activeVersion?.name,
            versionCode: activeVersion?.code,
            category: product.categoryName,
            goldColor,
            mainStoneColor,
            quantity: groupQty,
            weight: groupWeight,
            wagePrice: groupWage,
            note: fullGroupNote,
            laserText: group.laserText || "",
            imageType: product.imageType,
            setNameLabel: group.nameLabel,
            components: allComps.map(c => {
              const activeModel = getCompActiveModel(c, group);
              const isEarring = c.itemType === "earrings" || c.name?.toLowerCase().includes("bông tai");
              const compSize = isEarring ? "0" : (group.sizes?.[c.id] || activeModel.defaultOption || activeModel.options?.[0] || "0");
              const rawCR = group.changeRequests?.[c.id] || "Không thay đổi";
              const compCR = (rawCR.includes("Khắc laser") && group.laserText)
                ? `${rawCR} ("${group.laserText}")`
                : rawCR;
              const displayName = activeModel.label 
                ? `${c.roleLabel || c.name} (${activeModel.label})` 
                : c.name;

              return {
                id: c.id,
                name: displayName,
                modelType: group.models?.[c.id] || c.defaultModel,
                sku: activeModel.sku || c.sku,
                selectedOption: compSize,
                optionType: "Size",
                changeRequest: compCR,
                weight: activeModel.weight || c.weight,
                wagePrice: activeModel.wagePrice || c.wagePrice,
                icon: c.icon
              };
            })
          });
        }
      });
    } else {
      if (wholesaleItems.length === 0) {
        alert("Chị đẹp vui lòng nhập số lượng cho ít nhất 1 kích thước Ni ạ!");
        return;
      }
      if (addBatchToCart) {
        addBatchToCart(wholesaleItems);
      } else {
        wholesaleItems.forEach(item => addToCart(item));
      }
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-16">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-2 text-gray-500 overflow-hidden">
            <Link href="/catalogue" className="hover:text-[#00594c] font-semibold transition-colors shrink-0">
              Sản phẩm
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <Link 
              href={`/catalogue?category=${product.categoryId}`} 
              className="hover:text-[#00594c] font-semibold transition-colors shrink-0"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-[#00594c] font-bold truncate">
              {displayProductCode}
            </span>
          </div>

          <Link
            href="/catalogue"
            className="flex items-center text-xs font-semibold text-[#00594c] hover:underline shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Về danh mục
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* ================================================================= */}
            {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM & GALLERY (Sticky trên iPad / Desktop) */}
            {/* ================================================================= */}
            <div className="md:col-span-5 lg:col-span-6 flex flex-col items-center md:sticky md:top-6 self-start">
              <div 
                onClick={() => setIsZoomOpen(true)}
                className="w-full aspect-square bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 p-4 sm:p-6 flex items-center justify-center relative shadow-sm group overflow-hidden cursor-zoom-in"
                title="Bấm vào để xem ảnh kích thước đầy đủ"
              >
                <JewelryVisual type={activePreviewType} className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
                
                {/* Floating Category Tag */}
                {product.isPair ? (
                  <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 pointer-events-none">
                    <Crown className="h-3.5 w-3.5 text-pink-200" />
                    <span>NHẪN CƯỚI (2 CHIẾC)</span>
                  </div>
                ) : product.isSet ? (
                  <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 pointer-events-none">
                    <Crown className="h-3.5 w-3.5 text-amber-200" />
                    <span>BỘ TRANG SỨC ({product.components?.length || 4} MÓN)</span>
                  </div>
                ) : (
                  <div className="absolute top-3.5 left-3.5 bg-[#00594c] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
                    {product.categoryName}
                  </div>
                )}

                {/* Hint Xem ảnh kích thước đầy đủ */}
                <div className="absolute bottom-3.5 right-3.5 bg-black/60 hover:bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Xem ảnh lớn</span>
                </div>
              </div>

              {/* Component Gallery (Pair) OR Drawing Versions (Bộ trang sức) */}
              {product.isSet && (
                <div className="w-full mt-3.5 space-y-2.5">
                  {product.isPair ? (
                    <>
                      <div className="text-xs font-semibold text-gray-500 text-center">
                        Xem chi tiết cặp nhẫn:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto">
                        <button
                          onClick={() => setActivePreviewType(product.imageType)}
                          className={`p-1.5 sm:p-2 rounded-xl border-2 bg-gray-50 transition-all flex flex-col items-center justify-center cursor-pointer ${
                            activePreviewType === product.imageType ? "border-[#00594c] ring-2 ring-emerald-500/20 shadow-sm bg-emerald-50/20" : "border-gray-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div className="text-sm sm:text-base">💍</div>
                          <span className="text-[10px] font-bold text-gray-700 mt-0.5 truncate">Cả cặp</span>
                        </button>
                        {product.components.map((comp) => (
                          <button
                            key={comp.id}
                            onClick={() => setActivePreviewType(comp.imageType || product.imageType)}
                            className={`p-1.5 sm:p-2 rounded-xl border-2 bg-gray-50 transition-all flex flex-col items-center justify-center cursor-pointer ${
                              activePreviewType === comp.imageType ? "border-[#00594c] ring-2 ring-emerald-500/20 shadow-sm bg-emerald-50/20" : "border-gray-200 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <div className="text-sm sm:text-base">{comp.icon}</div>
                            <span className="text-[10px] font-bold text-gray-700 mt-0.5 truncate">
                              {comp.id === "ring-1" ? "Nhẫn Nam" : "Nhẫn Nữ"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* BỘ TRANG SỨC: CÁC VERSION THAY ĐỔI ẢNH HƯỞNG ĐẾN DRAWING (DẠNG HÌNH ẢNH & HOVER TOOLTIP) */
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs pb-0.5">
                        <span className="font-bold text-gray-800 flex items-center">
                          <Layers className="h-3.5 w-3.5 mr-1.5 text-[#00594c]" />
                          Phiên bản thiết kế (Drawing Version):
                        </span>
                        <span className="text-[10px] text-gray-400 italic hidden sm:inline">
                          Rê chuột để xem tên phiên bản
                        </span>
                      </div>

                      {/* 4 Thumbnail hình ảnh của từng phiên bản */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                        {drawingVersions.map((ver) => {
                          const isSelected = selectedVersionId === ver.id;
                          return (
                            <div key={ver.id} className="relative group">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedVersionId(ver.id);
                                  if (ver.imageType) setActivePreviewType(ver.imageType);
                                }}
                                className={`w-full aspect-square p-1 sm:p-1.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden bg-white flex flex-col items-center justify-center ${
                                  isSelected
                                    ? "border-[#00594c] ring-2 ring-emerald-500/25 shadow-md scale-[1.02]"
                                    : "border-gray-200 hover:border-emerald-400 hover:shadow-xs opacity-85 hover:opacity-100"
                                }`}
                              >
                                {/* Ảnh visual của phiên bản */}
                                <div className="w-full h-full flex items-center justify-center pointer-events-none p-0.5">
                                  <JewelryVisual type={ver.imageType || product.imageType} className="w-full h-full object-contain" />
                                </div>

                                {/* Badge mã Drawing Version ở góc */}
                                <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold leading-none ${
                                  isSelected ? "bg-[#00594c] text-white" : "bg-black/60 text-white backdrop-blur-xs"
                                }`}>
                                  {ver.code}
                                </div>

                                {/* Checkmark khi được chọn */}
                                {isSelected && (
                                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#00594c] text-white flex items-center justify-center shadow-xs">
                                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                                  </div>
                                )}
                              </button>

                              {/* Tooltip khi rê chuột vào (Hover) */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-40 pointer-events-none whitespace-nowrap animate-fadeIn">
                                <div className="bg-gray-900/95 backdrop-blur-xs text-white px-2.5 py-1.5 rounded-xl shadow-xl text-center space-y-0.5 border border-gray-700/50">
                                  <div className="text-[11px] font-bold text-amber-300 flex items-center justify-center space-x-1">
                                    <span className="font-mono">{ver.code}</span>
                                    <span>•</span>
                                    <span>{ver.name}</span>
                                  </div>
                                  <div className="text-[10px] text-gray-300 font-normal">
                                    {ver.desc}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-gray-900/95 rotate-45 -mt-1" />
                              </div>

                              {/* Nhãn phiên bản bên dưới */}
                              <div className="text-center mt-1">
                                <div className={`text-[10px] sm:text-[11px] font-bold truncate ${
                                  isSelected ? "text-[#00594c]" : "text-gray-700"
                                }`}>
                                  {ver.tag}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: CONFIGURATOR (SET vs SINGLE PRODUCT)                */}
            {/* ================================================================= */}
            <div className="md:col-span-7 lg:col-span-6 space-y-5">
              
              {/* Product Code Header */}
              <div className="pb-1">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h1 className="font-mono text-base sm:text-lg lg:text-xl font-black text-gray-900 tracking-tight select-all">
                        {displayProductCode}
                      </h1>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs font-semibold text-gray-700">
                        {product.isPair 
                          ? (product.productName?.replace(/^Cặp\s+/i, "Nhẫn cưới ") || "Nhẫn cưới (2 chiếc)")
                          : product.isSet 
                          ? `Bộ (${product.components?.length || 4} món)` 
                          : (product.productName?.replace(/viền bi hạt tròn/gi, "").trim() || product.productName)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl text-gray-400 hover:text-[#00594c] hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                    title="Sao chép mã sản phẩm"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* =============================================================== */}
              {/* CASE A: SẢN PHẨM BỘ / CẶP NHẪN CƯỚI CONFIGURATOR               */}
              {/* =============================================================== */}
              {product.isSet ? (
                <div className="space-y-5">
                  {/* Specs Bar cho Bộ / Cặp (2 cột: Trọng lượng & Giá công tinh gọn) */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-4 sm:px-6 bg-[#f4f9f7] rounded-2xl border border-emerald-100 text-center items-center">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium">Trọng lượng</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5 font-mono">
                        {Number(singleSetWeight || 0).toFixed(4)} <span className="text-xs font-normal text-gray-500">Lượng</span>
                      </div>
                    </div>
                    <div className="border-l border-emerald-200/60">
                      <div className="text-[11px] text-gray-500 font-medium">Giá công</div>
                      <div className="text-base font-bold text-[#00594c] mt-0.5 font-mono">
                        {roundUp5k(singleSetWage).toLocaleString()}đ
                      </div>
                    </div>
                  </div>

                  {/* TẦNG 1: THUỘC TÍNH CHUNG (Chỉ 2 cột Màu xi & Màu đá chính) */}
                  <div className="bg-[#f2f8f6] p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 space-y-2.5">
                    <div className="text-xs font-bold text-[#00594c] uppercase tracking-wider flex items-center">
                      <Settings2 className="h-4 w-4 mr-1.5" />
                      Thuộc tính chung
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Màu xi */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Màu xi</label>
                        <select
                          value={goldColor}
                          onChange={(e) => setGoldColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer min-h-[38px]"
                        >
                          {product.availableGoldColors?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Màu đá chính */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Màu đá chính</label>
                        <select
                          value={mainStoneColor}
                          onChange={(e) => setMainStoneColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer min-h-[38px]"
                        >
                          {product.availableStoneColors?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* =============================================================== */}
                  {/* PHÂN HỆ CHỌN KÍCH THƯỚC: CẶP NHẪN CƯỚI vs BỘ 4 MÓN              */}
                  {/* =============================================================== */}
                  {product.isPair ? (
                    /* CASE 1: CẶP NHẪN CƯỚI - FAST-ORDER LUXURY UX (ZERO HORIZONTAL SCROLL) */
                    <div className="space-y-3.5 pt-1">
                      
                      {/* 1. THANH TIÊU ĐỀ & ĐỔI KIỂU CẶP TINH GỌN */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-gray-100">
                        <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                          <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                          Kích thước cặp nhẫn
                          <span className="ml-2 bg-emerald-100 text-[#00594c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {setSizeGroups.length} cặp
                          </span>
                        </div>

                        {/* Dropdown đổi kiểu cặp nếu cần khác truyền thống */}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">Kiểu cặp:</span>
                          <select
                            value={pairPreset}
                            onChange={(e) => handleApplyPairPreset(e.target.value)}
                            className="px-2.5 py-1 bg-white border border-gray-300 hover:border-[#00594c] rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer shadow-2xs"
                          >
                            <option value="traditional">1 Nam + 1 Nữ</option>
                            <option value="two_female">2 Nhẫn Nữ</option>
                            <option value="two_male">2 Nhẫn Nam</option>
                            <option value="custom">Tùy chọn từng chiếc</option>
                          </select>
                        </div>
                      </div>

                      {/* 2. DANH SÁCH CÁC CẶP KÍCH THƯỚC (RESPONSIVE PAIR CARDS - ZERO HORIZONTAL SCROLL) */}
                      <div className="space-y-2.5">
                        {setSizeGroups.map((group, groupIdx) => {
                          const comp1 = (product.components || [])[0];
                          const comp2 = (product.components || [])[1];
                          const activeModel1 = comp1 ? getCompActiveModel(comp1, group) : null;
                          const activeModel2 = comp2 ? getCompActiveModel(comp2, group) : null;
                          
                          const size1 = group.sizes?.[comp1?.id] || activeModel1?.defaultOption || "58";
                          const size2 = group.sizes?.[comp2?.id] || activeModel2?.defaultOption || "52";
                          
                          const singlePairWage = (activeModel1?.wagePrice || 1150000) + (activeModel2?.wagePrice || 950000);
                          const totalPairWage = singlePairWage * (parseInt(group.quantity) || 1);

                          return (
                            <div 
                              key={group.id} 
                              className="p-3.5 bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:border-emerald-300 transition-colors space-y-3"
                            >
                              {/* Hàng tiêu đề cặp & giá công */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-xs text-[#00594c] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                                    {group.nameLabel || `Cặp ${groupIdx + 1}`}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold font-mono text-[#00594c]">
                                    {totalPairWage.toLocaleString()}đ
                                  </span>
                                  {setSizeGroups.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSetSizeGroup(group.id)}
                                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Xóa cặp này"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Bố cục chọn Ni Nam, Ni Nữ và Số Lượng: Vừa khít 100% không cuộn ngang */}
                              <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end">
                                {/* Cột 1: Ni Chiếc 1 (Nam) */}
                                <div className="col-span-5 sm:col-span-5">
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                    {pairPreset === "two_female" ? "Nhẫn Nữ 1" : "Nhẫn Nam"}
                                  </label>
                                  <select
                                    value={size1}
                                    onChange={(e) => comp1 && handleUpdateGroupSize(group.id, comp1.id, e.target.value)}
                                    className="w-full bg-gray-50 hover:bg-white focus:bg-white px-2.5 py-1.5 border border-gray-300 focus:border-[#00594c] rounded-xl text-xs font-bold text-[#00594c] focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer transition-all min-h-[38px]"
                                  >
                                    {(activeModel1?.options || ["54", "56", "58", "60", "62", "64"]).map(opt => (
                                      <option key={opt} value={opt}>Ni {opt}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Cột 2: Ni Chiếc 2 (Nữ) */}
                                <div className="col-span-5 sm:col-span-5">
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                    {pairPreset === "two_male" ? "Nhẫn Nam 2" : "Nhẫn Nữ"}
                                  </label>
                                  <select
                                    value={size2}
                                    onChange={(e) => comp2 && handleUpdateGroupSize(group.id, comp2.id, e.target.value)}
                                    className="w-full bg-gray-50 hover:bg-white focus:bg-white px-2.5 py-1.5 border border-gray-300 focus:border-[#00594c] rounded-xl text-xs font-bold text-[#00594c] focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer transition-all min-h-[38px]"
                                  >
                                    {(activeModel2?.options || ["48", "50", "52", "54", "56"]).map(opt => (
                                      <option key={opt} value={opt}>Ni {opt}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Cột 3: Số lượng cặp */}
                                <div className="col-span-2 sm:col-span-2">
                                  <label className="block text-[11px] font-bold text-gray-700 mb-1 text-center">
                                    SL
                                  </label>
                                  <div className="flex items-center justify-center border border-gray-300 rounded-xl bg-white overflow-hidden min-h-[38px]">
                                    <input
                                      type="number"
                                      min="1"
                                      value={group.quantity}
                                      onChange={(e) => handleUpdateGroupQty(group.id, e.target.value)}
                                      className="w-full text-center text-xs font-black text-gray-900 bg-white py-1 outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 4. NÚT THÊM CẶP KÍCH THƯỚC KHÁC */}
                      <button
                        type="button"
                        onClick={handleAddSetSizeGroup}
                        className="w-full py-2.5 bg-gray-50 hover:bg-emerald-50/60 text-gray-700 hover:text-[#00594c] border border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Thêm cặp kích thước khác</span>
                      </button>

                    </div>
                  ) : (
                    /* CASE 2: BỘ TRANG SỨC (4 MÓN) - CARDS SELECTOR */
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                          <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                          Chọn kích thước bộ
                          <span className="ml-2 bg-emerald-100 text-[#00594c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {setSizeGroups.length} nhóm kích thước
                          </span>
                        </div>

                        {/* Nút Thêm nhóm kích thước */}
                        <button
                          type="button"
                          onClick={handleAddSetSizeGroup}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00594c] border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>Thêm nhóm kích thước</span>
                        </button>
                      </div>

                      {/* Danh sách từng nhóm Bộ */}
                      <div className="space-y-3">
                        {setSizeGroups.map((group, groupIdx) => (
                          <div
                            key={group.id}
                            className="bg-white rounded-2xl border border-gray-200/90 hover:border-emerald-300/80 p-3 sm:p-3.5 space-y-3 shadow-2xs transition-all"
                          >
                            {/* Header nhóm: Badge Bộ + Nhập SL + Nút xóa */}
                            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <span className="bg-[#00594c] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                                  {group.nameLabel || `Bộ ${groupIdx + 1}`}
                                </span>

                                <div className="flex items-center space-x-1.5">
                                  <span className="text-[11px] font-semibold text-gray-500">Số lượng:</span>
                                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50/60 overflow-hidden shadow-2xs">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateGroupQty(group.id, Math.max(1, (parseInt(group.quantity) || 1) - 1))}
                                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={group.quantity}
                                      onChange={(e) => handleUpdateGroupQty(group.id, e.target.value)}
                                      className="w-12 text-center text-xs font-bold text-gray-900 bg-white py-1 outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateGroupQty(group.id, (parseInt(group.quantity) || 1) + 1)}
                                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-[11px] text-gray-500 font-medium">bộ</span>
                                </div>
                              </div>

                              {/* Nút xóa nhóm */}
                              {setSizeGroups.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSetSizeGroup(group.id)}
                                  className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Xóa nhóm kích thước này"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>

                            {/* KHU VỰC CHỌN KÍCH THƯỚC TỪNG MÓN: LƯỚI 2x2 TINH GỌN, TỐI ƯU UX */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {(product.components || []).map((comp) => {
                                const isEarring = comp.itemType === "earrings" || comp.name?.toLowerCase().includes("bông tai");
                                const currentSize = isEarring 
                                  ? "0" 
                                  : (group.sizes?.[comp.id] || comp.defaultOption || (comp.options && comp.options[0]) || "0");
                                const hasMultipleSizes = comp.options && comp.options.length > 1 && !isEarring;

                                const formatSizeLabel = (opt) => {
                                  if (comp.itemType === "ring" || comp.name?.toLowerCase().includes("nhẫn")) return `Ni ${opt}`;
                                  if (comp.itemType === "necklace" || comp.name?.toLowerCase().includes("dây")) return `${opt} cm`;
                                  if (comp.itemType === "bracelet" || comp.name?.toLowerCase().includes("lắc")) return `Ni ${opt}`;
                                  return `Size ${opt}`;
                                };

                                return (
                                  <div 
                                    key={comp.id}
                                    title={`Món: ${comp.name} | Mã: ${comp.drawingCode || comp.sku} | Trọng lượng: ${comp.weight || '—'} Lượng | Giá công: ${comp.priceDisplay || '—'}`}
                                    className="p-3 bg-gray-50/80 hover:bg-emerald-50/25 rounded-xl border border-gray-200/90 hover:border-emerald-300 transition-all space-y-2 shadow-2xs"
                                  >
                                    {/* Hàng trên: Icon + Tên món + Trọng lượng (giữ nguyên như cũ) */}
                                    <div className="flex items-center justify-between gap-1.5">
                                      <div className="flex items-center space-x-2 min-w-0">
                                        <span className="text-base select-none shrink-0">{comp.icon}</span>
                                        <span className="text-xs font-bold text-gray-800 truncate">{comp.name}</span>
                                      </div>
                                      <span className="text-[11px] text-gray-400 font-mono font-medium shrink-0">
                                        {comp.weight ? `${Number(comp.weight).toFixed(4)} Lượng` : ''}
                                      </span>
                                    </div>

                                    {/* Hàng dưới: Mã Drawing (trái) + Bộ chọn kích thước Ni (phải) */}
                                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                                      {/* Mã Drawing của món con */}
                                      <div 
                                        className="bg-gray-100/80 hover:bg-gray-200/70 border border-gray-200/90 rounded-lg px-2 py-1.5 flex items-center justify-center min-h-[36px] shadow-2xs transition-colors"
                                        title={`Mã Drawing: ${comp.drawingCode || comp.sku}`}
                                      >
                                        <span className="text-[11px] font-mono font-bold text-gray-700 tracking-tight truncate select-all">
                                          {comp.drawingCode || comp.sku}
                                        </span>
                                      </div>

                                      {/* Bộ chọn kích thước Ni */}
                                      <div>
                                        {hasMultipleSizes ? (
                                          <select
                                            value={currentSize}
                                            onChange={(e) => handleUpdateGroupSize(group.id, comp.id, e.target.value)}
                                            className="w-full bg-white px-2 py-1.5 border border-gray-300 hover:border-[#00594c] focus:border-[#00594c] rounded-lg text-xs font-bold text-[#00594c] text-center focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer transition-colors min-h-[36px] shadow-2xs"
                                          >
                                            {comp.options.map(opt => (
                                              <option key={opt} value={opt}>
                                                {formatSizeLabel(opt)}
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          <div className="w-full px-2 py-1.5 bg-white border border-gray-200/80 rounded-lg text-xs font-medium text-gray-400 text-center min-h-[36px] flex items-center justify-center select-none shadow-2xs">
                                            Tiêu chuẩn
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GHI CHÚ TRÊN SẢN PHẨM */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ghi chú trên sản phẩm
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Khắc laser tên lồng ngày cưới / Ghi chú đơn hàng (nếu có)..."
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00594c] shadow-2xs"
                    />
                  </div>

                  {/* TẠM TÍNH & NÚT THÊM VÀO GIỎ */}
                  <div className="p-4 bg-[#f0f7f4] border border-emerald-200/90 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200/60">
                      <span className="font-bold text-sm text-gray-900 tracking-tight">Tạm tính:</span>
                      <span className="bg-emerald-100 text-[#00594c] px-2.5 py-0.5 rounded-full font-bold text-xs">
                        {totalSetOrderQty} {product.isPair ? "Cặp" : "Bộ"} ({totalSetItemCount} {product.isPair ? "Chiếc" : "Món"})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 font-medium">Tổng trọng lượng:</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">{totalSetWeight.toFixed(4)} Lượng</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 font-medium">Tổng tiền công:</div>
                        <div className="text-sm font-black text-[#00594c] font-mono mt-0.5">{roundUp5k(totalSetWage).toLocaleString()}đ</div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={totalSetOrderQty === 0}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${
                        addedSuccess
                          ? "bg-emerald-600 text-white"
                          : totalSetOrderQty === 0
                          ? "bg-gray-200 cursor-not-allowed text-gray-400"
                          : "bg-[#00594c] hover:bg-[#004737] text-white active:scale-98 shadow-md"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Đã thêm {totalSetOrderQty} {product.isPair ? "Cặp" : "Bộ"} vào giỏ hàng thành công!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            Thêm {totalSetOrderQty} {product.isPair ? "Cặp" : "Bộ"} ({totalSetItemCount} {product.isPair ? "chiếc" : "món"}) vào giỏ hàng
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                
                <div className="space-y-4">
                  {/* =============================================================== */}
                  {/* CASE B1: SẢN PHẨM ĐƠN LẺ CHUẨN ẢNH 2 & 3 (GYORG000143...)       */}
                  {/* =============================================================== */}
                  {product.isStandardSingle ? (
                    <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                      {/* Specs Bar (3 cột: Trọng lượng quy đổi, Loại SP, Giá công - Bỏ cột Trọng lượng theo ảnh) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 px-4 bg-[#f4f9f7] rounded-xl border border-emerald-100 text-left items-center">
                        <div>
                          <div className="text-[11px] text-gray-500 font-medium">Trọng lượng quy đổi</div>
                          <div className="text-sm font-bold text-[#00594c] mt-0.5 font-mono">
                            {product.specs?.convertedWeight || "0.4500g"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-500 font-medium">Loại SP</div>
                          <div className="text-sm font-bold text-[#00594c] mt-0.5">
                            {product.specs?.productType || product.categoryName || "Nhẫn nữ"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-500 font-medium">Giá công</div>
                          {isCustomOrOther ? (
                            <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 mt-0.5 shadow-2xs">
                              <Clock className="w-3 h-3 mr-1 text-amber-600 animate-pulse" />
                              <span>Tính giá sau</span>
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-[#00594c] mt-0.5 font-mono">
                              {product.specs?.wage || "205,000đ"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PHẦN 1: 3 THUỘC TÍNH CƠ BẢN (Màu xi, Màu đá chính, Kích thước) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Màu xi */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Màu xi</label>
                          <select
                            value={goldColor}
                            onChange={(e) => setGoldColor(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:ring-1 focus:ring-[#00594c] outline-none cursor-pointer"
                          >
                            {(product.availableGoldColors || ["Vàng", "Trắng", "Hồng", "Hai màu"]).map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        {/* 2. Màu đá chính */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Màu đá chính</label>
                          <select
                            value={mainStoneColor}
                            onChange={(e) => setMainStoneColor(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:ring-1 focus:ring-[#00594c] outline-none cursor-pointer"
                          >
                            {["Trắng", "Đỏ", "Xanh", "Tím", "Vàng", "Hồng", "Đen", "Không đá"].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        {/* 3. Kích thước */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Kích thước</label>
                          <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:ring-1 focus:ring-[#00594c] outline-none cursor-pointer"
                          >
                            {(product.availableNiSizes || ["14", "15", "16", "17", "18"]).map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* PHẦN 2: YÊU CẦU THAY ĐỔI CHUẨN: CHỈ HIỂN THỊ CÁC THUỘC TÍNH CÓ TÍCH CHỌN TRONG BẢNG + 'KHÁC' */}
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <div className={`grid gap-3.5 ${ecChangeCategory !== "Không thay đổi" && ecChangeCategory !== "Khác" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                          {/* Dropdown 1: Yêu cầu thay đổi */}
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              Yêu cầu thay đổi
                            </label>
                            <select
                              value={ecChangeCategory}
                              onChange={(e) => handleSelectEcChangeCategory(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:ring-1 focus:ring-[#00594c] outline-none cursor-pointer shadow-2xs"
                            >
                              {EC_ALLOWED_CHANGE_REQUESTS.map((req) => (
                                <option key={req} value={req}>{req}</option>
                              ))}
                            </select>

                            {/* Ghi chú phản ánh trạng thái cấu hình QLSP theo yêu cầu của Chị đẹp */}
                            {ecChangeCategory !== "Không thay đổi" && ecChangeCategory !== "Khác" && (
                              <div className="mt-1 text-[10px] leading-tight">
                                {otherChangeMode === "hidden" && (
                                  <span className="text-gray-500 font-medium flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1 shrink-0" />
                                    Cấu hình QLSP: <b className="ml-1 text-gray-700">Không được phép thay đổi</b> (Ẩn nút checkbox)
                                  </span>
                                )}
                                {otherChangeMode === "optional" && (
                                  <span className="text-blue-700 font-medium flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1 shrink-0" />
                                    Cấu hình QLSP: <b className="ml-1 text-blue-900">Được phép thay đổi</b> (Hiện checkbox không bắt buộc)
                                  </span>
                                )}
                                {otherChangeMode === "required" && (
                                  <span className="text-amber-800 font-medium flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 shrink-0 animate-pulse" />
                                    Cấu hình QLSP: <b className="ml-1 text-amber-950">Bắt buộc thay đổi</b> (Hiện checkbox bắt buộc)
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Dropdown 2: Dropdown con chi tiết xuất hiện khi chọn Loại thay đổi có tùy biến (không phải Khác) */}
                          {ecChangeCategory !== "Không thay đổi" && ecChangeCategory !== "Khác" && (
                            <div className="animate-in fade-in slide-in-from-left-1 duration-150">
                              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                {ecChangeCategory.includes("Khóa") 
                                  ? "Chi tiết khóa *" 
                                  : ecChangeCategory.includes("Tăng đơ") 
                                  ? "Chi tiết tăng đơ *" 
                                  : ecChangeCategory.includes("Kiểu bào") 
                                  ? "Chi tiết kiểu bào *" 
                                  : ecChangeCategory.includes("lacquer")
                                  ? "Chi tiết kỹ thuật mạ men *"
                                  : ecChangeCategory.includes("Cast")
                                  ? "Chi tiết khuôn đúc/ổ chấu *"
                                  : "Chi tiết kích thước dây HTJ *"}
                              </label>
                              <select
                                value={ecChangeDetail}
                                onChange={(e) => setEcChangeDetail(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-emerald-300 focus:border-[#00594c] rounded-lg text-xs font-semibold text-emerald-900 outline-none cursor-pointer shadow-2xs"
                              >
                                {(EC_CHANGE_REQUEST_OPTIONS[ecChangeCategory] || []).map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* QUY TẮC 1: NẾU CHỌN YÊU CẦU THAY ĐỔI = KHÁC -> HIỂN THỊ Ô NHẬP MÔ TẢ YÊU CẦU THAY ĐỔI */}
                        {otherChangeMode === "is_other" && (
                          <div className="animate-in fade-in slide-in-from-top-1 duration-150 pt-2 space-y-1">
                            <label className="block text-[11px] font-semibold text-gray-800">
                              Mô tả yêu cầu thay đổi <span className="text-red-500 font-bold">*</span>
                            </label>
                            <textarea
                              rows={3}
                              value={otherChangeDescription}
                              onChange={(e) => {
                                setOtherChangeDescription(e.target.value);
                                if (formError) setFormError("");
                              }}
                              placeholder="Nhập mô tả chi tiết yêu cầu thay đổi của bạn (ví dụ: thay đổi kích thước theo bản vẽ riêng, mẫu khóa đặc thù, đắp hoa văn riêng...)"
                              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#00594c] outline-none shadow-2xs ${
                                formError ? "border-red-500 ring-1 ring-red-400" : "border-emerald-300 focus:border-[#00594c]"
                              }`}
                            />
                            {formError && (
                              <p className="text-[11px] text-red-600 font-semibold">⚠️ {formError}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* PHẦN 3: SỐ LƯỢNG & CHECKBOX YÊU CẦU THAY ĐỔI KHÁC */}
                      <div className="pt-2 border-t border-gray-100 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Số lượng</label>
                          <input
                            type="number"
                            min="1"
                            value={singleQty}
                            onChange={(e) => setSingleQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-1 focus:ring-[#00594c] outline-none font-bold"
                          />
                        </div>

                        {/* QUY TẮC 2: CẤU HÌNH = KHÔNG ĐƯỢC PHÉP THAY ĐỔI -> ẨN NÚT CHECKBOX (otherChangeMode === 'hidden') */}
                        {/* QUY TẮC 1: NẾU ĐÃ CHỌN KHÁC Ở DROPDOWN TRÊN -> ẨN NÚT CHECKBOX ĐỂ TRÁNH DƯ THỪA (otherChangeMode === 'is_other') */}

                        {/* QUY TẮC 3: CẤU HÌNH = ĐƯỢC PHÉP THAY ĐỔI -> HIỂN THỊ NÚT CHECKBOX (KHÔNG BẮT BUỘC) */}
                        {otherChangeMode === "optional" && (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2.5 pt-1">
                              <input
                                type="checkbox"
                                id="hasOtherChangeSingle"
                                checked={hasOtherChange}
                                onChange={(e) => setHasOtherChange(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-[#00594c] focus:ring-[#00594c] cursor-pointer"
                              />
                              <label htmlFor="hasOtherChangeSingle" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
                                Yêu cầu thay đổi khác
                              </label>
                            </div>

                            {/* KHI TICK CHỌN: HIỂN THỊ TRƯỜNG NHẬP MÔ TẢ THAY ĐỔI */}
                            {hasOtherChange && (
                              <div className="animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                                <label className="block text-[11px] font-semibold text-gray-700">
                                  Mô tả thay đổi khác <span className="text-red-500 font-bold">*</span>
                                </label>
                                <textarea
                                  rows={3}
                                  value={otherChangeDescription}
                                  onChange={(e) => setOtherChangeDescription(e.target.value)}
                                  placeholder="Nhập mô tả chi tiết yêu cầu thay đổi khác (ví dụ: thay cast, đắp lacquer, thay màu dây, yêu cầu đặc biệt...)"
                                  className="w-full px-3 py-2 bg-white border border-emerald-300 focus:border-[#00594c] rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#00594c] outline-none shadow-2xs"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* QUY TẮC 4: CẤU HÌNH = BẮT BUỘC THAY ĐỔI -> HIỂN THỊ NÚT CHECKBOX (BẮT BUỘC) */}
                        {otherChangeMode === "required" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                              <div className="flex items-center space-x-2.5">
                                <input
                                  type="checkbox"
                                  id="hasOtherChangeSingleRequired"
                                  checked={true}
                                  readOnly
                                  className="h-4 w-4 rounded border-amber-400 text-[#00594c] focus:ring-[#00594c] cursor-not-allowed"
                                />
                                <label htmlFor="hasOtherChangeSingleRequired" className="text-xs font-bold text-amber-950 flex items-center select-none cursor-default">
                                  Yêu cầu thay đổi khác <span className="text-red-500 ml-1 font-bold">*</span>
                                </label>
                              </div>
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                Bắt buộc
                              </span>
                            </div>

                            {/* Ô MÔ TẢ LUÔN HIỂN THỊ VÀ BẮT BUỘC NHẬP */}
                            <div className="animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                              <label className="block text-[11px] font-semibold text-gray-700">
                                Mô tả thay đổi khác <span className="text-red-500 font-bold">*</span>
                              </label>
                              <textarea
                                rows={3}
                                value={otherChangeDescription}
                                onChange={(e) => {
                                  setOtherChangeDescription(e.target.value);
                                  if (formError) setFormError("");
                                }}
                                placeholder="Nhập mô tả chi tiết yêu cầu thay đổi khác bắt buộc cho loại thay đổi này..."
                                className={`w-full px-3 py-2 bg-white border rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-[#00594c] outline-none shadow-2xs ${
                                  formError ? "border-red-500 ring-1 ring-red-400" : "border-amber-300 focus:border-[#00594c]"
                                }`}
                              />
                              {formError && (
                                <p className="text-[11px] text-red-600 font-semibold">⚠️ {formError}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Row 6: Buttons Thêm vào danh sách & Thêm vào giỏ hàng */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleAddToDraftList}
                          className="w-full py-2.5 px-4 border border-[#00594c] text-[#00594c] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                        >
                          {addedToListSuccess ? "✓ Đã thêm vào danh sách!" : "Thêm vào danh sách"}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddStandardSingleToCart}
                          className="w-full py-2.5 px-4 bg-[#00594c] hover:bg-[#004737] text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer text-center"
                        >
                          {addedSuccess ? "✓ Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* CASE B2: SẢN PHẨM ĐƠN LẺ PHÂN BỔ DẢI NI */
                    <>
                      {/* Specs Bar (2 cột: Trọng lượng theo Lượng & Giá công làm tròn 5000đ) */}
                      <div className="grid grid-cols-2 gap-3 py-3 px-6 bg-[#f4f9f7] rounded-2xl border border-emerald-100 text-center items-center">
                        <div>
                          <div className="text-[11px] text-gray-500 font-medium">Trọng lượng</div>
                          <div className="text-base font-bold text-gray-900 mt-0.5 font-mono">
                            {Number(product.weight || 0).toFixed(4)} <span className="text-xs font-normal text-gray-500">Lượng</span>
                          </div>
                        </div>
                        <div className="border-l border-emerald-200/60">
                          <div className="text-[11px] text-gray-500 font-medium">Giá công</div>
                          <div className="text-base font-bold text-[#00594c] mt-0.5 font-mono">
                            {roundUp5k((product.wagePrice || 0) + (GOLD_COLOR_DELTAS[goldColor] || 0)).toLocaleString()}đ
                          </div>
                        </div>
                      </div>

                      {/* Cấu hình chung: Màu xi & Yêu cầu thay đổi */}
                      <div className="bg-[#f8faf9] p-3.5 rounded-2xl border border-gray-200/70 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Màu xi */}
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Màu xi:</label>
                            <select
                              value={goldColor}
                              onChange={(e) => setGoldColor(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
                            >
                              {product.availableGoldColors.map((color) => {
                                const delta = GOLD_COLOR_DELTAS[color] || 0;
                                return (
                                  <option key={color} value={color}>
                                    {color} {delta > 0 ? `(+${(delta / 1000).toLocaleString()}k)` : ""}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {/* Yêu cầu thay đổi */}
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Yêu cầu thay đổi:</label>
                            <select
                              value={changeRequest}
                              onChange={(e) => handleSelectChangeRequest(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-2xs cursor-pointer"
                            >
                              {(product.availableChangeRequests || [
                                "Không thay đổi",
                                "Cast",
                                "Đắp lacquer - móc máy",
                                "Thay kiểu bào ball",
                                "Thay Khóa"
                              ]).map((req) => (
                                <option key={req} value={req}>
                                  {req !== "Không thay đổi" ? `💎 ${req}` : req}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Nếu loại thay đổi có cấu hình Nhập chi tiết thay đổi */}
                        {matchedChangeTypeConfig?.hasTextInput && (
                          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 animate-in fade-in slide-in-from-top-1 duration-150">
                            <label className="block text-[11px] font-semibold text-blue-900 mb-1.5">
                              Mô tả thay đổi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={2}
                              value={changeRequestText}
                              onChange={(e) => setChangeRequestText(e.target.value)}
                              placeholder="Nhập mô tả thay đổi..."
                              className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 outline-none shadow-xs"
                            />
                          </div>
                        )}

                        {/* Nếu loại thay đổi có cấu hình Chọn chi tiết thay đổi */}
                        {matchedChangeTypeConfig?.hasCustomSelection && (
                          <div className="p-3 bg-[#f0f9f6] rounded-xl border border-emerald-200/90 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="block text-[11px] font-semibold text-[#00594c] mb-1.5">
                              {matchedChangeTypeConfig.customFieldLabel || "Nhóm kỹ thuật"}
                            </label>
                            <select
                              value={changeRequestDetail}
                              onChange={(e) => setChangeRequestDetail(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-xs cursor-pointer"
                            >
                              <option value="">Chọn {matchedChangeTypeConfig.customFieldLabel || "nhóm kỹ thuật"}</option>
                              {(matchedChangeTypeConfig.customOptions || []).map((opt) => (
                                <option key={opt} value={opt}>
                                  💎 {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Fallback legacy config */}
                        {!matchedChangeTypeConfig && CHANGE_REQUEST_CONFIGS[changeRequest] && (
                          <div className="p-3 bg-[#f0f9f6] rounded-xl border border-emerald-200/90 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="block text-[11px] font-semibold text-[#00594c] mb-1.5">
                              {CHANGE_REQUEST_CONFIGS[changeRequest].subLabel}
                            </label>
                            <select
                              value={changeRequestDetail}
                              onChange={(e) => setChangeRequestDetail(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-gray-800 focus:ring-2 focus:ring-[#00594c] outline-none shadow-xs cursor-pointer"
                            >
                              {CHANGE_REQUEST_CONFIGS[changeRequest].options.map((opt) => (
                                <option key={opt} value={opt}>
                                  💎 {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                  {/* Phân bổ theo Màu đá & Dải Ni */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                        <Layers className="h-4 w-4 mr-1.5 text-[#00594c]" />
                        Phân bổ Ni theo màu đá
                      </div>
                      <button
                        type="button"
                        onClick={addStoneRow}
                        className="inline-flex items-center text-xs font-bold text-[#00594c] hover:text-[#004737] hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5 mr-0.5" />
                        Thêm màu đá khác
                      </button>
                    </div>

                    {/* List of Stone Rows */}
                    <div className="space-y-3">
                      {stoneRows.map((row) => {
                        const rowTotal = Object.values(row.quantities || {}).reduce((s, q) => s + (parseInt(q) || 0), 0);
                        return (
                          <div
                            key={row.id}
                            className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] font-semibold text-gray-500">Màu đá:</span>
                                <select
                                  value={row.stoneColor}
                                  onChange={(e) => changeRowColor(row.id, e.target.value)}
                                  className="px-2.5 py-1 bg-emerald-50/60 border border-emerald-300 rounded-lg text-xs font-bold text-[#00594c] outline-none"
                                >
                                  {(product.availableStoneColors || ["Trắng"]).map((color) => {
                                    const d = STONE_COLOR_DELTAS[color] || 0;
                                    return (
                                      <option key={color} value={color}>
                                        {color} {d > 0 ? `(+${(d / 1000).toLocaleString()}k)` : ""}
                                      </option>
                                    );
                                  })}
                                </select>
                                {rowTotal > 0 && (
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                    {rowTotal} chiếc
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center space-x-1.5">
                                {/* Bộ điều khiển điền nhanh số lượng tùy chỉnh */}
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-xs">
                                  <span className="text-[10px] font-medium text-gray-600 px-1 select-none">Mỗi Ni:</span>
                                  <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden h-5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = row.fillQty || 1;
                                        updateRowFillQty(row.id, Math.max(1, cur - 1));
                                      }}
                                      className="px-1 text-gray-500 hover:bg-gray-100 text-[10px] font-bold select-none"
                                      title="Giảm số lượng"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      max="999"
                                      value={row.fillQty ?? 1}
                                      onChange={(e) => updateRowFillQty(row.id, e.target.value)}
                                      className="w-6 text-center text-[11px] font-bold text-gray-900 bg-transparent outline-none p-0"
                                      title="Nhập số lượng cho mỗi Ni"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = row.fillQty || 1;
                                        updateRowFillQty(row.id, cur + 1);
                                      }}
                                      className="px-1 text-gray-500 hover:bg-gray-100 text-[10px] font-bold select-none"
                                      title="Tăng số lượng"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => quickFillRow(row.id, row.fillQty || 1)}
                                    className="ml-1 px-2 py-0.5 bg-[#00594c] hover:bg-[#004737] text-white text-[10px] font-bold rounded transition-colors"
                                    title="Áp dụng số lượng này cho tất cả Ni"
                                  >
                                    Áp dụng
                                  </button>
                                </div>

                                {rowTotal > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => clearRow(row.id)}
                                    className="text-[10px] text-gray-400 hover:text-gray-700 font-medium px-1.5 py-0.5 hover:bg-gray-100 rounded transition-colors"
                                    title="Đặt lại số lượng về 0"
                                  >
                                    Xóa
                                  </button>
                                )}

                                {stoneRows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeStoneRow(row.id)}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                                    title="Xóa dòng màu đá này"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Ni Sizes Grid */}
                            <div>
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {(product.availableNiSizes || []).map((size) => {
                                  const currentQty = row.quantities[size] || 0;
                                  const sizeDelta = getSizeDelta(size);
                                  return (
                                    <div
                                      key={size}
                                      className={`p-1.5 rounded-xl border text-center transition-all ${
                                        currentQty > 0
                                          ? "bg-emerald-50 border-[#00594c] ring-1 ring-emerald-500/20 shadow-xs"
                                          : "bg-gray-50/60 border-gray-200 hover:border-gray-300"
                                      }`}
                                    >
                                      <div className="flex items-center justify-center space-x-0.5">
                                        <span className={`text-[10px] font-bold uppercase tracking-tight ${
                                          currentQty > 0 ? "text-[#00594c]" : "text-gray-500"
                                        }`}>
                                          Ni {size}
                                        </span>
                                        {sizeDelta > 0 && (
                                          <span className="text-[8px] font-black text-amber-700 bg-amber-100/90 px-1 py-0.2 rounded" title="Phụ phí size lớn">
                                            +{sizeDelta / 1000}k
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-center mt-1 space-x-0.5">
                                        <button
                                          type="button"
                                          onClick={() => updateRowQty(row.id, size, currentQty - 1)}
                                          className="h-5 w-5 rounded bg-white hover:bg-gray-200 text-gray-600 border border-gray-200 flex items-center justify-center text-[10px] font-bold"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          value={currentQty === 0 ? "" : currentQty}
                                          placeholder="0"
                                          onChange={(e) => updateRowQty(row.id, size, e.target.value)}
                                          className="w-7 text-center text-xs font-black text-gray-900 bg-transparent outline-none p-0"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => updateRowQty(row.id, size, currentQty + 1)}
                                          className="h-5 w-5 rounded bg-[#00594c] hover:bg-[#004737] text-white flex items-center justify-center text-[10px] font-bold"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ghi chú trên sản phẩm */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Ghi chú trên sản phẩm
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="VD: Đóng túi theo từng màu đá, khắc mã riêng trên sản phẩm..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#00594c]"
                    />
                  </div>

                  {/* Summary Card for Wholesale */}
                  <div className="p-4 bg-[#f0f7f4] border border-emerald-200/90 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-200/60">
                      <span className="font-bold text-sm text-gray-900 tracking-tight">Tạm tính:</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        totalWholesaleQty > 0
                          ? "bg-emerald-100 text-[#00594c]"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {totalWholesaleQty > 0
                          ? `${totalWholesaleQty} Sản phẩm (${stoneRows.length} Màu)`
                          : "Chưa chọn số lượng"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 font-medium">Tổng trọng lượng:</div>
                        <div className="text-sm font-bold text-gray-900 font-mono mt-0.5">
                          {totalWholesaleWeight.toFixed(4)} Lượng
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 font-medium">Tổng tiền công:</div>
                        <div className="text-sm font-black text-[#00594c] font-mono mt-0.5">
                          {roundUp5k(totalWholesaleWage).toLocaleString()}đ
                        </div>
                      </div>
                    </div>

                    {/* Phụ phí tùy biến (+Δ) nếu có */}
                    {totalSurcharge > 0 && (
                      <div className="text-[11px] text-gray-500 pt-1.5 border-t border-emerald-200/60 flex items-center justify-between">
                        <span>Đã gồm phụ phí tùy biến (+Δ):</span>
                        <span className="font-semibold text-amber-700">+{totalSurcharge.toLocaleString()}đ</span>
                      </div>
                    )}

                    <button
                      onClick={handleAddToCart}
                      disabled={totalWholesaleQty === 0}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${
                        addedSuccess
                          ? "bg-emerald-600 text-white"
                          : totalWholesaleQty === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#00594c] hover:bg-[#004737] text-white active:scale-98 shadow-md"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Đã thêm đơn sỉ {totalWholesaleQty} món vào giỏ hàng!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            {totalWholesaleQty > 0
                              ? `Thêm ${totalWholesaleQty} sản phẩm vào giỏ hàng`
                              : "Vui lòng chọn số lượng Ni để lên đơn"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

            </div>

          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* STICKY QUICK-ORDER BAR (TỐI ƯU TRẢI NGHIỆM IPAD & MOBILE)        */}
      {/* ================================================================= */}
      {!product.isStandardSingle && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-3 px-4 sm:px-6 lg:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-gray-900 truncate">
                  {product.isSet 
                    ? (product.isPair 
                        ? `${totalSetOrderQty} Cặp (${totalSetItemCount} chiếc)` 
                        : `${totalSetOrderQty} Bộ (${totalSetItemCount} món)`)
                    : `${totalWholesaleQty} Sản phẩm`}
                </span>
                <span className="text-gray-300">|</span>
                <span className="font-mono text-gray-600 font-semibold truncate">
                  {product.isSet 
                    ? `${totalSetWeight.toFixed(4)} lượng` 
                    : `${totalWholesaleWeight.toFixed(4)} lượng`}
                </span>
              </div>
              <div className="text-sm font-black text-[#00594c] font-mono leading-tight mt-0.5">
                {product.isSet 
                  ? `${roundUp5k(totalSetWage).toLocaleString()}đ` 
                  : `${roundUp5k(totalWholesaleWage).toLocaleString()}đ`}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.isSet ? totalSetOrderQty === 0 : totalWholesaleQty === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 shrink-0 transition-all shadow-md active:scale-95 cursor-pointer ${
                addedSuccess
                  ? "bg-emerald-600 text-white"
                  : (product.isSet ? totalSetOrderQty === 0 : totalWholesaleQty === 0)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#00594c] hover:bg-[#004737] text-white"
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã thêm!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Thêm vào giỏ</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* LIGHTBOX MODAL: Xem ảnh kích thước đầy đủ                        */}
      {/* ================================================================= */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng [X] */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-full transition-all shadow-xs"
              title="Đóng xem ảnh"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Header thông tin sản phẩm */}
            <div className="text-center mb-4 pr-10">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.categoryName}
              </span>
              <h3 className="font-mono text-lg font-black text-gray-900 mt-1">
                {product.productCode}
              </h3>
            </div>

            {/* Khung hiển thị ảnh lớn chất lượng cao */}
            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
              <JewelryVisual type={activePreviewType} className="w-full h-[65vh] object-contain" />
            </div>
            
            <div className="text-xs text-gray-400 mt-3 text-center">
              Bấm ra ngoài hoặc nút [✕] để đóng
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
