import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold text-text-light dark:text-white mb-8">
        {title}
      </h1>

      {children}
    </main>
  );
}
