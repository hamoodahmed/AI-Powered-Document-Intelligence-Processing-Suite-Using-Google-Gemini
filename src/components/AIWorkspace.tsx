import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AI_TOOLS } from '../data/toolsData';
import { AIToolId, ChatMessage, KeyPointsData } from '../types';
import { ToolIcon } from './ToolIcon';
import { extractTextFromPdf } from '../services/pdfService';
import {
  summarizeDocument,
  chatWithDocument,
  askQuestionFromPdf,
  extractKeyPoints,
} from '../services/aiService';
import {
  Sparkles,
  Upload,
  FileText,
  Send,
  Copy,
  Download,
  RotateCcw,
  Check,
  HelpCircle,
  ListFilter,
  MessageSquareText,
  Calendar,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AIWorkspaceProps {
  initialToolId?: AIToolId;
}

const SAMPLE_DOCUMENT_TEXT = `MASTER SERVICES AGREEMENT & OPERATIONAL SPECIFICATION (v4.2)
Effective Date: October 1, 2026
Parties: NovaTech Enterprise Solutions ("Provider") and Apex Digital Logistics ("Client").

1. EXECUTIVE STATEMENT & OBJECTIVES
The purpose of this agreement is to deploy modern AI document processing pipelines across Client's cloud infrastructure. Provider shall ensure zero-retention cryptographic data pipelines, sub-3-second rendering latencies, and unified audit trails.

2. SERVICE LEVEL AGREEMENTS (SLA) & PERFORMANCE METRICS
- System Availability Benchmark: 99.98% monthly uptime.
- Processing Latency: Under 2.5 seconds per 50-page document batch.
- Cost Optimization Metric: Target 42.5% reduction in administrative overhead within 90 days of onboarding.
- File Size Handling: Lossless document compression reducing storage consumption by up to 70%.

3. SECURITY & COMPLIANCE
- Provider guarantees end-to-end 256-bit encryption for all data in transit.
- Standardized digital watermarking shall be applied to all draft deliverables.
- Restricted permissions: Documents containing financial records must enforce restricted copying and printing access flags.
- Compliance Certifications: SOC 2 Type II, ISO/IEC 27001:2022, and GDPR cross-border compliance.

4. CRITICAL MILESTONES & IMPORTANT DATES
- Architecture Provisioning: Completed on October 10, 2026.
- Phase 1 Production Rollout: November 15, 2026.
- Quarterly Compliance Review: December 15, 2026 (Q4 Review).
- Annual Contract Renewal Checkpoint: September 30, 2027.

5. GOVERNANCE & STAKEHOLDERS
- Lead Administrator & Corporate Counsel: Eleanor Vance (NovaTech).
- Client Operational Sponsor: Alex Morgan (Apex Logistics).
- Engineering Oversight Committee: Chaired by Dr. Aris Thorne.`;

export const AIWorkspace: React.FC<AIWorkspaceProps> = ({ initialToolId = 'summarize' }) => {
  const { user, usage, canPerformAiQuery, recordAiQuery, openUpgradeModal } = useAuth();
  const { showToast } = useToast();

  const [activeTool, setActiveTool] = useState<AIToolId>(initialToolId);
  const [docTitle, setDocTitle] = useState('Master_Services_Agreement_v4.2.pdf');
  const [docText, setDocText] = useState(SAMPLE_DOCUMENT_TEXT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Summarizer state
  const [summaryStyle, setSummaryStyle] = useState<'executive' | 'bullets' | 'detailed'>('executive');
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [summarySource, setSummarySource] = useState<string>('gemini-3.8-flash');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Hello! I have indexed your document. Ask me anything about milestones, financial terms, security requirements, or stakeholders.',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Ask Question state
  const [askQuestionText, setAskQuestionText] = useState('');
  const [askResult, setAskResult] = useState<{ answer: string; source: string } | null>(null);

  // Key Points state
  const [keyPointsResult, setKeyPointsResult] = useState<KeyPointsData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocTitle(file.name);
      try {
        const text = await extractTextFromPdf(file);
        setDocText(text);
        showToast('success', 'Document loaded', `Indexed ${file.name} for AI analysis.`);
        // Reset results for new doc
        setSummaryResult(null);
        setAskResult(null);
        setKeyPointsResult(null);
        setChatMessages([
          {
            id: 'msg_new',
            role: 'assistant',
            content: `I've analyzed "${file.name}". What would you like to explore?`,
            timestamp: 'Just now',
          },
        ]);
      } catch (err: any) {
        showToast('error', 'Error reading document', err.message);
      }
    }
  };

  const handleLoadSample = () => {
    setDocTitle('Master_Services_Agreement_v4.2.pdf');
    setDocText(SAMPLE_DOCUMENT_TEXT);
    setSummaryResult(null);
    setAskResult(null);
    setKeyPointsResult(null);
    showToast('info', 'Sample Document Loaded', '3-page Master Services Agreement with SLAs and milestones.');
  };

  const copyToClipboard = (text: string, id: string = 'main') => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('info', 'Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Run Summarizer
  const handleGenerateSummary = async () => {
    if (!canPerformAiQuery()) {
      showToast('warning', 'AI query limit reached', 'Free plan includes 5 AI queries/month. Upgrade to Pro for 500 queries!');
      openUpgradeModal();
      return;
    }

    setIsProcessing(true);
    try {
      const res = await summarizeDocument(docText, docTitle, summaryStyle);
      setSummaryResult(res.summary);
      setSummarySource(res.source);

      recordAiQuery({
        toolId: 'summarize',
        toolName: 'AI PDF Summarizer',
        fileName: docTitle,
        originalSize: docText.length * 2,
        status: 'completed',
        downloadFileName: `${docTitle}_Summary.md`,
      });

      showToast('success', 'Summary generated!', 'Synthesized via ' + res.source);
    } catch (err: any) {
      showToast('error', 'Summarization failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Run Chat
  const handleSendChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || chatInput.trim();
    if (!query) return;

    if (!canPerformAiQuery()) {
      showToast('warning', 'AI query limit reached', 'Upgrade to Pro to chat unlimitedly with documents!');
      openUpgradeModal();
      return;
    }

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);

    try {
      const res = await chatWithDocument(docText, chatMessages, query);
      const assistantMsg: ChatMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      recordAiQuery({
        toolId: 'chat',
        toolName: 'Chat with PDF',
        fileName: docTitle,
        originalSize: docText.length * 2,
        status: 'completed',
      });
    } catch (err: any) {
      showToast('error', 'Chat reply failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Ask Question
  const handleAskQuestion = async (customQ?: string) => {
    const q = customQ || askQuestionText.trim();
    if (!q) {
      showToast('error', 'Please enter a question');
      return;
    }

    if (!canPerformAiQuery()) {
      showToast('warning', 'AI query limit reached', 'Upgrade to Pro for 500 AI queries!');
      openUpgradeModal();
      return;
    }

    setIsProcessing(true);
    try {
      const res = await askQuestionFromPdf(docText, q);
      setAskResult(res);
      recordAiQuery({
        toolId: 'ask',
        toolName: 'Ask Questions from PDF',
        fileName: docTitle,
        originalSize: docText.length * 2,
        status: 'completed',
      });
      showToast('success', 'Answer retrieved');
    } catch (err: any) {
      showToast('error', 'Question processing failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Extract Key Points
  const handleExtractKeyPoints = async () => {
    if (!canPerformAiQuery()) {
      showToast('warning', 'AI query limit reached', 'Upgrade to Pro for structured key point extraction!');
      openUpgradeModal();
      return;
    }

    setIsProcessing(true);
    try {
      const res = await extractKeyPoints(docText, docTitle);
      setKeyPointsResult(res.data);
      recordAiQuery({
        toolId: 'extract',
        toolName: 'Extract Key Points',
        fileName: docTitle,
        originalSize: docText.length * 2,
        status: 'completed',
      });
      showToast('success', 'Key points extracted into 5 categories');
    } catch (err: any) {
      showToast('error', 'Extraction failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentToolDef = AI_TOOLS.find((t) => t.id === activeTool) || AI_TOOLS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Document Intelligence
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Read, converse, extract, and dissect complex documents in seconds.
        </p>
      </div>

      {/* AI Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-800">
        {AI_TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as AIToolId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <ToolIcon name={tool.iconName} className="w-4 h-4" />
              <span>{tool.name}</span>
              {tool.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isActive ? 'bg-purple-900/80 text-purple-200' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Document Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                {docTitle}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Indexed & Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Approx. {Math.round(docText.split(' ').length)} words • ~
              {Math.max(1, Math.round(docText.length / 1500))} pages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Upload New PDF</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-purple-300 text-xs font-semibold border border-purple-500/30 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Load Sample</span>
          </button>
        </div>
      </div>

      {/* Main Feature Layout */}
      {/* 1. AI PDF Summarizer */}
      {activeTool === 'summarize' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <h3 className="font-bold text-white text-sm">Summary Style</h3>
              <div className="space-y-2">
                {[
                  {
                    id: 'executive',
                    name: 'Executive Summary',
                    desc: 'High-level business takeaways and strategic implications',
                  },
                  {
                    id: 'bullets',
                    name: 'Bullet Highlights',
                    desc: 'Key findings formatted as concise, scannable bullet points',
                  },
                  {
                    id: 'detailed',
                    name: 'Detailed Brief',
                    desc: 'Comprehensive multi-section analysis with clause breakdown',
                  },
                ].map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSummaryStyle(st.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      summaryStyle === st.id
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold text-xs text-slate-200">{st.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{st.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>{isProcessing ? 'Synthesizing Document...' : 'Generate AI Summary'}</span>
              </button>

              <div className="text-[11px] text-slate-400 flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span>AI Queries Remaining:</span>
                <span className="font-bold text-slate-200">
                  {user?.plan === 'pro'
                    ? '500 (Pro)'
                    : `${Math.max(0, usage.aiQueriesLimit - usage.aiQueriesUsed)} left`}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm text-white">Generated Summary Output</h3>
                  </div>
                  {summaryResult && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(summaryResult, 'summary')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedId === 'summary' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === 'summary' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <a
                        href={`data:text/markdown;charset=utf-8,${encodeURIComponent(summaryResult)}`}
                        download={`${docTitle}_Summary.md`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export .md</span>
                      </a>
                    </div>
                  )}
                </div>

                {isProcessing ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto animate-pulse">
                      <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Gemini 3.8 Flash is analyzing...</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Extracting core takeaways, strategic milestones, and liability vectors.
                    </p>
                  </div>
                ) : summaryResult ? (
                  <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
                    <div className="whitespace-pre-line bg-slate-950/60 p-6 rounded-2xl border border-slate-850">
                      {summaryResult}
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-white">No Summary Generated Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click the "Generate AI Summary" button on the left to extract instant insights.
                    </p>
                  </div>
                )}
              </div>

              {summaryResult && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Engine: {summarySource}</span>
                  <span>Tokens processed: ~{docText.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Chat with PDF */}
      {activeTool === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Quick Prompts sidebar (col 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm">Suggested Questions</h3>
              <p className="text-xs text-slate-400">
                Click any starter question to analyze specific aspects of this document:
              </p>
              <div className="space-y-2">
                {[
                  'What are the critical milestone dates and deadlines?',
                  'What are the performance metrics and SLAs?',
                  'Who are the designated stakeholders and administrators?',
                  'What compliance standards are guaranteed?',
                  'Summarize the cost optimization targets.',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(undefined, prompt)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2"
                  >
                    <MessageSquareText className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() =>
                    setChatMessages([
                      {
                        id: 'msg_reset',
                        role: 'assistant',
                        content: 'Chat history cleared. What would you like to know?',
                        timestamp: 'Just now',
                      },
                    ])
                  }
                  className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Conversation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Window (col 8) */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[560px]">
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] opacity-70">
                        <span>{msg.timestamp}</span>
                        {msg.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="hover:opacity-100 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-purple-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      <span>Reading document context and reasoning...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about this document..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isProcessing}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Ask Questions from PDF */}
      {activeTool === 'ask' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Targeted Question Answering</h3>
              <p className="text-xs text-slate-400">
                Ask specific questions to retrieve direct answers with quoted source excerpts and confidence scores.
              </p>
            </div>

            {/* Quick Questions Chips */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Fast Query Templates:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'What is the SLA uptime guarantee?',
                  'What is the Phase 1 rollout date?',
                  'Who is the Lead Administrator?',
                  'What are the compliance certifications?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAskQuestionText(q);
                      handleAskQuestion(q);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={askQuestionText}
                onChange={(e) => setAskQuestionText(e.target.value)}
                placeholder="Type your question (e.g. What is the penalty for SLA breach?)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleAskQuestion()}
                disabled={isProcessing}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isProcessing ? 'Searching...' : 'Get Answer'}</span>
              </button>
            </div>

            {/* Result Box */}
            {askResult && (
              <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Direct Answer</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(askResult.answer, 'ask')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Answer</span>
                  </button>
                </div>

                <div className="whitespace-pre-line text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {askResult.answer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Extract Key Points */}
      {activeTool === 'extract' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Structured Key Point Extraction</h3>
              <p className="text-xs text-slate-400">
                Automatically extracts and classifies information into 5 structured categories: Takeaways, Action Items, Dates, Metrics, and Stakeholders.
              </p>
            </div>
            <button
              onClick={handleExtractKeyPoints}
              disabled={isProcessing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <ListFilter className="w-4 h-4" />
              <span>{isProcessing ? 'Extracting Structure...' : 'Extract Key Points Now'}</span>
            </button>
          </div>

          {keyPointsResult ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Category 1: Key Takeaways */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Takeaways ({keyPointsResult.keyTakeaways.length})</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {keyPointsResult.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category 2: Action Items */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Action Items ({keyPointsResult.actionItems.length})</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {keyPointsResult.actionItems.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category 3: Dates & Milestones */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <Calendar className="w-4 h-4" />
                  <span>Critical Dates ({keyPointsResult.importantDates.length})</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {keyPointsResult.importantDates.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category 4: Metrics & Numbers */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <TrendingUp className="w-4 h-4" />
                  <span>Key Metrics ({keyPointsResult.keyMetrics.length})</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {keyPointsResult.keyMetrics.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category 5: Stakeholders */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <Users className="w-4 h-4" />
                  <span>Stakeholders & Authorities ({keyPointsResult.stakeholders.length})</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {keyPointsResult.stakeholders.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <ListFilter className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">No Key Points Extracted Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click the "Extract Key Points Now" button above to run deep entity and structure extraction on this document.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
