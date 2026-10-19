"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Copy, 
  Check, 
  Sliders 
} from "lucide-react";
import { CHANGE_TYPES_CONFIG } from "@/data/productVersionConfigData";

export default function OrderItemConfigModal({
  isOpen,
  onClose,
  item,
  onSave
}) {
  const [copied, setCopied] = useState(false);

  // Form states cho thuộc tính cơ bản
  const [formData, setFormData] = useState({
    platingColor: "Trắng",
    mainStoneColor: "Trắng",
    size: 58,
    weight: "3.2120",
    convertedWeight: "3.2120",
    qty: 1
  });

  // Một Yêu cầu thay đổi duy nhất cho Item:
  // Cấu trúc Cascade: Yêu cầu thay đổi (dropdown) -> Dropdown / Ghi chú (Tùy vào cấu hình thay đổi)
  const [changeRequest, setChangeRequest] = useState({
    typeCode: "none",
    customSelection: "",
    note: ""
  });

  // Khởi tạo formData và parse yêu cầu thay đổi duy nhất khi item thay đổi
  useEffect(() => {
    if (item) {
      setFormData({
        platingColor: item.platingColor || "Trắng",
        mainStoneColor: item.stoneColor || "Trắng",
        size: item.size || 58,
        weight: item.weight ? item.weight.replace("g", "") : "3.2120",
        convertedWeight: item.convertedWeight ? item.convertedWeight.replace("g", "") : (item.weight ? item.weight.replace("g", "") : "3.2120"),
        qty: item.qty || 1
      });

      // 1. Nếu item đã có đối tượng changeRequest
      if (item.changeRequest && item.changeRequest.typeCode) {
        setChangeRequest(item.changeRequest);
      } else if (item.changeType && item.changeType !== "Không thay đổi") {
        // 2. Parse từ changeType / changeTypeCustomSelection / changeTypeDescription
        const matched = CHANGE_TYPES_CONFIG.find((c) => 
          item.changeType.toLowerCase().includes(c.name.toLowerCase()) || 
          c.name.toLowerCase().includes(item.changeType.toLowerCase()) ||
          c.code === item.changeType
        );

        if (matched) {
          setChangeRequest({
            typeCode: matched.code,
            customSelection: item.changeTypeCustomSelection || (matched.customOptions?.[0] || ""),
            note: item.changeTypeDescription || ""
          });
        } else {
          setChangeRequest({
            typeCode: "none",
            customSelection: "",
            note: ""
          });
        }
      } else if (item.claspType && item.claspType !== "Mặc định") {
        setChangeRequest({
          typeCode: "D",
          customSelection: item.claspType,
          note: ""
        });
      } else if (item.lacquerMachining && item.lacquerMachining !== "Không đổi") {
        setChangeRequest({
          typeCode: "C",
          customSelection: item.lacquerMachining,
          note: ""
        });
      } else if (item.castNote) {
        setChangeRequest({
          typeCode: "B",
          customSelection: "",
          note: item.castNote
        });
      } else if (item.pearlToBallNote) {
        setChangeRequest({
          typeCode: "F",
          customSelection: item.pearlToBallSelection || "Bi vàng trơn bóng 4mm",
          note: item.pearlToBallNote
        });
      } else {
        setChangeRequest({
          typeCode: "none",
          customSelection: "",
          note: ""
        });
      }
    }
  }, [item]);

  const handleCopyCode = () => {
    if (item?.itemCode) {
      navigator.clipboard.writeText(item.itemCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Xử lý thay đổi loại yêu cầu thay đổi duy nhất
  const handleTypeChange = (newCode) => {
    if (newCode === "none") {
      setChangeRequest({ typeCode: "none", customSelection: "", note: "" });
      return;
    }
    const cfg = CHANGE_TYPES_CONFIG.find((c) => c.code === newCode);
    setChangeRequest({
      typeCode: newCode,
      customSelection: cfg?.hasCustomSelection && cfg.customOptions?.length > 0 ? cfg.customOptions[0] : "",
      note: ""
    });
  };

  // Xử lý thay đổi dropdown chi tiết
  const handleCustomSelectionChange = (val) => {
    setChangeRequest((prev) => ({ ...prev, customSelection: val }));
  };

  // Xử lý thay đổi ghi chú mô tả
  const handleNoteChange = (val) => {
    setChangeRequest((prev) => ({ ...prev, note: val }));
  };

  // Xác nhận lưu
  const handleConfirm = () => {
    if (!item) return;

    let formattedChangeDisplay = "---";
    let changeType = "Không thay đổi";
    let changeTypeCustomSelection = "";
    let changeTypeDescription = "";

    if (changeRequest.typeCode !== "none") {
      const cfg = CHANGE_TYPES_CONFIG.find((c) => c.code === changeRequest.typeCode);
      changeType = cfg ? cfg.name : changeRequest.typeCode;
      changeTypeCustomSelection = changeRequest.customSelection;
      changeTypeDescription = changeRequest.note;

      if (cfg?.hasCustomSelection && cfg?.hasTextInput) {
        const parts = [];
        if (changeRequest.customSelection) parts.push(changeRequest.customSelection);
        if (changeRequest.note.trim()) parts.push(`"${changeRequest.note.trim()}"`);
        formattedChangeDisplay = `${changeType} [${parts.join(" - ")}]`;
      } else if (cfg?.hasCustomSelection) {
        formattedChangeDisplay = `${changeType} [${changeRequest.customSelection}]`;
      } else if (cfg?.hasTextInput) {
        formattedChangeDisplay = `${changeType}: "${changeRequest.note.trim()}"`;
      } else {
        formattedChangeDisplay = changeType;
      }
    }

    // Đồng bộ các trường tương thích
    const isClasp = changeRequest.typeCode === "D";
    const isExtender = changeRequest.typeCode === "T";
    const isBallCut = changeRequest.typeCode === "I";
    const isHTJ = changeRequest.typeCode === "G";
    const isCord = changeRequest.typeCode === "N";
    const isLacquer = changeRequest.typeCode === "C";
    const isCast = changeRequest.typeCode === "B";
    const isPearl = changeRequest.typeCode === "F";
    const isSubStone = changeRequest.typeCode === "S";

    onSave({
      ...item,
      platingColor: formData.platingColor,
      stoneColor: formData.mainStoneColor,
      size: formData.size,
      weight: `${formData.weight}g`,
      convertedWeight: `${formData.convertedWeight}g`,
      qty: Number(formData.qty) || 1,

      claspType: isClasp ? changeRequest.customSelection : "Mặc định",
      extenderType: isExtender ? changeRequest.customSelection : "Mặc định",
      ballCutType: isBallCut ? changeRequest.customSelection : "Mặc định",
      htjSizeChange: isHTJ ? changeRequest.customSelection : "Mặc định",
      cordColor: isCord ? changeRequest.customSelection : "Không đổi",
      lacquerMachining: isLacquer ? changeRequest.customSelection : "Không đổi",

      castNote: isCast ? changeRequest.note : "",
      pearlToBallNote: isPearl ? changeRequest.note : "",
      pearlToBallSelection: isPearl ? changeRequest.customSelection : "",
      subStoneNote: isSubStone ? changeRequest.note : "",
      generalNote: (!isCast && !isPearl && !isSubStone && changeRequest.typeCode !== "none") ? changeRequest.note : "",

      changeRequest: changeRequest.typeCode !== "none" ? changeRequest : null,
      changeType,
      changeTypeCustomSelection,
      changeTypeDescription,
      formattedChangeDisplay
    });

    onClose();
  };

  if (!isOpen || !item) return null;

  // Lấy cấu hình của YCTĐ đang chọn
  const currentConfig = CHANGE_TYPES_CONFIG.find((c) => c.code === changeRequest.typeCode);
  const hasCascadeDropdown = currentConfig && currentConfig.hasCustomSelection && currentConfig.customOptions?.length > 0;
  const hasNoteInput = currentConfig && currentConfig.hasTextInput;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. MODAL HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-mono text-base font-bold text-gray-900 tracking-tight">
                {item.itemCode || "GW0NM000145A00A00000000CZWW1580"}
              </h3>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                title="Sao chép mã Item"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Loại: <span className="font-medium text-gray-700">{item.productType || item.category || "Dây Chuyền Nam"}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2. MODAL BODY */}
        <div className="p-6 space-y-5 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* PHẦN TRÊN: ẢNH VÀ THUỘC TÍNH CỐT LÕI */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Cột trái: Ảnh sản phẩm kỹ thuật */}
            <div className="md:col-span-4 flex items-center justify-center bg-gray-50/70 border border-gray-200/80 rounded-2xl p-4 aspect-square">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.itemCode || "Sản phẩm"}
                  className="w-full h-full object-contain max-h-48 mix-blend-multiply"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <svg className="w-24 h-24 text-gray-300" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 60 40 C 60 120, 140 120, 140 40" stroke="currentColor" strokeWidth="3" strokeDasharray="4 2" />
                    <circle cx="100" cy="115" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="100" cy="115" r="4" fill="currentColor" />
                    <path d="M 100 127 L 100 160" stroke="currentColor" strokeWidth="3" />
                    <circle cx="100" cy="165" r="6" fill="currentColor" />
                  </svg>
                  <span className="text-[11px] font-medium text-gray-400">Hình ảnh kỹ thuật</span>
                </div>
              )}
            </div>

            {/* Cột phải: 6 thuộc tính cơ bản */}
            <div className="md:col-span-8 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. Màu xi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Màu xi</label>
                  <select
                    value={formData.platingColor}
                    onChange={(e) => setFormData({ ...formData, platingColor: e.target.value })}
                    className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-[#00594c] rounded-xl px-2.5 py-2 text-xs font-medium text-gray-800 outline-none transition-all cursor-pointer"
                  >
                    <option value="Trắng">Trắng</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Hồng">Hồng</option>
                    <option value="Hai màu">Hai màu</option>
                  </select>
                </div>

                {/* 2. Màu đá chính */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Màu đá chính</label>
                  <select
                    value={formData.mainStoneColor}
                    onChange={(e) => setFormData({ ...formData, mainStoneColor: e.target.value })}
                    className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-[#00594c] rounded-xl px-2.5 py-2 text-xs font-medium text-gray-800 outline-none transition-all cursor-pointer"
                  >
                    <option value="Trắng">🌿 Trắng</option>
                    <option value="Xanh">🔷 Xanh</option>
                    <option value="Đỏ">🔴 Đỏ</option>
                    <option value="Tím">🟣 Tím</option>
                    <option value="Vàng">🟡 Vàng</option>
                    <option value="Không đá">Không đá</option>
                  </select>
                </div>

                {/* 3. Kích thước */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kích thước</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-[#00594c] rounded-xl px-2.5 py-2 text-xs font-bold text-gray-900 outline-none transition-all cursor-pointer"
                  >
                    <option value={58}>58</option>
                    <option value={50}>50</option>
                    <option value={52}>52</option>
                    <option value={54}>54</option>
                    <option value={56}>56</option>
                    <option value={60}>60</option>
                    <option value={62}>62</option>
                  </select>
                </div>

                {/* 4. Trọng lượng */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Trọng lượng (g)</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-2 text-xs font-mono font-medium text-gray-800 outline-none"
                    placeholder="3.2120"
                  />
                </div>

                {/* 5. Trọng lượng quy đổi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">TL quy đổi</label>
                  <input
                    type="text"
                    value={formData.convertedWeight}
                    onChange={(e) => setFormData({ ...formData, convertedWeight: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-mono font-medium text-gray-600 outline-none"
                    placeholder="3.2120"
                    readOnly
                  />
                </div>

                {/* 6. Số lượng */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-[#00594c] rounded-xl px-2.5 py-2 text-xs font-bold text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN DƯỚI: YÊU CẦU THAY ĐỔI DUY NHẤT: DROPDOWN -> DROPDOWN / GHI CHÚ */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-[#00594c]" />
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Yêu cầu thay đổi
              </span>
            </div>

            {/* Khối chọn Yêu cầu thay đổi duy nhất */}
            <div className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-xl space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                {/* 1. Dropdown chọn loại thay đổi */}
                <div className={`${hasCascadeDropdown || hasNoteInput ? "md:col-span-5" : "md:col-span-12"}`}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Loại thay đổi
                  </label>
                  <select
                    value={changeRequest.typeCode}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="none">-- Không thay đổi --</option>
                    {CHANGE_TYPES_CONFIG.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Dropdown chi tiết (nếu cấu hình có Chọn chi tiết thay đổi) */}
                {hasCascadeDropdown && (
                  <div className={`${hasNoteInput ? "md:col-span-3" : "md:col-span-7"}`}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {currentConfig.customFieldLabel || "Chi tiết thay đổi"} <span className="text-[#00594c]">*</span>
                    </label>
                    <select
                      value={changeRequest.customSelection}
                      onChange={(e) => handleCustomSelectionChange(e.target.value)}
                      className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs font-medium text-gray-800 outline-none cursor-pointer shadow-2xs"
                    >
                      {currentConfig.customOptions.map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Ghi chú mô tả (nếu cấu hình có Nhập chi tiết thay đổi) */}
                {hasNoteInput && (
                  <div className={`${hasCascadeDropdown ? "md:col-span-4" : "md:col-span-7"}`}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ghi chú mô tả <span className="text-[#00594c]">*</span>
                    </label>
                    <input
                      type="text"
                      value={changeRequest.note}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder={`Nhập mô tả cho ${currentConfig.name}...`}
                      className="w-full bg-white border border-gray-300 focus:border-[#00594c] rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none shadow-2xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. MODAL FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 transition-colors shadow-2xs"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-[#00594c] hover:bg-[#004737] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
