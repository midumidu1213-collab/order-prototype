"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, BookOpen, ChevronDown, Check, LayoutGrid } from "lucide-react";

export default function SubsystemSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isUserGuide = pathname?.startsWith("/user-guide");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 px-3 border-b border-[#004737] flex items-center relative shrink-0" ref={dropdownRef}>
      {/* Nút bấm Dropdown phong cách thẻ Card màu trắng nổi bật trên nền xanh */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white text-gray-900 rounded-xl p-2.5 flex items-center justify-between shadow-md hover:bg-gray-50 transition-all border border-emerald-100 cursor-pointer group"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="text-gray-400 group-hover:text-emerald-800 transition-colors">
            <LayoutGrid className="h-4 w-4" />
          </div>
          {isUserGuide ? (
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="h-4 w-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShoppingCart className="h-4 w-4" />
            </div>
          )}
          <div className="text-left min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block leading-none">
              Phân Hệ ERP
            </span>
            <span className="text-sm font-bold text-gray-900 block truncate leading-tight mt-0.5">
              {isUserGuide ? "Hướng Dẫn Sử Dụng" : "Bán Hàng"}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180 text-emerald-700" : ""
          }`}
        />
      </button>

      {/* Menu Popup */}
      {open && (
        <div className="absolute top-full left-3 right-3 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            Chuyển đổi phân hệ
          </div>

          <div className="py-1 space-y-1">
            {/* 1. Bán Hàng */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors text-xs ${
                !isUserGuide
                  ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200"
                  : "hover:bg-gray-50 text-gray-700 font-medium"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-3.5 w-3.5" />
                </div>
                <span>Bán Hàng</span>
              </div>
              {!isUserGuide && <Check className="h-3.5 w-3.5 text-emerald-700" />}
            </Link>

            {/* 2. Hướng Dẫn Sử Dụng */}
            <Link
              href="/user-guide"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors text-xs ${
                isUserGuide
                  ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200"
                  : "hover:bg-gray-50 text-gray-700 font-medium"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <span>Hướng Dẫn Sử Dụng</span>
              </div>
              {isUserGuide && <Check className="h-3.5 w-3.5 text-emerald-700" />}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
