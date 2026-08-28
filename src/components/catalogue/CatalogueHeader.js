"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ArrowLeft, Gem, Home, LayoutGrid, FileText, ExternalLink } from "lucide-react";
import { useCatalogueCart } from "@/context/CatalogueCartContext";

export default function CatalogueHeader() {
  const pathname = usePathname();
  const { totalQuantity } = useCatalogueCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-gradient-to-r from-[#01352a] via-[#00594c] to-[#014134] text-white border-b border-[#03725f]/40">
      {/* Subtle diamond pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#52e5c8 1px, transparent 1px), radial-gradient(#52e5c8 1px, #01352a 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/catalogue" className="flex flex-col group">
            <span className="font-serif text-2xl tracking-[0.25em] font-bold text-white group-hover:text-emerald-200 transition-colors uppercase">
              SEVAGO
            </span>
            <span className="text-[9px] tracking-[0.45em] text-emerald-300 font-light -mt-1 uppercase">
              JEWELRY
            </span>
          </Link>
        </div>

        {/* Quick Nav / Badges */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Cart Bag Icon with Live Count */}
          <Link
            href="/catalogue/cart"
            className="relative p-2 rounded-full hover:bg-white/10 transition-all text-white hover:text-emerald-200 flex items-center justify-center"
            title="Giỏ hàng chào hàng"
          >
            <ShoppingBag className="h-6 w-6 stroke-[1.8]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-emerald-400 text-slate-950 text-xs font-black rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse border-2 border-[#00594c]">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Hamburger Menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white focus:outline-none"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Slide-out Menu Modal / Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-80 max-w-full bg-[#004737] text-white h-full p-6 shadow-2xl flex flex-col justify-between border-l border-emerald-500/20">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-600/40">
                <div>
                  <div className="font-serif text-xl tracking-[0.2em] font-bold">SEVAGO</div>
                  <div className="text-[10px] tracking-[0.3em] text-emerald-300">E-CATALOGUE CHÀO HÀNG</div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-gray-300 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                <Link
                  href="/catalogue"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/catalogue"
                      ? "bg-emerald-600/40 text-white font-semibold border border-emerald-400/30"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  <LayoutGrid className="h-5 w-5 mr-3 text-emerald-300" />
                  Danh mục sản phẩm
                </Link>

                <Link
                  href="/catalogue/cart"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === "/catalogue/cart"
                      ? "bg-emerald-600/40 text-white font-semibold border border-emerald-400/30"
                      : "text-emerald-100 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-3 text-emerald-300" />
                    Giỏ hàng chào hàng
                  </div>
                  <span className="bg-emerald-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                    {totalQuantity}
                  </span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-emerald-200 hover:bg-white/10 transition-all mt-4 border-t border-emerald-700/50 pt-5"
                >
                  <ExternalLink className="h-5 w-5 mr-3 text-emerald-400" />
                  Quay lại Quản lý Đơn hàng (ERP)
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-emerald-600/40 text-xs text-emerald-300 text-center">
              <div>Phiên bản Sale Mobile & Tablet v2.6</div>
              <div className="mt-1 text-emerald-400/70 font-light">SEVAGO JEWELRY CORP</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
