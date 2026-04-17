"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, ExternalLink, Trash2 } from 'lucide-react';
import { FilterButton } from '@/components/ui/FilterButton';

export default function QuotationForm() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">عرض سعر جديد</h1>
          <p className="text-[13px] text-muted-foreground mt-1">تعبئة بيانات العرض أو الاستيراد من مسودة</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/quotations')} className="h-8 px-3 text-[12px] text-muted-foreground hover:bg-muted rounded-md transition-colors">إلغاء</button>
          <button className="h-8 px-3 bg-card border border-border rounded-md text-[12px] hover:border-border/80 transition-colors">حفظ كمسودة</button>
          <button className="h-8 px-3 bg-primary hover:bg-primary text-primary-foreground rounded-md text-[12px] font-medium transition-colors">معاينة وإصدار</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">معلومات العميل</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">العميل</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                  <input type="text" placeholder="ابحث عن عميل موجود..." className="w-full pr-8 pl-3 h-9 bg-background border border-border rounded-md text-[13px] focus:outline-none focus:border-[#5B5BD6] focus:bg-card" />
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full flex items-center justify-center gap-2 h-9 bg-background border border-border hover:border-border/80 border-dashed rounded-md text-[12px] text-muted-foreground">
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة عميل جديد</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-background border border-border rounded-md flex items-start justify-between">
              <div>
                <div className="text-[13px] font-medium text-foreground mb-0.5">مؤسسة النخبة للمقاولات</div>
                <div className="text-[11px] text-muted-foreground space-y-0.5">
                  <div>الرقم الضريبي: <span className="font-mono">310987654000003</span></div>
                  <div>الرياض، حي الملقا</div>
                </div>
              </div>
              <button className="text-[11px] text-[#5B5BD6] hover:underline">تغيير</button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-foreground">البنود والمنتجات</h2>
              <button className="text-[12px] text-[#5B5BD6] hover:underline flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>إدراج من المكتبة</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <div className="overflow-x-auto overflow-y-hidden">
<table className="w-full text-[12px]">
                <thead className="bg-background border-b border-border text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                  <tr>
                    <th className="w-8 px-2 py-2.5"></th>
                    <th className="text-right font-medium px-3 py-2.5">وصف الصنف</th>
                    <th className="text-center font-medium px-3 py-2.5 w-20">الكمية</th>
                    <th className="text-center font-medium px-3 py-2.5 w-24">السعر</th>
                    <th className="text-center font-medium px-3 py-2.5 w-20">الضريبة</th>
                    <th className="text-left font-medium px-3 py-2.5 w-24">الإجمالي</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2 text-center text-muted-foreground/80 cursor-move">⋮⋮</td>
                    <td className="px-3 py-2">
                      <input type="text" value="تركيب نظام تكييف مركزي" className="w-full h-8 bg-transparent border-0 outline-none text-[13px] font-medium mb-1" />
                      <input type="text" value="مكيف سبليت 24,000 وحدة - تركيب كامل" className="w-full text-[11px] text-muted-foreground bg-transparent border-0 outline-none" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="number" value="1" className="w-full h-8 bg-background border border-border rounded text-center text-[13px]" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="text" value="10,000" className="w-full h-8 bg-background border border-border rounded text-center tabular-nums text-[13px]" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <select className="w-full h-8 bg-background border border-border rounded text-center text-[12px] text-muted-foreground">
                        <option>15%</option>
                        <option>0%</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-left tabular-nums font-medium">11,500 ر.س</td>
                    <td className="px-2 py-2 text-center">
                      <button className="w-6 h-6 flex items-center justify-center text-muted-foreground/80 hover:text-[#E5484D] hover:bg-[#FEF1F1] rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-2 py-2 text-center text-muted-foreground/80 cursor-move">⋮⋮</td>
                    <td className="px-3 py-2">
                      <input type="text" placeholder="اسم الصنف" className="w-full h-8 bg-transparent border-0 outline-none text-[13px] font-medium placeholder:text-muted-foreground/40 mb-1" />
                      <input type="text" placeholder="وصف إضافي (اختياري)" className="w-full text-[11px] text-muted-foreground bg-transparent border-0 outline-none placeholder:text-[#E5E5E5]" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="number" defaultValue="1" className="w-full h-8 bg-background border border-border rounded text-center text-[13px]" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="text" placeholder="0.00" className="w-full h-8 bg-background border border-border rounded text-center tabular-nums text-[13px]" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <select className="w-full h-8 bg-background border border-border rounded text-center text-[12px] text-muted-foreground">
                        <option>15%</option>
                        <option>0%</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-left tabular-nums font-medium text-muted-foreground/80">0.00 ر.س</td>
                    <td className="px-2 py-2 text-center"></td>
                  </tr>
                </tbody>
              </table>
</div>
            </div>
            
            <div className="p-4 border-t border-border">
              <button className="flex items-center gap-1.5 text-[12px] text-[#5B5BD6] font-medium hover:underline">
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سطر جديد</span>
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5">
            <h2 className="text-[14px] font-semibold text-foreground mb-4">الملاحظات والشروط</h2>
            <textarea 
              rows={4}
              placeholder="اكتب ملاحظاتك هنا أو أدرج من المكتبة الجاهزة..."
              className="w-full bg-background border border-border rounded-md p-3 text-[13px] text-foreground focus:outline-none focus:border-[#5B5BD6] focus:bg-card resize-none"
              defaultValue={`• الأسعار المذكورة سارية لمدة 15 يوم من تاريخ العرض.
• الدفع: 50% كدفعة مقدمة، و 50% عند الاستلام.
• مدة التنفيذ: 10 أيام عمل من تاريخ استلام الدفعة المقدمة.`}
            />
            <div className="mt-2 flex justify-end">
              <button className="text-[11px] text-[#5B5BD6] hover:underline">إدراج من الملاحظات الجاهزة</button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-background border border-border rounded-lg p-5">
            <h3 className="text-[12px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-4">ملخص العرض</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الإجمالي قبل الضريبة</span>
                <span className="tabular-nums">10,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">خصم</span>
                <span className="tabular-nums text-[#E5484D]">-0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الضريبة (15%)</span>
                <span className="tabular-nums">1,500.00</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 mt-3">
                <span className="font-semibold text-foreground">الإجمالي النهائي (ر.س)</span>
                <span className="text-[18px] font-semibold text-foreground tabular-nums">11,500.00</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-[12px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-4">تفاصيل إضافية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">تاريخ الإصدار</label>
                <input type="date" defaultValue="2026-04-18" className="w-full h-9 bg-background border border-border rounded-md px-3 text-[12px] focus:outline-none focus:border-[#5B5BD6] focus:bg-card" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">صالح حتى</label>
                <input type="date" defaultValue="2026-05-03" className="w-full h-9 bg-background border border-border rounded-md px-3 text-[12px] focus:outline-none focus:border-[#5B5BD6] focus:bg-card" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">العملة</label>
                <select className="w-full h-9 bg-background border border-border rounded-md px-3 text-[12px] focus:outline-none focus:border-[#5B5BD6] focus:bg-card">
                  <option>الريال السعودي (SAR)</option>
                  <option>الدولار الأمريكي (USD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
