import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "@/lib/crypto";

const dataDirectory = path.join(process.cwd(), "data");
const databaseFile = path.join(dataDirectory, "fatora.sqlite");

fs.mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(databaseFile);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    commercial_registration TEXT,
    tax_number TEXT,
    address TEXT,
    phone TEXT,
    logo_url TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'individual',
    name TEXT,
    commercial_registration TEXT,
    tax_number TEXT,
    address TEXT,
    phone TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    client_id INTEGER,
    quotation_number TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    expiry_date TEXT,
    notes TEXT,
    subtotal REAL NOT NULL DEFAULT 0,
    vat_total REAL NOT NULL DEFAULT 0,
    grand_total REAL NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'manual',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_id INTEGER NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    quantity REAL NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL DEFAULT 0,
    vat_rate REAL NOT NULL DEFAULT 15,
    line_total REAL NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    client_id INTEGER,
    invoice_number TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    notes TEXT,
    subtotal REAL NOT NULL DEFAULT 0,
    vat_total REAL NOT NULL DEFAULT 0,
    grand_total REAL NOT NULL DEFAULT 0,
    source_quotation_id INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    quantity REAL NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL DEFAULT 0,
    vat_rate REAL NOT NULL DEFAULT 15,
    line_total REAL NOT NULL DEFAULT 0
  );
`);

const defaultAdminEmail = "owner@fatora.app";
const defaultAdminPassword = "admin123";

const existingAdmin = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get(defaultAdminEmail) as { id: number } | undefined;

if (!existingAdmin) {
  db.prepare(
    `
      INSERT INTO users (full_name, email, password_hash, status, is_admin)
      VALUES (?, ?, ?, 'approved', 1)
    `,
  ).run("مالك النظام", defaultAdminEmail, hashPassword(defaultAdminPassword));
}

export type UserRecord = {
  id: number;
  full_name: string | null;
  email: string;
  password_hash: string;
  status: "pending" | "approved";
  is_admin: number;
  created_at: string;
};

export type CompanyRecord = {
  id: number;
  user_id: number;
  name: string;
  commercial_registration: string | null;
  tax_number: string | null;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
};

export type ClientRecord = {
  id: number;
  user_id: number;
  type: "individual" | "company";
  name: string | null;
  commercial_registration: string | null;
  tax_number: string | null;
  address: string | null;
  phone: string | null;
};

export type DocumentItemInput = {
  descriptionAr: string;
  descriptionEn: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
};

function calculateTotals(items: DocumentItemInput[]) {
  const normalizedItems = items
    .map((item) => ({
      descriptionAr: item.descriptionAr.trim(),
      descriptionEn: item.descriptionEn.trim(),
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      vatRate: Number(item.vatRate) || 0,
    }))
    .filter(
      (item) =>
        item.descriptionAr ||
        item.descriptionEn ||
        item.quantity > 0 ||
        item.unitPrice > 0,
    );

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const vatTotal = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.vatRate / 100),
    0,
  );

  return {
    items: normalizedItems.map((item) => ({
      ...item,
      lineTotal: item.quantity * item.unitPrice * (1 + item.vatRate / 100),
    })),
    subtotal,
    vatTotal,
    grandTotal: subtotal + vatTotal,
  };
}

export function getUserByEmail(email: string) {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as UserRecord | undefined;
}

export function getUserById(userId: number) {
  return db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(userId) as UserRecord | undefined;
}

export function createUser(input: {
  fullName: string;
  email: string;
  passwordHash: string;
}) {
  return db
    .prepare(
      `
        INSERT INTO users (full_name, email, password_hash, status, is_admin)
        VALUES (?, ?, ?, 'pending', 0)
      `,
    )
    .run(input.fullName.trim(), input.email.trim().toLowerCase(), input.passwordHash);
}

export function listPendingUsers() {
  return db
    .prepare(
      `
        SELECT id, full_name, email, status, created_at
        FROM users
        WHERE status = 'pending'
        ORDER BY created_at DESC
      `,
    )
    .all() as Array<{
    id: number;
    full_name: string | null;
    email: string;
    status: string;
    created_at: string;
  }>;
}

export function approveUser(userId: number) {
  return db
    .prepare("UPDATE users SET status = 'approved' WHERE id = ?")
    .run(userId);
}

export function listCompanies(userId: number) {
  return db
    .prepare(
      `
        SELECT *
        FROM companies
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    )
    .all(userId) as CompanyRecord[];
}

export function createCompany(userId: number, input: Omit<CompanyRecord, "id" | "user_id">) {
  return db
    .prepare(
      `
        INSERT INTO companies
        (user_id, name, commercial_registration, tax_number, address, phone, logo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      userId,
      input.name.trim(),
      input.commercial_registration?.trim() || null,
      input.tax_number?.trim() || null,
      input.address?.trim() || null,
      input.phone?.trim() || null,
      input.logo_url?.trim() || null,
    );
}

export function listClients(userId: number) {
  return db
    .prepare(
      `
        SELECT *
        FROM clients
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    )
    .all(userId) as ClientRecord[];
}

export function createClient(
  userId: number,
  input: Omit<ClientRecord, "id" | "user_id">,
) {
  return db
    .prepare(
      `
        INSERT INTO clients
        (user_id, type, name, commercial_registration, tax_number, address, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      userId,
      input.type,
      input.name?.trim() || null,
      input.commercial_registration?.trim() || null,
      input.tax_number?.trim() || null,
      input.address?.trim() || null,
      input.phone?.trim() || null,
    );
}

function resolveClientId(
  userId: number,
  input: {
    existingClientId?: number | null;
    newClientType?: "individual" | "company";
    newClientName?: string;
    newClientCommercialRegistration?: string;
    newClientTaxNumber?: string;
    newClientAddress?: string;
    newClientPhone?: string;
  },
) {
  if (input.existingClientId) {
    return input.existingClientId;
  }

  const hasAnyClientField = [
    input.newClientName,
    input.newClientCommercialRegistration,
    input.newClientTaxNumber,
    input.newClientAddress,
    input.newClientPhone,
  ].some((value) => value?.trim());

  if (!hasAnyClientField) {
    return null;
  }

  const result = createClient(userId, {
    type: input.newClientType ?? "individual",
    name: input.newClientName ?? "",
    commercial_registration: input.newClientCommercialRegistration ?? "",
    tax_number: input.newClientTaxNumber ?? "",
    address: input.newClientAddress ?? "",
    phone: input.newClientPhone ?? "",
  });

  return Number(result.lastInsertRowid);
}

export function createQuotation(
  userId: number,
  input: {
    companyId: number;
    quotationNumber: string;
    issueDate: string;
    expiryDate?: string;
    notes?: string;
    existingClientId?: number | null;
    newClientType?: "individual" | "company";
    newClientName?: string;
    newClientCommercialRegistration?: string;
    newClientTaxNumber?: string;
    newClientAddress?: string;
    newClientPhone?: string;
    items: DocumentItemInput[];
  },
) {
  const clientId = resolveClientId(userId, input);
  const totals = calculateTotals(input.items);

  const transaction = db.transaction(() => {
    const quotationResult = db
      .prepare(
        `
          INSERT INTO quotations
          (user_id, company_id, client_id, quotation_number, issue_date, expiry_date, notes, subtotal, vat_total, grand_total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        userId,
        input.companyId,
        clientId,
        input.quotationNumber.trim(),
        input.issueDate,
        input.expiryDate?.trim() || null,
        input.notes?.trim() || null,
        totals.subtotal,
        totals.vatTotal,
        totals.grandTotal,
      );

    const quotationId = Number(quotationResult.lastInsertRowid);
    const itemStatement = db.prepare(
      `
        INSERT INTO quotation_items
        (quotation_id, description_ar, description_en, quantity, unit_price, vat_rate, line_total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    );

    totals.items.forEach((item) => {
      itemStatement.run(
        quotationId,
        item.descriptionAr || null,
        item.descriptionEn || null,
        item.quantity,
        item.unitPrice,
        item.vatRate,
        item.lineTotal,
      );
    });
  });

  transaction();
}

export function createInvoice(
  userId: number,
  input: {
    companyId: number;
    invoiceNumber: string;
    issueDate: string;
    notes?: string;
    existingClientId?: number | null;
    newClientType?: "individual" | "company";
    newClientName?: string;
    newClientCommercialRegistration?: string;
    newClientTaxNumber?: string;
    newClientAddress?: string;
    newClientPhone?: string;
    items: DocumentItemInput[];
    sourceQuotationId?: number | null;
  },
) {
  const clientId = resolveClientId(userId, input);
  const totals = calculateTotals(input.items);

  const transaction = db.transaction(() => {
    const invoiceResult = db
      .prepare(
        `
          INSERT INTO invoices
          (user_id, company_id, client_id, invoice_number, issue_date, notes, subtotal, vat_total, grand_total, source_quotation_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        userId,
        input.companyId,
        clientId,
        input.invoiceNumber.trim(),
        input.issueDate,
        input.notes?.trim() || null,
        totals.subtotal,
        totals.vatTotal,
        totals.grandTotal,
        input.sourceQuotationId ?? null,
      );

    const invoiceId = Number(invoiceResult.lastInsertRowid);
    const itemStatement = db.prepare(
      `
        INSERT INTO invoice_items
        (invoice_id, description_ar, description_en, quantity, unit_price, vat_rate, line_total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    );

    totals.items.forEach((item) => {
      itemStatement.run(
        invoiceId,
        item.descriptionAr || null,
        item.descriptionEn || null,
        item.quantity,
        item.unitPrice,
        item.vatRate,
        item.lineTotal,
      );
    });
  });

  transaction();
}

export function convertQuotationToInvoice(
  userId: number,
  quotationId: number,
  invoiceNumber: string,
  issueDate: string,
) {
  const quotation = db
    .prepare(
      `
        SELECT *
        FROM quotations
        WHERE id = ? AND user_id = ?
      `,
    )
    .get(quotationId, userId) as
    | {
        id: number;
        company_id: number;
        client_id: number | null;
        notes: string | null;
      }
    | undefined;

  if (!quotation) {
    return;
  }

  const quotationItems = db
    .prepare(
      `
        SELECT description_ar, description_en, quantity, unit_price, vat_rate
        FROM quotation_items
        WHERE quotation_id = ?
      `,
    )
    .all(quotationId) as Array<{
    description_ar: string | null;
    description_en: string | null;
    quantity: number;
    unit_price: number;
    vat_rate: number;
  }>;

  createInvoice(userId, {
    companyId: quotation.company_id,
    invoiceNumber,
    issueDate,
    notes: quotation.notes ?? "",
    existingClientId: quotation.client_id,
    items: quotationItems.map((item) => ({
      descriptionAr: item.description_ar ?? "",
      descriptionEn: item.description_en ?? "",
      quantity: item.quantity,
      unitPrice: item.unit_price,
      vatRate: item.vat_rate,
    })),
    sourceQuotationId: quotation.id,
  });
}

export function listQuotations(userId: number, search = "") {
  const term = `%${search.trim()}%`;

  return db
    .prepare(
      `
        SELECT
          quotations.*,
          companies.name AS company_name,
          clients.name AS client_name
        FROM quotations
        INNER JOIN companies ON companies.id = quotations.company_id
        LEFT JOIN clients ON clients.id = quotations.client_id
        WHERE quotations.user_id = ?
          AND quotations.quotation_number LIKE ?
        ORDER BY quotations.created_at DESC
      `,
    )
    .all(userId, term) as Array<{
    id: number;
    company_id: number;
    client_id: number | null;
    quotation_number: string;
    issue_date: string;
    expiry_date: string | null;
    notes: string | null;
    subtotal: number;
    vat_total: number;
    grand_total: number;
    company_name: string;
    client_name: string | null;
  }>;
}

export function listQuotationItems(quotationId: number) {
  return db
    .prepare(
      `
        SELECT *
        FROM quotation_items
        WHERE quotation_id = ?
      `,
    )
    .all(quotationId) as Array<{
    id: number;
    description_ar: string | null;
    description_en: string | null;
    quantity: number;
    unit_price: number;
    vat_rate: number;
    line_total: number;
  }>;
}

export function getQuotationDetails(userId: number, quotationId: number) {
  return db
    .prepare(
      `
        SELECT
          quotations.*,
          companies.name AS company_name,
          companies.commercial_registration AS company_commercial_registration,
          companies.tax_number AS company_tax_number,
          companies.address AS company_address,
          companies.phone AS company_phone,
          companies.logo_url AS company_logo_url,
          clients.type AS client_type,
          clients.name AS client_name,
          clients.commercial_registration AS client_commercial_registration,
          clients.tax_number AS client_tax_number,
          clients.address AS client_address,
          clients.phone AS client_phone
        FROM quotations
        INNER JOIN companies ON companies.id = quotations.company_id
        LEFT JOIN clients ON clients.id = quotations.client_id
        WHERE quotations.user_id = ?
          AND quotations.id = ?
      `,
    )
    .get(userId, quotationId) as
    | {
        id: number;
        quotation_number: string;
        issue_date: string;
        expiry_date: string | null;
        notes: string | null;
        subtotal: number;
        vat_total: number;
        grand_total: number;
        company_name: string;
        company_commercial_registration: string | null;
        company_tax_number: string | null;
        company_address: string | null;
        company_phone: string | null;
        company_logo_url: string | null;
        client_type: "individual" | "company" | null;
        client_name: string | null;
        client_commercial_registration: string | null;
        client_tax_number: string | null;
        client_address: string | null;
        client_phone: string | null;
      }
    | undefined;
}

export function listInvoices(userId: number, search = "") {
  const term = `%${search.trim()}%`;

  return db
    .prepare(
      `
        SELECT
          invoices.*,
          companies.name AS company_name,
          companies.tax_number AS company_tax_number,
          clients.name AS client_name,
          clients.tax_number AS client_tax_number
        FROM invoices
        INNER JOIN companies ON companies.id = invoices.company_id
        LEFT JOIN clients ON clients.id = invoices.client_id
        WHERE invoices.user_id = ?
          AND invoices.invoice_number LIKE ?
        ORDER BY invoices.created_at DESC
      `,
    )
    .all(userId, term) as Array<{
    id: number;
    company_id: number;
    client_id: number | null;
    invoice_number: string;
    issue_date: string;
    notes: string | null;
    subtotal: number;
    vat_total: number;
    grand_total: number;
    source_quotation_id: number | null;
    company_name: string;
    company_tax_number: string | null;
    client_name: string | null;
    client_tax_number: string | null;
  }>;
}

export function listInvoiceItems(invoiceId: number) {
  return db
    .prepare(
      `
        SELECT *
        FROM invoice_items
        WHERE invoice_id = ?
      `,
    )
    .all(invoiceId) as Array<{
    id: number;
    description_ar: string | null;
    description_en: string | null;
    quantity: number;
    unit_price: number;
    vat_rate: number;
    line_total: number;
  }>;
}

export function getInvoiceDetails(userId: number, invoiceId: number) {
  return db
    .prepare(
      `
        SELECT
          invoices.*,
          companies.name AS company_name,
          companies.commercial_registration AS company_commercial_registration,
          companies.tax_number AS company_tax_number,
          companies.address AS company_address,
          companies.phone AS company_phone,
          companies.logo_url AS company_logo_url,
          clients.type AS client_type,
          clients.name AS client_name,
          clients.commercial_registration AS client_commercial_registration,
          clients.tax_number AS client_tax_number,
          clients.address AS client_address,
          clients.phone AS client_phone
        FROM invoices
        INNER JOIN companies ON companies.id = invoices.company_id
        LEFT JOIN clients ON clients.id = invoices.client_id
        WHERE invoices.user_id = ?
          AND invoices.id = ?
      `,
    )
    .get(userId, invoiceId) as
    | {
        id: number;
        invoice_number: string;
        issue_date: string;
        notes: string | null;
        subtotal: number;
        vat_total: number;
        grand_total: number;
        source_quotation_id: number | null;
        company_name: string;
        company_commercial_registration: string | null;
        company_tax_number: string | null;
        company_address: string | null;
        company_phone: string | null;
        company_logo_url: string | null;
        client_type: "individual" | "company" | null;
        client_name: string | null;
        client_commercial_registration: string | null;
        client_tax_number: string | null;
        client_address: string | null;
        client_phone: string | null;
      }
    | undefined;
}
