import { useState, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  githubContributionsData,
  type ContributionDay,
  type GitHubData,
} from "@/data/githubContributions";

interface GitHubContributionsProps {
  initialData?: GitHubData;
}

export default function GitHubContributions({
  initialData = githubContributionsData,
}: GitHubContributionsProps) {
  const [data] = useState<GitHubData>(initialData);
  const [hoveredDay, setHoveredDay] = useState<{
    day: ContributionDay;
    x: number;
    y: number;
    weekIdx: number;
  } | null>(null);

  // Group days into columns (weeks) of 7 days
  const weeks = useMemo(() => {
    const result: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    data.days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [data.days]);

  const monthLabels = useMemo(() => {
    const labels: { weekIdx: number; label: string }[] = [];
    let previousMonth = "";

    weeks.forEach((week, weekIdx) => {
      const [year, month] = week[0].date.split("-").map(Number);
      const monthKey = `${year}-${month}`;
      if (monthKey !== previousMonth) {
        previousMonth = monthKey;
        labels.push({
          weekIdx,
          label: new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
            "en-US",
            { month: "short", timeZone: "UTC" }
          ),
        });
      }
    });

    return labels;
  }, [weeks]);

  // Format date helper: "2025-08-03" -> "Aug 3, 2025"
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  const CELL_STYLES: Record<number, string> = {
    0: "bg-transparent ring-1 ring-inset ring-border",
    1: "bg-muted",
    2: "bg-muted-foreground/55",
    3: "bg-foreground/90",
    4: "bg-destructive",
  };

  const cellClass = (level: number) => CELL_STYLES[level] ?? CELL_STYLES[0];

  // Determine tooltip transform alignment based on position to prevent edge clipping
  const getTooltipTransform = (weekIdx: number) => {
    if (weekIdx >= weeks.length - 6) {
      return "translate(-90%, -100%)";
    }
    if (weekIdx <= 5) {
      return "translate(-10%, -100%)";
    }
    return "translate(-50%, -100%)";
  };

  return (
    <section className="h-full flex flex-col justify-between">
      <div>
        {/* Section Header */}
        <div className="flex justify-between items-center border-b border-border pb-2 mb-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
            [ 06 // GITHUB ]
          </h3>
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center uppercase tracking-wider group"
          >
            @{data.username.toUpperCase()}
            <ArrowUpRight className="size-3.5 ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Contribution Graph Container */}
        <div className="bg-card/40 border border-border p-4 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Contribution Record
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:inline">
              Last 12 Months
            </span>
          </div>

          {/* Scrollable Matrix */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-[3px] mb-2 px-4 sm:px-6">
              {weeks.map((_, weekIdx) => {
                const label = monthLabels.find(
                  (l) => l.weekIdx === weekIdx
                )?.label;
                return (
                  <div key={weekIdx} className="w-3 overflow-visible">
                    {label && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="relative min-w-[720px] flex items-center justify-between gap-[3px] pt-14 pb-3 px-4 sm:px-6">
              {/* Floating Tooltip inside scrollable canvas container */}
              {hoveredDay && (
                <div
                  style={{
                    position: "absolute",
                    left: `${hoveredDay.x}px`,
                    top: `${hoveredDay.y - 6}px`,
                    transform: getTooltipTransform(hoveredDay.weekIdx),
                  }}
                  className="pointer-events-none z-30 px-2.5 py-1.5 bg-popover text-popover-foreground border border-border shadow-[3px_3px_0_0_var(--border)] whitespace-nowrap animate-fade-in"
                >
                  <p className="font-serif font-bold text-sm leading-tight text-foreground">
                    {hoveredDay.day.count === 0
                      ? "No contributions"
                      : `${hoveredDay.day.count} contribution${
                          hoveredDay.day.count === 1 ? "" : "s"
                        }`}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    on {formatDate(hoveredDay.day.date)}
                  </p>
                </div>
              )}

              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className="size-3 flex items-center justify-center cursor-pointer group"
                      onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        setHoveredDay({
                          day,
                          x: target.offsetLeft + target.offsetWidth / 2,
                          y: target.offsetTop,
                          weekIdx,
                        });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <span
                        className={`size-[11px] transition-transform duration-150 group-hover:scale-110 ${cellClass(day.level)}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Summary Count + Legend */}
          <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono tracking-wider text-muted-foreground uppercase">
            <span>
              {data.totalContributions.toLocaleString()} CONTRIBUTIONS IN THE LAST YEAR
            </span>
            <span className="flex items-center gap-1.5 text-[10px]">
              LESS
              {[0, 1, 2, 3, 4].map((level) => (
                <span key={level} className={`size-2.5 ${cellClass(level)}`} />
              ))}
              MORE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
