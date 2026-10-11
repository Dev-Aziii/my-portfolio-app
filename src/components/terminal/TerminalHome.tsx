import { Link } from "react-router-dom";
import { heroData, profileIntroduction, socialLinks, techStack, experiences, certifications } from "@/data";
import GitHubContributions from "@/components/GitHubContributions";
import usePageTitle from "@/hooks/usePageTitle";
import TerminalProfile from "./TerminalProfile";
import TerminalProjects from "./TerminalProjects";

export default function TerminalHome() {
  usePageTitle("Adzyl Jipos — Terminal Portfolio");
  return <div className="terminal-home">
    <div className="terminal-hero">
      <section id="about" className="terminal-intro" tabIndex={-1}>
        <h1>Welcome to my portfolio!<span className="terminal-cursor" aria-hidden="true">_</span></h1>
        <p>Hello, I&apos;m {heroData.name}.</p><p>{profileIntroduction}</p>
        <nav aria-label="Quick navigation" className="terminal-quick-nav">
          {[["About Me", "/#about"], ["Projects", "/projects"], ["Skills", "/tech-stack"], ["Experience", "/experience"], ["Certifications", "/certifications"], ["Contact", "/#contact"]].map(([label, to]) => <Link key={label} to={to}><span aria-hidden="true">[→]</span> {label}</Link>)}
        </nav>
      </section>
      <TerminalProfile />
    </div>
    <TerminalProjects featured />
    <div className="terminal-two-column">
      <section className="terminal-panel"><div className="terminal-panel-heading"><h2>&gt; Skills</h2><Link to="/tech-stack">[ All skills ]</Link></div>
        <ul className="terminal-list">{techStack.slice(0, 3).map((category) => <li key={category.name}><strong>{category.name}</strong><p>{category.items.slice(0, 6).map((item) => item.name).join(" / ")}</p></li>)}</ul>
      </section>
      <section className="terminal-panel" id="contact" tabIndex={-1}><h2>&gt; Get In Touch</h2><p>For work and collaboration, contact me at:</p>
        <div className="terminal-contact-links"><a href={`mailto:${heroData.email}`}>[ Email ] <span>{heroData.email}</span></a>
          {socialLinks.map((item) => <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer">[ {item.name} ] <span>{item.href.replace("https://", "")}</span></a>)}
          <a href={heroData.cvUrl} target="_blank" rel="noopener noreferrer">[ Download CV ]</a>
        </div>
      </section>
    </div>
    <div className="terminal-two-column">
      <section className="terminal-panel"><div className="terminal-panel-heading"><h2>&gt; Experience</h2><Link to="/experience">[ Read more ]</Link></div><ul className="terminal-list">{experiences.map((entry) => <li key={entry.company}><strong>{entry.title ?? entry.company}</strong><p className="terminal-muted">{entry.company} · {entry.year}</p></li>)}</ul></section>
      <section className="terminal-panel"><div className="terminal-panel-heading"><h2>&gt; Certifications</h2><Link to="/certifications">[ View all ]</Link></div><ul className="terminal-list">{certifications.slice(0, 4).map((cert) => <li key={cert.title}><a href={cert.href} target="_blank" rel="noopener noreferrer">[ {cert.title} ]</a><p className="terminal-muted">{cert.issuer}</p></li>)}</ul></section>
    </div>
    <div className="terminal-panel terminal-github"><GitHubContributions /></div>
  </div>;
}
