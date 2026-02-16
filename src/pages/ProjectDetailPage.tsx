import { useParams, Navigate } from "react-router-dom";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { projects } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function ProjectDetailPage() {
  usePageTitle("Project Details | Adzyl Jipos");
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div className="animate-fade-in-up style={{ animationDelay: '480ms' }} rounded-xl overflow-hidden mb-4 shadow-sm border border-border-light dark:border-border-dark">
        <img
          src={details.heroImage}
          alt={project.title}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Project Description under Hero */}
      <p className="animate-fade-in-up style={{ animationDelay: '600ms' }}text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm mb-8">
    {project.description}
      </p>

      {/* Tech Stack & Link */}
      <div className="mb-8 animate-fade-in-up style={{ animationDelay: '720ms' }}">
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
      <section className="mb-10 animate-fade-in-up style={{ animationDelay: '840ms' }}">
        <h2 className="text-xl font-bold text-text-light dark:text-white mb-3">
          {details.gist.title}
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm">
          {details.gist.description}
        </p>
      </section>

      {/* The Problem */}
      <section className="mb-10 animate-fade-in-up style={{ animationDelay: '960ms' }}">
        <h2 className="text-xl font-bold text-text-light dark:text-white mb-3">
          {details.problem.title}
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm">
          {details.problem.description}
        </p>
      </section>

      {/* The Solution */}
      <section className="mb-10 animate-fade-in-up style={{ animationDelay: '1080ms' }}">
        <h2 className="text-xl font-bold text-text-light dark:text-white mb-3">
          {details.solution.title}
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark leading-relaxed text-sm">
          {details.solution.description}
        </p>
      </section>

      {/* Additional Images Carousel */}
      {details.additionalImages && details.additionalImages.length > 0 && (
        <section className="mb-10 animate-fade-in-up style={{ animationDelay: '1200ms' }}">
          <h2 className="text-xl font-bold text-text-light dark:text-white mb-4">
            Project Gallery
          </h2>
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <img
                src={details.additionalImages[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-[500px] object-cover"
              />

              {/* Navigation Buttons */}
              {details.additionalImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-light/90 dark:bg-surface-dark/90 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors shadow-sm border border-border-light dark:border-border-dark"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5 text-text-light dark:text-white" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-light/90 dark:bg-surface-dark/90 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors shadow-sm border border-border-light dark:border-border-dark"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5 text-text-light dark:text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
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
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
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
        </section>
      )}
    </PageLayout>
  );
}