import { ArrowUpRight, ChevronRight, Copy, Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Project } from "@/data/types";

interface ProjectsProps {
  projects: Project[];
  limit?: number;
  showViewAll?: boolean;
  compact?: boolean;
  hideTitle?: boolean;
  variant?: "stack" | "grid";
}

export default function Projects({
  projects,
  limit,
  showViewAll,
  compact,
  hideTitle,
  variant,
}: ProjectsProps) {
  const isGridView = variant === "grid" || hideTitle || compact;
  const effectiveLimit = limit ?? (isGridView ? undefined : 3);
  const displayed = effectiveLimit ? projects.slice(0, effectiveLimit) : projects;
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = async (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="h-full flex flex-col justify-between">
      <div>
        {!hideTitle && (
          <div className="flex justify-between items-center border-b border-border pb-2 mb-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
              [ SECTION 04 // FEATURED PROJECTS ]
            </h3>
            {showViewAll && (
              <Link
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center uppercase tracking-wider group"
                to="/projects"
              >
                ALL PROJECTS
                <ChevronRight className="size-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs text-muted-foreground">
            NO PROJECTS RECORDED.
          </div>
        ) : isGridView ? (
          /* Grid View Layout (used on /projects page or when grid variant specified) */
          <div className={`grid grid-cols-1 ${compact ? "" : "md:grid-cols-2"} gap-4`}>
            {displayed.map((project) => {
              const Icon = project.icon;
              const isCopied = copiedUrl === project.url;
              const hasHeroImage = project.details?.heroImage;

              const cardContent = (
                <div className="flex flex-col h-full justify-between p-4 bg-card border border-border hover:border-foreground transition-colors group">
                  <div>
                    {hasHeroImage ? (
                      <div className="w-full h-36 overflow-hidden border border-border mb-3 bg-background relative">
                        <img
                          src={project.details!.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover newspaper-photo"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 border border-border flex items-center justify-center bg-background mb-3">
                        <Icon className="size-4 text-foreground" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-serif font-bold text-lg text-foreground group-hover:underline underline-offset-2">
                        {project.title}
                      </h4>
                      <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2" />
                    </div>

                    <p className="text-xs text-muted-foreground font-sans line-clamp-2 mb-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between gap-2 mt-2">
                    <code className="text-[11px] font-mono text-muted-foreground truncate flex-1">
                      {project.url}
                    </code>
                    <button
                      onClick={(e) => copyToClipboard(project.url, e)}
                      className="p-1 border border-border hover:border-foreground transition-colors shrink-0"
                      aria-label="Copy URL"
                      title={isCopied ? "Copied!" : "Copy URL"}
                    >
                      {isCopied ? (
                        <Check className="size-3 text-foreground" />
                      ) : (
                        <Copy className="size-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              );

              return project.slug && project.details ? (
                <Link key={project.title} to={`/projects/${project.slug}`}>
                  {cardContent}
                </Link>
              ) : (
                <div key={project.title}>{cardContent}</div>
              );
            })}
          </div>
        ) : (
          /* Interactive 3D Fanned Stack Layout */
          <div className="relative py-8 md:py-12 my-2 flex flex-col items-center">
            {/* Stack Container */}
            <div className="relative w-full max-w-xl h-[440px] md:h-[460px] flex items-center justify-center perspective-[1000px] select-none">
              {displayed.map((project, idx) => {
                const total = displayed.length;
                // Calculate position relative to active index
                const diff = (idx - activeIndex + total) % total;

                // Assign positions: 0 = center, 1 = right, total-1 = left
                let position: "center" | "left" | "right" | "back" = "back";
                if (diff === 0) position = "center";
                else if (diff === 1) position = "right";
                else if (diff === total - 1) position = "left";

                const Icon = project.icon;
                const isCopied = copiedUrl === project.url;
                const hasHeroImage = project.details?.heroImage;
                const techs = project.details?.techs || [];

                // Styling variations per position
                let transformStyle = "";
                let zIndex = 0;
                let opacity = "opacity-0 pointer-events-none";
                let cursor = "";

                if (position === "center") {
                  transformStyle = "translate3d(0, 0, 0) rotate(0deg) scale(1)";
                  zIndex = 30;
                  opacity = "opacity-100 shadow-2xl shadow-black/20 dark:shadow-black/70 border-foreground/40";
                  cursor = "cursor-default";
                } else if (position === "left") {
                  transformStyle = "translate3d(-34%, 10px, -30px) rotate(-8deg) scale(0.9)";
                  zIndex = 10;
                  opacity = "opacity-85 hover:opacity-100 hover:scale-[0.92] hover:-translate-x-[36%] border-border hover:border-foreground/50 transition-all duration-300";
                  cursor = "cursor-pointer";
                } else if (position === "right") {
                  transformStyle = "translate3d(34%, 10px, -30px) rotate(8deg) scale(0.9)";
                  zIndex = 10;
                  opacity = "opacity-85 hover:opacity-100 hover:scale-[0.92] hover:translate-x-[36%] border-border hover:border-foreground/50 transition-all duration-300";
                  cursor = "cursor-pointer";
                } else {
                  transformStyle = "translate3d(0, 24px, -80px) rotate(0deg) scale(0.8)";
                  zIndex = 0;
                  opacity = "opacity-0 pointer-events-none";
                }

                return (
                  <div
                    key={project.title}
                    onClick={() => {
                      if (position !== "center") {
                        setActiveIndex(idx);
                      }
                    }}
                    style={{
                      transform: transformStyle,
                      zIndex: zIndex,
                    }}
                    className={`absolute inset-x-0 mx-auto w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] bg-card border transition-all duration-500 ease-out p-5 flex flex-col justify-between h-[420px] md:h-[440px] ${opacity} ${cursor}`}
                  >
                    <div>
                      {/* Top Tech Badges Bar */}
                      <div className="flex items-center justify-between gap-2 mb-3 overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {techs.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 border border-border bg-background/80 text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest shrink-0 font-bold">
                          0{idx + 1} / 0{total}
                        </span>
                      </div>

                      {/* Hero Image or Icon */}
                      {hasHeroImage ? (
                        <div className="w-full h-40 sm:h-44 overflow-hidden border border-border mb-3.5 bg-background relative group">
                          <img
                            src={project.details!.heroImage}
                            alt={project.title}
                            className="w-full h-full object-cover newspaper-photo"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 border border-border flex items-center justify-center bg-background mb-3.5">
                          <Icon className="size-5 text-foreground" />
                        </div>
                      )}

                      {/* Title & Description */}
                      <h4 className="font-serif font-bold text-xl md:text-2xl text-foreground mb-1.5 line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-sans line-clamp-2 leading-relaxed mb-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                      {project.slug && project.details ? (
                        <Link
                          to={`/projects/${project.slug}`}
                          onClick={(e) => {
                            // Ensure click triggers navigation if it's the center card
                            if (position !== "center") {
                              e.preventDefault();
                              setActiveIndex(idx);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground/80 transition-colors shrink-0"
                        >
                          MORE DETAILS
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">IN DEVELOPMENT</span>
                      )}

                      {/* Right-aligned URL / Copy controls */}
                      <div className="flex items-center gap-2 max-w-[150px]">
                        {project.url && project.url.startsWith("http") ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 border border-border hover:border-foreground transition-colors shrink-0 text-muted-foreground hover:text-foreground"
                            aria-label="Open project website"
                            title="Visit Website"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : null}
                        <button
                          onClick={(e) => copyToClipboard(project.url, e)}
                          className="p-1.5 border border-border hover:border-foreground transition-colors shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Copy URL"
                          title={isCopied ? "Copied!" : "Copy URL"}
                        >
                          {isCopied ? (
                            <Check className="size-3.5 text-foreground" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Stack Indicators */}
            <div className="flex items-center gap-2 mt-4">
              {displayed.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-8 bg-foreground"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}