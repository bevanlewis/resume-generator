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
import { SectionChromeProvider } from './section-frame';

const sectionComponents: Record<SectionType, React.ComponentType> = {
  contact: ContactSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  awards: AwardsSection,
};

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
  const label = sectionLabels[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "z-50" : undefined}
    >
      <SectionChromeProvider
        hidden={!section.visible}
        controls={
          <div className="flex shrink-0 items-center self-stretch pl-1">
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
          </div>
        }
      >
        <SectionComponent />
      </SectionChromeProvider>
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
