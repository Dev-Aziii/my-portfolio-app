import { BadgeCheck, MapPin, Mail, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useProfileReveal } from "@/hooks/useProfileReveal";
import type { HeroData } from "@/data/types";

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const { imageContainerRef, isTouchRevealed, getMaskStyle, handlers } =
    useProfileReveal();

  return (
    <section className="relative flex flex-col md:flex-row gap-8 items-start md:items-center animate-fade-in-up">
      {/* Theme Toggle — fixed top-right on mobile, inline on md+ */}
      <div className="fixed top-4 right-4 z-50 md:absolute md:top-0 md:right-0">
        <ThemeToggle />
      </div>

      {/* Profile Image */}
      <div
        className={`relative group profile-reveal${isTouchRevealed ? " touch-revealed" : ""}`}
        onTouchStart={handlers.onTouchStart}
        onTouchMove={handlers.onTouchMove}
        onTouchEnd={handlers.onTouchEnd}
        onTouchCancel={handlers.onTouchCancel}
        onContextMenu={handlers.onContextMenu}
      >
        <div className="absolute -inset-1 bg-linear-to-b from-gray-800 to-gray-400 dark:from-gray-300 dark:to-gray-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 profile-glow" />

        <div
          ref={imageContainerRef}
          onMouseMove={handlers.onMouseMove}
          onMouseEnter={handlers.onMouseEnter}
          onMouseLeave={handlers.onMouseLeave}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-surface-light dark:border-surface-dark shadow-lg select-none"
        >
          {/* Base Image */}
          <img
            alt={`Profile of ${data.name}`}
            className="w-full h-full object-cover"
            src={data.profileImage}
          />

          {/* Masked 2nd Image with soft fading edges based on cursor position */}
          <img
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200 profile-back"
            src={data.profileImage2}
            style={getMaskStyle()}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-white">
              {data.name}
            </h1>
            <BadgeCheck className="size-5 text-text-light dark:text-white" />
          </div>
          <div className="flex items-center text-text-muted-light dark:text-text-muted-dark text-sm">
            <MapPin className="size-4 mr-1" />
            {data.location}
          </div>
        </div>

        <p className="text-lg text-text-light dark:text-gray-300 font-medium">
          {data.title}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="outline" asChild>
            <a href={`mailto:${data.email}`}>
              <Mail className="size-4" />
              Send Email
            </a>
          </Button>
          <Button variant="default" asChild>
            <a href={data.cvUrl} target="_blank" rel="noopener noreferrer">
              <FileDown className="size-4" />
              Download CV
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

