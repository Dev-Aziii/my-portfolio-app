import { MapPin, Mail, FileDown, ArrowUpRight } from "lucide-react";
import type { HeroData } from "@/data/types";
import { buttonVariants } from "@/components/ui/button";

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative w-full py-4 border-b border-border animate-fade-in-up">
      {/* Front-Page Article Lead Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5 text-foreground" />
          {data.location}
        </span>
      </div>

      <div className="space-y-4">
        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight tracking-tight">
          Crafting Scalable Web &amp; Mobile Software Architecture
        </h2>

        {/* Lead Summary */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-3xl">
          Specializing in modern full-stack web and mobile application engineering. Passionate about clean code, scalable architecture, and delivering polished, accessible digital products with robust technology stacks.
        </p>

        {/* Rectangular Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <a
            href={data.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "default" })}
          >
            <FileDown className="size-4" />
            Download CV
          </a>

          <a
            href={`mailto:${data.email}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <Mail className="size-4 text-foreground" />
            Send Email
          </a>

          <a
            href="https://github.com/Dev-Aziii"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost" })}
          >
            GitHub
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
