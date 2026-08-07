import { BadgeCheck, ChevronRight } from "lucide-react";
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
  compact,
  hideTitle,
}: CertificationsProps) {
  const displayed = limit ? certifications.slice(0, limit) : certifications;

  return (
    <section className="h-full flex flex-col justify-between">
      <div>
        {!hideTitle && (
          <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
              [ SECTION 05 // CERTIFICATIONS ]
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
          <div className="divide-y divide-border border-t border-b border-border">
            {displayed.map((cert) => (
              <a
                key={cert.title}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 flex items-center justify-between group hover:bg-card px-2 transition-colors"
              >
                <div>
                  <h4 className="font-serif font-bold text-sm text-foreground group-hover:underline underline-offset-2">
                    {cert.title}
                  </h4>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    ISSUER: {cert.issuer}
                  </p>
                </div>
                <BadgeCheck className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
