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
  X
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
  onCloseMobile
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedModules, setCollapsedModules] = useState({});

  const toggleModule = (modId) => {
    setCollapsedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  // Filter lessons based on search
  const filteredCurriculum = curriculum.map(mod => {
    const matchesTitle = mod.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingLessons = mod.lessons.filter(l => 
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchesTitle) return mod;
    if (matchingLessons.length > 0) {
      return { ...mod, lessons: matchingLessons };
    }
    return null;
  }).filter(Boolean);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-80 bg-slate-950/95 lg:bg-slate-950/40 border-r border-slate-800/80
        flex flex-col h-full transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Search Bar & Header */}
        <div className="p-3.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between lg:hidden mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Learning Curriculum
            </span>
            <button 
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search topics, syntax, methods..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Modules Tree */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          {filteredCurriculum.map((module) => {
            const Icon = ICON_MAP[module.icon] || BookOpen;
            const isCollapsed = !searchTerm && collapsedModules[module.id];
            const completedCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
            const isAllCompleted = completedCount === module.lessons.length && module.lessons.length > 0;

            return (
              <div 
                key={module.id}
                className="rounded-xl border border-slate-800/60 bg-slate-900/30 overflow-hidden transition-all"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-slate-800/50 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg ${isAllCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-sky-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {module.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {completedCount}/{module.lessons.length} done
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-500 pl-2">
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Lessons List */}
                {!isCollapsed && (
                  <div className="px-1.5 pb-2 pt-0.5 space-y-0.5 border-t border-slate-800/40">
                    {module.lessons.map(lesson => {
                      const isSelected = lesson.id === currentLessonId;
                      const isComplete = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            onSelectLesson(lesson.id);
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className={`
                            w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all text-xs
                            ${isSelected 
                              ? 'bg-sky-500/15 text-sky-200 border border-sky-500/30 font-medium shadow-sm shadow-sky-500/5' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
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
