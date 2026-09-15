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
  Award,
  Code2,
  Zap,
  ShieldAlert,
  Flame,
  Play,
  Layers,
  BookOpen
} from 'lucide-react';
import { PythieMascot } from './PythieMascot';
import { soundService } from '../services/soundService';
import { lessonPracticeService } from '../services/lessonPracticeService';

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
  mascotTitle = 'Coding Companion',
  currentLanguageId = 'python'
}) {
  const [openHintIndex, setOpenHintIndex]       = useState(null);
  const [copiedSolution, setCopiedSolution]     = useState(false);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [activeDrillIndex, setActiveDrillIndex]     = useState(0);
  const [toastMessage, setToastMessage]         = useState(null);

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3 text-slate-400 bg-[#0B0F19]">
        <div className="text-4xl opacity-40">⚡</div>
        <p className="text-xs font-mono text-center text-slate-400">
          Select a quest from the curriculum map to begin learning.
        </p>
      </div>
    );
  }

  // Load examples & 3-way practice drills for this lesson
  const { examples, drills } = lessonPracticeService.getLessonExamplesAndDrills(lesson, currentLanguageId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleHint = (index) => {
    soundService.playClick();
    setOpenHintIndex(prev => prev === index ? null : index);
  };

  const handleCopyCode = (text) => {
    soundService.playClick();
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const handleApplyToEditor = (code, sourceName) => {
    soundService.playMagic();
    onApplySolution(code);
    showToast(`Loaded ${sourceName} into Editor! →`);
  };

  // ── Markdown renderer in peak dark studio ─────────────────────
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
            <div key={`code-${idx}`} className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#070A11] shadow-inner">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  {lang && <span className="text-[10px] font-mono text-slate-400 ml-2 font-semibold">{lang}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeBuffer.join('\n'))}
                  className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs leading-relaxed font-mono text-[#38BDF8] selection:bg-sky-500/30">
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
          <h3 key={idx} className="text-sm font-black mt-4 mb-2 flex items-center gap-2 text-white font-display">
            <span className="w-1.5 h-4 rounded-full bg-[#FCD34D] inline-block shrink-0" />
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={idx} className="text-xs font-bold mt-3 mb-1.5 text-sky-400 font-mono uppercase tracking-wider">
            {line.replace('#### ', '')}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={idx} className="text-xs ml-4 mb-1.5 leading-relaxed flex items-start gap-2 text-slate-300 list-none">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#FCD34D] inline-block" />
            <span>{formatInline(line.replace('- ', ''))}</span>
          </li>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={idx} className="my-2.5 px-3.5 py-2.5 rounded-r-xl text-xs italic border-l-4 border-[#FCD34D] bg-[#FCD34D]/10 text-amber-200">
            {formatInline(line.replace('> ', ''))}
          </blockquote>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs leading-relaxed text-slate-300">
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
          <code key={i} className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-white/10 text-[#38BDF8] border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 max-w-2xl mx-auto w-full bg-[#0B0F19] text-slate-100 select-none">

      {/* Floating Action Confirmation Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#FCD34D] text-slate-950 font-mono font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile curriculum sidebar button */}
      <div className="flex items-center justify-between lg:hidden pb-3 border-b border-white/10">
        <button
          onClick={onOpenMobileSidebar}
          className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all font-semibold"
        >
          <Menu className="w-3.5 h-3.5 text-[#FCD34D]" />
          <span>Curriculum Map</span>
        </button>
      </div>

      {/* Mascot companion in Hero Mode */}
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

      {/* ── 01. Lesson Title & Meta Header ─────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider bg-[#FCD34D]/15 text-[#FCD34D] border border-[#FCD34D]/30">
            <Tag className="w-2.5 h-2.5" />
            {lesson.badge}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 font-semibold">
            <Clock className="w-3 h-3 text-slate-500" />
            {lesson.duration}
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm animate-pulse">
              <CheckCircle2 className="w-3 h-3" />
              Mastered
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
          {lesson.title}
        </h2>
      </div>

      {/* ── 02. Concept Explanation Card ───────────────── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-[#111625] border border-white/10 shadow-xl space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FCD34D] font-extrabold flex items-center gap-2">
          <BookOpen size={12} />
          <span>01 // CORE CONCEPT & ARCHITECTURE</span>
        </div>
        <div className="pt-1">
          {renderMarkdown(lesson.concept)}
        </div>
      </div>

      {/* ── 03. Multi-Angle Code Examples & Mental Models ── */}
      {examples?.length > 0 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-[#111625] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-400 font-extrabold flex items-center gap-2">
              <Code2 size={13} />
              <span>02 // CODE EXAMPLES & MENTAL MODELS</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {examples.length} Patterns
            </span>
          </div>

          {/* Example Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto">
            {examples.map((ex, idx) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => { soundService.playClick(); setActiveExampleIndex(idx); }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeExampleIndex === idx
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ex.category}
              </button>
            ))}
          </div>

          {/* Active Example Display */}
          {examples[activeExampleIndex] && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white font-mono">
                  {examples[activeExampleIndex].title}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-extrabold">
                  {examples[activeExampleIndex].badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {examples[activeExampleIndex].explanation}
              </p>

              {/* Code Snippet Box */}
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#070A11] shadow-inner">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    Runnable Code Example
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(examples[activeExampleIndex].code)}
                      className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy size={11} />
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyToEditor(examples[activeExampleIndex].code, examples[activeExampleIndex].category + ' Example')}
                      className="text-[10px] font-mono text-[#FCD34D] hover:underline flex items-center gap-1 cursor-pointer font-bold transition-colors"
                    >
                      <Sparkles size={11} />
                      <span>Try in Editor →</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3.5 overflow-x-auto text-xs leading-relaxed font-mono text-[#38BDF8] selection:bg-sky-500/30">
                  {examples[activeExampleIndex].code}
                </pre>
              </div>

              {/* Pro Tip */}
              {examples[activeExampleIndex].tip && (
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-200 font-medium flex items-start gap-2">
                  <Lightbulb size={14} className="text-[#FCD34D] shrink-0 mt-0.5" />
                  <span>{examples[activeExampleIndex].tip}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 04. Mission / Coding Task Box ───────────── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-sky-950/40 via-[#111625] to-[#111625] border-2 border-sky-500/40 shadow-xl relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
              03 // YOUR CODING MISSION
            </span>
          </div>
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#FCD34D] text-slate-950 shadow-sm">
            +25 XP
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line font-medium">
          {lesson.task}
        </p>

        {/* Goal Checklist */}
        {lesson.tests?.length > 0 && (
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Verification Criteria
            </div>
            <ul className="space-y-1.5">
              {lesson.tests.map((t, idx) => (
                <li key={idx} className="text-xs flex items-center gap-2 text-slate-300 font-mono">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {idx + 1}
                  </span>
                  <span>{t.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── 05. Multi-Angle Mastery Practice Drills ("Practice in 3 Ways") ── */}
      {drills?.length > 0 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-[#111625] border border-white/10 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FCD34D] font-extrabold flex items-center gap-2">
              <Zap size={13} />
              <span>04 // MASTERY DRILLS — PRACTICE IN 3 WAYS</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              3 Variations
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Cement your understanding across different angles. Click any drill below to load its challenge into your editor:
          </p>

          {/* Drill Selector Pills */}
          <div className="grid grid-cols-3 gap-2">
            {drills.map((drill, idx) => (
              <button
                key={drill.id}
                type="button"
                onClick={() => { soundService.playClick(); setActiveDrillIndex(idx); }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer touch-manipulation ${
                  activeDrillIndex === idx
                    ? 'bg-white/10 border-[#FCD34D] shadow-md ring-1 ring-[#FCD34D]/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] font-mono font-black uppercase text-slate-400 truncate">
                  {drill.type}
                </div>
                <div className="text-xs font-black text-white truncate mt-0.5">
                  {drill.tag}
                </div>
              </button>
            ))}
          </div>

          {/* Active Drill Card */}
          {drills[activeDrillIndex] && (
            <div className="p-4 rounded-xl bg-[#070A11] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-white">
                  {drills[activeDrillIndex].title}
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-[#FCD34D] border border-white/10">
                  {drills[activeDrillIndex].difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {drills[activeDrillIndex].goal}
              </p>

              {/* Action Button: Load into Editor */}
              <button
                type="button"
                onClick={() => handleApplyToEditor(drills[activeDrillIndex].starterCode, drills[activeDrillIndex].title)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FCD34D] hover:bg-[#FACC15] text-slate-950 font-black text-xs font-mono shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all touch-manipulation"
              >
                <Play size={13} className="fill-current" />
                <span>Load Drill into Editor & Practice →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 06. Progressive Clues & Hints ───────────────────────── */}
      {lesson.hints?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>05 // NEED A CLUE?</span>
          </div>

          <div className="space-y-1.5">
            {lesson.hints.map((hint, index) => {
              const isOpen = openHintIndex === index;
              const isLastHint = index === lesson.hints.length - 1;
              const hintLabels = ['Conceptual angle', 'Code structure hint', 'Official Solution'];

              return (
                <div key={index} className="rounded-xl overflow-hidden border border-white/10 bg-[#111625]">
                  <button
                    onClick={() => toggleHint(index)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-mono transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold bg-[#FCD34D]/20 text-[#FCD34D] border border-[#FCD34D]/40">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-200">
                        Clue {index + 1}: {hintLabels[index] || 'Hint'}
                      </span>
                    </span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-[#FCD34D]" />
                      : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-3.5 bg-[#070A11] border-t border-white/10 text-xs text-slate-300 leading-relaxed font-sans space-y-3">
                      <p>{hint}</p>

                      {isLastHint && lesson.solution && (
                        <div className="pt-2 border-t border-white/10 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleApplyToEditor(lesson.solution, 'Official Solution')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all bg-[#FCD34D] hover:bg-[#FACC15] text-slate-950 shadow-sm cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Apply to My Editor</span>
                          </button>

                          <button
                            onClick={() => handleCopyCode(lesson.solution)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Solution</span>
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

      {/* ── 07. Quest Completed Victory Banner & Next Quest Action ────────────── */}
      {isComplete && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#111625] to-amber-950/30 border-2 border-emerald-500/40 shadow-xl flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-black text-white font-mono">QUEST COMPLETED!</div>
              <div className="text-[10px] text-emerald-300 font-mono">Full XP & mastery recorded</div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onOpenCheckpoint && (
              <button
                onClick={() => { soundService.playClick(); onOpenCheckpoint(); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-[#FCD34D]" />
                <span>Checkpoint</span>
              </button>
            )}

            {onNextLesson && (
              <button
                onClick={() => { soundService.playClick(); onNextLesson(); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs font-mono transition-all bg-[#FCD34D] hover:bg-[#FACC15] text-slate-950 shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer touch-manipulation"
              >
                <span>Continue Next Quest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonView;
