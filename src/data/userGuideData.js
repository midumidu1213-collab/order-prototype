// Danh mục Modules hệ thống phân nhóm theo Khối nghiệp vụ
export const MODULE_CATEGORIES = [
  {
    id: "business",
    name: "Kinh Doanh & Bán Hàng",
    modules: [
      { id: "sales", name: "Bán Hàng", icon: "ShoppingCart", code: "MOD_SALES" },
      { id: "customers", name: "Khách Hàng", icon: "Users", code: "MOD_CRM" },
      { id: "discounts", name: "Chiết Khấu", icon: "BadgePercent", code: "MOD_DISC" },
      { id: "pricing", name: "Tính Giá", icon: "Calculator", code: "MOD_PRICE" },
    ]
  },
  {
    id: "procurement",
    name: "Cung Ứng & Mua Hàng",
    modules: [
      { id: "procurement", name: "Mua Hàng", icon: "ShoppingBag", code: "MOD_PURCH" }
    ]
  },
  {
    id: "inventory",
    name: "Kho Vận & Vật Tư",
    modules: [
      { id: "internal_warehouse", name: "Kho Nội Bộ", icon: "Boxes", code: "MOD_WH_INT" },
      { id: "tools_warehouse", name: "Kho Công Cụ Dụng Cụ", icon: "Wrench", code: "MOD_WH_TOOL" },
      { id: "accessories_warehouse", name: "Kho Phụ Liệu", icon: "Package", code: "MOD_WH_ACC" },
      { id: "finished_goods_warehouse", name: "Kho Thành Phẩm", icon: "Archive", code: "MOD_WH_FG" },
      { id: "raw_material_control", name: "Kiểm Soát Nguyên Liệu", icon: "Scale", code: "MOD_MAT_CTRL" },
    ]
  },
  {
    id: "production",
    name: "Sản Xuất & Kỹ Thuật",
    modules: [
      { id: "products", name: "Quản Lý Sản Phẩm", icon: "Gem", code: "MOD_PROD" },
      { id: "production_planning", name: "Kế Hoạch Sản Xuất", icon: "CalendarRange", code: "MOD_PROD_PLAN" },
      { id: "production_execution", name: "Thực Thi Sản Xuất", icon: "Cog", code: "MOD_PROD_EXEC" },
      { id: "quality_control", name: "Quản Lý Chất Lượng (QC)", icon: "ShieldCheck", code: "MOD_QC" },
    ]
  },
  {
    id: "hr",
    name: "Nhân Sự & Tổ Chức",
    modules: [
      { id: "org_chart", name: "Sơ Đồ Tổ Chức", icon: "Network", code: "MOD_ORG" },
      { id: "recruitment", name: "Tuyển Dụng", icon: "UserPlus", code: "MOD_RECRUIT" },
      { id: "timesheet", name: "Chấm Công", icon: "Clock", code: "MOD_TIME" },
      { id: "payroll", name: "Tính Lương", icon: "Receipt", code: "MOD_PAYROLL" },
      { id: "human_resources", name: "Nhân Sự", icon: "UserCheck", code: "MOD_HR" },
    ]
  }
];

// Danh sách phẳng tất cả module để tiện tra cứu
export const ALL_MODULES = MODULE_CATEGORIES.flatMap(c => c.modules);

// Danh sách Người dùng & Phân quyền Module mẫu
export const USERS_SAMPLE = [
  {
    id: "user_admin",
    name: "Administrator",
    role: "Quản trị viên",
    avatar: "AD",
    assignedModules: ALL_MODULES.map(m => m.id),
    canManageAll: true,
    canEdit: true,
  },
  {
    id: "user_01",
    name: "Sevago Jewelry",
    role: "Quản lý kinh doanh",
    avatar: "SJ",
    assignedModules: ["sales", "customers", "discounts", "pricing", "internal_warehouse", "finished_goods_warehouse"],
    canManageAll: false,
    canEdit: true,
  },
  {
    id: "user_warehouse",
    name: "Trần Văn Kho",
    role: "Thủ kho",
    avatar: "TK",
    assignedModules: ["internal_warehouse", "tools_warehouse", "accessories_warehouse", "finished_goods_warehouse", "raw_material_control"],
    canManageAll: false,
    canEdit: true,
  },
  {
    id: "user_enduser",
    name: "Lê Thị Bích",
    role: "Nhân viên kinh doanh",
    avatar: "EU",
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
        name: "Quản lý đơn hàng",
        features: [
          {
            id: "feat_so_create",
            name: "Tạo đơn hàng (SO)",
            guides: [
              {
                id: "guide_so_01",
                title: "Tạo đơn bán mới",
                status: "active",
                author: "Sevago Jewelry",
                targetAudience: "Nhân viên kinh doanh",
                applicableScreen: "Quản lý đơn hàng > Thông tin đơn hàng (/)",
                applicablePath: "/",
                description: "Quy trình tạo đơn bán sỉ mới từ khâu tiếp nhận yêu cầu tiệm vàng, chọn mẫu trên E-Catalogue, áp dụng chiết khấu bậc thang và gửi duyệt kỹ thuật.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                documents: [
                  { name: "Bieu_mau_import_don_hang_SO_v3.xlsx", size: "32.5 KB", type: "excel" },
                  { name: "Chinh_sach_ban_si_tiem_vang_2026.pdf", size: "1.4 MB", type: "pdf" }
                ],
                milestones: [
                  { time: "00:15", title: "Khởi tạo đơn hàng & chọn đối tác", action: "Gõ tên hoặc mã tiệm vàng (2000001) và kiểm tra hạn mức nợ khả dụng." },
                  { time: "01:10", title: "Thêm sản phẩm từ E-Catalogue", action: "Lọc theo tuổi vàng (61Y, 75W) và nhặt sản phẩm theo ni tay của khách." },
                  { time: "02:30", title: "Áp dụng chính sách chiết khấu bậc thang", action: "Nhập mã khuyến mãi hoặc chiết khấu số lượng lớn." },
                  { time: "03:15", title: "Rà soát điều khoản giao hàng & Lưu tạm", action: "Kiểm tra hạn giao, địa chỉ chành xe và bấm Lưu Draft sinh mã SO." }
                ],
                prerequisites: [
                  "Tài khoản có quyền 'Tạo đơn hàng (SO_CREATE)'.",
                  "Khách hàng đã tồn tại trên phân hệ Master Data Khách Hàng.",
                  "Sản phẩm chào bán đã có giá niêm yết trong bảng giá hiện hành."
                ],
                steps: [
                  {
                    stepNum: 1,
                    title: "Truy cập màn hình Đơn hàng",
                    action: "Vào menu 'Bán Hàng' > 'Quản lý đơn hàng' > chọn 'Thông tin đơn hàng'."
                  },
                  {
                    stepNum: 2,
                    title: "Bấm Thêm mới",
                    action: "Tại góc trên bên phải màn hình danh sách, nhấn nút '+ Thêm mới'."
                  },
                  {
                    stepNum: 3,
                    title: "Chọn thông tin Khách hàng",
                    action: "Gõ tên hoặc mã khách hàng (ví dụ: 2000001 - Cty TNHH Vàng Bạc Kim Yến). Hệ thống sẽ tự động tải điều khoản thanh toán."
                  },
                  {
                    stepNum: 4,
                    title: "Thêm danh mục sản phẩm vào đơn",
                    action: "Chọn 'Thêm sản phẩm' hoặc dùng nút 'Mở E-Catalogue Chào Hàng' để nhặt sản phẩm theo nhóm tuổi vàng."
                  },
                  {
                    stepNum: 5,
                    title: "Áp dụng chính sách chiết khấu",
                    action: "Nhập mã chiết khấu hoặc chọn chính sách chiết khấu bậc thang theo số lượng đặt mua."
                  },
                  {
                    stepNum: 6,
                    title: "Kiểm tra tổng tiền và điều khoản giao hàng",
                    action: "Rà soát hạn dự kiến giao, địa chỉ giao nhận và tổng giá trị thanh toán tạm tính."
                  },
                  {
                    stepNum: 7,
                    title: "Lưu bản nháp hoặc Chuyển duyệt",
                    action: "Nhấn 'Lưu tạm' (Draft) hoặc 'Gửi duyệt KT' để chuyển sang bộ phận Kỹ thuật kiểm tra khả năng đáp ứng."
                  }
                ],
                expectedResult: "Đơn hàng được sinh mã tự động (SOxxxxxx) và lưu ở trạng thái 'Chờ duyệt / Nháp'.",
                importantNotes: [
                  "Các trường có dấu (*) là thông tin bắt buộc: Khách hàng, Loại đơn hàng, Hạn giao dự kiến.",
                  "Với đơn hàng gia công đặc biệt, bắt buộc đính kèm file mẫu hoặc hình vẽ 3D."
                ],
                commonErrors: [
                  {
                    error: "Không tìm thấy khách hàng khi gõ tên",
                    cause: "Khách hàng chưa được phê duyệt kích hoạt trên phân hệ Master Data.",
                    solution: "Liên hệ Admin hoặc vào phân hệ Khách hàng kiểm tra trạng thái kích hoạt của hồ sơ."
                  },
                  {
                    error: "Cảnh báo vượt hạn mức công nợ",
                    cause: "Khách hàng còn hóa đơn quá hạn chưa thanh toán.",
                    solution: "Xin phê duyệt ngoại lệ từ Quản lý kinh doanh hoặc yêu cầu khách tất toán công nợ cũ."
                  }
                ],
                relatedGuides: [
                  { title: "Tạo và quản lý hồ sơ Khách Hàng", linkFeatId: "feat_cust_create", module: "customers" },
                  { title: "Áp dụng chính sách Chiết khấu đơn hàng", linkFeatId: "feat_disc_apply", module: "discounts" }
                ]
              },
              {
                id: "guide_so_02_exceptions",
                title: "Xử lý lỗi thường gặp & Case ngoại lệ khi tạo đơn hàng SO",
                status: "active",
                author: "Sevago Jewelry",
                targetAudience: "Nhân viên kinh doanh, Quản lý bán hàng",
                applicableScreen: "Bán Hàng > Quản lý đơn hàng > Tạo đơn hàng (SO)",
                applicablePath: "/",
                description: "Hướng dẫn xử lý các tình huống ngoại lệ: Khách hàng bị khóa nợ, đơn hàng mẫu đúc đặc thù, và cách xử lý khi giá vàng biến động nhanh.",
                prerequisites: [
                  "Đơn hàng đang ở trạng thái Nháp hoặc Chờ duyệt.",
                  "Có quyền gửi phiếu yêu cầu bảo lãnh ngoại lệ."
                ],
                steps: [
                  {
                    stepNum: 1,
                    title: "Kiểm tra cảnh báo hạn mức nợ",
                    action: "Khi hệ thống cảnh báo 'Vượt hạn mức nợ', bấm 'Gửi yêu cầu bảo lãnh' và đính kèm cam kết trả nợ của khách."
                  },
                  {
                    stepNum: 2,
                    title: "Xử lý sản phẩm thiếu phôi đúc",
                    action: "Chọn trạng thái 'Chờ đúc riêng', hệ thống sẽ gửi thông báo tự động sang phân hệ Kế hoạch sản xuất."
                  },
                  {
                    stepNum: 3,
                    title: "Chốt giá vàng theo hợp đồng",
                    action: "Nếu khách đặt cọc giữ giá, tải lên biên nhận chuyển khoản và bấm 'Khóa giá vàng tại thời điểm cọc'."
                  }
                ],
                expectedResult: "Hồ sơ ngoại lệ được chuyển thẳng vào hàng đợi duyệt của Giám đốc kinh doanh, không làm tắc nghẽn đơn hàng.",
                importantNotes: [
                  "Mọi ngoại lệ về công nợ bắt buộc có xác nhận bảo lãnh trước 17h cùng ngày.",
                  "Đơn cọc giữ giá có hiệu lực trong vòng 48 giờ."
                ],
                commonErrors: [
                  {
                    error: "Lỗi 'Không thể khóa giá vàng'",
                    cause: "Hệ thống bảng giá đang trong phiên cập nhật giá giờ mở cửa.",
                    solution: "Chờ 2 phút sau phiên cập nhật giá hoặc nhập giá niêm yết theo hợp đồng đã ký."
                  }
                ],
                relatedGuides: []
              }
            ]
          },
          {
            id: "feat_do_mgmt",
            name: "Phiếu giao hàng (DO)",
            guides: [
              {
                id: "guide_do_01",
                title: "Lập Phiếu Giao Hàng (DO) từ Đơn hàng SO",
                status: "active",
                author: "Sevago Jewelry",
                targetAudience: "Điều phối giao hàng, Nhân viên kho thành phẩm",
                applicableScreen: "Quản lý đơn hàng > Phiếu giao hàng DO (/delivery-orders)",
                applicablePath: "/delivery-orders",
                description: "Quy trình lập phiếu giao hàng từng phần hoặc toàn phần dựa trên đơn hàng SO đã được sản xuất xong.",
                prerequisites: [
                  "Đơn hàng SO ở trạng thái 'Đang đóng gói' hoặc 'Chờ giao hàng'.",
                  "Số lượng tồn kho thành phẩm khả dụng >= số lượng lập phiếu DO."
                ],
                steps: [
                  {
                    stepNum: 1,
                    title: "Vào danh sách Phiếu giao hàng (DO)",
                    action: "Truy cập 'Quản lý đơn hàng' > chọn 'Phiếu giao hàng (DO)'."
                  },
                  {
                    stepNum: 2,
                    title: "Tạo phiếu DO mới",
                    action: "Bấm '+ Tạo phiếu DO', chọn mã SO cần giao hàng."
                  },
                  {
                    stepNum: 3,
                    title: "Nhập số lượng giao thực tế",
                    action: "Điền số lượng từng món xuất kho, chọn đơn vị vận chuyển (Nội bộ / Grab / Viettel Post)."
                  },
                  {
                    stepNum: 4,
                    title: "Xác nhận in phiếu",
                    action: "Bấm 'Lưu & In phiếu giao hàng'. Phiếu DO chuyển trạng thái 'Đang giao'."
                  }
                ],
                expectedResult: "Phiếu DO sinh mã dạng DOxxxxxx, trừ số lượng tồn kho khả dụng và cập nhật tiến độ giao trên SO gốc.",
                importantNotes: [
                  "Không cho phép số lượng giao trên các phiếu DO vượt quá số lượng đặt còn lại trên đơn SO.",
                  "Hàng giá trị cao bắt buộc có chữ ký niêm phong túi đựng vàng."
                ],
                commonErrors: [
                  {
                    error: "Báo lỗi 'Tồn kho không đủ để xuất DO'",
                    cause: "Xưởng sản xuất chưa chuyển bàn giao thành phẩm vào kho.",
                    solution: "Kiểm tra tiến độ trên phân hệ 'Kho Thành Phẩm' hoặc liên hệ xưởng hoàn tất phiếu nhập kho."
                  }
                ],
                relatedGuides: [
                  { title: "Điều chỉnh thông tin Phiếu giao hàng DO", linkFeatId: "feat_do_edit", module: "sales" }
                ]
              }
            ]
          },
          {
            id: "feat_so_cancel",
            name: "Yêu cầu hủy SO",
            guides: [
              {
                id: "guide_so_cancel_01",
                title: "Tạo và duyệt yêu cầu hủy đơn hàng SO",
                status: "draft",
                author: "Sevago Jewelry",
                targetAudience: "Nhân viên kinh doanh, Quản lý bán hàng",
                applicableScreen: "Quản lý đơn hàng > Yêu cầu hủy SO",
                applicablePath: "/",
                description: "Quy trình kiểm soát hủy đơn hàng khi khách hàng thay đổi kế hoạch hoặc hủy hợp đồng (Bản thảo đang biên soạn).",
                prerequisites: [
                  "Đơn SO chưa hoàn tất xuất kho 100%.",
                  "Có lý do hủy rõ ràng và biên bản xác nhận với khách hàng."
                ],
                steps: [
                  {
                    stepNum: 1,
                    title: "Chọn đơn cần hủy",
                    action: "Vào chi tiết đơn hàng hoặc danh sách 'Yêu cầu hủy SO'."
                  },
                  {
                    stepNum: 2,
                    title: "Gửi yêu cầu hủy",
                    action: "Chọn lý do hủy (Khách đổi mẫu, Hủy đơn, Sai thông tin) và đính kèm văn bản xác nhận."
                  },
                  {
                    stepNum: 3,
                    title: "Quản lý duyệt hủy",
                    action: "Quản lý kinh doanh rà soát chi phí phôi đúc dở dang trước khi bấm Phê duyệt hủy."
                  }
                ],
                expectedResult: "Trạng thái đơn đổi thành 'Đã hủy', giải phóng lượng tồn cam kết.",
                importantNotes: ["Đơn đã chuyển qua KHSX cần báo trước cho phân xưởng đúc/nguội dừng sản xuất."],
                commonErrors: [],
                relatedGuides: []
              },
              {
                id: "guide_so_inactive_01",
                title: "Quy trình hủy đơn theo chính sách bán sỉ 2024 (Ngưng áp dụng)",
                status: "inactive",
                author: "Ban Pháp Chế",
                targetAudience: "Nhân viên cũ",
                applicableScreen: "Lưu trữ quy trình cũ",
                applicablePath: "/",
                description: "Tài liệu SOP cũ theo quy chế 2024, đã thay thế bằng quy chế mới. Tạm ngưng áp dụng trên toàn hệ thống.",
                prerequisites: ["Tài liệu lưu trữ."],
                steps: [
                  { stepNum: 1, title: "Lưu trữ", action: "Đã hết hiệu lực từ ngày 01/01/2026." }
                ],
                expectedResult: "Lưu trữ hồ sơ.",
                importantNotes: ["Không áp dụng cho các đơn hàng mới phát sinh trong năm 2026."],
                commonErrors: [],
                relatedGuides: []
              }
            ]
          }
        ]
      },
      {
        id: "fg_sales_plan",
        name: "Kế hoạch chào hàng & E-Catalogue",
        features: [
          {
            id: "feat_catalogue_salepitch",
            name: "Trình diễn E-Catalogue chào hàng",
            guides: [
              {
                id: "guide_cat_01",
                title: "Sử dụng E-Catalogue tương tác chào hàng trang sức",
                version: "ERP 3.7",
                updatedAt: "30/08/2026",
                author: "Sevago Jewelry",
                targetAudience: "Sale Showroom, Sale thị trường",
                objective: "Hướng dẫn sử dụng giao diện E-Catalogue trực quan để show mẫu nhẫn, dây chuyền và lên giỏ hàng nhanh cho khách.",
                prerequisites: ["Đã kết nối Internet hoặc nạp trước dữ liệu catalogue offline."],
                steps: [
                  {
                    stepNum: 1,
                    title: "Mở E-Catalogue",
                    action: "Bấm nút 'Mở E-Catalogue Chào Hàng' màu ngọc lục bảo trên Topbar hoặc Sidebar."
                  },
                  {
                    stepNum: 2,
                    title: "Lọc theo bộ sưu tập và tuổi vàng",
                    action: "Dùng bộ lọc tuổi vàng (10K, 14K, 18K, 24K, 61Y, 75W) để hiển thị đúng phân khúc của khách."
                  },
                  {
                    stepNum: 3,
                    title: "Thêm vào giỏ và Kết đơn",
                    action: "Chọn số lượng từng size/ni nhẫn rồi bấm 'Tạo đơn hàng ngay'."
                  }
                ],
                expectedResult: "Giỏ hàng chào mẫu tự động đổ thành một đơn hàng SO mới trong phân hệ Bán hàng.",
                importantNotes: ["Có thể chuyển đổi chế độ ẩn/hiện giá sỉ khi ngồi cùng khách."],
                commonErrors: [],
                relatedGuides: []
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. Module: Khách Hàng
  customers: {
    featureGroups: [
      {
        id: "fg_cust_mgmt",
        name: "Hồ sơ đối tác",
        features: [
          {
            id: "feat_cust_create",
            name: "Tạo mới & Phân nhóm khách hàng",
            guides: [
              {
                id: "guide_cust_01",
                title: "Đăng ký tiệm vàng / Đại lý phân phối mới",
                version: "ERP 3.7",
                updatedAt: "20/08/2026",
                author: "Sevago Jewelry",
                targetAudience: "Nhân viên phát triển thị trường, Kế toán bán hàng",
                objective: "Thiết lập mã khách hàng, thông tin xuất hóa đơn VAT và hạn mức công nợ ban đầu.",
                prerequisites: ["Có Giấy phép ĐKKD hoặc CCCD chủ tiệm vàng."],
                steps: [
                  { stepNum: 1, title: "Truy cập Master Data", action: "Vào Khách Hàng > Danh sách đối tác > Thêm mới." },
                  { stepNum: 2, title: "Nhập thông tin", action: "Điền Tên tiệm, MST, Người đại diện, Số điện thoại và Địa chỉ giao hàng." },
                  { stepNum: 3, title: "Gán hạn mức nợ", action: "Chọn nhóm khách hàng (VIP 1, Tiệm vàng sỉ loại A) và nhập hạn mức công nợ tối đa." }
                ],
                expectedResult: "Hệ thống cấp mã khách (VD: 2000001) sẵn sàng để chọn trên Đơn hàng SO.",
                importantNotes: ["Địa chỉ giao hàng bắt buộc ghi rõ phường/xã để phân vùng giao chành xe hoặc shiper."],
                commonErrors: [],
                relatedGuides: []
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. Module: Kho Nội Bộ
  internal_warehouse: {
    featureGroups: [
      {
        id: "fg_wh_int_stock",
        name: "Quản lý tồn kho nội bộ",
        features: [
          {
            id: "feat_stock_transfer",
            name: "Điều chuyển kho nội bộ",
            guides: [
              {
                id: "guide_wh_01",
                title: "Điều chuyển đá quý & phụ kiện giữa các ngăn tủ kho",
                version: "ERP 3.7",
                updatedAt: "26/08/2026",
                author: "Trần Văn Kho",
                targetAudience: "Thủ kho, Nhân viên phụ kho",
                objective: "Kiểm soát việc di chuyển đá tấm, ngọc trai giữa Kho lưu trữ trung tâm và Kho xưởng gắn đá.",
                prerequisites: ["Phiếu yêu cầu cấp phát vật tư đã được Quản đốc xưởng phê duyệt."],
                steps: [
                  { stepNum: 1, title: "Lập phiếu xuất chuyển", action: "Chọn kho nguồn và kho đích, quét mã vạch túi đá." },
                  { stepNum: 2, title: "Cân trọng lượng đối soát", action: "Cân điện tử 4 số lẻ để xác nhận số Carat hoặc số lượng viên." },
                  { stepNum: 3, title: "Ký nhận 2 đầu", action: "Thủ kho xuất và thủ kho nhận bấm xác nhận mã OTP trên tablet." }
                ],
                expectedResult: "Tồn kho chuyển sang trạng thái 'Đang trên đường chuyển' cho đến khi kho đích xác nhận nhập.",
                importantNotes: ["Mọi sai lệch trọng lượng vượt quá 0.01% sẽ lập tức kích hoạt cảnh báo an ninh."],
                commonErrors: [],
                relatedGuides: []
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. Module: Kế Hoạch Sản Xuất
  production_planning: {
    featureGroups: [
      {
        id: "fg_prod_plan_main",
        name: "Lập lịch sản xuất",
        features: [
          {
            id: "feat_mrp_run",
            name: "Tính toán nhu cầu nguyên liệu (MRP)",
            guides: [
              {
                id: "guide_mrp_01",
                title: "Chạy MRP bóc tách vàng và đá cho đơn hàng SO",
                version: "ERP 3.7",
                updatedAt: "29/08/2026",
                author: "Sevago Jewelry",
                targetAudience: "Kỹ sư kế hoạch sản xuất, Quản đốc",
                objective: "Chuyển các đơn hàng đã chốt thành Lệnh sản xuất (WO) và nhu cầu vàng nguyên liệu (61Y, 75W).",
                prerequisites: ["Đơn SO đã ở trạng thái 'Đã chuyển KHSX'."],
                steps: [
                  { stepNum: 1, title: "Vào Kế hoạch sản xuất", action: "Chọn đợt đơn hàng trong tuần cần đưa vào lò đúc." },
                  { stepNum: 2, title: "Nhấn 'Chạy bóc tách MRP'", action: "Hệ thống tự tính trọng lượng vàng cần xuất kho đúc theo tỷ lệ hao hụt định mức." },
                  { stepNum: 3, title: "Phát hành Lệnh sản xuất (WO)", action: "Gửi lệnh đến các tổ: Tạo mẫu sáp -> Đúc -> Làm nguội -> Gắn đá -> Đánh bóng." }
                ],
                expectedResult: "Tạo ra các mã Lệnh sản xuất tương ứng với từng cây đúc.",
                importantNotes: ["Lưu ý kiểm tra lượng vàng tái thu hồi từ chấu đúc của đợt trước để bù trừ."],
                commonErrors: [],
                relatedGuides: []
              }
            ]
          }
        ]
      }
    ]
  }
};
