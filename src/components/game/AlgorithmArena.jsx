import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../CodeEditor';
import { soundService } from '../../services/soundService';
import { LanguageLogo } from '../LanguageLogo';

const CHALLENGES = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'Arrays',
    difficulty: 'Easy',
    xpReward: 100,
    description: 'Given an array of integers and a target, return indices of the two numbers that add up to target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
    realWorldAnalogy: 'Like finding two items in a store that together cost exactly your budget.',
    starterCode: { python: 'def two_sum(nums, target):\n    pass', javascript: 'function twoSum(nums, target) {\n    // your code here\n}' },
    tests: [{ description: 'Finds elements correctly', check: (code) => code.includes('seen') || code.includes('dict') || code.includes('{') || code.includes('Map') }]
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    category: 'Strings',
    difficulty: 'Easy',
    xpReward: 80,
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    realWorldAnalogy: 'Flipping a stack of pancakes upside down.',
    starterCode: { python: 'def reverse_string(s):\n    pass', javascript: 'function reverseString(s) {\n    // your code here\n}' },
    tests: [{ description: 'Reverses the array', check: (code) => code.includes('::-1') || code.includes('reverse') || code.includes('left') }]
  },
  {
    id: 'fizz-buzz',
    title: 'FizzBuzz',
    category: 'Math',
    difficulty: 'Easy',
    xpReward: 50,
    description: 'Return an array from 1 to n where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and multiples of both are "FizzBuzz".',
    examples: [{ input: 'n = 3', output: '["1","2","Fizz"]' }],
    realWorldAnalogy: 'A counting game where you replace certain numbers with silly words.',
    starterCode: { python: 'def fizz_buzz(n):\n    pass', javascript: 'function fizzBuzz(n) {\n    // your code here\n}' },
    tests: [{ description: 'Checks mod 3 and 5', check: (code) => code.includes('% 3') && code.includes('% 5') }]
  },
  {
    id: 'factorial',
    title: 'Factorial',
    category: 'Recursion',
    difficulty: 'Easy',
    xpReward: 90,
    description: 'Write a function to compute the factorial of a number n (n!).',
    examples: [{ input: 'n = 5', output: '120' }],
    realWorldAnalogy: 'Multiplying a number by every number below it, like Russian nesting dolls of math.',
    starterCode: { python: 'def factorial(n):\n    pass', javascript: 'function factorial(n) {\n    // your code here\n}' },
    tests: [{ description: 'Calculates factorial', check: (code) => code.includes('n *') || code.includes('n - 1') }]
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    category: 'Recursion',
    difficulty: 'Easy',
    xpReward: 100,
    description: 'Return the nth number in the Fibonacci sequence.',
    examples: [{ input: 'n = 4', output: '3' }],
    realWorldAnalogy: 'Population growth of rabbits, where each generation is the sum of the two previous ones.',
    starterCode: { python: 'def fibonacci(n):\n    pass', javascript: 'function fibonacci(n) {\n    // your code here\n}' },
    tests: [{ description: 'Fibonacci logic', check: (code) => code.includes('n-1') || code.includes('n - 1') }]
  },
  {
    id: 'find-max',
    title: 'Find Maximum',
    category: 'Arrays',
    difficulty: 'Easy',
    xpReward: 60,
    description: 'Find the maximum value in an unsorted array of numbers.',
    examples: [{ input: 'nums = [3, 1, 4, 1, 5, 9]', output: '9' }],
    realWorldAnalogy: 'Looking through a deck of cards to find the highest value.',
    starterCode: { python: 'def find_max(nums):\n    pass', javascript: 'function findMax(nums) {\n    // your code here\n}' },
    tests: [{ description: 'Finds max', check: (code) => code.includes('max') || code.includes('>') }]
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    category: 'Strings',
    difficulty: 'Easy',
    xpReward: 70,
    description: 'Count the number of vowels (a, e, i, o, u) in a given string.',
    examples: [{ input: 's = "hello world"', output: '3' }],
    realWorldAnalogy: 'Scanning a document to count how many times a specific word appears.',
    starterCode: { python: 'def count_vowels(s):\n    pass', javascript: 'function countVowels(s) {\n    // your code here\n}' },
    tests: [{ description: 'Counts vowels', check: (code) => code.includes('a') || code.includes('e') || code.includes('vowel') }]
  },
  {
    id: 'palindrome',
    title: 'Palindrome Check',
    category: 'Strings',
    difficulty: 'Medium',
    xpReward: 120,
    description: 'Check if a given string reads the same forwards and backwards.',
    examples: [{ input: 's = "racecar"', output: 'true' }],
    realWorldAnalogy: 'A mirror reflection of a word.',
    starterCode: { python: 'def is_palindrome(s):\n    pass', javascript: 'function isPalindrome(s) {\n    // your code here\n}' },
    tests: [{ description: 'Checks palindrome', check: (code) => code.includes('::-1') || code.includes('reverse') }]
  },
  {
    id: 'sum-array',
    title: 'Sum of Array',
    category: 'Arrays',
    difficulty: 'Easy',
    xpReward: 50,
    description: 'Calculate the sum of all numbers in an array.',
    examples: [{ input: 'nums = [1, 2, 3, 4]', output: '10' }],
    realWorldAnalogy: 'Tallying up the total cost of items in your shopping cart.',
    starterCode: { python: 'def sum_array(nums):\n    pass', javascript: 'function sumArray(nums) {\n    // your code here\n}' },
    tests: [{ description: 'Sums elements', check: (code) => code.includes('sum') || code.includes('+') }]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Data Structures',
    difficulty: 'Medium',
    xpReward: 150,
    description: 'Find the index of a target value in a sorted array using binary search.',
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    realWorldAnalogy: 'Looking up a word in a dictionary by repeatedly halving the search space.',
    starterCode: { python: 'def binary_search(nums, target):\n    pass', javascript: 'function binarySearch(nums, target) {\n    // your code here\n}' },
    tests: [{ description: 'Uses binary search', check: (code) => code.includes('mid') || code.includes('// 2') || code.includes('Math.floor') }]
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Medium',
    xpReward: 130,
    description: 'Sort an array of numbers using the bubble sort algorithm.',
    examples: [{ input: 'nums = [5, 2, 9, 1, 5, 6]', output: '[1, 2, 5, 5, 6, 9]' }],
    realWorldAnalogy: 'Lining up people by height, swapping adjacent people if they are out of order.',
    starterCode: { python: 'def bubble_sort(nums):\n    pass', javascript: 'function bubbleSort(nums) {\n    // your code here\n}' },
    tests: [{ description: 'Swaps elements', check: (code) => code.includes('swap') || (code.includes('[') && code.includes('] =')) }]
  },
  {
    id: 'missing-number',
    title: 'Missing Number',
    category: 'Math',
    difficulty: 'Medium',
    xpReward: 140,
    description: 'Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing.',
    examples: [{ input: 'nums = [3,0,1]', output: '2' }],
    realWorldAnalogy: 'Finding which puzzle piece is missing from a complete set.',
    starterCode: { python: 'def missing_number(nums):\n    pass', javascript: 'function missingNumber(nums) {\n    // your code here\n}' },
    tests: [{ description: 'Finds missing', check: (code) => code.includes('sum') || code.includes('^') || code.includes('n *') }]
  }
];

const CATEGORIES = ['All', 'Arrays', 'Strings', 'Math', 'Recursion', 'Sorting', 'Data Structures'];

export function AlgorithmArena({ currentLanguageId = 'python', xp = 0, combo = 0, onXPEarned, onComboChange }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeChallengeId, setActiveChallengeId] = useState(CHALLENGES[0].id);
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null); // { status: 'idle' | 'pass' | 'fail', message: '' }

  const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId) || CHALLENGES[0];
  const filteredChallenges = activeCategory === 'All' 
    ? CHALLENGES 
    : CHALLENGES.filter(c => c.category === activeCategory);

  useEffect(() => {
    // Reset code when challenge or language changes
    const starterCode = activeChallenge.starterCode[currentLanguageId] || '// Language not supported yet';
    setCode(starterCode);
    setResult(null);
  }, [activeChallengeId, currentLanguageId]);

  const handleRunSubmit = () => {
    let passed = true;
    for (const test of activeChallenge.tests) {
      if (!test.check(code)) {
        passed = false;
        break;
      }
    }

    if (passed) {
      setResult({ status: 'pass', message: 'All test cases passed! Spectacular solution.' });
      soundService?.playSuccess?.();
      if (onXPEarned) onXPEarned(activeChallenge.xpReward);
      if (onComboChange) onComboChange(combo + 1);
    } else {
      setResult({ status: 'fail', message: 'Test failed. Did you implement the core logic? Check the hints and try again.' });
      soundService?.playFail?.();
      if (onComboChange) onComboChange(0);
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (diff === 'Medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800 font-sans">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b border-[#E2E8F0] shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">⚔️ Algorithm Arena</h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
            <LanguageLogo languageId={currentLanguageId} size={16} className="w-4 h-4 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-700 capitalize">{currentLanguageId || 'python'}</span>
          </div>
          <div className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full font-semibold text-sm border border-sky-200 shadow-sm">
            XP: {xp} | Combo: {combo}x
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all active:scale-[0.97] hover:-translate-y-0.5 ${
                activeCategory === cat 
                  ? 'bg-[#0284C7] text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        
        {/* LEFT PANEL: Challenge Info & List */}
        <div className="w-full lg:w-[35%] flex flex-col border-r border-[#E2E8F0] bg-white overflow-y-auto">
          {/* Active Challenge Card */}
          <div className="p-6 border-b border-[#E2E8F0]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-900">{activeChallenge.title}</h2>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getDifficultyColor(activeChallenge.difficulty)}`}>
                {activeChallenge.difficulty}
              </span>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              {activeChallenge.description}
            </p>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Real-world Analogy</h3>
                <p className="text-sm text-slate-700 italic">"{activeChallenge.realWorldAnalogy}"</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Example</h3>
                {activeChallenge.examples.map((ex, i) => (
                  <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md font-mono text-sm mb-2 shadow-inner">
                    <div className="text-slate-500">Input: <span className="text-slate-800">{ex.input}</span></div>
                    <div className="text-slate-500">Output: <span className="text-sky-700 font-semibold">{ex.output}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge List */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Available Challenges</h3>
            <div className="space-y-2">
              {filteredChallenges.map(challenge => (
                <button
                  key={challenge.id}
                  onClick={() => setActiveChallengeId(challenge.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.97] hover:-translate-y-0.5 ${
                    activeChallengeId === challenge.id
                      ? 'bg-sky-50 border-sky-300 shadow-sm ring-1 ring-sky-200'
                      : 'bg-white border-[#E2E8F0] hover:border-sky-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">{challenge.title}</span>
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-bold border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between items-center mt-2">
                    <span>{challenge.category}</span>
                    <span className="text-amber-600 font-medium font-mono">+{challenge.xpReward} XP</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Editor & Results */}
        <div className="w-full lg:w-[65%] flex flex-col bg-[#F8FAFC]">
          <div className="flex-1 min-h-[400px] p-4">
            <div className="h-full rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white flex flex-col">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={currentLanguageId}
                onRun={() => {}}
                isRunning={false}
              />
            </div>
          </div>

          {/* Action Bar & Results */}
          <div className="p-4 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Results Area */}
              <div className="flex-1 w-full">
                {result && (
                  <div className={`p-4 rounded-lg border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                    result.status === 'pass' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <span className="text-2xl">{result.status === 'pass' ? '🎉' : '❌'}</span>
                    <div>
                      <h4 className="font-bold">{result.status === 'pass' ? 'Challenge Complete!' : 'Test Failed'}</h4>
                      <p className="text-sm opacity-90">{result.message}</p>
                    </div>
                  </div>
                )}
                {!result && (
                  <div className="text-sm text-slate-500 italic">
                    Ready to test your algorithm. Write your solution and hit Run & Submit.
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRunSubmit}
                className="w-full md:w-auto px-8 py-3 bg-[#0284C7] hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-200 transition-all active:scale-[0.97] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Run & Submit
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
