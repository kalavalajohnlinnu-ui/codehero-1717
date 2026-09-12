import React from 'react';
import { 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  X 
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
  if (!isOpen) return null;

  const firstFailedTest = failedTests.find(t => !t.passed);

  // Determine kid-friendly title & explanation
  let headline = `Detective ${mascotName} Found a Mystery!`;
  let whatHappened = `${languageName} tried to run your code, but something didn't match what the quest was looking for.`;
  let expectedDisplay = firstFailedTest?.description || "A specific output or variable";
  let actualDisplay = firstFailedTest?.actual || "Something else was produced";

  if (rawError) {
    if (errorDetails) {
      headline = `Oops! ${errorDetails.title}`;
      whatHappened = errorDetails.explanation;
      expectedDisplay = `Clean ${languageName} code following grammar rules`;
      actualDisplay = errorDetails.type;
    } else {
      headline = `${languageName} Stumbled on an Error!`;
      whatHappened = `${languageName} couldn't finish running because of a line of code it didn't understand.`;
      expectedDisplay = "Error-free execution";
      actualDisplay = "Runtime Exception";
    }
  } else if (firstFailedTest) {
    headline = "The Magic Words Don't Quite Match Yet!";
    whatHappened = `${languageName} was testing your code, and noticed: "${firstFailedTest.description}". But the result was different!`;
    actualDisplay = firstFailedTest.actual;
  }

  const handleApplyFix = () => {
    soundService.playMagic();
    if (lesson?.solution) {
      onApplySolution(lesson.solution);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 border border-amber-500/40 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Detective Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-md p-1">
              <MascotAvatar mascotType={mascotType} mood="detective" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Detective {mascotName} Case File
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {headline}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs text-slate-200">
          {/* 1. What Happened (ELI5) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-mono uppercase text-sky-400 font-semibold mb-1 flex items-center gap-1.5">
              <span>❓</span>
              <span>1. What Happened? (In Plain English)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {whatHappened}
            </p>
          </div>

          {/* 2. Side-by-Side Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* What Engine Expected */}
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>What {languageName} Wanted</span>
              </div>
              <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-2 font-mono text-[11px] text-emerald-200 break-all min-h-[44px] flex items-center">
                {expectedDisplay}
              </div>
            </div>

            {/* What Engine Actually Saw */}
            <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-400 mb-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>What {languageName} Found</span>
              </div>
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-xl p-2 font-mono text-[11px] text-rose-200 break-all min-h-[44px] flex items-center">
                {actualDisplay}
              </div>
            </div>
          </div>

          {/* 3. Action Steps */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>3. How to Fix It (Detective Steps)</span>
            </div>
            <ol className="space-y-1.5 text-slate-300 list-decimal ml-4 text-xs leading-relaxed">
              {errorDetails?.fix ? (
                <li>{errorDetails.fix}</li>
              ) : (
                <>
                  <li>Check the spelling and capitalization in your code (e.g. {languageName} is strict about letters and keywords).</li>
                  <li>Check that quotes <code className="text-sky-300 font-mono">"..."</code>, tags, semicolons, or numbers match the challenge instructions exactly.</li>
                  <li>Click "Run & Test" to see if the green victory checkmark appears!</li>
                </>
              )}
            </ol>
          </div>

          {/* 4. Encouragement */}
          <div className="text-[11px] text-slate-400 italic bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-center">
            🌟 Remember: Bugs are just clues waiting to be solved. You learn the most when fixing a mistake!
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            I'll Try Fixing It Myself!
          </button>

          {lesson?.solution && (
            <button
              onClick={handleApplyFix}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-sky-400 hover:opacity-90 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Apply the Magic Fix</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
