import Certifications from "@/components/Certifications";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import GitHubContributions from "@/components/GitHubContributions";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import usePageTitle from "@/hooks/usePageTitle";
import {
  certifications,
  experiences,
  heroData,
  projects,
  socialLinks,
  techStack,
} from "@/data";

export default function Home() {
  usePageTitle("Adzyl Jipos — Portfolio");

  return (
    <div className="dashboard-home">
      <section id="home" data-dashboard-section="home" className="dashboard-home__section">
        <Hero data={heroData} socialLinks={socialLinks} />
      </section>

      <div className="dashboard-content-grid">
        <div className="dashboard-content-grid__primary">
          <section id="projects" data-dashboard-section="projects" className="dashboard-panel dashboard-panel--projects">
            <Projects projects={projects} limit={3} showViewAll variant="featured" />
          </section>

        </div>

        <aside className="dashboard-content-grid__secondary">
          <section id="certifications" data-dashboard-section="certifications" className="dashboard-overview__side-section dashboard-overview__side-section--certifications">
            <Certifications certifications={certifications} limit={4} showViewAll />
          </section>

          <section id="experience" data-dashboard-section="experience" className="dashboard-overview__side-section dashboard-overview__side-section--experience">
            <Experience entries={experiences} limit={3} showViewAll />
          </section>
        </aside>
      </div>

      <section id="skills" data-dashboard-section="skills" className="dashboard-overview__full dashboard-overview__full--skills">
        <TechStack categories={techStack} limit={9} categoryLimit={4} showViewAll />
      </section>

      <section className="dashboard-panel dashboard-overview__full dashboard-overview__github" data-overview-section="github">
        <GitHubContributions />
      </section>
    </div>
  );
}
