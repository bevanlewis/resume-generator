'use client';

import { useResumeStore } from '@/lib/resume-store';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, FileText } from 'lucide-react';
import { useState } from 'react';

export function SummarySection() {
  const [isOpen, setIsOpen] = useState(true);
  const { data, updateSummary } = useResumeStore();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Professional Summary</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">A brief overview of your professional background</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Briefly describe your professional background, key skills, and career objectives..."
              className="min-h-[120px] resize-y"
            />
            <p className="text-xs text-zinc-400">
              Tip: Keep it concise - 2-3 sentences highlighting your experience and goals.
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
