import { describe, expect, it } from "vitest";
import { readPresentation, writePresentation } from "./presentation";

describe("presentation preference", () => {
  it("defaults to dashboard for invalid or absent preferences", () => {
    for (const value of [null, "light", "invalid", "dashboard"]) {
      expect(readPresentation({ getItem: () => value })).toBe("dashboard");
    }
    expect(readPresentation({ getItem: () => "terminal" })).toBe("terminal");
  });
  it("survives blocked reads and writes", () => {
    const storage = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    expect(readPresentation(storage)).toBe("dashboard");
    expect(writePresentation(storage, "terminal")).toBe(false);
    expect(writePresentation(null, "terminal")).toBe(false);
  });
  it("persists independently from theme", () => {
    const entries = new Map([["theme", "light"]]);
    const storage = { getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => entries.set(key, value) };
    expect(writePresentation(storage, "terminal")).toBe(true);
    expect(entries.get("presentation-mode")).toBe("terminal");
    expect(entries.get("theme")).toBe("light");
  });
});
