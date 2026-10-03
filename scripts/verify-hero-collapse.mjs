import { access } from "node:fs/promises";
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.DASHBOARD_BASE_URL ?? "http://localhost:5173/";
const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

async function findEdge() {
  for (const candidate of edgeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue searching
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

const outputDir = path.resolve("output/playwright/hero");
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath: await findEdge(), headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const hero = page.locator("[data-profile-hero]");
  await hero.waitFor({ state: "visible" });

  // 1. Verify Initial State (Collapsed)
  const isInitiallyCollapsed = await hero.evaluate((el) => el.classList.contains("dashboard-hero--collapsed"));
  console.log("Initial state collapsed:", isInitiallyCollapsed);
  if (!isInitiallyCollapsed) {
    throw new Error("Hero should initially have class dashboard-hero--collapsed");
  }

  const toggleBtn = hero.locator(".dashboard-hero__toggle");
  const initialAriaExpanded = await toggleBtn.getAttribute("aria-expanded");
  console.log("Initial aria-expanded:", initialAriaExpanded);
  if (initialAriaExpanded !== "false") {
    throw new Error(`Expected aria-expanded to be 'false', got '${initialAriaExpanded}'`);
  }

  const artVisibility = await hero.locator(".dashboard-hero__art").evaluate((el) => {
    const style = window.getComputedStyle(el);
    return {
      opacity: style.opacity,
      visibility: style.visibility,
      maskImage: style.maskImage || style.webkitMaskImage,
    };
  });
  console.log("Initial art computed styles:", artVisibility);
  if (artVisibility.visibility !== "visible" || Number(artVisibility.opacity) <= 0) {
    throw new Error(`Expected art to be visible with opacity > 0, got ${JSON.stringify(artVisibility)}`);
  }

  const collapsedHeight = await hero.evaluate((el) => el.getBoundingClientRect().height);
  console.log("Initial collapsed height:", collapsedHeight);

  await page.screenshot({ path: path.join(outputDir, "hero-initial-collapsed.png"), fullPage: false });

  // 2. Click to Expand
  await toggleBtn.click();
  await page.waitForTimeout(500); // Wait for transition

  const isExpanded = await hero.evaluate((el) => el.classList.contains("dashboard-hero--expanded"));
  console.log("State after expand click:", isExpanded);
  if (!isExpanded) {
    throw new Error("Hero should have class dashboard-hero--expanded after click");
  }

  const expandedAriaExpanded = await toggleBtn.getAttribute("aria-expanded");
  console.log("Expanded aria-expanded:", expandedAriaExpanded);
  if (expandedAriaExpanded !== "true") {
    throw new Error(`Expected aria-expanded to be 'true', got '${expandedAriaExpanded}'`);
  }

  const expandedArtVisibility = await hero.locator(".dashboard-hero__art").evaluate((el) => {
    const style = window.getComputedStyle(el);
    return {
      opacity: style.opacity,
      visibility: style.visibility,
    };
  });
  console.log("Expanded art computed styles:", expandedArtVisibility);
  if (expandedArtVisibility.visibility !== "visible" || Number(expandedArtVisibility.opacity) <= 0) {
    throw new Error(`Expected art to be visible, got ${JSON.stringify(expandedArtVisibility)}`);
  }

  const expandedHeight = await hero.evaluate((el) => el.getBoundingClientRect().height);
  console.log("Expanded height:", expandedHeight);
  if (expandedHeight <= collapsedHeight) {
    throw new Error(`Expected expanded height (${expandedHeight}) to be greater than collapsed height (${collapsedHeight})`);
  }

  await page.screenshot({ path: path.join(outputDir, "hero-expanded.png"), fullPage: false });

  // 3. Click to Collapse Again
  await toggleBtn.click();
  await page.waitForTimeout(500); // Wait for transition

  const isRecollapsed = await hero.evaluate((el) => el.classList.contains("dashboard-hero--collapsed"));
  console.log("State after collapse click:", isRecollapsed);
  if (!isRecollapsed) {
    throw new Error("Hero should have class dashboard-hero--collapsed after second click");
  }

  const recollapsedHeight = await hero.evaluate((el) => el.getBoundingClientRect().height);
  console.log("Recollapsed height:", recollapsedHeight);

  await page.screenshot({ path: path.join(outputDir, "hero-recollapsed.png"), fullPage: false });

  // 4. Test Mobile Viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outputDir, "hero-mobile-collapsed.png"), fullPage: false });

  await toggleBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, "hero-mobile-expanded.png"), fullPage: false });

  // 5. Test Dark Mode
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outputDir, "hero-dark-expanded.png"), fullPage: false });

  await toggleBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, "hero-dark-collapsed.png"), fullPage: false });

  console.log("ALL HERO COLLAPSE/EXPAND VERIFICATION CHECKS PASSED!");
} finally {
  await browser.close();
}
