import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  ResumeData,
  ContactInfo,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillCategory,
  AwardItem,
  ResumeSection,
  DEFAULT_RESUME_DATA,
} from './types';

interface ResumeStore {
  // Data
  data: ResumeData;
  
  // PDF state
  pdfUrl: string | null;
  latexCode: string | null;
  isCompiling: boolean;
  compilationError: string | null;
  
  // Actions - Contact
  updateContact: (contact: Partial<ContactInfo>) => void;
  
  // Actions - Summary
  updateSummary: (summary: string) => void;
  
  // Actions - Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (experienceId: string) => void;
  updateExperienceBullet: (experienceId: string, index: number, value: string) => void;
  removeExperienceBullet: (experienceId: string, index: number) => void;
  
  // Actions - Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  addEducationCoursework: (educationId: string) => void;
  updateEducationCoursework: (educationId: string, index: number, value: string) => void;
  removeEducationCoursework: (educationId: string, index: number) => void;
  
  // Actions - Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  addProjectDescription: (projectId: string) => void;
  updateProjectDescription: (projectId: string, index: number, value: string) => void;
  removeProjectDescription: (projectId: string, index: number) => void;
  addProjectTechnology: (projectId: string, tech: string) => void;
  removeProjectTechnology: (projectId: string, index: number) => void;
  
  // Actions - Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  addSkill: (categoryId: string, skill: string) => void;
  removeSkill: (categoryId: string, index: number) => void;
  
  // Actions - Awards
  addAward: () => void;
  updateAward: (id: string, data: Partial<AwardItem>) => void;
  removeAward: (id: string) => void;
  
  // Actions - Sections
  reorderSections: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (id: string) => void;
  
  // Actions - PDF
  setPdfUrl: (url: string | null) => void;
  setLatexCode: (code: string | null) => void;
  setIsCompiling: (isCompiling: boolean) => void;
  setCompilationError: (error: string | null) => void;
  
  // Actions - Reset
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: DEFAULT_RESUME_DATA,
      pdfUrl: null,
      latexCode: null,
      isCompiling: false,
      compilationError: null,

      // Contact
      updateContact: (contact) =>
        set((state) => ({
          data: {
            ...state.data,
            contact: { ...state.data.contact, ...contact },
          },
        })),

      // Summary
      updateSummary: (summary) =>
        set((state) => ({
          data: { ...state.data, summary },
        })),

      // Experience
      addExperience: () =>
        set((state) => ({
          data: {
            ...state.data,
            experience: [
              ...state.data.experience,
              {
                id: uuidv4(),
                company: '',
                title: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                bullets: [''],
              },
            ],
          },
        })),

      updateExperience: (id, data) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((exp) =>
              exp.id === id ? { ...exp, ...data } : exp
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((exp) => exp.id !== id),
          },
        })),

      addExperienceBullet: (experienceId) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((exp) =>
              exp.id === experienceId
                ? { ...exp, bullets: [...exp.bullets, ''] }
                : exp
            ),
          },
        })),

      updateExperienceBullet: (experienceId, index, value) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((exp) =>
              exp.id === experienceId
                ? {
                    ...exp,
                    bullets: exp.bullets.map((b, i) => (i === index ? value : b)),
                  }
                : exp
            ),
          },
        })),

      removeExperienceBullet: (experienceId, index) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((exp) =>
              exp.id === experienceId
                ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== index) }
                : exp
            ),
          },
        })),

      // Education
      addEducation: () =>
        set((state) => ({
          data: {
            ...state.data,
            education: [
              ...state.data.education,
              {
                id: uuidv4(),
                school: '',
                degree: '',
                field: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: '',
                coursework: [],
              },
            ],
          },
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((edu) =>
              edu.id === id ? { ...edu, ...data } : edu
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((edu) => edu.id !== id),
          },
        })),

      addEducationCoursework: (educationId) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((edu) =>
              edu.id === educationId
                ? { ...edu, coursework: [...edu.coursework, ''] }
                : edu
            ),
          },
        })),

      updateEducationCoursework: (educationId, index, value) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((edu) =>
              edu.id === educationId
                ? {
                    ...edu,
                    coursework: edu.coursework.map((c, i) =>
                      i === index ? value : c
                    ),
                  }
                : edu
            ),
          },
        })),

      removeEducationCoursework: (educationId, index) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((edu) =>
              edu.id === educationId
                ? {
                    ...edu,
                    coursework: edu.coursework.filter((_, i) => i !== index),
                  }
                : edu
            ),
          },
        })),

      // Projects
      addProject: () =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [
              ...state.data.projects,
              {
                id: uuidv4(),
                name: '',
                technologies: [],
                startDate: '',
                endDate: '',
                description: [''],
                link: '',
              },
            ],
          },
        })),

      updateProject: (id, data) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((proj) =>
              proj.id === id ? { ...proj, ...data } : proj
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter((proj) => proj.id !== id),
          },
        })),

      addProjectDescription: (projectId) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((proj) =>
              proj.id === projectId
                ? { ...proj, description: [...proj.description, ''] }
                : proj
            ),
          },
        })),

      updateProjectDescription: (projectId, index, value) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((proj) =>
              proj.id === projectId
                ? {
                    ...proj,
                    description: proj.description.map((d, i) =>
                      i === index ? value : d
                    ),
                  }
                : proj
            ),
          },
        })),

      removeProjectDescription: (projectId, index) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((proj) =>
              proj.id === projectId
                ? {
                    ...proj,
                    description: proj.description.filter((_, i) => i !== index),
                  }
                : proj
            ),
          },
        })),

      addProjectTechnology: (projectId, tech) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((proj) =>
              proj.id === projectId
                ? { ...proj, technologies: [...proj.technologies, tech] }
                : proj
            ),
          },
        })),

      removeProjectTechnology: (projectId, index) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((proj) =>
              proj.id === projectId
                ? {
                    ...proj,
                    technologies: proj.technologies.filter((_, i) => i !== index),
                  }
                : proj
            ),
          },
        })),

      // Skills
      addSkillCategory: () =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [
              ...state.data.skills,
              {
                id: uuidv4(),
                category: '',
                skills: [],
              },
            ],
          },
        })),

      updateSkillCategory: (id, data) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map((cat) =>
              cat.id === id ? { ...cat, ...data } : cat
            ),
          },
        })),

      removeSkillCategory: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter((cat) => cat.id !== id),
          },
        })),

      addSkill: (categoryId, skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map((cat) =>
              cat.id === categoryId
                ? { ...cat, skills: [...cat.skills, skill] }
                : cat
            ),
          },
        })),

      removeSkill: (categoryId, index) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map((cat) =>
              cat.id === categoryId
                ? { ...cat, skills: cat.skills.filter((_, i) => i !== index) }
                : cat
            ),
          },
        })),

      // Awards
      addAward: () =>
        set((state) => ({
          data: {
            ...state.data,
            awards: [
              ...state.data.awards,
              {
                id: uuidv4(),
                title: '',
                issuer: '',
                date: '',
                description: '',
              },
            ],
          },
        })),

      updateAward: (id, data) =>
        set((state) => ({
          data: {
            ...state.data,
            awards: state.data.awards.map((award) =>
              award.id === id ? { ...award, ...data } : award
            ),
          },
        })),

      removeAward: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            awards: state.data.awards.filter((award) => award.id !== id),
          },
        })),

      // Sections
      reorderSections: (sections) =>
        set((state) => ({
          data: { ...state.data, sections },
        })),

      toggleSectionVisibility: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            sections: state.data.sections.map((section) =>
              section.id === id
                ? { ...section, visible: !section.visible }
                : section
            ),
          },
        })),

      // PDF state
      setPdfUrl: (url) => set({ pdfUrl: url }),
      setLatexCode: (code) => set({ latexCode: code }),
      setIsCompiling: (isCompiling) => set({ isCompiling }),
      setCompilationError: (error) => set({ compilationError: error }),

      // Reset
      resetResume: () =>
        set({
          data: DEFAULT_RESUME_DATA,
          pdfUrl: null,
          latexCode: null,
          compilationError: null,
        }),
    }),
    {
      name: 'resume-storage',
      partialize: (state) => ({ data: state.data }),
    }
  )
);
