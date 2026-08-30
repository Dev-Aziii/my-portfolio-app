export type EraDirection = "to-future" | "to-past";
export type SweepEdge = "left" | "right";
export type TransitionPhase = "charge" | "sweep" | "settle";
export type MotionMode = "cinematic" | "reduced";

export interface TransitionTiming {
  charge: number;
  sweep: number;
  settle: number;
  total: number;
}

export interface EraTransitionDetail {
  id: number;
  direction: EraDirection;
  edge: SweepEdge;
  origin: { x: number; y: number };
  maxRadius: number;
  duration: number;
  startedAt: number;
}

export interface RevealKeyframe {
  offset: number;
  clipPath: string;
}

export interface EnergyRingKeyframe {
  offset: number;
  transform: string;
  opacity: number;
}

export const ERA_TRANSITION_START = "era-transition-start";
export const ERA_TRANSITION_COMPLETE = "era-transition-complete";

export const FUTURE_TIMING: TransitionTiming = {
  charge: 50,
  sweep: 760,
  settle: 90,
  total: 900,
};

export const PAST_TIMING: TransitionTiming = {
  charge: 60,
  sweep: 750,
  settle: 90,
  total: 900,
};

export const REDUCED_MOTION_DURATION = 180;

export function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, progress));
}

export function resolveSweepEdge(originX: number, viewportWidth: number): SweepEdge {
  return originX >= viewportWidth / 2 ? "right" : "left";
}

export function resolveMotionMode(prefersReducedMotion: boolean): MotionMode {
  return prefersReducedMotion ? "reduced" : "cinematic";
}

export function getTransitionTiming(direction: EraDirection): TransitionTiming {
  return direction === "to-future" ? FUTURE_TIMING : PAST_TIMING;
}

/**
 * Calculates the exact distance in pixels from the interaction origin
 * to the furthest viewport corner, plus safety overscan.
 */
export function calculateMaxRadius(
  originX: number,
  originY: number,
  viewportWidth: number,
  viewportHeight: number,
  overscan = 24,
): number {
  const safeW = Math.max(viewportWidth, 1);
  const safeH = Math.max(viewportHeight, 1);
  const maxDx = Math.max(originX, safeW - originX);
  const maxDy = Math.max(originY, safeH - originY);
  return Math.ceil(Math.hypot(maxDx, maxDy) + Math.max(0, overscan));
}

/**
 * Generates an SVG/CSS circle clip-path definition string.
 */
export function getRadialClipPath(
  radiusPx: number,
  originX: number,
  originY: number,
): string {
  const safeRadius = Math.max(0, Math.round(radiusPx * 10) / 10);
  const x = Math.round(originX * 10) / 10;
  const y = Math.round(originY * 10) / 10;
  return `circle(${safeRadius}px at ${x}px ${y}px)`;
}

/**
 * Generates a right-edge-to-left reveal clip path for the paper-fold transition.
 */
export function getSideSwipeClipPath(progress: number): string {
  const safeProgress = Math.round(clampProgress(progress) * 1000) / 10;
  const leftInset = Math.round((100 - safeProgress) * 10) / 10;
  return `inset(0% 0% 0% ${leftInset}%)`;
}

/**
 * Atmospheric smoothstep easing curve for monotonic radial expansion.
 */
export function radialEase(progress: number): number {
  const value = clampProgress(progress);
  return value * value * (3 - 2 * value);
}

/**
 * Builds keyframes for the View Transitions API reveal.
 */
export function buildRadialSnapshotKeyframes(
  originX: number,
  originY: number,
  maxRadius: number,
  steps = 24,
): { incoming: RevealKeyframe[]; outgoing: RevealKeyframe[] } {
  const frameCount = Math.max(2, Math.round(steps));
  const offsets = Array.from(
    { length: frameCount + 1 },
    (_, index) => index / frameCount,
  );

  return {
    incoming: offsets.map((offset) => {
      const radius = maxRadius * offset;
      return {
        offset,
        clipPath: getRadialClipPath(radius, originX, originY),
      };
    }),
    outgoing: offsets.map((offset) => ({
      offset,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    })),
  };
}

/**
 * Builds keyframes for the dynamic glowing energy ring overlay.
 */
export function buildEnergyRingKeyframes(
  motionMode: MotionMode = "cinematic",
  steps = 24,
): EnergyRingKeyframe[] {
  if (motionMode === "reduced") return [];

  const frameCount = Math.max(2, Math.round(steps));
  return Array.from({ length: frameCount + 1 }, (_, index) => {
    const offset = index / frameCount;
    // Scale starts at 0 and expands to 1 (which matches 2 * maxRadius)
    // Opacity starts high, stays luminous through the sweep, and disperses seamlessly at the perimeter
    const opacity =
      offset === 0
        ? 0.95
        : offset > 0.75
        ? (1 - (offset - 0.75) / 0.25) * 0.9
        : 0.95 - offset * 0.1;

    return {
      offset,
      transform: `translate(-50%, -50%) scale(${Math.round(offset * 1000) / 1000})`,
      opacity: Math.max(0, Math.round(opacity * 1000) / 1000),
    };
  });
}
