"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { PixDirect } from "@/components/PixDirect";
import { pixDirectEnabled } from "@/lib/pix";

const FREE_THEMES = new Set<ThemeKey>(["aurora", "galaxy"]);
const PRO_PRICE = 19;

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
  const [brightness, setBrightness] = useState(1.25);
  const [stars, setStars] = useState(true);
  const [music, setMusic] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // Pro paywall
  const [pro, setPro] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem("velox_pro") === "1") setPro(true); } catch {}
  }, []);

  const locked = (k: ThemeKey) => !pro && !FREE_THEMES.has(k);
  const pickTheme = (k: ThemeKey) => {
    if (locked(k)) { setUnlockOpen(true); return; }
    setTheme(k);
  };
  const toggleMusic = () => {
    if (!pro) { setUnlockOpen(true); return; }
    setMusic((v) => !v);
  };
  const submitCode = async () => {
    setChecking(true); setCodeErr("");
    try {
      const r = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }).then((res) => res.json());
      if (r.ok) {
        setPro(true);
        try { localStorage.setItem("velox_pro", "1"); } catch {}
        setUnlockOpen(false);
      } else {
        setCodeErr(lang === "pt" ? "Código inválido. Confira e tente de novo." : "Invalid code. Check and try again.");
      }
    } catch {
      setCodeErr(lang === "pt" ? "Erro de conexão." : "Connection error.");
    }
    setChecking(false);
  };
  const resetPro = () => {
    try { localStorage.removeItem("velox_pro"); } catch {}
    setPro(false);
    if (!FREE_THEMES.has(theme)) setTheme("aurora");
    setMusic(false);
  };

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

    // --- pre-rendered glow sprites (so stars actually SHINE) ---
    const mkGlow = (size: number, rgb: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grd.addColorStop(0, `rgba(${rgb},1)`);
      grd.addColorStop(0.14, `rgba(${rgb},0.95)`);
      grd.addColorStop(0.4, `rgba(${rgb},0.35)`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grd;
      g.fillRect(0, 0, size, size);
      return c;
    };
    const mkFlare = (size: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d")!;
      g.translate(size / 2, size / 2);
      const line = () => {
        const grd = g.createLinearGradient(-size / 2, 0, size / 2, 0);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(0.5, "rgba(255,255,255,0.9)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grd;
        g.fillRect(-size / 2, -0.9, size, 1.8);
      };
      line();
      g.rotate(Math.PI / 2);
      line();
      return c;
    };
    const spriteWhite = mkGlow(64, "255,255,255");
    const spriteBlue = mkGlow(64, "168,206,255");
    const spriteGreen = mkGlow(48, "120,255,170");
    const flare = mkFlare(90);

    const small = typeof window !== "undefined" && window.innerWidth < 640;
    const N = small ? 280 : 460;
    const NG = small ? 70 : 130;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const stars = Array.from({ length: N }, () => {
      const big = Math.random() < 0.07;
      return {
        x: rnd(-0.4, 1.4),
        y: rnd(-0.4, 1.4),
        s: big ? rnd(16, 30) : rnd(3, 9),
        ph: Math.random() * Math.PI * 2,
        tw: rnd(0.25, 0.9),
        blue: Math.random() < 0.4,
        big,
      };
    });
    const greens = Array.from({ length: NG }, () => ({
      x: rnd(-0.4, 1.4),
      y: rnd(-0.4, 1.4),
      s: rnd(4, 8),
      ph: Math.random() * Math.PI * 2,
    }));
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      bx: 0.15 + (i / 6) * 0.7,
      by: 0.25 + (i % 3) * 0.22,
      phase: i * 1.7,
      ci: i % 4,
      rad: 0.55 + (i % 3) * 0.2,
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
      const beat = s.music ? 0.55 + levelRef.current * 2.2 : 1;
      const bright = s.brightness * beat;

      // background
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#03030a";
      ctx.fillRect(0, 0, w, h);

      // nebula clouds (drift)
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const x = (b.bx + Math.sin(clock * 0.45 + b.phase) * 0.16) * w;
        const y = (b.by + Math.cos(clock * 0.38 + b.phase) * 0.14) * h;
        const R = b.rad * Math.min(w, h) * (0.9 + 0.15 * Math.sin(clock + b.phase)) * (s.music ? beat : 1);
        const [r, g, bl] = pal[b.ci % pal.length];
        const grad = ctx.createRadialGradient(x, y, 0, x, y, R);
        const a = 0.5 * bright;
        grad.addColorStop(0, `rgba(${r},${g},${bl},${Math.min(a, 0.95)})`);
        grad.addColorStop(0.45, `rgba(${r},${g},${bl},${Math.min(a * 0.4, 0.5)})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, R, 0, Math.PI * 2);
        ctx.fill();
      }

      // rotating starfield + green laser dots (the "projector" effect)
      if (s.stars) {
        const cx = w / 2, cy = h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(clock * 0.05);
        ctx.translate(-cx, -cy);
        ctx.globalCompositeOperation = "lighter";

        for (const st of stars) {
          const px = st.x * w, py = st.y * h;
          const tw = 1 - st.tw * (0.5 + 0.5 * Math.sin(clock * 1.7 + st.ph));
          const size = st.s * (0.9 + 0.25 * Math.sin(clock + st.ph)) * (s.music ? 0.8 + beat * 0.4 : 1);
          ctx.globalAlpha = Math.min(1, tw * bright);
          ctx.drawImage(st.blue ? spriteBlue : spriteWhite, px - size / 2, py - size / 2, size, size);
          if (st.big) {
            const fs = size * 2.6;
            ctx.globalAlpha = Math.min(1, tw * 0.8 * bright);
            ctx.drawImage(flare, px - fs / 2, py - fs / 2, fs, fs);
          }
        }

        for (const gd of greens) {
          const px = gd.x * w, py = gd.y * h;
          const tw = 0.6 + 0.4 * Math.sin(clock * 2.2 + gd.ph);
          const size = gd.s * (s.music ? 0.8 + beat * 0.4 : 1);
          ctx.globalAlpha = Math.min(1, tw * 0.9 * bright);
          ctx.drawImage(spriteGreen, px - size / 2, py - size / 2, size, size);
        }
        ctx.restore();
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
          <div className="flex items-center gap-2">
            {pro ? (
              <>
                <span className="rounded-full bg-gradient-to-r from-teal to-violet px-3 py-1.5 text-xs font-bold text-[#060611]">PRO ✓</span>
                <button onClick={resetPro} title="Reset (teste)" className="rounded-full bg-black/40 px-2.5 py-1.5 text-xs font-semibold backdrop-blur hover:bg-black/60">↺</button>
              </>
            ) : (
              <button onClick={() => setUnlockOpen(true)} className="btn-primary rounded-full px-3 py-1.5 text-xs">
                🔓 {lang === "pt" ? "Virar Pro" : "Go Pro"}
              </button>
            )}
            <button onClick={() => setUiHidden(true)} className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-black/60">
              {lang === "pt" ? "Ocultar" : "Hide"} ✕
            </button>
          </div>
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
                  onClick={() => pickTheme(k)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    theme === k ? "bg-gradient-to-r from-teal to-violet text-[#060611]" : "border border-border text-foreground hover:border-white/40"
                  } ${locked(k) ? "opacity-70" : ""}`}
                >
                  {THEME_LABELS[k].emoji} {THEME_LABELS[k][lang]}{locked(k) ? " 🔒" : ""}
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
              <button onClick={toggleMusic} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${music ? "bg-gradient-to-r from-pink to-violet text-[#060611]" : "border border-border text-muted"}`}>
                🎵 {lang === "pt" ? "Modo música" : "Music mode"}: {music ? "ON" : "OFF"}{!pro ? " 🔒" : ""}
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

      {/* Pro unlock modal */}
      {unlockOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setUnlockOpen(false)}>
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-extrabold">🔓 Velox Studio <span className="text-aurora">Pro</span></h3>
              <button onClick={() => setUnlockOpen(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border hover:bg-white/10">✕</button>
            </div>
            <p className="mt-1 text-sm text-muted">
              {lang === "pt"
                ? "Desbloqueie tudo, para sempre, com um único pagamento."
                : "Unlock everything, forever, with a single payment."}
            </p>

            <ul className="mt-4 space-y-1.5 text-sm">
              {[
                { pt: "Todos os 6 temas + cores personalizadas", en: "All 6 themes + custom colors" },
                { pt: "Modo música (reage ao som)", en: "Music mode (reacts to sound)" },
                { pt: "Sem anúncios, atualizações grátis", en: "No ads, free updates" },
              ].map((b) => (
                <li key={b.en} className="flex items-center gap-2"><span className="text-teal">✓</span> {b[lang]}</li>
              ))}
            </ul>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-extrabold">R$ {PRO_PRICE},00</span>
              <span className="mb-1 text-sm text-muted">{lang === "pt" ? "pagamento único" : "one-time"}</span>
            </div>

            {pixDirectEnabled ? (
              <div className="mt-3 -mx-4">
                <PixDirect amount={PRO_PRICE} txid="PRO" />
              </div>
            ) : (
              <p className="mt-3 rounded-xl bg-card-2/50 p-3 text-xs text-muted">
                {lang === "pt" ? "Pix será exibido aqui quando a chave estiver configurada." : "Pix will appear here once the key is configured."}
              </p>
            )}

            <div className="mt-4 rounded-xl border border-border bg-card-2/40 p-4">
              <p className="text-sm font-semibold">
                {lang === "pt" ? "Já pagou? Digite o código que você recebeu:" : "Already paid? Enter the code you received:"}
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitCode()}
                  placeholder={lang === "pt" ? "Código" : "Code"}
                  className="flex-1 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm uppercase outline-none focus:border-violet/60"
                />
                <button onClick={submitCode} disabled={checking || !code} className="btn-primary rounded-xl px-4 py-2 text-sm disabled:opacity-60">
                  {checking ? "..." : lang === "pt" ? "Desbloquear" : "Unlock"}
                </button>
              </div>
              {codeErr && <p className="mt-2 text-xs text-pink">{codeErr}</p>}
              <p className="mt-2 text-[11px] text-muted">
                {lang === "pt"
                  ? "Após o Pix cair no seu Nubank, você envia o código ao cliente."
                  : "After the Pix lands in your Nubank, you send the customer the code."}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
