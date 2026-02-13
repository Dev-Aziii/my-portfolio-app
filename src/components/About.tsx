interface AboutProps {
  paragraphs: string[];
}

export default function About({ paragraphs }: AboutProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* About Text */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
          About
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-muted-light dark:text-gray-400 leading-relaxed space-y-4">
          {paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
