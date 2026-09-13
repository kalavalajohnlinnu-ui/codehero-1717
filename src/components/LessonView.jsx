import React, { useState } from 'react';
import { 
  Target, 
  Lightbulb, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Clock, 
  Tag, 
  Menu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award
} from 'lucide-react';
import { PythieMascot } from './PythieMascot';
import { soundService } from '../services/soundService';

export function LessonView({
  lesson,
  onApplySolution,
  onOpenMobileSidebar,
  onNextLesson,
  onOpenCheckpoint,
  isComplete,
  isHeroMode = true,
  pythieMood = 'idle',
  pythieSpeech,
  mascotName = 'Pythie',
  mascotType = 'dragon',
  mascotTitle = 'Coding Companion'
}) {
  const [openHintIndex, setOpenHintIndex] = useState(null);
  const [copiedSolution, setCopiedSolution]   = useState(false);

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4"
        style={{ color: '#4B5568' }}>
        <div className="text-5xl opacity-30">⚡</div>
        <p className="text-sm font-mono text-center" style={{ color: '#4B5568' }}>
          Select a lesson from the curriculum to begin.
        </p>
      </div>
    );
  }

  const toggleHint = (index) => {
    soundService.playClick();
    setOpenHintIndex(prev => prev === index ? null : index);
  };

  const handleCopySolution = (sol) => {
    soundService.playClick();
    navigator.clipboard.writeText(sol);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleInsertSolution = (sol) => {
    soundService.playMagic();
    onApplySolution(sol);
  };

  // ── Markdown renderer ─────────────────────────────────
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer  = [];
    let lang        = '';

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${idx}`}
              className="my-3 rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(0,229,255,0.12)', background: '#070911' }}>
              {/* Code title bar */}
              <div className="flex items-center gap-2 px-4 py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,83,112,0.6)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(245,158,11,0.6)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(34,211,166,0.6)' }} />
                </div>
                {lang && <span className="text-[10px] font-mono" style={{ color: '#4B5568' }}>{lang}</span>}
              </div>
              <pre className="p-4 overflow-x-auto text-xs leading-relaxed"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: '#22D3A6' }}>
                {codeBuffer.join('\n')}
              </pre>
            </div>
          );
          codeBuffer = [];
          lang = '';
          inCodeBlock = false;
        } else {
          lang = line.replace('```', '').trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) { codeBuffer.push(line); return; }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-sm font-bold mt-5 mb-2 flex items-center gap-2"
            style={{ color: '#EEF0F8' }}>
            <span className="w-1 h-4 rounded-full inline-block shrink-0"
              style={{ background: '#00E5FF' }} />
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={idx} className="text-xs font-bold mt-3 mb-1.5"
            style={{ color: '#00E5FF' }}>
            {line.replace('#### ', '')}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={idx} className="text-xs ml-4 mb-1.5 leading-relaxed flex items-start gap-2"
            style={{ color: '#8892AA', listStyle: 'none' }}>
            <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: '#00E5FF', display: 'inline-block' }} />
            <span>{formatInline(line.replace('- ', ''))}</span>
          </li>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={idx}
            className="my-3 px-4 py-3 rounded-r-xl text-xs italic"
            style={{
              borderLeft: '3px solid #F59E0B',
              background: 'rgba(245,158,11,0.06)',
              color: '#C8A96A'
            }}>
            {formatInline(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs leading-relaxed" style={{ color: '#8892AA' }}>
            {formatInline(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const formatInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i}
            className="px-1.5 py-0.5 rounded text-[11px] font-semibold"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.15)',
              color: '#00E5FF',
            }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold" style={{ color: '#EEF0F8' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-2xl mx-auto w-full">

      {/* Mobile sidebar toggle */}
      <div className="flex items-center justify-between lg:hidden pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={onOpenMobileSidebar}
          className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-mono transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#8892AA'
          }}>
          <Menu className="w-3.5 h-3.5" style={{ color: '#00E5FF' }} />
          <span>Curriculum</span>
        </button>
      </div>

      {/* Mascot companion (Hero Mode) */}
      {isHeroMode && (
        <div className="pt-1">
          <PythieMascot
            mood={pythieMood}
            speechText={pythieSpeech}
            isHeroMode={isHeroMode}
            mascotName={mascotName}
            mascotType={mascotType}
            mascotTitle={mascotTitle}
          />
        </div>
      )}

      {/* ── Lesson title & meta ─────────────────────── */}
      <div>
        <div className="flex items-center flex-wrap gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.18)',
              color: '#00E5FF'
            }}>
            <Tag className="w-2.5 h-2.5" />
            {lesson.badge}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono"
            style={{ color: '#4B5568' }}>
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold"
              style={{
                background: 'rgba(34,211,166,0.1)',
                border: '1px solid rgba(34,211,166,0.25)',
                color: '#22D3A6'
              }}>
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {lesson.title}
        </h2>
      </div>

      {/* ── Concept explanation ─────────────────────── */}
      <div className="rounded-xl p-4 sm:p-5"
        style={{
          background: 'rgba(10,12,20,0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
        <div className="space-y-1.5">
          {renderMarkdown(lesson.concept)}
        </div>
      </div>

      {/* ── Mission / Task box ───────────────────────── */}
      <div className="rounded-xl p-4 sm:p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(0,229,255,0.02) 100%)',
          border: '1px solid rgba(0,229,255,0.2)',
        }}>
        {/* Subtle top-right glow */}
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 0%, rgba(0,229,255,0.06) 0%, transparent 70%)' }} />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.25)' }}>
              <Target className="w-3.5 h-3.5" style={{ color: '#00E5FF' }} />
            </div>
            <span className="text-sm font-bold" style={{ color: '#00E5FF', fontFamily: "'JetBrains Mono', monospace" }}>
              Your Mission
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
              color: '#F59E0B'
            }}>
            +25 XP
          </span>
        </div>

        <p className="text-xs leading-relaxed font-sans whitespace-pre-line"
          style={{ color: '#C8D0E0', fontWeight: 500 }}>
          {lesson.task}
        </p>

        {/* Goal checklist */}
        {lesson.tests?.length > 0 && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,229,255,0.1)' }}>
            <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: '#4B5568' }}>
              Goal Checklist
            </div>
            <ul className="space-y-1.5">
              {lesson.tests.map((t, idx) => (
                <li key={idx} className="text-xs flex items-center gap-2.5"
                  style={{ color: '#8892AA' }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-mono text-[9px] font-bold"
                    style={{
                      background: 'rgba(0,229,255,0.1)',
                      border: '1px solid rgba(0,229,255,0.2)',
                      color: '#00E5FF'
                    }}>
                    {idx + 1}
                  </span>
                  <span>{t.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Progressive hints ───────────────────────── */}
      {lesson.hints?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold"
            style={{ color: '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>
            <Lightbulb className="w-4 h-4" style={{ color: '#F59E0B' }} />
            Need a Hint?
          </div>

          <div className="space-y-1.5">
            {lesson.hints.map((hint, index) => {
              const isOpen     = openHintIndex === index;
              const isLastHint = index === lesson.hints.length - 1;
              const hintLabels = ['What to think about', 'Code structure hint', 'Complete Solution'];

              return (
                <div key={index} className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => toggleHint(index)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs transition-all"
                    style={{
                      background: isOpen ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)',
                      color: '#8892AA',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold"
                        style={{
                          background: isOpen ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isOpen ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.08)'}`,
                          color: isOpen ? '#F59E0B' : '#6B7A96'
                        }}>
                        {index + 1}
                      </span>
                      <span className="font-semibold" style={{ color: isOpen ? '#F59E0B' : '#8892AA' }}>
                        Clue {index + 1}: {hintLabels[index] || 'Hint'}
                      </span>
                    </span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      : <ChevronRight className="w-4 h-4" style={{ color: '#4B5568' }} />}
                  </button>

                  {isOpen && (
                    <div className="p-4 text-xs leading-relaxed"
                      style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(0,0,0,0.2)',
                        color: '#C8D0E0'
                      }}>
                      <p>{hint}</p>

                      {isLastHint && lesson.solution && (
                        <div className="mt-3 pt-3 flex items-center gap-2 flex-wrap"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <button
                            onClick={() => handleInsertSolution(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                            style={{
                              background: 'rgba(245,158,11,0.1)',
                              border: '1px solid rgba(245,158,11,0.3)',
                              color: '#F59E0B'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}>
                            <Sparkles className="w-3.5 h-3.5" />
                            Apply to Editor
                          </button>

                          <button
                            onClick={() => handleCopySolution(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all"
                            style={{
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.09)',
                              color: '#6B7A96'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#EEF0F8'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#6B7A96'; }}>
                            {copiedSolution
                              ? <Check className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />
                              : <Copy className="w-3.5 h-3.5" />}
                            {copiedSolution ? 'Copied!' : 'Copy Solution'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Continue / Checkpoint ───────────────────── */}
      {isComplete && (
        <div className="pt-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {onOpenCheckpoint && (
            <button
              onClick={() => { soundService.playClick(); onOpenCheckpoint(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#F59E0B'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; }}>
              <Award className="w-3.5 h-3.5" />
              Module Checkpoint
            </button>
          )}

          {onNextLesson && (
            <button
              onClick={() => { soundService.playClick(); onNextLesson(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs ml-auto transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #00B4CC 100%)',
                color: '#06080F',
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: '0 2px 0 #00697A, 0 4px 20px rgba(0,229,255,0.25)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 3px 0 #00697A, 0 6px 28px rgba(0,229,255,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 0 #00697A, 0 4px 20px rgba(0,229,255,0.25)';
              }}>
              Continue Next Lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
