import React, { useState, useEffect, useRef } from 'react';
import { getLevelProgress, LEVEL_NAMES } from '../../services/gameEngine';

// Floating XP number that rises and fades
function XPFloat({ amount, x, y, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="xp-float" style={{ left: x, top: y, pointerEvents: 'none' }}>
      +{amount} XP
    </div>
  );
}

export function XPBar({ xp, streak, onProfileClick }) {
  const [floats, setFloats] = useState([]);
  const prevXP = useRef(xp);
  const prog = getLevelProgress(xp);

  useEffect(() => {
    if (xp > prevXP.current) {
      const gained = xp - prevXP.current;
      const id = Date.now();
      setFloats(f => [...f, { id, amount: gained, x: Math.random() * 200 + 100, y: 60 }]);
    }
    prevXP.current = xp;
  }, [xp]);

  const removeFloat = (id) => setFloats(f => f.filter(fl => fl.id !== id));

  return (
    <>
      {/* Floating XP numbers */}
      {floats.map(fl => (
        <XPFloat key={fl.id} amount={fl.amount} x={fl.x} y={fl.y} onDone={() => removeFloat(fl.id)} />
      ))}

      {/* XP Bar Strip */}
      <div
        className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer select-none"
        onClick={onProfileClick}
        title="View your profile"
      >
        {/* Level Badge */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          style={{ color: prog.color }}
        >
          <span className="font-game text-xs font-bold tracking-wider">LV.{prog.level}</span>
        </div>

        {/* Bar + label */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold truncate" style={{ color: prog.color, maxWidth: 140 }}>
              {prog.levelName}
            </span>
            {prog.xpNeeded > 0 && (
              <span className="text-xs text-slate-400 shrink-0 ml-1">
                {prog.xpInLevel}/{prog.xpNeeded}
              </span>
            )}
          </div>
          <div className="xp-bar-track h-2.5 w-full" style={{ minWidth: 80 }}>
            <div className="xp-bar-fill h-full" style={{ width: `${prog.progress}%` }} />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-200 text-amber-600 rounded-lg px-2 py-0.5">
          <span className="streak-fire text-base leading-none">🔥</span>
          <span className="font-bold text-sm text-amber-600">{streak}</span>
        </div>
      </div>
    </>
  );
}
