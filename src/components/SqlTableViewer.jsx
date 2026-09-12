import React from 'react';
import { Database, Table } from 'lucide-react';

export function SqlTableViewer({ sqlResults }) {
  if (!sqlResults || !sqlResults.columns || sqlResults.columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Database className="w-8 h-8 text-slate-600 mb-2" />
        <span className="text-xs">Run a SELECT query to see database rows here.</span>
      </div>
    );
  }

  const { columns, rows } = sqlResults;

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-bold text-sky-400">
          <Table className="w-3.5 h-3.5" />
          <span>Query Result Grid</span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          {rows.length} record{rows.length !== 1 ? 's' : ''} returned
        </span>
      </div>

      <div className="border border-slate-800 rounded-xl overflow-x-auto shadow-inner">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-sky-300 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-2.5 px-3 font-bold border-r border-slate-800/60 last:border-none">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-900/50 transition-colors">
                {row.map((val, cIdx) => (
                  <td key={cIdx} className="p-2.5 px-3 text-slate-200 border-r border-slate-800/40 last:border-none">
                    {String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
