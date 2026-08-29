import { useEffect, useRef, useState } from "react";

interface WarpEventDetail {
  direction: "to-future" | "to-past";
  x?: number;
  y?: number;
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  angle: number;
  speed: number;
  color: string;
  size: number;
}

type WarpPhase = "hold" | "black" | "charcoal" | "gray" | "parchment" | "accent";

const PAST_PHASES: Array<[WarpPhase, number]> = [
  ["black", 110],
  ["charcoal", 360],
  ["gray", 690],
  ["parchment", 1020],
  ["accent", 1320],
];

export default function TimeWarpOverlay() {
  const [warpState, setWarpState] = useState<{
    active: boolean;
    direction: "to-future" | "to-past";
    origin: { x: number; y: number };
    phase: "intro" | "warp" | "settle" | WarpPhase;
    currentYear: number;
    progress: number;
  }>({
    active: false,
    direction: "to-future",
    origin: { x: 0, y: 0 },
    phase: "intro",
    currentYear: 1924,
    progress: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    const handleWarp = (e: CustomEvent<WarpEventDetail>) => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) return;

      const { direction, x, y } = e.detail;
      const originX = x ?? window.innerWidth / 2;
      const originY = y ?? window.innerHeight / 2;

      // Clear any pending timeouts from previous trigger
      timeoutRefs.current.forEach((t) => clearTimeout(t));
      timeoutRefs.current = [];

      const initialYear = direction === "to-future" ? 1924 : 2099;

      // The past has its own material-aging sequence; it is not a reversed warp.
      setWarpState({
        active: true,
        direction,
        origin: { x: originX, y: originY },
        phase: direction === "to-past" ? "hold" : "intro",
        currentYear: initialYear,
        progress: 0,
      });

      const phaseTimers = direction === "to-past"
        ? PAST_PHASES.map(([phase, delay]) => window.setTimeout(() => {
            setWarpState((prev) => ({ ...prev, phase }));
            window.dispatchEvent(new CustomEvent("temporal-warp-phase", { detail: { direction, phase } }));
          }, delay))
        : [
            window.setTimeout(() => setWarpState((prev) => ({ ...prev, phase: "warp" })), 280),
            window.setTimeout(() => setWarpState((prev) => ({ ...prev, phase: "settle" })), 950),
          ];

      // Complete transition & clean reset (1550ms)
      const t3 = window.setTimeout(() => {
        setWarpState({
          active: false,
          direction: "to-future",
          origin: { x: 0, y: 0 },
          phase: "intro",
          currentYear: 1924,
          progress: 0,
        });
        window.dispatchEvent(new CustomEvent("temporal-warp-complete"));
      }, 1550);

      timeoutRefs.current.push(...phaseTimers, t3);
    };

    window.addEventListener("temporal-warp", handleWarp as EventListener);

    return () => {
      window.removeEventListener("temporal-warp", handleWarp as EventListener);
      timeoutRefs.current.forEach((t) => clearTimeout(t));
      timeoutRefs.current = [];
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      // ThemeToggle listens for this as the single, idempotent cleanup signal.
      window.dispatchEvent(new CustomEvent("temporal-warp-complete"));
    };
  }, []);

  // Smooth Canvas Hyperspace Warp Engine & Real-time Year Calculation
  useEffect(() => {
    if (!warpState.active) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const clickOriginX = warpState.origin.x || width / 2;
    const clickOriginY = warpState.origin.y || height / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const isToFuture = warpState.direction === "to-future";

    // Palette setup
    const futureColors = [
      "#00f0ff",
      "#38bdf8",
      "#ffffff",
      "#00b4d8",
      "#7dd3fc",
      "#c4f1ff",
      "#0284c7",
    ];
    const pastColors = [
      "#dfa860",
      "#e5ba7a",
      "#f4efe6",
      "#c5a47e",
      "#b0957a",
      "#ffeedb",
      "#8c6f52",
    ];
    const colors = isToFuture ? futureColors : pastColors;

    const particleCount = isToFuture ? 220 : 150;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const initialZ = Math.random() * 900 + 40;
      particles.push({
        x: Math.cos(angle) * (Math.random() * 260 + 10),
        y: Math.sin(angle) * (Math.random() * 260 + 10),
        z: initialZ,
        prevZ: initialZ,
        angle,
        speed: isToFuture ? Math.random() * 22 + 14 : Math.random() * 20 + 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2.4 + 0.8,
      });
    }

    const startTime = performance.now();
    const duration = 1500;

    let lastYearUpdate = 0;

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (!isToFuture) {
        // Dedicated aging renderer: a left-to-right boundary deposits material,
        // rather than running the hyperspace particles backwards.
        const hold = 0.075;
        const boundaryProgress = Math.max(0, Math.min(1, (progress - hold) / 0.78));
        const bx = boundaryProgress * (width + 180) - 90;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgba(2,5,9,.9)";
        ctx.fillRect(Math.max(0, bx), 0, width - bx, height);
        const stages = ["#050505", "#282621", "#77736b", "#e8dcc1"];
        const stage = Math.min(3, Math.floor(boundaryProgress * 4));
        ctx.fillStyle = stages[stage];
        ctx.globalAlpha = .72;
        ctx.fillRect(0, 0, Math.max(0, bx), height);
        ctx.globalAlpha = 1;
        const glow = ctx.createLinearGradient(bx - 70, 0, bx + 70, 0);
        glow.addColorStop(0, "rgba(80,55,30,.15)");
        glow.addColorStop(.45, "rgba(0,240,255,.75)");
        glow.addColorStop(.55, "rgba(224,184,112,.75)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(bx - 70, 0, 140, height);
        // Oxidation, crumbling metal, scratches, fibers and ink flecks local to the boundary.
        particles.forEach((p, i) => {
          const px = bx + Math.sin(p.angle * 9 + i) * 74;
          const py = ((p.y + i * 47) % (height + 40)) - 20;
          const aged = px < bx;
          ctx.fillStyle = aged ? (i % 3 ? "rgba(48,38,27,.72)" : "rgba(126,74,37,.6)") : p.color;
          ctx.fillRect(px, py, aged ? 1 + i % 4 : 2, aged ? 1 : 2 + i % 5);
          if (i % 13 === 0) {
            ctx.strokeStyle = aged ? "rgba(40,32,24,.45)" : "rgba(0,240,255,.45)";
            ctx.beginPath(); ctx.moveTo(px - 30, py); ctx.lineTo(px + 30 + i % 45, py + (i % 3)); ctx.stroke();
          }
        });
        if (progress < 1) animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Smooth non-linear velocity multiplier (future simulation only)
      const velocityCurve = Math.sin(progress * Math.PI);

      // Update live year ticker smoothly
      if (now - lastYearUpdate > 25) {
        lastYearUpdate = now;
        const yearProgress = Math.pow(progress, 1.2);
        const interpolatedYear = isToFuture
          ? Math.round(1924 + (2099 - 1924) * yearProgress)
          : Math.round(2099 - (2099 - 1924) * yearProgress);

        setWarpState((prev) => ({
          ...prev,
          currentYear: interpolatedYear,
          progress: progress,
        }));
      }

      ctx.clearRect(0, 0, width, height);

      // Warp center smoothly blends from click location toward center for full immersion
      const centerBlend = Math.sin(progress * Math.PI) * 0.85;
      const curOriginX = clickOriginX * (1 - centerBlend) + centerX * centerBlend;
      const curOriginY = clickOriginY * (1 - centerBlend) + centerY * centerBlend;

      // Overall opacity envelope
      let alpha = 1;
      if (progress < 0.15) {
        alpha = progress / 0.15;
      } else if (progress > 0.75) {
        alpha = (1 - progress) / 0.25;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.95));

      // Draw Hyperspace Directional Speed Lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const effectiveSpeed = p.speed * (0.4 + velocityCurve * 3.4);

        if (isToFuture) {
          p.prevZ = p.z;
          p.z -= effectiveSpeed;

          if (p.z <= 12) {
            p.z = 900;
            p.prevZ = 900;
          }
        } else {
          p.prevZ = p.z;
          p.z += effectiveSpeed;

          if (p.z >= 900) {
            p.z = 18;
            p.prevZ = 18;
          }
        }

        const k = 420 / Math.max(p.z, 10);
        const px = curOriginX + p.x * k;
        const py = curOriginY + p.y * k;

        const prevK = 420 / Math.max(p.prevZ, 10);
        const prevPx = curOriginX + p.x * prevK;
        const prevPy = curOriginY + p.y * prevK;

        if (px >= -50 && px <= width + 50 && py >= -50 && py <= height + 50) {
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.min(p.size * k * 0.75, 8);
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      // Shockwave ring expansion during peak apex
      if (progress > 0.25 && progress < 0.8) {
        const shockProgress = (progress - 0.25) / 0.55;
        const shockRadius = shockProgress * Math.max(width, height) * 0.95;
        const shockAlpha = (1 - shockProgress) * 0.5;

        ctx.beginPath();
        ctx.arc(curOriginX, curOriginY, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isToFuture
          ? `rgba(0, 240, 255, ${shockAlpha})`
          : `rgba(223, 168, 96, ${shockAlpha})`;
        ctx.lineWidth = 3 * (1 - shockProgress);
        ctx.stroke();
      }

      ctx.restore();

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [warpState.active, warpState.direction, warpState.origin]);

  if (!warpState.active) return null;

  const isToFuture = warpState.direction === "to-future";
  const percentComplete = Math.max(
    0,
    Math.min(100, Math.round((warpState.progress || 0) * 100))
  );
  const currentYearDisplay = Number.isFinite(warpState.currentYear)
    ? warpState.currentYear
    : isToFuture
    ? 1924
    : 2099;

  if (!isToFuture) {
    const pastPhase = warpState.phase as WarpPhase;
    return (
      <div className={`time-aging-overlay aging-${pastPhase}`} aria-hidden="true">
        <canvas ref={canvasRef} />
        <div className="aging-scan-errors" />
        <div className="aging-cracks" />
        <div className="aging-glyphs">⌁ 0x19 ▧ Æ // ERR_2099 § ⌁</div>
        <div className="aging-boundary-label">MATERIAL AGE / 1924</div>
        <div className="aging-last-accent" />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── 1. Fullscreen Hyperspace Warp Canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ── 2. Cinematic Atmospheric Gradient & Vignette ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          warpState.phase === "warp" ? "opacity-95" : "opacity-55"
        }`}
      >
        {isToFuture ? (
          // Future: Electric Deep Space Cyber Radial
          <div className="absolute inset-0 bg-radial from-cyan-500/30 via-slate-950/65 to-black/85 mix-blend-screen" />
        ) : (
          // Past: Vintage Amber Parchment Vignette
          <div className="absolute inset-0 bg-radial from-amber-500/25 via-amber-950/55 to-black/80 mix-blend-multiply" />
        )}
      </div>

      {/* ── 3. High-Speed Digital Scanlines Sweep ── */}
      <div className="absolute inset-0 opacity-30 overflow-hidden animate-temporal-scanline pointer-events-none">
        <div
          className="w-full h-[200vh]"
          style={{
            backgroundImage: isToFuture
              ? "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 240, 255, 0.45) 4px, transparent 6px)"
              : "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(223, 168, 96, 0.4) 5px, transparent 8px)",
          }}
        />
      </div>

      {/* ── 4. CRT Horizontal Beam Line (Peak Apex) ── */}
      {warpState.phase === "warp" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-temporal-crt">
          <div
            className={`w-full h-1.5 ${
              isToFuture
                ? "bg-cyan-200 shadow-[0_0_35px_rgba(0,240,255,1)]"
                : "bg-amber-100 shadow-[0_0_35px_rgba(255,200,100,0.95)]"
            }`}
          />
        </div>
      )}

      {/* ── 5. PROMINENT CENTERED CINEMATIC TEMPORAL HUD MODAL ── */}
      <div className="relative z-20 w-[92vw] max-w-xl sm:max-w-2xl animate-temporal-hud-card pointer-events-none">
        <div
          className={`relative p-6 sm:p-8 rounded-none backdrop-blur-2xl font-mono text-center shadow-[0_0_60px_rgba(0,0,0,0.85)] border transition-all duration-300 ${
            isToFuture
              ? "bg-[#040a14]/94 border-cyan-400 text-cyan-300 shadow-[0_0_50px_rgba(0,240,255,0.4)]"
              : "bg-[#1f1710]/95 border-amber-500 text-amber-200 shadow-[0_0_50px_rgba(223,168,96,0.4)]"
          }`}
        >
          {/* Cyber / Vintage Corner Brackets */}
          <div
            className={`absolute top-0 left-0 size-5 border-t-2 border-l-2 ${
              isToFuture ? "border-cyan-300" : "border-amber-300"
            }`}
          />
          <div
            className={`absolute top-0 right-0 size-5 border-t-2 border-r-2 ${
              isToFuture ? "border-cyan-300" : "border-amber-300"
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 size-5 border-b-2 border-l-2 ${
              isToFuture ? "border-cyan-300" : "border-amber-300"
            }`}
          />
          <div
            className={`absolute bottom-0 right-0 size-5 border-b-2 border-r-2 ${
              isToFuture ? "border-cyan-300" : "border-amber-300"
            }`}
          />

          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b pb-2 mb-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold opacity-85 border-current">
            <span className="flex items-center gap-2">
              <span
                className={`inline-block size-2 rounded-full ${
                  isToFuture ? "bg-cyan-400 animate-ping" : "bg-amber-400 animate-ping"
                }`}
              />
              {isToFuture ? "TEMPORAL WARP ENGAGED" : "CHRONO REWIND ENGAGED"}
            </span>
            <span className="font-mono">{percentComplete}% SYNC</span>
          </div>

          {/* Large Live Chronometer Year Display */}
          <div className="my-3 sm:my-4">
            <div className="text-[11px] sm:text-xs uppercase tracking-[0.3em] opacity-75 font-semibold">
              {isToFuture ? "TRAVERSING TIMELINE" : "REWINDING TIMELINE"}
            </div>
            <div
              className={`text-5xl sm:text-7xl font-black tracking-wider my-2 tabular-nums transition-all ${
                isToFuture
                  ? "text-white drop-shadow-[0_0_24px_rgba(0,240,255,0.9)]"
                  : "text-amber-100 drop-shadow-[0_0_24px_rgba(255,200,100,0.85)]"
              }`}
            >
              {currentYearDisplay}
            </div>
          </div>

          {/* Origin & Destination Vector Badges */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 py-2.5 px-4 bg-black/45 border border-current/30 text-xs sm:text-sm font-bold tracking-wide my-4">
            {isToFuture ? (
              <>
                <span className="text-amber-300/70 font-serif line-through">
                  1924 VINTAGE
                </span>
                <span className="text-cyan-400 text-lg animate-pulse">
                  ──►►►
                </span>
                <span className="text-cyan-200 font-mono drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
                  2099 CYBERSPACE
                </span>
              </>
            ) : (
              <>
                <span className="text-cyan-300/70 font-mono line-through">
                  2099 CYBER
                </span>
                <span className="text-amber-400 text-lg animate-pulse">
                  ◄◄◄──
                </span>
                <span className="text-amber-100 font-serif drop-shadow-[0_0_10px_rgba(255,200,100,0.7)]">
                  1924 ARCHIVES
                </span>
              </>
            )}
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-black/60 h-2.5 mt-4 p-0.5 border border-current/40 overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                isToFuture
                  ? "bg-gradient-to-r from-cyan-500 via-sky-300 to-white shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                  : "bg-gradient-to-r from-amber-600 via-amber-300 to-amber-100 shadow-[0_0_12px_rgba(255,200,100,0.8)]"
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          {/* Bottom Sub-System Telemetry */}
          <div className="text-[9px] sm:text-[10px] tracking-widest opacity-80 mt-3 flex items-center justify-between font-mono">
            <span>
              {isToFuture ? "VELOCITY: 9.98c" : "REWIND VECTOR: -1.0x"}
            </span>
            <span>
              {isToFuture
                ? "QUANTUM FLUX STABLE"
                : "PARCHMENT MATRIX RESTORED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
