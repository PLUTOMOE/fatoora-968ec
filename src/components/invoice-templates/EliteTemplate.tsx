import React from 'react';
import { InvoiceTemplateProps } from './types';
import { getTemplateTranslations } from './translations';

export function EliteTemplate({ entity, customer, items, invoice, settings, type, language = 'ar' }: InvoiceTemplateProps) {
  const isQuotation = type === 'quotation';
  const t = getTemplateTranslations(language);
  const titleText = isQuotation ? t.quotation : t.invoice;
  const isRTL = language === 'ar';
  
  const colors = {
    surface: '#ffffff',
    onSurface: '#151b2d',
    secondary: '#565e74',
    onSurfaceVariant: '#434656',
    outlineVariant: '#c3c5d9',
    primary: '#003dc7',
    primaryContainer: '#0051ff',
    surfaceContainerLow: '#f2f3ff',
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_48px_64px_rgba(21,27,45,0.04)] overflow-hidden w-full max-w-[900px] mx-auto text-left" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: 'Inter, system-ui, sans-serif', color: colors.onSurface }}>
      
      {/* Document Header */}
      <div className="p-12 lg:p-16 border-b" style={{ borderColor: colors.surfaceContainerLow }}>
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">{titleText}</h1>
            <p className="text-sm font-medium" style={{ color: colors.secondary }}>{t.reference} {invoice.number}</p>
          </div>
          <div className={`flex flex-col ${isRTL ? 'items-start text-left' : 'items-end text-right'}`}>
            {entity.logo_url ? (
               <img src={entity.logo_url} alt="Logo" className="max-w-[150px] max-h-16 object-contain" />
            ) : (
               <span className="text-2xl font-black tracking-tighter uppercase">{entity.name}</span>
            )}
            {entity.cr_number && <p className="text-xs mt-2" style={{ color: colors.onSurfaceVariant }}>{t.cr} {entity.cr_number}</p>}
            {entity.tax_number && <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>{t.vat} {entity.tax_number}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.05em] mb-4 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.surfaceContainerLow }}>{t.preparedFor}</h3>
            <p className="text-lg font-bold">{customer.name}</p>
            {customer.address && <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>{customer.address}</p>}
            {customer.phone && <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>{customer.phone}</p>}
            {customer.tax_number && <p className="text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>{t.vat} {customer.tax_number}</p>}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.05em] mb-4 border-b pb-2" style={{ color: colors.secondary, borderColor: colors.surfaceContainerLow }}>{t.details}</h3>
            <div className="flex justify-between text-sm mt-1">
               <span style={{ color: colors.onSurfaceVariant }}>{t.dateOfIssue}</span>
               <span className="font-medium">{invoice.date}</span>
            </div>
            {invoice.due_date && (
               <div className="flex justify-between text-sm mt-1">
                 <span style={{ color: colors.onSurfaceVariant }}>{t.validUntilDue}</span>
                 <span className="font-medium">{invoice.due_date}</span>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Ledger */}
      <div className="p-12 lg:p-16">
        <h3 className="text-xs font-bold uppercase tracking-[0.05em] mb-8" style={{ color: colors.secondary }}>{t.serviceBreakdown}</h3>
        
        <div className="space-y-2">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: `${colors.outlineVariant}40`, color: colors.secondary }}>
            <div className="col-span-5">{t.description}</div>
            <div className="col-span-2 text-center">{t.qty}</div>
            <div className="col-span-2 text-center">{t.unitPrice}</div>
            <div className="col-span-1 text-center">{t.vatPercent}</div>
            <div className={`col-span-2 ${isRTL ? 'text-left' : 'text-right'}`}>{t.total}</div>
          </div>

          {/* Line Items */}
          {items.map((item, idx) => {
             const rowBg = idx % 2 === 0 ? '#ffffff' : colors.surfaceContainerLow;
             const itemTotal = item.qty * item.price;
             const taxAmount = itemTotal * (item.tax_rate / 100);
             return (
               <div key={idx} className="grid grid-cols-12 gap-4 py-6 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_8px_24px_rgba(21,27,45,0.04)] hover:scale-[1.005]" style={{ backgroundColor: rowBg }}>
                 <div className="col-span-5">
                   <p className="font-bold text-sm tracking-tight">{item.name}</p>
                 </div>
                 <div className="col-span-2 text-center text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>{item.qty}</div>
                 <div className="col-span-2 text-center text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>{item.price.toLocaleString()}</div>
                 <div className="col-span-1 text-center text-xs font-medium mt-0.5" style={{ color: colors.secondary }}>{item.tax_rate}%</div>
                 <div className={`col-span-2 text-sm font-bold ${isRTL ? 'text-left' : 'text-right'}`}>{(itemTotal + taxAmount).toLocaleString()}</div>
               </div>
             );
          })}
        </div>

        {/* Totals Section */}
        <div className={`mt-16 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <div className="w-full max-w-sm space-y-4">
            <div className="flex justify-between text-sm">
              <span style={{ color: colors.onSurfaceVariant }}>{t.subtotal}</span>
              <span className="font-medium">{invoice.subtotal.toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-500">{t.discount}</span>
                <span className="font-medium text-red-500">-{invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-b pb-4" style={{ borderColor: `${colors.outlineVariant}40` }}>
              <span style={{ color: colors.onSurfaceVariant }}>{t.totalVat}</span>
              <span className="font-medium">{invoice.tax.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.05em]" style={{ color: colors.secondary }}>{t.grandTotal}</span>
              <span className="text-4xl font-black tracking-tighter" style={{ 
                background: `linear-gradient(${isRTL ? 'to bottom left' : 'to bottom right'}, ${colors.primary}, ${colors.primaryContainer})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {invoice.total.toLocaleString()}
              </span>
            </div>
            <p className={`text-xs mt-2 ${isRTL ? 'text-left' : 'text-right'}`} style={{ color: colors.onSurfaceVariant }}>{t.currency}</p>
          </div>
        </div>

        {/* Notes & Footer with Stamps */}
        <div className="mt-24 pt-8 border-t" style={{ borderColor: colors.surfaceContainerLow }}>
          {settings.notes && (
             <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-[0.05em] mb-4" style={{ color: colors.secondary }}>{t.termsConditions}</h4>
                <p className="text-xs leading-relaxed max-w-3xl" style={{ color: colors.onSurfaceVariant }}>
                    {settings.notes}
                </p>
             </div>
          )}

          <div className="flex items-end justify-between mt-12 pt-8 border-t border-gray-100">
             <div className="flex items-center gap-12">
               {settings.stamp_url && (
                 <div className="text-center">
                   <img src={settings.stamp_url} alt="Stamp" className="w-24 h-24 object-contain opacity-90 mixing-multiply" />
                   <div className="text-[10px] uppercase font-bold mt-2" style={{ color: colors.outlineVariant }}>{t.companyStamp}</div>
                 </div>
               )}
               {settings.signature_url && (
                 <div className="text-center">
                   <img src={settings.signature_url} alt="Signature" className="w-32 h-16 object-contain" />
                   <div className="text-[10px] uppercase font-bold border-t pt-2 mt-2" style={{ color: colors.outlineVariant, borderColor: colors.surfaceContainerLow }}>{t.authorizedSignature}</div>
                 </div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
