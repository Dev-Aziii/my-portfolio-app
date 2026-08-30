import { chromium } from "playwright-core";
import { access } from "node:fs/promises";
import path from "node:path";

const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

async function edgePath() {
  for (const candidate of edgeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error("Edge executable not found");
}

const browser = await chromium.launch({ executablePath: await edgePath(), headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. Visit page in light mode
await page.goto("http://localhost:5174/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.setItem("theme", "light");
  document.documentElement.classList.remove("dark");
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);

const screenshotDir = "C:/Users/adzyl/.gemini/antigravity-ide/brain/c9b42de1-f88d-4221-92b3-e2f036f4290c";
await page.screenshot({ path: path.join(screenshotDir, "preview-light-paper.png") });
console.log("Captured light mode screenshot");

// 2. Trigger theme transition to dark mode and capture mid-sweep
const toggle = page.getByRole("button", { name: /Time Machine:/ }).first();
await toggle.click();
await page.waitForTimeout(450); // Mid-sweep
await page.screenshot({ path: path.join(screenshotDir, "preview-transition-sweep.png") });
console.log("Captured mid-transition sweep screenshot");

// 3. Settle in dark mode
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(screenshotDir, "preview-dark-cyber.png") });
console.log("Captured dark mode screenshot");

await browser.close();
console.log("Verification finished successfully!");
