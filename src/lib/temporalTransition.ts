export const TEMPORAL_TRANSITION_TIMING = Object.freeze({
  totalDuration: 1100,
  themeSwapPoint: 120,
  settlePoint: 860,
  safetyMargin: 120,
});

/** @deprecated Prefer TEMPORAL_TRANSITION_TIMING.totalDuration. */
export const TEMPORAL_TRANSITION_DURATION = TEMPORAL_TRANSITION_TIMING.totalDuration;

export type TemporalDirection = "to-future" | "to-past";
export type SweepDirection = "left-to-right" | "right-to-left";

export interface TemporalWarpDetail {
  direction: TemporalDirection;
  sweepDirection: SweepDirection;
  x: number;
  y: number;
  duration: number;
}
