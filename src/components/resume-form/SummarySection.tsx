"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionFrame } from "@/components/section-frame";

export function SummarySection() {
  const { data, updateSummary } = useResumeStore();

  return (
    <SectionFrame
      title="Summary"
      description="Two or three sentences. Skip it if the rest of the page already says this."
    >
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="What you do, where you've done it, what you want next."
          className="min-h-[120px] resize-y"
        />
      </div>
    </SectionFrame>
  );
}
