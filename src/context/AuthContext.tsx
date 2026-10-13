import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PlanTier, UsageStats, ProcessingHistoryItem } from '../types';

interface AuthContextType {
  user: User | null;
  usage: UsageStats;
  history: ProcessingHistoryItem[];
  isUpgradeModalOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  login: (email: string, name?: string, role?: 'user' | 'admin', plan?: PlanTier) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  switchUserRole: (role: 'user' | 'admin') => void;
  upgradeToPro: () => void;
  downgradeToFree: () => void;
  canPerformPdfOp: () => boolean;
  canPerformAiQuery: () => boolean;
  recordPdfOp: (item: Omit<ProcessingHistoryItem, 'id' | 'timestamp'>) => void;
  recordAiQuery: (item: Omit<ProcessingHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_001',
  name: 'Hamood Ahmed',
  email: 'hamoodahmed75a@gmail.com',
  avatar: '/hamood_avatar.jpg',
  role: 'user',
  plan: 'free',
  createdAt: '2026-10-01',
};

const INITIAL_USAGE_FREE: UsageStats = {
  pdfOpsUsed: 4,
  pdfOpsLimit: 10,
  aiQueriesUsed: 2,
  aiQueriesLimit: 5,
  storageUsedMB: 18.4,
  storageLimitMB: 100,
};

const INITIAL_USAGE_PRO: UsageStats = {
  pdfOpsUsed: 38,
  pdfOpsLimit: 1000,
  aiQueriesUsed: 84,
  aiQueriesLimit: 500,
  storageUsedMB: 142.6,
  storageLimitMB: 10000,
};

const INITIAL_HISTORY: ProcessingHistoryItem[] = [
  {
    id: 'job_01',
    toolId: 'merge',
    toolName: 'Merge PDF',
    fileName: 'Q3_Financial_Reports_Merged.pdf',
    originalSize: 8420000,
    resultSize: 8150000,
    pagesCount: 24,
    timestamp: '2026-10-12T14:32:00Z',
    status: 'completed',
    downloadFileName: 'Q3_Financial_Reports_Merged.pdf',
  },
  {
    id: 'job_02',
    toolId: 'summarize',
    toolName: 'AI PDF Summarizer',
    fileName: 'Master_Services_Agreement_v4.pdf',
    originalSize: 3200000,
    pagesCount: 18,
    timestamp: '2026-10-11T09:15:00Z',
    status: 'completed',
    downloadFileName: 'Agreement_Summary.md',
  },
  {
    id: 'job_03',
    toolId: 'compress',
    toolName: 'Compress PDF',
    fileName: 'Portfolio_Design_HighRes.pdf',
    originalSize: 18400000,
    resultSize: 6200000,
    pagesCount: 32,
    timestamp: '2026-10-10T18:44:00Z',
    status: 'completed',
    downloadFileName: 'Portfolio_Design_Optimized.pdf',
  },
  {
    id: 'job_04',
    toolId: 'watermark',
    toolName: 'Add Watermark',
    fileName: 'Confidential_Pitch_Deck.pdf',
    originalSize: 5120000,
    resultSize: 5190000,
    pagesCount: 15,
    timestamp: '2026-10-09T11:20:00Z',
    status: 'completed',
    downloadFileName: 'Confidential_Pitch_Deck_Watermarked.pdf',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pdfgenius_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'alex.morgan@workspace.io' || !parsed.avatar?.includes('hamood')) {
          return DEFAULT_USER;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_USER;
  });

  const [usage, setUsage] = useState<UsageStats>(() => {
    const saved = localStorage.getItem('pdfgenius_usage');
    return saved ? JSON.parse(saved) : INITIAL_USAGE_FREE;
  });

  const [history, setHistory] = useState<ProcessingHistoryItem[]>(() => {
    const saved = localStorage.getItem('pdfgenius_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('pdfgenius_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pdfgenius_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pdfgenius_usage', JSON.stringify(usage));
  }, [usage]);

  useEffect(() => {
    localStorage.setItem('pdfgenius_history', JSON.stringify(history));
  }, [history]);

  const login = (email: string, name?: string, role: 'user' | 'admin' = 'user', plan: PlanTier = 'free') => {
    const isAdminUser = email.toLowerCase().includes('admin');
    const isHamood = email.toLowerCase().includes('hamood');
    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      name: name || (isAdminUser ? 'Admin Eleanor' : isHamood ? 'Hamood Ahmed' : email.split('@')[0]),
      email,
      avatar: isAdminUser
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : '/hamood_avatar.jpg',
      role: role || (isAdminUser ? 'admin' : 'user'),
      plan: plan || (isAdminUser ? 'pro' : 'free'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    if (newUser.plan === 'pro') {
      setUsage(INITIAL_USAGE_PRO);
    } else {
      setUsage(INITIAL_USAGE_FREE);
    }
    setIsAuthModalOpen(false);
  };

  const signup = (email: string, name: string) => {
    login(email, name, 'user', 'free');
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setUser({
        id: 'usr_admin',
        name: 'Eleanor Vance (Admin)',
        email: 'admin@pdfgenius.com',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        plan: 'pro',
        createdAt: '2026-01-01',
      });
      setUsage(INITIAL_USAGE_PRO);
    } else {
      setUser(DEFAULT_USER);
      setUsage(INITIAL_USAGE_FREE);
    }
  };

  const upgradeToPro = () => {
    if (user) {
      setUser({ ...user, plan: 'pro' });
    }
    setUsage(INITIAL_USAGE_PRO);
    setIsUpgradeModalOpen(false);
  };

  const downgradeToFree = () => {
    if (user) {
      setUser({ ...user, plan: 'free' });
    }
    setUsage(INITIAL_USAGE_FREE);
  };

  const canPerformPdfOp = (): boolean => {
    if (!user) return true; // allow guest trials
    if (user.plan === 'pro') return true;
    return usage.pdfOpsUsed < usage.pdfOpsLimit;
  };

  const canPerformAiQuery = (): boolean => {
    if (!user) return true;
    if (user.plan === 'pro') return true;
    return usage.aiQueriesUsed < usage.aiQueriesLimit;
  };

  const recordPdfOp = (item: Omit<ProcessingHistoryItem, 'id' | 'timestamp'>) => {
    setUsage((prev) => ({
      ...prev,
      pdfOpsUsed: prev.pdfOpsUsed + 1,
      storageUsedMB: +(prev.storageUsedMB + (item.originalSize / (1024 * 1024))).toFixed(1),
    }));

    const newRecord: ProcessingHistoryItem = {
      ...item,
      id: 'job_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  const recordAiQuery = (item: Omit<ProcessingHistoryItem, 'id' | 'timestamp'>) => {
    setUsage((prev) => ({
      ...prev,
      aiQueriesUsed: prev.aiQueriesUsed + 1,
    }));

    const newRecord: ProcessingHistoryItem = {
      ...item,
      id: 'ai_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        usage,
        history,
        isUpgradeModalOpen,
        isAuthModalOpen,
        authModalMode,
        login,
        signup,
        logout,
        switchUserRole,
        upgradeToPro,
        downgradeToFree,
        canPerformPdfOp,
        canPerformAiQuery,
        recordPdfOp,
        recordAiQuery,
        clearHistory,
        openUpgradeModal,
        closeUpgradeModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
