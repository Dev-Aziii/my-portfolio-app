import { useEffect, useRef, useState } from "react";
import {
  ERA_TRANSITION_COMPLETE,
  ERA_TRANSITION_START,
  type EraTransitionDetail,
} from "@/lib/themeTransition";

interface ActiveRingState {
  id: number;
  direction: "to-future" | "to-past";
  origin: { x: number; y: number };
  maxRadius: number;
  duration: number;
}

export default function EraMaterialTransition() {
  const [activeRing, setActiveRing] = useState<ActiveRingState | null>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<EraTransitionDetail>;
      const detail = customEvent.detail;
      if (!detail) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      setActiveRing({
        id: detail.id,
        direction: detail.direction,
        origin: detail.origin,
        maxRadius: detail.maxRadius,
        duration: detail.duration,
      });
    };

    const handleComplete = () => {
      if (animationRef.current) {
        try {
          animationRef.current.cancel();
        } catch {
          // Ignore cancel if already discarded
        }
        animationRef.current = null;
      }
      setActiveRing(null);
    };

    window.addEventListener(ERA_TRANSITION_START, handleStart);
    window.addEventListener(ERA_TRANSITION_COMPLETE, handleComplete);

    return () => {
      window.removeEventListener(ERA_TRANSITION_START, handleStart);
      window.removeEventListener(ERA_TRANSITION_COMPLETE, handleComplete);
      if (animationRef.current) {
        try {
          animationRef.current.cancel();
        } catch {
          // Ignore cleanup
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!activeRing || !ringRef.current) return;

    const el = ringRef.current;
    if (animationRef.current) {
      try {
        animationRef.current.cancel();
      } catch {
        // Safe discard
      }
    }

    const animation = el.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(0)",
          opacity: 0.95,
        },
        {
          transform: "translate(-50%, -50%) scale(0.65)",
          opacity: 0.85,
          offset: 0.65,
        },
        {
          transform: "translate(-50%, -50%) scale(1.02)",
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: activeRing.duration,
        easing: "cubic-bezier(0.25, 1, 0.35, 1)",
        fill: "forwards",
      },
    );

    animationRef.current = animation;
    animation.onfinish = () => {
      setActiveRing(null);
      animationRef.current = null;
    };
  }, [activeRing]);

  if (!activeRing) {
    return <div className="era-material-transition" aria-hidden="true" />;
  }

  const isFuture = activeRing.direction === "to-future";
  const diameter = activeRing.maxRadius * 2;

  return (
    <div className="era-material-transition" aria-hidden="true">
      <div
        ref={ringRef}
        className={`era-energy-ring ${
          isFuture ? "era-energy-ring--future" : "era-energy-ring--past"
        }`}
        style={{
          left: `${activeRing.origin.x}px`,
          top: `${activeRing.origin.y}px`,
          width: `${diameter}px`,
          height: `${diameter}px`,
        }}
      />
    </div>
  );
}
