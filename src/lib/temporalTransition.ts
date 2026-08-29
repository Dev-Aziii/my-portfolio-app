export const TEMPORAL_TRANSITION_DURATION = 1100;

export type TemporalDirection = "to-future" | "to-past";
export type SweepDirection = "left-to-right" | "right-to-left";

export interface TemporalWarpDetail {
  direction: TemporalDirection;
  sweepDirection: SweepDirection;
  x: number;
  y: number;
  duration: typeof TEMPORAL_TRANSITION_DURATION;
}
