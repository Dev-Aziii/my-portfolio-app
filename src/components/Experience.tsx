import type { ExperienceEntry } from "@/data/types";

interface ExperienceProps {
  entries: ExperienceEntry[];
  compact?: boolean;
}

export default function Experience({ entries, compact }: ExperienceProps) {
  return (
    <section>
      <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold text-text-light dark:text-white mb-6`}>
        Experience
      </h2>
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No experience added yet.</p>
        </div>
      ) : (
      <div className="relative border-l-2 border-border-light dark:border-border-dark ml-3 space-y-10">
        {entries.map((exp, index) => (
          <div
            key={`${exp.title}-${exp.year}`}
            className={`relative pl-10 ${index === entries.length - 1 ? "pb-2" : ""}`}
          >
            <div
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-surface-light dark:border-background-dark ${
                exp.isCurrent
                  ? "bg-text-light dark:bg-white"
                  : "bg-border-light dark:bg-border-dark"
              }`}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-2">
              <h3 className="text-lg font-bold text-text-light dark:text-white flex items-center gap-2">
                {exp.title}
                {exp.emoji && <span className="text-xl">{exp.emoji}</span>}
              </h3>
              <span className="text-sm font-mono text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded whitespace-nowrap">
                {exp.year}
              </span>
            </div>
            <p className="text-text-muted-light dark:text-gray-400">
              {exp.company}
            </p>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}