'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useResumeStore } from '@/lib/resume-store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Copy, 
  Check,
  FileText,
  Code,
  AlertCircle,
  Play
} from 'lucide-react';

// Dynamically import react-pdf components to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@/components/PDFViewerClient').then((mod) => mod.PDFViewerClient),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 text-zinc-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    )
  }
);

export function ResumePreview() {
  const { data, pdfUrl, latexCode, isCompiling, compilationError, setPdfUrl, setLatexCode, setIsCompiling, setCompilationError } = useResumeStore();
  const [scale, setScale] = useState(1.0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const compileResume = useCallback(async () => {
    setIsCompiling(true);
    setCompilationError(null);

    try {
      // First, generate LaTeX
      const latexResponse = await fetch('/api/generate-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!latexResponse.ok) {
        throw new Error('Failed to generate LaTeX');
      }

      const { latex } = await latexResponse.json();
      setLatexCode(latex);

      // Then, compile to PDF
      const pdfResponse = await fetch('/api/compile-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex }),
      });

      if (!pdfResponse.ok) {
        const errorData = await pdfResponse.json();
        throw new Error(errorData.details || 'Failed to compile PDF');
      }

      const { pdf } = await pdfResponse.json();
      
      // Convert base64 to blob URL
      const binaryString = atob(pdf);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Revoke old URL if exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(url);
    } catch (error) {
      console.error('Compilation error:', error);
      setCompilationError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsCompiling(false);
    }
  }, [data, pdfUrl, setPdfUrl, setLatexCode, setIsCompiling, setCompilationError]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${data.contact.name || 'resume'}_resume.pdf`;
      link.click();
    }
  };

  const handleCopyLatex = async () => {
    if (latexCode) {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col gap-2 px-3 py-2 sm:py-3 bg-zinc-800 border-b border-zinc-700">
        {/* Top row: Tabs and action buttons */}
        <div className="flex items-center justify-between gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-zinc-700/50 h-8">
              <TabsTrigger value="preview" className="data-[state=active]:bg-zinc-600 text-zinc-300 data-[state=active]:text-white text-xs px-2 h-7">
                <FileText className="w-3.5 h-3.5 mr-1" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="latex" className="data-[state=active]:bg-zinc-600 text-zinc-300 data-[state=active]:text-white text-xs px-2 h-7">
                <Code className="w-3.5 h-3.5 mr-1" />
                LaTeX
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1.5">
            {activeTab === 'latex' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLatex}
                disabled={!latexCode}
                className="text-zinc-400 hover:text-white hover:bg-zinc-700 h-7 w-7"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            )}
            
            <Button
              onClick={compileResume}
              disabled={isCompiling}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2"
            >
              {isCompiling ? (
                <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 mr-1" />
              )}
              {isCompiling ? 'Wait...' : 'Generate'}
            </Button>
            
            <Button
              onClick={handleDownload}
              disabled={!pdfUrl || isCompiling}
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-7 px-2"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Bottom row: Zoom controls (only on preview tab) */}
        {activeTab === 'preview' && (
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="text-zinc-400 hover:text-white hover:bg-zinc-700 h-7 w-7"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs text-zinc-400 min-w-[40px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScale(s => Math.min(2, s + 0.1))}
              className="text-zinc-400 hover:text-white hover:bg-zinc-700 h-7 w-7"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center py-8 px-4 min-h-full">
              {isCompiling ? (
                <div className="flex flex-col items-center justify-center h-96 text-zinc-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                  <p>Compiling your resume...</p>
                </div>
              ) : compilationError ? (
                <div className="flex flex-col items-center justify-center h-96 text-red-400 max-w-md text-center">
                  <AlertCircle className="w-8 h-8 mb-4" />
                  <p className="font-medium mb-2">Compilation Error</p>
                  <p className="text-sm text-zinc-500">{compilationError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={compileResume}
                    className="mt-4 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : pdfUrl ? (
                <PDFViewer pdfUrl={pdfUrl} scale={scale} />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-zinc-400 text-center px-4">
                  <FileText className="w-12 h-12 mb-4 text-zinc-600" />
                  <p className="text-lg font-medium mb-2">Ready to Generate</p>
                  <p className="text-sm text-zinc-500 max-w-xs mb-6">
                    Fill out your information on the left, then click the Generate button to create your resume preview.
                  </p>
                  <Button
                    onClick={compileResume}
                    disabled={isCompiling || !data.contact.name}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Generate Preview
                  </Button>
                  {!data.contact.name && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Enter your name to get started
                    </p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-full">
            <pre className="p-4 text-sm text-zinc-300 font-mono whitespace-pre-wrap">
              {latexCode || '% Your LaTeX code will appear here after entering your information'}
            </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
