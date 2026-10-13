import { ToolMetadata } from '../types';

export const PDF_TOOLS: ToolMetadata[] = [
  {
    id: 'merge',
    category: 'pdf',
    name: 'Merge PDF',
    tagline: 'Combine multiple PDFs into one unified file',
    description: 'Merge two or more PDF documents in custom order with page count verification and instant download.',
    iconName: 'Combine',
    color: 'from-blue-500 to-indigo-600',
    badge: 'Popular',
  },
  {
    id: 'split',
    category: 'pdf',
    name: 'Split PDF',
    tagline: 'Extract specific page ranges or split into separate documents',
    description: 'Select custom page ranges (e.g., 1-3, 5) or separate every page into a standalone PDF file.',
    iconName: 'Scissors',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'compress',
    category: 'pdf',
    name: 'Compress PDF',
    tagline: 'Shrink file size while preserving high visual quality',
    description: 'Reduce PDF storage footprint with Extreme, Recommended, or Low compression options.',
    iconName: 'Minimize2',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Up to 70% Less',
  },
  {
    id: 'pdf-to-img',
    category: 'pdf',
    name: 'PDF to Image',
    tagline: 'Convert PDF pages into high-resolution PNG images',
    description: 'Render every document page into crisp, high-dpi PNG images ready for presentations and web sharing.',
    iconName: 'ImageDown',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'img-to-pdf',
    category: 'pdf',
    name: 'Image to PDF',
    tagline: 'Transform JPG, PNG, and WebP images into a single PDF',
    description: 'Convert multiple photos or graphics into a clean, paginated PDF with custom orientation and margins.',
    iconName: 'ImageUp',
    color: 'from-violet-500 to-fuchsia-600',
  },
  {
    id: 'watermark',
    category: 'pdf',
    name: 'Add Watermark',
    tagline: 'Stamp text watermarks with custom rotation & opacity',
    description: 'Protect confidential drafts or branding with custom text, angle (-45° to 45°), opacity, and colors.',
    iconName: 'Stamp',
    color: 'from-amber-500 to-orange-600',
    badge: 'Security',
  },
  {
    id: 'protect',
    category: 'pdf',
    name: 'Protect PDF',
    tagline: 'Encrypt PDF with password and permission restrictions',
    description: 'Add passphrases, restrict copying and printing, and secure sensitive personal or corporate documents.',
    iconName: 'ShieldLock',
    color: 'from-rose-500 to-pink-600',
    badge: 'AES Encrypted',
  },
];

export const AI_TOOLS: ToolMetadata[] = [
  {
    id: 'summarize',
    category: 'ai',
    name: 'AI PDF Summarizer',
    tagline: 'Generate executive summaries and bullet points in seconds',
    description: 'Condense long contracts, research papers, and reports into crisp, high-density summaries powered by Gemini 3.8 Flash.',
    iconName: 'Sparkles',
    color: 'from-purple-500 to-indigo-600',
    badge: 'Gemini 3.8 Flash',
  },
  {
    id: 'chat',
    category: 'ai',
    name: 'Chat with PDF',
    tagline: 'Have an interactive conversation with your document',
    description: 'Ask anything, explore nuance, and get verified citations grounded directly in the text of your uploaded PDF.',
    iconName: 'MessageSquareText',
    color: 'from-blue-500 to-cyan-600',
    badge: 'Interactive',
  },
  {
    id: 'ask',
    category: 'ai',
    name: 'Ask Questions from PDF',
    tagline: 'Get targeted direct answers with confidence ratings',
    description: 'Pose specific operational, legal, or financial questions and receive precise answers with quoted excerpts.',
    iconName: 'HelpCircle',
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: 'extract',
    category: 'ai',
    name: 'Extract Key Points',
    tagline: 'Structure takeaways, action items, dates, and metrics',
    description: 'Automatically categorize document information into Key Takeaways, Action Items, Dates, Numbers, and Stakeholders.',
    iconName: 'ListFilter',
    color: 'from-amber-500 to-rose-600',
    badge: 'Structured',
  },
];

export const ALL_TOOLS = [...PDF_TOOLS, ...AI_TOOLS];

export const FAQS = [
  {
    question: 'Is my document data private and secure?',
    answer: 'Yes, absolutely. We prioritize bank-grade privacy. Standard PDF operations (Merge, Split, Watermark, Compress, etc.) are executed directly inside your browser sandbox via secure WebAssembly and native APIs. For AI features, document tokens are processed ephemerally using Google Gemini with strict zero-training privacy guarantees.',
  },
  {
    question: 'What are the limits on the Free Plan?',
    answer: 'The Free Plan includes 10 PDF operations per month, 5 AI queries per month, and file sizes up to 15MB. When you need unlimited operations, batch processing, and 500 AI queries with files up to 100MB, you can easily upgrade to PDF Genius Pro.',
  },
  {
    question: 'Can I test PDF Genius without uploading my personal files?',
    answer: 'Yes! Every tool includes a "Load Sample Document" button so you can test merging, compressing, watermarking, and AI features instantly with one click.',
  },
  {
    question: 'How does Chat with PDF work?',
    answer: 'Our document engine parses the textual structure of your PDF and feeds contextual tokens to Google Gemini 3.8 Flash. You can ask follow-ups, request summaries of specific pages, analyze contract liabilities, or get step-by-step breakdowns.',
  },
  {
    question: 'How do I access the Admin Dashboard?',
    answer: 'The Admin Dashboard is protected and completely hidden from normal users. You can switch to the Admin profile from the user menu in the top right or test as Admin via the login modal using admin@pdfgenius.com.',
  },
  {
    question: 'Can I export summaries or chat history?',
    answer: 'Yes! All AI tools provide one-click buttons to copy text to clipboard, download as Markdown, or download as a generated PDF report.',
  },
];
