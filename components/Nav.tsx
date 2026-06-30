"use client";

import { useEffect, useState } from "react";
import { useI18n, Lang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center rounded-full border border-border p-0.5 text-xs font-semibold">
      {(["pt", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full transition ${
            lang === l ? "bg-white text-[#060611]" : "text-muted hover:text-white"
          }`}
          aria-pressed={lang === l}
        >
          {l === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useI18n();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#product", key: "nav.product" },
    { href: "#how", key: "nav.how" },
    { href: "#reviews", key: "nav.reviews" },
    { href: "#faq", key: "nav.faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
        <a href="#top" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <span className="text-aurora">◐</span>
          <span>VELOX</span>
        </a>

        <div className="hidden md:flex items-center gap-7 text-sm text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition">
              {t(l.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LangToggle />
          <a href="#buy" className="hidden sm:inline-flex btn-primary rounded-full px-4 py-2 text-sm">
            {t("nav.buy")}
          </a>
          <button
            onClick={() => setOpen(true)}
            className="relative rounded-full border border-border p-2 hover:border-white/40 transition"
            aria-label="Cart"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13 5.4 5M7 13l-2 4h12" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-teal to-violet px-1 text-[11px] font-bold text-[#060611]">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
