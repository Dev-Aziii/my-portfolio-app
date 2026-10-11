import { useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { heroData, socialLinks } from "@/data";
import { usePortfolioPreferences } from "@/components/PortfolioPreferences";
import { formatDirectory, routeToDirectory } from "@/lib/terminal/filesystem";
import TerminalPanel from "./TerminalPanel";
import { useTerminalState } from "./TerminalState";
import "./terminal.css";

const navigation = [["Home", "/"], ["Projects", "/projects"], ["Skills", "/tech-stack"], ["Experience", "/experience"], ["Certifications", "/certifications"], ["Contact", "/#contact"]];

export default function TerminalShell({ children }: { children: ReactNode }) {
  const { setMode } = usePortfolioPreferences();
  const { filesystem, panelOpen, setPanelOpen } = useTerminalState();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const cwd = routeToDirectory(location.pathname, location.hash, filesystem);
  useEffect(() => {
    const shell = shellRef.current, header = headerRef.current;
    if (!shell || !header) return;
    const measure = () => shell.style.setProperty("--terminal-header-height", `${header.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const viewport = window.visualViewport, shell = shellRef.current;
    if (!viewport || !shell) return;
    const update = () => {
      shell.style.setProperty("--terminal-visible-height", `${viewport.height}px`);
      shell.style.setProperty("--terminal-viewport-top", `${viewport.offsetTop}px`);
      shell.style.setProperty("--terminal-keyboard-offset", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
    };
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    update();
    return () => { viewport.removeEventListener("resize", update); viewport.removeEventListener("scroll", update); };
  }, []);
  useEffect(() => {
    if (location.pathname !== "/" || !["#about", "#contact"].includes(location.hash)) return;
    const frame = requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start", behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return <div ref={shellRef} className="terminal-shell">
    <a href="#terminal-main" className="terminal-skip-link">Skip to content</a>
    <header ref={headerRef} className="terminal-header">
      <div className="terminal-header-identity"><Link to="/">~/portfolio</Link><span>Hello, I&apos;m Azi <span className="terminal-cursor" aria-hidden="true">█</span></span></div>
      <div className="terminal-header-controls"><span className="terminal-muted">{cwd ? formatDirectory(cwd) : `[404] ${location.pathname}`}</span><div className="terminal-actions"><button ref={launcherRef} type="button" data-terminal-launcher aria-expanded={panelOpen} aria-controls="terminal-console" onClick={() => { if (panelOpen) { const transcript = inputRef.current?.closest(".terminal-transcript"); if (transcript) transcript.scrollTop = transcript.scrollHeight; inputRef.current?.focus({ preventScroll: true }); } else setPanelOpen(true); }}>[ {panelOpen ? "Focus" : "Open"} Terminal ]</button><button type="button" data-dashboard-return onClick={() => setMode("dashboard")}>[ Dashboard Mode ]</button></div></div>
      <nav className="terminal-nav" aria-label="Portfolio sections">{navigation.map(([label, to]) => <Link key={label} to={to} aria-current={location.pathname + (location.hash || "") === to || (to === "/projects" && location.pathname.startsWith("/projects/")) ? "page" : undefined}>[ {label} ]</Link>)}</nav>
    </header>
    <main id="terminal-main" tabIndex={-1}>{children}</main>
    <TerminalPanel inputRef={inputRef} launcherRef={launcherRef} headerRef={headerRef} />
    <footer className="terminal-footer"><Link to="/">~/portfolio</Link><span>{heroData.name} · {heroData.title}</span><div className="terminal-actions">{socialLinks.map((link) => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">[ {link.name} ]</a>)}</div></footer>
  </div>;
}
