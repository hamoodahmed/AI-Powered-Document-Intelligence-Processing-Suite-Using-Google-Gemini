import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Mail, Lock, User as UserIcon, ShieldCheck, Crown, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, signup } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        showToast('error', 'Please enter your full name');
        return;
      }
      signup(email, name);
      showToast('success', `Welcome to PDF Genius, ${name}!`, 'Your free account has been created.');
    } else {
      login(email, name || email.split('@')[0], email.includes('admin') ? 'admin' : 'user', 'free');
      showToast('success', 'Signed in successfully!', `Welcome back, ${email.split('@')[0]}`);
    }
    closeAuthModal();
  };

  const handleDemoLogin = (role: 'free' | 'pro' | 'admin') => {
    if (role === 'admin') {
      login('admin@pdfgenius.com', 'Eleanor Vance', 'admin', 'pro');
      showToast('success', 'Signed in as Administrator!', 'Full admin dashboard and platform analytics unlocked.');
    } else if (role === 'pro') {
      login('jordan.pro@workspace.io', 'Jordan Hayes', 'user', 'pro');
      showToast('success', 'Signed in as Pro User!', 'Unlimited operations and priority AI unlocked.');
    } else {
      login('hamoodahmed75a@gmail.com', 'Hamood Ahmed', 'user', 'free');
      showToast('success', 'Signed in as Hamood Ahmed!', 'Welcome to PDF Genius Free Plan.');
    }
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Free Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your processing history and document tools'
              : 'Join PDF Genius to save history and unlock AI features'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl mt-4 border border-slate-800">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* One-Click Fast Demo Accounts */}
        <div className="mb-6 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Instant Demo Login:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('free')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all text-center group"
            >
              <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 mb-1" />
              <span className="text-[11px] font-semibold text-slate-200">Free User</span>
              <span className="text-[9px] text-slate-500">10 ops/mo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('pro')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-500/60 transition-all text-center group"
            >
              <Crown className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[11px] font-semibold text-amber-300">Pro User</span>
              <span className="text-[9px] text-slate-500">Unlimited</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-purple-500/30 hover:border-purple-500/60 transition-all text-center group"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-[11px] font-semibold text-purple-300">Admin</span>
              <span className="text-[9px] text-slate-500">Full Access</span>
            </button>
          </div>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>{mode === 'login' ? 'Sign In to PDF Genius' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-4">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
