const fs = require('fs');

// ===== Update i18n dictionaries with remaining keys =====
const arContent = fs.readFileSync('src/i18n/ar.ts', 'utf8');
const enContent = fs.readFileSync('src/i18n/en.ts', 'utf8');

// Remove closing "}" and add new keys
const newArKeys = `  ,
  pages_extra: {
    reports: {
      title: 'التقارير والإحصائيات',
      subtitle: 'تقارير ضريبية ومالية للشركة الحالية',
      quarterly_tax: 'تقرير الضريبة لربع السنة',
      tax_report: 'تقرير الإقرارات الضريبية',
      sales_performance: 'أداء المبيعات',
      view_report: 'عرض التقرير'
    },
    entities: {
      title: 'إدارة الشركات',
      subtitle: 'تستطيع إدارة حتى 3 شركات في باقتك الحالية',
      add: 'إضافة شركة جديدة',
      active_now: 'نشطة حالياً',
      enter: 'دخول للشركة',
      invoices_issued: 'فاتورة مصدرة',
      legal_name: 'الاسم التجاري للشركة',
      legal_type: 'الكيان القانوني',
      cr_number: 'السجل التجاري',
      tax_number: 'الرقم الضريبي (TIN)',
      saving: 'جاري الحفظ...',
      save_company: 'حفظ الشركة'
    },
    setup: {
      title: 'أضف شركتك الأولى',
      subtitle: 'تهانينا على اشتراكك! للبدء، يُرجى إدخال البيانات الضريبية لشركتك.',
      cta: 'إضافة الشركة والبدء',
      tax_hint: 'يجب أن يتكون من 15 رقماً لقبول الفواتير من ZATCA.'
    }
  }
};`;

const newEnKeys = `  ,
  pages_extra: {
    reports: {
      title: 'Reports & Statistics',
      subtitle: 'Tax and financial reports for current company',
      quarterly_tax: 'Quarterly Tax Report',
      tax_report: 'Tax Declaration Report',
      sales_performance: 'Sales Performance',
      view_report: 'View Report'
    },
    entities: {
      title: 'Company Management',
      subtitle: 'You can manage up to 3 companies in your current plan',
      add: 'Add New Company',
      active_now: 'Currently Active',
      enter: 'Switch to Company',
      invoices_issued: 'Issued Invoice',
      legal_name: 'Company Trade Name',
      legal_type: 'Legal Entity Type',
      cr_number: 'Commercial Registration',
      tax_number: 'Tax Number (TIN)',
      saving: 'Saving...',
      save_company: 'Save Company'
    },
    setup: {
      title: 'Add Your First Company',
      subtitle: 'Welcome! To start using the system, please enter your company tax and commercial details.',
      cta: 'Add Company & Get Started',
      tax_hint: 'Must be 15 digits for ZATCA invoice compliance.'
    }
  }
};`;

// Append the new keys to the existing dictionaries by replacing the closing "};""
const updatedAr = arContent.replace(/\};\s*$/, newArKeys);
const updatedEn = enContent.replace(/\};\s*$/, newEnKeys);

fs.writeFileSync('src/i18n/ar.ts', updatedAr, 'utf8');
fs.writeFileSync('src/i18n/en.ts', updatedEn, 'utf8');

console.log('Dictionaries updated!');

// ===== REPORTS PAGE =====
let reports = fs.readFileSync('src/app/reports/page.tsx', 'utf8');
if (!reports.includes('useTranslation')) {
  reports = `"use client";\n\nimport React from 'react';\nimport { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';\nimport { useTranslation } from '@/hooks/useTranslation';\n\nexport default function Reports() {\n  const { t } = useTranslation();\n  return (\n    <div className="space-y-5">\n      <div className="flex items-end justify-between flex-wrap gap-4">\n        <div>\n          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">{t('pages_extra.reports.title')}</h1>\n          <p className="text-[13px] text-muted-foreground mt-1">{t('pages_extra.reports.subtitle')}</p>\n        </div>\n        <div className="flex items-center gap-2">\n          <button className="flex items-center gap-1.5 h-8 px-3 bg-primary hover:bg-primary text-primary-foreground rounded-md text-[12px] font-medium">\n            <Download className="w-3.5 h-3.5" />\n            <span>{t('pages_extra.reports.quarterly_tax')}</span>\n          </button>\n        </div>\n      </div>\n\n      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">\n        <div className="border border-border rounded-lg p-8 text-center bg-card">\n            <BarChart3 className="w-12 h-12 text-muted-foreground/80 mx-auto mb-4" />\n            <h3 className="text-[16px] font-medium text-foreground">{t('pages_extra.reports.tax_report')}</h3>\n            <p className="text-[13px] text-muted-foreground mt-2 mb-4">يعرض إجمالي المبيعات والضريبة المستحقة لهيئة الزكاة والدخل لفترة زمنية محددة بناءً على الفواتير المصدّرة.</p>\n            <button className="flex mx-auto items-center gap-1.5 h-8 px-4 bg-background border border-border rounded-md text-[12px] hover:bg-card hover:border-foreground/20 transition-colors">\n              {t('pages_extra.reports.view_report')}\n            </button>\n        </div>\n        \n        <div className="border border-border rounded-lg p-8 text-center bg-card">\n            <TrendingUp className="w-12 h-12 text-muted-foreground/80 mx-auto mb-4" />\n            <h3 className="text-[16px] font-medium text-foreground">{t('pages_extra.reports.sales_performance')}</h3>\n            <p className="text-[13px] text-muted-foreground mt-2 mb-4">تحليل المبيعات حسب العميل، الفروع، أو المنتجات لقياس مؤشرات الأداء بشكل دقيق ومقارنتها عبر الفترات.</p>\n            <button className="flex mx-auto items-center gap-1.5 h-8 px-4 bg-background border border-border rounded-md text-[12px] hover:bg-card hover:border-foreground/20 transition-colors">\n              {t('pages_extra.reports.view_report')}\n            </button>\n        </div>\n      </div>\n    </div>\n  );\n}\n`;
  fs.writeFileSync('src/app/reports/page.tsx', reports, 'utf8');
  console.log('Reports translated!');
}

// ===== ENTITIES PAGE =====
let entities = fs.readFileSync('src/app/entities/page.tsx', 'utf8');
if (!entities.includes('useTranslation')) {
  entities = entities.replace(
    "import { Plus, Building2, Settings, Shield, Loader2 } from 'lucide-react';",
    "import { Plus, Building2, Settings, Shield, Loader2 } from 'lucide-react';\nimport { useTranslation } from '@/hooks/useTranslation';"
  );
  entities = entities.replace(
    "  const { activeEntity, setActiveEntity } = useStore();",
    "  const { activeEntity, setActiveEntity } = useStore();\n  const { t } = useTranslation();"
  );
  // Translate key strings
  entities = entities.replace(/>إدارة الشركات</g, ">{t('pages_extra.entities.title')}<");
  entities = entities.replace(/>تستطيع إدارة حتى 3 شركات في باقتك الحالية</g, ">{t('pages_extra.entities.subtitle')}<");
  entities = entities.replace(/>إضافة شركة جديدة</g, ">{t('pages_extra.entities.add')}<");
  entities = entities.replace(/>نشطة حالياً</g, ">{t('pages_extra.entities.active_now')}<");
  entities = entities.replace(/>دخول للشركة</g, ">{t('pages_extra.entities.enter')}<");
  entities = entities.replace(/>فاتورة مصدرة</g, ">{t('pages_extra.entities.invoices_issued')}<");
  entities = entities.replace(/>الرقم الضريبي</g, ">{t('pages_extra.entities.tax_number')}<");
  entities = entities.replace(/>السجل التجاري</g, ">{t('pages_extra.entities.cr_number')}<");
  entities = entities.replace(/>إضافة شركة جديدة</g, ">{t('pages_extra.entities.add')}<");
  entities = entities.replace(/'جاري الحفظ\.\.\.'/g, "t('pages_extra.entities.saving')");
  entities = entities.replace(/'حفظ الشركة'/g, "t('pages_extra.entities.save_company')");
  entities = entities.replace(/: 'إلغاء'/g, ": t('common.cancel')");
  fs.writeFileSync('src/app/entities/page.tsx', entities, 'utf8');
  console.log('Entities translated!');
}

// ===== SETUP PAGE =====
let setup = fs.readFileSync('src/app/setup/page.tsx', 'utf8');
if (!setup.includes('useTranslation')) {
  setup = setup.replace(
    "import { useStore } from '@/store/useStore';",
    "import { useStore } from '@/store/useStore';\nimport { useTranslation } from '@/hooks/useTranslation';"
  );
  setup = setup.replace(
    "  const { setActiveEntity } = useStore();",
    "  const { setActiveEntity } = useStore();\n  const { t } = useTranslation();"
  );
  setup = setup.replace(/>أضف شركتك الأولى</g, ">{t('pages_extra.setup.title')}<");
  setup = setup.replace(/تهانينا على اشتراكك في فاتورة إنتربرايز! للبدء في استخدام النظام، يُرجى إدخال البيانات الضريبية والتجارية لشركتك\./g, "{t('pages_extra.setup.subtitle')}");
  setup = setup.replace(/>إضافة الشركة والبدء</g, ">{t('pages_extra.setup.cta')}<");
  fs.writeFileSync('src/app/setup/page.tsx', setup, 'utf8');
  console.log('Setup translated!');
}

console.log('\n✅ All remaining pages translated!');
