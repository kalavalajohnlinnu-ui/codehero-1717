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
  const [openHintIndex, setOpenHintIndex]     = useState(null);
  const [copiedSolution, setCopiedSolution]   = useState(false);

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3 text-slate-400">
        <div className="text-4xl opacity-40">⚡</div>
        <p className="text-xs font-mono text-center">
          Select a quest from the curriculum map to begin learning.
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

  // ── Markdown renderer in light mode ─────────────────────
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
            <div key={`code-${idx}`} className="my-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
              <div className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-200 bg-slate-100/70">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                {lang && <span className="text-[10px] font-mono text-slate-500 font-semibold">{lang}</span>}
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs leading-relaxed font-mono text-slate-800">
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
          <h3 key={idx} className="text-sm font-bold mt-4 mb-2 flex items-center gap-2 text-slate-900">
            <span className="w-1.5 h-4 rounded-full bg-sky-600 inline-block shrink-0" />
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={idx} className="text-xs font-bold mt-3 mb-1.5 text-sky-700">
            {line.replace('#### ', '')}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={idx} className="text-xs ml-4 mb-1.5 leading-relaxed flex items-start gap-2 text-slate-600 list-none">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-sky-500 inline-block" />
            <span>{formatInline(line.replace('- ', ''))}</span>
          </li>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={idx} className="my-2.5 px-3.5 py-2.5 rounded-r-xl text-xs italic border-l-4 border-amber-500 bg-amber-50 text-amber-900">
            {formatInline(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs leading-relaxed text-slate-700">
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
          <code key={i} className="px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-2xl mx-auto w-full bg-white text-slate-900">

      {/* Mobile sidebar toggle */}
      <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-200">
        <button
          onClick={onOpenMobileSidebar}
          className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all font-semibold"
        >
          <Menu className="w-3.5 h-3.5 text-sky-600" />
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
        <div className="flex items-center flex-wrap gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
            <Tag className="w-2.5 h-2.5" />
            {lesson.badge}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 font-semibold">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          {lesson.title}
        </h2>
      </div>

      {/* ── Concept explanation card ───────────────── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200 shadow-sm space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1">
          Lesson Concept
        </div>
        {renderMarkdown(lesson.concept)}
      </div>

      {/* ── Mission / Task challenge box ───────────── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-sky-50/70 border-2 border-sky-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sky-100 border border-sky-300 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-sky-700" />
            </div>
            <span className="text-xs font-mono font-bold text-sky-900 uppercase tracking-wider">
              Your Coding Mission
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
            +25 XP
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line font-medium">
          {lesson.task}
        </p>

        {/* Goal checklist */}
        {lesson.tests?.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-sky-200">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-1.5">
              Goal Checklist
            </div>
            <ul className="space-y-1.5">
              {lesson.tests.map((t, idx) => (
                <li key={idx} className="text-xs flex items-center gap-2 text-slate-700">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-mono text-[9px] font-bold bg-sky-200 text-sky-800">
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 font-mono">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Need a Clue?</span>
          </div>

          <div className="space-y-1.5">
            {lesson.hints.map((hint, index) => {
              const isOpen = openHintIndex === index;
              const isLastHint = index === lesson.hints.length - 1;
              const hintLabels = ['What to think about', 'Code structure hint', 'Complete Solution'];

              return (
                <div key={index} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <button
                    onClick={() => toggleHint(index)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-mono transition-colors hover:bg-slate-100/70"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-700">
                        Clue {index + 1}: {hintLabels[index] || 'Hint'}
                      </span>
                    </span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-amber-600" />
                      : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 bg-white border-t border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                      <p>{hint}</p>

                      {isLastHint && lesson.solution && (
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleInsertSolution(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Apply to My Editor</span>
                          </button>

                          <button
                            onClick={() => handleCopySolution(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          >
                            {copiedSolution
                              ? <Check className="w-3.5 h-3.5 text-emerald-600" />
                              : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSolution ? 'Copied!' : 'Copy Solution'}</span>
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

      {/* ── Advance to Next Quest Button ────────────── */}
      {isComplete && (
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          {onOpenCheckpoint && (
            <button
              onClick={() => { soundService.playClick(); onOpenCheckpoint(); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Module Checkpoint</span>
            </button>
          )}

          {onNextLesson && (
            <button
              onClick={() => { soundService.playClick(); onNextLesson(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs font-mono ml-auto transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 active:scale-95"
            >
              <span>Continue Next Quest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
