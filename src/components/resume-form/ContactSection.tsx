'use client';

import { useResumeStore } from '@/lib/resume-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, User, Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
  const [isOpen, setIsOpen] = useState(true);
  const { data, updateContact } = useResumeStore();
  const { contact } = data;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
            <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Contact Information</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Your personal details and links</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-700">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="name"
                value={contact.name}
                onChange={(e) => updateContact({ name: e.target.value })}
                placeholder="John Doe"
                className="pl-10"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                  placeholder="john@example.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateContact({ phone: e.target.value })}
                  placeholder="(123) 456-7890"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="location"
                value={contact.location}
                onChange={(e) => updateContact({ location: e.target.value })}
                placeholder="San Francisco, CA"
                className="pl-10"
              />
            </div>
          </div>

          {/* LinkedIn & GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                LinkedIn
              </Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="linkedin"
                  value={contact.linkedin}
                  onChange={(e) => updateContact({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="github" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                GitHub
              </Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  id="github"
                  value={contact.github}
                  onChange={(e) => updateContact({ github: e.target.value })}
                  placeholder="github.com/johndoe"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="space-y-2">
            <Label htmlFor="portfolio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Portfolio / Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="portfolio"
                value={contact.portfolio}
                onChange={(e) => updateContact({ portfolio: e.target.value })}
                placeholder="johndoe.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
