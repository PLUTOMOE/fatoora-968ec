import { createClient } from './client';
import { Database } from './database.types';

export const supabase = createClient();

// === خدمة الكيانات (Entities) ===
export async function getEntities() {
  const { data, error } = await supabase.from('entities').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createEntity(entity: Omit<Database['public']['Tables']['entities']['Row'], 'id' | 'created_at' | 'user_id'>) {
  const { data, error } = await supabase.from('entities').insert(entity).select().single();
  if (error) throw error;
  return data;
}

// === خدمة العملاء (Customers) ===
export async function getCustomers(entityId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createCustomer(customer: any) {
  const { data, error } = await supabase.from('customers').insert(customer).select().single();
  if (error) throw error;
  return data;
}

// === خدمة المنتجات (Products) ===
export async function getProducts(entityId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createProduct(product: any) {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw error;
  return data;
}

// === خدمة الفواتير (Invoices) ===
export async function getInvoices(entityId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, customers(name)')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getInvoiceDetails(invoiceId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, customers(*)')
    .eq('id', invoiceId)
    .single();
  
  if (error) throw error;

  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId);
    
  if (itemsError) throw itemsError;

  return { invoice: data, items };
}
