import { ArrowUpRight, HardDrive } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/types";
import { getProjectThemeStyle } from "@/lib/projectTheme";
import { isValidHttpUrl } from "@/lib/utils";

interface ProjectCatalogProps {
  projects: Project[];
}

export default function ProjectCatalog({ projects }: ProjectCatalogProps) {
  if (!projects.length) {
    return <div className="project-catalog__empty">NO PROJECTS RECORDED.</div>;
  }

  return (
    <section
      className="project-catalog"
      data-project-catalog
      aria-label="Project catalog"
    >
      {projects.map((project) => {
        const hasDemo = isValidHttpUrl(project.url);
        const detailPath =
          project.slug && project.details ? `/projects/${project.slug}` : null;

        return (
          <article
            key={project.title}
            className="project-theme project-catalog-card"
            style={getProjectThemeStyle(project.theme)}
            data-project-catalog-card
          >
            <div className="project-catalog-card__wash" aria-hidden="true" />

            <header className="project-catalog-card__header">
              <div className="project-catalog-card__logo">
                <img
                  src={project.logo}
                  alt={`${project.title} logo`}
                  data-project-logo
                />
              </div>
              <span className="project-catalog-card__badge">
                <span aria-hidden="true" />
                {project.badge}
              </span>
            </header>

            <div className="project-catalog-card__body">
              <h2>
                {detailPath ? (
                  <Link
                    className="project-catalog-card__link"
                    to={detailPath}
                    aria-label={`View ${project.title} case study`}
                    data-project-catalog-link
                  >
                    {project.title}
                  </Link>
                ) : (
                  project.title
                )}
              </h2>
              <p>{project.description}</p>
            </div>

            <footer className="project-catalog-card__footer">
              <div
                className="project-catalog-card__tags"
                aria-label={`${project.title} technologies`}
              >
                {project.details?.techs.slice(0, 3).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              {hasDemo ? (
                <a
                  className="project-catalog-card__demo"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} externally`}
                  data-project-demo
                >
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <span
                  className="project-catalog-card__demo project-catalog-card__demo--static"
                  aria-label={`${project.title} is locally hosted`}
                  title="Locally hosted"
                  data-project-local-status
                >
                  <HardDrive aria-hidden="true" />
                </span>
              )}
            </footer>
          </article>
        );
      })}
    </section>
  );
}
