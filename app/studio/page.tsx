"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type ThemeKey = "aurora" | "galaxy" | "sunset" | "ocean" | "fire" | "forest" | "custom";

const THEMES: Record<Exclude<ThemeKey, "custom">, [number, number, number][]> = {
  aurora: [[52, 245, 197], [160, 107, 255], [255, 92, 200], [58, 160, 255]],
  galaxy: [[58, 160, 255], [160, 107, 255], [255, 92, 200], [99, 102, 241]],
  sunset: [[255, 140, 60], [255, 90, 120], [200, 80, 200], [255, 200, 80]],
  ocean: [[34, 211, 238], [59, 130, 246], [45, 212, 191], [37, 99, 235]],
  fire: [[255, 80, 30], [255, 160, 40], [255, 220, 80], [220, 40, 40]],
  forest: [[34, 197, 94], [132, 204, 22], [16, 185, 129], [250, 204, 21]],
};

const THEME_LABELS: Record<ThemeKey, { pt: string; en: string; emoji: string }> = {
  aurora: { pt: "Aurora", en: "Aurora", emoji: "🌌" },
  galaxy: { pt: "Galáxia", en: "Galaxy", emoji: "🌠" },
  sunset: { pt: "Pôr do sol", en: "Sunset", emoji: "🌅" },
  ocean: { pt: "Oceano", en: "Ocean", emoji: "🌊" },
  fire: { pt: "Fogo", en: "Fire", emoji: "🔥" },
  forest: { pt: "Floresta", en: "Forest", emoji: "🌿" },
  custom: { pt: "Minha cor", en: "My color", emoji: "🎨" },
};

function hexToPalette(hex: string): [number, number, number][] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) || 160;
  const g = parseInt(h.slice(2, 4), 16) || 107;
  const b = parseInt(h.slice(4, 6), 16) || 255;
  const mix = (a: number, t: number) => Math.round(a + (255 - a) * t);
  return [
    [r, g, b],
    [mix(r, 0.3), mix(g, 0.1), mix(b, 0.3)],
    [Math.round(r * 0.6), Math.round(g * 0.7), Math.round(b * 0.9)],
    [mix(r, 0.5), g, mix(b, 0.2)],
  ];
}

export default function Studio() {
  const { t, lang } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<ThemeKey>("aurora");
  const [custom, setCustom] = useState("#a06bff");
  const [speed, setSpeed] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [stars, setStars] = useState(true);
  const [music, setMusic] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // live settings the animation loop reads without restarting
  const settings = useRef({ theme, custom, speed, brightness, stars, music });
  settings.current = { theme, custom, speed, brightness, stars, music };

  // mic level (0..1)
  const levelRef = useRef(0);
  const audioRef = useRef<{ ctx: AudioContext; stream: MediaStream } | null>(null);

  // toggle mic
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        audioRef.current = { ctx, stream };
        const tick = () => {
          if (cancelled) return;
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length / 255;
          levelRef.current = levelRef.current * 0.8 + avg * 0.2;
          requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setMusic(false);
      }
    }
    if (music) start();
    return () => {
      cancelled = true;
      if (audioRef.current) {
        audioRef.current.stream.getTracks().forEach((tr) => tr.stop());
        audioRef.current.ctx.close().catch(() => {});
        audioRef.current = null;
      }
      levelRef.current = 0;
    };
  }, [music]);

  // main animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      bx: 0.2 + (i / 6) * 0.6,
      by: 0.3 + (i % 3) * 0.2,
      phase: i * 1.7,
      ci: i % 4,
      rad: 0.5 + (i % 3) * 0.18,
    }));
    const starField = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      ph: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let tPrev = 0;
    let clock = 0;
    const draw = (now: number) => {
      const s = settings.current;
      const dt = tPrev ? Math.min((now - tPrev) / 1000, 0.05) : 0;
      tPrev = now;
      clock += dt * s.speed;

      const pal = s.theme === "custom" ? hexToPalette(s.custom) : THEMES[s.theme];
      const beat = s.music ? 0.6 + levelRef.current * 1.8 : 1;
      const bright = s.brightness * beat;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#04040a";
      ctx.fillRect(0, 0, w, h);

      // stars
      if (s.stars) {
        for (const st of starField) {
          const tw = 0.5 + 0.5 * Math.sin(clock * 2 + st.ph);
          ctx.globalAlpha = tw * 0.8 * Math.min(bright, 1.2);
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(st.x * w, st.y * h, st.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // aurora blobs
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const x = (b.bx + Math.sin(clock * 0.5 + b.phase) * 0.16) * w;
        const y = (b.by + Math.cos(clock * 0.4 + b.phase) * 0.14) * h;
        const R = b.rad * Math.min(w, h) * (0.9 + 0.15 * Math.sin(clock + b.phase)) * (s.music ? beat : 1);
        const [r, g, bl] = pal[b.ci % pal.length];
        const grad = ctx.createRadialGradient(x, y, 0, x, y, R);
        const a = 0.42 * bright;
        grad.addColorStop(0, `rgba(${r},${g},${bl},${Math.min(a, 0.9)})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},${Math.min(a * 0.4, 0.5)})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, R, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const goFullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
      setUiHidden(true);
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const slider = "w-full accent-violet";

  return (
    <main ref={wrapRef} className="relative h-[100dvh] w-full overflow-hidden bg-[#04040a]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" onClick={() => uiHidden && setUiHidden(false)} />

      {/* top bar */}
      {!uiHidden && (
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-sm font-extrabold backdrop-blur">
            <span className="text-aurora">◐</span> VELOX <span className="font-medium text-muted">Studio</span>
          </Link>
          <button onClick={() => setUiHidden(true)} className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-black/60">
            {lang === "pt" ? "Ocultar controles" : "Hide controls"} ✕
          </button>
        </div>
      )}

      {/* show-controls hint when hidden */}
      {uiHidden && (
        <button
          onClick={() => setUiHidden(false)}
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-xs font-semibold backdrop-blur hover:bg-black/60"
        >
          {lang === "pt" ? "Tocar para mostrar controles" : "Tap to show controls"}
        </button>
      )}

      {/* control panel */}
      {!uiHidden && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-black/55 p-4 backdrop-blur-xl sm:p-5">
            {/* themes */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(THEME_LABELS) as ThemeKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setTheme(k)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    theme === k ? "bg-gradient-to-r from-teal to-violet text-[#060611]" : "border border-border text-foreground hover:border-white/40"
                  }`}
                >
                  {THEME_LABELS[k].emoji} {THEME_LABELS[k][lang]}
                </button>
              ))}
              {theme === "custom" && (
                <input type="color" value={custom} onChange={(e) => setCustom(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-border bg-transparent" />
              )}
            </div>

            {/* sliders */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-muted">
                {lang === "pt" ? "Velocidade" : "Speed"}
                <input type="range" min={0.1} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} className={slider} />
              </label>
              <label className="text-xs font-semibold text-muted">
                {lang === "pt" ? "Brilho" : "Brightness"}
                <input type="range" min={0.3} max={1.8} step={0.1} value={brightness} onChange={(e) => setBrightness(+e.target.value)} className={slider} />
              </label>
            </div>

            {/* toggles + actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={() => setStars((v) => !v)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${stars ? "bg-card text-foreground" : "border border-border text-muted"}`}>
                ✨ {lang === "pt" ? "Estrelas" : "Stars"}: {stars ? "ON" : "OFF"}
              </button>
              <button onClick={() => setMusic((v) => !v)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${music ? "bg-gradient-to-r from-pink to-violet text-[#060611]" : "border border-border text-muted"}`}>
                🎵 {lang === "pt" ? "Modo música" : "Music mode"}: {music ? "ON" : "OFF"}
              </button>
              <button onClick={goFullscreen} className="btn-primary ml-auto rounded-full px-5 py-2 text-sm">
                {isFull ? (lang === "pt" ? "Sair" : "Exit") : `▶ ${lang === "pt" ? "Projetar" : "Project"}`}
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-muted">
              {lang === "pt"
                ? "Dica: espelhe na sua TV (Chromecast / AirPlay) para o efeito completo na parede 📺"
                : "Tip: cast to your TV (Chromecast / AirPlay) for the full wall effect 📺"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
