import { ArrowUpRight, Award } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { certifications, certificationCategories } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function CertificationsPage() {
  usePageTitle("Certifications | Adzyl Jipos");

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
                  <a
                    key={certification.title}
                    href={certification.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certification-page__card"
                  >
                    <span className="certification-page__icon">
                      {certification.iconUrl ? <img src={certification.iconUrl} alt="" /> : <Icon aria-hidden="true" />}
                    </span>
                    <span className="certification-page__copy">
                      <small>Certificate of Achievement</small>
                      <h2>{certification.title}</h2>
                      <p>{certification.issuer}</p>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
