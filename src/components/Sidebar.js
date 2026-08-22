import Link from "next/link";
import {
  Home,
  Database,
  CalendarDays,
  FileText,
  FileBarChart,
  BadgePercent,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#005a46] text-white flex flex-col h-full overflow-y-auto">
      {/* Cấu trúc Sidebar tương tự giao diện */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <Home className="mr-3 h-5 w-5" />
          Trang chủ
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <Database className="mr-3 h-5 w-5" />
            Master Data
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <CalendarDays className="mr-3 h-5 w-5" />
            Kế hoạch chào hàng
          </div>
        </Link>

        {/* Nhóm Quản lý đơn hàng (Mở rộng) */}
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md bg-[#004737] text-white">
            <div className="flex items-center">
              <FileText className="mr-3 h-5 w-5" />
              Quản lý đơn hàng
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="pl-11 space-y-1">
            <Link
              href="/"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white/20 text-white"
            >
              Thông tin đơn hàng
            </Link>
            <Link
              href="#"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-300"
            >
              DS Yêu cầu thay đổi
            </Link>
            <Link
              href="#"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-300"
            >
              Đơn hàng đào tạo
            </Link>
          </div>
        </div>

        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <FileBarChart className="mr-3 h-5 w-5" />
            Chứng từ
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <BadgePercent className="mr-3 h-5 w-5" />
            Chiết khấu
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <Settings className="mr-3 h-5 w-5" />
            Cấu hình
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
      </nav>

      <div className="p-4 border-t border-[#004737]">
        <button className="flex items-center text-sm font-medium text-gray-300 hover:text-white">
          <Settings className="mr-3 h-5 w-5" />
          Ẩn điều hướng
        </button>
      </div>
    </aside>
  );
}
