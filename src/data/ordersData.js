// Master Data Danh sách Đơn Hàng & Chi Tiết Sản Phẩm (Sales Orders)

export const ALLOWED_SYNC_STATUSES = [
  "Chờ Kỹ thuật",
  "Đủ thông tin KT",
  "Chờ xác nhận" // Chờ duyệt
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    code: "SO2608001",
    customer: "2000001 - Cty TNHH Vàng Bạc Kim Yến",
    team: "Sale A II Hà Nội",
    type: "Đơn hàng Bán",
    gold: "61Y",
    date: "01/08/2026",
    expectDate: "15/08/2026",
    qty: 10,
    cancelQty: 5,
    total: "25.000.000",
    note: "Đã duyệt hủy 5 SP",
    status: "Chờ cập nhật",
    items: [
      {
        stt: 1,
        drawingCode: "RG202500006",
        itemCode: "RG202500006",
        itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
        goldType: "61Y",
        platingColor: "X",
        stoneColor: "Xanh",
        stoneType: "Sapphire Xanh & CZ",
        size: 45,
        qty: 10,
        customerReq: "Làm kỹ",
        note: "-",
        weight: "3.42g",
        unitPrice: 480000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 10
      }
    ]
  },
  {
    id: 2,
    code: "SO2608002",
    customer: "2000002 - DNTN Vàng Bạc Bảo Tín",
    team: "Sale A II Hà Nội",
    type: "Đơn hàng Gia công",
    gold: "61Y",
    date: "02/08/2026",
    expectDate: "16/08/2026",
    qty: 100, // Đặt 100 chiếc (Trọng tâm demo: Đặt 100, Kho có 80)
    cancelQty: 0,
    total: "48.000.000",
    note: "Đơn hàng đặt số lượng lớn theo hợp đồng quý 3",
    status: "Chờ Kỹ thuật", // Trạng thái hợp lệ để đồng bộ kho
    items: [
      {
        stt: 1,
        drawingCode: "RG202500006",
        itemCode: "RG202500006",
        itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
        goldType: "61Y",
        platingColor: "X",
        stoneColor: "Xanh",
        stoneType: "Sapphire Xanh & Kim Cương Tấm",
        size: 45,
        qty: 100,
        customerReq: "Làm kỹ, mạ bóng cao cấp",
        note: "Khách yêu cầu giao sớm nếu có phôi sẵn",
        weight: "3.42g",
        unitPrice: 480000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 100,
        assignedStock: null
      }
    ]
  },
  {
    id: 3,
    code: "SO2608003",
    customer: "2000003 - Tiệm Vàng Kim Thành Phát",
    team: "Sale B HCM",
    type: "Đơn hàng Bán",
    gold: "75W",
    date: "02/08/2026",
    expectDate: "16/08/2026",
    qty: 20,
    cancelQty: 10,
    total: "55.000.000",
    note: "KHSX đã xử lý hủy 10 SP",
    status: "Chờ Kỹ thuật", // Hợp lệ
    items: [
      {
        stt: 1,
        drawingCode: "RG202500006",
        itemCode: "RG202500006",
        itemName: "Nhẫn Kim Cương Nữ Solitaire 18K Trắng",
        goldType: "75W",
        platingColor: "Trắng",
        stoneColor: "Trắng",
        stoneType: "Kim Cương Tự Nhiên D-Color",
        size: 45,
        qty: 10,
        customerReq: "Tiêu chuẩn VIP",
        note: "-",
        weight: "3.88g",
        unitPrice: 750000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 10
      }
    ]
  },
  {
    id: 4,
    code: "SO2608004",
    customer: "2000004 - Cty CP Trang Sức PNJ Diamond",
    team: "Sale A II Hà Nội",
    type: "Đơn hàng Gia công",
    gold: "41.6Y",
    date: "03/08/2026",
    expectDate: "17/08/2026",
    qty: 8,
    cancelQty: 0,
    total: "9.600.000",
    note: "-",
    status: "Chờ xác nhận", // Hợp lệ (Chờ duyệt)
    items: [
      {
        stt: 1,
        drawingCode: "BR-GOLD-2026",
        itemCode: "BR-GOLD-2026",
        itemName: "Vòng Tay Rắn Vàng Ý Khắc Kim",
        goldType: "41.6Y",
        platingColor: "Vàng",
        stoneColor: "Đỏ Ruby",
        stoneType: "Ruby Mắt Rắn",
        size: 54,
        qty: 8,
        customerReq: "Tiêu chuẩn",
        note: "-",
        weight: "15.20g",
        unitPrice: 1200000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 8
      }
    ]
  },
  {
    id: 5,
    code: "SO2608005",
    customer: "2000005 - Cửa hàng VBĐQ Minh Châu",
    team: "Sale B HCM",
    type: "Đơn hàng Bán",
    gold: "61Y",
    date: "04/08/2026",
    expectDate: "18/08/2026",
    qty: 15,
    cancelQty: 0,
    total: "35.000.000",
    note: "-",
    status: "Đã chuyển KHSX", // KHÔNG hợp lệ để đồng bộ kho (đã giao xưởng)
    items: [
      {
        stt: 1,
        drawingCode: "RG202500006",
        itemCode: "RG202500006",
        itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
        goldType: "61Y",
        platingColor: "X",
        stoneColor: "Xanh",
        stoneType: "Sapphire Xanh & CZ",
        size: 45,
        qty: 15,
        customerReq: "Tiêu chuẩn",
        note: "-",
        weight: "3.42g",
        unitPrice: 480000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 15
      }
    ]
  },
  {
    id: 11,
    code: "SO2608011",
    customer: "2000001 - Cty TNHH Vàng Bạc Kim Yến",
    team: "Sale A II Hà Nội",
    type: "Đơn hàng Bán",
    gold: "61Y",
    date: "10/08/2026",
    expectDate: "24/08/2026",
    qty: 12,
    cancelQty: 0,
    total: "28.000.000",
    note: "-",
    status: "Chờ Kỹ thuật", // Hợp lệ
    items: [
      {
        stt: 1,
        drawingCode: "RG202500006",
        itemCode: "RG202500006",
        itemName: "Nhẫn Kim Cương Nữ Solitaire 14K",
        goldType: "61Y",
        platingColor: "X",
        stoneColor: "Xanh",
        stoneType: "Sapphire Xanh & CZ",
        size: 48,
        qty: 12,
        customerReq: "Làm kỹ",
        note: "-",
        weight: "3.60g",
        unitPrice: 480000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 12
      }
    ]
  },
  {
    id: 12,
    code: "SO2608012",
    customer: "2000003 - Tiệm Vàng Kim Thành Phát",
    team: "Sale A II Hà Nội",
    type: "Đơn hàng Bán",
    gold: "75Y",
    date: "11/08/2026",
    expectDate: "25/08/2026",
    qty: 5,
    cancelQty: 0,
    total: "16.000.000",
    note: "-",
    status: "Đủ thông tin KT", // Hợp lệ
    items: [
      {
        stt: 1,
        drawingCode: "SET-EMERALD-01",
        itemCode: "SET-EMERALD-01",
        itemName: "Bộ Hoàng Gia Emerald Quý Tộc",
        goldType: "75Y",
        platingColor: "Vàng",
        stoneColor: "Xanh Lục Bảo",
        stoneType: "Emerald Colombia",
        size: 52,
        qty: 5,
        customerReq: "Đồng bộ",
        note: "-",
        weight: "28.50g",
        unitPrice: 3200000,
        sourceType: "NEW_PRODUCTION",
        qtyFromStock: 0,
        qtyNewProduction: 5
      }
    ]
  }
];

export function getOrderById(id) {
  const numericId = Number(id);
  return INITIAL_ORDERS.find((o) => o.id === numericId) || null;
}
