import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { githubContributionsData, type ContributionDay, type GitHubData } from "@/data/githubContributions";

interface GitHubContributionsProps {
  initialData?: GitHubData;
}

type HoveredContribution = {
  day: ContributionDay;
  x: number;
  y: number;
  placement: "above" | "below";
};

export default function GitHubContributions({ initialData = githubContributionsData }: GitHubContributionsProps) {
  const [data] = useState<GitHubData>(initialData);
  const [hoveredDay, setHoveredDay] = useState<HoveredContribution | null>(null);

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
    if (currentWeek.length) result.push(currentWeek);
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
          label: new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
        });
      }
    });
    return labels;
  }, [weeks]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const cellLevels = [0, 1, 2, 3, 4];

  return (
    <section className="github-panel" aria-labelledby="github-heading">
      <div className="github-panel__header">
        <h2 id="github-heading" className="dashboard-eyebrow">Github Contributions</h2>
        <a className="github-panel__link" href={`https://github.com/${data.username}`} target="_blank" rel="noopener noreferrer">
          @{data.username.toUpperCase()} <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <div className="github-panel__record">
        <div className="github-panel__record-header">
          <span>Contribution Record</span>
          <span>Last 12 Months</span>
        </div>

        <div className="github-panel__scroll">
          <div className="github-panel__months">
            {weeks.map((_, weekIdx) => (
              <span key={weekIdx} className="github-panel__month">{monthLabels.find((label) => label.weekIdx === weekIdx)?.label ?? ""}</span>
            ))}
          </div>

          <div className="github-panel__matrix">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="github-panel__week">
                {week.map((day) => (
                  <span
                    key={day.date}
                    className="github-panel__cell"
                    data-level={day.level}
                    role="img"
                    aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                    onMouseEnter={(event) => {
                      const target = event.currentTarget;
                      const bounds = target.getBoundingClientRect();
                      const horizontalPadding = Math.min(92, Math.max(8, window.innerWidth / 2 - 8));
                      const x = Math.min(
                        Math.max(bounds.left + bounds.width / 2, horizontalPadding),
                        window.innerWidth - horizontalPadding,
                      );
                      const placement: HoveredContribution["placement"] = bounds.top > 72 ? "above" : "below";
                      setHoveredDay({
                        day,
                        x,
                        y: placement === "above" ? bounds.top - 8 : bounds.bottom + 8,
                        placement,
                      });
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {hoveredDay && (
          <div
            className={`github-panel__tooltip github-panel__tooltip--${hoveredDay.placement}`}
            style={{ left: hoveredDay.x, top: hoveredDay.y }}
          >
            <strong>{hoveredDay.day.count === 0 ? "No contributions" : `${hoveredDay.day.count} contribution${hoveredDay.day.count === 1 ? "" : "s"}`}</strong>
            <small>on {formatDate(hoveredDay.day.date)}</small>
          </div>
        )}

        <div className="github-panel__footer">
          <span>{data.totalContributions.toLocaleString()} contributions in the last year</span>
          <span className="github-panel__legend">
            Less
            {cellLevels.map((level) => <span key={level} className="github-panel__cell" data-level={level} aria-hidden="true" />)}
            More
          </span>
        </div>
      </div>
    </section>
  );
}
