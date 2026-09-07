import { useState } from "react";
import type { ExperienceEntry, PositionEntry } from "@/data/types";
import { Briefcase, Calendar, Check, MapPin, Plus } from "lucide-react";

interface CareerTimelineProps {
  entries: ExperienceEntry[];
}

function SkillTagList({ skills }: { skills: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!skills.length) return null;

  const displayLimit = 3;
  const hasMore = skills.length > displayLimit;
  const visibleSkills = expanded ? skills : skills.slice(0, displayLimit);

  return (
    <div className="career-timeline__skills">
      {visibleSkills.map((skill) => (
        <span key={skill} className="career-timeline__skill">
          {skill}
        </span>
      ))}
      {hasMore && (
        <button
          type="button"
          className="career-timeline__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          title={expanded ? "Show fewer skills" : "Show all skills"}
        >
          {expanded ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {expanded ? "Show less" : `+${skills.length - displayLimit} skills`}
        </button>
      )}
    </div>
  );
}

function PositionItem({ position, isLast }: { position: PositionEntry; isLast: boolean }) {
  const descriptions = Array.isArray(position.description)
    ? position.description
    : position.description
      ? [position.description]
      : [];

  return (
    <div className="career-timeline__position">
      <h4>{position.title}</h4>
      <div className="career-timeline__position-time">
        <Calendar aria-hidden="true" />
        {position.timeSpan}
      </div>
      {descriptions.length > 0 && (
        <div className="career-timeline__description">
          {descriptions.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      )}
      {position.skills && <SkillTagList skills={position.skills} />}
      {!isLast && <span aria-hidden="true" />}
    </div>
  );
}

export default function CareerTimeline({ entries }: CareerTimelineProps) {
  if (!entries.length) {
    return <div className="career-timeline__empty">NO CAREER HISTORY RECORDED.</div>;
  }

  return (
    <div className="career-timeline">
      {entries.map((entry, entryIdx) => {
        const companyName = entry.title || entry.company;
        const initials = entry.logoInitials || companyName.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();
        const positions = entry.positions || [{
          title: entry.title || entry.company,
          timeSpan: entry.year,
          description: undefined,
          skills: undefined,
        }];

        return (
          <article key={`${companyName}-${entryIdx}`} className="career-timeline__entry">
            <div className="career-timeline__marker" aria-hidden="true">{initials}</div>
            <div className="career-timeline__heading">
              <h3>{companyName}</h3>
              {entry.isCurrent && <span className="career-timeline__current">CURRENT</span>}
            </div>
            <div className="career-timeline__meta">
              <span><Briefcase aria-hidden="true" />{entry.schedule || entry.year}</span>
              {entry.location && <span><MapPin aria-hidden="true" />{entry.location}</span>}
            </div>
            <div className="career-timeline__positions">
              {positions.map((position, positionIdx) => (
                <PositionItem
                  key={`${position.title}-${positionIdx}`}
                  position={position}
                  isLast={positionIdx === positions.length - 1}
                />
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
