import type { PresentationMode } from "../presentation";

export interface OutputEntry {
  kind: "text" | "error" | "link";
  text: string;
  href?: string;
}

export interface CommandResult {
  output: OutputEntry[];
  navigate?: string;
  clear?: boolean;
  presentation?: PresentationMode;
}

export type VirtualNode =
  | { kind: "directory"; route: string; description: string }
  | { kind: "file"; content: OutputEntry[]; description: string };

export interface PortfolioFilesystem {
  nodes: Record<string, VirtualNode>;
  links: Record<string, { text: string; href: string }>;
}
