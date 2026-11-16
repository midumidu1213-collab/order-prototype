"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Barcode,
  Search,
  Check,
  CheckCircle2,
  Printer,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Boxes,
  X,
  ExternalLink,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  ArrowLeftRight,
  CheckCheck,
  RotateCcw,
  ListFilter,
  ArrowLeft,
  Filter,
  Scale,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  ShieldCheck
} from "lucide-react";
import InventorySidebar from "@/components/inventory/InventorySidebar";
import ColumnFilterPopover from "@/components/orders/ColumnFilterPopover";
import ProductionBagPrintModal from "@/components/inventory/ProductionBagPrintModal";
import {
  MOCK_REPROCESS_LOTS,
  MOCK_NEW_SO_TARGETS
} from "@/data/inventoryMockData";

// Dữ liệu mẫu 8 Series chi tiết của Lô cũ SO-260800063 chuẩn theo UI Cấp Thành Phẩm
const MOCK_SERIES_LIST = [
  { id: "0123456A-01", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01305, totalWeight: 0.01345 },
  { id: "0123456A-02", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01305, totalWeight: 0.01345 },
  { id: "0123456A-03", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01305, totalWeight: 0.01345 },
  { id: "0123456A-04", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01306, totalWeight: 0.01346 },
  { id: "0123456A-05", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01306, totalWeight: 0.01346 },
  { id: "0123456A-06", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01305, totalWeight: 0.01345 },
  { id: "0123456A-07", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01307, totalWeight: 0.01347 },
  { id: "0123456A-08", stampCode: "24", stoneWeight: 0.00040, goldWeight: 0.01305, totalWeight: 0.01345 }
];

export default function FgIssueServePage() {
  const [newSos, setNewSos] = useState(MOCK_NEW_SO_TARGETS);
  const [oldLots, setOldLots] = useState(MOCK_REPROCESS_LOTS);

  // Chế độ xem: 'list' (Danh Sách Chờ Serve FG) hoặc 'transfer' (Điều Phối Chuyển Component Bag)
  const [viewMode, setViewMode] = useState("list");

  // Kịch bản Cấp Thành Phẩm: "series" (Có series) | "no-series" (Chưa có series)
  const [serveScenario, setServeScenario] = useState("series");
  const [isSection1Collapsed, setIsSection1Collapsed] = useState(false);

  // Kịch bản A: Lô có series
  const [selectedSeriesCodes, setSelectedSeriesCodes] = useState(["0123456A-01", "0123456A-02"]);
  const [seriesScanInput, setSeriesScanInput] = useState("");

  // Kịch bản B: Lô chưa có series
  const [scaleWeight, setScaleWeight] = useState(0.02690);
  const [isScaleReading, setIsScaleReading] = useState(false);
  const [stampRows, setStampRows] = useState([
    { id: 1, stampCode: "18 (10K / 416)", stoneWeightPerPcs: 0.00040, qty: 2 }
  ]);

  // Tab lọc danh sách chờ serve FG: 'all' | 'waiting' | 'served'
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  // Bag được chọn hiện tại để điều phối
  const [selectedNewBagCode, setSelectedNewBagCode] = useState("SO-261024-001");
  const [selectedOldBagCode, setSelectedOldBagCode] = useState("SO-260800061");

  // Trạng thái đã chuyển linh kiện giữa 2 Bag (true/false cho từng Bag mới)
  const [transferredBags, setTransferredBags] = useState({
    "SO-261024-001": true,
    "SO-261024-002": true
  });

  // Modal in nhãn Bag mới
  const [printModalTarget, setPrintModalTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const barcodeInputRef = useRef(null);

  // Quản lý bộ lọc / sắp xếp trực tiếp trên từng cột (Tham khảo chuẩn DS Đơn hàng ERP - 14 cột chuẩn chỉ)
  const [columnFilters, setColumnFilters] = useState({
    expectedOldBagCode: { sort: null, selectedValues: null, searchQuery: "" },
    originalSoCode: { sort: null, selectedValues: null, searchQuery: "" },
    oldCustomer: { sort: null, selectedValues: null, searchQuery: "" },
    itemCode: { sort: null, selectedValues: null, searchQuery: "" },
    category: { sort: null, selectedValues: null, searchQuery: "" },
    metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
    stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
    totalWeight: { sort: null, selectedValues: null, searchQuery: "" },
    newBagCode: { sort: null, selectedValues: null, searchQuery: "" },
    soCode: { sort: null, selectedValues: null, searchQuery: "" },
    customerName: { sort: null, selectedValues: null, searchQuery: "" },
    serveStatus: { sort: null, selectedValues: null, searchQuery: "" }
  });

  // Cột nào đang mở Popover lọc
  const [activeFilterColKey, setActiveFilterColKey] = useState(null);

  // Bắt query param từ URL nếu có (từ trang Quản lý đơn hoặc kho CXLL điều hướng sang)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const targetParam = params.get("targetBag");
      const oldParam = params.get("oldBag");
      const modeParam = params.get("mode");
      if (targetParam) setSelectedNewBagCode(targetParam);
      if (oldParam) setSelectedOldBagCode(oldParam);
      if (modeParam === "transfer" || targetParam) {
        setViewMode("transfer");
      }
    }
  }, []);

  // Âm thanh Beep mô phỏng súng quét kho
  const playScanBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback
    }
  };

  // Copy helper
  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Đối tượng SO Đích đang chọn
  const selectedNewBag = useMemo(() => {
    return newSos.find((s) => s.newBagCode === selectedNewBagCode) || newSos[0];
  }, [newSos, selectedNewBagCode]);

  // Đối tượng Bag Nguồn (Lô cũ CXLL) tương ứng
  const selectedOldLot = useMemo(() => {
    if (!selectedOldBagCode && selectedNewBag) {
      return oldLots.find((l) => l.bagCode === selectedNewBag.expectedOldBagCode) || oldLots[0];
    }
    return oldLots.find((l) => l.bagCode === selectedOldBagCode) || oldLots[0];
  }, [oldLots, selectedOldBagCode, selectedNewBag]);

  // Kiểm tra trạng thái đã chuyển linh kiện của Bag hiện tại
  const isCurrentTransferred = Boolean(transferredBags[selectedNewBagCode]);

  // Kiểm tra trạng thái đã đóng bag / đã hoàn tất
  const isCurrentServed = selectedNewBag?.serveStatus === "Đã chuyển sang bag mới";

  // Thao tác Điều phối: [Chuyển tất cả] sang Bag mới
  const handleTransferAll = () => {
    playScanBeep();
    setTransferredBags((prev) => ({
      ...prev,
      [selectedNewBagCode]: true
    }));
    setToastMessage({
      type: "info",
      text: `Đã phân bổ toàn bộ linh kiện từ ${selectedOldLot.bagCode} sang ${selectedNewBag.newBagCode}. Vui lòng đối soát bảng trọng lượng trước khi xác nhận cấp!`
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Thao tác Điều phối: [Trả tất cả] về Bag cũ
  const handleRevertAll = () => {
    if (isCurrentServed) {
      alert("Bag này đã được xác nhận cấp và đóng vĩnh viễn, không thể hoàn tác!");
      return;
    }
    playScanBeep();
    setTransferredBags((prev) => ({
      ...prev,
      [selectedNewBagCode]: false
    }));
    setToastMessage({
      type: "warning",
      text: `Đã hoàn trả toàn bộ linh kiện về Bag nguồn ${selectedOldLot.bagCode}.`
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // XÁC NHẬN CẤP VÀ ĐÓNG BAG CŨ (Hành động chốt)
  const handleConfirmServeAndCloseBag = () => {
    if (!isCurrentTransferred) {
      alert("Vui lòng bấm [Chuyển tất cả] để phân bổ linh kiện sang Bag mới trước khi xác nhận cấp!");
      return;
    }

    playScanBeep();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    // 1. Cập nhật trạng thái Bag mới sang 'Đã chuyển sang bag mới'
    setNewSos((prev) =>
      prev.map((s) =>
        s.newBagCode === selectedNewBagCode
          ? {
            ...s,
            serveStatus: "Đã chuyển sang bag mới",
            status: "Đã chuyển sang bag mới",
            wc: "WC-Stamping",
            isScanned: true,
            scannedDate: "29/10/2026",
            scannedTime: timeStr
          }
          : s
      )
    );

    // 2. Cập nhật Lô cũ trong Kho CXLL sang 'Đã chuyển sang bag mới / Đã đóng Bag'
    setOldLots((prev) =>
      prev.map((l) =>
        l.bagCode === selectedOldLot.bagCode
          ? {
            ...l,
            isClosed: true,
            isAlreadyServed: true,
            status: "Đã chuyển sang bag mới",
            serveStatus: "Đã chuyển sang bag mới",
            labelStatus: "Đã hủy nhãn cũ"
          }
          : l
      )
    );

    // 3. Thông báo thành công và mở Modal In Tem
    setToastMessage({
      type: "success",
      text: `Xác nhận cấp thành phẩm thành công! Đã đóng Bag cũ ${selectedOldLot.bagCode} và chuyển sang Bag mới ${selectedNewBag.newBagCode}.`
    });
    setTimeout(() => setToastMessage(null), 4000);

    setTimeout(() => {
      setPrintModalTarget(selectedNewBagCode);
    }, 400);
  };

  // Mở màn hình Điều phối cho một dòng Bag cụ thể
  const handleOpenTransferForBag = (so) => {
    playScanBeep();
    setSelectedNewBagCode(so.newBagCode);
    if (so.expectedOldBagCode) {
      setSelectedOldBagCode(so.expectedOldBagCode);
    }
    setViewMode("transfer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý quét qua Barcode Input
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const code = barcodeInput.trim().toUpperCase();

    // Tìm trong danh sách Bag đích mới
    const matchedNew = newSos.find((s) => s.newBagCode.toUpperCase() === code);
    if (matchedNew) {
      playScanBeep();
      setSelectedNewBagCode(matchedNew.newBagCode);
      if (matchedNew.expectedOldBagCode) {
        setSelectedOldBagCode(matchedNew.expectedOldBagCode);
      }
      setViewMode("transfer");
      setBarcodeInput("");
      return;
    }

    // Tìm trong danh sách Lô cũ CXLL
    const matchedOld = oldLots.find(
      (l) => l.bagCode.toUpperCase() === code || l.labelBarcode?.toUpperCase() === code
    );
    if (matchedOld) {
      playScanBeep();
      setSelectedOldBagCode(matchedOld.bagCode);
      if (matchedOld.targetNewBagCode) {
        setSelectedNewBagCode(matchedOld.targetNewBagCode);
      }
      setViewMode("transfer");
      setBarcodeInput("");
      return;
    }

    alert(`Không tìm thấy Bag nào khớp với mã: ${code}`);
  };

  // Helper xử lý Kịch bản A (Chọn Series)
  const handleToggleSeries = (id) => {
    if (selectedSeriesCodes.includes(id)) {
      playScanBeep();
      setSelectedSeriesCodes((prev) => prev.filter((c) => c !== id));
    } else {
      if (selectedSeriesCodes.length >= 2) {
        alert("Đã đủ số lượng 2 PCS cần chọn theo KHSX!");
        return;
      }
      playScanBeep();
      setSelectedSeriesCodes((prev) => [...prev, id]);
    }
  };

  const handleScanSeriesBarcode = (e) => {
    e.preventDefault();
    if (!seriesScanInput.trim()) return;
    const query = seriesScanInput.trim().toUpperCase();
    const found = MOCK_SERIES_LIST.find((s) => s.id.toUpperCase() === query);
    if (!found) {
      alert(`Không tìm thấy mã Seri: ${query}`);
      return;
    }
    if (selectedSeriesCodes.includes(found.id)) {
      alert(`Mã Seri ${found.id} đã được chọn!`);
      setSeriesScanInput("");
      return;
    }
    if (selectedSeriesCodes.length >= 2) {
      alert("Đã đủ số lượng 2 PCS cần chọn!");
      setSeriesScanInput("");
      return;
    }
    playScanBeep();
    setSelectedSeriesCodes((prev) => [...prev, found.id]);
    setSeriesScanInput("");
  };

  // Helper xử lý Kịch bản B (Cân lại & Chọn Stamp)
  const handleReadScale = () => {
    setIsScaleReading(true);
    playScanBeep();
    setTimeout(() => {
      setScaleWeight(0.02690);
      setIsScaleReading(false);
      setToastMessage({
        type: "success",
        text: "Đã đọc thành công số cân điện tử FQC: 0.02690 Lượng!"
      });
      setTimeout(() => setToastMessage(null), 3000);
    }, 450);
  };

  const handleAddStampRow = () => {
    playScanBeep();
    setStampRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        stampCode: "20 (14K / 585)",
        stoneWeightPerPcs: 0.00040,
        qty: 1
      }
    ]);
  };

  const handleRemoveStampRow = (id) => {
    if (stampRows.length <= 1) {
      alert("Phải có ít nhất 1 dòng Stamp!");
      return;
    }
    playScanBeep();
    setStampRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateStampRow = (id, field, value) => {
    setStampRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Tính toán Kịch bản A
  const currentSelectedSeries = useMemo(() => {
    return MOCK_SERIES_LIST.filter((s) => selectedSeriesCodes.includes(s.id));
  }, [selectedSeriesCodes]);

  const calcSeriesStoneWeight = useMemo(() => {
    return currentSelectedSeries.reduce((acc, s) => acc + s.stoneWeight, 0);
  }, [currentSelectedSeries]);

  const calcSeriesGoldWeight = useMemo(() => {
    return currentSelectedSeries.reduce((acc, s) => acc + s.goldWeight, 0);
  }, [currentSelectedSeries]);

  const calcSeriesTotalWeight = useMemo(() => {
    return currentSelectedSeries.reduce((acc, s) => acc + s.totalWeight, 0);
  }, [currentSelectedSeries]);

  // Tính toán Kịch bản B
  const totalStampStoneWeight = useMemo(() => {
    return stampRows.reduce(
      (acc, r) => acc + (parseFloat(r.stoneWeightPerPcs) || 0) * (parseInt(r.qty) || 0),
      0
    );
  }, [stampRows]);

  const totalStampQty = useMemo(() => {
    return stampRows.reduce((acc, r) => acc + (parseInt(r.qty) || 0), 0);
  }, [stampRows]);

  const calculatedMetalWeightB = useMemo(() => {
    const total = parseFloat(scaleWeight) || 0;
    return Math.max(0, total - totalStampStoneWeight);
  }, [scaleWeight, totalStampStoneWeight]);

  // Thông số chuyển đang kích hoạt (phản ánh sang Khối 2 & Khối 3)
  const activeTransTotal = serveScenario === "series" ? calcSeriesTotalWeight : (parseFloat(scaleWeight) || 0.02690);
  const activeTransStone = serveScenario === "series" ? calcSeriesStoneWeight : totalStampStoneWeight;
  const activeTransMetal = serveScenario === "series" ? calcSeriesGoldWeight : calculatedMetalWeightB;

  // 1. Unique Values Map cho từng cột để truyền vào ColumnFilterPopover
  const uniqueValuesMap = useMemo(() => {
    return {
      expectedOldBagCode: Array.from(new Set(newSos.map((s) => s.expectedOldBagCode))).sort(),
      originalSoCode: Array.from(new Set(newSos.map((s) => s.originalSoCode || "SO123456"))).sort(),
      oldCustomer: Array.from(new Set(newSos.map((s) => s.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"))).sort(),
      itemCode: Array.from(new Set(newSos.map((s) => s.itemCode))).sort(),
      category: Array.from(new Set(newSos.map((s) => s.category || s.itemName))).sort(),
      metalWeight: Array.from(new Set(newSos.map((s) => s.metalWeight.toFixed(4)))).sort(),
      stoneWeight: Array.from(new Set(newSos.map((s) => (s.stoneWeight || 0).toFixed(4)))).sort(),
      totalWeight: Array.from(new Set(newSos.map((s) => s.totalWeight.toFixed(4)))).sort(),
      newBagCode: Array.from(new Set(newSos.map((s) => s.newBagCode))).sort(),
      soCode: Array.from(new Set(newSos.map((s) => s.soCode))).sort(),
      customerName: Array.from(new Set(newSos.map((s) => s.customerName))).sort(),
      serveStatus: Array.from(new Set(newSos.map((s) => s.serveStatus))).sort()
    };
  }, [newSos]);

  // Kiểm tra cột có đang áp dụng lọc/sắp xếp
  const isColumnFiltered = (colKey) => {
    const f = columnFilters[colKey];
    if (!f) return false;
    return Boolean(f.sort || f.searchQuery || f.selectedValues);
  };

  // Có bất kỳ bộ lọc nào đang kích hoạt
  const isAnyFilterActive = useMemo(() => {
    if (searchQuery.trim()) return true;
    if (activeTab !== "all") return true;
    return Object.keys(columnFilters).some((k) => isColumnFiltered(k));
  }, [searchQuery, activeTab, columnFilters]);

  // Áp dụng bộ lọc cho một cột
  const handleApplyColumnFilter = (colKey, filterData) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: {
        ...prev[colKey],
        ...filterData
      }
    }));
    setActiveFilterColKey(null);
  };

  // Xóa bộ lọc cho một cột
  const handleClearColumnFilter = (colKey) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: { sort: null, selectedValues: null, searchQuery: "" }
    }));
    setActiveFilterColKey(null);
  };

  // Đặt lại toàn bộ bộ lọc
  const handleResetAllFilters = () => {
    setColumnFilters({
      expectedOldBagCode: { sort: null, selectedValues: null, searchQuery: "" },
      originalSoCode: { sort: null, selectedValues: null, searchQuery: "" },
      oldCustomer: { sort: null, selectedValues: null, searchQuery: "" },
      itemCode: { sort: null, selectedValues: null, searchQuery: "" },
      category: { sort: null, selectedValues: null, searchQuery: "" },
      metalWeight: { sort: null, selectedValues: null, searchQuery: "" },
      stoneWeight: { sort: null, selectedValues: null, searchQuery: "" },
      totalWeight: { sort: null, selectedValues: null, searchQuery: "" },
      newBagCode: { sort: null, selectedValues: null, searchQuery: "" },
      soCode: { sort: null, selectedValues: null, searchQuery: "" },
      customerName: { sort: null, selectedValues: null, searchQuery: "" },
      serveStatus: { sort: null, selectedValues: null, searchQuery: "" }
    });
    setSearchQuery("");
    setActiveTab("all");
    setActiveFilterColKey(null);
  };

  // Danh sách lọc Bag mới cho bảng chờ Serve FG với đầy đủ Filter / Sort / Search theo cột
  const filteredNewSos = useMemo(() => {
    let list = [...newSos];

    // 1. Tab trạng thái
    if (activeTab === "waiting") {
      list = list.filter((s) => s.serveStatus !== "Đã chuyển sang bag mới");
    } else if (activeTab === "served") {
      list = list.filter((s) => s.serveStatus === "Đã chuyển sang bag mới");
    }

    // 2. Global Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.newBagCode.toLowerCase().includes(q) ||
          s.soCode.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.expectedOldBagCode.toLowerCase().includes(q) ||
          (s.originalSoCode && s.originalSoCode.toLowerCase().includes(q)) ||
          (s.oldCustomer && s.oldCustomer.toLowerCase().includes(q)) ||
          (s.itemCode && s.itemCode.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q)) ||
          s.itemName.toLowerCase().includes(q)
      );
    }

    // 3. Lọc theo từng cột (Column Filters)
    Object.keys(columnFilters).forEach((colKey) => {
      const f = columnFilters[colKey];
      if (!f) return;

      // Filter theo SelectedValues (checkbox list)
      if (f.selectedValues instanceof Set) {
        list = list.filter((item) => {
          let val = "";
          if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = (item.stoneWeight || 0).toFixed(4);
          else if (colKey === "totalWeight") val = item.totalWeight.toFixed(4);
          else if (colKey === "originalSoCode") val = item.originalSoCode || "SO123456";
          else if (colKey === "oldCustomer") val = item.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
          else if (colKey === "category") val = item.category || item.itemName;
          else val = String(item[colKey] || "");

          return f.selectedValues.has(val);
        });
      }

      // Filter theo SearchQuery trong cột
      if (f.searchQuery && f.searchQuery.trim()) {
        const sq = f.searchQuery.toLowerCase().trim();
        list = list.filter((item) => {
          let val = "";
          if (colKey === "metalWeight") val = item.metalWeight.toFixed(4);
          else if (colKey === "stoneWeight") val = (item.stoneWeight || 0).toFixed(4);
          else if (colKey === "totalWeight") val = item.totalWeight.toFixed(4);
          else if (colKey === "originalSoCode") val = item.originalSoCode || "SO123456";
          else if (colKey === "oldCustomer") val = item.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
          else if (colKey === "category") val = item.category || item.itemName;
          else val = String(item[colKey] || "");

          return val.toLowerCase().includes(sq);
        });
      }
    });

    // 4. Sắp xếp (Sort) theo cột đang có sort
    const activeSortColKey = Object.keys(columnFilters).find((k) => columnFilters[k]?.sort);
    if (activeSortColKey) {
      const sortType = columnFilters[activeSortColKey].sort; // 'asc' | 'desc'
      list.sort((a, b) => {
        let aVal = a[activeSortColKey];
        let bVal = b[activeSortColKey];

        if (activeSortColKey === "category") {
          aVal = a.category || a.itemName;
          bVal = b.category || b.itemName;
        } else if (activeSortColKey === "oldCustomer") {
          aVal = a.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
          bVal = b.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành";
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortType === "asc" ? aVal - bVal : bVal - aVal;
        }

        aVal = String(aVal || "");
        bVal = String(bVal || "");
        return sortType === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    return list;
  }, [newSos, activeTab, searchQuery, columnFilters]);

  // Thông số trọng lượng mẫu chuẩn
  const currentTotalWeight = selectedOldLot?.totalWeight ?? 0.5045;
  const currentStoneWeight = selectedOldLot?.stoneWeight ?? 0.0150;
  const currentMetalWeight = selectedOldLot?.metalWeight ?? (currentTotalWeight - currentStoneWeight);

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans antialiased text-slate-800 overflow-hidden">
      {/* 1. Sidebar Kho Thành Phẩm */}
      <InventorySidebar />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar Navigation */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          {viewMode === "transfer" ? (
            <>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Quay lại Danh sách</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600 font-medium">Kho Chờ Xử Lý Lại (CXLL)</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-700 font-semibold">Cấp Thành Phẩm:</span>
                <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedNewBag?.newBagCode || "SO-261024-003"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleConfirmServeAndCloseBag}
                  className="px-4 py-2 rounded-lg bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Xác Nhận Chuyển & Đóng Bag Cũ</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Link href="/inventory/reprocess" className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1">
                  <span>← Kho Chờ Xử Lý Lại (CXLL)</span>
                </Link>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="font-bold text-slate-800">
                  Danh Sách Chờ Serve Finish Good (FG)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setViewMode("transfer")}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                  <span>Mở Màn Hình Cấp Thành Phẩm</span>
                </button>

                <Link
                  href="/orders/11"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                  title="Mở chi tiết đơn hàng SO2608011 của QLĐH"
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Đơn Hàng SO2608011</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </Link>

                <Link
                  href="/orders/warehouse-picker"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold shadow-2xs transition-colors"
                  title="Xem màn hình QLĐH gán phôi và tách 2 luồng"
                >
                  <Layers className="h-3.5 w-3.5 text-teal-700" />
                  <span>Luồng QLĐH Phân Bổ</span>
                </Link>
              </div>
            </>
          )}
        </header>

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between transition-all ${toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : toastMessage.type === "warning"
                ? "bg-amber-500 text-white"
                : "bg-teal-700 text-white"
            }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: MÀN HÌNH DANH SÁCH CHỜ SERVE FG (THEO ẢNH 2 & 3)   */}
        {/* ========================================================= */}
        {viewMode === "list" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            {/* Header Thống Kê & Quét Nhanh */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-700" />
                  <span>Danh Sách Chờ Serve Finish Good (FG)</span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý chuyển đổi lô phôi từ Kho CXLL sang Bag mới cho đơn hàng làm mới (Routing fix)
                </p>
              </div>

              {/* Ô Quét Barcode Nhanh */}
              <form onSubmit={handleBarcodeSubmit} className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Barcode className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Quét mã Bag mới / Lô cũ..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  Cấp nhanh
                </button>
              </form>
            </div>

            {/* Ô TÌM KIẾM TOÀN CỤC NẰM Ở HÀNG TRÊN (THEO ĐÚNG MŨI TÊN ĐỎ ẢNH 3 & ẢNH 2) */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mã Bag mới, mã SO, khách hàng, mã lô cũ, mã SO cũ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs shadow-2xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="px-3 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Xóa tất cả các điều kiện lọc và tìm kiếm"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Xóa lọc</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="p-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Tải lại danh sách"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bảng Danh Sách Chuẩn Hóa Với ColumnFilterPopover Theo Ảnh 2 & Ảnh 3 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Tab trạng thái */}
              <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${activeTab === "all" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Tất cả ({newSos.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("waiting")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${activeTab === "waiting" ? "bg-white text-amber-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Chờ chuyển bag ({newSos.filter((s) => s.serveStatus !== "Đã chuyển sang bag mới").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("served")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${activeTab === "served" ? "bg-white text-emerald-900 font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Đã chuyển ({newSos.filter((s) => s.serveStatus === "Đã chuyển sang bag mới").length})
                  </button>
                </div>

                {/* Thông báo kết quả lọc */}
                <div className="text-xs text-slate-500">
                  Đang hiển thị <b>{filteredNewSos.length}</b> / {newSos.length} Bag
                </div>
              </div>

              {/* Bảng Dữ Liệu: Hỗ trợ Filter/Sort/Search Theo Từng Cột (Theo Ảnh 2 & 3) */}
              <div className="overflow-x-auto min-h-[420px]">
                <table className="min-w-[1600px] w-full text-xs text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px] select-none">
                    <tr>
                      {/* 1. STT */}
                      <th className="py-2.5 px-3 w-12 text-center font-bold text-slate-800">STT</th>

                      {/* 2. MÃ LÔ MỚI (Đưa lên trước theo chỉ đạo Chị đẹp) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span className="text-teal-900 font-bold">MÃ LÔ MỚI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "newBagCode" ? null : "newBagCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("newBagCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã Lô Mới"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("newBagCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "newBagCode" && (
                          <ColumnFilterPopover
                            columnKey="newBagCode"
                            columnTitle="Mã Lô Mới"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.newBagCode}
                            filterState={columnFilters.newBagCode}
                            onApply={(data) => handleApplyColumnFilter("newBagCode", data)}
                            onClear={() => handleClearColumnFilter("newBagCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 3. MÃ SO MỚI (Đưa lên trước theo chỉ đạo Chị đẹp) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span className="text-teal-800 font-bold">MÃ SO MỚI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "soCode" ? null : "soCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("soCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã SO Mới"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("soCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "soCode" && (
                          <ColumnFilterPopover
                            columnKey="soCode"
                            columnTitle="Mã SO Mới"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.soCode}
                            filterState={columnFilters.soCode}
                            onApply={(data) => handleApplyColumnFilter("soCode", data)}
                            onClear={() => handleClearColumnFilter("soCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 4. KHÁCH HÀNG MỚI (Đưa lên trước theo chỉ đạo Chị đẹp) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>KHÁCH HÀNG MỚI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "customerName" ? null : "customerName");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("customerName")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Khách Hàng Mới"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("customerName") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "customerName" && (
                          <ColumnFilterPopover
                            columnKey="customerName"
                            columnTitle="Khách Hàng Mới"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.customerName}
                            filterState={columnFilters.customerName}
                            onApply={(data) => handleApplyColumnFilter("customerName", data)}
                            onClear={() => handleClearColumnFilter("customerName")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 5. MÃ ITEM */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ ITEM</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "itemCode" ? null : "itemCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("itemCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã Item"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("itemCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "itemCode" && (
                          <ColumnFilterPopover
                            columnKey="itemCode"
                            columnTitle="Mã Item"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.itemCode}
                            filterState={columnFilters.itemCode}
                            onApply={(data) => handleApplyColumnFilter("itemCode", data)}
                            onClear={() => handleClearColumnFilter("itemCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 6. CHỦNG LOẠI */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>CHỦNG LOẠI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "category" ? null : "category");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("category")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Chủng Loại"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("category") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "category" && (
                          <ColumnFilterPopover
                            columnKey="category"
                            columnTitle="Chủng Loại"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.category}
                            filterState={columnFilters.category}
                            onApply={(data) => handleApplyColumnFilter("category", data)}
                            onClear={() => handleClearColumnFilter("category")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 7. TL METAL */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TL METAL</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "metalWeight" ? null : "metalWeight");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("metalWeight")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp TL Metal"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("metalWeight") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "metalWeight" && (
                          <ColumnFilterPopover
                            columnKey="metalWeight"
                            columnTitle="TL Metal"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.metalWeight}
                            filterState={columnFilters.metalWeight}
                            onApply={(data) => handleApplyColumnFilter("metalWeight", data)}
                            onClear={() => handleClearColumnFilter("metalWeight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 8. TL ĐÁ */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TL ĐÁ</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "stoneWeight" ? null : "stoneWeight");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("stoneWeight")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp TL Đá"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("stoneWeight") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "stoneWeight" && (
                          <ColumnFilterPopover
                            columnKey="stoneWeight"
                            columnTitle="TL Đá"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.stoneWeight}
                            filterState={columnFilters.stoneWeight}
                            onApply={(data) => handleApplyColumnFilter("stoneWeight", data)}
                            onClear={() => handleClearColumnFilter("stoneWeight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 9. TỔNG TL */}
                      <th className="relative py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>TỔNG TL</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "totalWeight" ? null : "totalWeight");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("totalWeight")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp Tổng TL"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("totalWeight") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "totalWeight" && (
                          <ColumnFilterPopover
                            columnKey="totalWeight"
                            columnTitle="Tổng TL"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.totalWeight}
                            filterState={columnFilters.totalWeight}
                            onApply={(data) => handleApplyColumnFilter("totalWeight", data)}
                            onClear={() => handleClearColumnFilter("totalWeight")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 10. MÃ LÔ CŨ (Chuyển về sau theo chỉ đạo Chị đẹp) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>MÃ LÔ CŨ</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "expectedOldBagCode" ? null : "expectedOldBagCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("expectedOldBagCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã Lô Cũ"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("expectedOldBagCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "expectedOldBagCode" && (
                          <ColumnFilterPopover
                            columnKey="expectedOldBagCode"
                            columnTitle="Mã Lô Cũ"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.expectedOldBagCode}
                            filterState={columnFilters.expectedOldBagCode}
                            onApply={(data) => handleApplyColumnFilter("expectedOldBagCode", data)}
                            onClear={() => handleClearColumnFilter("expectedOldBagCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 11. MÃ SO CŨ (Chuyển về sau theo chỉ đạo Chị đẹp) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span className="text-rose-700 font-bold">MÃ SO CŨ</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "originalSoCode" ? null : "originalSoCode");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("originalSoCode")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Mã SO Cũ"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("originalSoCode") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "originalSoCode" && (
                          <ColumnFilterPopover
                            columnKey="originalSoCode"
                            columnTitle="Mã SO Cũ"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.originalSoCode}
                            filterState={columnFilters.originalSoCode}
                            onApply={(data) => handleApplyColumnFilter("originalSoCode", data)}
                            onClear={() => handleClearColumnFilter("originalSoCode")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 12. KHÁCH HÀNG CŨ (MÃ-TÊN) (Chuyển về sau theo chỉ đạo Chị đẹp) */}
                      <th className="relative py-2.5 px-3">
                        <div className="flex items-center justify-between space-x-1">
                          <span>KHÁCH HÀNG CŨ (MÃ-TÊN)</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "oldCustomer" ? null : "oldCustomer");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("oldCustomer")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp cột Khách Hàng Cũ"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("oldCustomer") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "oldCustomer" && (
                          <ColumnFilterPopover
                            columnKey="oldCustomer"
                            columnTitle="Khách Hàng Cũ (Mã-Tên)"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.oldCustomer}
                            filterState={columnFilters.oldCustomer}
                            onApply={(data) => handleApplyColumnFilter("oldCustomer", data)}
                            onClear={() => handleClearColumnFilter("oldCustomer")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 13. TRẠNG THÁI */}
                      <th className="relative py-2.5 px-3 text-center min-w-[170px] whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <span>TRẠNG THÁI</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterColKey(activeFilterColKey === "serveStatus" ? null : "serveStatus");
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${isColumnFiltered("serveStatus")
                                ? "text-[#005a46] bg-emerald-100 ring-1 ring-[#005a46]"
                                : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                            title="Lọc & sắp xếp Trạng Thái"
                          >
                            <Filter className={`h-3 w-3 ${isColumnFiltered("serveStatus") ? "fill-[#005a46]" : ""}`} />
                          </button>
                        </div>
                        {activeFilterColKey === "serveStatus" && (
                          <ColumnFilterPopover
                            columnKey="serveStatus"
                            columnTitle="Trạng Thái"
                            columnType="select"
                            uniqueValues={uniqueValuesMap.serveStatus}
                            filterState={columnFilters.serveStatus}
                            onApply={(data) => handleApplyColumnFilter("serveStatus", data)}
                            onClear={() => handleClearColumnFilter("serveStatus")}
                            onClose={() => setActiveFilterColKey(null)}
                          />
                        )}
                      </th>

                      {/* 14. THAO TÁC */}
                      <th className="py-2.5 px-3 text-center min-w-[130px] whitespace-nowrap">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNewSos.map((so, idx) => {
                      const isServed = so.serveStatus === "Đã chuyển sang bag mới";

                      return (
                        <tr
                          key={so.id}
                          className={`hover:bg-slate-50 transition-colors ${isServed ? "bg-emerald-50/15" : ""
                            }`}
                        >
                          {/* 1. STT */}
                          <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>

                          {/* 2. Mã Lô Mới (Đưa lên trước theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <strong className="font-mono text-xs text-teal-900 font-bold">
                                {so.newBagCode}
                              </strong>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(so.newBagCode, e)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Sao chép mã lô mới"
                              >
                                {copiedCode === so.newBagCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 3. Mã SO Mới (Đưa lên trước theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3">
                            <Link
                              href={so.orderDetailUrl || "/orders/11"}
                              className="font-mono font-bold text-teal-800 hover:text-teal-950 underline decoration-dotted"
                              title="Xem chi tiết đơn hàng SO mới"
                            >
                              {so.soCode}
                            </Link>
                          </td>

                          {/* 4. Khách Hàng Mới (Đưa lên trước theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 truncate block max-w-[190px]" title={so.customerName}>
                              {so.customerName}
                            </span>
                          </td>

                          {/* 5. Mã Item */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800">
                              <span className="font-bold truncate max-w-[170px]" title={so.itemCode}>
                                {so.itemCode}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleCopy(so.itemCode, e)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Sao chép mã item"
                              >
                                {copiedCode === so.itemCode ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 6. Chủng Loại */}
                          <td className="py-3 px-3">
                            <span className="font-medium text-slate-800">
                              {so.category || so.itemName}
                            </span>
                          </td>

                          {/* 7. TL Metal */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800">
                            {so.metalWeight.toFixed(4)}
                          </td>

                          {/* 8. TL Đá */}
                          <td className="py-3 px-3 text-right font-mono text-slate-800">
                            {(so.stoneWeight || 0).toFixed(4)}
                          </td>

                          {/* 9. Tổng TL */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            {so.totalWeight.toFixed(4)}
                          </td>

                          {/* 10. Mã Lô Cũ (Chuyển về sau theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {so.expectedOldBagCode}
                            </span>
                          </td>

                          {/* 11. Mã SO Cũ (Chuyển về sau theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {so.originalSoCode || "SO123456"}
                            </span>
                          </td>

                          {/* 12. Khách Hàng Cũ (Mã-Tên) (Chuyển về sau theo chỉ đạo Chị đẹp) */}
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-700 truncate block max-w-[220px]" title={so.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"}>
                              {so.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"}
                            </span>
                          </td>

                          {/* 13. Trạng Thái */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {isServed ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 whitespace-nowrap shadow-2xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>Đã chuyển sang bag mới</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 whitespace-nowrap shadow-2xs">
                                <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                <span>Chờ chuyển bag</span>
                              </span>
                            )}
                          </td>

                          {/* 14. Thao Tác */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {isServed ? (
                                <button
                                  type="button"
                                  onClick={() => setPrintModalTarget(so.newBagCode)}
                                  className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                  title="In thẻ Bag KHSX mới theo format nhà máy"
                                >
                                  <Printer className="h-3.5 w-3.5 text-emerald-700" />
                                  <span>In mã Bag</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenTransferForBag(so)}
                                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                                  <span>Cấp thành phẩm</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Chân Bảng Tổng Cộng */}
                  <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200 text-[11px]">
                    <tr>
                      <td colSpan={6} className="py-2.5 px-3 text-right">
                        Tổng cộng ({filteredNewSos.length} Bag):
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                        {filteredNewSos.reduce((s, r) => s + r.metalWeight, 0).toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                        {filteredNewSos.reduce((s, r) => s + r.stoneWeight, 0).toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-black">
                        {filteredNewSos.reduce((s, r) => s + r.totalWeight, 0).toFixed(4)}
                      </td>
                      <td colSpan={5} className="py-2.5 px-3 text-center text-[10px] text-slate-500">
                        {filteredNewSos.filter((s) => s.serveStatus === "Đã chuyển sang bag mới").length} đã chuyển / {filteredNewSos.filter((s) => s.serveStatus !== "Đã chuyển sang bag mới").length} chờ chuyển
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: KHÔNG GIAN ĐIỀU PHỐI LIỀN MẠCH THEO CHUẨN MỚI      */}
        {/* HỖ TRỢ 2 KỊCH BẢN: CÓ SERI (KỊCH BẢN A) & CHƯA CÓ SERI (KỊCH BẢN B) */}
        {/* ========================================================= */}
        {viewMode === "transfer" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            {/* BANNER TIÊU ĐỀ TRANG CẤP THÀNH PHẨM (CHUẨN XANH RÊU ĐẬM) */}
            <div className="bg-[#005a46] rounded-xl p-4 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-sm md:text-base font-extrabold tracking-wide uppercase flex items-center gap-2">
                  <span>MÀN HÌNH CẤP THÀNH PHẨM (SERVE FG) — CHUYỂN PHÔI SANG BAG MỚI</span>
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-100 font-mono mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-200/80 font-sans uppercase text-[11px] font-bold">Mã Item:</span>
                    <strong className="text-white font-bold tracking-wider">
                      {selectedOldLot?.itemCode || "GY0BE000144A00A00000000CZWW1048"}
                    </strong>
                  </div>
                  <span className="text-emerald-300/60">•</span>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-emerald-200/80 uppercase text-[11px] font-bold">Chủng loại:</span>
                    <span className="text-white font-semibold">{selectedOldLot?.itemName || "Vòng Tay Nữ"}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs bg-[#004737] border border-emerald-600/40 px-3 py-1.5 rounded-lg text-emerald-100 font-mono font-bold">
                  Đơn hàng mới: <strong className="text-white">{selectedNewBag?.soCode || "SO2608011"}</strong>
                </span>
              </div>
            </div>

            {/* KHỐI LÔ NGUỒN & BAG ĐÍCH (SIDE-BY-SIDE VỚI MŨI TÊN CHUYỂN Ở GIỮA) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

              {/* Box Trái: LÔ NGUỒN (5 Cột) */}
              <div className="md:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Lô Nguồn</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {selectedOldLot?.originalSoCode || "SO123456"}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-[11px]">MÃ LÔ PHÔI:</span>
                    <strong className="font-mono text-slate-900 font-bold text-sm">
                      {selectedOldLot?.bagCode || "SO-260800063"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-[11px]">KHÁCH HÀNG CŨ:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[240px]">
                      {selectedOldLot?.oldCustomer || "2000071 - Công ty TNHH Vàng Bạc Kim Thành"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Giữa: MŨI TÊN CHUYỂN & BADGE SL (2 Cột) */}
              <div className="md:col-span-2 flex flex-col items-center justify-center py-2 text-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 mb-1">
                  <ArrowRight className="h-4 w-4 text-[#005a46]" />
                </div>
                <span className="text-xs font-bold text-[#005a46] bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full whitespace-nowrap shadow-2xs">
                  Chuyển: 2/8 pcs
                </span>
              </div>

              {/* Box Phải: BAG ĐÍCH (5 Cột) */}
              <div className="md:col-span-5 bg-white rounded-xl border border-teal-200 p-4 shadow-xs relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Bag Đích</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedNewBag?.soCode || "SO2608011"}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-[11px]">MÃ BAG MỚI:</span>
                    <strong className="font-mono text-teal-900 font-bold text-sm">
                      {selectedNewBag?.newBagCode || "SO-261024-003"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-[11px]">KHÁCH HÀNG NHẬN:</span>
                    <span className="text-slate-700 font-medium truncate max-w-[200px]">
                      {selectedNewBag?.customerName || "DOANH NGHIỆP TƯ NHÂN Ý NGỌC"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 border-t border-slate-100">
                    <span className="text-slate-400 font-medium text-[10px]">NGUYÊN LIỆU - TUỔI VÀNG:</span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded text-[11px]">
                      {selectedNewBag?.goldAge || "75W"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* KHỐI 1: CHỌN SERIES (KỊCH BẢN A) HOẶC CÂN & CHỌN STAMP (KỊCH BẢN B) */}
            {/* ========================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Header Khối 1 kèm Toggle Kịch bản & Nút Thu gọn */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005a46]"></span>
                  <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    {serveScenario === "series"
                      ? "1. CHỌN SERIES"
                      : "1. CÂN KIỂM TRA PHÔI GỐC & CHỌN MÃ STAMP"}
                  </h2>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    serveScenario === "series"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-900 border-amber-200"
                  }`}>
                    {serveScenario === "series"
                      ? "Kịch bản A: Lô đã có mã Seri chi tiết (Kế thừa 100%, không cần cân & chọn lại Stamp)"
                      : "Kịch bản B: Lô chưa có Seri — Bắt buộc cân lại tổng trọng lượng & chọn lại Stamp!"}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Nút Thu gọn / Mở rộng */}
                  <button
                    type="button"
                    onClick={() => setIsSection1Collapsed((prev) => !prev)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {isSection1Collapsed ? (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" />
                        <span>Mở rộng</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" />
                        <span>Thu gọn</span>
                      </>
                    )}
                  </button>

                  {/* Toggle Chế độ test: Có Seri vs Chưa có Seri */}
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300 text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold px-2">Chế độ test:</span>
                    <button
                      type="button"
                      onClick={() => {
                        playScanBeep();
                        setServeScenario("series");
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        serveScenario === "series"
                          ? "bg-white text-slate-900 shadow-2xs border border-slate-300"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Có Seri (Chọn PCS)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playScanBeep();
                        setServeScenario("no-series");
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        serveScenario === "no-series"
                          ? "bg-amber-500 text-white shadow-2xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Chưa có Seri (Cân lại)
                    </button>
                  </div>
                </div>
              </div>

              {/* Body Khối 1: Hiển thị nội dung tương ứng theo kịch bản */}
              {!isSection1Collapsed && (
                <div className="p-4 space-y-4">

                  {/* ========================================================= */}
                  {/* KỊCH BẢN A: LÔ ĐÃ CÓ MÃ SERI CHI TIẾT (ẢNH 1)              */}
                  {/* ========================================================= */}
                  {serveScenario === "series" ? (
                    <div className="space-y-3">
                      {/* Form Quét súng Barcode */}
                      <form onSubmit={handleScanSeriesBarcode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Barcode className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            placeholder="Quét súng Barcode vào tem niêm phong Seri (hoặc nhập mã rồi nhấn Enter)..."
                            value={seriesScanInput}
                            onChange={(e) => setSeriesScanInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005a46] focus:border-[#005a46] transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <Barcode className="h-4 w-4" />
                          <span>Quét Barcode</span>
                        </button>
                        <div className="flex items-center px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-bold shrink-0">
                          <span>Số lượng cần chọn: </span>
                          <strong className="text-[#005a46] ml-1 font-mono text-sm">
                            {selectedSeriesCodes.length} / 2 PCS
                          </strong>
                        </div>
                      </form>

                      {/* Bảng Danh Sách Seri Chi Tiết (8 Dòng) */}
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                            <tr>
                              <th className="py-2.5 px-3 text-center w-12">Chọn</th>
                              <th className="py-2.5 px-3">Mã Seri (Niêm phong)</th>
                              <th className="py-2.5 px-3 text-center">Mã Stamp gốc</th>
                              <th className="py-2.5 px-3 text-right">TL Đá (Lượng)</th>
                              <th className="py-2.5 px-3 text-right">TL Vàng (Lượng)</th>
                              <th className="py-2.5 px-3 text-right">Tổng TL Psc (Lượng)</th>
                              <th className="py-2.5 px-3 text-center">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                            {MOCK_SERIES_LIST.map((sr) => {
                              const isSelected = selectedSeriesCodes.includes(sr.id);
                              const isLocked = !isSelected && selectedSeriesCodes.length >= 2;

                              return (
                                <tr
                                  key={sr.id}
                                  className={`transition-colors ${
                                    isSelected
                                      ? "bg-emerald-50/70"
                                      : isLocked
                                        ? "bg-slate-50/50 text-slate-400"
                                        : "hover:bg-slate-50"
                                  }`}
                                >
                                  <td className="py-2 px-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      disabled={isLocked}
                                      onChange={() => handleToggleSeries(sr.id)}
                                      className={`w-4 h-4 rounded text-[#005a46] focus:ring-[#005a46] ${
                                        isLocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                                      }`}
                                    />
                                  </td>
                                  <td className="py-2 px-3 font-bold text-slate-800">
                                    {sr.id}
                                  </td>
                                  <td className="py-2 px-3 text-center text-slate-700">
                                    {sr.stampCode}
                                  </td>
                                  <td className="py-2 px-3 text-right text-slate-700">
                                    {sr.stoneWeight.toFixed(5)}
                                  </td>
                                  <td className="py-2 px-3 text-right text-slate-700">
                                    {sr.goldWeight.toFixed(5)}
                                  </td>
                                  <td className="py-2 px-3 text-right font-bold text-slate-900">
                                    {sr.totalWeight.toFixed(5)}
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    {isSelected ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                        <Check className="h-3 w-3" />
                                        <span>Đã chọn</span>
                                      </span>
                                    ) : isLocked ? (
                                      <span className="text-[10px] text-slate-400 font-sans italic">
                                        Khóa (Đã đủ SL)
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-500 font-sans">
                                        Khả dụng
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Ghi chú Kịch bản A */}
                      <div className="flex justify-end pt-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Không bắt buộc cân lại (Dữ liệu đã niêm phong)</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* ========================================================= */
                    /* KỊCH BẢN B: LÔ CHƯA CÓ SERI — BẮT BUỘC CÂN & CHỌN STAMP (ẢNH 2) */
                    /* ========================================================= */
                    <div className="space-y-4">
                      {/* Warning Banner Kịch bản B */}
                      <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-xs text-amber-900 gap-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>
                            Lô phôi cũ chưa có mã Seri lẻ + Kế hoạch chọn xuất <strong>2 PCS</strong>. Bắt buộc đặt phôi lên cân điện tử để cân lại & chọn Mã Stamp theo PCS!
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded shrink-0">
                          Bắt buộc cân lại
                        </span>
                      </div>

                      {/* KHỐI CÂN LẠI TỔNG TRỌNG LƯỢNG (FQC BÀN CÂN - THEME CÔNG NGHIỆP DARK) */}
                      <div className="bg-slate-900 rounded-xl p-4 text-white shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-200">
                            <Scale className="h-4 w-4 text-amber-400" />
                            <span>CÂN LẠI TỔNG TRỌNG LƯỢNG (FQC BÀN CÂN)</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Đơn vị: <strong>LƯỢNG</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          {/* Trọng lượng chuẩn lý thuyết */}
                          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                            <div className="text-[11px] text-slate-400 font-semibold mb-1">
                              TRỌNG LƯỢNG CHUẨN LÝ THUYẾT (KHSX):
                            </div>
                            <div className="text-[10px] text-slate-500">Ước tính KHSX:</div>
                            <div className="text-2xl font-black font-mono text-amber-300 my-1">
                              0.02690 Lượng
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-700/60 font-mono">
                              <span>Vàng LT: <strong className="text-slate-200">0.02610</strong></span>
                              <span>•</span>
                              <span>Đá LT: <strong className="text-slate-200">0.00080</strong></span>
                            </div>
                          </div>

                          {/* Tổng trọng lượng cân thực tế (Màn LED) */}
                          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                              <span>TỔNG TRỌNG LƯỢNG CÂN THỰC TẾ:</span>
                              <span className="text-[10px] font-mono text-emerald-400">CÂN: FQC-C015</span>
                            </div>

                            {/* Màn hình LED màu đen viền xanh ngọc */}
                            <div className="bg-black/90 border border-emerald-500/50 rounded-lg p-2.5 my-1 flex items-center justify-between shadow-inner">
                              <span className="text-2xl md:text-3xl font-black font-mono text-emerald-400 tracking-wider">
                                {Number(scaleWeight).toFixed(5)}
                              </span>
                              <span className="text-xs font-bold text-emerald-500 uppercase font-mono">
                                Lượng
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={handleReadScale}
                                disabled={isScaleReading}
                                className="px-3 py-1 bg-[#005a46] hover:bg-[#004737] text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <RefreshCw className={`h-3.5 w-3.5 ${isScaleReading ? "animate-spin" : ""}`} />
                                <span>{isScaleReading ? "Đang đọc cân..." : "Đọc Cân Điện Tử"}</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                                  Chuẩn
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-400">
                                  Lệch
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* KHỐI CHỌN MÃ STAMP & PHÂN BỔ SỐ LƯỢNG PCS */}
                      <div className="space-y-2 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#005a46]"></span>
                              <h3 className="font-bold text-xs text-slate-900 uppercase">
                                CHỌN MÃ STAMP & PHÂN BỔ SỐ LƯỢNG PCS
                              </h3>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              1 PCS tương ứng 1 Stamp • Mã Stamp xưởng: 18, 20, 24... • Nhập TL Đá/PCS theo thực tế • Ràng buộc: SL Chuyển = SL Stamp
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md">
                              ✓ Đã khớp: {totalStampQty}/2 PCS (SL Chuyển = SL Stamp)
                            </span>
                            <button
                              type="button"
                              onClick={handleAddStampRow}
                              className="px-3 py-1 bg-[#005a46] hover:bg-[#004737] text-white rounded-md text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Thêm Dòng Stamp</span>
                            </button>
                          </div>
                        </div>

                        {/* Bảng Dòng Stamp */}
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                              <tr>
                                <th className="py-2 px-3 text-center w-12">STT</th>
                                <th className="py-2 px-3">Mã Stamp</th>
                                <th className="py-2 px-3 text-center">TL Đá / 1 PCS (Lượng)</th>
                                <th className="py-2 px-3 text-center w-28">Số lượng (PCS)</th>
                                <th className="py-2 px-3 text-right">Tổng TL Đá (Lượng)</th>
                                <th className="py-2 px-3 text-center w-16">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                              {stampRows.map((row, index) => {
                                const rowStoneTotal = (parseFloat(row.stoneWeightPerPcs) || 0) * (parseInt(row.qty) || 0);

                                return (
                                  <tr key={row.id} className="hover:bg-slate-50">
                                    <td className="py-2 px-3 text-center text-slate-500 font-sans">
                                      #{index + 1}
                                    </td>
                                    <td className="py-2 px-3">
                                      <select
                                        value={row.stampCode}
                                        onChange={(e) => handleUpdateStampRow(row.id, "stampCode", e.target.value)}
                                        className="w-full py-1 px-2 border border-slate-300 rounded bg-white text-xs font-sans font-medium focus:ring-1 focus:ring-[#005a46]"
                                      >
                                        <option value="18 (10K / 416)">18 (10K / 416)</option>
                                        <option value="20 (14K / 585)">20 (14K / 585)</option>
                                        <option value="24 (18K / 750)">24 (18K / 750)</option>
                                        <option value="STP-10K-0.5">STP-10K-0.5</option>
                                      </select>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <input
                                        type="number"
                                        step="0.00001"
                                        value={row.stoneWeightPerPcs}
                                        onChange={(e) => handleUpdateStampRow(row.id, "stoneWeightPerPcs", e.target.value)}
                                        className="w-28 text-center py-1 px-2 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-[#005a46]"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <input
                                        type="number"
                                        min="1"
                                        value={row.qty}
                                        onChange={(e) => handleUpdateStampRow(row.id, "qty", parseInt(e.target.value) || 0)}
                                        className="w-16 text-center py-1 px-2 border border-slate-300 rounded font-mono font-bold text-xs focus:ring-1 focus:ring-[#005a46]"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                                      {rowStoneTotal.toFixed(5)} L
                                    </td>
                                    <td className="py-2 px-3 text-center font-sans">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveStampRow(row.id)}
                                        disabled={stampRows.length <= 1}
                                        className={`p-1 rounded text-slate-400 hover:text-rose-600 transition-colors ${
                                          stampRows.length <= 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                                        }`}
                                        title="Xóa dòng"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* KHỐI KẾT QUẢ TÍNH TRỌNG LƯỢNG (3 HỘP THỐNG KÊ) */}
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span>KẾT QUẢ TÍNH TRỌNG LƯỢNG (TL KIM LOẠI = TỔNG TL - TL ĐÁ)</span>
                          </div>
                          <span className="text-[10px] text-slate-400 italic">
                            * Bảo toàn trọng lượng • Tự động đồng bộ sang Bảng Diff
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Hộp 1: Tổng TL cân */}
                          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                            <div className="text-[10px] text-slate-500 font-bold uppercase">
                              TỔNG TRỌNG LƯỢNG (CÂN)
                            </div>
                            <div className="text-lg font-black font-mono text-slate-900 my-0.5">
                              {Number(scaleWeight).toFixed(5)} Lượng
                            </div>
                            <div className="text-[10px] text-slate-400">Đo từ cân FQC</div>
                          </div>

                          {/* Hộp 2: Trọng lượng đá */}
                          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                            <div className="text-[10px] text-amber-700 font-bold uppercase">
                              TRỌNG LƯỢNG ĐÁ (TỪ STAMP)
                            </div>
                            <div className="text-lg font-black font-mono text-amber-600 my-0.5">
                              {totalStampStoneWeight.toFixed(5)} Lượng
                            </div>
                            <div className="text-[10px] text-slate-400">Tính từ mã Stamp đã chọn</div>
                          </div>

                          {/* Hộp 3: Trọng lượng kim loại */}
                          <div className="p-3 bg-white rounded-lg border border-teal-200 bg-teal-50/30 shadow-2xs">
                            <div className="text-[10px] text-teal-800 font-bold uppercase">
                              TRỌNG LƯỢNG KIM LOẠI (VÀNG)
                            </div>
                            <div className="text-lg font-black font-mono text-teal-900 my-0.5">
                              {calculatedMetalWeightB.toFixed(5)} Lượng
                            </div>
                            <div className="text-[10px] text-teal-600 font-medium">= Tổng TL - TL Đá</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* KHỐI 2: ĐIỀU PHỐI COMPONENT BAG THEO SL SERI ĐÃ CHỌN       */}
            {/* ========================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005a46]"></span>
                    <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                      2. ĐIỀU PHỐI COMPONENT BAG THEO SL SERI ĐÃ CHỌN
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    KHSX phân bổ cố định số lượng chuyển • Kế thừa đầy đủ cấu trúc linh kiện phôi
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md self-start sm:self-auto">
                  KHSX chỉ định: Chuyển: 2/8 pcs
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

                {/* Box Trái: Component Lô Nguồn (SO-260800063) */}
                <div className="bg-rose-50/20 rounded-xl border border-rose-200 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-rose-200/60 pb-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-bold text-xs text-rose-950">
                          Component Lô Nguồn ({selectedOldLot?.bagCode || "SO-260800063"})
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 border border-rose-200 px-2 py-0.5 rounded">
                        Xuất đi 2 PCS
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Nhóm Khuôn Cast */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">▾ Khuôn (Cast) — Phôi đúc</div>
                        <div className="p-2 bg-white rounded border border-rose-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-slate-800">DE000144A00-MOLD-1-A</div>
                            <div className="text-[10px] text-slate-400 font-sans">Khuôn Vòng Tay Nữ (Phôi đúc kim loại)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500">Hiện tại: <strong>8 Cái</strong></div>
                            <div className="text-rose-700 font-bold">Còn lại: 6 Cái</div>
                          </div>
                        </div>
                      </div>

                      {/* Nhóm Bán thành phẩm / Linh kiện phụ */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">▾ Bán thành phẩm / Linh kiện phụ (HTJ)</div>
                        <div className="p-2 bg-white rounded border border-rose-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-slate-800">CBC049TH BM00249</div>
                            <div className="text-[10px] text-slate-400 font-sans">Chấu đúc / Khóa</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500">Hiện tại: <strong>3 Cái</strong></div>
                            <div className="text-rose-700 font-bold">Còn lại: 2 Cái</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-rose-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-slate-800">HTJP000003</div>
                            <div className="text-[10px] text-slate-400 font-sans">Hạt nối assembling</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500">Hiện tại: <strong>12 Hạt</strong></div>
                            <div className="text-rose-700 font-bold">Còn lại: 10 Hạt</div>
                          </div>
                        </div>
                      </div>

                      {/* Nhóm Phụ liệu - Đá */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">▾ Phụ liệu — Đá</div>
                        <div className="p-2 bg-white rounded border border-rose-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-slate-800">CZ10RVDWW11RD1.25</div>
                            <div className="text-[10px] text-slate-400 font-sans">Đá tròn trắng 1.25mm</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500">Hiện tại: <strong>10 Viên</strong></div>
                            <div className="text-rose-700 font-bold">Còn lại: 9 Viên</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-rose-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-slate-800">CZ10RVDWW11RD4</div>
                            <div className="text-[10px] text-slate-400 font-sans">Đá tròn trắng 4mm</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500">Hiện tại: <strong>6 Viên</strong></div>
                            <div className="text-rose-700 font-bold">Còn lại: 5 Viên</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-rose-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-slate-800">CZ10RVDDD11RD1.1</div>
                            <div className="text-[10px] text-slate-400 font-sans">Đá xanh dương gắn tay</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500">Hiện tại: <strong>2 Viên</strong></div>
                            <div className="text-rose-700 font-bold">Còn lại: 1 Viên</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Box Trái: Tổng trọng lượng còn lại */}
                  <div className="mt-3 pt-2.5 border-t border-rose-200 text-xs font-mono space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans text-[11px]">Tổng trọng lượng:</span>
                      <strong className="text-rose-900 font-bold">0.0807 Lượng (Gốc: 0.1076)</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-sans">Trọng lượng đá:</span>
                      <span>0.0024 Lượng</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-sans">Trọng lượng kim loại:</span>
                      <span>0.0783 Lượng</span>
                    </div>
                  </div>
                </div>

                {/* Box Phải: Component Bag Đích (SO-261024-003) */}
                <div className="bg-emerald-50/20 rounded-xl border border-emerald-200 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-xs text-emerald-950">
                          Component Bag Đích ({selectedNewBag?.newBagCode || "SO-261024-003"})
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded">
                        Nhận 2 PCS
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Nhóm Khuôn Cast */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">▾ Khuôn (Cast) — Phôi đúc</div>
                        <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-teal-900">DE000144A00-MOLD-1-A</div>
                            <div className="text-[10px] text-slate-400 font-sans">Khuôn Vòng Tay Nữ (Phôi đúc kim loại)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-700 font-bold">Nhận: +2 Cái</div>
                            <div className="text-slate-500 text-[10px]">Tổng: 1 Cái</div>
                          </div>
                        </div>
                      </div>

                      {/* Nhóm Bán thành phẩm / Linh kiện */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">▾ Bán thành phẩm / Linh kiện (HTJ)</div>
                        <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-teal-900">CBC049TH BM00249</div>
                            <div className="text-[10px] text-slate-400 font-sans">Chấu đúc / Khóa</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-700 font-bold">Nhận: +1 Cái</div>
                            <div className="text-slate-500 text-[10px]">Tổng: 1 Cái</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-teal-900">HTJP000003</div>
                            <div className="text-[10px] text-slate-400 font-sans">Hạt nối assembling</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-700 font-bold">Nhận: +2 Hạt</div>
                            <div className="text-slate-500 text-[10px]">Tổng: 1 Hạt</div>
                          </div>
                        </div>
                      </div>

                      {/* Nhóm Phụ liệu - Đá */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">▾ Phụ liệu — Đá (Kế thừa cho 1 chiếc)</div>
                        <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-teal-900">CZ10RVDWW11RD1.25</div>
                            <div className="text-[10px] text-slate-400 font-sans">Đá tròn trắng 1.25mm</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-700 font-bold">Nhận: +1</div>
                            <div className="text-slate-500 text-[10px]">Tổng: 1 Viên</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-teal-900">CZ10RVDWW11RD4</div>
                            <div className="text-[10px] text-slate-400 font-sans">Đá tròn trắng 4mm</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-700 font-bold">Nhận: +1</div>
                            <div className="text-slate-500 text-[10px]">Tổng: 1 Viên</div>
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded border border-emerald-100 flex items-center justify-between font-mono text-[11px]">
                          <div>
                            <div className="font-bold text-teal-900">CZ10RVDDD11RD1.1</div>
                            <div className="text-[10px] text-slate-400 font-sans">Đá xanh dương gắn tay</div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-700 font-bold">Nhận: +1</div>
                            <div className="text-slate-500 text-[10px]">Tổng: 1 Viên</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Box Phải: Tổng trọng lượng nhận */}
                  <div className="mt-3 pt-2.5 border-t border-emerald-200 text-xs font-mono space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans text-[11px]">Tổng trọng lượng nhận:</span>
                      <strong className="text-emerald-800 font-bold">+0.02690 Lượng</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-sans">Trọng lượng đá:</span>
                      <span className="text-emerald-700 font-medium">+0.00080 Lượng</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-sans">Trọng lượng kim loại:</span>
                      <span className="text-emerald-700 font-medium">+0.02610 Lượng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* KHỐI 3: BẢNG XEM TRƯỚC SỰ THAY ĐỔI TRỌNG LƯỢNG (9 CỘT)    */}
            {/* ========================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005a46]"></span>
                  <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    3. BẢNG XEM TRƯỚC SỰ THAY ĐỔI TRỌNG LƯỢNG (WEIGHT DIFF PREVIEW)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Đơn vị: <strong>LƯỢNG</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse table-fixed">
                  <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th rowSpan={2} className="py-2 px-3 border-r border-slate-200 w-[18%]">
                        Thông số trọng lượng
                      </th>
                      <th rowSpan={2} className="py-2 px-2 text-center border-r border-slate-200 w-[7%]">
                        ĐVT
                      </th>
                      <th colSpan={3} className="py-1 px-3 text-center border-r border-slate-200 bg-slate-100/70 text-slate-800 w-[36%]">
                        Lô Nguồn ({selectedOldLot?.bagCode || "SO-260800063"})
                      </th>
                      <th colSpan={4} className="py-1 px-3 text-center bg-teal-50/70 text-teal-900 w-[39%]">
                        Bag Đích ({selectedNewBag?.newBagCode || "SO-261024-003"})
                      </th>
                    </tr>
                    <tr className="border-t border-slate-200 text-[10px] text-slate-500">
                      <th className="py-1.5 px-3 text-right w-[12%]">Trước</th>
                      <th className="py-1.5 px-3 text-right w-[12%] text-rose-600 font-bold">Chuyển (-)</th>
                      <th className="py-1.5 px-3 text-right border-r border-slate-200 w-[12%]">Sau</th>
                      <th className="py-1.5 px-3 text-right w-[10%]">Trước</th>
                      <th className="py-1.5 px-3 text-right text-emerald-700 font-bold w-[10%]">Nhận (+)</th>
                      <th className="py-1.5 px-3 text-right text-slate-400 w-[9%]">Reject (-)</th>
                      <th className="py-1.5 px-3 text-right font-black text-teal-950 w-[10%]">Sau</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] font-mono">
                    {/* Dòng 1: Tổng Trọng Lượng */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        Tổng Trọng Lượng
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-500 border-r border-slate-200 font-sans">
                        Lượng
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">0.1076</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">-0.02690</td>
                      <td className="py-2.5 px-3 text-right text-slate-700 border-r border-slate-200 font-bold">0.0807</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">0.0000</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">+0.02690</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                      <td className="py-2.5 px-3 text-right font-black text-teal-950">0.02690</td>
                    </tr>

                    {/* Dòng 2: Trọng Lượng Đá */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        Trọng Lượng Đá
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-500 border-r border-slate-200 font-sans">
                        Lượng
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">0.0032</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">-0.00080</td>
                      <td className="py-2.5 px-3 text-right text-slate-700 border-r border-slate-200 font-bold">0.0024</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">0.0000</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">+0.00080</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                      <td className="py-2.5 px-3 text-right font-black text-teal-950">0.00080</td>
                    </tr>

                    {/* Dòng 3: Trọng Lượng Kim Loại */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        Trọng Lượng Kim Loại
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-500 border-r border-slate-200 font-sans">
                        Lượng
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">0.1044</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold">-0.02610</td>
                      <td className="py-2.5 px-3 text-right text-slate-700 border-r border-slate-200 font-bold">0.0783</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">0.0000</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">+0.02610</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">—</td>
                      <td className="py-2.5 px-3 text-right font-black text-teal-950">0.02610</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ========================================================= */}
            {/* KHỐI 4: DANH SÁCH BƯỚC THỰC THI (ROUTING 2A)               */}
            {/* ========================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005a46]"></span>
                  <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    4. DANH SÁCH BƯỚC THỰC THI (ROUTING 2A)
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400 italic">5 bước gia công liên thông xưởng</span>
              </div>

              <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                {/* Bước 1 */}
                <div className="p-2.5 rounded-lg border border-amber-300 bg-amber-50/60 flex flex-col justify-between">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>WC-0111: Serve FG</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      ● Đang thực hiện
                    </span>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>WC-0013: Stamping</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      Xưởng: Stamp STP-10K-0.5
                    </span>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>WC-0020: Polishing</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      Đánh bóng
                    </span>
                  </div>
                </div>

                {/* Bước 4 */}
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>WC-0153: Platting</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      Xi mạ
                    </span>
                  </div>
                </div>

                {/* Bước 5 */}
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">5</span>
                    <span>WC-0147: Packing in</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      Đóng gói
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* THANH FOOTER DƯỚI CÙNG                                     */}
            {/* ========================================================= */}
            <div className="flex items-center justify-between pt-2 pb-6">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại Danh sách</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmServeAndCloseBag}
                className="px-5 py-2.5 rounded-lg bg-[#005a46] hover:bg-[#004737] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Xác Nhận Chuyển & Đóng Bag Cũ</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL IN THẺ BAG MỚI (FORMAT CHUẨN KHSX THEO ẢNH ĐÍNH KÈM) */}
      {/* ========================================================= */}
      <ProductionBagPrintModal
        isOpen={Boolean(printModalTarget)}
        onClose={() => setPrintModalTarget(null)}
        bagData={newSos.find((s) => s.newBagCode === printModalTarget) || selectedNewBag}
        initialPcs={newSos.find((s) => s.newBagCode === printModalTarget)?.demandQty || 4}
      />
    </div>
  );
}
