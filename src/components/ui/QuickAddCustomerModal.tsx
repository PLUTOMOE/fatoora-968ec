"use client";

import React, { useState, useRef } from 'react';
import { X, Building2, User, Loader2, Sparkles, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { createCustomer } from '@/lib/supabase/services';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/store/useStore';
import { CustomerData } from './CustomerAutocomplete';

interface QuickAddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  initialAiMode?: boolean;
  onSuccess: (customer: CustomerData) => void;
}

export function QuickAddCustomerModal({ isOpen, onClose, initialName, initialAiMode = false, onSuccess }: QuickAddCustomerModalProps) {
  const { activeEntity } = useStore();
  const [formData, setFormData] = useState({
    name: initialName || '',
    type: 'company',
    phone: '',
    address: '',
    tax_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [isAiMode, setIsAiMode] = useState(initialAiMode);
  const [aiAnalysisStep, setAiAnalysisStep] = useState(0); // 0: upload, 1: scanning, 2: success
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync AI mode when opened
  React.useEffect(() => {
    if (isOpen) {
      setIsAiMode(initialAiMode);
      setAiAnalysisStep(0);
    }
  }, [isOpen, initialAiMode]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateAiExtraction();
    }
  };

  const simulateAiExtraction = () => {
    setAiAnalysisStep(1); // scanning
    setTimeout(() => {
      setFormData({
        name: 'شركة النور للتجارة والتقنية',
        type: 'company',
        phone: '0501234567',
        address: 'الرياض، المملكة العربية السعودية',
        tax_number: '310123456700003'
      });
      setAiAnalysisStep(2); // success
      setTimeout(() => {
        setIsAiMode(false);
        setAiAnalysisStep(0);
      }, 2000);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setLoading(true);
    try {
      const supabase = createClient();
      // Get entity id
      const { data: ent } = await supabase.from('entities').select('id').eq('name', activeEntity.name).single();
      if (!ent) {
        alert('حدث خطأ في تحديد الكيان النشط.');
        setLoading(false);
        return;
      }

      // Create
      const newCustomer = await createCustomer({
        ...formData,
        entity_id: ent.id
      });

      if (newCustomer) {
        onSuccess(newCustomer as unknown as CustomerData);
      } else {
        alert('لم يتم إضافة العميل، يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة العميل');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-card border border-border rounded-[1.5rem] p-6 md:p-10 shadow-2xl shadow-black/5 relative animate-in zoom-in-95 duration-200">
        
        {/* Decorative Header Blur */}
        <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-primary/5 to-transparent opacity-80 pointer-events-none"></div>

        {/* Header */}
        <header className="mb-8 relative z-10 flex items-start justify-between border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">إضافة عميل جديد الشامل</h2>
            </div>
            <p className="text-muted-foreground text-[13px] font-medium pr-14 leading-relaxed">
              يتم إضافة العميل مباشرة إلى قاعدة البيانات ويمكنك استخدامه فوراً في الفاتورة الحالية.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
             <button onClick={onClose} className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors bg-background border border-border/50">
               <X className="w-5 h-5" />
             </button>

             {!isAiMode && (
               <button 
                  type="button" 
                  onClick={() => setIsAiMode(true)}
                  className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#7A5A1A] bg-gradient-to-r from-[#FFE2A8] to-[#E8B96B] px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  ملء بالذكاء الاصطناعي (AI)
                </button>
             )}
          </div>
        </header>

        {isAiMode ? (
          <div className="relative z-10 animate-in zoom-in-95">
            <div className="bg-muted/30 border border-border rounded-2xl p-8">
              {aiAnalysisStep === 0 && (
                <div 
                  className="border-2 border-dashed border-[#E8B96B]/50 hover:border-[#E8B96B] rounded-xl p-10 text-center cursor-pointer bg-background transition-all hover:shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,image/png,image/jpeg,image/jpg" 
                    onChange={handleFileSelect} 
                  />
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFE2A8] to-[#E8B96B] rounded-2xl flex items-center justify-center mx-auto mb-4 custom-shadow">
                    <Upload className="w-7 h-7 text-[#7A5A1A]" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">ارفع السجل التجاري أو البطاقة الضريبية</h3>
                  <p className="text-xs text-muted-foreground">صورة أو PDF (الذكاء الاصطناعي سيقوم بملء كافة البيانات المتاحة أسفله)</p>
                </div>
              )}
              
              {aiAnalysisStep === 1 && (
                <div className="py-10 text-center animate-in fade-in">
                  <div className="relative w-14 h-14 mx-auto mb-5">
                    <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">جاري قراءة المستند وتحليله...</h3>
                  <div className="flex justify-center items-center gap-2 text-[12px] text-muted-foreground bg-background p-2 rounded-lg border border-border/50 max-w-[200px] mx-auto">
                      <Loader2 className="w-3 h-3 animate-spin text-primary"/> قراءة البيانات الضريبية
                  </div>
                </div>
              )}
              
              {aiAnalysisStep === 2 && (
                <div className="py-10 text-center animate-in zoom-in">
                  <div className="w-14 h-14 bg-[#22C55E] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-[#15803D] mb-1">تم الاستخراج والتعبئة بنجاح!</h3>
                  <p className="text-xs text-muted-foreground">دقة البيانات 95% برجاء مراجعتها أدناه.</p>
                </div>
              )}

              <div className="pt-4 flex justify-center">
                 <button onClick={() => setIsAiMode(false)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                   الرجوع للوضع اليدوي
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Width Field */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-foreground font-semibold text-[13px] mb-1.5">اسم العميل أو الجهة <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground z-30 pointer-events-none">
                     <Building2 className="w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: شركة التقنية الحديثة"
                    className="w-full h-11 bg-muted/30 border border-border/50 hover:bg-muted/50 rounded-xl pr-11 pl-4 text-foreground placeholder:text-muted-foreground/60 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px]" 
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-foreground font-semibold text-[13px] mb-1.5">النوع <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2 h-11">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'company' })}
                    className={`flex items-center justify-center gap-2 rounded-lg text-[13px] font-medium transition-all ${
                      formData.type === 'company' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                   شركة / مؤسسة
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'individual' })}
                    className={`flex items-center justify-center gap-2 rounded-lg text-[13px] font-medium transition-all ${
                      formData.type === 'individual' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                   فرد
                  </button>
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-foreground font-semibold text-[13px] mb-1.5">العنوان / المدينة</label>
                <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="الرياض" 
                    className="w-full h-11 bg-muted/30 border border-border/50 hover:bg-muted/50 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/60 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px]"
                />
              </div>

              {/* Divider */}
              <div className="col-span-1 md:col-span-2 pt-2 pb-1">
                 <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    معلومات إضافية للتواصل (تظهر في الفواتير)
                 </h3>
              </div>

              <div className="col-span-1">
                <label className="block text-foreground font-semibold text-[13px] mb-1.5">الرقم الضريبي (إن وجد)</label>
                <input 
                    type="text" 
                    dir="ltr"
                    value={formData.tax_number}
                    onChange={(e) => setFormData({...formData, tax_number: e.target.value})}
                    placeholder="310000000000003" 
                    className="w-full h-11 bg-muted/30 border border-border/50 hover:bg-muted/50 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/60 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px] text-left font-mono"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-foreground font-semibold text-[13px] mb-1.5">رقم الجوال</label>
                <input 
                    type="tel" 
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+966 50 000 0000" 
                    className="w-full h-11 bg-muted/30 border border-border/50 hover:bg-muted/50 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/60 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-[13px] text-left"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
              <button 
                onClick={onClose} 
                className="px-5 py-2.5 rounded-xl text-muted-foreground text-sm font-semibold hover:bg-muted transition-colors" 
                type="button"
              >
                إلغاء
              </button>
              <button 
                disabled={loading || !formData.name}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
                type="submit"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'جاري الحفظ...' : 'حفظ واستخدام العميل'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
