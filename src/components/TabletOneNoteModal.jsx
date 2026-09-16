import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Download, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  X, 
  StickyNote, 
  Tablet, 
  Sparkles, 
  Highlighter, 
  Palette,
  Maximize2
} from 'lucide-react';
import { soundService } from '../services/soundService';

const STICKY_COLORS = [
  { id: 'yellow', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-950', badge: 'bg-amber-200 text-amber-800' },
  { id: 'sky', bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-950', badge: 'bg-sky-200 text-sky-800' },
  { id: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-950', badge: 'bg-emerald-200 text-emerald-800' },
  { id: 'rose', bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-950', badge: 'bg-rose-200 text-rose-800' },
  { id: 'purple', bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-950', badge: 'bg-purple-200 text-purple-800' }
];

const PEN_COLORS = [
  { id: 'black', hex: '#0F172A', label: 'Ink' },
  { id: 'blue', hex: '#0284C7', label: 'Sky' },
  { id: 'emerald', hex: '#059669', label: 'Emerald' },
  { id: 'amber', hex: '#D97706', label: 'Amber' },
  { id: 'crimson', hex: '#DC2626', label: 'Crimson' },
  { id: 'purple', hex: '#7C3AED', label: 'Purple' }
];

export function TabletOneNoteModal({
  isOpen,
  onClose,
  currentLesson,
  currentCode,
  currentLanguageId = 'python'
}) {
  const [activeTab, setActiveTab] = useState('whiteboard'); // 'whiteboard' | 'notes'
  
  // Whiteboard drawing tools state
  const [tool, setTool] = useState('pen'); // 'pen' | 'highlighter' | 'eraser'
  const [penColor, setPenColor] = useState('#0284C7');
  const [lineWidth, setLineWidth] = useState(3);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState(false);

  // Notes state
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('tablet_onenote_notes_v1');
      return saved ? JSON.parse(saved) : [
        {
          id: 'note-1',
          title: 'Welcome to Tablet OneNote!',
          content: 'This is your private, offline tablet study studio! Use the Sketch Slate tab to draw algorithm trees, data structures, and memory boxes with your finger or stylus pen.',
          color: 'yellow',
          codeSnippet: 'print("Hello from Tablet OneNote!")',
          createdAt: new Date().toLocaleDateString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('sky');
  const [includeCodeSnippet, setIncludeCodeSnippet] = useState(false);

  // Canvas drawing ref
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const undoStackRef = useRef([]);

  // Save notes whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('tablet_onenote_notes_v1', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  // Load / Setup canvas on mount or tab change
  useEffect(() => {
    if (!isOpen || activeTab !== 'whiteboard') return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Restore saved drawing if present
      const savedDrawing = localStorage.getItem('tablet_onenote_canvas_data_v1');
      if (savedDrawing) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = savedDrawing;
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Drawing Handlers (Supports Mouse & Touch Pointer Events on Android Tablets)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Save state for undo
    undoStackRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStackRef.current.length > 10) undoStackRef.current.shift();

    isDrawingRef.current = true;
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = lineWidth * 5;
      ctx.globalAlpha = 1.0;
      ctx.lineCap = 'round';
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth * 4;
      ctx.globalAlpha = 0.35;
      ctx.lineCap = 'square';
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 1.0;
      ctx.lineCap = 'round';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        localStorage.setItem('tablet_onenote_canvas_data_v1', canvas.toDataURL());
      } catch {}
    }
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    const previousState = undoStackRef.current.pop();
    ctx.putImageData(previousState, 0, 0);
    try {
      localStorage.setItem('tablet_onenote_canvas_data_v1', canvas.toDataURL());
    } catch {}
    soundService.playClick();
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    try {
      localStorage.removeItem('tablet_onenote_canvas_data_v1');
    } catch {}
    soundService.playClick();
  };

  const handleDownloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundService.playSuccess();
    const link = document.createElement('a');
    link.download = `OneNote_Tablet_Slate_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() && !newNoteContent.trim()) return;
    soundService.playSuccess();

    const note = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim() || `${currentLesson?.title || 'Coding Note'}`,
      content: newNoteContent.trim(),
      color: selectedColor,
      codeSnippet: includeCodeSnippet ? currentCode : null,
      createdAt: new Date().toLocaleDateString()
    };

    setNotes([note, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIncludeCodeSnippet(false);
  };

  const handleDeleteNote = (noteId) => {
    soundService.playClick();
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleCopySnippet = (snippet) => {
    soundService.playClick();
    navigator.clipboard.writeText(snippet);
    setCopiedCodeNotice(true);
    setTimeout(() => setCopiedCodeNotice(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl h-[94vh] bg-white border-2 border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-cinematic-page text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Tablet Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs">
              <Tablet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-extrabold tracking-wider uppercase">
                  📱 TABLET EXCLUSIVE ONE-NOTE
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                  ⚡ 100% Offline Slate
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                Stylus & Touch Study Studio
              </h2>
            </div>
          </div>

          {/* Tab Switcher & Close */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => { soundService.playClick(); setActiveTab('whiteboard'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'whiteboard'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Sketch Slate</span>
              </button>

              <button
                onClick={() => { soundService.playClick(); setActiveTab('notes'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <StickyNote className="w-3.5 h-3.5" />
                <span>Sticky Notes ({notes.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all border border-slate-200 cursor-pointer"
              title="Close OneNote"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── TAB 1: SKETCH SLATE (CANVAS) ─────────────────────────── */}
        {activeTab === 'whiteboard' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-100/50">
            {/* Whiteboard Floating Toolbar */}
            <div className="p-2 sm:p-3 bg-white border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
              
              {/* Tool Selection */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { soundService.playClick(); setTool('pen'); }}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                    tool === 'pen'
                      ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  title="Ballpoint Pen / Stylus"
                >
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Pen</span>
                </button>

                <button
                  onClick={() => { soundService.playClick(); setTool('highlighter'); }}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                    tool === 'highlighter'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  title="Marker / Highlighter"
                >
                  <Highlighter className="w-4 h-4" />
                  <span className="hidden sm:inline">Highlighter</span>
                </button>

                <button
                  onClick={() => { soundService.playClick(); setTool('eraser'); }}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                    tool === 'eraser'
                      ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  title="Rubber Eraser"
                >
                  <Eraser className="w-4 h-4" />
                  <span className="hidden sm:inline">Eraser</span>
                </button>
              </div>

              {/* Color Palette (Visible when not erasing) */}
              {tool !== 'eraser' && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-xl border border-slate-200">
                  {PEN_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { soundService.playClick(); setPenColor(c.hex); }}
                      className={`w-6 h-6 rounded-full transition-all border-2 ${
                        penColor === c.hex ? 'scale-125 border-slate-900 shadow-xs' : 'border-white'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              )}

              {/* Stroke Size */}
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 font-bold">THICKNESS</span>
                <input 
                  type="range" 
                  min="2" 
                  max="12" 
                  value={lineWidth} 
                  onChange={e => setLineWidth(Number(e.target.value))}
                  className="w-16 sm:w-24 accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Actions: Undo, Clear, Save Image */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                  title="Undo last stroke"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline">Undo</span>
                </button>

                <button
                  onClick={handleClearCanvas}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 active:scale-95 cursor-pointer"
                  title="Clear entire whiteboard"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden md:inline">Clear</span>
                </button>

                <button
                  onClick={handleDownloadDrawing}
                  className="p-2 sm:px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-xs cursor-pointer"
                  title="Save drawing as PNG to your tablet"
                >
                  <Download className="w-4 h-4" />
                  <span>Save PNG</span>
                </button>
              </div>
            </div>

            {/* Drawing Canvas Area (Touch / Stylus Optimized) */}
            <div className="flex-1 relative overflow-hidden bg-white touch-none">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-full cursor-crosshair touch-none"
              />
              
              {/* Overlay Prompt */}
              <div className="absolute bottom-3 left-3 pointer-events-none bg-black/60 text-white text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded-full backdrop-blur-xs">
                ✍️ Use Finger or Stylus Pen to draw logic diagrams &amp; data structures
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: STICKY NOTES STUDIO ──────────────────────────── */}
        {activeTab === 'notes' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
            {/* Left: Create Note Form */}
            <div className="w-full md:w-80 lg:w-96 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Add Study Sticky Note
                </h3>
              </div>

              <form onSubmit={handleAddNote} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">Note Title</label>
                  <input
                    type="text"
                    placeholder={`e.g. ${currentLesson?.title || 'Loop Concept'}`}
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600">Study Thought / Trick</label>
                  <textarea
                    rows={4}
                    placeholder="Write what you learned in your own simple words..."
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 font-sans leading-relaxed"
                  />
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600">Card Color</label>
                  <div className="flex items-center gap-2 mt-1.5">
                    {STICKY_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c.id)}
                        className={`w-7 h-7 rounded-xl border-2 transition-all ${c.bg} ${
                          selectedColor === c.id ? 'scale-110 border-slate-900 shadow-xs' : 'border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Attach Current Code */}
                {currentCode && (
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <input 
                      type="checkbox" 
                      checked={includeCodeSnippet} 
                      onChange={e => setIncludeCodeSnippet(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-0"
                    />
                    <span>Attach current editor code snippet</span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pin Note to Slate</span>
                </button>
              </form>
            </div>

            {/* Right: Notes Grid */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Your Pinned Notes ({notes.length})
                </span>
                {copiedCodeNotice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 animate-pulse">
                    ✓ Code snippet copied to clipboard!
                  </span>
                )}
              </div>

              {notes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <StickyNote className="w-8 h-8 opacity-40" />
                  <p className="text-xs font-medium">No notes pinned yet. Add your first note on the left!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map(note => {
                    const theme = STICKY_COLORS.find(c => c.id === note.color) || STICKY_COLORS[0];
                    return (
                      <div 
                        key={note.id}
                        className={`p-4 rounded-2xl border-2 shadow-xs flex flex-col justify-between space-y-3 relative group ${theme.bg} ${theme.border} ${theme.text}`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-extrabold leading-tight">
                              {note.title}
                            </h4>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="opacity-60 hover:opacity-100 text-slate-500 hover:text-rose-600 p-1 rounded-lg transition-all cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs leading-relaxed whitespace-pre-line font-medium opacity-90">
                            {note.content}
                          </p>

                          {note.codeSnippet && (
                            <div className="mt-3 rounded-xl bg-slate-900 text-slate-100 p-2.5 text-[11px] font-mono relative overflow-x-auto shadow-inner">
                              <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[9px] text-slate-400">
                                <span>SNIPPET</span>
                                <button
                                  onClick={() => handleCopySnippet(note.codeSnippet)}
                                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Copy</span>
                                </button>
                              </div>
                              <pre className="overflow-x-auto">{note.codeSnippet}</pre>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] font-mono opacity-60 pt-2 border-t border-black/10 flex justify-between items-center">
                          <span>{note.createdAt}</span>
                          <span>Offline Synced ✓</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
