import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import {
  getQuotationDetails,
  getUserById,
  listQuotationItems,
} from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function QuotationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/");
  }

  const user = getUserById(userId);

  if (!user || user.status !== "approved") {
    redirect("/");
  }

  const quotationId = Number(id);

  if (!Number.isFinite(quotationId)) {
    notFound();
  }

  const quotation = getQuotationDetails(user.id, quotationId);

  if (!quotation) {
    notFound();
  }

  const items = listQuotationItems(quotation.id);

  return (
    <main className="document-page-shell">
      <header className="document-toolbar no-print">
        <Link href="/" className="secondary-button">
          العودة للوحة
        </Link>
        <div className="toolbar-actions">
          <Link href="/" className="secondary-button">
            كل المستندات
          </Link>
          <PrintButton />
        </div>
      </header>

      <article className="print-sheet">
        <section className="print-header">
          <div className="company-block">
            <span className="eyebrow">عرض سعر</span>
            <h1>{quotation.company_name}</h1>
            <p>السجل التجاري: {quotation.company_commercial_registration || "غير مضاف"}</p>
            <p>الرقم الضريبي: {quotation.company_tax_number || "غير مضاف"}</p>
            <p>العنوان: {quotation.company_address || "غير مضاف"}</p>
            <p>الهاتف: {quotation.company_phone || "غير مضاف"}</p>
          </div>

          <div className="document-summary-card quote-card">
            <div>
              <strong>{quotation.quotation_number}</strong>
              <span>تاريخ الإصدار: {quotation.issue_date}</span>
              <span>تاريخ الانتهاء: {quotation.expiry_date || "غير محدد"}</span>
            </div>
          </div>
        </section>

        <section className="print-meta-grid">
          <div className="meta-card">
            <h3>بيانات العميل</h3>
            <p>الاسم: {quotation.client_name || "غير مضاف"}</p>
            <p>النوع: {quotation.client_type === "company" ? "شركة / مؤسسة" : "فرد"}</p>
            <p>السجل التجاري: {quotation.client_commercial_registration || "غير مضاف"}</p>
            <p>الرقم الضريبي: {quotation.client_tax_number || "غير مضاف"}</p>
            <p>العنوان: {quotation.client_address || "غير مضاف"}</p>
            <p>الهاتف: {quotation.client_phone || "غير مضاف"}</p>
          </div>

          <div className="meta-card totals-card">
            <h3>الملخص المالي</h3>
            <p>قبل الضريبة: {formatCurrency(quotation.subtotal)}</p>
            <p>قيمة الضريبة: {formatCurrency(quotation.vat_total)}</p>
            <strong>الإجمالي: {formatCurrency(quotation.grand_total)}</strong>
          </div>
        </section>

        <section className="print-table">
          <div className="print-table-head">
            <span>الوصف بالعربي</span>
            <span>الوصف بالإنجليزي</span>
            <span>الكمية</span>
            <span>سعر الوحدة</span>
            <span>الضريبة</span>
            <span>الإجمالي</span>
          </div>
          {items.map((item) => (
            <div className="print-table-row" key={item.id}>
              <span>{item.description_ar || "-"}</span>
              <span>{item.description_en || "-"}</span>
              <span>{item.quantity}</span>
              <span>{formatCurrency(item.unit_price)}</span>
              <span>{item.vat_rate}%</span>
              <span>{formatCurrency(item.line_total)}</span>
            </div>
          ))}
        </section>

        <section className="print-notes">
          <h3>ملاحظات</h3>
          <p>{quotation.notes || "لا توجد ملاحظات مضافة."}</p>
        </section>
      </article>
    </main>
  );
}
