import About from "@/components/About";
import Certifications from "@/components/Certifications";
import DashboardActivity from "@/components/DashboardActivity";
import DashboardStats from "@/components/DashboardStats";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import GitHubContributions from "@/components/GitHubContributions";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import usePageTitle from "@/hooks/usePageTitle";
import { getDashboardStats } from "@/lib/dashboard";
import {
  aboutParagraphs,
  certifications,
  contactEmail,
  experiences,
  heroData,
  memberships,
  projects,
  socialLinks,
  techStack,
} from "@/data";
import { githubContributionsData } from "@/data/githubContributions";

export default function Home() {
  usePageTitle("Adzyl Jipos — Portfolio");

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

          <section id="about" data-dashboard-section="about">
            <About paragraphs={aboutParagraphs} />
          </section>

          <section id="experience" data-dashboard-section="experience">
            <Experience entries={experiences} compact showViewAll />
          </section>

          <section id="education" data-dashboard-section="education">
            <Education entries={experiences} />
          </section>

          <section id="certifications" data-dashboard-section="certifications">
            <Certifications certifications={certifications} limit={4} showViewAll />
          </section>

          <section id="github" data-dashboard-section="github">
            <GitHubContributions />
          </section>
        </div>

        <aside className="dashboard-content-grid__secondary">
          <section id="skills" data-dashboard-section="skills">
            <TechStack categories={techStack} limit={6} categoryLimit={4} showViewAll />
          </section>

          <DashboardActivity />

          <section id="contact" data-dashboard-section="contact">
            <Footer socialLinks={socialLinks} memberships={memberships} email={contactEmail} />
          </section>
        </aside>
      </div>
    </div>
  );
}
