import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TechStackPage from "@/pages/TechStackPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import CertificationsPage from "@/pages/CertificationsPage";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <div className="app-content-layer">
        <ScrollToTop />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/tech-stack" element={<TechStackPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
