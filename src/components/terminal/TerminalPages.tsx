import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { certifications, certificationCategories, experiences, projects, techStack, type Certification } from "@/data";
import CertificateModal from "@/components/CertificateModal";
import Lightbox from "@/components/Lightbox";
import { formatDemoLabel, isValidHttpUrl } from "@/lib/utils";
import TerminalPageLayout from "./TerminalPageLayout";
import TerminalProjects from "./TerminalProjects";

export function TerminalProjectsPage() {
  return <TerminalPageLayout title="Projects"><TerminalProjects /></TerminalPageLayout>;
}

export function TerminalSkillsPage() {
  return <TerminalPageLayout title="Tech Stack"><div className="terminal-two-column">{techStack.map((category) => <section key={category.name} className="terminal-panel"><h2>&gt; {category.name}</h2><ul className="terminal-list terminal-skill-list">{category.items.map((item) => <li key={item.name}>- {item.name}</li>)}</ul></section>)}</div></TerminalPageLayout>;
}

export function TerminalExperiencePage() {
  return <TerminalPageLayout title="Experience"><div className="terminal-section-stack">{experiences.map((entry) => <article key={entry.company} className="terminal-panel"><div className="terminal-panel-heading"><h2>&gt; {entry.company}</h2><span>{entry.year}{entry.isCurrent ? " [Current]" : ""}</span></div>
    <p>{entry.title}</p><p className="terminal-muted">{[entry.schedule, entry.location].filter(Boolean).join(" · ")}</p>
    {entry.positions?.map((position) => <section key={position.title} className="terminal-career-position"><h3>{position.title}</h3><p className="terminal-muted">{position.timeSpan}</p>
      {Array.isArray(position.description) ? <ul className="terminal-list">{position.description.map((description) => <li key={description}>- {description}</li>)}</ul> : <p>{position.description}</p>}
      {position.skills?.length && <p className="terminal-muted">[ {position.skills.join(" / ")} ]</p>}
    </section>)}
  </article>)}</div></TerminalPageLayout>;
}

export function TerminalCertificationsPage() {
  const [selected, setSelected] = useState<Certification | null>(null);
  return <TerminalPageLayout title="Certifications"><div className="terminal-section-stack">{certificationCategories.map((category) => <section key={category} className="terminal-panel"><h2>&gt; {category}</h2><ul className="terminal-list">{certifications.filter((cert) => cert.category === category).map((cert) => <li key={cert.title} className="terminal-certification"><div><h3>{cert.title}</h3><p className="terminal-muted">{cert.issuer}</p></div><div className="terminal-actions"><button type="button" onClick={() => setSelected(cert)} aria-label={`View certificate: ${cert.title}`}>[ View Certificate ]</button><a href={cert.href} target="_blank" rel="noopener noreferrer">[ Verify Badge ]</a></div></li>)}</ul></section>)}</div><CertificateModal open={Boolean(selected)} cert={selected} onClose={() => setSelected(null)} /></TerminalPageLayout>;
}

export function TerminalNotFound() {
  return <TerminalPageLayout title="404 — Page not found"><section className="terminal-panel"><p>The requested route does not exist in this portfolio.</p><p>Use <code>cd /</code> to return home or <code>help</code> to explore.</p><Link to="/">[ Back to Overview ]</Link></section></TerminalPageLayout>;
}

export function TerminalProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);
  if (!project?.details) return <Navigate to="/projects" replace />;
  // Key gallery state by project so moving directly between case studies resets the image.
  return <ProjectDetail key={project.slug} project={project} />;
}

function ProjectDetail({ project }: { project: (typeof projects)[number] }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const details = project.details!;
  const images = [details.heroImage, ...(details.additionalImages ?? [])];
  return <TerminalPageLayout title={project.title}>
    <Link to="/projects">[ ← Projects ]</Link>
    <section className="terminal-panel"><div className="terminal-panel-heading"><h2>&gt; {project.title}</h2><span>{[details.version, details.year].filter(Boolean).join(" / ")}</span></div><p>{project.description}</p><p className="terminal-muted">{project.badge}</p><p>[ {details.techs.join(" / ")} ]</p>
      {isValidHttpUrl(project.url) ? <a href={project.url} target="_blank" rel="noopener noreferrer">[ {project.url.includes("github.com/") ? "View Repository" : "Visit Project Demo"} ]</a> : <span className="terminal-muted">[ {formatDemoLabel(project.url)} ]</span>}
    </section>
    <section className="terminal-panel terminal-gallery" aria-label={`${project.title} gallery`}>
      <button type="button" className="terminal-gallery-main" onClick={() => setExpanded(imageIndex)} aria-label={`Expand ${project.title} image ${imageIndex + 1}`}><img src={images[imageIndex]} alt={`${project.title} screenshot ${imageIndex + 1}`} /><span>[ Expand image ]</span></button>
      <div className="terminal-panel-heading"><span>Exhibit {imageIndex + 1} / {images.length}</span><div className="terminal-actions"><button type="button" onClick={() => setImageIndex((index) => (index - 1 + images.length) % images.length)} aria-label="Previous image">[ ← ]</button><button type="button" onClick={() => setImageIndex((index) => (index + 1) % images.length)} aria-label="Next image">[ → ]</button></div></div>
      {images.length > 1 && <div className="terminal-gallery-thumbs">{images.map((image, index) => <button key={image} type="button" aria-label={`Show image ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><img src={image} alt="" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div>}
      <Lightbox images={images} currentIndex={expanded} onClose={() => setExpanded(null)} onNavigate={(index) => { setExpanded(index); setImageIndex(index); }} />
    </section>
    {details.metrics?.length && <section className="terminal-panel"><h2>&gt; Results</h2><ul className="terminal-list">{details.metrics.map((metric) => <li key={metric.label}><strong>{metric.value}</strong> {metric.label}{metric.comparison && <p className="terminal-muted">{metric.comparison}</p>}</li>)}</ul></section>}
    {[details.problem, details.solution, details.impact].map((section, index) => <section className="terminal-panel" key={section.title}><span className="terminal-muted">[ {String(index + 1).padStart(2, "0")} ]</span><h2>&gt; {section.title}</h2><p>{section.description}</p></section>)}
    {details.highlights?.length && <section className="terminal-panel"><h2>&gt; Key highlights</h2><ul className="terminal-list">{details.highlights.map((item) => <li key={item.label}>- {item.label}</li>)}</ul></section>}
  </TerminalPageLayout>;
}
