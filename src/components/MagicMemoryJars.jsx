import React from 'react';
import { Sparkles, Package, HelpCircle } from 'lucide-react';

export function MagicMemoryJars({ variables = [] }) {
  if (!variables || variables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 text-2xl">
          🏺
        </div>
        <h4 className="text-xs font-bold text-slate-300 mb-1">
          Your Magic Memory Backpack is Empty!
        </h4>
        <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
          Variables are like labeled jars that store values. When you write something like <code className="text-sky-300 font-mono">score = 100</code> and click Run, a magic jar appears here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <span>🏺</span>
          <span>Magic Memory Jars (Your Variables in Live RAM)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
          {variables.length} Jar{variables.length > 1 ? 's' : ''} Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {variables.map((v, idx) => {
          const type = v.type;
          let theme = {
            border: 'border-sky-500/40',
            bg: 'from-sky-500/10 to-slate-900',
            glow: 'shadow-sky-500/10',
            badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
            icon: '💧',
            typeLabel: 'Number'
          };

          if (type === 'str') {
            theme = {
              border: 'border-emerald-500/40',
              bg: 'from-emerald-500/10 to-slate-900',
              glow: 'shadow-emerald-500/10',
              badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              icon: '📜',
              typeLabel: 'Text (str)'
            };
          } else if (type === 'bool') {
            theme = {
              border: 'border-purple-500/40',
              bg: 'from-purple-500/10 to-slate-900',
              glow: 'shadow-purple-500/10',
              badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
              icon: '🔮',
              typeLabel: 'Truth Switch (bool)'
            };
          } else if (type === 'list' || type === 'tuple') {
            theme = {
              border: 'border-amber-500/40',
              bg: 'from-amber-500/10 to-slate-900',
              glow: 'shadow-amber-500/10',
              badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              icon: '🧰',
              typeLabel: `${type.toUpperCase()} (Collection)`
            };
          } else if (type === 'dict') {
            theme = {
              border: 'border-rose-500/40',
              bg: 'from-rose-500/10 to-slate-900',
              glow: 'shadow-rose-500/10',
              badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
              icon: '🗝️',
              typeLabel: 'Dictionary'
            };
          }

          return (
            <div
              key={idx}
              className={`
                relative rounded-2xl border ${theme.border} bg-gradient-to-b ${theme.bg}
                p-3 shadow-lg ${theme.glow} flex flex-col justify-between transition-all hover:scale-[1.02]
              `}
            >
              {/* Top Jar Lid & Name */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{theme.icon}</span>
                  <span className="font-mono font-bold text-xs text-white tracking-wide">
                    {v.name}
                  </span>
                </div>

                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${theme.badge}`}>
                  {theme.typeLabel}
                </span>
              </div>

              {/* Jar Interior / Value Display */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 my-1 font-mono text-xs text-slate-100 break-all overflow-hidden flex items-center justify-center min-h-[42px]">
                <span className="text-amber-200 font-semibold text-center">
                  {v.value}
                </span>
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800/50">
                <span>Jar #{idx + 1}</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> In RAM
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
