import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface MastheadProps {
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export default function Masthead({ onNavigateSection }: MastheadProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── refs that guard against transition oscillation ──────────── */
  const committedRef = useRef(false); // the "settled" scroll state
  const lockRef = useRef(false); // blocks threshold checks during CSS transition
  const rafRef = useRef(0);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    /* Disable scroll anchoring on the document element. */
    const htmlEl = document.documentElement;
    const prevOverflowAnchor = htmlEl.style.overflowAnchor;
    htmlEl.style.overflowAnchor = "none";

    /* Detect reduced-motion preference (read live via closure) */
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  // Lock body scroll when mobile drawer is open & handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

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
    setIsDrawerOpen(false);
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(id);
    }
  };

  const drawerPortal = mounted ? (
    createPortal(
      <>
        {/* Mobile Slide-Out Drawer Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 md:hidden transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Side Drawer Content */}
        <aside
          aria-label="Mobile Navigation Drawer"
          className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-card border-l border-border md:hidden flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "var(--card)" }}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border dark:border-cyan-500/20 pb-4 mb-6">
              <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground dark:text-cyan-400 uppercase">
                [ NAVIGATION ]
              </span>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 border border-border dark:border-cyan-500/30 hover:border-foreground dark:hover:border-cyan-300 transition-colors cursor-pointer text-foreground dark:text-cyan-300"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Nav List */}
            <nav aria-label="Mobile Drawer Navigation">
              <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(item.id, e)}
                      className="block py-2.5 px-3 border border-transparent hover:border-border dark:hover:border-cyan-500/40 hover:bg-background/60 dark:hover:bg-cyan-950/30 text-foreground dark:text-cyan-200/90 dark:hover:text-cyan-300 transition-all font-semibold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-border dark:border-cyan-500/20 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground dark:text-cyan-400/80 tracking-wider uppercase font-bold">
                THEME
              </span>
              <ThemeToggle />
            </div>
            <div className="font-mono text-[10px] text-muted-foreground dark:text-cyan-500/60 tracking-widest uppercase">
              {currentDate}
            </div>
          </div>
        </aside>
      </>,
      document.body
    )
  ) : null;

  return (
    <>
      <header
        id="masthead"
        className={`sticky top-0 z-40 w-full mb-6 sm:mb-8 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 dark:bg-[#060b13]/90 backdrop-blur-md border-b border-border dark:border-cyan-500/20 shadow-xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto py-2 px-3 sm:px-4">
          {/* Top Issue Bar - Desktop only */}
          <div
            id="masthead-top"
            className={`transition-all duration-300 ease-in-out motion-reduce:transition-none hidden md:flex items-center justify-between text-xs font-mono tracking-widest text-muted-foreground dark:text-cyan-400/90 ${
              isScrolled
                ? "max-h-0 opacity-0 pb-0 border-none pointer-events-none overflow-hidden"
                : "max-h-14 opacity-100 pb-2 border-b border-border dark:border-cyan-500/20 pointer-events-auto"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="hidden dark:inline-block size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
                {currentDate}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Header Top Row (< md) */}
          <div className="flex md:hidden items-center justify-between py-1">
            <a
              href="#home"
              onClick={(e) => handleNavClick("home", e)}
              className="flex items-center gap-2.5 group"
              title="Adzyl Jipos - Home"
            >
              <div className="p-0.5 border border-border/80 dark:border-cyan-400/60 rounded-full bg-card dark:bg-cyan-950/40 shrink-0 dark:shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                <img
                  src="/images/profile.webp"
                  alt="Adzyl Jipos"
                  className="size-7 sm:size-8 rounded-full object-cover grayscale contrast-110 sepia-[0.20] brightness-90 dark:grayscale-0 dark:sepia-0 dark:brightness-100 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-foreground dark:text-white uppercase">
                Adzyl Jipos
              </span>
            </a>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="p-1.5 border border-border dark:border-cyan-500/40 hover:border-foreground dark:hover:border-cyan-400 bg-card dark:bg-cyan-950/30 text-foreground dark:text-cyan-300 transition-colors cursor-pointer"
                aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isDrawerOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {/* Main Title Banner & Profile Portrait (Desktop md+) */}
          <div
            id="masthead-banner"
            className={`transition-all duration-300 ease-in-out motion-reduce:transition-none hidden md:block rule-double dark:border-cyan-500/20 overflow-hidden ${
              isScrolled
                ? "max-h-0 opacity-0 my-0 py-0 pointer-events-none"
                : "max-h-56 opacity-100 my-3 py-4 sm:py-6 pointer-events-auto"
            }`}
          >
            <div className="flex items-center gap-6 lg:gap-8 px-4 sm:px-6">
              {/* Glowing Profile Portrait Frame */}
              <div className="shrink-0 group relative cursor-pointer my-1">
                <div className="relative p-1.5 border-2 border-[#c5b59f] dark:border-cyan-400/90 rounded-full bg-[#f2ebd9] dark:bg-slate-950/80 shadow-md dark:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-500 group-hover:border-[#8c6f52] dark:group-hover:border-cyan-300">
                  <div className="size-28 lg:size-32 rounded-full border border-[#b59e84]/70 dark:border-cyan-400/80 overflow-hidden bg-[#e8decd] dark:bg-slate-950 shadow-inner">
                    <img
                      src="/images/profile.webp"
                      alt="Adzyl Jipos"
                      className="size-full object-cover grayscale contrast-110 sepia-[0.25] brightness-95 dark:grayscale-0 dark:sepia-0 dark:brightness-100 dark:contrast-105 transition-all duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle + Nav Links */}
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground dark:text-white uppercase mb-1 dark:drop-shadow-[0_0_24px_rgba(0,240,255,0.75)]">
                  ADZYL JIPOS
                </h1>
                <p className="font-mono text-xs sm:text-sm tracking-widest text-muted-foreground dark:text-cyan-400 font-semibold uppercase mb-3.5 dark:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                  Software Developer
                </p>

                {/* Section Navigation Links */}
                <nav aria-label="Masthead Navigation" className="overflow-x-auto">
                  <ul className="flex items-center gap-x-3 lg:gap-x-4 gap-y-1 text-xs font-mono uppercase tracking-wider flex-wrap">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => handleNavClick(item.id, e)}
                          className="inline-block py-1 px-2 border border-transparent hover:border-border dark:hover:border-cyan-500/50 hover:bg-card/60 dark:hover:bg-cyan-950/40 text-muted-foreground hover:text-foreground dark:text-cyan-200/80 dark:hover:text-cyan-300 transition-all font-semibold rounded-xs"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Mobile Main Banner Unscrolled (< md) */}
          {!isScrolled && (
            <div className="flex md:hidden flex-col items-center text-center py-4 border-b border-border dark:border-cyan-500/20 my-2">
              {/* Mobile Avatar */}
              <div className="shrink-0 group relative cursor-pointer mb-3">
                <div className="p-1 border-2 border-border/80 dark:border-cyan-400/80 rounded-full bg-card/40 dark:bg-slate-950 shadow-md dark:shadow-[0_0_16px_rgba(0,240,255,0.35)] transition-all duration-500 group-hover:border-foreground/40 dark:group-hover:border-cyan-300">
                  <div className="size-24 rounded-full border border-border/60 dark:border-cyan-400/60 overflow-hidden bg-muted dark:bg-slate-950">
                    <img
                      src="/images/profile.webp"
                      alt="Adzyl Jipos"
                      className="size-full object-cover grayscale contrast-110 sepia-[0.20] brightness-90 dark:grayscale-0 dark:sepia-0 dark:brightness-100 dark:contrast-105 transition-all duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground dark:text-white uppercase mb-1">
                Adzyl Jipos
              </h1>
              <p className="font-mono text-xs tracking-widest text-muted-foreground dark:text-cyan-400 uppercase">
                Software Developer
              </p>
            </div>
          )}

          {/* Dynamic Compact Scrolled Navigation Bar (Desktop md+) */}
          <div
            className={`transition-all duration-300 ease-in-out motion-reduce:transition-none hidden md:flex items-center gap-4 ${
              isScrolled
                ? "justify-between py-2 border-t border-b border-border dark:border-cyan-500/20"
                : "h-0 opacity-0 pointer-events-none overflow-hidden"
            }`}
          >
            {/* Scrolled Logo + Mini Profile Avatar */}
            <a
              href="#home"
              onClick={(e) => handleNavClick("home", e)}
              className="shrink-0 group flex items-center gap-2.5"
              title="Adzyl Jipos - Home"
            >
              <div className="p-0.5 border border-border/80 dark:border-cyan-400/70 rounded-full bg-card dark:bg-cyan-950/40 shrink-0 dark:shadow-[0_0_8px_rgba(0,240,255,0.35)]">
                <img
                  src="/images/profile.webp"
                  alt="Adzyl Jipos"
                  className="size-7 rounded-full object-cover grayscale contrast-110 sepia-[0.20] brightness-90 dark:grayscale-0 dark:sepia-0 dark:brightness-100 transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight text-foreground dark:text-white uppercase">
                Adzyl Jipos
              </span>
            </a>

            {/* Section Navigation Links in Scrolled Bar */}
            <nav aria-label="Scrolled Navigation" className="overflow-x-auto py-1 max-w-full">
              <ul className="flex items-center text-xs font-mono uppercase tracking-wider gap-x-4 lg:gap-x-6 whitespace-nowrap">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(item.id, e)}
                      className="hover:underline underline-offset-4 transition-all hover:text-foreground text-muted-foreground dark:text-cyan-200/80 dark:hover:text-cyan-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Theme Toggle in Scrolled Mode */}
            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {drawerPortal}
    </>
  );
}
