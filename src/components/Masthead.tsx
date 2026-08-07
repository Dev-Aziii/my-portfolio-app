import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface MastheadProps {
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export default function Masthead({ onNavigateSection }: MastheadProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  /* ── refs that guard against transition oscillation ──────────── */
  const committedRef = useRef(false); // the "settled" scroll state
  const lockRef = useRef(false); // blocks threshold checks during CSS transition
  const rafRef = useRef(0);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    /*
     * Disable scroll anchoring on the document element.
     *
     * Root cause of the oscillation bug:
     *   1. User scrolls past 150 px → header collapses (isScrolled = true)
     *   2. Sticky header height shrinks ~150-180 px → content shifts up in
     *      the document flow
     *   3. Browser scroll anchoring adjusts scrollY downward to compensate
     *      → scrollY drops below the 50 px return-threshold
     *   4. Header re-expands → scroll anchoring adjusts scrollY back up
     *      → crosses the 150 px threshold again → infinite loop
     *
     * Setting overflow-anchor: none prevents the browser from adjusting
     * scrollY when the header height changes. scrollY stays constant
     * during the collapse/expand transition, so the hysteresis thresholds
     * work deterministically.
     */
    const htmlEl = document.documentElement;
    const prevOverflowAnchor = htmlEl.style.overflowAnchor;
    htmlEl.style.overflowAnchor = "none";

    /* Detect reduced-motion preference (read live via closure) */
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* CSS transition is 300 ms; lock for 350 ms (+ 50 ms safety buffer).
     * When prefers-reduced-motion is active the CSS duration is 0 ms
     * (via motion-reduce:transition-none), so a minimal lock suffices. */
    const getLockMs = () => (motionQuery.matches ? 20 : 350);

    /**
     * Commit a scroll-state change and lock further changes until the
     * CSS transition has finished, preventing re-entry.
     */
    const commit = (scrolled: boolean) => {
      committedRef.current = scrolled;
      lockRef.current = true;
      setIsScrolled(scrolled);

      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(() => {
        lockRef.current = false;
      }, getLockMs());
    };

    /* ── rAF-batched scroll handler ── */
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        /* Skip threshold checks while a transition is in-flight */
        if (lockRef.current) return;

        const y = window.scrollY;

        if (!committedRef.current && y > 150) {
          commit(true);
        } else if (committedRef.current && y < 50) {
          commit(false);
        }
      });
    };

    /* Set the initial state synchronously (no lock needed because
       there is no CSS transition on the very first render). */
    if (window.scrollY > 150) {
      committedRef.current = true;
      setIsScrolled(true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(lockTimerRef.current);
      htmlEl.style.overflowAnchor = prevOverflowAnchor;
    };
  }, []);

  const currentDate = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  const navItems = [
    { id: "about", label: "01. ABOUT", shortLabel: "01. ABOUT" },
    { id: "experience", label: "02. EXPERIENCE", shortLabel: "02. EXP" },
    { id: "techstack", label: "03. TECH STACK", shortLabel: "03. STACK" },
    { id: "projects", label: "04. PROJECTS", shortLabel: "04. WORK" },
    { id: "certifications", label: "05. CERTIFICATIONS", shortLabel: "05. CERTS" },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border mb-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto py-2 px-1 sm:px-2">
        {/* Top Issue Bar (Smoothly collapses when scrolled) */}
        <div
          className={`transition-all duration-300 ease-in-out motion-reduce:transition-none flex flex-wrap items-center justify-between text-xs font-mono tracking-widest text-muted-foreground gap-2 overflow-hidden ${
            isScrolled
              ? "max-h-0 opacity-0 pb-0 border-none pointer-events-none"
              : "max-h-12 opacity-100 pb-2 border-b border-border pointer-events-auto"
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Main Title Banner (Smoothly collapses when scrolled) */}
        <div
          className={`transition-all duration-300 ease-in-out motion-reduce:transition-none text-center rule-double overflow-hidden ${
            isScrolled
              ? "max-h-0 opacity-0 my-0 py-0 pointer-events-none"
              : "max-h-40 opacity-100 my-3 py-4 sm:py-6 pointer-events-auto"
          }`}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-foreground uppercase mb-1">
            Adzyl Jipos
          </h1>
          <p className="font-mono text-xs sm:text-sm tracking-widest text-muted-foreground uppercase">
            Software Developer
          </p>
        </div>

        {/* Dynamic Navigation Bar (Transitions into compact navbar on scroll) */}
        <div
          className={`transition-all duration-300 ease-in-out motion-reduce:transition-none flex items-center gap-4 ${
            isScrolled
              ? "justify-between py-1 border-none"
              : "justify-center py-2 border-t border-b border-border"
          }`}
        >
          {/* Scrolled Logo Only (Fades and scales in on scroll) */}
          <a
            href="#home"
            onClick={(e) => handleNavClick("home", e)}
            className={`transition-all duration-300 ease-in-out motion-reduce:transition-none shrink-0 group flex items-center ${
              isScrolled
                ? "opacity-100 scale-100 w-auto pointer-events-auto"
                : "opacity-0 scale-75 w-0 pointer-events-none overflow-hidden"
            }`}
            title="Adzyl Jipos - Home"
          >
            <img
              src="/logo.webp"
              alt="<AZI> Logo"
              className="h-10 sm:h-11 w-auto object-contain dark:invert-0 invert transition-transform group-hover:scale-105"
            />
          </a>

          {/* Section Navigation Links */}
          <nav aria-label="Masthead Navigation" className="overflow-x-auto py-1 max-w-full">
            <ul
              className={`flex items-center text-xs font-mono uppercase tracking-wider transition-all duration-300 motion-reduce:transition-none ${
                isScrolled
                  ? "gap-x-3 sm:gap-x-6 text-[11px] sm:text-xs whitespace-nowrap"
                  : "flex-wrap justify-center gap-x-5 sm:gap-x-6 gap-y-2"
              }`}
            >
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(item.id, e)}
                    className="hover:underline underline-offset-4 transition-all hover:text-foreground text-muted-foreground"
                  >
                    <span className={isScrolled ? "hidden md:inline" : ""}>
                      {item.label}
                    </span>
                    {isScrolled && (
                      <span className="md:hidden">{item.shortLabel}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme Toggle (Visible only in scrolled mode on the right) */}
          <div
            className={`transition-all duration-300 motion-reduce:transition-none shrink-0 ${
              isScrolled
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-75 pointer-events-none hidden"
            }`}
          >
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
