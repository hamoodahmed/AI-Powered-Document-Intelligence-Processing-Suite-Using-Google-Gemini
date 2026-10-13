import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Users,
  BarChart3,
  Sliders,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Lock,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  Sparkles,
  Zap,
  Layers,
  HardDrive,
  UserCheck,
  UserX,
} from 'lucide-react';

interface MockAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
  opsCount: number;
  status: 'active' | 'suspended';
  joined: string;
}

const INITIAL_USERS: MockAdminUser[] = [
  {
    id: 'usr_101',
    name: 'Eleanor Vance',
    email: 'admin@pdfgenius.com',
    role: 'admin',
    plan: 'pro',
    opsCount: 428,
    status: 'active',
    joined: '2026-01-15',
  },
  {
    id: 'usr_102',
    name: 'Hamood Ahmed',
    email: 'hamoodahmed75a@gmail.com',
    role: 'user',
    plan: 'free',
    opsCount: 6,
    status: 'active',
    joined: '2026-10-01',
  },
  {
    id: 'usr_103',
    name: 'Jordan Hayes',
    email: 'jordan.pro@workspace.io',
    role: 'user',
    plan: 'pro',
    opsCount: 184,
    status: 'active',
    joined: '2026-07-20',
  },
  {
    id: 'usr_104',
    name: 'Sofia Ramirez',
    email: 'sofia.r@techcorp.de',
    role: 'user',
    plan: 'pro',
    opsCount: 92,
    status: 'active',
    joined: '2026-08-04',
  },
  {
    id: 'usr_105',
    name: 'David Chen',
    email: 'david.chen@fintech.io',
    role: 'user',
    plan: 'free',
    opsCount: 10,
    status: 'active',
    joined: '2026-10-01',
  },
  {
    id: 'usr_106',
    name: 'Elena Rostova',
    email: 'elena.rostova@legal-advisors.ch',
    role: 'user',
    plan: 'pro',
    opsCount: 310,
    status: 'active',
    joined: '2026-04-18',
  },
];

export const AdminDashboard: React.FC = () => {
  const { user, switchUserRole } = useAuth();
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState<MockAdminUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro'>('all');

  // Plan Management settings
  const [freePdfLimit, setFreePdfLimit] = useState(10);
  const [freeAiLimit, setFreeAiLimit] = useState(5);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(15);
  const [featureGemini, setFeatureGemini] = useState(true);
  const [featureBatch, setFeatureBatch] = useState(true);
  const [featureStrictRateLimit, setFeatureStrictRateLimit] = useState(false);

  const isAdmin = user?.role === 'admin';

  // If normal user tries to access, show security gate
  if (!isAdmin) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Protected Administrative Console
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Access to this area requires Super Administrator privileges. Normal users and free tier accounts cannot view platform analytics or manage plan configurations.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
          <p className="font-semibold text-amber-300 mb-1">Developer & Evaluator Access:</p>
          <p className="text-slate-400 mb-3">
            Click below to instantly switch to the Administrator role (Eleanor Vance) to inspect the management suite.
          </p>
          <button
            onClick={() => switchUserRole('admin')}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate as Super Admin (Eleanor)</span>
          </button>
        </div>
      </div>
    );
  }

  const toggleUserPlan = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newPlan = u.plan === 'free' ? 'pro' : 'free';
          showToast('success', `Updated ${u.name}'s plan`, `Changed tier to ${newPlan.toUpperCase()}`);
          return { ...u, plan: newPlan };
        }
        return u;
      })
    );
  };

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast('info', `User status updated`, `${u.name} is now ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleSavePlanSettings = () => {
    showToast('success', 'Plan Configuration Saved', 'Updated Free tier limits and platform feature flags.');
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Admin Control Center
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Root Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Platform governance, real-time user management, plan thresholds, and health telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => switchUserRole('user')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Exit to Normal User View
          </button>
        </div>
      </div>

      {/* Platform Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">1,482</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% this month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total PDFs Processed</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">48,290</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>99.98% success rate</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Queries Executed</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">24,180</div>
          <div className="text-[11px] text-purple-300 font-semibold">Gemini 3.8 Flash</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Storage Reclaimed</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">1.8 TB</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Compression saving</div>
        </div>
      </div>

      {/* Tool Distribution Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Tool Utilization Distribution</h3>
            <p className="text-xs text-slate-400">Popularity breakdown across all document operations.</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Past 30 Days</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[
              { name: 'Merge PDF', pct: 34, color: 'bg-indigo-500' },
              { name: 'AI PDF Summarizer', pct: 28, color: 'bg-purple-500' },
              { name: 'Compress PDF', pct: 18, color: 'bg-emerald-500' },
            ].map((tool, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>{tool.name}</span>
                  <span>{tool.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${tool.color} rounded-full`} style={{ width: `${tool.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              { name: 'Split PDF', pct: 11, color: 'bg-blue-500' },
              { name: 'Add Watermark', pct: 9, color: 'bg-amber-500' },
              { name: 'Protect & Image Tools', pct: 7, color: 'bg-rose-500' },
            ].map((tool, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>{tool.name}</span>
                  <span>{tool.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${tool.color} rounded-full`} style={{ width: `${tool.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">User Management</h3>
            <p className="text-xs text-slate-400">
              Manage accounts, toggle Pro subscriptions, and adjust access permissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user or email..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'free', 'pro'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlanFilter(p)}
                  className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                    planFilter === p ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Plan</th>
                <th className="pb-3 px-3">Operations</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        u.plan === 'pro'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{u.opsCount}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'active'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => toggleUserPlan(u.id)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold transition-colors"
                    >
                      Toggle {u.plan === 'free' ? 'Pro' : 'Free'}
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                        u.status === 'active'
                          ? 'bg-rose-950/40 hover:bg-rose-950 text-rose-300'
                          : 'bg-emerald-950/40 hover:bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Management Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">Plan Limits & Engine Controls</h3>
            <p className="text-xs text-slate-400">
              Configure free tier allowances and platform operational flags.
            </p>
          </div>
          <button
            onClick={handleSavePlanSettings}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Free Plan Monthly PDF Ops</span>
              <span className="text-amber-400 font-bold">{freePdfLimit} ops</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={freePdfLimit}
              onChange={(e) => setFreePdfLimit(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
            <p className="text-[10px] text-slate-500">Default allowance before triggering Pro upgrade modal.</p>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Free Plan Monthly AI Queries</span>
              <span className="text-purple-400 font-bold">{freeAiLimit} queries</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              value={freeAiLimit}
              onChange={(e) => setFreeAiLimit(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500"
            />
            <p className="text-[10px] text-slate-500">Gemini 3.8 Flash query limit for free registered users.</p>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
            <div className="flex justify-between text-xs font-semibold text-slate-200">
              <span>Free Plan Max File Size</span>
              <span className="text-emerald-400 font-bold">{maxFileSizeMB} MB</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={maxFileSizeMB}
              onChange={(e) => setMaxFileSizeMB(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
            <p className="text-[10px] text-slate-500">Maximum allowed client payload size per document upload.</p>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850 cursor-pointer">
            <input
              type="checkbox"
              checked={featureGemini}
              onChange={(e) => setFeatureGemini(e.target.checked)}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <p className="text-xs font-semibold text-white">Gemini 3.8 Flash AI</p>
              <p className="text-[10px] text-slate-400">Server-side LLM synthesis</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850 cursor-pointer">
            <input
              type="checkbox"
              checked={featureBatch}
              onChange={(e) => setFeatureBatch(e.target.checked)}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <p className="text-xs font-semibold text-white">Batch File Processing</p>
              <p className="text-[10px] text-slate-400">Multi-PDF merge & image export</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-850 cursor-pointer">
            <input
              type="checkbox"
              checked={featureStrictRateLimit}
              onChange={(e) => setFeatureStrictRateLimit(e.target.checked)}
              className="accent-amber-500 w-4 h-4 rounded"
            />
            <div>
              <p className="text-xs font-semibold text-white">Strict DDOS Shield</p>
              <p className="text-[10px] text-slate-400">Throttle unauthorized bursts</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
