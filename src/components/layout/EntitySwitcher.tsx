"use client";

import React from 'react';
import { Check, Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function EntitySwitcher() {
  const { showEntitySwitcher, setShowEntitySwitcher, activeEntity, setActiveEntity } = useStore();

  const entities = [
    { name: 'عاصمة المجد للتجارة', short: 'AMT', tax: '300123456000003', invoices: 38 },
    { name: 'زاجل الجزيرة للصيانة', short: 'ZJZ', tax: '300987654000003', invoices: 22 }
  ];

  if (!showEntitySwitcher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 animate-fadeIn" onClick={() => setShowEntitySwitcher(false)}>
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-[480px] bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-border">
          <div className="text-[13px] font-semibold text-foreground">تبديل الكيان</div>
          <div className="text-[11px] text-muted-foreground/80 mt-0.5">اختر الكيان الذي تريد العمل عليه</div>
        </div>
        
        <div className="p-2 space-y-0.5 max-h-[300px] overflow-y-auto">
          {entities.map(e => (
            <button 
              key={e.short}
              onClick={() => {
                setActiveEntity({ name: e.name, short: e.short });
                setShowEntitySwitcher(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors text-right group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-md flex items-center justify-center text-primary-foreground text-[11px] font-bold flex-shrink-0">
                {e.short}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-foreground truncate">{e.name}</div>
                <div className="text-[11px] text-muted-foreground/80 font-mono truncate">{e.tax} · {e.invoices} فاتورة</div>
              </div>
              {activeEntity.short === e.short && <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />}
            </button>
          ))}
        </div>
        
        <div className="border-t border-border p-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-[13px] text-foreground">
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة كيان جديد</span>
          </button>
        </div>
      </div>
    </div>
  );
}
