"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SectionFrameProps = {
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SectionFrame({
  title,
  description,
  defaultOpen = true,
  children,
}: SectionFrameProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-md border border-border bg-card"
    >
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/60">
        <div>
          <h3 className="font-serif text-lg font-medium tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-4 pb-4 pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
