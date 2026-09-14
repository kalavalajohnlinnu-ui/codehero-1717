import React from 'react';

/**
 * Official Programming Language Logos
 * High-definition vector SVGs rendered with official brand colors and geometry.
 */
export function LanguageLogo({ languageId, className = 'w-5 h-5', size = 20, showBadge = false }) {
  const lang = (languageId || 'python').toLowerCase();

  switch (lang) {
    case 'python':
    case 'py':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="py-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#387EB8" />
              <stop offset="100%" stopColor="#366994" />
            </linearGradient>
            <linearGradient id="py-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE873" />
              <stop offset="100%" stopColor="#FFD43B" />
            </linearGradient>
          </defs>
          <path
            fill="url(#py-blue)"
            d="M63.7 7.5c-13.8 0-23 5.9-23 17.3v12.8h23.5v3.4H30.7C19.2 41 12.3 50.7 12.3 64.4c0 13.9 6.8 23.5 18.4 23.5h10.9V72.5c0-11.8 9.3-21.6 22.2-21.6h23.5v-3.4H63.7V31.6h23.5c11.6 0 17.3-6.5 17.3-17.3 0-10.8-5.8-6.8-17.3-6.8H63.7zm-9.5 7.6c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1 2.3-5.1 5.1-5.1z"
          />
          <path
            fill="url(#py-yellow)"
            d="M64.3 120.5c13.8 0 23-5.9 23-17.3V90.4H63.8V87h33.5c11.5 0 18.4-9.7 18.4-23.5 0-13.9-6.8-23.5-18.4-23.5H86.4v15.4c0 11.8-9.3 21.6-22.2 21.6H40.7v3.4h23.5v15.9H40.7c-11.6 0-17.3 6.5-17.3 17.3 0 10.8 5.8 7.4 17.3 7.4h23.6zm9.5-7.6c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"
          />
        </svg>
      );

    case 'javascript':
    case 'js':
    case 'typescript':
    case 'ts':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 rounded-[4px] ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="128" height="128" rx="16" fill="#F7DF1E" />
          <path
            fill="#000000"
            d="M38.5 106.8c-2.2 1.3-5 2.2-8.6 2.2-10 0-16-6.3-16-17.5V63.5h10v28c0 7.2 3.2 10.7 8.7 10.7 2.3 0 4-.5 5.2-1.1l.7 5.7zm28.3-1.8c-5.8 2.8-13.4 4.1-20.6 4.1-17.4 0-26.2-9.4-26.2-22.4 0-13.7 9.1-21.6 25-27.2l4.3-1.6c9.6-3.5 14-6.6 14-12.2 0-5.9-4.7-9.8-12.8-9.8-7.8 0-14.3 3.2-18.6 6.6l-4.8-7.7c6.1-4.7 14.8-8.2 24.5-8.2 15.4 0 22.7 8.5 22.7 19.6 0 12.4-8.3 20.2-23.3 25.6l-4.3 1.6c-10.2 3.6-15.4 7-15.4 13.3 0 6.7 5.2 11.3 15.1 11.3 7.2 0 13.8-2.4 18-5.3l4.5 8.9z"
          />
        </svg>
      );

    case 'html':
    case 'css':
    case 'html5':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="html-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E44D26" />
              <stop offset="100%" stopColor="#F16529" />
            </linearGradient>
          </defs>
          <path fill="url(#html-grad)" d="M19 13.5l9 101 36 10 36-10 9-101H19z" />
          <path fill="#E44D26" d="M64 121.5l33-9.2 8.3-92.8H64v102z" />
          <path fill="#EBEBEB" d="M64 36.3H36.3l2 22.8H64V36.3zm0 39.8H48.9l1.3 15.1 13.8 3.8v16.7l-26.6-7.4-2.8-31.5H64v3.3z" />
          <path fill="#FFFFFF" d="M63.9 36.3h27.8l-2.6 28.5H63.9v-5.7zm0 39.8h15.1l-1.4 15.1-13.7 3.8v16.7l26.6-7.4 3.7-41.5H63.9v13.3z" />
        </svg>
      );

    case 'sql':
    case 'database':
    case 'postgresql':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sql-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#336791" />
              <stop offset="100%" stopColor="#00758F" />
            </linearGradient>
          </defs>
          <rect width="128" height="128" rx="20" fill="url(#sql-grad)" />
          {/* Top Database Cylinder */}
          <ellipse cx="64" cy="36" rx="36" ry="12" fill="#FFFFFF" opacity="0.95" />
          <ellipse cx="64" cy="36" rx="34" ry="10" fill="#E2E8F0" />
          
          {/* Middle Cylinder Layer */}
          <path
            d="M28 36v24c0 6.6 16.1 12 36 12s36-5.4 36-12V36"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Bottom Cylinder Layer */}
          <path
            d="M28 64v24c0 6.6 16.1 12 36 12s36-5.4 36-12V64"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* SQL Text pill */}
          <rect x="36" y="98" width="56" height="18" rx="6" fill="#F8FAFC" />
          <text x="64" y="111" fill="#00758F" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            SQL
          </text>
        </svg>
      );

    case 'c':
    case 'cpp':
    case 'c++':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cpp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00599C" />
              <stop offset="100%" stopColor="#004482" />
            </linearGradient>
          </defs>
          {/* Official ISO Hexagon */}
          <polygon
            points="64,10 114,37 114,91 64,118 14,91 14,37"
            fill="url(#cpp-grad)"
          />
          <polygon
            points="64,16 108,40 108,88 64,112 20,88 20,40"
            fill="#00599C"
          />
          {/* Letter C */}
          <path
            d="M58 45c-15 0-23 9-23 21s8 21 23 21c6 0 12-2 16-5l-4-9c-3 2-7 3-11 3-8 0-12-5-12-10s4-10 12-10c4 0 8 1 11 3l4-9c-4-3-10-5-16-5z"
            fill="#FFFFFF"
          />
          {/* Plus Sign 1 */}
          <path d="M78 57h5v6h-5v5h-6v-5h-5v-6h5v-5h6v5z" fill="#0086E6" />
          <path d="M77 58h3v4h-3v4h-4v-4h-4v-4h4v-4h4v4z" fill="#FFFFFF" />
          {/* Plus Sign 2 */}
          <path d="M96 57h5v6h-5v5h-6v-5h-5v-6h5v-5h6v5z" fill="#0086E6" />
          <path d="M95 58h3v4h-3v4h-4v-4h-4v-4h4v-4h4v4z" fill="#FFFFFF" />
        </svg>
      );

    case 'java':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="128" height="128" rx="20" fill="#FFFFFF" />
          <rect width="128" height="128" rx="20" fill="#EA2D2E" opacity="0.06" />
          {/* Rising Steam Curves */}
          <path
            d="M54 22c5 6-2 12-2 18s8 8 12 12c-5-8 1-13 1-18s-11-8-11-12z"
            fill="#5382A1"
          />
          <path
            d="M66 16c6 8-3 15-3 22s10 10 15 15c-6-10 1-16 1-22s-13-10-13-15z"
            fill="#E76F00"
          />
          {/* Coffee Cup Body */}
          <path
            d="M34 68c0 14 10 24 26 25h12c16-1 26-11 26-25v-4H34v4z"
            fill="#5382A1"
          />
          {/* Cup Handle */}
          <path
            d="M98 68c8 0 14 4 14 11s-6 11-14 11v-4c5 0 9-3 9-7s-4-7-9-7v-4z"
            fill="#EA2D2E"
          />
          {/* Coffee Saucer Base */}
          <path
            d="M26 98c0 6 18 10 38 10s38-4 38-10H26z"
            fill="#E76F00"
          />
        </svg>
      );

    case 'rust':
      return (
        <svg
          viewBox="0 0 128 128"
          className={`inline-block shrink-0 ${className}`}
          style={{ width: size, height: size }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          {/* Cogwheel teeth */}
          <g fill="url(#rust-grad)">
            <circle cx="64" cy="64" r="50" />
            {/* Gear teeth around perimeter */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <rect
                key={deg}
                x="59"
                y="8"
                width="10"
                height="12"
                rx="2"
                transform={`rotate(${deg} 64 64)`}
              />
            ))}
          </g>
          {/* Outer ring cutout */}
          <circle cx="64" cy="64" r="42" fill="#FFFFFF" />
          <circle cx="64" cy="64" r="38" fill="#1C1917" />
          {/* Inner Decorative Holes */}
          <circle cx="44" cy="64" r="4" fill="#FFFFFF" />
          <circle cx="64" cy="44" r="4" fill="#FFFFFF" />
          <circle cx="84" cy="64" r="4" fill="#FFFFFF" />
          {/* Bold Stylized Rust "R" */}
          <path
            d="M48 44h18c8 0 14 4 14 12 0 6-4 10-9 11l11 17H70L60 68h-4v16H48V44zm8 16h9c4 0 7-2 7-5s-3-5-7-5h-9v10z"
            fill="#FFFFFF"
          />
        </svg>
      );

    default:
      return (
        <span className={`inline-block text-center ${className}`} style={{ fontSize: size * 0.8 }}>
          💻
        </span>
      );
  }
}
