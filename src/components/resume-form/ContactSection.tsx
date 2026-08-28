"use client";

import { useResumeStore } from "@/lib/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionFrame } from "@/components/section-frame";

export function ContactSection() {
  const { data, updateContact } = useResumeStore();
  const { contact } = data;

  return (
    <SectionFrame
      title="Contact"
      description="Name, location, and links printed at the top of the page."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={contact.name}
            onChange={(e) => updateContact({ name: e.target.value })}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              placeholder="ada@example.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              placeholder="(123) 456-7890"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={contact.location}
            onChange={(e) => updateContact({ location: e.target.value })}
            placeholder="London"
            autoComplete="address-level2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={contact.linkedin}
              onChange={(e) => updateContact({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/ada"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={contact.github}
              onChange={(e) => updateContact({ github: e.target.value })}
              placeholder="github.com/ada"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio">Website</Label>
          <Input
            id="portfolio"
            value={contact.portfolio}
            onChange={(e) => updateContact({ portfolio: e.target.value })}
            placeholder="ada.dev"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
