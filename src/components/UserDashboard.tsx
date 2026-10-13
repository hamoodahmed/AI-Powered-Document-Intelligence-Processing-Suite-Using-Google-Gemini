import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ToolType, ProcessingHistoryItem } from '../types';
import {
  User as UserIcon,
  Crown,
  Zap,
  HardDrive,
  Sparkles,
  Layers,
  History,
  Download,
  Trash2,
  Search,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface UserDashboardProps {
  onNavigate: (view: string, toolId?: ToolType) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user, usage, history, clearHistory, openUpgradeModal, switchUserRole } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTool, setFilterTool] = useState<string>('all');

  const isPro = user?.plan === 'pro';

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.toolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTool = filterTool === 'all' || item.toolId === filterTool;
    return matchesSearch && matchesTool;
  });

  const downloadHistoryItems = history.filter((item) => item.downloadBlobUrl || item.downloadFileName);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || '/hamood_avatar.jpg'}
            alt={user?.name || 'Hamood Ahmed'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {user?.name || 'Guest User'}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isPro
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {user?.plan} Plan
              </span>
              {user?.role === 'admin' && (
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email || 'guest@example.com'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Member since {user?.createdAt || 'October 2026'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isPro ? (
            <button
              onClick={openUpgradeModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Upgrade to Pro</span>
            </button>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Pro Plan Active</span>
            </div>
          )}

          <button
            onClick={() => switchUserRole(user?.role === 'admin' ? 'user' : 'admin')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch to {user?.role === 'admin' ? 'User' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Usage Tracking Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meter 1: PDF Operations */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">PDF Operations</span>
            </div>
            <span className="text-xs font-semibold text-indigo-400">
              {isPro ? 'Unlimited' : `${usage.pdfOpsUsed} / ${usage.pdfOpsLimit}`}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{
                width: isPro
                  ? '35%'
                  : `${Math.min(100, (usage.pdfOpsUsed / usage.pdfOpsLimit) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {isPro
                ? `${usage.pdfOpsUsed} processed this month`
                : `${Math.max(0, usage.pdfOpsLimit - usage.pdfOpsUsed)} operations left`}
            </span>
            <span>Resets on Nov 1</span>
          </div>
        </div>

        {/* Meter 2: AI Queries */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">AI Document Queries</span>
            </div>
            <span className="text-xs font-semibold text-purple-400">
              {usage.aiQueriesUsed} / {isPro ? '500' : usage.aiQueriesLimit}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (usage.aiQueriesUsed / (isPro ? 500 : usage.aiQueriesLimit)) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {isPro
                ? `${500 - usage.aiQueriesUsed} queries left`
                : `${Math.max(0, usage.aiQueriesLimit - usage.aiQueriesUsed)} queries left`}
            </span>
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>

        {/* Meter 3: Storage */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">Storage Footprint</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400">
              {usage.storageUsedMB} MB / {isPro ? '10 GB' : `${usage.storageLimitMB} MB`}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (usage.storageUsedMB / (isPro ? 10000 : usage.storageLimitMB)) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Ephemeral sandbox</span>
            <span>Zero Data Retention</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white">Quick Tools Launchpad</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('pdf-workspace', 'merge')}
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-850 border border-slate-850 hover:border-indigo-500/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-white">Merge PDF</p>
            <p className="text-[10px] text-slate-400">Combine multiple files</p>
          </button>

          <button
            onClick={() => onNavigate('pdf-workspace', 'compress')}
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-850 border border-slate-850 hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-white">Compress PDF</p>
            <p className="text-[10px] text-slate-400">Reduce file size</p>
          </button>

          <button
            onClick={() => onNavigate('ai-workspace', 'summarize')}
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-850 border border-slate-850 hover:border-purple-500/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-white">AI Summarizer</p>
            <p className="text-[10px] text-slate-400">Executive highlights</p>
          </button>

          <button
            onClick={() => onNavigate('ai-workspace', 'chat')}
            className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-850 border border-slate-850 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-4 h-4" />
            </div>
            <p className="font-bold text-xs text-white">Chat with PDF</p>
            <p className="text-[10px] text-slate-400">Instant answers</p>
          </button>
        </div>
      </div>

      {/* Processing History & Download History Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Processing History</h2>
              <p className="text-xs text-slate-400">
                Log of recent documents transformed, summarized, or downloaded.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  clearHistory();
                  showToast('info', 'History cleared');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-rose-400 text-xs font-semibold border border-slate-800 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="pb-3 px-3">File Name</th>
                  <th className="pb-3 px-3">Tool</th>
                  <th className="pb-3 px-3">Size</th>
                  <th className="pb-3 px-3">Pages</th>
                  <th className="pb-3 px-3">Timestamp</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white truncate max-w-xs">{item.fileName}</div>
                      <div className="text-[10px] text-slate-500">{item.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold">
                        {item.toolName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {formatBytes(item.resultSize || item.originalSize)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {item.pagesCount ? `${item.pagesCount} pp` : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.downloadBlobUrl ? (
                        <a
                          href={item.downloadBlobUrl}
                          download={item.downloadFileName || item.fileName}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Re-download</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          <span>Processed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No processing history found</p>
            <p className="text-xs text-slate-500">
              Run any PDF or AI tool to view your jobs and download links here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
