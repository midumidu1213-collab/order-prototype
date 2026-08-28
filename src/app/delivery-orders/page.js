"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  Package,
  Layers,
  Search,
  Filter,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ArrowUpDown,
  Info,
  Calendar,
  User,
  MapPin,
  FileText,
  BadgePercent,
  RefreshCw,
  Zap,
  QrCode,
  SlidersHorizontal,
  ListChecks,
  GitBranch,
  ArrowRight,
  FileDiff,
  Lock,
  RotateCcw,
  Edit3,
  Boxes,
  Gem,
  CheckCheck,
  FileSpreadsheet,
} from "lucide-react";

export default function DeliveryOrdersPage() {
  const router = useRouter();
  // 2 MAIN NAVIGATION TABS
  const [mainTab, setMainTab] = useState("do-list"); // "do-list" | "pending-bags"
  const [doStatusFilter, setDoStatusFilter] = useState("all");

  // Filters & Sort for Pending Bags (Danh sách chờ lập phiếu)
  const [filterCustomer, setFilterCustomer] = useState("all");
  const [filterPurity, setFilterPurity] = useState("all");
  const [filterSo, setFilterSo] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [doSearchTerm, setDoSearchTerm] = useState("");

  // Sort State for Pending Bags
  const [sortField, setSortField] = useState("bagCode");
  const [sortDirection, setSortDirection] = useState("asc");

  // Selected Bags & Series Map for allocation
  const [selectedBagIds, setSelectedBagIds] = useState([]);
  const [selectedSeriesMap, setSelectedSeriesMap] = useState({
    "BAG-2608-001": ["SR-2608-001-01", "SR-2608-001-02", "SR-2608-001-03", "SR-2608-001-04", "SR-2608-001-05", "SR-2608-001-06", "SR-2608-001-07", "SR-2608-001-08", "SR-2608-001-09", "SR-2608-001-10"],
    "BAG-2608-002": ["SR-2608-002-01", "SR-2608-002-02", "SR-2608-002-03", "SR-2608-002-04", "SR-2608-002-05", "SR-2608-002-06", "SR-2608-002-07", "SR-2608-002-08"],
    "BAG-2608-005": ["SR-2608-005-01", "SR-2608-005-02", "SR-2608-005-03", "SR-2608-005-04"],
  });

  // Series Drawer State for Pending Bags
  const [activeSeriesBag, setActiveSeriesBag] = useState(null);
  const [tempSelectedSeries, setTempSelectedSeries] = useState([]);

  const [expandedDoRows, setExpandedDoRows] = useState({
    "DO20260825002": true,
  });

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // =========================================================================
  // ADJUSTMENT REQUEST MODAL STATE (ĐÃ LẬP HÓA ĐƠN -> ĐIỀU CHỈNH GỬI KHO XỬ LÝ)
  // =========================================================================
  const [adjustingDO, setAdjustingDO] = useState(null);
  const [adjustDraftBags, setAdjustDraftBags] = useState([]);
  const [adjustReason, setAdjustReason] = useState("Khách hàng điều chỉnh lại cơ cấu số lượng món đợt này.");
  const [activeSeriesPickerBagCode, setActiveSeriesPickerBagCode] = useState("BAG-2608-001");

  // Sample Data: Pending Bags (Danh sách chờ lập phiếu)
  const [pendingBags, setPendingBags] = useState([
    {
      id: "BAG-2608-001",
      bagCode: "BAG-2608-001",
      customerCode: "KH001",
      customerName: "2000001 - Vàng Kim Yến",
      soCode: "SO2608001",
      shippingArea: "TP. Hồ Chí Minh (Quận 1)",
      itemCode: "GY0RG000086A00",
      category: "Nhẫn nữ",
      rawMaterial: "AU 75.00 Y",
      rawMaterialFull: "Vàng 75.00% - Vàng Vàng 18K",
      purityCode: "AU 75.00 Y",
      purityFactor: 0.75,
      hasSeries: true,
      qty: 10,
      stoneWeightPerPsc: 0.2500,
      goldWeightPerPsc: 14.0000,
      laborCostPerPsc: 350000,
      discountPercent: 5.0,
      orderDate: "15/07/2026",
      qcDate: "25/08/2026",
      creator: "Nguyễn Văn An (VHKD)",
      createdDate: "25/08/2026 14:30",
      status: "Chờ phân bổ",
      seriesList: [
        { seriesCode: "SR-2608-001-01", goldWeight: 14.2450, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 48" },
        { seriesCode: "SR-2608-001-02", goldWeight: 14.1200, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 48" },
        { seriesCode: "SR-2608-001-03", goldWeight: 14.3100, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 50" },
        { seriesCode: "SR-2608-001-04", goldWeight: 14.0500, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 50" },
        { seriesCode: "SR-2608-001-05", goldWeight: 14.2200, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 52" },
        { seriesCode: "SR-2608-001-06", goldWeight: 14.4800, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 52" },
        { seriesCode: "SR-2608-001-07", goldWeight: 14.3900, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 54" },
        { seriesCode: "SR-2608-001-08", goldWeight: 14.1800, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 54" },
        { seriesCode: "SR-2608-001-09", goldWeight: 14.2600, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 56" },
        { seriesCode: "SR-2608-001-10", goldWeight: 14.3450, stoneWeight: 0.2500, status: "Khả dụng", niSize: "Ni 56" },
      ]
    },
    {
      id: "BAG-2608-002",
      bagCode: "BAG-2608-002",
      customerCode: "KH001",
      customerName: "2000001 - Vàng Kim Yến",
      soCode: "SO2608001",
      shippingArea: "TP. Hồ Chí Minh (Quận 1)",
      itemCode: "GY0NL000012B00",
      category: "Dây chuyền",
      rawMaterial: "AU 75.00 Y",
      rawMaterialFull: "Vàng 75.00% - Vàng Vàng 18K",
      purityCode: "AU 75.00 Y",
      purityFactor: 0.75,
      hasSeries: true,
      qty: 8,
      stoneWeightPerPsc: 0.0000,
      goldWeightPerPsc: 21.0000,
      laborCostPerPsc: 520000,
      discountPercent: 5.0,
      orderDate: "15/07/2026",
      qcDate: "26/08/2026",
      creator: "Nguyễn Văn An (VHKD)",
      createdDate: "26/08/2026 09:15",
      status: "Chờ phân bổ",
      seriesList: [
        { seriesCode: "SR-2608-002-01", goldWeight: 21.0200, stoneWeight: 0, status: "Khả dụng", length: "45cm" },
        { seriesCode: "SR-2608-002-02", goldWeight: 20.8500, stoneWeight: 0, status: "Khả dụng", length: "45cm" },
        { seriesCode: "SR-2608-002-03", goldWeight: 21.1800, stoneWeight: 0, status: "Khả dụng", length: "50cm" },
        { seriesCode: "SR-2608-002-04", goldWeight: 20.9500, stoneWeight: 0, status: "Khả dụng", length: "50cm" },
        { seriesCode: "SR-2608-002-05", goldWeight: 21.0500, stoneWeight: 0, status: "Khả dụng", length: "50cm" },
        { seriesCode: "SR-2608-002-06", goldWeight: 20.9200, stoneWeight: 0, status: "Khả dụng", length: "55cm" },
        { seriesCode: "SR-2608-002-07", goldWeight: 21.0100, stoneWeight: 0, status: "Khả dụng", length: "55cm" },
        { seriesCode: "SR-2608-002-08", goldWeight: 21.0200, stoneWeight: 0, status: "Khả dụng", length: "60cm" },
      ]
    },
    {
      id: "BAG-2608-003",
      bagCode: "BAG-2608-003",
      customerCode: "KH001",
      customerName: "2000001 - Vàng Kim Yến",
      soCode: "SO2608003",
      shippingArea: "TP. Hồ Chí Minh (Quận 1)",
      itemCode: "GY0ER000045C00",
      category: "Bông tai",
      rawMaterial: "AU 75.00 Y",
      rawMaterialFull: "Vàng 75.00% - Vàng Vàng 18K",
      purityCode: "AU 75.00 Y",
      purityFactor: 0.75,
      hasSeries: false,
      qty: 12,
      stoneWeightPerPsc: 0.4000,
      goldWeightPerPsc: 7.6000,
      laborCostPerPsc: 280000,
      discountPercent: 5.0,
      orderDate: "18/07/2026",
      qcDate: "27/08/2026",
      creator: "Trần Thị Bích",
      createdDate: "27/08/2026 11:00",
      status: "Chờ phân bổ",
      seriesList: []
    },
    {
      id: "BAG-2608-004",
      bagCode: "BAG-2608-004",
      customerCode: "KH002",
      customerName: "2000002 - Vàng Bạc Bảo Tín",
      soCode: "SO2608002",
      shippingArea: "Hà Nội (Hoàn Kiếm)",
      itemCode: "AG0RG000099A00",
      category: "Nhẫn nam",
      rawMaterial: "AG 41.70 W",
      rawMaterialFull: "Bạc 41.70% - Bạc Trắng 10K",
      purityCode: "AG 41.70 W",
      purityFactor: 0.417,
      hasSeries: false,
      qty: 15,
      stoneWeightPerPsc: 0.5000,
      goldWeightPerPsc: 11.5000,
      laborCostPerPsc: 220000,
      discountPercent: 3.0,
      orderDate: "20/07/2026",
      qcDate: "27/08/2026",
      creator: "Lê Hoàng Long",
      createdDate: "27/08/2026 08:30",
      status: "Chờ phân bổ",
      seriesList: []
    },
    {
      id: "BAG-2608-005",
      bagCode: "BAG-2608-005",
      customerCode: "KH003",
      customerName: "2000003 - Tiệm Vàng Mi Hồng",
      soCode: "SO2608006",
      shippingArea: "TP. Hồ Chí Minh (Bình Thạnh)",
      itemCode: "AU0BC000011B00",
      category: "Vòng tay",
      rawMaterial: "AU 99.99",
      rawMaterialFull: "Vàng 99.99% - Vàng 24K",
      purityCode: "AU 99.99",
      purityFactor: 0.9999,
      hasSeries: false,
      qty: 5,
      stoneWeightPerPsc: 0.0000,
      goldWeightPerPsc: 37.5000,
      laborCostPerPsc: 650000,
      discountPercent: 4.0,
      orderDate: "05/08/2026",
      qcDate: "27/08/2026",
      creator: "Vũ Thị Mai",
      createdDate: "27/08/2026 10:00",
      status: "Chờ phân bổ",
      seriesList: []
    }
  ]);

  // Sample Data: Delivery Orders List
  const [deliveryOrders, setDeliveryOrders] = useState([
    {
      id: "DO20260825002",
      doCode: "DO20260825002",
      version: "V1.0",
      customerName: "2000001 - Vàng Kim Yến",
      customerCode: "KH001",
      rawMaterial: "AU 75.00 Y",
      purityCode: "AU 75.00 Y",
      purityFactor: 0.75,
      shippingAddress: "124 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      soCodes: ["SO2608001", "SO2608003"],
      totalBags: 3,
      totalQty: 30,
      totalGoldWeight: 401.7000,
      totalStoneWeight: 7.3000,
      totalWeight: 409.0000,
      totalLaborBeforeDiscount: 11020000,
      discountPercent: 5.0,
      totalLaborAfterDiscount: 10469000,
      orderDate: "15/07/2026",
      deliveryPlanDate: "28/08/2026",
      creator: "Nguyễn Văn An (VHKD)",
      createdAt: "25/08/2026 16:15",
      status: "Chờ giao",
      isInvoiced: true,
      invoiceNo: "INV-2026-00892",
      bags: [
        {
          bagCode: "BAG-2608-001",
          itemCode: "GY0RG000086A00",
          category: "Nhẫn nữ",
          rawMaterial: "AU 75.00 Y",
          hasSeries: true,
          totalQtyInStock: 10,
          exportQty: 10,
          goldWeightPerPsc: 14.2500,
          stoneWeightPerPsc: 0.2500,
          exportGoldWeight: 142.5000,
          exportStoneWeight: 2.5000,
          exportTotalWeight: 145.0000,
          laborPrice: 350000,
          laborAmount: 3500000,
          laborAmountAfter: 3325000,
          pickedSeries: [
            { seriesCode: "SR-2608-001-01", goldWeight: 14.2450, stoneWeight: 0.25, niSize: "Ni 48" },
            { seriesCode: "SR-2608-001-02", goldWeight: 14.1200, stoneWeight: 0.25, niSize: "Ni 48" },
            { seriesCode: "SR-2608-001-03", goldWeight: 14.3100, stoneWeight: 0.25, niSize: "Ni 50" },
            { seriesCode: "SR-2608-001-04", goldWeight: 14.0500, stoneWeight: 0.25, niSize: "Ni 50" },
            { seriesCode: "SR-2608-001-05", goldWeight: 14.2200, stoneWeight: 0.25, niSize: "Ni 52" },
            { seriesCode: "SR-2608-001-06", goldWeight: 14.4800, stoneWeight: 0.25, niSize: "Ni 52" },
            { seriesCode: "SR-2608-001-07", goldWeight: 14.3900, stoneWeight: 0.25, niSize: "Ni 54" },
            { seriesCode: "SR-2608-001-08", goldWeight: 14.1800, stoneWeight: 0.25, niSize: "Ni 54" },
            { seriesCode: "SR-2608-001-09", goldWeight: 14.2600, stoneWeight: 0.25, niSize: "Ni 56" },
            { seriesCode: "SR-2608-001-10", goldWeight: 14.3450, stoneWeight: 0.25, niSize: "Ni 56" },
          ]
        },
        {
          bagCode: "BAG-2608-002",
          itemCode: "GY0NL000012B00",
          category: "Dây chuyền",
          rawMaterial: "AU 75.00 Y",
          hasSeries: true,
          totalQtyInStock: 8,
          exportQty: 8,
          goldWeightPerPsc: 21.0000,
          stoneWeightPerPsc: 0.0000,
          exportGoldWeight: 168.0000,
          exportStoneWeight: 0.0000,
          exportTotalWeight: 168.0000,
          laborPrice: 520000,
          laborAmount: 4160000,
          laborAmountAfter: 3952000,
          pickedSeries: [
            { seriesCode: "SR-2608-002-01", goldWeight: 21.0200, stoneWeight: 0, length: "45cm" },
            { seriesCode: "SR-2608-002-02", goldWeight: 20.8500, stoneWeight: 0, length: "45cm" },
            { seriesCode: "SR-2608-002-03", goldWeight: 21.1800, stoneWeight: 0, length: "50cm" },
            { seriesCode: "SR-2608-002-04", goldWeight: 20.9500, stoneWeight: 0, length: "50cm" },
            { seriesCode: "SR-2608-002-05", goldWeight: 21.0500, stoneWeight: 0, length: "50cm" },
            { seriesCode: "SR-2608-002-06", goldWeight: 20.9200, stoneWeight: 0, length: "55cm" },
            { seriesCode: "SR-2608-002-07", goldWeight: 21.0100, stoneWeight: 0, length: "55cm" },
            { seriesCode: "SR-2608-002-08", goldWeight: 21.0200, stoneWeight: 0, length: "60cm" },
          ]
        },
        {
          bagCode: "BAG-2608-003",
          itemCode: "GY0ER000045C00",
          category: "Bông tai",
          rawMaterial: "AU 75.00 Y",
          hasSeries: false,
          totalQtyInStock: 12,
          exportQty: 12,
          goldWeightPerPsc: 7.6000,
          stoneWeightPerPsc: 0.4000,
          exportGoldWeight: 91.2000,
          exportStoneWeight: 4.8000,
          exportTotalWeight: 96.0000,
          laborPrice: 280000,
          laborAmount: 3360000,
          laborAmountAfter: 3192000,
          pickedSeries: []
        }
      ]
    },
    {
      id: "DO20260827001",
      doCode: "DO20260827001",
      version: "V1.0",
      customerName: "2000002 - Vàng Bạc Bảo Tín",
      customerCode: "KH002",
      rawMaterial: "AG 41.70 W",
      purityCode: "AG 41.70 W",
      purityFactor: 0.417,
      shippingAddress: "45 Hàng Bạc, Hoàn Kiếm, Hà Nội",
      soCodes: ["SO2608002"],
      totalBags: 1,
      totalQty: 15,
      totalGoldWeight: 172.5000,
      totalStoneWeight: 7.5000,
      totalWeight: 180.0000,
      totalLaborBeforeDiscount: 3300000,
      discountPercent: 3.0,
      totalLaborAfterDiscount: 3201000,
      orderDate: "20/07/2026",
      deliveryPlanDate: "29/08/2026",
      creator: "Lê Hoàng Long (VHKD)",
      createdAt: "27/08/2026 10:30",
      status: "Đã phân bổ",
      isInvoiced: false,
      invoiceNo: null,
      bags: [
        {
          bagCode: "BAG-2608-004",
          itemCode: "AG0RG000099A00",
          category: "Nhẫn nam",
          rawMaterial: "AG 41.70 W",
          hasSeries: false,
          exportQty: 15,
          goldWeightPerPsc: 11.5,
          stoneWeightPerPsc: 0.5,
          exportGoldWeight: 172.5000,
          exportStoneWeight: 7.5000,
          exportTotalWeight: 180.0000,
          laborPrice: 220000,
          laborAmount: 3300000,
          laborAmountAfter: 3201000,
          pickedSeries: []
        }
      ]
    },
    {
      id: "DO20260824003",
      doCode: "DO20260824003",
      version: "V1.0",
      customerName: "2000003 - Tiệm Vàng Mi Hồng",
      customerCode: "KH003",
      rawMaterial: "AU 99.99",
      purityCode: "AU 99.99",
      purityFactor: 0.9999,
      shippingAddress: "306 Bùi Hữu Nghĩa, P.2, Bình Thạnh, TP.HCM",
      soCodes: ["SO2608006"],
      totalBags: 1,
      totalQty: 5,
      totalGoldWeight: 187.5000,
      totalStoneWeight: 0.0000,
      totalWeight: 187.5000,
      totalLaborBeforeDiscount: 3250000,
      discountPercent: 4.0,
      totalLaborAfterDiscount: 3120000,
      orderDate: "05/08/2026",
      deliveryPlanDate: "27/08/2026",
      creator: "Vũ Thị Mai (VHKD)",
      createdAt: "24/08/2026 11:20",
      status: "Đang giao",
      isInvoiced: true,
      invoiceNo: "INV-2026-00845",
      bags: []
    },
    {
      id: "DO20260822004",
      doCode: "DO20260822004",
      version: "V1.0",
      customerName: "2000001 - Vàng Kim Yến",
      customerCode: "KH001",
      rawMaterial: "AU 75.00 Y",
      purityCode: "AU 75.00 Y",
      purityFactor: 0.75,
      shippingAddress: "124 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
      soCodes: ["SO2608001"],
      totalBags: 1,
      totalQty: 4,
      totalGoldWeight: 56.0000,
      totalStoneWeight: 1.0000,
      totalWeight: 57.0000,
      totalLaborBeforeDiscount: 1520000,
      discountPercent: 5.0,
      totalLaborAfterDiscount: 1444000,
      orderDate: "15/07/2026",
      deliveryPlanDate: "24/08/2026",
      creator: "Nguyễn Văn An (VHKD)",
      createdAt: "22/08/2026 09:30",
      status: "Chờ giao lại",
      isInvoiced: true,
      invoiceNo: "INV-2026-00780",
      bags: []
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getBagAllocation = (bag) => {
    if (bag.hasSeries) {
      const pickedSeriesCodes = selectedSeriesMap[bag.id] || [];
      const pickedCount = pickedSeriesCodes.length;
      if (pickedCount === 0) {
        const sumGold = bag.seriesList.reduce((acc, s) => acc + s.goldWeight, 0);
        const sumStone = bag.seriesList.reduce((acc, s) => acc + (s.stoneWeight || 0), 0);
        return {
          qty: bag.qty,
          goldWeight: sumGold,
          stoneWeight: sumStone,
          totalWeight: sumGold + sumStone,
          pickedSeries: bag.seriesList.map(s => s.seriesCode)
        };
      }
      const pickedSeriesObjs = bag.seriesList.filter(s => pickedSeriesCodes.includes(s.seriesCode));
      const sumGold = pickedSeriesObjs.reduce((acc, s) => acc + s.goldWeight, 0);
      const sumStone = pickedSeriesObjs.reduce((acc, s) => acc + (s.stoneWeight || 0), 0);
      return {
        qty: pickedCount,
        goldWeight: sumGold,
        stoneWeight: sumStone,
        totalWeight: sumGold + sumStone,
        pickedSeries: pickedSeriesCodes
      };
    } else {
      const goldW = bag.qty * bag.goldWeightPerPsc;
      const stoneW = bag.qty * (bag.stoneWeightPerPsc || 0);
      return {
        qty: bag.qty,
        goldWeight: goldW,
        stoneWeight: stoneW,
        totalWeight: goldW + stoneW,
        pickedSeries: []
      };
    }
  };

  const handleOpenSeriesDrawer = (e, bag) => {
    e.stopPropagation();
    setActiveSeriesBag(bag);
    const currentlySelected = selectedSeriesMap[bag.id] || bag.seriesList.map(s => s.seriesCode);
    setTempSelectedSeries(currentlySelected);
  };

  const handleToggleSeriesInDrawer = (seriesCode) => {
    if (tempSelectedSeries.includes(seriesCode)) {
      setTempSelectedSeries(tempSelectedSeries.filter(code => code !== seriesCode));
    } else {
      setTempSelectedSeries([...tempSelectedSeries, seriesCode]);
    }
  };

  const handleSaveSeriesDrawer = () => {
    if (!activeSeriesBag) return;
    if (tempSelectedSeries.length === 0) {
      showToast("⚠️ Chị đẹp vui lòng chọn ít nhất 1 mã Series để xuất giao!");
      return;
    }
    setSelectedSeriesMap(prev => ({
      ...prev,
      [activeSeriesBag.id]: tempSelectedSeries
    }));
    if (!selectedBagIds.includes(activeSeriesBag.id)) {
      setSelectedBagIds(prev => [...prev, activeSeriesBag.id]);
    }
    showToast(`✅ Đã chọn ${tempSelectedSeries.length}/${activeSeriesBag.qty} mã Series cho ${activeSeriesBag.bagCode}!`);
    setActiveSeriesBag(null);
  };

  const toggleSelectBag = (id) => {
    const bag = pendingBags.find(b => b.id === id);
    if (!bag) return;
    if (selectedBagIds.includes(id)) {
      setSelectedBagIds(selectedBagIds.filter(item => item !== id));
    } else {
      if (bag.hasSeries && !selectedSeriesMap[bag.id]) {
        setSelectedSeriesMap(prev => ({
          ...prev,
          [bag.id]: bag.seriesList.map(s => s.seriesCode)
        }));
      }
      setSelectedBagIds([...selectedBagIds, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered & Sorted Pending Bags
  const filteredAndSortedPendingBags = useMemo(() => {
    return pendingBags
      .filter(bag => {
        const matchCustomer = filterCustomer === "all" || bag.customerCode === filterCustomer;
        const matchPurity = filterPurity === "all" || bag.purityCode === filterPurity;
        const matchSo = filterSo === "all" || bag.soCode === filterSo;
        const term = searchTerm.toLowerCase().trim();
        const matchSearch =
          !term ||
          bag.bagCode.toLowerCase().includes(term) ||
          bag.soCode.toLowerCase().includes(term) ||
          bag.itemCode.toLowerCase().includes(term) ||
          bag.customerName.toLowerCase().includes(term);

        return matchCustomer && matchPurity && matchSo && matchSearch;
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        let valA, valB;
        if (sortField === "bagCode") {
          valA = a.bagCode;
          valB = b.bagCode;
        } else if (sortField === "soCode") {
          valA = a.soCode;
          valB = b.soCode;
        } else if (sortField === "qty") {
          valA = getBagAllocation(a).qty;
          valB = getBagAllocation(b).qty;
        } else if (sortField === "goldWeight") {
          valA = getBagAllocation(a).goldWeight;
          valB = getBagAllocation(b).goldWeight;
        } else if (sortField === "stoneWeight") {
          valA = getBagAllocation(a).stoneWeight;
          valB = getBagAllocation(b).stoneWeight;
        } else if (sortField === "totalWeight") {
          valA = getBagAllocation(a).totalWeight;
          valB = getBagAllocation(b).totalWeight;
        } else if (sortField === "laborCost") {
          valA = a.laborCostPerPsc;
          valB = b.laborCostPerPsc;
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [pendingBags, filterCustomer, filterPurity, filterSo, searchTerm, sortField, sortDirection, selectedSeriesMap]);

  // Handle Adjustment Modal
  const handleOpenAdjustmentModal = (doObj) => {
    setAdjustingDO(doObj);
    setAdjustReason("Khách hàng yêu cầu đổi cơ cấu số lượng món đợt này.");
    setActiveSeriesPickerBagCode("BAG-2608-001");

    const draftBags = doObj.bags.map(b => {
      let seriesState = [];
      if (b.hasSeries && b.pickedSeries) {
        seriesState = b.pickedSeries.map(s => ({
          ...s,
          isSelectedV2: true,
        }));
      }
      return {
        ...b,
        originalQty: b.exportQty,
        originalGoldWeight: b.exportGoldWeight,
        originalStoneWeight: b.exportStoneWeight,
        originalTotalWeight: b.exportTotalWeight,
        originalLaborAmount: b.laborAmountAfter,
        newQty: b.exportQty,
        newGoldWeight: b.exportGoldWeight,
        newStoneWeight: b.exportStoneWeight,
        newTotalWeight: b.exportTotalWeight,
        newLaborAmount: b.laborAmountAfter,
        seriesDraft: seriesState,
      };
    });

    setAdjustDraftBags(draftBags);
  };

  const handleToggleSeriesInAdjustModal = (bagCode, seriesCode) => {
    setAdjustDraftBags(prev =>
      prev.map(b => {
        if (b.bagCode === bagCode) {
          const currentActiveCount = b.seriesDraft.filter(s => s.isSelectedV2).length;
          const targetSeries = b.seriesDraft.find(s => s.seriesCode === seriesCode);
          
          if (targetSeries.isSelectedV2 && currentActiveCount <= 1) {
            showToast("⚠️ Quy tắc: Không có trường hợp điều chỉnh về 0! Mỗi Lô phải giữ ít nhất 1 pcs.");
            return b;
          }

          const updatedSeries = b.seriesDraft.map(s =>
            s.seriesCode === seriesCode ? { ...s, isSelectedV2: !s.isSelectedV2 } : s
          );
          const activeSeries = updatedSeries.filter(s => s.isSelectedV2);
          const newQty = activeSeries.length;
          const newGoldWeight = activeSeries.reduce((acc, s) => acc + s.goldWeight, 0);
          const newStoneWeight = activeSeries.reduce((acc, s) => acc + (s.stoneWeight || 0), 0);
          const newTotalWeight = newGoldWeight + newStoneWeight;
          const newLaborAmount = newQty * b.laborPrice * (1 - (adjustingDO?.discountPercent || 5) / 100);

          return {
            ...b,
            seriesDraft: updatedSeries,
            newQty,
            newGoldWeight,
            newStoneWeight,
            newTotalWeight,
            newLaborAmount,
          };
        }
        return b;
      })
    );
  };

  const [showAddBagModal, setShowAddBagModal] = useState(false);

  const handleRemoveBagFromAdjust = (bagCode) => {
    if (adjustDraftBags.length <= 1) {
      showToast("⚠️ Phiếu Giao Hàng phải giữ lại ít nhất 1 Lô!");
      return;
    }
    setAdjustDraftBags(prev => prev.filter(b => b.bagCode !== bagCode));
    showToast(`🗑️ Đã bớt Lô ${bagCode} khỏi đợt điều chỉnh này.`);
  };

  const handleAddBagToAdjust = (bag) => {
    const isAlreadyIn = adjustDraftBags.some(b => b.bagCode === bag.bagCode);
    if (isAlreadyIn) {
      showToast("⚠️ Lô này đã có trong danh sách điều chỉnh!");
      return;
    }

    let seriesState = [];
    if (bag.hasSeries && bag.seriesList) {
      seriesState = bag.seriesList.map(s => ({
        ...s,
        isSelectedV2: true,
      }));
    }

    const newBagDraft = {
      bagCode: bag.bagCode,
      itemCode: bag.itemCode,
      category: bag.category,
      rawMaterial: bag.rawMaterial,
      hasSeries: bag.hasSeries,
      totalQtyInStock: bag.qty,
      laborPrice: bag.laborCostPerPsc,
      goldWeightPerPsc: bag.goldWeightPerPsc,
      stoneWeightPerPsc: bag.stoneWeightPerPsc || 0,
      originalQty: 0,
      originalGoldWeight: 0,
      originalStoneWeight: 0,
      originalTotalWeight: 0,
      originalLaborAmount: 0,
      newQty: bag.qty,
      newGoldWeight: bag.qty * bag.goldWeightPerPsc,
      newStoneWeight: bag.qty * (bag.stoneWeightPerPsc || 0),
      newTotalWeight: bag.qty * (bag.goldWeightPerPsc + (bag.stoneWeightPerPsc || 0)),
      newLaborAmount: bag.qty * bag.laborCostPerPsc * (1 - (adjustingDO?.discountPercent || 5) / 100),
      seriesDraft: seriesState,
      isAddedInAdjust: true,
    };

    setAdjustDraftBags(prev => [...prev, newBagDraft]);
    setShowAddBagModal(false);
    showToast(`➕ Đã thêm Lô ${bag.bagCode} vào đợt điều chỉnh!`);
  };

  const availablePendingBagsForAdjust = useMemo(() => {
    if (!adjustingDO) return [];
    return pendingBags.filter(
      b => b.customerCode === adjustingDO.customerCode &&
           !adjustDraftBags.some(db => db.bagCode === b.bagCode)
    );
  }, [adjustingDO, pendingBags, adjustDraftBags]);

  const handleSubmitAdjustmentToWarehouse = () => {
    if (!adjustingDO) return;
    
    const totalNewQty = adjustDraftBags.reduce((a, b) => a + b.newQty, 0);
    if (totalNewQty <= 0) {
      showToast("❌ Vi phạm quy tắc: Không được phép điều chỉnh toàn bộ DO về 0!");
      return;
    }

    setDeliveryOrders(prev =>
      prev.map(d => {
        if (d.id === adjustingDO.id) {
          const updatedBags = d.bags.map(b => {
            const draft = adjustDraftBags.find(db => db.bagCode === b.bagCode);
            if (!draft) return b;
            return {
              ...b,
              exportQty: draft.newQty,
              exportGoldWeight: draft.newGoldWeight,
              exportStoneWeight: draft.newStoneWeight,
              exportTotalWeight: draft.newTotalWeight,
              laborAmountAfter: draft.newLaborAmount,
              pickedSeries: draft.hasSeries ? draft.seriesDraft.filter(s => s.isSelectedV2) : [],
            };
          });

          const totalQty = updatedBags.reduce((acc, b) => acc + b.exportQty, 0);
          const totalGoldWeight = updatedBags.reduce((acc, b) => acc + b.exportGoldWeight, 0);
          const totalStoneWeight = updatedBags.reduce((acc, b) => acc + b.exportStoneWeight, 0);
          const totalWeight = totalGoldWeight + totalStoneWeight;
          const totalLaborAfterDiscount = updatedBags.reduce((acc, b) => acc + b.laborAmountAfter, 0);

          return {
            ...d,
            bags: updatedBags,
            totalQty,
            totalGoldWeight,
            totalStoneWeight,
            totalWeight,
            totalLaborAfterDiscount,
          };
        }
        return d;
      })
    );

    showToast(`🚀 Đã gửi Yêu Cầu Điều Chỉnh đến Kho Thành Phẩm để xử lý phân bổ lại hàng (Không cần duyệt)!`);
    setAdjustingDO(null);
  };

  const handleCancelDOBeforeInvoice = (doObj) => {
    if (doObj.isInvoiced) {
      showToast("🚫 Đã xuất hóa đơn: KHÔNG ĐƯỢC PHÉP HỦY PHIẾU! Chỉ được phép điều chỉnh.");
      return;
    }
    if (confirm(`Chị đẹp có chắc chắn muốn hủy Phiếu Giao Hàng "${doObj.doCode}" không ạ? (Kho sẽ phân bổ lại hàng)`)) {
      setDeliveryOrders(prev =>
        prev.map(item => item.id === doObj.id ? { ...item, status: "Đã hủy" } : item)
      );
      showToast(`🗑️ Đã hủy Phiếu Giao Hàng ${doObj.doCode}. Hệ thống đã trigger Kho phân bổ lại tồn kho.`);
    }
  };

  const toggleDoRow = (id) => {
    setExpandedDoRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateDOFromSelected = () => {
    if (selectedBagIds.length === 0) {
      showToast("⚠️ Chị đẹp vui lòng tích chọn ít nhất 1 Lô để lập Phiếu Giao Hàng!");
      return;
    }
    router.push("/delivery-orders/create");
  };

  const filteredDOs = useMemo(() => {
    return deliveryOrders.filter(d => {
      let matchStatus = true;
      if (doStatusFilter === "all") matchStatus = true;
      else matchStatus = d.status === doStatusFilter;

      const matchSearch =
        d.doCode.toLowerCase().includes(doSearchTerm.toLowerCase()) ||
        d.customerName.toLowerCase().includes(doSearchTerm.toLowerCase()) ||
        (d.invoiceNo && d.invoiceNo.toLowerCase().includes(doSearchTerm.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [deliveryOrders, doStatusFilter, doSearchTerm]);

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#005a46] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2.5 border border-emerald-300 animate-in slide-in-from-top duration-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center text-xs text-gray-500 space-x-2">
        <span className="hover:text-[#005a46] cursor-pointer">Vận hành kinh doanh (Sales Ops)</span>
        <span>&gt;</span>
        <span className="font-semibold text-gray-900">Quản lý Phiếu Giao Hàng (DO)</span>
      </div>

      {/* Main Title Bar (Tinh gọn, sạch đẹp, bỏ badge & subtitle thừa) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 text-[#005a46] rounded-xl">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Phiếu Giao Hàng (Delivery Order - DO)
            </h1>
          </div>
        </div>

        {mainTab === "pending-bags" && (
          <button
            onClick={handleCreateDOFromSelected}
            disabled={selectedBagIds.length === 0}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center ${
              selectedBagIds.length > 0
                ? "bg-[#005a46] text-white hover:bg-[#004737] shadow-xs cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Lập Phiếu DO ({selectedBagIds.length})
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2 MAIN NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex border-b border-gray-200 bg-white px-3 rounded-t-xl shadow-2xs">
        <button
          onClick={() => setMainTab("do-list")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center space-x-2 transition ${
            mainTab === "do-list"
              ? "border-[#005a46] text-[#005a46] bg-emerald-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Danh sách Phiếu Giao Hàng (DO)</span>
          <span className="px-2 py-0.2 text-xs bg-emerald-100 text-[#005a46] rounded-full font-bold">
            {deliveryOrders.length}
          </span>
        </button>

        <button
          onClick={() => setMainTab("pending-bags")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center space-x-2 transition ${
            mainTab === "pending-bags"
              ? "border-[#005a46] text-[#005a46] bg-emerald-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Danh sách Bag Chờ phân bổ giao hàng</span>
          <span className="px-2 py-0.2 text-xs bg-blue-100 text-blue-700 rounded-full font-bold">
            {pendingBags.length}
          </span>
        </button>
      </div>

      {/* TAB 1: DANH SÁCH PHIẾU GIAO HÀNG (DO) */}
      {mainTab === "do-list" && (
        <div className="space-y-3">
          {/* Sub-tabs Lọc 7 Trạng thái DO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex space-x-1 overflow-x-auto text-xs font-semibold">
              {[
                { key: "all", label: "Tất cả", count: deliveryOrders.length },
                { key: "Đã phân bổ", label: "Đã phân bổ", count: deliveryOrders.filter(d => d.status === "Đã phân bổ").length },
                { key: "Chờ lập hóa đơn", label: "Chờ lập HĐ", count: deliveryOrders.filter(d => d.status === "Chờ lập hóa đơn").length },
                { key: "Chờ giao", label: "Chờ giao", count: deliveryOrders.filter(d => d.status === "Chờ giao").length },
                { key: "Đang giao", label: "Đang giao", count: deliveryOrders.filter(d => d.status === "Đang giao").length },
                { key: "Đã giao", label: "Đã giao", count: deliveryOrders.filter(d => d.status === "Đã giao").length },
                { key: "Chờ giao lại", label: "Chờ giao lại", count: deliveryOrders.filter(d => d.status === "Chờ giao lại").length },
                { key: "Đã hủy", label: "Đã hủy", count: deliveryOrders.filter(d => d.status === "Đã hủy").length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDoStatusFilter(tab.key)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${
                    doStatusFilter === tab.key
                      ? "bg-[#005a46] text-white font-bold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={doSearchTerm}
                onChange={(e) => setDoSearchTerm(e.target.value)}
                placeholder="Tìm mã DO, Khách hàng, HĐ..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* DO Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3 py-3 text-center w-8">#</th>
                    <th className="px-3 py-3 text-left">Mã DO</th>
                    <th className="px-3 py-3 text-left">Khách hàng</th>
                    <th className="px-3 py-3 text-left">Nguyên liệu - Hàm lượng - Màu NL</th>
                    <th className="px-3 py-3 text-center">Tổng SL</th>
                    <th className="px-3 py-3 text-right font-bold text-amber-900 bg-amber-50/30">Tổng TL Vàng (g)</th>
                    <th className="px-3 py-3 text-right text-gray-600">Tổng TL Đá (g)</th>
                    <th className="px-3 py-3 text-right font-bold text-purple-900 bg-purple-50/30">Tổng TL (g)</th>
                    <th className="px-3 py-3 text-center">% CK</th>
                    <th className="px-3 py-3 text-right">Tiền công sau CK</th>
                    <th className="px-3 py-3 text-center">Trạng thái DO</th>
                    <th className="px-3 py-3 text-center w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDOs.map(d => {
                    const isExpanded = !!expandedDoRows[d.id];
                    const goldW = d.totalGoldWeight || 0;
                    const stoneW = d.totalStoneWeight || 0;
                    const totalW = d.totalWeight || (goldW + stoneW);

                    return (
                      <React.Fragment key={d.id}>
                        <tr
                          onClick={() => toggleDoRow(d.id)}
                          className={`hover:bg-emerald-50/30 cursor-pointer transition select-none ${
                            isExpanded ? "bg-emerald-50/40" : ""
                          }`}
                        >
                          <td className="px-3 py-3 text-center text-gray-400">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-[#005a46] mx-auto" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400 mx-auto" />
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-[#005a46] font-mono whitespace-nowrap">
                            {d.doCode}
                          </td>
                          <td className="px-3 py-3 text-gray-800 font-medium max-w-[150px] truncate" title={d.customerName}>
                            {d.customerName}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-900 rounded font-bold border border-amber-200 text-[11px]">
                              {d.rawMaterial || d.purityCode}
                            </span>
                          </td>

                          <td className="px-3 py-3 text-center whitespace-nowrap font-bold text-gray-900">
                            {d.totalQty} pcs
                          </td>

                          {/* Tổng TL Vàng (g) */}
                          <td className="px-3 py-3 text-right font-mono font-bold text-amber-900 bg-amber-50/20 whitespace-nowrap">
                            {goldW.toFixed(4)}
                          </td>

                          {/* Tổng TL Đá (g) */}
                          <td className="px-3 py-3 text-right font-mono text-gray-600 whitespace-nowrap">
                            {stoneW.toFixed(4)}
                          </td>

                          {/* Tổng TL (g) */}
                          <td className="px-3 py-3 text-right font-mono font-bold text-purple-900 bg-purple-50/20 whitespace-nowrap">
                            {totalW.toFixed(4)}
                          </td>

                          <td className="px-3 py-3 text-center whitespace-nowrap font-bold text-emerald-700">
                            {d.discountPercent}%
                          </td>
                          <td className="px-3 py-3 text-right font-bold text-[#005a46] whitespace-nowrap">
                            {d.totalLaborAfterDiscount.toLocaleString("vi-VN")} đ
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                d.status === "Đã phân bổ"
                                  ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                                  : d.status === "Chờ lập hóa đơn"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : d.status === "Chờ giao"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : d.status === "Đang giao"
                                  ? "bg-cyan-50 text-cyan-800 border-cyan-300"
                                  : d.status === "Đã giao"
                                  ? "bg-purple-50 text-purple-800 border-purple-300"
                                  : d.status === "Chờ giao lại"
                                  ? "bg-orange-50 text-orange-800 border-orange-300"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>

                          {/* CỘT THAO TÁC XỬ LÝ DẠNG ICON GỌN GÀNG KÈM TOOLTIP */}
                          <td className="px-3 py-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {d.isInvoiced ? (
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenAdjustmentModal(d)}
                                  className="p-1.5 bg-purple-50 hover:bg-purple-700 text-purple-700 hover:text-white rounded-lg border border-purple-200 transition shadow-2xs"
                                  title="Yêu cầu Điều chỉnh (Gửi Kho xử lý)"
                                >
                                  <GitBranch className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className="p-1.5 text-gray-300 cursor-not-allowed rounded-lg"
                                  title="Đã xuất hóa đơn: Tuyệt đối không được phép hủy phiếu!"
                                >
                                  <Lock className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-1.5">
                                <Link
                                  href={`/delivery-orders/create?doId=${d.id}&editMode=in_place`}
                                  className="p-1.5 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white rounded-lg border border-amber-300 transition shadow-2xs"
                                  title="Sửa đè trực tiếp (Kho phân bổ lại)"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Link>

                                {d.status === "Đã phân bổ" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeliveryOrders(prev =>
                                        prev.map(item => item.id === d.id ? { ...item, status: "Chờ lập hóa đơn" } : item)
                                      );
                                      showToast(`🚀 Đã chuyển DO ${d.doCode} sang Kho Thành Phẩm chờ lập hóa đơn!`);
                                    }}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-700 text-[#005a46] hover:text-white rounded-lg border border-emerald-300 transition shadow-2xs"
                                    title="Chuyển Kho đóng gói (Chờ lập HĐ)"
                                  >
                                    <Send className="h-4 w-4" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleCancelDOBeforeInvoice(d)}
                                  className="p-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg border border-red-200 transition shadow-2xs"
                                  title="Hủy Phiếu Giao Hàng (Kho sẽ phân bổ lại)"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {isExpanded && d.bags && d.bags.length > 0 && (
                          <tr className="bg-gray-50/70 border-b border-gray-200">
                            <td colSpan={12} className="px-6 py-3">
                              <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                                <div className="text-xs font-bold text-gray-800 flex items-center justify-between">
                                  <span>Chi tiết {d.bags.length} Lô trong Phiếu Giao Hàng {d.doCode}</span>
                                  <span className="text-gray-500 font-normal">Địa chỉ: {d.shippingAddress}</span>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200 text-xs">
                                  <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-[10px]">
                                    <tr>
                                      <th className="px-2 py-1.5 text-left">Mã Lô</th>
                                      <th className="px-2 py-1.5 text-left">Mã Item & Chủng loại</th>
                                      <th className="px-2 py-1.5 text-right">SL Xuất</th>
                                      <th className="px-2 py-1.5 text-right font-bold text-amber-900 bg-amber-50/20">TL Kim Loại (g)</th>
                                      <th className="px-2 py-1.5 text-right text-gray-600">TL Đá (g)</th>
                                      <th className="px-2 py-1.5 text-right font-bold text-purple-900 bg-purple-50/20">Tổng TL (g)</th>
                                      <th className="px-2 py-1.5 text-right">Đơn giá công</th>
                                      <th className="px-2 py-1.5 text-right">Tiền công sau CK</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 bg-white">
                                    {d.bags.map((b, idx) => (
                                      <tr key={idx}>
                                        <td className="px-2 py-1.5 font-bold font-mono text-[#005a46]">{b.bagCode}</td>
                                        <td className="px-2 py-1.5">{b.itemCode} ({b.category})</td>
                                        <td className="px-2 py-1.5 text-right font-bold text-gray-900">{b.exportQty}</td>
                                        <td className="px-2 py-1.5 text-right font-mono text-amber-900 bg-amber-50/10">{b.exportGoldWeight ? b.exportGoldWeight.toFixed(4) : (b.exportQty * b.goldWeightPerPsc).toFixed(4)}</td>
                                        <td className="px-2 py-1.5 text-right font-mono text-gray-600">{b.exportStoneWeight ? b.exportStoneWeight.toFixed(4) : (b.exportQty * (b.stoneWeightPerPsc || 0)).toFixed(4)}</td>
                                        <td className="px-2 py-1.5 text-right font-mono font-bold text-purple-900 bg-purple-50/10">{b.exportTotalWeight ? b.exportTotalWeight.toFixed(4) : (b.exportQty * (b.goldWeightPerPsc + (b.stoneWeightPerPsc || 0))).toFixed(4)}</td>
                                        <td className="px-2 py-1.5 text-right text-gray-600">{b.laborPrice?.toLocaleString("vi-VN")} đ</td>
                                        <td className="px-2 py-1.5 text-right font-bold text-[#005a46]">
                                          {b.laborAmountAfter?.toLocaleString("vi-VN")} đ
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DANH SÁCH BAG CHỜ PHÂN BỔ GIAO HÀNG (ĐÃ ĐIỀU CHỈNH CỘT, SORT, FILTER) */}
      {/* ========================================================================= */}
      {mainTab === "pending-bags" && (
        <div className="space-y-3">
          {/* Bộ lọc Filter & Search Tối ưu */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Khách hàng</label>
                <select
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded-lg text-xs"
                >
                  <option value="all">Tất cả khách hàng</option>
                  <option value="KH001">2000001 - Vàng Kim Yến</option>
                  <option value="KH002">2000002 - Vàng Bạc Bảo Tín</option>
                  <option value="KH003">2000003 - Tiệm Vàng Mi Hồng</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Mã Đơn hàng (SO)</label>
                <select
                  value={filterSo}
                  onChange={(e) => setFilterSo(e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded-lg text-xs"
                >
                  <option value="all">Tất cả đơn hàng (SO)</option>
                  <option value="SO2608001">SO2608001</option>
                  <option value="SO2608002">SO2608002</option>
                  <option value="SO2608003">SO2608003</option>
                  <option value="SO2608006">SO2608006</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Nguyên liệu - Hàm lượng - Màu NL</label>
                <select
                  value={filterPurity}
                  onChange={(e) => setFilterPurity(e.target.value)}
                  className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-amber-900"
                >
                  <option value="all">Tất cả nguyên liệu</option>
                  <option value="AU 75.00 Y">AU 75.00 Y (Vàng 18K)</option>
                  <option value="AG 41.70 W">AG 41.70 W (Bạc 10K)</option>
                  <option value="AU 99.99">AU 99.99 (Vàng 24K)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Tìm kiếm nhanh</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mã Bag, SO, Item, Khách..."
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bảng Danh Sách Lô Chờ Giao: Đã Thêm Mã SO, TL Đá, Tổng TL, Đổi tên Nguyên liệu, Bỏ Cột Quản Lý Series & Công Sau CK */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider select-none text-[10px]">
                  <tr>
                    <th className="px-3 py-2.5 text-center w-8">
                      <input
                        type="checkbox"
                        checked={selectedBagIds.length === filteredAndSortedPendingBags.length && filteredAndSortedPendingBags.length > 0}
                        onChange={() => {
                          if (selectedBagIds.length === filteredAndSortedPendingBags.length) setSelectedBagIds([]);
                          else setSelectedBagIds(filteredAndSortedPendingBags.map(b => b.id));
                        }}
                        className="rounded text-[#005a46] focus:ring-0 cursor-pointer"
                      />
                    </th>

                    {/* Mã Lô (Bag) - Sortable */}
                    <th
                      onClick={() => handleSort("bagCode")}
                      className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Mã Lô (Bag)</span>
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </th>

                    {/* Khách hàng */}
                    <th className="px-3 py-2.5 text-left">Khách hàng</th>

                    {/* Mã SO - NEW & Sortable */}
                    <th
                      onClick={() => handleSort("soCode")}
                      className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Mã SO</span>
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </th>

                    {/* Item & Chủng loại */}
                    <th className="px-3 py-2.5 text-left">Item & Chủng loại</th>

                    {/* Nguyên liệu - Hàm lượng - Màu nguyên liệu (Ví dụ: AU 75.00 Y) */}
                    <th className="px-3 py-2.5 text-left whitespace-nowrap">
                      Nguyên liệu - Hàm lượng - Màu NL
                    </th>

                    {/* Danh sách Series */}
                    <th className="px-3 py-2.5 text-center whitespace-nowrap">Danh sách Series</th>

                    {/* SL Xuất - Sortable */}
                    <th
                      onClick={() => handleSort("qty")}
                      className="px-3 py-2.5 text-center cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>SL Xuất</span>
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </th>

                    {/* TL Kim loại (g) - Sortable */}
                    <th
                      onClick={() => handleSort("goldWeight")}
                      className="px-3 py-2.5 text-right cursor-pointer hover:bg-gray-100 transition whitespace-nowrap font-bold text-amber-900 bg-amber-50/30"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>TL Kim loại (g)</span>
                        <ArrowUpDown className="h-3 w-3 text-amber-600" />
                      </div>
                    </th>

                    {/* TL Đá (g) - NEW & Sortable */}
                    <th
                      onClick={() => handleSort("stoneWeight")}
                      className="px-3 py-2.5 text-right cursor-pointer hover:bg-gray-100 transition whitespace-nowrap text-gray-600"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>TL Đá (g)</span>
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </th>

                    {/* Tổng TL (g) - NEW & Sortable */}
                    <th
                      onClick={() => handleSort("totalWeight")}
                      className="px-3 py-2.5 text-right cursor-pointer hover:bg-gray-100 transition whitespace-nowrap font-bold text-purple-900 bg-purple-50/30"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Tổng TL (g)</span>
                        <ArrowUpDown className="h-3 w-3 text-purple-600" />
                      </div>
                    </th>

                    {/* Đơn giá công - Sortable */}
                    <th
                      onClick={() => handleSort("laborCost")}
                      className="px-3 py-2.5 text-right cursor-pointer hover:bg-gray-100 transition whitespace-nowrap"
                    >
                      <div className="flex items-center justify-end space-x-1">
                        <span>Đơn giá công</span>
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredAndSortedPendingBags.map((bag) => {
                    const isSelected = selectedBagIds.includes(bag.id);
                    const alloc = getBagAllocation(bag);

                    return (
                      <tr
                        key={bag.id}
                        onClick={() => toggleSelectBag(bag.id)}
                        className={`hover:bg-emerald-50/40 cursor-pointer transition ${
                          isSelected ? "bg-emerald-50/70 font-medium" : ""
                        }`}
                      >
                        <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectBag(bag.id)}
                            className="rounded text-[#005a46] focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-2.5 font-bold text-[#005a46] font-mono">{bag.bagCode}</td>
                        <td className="px-3 py-2.5 text-gray-800">{bag.customerName}</td>
                        <td className="px-3 py-2.5 font-mono font-bold text-blue-700">{bag.soCode}</td>
                        <td className="px-3 py-2.5">{bag.itemCode} ({bag.category})</td>
                        
                        {/* Nguyên liệu - Hàm lượng - Màu nguyên liệu: ví dụ AU 75.00 Y */}
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-bold font-mono text-[11px]" title={bag.rawMaterialFull}>
                            {bag.rawMaterial || bag.purityCode}
                          </span>
                        </td>

                        {/* Danh sách Series */}
                        <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          {bag.hasSeries ? (
                            <button
                              type="button"
                              onClick={(e) => handleOpenSeriesDrawer(e, bag)}
                              className="px-2 py-0.5 bg-emerald-100 hover:bg-[#005a46] text-emerald-900 hover:text-white rounded text-[10px] font-bold transition shadow-2xs"
                            >
                              View Series ({alloc.qty}/{bag.qty})
                            </button>
                          ) : (
                            <span className="text-gray-400 text-[10px] italic">Chọn cả lô</span>
                          )}
                        </td>

                        {/* SL Xuất */}
                        <td className="px-3 py-2.5 text-center font-bold text-gray-900">{alloc.qty} pcs</td>

                        {/* TL Kim loại (g) */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-900 bg-amber-50/20">
                          {alloc.goldWeight.toFixed(4)}
                        </td>

                        {/* TL Đá (g) */}
                        <td className="px-3 py-2.5 text-right font-mono text-gray-600">
                          {alloc.stoneWeight.toFixed(4)}
                        </td>

                        {/* Tổng TL (g) */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-purple-900 bg-purple-50/20">
                          {alloc.totalWeight.toFixed(4)}
                        </td>

                        {/* Đơn giá công */}
                        <td className="px-3 py-2.5 text-right text-gray-800 font-medium">
                          {bag.laborCostPerPsc.toLocaleString("vi-VN")} đ
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: YÊU CẦU ĐIỀU CHỈNH DO (GỬI KHO XỬ LÝ TRỰC TIẾP, ĐỦ TẤT CẢ CÁC CỘT) */}
      {/* ========================================================================= */}
      {adjustingDO && (() => {
        const totalOrigQty = adjustDraftBags.reduce((a, b) => a + (b.originalQty || 0), 0);
        const totalNewQty = adjustDraftBags.reduce((a, b) => a + (b.newQty || 0), 0);
        const totalOrigWeight = adjustDraftBags.reduce((a, b) => a + (b.originalTotalWeight || 0), 0);
        const totalNewWeight = adjustDraftBags.reduce((a, b) => a + (b.newTotalWeight || 0), 0);
        const totalOrigStone = adjustDraftBags.reduce((a, b) => a + (b.originalStoneWeight || 0), 0);
        const totalNewStone = adjustDraftBags.reduce((a, b) => a + (b.newStoneWeight || 0), 0);
        const totalOrigGold = adjustDraftBags.reduce((a, b) => a + (b.originalGoldWeight || 0), 0);
        const totalNewGold = adjustDraftBags.reduce((a, b) => a + (b.newGoldWeight || 0), 0);
        const totalOrigLabor = adjustDraftBags.reduce((a, b) => a + (b.originalLaborAmount || 0), 0);
        const totalNewLabor = adjustDraftBags.reduce((a, b) => a + (b.newLaborAmount || 0), 0);

        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-7xl w-full p-5 shadow-2xl space-y-3.5 border border-purple-200 animate-in fade-in zoom-in duration-150 text-xs my-auto">
              {/* Header: Thông tin chung rõ ràng */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-purple-100 text-purple-800 rounded-xl">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gray-900">
                        Yêu Cầu Điều Chỉnh Phiếu Giao Hàng {adjustingDO.doCode}
                      </h3>
                      <span className="px-2 py-0.2 bg-blue-50 text-blue-800 font-bold rounded text-[10px] border border-blue-200">
                        HĐ: {adjustingDO.invoiceNo}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5 flex flex-wrap gap-x-4">
                      <span>Khách hàng: <b className="text-gray-900">{adjustingDO.customerName}</b></span>
                      <span>Nguyên liệu - Hàm lượng - Màu NL: <b className="text-amber-900">{adjustingDO.rawMaterial}</b></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setAdjustingDO(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* BẢNG CHI TIẾT: TÁCH 2 CỘT SL (BỎ PCS), CÔNG SAU CK, CHỐNG VỠ LAYOUT KHI CHỌN LÔ */}
              <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto max-h-[390px] shadow-2xs">
                <table className="min-w-[1020px] w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-2.5 py-2 text-left whitespace-nowrap">Mã Lô & Item</th>
                      <th className="px-2.5 py-2 text-center text-gray-600 whitespace-nowrap">SL Hiện Tại</th>
                      <th className="px-2.5 py-2 text-center bg-purple-50 text-purple-900 whitespace-nowrap">SL Mới</th>
                      <th className="px-2.5 py-2 text-right whitespace-nowrap">Tổng TL Cũ (g)</th>
                      <th className="px-2.5 py-2 text-right font-bold text-purple-900 bg-purple-50 whitespace-nowrap">Tổng TL Mới (g)</th>
                      <th className="px-2.5 py-2 text-right whitespace-nowrap">TL Đá Cũ (g)</th>
                      <th className="px-2.5 py-2 text-right text-gray-800 whitespace-nowrap">TL Đá Mới (g)</th>
                      <th className="px-2.5 py-2 text-right whitespace-nowrap">TL Vàng Cũ (g)</th>
                      <th className="px-2.5 py-2 text-right font-bold text-amber-900 bg-amber-50/50 whitespace-nowrap">TL Vàng Mới (g)</th>
                      <th className="px-2.5 py-2 text-right whitespace-nowrap">Đơn Giá Công</th>
                      <th className="px-2.5 py-2 text-right whitespace-nowrap">Công Sau CK Cũ</th>
                      <th className="px-2.5 py-2 text-right font-bold text-[#005a46] bg-emerald-50 whitespace-nowrap">Công Sau CK Mới</th>
                      <th className="px-2.5 py-2 text-center w-20 whitespace-nowrap">Chọn Series</th>
                      <th className="px-2.5 py-2 text-center w-12 whitespace-nowrap">Bớt Lô</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {adjustDraftBags.map((db, idx) => {
                      const isExpanded = activeSeriesPickerBagCode === db.bagCode;
                      return (
                        <React.Fragment key={idx}>
                          <tr className="hover:bg-gray-50/80 transition">
                            <td className="px-2.5 py-2 whitespace-nowrap">
                              <div className="font-bold font-mono text-[#005a46] flex items-center space-x-1">
                                <span>{db.bagCode}</span>
                                {db.isAddedInAdjust && (
                                  <span className="text-[9px] bg-green-100 text-green-800 px-1 rounded font-bold">Mới thêm</span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500">{db.itemCode}</div>
                            </td>

                            {/* Cột 1: SL Hiện Tại (Bỏ chữ pcs) */}
                            <td className="px-2 py-2 text-center font-mono font-bold text-gray-700 whitespace-nowrap">
                              {db.originalQty}
                            </td>

                            {/* Cột 2: SL Mới (Bỏ chữ pcs) */}
                            <td className="px-2 py-2 text-center bg-purple-50/40 font-mono font-bold text-purple-900 whitespace-nowrap">
                              <span className="bg-white px-2.5 py-0.5 rounded border border-purple-300 shadow-2xs">
                                {db.newQty}
                              </span>
                            </td>

                            {/* Tổng TL Cũ vs Mới */}
                            <td className="px-2.5 py-2 text-right font-mono text-gray-500 whitespace-nowrap">{db.originalTotalWeight?.toFixed(4)}</td>
                            <td className="px-2.5 py-2 text-right font-mono font-bold text-purple-900 bg-purple-50/40 whitespace-nowrap">{db.newTotalWeight?.toFixed(4)}</td>

                            {/* TL Đá Cũ vs Mới */}
                            <td className="px-2.5 py-2 text-right font-mono text-gray-400 whitespace-nowrap">{db.originalStoneWeight?.toFixed(4)}</td>
                            <td className="px-2.5 py-2 text-right font-mono text-gray-700 whitespace-nowrap">{db.newStoneWeight?.toFixed(4)}</td>

                            {/* TL Kim Loại (Vàng) Cũ vs Mới */}
                            <td className="px-2.5 py-2 text-right font-mono text-gray-500 whitespace-nowrap">{db.originalGoldWeight?.toFixed(4)}</td>
                            <td className="px-2.5 py-2 text-right font-mono font-bold text-amber-900 bg-amber-50/40 whitespace-nowrap">{db.newGoldWeight?.toFixed(4)}</td>

                            {/* Đơn giá công */}
                            <td className="px-2.5 py-2 text-right text-gray-600 whitespace-nowrap">{db.laborPrice?.toLocaleString("vi-VN")} đ</td>

                            {/* Tiền công sau CK cũ */}
                            <td className="px-2.5 py-2 text-right text-gray-400 line-through whitespace-nowrap">{db.originalLaborAmount?.toLocaleString("vi-VN")} đ</td>

                            {/* Tiền công sau CK mới (tính lại theo SL mới) */}
                            <td className="px-2.5 py-2 text-right font-bold text-[#005a46] bg-emerald-50 font-mono text-xs whitespace-nowrap">
                              {db.newLaborAmount?.toLocaleString("vi-VN")} đ
                            </td>

                            {/* Nút chọn lẻ Series */}
                            <td className="px-2 py-2 text-center whitespace-nowrap">
                              {db.hasSeries ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveSeriesPickerBagCode(isExpanded ? null : db.bagCode)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                                    isExpanded
                                      ? "bg-purple-700 text-white border-purple-800"
                                      : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                                  }`}
                                >
                                  {isExpanded ? "Đóng" : `Chọn (${db.newQty})`}
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">Cả lô</span>
                              )}
                            </td>

                            {/* Nút Bớt Lô */}
                            <td className="px-2 py-2 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleRemoveBagFromAdjust(db.bagCode)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                title="Bớt Lô này khỏi đợt điều chỉnh"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>

                          {/* Interactive Series Chip Checklist (Thiết kế bao bọc chống vỡ layout bảng) */}
                          {db.hasSeries && isExpanded && (
                            <tr className="bg-purple-50/20">
                              <td colSpan={14} className="p-3 bg-purple-50/30 border-y border-purple-200">
                                <div className="space-y-2 max-w-full">
                                  <div className="flex justify-between items-center text-[10px] text-gray-600">
                                    <span className="font-medium">
                                      💡 Chọn/bỏ chọn từng mã Series cho Lô <b>{db.bagCode}</b>:
                                    </span>
                                    <span className="font-bold text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200">
                                      Đang chọn: {db.seriesDraft.filter(s => s.isSelectedV2).length} / {db.seriesDraft.length}
                                    </span>
                                  </div>

                                  {/* Grid chip mềm mại, tự động ngắt dòng không kéo dãn bảng */}
                                  <div className="flex flex-wrap gap-1.5 max-w-full">
                                    {db.seriesDraft.map((s, sIdx) => {
                                      const isPicked = s.isSelectedV2;
                                      return (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={() => handleToggleSeriesInAdjustModal(db.bagCode, s.seriesCode)}
                                          className={`w-[125px] p-1.5 rounded-lg border text-center transition flex flex-col items-center justify-between shrink-0 ${
                                            isPicked
                                              ? "bg-white border-emerald-400 text-emerald-900 shadow-2xs font-bold ring-1 ring-emerald-200"
                                              : "bg-gray-100 border-gray-200 text-gray-400 line-through opacity-60 hover:opacity-100"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between w-full text-[10px]">
                                            <span className="font-mono">{s.seriesCode}</span>
                                            {isPicked ? (
                                              <Check className="h-3 w-3 text-emerald-600" />
                                            ) : (
                                              <X className="h-3 w-3 text-red-500" />
                                            )}
                                          </div>
                                          <div className="text-[9px] text-gray-500 mt-0.5">
                                            {s.goldWeight.toFixed(4)} g
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>

                  {/* DÒNG SUM TỔNG CỘNG SAU ĐIỀU CHỈNH (BỎ CHỮ PCS) */}
                  <tfoot className="bg-gray-100 font-bold text-gray-900 border-t-2 border-purple-200 text-xs">
                    <tr>
                      <td className="px-2.5 py-2.5 text-left text-purple-950 font-bold text-[11px] uppercase whitespace-nowrap">
                        Tổng Cộng Sau ĐC
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-gray-600 whitespace-nowrap">{totalOrigQty}</td>
                      <td className="px-2 py-2.5 text-center font-mono font-bold text-purple-950 bg-purple-100 whitespace-nowrap">{totalNewQty}</td>
                      <td className="px-2.5 py-2.5 text-right font-mono text-gray-500 whitespace-nowrap">{totalOrigWeight.toFixed(4)}</td>
                      <td className="px-2.5 py-2.5 text-right font-mono font-bold text-purple-950 bg-purple-100 whitespace-nowrap">{totalNewWeight.toFixed(4)}</td>
                      <td className="px-2.5 py-2.5 text-right font-mono text-gray-500 whitespace-nowrap">{totalOrigStone.toFixed(4)}</td>
                      <td className="px-2.5 py-2.5 text-right font-mono text-gray-800 whitespace-nowrap">{totalNewStone.toFixed(4)}</td>
                      <td className="px-2.5 py-2.5 text-right font-mono text-gray-500 whitespace-nowrap">{totalOrigGold.toFixed(4)}</td>
                      <td className="px-2.5 py-2.5 text-right font-mono font-bold text-amber-950 bg-amber-100 whitespace-nowrap">{totalNewGold.toFixed(4)}</td>
                      <td className="px-2.5 py-2.5 text-right text-gray-400 whitespace-nowrap">-</td>
                      <td className="px-2.5 py-2.5 text-right font-mono text-gray-400 line-through whitespace-nowrap">{totalOrigLabor.toLocaleString("vi-VN")} đ</td>
                      <td className="px-2.5 py-2.5 text-right font-bold text-[#005a46] bg-emerald-100 font-mono whitespace-nowrap">
                        {totalNewLabor.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-2.5 py-2.5 text-center text-gray-400 whitespace-nowrap">-</td>
                      <td className="px-2.5 py-2.5 text-center text-gray-400 whitespace-nowrap">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Nút Thêm Lô & Lý do điều chỉnh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div>
                  {availablePendingBagsForAdjust.length > 0 && (
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setShowAddBagModal(!showAddBagModal)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-xs font-bold transition flex items-center"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Thêm Lô vào DO ({availablePendingBagsForAdjust.length})
                      </button>

                      {/* Dropdown danh sách Lô có thể thêm */}
                      {showAddBagModal && (
                        <div className="absolute left-0 bottom-full mb-1 w-80 bg-white border border-purple-200 rounded-xl shadow-xl p-2 z-30 space-y-1 text-xs">
                          <div className="font-bold text-gray-700 px-1 py-0.5 border-b border-gray-100">
                            Chọn Lô cần thêm vào DO:
                          </div>
                          {availablePendingBagsForAdjust.map(b => (
                            <div
                              key={b.id}
                              onClick={() => handleAddBagToAdjust(b)}
                              className="p-2 hover:bg-purple-50 rounded-lg cursor-pointer flex items-center justify-between transition"
                            >
                              <div>
                                <div className="font-mono font-bold text-[#005a46]">{b.bagCode} ({b.soCode})</div>
                                <div className="text-[10px] text-gray-500">{b.itemCode} - Tồn: {b.qty} pcs</div>
                              </div>
                              <span className="text-purple-700 font-bold text-[11px]">+ Thêm</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Lý do điều chỉnh */}
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-[11px]">
                  Lý do điều chỉnh *:
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Nhập lý do điều chỉnh để Kho thực thi phân bổ lại..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-purple-600"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAdjustingDO(null)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAdjustmentToWarehouse}
                  className="px-5 py-2 font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl text-xs shadow-sm transition flex items-center"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Gửi YC Điều Chỉnh
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SERIES DRAWER FOR PENDING BAGS - CHUẨN THÔNG TIN SERIES & TÍNH TỔNG REALTIME */}
      {activeSeriesBag && (() => {
        const selectedSeriesObjects = activeSeriesBag.seriesList.filter(s =>
          tempSelectedSeries.includes(s.seriesCode)
        );
        const sumGoldWeight = selectedSeriesObjects.reduce((acc, s) => acc + s.goldWeight, 0);
        const sumStoneWeight = selectedSeriesObjects.reduce((acc, s) => acc + (s.stoneWeight || 0), 0);
        const sumTotalWeight = sumGoldWeight + sumStoneWeight;
        const isAllSelected = tempSelectedSeries.length === activeSeriesBag.seriesList.length && activeSeriesBag.seriesList.length > 0;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex justify-end animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between border-l border-emerald-200 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 bg-[#005a46] text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-emerald-800 rounded-lg">
                      <QrCode className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold">
                        Danh Sách Series - Lô {activeSeriesBag.bagCode}
                      </h2>
                      <p className="text-[11px] text-emerald-200">
                        {activeSeriesBag.itemCode} ({activeSeriesBag.category}) - {activeSeriesBag.rawMaterial}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSeriesBag(null)}
                    className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body Table */}
              <div className="p-3.5 flex-1 overflow-y-auto space-y-3">
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50 font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-3 py-2.5 text-center w-9">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={() => {
                              if (isAllSelected) setTempSelectedSeries([]);
                              else setTempSelectedSeries(activeSeriesBag.seriesList.map(s => s.seriesCode));
                            }}
                            className="rounded text-[#005a46] focus:ring-0 cursor-pointer"
                            title="Chọn tất cả / Bỏ chọn tất cả"
                          />
                        </th>
                        <th className="px-3 py-2.5 text-left">Mã Series</th>
                        <th className="px-3 py-2.5 text-right font-bold text-amber-900 bg-amber-50/40">TL Vàng (g)</th>
                        <th className="px-3 py-2.5 text-right text-gray-600">TL Đá (g)</th>
                        <th className="px-3 py-2.5 text-right font-bold text-purple-900 bg-purple-50/40">Tổng TL (g)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {activeSeriesBag.seriesList.map((s, idx) => {
                        const isPicked = tempSelectedSeries.includes(s.seriesCode);
                        const stoneW = s.stoneWeight || 0;
                        const totalW = s.goldWeight + stoneW;

                        return (
                          <tr
                            key={s.seriesCode}
                            onClick={() => handleToggleSeriesInDrawer(s.seriesCode)}
                            className={`hover:bg-emerald-50/50 cursor-pointer transition select-none ${
                              isPicked ? "bg-emerald-50/70 font-medium" : "opacity-75"
                            }`}
                          >
                            <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isPicked}
                                onChange={() => handleToggleSeriesInDrawer(s.seriesCode)}
                                className="rounded text-[#005a46] focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-2 font-bold font-mono text-[#005a46]">{s.seriesCode}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-amber-900 bg-amber-50/20">
                              {s.goldWeight.toFixed(4)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-gray-600">
                              {stoneW.toFixed(4)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-purple-900 bg-purple-50/20">
                              {totalW.toFixed(4)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Drawer Footer: Tự Động Tính Tổng Realtime Cho Các Series Được Chọn */}
              <div className="p-3.5 border-t border-gray-200 bg-gray-50 space-y-3 shadow-lg">
                {/* Live Realtime Sum Cards */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-gray-200 text-center">
                    <span className="text-[10px] text-gray-500 block">Đã chọn</span>
                    <b className="text-[#005a46] font-mono text-sm">{tempSelectedSeries.length}</b>
                    <span className="text-[10px] text-gray-400">/{activeSeriesBag.qty} pcs</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-800 block font-semibold">Tổng TL Vàng</span>
                    <b className="text-amber-900 font-mono text-xs">{sumGoldWeight.toFixed(4)}</b>
                    <span className="text-[10px] text-gray-400 block">g</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-gray-200 text-center">
                    <span className="text-[10px] text-gray-600 block">Tổng TL Đá</span>
                    <b className="text-gray-800 font-mono text-xs">{sumStoneWeight.toFixed(4)}</b>
                    <span className="text-[10px] text-gray-400 block">g</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-purple-200 text-center">
                    <span className="text-[10px] text-purple-800 block font-semibold">Tổng TL (Vàng+Đá)</span>
                    <b className="text-purple-900 font-mono text-xs">{sumTotalWeight.toFixed(4)}</b>
                    <span className="text-[10px] text-gray-400 block">g</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-500 italic">
                    * Bấm xác nhận để cập nhật số lượng xuất DO
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveSeriesBag(null)}
                      className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-semibold transition"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSeriesDrawer}
                      className="px-4 py-1.5 bg-[#005a46] hover:bg-[#004737] text-white font-bold rounded-lg text-xs shadow-xs transition"
                    >
                      Xác nhận chọn ({tempSelectedSeries.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
