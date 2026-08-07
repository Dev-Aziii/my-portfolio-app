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
      {/* Hero Image */}
      <div className="animate-fade-in-up rounded-xl overflow-hidden mb-4 shadow-sm border border-border-light dark:border-border-dark" style={{ animationDelay: '480ms' }}>
        <img
          src={details.heroImage}
          alt={project.title}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Project Description under Hero */}
      <p className="animate-fade-in-up text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm mb-8" style={{ animationDelay: '600ms' }}>
        {project.description}
      </p>

      {/* Tech Stack & Link */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '720ms' }}>
        {project.url !== "#" && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors mb-4"
          >
            <ExternalLink className="size-4" />
            View Project
          </a>
        )}
        <div className="flex flex-wrap gap-2">
          {details.techs.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm font-medium bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark rounded-full border border-border-light dark:border-border-dark"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* The Gist */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '840ms' }}>
        <h2 className="text-xl font-bold text-text-light dark:text-white mb-3">
          {details.gist.title}
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm">
          {details.gist.description}
        </p>
      </section>

      {/* The Problem */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '960ms' }}>
        <h2 className="text-xl font-bold text-text-light dark:text-white mb-3">
          {details.problem.title}
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm">
          {details.problem.description}
        </p>
      </section>

      {/* The Solution */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '1080ms' }}>
        <h2 className="text-xl font-bold text-text-light dark:text-white mb-3">
          {details.solution.title}
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm">
          {details.solution.description}
        </p>
      </section>

      {/* Additional Images Carousel */}
      {details.additionalImages && details.additionalImages.length > 0 && (
        <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
          <h2 className="text-xl font-bold text-text-light dark:text-white mb-4">
            Project Gallery
          </h2>
          <div className="relative">
            {/* Main Image Container */}
            <div
              onClick={() => setLightboxIndex(currentIndex)}
              className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
            >
              <img
                src={details.additionalImages[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 p-3 rounded-full text-white backdrop-blur-xs shadow-lg">
                  <Maximize2 className="size-6" />
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-light/90 dark:bg-surface-dark/90 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors shadow-sm border border-border-light dark:border-border-dark cursor-pointer z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5 text-text-light dark:text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-light/90 dark:bg-surface-dark/90 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors shadow-sm border border-border-light dark:border-border-dark cursor-pointer z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5 text-text-light dark:text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium z-10">
                {currentIndex + 1} / {details.additionalImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {details.additionalImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {details.additionalImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      index === currentIndex
                        ? "border-text-light dark:border-white"
                        : "border-transparent hover:border-border-light dark:hover:border-border-dark"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-24 h-16 object-cover"
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