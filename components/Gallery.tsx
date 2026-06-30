"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

const IMAGES = [
  "/products/g1.jpg",
  "/products/hero.jpg",
  "/products/g2.jpg",
  "/products/g4.jpg",
  "/products/g3.jpg",
  "/products/g5.jpg",
  "/products/card.jpg",
  "/products/g6.jpg",
  "/products/g7.jpg",
];

export function Gallery() {
  const { t } = useI18n();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % IMAGES.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + IMAGES.length) % IMAGES.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t("gallery.title")}</h2>
        <p className="mt-3 text-muted">{t("gallery.sub")}</p>
      </div>

      <div className="mt-12 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {IMAGES.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className="group relative block w-full overflow-hidden rounded-2xl border border-border focus:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Velox Aurora"
              loading="lazy"
              className="w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold opacity-0 backdrop-blur transition group-hover:opacity-100">
              ◐ VELOX
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="#buy" className="btn-primary inline-flex rounded-full px-7 py-3.5 text-base">{t("gallery.cta")}</a>
      </div>

      {/* lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setActive(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setActive((active - 1 + IMAGES.length) % IMAGES.length); }}
            className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 text-xl hover:bg-white/10"
            aria-label="Previous"
          >‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMAGES[active]}
            alt="Velox Aurora"
            className="max-h-[85vh] max-w-full rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setActive((active + 1) % IMAGES.length); }}
            className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/40 text-xl hover:bg-white/10"
            aria-label="Next"
          >›</button>
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 hover:bg-white/10"
            aria-label="Close"
          >✕</button>
        </div>
      )}
    </section>
  );
}
