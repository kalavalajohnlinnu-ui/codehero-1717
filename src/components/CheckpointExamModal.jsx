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
  Lock
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

  const handleStartExam = () => {
    soundService.playSuccess();
    setExamStarted(true);
    // Initialize starter code for each question
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
      const execResult = await runMultiLanguageCode(codeToRun, currentLanguageId, pyodideInstance);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0D15] border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-8 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E121B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Realm Checkpoint Examination
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold uppercase">
                  Official Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: 80% Passing Score · No Hints Allowed · Timed Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {examStarted && !examSubmitted && (
              <div className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-xl border ${
                timeLeft < 180 
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse' 
                  : 'bg-white/5 text-amber-300 border-white/10'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* SCREEN 1: PRE-EXAM BRIEFING */}
          {!examStarted && (
            <div className="max-w-2xl mx-auto text-center space-y-6 py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-500/10">
                📜
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Ready for the {currentLanguageId.toUpperCase()} Realm Examination?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  This examination conducts a formal audit of your independent problem-solving skills.
                  Unlike standard quests, <strong>hints and auto-solutions are completely disabled</strong>.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Questions</div>
                  <div className="text-sm font-bold text-white mt-0.5">3 Coding Tasks</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Time Limit</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">15 Minutes</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Passing Threshold</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">80% Accuracy</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name for Certificate"
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono w-64 text-center"
                />
                <button
                  onClick={handleStartExam}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Begin Examination</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: ACTIVE EXAM */}
          {examStarted && !examSubmitted && (
            <div className="space-y-4 animate-fade-in flex flex-col h-full">
              {/* Question Navigation Tabs */}
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = questionResults[idx] !== undefined;
                    const isCorrect = questionResults[idx] === true;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          currentQuestionIndex === idx
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        <span>Q{idx + 1}</span>
                        {isAnswered && (
                          isCorrect 
                            ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 
                            : <XCircle className="w-3 h-3 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleAutoSubmit}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all"
                >
                  Submit All & Finish Exam
                </button>
              </div>

              {/* Current Question Challenge */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="text-xs font-mono font-bold text-amber-400">
                  {currentQ.title}
                </div>
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Code Editor for Exam */}
              <div className="h-64 sm:h-72 border border-white/10 rounded-2xl overflow-hidden">
                <CodeEditor
                  code={questionAnswers[currentQuestionIndex] || currentQ.starter}
                  onChange={handleCodeChange}
                  onRun={handleRunAndTestQuestion}
                  onReset={() => handleCodeChange(currentQ.starter)}
                  isRunning={isRunning}
                  wasmStatus="Exam Security Active"
                  language={currentLanguageId}
                  isHeroMode={false}
                />
              </div>

              {/* Status and Verification */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs font-mono">
                  {questionResults[currentQuestionIndex] === true && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Task Verified: Tests Passed!</span>
                    </span>
                  )}
                  {questionResults[currentQuestionIndex] === false && (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>Tests Failed. Review logic and test again!</span>
                    </span>
                  )}
                  {questionResults[currentQuestionIndex] === undefined && (
                    <span className="text-slate-500">Click "Run & Test Code" in the editor to grade this task.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-mono"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-mono"
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
              <div className="p-6 rounded-3xl bg-gradient-to-b from-black/60 to-black/90 border border-white/10 text-center space-y-4 relative overflow-hidden">
                <div className="text-4xl">
                  {isPassed ? '🏆' : '📚'}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isPassed ? 'Examination Passed With Honors!' : 'Examination Requires Retest'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Score: {passedCount} of {questions.length} tasks correct ({scorePercent}%)
                  </p>
                </div>

                {/* Official Printable Certificate (If Passed) */}
                {isPassed && (
                  <div 
                    id="certificate-print"
                    className="p-8 my-4 rounded-2xl bg-gradient-to-b from-[#121624] via-[#0c0f18] to-[#07090e] border-2 border-amber-500/40 shadow-2xl text-center space-y-4 max-w-xl mx-auto"
                  >
                    <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      OFFICIAL CERTIFICATE OF REALM PROFICIENCY
                    </div>

                    <div className="text-slate-400 text-xs italic">
                      This hereby certifies that
                    </div>

                    <div className="text-2xl font-serif font-bold text-white tracking-wide border-b border-amber-500/20 pb-2">
                      {studentName}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                      has successfully demonstrated verified programming fluency, rigorous problem decomposition, and algorithmic execution in the
                    </p>

                    <div className="text-lg font-mono font-bold text-sky-400 uppercase">
                      {currentLanguageId} Coding Realm
                    </div>

                    <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/[0.08]">
                      <div>DATE: {new Date().toLocaleDateString()}</div>
                      <div className="text-amber-400 font-bold">CODEHERO ARCHITECT GUILD</div>
                      <div>GRADE: {scorePercent}%</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  {isPassed && (
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Save Certificate</span>
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                  >
                    Close & Return to Guild
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
