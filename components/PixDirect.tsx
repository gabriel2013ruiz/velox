"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildPixPayload, pixConfig } from "@/lib/pix";
import { useI18n } from "@/lib/i18n";

export function PixDirect({ amount, txid }: { amount: number; txid?: string }) {
  const { lang } = useI18n();
  const [qr, setQr] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const payload = buildPixPayload({
    key: pixConfig.key,
    name: pixConfig.name,
    city: pixConfig.city,
    amount,
    txid,
  });

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, width: 220 })
      .then(setQr)
      .catch(() => setQr(""));
  }, [payload]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="px-4 pb-4">
      <div className="rounded-xl bg-card-2/50 p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="Pix QR Code" className="h-40 w-40 shrink-0 rounded-lg bg-white p-1" />
          ) : (
            <div className="grid h-40 w-40 shrink-0 place-items-center rounded-lg bg-white/10 text-xs text-muted">QR…</div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {lang === "pt" ? "Pague com Pix em segundos" : "Pay with Pix in seconds"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {lang === "pt"
                ? "Escaneie o QR no app do seu banco, ou copie o código Pix abaixo."
                : "Scan the QR in your bank app, or copy the Pix code below."}
            </p>
            <div className="mt-3 break-all rounded-lg border border-border bg-background/40 px-3 py-2 font-mono text-[10px] leading-relaxed text-muted">
              {payload.slice(0, 70)}…
            </div>
            <button
              type="button"
              onClick={copy}
              className="mt-2 w-full rounded-full border border-border py-2 text-xs font-semibold hover:border-white/40"
            >
              {copied ? (lang === "pt" ? "✓ Copiado!" : "✓ Copied!") : (lang === "pt" ? "Copiar código Pix" : "Copy Pix code")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
