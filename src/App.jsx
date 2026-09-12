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

// Game Components
import { getLevelProgress as getLevelInfo } from './services/gameEngine';
import { ComboMeter } from './components/game/ComboMeter';
import { LevelUpModal } from './components/game/LevelUpModal';
import { TrophyToast } from './components/game/TrophyToast';
import { DailyRewardModal } from './components/game/DailyRewardModal';
import { BonusRoundPopup } from './components/game/BonusRoundPopup';
import { StreakModal } from './components/game/StreakModal';
import { GameModeSelector } from './components/game/GameModeSelector';
import { AlgorithmArena } from './components/game/AlgorithmArena';
import { BugDetective } from './components/game/BugDetective';
import { SpeedChallenge } from './components/game/SpeedChallenge';
import { ProjectWorkshop } from './components/game/ProjectWorkshop';
import { LanguageOracle } from './components/LanguageOracle';
import { Top1PercentRoadmapModal } from './components/Top1PercentRoadmapModal';
import { DigitalNotesModal } from './components/DigitalNotesModal';
import { CheckpointExamModal } from './components/CheckpointExamModal';

export default function App() {
  // 1. Language & State
  const [currentLanguageId, setCurrentLanguageId] = useState('python');
  const [completedByLanguage, setCompletedByLanguage] = useState({});
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(1);

  // Game State
  const [combo, setCombo] = useState(0);
  const [bonusRoundActive, setBonusRoundActive] = useState(false);
  const [bonusMultiplier, setBonusMultiplier] = useState(1);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(true); // default true, check in effect
  const [currentGameMode, setCurrentGameMode] = useState('lessons'); // 'lessons' | 'arena' | 'bugs' | 'speed' | 'projects'
  const [isGameModeSelectorOpen, setIsGameModeSelectorOpen] = useState(false);
  const [lessonsCompletedSession, setLessonsCompletedSession] = useState(0);
  
  // Modals state
  const [levelUpData, setLevelUpData] = useState(null);
  const [streakModalData, setStreakModalData] = useState(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);

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

    const today = new Date().toISOString().split('T')[0];
    const lastClaim = localStorage.getItem('lastDailyClaim');
    if (lastClaim !== today) {
      setDailyRewardClaimed(false);
    }

    // Check streak milestones
    if (savedState.streak > 1 && [3, 7, 14, 30, 50, 100].includes(savedState.streak) && lastClaim !== today) {
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

  const handleClaimDaily = (amount) => {
    handleXPEarned(amount);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastDailyClaim', today);
    setDailyRewardClaimed(true);
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
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setPythieMood('thinking');
    
    try {
      const execResult = await runMultiLanguageCode(currentCode, currentLanguageId, pyodide);
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
            />
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-900/20">
              <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col overflow-hidden h-1/2 lg:h-full bg-slate-950/40">
                <LessonView
                  lesson={currentLesson}
                  onApplySolution={(c) => { setCurrentCode(c); setCombo(0); }}
                  onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                  onNextLesson={() => {
                    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
                    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) handleSelectLesson(allLessons[currentIndex + 1].id);
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
              <div className="w-full lg:w-7/12 flex flex-col p-2.5 sm:p-4 gap-2.5 sm:gap-3 overflow-hidden h-1/2 lg:h-full bg-slate-950/60">
                <div className="flex-1 min-h-[220px] overflow-hidden">
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
                <div className="shrink-0">
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
            </main>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans ${isHeroMode ? 'bg-[#06080F] text-slate-100' : 'bg-slate-950 text-slate-100'}`}>
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
      />

      {renderGameMode()}

      <ComboMeter combo={combo} />

      <Top1PercentRoadmapModal 
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      <DigitalNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        currentLanguageId={currentLanguageId}
      />

      <CheckpointExamModal
        isOpen={isExamOpen}
        onClose={() => setIsExamOpen(false)}
        currentLanguageId={currentLanguageId}
        pyodideInstance={pyodide}
        onExamPassed={() => handleXPEarned(200)}
      />

      {!dailyRewardClaimed && (
        <DailyRewardModal onClaim={handleClaimDaily} onClose={() => setDailyRewardClaimed(true)} />
      )}

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
            handleXPEarned(streakModalData.bonus);
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
      <CelebrationModal isOpen={isCelebrationOpen} lessonTitle={currentLesson?.title || 'Challenge'} xpGained={recentXpAward} onNextLesson={() => {}} onClose={() => setIsCelebrationOpen(false)} />
    </div>
  );
}


