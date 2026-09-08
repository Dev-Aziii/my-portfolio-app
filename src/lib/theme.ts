export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = Exclude<Theme, "system">;

export const THEME_STORAGE_KEY = "theme";
export const THEME_CHANGE_EVENT = "theme-change";

interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface ThemeRoot {
  documentElement: {
    classList: {
      contains(name: string): boolean;
      toggle(name: string, force?: boolean): boolean;
    };
  };
}

export function parseThemePreference(value: string | null | undefined): Theme | null {
  return value === "system" || value === "light" || value === "dark" ? value : null;
}

export function readStoredTheme(storage: ThemeStorage | null | undefined): Theme | null {
  try {
    return parseThemePreference(storage?.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeStoredTheme(
  storage: ThemeStorage | null | undefined,
  theme: Theme,
): boolean {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
    return Boolean(storage);
  } catch {
    return false;
  }
}

export function resolveInitialTheme(
  storedTheme: Theme | null,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return systemPrefersDark ? "dark" : "light";
}

export function getTheme(root: ThemeRoot): ResolvedTheme {
  return root.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(root: ThemeRoot, theme: ResolvedTheme): void {
  root.documentElement.classList.toggle("dark", theme === "dark");
}
