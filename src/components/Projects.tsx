import { useEffect, useState, type MouseEvent } from "react";
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/types";
import { formatDemoLabel, isValidHttpUrl } from "@/lib/utils";

interface ProjectsProps {
  projects: Project[];
  limit?: number;
  showViewAll?: boolean;
  compact?: boolean;
  hideTitle?: boolean;
  variant?: "stack" | "grid" | "featured";
}

export default function Projects({ projects, limit, showViewAll, compact, hideTitle, variant }: ProjectsProps) {
  const isGridView = variant === "grid" || hideTitle || compact;
  const isFeaturedView = variant === "featured";
  const displayed = projects.slice(0, limit ?? (isGridView ? undefined : 3));
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (activeIndex >= displayed.length && displayed.length > 0) setActiveIndex(0);
  }, [activeIndex, displayed.length]);

  const copyToClipboard = async (url: string, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      window.setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const activeProject = displayed[activeIndex] ?? displayed[0];

  return (
    <section className={hideTitle ? "dashboard-panel" : ""}>
      {!hideTitle && (
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-eyebrow">Selected work</span>
            <h2>Featured Projects</h2>
          </div>
          {showViewAll && <Link className="dashboard-inline-link" to="/projects">View all <ArrowUpRight aria-hidden="true" /></Link>}
        </div>
      )}

      {!displayed.length ? (
        <div className="dashboard-project-explorer__detail">NO PROJECTS RECORDED.</div>
      ) : isGridView ? (
        <div className="dashboard-project-grid">
          {displayed.map((project) => {
            const Icon = project.icon;
            const isCopied = copiedUrl === project.url;
            const validUrl = isValidHttpUrl(project.url);
            const content = (
              <article className="dashboard-project-card" data-project-card>
                <div>
                  {project.details?.heroImage ? (
                    <div className="dashboard-project-card__image">
                      <img src={project.details.heroImage} alt={project.title} />
                    </div>
                  ) : (
                    <div className="dashboard-project-card__icon"><Icon aria-hidden="true" /></div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <h4>{project.title}</h4>
                    <ArrowUpRight aria-hidden="true" />
                  </div>
                  <p className="dashboard-project-card__description">{project.description}</p>
                </div>
                <div className="dashboard-project-card__footer">
                  <div className="dashboard-project-card__tags">
                    {project.details?.techs?.slice(0, 2).map((tech) => <span key={tech} className="dashboard-skill-pill">{tech}</span>)}
                  </div>
                  {validUrl ? (
                    <button className="dashboard-copy-action" type="button" onClick={(event) => copyToClipboard(project.url, event)} aria-label="Copy URL" title={isCopied ? "Copied!" : "Copy URL"}>
                      {isCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    </button>
                  ) : (
                    <span className="dashboard-copy-action dashboard-copy-action--static" title={formatDemoLabel(project.url)}>{formatDemoLabel(project.url)}</span>
                  )}
                </div>
              </article>
            );
            return project.slug && project.details ? <Link key={project.title} className="dashboard-project-card-link" to={`/projects/${project.slug}`}>{content}</Link> : <div key={project.title}>{content}</div>;
          })}
        </div>
      ) : isFeaturedView ? (
        <div className="dashboard-featured-projects">
          <div className="dashboard-featured-projects__selector" role="list" aria-label="Featured projects">
            {displayed.map((project, index) => (
              <button
                key={project.title}
                type="button"
                className="dashboard-featured-projects__selector-item"
                data-project-selector
                data-active={index === activeIndex}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <span className="dashboard-featured-projects__selector-logo">
                  {project.logo ? <img src={project.logo} alt="" /> : null}
                </span>
                <span>{project.title}</span>
              </button>
            ))}
          </div>

          {activeProject && (
            <article className="dashboard-featured-projects__detail" data-featured-project-detail>
              <div className="dashboard-featured-projects__detail-main">
                {activeProject.details?.heroImage && (
                  <div className="dashboard-featured-projects__detail-art">
                    <img src={activeProject.details.heroImage} alt={`${activeProject.title} project preview`} />
                  </div>
                )}
                <div className="dashboard-featured-projects__detail-copy">
                  <div className="dashboard-featured-projects__detail-heading">
                    <div>
                      <span className="dashboard-eyebrow">Selected project</span>
                      <h3>{activeProject.title}</h3>
                    </div>
                    {activeProject.details?.year && (
                      <span className="dashboard-eyebrow">{activeProject.details.year}</span>
                    )}
                  </div>
                  <p>{activeProject.description}</p>
                  <div className="dashboard-featured-projects__detail-stack-row">
                    {activeProject.details?.techs && (
                      <div className="dashboard-skill-pills">
                        {activeProject.details.techs.slice(0, 5).map((tech) => (
                          <span key={tech} className="dashboard-skill-pill">{tech}</span>
                        ))}
                      </div>
                    )}
                    {activeProject.slug && activeProject.details && (
                      <Link to={`/projects/${activeProject.slug}`} className="dashboard-action" data-featured-project-cta>
                        View project <ArrowUpRight aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      ) : (
        <div className="dashboard-project-explorer">
          <div>
            <div className="dashboard-project-explorer__list">
              {displayed.map((project, index) => (
                <button key={project.title} type="button" data-project-card className="dashboard-project-explorer__item" data-active={index === activeIndex} onClick={() => setActiveIndex(index)}>
                  <span className="dashboard-project-explorer__number">{String(index + 1).padStart(2, "0")}</span>
                  {project.details?.heroImage && <img src={project.details.heroImage} alt="" />}
                  <strong>{project.title}</strong>
                  <ArrowUpRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="dashboard-project-explorer__controls">
              <button type="button" className="dashboard-square-button" onClick={() => setActiveIndex((index) => index === 0 ? displayed.length - 1 : index - 1)} aria-label="Previous project"><ChevronUp aria-hidden="true" /></button>
              <button type="button" className="dashboard-square-button" onClick={() => setActiveIndex((index) => index === displayed.length - 1 ? 0 : index + 1)} aria-label="Next project"><ChevronDown aria-hidden="true" /></button>
            </div>
          </div>

          {activeProject && (
            <article className="dashboard-project-explorer__detail">
              <div className="dashboard-project-explorer__detail-header">
                <div className="flex items-center gap-3">
                  <div className="dashboard-project-explorer__logo">
                    {activeProject.logo ? <img src={activeProject.logo} alt={`${activeProject.title} logo`} /> : <activeProject.icon aria-hidden="true" />}
                  </div>
                  <h3>{activeProject.title}</h3>
                </div>
                {(activeProject.details?.version || activeProject.details?.year) && <span className="dashboard-eyebrow">{activeProject.details.version} {activeProject.details.year}</span>}
              </div>
              <p className="dashboard-project-explorer__detail-description">{activeProject.description}</p>
              {activeProject.details?.techs && <div className="dashboard-project-explorer__section"><span className="dashboard-project-explorer__section-title">Tech stack</span><div className="dashboard-skill-pills">{activeProject.details.techs.map((tech) => <span key={tech} className="dashboard-skill-pill">{tech}</span>)}</div></div>}
              {activeProject.details?.highlights?.length ? <div className="dashboard-project-explorer__section"><span className="dashboard-project-explorer__section-title">Key highlights</span><div className="dashboard-project-explorer__highlights">{activeProject.details.highlights.map((highlight) => <span key={highlight.label} className="dashboard-project-explorer__highlight">{highlight.label}</span>)}</div></div> : null}
              {activeProject.details?.metrics?.length ? <div className="dashboard-project-explorer__section"><div className="dashboard-project-explorer__metrics">{activeProject.details.metrics.map((metric) => <div key={`${metric.label}-${metric.value}`} className="dashboard-project-explorer__metric"><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div></div> : null}
              <div className="dashboard-project-explorer__cta">
                {activeProject.slug && activeProject.details && <Link to={`/projects/${activeProject.slug}`} className="dashboard-action">Open project <ArrowUpRight aria-hidden="true" /></Link>}
                {isValidHttpUrl(activeProject.url) ? <a href={activeProject.url} target="_blank" rel="noopener noreferrer" className="dashboard-inline-link">Visit demo <ArrowUpRight aria-hidden="true" /></a> : <span className="dashboard-eyebrow">{formatDemoLabel(activeProject.url)}</span>}
              </div>
            </article>
          )}
        </div>
      )}
    </section>
  );
}
