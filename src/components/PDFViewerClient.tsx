'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { RefreshCw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerClientProps {
  pdfUrl: string;
  scale: number;
}

export function PDFViewerClient({ pdfUrl, scale }: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      className="shadow-2xl"
      loading={
        <div className="flex items-center justify-center h-96 text-zinc-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      }
    >
      {Array.from(new Array(numPages), (_, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          scale={scale}
          className="mb-4 bg-white rounded shadow-lg"
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      ))}
    </Document>
  );
}
