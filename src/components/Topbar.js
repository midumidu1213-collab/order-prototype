"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Sparkles } from "lucide-react";

export default function Topbar() {
  const pathname = usePathname();
  const isUserGuide = pathname?.startsWith("/user-guide");

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 relative z-10 shrink-0">
      <div className="flex items-center space-x-3">
        {/* Nút Mở E-Catalogue: Chỉ hiển thị ở Bán Hàng, BỎ ở Hướng Dẫn Sử Dụng theo yêu cầu */}
        {!isUserGuide && (
          <Link
            href="/catalogue"
            className="flex items-center space-x-1.5 bg-[#00594c] hover:bg-[#004737] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Mở E-Catalogue Chào Hàng</span>
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500 relative cursor-pointer">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
        </button>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#005a46] flex items-center justify-center text-white font-bold text-sm">
            SJ
          </div>
          <div className="ml-2 flex flex-col justify-center">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              Sevago Jewelry
            </span>
            <span className="text-xs text-blue-600 leading-tight">
              Quản lý
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
