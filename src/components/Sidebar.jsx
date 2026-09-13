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
  const [searchTerm, setSearchTerm]       = useState('');
  const [collapsedModules, setCollapsedModules] = useState({});

  const toggleModule = (modId) =>
    setCollapsedModules(prev => ({ ...prev, [modId]: !prev[modId] }));

  const filteredCurriculum = curriculum.map(mod => {
    const matchesTitle = mod.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchingLessons = mod.lessons.filter(l =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.task.toLowerCase().includes(searchTerm.toLowerCase())
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
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(6,8,15,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-72 flex flex-col h-full
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
        style={{
          background: 'rgba(10,12,20,0.97)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}>

        {/* Header */}
        <div className="p-3.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Mobile close row */}
          <div className="flex items-center justify-between lg:hidden mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest font-semibold"
              style={{ color: '#4B5568' }}>
              Curriculum
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: '#4B5568' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#EEF0F8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5568'; }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4B5568' }} />
            <input
              type="text"
              placeholder="Search topics…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg text-xs pl-9 pr-3 py-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EEF0F8',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
          </div>
        </div>

        {/* Scrollable module tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredCurriculum.map((module) => {
            const Icon = ICON_MAP[module.icon] || BookOpen;
            const isCollapsed  = !searchTerm && collapsedModules[module.id];
            const completedCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
            const isAllCompleted = completedCount === module.lessons.length && module.lessons.length > 0;
            const isPassed = passedModuleExams.includes(module.id);
            const pct = module.lessons.length ? Math.round((completedCount / module.lessons.length) * 100) : 0;

            return (
              <div key={module.id} className="rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.04)', marginBottom: '2px' }}>

                {/* Module header row */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-2.5 p-2.5 text-left transition-all group"
                  style={{ background: isAllCompleted ? 'rgba(34,211,166,0.03)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = isAllCompleted ? 'rgba(34,211,166,0.03)' : 'transparent'}>

                  {/* Icon */}
                  <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={isAllCompleted ? {
                      background: 'rgba(34,211,166,0.12)',
                      border: '1px solid rgba(34,211,166,0.25)',
                    } : {
                      background: 'rgba(0,229,255,0.06)',
                      border: '1px solid rgba(0,229,255,0.12)',
                    }}>
                    {isAllCompleted
                      ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />
                      : <Icon className="w-3.5 h-3.5" style={{ color: '#00E5FF' }} />}
                  </div>

                  {/* Title + progress */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold truncate" style={{ color: '#C8D0E0' }}>
                      {module.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Mini progress bar */}
                      <div className="flex-1 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: isAllCompleted ? '#22D3A6' : 'rgba(0,229,255,0.6)'
                          }} />
                      </div>
                      <span className="text-[9px] font-mono shrink-0" style={{ color: '#4B5568' }}>
                        {completedCount}/{module.lessons.length}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div style={{ color: '#4B5568' }}>
                    {isCollapsed
                      ? <ChevronRight className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Lesson list */}
                {!isCollapsed && (
                  <div className="px-2 pb-2 pt-0.5 space-y-0.5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    {module.lessons.map(lesson => {
                      const isSelected = lesson.id === currentLessonId;
                      const isComplete = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => { onSelectLesson(lesson.id); onCloseMobile?.(); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-all text-xs"
                          style={isSelected ? {
                            background: 'rgba(0,229,255,0.08)',
                            border: '1px solid rgba(0,229,255,0.22)',
                            color: '#00E5FF',
                          } : {
                            border: '1px solid transparent',
                            color: isComplete ? '#6B7A96' : '#8892AA',
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                              e.currentTarget.style.color = '#EEF0F8';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = isComplete ? '#6B7A96' : '#8892AA';
                            }
                          }}>
                          <div className="shrink-0">
                            {isComplete
                              ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />
                              : <Circle className="w-3.5 h-3.5" style={{ color: '#2D3552' }} />}
                          </div>
                          <span className="truncate font-mono" style={{ fontSize: '11px' }}>{lesson.title}</span>
                          <span className="shrink-0 ml-auto text-[9px] font-mono" style={{ color: '#4B5568' }}>
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}

                    {/* Module checkpoint button */}
                    <button
                      onClick={() => { onOpenModuleCheckpoint?.(module); onCloseMobile?.(); }}
                      className="w-full mt-1.5 px-2.5 py-2 rounded-md flex items-center justify-between transition-all"
                      style={{
                        background: isPassed ? 'rgba(34,211,166,0.05)' : 'rgba(245,158,11,0.06)',
                        border: `1px solid ${isPassed ? 'rgba(34,211,166,0.2)' : 'rgba(245,158,11,0.18)'}`,
                        color: isPassed ? '#22D3A6' : '#F59E0B',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = isPassed ? 'rgba(34,211,166,0.1)' : 'rgba(245,158,11,0.1)';
                        e.currentTarget.style.borderColor = isPassed ? 'rgba(34,211,166,0.35)' : 'rgba(245,158,11,0.3)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isPassed ? 'rgba(34,211,166,0.05)' : 'rgba(245,158,11,0.06)';
                        e.currentTarget.style.borderColor = isPassed ? 'rgba(34,211,166,0.2)' : 'rgba(245,158,11,0.18)';
                      }}>
                      <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold">
                        <FileCheck className="w-3.5 h-3.5" />
                        Checkpoint Test
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={isPassed ? {
                          background: 'rgba(34,211,166,0.15)',
                          color: '#22D3A6'
                        } : {
                          background: 'rgba(245,158,11,0.12)',
                          color: '#F59E0B'
                        }}>
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
