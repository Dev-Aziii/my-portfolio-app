import Masthead from "@/components/Masthead";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import GitHubContributions from "@/components/GitHubContributions";
// import Recommendations from "@/components/Recommendations";
// import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
// import SectionNav from "@/components/SectionNav";
import usePageTitle from "@/hooks/usePageTitle";
import {
  heroData,
  aboutParagraphs,
  techStack,
  experiences,
  projects,
  certifications,
  //recommendations,
  // galleryImages,
  socialLinks,
  memberships,
  contactEmail,
} from "@/data";

export default function Home() {
  usePageTitle("Adzyl Jipos — Portfolio");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const header = document.getElementById("masthead");
    if (!header) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const topBar = document.getElementById("masthead-top");
    const banner = document.getElementById("masthead-banner");

    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    const headerHeight = header.getBoundingClientRect().height;

    /* Measure the masthead's collapsed height without a visible flash:
       temporarily force both collapsible rows shut and read the header height,
       then restore the inline styles in the same synchronous block. */
    let collapsedHeight = headerHeight;
    if (topBar && banner) {
      const configure = (bar: HTMLElement, includeMargins: boolean) => {
        bar.style.setProperty("transition", "none");
        bar.style.setProperty("max-height", "0px");
        bar.style.setProperty("opacity", "0");
        bar.style.setProperty("padding", "0");
        if (includeMargins) {
          bar.style.setProperty("margin", "0");
        }
        bar.style.setProperty("padding-bottom", "0");
      };
      const restore = (bar: HTMLElement, saved: string[]) => {
        bar.style.setProperty("transition", saved[0]);
        bar.style.setProperty("max-height", saved[1]);
        bar.style.setProperty("opacity", saved[2]);
        bar.style.setProperty("padding", saved[3]);
        bar.style.setProperty("margin", saved[4]);
        bar.style.setProperty("padding-bottom", saved[5]);
      };
      const save = (bar: HTMLElement) => [
        bar.style.getPropertyValue("transition"),
        bar.style.getPropertyValue("max-height"),
        bar.style.getPropertyValue("opacity"),
        bar.style.getPropertyValue("padding"),
        bar.style.getPropertyValue("margin"),
        bar.style.getPropertyValue("padding-bottom"),
      ];
      const bannerSaved = save(banner);
      const topBarSaved = save(topBar);
      try {
        configure(banner, true);
        configure(topBar, false);
        collapsedHeight = header.getBoundingClientRect().height;
      } finally {
        restore(banner, bannerSaved);
        restore(topBar, topBarSaved);
      }
    }

    /* The masthead collapses mid-scroll when the landing scroll position goes
     * past the collapse threshold (150px), which lifts every section up by
     * (headerHeight - collapsedHeight). Account for that shift so the landing
     * spot ends up just below the SHRUNK header. Otherwise the collapse only
     * happens after the scroll has settled, so offset by the current height. */
    const collapsedOffset = 112; // matches scroll-mt-28 for the compact nav
    const landsBelowCollapseThreshold =
      sectionTop - (headerHeight - collapsedHeight) - collapsedOffset > 150;

    const offset = landsBelowCollapseThreshold
      ? headerHeight - collapsedHeight + collapsedOffset
      : headerHeight + 16;

    window.scrollTo({ top: Math.max(sectionTop - offset, 0), behavior: "smooth" });
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
            limit={3}
            showViewAll
          />
        </section>

        {/* Section 05: Certifications (Full-width horizontal section) */}
        <section id="certifications" className="scroll-mt-28 animate-fade-in-up border-t border-border pt-10">
          <Certifications
            certifications={certifications}
            limit={3}
            showViewAll
          />
        </section>

        {/* Section 06: GitHub Contributions */}
        <section id="github" className="scroll-mt-28 animate-fade-in-up border-t border-border pt-10">
          <GitHubContributions />
        </section>

        {/* Recommendations (Hidden for now) */}
        {/*
        <section id="recommendations" className="scroll-mt-28 animate-fade-in-up">
          <Recommendations recommendations={recommendations} />
        </section>
        */}

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
      {/* <SectionNav /> */}
    </>
  );
}
