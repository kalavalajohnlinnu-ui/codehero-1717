import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../CodeEditor';
import { soundService } from '../../services/soundService';
import { LanguageLogo } from '../LanguageLogo';

const PROJECTS = [
  {
    id: 'magic-calculator',
    title: 'Magic Calculator',
    icon: '🧮',
    description: 'Build a fully functional calculator that handles addition, subtraction, multiplication, and division with error handling.',
    difficulty: 'Beginner',
    totalXP: 300,
    estimatedTime: '45 min',
    steps: [
      { id: 1, title: 'The Add Function', concept: 'Functions take inputs and return outputs.', task: 'Write a function add(a, b) that returns the sum of two numbers.', starterCode: { python: 'def add(a, b):\n    pass', javascript: 'function add(a, b) {\n    // return the sum\n}' }, checkCode: (code) => code.includes('return') && (code.includes('a + b') || code.includes('a+b')), xpReward: 50 },
      { id: 2, title: 'Subtraction', concept: 'The minus operator subtracts numbers.', task: 'Write subtract(a, b) returning a - b.', starterCode: { python: 'def subtract(a, b):\n    pass', javascript: 'function subtract(a, b) {\n    // return a minus b\n}' }, checkCode: (code) => code.includes('return') && (code.includes('a - b') || code.includes('a-b')), xpReward: 50 },
      { id: 3, title: 'Multiplication', concept: 'The * operator multiplies.', task: 'Write multiply(a, b) returning a * b.', starterCode: { python: 'def multiply(a, b):\n    pass', javascript: 'function multiply(a, b) {\n    // your code\n}' }, checkCode: (code) => code.includes('return') && (code.includes('a * b') || code.includes('a*b')), xpReward: 50 },
      { id: 4, title: 'Division with Safety', concept: 'Division by zero causes errors - always guard against it.', task: 'Write divide(a, b). If b is 0, return "Error: Division by zero". Otherwise return a / b.', starterCode: { python: 'def divide(a, b):\n    pass', javascript: 'function divide(a, b) {\n    // handle division by zero\n}' }, checkCode: (code) => code.includes('return') && (code.includes('0') || code.includes('zero')), xpReward: 75 },
      { id: 5, title: 'The Main Calculator', concept: 'Combine everything into one function.', task: 'Write calculator(op, a, b) that calls add/subtract/multiply/divide based on the op (+,-,*,/) string.', starterCode: { python: 'def calculator(op, a, b):\n    pass', javascript: 'function calculator(op, a, b) {\n    // route to the right function\n}' }, checkCode: (code) => code.includes('if') && code.includes('+'), xpReward: 75 }
    ]
  },
  {
    id: 'guessing-game',
    title: 'Guessing Game',
    icon: '🎯',
    description: 'Build a number guessing game with hints.',
    difficulty: 'Beginner',
    totalXP: 250,
    estimatedTime: '30 min',
    steps: [
      { id: 1, title: 'Generate Number', concept: 'Randomness is useful in games.', task: 'Import random and write get_target() returning a random number between 1 and 10.', starterCode: { python: 'import random\n\ndef get_target():\n    pass', javascript: 'function getTarget() {\n    // return random between 1 and 10\n}' }, checkCode: (code) => code.includes('random') || code.includes('Math.random'), xpReward: 50 },
      { id: 2, title: 'Check Guess', concept: 'Comparing values is core to logic.', task: 'Write check_guess(guess, target) returning "Too high", "Too low", or "Correct".', starterCode: { python: 'def check_guess(guess, target):\n    pass', javascript: 'function checkGuess(guess, target) {\n    // check guess\n}' }, checkCode: (code) => code.includes('Too high') && code.includes('Too low') && code.includes('Correct'), xpReward: 100 },
      { id: 3, title: 'Game Loop', concept: 'Loops keep games running.', task: 'Write play_game() that loops until the guess is correct.', starterCode: { python: 'def play_game():\n    pass', javascript: 'function playGame() {\n    // game loop\n}' }, checkCode: (code) => code.includes('while') || code.includes('loop'), xpReward: 100 }
    ]
  },
  {
    id: 'todo-list',
    title: 'To-Do List',
    icon: '📝',
    description: 'Build a simple array-based to-do list manager.',
    difficulty: 'Intermediate',
    totalXP: 400,
    estimatedTime: '60 min',
    steps: [
      { id: 1, title: 'Create List', concept: 'Arrays/Lists hold multiple items.', task: 'Create a global variable `todos` initialized to an empty list.', starterCode: { python: 'todos = []', javascript: 'let todos = [];' }, checkCode: (code) => code.includes('todos = []') || code.includes('todos = [];'), xpReward: 50 },
      { id: 2, title: 'Add Item', concept: 'Appending adds to the end of a list.', task: 'Write add_todo(item) to append an item to `todos`.', starterCode: { python: 'def add_todo(item):\n    pass', javascript: 'function addTodo(item) {\n    // add item\n}' }, checkCode: (code) => code.includes('append') || code.includes('push'), xpReward: 100 },
      { id: 3, title: 'Remove Item', concept: 'Removing by value or index.', task: 'Write remove_todo(item) to remove an item from `todos`.', starterCode: { python: 'def remove_todo(item):\n    pass', javascript: 'function removeTodo(item) {\n    // remove item\n}' }, checkCode: (code) => code.includes('remove') || code.includes('splice') || code.includes('filter'), xpReward: 150 },
      { id: 4, title: 'View Items', concept: 'Iterating through lists.', task: 'Write view_todos() to print all items.', starterCode: { python: 'def view_todos():\n    pass', javascript: 'function viewTodos() {\n    // print items\n}' }, checkCode: (code) => code.includes('for') && (code.includes('print') || code.includes('console.log')), xpReward: 100 }
    ]
  },
  {
    id: 'number-analyser',
    title: 'Number Analyser',
    icon: '📊',
    description: 'Analyse a list of numbers to find stats.',
    difficulty: 'Intermediate',
    totalXP: 350,
    estimatedTime: '50 min',
    steps: [
      { id: 1, title: 'Find Average', concept: 'Sum divided by count.', task: 'Write get_average(nums) returning the mean.', starterCode: { python: 'def get_average(nums):\n    pass', javascript: 'function getAverage(nums) {\n    // average\n}' }, checkCode: (code) => code.includes('sum') || (code.includes('reduce') && code.includes('length')), xpReward: 100 },
      { id: 2, title: 'Find Max and Min', concept: 'Min/Max algorithms.', task: 'Write get_extremes(nums) returning [min, max].', starterCode: { python: 'def get_extremes(nums):\n    pass', javascript: 'function getExtremes(nums) {\n    // return [min, max]\n}' }, checkCode: (code) => code.includes('min') && code.includes('max'), xpReward: 100 },
      { id: 3, title: 'Count Evens', concept: 'Filtering with modulo.', task: 'Write count_evens(nums) returning the count of even numbers.', starterCode: { python: 'def count_evens(nums):\n    pass', javascript: 'function countEvens(nums) {\n    // count evens\n}' }, checkCode: (code) => code.includes('% 2') || code.includes('%2'), xpReward: 150 }
    ]
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    icon: '📖',
    description: 'Count word occurrences in text.',
    difficulty: 'Advanced',
    totalXP: 500,
    estimatedTime: '60 min',
    steps: [
      { id: 1, title: 'Split Text', concept: 'String splitting.', task: 'Write split_text(text) to return a list of lowercase words.', starterCode: { python: 'def split_text(text):\n    pass', javascript: 'function splitText(text) {\n    // split\n}' }, checkCode: (code) => (code.includes('lower()') || code.includes('toLowerCase()')) && code.includes('split'), xpReward: 100 },
      { id: 2, title: 'Count Words', concept: 'Dictionaries/Objects for counting.', task: 'Write count_words(words) returning a dict of word counts.', starterCode: { python: 'def count_words(words):\n    pass', javascript: 'function countWords(words) {\n    // counts\n}' }, checkCode: (code) => code.includes('{}') || code.includes('dict()') || code.includes('Map'), xpReward: 200 },
      { id: 3, title: 'Find Most Common', concept: 'Sorting dictionaries.', task: 'Write most_common(counts) returning the most frequent word.', starterCode: { python: 'def most_common(counts):\n    pass', javascript: 'function mostCommon(counts) {\n    // most common\n}' }, checkCode: (code) => code.includes('max') || code.includes('sort'), xpReward: 200 }
    ]
  },
  {
    id: 'grade-calc',
    title: 'Grade Calculator',
    icon: '🎓',
    description: 'Convert numerical scores to letter grades.',
    difficulty: 'Beginner',
    totalXP: 200,
    estimatedTime: '30 min',
    steps: [
      { id: 1, title: 'Letter Grade', concept: 'If/elif/else chains.', task: 'Write get_grade(score) returning A(90+), B(80+), C(70+), D(60+), or F.', starterCode: { python: 'def get_grade(score):\n    pass', javascript: 'function getGrade(score) {\n    // return grade\n}' }, checkCode: (code) => code.includes('90') && code.includes('80') && code.includes('A') && code.includes('F'), xpReward: 100 },
      { id: 2, title: 'Class Average', concept: 'Mapping functions over lists.', task: 'Write class_grades(scores) returning a list of letter grades.', starterCode: { python: 'def class_grades(scores):\n    pass', javascript: 'function classGrades(scores) {\n    // return letter grades list\n}' }, checkCode: (code) => code.includes('get_grade') || code.includes('getGrade') || code.includes('map'), xpReward: 100 }
    ]
  }
];

export function ProjectWorkshop({ currentLanguageId = 'python', onXPEarned }) {
  const [activeProject, setActiveProject] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [code, setCode] = useState('');
  const [projectProgress, setProjectProgress] = useState({});
  const [stepPassed, setStepPassed] = useState(false);
  const [projectCompleted, setProjectCompleted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('project_progress');
      if (saved) {
        setProjectProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading project progress', e);
    }
  }, []);

  const saveProgress = (newProgress) => {
    setProjectProgress(newProgress);
    localStorage.setItem('project_progress', JSON.stringify(newProgress));
  };

  const startProject = (project) => {
    setActiveProject(project);
    setCurrentStepIndex(0);
    setProjectCompleted(false);
    setStepPassed(false);
    
    // Check if this project has saved progress
    const savedSteps = projectProgress[project.id] || [];
    let nextUncompletedStep = 0;
    while (nextUncompletedStep < project.steps.length && savedSteps.includes(project.steps[nextUncompletedStep].id)) {
      nextUncompletedStep++;
    }
    
    if (nextUncompletedStep >= project.steps.length) {
      setProjectCompleted(true);
    } else {
      setCurrentStepIndex(nextUncompletedStep);
      const step = project.steps[nextUncompletedStep];
      setCode(step.starterCode[currentLanguageId] || step.starterCode.python);
    }
  };

  const handleRunAndCheck = () => {
    if (!activeProject) return;
    const currentStep = activeProject.steps[currentStepIndex];
    
    if (currentStep.checkCode(code)) {
      setStepPassed(true);
      if (soundService?.playSuccess) soundService.playSuccess();
      
      const currentSavedSteps = projectProgress[activeProject.id] || [];
      if (!currentSavedSteps.includes(currentStep.id)) {
        const newSavedSteps = [...currentSavedSteps, currentStep.id];
        saveProgress({
          ...projectProgress,
          [activeProject.id]: newSavedSteps
        });
        if (onXPEarned) onXPEarned(currentStep.xpReward);
      }
    } else {
      if (soundService?.playFail) soundService.playFail();
    }
  };

  const nextStep = () => {
    if (currentStepIndex + 1 < activeProject.steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      setStepPassed(false);
      const nextStepData = activeProject.steps[currentStepIndex + 1];
      setCode(nextStepData.starterCode[currentLanguageId] || nextStepData.starterCode.python);
    } else {
      setProjectCompleted(true);
      if (onXPEarned) onXPEarned(activeProject.totalXP);
    }
  };

  const getDifficultyBadge = (diff) => {
    if (diff === 'Beginner') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (diff === 'Intermediate') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-crimson-100 text-red-800 border-red-200';
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8 mb-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-3 shadow-2xs">
              <LanguageLogo languageId={currentLanguageId} size={16} className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-700 capitalize">{currentLanguageId || 'python'} Workshop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 font-display">🏗️ Project Lab — Build Real Software</h1>
            <p className="text-slate-500 text-base">15 progressive builds from zero to hero</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((proj) => {
              const completedSteps = projectProgress[proj.id] || [];
              const isFullyCompleted = completedSteps.length === proj.steps.length;
              const progressPercent = (completedSteps.length / proj.steps.length) * 100;

              return (
                <div key={proj.id} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 hover:shadow-md transition-shadow relative">
                  {isFullyCompleted && (
                    <div className="absolute top-4 right-4 text-[#059669] bg-emerald-50 p-1 rounded-full">
                      ✓
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl bg-slate-50 p-3 rounded-lg border border-slate-100">{proj.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{proj.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getDifficultyBadge(proj.difficulty)}`}>
                          {proj.difficulty}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-md border bg-slate-100 text-slate-700 border-slate-200">
                          ⏱ {proj.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm">{proj.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{completedSteps.length} / {proj.steps.length} steps</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#059669] h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => startProject(proj)}
                    className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-lg font-semibold active:scale-[0.97] transition-all"
                  >
                    {isFullyCompleted ? 'Review Project' : (completedSteps.length > 0 ? 'Continue Project' : 'Start Project')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentStep = activeProject.steps[currentStepIndex];
  const completedSteps = projectProgress[activeProject.id] || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveProject(null)}
            className="text-slate-400 hover:text-slate-600 font-medium active:scale-[0.97] transition-transform"
          >
            ← Back to Projects
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LanguageLogo languageId={currentLanguageId} size={20} className="w-5 h-5 shrink-0" />
            <span>{activeProject.title}</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-500">
            Step {currentStepIndex + 1} of {activeProject.steps.length}
          </span>
          <span className="px-3 py-1 bg-sky-50 text-[#0284C7] border border-sky-100 rounded-full text-sm font-bold shadow-sm">
            Total Reward: {activeProject.totalXP} XP
          </span>
        </div>
      </div>

      {projectCompleted ? (
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-emerald-200 text-center max-w-lg">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-[#059669] mb-4">Project Completed!</h2>
            <p className="text-slate-600 mb-8 text-lg">Amazing work building the {activeProject.title}. You've earned all the XP for this project.</p>
            <button 
              onClick={() => setActiveProject(null)}
              className="px-8 py-3 bg-[#059669] hover:bg-emerald-600 text-white rounded-lg font-bold text-lg shadow-sm active:scale-[0.97] transition-transform"
            >
              Return to Project Lab
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col lg:flex-row p-6 gap-6 h-full overflow-hidden">
          <div className="w-full lg:w-[38%] flex flex-col gap-6 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Project Steps</h3>
              <ul className="space-y-2">
                {activeProject.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(step.id);
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <li key={step.id} className={`p-3 rounded-lg flex items-center gap-3 border ${isCurrent ? 'bg-sky-50 border-sky-200' : 'bg-transparent border-transparent'} ${isDone ? 'text-slate-500' : 'text-slate-700'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDone ? 'bg-[#059669] text-white' : (isCurrent ? 'bg-[#0284C7] text-white' : 'bg-slate-200 text-slate-500')}`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={isCurrent ? 'font-semibold text-slate-800' : ''}>{step.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex-grow flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-xs font-bold uppercase tracking-wider mb-3">
                  Concept
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {currentStep.concept}
                </p>
              </div>
              
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md text-xs font-bold uppercase tracking-wider mb-3">
                  Task
                </span>
                <p className="text-slate-800 font-medium text-lg leading-snug">
                  {currentStep.task}
                </p>
              </div>

              <div className="mt-auto">
                {stepPassed ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-[#059669] font-bold text-lg mb-2">Great job! Step passed.</div>
                    <button 
                      onClick={nextStep}
                      className="w-full py-3 bg-[#059669] text-white rounded-lg font-bold shadow-sm active:scale-[0.97] transition-transform mt-2"
                    >
                      Next Step →
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic text-center">
                    Write your solution in the editor and click Run & Check to verify.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[62%] bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex flex-col overflow-hidden">
            <div className="flex-grow">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={currentLanguageId}
                onRun={() => {}}
                isRunning={false}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-500">
                Reward: <span className="text-[#059669]">+{currentStep.xpReward} XP</span>
              </div>
              <button 
                onClick={handleRunAndCheck}
                disabled={stepPassed}
                className={`px-8 py-3 rounded-lg font-bold shadow-sm active:scale-[0.97] transition-all ${stepPassed ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'}`}
              >
                ▶ Run & Check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
