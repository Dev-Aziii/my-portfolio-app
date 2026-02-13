import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Recommendations from "@/components/Recommendations";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 space-y-24">
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <Certifications />
        <Recommendations />
        <Gallery />
        <Footer />
      </main>
      <ChatButton />
    </>
  );
}
