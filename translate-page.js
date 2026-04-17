const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

if (!page.includes('useTranslation')) {
    page = page.replace(
        "import { useRouter } from 'next/navigation';", 
        "import { useRouter } from 'next/navigation';\nimport { useTranslation } from '@/hooks/useTranslation';"
    );
    page = page.replace(
        "  const router = useRouter();", 
        "  const router = useRouter();\n  const { t } = useTranslation();"
    );
}

// Translations map for page.tsx
const mappings = [
    ["لوحة التحكم", "{t('dashboard.title')}"],
    ["نظرة شاملة على نشاط شركتك المالي", "{t('dashboard.subtitle')}"],
    ["آخر 30 يوم", "{t('dashboard.last_30_days')}"],
    ["تصدير", "{t('dashboard.export')}"],
    ["عرض سعر جديد", "{t('dashboard.new_quotation')}"],
    ["فاتورة جديدة", "{t('dashboard.new_invoice')}"],
    ["إجمالي المبيعات", "{t('dashboard.total_sales')}"],
    ["ر.س", "{t('common.sar')}"],
    ["فواتير مدفوعة", "{t('dashboard.paid_invoices')}"],
    ["مستحقات قائمة", "{t('dashboard.pending_dues')}"],
    ["عروض نشطة", "{t('dashboard.active_quotes')}"],
    ["آخر الفواتير", "{t('dashboard.latest_invoices')}"],
    ["عرض الكل", "{t('dashboard.view_all')}"],
    ["الفاتورة", "{t('dashboard.invoice')}"],
    ["العميل", "{t('dashboard.customer')}"],
    ["الحالة", "{t('dashboard.status')}"],
    ["المبلغ", "{t('dashboard.amount')}"],
    ["إجراءات سريعة", "{t('dashboard.quick_actions')}"],
    ["إضافة عميل جديد", "{t('dashboard.add_customer')}"],
    ["إضافة منتج جديد", "{t('dashboard.add_product')}"],
    ["استخراج بالذكاء الاصطناعي", "{t('dashboard.ai_reader')}"],
    ["الخدمات الأكثر مبيعاً", "{t('dashboard.top_selling')}"]
];

mappings.forEach(([ar, en]) => {
    // Replace text between > and <
    let regex1 = new RegExp(`>\\s*${ar}\\s*<`, 'g');
    page = page.replace(regex1, `>${en}<`);
    
    // Replace attributes like label="لوحة التحكم"
    let regex2 = new RegExp(`([a-zA-Z]+)="\\s*${ar}\\s*"`, 'g');
    page = page.replace(regex2, `$1={${en.replace('{', '').replace('}', '')}}`);
});

fs.writeFileSync('src/app/page.tsx', page, 'utf8');
console.log("Dashboard Translated!");
