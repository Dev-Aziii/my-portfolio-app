import { Mail, ExternalLink } from "lucide-react";
import type { SocialLink, Membership } from "@/data/types";

interface FooterProps {
  socialLinks: SocialLink[];
  memberships: Membership[];
  email: string;
}

export default function Footer({ socialLinks, memberships, email }: FooterProps) {
  return (
    <>
      {/* Footer Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border-light dark:border-border-dark">
        {/* Memberships */}
        <div>
          <h3 className="font-bold text-text-light dark:text-white mb-4">
            A member of
          </h3>
          <div className="space-y-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            {memberships.map((m) => (
              <a
                key={m.name}
                className="flex items-start justify-between hover:text-text-light dark:hover:text-white transition-colors"
                href={m.href}
              >
                <span>{m.name}</span>
                <ExternalLink className="size-3.5 shrink-0 ml-2 mt-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-bold text-text-light dark:text-white mb-4">
            Social Links
          </h3>
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors"
                  href={link.href}
                >
                  <Icon />
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-text-light dark:text-white mb-4">
            Contact
          </h3>
          <div className="space-y-4">
            <a
              className="block p-3 bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark hover:border-text-light dark:hover:border-white transition-colors"
              href={`mailto:${email}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Mail className="size-3.5 text-text-light dark:text-white" />
                <span className="text-xs font-bold uppercase tracking-wide text-text-muted-light dark:text-text-muted-dark">
                  Email
                </span>
              </div>
              <p className="text-sm font-medium text-text-light dark:text-text-dark">
                {email}
              </p>
            </a>            
          </div>
        </div>
      </section>

      {/* Copyright */}
      <footer className="text-center mt-15 text-sm text-text-muted-light dark:text-text-muted-dark">
        <p>&copy; 2026 Adzyl Jipos. All rights reserved.</p>
      </footer>
    </>
  );
}
