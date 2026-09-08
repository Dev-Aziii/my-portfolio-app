import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = process.env.PROJECT_VISUAL_BASE_URL ?? "http://localhost:5173/";
const outputDir =
  process.env.PROJECT_VISUAL_OUTPUT ??
  path.join(process.cwd(), "output", "playwright", "projects-catalog");
const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

async function edgePath() {
  for (const candidate of edgeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next standard installation path.
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

const viewports = [
  ["desktop", { width: 1440, height: 900 }, 2],
  ["tablet", { width: 1024, height: 768 }, 2],
  ["mobile", { width: 390, height: 844 }, 1],
];
const failures = [];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: await edgePath(),
  headless: true,
});

try {
  for (const theme of ["light", "dark"]) {
    for (const [name, viewport, expectedColumns] of viewports) {
      const page = await browser.newPage({ viewport });
      await page.addInitScript(
        (selectedTheme) => localStorage.setItem("theme", selectedTheme),
        theme,
      );
      await page.goto(new URL("projects", baseUrl).href, {
        waitUntil: "networkidle",
      });
      await page.waitForFunction(() =>
        [...document.images].every((image) => image.complete),
      );

      const state = await page.evaluate(() => {
        const catalog = document.querySelector("[data-project-catalog]");
        return {
          cards: document.querySelectorAll("[data-project-catalog-card]")
            .length,
          columns: catalog
            ? getComputedStyle(catalog)
                .gridTemplateColumns.split(" ")
                .filter(Boolean).length
            : 0,
          overflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
          dark: document.documentElement.classList.contains("dark"),
        };
      });

      if (
        state.cards !== 4 ||
        state.columns !== expectedColumns ||
        state.overflow ||
        state.dark !== (theme === "dark")
      ) {
        failures.push(`${theme} ${name}`);
      }

      await page.screenshot({
        path: path.join(outputDir, `projects-${theme}-${name}.png`),
        fullPage: true,
      });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(
  JSON.stringify({ passed: failures.length === 0, failures, outputDir }),
);
if (failures.length) process.exitCode = 1;
