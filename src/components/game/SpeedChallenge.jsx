import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../CodeEditor';

export const SpeedChallenge = ({ currentLanguageId, onXPEarned }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, playing, won, lost
  const [code, setCode] = useState('def reverse_string(s):\n    pass');

  useEffect(() => {
    if (started && status === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && status === 'playing') {
      setStatus('lost');
    }
  }, [started, status, timeLeft]);

  const handleSubmit = () => {
    if (code.includes('return') && code.includes('[::-1]')) { // dumb check for demo
      setStatus('won');
      onXPEarned(300);
    } else {
      // Just penalize time
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-950 text-slate-100 p-8 items-center">
      <style>{`
        @keyframes urgent-pulse {
          0%, 100% { transform: scale(1); color: #ef4444; }
          50% { transform: scale(1.1); color: #f87171; }
        }
        .timer-urgent {
          animation: urgent-pulse 0.5s infinite;
        }
      `}</style>
      
      {!started || status !== 'playing' ? (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl text-center">
          <div className="text-8xl mb-6">⏱️</div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-4">
            Speed Championship
          </h1>
          
          {status === 'won' && <h2 className="text-3xl text-emerald-400 font-bold mb-4">Challenge Cleared! +300 XP</h2>}
          {status === 'lost' && <h2 className="text-3xl text-red-500 font-bold mb-4">TIME'S UP! 💥</h2>}
          
          <p className="text-slate-400 text-lg mb-8">
            Solve the coding challenge before the timer runs out. Incorrect submissions penalty: -5 seconds.
          </p>
          
          <button 
            onClick={() => {
              setStarted(true);
              setStatus('playing');
              setTimeLeft(60);
              setCode('def reverse_string(s):\n    pass');
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:scale-105 transition-all"
          >
            {status === 'idle' ? 'START CHALLENGE' : 'PLAY AGAIN'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col h-full gap-6">
          <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-sky-400">Reverse a String</h2>
              <p className="text-slate-400">Return the reversed version of string 's'.</p>
            </div>
            <div className={`text-6xl font-mono font-black \${timeLeft <= 10 ? 'timer-urgent' : 'text-white'}`}>
              00:{(timeLeft < 10 ? '0' : '') + timeLeft}
            </div>
          </div>
          
          <div className="flex-1 bg-black rounded-xl overflow-hidden border border-slate-800">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={currentLanguageId}
              onRun={() => {}}
              hideRunButton={true}
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl text-xl transition-colors"
          >
            SUBMIT SOLUTION
          </button>
        </div>
      )}
    </div>
  );
};
