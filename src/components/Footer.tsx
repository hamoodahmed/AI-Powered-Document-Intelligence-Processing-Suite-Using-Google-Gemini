import React, { useState } from 'react';
import { FileText, Sparkles, Shield, Heart, Send, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { ToolType } from '../types';

interface FooterProps {
  onNavigate: (view: string, toolId?: ToolType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    showToast('success', 'Subscribed to PDF Genius Insights!', 'You will receive product updates and pro tips.');
    setEmail('');
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                PDF Genius <span className="text-indigo-400 font-medium">App</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The next-generation, privacy-focused AI document intelligence platform. Merge, split, compress, watermark, protect, and chat with PDFs at lightning speed.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Powered by Gemini</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4 max-w-sm">
              <p className="text-xs font-semibold text-slate-300 mb-2">
                Join 50,000+ power users for weekly document tips
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Join</span>
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Core PDF Tools */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase mb-4">
              PDF Utilities
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'merge')}
                  className="hover:text-white transition-colors"
                >
                  Merge PDF Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'split')}
                  className="hover:text-white transition-colors"
                >
                  Split & Extract Pages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'compress')}
                  className="hover:text-white transition-colors"
                >
                  Compress & Shrink PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'watermark')}
                  className="hover:text-white transition-colors"
                >
                  Add Custom Watermark
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'protect')}
                  className="hover:text-white transition-colors"
                >
                  Protect & Encrypt PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'img-to-pdf')}
                  className="hover:text-white transition-colors"
                >
                  Image to PDF Conversion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-workspace', 'pdf-to-img')}
                  className="hover:text-white transition-colors"
                >
                  PDF to High-Res Image
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Intelligence */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase mb-4">
              AI Superpowers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('ai-workspace', 'summarize')}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>AI PDF Summarizer</span>
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">
                    Flash
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-workspace', 'chat')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Chat with PDF Context
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-workspace', 'ask')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Targeted Q&A Answering
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-workspace', 'extract')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Extract Key Points & Dates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Processing History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors"
                >
                  Free vs Pro Comparison
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  User Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors"
                >
                  Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Privacy Policy (Zero Data Retention)</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Vercel Deploy Ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PDF Genius App. Built with precision for modern productivity.</p>
          <div className="flex items-center gap-1">
            <span>Engineered for speed, privacy, and simplicity</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};
