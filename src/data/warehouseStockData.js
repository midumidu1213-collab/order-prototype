// Danh mục tồn kho Kho Thành Phẩm (Chờ xử lý lại)
// Bắt buộc khớp 100% các thông số: Mã Item, Tuổi vàng, Ni tay, Màu/Loại đá
// Bổ sung đầy đủ cấp Lô (Lot / Batch Code) theo yêu cầu chuẩn ERP của Chị đẹp

export const WAREHOUSE_REWORK_ITEMS = [
  // -------------------------------------------------------------
  // ITEM 1: GY0EC000133A00A0000000000000000 (Bông Tai Nữ)
  // -------------------------------------------------------------
  {
    id: "WP-016",
    lotCode: "LOT-TP-2607-01",
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
    availableQty: 40,
    oldOrderCode: "SO2607040",
    dateInStock: "18/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn A01 (Lô L-815)",
    sourceReason: "Hàng thành phẩm dư thừa từ hợp đồng chào hàng",
    oldCustomer: "KH-1000012 - Tiệm Vàng Kim Thành",
    standardLaborPrice: 195000
  },

  // -------------------------------------------------------------
  // ITEM 2: GY0RG000144A00A00CZBB1CZWW1013 (Nhẫn Nữ - Ni NNU - 015)
  // Gồm 3 LÔ TỒN KHO KHÁC NHAU: TỔNG TỒN = 15 + 25 + 20 = 60 MÓN
  // -------------------------------------------------------------
  {
    id: "WP-011",
    lotCode: "LOT-TP-2607-02",
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
    availableQty: 15,
    oldOrderCode: "SO2607089",
    dateInStock: "02/08/2026",
    status: "Available",
    location: "Két K1 - Ngăn A03 (Lô L-863)",
    sourceReason: "Khách hủy do trễ hẹn giao hàng đợt 1",
    oldCustomer: "KH-1000089 - Kim Cương Vàng",
    standardLaborPrice: 150000
  },
  {
    id: "WP-012",
    lotCode: "LOT-TP-2607-03",
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
    availableQty: 25,
    oldOrderCode: "SO2607065",
    dateInStock: "15/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn A05 (Lô L-840)",
    sourceReason: "Khách giảm số lượng đơn hàng vào mùa thấp điểm",
    oldCustomer: "KH-1000045 - Bảo Tín Phát",
    standardLaborPrice: 150000
  },
  {
    id: "WP-013",
    lotCode: "LOT-TP-2607-04",
    bagCode: "BAG-TP-9922",
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
    availableQty: 20,
    oldOrderCode: "SO2607034",
    dateInStock: "28/06/2026",
    status: "Available",
    location: "Két K2 - Ngăn B01 (Lô L-812)",
    sourceReason: "Hàng mẫu chào hàng dư thừa sau triển lãm",
    oldCustomer: "KH-1000021 - PNJ Miền Nam",
    standardLaborPrice: 150000
  },

  // -------------------------------------------------------------
  // ITEM 3: GY0RG000144A00A00CZ881CZWW1013 (Nhẫn Nữ Kim Cương - Ni NNU - 013)
  // -------------------------------------------------------------
  {
    id: "WP-014",
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
    availableQty: 30,
    oldOrderCode: "SO2607102",
    dateInStock: "10/08/2026",
    status: "Available",
    location: "Két K2 - Ngăn C04 (Lô L-890)",
    sourceReason: "Khách đổi sang mã nhẫn đính kim cương tự nhiên",
    oldCustomer: "KH-1000078 - Vàng Bạc Sài Gòn",
    standardLaborPrice: 455000
  },

  // -------------------------------------------------------------
  // ITEM 4: GY0BE000144A00A0000000CZWW1048 (Vòng Tay Nữ - Ni VT - 048)
  // -------------------------------------------------------------
  {
    id: "WP-015",
    lotCode: "LOT-TP-2608-02",
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
    availableQty: 18,
    oldOrderCode: "SO2607090",
    dateInStock: "05/08/2026",
    status: "Available",
    location: "Két K1 - Ngăn D02 (Lô L-875)",
    sourceReason: "Khách thay đổi cơ cấu sản phẩm trong hợp đồng",
    oldCustomer: "KH-1000033 - Doji Retail",
    standardLaborPrice: 170000
  },

  // -------------------------------------------------------------
  // ITEM 5: GY0EC000133A00A00CZ88100000000 (Bông Tai Dáng Dài)
  // -------------------------------------------------------------
  {
    id: "WP-017",
    lotCode: "LOT-TP-2607-05",
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
    availableQty: 12,
    oldOrderCode: "SO2607077",
    dateInStock: "22/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn B05 (Lô L-855)",
    sourceReason: "Khách hủy do thu hẹp quy mô chi nhánh đại lý",
    oldCustomer: "KH-1000055 - Ngọc Thịnh Phát",
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
