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
    { id: 'terminal', label: 'Terminal', icon: Terminal, condition: true,
      active: { bg: 'rgba(0,229,255,0.08)', color: '#00E5FF', border: 'rgba(0,229,255,0.25)' } },
    { id: 'preview', label: 'Web Preview', icon: Globe, condition: isHtml,
      dot: { show: !!outputResult?.htmlPreview, color: '#F59E0B' },
      active: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.25)' } },
    { id: 'table', label: 'Table Results', icon: Database, condition: isSql,
      active: { bg: 'rgba(34,211,166,0.08)', color: '#22D3A6', border: 'rgba(34,211,166,0.25)' } },
    { id: 'tests', label: 'Goal Tests', icon: CheckCircle2, condition: isTestingMode,
      active: {
        bg: passedCount === totalTests && totalTests > 0 ? 'rgba(34,211,166,0.08)' : 'rgba(255,83,112,0.08)',
        color: passedCount === totalTests && totalTests > 0 ? '#22D3A6' : '#FF5370',
        border: passedCount === totalTests && totalTests > 0 ? 'rgba(34,211,166,0.25)' : 'rgba(255,83,112,0.25)'
      }
    },
    { id: 'jars', label: 'Variables', icon: null, condition: true,
      emoji: '🏺',
      active: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' } },
    { id: 'detective', label: 'Why Failed?', icon: null, condition: outputResult?.error || hasFailedTest,
      emoji: '🕵️', isError: true,
      active: { bg: 'rgba(255,83,112,0.1)', color: '#FF5370', border: 'rgba(255,83,112,0.3)' } },
  ];

  return (
    <div className={`flex flex-col overflow-hidden transition-all duration-300`}
      style={{
        background: '#06070D',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        height: isExpanded ? '480px' : '260px',
      }}>

      {/* ── Tab Bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-2 shrink-0"
        style={{
          background: 'rgba(0,0,0,0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          minHeight: '38px',
        }}>
        <div className="flex items-center gap-0.5 overflow-x-auto py-1.5">
          {tabs.filter(t => t.condition).map(tab => {
            const Icon     = tab.icon;
            const isActive = activeTab === tab.id;
            const style    = isActive ? tab.active : {};

            return (
              <button
                key={tab.id}
                onClick={() => { soundService.playClick(); setActiveTab(tab.id); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all whitespace-nowrap shrink-0"
                style={isActive ? {
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  color: style.color,
                } : {
                  color: '#4B5568',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#8892AA';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#4B5568';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}>
                {tab.emoji
                  ? <span>{tab.emoji}</span>
                  : Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                {/* Badges */}
                {tab.id === 'tests' && totalTests > 0 && (
                  <span className="text-[9px] px-1 rounded font-bold"
                    style={passedCount === totalTests
                      ? { background: 'rgba(34,211,166,0.15)', color: '#22D3A6' }
                      : { background: 'rgba(255,83,112,0.15)', color: '#FF5370' }}>
                    {passedCount}/{totalTests}
                  </span>
                )}
                {tab.id === 'jars' && outputResult?.variables?.length > 0 && (
                  <span className="text-[9px] px-1 rounded font-bold"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                    {outputResult.variables.length}
                  </span>
                )}
                {tab.dot?.show && (
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: tab.dot.color }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {outputResult?.durationMs !== undefined && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono pr-2"
              style={{ color: '#2D3552', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <Clock className="w-3 h-3" />
              {outputResult.durationMs}ms
            </div>
          )}
          <button
            onClick={() => { soundService.playClick(); onClearConsole(); }}
            className="p-1.5 rounded-md transition-all"
            style={{ color: '#2D3552' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#6B7A96'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2D3552'; }}
            title="Clear">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { soundService.playClick(); setIsExpanded(!isExpanded); }}
            className="p-1.5 rounded-md transition-all hidden sm:block"
            style={{ color: '#2D3552' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#6B7A96'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2D3552'; }}
            title={isExpanded ? 'Collapse' : 'Expand'}>
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 text-xs"
        style={{ color: '#C8D0E0', fontFamily: "'Inter', sans-serif" }}>

        {/* 1. Terminal */}
        {activeTab === 'terminal' && (
          <div className="h-full">
            {outputResult?.stdout ? (
              <pre className="whitespace-pre-wrap leading-relaxed rounded-xl p-3 text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#22D3A6',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(34,211,166,0.1)',
                }}>
                {outputResult.stdout}
              </pre>
            ) : outputResult?.error ? (
              <pre className="whitespace-pre-wrap leading-relaxed rounded-xl p-3 text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#FF5370',
                  background: 'rgba(255,83,112,0.05)',
                  border: '1px solid rgba(255,83,112,0.15)',
                }}>
                {outputResult.error}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center py-6">
                <span className="text-3xl opacity-20">{'>'}_</span>
                <span className="text-xs font-mono" style={{ color: '#2D3552' }}>
                  Console ready. Click "Run & Test" to execute your code.
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. Web Preview */}
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
              <div className="h-full flex items-center justify-center py-8 text-xs font-mono"
                style={{ color: '#2D3552' }}>
                No SQL query run yet. Execute a SELECT to see results.
              </div>
            )}
          </div>
        )}

        {/* 4. Test Results */}
        {activeTab === 'tests' && (
          <div className="space-y-3">
            {testResults?.results?.length > 0 ? (
              <>
                {/* Summary row */}
                <div className="flex items-center justify-between pb-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-[11px] font-mono" style={{ color: '#4B5568' }}>Verification Checklist</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                    style={testResults.allPassed
                      ? { background: 'rgba(34,211,166,0.1)', color: '#22D3A6' }
                      : { background: 'rgba(255,83,112,0.1)', color: '#FF5370' }}>
                    {passedCount} / {totalTests} Passed
                  </span>
                </div>

                {testResults.results.map((r, idx) => (
                  <div key={idx}
                    className="p-3 rounded-xl flex items-start justify-between gap-3"
                    style={r.passed ? {
                      background: 'rgba(34,211,166,0.04)',
                      border: '1px solid rgba(34,211,166,0.15)',
                    } : {
                      background: 'rgba(255,83,112,0.06)',
                      border: '1px solid rgba(255,83,112,0.2)',
                    }}>
                    <div className="flex items-start gap-2.5 min-w-0">
                      {r.passed
                        ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#22D3A6' }} />
                        : <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#FF5370' }} />}
                      <div className="min-w-0">
                        <div className="font-semibold text-xs" style={{ color: r.passed ? '#C8D0E0' : '#EEF0F8' }}>
                          {r.description}
                        </div>
                        {!r.passed && (
                          <div className="mt-1.5 text-[11px] font-mono rounded-lg px-2 py-1.5"
                            style={{
                              color: '#FF5370',
                              background: 'rgba(0,0,0,0.3)',
                              border: '1px solid rgba(255,83,112,0.15)',
                            }}>
                            {r.actual}
                          </div>
                        )}
                      </div>
                    </div>
                    {!r.passed && onOpenDetective && (
                      <button
                        onClick={onOpenDetective}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all"
                        style={{
                          background: 'rgba(245,158,11,0.1)',
                          border: '1px solid rgba(245,158,11,0.25)',
                          color: '#F59E0B'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}>
                        🕵️ Inspect
                      </button>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="h-full flex items-center justify-center py-8 text-xs font-mono"
                style={{ color: '#2D3552' }}>
                No tests run yet. Click "Run & Test" to check your solution.
              </div>
            )}
          </div>
        )}

        {/* 5. Memory Jars */}
        {activeTab === 'jars' && (
          <MagicMemoryJars variables={outputResult?.variables || []} />
        )}

        {/* 6. Detective */}
        {activeTab === 'detective' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl"
              style={{
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🕵️</span>
                  <span className="text-sm font-bold" style={{ color: '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>
                    {errorDetails?.title || 'Why Your Code Did Not Pass'}
                  </span>
                </div>
                {onOpenDetective && (
                  <button
                    onClick={onOpenDetective}
                    className="text-xs font-bold font-mono px-3 py-1 rounded-lg transition-all"
                    style={{
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      color: '#F59E0B'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}>
                    Full Analysis →
                  </button>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#C8D0E0' }}>
                {errorDetails?.explanation ||
                  (hasFailedTest && testResults?.results?.find(r => !r.passed)?.description) ||
                  'A test expectation was not met.'}
              </p>
              {errorDetails?.fix && (
                <div className="mt-3 p-3 rounded-lg text-xs font-mono leading-relaxed whitespace-pre-line"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#8892AA'
                  }}>
                  <span className="font-bold block mb-1" style={{ color: '#F59E0B', fontFamily: "'Inter', sans-serif" }}>
                    💡 How to Fix:
                  </span>
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
