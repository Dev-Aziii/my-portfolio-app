import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

export default function TerminalPageLayout({ title, children }: { title: string; children: ReactNode }) {
  usePageTitle(`${title} | Adzyl Jipos`);
  return <div className="terminal-page">
    <Link to="/" className="terminal-back">[ ← Portfolio home ]</Link>
    <header className="terminal-page-heading"><span className="terminal-muted">~/portfolio</span><h1>&gt; {title}<span className="terminal-cursor" aria-hidden="true">_</span></h1></header>
    {children}
  </div>;
}
