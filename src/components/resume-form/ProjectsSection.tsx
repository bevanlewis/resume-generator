"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { SectionFrame } from "@/components/section-frame";
import { EntryBlock } from "@/components/entry-block";
import { Plus, Trash2, X } from "lucide-react";

export function ProjectsSection() {
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
    removeProjectTechnology,
  } = useResumeStore();

  const handleAddTech = (projectId: string) => {
    const input = techInput[projectId]?.trim();
    if (input) {
      addProjectTechnology(projectId, input);
      setTechInput((prev) => ({ ...prev, [projectId]: "" }));
    }
  };

  const description =
    data.projects.length === 0
      ? "Personal and side projects."
      : `${data.projects.length} project${data.projects.length === 1 ? "" : "s"}`;

  return (
    <SectionFrame title="Projects" description={description}>
      <div className="space-y-4">
        {data.projects.map((project, index) => (
          <EntryBlock
            key={project.id}
            label={`Project ${index + 1}`}
            onRemove={() => removeProject(project.id)}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`proj-name-${project.id}`}>Project Name</Label>
                <Input
                  id={`proj-name-${project.id}`}
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, { name: e.target.value })
                  }
                  placeholder="My Awesome Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`proj-link-${project.id}`}>Link (Optional)</Label>
                <Input
                  id={`proj-link-${project.id}`}
                  value={project.link}
                  onChange={(e) =>
                    updateProject(project.id, { link: e.target.value })
                  }
                  placeholder="github.com/user/project"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <MonthYearPicker
                  value={project.startDate}
                  onChange={(value) =>
                    updateProject(project.id, { startDate: value })
                  }
                  placeholder="Select start date"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <MonthYearPicker
                  value={project.endDate}
                  onChange={(value) =>
                    updateProject(project.id, { endDate: value })
                  }
                  placeholder="Select end date"
                  allowPresent
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="mb-2 flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() =>
                        removeProjectTechnology(project.id, techIndex)
                      }
                      aria-label={`Remove ${tech}`}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id={`proj-tech-${project.id}`}
                  value={techInput[project.id] || ""}
                  onChange={(e) =>
                    setTechInput((prev) => ({
                      ...prev,
                      [project.id]: e.target.value,
                    }))
                  }
                  placeholder="Add a technology (e.g., React, Python)..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech(project.id);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTech(project.id)}
                  className="h-11"
                  aria-label="Add technology"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              {project.description.map((desc, descIndex) => (
                <div key={descIndex} className="flex gap-2">
                  <span className="mt-2.5 text-muted-foreground" aria-hidden="true">
                    •
                  </span>
                  <Textarea
                    value={desc}
                    onChange={(e) =>
                      updateProjectDescription(
                        project.id,
                        descIndex,
                        e.target.value
                      )
                    }
                    placeholder="Describe what you built or achieved..."
                    className="min-h-[60px] flex-1 resize-y"
                    aria-label={`Description ${descIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeProjectDescription(project.id, descIndex)
                    }
                    className="mt-1 size-11 text-muted-foreground hover:text-destructive"
                    disabled={project.description.length <= 1}
                    aria-label={`Remove description ${descIndex + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addProjectDescription(project.id)}
                className="mt-2 h-11"
              >
                <Plus className="size-4" />
                Add Bullet Point
              </Button>
            </div>
          </EntryBlock>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          className="h-11 w-full border-dashed"
        >
          <Plus className="size-4" />
          Add project
        </Button>
      </div>
    </SectionFrame>
  );
}
