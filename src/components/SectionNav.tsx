import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "recommendations", label: "Recommendations" },
  { id: "gallery", label: "Gallery" },
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
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start gap-1"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollTo(id)}
          aria-current={active === id ? "true" : undefined}
          className={cn(
            "group flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-colors duration-300",
            active === id
              ? "text-text-light dark:text-white"
              : "text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white"
          )}
        >
          <span
            className={cn(
              "h-px bg-border-light dark:bg-border-dark transition-all duration-300",
              active === id
                ? "w-6 bg-text-light dark:bg-white"
                : "w-3 group-hover:w-6 group-hover:bg-text-light dark:group-hover:bg-white"
            )}
          />
          {label}
        </button>
      ))}
    </nav>
  );
}
