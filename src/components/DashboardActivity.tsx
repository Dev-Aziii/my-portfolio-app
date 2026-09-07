import { Activity, GitCommitHorizontal } from "lucide-react";
import { githubContributionsData } from "@/data/githubContributions";

const recentContributions = githubContributionsData.days
  .filter((day) => day.count > 0)
  .slice(-4)
  .reverse();

export default function DashboardActivity() {
  return (
    <section className="dashboard-panel dashboard-activity" aria-labelledby="activity-heading">
      <div className="dashboard-section-header">
        <div>
          <span className="dashboard-eyebrow">Open source signal</span>
          <h2 id="activity-heading">Recent Activity</h2>
        </div>
        <Activity aria-hidden="true" />
      </div>

      <div className="dashboard-activity__summary">
        <strong>{githubContributionsData.totalContributions.toLocaleString()}</strong>
        <span>contributions from @{githubContributionsData.username}</span>
      </div>

      <div className="dashboard-activity__list">
        {recentContributions.map((day) => (
          <div key={day.date} className="dashboard-activity__item">
            <span className="dashboard-activity__dot" aria-hidden="true" />
            <span>
              <strong>{day.count} contribution{day.count === 1 ? "" : "s"}</strong>
              <small>{day.date}</small>
            </span>
            <GitCommitHorizontal aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}

