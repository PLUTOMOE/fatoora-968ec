"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Send, Download, MoreHorizontal, CheckCircle2, CheckCircle } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function InvoiceDetail() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => router.push('/invoices')} className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-[20px] font-semibold text-foreground">فاتورة #INV-2026-127</h1>
              <StatusPill status="paid" />
            </div>
            <div className="text-[12px] text-muted-foreground/80">صادرة بتاريخ 17 أبريل 2026 · مؤسسة النخبة للمقاولات</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 bg-card border border-border rounded-md text-[12px] hover:border-border/80 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
          <button className="h-8 px-3 bg-card border border-border rounded-md text-[12px] hover:border-border/80 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-card border border-border rounded-md hover:border-border/80">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8">
          <div className="flex items-start justify-between pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-md flex items-center justify-center text-primary-foreground font-bold text-[16px]">AMT</div>
                <div>
                  <div className="font-semibold text-[16px] text-foreground">عاصمة المجد للتجارة</div>
                  <div className="text-[11px] text-muted-foreground/80">شركة ذات مسؤولية محدودة</div>
                </div>
              </div>
              <div className="text-[12px] text-muted-foreground space-y-0.5">
                <div>الرياض، المملكة العربية السعودية</div>
                <div>الرقم الضريبي: <span className="font-mono">300123456000003</span></div>
                <div>السجل التجاري: <span className="font-mono">1010123456</span></div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-1">فاتورة ضريبية</div>
              <div className="font-mono text-[20px] font-semibold text-foreground mb-2">INV-2026-127</div>
              <div className="text-[11px] text-muted-foreground space-y-0.5">
                <div>التاريخ: <span className="text-foreground">17 أبريل 2026</span></div>
                <div>الاستحقاق: <span className="text-foreground">17 مايو 2026</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 py-6 border-b border-border">
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2">فاتورة إلى</div>
              <div className="font-semibold text-[14px] text-foreground mb-1">مؤسسة النخبة للمقاولات</div>
              <div className="text-[12px] text-muted-foreground space-y-0.5">
                <div>الرياض، حي الملقا</div>
                <div>الرقم الضريبي: <span className="font-mono">310987654000003</span></div>
                <div>info@elite-cont.sa</div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="text-center">
                <div className="w-24 h-24 bg-card border border-border rounded p-1.5 mb-1">
                  <div className="grid grid-cols-12 gap-[1px] w-full h-full">
                    {Array.from({length: 144}).map((_, i) => (
                      <div key={i} className={`aspect-square ${Math.random() > 0.5 ? 'bg-primary' : 'bg-card'}`}></div>
                    ))}
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground/80">QR Code · ZATCA</div>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-border">
            <div className="overflow-x-auto overflow-y-hidden">
<table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground/80 uppercase tracking-wider">
                  <th className="text-right font-medium py-2">#</th>
                  <th className="text-right font-medium py-2">الصنف</th>
                  <th className="text-center font-medium py-2 w-16">الكمية</th>
                  <th className="text-center font-medium py-2 w-20">السعر</th>
                  <th className="text-center font-medium py-2 w-16">الضريبة</th>
                  <th className="text-left font-medium py-2 w-24">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 text-muted-foreground/80">1</td>
                  <td className="py-3">
                    <div className="font-medium text-foreground mb-0.5">تركيب نظام تكييف مركزي</div>
                    <div className="text-[10px] text-muted-foreground/80">مكيف سبليت 24,000 وحدة - تركيب كامل</div>
                  </td>
                  <td className="py-3 text-center tabular-nums">1</td>
                  <td className="py-3 text-center tabular-nums">10,000</td>
                  <td className="py-3 text-center text-muted-foreground">15%</td>
                  <td className="py-3 text-left tabular-nums font-medium">11,500 ر.س</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted-foreground/80">2</td>
                  <td className="py-3">
                    <div className="font-medium text-foreground mb-0.5">صيانة دورية ربع سنوية</div>
                    <div className="text-[10px] text-muted-foreground/80">صيانة شاملة لمدة سنة كاملة</div>
                  </td>
                  <td className="py-3 text-center tabular-nums">4</td>
                  <td className="py-3 text-center tabular-nums">200</td>
                  <td className="py-3 text-center text-muted-foreground">15%</td>
                  <td className="py-3 text-left tabular-nums font-medium">920 ر.س</td>
                </tr>
              </tbody>
            </table>
</div>
          </div>

          <div className="flex justify-end py-6">
            <div className="w-72 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الإجمالي قبل الضريبة</span>
                <span className="tabular-nums">10,800 ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                <span className="tabular-nums">1,620 ر.س</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold text-foreground">الإجمالي النهائي</span>
                <span className="text-[18px] font-semibold text-foreground tabular-nums">12,420 ر.س</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-md p-4 text-[12px]">
            <div className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2">الملاحظات والشروط</div>
            <ul className="text-muted-foreground space-y-1">
              <li>• الدفع خلال 30 يوم من تاريخ الفاتورة</li>
              <li>• الضمان لمدة سنة من تاريخ التركيب</li>
              <li>• لأي استفسار يرجى التواصل على: 0500000000</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-[12px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-3">حالة الدفع</h3>
            <div className="text-[20px] font-semibold text-[#22C55E] tabular-nums mb-1">12,420 ر.س</div>
            <div className="text-[11px] text-muted-foreground mb-4">تم الدفع بالكامل في 15 أبريل</div>
            
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-muted-foreground">طريقة الدفع</span><span>تحويل بنكي</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">تاريخ الدفع</span><span>15 أبريل 2026</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">مرجع</span><span className="font-mono text-[11px]">TRX-988234</span></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-[12px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-3">الجدول الزمني</h3>
            <div className="space-y-3">
              <Timeline icon={CheckCircle2} color="#22C55E" title="تم الدفع" desc="مؤسسة النخبة - 15 أبريل" />
              <Timeline icon={Send} color="#5B5BD6" title="تم الإرسال للعميل" desc="بالإيميل - 13 أبريل" />
              <Timeline icon={CheckCircle} color="#9B9B9B" title="تم إصدار الفاتورة" desc="بواسطة معاذ - 12 أبريل" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ icon: Icon, color, title, desc }: any) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15` }}>
        <Icon className="w-3 h-3" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-foreground">{title}</div>
        <div className="text-[11px] text-muted-foreground/80 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}
