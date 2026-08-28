"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { SectionFrame } from "@/components/section-frame";
import { EntryBlock } from "@/components/entry-block";
import { Plus, X } from "lucide-react";

export function EducationSection() {
  const [courseworkInput, setCourseworkInput] = useState<{ [key: string]: string }>(
    {}
  );
  const {
    data,
    addEducation,
    updateEducation,
    removeEducation,
    addEducationCoursework,
    removeEducationCoursework,
  } = useResumeStore();

  const handleAddCoursework = (educationId: string) => {
    const input = courseworkInput[educationId]?.trim();
    if (input) {
      addEducationCoursework(educationId);
      const edu = data.education.find((e) => e.id === educationId);
      if (edu) {
        const newIndex = edu.coursework.length;
        setTimeout(() => {
          useResumeStore
            .getState()
            .updateEducationCoursework(educationId, newIndex, input);
        }, 0);
      }
      setCourseworkInput((prev) => ({ ...prev, [educationId]: "" }));
    }
  };

  const description =
    data.education.length === 0
      ? "Schools and degrees."
      : `${data.education.length} school${data.education.length === 1 ? "" : "s"}`;

  return (
    <SectionFrame title="Education" description={description}>
      <div className="space-y-4">
        {data.education.map((edu, index) => (
          <EntryBlock
            key={edu.id}
            label={`School ${index + 1}`}
            onRemove={() => removeEducation(edu.id)}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`edu-school-${edu.id}`}>School / University</Label>
                <Input
                  id={`edu-school-${edu.id}`}
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(edu.id, { school: e.target.value })
                  }
                  placeholder="Stanford University"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edu-degree-${edu.id}`}>Degree</Label>
                <Input
                  id={`edu-degree-${edu.id}`}
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, { degree: e.target.value })
                  }
                  placeholder="Bachelor of Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`edu-field-${edu.id}`}>Field of Study</Label>
                <Input
                  id={`edu-field-${edu.id}`}
                  value={edu.field}
                  onChange={(e) =>
                    updateEducation(edu.id, { field: e.target.value })
                  }
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edu-location-${edu.id}`}>Location</Label>
                <Input
                  id={`edu-location-${edu.id}`}
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, { location: e.target.value })
                  }
                  placeholder="Stanford, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <MonthYearPicker
                  value={edu.startDate}
                  onChange={(value) =>
                    updateEducation(edu.id, { startDate: value })
                  }
                  placeholder="Select start date"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <MonthYearPicker
                  value={edu.endDate}
                  onChange={(value) =>
                    updateEducation(edu.id, { endDate: value })
                  }
                  placeholder="Select end date"
                  allowPresent
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edu-gpa-${edu.id}`}>GPA (Optional)</Label>
                <Input
                  id={`edu-gpa-${edu.id}`}
                  value={edu.gpa}
                  onChange={(e) =>
                    updateEducation(edu.id, { gpa: e.target.value })
                  }
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Relevant Coursework (Optional)</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {edu.coursework.map((course, courseIndex) => (
                  <Badge
                    key={courseIndex}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() =>
                        removeEducationCoursework(edu.id, courseIndex)
                      }
                      aria-label={`Remove ${course}`}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id={`edu-coursework-${edu.id}`}
                  value={courseworkInput[edu.id] || ""}
                  onChange={(e) =>
                    setCourseworkInput((prev) => ({
                      ...prev,
                      [edu.id]: e.target.value,
                    }))
                  }
                  placeholder="Add a course..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCoursework(edu.id);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCoursework(edu.id)}
                  className="h-11"
                  aria-label="Add coursework"
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
          onClick={addEducation}
          className="h-11 w-full border-dashed"
        >
          <Plus className="size-4" />
          Add school
        </Button>
      </div>
    </SectionFrame>
  );
}
