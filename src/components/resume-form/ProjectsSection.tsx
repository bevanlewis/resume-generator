'use client';

import { useResumeStore } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, FolderGit2, Plus, Trash2, GripVertical, X } from 'lucide-react';
import { useState } from 'react';

export function ProjectsSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [techInput, setTechInput] = useState<{ [key: string]: string }>({});
  const { 
    data, 
    addProject, 
    updateProject, 
    removeProject,
    addProjectDescription,
    updateProjectDescription,
    removeProjectDescription,
    addProjectTechnology,
    removeProjectTechnology
  } = useResumeStore();

  const handleAddTech = (projectId: string) => {
    const input = techInput[projectId]?.trim();
    if (input) {
      addProjectTechnology(projectId, input);
      setTechInput(prev => ({ ...prev, [projectId]: '' }));
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg">
            <FolderGit2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Projects</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {data.projects.length === 0 
                ? 'Showcase your personal projects' 
                : `${data.projects.length} project${data.projects.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          {data.projects.map((project, index) => (
            <Card key={project.id} className="border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-zinc-300 mt-1 cursor-grab" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-500">Project {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Project Name & Link */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Project Name
                        </Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, { name: e.target.value })}
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Link (Optional)
                        </Label>
                        <Input
                          value={project.link}
                          onChange={(e) => updateProject(project.id, { link: e.target.value })}
                          placeholder="github.com/user/project"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Start Date
                        </Label>
                        <MonthYearPicker
                          value={project.startDate}
                          onChange={(value) => updateProject(project.id, { startDate: value })}
                          placeholder="Select start date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          End Date
                        </Label>
                        <MonthYearPicker
                          value={project.endDate}
                          onChange={(value) => updateProject(project.id, { endDate: value })}
                          placeholder="Select end date"
                          allowPresent
                        />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Technologies Used
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge 
                            key={techIndex} 
                            variant="secondary"
                            className="flex items-center gap-1 bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                          >
                            {tech}
                            <button
                              onClick={() => removeProjectTechnology(project.id, techIndex)}
                              className="ml-1 hover:text-cyan-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={techInput[project.id] || ''}
                          onChange={(e) => setTechInput(prev => ({ ...prev, [project.id]: e.target.value }))}
                          placeholder="Add a technology (e.g., React, Python)..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTech(project.id);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTech(project.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Description
                      </Label>
                      {project.description.map((desc, descIndex) => (
                        <div key={descIndex} className="flex gap-2">
                          <span className="mt-2.5 text-zinc-400">•</span>
                          <Textarea
                            value={desc}
                            onChange={(e) => updateProjectDescription(project.id, descIndex, e.target.value)}
                            placeholder="Describe what you built or achieved..."
                            className="flex-1 min-h-[60px] resize-y"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProjectDescription(project.id, descIndex)}
                            className="text-zinc-400 hover:text-red-500 mt-1"
                            disabled={project.description.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addProjectDescription(project.id)}
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
            onClick={addProject}
            className="w-full border-dashed border-2 hover:border-cyan-300 hover:bg-cyan-50/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
