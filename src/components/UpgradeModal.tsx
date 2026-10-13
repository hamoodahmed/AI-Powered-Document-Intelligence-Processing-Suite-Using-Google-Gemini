import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Check, Crown, Zap, Sparkles, Shield, ArrowRight, RotateCcw } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, closeUpgradeModal, user, upgradeToPro, downgradeToFree } = useAuth();
  const { showToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!isUpgradeModalOpen) return null;

  const isPro = user?.plan === 'pro';

  const handleActivatePro = () => {
    upgradeToPro();
    showToast(
      'success',
      'Pro Plan Activated!',
      'You now have unlimited PDF operations, 500 AI queries, and up to 100MB file sizes.'
    );
  };

  const handleDowngrade = () => {
    downgradeToFree();
    showToast('info', 'Switched to Free Tier', 'Standard monthly limits (10 PDF ops, 5 AI queries) are now active.');
    closeUpgradeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5 fill-amber-300" />
            <span>PDF Genius Pro Tier</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Supercharge Your Document Workflow
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Eliminate processing limits, unlock long-form Gemini AI document analysis, and process high-resolution files.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl mt-5 border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly billing</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Free Tier Card */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-base text-slate-200">Free Tier</h4>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                  Current Tier
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white mb-4">
                $0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10 PDF operations per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 Gemini AI queries per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 15MB file size limit</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <X className="w-4 h-4 shrink-0" />
                  <span>No batch file processing</span>
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Standard queue latency</span>
                </li>
              </ul>
            </div>

            {isPro && (
              <button
                onClick={handleDowngrade}
                className="mt-6 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Downgrade to Free (Test Limits)</span>
              </button>
            )}
          </div>

          {/* Pro Tier Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-slate-950/80 border-2 border-indigo-500/50 shadow-xl shadow-indigo-950/50 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-base text-white">Pro Plan</h4>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">
                {billingCycle === 'yearly' ? '$9' : '$12'}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
                {billingCycle === 'yearly' && (
                  <span className="text-[11px] text-emerald-400 block font-normal">
                    billed annually ($108/yr)
                  </span>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited</strong> PDF Operations (Merge, Split, etc.)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>500</strong> Gemini AI Queries per month</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Large files up to <strong>100MB</strong></span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Batch Multi-Document Processing</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority GPU Processing & Zero Queue</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Export Summaries & Full Chat Transcripts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleActivatePro}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>{isPro ? 'Pro Active (Click to Re-confirm)' : 'Activate Pro Plan (Test Mode)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulation Mode: No real payment required. Test all Pro capabilities instantly.</span>
        </div>
      </div>
    </div>
  );
};
