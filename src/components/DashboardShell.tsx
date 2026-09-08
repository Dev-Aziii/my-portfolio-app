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
  MessageCircle,
  Linkedin,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { heroData, socialLinks } from "@/data";
import ThemeToggle from "@/components/ThemeToggle";

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
        <a className="dashboard-profile" href="/" onClick={(event) => { event.preventDefault(); handleNavigation(navigation[0]); }}>
          <span className="dashboard-profile__image-wrap">
            <img src={heroData.profileImage} alt={heroData.name} className="dashboard-profile__image" />
            <span className="dashboard-profile__status" aria-label="Available for opportunities" />
          </span>
          <span className="dashboard-profile__name">Azi</span>
          <span className="dashboard-profile__role">{heroData.title}</span>
        </a>

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

        <section className="dashboard-sidebar__section" aria-labelledby="sidebar-connect">
          <span id="sidebar-connect" className="dashboard-sidebar__section-label">Let&apos;s connect</span>
          <div className="dashboard-sidebar__link-list">
            <a className="dashboard-sidebar__contact-link" href={`mailto:${heroData.email}`}>
              <Mail aria-hidden="true" />
              <span>Get in touch</span>
            </a>
            <a className="dashboard-sidebar__contact-link" href={`mailto:${heroData.email}?subject=Portfolio%20inquiry`}>
              <MessageCircle aria-hidden="true" />
              <span>Send a message</span>
            </a>
          </div>
        </section>
      </div>

      <div className="dashboard-sidebar__footer-group">
        <ThemeToggle />
        <a className="dashboard-sidebar__footer" href={`mailto:${heroData.email}`} aria-label={`Email ${heroData.email}`}>
          <Mail aria-hidden="true" />
          <span>{heroData.email}</span>
        </a>
        <span className="dashboard-sidebar__signature">Build <span aria-hidden="true">·</span> Learn <span aria-hidden="true">·</span> Create</span>
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
            <img src={heroData.profileImage} alt="" />
            <span>{heroData.name}</span>
          </a>
          <div className="dashboard-mobile-bar__actions">
            <ThemeToggle />
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
