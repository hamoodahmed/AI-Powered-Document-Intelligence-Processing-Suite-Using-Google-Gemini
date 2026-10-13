import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { PDFWorkspace } from './components/PDFWorkspace';
import { AIWorkspace } from './components/AIWorkspace';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { UpgradeModal } from './components/UpgradeModal';
import { ToolType, PDFToolId, AIToolId } from './types';
import { PDF_TOOLS } from './data/toolsData';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activePdfTool, setActivePdfTool] = useState<PDFToolId>('merge');
  const [activeAiTool, setActiveAiTool] = useState<AIToolId>('summarize');

  const handleNavigate = (view: string, toolId?: ToolType) => {
    if (view === 'pricing') {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (view === 'faq') {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (toolId) {
      const isPdfTool = PDF_TOOLS.some((t) => t.id === toolId);
      if (isPdfTool) {
        setActivePdfTool(toolId as PDFToolId);
        setCurrentView('pdf-workspace');
      } else {
        setActiveAiTool(toolId as AIToolId);
        setCurrentView('ai-workspace');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentView === 'pdf-workspace' && <PDFWorkspace initialToolId={activePdfTool} />}
        {currentView === 'ai-workspace' && <AIWorkspace initialToolId={activeAiTool} />}
        {currentView === 'dashboard' && <UserDashboard onNavigate={handleNavigate} />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Persistent Global Modals */}
      <AuthModal />
      <UpgradeModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
