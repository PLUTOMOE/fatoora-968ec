"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import {
  approveUser,
  createCompany,
  createInvoice,
  createQuotation,
  createUser,
  getUserByEmail,
  getUserById,
  convertQuotationToInvoice,
} from "@/lib/db";
import { clearSession, getSessionUserId, setSession } from "@/lib/session";

function parseItems(formData: FormData) {
  return Array.from({ length: 5 }, (_, index) => ({
    descriptionAr: String(formData.get(`item_description_ar_${index}`) ?? ""),
    descriptionEn: String(formData.get(`item_description_en_${index}`) ?? ""),
    quantity: Number(formData.get(`item_quantity_${index}`) ?? 0),
    unitPrice: Number(formData.get(`item_unit_price_${index}`) ?? 0),
    vatRate: Number(formData.get(`item_vat_rate_${index}`) ?? 15),
  }));
}

const authSchema = z.object({
  fullName: z.string().optional(),
  email: z.email("أدخل بريدًا إلكترونيًا صحيحًا."),
  password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف."),
});

async function requireCurrentUser() {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/");
  }

  const user = getUserById(userId);

  if (!user || user.status !== "approved") {
    await clearSession();
    redirect("/");
  }

  return user;
}

export async function registerUser(_: string | null, formData: FormData) {
  const parsed = authSchema.safeParse({
    fullName: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "تعذر إكمال التسجيل.";
  }

  if (getUserByEmail(parsed.data.email)) {
    return "هذا البريد مسجل بالفعل.";
  }

  createUser({
    fullName: parsed.data.fullName ?? "",
    email: parsed.data.email,
    passwordHash: hashPassword(parsed.data.password),
  });

  return "تم إرسال طلب التفعيل بنجاح. لا يمكنك الدخول قبل الموافقة على الحساب.";
}

export async function loginUser(_: string | null, formData: FormData) {
  const parsed = authSchema.pick({ email: true, password: true }).safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "تعذر تسجيل الدخول.";
  }

  const user = getUserByEmail(parsed.data.email);

  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return "بيانات الدخول غير صحيحة.";
  }

  if (user.status !== "approved") {
    return "الحساب ما زال بانتظار الموافقة.";
  }

  await setSession(user.id);
  redirect("/");
}

export async function logoutUser() {
  await clearSession();
  redirect("/");
}

export async function approvePendingUser(formData: FormData) {
  const user = await requireCurrentUser();

  if (!user.is_admin) {
    redirect("/");
  }

  const requestUserId = Number(formData.get("user_id"));

  if (Number.isFinite(requestUserId)) {
    approveUser(requestUserId);
  }

  revalidatePath("/");
}

export async function addCompany(formData: FormData) {
  const user = await requireCurrentUser();

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return;
  }

  createCompany(user.id, {
    name,
    commercial_registration: String(formData.get("commercial_registration") ?? ""),
    tax_number: String(formData.get("tax_number") ?? ""),
    address: String(formData.get("address") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    logo_url: String(formData.get("logo_url") ?? ""),
  });

  revalidatePath("/");
}

export async function addQuotation(formData: FormData) {
  const user = await requireCurrentUser();
  const companyId = Number(formData.get("company_id") ?? 0);
  const quotationNumber = String(formData.get("quotation_number") ?? "").trim();
  const issueDate = String(formData.get("issue_date") ?? "");

  if (!companyId || !quotationNumber || !issueDate) {
    return;
  }

  createQuotation(user.id, {
    companyId,
    quotationNumber,
    issueDate,
    expiryDate: String(formData.get("expiry_date") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    existingClientId: Number(formData.get("existing_client_id") ?? 0) || null,
    newClientType:
      String(formData.get("new_client_type") ?? "individual") === "company"
        ? "company"
        : "individual",
    newClientName: String(formData.get("new_client_name") ?? ""),
    newClientCommercialRegistration: String(
      formData.get("new_client_commercial_registration") ?? "",
    ),
    newClientTaxNumber: String(formData.get("new_client_tax_number") ?? ""),
    newClientAddress: String(formData.get("new_client_address") ?? ""),
    newClientPhone: String(formData.get("new_client_phone") ?? ""),
    items: parseItems(formData),
  });

  revalidatePath("/");
}

export async function addInvoice(formData: FormData) {
  const user = await requireCurrentUser();
  const companyId = Number(formData.get("company_id") ?? 0);
  const invoiceNumber = String(formData.get("invoice_number") ?? "").trim();
  const issueDate = String(formData.get("issue_date") ?? "");

  if (!companyId || !invoiceNumber || !issueDate) {
    return;
  }

  createInvoice(user.id, {
    companyId,
    invoiceNumber,
    issueDate,
    notes: String(formData.get("notes") ?? ""),
    existingClientId: Number(formData.get("existing_client_id") ?? 0) || null,
    newClientType:
      String(formData.get("new_client_type") ?? "individual") === "company"
        ? "company"
        : "individual",
    newClientName: String(formData.get("new_client_name") ?? ""),
    newClientCommercialRegistration: String(
      formData.get("new_client_commercial_registration") ?? "",
    ),
    newClientTaxNumber: String(formData.get("new_client_tax_number") ?? ""),
    newClientAddress: String(formData.get("new_client_address") ?? ""),
    newClientPhone: String(formData.get("new_client_phone") ?? ""),
    items: parseItems(formData),
  });

  revalidatePath("/");
}

export async function createInvoiceFromQuotation(formData: FormData) {
  const user = await requireCurrentUser();
  const quotationId = Number(formData.get("quotation_id") ?? 0);
  const invoiceNumber = String(formData.get("invoice_number") ?? "").trim();
  const issueDate = String(formData.get("issue_date") ?? "");

  if (!quotationId || !invoiceNumber || !issueDate) {
    return;
  }

  convertQuotationToInvoice(user.id, quotationId, invoiceNumber, issueDate);
  revalidatePath("/");
}
