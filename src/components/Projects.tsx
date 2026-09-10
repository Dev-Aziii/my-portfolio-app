import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/types";
import { getProjectThemeStyle } from "@/lib/projectTheme";
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

  // 3-slot layout mapping: slot 0 (Left), slot 1 (Center - Active), slot 2 (Right)
  const [slots, setSlots] = useState<Record<string, number>>(() => {
    if (displayed.length === 3) {
      return {
        [displayed[1].title]: 0, // Left: ElecSys
        [displayed[0].title]: 1, // Center: Tezā (starts active in middle)
        [displayed[2].title]: 2, // Right: AccSys
      };
    }
    return Object.fromEntries(displayed.map((p, i) => [p.title, i]));
  });

  const selectorRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const prevPositionsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (activeIndex >= displayed.length && displayed.length > 0) setActiveIndex(0);
  }, [activeIndex, displayed.length]);

  useEffect(() => {
    if (displayed.length === 3) {
      const keys = Object.keys(slots);
      const matches = displayed.every((p) => keys.includes(p.title));
      if (!matches) {
        setSlots({
          [displayed[1].title]: 0,
          [displayed[0].title]: 1,
          [displayed[2].title]: 2,
        });
      }
    }
  }, [displayed, slots]);

  // Handle direct 3-slot swap when selector item is clicked
  const handleSelectorClick = (targetIndex: number) => {
    const targetProject = displayed[targetIndex];
    if (!targetProject) return;

    const currentSlot = slots[targetProject.title] ?? targetIndex;
    if (currentSlot === 1 && activeIndex === targetIndex) return;

    // 1. Snapshot previous horizontal positions for FLIP animation
    const positions = new Map<string, number>();
    selectorRefs.current.forEach((el, key) => {
      if (el) {
        positions.set(key, el.getBoundingClientRect().left);
      }
    });
    prevPositionsRef.current = positions;

    // 2. Swap clicked project with the center slot (slot 1)
    if (displayed.length === 3) {
      const nextSlots = { ...slots };
      const centerTitle = Object.keys(nextSlots).find((k) => nextSlots[k] === 1);
      if (centerTitle && centerTitle !== targetProject.title) {
        nextSlots[centerTitle] = currentSlot;
      }
      nextSlots[targetProject.title] = 1;
      setSlots(nextSlots);
    }

    setActiveIndex(targetIndex);
  };

  // FLIP layout animation: smooth gliding swap between selector slots
  useLayoutEffect(() => {
    const prev = prevPositionsRef.current;
    if (!prev.size) return;
    prevPositionsRef.current = new Map();

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    selectorRefs.current.forEach((el, title) => {
      if (!el) return;
      const oldLeft = prev.get(title);
      if (oldLeft === undefined) return;

      const newLeft = el.getBoundingClientRect().left;
      const deltaX = oldLeft - newLeft;

      if (Math.abs(deltaX) > 0.5) {
        el.style.transform = `translateX(${deltaX}px)`;
        el.style.transition = "none";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
            el.style.transform = "translateX(0px)";
          });
        });
      }
    });
  }, [slots]);

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
            <span className="dashboard-eyebrow">My Works</span>
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
        <div
          className="project-theme dashboard-featured-projects"
          style={activeProject ? getProjectThemeStyle(activeProject.theme) : undefined}
        >
          <div className="dashboard-featured-projects__glow" aria-hidden="true" />

          <div className="dashboard-featured-projects__selector" role="list" aria-label="Featured projects">
            {displayed.map((project, index) => (
              <button
                key={project.title}
                ref={(el) => {
                  if (el) selectorRefs.current.set(project.title, el);
                  else selectorRefs.current.delete(project.title);
                }}
                type="button"
                className="project-theme dashboard-featured-projects__selector-item"
                style={{
                  ...getProjectThemeStyle(project.theme),
                  order: slots[project.title] ?? index,
                }}
                data-project-selector
                data-active={index === activeIndex}
                aria-pressed={index === activeIndex}
                onClick={() => handleSelectorClick(index)}
              >
                <span className="dashboard-featured-projects__selector-logo">
                  {project.logo ? <img src={project.logo} alt="" /> : null}
                </span>
                <span>{project.title}</span>
              </button>
            ))}
          </div>

          {activeProject && (
            <article
              className="project-theme dashboard-featured-projects__detail"
              style={getProjectThemeStyle(activeProject.theme)}
              data-featured-project-detail
            >
              <div
                key={activeProject.title}
                className="dashboard-featured-projects__detail-main dashboard-featured-projects__detail-main--animate"
              >
                {activeProject.details?.heroImage && (
                  <div className="dashboard-featured-projects__detail-art">
                    <img src={activeProject.details.heroImage} alt={`${activeProject.title} project preview`} />
                  </div>
                )}
                <div className="dashboard-featured-projects__detail-copy">
                  <div className="dashboard-featured-projects__detail-heading">
                    <div className="dashboard-featured-projects__detail-meta">
                      <span className="dashboard-eyebrow">Selected project</span>
                      {activeProject.details?.year && (
                        <span className="dashboard-eyebrow">{activeProject.details.year}</span>
                      )}
                    </div>
                    <h3>{activeProject.title}</h3>
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
