import React, { useState } from 'react';
import { ExternalLink, RotateCcw, Monitor, Smartphone } from 'lucide-react';

export function LiveWebPreview({ htmlCode }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 16px;
            background-color: #0f172a;
            color: #f8fafc;
          }
        </style>
      </head>
      <body>
        ${htmlCode || '<div style="color: #64748b; text-align: center; margin-top: 40px;">No HTML written yet. Start typing your tags!</div>'}
      </body>
    </html>
  `;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">Live Browser Preview</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1 rounded-lg transition-colors ${deviceMode === 'desktop' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1 rounded-lg transition-colors ${deviceMode === 'mobile' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Iframe Render Container */}
      <div className="flex-1 flex items-center justify-center p-2 bg-slate-950/60 overflow-hidden">
        <iframe
          title="Live HTML Preview"
          srcDoc={fullHtml}
          sandbox="allow-scripts"
          className={`
            h-full border border-slate-800 rounded-xl transition-all duration-300 bg-slate-900
            ${deviceMode === 'mobile' ? 'w-[320px] max-w-full shadow-2xl' : 'w-full'}
          `}
        />
      </div>
    </div>
  );
}
