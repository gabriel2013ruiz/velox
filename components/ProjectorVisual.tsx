export function ProjectorVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square w-full max-w-[520px] mx-auto ${className}`}>
      {/* Aurora light projection */}
      <div className="absolute inset-0 rounded-[28px] overflow-hidden border border-border bg-[#04040c] starfield">
        <div className="absolute inset-0">
          <div
            className="absolute -top-1/4 left-1/2 h-[140%] w-[180%] -translate-x-1/2 animate-float"
            style={{
              background:
                "radial-gradient(50% 40% at 30% 30%, rgba(52,245,197,0.55), transparent 60%)," +
                "radial-gradient(55% 45% at 70% 25%, rgba(160,107,255,0.55), transparent 60%)," +
                "radial-gradient(45% 40% at 55% 55%, rgba(255,92,200,0.45), transparent 60%)," +
                "radial-gradient(40% 35% at 40% 65%, rgba(58,160,255,0.45), transparent 60%)",
              filter: "blur(26px)",
            }}
          />
        </div>

        {/* projector beam */}
        <div
          className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[68%] h-[60%]"
          style={{
            background: "linear-gradient(to top, rgba(160,107,255,0.28), transparent 75%)",
            clipPath: "polygon(38% 100%, 62% 100%, 100% 0, 0 0)",
            filter: "blur(2px)",
          }}
        />

        {/* the device */}
        <div className="absolute bottom-[9%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div
            className="h-16 w-16 rounded-full pulse-glow"
            style={{
              background: "radial-gradient(circle at 35% 30%, #2a2a45, #0c0c1a 70%)",
              boxShadow: "inset 0 0 14px rgba(0,0,0,0.8)",
            }}
          >
            <div
              className="h-full w-full rounded-full animate-spin-slow"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(52,245,197,0.0), rgba(52,245,197,0.7), rgba(160,107,255,0.7), rgba(255,92,200,0.6), rgba(52,245,197,0.0))",
                mask: "radial-gradient(circle, transparent 40%, #000 42%, #000 70%, transparent 72%)",
                WebkitMask: "radial-gradient(circle, transparent 40%, #000 42%, #000 70%, transparent 72%)",
              }}
            />
          </div>
          <div className="mt-1 h-3 w-24 rounded-b-2xl rounded-t-md bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14] border-x border-b border-border" />
          <div className="mt-1 h-1.5 w-10 rounded-full bg-[#111122]" />
        </div>

        {/* brand watermark */}
        <div className="absolute top-4 left-5 text-xs font-bold tracking-[0.3em] text-white/40">
          VELOX
        </div>
      </div>
    </div>
  );
}
