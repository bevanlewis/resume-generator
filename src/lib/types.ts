// Resume data types

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  description: string[];
  link: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
}

export type SectionType = 
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'awards';

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  awards: AwardItem[];
  sections: ResumeSection[];
}

export const DEFAULT_SECTIONS: ResumeSection[] = [
  { id: 'contact', type: 'contact', visible: true, order: 0 },
  { id: 'summary', type: 'summary', visible: true, order: 1 },
  { id: 'education', type: 'education', visible: true, order: 2 },
  { id: 'experience', type: 'experience', visible: true, order: 3 },
  { id: 'projects', type: 'projects', visible: true, order: 4 },
  { id: 'skills', type: 'skills', visible: true, order: 5 },
  { id: 'awards', type: 'awards', visible: true, order: 6 },
];

export const DEFAULT_CONTACT: ContactInfo = {
  name: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  portfolio: '',
  location: '',
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  contact: DEFAULT_CONTACT,
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  awards: [],
  sections: DEFAULT_SECTIONS,
};
