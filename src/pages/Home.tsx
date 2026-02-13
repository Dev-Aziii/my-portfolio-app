import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Recommendations from "@/components/Recommendations";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
// import ChatButton from "@/components/ChatButton";
import {
  heroData,
  aboutParagraphs,
  techStack,
  experiences,
  projects,
  certifications,
  recommendations,
  galleryImages,
  socialLinks,
  memberships,
  contactEmail,
} from "@/data";

export default function Home() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-16 space-y-14">
        <Hero data={heroData} />
        <About paragraphs={aboutParagraphs} />

        {/* TechStack + Experience side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <TechStack
            categories={techStack}
            limit={4}
            categoryLimit={3}
            showViewAll
            compact
          />
          <Experience entries={experiences} compact />
        </div>

        {/* Projects + Certifications side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Projects
            projects={projects}
            limit={2}
            showViewAll
            compact
          />
          <Certifications
            certifications={certifications}
            limit={5}
            showViewAll
            compact
          />
        </div>

        <Recommendations recommendations={recommendations} />
        <Gallery images={galleryImages} />
        <Footer
          socialLinks={socialLinks}
          memberships={memberships}
          email={contactEmail}
        />
      </main>
      {/* <ChatButton /> */}
    </>
  );
}
