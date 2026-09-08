import { useState } from "react";
import Certifications from "@/components/Certifications";
import DashboardActivity from "@/components/DashboardActivity";
import GitHubModal from "@/components/GitHubModal";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import usePageTitle from "@/hooks/usePageTitle";
import {
  certifications,
  heroData,
  projects,
  socialLinks,
  techStack,
} from "@/data";

export default function Home() {
  usePageTitle("Adzyl Jipos — Portfolio");
  const [isGithubOpen, setIsGithubOpen] = useState(false);

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
          <section id="skills" data-dashboard-section="skills">
            <TechStack categories={techStack} limit={6} categoryLimit={4} showViewAll />
          </section>

          <DashboardActivity onOpenGithub={() => setIsGithubOpen(true)} />
        </aside>

        <section id="certifications" data-dashboard-section="certifications" className="dashboard-content-grid__full">
          <Certifications certifications={certifications} limit={4} showViewAll />
        </section>
      </div>

      <GitHubModal open={isGithubOpen} onClose={() => setIsGithubOpen(false)} />
    </div>
  );
}
