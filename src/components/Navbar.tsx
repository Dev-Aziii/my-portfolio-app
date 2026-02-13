import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-lg font-bold tracking-tight text-text-light dark:text-white">
          Adzyl.
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
