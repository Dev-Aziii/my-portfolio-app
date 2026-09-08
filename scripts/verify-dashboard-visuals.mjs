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
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outputDir, `${name}-light.png`), fullPage: false });
    if (name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.waitForTimeout(260);
      await page.screenshot({ path: path.join(outputDir, "mobile-light-sidebar.png"), fullPage: false });
    }

    const state = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const sidebar = document.querySelector(".dashboard-sidebar");
      const content = document.querySelector(".dashboard-shell__content");
      const asciiPortrait = document.querySelector("[data-profile-ascii]");
      const profileArt = document.querySelector(".dashboard-profile-art");
      const profileCard = document.querySelector(".dashboard-profile");
      const sidebarStyles = sidebar ? getComputedStyle(sidebar) : null;
      const asciiStyles = asciiPortrait ? getComputedStyle(asciiPortrait) : null;
      const profileArtBounds = profileArt?.getBoundingClientRect();
      const profileCardBounds = profileCard?.getBoundingClientRect();
      const artwork = document.querySelector(".dashboard-hero__art img");
      const projectPanel = document.querySelector(".dashboard-panel--projects");
      const activityPanel = document.querySelector(".dashboard-activity");
      const hero = document.querySelector(".dashboard-hero");
      const sharedPanel = document.querySelector(".dashboard-panel");
      const selectorItem = document.querySelector("[data-project-selector]");
      const selectorLogo = document.querySelector("[data-project-selector] .dashboard-featured-projects__selector-logo");
      const roundedSelectors = [
        ".dashboard-hero",
        ".dashboard-panel",
        ".dashboard-action",
        ".dashboard-nav__item",
        ".dashboard-profile",
        ".dashboard-featured-projects__selector-item",
        ".dashboard-featured-projects__detail",
      ];
      const roundedGeometry = roundedSelectors.every((selector) => {
        const element = document.querySelector(selector);
        return element && getComputedStyle(element).borderRadius !== "0px";
      });
      const visibleColors = roundedSelectors
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
        projects: document.querySelectorAll("[data-project-selector]").length,
        navItems: document.querySelectorAll(".dashboard-nav__item").length,
        quickLinks: document.querySelectorAll(".dashboard-sidebar__quick-link").length,
        contactLinks: document.querySelectorAll(".dashboard-sidebar__contact-link").length,
        hasSidebarConnectSection: Boolean(document.getElementById("sidebar-connect")),
        footerLabel: document.querySelector(".dashboard-sidebar__footer-label")?.textContent?.trim() ?? "",
        sidebarMiddleOverflowX: getComputedStyle(document.querySelector(".dashboard-sidebar__middle")).overflowX,
        sidebarMiddleOverflowY: getComputedStyle(document.querySelector(".dashboard-sidebar__middle")).overflowY,
        profileCardRadius: getComputedStyle(profileCard).borderRadius,
        profileCardMinHeight: getComputedStyle(profileCard).minHeight,
        profileCardMarginTop: getComputedStyle(profileCard).marginTop,
        sidebarInnerFrameBorder: getComputedStyle(sidebar, "::before").borderTopWidth,
        artworkLoaded: Boolean(artwork && artwork.complete && artwork.naturalWidth > 0),
        artworkSrc: artwork?.getAttribute("src") ?? "",
        heroBackgroundImage: hero ? getComputedStyle(hero).backgroundImage : "",
        sharedPanelBackgroundImage: sharedPanel ? getComputedStyle(sharedPanel).backgroundImage : "",
        selectorMinHeight: selectorItem ? getComputedStyle(selectorItem).minHeight : "",
        selectorLogoSize: selectorLogo ? getComputedStyle(selectorLogo).width : "",
        roundedGeometry,
        sidebarTagline: document.querySelector(".dashboard-profile__tagline")?.textContent?.trim() ?? "",
        asciiPortrait: Boolean(asciiPortrait),
        asciiFontSize: asciiStyles?.fontSize ?? "",
        asciiColor: asciiStyles?.color ?? "",
        sidebarWidth: sidebar?.getBoundingClientRect().width ?? 0,
        sidebarBackgroundColor: sidebarStyles?.backgroundColor ?? "",
        sidebarOverflowX: sidebarStyles?.overflowX ?? "",
        sidebarOverflowY: sidebarStyles?.overflowY ?? "",
        contentMarginLeft: content ? Number.parseFloat(getComputedStyle(content).marginLeft) : -1,
        profileCardOverlapsArt: Boolean(profileArtBounds && profileCardBounds && profileCardBounds.top < profileArtBounds.bottom && profileCardBounds.bottom > profileArtBounds.top),
        contactNav: [...document.querySelectorAll(".dashboard-nav__item")].some((item) => item.textContent?.trim() === "Contact"),
        sidebarEmail: document.querySelector(".dashboard-sidebar__footer-email[href^='mailto:']")?.getAttribute("href") ?? "",
        imageFilters: [
          ".dashboard-hero__art img",
          ".dashboard-certification-card__icon img",
        ].map((selector) => getComputedStyle(document.querySelector(selector)).filter),
        visibleColors,
        mobileBarVisible: getComputedStyle(document.querySelector(".dashboard-mobile-bar")).display !== "none",
        sidebarVisible: Boolean(sidebar && sidebar.getBoundingClientRect().right > 0),
          palette: {
          bg: root.getPropertyValue("--bg").trim(),
          surface: root.getPropertyValue("--surface").trim(),
          border: root.getPropertyValue("--border").trim(),
          },
          projectPanelBottom: projectPanel?.getBoundingClientRect().bottom ?? 0,
          activityPanelBottom: activityPanel?.getBoundingClientRect().bottom ?? 0,
        };
    });

    if (state.overflow || !state.hero || state.projects !== 3 || state.navItems !== 5 || state.quickLinks !== 3 || state.contactLinks !== 0 || state.hasSidebarConnectSection || state.contactNav) {
      failures.push(`${name}: core dashboard structure`);
    }
    if (!state.artworkLoaded || !state.artworkSrc.endsWith("/images/azii.webp")) failures.push(`${name}: hero artwork`);
    if (!state.roundedGeometry) failures.push(`${name}: rounded geometry`);
    if (state.sidebarTagline !== "> Turning ideas into solutions" || !state.asciiPortrait || state.sidebarEmail !== "mailto:adzyl.jipos@gmail.com" || state.footerLabel !== "For work and collaboration contact me at") failures.push(`${name}: sidebar content`);
    const expectedSidebarWidth = name === "desktop" ? 304 : name === "tablet" ? 276 : 304;
    const expectedAsciiFontSize = name === "tablet" ? "5.25px" : "5.7px";
    if (state.sidebarWidth !== expectedSidebarWidth || state.contentMarginLeft !== (name === "mobile" ? 0 : expectedSidebarWidth)) failures.push(`${name}: sidebar responsive width`);
    if (state.asciiFontSize !== expectedAsciiFontSize || state.sidebarOverflowX !== "hidden" || state.sidebarOverflowY !== "hidden" || state.sidebarMiddleOverflowX !== "hidden" || state.sidebarMiddleOverflowY !== "auto" || state.profileCardRadius !== "12px" || state.profileCardMinHeight !== "94px" || state.profileCardMarginTop !== "-100px" || state.sidebarInnerFrameBorder !== "0px" || !state.profileCardOverlapsArt) failures.push(`${name}: ascii sidebar geometry`);
    if (state.sidebarBackgroundColor === "rgba(0, 0, 0, 0)") failures.push(`${name}: light sidebar surface`);
    if (state.imageFilters.some((filter) => filter !== "none")) failures.push(`${name}: grayscale image treatment`);
    if (/34, 197, 94|0, 240, 255|6, 182, 212|green|cyan/i.test(state.visibleColors)) {
      failures.push(`${name}: colored runtime accents`);
    }
    if (state.palette.bg !== "#f5f5f5" || state.palette.surface !== "#ffffff" || state.palette.border !== "#c8c8c8") {
      failures.push(`${name}: palette tokens`);
    }
    if (state.heroBackgroundImage !== state.sharedPanelBackgroundImage) failures.push(`${name}: hero container background`);
    if (state.selectorMinHeight !== "56px" || state.selectorLogoSize !== "30px") failures.push(`${name}: compact project selectors`);

    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outputDir, `${name}-dark.png`), fullPage: false });
    if (name === "mobile") {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.waitForTimeout(260);
      await page.screenshot({ path: path.join(outputDir, "mobile-dark-sidebar.png"), fullPage: false });
    }
    const darkHeroBackground = await page.evaluate(() => ({
      hero: getComputedStyle(document.querySelector(".dashboard-hero")).backgroundImage,
      panel: getComputedStyle(document.querySelector(".dashboard-panel")).backgroundImage,
      sidebarBackgroundColor: getComputedStyle(document.querySelector(".dashboard-sidebar")).backgroundColor,
      asciiColor: getComputedStyle(document.querySelector("[data-profile-ascii]")).color,
    }));
    if (darkHeroBackground.hero !== darkHeroBackground.panel) failures.push(`${name}: dark hero background`);
    if (darkHeroBackground.sidebarBackgroundColor === "rgba(0, 0, 0, 0)" || darkHeroBackground.asciiColor === state.asciiColor) failures.push(`${name}: dark sidebar theme`);
    if (name === "desktop" && Math.abs(state.projectPanelBottom - state.activityPanelBottom) > 2) failures.push("desktop: featured/activity alignment");
    if (name === "mobile" && !state.mobileBarVisible) failures.push("mobile: top navigation visibility");
    if (name !== "mobile" && !state.sidebarVisible) failures.push(`${name}: sidebar visibility`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ passed: failures.length === 0, failures, outputDir }));
if (failures.length) process.exitCode = 1;
