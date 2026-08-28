"use client";

import React from "react";

export default function JewelryVisual({ type = "bracelet-gold", className = "w-full h-full" }) {
  // Renders high-fidelity luxury jewelry vector art matching SEVAGO catalog photos
  switch (type) {
    case "set-royal-emerald":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100/60 rounded-2xl ${className}`}>
          <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl select-none">
            <defs>
              <linearGradient id="setGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="35%" stopColor="#E2A62C" />
                <stop offset="70%" stopColor="#F9D46A" />
                <stop offset="100%" stopColor="#A8720B" />
              </linearGradient>
              <linearGradient id="setEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52C41A" />
                <stop offset="45%" stopColor="#006d75" />
                <stop offset="85%" stopColor="#003a3d" />
                <stop offset="100%" stopColor="#87e8de" />
              </linearGradient>
              <filter id="suiteGlow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#004737" floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Velvet Display Plaque Outline */}
            <rect x="15" y="15" width="290" height="290" rx="24" fill="#013b2f" opacity="0.04" stroke="#00594c" strokeWidth="1" strokeDasharray="6 4" />
            
            {/* 1. TOP CENTER: Dây chuyền & Mặt giọt nước Emerald */}
            <g transform="translate(160, 95)">
              <path d="M -70 -50 Q 0 45 70 -50" fill="none" stroke="url(#setGold)" strokeWidth="3.5" strokeLinecap="round" />
              {/* Emerald Pear Pendant */}
              <g transform="translate(0, 18)">
                <path d="M 0 -18 C 14 -8 18 8 0 26 C -18 8 -14 -8 0 -18 Z" fill="url(#setEmerald)" stroke="url(#setGold)" strokeWidth="2" filter="url(#suiteGlow)" />
                <circle cx="0" cy="-21" r="3.5" fill="url(#setGold)" />
                <polygon points="0,-8 5,5 0,16 -5,5" fill="#FFFFFF" opacity="0.4" />
              </g>
            </g>

            {/* 2. LEFT: Bông tai Emerald Dáng thả */}
            <g transform="translate(75, 110)">
              <circle cx="0" cy="-20" r="4" fill="url(#setGold)" />
              <line x1="0" y1="-16" x2="0" y2="0" stroke="url(#setGold)" strokeWidth="1.5" />
              <path d="M 0 0 C 8 6 10 16 0 25 C -10 16 -8 6 0 0 Z" fill="url(#setEmerald)" stroke="url(#setGold)" strokeWidth="1.5" />
            </g>

            {/* 3. RIGHT: Bông tai thứ 2 */}
            <g transform="translate(245, 110)">
              <circle cx="0" cy="-20" r="4" fill="url(#setGold)" />
              <line x1="0" y1="-16" x2="0" y2="0" stroke="url(#setGold)" strokeWidth="1.5" />
              <path d="M 0 0 C 8 6 10 16 0 25 C -10 16 -8 6 0 0 Z" fill="url(#setEmerald)" stroke="url(#setGold)" strokeWidth="1.5" />
            </g>

            {/* 4. BOTTOM LEFT: Nhẫn Nữ Emerald */}
            <g transform="translate(95, 230)">
              <ellipse cx="0" cy="10" rx="30" ry="18" fill="none" stroke="url(#setGold)" strokeWidth="7" />
              {/* Emerald Center Oval Stone */}
              <ellipse cx="0" cy="-10" rx="14" ry="10" fill="url(#setEmerald)" stroke="url(#setGold)" strokeWidth="2" />
              <circle cx="0" cy="-10" r="3" fill="#FFFFFF" opacity="0.6" />
            </g>

            {/* 5. BOTTOM RIGHT: Lắc tay mắt xích phối đá */}
            <g transform="translate(225, 230)">
              <ellipse cx="0" cy="5" rx="42" ry="24" fill="none" stroke="url(#setGold)" strokeWidth="5" strokeDasharray="8 3" />
              <rect x="-8" y="-19" width="16" height="12" rx="3" fill="url(#setEmerald)" stroke="url(#setGold)" strokeWidth="1.5" />
            </g>

            {/* Center Royal Badge */}
            <g transform="translate(160, 195)">
              <rect x="-38" y="-12" width="76" height="24" rx="12" fill="#00594c" />
              <text x="0" y="4" fill="#6ee7b7" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">4-IN-1 SET</text>
            </g>
          </svg>
        </div>
      );

    case "set-diamond-bridal":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100/60 rounded-2xl ${className}`}>
          <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl select-none">
            <defs>
              <linearGradient id="diaWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#D9E2EC" />
                <stop offset="100%" stopColor="#9FB3C8" />
              </linearGradient>
              <linearGradient id="diaGemSpark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#BAE7FF" />
                <stop offset="80%" stopColor="#D3ADF7" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <rect x="15" y="15" width="290" height="290" rx="24" fill="#0c4a6e" opacity="0.04" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 4" />
            
            {/* Necklace Center */}
            <g transform="translate(160, 95)">
              <path d="M -75 -50 Q 0 45 75 -50" fill="none" stroke="url(#diaWhite)" strokeWidth="3" strokeDasharray="6 2" />
              {/* Snowflake Diamond Pendant */}
              <g transform="translate(0, 20)">
                <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" fill="url(#diaGemSpark)" stroke="url(#diaWhite)" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
              </g>
            </g>

            {/* Earrings Studs */}
            <g transform="translate(75, 110)">
              <polygon points="0,-10 8,0 0,10 -8,0" fill="url(#diaGemSpark)" stroke="url(#diaWhite)" strokeWidth="1.2" />
            </g>
            <g transform="translate(245, 110)">
              <polygon points="0,-10 8,0 0,10 -8,0" fill="url(#diaGemSpark)" stroke="url(#diaWhite)" strokeWidth="1.2" />
            </g>

            {/* Solitaire Ring */}
            <g transform="translate(95, 230)">
              <ellipse cx="0" cy="10" rx="30" ry="18" fill="none" stroke="url(#diaWhite)" strokeWidth="6" />
              <polygon points="0,-22 10,-10 0,0 -10,-10" fill="url(#diaGemSpark)" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>

            {/* Tennis Bracelet */}
            <g transform="translate(225, 230)">
              <ellipse cx="0" cy="5" rx="42" ry="24" fill="none" stroke="url(#diaWhite)" strokeWidth="5" strokeDasharray="4 2" />
            </g>

            {/* Badge */}
            <g transform="translate(160, 195)">
              <rect x="-38" y="-12" width="76" height="24" rx="12" fill="#0369a1" />
              <text x="0" y="4" fill="#e0f2fe" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">BRIDAL SET</text>
            </g>
          </svg>
        </div>
      );

    case "ring-emerald":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="40%" stopColor="#E2A62C" />
                <stop offset="100%" stopColor="#B37D14" />
              </linearGradient>
              <linearGradient id="gemEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52C41A" />
                <stop offset="50%" stopColor="#006d75" />
                <stop offset="100%" stopColor="#002329" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150) rotate(-10)">
              <ellipse cx="0" cy="20" rx="75" ry="50" fill="none" stroke="url(#ringGold)" strokeWidth="18" />
              <rect x="-32" y="-45" width="64" height="48" rx="8" fill="url(#gemEmerald)" stroke="url(#ringGold)" strokeWidth="4" />
              <polygon points="-20,-35 20,-35 26,-15 -26,-15" fill="#FFFFFF" opacity="0.3" />
            </g>
          </svg>
        </div>
      );

    case "bracelet-gold":
    case "gold-chain-bracelet":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-emerald-50/30 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="30%" stopColor="#E2A62C" />
                <stop offset="60%" stopColor="#F9D46A" />
                <stop offset="85%" stopColor="#B37D14" />
                <stop offset="100%" stopColor="#FEE48E" />
              </linearGradient>
              <linearGradient id="goldInner" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8A5805" />
                <stop offset="50%" stopColor="#C99424" />
                <stop offset="100%" stopColor="#573801" />
              </linearGradient>
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#b37d14" floodOpacity="0.35"/>
              </filter>
            </defs>
            <g transform="translate(150,150) rotate(-15)">
              <ellipse cx="0" cy="0" rx="98" ry="72" fill="none" stroke="url(#goldGradient)" strokeWidth="18" strokeLinecap="round" filter="url(#goldGlow)" strokeDasharray="18 4"/>
              <ellipse cx="0" cy="0" rx="98" ry="72" fill="none" stroke="url(#goldInner)" strokeWidth="8" strokeDasharray="6 16"/>
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (i * 20 * Math.PI) / 180;
                const x = 98 * Math.cos(angle);
                const y = 72 * Math.sin(angle);
                return (
                  <g key={i} transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI + 90})`}>
                    <rect x="-7" y="-12" width="14" height="24" rx="7" fill="url(#goldGradient)" stroke="#8A5805" strokeWidth="1.2"/>
                    <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#fcfcfc" opacity="0.6"/>
                  </g>
                );
              })}
              <g transform="translate(70, -65) rotate(45)">
                <rect x="-8" y="-15" width="16" height="30" rx="8" fill="url(#goldGradient)" stroke="#744b02" strokeWidth="1.5"/>
                <circle cx="0" cy="2" r="3" fill="#ffffff" opacity="0.9"/>
                <path d="M 0 15 Q 15 35 25 50" fill="none" stroke="url(#goldGradient)" strokeWidth="3" strokeDasharray="4 2"/>
                <path d="M 25 50 L 32 45 L 36 55 L 28 60 Z" fill="url(#goldGradient)" stroke="#8A5805" strokeWidth="1"/>
              </g>
            </g>
          </svg>
        </div>
      );

    case "cat-charm-bracelet":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#D9DEE3" />
                <stop offset="70%" stopColor="#9BA3AF" />
                <stop offset="100%" stopColor="#EAEFF4" />
              </linearGradient>
              <linearGradient id="pinkBow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF85C0" />
                <stop offset="100%" stopColor="#EB2F96" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150)">
              <circle cx="0" cy="0" r="85" fill="none" stroke="url(#silverGradient)" strokeWidth="12" strokeDasharray="14 3" filter="drop-shadow(0px 6px 8px rgba(0,0,0,0.15))"/>
              <g transform="translate(0, 75)">
                <ellipse cx="0" cy="0" rx="34" ry="26" fill="#F8FAFC" stroke="url(#silverGradient)" strokeWidth="4"/>
                <polygon points="-24,-18 -32,-36 -12,-25" fill="#F8FAFC" stroke="url(#silverGradient)" strokeWidth="3"/>
                <polygon points="24,-18 32,-36 12,-25" fill="#F8FAFC" stroke="url(#silverGradient)" strokeWidth="3"/>
                <g transform="translate(20, -22) rotate(20)">
                  <polygon points="0,0 12,-8 12,8" fill="url(#pinkBow)"/>
                  <polygon points="0,0 -12,-8 -12,8" fill="url(#pinkBow)"/>
                  <circle cx="0" cy="0" r="3.5" fill="#FFF"/>
                </g>
                <circle cx="36" cy="18" r="9" fill="url(#silverGradient)" stroke="#64748b" strokeWidth="1.5"/>
                <line x1="32" y1="20" x2="40" y2="20" stroke="#334155" strokeWidth="1.5"/>
              </g>
              <rect x="-10" y="-95" width="20" height="18" rx="5" fill="url(#silverGradient)" stroke="#475569" strokeWidth="1.5"/>
              <path d="M 0 -77 Q -10 -55 -5 -40" fill="none" stroke="url(#silverGradient)" strokeWidth="3"/>
              <rect x="-12" y="-40" width="14" height="14" rx="2" fill="url(#silverGradient)" stroke="#475569" strokeWidth="1"/>
            </g>
          </svg>
        </div>
      );

    case "purple-flower-bracelet":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-purple-50/40 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="purpleGem" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F759AB" />
                <stop offset="40%" stopColor="#9254DE" />
                <stop offset="80%" stopColor="#531DAB" />
                <stop offset="100%" stopColor="#B37FEB" />
              </linearGradient>
              <linearGradient id="silverGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150)">
              <circle cx="0" cy="0" r="88" fill="none" stroke="url(#silverGloss)" strokeWidth="6" strokeDasharray="10 4"/>
              <g transform="translate(-88, 0)">
                <circle cx="-10" cy="0" r="8" fill="url(#silverGloss)"/>
                <circle cx="10" cy="0" r="8" fill="url(#silverGloss)"/>
                <circle cx="0" cy="-10" r="8" fill="url(#silverGloss)"/>
                <circle cx="0" cy="10" r="8" fill="url(#silverGloss)"/>
                <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
              </g>
              <g transform="translate(62, -62)">
                <circle cx="-9" cy="0" r="7" fill="url(#silverGloss)"/>
                <circle cx="9" cy="0" r="7" fill="url(#silverGloss)"/>
                <circle cx="0" cy="-9" r="7" fill="url(#silverGloss)"/>
                <circle cx="0" cy="9" r="7" fill="url(#silverGloss)"/>
                <circle cx="0" cy="0" r="3" fill="#FFFFFF"/>
              </g>
              <g transform="translate(62, 62)">
                <circle cx="-9" cy="0" r="7" fill="url(#silverGloss)"/>
                <circle cx="9" cy="0" r="7" fill="url(#silverGloss)"/>
                <circle cx="0" cy="-9" r="7" fill="url(#silverGloss)"/>
                <circle cx="0" cy="9" r="7" fill="url(#silverGloss)"/>
                <circle cx="0" cy="0" r="3" fill="#FFFFFF"/>
              </g>
              <g transform="translate(15, 82) rotate(15)">
                <rect x="-18" y="-18" width="36" height="36" rx="4" fill="url(#purpleGem)" stroke="#FFFFFF" strokeWidth="2"/>
                <polygon points="0,-18 18,0 0,18 -18,0" fill="#FFFFFF" opacity="0.3"/>
                <polygon points="-6,-6 6,-6 6,6 -6,6" fill="#FFFFFF" opacity="0.5"/>
              </g>
            </g>
          </svg>
        </div>
      );

    case "ring-snake":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-emerald-50/30 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="silverSnake" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>
              <linearGradient id="greenEye" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52C41A" />
                <stop offset="100%" stopColor="#096DD9" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150) rotate(-20)">
              <ellipse cx="0" cy="15" rx="80" ry="50" fill="none" stroke="url(#silverSnake)" strokeWidth="22" strokeLinecap="round"/>
              <ellipse cx="0" cy="-10" rx="70" ry="42" fill="none" stroke="url(#silverSnake)" strokeWidth="18" strokeLinecap="round"/>
              <g transform="translate(60, -35) rotate(35)">
                <polygon points="-12,-15 18,-20 30,5 5,12 -12,-5" fill="url(#silverSnake)" stroke="#475569" strokeWidth="1"/>
                <circle cx="10" cy="-5" r="3.5" fill="url(#greenEye)"/>
                <polygon points="12,-12 24,-15 22,-8" fill="#FFFFFF" opacity="0.8"/>
              </g>
              {Array.from({ length: 14 }).map((_, idx) => (
                <circle key={idx} cx={-50 + idx * 7} cy={idx % 2 === 0 ? 10 : 18} r="2.5" fill="#FFFFFF" stroke="#64748b" strokeWidth="0.5"/>
              ))}
            </g>
          </svg>
        </div>
      );

    case "ring-men-black":
    case "bracelet-gold-men":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-amber-50/40 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="goldCarve" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFDF73" />
                <stop offset="50%" stopColor="#D49419" />
                <stop offset="100%" stopColor="#8C5804" />
              </linearGradient>
              <linearGradient id="blackOnyx" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#434343" />
                <stop offset="60%" stopColor="#000000" />
                <stop offset="100%" stopColor="#1f1f1f" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150) rotate(-10)">
              <ellipse cx="0" cy="25" rx="82" ry="55" fill="none" stroke="url(#goldCarve)" strokeWidth="32" strokeLinecap="square"/>
              <path d="M -75 25 Q -65 -10 -40 -35 L 40 -35 Q 65 -10 75 25" fill="url(#goldCarve)" stroke="#573801" strokeWidth="2"/>
              <rect x="-42" y="-55" width="84" height="60" rx="14" fill="url(#blackOnyx)" stroke="url(#goldCarve)" strokeWidth="5"/>
              <circle cx="0" cy="-25" r="18" fill="none" stroke="#FFDF73" strokeWidth="2.5"/>
              <path d="M -10 -25 Q 0 -35 10 -25 Q 0 -15 -10 -25" fill="#FFDF73"/>
              <polygon points="0,-35 4,-28 -4,-28" fill="#FFF"/>
            </g>
          </svg>
        </div>
      );

    case "necklace-emerald":
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-emerald-50/50 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52C41A" />
                <stop offset="40%" stopColor="#13C2C2" />
                <stop offset="80%" stopColor="#0050B3" />
                <stop offset="100%" stopColor="#87E8DE" />
              </linearGradient>
              <linearGradient id="goldPave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="100%" stopColor="#D49419" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150)">
              <path d="M -90 -60 Q 0 80 90 -60" fill="none" stroke="url(#goldPave)" strokeWidth="6" strokeLinecap="round"/>
              <g transform="translate(0, 35)">
                <path d="M 0 -24 C 18 -10 24 10 0 35 C -24 10 -18 -10 0 -24 Z" fill="url(#emeraldGrad)" stroke="url(#goldPave)" strokeWidth="3"/>
                <circle cx="0" cy="-28" r="4.5" fill="url(#goldPave)"/>
                <polygon points="0,-10 8,8 0,22 -8,8" fill="#FFFFFF" opacity="0.4"/>
              </g>
              <g transform="translate(-75, -50)">
                <circle cx="0" cy="0" r="10" fill="url(#emeraldGrad)" stroke="url(#goldPave)" strokeWidth="2"/>
              </g>
              <g transform="translate(75, -50)">
                <circle cx="0" cy="0" r="10" fill="url(#emeraldGrad)" stroke="url(#goldPave)" strokeWidth="2"/>
              </g>
            </g>
          </svg>
        </div>
      );

    case "loose-diamond":
    case "diamond-set":
    case "wedding-rings":
    case "earrings-heart":
    case "pendant-female":
    case "pendant-male":
    default:
      return (
        <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-emerald-50/20 rounded-2xl ${className}`}>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
            <defs>
              <linearGradient id="diamondSpark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#E6F7FF" />
                <stop offset="50%" stopColor="#BAE7FF" />
                <stop offset="75%" stopColor="#D3ADF7" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <g transform="translate(150,150)">
              <circle cx="0" cy="0" r="95" fill="url(#diamondSpark)" stroke="#bfbfbf" strokeWidth="1"/>
              <polygon points="0,-48 34,-34 48,0 34,34 0,48 -34,34 -48,0 -34,-34" fill="#FFFFFF" stroke="#8c8c8c" strokeWidth="1.5" opacity="0.95"/>
              {Array.from({ length: 8 }).map((_, i) => {
                const a1 = (i * 45 * Math.PI) / 180;
                const a2 = ((i + 1) * 45 * Math.PI) / 180;
                const rOuter = 95;
                const rInner = 48;
                const x1 = rOuter * Math.cos(a1);
                const y1 = rOuter * Math.sin(a1);
                const x2 = rOuter * Math.cos(a2);
                const y2 = rOuter * Math.sin(a2);
                const xi = rInner * Math.cos(a1);
                const yi = rInner * Math.sin(a1);
                return (
                  <g key={i}>
                    <line x1={0} y1={0} x2={x1} y2={y1} stroke="#595959" strokeWidth="0.8" opacity="0.7"/>
                    <line x1={xi} y1={yi} x2={x2} y2={y2} stroke="#8c8c8c" strokeWidth="0.8"/>
                    <polygon points={`0,0 ${x1},${y1} ${x2},${y2}`} fill="#FFFFFF" opacity={i % 2 === 0 ? "0.2" : "0.4"}/>
                  </g>
                );
              })}
              <path d="M 0 -25 L 5 -5 L 25 0 L 5 5 L 0 25 L -5 5 L -25 0 L -5 -5 Z" fill="#FFFFFF" opacity="0.9"/>
            </g>
          </svg>
        </div>
      );
  }
}
