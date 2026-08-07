import { useParams, Navigate } from "react-router-dom";
import { ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Lightbox from "@/components/Lightbox";
import { projects } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

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

  const goToPrevious = () => {
    if (details.additionalImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? details.additionalImages!.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (details.additionalImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === details.additionalImages!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <PageLayout title={project.title} backTo="/projects" backLabel="Back to Projects">
      {/* Hero Image in printed newspaper framing */}
      <div className="border border-border p-2 bg-card mb-6">
        <div className="w-full overflow-hidden border border-border">
          <img
            src={details.heroImage}
            alt={project.title}
            className="w-full h-auto object-contain newspaper-photo"
          />
        </div>
        <p className="font-mono text-xs text-muted-foreground mt-2 text-center uppercase">
          PLATE I: PRIMARY INTERFACE DEMONSTRATION — {project.title}
        </p>
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

          {project.url !== "#" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-foreground hover:underline border border-border px-3 py-1 bg-background"
            >
              <ExternalLink className="size-3.5" />
              VISIT PROJECT DEMO
            </a>
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

      {/* Additional Images Carousel */}
      {details.additionalImages && details.additionalImages.length > 0 && (
        <section className="mb-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">
            [ 04 — GALLERY ]
          </h3>
          <div className="relative">
            {/* Main Image Container */}
            <div
              onClick={() => setLightboxIndex(currentIndex)}
              className="relative group cursor-pointer border border-border bg-card p-2"
            >
              <div className="w-full h-[400px] sm:h-[500px] overflow-hidden border border-border">
                <img
                  src={details.additionalImages[currentIndex]}
                  alt={`Slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover newspaper-photo"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border px-3 py-1 font-mono text-xs text-foreground">
                  <Maximize2 className="size-4 inline mr-1" /> EXPAND EXHIBIT
                </div>
              </div>

              {/* Navigation Buttons */}
              {details.additionalImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background border border-border text-foreground hover:bg-card transition-colors cursor-pointer z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background border border-border text-foreground hover:bg-card transition-colors cursor-pointer z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-2 py-0.5 bg-background border border-border font-mono text-[11px] text-foreground z-10">
                EXHIBIT {currentIndex + 1} / {details.additionalImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {details.additionalImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {details.additionalImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`shrink-0 border p-1 bg-card transition-all cursor-pointer ${
                      index === currentIndex
                        ? "border-foreground"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-14 object-cover newspaper-photo"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Lightbox Modal */}
          <Lightbox
            images={details.additionalImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(index) => {
              setLightboxIndex(index);
              setCurrentIndex(index);
            }}
          />
        </section>
      )}
    </PageLayout>
  );
}