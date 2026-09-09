import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  applyTheme,
  THEME_CHANGE_EVENT,
  parseThemePreference,
  readStoredTheme,
  resolveInitialTheme,
  writeStoredTheme,
  type Theme,
} from "@/lib/theme";

const THEME_TRANSITION_DURATION = 220;
const THEME_OPTIONS = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const satisfies ReadonlyArray<{ value: Theme; label: string; Icon: typeof Monitor }>;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? "system" : readStoredTheme(readStorage()) ?? "system",
  );
  const cleanupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const preference = readStoredTheme(readStorage()) ?? "system";
      setTheme(preference);
      applyTheme(document, resolveInitialTheme(preference, systemPreference.matches));
    };
    const syncFromEvent = (event: Event) => {
      const detail = event instanceof CustomEvent ? parseThemePreference(event.detail) : null;
      setTheme(detail ?? readStoredTheme(readStorage()) ?? "system");
    };

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncFromEvent);
    systemPreference.addEventListener("change", syncTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncFromEvent);
      systemPreference.removeEventListener("change", syncTheme);
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  const handleSelect = (nextTheme: Theme) => {
    const html = document.documentElement;
    if (html.dataset.themeTransition === "true") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      html.dataset.themeTransition = "true";
    }

    applyTheme(document, resolveInitialTheme(nextTheme, window.matchMedia("(prefers-color-scheme: dark)").matches));
    writeStoredTheme(readStorage(), nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: nextTheme }));

    if (reducedMotion) return;

    cleanupTimerRef.current = window.setTimeout(() => {
      delete html.dataset.themeTransition;
      cleanupTimerRef.current = null;
    }, THEME_TRANSITION_DURATION);
  };

  return (
    <div
      className="theme-toggle"
      data-theme-toggle
      data-theme={theme}
      role="radiogroup"
      aria-label="Theme preference"
    >
      <span className="theme-toggle__track">
        {THEME_OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            className="theme-toggle__option"
            data-theme-option={value}
            role="radio"
            aria-checked={theme === value}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => handleSelect(value)}
          >
            <Icon aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </span>
    </div>
  );
}

function readStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
