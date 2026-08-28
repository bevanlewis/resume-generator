"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type SectionChrome = {
  controls: ReactNode;
  hidden: boolean;
};

const SectionChromeContext = createContext<SectionChrome | null>(null);

export function SectionChromeProvider({
  controls,
  hidden,
  children,
}: SectionChrome & { children: ReactNode }) {
  return (
    <SectionChromeContext.Provider value={{ controls, hidden }}>
      {children}
    </SectionChromeContext.Provider>
  );
}

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
  const chrome = useContext(SectionChromeContext);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-md border border-border bg-card"
    >
      <div className="flex items-center hover:bg-muted/60">
        {chrome?.controls}
        <CollapsibleTrigger
          className={cn(
            "flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 py-3 text-left",
            chrome ? "pr-4 pl-1" : "px-4",
            chrome?.hidden && "opacity-50"
          )}
        >
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-medium tracking-tight text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {chrome?.hidden && (
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
                Hidden in PDF
              </span>
            )}
            <ChevronDown
              className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        className={cn(
          "border-t border-border px-4 pb-4 pt-4",
          chrome?.hidden && "opacity-50"
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
