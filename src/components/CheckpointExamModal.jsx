import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  X, 
  Play, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  Terminal,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { runMultiLanguageCode, evaluateMultiLanguageLessonTests } from '../services/multiLangService';
import { soundService } from '../services/soundService';

// Curated checkpoint exam sets for each language
const EXAM_DATA = {
  python: [
    {
      id: 'py-exam-1',
      title: 'Question 1: Palindrome & Case Normalizer',
      prompt: 'Write a function `is_clean_palindrome(s)` that ignores spaces and casing, and returns True if `s` is a palindrome, False otherwise.\nTest with: print(is_clean_palindrome("Race car")) -> True',
      starter: 'def is_clean_palindrome(s):\n    # TODO: Clean string and check palindrome\n    pass\n\nprint(is_clean_palindrome("Race car"))',
      tests: [{ type: 'output_includes', expected: 'True', description: 'Returns True for "Race car"' }]
    },
    {
      id: 'py-exam-2',
      title: 'Question 2: Prime Number Filter',
      prompt: 'Write a function `filter_primes(numbers)` that returns a list containing only the prime numbers from `numbers`.\nTest with: print(filter_primes([2, 3, 4, 5, 6, 7, 8, 9, 10])) -> [2, 3, 5, 7]',
      starter: 'def filter_primes(numbers):\n    # TODO: Return list of prime numbers\n    pass\n\nprint(filter_primes([2, 3, 4, 5, 6, 7, 8, 9, 10]))',
      tests: [{ type: 'output_includes', expected: '[2, 3, 5, 7]', description: 'Filter primes from list' }]
    },
    {
      id: 'py-exam-3',
      title: 'Question 3: Frequency Counter',
      prompt: 'Write a function `top_word(text)` that returns the word that appears most frequently in `text` (lowercase).\nTest with: print(top_word("code hero code universe code")) -> "code"',
      starter: 'def top_word(text):\n    # TODO: Find most frequent word\n    pass\n\nprint(top_word("code hero code universe code"))',
      tests: [{ type: 'output_includes', expected: 'code', description: 'Identifies most frequent word' }]
    }
  ],
  javascript: [
    {
      id: 'js-exam-1',
      title: 'Question 1: Array Flattener & Deduplicator',
      prompt: 'Write a function `uniqueFlatten(arr)` that flattens a nested array of numbers and removes duplicates, returning a sorted array.\nTest: console.log(uniqueFlatten([[1, 2], [2, 3], [3, 4]])); -> [1, 2, 3, 4]',
      starter: 'function uniqueFlatten(arr) {\n  // TODO: Flatten and remove duplicates\n}\n\nconsole.log(JSON.stringify(uniqueFlatten([[1, 2], [2, 3], [3, 4]])));',
      tests: [{ type: 'output_includes', expected: '[1,2,3,4]', description: 'Flattens and deduplicates array' }]
    },
    {
      id: 'js-exam-2',
      title: 'Question 2: Deep Property Accessor',
      prompt: 'Write a function `getDeep(obj, path)` where path is a dot-separated string like "user.profile.age". Return the value or undefined.\nTest: console.log(getDeep({ user: { profile: { age: 24 } } }, "user.profile.age")); -> 24',
      starter: 'function getDeep(obj, path) {\n  // TODO: Navigate dot path\n}\n\nconsole.log(getDeep({ user: { profile: { age: 24 } } }, "user.profile.age"));',
      tests: [{ type: 'output_includes', expected: '24', description: 'Safely retrieves nested value' }]
    },
    {
      id: 'js-exam-3',
      title: 'Question 3: Debounce Simulator',
      prompt: 'Write a function `createCounter(initial)` that returns an object with `inc()`, `dec()`, and `get()` methods maintaining internal state.\nTest: const c = createCounter(5); c.inc(); c.inc(); console.log(c.get()); -> 7',
      starter: 'function createCounter(initial) {\n  // TODO: Closure maintaining private counter\n}\n\nconst c = createCounter(5); c.inc(); c.inc(); console.log(c.get());',
      tests: [{ type: 'output_includes', expected: '7', description: 'Maintains closure counter state' }]
    }
  ]
};

export function CheckpointExamModal({ 
  isOpen, 
  onClose, 
  currentLanguageId = 'python',
  pyodideInstance,
  onExamPassed 
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [questionResults, setQuestionResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [studentName, setStudentName] = useState('Hero Apprentice');

  const questions = EXAM_DATA[currentLanguageId] || EXAM_DATA.python;
  const currentQ = questions[currentQuestionIndex];

  // Timer countdown during active exam
  useEffect(() => {
    if (!examStarted || examSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, examSubmitted, timeLeft]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    soundService.playClick();
    onClose();
  };

  const handleStartExam = () => {
    soundService.playSuccess();
    setExamStarted(true);
    const initialAnswers = {};
    questions.forEach((q, i) => {
      initialAnswers[i] = q.starter;
    });
    setQuestionAnswers(initialAnswers);
  };

  const handleCodeChange = (newCode) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: newCode
    }));
  };

  const handleRunAndTestQuestion = async () => {
    setIsRunning(true);
    const codeToRun = questionAnswers[currentQuestionIndex] || currentQ.starter;

    try {
      const execResult = await runMultiLanguageCode(codeToRun, currentLanguageId, pyodideInstance, currentQ);
      const evalResult = evaluateMultiLanguageLessonTests(execResult, currentQ.tests, codeToRun, currentLanguageId);

      setQuestionResults(prev => ({
        ...prev,
        [currentQuestionIndex]: evalResult.allPassed
      }));

      if (evalResult.allPassed) {
        soundService.playSuccess();
      } else {
        soundService.playFail();
      }
    } catch (err) {
      soundService.playFail();
      setQuestionResults(prev => ({
        ...prev,
        [currentQuestionIndex]: false
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const handleAutoSubmit = () => {
    soundService.playFanfare();
    setExamSubmitted(true);
  };

  const passedCount = Object.values(questionResults).filter(Boolean).length;
  const scorePercent = Math.round((passedCount / questions.length) * 100);
  const isPassed = scorePercent >= 80;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={handleCloseModal}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="px-5 sm:px-8 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Knowledge Test
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase">
                  Skill Test
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Pass mark: 80% · No hints during test · 15 minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {examStarted && !examSubmitted && (
              <div className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-xl border ${
                timeLeft < 180 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                  : 'bg-white text-amber-700 border-amber-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}

            {/* Instant 1-Click Large Close Button (44px touch target) */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-all shadow-xs cursor-pointer touch-manipulation"
              title="Close Test"
              aria-label="Close Test"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* SCREEN 1: PRE-EXAM BRIEFING */}
          {!examStarted && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mx-auto shadow-md shadow-amber-500/10">
                📜
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Ready for the {currentLanguageId.toUpperCase()} Test?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-lg mx-auto">
                  This test checks what you have learned so far on your own.
                  During this test, <strong className="text-slate-900">hints are turned off</strong> so you can see how much you truly know!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Questions</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">3 Coding Problems</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="text-[10px] font-mono text-amber-700 uppercase font-bold">Time Limit</div>
                  <div className="text-sm font-bold text-amber-800 mt-0.5">15 Minutes</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Score to Pass</div>
                  <div className="text-sm font-bold text-emerald-800 mt-0.5">80% or Higher</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name for Certificate"
                  className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono w-64 text-center shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleStartExam}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: ACTIVE EXAM */}
          {examStarted && !examSubmitted && (
            <div className="space-y-4 animate-fade-in flex flex-col h-full">
              {/* Question Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = questionResults[idx] !== undefined;
                    const isCorrect = questionResults[idx] === true;

                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => { soundService.playClick(); setCurrentQuestionIndex(idx); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer touch-manipulation ${
                          currentQuestionIndex === idx
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        <span>Q{idx + 1}</span>
                        {isAnswered && (
                          isCorrect 
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 
                            : <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAutoSubmit}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-sm active:scale-95 cursor-pointer touch-manipulation"
                >
                  Submit &amp; Finish Test
                </button>
              </div>

              {/* Current Question Challenge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-mono font-bold text-amber-700">
                  {currentQ.title}
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Code Editor for Exam */}
              <div className="h-64 sm:h-72 border border-slate-200 rounded-2xl overflow-hidden">
                <CodeEditor
                  code={questionAnswers[currentQuestionIndex] || currentQ.starter}
                  onChange={handleCodeChange}
                  onRun={handleRunAndTestQuestion}
                  onReset={() => handleCodeChange(currentQ.starter)}
                  isRunning={isRunning}
                  wasmStatus="Test in Progress"
                  language={currentLanguageId}
                  isHeroMode={false}
                />
              </div>

              {/* Status and Verification */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs font-mono">
                  {questionResults[currentQuestionIndex] === true && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Great job! All tests passed for this problem!</span>
                    </span>
                  )}
                  {questionResults[currentQuestionIndex] === false && (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>Output mismatch. Review your logic and click Run &amp; Test again.</span>
                    </span>
                  )}
                  {questionResults[currentQuestionIndex] === undefined && (
                    <span className="text-slate-500">Click "Run &amp; Test" in the editor to evaluate your solution.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => { soundService.playClick(); setCurrentQuestionIndex(prev => prev - 1); }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-mono font-bold text-slate-700 transition-all cursor-pointer touch-manipulation"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() => { soundService.playClick(); setCurrentQuestionIndex(prev => prev + 1); }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-mono font-bold text-slate-700 transition-all cursor-pointer touch-manipulation"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: RESULTS & DIPLOMA CERTIFICATE */}
          {examSubmitted && (
            <div className="space-y-6 animate-fade-in py-4">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 relative overflow-hidden">
                <div className="text-5xl">
                  {isPassed ? '🏆' : '📚'}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isPassed ? 'Congratulations! You Passed the Test!' : 'Keep Practicing! Try Again Soon'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Score: {passedCount} of {questions.length} problems correct ({scorePercent}%)
                  </p>
                </div>

                {/* Printable Certificate (If Passed) */}
                {isPassed && (
                  <div 
                    id="certificate-print"
                    className="p-8 my-4 rounded-2xl bg-white border-2 border-amber-400 shadow-xl text-center space-y-4 max-w-xl mx-auto"
                  >
                    <div className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">
                      CERTIFICATE OF COMPLETION
                    </div>

                    <div className="text-slate-500 text-xs italic">
                      This is awarded to
                    </div>

                    <div className="text-2xl font-serif font-bold text-slate-900 tracking-wide border-b border-amber-300 pb-2">
                      {studentName}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto font-sans">
                      for successfully completing the coursework and passing the practical coding test in
                    </p>

                    <div className="text-lg font-mono font-bold text-sky-600 uppercase">
                      {currentLanguageId} Programming
                    </div>

                    <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-100">
                      <div>DATE: {new Date().toLocaleDateString()}</div>
                      <div className="text-amber-600 font-bold">CODEHERO ACADEMY</div>
                      <div>GRADE: {scorePercent}%</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {isPassed && (
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Download / Print Certificate</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer touch-manipulation active:scale-95"
                  >
                    Close &amp; Continue Learning
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
