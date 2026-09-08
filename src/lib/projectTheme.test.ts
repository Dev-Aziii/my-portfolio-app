import { describe, expect, it } from "vitest";
import type { ProjectTheme } from "@/data/types";
import { getProjectThemeStyle } from "./projectTheme";

describe("getProjectThemeStyle", () => {
  it("maps both project theme tones to stable CSS custom properties", () => {
    const theme: ProjectTheme = {
      light: {
        accent: "#c02667",
        wash: "#fde7f0",
        border: "#eaa3c1",
      },
      dark: {
        accent: "#ff6fa8",
        wash: "#2a111d",
        border: "#78314e",
      },
    };

    expect(getProjectThemeStyle(theme)).toEqual({
      "--project-accent-light": "#c02667",
      "--project-wash-light": "#fde7f0",
      "--project-border-light": "#eaa3c1",
      "--project-accent-dark": "#ff6fa8",
      "--project-wash-dark": "#2a111d",
      "--project-border-dark": "#78314e",
    });
  });
});
