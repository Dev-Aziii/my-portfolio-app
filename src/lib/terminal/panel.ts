export interface PanelBounds { min: number; max: number; initial: number }
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export function getPanelBounds(width: number, height: number, headerHeight: number): PanelBounds {
  const mobile = width <= 700;
  const max = Math.min(height, Math.max(0, height - headerHeight - 16));
  const min = Math.min(max, mobile ? 140 : 160);
  const initial = clamp(clamp(height * .3, mobile ? 180 : 200, mobile ? 280 : 360), min, max);
  return { min, max, initial };
}
export function getPanelHeight(preferred: number | null, bounds: PanelBounds): number {
  return clamp(preferred ?? bounds.initial, bounds.min, bounds.max);
}
export function resizePanel(height: number, startY: number, currentY: number, bounds: PanelBounds): number {
  return clamp(height + startY - currentY, bounds.min, bounds.max);
}
export function resizePanelWithKey(height: number, key: string, shift: boolean, bounds: PanelBounds): number | null {
  const step = shift ? 64 : 24;
  if (key === "Home") return bounds.min;
  if (key === "End") return bounds.max;
  if (key === "ArrowUp") return clamp(height + step, bounds.min, bounds.max);
  if (key === "ArrowDown") return clamp(height - step, bounds.min, bounds.max);
  return null;
}
