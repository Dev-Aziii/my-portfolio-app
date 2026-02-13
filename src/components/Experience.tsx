interface ExperienceEntry {
  title: string;
  year: string;
  company: string;
  emoji?: string;
  isCurrent?: boolean;
}

const experiences: ExperienceEntry[] = [
  {
    title: "BS Information Technology",
    year: "2026",
    company: "University of Mindanao - Main Campus",
  },
  {
    title: "Hello World!",
    year: "2021",
    company: "Wrote my first line of code JAVA",
    emoji: "",
  },
];

export default function Experience() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-text-light dark:text-white mb-8">
        Experience
      </h2>
      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No experience added yet.</p>
        </div>
      ) : (
      <div className="relative border-l-2 border-border-light dark:border-border-dark ml-3 space-y-12">
        {experiences.map((exp, index) => (
          <div
            key={`${exp.title}-${exp.year}`}
            className={`relative pl-8${index === experiences.length - 1 ? " pb-2" : ""}`}
          >
            <div
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-surface-light dark:border-background-dark ${
                exp.isCurrent
                  ? "bg-text-light dark:bg-white"
                  : "bg-border-light dark:bg-border-dark"
              }`}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h3 className="text-lg font-bold text-text-light dark:text-white flex items-center gap-2">
                {exp.title}
                {exp.emoji && <span className="text-xl">{exp.emoji}</span>}
              </h3>
              <span className="text-sm font-mono text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
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
