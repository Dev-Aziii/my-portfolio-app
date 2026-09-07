import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { ComponentType, ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
  logo?: string;
  icon?: ComponentType<{ className?: string }>;
}

export default function PageLayout({
  title,
  children,
  backTo = "/",
  backLabel = "Back to Overview",
  logo,
  icon: IconComponent,
}: PageLayoutProps) {
  return (
    <div className="dashboard-route-page">
      <div className="dashboard-route-page__topbar">
        <Link to={backTo} className="dashboard-back-link">
          <ArrowLeft aria-hidden="true" />
          {backLabel}
        </Link>
        <span className="dashboard-eyebrow">Portfolio workspace</span>
      </div>

      <div className="dashboard-route-page__heading">
        {logo ? (
          <img src={logo} alt="" className="dashboard-route-page__icon" />
        ) : IconComponent ? (
          <span className="dashboard-route-page__icon dashboard-route-page__icon--glyph">
            <IconComponent aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <span className="dashboard-eyebrow">Portfolio section</span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="dashboard-route-page__content">{children}</div>
    </div>
  );
}

