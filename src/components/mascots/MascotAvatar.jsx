import React from 'react';

export function MascotAvatar({
  mascotType = 'dragon',
  mood = 'idle',
  className = 'w-16 h-16'
}) {
  switch (mascotType) {
    // 1. Sparky the Cyber Fox (JavaScript / TypeScript)
    case 'fox':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#FACC15" fillOpacity="0.15" />
          {/* Fox Ears */}
          <polygon points="24,45 18,18 42,32" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
          <polygon points="26,38 22,24 38,32" fill="#FED7AA" />
          <polygon points="76,45 82,18 58,32" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
          <polygon points="74,38 78,24 62,32" fill="#FED7AA" />
          {/* Fox Head */}
          <polygon points="24,45 76,45 50,82" fill="#FB923C" />
          <polygon points="32,45 68,45 50,75" fill="#FFF7ED" />
          {/* Eyes */}
          <circle cx="38" cy="46" r="4.5" fill="#0F172A" />
          <circle cx="62" cy="46" r="4.5" fill="#0F172A" />
          <circle cx="36.5" cy="44.5" r="1.5" fill="white" />
          <circle cx="60.5" cy="44.5" r="1.5" fill="white" />
          {/* Nose */}
          <polygon points="47,70 53,70 50,75" fill="#0F172A" />
          {/* Lightning Bolt on Forehead */}
          <path d="M 51 30 L 46 38 L 51 38 L 47 46 L 55 36 L 50 36 Z" fill="#FACC15" stroke="#EAB308" strokeWidth="0.8" />
          {/* Detective Cap */}
          {mood === 'detective' && (
            <g transform="translate(0, -6)">
              <ellipse cx="50" cy="26" rx="24" ry="6" fill="#78350F" />
              <path d="M 32 26 C 32 16, 68 16, 68 26 Z" fill="#B45309" />
            </g>
          )}
        </svg>
      );

    // 2. Pixie the Artist Cat (HTML & CSS)
    case 'cat':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#FB923C" fillOpacity="0.15" />
          {/* Cat Ears */}
          <polygon points="26,42 22,18 42,28" fill="#F43F5E" />
          <polygon points="28,36 26,24 38,30" fill="#FECDD3" />
          <polygon points="74,42 78,18 58,28" fill="#F43F5E" />
          <polygon points="72,36 74,24 62,30" fill="#FECDD3" />
          {/* Cat Head */}
          <circle cx="50" cy="50" r="26" fill="#FB7185" />
          {/* Eyes */}
          <ellipse cx="39" cy="48" rx="4.5" ry="6" fill="#0F172A" />
          <ellipse cx="61" cy="48" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="37.5" cy="46" r="2" fill="white" />
          <circle cx="59.5" cy="46" r="2" fill="white" />
          {/* Nose & Whiskers */}
          <polygon points="48,58 52,58 50,61" fill="#881337" />
          <line x1="22" y1="55" x2="34" y2="57" stroke="#881337" strokeWidth="1.5" />
          <line x1="22" y1="62" x2="34" y2="60" stroke="#881337" strokeWidth="1.5" />
          <line x1="78" y1="55" x2="66" y2="57" stroke="#881337" strokeWidth="1.5" />
          <line x1="78" y1="62" x2="66" y2="60" stroke="#881337" strokeWidth="1.5" />
          {/* Beret Hat */}
          <ellipse cx="44" cy="26" rx="16" ry="8" fill="#6366F1" transform="rotate(-15 44 26)" />
          <circle cx="42" cy="18" r="2" fill="#818CF8" />
        </svg>
      );

    // 3. Shelldon the Vault Turtle (SQL Database)
    case 'turtle':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#A855F7" fillOpacity="0.15" />
          {/* Shell with database cylinder layers */}
          <ellipse cx="50" cy="54" rx="30" ry="22" fill="#10B981" stroke="#047857" strokeWidth="2" />
          <line x1="26" y1="52" x2="74" y2="52" stroke="#047857" strokeWidth="2" />
          <line x1="30" y1="60" x2="70" y2="60" stroke="#047857" strokeWidth="2" />
          {/* Turtle Head */}
          <ellipse cx="50" cy="28" rx="14" ry="12" fill="#34D399" />
          <circle cx="44" cy="26" r="2.5" fill="#0F172A" />
          <circle cx="56" cy="26" r="2.5" fill="#0F172A" />
          <circle cx="43" cy="25" r="1" fill="white" />
          <circle cx="55" cy="25" r="1" fill="white" />
          <path d="M 46 33 Q 50 36, 54 33" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
          {/* Glasses on Turtle */}
          <circle cx="44" cy="26" r="5" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="56" cy="26" r="5" stroke="#D97706" strokeWidth="1.5" />
          <line x1="49" y1="26" x2="51" y2="26" stroke="#D97706" strokeWidth="1.5" />
        </svg>
      );

    // 4. Geary the Clockwork Golem (C / C++)
    case 'golem':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#3B82F6" fillOpacity="0.15" />
          {/* Golem Robot Head */}
          <rect x="30" y="28" width="40" height="36" rx="10" fill="#64748B" stroke="#334155" strokeWidth="2" />
          {/* Gear Antenna */}
          <line x1="50" y1="28" x2="50" y2="16" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="50" cy="14" r="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          {/* Glowing Eyes */}
          <rect x="38" y="38" width="8" height="8" rx="2" fill="#38BDF8" />
          <rect x="54" y="38" width="8" height="8" rx="2" fill="#38BDF8" />
          {/* Digital Mouth */}
          <rect x="42" y="52" width="16" height="3" rx="1" fill="#38BDF8" />
          {/* Bolts */}
          <circle cx="27" cy="46" r="3" fill="#94A3B8" />
          <circle cx="73" cy="46" r="3" fill="#94A3B8" />
        </svg>
      );

    // 5. Beany the Coffee Owl (Java)
    case 'owl':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#F43F5E" fillOpacity="0.15" />
          {/* Owl Body */}
          <ellipse cx="50" cy="54" rx="26" ry="28" fill="#78350F" />
          <ellipse cx="50" cy="58" rx="16" ry="18" fill="#FED7AA" />
          {/* Ear Tufts */}
          <polygon points="28,32 34,18 42,30" fill="#92400E" />
          <polygon points="72,32 66,18 58,30" fill="#92400E" />
          {/* Big Owl Eyes */}
          <circle cx="40" cy="42" r="9" fill="white" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="60" cy="42" r="9" fill="white" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="40" cy="42" r="5" fill="#0F172A" />
          <circle cx="60" cy="42" r="5" fill="#0F172A" />
          <circle cx="38" cy="40" r="1.5" fill="white" />
          <circle cx="58" cy="40" r="1.5" fill="white" />
          {/* Beak */}
          <polygon points="47,48 53,48 50,54" fill="#F59E0B" />
        </svg>
      );

    // 6. Ferris the Friendly Crab (Rust)
    case 'crab':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#EF4444" fillOpacity="0.15" />
          {/* Crab Body */}
          <ellipse cx="50" cy="54" rx="24" ry="18" fill="#EF4444" />
          {/* Eyes on stalks */}
          <line x1="42" y1="40" x2="40" y2="30" stroke="#DC2626" strokeWidth="3" />
          <line x1="58" y1="40" x2="60" y2="30" stroke="#DC2626" strokeWidth="3" />
          <circle cx="40" cy="28" r="4.5" fill="white" />
          <circle cx="60" cy="28" r="4.5" fill="white" />
          <circle cx="40" cy="28" r="2.5" fill="#0F172A" />
          <circle cx="60" cy="28" r="2.5" fill="#0F172A" />
          {/* Crab Claws */}
          <path d="M 26 50 C 14 42, 10 26, 22 24 C 26 36, 30 46, 26 50 Z" fill="#EF4444" />
          <path d="M 74 50 C 86 42, 90 26, 78 24 C 74 36, 70 46, 74 50 Z" fill="#EF4444" />
          {/* Smile */}
          <path d="M 44 56 Q 50 62, 56 56" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // Default: Pythie the Dragon (Python)
    default:
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`} fill="none">
          <circle cx="50" cy="50" r="42" fill="#38BDF8" fillOpacity="0.2" />
          <path d="M 25 78 C 25 60, 32 35, 50 35 C 68 35, 75 60, 75 78 Z" fill="#10B981" />
          <path d="M 38 78 C 38 65, 42 48, 50 48 C 58 48, 62 65, 62 78 Z" fill="#FEF08A" />
          <circle cx="50" cy="42" r="22" fill="#34D399" />
          <circle cx="42" cy="41" r="5" fill="#0F172A" />
          <circle cx="58" cy="41" r="5" fill="#0F172A" />
          <circle cx="40.5" cy="39" r="1.8" fill="white" />
          <circle cx="56.5" cy="39" r="1.8" fill="white" />
          <path d="M 44 50 Q 50 56, 56 50" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}
