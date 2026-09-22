"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileText,
  Monitor,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CornerDownRight,
  Sparkles
} from "lucide-react";

export default function UserDetail({
  guide,
  allGuidesInModule = [],
  onSelectGuideFromPlaylist,
  onGoBackToCatalog
}) {
  const [activeTab, setActiveTab] = useState("steps"); // "steps" | "rules" | "errors" | "templates"
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0); // Mặc định mở câu 1
  const videoRef = useRef(null);

  if (!guide) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-gray-500">
        Chưa có bài viết hướng dẫn nào được chọn.
      </div>
    );
  }

  const milestones = guide.milestones || [];
  const prerequisites = guide.prerequisites || [];
  const completedResults = guide.completedResults || [];
  const businessRules = guide.businessRules || [];
  const commonErrors = guide.commonErrors || [];
  const documents = guide.documents || [];

  // Lọc playlist bài viết bên phải
  const filteredPlaylist = allGuidesInModule.filter((g) => {
    if (!playlistSearch.trim()) return true;
    const q = playlistSearch.toLowerCase();
    return (
      g.title?.toLowerCase().includes(q) ||
      g.shortTitle?.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q)
    );
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeekVideo = (timeStr) => {
    if (!videoRef.current || !timeStr) return;
    const parts = timeStr.split(":");
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    videoRef.current.currentTime = seconds;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white p-6 md:p-8">
      {/* 1. Header & Title Block */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
          {guide.title}
        </h1>
        {guide.description && (
          <p className="text-xs md:text-sm text-gray-600 mt-1.5 font-medium leading-relaxed">
            "{guide.description}"
          </p>
        )}
      </div>

      {/* 2. Hai cột chính: Trái (Video + Tabs + Related) & Phải (Playlist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (8 / 12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Video Player 16:9 chuẩn */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-md group flex items-center justify-center">
            <video
              ref={videoRef}
              src={guide.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Nút Play to ở giữa */}
            <button
              type="button"
              onClick={togglePlay}
              className="absolute w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 border-2 border-white/80 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg z-10"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </button>
          </div>

          {/* B. Màn hình áp dụng Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#eaf7f2] border border-[#b2e2d1] text-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <Monitor className="w-4 h-4 text-[#005a46] shrink-0" />
              <div className="truncate">
                <span className="font-bold text-gray-900">Màn Hình Áp Dụng: </span>
                <span className="text-emerald-950 font-medium">
                  {guide.applicableScreen || "Quản Lý Đơn Hàng > Thông Tin Đơn Hàng (/)"}
                </span>
              </div>
            </div>

            <Link
              href={guide.applicablePath || "/"}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#005a46] hover:bg-[#004737] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0 ml-3"
            >
              <span>Mở màn này</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* C. 4 Tabs Nghiệp vụ */}
          <div className="border-b border-gray-200 flex space-x-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("steps")}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === "steps"
                  ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Cách bước thực hiện ({milestones.length || 5})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === "rules"
                  ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Điều kiện & Quy định
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("errors")}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === "errors"
                  ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Xử lý lỗi thường gặp ({commonErrors.length || 3})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === "templates"
                  ? "text-emerald-900 font-black border-b-2 border-emerald-800"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Biểu mẫu đính kèm ({documents.length || 2})
            </button>
          </div>

          {/* D. Tab Content tương ứng */}
          <div className="pt-2">
            {/* TAB 1: CÁCH BƯỚC THỰC HIỆN */}
            {activeTab === "steps" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">
                    Quy Trình Thao Tác Chuẩn Theo Mốc Video
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Nhấp Vào Mốc Thời Gian Để Tua Video Đến Thao Tác Đó Hoặc Bấm Nút Thực Hành Để Thao Tác Trực Tiếp.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {milestones.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSeekVideo(step.time)}
                      className="p-3.5 bg-gray-50/70 hover:bg-emerald-50/50 border border-gray-200/80 hover:border-emerald-300 rounded-xl transition-all cursor-pointer flex items-start justify-between group"
                    >
                      <div className="flex items-start space-x-3 min-w-0">
                        {/* Huy hiệu số thứ tự xanh ngọc */}
                        <div className="w-6 h-6 rounded-md bg-[#84b8a7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
                          {step.stepNum || idx + 1}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-950 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                            {step.action}
                          </p>
                          {step.shortcut && (
                            <p className="text-[10px] text-emerald-800 font-bold">
                              • Thao Tác Chính: {step.shortcut}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mốc thời gian */}
                      <div className="flex items-center space-x-1 text-[11px] text-gray-500 group-hover:text-emerald-800 font-semibold shrink-0 ml-3 bg-white px-2 py-1 rounded-md border border-gray-200">
                        <Clock className="w-3 h-3 text-gray-400 group-hover:text-emerald-700" />
                        <span>{step.time || "00:00"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ĐIỀU KIỆN & QUY ĐỊNH */}
            {activeTab === "rules" && (
              <div className="space-y-5">
                {/* 2 Cột: Điều kiện tiên quyết & Kết quả sau hoàn thành */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Box 1: Điều kiện tiên quyết */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-2.5">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Điều Kiện Tiên Quyết
                    </h4>
                    <ul className="space-y-2 text-[11px] text-gray-700 leading-relaxed">
                      {prerequisites.map((p, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Box 2: Kết quả sau hoàn thành */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-2.5">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Kết Quả Sau Khi Hoàn Thành
                    </h4>
                    <ul className="space-y-2 text-[11px] text-gray-700 leading-relaxed">
                      {completedResults.map((r, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Box Ràng buộc & Quy tắc nghiệp vụ */}
                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                    Ràng Buộc Và Quy Tắc Nghiệp Vụ
                  </h4>
                  <div className="space-y-2 text-[11px] text-gray-700 leading-relaxed">
                    {businessRules.map((rule, i) => (
                      <p key={i}>
                        <strong className="text-gray-900">• {rule.title}: </strong>
                        {rule.content}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: XỬ LÝ LỖI THƯỜNG GẶP */}
            {activeTab === "errors" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">
                    Xử Lý Các Tình Huống & Sự Cố Thường Gặp
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Tổng Hợp Giải Pháp Nhanh Cho Nhân Viên Kinh Doanh Khi Gặp Lỗi Thao Tác Trên Hệ Thống.
                  </p>
                </div>

                <div className="space-y-3">
                  {commonErrors.map((err, i) => {
                    const isExpanded = expandedFaqIndex === i;

                    return (
                      <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs"
                      >
                        {/* Câu hỏi Q */}
                        <button
                          type="button"
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : i)}
                          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-black shrink-0">
                              Q
                            </div>
                            <span className="text-xs font-bold text-gray-900 truncate">
                              {err.question}
                            </span>
                          </div>

                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </button>

                        {/* Câu trả lời A (khi mở rộng) */}
                        {isExpanded && (
                          <div className="p-3.5 pt-0 border-t border-gray-100 bg-gray-50/40 text-xs space-y-2">
                            <div className="flex items-start space-x-2.5 mt-2">
                              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                A
                              </div>
                              <div className="space-y-1.5 text-[11px]">
                                <p className="text-gray-800">
                                  <strong className="text-gray-900">Nguyên nhân: </strong>
                                  {err.cause}
                                </p>
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200/80 font-medium">
                                  <span className="font-bold">→ Khắc phục: </span>
                                  {err.solution}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: BIỂU MẪU ĐÍNH KÈM */}
            {activeTab === "templates" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-900">
                    Tệp Mẫu & Biểu Mẫu Nghiệp Vụ Chuẩn
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Tải Biểu Mẫu Excel/PDF Để Nhập Liệu Nhanh Hoặc In Ấn Chứng Từ Theo Quy Chuẩn Công Ty.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-white border border-gray-200/90 rounded-xl shadow-2xs hover:border-emerald-400 transition-all"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Icon file Excel xanh ngọc */}
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {doc.name}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {doc.size}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Tải về tệp: ${doc.name}`)}
                        className="p-2 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Tải tệp này"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* E. Section: Nội Dung Liên Quan (4 Cards) */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-900">
              Nội Dung Liên Quan
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="h-24 bg-radial from-[#00694f] via-[#004737] to-[#002b21] p-2 flex flex-col items-center justify-center relative text-center">
                    <div className="w-8 h-8 rounded-full border border-white/80 flex items-center justify-center text-white mb-0.5">
                      <span className="font-serif font-black text-xs">SV</span>
                    </div>
                    <span className="text-[9px] font-serif tracking-widest font-black text-white uppercase">
                      SEVAGO
                    </span>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <h4 className="text-[11px] font-bold text-gray-900 group-hover:text-emerald-800 truncate">
                      Tạo đơn hàng
                    </h4>
                    <p className="text-[9px] text-gray-500 truncate font-medium">
                      Hướng Dẫn Tạo Và Quản Lý Hồ Sơ
                    </p>
                    <div className="flex items-center space-x-1 pt-1 border-t border-gray-100">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#004737] text-white flex items-center justify-center text-[7px] font-bold">
                        S
                      </div>
                      <span className="text-[9px] text-gray-600 font-medium">
                        Sevago
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (4 / 12): Danh Sách Bài Hướng Dẫn (Playlist) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-xl shadow-2xs p-4 space-y-3.5 sticky top-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-900">
                Danh Sách Bài Hướng Dẫn
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Chọn Bài Để Chuyển Video Và Nội Dung
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold border border-gray-200">
              12 bài
            </span>
          </div>

          {/* Ô tìm kiếm trong Playlist */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={playlistSearch}
              onChange={(e) => setPlaylistSearch(e.target.value)}
              placeholder="Search"
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Danh sách các bài trong Playlist */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPlaylist.map((g, idx) => {
              const isCurrent = g.id === guide.id;

              return (
                <div
                  key={g.id || idx}
                  onClick={() => onSelectGuideFromPlaylist(g)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#f2fbf7] border-[#81d8ba] shadow-2xs"
                      : "bg-white border-gray-200/80 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    {isCurrent ? (
                      <span className="font-bold text-emerald-900 flex items-center space-x-1">
                        <Play className="w-2.5 h-2.5 fill-emerald-800" />
                        <span>Đang xem</span>
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Quản Lý Đơn Hàng
                      </span>
                    )}

                    <span className="flex items-center space-x-1 text-gray-400 font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>{g.duration || "08:00"}</span>
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isCurrent ? "text-emerald-950" : "text-gray-900"
                    }`}
                  >
                    {g.shortTitle || g.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5 font-medium">
                    {g.description || "Tiếp Nhận Yêu Cầu Từ Tiệm Vàng & Áp Dụng Chiết Khấu"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
