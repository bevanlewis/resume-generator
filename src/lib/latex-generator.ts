import { ResumeData, SectionType } from './types';

// Escape special LaTeX characters
function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

// Generate the LaTeX preamble (packages and custom commands)
function generatePreamble(): string {
  return `%-------------------------
% Resume in LaTeX
% Based on Jake's Resume template
% License: MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generated PDF is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
`;
}

// Generate the contact/header section
function generateContact(data: ResumeData): string {
  const { contact } = data;
  if (!contact.name) return '';

  const parts: string[] = [];
  
  if (contact.phone) parts.push(escapeLatex(contact.phone));
  if (contact.email) parts.push(`\\href{mailto:${contact.email}}{\\underline{${escapeLatex(contact.email)}}}`);
  if (contact.linkedin) {
    const linkedinUrl = contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`;
    const linkedinDisplay = contact.linkedin.replace(/^https?:\/\//, '');
    parts.push(`\\href{${linkedinUrl}}{\\underline{${escapeLatex(linkedinDisplay)}}}`);
  }
  if (contact.github) {
    const githubUrl = contact.github.startsWith('http') ? contact.github : `https://${contact.github}`;
    const githubDisplay = contact.github.replace(/^https?:\/\//, '');
    parts.push(`\\href{${githubUrl}}{\\underline{${escapeLatex(githubDisplay)}}}`);
  }
  if (contact.portfolio) {
    const portfolioUrl = contact.portfolio.startsWith('http') ? contact.portfolio : `https://${contact.portfolio}`;
    const portfolioDisplay = contact.portfolio.replace(/^https?:\/\//, '');
    parts.push(`\\href{${portfolioUrl}}{\\underline{${escapeLatex(portfolioDisplay)}}}`);
  }
  if (contact.location) parts.push(escapeLatex(contact.location));

  return `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(contact.name)}} \\\\ \\vspace{1pt}
    \\small ${parts.join(' $|$ ')}
\\end{center}

`;
}

// Generate the summary section
function generateSummary(data: ResumeData): string {
  if (!data.summary) return '';

  return `%-----------SUMMARY-----------
\\section{Summary}
  ${escapeLatex(data.summary)}

`;
}

// Generate the education section
function generateEducation(data: ResumeData): string {
  if (data.education.length === 0) return '';

  let latex = `%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
`;

  for (const edu of data.education) {
    const degree = edu.degree && edu.field 
      ? `${edu.degree} in ${edu.field}` 
      : edu.degree || edu.field || '';
    
    const dateRange = edu.startDate || edu.endDate 
      ? `${edu.startDate || ''} -- ${edu.endDate || 'Present'}` 
      : '';

    let details = '';
    if (edu.gpa) {
      details += `GPA: ${escapeLatex(edu.gpa)}`;
    }
    if (edu.coursework.length > 0) {
      const courseworkStr = edu.coursework.filter(c => c.trim()).map(escapeLatex).join(', ');
      if (courseworkStr) {
        if (details) details += ' | ';
        details += `Coursework: ${courseworkStr}`;
      }
    }

    latex += `    \\resumeSubheading
      {${escapeLatex(edu.school)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(degree)}}{${escapeLatex(dateRange)}}
`;
    
    if (details) {
      latex += `      \\resumeItemListStart
        \\resumeItem{${details}}
      \\resumeItemListEnd
`;
    }
  }

  latex += `  \\resumeSubHeadingListEnd

`;

  return latex;
}

// Generate the experience section
function generateExperience(data: ResumeData): string {
  if (data.experience.length === 0) return '';

  let latex = `%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
`;

  for (const exp of data.experience) {
    const dateRange = exp.startDate || exp.endDate || exp.current
      ? `${exp.startDate || ''} -- ${exp.current ? 'Present' : exp.endDate || ''}` 
      : '';

    latex += `
    \\resumeSubheading
      {${escapeLatex(exp.title)}}{${escapeLatex(dateRange)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
`;

    const bullets = exp.bullets.filter(b => b.trim());
    if (bullets.length > 0) {
      latex += `      \\resumeItemListStart
`;
      for (const bullet of bullets) {
        latex += `        \\resumeItem{${escapeLatex(bullet)}}
`;
      }
      latex += `      \\resumeItemListEnd
`;
    }
  }

  latex += `
  \\resumeSubHeadingListEnd

`;

  return latex;
}

// Generate the projects section
function generateProjects(data: ResumeData): string {
  if (data.projects.length === 0) return '';

  let latex = `%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
`;

  for (const project of data.projects) {
    const techStr = project.technologies.length > 0 
      ? ` $|$ \\emph{${project.technologies.map(escapeLatex).join(', ')}}` 
      : '';
    
    const dateRange = project.startDate || project.endDate 
      ? `${project.startDate || ''} -- ${project.endDate || 'Present'}` 
      : '';

    latex += `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(project.name)}}${techStr}}{${escapeLatex(dateRange)}}
`;

    const descriptions = project.description.filter(d => d.trim());
    if (descriptions.length > 0) {
      latex += `          \\resumeItemListStart
`;
      for (const desc of descriptions) {
        latex += `            \\resumeItem{${escapeLatex(desc)}}
`;
      }
      latex += `          \\resumeItemListEnd
`;
    }
  }

  latex += `    \\resumeSubHeadingListEnd

`;

  return latex;
}

// Generate the skills section
function generateSkills(data: ResumeData): string {
  if (data.skills.length === 0) return '';

  let latex = `%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`;

  const skillLines: string[] = [];
  for (const category of data.skills) {
    if (category.category && category.skills.length > 0) {
      const skillsStr = category.skills.map(escapeLatex).join(', ');
      skillLines.push(`     \\textbf{${escapeLatex(category.category)}}{: ${skillsStr}}`);
    }
  }

  latex += skillLines.join(' \\\\\n');

  latex += `
    }}
 \\end{itemize}

`;

  return latex;
}

// Generate the awards section
function generateAwards(data: ResumeData): string {
  if (data.awards.length === 0) return '';

  let latex = `%-----------AWARDS-----------
\\section{Awards \\& Achievements}
  \\resumeSubHeadingListStart
`;

  for (const award of data.awards) {
    latex += `    \\resumeProjectHeading
        {\\textbf{${escapeLatex(award.title)}}${award.issuer ? ` -- ${escapeLatex(award.issuer)}` : ''}}{${escapeLatex(award.date)}}
`;
    
    if (award.description) {
      latex += `        \\resumeItemListStart
          \\resumeItem{${escapeLatex(award.description)}}
        \\resumeItemListEnd
`;
    }
  }

  latex += `  \\resumeSubHeadingListEnd

`;

  return latex;
}

// Section generators map
const sectionGenerators: Record<SectionType, (data: ResumeData) => string> = {
  contact: generateContact,
  summary: generateSummary,
  education: generateEducation,
  experience: generateExperience,
  projects: generateProjects,
  skills: generateSkills,
  awards: generateAwards,
};

// Main function to generate complete LaTeX document
export function generateLatex(data: ResumeData): string {
  let latex = generatePreamble();
  
  latex += `\\begin{document}

`;

  // Sort sections by order and generate content
  const sortedSections = [...data.sections]
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    const generator = sectionGenerators[section.type];
    if (generator) {
      latex += generator(data);
    }
  }

  latex += `%-------------------------------------------
\\end{document}`;

  return latex;
}

// Export for use in API routes
export { escapeLatex };
