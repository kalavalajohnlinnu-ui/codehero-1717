import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { MascotAvatar } from './mascots/MascotAvatar';
import { soundService } from '../services/soundService';

export function LanguageSelector({
  currentLanguageId,
  onSelectLanguage,
  completedByLanguage = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.id === currentLanguageId) || LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langId) => {
    soundService.playClick();
    onSelectLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Language Pill */}
      <button
        onClick={() => {
          soundService.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-sky-500/50 text-slate-100 transition-all shadow-md group"
        title="Click to switch programming language"
      >
        <span className="text-base group-hover:scale-110 transition-transform">
          {currentLang.icon}
        </span>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-none flex items-center gap-1">
            <span>{currentLang.name}</span>
            <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-1 py-0.2 rounded font-normal">
              {currentLang.mascotName}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Language Selection Modal / Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-slate-950 border border-slate-800 rounded-3xl p-2.5 shadow-2xl z-50 animate-fade-in backdrop-blur-xl divide-y divide-slate-800/60">
          <div className="px-3 py-2 text-slate-400 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Choose Your Language Realm</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">8 Languages</span>
          </div>

          <div className="pt-1.5 space-y-1 max-h-96 overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.id === currentLanguageId;
              const completedCount = completedByLanguage[lang.id]?.length || 0;
              const totalQuests = lang.curriculum.flatMap(m => m.lessons).length;

              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang.id)}
                  className={`
                    w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all
                    ${isSelected 
                      ? 'bg-gradient-to-r from-sky-500/20 to-emerald-500/10 border border-sky-500/40 text-white shadow-sm' 
                      : 'hover:bg-slate-900 border border-transparent text-slate-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 text-lg border border-slate-800">
                      {lang.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{lang.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {lang.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-[170px]">
                        Companion: {lang.mascotName} • {lang.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pl-1">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {completedCount}/{totalQuests}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
