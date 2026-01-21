'use client';

import dynamic from 'next/dynamic';
import { ResumePreview } from '@/components/ResumePreview';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/lib/resume-store';
import { FileText, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Dynamically import SectionManager with SSR disabled to avoid hydration mismatch
// caused by @dnd-kit generating different aria-describedby IDs on server vs client
const SectionManager = dynamic(
  () => import('@/components/SectionManager').then((mod) => mod.SectionManager),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    ),
  }
);

export default function Home() {
  const { resetResume } = useResumeStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your resume? This will clear all your data.')) {
      resetResume();
      toast.success('Resume reset successfully');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-white to-violet-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg shadow-violet-500/25">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Resume Generator</h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">Create professional resumes in minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Form Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">Your Information</h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Fill in your details below. Drag sections to reorder.</p>
              </div>
            </div>
            <SectionManager />
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">Live Preview</h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Click Generate to see your resume</p>
              </div>
            </div>
            <div className="flex-1 min-h-[400px] sm:min-h-[500px]">
              <ResumePreview />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
          <p>Built with Next.js and LaTeX</p>
          <p>Your data is saved locally in your browser</p>
        </div>
      </footer>
    </div>
  );
}
