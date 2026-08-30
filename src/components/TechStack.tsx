import { ChevronRight } from "lucide-react";
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
  const displayCategories = categoryLimit
    ? categories.slice(0, categoryLimit)
    : categories;

  return (
    <section className="h-full flex flex-col justify-between">
      <div className="p-5 sm:p-6 bg-card dark:bg-[#081220]/80 border border-border dark:border-cyan-500/25 hud-corners h-full transition-colors">
        {!hideTitle && (
          <div className="flex justify-between items-center border-b border-border dark:border-cyan-500/20 pb-2.5 mb-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground dark:text-cyan-400 font-bold flex items-center gap-2">
              [ 03 // STACK ]
            </h3>
            {showViewAll && (
              <Link
                className="font-mono text-xs text-muted-foreground dark:text-cyan-400/80 hover:text-foreground dark:hover:text-cyan-300 transition-colors flex items-center uppercase tracking-wider group"
                to="/tech-stack"
              >
                VIEW ALL
                <ChevronRight className="size-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        )}

        <div className="space-y-4">
          {displayCategories.length === 0 ? (
            <div className="text-center py-8 font-mono text-xs text-muted-foreground dark:text-cyan-400/60">
              NO TECH STACK RECORDED.
            </div>
          ) : (
            displayCategories.map((category) => {
              const items = limit
                ? category.items.slice(0, limit)
                : category.items;
              return (
                <div key={category.name} className="space-y-2">
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:text-cyan-400/90">
                    // {category.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.name}
                          className="mono-tag inline-flex items-center gap-1.5 cursor-default hover:bg-card dark:hover:bg-cyan-950/40"
                        >
                          <Icon className="size-3 text-foreground dark:text-cyan-400 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
