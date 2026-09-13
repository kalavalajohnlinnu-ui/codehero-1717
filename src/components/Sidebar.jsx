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
  FileCheck
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
  passedModuleExams = []
}) {
  const [searchTerm, setSearchTerm]             = useState('');
  const [collapsedModules, setCollapsedModules] = useState({});

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
            const pct            = totalInModule ? Math.round((completedCount / totalInModule) * 100) : 0;

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
                            w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all text-xs font-mono
                            ${isSelected 
                              ? 'bg-sky-50 text-sky-900 border border-sky-300 font-bold shadow-sm' 
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                            }
                          `}
                        >
                          <div className="shrink-0">
                            {isComplete
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              : <Circle className="w-3.5 h-3.5 text-slate-300" />}
                          </div>
                          <span className="truncate text-[11px]">{lesson.title}</span>
                          <span className="shrink-0 ml-auto text-[9px] text-slate-400 font-mono">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}

                    {/* Module checkpoint test button */}
                    <button
                      onClick={() => { onOpenModuleCheckpoint?.(module); onCloseMobile?.(); }}
                      className={`
                        w-full mt-1.5 px-2.5 py-2 rounded-lg flex items-center justify-between transition-all border
                        ${isPassed 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/70'
                        }
                      `}
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                        <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                        Checkpoint Test
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isPassed 
                          ? 'bg-emerald-200/60 text-emerald-900' 
                          : 'bg-amber-200/60 text-amber-900'
                      }`}>
                        {isPassed ? 'Passed ✓' : 'Take Test'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
