import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

interface MastheadProps {
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export default function Masthead({ onNavigateSection }: MastheadProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Hysteresis threshold gap (150px vs 50px) to ensure zero flickering during scroll
        if (scrollY > 150) {
          setIsScrolled(true);
        } else if (scrollY < 50) {
          setIsScrolled(false);
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
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
          className={`transition-all duration-300 ease-in-out flex flex-wrap items-center justify-between text-xs font-mono tracking-widest text-muted-foreground gap-2 overflow-hidden ${
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
          className={`transition-all duration-300 ease-in-out text-center rule-double overflow-hidden ${
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
          className={`transition-all duration-300 ease-in-out flex items-center gap-4 ${
            isScrolled
              ? "justify-between py-1 border-none"
              : "justify-center py-2 border-t border-b border-border"
          }`}
        >
          {/* Scrolled Logo Only (Fades and scales in on scroll) */}
          <a
            href="#home"
            onClick={(e) => handleNavClick("home", e)}
            className={`transition-all duration-300 ease-in-out shrink-0 group flex items-center ${
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
              className={`flex items-center text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
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
            className={`transition-all duration-300 shrink-0 ${
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
