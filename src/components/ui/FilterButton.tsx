import React from 'react';
import { ChevronDown } from 'lucide-react';

export function FilterButton({ label, value }: { label: string, value?: string }) {
  return (
    <button className="flex items-center gap-1.5 h-8 px-2.5 bg-card border border-border rounded-md text-[12px] hover:border-border/80">
      <span className="text-muted-foreground">{label}</span>
      {value && <span className="text-foreground font-medium">{value}</span>}
      <ChevronDown className="w-3 h-3 text-muted-foreground/80" />
    </button>
  );
}
