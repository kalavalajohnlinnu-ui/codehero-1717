import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Flame, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpDown, 
  Mail, 
  Calendar, 
  Code2, 
  Layers, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Trash2,
  BookOpen,
  UserCheck,
  Upload,
  Database
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';
import { LanguageLogo } from './LanguageLogo';
import { getLevelProgress } from '../services/gameEngine';

const LANGUAGE_META = {
  python:     { name: 'Python',     icon: '🐍', color: '#0284C7', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  javascript: { name: 'JavaScript', icon: '⚡', color: '#EAB308', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  html:       { name: 'HTML & CSS', icon: '🎨', color: '#EA580C', bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  sql:        { name: 'SQL DB',     icon: '🗄️', color: '#9333EA', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  c:          { name: 'C & C++',    icon: '⚙️', color: '#2563EB', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  java:       { name: 'Java',       icon: '☕', color: '#DC2626', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  rust:       { name: 'Rust',       icon: '🦀', color: '#B45309', bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-300' },
};


function getActivityBadge(lastVisitDate) {
  if (!lastVisitDate) return { label: 'Inactive', color: 'text-slate-400 bg-slate-100 border-slate-200', dot: 'bg-slate-400' };
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastVisitDate === today) {
    return { label: 'Active Today', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500 animate-pulse' };
  }
  if (lastVisitDate === yesterday) {
    return { label: 'Active Yesterday', color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
  }
  return { label: lastVisitDate, color: 'text-slate-600 bg-slate-50 border-slate-200', dot: 'bg-slate-300' };
}

export function AdminPortalModal({ isOpen, onClose }) {
  const currentStudent = authService.getCurrentStudent();
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'languages' | 'admins'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('all');
  const [selectedDepthFilter, setSelectedDepthFilter] = useState('all'); // 'all' | '1' | '2' | '3+'
  const [activityFilter, setActivityFilter] = useState('all'); // 'all' | 'today' | 'week' | 'inactive'
  const [sortBy, setSortBy] = useState('xp'); // 'xp' | 'lessons' | 'languages' | 'recent'
  const [selectedStudentDossier, setSelectedStudentDossier] = useState(null);
  
  const [adminEmailsList, setAdminEmailsList] = useState(() => authService.getAdminEmails());
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Load live students list
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const students = useMemo(() => {
    return authService.getAllStudentsWithProgress();
  }, [refreshTrigger]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  const handleSeedDemo = () => {
    authService.seedDemoStudents();
    soundService.playFanfare();
    setRefreshTrigger(prev => prev + 1);
    showToast('Seeded realistic multi-language student profiles (1, 2, 4 languages).');
  };

  const handleExportCSV = () => {
    soundService.playSuccess();
    const csvContent = authService.exportAllStudentsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CodeHero_Class_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 200);
    showToast('Class roster exported as CSV.');
  };

  const handleExportFullJSON = () => {
    soundService.playClick();
    const students = authService.getAllStudentsWithProgress();
    const fullData = {
      app: 'CodeHero Academy 2.0',
      exportedAt: new Date().toISOString(),
      admin: currentStudent.email,
      totalStudents: students.length,
      students: students
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CodeHero_Master_Database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 200);
    showToast('Master student database exported as JSON.');
  };

  const handleImportDatabase = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.students)) {
          authService.saveAllStudents(data.students);
          soundService.playSuccess();
          showToast(`Successfully restored ${data.students.length} students into database!`);
          setRefreshTrigger(prev => prev + 1);
        } else {
          showToast('Invalid database backup format.');
        }
      } catch (err) {
        showToast('Failed to parse database file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrintPDF = () => {
    soundService.playClick();
    window.print();
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      showToast('Please enter a valid admin email.');
      return;
    }
    const ok = authService.addAdminEmail(newAdminEmail);
    if (ok) {
      setAdminEmailsList(authService.getAdminEmails());
      setNewAdminEmail('');
      soundService.playSuccess();
      showToast(`Added ${newAdminEmail} as authorized administrator.`);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleRemoveAdmin = (email) => {
    const ok = authService.removeAdminEmail(email);
    if (ok) {
      setAdminEmailsList(authService.getAdminEmails());
      soundService.playClick();
      showToast(`Removed ${email} from admin list.`);
      setRefreshTrigger(prev => prev + 1);
    } else {
      showToast('System default administrator emails cannot be deleted.');
    }
  };

  // Platform Aggregates
  const totalStudentsCount = students.length;
  const multiLangLearners = students.filter(s => s.languageCount >= 2).length;
  const totalLessonsMastered = students.reduce((sum, s) => sum + s.totalLessonsCompleted, 0);
  const totalPlatformXP = students.reduce((sum, s) => sum + s.totalXP, 0);
  const activeTodayCount = students.filter(s => s.lastVisit === new Date().toISOString().split('T')[0]).length;

  // Language Breakdown Aggregation
  const languageEnrollmentMap = {
    python: { count: 0, lessons: 0 },
    javascript: { count: 0, lessons: 0 },
    html: { count: 0, lessons: 0 },
    sql: { count: 0, lessons: 0 },
    c: { count: 0, lessons: 0 },
    java: { count: 0, lessons: 0 },
    rust: { count: 0, lessons: 0 },
  };

  students.forEach(s => {
    s.languageStats?.forEach(ls => {
      if (ls.hasStarted) {
        if (languageEnrollmentMap[ls.id]) {
          languageEnrollmentMap[ls.id].count += 1;
          languageEnrollmentMap[ls.id].lessons += ls.completedCount;
        }
      }
    });
  });

  // Filter and Sort Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Search
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(t);
        const matchesEmail = s.email.toLowerCase().includes(t);
        if (!matchesName && !matchesEmail) return false;
      }

      // Language filter
      if (selectedLanguageFilter !== 'all') {
        const hasLang = s.activeLanguages.some(l => l.id === selectedLanguageFilter);
        if (!hasLang) return false;
      }

      // Depth filter
      if (selectedDepthFilter === '1') {
        if (s.languageCount !== 1) return false;
      } else if (selectedDepthFilter === '2') {
        if (s.languageCount !== 2) return false;
      } else if (selectedDepthFilter === '3+') {
        if (s.languageCount < 3) return false;
      }

      // Web Activity filter
      if (activityFilter !== 'all') {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        if (activityFilter === 'today' && s.lastVisit !== today) return false;
        if (activityFilter === 'week' && (!s.lastVisit || s.lastVisit < weekAgo)) return false;
        if (activityFilter === 'inactive' && s.lastVisit && s.lastVisit >= weekAgo) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'xp') return b.totalXP - a.totalXP;
      if (sortBy === 'lessons') return b.totalLessonsCompleted - a.totalLessonsCompleted;
      if (sortBy === 'languages') return b.languageCount - a.languageCount;
      if (sortBy === 'recent') return (b.lastVisit || '').localeCompare(a.lastVisit || '');
      return 0;
    });
  }, [students, searchTerm, selectedLanguageFilter, selectedDepthFilter, activityFilter, sortBy]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none print:rounded-none animate-cinematic-page"
        style={{ height: '94vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Top Header Strip (Light Studio) ─────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-slate-200 bg-slate-50/90 print:bg-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold tracking-wider">
                  👑 INSTRUCTOR ADMIN PORTAL
                </span>
                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  Multi-Language Progress &amp; Student Analytics
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Classroom Mastery Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {/* Seed demo students button */}
            <button
              type="button"
              onClick={handleSeedDemo}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              title="Add 6 realistic demo students with 1, 2, 4 languages"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Seed Demo Class</span>
            </button>

            {/* Export CSV button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              title="Download entire class roster as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            {/* Backup Full DB JSON button */}
            <button
              type="button"
              onClick={handleExportFullJSON}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              title="Download complete multi-language master student database as JSON"
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Backup DB (.json)</span>
            </button>

            {/* Restore DB button */}
            <label
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              title="Restore / Import student database from JSON"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline">Restore DB</span>
              <input type="file" accept=".json" onChange={handleImportDatabase} className="hidden" />
            </label>

            {/* Print / Save PDF button */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              title="Print or Save class progress report as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Print / PDF</span>
            </button>

            {/* Close modal button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95 ml-1"
              title="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackNotice && (
          <div className="bg-sky-50 border-b border-sky-200 px-5 py-2 text-xs font-mono text-sky-800 flex items-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* ── Top Metrics Banner ──────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50/60 border-b border-slate-200 shrink-0">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Total Students</div>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{totalStudentsCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Enrolled Accounts</div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Active Today</div>
            <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">{activeTodayCount}</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Logged in today</div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Multi-Language</div>
            <div className="text-xl font-black text-sky-600 font-mono mt-0.5">{multiLangLearners}</div>
            <div className="text-[10px] text-sky-700 mt-0.5">Studying 2+ languages</div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Mastered Quests</div>
            <div className="text-xl font-black text-purple-600 font-mono mt-0.5">{totalLessonsMastered}</div>
            <div className="text-[10px] text-purple-700 mt-0.5">Across 7 languages</div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Total XP Earned</div>
            <div className="text-xl font-black text-amber-600 font-mono mt-0.5">{totalPlatformXP.toLocaleString()}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">Platform-wide XP</div>
          </div>
        </div>

        {/* ── Navigation Tabs ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-slate-200 bg-white shrink-0">
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              👥 All Students ({totalStudentsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('languages')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'languages'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🌐 Multi-Language Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admins')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              🛡️ Admin Access ({adminEmailsList.length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden md:block">
            Logged in: <span className="font-bold text-slate-800">{currentStudent?.email}</span>
          </div>
        </div>

        {/* ── Tab 1: STUDENTS LIST & PROGRESS ──────────────────── */}
        {activeTab === 'students' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Bar */}
            <div className="p-3 sm:px-5 sm:py-3 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Language filter */}
                <select
                  value={selectedLanguageFilter}
                  onChange={e => setSelectedLanguageFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 cursor-pointer focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Languages</option>
                  <option value="python">🐍 Python</option>
                  <option value="javascript">⚡ JavaScript</option>
                  <option value="html">🎨 HTML & CSS</option>
                  <option value="sql">🗄️ SQL</option>
                  <option value="c">⚙️ C & C++</option>
                  <option value="java">☕ Java</option>
                  <option value="rust">🦀 Rust</option>
                </select>

                {/* Depth Filter */}
                <select
                  value={selectedDepthFilter}
                  onChange={e => setSelectedDepthFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 cursor-pointer focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Enrollment Depths</option>
                  <option value="1">1 Language Only</option>
                  <option value="2">2 Languages (Dual)</option>
                  <option value="3+">3 or 4+ Languages (Polyglot)</option>
                </select>

                {/* Web Activity Filter */}
                <select
                  value={activityFilter}
                  onChange={e => setActivityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 cursor-pointer focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Web Activity</option>
                  <option value="today">🟢 Active Today</option>
                  <option value="week">🟡 Active This Week</option>
                  <option value="inactive">⚪ Inactive / Idle</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 cursor-pointer focus:outline-none focus:border-sky-500"
                >
                  <option value="xp">Sort by Total XP</option>
                  <option value="lessons">Sort by Quests Done</option>
                  <option value="languages">Sort by Most Languages</option>
                  <option value="recent">Sort by Most Recent</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase tracking-wider text-slate-500 sticky top-0 z-10">
                    <th className="py-3 px-4 font-semibold">Student (Email Vault)</th>
                    <th className="py-3 px-4 font-semibold">Languages &amp; Quests</th>
                    <th className="py-3 px-3 font-semibold text-center">Student Level</th>
                    <th className="py-3 px-3 font-semibold text-center">Total XP</th>
                    <th className="py-3 px-3 font-semibold text-center">Web Activity</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-mono">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No students found matching your filters. Click <strong>"Seed Demo Class"</strong> to load students.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => {
                      const prog = getLevelProgress(student.totalXP);
                      const act = getActivityBadge(student.lastVisit);
                      return (
                      <tr 
                        key={student.email}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                        onClick={() => setSelectedStudentDossier(student)}
                      >
                        {/* Student Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-1 shrink-0 shadow-2xs">
                              <MascotAvatar mascotType={student.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                                <span>{student.name}</span>
                                {student.isAdmin && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold border border-amber-200">
                                    👑 ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                                <span>{student.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Multi-Language Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {student.languageCount} {student.languageCount === 1 ? 'Language' : 'Languages'}
                              </span>
                              {student.languageCount >= 3 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[9px] font-bold">
                                  🌟 Polyglot
                                </span>
                              )}
                            </div>

                            {/* Badges for each language with lesson count */}
                            <div className="flex flex-wrap gap-1">
                              {student.activeLanguages.length === 0 ? (
                                <span className="text-slate-400 text-[11px]">Just registered (0 quests)</span>
                              ) : (
                                student.activeLanguages.map(l => {
                                  const meta = LANGUAGE_META[l.id] || { name: l.id, icon: '💻', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' };
                                  return (
                                    <span 
                                      key={l.id} 
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${meta.bg} ${meta.text} ${meta.border}`}
                                    >
                                      <LanguageLogo languageId={l.id} size={14} className="w-3.5 h-3.5 shrink-0" />
                                      <span>{meta.name}:</span>
                                      <span className="font-black">{l.completedCount}</span>
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Student Level */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold text-xs text-slate-900 px-2.5 py-0.5 rounded-lg bg-sky-50 border border-sky-200">
                              Lvl {prog.level}: {prog.levelName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                              {student.totalLessonsCompleted} quests • {prog.progress}% to next
                            </span>
                          </div>
                        </td>

                        {/* Total XP */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                            {student.totalXP.toLocaleString()} XP
                          </span>
                        </td>

                        {/* Web Activity & Streak */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${act.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${act.dot}`} />
                              <span>{act.label}</span>
                            </span>
                            <span className="text-[11px] font-bold text-orange-600">
                              🔥 {student.streak}d streak
                            </span>
                          </div>
                        </td>

                        {/* Inspect action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentDossier(student);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 border border-slate-200 text-[11px] font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                          >
                            Inspect Dossier →
                          </button>
                        </td>
                      </tr>
                    );})
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 2: MULTI-LANGUAGE ANALYTICS ──────────────────── */}
        {activeTab === 'languages' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-Language Platform Coverage</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students can study any 1, 2, 4, or all 7 languages simultaneously. Progress in each language is isolated and permanently saved.
              </p>
            </div>

            {/* Language Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(LANGUAGE_META).map(([id, meta]) => {
                const stats = languageEnrollmentMap[id] || { count: 0, lessons: 0 };
                const pctOfStudents = totalStudentsCount > 0 ? Math.round((stats.count / totalStudentsCount) * 100) : 0;
                return (
                  <div key={id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                          <LanguageLogo languageId={id} size={22} className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{meta.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Core Language</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg border text-xs font-bold font-mono ${meta.bg} ${meta.text} ${meta.border}`}>
                        {stats.count} Students
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                        <span>Enrollment Rate</span>
                        <span className="font-bold">{pctOfStudents}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pctOfStudents}%`, backgroundColor: meta.color }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Total Quests Completed:</span>
                      <span className="font-bold text-slate-900">{stats.lessons}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Language Depth Distribution (1 vs 2 vs 4+ languages) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Student Language Depth Breakdown</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">1 Language Only</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    {students.filter(s => s.languageCount === 1).length}
                  </div>
                  <div className="text-[10px] text-slate-400">Single focus</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">2 Languages</div>
                  <div className="text-xl font-bold font-mono text-sky-600 mt-1">
                    {students.filter(s => s.languageCount === 2).length}
                  </div>
                  <div className="text-[10px] text-sky-700">Dual-stack learners</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">3 to 4+ Languages</div>
                  <div className="text-xl font-bold font-mono text-purple-600 mt-1">
                    {students.filter(s => s.languageCount >= 3).length}
                  </div>
                  <div className="text-[10px] text-purple-700">Full Polyglots</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: ADMIN PERMISSIONS MANAGEMENT ──────────────── */}
        {activeTab === 'admins' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Administrator Access &amp; Privileges</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Any account matching these authorized email addresses will automatically unlock the Instructor Admin Portal upon sign-in.
              </p>
            </div>

            {/* Add New Admin Form */}
            <form onSubmit={handleAddAdmin} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-w-lg">
              <label className="block text-xs font-mono font-bold text-slate-700">
                Grant Admin Access by Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="instructor@example.com"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-mono font-bold transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Authorize Admin</span>
                </button>
              </div>
            </form>

            {/* List of Active Admins */}
            <div className="space-y-2 max-w-lg">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                Authorized Admin Emails ({adminEmailsList.length})
              </div>
              {adminEmailsList.map(admEmail => {
                const isSystem = ['kalavalajohnlinnu@gmail.com', 'admin@codehero.io', 'admin@codehero.academy'].includes(admEmail.toLowerCase());
                return (
                  <div 
                    key={admEmail}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">👑</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-mono">{admEmail}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {isSystem ? 'System Owner / Default Admin' : 'Custom Authorized Instructor'}
                        </div>
                      </div>
                    </div>

                    {!isSystem && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAdmin(admEmail)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Revoke Admin Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Student Dossier Drawer / Drill-down Modal ───────── */}
        {selectedStudentDossier && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setSelectedStudentDossier(null)}
          >
            <div 
              className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Dossier Header */}
              <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-2xs">
                    <MascotAvatar mascotType={selectedStudentDossier.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                        STUDENT DOSSIER
                      </span>
                      {selectedStudentDossier.isAdmin && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                          👑 ADMIN
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedStudentDossier.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{selectedStudentDossier.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentDossier(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Content */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono flex-1">
                {/* Level & Web Activity Banner */}
                {(() => {
                  const prog = getLevelProgress(selectedStudentDossier.totalXP);
                  const act = getActivityBadge(selectedStudentDossier.lastVisit);
                  return (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/40 border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-bold text-xs">
                            Level {prog.level}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {prog.levelName}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${act.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${act.dot}`} />
                          <span>{act.label}</span>
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-semibold">
                          <span>Next Rank: {prog.nextLevelName}</span>
                          <span>{prog.progress}% ({prog.xpInLevel}/{prog.xpNeeded} XP)</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 border border-slate-200 overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${prog.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Total XP</div>
                    <div className="text-sm font-bold text-amber-600 mt-0.5">{selectedStudentDossier.totalXP}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Streak</div>
                    <div className="text-sm font-bold text-orange-600 mt-0.5">🔥 {selectedStudentDossier.streak}d</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Languages</div>
                    <div className="text-sm font-bold text-sky-600 mt-0.5">{selectedStudentDossier.languageCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Quests Done</div>
                    <div className="text-sm font-bold text-purple-600 mt-0.5">{selectedStudentDossier.totalLessonsCompleted}</div>
                  </div>
                </div>

                {/* Multi-Language Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-900 uppercase font-sans">
                    Multi-Language Mastery Breakdown
                  </div>
                  <div className="space-y-2">
                    {selectedStudentDossier.languageStats?.map(l => {
                      const meta = LANGUAGE_META[l.id] || { name: l.id, icon: '💻', color: '#0284C7' };
                      return (
                        <div key={l.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <LanguageLogo languageId={l.id} size={18} className="w-4.5 h-4.5 shrink-0" />
                            <span className="font-bold text-slate-800">{meta.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${l.completedCount > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {l.completedCount} lessons completed
                            </span>
                            {l.completedCount > 0 && (
                              <span className="text-emerald-600">✓</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Profile Meta */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-600">
                  <div><strong>Student ID:</strong> {selectedStudentDossier.id}</div>
                  <div><strong>Joined Date:</strong> {selectedStudentDossier.joinedDate}</div>
                  <div><strong>Last Active:</strong> {selectedStudentDossier.lastVisit}</div>
                  <div><strong>Auth Method:</strong> {selectedStudentDossier.authProvider === 'google' ? 'Google OAuth' : 'Email & Password'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
