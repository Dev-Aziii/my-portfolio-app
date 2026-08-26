import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;

    // Sync state with DOM
    const syncState = () => {
      setIsDark(html.classList.contains("dark"));
    };

    // Initial check
    syncState();

    // Listen for custom theme change events dispatched by other ThemeToggle instances
    const handleThemeChange = () => syncState();
    window.addEventListener("theme-change", handleThemeChange);

    // Also observe class mutations on html element
    const observer = new MutationObserver(() => syncState());
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      observer.disconnect();
    };
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
      // Broadcast to all other ThemeToggle instances
      window.dispatchEvent(new CustomEvent("theme-change"));
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
      className="relative inline-flex size-8 sm:size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-foreground dark:border-cyan-400/70 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:border-cyan-300 dark:hover:bg-cyan-900/50 dark:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
      aria-label="Toggle theme"
      title={isDark ? "Switch to Vintage Light Edition" : "Switch to Cyber Dark Edition"}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-full border border-foreground/30 dark:border-cyan-400/40 animate-theme-pulse motion-reduce:animate-none"
      />
      {/* Sun Icon: strictly visible only when .dark is on html element */}
      <Sun className="hidden dark:block size-4 text-cyan-300 drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]" />
      {/* Moon Icon: strictly visible only in light mode */}
      <Moon className="block dark:hidden size-4 text-foreground" />
    </button>
  );
}