import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  X, 
  Sparkles, 
  LogOut, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Flame,
  Award
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';

const AVATAR_OPTIONS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & Logic Guardian' },
  { id: 'robot', name: 'Cyber Sentinel', desc: 'System & Architecture' },
  { id: 'cat', name: 'Byte Fox', desc: 'Agile & Fast Thinker' },
  { id: 'owl', name: 'Wise Raven', desc: 'Algorithms & Insight' }
];

export function StudentAuthModal({ 
  isOpen, 
  onClose, 
  onStudentChanged,
  totalXP = 0,
  streak = 1,
  completedCount = 0
}) {
  const currentStudent = authService.getCurrentStudent();
  const allStudents = authService.getAllStudents();

  const [tab, setTab] = useState(currentStudent?.isGuest ? 'signup' : 'profile'); // 'profile' | 'login' | 'signup' | 'switch'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('dragon');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newStudent = authService.registerStudent({ email, name, password, avatar });
      soundService.playFanfare();
      setSuccessMsg(`Welcome, ${newStudent.name}! Your student account is active.`);
      setTimeout(() => {
        setSuccessMsg(null);
        if (onStudentChanged) onStudentChanged(newStudent);
        setTab('profile');
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
      const loggedStudent = authService.loginStudent({ email, password });
      soundService.playSuccess();
      setSuccessMsg(`Welcome back, ${loggedStudent.name}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        if (onStudentChanged) onStudentChanged(loggedStudent);
        setTab('profile');
      }, 1000);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleSwitch = (targetEmail) => {
    try {
      const switched = authService.switchStudent(targetEmail);
      if (switched) {
        soundService.playSuccess();
        if (onStudentChanged) onStudentChanged(switched);
        setTab('profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    const guest = authService.logoutStudent();
    soundService.playClick();
    if (onStudentChanged) onStudentChanged(guest);
    setTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#090C14] border border-sky-500/30 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-[#090C14] p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center p-1">
              <MascotAvatar mascotType={currentStudent.avatar || 'dragon'} mood="happy" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                  STUDENT PORTAL
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentStudent.isGuest ? 'Guest Mode' : 'Verified Student'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {currentStudent.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.06] bg-[#0C0F19] px-4 py-1.5 gap-2 shrink-0">
          <button
            onClick={() => { setTab('profile'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              tab === 'profile'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👤 My Account
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              tab === 'signup'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Sign Up
          </button>
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              tab === 'login'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 Log In
          </button>
          <button
            onClick={() => { setTab('switch'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ml-auto ${
              tab === 'switch'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👥 Switch Profile ({allStudents.length})
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs flex-1">
          {/* TAB 1: PROFILE VIEW */}
          {tab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center p-1.5">
                      <MascotAvatar mascotType={currentStudent.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentStudent.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3 text-sky-400" />
                        <span>{currentStudent.email}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="p-2.5 rounded-xl bg-black/40 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Total XP</div>
                    <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{totalXP} XP</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Day Streak</div>
                    <div className="text-sm font-bold text-orange-400 font-mono mt-0.5">🔥 {streak} Days</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Quests Done</div>
                    <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">{completedCount}</div>
                  </div>
                </div>
              </div>

              {/* Data Isolation Notice */}
              <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/30 text-slate-300 text-xs space-y-1">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Personal Data Saving Enabled</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All your coding lessons, quiz scores, project progress, and study schedule are securely linked to <span className="text-white font-mono">{currentStudent.email}</span>. Multiple students can share this device without overwriting each other's work!
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setTab('switch')}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Switch Student Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Full Name / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Email Address (Used for saving your progress)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Password (Optional PIN/Password to protect your account)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password or leave blank"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  Choose Your Student Mascot Avatar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVATAR_OPTIONS.map(opt => (
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
                      <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center p-1 shrink-0">
                        <MascotAvatar mascotType={opt.id} mood="happy" className="w-full h-full" />
                      </div>
                      <div>
                        <div className="font-bold text-[11px] text-slate-200">{opt.name}</div>
                        <div className="text-[9px] text-slate-500">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs font-mono hover:opacity-90 transition-all shadow-md shadow-sky-500/20 mt-2"
              >
                Create Student Profile & Save Progress
              </button>
            </form>
          )}

          {/* TAB 3: LOG IN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password (if set)"
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md mt-2"
              >
                Log In to Student Account
              </button>
            </form>
          )}

          {/* TAB 4: SWITCH PROFILES */}
          {tab === 'switch' && (
            <div className="space-y-3 animate-fade-in">
              <div className="text-[11px] font-mono text-slate-400">
                Select an existing student profile to load their progress:
              </div>

              <div className="space-y-2">
                {allStudents.map(s => {
                  const isCurrent = s.email === currentStudent.email;
                  return (
                    <div
                      key={s.email}
                      onClick={() => !isCurrent && handleSwitch(s.email)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isCurrent 
                          ? 'bg-sky-500/10 border-sky-500/40 text-white cursor-default'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1">
                          <MascotAvatar mascotType={s.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white flex items-center gap-1.5">
                            <span>{s.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{s.email}</div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-sky-400 border border-white/10">
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setTab('signup')}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>+ Create Another Student Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
