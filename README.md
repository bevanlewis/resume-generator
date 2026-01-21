# Resume Generator

A modern, user-friendly resume generator that converts form inputs into professional LaTeX-formatted PDF resumes. Built with Next.js, featuring real-time preview, drag-and-drop section reordering, and local storage persistence.

![Resume Generator](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## ✨ Features

- **Easy Form Input** - Fill out your resume details through intuitive form sections
- **Live PDF Preview** - See your resume rendered in real-time
- **LaTeX Formatting** - Professional typesetting using Jake's Resume template
- **Drag & Drop Reordering** - Customize section order with drag-and-drop
- **Section Visibility** - Show/hide sections from the final PDF
- **Dark Mode** - Toggle between light and dark themes
- **Local Storage** - Your data persists in the browser
- **Sample Data** - Start with example content based on Jake's Resume template
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand with persistence
- **PDF Rendering**: react-pdf
- **Drag & Drop**: @dnd-kit
- **LaTeX Compilation**: latex.ytotech.com API

## 🚀 Getting Started

### Prerequisites

- Node.js 20.16+ or 22.3+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resume-generator.git
cd resume-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── compile-pdf/      # PDF compilation endpoint
│   │   └── generate-latex/   # LaTeX generation endpoint
│   ├── globals.css           # Global styles & CSS variables
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main page component
├── components/
│   ├── resume-form/          # Form section components
│   │   ├── AwardsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── SummarySection.tsx
│   ├── ui/                   # shadcn/ui components
│   ├── PDFViewerClient.tsx   # Client-side PDF renderer
│   ├── ResumePreview.tsx     # Preview panel with tabs
│   ├── SectionManager.tsx    # Drag-and-drop section manager
│   ├── theme-provider.tsx    # Dark mode provider
│   └── theme-toggle.tsx      # Theme toggle button
└── lib/
    ├── latex-generator.ts    # LaTeX template & conversion
    ├── resume-store.ts       # Zustand store
    ├── types.ts              # TypeScript types & defaults
    └── utils.ts              # Utility functions
```

## 🎨 Usage

1. **Fill in your information** - Use the form sections on the left to enter your details
2. **Reorder sections** - Drag sections to change their order in the PDF
3. **Hide sections** - Click the eye icon to exclude sections from the PDF
4. **Generate preview** - Click the "Generate" button to compile your resume
5. **Download PDF** - Click "PDF" to download your resume

### Quick Actions

- **Sample** - Load example data based on Jake's Resume template
- **Clear** - Remove all data and start fresh
- **Theme Toggle** - Switch between light and dark mode

## 🔧 API Endpoints

### POST `/api/generate-latex`
Converts resume data to LaTeX format.

**Request Body:** `ResumeData` object  
**Response:** `{ latex: string }`

### POST `/api/compile-pdf`
Compiles LaTeX to PDF using external API.

**Request Body:** `{ latex: string }`  
**Response:** `{ pdf: string }` (base64 encoded)

## 📝 Credits

- Resume template based on [Jake's Resume](https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs) from Overleaf
- LaTeX compilation powered by [latex.ytotech.com](https://latex.ytotech.com)

## 📄 License

MIT License - feel free to use this project for your own resume!
