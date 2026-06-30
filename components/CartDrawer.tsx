"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { priceFor, formatMoney } from "@/lib/products";
import { PaymentRow } from "./PaymentIcons";

export function CartDrawer() {
  const { open, setOpen, detailed, setQty, remove, count } = useCart();
  const { t, lang } = useI18n();

  const subtotal = detailed.reduce((a, d) => a + priceFor(d.bundle, lang) * d.qty, 0);

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">{t("cart.title")} {count > 0 && <span className="text-muted">({count})</span>}</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Close">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        {detailed.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="text-5xl opacity-40">🛒</div>
            <p className="text-muted">{t("cart.empty")}</p>
            <button onClick={() => setOpen(false)} className="btn-primary rounded-full px-5 py-2.5 text-sm">
              {t("cart.emptycta")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {detailed.map(({ bundle, qty }) => (
                <div key={bundle.id} className="flex gap-3 rounded-xl border border-border bg-card-2/40 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/products/card.jpg" alt="Velox Aurora" className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-semibold text-sm">{bundle.name[lang]}</p>
                      <p className="font-bold text-sm whitespace-nowrap">{formatMoney(priceFor(bundle, lang) * qty, lang)}</p>
                    </div>
                    <p className="text-xs text-muted">{bundle.qty} × Velox Aurora</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(bundle.id, qty - 1)} className="px-2.5 py-1 text-muted hover:text-white">−</button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button onClick={() => setQty(bundle.id, qty + 1)} className="px-2.5 py-1 text-muted hover:text-white">+</button>
                      </div>
                      <button onClick={() => remove(bundle.id)} className="text-xs text-muted hover:text-pink transition">
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t("cart.shipping")}</span>
                <span className="font-semibold text-teal">{t("cart.free")}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>{t("cart.subtotal")}</span>
                <span>{formatMoney(subtotal, lang)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary block rounded-full py-3.5 text-center text-sm"
              >
                {t("cart.checkout")}
              </Link>
              <button onClick={() => setOpen(false)} className="w-full text-center text-xs text-muted hover:text-white">
                {t("cart.continue")}
              </button>
              <div className="flex justify-center pt-1"><PaymentRow lang={lang} /></div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function Toast() {
  const { toast } = useCart();
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 transition-all ${
        toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full border border-teal/40 bg-card px-5 py-3 text-sm font-semibold shadow-xl">
        <span className="text-teal">✓</span> {toast}
      </div>
    </div>
  );
}
