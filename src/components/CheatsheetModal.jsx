import React, { useState } from 'react';
import { X, Search, Copy, Check, BookOpen } from 'lucide-react';
import { getCheatsheetForLang } from '../data/cheatsheet';
import { soundService } from '../services/soundService';

export function CheatsheetModal({ 
  isOpen, 
  onClose,
  currentLanguageId = 'python',
  languageName = 'Python'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState(null);

  if (!isOpen) return null;

  const categories = getCheatsheetForLang(currentLanguageId);

  const handleCopy = (text) => {
    soundService.playClick();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const filtered = categories.map(cat => {
    const items = cat.items.filter(item => 
      item.syntax.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (items.length > 0) {
      return { ...cat, items };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{languageName} Quick Reference & Cheatsheet</h3>
              <p className="text-[11px] text-slate-400">Instant syntax lookup and best practices</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/20">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${languageName} keywords, methods, operators...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-5">
          {filtered.length > 0 ? (
            filtered.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {cat.category}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cat.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx}
                      className="group p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-start justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-1">
                        <code className="text-xs font-mono text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded border border-emerald-500/20 block select-all">
                          {item.syntax}
                        </code>
                        <p className="text-[11px] text-slate-400">
                          {item.desc}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopy(item.syntax)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedText === item.syntax ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching syntax patterns found for "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
