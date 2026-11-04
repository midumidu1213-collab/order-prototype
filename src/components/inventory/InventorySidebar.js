"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Warehouse,
  Boxes,
  RotateCcw,
  Zap,
  Truck,
  Settings,
  FileText,
  ClipboardCheck,
  Package,
  Layers,
  ArrowRightLeft,
  ChevronDown,
  BarChart3,
  Download,
  GitCommit
} from "lucide-react";
import SubsystemSwitcher from "@/components/SubsystemSwitcher";

export default function InventorySidebar() {
  const pathname = usePathname();

  const isReprocessList = pathname === "/inventory/reprocess";
  const isFgServe = pathname === "/inventory/reprocess/serve";
  const isCommercialInventory = pathname === "/inventory";

  return (
    <aside className="w-64 bg-[#064e3b] text-white flex flex-col h-full overflow-y-auto shrink-0 select-none border-r border-[#043d2e] shadow-xl text-xs">
      {/* 1. Header Phân Hệ với SubsystemSwitcher */}
      <SubsystemSwitcher />

      {/* 2. Menu Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-3">
        {/* Báo cáo vận hành */}
        <div className="space-y-0.5">
          <Link
            href="/inventory"
            className="flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#043d2e] transition-colors"
          >
            <BarChart3 className="mr-2.5 h-4 w-4 text-emerald-300" />
            <span>Báo cáo vận hành</span>
          </Link>
          <Link
            href="/inventory"
            className="flex items-center px-3 py-2 rounded-lg font-medium text-emerald-100 hover:bg-[#043d2e] transition-colors"
          >
            <Download className="mr-2.5 h-4 w-4 text-emerald-300" />
            <span>Tiếp nhận Bag</span>
          </Link>
        </div>

        {/* Section: Packing */}
        <div>
          <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 flex items-center justify-between">
            <span>PACKING & KIỂM TRA</span>
            <ChevronDown className="h-3 w-3 text-emerald-400/60" />
          </div>
          <div className="space-y-0.5 pl-1">
            <Link
              href="/inventory"
              className="flex items-center px-2.5 py-1.5 rounded-lg text-emerald-100 hover:bg-[#043d2e] transition-colors font-medium"
            >
              <Package className="mr-2 h-3.5 w-3.5 text-emerald-300" />
              <span>Packing IN / OUT</span>
            </Link>
            <Link
              href="/inventory"
              className="flex items-center px-2.5 py-1.5 rounded-lg text-emerald-100 hover:bg-[#043d2e] transition-colors font-medium"
            >
              <ClipboardCheck className="mr-2 h-3.5 w-3.5 text-emerald-300" />
              <span>Kiểm tra thành phẩm</span>
            </Link>
          </div>
        </div>

        {/* Section: Kho Thành Phẩm (FG) */}
        <div>
          <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 flex items-center justify-between">
            <span>KHO THÀNH PHẨM (FG)</span>
            <ChevronDown className="h-3 w-3 text-emerald-400/60" />
          </div>
          <div className="space-y-0.5 pl-1">
            <Link
              href="/inventory"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                isCommercialInventory
                  ? "bg-[#043d2e] text-white font-bold border border-emerald-400/30 shadow-xs"
                  : "text-emerald-100 hover:bg-[#043d2e]"
              }`}
            >
              <div className="flex items-center">
                <Boxes className="mr-2 h-3.5 w-3.5 text-emerald-300" />
                <span>Danh sách tồn kho</span>
              </div>
              <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded font-mono">
                US-08.1
              </span>
            </Link>

            <Link
              href="/inventory/cancel-requests"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                pathname === "/inventory/cancel-requests"
                  ? "bg-[#043d2e] text-white font-bold border border-amber-400/40 shadow-xs"
                  : "text-emerald-100 hover:bg-[#043d2e]"
              }`}
            >
              <div className="flex items-center">
                <RotateCcw className="mr-2 h-3.5 w-3.5 text-amber-300" />
                <span>Tiếp nhận YC Hủy SO</span>
              </div>
              <span className="text-[9px] bg-amber-500/25 text-amber-200 border border-amber-400/40 px-1.5 py-0.2 rounded font-bold font-mono">
                2 YC
              </span>
            </Link>
          </div>
        </div>

        {/* Section: Chờ Xử Lý Lại (MỤC LỚN CHUẨN HÓA GIỐNG KHO THÀNH PHẨM THEO CHỈ ĐẠO CHỊ ĐẸP) */}
        <div>
          <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80 flex items-center justify-between">
            <span>CHỜ XỬ LÝ LẠI (CXLL)</span>
            <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-bold font-mono">
              40
            </span>
          </div>

          <div className="space-y-0.5 pl-1">
            <Link
              href="/inventory/reprocess"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                isReprocessList
                  ? "bg-[#043d2e] text-white font-bold border border-emerald-400/30 shadow-xs"
                  : "text-emerald-100 hover:bg-[#043d2e]"
              }`}
            >
              <div className="flex items-center">
                <RotateCcw className="mr-2 h-3.5 w-3.5 text-emerald-300" />
                <span>DS chờ xử lý lại</span>
              </div>
              <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1 py-0.2 rounded font-mono">
                US-08
              </span>
            </Link>

            <Link
              href="/inventory/reprocess/serve"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                isFgServe
                  ? "bg-[#043d2e] text-amber-300 font-bold border border-amber-400/50 shadow-xs"
                  : "text-emerald-100 hover:bg-[#043d2e]"
              }`}
            >
              <div className="flex items-center">
                <Zap className="mr-2 h-3.5 w-3.5 text-amber-400" />
                <span>Cấp TP (Serve FG)</span>
              </div>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-md">
                1-1
              </span>
            </Link>
          </div>
        </div>

        {/* Section: Theo dõi vận chuyển & Cấu hình */}
        <div className="pt-2 border-t border-emerald-800/40 space-y-0.5">
          <Link
            href="/inventory"
            className="flex items-center px-3 py-1.5 rounded-lg text-emerald-200/80 hover:bg-[#043d2e] transition-colors"
          >
            <Truck className="mr-2.5 h-4 w-4 text-emerald-400/70" />
            <span>Theo dõi vận chuyển</span>
          </Link>
          <Link
            href="/inventory"
            className="flex items-center px-3 py-1.5 rounded-lg text-emerald-200/80 hover:bg-[#043d2e] transition-colors"
          >
            <Settings className="mr-2.5 h-4 w-4 text-emerald-400/70" />
            <span>Cấu hình kho</span>
          </Link>
        </div>
      </nav>

      {/* 3. Footer */}
      <div className="p-3 border-t border-[#043d2e] bg-[#043d2e]/40 flex items-center justify-between text-emerald-300/80">
        <span className="text-[11px] font-medium">Kho FG Sevago</span>
        <span className="text-[10px] bg-emerald-900 px-1.5 py-0.5 rounded font-mono text-emerald-200">v2.4</span>
      </div>
    </aside>
  );
}
