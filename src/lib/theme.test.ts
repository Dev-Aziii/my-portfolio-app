import { describe, expect, it } from "vitest";
import {
  applyTheme,
  parseThemePreference,
  readStoredTheme,
  resolveInitialTheme,
  writeStoredTheme,
} from "./theme";

function createRoot() {
  const classes = new Set<string>();
  return {
    classList: {
      contains: (name: string) => classes.has(name),
      toggle: (name: string, force?: boolean) => {
        if (force === undefined ? !classes.has(name) : force) classes.add(name);
        else classes.delete(name);
        return classes.has(name);
      },
    },
  };
}

describe("theme preference", () => {
  it("accepts only supported persisted theme values", () => {
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("system")).toBe("system");
    expect(parseThemePreference(null)).toBeNull();
  });

  it("uses the stored theme before the system preference", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
    expect(resolveInitialTheme("system", true)).toBe("dark");
    expect(resolveInitialTheme("system", false)).toBe("light");
  });

  it("falls back to the system preference when no theme is stored", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
  });

  it("applies the dark class only for dark mode", () => {
    const root = createRoot();

    applyTheme({ documentElement: root }, "dark");
    expect(root.classList.contains("dark")).toBe(true);

    applyTheme({ documentElement: root }, "light");
    expect(root.classList.contains("dark")).toBe(false);
  });

  it("reads and writes preferences without throwing when storage is unavailable", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    expect(readStoredTheme(storage)).toBeNull();
    expect(writeStoredTheme(storage, "dark")).toBe(true);
    expect(readStoredTheme(storage)).toBe("dark");
    expect(writeStoredTheme(storage, "system")).toBe(true);
    expect(readStoredTheme(storage)).toBe("system");

    const deniedStorage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };

    expect(readStoredTheme(deniedStorage)).toBeNull();
    expect(writeStoredTheme(deniedStorage, "light")).toBe(false);
  });
});
