import { ArrowUpRight, ChevronRight, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { Project } from "@/data/types";

interface ProjectsProps {
  projects: Project[];
  limit?: number;
  showViewAll?: boolean;
  compact?: boolean;
  hideTitle?: boolean;
}

export default function Projects({
  projects,
  limit,
  showViewAll,
  compact,
  hideTitle,
}: ProjectsProps) {
  const displayed = limit ? projects.slice(0, limit) : projects;
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
          <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
              [ SECTION 04 // FEATURED PROJECTS ]
            </h3>
            {showViewAll && (
              <Link
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center uppercase tracking-wider"
                to="/projects"
              >
                VIEW ALL
                <ChevronRight className="size-3.5 ml-0.5" />
              </Link>
            )}
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs text-muted-foreground">
            NO PROJECTS RECORDED.
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}