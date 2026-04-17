"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, ScrollText, Receipt, Sparkles, Plus, Upload, Users, Settings, Building2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function CommandPalette() {
  const { showCommandPalette, setShowCommandPalette } = useStore();
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showCommandPalette, setShowCommandPalette]);

  if (!showCommandPalette) return null;

  const handleNavigate = (path: string) => {
    router.push(path);
    setShowCommandPalette(false);
  };

  const commands = [
    { group: 'التنقل', items: [
      { icon: Home, label: 'الذهاب للرئيسية', shortcut: 'G H', action: () => handleNavigate('/') },
      { icon: ScrollText, label: 'عروض الأسعار', shortcut: 'G Q', action: () => handleNavigate('/quotations') },
      { icon: Receipt, label: 'الفواتير', shortcut: 'G I', action: () => handleNavigate('/invoices') },
      { icon: Sparkles, label: 'قراءة AI', shortcut: 'G A', action: () => handleNavigate('/ai-reader') },
    ]},
    { group: 'إجراءات', items: [
      { icon: Plus, label: 'إنشاء فاتورة جديدة', shortcut: '⌘ N', action: () => handleNavigate('/invoices') },
      { icon: Plus, label: 'إنشاء عرض سعر جديد', shortcut: '⇧ N', action: () => handleNavigate('/quotations/new') },
      { icon: Upload, label: 'رفع عرض سعر للقراءة', action: () => handleNavigate('/ai-reader') },
      { icon: Users, label: 'إضافة عميل', action: () => handleNavigate('/customers') },
    ]},
    { group: 'إعدادات', items: [
      { icon: Settings, label: 'الإعدادات العامة', shortcut: '⌘ ,', action: () => handleNavigate('/settings') },
      { icon: Building2, label: 'إدارة الكيانات', action: () => handleNavigate('/entities') },
    ]}
  ];

  const filtered = commands.map(group => ({
    ...group,
    items: group.items.filter(item => item.label.includes(query))
  })).filter(g => g.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 animate-fadeIn" onClick={() => setShowCommandPalette(false)}>
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-[600px] bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground/80" />
          <input 
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن أمر، تنقّل، أو إجراء..."
            className="flex-1 text-[14px] bg-transparent border-0 outline-none placeholder:text-muted-foreground/80"
          />
          <kbd className="text-[10px] font-mono text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded">esc</kbd>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-muted-foreground/80">
              لم يتم العثور على نتائج لـ "{query}"
            </div>
          ) : filtered.map((group, gIdx) => (
            <div key={gIdx} className="mb-2">
              <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">{group.group}</div>
              {group.items.map((cmd, idx) => (
                <button 
                  key={idx}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors"
                >
                  <span className="flex flex-wrap items-center gap-3">
                    <cmd.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[13px] text-foreground">{cmd.label}</span>
                  </span>
                  {cmd.shortcut && (
                    <kbd className="text-[10px] font-mono text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded">{cmd.shortcut}</kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground/80">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="bg-muted px-1 rounded">↑↓</kbd> تنقل</span>
            <span className="flex items-center gap-1"><kbd className="bg-muted px-1 rounded">↵</kbd> اختر</span>
          </div>
          <span>Powered by فاتورة</span>
        </div>
      </div>
    </div>
  );
}
