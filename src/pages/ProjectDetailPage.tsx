import { useParams, Navigate } from "react-router-dom";
import { ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Lightbox from "@/components/Lightbox";
import { projects } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";
import { formatDemoLabel, isValidHttpUrl } from "@/lib/utils";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function ProjectDetailPage() {
  usePageTitle("Project Details | Adzyl Jipos");
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project || !project.details) {
    return <Navigate to="/projects" replace />;
  }

  const { details } = project;
  const gallery = [details.heroImage, ...(details.additionalImages ?? [])];

  const goToPrevious = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gallery.length - 1 : prevIndex - 1
    );

  const goToNext = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
    );

  const goToSlide = (index: number) => setCurrentIndex(index);

  const hasValidUrl = isValidHttpUrl(project.url);

  const plateLabel =
    currentIndex === 0
      ? "PRIMARY INTERFACE DEMONSTRATION"
      : "SUPPLEMENTARY EXHIBIT";

  return (
    <PageLayout
      title={project.title}
      logo={project.logo}
      icon={project.icon}
      backTo="/projects"
      backLabel="Back to Projects"
    >
      {/* Classic Archival Hero Gallery */}
      <div className="relative border-2 border-border p-3 sm:p-4 bg-card mb-6 shadow-sm">
        {/* Corner Cross Ornaments */}
        <span className="absolute top-1 left-1.5 text-muted-foreground/60 text-xs font-mono select-none pointer-events-none">+</span>
        <span className="absolute top-1 right-1.5 text-muted-foreground/60 text-xs font-mono select-none pointer-events-none">+</span>
        <span className="absolute bottom-1 left-1.5 text-muted-foreground/60 text-xs font-mono select-none pointer-events-none">+</span>
        <span className="absolute bottom-1 right-1.5 text-muted-foreground/60 text-xs font-mono select-none pointer-events-none">+</span>

        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {/* Main Image Container */}
          <div
            onClick={() => setLightboxIndex(currentIndex)}
            className="relative flex-1 group cursor-pointer border border-border bg-background p-3 sm:p-4 flex items-center justify-center min-h-[340px] sm:min-h-[420px] max-h-[480px] overflow-hidden"
          >
            <img
              src={gallery[currentIndex]}
              alt={`${project.title} ${currentIndex + 1}`}
              className="w-auto h-auto max-w-full max-h-80 sm:max-h-[420px] object-contain newspaper-photo transition-transform duration-300 group-hover:scale-[1.01]"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border px-3.5 py-1.5 font-mono text-xs text-foreground shadow-md">
                <Maximize2 className="size-4 inline mr-1.5" /> EXPAND EXHIBIT
              </div>
            </div>

            {/* Circular Navigation Arrow Buttons */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 size-10 rounded-full border border-border bg-background/90 text-foreground hover:bg-card hover:scale-105 transition-all flex items-center justify-center cursor-pointer z-10 shadow-xs"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 size-10 rounded-full border border-border bg-background/90 text-foreground hover:bg-card hover:scale-105 transition-all flex items-center justify-center cursor-pointer z-10 shadow-xs"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>

          {/* Film Strip Thumbnail Selector */}
          {gallery.length > 1 && (
            <>
              {/* Vertical film strip on desktop */}
              <div className="hidden lg:flex flex-col border border-border bg-background/60 p-2 shrink-0 w-44 justify-between select-none">
                <div className="flex flex-1 gap-2 overflow-hidden py-1">
                  {/* Left Sprocket Holes */}
                  <div className="flex flex-col justify-between items-center py-1 shrink-0 gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="size-2 rounded-[1px] bg-border border border-muted-foreground/30 shrink-0" />
                    ))}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
                    {gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative shrink-0 border-2 transition-all cursor-pointer ${
                          index === currentIndex
                            ? "border-foreground shadow-xs"
                            : "border-border/80 hover:border-muted-foreground opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-16 w-full object-cover newspaper-photo"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-background/90 border border-border font-mono text-[9px] font-bold text-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Sprocket Holes */}
                  <div className="flex flex-col justify-between items-center py-1 shrink-0 gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="size-2 rounded-[1px] bg-border border border-muted-foreground/30 shrink-0" />
                    ))}
                  </div>
                </div>

                {/* Star Ornament Footer */}
                <div className="pt-2 border-t border-border flex items-center justify-center text-muted-foreground text-[10px] font-mono tracking-widest gap-2">
                  <span>—</span>
                  <span>★</span>
                  <span>—</span>
                </div>
              </div>

              {/* Horizontal strip on mobile */}
              <div className="flex lg:hidden gap-2 overflow-x-auto p-2 border border-border bg-background/60">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative shrink-0 border-2 transition-all cursor-pointer ${
                      index === currentIndex
                        ? "border-foreground"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-24 h-16 object-cover newspaper-photo"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-background/90 border border-border font-mono text-[9px] font-bold text-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom Archival Status Bar & Exhibit Stamp */}
        <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider text-center sm:text-left flex items-center gap-1.5">
            <span className="hidden sm:inline text-border">— •</span>
            <span>
              PLATE {ROMAN_NUMERALS[Math.min(currentIndex, ROMAN_NUMERALS.length - 1)]}: {plateLabel} — {project.title}
            </span>
            <span className="hidden sm:inline text-border">• —</span>
          </div>

          <div className="border-2 border-border px-3 py-1 bg-background font-mono text-xs font-bold uppercase tracking-widest text-foreground shrink-0 flex items-center gap-1.5">
            <span>EXHIBIT</span>
            <span className="text-muted-foreground">{currentIndex + 1} / {gallery.length}</span>
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        <Lightbox
          images={gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => {
            setLightboxIndex(index);
            setCurrentIndex(index);
          }}
        />
      </div>

      {/* Project Description under Hero */}
      <p className="text-base text-foreground leading-relaxed font-sans mb-8">
        {project.description}
      </p>

      {/* Tech Stack & Link */}
      <div className="mb-8 border-t border-b border-border py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {details.techs.map((tech) => (
              <span key={tech} className="mono-tag">
                {tech}
              </span>
            ))}
          </div>

          {hasValidUrl ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground hover:underline border border-border px-3 py-1 bg-background"
            >
              <ExternalLink className="size-3.5" />
              VISIT PROJECT DEMO
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground border border-border px-3 py-1 bg-background cursor-default"
              title={formatDemoLabel(project.url)}
            >
              <span className="size-3.5 inline-block rounded-full border border-muted-foreground/60" />
              {formatDemoLabel(project.url)}
            </span>
          )}
        </div>
      </div>

      {/* The Problem */}
      <section className="mb-8 border-b border-border pb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
          [ 01 — PROBLEM ]
        </h3>
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">
          {details.problem.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {details.problem.description}
        </p>
      </section>

      {/* The Solution */}
      <section className="mb-8 border-b border-border pb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
          [ 02 — SOLUTION ]
        </h3>
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">
          {details.solution.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {details.solution.description}
        </p>
      </section>

      {/* The Impact */}
      <section className="mb-8 border-b border-border pb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
          [ 03 — IMPACT ]
        </h3>
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">
          {details.impact.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {details.impact.description}
        </p>
      </section>
    </PageLayout>
  );
}