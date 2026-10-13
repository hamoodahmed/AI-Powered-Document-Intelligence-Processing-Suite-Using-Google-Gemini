export type UserRole = 'user' | 'admin';
export type PlanTier = 'free' | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  plan: PlanTier;
  createdAt: string;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  pdfOpsLimit: number; // monthly
  aiQueriesLimit: number; // monthly
  maxFileSizeMB: number;
  features: string[];
}

export interface UsageStats {
  pdfOpsUsed: number;
  pdfOpsLimit: number;
  aiQueriesUsed: number;
  aiQueriesLimit: number;
  storageUsedMB: number;
  storageLimitMB: number;
}

export type PDFToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf-to-img'
  | 'img-to-pdf'
  | 'watermark'
  | 'protect';

export type AIToolId =
  | 'summarize'
  | 'chat'
  | 'ask'
  | 'extract';

export type ToolType = PDFToolId | AIToolId;

export interface ToolMetadata {
  id: ToolType;
  category: 'pdf' | 'ai';
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  badge?: string;
  color: string;
}

export interface ProcessingHistoryItem {
  id: string;
  toolId: ToolType;
  toolName: string;
  fileName: string;
  originalSize: number;
  resultSize?: number;
  pagesCount?: number;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  downloadBlobUrl?: string;
  downloadFileName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

export interface KeyPointsData {
  keyTakeaways: string[];
  actionItems: string[];
  importantDates: string[];
  keyMetrics: string[];
  stakeholders: string[];
}

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: 'black' | 'gray' | 'red' | 'blue' | 'purple';
}

export interface CompressOptions {
  level: 'extreme' | 'recommended' | 'low';
}

export interface SplitOptions {
  mode: 'all' | 'custom';
  pageRanges: string; // e.g. "1-2, 4"
}

export interface ProtectOptions {
  password: string;
  confirmPassword?: string;
  restrictCopy: boolean;
  restrictPrint: boolean;
}

export interface ImageToPdfOptions {
  orientation: 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'large';
}
