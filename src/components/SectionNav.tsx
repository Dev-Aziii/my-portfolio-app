import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "home", label: "00. TOP" },
  { id: "about", label: "01. ABOUT" },
  { id: "experience", label: "02. EXP" },
  { id: "techstack", label: "03. STACK" },
  { id: "projects", label: "04. WORK" },
  { id: "certifications", label: "05. CERTS" },
  // { id: "gallery", label: "06. PHOTOS" },
];

export default function SectionNav() {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const offset = window.innerHeight * 0.35;
        let current = sections[0].id;
        for (const { id } of sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= offset) {
            current = id;
          }
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-start gap-1 font-mono text-[10px]"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollTo(id)}
          aria-current={active === id ? "true" : undefined}
          className={cn(
            "group flex items-center gap-2 px-2 py-1 tracking-wider uppercase transition-colors duration-200",
            active === id
              ? "text-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "h-px bg-border transition-all duration-200",
              active === id
                ? "w-5 bg-foreground"
                : "w-2 group-hover:w-5 group-hover:bg-foreground"
            )}
          />
          {label}
        </button>
      ))}
    </nav>
  );
}
