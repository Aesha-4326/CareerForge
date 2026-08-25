import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User
} from 'lucide-react';
import React, { useState } from 'react';

import { useAuth } from '../../context/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('student'); // 'student' | 'company' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [companyName, setCompanyName] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMessage('Please provide both email and password.');
        return;
      }
      const res = await login(email, password, role);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } else {
      if (!name || !email || !password) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      const res = await register({
        name,
        email,
        password,
        role,
        rollNo,
        branch,
        companyName,
        accessCode
      });
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Auth Container */}
      <div className="w-full max-w-xl z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-3">
            <div className="solid-primary p-3 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl tracking-tight text-white">Career<span className="solid-accent">Forge</span></span>
                <span className="bg-indigo-500/15 text-indigo-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Campus Placement & Career Management System</p>
            </div>
          </div>
        </div>

        {/* Card Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          
          {/* Mode Selector Tabs */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setRole('student'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selector Grid */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  role === 'student'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold shadow-md shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${role === 'student' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs">Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('company')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  role === 'company'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white font-semibold shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Building2 className={`w-5 h-5 ${role === 'company' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs">Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                  role === 'admin'
                    ? 'border-rose-500 bg-rose-500/10 text-white font-semibold shadow-md shadow-rose-500/10'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Shield className={`w-5 h-5 ${role === 'admin' ? 'text-rose-400' : 'text-slate-400'}`} />
                <span className="text-xs">TPO Admin</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Register Specific Fields */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aesha Narola"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder={
                    role === 'student' ? 'student@college.edu' :
                    role === 'company' ? 'recruiter@company.com' :
                    'admin@college.edu'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Additional Registration Fields per Role */}
            {mode === 'register' && role === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CS2026-099"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                  </select>
                </div>
              </div>
            )}

            {mode === 'register' && role === 'company' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Adobe"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (role === 'company' || role === 'admin') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {role === 'company' ? 'Recruiter Registration Code *' : 'TPO Admin Registration Code *'}
                </label>
                <input
                  type="password"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter your invitation code"
                  className="w-full bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 solid-primary py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>{mode === 'login' ? `Sign In as ${role.toUpperCase()}` : `Create ${role.toUpperCase()} Account`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          CareerForge Platform &copy; 2026. Secured with Role-Based Access Control.
        </p>

      </div>
    </div>
  );
}
