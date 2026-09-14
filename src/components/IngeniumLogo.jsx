import React from 'react';

/**
 * INGENIUM Pure Vector Brand Logo
 * Human-crafted 2D mathematical mark:
 * Classical Roman column 'I' flanked by code syntax chevrons < > with a diamond core.
 * Clean, flat, timeless — zero AI gloss, zero fake 3D.
 */
export function IngeniumLogoMark({ size = 32, className = '', variant = 'auto' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`inline-block shrink-0 select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sleek Housing Squircle */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#0A0E17"
        stroke="#FCD34D"
        strokeWidth="2"
        strokeOpacity="0.75"
      />

      {/* Left Code Chevron < (Cyan Logic Flow) */}
      <path
        d="M30 33L17 50l13 17"
        stroke="#38BDF8"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Roman Architectural Capital Header */}
      <path
        d="M42 25h16"
        stroke="#FCD34D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Central Monolith Shaft 'I' (Platinum Solid Logic) */}
      <path
        d="M50 25v50"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Center Genius Diamond Spark */}
      <polygon
        points="50,45 55,50 50,55 45,50"
        fill="#FCD34D"
      />

      {/* Roman Architectural Base Plinth */}
      <path
        d="M42 75h16"
        stroke="#FCD34D"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Right Code Chevron > (Cyan Logic Flow) */}
      <path
        d="M70 33l13 17-13 17"
        stroke="#38BDF8"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * INGENIUM Full Brand Wordmark
 */
export function IngeniumLogo({
  size = 32,
  showText = true,
  subtitle = 'Academy of Code',
  variant = 'dark', // 'dark' (for white surfaces) or 'light' (for black surfaces)
  className = ''
}) {
  const isLightText = variant === 'light';

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <IngeniumLogoMark size={size} />
      {showText && (
        <div className="flex flex-col justify-center select-none">
          <div className="flex items-center gap-2 leading-none">
            <span
              className={`font-mono font-black text-sm tracking-[0.22em] uppercase ${
                isLightText ? 'text-white' : 'text-slate-900'
              }`}
            >
              INGENIUM
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 font-bold leading-none">
              PRO
            </span>
          </div>
          {subtitle && (
            <div
              className={`text-[9px] font-mono uppercase tracking-[0.18em] mt-1 font-semibold leading-tight ${
                isLightText ? 'text-white/60' : 'text-slate-400'
              }`}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IngeniumLogo;
