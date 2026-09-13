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
    { id: 'lessons',  label: 'Lessons',       icon: Zap,      count: '631' },
    { id: 'speed',    label: 'Speed Practice', icon: Timer,    count: 'Fast' },
    { id: 'bugs',     label: 'Fix Bugs',       icon: Search,   count: '40' },
    { id: 'arena',    label: 'Coding Puzzles', icon: Sword,    count: '80' },
    { id: 'projects', label: 'Build Projects', icon: Hammer,   count: '15' },
    { id: 'oracle',   label: 'Ask & Help',     icon: Sparkles, count: 'Help' }
  ];

  return (
    <header style={{
      background: 'rgba(6,8,15,0.96)',
      backdropFilter: 'blur(20px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>

      {/* ── TOP UTILITY STRIP ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center justify-between gap-3 py-2.5">

          {/* Left: Brand + Language */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-[13px] shrink-0"
                style={{
                  background: 'rgba(0,229,255,0.1)',
                  border: '1px solid rgba(0,229,255,0.25)',
                  color: '#00E5FF',
                  boxShadow: '0 0 16px rgba(0,229,255,0.08)'
                }}>
                CH
              </div>
              <div className="hidden sm:block">
                <div className="font-mono font-bold text-xs tracking-tight leading-none text-white">
                  CODEHERO<span style={{ color: '#00E5FF' }}>::2.0</span>
                </div>
                <div className="text-[9px] font-mono uppercase tracking-widest mt-0.5" style={{ color: '#4B5568' }}>
                  7 Languages
                </div>
              </div>
            </div>

            <div className="w-[1px] h-5 hidden sm:block" style={{ background: 'rgba(255,255,255,0.07)' }} />

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
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all group"
              style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.18)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.11)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.06)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.18)';
              }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22D3A6' }} />
              <span className="text-[11px] font-mono font-semibold" style={{ color: '#8892AA' }}>
                FOUNDATION RATING: <span className="text-white font-bold">TOP 15%</span>
              </span>
              <span className="text-[10px] font-mono font-bold" style={{ color: '#F59E0B' }}>
                [1% Blueprint ↗]
              </span>
            </button>
          </div>

          {/* Right: XP, Student, Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* XP + Streak metric */}
            <div className="flex items-center gap-0 rounded-lg overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="hidden sm:flex flex-col gap-0 px-3 py-1.5"
                style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,229,255,0.03)' }}>
                <span className="text-[9px] font-mono uppercase tracking-widest leading-none"
                  style={{ color: '#4B5568' }}>{prog.levelName}</span>
                <span className="text-xs font-mono font-bold leading-none mt-0.5"
                  style={{ color: '#00E5FF' }}>{totalXP.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5"
                style={{ background: 'rgba(245,158,11,0.04)' }}>
                <span className="text-base leading-none streak-fire">🔥</span>
                <span className="text-xs font-mono font-bold" style={{ color: '#F59E0B' }}>{streak}</span>
              </div>
            </div>

            {/* Student account */}
            <button
              onClick={() => { soundService.playClick(); onOpenStudentAuth?.(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-mono font-medium"
              style={{
                background: 'rgba(0,229,255,0.06)',
                border: '1px solid rgba(0,229,255,0.18)',
                color: '#00E5FF'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,229,255,0.11)';
                e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,229,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(0,229,255,0.18)';
              }}
              title="Student Profile & Data">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22D3A6' }} />
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[90px] truncate hidden sm:inline font-bold">
                {currentStudent?.name || 'Student'}
              </span>
            </button>

            {/* Study Plan */}
            <button
              onClick={() => { soundService.playClick(); onOpenStudyPlan?.(); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-xs font-mono"
              style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.18)',
                color: '#F59E0B'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.11)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.06)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.18)';
              }}
              title="Personalized Study Plan">
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-semibold">Plan</span>
            </button>

            {/* Notes / PDF */}
            <button
              onClick={() => { soundService.playClick(); onOpenNotes?.(); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-xs font-mono"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#8892AA'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = '#EEF0F8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.color = '#8892AA';
              }}
              title="Notes & PDF Download">
              <BookOpen className="w-3.5 h-3.5" style={{ color: '#00E5FF' }} />
              <span className="hidden md:inline">Notes/PDF</span>
            </button>

            {/* Exam */}
            <button
              onClick={() => { soundService.playClick(); onOpenExam?.(); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-xs font-mono font-bold"
              style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.18)',
                color: '#F59E0B'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.12)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.06)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.18)';
              }}
              title="Knowledge Test">
              <Award className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
              <span className="hidden md:inline">Exam</span>
            </button>

            {/* Sandbox */}
            <button
              onClick={() => { soundService.playClick(); onOpenSandbox(); }}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#8892AA'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.color = '#EEF0F8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.color = '#8892AA';
              }}
              title="Open Sandbox">
              <Play className="w-3.5 h-3.5" style={{ color: '#F59E0B', fill: 'rgba(245,158,11,0.2)' }} />
            </button>

            {/* Sound toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted
                ? <VolumeX className="w-3.5 h-3.5" style={{ color: '#FF5370' }} />
                : <Volume2 className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />}
            </button>

            {/* Hero / Pro toggle */}
            <button
              onClick={() => { soundService.playClick(); onToggleHeroMode(); }}
              className="p-1.5 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              title={isHeroMode ? 'Switch to Pro Mode' : 'Switch to Hero Mode'}>
              {isHeroMode
                ? <Smile className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />
                : <Code2 className="w-3.5 h-3.5" style={{ color: '#00E5FF' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MODE SWITCHER STRIP ───────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between gap-1 py-1 overflow-x-auto">
          <div className="flex items-center gap-1">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentGameMode === mode.id;
              const isUnlocked = progressionService.isModeUnlocked(mode.id, currentLanguageId, completedCount);

              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    soundService.playClick();
                    if (isUnlocked) onSelectGameMode(mode.id);
                    else onOpenModeLocked?.(mode.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-semibold transition-all shrink-0 relative"
                  style={isActive ? {
                    background: 'rgba(0,229,255,0.08)',
                    color: '#00E5FF',
                    borderBottom: '2px solid #00E5FF',
                  } : isUnlocked ? {
                    color: '#6B7A96',
                    borderBottom: '2px solid transparent',
                  } : {
                    color: '#4B5568',
                    borderBottom: '2px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = isUnlocked ? '#EEF0F8' : '#F59E0B';
                      e.currentTarget.style.background = isUnlocked ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.06)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = isUnlocked ? '#6B7A96' : '#4B5568';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}>
                  {!isUnlocked
                    ? <Lock className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                    : <Icon className="w-3.5 h-3.5" style={{ color: isActive ? '#00E5FF' : 'currentColor' }} />}
                  <span>{mode.label}</span>
                  <span className="text-[10px] px-1.5 rounded font-bold"
                    style={isActive
                      ? { background: 'rgba(0,229,255,0.15)', color: '#00E5FF' }
                      : !isUnlocked
                        ? { background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#4B5568' }}>
                    {!isUnlocked ? 'Locked' : mode.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile 1% blueprint */}
          <div className="lg:hidden shrink-0">
            <button
              onClick={() => onOpenRoadmap?.()}
              className="text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-md"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                color: '#F59E0B'
              }}>
              1% Blueprint
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
