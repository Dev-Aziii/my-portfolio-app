import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import type { ExperienceEntry } from "@/data/types";

interface ExperienceProps {
  entries: ExperienceEntry[];
  compact?: boolean;
  showViewAll?: boolean;
}
export default function Experience({ entries, compact, showViewAll = true }: ExperienceProps) {
  const displayedEntries = compact ? entries.slice(0, 3) : entries;

  return (
    <section className="dashboard-panel" aria-labelledby="experience-heading">
      <div className="dashboard-section-header">
        <div>
          <span className="dashboard-eyebrow">Career timeline</span>
          <h2 id="experience-heading">Experience</h2>
        </div>
        {showViewAll && (
          <Link to="/experience" className="dashboard-inline-link">
            Full history <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="dashboard-timeline">
        {displayedEntries.map((entry, index) => (
          <article key={`${entry.title ?? entry.company}-${entry.year}-${index}`} className="dashboard-timeline__item">
            <span className="dashboard-timeline__marker" aria-hidden="true"><BriefcaseBusiness /></span>
            <div>
              <div className="dashboard-meta-row">
                <span>{entry.year}</span>
                {entry.isCurrent && <span className="dashboard-status-badge">Current</span>}
              </div>
              <h3>{entry.title ?? entry.company}</h3>
              <p>{entry.company}</p>
              {entry.location && <span className="dashboard-muted-line">{entry.location}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
