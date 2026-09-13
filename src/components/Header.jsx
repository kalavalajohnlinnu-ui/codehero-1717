import React, { useState } from 'react';
import { 
  Flame, 
  RotateCcw, 
  Play, 
  Volume2, 
  VolumeX, 
  Smile, 
  Code2, 
  BookOpen,
  HelpCircle,
  Zap,
  Sword,
  Search,
  Timer,
  Hammer,
  Sparkles,
  ExternalLink,
  Award,
  Lock
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { soundService } from '../services/soundService';
import { getLevelProgress } from '../services/gameEngine';
import { progressionService } from '../services/progressionService';

export function Header({
  currentLanguageId,
  onSelectLanguage,
  completedByLanguage = {},
  totalXP = 0,
  completedCount = 0,
  totalLessons = 1,
  streak = 1,
  isHeroMode = true,
  onToggleHeroMode,
  onOpenCheatsheet,
  onOpenSandbox,
  onResetProgress,
  wasmStatus,
  currentGameMode = 'lessons',
  onSelectGameMode,
  onOpenRoadmap,
  onOpenNotes,
  onOpenExam,
  onOpenModeLocked
}) {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const prog = getLevelProgress(totalXP);
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  const handleToggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    if (!muted) soundService.playClick();
  };

  const modes = [
    { id: 'lessons', label: 'Core Quests', icon: Zap, count: '631' },
    { id: 'arena', label: 'Algorithm Arena', icon: Sword, count: '80' },
    { id: 'bugs', label: 'Bug Detective', icon: Search, count: '40' },
    { id: 'speed', label: 'Speed Sprint', icon: Timer, count: 'Live' },
    { id: 'projects', label: 'Project Lab', icon: Hammer, count: '15' },
    { id: 'oracle', label: 'Language Oracle & AI Hub', icon: Sparkles, count: 'Vault' }
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#07090F]/95 backdrop-blur-xl sticky top-0 z-40 select-none">
      {/* Top Utility Command Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex items-center justify-between gap-3 border-b border-white/[0.04]">
        {/* Left: Brand Identity & Active Language */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#090C15] rounded-[11px] flex items-center justify-center text-sm font-black text-sky-400 font-mono">
                CH
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm tracking-tight text-white font-mono">
                  CODEHERO<span className="text-sky-400 font-normal">::2.0</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold hidden sm:inline">
                  7 REALMS
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          {/* Language Selector */}
          <LanguageSelector
            currentLanguageId={currentLanguageId}
            onSelectLanguage={onSelectLanguage}
            completedByLanguage={completedByLanguage}
          />
        </div>

        {/* Center: The Genuine Assessment / Top 1% Blueprint Pill */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => {
              soundService.playClick();
              onOpenRoadmap && onOpenRoadmap();
            }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-500/40 text-slate-300 transition-all group"
            title="Click to view the genuine Top 1% Global Engineer Blueprint"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold">
              FOUNDATION RATING: <span className="text-white font-bold">TOP 15%</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 group-hover:text-amber-300 font-bold flex items-center gap-0.5">
              <span>[1% BLUEPRINT ↗]</span>
            </span>
          </button>
        </div>

        {/* Right: XP Gauge, Streak & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* XP & Level Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div className="text-right hidden sm:block">
              <div className="text-[9px] font-mono text-slate-400 uppercase leading-none">
                {prog.levelName}
              </div>
              <div className="text-xs font-mono font-bold text-sky-400 leading-none mt-0.5">
                {totalXP.toLocaleString()} XP
              </div>
            </div>

            {/* Streak flame */}
            <div className="flex items-center gap-1 pl-1.5 sm:border-l sm:border-white/10">
              <span className="text-sm leading-none">🔥</span>
              <span className="text-xs font-mono font-bold text-amber-400">{streak}</span>
            </div>
          </div>

          {/* Digital Notes */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenNotes && onOpenNotes();
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors"
            title="Open & Download Digital Master Notes (.md)"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Notes</span>
          </button>

          {/* Checkpoint Exam */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenExam && onOpenExam();
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors"
            title="Conduct Formal Checkpoint Examination & Earn Official Certificate"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Exam</span>
          </button>

          {/* Sandbox */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSandbox();
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors"
            title="Open Freeform Sandbox"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Hero / Pro Mode */}
          <button
            onClick={() => {
              soundService.playClick();
              onToggleHeroMode();
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors"
            title={isHeroMode ? "Pro Studio Mode" : "Kid Hero Mode"}
          >
            {isHeroMode ? <Smile className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-sky-400" />}
          </button>
        </div>
      </div>

      {/* Bottom Segmented Mode Switcher Strip (High-Craft Developer Tabs) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentGameMode === mode.id;
            const isUnlocked = progressionService.isModeUnlocked(mode.id, currentLanguageId, completedCount);

            return (
              <button
                key={mode.id}
                onClick={() => {
                  soundService.playClick();
                  if (isUnlocked) {
                    onSelectGameMode(mode.id);
                  } else {
                    onOpenModeLocked && onOpenModeLocked(mode.id);
                  }
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 font-mono
                  ${isActive 
                    ? 'bg-white/10 text-white border border-white/20 shadow-sm shadow-black/50' 
                    : isUnlocked
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                      : 'text-slate-500 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent'
                  }
                `}
              >
                {!isUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                )}
                <span>{mode.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive 
                    ? 'bg-sky-500/20 text-sky-300' 
                    : !isUnlocked 
                      ? 'bg-amber-500/15 text-amber-300' 
                      : 'bg-white/5 text-slate-500'
                }`}>
                  {!isUnlocked ? 'Locked' : mode.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Blueprint Button */}
        <div className="lg:hidden shrink-0">
          <button
            onClick={() => onOpenRoadmap && onOpenRoadmap()}
            className="text-[10px] font-mono text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 font-bold"
          >
            1% BLUEPRINT
          </button>
        </div>
      </div>
    </header>
  );
}
