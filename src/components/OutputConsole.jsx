import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  Maximize2, 
  Minimize2,
  Globe,
  Database
} from 'lucide-react';
import { translatePythonError } from '../services/errorTranslator';
import { MagicMemoryJars } from './MagicMemoryJars';
import { LiveWebPreview } from './LiveWebPreview';
import { SqlTableViewer } from './SqlTableViewer';
import { soundService } from '../services/soundService';

export function OutputConsole({
  outputResult,
  testResults,
  onClearConsole,
  onOpenDetective,
  isTestingMode = true,
  isHeroMode = true,
  currentLanguageId = 'python',
  mascotName = 'Pythie'
}) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (outputResult?.error) setActiveTab('detective');
    else if (currentLanguageId === 'html' && outputResult?.htmlPreview) setActiveTab('preview');
    else if (currentLanguageId === 'sql' && outputResult?.sqlResults)   setActiveTab('table');
    else if (testResults?.results?.length > 0) setActiveTab('tests');
    else if (outputResult?.stdout) setActiveTab('terminal');
  }, [outputResult, testResults, currentLanguageId]);

  const errorDetails  = outputResult?.error ? translatePythonError(outputResult.error) : null;
  const passedCount   = testResults?.results?.filter(r => r.passed).length || 0;
  const totalTests    = testResults?.results?.length || 0;
  const hasFailedTest = totalTests > 0 && passedCount < totalTests;
  const isHtml        = currentLanguageId === 'html';
  const isSql         = currentLanguageId === 'sql';

  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: Terminal, condition: true },
    { id: 'preview',  label: 'Web Preview', icon: Globe, condition: isHtml, dot: !!outputResult?.htmlPreview },
    { id: 'table',    label: 'Table Results', icon: Database, condition: isSql },
    { id: 'tests',    label: 'Goal Tests', icon: CheckCircle2, condition: isTestingMode },
    { id: 'jars',     label: 'Variables', icon: null, emoji: '🏺', condition: true },
    { id: 'detective', label: 'Why Failed?', icon: null, emoji: '🕵️', condition: outputResult?.error || hasFailedTest },
  ];

  return (
    <div className={`flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 ${
      isExpanded ? 'h-[460px]' : 'h-64 sm:h-72'
    }`}>

      {/* ── Tab Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-2.5 bg-slate-50 border-b border-slate-200 shrink-0 min-h-[38px]">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {tabs.filter(t => t.condition).map(tab => {
            const Icon     = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => { soundService.playClick(); setActiveTab(tab.id); }}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap shrink-0
                  ${isActive 
                    ? 'bg-white text-sky-700 border border-slate-200 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }
                `}
              >
                {tab.emoji
                  ? <span>{tab.emoji}</span>
                  : Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>

                {/* Badges */}
                {tab.id === 'tests' && totalTests > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    passedCount === totalTests ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {passedCount}/{totalTests}
                  </span>
                )}
                {tab.id === 'jars' && outputResult?.variables?.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800">
                    {outputResult.variables.length}
                  </span>
                )}
                {tab.dot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 text-slate-500">
          {outputResult?.durationMs !== undefined && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono pr-2 border-r border-slate-200">
              <Clock className="w-3 h-3" />
              <span>{outputResult.durationMs}ms</span>
            </div>
          )}
          <button
            onClick={() => { soundService.playClick(); onClearConsole(); }}
            className="p-1.5 rounded-md hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { soundService.playClick(); setIsExpanded(!isExpanded); }}
            className="p-1.5 rounded-md hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors hidden sm:block"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3.5 text-xs bg-white text-slate-800 font-sans">

        {/* 1. Terminal Console */}
        {activeTab === 'terminal' && (
          <div className="h-full">
            {outputResult?.stdout ? (
              <pre className="whitespace-pre-wrap leading-relaxed rounded-xl p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs">
                {outputResult.stdout}
              </pre>
            ) : outputResult?.error ? (
              <pre className="whitespace-pre-wrap leading-relaxed rounded-xl p-3.5 text-xs font-mono bg-rose-50 border border-rose-200 text-rose-800">
                {outputResult.error}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center py-8 text-slate-400 font-mono">
                <span className="text-3xl opacity-30">{'>'}_</span>
                <span className="text-xs">
                  Console is ready. Click "Run & Test" above to execute your code.
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. Web Preview (HTML) */}
        {activeTab === 'preview' && (
          <div className="h-full">
            <LiveWebPreview htmlCode={outputResult?.htmlPreview || ''} />
          </div>
        )}

        {/* 3. SQL Table */}
        {activeTab === 'table' && (
          <div className="h-full">
            {outputResult?.sqlResults ? (
              <SqlTableViewer
                columns={outputResult.sqlResults.columns}
                rows={outputResult.sqlResults.rows}
              />
            ) : (
              <div className="h-full flex items-center justify-center py-8 text-xs font-mono text-slate-400">
                No SQL query executed yet. Run a SELECT query to see table rows.
              </div>
            )}
          </div>
        )}

        {/* 4. Test Verification Goals */}
        {activeTab === 'tests' && (
          <div className="space-y-3">
            {testResults?.results?.length > 0 ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-medium">
                  <span className="text-slate-500 font-mono">Verification Checklist:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                    testResults.allPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {passedCount} / {totalTests} Passed
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults.results.map((r, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                        r.passed 
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        {r.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900">{r.description}</div>
                          {!r.passed && (
                            <div className="mt-1.5 text-[11px] font-mono bg-white p-2 rounded-lg border border-rose-200 text-rose-800">
                              {r.actual}
                            </div>
                          )}
                        </div>
                      </div>

                      {!r.passed && onOpenDetective && (
                        <button
                          onClick={onOpenDetective}
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold font-mono bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg transition-colors"
                        >
                          <span>🕵️ Inspect Clue</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center py-8 text-xs font-mono text-slate-400">
                No tests evaluated yet. Click "Run & Test" to verify your code.
              </div>
            )}
          </div>
        )}

        {/* 5. Memory Jars */}
        {activeTab === 'jars' && (
          <MagicMemoryJars variables={outputResult?.variables || []} />
        )}

        {/* 6. Detective Breakdown */}
        {activeTab === 'detective' && (
          <div className="space-y-3 font-sans">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <span>🕵️</span>
                  <span>Detective {mascotName}'s Diagnosis: {errorDetails?.title || 'Goal Mismatch'}</span>
                </div>

                {onOpenDetective && (
                  <button
                    onClick={onOpenDetective}
                    className="text-xs font-bold font-mono text-amber-900 hover:text-black bg-amber-200/80 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors border border-amber-300"
                  >
                    Open Case File →
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed mb-3">
                {errorDetails?.explanation || 
                  (hasFailedTest && testResults?.results?.find(r => !r.passed)?.description) || 
                  'A test expectation was not met.'}
              </p>

              {errorDetails?.fix && (
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs font-mono text-slate-800 whitespace-pre-line">
                  <span className="text-amber-700 font-bold block mb-1 font-sans">💡 How to Fix:</span>
                  {errorDetails.fix}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
