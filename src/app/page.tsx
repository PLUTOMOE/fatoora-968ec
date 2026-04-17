"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Calendar, Download, Plus, ChevronDown, ChevronLeft, Sparkles, Upload, ArrowUp, ArrowDownRight, ScrollText, Receipt, Users } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 bg-card border border-border rounded-md text-[12px] text-foreground hover:border-border/80">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('dashboard.last_30_days')}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground/80" />
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3 bg-card border border-border rounded-md text-[12px] text-foreground hover:border-border/80">
            <Download className="w-3.5 h-3.5" />
            <span>{t('dashboard.export')}</span>
          </button>
          <button onClick={() => router.push('/quotations/new')} className="group flex items-center gap-2 h-9 px-4 bg-card border border-border hover:border-[#5B5BD6] hover:bg-[#F8F8FF] text-foreground hover:text-[#5B5BD6] rounded-lg text-[12px] font-semibold transition-all hover:-translate-y-0.5 shadow-sm">
            <ScrollText className="w-3.5 h-3.5 text-muted-foreground/80 group-hover:text-[#5B5BD6] transition-colors" />
            <span>{t('dashboard.new_quotation')}</span>
          </button>
          <button onClick={() => router.push('/invoices')} className="group flex items-center gap-2 h-9 px-4 bg-gradient-to-l from-[#1A1A1A] to-[#2A2A2A] hover:from-[#000000] hover:to-[#1A1A1A] text-primary-foreground rounded-lg text-[12px] font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="w-5 h-5 rounded-md bg-card/10 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>{t('dashboard.new_invoice')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label={t('dashboard.total_sales')} value="284,500" unit={t('common.sar')} trend={12.5} sparkline={[40, 45, 42, 50, 48, 55, 60, 58, 65, 70, 68, 75]} />
        <KPICard label={t('dashboard.paid_invoices')} value="186,300" unit={t('common.sar')} trend={8.2} progress={65} />
        <KPICard label={t('dashboard.pending_dues')} value="48,200" unit={t('common.sar')} trend={-3.1} comparison="5 فواتير متأخرة" />
        <KPICard label={t('dashboard.active_quotes')} value="12" unit="عرض" trend={5} comparison="3 بانتظار الرد" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">{t('dashboard.latest_invoices')}</h3>
              <p className="text-[11px] text-muted-foreground/80 mt-0.5">5 فواتير من أصل 38</p>
            </div>
            <button onClick={() => router.push('/invoices')} className="text-[12px] text-[#5B5BD6] hover:underline flex items-center gap-1">{t('dashboard.view_all')}<ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          
          <div className="overflow-x-auto overflow-y-hidden">
<table className="w-full">
            <thead>
              <tr className="border-b border-border text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                <th className="text-right font-medium px-4 py-2">{t('dashboard.invoice')}</th>
                <th className="text-right font-medium px-4 py-2">{t('dashboard.customer')}</th>
                <th className="text-right font-medium px-4 py-2">{t('dashboard.status')}</th>
                <th className="text-left font-medium px-4 py-2">{t('dashboard.amount')}</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {[
                { num: 'INV-2026-127', customer: 'مؤسسة النخبة للمقاولات', status: 'paid', amount: '12,450', date: 'اليوم' },
                { num: 'INV-2026-126', customer: 'شركة الواحة للتجارة', status: 'overdue', amount: '8,750', date: 'أمس' },
                { num: 'INV-2026-125', customer: 'فهد العتيبي', status: 'pending', amount: '3,200', date: 'منذ يومين' },
                { num: 'INV-2026-124', customer: 'مكتب المحاسبة الذهبي', status: 'paid', amount: '15,800', date: 'منذ 3 أيام' },
                { num: 'INV-2026-123', customer: 'شركة البناء الحديث', status: 'paid', amount: '22,500', date: 'منذ 4 أيام' },
              ].map((row, i) => (
                <tr key={i} onClick={() => router.push(`/invoices/${row.num}`)} className="border-b border-border/50 last:border-0 hover:bg-background transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="font-mono text-[12px] text-foreground">{row.num}</div>
                    <div className="text-[11px] text-muted-foreground/80 mt-0.5">{row.date}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{row.customer}</td>
                  <td className="px-4 py-3"><StatusPill status={row.status as any} /></td>
                  <td className="px-4 py-3 text-left tabular-nums font-medium text-foreground">
                    {row.amount} <span className="text-[10px] text-muted-foreground/80 font-normal">{t('common.sar')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#FFE2A8] to-[#E8B96B] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#7A5A1A]" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground">قراءة AI</h3>
            </div>
            <span className="text-[10px] bg-[#FEF6E3] text-[#7A5A1A] px-1.5 py-0.5 rounded font-medium">جديد</span>
          </div>
          
          <div className="p-4">
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              ارفع أي عرض سعر خارجي (PDF أو صورة) واترك الذكاء الاصطناعي يستخرج البيانات ويحوّلها لفاتورة.
            </p>
            
            <div className="bg-background border border-border rounded-md p-3 mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-muted-foreground">الاستخدام الشهري</span>
                <span className="text-foreground font-medium tabular-nums">12 / 50</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#A88732] to-[#D4AC4A]" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <button onClick={() => router.push('/ai-reader')} className="w-full flex items-center justify-center gap-2 h-9 bg-primary hover:bg-primary text-primary-foreground rounded-md text-[12px] font-medium">
              <Upload className="w-3.5 h-3.5" />
              <span>ارفع ملف</span>
            </button>
          </div>
          
          <div className="border-t border-border px-4 py-2.5 bg-background">
            <div className="text-[11px] text-muted-foreground/80 mb-1">آخر استخراج</div>
            <div className="text-[12px] text-foreground font-medium">شركة التميز - 12 صنف</div>
            <div className="text-[10px] text-muted-foreground/80 mt-0.5">منذ 3 ساعات · دقة 94%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">الإيرادات الشهرية</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[24px] font-semibold text-foreground tabular-nums">284,500</span>
                <span className="text-[12px] text-muted-foreground/80">{t('common.sar')}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-medium text-[#22C55E] mr-2">
                  <ArrowUp className="w-3 h-3" />
                  12.5%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md">
              <button className="px-2 py-1 text-[11px] text-muted-foreground rounded">يوم</button>
              <button className="px-2 py-1 text-[11px] text-muted-foreground rounded">أسبوع</button>
              <button className="px-2 py-1 text-[11px] bg-card text-foreground rounded font-medium shadow-sm">شهر</button>
              <button className="px-2 py-1 text-[11px] text-muted-foreground rounded">سنة</button>
            </div>
          </div>
          
          <div className="h-[200px] flex items-end gap-2">
            {[
              { m: 'نوفمبر', v: 60 }, { m: 'ديسمبر', v: 75 }, { m: 'يناير', v: 55 },
              { m: 'فبراير', v: 85 }, { m: 'مارس', v: 70 }, { m: 'أبريل', v: 95, current: true }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded whitespace-nowrap">
                    {(bar.v * 3000).toLocaleString()} ر.س
                  </div>
                </div>
                <div className={`w-full rounded-sm transition-colors ${bar.current ? 'bg-primary' : 'bg-[#E8E8E8] group-hover:bg-[#D4D4D4]'}`} style={{ height: `${bar.v * 1.8}px` }}></div>
                <div className="text-[10px] text-muted-foreground/80">{bar.m}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-[13px] font-semibold text-foreground mb-1">توزيع الفواتير</h3>
          <p className="text-[11px] text-muted-foreground/80 mb-4">حسب الحالة</p>
          
          <div className="space-y-3">
            <DistRow color="#22C55E" label="مدفوعة" count="24" pct="63%" />
            <DistRow color="#F59E0B" label="مستحقة" count="9" pct="24%" />
            <DistRow color="#E5484D" label="متأخرة" count="5" pct="13%" />
          </div>
          
          <div className="mt-5 pt-4 border-t border-border">
            <div className="text-[11px] text-muted-foreground/80 mb-1">معدل التحصيل</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[20px] font-semibold text-foreground tabular-nums">87%</span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-[#22C55E]">
                <ArrowUp className="w-3 h-3" />
                4.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[12px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-3">الإجراءات السريعة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction icon={Sparkles} title="قراءة عرض خارجي" desc="حوّل أي عرض لفاتورة" badge="AI" onClick={() => router.push('/ai-reader')} />
          <QuickAction icon={ScrollText} title={t('dashboard.new_quotation')} desc="أنشئ عرض احترافي" onClick={() => router.push('/quotations/new')} />
          <QuickAction icon={Receipt} title="فاتورة سريعة" desc="فاتورة ضريبية في ثواني" onClick={() => router.push('/invoices')} />
          <QuickAction icon={Users} title="إضافة عميل" desc="سجّل عميل جديد" onClick={() => router.push('/customers')} />
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, unit, trend, sparkline, progress, comparison }: any) {
  const positive = trend > 0;
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="text-[12px] text-muted-foreground">{label}</div>
        <div className={`flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${positive ? 'text-[#22C55E]' : 'text-[#E5484D]'}`}>
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-[24px] font-semibold text-foreground tabular-nums leading-none">{value}</span>
        <span className="text-[11px] text-muted-foreground/80">{unit}</span>
      </div>
      {sparkline && (
        <div className="h-[28px] flex items-end gap-[2px]">
          {sparkline.map((v: number, i: number) => (
            <div key={i} className="flex-1 bg-[#E8E8E8] rounded-sm" style={{ height: `${v}%` }}></div>
          ))}
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-1">
          <div className="h-1 bg-muted rounded-full overflow-hidden mb-1">
            <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-[10px] text-muted-foreground/80">{progress}% من الإجمالي</div>
        </div>
      )}
      {comparison && (
        <div className="text-[11px] text-muted-foreground">{comparison}</div>
      )}
    </div>
  );
}

function DistRow({ color, label, count, pct }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm" style={{ background: color }}></div>
          <span className="text-[12px] text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] tabular-nums">
          <span className="text-muted-foreground/80">{pct}</span>
          <span className="text-foreground font-medium">{count}</span>
        </div>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ background: color, width: pct }}></div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, desc, badge, onClick }: any) {
  return (
    <button onClick={onClick} className="text-right p-4 bg-card border border-border rounded-lg hover:border-border/80 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-md bg-muted group-hover:bg-primary flex items-center justify-center transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
        </div>
        {badge && <span className="text-[10px] bg-gradient-to-r from-[#FFE2A8] to-[#E8B96B] text-[#7A5A1A] px-1.5 py-0.5 rounded font-bold">{badge}</span>}
      </div>
      <div className="text-[13px] font-medium text-foreground mb-0.5">{title}</div>
      <div className="text-[11px] text-muted-foreground/80">{desc}</div>
    </button>
  );
}
