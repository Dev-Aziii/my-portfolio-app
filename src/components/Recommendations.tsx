import type { Recommendation } from "@/data/types";

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  return (
    <section className="py-4 border-b border-border">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
          [ RECOMMENDATION &amp; ENDORSEMENT ]
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground uppercase">
          TESTIMONIAL
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 font-mono text-xs text-muted-foreground">
          NO RECOMMENDATIONS YET.
        </div>
      ) : (
        <div className="bg-card border border-border p-6 relative my-2">
          <span className="font-serif text-5xl text-muted-foreground/30 absolute top-2 left-4 select-none leading-none">
            &ldquo;
          </span>
          <blockquote className="relative z-10 space-y-4">
            <p className="font-serif italic text-base sm:text-lg text-foreground leading-relaxed">
              {recommendations[0].quote}
            </p>
            <footer className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-sm text-foreground">
                  {recommendations[0].author}
                </p>
                <p className="font-mono text-xs text-muted-foreground uppercase">
                  {recommendations[0].title}
                </p>
              </div>
              <div className="w-8 h-8 border border-border flex items-center justify-center font-mono text-xs font-bold text-foreground bg-background">
                {recommendations[0].initials}
              </div>
            </footer>
          </blockquote>
        </div>
      )}
    </section>
  );
}
