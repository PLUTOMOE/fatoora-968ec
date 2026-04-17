--  === إنشاء جداول قاعدة البيانات لتطبيق فاتورة إنتربرايز ===

-- 1. جدول الكيانات / الشركات (Entities)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(10),
    legal_type VARCHAR(100),
    tax_number VARCHAR(15),
    cr_number VARCHAR(20),
    address TEXT,
    logo_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول العملاء (Customers)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'company', -- company / individual
    email VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    tax_number VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول المنتجات والخدمات (Products)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    unit VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 15.00, -- 15% or 0%
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول الفواتير (Invoices)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) DEFAULT 'standard', -- standard / simplified
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending, paid, overdue
    issue_date DATE,
    due_date DATE,
    subtotal DECIMAL(12, 2) DEFAULT 0.00,
    tax_total DECIMAL(12, 2) DEFAULT 0.00,
    discount DECIMAL(12, 2) DEFAULT 0.00,
    total DECIMAL(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول بنود الفواتير (Invoice Items)
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 15.00,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0.00
);

-- 6. جدول الملاحظات الجاهزة (Notes)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === إعداد الحماية Row Level Security (RLS) ===

-- تمكين الحماية لكل الجداول
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدم برؤية وتعديل بيانات الكيانات الخاصة به فقط
CREATE POLICY "Users can manage their own entities" 
ON entities FOR ALL 
USING (auth.uid() = user_id);

-- السماح للمستخدم بإدارة العملاء المرتبطين بكياناته
CREATE POLICY "Users can manage customers of their entities" 
ON customers FOR ALL 
USING (entity_id IN (SELECT id FROM entities WHERE user_id = auth.uid()));

-- السياسة نفسها للمنتجات
CREATE POLICY "Users can manage products of their entities" 
ON products FOR ALL 
USING (entity_id IN (SELECT id FROM entities WHERE user_id = auth.uid()));

-- السياسة نفسها للفواتير
CREATE POLICY "Users can manage invoices of their entities" 
ON invoices FOR ALL 
USING (entity_id IN (SELECT id FROM entities WHERE user_id = auth.uid()));

-- سياسة بنود الفواتير تعتمد على الفاتورة التابعة لها
CREATE POLICY "Users can manage invoice items based on invoice" 
ON invoice_items FOR ALL 
USING (invoice_id IN (
    SELECT invoices.id FROM invoices 
    JOIN entities ON invoices.entity_id = entities.id 
    WHERE entities.user_id = auth.uid()
));

-- سياسة الملاحظات
CREATE POLICY "Users can manage notes of their entities" 
ON notes FOR ALL 
USING (entity_id IN (SELECT id FROM entities WHERE user_id = auth.uid()));
