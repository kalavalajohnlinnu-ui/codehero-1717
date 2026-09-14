import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { LANGUAGES } from '../data/languages/registry';
import { LanguageLogo } from './LanguageLogo';
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
        type="button"
        onClick={() => {
          soundService.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-sky-400 text-slate-800 transition-all shadow-xs group cursor-pointer active:scale-95"
        title="Click to switch programming language"
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <LanguageLogo languageId={currentLang.id} size={20} className="w-5 h-5" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-none flex items-center gap-1.5 text-slate-900">
            <span>{currentLang.name}</span>
            <span className="text-[9px] font-mono text-sky-700 bg-sky-50 border border-sky-200 px-1 py-0.2 rounded font-semibold">
              {currentLang.badge}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Language Selection Modal / Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-76 sm:w-84 bg-white border border-slate-200 rounded-3xl p-3 shadow-2xl z-50 animate-fade-in backdrop-blur-xl">
          <div className="px-2 pb-2.5 mb-1.5 text-slate-600 text-xs font-bold flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>Choose Your Language Track</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              7 Languages
            </span>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto pr-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.id === currentLanguageId;
              const completedCount = completedByLanguage[lang.id]?.length || 0;
              const totalQuests = lang.curriculum.flatMap(m => m.lessons).length;

              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleSelect(lang.id)}
                  className={`
                    w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer active:scale-[0.98]
                    ${isSelected 
                      ? 'bg-sky-50/80 border border-sky-200 text-sky-950 shadow-2xs' 
                      : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Official Language Logo */}
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                      <LanguageLogo languageId={lang.id} size={22} className="w-5.5 h-5.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{lang.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                          {lang.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px] sm:max-w-[170px]">
                        {lang.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pl-2">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shadow-2xs">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
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
