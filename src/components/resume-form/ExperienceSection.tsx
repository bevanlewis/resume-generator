'use client';

import { useResumeStore } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Briefcase, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

export function ExperienceSection() {
  const [isOpen, setIsOpen] = useState(true);
  const { 
    data, 
    addExperience, 
    updateExperience, 
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet
  } = useResumeStore();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Work Experience</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {data.experience.length === 0 
                ? 'Add your work history' 
                : `${data.experience.length} position${data.experience.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          {data.experience.map((exp, index) => (
            <Card key={exp.id} className="border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-zinc-300 mt-1 cursor-grab" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-500">Position {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Company & Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Company
                        </Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Job Title
                        </Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>

                    {/* Location & Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Location
                        </Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Start Date
                        </Label>
                        <MonthYearPicker
                          value={exp.startDate}
                          onChange={(value) => updateExperience(exp.id, { startDate: value })}
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          End Date
                        </Label>
                        <MonthYearPicker
                          value={exp.current ? 'Present' : exp.endDate}
                          onChange={(value) => updateExperience(exp.id, { 
                            endDate: value, 
                            current: value.toLowerCase() === 'present' 
                          })}
                          placeholder="Select end date"
                          allowPresent
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Key Achievements / Responsibilities
                      </Label>
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex gap-2">
                          <span className="mt-2.5 text-zinc-400">•</span>
                          <Textarea
                            value={bullet}
                            onChange={(e) => updateExperienceBullet(exp.id, bulletIndex, e.target.value)}
                            placeholder="Describe an achievement or responsibility..."
                            className="flex-1 min-h-[60px] resize-y"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperienceBullet(exp.id, bulletIndex)}
                            className="text-zinc-400 hover:text-red-500 mt-1"
                            disabled={exp.bullets.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addExperienceBullet(exp.id)}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Bullet Point
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addExperience}
            className="w-full border-dashed border-2 hover:border-blue-300 hover:bg-blue-50/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Work Experience
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
