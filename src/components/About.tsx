interface AboutProps {
  paragraphs: string[];
}

export default function About({ paragraphs }: AboutProps) {
  return (
    <section className="py-2 border-b border-border">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
          [ SECTION 01 // BIOGRAPHY ]
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground">
        {paragraphs.map((text, i) => (
          <div key={i} className="space-y-2">
            <p className="text-sm leading-relaxed text-muted-foreground font-sans">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
