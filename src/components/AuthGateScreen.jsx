import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FolderDown, 
  Upload,
  BookOpen,
  Code2,
  Terminal,
  Zap
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';

const AVATARS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & AI Guardian' },
  { id: 'robot', name: 'Cyber Sentinel', desc: 'Systems & Architecture' },
  { id: 'cat', name: 'Byte Fox', desc: 'Fast Logic & Web Apps' },
  { id: 'owl', name: 'Wise Raven', desc: 'Algorithms & Insight' }
];

export function AuthGateScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('dragon');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const existingStudents = authService.getAllStudents().filter(s => !s.isGuest);

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    try {
      const student = authService.registerStudent({ email, name, password, avatar });
      soundService.playFanfare();
      setSuccessMsg(`Welcome to CodeHero Academy, ${student.name}! Loading your workspace...`);
      setTimeout(() => {
        onAuthenticated(student);
      }, 1000);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    try {
      const student = authService.loginStudent({ email, password });
      soundService.playSuccess();
      setSuccessMsg(`Welcome back, ${student.name}! Restoring your progress...`);
      setTimeout(() => {
        onAuthenticated(student);
      }, 1000);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleQuickSwitch = (targetEmail) => {
    try {
      const switched = authService.switchStudent(targetEmail);
      if (switched) {
        soundService.playSuccess();
        onAuthenticated(switched);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        const restoredStudent = authService.importStudentBackup(backupData);
        soundService.playFanfare();
        setSuccessMsg(`Backup successfully restored for ${restoredStudent.name}!`);
        setTimeout(() => {
          onAuthenticated(restoredStudent);
        }, 1200);
      } catch (err) {
        soundService.playFail();
        setError('Failed to restore backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080F] flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-200">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative w-full max-w-xl my-8 bg-[#090C15] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Branding Banner */}
        <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-[#0A0D18] p-6 sm:p-8 border-b border-white/[0.08] text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 p-[1px] mx-auto shadow-xl shadow-sky-500/20 mb-3">
            <div className="w-full h-full bg-[#070A12] rounded-[15px] flex items-center justify-center text-2xl font-black text-sky-400 font-mono">
              CH
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              WELCOME TO CODEHERO 2.0
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              100% FREE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create Your Student Account
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Sign up with your email to start coding. Your completed lessons, code drafts, and certificates are saved permanently under your account.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ✨ Create Account
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔑 Log In
              </button>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              ⚠️ {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Your Email Address (Account identifier & data storage)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Password (Optional PIN or Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password or leave blank"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Choose Your Coding Mascot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVATARS.map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setAvatar(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        avatar === opt.id
                          ? 'bg-sky-500/20 border-sky-500/50 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center p-1 shrink-0">
                        <MascotAvatar mascotType={opt.id} mood="happy" className="w-full h-full" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-200">{opt.name}</div>
                        <div className="text-[10px] text-slate-500">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 text-white font-bold text-xs font-mono hover:opacity-90 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Student Account & Enter Academy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* LOG IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password (if set)"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <span>Log In & Load My Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Existing Saved Profiles on this Browser */}
          {existingStudents.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <div className="text-[11px] font-mono text-slate-400">
                Or choose an existing profile on this computer:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {existingStudents.map(s => (
                  <button
                    key={s.email}
                    type="button"
                    onClick={() => handleQuickSwitch(s.email)}
                    className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] flex items-center gap-2.5 text-left transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center p-1 shrink-0">
                      <MascotAvatar mascotType={s.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{s.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Restore from JSON Backup */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Have a saved backup file?</span>
            </span>

            <label className="cursor-pointer text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 hover:underline">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileRestore} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
