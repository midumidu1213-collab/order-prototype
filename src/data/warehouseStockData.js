// Danh mục tồn kho Kho Thành Phẩm (Chờ xử lý lại)
// Bắt buộc khớp 100% các thông số: Mã Item, Tuổi vàng, Ni tay, Màu/Loại đá

export const WAREHOUSE_REWORK_ITEMS = [
  {
    id: "WP-001",
    bagCode: "BAG-TP-9901",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: 45, // Ni 45 (hoặc Ni 12 theo chuẩn)
    stoneColor: "Xanh",
    stoneType: "Sapphire Xanh & Kim Cương Tấm",
    stoneQty: "1 viên chủ 4.5mm + 12 viên tấm 1.2mm",
    weight: "3.42g",
    status: "Available", // Available | Allocated
    location: "Két K1 - Ngăn A03",
    sourceReason: "Khách cũ hủy đơn đợt 1 (Đã hoàn thiện KCS)",
    oldCustomer: "KH-1000089 - Kim Cương Vàng",
    dateInStock: "02/08/2026",
    standardLaborPrice: 480000 // Biểu giá công chuẩn
  },
  {
    id: "WP-002",
    bagCode: "BAG-TP-9902",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: 45,
    stoneColor: "Xanh",
    stoneType: "Sapphire Xanh & Kim Cương Tấm",
    stoneQty: "1 viên chủ 4.5mm + 12 viên tấm 1.2mm",
    weight: "3.45g",
    status: "Available",
    location: "Két K1 - Ngăn A04",
    sourceReason: "Khách cũ hủy đơn do trễ hẹn giao",
    oldCustomer: "KH-1000045 - Bảo Tín Phát",
    dateInStock: "03/08/2026",
    standardLaborPrice: 480000
  },
  {
    id: "WP-003",
    bagCode: "BAG-TP-9903",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
    category: "Nhẫn nữ",
    goldType: "61Y",
    size: 48, // Khác Ni (Ni 48) -> Không cho khớp với đơn Ni 45
    stoneColor: "Xanh",
    stoneType: "Sapphire Xanh & Kim Cương Tấm",
    stoneQty: "1 viên chủ 4.5mm + 12 viên tấm 1.2mm",
    weight: "3.60g",
    status: "Available",
    location: "Két K1 - Ngăn A05",
    sourceReason: "Hàng thành phẩm dư mẫu chào hàng",
    oldCustomer: "-",
    dateInStock: "28/07/2026",
    standardLaborPrice: 480000
  },
  {
    id: "WP-004",
    bagCode: "BAG-TP-9904",
    itemCode: "RG202500006",
    itemName: "Nhẫn Kim Cương Nữ Solitaire 18K Trắng",
    category: "Nhẫn nữ",
    goldType: "75W", // Khác tuổi vàng (75W)
    size: 45,
    stoneColor: "Trắng",
    stoneType: "Kim Cương Tự Nhiên D-Color",
    stoneQty: "1 viên chủ 5.0mm + 16 viên tấm",
    weight: "3.88g",
    status: "Available",
    location: "Két VIP - Ngăn V02",
    sourceReason: "Khách hủy do đổi sang vàng hồng",
    oldCustomer: "KH-1000012 - PNJ Chi nhánh 1",
    dateInStock: "05/08/2026",
    standardLaborPrice: 750000
  },
  {
    id: "WP-005",
    bagCode: "BAG-TP-9905",
    itemCode: "SET-EMERALD-01",
    itemName: "Bộ Hoàng Gia Emerald Quý Tộc (Dây + Lắc + Nhẫn)",
    category: "Bộ",
    goldType: "75Y",
    size: 52,
    stoneColor: "Xanh Lục Bảo",
    stoneType: "Ngọc Lục Bảo Colombia & Kim Cương",
    stoneQty: "3 viên chủ Emerald + 48 viên kim cương",
    weight: "28.50g",
    status: "Available",
    location: "Két K3 - Ngăn C01",
    sourceReason: "Khách sỉ hủy đơn nguyên bộ",
    oldCustomer: "KH-1000099 - Vàng Bạc Ngọc Lan",
    dateInStock: "30/07/2026",
    standardLaborPrice: 3200000
  },
  {
    id: "WP-006",
    bagCode: "BAG-TP-9906",
    itemCode: "BR-GOLD-2026",
    itemName: "Vòng Tay Rắn Vàng Ý Khắc Kim",
    category: "Vòng tay",
    goldType: "41.6Y",
    size: 54,
    stoneColor: "Đỏ Ruby",
    stoneType: "Ruby Mắt Rắn",
    stoneQty: "2 viên mắt Ruby",
    weight: "15.20g",
    status: "Available",
    location: "Két K2 - Ngăn B08",
    sourceReason: "Tồn kho chờ xử lý lại",
    oldCustomer: "KH-1000033 - Doji Retail",
    dateInStock: "01/08/2026",
    standardLaborPrice: 1200000
  }
];

// Hàm tìm kiếm Item trong kho thành phẩm khớp 100%
export function findMatchingWarehouseItems({ itemCode, goldType, size, stoneColor }) {
  if (!itemCode || !goldType || !size || !stoneColor) return [];

  return WAREHOUSE_REWORK_ITEMS.filter((stock) => {
    const matchItem = stock.itemCode.toLowerCase() === itemCode.toLowerCase();
    const matchGold = stock.goldType.toLowerCase() === goldType.toLowerCase();
    const matchSize = Number(stock.size) === Number(size);
    const matchColor = stock.stoneColor.toLowerCase() === stoneColor.toLowerCase();
    const isAvailable = stock.status === "Available";

    return matchItem && matchGold && matchSize && matchColor && isAvailable;
  });
}
