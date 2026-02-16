import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import InteractiveDotBackground from "@/components/InteractiveDotBackground";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InteractiveDotBackground />
    <App />
  </StrictMode>
);
