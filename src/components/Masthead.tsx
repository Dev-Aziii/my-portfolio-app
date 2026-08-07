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
        setIsScrolled(window.scrollY > 120);
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
    { id: "gallery", label: "06. GALLERY", shortLabel: "06. PHOTOS" },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-md transition-all duration-300 border-b border-border mb-8">
      {isScrolled ? (
        /* Compact Sticky Newspaper Masthead */
        <div className="flex items-center justify-between py-2 px-1 sm:px-2 gap-2 text-foreground animate-fade-in-up">
          {/* Abbreviated Branding */}
          <a
            href="#home"
            onClick={(e) => handleNavClick("home", e)}
            className="font-serif font-bold text-base sm:text-lg tracking-tight uppercase hover:underline shrink-0 text-foreground"
          >
            ADZYL JIPOS
          </a>

          {/* Section Navigation Links */}
          <nav aria-label="Compact Navigation" className="overflow-x-auto py-1 max-w-full">
            <ul className="flex items-center gap-x-3 sm:gap-x-5 text-[11px] sm:text-xs font-mono uppercase tracking-wider whitespace-nowrap">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(item.id, e)}
                    className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                  >
                    <span className="hidden md:inline">{item.label}</span>
                    <span className="md:hidden">{item.shortLabel}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme Toggle */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      ) : (
        /* Full Top Editorial Masthead */
        <div className="pt-2 pb-1 text-foreground">
          {/* Top Issue Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono tracking-widest text-muted-foreground border-b border-border pb-2 gap-2">
            <div className="flex items-center gap-3">
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Main Masthead Banner */}
          <div className="py-4 sm:py-6 text-center rule-double my-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-foreground uppercase mb-1">
              Adzyl Jipos
            </h1>
            <p className="font-mono text-xs sm:text-sm tracking-widest text-muted-foreground uppercase">
              Software Developer
            </p>
          </div>

          {/* Editorial Navigation Bar */}
          <nav aria-label="Masthead Navigation" className="border-t border-b border-border py-2">
            <ul className="flex flex-wrap justify-center items-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(item.id, e)}
                    className="hover:underline underline-offset-4 transition-all hover:text-foreground text-muted-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
