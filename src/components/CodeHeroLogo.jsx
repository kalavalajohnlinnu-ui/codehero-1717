import React from 'react';

/**
 * CodeHero 2.0 Brand Logo
 * High-craft geometric shield mark with code brackets and heroic apex.
 */
export function CodeHeroLogoMark({ size = 32, className = '' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ch-bg-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="ch-glyph-grad" x1="10" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <filter id="ch-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E40AF" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="10"
        fill="url(#ch-bg-grad)"
        stroke="#60A5FA"
        strokeWidth="1.2"
        filter="url(#ch-shadow)"
      />

      {/* Hero Crown Apex / Star */}
      <path
        d="M20 7.5L22 11.5L26 12L23 15L24 19L20 17L16 19L17 15L14 12L18 11.5L20 7.5Z"
        fill="#FDE047"
        opacity="0.95"
      />

      {/* Left Code Bracket < */}
      <path
        d="M14.5 19L10 23.5L14.5 28"
        stroke="url(#ch-glyph-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Code Bracket > */}
      <path
        d="M25.5 19L30 23.5L25.5 28"
        stroke="url(#ch-glyph-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Hero Slash / Spark */}
      <path
        d="M21.5 18L18.5 29"
        stroke="#93C5FD"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CodeHeroLogo({ size = 32, showText = true, subtitle = '7 Languages', className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <CodeHeroLogoMark size={size} />
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <div className="font-mono font-black text-sm tracking-tight leading-none text-slate-900 flex items-center gap-1.5">
            <span>CODEHERO</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-700 leading-none">
              2.0
            </span>
          </div>
          {subtitle && (
            <div className="text-[9px] font-mono uppercase tracking-wider mt-0.5 text-slate-400 font-semibold leading-tight">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
