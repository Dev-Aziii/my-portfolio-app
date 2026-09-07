import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2 } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import Lightbox from "@/components/Lightbox";
import { projects } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";
import { formatDemoLabel, isValidHttpUrl } from "@/lib/utils";

export default function ProjectDetailPage() {
  usePageTitle("Project Details | Adzyl Jipos");
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project?.details) return <Navigate to="/projects" replace />;

  const { details } = project;
  const gallery = [details.heroImage, ...(details.additionalImages ?? [])];
  const hasValidUrl = isValidHttpUrl(project.url);
  const currentImage = gallery[currentIndex];

  return (
    <PageLayout title={project.title} logo={project.logo} icon={project.icon} backTo="/projects" backLabel="Back to Projects">
      <div className="project-detail">
        <section className="project-detail__gallery" aria-label={`${project.title} gallery`}>
          <div className="project-detail__gallery-main" onClick={() => setLightboxIndex(currentIndex)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setLightboxIndex(currentIndex); }}>
            <img src={currentImage} alt={`${project.title} ${currentIndex + 1}`} />
            <span className="project-detail__gallery-hint"><Maximize2 aria-hidden="true" /> Expand exhibit</span>
            {gallery.length > 1 && (
              <>
                <button type="button" className="project-detail__gallery-button project-detail__gallery-button--prev" onClick={(event) => { event.stopPropagation(); setCurrentIndex((index) => index === 0 ? gallery.length - 1 : index - 1); }} aria-label="Previous image"><ChevronLeft aria-hidden="true" /></button>
                <button type="button" className="project-detail__gallery-button project-detail__gallery-button--next" onClick={(event) => { event.stopPropagation(); setCurrentIndex((index) => index === gallery.length - 1 ? 0 : index + 1); }} aria-label="Next image"><ChevronRight aria-hidden="true" /></button>
              </>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="project-detail__thumbs">
              {gallery.map((image, index) => (
                <button key={image} type="button" className="project-detail__thumb" data-active={index === currentIndex} onClick={() => setCurrentIndex(index)} aria-label={`Show image ${index + 1}`}>
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          )}
          <div className="project-detail__meta-row">
            <span className="dashboard-eyebrow">Exhibit {currentIndex + 1} / {gallery.length}</span>
            <span className="dashboard-eyebrow">{details.version} {details.year}</span>
          </div>
          <Lightbox images={gallery} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={(index) => { setLightboxIndex(index); setCurrentIndex(index); }} />
        </section>

        <p className="project-detail__description">{project.description}</p>

        <div className="project-detail__meta-row">
          <div className="project-detail__tags">{details.techs.map((tech) => <span key={tech} className="mono-tag">{tech}</span>)}</div>
          {hasValidUrl ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-detail__demo"><ExternalLink aria-hidden="true" /> Visit project demo</a>
          ) : (
            <span className="dashboard-eyebrow">{formatDemoLabel(project.url)}</span>
          )}
        </div>

        {[
          ["01 — Problem", details.problem],
          ["02 — Solution", details.solution],
          ["03 — Impact", details.impact],
        ].map(([label, section]) => (
          <section key={label as string} className="project-detail__section">
            <span className="dashboard-eyebrow">[ {label as string} ]</span>
            <h2>{(section as { title: string; description: string }).title}</h2>
            <p>{(section as { title: string; description: string }).description}</p>
          </section>
        ))}

        {details.highlights?.length ? (
          <section className="project-detail__section">
            <span className="dashboard-eyebrow">[ Key highlights ]</span>
            <div className="project-detail__highlights">{details.highlights.map((highlight) => <span key={highlight.label} className="project-detail__highlight">{highlight.label}</span>)}</div>
          </section>
        ) : null}
      </div>
    </PageLayout>
  );
}
