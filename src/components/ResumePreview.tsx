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
  AlertCircle,
  Play
} from 'lucide-react';

// Dynamically import react-pdf components to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@/components/PDFViewerClient').then((mod) => mod.PDFViewerClient),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        <RefreshCw className="size-6 animate-spin" />
        <span className="sr-only">Loading PDF</span>
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
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-muted/40">
      <div className="flex flex-col gap-2 border-b border-border bg-card px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-11">
              <TabsTrigger value="preview" className="h-9 px-3 text-sm">
                Preview
              </TabsTrigger>
              <TabsTrigger value="latex" className="h-9 px-3 text-sm">
                Source
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-1.5">
            {activeTab === "latex" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLatex}
                disabled={!latexCode}
                className="size-11"
                aria-label={copied ? "Copied" : "Copy LaTeX"}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            )}

            <Button
              onClick={compileResume}
              disabled={isCompiling}
              size="sm"
              className="h-11 px-3"
            >
              {isCompiling ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              {isCompiling ? "Generating" : "Generate"}
            </Button>

            <Button
              onClick={handleDownload}
              disabled={!pdfUrl || isCompiling}
              variant="outline"
              size="sm"
              className="h-11 px-3"
            >
              <Download className="size-4" />
              PDF
            </Button>
          </div>
        </div>

        {activeTab === "preview" && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              className="size-11"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="min-w-[3rem] text-center font-mono text-xs text-muted-foreground">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              className="size-11"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" ? (
          <ScrollArea className="h-full">
            <div className="flex min-h-full flex-col items-center px-4 py-8">
              {isCompiling ? (
                <div className="flex h-96 flex-col items-center justify-center text-muted-foreground">
                  <RefreshCw className="mb-4 size-6 animate-spin" />
                  <p>Setting type…</p>
                </div>
              ) : compilationError ? (
                <div className="flex h-96 max-w-md flex-col items-center justify-center text-center">
                  <AlertCircle className="mb-4 size-6 text-destructive" />
                  <p className="mb-2 font-medium text-foreground">Could not compile</p>
                  <p className="text-sm text-muted-foreground">{compilationError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={compileResume}
                    className="mt-4 h-11"
                  >
                    Try again
                  </Button>
                </div>
              ) : pdfUrl ? (
                <PDFViewer pdfUrl={pdfUrl} scale={scale} />
              ) : (
                <div className="flex h-96 flex-col items-center justify-center px-4 text-center">
                  <p className="mb-2 font-serif text-xl text-foreground">No PDF yet</p>
                  <p className="mb-6 max-w-xs text-sm text-muted-foreground">
                    Fill in a name, then generate. The preview stays here until you generate
                    again.
                  </p>
                  <Button
                    onClick={compileResume}
                    disabled={isCompiling || !data.contact.name}
                    className="h-11"
                  >
                    <Play className="size-4" />
                    Generate
                  </Button>
                  {!data.contact.name && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Add a name in Contact first.
                    </p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-full">
            <pre className="p-4 font-mono text-sm whitespace-pre-wrap text-foreground">
              {latexCode || "% Generate once to see the LaTeX source."}
            </pre>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
