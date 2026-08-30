interface AboutProps {
  paragraphs: string[];
}

export default function About({ paragraphs }: AboutProps) {
  return (
    <section className="py-2">
      <div className="p-5 sm:p-6 bg-card dark:bg-[#081220]/80 border border-border dark:border-cyan-500/25 hud-corners transition-colors">
        <div className="flex items-center justify-between border-b border-border dark:border-cyan-500/20 pb-2.5 mb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground dark:text-cyan-400 font-bold flex items-center gap-2">
            [ 01 // BIOGRAPHY ]
          </h3>
          <span className="hidden dark:inline-block size-1.5 rounded-full bg-cyan-400/60" />
        </div>

        <div className="flex flex-col gap-3 text-muted-foreground dark:text-slate-300">
          {paragraphs.map((text, i) => (
            <p key={i} className="text-sm leading-relaxed font-sans">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
