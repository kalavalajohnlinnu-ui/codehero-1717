import React, { useState } from 'react';
import { CodeEditor } from '../CodeEditor';

export const AlgorithmArena = ({ currentLanguageId, xp, combo, onXPEarned, onComboChange }) => {
  const [code, setCode] = useState('def solve():\n    pass');
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    // Mock simulation
    const passed = Math.random() > 0.5;
    if (passed) {
      setResult('pass');
      onComboChange(combo + 1);
      onXPEarned(100 * (Math.min(Math.floor(combo/2)+1, 5)));
    } else {
      setResult('fail');
      onComboChange(0);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-950 text-slate-100">
      <div className="w-1/3 border-r border-slate-800 p-6 flex flex-col bg-slate-900 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-400">⚔️ Algorithm Arena</h2>
          <span className="bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-700">HARD</span>
        </div>
        
        <h3 className="text-xl font-bold mb-4">Two Sum</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">
          Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        </p>
        
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-400 mb-4">
          <div className="text-white mb-2">Example 1:</div>
          <div>Input: nums = [2,7,11,15], target = 9</div>
          <div>Output: [0,1]</div>
        </div>
      </div>
      
      <div className="w-2/3 flex flex-col p-4 gap-4">
        <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={currentLanguageId}
            onRun={() => {}}
            hideRunButton={true}
          />
        </div>
        
        <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center justify-between">
          <div>
            {result === 'pass' && (
              <div className="text-emerald-400 font-bold text-xl animate-pulse">✓ All test cases passed!</div>
            )}
            {result === 'fail' && (
              <div className="text-rose-400 font-bold text-xl">✗ Test cases failed. Keep trying!</div>
            )}
            {!result && (
              <div className="text-slate-500">Ready to submit.</div>
            )}
          </div>
          
          <button 
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Run & Submit
          </button>
        </div>
      </div>
    </div>
  );
};
