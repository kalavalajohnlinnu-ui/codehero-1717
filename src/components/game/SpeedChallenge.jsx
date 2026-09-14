import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from '../CodeEditor';
import { soundService } from '../../services/soundService';
import { LanguageLogo } from '../LanguageLogo';

const SPEED_DRILLS = [
  {
    id: 'drill-1', title: 'Reverse a String', difficulty: 'Easy', timeLimit: 60, xpReward: 50,
    prompt: 'Write a function reverse_string(s) that returns the reversed string.',
    starterCode: { python: 'def reverse_string(s):\n    pass', javascript: 'function reverseString(s) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? (code.includes('[::-1]') || code.includes('reversed')) : (code.includes('split') && code.includes('reverse')),
    tip: "In Python: s[::-1] reverses a string. In JS: s.split('').reverse().join('')"
  },
  {
    id: 'drill-2', title: 'FizzBuzz', difficulty: 'Medium', timeLimit: 90, xpReward: 75,
    prompt: 'Write a function fizzbuzz(n) that returns "Fizz" for multiples of 3, "Buzz" for 5, and "FizzBuzz" for 15.',
    starterCode: { python: 'def fizzbuzz(n):\n    pass', javascript: 'function fizzbuzz(n) {\n    // your code\n}' },
    checkCode: (code) => code.includes('15') && code.includes('3') && code.includes('5') && code.includes('Fizz') && code.includes('Buzz'),
    tip: 'Check for % 15 == 0 first!'
  },
  {
    id: 'drill-3', title: 'Print 1-10', difficulty: 'Easy', timeLimit: 45, xpReward: 30,
    prompt: 'Write a loop that prints numbers from 1 to 10.',
    starterCode: { python: 'for i in range(11):\n    pass', javascript: 'for(let i=1; i<=10; i++) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? (code.includes('print') && code.includes('range')) : (code.includes('console.log') && code.includes('i++')),
    tip: 'Use a simple for loop.'
  },
  {
    id: 'drill-4', title: 'Sum two numbers', difficulty: 'Easy', timeLimit: 30, xpReward: 20,
    prompt: 'Write a function sum_nums(a, b) that returns the sum of a and b.',
    starterCode: { python: 'def sum_nums(a, b):\n    pass', javascript: 'function sumNums(a, b) {\n    // your code\n}' },
    checkCode: (code) => code.includes('+') && code.includes('return'),
    tip: 'Use the + operator.'
  },
  {
    id: 'drill-5', title: 'Find max in list', difficulty: 'Medium', timeLimit: 60, xpReward: 60,
    prompt: 'Write a function find_max(arr) that returns the largest number in a list.',
    starterCode: { python: 'def find_max(arr):\n    pass', javascript: 'function findMax(arr) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? code.includes('max(') : code.includes('Math.max'),
    tip: 'Many languages have a built-in max() function.'
  },
  {
    id: 'drill-6', title: 'Count vowels', difficulty: 'Medium', timeLimit: 75, xpReward: 70,
    prompt: 'Write a function count_vowels(s) that returns the number of vowels in a string.',
    starterCode: { python: 'def count_vowels(s):\n    pass', javascript: 'function countVowels(s) {\n    // your code\n}' },
    checkCode: (code) => code.includes('a') && code.includes('e') && code.includes('i') && code.includes('o') && code.includes('u'),
    tip: 'Iterate through the string and check if each character is in "aeiou".'
  },
  {
    id: 'drill-7', title: 'Capitalize first letter', difficulty: 'Easy', timeLimit: 45, xpReward: 40,
    prompt: 'Write a function capitalize(s) that capitalizes the first letter of a string.',
    starterCode: { python: 'def capitalize(s):\n    pass', javascript: 'function capitalize(s) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? (code.includes('capitalize()') || code.includes('upper()')) : code.includes('toUpperCase()'),
    tip: 'Use built-in string methods like .upper() or .toUpperCase().'
  },
  {
    id: 'drill-8', title: 'Remove duplicates', difficulty: 'Hard', timeLimit: 120, xpReward: 100,
    prompt: 'Write a function remove_dups(arr) that returns a list with duplicates removed.',
    starterCode: { python: 'def remove_dups(arr):\n    pass', javascript: 'function removeDups(arr) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? code.includes('set(') : code.includes('Set('),
    tip: 'Converting to a Set automatically removes duplicates.'
  },
  {
    id: 'drill-9', title: 'Square numbers', difficulty: 'Easy', timeLimit: 45, xpReward: 40,
    prompt: 'Write a function square_nums(arr) that returns a list of squared numbers.',
    starterCode: { python: 'def square_nums(arr):\n    pass', javascript: 'function squareNums(arr) {\n    // your code\n}' },
    checkCode: (code) => code.includes('** 2') || code.includes('*') || code.includes('map('),
    tip: 'You can use map() or list comprehensions.'
  },
  {
    id: 'drill-10', title: 'Check palindrome', difficulty: 'Medium', timeLimit: 90, xpReward: 80,
    prompt: 'Write a function is_palindrome(s) returning True if s is a palindrome.',
    starterCode: { python: 'def is_palindrome(s):\n    pass', javascript: 'function isPalindrome(s) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? code.includes('[::-1]') : code.includes('reverse()'),
    tip: 'Compare the string to its reversed version.'
  },
  {
    id: 'drill-11', title: 'Filter evens', difficulty: 'Medium', timeLimit: 60, xpReward: 60,
    prompt: 'Write a function filter_evens(arr) returning only even numbers.',
    starterCode: { python: 'def filter_evens(arr):\n    pass', javascript: 'function filterEvens(arr) {\n    // your code\n}' },
    checkCode: (code) => code.includes('% 2') && code.includes('== 0'),
    tip: 'Check if number % 2 == 0.'
  },
  {
    id: 'drill-12', title: 'Sort ascending', difficulty: 'Easy', timeLimit: 45, xpReward: 40,
    prompt: 'Write a function sort_asc(arr) returning the array sorted.',
    starterCode: { python: 'def sort_asc(arr):\n    pass', javascript: 'function sortAsc(arr) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? (code.includes('sort') || code.includes('sorted')) : code.includes('sort('),
    tip: 'Use built-in sorting methods.'
  },
  {
    id: 'drill-13', title: 'Factorial', difficulty: 'Hard', timeLimit: 120, xpReward: 120,
    prompt: 'Write a function factorial(n) returning n!.',
    starterCode: { python: 'def factorial(n):\n    pass', javascript: 'function factorial(n) {\n    // your code\n}' },
    checkCode: (code) => code.includes('n *') || code.includes('math.factorial') || code.includes('n*'),
    tip: 'Can be solved recursively or with a loop.'
  },
  {
    id: 'drill-14', title: 'Power function', difficulty: 'Easy', timeLimit: 45, xpReward: 50,
    prompt: 'Write a function power(base, exp) returning base^exp.',
    starterCode: { python: 'def power(base, exp):\n    pass', javascript: 'function power(base, exp) {\n    // your code\n}' },
    checkCode: (code, lang) => lang === 'python' ? code.includes('**') : code.includes('Math.pow'),
    tip: 'Use the ** operator in Python or Math.pow in JS.'
  },
  {
    id: 'drill-15', title: 'Say Hello', difficulty: 'Easy', timeLimit: 30, xpReward: 10,
    prompt: 'Write a function say_hello(name) returning "Hello, {name}!".',
    starterCode: { python: 'def say_hello(name):\n    pass', javascript: 'function sayHello(name) {\n    // your code\n}' },
    checkCode: (code) => (code.includes('Hello') || code.includes('hello')) && code.includes('return'),
    tip: 'Use f-strings or template literals.'
  }
];

export function SpeedChallenge({ currentLanguageId = 'python', onXPEarned }) {
  const [activeDrill, setActiveDrill] = useState(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedDrills, setCompletedDrills] = useState([]);
  const [gameState, setGameState] = useState('lobby'); // 'lobby', 'active', 'won', 'lost'
  const [shake, setShake] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('speed_drills_completed');
      if (saved) {
        setCompletedDrills(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading saved drills', e);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (gameState === 'active' && timeLeft === 0) {
      handleTimeOut();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameState]);

  const startDrill = (drill) => {
    setActiveDrill(drill);
    setCode(drill.starterCode[currentLanguageId] || drill.starterCode.python);
    setTimeLeft(drill.timeLimit);
    setGameState('active');
  };

  const handleTimeOut = () => {
    setGameState('lost');
    if (soundService?.playFail) soundService.playFail();
  };

  const submitCode = () => {
    if (activeDrill.checkCode(code, currentLanguageId)) {
      setGameState('won');
      if (soundService?.playSuccess) soundService.playSuccess();
      if (onXPEarned) onXPEarned(activeDrill.xpReward);
      
      const updated = [...new Set([...completedDrills, activeDrill.id])];
      setCompletedDrills(updated);
      localStorage.setItem('speed_drills_completed', JSON.stringify(updated));
    } else {
      if (soundService?.playFail) soundService.playFail();
      setTimeLeft(prev => Math.max(0, prev - 5));
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (diff === 'Medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-crimson-100 text-red-800 border-red-200';
  };

  if (gameState === 'lobby' || !activeDrill) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8 mb-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-3 shadow-2xs">
              <LanguageLogo languageId={currentLanguageId} size={16} className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-700 capitalize">{currentLanguageId || 'python'} Track</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 font-display">⚡ SPEED PRACTICE</h1>
            <p className="text-slate-500 text-base">Beat the clock! Solve coding drills in 60 seconds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPEED_DRILLS.map((drill) => {
              const isCompleted = completedDrills.includes(drill.id);
              return (
                <div key={drill.id} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                  {isCompleted && (
                    <div className="absolute top-4 right-4 text-[#059669] bg-emerald-50 p-1 rounded-full">
                      ✓
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{drill.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-md border bg-slate-100 text-slate-700 border-slate-200">
                      ⏱ {drill.timeLimit}s
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-md border bg-sky-100 text-[#0284C7] border-sky-200">
                      +{drill.xpReward} XP
                    </span>
                  </div>
                  <div className="mt-auto pt-4">
                    <button 
                      onClick={() => startDrill(drill)}
                      className="w-full py-2 bg-[#0284C7] text-white rounded-lg font-semibold active:scale-[0.97] transition-transform"
                    >
                      ▶ START CHALLENGE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8 text-center flex flex-col items-center justify-center relative">
          <button 
            onClick={() => setGameState('lobby')}
            className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 text-sm active:scale-[0.97] transition-transform font-bold"
          >
            ← Back
          </button>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
            <LanguageLogo languageId={currentLanguageId} size={14} className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-mono font-bold text-slate-700 capitalize">{currentLanguageId || 'python'}</span>
          </div>
          
          <h2 className="text-slate-500 font-semibold mb-2 uppercase tracking-wide">Time Remaining</h2>
          <div className={`text-6xl font-bold font-mono ${timeLeft < 10 ? 'text-[#DC2626] animate-pulse' : 'text-slate-800'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6 transition-transform ${shake ? 'animate-shake translate-x-1' : ''}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{activeDrill.title}</h2>
          <p className="text-slate-700 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {activeDrill.prompt}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-amber-800 font-bold text-sm mb-1">💡 Pro Tip</h4>
            <p className="text-amber-700 text-sm">{activeDrill.tip}</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {gameState === 'active' && (
          <>
            <div className="flex-grow">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={currentLanguageId}
                onRun={() => {}}
                isRunning={false}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-[#E2E8F0]">
              <button 
                onClick={submitCode}
                className="w-full py-4 bg-[#059669] hover:bg-emerald-600 text-white text-xl font-bold rounded-lg shadow-sm active:scale-[0.97] transition-all"
              >
                SUBMIT SOLUTION
              </button>
            </div>
          </>
        )}
        
        {gameState === 'won' && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-emerald-50">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-[#059669] mb-2">Challenge Completed!</h2>
            <p className="text-emerald-700 mb-8">You earned +{activeDrill.xpReward} XP</p>
            <button 
              onClick={() => setGameState('lobby')}
              className="px-8 py-3 bg-[#059669] text-white rounded-lg font-bold active:scale-[0.97] transition-transform shadow-md"
            >
              Back to Lobby
            </button>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-red-50">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-3xl font-bold text-[#DC2626] mb-2">Time's Up!</h2>
            <p className="text-red-700 mb-8">Don't worry, keep practicing to get faster.</p>
            <button 
              onClick={() => setGameState('lobby')}
              className="px-8 py-3 bg-white border-2 border-[#DC2626] text-[#DC2626] rounded-lg font-bold active:scale-[0.97] transition-transform shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
