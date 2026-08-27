"use client";

import dynamic from "next/dynamic";
import { ResumePreview } from "@/components/ResumePreview";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/lib/resume-store";
import { RotateCcw, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SectionManager = dynamic(
  () => import("@/components/SectionManager").then((mod) => mod.SectionManager),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <span className="sr-only">Loading editor</span>
      </div>
    ),
  }
);

export default function Home() {
  const { resetToSample, clearResume } = useResumeStore();

  const handleResetToSample = () => {
    if (
      window.confirm(
        "Reset to sample data? This will replace all your current data with example content."
      )
    ) {
      resetToSample();
      toast.success("Reset to sample data");
    }
  };

  const handleClear = () => {
    if (window.confirm("Clear all fields? This will remove all your data.")) {
      clearResume();
      toast.success("All fields cleared");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="/" className="font-serif text-2xl tracking-tight text-foreground">
            Resume
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={handleResetToSample}
              className="h-11 px-3"
              aria-label="Load sample resume"
            >
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Sample</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="h-11 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Clear all fields"
            >
              <Trash2 className="size-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <section aria-labelledby="editor-heading" className="flex min-w-0 flex-col">
            <div className="mb-4">
              <h2
                id="editor-heading"
                className="font-serif text-xl tracking-tight text-foreground"
              >
                Content
              </h2>
              <p className="text-sm text-muted-foreground">
                Drag sections by the handle to reorder. Hidden sections stay in the editor
                but drop out of the PDF.
              </p>
            </div>
            <SectionManager />
          </section>

          <section
            aria-labelledby="preview-heading"
            className="flex min-w-0 flex-col lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)]"
          >
            <div className="mb-4">
              <h2
                id="preview-heading"
                className="font-serif text-xl tracking-tight text-foreground"
              >
                Preview
              </h2>
              <p className="text-sm text-muted-foreground">
                Generate a PDF from the form.
              </p>
            </div>
            <div className="min-h-[400px] flex-1 sm:min-h-[500px]">
              <ResumePreview />
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto border-t border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-4 text-center text-sm text-muted-foreground sm:px-6 sm:text-left">
          <p>Saved in this browser.</p>
        </div>
      </footer>
    </div>
  );
}
