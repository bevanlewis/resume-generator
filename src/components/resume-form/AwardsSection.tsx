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
import { ChevronDown, Award, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

export function AwardsSection() {
  const [isOpen, setIsOpen] = useState(true);
  const { 
    data, 
    addAward, 
    updateAward, 
    removeAward
  } = useResumeStore();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
            <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Awards & Achievements</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {data.awards.length === 0 
                ? 'Highlight your accomplishments' 
                : `${data.awards.length} award${data.awards.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          {data.awards.map((award, index) => (
            <Card key={award.id} className="border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-zinc-300 mt-1 cursor-grab" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Award {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAward(award.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Title & Issuer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Award Title
                        </Label>
                        <Input
                          value={award.title}
                          onChange={(e) => updateAward(award.id, { title: e.target.value })}
                          placeholder="Dean's List"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Issuing Organization
                        </Label>
                        <Input
                          value={award.issuer}
                          onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                          placeholder="Stanford University"
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Date Received
                      </Label>
                      <div className="md:w-1/2">
                        <MonthYearPicker
                          value={award.date}
                          onChange={(value) => updateAward(award.id, { date: value })}
                          placeholder="Select date"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Description (Optional)
                      </Label>
                      <Textarea
                        value={award.description}
                        onChange={(e) => updateAward(award.id, { description: e.target.value })}
                        placeholder="Brief description of the award..."
                        className="min-h-[60px] resize-y"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addAward}
            className="w-full border-dashed border-2 hover:border-yellow-300 hover:bg-yellow-50/50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Award
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
