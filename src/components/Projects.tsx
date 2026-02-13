import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/types";

interface ProjectsProps {
  projects: Project[];
  limit?: number;
  showViewAll?: boolean;
  compact?: boolean;
}

export default function Projects({ projects, limit, showViewAll, compact }: ProjectsProps) {
  const displayed = limit ? projects.slice(0, limit) : projects;

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold text-text-light dark:text-white`}>
          {compact ? "Projects" : "Recent Projects"}
        </h2>
        {showViewAll && (
          <Link
            className="text-sm font-medium text-text-light dark:text-text-dark hover:text-gray-500 transition-colors flex items-center"
            to="/projects"
          >
            View All
            <ChevronRight className="size-4 ml-1" />
          </Link>
        )}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No projects added yet.</p>
        </div>
      ) : (
      <div className={`grid grid-cols-1 ${compact ? "" : "md:grid-cols-2"} gap-4`}>
        {displayed.map((project) => {
          const Icon = project.icon;
          return (
            <div
              key={project.title}
              className="group bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark hover:border-text-light/50 dark:hover:border-white/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <Icon className="size-5 text-text-light dark:text-white" />
                </div>
                <ArrowUpRight className="size-5 text-text-muted-light dark:text-text-muted-dark transform group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-1.5">
                {project.title}
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-3">
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
