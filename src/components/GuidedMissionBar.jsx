import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Code, 
  Play, 
  X,
  Sparkles,
  Flame
} from 'lucide-react';
import { soundService } from '../services/soundService';

export function GuidedMissionBar({
  currentLesson,
  currentLanguageId = 'python',
  allLessons = [],
  completedLessons = [],
  testResults,
  isRunning,
  onSelectLesson,
  onRunCode,
  isHeroMode = true
}) {
  const [showHowToModal, setShowHowToModal] = useState(false);

  if (!currentLesson) return null;

  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isPassed = completedLessons.includes(currentLesson.id);

  // Status message in simple English
  let actionText = '';
  let statusBadge = '';
  let statusColor = 'bg-sky-50 text-sky-800 border-sky-200';

  if (isRunning) {
    actionText = '⏳ The computer is reading and testing your code... Wait 2 seconds!';
    statusBadge = 'RUNNING';
    statusColor = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (isPassed) {
    actionText = '🎉 SHABASH! You solved this quest correctly! Click the green button to continue to next lesson!';
    statusBadge = 'SOLVED ✓';
    statusColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  } else if (testResults && !testResults.allPassed) {
    actionText = '💡 Don\'t worry! Look at the red message in the bottom screen, fix line 2, and press Run again!';
    statusBadge = 'NEEDS FIX';
    statusColor = 'bg-rose-50 text-rose-800 border-rose-300';
  } else {
    actionText = '👉 Step 1: Read the easy story on the left. Step 2: Change the code on the right. Step 3: Click "Run Code"!';
    statusBadge = 'DO THIS NOW';
    statusColor = 'bg-sky-50 text-sky-800 border-sky-300';
  }

  const handleOpenHelp = () => {
    soundService.playClick();
    setShowHowToModal(true);
  };

  return (
    <>
      <div className="w-full bg-white border-b border-slate-200 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 shadow-xs shrink-0 select-none">
        
        {/* Left: What to do right now */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
            <Compass className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shrink-0 ${statusColor}`}>
              {statusBadge}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
              {actionText}
            </p>
          </div>
        </div>

        {/* Right: Next Step Button or Confused Help Button */}
        <div className="flex items-center gap-2 shrink-0">
          {isPassed && nextLesson && (
            <button
              onClick={() => {
                soundService.playClick();
                onSelectLesson(nextLesson.id);
              }}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer animate-pulse"
              title="Go to next lesson"
            >
              <span>Next Quest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleOpenHelp}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Confused? Click here to see how to use CodeHero"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Confused? Start Here</span>
          </button>
        </div>
      </div>

      {/* Duolingo-style "How CodeHero Works" Simple Guide Modal */}
      {showHowToModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowHowToModal(false)}
        >
          <div 
            className="bg-white border-2 border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl flex flex-col text-slate-900 relative overflow-hidden animate-cinematic-page"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🧭</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    How CodeHero Works (Super Simple Guide)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Designed like Duolingo: Just follow 4 simple steps!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHowToModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Steps */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>LEFT SIDE: This is your Textbook</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Read the small story. If there is any tough English word, look at the <strong>"📖 Word Meaning"</strong> box right below it!
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-emerald-600" />
                    <span>RIGHT SIDE: This is your Notebook</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Click inside the black/white code box on the right. Type or edit the code as asked in your mission.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-amber-600" />
                    <span>BOTTOM: Click "Run Code (Test My Work)"</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Press the big button below the editor. The computer will test your work instantly and show the result in the console screen!
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>WIN XP & GO TO NEXT QUEST</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    When all tests pass, you earn +25 XP! A big green button <strong>"Next Quest →"</strong> appears to take you to the next step.
                  </p>
                </div>
              </div>
            </div>

            {/* Reassuring footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                ❤️ Remember: The computer is your patient friend. Mistakes help you learn!
              </span>
              <button
                onClick={() => setShowHowToModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                I Understand! Let\'s Code →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
