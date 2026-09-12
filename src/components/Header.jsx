import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Smile, 
  Code2, 
  Star,
  BookOpen
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { soundService } from '../services/soundService';

export function Header({
  currentLanguageId,
  onSelectLanguage,
  completedByLanguage = {},
  totalXP,
  completedCount,
  totalLessons,
  streak,
  isHeroMode,
  onToggleHeroMode,
  onOpenCheatsheet,
  onOpenSandbox,
  onResetProgress,
  wasmStatus
}) {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());

  let level = "Apprentice Hero";
  let stars = 1;
  if (totalXP >= 600) {
    level = "Code Wizard";
    stars = 5;
  } else if (totalXP >= 300) {
    level = "Grandmaster";
    stars = 4;
  } else if (totalXP >= 100) {
    level = "Hero Coder";
    stars = 3;
  } else if (totalXP >= 25) {
    level = "Junior Coder";
    stars = 2;
  }

  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  const handleToggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    if (!muted) soundService.playClick();
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-3 sm:px-4 py-2 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: App Logo & Language Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-sky-400 to-amber-300 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-lg select-none">
              👑
            </div>
          </div>
          <div>
            <h1 className="font-black tracking-tight text-white text-sm sm:text-base leading-none flex items-center gap-1.5">
              <span>Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Hero</span></span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold uppercase">
                Universe
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 hidden sm:block">
              Zero to Hero in All Languages
            </p>
          </div>

          {/* Language Selector Dropdown */}
          <div className="ml-1 sm:ml-2">
            <LanguageSelector
              currentLanguageId={currentLanguageId}
              onSelectLanguage={onSelectLanguage}
              completedByLanguage={completedByLanguage}
            />
          </div>
        </div>

        {/* Center: Hero Telemetry (XP, Stars, Streak, Progress) */}
        <div className="hidden xl:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-800">
            <div className="flex items-center text-amber-400 text-xs font-bold">
              {Array.from({ length: Math.min(stars, 3) }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 -ml-0.5 first:ml-0" />
              ))}
            </div>
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Rank</div>
              <div className="text-xs font-bold text-amber-300">{level}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Experience</div>
              <div className="text-xs font-mono font-bold text-sky-300">{totalXP} XP</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-800">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">Streak</div>
              <div className="text-xs font-mono font-bold text-orange-400">{streak} Day{streak > 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="flex items-center justify-between gap-2 text-[9px] uppercase font-mono text-slate-400">
                <span>Quests</span>
                <span className="text-emerald-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher */}
          <button
            onClick={() => {
              soundService.playClick();
              onToggleHeroMode();
            }}
            className={`
              flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all
              ${isHeroMode 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-sm' 
                : 'bg-slate-900 border-slate-800 text-slate-300'
              }
            `}
            title={isHeroMode ? "Switch to Pro Studio mode" : "Switch to Kid Hero mode"}
          >
            {isHeroMode ? (
              <>
                <Smile className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Kid Hero</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Pro Mode</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
            title={isMuted ? "Turn sound on" : "Mute sound effects"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Sandbox Button */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSandbox();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-colors shadow-sm"
            title="Freeform coding playground"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="hidden sm:inline">Sandbox</span>
          </button>

          {/* Cheatsheet Button */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenCheatsheet();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-colors shadow-sm"
            title="Quick syntax reference"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Cheat Sheet</span>
          </button>

          {/* Reset progress */}
          <button
            onClick={() => {
              soundService.playClick();
              if (window.confirm("Reset all quest progress and XP for this language?")) {
                onResetProgress();
              }
            }}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="Reset all progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
