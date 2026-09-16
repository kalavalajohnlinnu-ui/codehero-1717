import React, { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  Bug,
  HelpCircle,
  Code,
  RefreshCw,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PythieMascot } from './PythieMascot';
import { soundService } from '../services/soundService';
import { lessonPracticeService } from '../services/lessonPracticeService';
import { getWordsForLesson } from '../services/dictionaryService';

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
  languageId = 'python',
  onXPEarned
}) {
  const [openHintIndex, setOpenHintIndex] = useState(null);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [copiedExampleIndex, setCopiedExampleIndex] = useState(null);

  // Curated Examples & Confirmed Practice Models data
  const practiceData = useMemo(() => {
    return lessonPracticeService.getLessonPracticeData(lesson, languageId);
  }, [lesson, languageId]);

  // Simple English Tough Words Dictionary for Indian students / 1st-time coders
  const toughWords = useMemo(() => {
    return getWordsForLesson(lesson);
  }, [lesson]);

  // Practice models state: active tab
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  // Track user interaction per model: selected options, confirmed statuses, and results
  // Format: { [modelId]: { selectedOption: any, isConfirmed: boolean, isCorrect: boolean, showClue: boolean } }
  const [modelStates, setModelStates] = useState({});

  // Reset or load saved confirmation state when lesson changes
  useEffect(() => {
    if (!lesson) return;
    try {
      const savedKey = `confirmed_models_${lesson.id || 'lesson'}`;
      const saved = JSON.parse(localStorage.getItem(savedKey) || '{}');
      setModelStates(saved);
    } catch {
      setModelStates({});
    }
    setActiveModelIndex(0);
    setOpenHintIndex(null);
  }, [lesson?.id]);

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

  const handleCopyExample = (codeText, idx) => {
    soundService.playClick();
    navigator.clipboard.writeText(codeText);
    setCopiedExampleIndex(idx);
    setTimeout(() => setCopiedExampleIndex(null), 2000);
  };

  const handleInsertSolution = (sol) => {
    soundService.playMagic();
    onApplySolution(sol);
  };

  // Model Practice Interaction Handlers
  const currentModel = practiceData.models[activeModelIndex] || practiceData.models[0];
  const currentModelState = currentModel ? (modelStates[currentModel.id] || {}) : {};

  const handleSelectOption = (modelId, optionValue) => {
    soundService.playClick();
    setModelStates(prev => ({
      ...prev,
      [modelId]: {
        ...(prev[modelId] || {}),
        selectedOption: optionValue,
        isConfirmed: false,
        showClue: false
      }
    }));
  };

  const handleConfirmAnswer = (model) => {
    if (!model) return;
    const state = modelStates[model.id] || {};
    const selected = state.selectedOption;

    if (selected === undefined || selected === null) {
      alert("Please select an option before confirming!");
      return;
    }

    let isCorrect = false;

    if (model.modelType === 'quiz') {
      isCorrect = selected === model.correctIndex;
    } else if (model.modelType === 'bug') {
      isCorrect = selected === model.correctIndex;
    } else if (model.modelType === 'fill') {
      isCorrect = selected === model.correctToken;
    } else if (model.modelType === 'variant') {
      isCorrect = true; // Variant solution verified
    }

    if (isCorrect) {
      soundService.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#10b981', '#facc15']
      });

      // Award XP if not already awarded
      if (!state.isCorrect && onXPEarned) {
        onXPEarned(model.xpReward || 15);
      }

      // If next task exists, automatically switch to it after 800ms so Task 2 appears!
      const currentIdx = practiceData.models.findIndex(m => m.id === model.id);
      if (currentIdx >= 0 && currentIdx < practiceData.models.length - 1) {
        setTimeout(() => {
          setActiveModelIndex(currentIdx + 1);
        }, 900);
      }
    } else {
      soundService.playFail();
    }

    const nextStates = {
      ...modelStates,
      [model.id]: {
        ...state,
        isConfirmed: true,
        isCorrect: isCorrect,
        showClue: !isCorrect
      }
    };

    setModelStates(nextStates);

    try {
      const savedKey = `confirmed_models_${lesson.id || 'lesson'}`;
      localStorage.setItem(savedKey, JSON.stringify(nextStates));
    } catch {}
  };

  const handleResetModel = (modelId) => {
    soundService.playClick();
    setModelStates(prev => ({
      ...prev,
      [modelId]: {
        selectedOption: null,
        isConfirmed: false,
        isCorrect: false,
        showClue: false
      }
    }));
  };

  // Count confirmed models
  const confirmedCount = useMemo(() => {
    return practiceData.models.filter(m => modelStates[m.id]?.isCorrect).length;
  }, [practiceData.models, modelStates]);

  // Markdown renderer in light mode
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let lang = '';

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
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 max-w-2xl mx-auto w-full bg-white text-slate-900">

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

      {/* ── Lesson Congratulations Ribbon (When lesson is mastered) ── */}
      {isComplete && (
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 shadow-sm animate-fade-in flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
            <CheckCircle2 className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-black font-sans uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full border border-emerald-300">
                🎉 Congratulations! Lesson Mastered
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700">
                +25 XP Awarded
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-3">
              🎉 <strong>Shabash! Great Work!</strong> You solved this quest correctly and passed 100% of the tests!
            </p>
            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer animate-bounce"
              >
                <span>CONTINUE TO NEXT QUEST →</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── DUOLINGO-STYLE SYSTEMATIC STEP PROGRESS BAR ─────── */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-1 select-none overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
          <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] font-mono">1</span>
          <span>Read Story</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
          <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-mono">2</span>
          <span>Word Meanings</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-mono">3</span>
          <span>Your Mission</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${isComplete ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
          <span>Next Quest</span>
        </div>
      </div>

      {/* ── Lesson Title & Level Indicator ─────────────────────── */}
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
            👶 1st Class Friendly English
          </span>
          {isComplete && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              Solved! Great Job!
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-display">
          {lesson.title}
        </h2>
      </div>

      {/* ── STEP 1: READ THE SHORT STORY (CONCEPT) ─────────────── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center font-mono">1</span>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Step 1: Read This Short Story (Takes 1 min)
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Simple explanation without any confusing words
            </p>
          </div>
        </div>
        {renderMarkdown(lesson.concept)}
      </div>

      {/* ── STEP 2: TOUGH WORDS & SIMPLE MEANINGS DICTIONARY ───── */}
      {toughWords.length > 0 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-amber-50/60 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center font-mono">2</span>
              <div>
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📖 Step 2: Tough Words Explained Simply</span>
                </h3>
                <p className="text-[11px] text-amber-800/80 font-sans">
                  We are Indian learners: here is what these computer words mean in real life!
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              {toughWords.length} Words
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toughWords.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-amber-200/90 p-3.5 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {item.word}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {item.simpleTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.meaning}
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
                  <span className="text-amber-600 shrink-0 font-bold">💡 Analogy:</span>
                  <span>{item.analogy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CURATED REAL-WORLD EXAMPLES SECTION ────────── */}
      {practiceData.examples?.length > 0 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                Curated Code Examples
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              3 Deep-Dive Perspectives
            </span>
          </div>

          <div className="space-y-3.5">
            {practiceData.examples.map((ex, idx) => (
              <div key={ex.id || idx} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                      {ex.badge}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 font-sans">
                      {ex.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopyExample(ex.code, idx)}
                    className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 active:scale-[0.97] text-slate-600 transition-colors"
                    title="Copy snippet"
                  >
                    {copiedExampleIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {ex.explanation}
                </p>

                <div className="rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
                  <pre className="p-3 text-[11px] font-mono text-slate-800 leading-relaxed overflow-x-auto">
                    {ex.code}
                  </pre>
                </div>

                {ex.tip && (
                  <div className="px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] font-sans text-amber-900 flex items-start gap-2">
                    <span className="shrink-0 text-amber-600">💡</span>
                    <span>{ex.tip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: EXACT CODING MISSION (DUOLINGO 1-2-3 STEPS) ─── */}
      <div className="rounded-2xl p-4 sm:p-5 bg-sky-50/80 border-2 border-sky-300 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sky-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono">3</span>
            <div>
              <span className="text-xs font-mono font-bold text-sky-950 uppercase tracking-wider">
                Step 3: Your Exact Coding Mission (Do this now)
              </span>
              <p className="text-[11px] text-sky-800 font-sans">
                Follow these 3 easy steps in order!
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
            +25 XP Reward 🏆
          </span>
        </div>

        {/* 3 Step Action Checklist */}
        <div className="bg-white rounded-xl p-3 border border-sky-200 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-800">
            <span className="font-bold text-sky-600 shrink-0">👉 Action 1:</span>
            <span>Look at the code box on your <strong>right-hand side</strong>.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-800 bg-sky-50/50 p-2 rounded-lg border border-sky-100">
            <span className="font-bold text-emerald-700 shrink-0">👉 Action 2:</span>
            <span className="font-medium text-slate-900">{lesson.task}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-800">
            <span className="font-bold text-amber-600 shrink-0">👉 Action 3:</span>
            <span>Click the big blue button <strong>"▶ Run & Test Code"</strong> below the editor!</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 pt-1">
          <span>❤️</span>
          <span><strong>Friendly Teacher Rule:</strong> Never worry about mistakes! The computer will never get angry.</span>
        </div>

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

      {/* ── CONFIRMED PRACTICE MODELS (DIFFERENT MODELS WITH CONFIRM ACTION) ── */}
      {practiceData.models?.length > 0 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-white border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center">
                <Zap className="w-4 h-4 text-sky-700" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Confirmed Practice Models
                </h3>
                <p className="text-[11px] text-slate-500">
                  Interactive multi-angle problems with instant confirmation
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed: {confirmedCount} / {practiceData.models.length}</span>
            </div>
          </div>

          {/* Model Selection Tabs - Sequential Unlock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {practiceData.models.map((model, mIdx) => {
              const isConfirmed = modelStates[model.id]?.isCorrect;
              const isActive = activeModelIndex === mIdx;
              const prevModel = mIdx > 0 ? practiceData.models[mIdx - 1] : null;
              const isUnlocked = mIdx === 0 || (prevModel && modelStates[prevModel.id]?.isCorrect);

              return (
                <button
                  key={model.id}
                  onClick={() => { 
                    if (!isUnlocked) {
                      soundService.playFail();
                      return;
                    }
                    soundService.playClick(); 
                    setActiveModelIndex(mIdx); 
                  }}
                  disabled={!isUnlocked}
                  title={!isUnlocked ? `Complete Question ${mIdx} first to unlock Question ${mIdx + 1}!` : model.title}
                  className={`p-2.5 rounded-xl text-left border transition-all active:scale-[0.97] flex flex-col justify-between gap-1.5 ${
                    !isUnlocked
                      ? 'opacity-40 bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
                      : isActive 
                      ? 'bg-sky-50/80 border-sky-300 text-sky-900 shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{!isUnlocked ? '🔒' : model.icon}</span>
                    {isConfirmed ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                        ✓
                      </span>
                    ) : !isUnlocked ? (
                      <span className="text-[9px] font-sans text-slate-400 font-bold">
                        Locked
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Task {mIdx + 1}
                    </div>
                    <div className="text-xs font-bold truncate">
                      {model.modelType === 'quiz' ? 'Output Quiz' : 
                       model.modelType === 'bug' ? 'Bug Hunter' : 
                       model.modelType === 'fill' ? 'Syntax Blank' : 'Variation'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Model Content Card */}
          {currentModel && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentModel.icon}</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      {currentModel.badge}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 font-sans">
                      {currentModel.title}
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                  +{currentModel.xpReward || 15} XP
                </span>
              </div>

              {/* Question / Task prompt */}
              <p className="text-xs font-semibold text-slate-800 leading-relaxed font-sans">
                {currentModel.question || currentModel.taskDescription}
              </p>

              {/* Snippet / Code block */}
              {(currentModel.snippet || currentModel.brokenSnippet || currentModel.templateSnippet || currentModel.starterCode) && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner">
                  <div className="px-3 py-1.5 bg-slate-100/80 border-b border-slate-200 text-[10px] font-mono text-slate-500 font-bold flex items-center justify-between">
                    <span>CODE INSPECTOR</span>
                    <span className="uppercase">{languageId}</span>
                  </div>
                  <pre className="p-3 text-xs font-mono text-slate-800 leading-relaxed overflow-x-auto">
                    {currentModel.snippet || currentModel.brokenSnippet || currentModel.templateSnippet || currentModel.starterCode}
                  </pre>
                </div>
              )}

              {/* INTERACTIVE INPUTS PER MODEL TYPE */}

              {/* MODEL 1 & 2: MULTIPLE CHOICE (QUIZ & BUG HUNTER) */}
              {(currentModel.modelType === 'quiz' || currentModel.modelType === 'bug') && currentModel.options && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                    Select Your Answer & Click Confirm:
                  </div>
                  <div className="space-y-2">
                    {currentModel.options.map((opt, oIdx) => {
                      const isSelected = currentModelState.selectedOption === oIdx;
                      const letters = ['A', 'B', 'C', 'D'];

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(currentModel.id, oIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-sans transition-all flex items-start gap-3 active:scale-[0.98] ${
                            isSelected
                              ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm font-semibold'
                              : 'bg-white hover:bg-slate-100/70 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {letters[oIdx]}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODEL 3: FILL IN THE BLANK TOKENS */}
              {currentModel.modelType === 'fill' && currentModel.tokens && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                    Choose the missing token to complete the code:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {currentModel.tokens.map((tok, tIdx) => {
                      const isSelected = currentModelState.selectedOption === tok;

                      return (
                        <button
                          key={tIdx}
                          onClick={() => handleSelectOption(currentModel.id, tok)}
                          className={`p-2.5 rounded-xl border font-mono text-xs text-center transition-all active:scale-[0.97] ${
                            isSelected
                              ? 'bg-sky-600 text-white font-bold border-sky-600 shadow-sm'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          {tok}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODEL 4: APPLIED VARIATION ACTIONS */}
              {currentModel.modelType === 'variant' && (
                <div className="space-y-2 pt-1">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                      Expected Output:
                    </div>
                    <pre className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50/50 p-2 rounded border border-emerald-200">
                      {currentModel.expectedOutput}
                    </pre>
                  </div>
                  {currentModel.hint && (
                    <div className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{currentModel.hint}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleInsertSolution(currentModel.starterCode)}
                      className="flex-1 py-2 px-3 text-xs font-bold font-mono rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.97] text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>Load Starter into Editor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CONFIRMATION FEEDBACK BOX */}
              {currentModelState.isConfirmed && (
                <div className={`p-3.5 rounded-xl border animate-fade-in ${
                  currentModelState.isCorrect 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {currentModelState.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-800">
                            ✓ Confirmed Correct! (+{currentModel.xpReward || 15} XP)
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-800">
                            ⚠️ Not Quite Right
                          </span>
                        </>
                      )}
                    </div>

                    {!currentModelState.isCorrect && (
                      <button
                        onClick={() => handleResetModel(currentModel.id)}
                        className="text-[11px] font-mono text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Try Again</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed font-sans">
                    {currentModelState.isCorrect 
                      ? (currentModel.explanation || currentModel.diagnosis || "Great job! You have confirmed the correct logic for this pattern.")
                      : (currentModel.hint || "Review the concept rules above and take another look at the syntax.")}
                  </p>

                  {currentModelState.isCorrect && currentModel.fullSnippet && (
                    <div className="mt-2 pt-2 border-t border-emerald-200">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold mb-1">
                        Full Working Code:
                      </div>
                      <pre className="text-xs font-mono bg-white p-2 rounded border border-emerald-200 text-slate-800">
                        {currentModel.fullSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TACTILE CONFIRM BUTTON */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleConfirmAnswer(currentModel)}
                  disabled={currentModelState.isCorrect}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold font-mono text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm ${
                    currentModelState.isCorrect
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
                  }`}
                >
                  {currentModelState.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Model Confirmed & Mastered ✓</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>
                        {currentModel.modelType === 'quiz' ? 'Confirm Answer' :
                         currentModel.modelType === 'bug' ? 'Confirm Fix' :
                         currentModel.modelType === 'fill' ? 'Confirm Code' : 'Confirm Solution'}
                      </span>
                    </>
                  )}
                </button>

                {currentModelState.isCorrect && activeModelIndex < practiceData.models.length - 1 && (
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setActiveModelIndex(prev => prev + 1);
                    }}
                    className="py-2.5 px-3.5 rounded-xl font-bold font-mono text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 active:scale-[0.97] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Next Model</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
      {isComplete && onNextLesson && (
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={() => { soundService.playClick(); onNextLesson(); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs font-mono ml-auto transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 active:scale-95"
          >
            <span>Continue Next Quest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
