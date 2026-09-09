import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import type { ExperienceEntry } from "@/data/types";

interface ExperienceProps {
  entries: ExperienceEntry[];
  limit?: number;
  showViewAll?: boolean;
}

export default function Experience({ entries, limit = 2, showViewAll = true }: ExperienceProps) {
  const displayedEntries = entries.slice(0, limit);

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

      {!displayedEntries.length ? (
        <div className="dashboard-timeline__empty">NO EXPERIENCE RECORDED.</div>
      ) : (
        <div className="dashboard-timeline">
          {displayedEntries.map((entry, index) => (
            <article key={`${entry.title ?? entry.company}-${entry.year}-${index}`} className="dashboard-timeline__item">
              <span className="dashboard-timeline__marker" aria-hidden="true"><BriefcaseBusiness /></span>
              <div>
                <div className="dashboard-meta-row">
                  <span>{entry.year}</span>
                </div>
                <h3>{entry.title ?? entry.company}</h3>
                <p>{entry.company}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
