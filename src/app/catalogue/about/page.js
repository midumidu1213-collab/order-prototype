"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Award,
  Factory,
  Sparkles,
  ShieldCheck,
  Truck,
  Lock,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Gem,
  Layers,
  Cpu,
  ChevronRight,
  TrendingUp,
  FileCheck
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. HERO BANNER & BREADCRUMB */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#012820] via-[#004737] to-[#011e18] pt-8 pb-16 border-b border-emerald-600/30">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-400/25 rounded-full blur-3xl" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#52e5c8 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-emerald-300/80 mb-6">
            <Link href="/catalogue" className="hover:text-white transition-colors">
              E-Catalogue
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-emerald-100 font-medium">Về chúng tôi</span>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <Gem className="h-3.5 w-3.5 text-emerald-400" />
              <span>Thương hiệu Kim hoàn Cao cấp</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              GIỚI THIỆU VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-300">SEVAGO JEWELRY</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              Định hướng dẫn đầu xu hướng trang sức ứng dụng cao cho thị trường Việt Nam và vươn tầm khu vực với năng lực sản xuất vượt trội và công nghệ chế tác kim hoàn tối tân.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GIỚI THIỆU TỔNG QUAN & STATS COUNTERS */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Story & History */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Building2 className="h-4 w-4" />
              <span>Lịch sử & Vị thế</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Công ty TNHH MTV Sen Vàng Việt Nam (SEVAGO)
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                <strong className="text-white font-semibold">SEVAGO</strong> tiền thân là{" "}
                <strong className="text-emerald-300 font-semibold">Công ty Cổ phần Kim hoàn Quý Sài Gòn Quốc Tế (SJC Corp)</strong>, 
                được chính thức thành lập vào ngày <span className="text-amber-300 font-semibold">25/12/2009</span>. 
                Chúng tôi hoạt động chuyên sâu và toàn diện trong lĩnh vực Kinh doanh Vàng Bạc Đá Quý.
              </p>
              <p>
                Với bề dày hơn một thập kỷ phát triển, SEVAGO định hướng tập trung mũi nhọn vào mảng 
                <strong className="text-white"> thiết kế & chế tác kim hoàn cao cấp</strong>, tiên phong dẫn dắt thị trường trang sức ứng dụng với sự kết hợp hài hòa giữa tính nghệ thuật tinh xảo và dây chuyền sản xuất công nghiệp chuẩn xác.
              </p>
            </div>

            {/* Core Values Tag List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Chuẩn tuổi vàng 100%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Công nghệ XRF tối tân</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Gia công chuẩn xác</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Video/Showcase representation */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#004737] via-[#01352a] to-slate-900 p-1 border border-emerald-500/30 shadow-2xl group">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                {/* Decorative glowing orb */}
                <div className="absolute w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl -top-10 -right-10 pointer-events-none" />
                
                {/* Visual Graphic Representation of Workshop */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Factory className="h-10 w-10 text-slate-950 stroke-[1.8]" />
                </div>

                <h3 className="font-serif font-bold text-xl text-white mb-2">
                  Tổ hợp Chế tác Kim hoàn SEVAGO
                </h3>
                <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed max-w-xs">
                  Dây chuyền sản xuất tự động kết hợp cùng bàn tay tài hoa của nghệ nhân kim hoàn bậc thầy.
                </p>

                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/30 text-[11px] text-emerald-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Quy mô 10.000m² - Hoạt động liên tục</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Key Metric Stats Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-[#01241d] p-6 border border-emerald-500/20 shadow-lg hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                Nhân lực
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">
              500+
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-1">Cán bộ nhân viên</div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Đội ngũ nhân sự chuyên môn cao, được đào tạo chuẩn quốc tế và đáp ứng các tiêu chuẩn dịch vụ khắt khe.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-[#01241d] p-6 border border-emerald-500/20 shadow-lg hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                Nghệ nhân
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">
              1.000+
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-1">Thợ kim hoàn lành nghề</div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Nghệ nhân kim hoàn tay nghề xuất chúng, được đào tạo chuyên sâu và bài bản trong kỹ thuật tạo tác tinh xảo.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-[#01241d] p-6 border border-emerald-500/20 shadow-lg hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                Quy mô
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">
              10.000 m²
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-1">Diện tích nhà xưởng chế tác</div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Hệ thống cơ sở vật chất, phân xưởng chế tác đồng bộ và kỹ thuật hạ tầng đạt tiêu chuẩn công nghiệp hiện đại.
            </p>
          </div>
        </div>
      </section>

      {/* 3. NĂNG LỰC SẢN XUẤT & CHẾ TÁC (4 TRỤ CỘT CỐT LÕI) */}
      <section className="py-14 bg-gradient-to-b from-slate-950 via-[#00261e] to-slate-950 border-y border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Cpu className="h-4 w-4" />
              <span>Năng lực cốt lõi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              NĂNG LỰC SẢN XUẤT & CHẾ TÁC CỦA SEVAGO
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Hệ thống tiêu chuẩn hoạt động khắt khe đảm bảo chất lượng hoàn hảo trên từng chi tiết sản phẩm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Pillar 1: Gia công - Chế tác */}
            <div className="group rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 sm:p-7 hover:border-emerald-400/40 transition-all relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Factory className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    01
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                  1. Năng lực Gia công - Chế tác
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-emerald-300 font-semibold">SEVAGO</strong> sở hữu năng lực đáp ứng mọi yêu cầu gia công sản phẩm trang sức vàng với <span className="text-white font-medium">số lượng lớn</span> và <span className="text-white font-medium">độ chính xác hoàn hảo</span> theo bản vẽ thiết kế.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Đáp ứng đơn hàng dự án & chuỗi phân phối quy mô lớn</span>
              </div>
            </div>

            {/* Pillar 2: Sản xuất nhanh */}
            <div className="group rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 sm:p-7 hover:border-emerald-400/40 transition-all relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                    02
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                  2. Năng lực Sản xuất Nhanh - Chất lượng cao
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Khả năng sản xuất tối ưu tiến độ: Áp dụng quy trình chuẩn hoá từng công đoạn, rút ngắn tối đa thời gian sản xuất mà vẫn duy trì chất lượng kiểm soát nghiêm ngặt.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 text-xs text-amber-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Quy trình chuẩn hóa Lean Manufacturing trong kim hoàn</span>
              </div>
            </div>

            {/* Pillar 3: R&D Phát triển mẫu */}
            <div className="group rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 sm:p-7 hover:border-emerald-400/40 transition-all relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Layers className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    03
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                  3. Năng lực Phát triển Mẫu (R&D)
                </h3>
                <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                  <div className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>
                      Kho mẫu phong phú với hơn <strong className="text-white">20.000 mẫu vẽ tay</strong> và nhận dựng vẽ 3D chuyên biệt theo yêu cầu riêng của đối tác.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>
                      Quy trình phát triển mẫu tiêu chuẩn, liên tục cập nhật xu hướng thị trường trong nước và quốc tế để tạo ra những bộ sưu tập dẫn đầu xu hướng trang sức.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Đội ngũ thiết kế 3D CAD/CAM chuyên nghiệp</span>
              </div>
            </div>

            {/* Pillar 4: Trung tâm Kiểm định */}
            <div className="group rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 sm:p-7 hover:border-emerald-400/40 transition-all relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    04
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                  4. Trung tâm Kiểm định Chất lượng
                </h3>
                <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">SEVAGO</strong> áp dụng phương pháp kiểm tra định lượng và định tính chuẩn xác từ nguyên liệu đầu vào đến sản phẩm hoàn thiện đầu ra.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                    <div className="text-cyan-300 font-semibold">Trang thiết bị đo lường chuẩn hóa:</div>
                    <p className="text-slate-300">
                      Hệ thống <strong>Máy quang phổ (Spectrometer)</strong> &amp; <strong>máy đo tuổi vàng tự động (XRF)</strong> với độ chính xác cao, cung cấp bảng phân tích thành phần vàng nhanh chóng.
                    </p>
                  </div>
                  <p className="text-xs text-emerald-300 font-medium">
                    ✓ Đã qua kiểm duyệt và đạt chứng nhận của các đơn vị uy tín: <strong className="text-white">Tổng cục Tiêu chuẩn Đo lường Chất lượng</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 text-xs text-cyan-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Bảo đảm minh bạch tuổi vàng tuyệt đối 100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHÍNH SÁCH BÁN HÀNG & DỊCH VỤ (5 CAM KẾT VÀNG) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Award className="h-4 w-4" />
            <span>Cam kết dịch vụ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            CHÍNH SÁCH BÁN HÀNG & DỊCH VỤ CỦA SEVAGO
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            5 cam kết vàng đem đến trải nghiệm hợp tác tin cậy, bền vững và an tâm tuyệt đối cho đối tác.
          </p>
        </div>

        {/* 5 Icons / Cards in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Item 1 */}
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-[#002b22] p-5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              Bảo hành trọn đời sản phẩm
            </h4>
            <p className="text-[11px] text-slate-400">
              Đồng hành trọn vẹn trong suốt vòng đời sử dụng của từng tạo tác trang sức.
            </p>
          </div>

          {/* Item 2 */}
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-[#002b22] p-5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Factory className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              Gia công số lượng lớn
            </h4>
            <p className="text-[11px] text-slate-400">
              Năng lực đáp ứng các lô hàng lớn với chất lượng đồng nhất và giá thành tối ưu.
            </p>
          </div>

          {/* Item 3 */}
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-[#002b22] p-5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Truck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              Giao hàng tận nơi
            </h4>
            <p className="text-[11px] text-slate-400">
              Quy trình vận chuyển chuyên biệt bảo an cao cấp, an toàn đến từng địa chỉ.
            </p>
          </div>

          {/* Item 4 */}
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-[#002b22] p-5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              Bảo mật thông tin logo
            </h4>
            <p className="text-[11px] text-slate-400">
              Tuyệt đối bảo mật khuôn mẫu, bản quyền thiết kế và thương hiệu của khách hàng.
            </p>
          </div>

          {/* Item 5 */}
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-[#002b22] p-5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Search className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              Tra cứu xuất xứ rõ ràng
            </h4>
            <p className="text-[11px] text-slate-400">
              Minh bạch 100% nguồn gốc vàng, đá quý và hồ sơ kiểm định chất lượng đi kèm.
            </p>
          </div>
        </div>
      </section>

      {/* 5. THÔNG TIN LIÊN HỆ & TRỤ SỞ */}
      <section className="py-14 bg-gradient-to-b from-[#01241d] to-[#011813] border-t border-emerald-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-950/80 border border-emerald-500/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Contact Details */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Kết nối trực tiếp
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    Công ty TNHH MTV Sen Vàng Việt Nam (SEVAGO)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {/* Hotline */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                      <Phone className="h-4 w-4" />
                      <span>Hotline Hỗ trợ & Đặt hàng</span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      0996 618 618
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Giờ làm việc: 08:00 AM - 17:30 PM</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                      <Mail className="h-4 w-4" />
                      <span>Email Đặt hàng & Hợp tác</span>
                    </div>
                    <div className="text-base font-bold text-white font-mono">
                      order@sevago.com.vn
                    </div>
                    <div className="text-xs text-slate-400">
                      Phản hồi yêu cầu báo giá trong 24h
                    </div>
                  </div>

                  {/* Head Office */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1 sm:col-span-2">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                      <MapPin className="h-4 w-4" />
                      <span>Hệ thống cơ sở hoạt động:</span>
                    </div>
                    <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-200">
                      <div className="flex items-start space-x-2">
                        <span className="font-semibold text-emerald-300 shrink-0">• Trụ sở chính:</span>
                        <span>76 Tăng Nhơn Phú, Phường Tăng Nhơn Phú B, TP. Thủ Đức, TP. Hồ Chí Minh</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="font-semibold text-emerald-300 shrink-0">• Chi nhánh 1:</span>
                        <span>200 Nguyễn Văn Bá, Phường Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right CTA Box */}
              <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-[#004737] to-[#012820] border border-emerald-400/30">
                <div className="w-14 h-14 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold mb-4 shadow-lg shadow-emerald-400/20">
                  <Gem className="h-7 w-7" />
                </div>
                <h4 className="font-serif font-bold text-lg text-white mb-2">
                  Khám phá Bộ sưu tập
                </h4>
                <p className="text-xs text-emerald-100/80 mb-5 leading-relaxed">
                  Xem ngay danh mục hàng trăm mẫu nhẫn, dây chuyền, lắc tay vàng tinh xảo và tạo đơn chào hàng trực tiếp.
                </p>
                <Link
                  href="/catalogue"
                  className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
                >
                  <span>Xem E-Catalogue</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
