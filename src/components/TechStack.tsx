import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { TechCategory } from "@/data/types";

interface TechStackProps {
  categories: TechCategory[];
  limit?: number;
  categoryLimit?: number;
  showViewAll?: boolean;
  compact?: boolean;
  hideTitle?: boolean;
}
export default function TechStack({
  categories,
  limit,
  categoryLimit,
  showViewAll,
  hideTitle,
}: TechStackProps) {
  const displayCategories = categoryLimit ? categories.slice(0, categoryLimit) : categories;

  return (
    <section className="dashboard-panel" aria-labelledby={hideTitle ? undefined : "skills-heading"}>
      {!hideTitle && (
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-eyebrow">Tools I use</span>
            <h2 id="skills-heading">Skills</h2>
          </div>
          {showViewAll && (
            <Link to="/tech-stack" className="dashboard-inline-link">
              View all <ArrowUpRight aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      <div className="dashboard-skill-groups">
        {displayCategories.map((category) => (
          <div key={category.name} className="dashboard-skill-group">
            <span className="dashboard-eyebrow">{category.name}</span>
            <div className="dashboard-skill-pills">
              {category.items.slice(0, limit).map((item) => (
                <span
                  key={item.name}
                  className="dashboard-skill-pill dashboard-skill-pill--tech"
                  style={{ "--tech-brand-color": item.brandColor } as CSSProperties}
                >
                  <item.icon className="dashboard-skill-pill__icon" aria-hidden="true" />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
