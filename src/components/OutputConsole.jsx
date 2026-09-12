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

  // Automatically switch tab when relevant events occur
  useEffect(() => {
    if (outputResult?.error) {
      setActiveTab('detective');
    } else if (currentLanguageId === 'html' && outputResult?.htmlPreview) {
      setActiveTab('preview');
    } else if (currentLanguageId === 'sql' && outputResult?.sqlResults) {
      setActiveTab('table');
    } else if (testResults && testResults.results && testResults.results.length > 0) {
      setActiveTab('tests');
    } else if (outputResult?.stdout) {
      setActiveTab('terminal');
    }
  }, [outputResult, testResults, currentLanguageId]);

  const errorDetails = outputResult?.error ? translatePythonError(outputResult.error) : null;
  const passedCount = testResults?.results?.filter(r => r.passed).length || 0;
  const totalTests = testResults?.results?.length || 0;
  const hasFailedTest = totalTests > 0 && passedCount < totalTests;

  const isHtml = currentLanguageId === 'html';
  const isSql = currentLanguageId === 'sql';

  return (
    <div className={`
      flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300
      ${isExpanded ? 'h-96 sm:h-[460px]' : 'h-64 sm:h-76'}
    `}>
      {/* Top Tabs Bar */}
      <div className="flex items-center justify-between px-3.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {/* 1. Terminal Console Tab */}
          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('terminal');
            }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap
              ${activeTab === 'terminal' 
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' 
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
            {outputResult?.stdout && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* 2. Live Web Preview Tab (HTML / CSS) */}
          {isHtml && (
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('preview');
              }}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap
                ${activeTab === 'preview' 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Web Preview</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-orange-500/20 text-orange-300 font-bold">
                Live
              </span>
            </button>
          )}

          {/* 3. SQL Table Results Tab */}
          {isSql && (
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('table');
              }}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap
                ${activeTab === 'table' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Table Results</span>
              {outputResult?.sqlResults && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                  {outputResult.sqlResults.rows?.length || 0}
                </span>
              )}
            </button>
          )}

          {/* 4. Test Results Tab */}
          {isTestingMode && (
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('tests');
              }}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap
                ${activeTab === 'tests' 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {totalTests > 0 && passedCount === totalTests ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : hasFailedTest ? (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>Goal Tests</span>
              {totalTests > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                  passedCount === totalTests ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {passedCount}/{totalTests}
                </span>
              )}
            </button>
          )}

          {/* 5. Magic Memory Jars Tab */}
          <button
            onClick={() => {
              soundService.playClick();
              setActiveTab('jars');
            }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap
              ${activeTab === 'jars' 
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <span>🏺</span>
            <span>Memory Jars</span>
            {outputResult?.variables && outputResult.variables.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                {outputResult.variables.length}
              </span>
            )}
          </button>

          {/* 6. Detective Why It Failed Tab */}
          {(outputResult?.error || hasFailedTest) && (
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('detective');
              }}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap animate-bounce
                ${activeTab === 'detective' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                }
              `}
            >
              <span>🕵️</span>
              <span>Why Did It Fail?</span>
            </button>
          )}
        </div>

        {/* Right Tools: Duration, Expand, Clear */}
        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          {outputResult?.durationMs !== undefined && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500 pr-2 border-r border-slate-800">
              <Clock className="w-3 h-3" />
              <span>{outputResult.durationMs}ms</span>
            </div>
          )}

          <button
            onClick={() => {
              soundService.playClick();
              onClearConsole();
            }}
            className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors hidden sm:block"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-4 font-sans text-xs text-slate-200">
        {/* 1. Terminal Console Output */}
        {activeTab === 'terminal' && (
          <div className="h-full space-y-2">
            {outputResult?.stdout ? (
              <pre className="whitespace-pre-wrap leading-relaxed text-emerald-300 font-mono text-xs sm:text-sm bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                {outputResult.stdout}
              </pre>
            ) : outputResult?.error ? (
              <div className="text-rose-300 whitespace-pre-wrap leading-relaxed font-mono bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
                {outputResult.error}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-sans text-xs py-6 text-center">
                <span className="text-2xl mb-1">🪄</span>
                <span>Console is ready! Click "Run & Test" above to run your code.</span>
              </div>
            )}
          </div>
        )}

        {/* 2. Live Web Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-full">
            <LiveWebPreview htmlCode={outputResult?.htmlPreview || ''} />
          </div>
        )}

        {/* 3. SQL Table Results Tab */}
        {activeTab === 'table' && (
          <div className="h-full">
            {outputResult?.sqlResults ? (
              <SqlTableViewer 
                columns={outputResult.sqlResults.columns} 
                rows={outputResult.sqlResults.rows} 
              />
            ) : (
              <div className="text-slate-500 text-center py-6">
                No SQL query executed yet. Run a SELECT query to see database results!
              </div>
            )}
          </div>
        )}

        {/* 4. Test Verification Goals */}
        {activeTab === 'tests' && (
          <div className="space-y-3 font-sans">
            {testResults && testResults.results && testResults.results.length > 0 ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-medium">
                  <span className="text-slate-400">Verification Checklist:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                    testResults.allPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {passedCount} / {totalTests} Passed
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults.results.map((r, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                        r.passed 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {r.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold text-slate-100">{r.description}</div>
                          {!r.passed && (
                            <div className="text-[11px] font-mono text-rose-300 mt-1 bg-slate-950/60 p-1.5 rounded-lg border border-rose-500/20">
                              {r.actual}
                            </div>
                          )}
                        </div>
                      </div>

                      {!r.passed && onOpenDetective && (
                        <button
                          onClick={onOpenDetective}
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg transition-colors"
                        >
                          <span>🕵️ Inspect Clue</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs py-8">
                No tests evaluated yet. Click "Run & Test" to check your solution!
              </div>
            )}
          </div>
        )}

        {/* 5. Magic Memory Jars */}
        {activeTab === 'jars' && (
          <MagicMemoryJars variables={outputResult?.variables || []} />
        )}

        {/* 6. Detective Why It Failed Breakdown */}
        {activeTab === 'detective' && (
          <div className="space-y-3 font-sans">
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                  <span>🕵️</span>
                  <span>Detective {mascotName}'s Analysis: {errorDetails?.title || 'Goal Mismatch'}</span>
                </div>

                {onOpenDetective && (
                  <button
                    onClick={onOpenDetective}
                    className="text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1 rounded-xl transition-colors border border-amber-500/30"
                  >
                    Open Full Case File →
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans mb-3">
                {errorDetails?.explanation || (hasFailedTest && testResults?.results?.find(r => !r.passed)?.description) || 'A test expectation was not met.'}
              </p>

              {errorDetails?.fix && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-line">
                  <span className="text-amber-400 font-bold block mb-1 font-sans">💡 Detective's Fix Step:</span>
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
