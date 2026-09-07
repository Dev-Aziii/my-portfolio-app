import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = process.env.DASHBOARD_BASE_URL ?? "http://localhost:5173/";
const outputDir = process.env.DASHBOARD_OUTPUT_DIR ?? path.join(process.cwd(), "output", "playwright", "dashboard");
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
      // Try the next standard Windows installation path.
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath: await findEdge(), headless: true });
const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 1024, height: 768 }],
  ["mobile", { width: 390, height: 844 }],
];
const failures = [];

try {
  for (const [name, viewport] of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: false });

    const state = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const sidebar = document.querySelector(".dashboard-sidebar");
      const artwork = document.querySelector(".dashboard-hero__art img");
      const squareSelectors = [
        ".dashboard-hero",
        ".dashboard-stat-card",
        ".dashboard-panel",
        ".dashboard-project-card",
        ".dashboard-action",
        ".dashboard-nav__item",
        ".dashboard-profile__image",
      ];
      const squareGeometry = squareSelectors.every((selector) => {
        const element = document.querySelector(selector);
        return element && getComputedStyle(element).borderRadius === "0px";
      });
      const visibleColors = squareSelectors
        .map((selector) => document.querySelector(selector))
        .filter(Boolean)
        .map((element) => {
          const styles = getComputedStyle(element);
          return `${styles.color} ${styles.backgroundColor} ${styles.borderColor}`;
        })
        .join(" ");
      return {
        viewport: window.innerWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        hero: Boolean(document.querySelector("[data-profile-hero]")),
        stats: document.querySelectorAll(".dashboard-stat-card").length,
        projects: document.querySelectorAll(".dashboard-project-card").length,
        navItems: document.querySelectorAll(".dashboard-nav__item").length,
        artworkLoaded: Boolean(artwork && artwork.complete && artwork.naturalWidth > 0),
        artworkSrc: artwork?.getAttribute("src") ?? "",
        squareGeometry,
        sidebarBio: Boolean(document.querySelector(".dashboard-sidebar__bio")),
        sidebarContact: Boolean(document.querySelector(".dashboard-contact-list")),
        contactNav: [...document.querySelectorAll(".dashboard-nav__item")].some((item) => item.textContent?.trim() === "Contact"),
        sidebarEmail: document.querySelector(".dashboard-sidebar__footer[href^='mailto:']")?.getAttribute("href") ?? "",
        visibleColors,
        mobileBarVisible: getComputedStyle(document.querySelector(".dashboard-mobile-bar")).display !== "none",
        sidebarVisible: Boolean(sidebar && sidebar.getBoundingClientRect().right > 0),
        palette: {
          bg: root.getPropertyValue("--bg").trim(),
          surface: root.getPropertyValue("--surface").trim(),
          border: root.getPropertyValue("--border").trim(),
        },
      };
    });

    if (state.overflow || !state.hero || state.stats !== 4 || state.projects !== 4 || state.navItems !== 5 || state.contactNav) {
      failures.push(`${name}: core dashboard structure`);
    }
    if (!state.artworkLoaded || !state.artworkSrc.endsWith("/images/aziwallp6.png")) failures.push(`${name}: hero artwork`);
    if (!state.squareGeometry) failures.push(`${name}: square geometry`);
    if (state.sidebarBio || state.sidebarContact || state.sidebarEmail !== "mailto:adzyl.jipos@gmail.com") failures.push(`${name}: minimal sidebar content`);
    if (/34, 197, 94|0, 240, 255|6, 182, 212|green|cyan/i.test(state.visibleColors)) {
      failures.push(`${name}: colored runtime accents`);
    }
    if (state.palette.bg !== "#000000" || state.palette.surface !== "#0a0a0a" || state.palette.border !== "#2d2d2d") {
      failures.push(`${name}: palette tokens`);
    }
    if (name === "mobile" && !state.mobileBarVisible) failures.push("mobile: top navigation visibility");
    if (name !== "mobile" && !state.sidebarVisible) failures.push(`${name}: sidebar visibility`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ passed: failures.length === 0, failures, outputDir }));
if (failures.length) process.exitCode = 1;
