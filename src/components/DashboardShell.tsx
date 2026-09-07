import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { heroData } from "@/data";

const navigation = [
  { id: "home", label: "Overview", route: "/", icon: LayoutDashboard },
  { id: "projects", label: "Projects", route: "/projects", icon: FolderKanban },
  { id: "skills", label: "Skills", route: "/tech-stack", icon: Code2 },
  { id: "experience", label: "Experience", route: "/experience", icon: BriefcaseBusiness },
  { id: "education", label: "Education", route: "/", icon: GraduationCap },
  { id: "certifications", label: "Certifications", route: "/certifications", icon: Award },
  { id: "contact", label: "Contact", route: "/", icon: Mail },
] as const;

type NavigationItem = (typeof navigation)[number];

function routeIsActive(item: NavigationItem, pathname: string) {
  if (item.id === "home" || item.id === "education" || item.id === "contact") {
    return pathname === "/";
  }

  return item.id === "projects"
    ? pathname.startsWith("/projects")
    : pathname === item.route;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isHome = location.pathname === "/";

  const currentNavigation = useMemo(
    () => navigation.find((item) => routeIsActive(item, location.pathname))?.id ?? "home",
    [location.pathname],
  );

  useEffect(() => {
    if (!isHome) {
      setActiveSection(currentNavigation);
      return;
    }

    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const threshold = window.innerHeight * 0.3;
        let current = "home";
        navigation.forEach((item) => {
          const section = document.getElementById(item.id);
          if (section && section.getBoundingClientRect().top <= threshold) {
            current = item.id;
          }
        });
        setActiveSection(current);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    const hash = location.hash.slice(1);
    if (hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      cancelAnimationFrame(frame);
    };
  }, [currentNavigation, isHome, location.hash]);

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

    if (isHome && document.getElementById(item.id)) {
      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate(item.id === "home" ? "/" : { pathname: item.route, hash: item.route === "/" ? `#${item.id}` : "" });
  };

  const sidebar = (
    <aside className={`dashboard-sidebar${isDrawerOpen ? " is-open" : ""}`} aria-label="Portfolio navigation">
      <div className="dashboard-sidebar__top">
        <a className="dashboard-profile" href="/" onClick={(event) => { event.preventDefault(); handleNavigation(navigation[0]); }}>
          <span className="dashboard-profile__image-wrap">
            <img src={heroData.profileImage} alt={heroData.name} className="dashboard-profile__image" />
            <span className="dashboard-profile__status" aria-label="Available for opportunities" />
          </span>
          <span className="dashboard-profile__name">{heroData.name}</span>
          <span className="dashboard-profile__role">{heroData.title}</span>
        </a>

      </div>

      <nav className="dashboard-nav" aria-label="Portfolio sections">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isHome ? activeSection === item.id : routeIsActive(item, location.pathname);
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

      <div className="dashboard-sidebar__footer" aria-hidden="true" />
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
          <button
            type="button"
            className="dashboard-icon-button"
            aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen((open) => !open)}
          >
            {isDrawerOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
