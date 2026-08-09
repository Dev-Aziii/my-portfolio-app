interface AboutProps {
  paragraphs: string[];
}

export default function About({ paragraphs }: AboutProps) {
  return (
    <section className="py-2 border-b border-border">
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
    </section>
  );
}
