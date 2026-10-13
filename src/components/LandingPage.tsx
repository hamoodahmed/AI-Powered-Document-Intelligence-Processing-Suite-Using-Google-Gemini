import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PDF_TOOLS, AI_TOOLS, FAQS } from '../data/toolsData';
import { ToolType, PDFToolId, AIToolId } from '../types';
import { ToolIcon } from './ToolIcon';
import {
  FileText,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  Users,
  Lock,
  Download,
  HelpCircle,
  Clock,
  Crown,
  Play,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string, toolId?: ToolType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, openUpgradeModal, openAuthModal } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="w-full space-y-24 sm:space-y-32 py-10 sm:py-16 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Next-Gen Document Suite powered by Gemini 3.8 Flash</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          The Smartest Way to{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Transform, Edit & Chat
          </span>{' '}
          with Any PDF
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Merge, split, compress, watermark, protect, and converse with documents in seconds. Built with zero-retention client privacy and state-of-the-art document intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('pdf-workspace', 'merge')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Layers className="w-5 h-5" />
            <span>Launch PDF Tools Free</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onNavigate('ai-workspace', 'chat')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-sm sm:text-base shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Try AI Document Chat</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-300 font-semibold">4.9/5</span>
            <span>(2,400+ reviews)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>100% In-Browser Privacy Sandbox</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Sub-3-Second Processing</span>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-semibold text-slate-400 hidden sm:inline">
                PDF Genius App — Unified Document Studio
              </span>
            </div>
            <span className="text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
              Live Interactive Workspace
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigate('pdf-workspace', 'merge')}
              className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Merge Multiple PDFs</h4>
              <p className="text-xs text-slate-400 mt-1">
                Combine 2 or more documents with real-time page ordering and instant output.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 font-semibold group-hover:underline">
                Launch tool <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div
              onClick={() => onNavigate('pdf-workspace', 'compress')}
              className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Compress up to 70%</h4>
              <p className="text-xs text-slate-400 mt-1">
                Shrink bulky contracts and portfolios without blurry text or pixelation.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold group-hover:underline">
                Compress now <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div
              onClick={() => onNavigate('ai-workspace', 'summarize')}
              className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">AI PDF Summarizer</h4>
              <p className="text-xs text-slate-400 mt-1">
                Summarize 50-page reports into actionable bullet points in under 3 seconds.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-purple-400 font-semibold group-hover:underline">
                Generate summary <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PDF Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Complete Utility Toolkit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            7 Essential PDF Operations
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every file manipulation task handled locally in your browser with zero latency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PDF_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate('pdf-workspace', tool.id as PDFToolId)}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform`}
                  >
                    <ToolIcon name={tool.iconName} className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700 uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Banner tile for AI suite */}
          <div
            onClick={() => onNavigate('ai-workspace')}
            className="bg-gradient-to-br from-purple-950/60 to-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-all shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Explore AI Document Suite</h3>
              <p className="text-xs text-purple-200/80 mt-2 leading-relaxed">
                Unlock natural conversations, instant answers, and structured takeaways with Gemini.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-800/50 flex items-center justify-between text-xs font-bold text-purple-300">
              <span>Open AI Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Superpowers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Superpowers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Turn Static PDFs into Dynamic Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Ask questions, extract deadlines, analyze contractual obligations, and receive verified answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AI_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate('ai-workspace', tool.id as AIToolId)}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 cursor-pointer group transition-all hover:scale-[1.01] shadow-xl"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:rotate-6 transition-transform`}
              >
                <ToolIcon name={tool.iconName} className="w-7 h-7" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                      {tool.name}
                    </h3>
                    {tool.badge && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-300/80 font-medium mb-2">{tool.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{tool.description}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <span>Try this AI feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How PDF Genius Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">Three frictionless steps from upload to delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 font-extrabold text-xl flex items-center justify-center mx-auto border border-indigo-500/20">
              01
            </div>
            <h3 className="font-bold text-white text-base">Select or Drop Files</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload PDF or image files, or click "Load Sample" for one-click testing without sharing local data.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 font-extrabold text-xl flex items-center justify-center mx-auto border border-purple-500/20">
              02
            </div>
            <h3 className="font-bold text-white text-base">Transform or Query AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust compression sliders, watermark text, page ranges, or let Gemini extract deep executive insights.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 font-extrabold text-xl flex items-center justify-center mx-auto border border-emerald-500/20">
              03
            </div>
            <h3 className="font-bold text-white text-base">Download & Archive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export pristine, high-fidelity PDFs, PNGs, or Markdown summaries. All jobs are logged in your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Predictable, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple Plans for Every Workload
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Start free with full tool access, or upgrade to Pro for unlimited operations and high-volume AI.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-slate-900 p-1 rounded-xl mt-6 border border-slate-800">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                billingPeriod === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                billingPeriod === 'yearly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-white">Free Starter</h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-semibold">
                  Free Forever
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Perfect for casual users who need occasional file merging, watermarking, and quick AI summaries.
              </p>
              <div className="text-4xl font-extrabold text-white mb-6">
                $0 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>10 PDF Operations</strong> per month (Merge, Split, etc.)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>5 Gemini 3.8 Flash</strong> AI queries per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 15MB file size limit</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Processing history log (last 5 jobs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full access to all 7 PDF Tools</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('pdf-workspace')}
              className="mt-8 w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-indigo-950/50 via-purple-950/20 to-slate-900 border-2 border-indigo-500/60 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-xl text-white">PDF Genius Pro</h3>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                Engineered for professionals, lawyers, researchers, and teams requiring high volume.
              </p>
              <div className="text-4xl font-extrabold text-white mb-6">
                {billingPeriod === 'yearly' ? '$9' : '$12'}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
                {billingPeriod === 'yearly' && (
                  <span className="text-[11px] text-emerald-400 block font-normal mt-0.5">
                    Billed annually ($108 / year)
                  </span>
                )}
              </div>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited PDF Operations</strong> (no monthly caps)</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>500 Gemini AI Queries</strong> per month</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High-resolution files up to <strong>100MB</strong></span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Batch multi-document processing</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Markdown & transcript exports</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority GPU worker latency & zero waiting</span>
                </li>
              </ul>
            </div>

            <button
              onClick={openUpgradeModal}
              className="mt-8 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Upgrade to Pro Plan (Test Mode)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Everything you need to know about PDF Genius features, limits, and security.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-indigo-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-850 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Final High-Converting CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900 border border-indigo-500/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-xl mx-auto">
            Ready to Supercharge Your Document Workflow?
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Join thousands of professionals using PDF Genius to merge, compress, protect, and chat with PDFs every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('pdf-workspace', 'merge')}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm shadow-xl transition-all hover:scale-105"
            >
              Start Using PDF Genius Free
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-8 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 font-bold text-sm transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
