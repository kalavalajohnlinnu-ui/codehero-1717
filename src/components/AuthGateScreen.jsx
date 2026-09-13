import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Upload,
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../services/soundService';
import { MascotAvatar } from './mascots/MascotAvatar';

const AVATARS = [
  { id: 'dragon', name: 'Pythie Dragon', desc: 'Python & AI Guardian' },
  { id: 'robot',  name: 'Cyber Sentinel', desc: 'Systems & Architecture' },
  { id: 'cat',   name: 'Byte Fox',        desc: 'Fast Logic & Web Apps' },
  { id: 'owl',   name: 'Wise Raven',      desc: 'Algorithms & Insight' }
];

/* A stat badge used in the hero side panel */
function StatBadge({ value, label, color = '#00E5FF' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono font-bold text-lg leading-none" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest font-mono text-[#4B5568]">
        {label}
      </span>
    </div>
  );
}

export function AuthGateScreen({ onAuthenticated }) {
  const [mode, setMode]       = useState('signup');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar]   = useState('dragon');
  const [error, setError]     = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const existingStudents = authService.getAllStudents().filter(s => !s.isGuest);

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
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

  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData  = JSON.parse(event.target.result);
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
    <div className="fixed inset-0 z-50 flex overflow-y-auto"
      style={{ background: 'var(--bg-base)', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left Hero Panel ───────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] shrink-0 relative overflow-hidden p-12"
        style={{
          background: 'linear-gradient(160deg, #0A0D1A 0%, #06080F 60%, #080B17 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}>

        {/* Ambient glow blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-5%] right-[-5%] w-[280px] h-[280px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF' }}>
              CH
            </div>
            <div>
              <div className="font-mono font-bold text-sm tracking-tight text-white">
                CODEHERO <span style={{ color: '#00E5FF' }}>2.0</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#4B5568]">
                Academy Platform
              </div>
            </div>
          </div>

          {/* Hero headline */}
          <div className="text-[10px] font-mono uppercase tracking-widest mb-3"
            style={{ color: '#00E5FF', letterSpacing: '0.18em' }}>
            01 // YOUR MISSION
          </div>
          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Become the<br />
            <span style={{
              background: 'linear-gradient(90deg, #00E5FF 0%, #22D3A6 50%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Top 1%</span><br />
            Engineer
          </h1>
          <p className="text-sm leading-relaxed mb-10"
            style={{ color: '#6B7A96', maxWidth: '360px' }}>
            631 structured lessons across 7 programming languages. 
            Real coding tasks, exams, and a personalized study plan — 
            everything you need to genuinely master programming.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <StatBadge value="631" label="Lessons" color="#00E5FF" />
            <StatBadge value="7" label="Languages" color="#22D3A6" />
            <StatBadge value="100%" label="Free" color="#F59E0B" />
          </div>
        </div>

        {/* Bottom languages strip */}
        <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: '#4B5568' }}>
            Languages you'll master
          </div>
          <div className="flex flex-wrap gap-2">
            {['Python', 'JavaScript', 'HTML & CSS', 'SQL', 'Java', 'C & C++', 'Rust'].map(lang => (
              <span key={lang} className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold"
                style={{
                  background: 'rgba(0,229,255,0.05)',
                  border: '1px solid rgba(0,229,255,0.12)',
                  color: '#8892AA'
                }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-sm"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.25)', color: '#00E5FF' }}>
              CH
            </div>
            <span className="font-mono font-bold text-sm text-white">
              CODEHERO <span style={{ color: '#00E5FF' }}>2.0</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: '#00E5FF' }}>
              {mode === 'signup' ? '02 // CREATE ACCOUNT' : '02 // SIGN IN'}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              {mode === 'signup' ? 'Start your journey' : 'Continue your progress'}
            </h2>
            <p className="text-sm mt-1.5" style={{ color: '#6B7A96' }}>
              {mode === 'signup'
                ? 'Your progress is saved permanently under your account.'
                : 'Log in to restore your lessons, scores, and certificates.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 mb-6 rounded-xl gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { id: 'signup', label: 'Create Account' },
              { id: 'login',  label: 'Log In' }
            ].map(t => (
              <button key={t.id} type="button"
                onClick={() => { setMode(t.id); setError(null); }}
                className="flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all"
                style={mode === t.id ? {
                  background: 'rgba(0,229,255,0.12)',
                  border: '1px solid rgba(0,229,255,0.3)',
                  color: '#00E5FF'
                } : { color: '#6B7A96' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Error / success */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs font-mono flex items-start gap-2"
              style={{ background: 'rgba(255,83,112,0.08)', border: '1px solid rgba(255,83,112,0.25)', color: '#FF5370' }}>
              ⚠ {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl text-xs font-mono flex items-center gap-2"
              style={{ background: 'rgba(34,211,166,0.08)', border: '1px solid rgba(34,211,166,0.25)', color: '#22D3A6' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field icon={<User className="w-4 h-4" />} label="Your Full Name">
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  style={inputStyle} className="w-full" />
              </Field>

              <Field icon={<Mail className="w-4 h-4" />} label="Email Address">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  style={inputStyle} className="w-full" />
              </Field>

              <Field icon={<Lock className="w-4 h-4" />} label="Password (optional PIN or password)">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Leave blank for no password"
                  style={inputStyle} className="w-full" />
              </Field>

              {/* Avatar picker */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-2.5" style={{ color: '#6B7A96' }}>
                  Choose your coding mascot
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AVATARS.map(opt => (
                    <button key={opt.id} type="button" onClick={() => setAvatar(opt.id)}
                      className="p-3 rounded-xl flex items-center gap-3 text-left transition-all"
                      style={avatar === opt.id ? {
                        background: 'rgba(0,229,255,0.08)',
                        border: '1px solid rgba(0,229,255,0.35)',
                      } : {
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center p-1.5 shrink-0"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <MascotAvatar mascotType={opt.id} mood="happy" className="w-full h-full" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{opt.name}</div>
                        <div className="text-[10px] font-mono" style={{ color: '#4B5568' }}>{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #00B4CC 100%)',
                  color: '#06080F',
                  boxShadow: '0 2px 0 #00697A, 0 4px 16px rgba(0,229,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                <span>Create Account & Enter Academy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* LOG IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field icon={<Mail className="w-4 h-4" />} label="Registered Email">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  style={inputStyle} className="w-full" />
              </Field>

              <Field icon={<Lock className="w-4 h-4" />} label="Password">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password (if set)"
                  style={inputStyle} className="w-full" />
              </Field>

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #00B4CC 100%)',
                  color: '#06080F',
                  boxShadow: '0 2px 0 #00697A, 0 4px 16px rgba(0,229,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                <span>Log In & Load My Progress</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Existing profiles */}
          {existingStudents.length > 0 && (
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: '#4B5568' }}>
                Saved profiles on this device
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {existingStudents.map(s => (
                  <button key={s.email} type="button" onClick={() => handleQuickSwitch(s.email)}
                    className="p-3 rounded-xl flex items-center gap-3 text-left transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5 shrink-0"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <MascotAvatar mascotType={s.avatar || 'dragon'} mood="happy" className="w-full h-full" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{s.name}</div>
                      <div className="text-[10px] font-mono truncate" style={{ color: '#4B5568' }}>{s.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Restore backup */}
          <div className="mt-5 pt-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: '#4B5568' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#22D3A6' }} />
              Have a backup file?
            </span>
            <label className="cursor-pointer text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              style={{ color: '#00E5FF' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <Upload className="w-3.5 h-3.5" />
              Restore Backup
              <input type="file" accept=".json" onChange={handleFileRestore} className="hidden" />
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────── */
const inputStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '10px',
  padding: '10px 14px 10px 38px',
  fontSize: '13px',
  fontFamily: "'JetBrains Mono', monospace",
  color: '#EEF0F8',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

function Field({ icon, label, children }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: '#6B7A96' }}>
        {label}
      </div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4B5568' }}>
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
