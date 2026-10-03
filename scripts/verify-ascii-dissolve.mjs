import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = process.env.DASHBOARD_BASE_URL ?? "http://localhost:5173/";
const outputDir = path.join(process.cwd(), "output", "playwright", "ascii-dissolve");
await mkdir(outputDir, { recursive: true });

const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

async function findEdge() {
  for (const candidate of edgeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {}
  }
  throw new Error("Microsoft Edge executable was not found.");
}

const browser = await chromium.launch({ executablePath: await findEdge(), headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log("Navigating to", baseUrl);
await page.goto(baseUrl, { waitUntil: "networkidle" });

// 1. Initial Page Load Check
const initialFrames = [];
for (let i = 0; i < 5; i++) {
  const sample = await page.evaluate(() => {
    const el = document.querySelector("[data-profile-ascii]");
    const text = el?.textContent ?? "";
    const lines = text.split("\n");
    const nonEmptyLines = lines.filter((l) => l.trim().length > 0).length;
    return { linesCount: lines.length, nonEmptyLines, sampleLine0: lines[0]?.trim(), sampleLine25: lines[25]?.trim(), sampleLine50: lines[50]?.trim() };
  });
  initialFrames.push(sample);
  await page.waitForTimeout(250);
}
console.log("Initial load cascade frames:", JSON.stringify(initialFrames, null, 2));

// Wait for initial cascade to complete
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outputDir, "01-initial-settled.png") });

// 2. Click to reveal photo (ASCII -> Photo)
console.log("Toggling to photo...");
const toggleButton = page.locator("[data-profile-toggle]");
await toggleButton.click();

// Sample at 300ms (inverted erase in progress)
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outputDir, "02-revealing-photo-mid.png") });
const photoMid = await page.evaluate(() => {
  const el = document.querySelector("[data-profile-ascii]");
  const lines = (el?.textContent ?? "").split("\n");
  return {
    topRowHasChars: lines[5]?.trim().length > 0,
    bottomRowHasChars: lines[48]?.trim().length > 0,
    dissolveState: document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"),
  };
});
console.log("Photo reveal mid (bottom-to-top erase):", photoMid);

// Wait for photo reveal to complete
await page.waitForTimeout(1100);
await page.screenshot({ path: path.join(outputDir, "03-photo-open.png") });

// 3. Click to dissolve back to ASCII (Photo -> ASCII)
console.log("Toggling back to ASCII (dissolving photo)...");
await toggleButton.click();

// Sample at 200ms
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(outputDir, "04-dissolve-early.png") });
const dissolveEarly = await page.evaluate(() => {
  const el = document.querySelector("[data-profile-ascii]");
  const lines = (el?.textContent ?? "").split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0).length;
  return {
    nonEmptyLines: nonEmpty,
    dissolveState: document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"),
  };
});
console.log("Dissolve early (200ms):", dissolveEarly);

// Sample at 600ms (top rows unlocked, bottom rows still blank)
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outputDir, "05-dissolve-mid.png") });
const dissolveMid = await page.evaluate(() => {
  const el = document.querySelector("[data-profile-ascii]");
  const lines = (el?.textContent ?? "").split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0).length;
  return {
    nonEmptyLines: nonEmpty,
    topRowTrimmed: lines[5]?.trim(),
    bottomRowTrimmed: lines[48]?.trim(),
    dissolveState: document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"),
  };
});
console.log("Dissolve mid (600ms):", dissolveMid);

// Sample at 1000ms (cascade near bottom)
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outputDir, "06-dissolve-late.png") });

// Wait for settle
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outputDir, "07-dissolve-settled.png") });

const finalState = await page.evaluate(() => {
  const el = document.querySelector("[data-profile-ascii]");
  const text = el?.textContent ?? "";
  const lines = text.split("\n");
  return {
    lineCount: lines.length,
    all72: lines.every((l) => l.length === 72),
    validChars: /^[01\s]+$/.test(text),
    nonEmptyLines: lines.filter((l) => l.trim().length > 0).length,
  };
});
console.log("Final settled state:", finalState);

// Dark mode check
await page.evaluate(() => {
  localStorage.setItem("theme", "dark");
  document.documentElement.classList.add("dark");
});
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(outputDir, "08-dark-mode-ascii.png") });

// Reduced motion test
const reducedPage = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  extraHTTPHeaders: {},
});
await reducedPage.emulateMedia({ reducedMotion: "reduce" });
await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
await reducedPage.waitForTimeout(100);
const reducedImmediate = await reducedPage.evaluate(() => {
  const el = document.querySelector("[data-profile-ascii]");
  const lines = (el?.textContent ?? "").split("\n");
  return {
    nonEmptyLines: lines.filter((l) => l.trim().length > 0).length,
  };
});
console.log("Reduced motion immediate state (should be 51 lines):", reducedImmediate);
await reducedPage.close();

await browser.close();
console.log("Test completed successfully!");
