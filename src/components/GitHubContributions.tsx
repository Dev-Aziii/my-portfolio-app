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
        <div className="bg-card/40 border border-border/60 rounded-lg p-4 sm:p-6">
          {/* Scrollable Matrix */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border pb-2">
            <div className="relative min-w-[720px] flex items-center justify-between gap-[3px] pt-9 pb-3 px-4 sm:px-6">
              {/* Floating Dark Tooltip inside scrollable canvas container */}
              {hoveredDay && (
                <div
                  style={{
                    position: "absolute",
                    left: `${hoveredDay.x}px`,
                    top: `${hoveredDay.y - 6}px`,
                    transform: getTooltipTransform(hoveredDay.weekIdx),
                  }}
                  className="pointer-events-none z-30 px-2.5 py-1 bg-popover text-popover-foreground border border-border text-[11px] font-mono rounded shadow-md whitespace-nowrap animate-fade-in"
                >
                  <span className="font-semibold text-foreground">
                    {hoveredDay.day.count === 0
                      ? "No contributions"
                      : `${hoveredDay.day.count} contribution${
                          hoveredDay.day.count === 1 ? "" : "s"
                        }`}
                  </span>
                  <span className="text-muted-foreground ml-1.5">
                    on {formatDate(hoveredDay.day.date)}
                  </span>
                </div>
              )}

              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    // Determine dot size and glow based on level
                    let dotStyle = "size-[3px] bg-muted-foreground/25";

                    if (day.level === 1) {
                      dotStyle = "size-[5px] bg-foreground/60";
                    } else if (day.level === 2) {
                      dotStyle = "size-[7px] bg-foreground/80";
                    } else if (day.level === 3) {
                      dotStyle = "size-[9px] bg-foreground shadow-sm";
                    } else if (day.level >= 4) {
                      dotStyle =
                        "size-[11px] bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.7)] dark:shadow-[0_0_8px_rgba(255,255,255,0.9)]";
                    }

                    return (
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
                          className={`rounded-full transition-all duration-150 group-hover:scale-125 ${dotStyle}`}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Summary Count */}
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono tracking-wider text-muted-foreground uppercase">
            <span>
              {data.totalContributions.toLocaleString()} CONTRIBUTIONS IN THE LAST YEAR
            </span>
            <span className="text-[10px] opacity-75 hidden sm:inline">
              SYNCED WITH GITHUB
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
