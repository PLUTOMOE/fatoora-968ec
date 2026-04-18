import React from 'react';
import { InvoiceTemplateProps } from './types';
import { getTemplateTranslations } from './translations';

export function EliteTemplate({ entity, customer, items, invoice, settings, type, language = 'ar' }: InvoiceTemplateProps) {
  const isQuotation = type === 'quotation';
  const t = getTemplateTranslations(language);
  const titleText = isQuotation ? t.quotation : t.invoice;
  const isRTL = language === 'ar';
  
  return (
    <div className="bg-white w-full max-w-[900px] mx-auto" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: "'Inter', 'Tajawal', system-ui, sans-serif", color: '#1a1d2e' }}>
      
      {/* ═══════ HEADER ═══════ */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #162544 40%, #1a3a6b 100%)' }}>
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
        </div>

        <div className="relative px-10 py-8">
          <div className="flex justify-between items-start">
            {/* Logo & Company — BIG */}
            <div className="flex items-center gap-5">
              {entity.logo_url ? (
                <div className="bg-white rounded-2xl p-3 shadow-lg" style={{ minWidth: 80 }}>
                  <img src={entity.logo_url} alt="Logo" className="w-20 h-20 object-contain" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                  <span className="text-3xl font-black text-white">{entity.name?.charAt(0)}</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{entity.name}</h2>
                {entity.address && <p className="text-xs text-blue-200/80 mb-0.5">{entity.address}</p>}
                {entity.phone && <p className="text-xs text-blue-200/80">{entity.phone}</p>}
                <div className="flex items-center gap-3 mt-2">
                  {entity.cr_number && (
                    <span className="text-[10px] bg-white/10 text-blue-100 px-2 py-0.5 rounded-full border border-white/10">
                      {t.cr}: {entity.cr_number}
                    </span>
                  )}
                  {entity.tax_number && (
                    <span className="text-[10px] bg-white/10 text-blue-100 px-2 py-0.5 rounded-full border border-white/10">
                      {t.vat}: {entity.tax_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Document Type & Number */}
            <div className={`text-${isRTL ? 'left' : 'right'}`}>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">{titleText}</h1>
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 border border-white/15">
                <div className="text-[10px] text-blue-200/70 mb-0.5">{t.reference}</div>
                <div className="text-lg font-bold text-white font-mono tracking-wider">{invoice.number}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ INFO CARDS ═══════ */}
      <div className="px-10 -mt-5 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {/* Customer Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100/50 p-5 col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.preparedFor}</h3>
            </div>
            <p className="text-base font-bold text-gray-800 mb-1">{customer.name || '—'}</p>
            {customer.address && <p className="text-xs text-gray-500 mb-0.5">{customer.address}</p>}
            {customer.phone && <p className="text-xs text-gray-500 mb-0.5">{customer.phone}</p>}
            {customer.tax_number && (
              <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 inline-block px-2 py-0.5 rounded">
                {t.vat}: {customer.tax_number}
              </p>
            )}
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-100/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.details}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-gray-400 mb-0.5">{t.dateOfIssue}</div>
                <div className="text-sm font-semibold text-gray-800">{invoice.date}</div>
              </div>
              {invoice.due_date && (
                <div>
                  <div className="text-[10px] text-gray-400 mb-0.5">{t.validUntilDue}</div>
                  <div className="text-sm font-semibold text-gray-800">{invoice.due_date}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ITEMS TABLE ═══════ */}
      <div className="px-10 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t.serviceBreakdown}</h3>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8f9ff 100%)' }}>
                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-3 w-8">#</th>
                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-3">{t.description}</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-3 w-16">{t.qty}</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-3 w-24">{t.unitPrice}</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-3 w-16">{t.vatPercent}</th>
                <th className={`text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-3 w-24 ${isRTL ? 'text-left' : 'text-right'}`}>{t.total}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const lineTotal = item.qty * item.price;
                const lineTax = lineTotal * (item.tax_rate / 100);
                return (
                  <tr key={idx} className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4 text-xs text-gray-300 font-mono">{idx + 1}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-600 tabular-nums">{item.qty}</td>
                    <td className="px-4 py-4 text-sm text-center text-gray-600 tabular-nums">{item.price.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs text-center text-gray-400">{item.tax_rate}%</td>
                    <td className={`px-4 py-4 text-sm font-bold text-gray-800 tabular-nums ${isRTL ? 'text-left' : 'text-right'}`}>
                      {(lineTotal + lineTax).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════ TOTALS ═══════ */}
      <div className={`px-10 mt-6 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
        <div className="w-80">
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t.subtotal}</span>
              <span className="font-medium tabular-nums">{invoice.subtotal.toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-500">{t.discount}</span>
                <span className="font-medium text-red-500 tabular-nums">-{invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
              <span className="text-gray-500">{t.totalVat}</span>
              <span className="font-medium tabular-nums">{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.grandTotal}</span>
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <span className="text-2xl font-black tabular-nums" style={{ 
                  background: 'linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {invoice.total.toLocaleString()}
                </span>
                <div className="text-[10px] text-gray-400 mt-0.5">{t.currency}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ NOTES ═══════ */}
      {settings.notes && (
        <div className="px-10 mt-8">
          <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-700">{t.termsConditions}</h4>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed whitespace-pre-line">{settings.notes}</p>
          </div>
        </div>
      )}

      {/* ═══════ STAMP & SIGNATURE ═══════ */}
      {(settings.stamp_url || settings.signature_url) && (
        <div className="px-10 mt-8">
          <div className="flex items-end gap-12 pt-6 border-t border-gray-100">
            {settings.stamp_url && (
              <div className="text-center">
                <img src={settings.stamp_url} alt="Stamp" className="w-24 h-24 object-contain opacity-85" style={{ mixBlendMode: 'multiply' }} />
                <span className="text-[9px] text-gray-400 uppercase font-bold mt-2 block tracking-wider">{t.companyStamp}</span>
              </div>
            )}
            {settings.signature_url && (
              <div className="text-center">
                <img src={settings.signature_url} alt="Signature" className="w-32 h-16 object-contain" />
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{t.authorizedSignature}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════ FOOTER ═══════ */}
      <div className="mt-10 px-10 py-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-[9px] text-gray-400">
          <span>{entity.name}</span>
          <span>{invoice.number} · {invoice.date}</span>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-1.5" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #162544 40%, #1a3a6b 100%)' }} />
    </div>
  );
}
