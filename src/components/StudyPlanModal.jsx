import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  X, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  Target,
  Flame,
  BookOpen,
  Layers,
  Award,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  STUDY_PRESETS, 
  DAILY_HOURS_PRESETS, 
  generateStudyPlan,
  LANGUAGE_LESSON_COUNTS,
  TOTAL_ACADEMY_LESSONS
} from '../services/studyPlanService';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

export function StudyPlanModal({
  isOpen,
  onClose,
  currentLanguageId = 'python',
  studentName = 'Hero Student'
}) {
  const [targetDays, setTargetDays] = useState(30);
  const [dailyHours, setDailyHours] = useState(1);
  const [plan, setPlan] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Load existing plan or generate new default on mount/open
  useEffect(() => {
    if (!isOpen) return;
    const existing = storageService.getStudyPlan();
    if (existing && existing.languageId === currentLanguageId) {
      setPlan(existing);
      setTargetDays(existing.targetDays || 30);
      setDailyHours(existing.dailyHours || 1);
    } else {
      handleRegeneratePlan(30, 1);
    }
  }, [isOpen, currentLanguageId]);

  if (!isOpen) return null;

  const handleRegeneratePlan = (days = targetDays, hours = dailyHours) => {
    soundService.playClick();
    const newPlan = generateStudyPlan({
      targetDays: days,
      dailyHours: hours,
      languageId: currentLanguageId
    });
    setPlan(newPlan);
    storageService.saveStudyPlan(newPlan);
    setActiveDayIndex(0);
  };

  const generatePlanHTML = () => {
    if (!plan || !plan.days) return '';
    const langMeta2 = LANGUAGE_LESSON_COUNTS[currentLanguageId] || { name: 'Python', lessons: 87, modules: 25 };
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const daysHTML = plan.days.map((day) => `
      <div class="day-card">
        <div class="day-header">
          <div class="day-num">Day ${day.dayNumber} of ${plan.targetDays}</div>
          <div class="day-date">${day.date}</div>
          <div class="day-theme">${day.theme}</div>
          ${day.milestone ? `<div class="milestone">⭐ MILESTONE: ${day.milestone}</div>` : ''}
        </div>
        <div class="section">
          <div class="section-title">🕐 When to Study</div>
          ${(day.whenToDo || []).map(s => `
            <div class="time-slot"><span class="time">${s.time}</span><span class="activity">${s.activity}</span></div>
          `).join('')}
        </div>
        <div class="section">
          <div class="section-title">🎯 What to Do Today</div>
          <div class="task-box">${day.whatToDo}</div>
        </div>
        <div class="section">
          <div class="section-title">📖 How to Study (Action Protocol)</div>
          <div class="how-box">${(day.howToDo || '').replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>CodeHero Academy — ${langMeta2.name} Study Plan</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #0F172A; background: #fff; font-size: 11pt; line-height: 1.55; }
    @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }

    .cover { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; text-align: center; padding: 30px; border-bottom: 3px solid #0284C7; margin-bottom: 28px; page-break-after: avoid; }
    .cover-badge { font-family: 'JetBrains Mono', monospace; font-size: 9pt; background: #EFF6FF; color: #1D4ED8; padding: 4px 12px; border-radius: 99px; border: 1px solid #BFDBFE; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; display: inline-block; }
    .cover-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26pt; font-weight: 800; color: #0F172A; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 6px; }
    .cover-sub { font-size: 12pt; color: #475569; margin-bottom: 16px; }
    .cover-stats { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-family: 'JetBrains Mono', monospace; font-size: 16pt; font-weight: 700; color: #0284C7; }
    .stat-lbl { font-size: 8pt; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }

    .day-card { border: 1px solid #E2E8F0; border-radius: 10px; margin-bottom: 18px; overflow: hidden; page-break-inside: avoid; break-inside: avoid; }
    .day-header { background: #F8FAFC; padding: 10px 14px; border-bottom: 1px solid #E2E8F0; }
    .day-num { font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; font-weight: 700; color: #D97706; text-transform: uppercase; letter-spacing: 0.08em; }
    .day-date { font-size: 8pt; color: #94A3B8; margin-top: 1px; }
    .day-theme { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11.5pt; font-weight: 700; color: #0F172A; margin-top: 3px; }
    .milestone { margin-top: 5px; font-size: 8.5pt; font-weight: 700; color: #D97706; background: #FFFBEB; padding: 4px 8px; border-radius: 5px; display: inline-block; }

    .section { padding: 9px 14px; border-bottom: 1px solid #F1F5F9; }
    .section:last-child { border-bottom: none; }
    .section-title { font-family: 'JetBrains Mono', monospace; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #64748B; margin-bottom: 6px; }
    .time-slot { display: flex; gap: 12px; margin-bottom: 4px; font-size: 9.5pt; }
    .time { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #D97706; min-width: 90px; }
    .activity { color: #334155; }
    .task-box { background: #EFF6FF; border-left: 3px solid #0284C7; padding: 8px 10px; border-radius: 0 6px 6px 0; font-size: 9.5pt; color: #1E3A5F; font-weight: 500; }
    .how-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 6px; font-size: 9.5pt; color: #334155; }

    .footer { text-align: center; color: #CBD5E1; font-size: 8pt; font-family: 'JetBrains Mono', monospace; padding-top: 12px; border-top: 1px solid #F1F5F9; }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-badge">CodeHero Academy 2.0 — Personalized Study Plan</div>
    <div class="cover-title">Your ${langMeta2.name} Mastery Roadmap</div>
    <div class="cover-sub">Hello, ${studentName} — here is your complete ${plan.targetDays}-day plan</div>
    <div class="cover-stats">
      <div class="stat"><div class="stat-num">${plan.targetDays}</div><div class="stat-lbl">Days</div></div>
      <div class="stat"><div class="stat-num">${plan.dailyHours}h</div><div class="stat-lbl">Per Day</div></div>
      <div class="stat"><div class="stat-num">${langMeta2.lessons}</div><div class="stat-lbl">Lessons</div></div>
      <div class="stat"><div class="stat-num">${langMeta2.modules}</div><div class="stat-lbl">Modules</div></div>
    </div>
    <div style="margin-top:14px; font-size:8.5pt; color:#94A3B8;">Generated ${today} · CodeHero Academy · Destination &gt; Save as PDF</div>
  </div>

  ${daysHTML}

  <div class="footer">CodeHero Academy 2.0 · Top 10-15% Engineer Track · codehero-1717.github.io</div>
</body>
</html>`;
  };

  const handleExportPDF = () => {
    if (!plan || !plan.days) return;
    soundService.playSuccess();
    const html = generatePlanHTML();

    // In-page hidden iframe: NEVER blocked by popup blockers!
    try {
      const oldFrame = document.getElementById('plan-print-frame');
      if (oldFrame) oldFrame.remove();
      const iframe = document.createElement('iframe');
      iframe.id = 'plan-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow.document;
      frameDoc.open();
      frameDoc.write(html);
      frameDoc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          handleDownloadPlanHTML();
        }
      }, 400);
    } catch (e) {
      handleDownloadPlanHTML();
    }
  };

  const handleDownloadPlanHTML = () => {
    if (!plan || !plan.days) return;
    soundService.playSuccess();
    const html = generatePlanHTML();
    const langMeta2 = LANGUAGE_LESSON_COUNTS[currentLanguageId] || { name: 'Python' };
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CodeHero_${langMeta2.name}_Study_Plan_${plan.targetDays}Days.html`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 200);
  };

  const handleToggleDay = (idx) => {
    if (!plan || !plan.days) return;
    const updatedDays = [...plan.days];
    const newState = !updatedDays[idx].isCompleted;
    updatedDays[idx].isCompleted = newState;

    if (newState) {
      soundService.playSuccess();
    } else {
      soundService.playClick();
    }

    const updatedPlan = {
      ...plan,
      days: updatedDays
    };
    setPlan(updatedPlan);
    storageService.saveStudyPlan(updatedPlan);
  };

  const completedDaysCount = plan?.days?.filter(d => d.isCompleted).length || 0;
  const progressPercent = plan?.days?.length 
    ? Math.round((completedDaysCount / plan.days.length) * 100) 
    : 0;

  const currentActiveDay = plan?.days?.[activeDayIndex] || plan?.days?.[0];

  const langMeta = LANGUAGE_LESSON_COUNTS[currentLanguageId] || { lessons: 87, modules: 25, name: 'Python' };
  const netStudyDays = Math.max(1, targetDays - Math.floor(targetDays / 7) - 1);
  const dailyLessonsNeeded = Math.max(1, Math.ceil(langMeta.lessons / netStudyDays));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#090C14] border border-amber-500/30 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#090C14] p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              📅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  STUDY ROADMAP ENGINE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentLanguageId.toUpperCase()} Mastery Plan
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Personalized Timetable: When, What &amp; How to Learn
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all active:scale-[0.97]"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save as PDF</span>
            </button>
            <button
              onClick={handleDownloadPlanHTML}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-xs font-mono text-sky-300 border border-sky-500/30 flex items-center gap-1.5 transition-all active:scale-[0.97]"
              title="Download Timetable HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download File</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-[#0C101A] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Target Days Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Duration:</span>
            </span>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {STUDY_PRESETS.map(p => (
                <button
                  key={p.days}
                  onClick={() => {
                    setTargetDays(p.days);
                    handleRegeneratePlan(p.days, dailyHours);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    targetDays === p.days
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Daily Hours Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Daily Study Time:</span>
            </span>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {DAILY_HOURS_PRESETS.map(h => (
                <button
                  key={h.hours}
                  onClick={() => {
                    setDailyHours(h.hours);
                    handleRegeneratePlan(targetDays, h.hours);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    dailyHours === h.hours
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {h.hours === 0.5 ? '30m' : `${h.hours}h`}
                </button>
              ))}
            </div>
          </div>

          {/* Plan Progress Metric */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400">Pacing Status</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {completedDaysCount} of {plan?.days?.length || 0} Days Done ({progressPercent}%)
              </div>
            </div>
            <div className="w-24 bg-black/40 h-2 rounded-full border border-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* What to do & Lesson Quota Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#080B13] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-mono font-bold text-amber-400">
              🎯 YOUR {langMeta.name.toUpperCase()} CURRICULUM:
            </span>
            <span className="text-xs font-mono text-white">
              Complete <strong className="text-sky-400">{langMeta.lessons} Lessons</strong> ({langMeta.modules} Modules)
            </span>
            <span className="text-xs font-mono text-slate-400">
              · Daily Target: <strong className="text-emerald-400">~{dailyLessonsNeeded} lessons/day</strong> to finish in {targetDays} days
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">📖 631 Lessons</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">⚡ Speed Practice</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">🔍 40 Bugs</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">⚔️ 80 Puzzles</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">🏗️ 15 Projects</span>
          </div>
        </div>

        {/* Modal Body: Split Master-Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Day Calendar List (4 cols) */}
          <div className="md:col-span-5 border-r border-white/[0.06] overflow-y-auto p-3 space-y-2 bg-[#0A0D16]">
            <div className="text-[11px] font-mono text-slate-400 px-2 py-1 flex items-center justify-between">
              <span>SCHEDULED TIMELINE</span>
              <span className="text-[10px] text-amber-400 font-bold">CLICK A DAY TO VIEW DETAILS</span>
            </div>

            {plan?.days?.map((day, idx) => {
              const isSelected = activeDayIndex === idx;
              return (
                <div
                  key={day.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                      : day.isCompleted
                      ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-300'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Completion Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDay(idx);
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                    >
                      {day.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          Day {day.dayNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {day.date}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate max-w-[200px]">
                        {day.theme}
                      </div>
                    </div>
                  </div>

                  {day.milestone && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      Event
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Day Detail Card ("When, What, How") (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#090C14]">
            {currentActiveDay ? (
              <div className="space-y-4 animate-fade-in">
                {/* Day Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-black border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                        DAY {currentActiveDay.dayNumber} OF {plan.targetDays}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {currentActiveDay.date}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {currentActiveDay.theme}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleToggleDay(activeDayIndex)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md ${
                      currentActiveDay.isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {currentActiveDay.isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed!</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark Day Done</span>
                      </>
                    )}
                  </button>
                </div>

                {currentActiveDay.milestone && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                    <span>⭐ MILESTONE:</span>
                    <span>{currentActiveDay.milestone}</span>
                  </div>
                )}

                {/* 1. WHEN TO DO (Time Breakdown) */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
                  <div className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>1. When to Do (Recommended Session Blocks)</span>
                  </div>
                  <div className="space-y-1.5">
                    {currentActiveDay.whenToDo.map((slot, sIdx) => (
                      <div 
                        key={sIdx}
                        className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-amber-300 font-bold">{slot.time}</span>
                        <span className="text-slate-300">{slot.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. WHAT TO DO (Exact Tasks) */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>2. What to Do (Today's Assignment)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed font-mono">
                    {currentActiveDay.whatToDo}
                  </div>
                </div>

                {/* 3. HOW TO DO (Pedagogical Guidance) */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                  <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>3. How to Do (Action Protocol)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-purple-500/20 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {currentActiveDay.howToDo}
                  </div>
                </div>

                {/* Next / Previous Day Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={activeDayIndex === 0}
                    onClick={() => setActiveDayIndex(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-mono text-slate-300"
                  >
                    ← Previous Day
                  </button>
                  <button
                    disabled={activeDayIndex === plan.days.length - 1}
                    onClick={() => setActiveDayIndex(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold text-xs font-mono shadow-md"
                  >
                    Next Day →
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Select a day on the left to view the study instructions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
