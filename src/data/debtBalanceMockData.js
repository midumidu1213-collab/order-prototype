// Dữ liệu mô phỏng nghiệp vụ thực tế từ file TONG HOP NGHIEP VU KE TOAN.xlsm & SEVAGO ERP
export const DEBT_SUMMARY_METRICS = {
  viKinhDoanh: {
    tongVangPhaiThu: 1010.8386, // Lượng (SIP Nợ)
    tongVangPhaiTra: 403.3351,  // Lượng (SIP Có - Khách gửi trước)
    tongTiềnCongPhaiThu: 4106778478, // đ
    soVuotHanMuc: 0,
    vangNetQuy24K: 807.5035,
    tongSoKhachHang: 12,
    tongSoMaDoiChieu: 20,
    soLuongChoKyNhan: 4 // Hóa đơn đang đi đường
  },
  viKeToan: {
    tongVangPhaiThu: 1045.1250, // Lượng
    tongVangPhaiTra: 395.2100,  // Lượng
    tongTiềnCongPhaiThu: 4280540000, // đ
    soVuotHanMuc: 1,
    vangNetQuy24K: 832.1150,
    tongSoKhachHang: 12,
    tongSoMaDoiChieu: 20,
    soLuongChoKyNhan: 4
  }
};

// 9 Loại nghiệp vụ thủ công chuẩn DataKhac từ file Excel thực tế
export const MANUAL_VOUCHER_TYPES = [
  { code: "TienCong", name: "Thu tiền công (CK/TM)", category: "Tiền", desc: "Khách hàng thanh toán tiền công qua Chuyển khoản hoặc Tiền mặt" },
  { code: "UngVang", name: "Ứng vàng nguyên liệu", category: "Vàng", desc: "Khách hàng hoặc KHQQ giao trước vàng nguyên liệu cho SIP" },
  { code: "MuaVangCNo", name: "Mua vàng cấn trừ công nợ", category: "Bù trừ", desc: "Khách hàng mua vàng của KHQQ để trả nợ vàng cho SIP" },
  { code: "LechDe", name: "Bù trừ chênh lệch dẻ", category: "Vàng", desc: "Điều chỉnh tăng/giảm trọng lượng dẻ sau khi đo phổ hoặc kiểm hàng" },
  { code: "SIPVang", name: "SIP mua lại vàng chênh lệch", category: "Tiền & Vàng", desc: "SIP thanh toán tiền mặt/chuyển khoản mua lại vàng thừa của khách" },
  { code: "KHVang", name: "KH mua vàng chênh lệch", category: "Tiền & Vàng", desc: "Khách hàng trả tiền mua lượng vàng dư/chênh lệch" },
  { code: "TraNoVang", name: "SIP xuất trả nợ vàng", category: "Vàng", desc: "SIP xuất kho nguyên liệu trả lại vàng dư cho khách" },
  { code: "TToanVang", name: "Tất toán vàng ứng trước", category: "Bù trừ", desc: "Quyết toán hoàn tất các khoản vàng ứng trước của đối tác KHQQ" },
  { code: "LechSo", name: "Bút toán điều chỉnh đối chiếu", category: "Điều chỉnh", desc: "Bút toán cân bằng số dư khi khách hàng ký biên bản chốt nợ" }
];

export const CUSTOMER_PROFILES = {
  CUST_100008: {
    stt: 1,
    maKh: "100008",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    phanLoai: "Đại lý sỉ TP.HCM",
    dauKyVang: 0.0,
    dauKyTien: 0
  },
  CUST_200055: {
    stt: 2,
    maKh: "200055",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    phanLoai: "Đại lý sỉ miền Tây",
    dauKyVang: -2.1000,
    dauKyTien: 50000000
  },
  CUST_AHOA: {
    stt: 3,
    maKh: "A HOA",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    phanLoai: "Khách chợ truyền thống",
    dauKyVang: 15.3670,
    dauKyTien: 40000000
  },
  CUST_TANDINH: {
    stt: 4,
    maKh: "TAN_DINH",
    tenKhach: "ĐẠI LÝ VÀNG BẠC TÂN ĐỊNH",
    phanLoai: "Đại lý bán buôn",
    dauKyVang: 0.0,
    dauKyTien: 0
  },
  CUST_KHQQ: {
    stt: 5,
    maKh: "KHQQ",
    tenKhach: "QUỸ QUẢN LÝ VÀNG ĐỐI TÁC KHQQ (BÊN THỨ 3)",
    phanLoai: "Quỹ ủy thác bảo lãnh",
    dauKyVang: -254.6764,
    dauKyTien: 31635000
  },
  CUST_KMAI: {
    stt: 6,
    maKh: "K_MAI",
    tenKhach: "DOANH NGHIỆP KIM HOÀN MAI",
    phanLoai: "Đại lý gia công",
    dauKyVang: 0.0,
    dauKyTien: 0
  },
  CUST_K10: {
    stt: 7,
    maKh: "K10",
    tenKhach: "K10 (CHỢ AN ĐÔNG)",
    phanLoai: "Khách chợ truyền thống",
    dauKyVang: 0.0,
    dauKyTien: -112965500
  },
  CUST_TD: {
    stt: 8,
    maKh: "TD",
    tenKhach: "TIỆM VÀNG THÀNH DANH (TD)",
    phanLoai: "Đại lý VIP",
    dauKyVang: 200.0,
    dauKyTien: 1753882000
  },
  CUST_SJC: {
    stt: 9,
    maKh: "SJC",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ SJC",
    phanLoai: "Tổ chức chuỗi",
    dauKyVang: 0.0,
    dauKyTien: 0
  },
  CUST_PNJ: {
    stt: 10,
    maKh: "PNJ",
    tenKhach: "CÔNG TY CP VÀNG BẠC ĐÁ QUÝ PHÚ NHUẬN (PNJ)",
    phanLoai: "Gia công chiến lược",
    dauKyVang: -123.7312,
    dauKyTien: 0
  },
  CUST_WINSILVER: {
    stt: 11,
    maKh: "WINSILVER",
    tenKhach: "DOANH NGHIỆP WINSILVER",
    phanLoai: "Đại lý Bạc",
    dauKyVang: 0.0,
    dauKyTien: 0
  },
  CUST_DOJI: {
    stt: 12,
    maKh: "DOJI",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ DOJI",
    phanLoai: "Tổ chức chuỗi",
    dauKyVang: 0.0,
    dauKyTien: 37765000
  }
};

export const MOCK_DEBT_ACCOUNTS = [
  {
    id: "acc_1",
    maDoiChieu: "100008",
    isDefault: true,
    tenSo: "Từ Minh Diamond - Sổ Vàng",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    parentCustomerId: "CUST_100008",
    loaiNL: "Vàng",
    tuoiQuyUoc: 61.0,
    duNoVangLuong: 12.8540,
    quy24K: 7.8417,
    duNoTienCong: 65400000,
    hanMucTien: 400000000,
    hanMucVang: 50.0,
    trangThaiNo: "An toàn",
    agingDays: 12,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp số dư 2 ví",
    recentTransactions: [
      { date: "18/10/2026", type: "Giao hàng", ref: "SO-2610-098", desc: "Xuất giao 15 nhẫn vàng 610", vang: 12.8540, tien: 25400000, balanceVang: 12.8540, balanceTien: 65400000 },
      { date: "12/10/2026", type: "Thu tiền", ref: "PT-0441", desc: "Chuyển khoản Vietcombank thanh toán tiền công", vang: 0, tien: -40000000, balanceVang: 0, balanceTien: 40000000 }
    ]
  },
  {
    id: "acc_2",
    maDoiChieu: "100008_R",
    isDefault: false,
    tenSo: "Từ Minh Diamond (Bán đứt)",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    parentCustomerId: "CUST_100008",
    loaiNL: "Vàng",
    tuoiQuyUoc: 61.0,
    duNoVangLuong: 0.0,
    quy24K: 0.0,
    duNoTienCong: 0,
    hanMucTien: 400000000,
    hanMucVang: 50.0,
    trangThaiNo: "An toàn",
    agingDays: 0,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Không có phát sinh nợ",
    recentTransactions: []
  },
  {
    id: "acc_3",
    maDoiChieu: "100008_BAC",
    isDefault: true,
    tenSo: "Từ Minh Diamond - Sổ Bạc",
    tenKhach: "CÔNG TY TNHH MTV TỪ MINH DIAMOND",
    parentCustomerId: "CUST_100008",
    loaiNL: "Bạc",
    tuoiQuyUoc: 92.5,
    duNoVangLuong: 12.8540,
    quy24K: 11.8911,
    duNoTienCong: 65400000,
    hanMucTien: 400000000,
    hanMucVang: 100.0,
    trangThaiNo: "An toàn",
    agingDays: 14,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp số dư 2 ví",
    recentTransactions: [
      { date: "15/10/2026", type: "Giao hàng", ref: "SO-BAC-012", desc: "Giao trang sức bạc Ý 925", vang: 12.8540, tien: 65400000, balanceVang: 12.8540, balanceTien: 65400000 }
    ]
  },
  {
    id: "acc_4",
    maDoiChieu: "200055",
    isDefault: true,
    tenSo: "Tiệm Vàng Kim Hưng - Sổ Vàng AU68",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    parentCustomerId: "CUST_200055",
    loaiNL: "Vàng",
    tuoiQuyUoc: 68.0,
    duNoVangLuong: -4.3200, // Khách gửi trước vàng
    quy24K: -2.9376,
    duNoTienCong: 145000000,
    hanMucTien: 500000000,
    hanMucVang: 80.0,
    trangThaiNo: "An toàn",
    agingDays: 22,
    agingCategory: "16-30 ngày",
    hasDiscrepancy: true,
    discrepancyNote: "Lệch 1 phiếu nhận dẻ 2.1 lượng đang chờ đối soát",
    recentTransactions: [
      { date: "17/10/2026", type: "Nhận dẻ", ref: "ND-2610-045", desc: "Khách trả dẻ đúc thu hồi", vang: -4.3200, tien: 0, balanceVang: -4.3200, balanceTien: 145000000 },
      { date: "10/10/2026", type: "Giao hàng", ref: "SO-2610-011", desc: "Giao lô dây chuyền vàng 680", vang: 0, tien: 145000000, balanceVang: 0, balanceTien: 145000000 }
    ]
  },
  {
    id: "acc_5",
    maDoiChieu: "200055_V24K",
    isDefault: false,
    tenSo: "Tiệm Vàng Kim Hưng (Vàng 24K)",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    parentCustomerId: "CUST_200055",
    loaiNL: "Vàng",
    tuoiQuyUoc: 99.99,
    duNoVangLuong: 0.0,
    quy24K: 0.0,
    duNoTienCong: 0,
    hanMucTien: 500000000,
    hanMucVang: 80.0,
    trangThaiNo: "An toàn",
    agingDays: 0,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Đã tất toán",
    recentTransactions: []
  },
  {
    id: "acc_6",
    maDoiChieu: "A HOA",
    isDefault: true,
    tenSo: "Tiệm Vàng A Hòa - Sổ Chính",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    parentCustomerId: "CUST_AHOA",
    loaiNL: "Vàng",
    tuoiQuyUoc: 62.0,
    duNoVangLuong: 15.3670,
    quy24K: 9.5285,
    duNoTienCong: 86505000,
    hanMucTien: 300000000,
    hanMucVang: 40.0,
    trangThaiNo: "An toàn",
    agingDays: 18,
    agingCategory: "16-30 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp số dư 2 ví",
    recentTransactions: [
      { date: "19/10/2026", type: "Giao hàng", ref: "SO-AHOA-08", desc: "Xuất 20 lắc tay 620", vang: 15.3670, tien: 46505000, balanceVang: 15.3670, balanceTien: 86505000 },
      { date: "05/10/2026", type: "Đầu kỳ", ref: "SDD-2020", desc: "Số dư đầu kỳ chuyển sang", vang: 0, tien: 40000000, balanceVang: 0, balanceTien: 40000000 }
    ]
  },
  {
    id: "acc_7",
    maDoiChieu: "A HOA1",
    isDefault: false,
    tenSo: "Tiệm Vàng A Hòa (Tuổi 100)",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    parentCustomerId: "CUST_AHOA",
    loaiNL: "Vàng",
    tuoiQuyUoc: 100.0,
    duNoVangLuong: 37.0086,
    quy24K: 37.0123,
    duNoTienCong: -394196000, // Khách nợ âm tiền công (SIP nợ lại do bù dẻ)
    hanMucTien: 300000000,
    hanMucVang: 40.0,
    trangThaiNo: "Cảnh báo",
    agingDays: 45,
    agingCategory: "31-60 ngày",
    hasDiscrepancy: true,
    discrepancyNote: "Khách đổi quy ước tuổi từ 62 sang 100 (Cần bù trừ tiền công âm)",
    recentTransactions: [
      { date: "14/10/2026", type: "Giao hàng", ref: "SO-AHOA1-03", desc: "Giao hàng vàng 99.99 gia công", vang: 37.0086, tien: 0, balanceVang: 37.0086, balanceTien: -394196000 },
      { date: "02/10/2026", type: "Nhận dẻ", ref: "ND-AHOA1-01", desc: "Nhận dẻ vàng 24K bù trừ tiền công", vang: 0, tien: -394196000, balanceVang: 0, balanceTien: -394196000 }
    ]
  },
  {
    id: "acc_8",
    maDoiChieu: "AHOA_BAC",
    isDefault: true,
    tenSo: "Tiệm Vàng A Hòa - Sổ Bạc",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    parentCustomerId: "CUST_AHOA",
    loaiNL: "Bạc",
    tuoiQuyUoc: 92.5,
    duNoVangLuong: 15.3670,
    quy24K: 14.2159,
    duNoTienCong: 86505000,
    hanMucTien: 300000000,
    hanMucVang: 50.0,
    trangThaiNo: "An toàn",
    agingDays: 10,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp số dư",
    recentTransactions: []
  },
  {
    id: "acc_9",
    maDoiChieu: "TAN_DINH",
    isDefault: true,
    tenSo: "Đại Lý Vàng Bạc Tân Định - Sổ Vàng",
    tenKhach: "ĐẠI LÝ VÀNG BẠC TÂN ĐỊNH",
    parentCustomerId: "CUST_TANDINH",
    loaiNL: "Vàng",
    tuoiQuyUoc: 68.0,
    duNoVangLuong: 8.4500,
    quy24K: 5.7460,
    duNoTienCong: 45000000,
    hanMucTien: 200000000,
    hanMucVang: 30.0,
    trangThaiNo: "An toàn",
    agingDays: 9,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp sổ",
    recentTransactions: [
      { date: "16/10/2026", type: "Giao hàng", ref: "SO-TD-09", desc: "Giao 10 nhẫn nam vàng 680", vang: 8.4500, tien: 45000000, balanceVang: 8.4500, balanceTien: 45000000 }
    ]
  },
  {
    id: "acc_10",
    maDoiChieu: "TD_SO",
    isDefault: false,
    tenSo: "Đại Lý Tân Định (Đơn Sỉ)",
    tenKhach: "ĐẠI LÝ VÀNG BẠC TÂN ĐỊNH",
    parentCustomerId: "CUST_TANDINH",
    loaiNL: "Vàng",
    tuoiQuyUoc: 68.0,
    duNoVangLuong: 0.0,
    quy24K: 0.0,
    duNoTienCong: 0,
    hanMucTien: 200000000,
    hanMucVang: 30.0,
    trangThaiNo: "An toàn",
    agingDays: 0,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Không nợ",
    recentTransactions: []
  },
  {
    id: "acc_11",
    maDoiChieu: "KHQQ",
    isDefault: true,
    tenSo: "Quỹ Đối Tác KHQQ (Ủy Thác 24K)",
    tenKhach: "QUỸ QUẢN LÝ VÀNG ĐỐI TÁC KHQQ (BÊN THỨ 3)",
    parentCustomerId: "CUST_KHQQ",
    loaiNL: "Vàng",
    tuoiQuyUoc: 99.99,
    duNoVangLuong: -269.6764, // Quỹ gửi trước số lượng lớn
    quy24K: -269.6764,
    duNoTienCong: 31635000,
    hanMucTien: 5000000000,
    hanMucVang: 500.0,
    trangThaiNo: "An toàn",
    agingDays: 5,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Quỹ ủy thác bảo lãnh nợ",
    recentTransactions: [
      { date: "18/10/2026", type: "MuaVangCNo", ref: "BT-2610-091", desc: "Khách K_MAI mua vàng KHQQ trả nợ SIP", vang: -15.0, tien: 0, balanceVang: -269.6764, balanceTien: 31635000 },
      { date: "01/10/2026", type: "UngVang", ref: "UV-2610-001", desc: "Đối tác gửi quỹ vàng dự trữ sản xuất", vang: -254.6764, tien: 31635000, balanceVang: -254.6764, balanceTien: 31635000 }
    ]
  },
  {
    id: "acc_12",
    maDoiChieu: "K_MAI",
    isDefault: true,
    tenSo: "Doanh Nghiệp Kim Hoàn Mai - Sổ Vàng",
    tenKhach: "DOANH NGHIỆP KIM HOÀN MAI",
    parentCustomerId: "CUST_KMAI",
    loaiNL: "Vàng",
    tuoiQuyUoc: 62.0,
    duNoVangLuong: -30.5621,
    quy24K: -18.9504,
    duNoTienCong: 170000,
    hanMucTien: 100000000,
    hanMucVang: 50.0,
    trangThaiNo: "An toàn",
    agingDays: 7,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp số",
    recentTransactions: [
      { date: "15/10/2026", type: "Nhận dẻ", ref: "ND-KM-02", desc: "Khách giao dẻ thô nguyên liệu", vang: -30.5621, tien: 170000, balanceVang: -30.5621, balanceTien: 170000 }
    ]
  },
  {
    id: "acc_13",
    maDoiChieu: "K10",
    isDefault: true,
    tenSo: "Kim Hoàn K10 - Số Vàng Chợ An Đông",
    tenKhach: "K10 (CHỢ AN ĐÔNG)",
    parentCustomerId: "CUST_K10",
    loaiNL: "Vàng",
    tuoiQuyUoc: 62.0,
    duNoVangLuong: 418.4851,
    quy24K: 259.4607,
    duNoTienCong: -112965500,
    hanMucTien: 1500000000,
    hanMucVang: 400.0,
    trangThaiNo: "Cảnh báo",
    agingDays: 38,
    agingCategory: "31-60 ngày",
    hasDiscrepancy: true,
    discrepancyNote: "Vàng nợ 418 lượng vượt hạn mức vàng 400 lượng. Cần đôn đốc trả dẻ.",
    recentTransactions: [
      { date: "12/10/2026", type: "Giao hàng", ref: "SO-K10-44", desc: "Giao lô hàng vàng đúc lớn chợ An Đông", vang: 418.4851, tien: 0, balanceVang: 418.4851, balanceTien: -112965500 }
    ]
  },
  {
    id: "acc_14",
    maDoiChieu: "TD",
    isDefault: true,
    tenSo: "Tiệm Vàng Thành Danh (TD) - Sổ Vàng 68",
    tenKhach: "TIỆM VÀNG THÀNH DANH (TD)",
    parentCustomerId: "CUST_TD",
    loaiNL: "Vàng",
    tuoiQuyUoc: 68.0,
    duNoVangLuong: 490.4528,
    quy24K: 333.5413,
    duNoTienCong: 3253882000,
    hanMucTien: 4000000000,
    hanMucVang: 500.0,
    trangThaiNo: "An toàn",
    agingDays: 28,
    agingCategory: "16-30 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khách VIP - Doanh số cao",
    recentTransactions: [
      { date: "17/10/2026", type: "Giao hàng", ref: "SO-TD-88", desc: "Xuất giao 100 món trang sức vàng 680", vang: 490.4528, tien: 1500000000, balanceVang: 490.4528, balanceTien: 3253882000 }
    ]
  },
  {
    id: "acc_15",
    maDoiChieu: "SJC",
    isDefault: true,
    tenSo: "SJC Chi Nhánh - Sổ Vàng Chuẩn 75",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ SJC",
    parentCustomerId: "CUST_SJC",
    loaiNL: "Vàng",
    tuoiQuyUoc: 75.0,
    duNoVangLuong: 0.0,
    quy24K: 0.0,
    duNoTienCong: 0,
    hanMucTien: 10000000000,
    hanMucVang: 1000.0,
    trangThaiNo: "An toàn",
    agingDays: 0,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Đối tác tổ chức lớn",
    recentTransactions: []
  },
  {
    id: "acc_16",
    maDoiChieu: "PNJ 1",
    isDefault: true,
    tenSo: "PNJ - Sổ Gia Công Vàng 1 (PNJ 1)",
    tenKhach: "CÔNG TY CP VÀNG BẠC ĐÁ QUÝ PHÚ NHUẬN (PNJ)",
    parentCustomerId: "CUST_PNJ",
    loaiNL: "Vàng",
    tuoiQuyUoc: 75.2,
    duNoVangLuong: -98.7312, // PNJ cấp trước vàng nguyên liệu
    quy24K: -74.2533,
    duNoTienCong: 289416478,
    hanMucTien: 8000000000,
    hanMucVang: 800.0,
    trangThaiNo: "An toàn",
    agingDays: 15,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Sheet theo dõi riêng De_PNJ trong Excel",
    recentTransactions: [
      { date: "16/10/2026", type: "Giao hàng", ref: "SO-PNJ-112", desc: "Giao thành phẩm trang sức gia công cho PNJ", vang: 25.0, tien: 289416478, balanceVang: -98.7312, balanceTien: 289416478 },
      { date: "05/10/2026", type: "Ứng vàng", ref: "UV-PNJ-01", desc: "PNJ giao trước vàng nguyên liệu thỏi", vang: -123.7312, tien: 0, balanceVang: -123.7312, balanceTien: 0 }
    ]
  },
  {
    id: "acc_17",
    maDoiChieu: "PNJ 1_R",
    isDefault: false,
    tenSo: "PNJ - Sổ Bán Đứt Tiền Mặt",
    tenKhach: "CÔNG TY CP VÀNG BẠC ĐÁ QUÝ PHÚ NHUẬN (PNJ)",
    parentCustomerId: "CUST_PNJ",
    loaiNL: "Vàng",
    tuoiQuyUoc: 75.0,
    duNoVangLuong: 0.0,
    quy24K: 0.0,
    duNoTienCong: 0,
    hanMucTien: 8000000000,
    hanMucVang: 800.0,
    trangThaiNo: "An toàn",
    agingDays: 0,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Không nợ",
    recentTransactions: []
  },
  {
    id: "acc_18",
    maDoiChieu: "WINSILVER",
    isDefault: true,
    tenSo: "Doanh Nghiệp WinSilver - Sổ Bạc Ý 925",
    tenKhach: "DOANH NGHIỆP WINSILVER",
    parentCustomerId: "CUST_WINSILVER",
    loaiNL: "Bạc",
    tuoiQuyUoc: 92.5,
    duNoVangLuong: 0.0,
    quy24K: 0.0,
    duNoTienCong: 0,
    hanMucTien: 200000000,
    hanMucVang: 150.0,
    trangThaiNo: "An toàn",
    agingDays: 0,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Đã chốt sổ kỳ trước",
    recentTransactions: []
  },
  {
    id: "acc_19",
    maDoiChieu: "DOJI",
    isDefault: true,
    tenSo: "Tập Đoàn DOJI - Sổ Vàng 99.99",
    tenKhach: "TẬP ĐOÀN VÀNG BẠC ĐÁ QUÝ DOJI",
    parentCustomerId: "CUST_DOJI",
    loaiNL: "Vàng",
    tuoiQuyUoc: 99.99,
    duNoVangLuong: -0.0454,
    quy24K: -0.0454,
    duNoTienCong: 37765000,
    hanMucTien: 1500000000,
    hanMucVang: 300.0,
    trangThaiNo: "An toàn",
    agingDays: 8,
    agingCategory: "0-15 ngày",
    hasDiscrepancy: false,
    discrepancyNote: "Khớp số",
    recentTransactions: [
      { date: "15/10/2026", type: "Giao hàng", ref: "SO-DOJI-01", desc: "Xuất hàng DOJI", vang: 0, tien: 37765000, balanceVang: -0.0454, balanceTien: 37765000 }
    ]
  }
];

// Danh sách các lô hàng đang đi đường chưa được khách ký nhận (In-Transit Discrepancies)
export const MOCK_IN_TRANSIT_DELIVERIES = [
  {
    id: "trans_1",
    maDoiChieu: "200055",
    tenKhach: "TIỆM VÀNG KIM HƯNG",
    soToa: "DO-2610-881",
    ngayXuatKho: "19/10/2026",
    loaiGiaoDich: "Giao hàng thành phẩm",
    tlVangGiao: 2.1500, // Lượng
    tuoiGiao: 68.0,
    quy24k: 1.4620,
    tienCong: 32000000,
    shipper: "Nguyễn Văn Tuấn (Đội xe)",
    status: "Đang giao",
    note: "Khách hẹn chiều 20/10 kiểm hàng và cân lại"
  },
  {
    id: "trans_2",
    maDoiChieu: "A HOA1",
    tenKhach: "TIỆM VÀNG A HÒA (CHỢ THIẾC)",
    soToa: "DO-2610-894",
    ngayXuatKho: "18/10/2026",
    loaiGiaoDich: "Giao hàng gia công",
    tlVangGiao: 4.8000,
    tuoiGiao: 99.99,
    quy24k: 4.8000,
    tienCong: 48000000,
    shipper: "Trần Minh Hoàng",
    status: "Chờ xác nhận",
    note: "Đã giao tận nơi, chờ chủ tiệm ký biên bản xác nhận tuổi 100"
  },
  {
    id: "trans_3",
    maDoiChieu: "K10",
    tenKhach: "K10 (CHỢ AN ĐÔNG)",
    soToa: "DO-2610-902",
    ngayXuatKho: "20/10/2026",
    loaiGiaoDich: "Giao hàng đúc lớn",
    tlVangGiao: 15.2000,
    tuoiGiao: 62.0,
    quy24k: 9.4240,
    tienCong: 55000000,
    shipper: "Võ Quốc Cường",
    status: "Đang giao",
    note: "Giao đợt 2 trong ngày"
  },
  {
    id: "trans_4",
    maDoiChieu: "TAN_DINH",
    tenKhach: "ĐẠI LÝ VÀNG BẠC TÂN ĐỊNH",
    soToa: "ND-2610-109",
    ngayXuatKho: "19/10/2026",
    loaiGiaoDich: "Nhận dẻ thô trả về",
    tlVangGiao: -3.4200,
    tuoiGiao: 68.0,
    quy24k: -2.3256,
    tienCong: 0,
    shipper: "Nguyễn Văn Tuấn (Đội xe)",
    status: "Chờ đo phổ",
    note: "Đã mang dẻ về kho, chờ KCS đo phổ hàm lượng trước khi gạch nợ"
  }
];
