import React, { useState, useEffect, useMemo } from 'react';
import { LANGUAGES, getLanguageConfig } from './data/languages/registry';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LessonView } from './components/LessonView';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { CheatsheetModal } from './components/CheatsheetModal';
import { SandboxModal } from './components/SandboxModal';
import { CelebrationModal } from './components/CelebrationModal';
import { DetectiveFailModal } from './components/DetectiveFailModal';
import { initPyodide } from './services/pyodideService';
import { runMultiLanguageCode, evaluateMultiLanguageLessonTests } from './services/multiLangService';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import { translatePythonError } from './services/errorTranslator';

export default function App() {
  // 1. Language & State
  const [currentLanguageId, setCurrentLanguageId] = useState('python');
  const [completedByLanguage, setCompletedByLanguage] = useState({});
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(1);

  // Active Language Configuration & Curriculum
  const activeLang = useMemo(() => getLanguageConfig(currentLanguageId), [currentLanguageId]);
  const activeCurriculum = activeLang.curriculum;
  const allLessons = useMemo(() => activeCurriculum.flatMap(m => m.lessons), [activeCurriculum]);

  // Current Lesson State
  const [currentLessonId, setCurrentLessonId] = useState('lesson-1');
  const currentLesson = useMemo(() => {
    return allLessons.find(l => l.id === currentLessonId) || allLessons[0];
  }, [allLessons, currentLessonId]);

  // Kid Hero Mode vs Pro Mode
  const [isHeroMode, setIsHeroMode] = useState(true);

  // Active Code & Execution State
  const [currentCode, setCurrentCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Pyodide Runtime State (for Python)
  const [pyodide, setPyodide] = useState(null);
  const [wasmStatus, setWasmStatus] = useState('Initializing Multi-Language Engine...');

  // Mascot Companion State
  const [pythieMood, setPythieMood] = useState('idle');
  const [pythieSpeech, setPythieSpeech] = useState(null);

  // Modals & Sidebar Toggles
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isDetectiveOpen, setIsDetectiveOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [recentXpAward, setRecentXpAward] = useState(25);

  const completedLessonsInLang = completedByLanguage[currentLanguageId] || [];

  // Initial Load: Restore State & Initialize Engines
  useEffect(() => {
    const savedState = storageService.loadState();
    setTotalXP(savedState.totalXP || 0);
    setCompletedByLanguage(savedState.completedByLanguage || {});
    setStreak(savedState.streak || 1);

    const initialLangId = savedState.currentLanguageId || 'python';
    setCurrentLanguageId(initialLangId);

    const initialLangConfig = getLanguageConfig(initialLangId);
    const initialLessons = initialLangConfig.curriculum.flatMap(m => m.lessons);
    const targetLessonId = storageService.getCurrentLessonId(initialLangId, initialLessons[0].id);
    setCurrentLessonId(targetLessonId);

    const targetLessonObj = initialLessons.find(l => l.id === targetLessonId) || initialLessons[0];
    const initialCode = storageService.getLessonDraft(targetLessonId, targetLessonObj.starterCode);
    setCurrentCode(initialCode);

    // Initialize Pyodide WebAssembly for Python
    initPyodide((status) => {
      setWasmStatus(status);
    }).then((instance) => {
      if (instance) {
        setPyodide(instance);
        setWasmStatus('WebAssembly Engine Ready');
      } else {
        setWasmStatus('Multi-Language Evaluator Ready');
      }
    }).catch(() => {
      setWasmStatus('Client-Side Evaluator Ready');
    });
  }, []);

  // Switch Programming Language Realm
  const handleSelectLanguage = (newLangId) => {
    if (newLangId === currentLanguageId) return;

    soundService.playClick();
    // Save draft of current lesson before switching
    storageService.saveLessonDraft(currentLessonId, currentCode);
    storageService.saveCurrentLessonId(currentLanguageId, currentLessonId);

    setCurrentLanguageId(newLangId);

    const targetConfig = getLanguageConfig(newLangId);
    const newLessons = targetConfig.curriculum.flatMap(m => m.lessons);
    const targetLessonId = storageService.getCurrentLessonId(newLangId, newLessons[0].id);
    setCurrentLessonId(targetLessonId);

    const targetLessonObj = newLessons.find(l => l.id === targetLessonId) || newLessons[0];
    const codeForLesson = storageService.getLessonDraft(targetLessonId, targetLessonObj.starterCode);
    setCurrentCode(codeForLesson);

    setOutputResult(null);
    setTestResults(null);
    setPythieMood('idle');
    setPythieSpeech(`Welcome to the ${targetConfig.name} Realm! I'm ${targetConfig.mascotName}, let's master ${targetConfig.name}! 🌟`);

    const state = storageService.loadState();
    state.currentLanguageId = newLangId;
    storageService.saveState(state);
  };

  // Switch Lesson within Active Language
  const handleSelectLesson = (lessonId) => {
    soundService.playClick();
    storageService.saveLessonDraft(currentLessonId, currentCode);

    setCurrentLessonId(lessonId);
    const newLesson = allLessons.find(l => l.id === lessonId);
    if (newLesson) {
      const codeForLesson = storageService.getLessonDraft(lessonId, newLesson.starterCode);
      setCurrentCode(codeForLesson);
    }
    setOutputResult(null);
    setTestResults(null);
    setPythieMood('idle');
    setPythieSpeech(`Ready for Quest: ${newLesson?.title}! Let's do this!`);

    storageService.saveCurrentLessonId(currentLanguageId, lessonId);
  };

  // Update Active Code
  const handleCodeChange = (newCode) => {
    setCurrentCode(newCode);
    storageService.saveLessonDraft(currentLessonId, newCode);
    if (pythieMood === 'detective') {
      setPythieMood('idle');
      setPythieSpeech("That's the spirit! Editing code to solve the clue!");
    }
  };

  // Run & Test Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setPythieMood('thinking');
    setPythieSpeech(`Evaluating your ${activeLang.name} code... reading instructions...`);

    try {
      const execResult = await runMultiLanguageCode(currentCode, currentLanguageId, pyodide);
      setOutputResult(execResult);

      if (execResult.error) {
        // Engine error or syntax exception
        soundService.playFail();
        setPythieMood('detective');
        setPythieSpeech(`Uh oh! ${activeLang.name} stumbled! Detective ${activeLang.mascotName} is on the case! 🔍`);
        setIsDetectiveOpen(true);
      } else if (currentLesson && currentLesson.tests) {
        // Evaluate quest test assertions
        const testEval = evaluateMultiLanguageLessonTests(
          execResult, 
          currentLesson.tests, 
          currentCode, 
          currentLanguageId
        );
        setTestResults(testEval);

        if (testEval.allPassed) {
          // All tests passed!
          soundService.playSuccess();
          setPythieMood('celebrating');
          setPythieSpeech(`WOOHOO! Quest complete! You're becoming a true ${activeLang.name} Hero! ⭐⭐⭐`);

          const xpAward = 25;
          setRecentXpAward(xpAward);
          const completionResult = storageService.markLessonComplete(currentLanguageId, currentLesson.id, xpAward);
          setTotalXP(completionResult.newXP);
          setCompletedByLanguage(completionResult.completedByLanguage);

          if (completionResult.isNewCompletion) {
            setTimeout(() => {
              soundService.playFanfare();
              setIsCelebrationOpen(true);
            }, 400);
          }
        } else {
          // Output or assertions did not match
          soundService.playFail();
          setPythieMood('detective');
          setPythieSpeech(`Almost there! The code ran, but the quest was looking for something specific. Let's inspect the clue! 🔍`);
          setIsDetectiveOpen(true);
        }
      }
    } catch (err) {
      soundService.playFail();
      setOutputResult({
        success: false,
        stdout: "",
        stderr: "",
        error: String(err),
        variables: [],
        durationMs: 0
      });
      setPythieMood('detective');
      setIsDetectiveOpen(true);
    } finally {
      setIsRunning(false);
    }
  };

  // Reset Lesson to Starter Code
  const handleResetCode = () => {
    if (currentLesson) {
      setCurrentCode(currentLesson.starterCode);
      storageService.saveLessonDraft(currentLesson.id, currentLesson.starterCode);
      setOutputResult(null);
      setTestResults(null);
      setPythieMood('idle');
      setPythieSpeech("Clean slate! Ready to write fresh code!");
    }
  };

  // Apply Auto Fix Solution
  const handleApplySolution = (solutionCode) => {
    setCurrentCode(solutionCode);
    storageService.saveLessonDraft(currentLessonId, solutionCode);
    setPythieMood('idle');
    setPythieSpeech("Magic solution applied! Now click 'Run & Test' to see it pass! ✨");
  };

  // Advance to Next Lesson
  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      handleSelectLesson(allLessons[currentIndex + 1].id);
    }
  };

  // Reset Progress for Current Language
  const handleResetProgress = () => {
    storageService.resetLanguageProgress(currentLanguageId);
    setCompletedByLanguage(prev => ({
      ...prev,
      [currentLanguageId]: []
    }));
    setCurrentLessonId(allLessons[0].id);
    setCurrentCode(allLessons[0].starterCode);
    setOutputResult(null);
    setTestResults(null);
    setPythieMood('idle');
    setPythieSpeech(`All ${activeLang.name} quests reset. A brand new adventure begins!`);
  };

  const errorDetails = outputResult?.error && currentLanguageId === 'python'
    ? translatePythonError(outputResult.error)
    : null;

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans ${isHeroMode ? 'bg-[#080B12] text-slate-100' : 'bg-slate-950 text-slate-100'}`}>
      {/* Top Header */}
      <Header
        currentLanguageId={currentLanguageId}
        onSelectLanguage={handleSelectLanguage}
        completedByLanguage={completedByLanguage}
        totalXP={totalXP}
        completedCount={completedLessonsInLang.length}
        totalLessons={allLessons.length}
        streak={streak}
        isHeroMode={isHeroMode}
        onToggleHeroMode={() => setIsHeroMode(!isHeroMode)}
        onOpenCheatsheet={() => setIsCheatsheetOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onResetProgress={handleResetProgress}
        wasmStatus={wasmStatus}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          curriculum={activeCurriculum}
          currentLessonId={currentLessonId}
          completedLessons={completedLessonsInLang}
          onSelectLesson={handleSelectLesson}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center & Right Workspace: Lesson Guide + Code Studio */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-900/20">
          {/* Lesson Guide (Instructions, Theory, Mascot, Hints) */}
          <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col overflow-hidden h-1/2 lg:h-full bg-slate-950/40">
            <LessonView
              lesson={currentLesson}
              onApplySolution={handleApplySolution}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
              onNextLesson={handleNextLesson}
              isComplete={completedLessonsInLang.includes(currentLessonId)}
              isHeroMode={isHeroMode}
              pythieMood={pythieMood}
              pythieSpeech={pythieSpeech}
              mascotName={activeLang.mascotName}
              mascotType={activeLang.mascotType}
              mascotTitle={activeLang.mascotTitle}
            />
          </div>

          {/* Code Studio (Editor + Output Console) */}
          <div className="w-full lg:w-7/12 flex flex-col p-2.5 sm:p-4 gap-2.5 sm:gap-3 overflow-hidden h-1/2 lg:h-full bg-slate-950/60">
            {/* Code Editor */}
            <div className="flex-1 min-h-[220px] overflow-hidden">
              <CodeEditor
                code={currentCode}
                onChange={handleCodeChange}
                onRun={handleRunCode}
                onReset={handleResetCode}
                isRunning={isRunning}
                wasmStatus={wasmStatus}
                isHeroMode={isHeroMode}
                language={currentLanguageId}
              />
            </div>

            {/* Output Console / Memory Jars / Test Results */}
            <div className="shrink-0">
              <OutputConsole
                outputResult={outputResult}
                testResults={testResults}
                onClearConsole={() => {
                  setOutputResult(null);
                  setTestResults(null);
                  setPythieMood('idle');
                }}
                onOpenDetective={() => setIsDetectiveOpen(true)}
                isTestingMode={true}
                isHeroMode={isHeroMode}
                currentLanguageId={currentLanguageId}
                mascotName={activeLang.mascotName}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Detective Why Did It Fail Inspector Modal */}
      <DetectiveFailModal
        isOpen={isDetectiveOpen}
        onClose={() => setIsDetectiveOpen(false)}
        lesson={currentLesson}
        failedTests={testResults?.results || []}
        rawError={outputResult?.error}
        errorDetails={errorDetails}
        onApplySolution={handleApplySolution}
        languageName={activeLang.name}
        mascotName={activeLang.mascotName}
        mascotType={activeLang.mascotType}
      />

      {/* Interactive Cheatsheet Modal */}
      <CheatsheetModal
        isOpen={isCheatsheetOpen}
        onClose={() => setIsCheatsheetOpen(false)}
        currentLanguageId={currentLanguageId}
        languageName={activeLang.name}
      />

      {/* Freeform Sandbox Playground Modal */}
      <SandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        sandboxCode={storageService.getSandboxCode(currentLanguageId)}
        onSaveSandboxCode={(langId, code) => storageService.saveSandboxCode(langId, code)}
        pyodideInstance={pyodide}
        currentLanguageId={currentLanguageId}
        languageName={activeLang.name}
        mascotName={activeLang.mascotName}
      />

      {/* Challenge Completed Celebration Modal */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        lessonTitle={currentLesson?.title || 'Challenge'}
        xpGained={recentXpAward}
        onNextLesson={handleNextLesson}
        onClose={() => setIsCelebrationOpen(false)}
      />
    </div>
  );
}
