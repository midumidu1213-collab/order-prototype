"use client";

import Link from "next/link";
import { Bell, ShoppingCart, Sparkles } from "lucide-react";

export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white mr-2">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Bán Hàng</h1>
        </div>

        {/* Quick Link to E-Catalogue */}
        <Link
          href="/catalogue"
          className="hidden sm:flex items-center space-x-1.5 bg-[#00594c] hover:bg-[#004737] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Mở E-Catalogue Chào Hàng</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500 relative">
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
