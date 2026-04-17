declare module "qrcode" {
  export function toDataURL(
    text: string,
    options?: {
      errorCorrectionLevel?: "low" | "medium" | "quartile" | "high";
      margin?: number;
      width?: number;
    },
  ): Promise<string>;

  const QRCode: {
    toDataURL: typeof toDataURL;
  };

  export default QRCode;
}
