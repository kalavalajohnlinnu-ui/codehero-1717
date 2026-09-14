import React from 'react';

/**
 * INGENIUM Brand Logo Mark
 * The architectural monolith 'I' with code chevrons < > and the radiant spark of genius.
 */
export function IngeniumLogoMark({ size = 32, className = '', theme = 'auto' }) {
  // theme can be 'dark', 'light', 'gold', or 'auto'
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={`inline-block shrink-0 select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ing-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="ing-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FCD34D" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="ing-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="ing-plat-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>

      {/* Squircle Housing with Gold Hairline */}
      <rect
        x="4"
        y="4"
        width="120"
        height="120"
        rx="30"
        fill="url(#ing-bg-grad)"
        stroke="url(#ing-gold-grad)"
        strokeWidth="2.5"
      />
      
      {/* Precision dashed inner grid line */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="26"
        stroke="#38BDF8"
        strokeWidth="0.75"
        strokeOpacity="0.35"
        strokeDasharray="6 4"
      />

      {/* Architectural 'I' Capital Header */}
      <path d="M42 27h44v7H42z" fill="url(#ing-gold-grad)" />
      <path d="M50 34h28v4H50z" fill="url(#ing-plat-grad)" opacity="0.85" />

      {/* Left Code Chevron Wing < */}
      <path d="M38 48L24 64l14 16h8L32 64l14-16h-8z" fill="url(#ing-cyan-grad)" />

      {/* Right Code Chevron Wing > */}
      <path d="M90 48l14 16-14 16h-8l14-16-14-16h8z" fill="url(#ing-cyan-grad)" />

      {/* Central Monolith Shaft */}
      <path d="M58 40h12v48H58z" fill="url(#ing-plat-grad)" />
      <path d="M62 40h4v48h-4z" fill="#FFFFFF" />

      {/* Radiant Core Genius Gem */}
      <g transform="translate(64, 64)">
        <circle r="9" fill="#0F172A" stroke="url(#ing-gold-grad)" strokeWidth="1.8" />
        <path d="M0 -7.2L1.9 -2.2L7.2 0L1.9 2.2L0 7.2L-1.9 2.2L-7.2 0L-1.9 -2.2Z" fill="url(#ing-gold-grad)" />
        <circle r="2" fill="#FFFFFF" />
      </g>

      {/* Architectural 'I' Base Plinth */}
      <path d="M50 88h28v4H50z" fill="url(#ing-plat-grad)" opacity="0.85" />
      <path d="M42 92h44v7H42z" fill="url(#ing-gold-grad)" />
    </svg>
  );
}

/**
 * INGENIUM Full Brand Logo (Mark + Typography)
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
              className={`font-mono font-black text-sm tracking-[0.2em] uppercase ${
                isLightText ? 'text-white' : 'text-slate-900'
              }`}
            >
              INGENIUM
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold leading-none">
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
