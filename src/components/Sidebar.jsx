import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Search, 
  BookOpen, 
  Terminal, 
  Layers, 
  GitBranch, 
  Repeat, 
  List, 
  Database, 
  Cpu, 
  ShieldAlert, 
  Box, 
  Sparkles, 
  Trophy,
  X,
  FileCheck,
  Lock
} from 'lucide-react';

const ICON_MAP = {
  Terminal,
  Layers,
  GitBranch,
  Repeat,
  List,
  Database,
  Cpu,
  ShieldAlert,
  Box,
  Sparkles,
  Trophy
};

export function Sidebar({
  curriculum,
  currentLessonId,
  completedLessons,
  onSelectLesson,
  isOpenMobile,
  onCloseMobile,
  onOpenModuleCheckpoint,
  passedModuleExams = [],
  onOpenNotes,
  isAdmin = false,
  onOpenAdmin,
  onOpenExam
}) {
  const [searchTerm, setSearchTerm]             = useState('');
  const [collapsedModules, setCollapsedModules] = useState({});

  const allLessonsInCurriculum = (curriculum || []).flatMap(m => m.lessons || []);
  const totalCourseLessons = allLessonsInCurriculum.length;
  const totalCompletedLessons = allLessonsInCurriculum.filter(l => completedLessons.includes(l.id)).length;
  const isCourseComplete = totalCompletedLessons === totalCourseLessons && totalCourseLessons > 0;

  const toggleModule = (modId) =>
    setCollapsedModules(prev => ({ ...prev, [modId]: !prev[modId] }));

  const filteredCurriculum = (curriculum || []).map(mod => {
    const matchesTitle = mod.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingLessons = (mod.lessons || []).filter(l =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.concept && l.concept.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.task && l.task.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (matchesTitle) return mod;
    if (matchingLessons.length > 0) return { ...mod, lessons: matchingLessons };
    return null;
  }).filter(Boolean);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/40 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-72 flex flex-col h-full bg-white border-r border-slate-200
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Header */}
        <div className="p-3.5 shrink-0 border-b border-slate-100 bg-slate-50/50">
          {/* Mobile close row */}
          <div className="flex items-center justify-between lg:hidden mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500">
              Curriculum Map
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search curriculum…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500 shadow-sm"
            />
          </div>

          {/* Duolingo / SoloLearn Style Step Path Progress */}
          <div className="mt-3 p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-sky-900 flex items-center gap-1">
                <span>🎯</span>
                <span>Learning Path</span>
              </span>
              <span className="font-mono text-sky-700">
                {totalCompletedLessons} / {totalCourseLessons} Done
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-sky-100 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, (totalCompletedLessons / (totalCourseLessons || 1)) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-sky-800/80 font-medium">
              👉 Follow lessons in order from Top to Bottom!
            </div>
          </div>
        </div>

        {/* Scrollable module tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
          {filteredCurriculum.map((module) => {
            const Icon = ICON_MAP[module.icon] || BookOpen;
            const isCollapsed    = !searchTerm && collapsedModules[module.id];
            const completedCount = (module.lessons || []).filter(l => completedLessons.includes(l.id)).length;
            const totalInModule  = module.lessons?.length || 0;
            const isAllCompleted = completedCount === totalInModule && totalInModule > 0;
            const isPassed       = passedModuleExams.includes(module.id);
            const pct            = totalInModule ? Math.max(5, Math.round((completedCount / totalInModule) * 100)) : 0;

            return (
              <div 
                key={module.id} 
                className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/40 hover:border-slate-300 transition-colors"
              >
                {/* Module header row */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`w-full flex items-center gap-2.5 p-2.5 text-left transition-all group ${
                    isAllCompleted ? 'bg-emerald-50/40' : 'hover:bg-slate-100/60'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    isAllCompleted 
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700' 
                      : 'bg-sky-50 border-sky-200 text-sky-600'
                  }`}>
                    {isAllCompleted
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      : <Icon className="w-3.5 h-3.5 text-sky-600" />}
                  </div>

                  {/* Title + progress */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold truncate text-slate-800">
                      {module.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Mini progress bar */}
                      <div className="flex-1 h-[3px] rounded-full bg-slate-200">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: isAllCompleted ? '#059669' : '#0284C7'
                          }} 
                        />
                      </div>
                      <span className="text-[9px] font-mono shrink-0 text-slate-500 font-semibold">
                        {completedCount}/{totalInModule}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="text-slate-400 group-hover:text-slate-600">
                    {isCollapsed
                      ? <ChevronRight className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Lesson list */}
                {!isCollapsed && (
                  <div className="px-2 pb-2 pt-1 space-y-0.5 border-t border-slate-200/60 bg-white">
                    {(module.lessons || []).map(lesson => {
                      const isSelected = lesson.id === currentLessonId;
                      const isComplete = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => { onSelectLesson(lesson.id); onCloseMobile?.(); }}
                          className={`
                            w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all text-xs font-mono
                            ${isSelected 
                              ? 'bg-sky-50 text-sky-950 border-2 border-sky-400 font-extrabold shadow-sm ring-2 ring-sky-300/30' 
                              : isComplete
                              ? 'bg-emerald-50/40 text-emerald-900 hover:bg-emerald-50 border border-emerald-200/60'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                            }
                          `}
                        >
                          <div className="shrink-0">
                            {isComplete ? (
                              <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              </div>
                            ) : isSelected ? (
                              <div className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] font-black animate-pulse">
                                ▶
                              </div>
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[11px] leading-tight">{lesson.title}</div>
                            {isSelected && (
                              <span className="inline-block mt-0.5 text-[9px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded font-sans uppercase">
                                👉 DO THIS NOW
                              </span>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            {isComplete ? (
                              <span className="text-[9px] font-bold text-emerald-700 font-sans">
                                Done ✓
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-mono">
                                {lesson.duration}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* Module checkpoint test button - locked at the last until all module lessons are completed */}
                    {isAllCompleted ? (
                      <button
                        onClick={() => { onOpenModuleCheckpoint?.(module); onCloseMobile?.(); }}
                        className={`
                          w-full mt-2 px-2.5 py-2 rounded-xl flex items-center justify-between transition-all border shadow-xs active:scale-[0.98]
                          ${isPassed 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                            : 'bg-amber-500/10 border-amber-300 text-amber-900 hover:bg-amber-500/20'
                          }
                        `}
                      >
                        <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                          <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                          Module Checkpoint Exam
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isPassed 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-200 text-amber-900 border border-amber-300'
                        }`}>
                          {isPassed ? 'Passed ✓' : 'Take Exam →'}
                        </span>
                      </button>
                    ) : (
                      <div 
                        className="w-full mt-2 px-2.5 py-1.5 rounded-xl flex items-center justify-between border border-slate-200/80 bg-slate-50 text-slate-400 text-[10px] font-mono select-none"
                        title={`Complete all ${totalInModule} lessons in this module to unlock the checkpoint exam (${completedCount}/${totalInModule} completed)`}
                      >
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Module Exam</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">
                          Locked ({completedCount}/{totalInModule})
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* FINAL COMPREHENSIVE COURSE EXAM (AT THE VERY LAST OF THE LIST) */}
          {onOpenExam && (
            <div className="pt-2 pb-1">
              <button
                onClick={() => {
                  if (isCourseComplete) {
                    onOpenExam();
                    onCloseMobile?.();
                  } else {
                    alert(`The Final Course Certification Exam unlocks once all ${totalCourseLessons} curriculum lessons are completed! Current progress: ${totalCompletedLessons}/${totalCourseLessons}`);
                  }
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 active:scale-[0.98] ${
                  isCourseComplete
                    ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-300 shadow-md shadow-amber-500/10 hover:border-amber-400'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isCourseComplete 
                    ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-xs' 
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  {isCourseComplete ? <Trophy className="w-4 h-4 text-amber-600 animate-bounce" /> : <Lock className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-700">
                      Final Milestone
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      +200 XP
                    </span>
                  </div>
                  <div className={`text-xs font-bold truncate ${isCourseComplete ? 'text-slate-900' : 'text-slate-500'}`}>
                    Course Certification Exam
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {isCourseComplete ? '🎓 Ready to Take!' : `Locked (${totalCompletedLessons}/${totalCourseLessons} quests)`}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="p-2.5 shrink-0 border-t border-slate-200 bg-slate-50/70 space-y-1.5">
          {isAdmin && (
            <button
              type="button"
              onClick={() => { onOpenAdmin?.(); onCloseMobile?.(); }}
              className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition-all active:scale-95 touch-manipulation cursor-pointer shadow-2xs"
            >
              <span>👑</span>
              <span>Instructor Admin Portal</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => { onOpenNotes?.(); onCloseMobile?.(); }}
            className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 transition-all active:scale-95 touch-manipulation cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Digital Notes &amp; PDF</span>
          </button>
        </div>
      </aside>
    </>
  );
}
