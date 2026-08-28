# Paper atelier UI rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every visible surface of this single-page resume generator so it reads as a quiet print-shop tool, not a generic violet-gradient SaaS mock.

**Architecture:** Keep the Zustand store, LaTeX API, and PDF compile path unchanged. Replace the visual system (tokens, fonts, shell, section chrome, preview well) and extract duplicated collapsible/entry chrome into two presentational components so seven form files stop each inventing their own colored badge. The organizing structure is a token document (paper / ink / rule / one accent) plus `SectionFrame` and `EntryBlock` wrappers; form fields stay as they are.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4 (`@theme inline`), next/font/google, existing shadcn/Radix primitives, Lucide, next-themes.

## Global Constraints

- Do not change `src/lib/resume-store.ts`, `src/lib/types.ts`, `src/lib/latex-generator.ts`, or either API route.
- Do not add routes, landing pages, onboarding, or new product features.
- Do not use Geist, Inter, Plus Jakarta Sans, or Playfair Display.
- Fonts (verbatim): Newsreader (`--font-serif`) for the wordmark and section titles, Public Sans (`--font-sans`) for UI, IBM Plex Mono (`--font-mono`) for LaTeX. Load via `next/font/google` with `display: 'swap'` and CSS variables on `<body>`.
- Radius: `--radius: 0.25rem` (4px). No `rounded-xl` / `rounded-2xl` on app chrome.
- No gradients. No colored box-shadows. No backdrop-blur glass header. No rainbow section icon tiles.
- One accent only: Prussian ink mapped to `--primary`. Generate and Download both use this. Never emerald + violet dual CTAs.
- Banned utility prefixes in `src/**/*.tsx`: `violet-`, `indigo-`, `emerald-`, `rose-`, `cyan-`, `amber-`, `yellow-` (except if a real semantic destructive red is needed, use `destructive` / `text-destructive`).
- Replace hardcoded `zinc-*` in components with semantic tokens (`background`, `foreground`, `muted-foreground`, `border`, `card`, `primary`).
- Dark mode is warm charcoal paper, not cool zinc + violet.
- Remove decorative leading icons inside Contact inputs. Remove non-functional inner `GripVertical` handles on entries (section-level drag stays).
- Drag handle and visibility toggle must be visible without hover (44px hit area, `aria-label`, keyboard).
- Respect `prefers-reduced-motion`: disable spin and collapse rotate when the user requests reduced motion.
- Copy: no "Create professional resumes in minutes". Wordmark is `Resume`. Footer is `Saved in this browser.`
- Verification is `npm run lint`, `npm run build`, the slop grep in Task 8, and a real browser pass. Do not add unit tests that assert Tailwind class strings.
- Work on a feature branch `ui-rebuild`, never commit to `main`.
- No new npm dependencies unless a task explicitly names the package.

## Current UI anatomy (do not preserve)

Single client page `src/app/page.tsx` with sticky glass header, two-column grid (form + sticky preview), and a footer. `SectionManager` wraps seven form sections in `@dnd-kit` sortable cards. Each section copies the same Collapsible + colored icon tile. `ResumePreview` is a dark zinc "IDE" with emerald Generate and violet Download. Tokens in `globals.css` are default shadcn zinc; the page ignores them and hardcodes `zinc-*` / rainbow utilities.

## Design choice (locked)

Two directions were compared.

1. Rejected: Plus Jakarta Sans + slate + `#2563EB` (the ui-ux-pro-max default). That is still generic SaaS.
2. Rejected: Swiss brutalist (0 radius, Playfair, instant inversion). Costume, and Playfair + Inter is another generator tell. Too harsh for dense forms.
3. Chosen: E-ink / paper atelier. Warm paper field, ink type, hairline rules, Newsreader wordmark, Public Sans UI, IBM Plex Mono for source. Preview is a sheet on a desk, not a terminal.

---

### Task 1: Paper tokens and fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/ui/card.tsx` (radius only)

**Interfaces:**
- Consumes: nothing
- Produces: CSS variables `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--font-sans`, `--font-serif`, `--font-mono`; Tailwind utilities `font-sans`, `font-serif`, `font-mono`, `bg-background`, `text-foreground`, `bg-card`, `bg-primary`

- [ ] **Step 1: Confirm the current fonts and radius are the slop defaults**

Run: `rg -n "Geist|--radius: 0.625rem|from-zinc-50" src/app`

Expected: matches in `layout.tsx` (Geist) and `globals.css` (`--radius: 0.625rem`) and `page.tsx` (gradient). This is the failing baseline.

- [ ] **Step 2: Replace `src/app/layout.tsx` with Newsreader, Public Sans, and IBM Plex Mono**

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume",
  description: "Write a resume and export a LaTeX PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} ${newsreader.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Replace `src/app/globals.css` with paper tokens**

Keep the Tailwind and tw-animate imports and `@custom-variant dark`. Replace `@theme inline`, `:root`, `.dark`, `@layer base`, and all custom CSS below with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

:root {
  --radius: 0.25rem;
  --background: oklch(0.965 0.012 90);
  --foreground: oklch(0.22 0.02 55);
  --card: oklch(0.985 0.008 90);
  --card-foreground: oklch(0.22 0.02 55);
  --popover: oklch(0.985 0.008 90);
  --popover-foreground: oklch(0.22 0.02 55);
  --primary: oklch(0.38 0.055 245);
  --primary-foreground: oklch(0.98 0.01 90);
  --secondary: oklch(0.94 0.01 90);
  --secondary-foreground: oklch(0.22 0.02 55);
  --muted: oklch(0.94 0.01 90);
  --muted-foreground: oklch(0.48 0.02 55);
  --accent: oklch(0.94 0.01 90);
  --accent-foreground: oklch(0.22 0.02 55);
  --destructive: oklch(0.5 0.18 25);
  --border: oklch(0.86 0.015 80);
  --input: oklch(0.86 0.015 80);
  --ring: oklch(0.38 0.055 245);
  --chart-1: oklch(0.38 0.055 245);
  --chart-2: oklch(0.55 0.04 90);
  --chart-3: oklch(0.45 0.03 55);
  --chart-4: oklch(0.6 0.05 80);
  --chart-5: oklch(0.5 0.04 70);
  --sidebar: oklch(0.97 0.01 90);
  --sidebar-foreground: oklch(0.22 0.02 55);
  --sidebar-primary: oklch(0.38 0.055 245);
  --sidebar-primary-foreground: oklch(0.98 0.01 90);
  --sidebar-accent: oklch(0.94 0.01 90);
  --sidebar-accent-foreground: oklch(0.22 0.02 55);
  --sidebar-border: oklch(0.86 0.015 80);
  --sidebar-ring: oklch(0.38 0.055 245);
}

.dark {
  --background: oklch(0.19 0.012 55);
  --foreground: oklch(0.93 0.01 85);
  --card: oklch(0.23 0.012 55);
  --card-foreground: oklch(0.93 0.01 85);
  --popover: oklch(0.23 0.012 55);
  --popover-foreground: oklch(0.93 0.01 85);
  --primary: oklch(0.72 0.05 245);
  --primary-foreground: oklch(0.18 0.02 55);
  --secondary: oklch(0.27 0.012 55);
  --secondary-foreground: oklch(0.93 0.01 85);
  --muted: oklch(0.27 0.012 55);
  --muted-foreground: oklch(0.72 0.015 80);
  --accent: oklch(0.27 0.012 55);
  --accent-foreground: oklch(0.93 0.01 85);
  --destructive: oklch(0.7 0.16 25);
  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 14%);
  --ring: oklch(0.72 0.05 245);
  --chart-1: oklch(0.72 0.05 245);
  --chart-2: oklch(0.7 0.04 90);
  --chart-3: oklch(0.65 0.03 55);
  --chart-4: oklch(0.6 0.04 80);
  --chart-5: oklch(0.68 0.04 70);
  --sidebar: oklch(0.23 0.012 55);
  --sidebar-foreground: oklch(0.93 0.01 85);
  --sidebar-primary: oklch(0.72 0.05 245);
  --sidebar-primary-foreground: oklch(0.18 0.02 55);
  --sidebar-accent: oklch(0.27 0.012 55);
  --sidebar-accent-foreground: oklch(0.93 0.01 85);
  --sidebar-border: oklch(1 0 0 / 12%);
  --sidebar-ring: oklch(0.72 0.05 245);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

.react-pdf__Page {
  margin-bottom: 1rem;
}

.react-pdf__Page__canvas {
  border-radius: 2px;
  box-shadow: 0 1px 0 var(--border), 0 12px 32px oklch(0.22 0.02 55 / 0.12);
}

.sortable-ghost {
  opacity: 0.4;
}
```

Delete the invalid `input:focus { ring: 2px; ... }` block. Inputs already use `focus-visible:ring` from the Input component.

- [ ] **Step 4: Tighten Card radius**

In `src/components/ui/card.tsx`, change the Card root class from `rounded-xl` to `rounded-md` and drop `shadow-sm` (hairline border is enough):

```tsx
"bg-card text-card-foreground flex flex-col gap-6 rounded-md border py-6"
```

- [ ] **Step 5: Verify fonts compile**

Run: `npx tsc --noEmit`

Expected: PASS (no type errors). `layout.tsx` must not import Geist.

Run: `rg -n "Geist|Inter|Plus_Jakarta|Playfair" src`

Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git checkout -b ui-rebuild
git add src/app/globals.css src/app/layout.tsx src/components/ui/card.tsx
git commit -m "style: switch to paper tokens and editorial fonts"
```

---

### Task 2: SectionFrame and EntryBlock

**Files:**
- Create: `src/components/section-frame.tsx`
- Create: `src/components/entry-block.tsx`

**Interfaces:**
- Consumes: `@/components/ui/collapsible`, `@/components/ui/button`, lucide `ChevronDown` / `Trash2`
- Produces:
  - `SectionFrame({ title: string; description: string; defaultOpen?: boolean; children: React.ReactNode }): JSX.Element`
  - `EntryBlock({ label: string; onRemove: () => void; children: React.ReactNode }): JSX.Element`

- [ ] **Step 1: Create `src/components/section-frame.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SectionFrameProps = {
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SectionFrame({
  title,
  description,
  defaultOpen = true,
  children,
}: SectionFrameProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-md border border-border bg-card"
    >
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/60">
        <div>
          <h3 className="font-serif text-lg font-medium tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-4 pb-4 pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
```

- [ ] **Step 2: Create `src/components/entry-block.tsx`**

```tsx
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type EntryBlockProps = {
  label: string;
  onRemove: () => void;
  children: React.ReactNode;
};

export function EntryBlock({ label, onRemove, children }: EntryBlockProps) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="size-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Remove ${label}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/section-frame.tsx src/components/entry-block.tsx
git commit -m "feat: add shared section and entry chrome"
```

---

### Task 3: App shell

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/theme-toggle.tsx`

**Interfaces:**
- Consumes: `ThemeToggle`, `SectionManager`, `ResumePreview`, `useResumeStore`
- Produces: quiet header (serif wordmark `Resume`, no gradient tile, no tagline), two-column workspace, footer `Saved in this browser.`

- [ ] **Step 1: Replace `src/components/theme-toggle.tsx`**

Use `aria-label`, 44px target, semantic tokens. Keep the mounted guard.

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="size-11"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-11"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`

Expected: PASS

Run: `rg -n "FileText|bg-gradient|Create professional|Your Information|Live Preview" src/app/page.tsx`

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/theme-toggle.tsx
git commit -m "feat: quiet app shell without gradient chrome"
```

---

### Task 4: Form sections on SectionFrame

**Files:**
- Modify: `src/components/resume-form/ContactSection.tsx`
- Modify: `src/components/resume-form/SummarySection.tsx`
- Modify: `src/components/resume-form/ExperienceSection.tsx`
- Modify: `src/components/resume-form/EducationSection.tsx`
- Modify: `src/components/resume-form/ProjectsSection.tsx`
- Modify: `src/components/resume-form/SkillsSection.tsx`
- Modify: `src/components/resume-form/AwardsSection.tsx`

**Interfaces:**
- Consumes: `SectionFrame`, `EntryBlock`, existing store actions, `Input`, `Label`, `Textarea`, `Button`, `Badge`, `MonthYearPicker`
- Produces: same store writes as before; visual chrome only

**Mechanical rules for every file:**
1. Drop local `isOpen` / Collapsible / colored icon tile / `ChevronDown`.
2. Wrap children in `<SectionFrame title="..." description="...">`.
3. Wrap each list entry in `<EntryBlock label="..." onRemove={...}>`. Remove inner `GripVertical`.
4. Labels: `className` omitted or `className="text-sm"` only. No `text-zinc-*`.
5. Add buttons: `className="h-11 w-full border-dashed"` with no color hover utilities.
6. Badges: `variant="secondary"` with no `bg-rose-100` / `bg-amber-100` / `bg-cyan-100`.
7. Delete buttons inside entries: `EntryBlock` owns them. Do not duplicate a second trash in the entry header.
8. Chip remove buttons: `aria-label={`Remove ${item}`}` and `className="ml-1 text-muted-foreground hover:text-foreground"`.

- [ ] **Step 1: Rewrite `ContactSection.tsx`**

```tsx
"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionFrame } from "@/components/section-frame";

export function ContactSection() {
  const { data, updateContact } = useResumeStore();
  const { contact } = data;

  return (
    <SectionFrame
      title="Contact"
      description="Name, location, and links printed at the top of the page."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={contact.name}
            onChange={(e) => updateContact({ name: e.target.value })}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              placeholder="ada@example.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              placeholder="(123) 456-7890"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={contact.location}
            onChange={(e) => updateContact({ location: e.target.value })}
            placeholder="London"
            autoComplete="address-level2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={contact.linkedin}
              onChange={(e) => updateContact({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/ada"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={contact.github}
              onChange={(e) => updateContact({ github: e.target.value })}
              placeholder="github.com/ada"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio">Website</Label>
          <Input
            id="portfolio"
            value={contact.portfolio}
            onChange={(e) => updateContact({ portfolio: e.target.value })}
            placeholder="ada.dev"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 2: Rewrite `SummarySection.tsx`**

```tsx
"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionFrame } from "@/components/section-frame";

export function SummarySection() {
  const { data, updateSummary } = useResumeStore();

  return (
    <SectionFrame
      title="Summary"
      description="Two or three sentences. Skip it if the rest of the page already says this."
    >
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="What you do, where you've done it, what you want next."
          className="min-h-[120px] resize-y"
        />
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 3: Rewrite `ExperienceSection.tsx`**

Keep every store call (`addExperience`, `updateExperience`, `removeExperience`, bullet helpers) and every field (`company`, `title`, `location`, `startDate`, `endDate`/`current`, `bullets`). Wrap the map in `EntryBlock`. Full file:

```tsx
"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { SectionFrame } from "@/components/section-frame";
import { EntryBlock } from "@/components/entry-block";
import { Plus, Trash2 } from "lucide-react";

export function ExperienceSection() {
  const {
    data,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
  } = useResumeStore();

  const description =
    data.experience.length === 0
      ? "Roles, newest first."
      : `${data.experience.length} role${data.experience.length === 1 ? "" : "s"}`;

  return (
    <SectionFrame title="Experience" description={description}>
      <div className="space-y-4">
        {data.experience.map((exp, index) => (
          <EntryBlock
            key={exp.id}
            label={`Role ${index + 1}`}
            onRemove={() => removeExperience(exp.id)}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`exp-company-${exp.id}`}>Company</Label>
                <Input
                  id={`exp-company-${exp.id}`}
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                  placeholder="Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`exp-title-${exp.id}`}>Title</Label>
                <Input
                  id={`exp-title-${exp.id}`}
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(exp.id, { title: e.target.value })
                  }
                  placeholder="Software engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                <Input
                  id={`exp-location-${exp.id}`}
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label>Start</Label>
                <MonthYearPicker
                  value={exp.startDate}
                  onChange={(value) =>
                    updateExperience(exp.id, { startDate: value })
                  }
                  placeholder="Start"
                />
              </div>
              <div className="space-y-2">
                <Label>End</Label>
                <MonthYearPicker
                  value={exp.current ? "Present" : exp.endDate}
                  onChange={(value) =>
                    updateExperience(exp.id, {
                      endDate: value,
                      current: value.toLowerCase() === "present",
                    })
                  }
                  placeholder="End"
                  allowPresent
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Highlights</Label>
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <span className="mt-2.5 text-muted-foreground" aria-hidden="true">
                    •
                  </span>
                  <Textarea
                    value={bullet}
                    onChange={(e) =>
                      updateExperienceBullet(exp.id, bulletIndex, e.target.value)
                    }
                    placeholder="What you shipped, with a number if you have one."
                    className="min-h-[60px] flex-1 resize-y"
                    aria-label={`Highlight ${bulletIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperienceBullet(exp.id, bulletIndex)}
                    className="mt-1 size-11 text-muted-foreground hover:text-destructive"
                    disabled={exp.bullets.length <= 1}
                    aria-label={`Remove highlight ${bulletIndex + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addExperienceBullet(exp.id)}
                className="mt-2 h-11"
              >
                <Plus className="size-4" />
                Add highlight
              </Button>
            </div>
          </EntryBlock>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="h-11 w-full border-dashed"
        >
          <Plus className="size-4" />
          Add role
        </Button>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 4: Rewrite `EducationSection.tsx`**

Same store API as the current file, including `handleAddCoursework`. Wrap with `SectionFrame` title `Education`. Each school is `EntryBlock` label `School ${index + 1}`. Coursework chips use `variant="secondary"` and `aria-label={`Remove ${course}`}`. Add button: `Add school`, `className="h-11 w-full border-dashed"`. Keep `addEducationCoursework` + `setTimeout` + `updateEducationCoursework` exactly as today (do not "fix" that flow in this task).

Field ids: `edu-school-${id}`, `edu-degree-${id}`, `edu-field-${id}`, `edu-location-${id}`, `edu-gpa-${id}`.

- [ ] **Step 5: Rewrite `ProjectsSection.tsx`**

`SectionFrame` title `Projects`. `EntryBlock` label `Project ${index + 1}`. Tech chips `variant="secondary"`. Add button `Add project`. Preserve `handleAddTech` and all project store actions.

- [ ] **Step 6: Rewrite `SkillsSection.tsx`**

`SectionFrame` title `Skills`. `EntryBlock` label `Group ${index + 1}`. Skill chips `variant="secondary"`. Add button `Add skill group`. Preserve `handleAddSkill`.

- [ ] **Step 7: Rewrite `AwardsSection.tsx`**

`SectionFrame` title `Awards`. `EntryBlock` label `Award ${index + 1}`. Add button `Add award`. Preserve `addAward` / `updateAward` / `removeAward`.

- [ ] **Step 8: Slop grep on form files**

Run:

```bash
rg -n "zinc-|violet-|indigo-|emerald-|rose-|cyan-|amber-|yellow-|Collapsible|GripVertical|bg-blue-100|FileText|Briefcase|GraduationCap|FolderGit2|Wrench|Award" src/components/resume-form
```

Expected: no matches. Lucide section-header icons are gone. `Plus` / `Trash2` / `X` may remain (they are controls, not rainbow tiles). If `X` or `Plus`/`Trash2` match this pattern they are fine; the color prefixes must be zero.

Run: `npx tsc --noEmit`

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/resume-form
git commit -m "feat: restyle form sections with shared paper chrome"
```

---

### Task 5: Section reorder chrome

**Files:**
- Modify: `src/components/SectionManager.tsx`

**Interfaces:**
- Consumes: `@dnd-kit` sensors and `SortableSection` as today; `toggleSectionVisibility`; `sectionComponents` map
- Produces: always-visible drag handle and visibility toggle (not hover-only), `aria-label`s, semantic tokens, hidden-in-PDF badge using `muted` not `zinc`

- [ ] **Step 1: Replace `SortableSection` chrome in `src/components/SectionManager.tsx`**

Keep `sectionComponents`, `sectionLabels`, sensors, `handleDragEnd`, and `DndContext` logic identical. Replace `SortableSection` with a control row *above* the card (never overlapping the title). Always visible. No `opacity-0 group-hover:opacity-100`.

```tsx
function SortableSection({ section, onToggleVisibility }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const SectionComponent = sectionComponents[section.type];
  const label = sectionLabels[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "z-50" : undefined}
    >
      <div className="mb-2 flex items-center gap-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex size-11 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Reorder ${label} section`}
        >
          <GripVertical className="size-4" />
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 text-muted-foreground hover:text-foreground"
          onClick={() => onToggleVisibility(section.id)}
          aria-label={
            section.visible
              ? `Hide ${label} from PDF`
              : `Show ${label} in PDF`
          }
        >
          {section.visible ? (
            <Eye className="size-4" />
          ) : (
            <EyeOff className="size-4" />
          )}
        </Button>
        {!section.visible && (
          <span className="ml-auto font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Hidden in PDF
          </span>
        )}
      </div>
      <div className={!section.visible ? "opacity-50" : undefined}>
        <SectionComponent />
      </div>
    </div>
  );
}
```

List spacing: `className="space-y-6"` instead of `space-y-4`.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`

Expected: PASS

Run: `rg -n "opacity-0 group-hover|zinc-|violet-|ring-violet" src/components/SectionManager.tsx`

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionManager.tsx
git commit -m "fix: keep section drag and visibility controls always visible"
```

---

### Task 6: Paper preview well

**Files:**
- Modify: `src/components/ResumePreview.tsx`
- Modify: `src/components/PDFViewerClient.tsx`

**Interfaces:**
- Consumes: existing `compileResume` fetch sequence, store PDF/LaTeX fields
- Produces: light paper well; tabs Preview / Source; primary Generate; outline Download; zoom controls; empty/error/loading copy without "Ready to Generate"

- [ ] **Step 1: Replace `src/components/ResumePreview.tsx` chrome**

Keep the `compileResume`, `handleDownload`, and `handleCopyLatex` functions exactly (same fetch URLs and blob URL logic). Replace the returned JSX:

```tsx
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-muted/40">
      <div className="flex flex-col gap-2 border-b border-border bg-card px-3 py-2">
        <div className="flex items-center justify-between gap-2">
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

          <div className="flex items-center gap-1.5">
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
```

Remove unused `FileText` and `Code` imports.

- [ ] **Step 2: Restyle `PDFViewerClient.tsx` loading state**

Replace `text-zinc-400` and `shadow-2xl` / `rounded shadow-lg`:

```tsx
loading={
  <div className="flex h-96 items-center justify-center text-muted-foreground">
    <RefreshCw className="size-5 animate-spin" />
    <span className="sr-only">Loading PDF</span>
  </div>
}
```

On `Document`, drop `className="shadow-2xl"`. On `Page`, use `className="mb-4 bg-card"`.

- [ ] **Step 3: Typecheck and slop grep**

Run: `npx tsc --noEmit`

Expected: PASS

Run: `rg -n "zinc-|violet-|emerald-|bg-zinc-900|Ready to Generate|FileText" src/components/ResumePreview.tsx src/components/PDFViewerClient.tsx`

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/components/ResumePreview.tsx src/components/PDFViewerClient.tsx
git commit -m "feat: restyle PDF preview as a paper well"
```

---

### Task 7: Date picker and leftover utilities

**Files:**
- Modify: `src/components/ui/month-year-picker.tsx`

**Interfaces:**
- Consumes: existing `MonthYearPickerProps` (`value`, `onChange`, `placeholder?`, `allowPresent?`, `className?`)
- Produces: same date strings (`Mon YYYY` or `Present`); selected month uses `variant="default"` (primary token) not `bg-violet-600`; Present uses outline/default not emerald

- [ ] **Step 1: Replace color utilities in `month-year-picker.tsx`**

Trigger calendar icon: `text-muted-foreground`.

Year header border: `border-b border-border`.

Year `<select>`: `text-sm font-medium bg-transparent border-none text-foreground`.

Selected month button: remove the `isSelected && 'bg-violet-600 ...'` override. Use `variant={isSelected ? 'default' : 'ghost'}` only.

Present button: remove `bg-emerald-600`. Use `variant={isPresent ? 'default' : 'outline'}`.

Trigger button: add `h-11` so it matches other inputs (44px).

Add `aria-label={value || placeholder}` on the trigger.

- [ ] **Step 2: Repo-wide slop grep**

Run:

```bash
rg -n "violet-|indigo-|emerald-|rose-|cyan-|amber-|yellow-|bg-gradient|from-zinc-50|shadow-violet|Geist|Create professional" src
```

Expected: no matches.

Run:

```bash
rg -n "text-zinc-|bg-zinc-|border-zinc-" src
```

Expected: no matches. If any remain in `globals.css` comments, delete them. Scrollbar colors must use `var(--border)`.

Run: `npx tsc --noEmit && npm run lint`

Expected: PASS (or only pre-existing lint that this task did not introduce).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/month-year-picker.tsx src
git commit -m "style: restyle date picker and purge leftover slop colors"
```

---

### Task 8: Browser verification

**Files:** none required unless a bug is found (then fix in place and amend only if the last commit is yours, unpushed, and the hook did not reject; otherwise a new fix commit).

**Interfaces:** none

- [ ] **Step 1: Start the app**

Run: `npm run dev`

Expected: Next.js ready on `http://localhost:3000` (or the printed port).

- [ ] **Step 2: Desktop pass (1280×800)**

Open `/`. Confirm:

1. Wordmark is serif `Resume`. No gradient square logo. No subtitle.
2. Background is warm paper, not a violet wash.
3. Section titles are serif, no colored icon tiles.
4. Drag handle and hide-from-PDF are visible without hovering.
5. Contact fields have no inset icons.
6. Theme toggle switches light and dark; dark is warm, not purple.
7. Sample and Clear still confirm and mutate the form.
8. Generate (needs a running compile API) either produces a PDF in a light well or shows the empty/error state in the new copy. If compile fails for env reasons, the empty and error layouts must still look correct (trigger error by generating with the network blocked, or read the empty state first).
9. Focus rings are visible on Tab through header buttons and the first Contact field.
10. Source tab shows mono LaTeX placeholder or code.

- [ ] **Step 3: Mobile pass (375×812)**

No horizontal scroll. Header actions remain tappable (44px). Form stacks above preview. Section controls are not covering titles.

- [ ] **Step 4: Reduced motion**

Emulate `prefers-reduced-motion: reduce`. Collapse chevrons and spinners must not run long animations (globals.css rule).

- [ ] **Step 5: Build**

Run: `npm run build`

Expected: successful Next.js build.

- [ ] **Step 6: If verification found a visual bug, fix and commit**

```bash
git add -u
git commit -m "fix: address UI verification findings"
```

If nothing to fix, skip this commit.

---

## Spec coverage

| Requirement | Task |
|---|---|
| Paper tokens, 4px radius, one Prussian primary | 1 |
| Newsreader / Public Sans / IBM Plex Mono | 1 |
| Shared section + entry chrome (DRY) | 2 |
| Quiet shell, copy, no gradient header | 3 |
| All seven form sections restyled | 4 |
| Always-visible drag/visibility, a11y labels | 5 |
| Preview as paper well, single CTA color | 6 |
| Date picker + leftover zinc/rainbow purge | 7 |
| Browser + build verification | 8 |
| Store/API untouched | Global constraint |
| Dark mode warm charcoal | 1, 3, 8 |
| Reduced motion | 1, 8 |
| Touch targets 44px on chrome controls | 3, 5, 6, 7 |

## Placeholder scan

No TBD, no "handle edge cases later", no "similar to Task N" without the transformation rules and per-file titles.

## Type consistency

`SectionFrame` and `EntryBlock` signatures in Task 2 match every call in Task 4. Store method names in Task 4 match the current files (`updateExperience`, `addExperienceBullet`, `handleAddCoursework` timeout path, etc.).
