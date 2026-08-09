import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Certification } from "@/data/types";

interface CertificationsProps {
  certifications: Certification[];
  limit?: number;
  showViewAll?: boolean;
  compact?: boolean;
  hideTitle?: boolean;
}

export default function Certifications({
  certifications,
  limit,
  showViewAll,
  hideTitle,
}: CertificationsProps) {
  const displayed = limit ? certifications.slice(0, limit) : certifications;

  return (
    <section className="h-full flex flex-col justify-between">
      <div>
        {!hideTitle && (
          <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
              [ 04 — CERTIFICATIONS ]
            </h3>
            {showViewAll && (
              <Link
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center uppercase tracking-wider"
                to="/certifications"
              >
                ALL CERTIFICATIONS
                <ChevronRight className="size-3.5 ml-0.5" />
              </Link>
            )}
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="text-center py-8 font-mono text-xs text-muted-foreground">
            NO CERTIFICATIONS RECORDED.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((cert) => (
              <a
                key={cert.title}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 p-4 pr-5 border-2 border-foreground/60 bg-card transition-colors duration-300 hover:bg-background"
              >
                {/* Inner hairline frame */}
                <span className="pointer-events-none absolute inset-1.5 border border-border" />

                {/* Corner ticks */}
                <span className="pointer-events-none absolute left-3 top-3 size-1.5 border-l-2 border-t-2 border-foreground/50" />
                <span className="pointer-events-none absolute right-3 top-3 size-1.5 border-r-2 border-t-2 border-foreground/50" />
                <span className="pointer-events-none absolute bottom-3 left-3 size-1.5 border-b-2 border-l-2 border-foreground/50" />
                <span className="pointer-events-none absolute bottom-3 right-3 size-1.5 border-b-2 border-r-2 border-foreground/50" />

                {/* Seal medallion */}
                <div className="relative shrink-0 size-16 sm:size-17 rounded-full border border-border bg-background">
                  <span className="pointer-events-none absolute inset-1 rounded-full border border-dashed border-foreground/30" />
                  <span className="pointer-events-none absolute inset-2 rounded-full border border-foreground/50" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    {cert.iconUrl ? (
                      <img
                        src={cert.iconUrl}
                        alt={`${cert.issuer} certificate seal`}
                        className="size-10 sm:size-12 object-contain"
                      />
                    ) : cert.icon ? (
                      <cert.icon className="size-8 sm:size-10 text-foreground/80" />
                    ) : null}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block font-mono text-[8px] uppercase tracking-[0.28em] text-muted-foreground">
                    Certificate of Achievement
                  </span>
                  <h4 className="mt-1 font-serif font-semibold text-sm sm:text-[15px] text-foreground leading-snug">
                    {cert.title}
                  </h4>

                  <div className="mt-1.5 inline-flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/30" />
                    <span className="size-1 rotate-45 bg-foreground/60" />
                    <span className="h-px w-6 bg-foreground/30" />
                  </div>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/90">
                      {cert.issuer}
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      {cert.category}
                    </span>
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
