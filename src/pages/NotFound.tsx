import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Not Found | Adzyl Jipos");

  return (
    <section className="dashboard-panel" aria-labelledby="not-found-heading">
      <div className="dashboard-section-header">
        <div>
          <span className="dashboard-eyebrow">Portfolio workspace</span>
          <h1 id="not-found-heading">Page not found</h1>
        </div>
        <span className="dashboard-section-index">404</span>
      </div>
      <p className="dashboard-copy__lead">This route does not exist.</p>
      <Link className="dashboard-action" to="/">Back to Overview</Link>
    </section>
  );
}
