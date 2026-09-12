import React, { useState } from 'react';
import { CodeEditor } from '../CodeEditor';

export const BugDetective = ({ currentLanguageId, onXPEarned }) => {
  const [code, setCode] = useState('def calculate_total(items):\n    total = 0\n    for i in range(len(items)):\n        total = items[i] # BUG!\n    return total');
  const [solved, setSolved] = useState(false);

  const handleRun = () => {
    if (code.includes('total +=') || code.includes('total = total +')) {
      setSolved(true);
      onXPEarned(150);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#1a0f0f] text-slate-100" style={{ cursor: 'crosshair' }}>
      <div className="border-b border-red-900/50 bg-[#2a1111] p-4 flex items-center justify-between">
        <h2 className="text-2xl font-black text-red-500 tracking-widest font-mono">🔍 CASE FILE #001</h2>
        <div className="text-red-400 font-bold">REWARD: 150 XP</div>
      </div>
      
      <div className="flex flex-1 p-6 gap-6">
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-[#2a1111] border border-red-900/50 rounded-xl p-6 shadow-lg shadow-red-900/20">
            <h3 className="text-red-400 font-bold mb-2 uppercase text-sm">Crime Report</h3>
            <p className="text-slate-300">
              The <code>calculate_total</code> function is supposed to sum up all items in a cart, but the store is losing money! It keeps returning only the price of the last item.
            </p>
          </div>
          
          <div className="bg-[#2a1111] border border-red-900/50 rounded-xl p-6">
            <h3 className="text-red-400 font-bold mb-2 uppercase text-sm">Expected vs Reality</h3>
            <div className="font-mono text-sm text-slate-400">
              <div className="mb-2">Input: [10, 20, 30]</div>
              <div className="text-green-500 mb-1">Expected: 60</div>
              <div className="text-red-500">Actual: 30</div>
            </div>
          </div>
          
          {solved && (
            <div className="bg-green-900/30 border border-green-500 rounded-xl p-6 text-center animate-pulse">
              <div className="text-4xl mb-2">🚨</div>
              <h3 className="text-green-400 font-black text-xl mb-1 uppercase">Case Closed</h3>
              <p className="text-green-200 text-sm">Bug squashed successfully.</p>
            </div>
          )}
        </div>
        
        <div className="w-2/3 flex flex-col gap-4">
          <div className="flex-1 bg-black rounded-xl overflow-hidden border-2 border-red-900/30 relative">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={currentLanguageId}
              onRun={() => {}}
              hideRunButton={true}
            />
          </div>
          
          <button 
            onClick={handleRun}
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors text-lg tracking-widest shadow-[0_0_20px_rgba(185,28,28,0.4)]"
          >
            RUN DIAGNOSTICS
          </button>
        </div>
      </div>
    </div>
  );
};
