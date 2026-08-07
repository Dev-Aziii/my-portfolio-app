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

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains("dark");

    const updateDOM = () => {
      if (isCurrentlyDark) {
        html.classList.remove("dark");
        localStorage.theme = "light";
        setIsDark(false);
      } else {
        html.classList.add("dark");
        localStorage.theme = "dark";
        setIsDark(true);
      }
    };

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fallback to instant update for unsupported browsers or reduced motion preference
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      isReducedMotion
    ) {
      updateDOM();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
      updateDOM();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex size-8 sm:size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-foreground transition-colors cursor-pointer"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Edition" : "Switch to Dark Edition"}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-full border border-foreground/40 animate-theme-pulse motion-reduce:animate-none"
      />
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}