"use client";

import React from "react";
import Link from "next/link";

export default function SevagoLogo({ className = "", light = false }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Biểu tượng hoa sen vàng/xanh cách điệu Sevago */}
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${light ? "text-emerald-300" : "text-[#00594c]"}`}>
          {/* Cánh sen trung tâm */}
          <path
            d="M50 15 C50 15 35 45 50 78 C65 45 50 15 50 15 Z"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Cánh sen trái */}
          <path
            d="M50 35 C38 35 20 52 28 72 C36 78 46 76 50 78 C42 65 42 48 50 35 Z"
            fill="currentColor"
            opacity="0.8"
          />
          {/* Cánh sen phải */}
          <path
            d="M50 35 C62 35 80 52 72 72 C64 78 54 76 50 78 C58 65 58 48 50 35 Z"
            fill="currentColor"
            opacity="0.8"
          />
          {/* Cánh sen ngoài cùng trái */}
          <path
            d="M40 55 C25 56 12 68 18 82 C28 85 36 82 42 80 C32 74 34 63 40 55 Z"
            fill="currentColor"
            opacity="0.65"
          />
          {/* Cánh sen ngoài cùng phải */}
          <path
            d="M60 55 C75 56 88 68 82 82 C72 85 64 82 58 80 C68 74 66 63 60 55 Z"
            fill="currentColor"
            opacity="0.65"
          />
          {/* Đáy đài sen nâng đỡ */}
          <path
            d="M32 84 C44 90 56 90 68 84 C58 87 42 87 32 84 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Typography thương hiệu SEVAGO JEWELRY */}
      <div className="flex flex-col">
        <span
          className={`font-serif text-xl sm:text-2xl tracking-[0.22em] font-extrabold uppercase leading-tight ${
            light ? "text-white" : "text-[#004737]"
          }`}
        >
          SEVAGO
        </span>
        <span
          className={`text-[8.5px] sm:text-[9.5px] tracking-[0.42em] uppercase -mt-0.5 font-medium ${
            light ? "text-emerald-200" : "text-[#00705f]"
          }`}
        >
          JEWELRY
        </span>
      </div>
    </div>
  );
}
