import { Mail, ExternalLink } from "lucide-react";
import type { SocialLink, Membership } from "@/data/types";

interface FooterProps {
  socialLinks: SocialLink[];
  memberships: Membership[];
  email: string;
}

export default function Footer({ socialLinks, memberships, email }: FooterProps) {
  return (
    <footer className="w-full pt-8 pb-12 border-t-4 border-double border-border mt-12 text-foreground">
      {/* Editorial Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border">
        {/* Memberships */}
        <div className="space-y-3 md:border-r border-border md:pr-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
            [ AFFILIATIONS &amp; MEMBERSHIPS ]
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {memberships.map((m) => (
              <a
                key={m.name}
                className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors py-1 border-b border-border/50"
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{m.name}</span>
                <ExternalLink className="size-3 shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3 md:border-r border-border md:px-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
            [ NETWORK &amp; SOCIAL DISPATCH ]
          </h4>
          <div className="space-y-2 text-xs font-mono">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-1 border-b border-border/50"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact / Inquiries */}
        <div className="space-y-3 md:pl-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
            [ CORRESPONDENCE &amp; INQUIRIES ]
          </h4>
          <div className="bg-card border border-border p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Mail className="size-3.5 text-foreground" />
              <span>DIRECT EMAIL</span>
            </div>
            <a
              href={`mailto:${email}`}
              className="block font-mono text-xs font-bold text-foreground hover:underline truncate"
            >
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Colophon & Copyright */}
      <div className="pt-6 text-center space-y-2 font-mono text-[11px] text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ADZYL JIPOS. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
}
