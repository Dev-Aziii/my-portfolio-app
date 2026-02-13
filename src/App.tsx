import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TechStackPage from "@/pages/TechStackPage";
import ProjectsPage from "@/pages/ProjectsPage";
import CertificationsPage from "@/pages/CertificationsPage";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/tech-stack" element={<TechStackPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
  