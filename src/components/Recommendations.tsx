import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Recommendation } from "@/data/types";

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <section className="text-center py-8">
      <h2 className="text-2xl font-bold text-text-light dark:text-white mb-8">
        Recommendations
      </h2>
      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">No recommendations yet.</p>
        </div>
      ) : (
      <div className="max-w-2xl mx-auto bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-border-light dark:border-border-dark relative">
        {/* Decorative quote mark */}
        <span className="absolute top-6 left-6 text-6xl text-text-light dark:text-white opacity-20 font-serif leading-none select-none">
          &ldquo;
        </span>

        <p className="text-lg italic text-text-light dark:text-gray-300 leading-relaxed mb-6 z-10 relative">
          {recommendations[0].quote}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{recommendations[0].initials}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-bold text-sm text-text-light dark:text-white">
              {recommendations[0].author}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {recommendations[0].title}
            </p>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-6 gap-2">
          <span className="w-2 h-2 bg-text-light dark:bg-white rounded-full cursor-pointer" />
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 transition-colors"
            />
          ))}
        </div>
      </div>
      )}
    </section>
  );
}
