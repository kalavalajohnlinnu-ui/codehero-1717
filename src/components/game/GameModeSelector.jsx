import React from 'react';
import { getLevelProgress as getLevelInfo } from '../../services/gameEngine';

export const GameModeSelector = ({ currentXP, onSelectMode, onClose }) => {
  const currentLevel = getLevelInfo(currentXP).level;

  const modes = [
    { id: 'lessons', icon: '📚', name: 'Lessons', desc: 'Learn through interactive coding', unlockLevel: 1 },
    { id: 'bugs', icon: '🐛', name: 'Bug Detective', desc: 'Hunt bugs in broken code', unlockLevel: 2 },
    { id: 'arena', icon: '⚔️', name: 'Algorithm Arena', desc: 'Battle 200+ coding challenges', unlockLevel: 3 },
    { id: 'speed', icon: '⏱️', name: 'Speed Championship', desc: 'Race against the clock', unlockLevel: 4 },
    { id: 'projects', icon: '🏗️', name: 'Project Workshop', desc: 'Build real apps step by step', unlockLevel: 5 },
    { id: 'ds', icon: '🧠', name: 'DS Visualizer', desc: 'See data structures come alive', unlockLevel: 6 },
    { id: 'git', icon: '🤝', name: 'Git Galaxy', desc: 'Master version control', unlockLevel: 8 },
    { id: 'system', icon: '🏛️', name: 'System Design', desc: 'Architect at scale', unlockLevel: 10 },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .mode-card:hover {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-5xl max-h-[90vh] flex flex-col relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Select Game Mode
            </h1>
            <p className="text-slate-600 mt-1 text-base">Current Level: <span className="font-bold text-sky-600">{currentLevel}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pb-4 px-1">
          {modes.map(mode => {
            const isUnlocked = currentLevel >= mode.unlockLevel;
            
            return (
              <div 
                key={mode.id}
                onClick={() => isUnlocked && onSelectMode(mode.id)}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col items-center text-center ${
                  isUnlocked 
                    ? 'bg-white border-slate-200 hover:border-sky-500 hover:shadow-lg cursor-pointer mode-card' 
                    : 'bg-slate-50 border-slate-200 opacity-75 grayscale cursor-not-allowed'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-3 right-3 text-slate-400 text-lg">
                    🔒
                  </div>
                )}
                
                <div className={`text-5xl mb-3 ${isUnlocked ? 'filter drop-shadow-sm' : ''}`}>
                  {mode.icon}
                </div>
                
                <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                  {mode.name}
                </h3>
                
                <p className={`text-sm ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                  {mode.desc}
                </p>
                
                {!isUnlocked && (
                  <div className="mt-auto pt-4 w-full">
                    <div className="bg-slate-100 rounded-lg py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Unlocks at Level {mode.unlockLevel}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
