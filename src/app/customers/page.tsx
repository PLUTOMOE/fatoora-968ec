"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Download, Plus, Search, Users, MoreHorizontal, Loader2 } from 'lucide-react';
import { FilterButton } from '@/components/ui/FilterButton';
import { useStore } from '@/store/useStore';
import { getCustomers, createCustomer } from '@/lib/supabase/services';

export default function CustomersList() {
  const { t } = useTranslation();
  const { activeEntity } = useStore();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', type: 'company', email: '', phone: '', city: '' });

  useEffect(() => {
    if (activeEntity.name) {
      fetchCustomers();
    } else {
      setLoading(false);
    }
  }, [activeEntity]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: ent } = await supabase.from('entities').select('id').eq('name', activeEntity.name).single();
      if (ent) {
        const data = await getCustomers(ent.id);
        setCustomers(data || []);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: ent } = await supabase.from('entities').select('id').eq('name', activeEntity.name).single();
      if (!ent) { alert('يرجى اختيار الكيان أولاً'); return; }
      await createCustomer({ ...newCustomer, entity_id: ent.id });
      setShowModal(false);
      setNewCustomer({ name: '', type: 'company', email: '', phone: '', city: '' });
      fetchCustomers();
    } catch {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-60 items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground/80" /></div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{t('pages.customers.title')}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {customers.length === 0 ? 'لا يوجد عملاء بعد' : `${customers.length} عميل في قاعدة البيانات`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 bg-card border border-border rounded-md text-[12px] text-foreground hover:border-foreground/20">
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground rounded-md text-[12px] font-medium hover:opacity-90">
            <Plus className="w-3.5 h-3.5" />
            <span>{t('pages.customers.add')}</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
            <input
              type="text"
              placeholder={t('pages.customers.search')}
              className="w-full pr-8 pl-3 h-8 bg-background border border-border rounded-md text-[12px] focus:outline-none focus:border-[#5B5BD6]"
            />
          </div>
          <FilterButton label="النوع" />
          <FilterButton label={t('pages.customers.city')} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
              <Users className="w-8 h-8 text-muted-foreground/40 mb-3" />
              <p className="text-[13px]">لا يوجد عملاء مضافين في الكيان الحالي</p>
              <button onClick={() => setShowModal(true)} className="mt-4 text-[12px] text-[#5B5BD6] font-medium hover:underline">
                أضف عميلك الأول الآن
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                  <th className="text-right font-medium px-4 py-2.5">{t('pages.customers.name')}</th>
                  <th className="text-right font-medium px-4 py-2.5">معلومات التواصل</th>
                  <th className="text-center font-medium px-4 py-2.5">الفواتير</th>
                  <th className="text-right font-medium px-4 py-2.5">{t('pages.customers.city')}</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {customers.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors group cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-[11px] text-muted-foreground">{row.name?.substring(0,2)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{row.name}</div>
                          <div className="text-[11px] text-muted-foreground/80">{row.type === 'company' ? 'شركة / مؤسسة' : 'فرد'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[12px] text-foreground">{row.email || '-'}</div>
                      <div className="text-[11px] font-mono text-muted-foreground/80">{row.phone || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">0</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.city || '-'}</td>
                    <td className="px-4 py-3">
                      <button className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center hover:bg-border rounded transition-all">
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-[440px] rounded-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-foreground">إضافة عميل جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground/80 hover:text-foreground text-lg leading-none">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-foreground mb-1.5">اسم العميل أو الجهة</label>
                <input required value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} type="text" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-[#5B5BD6]" placeholder="مثال: الواحة للتجارة" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1.5">النوع</label>
                  <select value={newCustomer.type} onChange={e => setNewCustomer({...newCustomer, type: e.target.value})} className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-[#5B5BD6]">
                    <option value="company">شركة / مؤسسة</option>
                    <option value="individual">فرد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1.5">{t('pages.customers.city')}</label>
                  <input value={newCustomer.city} onChange={e => setNewCustomer({...newCustomer, city: e.target.value})} type="text" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px]" placeholder="الرياض" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1.5">{t('pages.customers.email')}</label>
                  <input value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} type="email" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px]" placeholder="mail@example.com" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1.5">رقم الجوال</label>
                  <input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} type="tel" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] font-mono" placeholder="05XXXXXXXX" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-10 bg-card border border-border text-muted-foreground hover:bg-muted rounded-md text-[13px] font-medium">{t('common.cancel')}</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 h-10 bg-primary text-primary-foreground rounded-md text-[13px] font-medium disabled:opacity-60">
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ العميل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
