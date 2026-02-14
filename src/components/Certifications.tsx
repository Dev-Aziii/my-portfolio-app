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

export default function Certifications({ certifications, limit, showViewAll, compact, hideTitle }: CertificationsProps) {
  const displayed = limit ? certifications.slice(0, limit) : certifications;

  return (
    <section>
      {!hideTitle && (
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold text-text-light dark:text-white`}>
            {compact ? "Certifications" : "Recent Certifications"}
          </h2>
          {showViewAll && (
            <Link
              className="text-sm font-medium text-text-light dark:text-text-dark hover:text-gray-500 transition-colors flex items-center"
              to="/certifications"
            >
              View All
              <ChevronRight className="size-4 ml-1" />
            </Link>
          )}
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No certifications added yet.</p>
        </div>
      ) : (
      <div className="space-y-2.5">
        {displayed.map((cert) => (
          <a
            key={cert.title}
            className="block bg-surface-light dark:bg-surface-dark p-3.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-text-light dark:text-white text-sm">
                  {cert.title}
                </h4>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                  {cert.issuer}
                </p>
              </div>
              <BadgeCheck className="size-5 text-gray-300 dark:text-gray-600 group-hover:text-text-light dark:group-hover:text-white transition-colors shrink-0 ml-3" />
            </div>
          </a>
        ))}
      </div>
      )}
    </section>
  );
}
