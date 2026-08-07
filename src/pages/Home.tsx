import Masthead from "@/components/Masthead";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Recommendations from "@/components/Recommendations";
// import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";
import usePageTitle from "@/hooks/usePageTitle";
import {
  heroData,
  aboutParagraphs,
  techStack,
  experiences,
  projects,
  certifications,
  recommendations,
  // galleryImages,
  socialLinks,
  memberships,
  contactEmail,
} from "@/data";

export default function Home() {
  usePageTitle("Adzyl Jipos — Portfolio");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-12 space-y-10">
        {/* Newspaper Masthead */}
        <Masthead onNavigateSection={scrollToSection} />

        {/* Front-Page Hero Introduction */}
        <section id="home" className="scroll-mt-28">
          <Hero data={heroData} />
        </section>

        {/* Section 01: About */}
        <section id="about" className="scroll-mt-28 animate-fade-in-up">
          <About paragraphs={aboutParagraphs} />
        </section>

        {/* Section 02 & 03: Experience & Tech Stack side-by-side with vertical rule divider */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in-up">
          <section id="experience" className="scroll-mt-28">
            <Experience entries={experiences} compact />
          </section>
          <section id="techstack" className="scroll-mt-28 lg:border-l border-border lg:pl-10">
            <TechStack
              categories={techStack}
              limit={6}
              categoryLimit={3}
              showViewAll
              compact
            />
          </section>
        </div>

        {/* Section 04: Projects (Full-width horizontal section) */}
        <section id="projects" className="scroll-mt-28 animate-fade-in-up">
          <Projects
            projects={projects}
            limit={4}
            showViewAll
          />
        </section>

        {/* Section 05: Certifications (Full-width horizontal section) */}
        <section id="certifications" className="scroll-mt-28 animate-fade-in-up border-t border-border pt-10">
          <Certifications
            certifications={certifications}
            limit={5}
            showViewAll
          />
        </section>

        {/* Recommendations */}
        <section id="recommendations" className="scroll-mt-28 animate-fade-in-up">
          <Recommendations recommendations={recommendations} />
        </section>

        {/* Gallery (Hidden for now) */}
        {/*
        <section id="gallery" className="scroll-mt-28 animate-fade-in-up">
          <Gallery images={galleryImages} />
        </section>
        */}

        {/* Newspaper Colophon Footer */}
        <Footer
          socialLinks={socialLinks}
          memberships={memberships}
          email={contactEmail}
        />
      </main>

      {/* Editorial Floating Section Tracker */}
      <SectionNav />
    </>
  );
}
