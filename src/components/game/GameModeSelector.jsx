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
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950 overflow-hidden">
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .mode-card:hover {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Animated Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black"></div>
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="star"
            style={{
              left: `\${Math.random() * 100}%`,
              top: `\${Math.random() * 100}%`,
              width: `\${Math.random() * 3 + 1}px`,
              height: `\${Math.random() * 3 + 1}px`,
              animationDuration: `\${Math.random() * 3 + 2}s`,
              animationDelay: `\${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 md:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 tracking-tight">
              Select Game Mode
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Current Level: {currentLevel}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pb-10">
          {modes.map(mode => {
            const isUnlocked = currentLevel >= mode.unlockLevel;
            
            return (
              <div 
                key={mode.id}
                onClick={() => isUnlocked && onSelectMode(mode.id)}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col items-center text-center \${
                  isUnlocked 
                    ? 'bg-slate-900/80 border-slate-700 hover:border-sky-500 hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] cursor-pointer mode-card backdrop-blur-sm' 
                    : 'bg-slate-900/40 border-slate-800 opacity-75 grayscale cursor-not-allowed'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 text-slate-500 text-xl">
                    🔒
                  </div>
                )}
                
                <div className={`text-6xl mb-4 \${isUnlocked ? 'filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}>
                  {mode.icon}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 \${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                  {mode.name}
                </h3>
                
                <p className={`text-sm \${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                  {mode.desc}
                </p>
                
                {!isUnlocked && (
                  <div className="mt-auto pt-4 w-full">
                    <div className="bg-slate-800 rounded-lg py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
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
