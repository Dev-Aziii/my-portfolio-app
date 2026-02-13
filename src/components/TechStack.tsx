import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { TechCategory } from "@/data/types";

interface TechStackProps {
  categories: TechCategory[];
  limit?: number;
  categoryLimit?: number;
  showViewAll?: boolean;
  compact?: boolean;
}

export default function TechStack({ categories, limit, categoryLimit, showViewAll, compact }: TechStackProps) {
  const displayCategories = categoryLimit ? categories.slice(0, categoryLimit) : categories;

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold text-text-light dark:text-white`}>
          Tech Stack
        </h2>
        {showViewAll && (
          <Link
            className="text-sm font-medium text-text-light dark:text-text-dark hover:text-gray-500 transition-colors flex items-center"
            to="/tech-stack"
          >
            View All
            <ChevronRight className="size-4 ml-1" />
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {displayCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted-light dark:text-text-muted-dark">No tech stack added yet.</p>
          </div>
        ) : displayCategories.map((category) => {
          const items = limit ? category.items.slice(0, limit) : category.items;
          return (
            <div key={category.name}>
              <h3 className="text-sm uppercase tracking-wider font-semibold text-text-muted-light dark:text-text-muted-dark mb-3">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark shadow-sm hover:border-text-light dark:hover:border-white transition-colors cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}