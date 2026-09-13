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
  HelpCircle,
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
  const [copiedSolution, setCopiedSolution] = useState(false);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
        Select a quest from the curriculum map to begin your adventure!
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

  // Simple Markdown parser for concept view
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${idx}`} className="my-3 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs text-sky-200 overflow-x-auto shadow-inner">
              <pre>{codeBuffer.join('\n')}</pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-base font-extrabold text-white mt-4 mb-2 flex items-center gap-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-sky-300 mt-3 mb-1.5 flex items-center gap-1.5">
            <span>✨</span>
            <span>{line.replace('#### ', '')}</span>
          </h4>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={idx} className="text-xs text-slate-300 ml-4 list-disc mb-1.5 leading-relaxed">
            {formatInline(line.replace('- ', ''))}
          </li>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={idx} className="border-l-4 border-amber-400 pl-3.5 my-2.5 text-xs text-amber-200/90 italic bg-amber-500/10 py-2 rounded-r-xl">
            {formatInline(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-slate-300 leading-relaxed">
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
          <code key={i} className="bg-slate-800 text-sky-300 font-mono text-[11px] px-1.5 py-0.5 rounded-md border border-slate-700/60 font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-2xl mx-auto w-full">
      {/* Top Mobile Menu Toggle */}
      <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
        <button
          onClick={onOpenMobileSidebar}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 font-medium"
        >
          <Menu className="w-3.5 h-3.5 text-sky-400" />
          <span>Curriculum Quests</span>
        </button>
      </div>

      {/* Pythie Mascot Companion Bar (In Hero Mode) */}
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

      {/* Lesson Title & Quest Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 uppercase tracking-wide">
            <Tag className="w-2.5 h-2.5" />
            {lesson.badge}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse-subtle">
              ⭐ Quest Mastered!
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          {lesson.title}
        </h2>
      </div>

      {/* Lesson Concept & Notes */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="space-y-2">
          {renderMarkdown(lesson.concept)}
        </div>
      </div>

      {/* Your Mission Challenge Box */}
      <div className="rounded-3xl border-2 border-sky-500/40 bg-gradient-to-b from-sky-950/40 via-slate-900/60 to-slate-950 p-4 sm:p-5 relative overflow-hidden shadow-xl shadow-sky-500/5">
        <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Target className="w-4 h-4 text-sky-400 animate-spin-slow" />
            <span>🎯 Your Hero Mission</span>
          </div>

          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            +25 XP
          </span>
        </div>

        <p className="text-xs text-slate-100 leading-relaxed font-sans whitespace-pre-line font-medium">
          {lesson.task}
        </p>

        {/* Verification Checklist */}
        {lesson.tests && lesson.tests.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-sky-500/20">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
              Goal Checklist:
            </div>
            <ul className="space-y-1.5">
              {lesson.tests.map((t, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  <span>{t.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Progressive Hints & Solution */}
      {lesson.hints && lesson.hints.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Need a Clue? (Ask Detective Pythie)</span>
          </div>

          <div className="space-y-1.5">
            {lesson.hints.map((hint, index) => {
              const isOpen = openHintIndex === index;
              const isLastHint = index === lesson.hints.length - 1;

              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleHint(index)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[11px] flex items-center justify-center font-mono text-amber-400 font-bold">
                        {index + 1}
                      </span>
                      <span>
                        {index === 0 ? "Clue 1: What to think about" : index === 1 ? "Clue 2: Code structure hint" : "Clue 3: Complete Solution Reveal"}
                      </span>
                    </span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                      <p>{hint}</p>

                      {isLastHint && lesson.solution && (
                        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleInsertSolution(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-xl transition-all shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Apply Fix to My Editor</span>
                          </button>

                          <button
                            onClick={() => handleCopySolution(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                          >
                            {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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

      {/* Advance to Next Quest Button */}
      {isComplete && (
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          {onOpenCheckpoint && (
            <button
              onClick={() => {
                soundService.playClick();
                onOpenCheckpoint();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all shadow-sm"
            >
              <span>📝 Module Checkpoint Exam</span>
            </button>
          )}

          {onNextLesson && (
            <button
              onClick={() => {
                soundService.playClick();
                onNextLesson();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-xl hover:opacity-95 transition-all active:scale-95 ml-auto"
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
