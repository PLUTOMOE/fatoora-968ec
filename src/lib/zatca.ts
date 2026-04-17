function encodeTag(tag: number, value: string) {
  const valueBuffer = Buffer.from(value, "utf8");

  return Buffer.concat([Buffer.from([tag, valueBuffer.length]), valueBuffer]);
}

export function buildZatcaQrPayload(input: {
  sellerName: string;
  taxNumber: string;
  invoiceDate: string;
  invoiceTotal: number;
  vatTotal: number;
}) {
  const payload = Buffer.concat([
    encodeTag(1, input.sellerName || "Unknown Seller"),
    encodeTag(2, input.taxNumber || "000000000000000"),
    encodeTag(3, input.invoiceDate),
    encodeTag(4, input.invoiceTotal.toFixed(2)),
    encodeTag(5, input.vatTotal.toFixed(2)),
  ]);

  return payload.toString("base64");
}
