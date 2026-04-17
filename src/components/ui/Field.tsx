import React from 'react';

export function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
