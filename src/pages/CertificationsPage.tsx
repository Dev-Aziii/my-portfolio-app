import { useState } from "react";
import { ArrowUpRight, Award, FileText } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import CertificateModal from "@/components/CertificateModal";
import { certifications, certificationCategories } from "@/data";
import type { Certification } from "@/data/types";
import usePageTitle from "@/hooks/usePageTitle";

export default function CertificationsPage() {
  usePageTitle("Certifications | Adzyl Jipos");
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const groupedCertifications = certificationCategories.map((category) => ({
    category,
    items: certifications.filter((certification) => certification.category === category),
  }));

  return (
    <PageLayout title="Certifications">
      <div className="certification-page">
        {groupedCertifications.map((group) => group.items.length > 0 && (
          <section key={group.category} className="certification-page__group">
            <h2 className="certification-page__category">{group.category}</h2>
            <div className="certification-page__grid">
              {group.items.map((certification) => {
                const Icon = certification.icon ?? Award;
                return (
                  <div
                    key={certification.title}
                    className="certification-page__card"
                  >
                    <div className="certification-page__main">
                      <span className="certification-page__icon">
                        {certification.iconUrl ? (
                          <img src={certification.iconUrl} alt="" />
                        ) : (
                          <Icon aria-hidden="true" />
                        )}
                      </span>
                      <div className="certification-page__copy">
                        <small>Certificate of Achievement</small>
                        <h2>{certification.title}</h2>
                        <p>{certification.issuer}</p>
                      </div>
                    </div>

                    <div className="certification-page__actions">
                      <button
                        type="button"
                        className="certification-page__action-btn certification-page__action-btn--primary"
                        onClick={() => setSelectedCert(certification)}
                      >
                        <FileText aria-hidden="true" />
                        <span>View Certificate</span>
                      </button>

                      <a
                        href={certification.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="certification-page__action-btn certification-page__action-btn--secondary"
                      >
                        <span>Verify Badge</span>
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <CertificateModal
        open={Boolean(selectedCert)}
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </PageLayout>
  );
}
