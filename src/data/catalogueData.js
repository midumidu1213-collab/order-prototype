// Master Data for SEVAGO JEWELRY E-Catalogue

export const JEWELRY_CATEGORIES = [
  {
    id: "bo",
    name: "Bộ",
    count: 14,
    image: "set-royal-emerald",
    desc: "Bộ trang sức phối hợp cao cấp (3-4 món đồng bộ)"
  },
  {
    id: "vong-tay",
    name: "Vòng tay",
    count: 36,
    image: "bracelet-gold",
    desc: "Vòng tay vàng, lắc mắt xích, cuff cao cấp"
  },
  {
    id: "day-chuyen-nu",
    name: "Dây chuyền nữ",
    count: 28,
    image: "necklace-emerald",
    desc: "Dây chuyền nữ đính đá, ngọc lục bảo & kim cương"
  },
  {
    id: "nhan-nu",
    name: "Nhẫn nữ",
    count: 52,
    image: "ring-snake",
    desc: "Nhẫn nữ Solitaire, nhẫn rắn thời thượng"
  },
  {
    id: "nhan-cuoi",
    name: "Nhẫn cưới (1 cặp)",
    count: 24,
    image: "wedding-rings",
    desc: "Nhẫn cưới đôi vàng 18K/vàng hồng gắn đá quý"
  },
  {
    id: "day-chuyen-nam",
    name: "Dây chuyền nam",
    count: 18,
    image: "necklace-men",
    desc: "Dây chuyền nam mắt xích Cuban, rồng vàng"
  },
  {
    id: "nhan-nam",
    name: "Nhẫn Nam",
    count: 30,
    image: "ring-men-black",
    desc: "Nhẫn nam đính đá Onyx, hoa văn rồng phượng"
  },
  {
    id: "bong-tai",
    name: "Bông tai",
    count: 40,
    image: "earrings-heart",
    desc: "Bông tai nụ, bông tai dáng thả đính kim cương"
  },
  {
    id: "mat-day-nu",
    name: "Mặt dây nữ",
    count: 22,
    image: "pendant-female",
    desc: "Mặt dây chuyền ngọc trai, hoa tuyết"
  },
  {
    id: "mat-day-nam",
    name: "Mặt dây nam",
    count: 16,
    image: "pendant-male",
    desc: "Mặt dây nam phong thủy, tỳ hưu, quan công"
  },
  {
    id: "lac-tay-nu",
    name: "Lắc tay nữ",
    count: 25,
    image: "bracelet-female",
    desc: "Lắc tay đính đá sắc màu, charm thời trang"
  },
  {
    id: "lac-tay-nam",
    name: "Lắc tay nam",
    count: 12,
    image: "bracelet-male",
    desc: "Lắc tay nam bản lớn vàng 24K/18K"
  },
  {
    id: "kieng-co",
    name: "Kiềng cổ",
    count: 8,
    image: "kieng-co",
    desc: "Kiềng cưới hoa mai, kiềng trơn truyền thống"
  },
  {
    id: "kim-cuong-roi",
    name: "Kim cương rời",
    count: 65,
    image: "loose-diamond",
    desc: "Kim cương kiểm định GIA từ 3.6mm đến 8.1mm"
  },
  {
    id: "lac-chan",
    name: "Lắc chân",
    count: 9,
    image: "anklet",
    desc: "Lắc chân chuông bạc, vàng 10K xinh xắn"
  },
  {
    id: "nhan-kim-tien",
    name: "Nhẫn kim tiền",
    count: 15,
    image: "ring-kim-tien",
    desc: "Nhẫn kim tiền tài lộc may mắn đầu năm"
  }
];

export const JEWELRY_PRODUCTS = [
  // =========================================================================
  // SẢN PHẨM BỘ (JEWELRY SUITES / SETS)
  // =========================================================================
  {
    id: "set-1",
    isSet: true,
    productCode: "SET-EM04-18K-001",
    productName: "Bộ Trang Sức Hoàng Gia Sen Vàng (4 Món)",
    categoryId: "bo",
    categoryName: "Bộ",
    weight: 0.055,
    wagePrice: 5600000,
    priceDisplay: "5,600,000đ",
    rawPrice: 5600000,
    soldCount: 15,
    imageType: "set-royal-emerald",
    specs: {
      weight: "0.055",
      productType: "Bộ 4 món (Nhẫn, Dây chuyền, Bông tai, Lắc tay)",
      wage: "5,600,000đ"
    },
    defaultOptions: {
      goldColor: "Vàng",
      goldAge: "18K (75Y)",
      mainStoneColor: "Xanh Emerald",
      changeRequest: "Không thay đổi",
      note: "Hộp nhung VIP"
    },
    availableGoldColors: ["Vàng", "Trắng", "Hồng", "Vàng 2 màu"],
    availableGoldAges: ["18K (75Y)", "14K (58.5Y)", "10K (41.6Y)", "24K (99.9Y)"],
    availableStoneColors: ["Trắng / Đỏ", "Xanh Emerald", "Kim Cương Trắng", "Đỏ Ruby", "Tím Sapphire"],
    availableChangeRequests: [
      "Chọn loại thay đổi",
      "Không thay đổi",
      "Đổi toàn bộ đá tấm sang CZ loại 1",
      "Khắc tên thương hiệu riêng lên từng món"
    ],
    // 4 MÓN THÀNH PHẦN CHI TIẾT
    components: [
      {
        id: "comp-1",
        itemType: "ring",
        name: "Nhẫn nữ",
        sku: "RN-EM04-18K-001",
        weight: 0.012,
        wagePrice: 1250000,
        priceDisplay: "1,250,000đ",
        defaultOption: "52",
        optionType: "Size Ni",
        options: ["48", "50", "52", "54", "56", "58"],
        imageType: "ring-emerald",
        icon: "💍"
      },
      {
        id: "comp-2",
        itemType: "necklace",
        name: "Dây chuyền",
        sku: "NK-EM04-18K-001",
        weight: 0.022,
        wagePrice: 2100000,
        priceDisplay: "2,100,000đ",
        defaultOption: "45cm",
        optionType: "Chiều dài",
        options: ["40cm", "42cm", "45cm", "50cm"],
        imageType: "necklace-emerald",
        icon: "📿"
      },
      {
        id: "comp-3",
        itemType: "earrings",
        name: "Bông tai",
        sku: "ER-EM04-18K-001",
        weight: 0.006,
        wagePrice: 850000,
        priceDisplay: "850,000đ",
        defaultOption: "Chốt vặn",
        optionType: "Kiểu chốt",
        options: ["Chốt vặn", "Chốt bấm", "Khuyên tròn"],
        imageType: "earrings-heart",
        icon: "✨"
      },
      {
        id: "comp-4",
        itemType: "bracelet",
        name: "Lắc tay",
        sku: "BR-EM04-18K-001",
        weight: 0.015,
        wagePrice: 1400000,
        priceDisplay: "1,400,000đ",
        defaultOption: "54",
        optionType: "Size Ni",
        options: ["50", "52", "54", "56", "58"],
        imageType: "bracelet-gold",
        icon: "💫"
      }
    ]
  },
  {
    id: "set-2",
    isSet: true,
    productCode: "ST000004A00",
    productName: "Bộ Trang Sức Cưới Kim Cương (4 Món)",
    categoryId: "bo",
    categoryName: "Bộ",
    weight: 0.048,
    wagePrice: 6200000,
    priceDisplay: "6,200,000đ",
    rawPrice: 6200000,
    soldCount: 22,
    imageType: "set-diamond-bridal",
    specs: {
      weight: "0.048",
      productType: "Bộ 4 món (Nhẫn, Dây chuyền, Bông tai, Vòng tay)",
      wage: "6,200,000đ"
    },
    defaultOptions: {
      goldColor: "Trắng",
      goldAge: "18K (75Y)",
      mainStoneColor: "Trắng / Đỏ",
      changeRequest: "Không thay đổi",
      note: "Đóng gói Hộp Cưới Sơn Mài"
    },
    availableGoldColors: ["Trắng", "Vàng hồng", "Vàng"],
    availableGoldAges: ["18K (75Y)", "14K (58.5Y)", "10K (41.6Y)"],
    availableStoneColors: ["Trắng / Đỏ", "Trắng", "Đỏ", "Xanh Emerald", "Tím"],
    availableChangeRequests: ["Chọn loại thay đổi", "Khắc ngày cưới lồng tên", "Không thay đổi"],
    components: [
      {
        id: "comp-21",
        itemType: "ring",
        name: "Nhẫn nữ",
        sku: "GY0RG000095A00A00CZBB3CZXX1017",
        weight: 0.010,
        wagePrice: 1500000,
        priceDisplay: "1,500,000đ",
        defaultOption: "50",
        optionType: "Size Ni",
        options: ["48", "50", "52", "54", "56", "58"],
        imageType: "loose-diamond",
        icon: "💍"
      },
      {
        id: "comp-22",
        itemType: "necklace",
        name: "Dây chuyền",
        sku: "GY0NE000004B00B00000000000000420",
        weight: 0.018,
        wagePrice: 2200000,
        priceDisplay: "2,200,000đ",
        defaultOption: "42cm",
        optionType: "Chiều dài",
        options: ["40cm", "42cm", "45cm"],
        imageType: "diamond-set",
        icon: "📿"
      },
      {
        id: "comp-23",
        itemType: "earrings",
        name: "Bông tai",
        sku: "GY0EG000095A00A000000000000000",
        weight: 0.006,
        wagePrice: 900000,
        priceDisplay: "900,000đ",
        defaultOption: null,
        optionType: null,
        options: null,
        imageType: "earrings-heart",
        icon: "✨"
      },
      {
        id: "comp-24",
        itemType: "bracelet",
        name: "Vòng tay",
        sku: "GY0BE000095A00A00CZBB3CZXX1560",
        weight: 0.014,
        wagePrice: 1600000,
        priceDisplay: "1,600,000đ",
        defaultOption: "54",
        optionType: "Size Ni",
        options: ["52", "54", "56", "58"],
        imageType: "purple-flower-bracelet",
        icon: "💫"
      }
    ]
  },

  // =========================================================================
  // SẢN PHẨM ĐƠN LẺ (SINGLE JEWELRY ITEMS)
  // =========================================================================
  {
    id: "prod-1",
    isSet: false,
    productCode: "GY0BE000110A00A00CZXX100000560",
    productName: "Vòng tay xích vàng tây 10K/18K Oval bóng",
    categoryId: "vong-tay",
    categoryName: "Vòng tay",
    weight: 0.011,
    wagePrice: 1265000,
    priceDisplay: "1,265,000đ",
    rawPrice: 1265000,
    soldCount: 0,
    imageType: "gold-chain-bracelet",
    specs: {
      weight: "0.011",
      productType: "Vòng tay",
      wage: "1,265,000đ"
    },
    defaultOptions: {
      goldColor: "Vàng",
      niSize: "56",
      mainStoneColor: "Xám",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Vàng", "Trắng", "Hồng", "Vàng 2 màu"],
    availableNiSizes: ["50", "52", "54", "56", "58", "60"],
    availableStoneColors: ["Xám", "Trắng", "Xanh Emerald", "Đỏ Ruby", "Tím Sapphire"],
    availableChangeRequests: [
      "Chọn loại thay đổi",
      "Không thay đổi",
      "Đổi sang đá tấm CZ loại 1",
      "Đổi tuổi vàng 10K lên 18K",
      "Khắc laser chữ/ký hiệu riêng"
    ]
  },
  {
    id: "prod-2",
    isSet: false,
    productCode: "GY0BE000104A00A00000000000560",
    productName: "Lắc tay charm mèo Kitty",
    categoryId: "vong-tay",
    categoryName: "Vòng tay",
    weight: 0.040,
    wagePrice: 300000,
    priceDisplay: "300,000đ",
    rawPrice: 300000,
    soldCount: 0,
    imageType: "cat-charm-bracelet",
    specs: {
      weight: "0.040",
      productType: "Vòng tay",
      wage: "300,000đ"
    },
    defaultOptions: {
      goldColor: "Trắng",
      niSize: "56",
      mainStoneColor: "000",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Trắng", "Vàng", "Hồng"],
    availableNiSizes: ["52", "54", "56", "58"],
    availableStoneColors: ["000", "Hồng phấn", "Trắng bạc"],
    availableChangeRequests: [
      "Chọn loại thay đổi",
      "Không thay đổi",
      "Đính thêm chuông bạc mini"
    ]
  },
  {
    id: "prod-3",
    isSet: false,
    productCode: "GY0BE000100A00A00CZBB3CZXX1560",
    productName: "Lắc tay hoa cỏ 4 lá",
    categoryId: "vong-tay",
    categoryName: "Vòng tay",
    weight: 0.018,
    wagePrice: 850000,
    priceDisplay: "Liên hệ sau",
    rawPrice: 850000,
    soldCount: 0,
    imageType: "purple-flower-bracelet",
    specs: {
      weight: "0.018",
      productType: "Vòng tay",
      wage: "850,000đ"
    },
    defaultOptions: {
      goldColor: "Trắng",
      niSize: "56",
      mainStoneColor: "Tím Amethyst",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Trắng", "Vàng hồng", "Vàng vàng"],
    availableNiSizes: ["50", "52", "54", "56", "58"],
    availableStoneColors: ["Tím Amethyst", "Xanh Biển Aquamarine", "Đỏ Garnet"],
    availableChangeRequests: [
      "Chọn loại thay đổi",
      "Không thay đổi",
      "Đổi màu đá chính",
      "Thu ngắn mắt xích"
    ]
  },
  {
    id: "prod-4",
    isSet: false,
    productCode: "RN0NE000108A00A00CZXX100000540",
    productName: "Nhẫn nữ hình rắn Serpent",
    categoryId: "nhan-nu",
    categoryName: "Nhẫn nữ",
    weight: 0.012,
    wagePrice: 1750000,
    priceDisplay: "1,750,000đ",
    rawPrice: 1750000,
    soldCount: 12,
    imageType: "ring-snake",
    specs: {
      weight: "0.012",
      productType: "Nhẫn nữ",
      wage: "1,750,000đ"
    },
    defaultOptions: {
      goldColor: "Trắng",
      niSize: "54",
      mainStoneColor: "Trắng Kim Cương",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Trắng", "Vàng 18K", "Vàng Hồng 750"],
    availableNiSizes: ["48", "50", "52", "54", "56"],
    availableStoneColors: ["Trắng Kim Cương", "Đá Mắt Rắn Ngọc Lục Bảo"],
    availableChangeRequests: ["Chọn loại thay đổi", "Không thay đổi", "Gắn mắt đá đỏ Ruby"]
  },
  {
    id: "prod-5",
    isSet: false,
    productCode: "RN0MA000102A00A00CZXX100000600",
    productName: "Nhẫn nam mặt đá đen Onyx",
    categoryId: "nhan-nam",
    categoryName: "Nhẫn Nam",
    weight: 0.038,
    wagePrice: 3200000,
    priceDisplay: "3,200,000đ",
    rawPrice: 3200000,
    soldCount: 8,
    imageType: "ring-men-black",
    specs: {
      weight: "0.038",
      productType: "Nhẫn Nam",
      wage: "3,200,000đ"
    },
    defaultOptions: {
      goldColor: "Vàng",
      niSize: "60",
      mainStoneColor: "Đen Onyx",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Vàng 18K", "Vàng 24K", "Vàng 10K"],
    availableNiSizes: ["56", "58", "60", "62", "64"],
    availableStoneColors: ["Đen Onyx", "Đỏ Ruby Nam Phi", "Xanh Sapphire"],
    availableChangeRequests: ["Chọn loại thay đổi", "Không thay đổi", "Đổi tuổi vàng 18K"]
  },
  {
    id: "prod-6",
    isSet: false,
    productCode: "NK0FE000105A00A00CZXX100000450",
    productName: "Bộ dây chuyền đính ngọc lục bảo",
    categoryId: "day-chuyen-nu",
    categoryName: "Dây chuyền nữ",
    weight: 0.022,
    wagePrice: 2400000,
    priceDisplay: "2,400,000đ",
    rawPrice: 2400000,
    soldCount: 5,
    imageType: "necklace-emerald",
    specs: {
      weight: "0.022",
      productType: "Dây chuyền nữ",
      wage: "2,400,000đ"
    },
    defaultOptions: {
      goldColor: "Vàng",
      niSize: "45cm",
      mainStoneColor: "Xanh Emerald",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Vàng", "Trắng", "Hồng"],
    availableNiSizes: ["40cm", "42cm", "45cm", "50cm"],
    availableStoneColors: ["Xanh Emerald", "Đỏ Ruby", "Kim Cương Trắng"],
    availableChangeRequests: ["Chọn loại thay đổi", "Không thay đổi", "Kèm thêm hoa tai cùng bộ"]
  },
  {
    id: "prod-7",
    isSet: false,
    productCode: "ER0FE000115A00A00CZXX100000300",
    productName: "Bông tai trái tim lồng kim cương",
    categoryId: "bong-tai",
    categoryName: "Bông tai",
    weight: 0.006,
    wagePrice: 950000,
    priceDisplay: "950,000đ",
    rawPrice: 950000,
    soldCount: 18,
    imageType: "earrings-heart",
    specs: {
      weight: "0.006",
      productType: "Bông tai",
      wage: "950,000đ"
    },
    defaultOptions: {
      goldColor: "Trắng",
      niSize: "Tiêu chuẩn",
      mainStoneColor: "Trắng",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Trắng", "Vàng hồng", "Vàng tây"],
    availableNiSizes: ["Tiêu chuẩn", "Chốt vặn", "Chốt bấm"],
    availableStoneColors: ["Trắng", "Hồng Pastel", "Xanh Biển"],
    availableChangeRequests: ["Chọn loại thay đổi", "Không thay đổi", "Đổi chốt vặn an toàn"]
  },
  {
    id: "prod-8",
    isSet: false,
    productCode: "WD0PR000100A00A00CZXX100000560",
    productName: "Cặp nhẫn cưới vàng hồng Eternity",
    categoryId: "nhan-cuoi",
    categoryName: "Nhẫn cưới (1 cặp)",
    weight: 0.020,
    wagePrice: 2100000,
    priceDisplay: "2,100,000đ",
    rawPrice: 2100000,
    soldCount: 9,
    imageType: "wedding-rings",
    specs: {
      weight: "0.020",
      productType: "Nhẫn cưới (1 cặp)",
      wage: "2,100,000đ"
    },
    defaultOptions: {
      goldColor: "Hồng",
      niSize: "Nam 58 - Nữ 52",
      mainStoneColor: "Kim Cương Trắng",
      changeRequest: "Không thay đổi",
      quantity: 1,
      note: ""
    },
    availableGoldColors: ["Hồng", "Vàng 18K", "Trắng Platin"],
    availableNiSizes: ["Nam 56 - Nữ 50", "Nam 58 - Nữ 52", "Nam 60 - Nữ 54"],
    availableStoneColors: ["Kim Cương Trắng", "Kim Cương Tự Nhiên GIA"],
    availableChangeRequests: ["Chọn loại thay đổi", "Khắc tên lồng ngày cưới", "Không thay đổi"]
  }
];
