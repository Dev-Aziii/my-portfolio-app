import { access, mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import path from "node:path";

const baseUrl = process.env.THEME_VISUAL_BASE_URL ?? "http://127.0.0.1:5173/";
const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const routes = ["/", "/experience", "/tech-stack", "/projects", "/projects/teza", "/certifications", "/missing"];
const outputDir = process.env.THEME_VISUAL_OUTPUT ?? path.join(process.cwd(), "output", "playwright", "theme");

async function edgePath() {
  for (const candidate of edgeCandidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next standard installation location.
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

async function openWithTheme(browser, theme, route = "/", options = {}) {
  const context = await browser.newContext({ viewport: options.viewport, colorScheme: options.systemTheme });
  if (options.denyStorage) {
    await context.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new Error("storage denied");
        },
      });
    });
  }
  const page = await context.newPage();
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle" });
  if (theme) {
    await page.evaluate(({ nextTheme, systemPrefersDark }) => {
      try {
        localStorage.setItem("theme", nextTheme);
      } catch {
        // Storage-denial behavior is verified separately.
      }
      document.documentElement.classList.toggle("dark", nextTheme === "dark" || (nextTheme === "system" && systemPrefersDark));
    }, { nextTheme: theme, systemPrefersDark: options.systemTheme === "dark" });
    await page.reload({ waitUntil: "networkidle" });
  }
  return { context, page };
}

async function state(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height, bottom: bounds.bottom };
    };
    return {
      dark: document.documentElement.classList.contains("dark"),
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      background: getComputedStyle(document.body).backgroundColor,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      toggles: document.querySelectorAll("[data-theme-toggle]").length,
      toggleRoles: [...document.querySelectorAll("[data-theme-toggle]")].map((toggle) => toggle.getAttribute("role")),
      toggleOptionCounts: [...document.querySelectorAll("[data-theme-toggle]")].map((toggle) => toggle.querySelectorAll("[data-theme-option]").length),
      toggleOptionValues: [...document.querySelectorAll("[data-theme-toggle]")].map((toggle) => [...toggle.querySelectorAll("[data-theme-option]")].map((option) => option.getAttribute("data-theme-option"))),
      togglePreferences: [...document.querySelectorAll("[data-theme-toggle]")].map((toggle) => toggle.getAttribute("data-theme")),
      selectors: document.querySelectorAll("[data-project-selector]").length,
      featuredHeroImages: document.querySelectorAll("[data-featured-project-detail] img[src*='/hero.']").length,
      featuredHeroSource: document.querySelector("[data-featured-project-detail] img[src*='/hero.']")?.currentSrc ?? "",
      featuredHeroRect: rect("[data-featured-project-detail] .dashboard-featured-projects__detail-art img"),
      featuredTitleRect: rect("[data-featured-project-detail] h3"),
      featuredDescriptionRect: rect("[data-featured-project-detail] .dashboard-featured-projects__detail-copy > p"),
      featuredDetailLogos: document.querySelectorAll("[data-featured-project-detail] .dashboard-featured-projects__detail-logo").length,
      featuredTechRect: rect("[data-featured-project-detail] .dashboard-skill-pills"),
      featuredStackRowRect: rect("[data-featured-project-detail] .dashboard-featured-projects__detail-stack-row"),
      featuredCtaRect: rect("[data-featured-project-cta]"),
      featuredFooterCount: document.querySelectorAll("[data-featured-project-detail] .dashboard-featured-projects__detail-footer").length,
      featuredPanelRect: rect(".dashboard-panel--projects"),
      activityPanelRect: rect(".dashboard-activity"),
      selectorFilters: [...document.querySelectorAll("[data-project-selector] img")].map((img) => getComputedStyle(img).filter),
      projectImageFilters: [...document.querySelectorAll(".dashboard-project-card__image img, .dashboard-project-explorer__item img, .dashboard-project-explorer__logo img, .project-catalog-card__logo img, .project-detail__gallery-main img, .project-detail__thumb img, .lightbox__image")].map((img) => getComputedStyle(img).filter),
    };
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ executablePath: await edgePath(), headless: true });
await mkdir(outputDir, { recursive: true });

try {
  for (const theme of ["light", "dark"]) {
    for (const route of routes) {
      const { context, page } = await openWithTheme(browser, theme, route, { viewport: { width: 1440, height: 900 } });
      const current = await state(page);
      assert(current.dark === (theme === "dark"), `${route} did not load ${theme} mode`);
      assert(current.colorScheme === theme, `${route} reported the wrong color scheme`);
      assert(!current.overflow, `${route} has horizontal overflow in ${theme} mode`);
      if (route === "/") {
        assert(current.toggles === 2, "desktop shell should render both theme toggle instances");
        assert(current.toggleRoles.every((role) => role === "radiogroup"), "theme toggles should use radiogroup semantics");
        assert(current.toggleOptionCounts.every((count) => count === 3), "theme toggles should show system, light, and dark options");
        assert(current.toggleOptionValues.every((values) => values.join(",") === "system,light,dark"), "theme toggles should expose the options in order");
        assert(current.togglePreferences.every((preference) => preference === theme), "theme toggles should show the active preference");
        assert(current.selectors === 3, "dashboard should render exactly three featured selectors");
        assert(current.featuredHeroImages === 1, "featured detail should render exactly one hero image");
        assert(current.featuredHeroSource.endsWith("/images/projects/teza/hero.webp"), "featured detail should render the first project asset");
        assert(current.featuredHeroRect?.height >= 150, "featured hero image should be visible");
        assert(current.featuredHeroRect?.width >= current.featuredTitleRect?.width + 20, "featured hero image should stretch across the detail panel");
        assert(current.featuredHeroRect?.top < current.featuredTitleRect?.top && current.featuredTitleRect?.top < current.featuredDescriptionRect?.top, "featured detail should place image before title and description");
        assert(current.featuredDetailLogos === 0, "featured detail should not render a project logo");
        assert(current.featuredFooterCount === 0, "featured detail should not render a footer row");
        assert(current.featuredCtaRect?.top >= current.featuredStackRowRect?.top - 2 && current.featuredCtaRect?.bottom <= current.featuredStackRowRect?.bottom + 2, "featured CTA should align with the tech stack");
        assert(Math.abs(current.featuredPanelRect?.bottom - current.activityPanelRect?.bottom) <= 2, "featured and activity panels should end evenly");
        assert(current.selectorFilters.every((filter) => filter === "none"), "featured logos must not be filtered");
        assert(current.projectImageFilters.every((filter) => filter === "none"), "featured project images must not be filtered");
        await page.screenshot({ path: path.join(outputDir, `${theme}-desktop.png`), fullPage: false });
      }
      await context.close();
    }
  }

  for (const [systemTheme, expectedDark] of [["light", false], ["dark", true]]) {
    const { context, page } = await openWithTheme(browser, null, "/", { systemTheme });
    const current = await state(page);
    assert(current.dark === expectedDark, `first visit should follow the ${systemTheme} system preference`);
    await context.close();
  }

  {
    const { context, page } = await openWithTheme(browser, "system", "/", { systemTheme: "dark" });
    const current = await state(page);
    assert(current.dark, "system preference should follow a dark system setting");
    assert(current.togglePreferences.every((preference) => preference === "system"), "system preference should be selected");
    assert(await page.evaluate(() => localStorage.getItem("theme")) === "system", "system selection should persist");
    await context.close();
  }

  {
    const { context, page } = await openWithTheme(browser, "light", "/");
    const toggle = page.locator("[data-theme-option='dark']:visible").first();
    await toggle.click();
    await page.waitForTimeout(260);
    const current = await state(page);
    assert(current.dark, "toggle should switch from light to dark");
    assert(await page.evaluate(() => localStorage.getItem("theme")) === "dark", "dark selection should persist");
    await context.close();
  }

  {
    const { context, page } = await openWithTheme(browser, "dark", "/", { systemTheme: "light" });
    await page.locator("[data-theme-option='system']:visible").first().click();
    assert(!(await state(page)).dark, "system selection should resolve to the light system preference");
    assert(await page.evaluate(() => localStorage.getItem("theme")) === "system", "system selection should persist after an explicit choice");
    await page.waitForTimeout(260);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(100);
    assert((await state(page)).dark, "system selection should follow a changed system preference");
    await context.close();
  }

  {
    const { context, page } = await openWithTheme(browser, "light", "/", { viewport: { width: 390, height: 844 } });
    const selector = page.locator("[data-project-selector]");
    assert(await selector.count() === 3, "mobile dashboard should render three selectors");
    assert(await page.locator(".dashboard-featured-projects__selector").evaluate((element) => element.scrollWidth > element.clientWidth), "mobile selector should scroll horizontally");
    for (let index = 0; index < 3; index += 1) {
      await selector.nth(index).click();
      assert(await selector.nth(index).getAttribute("aria-pressed") === "true", `selector ${index} should become active`);
    }
    await page.screenshot({ path: path.join(outputDir, "light-mobile.png"), fullPage: false });
    await context.close();
  }

  {
    const { context, page } = await openWithTheme(browser, "light", "/", { denyStorage: true, systemTheme: "light" });
    await page.locator("[data-theme-option='dark']:visible").first().click();
    await page.waitForTimeout(260);
    assert((await state(page)).dark, "theme toggle should work when storage is denied");
    await context.close();
  }

  {
    const context = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("[data-theme-option='dark']:visible").first().click();
    assert((await state(page)).dark, "reduced-motion toggle should switch immediately");
    assert(await page.locator("html").getAttribute("data-theme-transition") === null, "reduced-motion toggle should not start a crossfade");
    await context.close();
  }

  console.log("Theme and featured-project verification passed.");
} finally {
  await browser.close();
}
