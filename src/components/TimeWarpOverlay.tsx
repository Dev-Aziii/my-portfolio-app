import { useEffect, useRef, useState } from "react";
import {
  TEMPORAL_TRANSITION_DURATION,
  type TemporalWarpDetail,
} from "../lib/temporalTransition";

type ParticleKind = "dot" | "fragment" | "spark" | "turbulence";

interface Particle {
  y: number;
  offset: number;
  drift: number;
  size: number;
  length: number;
  phase: number;
  kind: ParticleKind;
}

interface WarpState extends TemporalWarpDetail {
  active: boolean;
}

const idleState: WarpState = {
  active: false,
  direction: "to-future",
  sweepDirection: "left-to-right",
  x: 0,
  y: 0,
  duration: TEMPORAL_TRANSITION_DURATION,
};

export default function TimeWarpOverlay() {
  const [warp, setWarp] = useState<WarpState>(idleState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const cleanupRef = useRef<number | null>(null);

  useEffect(() => {
    const startWarp = (event: CustomEvent<TemporalWarpDetail>) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (cleanupRef.current) window.clearTimeout(cleanupRef.current);

      const detail = event.detail;
      document.documentElement.classList.add("temporal-transition");
      document.documentElement.dataset.temporalDirection = detail.direction;
      document.documentElement.dataset.sweepDirection = detail.sweepDirection;
      document.documentElement.style.setProperty(
        "--temporal-duration",
        `${TEMPORAL_TRANSITION_DURATION}ms`,
      );
      setWarp({ ...detail, duration: TEMPORAL_TRANSITION_DURATION, active: true });

      cleanupRef.current = window.setTimeout(() => {
        document.documentElement.classList.remove("temporal-transition");
        delete document.documentElement.dataset.temporalDirection;
        delete document.documentElement.dataset.sweepDirection;
        setWarp(idleState);
        window.dispatchEvent(new CustomEvent("temporal-warp-complete"));
      }, TEMPORAL_TRANSITION_DURATION);
    };

    window.addEventListener("temporal-warp", startWarp as EventListener);
    return () => {
      window.removeEventListener("temporal-warp", startWarp as EventListener);
      if (cleanupRef.current) window.clearTimeout(cleanupRef.current);
    };
  }, []);

  useEffect(() => {
    if (!warp.active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles: Particle[] = Array.from({ length: 170 }, (_, index) => ({
      // The first particles remember the click, then spread into a full-height seam.
      y: index < 45
        ? warp.y + (Math.random() - 0.5) * Math.min(260, height * 0.35)
        : Math.random() * height,
      offset: (Math.random() - 0.72) * 86,
      drift: (Math.random() - 0.5) * 18,
      size: Math.random() * 2.2 + 0.7,
      length: Math.random() * 13 + 3,
      phase: Math.random() * Math.PI * 2,
      kind: (["dot", "fragment", "spark", "turbulence"] as ParticleKind[])[index % 4],
    }));

    const start = performance.now();
    const sign = warp.sweepDirection === "left-to-right" ? 1 : -1;
    const future = warp.direction === "to-future";

    const draw = (now: number) => {
      const progress = Math.min((now - start) / TEMPORAL_TRANSITION_DURATION, 1);
      // directionProgress always grows from the launching edge to the destination edge.
      const directionalProgress = 1 - Math.pow(1 - progress, 3);
      const boundary = sign > 0
        ? directionalProgress * width
        : width - directionalProgress * width;
      const assembly = Math.max(0, (progress - 0.78) / 0.22);
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const wake = Math.max(0, -sign * particle.offset);
        const density = Math.exp(-wake / 18); // sharply reduce debris behind the seam
        let x = boundary + sign * particle.offset;
        let y = particle.y + Math.sin(now / 70 + particle.phase) * particle.drift;

        if (assembly > 0) {
          const edgeX = index % 2 ? 8 : width - 8;
          const edgeY = index % 4 < 2 ? 8 : height - 8;
          x += (edgeX - x) * assembly;
          y += (edgeY - y) * assembly;
        }

        const fade = Math.min(1, progress * 9) * (1 - Math.pow(assembly, 2));
        context.globalAlpha = fade * (0.2 + density * 0.8);
        context.strokeStyle = future ? "#61f5ff" : "#d5a65f";
        context.fillStyle = index % 5 === 0 ? "#fff" : future ? "#9aabb8" : "#9d856c";
        context.lineWidth = particle.size;

        if (particle.kind === "dot") {
          context.beginPath();
          context.arc(x, y, particle.size, 0, Math.PI * 2);
          context.fill();
        } else if (particle.kind === "turbulence") {
          context.beginPath();
          context.arc(x, y, particle.length, particle.phase, particle.phase + 1.4);
          context.stroke();
        } else {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + sign * particle.length, y + (particle.kind === "spark" ? particle.drift : 0));
          context.stroke();
        }
      });

      context.globalAlpha = (1 - assembly) * 0.8;
      context.fillStyle = future ? "#b9fbff" : "#ffe1aa";
      context.shadowBlur = 18;
      context.shadowColor = future ? "#00f0ff" : "#d5a65f";
      context.fillRect(boundary - 0.75, 0, 1.5, height);
      context.shadowBlur = 0;

      if (progress < 1) frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [warp]);

  if (!warp.active) return null;

  const fromLeft = warp.sweepDirection === "left-to-right";
  return (
    <div className={`temporal-overlay ${warp.direction} ${fromLeft ? "from-left" : "from-right"}`} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="temporal-boundary temporal-scanlines" />
      <div className="temporal-boundary temporal-circuitry" />
      <div className="temporal-boundary temporal-pulses" />
      <div className="temporal-boundary temporal-distortion" />
    </div>
  );
}
