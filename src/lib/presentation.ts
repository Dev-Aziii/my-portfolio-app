export type PresentationMode = "dashboard" | "terminal";
export const PRESENTATION_STORAGE_KEY = "presentation-mode";

interface ReadStorage { getItem(key: string): string | null }
interface WriteStorage { setItem(key: string, value: string): void }

export function readBrowserStorage(): Storage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
}

export function readPresentation(storage: ReadStorage | null): PresentationMode {
  try { return storage?.getItem(PRESENTATION_STORAGE_KEY) === "terminal" ? "terminal" : "dashboard"; }
  catch { return "dashboard"; }
}

export function writePresentation(storage: WriteStorage | null, mode: PresentationMode): boolean {
  try { storage?.setItem(PRESENTATION_STORAGE_KEY, mode); return Boolean(storage); }
  catch { return false; }
}
