import React from 'react';

type StatusType = 'paid' | 'pending' | 'overdue' | 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export function StatusPill({ status }: { status: StatusType }) {
  const config = {
    paid: { label: 'مدفوعة', dot: '#22C55E', text: '#15803D' },
    pending: { label: 'مستحقة', dot: '#F59E0B', text: '#B45309' },
    overdue: { label: 'متأخرة', dot: '#E5484D', text: '#B91C1C' },
    draft: { label: 'مسودة', dot: '#9B9B9B', text: '#6A6A6A' },
    sent: { label: 'مُرسل', dot: '#5B5BD6', text: '#4338CA' },
    accepted: { label: 'مقبول', dot: '#22C55E', text: '#15803D' },
    rejected: { label: 'مرفوض', dot: '#E5484D', text: '#B91C1C' },
    expired: { label: 'منتهي', dot: '#9B9B9B', text: '#6A6A6A' },
  };
  const c = config[status] || config.draft;
  
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }}></span>
      {c.label}
    </span>
  );
}
