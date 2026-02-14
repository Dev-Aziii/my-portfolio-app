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
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-md text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-text-light dark:text-white">
            {title}
          </h1>
        </div>
        <ThemeToggle />
      </div>

      {children}
    </main>
  );
}
