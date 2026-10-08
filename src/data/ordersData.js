// Master Data Danh sách Đơn Hàng & Chi Tiết Sản Phẩm (Sales Orders)
// Đầy đủ tất cả các trường theo Form Quản lý Đơn Hàng thực tế

export const ALLOWED_SYNC_STATUSES = [
  "Chờ Kỹ thuật",
  "Đủ thông tin KT",
  "Chờ xác nhận" // Chờ duyệt
];

export const INITIAL_ORDERS = [
  {
    id: 11,
    code: "SO2608011",
    customerCode: "2037105",
    customer: "DOANH NGHIỆP TƯ NHÂN Ý NGỌC",
    customerStatus: "Hiện tại",
    team: "TEAM 3_B2B2C_HCM & Miền Đông",
    gold: "61Y",
    material: "Vàng",
    platingMaterial: "1", // Chất liệu xi
    type: "Đơn hàng Gia công",
    date: "04/10/2026",
    correspondingCode: "NED", // Mã tương ứng
    weight: "408.0000g",
    tempTotal: "130.000.000", // Tổng tiền tạm tính
    discount: "0%",
    finalPrice: "127,775,000", // Giá sau chiết khấu
    deliveryAddress: "123 Nguyễn Ái Quốc",
    deliveryProgress: "Giao đúng hạn (7h)",
    note: "Đơn thoả thuận 2/10 (item x 100pcs = 500pcs)",
    productionProgressNote: "GDR-20100220", // Ghi chú tiến độ SX/MO
    stoneHoldStatus: "Đã hold đá (100%)", // Trạng thái giữ chỗ đá
    creator: "[04144] - Nguyễn Thị Mỹ Dung",
    createdAt: "04/10/2026 06:38",
    qty: 12,
    total: "28.000.000",
    status: "Chờ Kỹ thuật", // Hợp lệ để đồng bộ kho
    items: [
      {
        stt: 1,
        image: "earrings",
        itemCode: "GY0EC00013/A00A00000000000000",
        drawingCode: "EC00013/A00",
        platingColor: "Y0",
        stoneColor: "---",
        size: "---",
        qty: 100,
        changeReq: "A00",
        weight: "0.5000g",
        unitPrice: 195000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100
      },
      {
        stt: 2,
        image: "ring",
        itemCode: "GY0RG00014/A00A00000000000015",
        drawingCode: "RG00014/A00",
        platingColor: "Y0",
        stoneColor: "---",
        size: "NNU - 015",
        qty: 100,
        changeReq: "A00",
        weight: "0.4500g",
        unitPrice: 150000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100
      },
      {
        stt: 3,
        image: "ring-diamond",
        itemCode: "GY0RG00014/A00A00CZ881CZWW1013",
        drawingCode: "RG00014/A00",
        platingColor: "Y0",
        stoneColor: "---",
        size: "NNU - 013",
        qty: 100,
        changeReq: "A00",
        weight: "1.1000g",
        unitPrice: 455000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100
      },
      {
        stt: 4,
        image: "bracelet",
        itemCode: "GY0BE00014/A00A00000000CZWW1048",
        drawingCode: "BEC00148A00",
        platingColor: "Y0",
        stoneColor: "---",
        size: "VT - 048",
        qty: 100,
        changeReq: "A00",
        weight: "0.5000g",
        unitPrice: 170000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100
      },
      {
        stt: 5,
        image: "earrings-drop",
        itemCode: "GY0EC00013/A00A00CZ8810000000",
        drawingCode: "EC00013/A00",
        platingColor: "Y0",
        stoneColor: "---",
        size: "---",
        qty: 100,
        changeReq: "A00",
        weight: "1.5000g",
        unitPrice: 335000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100
      }
    ]
  },
  {
    id: 1,
    code: "SO2608001",
    customerCode: "2000001",
    customer: "Cty TNHH Vàng Bạc Kim Yến",
    customerStatus: "Hiện tại",
    team: "Sale A II Hà Nội",
    gold: "61Y",
    material: "Vàng",
    platingMaterial: "1",
    type: "Đơn hàng Bán",
    date: "01/08/2026",
    correspondingCode: "NED",
    weight: "34.2000g",
    tempTotal: "25.000.000",
    discount: "0%",
    finalPrice: "25.000.000",
    deliveryAddress: "Tòa nhà Keangnam, Cầu Giấy, Hà Nội",
    deliveryProgress: "Giao đúng hạn (7h)",
    note: "Đã duyệt hủy 5 SP",
    productionProgressNote: "GDR-20100101",
    stoneHoldStatus: "Đã hold đá (100%)",
    creator: "[04144] - Nguyễn Thị Mỹ Dung",
    createdAt: "01/08/2026 08:00",
    qty: 10,
    cancelQty: 5,
    total: "25.000.000",
    status: "Chờ cập nhật",
    items: [
      {
        stt: 1,
        image: "ring",
        itemCode: "RG202500006",
        drawingCode: "EC00013/A00",
        platingColor: "Y0",
        stoneColor: "Xanh",
        size: "45",
        qty: 10,
        changeReq: "A00",
        weight: "3.42g",
        unitPrice: 480000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 10
      }
    ]
  },
  {
    id: 2,
    code: "SO2608002",
    customerCode: "2000002",
    customer: "DNTN Vàng Bạc Bảo Tín",
    customerStatus: "Hiện tại",
    team: "Sale A II Hà Nội",
    gold: "61Y",
    material: "Vàng",
    platingMaterial: "1",
    type: "Đơn hàng Gia công",
    date: "02/08/2026",
    correspondingCode: "NED",
    weight: "342.0000g",
    tempTotal: "48.000.000",
    discount: "0%",
    finalPrice: "48.000.000",
    deliveryAddress: "Số 29 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    deliveryProgress: "Giao đúng hạn (7h)",
    note: "Đơn hàng đặt số lượng lớn theo hợp đồng quý 3",
    productionProgressNote: "GDR-20100220",
    stoneHoldStatus: "Đã hold đá (100%)",
    creator: "[04144] - Nguyễn Thị Mỹ Dung",
    createdAt: "02/08/2026 09:15",
    qty: 100,
    cancelQty: 0,
    total: "48.000.000",
    status: "Chờ Kỹ thuật",
    items: [
      {
        stt: 1,
        image: "ring",
        itemCode: "RG202500006",
        drawingCode: "RG00014/A00",
        platingColor: "Y0",
        stoneColor: "Xanh",
        size: "45",
        qty: 100,
        changeReq: "A00",
        weight: "3.42g",
        unitPrice: 480000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100
      }
    ]
  },
  {
    id: 12,
    code: "SO2608012",
    customerCode: "2000003",
    customer: "Tiệm Vàng Kim Thành Phát",
    customerStatus: "Hiện tại",
    team: "Sale A II Hà Nội",
    gold: "75Y",
    material: "Vàng",
    platingMaterial: "1",
    type: "Đơn hàng Bán",
    date: "11/08/2026",
    correspondingCode: "NED",
    weight: "142.5000g",
    tempTotal: "16.000.000",
    discount: "0%",
    finalPrice: "16.000.000",
    deliveryAddress: "Quận 5, TP.HCM",
    deliveryProgress: "Giao đúng hạn (7h)",
    note: "Đơn VIP đặt bộ trang sức quý tộc",
    productionProgressNote: "GDR-20100315",
    stoneHoldStatus: "Đã hold đá (100%)",
    creator: "[04144] - Nguyễn Thị Mỹ Dung",
    createdAt: "11/08/2026 14:20",
    qty: 5,
    cancelQty: 0,
    total: "16.000.000",
    status: "Đủ thông tin KT",
    items: [
      {
        stt: 1,
        image: "set",
        itemCode: "SET-EMERALD-01",
        drawingCode: "EC00013/A00",
        platingColor: "Y0",
        stoneColor: "Xanh Lục Bảo",
        size: "52",
        qty: 5,
        changeReq: "A00",
        weight: "28.50g",
        unitPrice: 3200000,
        note: "---",
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 5
      }
    ]
  }
];

export function getOrderById(id) {
  const numericId = Number(id);
  // Ưu tiên khớp id, nếu id là 11 (hoặc không truyền) lấy SO2608011
  return INITIAL_ORDERS.find((o) => o.id === numericId) || INITIAL_ORDERS[0];
}
