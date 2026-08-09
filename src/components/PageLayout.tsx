import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { Project } from "@/data/types";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  logo?: string;
  icon?: Project["icon"];
}

export default function PageLayout({
  title,
  children,
  backTo = "/",
  backLabel = "Back to Home",
  logo,
  icon: IconComponent,
}: PageLayoutProps) {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-foreground">
      {/* Editorial Page Top Bar */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-6">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Page Title Headline with Double Rule */}
      <div className="rule-double py-2 mb-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          {logo ? (
            <div className="size-9 sm:size-10 shrink-0 border border-border p-1 bg-card flex items-center justify-center shadow-xs">
              <img
                src={logo}
                alt={`${title} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : IconComponent ? (
            <div className="size-9 sm:size-10 shrink-0 border border-border p-1.5 bg-card flex items-center justify-center text-foreground shadow-xs">
              <IconComponent className="w-full h-full" />
            </div>
          ) : null}

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {children}
    </main>
  );
}
