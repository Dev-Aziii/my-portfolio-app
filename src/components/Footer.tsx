import { ArrowUpRight, Mail } from "lucide-react";
import type { Membership, SocialLink } from "@/data/types";

interface FooterProps {
  socialLinks: SocialLink[];
  memberships: Membership[];
  email: string;
}

export default function Footer({ socialLinks, memberships, email }: FooterProps) {
  return (
    <footer className="dashboard-contact-card">
      <div className="dashboard-section-header">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow--accent">Open to opportunities</span>
          <h2>Let&apos;s work together</h2>
        </div>
        <Mail aria-hidden="true" />
      </div>

      <p className="dashboard-copy__lead">Have a project in mind or want to discuss an opportunity? I&apos;d love to hear from you.</p>
      <a className="dashboard-action dashboard-action--primary dashboard-contact-card__email" href={`mailto:${email}`}>
        <Mail aria-hidden="true" />
        {email}
      </a>

      <div className="dashboard-contact-card__links">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
              <Icon aria-hidden="true" />
              {link.name}
              <ArrowUpRight aria-hidden="true" />
            </a>
          );
        })}
        {memberships.map((membership) => (
          <a key={membership.name} href={membership.href} target="_blank" rel="noopener noreferrer">
            {membership.name}
            <ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </div>

      <div className="dashboard-footer-note">
        <span>&copy; 2022 - {new Date().getFullYear()} University of Mindanao - Main Campus</span>
        <span>Adzyl Jipos · Portfolio edition</span>
      </div>
    </footer>
  );
}

