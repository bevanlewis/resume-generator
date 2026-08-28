"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionFrame } from "@/components/section-frame";
import { EntryBlock } from "@/components/entry-block";
import { Plus, X } from "lucide-react";

export function SkillsSection() {
  const [skillInput, setSkillInput] = useState<{ [key: string]: string }>({});
  const {
    data,
    addSkillCategory,
    updateSkillCategory,
    removeSkillCategory,
    addSkill,
    removeSkill,
  } = useResumeStore();

  const handleAddSkill = (categoryId: string) => {
    const input = skillInput[categoryId]?.trim();
    if (input) {
      addSkill(categoryId, input);
      setSkillInput((prev) => ({ ...prev, [categoryId]: "" }));
    }
  };

  const description =
    data.skills.length === 0
      ? "Skills by category."
      : `${data.skills.length} group${data.skills.length === 1 ? "" : "s"}`;

  return (
    <SectionFrame title="Skills" description={description}>
      <div className="space-y-4">
        {data.skills.map((category, index) => (
          <EntryBlock
            key={category.id}
            label={`Group ${index + 1}`}
            onRemove={() => removeSkillCategory(category.id)}
          >
            <div className="space-y-2">
              <Label htmlFor={`skill-category-${category.id}`}>
                Category Name
              </Label>
              <Input
                id={`skill-category-${category.id}`}
                value={category.category}
                onChange={(e) =>
                  updateSkillCategory(category.id, {
                    category: e.target.value,
                  })
                }
                placeholder="e.g., Languages, Frameworks, Tools"
              />
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(category.id, skillIndex)}
                      aria-label={`Remove ${skill}`}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id={`skill-input-${category.id}`}
                  value={skillInput[category.id] || ""}
                  onChange={(e) =>
                    setSkillInput((prev) => ({
                      ...prev,
                      [category.id]: e.target.value,
                    }))
                  }
                  placeholder="Add a skill..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(category.id);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSkill(category.id)}
                  className="h-11"
                  aria-label="Add skill"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </EntryBlock>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addSkillCategory}
          className="h-11 w-full border-dashed"
        >
          <Plus className="size-4" />
          Add skill group
        </Button>
      </div>
    </SectionFrame>
  );
}
