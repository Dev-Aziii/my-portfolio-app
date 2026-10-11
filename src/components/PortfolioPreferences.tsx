import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { applyTheme, parseThemePreference, readStoredTheme, resolveInitialTheme, THEME_CHANGE_EVENT, THEME_STORAGE_KEY, writeStoredTheme, type ResolvedTheme, type Theme } from "@/lib/theme";
import { PRESENTATION_STORAGE_KEY, readBrowserStorage, readPresentation, writePresentation, type PresentationMode } from "@/lib/presentation";

interface Preferences {
  mode: PresentationMode;
  setMode(mode: PresentationMode): void;
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme(theme: Theme): void;
}
const PreferencesContext = createContext<Preferences | null>(null);

export function PortfolioPreferences({ children }: { children: ReactNode }) {
  const [mode, updateMode] = useState(() => readPresentation(readBrowserStorage()));
  const [theme, updateTheme] = useState<Theme>(() => readStoredTheme(readBrowserStorage()) ?? "system");
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const themeRef = useRef(theme);
  const timerRef = useRef<number | null>(null);
  const focusModeControl = useRef(false);
  const resolvedTheme = resolveInitialTheme(theme, systemDark);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const systemChanged = () => {
      setSystemDark(query.matches);
      applyTheme(document, resolveInitialTheme(themeRef.current, query.matches));
    };
    const receiveTheme = (event: Event) => {
      const next = event instanceof CustomEvent ? parseThemePreference(event.detail) : null;
      if (!next) return;
      themeRef.current = next;
      updateTheme(next);
      applyTheme(document, resolveInitialTheme(next, query.matches));
    };
    const receiveStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        const next = readStoredTheme(readBrowserStorage()) ?? "system";
        themeRef.current = next;
        updateTheme(next);
        applyTheme(document, resolveInitialTheme(next, query.matches));
      }
      if (event.key === PRESENTATION_STORAGE_KEY || event.key === null) {
        const next = readPresentation(readBrowserStorage());
        document.documentElement.dataset.presentation = next;
        updateMode(next);
      }
    };
    applyTheme(document, resolveInitialTheme(themeRef.current, query.matches));
    document.documentElement.dataset.presentation = readPresentation(readBrowserStorage());
    query.addEventListener("change", systemChanged);
    window.addEventListener(THEME_CHANGE_EVENT, receiveTheme);
    window.addEventListener("storage", receiveStorage);
    return () => {
      query.removeEventListener("change", systemChanged);
      window.removeEventListener(THEME_CHANGE_EVENT, receiveTheme);
      window.removeEventListener("storage", receiveStorage);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      delete document.documentElement.dataset.themeTransition;
    };
  }, []);

  useEffect(() => {
    if (!focusModeControl.current) return;
    focusModeControl.current = false;
    const frame = requestAnimationFrame(() => {
      const selector = mode === "terminal" ? "[data-dashboard-return]" : ".presentation-toggle";
      const control = Array.from(document.querySelectorAll<HTMLButtonElement>(selector)).find((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && bounds.right > 0 && bounds.left < window.innerWidth;
      });
      control?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [mode]);

  const setMode = (next: PresentationMode) => {
    focusModeControl.current = next !== mode;
    document.documentElement.dataset.presentation = next;
    writePresentation(readBrowserStorage(), next);
    updateMode(next);
  };
  const setTheme = (next: Theme) => {
    const commit = () => {
      themeRef.current = next;
      updateTheme(next);
      applyTheme(document, resolveInitialTheme(next, window.matchMedia("(prefers-color-scheme: dark)").matches));
      writeStoredTheme(readBrowserStorage(), next);
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && document.startViewTransition) { document.startViewTransition(commit); return; }
    if (!reduced) document.documentElement.dataset.themeTransition = "true";
    commit();
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (!reduced) timerRef.current = window.setTimeout(() => { delete document.documentElement.dataset.themeTransition; timerRef.current = null; }, 220);
  };
  return <PreferencesContext.Provider value={{ mode, setMode, theme, resolvedTheme, setTheme }}>{children}</PreferencesContext.Provider>;
}

export function usePortfolioPreferences(): Preferences {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("Portfolio preferences must be used inside their provider.");
  return value;
}
