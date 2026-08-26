import PageLayout from "@/components/PageLayout";
import { certifications, certificationCategories } from "@/data";
import usePageTitle from "@/hooks/usePageTitle";

export default function CertificationsPage() {
  usePageTitle("Certifications | Adzyl Jipos");

  const groupedCertifications = certificationCategories.map((category) => ({
    category,
    items: certifications.filter((cert) => cert.category === category),
  }));

  return (
    <PageLayout title="Certifications">
      <div className="space-y-10">
        {groupedCertifications.map(
          (group) =>
            group.items.length > 0 && (
              <section key={group.category}>
                <div className="rule-single dark:border-cyan-500/20 pt-3 mb-5">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground dark:text-cyan-400 font-bold">
                    {group.category}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {group.items.map((cert) => (
                    <a
                      key={cert.title}
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-4 p-4 pr-5 border-2 border-foreground/60 dark:border-cyan-500/30 bg-card dark:bg-[#081220]/90 transition-all duration-300 hover:bg-background dark:hover:bg-[#0b172a] dark:hover:border-cyan-400/80 dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                    >
                      {/* Inner hairline frame */}
                      <span className="pointer-events-none absolute inset-1.5 border border-border dark:border-cyan-500/20" />

                      {/* Corner ticks */}
                      <span className="pointer-events-none absolute left-3 top-3 size-1.5 border-l-2 border-t-2 border-foreground/50 dark:border-cyan-400/70" />
                      <span className="pointer-events-none absolute right-3 top-3 size-1.5 border-r-2 border-t-2 border-foreground/50 dark:border-cyan-400/70" />
                      <span className="pointer-events-none absolute bottom-3 left-3 size-1.5 border-b-2 border-l-2 border-foreground/50 dark:border-cyan-400/70" />
                      <span className="pointer-events-none absolute bottom-3 right-3 size-1.5 border-b-2 border-r-2 border-foreground/50 dark:border-cyan-400/70" />

                      {/* Seal medallion */}
                      <div className="relative shrink-0 size-16 sm:size-17 rounded-full border border-border dark:border-cyan-400/50 bg-background dark:bg-slate-950/80 dark:shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                        <span className="pointer-events-none absolute inset-1 rounded-full border border-dashed border-foreground/30 dark:border-cyan-400/40" />
                        <span className="pointer-events-none absolute inset-2 rounded-full border border-foreground/50 dark:border-cyan-400/70" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          {cert.iconUrl ? (
                            <img
                              src={cert.iconUrl}
                              alt={`${cert.issuer} certificate seal`}
                              className="size-10 sm:size-12 object-contain"
                            />
                          ) : cert.icon ? (
                            <cert.icon className="size-8 sm:size-10 text-foreground/80 dark:text-cyan-300" />
                          ) : null}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="block font-mono text-[8px] uppercase tracking-[0.28em] text-muted-foreground dark:text-cyan-400/70">
                          Certificate of Achievement
                        </span>
                        <h4 className="mt-1 font-serif font-semibold text-sm sm:text-[15px] text-foreground dark:text-white dark:group-hover:text-cyan-300 leading-snug">
                          {cert.title}
                        </h4>

                        <div className="mt-1.5 inline-flex items-center gap-2">
                          <span className="h-px w-6 bg-foreground/30 dark:bg-cyan-500/40" />
                          <span className="size-1 rotate-45 bg-foreground/60 dark:bg-cyan-400 dark:shadow-[0_0_4px_rgba(0,240,255,0.8)]" />
                          <span className="h-px w-6 bg-foreground/30 dark:bg-cyan-500/40" />
                        </div>

                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/90 dark:text-cyan-300 font-semibold">
                            {cert.issuer}
                          </span>
                          <span className="h-3 w-px bg-border dark:bg-cyan-500/30" />
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground dark:text-cyan-500/70">
                            {cert.category}
                          </span>
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    </PageLayout>
  );
}

