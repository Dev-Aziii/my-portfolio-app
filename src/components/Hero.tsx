import { ArrowUpRight, FileDown, Mail, MapPin } from "lucide-react";
import type { HeroData, SocialLink } from "@/data/types";

interface HeroProps {
  data: HeroData;
  socialLinks: SocialLink[];
}

export default function Hero({ data, socialLinks }: HeroProps) {
  return (
    <section className="dashboard-hero" data-profile-hero>
      <div className="dashboard-hero__copy">
        <span className="dashboard-eyebrow dashboard-eyebrow--accent">Hello, I&apos;m</span>
        <h1>{data.name}</h1>
        <p className="dashboard-hero__title">{data.title}</p>
        <p className="dashboard-hero__intro">
          I&apos;m a full-stack developer building web and mobile apps with a focus on clean code,
          scalable systems, and thoughtful user experiences.
        </p>

        <div className="dashboard-hero__meta">
          <span>
            <MapPin aria-hidden="true" />
            {data.location}
          </span>
          <a href={`mailto:${data.email}`}>
            <Mail aria-hidden="true" />
            {data.email}
          </a>
        </div>

        <div className="dashboard-hero__actions">
          <a className="dashboard-action dashboard-action--primary" href={`mailto:${data.email}`}>
            <Mail aria-hidden="true" />
            Get in touch
          </a>
          <a className="dashboard-action" href={data.cvUrl} target="_blank" rel="noopener noreferrer">
            <FileDown aria-hidden="true" />
            Download CV
          </a>
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a key={link.name} className="dashboard-action dashboard-action--quiet" href={link.href} target="_blank" rel="noopener noreferrer">
                <Icon aria-hidden="true" />
                {link.name}
                <ArrowUpRight aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
      <div className="dashboard-hero__art" aria-hidden="true">
        <img src="/images/azii.webp" alt="" />
      </div>
    </section>
  );
}
