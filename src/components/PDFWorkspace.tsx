import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PDF_TOOLS } from '../data/toolsData';
import { PDFToolId, WatermarkOptions, CompressOptions, SplitOptions, ProtectOptions, ImageToPdfOptions } from '../types';
import { ToolIcon } from './ToolIcon';
import {
  mergePdfFiles,
  splitPdfFile,
  compressPdfFile,
  addWatermarkToPdf,
  protectPdfFile,
  imagesToPdf,
  renderPdfToImagePreviews,
  createSamplePdf,
} from '../services/pdfService';
import {
  Upload,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Settings2,
  Eye,
  FileImage,
  Plus,
} from 'lucide-react';

interface PDFWorkspaceProps {
  initialToolId?: PDFToolId;
}

export const PDFWorkspace: React.FC<PDFWorkspaceProps> = ({ initialToolId = 'merge' }) => {
  const { user, usage, canPerformPdfOp, recordPdfOp, openUpgradeModal } = useAuth();
  const { showToast } = useToast();

  const [activeTool, setActiveTool] = useState<PDFToolId>(initialToolId);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Result state
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState('');
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [resultPageCount, setResultPageCount] = useState<number | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null);

  // Tool Specific Options
  const [watermarkOpts, setWatermarkOpts] = useState<WatermarkOptions>({
    text: 'CONFIDENTIAL',
    fontSize: 42,
    opacity: 0.35,
    rotation: -45,
    color: 'gray',
  });

  const [compressOpts, setCompressOpts] = useState<CompressOptions>({
    level: 'recommended',
  });

  const [splitOpts, setSplitOpts] = useState<SplitOptions>({
    mode: 'custom',
    pageRanges: '1-2',
  });

  const [protectOpts, setProtectOpts] = useState<ProtectOptions>({
    password: '',
    confirmPassword: '',
    restrictCopy: true,
    restrictPrint: false,
  });

  const [imgToPdfOpts, setImgToPdfOpts] = useState<ImageToPdfOptions>({
    orientation: 'portrait',
    margin: 'small',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialToolId) {
      setActiveTool(initialToolId);
      resetState();
    }
  }, [initialToolId]);

  const resetState = () => {
    setSelectedFiles([]);
    setResultBlobUrl(null);
    setResultFileName('');
    setResultSize(null);
    setResultPageCount(null);
    setImagePreviewUrls([]);
    setCompressionRatio(null);
    setIsProcessing(false);
  };

  const handleToolChange = (toolId: PDFToolId) => {
    setActiveTool(toolId);
    resetState();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (activeTool === 'merge' || activeTool === 'img-to-pdf') {
        setSelectedFiles((prev) => [...prev, ...filesArray]);
      } else {
        setSelectedFiles([filesArray[0]]);
      }
    }
  };

  const handleLoadSample = async () => {
    try {
      if (activeTool === 'img-to-pdf') {
        // Create sample canvas images
        const canvas1 = document.createElement('canvas');
        canvas1.width = 800;
        canvas1.height = 600;
        const ctx1 = canvas1.getContext('2d')!;
        ctx1.fillStyle = '#4f46e5';
        ctx1.fillRect(0, 0, 800, 600);
        ctx1.fillStyle = '#ffffff';
        ctx1.font = 'bold 36px sans-serif';
        ctx1.fillText('Sample Presentation Slide 1', 50, 100);
        ctx1.font = '22px sans-serif';
        ctx1.fillText('Generated for PDF Genius Image-to-PDF Testing', 50, 160);

        const blob1 = await new Promise<Blob>((res) => canvas1.toBlob((b) => res(b!), 'image/jpeg'));
        const file1 = new File([blob1], 'Slide_01.jpg', { type: 'image/jpeg' });

        const canvas2 = document.createElement('canvas');
        canvas2.width = 800;
        canvas2.height = 600;
        const ctx2 = canvas2.getContext('2d')!;
        ctx2.fillStyle = '#0f766e';
        ctx2.fillRect(0, 0, 800, 600);
        ctx2.fillStyle = '#ffffff';
        ctx2.font = 'bold 36px sans-serif';
        ctx2.fillText('Sample Presentation Slide 2', 50, 100);

        const blob2 = await new Promise<Blob>((res) => canvas2.toBlob((b) => res(b!), 'image/jpeg'));
        const file2 = new File([blob2], 'Slide_02.jpg', { type: 'image/jpeg' });

        setSelectedFiles([file1, file2]);
        showToast('info', 'Loaded 2 sample images', 'Ready to convert into a single PDF document.');
        return;
      }

      if (activeTool === 'merge') {
        const fileA = await createSamplePdf('Document_Part_A', 2);
        const fileB = await createSamplePdf('Document_Part_B', 3);
        setSelectedFiles([fileA, fileB]);
        showToast('info', 'Loaded 2 sample PDFs', 'Part A (2 pages) and Part B (3 pages) ready to merge.');
        return;
      }

      const sample = await createSamplePdf(`Sample_${activeTool.toUpperCase()}_Document`, 4);
      setSelectedFiles([sample]);
      showToast('info', 'Sample PDF loaded', '4-page demonstration document ready for processing.');
    } catch (err: any) {
      showToast('error', 'Failed to load sample', err.message);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setSelectedFiles((prev) => {
      const copy = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      showToast('error', 'Please upload a file first');
      return;
    }

    // Check usage limits for free users
    if (!canPerformPdfOp()) {
      showToast(
        'warning',
        'Monthly PDF limit reached!',
        `Free tier allows ${usage.pdfOpsLimit} operations/month. Please upgrade to Pro for unlimited use.`
      );
      openUpgradeModal();
      return;
    }

    setIsProcessing(true);
    setProgressPercent(15);
    setProcessingStep('Validating document integrity...');

    try {
      setTimeout(() => {
        setProgressPercent(45);
        setProcessingStep('Executing document transformations...');
      }, 400);

      setTimeout(() => {
        setProgressPercent(80);
        setProcessingStep('Finalizing output stream...');
      }, 800);

      const toolDef = PDF_TOOLS.find((t) => t.id === activeTool);
      const toolName = toolDef ? toolDef.name : activeTool;

      if (activeTool === 'merge') {
        if (selectedFiles.length < 2) {
          throw new Error('Please select at least 2 PDF files to merge.');
        }
        const { blob, pageCount, size } = await mergePdfFiles(selectedFiles);
        const url = URL.createObjectURL(blob);
        const outName = 'Merged_Document_PDFGenius.pdf';

        setResultBlobUrl(url);
        setResultFileName(outName);
        setResultSize(size);
        setResultPageCount(pageCount);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: outName,
          originalSize: selectedFiles.reduce((acc, f) => acc + f.size, 0),
          resultSize: size,
          pagesCount: pageCount,
          status: 'completed',
          downloadBlobUrl: url,
          downloadFileName: outName,
        });
      } else if (activeTool === 'split') {
        const { blob, pageCount, size } = await splitPdfFile(selectedFiles[0], splitOpts);
        const url = URL.createObjectURL(blob);
        const outName = `Split_${selectedFiles[0].name}`;

        setResultBlobUrl(url);
        setResultFileName(outName);
        setResultSize(size);
        setResultPageCount(pageCount);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: outName,
          originalSize: selectedFiles[0].size,
          resultSize: size,
          pagesCount: pageCount,
          status: 'completed',
          downloadBlobUrl: url,
          downloadFileName: outName,
        });
      } else if (activeTool === 'compress') {
        const { blob, originalSize, newSize, pageCount, reductionRatio } = await compressPdfFile(
          selectedFiles[0],
          compressOpts
        );
        const url = URL.createObjectURL(blob);
        const outName = `Compressed_${selectedFiles[0].name}`;

        setResultBlobUrl(url);
        setResultFileName(outName);
        setResultSize(newSize);
        setResultPageCount(pageCount);
        setCompressionRatio(reductionRatio);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: outName,
          originalSize,
          resultSize: newSize,
          pagesCount: pageCount,
          status: 'completed',
          downloadBlobUrl: url,
          downloadFileName: outName,
        });
      } else if (activeTool === 'watermark') {
        const { blob, size, pageCount } = await addWatermarkToPdf(selectedFiles[0], watermarkOpts);
        const url = URL.createObjectURL(blob);
        const outName = `Watermarked_${selectedFiles[0].name}`;

        setResultBlobUrl(url);
        setResultFileName(outName);
        setResultSize(size);
        setResultPageCount(pageCount);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: outName,
          originalSize: selectedFiles[0].size,
          resultSize: size,
          pagesCount: pageCount,
          status: 'completed',
          downloadBlobUrl: url,
          downloadFileName: outName,
        });
      } else if (activeTool === 'protect') {
        if (!protectOpts.password) {
          throw new Error('Please enter a protection password.');
        }
        const { blob, size, pageCount } = await protectPdfFile(selectedFiles[0], protectOpts);
        const url = URL.createObjectURL(blob);
        const outName = `Protected_${selectedFiles[0].name}`;

        setResultBlobUrl(url);
        setResultFileName(outName);
        setResultSize(size);
        setResultPageCount(pageCount);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: outName,
          originalSize: selectedFiles[0].size,
          resultSize: size,
          pagesCount: pageCount,
          status: 'completed',
          downloadBlobUrl: url,
          downloadFileName: outName,
        });
      } else if (activeTool === 'img-to-pdf') {
        const { blob, size, pageCount } = await imagesToPdf(selectedFiles, imgToPdfOpts);
        const url = URL.createObjectURL(blob);
        const outName = 'Images_Converted_Document.pdf';

        setResultBlobUrl(url);
        setResultFileName(outName);
        setResultSize(size);
        setResultPageCount(pageCount);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: outName,
          originalSize: selectedFiles.reduce((acc, f) => acc + f.size, 0),
          resultSize: size,
          pagesCount: pageCount,
          status: 'completed',
          downloadBlobUrl: url,
          downloadFileName: outName,
        });
      } else if (activeTool === 'pdf-to-img') {
        const { imageUrls, pageCount } = await renderPdfToImagePreviews(selectedFiles[0]);
        setImagePreviewUrls(imageUrls);
        setResultPageCount(pageCount);
        setResultFileName(`${selectedFiles[0].name.replace('.pdf', '')}_Images`);

        recordPdfOp({
          toolId: activeTool,
          toolName,
          fileName: `${selectedFiles[0].name} (Images)`,
          originalSize: selectedFiles[0].size,
          pagesCount: pageCount,
          status: 'completed',
        });
      }

      setProgressPercent(100);
      showToast('success', `${toolName} Completed!`, 'Your document is ready for download.');
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Operation failed', err.message || 'An error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const currentToolMetadata = PDF_TOOLS.find((t) => t.id === activeTool) || PDF_TOOLS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>High-Performance Client PDF Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          PDF Processing Studio
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Secure, zero-latency document transformations running directly in your browser.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-800">
        {PDF_TOOLS.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolChange(tool.id as PDFToolId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <ToolIcon name={tool.iconName} className="w-4 h-4" />
              <span>{tool.name}</span>
              {tool.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isActive ? 'bg-indigo-900/80 text-indigo-200' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Workspace Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center: Upload and Files Stage (col 7 or 8) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Tool Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <ToolIcon name={currentToolMetadata.iconName} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentToolMetadata.name}</h2>
                {currentToolMetadata.badge && (
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                    {currentToolMetadata.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentToolMetadata.description}</p>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/70 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all group relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={activeTool === 'merge' || activeTool === 'img-to-pdf'}
              accept={
                activeTool === 'img-to-pdf'
                  ? 'image/jpeg,image/png,image/webp'
                  : 'application/pdf'
              }
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:text-indigo-300 transition-all">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Click to upload or drag and drop
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              {activeTool === 'img-to-pdf'
                ? 'Select JPG, PNG, or WebP images to convert into a unified PDF'
                : activeTool === 'merge'
                ? 'Select 2 or more PDF documents to combine into a single file'
                : 'Upload your PDF document to begin processing'}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 hover:border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Load Sample {activeTool === 'img-to-pdf' ? 'Images' : 'PDF'}</span>
              </button>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Selected Files ({selectedFiles.length})
                </span>
                <button
                  onClick={resetState}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center shrink-0">
                        {file.type.includes('image') ? (
                          <FileImage className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {activeTool === 'merge' && (
                        <>
                          <button
                            onClick={() => moveFile(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveFile(idx, 'down')}
                            disabled={idx === selectedFiles.length - 1}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(activeTool === 'merge' || activeTool === 'img-to-pdf') && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add More Files</span>
                </button>
              )}
            </div>
          )}

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  {processingStep}
                </span>
                <span className="font-bold text-white">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed Result Card */}
          {resultBlobUrl && (
            <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Processing Complete!</span>
                </div>
                {compressionRatio !== null && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                    -{compressionRatio}% File Size
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                      {resultFileName}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatFileSize(resultSize)}
                      {resultPageCount ? ` • ${resultPageCount} Pages` : ''}
                    </p>
                  </div>
                </div>

                <a
                  href={resultBlobUrl}
                  download={resultFileName}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={resetState}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Process another file</span>
                </button>
              </div>
            </div>
          )}

          {/* PDF to Image Gallery Output */}
          {imagePreviewUrls.length > 0 && (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Rendered {imagePreviewUrls.length} Page Images</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-2 group"
                  >
                    <img
                      src={url}
                      alt={`Page ${i + 1}`}
                      className="w-full h-36 object-cover rounded-lg border border-slate-850"
                    />
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-slate-400 font-medium">Page {i + 1}</span>
                      <a
                        href={url}
                        download={`Page_${i + 1}_Render.png`}
                        className="p-1 rounded text-cyan-400 hover:text-cyan-300"
                        title="Download page"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tool Settings & Action Trigger (col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Tool Settings</h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {activeTool.toUpperCase()}
              </span>
            </div>

            {/* Tool specific settings forms */}
            {activeTool === 'watermark' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkOpts.text}
                    onChange={(e) => setWatermarkOpts({ ...watermarkOpts, text: e.target.value })}
                    placeholder="e.g. CONFIDENTIAL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold">Font Size</span>
                    <span className="text-slate-400">{watermarkOpts.fontSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="64"
                    value={watermarkOpts.fontSize}
                    onChange={(e) =>
                      setWatermarkOpts({ ...watermarkOpts, fontSize: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold">Opacity</span>
                    <span className="text-slate-400">{Math.round(watermarkOpts.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={watermarkOpts.opacity}
                    onChange={(e) =>
                      setWatermarkOpts({ ...watermarkOpts, opacity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Stamp Color
                  </label>
                  <div className="flex gap-2">
                    {(['gray', 'red', 'blue', 'purple', 'black'] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setWatermarkOpts({ ...watermarkOpts, color })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                          watermarkOpts.color === color
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'compress' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Compression Level
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setCompressOpts({ level: 'extreme' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      compressOpts.level === 'extreme'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold mb-0.5">
                      <span>Extreme Compression</span>
                      <span className="text-emerald-400">~68% Reduction</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Maximum size shrinkage, ideal for email attachments.
                    </p>
                  </div>

                  <div
                    onClick={() => setCompressOpts({ level: 'recommended' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      compressOpts.level === 'recommended'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold mb-0.5">
                      <span>Recommended (Balanced)</span>
                      <span className="text-indigo-400">~45% Reduction</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Preserves sharp vector text and high image clarity.
                    </p>
                  </div>

                  <div
                    onClick={() => setCompressOpts({ level: 'low' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      compressOpts.level === 'low'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold mb-0.5">
                      <span>Low Compression / High Quality</span>
                      <span className="text-slate-400">~25% Reduction</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Minimal compression, perfect for professional printing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'split' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300">
                  Splitting Strategy
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitOpts({ ...splitOpts, mode: 'custom' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      splitOpts.mode === 'custom'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Custom Page Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitOpts({ ...splitOpts, mode: 'all' })}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      splitOpts.mode === 'all'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Extract All Pages
                  </button>
                </div>

                {splitOpts.mode === 'custom' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Enter Page Ranges (e.g., 1-2, 4)
                    </label>
                    <input
                      type="text"
                      value={splitOpts.pageRanges}
                      onChange={(e) => setSplitOpts({ ...splitOpts, pageRanges: e.target.value })}
                      placeholder="e.g. 1-2, 4"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}

            {activeTool === 'protect' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Document Password
                  </label>
                  <input
                    type="password"
                    value={protectOpts.password}
                    onChange={(e) => setProtectOpts({ ...protectOpts, password: e.target.value })}
                    placeholder="Enter security passphrase"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="block text-xs font-semibold text-slate-300 mb-1">
                    Permissions & Flags
                  </span>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={protectOpts.restrictCopy}
                      onChange={(e) =>
                        setProtectOpts({ ...protectOpts, restrictCopy: e.target.checked })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>Prevent text and image copying</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={protectOpts.restrictPrint}
                      onChange={(e) =>
                        setProtectOpts({ ...protectOpts, restrictPrint: e.target.checked })
                      }
                      className="accent-indigo-500 rounded"
                    />
                    <span>Restrict high-resolution printing</span>
                  </label>
                </div>
              </div>
            )}

            {activeTool === 'img-to-pdf' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImgToPdfOpts({ ...imgToPdfOpts, orientation: 'portrait' })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        imgToPdfOpts.orientation === 'portrait'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgToPdfOpts({ ...imgToPdfOpts, orientation: 'landscape' })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        imgToPdfOpts.orientation === 'landscape'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Margins
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'small', 'large'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setImgToPdfOpts({ ...imgToPdfOpts, margin: m })}
                        className={`py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                          imgToPdfOpts.margin === m
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleProcess}
              disabled={selectedFiles.length === 0 || isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <ToolIcon name={currentToolMetadata.iconName} className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing Document...'
                  : `Execute ${currentToolMetadata.name}`}
              </span>
            </button>

            {/* Usage Counter Pill */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Monthly PDF Operations:</span>
              <span className="font-semibold text-slate-200">
                {user?.plan === 'pro'
                  ? 'Unlimited (Pro)'
                  : `${usage.pdfOpsUsed} / ${usage.pdfOpsLimit} used`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
