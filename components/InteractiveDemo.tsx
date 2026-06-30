"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDemo } from "@/lib/demo";
import { useI18n } from "@/lib/i18n";

export function InteractiveDemo() {
  const { open, setOpen } = useDemo();
  const { t } = useI18n();
  const [pos, setPos] = useState(50); // 0..100, the reveal split
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (x != null) setFromClientX(x);
    };
    const up = () => (dragging.current = false);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [setFromClientX]);

  // reset + lock scroll when opened
  useEffect(() => {
    if (open) {
      setPos(50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
      if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-border bg-card p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold sm:text-2xl">{t("demo.title")}</h3>
            <p className="mt-1 text-sm text-muted">{t("demo.sub")}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border hover:bg-white/10"
            aria-label={t("demo.close")}
          >
            ✕
          </button>
        </div>

        {/* before / after slider */}
        <div
          ref={frameRef}
          className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-border"
          onMouseDown={(e) => { dragging.current = true; setFromClientX(e.clientX); }}
          onTouchStart={(e) => { dragging.current = true; setFromClientX(e.touches[0].clientX); }}
        >
          {/* AFTER (Velox ON) — full color */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/demo.jpg" alt="Com Velox Aurora" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold backdrop-blur">
            {t("demo.on")}
          </span>

          {/* BEFORE (Velox OFF) — same image, darkened, clipped to the left of the handle */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/demo.jpg"
              alt="Sem Velox"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.12) saturate(0.45) blur(1px)" }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-[#05050b]/50" />
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold backdrop-blur">
              {t("demo.off")}
            </span>
          </div>

          {/* handle */}
          <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
            <div className="h-full w-0.5 bg-white/80" />
            <div className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-black/40 backdrop-blur">
              <span className="text-sm font-bold text-white">⇄</span>
            </div>
          </div>

          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold backdrop-blur">
            {t("demo.hint")}
          </span>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">{t("hero.rating")}</p>
          <a
            href="#buy"
            onClick={() => setOpen(false)}
            className="btn-primary w-full rounded-full px-7 py-3 text-center text-sm sm:w-auto"
          >
            {t("demo.cta")}
          </a>
        </div>
      </div>
    </div>
  );
}
