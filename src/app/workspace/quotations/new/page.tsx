import Link from "next/link";
import { redirect } from "next/navigation";
import { addQuotation } from "@/app/actions";
import { getUserById, listClients, listCompanies } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function LineItemRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={index} className="group transition-colors hover:bg-slate-50">
      <td className="px-2 py-4">
        <input
          className="new-doc-table-input"
          name={`item_description_ar_${index}`}
          defaultValue={index === 0 ? "تصميم هندسي مبدئي للمشروع" : ""}
          placeholder="أدخل وصف البند..."
          type="text"
        />
      </td>
      <td className="px-2 py-4 text-center">
        <input
          className="new-doc-table-input text-center"
          name={`item_quantity_${index}`}
          defaultValue={index === 0 ? "1" : ""}
          placeholder="0"
          type="number"
          step="0.01"
        />
      </td>
      <td className="px-2 py-4">
        <input
          className="new-doc-table-input text-right"
          name={`item_unit_price_${index}`}
          defaultValue={index === 0 ? "15000" : ""}
          placeholder="0.00"
          type="number"
          step="0.01"
        />
      </td>
      <td className="px-2 py-4 text-center">
        <select
          className="new-doc-table-input text-center"
          name={`item_vat_rate_${index}`}
          defaultValue="15"
        >
          <option value="15">15%</option>
          <option value="0">0%</option>
        </select>
      </td>
      <td className="px-2 py-4">
        <input
          className="new-doc-table-input"
          name={`item_description_en_${index}`}
          defaultValue={index === 0 ? "Concept design package" : ""}
          placeholder="English description..."
          type="text"
          dir="ltr"
        />
      </td>
    </tr>
  ));
}

export default async function NewQuotationPage() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/");
  }

  const user = getUserById(userId);

  if (!user || user.status !== "approved") {
    redirect("/");
  }

  const companies = listCompanies(user.id);
  const clients = listClients(user.id);
  const nextNumber = `QT-${today().replaceAll("-", "")}-NEW`;

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 xl:pr-80">
        <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Link href="/workspace" className="secondary-button">
                العودة للوحة
              </Link>
              <span className="eyebrow">إنشاء مستند</span>
            </div>
            <h1 className="font-headline text-3xl font-bold text-blue-950">
              إنشاء عرض سعر جديد
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              أدخل تفاصيل العرض والعميل والبنود بشكل واضح، ثم احفظه لاستخدامه أو
              لتحويله لاحقًا إلى فاتورة.
            </p>
          </div>
          <div className="text-left">
            <p className="text-sm text-slate-500">رقم المستند المبدئي</p>
            <p className="font-headline text-xl font-bold text-slate-900">{nextNumber}</p>
          </div>
        </header>

        <form action={addQuotation} className="space-y-8">
          <input name="quotation_number" type="hidden" value={nextNumber} />
          <input name="issue_date" type="hidden" value={today()} />

          <section className="grid gap-8 md:grid-cols-2">
            <div className="new-doc-card">
              <div className="new-doc-card-title">
                <div className="new-doc-icon">
                  <span className="material-symbols-outlined">business</span>
                </div>
                <h3>الشركة المصدرة</h3>
              </div>

              <label className="new-doc-field">
                <span>اختر الشركة</span>
                <select name="company_id" required defaultValue="">
                  <option value="" disabled>
                    تحديد الكيان التجاري...
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="new-doc-field">
                <span>تاريخ الانتهاء</span>
                <input name="expiry_date" type="date" />
              </label>
            </div>

            <div className="new-doc-card">
              <div className="new-doc-card-title">
                <div className="new-doc-icon">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <h3>معلومات العميل</h3>
              </div>

              <label className="new-doc-field">
                <span>اختر عميلًا موجودًا</span>
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

              <div className="grid gap-4 md:grid-cols-2">
                <label className="new-doc-field">
                  <span>نوع العميل</span>
                  <select name="new_client_type" defaultValue="individual">
                    <option value="individual">فرد</option>
                    <option value="company">شركة / مؤسسة</option>
                  </select>
                </label>
                <label className="new-doc-field">
                  <span>اسم العميل</span>
                  <input name="new_client_name" placeholder="اسم العميل أو الشركة" />
                </label>
                <label className="new-doc-field">
                  <span>رقم الهاتف</span>
                  <input name="new_client_phone" placeholder="05xxxxxxxx" />
                </label>
                <label className="new-doc-field">
                  <span>العنوان</span>
                  <input name="new_client_address" placeholder="العنوان أو المدينة" />
                </label>
                <label className="new-doc-field">
                  <span>السجل التجاري</span>
                  <input
                    name="new_client_commercial_registration"
                    placeholder="اختياري للشركات"
                  />
                </label>
                <label className="new-doc-field">
                  <span>الرقم الضريبي</span>
                  <input name="new_client_tax_number" placeholder="اختياري للشركات" />
                </label>
              </div>
            </div>
          </section>

          <section className="new-doc-card overflow-hidden">
            <div className="new-doc-section-head">
              <div>
                <h3>تفاصيل البنود</h3>
                <p>أضف البنود بالعربي والإنجليزي مع الكمية والسعر والضريبة.</p>
              </div>
              <button type="button" className="new-doc-inline-link">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                إضافة بند جديد
              </button>
            </div>

            <div className="overflow-x-auto px-8 pb-8">
              <div className="overflow-x-auto overflow-y-hidden">
<table className="min-w-[860px] w-full text-right">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="px-2 pb-4 font-normal w-[32%]">الوصف العربي</th>
                    <th className="px-2 pb-4 font-normal w-[10%] text-center">الكمية</th>
                    <th className="px-2 pb-4 font-normal w-[16%]">سعر الوحدة</th>
                    <th className="px-2 pb-4 font-normal w-[10%] text-center">الضريبة</th>
                    <th className="px-2 pb-4 font-normal w-[32%]">الوصف الإنجليزي</th>
                  </tr>
                </thead>
                <tbody>
                  <LineItemRows />
                </tbody>
              </table>
</div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="new-doc-card">
              <div className="new-doc-card-title">
                <div className="new-doc-icon">
                  <span className="material-symbols-outlined">edit_note</span>
                </div>
                <h3>الشروط والملاحظات</h3>
              </div>
              <textarea
                className="new-doc-textarea"
                name="notes"
                rows={8}
                placeholder="أضف شروط الدفع أو مدة الصلاحية أو أي ملاحظات إضافية للعميل..."
              />
            </div>

            <div className="new-doc-summary">
              <h3>الملخص المالي</h3>
              <div className="space-y-4 text-sm">
                <div className="new-doc-summary-row">
                  <span>المجموع الفرعي:</span>
                  <span>يُحسب عند الحفظ</span>
                </div>
                <div className="new-doc-summary-row">
                  <span>إجمالي الضريبة:</span>
                  <span>يُحسب تلقائيًا</span>
                </div>
                <div className="new-doc-summary-row">
                  <span>خصم إضافي:</span>
                  <input placeholder="0.00" type="text" />
                </div>
                <div className="new-doc-summary-total">
                  <span>الإجمالي المستحق:</span>
                  <strong>يظهر بعد الحفظ</strong>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-4 pb-12">
            <Link href="/workspace" className="secondary-button">
              إلغاء
            </Link>
            <button className="secondary-button" type="submit">
              حفظ كمسودة
            </button>
            <button className="primary-button" type="submit">
              إصدار المستند
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
