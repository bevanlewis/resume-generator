'use client';

import { useResumeStore } from '@/lib/resume-store';
import { SectionType, ResumeSection } from '@/lib/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ContactSection, 
  SummarySection, 
  ExperienceSection, 
  EducationSection, 
  ProjectsSection, 
  SkillsSection, 
  AwardsSection 
} from './resume-form';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from './ui/button';

// Map section types to their components
const sectionComponents: Record<SectionType, React.ComponentType> = {
  contact: ContactSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  awards: AwardsSection,
};

// Section labels for display
const sectionLabels: Record<SectionType, string> = {
  contact: 'Contact',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  awards: 'Awards',
};

interface SortableSectionProps {
  section: ResumeSection;
  onToggleVisibility: (id: string) => void;
}

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

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${isDragging ? 'z-50' : ''}`}>
      {/* Section content */}
      <div className={`transition-opacity ${!section.visible ? 'opacity-50' : ''} ${isDragging ? 'opacity-90 shadow-xl ring-2 ring-violet-500/20' : ''}`}>
        <SectionComponent />
      </div>

      {/* Floating controls - appear on hover at top-left corner inside the card */}
      <div className="absolute top-3 left-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white dark:bg-zinc-800 rounded-md shadow-md border border-zinc-200 dark:border-zinc-700 p-0.5">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-400 hover:text-zinc-700"
          onClick={() => onToggleVisibility(section.id)}
          title={section.visible ? 'Hide from PDF' : 'Show in PDF'}
        >
          {section.visible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {/* Hidden badge */}
      {!section.visible && (
        <div className="absolute top-2 right-2 text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded z-10">
          Hidden in PDF
        </div>
      )}
    </div>
  );
}

export function SectionManager() {
  const { data, reorderSections, toggleSectionVisibility } = useResumeStore();
  const { sections } = data;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
        ...section,
        order: index,
      }));

      reorderSections(newSections);
    }
  };

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedSections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sortedSections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onToggleVisibility={toggleSectionVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
