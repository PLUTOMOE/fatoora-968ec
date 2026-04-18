"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Sparkles, Edit, CheckCircle2, Check, Loader2, Zap, Shield, FileImage, FileType, AlertCircle, Receipt, ScrollText, Settings2, Key } from 'lucide-react';
import { Field } from '@/components/ui/Field';

interface ExtractedItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface ExtractedData {
  company_name: string;
  company_tax: string;
  quotation_number: string;
  date: string;
  customer_name: string;
  items: ExtractedItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  confidence: number;
}

export default function AIReader() {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(0);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Editable fields
  const [editData, setEditData] = useState<ExtractedData | null>(null);
  
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load API key from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) setApiKey(stored);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowApiKeyInput(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!apiKey) {
      setShowApiKeyInput(true);
      setSelectedFile(file);
      setFileName(file.name);
      return;
    }

    await processFile(file);
  };

  const processFile = async (file: File) => {
    setError('');
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    setStep(2);
    setSubStep(0);

    // Real progress tracking
    const progressTimer1 = setTimeout(() => setSubStep(1), 500);
    const progressTimer2 = setTimeout(() => setSubStep(2), 1500);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('apiKey', apiKey);

      const response = await fetch('/api/ai-extract', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setSubStep(3);

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || 'حدث خطأ في الاستخراج');
        setStep(1);
        return;
      }

      setTimeout(() => {
        setSubStep(4);
        setExtractedData(result.data);
        setEditData(result.data);
        setStep(3);
      }, 500);

    } catch (err: any) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setError(err.message || 'فشل الاتصال بالخادم');
      setStep(1);
    }
  };

  const updateEditItem = (idx: number, field: keyof ExtractedItem, value: any) => {
    if (!editData) return;
    const newItems = [...editData.items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    // Recalculate totals
    if (field === 'qty' || field === 'price') {
      newItems[idx].total = newItems[idx].qty * newItems[idx].price;
    }
    const subtotal = newItems.reduce((s, i) => s + i.total, 0);
    const tax_amount = subtotal * (editData.tax_rate / 100);
    setEditData({ ...editData, items: newItems, subtotal, tax_amount, total: subtotal + tax_amount });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[24px] font-semibold text-foreground tracking-tight">قراءة العروض الخارجية</h1>
            <span className="text-[10px] bg-gradient-to-r from-[#FFE2A8] to-[#E8B96B] text-[#7A5A1A] px-1.5 py-0.5 rounded font-bold">AI</span>
          </div>
          <p className="text-[13px] text-muted-foreground">حوّل أي عرض سعر خارجي (PDF أو صورة) إلى عرض/فاتورة في نظامك</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
              apiKey ? 'border-green-200 bg-green-50 text-green-700' : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            <Key className="w-3 h-3" />
            {apiKey ? 'مفتاح API متصل ✓' : 'أضف مفتاح Gemini API'}
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className="bg-card border border-border rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-[13px] font-medium">إعداد مفتاح Gemini API</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">
            احصل على مفتاح مجاني من <a href="https://aistudio.google.com/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              defaultValue={apiKey}
              placeholder="AIzaSy..."
              className="flex-1 h-9 px-3 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveApiKey((e.target as HTMLInputElement).value);
              }}
              id="api-key-input"
            />
            <button
              onClick={() => {
                const input = document.getElementById('api-key-input') as HTMLInputElement;
                if (input.value) saveApiKey(input.value);
              }}
              className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              حفظ
            </button>
          </div>
          {selectedFile && apiKey && (
            <button
              onClick={() => processFile(selectedFile)}
              className="mt-3 h-9 px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              متابعة تحليل الملف
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-red-700">{error}</div>
            <button onClick={() => { setError(''); setStep(1); }} className="text-[11px] text-red-500 hover:underline mt-1">حاول مرة أخرى</button>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between gap-3">
          {[
            { n: 1, label: 'رفع الملف', icon: Upload },
            { n: 2, label: 'تحليل بالـ AI', icon: Sparkles },
            { n: 3, label: 'مراجعة وتعديل', icon: Edit },
            { n: 4, label: 'حفظ النتيجة', icon: CheckCircle2 }
          ].map((s, i, arr) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2.5 flex-1">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                  step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground/80'
                }`}>
                  {step > s.n ? <Check className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] text-muted-foreground/80">الخطوة {s.n}</div>
                  <div className={`text-[12px] font-medium ${step >= s.n ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-px ${step > s.n ? 'bg-primary' : 'bg-border'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && !error && (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-fadeIn">
          <div className="p-8">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFE2A8] to-[#E8B96B] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-[#7A5A1A]" />
              </div>
              <h2 className="text-[18px] font-semibold text-foreground mb-2">ارفع عرض السعر</h2>
              <p className="text-[13px] text-muted-foreground mb-6">يدعم PDF أو صور - حد أقصى 10MB</p>
              
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border hover:border-[#1A1A1A] rounded-lg p-10 cursor-pointer bg-background hover:bg-card transition-colors">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp" 
                  onChange={handleFileSelect} 
                />
                <Upload className="w-10 h-10 text-muted-foreground/80 mx-auto mb-3" />
                <div className="text-[14px] font-medium text-foreground mb-1">اضغط أو اسحب الملف هنا</div>
                <div className="text-[11px] text-muted-foreground/80">PDF, JPG, PNG, WebP حتى 10MB</div>
              </div>
              {!apiKey && (
                <p className="text-[11px] text-amber-600 mt-3 flex items-center justify-center gap-1">
                  <Key className="w-3 h-3" />
                  تحتاج مفتاح Gemini API أولاً — اضغط الزر أعلاه
                </p>
              )}
            </div>
          </div>
          
          <div className="border-t border-border bg-background px-8 py-5">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <FeatureMini icon={Zap} title="استخراج فوري" desc="نتائج في أقل من 10 ثواني" />
              <FeatureMini icon={Shield} title="آمن 100%" desc="ملفاتك مشفّرة وخاصة" />
              <FeatureMini icon={CheckCircle2} title="دقة عالية" desc="مدعوم بـ Gemini AI" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 2 && (
        <div className="bg-card border border-border rounded-lg p-12 text-center animate-fadeIn">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-5">
            <Loader2 className="w-7 h-7 text-primary-foreground animate-spin" />
          </div>
          <h2 className="text-[16px] font-semibold text-foreground mb-2">جاري تحليل الملف...</h2>
          <p className="text-[13px] text-muted-foreground mb-1">{fileName}</p>
          <p className="text-[11px] text-muted-foreground/70 mb-8">Gemini AI يستخرج البيانات الآن</p>
          
          <div className="max-w-md mx-auto space-y-2 text-right">
            <ProcessStep label="رفع الملف وتجهيزه" done={subStep >= 1} loading={subStep === 0} />
            <ProcessStep label="إرسال للذكاء الاصطناعي (Gemini)" done={subStep >= 2} loading={subStep === 1} />
            <ProcessStep label="تحليل وهيكلة البيانات" done={subStep >= 3} loading={subStep === 2} />
            <ProcessStep label="مراجعة النتائج" done={subStep >= 4} loading={subStep === 3} />
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && editData && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#F0FAF4] border border-[#22C55E]/20 rounded-lg p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#22C55E] rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-[#15803D]">تم استخراج البيانات بنجاح</div>
              <div className="text-[12px] text-[#15803D]/80 mt-0.5">
                دقة الاستخراج: <span className="font-bold">{editData.confidence || 0}%</span> · {editData.items?.length || 0} بنود تم استخراجها · راجع البيانات قبل الحفظ
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* File Preview */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold">
                  <FileImage className="w-3.5 h-3.5" />
                  <span>الملف الأصلي</span>
                </div>
              </div>
              <div className="p-4">
                <div className="bg-background border border-border rounded aspect-[3/4] flex items-center justify-center text-muted-foreground/80">
                  <div className="text-center">
                    <FileType className="w-10 h-10 mx-auto mb-2" />
                    <div className="text-[12px] font-medium text-foreground">{fileName}</div>
                    <div className="text-[11px] mt-0.5">{fileSize}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Data - Editable */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#A88732]" />
                  <span>البيانات المستخرجة</span>
                </div>
                <span className="text-[10px] bg-[#F0FAF4] text-[#15803D] px-1.5 py-0.5 rounded font-medium">قابل للتعديل</span>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="الشركة المُصدِرة">
                    <input 
                      value={editData.company_name || ''} 
                      onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                      className="bg-background border border-border rounded h-9 px-3 text-[12px] w-full outline-none focus:border-primary/50"
                    />
                  </Field>
                  <Field label="رقم العرض">
                    <input 
                      value={editData.quotation_number || ''} 
                      onChange={(e) => setEditData({ ...editData, quotation_number: e.target.value })}
                      className="bg-background border border-border rounded h-9 px-3 text-[12px] w-full outline-none focus:border-primary/50 font-mono"
                    />
                  </Field>
                  <Field label="التاريخ">
                    <input 
                      type="date"
                      value={editData.date || ''} 
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      className="bg-background border border-border rounded h-9 px-3 text-[12px] w-full outline-none focus:border-primary/50"
                    />
                  </Field>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-muted-foreground mb-2">البنود المستخرجة ({editData.items?.length || 0} بنود)</div>
                  <div className="border border-border rounded overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-[12px]">
                        <thead className="bg-background border-b border-border text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                          <tr>
                            <th className="text-right font-medium px-3 py-2">الصنف</th>
                            <th className="text-center font-medium px-3 py-2 w-16">الكمية</th>
                            <th className="text-center font-medium px-3 py-2 w-20">السعر</th>
                            <th className="text-left font-medium px-3 py-2 w-24">الإجمالي</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editData.items?.map((item, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="px-3 py-1.5">
                                <input
                                  value={item.name}
                                  onChange={(e) => updateEditItem(idx, 'name', e.target.value)}
                                  className="w-full bg-transparent outline-none focus:bg-background px-1 py-1 rounded"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => updateEditItem(idx, 'qty', Number(e.target.value))}
                                  className="w-full text-center bg-transparent outline-none focus:bg-background px-1 py-1 rounded tabular-nums"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => updateEditItem(idx, 'price', Number(e.target.value))}
                                  className="w-full text-center bg-transparent outline-none focus:bg-background px-1 py-1 rounded tabular-nums"
                                />
                              </td>
                              <td className="px-3 py-2.5 text-left tabular-nums font-medium">{(item.qty * item.price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-background border-t border-border text-[12px]">
                          <tr>
                            <td colSpan={3} className="px-3 py-2 text-right text-muted-foreground">الإجمالي قبل الضريبة</td>
                            <td className="px-3 py-2 text-left tabular-nums">{editData.subtotal?.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-3 py-2 text-right text-muted-foreground">الضريبة ({editData.tax_rate || 15}%)</td>
                            <td className="px-3 py-2 text-left tabular-nums">{editData.tax_amount?.toLocaleString()}</td>
                          </tr>
                          <tr className="border-t border-border">
                            <td colSpan={3} className="px-3 py-3 text-right font-semibold">الإجمالي النهائي</td>
                            <td className="px-3 py-3 text-left tabular-nums font-semibold text-[14px]">{editData.total?.toLocaleString()} ر.س</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {editData.notes && (
                  <div>
                    <div className="text-[11px] font-medium text-muted-foreground mb-1">ملاحظات مستخرجة</div>
                    <div className="text-[12px] text-foreground bg-amber-50 border border-amber-200 rounded p-3 whitespace-pre-line">{editData.notes}</div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button className="h-9 px-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>تحويل لفاتورة</span>
                  </button>
                  <button className="h-9 px-3 bg-card border border-border rounded-md text-[12px] hover:bg-muted flex items-center gap-1.5 transition-colors">
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>حفظ كعرض سعر</span>
                  </button>
                  <button onClick={() => { setStep(1); setExtractedData(null); setEditData(null); setError(''); }} className="h-9 px-3 text-[12px] text-muted-foreground hover:bg-muted rounded-md transition-colors">رفع ملف جديد</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProcessStep({ label, done, loading }: any) {
  return (
    <div className="flex items-center gap-2.5 text-right">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-[#22C55E] text-primary-foreground' :
        loading ? 'bg-primary' :
        'bg-muted'
      }`}>
        {done ? <Check className="w-3 h-3" strokeWidth={3} /> :
         loading ? <Loader2 className="w-3 h-3 text-primary-foreground animate-spin" /> :
         <div className="w-1 h-1 bg-[#9B9B9B] rounded-full"></div>}
      </div>
      <div className={`text-[12px] ${done ? 'text-[#15803D]' : loading ? 'text-foreground font-medium' : 'text-muted-foreground/80'}`}>
        {label}
      </div>
    </div>
  );
}

function FeatureMini({ icon: Icon, title, desc }: any) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center mx-auto mb-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-[12px] font-medium text-foreground">{title}</div>
      <div className="text-[10px] text-muted-foreground/80 mt-0.5">{desc}</div>
    </div>
  );
}
