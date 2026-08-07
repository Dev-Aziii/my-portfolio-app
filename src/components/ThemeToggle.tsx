import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      html.classList.add("dark");
      setIsDark(true);
    } else {
      html.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.theme = "dark";
      setIsDark(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase tracking-wider border border-border bg-card text-foreground hover:border-foreground transition-colors cursor-pointer"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Edition" : "Switch to Dark Edition"}
    >
      {isDark ? (
        <>
          <Sun className="size-3.5" />
          <span className="hidden sm:inline">LIGHT</span>
        </>
      ) : (
        <>
          <Moon className="size-3.5" />
          <span className="hidden sm:inline">DARK</span>
        </>
      )}
    </button>
  );
}