import { describe, expect, it } from "vitest";
import { getPanelBounds, getPanelHeight, resizePanel, resizePanelWithKey } from "./panel";

describe("sliding panel geometry", () => {
  it("uses responsive defaults and leaves room below the header", () => {
    expect(getPanelBounds(1440, 1000, 90)).toEqual({ min: 160, max: 894, initial: 300 });
    expect(getPanelBounds(390, 844, 130)).toEqual({ min: 140, max: 698, initial: 253.2 });
    expect(getPanelBounds(1440, 1800, 90).initial).toBe(360);
    expect(getPanelBounds(390, 1200, 130).initial).toBe(280);
  });
  it("caps an expanded panel temporarily without losing preferred height", () => {
    const preferred = 600;
    const keyboard = getPanelBounds(390, 240, 130);
    expect(getPanelHeight(preferred, keyboard)).toBe(94);
    expect(keyboard.min).toBe(keyboard.max);
    expect(getPanelHeight(preferred, getPanelBounds(390, 844, 130))).toBe(600);
    expect(getPanelHeight(null, getPanelBounds(1440, 1000, 90))).toBe(300);
  });
  it("expands by upward drag and clamps at both ends", () => {
    const bounds = getPanelBounds(1440, 1000, 90);
    expect(resizePanel(300, 700, 600, bounds)).toBe(400);
    expect(resizePanel(300, 700, 2000, bounds)).toBe(160);
    expect(resizePanel(300, 700, -1000, bounds)).toBe(894);
  });
  it("supports keyboard steps and endpoints", () => {
    const bounds = getPanelBounds(1440, 1000, 90);
    expect(resizePanelWithKey(300, "ArrowUp", false, bounds)).toBe(324);
    expect(resizePanelWithKey(300, "ArrowDown", true, bounds)).toBe(236);
    expect(resizePanelWithKey(300, "Home", false, bounds)).toBe(160);
    expect(resizePanelWithKey(300, "End", false, bounds)).toBe(894);
    expect(resizePanelWithKey(300, "a", false, bounds)).toBeNull();
  });
});
