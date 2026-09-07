import { Award, Code2, GitCommitHorizontal, GraduationCap } from "lucide-react";
import type { DashboardStats as DashboardStatsData } from "@/lib/dashboard";

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

const cards = [
  { key: "projects", label: "Projects Completed", icon: Code2 },
  { key: "contributions", label: "GitHub Contributions", icon: GitCommitHorizontal },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "education", label: "Education Entries", icon: GraduationCap },
] as const;

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="dashboard-stats" aria-label="Portfolio statistics">
      {cards.map(({ key, label, icon: Icon }) => {
        const value = stats[key];
        const displayValue = key === "contributions" ? `${value.toLocaleString()}+` : value;

        return (
          <article key={key} className="dashboard-stat-card">
            <span className="dashboard-stat-card__icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="dashboard-stat-card__body">
              <strong>{displayValue}</strong>
              <span>{label}</span>
            </span>
          </article>
        );
      })}
    </section>
  );
}
