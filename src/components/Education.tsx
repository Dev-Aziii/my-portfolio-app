import { GraduationCap, MapPin } from "lucide-react";
import type { ExperienceEntry } from "@/data/types";

interface EducationProps {
  entries: ExperienceEntry[];
}

export default function Education({ entries }: EducationProps) {
  const educationEntries = entries.filter(
    (entry) => entry.kind === "education" || entry.kind === "learning",
  );

  return (
    <div className="dashboard-panel" data-testid="education-panel">
      <div className="dashboard-section-header">
        <div>
          <span className="dashboard-eyebrow">Learning path</span>
          <h2>Education</h2>
        </div>
        <GraduationCap aria-hidden="true" />
      </div>

      <div className="dashboard-education-list">
        {educationEntries.map((entry) => (
          <article key={`${entry.company}-${entry.year}`} className="dashboard-education-item">
            <div className="dashboard-education-item__mark" aria-hidden="true">
              {entry.logoInitials ?? "ED"}
            </div>
            <div>
              <div className="dashboard-meta-row">
                <span>{entry.year}</span>
                {entry.isCurrent && <span className="dashboard-status-badge">Current</span>}
              </div>
              <h3>{entry.title ?? entry.company}</h3>
              <p>{entry.company}</p>
              {entry.location && (
                <span className="dashboard-location">
                  <MapPin aria-hidden="true" />
                  {entry.location}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

