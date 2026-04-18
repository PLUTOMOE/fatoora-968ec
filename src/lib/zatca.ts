export function getZatcaQRCode(
  sellerName: string,
  vatNumber: string,
  timestamp: string,
  invoiceTotal: string,
  vatTotal: string
): string {
  const encoder = new TextEncoder();
  
  const tags = [
    { tag: 1, value: sellerName || '' },
    { tag: 2, value: vatNumber || '' },
    { tag: 3, value: timestamp || '' },
    { tag: 4, value: invoiceTotal || '' },
    { tag: 5, value: vatTotal || '' }
  ];

  let totalLength = 0;
  const tagBuffers = tags.map(t => {
    const valueBuffer = encoder.encode(t.value.toString());
    totalLength += 2 + valueBuffer.length;
    return { tag: t.tag, buffer: valueBuffer };
  });

  const finalBuffer = new Uint8Array(totalLength);
  let offset = 0;

  for (const t of tagBuffers) {
    finalBuffer[offset++] = t.tag;
    finalBuffer[offset++] = t.buffer.length;
    finalBuffer.set(t.buffer, offset);
    offset += t.buffer.length;
  }

  let binary = '';
  for (let i = 0; i < finalBuffer.length; i++) {
    binary += String.fromCharCode(finalBuffer[i]);
  }
  return btoa(binary);
}
