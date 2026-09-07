import { ArrowUpRight, Award } from "lucide-react";
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
    <section className="dashboard-panel" aria-labelledby={hideTitle ? undefined : "certifications-heading"}>
      {!hideTitle && (
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-eyebrow">Verified learning</span>
            <h2 id="certifications-heading">Certifications</h2>
          </div>
          {showViewAll && (
            <Link to="/certifications" className="dashboard-inline-link">
              View all <ArrowUpRight aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      <div className="dashboard-certifications">
        {displayed.map((cert) => {
          const Icon = cert.icon ?? Award;
          return (
            <a key={cert.title} href={cert.href} target="_blank" rel="noopener noreferrer" className="dashboard-certification-card">
              <span className="dashboard-certification-card__icon">
                {cert.iconUrl ? <img src={cert.iconUrl} alt="" /> : <Icon aria-hidden="true" />}
              </span>
              <span className="dashboard-certification-card__copy">
                <strong>{cert.title}</strong>
                <span>{cert.issuer} · {cert.category}</span>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

