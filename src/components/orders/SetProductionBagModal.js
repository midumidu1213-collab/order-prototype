"use client";

import React from "react";
import { 
  X, 
  Crown, 
  Layers, 
  PackageCheck, 
  Boxes, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Printer
} from "lucide-react";

export default function SetProductionBagModal({ isOpen, onClose, setItem }) {
  if (!isOpen || !setItem) return null;

  const components = setItem.components || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-900 via-[#005a46] to-emerald-800 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  THẺ BAG KHSX & ĐÓNG GÓI BỘ
                </span>
                <span className="font-mono text-xs font-bold text-emerald-200">
                  {setItem.bagCode || "BAG-SET-2608012-01"}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5 tracking-tight">
                {setItem.setName || setItem.itemCode}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NỘI DUNG CHÍNH (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* BANNER 2 RULE CỐT LÕI (FIRST PRINCIPLES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* RULE 1: KHSX */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-2">
              <div className="flex items-center space-x-2 text-[#005a46] font-bold">
                <Tag className="h-4 w-4 shrink-0 text-emerald-700" />
                <span className="uppercase tracking-wider text-[11px]">1. Quy Tắc KHSX (1 Bag = 1 Bộ)</span>
              </div>
              <p className="text-slate-800 font-semibold leading-relaxed">
                Tất cả <strong>{components.length} món thành phần</strong> được gom chung vào <strong>1 Bag Lệnh Sản Xuất duy nhất</strong>.
              </p>
              <div className="text-[11px] text-slate-500 bg-white/80 p-2 rounded-xl border border-emerald-100">
                💎 Đi liền nhau qua các xưởng để bảo đảm 100% đồng nhất về tuổi vàng ({setItem.goldAge || "75Y"}), màu xi và tiến độ.
              </div>
            </div>

            {/* RULE 2: ĐÓNG GÓI */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <PackageCheck className="h-4 w-4 shrink-0 text-amber-700" />
                <span className="uppercase tracking-wider text-[11px]">2. Quy Tắc Đóng Gói (Đóng Chung Bộ)</span>
              </div>
              <p className="text-slate-800 font-semibold leading-relaxed">
                Tới khâu hoàn thiện đóng gói: <strong>Đóng chung vào 1 Hộp Bộ VIP (Hộp Cưới)</strong>.
              </p>
              <div className="text-[11px] text-slate-500 bg-white/80 p-2 rounded-xl border border-amber-100">
                📦 Chỉ bàn giao xuất kho khi đã tập kết đủ 100% {components.length}/{components.length} món trong Bag. Không đóng lẻ, không giao lẻ.
              </div>
            </div>
          </div>

          {/* BẢNG KÊ 4 MÓN TRONG BAG KHSX NÀY */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                <Boxes className="h-4 w-4 text-[#005a46]" />
                <span>Danh Sách {components.length} Món Đi Chung Bag ({setItem.qty || 1} Bộ = {setItem.qty || 1} Bag)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                Mã Bag: {setItem.bagCode}
              </span>
            </div>

            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-white font-bold text-slate-600 text-[10.5px] uppercase">
                <tr>
                  <th className="px-3 py-2.5 text-center w-10">STT</th>
                  <th className="px-3 py-2.5">Món thành phần</th>
                  <th className="px-3 py-2.5">Mã Drawing</th>
                  <th className="px-3 py-2.5">Mã Item (30 ký tự)</th>
                  <th className="px-3 py-2.5 text-center">Ni/Size</th>
                  <th className="px-3 py-2.5 text-center font-bold">SL/Bag</th>
                  <th className="px-3 py-2.5 text-right">Trọng lượng</th>
                  <th className="px-3 py-2.5 text-center">Quy cách</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {components.map((comp, idx) => (
                  <tr key={comp.stt || idx} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-3 py-2.5 text-center font-bold text-slate-400">{comp.stt}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900">{comp.name}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-700 font-semibold">{comp.drawingCode}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600 truncate max-w-[180px]" title={comp.itemCode}>
                      {comp.itemCode}
                    </td>
                    <td className="px-3 py-2.5 text-center font-bold text-[#005a46]">{comp.size}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-900">1 chiếc</td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-800">{comp.weight}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                        Đóng chung hộp
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LỘ TRÌNH 5 CÔNG ĐOẠN ĐỒNG BỘ CỦA BAG BỘ */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Lộ Trình Gia Công Đồng Bộ Qua Các Xưởng (Cả 4 món đi liền nhau):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">CÔNG ĐOẠN 1</span>
                <span className="text-xs font-bold text-slate-800 block">Đúc Mẻ Chung</span>
                <span className="text-[10px] text-emerald-700 font-medium block">Cùng mẻ vàng {setItem.goldAge || "75Y"}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">CÔNG ĐOẠN 2</span>
                <span className="text-xs font-bold text-slate-800 block">Làm Nguội</span>
                <span className="text-[10px] text-slate-500 font-medium block">Đồng bộ form dáng</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">CÔNG ĐOẠN 3</span>
                <span className="text-xs font-bold text-slate-800 block">Vào Đá Tấm</span>
                <span className="text-[10px] text-slate-500 font-medium block">Đá chính & phụ</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">CÔNG ĐOẠN 4</span>
                <span className="text-xs font-bold text-slate-800 block">Xi Mạ Đồng Màu</span>
                <span className="text-[10px] text-emerald-700 font-medium block">Xi chung mẻ {setItem.platingColor || "Y0"}</span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                <span className="text-[10px] text-amber-600 font-bold block">CÔNG ĐOẠN 5</span>
                <span className="text-xs font-bold text-amber-950 block">KCS & Đóng Hộp</span>
                <span className="text-[10px] text-amber-800 font-bold block">1 Hộp VIP / 4 Món</span>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Tổng số lượng: <strong className="text-slate-800">{setItem.qty || 1} Bộ</strong> &bull; Tổng Bag KHSX: <strong className="text-[#005a46] font-mono">{setItem.qty || 1} BAG</strong>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer text-xs"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => alert(`Đã in Thẻ Bag KHSX ${setItem.bagCode} kèm lệnh đóng gói chung bộ.`)}
              className="px-4 py-2 bg-[#005a46] hover:bg-[#004737] text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer text-xs"
            >
              <Printer className="h-4 w-4" />
              <span>In Thẻ Bag & Lệnh Đóng Gói</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
