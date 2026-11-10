// =============================================================================
// DỮ LIỆU MOCK KHO THÀNH PHẨM (CHUẨN HÓA ĐỒNG NHẤT 100% VỚI QLĐH & THỰC TẾ KHO)
// - Danh sách chờ xử lý lại là nơi lưu trữ các lô bị hủy đơn (SO123456), nằm ở kho để chờ gán vào đơn hàng mới.
// - Khi được pick vào đơn hàng mới (VD: SO2608011), các lô này mới có thông tin Lô mới / Đơn mới.
// - Sau đó đi các công đoạn làm mới lại (tẩy xi, khắc logo mới, xi lại) và nhập lại kho thành phẩm để giao hàng.
// =============================================================================

// Danh mục các loại Stamp (Trọng lượng đá / pcs) chuẩn nhà máy kim hoàn (Ví dụ: 15, 18, 20, 22, 24...)
export const MOCK_STAMP_OPTIONS = [
  { code: "15", name: "15", stoneWeightPerPcs: 0.0150 },
  { code: "18", name: "18", stoneWeightPerPcs: 0.0180 },
  { code: "20", name: "20", stoneWeightPerPcs: 0.0200 },
  { code: "22", name: "22", stoneWeightPerPcs: 0.0220 },
  { code: "24", name: "24", stoneWeightPerPcs: 0.0240 },
  { code: "26", name: "26", stoneWeightPerPcs: 0.0260 },
  { code: "28", name: "28", stoneWeightPerPcs: 0.0280 },
  { code: "30", name: "30", stoneWeightPerPcs: 0.0300 },
  { code: "0", name: "0 (Không đá)", stoneWeightPerPcs: 0.0000 },
];

// 1. DANH SÁCH TỒN KHO THÀNH PHẨM SẴN SÀNG BÁN (LOẠI TRỪ 100% HÀNG CHỜ XỬ LÝ LẠI - US-08.1)
// Trạng thái tồn chuẩn: Chờ phân bổ | Đã phân bổ | Chờ lập HĐ | Chờ giao
export const MOCK_COMMERCIAL_INVENTORY = [
  {
    id: "LOT-01",
    bagCode: "SO-260800001",
    customerCode: "2000001",
    customerName: "Cty TNHH Vàng Bạc Kim Yến",
    soCode: "SO2608001",
    itemCode: "GY0EC000133A00A000000000000000",
    drawingCode: "EG000133A00",
    itemName: "Bông Tai Nữ Vàng 61Y",
    category: "Bông tai",
    lop: "AU 61.00 Y",
    totalQty: 10,
    status: "Chờ phân bổ", // CHỜ PHÂN BỔ: NÚT "CHUYỂN CHỜ XỬ LÝ LẠI" ACTIVE!
    weight: 5.0000,
    metalWeight: 4.8500,
    stoneWeight: 0.1500,
    createdBy: "Nguyễn Thị Mỹ Dung",
    createdAt: "22/08/2026",
    dateIn: "24/08/2026",
    location: "Két K1 - Ngăn A01",
    hasSeries: true, // LÔ CÓ QUẢN LÝ SERIES CHI TIẾT
    series: [
      { seriNo: "SR-2608001-01", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-02", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-03", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-04", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-05", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-06", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-07", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-08", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-09", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" },
      { seriNo: "SR-2608001-10", status: "Chờ phân bổ", metalWeight: 0.4850, stoneWeight: 0.0150, stampCode: "15", weight: 0.5000, location: "Khay A1" }
    ]
  },
  {
    id: "LOT-02",
    bagCode: "SO-260800002",
    customerCode: "2000018",
    customerName: "Vàng Mi Hồng Sài Gòn",
    soCode: "SO2608002",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    drawingCode: "RG000144A00",
    itemName: "Nhẫn Nữ Ni NNU-015 Đá Trắng",
    category: "Nhẫn",
    lop: "AU 61.00 Y",
    totalQty: 8,
    status: "Chờ lập HĐ", // KHÔNG PHẢI CHỜ PHÂN BỔ: NÚT DISABLED
    weight: 3.6000,
    metalWeight: 3.4800,
    stoneWeight: 0.1200,
    createdBy: "Trần Văn Kho",
    createdAt: "23/08/2026",
    dateIn: "25/08/2026",
    location: "Két K1 - Ngăn A03",
    series: [
      { seriNo: "SR-2608002-01", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-02", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-03", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-04", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-05", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-06", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-07", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" },
      { seriNo: "SR-2608002-08", status: "Chờ lập HĐ", weight: 0.4500, location: "Khay B1" }
    ]
  },
  {
    id: "LOT-03",
    bagCode: "SO-260800003",
    customerCode: "2000030",
    customerName: "Doji Jewelry Miền Nam",
    soCode: "SO2608005",
    itemCode: "GY0BE000144A00A0000000CZWW1048",
    drawingCode: "BE000144A00",
    itemName: "Vòng Tay Nữ Bản Nhỏ VT-048",
    category: "Vòng tay",
    lop: "AU 61.00 Y",
    totalQty: 6,
    status: "Chờ giao", // KHÔNG PHẢI CHỜ PHÂN BỔ: NÚT DISABLED
    weight: 3.0000,
    metalWeight: 2.9100,
    stoneWeight: 0.0900,
    createdBy: "Lê Văn Châu",
    createdAt: "24/08/2026",
    dateIn: "26/08/2026",
    location: "Két K2 - Ngăn B02",
    series: [
      { seriNo: "SR-2608003-01", status: "Chờ giao", weight: 0.5000, location: "Khay C2" },
      { seriNo: "SR-2608003-02", status: "Chờ giao", weight: 0.5000, location: "Khay C2" },
      { seriNo: "SR-2608003-03", status: "Chờ giao", weight: 0.5000, location: "Khay C2" },
      { seriNo: "SR-2608003-04", status: "Chờ giao", weight: 0.5000, location: "Khay C2" },
      { seriNo: "SR-2608003-05", status: "Chờ giao", weight: 0.5000, location: "Khay C2" },
      { seriNo: "SR-2608003-06", status: "Chờ giao", weight: 0.5000, location: "Khay C2" }
    ]
  },
  {
    id: "LOT-04",
    bagCode: "SO-260800004",
    customerCode: "2000044",
    customerName: "Tiệm Vàng Ngọc Thẩm Cần Thơ",
    soCode: "SO2608009",
    itemCode: "GY0RM000186A00A00CZWW100000020",
    drawingCode: "RM000186A00",
    itemName: "Nhẫn Nam Vàng 18K Ni 18 Đá CZ",
    category: "Nhẫn",
    lop: "AU 75.00 Y",
    totalQty: 12,
    status: "Đã phân bổ", // ĐÃ PHÂN BỔ: NÚT DISABLED
    weight: 9.6000,
    metalWeight: 9.4200,
    stoneWeight: 0.1800,
    createdBy: "Nguyễn Thị Mỹ Dung",
    createdAt: "25/08/2026",
    dateIn: "27/08/2026",
    location: "Két K2 - Ngăn B05",
    series: [
      { seriNo: "SR-2608004-01", status: "Đã phân bổ", weight: 0.8000, location: "Khay D1" },
      { seriNo: "SR-2608004-02", status: "Đã phân bổ", weight: 0.8000, location: "Khay D1" },
      { seriNo: "SR-2608004-03", status: "Đã phân bổ", weight: 0.8000, location: "Khay D1" },
      { seriNo: "SR-2608004-04", status: "Đã phân bổ", weight: 0.8000, location: "Khay D1" }
    ]
  },
  {
    id: "LOT-05",
    bagCode: "SO-260800005",
    customerCode: "2037105",
    customerName: "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
    soCode: "SO2608011",
    itemCode: "GY0EC000133A00A00CZ88100000000",
    drawingCode: "EG000133A00",
    itemName: "Bông Tai Nữ Dáng Dài 61Y",
    category: "Bông tai",
    lop: "AU 61.00 Y",
    totalQty: 5,
    status: "Chờ lập HĐ", // KHÔNG PHẢI CHỜ PHÂN BỔ: NÚT DISABLED
    weight: 7.5000,
    metalWeight: 7.3500,
    stoneWeight: 0.1500,
    createdBy: "Trần Văn Kho",
    createdAt: "26/08/2026",
    dateIn: "28/08/2026",
    location: "Két K4 - Ngăn VIP",
    series: [
      { seriNo: "SR-2608005-01", status: "Chờ lập HĐ", weight: 1.5000, location: "Khay E1" },
      { seriNo: "SR-2608005-02", status: "Chờ lập HĐ", weight: 1.5000, location: "Khay E1" },
      { seriNo: "SR-2608005-03", status: "Chờ lập HĐ", weight: 1.5000, location: "Khay E1" },
      { seriNo: "SR-2608005-04", status: "Chờ lập HĐ", weight: 1.5000, location: "Khay E1" },
      { seriNo: "SR-2608005-05", status: "Chờ lập HĐ", weight: 1.5000, location: "Khay E1" }
    ]
  },
  {
    id: "LOT-06",
    bagCode: "SO-260800006",
    customerCode: "2000055",
    customerName: "Công ty TNHH MTV Tiệm Vàng Kim Phát",
    soCode: "SO2608018",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1020",
    drawingCode: "RG000144A00",
    itemName: "Nhẫn Nữ Đính Đá Trắng 61Y",
    category: "Nhẫn",
    lop: "AU 61.00 Y",
    totalQty: 6,
    status: "Chờ phân bổ", // CHỜ PHÂN BỔ: NÚT "CHUYỂN CHỜ XỬ LÝ LẠI" ACTIVE!
    weight: 2.7000,
    metalWeight: 2.6100,
    stoneWeight: 0.0900,
    createdBy: "Lê Văn Châu",
    createdAt: "26/08/2026",
    dateIn: "29/08/2026",
    location: "Két K1 - Ngăn A04",
    hasSeries: false, // LÔ KHÔNG QUẢN LÝ SERIES (HÀNG XÁ - YÊU CẦU CÂN LẠI & CHỌN STAMP)
    series: []
  },
  {
    id: "LOT-07",
    bagCode: "SO-260800007",
    customerCode: "2000088",
    customerName: "Tiệm Vàng Phước Long SG",
    soCode: "SO2608022",
    itemCode: "GY0BE000144A00A0000000CZWW1055",
    drawingCode: "BE000144A00",
    itemName: "Vòng Tay Nữ Bản Trơn 61Y",
    category: "Vòng tay",
    lop: "AU 61.00 Y",
    totalQty: 4,
    status: "Đã phân bổ", // ĐÃ PHÂN BỔ: NÚT DISABLED
    weight: 2.0000,
    metalWeight: 2.0000,
    stoneWeight: 0,
    createdBy: "Nguyễn Thị Mỹ Dung",
    createdAt: "27/08/2026",
    dateIn: "30/08/2026",
    location: "Két K3 - Ngăn C01",
    series: [
      { seriNo: "SR-2608007-01", status: "Đã phân bổ", weight: 0.5000, location: "Khay F1" },
      { seriNo: "SR-2608007-02", status: "Đã phân bổ", weight: 0.5000, location: "Khay F1" },
      { seriNo: "SR-2608007-03", status: "Đã phân bổ", weight: 0.5000, location: "Khay F1" },
      { seriNo: "SR-2608007-04", status: "Đã phân bổ", weight: 0.5000, location: "Khay F1" }
    ]
  }
];

// 2. DANH SÁCH 40 LÔ CHỜ XỬ LÝ LẠI (TỪ ĐƠN HỦY SO123456 - US-08)
// Khách hàng cũ: KH00071 - Tiệm Vàng Kim Thành
// Mã đơn hủy: SO123456
// ĐẶC BIỆT CHUẨN XÁC:
// - 8 Lô đầu (RE-01 đến RE-08): ĐÃ ĐƯỢC ĐƠN HÀNG MỚI SO2608011 PICK VÀO! Có Lô mới và SO mới.
// - 32 Lô còn lại (RE-09 đến RE-40): ĐANG NẰM Ở KHO CHỜ GÁN VÀO ĐƠN HÀNG MỚI! Chưa có SO mới / Chưa có Lô mới.
export const MOCK_REPROCESS_LOTS = Array.from({ length: 40 }, (_, i) => {
  const index = i + 1;
  const numStr = String(60 + index).padStart(3, "0"); // 061 -> 100
  const bagCode = `SO-260800${numStr}`;

  // Phân chia 4 Item chuẩn QLĐH luân phiên
  let itemCode = "GY0EC000133A00A000000000000000";
  let drawingCode = "EG000133A00";
  let itemName = "Bông Tai Nữ Vàng 61Y";
  let goldType = "61Y";
  let lop = "AU 61.00 Y";
  let size = "---";
  let stoneSpec = "Không đá";
  let unitWeight = 0.5000;

  let category = "Bông Tai Nữ";
  if (index % 4 === 1) {
    category = "Bông Tai Nữ";
    itemCode = "GY0EC000133A00A000000000000000";
    drawingCode = "EG000133A00";
    itemName = "Bông Tai Nữ";
    goldType = "61Y";
    lop = "AU 61.00 Y";
    size = "---";
    stoneSpec = "Không đá";
    unitWeight = 0.5000;
  } else if (index % 4 === 2) {
    category = "Nhẫn Nữ";
    itemCode = "GY0RG000144A00A00CZBB1CZWW1013";
    drawingCode = "RG000144A00";
    itemName = "Nhẫn Nữ";
    goldType = "61Y";
    lop = "AU 61.00 Y";
    size = "NNU - 015";
    stoneSpec = "Đá CZ Trắng 1.3mm";
    unitWeight = 0.4500;
  } else if (index % 4 === 3) {
    category = "Vòng Tay Nữ";
    itemCode = "GY0BE000144A00A0000000CZWW1048";
    drawingCode = "BE000144A00";
    itemName = "Vòng Tay Nữ";
    goldType = "61Y";
    lop = "AU 61.00 Y";
    size = "VT - 048";
    stoneSpec = "Đá CZ Tấm 1.2mm";
    unitWeight = 0.5000;
  } else {
    category = "Nhẫn Nam";
    itemCode = "GY0RM000186A00A00CZWW100000020";
    drawingCode = "RM000186A00";
    itemName = "Nhẫn Nam";
    goldType = "75Y";
    lop = "AU 75.00 Y";
    size = "Ni 18";
    stoneSpec = "Đá CZ Chủ 4.0mm";
    unitWeight = 0.8000;
  }

  const weightDelta = (index * 0.0015);
  const totalWeight = Number((unitWeight + weightDelta).toFixed(4));
  const stoneWeight = stoneSpec === "Không đá" ? 0 : 0.0150;
  const metalWeight = Number((totalWeight - stoneWeight).toFixed(4));

  // 8 Lô đầu đã được pick vào đơn hàng mới SO2608011 của DNTN Ý NGỌC
  const isAssigned = index <= 8;
  const targetNewBagCode = isAssigned ? `SO-261024-${String(index).padStart(3, "0")}` : null;
  const targetNewSoCode = isAssigned ? "SO2608011" : null;
  const newCustomerName = isAssigned ? "DNTN Ý NGỌC" : null;
  
  // Thiết lập số lượng pcs chi tiết trong lô:
  // - Lô 1, 2: 1 psc, đã chuyển sang đơn mới/bag mới -> SL khả dụng = 0, SL đã giữ chỗ = 0, SL đã chuyển = 1
  // - Lô 3, 4: 4 psc, toàn bộ 4 psc đã giữ chỗ -> SL khả dụng = 0, SL đã giữ chỗ = 4, SL đã chuyển = 0
  // - Lô 5, 6: 4 psc, đã giữ chỗ 2 psc, còn 2 psc khả dụng -> SL khả dụng = 2, SL đã giữ chỗ = 2, SL đã chuyển = 0
  // - Lô 7, 8: 1 psc, toàn bộ 1 psc đã giữ chỗ -> SL khả dụng = 0, SL đã giữ chỗ = 1, SL đã chuyển = 0
  // - Lô 9 - 40: Chưa gán đơn mới -> SL khả dụng = totalQty, SL đã giữ chỗ = 0
  let totalQty = 1;
  let availableQty = 1;
  let holdQty = 0;
  let servedQty = 0;

  if (index === 1 || index === 2) {
    totalQty = 1;
    availableQty = 0;
    holdQty = 0;
    servedQty = 1;
  } else if (index === 3 || index === 4) {
    totalQty = 4;
    availableQty = 0;
    holdQty = 4;
    servedQty = 0;
  } else if (index === 5) {
    // Demo chuẩn theo yêu cầu Chị đẹp: 1 lô tổng 10 pcs gồm 3 pcs Chờ gán đơn, 3 pcs Đã giữ chỗ, 4 pcs Chờ chuyển bag
    totalQty = 10;
    availableQty = 3; // 3 pcs Chờ gán đơn
    holdQty = 3;      // 3 pcs Đã giữ chỗ
    servedQty = 4;    // 4 pcs Chờ chuyển bag
  } else if (index === 6) {
    totalQty = 4;
    availableQty = 2; // 2 pcs Chờ gán đơn
    holdQty = 2;      // 2 pcs Đã giữ chỗ
    servedQty = 0;
  } else if (index === 7 || index === 8) {
    totalQty = 1;
    availableQty = 0;
    holdQty = 1;
    servedQty = 0;
  } else if (index % 5 === 0) {
    totalQty = 4;
    availableQty = 4;
    holdQty = 0;
    servedQty = 0;
  } else if (index % 3 === 0) {
    totalQty = 2;
    availableQty = 2;
    holdQty = 0;
    servedQty = 0;
  } else {
    totalQty = 1;
    availableQty = 1;
    holdQty = 0;
    servedQty = 0;
  }

  // 3 Trạng thái kho chuẩn hóa: Chờ gán đơn / Đã giữ chỗ / Chờ chuyển bag
  let status = "Chờ gán đơn";
  if (availableQty > 0) {
    status = "Chờ gán đơn";
  } else if (holdQty > 0) {
    status = "Đã giữ chỗ";
  } else {
    status = "Chờ chuyển bag";
  }

  const isAlreadyServed = servedQty > 0;
  const serveStatus = isAlreadyServed 
    ? "Chờ chuyển bag" 
    : holdQty > 0 
    ? "Đã giữ chỗ" 
    : "Chưa chuyển";

  // Danh sách các đơn hàng mới đã được gán
  let assignedOrders = [];
  if (index === 5) {
    // Lô 5 gán cho SO2608011: 3 pcs giữ chỗ và 4 pcs chờ chuyển bag
    assignedOrders = [
      {
        soCode: "SO2608011",
        customerName: "DNTN Ý NGỌC",
        qty: 3,
        bagCode: "SO-261024-005",
        status: "Đã giữ chỗ"
      },
      {
        soCode: "SO2608011",
        customerName: "DNTN Ý NGỌC",
        qty: 4,
        bagCode: "SO-261024-006",
        status: "Chờ chuyển bag"
      }
    ];
  } else if (index === 6) {
    assignedOrders = [
      {
        soCode: "SO2608011",
        customerName: "DNTN Ý NGỌC",
        qty: 2,
        bagCode: "SO-261024-007",
        status: "Đã giữ chỗ"
      }
    ];
  } else if (isAssigned) {
    assignedOrders = [
      {
        soCode: targetNewSoCode,
        customerName: newCustomerName,
        qty: holdQty || servedQty || 1,
        bagCode: targetNewBagCode,
        status: servedQty > 0 ? "Chờ chuyển bag" : "Đã giữ chỗ"
      }
    ];
  }

  // Cấu trúc Component linh kiện phục vụ màn hình Điều phối Chuyển Bag (Serve FG)
  const stoneCode = stoneSpec === "Không đá" ? null : (index % 4 === 2 ? "CZ10VRDWW11RD1.25" : (index % 4 === 3 ? "CZ12TAMRD1.20" : "CZ40CHU1040"));
  const stoneName = stoneSpec === "Không đá" ? null : (index % 4 === 2 ? "Đá CZ Trắng 1.25mm" : (index % 4 === 3 ? "Đá CZ Tấm 1.2mm" : "Đá CZ Chủ 4.0mm"));
  const stoneQty = stoneSpec === "Không đá" ? 0 : (index % 4 === 2 ? 8 : (index % 4 === 3 ? 12 : 1)) * totalQty;
  const moldCode = `${drawingCode}-MOLD-1-A`;
  const moldName = `Khuôn Cast ${category} (${goldType})`;

  const components = {
    stones: stoneCode ? [{ code: stoneCode, name: stoneName, qty: stoneQty, weight: Number((stoneWeight * totalQty).toFixed(4)) }] : [],
    cast: [{ code: moldCode, name: moldName, qty: totalQty, weight: Number((metalWeight * totalQty).toFixed(4)) }]
  };

  return {
    id: `RE-${index}`,
    stt: index,
    bagCode: bagCode,
    oldCustomerCode: "2000071",
    oldCustomerName: "Công ty TNHH Vàng Bạc Kim Thành",
    originalSoCode: "SO123456",
    // Nguồn chuyển từ Tồn kho TP sau khi yêu cầu hủy đơn được Base phê duyệt
    originSource: "Tồn kho thành phẩm (Chờ phân bổ)",
    originCancelReason: "Đơn SO123456 hủy qua Base",
    itemCode: itemCode,
    drawingCode: drawingCode,
    category: category,
    itemName: itemName,
    lop: lop,
    goldKarat: goldType === "75Y" ? "Vàng 18K" : "Vàng 61Y",
    sizeNi: size,
    stoneSpec: stoneSpec,
    totalQty: totalQty,
    reprocessQty: totalQty,
    availableQty: availableQty, // SL khả dụng (có thể gán cho đơn khác)
    assignedQty: holdQty + servedQty, // SL đã gán = SL đã giữ chỗ + SL đã chuyển (Phương án B)
    holdQty: holdQty,           // SL đã giữ chỗ
    servedQty: servedQty,       // SL đã chuyển đơn
    isHold: holdQty > 0,        // Khóa giữ phôi chống pick trùng
    holdByOrder: targetNewSoCode,
    holdCustomer: newCustomerName,
    isAssigned: holdQty > 0 || servedQty > 0,
    assignedOrders: assignedOrders,
    isAlreadyServed: isAlreadyServed,
    serveStatus: serveStatus,
    targetNewBagCode: targetNewBagCode,
    targetNewSoCode: targetNewSoCode,
    newCustomerName: newCustomerName,
    orderDetailUrl: isAssigned ? "/orders/11" : null,
    status: status,
    components: components,
    // Quy chuẩn KHSX cho item kho CXLL: BOM rỗng & Routing gán cứng
    bomStatus: "Rỗng (Phôi hoàn chỉnh)",
    fixedRouting: ["Serve FG", "Stamping", "Packing Out"],
    isClosed: isAlreadyServed,
    labelBarcode: `LBL-${bagCode}`,
    labelStatus: isAlreadyServed ? "Đã hủy nhãn" : "Hiệu lực",
    totalWeight: Number((totalWeight * totalQty).toFixed(4)),
    metalWeight: Number((metalWeight * totalQty).toFixed(4)),
    stoneWeight: Number((stoneWeight * totalQty).toFixed(4)),
    dateIn: `${String(10 + (index % 15)).padStart(2, "0")}/10/2026`,
    location: `Kho CXLL - Hộc B${String((index % 8) + 1).padStart(2, "0")}`
  };
});

/**
 * Tách các lô phôi có nhiều trạng thái thành các dòng riêng biệt theo chỉ đạo Chị đẹp:
 * - 1 cột SL duy nhất phản ánh số lượng cho trạng thái của dòng đó
 * - Nếu 1 lô có nhiều trạng thái (ví dụ tổng 10 pcs: 3 chờ gán đơn, 3 đã giữ chỗ, 4 chờ chuyển bag) -> tách làm 3 dòng
 */
export function buildReprocessDisplayRows(lots) {
  const rows = [];
  lots.forEach((lot) => {
    const statusesCount = (lot.availableQty > 0 ? 1 : 0) + (lot.holdQty > 0 ? 1 : 0) + (lot.servedQty > 0 ? 1 : 0);
    const isSplit = statusesCount > 1;

    // 1. Phân đoạn "Chờ chuyển bag" (nếu có pcs)
    if (lot.servedQty > 0) {
      const servedOrder = lot.assignedOrders?.find(o => o.status === "Chờ chuyển bag" || o.status === "Đã chuyển đơn") || {
        soCode: lot.targetNewSoCode,
        customerName: lot.newCustomerName,
        bagCode: lot.targetNewBagCode,
        qty: lot.servedQty
      };
      const ratio = lot.servedQty / lot.totalQty;
      rows.push({
        id: `${lot.id}-served`,
        lotId: lot.id,
        stt: rows.length + 1,
        bagCode: lot.bagCode,
        itemCode: lot.itemCode,
        category: lot.category || lot.itemName,
        originalSoCode: lot.originalSoCode || "SO123456",
        oldCustomerName: lot.oldCustomerName,
        oldCustomerCode: lot.oldCustomerCode,
        lop: lot.lop,
        qty: lot.servedQty, // Cột SL duy nhất
        status: "Chờ chuyển bag",
        targetNewSoCode: servedOrder.soCode,
        targetNewBagCode: servedOrder.bagCode,
        newCustomerName: servedOrder.customerName,
        metalWeight: Number((lot.metalWeight * ratio).toFixed(4)),
        stoneWeight: Number((lot.stoneWeight * ratio).toFixed(4)),
        totalWeight: Number((lot.totalWeight * ratio).toFixed(4)),
        dateIn: lot.dateIn,
        location: lot.location,
        isSplit,
        lotTotalQty: lot.totalQty,
        lotAvailableQty: lot.availableQty,
        lotHoldQty: lot.holdQty,
        lotServedQty: lot.servedQty,
        rawLot: lot
      });
    }

    // 2. Phân đoạn "Đã giữ chỗ" (nếu có pcs)
    if (lot.holdQty > 0) {
      const holdOrder = lot.assignedOrders?.find(o => o.status === "Đã giữ chỗ" || o.status === "Đang giữ chỗ") || {
        soCode: lot.targetNewSoCode,
        customerName: lot.newCustomerName,
        bagCode: lot.targetNewBagCode,
        qty: lot.holdQty
      };
      const ratio = lot.holdQty / lot.totalQty;
      rows.push({
        id: `${lot.id}-hold`,
        lotId: lot.id,
        stt: rows.length + 1,
        bagCode: lot.bagCode,
        itemCode: lot.itemCode,
        category: lot.category || lot.itemName,
        originalSoCode: lot.originalSoCode || "SO123456",
        oldCustomerName: lot.oldCustomerName,
        oldCustomerCode: lot.oldCustomerCode,
        lop: lot.lop,
        qty: lot.holdQty, // Cột SL duy nhất
        status: "Đã giữ chỗ",
        targetNewSoCode: holdOrder.soCode,
        targetNewBagCode: holdOrder.bagCode,
        newCustomerName: holdOrder.customerName,
        metalWeight: Number((lot.metalWeight * ratio).toFixed(4)),
        stoneWeight: Number((lot.stoneWeight * ratio).toFixed(4)),
        totalWeight: Number((lot.totalWeight * ratio).toFixed(4)),
        dateIn: lot.dateIn,
        location: lot.location,
        isSplit,
        lotTotalQty: lot.totalQty,
        lotAvailableQty: lot.availableQty,
        lotHoldQty: lot.holdQty,
        lotServedQty: lot.servedQty,
        rawLot: lot
      });
    }

    // 3. Phân đoạn "Chờ gán đơn" (nếu có pcs)
    if (lot.availableQty > 0) {
      const ratio = lot.availableQty / lot.totalQty;
      rows.push({
        id: `${lot.id}-available`,
        lotId: lot.id,
        stt: rows.length + 1,
        bagCode: lot.bagCode,
        itemCode: lot.itemCode,
        category: lot.category || lot.itemName,
        originalSoCode: lot.originalSoCode || "SO123456",
        oldCustomerName: lot.oldCustomerName,
        oldCustomerCode: lot.oldCustomerCode,
        lop: lot.lop,
        qty: lot.availableQty, // Cột SL duy nhất
        status: "Chờ gán đơn",
        targetNewSoCode: null,
        targetNewBagCode: null,
        newCustomerName: null,
        metalWeight: Number((lot.metalWeight * ratio).toFixed(4)),
        stoneWeight: Number((lot.stoneWeight * ratio).toFixed(4)),
        totalWeight: Number((lot.totalWeight * ratio).toFixed(4)),
        dateIn: lot.dateIn,
        location: lot.location,
        isSplit,
        lotTotalQty: lot.totalQty,
        lotAvailableQty: lot.availableQty,
        lotHoldQty: lot.holdQty,
        lotServedQty: lot.servedQty,
        rawLot: lot
      });
    }
  });

  return rows;
}

export const MOCK_REPROCESS_ROWS = buildReprocessDisplayRows(MOCK_REPROCESS_LOTS);

// 3. DANH SÁCH 8 LÔ ĐÃ ĐƯỢC GÁN ĐƠN MỚI CHO TRẠM CẤP TP / XUẤT XƯỞNG LÀM MỚI (US-09)
export const MOCK_NEW_SO_TARGETS = Array.from({ length: 8 }, (_, i) => {
  const index = i + 1;
  const numStr = String(60 + index).padStart(3, "0");
  const oldBagCode = `SO-260800${numStr}`;
  const newBagCode = `SO-261024-${String(index).padStart(3, "0")}`;

  let itemCode = "GY0EC000133A00A000000000000000";
  let drawingCode = "EG000133A00";
  let itemName = "Bông Tai Nữ (Không đá)";
  let category = "Bông Tai Nữ";
  let goldType = "61Y";
  let lop = "AU 61.00 Y";
  let unitWeight = 0.5000;
  let stoneSpec = "Không đá";

  if (index % 4 === 1) {
    itemCode = "GY0EC000133A00A000000000000000";
    drawingCode = "EG000133A00";
    itemName = "Bông Tai Nữ (Không đá)";
    category = "Bông Tai Nữ";
    lop = "AU 61.00 Y";
    unitWeight = 0.5000;
    stoneSpec = "Không đá";
  } else if (index % 4 === 2) {
    itemCode = "GY0RG000144A00A00CZBB1CZWW1013";
    drawingCode = "RG000144A00";
    itemName = "Nhẫn Nữ Ni NNU-015";
    category = "Nhẫn Nữ";
    lop = "AU 61.00 Y";
    unitWeight = 0.4500;
    stoneSpec = "Đá CZ Trắng 1.3mm";
  } else if (index % 4 === 3) {
    itemCode = "GY0BE000144A00A0000000CZWW1048";
    drawingCode = "BE000144A00";
    itemName = "Vòng Tay Nữ VT-048";
    category = "Vòng Tay Nữ";
    lop = "AU 61.00 Y";
    unitWeight = 0.5000;
    stoneSpec = "Đá CZ Tấm 1.2mm";
  } else {
    itemCode = "GY0RM000186A00A00CZWW100000020";
    drawingCode = "RM000186A00";
    itemName = "Nhẫn Nam Ni 18 Đá CZ";
    category = "Nhẫn Nam";
    goldType = "75Y";
    lop = "AU 75.00 Y";
    unitWeight = 0.8000;
    stoneSpec = "Đá CZ Chủ 4.0mm";
  }

  const weightDelta = (index * 0.0015);
  const totalWeight = Number((unitWeight + weightDelta).toFixed(4));
  const stoneWeight = (index % 4 === 1) ? 0 : 0.0150;
  const metalWeight = Number((totalWeight - stoneWeight).toFixed(4));

  const stoneCode = stoneSpec === "Không đá" ? null : (index % 4 === 2 ? "CZ10VRDWW11RD1.25" : (index % 4 === 3 ? "CZ12TAMRD1.20" : "CZ40CHU1040"));
  const stoneName = stoneSpec === "Không đá" ? null : (index % 4 === 2 ? "Đá CZ Trắng 1.25mm" : (index % 4 === 3 ? "Đá CZ Tấm 1.2mm" : "Đá CZ Chủ 4.0mm"));
  const stoneQty = stoneSpec === "Không đá" ? 0 : (index % 4 === 2 ? 8 : (index % 4 === 3 ? 12 : 1));
  const moldCode = `${drawingCode}-MOLD-1-A`;
  const moldName = `Khuôn Cast ${category} (${goldType})`;

  const components = {
    stones: stoneCode ? [{ code: stoneCode, name: stoneName, qty: stoneQty, weight: stoneWeight }] : [],
    cast: [{ code: moldCode, name: moldName, qty: 1, weight: metalWeight }]
  };

  const isScanned = index <= 2;
  const serveStatus = isScanned ? "Đã chuyển sang bag mới" : "Chờ chuyển bag";
  const status = isScanned ? "Đã chuyển sang bag mới" : "Chờ cấp phôi vào Bag mới";

  return {
    id: `NEW-${index}`,
    stt: index,
    newBagCode: newBagCode,
    soCode: "SO2608011",
    customerCode: "2037105",
    customerName: "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
    orderDetailUrl: "/orders/11",
    demandQty: 1,
    totalWeight: totalWeight,
    metalWeight: metalWeight,
    stoneWeight: stoneWeight,
    itemCode: itemCode,
    drawingCode: drawingCode,
    category: category,
    itemName: itemName,
    lop: lop,
    expectedOldBagCode: oldBagCode,
    originalSoCode: "SO123456",
    oldCustomerCode: "2000071",
    oldCustomerName: "Công ty TNHH Vàng Bạc Kim Thành",
    oldCustomer: "2000071 - Công ty TNHH Vàng Bạc Kim Thành",
    wc: isScanned ? "WC-Packing Out" : "Serve FG",
    status: status,
    serveStatus: serveStatus,
    components: components,
    // 3 công đoạn gán cứng chuẩn
    routing: ["Serve FG", "Stamping", "Packing Out"],
    routingType: "Routing fix (Làm mới)",
    bom: "BOM rỗng",
    isScanned: isScanned,
    scannedDate: isScanned ? "24/10/2026" : null,
    scannedTime: isScanned ? "10:15" : null
  };
});

// 4. BẢNG ROUTING CỐ ĐỊNH 3 CÔNG ĐOẠN CHO ITEM CHỜ XỬ LÝ LẠI
export const REWORK_ROUTING_STEPS = [
  { step: 1, wcCode: "WC-SERVE", name: "Serve FG (Kho CXLL)", action: "Nhận yêu cầu cấp thành phẩm vào Bag mới (sinh từ MO của KHSX) và xuất phôi", duration: "0.5h" },
  { step: 2, wcCode: "WC-STAMP", name: "Stamping (Xưởng Thực Thi)", action: "Tẩy dấu cũ, khắc logo mới DNTN Ý NGỌC & ký hiệu tuổi vàng chuẩn theo SO mới", duration: "1.0h" },
  { step: 3, wcCode: "WC-PACK", name: "Packing Out (Kho TP)", action: "Kiểm tra KCS, đóng gói thành phẩm và nhập lại Kho Thành Phẩm (sẵn sàng lập DO, Hóa đơn & giao hàng)", duration: "0.5h" }
];

// 5. DANH SÁCH YÊU CẦU HỦY ĐƠN HÀNG ĐÃ DUYỆT BASE CẦN THỦ KHO CHUYỂN SANG DS CHỜ XỬ LÝ LẠI
export const MOCK_WAREHOUSE_CANCEL_REQUESTS = [
  {
    id: "WH-CR-001",
    cancelReqCode: "YCH-2026-0801",
    baseRequestId: "BASE-RQ-88219",
    baseStatus: "Đã duyệt (Base Request)",
    baseFormType: "Form Type B (Liên phòng ban KD - KHSX - Kho)",
    soTransferType: "Đã chuyển KHSX",
    currentStage: "Packing (Kho TP) - Chưa hóa đơn",
    deliveryOrderStatus: "Chưa lập DO", // Chưa lập phiếu giao hàng -> Sẵn sàng chuyển
    hasInvoice: false,
    approvedDate: "25/10/2026 10:15",
    soCode: "SO2608001",
    customerName: "Cty TNHH Vàng Bạc Kim Yến",
    itemCode: "GY0EC000133A00A000000000000000",
    drawingCode: "EG000133A00",
    itemName: "Bông Tai Nữ Vàng 61Y",
    cancelQty: 6,
    currentLocation: "Kho TP (Chờ phân bổ)",
    stockBagCode: "SO-260800001",
    status: "Chờ chuyển kho CXLL",
    reworkLocationTarget: "Kho Chờ Xử Lý Lại (CXLL)",
    reason: "Khách hàng thay đổi mẫu thiết kế, hủy 6/10 SP trong SO2608001",
    transferredAt: null
  },
  {
    id: "WH-CR-002",
    cancelReqCode: "YCH-2026-0805",
    baseRequestId: "BASE-RQ-88245",
    baseStatus: "Đã duyệt (Base Request)",
    baseFormType: "Form Type B (Liên phòng ban KD - KHSX - Kho)",
    soTransferType: "Đã chuyển KHSX",
    currentStage: "Packing (Kho TP) - Chưa hóa đơn",
    deliveryOrderStatus: "DO đã tự động điều chỉnh", // Hệ thống tự động cập nhật đồng thời khi duyệt Base
    hasInvoice: false,
    doCode: "DO-2608-0192",
    approvedDate: "25/10/2026 11:30",
    soCode: "SO2608005",
    customerName: "Doji Jewelry Miền Nam",
    itemCode: "GY0BE000144A00A0000000CZWW1048",
    drawingCode: "BE000144A00",
    itemName: "Vòng Tay Nữ Bản Nhỏ VT-048",
    cancelQty: 4,
    currentLocation: "Kho TP (Đã tự động trừ DO & SO)",
    stockBagCode: "SO-260800003",
    status: "Chờ chuyển kho CXLL",
    reworkLocationTarget: "Kho Chờ Xử Lý Lại (CXLL)",
    reason: "Khách hàng giảm khối lượng đơn hàng gấp",
    transferredAt: null
  },
  {
    id: "WH-CR-003",
    cancelReqCode: "YCH-2026-0792",
    baseRequestId: "BASE-RQ-87110",
    baseStatus: "Đã duyệt (Base Request)",
    baseFormType: "Form Type B (Liên phòng ban KD - KHSX - Kho)",
    soTransferType: "Đã chuyển KHSX",
    currentStage: "Packing (Kho TP) - Chưa hóa đơn",
    deliveryOrderStatus: "DO đã điều chỉnh", // QLĐH đã điều chỉnh DO xong
    hasInvoice: false,
    doCode: "DO-2608-0185",
    approvedDate: "24/10/2026 16:45",
    soCode: "SO2608002",
    customerName: "Vàng Mi Hồng Sài Gòn",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    drawingCode: "RG000144A00",
    itemName: "Nhẫn Nữ Ni NNU-015 Đá Trắng",
    cancelQty: 8,
    currentLocation: "Kho TP (Chờ phân bổ)",
    stockBagCode: "SO-260800002",
    status: "Đã chuyển vào Kho CXLL",
    reworkLocationTarget: "Kho Chờ Xử Lý Lại (CXLL)",
    reason: "Khách đổi kích thước ni tay nhẫn",
    transferredAt: "25/10/2026 08:30"
  },
  {
    id: "WH-CR-004",
    cancelReqCode: "YCH-2026-0810",
    baseRequestId: "BASE-RQ-88301",
    baseStatus: "Đã duyệt (Base Request)",
    baseFormType: "Form Type B (Liên phòng ban KD - KHSX - Kho)",
    soTransferType: "Đã chuyển KHSX",
    currentStage: "Packing (Kho TP) - Đã lập hóa đơn",
    deliveryOrderStatus: "Đã lập DO & Hóa đơn (Chờ QLĐH & KT xử lý)",
    hasInvoice: true,
    invoiceCode: "INV-2026-08-0044",
    doCode: "DO-2608-0205",
    approvedDate: "26/10/2026 09:00",
    soCode: "SO2608010",
    customerName: "Tập Đoàn Vàng Bạc PNJ Miền Tây",
    itemCode: "GY0EC000133A00A000000000000000",
    drawingCode: "EG000133A00",
    itemName: "Bông Tai Nữ Thiết Kế BT-133",
    cancelQty: 2,
    currentLocation: "Kho TP (Khu vực chờ xuất)",
    stockBagCode: "SO-260800010",
    status: "Chờ chuyển kho CXLL",
    reworkLocationTarget: "Kho Chờ Xử Lý Lại (CXLL)",
    reason: "Khách hủy số lượng 2 món do lỗi điều phối cửa hàng",
    transferredAt: null
  }
];

