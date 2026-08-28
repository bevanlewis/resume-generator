"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { SectionFrame } from "@/components/section-frame";
import { EntryBlock } from "@/components/entry-block";
import { Plus } from "lucide-react";

export function AwardsSection() {
  const { data, addAward, updateAward, removeAward } = useResumeStore();

  const description =
    data.awards.length === 0
      ? "Honors and recognition."
      : `${data.awards.length} award${data.awards.length === 1 ? "" : "s"}`;

  return (
    <SectionFrame title="Awards" description={description}>
      <div className="space-y-4">
        {data.awards.map((award, index) => (
          <EntryBlock
            key={award.id}
            label={`Award ${index + 1}`}
            onRemove={() => removeAward(award.id)}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`award-title-${award.id}`}>Award Title</Label>
                <Input
                  id={`award-title-${award.id}`}
                  value={award.title}
                  onChange={(e) =>
                    updateAward(award.id, { title: e.target.value })
                  }
                  placeholder="Dean's List"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`award-issuer-${award.id}`}>
                  Issuing Organization
                </Label>
                <Input
                  id={`award-issuer-${award.id}`}
                  value={award.issuer}
                  onChange={(e) =>
                    updateAward(award.id, { issuer: e.target.value })
                  }
                  placeholder="Stanford University"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Received</Label>
              <div className="md:w-1/2">
                <MonthYearPicker
                  value={award.date}
                  onChange={(value) => updateAward(award.id, { date: value })}
                  placeholder="Select date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`award-description-${award.id}`}>
                Description (Optional)
              </Label>
              <Textarea
                id={`award-description-${award.id}`}
                value={award.description}
                onChange={(e) =>
                  updateAward(award.id, { description: e.target.value })
                }
                placeholder="Brief description of the award..."
                className="min-h-[60px] resize-y"
              />
            </div>
          </EntryBlock>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addAward}
          className="h-11 w-full border-dashed"
        >
          <Plus className="size-4" />
          Add award
        </Button>
      </div>
    </SectionFrame>
  );
}
