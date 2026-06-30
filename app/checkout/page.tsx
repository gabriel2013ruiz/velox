"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { priceFor, formatMoney } from "@/lib/products";
import { Visa, Mastercard, ApplePay, GooglePay, PayPal, Pix } from "@/components/PaymentIcons";

type Method = "card" | "pix" | "apple" | "google" | "paypal";

export default function Checkout() {
  const { t, lang } = useI18n();
  const { detailed, clear, fireToast } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<Method>(lang === "pt" ? "pix" : "card");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const subtotal = detailed.reduce((a, d) => a + priceFor(d.bundle, lang) * d.qty, 0);

  const allMethods: { id: Method; label: { pt: string; en: string }; icon: React.ReactNode; ptOnly?: boolean }[] = [
    { id: "pix", label: { pt: "Pix (aprovação na hora)", en: "Pix (instant)" }, icon: <Pix />, ptOnly: true },
    { id: "card", label: { pt: "Cartão de crédito / débito", en: "Credit / debit card" }, icon: <span className="flex gap-1"><Visa /><Mastercard /></span> },
    { id: "apple", label: { pt: "Apple Pay", en: "Apple Pay" }, icon: <ApplePay /> },
    { id: "google", label: { pt: "Google Pay", en: "Google Pay" }, icon: <GooglePay /> },
    { id: "paypal", label: { pt: "PayPal", en: "PayPal" }, icon: <PayPal /> },
  ];
  const methods = allMethods.filter((m) => (m.ptOnly ? lang === "pt" : true));

  const onPay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      clear();
      fireToast(t("toast.success"));
    }, 1600);
  };

  if (done) {
    return (
      <main className="aurora flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-teal to-violet text-4xl text-[#060611]">✓</div>
        <h1 className="mt-6 text-3xl font-extrabold">{t("toast.success")}</h1>
        <p className="mt-3 max-w-md text-muted">
          {lang === "pt"
            ? "Recebemos seu pedido. Enviamos a confirmação por e-mail e seu Velox Aurora sai em até 24h."
            : "We received your order. A confirmation is on its way and your Velox Aurora ships within 24h."}
        </p>
        <Link href="/" className="btn-primary mt-8 rounded-full px-7 py-3.5 text-sm">{t("co.back")}</Link>
      </main>
    );
  }

  if (detailed.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="text-5xl opacity-40">🛒</div>
        <p className="text-muted">{t("co.empty")}</p>
        <Link href="/" className="btn-primary rounded-full px-7 py-3.5 text-sm">{t("cart.emptycta")}</Link>
      </main>
    );
  }

  const input =
    "w-full rounded-xl border border-border bg-card-2/40 px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-violet/60";

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-aurora">◐</span> VELOX
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-white">{t("co.back")}</Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        {/* form */}
        <form onSubmit={onPay} className="space-y-8">
          <h1 className="text-2xl font-extrabold">{t("co.title")}</h1>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("co.contact")}</h2>
            <input className={input} type="email" required placeholder={t("co.email")} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("co.delivery")}</h2>
            <input className={input} required placeholder={t("co.name")} />
            <input className={input} required placeholder={t("co.address")} />
            <div className="grid grid-cols-2 gap-3">
              <input className={input} required placeholder={t("co.city")} />
              <input className={input} required placeholder={t("co.zip")} />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("co.payment")}</h2>
            <p className="flex items-center gap-2 text-xs text-muted">
              <span className="text-teal">🔒</span> {t("co.paysub")}
            </p>

            <div className="space-y-2">
              {methods.map((m) => (
                <div key={m.id} className={`rounded-xl border transition ${method === m.id ? "border-violet/60 bg-card" : "border-border"}`}>
                  <button
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <span className={`grid h-4 w-4 place-items-center rounded-full border ${method === m.id ? "border-violet" : "border-border"}`}>
                        {method === m.id && <span className="h-2 w-2 rounded-full bg-violet" />}
                      </span>
                      {m.label[lang]}
                    </span>
                    {m.icon}
                  </button>

                  {/* card fields */}
                  {method === m.id && m.id === "card" && (
                    <div className="space-y-3 px-4 pb-4">
                      <input className={input} required placeholder={t("co.cardnum")} inputMode="numeric" />
                      <div className="grid grid-cols-2 gap-3">
                        <input className={input} required placeholder={t("co.exp")} />
                        <input className={input} required placeholder={t("co.cvc")} inputMode="numeric" />
                      </div>
                    </div>
                  )}
                  {method === m.id && m.id === "pix" && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-4 rounded-xl bg-card-2/50 p-4">
                        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-white text-[8px] text-black">
                          {/* faux QR */}
                          <div className="grid grid-cols-5 gap-0.5">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <span key={i} className={`h-2 w-2 ${[0,1,2,4,5,6,8,12,14,18,20,22,23,24].includes(i) ? "bg-black" : "bg-white"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted">
                          {lang === "pt"
                            ? "Escaneie o QR Code no app do seu banco. A aprovação é na hora."
                            : "Scan the QR code in your bank app. Approval is instant."}
                        </p>
                      </div>
                    </div>
                  )}
                  {method === m.id && (m.id === "apple" || m.id === "google" || m.id === "paypal") && (
                    <div className="px-4 pb-4 text-xs text-muted">
                      {lang === "pt"
                        ? "Você será redirecionado para concluir o pagamento com segurança."
                        : "You'll be redirected to securely complete your payment."}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <button type="submit" disabled={processing} className="btn-primary w-full rounded-full py-4 text-base disabled:opacity-70">
            {processing
              ? lang === "pt" ? "Processando..." : "Processing..."
              : `${t("co.pay")} ${formatMoney(subtotal, lang)}`}
          </button>
          <p className="text-center text-xs text-muted">{t("co.demo")}</p>
        </form>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("co.summary")}</h2>
          <div className="mt-4 space-y-4">
            {detailed.map(({ bundle, qty }) => (
              <div key={bundle.id} className="flex items-center gap-3">
                <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#04040c] text-xl"
                     style={{ boxShadow: "inset 0 0 16px rgba(160,107,255,0.5)" }}>
                  🌌
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-violet text-[11px] font-bold text-[#060611]">{qty}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{bundle.name[lang]}</p>
                  <p className="text-xs text-muted">{bundle.qty} × Velox Aurora</p>
                </div>
                <p className="text-sm font-bold">{formatMoney(priceFor(bundle, lang) * qty, lang)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted">{t("cart.subtotal")}</span><span>{formatMoney(subtotal, lang)}</span></div>
            <div className="flex justify-between"><span className="text-muted">{t("cart.shipping")}</span><span className="font-semibold text-teal">{t("cart.free")}</span></div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-extrabold">
              <span>{t("co.total")}</span><span>{formatMoney(subtotal, lang)}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3 rounded-xl bg-card-2/40 py-3 text-xs text-muted">
            <span className="text-teal">🔒</span> {t("footer.secure")}
          </div>
        </aside>
      </div>
    </main>
  );
}
