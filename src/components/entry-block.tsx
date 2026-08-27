"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type EntryBlockProps = {
  label: string;
  onRemove: () => void;
  children: React.ReactNode;
};

export function EntryBlock({ label, onRemove, children }: EntryBlockProps) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="size-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Remove ${label}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
