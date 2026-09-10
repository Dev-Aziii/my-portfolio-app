import { useEffect, useState } from "react";
import {
  Award,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  FolderKanban,
  Github,
  LayoutDashboard,
  Mail,
  Menu,
  Linkedin,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { heroData, profileAscii, socialLinks } from "@/data";
import ThemeToggle from "@/components/ThemeToggle";
import ProfilePortraitDissolve from "@/components/ProfilePortraitDissolve";

const navigation = [
  { id: "home", label: "Overview", route: "/", icon: LayoutDashboard },
  { id: "projects", label: "Projects", route: "/projects", icon: FolderKanban },
  { id: "skills", label: "Skills", route: "/tech-stack", icon: Code2 },
  { id: "experience", label: "Experience", route: "/experience", icon: BriefcaseBusiness },
  { id: "certifications", label: "Certifications", route: "/certifications", icon: Award },
] as const;

type NavigationItem = (typeof navigation)[number];

const quickLinks = [
  { label: "GitHub", href: socialLinks.find((link) => link.name === "GitHub")?.href ?? "https://github.com/Dev-Aziii", icon: Github, external: true },
  { label: "LinkedIn", href: socialLinks.find((link) => link.name === "LinkedIn")?.href ?? "https://www.linkedin.com/in/adzyl-jipos-287350364/", icon: Linkedin, external: true },
  { label: "Download CV", href: heroData.cvUrl, icon: Download, external: false },
] as const;

function routeIsActive(item: NavigationItem, pathname: string) {
  if (item.id === "home") {
    return pathname === "/";
  }

  return item.id === "projects"
    ? pathname === "/projects" || pathname.startsWith("/projects/")
    : pathname === item.route;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileImageRevealed, setIsProfileImageRevealed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen]);

  const handleNavigation = (item: NavigationItem) => {
    setIsDrawerOpen(false);
    navigate(item.route);
  };

  const sidebar = (
    <aside className={`dashboard-sidebar${isDrawerOpen ? " is-open" : ""}`} aria-label="Portfolio navigation">
      <div className="dashboard-sidebar__top">
        <div className="dashboard-profile-art" data-profile-revealed={isProfileImageRevealed} aria-hidden="true">
          <span className="dashboard-profile-art__mantra">Commit<br />Push<br />Pray</span>
          <pre className="dashboard-profile-art__portrait" data-profile-ascii aria-hidden="true">{profileAscii}</pre>
          <ProfilePortraitDissolve src={heroData.profileImage} revealed={isProfileImageRevealed} />
        </div>

        <button
          type="button"
          className="dashboard-profile"
          data-profile-toggle
          aria-pressed={isProfileImageRevealed}
          aria-label={isProfileImageRevealed ? "Show ASCII portrait" : "Show profile photo"}
          onClick={() => setIsProfileImageRevealed((revealed) => !revealed)}
        >
          <svg
            className="dashboard-profile__frame"
            viewBox="0 0 252 94"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="dashboard-profile__shape-bg"
              d="M 0 12 C 0 5.37 5.37 0 12 0 L 132 0 C 135 0 137.5 1.5 139.2 3.8 L 159.8 24.2 C 161.5 26 164 26 166 26 L 240 26 C 246.63 26 252 31.37 252 38 L 252 82 C 252 88.63 246.63 94 240 94 L 12 94 C 5.37 94 0 88.63 0 82 Z"
            />
            <path
              className="dashboard-profile__shape-stroke"
              d="M 0.5 12 C 0.5 5.65 5.65 0.5 12 0.5 L 132 0.5 C 135 0.5 137.5 2 139.2 4.1 L 159.8 24.5 C 161.5 26.5 164 26.5 166 26.5 L 240 26.5 C 246.35 26.5 251.5 31.65 251.5 38 L 251.5 82 C 251.5 88.35 246.35 93.5 240 93.5 L 12 93.5 C 5.65 93.5 0.5 88.35 0.5 82 Z"
            />
            <line
              className="dashboard-profile__shape-accent"
              x1="162"
              y1="94"
              x2="216"
              y2="40"
            />
          </svg>

          <span className="dashboard-profile__content">
            <span className="dashboard-profile__top-row">
              <span className="dashboard-profile__name">Azi</span>
              <span className="dashboard-profile__status-badge">
                <span className="dashboard-profile__status-line" aria-hidden="true" />
                <span className="dashboard-profile__status-dot" aria-hidden="true" />
                <span className="dashboard-profile__status-dot" aria-hidden="true" />
                <span className="dashboard-profile__status-dot" aria-hidden="true" />
              </span>
            </span>

            <span className="dashboard-profile__bottom-row">
              <span className="dashboard-profile__tagline">&gt; Turning ideas into solutions</span>
              <span className="dashboard-profile__tech-code" aria-hidden="true">//</span>
            </span>
          </span>
        </button>
      </div>

      <div className="dashboard-sidebar__middle">
        <nav className="dashboard-nav" aria-label="Portfolio sections">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = routeIsActive(item, location.pathname);
            return (
              <button
                key={item.id}
                type="button"
                className="dashboard-nav__item"
                data-active={active}
                aria-current={active ? "page" : undefined}
                onClick={() => handleNavigation(item)}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
                {active && <span className="dashboard-nav__indicator" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        <section className="dashboard-sidebar__section" aria-labelledby="sidebar-quick-links">
          <span id="sidebar-quick-links" className="dashboard-sidebar__section-label">Quick links</span>
          <div className="dashboard-sidebar__link-list">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  className="dashboard-sidebar__quick-link"
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  <Icon aria-hidden="true" />
                  <span>{link.label}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </section>

      </div>

      <div className="dashboard-sidebar__footer-group">
        <ThemeToggle />
        <div className="dashboard-sidebar__footer">
          <span className="dashboard-sidebar__footer-label">For work and collaboration contact me at</span>
          <a className="dashboard-sidebar__footer-email" href={`mailto:${heroData.email}`} aria-label={`Email ${heroData.email}`}>
            <Mail aria-hidden="true" />
            <span>{heroData.email}</span>
          </a>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell__backdrop" aria-hidden="true" />
      {sidebar}
      {isDrawerOpen && (
        <button
          type="button"
          className="dashboard-drawer-overlay"
          aria-label="Close navigation"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      <div className="dashboard-shell__content">
        <header className="dashboard-mobile-bar">
          <a href="/" onClick={(event) => { event.preventDefault(); handleNavigation(navigation[0]); }}>
            <span>{heroData.name}</span>
          </a>
          <div className="dashboard-mobile-bar__actions">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isDrawerOpen}
              onClick={() => setIsDrawerOpen((open) => !open)}
            >
              {isDrawerOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
