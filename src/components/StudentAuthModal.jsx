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
  Award,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';
import { GoogleSignInButton } from './GoogleSignInButton';

const AVATAR_OPTIONS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & AI Guardian' },
  { id: 'robot', name: 'Cyber Sentinel', desc: 'System & Architecture' },
  { id: 'cat', name: 'Byte Fox', desc: 'Agile & Fast Thinker' },
  { id: 'owl', name: 'Wise Raven', desc: 'Algorithms & Insight' }
];

export function StudentAuthModal({ 
  isOpen, 
  onClose, 
  onStudentChanged,
  onOpenAdmin,
  totalXP = 0,
  streak = 1,
  completedCount = 0
}) {
  const currentStudent = authService.getCurrentStudent();
  const allStudents = authService.getAllStudents();
  const isAdm = authService.isCurrentStudentAdmin();

  const [tab, setTab] = useState(currentStudent?.isGuest ? 'signup' : 'profile'); // 'profile' | 'login' | 'signup' | 'switch'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState('dragon');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    if (!password || password.trim().length < 6) {
      setError('Password is compulsory and must be at least 6 characters long.');
      soundService.playFail();
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      soundService.playFail();
      return;
    }
    try {
      const newStudent = authService.registerStudent({ email, name, password, avatar });
      soundService.playFanfare();
      setSuccessMsg(`Welcome, ${newStudent.name}! Your student account is active.`);
      setTimeout(() => {
        setSuccessMsg(null);
        if (onStudentChanged) onStudentChanged(newStudent);
        setTab('profile');
      }, 900);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('Password is compulsory. Please enter your password.');
      soundService.playFail();
      return;
    }
    try {
      const loggedStudent = authService.loginStudent({ email, password });
      soundService.playSuccess();
      setSuccessMsg(`Welcome back, ${loggedStudent.name}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        if (onStudentChanged) onStudentChanged(loggedStudent);
        setTab('profile');
      }, 900);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleGoogleSuccess = (googleProfile) => {
    try {
      const student = authService.loginWithGoogle(googleProfile);
      soundService.playFanfare();
      setSuccessMsg(`Welcome, ${student.name}! Connected with Google.`);
      setTimeout(() => {
        setSuccessMsg(null);
        if (onStudentChanged) onStudentChanged(student);
        setTab('profile');
      }, 800);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSwitch = (targetEmail) => {
    try {
      const switched = authService.switchStudent(targetEmail);
      if (switched) {
        soundService.playSuccess();
        if (onStudentChanged) onStudentChanged(switched);
        setSuccessMsg(`Switched to ${switched.name}`);
        setTimeout(() => setSuccessMsg(null), 2500);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    const guest = authService.logoutStudent();
    soundService.playClick();
    if (onStudentChanged) onStudentChanged(guest);
    onClose();
  };

  const handleExportBackup = () => {
    soundService.playClick();
    const backupData = authService.exportStudentBackup();
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codehero_${currentStudent.name.replace(/\\s+/g, '_')}_backup.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 200);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        const restoredStudent = authService.importStudentBackup(backupData);
        soundService.playFanfare();
        setSuccessMsg(`Backup successfully restored for ${restoredStudent.name}!`);
        if (onStudentChanged) onStudentChanged(restoredStudent);
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err) {
        soundService.playFail();
        setError('Failed to restore backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Light Studio) */}
        <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center p-1 shadow-2xs">
              <MascotAvatar mascotType={currentStudent.avatar || 'dragon'} mood="happy" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold">
                  STUDENT PORTAL
                </span>
                {isAdm && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1">
                    👑 ADMIN
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {currentStudent.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 py-2 gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => { setTab('profile'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'profile'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ✨ Sign Up
          </button>
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🔑 Log In
          </button>
          <button
            onClick={() => { setTab('switch'); setError(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ml-auto ${
              tab === 'switch'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            👥 Accounts ({allStudents.length})
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs flex-1">
          {/* TAB 1: PROFILE VIEW */}
          {tab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              {/* Admin Launch Banner if user is admin */}
              {isAdm && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                      <span>👑 Administrator Access Active</span>
                    </div>
                    <div className="text-[11px] text-amber-700">
                      Monitor all students, track multi-language progress, and export rosters.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin?.();
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    Open Admin Portal →
                  </button>
                </div>
              )}

              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-2xs">
                      <MascotAvatar mascotType={currentStudent.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{currentStudent.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3 text-sky-600" />
                        <span>{currentStudent.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                    {currentStudent.authProvider === 'google' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-white text-slate-700 text-[9px] font-mono border border-slate-200">
                        <span>Google Account</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-500">Total XP</div>
                    <div className="text-sm font-bold text-amber-600 font-mono mt-0.5">{totalXP} XP</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-500">Day Streak</div>
                    <div className="text-sm font-bold text-orange-600 font-mono mt-0.5">🔥 {streak} Days</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-500">Quests Done</div>
                    <div className="text-sm font-bold text-sky-600 font-mono mt-0.5">{completedCount}</div>
                  </div>
                </div>
              </div>

              {/* Data Isolation Notice */}
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-slate-700 text-xs space-y-1">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Permanent Multi-Language Progress Protection</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your lessons, tests, and study plans are safely saved under <span className="font-bold text-slate-900 font-mono">{currentStudent.email}</span>. You can study in Python, JavaScript, HTML, SQL, C, Java, or Rust — every language is saved permanently.
                </p>
              </div>

              {/* Data Backup & Restore */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between font-semibold">
                  <span>DATA BACKUP &amp; RESTORE</span>
                  <span className="text-[10px] text-emerald-600 font-bold">100% PORTABLE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>📥 Save Backup (.json)</span>
                  </button>

                  <label className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono text-sky-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                    <span>📤 Restore Backup</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportBackup} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setTab('switch')}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono text-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Switch Account</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-mono text-rose-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP */}
          {tab === 'signup' && (
            <div className="space-y-4 animate-fade-in">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onAuthenticated={handleGoogleSuccess}
                text="Sign up with Google"
              />

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  or register with email &amp; password
                </span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Full Name / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Password (Compulsory, min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create your password"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Confirm Password (Compulsory)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password to confirm"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1.5 font-semibold">
                    Choose Your Student Avatar
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVATAR_OPTIONS.map(opt => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setAvatar(opt.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          avatar === opt.id
                            ? 'bg-sky-50 border-sky-400 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0">
                          <MascotAvatar mascotType={opt.id} mood="happy" className="w-full h-full" />
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-slate-900">{opt.name}</div>
                          <div className="text-[9px] text-slate-500">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs font-mono transition-all shadow-xs cursor-pointer active:scale-95 mt-2"
                >
                  Create Student Account
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: LOG IN */}
          {tab === 'login' && (
            <div className="space-y-4 animate-fade-in">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onAuthenticated={handleGoogleSuccess}
                text="Sign in with Google"
              />

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  or log in with email &amp; password
                </span>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                    Password (Compulsory)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs font-mono transition-all shadow-xs cursor-pointer active:scale-95 mt-2"
                >
                  Log In &amp; Restore Progress
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SWITCH ACCOUNT */}
          {tab === 'switch' && (
            <div className="space-y-3 animate-fade-in">
              <div className="text-[11px] font-mono text-slate-500 font-semibold">
                ACCOUNTS SAVED ON THIS DEVICE
              </div>
              <div className="space-y-2">
                {allStudents.map(s => {
                  const isCurrent = s.email.toLowerCase() === currentStudent.email.toLowerCase();
                  const isAccountAdmin = authService.isAdminEmail(s.email);
                  return (
                    <div
                      key={s.email}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-300'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1">
                          <MascotAvatar mascotType={s.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{s.name}</span>
                            {isAccountAdmin && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                                👑 Admin
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">{s.email}</div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleSwitch(s.email)}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-mono font-bold cursor-pointer active:scale-95 transition-all shadow-2xs"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
