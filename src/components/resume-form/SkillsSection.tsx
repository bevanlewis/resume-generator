'use client';

import { useResumeStore } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Wrench, Plus, Trash2, GripVertical, X } from 'lucide-react';
import { useState } from 'react';

export function SkillsSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [skillInput, setSkillInput] = useState<{ [key: string]: string }>({});
  const { 
    data, 
    addSkillCategory, 
    updateSkillCategory, 
    removeSkillCategory,
    addSkill,
    removeSkill
  } = useResumeStore();

  const handleAddSkill = (categoryId: string) => {
    const input = skillInput[categoryId]?.trim();
    if (input) {
      addSkill(categoryId, input);
      setSkillInput(prev => ({ ...prev, [categoryId]: '' }));
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
            <Wrench className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Technical Skills</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {data.skills.length === 0 
                ? 'Add your skills by category' 
                : `${data.skills.length} categor${data.skills.length > 1 ? 'ies' : 'y'}`}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          {data.skills.map((category, index) => (
            <Card key={category.id} className="border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-zinc-300 mt-1 cursor-grab" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Category {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkillCategory(category.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Category Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700">
                        Category Name
                      </Label>
                      <Input
                        value={category.category}
                        onChange={(e) => updateSkillCategory(category.id, { category: e.target.value })}
                        placeholder="e.g., Languages, Frameworks, Tools"
                      />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700">
                        Skills
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {category.skills.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex} 
                            variant="secondary"
                            className="flex items-center gap-1 bg-rose-100 text-rose-700 hover:bg-rose-200"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(category.id, skillIndex)}
                              className="ml-1 hover:text-rose-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={skillInput[category.id] || ''}
                          onChange={(e) => setSkillInput(prev => ({ ...prev, [category.id]: e.target.value }))}
                          placeholder="Add a skill..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill(category.id);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSkill(category.id)}
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
            onClick={addSkillCategory}
            className="w-full border-dashed border-2 hover:border-rose-300 hover:bg-rose-50/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill Category
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
