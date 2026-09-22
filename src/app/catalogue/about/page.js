"use client";

import React from "react";
import Link from "next/link";
import SevagoLogo from "@/components/catalogue/SevagoLogo";
import {
  Building2,
  Users,
  Factory,
  ChevronRight,
  Play,
  CalendarCheck,
  PackageCheck,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck2,
  Gem,
  Award
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* 1. HEADER SECTION: LOGO CÔNG TY VÀ HEADER 'VỀ CHÚNG TÔI' (THEO GÓP Ý ẢNH 1) */}
      <section className="bg-gradient-to-b from-emerald-50/60 via-white to-white border-b border-emerald-100 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
            <Link href="/catalogue" className="hover:text-[#00594c] transition-colors font-medium">
              E-Catalogue
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#00594c] font-semibold">Về chúng tôi</span>
          </nav>

          {/* Logo công ty và Header Về chúng tôi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
            <div className="flex items-center space-x-4">
              <SevagoLogo />
            </div>

            <div className="border-l-0 sm:border-l-2 sm:border-emerald-200 sm:pl-6 text-left sm:text-right">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#00594c]/10 text-[#00594c] text-xs font-semibold uppercase tracking-wider mb-1">
                <Gem className="h-3.5 w-3.5 text-[#00594c]" />
                <span>Hồ sơ năng lực</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#004737] tracking-tight">
                Về chúng tôi
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GIỚI THIỆU TỔNG QUAN VỀ SEVAGO (NỀN TRẮNG - XANH THANH LỊCH) */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Tiêu đề mục */}
          <div className="flex items-center space-x-3 border-l-4 border-[#00594c] pl-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#004737] tracking-tight uppercase">
              Giới thiệu tổng quan về SEVAGO
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột trái: Văn bản giới thiệu & 3 thẻ đội ngũ */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify">
                <p>
                  Công ty TNHH MTV Sen Vàng Việt Nam (SEVAGO) tiền thân là{" "}
                  <strong className="text-[#004737] font-semibold">
                    Công ty Cổ phần Kim Loại Quý Sài Gòn Quốc Tế (Sip Corp)
                  </strong>{" "}
                  được thành lập vào ngày <span className="text-[#00594c] font-semibold">25/12/2009</span>, hoạt động trong lĩnh vực kinh doanh và chế tác vàng bạc đá quý.
                </p>
                <p>
                  Kế thừa nền tảng <strong className="text-[#004737] font-semibold">17 năm</strong> trong ngành chế tác kim hoàn, SEVAGO không ngừng đổi mới, sáng tạo, hướng đến mục tiêu trở thành thương hiệu trang sức cao cấp hàng đầu Việt Nam và vươn tầm khu vực.
                </p>
              </div>

              {/* 3 Thẻ đội ngũ tự hào theo tone xanh ngọc Sevago (Ảnh 2) */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-[#004737] uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00594c]" />
                  <span>SEVAGO tự hào khi hội tụ đội ngũ gồm:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Stat 1 */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#00594c] to-[#00705f] p-5 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="text-3xl font-extrabold font-mono tracking-tight text-white mb-1">
                        500+
                      </div>
                      <div className="text-xs text-emerald-100 font-medium leading-snug">
                        cán bộ nhân viên chuyên môn cao.
                      </div>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#00594c] to-[#00705f] p-5 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="text-3xl font-extrabold font-mono tracking-tight text-amber-200 mb-1">
                        1.000+
                      </div>
                      <div className="text-xs text-emerald-100 font-medium leading-snug">
                        Thợ kim hoàn lành nghề được đào tạo trong và ngoài nước.
                      </div>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#00594c] to-[#00705f] p-5 text-white shadow-md shadow-emerald-900/10 hover:shadow-lg transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="text-3xl font-extrabold font-mono tracking-tight text-white mb-1">
                        10.000m²
                      </div>
                      <div className="text-xs text-emerald-100 font-medium leading-snug">
                        Tổng diện tích nhà xưởng, trụ sở chính và chi nhánh.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Video Corporation Placeholder & Ảnh nhà xưởng */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-white border border-emerald-200/80 p-4 shadow-lg shadow-emerald-900/5">
                {/* Khung video nền xanh ngọc đậm thanh lịch */}
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-[#004737] via-[#00594c] to-[#01352a] flex flex-col items-center justify-center p-6 text-center shadow-inner group">
                  <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider">
                    Video corporation of SEVAGO
                  </div>
                  <div className="text-xs text-emerald-200/90 mt-1">
                    (hiện đang hiển thị trên trang chủ Website)
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-500 italic text-center mt-3">
                  * Marcom đang làm lại video sẽ gửi CNS upload thay khi video mới được duyệt.
                </p>
              </div>

              {/* Chú thích hình ảnh công nhân, thợ kim hoàn & nhà xưởng */}
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/60 p-3.5 flex items-center space-x-3 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-[#00594c]/10 flex items-center justify-center text-[#00594c] shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <span>
                  <strong>Hình ảnh công nhân, thợ kim hoàn (có khung cảnh nhà xưởng):</strong> Trích xuất từ chương trình tặng 500 suất học bổng toàn phần ngành kim hoàn của Sevago Jewelry.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NĂNG LỰC SẢN XUẤT & CHẾ TÁC CỦA SEVAGO (NỀN XANH NGỌC SEVAGO ĐẬM THEO ẢNH MẪU 2) */}
      <section className="py-14 sm:py-18 bg-gradient-to-b from-[#004737] via-[#00594c] to-[#00382e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Tiêu đề chuẩn format tiếng Việt không bị lỗi font */}
          <div className="border-l-4 border-emerald-300 pl-4 space-y-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase font-sans">
              NĂNG LỰC SẢN XUẤT &amp; CHẾ TÁC CỦA SEVAGO
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 font-normal">
              Những yếu tố quyết định tạo nên lợi thế của chúng tôi:
            </p>
          </div>

          {/* 4 Trụ cột năng lực theo style Glassmorphism của ảnh 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Năng lực gia công - chế tác */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 flex flex-col justify-between hover:bg-white/15 transition-all shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-emerald-200">
                    <Factory className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    Mục 1
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  1. Năng lực gia công - chế tác
                </h3>
                <ul className="text-sm text-emerald-50 space-y-2 leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>SEVAGO có khả năng cung cấp dịch vụ gia công sản phẩm trang sức với số lượng lớn và nhanh chóng.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11.5px] text-emerald-200/80 italic">
                * Hình ảnh chế tác lấy từ trang Giá trị doanh nghiệp - Sevago Jewelry
              </div>
            </div>

            {/* 2. Năng lực sản xuất */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 flex flex-col justify-between hover:bg-white/15 transition-all shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-emerald-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    Mục 2
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  2. Năng lực sản xuất
                </h3>
                <ul className="text-sm text-emerald-50 space-y-2 leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>Khả năng sản xuất nhanh – chất lượng cao – đáp ứng mọi nhu cầu của khách hàng về chất lượng lẫn mẫu mã.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11.5px] text-emerald-200/80 italic">
                * Chuẩn hóa chất lượng và tính thẩm mỹ đồng bộ
              </div>
            </div>

            {/* 3. Năng lực phát triển mẫu (R&D) */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 flex flex-col justify-between hover:bg-white/15 transition-all shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-emerald-200">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    Mục 3
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  3. Năng lực phát triển mẫu (R&amp;D)
                </h3>
                <ul className="text-sm text-emerald-50 space-y-2 leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>Kho mẫu đa dạng với <strong>gần 60.000 mẫu</strong> phù hợp với nhiều đối tượng khách hàng.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span><strong>Quy trình phát triển mẫu tiêu chuẩn:</strong> thu thập thông tin, phát triển ý tưởng, thiết kế kỹ thuật, tạo mẫu thử, duyệt mẫu và chuyển giao sản xuất.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11.5px] text-emerald-200/80 italic">
                * Hình ảnh thiết kế vẽ, lên 3D sản phẩm
              </div>
            </div>

            {/* 4. Trung tâm kiểm định */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-7 flex flex-col justify-between hover:bg-white/15 transition-all shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-emerald-200">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    Mục 4
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  4. Trung tâm kiểm định
                </h3>
                <ul className="text-sm text-emerald-50 space-y-2 leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>SEVAGO có đơn vị chuyên kiểm tra, đánh giá và xác nhận chất lượng – nguồn gốc – thành phần của các sản phẩm kim loại quý.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>Đạt chứng nhận bởi <strong>Tổng cục Tiêu chuẩn Đo lường Chất lượng (STAMEQ)</strong> theo quy định của <strong>Thông tư 22/2013/TT-BKHCN</strong> (quản lý đo lường trong kinh doanh vàng, trang sức).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>Có trang thiết bị chuyên ngành phục vụ cho việc kiểm định. Quy trình thử nghiệm theo chuẩn <strong>ISO/IEC 17025</strong>.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-300 font-bold">•</span>
                    <span>Đội ngũ chuyên gia được đào tạo chuyên sâu và có chứng chỉ hành nghề giám định kim hoàn/đá quý do cơ quan có thẩm quyền cấp.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-white/15 text-[11.5px] text-emerald-200/80 italic">
                * Hình ảnh liên quan đến kiểm định sản phẩm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHÍNH SÁCH BÁN HÀNG & DỊCH VỤ CỦA SEVAGO (NỀN TRẮNG - 5 ELEMENT ĐƠN GIẢN THEO ẢNH 2) */}
      <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-l-4 border-[#00594c] pl-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004737] tracking-tight uppercase font-sans">
            CHÍNH SÁCH BÁN HÀNG &amp; DỊCH VỤ CỦA SEVAGO
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Thiết kế thành các element đơn giản
          </p>
        </div>

        {/* 5 Elements: Card hình chữ nhật đứng nền gradient xanh ngọc Sevago như 'Giá trị cốt lõi' trong ảnh 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Element 1 */}
          <div className="rounded-2xl bg-gradient-to-b from-[#00594c] to-[#00705f] p-6 text-white text-center flex flex-col items-center justify-center space-y-4 shadow-md shadow-emerald-900/10 hover:scale-[1.02] transition-transform group">
            <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <CalendarCheck className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-semibold leading-snug">
              Đặt lịch tư vấn theo nhu cầu
            </h4>
          </div>

          {/* Element 2 */}
          <div className="rounded-2xl bg-gradient-to-b from-[#00594c] to-[#00705f] p-6 text-white text-center flex flex-col items-center justify-center space-y-4 shadow-md shadow-emerald-900/10 hover:scale-[1.02] transition-transform group">
            <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <PackageCheck className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-semibold leading-snug">
              Gia công số lượng lớn
            </h4>
          </div>

          {/* Element 3 */}
          <div className="rounded-2xl bg-gradient-to-b from-[#00594c] to-[#00705f] p-6 text-white text-center flex flex-col items-center justify-center space-y-4 shadow-md shadow-emerald-900/10 hover:scale-[1.02] transition-transform group">
            <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <Truck className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-semibold leading-snug">
              Giao hàng tận nơi
            </h4>
          </div>

          {/* Element 4 */}
          <div className="rounded-2xl bg-gradient-to-b from-[#00594c] to-[#00705f] p-6 text-white text-center flex flex-col items-center justify-center space-y-4 shadow-md shadow-emerald-900/10 hover:scale-[1.02] transition-transform group">
            <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <ShieldCheck className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-semibold leading-snug">
              Bảo hành linh hoạt
            </h4>
          </div>

          {/* Element 5 */}
          <div className="rounded-2xl bg-gradient-to-b from-[#00594c] to-[#00705f] p-6 text-white text-center flex flex-col items-center justify-center space-y-4 shadow-md shadow-emerald-900/10 hover:scale-[1.02] transition-transform group">
            <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <RefreshCw className="h-6 w-6 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-semibold leading-snug">
              Thu mua và đổi trả rõ ràng
            </h4>
          </div>
        </div>
      </section>

      {/* LƯU Ý: KHỐI THÔNG TIN LIÊN HỆ ĐÃ ĐƯỢC LƯỢC BỎ ĐỂ TRÁNH TRÙNG LẶP VỚI FOOTER THEO GÓP Ý CỦA CHỊ ĐẸP */}
    </div>
  );
}
