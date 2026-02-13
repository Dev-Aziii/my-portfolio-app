import { Code, ArrowUpRight, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Project {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

const projects: Project[] = [
  {
    title: "ElecSys",
    description: "Offline First Election System for Samal Island  Multipurpose Cooperative - LEMP stack",
    url: "#",
    icon: Code,
  },
];

export default function Projects() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text-light dark:text-white">
          Recent Projects
        </h2>
        <a
          className="text-sm font-medium text-text-light dark:text-text-dark hover:text-gray-500 transition-colors flex items-center"
          href="#"
        >
          View All
          <ChevronRight className="size-4 ml-1" />
        </a>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No projects added yet.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <div
              key={project.title}
              className="group bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:border-text-light/50 dark:hover:border-white/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <Icon className="size-6 text-text-light dark:text-white" />
                </div>
                <ArrowUpRight className="size-5 text-text-muted-light dark:text-text-muted-dark transform group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-4">
                {project.description}
              </p>
              <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-text-light dark:text-text-dark">
                {project.url}
              </code>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
}
