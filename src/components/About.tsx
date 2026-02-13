export default function About() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* About Text */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
          About
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-muted-light dark:text-gray-400 leading-relaxed space-y-4">
          <p>
            I'm a full-stack software developer specializing in developing web and mobile applications. 
            I work on projects by using frameworks such as React, Laravel, and Flutter. 
          </p>
          <p>
            I use my free time to further enhance my skills by learning new technology trends
            and exploring different tools that can improve my development process.
          </p>
        </div>
      </div>
    </section>
  );
}
