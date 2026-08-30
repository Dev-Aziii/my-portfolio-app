import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import AdaptiveThemeBackground from "@/components/AdaptiveThemeBackground";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdaptiveThemeBackground />
    <App />
  </StrictMode>
);
