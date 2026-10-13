import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Sparkles,
  Layers,
  Crown,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  History,
  LayoutDashboard,
  Zap,
} from 'lucide-react';
import { ToolType } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, toolId?: ToolType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, usage, logout, openAuthModal, openUpgradeModal, switchUserRole } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPro = user?.plan === 'pro';
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  PDF Genius
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Smart Document Suite
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('pdf-workspace')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentView === 'pdf-workspace'
                  ? 'text-indigo-300 bg-indigo-950/40 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              PDF Tools
            </button>
            <button
              onClick={() => onNavigate('ai-workspace')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentView === 'ai-workspace'
                  ? 'text-purple-300 bg-purple-950/40 border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Tools
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'pricing'
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentView === 'dashboard'
                  ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Dashboard
            </button>

            {/* Protected Admin Tab - only shown to Admin role */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors animate-pulse ${
                  currentView === 'admin'
                    ? 'text-amber-300 bg-amber-950/50 border border-amber-500/40'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 border border-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Panel
              </button>
            )}
          </div>

          {/* Right Action buttons & User profile */}
          <div className="flex items-center gap-3">
            {/* Plan Badge / Upgrade button */}
            {user ? (
              isPro ? (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span>Pro Plan</span>
                </div>
              ) : (
                <button
                  onClick={openUpgradeModal}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Upgrade Pro
                </button>
              )
            ) : null}

            {/* User Dropdown or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-850 border border-slate-800 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                  />
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {user.role === 'admin' ? 'Super Admin' : `${user.plan} user`}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-slate-200 animate-slide-in"
                  >
                    <div className="p-3 bg-slate-950/60 rounded-xl mb-2 border border-slate-800/80">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>

                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Plan:</span>
                        <span
                          className={`font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-full ${
                            isPro
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {user.plan}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400 flex justify-between">
                        <span>Ops used:</span>
                        <span className="font-semibold text-slate-300">
                          {usage.pdfOpsUsed} / {user.plan === 'pro' ? 'Unlimited' : usage.pdfOpsLimit}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-400" />
                        User Dashboard & Profile
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <History className="w-4 h-4 text-emerald-400" />
                        Processing & Downloads
                      </button>

                      {!isPro && (
                        <button
                          onClick={() => {
                            openUpgradeModal();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-amber-950/40 text-amber-300 transition-colors"
                        >
                          <Crown className="w-4 h-4 text-amber-400" />
                          Upgrade to Pro
                        </button>
                      )}

                      {/* Role switcher shortcut for rapid testing */}
                      <div className="pt-2 my-1 border-t border-slate-800">
                        <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Role Switcher (Demo)
                        </div>
                        <button
                          onClick={() => {
                            switchUserRole(isAdmin ? 'user' : 'admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>Switch to {isAdmin ? 'Normal User' : 'Admin'}</span>
                          </div>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            Demo
                          </span>
                        </button>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg bg-amber-950/30 text-amber-300 hover:bg-amber-950/50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          Open Admin Dashboard
                        </button>
                      )}

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-rose-950/40 text-rose-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => {
              onNavigate('landing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('pdf-workspace');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            PDF Tools
          </button>
          <button
            onClick={() => {
              onNavigate('ai-workspace');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Tools
          </button>
          <button
            onClick={() => {
              onNavigate('pricing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Pricing
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard & History
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                onNavigate('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-amber-300 bg-amber-950/30 border border-amber-500/30 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          )}

          {!isPro && user && (
            <button
              onClick={() => {
                openUpgradeModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              Upgrade to Pro Plan
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
