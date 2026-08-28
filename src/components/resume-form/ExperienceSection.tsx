"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { SectionFrame } from "@/components/section-frame";
import { EntryBlock } from "@/components/entry-block";
import { Plus, Trash2 } from "lucide-react";

export function ExperienceSection() {
  const {
    data,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
  } = useResumeStore();

  const description =
    data.experience.length === 0
      ? "Roles, newest first."
      : `${data.experience.length} role${data.experience.length === 1 ? "" : "s"}`;

  return (
    <SectionFrame title="Experience" description={description}>
      <div className="space-y-4">
        {data.experience.map((exp, index) => (
          <EntryBlock
            key={exp.id}
            label={`Role ${index + 1}`}
            onRemove={() => removeExperience(exp.id)}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`exp-company-${exp.id}`}>Company</Label>
                <Input
                  id={`exp-company-${exp.id}`}
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, { company: e.target.value })
                  }
                  placeholder="Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`exp-title-${exp.id}`}>Title</Label>
                <Input
                  id={`exp-title-${exp.id}`}
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(exp.id, { title: e.target.value })
                  }
                  placeholder="Software engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                <Input
                  id={`exp-location-${exp.id}`}
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label>Start</Label>
                <MonthYearPicker
                  value={exp.startDate}
                  onChange={(value) =>
                    updateExperience(exp.id, { startDate: value })
                  }
                  placeholder="Start"
                />
              </div>
              <div className="space-y-2">
                <Label>End</Label>
                <MonthYearPicker
                  value={exp.current ? "Present" : exp.endDate}
                  onChange={(value) =>
                    updateExperience(exp.id, {
                      endDate: value,
                      current: value.toLowerCase() === "present",
                    })
                  }
                  placeholder="End"
                  allowPresent
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Highlights</Label>
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <span className="mt-2.5 text-muted-foreground" aria-hidden="true">
                    •
                  </span>
                  <Textarea
                    value={bullet}
                    onChange={(e) =>
                      updateExperienceBullet(exp.id, bulletIndex, e.target.value)
                    }
                    placeholder="What you shipped, with a number if you have one."
                    className="min-h-[60px] flex-1 resize-y"
                    aria-label={`Highlight ${bulletIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperienceBullet(exp.id, bulletIndex)}
                    className="mt-1 size-11 text-muted-foreground hover:text-destructive"
                    disabled={exp.bullets.length <= 1}
                    aria-label={`Remove highlight ${bulletIndex + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addExperienceBullet(exp.id)}
                className="mt-2 h-11"
              >
                <Plus className="size-4" />
                Add highlight
              </Button>
            </div>
          </EntryBlock>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="h-11 w-full border-dashed"
        >
          <Plus className="size-4" />
          Add role
        </Button>
      </div>
    </SectionFrame>
  );
}
