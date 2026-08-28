import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Eye,
  EyeOff,
  Database,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
  School,
  Briefcase
} from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface AuthPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onOpenDatabaseInspector: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onOpenDatabaseInspector }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState<UserRole>('student');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [major, setMajor] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Python');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        // Direct dynamic login with user's inputted email and password
        // With autoCreate fallback enabled if they want seamless first-time login
        const response = await api.login({
          email: email.trim(),
          password: password,
          autoCreateIfNotFound: true,
          role,
          name: name.trim() || undefined,
          college: college.trim() || undefined,
          company: company.trim() || undefined
        });

        setSuccessMessage(response.message || 'Authenticated successfully! Updating database session...');
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
        } catch (_) {}

        setTimeout(() => {
          onLoginSuccess(response.user, response.token);
        }, 500);
      } else {
        // Registration per user input
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }

        const skillsArray = skillsInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const response = await api.register({
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: role,
          college: role === 'student' || role === 'faculty' ? college.trim() || 'National Institute of Technology' : undefined,
          company: role === 'industry' ? company.trim() || 'Tech Innovation Partner' : undefined,
          department: department.trim() || undefined,
          major: major.trim() || undefined,
          skills: skillsArray
        });

        setSuccessMessage(`Account created for ${response.user.name} and written to database!`);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
        } catch (_) {}

        setTimeout(() => {
          onLoginSuccess(response.user, response.token);
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] bg-slate-950 font-['Manrope',sans-serif] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Left Column: Visual Brand Experience */}
      <div className="relative hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 border-r border-slate-800/80 overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Tag & Brand Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-950/40">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>SIH • Problem 26044 Platform</span>
          </div>

          <div className="mt-12 max-w-xl">
            <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Turn skills into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
                tangible careers.
              </span>
            </h1>
            <p className="mt-6 text-slate-300 text-base leading-relaxed max-w-lg">
              A unified bridge connecting students, academicians, institutions, and industry through intelligent skill mapping, real-time demand analytics, and verified portfolios.
            </p>
          </div>
        </div>

        {/* Value Prop Features */}
        <div className="relative z-10 my-10 space-y-4 max-w-lg">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dynamic User Input & Persistence</h4>
              <p className="text-xs text-slate-400 mt-1">Every user registration, skill rating, and profile update immediately writes to the live platform database.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Academia × Industry Linkages</h4>
              <p className="text-xs text-slate-400 mt-1">Real-time gap analysis aligning curriculum benchmarks with actual employer requirements.</p>
            </div>
          </div>
        </div>

        {/* Bottom Status & Live DB Inspector Trigger */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Database Online & Connected</span>
          </div>

          <button
            id="view-live-database-btn"
            onClick={onOpenDatabaseInspector}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            Inspect Database Records
          </button>
        </div>
      </div>

      {/* Right Column: User-Input-Driven Auth Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-slate-900/40 relative">
        <div className="w-full max-w-md">
          {/* Mobile Header Brand */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">SkillBridge</span>
            </div>

            <button
              onClick={onOpenDatabaseInspector}
              className="text-xs text-indigo-400 flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700"
            >
              <Database className="w-3 h-3" />
              DB Inspector
            </button>
          </div>

          {/* Form Container Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 sm:p-9 shadow-2xl shadow-slate-950/80">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-6">
              <button
                id="tab-signin"
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-register"
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Header copy */}
            <div className="mb-6">
              <span className="text-[11px] font-extrabold tracking-wider text-indigo-400 uppercase">
                {mode === 'signin' ? 'AUTHENTICATION' : 'NEW REGISTRATION'}
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                {mode === 'signin' ? 'Sign in to your workspace' : 'Register your profile in database'}
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">
                {mode === 'signin'
                  ? 'Enter your credentials to access your personalized workspace.'
                  : 'Fill in your details. Your profile will be dynamically written to the database.'}
              </p>
            </div>

            {/* Registration Role Selector (Shown when creating account or selecting role) */}
            {mode === 'register' && (
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Your Platform Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'student' as UserRole, label: 'Student', icon: GraduationCap, desc: 'Learner & Job Seeker' },
                    { key: 'industry' as UserRole, label: 'Industry', icon: Briefcase, desc: 'Recruiter & Partner' },
                    { key: 'faculty' as UserRole, label: 'Faculty', icon: BookOpen, desc: 'Educator & Mentor' },
                    { key: 'admin' as UserRole, label: 'Admin', icon: ShieldCheck, desc: 'Placement & Institution' }
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.key;
                    return (
                      <button
                        key={r.key}
                        id={`role-btn-${r.key}`}
                        type="button"
                        onClick={() => setRole(r.key)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{r.label}</div>
                          <div className="text-[10px] text-slate-500 leading-tight">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (For Register mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={mode === 'register' ? 'user@domain.com' : 'Enter your registered email'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">Password</label>
                  {mode === 'signin' && (
                    <span className="text-[11px] text-slate-500 hover:text-indigo-400 cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Additional Fields for Registration */}
              {mode === 'register' && (
                <>
                  {(role === 'student' || role === 'faculty' || role === 'admin') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">College / Institution</label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-college"
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. Indian Institute of Technology / NIT"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {role === 'industry' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Company / Organization</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. TechNova Labs, Microsoft, Infosys"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {role === 'student' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Key Skills (Comma-separated)</label>
                      <input
                        id="input-skills"
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. React, Python, Machine Learning, SQL"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-all"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Enter Workspace' : 'Create & Save in Database'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Helper */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              {mode === 'signin' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Database Live Sync Guarantee Footnote */}
          <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant sync: all inputs modify records in the live database</span>
          </div>
        </div>
      </div>
    </div>
  );
};
