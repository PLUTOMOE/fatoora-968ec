import React from 'react';
import { InvoiceTemplateProps } from './types';
import { getTemplateTranslations } from './translations';

export function RoyalTemplate({ entity, customer, items, invoice, settings, type, language = 'ar' }: InvoiceTemplateProps) {
  const isQuotation = type === 'quotation';
  const t = getTemplateTranslations(language);
  const titleText = isQuotation ? t.quotation : t.invoice;
  const isRTL = language === 'ar';

  return (
    <div className="bg-[#0c0c1d] w-full max-w-[900px] mx-auto" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: "'Inter', 'Tajawal', system-ui, sans-serif", color: '#f0e6d3' }}>
      
      {/* Gold Top Accent */}
      <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #b8860b 0%, #daa520 30%, #ffd700 50%, #daa520 70%, #b8860b 100%)' }} />
      
      {/* ═══════ HEADER ═══════ */}
      <div className="px-10 pt-8 pb-6">
        <div className="flex justify-between items-start">
          {/* Logo & Company */}
          <div className="flex items-center gap-4">
            {entity.logo_url ? (
              <div className="bg-white/10 backdrop-blur rounded-lg p-2.5 border border-[#daa520]/30" style={{ minWidth: 60 }}>
                <img src={entity.logo_url} alt="Logo" className="w-14 h-14 object-contain" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg flex items-center justify-center border-2 border-[#daa520]/40" style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #2a2a4e 100%)' }}>
                <span className="text-2xl font-black text-[#daa520]">{entity.name?.charAt(0)}</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white">{entity.name}</h2>
              {entity.address && <p className="text-[10px] text-[#daa520]/60 mt-0.5">{entity.address}</p>}
              {entity.phone && <p className="text-[10px] text-[#daa520]/60">{entity.phone}</p>}
            </div>
          </div>

          {/* Document Type */}
          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#daa520' }}>{titleText}</h1>
            <div className="mt-2 bg-[#daa520]/10 border border-[#daa520]/20 rounded-lg px-4 py-2">
              <div className="text-[8px] uppercase tracking-widest text-[#daa520]/50 font-bold">{t.reference}</div>
              <div className="text-sm font-bold text-[#daa520] font-mono">{invoice.number}</div>
            </div>
          </div>
        </div>

        {/* Company Registration */}
        <div className="flex items-center gap-3 mt-4">
          {entity.cr_number && (
            <span className="text-[9px] bg-[#daa520]/10 text-[#daa520]/80 px-2.5 py-1 rounded-full border border-[#daa520]/15">
              {t.cr} {entity.cr_number}
            </span>
          )}
          {entity.tax_number && (
            <span className="text-[9px] bg-[#daa520]/10 text-[#daa520]/80 px-2.5 py-1 rounded-full border border-[#daa520]/15">
              {t.vat} {entity.tax_number}
            </span>
          )}
        </div>
      </div>

      {/* Gold Divider */}
      <div className="mx-10 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #daa520 50%, transparent 100%)' }} />

      {/* ═══════ CLIENT & DATES ═══════ */}
      <div className="px-10 py-5">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#daa520] mb-2">{t.preparedFor}</div>
            <p className="text-sm font-bold text-white">{customer.name || '—'}</p>
            {customer.address && <p className="text-[11px] text-gray-400 mt-0.5">{customer.address}</p>}
            {customer.phone && <p className="text-[11px] text-gray-400">{customer.phone}</p>}
            {customer.tax_number && <p className="text-[10px] text-gray-500 mt-1">{t.vat} {customer.tax_number}</p>}
          </div>
          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#daa520] mb-2">{t.details}</div>
            <div className="text-[11px] text-gray-300"><span className="text-gray-500">{t.dateOfIssue} </span><span className="font-semibold text-white">{invoice.date}</span></div>
            {invoice.due_date && <div className="text-[11px] text-gray-300 mt-0.5"><span className="text-gray-500">{t.validUntilDue} </span><span className="font-semibold text-white">{invoice.due_date}</span></div>}
          </div>
        </div>
      </div>

      {/* ═══════ ITEMS TABLE ═══════ */}
      <div className="px-10 py-4">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #252550 100%)' }}>
              <th className="text-right text-[9px] font-bold uppercase tracking-wider text-[#daa520] px-3 py-3 w-8 rounded-r-lg">#</th>
              <th className="text-right text-[9px] font-bold uppercase tracking-wider text-[#daa520] px-3 py-3">{t.description}</th>
              <th className="text-center text-[9px] font-bold uppercase tracking-wider text-[#daa520] px-3 py-3 w-14">{t.qty}</th>
              <th className="text-center text-[9px] font-bold uppercase tracking-wider text-[#daa520] px-3 py-3 w-20">{t.unitPrice}</th>
              <th className="text-center text-[9px] font-bold uppercase tracking-wider text-[#daa520] px-3 py-3 w-14">{t.vatPercent}</th>
              <th className={`text-[9px] font-bold uppercase tracking-wider text-[#daa520] px-3 py-3 w-20 rounded-l-lg ${isRTL ? 'text-left' : 'text-right'}`}>{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const lineTotal = item.qty * item.price;
              const lineTax = lineTotal * (item.tax_rate / 100);
              return (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-3 text-[10px] text-[#daa520]/40 font-mono">{idx + 1}</td>
                  <td className="px-3 py-3 text-[12px] font-semibold text-white">{item.name}</td>
                  <td className="px-3 py-3 text-[12px] text-center text-gray-300 tabular-nums">{item.qty}</td>
                  <td className="px-3 py-3 text-[12px] text-center text-gray-300 tabular-nums">{item.price.toLocaleString()}</td>
                  <td className="px-3 py-3 text-[10px] text-center text-gray-500">{item.tax_rate}%</td>
                  <td className={`px-3 py-3 text-[12px] font-bold text-[#daa520] tabular-nums ${isRTL ? 'text-left' : 'text-right'}`}>
                    {(lineTotal + lineTax).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ═══════ TOTALS ═══════ */}
      <div className={`px-10 pb-5 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
        <div className="w-72 rounded-xl p-5 space-y-2" style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #252550 100%)', border: '1px solid rgba(218,165,32,0.15)' }}>
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-400">{t.subtotal}</span>
            <span className="font-medium text-gray-200 tabular-nums">{invoice.subtotal.toLocaleString()}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-[12px]">
              <span className="text-red-400">{t.discount}</span>
              <span className="text-red-400 tabular-nums">-{invoice.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-[12px] pb-3 border-b border-[#daa520]/15">
            <span className="text-gray-400">{t.totalVat}</span>
            <span className="font-medium text-gray-200 tabular-nums">{invoice.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#daa520]">{t.grandTotal}</span>
            <div>
              <span className="text-2xl font-black tabular-nums text-[#daa520]">{invoice.total.toLocaleString()}</span>
              <span className="text-[9px] text-[#daa520]/60 mr-1">{t.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ NOTES ═══════ */}
      {settings.notes && (
        <div className="px-10 pb-4">
          <div className="bg-[#daa520]/5 border border-[#daa520]/15 rounded-lg p-4">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#daa520] mb-1.5">{t.termsConditions}</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-line">{settings.notes}</p>
          </div>
        </div>
      )}

      {/* ═══════ STAMP & SIGNATURE ═══════ */}
      {(settings.stamp_url || settings.signature_url) && (
        <div className="px-10 pb-4">
          <div className="flex items-end gap-8 pt-4 border-t border-white/5">
            {settings.stamp_url && (
              <div className="text-center">
                <img src={settings.stamp_url} alt="Stamp" className="w-16 h-16 object-contain opacity-80" />
                <span className="text-[8px] text-[#daa520]/50 uppercase font-bold block mt-1">{t.companyStamp}</span>
              </div>
            )}
            {settings.signature_url && (
              <div className="text-center">
                <img src={settings.signature_url} alt="Signature" className="w-24 h-12 object-contain" style={{ filter: 'invert(1) brightness(0.8)' }} />
                <div className="border-t border-[#daa520]/20 mt-1 pt-1">
                  <span className="text-[8px] text-[#daa520]/50 uppercase font-bold">{t.authorizedSignature}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ FOOTER ═══════ */}
      <div className="px-10 py-3">
        <div className="flex justify-between items-center text-[8px] text-gray-600">
          <span>{entity.name}</span>
          <span>{invoice.number} · {invoice.date}</span>
        </div>
      </div>
      
      {/* Gold Bottom Accent */}
      <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #b8860b 0%, #daa520 30%, #ffd700 50%, #daa520 70%, #b8860b 100%)' }} />
    </div>
  );
}
