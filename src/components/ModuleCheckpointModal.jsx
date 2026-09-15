import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  X, 
  Play, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Clock 
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { runMultiLanguageCode, evaluateMultiLanguageLessonTests } from '../services/multiLangService';
import { soundService } from '../services/soundService';

export function ModuleCheckpointModal({
  isOpen,
  onClose,
  module,
  currentLanguageId = 'python',
  pyodideInstance,
  onPassModule
}) {
  const [currentStep, setCurrentStep] = useState(0); // 0: Concept question, 1: Quick code task, 2: Pass celebration
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [codePassed, setCodePassed] = useState(false);

  if (!isOpen || !module) return null;

  const firstLesson = module.lessons?.[0] || {};
  const lastLesson = module.lessons?.[module.lessons.length - 1] || {};

  const conceptQuestion = {
    prompt: `Knowledge Check: In ${module.title}, what is the primary purpose of the concepts you just practiced?`,
    options: [
      `To structure, store, and manipulate data correctly in ${currentLanguageId.toUpperCase()}`,
      `To shut down the computer operating system`,
      `To bypass syntax compilation rules entirely`,
      `To increase hard drive disk space`
    ],
    correctIndex: 0
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    soundService.playClick();
    setSelectedOption(idx);
  };

  const handleVerifyConcept = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === conceptQuestion.correctIndex) {
      soundService.playSuccess();
      setIsCorrect(true);
      setUserCode(lastLesson.starterCode || `# Solve the ${module.title} checkpoint\n`);
    } else {
      soundService.playFail();
      setIsCorrect(false);
    }
  };

  const handleRunCodeTest = async () => {
    setIsRunning(true);
    try {
      const execResult = await runMultiLanguageCode(userCode, currentLanguageId, pyodideInstance, lastLesson);
      if (lastLesson.tests && lastLesson.tests.length > 0) {
        const evalResult = evaluateMultiLanguageLessonTests(execResult, lastLesson.tests, userCode, currentLanguageId);
        if (evalResult.allPassed) {
          soundService.playSuccess();
          setCodePassed(true);
        } else {
          soundService.playFail();
        }
      } else {
        if (!execResult.error) {
          soundService.playSuccess();
          setCodePassed(true);
        } else {
          soundService.playFail();
        }
      }
    } catch (err) {
      soundService.playFail();
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinishCheckpoint = () => {
    soundService.playSuccess();
    onPassModule?.(module.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-slate-200 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl flex flex-col text-slate-900 relative overflow-hidden max-h-[90vh] animate-cinematic-page"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-bold">
              📝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">
                  Module Mini-Quiz
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Step {currentStep + 1} of 2
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {module.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-all shadow-xs"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 0: CONCEPT QUIZ */}
        {currentStep === 0 && (
          <div className="space-y-4 overflow-y-auto flex-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-mono uppercase text-sky-700 font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Question 1: Check Your Understanding</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {conceptQuestion.prompt}
              </p>
            </div>

            <div className="space-y-2">
              {conceptQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isTargetCorrect = idx === conceptQuestion.correctIndex;
                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';

                if (isAnswerSubmitted) {
                  if (isTargetCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-sky-50 border-sky-300 text-sky-900 font-bold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono flex items-center justify-center font-bold text-slate-600">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>

                    {isAnswerSubmitted && isTargetCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isTargetCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                {!isAnswerSubmitted ? 'Choose an option above' : (isCorrect ? '✅ Correct! Ready for step 2' : '❌ Try again')}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleVerifyConcept}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md"
                >
                  Check Answer
                </button>
              ) : isCorrect ? (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Next: Small Coding Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAnswerSubmitted(false);
                    setSelectedOption(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: QUICK CODE CHALLENGE */}
        {currentStep === 1 && (
          <div className="space-y-4 overflow-y-auto flex-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-mono uppercase text-amber-700 font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Question 2: Practice in Code</span>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {lastLesson.task || `Complete the exercise code below to finish the quiz for ${module.title}.`}
              </p>
            </div>

            {/* Code Editor */}
            <div className="h-52 border border-slate-200 rounded-2xl overflow-hidden">
              <CodeEditor
                code={userCode}
                onChange={setUserCode}
                onRun={handleRunCodeTest}
                onReset={() => setUserCode(lastLesson.starterCode || '')}
                isRunning={isRunning}
                language={currentLanguageId}
                isHeroMode={false}
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs font-mono">
                {codePassed ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Module Mastery Verified (+50 XP)!</span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">
                    Click "Run & Test" in editor to verify your code.
                  </span>
                )}
              </div>

              {codePassed ? (
                <button
                  onClick={handleFinishCheckpoint}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Claim Mastery & Continue</span>
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
