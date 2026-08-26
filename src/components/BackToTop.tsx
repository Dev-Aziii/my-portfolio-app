import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-1 px-2.5 py-1.5 border border-border dark:border-cyan-500/40 bg-card dark:bg-[#081220]/90 text-foreground dark:text-cyan-300 font-mono text-xs uppercase tracking-wider hover:border-foreground dark:hover:border-cyan-400 dark:hover:shadow-[0_0_14px_rgba(0,240,255,0.3)] transition-all duration-200 cursor-pointer shadow-sm",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-2"
      )}
    >
      <ArrowUp className="size-3.5 text-foreground dark:text-cyan-300" />
      <span className="hidden sm:inline">TOP</span>
    </button>
  );
}

