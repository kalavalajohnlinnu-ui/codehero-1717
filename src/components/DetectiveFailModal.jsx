import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  X,
  Lock,
  Unlock,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { MascotAvatar } from './mascots/MascotAvatar';
import { soundService } from '../services/soundService';

export function DetectiveFailModal({
  isOpen,
  onClose,
  lesson,
  failedTests = [],
  rawError,
  errorDetails,
  onApplySolution,
  languageName = 'Python',
  mascotName = 'Pythie',
  mascotType = 'dragon'
}) {
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);

  if (!isOpen) return null;

  const firstFailedTest = failedTests.find(t => !t.passed);

  // Diagnostic reason
  let failureCategory = "Output Mismatch";
  let explanation = `Your code ran, but the output did not match what this quest expected.`;
  let expectedDisplay = firstFailedTest?.description || firstFailedTest?.expected || "Specific return value or output";
  let actualDisplay = firstFailedTest?.actual || (rawError ? "Error thrown" : "No output produced");

  if (rawError) {
    failureCategory = errorDetails?.type || "Runtime Syntax / Execution Error";
    explanation = errorDetails?.explanation || rawError;
    expectedDisplay = `Valid, executable ${languageName} code with no unhandled exceptions`;
    actualDisplay = rawError;
  } else if (firstFailedTest) {
    if (firstFailedTest.type === 'output_match' || firstFailedTest.type === 'output_includes') {
      failureCategory = "Unexpected Output / Missing Print";
      explanation = `The test looked for: "${firstFailedTest.expected || firstFailedTest.description}". Instead, your code printed or returned: "${firstFailedTest.actual || '(nothing)'}".`;
    } else if (firstFailedTest.type === 'var_check') {
      failureCategory = "Variable Value Mismatch";
      explanation = `The variable "${firstFailedTest.varName || 'target'}" was expected to be "${firstFailedTest.expected}", but was evaluated as "${firstFailedTest.actual}".`;
    }
  }

  const handleUnlockSolution = () => {
    soundService.playMagic();
    setSolutionUnlocked(true);
  };

  const handleApplyFix = () => {
    soundService.playMagic();
    if (lesson?.solution) {
      onApplySolution(lesson.solution);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#090C14] border border-red-500/30 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200">
        {/* Diagnostic Header */}
        <div className="bg-gradient-to-r from-red-950/50 via-slate-900 to-[#090C14] p-4 sm:p-5 border-b border-red-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center p-1 shadow-md">
              <MascotAvatar mascotType={mascotType} mood="detective" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  DIAGNOSTIC CASE FILE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {languageName}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {failureCategory}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs text-slate-200">
          {/* 1. Clear Diagnostic Reason */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-1">
            <div className="text-[10px] font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Exact Reason for Failure</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {explanation}
            </p>
          </div>

          {/* 2. Side-by-Side Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Expected */}
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Expected by Test</span>
              </div>
              <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-2 font-mono text-[11px] text-emerald-200 break-all min-h-[42px] flex items-center">
                {String(expectedDisplay)}
              </div>
            </div>

            {/* Actual */}
            <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 mb-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Your Code Produced</span>
              </div>
              <div className="bg-black/40 border border-rose-500/20 rounded-xl p-2 font-mono text-[11px] text-rose-200 break-all min-h-[42px] flex items-center">
                {String(actualDisplay)}
              </div>
            </div>
          </div>

          {/* 3. Actionable Detective Hint */}
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Detective Clue</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {errorDetails?.fix || (
                lesson?.hints?.[0] || `Check the challenge description carefully: make sure variable names match, return types are correct, and no syntax errors are present.`
              )}
            </p>
          </div>

          {/* 4. Progressive Disclosure: Alternative Solution Locked */}
          <div className="p-3.5 rounded-2xl bg-[#0F131D] border border-white/[0.08]">
            {!solutionUnlocked ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-300">Alternative Solution Locked</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Mastery is built by debugging yourself. Only unlock if genuinely stuck!
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUnlockSolution}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-amber-400 border border-amber-500/30 hover:border-amber-500/50 transition-all shrink-0 flex items-center gap-1"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Reveal Solution</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unlocked Official Solution</span>
                  </div>
                  <button
                    onClick={handleApplyFix}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all"
                  >
                    Apply Fix to Editor
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-[11px] text-sky-200 overflow-x-auto whitespace-pre">
                  {lesson?.solution || '// No pre-recorded solution for this sandbox'}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0B0E17] border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-slate-950 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md"
          >
            I'll Fix It Myself (Recommended)
          </button>
        </div>
      </div>
    </div>
  );
}
