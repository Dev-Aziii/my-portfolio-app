interface AboutProps {
  paragraphs: string[];
}

export default function About({ paragraphs }: AboutProps) {
  return (
    <section className="py-2">
      {/* Light Mode Layout */}
      <div className="dark:hidden py-2 border-b border-border">
        <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
            [ 01 // BIOGRAPHY ]
          </h3>
        </div>

        <div className="flex flex-col gap-4 text-foreground">
          {paragraphs.map((text, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground font-sans">
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* Dark Mode HUD Panel */}
      <div className="hidden dark:block hud-panel p-5 sm:p-6 border border-cyan-500/25 bg-[#081220]/80 hud-corners">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
            [ 01 // BIOGRAPHY ]
          </h3>
          <span className="size-1.5 rounded-full bg-cyan-400/60" />
        </div>

        <div className="flex flex-col gap-3 text-slate-300">
          {paragraphs.map((text, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-300 font-sans">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

