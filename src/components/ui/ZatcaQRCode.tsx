"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { getZatcaQRCode } from "@/lib/zatca";

interface ZatcaQRCodeProps {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  invoiceTotal: string;
  vatTotal: string;
}

export function ZatcaQRCode({ sellerName, vatNumber, timestamp, invoiceTotal, vatTotal }: ZatcaQRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        if (!sellerName) return; // Wait until basically loaded
        
        const base64TLV = getZatcaQRCode(
          sellerName || 'Vendor', 
          vatNumber || '300000000000003', // Fallback for invalid formats if any
          timestamp || new Date().toISOString(), 
          invoiceTotal || '0.00', 
          vatTotal || '0.00'
        );
        const url = await QRCode.toDataURL(base64TLV, { 
          errorCorrectionLevel: 'M', 
          margin: 1,
          width: 120 
        });
        setDataUrl(url);
      } catch (err) {
        console.error("QR Code Error:", err);
      }
    };
    generateQR();
  }, [sellerName, vatNumber, timestamp, invoiceTotal, vatTotal]);

  if (!dataUrl) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-muted/30 border border-border rounded flex items-center justify-center animate-pulse mb-1 mx-auto text-[10px] text-muted-foreground">
          QR
        </div>
        <div className="text-[9px] text-muted-foreground/80">QR Code · ZATCA</div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <img src={dataUrl} alt="ZATCA QR Code" className="w-24 h-24 object-contain rounded mb-1 mx-auto" />
      <div className="text-[9px] text-muted-foreground/80 mt-1">QR Code · ZATCA</div>
    </div>
  );
}
