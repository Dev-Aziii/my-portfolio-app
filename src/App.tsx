import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TechStackPage from "@/pages/TechStackPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ExperiencePage from "@/pages/ExperiencePage";
import CertificationsPage from "@/pages/CertificationsPage";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

import DashboardShell from "./components/DashboardShell";
import { PortfolioPreferences, usePortfolioPreferences } from "./components/PortfolioPreferences";
import { TerminalStateProvider } from "./components/terminal/TerminalState";
import TerminalShell from "./components/terminal/TerminalShell";
import TerminalHome from "./components/terminal/TerminalHome";
import { TerminalProjectsPage, TerminalProjectDetailPage, TerminalSkillsPage, TerminalExperiencePage, TerminalCertificationsPage, TerminalNotFound } from "./components/terminal/TerminalPages";

function App() {
  return (
    <BrowserRouter>
      <PortfolioPreferences>
        <TerminalStateProvider><PortfolioRoutes /></TerminalStateProvider>
      </PortfolioPreferences>
    </BrowserRouter>
  );
}

function PortfolioRoutes() {
  const { mode } = usePortfolioPreferences();
  const terminal = mode === "terminal";
  const Shell = terminal ? TerminalShell : DashboardShell;
  return (
      <Shell>
        <ScrollToTop />
        <Routes>
          <Route index element={terminal ? <TerminalHome /> : <Home />} />
          <Route path="/experience" element={terminal ? <TerminalExperiencePage /> : <ExperiencePage />} />
          <Route path="/tech-stack" element={terminal ? <TerminalSkillsPage /> : <TechStackPage />} />
          <Route path="/projects" element={terminal ? <TerminalProjectsPage /> : <ProjectsPage />} />
          <Route path="/projects/:slug" element={terminal ? <TerminalProjectDetailPage /> : <ProjectDetailPage />} />
          <Route path="/certifications" element={terminal ? <TerminalCertificationsPage /> : <CertificationsPage />} />
          <Route path="*" element={terminal ? <TerminalNotFound /> : <NotFound />} />
        </Routes>

      </Shell>
  );
}

export default App;

