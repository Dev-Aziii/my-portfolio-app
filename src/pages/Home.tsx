import { useState } from "react";
import Certifications from "@/components/Certifications";
import DashboardActivity from "@/components/DashboardActivity";
import DashboardStats from "@/components/DashboardStats";
import GitHubModal from "@/components/GitHubModal";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import usePageTitle from "@/hooks/usePageTitle";
import { getDashboardStats } from "@/lib/dashboard";
import {
  certifications,
  experiences,
  heroData,
  projects,
  socialLinks,
  techStack,
} from "@/data";
import { githubContributionsData } from "@/data/githubContributions";

export default function Home() {
  usePageTitle("Adzyl Jipos — Portfolio");
  const [isGithubOpen, setIsGithubOpen] = useState(false);

  const stats = getDashboardStats({
    projects,
    certifications,
    experiences,
    contributions: githubContributionsData.totalContributions,
  });

  return (
    <div className="dashboard-home">
      <section id="home" data-dashboard-section="home" className="dashboard-home__section">
        <Hero data={heroData} socialLinks={socialLinks} />
      </section>

      <DashboardStats stats={stats} />

      <div className="dashboard-content-grid">
        <div className="dashboard-content-grid__primary">
          <section id="projects" data-dashboard-section="projects" className="dashboard-panel dashboard-panel--projects">
            <Projects projects={projects} limit={4} showViewAll variant="grid" />
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
