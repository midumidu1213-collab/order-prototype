// Danh mục Modules hệ thống phân nhóm theo Khối nghiệp vụ
export const MODULE_CATEGORIES = [
  {
    id: "business",
    name: "Kinh Doanh & Bán Hàng",
    modules: [
      { id: "sales", name: "Bán Hàng", icon: "ShoppingCart", code: "MOD_SALES", categoryCount: 3, guideCount: 7 },
      { id: "customers", name: "Khách Hàng", icon: "Users", code: "MOD_CRM", categoryCount: 2, guideCount: 5 },
      { id: "discounts", name: "Chiết Khấu", icon: "BadgePercent", code: "MOD_DISC", categoryCount: 2, guideCount: 4 },
      { id: "pricing", name: "Tính Giá", icon: "Calculator", code: "MOD_PRICE", categoryCount: 2, guideCount: 4 },
    ]
  },
  {
    id: "procurement",
    name: "Cung Ứng & Mua Hàng",
    modules: [
      { id: "procurement", name: "Mua Hàng", icon: "ShoppingBag", code: "MOD_PURCH", categoryCount: 3, guideCount: 6 }
    ]
  },
  {
    id: "inventory",
    name: "Kho Vận & Vật Tư",
    modules: [
      { id: "internal_warehouse", name: "Kho Nội Bộ", icon: "Boxes", code: "MOD_WH_INT", categoryCount: 3, guideCount: 8 },
      { id: "tools_warehouse", name: "Kho Công Cụ Dụng Cụ", icon: "Wrench", code: "MOD_WH_TOOL", categoryCount: 2, guideCount: 4 },
      { id: "accessories_warehouse", name: "Kho Phụ Liệu", icon: "Package", code: "MOD_WH_ACC", categoryCount: 2, guideCount: 5 },
      { id: "finished_goods_warehouse", name: "Kho Thành Phẩm", icon: "Archive", code: "MOD_WH_FG", categoryCount: 3, guideCount: 7 },
      { id: "raw_material_control", name: "Kiểm Soát Nguyên Liệu", icon: "Scale", code: "MOD_MAT_CTRL", categoryCount: 2, guideCount: 5 },
    ]
  },
  {
    id: "production",
    name: "Sản Xuất & Kỹ Thuật",
    modules: [
      { id: "products", name: "Quản Lý Sản Phẩm", icon: "Gem", code: "MOD_PROD", categoryCount: 4, guideCount: 9 },
      { id: "production_planning", name: "Kế Hoạch Sản Xuất", icon: "CalendarRange", code: "MOD_PROD_PLAN", categoryCount: 3, guideCount: 6 },
      { id: "production_execution", name: "Thực Thi Sản Xuất", icon: "Cog", code: "MOD_PROD_EXEC", categoryCount: 3, guideCount: 8 },
      { id: "quality_control", name: "Quản Lý Chất Lượng (QC)", icon: "ShieldCheck", code: "MOD_QC", categoryCount: 2, guideCount: 5 },
    ]
  },
  {
    id: "hr",
    name: "Nhân Sự & Tổ Chức",
    modules: [
      { id: "org_chart", name: "Sơ Đồ Tổ Chức", icon: "Network", code: "MOD_ORG", categoryCount: 2, guideCount: 3 },
      { id: "recruitment", name: "Tuyển Dụng", icon: "UserPlus", code: "MOD_RECRUIT", categoryCount: 2, guideCount: 4 },
      { id: "timesheet", name: "Chấm Công", icon: "Clock", code: "MOD_TIME", categoryCount: 2, guideCount: 4 },
      { id: "payroll", name: "Tính Lương", icon: "Receipt", code: "MOD_PAYROLL", categoryCount: 2, guideCount: 5 },
      { id: "human_resources", name: "Nhân Sự", icon: "UserCheck", code: "MOD_HR", categoryCount: 3, guideCount: 6 },
    ]
  }
];

// Danh sách phẳng tất cả module để tiện tra cứu
export const ALL_MODULES = MODULE_CATEGORIES.flatMap(c => c.modules);

// Danh sách Người dùng & Phân quyền Module mẫu
export const USERS_SAMPLE = [
  {
    id: "user_admin",
    name: "Sevago Jewelry",
    role: "Quản lý",
    avatar: "SJ",
    assignedModules: ALL_MODULES.map(m => m.id),
    canManageAll: true,
    canEdit: true,
  },
  {
    id: "user_manager",
    name: "Trần Minh Tuấn",
    role: "Trưởng phòng Kinh Doanh",
    avatar: "TT",
    assignedModules: ["sales", "customers", "discounts", "pricing"],
    canManageAll: false,
    canEdit: true,
  },
  {
    id: "user_enduser",
    name: "Lê Thị Bích",
    role: "Nhân viên kinh doanh",
    avatar: "LB",
    assignedModules: ["sales", "customers", "discounts"],
    canManageAll: false,
    canEdit: false,
    isEndUser: true,
  }
];

// Cấu trúc phân cấp 4 tầng: Module → Nhóm chức năng → Tính năng → HDSD
export const USER_GUIDE_DATA = {
  // 1. Module: Bán Hàng
  sales: {
    featureGroups: [
      {
        id: "fg_order_mgmt",
        name: "QUẢN LÝ ĐƠN HÀNG",
        features: [
          {
            id: "feat_so_create",
            name: "Tạo đơn hàng",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: [
              {
                id: "guide_so_01",
                code: "AC-12312",
                title: "1.1 Tạo Đơn Hàng Bán Mới",
                shortTitle: "Tạo đơn hàng",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "23/07/2024 09:00",
                duration: "08:00",
                targetAudience: "Nhân viên kinh doanh",
                applicableScreen: "Quản Lý Đơn Hàng > Thông Tin Đơn Hàng (/)",
                applicablePath: "/",
                description: "Quy Trình Tạo Đơn Bán Sỉ Mới Từ Khâu Tiếp Nhận Yêu Cầu Tiệm Vàng, Chọn Mẫu Trên E-Catalogue, Áp Dụng Chiết Khấu Bậc Thang Và Gửi Duyệt Kỹ Thuật.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [
                  { name: "Bieu_mau_import_don_hang_SO_v3.Xlsx", size: "32.5 KB", type: "excel" },
                  { name: "Bieu_mau_import_don_hang_SO_v3.Xlsx", size: "32.5 KB", type: "excel" }
                ],
                milestones: [
                  {
                    stepNum: 1,
                    time: "00:00",
                    title: "Truy Cập Phân Hệ & Tạo Mới Đơn Hàng Bán Sỉ (SO)",
                    action: "Từ Thanh Điều Hướng Bên Trái Chọn Bán Hàng > Quản Lý Đơn Hàng. Bấm Nút '+' Tạo Đơn Mới Ở Góc Trên Bên Phải Màn Hình.",
                    shortcut: "Phím Tắt Nhanh: Alt + N"
                  },
                  {
                    stepNum: 2,
                    time: "01:15",
                    title: "Chọn Thông Tin Đại Lý & Kiểm Tra Hạn Mức Tín Dụng",
                    action: "Gõ tên hoặc mã tiệm vàng đại lý (ví dụ: 2000001 - Vàng Bạc Kim Yến). Hệ thống tự động kiểm tra hạn mức công nợ.",
                    shortcut: "Phím Tắt Nhanh: Alt + F"
                  },
                  {
                    stepNum: 3,
                    time: "02:40",
                    title: "Nhặt Mẫu Trang Sức Trực Tiếp Trên E-Catalogue Chào Hàng",
                    action: "Lọc theo tuổi vàng (61Y, 75W), chọn kiểu dáng nhẫn/vòng và cấu hình ni tay theo yêu cầu đại lý.",
                    shortcut: "Phím Tắt Nhanh: Alt + C"
                  },
                  {
                    stepNum: 4,
                    time: "03:50",
                    title: "Áp Dụng Chính Sách Chiết Khấu Bậc Thang & Dịch Vụ Xi Mạ",
                    action: "Hệ thống tự động áp biểu chiết khấu theo trọng lượng vàng. Chọn màu xi mạ đặc biệt (Rose Gold / Two-Tone) nếu có.",
                    shortcut: "Phím Tắt Nhanh: Alt + D"
                  },
                  {
                    stepNum: 5,
                    time: "05:20",
                    title: "Rà Soát Hạn Giao Hàng Chành Xe & Lưu Bản Nháp Hoặc Gửi Duyệt",
                    action: "Kiểm tra hạn giao dự kiến, thông tin chành xe nhận hàng và bấm Lưu Nháp (Draft) hoặc Gửi Duyệt Kỹ Thuật.",
                    shortcut: "Phím Tắt Nhanh: Ctrl + S"
                  }
                ],
                prerequisites: [
                  "Tài Khoản Nhân Viên Được Cấp Quyền Tạo Đơn Hàng (SO_CREATE).",
                  "Tiệm Vàng Đại Lý Đã Tồn Tại Và Ở Trạng Thái Kích Hoạt Trên Phân Hệ Master Data Khách Hàng.",
                  "Sản Phẩm Chào Bán Đã Có Giá Niêm Yết Trong Bảng Giá Bán Sỉ Hiện Hành."
                ],
                completedResults: [
                  "Mã Đơn Bán Sỉ Mới Được Sinh Tự Động Theo Quy Tắc: SO-YYYYMM-XXXX.",
                  "Tồn Kho Vàng/Kim Cương Được Giữ Chỗ Tạm Thời (Soft Allocation) Trong 48 Giờ.",
                  "Thông Báo Tự Động Gửi Đến Trưởng Bộ Phận Kinh Doanh Để Phê Duyệt Hạn Mức Công Nợ."
                ],
                businessRules: [
                  {
                    title: "Chính Sách Chiết Khấu Bậc Thang",
                    content: "Chiết Khấu Thương Mại Tự Động Áp Dụng Theo Tổng Trọng Lượng Vàng Hoặc Giá Trị Đơn Hàng Theo Quy Chế Kinh Doanh Trang Sức Sỉ Năm 2026. Bất Kỳ Mức Chiết Khấu Vượt Khung Nào Đều Yêu Cầu Phê Duyệt 2 Cấp (Trưởng Phòng & Giám Đốc Kinh Doanh)."
                  },
                  {
                    title: "Hạn Mức Công Nợ & Kiểm Tra Tồn Dư",
                    content: "Nếu Tiệm Vàng Có Nợ Quá Hạn Trên 30 Ngày Hoặc Tổng Công Nợ Vượt Hạn Mức Tín Dụng Được Duyệt, Hệ Thống Sẽ Tự Động Khóa Nút 'Gửi Duyệt' Và Hiển Thị Cảnh Báo Đỏ."
                  },
                  {
                    title: "Phí Gia Công Và Xi Mạ",
                    content: "Đơn Hàng Yêu Cầu Xi Mạ Màu Đặc Biệt (Rose Gold / Two-Tone) Sẽ Cộng Thêm Phí Dịch Vụ 45,000 Đ/Chỉ Và Kéo Dài Thời Gian Giao Hàng Thêm Tối Thiểu 2 Ngày Làm Việc."
                  }
                ],
                commonErrors: [
                  {
                    question: "Không tìm thấy khách hàng khi gõ tên",
                    cause: "Khách hàng chưa được phê duyệt kích hoạt trên phân hệ Master Data.",
                    solution: "Liên hệ Admin hoặc vào phân hệ Khách hàng kiểm tra trạng thái kích hoạt của hồ sơ."
                  },
                  {
                    question: "Cảnh báo vượt hạn mức công nợ khi gửi duyệt đơn",
                    cause: "Khách hàng có nợ quá hạn trên 30 ngày hoặc tổng công nợ vượt hạn mức tín dụng được duyệt.",
                    solution: "Liên hệ Quản lý kinh doanh để làm phiếu đề xuất bảo lãnh công nợ đặc biệt."
                  },
                  {
                    question: "Mẫu trang sức không hiển thị giá bán sỉ niêm yết",
                    cause: "Sản phẩm chưa được cập nhật trong Bảng giá bán sỉ hiện hành của chu kỳ giá.",
                    solution: "Liên hệ bộ phận Định giá để kích hoạt giá niêm yết cho mã sản phẩm."
                  }
                ]
              }
            ]
          },
          {
            id: "feat_do_mgmt",
            name: "Phiếu giao hàng DO",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: [
              {
                id: "guide_do_01",
                code: "AC-12313",
                title: "1.2 Lập Phiếu Giao Hàng (DO) Từ Đơn Hàng SO",
                shortTitle: "Phiếu giao hàng DO",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "23/07/2024 09:15",
                duration: "08:00",
                targetAudience: "Điều phối giao hàng, Thủ kho",
                applicableScreen: "Quản Lý Giao Hàng > Phiếu Giao Hàng DO",
                applicablePath: "/delivery-orders",
                description: "Quy trình xuất kho thành phẩm và bàn giao hàng trang sức cho đơn vị vận chuyển chành xe theo mã SO.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [
                  { name: "Bieu_mau_bien_ban_giao_hang_DO.xlsx", size: "28.4 KB", type: "excel" }
                ],
                milestones: [
                  {
                    stepNum: 1,
                    time: "00:00",
                    title: "Truy cập màn hình Phiếu giao hàng",
                    action: "Vào menu Bán Hàng > Phiếu giao hàng DO. Bấm + Tạo phiếu giao.",
                    shortcut: "Phím Tắt Nhanh: Alt + N"
                  },
                  {
                    stepNum: 2,
                    time: "01:20",
                    title: "Chọn đơn hàng SO cần giao",
                    action: "Chọn mã SO đã được duyệt kỹ thuật và thành phẩm đã nhập kho.",
                    shortcut: "Phím Tắt Nhanh: Alt + S"
                  }
                ],
                prerequisites: [
                  "Đơn hàng SO ở trạng thái Đã Duyệt Kỹ Thuật.",
                  "Kho thành phẩm đã kiểm đếm và đóng gói niêm phong."
                ],
                completedResults: [
                  "Sinh mã phiếu DO tự động và cập nhật trạng thái kho sang Đã Xuất Giao."
                ],
                businessRules: [
                  {
                    title: "Niêm phong bưu kiện",
                    content: "Mọi đơn hàng trang sức trên 50 triệu bắt buộc có chữ ký bàn giao 2 bên và niêm phong kẹp chì."
                  }
                ],
                commonErrors: [
                  {
                    question: "Không tìm thấy mã SO trong danh sách tạo DO",
                    cause: "Đơn hàng SO chưa được phòng Kỹ thuật duyệt hoặc chưa đủ tồn kho thành phẩm.",
                    solution: "Kiểm tra lại trạng thái đơn hàng trên phân hệ SO."
                  }
                ]
              }
            ]
          },
          {
            id: "feat_so_cancel",
            name: "Yêu cầu huỷ SO",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: [
              {
                id: "guide_so_cancel_01",
                code: "AC-12314",
                title: "1.3 Quy Trình Xử Lý Yêu Cầu Hủy Đơn Hàng SO",
                shortTitle: "Yêu cầu huỷ SO",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "23/07/2024 14:00",
                duration: "08:00",
                targetAudience: "Nhân viên kinh doanh, Quản lý",
                applicableScreen: "Bán Hàng > Yêu cầu hủy SO",
                applicablePath: "/cancel-requests",
                description: "Các bước lập phiếu yêu cầu hủy đơn hàng bán sỉ và hoàn trả tiền đặt cọc giữ giá vàng.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [],
                milestones: [],
                prerequisites: ["Đơn hàng SO chưa tiến hành đúc phôi vàng."],
                completedResults: ["Đơn hàng chuyển sang trạng thái Đã Hủy."],
                businessRules: [
                  {
                    title: "Phạt hủy cọc",
                    content: "Nếu hủy sau 24 giờ kể từ khi duyệt kỹ thuật, phí hủy cọc 5% giá trị đơn hàng sẽ được áp dụng."
                  }
                ],
                commonErrors: []
              }
            ]
          },
          {
            id: "feat_discount_policy",
            name: "Chiết khấu",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: [
              {
                id: "guide_disc_01",
                code: "AC-12315",
                title: "1.4 Chính Sách & Cấu Hình Chiết Khấu Bậc Thang",
                shortTitle: "Chiết khấu",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "23/07/2024 16:00",
                duration: "08:00",
                targetAudience: "Quản lý kinh doanh",
                applicableScreen: "Bán Hàng > Chiết Khấu",
                applicablePath: "/",
                description: "Thiết lập biểu chiết khấu theo phân hạng khách hàng kim cương, vàng, bạc và quy mô sản lượng.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [],
                milestones: [],
                prerequisites: ["Quyền Quản trị viên hoặc Trưởng phòng kinh doanh."],
                completedResults: ["Biểu chiết khấu có hiệu lực ngay lập tức khi tạo đơn hàng mới."],
                businessRules: [],
                commonErrors: []
              }
            ]
          }
        ]
      },
      {
        id: "fg_catalogue_demo",
        name: "KẾ HOẠCH CHÀO HÀNG & E-CATALOGUE",
        features: [
          {
            id: "feat_catalogue_demo",
            name: "Trình diễn E-catalouge",
            subTitle: "Hướng Dẫn Xài E-Cataloge",
            guides: [
              {
                id: "guide_cat_demo_01",
                code: "AC-12316",
                title: "2.1 Hướng Dẫn Trình Diễn & Chào Mẫu Trên E-Catalogue",
                shortTitle: "Trình diễn E-catalouge",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "24/07/2024 08:30",
                duration: "08:00",
                targetAudience: "Nhân viên kinh doanh",
                applicableScreen: "E-Catalogue Chào Hàng (/catalogue)",
                applicablePath: "/catalogue",
                description: "Cách sử dụng chế độ trình diễn E-Catalogue 3D tương tác khi tiếp xúc trực tiếp đại lý tiệm vàng.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [
                  { name: "Huong_dan_chao_hang_3D.pdf", size: "2.1 MB", type: "pdf" }
                ],
                milestones: [],
                prerequisites: ["Thiết bị có kết nối Internet hoặc đã tải dữ liệu ngoại tuyến."],
                completedResults: ["Tạo danh sách mẫu ưa thích và xuất báo giá tức thì."],
                businessRules: [],
                commonErrors: []
              }
            ]
          },
          {
            id: "feat_demo_02",
            name: "Tạo đơn hàng",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: [
              {
                id: "guide_demo_02",
                code: "AC-12317",
                title: "2.2 Đặt Hàng Trực Tiếp Từ Màn Hình E-Catalogue",
                shortTitle: "Tạo đơn hàng từ E-Cat",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "24/07/2024 10:00",
                duration: "08:00",
                targetAudience: "Nhân viên kinh doanh",
                applicableScreen: "E-Catalogue > Giỏ Chào Hàng",
                applicablePath: "/catalogue",
                description: "Nhặt mẫu trực tiếp vào giỏ chào hàng và chuyển đổi thành đơn SO tự động.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [],
                milestones: [],
                prerequisites: [],
                completedResults: [],
                businessRules: [],
                commonErrors: []
              }
            ]
          },
          {
            id: "feat_demo_03",
            name: "Tạo đơn hàng",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: []
          },
          {
            id: "feat_demo_04",
            name: "Tạo đơn hàng",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: []
          },
          {
            id: "feat_demo_05",
            name: "Tạo đơn hàng",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: []
          },
          {
            id: "feat_demo_06",
            name: "Tạo đơn hàng",
            subTitle: "Hướng Dẫn Tạo Và Quản Lý Hồ Sơ",
            guides: []
          }
        ]
      }
    ]
  },

  // 2. Module: Mua Hàng
  procurement: {
    featureGroups: [
      {
        id: "fg_po_mgmt",
        name: "QUẢN LÝ MUA HÀNG & NHÀ CUNG CẤP",
        features: [
          {
            id: "feat_po_create",
            name: "Tạo đơn mua hàng (PO)",
            subTitle: "Quy Trình Mua Vàng & Đá Quý",
            guides: [
              {
                id: "guide_po_01",
                code: "AC-20101",
                title: "1.1 Tạo Đơn Đặt Hàng Mua Nguyên Liệu Vàng & Kim Cương",
                shortTitle: "Tạo đơn mua hàng",
                status: "active",
                author: "[03920] - Trần Minh Tuấn",
                createdAt: "25/07/2024 09:00",
                duration: "07:30",
                targetAudience: "Phòng Mua hàng",
                applicableScreen: "Mua Hàng > Đơn Mua Hàng PO",
                applicablePath: "/",
                description: "Quy trình lập lệnh mua vàng nguyên liệu 24K, bạc hạt và kim cương kiểm định từ các nhà cung cấp uy tín.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [],
                milestones: [],
                prerequisites: [],
                completedResults: [],
                businessRules: [],
                commonErrors: []
              }
            ]
          }
        ]
      }
    ]
  }
};

// Dữ liệu cây danh mục phục vụ trang Admin Cấu hình (Tree Hierarchy)
export const INITIAL_ADMIN_TREE_DATA = [
  {
    id: "tree_sales",
    name: "Bán hàng",
    guideCount: 5,
    children: [
      {
        id: "tree_sales_so",
        name: "Đơn hàng SO",
        guideCount: 5,
        children: [
          { id: "tree_sales_so_1", name: "Tạo đơn hàng", guideCount: 5 },
          { id: "tree_sales_so_2", name: "Tạo đơn hàng", guideCount: 5 },
          { id: "tree_sales_so_3", name: "Tạo đơn hàng", guideCount: 5 }
        ]
      },
      {
        id: "tree_sales_do",
        name: "Phiếu giao hàng DO",
        guideCount: 2,
        children: [
          { id: "tree_sales_do_1", name: "Lập phiếu giao hàng", guideCount: 2 }
        ]
      }
    ]
  },
  {
    id: "tree_procure",
    name: "Mua hàng",
    guideCount: 5,
    children: [
      {
        id: "tree_procure_po",
        name: "Đơn mua hàng PO",
        guideCount: 3,
        children: [
          { id: "tree_procure_po_1", name: "Tạo đơn mua hàng", guideCount: 3 }
        ]
      }
    ]
  },
  {
    id: "tree_wh",
    name: "Kho vận",
    guideCount: 8,
    children: [
      {
        id: "tree_wh_fg",
        name: "Kho thành phẩm",
        guideCount: 4,
        children: [
          { id: "tree_wh_fg_1", name: "Nhập kho thành phẩm", guideCount: 4 }
        ]
      }
    ]
  }
];
