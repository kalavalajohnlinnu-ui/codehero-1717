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
  Zap,
  Sword,
  Search,
  Timer,
  Hammer,
  Sparkles,
  Award,
  Lock,
  Calendar,
  User,
  ChevronDown,
  MoreHorizontal,
  X
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { soundService } from '../services/soundService';
import { getLevelProgress } from '../services/gameEngine';
import { progressionService, MODE_UNLOCK_CRITERIA } from '../services/progressionService';

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
  onOpenModeLocked,
  currentStudent,
  onOpenStudentAuth,
  onOpenStudyPlan
}) {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const prog = getLevelProgress(totalXP);

  const handleToggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    if (!muted) soundService.playClick();
  };

  const modes = [
    { id: 'lessons',  label: 'Lessons',        icon: Zap,      count: '631' },
    { id: 'speed',    label: 'Speed Practice', icon: Timer,    count: 'Fast' },
    { id: 'bugs',     label: 'Fix Bugs',       icon: Search,   count: '40' },
    { id: 'arena',    label: 'Coding Puzzles', icon: Sword,    count: '80' },
    { id: 'projects', label: 'Build Projects', icon: Hammer,   count: '15' },
    { id: 'oracle',   label: 'Ask & Help',     icon: Sparkles, count: 'Help' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 select-none shadow-xs">

      {/* ── TOP UTILITY STRIP ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 py-2 sm:py-2.5">

          {/* Left: Brand + Language */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
            {/* Logo mark */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 bg-sky-50 text-sky-600 border border-sky-200 shadow-2xs">
                CH
              </div>
              <div className="hidden sm:block">
                <div className="font-mono font-bold text-xs tracking-tight leading-none text-slate-900">
                  CODEHERO<span className="text-sky-600">::2.0</span>
                </div>
                <div className="text-[9px] font-mono uppercase tracking-widest mt-0.5 text-slate-400 font-semibold">
                  7 Languages
                </div>
              </div>
            </div>

            <div className="w-[1px] h-5 bg-slate-200 hidden sm:block" />

            <div className="shrink-0">
              <LanguageSelector
                currentLanguageId={currentLanguageId}
                onSelectLanguage={onSelectLanguage}
                completedByLanguage={completedByLanguage}
              />
            </div>
          </div>

          {/* Center: Top 1% pill — desktop only */}
          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => { soundService.playClick(); onOpenRoadmap?.(); }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all group bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 text-slate-700 active:scale-95 touch-manipulation cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold">
                FOUNDATION RATING: <span className="text-slate-900 font-bold">TOP 15%</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-600 group-hover:text-amber-700">
                [1% Blueprint ↗]
              </span>
            </button>
          </div>

          {/* Right: XP, Student, Tools */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* XP + Streak metric */}
            <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
              <div className="hidden md:flex flex-col gap-0 px-2.5 py-1 border-r border-slate-200">
                <span className="text-[9px] font-mono uppercase tracking-widest leading-none text-slate-400">
                  {prog.levelName}
                </span>
                <span className="text-xs font-mono font-bold leading-none mt-0.5 text-sky-600">
                  {totalXP.toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-50/60">
                <span className="text-sm leading-none streak-fire">🔥</span>
                <span className="text-xs font-mono font-bold text-amber-600">{streak}</span>
              </div>
            </div>

            {/* Notes / PDF — Always visible */}
            <button
              type="button"
              onClick={() => { soundService.playClick(); onOpenNotes?.(); }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl transition-all text-xs font-mono bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 shadow-2xs active:scale-95 touch-manipulation cursor-pointer shrink-0"
              title="Notes & Handbook PDF"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline font-semibold">Notes</span>
            </button>

            {/* Student account — Always visible */}
            <button
              type="button"
              onClick={() => { soundService.playClick(); onOpenStudentAuth?.(); }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl transition-all text-xs font-mono font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs active:scale-95 touch-manipulation cursor-pointer shrink-0"
              title="Student Profile"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span className="max-w-[75px] truncate hidden lg:inline font-bold">
                {currentStudent?.name || 'Student'}
              </span>
            </button>

            {/* Desktop tools (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-1.5">
              {/* Study Plan */}
              <button
                type="button"
                onClick={() => { soundService.playClick(); onOpenStudyPlan?.(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all text-xs font-mono bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 active:scale-95 touch-manipulation cursor-pointer"
                title="Personalized Study Plan"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline font-semibold">Plan</span>
              </button>

              {/* Exam */}
              <button
                type="button"
                onClick={() => { soundService.playClick(); onOpenExam?.(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 text-amber-700 active:scale-95 touch-manipulation cursor-pointer"
                title="Knowledge Test"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Exam</span>
              </button>

              {/* Sandbox */}
              <button
                type="button"
                onClick={() => { soundService.playClick(); onOpenSandbox(); }}
                className="p-1.5 rounded-xl transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 active:scale-95 touch-manipulation cursor-pointer"
                title="Open Sandbox"
              >
                <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              </button>

              {/* Sound toggle */}
              <button
                type="button"
                onClick={handleToggleSound}
                className="p-1.5 rounded-xl transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-95 touch-manipulation cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted
                  ? <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                  : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              {/* Hero / Pro toggle */}
              <button
                type="button"
                onClick={() => { soundService.playClick(); onToggleHeroMode(); }}
                className="p-1.5 rounded-xl transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-95 touch-manipulation cursor-pointer"
                title={isHeroMode ? 'Switch to Pro Mode' : 'Switch to Hero Mode'}
              >
                {isHeroMode
                  ? <Smile className="w-3.5 h-3.5 text-emerald-600" />
                  : <Code2 className="w-3.5 h-3.5 text-sky-600" />}
              </button>
            </div>

            {/* Mobile More Actions Button (···) */}
            <div className="relative sm:hidden shrink-0">
              <button
                type="button"
                onClick={() => { soundService.playClick(); setShowMobileMenu(prev => !prev); }}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center active:scale-95 touch-manipulation cursor-pointer"
                title="More Tools"
                aria-label="More Tools"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Mobile Tools Dropdown Popover */}
              {showMobileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMobileMenu(false)} 
                  />
                  <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 animate-scale-bounce">
                    <button
                      type="button"
                      onClick={() => { setShowMobileMenu(false); onOpenStudyPlan?.(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left active:scale-95 touch-manipulation cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Study Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowMobileMenu(false); onOpenExam?.(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left active:scale-95 touch-manipulation cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Skill Exam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowMobileMenu(false); onOpenSandbox(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left active:scale-95 touch-manipulation cursor-pointer"
                    >
                      <Play className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                      <span>Sandbox</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowMobileMenu(false); onOpenRoadmap?.(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-amber-700 hover:bg-amber-50 rounded-xl transition-all text-left active:scale-95 touch-manipulation cursor-pointer"
                    >
                      <span>⭐</span>
                      <span>1% Blueprint</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => { handleToggleSound(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left active:scale-95 touch-manipulation cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                      <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { onToggleHeroMode(); setShowMobileMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left active:scale-95 touch-manipulation cursor-pointer"
                    >
                      {isHeroMode ? <Smile className="w-4 h-4 text-emerald-600" /> : <Code2 className="w-4 h-4 text-sky-600" />}
                      <span>{isHeroMode ? 'Switch to Pro' : 'Switch to Hero'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODE SWITCHER STRIP (ZERO OVERLAP HORIZONTAL SCROLL) ───────────────── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-5">
        <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentGameMode === mode.id;
            const isUnlocked = progressionService.isModeUnlocked(mode.id, currentLanguageId, completedCount);
            const criteria = MODE_UNLOCK_CRITERIA[mode.id];
            const needed = criteria ? Math.max(0, criteria.requiredQuests - completedCount) : 0;

            return (
              <button
                type="button"
                key={mode.id}
                onClick={() => {
                  soundService.playClick();
                  if (isUnlocked) onSelectGameMode(mode.id);
                  else onOpenModeLocked?.(mode.id);
                }}
                title={!isUnlocked && criteria ? `🔒 Unlocks in ${needed} more lesson${needed !== 1 ? 's' : ''} (${completedCount}/${criteria.requiredQuests} completed)` : mode.label}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer touch-manipulation active:scale-95
                  ${isActive 
                    ? 'bg-sky-50 text-sky-700 border border-sky-300 font-bold shadow-2xs' 
                    : isUnlocked
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50/50 border border-transparent'
                  }
                `}
              >
                {!isUnlocked
                  ? <Lock className="w-3.5 h-3.5 text-amber-500" />
                  : <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-500'}`} />}
                <span className="whitespace-nowrap">{mode.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isActive 
                    ? 'bg-sky-100 text-sky-800' 
                    : !isUnlocked
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  {!isUnlocked && criteria ? `${completedCount}/${criteria.requiredQuests}` : mode.count}
                </span>
              </button>
            );
          })}

          {/* 1% Blueprint inline pill in the scroll strip — NEVER overlaps! */}
          <button
            type="button"
            onClick={() => { soundService.playClick(); onOpenRoadmap?.(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap active:scale-95 touch-manipulation cursor-pointer"
          >
            <span>⭐</span>
            <span>1% Blueprint</span>
          </button>
        </div>
      </div>
    </header>
  );
}
