"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Database,
  CalendarDays,
  FileText,
  FileBarChart,
  BadgePercent,
  Settings,
  ChevronDown,
  Sparkles,
  BookOpen
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#005a46] text-white flex flex-col h-full overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#004737] flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold tracking-widest text-emerald-100">SEVAGO</h2>
          <p className="text-[10px] tracking-widest text-emerald-300">JEWELRY ERP</p>
        </div>
      </div>

      {/* Special Quick Action for E-Catalogue */}
      <div className="px-3 pt-3">
        <Link
          href="/catalogue"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00594c] hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-xs shadow-lg border border-emerald-400/40 group transition-all"
        >
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-amber-300 animate-spin" />
            <span>E-Catalogue Chào Hàng</span>
          </div>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
            Sale
          </span>
        </Link>
      </div>

      {/* Cấu trúc Sidebar */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        <Link
          href="/"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] ${pathname === "/" ? "text-white bg-[#004737]" : "text-gray-200"}`}
        >
          <Home className="mr-3 h-5 w-5 text-emerald-300" />
          Trang chủ
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <Database className="mr-3 h-5 w-5 text-emerald-300" />
            Master Data
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <CalendarDays className="mr-3 h-5 w-5 text-emerald-300" />
            Kế hoạch chào hàng
          </div>
        </Link>

        {/* Nhóm Quản lý đơn hàng */}
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md bg-[#004737] text-white">
            <div className="flex items-center">
              <FileText className="mr-3 h-5 w-5 text-emerald-300" />
              Quản lý đơn hàng
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="pl-11 space-y-1">
            <Link
              href="/"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                pathname === "/" || pathname.startsWith("/orders")
                  ? "bg-white/20 text-white font-semibold"
                  : "hover:bg-[#004737] text-gray-300"
              }`}
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
            <Link
              href="/cancel-requests"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                pathname.startsWith("/cancel-requests")
                  ? "bg-white/20 text-white font-semibold"
                  : "hover:bg-[#004737] text-gray-300"
              }`}
            >
              Yêu cầu hủy SO
            </Link>
            <Link
              href="/delivery-orders"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                pathname.startsWith("/delivery-orders")
                  ? "bg-white/20 text-white font-semibold"
                  : "hover:bg-[#004737] text-gray-300"
              }`}
            >
              Phiếu giao hàng (DO)
            </Link>
          </div>
        </div>

        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <FileBarChart className="mr-3 h-5 w-5 text-emerald-300" />
            Chứng từ
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <BadgePercent className="mr-3 h-5 w-5 text-emerald-300" />
            Chiết khấu
          </div>
          <ChevronDown className="h-4 w-4" />
        </Link>
        <Link
          href="#"
          className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-[#004737] text-gray-200"
        >
          <div className="flex items-center">
            <Settings className="mr-3 h-5 w-5 text-emerald-300" />
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
