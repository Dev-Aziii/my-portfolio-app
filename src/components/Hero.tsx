import { MapPin, Mail, FileDown, ArrowUpRight } from "lucide-react";
import type { HeroData } from "@/data/types";
import { buttonVariants } from "@/components/ui/button";

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative w-full py-4 border-b border-border dark:border-cyan-500/20 animate-fade-in-up">
      {/* Front-Page Article Lead Header / Location */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tracking-widest text-muted-foreground dark:text-cyan-400 uppercase mb-3">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-foreground dark:text-cyan-400 dark:drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
          {data.location}
        </span>
      </div>

      <div className="space-y-4">
        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground dark:text-white leading-tight tracking-tight">
          Building Modern Software{" "}
          <span className="dark:bg-gradient-to-r dark:from-purple-400 dark:via-indigo-300 dark:to-cyan-300 dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_16px_rgba(168,85,247,0.35)]">
            with AI
          </span>
        </h2>

        {/* Rectangular Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-0">
          <a
            href={data.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({ variant: "default" })} dark:bg-cyan-950/40 dark:border-cyan-400 dark:text-cyan-300 dark:shadow-[0_0_14px_rgba(0,240,255,0.25)] dark:hover:bg-cyan-500/20 dark:hover:text-white dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] transition-all`}
          >
            <FileDown className="size-4 text-background dark:text-cyan-300" />
            Download CV
          </a>

          <a
            href={`mailto:${data.email}`}
            className={`${buttonVariants({ variant: "outline" })} dark:bg-[#0a1526] dark:border-cyan-900/60 dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:text-cyan-200 dark:hover:bg-cyan-950/30 transition-all`}
          >
            <Mail className="size-4 text-foreground dark:text-cyan-400" />
            Send Email
          </a>

          <a
            href="https://github.com/Dev-Aziii"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({ variant: "ghost" })} dark:text-cyan-200/80 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/30 transition-all`}
          >
            GitHub
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href="https://www.linkedin.com/in/adzyl-jipos-287350364/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonVariants({ variant: "ghost" })} dark:text-cyan-200/80 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/30 transition-all`}
          >
            LinkedIn
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

