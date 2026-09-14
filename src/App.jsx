import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { cloudSyncService } from './services/cloudSyncService';

// Game Components
import { getLevelProgress as getLevelInfo } from './services/gameEngine';
import { ComboMeter } from './components/game/ComboMeter';
import { LevelUpModal } from './components/game/LevelUpModal';
import { TrophyToast } from './components/game/TrophyToast';
import { BonusRoundPopup } from './components/game/BonusRoundPopup';
import { StreakModal } from './components/game/StreakModal';
import { authService } from './services/authService';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudyPlanModal } from './components/StudyPlanModal';
import { AuthGateScreen } from './components/AuthGateScreen';
import { GameModeSelector } from './components/game/GameModeSelector';
import { AlgorithmArena } from './components/game/AlgorithmArena';
import { BugDetective } from './components/game/BugDetective';
import { SpeedChallenge } from './components/game/SpeedChallenge';
import { ProjectWorkshop } from './components/game/ProjectWorkshop';
import { LanguageOracle } from './components/LanguageOracle';
import { Top1PercentRoadmapModal } from './components/Top1PercentRoadmapModal';
import { DigitalNotesModal } from './components/DigitalNotesModal';
import { CheckpointExamModal } from './components/CheckpointExamModal';
import { ModeLockedModal } from './components/ModeLockedModal';
import { ModuleCheckpointModal } from './components/ModuleCheckpointModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AurevonIntro } from './components/AurevonIntro';

export default function App() {
  // 1. Language & State
  const initialSavedState = useMemo(() => storageService.loadState(), []);
  const [currentLanguageId, setCurrentLanguageId] = useState(() => initialSavedState.currentLanguageId || 'python');
  const [completedByLanguage, setCompletedByLanguage] = useState(() => initialSavedState.completedByLanguage || {});
  const [totalXP, setTotalXP] = useState(() => initialSavedState.totalXP || 0);
  const [streak, setStreak] = useState(() => initialSavedState.streak || 1);

  // Mobile layout state
  const [mobileTab, setMobileTab] = useState('lesson'); // 'lesson' | 'editor' | 'output'

  // Game State
  const [combo, setCombo] = useState(0);
  const [bonusRoundActive, setBonusRoundActive] = useState(false);
  const [bonusMultiplier, setBonusMultiplier] = useState(1);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [currentGameMode, setCurrentGameMode] = useState('lessons'); // 'lessons' | 'arena' | 'bugs' | 'speed' | 'projects'
  const [isGameModeSelectorOpen, setIsGameModeSelectorOpen] = useState(false);
  const [lessonsCompletedSession, setLessonsCompletedSession] = useState(0);
  
  // Intro & Login Gate Sequence
  const [showIntro, setShowIntro] = useState(true);
  const [hasPassedLoginGate, setHasPassedLoginGate] = useState(false);

  // Student Auth & Study Plan
  const [currentStudent, setCurrentStudent] = useState(() => authService.getCurrentStudent());
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);
  const [isStudyPlanOpen, setIsStudyPlanOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const isCurrentAdmin = authService.isCurrentStudentAdmin();
  
  // Modals state
  const [levelUpData, setLevelUpData] = useState(null);
  const [streakModalData, setStreakModalData] = useState(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [lockedModeInfo, setLockedModeInfo] = useState(null);
  const [activeCheckpointModule, setActiveCheckpointModule] = useState(null);
  const [passedModuleExams, setPassedModuleExams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('passed_module_exams') || '[]');
    } catch {
      return [];
    }
  });

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

  // Pyodide Runtime State
  const [pyodide, setPyodide] = useState(null);
  const [wasmStatus, setWasmStatus] = useState('Initializing Engine...');

  // Mascot
  const [pythieMood, setPythieMood] = useState('idle');
  const [pythieSpeech, setPythieSpeech] = useState(null);

  // Modals & Sidebar
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isDetectiveOpen, setIsDetectiveOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [recentXpAward, setRecentXpAward] = useState(25);

  const completedLessonsInLang = completedByLanguage[currentLanguageId] || [];

  // Initial Load
  useEffect(() => {
    const savedState = storageService.loadState();
    setTotalXP(savedState.totalXP || 0);
    setCompletedByLanguage(savedState.completedByLanguage || {});
    setStreak(savedState.streak || 1);

    // Check streak milestones (only if not claimed yet)
    let claimedMilestones = [];
    try {
      claimedMilestones = JSON.parse(localStorage.getItem('claimed_streak_milestones') || '[]');
    } catch {
      claimedMilestones = [];
    }
    if (savedState.streak > 1 && [3, 7, 14, 30, 50, 100].includes(savedState.streak) && !claimedMilestones.includes(savedState.streak)) {
      setStreakModalData({ days: savedState.streak, bonus: savedState.streak * 100 });
    }

    const initialLangId = savedState.currentLanguageId || 'python';
    setCurrentLanguageId(initialLangId);

    const initialLangConfig = getLanguageConfig(initialLangId);
    const initialLessons = initialLangConfig.curriculum.flatMap(m => m.lessons);
    const targetLessonId = storageService.getCurrentLessonId(initialLangId, initialLessons[0].id);
    setCurrentLessonId(targetLessonId);

    const targetLessonObj = initialLessons.find(l => l.id === targetLessonId) || initialLessons[0];
    const initialCode = storageService.getLessonDraft(targetLessonId, targetLessonObj.starterCode);
    setCurrentCode(initialCode);

    setWasmStatus('Light Studio Engine Ready');
    cloudSyncService.requestDurableStorage();
  }, []);

  const checkAchievements = useCallback((action, state) => {
    // Simple achievement check system
    const unlockedStr = localStorage.getItem('achievements') || '[]';
    const unlocked = JSON.parse(unlockedStr);
    const newAchievements = [];

    const unlock = (id, name, desc, icon) => {
      if (!unlocked.includes(id)) {
        unlocked.push(id);
        newAchievements.push({ id, name, description: desc, icon });
      }
    };

    if (action === 'xp_gain') {
      if (state.totalXP >= 1000) unlock('xp_1k', 'XP Hoarder', 'Reach 1,000 XP', 'ðŸ’°');
      if (state.totalXP >= 10000) unlock('xp_10k', 'XP Millionaire', 'Reach 10,000 XP', 'ðŸ’Ž');
    }

    if (action === 'combo') {
      if (state.combo >= 3) unlock('combo_3', 'Heating Up', 'Reach a 3x Combo', 'ðŸ”¥');
      if (state.combo >= 10) unlock('combo_10', 'Unstoppable', 'Reach a 10x Combo', 'â˜„ï¸');
    }

    if (newAchievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(unlocked));
      setPendingAchievements(prev => [...prev, ...newAchievements]);
    }
  }, []);

  const handleXPEarned = (amount) => {
    const finalAmount = amount * bonusMultiplier * (Math.min(Math.floor(combo/2)+1, 5) || 1);
    
    setTotalXP(prev => {
      const oldLevel = getLevelInfo(prev).level;
      const nextXP = prev + finalAmount;
      const newLevel = getLevelInfo(nextXP).level;
      
      if (newLevel > oldLevel) {
        setLevelUpData({ level: newLevel, name: getLevelInfo(nextXP).name });
      }
      
      checkAchievements('xp_gain', { totalXP: nextXP });
      
      // Save state
      const state = storageService.loadState();
      state.totalXP = nextXP;
      storageService.saveState(state);
      
      return nextXP;
    });
    
    soundService.playSuccess();
    setRecentXpAward(finalAmount);
  };

  const handleStudentChanged = (newStudent) => {
    setCurrentStudent(newStudent);
    // Reload state for this specific student profile
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

    setOutputResult(null);
    setTestResults(null);
  };

  const handleSelectLanguage = (newLangId) => {
    if (newLangId === currentLanguageId) return;
    soundService.playClick();
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
    setPythieSpeech('Welcome to the ' + targetConfig.name + ' Realm!');

    const state = storageService.loadState();
    state.currentLanguageId = newLangId;
    storageService.saveState(state);
  };

  const handleSelectLesson = (lessonId) => {
    soundService.playClick();
    storageService.saveLessonDraft(currentLessonId, currentCode);
    setCurrentLessonId(lessonId);
    const newLesson = allLessons.find(l => l.id === lessonId);
    if (newLesson) {
      setCurrentCode(storageService.getLessonDraft(lessonId, newLesson.starterCode));
    }
    setOutputResult(null);
    setTestResults(null);
    setPythieMood('idle');
    storageService.saveCurrentLessonId(currentLanguageId, lessonId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileTab('lesson');
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setPythieMood('thinking');
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileTab('output');
    }
    
    try {
      const execResult = await runMultiLanguageCode(currentCode, currentLanguageId, pyodide, currentLesson);
      setOutputResult(execResult);

      if (execResult.error) {
        soundService.playFail();
        setPythieMood('detective');
        setCombo(0);
        setIsDetectiveOpen(true);
      } else if (currentLesson && currentLesson.tests) {
        const testEval = evaluateMultiLanguageLessonTests(execResult, currentLesson.tests, currentCode, currentLanguageId);
        setTestResults(testEval);

        if (testEval.allPassed) {
          const newCombo = combo + 1;
          setCombo(newCombo);
          checkAchievements('combo', { combo: newCombo });
          
          setPythieMood('celebrating');
          
          const completionResult = storageService.markLessonComplete(currentLanguageId, currentLesson.id, 0); // We handle XP manually below
          setCompletedByLanguage(completionResult.completedByLanguage);
          cloudSyncService.syncStudentToCloud(authService.getCurrentStudent(), storageService.loadState());

          if (completionResult.isNewCompletion) {
            handleXPEarned(25);
            setLessonsCompletedSession(prev => {
              const count = prev + 1;
              if (count % 5 === 0) setBonusRoundActive(true);
              return count;
            });
            setTimeout(() => {
              setIsCelebrationOpen(true);
            }, 400);
          }
        } else {
          soundService.playFail();
          setPythieMood('detective');
          setCombo(0);
          setIsDetectiveOpen(true);
        }
      }
    } catch (err) {
      soundService.playFail();
      setCombo(0);
      setIsDetectiveOpen(true);
    } finally {
      setIsRunning(false);
    }
  };

  const renderGameMode = () => {
    switch (currentGameMode) {
      case 'arena':
        return <AlgorithmArena currentLanguageId={currentLanguageId} xp={totalXP} combo={combo} onXPEarned={handleXPEarned} onComboChange={setCombo} />;
      case 'bugs':
        return <BugDetective currentLanguageId={currentLanguageId} onXPEarned={handleXPEarned} />;
      case 'speed':
        return <SpeedChallenge currentLanguageId={currentLanguageId} onXPEarned={handleXPEarned} />;
      case 'projects':
        return <ProjectWorkshop currentLanguageId={currentLanguageId} onXPEarned={handleXPEarned} />;
      case 'oracle':
        return (
          <LanguageOracle 
            currentLanguageId={currentLanguageId} 
            onSelectLanguage={handleSelectLanguage}
            onOpenRoadmap={() => setIsRoadmapOpen(true)}
          />
        );
      case 'lessons':
      default:
        return (
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar
              curriculum={activeCurriculum}
              currentLessonId={currentLessonId}
              completedLessons={completedLessonsInLang}
              onSelectLesson={handleSelectLesson}
              isOpenMobile={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onOpenModuleCheckpoint={(mod) => setActiveCheckpointModule(mod)}
              passedModuleExams={passedModuleExams}
              onOpenNotes={() => setIsNotesOpen(true)}
              isAdmin={isCurrentAdmin}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />

            <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              {/* Mobile View Switcher Tab Strip (Visible on mobile/phone screens < 1024px) */}
              <div className="lg:hidden flex items-center justify-around border-b border-slate-200 bg-white p-1.5 shrink-0 select-none">
                <button
                  onClick={() => setMobileTab('lesson')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    mobileTab === 'lesson'
                      ? 'bg-sky-50 text-sky-700 border border-sky-300 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>📖</span>
                  <span>Quest</span>
                </button>

                <button
                  onClick={() => setMobileTab('editor')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    mobileTab === 'editor'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>💻</span>
                  <span>Editor</span>
                </button>

                <button
                  onClick={() => setMobileTab('output')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    mobileTab === 'output'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>⚡</span>
                  <span>Output</span>
                  {testResults && (
                    <span className="text-[10px]">
                      {testResults.allPassed ? '✅' : '❌'}
                    </span>
                  )}
                </button>
              </div>

              {/* Responsive Workspace Panes */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Lesson Instructions Pane: full height on mobile if mobileTab === 'lesson', or on desktop */}
                <div className={`
                  ${mobileTab === 'lesson' ? 'flex' : 'hidden'} lg:flex
                  w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-slate-200 flex-col overflow-hidden h-full bg-white
                `}>
                  <LessonView
                    lesson={currentLesson}
                    onApplySolution={(c) => { setCurrentCode(c); setCombo(0); }}
                    onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                    onNextLesson={() => {
                      const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
                      if (currentIndex >= 0 && currentIndex < allLessons.length - 1) handleSelectLesson(allLessons[currentIndex + 1].id);
                    }}
                    onOpenCheckpoint={() => {
                      const currentMod = activeCurriculum.find(m => m.lessons.some(l => l.id === currentLessonId));
                      if (currentMod) setActiveCheckpointModule(currentMod);
                    }}
                    isComplete={completedLessonsInLang.includes(currentLessonId)}
                    isHeroMode={isHeroMode}
                    pythieMood={pythieMood}
                    pythieSpeech={pythieSpeech}
                    mascotName={activeLang.mascotName}
                    mascotType={activeLang.mascotType}
                    mascotTitle={activeLang.mascotTitle}
                  />
                </div>

                {/* Editor & Console Workspace */}
                <div className={`
                  ${mobileTab !== 'lesson' ? 'flex' : 'hidden'} lg:flex
                  w-full lg:w-7/12 flex-col p-2 sm:p-4 gap-2 sm:gap-3 overflow-hidden h-full bg-[#F8FAFC]
                `}>
                  {/* Editor: full on mobile if mobileTab === 'editor', or on desktop */}
                  <div className={`
                    ${mobileTab === 'editor' ? 'flex' : 'hidden'} lg:flex
                    flex-1 min-h-[220px] overflow-hidden flex-col
                  `}>
                    <CodeEditor
                      code={currentCode}
                      onChange={setCurrentCode}
                      onRun={handleRunCode}
                      onReset={() => setCurrentCode(currentLesson.starterCode)}
                      isRunning={isRunning}
                      wasmStatus={wasmStatus}
                      isHeroMode={isHeroMode}
                      language={currentLanguageId}
                    />
                  </div>

                  {/* Console: full on mobile if mobileTab === 'output', or at bottom of desktop */}
                  <div className={`
                    ${mobileTab === 'output' ? 'flex flex-1' : 'hidden'} lg:flex lg:shrink-0
                    overflow-hidden flex-col
                  `}>
                    <OutputConsole
                      outputResult={outputResult}
                      testResults={testResults}
                      onClearConsole={() => { setOutputResult(null); setTestResults(null); }}
                      onOpenDetective={() => setIsDetectiveOpen(true)}
                      isTestingMode={true}
                      isHeroMode={isHeroMode}
                      currentLanguageId={currentLanguageId}
                      mascotName={activeLang.mascotName}
                    />
                  </div>
                </div>
              </div>
            </main>
          </div>
        );
    }
  };

  // ── 0. INTRO LANDING: Aurevon Luxury Brand Landing (First Page Seen) ──
  if (showIntro) {
    return <AurevonIntro onEnter={() => setShowIntro(false)} />;
  }

  // Mandatory Login Gate: Always shown before classroom access
  if (!hasPassedLoginGate || !currentStudent || currentStudent.isGuest) {
    return (
      <AuthGateScreen 
        onAuthenticated={(student) => {
          handleStudentChanged(student);
          setHasPassedLoginGate(true);
        }}
        onBackToIntro={() => setShowIntro(true)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#F8FAFC] text-slate-900">
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
        onResetProgress={() => storageService.resetLanguageProgress(currentLanguageId)}
        wasmStatus={wasmStatus}
        currentGameMode={currentGameMode}
        onSelectGameMode={setCurrentGameMode}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenExam={() => setIsExamOpen(true)}
        onOpenModeLocked={(modeId) => setLockedModeInfo(modeId)}
        currentStudent={currentStudent}
        onOpenStudentAuth={() => setIsStudentAuthOpen(true)}
        onOpenStudyPlan={() => setIsStudyPlanOpen(true)}
        isAdmin={isCurrentAdmin}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenIntro={() => setShowIntro(true)}
      />

      {renderGameMode()}

      <ComboMeter combo={combo} />

      <Top1PercentRoadmapModal 
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      <ErrorBoundary onReset={() => setIsNotesOpen(false)}>
        {isNotesOpen && (
          <DigitalNotesModal
            isOpen={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            currentLanguageId={currentLanguageId}
          />
        )}
      </ErrorBoundary>

      <CheckpointExamModal
        isOpen={isExamOpen}
        onClose={() => setIsExamOpen(false)}
        currentLanguageId={currentLanguageId}
        pyodideInstance={pyodide}
        onExamPassed={() => handleXPEarned(200)}
      />

      <ModeLockedModal
        isOpen={!!lockedModeInfo}
        onClose={() => setLockedModeInfo(null)}
        modeId={lockedModeInfo}
        languageId={currentLanguageId}
        languageName={activeLang.name}
        completedCount={completedLessonsInLang.length}
        onGoToQuests={() => setCurrentGameMode('lessons')}
        onUnlockAnyway={(modeId) => {
          setCurrentGameMode(modeId);
          setLockedModeInfo(null);
        }}
      />

      <ModuleCheckpointModal
        isOpen={!!activeCheckpointModule}
        onClose={() => setActiveCheckpointModule(null)}
        module={activeCheckpointModule}
        currentLanguageId={currentLanguageId}
        pyodideInstance={pyodide}
        onPassModule={(modId) => {
          setPassedModuleExams(prev => {
            const next = Array.from(new Set([...prev, modId]));
            localStorage.setItem('passed_module_exams', JSON.stringify(next));
            return next;
          });
          handleXPEarned(50);
        }}
      />

      {/* Student Profile & Email Account Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthOpen}
        onClose={() => setIsStudentAuthOpen(false)}
        onStudentChanged={handleStudentChanged}
        onOpenAdmin={() => setIsAdminOpen(true)}
        totalXP={totalXP}
        streak={streak}
        completedCount={completedLessonsInLang.length}
      />

      {/* Instructor Admin Portal Modal */}
      <ErrorBoundary onReset={() => setIsAdminOpen(false)}>
        {isAdminOpen && (
          <AdminPortalModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </ErrorBoundary>

      {/* Personalized Study Plan Timetable Modal */}
      <StudyPlanModal
        isOpen={isStudyPlanOpen}
        onClose={() => setIsStudyPlanOpen(false)}
        currentLanguageId={currentLanguageId}
        studentName={currentStudent?.name || 'Hero Student'}
        onOpenNotes={() => { setIsStudyPlanOpen(false); setIsNotesOpen(true); }}
      />

      {levelUpData && (
        <LevelUpModal newLevel={levelUpData.level} levelName={levelUpData.name} onClose={() => setLevelUpData(null)} />
      )}

      <TrophyToast 
        achievements={pendingAchievements} 
        onDismiss={() => setPendingAchievements(prev => prev.slice(1))} 
      />

      {bonusRoundActive && (
        <BonusRoundPopup 
          onAccept={() => { setBonusMultiplier(3); setBonusRoundActive(false); }}
          onSkip={() => { setBonusMultiplier(1); setBonusRoundActive(false); }}
        />
      )}

      {streakModalData && (
        <StreakModal 
          streakDays={streakModalData.days} 
          bonusXP={streakModalData.bonus} 
          onClose={() => {
            try {
              const currentClaimed = JSON.parse(localStorage.getItem('claimed_streak_milestones') || '[]');
              if (!currentClaimed.includes(streakModalData.days)) {
                currentClaimed.push(streakModalData.days);
                localStorage.setItem('claimed_streak_milestones', JSON.stringify(currentClaimed));
                handleXPEarned(streakModalData.bonus);
              }
            } catch {
              handleXPEarned(streakModalData.bonus);
            }
            setStreakModalData(null);
          }} 
        />
      )}

      {isGameModeSelectorOpen && (
        <GameModeSelector 
          currentXP={totalXP}
          onSelectMode={(mode) => {
            setCurrentGameMode(mode);
            setIsGameModeSelectorOpen(false);
          }}
          onClose={() => setIsGameModeSelectorOpen(false)}
        />
      )}

      <DetectiveFailModal
        isOpen={isDetectiveOpen}
        onClose={() => setIsDetectiveOpen(false)}
        lesson={currentLesson}
        failedTests={testResults?.results || []}
        rawError={outputResult?.error}
        errorDetails={null}
        onApplySolution={setCurrentCode}
        languageName={activeLang.name}
        mascotName={activeLang.mascotName}
        mascotType={activeLang.mascotType}
      />

      <CheatsheetModal isOpen={isCheatsheetOpen} onClose={() => setIsCheatsheetOpen(false)} currentLanguageId={currentLanguageId} languageName={activeLang.name} />
      <SandboxModal isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} sandboxCode="" onSaveSandboxCode={() => {}} pyodideInstance={pyodide} currentLanguageId={currentLanguageId} languageName={activeLang.name} mascotName={activeLang.mascotName} />
      <CelebrationModal 
        isOpen={isCelebrationOpen} 
        lessonTitle={currentLesson?.title || 'Challenge'} 
        xpGained={recentXpAward} 
        onNextLesson={() => {
          const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
          if (currentIndex >= 0 && currentIndex < allLessons.length - 1) handleSelectLesson(allLessons[currentIndex + 1].id);
        }}
        onClose={() => setIsCelebrationOpen(false)}
        nextLessonTitle={(() => {
          const idx = allLessons.findIndex(l => l.id === currentLessonId);
          return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1].title : null;
        })()}
        nextLessonHook={(() => {
          const idx = allLessons.findIndex(l => l.id === currentLessonId);
          const next = allLessons[idx + 1];
          return next ? `Next, you'll discover: ${next.badge} — ${next.task?.slice(0, 60)}...` : "You're at the frontier of mastery!";
        })()}
      />
    </div>
  );
}


