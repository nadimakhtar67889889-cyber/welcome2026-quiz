import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeBox({ url, size = 220 }) {
  return (
    <div className="inline-flex flex-col items-center gap-4 rounded-2xl bg-ink p-6">
      <QRCodeCanvas value={url} size={size} bgColor="#ffffff" fgColor="#0B1220" level="M" />
      <p className="font-mono text-xs text-navy break-all max-w-[220px] text-center">{url}</p>
    </div>
  );
}
