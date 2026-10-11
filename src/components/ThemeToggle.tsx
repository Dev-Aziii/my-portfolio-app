import { Monitor, Moon, Sun } from "lucide-react";
import { usePortfolioPreferences } from "./PortfolioPreferences";
import type { Theme } from "@/lib/theme";

const THEME_OPTIONS = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const satisfies ReadonlyArray<{ value: Theme; label: string; Icon: typeof Monitor }>;

export default function ThemeToggle() {
  const { theme, setTheme } = usePortfolioPreferences();

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
            onClick={() => setTheme(value)}
          >
            <Icon aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </span>
    </div>
  );
}
