import { useState } from "react";
import { ArrowUpRight, FileDown, Mail, MapPin, Maximize2, Minimize2 } from "lucide-react";
import type { HeroData, SocialLink } from "@/data/types";

interface HeroProps {
  data: HeroData;
  socialLinks: SocialLink[];
}

export default function Hero({ data, socialLinks }: HeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className={`dashboard-hero ${isExpanded ? "dashboard-hero--expanded" : "dashboard-hero--collapsed"}`}
      data-profile-hero
    >
      <button
        type="button"
        className="dashboard-hero__toggle"
        aria-label={isExpanded ? "Collapse hero section" : "Expand hero section"}
        aria-expanded={isExpanded}
        aria-controls="dashboard-hero-details"
        onClick={() => setIsExpanded((prev) => !prev)}
        title={isExpanded ? "Collapse view" : "Expand view"}
      >
        {isExpanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
      </button>

      <div className="dashboard-hero__copy">
        <div className="dashboard-hero__identity">
          <span className="dashboard-eyebrow dashboard-eyebrow--accent">Hello, I&apos;m</span>
          <h1>{data.name}</h1>
          <span className="dashboard-hero__collapsed-title" aria-hidden={isExpanded}>
            {data.title}
          </span>
        </div>

        <div
          id="dashboard-hero-details"
          className="dashboard-hero__expandable"
          aria-hidden={!isExpanded}
        >
          <div className="dashboard-hero__expandable-inner">
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
          </div>
        </div>

        <div className="dashboard-hero__actions">
          <a
            className="dashboard-action dashboard-action--primary"
            href={`mailto:${data.email}`}
            title="Get in touch"
          >
            <Mail aria-hidden="true" />
            <span>Get in touch</span>
          </a>
          <a
            className="dashboard-action"
            href={data.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Download CV"
          >
            <FileDown aria-hidden="true" />
            <span>Download CV</span>
          </a>
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                className="dashboard-action dashboard-action--quiet dashboard-action--social"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                aria-label={link.name}
              >
                <Icon aria-hidden="true" />
                <span className="dashboard-action__label">{link.name}</span>
                <ArrowUpRight className="dashboard-action__external" aria-hidden="true" />
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
