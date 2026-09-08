import type { CSSProperties } from "react";
import type { ProjectTheme } from "@/data/types";

export type ProjectThemeStyle = CSSProperties &
  Record<`--project-${string}`, string>;

export function getProjectThemeStyle(theme: ProjectTheme): ProjectThemeStyle {
  return {
    "--project-accent-light": theme.light.accent,
    "--project-wash-light": theme.light.wash,
    "--project-border-light": theme.light.border,
    "--project-accent-dark": theme.dark.accent,
    "--project-wash-dark": theme.dark.wash,
    "--project-border-dark": theme.dark.border,
  };
}
