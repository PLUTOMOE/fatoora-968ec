import QRCode from "qrcode";
import Link from "next/link";
import {
  addCompany,
  addInvoice,
  addQuotation,
  approvePendingUser,
  createInvoiceFromQuotation,
  logoutUser,
} from "@/app/actions";
import { AuthPanel } from "@/components/auth-panel";
import {
  getUserById,
  listClients,
  listCompanies,
  listInvoiceItems,
  listInvoices,
  listPendingUsers,
  listQuotationItems,
  listQuotations,
} from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { getSessionUserId } from "@/lib/session";
import { getZatcaQRCode } from "@/lib/zatca";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  invoiceSearch?: string;
  quotationSearch?: string;
}>;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function DocumentItemRows() {
  return (
    <div className="items-grid">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="item-row" key={index}>
          <label>
            <span>الوصف بالعربي</span>
            <input name={`item_description_ar_${index}`} placeholder="مثال: تصميم متجر" />
          </label>
          <label>
            <span>الوصف بالإنجليزي</span>
            <input
              name={`item_description_en_${index}`}
              placeholder="Example: Store design"
            />
          </label>
          <label>
            <span>الكمية</span>
            <input
              name={`item_quantity_${index}`}
              type="number"
              step="0.01"
              defaultValue={index === 0 ? "1" : ""}
            />
          </label>
          <label>
            <span>سعر الوحدة</span>
            <input
              name={`item_unit_price_${index}`}
              type="number"
              step="0.01"
              defaultValue={index === 0 ? "0" : ""}
            />
          </label>
          <label>
            <span>الضريبة %</span>
            <input
              name={`item_vat_rate_${index}`}
              type="number"
              step="0.01"
              defaultValue="15"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

function ClientInlineFields() {
  return (
    <div className="subpanel">
      <div className="subpanel-head">
        <h4>أو أضف عميلًا جديدًا داخل المستند</h4>
        <p>كل الحقول اختيارية، ويمكنك استخدام عميل موجود بدلًا من ذلك.</p>
      </div>

      <div className="form-grid form-grid-tight">
        <label>
          <span>نوع العميل</span>
          <select name="new_client_type" defaultValue="individual">
            <option value="individual">فرد</option>
            <option value="company">شركة / مؤسسة</option>
          </select>
        </label>
        <label>
          <span>اسم العميل</span>
          <input name="new_client_name" placeholder="الاسم أو اسم الشركة" />
        </label>
        <label>
          <span>العنوان</span>
          <input name="new_client_address" placeholder="المدينة أو العنوان" />
        </label>
        <label>
          <span>رقم الهاتف</span>
          <input name="new_client_phone" placeholder="05xxxxxxxx" />
        </label>
        <label>
          <span>السجل التجاري</span>
          <input
            name="new_client_commercial_registration"
            placeholder="اختياري للشركات"
          />
        </label>
        <label>
          <span>الرقم الضريبي</span>
          <input name="new_client_tax_number" placeholder="اختياري للشركات" />
        </label>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const userId = await getSessionUserId();
  const currentUser = userId ? getUserById(userId) : null;

  if (!currentUser || currentUser.status !== "approved") {
    return (
      <main className="shell">
        <AuthPanel />
      </main>
    );
  }

  const quotationSearch = params.quotationSearch?.trim() ?? "";
  const invoiceSearch = params.invoiceSearch?.trim() ?? "";
  const companies = listCompanies(currentUser.id);
  const clients = listClients(currentUser.id);
  const quotations = listQuotations(currentUser.id, quotationSearch);
  const invoices = listInvoices(currentUser.id, invoiceSearch);
  const pendingUsers = currentUser.is_admin ? listPendingUsers() : [];

  const quotationItemsMap = new Map(
    quotations.map((quotation) => [quotation.id, listQuotationItems(quotation.id)]),
  );
  const invoiceItemsMap = new Map(
    invoices.map((invoice) => [invoice.id, listInvoiceItems(invoice.id)]),
  );
  const invoiceQrCodes = new Map(
    await Promise.all(
      invoices.map(async (invoice) => {
        const qrCodeUrl = await QRCode.toDataURL(
          getZatcaQRCode(
            invoice.company_name,
            invoice.company_tax_number ?? "",
            invoice.issue_date,
            invoice.grand_total.toString(),
            invoice.vat_total.toString()
          ),
          { margin: 1, width: 140 },
        );

        return [invoice.id, qrCodeUrl] as const;
      }),
    ),
  );

  const recentDocuments = [
    ...invoices.slice(0, 4).map((invoice) => ({
      id: `invoice-${invoice.id}`,
      number: invoice.invoice_number,
      name: invoice.client_name || invoice.company_name,
      type: "فاتورة",
      date: invoice.issue_date,
      amount: formatCurrency(invoice.grand_total),
      status: invoice.vat_total > 0 ? "جاهزة" : "مسودة",
      href: `/invoices/${invoice.id}`,
    })),
    ...quotations.slice(0, 4).map((quotation) => ({
      id: `quotation-${quotation.id}`,
      number: quotation.quotation_number,
      name: quotation.client_name || quotation.company_name,
      type: "عرض سعر",
      date: quotation.issue_date,
      amount: formatCurrency(quotation.grand_total),
      status: quotation.expiry_date ? "نشط" : "مفتوح",
      href: `/quotations/${quotation.id}`,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const navItems = [
    { label: "لوحة التحكم", icon: "dashboard", active: true },
    { label: "الشركات", icon: "business" },
    { label: "العملاء", icon: "groups" },
    { label: "عروض الأسعار", icon: "description" },
    { label: "الفواتير", icon: "receipt_long" },
    { label: "طلبات التفعيل", icon: "verified_user" },
    { label: "الإعدادات", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-72 border-l border-slate-200 bg-slate-50 px-4 py-6 xl:flex xl:flex-col">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-lg font-bold text-primary-foreground">
            ف
          </div>
          <div>
            <h2 className="font-headline text-lg font-extrabold text-blue-950">فاتوره</h2>
            <p className="text-xs text-slate-500">لوحة الأعمال</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                item.active
                  ? "bg-blue-100 text-blue-900"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="space-y-3">
            <Link
              href="/workspace/quotations/new"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-blue-950 to-blue-700 px-4 py-3 font-bold text-primary-foreground shadow-lg shadow-blue-900/15 transition hover:opacity-95"
            >
              <span className="material-symbols-outlined">add</span>
              عرض سعر جديد
            </Link>
            <form action={logoutUser}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-card px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <span className="material-symbols-outlined">logout</span>
                تسجيل الخروج
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="xl:mr-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-card/95 shadow-sm backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <h1 className="font-headline text-xl font-bold text-blue-950">فاتوره</h1>
              <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  className="w-64 rounded-full border-0 bg-slate-100 py-2 pr-10 pl-4 text-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="بحث سريع..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <Link
                href="/workspace/quotations/new"
                className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-blue-900 lg:inline-flex"
              >
                إنشاء عرض سعر
              </Link>
              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900">
                {currentUser.full_name || currentUser.email}
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-blue-950">
                لوحة التحكم
              </h2>
              <p className="mt-2 text-slate-600">
                مرحبًا {currentUser.full_name || currentUser.email}. هذه نظرة سريعة على
                الشركات والعملاء وعروض الأسعار والفواتير.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="material-symbols-outlined text-blue-700">
                calendar_today
              </span>
              تحديث مباشر من قاعدة البيانات الحالية
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-full bg-blue-100 p-3 text-blue-900">
                  <span className="material-symbols-outlined">business</span>
                </div>
                <span className="text-sm font-medium text-emerald-600">جاهز</span>
              </div>
              <h3 className="text-sm text-slate-500">الشركات المسجلة</h3>
              <p className="font-headline mt-2 text-3xl font-extrabold text-slate-950">
                {companies.length}
              </p>
            </article>

            <article className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <span className="text-sm font-medium text-emerald-600">نشط</span>
              </div>
              <h3 className="text-sm text-slate-500">العملاء</h3>
              <p className="font-headline mt-2 text-3xl font-extrabold text-slate-950">
                {clients.length}
              </p>
            </article>

            <article className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className="text-sm font-medium text-slate-500">مفتوح</span>
              </div>
              <h3 className="text-sm text-slate-500">عروض الأسعار</h3>
              <p className="font-headline mt-2 text-3xl font-extrabold text-slate-950">
                {quotations.length}
              </p>
            </article>

            <article className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm ring-1 ring-slate-200">
              <div className="absolute -left-3 -top-3 h-24 w-24 rounded-full bg-blue-100/70 blur-2xl" />
              <div className="relative mb-4 flex items-start justify-between">
                <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="text-sm font-medium text-emerald-600">QR جاهز</span>
              </div>
              <h3 className="relative text-sm text-slate-500">إجمالي الفواتير</h3>
              <p className="font-headline relative mt-2 text-3xl font-extrabold text-blue-950">
                {invoices.length}
              </p>
            </article>
          </section>

          <section className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="font-headline text-xl font-bold text-slate-950">
                  المستندات الأخيرة
                </h3>
                <p className="text-sm text-slate-500">
                  آخر الفواتير وعروض الأسعار التي أُنشئت داخل النظام.
                </p>
              </div>
              <span className="text-sm font-medium text-blue-900">
                {recentDocuments.length} نتائج
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="overflow-x-auto overflow-y-hidden">
<table className="min-w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">الرقم المرجعي</th>
                    <th className="px-6 py-4 font-medium">العميل / الشركة</th>
                    <th className="px-6 py-4 font-medium">النوع</th>
                    <th className="px-6 py-4 font-medium">التاريخ</th>
                    <th className="px-6 py-4 font-medium">المبلغ</th>
                    <th className="px-6 py-4 font-medium">الحالة</th>
                    <th className="px-6 py-4 font-medium">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocuments.map((document) => (
                    <tr
                      key={document.id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-headline font-bold text-blue-900">
                        {document.number}
                      </td>
                      <td className="px-6 py-4">{document.name}</td>
                      <td className="px-6 py-4 text-slate-500">{document.type}</td>
                      <td className="px-6 py-4 text-slate-500">{document.date}</td>
                      <td className="px-6 py-4 font-semibold">{document.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {document.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={document.href} className="text-sm font-semibold text-blue-900">
                          فتح
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
</div>
            </div>
          </section>

          <div className="shell dashboard-shell !w-full !max-w-none !p-0">

      {currentUser.is_admin ? (
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">موافقات الحسابات</span>
              <h2>طلبات التفعيل المعلقة</h2>
            </div>
            <p>
              هذه الخطوة تعمل الآن من داخل لوحة الإدارة، ويمكن ربطها بإشعار بريد
              إلكتروني في المرحلة التالية.
            </p>
          </div>

          {pendingUsers.length ? (
            <div className="approval-list">
              {pendingUsers.map((pendingUser) => (
                <article className="approval-card" key={pendingUser.id}>
                  <div>
                    <strong>{pendingUser.full_name || "بدون اسم"}</strong>
                    <p>{pendingUser.email}</p>
                  </div>
                  <form action={approvePendingUser}>
                    <input type="hidden" name="user_id" value={pendingUser.id} />
                    <button type="submit" className="primary-button">
                      موافقة وتفعيل
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="لا توجد طلبات حالية"
              description="أي مستخدم جديد يسجل من شاشة الدخول سيظهر هنا للموافقة."
            />
          )}
        </section>
      ) : null}

      <section className="two-column-layout">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">إعدادات الشركات</span>
              <h2>إضافة شركة جديدة</h2>
            </div>
            <p>كل شركة لها اسم وسجل تجاري ورقم ضريبي وشعار مستقل.</p>
          </div>

          <form action={addCompany} className="stack-form">
            <div className="form-grid">
              <label>
                <span>اسم الشركة</span>
                <input name="name" placeholder="شركة الفاتورة العربية" required />
              </label>
              <label>
                <span>السجل التجاري</span>
                <input name="commercial_registration" placeholder="اختياري" />
              </label>
              <label>
                <span>الرقم الضريبي</span>
                <input name="tax_number" placeholder="اختياري" />
              </label>
              <label>
                <span>رقم الهاتف</span>
                <input name="phone" placeholder="اختياري" />
              </label>
              <label className="wide">
                <span>العنوان</span>
                <input name="address" placeholder="العنوان أو المدينة" />
              </label>
              <label className="wide">
                <span>رابط الشعار</span>
                <input name="logo_url" placeholder="https://..." />
              </label>
            </div>

            <button type="submit" className="primary-button">
              حفظ الشركة
            </button>
          </form>

          <div className="mini-list">
            {companies.length ? (
              companies.map((company) => (
                <article className="mini-card" key={company.id}>
                  <strong>{company.name}</strong>
                  <p>ضريبي: {company.tax_number || "غير مضاف"}</p>
                  <p>س.ت: {company.commercial_registration || "غير مضاف"}</p>
                </article>
              ))
            ) : (
              <EmptyState
                title="لا توجد شركات بعد"
                description="أضف أول شركة حتى تبدأ بإصدار عروض الأسعار والفواتير."
              />
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">المرحلة التالية</span>
              <h2>رفع PDF لعرض سعر خارجي</h2>
            </div>
            <p>
              تم تجهيز هذه النسخة لتستقبل لاحقًا رفع ملف PDF وقراءة بنوده تلقائيًا
              قبل إنشاء الفاتورة.
            </p>
          </div>

          <div className="upload-placeholder">
            <div className="upload-icon">PDF</div>
            <h3>قراءة عرض سعر خارجي</h3>
            <p>
              الخطوة القادمة ستكون دعم رفع الملف، استخراج النص، ثم اقتراح تعبئة
              البنود مباشرة داخل الفاتورة أو عرض السعر.
            </p>
          </div>
        </section>
      </section>

      <section className="two-column-layout">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">عروض الأسعار</span>
              <h2>إنشاء عرض سعر</h2>
            </div>
            <p>يمكنك اختيار عميل موجود أو إدخال عميل جديد من داخل نفس المستند.</p>
          </div>

          <form action={addQuotation} className="stack-form">
            <div className="form-grid">
              <label>
                <span>الشركة المصدرة</span>
                <select name="company_id" required defaultValue="">
                  <option value="" disabled>
                    اختر الشركة
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>رقم عرض السعر</span>
                <input name="quotation_number" placeholder="Q-2026-001" required />
              </label>
              <label>
                <span>تاريخ الإصدار</span>
                <input name="issue_date" type="date" defaultValue={today()} required />
              </label>
              <label>
                <span>تاريخ الانتهاء</span>
                <input name="expiry_date" type="date" />
              </label>
              <label className="wide">
                <span>عميل موجود</span>
                <select name="existing_client_id" defaultValue="">
                  <option value="">بدون اختيار / سأضيف عميلًا جديدًا</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {(client.name || "بدون اسم")} -{" "}
                      {client.type === "company" ? "شركة" : "فرد"}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ClientInlineFields />
            <DocumentItemRows />

            <label>
              <span>ملاحظات</span>
              <textarea
                name="notes"
                rows={4}
                placeholder="ملاحظات إضافية أو شروط وأحكام"
              />
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={companies.length === 0}
            >
              حفظ عرض السعر
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">الفواتير الضريبية</span>
              <h2>إنشاء فاتورة جديدة</h2>
            </div>
            <p>مع QR Code والبحث برقم الفاتورة وإمكانية إنشاء رقم يدوي.</p>
          </div>

          <form action={addInvoice} className="stack-form">
            <div className="form-grid">
              <label>
                <span>الشركة المصدرة</span>
                <select name="company_id" required defaultValue="">
                  <option value="" disabled>
                    اختر الشركة
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>رقم الفاتورة</span>
                <input name="invoice_number" placeholder="INV-2026-001" required />
              </label>
              <label>
                <span>تاريخ الإصدار</span>
                <input name="issue_date" type="date" defaultValue={today()} required />
              </label>
              <label className="wide">
                <span>عميل موجود</span>
                <select name="existing_client_id" defaultValue="">
                  <option value="">بدون اختيار / سأضيف عميلًا جديدًا</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {(client.name || "بدون اسم")} -{" "}
                      {client.type === "company" ? "شركة" : "فرد"}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ClientInlineFields />
            <DocumentItemRows />

            <label>
              <span>ملاحظات</span>
              <textarea name="notes" rows={4} placeholder="ملاحظات الفاتورة" />
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={companies.length === 0}
            >
              حفظ الفاتورة
            </button>
          </form>
        </section>
      </section>

      <section className="panel">
        <div className="panel-head split">
          <div>
            <span className="eyebrow">أرشيف عروض الأسعار</span>
            <h2>كل عروض الأسعار</h2>
          </div>

          <form className="search-form">
            <input
              name="quotationSearch"
              defaultValue={quotationSearch}
              placeholder="ابحث برقم عرض السعر"
            />
            <button type="submit" className="secondary-button">
              بحث
            </button>
          </form>
        </div>

        {quotations.length ? (
          <div className="document-list">
            {quotations.map((quotation) => (
              <article className="document-card" key={quotation.id}>
                <div className="document-head">
                  <div>
                    <span className="document-number">{quotation.quotation_number}</span>
                    <h3>{quotation.company_name}</h3>
                    <p>{quotation.client_name || "بدون عميل محدد"}</p>
                  </div>
                  <div className="document-meta">
                    <span>{quotation.issue_date}</span>
                    <strong>{formatCurrency(quotation.grand_total)}</strong>
                  </div>
                </div>

                <div className="items-table">
                  <div className="items-header">
                    <span>الوصف</span>
                    <span>الكمية</span>
                    <span>السعر</span>
                    <span>الإجمالي</span>
                  </div>
                  {quotationItemsMap.get(quotation.id)?.map((item) => (
                    <div className="items-body" key={item.id}>
                      <span>
                        {item.description_ar || item.description_en || "بند بدون وصف"}
                      </span>
                      <span>{item.quantity}</span>
                      <span>{formatCurrency(item.unit_price)}</span>
                      <span>{formatCurrency(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                <div className="document-footer">
                  <div>
                    <span>قبل الضريبة: {formatCurrency(quotation.subtotal)}</span>
                    <span>الضريبة: {formatCurrency(quotation.vat_total)}</span>
                  </div>

                  <div className="inline-actions">
                    <Link
                      href={`/quotations/${quotation.id}`}
                      className="secondary-button"
                    >
                      فتح المستند
                    </Link>

                    <form action={createInvoiceFromQuotation} className="inline-form">
                      <input type="hidden" name="quotation_id" value={quotation.id} />
                      <input
                        name="invoice_number"
                        placeholder="رقم الفاتورة الجديدة"
                        required
                      />
                      <input
                        name="issue_date"
                        type="date"
                        defaultValue={today()}
                        required
                      />
                      <button type="submit" className="primary-button">
                        تحويل إلى فاتورة
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="لا توجد عروض أسعار مطابقة"
            description="أنشئ عرض سعر جديد أو عدّل البحث للوصول إلى النتائج."
          />
        )}
      </section>

      <section className="panel">
        <div className="panel-head split">
          <div>
            <span className="eyebrow">أرشيف الفواتير</span>
            <h2>كل الفواتير الضريبية</h2>
          </div>

          <form className="search-form">
            <input
              name="invoiceSearch"
              defaultValue={invoiceSearch}
              placeholder="ابحث برقم الفاتورة"
            />
            <button type="submit" className="secondary-button">
              بحث
            </button>
          </form>
        </div>

        {invoices.length ? (
          <div className="invoice-grid">
            {invoices.map((invoice) => (
              <article className="invoice-card" key={invoice.id}>
                <div className="document-head">
                  <div>
                    <span className="document-number">{invoice.invoice_number}</span>
                    <h3>{invoice.company_name}</h3>
                    <p>{invoice.client_name || "بدون عميل محدد"}</p>
                  </div>
                  <div className="document-meta">
                    <span>{invoice.issue_date}</span>
                    <strong>{formatCurrency(invoice.grand_total)}</strong>
                  </div>
                </div>

                <div className="invoice-qr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={invoiceQrCodes.get(invoice.id)} alt={`QR ${invoice.invoice_number}`} />
                  <div>
                    <p>QR Code مبدئي متوافق مع بيانات المرحلة الأولى.</p>
                    <span>
                      ضريبة: {invoice.company_tax_number || "غير مضافة"} | العميل:{" "}
                      {invoice.client_tax_number || "غير مضاف"}
                    </span>
                  </div>
                </div>

                <div className="items-table compact">
                  <div className="items-header">
                    <span>الوصف</span>
                    <span>الكمية</span>
                    <span>الإجمالي</span>
                  </div>
                  {invoiceItemsMap.get(invoice.id)?.map((item) => (
                    <div className="items-body" key={item.id}>
                      <span>
                        {item.description_ar || item.description_en || "بند بدون وصف"}
                      </span>
                      <span>{item.quantity}</span>
                      <span>{formatCurrency(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                <div className="totals-box">
                  <span>قبل الضريبة: {formatCurrency(invoice.subtotal)}</span>
                  <span>الضريبة: {formatCurrency(invoice.vat_total)}</span>
                  <strong>الإجمالي: {formatCurrency(invoice.grand_total)}</strong>
                </div>

                <Link href={`/invoices/${invoice.id}`} className="secondary-button">
                  فتح الفاتورة
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="لا توجد فواتير مطابقة"
            description="أنشئ فاتورة جديدة أو ابحث برقم مختلف."
          />
        )}
      </section>
          </div>
        </main>
      </div>
    </div>
  );
}
