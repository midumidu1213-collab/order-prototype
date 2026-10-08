// Danh mục tồn kho Kho Thành Phẩm (Chờ xử lý lại)
// Bắt buộc khớp 100% các thông số: Mã Item, Tuổi vàng, Ni tay, Màu/Loại đá
// Chứa đầy đủ các trường: Mã item, Số lượng, Mã đơn hàng cũ, Ngày nhập kho

export const WAREHOUSE_REWORK_ITEMS = [
  // Item khớp với đơn SO2608011 (Dòng 2: GY0RG000144A00A00CZBB1CZWW1013)
  {
    id: "WP-011",
    bagCode: "BAG-TP-9915",
    itemCode: "GY0RG000144A00A00CZBB1CZWW1013",
    itemCode30: "GY0RG000144A00A00CZBB1CZWW1013",
    itemName: "Nhẫn Nữ",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "NNU - 015", // Khớp Ni NNU - 015
    stoneColor: "Trắng",
    stoneType: "CZ Trắng",
    stoneQty: "1 viên",
    weight: "0.4500g/chiếc",
    availableQty: 15, // Đúng 15 sản phẩm như trong ảnh chụp của Chị đẹp!
    oldOrderCode: "SO2607089", // Mã đơn hàng cũ
    dateInStock: "02/08/2026", // Ngày nhập kho
    status: "Available",
    location: "Két K1 - Ngăn A03 (Lô L-863)",
    sourceReason: "Khách hủy do trễ hẹn giao hàng đợt 1",
    oldCustomer: "KH-1000089 - Kim Cương Vàng",
    standardLaborPrice: 150000
  },
  // Lô 2 khớp dòng 2 (GY0RG000144A00A00CZBB1CZWW1013 - Nhẫn Nữ Ni 15)
  {
    id: "WP-012",
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
  // Lô 3 khớp dòng 2 (GY0RG000144A00A00CZBB1CZWW1013 - Nhẫn Nữ Ni 15)
  {
    id: "WP-013",
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
  // Khớp Dòng 3 (GY0RG000144A00A00CZ881CZWW1013 - Nhẫn Nữ Ni 13)
  {
    id: "WP-014",
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
  // Khớp Dòng 4 (GY0BE000144A00A0000000CZWW1048 - Vòng Tay Nữ VT-048)
  {
    id: "WP-015",
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
  // Khớp Dòng 1 (GY0EC000133A00A000000000000000 - Bông Tai Nữ)
  {
    id: "WP-016",
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
  // Khớp Dòng 5 (GY0EC000133A00A00CZ88100000000 - Bông Tai Dáng Dài)
  {
    id: "WP-017",
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
  },
  {
    id: "WP-001",
    bagCode: "BAG-TP-9901",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "45",
    stoneColor: "Xanh",
    stoneType: "Sapphire Xanh & Kim Cương Tấm",
    stoneQty: "1 viên chủ 4.5mm + 12 viên tấm 1.2mm",
    weight: "3.42g/chiếc",
    availableQty: 80,
    oldOrderCode: "SO2607089",
    dateInStock: "02/08/2026",
    status: "Available",
    location: "Két K1 - Ngăn A03 (Lô L-863)",
    sourceReason: "Khách hủy do trễ hẹn giao hàng đợt 1",
    oldCustomer: "KH-1000089 - Kim Cương Vàng",
    standardLaborPrice: 480000
  },
  {
    id: "WP-002",
    bagCode: "BAG-TP-9902",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "45",
    stoneColor: "Xanh",
    stoneType: "Sapphire Xanh & Kim Cương Tấm",
    stoneQty: "1 viên chủ 4.5mm + 12 viên tấm 1.2mm",
    weight: "3.45g/chiếc",
    availableQty: 20,
    oldOrderCode: "SO2607045",
    dateInStock: "25/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn A04",
    sourceReason: "Khách hủy đơn do thay đổi kế hoạch kinh doanh",
    oldCustomer: "KH-1000045 - Bảo Tín Phát",
    standardLaborPrice: 480000
  },
  {
    id: "WP-003",
    bagCode: "BAG-TP-9903",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: "48",
    stoneColor: "Xanh",
    stoneType: "Sapphire Xanh & Kim Cương Tấm",
    stoneQty: "1 viên chủ 4.5mm + 12 viên tấm 1.2mm",
    weight: "3.60g/chiếc",
    availableQty: 15,
    oldOrderCode: "SO2607055",
    dateInStock: "28/07/2026",
    status: "Available",
    location: "Két K1 - Ngăn A05",
    sourceReason: "Hàng thành phẩm dư mẫu chào hàng",
    oldCustomer: "KH-1000018 - DOJI Hà Nội",
    standardLaborPrice: 480000
  },
  {
    id: "WP-004",
    bagCode: "BAG-TP-9904",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 18K Trắng",
    category: "Nhẫn nữ",
    goldType: "75W",
    size: "45",
    stoneColor: "Trắng",
    stoneType: "Kim Cương Tự Nhiên D-Color",
    stoneQty: "1 viên chủ 5.0mm + 16 viên tấm",
    weight: "3.88g/chiếc",
    availableQty: 5,
    oldOrderCode: "SO2607012",
    dateInStock: "05/08/2026",
    status: "Available",
    location: "Két VIP - Ngăn V02",
    sourceReason: "Khách hủy do đổi sang vàng hồng",
    oldCustomer: "KH-1000012 - PNJ Chi nhánh 1",
    standardLaborPrice: 750000
  },
  {
    id: "WP-005",
    bagCode: "BAG-TP-9905",
    itemCode: "SET-EMERALD-01",
    itemName: "Bộ Hoàng Gia Emerald Quý Tộc (Dây + Lắc + Nhẫn)",
    category: "Bộ",
    goldType: "75Y",
    size: "52",
    stoneColor: "Xanh Lục Bảo",
    stoneType: "Ngọc Lục Bảo Colombia & Kim Cương",
    stoneQty: "3 viên chủ Emerald + 48 viên kim cương",
    weight: "28.50g/bộ",
    availableQty: 2,
    oldOrderCode: "SO2607099",
    dateInStock: "30/07/2026",
    status: "Available",
    location: "Két K3 - Ngăn C01",
    sourceReason: "Khách sỉ hủy đơn nguyên bộ",
    oldCustomer: "KH-1000099 - Vàng Bạc Ngọc Lan",
    standardLaborPrice: 3200000
  },
  {
    id: "WP-006",
    bagCode: "BAG-TP-9906",
    itemCode: "BR-GOLD-2026",
    itemName: "Vòng Tay Rắn Vàng Ý Khắc Kim",
    category: "Vòng tay",
    goldType: "41.6Y",
    size: "54",
    stoneColor: "Đỏ Ruby",
    stoneType: "Ruby Mắt Rắn",
    stoneQty: "2 viên mắt Ruby",
    weight: "15.20g/chiếc",
    availableQty: 8,
    oldOrderCode: "SO2607033",
    dateInStock: "01/08/2026",
    status: "Available",
    location: "Két K2 - Ngăn B08",
    sourceReason: "Tồn kho chờ xử lý lại",
    oldCustomer: "KH-1000033 - Doji Retail",
    standardLaborPrice: 1200000
  }
];

// Hàm tìm kiếm Item trong kho thành phẩm khớp 100%
export function findMatchingWarehouseItems({ itemCode, goldType, size, stoneColor }) {
  if (!itemCode) return [];

  return WAREHOUSE_REWORK_ITEMS.filter((stock) => {
    const matchItem = stock.itemCode?.toLowerCase() === itemCode?.toLowerCase();
    
    // Nếu có tuổi vàng thì so khớp, không thì bỏ qua
    const matchGold = goldType ? stock.goldType?.toLowerCase() === goldType?.toLowerCase() : true;
    
    // So khớp size/ni
    const matchSize = size && size !== "---" 
      ? String(stock.size).toLowerCase() === String(size).toLowerCase() 
      : true;

    // So khớp màu đá
    const matchColor = stoneColor && stoneColor !== "---"
      ? stock.stoneColor?.toLowerCase() === stoneColor?.toLowerCase()
      : true;

    const isAvailable = stock.status === "Available" && stock.availableQty > 0;

    return matchItem && matchGold && matchSize && matchColor && isAvailable;
  });
}
