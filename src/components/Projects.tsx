import { ArrowUpRight, Copy, Check, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Project } from "@/data/types";
import { formatDemoLabel, isValidHttpUrl } from "@/lib/utils";

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

  // Keep active index safely within bounds if projects change
  useEffect(() => {
    if (activeIndex >= displayed.length && displayed.length > 0) {
      setActiveIndex(0);
    }
  }, [displayed.length, activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayed.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayed.length - 1 ? 0 : prev + 1));
  };

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

  const activeProject = displayed[activeIndex] || displayed[0];

  return (
    <section className="h-full flex flex-col justify-between">
      <div>
        {/* Header Section */}
        {!hideTitle && (
          <div className="flex justify-between items-center border-b border-border dark:border-cyan-500/20 pb-3 mb-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground dark:text-cyan-400 font-bold flex items-center gap-2">
              [ SECTION 04 // PROJECTS ]
            </h3>
            {showViewAll && (
              <Link
                className="font-mono text-xs text-muted-foreground dark:text-cyan-400/80 hover:text-foreground dark:hover:text-cyan-300 transition-colors flex items-center uppercase tracking-wider group"
                to="/projects"
              >
                VIEW ALL PROJECTS
                <ArrowUpRight className="size-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs text-muted-foreground dark:text-cyan-400/60 border border-border dark:border-cyan-500/20">
            NO PROJECTS RECORDED.
          </div>
        ) : isGridView ? (
          /* Grid View Layout (used on /projects page) */
          <div className={`grid grid-cols-1 ${compact ? "" : "md:grid-cols-2 lg:grid-cols-3"} gap-5`}>
            {displayed.map((project) => {
              const Icon = project.icon;
              const isCopied = copiedUrl === project.url;
              const hasHeroImage = project.details?.heroImage;
              const hasValidUrl = isValidHttpUrl(project.url);

              const cardContent = (
                <div className="flex flex-col h-full justify-between p-5 bg-card dark:bg-[#081220]/90 border border-border dark:border-cyan-500/25 hover:border-foreground dark:hover:border-cyan-400/80 dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all group hud-corners">
                  <div>
                    {hasHeroImage ? (
                      <div className="w-full h-44 overflow-hidden border border-border dark:border-cyan-500/30 mb-4 bg-background dark:bg-slate-950 relative">
                        <img
                          src={project.details!.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover newspaper-photo"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 border border-border dark:border-cyan-500/30 flex items-center justify-center bg-background dark:bg-slate-950 mb-4">
                        <Icon className="size-5 text-foreground dark:text-cyan-400" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif font-bold text-xl text-foreground dark:text-white group-hover:underline dark:group-hover:text-cyan-300 underline-offset-4">
                        {project.title}
                      </h4>
                      <ArrowUpRight className="size-4 text-muted-foreground dark:text-cyan-400/70 group-hover:text-foreground dark:group-hover:text-cyan-300 transition-colors shrink-0 ml-2" />
                    </div>

                    <p className="text-xs text-muted-foreground dark:text-slate-300 font-sans line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border dark:border-cyan-500/20 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5 overflow-hidden max-w-[70%]">
                      {project.details?.techs?.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 bg-background dark:bg-[#091526] border border-border dark:border-cyan-500/30 text-foreground dark:text-cyan-200 shrink-0"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {hasValidUrl ? (
                      <button
                        onClick={(e) => copyToClipboard(project.url, e)}
                        className="p-1.5 border border-border dark:border-cyan-500/30 hover:border-foreground dark:hover:border-cyan-400 transition-colors shrink-0 text-muted-foreground dark:text-cyan-400"
                        aria-label="Copy URL"
                        title={isCopied ? "Copied!" : "Copy URL"}
                      >
                        {isCopied ? (
                          <Check className="size-3.5 text-foreground dark:text-cyan-300" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    ) : (
                      <span
                        className="p-1.5 border border-border dark:border-cyan-500/30 shrink-0 max-w-[45%] inline-flex items-center justify-center cursor-default"
                        title={formatDemoLabel(project.url)}
                      >
                        <span className="font-mono text-[10px] uppercase font-semibold text-muted-foreground dark:text-cyan-400/70 tracking-wider truncate">
                          {formatDemoLabel(project.url)}
                        </span>
                      </span>
                    )}
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
          /* Split Featured Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Selector List Column */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {/* List Cards */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 sm:pb-0 no-scrollbar">
                {displayed.map((project, idx) => {
                  const isActive = idx === activeIndex;
                  const Icon = project.icon;
                  const primaryTech = project.details?.techs?.[0] || "Project";
                  const numberFormatted = String(idx + 1).padStart(2, "0");

                  return (
                    <div
                      key={project.title}
                      onClick={() => setActiveIndex(idx)}
                      className={`cursor-pointer transition-all duration-200 p-4 border relative flex-1 min-w-[240px] sm:min-w-[260px] lg:min-w-0 ${
                        isActive
                          ? "bg-card dark:bg-[#0b172a] border-2 border-foreground dark:border-cyan-400 shadow-sm dark:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                          : "bg-card/50 dark:bg-[#07111e]/70 border border-border dark:border-cyan-500/20 hover:border-foreground/60 dark:hover:border-cyan-400/50 hover:bg-card dark:hover:bg-[#091526]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Number Badge & Vertical Indicator */}
                        <div className="flex flex-col items-center shrink-0">
                          <span
                            className={`font-mono text-xs font-bold ${
                              isActive
                                ? "text-foreground dark:text-cyan-300"
                                : "text-muted-foreground dark:text-cyan-500/60"
                            }`}
                          >
                            {numberFormatted}
                          </span>
                          <div
                            className={`w-1 h-6 mt-1 transition-colors ${
                              isActive
                                ? "bg-foreground dark:bg-cyan-400 dark:shadow-[0_0_6px_rgba(0,240,255,0.8)]"
                                : "bg-border dark:bg-cyan-900/40"
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {isActive && project.details?.heroImage && (
                            <div className="w-full h-28 overflow-hidden border border-border dark:border-cyan-500/30 mb-2.5 bg-background dark:bg-slate-950 relative">
                              <img
                                src={project.details.heroImage}
                                alt={project.title}
                                className="w-full h-full object-cover newspaper-photo"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <h4
                              className={`font-serif font-bold text-base truncate ${
                                isActive
                                  ? "text-foreground dark:text-white underline underline-offset-2"
                                  : "text-muted-foreground dark:text-slate-400"
                              }`}
                            >
                              {project.title}
                            </h4>
                            <ArrowUpRight
                              className={`size-4 shrink-0 transition-colors ${
                                isActive
                                  ? "text-foreground dark:text-cyan-300"
                                  : "text-muted-foreground/60 dark:text-cyan-600"
                              }`}
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-border dark:border-cyan-500/30 bg-background dark:bg-[#091526] text-foreground dark:text-cyan-300 flex items-center gap-1">
                              <Icon className="size-3 text-foreground dark:text-cyan-400" />
                              {primaryTech}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scroll / Nav Controls */}
              <div className="hidden lg:flex items-center gap-3 pt-2 px-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 border border-border dark:border-cyan-500/30 bg-background dark:bg-[#081220] hover:bg-foreground hover:text-background dark:hover:bg-cyan-950/60 dark:hover:border-cyan-400 dark:hover:text-cyan-300 transition-colors text-foreground dark:text-cyan-400 font-mono"
                    aria-label="Previous project"
                    title="Previous project"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 border border-border dark:border-cyan-500/30 bg-background dark:bg-[#081220] hover:bg-foreground hover:text-background dark:hover:bg-cyan-950/60 dark:hover:border-cyan-400 dark:hover:text-cyan-300 transition-colors text-foreground dark:text-cyan-400 font-mono"
                    aria-label="Next project"
                    title="Next project"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
                <span className="font-mono text-xs text-muted-foreground dark:text-cyan-400/60 uppercase tracking-wider font-semibold">
                  Scroll to explore
                </span>
              </div>
            </div>

            {/* Right Featured Project Panel */}
            {activeProject && (
              <div className="lg:col-span-8 bg-card dark:bg-[#081220]/90 border-2 border-border dark:border-cyan-500/30 p-5 sm:p-7 flex flex-col justify-between shadow-sm dark:shadow-[0_0_25px_rgba(0,240,255,0.06)] hud-corners">
                <div>
                  {/* Top Featured Tag & Meta Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border dark:border-cyan-500/20">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 border border-border dark:border-cyan-400/80 bg-foreground dark:bg-cyan-950/80 text-background dark:text-cyan-300 flex items-center gap-1.5 dark:shadow-[0_0_10px_rgba(0,240,255,0.25)]">
                      <span className="w-1.5 h-1.5 bg-background dark:bg-cyan-400 dark:shadow-[0_0_4px_rgba(0,240,255,0.9)]" />
                      FEATURED PROJECT
                    </span>

                    {/* Metadata (vX.X • YYYY) */}
                    {(activeProject.details?.version || activeProject.details?.year) && (
                      <span className="font-mono text-xs text-muted-foreground dark:text-cyan-400/80 uppercase tracking-wider font-bold">
                        {activeProject.details?.version && `• ${activeProject.details.version}`}
                        {activeProject.details?.year && ` • ${activeProject.details.year}`}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {activeProject.logo ? (
                          <div className="size-9 sm:size-10 shrink-0 border border-border dark:border-cyan-500/30 p-1 bg-background dark:bg-[#091526] flex items-center justify-center shadow-xs">
                            <img
                              src={activeProject.logo}
                              alt={`${activeProject.title} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : activeProject.icon ? (
                          <div className="size-9 sm:size-10 shrink-0 border border-border dark:border-cyan-500/30 p-1.5 bg-background dark:bg-[#091526] flex items-center justify-center text-foreground dark:text-cyan-400 shadow-xs">
                            <activeProject.icon className="w-full h-full" />
                          </div>
                        ) : null}
                        <h3 className="font-serif font-bold text-3xl sm:text-4xl text-foreground dark:text-white tracking-tight">
                          {activeProject.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground dark:text-slate-300 font-sans leading-relaxed mt-3">
                        {activeProject.description}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground dark:text-cyan-400 block mb-2 font-bold">
                        TECH STACK
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.details?.techs?.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-xs px-2.5 py-1 border border-border dark:border-cyan-500/30 bg-background dark:bg-[#091526] text-foreground dark:text-cyan-200 font-semibold uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  {activeProject.details?.highlights && activeProject.details.highlights.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-border dark:border-cyan-500/20">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground dark:text-cyan-400 block mb-3 font-bold">
                        KEY HIGHLIGHTS
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {activeProject.details.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground dark:text-slate-200 font-mono">
                            <span className="w-1.5 h-1.5 bg-foreground dark:bg-cyan-400 shrink-0 mt-1.5 inline-block dark:shadow-[0_0_4px_rgba(0,240,255,0.8)]" />
                            <span>{highlight.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Impact / Metrics Grid */}
                  {activeProject.details?.metrics && activeProject.details.metrics.length > 0 && (
                    <div className="mt-6 pt-5 border-t-2 border-border dark:border-cyan-500/20">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {activeProject.details.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-background dark:bg-[#07111e] border border-border dark:border-cyan-500/25 hover:border-foreground dark:hover:border-cyan-400/60 transition-colors"
                          >
                            <div className="font-mono font-bold text-xl sm:text-2xl text-foreground dark:text-cyan-300">
                              {metric.value}
                            </div>
                            <div className="font-mono text-[10px] text-muted-foreground dark:text-cyan-400/60 uppercase tracking-wider mt-0.5 truncate">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom CTA Bar */}
                  <div className="mt-6 pt-5 border-t border-border dark:border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
                    {activeProject.slug && activeProject.details ? (
                      <Link
                        to={`/projects/${activeProject.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground dark:bg-cyan-950/60 text-background dark:text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground/80 dark:hover:bg-cyan-900/80 transition-all border border-foreground dark:border-cyan-400 dark:shadow-[0_0_14px_rgba(0,240,255,0.25)]"
                      >
                        MORE DETAILS
                        <ArrowUpRight className="size-4" />
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground dark:text-cyan-400/60 bg-background dark:bg-[#091526] px-4 py-2 border border-border dark:border-cyan-500/30">
                        IN DEVELOPMENT
                      </span>
                    )}

                    {isValidHttpUrl(activeProject.url) ? (
                      <a
                        href={activeProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-background dark:bg-[#0a1526] hover:bg-foreground hover:text-background dark:hover:bg-cyan-950/40 dark:hover:border-cyan-400/70 dark:hover:text-cyan-200 border border-border dark:border-cyan-900/60 transition-colors font-mono text-xs font-bold text-foreground dark:text-slate-200"
                        title="Open Live Site"
                      >
                        <ExternalLink className="size-3.5 text-foreground dark:text-cyan-400" />
                        VISIT DEMO
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-background dark:bg-[#0a1526] border border-border dark:border-cyan-900/60 font-mono text-xs font-bold text-muted-foreground dark:text-cyan-400/60 cursor-default"
                        title={formatDemoLabel(activeProject.url)}
                      >
                        <span className="size-3.5 inline-block rounded-full border border-muted-foreground/60 dark:border-cyan-500/40" />
                        {formatDemoLabel(activeProject.url)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}