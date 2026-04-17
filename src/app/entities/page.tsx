"use client";

import React, { useEffect, useState } from 'react';
import { Plus, Building2, Settings, Shield, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useStore } from '@/store/useStore';
import { getEntities, createEntity } from '@/lib/supabase/services';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Entity = Database['public']['Tables']['entities']['Row'];

export default function EntitiesList() {
  const { activeEntity, setActiveEntity } = useStore();
  const { t } = useTranslation();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEntity, setNewEntity] = useState({ name: '', legal_type: 'مؤسسة فردية', tax_number: '', cr_number: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const data = await getEntities();
      setEntities(data || []);
      if (data && data.length > 0 && !activeEntity.name) {
        setActiveEntity({ name: data[0].name, short: data[0].name.substring(0, 3) });
      }
    } catch (error) {
      console.error('Error fetching entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const created = await createEntity({
        name: newEntity.name,
        short_name: newEntity.name.substring(0, 3),
        legal_type: newEntity.legal_type,
        tax_number: newEntity.tax_number,
        cr_number: newEntity.cr_number,
        address: null,
        phone: null,
        logo_url: null,
        status: 'active'
      });

      setEntities([created, ...entities]);
      setShowCreateModal(false);
      setNewEntity({ name: '', legal_type: 'مؤسسة فردية', tax_number: '', cr_number: '' });
      
      if (entities.length === 0) {
        setActiveEntity({ name: created.name, short: created.name.substring(0, 3) });
      }
    } catch (error) {
      console.error('Error creating entity:', error);
      alert('حدث خطأ أثناء إضافة الشركة');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground/80" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">{t('pages_extra.entities.title')}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">{t('pages_extra.entities.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 bg-primary hover:bg-primary text-primary-foreground rounded-md text-[12px] font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('pages_extra.entities.add')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity) => (
          <div key={entity.id} className={`bg-card border rounded-lg overflow-hidden transition-all ${
            activeEntity.name === entity.name ? 'border-[#5B5BD6] ring-1 ring-[#5B5BD6]' : 'border-border hover:border-border/80'
          }`}>
            <div className="p-5 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-lg flex items-center justify-center text-primary-foreground text-[16px] font-bold">
                  {entity.short_name || entity.name.substring(0, 3)}
                </div>
                {activeEntity.name === entity.name ? (
                  <span className="text-[10px] bg-[#EEEDF9] text-[#5B5BD6] px-2 py-1 rounded font-medium">{t('pages_extra.entities.active_now')}</span>
                ) : (
                  <button 
                    onClick={() => setActiveEntity({ name: entity.name, short: entity.short_name || entity.name.substring(0,3) })}
                    className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded hover:bg-background"
                  >
                    دخول للشركة
                  </button>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-[15px] mb-1">{entity.name}</h3>
              <div className="text-[12px] text-muted-foreground">{entity.legal_type}</div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground/80">{t('pages_extra.entities.tax_number')}</span>
                  <span className="font-mono text-foreground">{entity.tax_number || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground/80">{t('pages_extra.entities.cr_number')}</span>
                  <span className="font-mono text-foreground">{entity.cr_number || '-'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-background px-5 py-3 flex justify-between">
              <div className="text-center">
                <div className="text-[14px] font-semibold text-foreground tabular-nums">0</div>
                <div className="text-[10px] text-muted-foreground/80">{t('pages_extra.entities.invoices_issued')}</div>
              </div>
              <div className="w-px bg-border"></div>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 flex items-center justify-center bg-card border border-border rounded hover:border-border/80 text-muted-foreground">
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="border-2 border-dashed border-border rounded-lg flex items-center justify-center flex-col gap-3 min-h-[220px] text-muted-foreground/80 hover:text-foreground hover:border-[#2A2A2A] transition-colors hover:bg-card bg-background"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium text-[14px]">{t('pages_extra.entities.add')}</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg mt-8 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#A88732]" />
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">أهمية إضافة شركات منفصلة</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">لماذا يوفّر نظام فاتورة ميزة الإدارة المتعددة؟</p>
          </div>
        </div>
        <div className="p-5 text-[13px] text-muted-foreground leading-relaxed">
          يتيح لك هذا الخيار إدارة عدة علامات تجارية أو فروع قانونية تحت حساب استثماري واحد. كل شركة تحتفظ برقم ضريبي وتسلسل فواتير وعملاء مستقلين تماماً لضمان <strong>الامتثال لشروط هيئة الزكاة والدخل (ZATCA)</strong> وعدم تداخل الإيرادات.
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-[450px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-foreground">{t('pages_extra.entities.add')}</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground/80 hover:text-foreground">✕</button>
            </div>
            
            <form onSubmit={handleCreateEntity} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-foreground mb-1.5">الاسم التجاري للشركة</label>
                <input required value={newEntity.name} onChange={e => setNewEntity({...newEntity, name: e.target.value})} type="text" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-[#5B5BD6]" placeholder="مثال: الواحة للتجارة" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1.5">الكيان القانوني</label>
                  <select value={newEntity.legal_type} onChange={e => setNewEntity({...newEntity, legal_type: e.target.value})} className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-[#5B5BD6]">
                    <option>مؤسسة فردية</option>
                    <option>شركة ذات مسؤولية محدودة</option>
                    <option>شركة الشخص الواحد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1.5">{t('pages_extra.entities.cr_number')}</label>
                  <input required value={newEntity.cr_number} onChange={e => setNewEntity({...newEntity, cr_number: e.target.value})} type="text" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] font-mono focus:outline-none focus:border-[#5B5BD6]" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-foreground mb-1.5">الرقم الضريبي (TIN)</label>
                <input required value={newEntity.tax_number} onChange={e => setNewEntity({...newEntity, tax_number: e.target.value})} type="text" className="w-full h-10 px-3 bg-background border border-border rounded-md text-[13px] font-mono focus:outline-none focus:border-[#5B5BD6]" placeholder="15 رقم" minLength={15} maxLength={15} />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 h-10 bg-card border border-border text-muted-foreground hover:bg-background rounded-md text-[13px] font-medium">إلغاء</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 h-10 bg-primary hover:bg-primary disabled:bg-[#A3A3A3] text-primary-foreground rounded-md text-[13px] font-medium">
                  {isSubmitting ? t('pages_extra.entities.saving') : t('pages_extra.entities.save_company')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
