import { BadgeCheck, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row gap-8 items-start md:items-center animate-fade-in-up">
      {/* Profile Image */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-gray-800 to-gray-400 dark:from-gray-300 dark:to-gray-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <img
          alt="Profile of Adzyl Jipos"
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg border-4 border-surface-light dark:border-surface-dark"
          src="/images/profile.png"
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-white">
              Adzyl Jipos
            </h1>
            <BadgeCheck className="size-5 text-text-light dark:text-white" />
          </div>
          <div className="flex items-center text-text-muted-light dark:text-text-muted-dark text-sm">
            <MapPin className="size-4 mr-1" />
            Samal, Davao del Norte, Philippines
          </div>
        </div>

        <p className="text-lg text-text-light dark:text-gray-300 font-medium">
          Software Developer
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="outline">
            <Mail className="size-4" />
            Send Email
          </Button>
        </div>
      </div>
    </section>
  );
}
