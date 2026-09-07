import { describe, expect, it } from "vitest";
import { getDashboardStats } from "./dashboard";

describe("getDashboardStats", () => {
  it("derives portfolio metrics from the supplied content collections", () => {
    const stats = getDashboardStats({
      projects: [{}, {}, {}] as never[],
      certifications: [{}, {}] as never[],
      experiences: [
        { kind: "education" },
        { kind: "learning" },
        { kind: "education" },
      ] as never[],
      contributions: 983,
    });

    expect(stats).toEqual({
      projects: 3,
      certifications: 2,
      contributions: 983,
      education: 2,
    });
  });

  it("does not count non-education timeline entries as degrees", () => {
    const stats = getDashboardStats({
      projects: [],
      certifications: [],
      experiences: [{ kind: "experience" }, { kind: "learning" }] as never[],
      contributions: 0,
    });

    expect(stats.education).toBe(0);
  });
});
