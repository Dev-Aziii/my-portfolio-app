import { BadgeCheck, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import type { HeroData } from "@/data/types";

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="flex flex-col md:flex-row gap-8 items-start md:items-center animate-fade-in-up">
      {/* Profile Image */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-b from-gray-800 to-gray-400 dark:from-gray-300 dark:to-gray-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <img
          alt={`Profile of ${data.name}`}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg border-4 border-surface-light dark:border-surface-dark"
          src={data.profileImage}
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-white">
                {data.name}
              </h1>
              <BadgeCheck className="size-5 text-text-light dark:text-white" />
            </div>
            <ThemeToggle />
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
        </div>
      </div>
    </section>
  );
}
