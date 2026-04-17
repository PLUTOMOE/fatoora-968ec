export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      entities: {
        Row: {
          id: string
          user_id: string
          name: string
          short_name: string | null
          legal_type: string | null
          tax_number: string | null
          cr_number: string | null
          address: string | null
          phone: string | null
          logo_url: string | null
          status: string
          created_at: string
        }
        Insert: { /* ... */ }
        Update: { /* ... */ }
      }
      customers: {
        Row: {
          id: string
          entity_id: string
          name: string
          type: string
          email: string | null
          phone: string | null
          city: string | null
          tax_number: string | null
          address: string | null
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          entity_id: string
          name: string
          sku: string | null
          unit: string | null
          price: number
          tax_rate: number
          description: string | null
          created_at: string
        }
      }
      invoices: {
        Row: {
          id: string
          entity_id: string
          customer_id: string
          invoice_number: string
          type: string
          status: string
          issue_date: string | null
          due_date: string | null
          subtotal: number
          tax_total: number
          discount: number
          total: number
          notes: string | null
          created_at: string
        }
      }
    }
  }
}
