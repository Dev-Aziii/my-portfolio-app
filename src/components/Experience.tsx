import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ExperienceEntry } from "@/data/types";

interface ExperienceProps {
  entries: ExperienceEntry[];
  compact?: boolean;
  showViewAll?: boolean;
}

export default function Experience({ entries, compact, showViewAll = true }: ExperienceProps) {
  const displayedEntries = compact ? entries.slice(0, 3) : entries;

  return (
    <section className="h-full flex flex-col justify-between">
      {/* Light Mode Experience View */}
      <div className="dark:hidden">
        <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
            [ 02 // EXPERIENCE ]
          </h3>
          {showViewAll ? (
            <Link
              to="/experience"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center uppercase tracking-wider"
            >
              FULL HISTORY
              <ChevronRight className="size-3.5 ml-0.5" />
            </Link>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              CAREER TIMELINE
            </span>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs text-muted-foreground">
            NO EXPERIENCE RECORDED.
          </div>
        ) : (
          <div className="divide-y divide-border border-t border-b border-border">
            {displayedEntries.map((exp, idx) => (
              <div
                key={`${exp.title || exp.company}-${exp.year}-${idx}`}
                className="py-3.5 grid grid-cols-1 sm:grid-cols-4 gap-2 items-baseline group"
              >
                <div className="sm:col-span-1 font-mono text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-foreground inline-block shrink-0" />
                  {exp.year}
                </div>
                <div className="sm:col-span-3">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="font-serif font-bold text-base text-foreground group-hover:underline underline-offset-2">
                      {exp.title || exp.company}
                    </h4>
                    {exp.isCurrent && (
                      <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-foreground text-background font-bold">
                        PRESENT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {exp.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dark Mode HUD Experience View */}
      <div className="hidden dark:block hud-panel p-5 sm:p-6 border border-cyan-500/25 bg-[#081220]/80 hud-corners h-full">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
            [ 02 // EXPERIENCE ]
          </h3>
          {showViewAll ? (
            <Link
              to="/experience"
              className="font-mono text-xs text-cyan-400/80 hover:text-cyan-300 transition-colors flex items-center uppercase tracking-wider group"
            >
              FULL HISTORY
              <ChevronRight className="size-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <span className="font-mono text-[10px] text-cyan-400/60 uppercase">
              CAREER TIMELINE
            </span>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs text-cyan-400/60">
            NO EXPERIENCE RECORDED.
          </div>
        ) : (
          <div className="relative pl-3 space-y-4 pt-1">
            {/* Continuous Vertical Timeline Line */}
            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-cyan-500/30" />

            {displayedEntries.map((exp, idx) => (
              <div
                key={`${exp.title || exp.company}-${exp.year}-${idx}`}
                className="relative pl-6 group"
              >
                {/* Glowing Circular Node */}
                <span className="absolute left-0 top-1.5 size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.9)] transition-transform group-hover:scale-125" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-mono text-xs font-semibold text-cyan-400 shrink-0">
                    {exp.year}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                        {exp.title || exp.company}
                      </h4>
                      {exp.isCurrent && (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 font-bold">
                          PRESENT
                        </span>
                      )}
                    </div>
                    {exp.company && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {exp.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}