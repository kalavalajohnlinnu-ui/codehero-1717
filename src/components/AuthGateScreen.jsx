import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Upload,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';
import { GoogleSignInButton } from './GoogleSignInButton';

const AVATARS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & AI Guardian' },
  { id: 'robot',  name: 'Cyber Sentinel', desc: 'Systems & Architecture' },
  { id: 'cat',   name: 'Byte Fox',        desc: 'Fast Logic & Web Apps' },
  { id: 'owl',   name: 'Wise Raven',      desc: 'Algorithms & Insight' }
];

function StatBadge({ value, label, color = '#0284C7' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono font-bold text-xl leading-none" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-semibold">
        {label}
      </span>
    </div>
  );
}

export function AuthGateScreen({ onAuthenticated }) {
  const [mode, setMode]                   = useState('signup');
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [avatar, setAvatar]               = useState('dragon');
  const [error, setError]                 = useState(null);
  const [successMsg, setSuccessMsg]       = useState(null);

  const handleGoogleSuccess = (profile) => {
    try {
      const student = authService.loginWithGoogle(profile);
      soundService.playFanfare();
      setSuccessMsg(`Welcome, ${student.name}! Authenticated with Google.`);
      setTimeout(() => onAuthenticated(student), 900);
    } catch (err) {
      setError('Google sign-in failed: ' + err.message);
    }
  };

  const existingStudents = authService.getAllStudents().filter(s => !s.isGuest);

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
      const student = authService.registerStudent({ email, name, password, avatar });
      soundService.playFanfare();
      setSuccessMsg(`Welcome to CodeHero Academy, ${student.name}! Loading your workspace…`);
      setTimeout(() => onAuthenticated(student), 1000);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('Password is compulsory. Please enter your account password.');
      soundService.playFail();
      return;
    }
    try {
      const student = authService.loginStudent({ email, password });
      soundService.playSuccess();
      setSuccessMsg(`Welcome back, ${student.name}! Restoring your progress…`);
      setTimeout(() => onAuthenticated(student), 1000);
    } catch (err) {
      soundService.playFail();
      setError(err.message);
    }
  };

  const handleQuickSwitch = (targetEmail) => {
    try {
      const switched = authService.switchStudent(targetEmail);
      if (switched) { soundService.playSuccess(); onAuthenticated(switched); }
    } catch (err) { setError(err.message); }
  };

  const handleDemoAdminLogin = () => {
    try {
      let student = authService.getAllStudents().find(s => s.email.toLowerCase() === 'kalavalajohnlinnu@gmail.com');
      if (!student) {
        authService.seedDemoStudents();
        student = authService.getAllStudents().find(s => s.email.toLowerCase() === 'kalavalajohnlinnu@gmail.com');
      }
      if (student) {
        authService.setCurrentStudent(student);
        soundService.playFanfare();
        setSuccessMsg(`Logged in as Administrator (${student.email})!`);
        setTimeout(() => onAuthenticated(student), 800);
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
        const backupData      = JSON.parse(event.target.result);
        const restoredStudent = authService.importStudentBackup(backupData);
        soundService.playFanfare();
        setSuccessMsg(`Backup restored for ${restoredStudent.name}!`);
        setTimeout(() => onAuthenticated(restoredStudent), 1200);
      } catch (err) {
        soundService.playFail();
        setError('Restore failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-[#F8FAFC] text-slate-900 font-sans">

      {/* ── Left Hero Panel (Light Theme) ────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] shrink-0 relative overflow-hidden p-12 bg-slate-100/80 border-r border-slate-200">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center font-mono font-black text-sm text-sky-700 shadow-sm">
              CH
            </div>
            <div>
              <div className="font-mono font-bold text-sm tracking-tight text-slate-900">
                CODEHERO <span className="text-sky-600">2.0</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Academy Platform
              </div>
            </div>
          </div>

          {/* Hero headline */}
          <div className="text-[10px] font-mono uppercase tracking-widest mb-3 text-sky-600 font-bold"
            style={{ letterSpacing: '0.18em' }}>
            01 // YOUR MISSION
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-4 font-display">
            Become the<br />
            <span className="text-sky-600">Top 10-15%</span><br />
            Software Engineer
          </h1>
          <p className="text-sm leading-relaxed mb-10 text-slate-600 max-w-[380px]">
            631 structured lessons across 7 programming languages. 
            Real coding tasks, diagnostic debugging cases, and a personalized study plan.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
            <StatBadge value="631" label="Lessons" color="#0284C7" />
            <StatBadge value="7" label="Languages" color="#059669" />
            <StatBadge value="100%" label="Free" color="#D97706" />
          </div>
        </div>

        {/* Bottom languages strip */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-[10px] font-mono uppercase tracking-widest mb-3 text-slate-400 font-bold">
            Languages you'll master
          </div>
          <div className="flex flex-wrap gap-2">
            {['Python', 'JavaScript', 'HTML & CSS', 'SQL', 'Java', 'C & C++', 'Rust'].map(lang => (
              <span key={lang} className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel (Light Theme) ───────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 py-12 bg-[#F8FAFC]">
        <div className="w-full max-w-[440px] bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xl">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center font-mono font-black text-sm text-sky-700">
              CH
            </div>
            <span className="font-mono font-bold text-sm text-slate-900">
              CODEHERO <span className="text-sky-600">2.0</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5 text-sky-600 font-bold">
              {mode === 'signup' ? '02 // CREATE ACCOUNT' : '02 // SIGN IN'}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              {mode === 'signup' ? 'Start your journey' : 'Continue your progress'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'signup'
                ? 'Your password is compulsory and keeps your multi-language progress safe.'
                : 'Log in with your email & compulsory password to access all courses.'}
            </p>
          </div>

          {/* Prominent Google Sign-In Button */}
          <div className="mb-5">
            <GoogleSignInButton 
              onSuccess={handleGoogleSuccess}
              onAuthenticated={handleGoogleSuccess}
              onError={(err) => setError('Google sign-in error: ' + err.message)}
            />

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                or use email &amp; password
              </span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 mb-5 rounded-xl gap-1 bg-slate-100 border border-slate-200">
            {[
              { id: 'signup', label: 'Create Account' },
              { id: 'login',  label: 'Log In' }
            ].map(t => (
              <button key={t.id} type="button"
                onClick={() => { setMode(t.id); setError(null); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  mode === t.id
                    ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Error / success */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs font-mono flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700">
              ⚠ {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-mono flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <Field icon={<User className="w-4 h-4" />} label="Your Full Name">
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500" />
              </Field>

              <Field icon={<Mail className="w-4 h-4" />} label="Email Address">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500" />
              </Field>

              <Field icon={<Lock className="w-4 h-4" />} label="Password (Compulsory, min 6 characters)">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength={6}
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Field>

              <Field icon={<Lock className="w-4 h-4" />} label="Confirm Password (Compulsory)">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength={6}
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500" 
                />
              </Field>

              {/* Avatar picker */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-2 text-slate-500 font-semibold">
                  Choose your coding companion
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AVATARS.map(opt => (
                    <button key={opt.id} type="button" onClick={() => setAvatar(opt.id)}
                      className={`p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all border cursor-pointer ${
                        avatar === opt.id 
                          ? 'bg-sky-50 border-sky-400 shadow-2xs' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0">
                        <MascotAvatar mascotType={opt.id} mood="happy" className="w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{opt.name}</div>
                        <div className="text-[9px] font-mono text-slate-500">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 font-mono mt-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Create Account &amp; Enter Academy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* LOG IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <Field icon={<Mail className="w-4 h-4" />} label="Registered Email">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500" />
              </Field>

              <Field icon={<Lock className="w-4 h-4" />} label="Password (Compulsory)">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Field>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 font-mono mt-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Log In &amp; Load My Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Admin Demo Button */}
          <div className="mt-5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <span>👑 Quick Admin Access</span>
              </div>
              <div className="text-[10px] font-mono text-amber-700">kalavalajohnlinnu@gmail.com</div>
            </div>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold font-mono active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Sign In as Admin
            </button>
          </div>

          {/* Existing profiles */}
          {existingStudents.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="text-[10px] font-mono uppercase tracking-widest mb-2.5 text-slate-400 font-semibold">
                Saved profiles on this device
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {existingStudents.map(s => {
                  const isAdm = authService.isAdminEmail(s.email);
                  return (
                    <button key={s.email} type="button" onClick={() => handleQuickSwitch(s.email)}
                      className="p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0">
                        <MascotAvatar mascotType={s.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                      </div>
                      <div className="truncate flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          <span>{s.name}</span>
                          {isAdm && (
                            <span className="text-[9px] px-1 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                              👑
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">{s.email}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Restore backup */}
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-200">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Have a backup file?
            </span>
            <label className="cursor-pointer text-xs font-mono font-bold flex items-center gap-1.5 text-sky-600 hover:text-sky-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
              <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" />
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-1 text-slate-600 font-semibold">
        {label}
      </div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
