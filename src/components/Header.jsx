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
  ChevronDown
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
  const prog = getLevelProgress(totalXP);
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 select-none shadow-sm">

      {/* ── TOP UTILITY STRIP ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3 py-2.5">

          {/* Left: Brand + Language */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-[13px] shrink-0 bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
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

            <LanguageSelector
              currentLanguageId={currentLanguageId}
              onSelectLanguage={onSelectLanguage}
              completedByLanguage={completedByLanguage}
            />
          </div>

          {/* Center: Top 1% pill — desktop only */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => { soundService.playClick(); onOpenRoadmap?.(); }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all group bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 text-slate-700"
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* XP + Streak metric */}
            <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <div className="hidden sm:flex flex-col gap-0 px-3 py-1.5 border-r border-slate-200">
                <span className="text-[9px] font-mono uppercase tracking-widest leading-none text-slate-400">
                  {prog.levelName}
                </span>
                <span className="text-xs font-mono font-bold leading-none mt-0.5 text-sky-600">
                  {totalXP.toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50/50">
                <span className="text-base leading-none streak-fire">🔥</span>
                <span className="text-xs font-mono font-bold text-amber-600">{streak}</span>
              </div>
            </div>

            {/* Student account */}
            <button
              onClick={() => { soundService.playClick(); onOpenStudentAuth?.(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-mono font-medium bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700"
              title="Student Profile & Data"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span className="max-w-[90px] truncate hidden sm:inline font-bold">
                {currentStudent?.name || 'Student'}
              </span>
            </button>

            {/* Study Plan */}
            <button
              onClick={() => { soundService.playClick(); onOpenStudyPlan?.(); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-xs font-mono bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800"
              title="Personalized Study Plan"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline font-semibold">Plan</span>
            </button>

            {/* Notes / PDF */}
            <button
              onClick={() => { soundService.playClick(); onOpenNotes?.(); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-xs font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
              title="Notes & PDF Download"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline font-semibold">Notes/PDF</span>
            </button>

            {/* Exam */}
            <button
              onClick={() => { soundService.playClick(); onOpenExam?.(); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300 text-amber-700"
              title="Knowledge Test"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Exam</span>
            </button>

            {/* Sandbox */}
            <button
              onClick={() => { soundService.playClick(); onOpenSandbox(); }}
              className="p-1.5 rounded-lg transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
              title="Open Sandbox"
            >
              <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            </button>

            {/* Sound toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted
                ? <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>

            {/* Hero / Pro toggle */}
            <button
              onClick={() => { soundService.playClick(); onToggleHeroMode(); }}
              className="p-1.5 rounded-lg transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200"
              title={isHeroMode ? 'Switch to Pro Mode' : 'Switch to Hero Mode'}
            >
              {isHeroMode
                ? <Smile className="w-3.5 h-3.5 text-emerald-600" />
                : <Code2 className="w-3.5 h-3.5 text-sky-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MODE SWITCHER STRIP (LIGHT THEME) ───────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between gap-1 py-1 overflow-x-auto">
          <div className="flex items-center gap-1">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentGameMode === mode.id;
              const isUnlocked = progressionService.isModeUnlocked(mode.id, currentLanguageId, completedCount);
              const criteria = MODE_UNLOCK_CRITERIA[mode.id];
              const needed = criteria ? Math.max(0, criteria.requiredQuests - completedCount) : 0;

              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    soundService.playClick();
                    if (isUnlocked) onSelectGameMode(mode.id);
                    else onOpenModeLocked?.(mode.id);
                  }}
                  title={!isUnlocked && criteria ? `🔒 Unlocks in ${needed} more lesson${needed !== 1 ? 's' : ''} (${completedCount}/${criteria.requiredQuests} completed)` : mode.label}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-semibold transition-all shrink-0
                    ${isActive 
                      ? 'bg-sky-50 text-sky-700 border-b-2 border-sky-600 font-bold' 
                      : isUnlocked
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border-b-2 border-transparent'
                        : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50/50 border-b-2 border-transparent'
                    }
                  `}
                >
                  {!isUnlocked
                    ? <Lock className="w-3.5 h-3.5 text-amber-500" />
                    : <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-500'}`} />}
                  <span>{mode.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
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
          </div>

          {/* Mobile 1% blueprint */}
          <div className="lg:hidden shrink-0">
            <button
              onClick={() => onOpenRoadmap?.()}
              className="text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700"
            >
              1% Blueprint
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
