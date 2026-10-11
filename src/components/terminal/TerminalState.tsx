import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { usePortfolioPreferences } from "@/components/PortfolioPreferences";
import { createFilesystem } from "@/lib/terminal/filesystem";
import { initialSession, type TerminalSession } from "@/lib/terminal/session";
import type { PortfolioFilesystem } from "@/lib/terminal/types";

const filesystem = createFilesystem();
interface TerminalState { filesystem: PortfolioFilesystem; session: TerminalSession; setSession: Dispatch<SetStateAction<TerminalSession>>; panelOpen: boolean; setPanelOpen: Dispatch<SetStateAction<boolean>>; preferredHeight: number | null; setPreferredHeight: Dispatch<SetStateAction<number | null>> }
const TerminalContext = createContext<TerminalState | null>(null);
export function TerminalStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(initialSession);
  const [panelOpen, setPanelOpen] = useState(false);
  const [preferredHeight, setPreferredHeight] = useState<number | null>(null);
  const { mode } = usePortfolioPreferences();
  useEffect(() => { if (mode !== "terminal") setPanelOpen(false); }, [mode]);
  return <TerminalContext.Provider value={{ filesystem, session, setSession, panelOpen, setPanelOpen, preferredHeight, setPreferredHeight }}>{children}</TerminalContext.Provider>;
}
export function useTerminalState(): TerminalState {
  const value = useContext(TerminalContext);
  if (!value) throw new Error("Terminal state must be used inside its provider.");
  return value;
}
