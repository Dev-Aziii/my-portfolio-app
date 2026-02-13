import { ChevronRight } from "lucide-react";

interface TechCategory {
  name: string;
  items: string[];
}

const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: ["JavaScript", "TypeScript", "React", "Tailwind CSS"],
  },
  {
    name: "Backend",
    items: ["Java", "C#", "Python", "PHP", "PostgreSQL", "MySQL", "Firebase", "Node.js",],
  },
   {
    name: "Frameworks & Libraries",
    items: ["React", "Laravel", "Flutter"],
  },
  {
    name: "DevOps & Cloud",
    items: ["Docker", "GitHub Actions"],
  },
];

export default function TechStack() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text-light dark:text-white">
          Tech Stack
        </h2>
        <a
          className="text-sm font-medium text-text-light dark:text-text-dark hover:text-gray-500 transition-colors flex items-center"
          href="#"
        >
          View All
          <ChevronRight className="size-4 ml-1" />
        </a>
      </div>

      <div className="space-y-8">
        {techStack.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted-light dark:text-text-muted-dark">No tech stack added yet.</p>
          </div>
        ) : techStack.map((category) => (
          <div key={category.name}>
            <h3 className="text-sm uppercase tracking-wider font-semibold text-text-muted-light dark:text-text-muted-dark mb-4">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark shadow-sm hover:border-text-light dark:hover:border-white transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
