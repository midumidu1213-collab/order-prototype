"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, QrCode } from "lucide-react";

export default function CatalogueFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-[#01352a] via-[#004737] to-[#012820] text-emerald-100 overflow-hidden border-t border-emerald-600/30">
      {/* Radiant Diamond Halo Background Effect matching screenshot */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-300/10 via-transparent to-transparent" />
      </div>

      {/* Radiant sparkling diamond center graphic */}
      <div className="relative pt-8 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.3)] animate-pulse">
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-emerald-200">
                <polygon points="50,15 85,45 50,85 15,45" fill="none" stroke="currentColor" strokeWidth="3" />
                <polygon points="50,25 75,45 50,75 25,45" fill="none" stroke="#6ee7b7" strokeWidth="2" />
                <line x1="15" y1="45" x2="85" y2="45" stroke="#a7f3d0" strokeWidth="2" />
                <line x1="50" y1="15" x2="50" y2="85" stroke="#a7f3d0" strokeWidth="1.5" />
              </svg>
            </div>
            {/* Horizontal glowing ring curve */}
            <div className="absolute -left-32 -right-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent top-1/2" />
          </div>
        </div>

        {/* 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-t border-emerald-700/40 text-sm">
          {/* Col 1: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base tracking-wide border-b border-emerald-600/30 pb-2 inline-block">
              Thông tin liên hệ
            </h4>
            <div className="space-y-2 text-emerald-200/90 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hotline: 1900 8888 (Hỗ trợ 24/7)</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Số 200, Đ.Nguyễn Văn Bá, P.Trường Thọ, Tp.Thủ Đức, Tp.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Email: sipcorp@sip.com.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: About / Quick Links */}
          <div className="space-y-3 md:text-center">
            <h4 className="text-white font-semibold text-base tracking-wide border-b border-emerald-600/30 pb-2 inline-block">
              Về Sen Vàng
            </h4>
            <ul className="space-y-2 text-emerald-200/90 text-xs sm:text-sm">
              <li>
                <Link href="/catalogue" className="hover:text-white hover:underline transition-colors">
                  Trang chủ E-Catalogue
                </Link>
              </li>
              <li>
                <Link href="/catalogue/cart" className="hover:text-white hover:underline transition-colors">
                  Danh sách giỏ chào hàng
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white hover:underline transition-colors">
                  Về chúng tôi & Cam kết chất lượng
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: QR Code Box */}
          <div className="flex flex-col items-start md:items-end justify-center space-y-2">
            <div className="text-white font-semibold text-sm">Quét QR Code</div>
            <div className="p-2.5 bg-white rounded-xl shadow-lg border border-emerald-400/30 flex items-center justify-center">
              {/* QR Code Graphic matching screenshot */}
              <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#00594c]">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="4"/>
                <rect x="5" y="5" width="20" height="20" fill="white" rx="2"/>
                <rect x="9" y="9" width="12" height="12" fill="currentColor" rx="1"/>

                <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="4"/>
                <rect x="75" y="5" width="20" height="20" fill="white" rx="2"/>
                <rect x="79" y="9" width="12" height="12" fill="currentColor" rx="1"/>

                <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="4"/>
                <rect x="5" y="75" width="20" height="20" fill="white" rx="2"/>
                <rect x="9" y="79" width="12" height="12" fill="currentColor" rx="1"/>

                {/* Pattern dots */}
                <rect x="36" y="8" width="8" height="8" fill="currentColor"/>
                <rect x="50" y="14" width="8" height="8" fill="currentColor"/>
                <rect x="38" y="38" width="10" height="10" fill="currentColor" rx="2"/>
                <rect x="56" y="42" width="12" height="12" fill="currentColor"/>
                <rect x="42" y="60" width="8" height="8" fill="currentColor"/>
                <rect x="70" y="70" width="10" height="10" fill="currentColor"/>
                <rect x="85" y="85" width="12" height="12" fill="currentColor"/>
                <rect x="70" y="45" width="8" height="8" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-[11px] text-emerald-300">Quét để xem trên iPad/Điện thoại</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 pb-2 border-t border-emerald-800/40 text-center text-xs text-emerald-400 font-light">
          @Bản quyền thuộc công ty SEVAGO.JEWELRY
        </div>
      </div>
    </footer>
  );
}
