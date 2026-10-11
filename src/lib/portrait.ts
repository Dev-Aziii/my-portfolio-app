export interface SourceRect { x: number; y: number; width: number; height: number }
export interface PortraitFraming { crop: SourceRect; inset: number }
export const terminalPortraitFraming: PortraitFraming = { crop: { x: 123, y: 211, width: 609, height: 869 }, inset: 0.045 };
export function getPortraitGeometry(framing?: PortraitFraming) {
  const crop = framing?.crop ?? { x: 0, y: 0, width: 806, height: 1080 };
  const inset = framing?.inset ?? 0;
  const scale = Math.min(806 * (1 - 2 * inset) / crop.width, 1080 * (1 - 2 * inset) / crop.height);
  const draw = { x: (806 - crop.width * scale) / 2, y: (1080 - crop.height * scale) / 2, width: crop.width * scale, height: crop.height * scale };
  const image = { x: draw.x - crop.x * scale, y: draw.y - crop.y * scale, width: 806 * scale, height: 1080 * scale };
  return { crop, draw, image };
}
