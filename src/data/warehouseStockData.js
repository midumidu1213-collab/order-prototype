// Danh mục tồn kho Kho Thành Phẩm (Chờ xử lý lại)
// Bắt buộc khớp 100% các thông số: Mã Item, Tuổi vàng, Ni tay, Màu/Loại đá
// Bổ sung đầy đủ cấp Lô (Lot / Bag Code). Mỗi lô (bag) thực tế có SL <= 10 món theo chuẩn xưởng kim hoàn

export const WAREHOUSE_REWORK_ITEMS = [
  // -------------------------------------------------------------------------
  // ITEM 1: GY0EC000133A00A0000000000000000 (Bông Tai Nữ) - Tổng tồn: 36 món (5 Lô)
  // -------------------------------------------------------------------------
  {
    id: "WP-101",
    lotCode: "LOT-TP-2607-01",
    bagCode: "BAG-TP-9951",
    itemCode: "GY0EC000133A00A000000000000000",
    itemCode30: "GY0EC000133A00A000000000000000",
    itemName: "Bông Tai Nữ",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "Không đá",
    stoneQty: "0",
    weight: "0.5000g/chiếc",
    availableQty: 8,
    oldOrderCode: "SO2607040",
    dateInStock: "18/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn A01 (Lô L-815)",
    sourceReason: "Hàng thành phẩm dư thừa từ hợp đồng chào hàng",
    oldCustomer: "KH-1000012 - Tiệm Vàng Kim Thành",
    standardLaborPrice: 195000
  },
  {
    id: "WP-102",
    lotCode: "LOT-TP-2607-02",
    bagCode: "BAG-TP-9952",
    itemCode: "GY0EC000133A00A000000000000000",
    itemCode30: "GY0EC000133A00A000000000000000",
    itemName: "Bông Tai Nữ",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "Không đá",
    stoneQty: "0",
    weight: "0.5000g/chiếc",
    availableQty: 6,
    oldOrderCode: "SO2607042",
    dateInStock: "20/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn A02 (Lô L-818)",
    sourceReason: "Khách giảm số lượng đợt giao bổ sung",
    oldCustomer: "KH-1000018 - Vàng Mi Hồng",
    standardLaborPrice: 195000
  },
  {
    id: "WP-103",
    lotCode: "LOT-TP-2607-03",
    bagCode: "BAG-TP-9953",
    itemCode: "GY0EC000133A00A000000000000000",
    itemCode30: "GY0EC000133A00A000000000000000",
    itemName: "Bông Tai Nữ",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "Không đá",
    stoneQty: "0",
    weight: "0.5000g/chiếc",
    availableQty: 7,
    oldOrderCode: "SO2607045",
    dateInStock: "24/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn A03 (Lô L-822)",
    sourceReason: "Hàng mẫu sau sự kiện triển lãm trang sức",
    oldCustomer: "KH-1000030 - Doji Jewelry",
    standardLaborPrice: 195000
  },
  {
    id: "WP-104",
    lotCode: "LOT-TP-2607-04",
    bagCode: "BAG-TP-9954",
    itemCode: "GY0EC000133A00A000000000000000",
    itemCode30: "GY0EC000133A00A000000000000000",
    itemName: "Bông Tai Nữ",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "Không đá",
    stoneQty: "0",
    weight: "0.5000g/chiếc",
    availableQty: 9,
    oldOrderCode: "SO2607050",
    dateInStock: "28/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn A04 (Lô L-830)",
    sourceReason: "Khách đổi quy cách bao bì xuất xưởng",
    oldCustomer: "KH-1000044 - Tiệm Vàng Ngọc Thẩm",
    standardLaborPrice: 195000
  },
  {
    id: "WP-105",
    lotCode: "LOT-TP-2607-05",
    bagCode: "BAG-TP-9955",
    itemCode: "GY0EC000133A00A000000000000000",
    itemCode30: "GY0EC000133A00A000000000000000",
    itemName: "Bông Tai Nữ",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "Không đá",
    stoneQty: "0",
    weight: "0.5000g/chiếc",
    availableQty: 6,
    oldOrderCode: "SO2607055",
    dateInStock: "02/08/2026",
    status: "Available",
    location: "Két K3 - Ngăn A05 (Lô L-835)",
    sourceReason: "Hàng hoàn trả kiểm định đạt chất lượng",
    oldCustomer: "KH-1000012 - Tiệm Vàng Kim Thành",
    standardLaborPrice: 195000
  },

  // -------------------------------------------------------------------------
  // ITEM 2: GY0RG000144A00A00CZBB1CZWW1013 (Nhẫn Nữ - Ni NNU - 015) - Tổng tồn: 45 món (6 Lô)
  // -------------------------------------------------------------------------
  {
    id: "WP-201",
    lotCode: "LOT-TP-2607-06",
    bagCode: "BAG-TP-9915",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015",
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 5,
    oldOrderCode: "SO2607089",
    dateInStock: "02/08/2026",
    status: "Available",
    location: "Két K1 - Ngăn A03 (Lô L-863)",
    sourceReason: "Khách hủy do trễ hẹn giao hàng đợt 1",
    oldCustomer: "KH-1000089 - Kim Cương Vàng",
    standardLaborPrice: 150000
  },
  {
    id: "WP-202",
    lotCode: "LOT-TP-2607-07",
    bagCode: "BAG-TP-9916",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015",
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 8,
    oldOrderCode: "SO2607085",
    dateInStock: "25/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn A04 (Lô L-858)",
    sourceReason: "Khách điều chỉnh tỷ trọng mặt hàng trong kỳ",
    oldCustomer: "KH-1000067 - PNJ Chi Nhánh 3",
    standardLaborPrice: 150000
  },
  {
    id: "WP-203",
    lotCode: "LOT-TP-2607-08",
    bagCode: "BAG-TP-9917",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015",
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 6,
    oldOrderCode: "SO2607065",
    dateInStock: "15/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn A05 (Lô L-840)",
    sourceReason: "Khách giảm số lượng đơn hàng vào mùa thấp điểm",
    oldCustomer: "KH-1000045 - Bảo Tín Phát",
    standardLaborPrice: 150000
  },
  {
    id: "WP-204",
    lotCode: "LOT-TP-2607-09",
    bagCode: "BAG-TP-9918",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015",
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 7,
    oldOrderCode: "SO2607052",
    dateInStock: "08/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn A06 (Lô L-832)",
    sourceReason: "Khách thay đổi tiến độ xuất khẩu",
    oldCustomer: "KH-1000088 - SJC Bến Thành",
    standardLaborPrice: 150000
  },
  {
    id: "WP-205",
    lotCode: "LOT-TP-2607-10",
    bagCode: "BAG-TP-9919",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015",
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 9,
    oldOrderCode: "SO2607034",
    dateInStock: "28/06/2026",
    status: "Available",
    location: "Két K2 - Ngăn B01 (Lô L-812)",
    sourceReason: "Hàng mẫu chào hàng dư thừa sau triển lãm",
    oldCustomer: "KH-1000021 - PNJ Miền Nam",
    standardLaborPrice: 150000
  },
  {
    id: "WP-206",
    lotCode: "LOT-TP-2607-11",
    bagCode: "BAG-TP-9920",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015",
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 10,
    oldOrderCode: "SO2607030",
    dateInStock: "20/06/2026",
    status: "Available",
    location: "Két K2 - Ngăn B02 (Lô L-805)",
    sourceReason: "Đơn hàng gia công nội bộ hoàn tất dư định mức",
    oldCustomer: "KH-1000011 - Vàng Bạc Tân Phú",
    standardLaborPrice: 150000
  },

  // -------------------------------------------------------------------------
  // ITEM 3: GY0RG000144A00A00CZ881CZWW1013 (Nhẫn Nữ Kim Cương - Ni NNU - 013) - Tổng tồn: 28 món (4 Lô)
  // -------------------------------------------------------------------------
  {
    id: "WP-301",
    lotCode: "LOT-TP-2608-01",
    bagCode: "BAG-TP-9930",
    itemCode: "GY0RG000144A00A00CZ881CZWW1013",
    itemCode30: "GY0RG000144A00A00CZ881CZWW1013",
    itemName: "Nhẫn Nữ Kim Cương",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 013",
    stoneColor: "---",
    stoneType: "CZ Tấm",
    stoneQty: "1 viên",
    weight: "1.1000g/chiếc",
    availableQty: 8,
    oldOrderCode: "SO2607102",
    dateInStock: "10/08/2026",
    status: "Available",
    location: "Két K2 - Ngăn C04 (Lô L-890)",
    sourceReason: "Khách đổi sang mã nhẫn đính kim cương tự nhiên",
    oldCustomer: "KH-1000078 - Vàng Bạc Sài Gòn",
    standardLaborPrice: 455000
  },
  {
    id: "WP-302",
    lotCode: "LOT-TP-2608-02",
    bagCode: "BAG-TP-9931",
    itemCode: "GY0RG000144A00A00CZ881CZWW1013",
    itemCode30: "GY0RG000144A00A00CZ881CZWW1013",
    itemName: "Nhẫn Nữ Kim Cương",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 013",
    stoneColor: "---",
    stoneType: "CZ Tấm",
    stoneQty: "1 viên",
    weight: "1.1000g/chiếc",
    availableQty: 7,
    oldOrderCode: "SO2607098",
    dateInStock: "05/08/2026",
    status: "Available",
    location: "Két K2 - Ngăn C05 (Lô L-885)",
    sourceReason: "Khách dời lịch thanh toán hợp đồng",
    oldCustomer: "KH-1000078 - Vàng Bạc Sài Gòn",
    standardLaborPrice: 455000
  },
  {
    id: "WP-303",
    lotCode: "LOT-TP-2608-03",
    bagCode: "BAG-TP-9932",
    itemCode: "GY0RG000144A00A00CZ881CZWW1013",
    itemCode30: "GY0RG000144A00A00CZ881CZWW1013",
    itemName: "Nhẫn Nữ Kim Cương",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 013",
    stoneColor: "---",
    stoneType: "CZ Tấm",
    stoneQty: "1 viên",
    weight: "1.1000g/chiếc",
    availableQty: 6,
    oldOrderCode: "SO2607095",
    dateInStock: "01/08/2026",
    status: "Available",
    location: "Két K2 - Ngăn C06 (Lô L-880)",
    sourceReason: "Hàng trưng bày showroom mẫu mã",
    oldCustomer: "KH-1000095 - Kim Tín Phát",
    standardLaborPrice: 455000
  },
  {
    id: "WP-304",
    lotCode: "LOT-TP-2608-04",
    bagCode: "BAG-TP-9933",
    itemCode: "GY0RG000144A00A00CZ881CZWW1013",
    itemCode30: "GY0RG000144A00A00CZ881CZWW1013",
    itemName: "Nhẫn Nữ Kim Cương",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 013",
    stoneColor: "---",
    stoneType: "CZ Tấm",
    stoneQty: "1 viên",
    weight: "1.1000g/chiếc",
    availableQty: 7,
    oldOrderCode: "SO2607080",
    dateInStock: "20/07/2026",
    status: "Available",
    location: "Két K2 - Ngăn C07 (Lô L-870)",
    sourceReason: "Khách giảm quy mô nhập hàng đợt 2",
    oldCustomer: "KH-1000095 - Kim Tín Phát",
    standardLaborPrice: 455000
  },

  // -------------------------------------------------------------------------
  // ITEM 4: GY0BE000144A00A0000000CZWW1048 (Vòng Tay Nữ - Ni VT - 048) - Tổng tồn: 18 món (3 Lô)
  // -------------------------------------------------------------------------
  {
    id: "WP-401",
    lotCode: "LOT-TP-2608-05",
    bagCode: "BAG-TP-9945",
    itemCode: "GY0BE000144A00A0000000CZWW1048",
    itemCode30: "GY0BE000144A00A0000000CZWW1048",
    itemName: "Vòng Tay Nữ",
    category: "Vòng tay",
    goldType: "61Y",
    size: "VT - 048",
    stoneColor: "---",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.5000g/chiếc",
    availableQty: 6,
    oldOrderCode: "SO2607090",
    dateInStock: "05/08/2026",
    status: "Available",
    location: "Két K1 - Ngăn D02 (Lô L-875)",
    sourceReason: "Khách thay đổi cơ cấu sản phẩm trong hợp đồng",
    oldCustomer: "KH-1000033 - Doji Retail",
    standardLaborPrice: 170000
  },
  {
    id: "WP-402",
    lotCode: "LOT-TP-2608-06",
    bagCode: "BAG-TP-9946",
    itemCode: "GY0BE000144A00A0000000CZWW1048",
    itemCode30: "GY0BE000144A00A0000000CZWW1048",
    itemName: "Vòng Tay Nữ",
    category: "Vòng tay",
    goldType: "61Y",
    size: "VT - 048",
    stoneColor: "---",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.5000g/chiếc",
    availableQty: 7,
    oldOrderCode: "SO2607088",
    dateInStock: "02/08/2026",
    status: "Available",
    location: "Két K1 - Ngăn D03 (Lô L-872)",
    sourceReason: "Hàng kiểm tra tiêu chuẩn sau đánh bóng xuất dư",
    oldCustomer: "KH-1000033 - Doji Retail",
    standardLaborPrice: 170000
  },
  {
    id: "WP-403",
    lotCode: "LOT-TP-2608-07",
    bagCode: "BAG-TP-9947",
    itemCode: "GY0BE000144A00A0000000CZWW1048",
    itemCode30: "GY0BE000144A00A0000000CZWW1048",
    itemName: "Vòng Tay Nữ",
    category: "Vòng tay",
    goldType: "61Y",
    size: "VT - 048",
    stoneColor: "---",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.5000g/chiếc",
    availableQty: 5,
    oldOrderCode: "SO2607075",
    dateInStock: "25/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn D04 (Lô L-868)",
    sourceReason: "Khách gia hạn hợp đồng giao nhận đợt sau",
    oldCustomer: "KH-1000055 - Ngọc Thịnh Phát",
    standardLaborPrice: 170000
  },

  // -------------------------------------------------------------------------
  // ITEM 5: GY0EC000133A00A00CZ88100000000 (Bông Tai Dáng Dài) - Tổng tồn: 12 món (2 Lô)
  // -------------------------------------------------------------------------
  {
    id: "WP-501",
    lotCode: "LOT-TP-2608-08",
    bagCode: "BAG-TP-9959",
    itemCode: "GY0EC000133A00A00CZ88100000000",
    itemCode30: "GY0EC000133A00A00CZ88100000000",
    itemName: "Bông Tai Dáng Dài",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "1.5000g/chiếc",
    availableQty: 7,
    oldOrderCode: "SO2607077",
    dateInStock: "22/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn B05 (Lô L-855)",
    sourceReason: "Khách hủy do thu hẹp quy mô chi nhánh đại lý",
    oldCustomer: "KH-1000055 - Ngọc Thịnh Phát",
    standardLaborPrice: 335000
  },
  {
    id: "WP-502",
    lotCode: "LOT-TP-2608-09",
    bagCode: "BAG-TP-9960",
    itemCode: "GY0EC000133A00A00CZ88100000000",
    itemCode30: "GY0EC000133A00A00CZ88100000000",
    itemName: "Bông Tai Dáng Dài",
    category: "Bông tai",
    goldType: "61Y",
    size: "---",
    stoneColor: "---",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "1.5000g/chiếc",
    availableQty: 5,
    oldOrderCode: "SO2607070",
    dateInStock: "15/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn B06 (Lô L-850)",
    sourceReason: "Hàng hoàn kho sau phiên triển lãm trang sức",
    oldCustomer: "KH-1000021 - PNJ Miền Nam",
    standardLaborPrice: 335000
  }
];

// Định nghĩa Routing Cố Định cho Hàng Kho Thành Phẩm (FG Routing)
export const ROUTING_FG_FIXED = {
  code: "RT-FG-FIXED",
  name: "Routing Kho Thành Phẩm (Type: FG)",
  type: "FG",
  description: "Routing cố định áp dụng cho sản phẩm pick từ kho thành phẩm chờ xử lý lại",
  stages: [
    {
      step: 1,
      code: "STG-SERVE-FG",
      name: "Phục vụ kho TP (Serve FG)",
      standardTime: "0.5 ngày",
      workCenter: "Kho Thành Phẩm",
      description: "Điều chuyển hàng từ két kho TP, kiểm tra ngoại quan & thông số ni tay"
    },
    {
      step: 2,
      code: "STG-PACKING-OUT",
      name: "Đóng gói xuất kho (Packing Out)",
      standardTime: "0.5 ngày",
      workCenter: "Tổ Đóng Gói Hoàn Thiện",
      description: "Hoàn thiện đóng gói, dán tem vỉ theo quy cách đơn hàng mới và sẵn sàng xuất giao"
    }
  ]
};

// Hàm nhóm các lô theo từng Item
export function getGroupedWarehouseItems(stockList = WAREHOUSE_REWORK_ITEMS) {
  const map = new Map();

  stockList.forEach((item) => {
    const key = item.itemCode?.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        itemCode: item.itemCode,
        itemCode30: item.itemCode30 || item.itemCode,
        itemName: item.itemName,
        category: item.category,
        goldType: item.goldType,
        size: item.size,
        stoneColor: item.stoneColor,
        stoneType: item.stoneType,
        weight: item.weight,
        totalAvailableQty: 0,
        lots: []
      });
    }

    const group = map.get(key);
    group.totalAvailableQty += item.availableQty;
    group.lots.push({
      id: item.id,
      lotCode: item.lotCode || `LOT-${item.id}`,
      bagCode: item.bagCode,
      availableQty: item.availableQty,
      oldOrderCode: item.oldOrderCode,
      dateInStock: item.dateInStock,
      location: item.location,
      sourceReason: item.sourceReason,
      oldCustomer: item.oldCustomer,
      standardLaborPrice: item.standardLaborPrice
    });
  });

  return Array.from(map.values());
}

// Hàm tìm kiếm tồn kho phù hợp với tiêu chí của đơn hàng
export function findMatchingWarehouseItems(criteria = {}) {
  const { itemCode, goldType } = criteria;
  return WAREHOUSE_REWORK_ITEMS.filter((item) => {
    if (itemCode && item.itemCode?.toLowerCase() !== itemCode.toLowerCase()) return false;
    if (goldType && item.goldType?.toLowerCase() !== goldType.toLowerCase()) return false;
    return true;
  });
}

// Hàm tìm kiếm tồn kho phù hợp với 1 item trong đơn hàng
export function findMatchingStockForOrderItem(orderItem, orderGold) {
  if (!orderItem) return [];
  const normalizedItemCode = orderItem.itemCode?.toLowerCase();
  return WAREHOUSE_REWORK_ITEMS.filter((stock) => {
    const codeMatch = stock.itemCode?.toLowerCase() === normalizedItemCode;
    const goldMatch = !orderGold || stock.goldType === orderGold;
    return codeMatch && goldMatch;
  });
}
