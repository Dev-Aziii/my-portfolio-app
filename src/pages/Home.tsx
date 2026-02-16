import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Recommendations from "@/components/Recommendations";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import usePageTitle from "@/hooks/usePageTitle";
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
  usePageTitle("Home | Adzyl Jipos");
  return (
    <>
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-16 space-y-14">
        <Hero data={heroData} />
        <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <About paragraphs={aboutParagraphs} />
        </div>

        {/* TechStack + Experience side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
           <Experience entries={experiences} compact />
          <TechStack
            categories={techStack}
            limit={5}
            categoryLimit={2}
            showViewAll
            compact
          />
         
        </div>

        {/* Projects + Certifications side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in-up" style={{ animationDelay: '360ms' }}>
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

        <div className="animate-fade-in-up" style={{ animationDelay: '480ms' }}>
          <Recommendations recommendations={recommendations} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Gallery images={galleryImages} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '720ms' }}>
          <Footer
            socialLinks={socialLinks}
            memberships={memberships}
            email={contactEmail}
          />
        </div>
      </main>
      {/* <ChatButton /> */}
    </>
  );
}
