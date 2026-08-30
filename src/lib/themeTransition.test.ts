import { describe, expect, it } from "vitest";
import {
  FUTURE_TIMING,
  PAST_TIMING,
  REDUCED_MOTION_DURATION,
  buildEnergyRingKeyframes,
  buildRadialSnapshotKeyframes,
  calculateMaxRadius,
  clampProgress,
  getRadialClipPath,
  radialEase,
  resolveMotionMode,
  resolveSweepEdge,
} from "./themeTransition";

describe("theme transition radial geometry", () => {
  it("computes radial ease value cleanly", () => {
    expect(radialEase(0.5)).toBeCloseTo(0.5, 6);
    expect(radialEase(0)).toBe(0);
    expect(radialEase(1)).toBe(1);
  });

  it("calculates max radius reaching the furthest viewport corner with overscan", () => {
    // Origin at top-right (x=1000, y=50) in 1000x800 viewport
    // Furthest corner is bottom-left (0, 800) -> dx = 1000, dy = 750
    // hypot(1000, 750) = 1250, + 24 overscan = 1274
    const radiusTopRight = calculateMaxRadius(1000, 50, 1000, 800, 24);
    expect(radiusTopRight).toBe(1274);

    // Center click in 1920x1080
    // dx = 960, dy = 540 -> hypot = 1101.45, + 24 = 1126
    const radiusCenter = calculateMaxRadius(960, 540, 1920, 1080, 24);
    expect(radiusCenter).toBe(1126);
  });

  it("generates formatted CSS circle clip-path strings", () => {
    expect(getRadialClipPath(0, 120, 80)).toBe("circle(0px at 120px 80px)");
    expect(getRadialClipPath(540.2, 900.5, 450.2)).toBe(
      "circle(540.2px at 900.5px 450.2px)",
    );
  });

  it("builds monotonic radial snapshot keyframes", () => {
    const snapshots = buildRadialSnapshotKeyframes(500, 300, 1000, 8);

    expect(snapshots.incoming).toHaveLength(9);
    expect(snapshots.incoming[0]).toEqual({
      offset: 0,
      clipPath: "circle(0px at 500px 300px)",
    });
    expect(snapshots.incoming.at(-1)).toEqual({
      offset: 1,
      clipPath: "circle(1000px at 500px 300px)",
    });

    for (let i = 1; i < snapshots.incoming.length; i++) {
      expect(snapshots.incoming[i].offset).toBeGreaterThan(
        snapshots.incoming[i - 1].offset,
      );
    }
  });

  it("builds synchronized energy ring keyframes with fade dispersion", () => {
    const frames = buildEnergyRingKeyframes("cinematic", 8);
    expect(frames).toHaveLength(9);
    expect(frames[0].transform).toContain("scale(0)");
    expect(frames.at(-1)?.transform).toContain("scale(1)");
    // Dispenses/fades out at the end
    expect(frames.at(-1)?.opacity).toBe(0);

    const reduced = buildEnergyRingKeyframes("reduced", 8);
    expect(reduced).toEqual([]);
  });

  it("resolves sweep edge and motion mode correctly", () => {
    expect(resolveSweepEdge(900, 1200)).toBe("right");
    expect(resolveSweepEdge(100, 1200)).toBe("left");
    expect(resolveMotionMode(true)).toBe("reduced");
    expect(resolveMotionMode(false)).toBe("cinematic");
  });

  it("clamps progress to the animation range", () => {
    expect(clampProgress(-0.2)).toBe(0);
    expect(clampProgress(0.42)).toBe(0.42);
    expect(clampProgress(1.4)).toBe(1);
  });
});

describe("theme transition timing", () => {
  it("keeps both directions within atmospheric duration range (~650ms - 750ms)", () => {
    expect(FUTURE_TIMING.total).toBeGreaterThanOrEqual(650);
    expect(FUTURE_TIMING.total).toBeLessThanOrEqual(780);
    expect(PAST_TIMING.total).toBeGreaterThanOrEqual(650);
    expect(PAST_TIMING.total).toBeLessThanOrEqual(780);
  });

  it("gives the past a distinct timeline and charge hold", () => {
    expect(PAST_TIMING.charge).toBeGreaterThan(0);
    expect(PAST_TIMING.total).toBeGreaterThan(FUTURE_TIMING.total);
  });

  it("keeps reduced motion snappy", () => {
    expect(REDUCED_MOTION_DURATION).toBeGreaterThanOrEqual(100);
    expect(REDUCED_MOTION_DURATION).toBeLessThanOrEqual(200);
  });
});
