import { useEffect, useState } from "react";
import {
  ERA_TRANSITION_COMPLETE,
  ERA_TRANSITION_START,
  type EraTransitionDetail,
} from "@/lib/themeTransition";

interface ActiveTransition {
  direction: EraTransitionDetail["direction"];
  duration: number;
}

export default function EraMaterialTransition() {
  const [activeTransition, setActiveTransition] = useState<ActiveTransition | null>(null);

  useEffect(() => {
    const handleStart = (event: Event) => {
      const detail = (event as CustomEvent<EraTransitionDetail>).detail;
      if (!detail || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      setActiveTransition({
        direction: detail.direction,
        duration: detail.duration,
      });
    };

    const handleComplete = () => setActiveTransition(null);

    window.addEventListener(ERA_TRANSITION_START, handleStart);
    window.addEventListener(ERA_TRANSITION_COMPLETE, handleComplete);

    return () => {
      window.removeEventListener(ERA_TRANSITION_START, handleStart);
      window.removeEventListener(ERA_TRANSITION_COMPLETE, handleComplete);
    };
  }, []);

  if (!activeTransition) {
    return <div className="era-material-transition" aria-hidden="true" />;
  }

  const isFuture = activeTransition.direction === "to-future";

  return (
    <div
      className={`era-material-transition era-material-transition--${isFuture ? "future" : "past"}`}
      data-direction={activeTransition.direction}
      data-sweep="left"
      style={{ "--era-transition-duration": `${activeTransition.duration}ms` } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="era-paper-fold" />
      <div className="era-fold-edge" />
    </div>
  );
}
