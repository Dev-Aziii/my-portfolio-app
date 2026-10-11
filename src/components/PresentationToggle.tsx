import { usePortfolioPreferences } from "./PortfolioPreferences";

export default function PresentationToggle() {
  const { mode, setMode } = usePortfolioPreferences();
  return <button type="button" className="presentation-toggle" aria-pressed={mode === "terminal"} onClick={() => setMode(mode === "terminal" ? "dashboard" : "terminal")}>
    <span aria-hidden="true">&gt;_</span> Terminal Mode
  </button>;
}
