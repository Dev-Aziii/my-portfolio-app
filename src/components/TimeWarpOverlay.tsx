import { useEffect, useRef, useState } from "react";
import { TEMPORAL_TRANSITION_TIMING, type TemporalWarpDetail } from "../lib/temporalTransition";

type WarpPhase = "complete" | "hold" | "transform" | "settle";
type ParticleKind = "dot" | "fragment" | "spark" | "turbulence";
interface Particle { y: number; offset: number; drift: number; size: number; length: number; phase: number; kind: ParticleKind }

export default function TimeWarpOverlay() {
  const [phase, setPhase] = useState<WarpPhase>("complete");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<TemporalWarpDetail | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const startRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 });

  const cancelWork = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    const finish = () => {
      cancelWork();
      detailRef.current = null;
      const html = document.documentElement;
      html.classList.remove("temporal-transition");
      delete html.dataset.temporalDirection;
      delete html.dataset.sweepDirection;
      setPhase("complete");
      window.dispatchEvent(new CustomEvent("temporal-warp-complete"));
    };
    const startWarp = (event: Event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cancelWork();
      const detail = (event as CustomEvent<TemporalWarpDetail>).detail;
      const duration = Math.max(1, detail.duration);
      detailRef.current = { ...detail, duration };
      startRef.current = performance.now();
      const html = document.documentElement;
      html.classList.add("temporal-transition");
      html.dataset.temporalDirection = detail.direction;
      html.dataset.sweepDirection = detail.sweepDirection;
      html.style.setProperty("--temporal-duration", `${duration}ms`);
      setPhase("hold");

      const scale = duration / TEMPORAL_TRANSITION_TIMING.totalDuration;
      const schedule = (next: WarpPhase | typeof finish, delay: number) => {
        timersRef.current.push(window.setTimeout(
          typeof next === "function" ? next : () => setPhase(next), delay,
        ));
      };
      schedule("transform", TEMPORAL_TRANSITION_TIMING.themeSwapPoint * scale);
      schedule("settle", TEMPORAL_TRANSITION_TIMING.settlePoint * scale);
      schedule(finish, duration + TEMPORAL_TRANSITION_TIMING.safetyMargin);
    };
    window.addEventListener("temporal-warp", startWarp);
    return () => { window.removeEventListener("temporal-warp", startWarp); cancelWork(); };
  }, []);

  useEffect(() => {
    if (phase === "complete" || !canvasRef.current || !detailRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewportRef.current = { width, height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // Assigning canvas dimensions resets its state, so always restore the CSS-pixel transform.
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const count = Math.min(coarse ? 90 : 150, Math.max(36, Math.round(width * height / (coarse ? 18000 : 11000))));
      const originY = detailRef.current?.y ?? height / 2;
      particlesRef.current = Array.from({ length: count }, (_, index) => ({
        y: index < count / 4 ? originY + (Math.random() - .5) * Math.min(260, height * .35) : Math.random() * height,
        offset: (Math.random() - .72) * 86, drift: (Math.random() - .5) * 18,
        size: Math.random() * 2.2 + .7, length: Math.random() * 13 + 3,
        phase: Math.random() * Math.PI * 2,
        kind: (["dot", "fragment", "spark", "turbulence"] as ParticleKind[])[index % 4],
      }));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = (now: number) => {
      const detail = detailRef.current;
      if (!detail) return;
      const { width, height } = viewportRef.current;
      const progress = Math.min((now - startRef.current) / detail.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const sign = detail.sweepDirection === "left-to-right" ? 1 : -1;
      const boundary = sign > 0 ? eased * width : width - eased * width;
      const assembly = Math.max(0, (progress - .78) / .22);
      overlayRef.current?.style.setProperty("--boundary-x", `${boundary}px`);
      overlayRef.current?.style.setProperty("--boundary-opacity", `${Math.min(1, progress * 9) * (1 - assembly)}`);
      context.clearRect(0, 0, width, height);
      particlesRef.current.forEach((particle, index) => {
        const density = Math.exp(-Math.max(0, -sign * particle.offset) / 18);
        let x = boundary + sign * particle.offset;
        let y = particle.y + Math.sin(now / 70 + particle.phase) * particle.drift;
        if (assembly > 0) { x += ((index % 2 ? 8 : width - 8) - x) * assembly; y += ((index % 4 < 2 ? 8 : height - 8) - y) * assembly; }
        context.globalAlpha = Math.min(1, progress * 9) * (1 - assembly * assembly) * (.2 + density * .8);
        context.strokeStyle = detail.direction === "to-future" ? "#61f5ff" : "#d5a65f";
        context.fillStyle = index % 5 === 0 ? "#fff" : detail.direction === "to-future" ? "#9aabb8" : "#9d856c";
        context.lineWidth = particle.size; context.beginPath();
        if (particle.kind === "dot") { context.arc(x, y, particle.size, 0, Math.PI * 2); context.fill(); }
        else { if (particle.kind === "turbulence") context.arc(x, y, particle.length, particle.phase, particle.phase + 1.4); else { context.moveTo(x, y); context.lineTo(x + sign * particle.length, y + (particle.kind === "spark" ? particle.drift : 0)); } context.stroke(); }
      });
      context.globalAlpha = (1 - assembly) * .8; context.fillStyle = detail.direction === "to-future" ? "#b9fbff" : "#ffe1aa";
      context.fillRect(boundary - .75, 0, 1.5, height); context.globalAlpha = 1;
      if (progress < 1) frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null; };
  }, [phase === "complete"]);

  if (phase === "complete" || !detailRef.current) return null;
  const detail = detailRef.current;
  return <div ref={overlayRef} data-phase={phase} className={`temporal-overlay ${detail.direction}`} aria-hidden="true">
    <canvas ref={canvasRef} /><div className="temporal-boundary temporal-scanlines" /><div className="temporal-boundary temporal-circuitry" /><div className="temporal-boundary temporal-pulses" /><div className="temporal-boundary temporal-distortion" />
  </div>;
}
