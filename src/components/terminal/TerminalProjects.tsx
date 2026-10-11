import { Link } from "react-router-dom";
import { projects } from "@/data";
import { formatDemoLabel, isValidHttpUrl } from "@/lib/utils";

export default function TerminalProjects({ featured = false }: { featured?: boolean }) {
  const displayed = featured ? projects.slice(0, 3) : projects;
  return <section className="terminal-panel" aria-label={featured ? "Featured projects" : "Project catalog"}>
    <div className="terminal-panel-heading"><h2>&gt; {featured ? "Featured Projects" : "Projects"}</h2>{featured && <Link to="/projects">[ View all ]</Link>}</div>
    <ol className="terminal-projects">
      {displayed.map((project, index) => <li key={project.title}>
        <span className="terminal-project-number">{String(index + 1).padStart(2, "0")}.</span>
        <div className="terminal-project-copy"><h3>{project.title}</h3><p>{project.description}</p>
          {!featured && <><p className="terminal-muted">{project.badge} · {project.details?.techs.join(" / ")}</p>{isValidHttpUrl(project.url) ? <a href={project.url} target="_blank" rel="noopener noreferrer">[ {project.url.includes("github.com/") ? "Repository" : "Live demo"} ]</a> : <span className="terminal-muted">[ {formatDemoLabel(project.url)} ]</span>}</>}
        </div>
        {project.slug && project.details && <Link to={`/projects/${project.slug}`} aria-label={`View ${project.title} project`}>[ View Project ]</Link>}
      </li>)}
    </ol>
  </section>;
}
