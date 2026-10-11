import { describe, expect, it } from "vitest";
import { getPortraitGeometry, terminalPortraitFraming } from "./portrait";

describe("portrait framing", () => {
  it("keeps dashboard's full image framing by default", () => {
    expect(getPortraitGeometry()).toEqual({ crop: { x: 0, y: 0, width: 806, height: 1080 }, draw: { x: 0, y: 0, width: 806, height: 1080 }, image: { x: 0, y: 0, width: 806, height: 1080 } });
  });
  it("maps the same proportional crop to canvas and static image", () => {
    const { crop, draw, image } = getPortraitGeometry(terminalPortraitFraming);
    expect(crop).toEqual({ x: 123, y: 211, width: 609, height: 869 });
    expect(draw.width / draw.height).toBeCloseTo(crop.width / crop.height);
    const scale = image.width / 806;
    expect(image.x + crop.x * scale).toBeCloseTo(draw.x);
    expect(image.y + crop.y * scale).toBeCloseTo(draw.y);
    expect(crop.height * scale).toBeCloseTo(draw.height);
    expect(draw.y / 1080).toBeCloseTo(0.045);
    expect(draw.x).toBeGreaterThan(0);
  });
});
