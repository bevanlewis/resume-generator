'use client';

import { useResumeStore } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, GraduationCap, Plus, Trash2, GripVertical, X } from 'lucide-react';
import { useState } from 'react';

export function EducationSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [courseworkInput, setCourseworkInput] = useState<{ [key: string]: string }>({});
  const { 
    data, 
    addEducation, 
    updateEducation, 
    removeEducation,
    addEducationCoursework,
    removeEducationCoursework
  } = useResumeStore();

  const handleAddCoursework = (educationId: string) => {
    const input = courseworkInput[educationId]?.trim();
    if (input) {
      addEducationCoursework(educationId);
      const edu = data.education.find(e => e.id === educationId);
      if (edu) {
        const newIndex = edu.coursework.length;
        setTimeout(() => {
          useResumeStore.getState().updateEducationCoursework(educationId, newIndex, input);
        }, 0);
      }
      setCourseworkInput(prev => ({ ...prev, [educationId]: '' }));
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Education</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {data.education.length === 0 
                ? 'Add your educational background' 
                : `${data.education.length} degree${data.education.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          {data.education.map((edu, index) => (
            <Card key={edu.id} className="border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-zinc-300 mt-1 cursor-grab" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-500">Education {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* School & Degree */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          School / University
                        </Label>
                        <Input
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                          placeholder="Stanford University"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Degree
                        </Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>

                    {/* Field of Study & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Field of Study
                        </Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Location
                        </Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                          placeholder="Stanford, CA"
                        />
                      </div>
                    </div>

                    {/* Dates & GPA */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Start Date
                        </Label>
                        <MonthYearPicker
                          value={edu.startDate}
                          onChange={(value) => updateEducation(edu.id, { startDate: value })}
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          End Date
                        </Label>
                        <MonthYearPicker
                          value={edu.endDate}
                          onChange={(value) => updateEducation(edu.id, { endDate: value })}
                          placeholder="Select end date"
                          allowPresent
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          GPA (Optional)
                        </Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>

                    {/* Relevant Coursework */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Relevant Coursework (Optional)
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {edu.coursework.map((course, courseIndex) => (
                          <Badge 
                            key={courseIndex} 
                            variant="secondary"
                            className="flex items-center gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200"
                          >
                            {course}
                            <button
                              onClick={() => removeEducationCoursework(edu.id, courseIndex)}
                              className="ml-1 hover:text-amber-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={courseworkInput[edu.id] || ''}
                          onChange={(e) => setCourseworkInput(prev => ({ ...prev, [edu.id]: e.target.value }))}
                          placeholder="Add a course..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCoursework(edu.id);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddCoursework(edu.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addEducation}
            className="w-full border-dashed border-2 hover:border-amber-300 hover:bg-amber-50/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
