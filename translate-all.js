const fs = require('fs');

// ===== CUSTOMERS PAGE =====
let customers = fs.readFileSync('src/app/customers/page.tsx', 'utf8');

if (!customers.includes('useTranslation')) {
  customers = customers.replace(
    "\"use client\";",
    "\"use client\";"
  );
  customers = customers.replace(
    /import React.*?from 'react';/,
    match => match + "\nimport { useTranslation } from '@/hooks/useTranslation';"
  );
}
// Add hook inside component
customers = customers.replace(
  /export default function.*?\(\) \{/,
  match => match + '\n  const { t } = useTranslation();'
);

const customerMappings = [
  ['العملاء', "t('pages.customers.title')"],
  ['إدارة معلومات عملائك', "t('pages.customers.subtitle')"],
  ['إضافة عميل', "t('pages.customers.add')"],
  ['بحث في العملاء...', "t('pages.customers.search')"],
  ['اسم العميل', "t('pages.customers.name')"],
  ['البريد الإلكتروني', "t('pages.customers.email')"],
  ['الهاتف', "t('pages.customers.phone')"],
  ['المدينة', "t('pages.customers.city')"],
  ['الرقم الضريبي', "t('pages.customers.vat')"],
  ['اسم الشركة / الشخص', "t('pages.customers.company')"],
  ['إلغاء', "t('common.cancel')"],
  ['حفظ', "t('common.save')"],
];

customerMappings.forEach(([ar, enKey]) => {
  customers = customers.replace(new RegExp(`>\\s*${ar}\\s*<`, 'g'), `>${enKey}<`);
  customers = customers.replace(new RegExp(`placeholder="${ar}"`, 'g'), `placeholder={${enKey}}`);
  customers = customers.replace(new RegExp(`"${ar}"`, 'g'), `{${enKey}}`);
});

fs.writeFileSync('src/app/customers/page.tsx', customers, 'utf8');
console.log('Customers translated!');

// ===== INVOICES PAGE =====
let invoices = fs.readFileSync('src/app/invoices/page.tsx', 'utf8');

if (!invoices.includes('useTranslation')) {
  invoices = invoices.replace(
    /import React.*?from 'react';/,
    match => match + "\nimport { useTranslation } from '@/hooks/useTranslation';"
  );
  invoices = invoices.replace(
    /export default function.*?\(\) \{/,
    match => match + '\n  const { t } = useTranslation();'
  );
}

const invoiceMappings = [
  ['الفواتير', "t('pages.invoices.title')"],
  ['فاتورة جديدة', "t('pages.invoices.new')"],
  ['بحث في الفواتير...', "t('pages.invoices.search')"],
  ['رقم الفاتورة', "t('pages.invoices.number')"],
  ['العميل', "t('pages.invoices.customer')"],
  ['التاريخ', "t('pages.invoices.date')"],
  ['الاستحقاق', "t('pages.invoices.due')"],
  ['المبلغ', "t('pages.invoices.amount')"],
  ['الحالة', "t('pages.invoices.status')"],
  ['الكل', "t('pages.invoices.all')"],
  ['مدفوعة', "t('pages.invoices.paid')"],
  ['معلقة', "t('pages.invoices.pending')"],
  ['متأخرة', "t('pages.invoices.overdue')"],
];

invoiceMappings.forEach(([ar, enKey]) => {
  invoices = invoices.replace(new RegExp(`>\\s*${ar}\\s*<`, 'g'), `>${enKey}<`);
  invoices = invoices.replace(new RegExp(`placeholder="${ar}"`, 'g'), `placeholder={${enKey}}`);
  invoices = invoices.replace(new RegExp(`"${ar}"`, 'g'), `{${enKey}}`);
});

fs.writeFileSync('src/app/invoices/page.tsx', invoices, 'utf8');
console.log('Invoices translated!');

// ===== QUOTATIONS PAGE =====
let quotations = fs.readFileSync('src/app/quotations/page.tsx', 'utf8');

if (!quotations.includes('useTranslation')) {
  quotations = quotations.replace(
    /import React.*?from 'react';/,
    match => match + "\nimport { useTranslation } from '@/hooks/useTranslation';"
  );
  quotations = quotations.replace(
    /export default function.*?\(\) \{/,
    match => match + '\n  const { t } = useTranslation();'
  );
}

const quotationMappings = [
  ['عروض الأسعار', "t('pages.quotations.title')"],
  ['عرض سعر جديد', "t('pages.quotations.new')"],
  ['رفع عرض بالذكاء الاصطناعي', "t('pages.quotations.ai_upload')"],
  ['بحث في عروض الأسعار...', "t('pages.quotations.search')"],
  ['رقم العرض', "t('pages.quotations.number')"],
  ['العميل', "t('pages.quotations.customer')"],
  ['تاريخ الإنشاء', "t('pages.quotations.created')"],
  ['تاريخ الانتهاء', "t('pages.quotations.expires')"],
  ['المبلغ', "t('pages.quotations.amount')"],
  ['الحالة', "t('pages.quotations.status')"],
  ['مقبول', "t('pages.quotations.accepted')"],
  ['مرسل', "t('pages.quotations.sent')"],
  ['مسودة', "t('pages.quotations.draft')"],
  ['مرفوض', "t('pages.quotations.rejected')"],
];

quotationMappings.forEach(([ar, enKey]) => {
  quotations = quotations.replace(new RegExp(`>\\s*${ar}\\s*<`, 'g'), `>${enKey}<`);
  quotations = quotations.replace(new RegExp(`placeholder="${ar}"`, 'g'), `placeholder={${enKey}}`);
  quotations = quotations.replace(new RegExp(`"${ar}"`, 'g'), `{${enKey}}`);
});

fs.writeFileSync('src/app/quotations/page.tsx', quotations, 'utf8');
console.log('Quotations translated!');

// ===== PRODUCTS PAGE =====
let products = fs.readFileSync('src/app/products/page.tsx', 'utf8');
if (!products.includes('useTranslation')) {
  products = products.replace(
    /import React.*?from 'react';/,
    match => match + "\nimport { useTranslation } from '@/hooks/useTranslation';"
  );
  products = products.replace(
    /export default function.*?\(\) \{/,
    match => match + '\n  const { t } = useTranslation();'
  );
}

const productMappings = [
  ['المنتجات والخدمات', "t('pages.products.title')"],
  ['إضافة منتج', "t('pages.products.add')"],
  ['بحث في المنتجات...', "t('pages.products.search')"],
  ['اسم المنتج / الخدمة', "t('pages.products.name')"],
  ['الوصف', "t('pages.products.description')"],
  ['السعر', "t('pages.products.price')"],
  ['الوحدة', "t('pages.products.unit')"],
  ['ضريبة القيمة المضافة', "t('pages.products.vat')"],
  ['رمز المنتج', "t('pages.products.code')"],
];

productMappings.forEach(([ar, enKey]) => {
  products = products.replace(new RegExp(`>\\s*${ar}\\s*<`, 'g'), `>${enKey}<`);
  products = products.replace(new RegExp(`placeholder="${ar}"`, 'g'), `placeholder={${enKey}}`);
});

fs.writeFileSync('src/app/products/page.tsx', products, 'utf8');
console.log('Products translated!');

console.log('\n✅ All pages translated successfully!');
