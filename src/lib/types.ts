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

// Sample data based on Jake's Resume template
export const SAMPLE_RESUME_DATA: ResumeData = {
  contact: {
    name: 'Jake Ryan',
    email: 'jake@su.edu',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/jake',
    github: 'github.com/jakeryan',
    portfolio: '',
    location: 'Georgetown, TX',
  },
  summary: '',
  experience: [
    {
      id: 'exp-1',
      company: 'Texas A&M University',
      title: 'Undergraduate Research Assistant',
      location: 'College Station, TX',
      startDate: 'Jun 2020',
      endDate: 'Present',
      current: true,
      bullets: [
        'Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems',
        'Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data',
        'Explored ways to visualize GitHub collaboration in a classroom setting',
      ],
    },
    {
      id: 'exp-2',
      company: 'Southwestern University',
      title: 'Information Technology Support Specialist',
      location: 'Georgetown, TX',
      startDate: 'Sep 2018',
      endDate: 'Present',
      current: true,
      bullets: [
        'Communicate with managers to set up campus computers used on researchers\' extract, extract, load, and compute environmental data',
        'Collaborate with database administrators to perform weekly database maintenance and security checks',
      ],
    },
    {
      id: 'exp-3',
      company: 'Southwestern University',
      title: 'Artificial Intelligence Research Assistant',
      location: 'Georgetown, TX',
      startDate: 'May 2019',
      endDate: 'Jul 2019',
      current: false,
      bullets: [
        'Explored methods to generate models from a combination of 2D images and 3D models',
        'Implemented machine learning algorithms to create 3D models from multiple 2D image inputs',
        'Googled a lot',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Southwestern University',
      degree: 'Bachelor of Arts',
      field: 'Computer Science, Minor in Business',
      location: 'Georgetown, TX',
      startDate: 'Aug 2018',
      endDate: 'May 2021',
      gpa: '',
      coursework: ['Data Structures', 'Artificial Intelligence', 'Algorithms', 'Database Management', 'Computer Vision'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Gitlytics',
      technologies: ['Python', 'Flask', 'React', 'PostgreSQL', 'Docker'],
      startDate: 'Jun 2020',
      endDate: 'Present',
      description: [
        'Developed a full-stack web application using Flask serving a REST API with React as the frontend',
        'Implemented GitHub OAuth to get data from user repositories',
        'Visualized GitHub data to show collaboration in classroom settings',
        'Used Celery and Redis for asynchronous tasks',
      ],
      link: 'https://github.com/jakeryan/gitlytics',
    },
    {
      id: 'proj-2',
      name: 'Simple Paintball',
      technologies: ['Spigot API', 'Java', 'Maven', 'TravisCI', 'Git'],
      startDate: 'May 2018',
      endDate: 'May 2020',
      description: [
        'Developed a Minecraft server plugin to entertain kids during free time for a non-profit organization',
        'Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review',
        'Implemented continuous delivery using TravisCI to build the bytes of the plugin upon commit',
      ],
      link: '',
    },
    {
      id: 'proj-3',
      name: 'Tiny Search Engine',
      technologies: ['C', 'Linux', 'Git'],
      startDate: 'Sep 2019',
      endDate: 'Dec 2019',
      description: [
        'Built a search engine from scratch capable of web crawling and parsing thousands of pages',
        'Utilized TF-IDF algorithm to rank search results based on query relevance',
      ],
      link: '',
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages',
      skills: ['Java', 'Python', 'C/C++', 'SQL (Postgres)', 'JavaScript', 'HTML/CSS', 'R'],
    },
    {
      id: 'skill-2',
      category: 'Frameworks',
      skills: ['React', 'Node.js', 'Flask', 'FastAPI', 'JUnit', 'WordPress', 'Material-UI', 'Celery'],
    },
    {
      id: 'skill-3',
      category: 'Developer Tools',
      skills: ['Git', 'Docker', 'TravisCI', 'Google Cloud Platform', 'VS Code', 'Visual Studio', 'Eclipse', 'PyCharm'],
    },
    {
      id: 'skill-4',
      category: 'Libraries',
      skills: ['pandas', 'NumPy', 'Matplotlib', 'TensorFlow'],
    },
  ],
  awards: [],
  sections: [
    { id: 'contact', type: 'contact', visible: true, order: 0 },
    { id: 'summary', type: 'summary', visible: false, order: 1 },
    { id: 'education', type: 'education', visible: true, order: 2 },
    { id: 'experience', type: 'experience', visible: true, order: 3 },
    { id: 'projects', type: 'projects', visible: true, order: 4 },
    { id: 'skills', type: 'skills', visible: true, order: 5 },
    { id: 'awards', type: 'awards', visible: false, order: 6 },
  ],
};
