"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Award,
  Factory,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Play,
  CalendarCheck,
  PackageCheck,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck2,
  ArrowRight,
  Gem
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. BREADCRUMB & HEADER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#012820] via-[#004737] to-[#011e18] pt-6 pb-12 border-b border-emerald-600/30">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-emerald-300/80 mb-6">
            <Link href="/catalogue" className="hover:text-white transition-colors">
              E-Catalogue
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-emerald-100 font-medium">Về chúng tôi</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              <Gem className="h-3.5 w-3.5 text-emerald-400" />
              <span>Thương hiệu Kim hoàn Cao cấp</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight uppercase">
              GIỚI THIỆU VỀ SEVAGO TRÊN E - CATALOGUE
            </h1>
          </div>
        </div>
      </section>

      {/* 2. GIỚI THIỆU TỔNG QUAN VỀ SEVAGO */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="border-l-4 border-emerald-400 pl-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wide">
              Giới thiệu tổng quan về SEVAGO
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Văn bản Giới thiệu */}
            <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p className="text-justify">
                Công ty TNHH MTV Sen Vàng Việt Nam (SEVAGO) tiền thân là Công ty Cổ phần Kim Loại Quý Sài Gòn Quốc Tế (Sip Corp) được thành lập vào ngày <span className="text-emerald-300 font-semibold">25/12/2009</span>, hoạt động trong lĩnh vực kinh doanh và chế tác vàng bạc đá quý.
              </p>
              <p className="text-justify">
                Kế thừa nền tảng <strong className="text-white font-semibold">17 năm</strong> trong ngành chế tác kim hoàn, SEVAGO không ngừng đổi mới, sáng tạo, hướng đến mục tiêu trở thành thương hiệu trang sức cao cấp hàng đầu Việt Nam và vươn tầm khu vực.
              </p>

              {/* Khối đội ngũ tự hào */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-3">
                  SEVAGO tự hào khi hội tụ đội ngũ gồm:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex flex-col justify-between">
                    <div className="text-2xl font-extrabold text-emerald-300 font-mono">500+</div>
                    <div className="text-xs text-slate-300 mt-1 font-medium">cán bộ nhân viên chuyên môn cao.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex flex-col justify-between">
                    <div className="text-2xl font-extrabold text-amber-300 font-mono">1.000+</div>
                    <div className="text-xs text-slate-300 mt-1 font-medium">Thợ kim hoàn lành nghề được đào tạo trong và ngoài nước.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex flex-col justify-between">
                    <div className="text-2xl font-extrabold text-emerald-300 font-mono">10.000m²</div>
                    <div className="text-xs text-slate-300 mt-1 font-medium">Tổng diện tích nhà xưởng, trụ sở chính và chi nhánh.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video / Visual Corporate Placeholder */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 p-4 shadow-xl">
                <div className="relative aspect-video rounded-xl bg-slate-950 border border-emerald-600/30 flex flex-col items-center justify-center p-6 text-center group">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-3 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </div>
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">
                    Video corporation of SEVAGO
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    (hiện đang hiển thị trên trang chủ Website)
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic text-center mt-2.5">
                  * Marcom đang làm lại video sẽ gửi CNS upload thay khi video mới được duyệt.
                </p>
              </div>

              {/* Ghi chú ảnh thợ kim hoàn & nhà xưởng */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 flex items-center space-x-3 text-xs text-slate-300">
                <Users className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  Hình ảnh công nhân, thợ kim hoàn (có khung cảnh nhà xưởng) - Trích nguồn từ chương trình 500 suất học bổng ngành kim hoàn SEVAGO.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NĂNG LỰC SẢN XUẤT & CHẾ TÁC CỦA SEVAGO */}
      <section className="py-12 bg-gradient-to-b from-slate-950 via-[#00241c] to-slate-950 border-y border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-l-4 border-emerald-400 pl-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wide">
              NĂNG LỰC SẢN XUẤT & CHẾ TÁC CỦA SEVAGO
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/90 mt-1">
              Những yếu tố quyết định tạo nên lợi thế của chúng tôi:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Năng lực gia công - chế tác */}
            <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Factory className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Mục 1
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  1. Năng lực gia công - chế tác
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>SEVAGO có khả năng cung cấp dịch vụ gia công sản phẩm trang sức với số lượng lớn và nhanh chóng.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                * Hình ảnh chế tác lấy từ trang Giá trị doanh nghiệp - Sevago Jewelry
              </div>
            </div>

            {/* 2. Năng lực sản xuất */}
            <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Mục 2
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  2. Năng lực sản xuất
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Khả năng sản xuất nhanh – chất lượng cao – đáp ứng mọi nhu cầu của khách hàng về chất lượng lẫn mẫu mã.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                * Chuẩn hóa chất lượng và tính thẩm mỹ đồng bộ
              </div>
            </div>

            {/* 3. Năng lực phát triển mẫu (R&D) */}
            <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Mục 3
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  3. Năng lực phát triển mẫu (R&D)
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Kho mẫu đa dạng với <strong>gần 60.000 mẫu</strong> phù hợp với nhiều đối tượng khách hàng.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Quy trình phát triển mẫu tiêu chuẩn:</strong> thu thập thông tin, phát triển ý tưởng, thiết kế kỹ thuật, tạo mẫu thử, duyệt mẫu và chuyển giao sản xuất.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                * Hình ảnh thiết kế vẽ, lên 3D sản phẩm
              </div>
            </div>

            {/* 4. Trung tâm kiểm định */}
            <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/20 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Mục 4
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  4. Trung tâm kiểm định
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>SEVAGO có đơn vị chuyên kiểm tra, đánh giá và xác nhận chất lượng – nguồn gốc – thành phần của các sản phẩm kim loại quý.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Đạt chứng nhận bởi <strong>Tổng cục Tiêu chuẩn Đo lường Chất lượng (STAMEQ)</strong> theo quy định của <strong>Thông tư 22/2013/TT-BKHCN</strong> (quản lý đo lường trong kinh doanh vàng, trang sức).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Có trang thiết bị chuyên ngành phục vụ cho việc kiểm định. Quy trình thử nghiệm theo chuẩn <strong>ISO/IEC 17025</strong>.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Đội ngũ chuyên gia được đào tạo chuyên sâu và có chứng chỉ hành nghề giám định kim hoàn/đá quý do cơ quan có thẩm quyền cấp.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                * Hình ảnh liên quan đến kiểm định sản phẩm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHÍNH SÁCH BÁN HÀNG & DỊCH VỤ CỦA SEVAGO */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-l-4 border-emerald-400 pl-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wide">
            CHÍNH SÁCH BÁN HÀNG & DỊCH VỤ CỦA SEVAGO
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Thiết kế thành các element đơn giản
          </p>
        </div>

        {/* 5 Elements theo đúng tài liệu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Element 1 */}
          <div className="rounded-xl bg-slate-900 border border-emerald-500/20 p-5 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Đặt lịch tư vấn theo nhu cầu
            </h4>
          </div>

          {/* Element 2 */}
          <div className="rounded-xl bg-slate-900 border border-emerald-500/20 p-5 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <PackageCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Gia công số lượng lớn
            </h4>
          </div>

          {/* Element 3 */}
          <div className="rounded-xl bg-slate-900 border border-emerald-500/20 p-5 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Truck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Giao hàng tận nơi
            </h4>
          </div>

          {/* Element 4 */}
          <div className="rounded-xl bg-slate-900 border border-emerald-500/20 p-5 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Bảo hành linh hoạt
            </h4>
          </div>

          {/* Element 5 */}
          <div className="rounded-xl bg-slate-900 border border-emerald-500/20 p-5 text-center flex flex-col items-center justify-center space-y-3 hover:border-emerald-400/40 transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Thu mua và đổi trả rõ ràng
            </h4>
          </div>
        </div>
      </section>

      {/* 5. THÔNG TIN LIÊN HỆ */}
      <section className="py-12 bg-gradient-to-b from-[#01241d] to-[#011813] border-t border-emerald-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/30 p-6 sm:p-8 shadow-xl">
            <div className="border-l-4 border-emerald-400 pl-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wide">
                THÔNG TIN LIÊN HỆ
              </h2>
              <div className="text-sm font-semibold text-emerald-300 mt-1">
                Công ty TNHH MTV Sen Vàng Việt Nam (SEVAGO)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <Phone className="h-4 w-4" />
                  <span>Hotline</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  0996.618.618 | 08:00 AM - 05:00 PM
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  sales@sevago.com.vn
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1 md:col-span-2">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <MapPin className="h-4 w-4" />
                  <span>Địa chỉ</span>
                </div>
                <div className="space-y-1.5 pt-1 text-slate-200 text-sm">
                  <div>
                    <strong className="text-emerald-300">• Trụ sở chính:</strong> 76 Tăng Nhơn Phú, phường Tăng Nhơn Phú, Tp. Hồ Chí Minh.
                  </div>
                  <div>
                    <strong className="text-emerald-300">• Chi nhánh:</strong> 200 Nguyễn Văn Bá, phường Thủ Đức, Tp. Hồ Chí Minh.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div className="italic">
                * Dùng tạm phần footer trên website SEVAGO. Marcom sẽ gửi lại footer mới khi thiết kế xong và được duyệt.
              </div>
              <Link
                href="/catalogue"
                className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <span>Quay lại E-Catalogue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
