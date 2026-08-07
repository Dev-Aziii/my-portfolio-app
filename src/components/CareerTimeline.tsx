import { useState } from "react";
import type { ExperienceEntry, PositionEntry } from "@/data/types";
import { MapPin, Calendar, Briefcase, Plus, Check } from "lucide-react";

interface CareerTimelineProps {
  entries: ExperienceEntry[];
}

function SkillTagList({ skills }: { skills: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!skills || skills.length === 0) return null;

  const displayLimit = 3;
  const hasMore = skills.length > displayLimit;
  const visibleSkills = expanded ? skills : skills.slice(0, displayLimit);
  const remainingCount = skills.length - displayLimit;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
      {visibleSkills.map((skill) => (
        <span
          key={skill}
          className="font-mono text-[11px] px-3 py-1 border border-border/80 rounded-md bg-muted/30 text-foreground/90 font-medium tracking-wide transition-colors hover:border-foreground/40"
        >
          {skill}
        </span>
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="font-mono text-[11px] px-2.5 py-1 border border-dashed border-border rounded-md bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors flex items-center gap-1 cursor-pointer"
          title={expanded ? "Show fewer skills" : "Show all skills"}
        >
          {expanded ? (
            <>
              <Check className="size-3" />
              <span>Show less</span>
            </>
          ) : (
            <>
              <Plus className="size-3" />
              <span>+{remainingCount} skills</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

function PositionItem({
  position,
  isLast,
}: {
  position: PositionEntry;
  isLast: boolean;
}) {
  const descriptions = Array.isArray(position.description)
    ? position.description
    : position.description
    ? [position.description]
    : [];

  return (
    <div className="relative pl-6 sm:pl-8 pb-8 group">
      {/* Sub-timeline line & sub-node */}
      {!isLast && (
        <span className="absolute left-[3px] sm:left-[7px] top-2.5 -bottom-2.5 w-0.5 bg-border" />
      )}
      <span className="absolute left-0 sm:left-1 top-2.5 size-2 rounded-full border-2 border-foreground bg-background z-10 transition-transform group-hover:scale-125" />

      {/* Position Header */}
      <div>
        <h4 className="font-serif font-bold text-lg sm:text-xl text-foreground tracking-tight">
          {position.title}
        </h4>
        <div className="font-mono text-xs text-muted-foreground font-semibold tracking-wider uppercase mt-1 flex items-center gap-1.5 flex-wrap">
          <Calendar className="size-3.5 inline-block opacity-70" />
          <span>{position.timeSpan}</span>
        </div>
      </div>

      {/* Description Paragraphs */}
      {descriptions.length > 0 && (
        <div className="mt-3 space-y-2 text-sm text-foreground/85 leading-relaxed">
          {descriptions.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

      {/* Stack & Skill tags */}
      {position.skills && <SkillTagList skills={position.skills} />}
    </div>
  );
}

export default function CareerTimeline({ entries }: CareerTimelineProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="py-12 text-center font-mono text-sm text-muted-foreground border border-dashed border-border rounded-lg">
        NO CAREER HISTORY RECORDED.
      </div>
    );
  }

  return (
    <div className="relative space-y-12 pl-2 sm:pl-4">
      {entries.map((entry, entryIdx) => {
        const companyName = entry.title || entry.company;
        const initials =
          entry.logoInitials ||
          companyName
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

        const positions = entry.positions || [
          {
            title: entry.title || entry.company,
            timeSpan: entry.year,
            description: undefined,
            skills: undefined,
          },
        ];

        return (
          <div key={`${companyName}-${entryIdx}`} className="relative pl-12 sm:pl-16">
            {/* Outer Timeline vertical bar */}
            {entryIdx < entries.length - 1 && (
              <span className="absolute left-5 sm:left-6 top-12 bottom-0 w-0.5 bg-border" />
            )}

            {/* Company Badge / Logo Circle */}
            <div className="absolute left-0 top-0 size-10 sm:size-12 rounded-xl border border-border bg-card shadow-sm flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-foreground tracking-wider z-20">
              {initials}
            </div>

            {/* Company / Organization Details */}
            <div className="mb-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-foreground tracking-tight">
                  {companyName}
                </h3>
                {entry.isCurrent && (
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-foreground text-background font-bold rounded-sm">
                    CURRENT
                  </span>
                )}
              </div>

              {/* Company Metadata (Schedule & Location) */}
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                {entry.schedule && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="size-3.5" />
                    {entry.schedule}
                  </span>
                )}
                {entry.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {entry.location}
                  </span>
                )}
              </div>
            </div>

            {/* Nested Positions Timeline */}
            <div className="mt-4">
              {positions.map((pos, posIdx) => (
                <PositionItem
                  key={`${pos.title}-${posIdx}`}
                  position={pos}
                  isLast={posIdx === positions.length - 1}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
