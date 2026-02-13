import { BadgeCheck, ChevronRight } from "lucide-react";

interface Certification {
  title: string;
  issuer: string;
  href: string;
}

const certifications: Certification[] = [
  {
    title: "Information Technology Specialist in Databases",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/57314292-2da7-48c3-ac2f-92765a7b3a73/public_url",
  },
  {
    title: "Information Technology Specialist in Networking",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/76b92ed5-201f-46ce-80f0-44f081f96075/public_url",
  },
  {
    title: "Information Technology Specialist in HTML and CSS",
    issuer: "Certiport",
    href: "https://www.credly.com/badges/c8b83b2b-e914-4e90-82e0-4f6745b764d9/public_url",
  },
];

export default function Certifications() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text-light dark:text-white">
          Recent Certifications
        </h2>
        <a
          className="text-sm font-medium text-text-light dark:text-text-dark hover:text-gray-500 transition-colors flex items-center"
          href="#"
        >
          View All
          <ChevronRight className="size-4 ml-1" />
        </a>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No certifications added yet.</p>
        </div>
      ) : (
      <div className="space-y-3">
        {certifications.map((cert) => (
          <a
            key={cert.title}
            className="block bg-surface-light dark:bg-surface-dark p-4 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            href={cert.href}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-text-light dark:text-white">
                  {cert.title}
                </h4>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                  {cert.issuer}
                </p>
              </div>
              <BadgeCheck className="size-6 text-gray-300 dark:text-gray-600 group-hover:text-text-light dark:group-hover:text-white transition-colors" />
            </div>
          </a>
        ))}
      </div>
      )}
    </section>
  );
}
