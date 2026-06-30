"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { CartDrawer, Toast } from "@/components/CartDrawer";
import { ProjectorVisual } from "@/components/ProjectorVisual";
import { Gallery } from "@/components/Gallery";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { Stars } from "@/components/Stars";
import { PaymentRow } from "@/components/PaymentIcons";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useDemo } from "@/lib/demo";
import { bundles, reviews, priceFor, compareFor, formatMoney } from "@/lib/products";

/* ---------- Announcement marquee ---------- */
function Announcement() {
  const { t } = useI18n();
  const msgs = [t("ann.1"), t("ann.5"), t("ann.2"), t("ann.3"), t("ann.4")];
  const row = [...msgs, ...msgs];
  return (
    <div className="overflow-hidden border-b border-border bg-gradient-to-r from-violet/10 via-transparent to-teal/10 py-2 text-xs">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((m, i) => (
          <span key={i} className="text-muted">{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const { t, lang } = useI18n();
  const { setOpen: setDemoOpen } = useDemo();
  return (
    <section id="top" className="aurora relative">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 py-14 md:grid-cols-2 md:py-20">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
            <span className="text-teal">★</span> {t("hero.badge")}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl text-balance">
            {t("hero.title1")} <span className="text-aurora">{t("hero.title2")}</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted sm:text-lg">{t("hero.sub")}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#buy" className="btn-primary rounded-full px-7 py-3.5 text-base">{t("hero.cta")}</a>
            <button onClick={() => setDemoOpen(true)} className="rounded-full border border-border px-6 py-3.5 text-base hover:border-white/40 transition">
              ▶ {t("hero.cta2")}
            </button>
          </div>
          <a href="/studio" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-aurora hover:underline">
            ✨ {t("hero.studio")} →
          </a>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2"><Stars n={5} /> {t("hero.rating")}</span>
            <span className="flex items-center gap-1.5"><span className="text-teal">⚡</span> {t("hero.ships")}</span>
          </div>
          <div className="mt-5"><PaymentRow lang={lang} /></div>
        </div>

        <div className="fade-up relative">
          <button
            onClick={() => setDemoOpen(true)}
            className="group relative block w-full overflow-hidden rounded-[28px] border border-border pulse-glow text-left"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/products/hero.jpg"
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105 sm:aspect-[5/4]"
            >
              <source src="/products/aurora.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#060611]/70 via-transparent to-transparent" />
            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-bold backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-pink" /> AO VIVO
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-bold tracking-[0.25em] backdrop-blur">
              VELOX AURORA
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Stars n={5} /> 4,9 · 12.480
            </div>
            {/* play affordance */}
            <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur border border-white/40 text-2xl">▶</span>
            </span>
          </button>
          {/* floating projector chip */}
          <div className="absolute -bottom-6 -right-2 hidden w-36 rotate-3 sm:block">
            <ProjectorVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Trust logos ---------- */
function Logos() {
  const { t } = useI18n();
  const names = ["TikTok", "Instagram", "Forbes", "TechTudo", "Vogue"];
  return (
    <section className="border-y border-border py-7">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold tracking-[0.3em] text-muted">{t("logos.title")}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-60">
          {names.map((n) => (
            <span key={n} className="text-lg font-bold tracking-tight">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
function Features() {
  const { t } = useI18n();
  const items = [
    { i: "🌌", k: "feat.1" },
    { i: "🎨", k: "feat.2" },
    { i: "🎵", k: "feat.3" },
    { i: "📱", k: "feat.4" },
    { i: "😴", k: "feat.5" },
    { i: "⚡", k: "feat.6" },
  ];
  return (
    <section id="product" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl text-balance">{t("feat.title")}</h2>
        <p className="mt-3 text-muted">{t("feat.sub")}</p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.k} className="card-hover rounded-2xl border border-border bg-card p-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-card-2 text-2xl">{it.i}</div>
            <h3 className="mt-4 text-lg font-bold">{t(`${it.k}.t`)}</h3>
            <p className="mt-2 text-sm text-muted">{t(`${it.k}.d`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
function How() {
  const { t } = useI18n();
  const steps = ["how.1", "how.2", "how.3"];
  return (
    <section id="how" className="aurora relative border-y border-border bg-card/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">{t("how.title")}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s} className="relative text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-border bg-card text-2xl font-extrabold text-aurora">
                {i + 1}
              </div>
              <h3 className="mt-5 text-xl font-bold">{t(`${s}.t`)}</h3>
              <p className="mt-2 text-sm text-muted">{t(`${s}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Buy / bundles ---------- */
function Buy() {
  const { t, lang } = useI18n();
  const { add, setOpen, fireToast } = useCart();

  const onAdd = (id: string) => {
    add(id);
    setOpen(true);
    fireToast(t("toast.added"));
  };

  return (
    <section id="buy" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t("buy.title")}</h2>
        <p className="mt-3 text-muted">{t("buy.sub")}</p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {bundles.map((b) => {
          const price = priceFor(b, lang);
          const compare = compareFor(b, lang);
          const each = price / b.qty;
          const savePct = Math.round((1 - price / compare) * 100);
          const highlighted = b.badge === "popular";
          return (
            <div
              key={b.id}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                highlighted ? "border-violet/60 bg-card pulse-glow" : "border-border bg-card card-hover"
              }`}
            >
              {b.badge && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold ${
                    b.badge === "popular"
                      ? "bg-gradient-to-r from-teal to-violet text-[#060611]"
                      : "bg-pink text-[#060611]"
                  }`}
                >
                  {b.badge === "popular" ? t("buy.popular") : t("buy.best")}
                </span>
              )}

              <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/products/card.jpg" alt="Velox Aurora" className="h-full w-full object-cover" />
                <span className="absolute right-3 top-3 grid h-8 min-w-8 place-items-center rounded-full bg-black/60 px-2 text-sm font-bold backdrop-blur">
                  ×{b.qty}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold">{b.name[lang]}</h3>
              <p className="text-sm text-muted">{b.blurb[lang]}</p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-3xl font-extrabold">{formatMoney(price, lang)}</span>
                <span className="mb-1 text-sm text-muted line-through">{formatMoney(compare, lang)}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="rounded-full bg-teal/15 px-2 py-0.5 font-semibold text-teal">
                  −{savePct}% {t("buy.save")}
                </span>
                <span className="text-muted">{formatMoney(each, lang)} {t("buy.each")}</span>
              </div>

              <button onClick={() => onAdd(b.id)} className="btn-primary mt-6 rounded-full py-3.5 text-sm">
                {t("buy.add")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted">✓ {t("buy.guarantee")}</p>
      <div className="mt-4 flex justify-center"><PaymentRow lang={lang} /></div>
    </section>
  );
}

/* ---------- Reviews ---------- */
function Reviews() {
  const { t, lang } = useI18n();
  return (
    <section id="reviews" className="border-y border-border bg-card/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{t("reviews.title")}</h2>
          <p className="mt-3 text-muted">{t("reviews.sub")}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-card p-6">
              <Stars n={r.stars} />
              <p className="mt-3 text-sm leading-relaxed">&ldquo;{r.text[lang]}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal to-violet text-sm font-bold text-[#060611]">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted">{r.location[lang]}</p>
                </div>
                <span className="ml-auto rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal">✓ {lang === "pt" ? "Verificado" : "Verified"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function Faq() {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const qs = ["faq.1", "faq.2", "faq.3", "faq.4", "faq.5"];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold sm:text-4xl">{t("faq.title")}</h2>
      <div className="mt-10 space-y-3">
        {qs.map((q, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={q} className="rounded-2xl border border-border bg-card">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
              >
                {t(`${q}.q`)}
                <span className={`text-aurora transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`grid transition-all ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-muted">{t(`${q}.a`)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Studio app promo ---------- */
function StudioPromo() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="aurora relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-violet px-3 py-1 text-xs font-bold text-[#060611]">
          {t("studiopromo.badge")}
        </span>
        <h2 className="mt-4 max-w-2xl text-3xl font-extrabold sm:text-4xl text-balance">{t("studiopromo.title")}</h2>
        <p className="mt-3 max-w-xl text-muted">{t("studiopromo.sub")}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-border bg-card-2 px-3 py-1.5">{t("studiopromo.feat1")}</span>
          <span className="rounded-full border border-border bg-card-2 px-3 py-1.5">{t("studiopromo.feat2")}</span>
          <span className="rounded-full border border-border bg-card-2 px-3 py-1.5">{t("studiopromo.feat3")}</span>
        </div>
        <a href="/studio" className="btn-primary mt-7 inline-flex rounded-full px-7 py-3.5 text-base">{t("studiopromo.cta")}</a>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCta() {
  const { t, lang } = useI18n();
  return (
    <section className="aurora relative px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl text-balance">{t("final.title")}</h2>
        <p className="mt-4 text-lg text-muted">{t("final.sub")}</p>
        <a href="#buy" className="btn-primary mt-8 inline-flex rounded-full px-9 py-4 text-lg">{t("final.cta")}</a>
        <div className="mt-6 flex justify-center"><PaymentRow lang={lang} /></div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="border-t border-border bg-card/30 px-4 sm:px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <span className="text-aurora">◐</span> VELOX
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{t("footer.tag")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted">{t("footer.shop")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#product" className="text-muted hover:text-white">{t("nav.product")}</a></li>
            <li><a href="#buy" className="text-muted hover:text-white">{t("nav.buy")}</a></li>
            <li><a href="#reviews" className="text-muted hover:text-white">{t("nav.reviews")}</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted">{t("footer.help")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#faq" className="text-muted hover:text-white">{t("nav.faq")}</a></li>
            <li><a href="#how" className="text-muted hover:text-white">{t("nav.how")}</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted">{t("footer.secure")}</p>
          <div className="mt-3"><PaymentRow lang={lang} /></div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted">
        © 2026 Velox. {t("footer.rights")}
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Announcement />
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Features />
        <Gallery />
        <How />
        <Buy />
        <Reviews />
        <StudioPromo />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <CartDrawer />
      <InteractiveDemo />
      <Toast />
    </>
  );
}
