import { chromium } from "playwright-core";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.THEME_VISUAL_BASE_URL ?? "http://localhost:5173/";
const outputDir =
  process.env.THEME_VISUAL_OUTPUT ??
  path.join(process.env.LOCALAPPDATA ?? process.cwd(), "Temp", "theme-visual-verification");
const edgeCandidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

async function firstExisting(paths) {
  for (const candidate of paths) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next standard Edge location.
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

async function setTheme(page, theme) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((nextTheme) => {
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, theme);
  await page.reload({ waitUntil: "networkidle" });
}

async function clickVisibleToggle(page) {
  const toggles = page.getByRole("button", { name: /Time Machine:/ });
  const count = await toggles.count();
  for (let index = 0; index < count; index += 1) {
    const candidate = toggles.nth(index);
    if (await candidate.isVisible()) {
      await candidate.evaluate((el) => el.click());
      return;
    }
  }
  throw new Error("No visible theme toggle was found.");
}

async function waitForStableVisuals(page) {
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".animate-fade-in-up")].every(
        (element) => Number.parseFloat(getComputedStyle(element).opacity) >= 0.99,
      ),
    null,
    { timeout: 4000 },
  );
  await page.waitForTimeout(50);
}

async function captureStable(browser, name, viewport, theme, route = "") {
  const page = await browser.newPage({ viewport });
  await setTheme(page, theme);
  if (route) await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle" });
  await waitForStableVisuals(page);
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: false });
  const state = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    paperOpacity: getComputedStyle(document.querySelector(".theme-background--paper")).opacity,
    techOpacity: getComputedStyle(document.querySelector(".theme-background--tech")).opacity,
    backgroundCount: document.querySelectorAll(".adaptive-theme-background").length,
    hiddenEntranceCount: [...document.querySelectorAll(".animate-fade-in-up")].filter(
      (element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.99,
    ).length,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  await page.close();
  return state;
}

async function captureProgress(
  browser,
  direction,
  progress,
  viewport = { width: 1440, height: 900 },
  name = `${direction}-${Math.round(progress * 100)}`,
) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await setTheme(page, direction === "future" ? "light" : "dark");
  await clickVisibleToggle(page);
  await page.waitForFunction(() => Boolean(document.documentElement.dataset.eraTransition));
  const sweep = 900;
  await page.waitForTimeout(sweep * progress);
  const state = await page.evaluate(() => ({
    transition: document.documentElement.dataset.eraTransition ?? null,
    motion: document.documentElement.dataset.eraMotion ?? null,
    energyRingPresent: Boolean(document.querySelector(".era-energy-ring")),
    inkCloudPresent: Boolean(document.querySelector(".era-ink-cloud")),
    inkSeamPresent: Boolean(document.querySelector(".era-ink-seam")),
    scanlinePresent: Boolean(document.querySelector(".era-scanline")),
    grainPresent: Boolean(document.querySelector(".era-grain")),
    paperFoldPresent: Boolean(document.querySelector(".era-paper-fold")),
    foldEdgePresent: Boolean(document.querySelector(".era-fold-edge")),
    direction: document.querySelector(".era-material-transition")?.dataset.direction ?? null,
    edge: document.querySelector(".era-material-transition")?.dataset.edge ?? null,
    sweep: document.querySelector(".era-material-transition")?.dataset.sweep ?? null,
    foldAnimation: document.querySelector(".era-paper-fold")
      ? getComputedStyle(document.querySelector(".era-paper-fold")).animationName
      : null,
    legacyLayerCount: document.querySelectorAll(
      ".era-ink-cloud, .era-ink-seam, .era-energy-ring, .era-scanline, .era-grain, .era-dispersion",
    ).length,
    seamAnimation: document.querySelector(".era-ink-seam")
      ? getComputedStyle(document.querySelector(".era-ink-seam")).animationName
      : null,
    scanlineAnimation: document.querySelector(".era-scanline")
      ? getComputedStyle(document.querySelector(".era-scanline")).animationName
      : null,
    foldInkPalette: document.querySelector(".era-material-transition")
      ? getComputedStyle(document.querySelector(".era-material-transition")).getPropertyValue("--era-fold-ink-rgb").trim()
      : null,
    foldAccentPalette: document.querySelector(".era-material-transition")
      ? getComputedStyle(document.querySelector(".era-material-transition")).getPropertyValue("--era-fold-accent-rgb").trim()
      : null,
    foldSurfacePalette: document.querySelector(".era-material-transition")
      ? getComputedStyle(document.querySelector(".era-material-transition")).getPropertyValue("--era-fold-surface-rgb").trim()
      : null,
    pseudoAnimations: document.getAnimations().map((animation) => {
      const effect = animation.effect;
      return effect && "pseudoElement" in effect ? effect.pseudoElement : null;
    }).filter(Boolean),
  }));
  await page.screenshot({
    path: path.join(outputDir, `${name}.png`),
    fullPage: false,
  });
  await page.close();
  return { state, errors, viewportWidth: viewport.width };
}

async function verifyReducedMotion(browser) {
  const page = await browser.newPage({
    viewport: { width: 1024, height: 768 },
    reducedMotion: "reduce",
  });
  await setTheme(page, "light");
  await clickVisibleToggle(page);
  await page.waitForTimeout(40);
  const during = await page.evaluate(() => ({
    motion: document.documentElement.dataset.eraMotion ?? null,
    energyRingPresent: Boolean(document.querySelector(".era-energy-ring")),
    inkCloudPresent: Boolean(document.querySelector(".era-ink-cloud")),
    inkSeamPresent: Boolean(document.querySelector(".era-ink-seam")),
    scanlinePresent: Boolean(document.querySelector(".era-scanline")),
    grainPresent: Boolean(document.querySelector(".era-grain")),
    paperFoldPresent: Boolean(document.querySelector(".era-paper-fold")),
    foldEdgePresent: Boolean(document.querySelector(".era-fold-edge")),
  }));
  await page.waitForFunction(() => !document.documentElement.dataset.eraTransition);
  await page.close();
  return during;
}

async function verifyFallback(browser) {
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: undefined,
    });
  });
  await setTheme(page, "light");
  await clickVisibleToggle(page);
  await page.waitForTimeout(300);
  const during = await page.evaluate(() => ({
    fallback: document.documentElement.dataset.eraTransitionFallback ?? null,
  }));
  await page.waitForFunction(() => !document.documentElement.dataset.eraTransition);
  const after = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    fallback: document.documentElement.dataset.eraTransitionFallback ?? null,
    motion: document.documentElement.dataset.eraMotion ?? null,
  }));
  await page.close();
  return { during, after };
}

await mkdir(outputDir, { recursive: true });
const executablePath = await firstExisting(edgeCandidates);
const browser = await chromium.launch({ executablePath, headless: true });

try {
  const stable = {
    desktopLight: await captureStable(browser, "desktop-light", { width: 1440, height: 900 }, "light"),
    desktopDark: await captureStable(browser, "desktop-dark", { width: 1440, height: 900 }, "dark"),
    tabletLight: await captureStable(browser, "tablet-light", { width: 1024, height: 768 }, "light", "projects"),
    tabletDark: await captureStable(browser, "tablet-dark", { width: 1024, height: 768 }, "dark", "projects"),
    mobileLight: await captureStable(browser, "mobile-light", { width: 390, height: 844 }, "light"),
    mobileDark: await captureStable(browser, "mobile-dark", { width: 390, height: 844 }, "dark"),
  };

  const progress = {};
  for (const direction of ["future", "past"]) {
    for (const point of [0.15, 0.3, 0.45]) {
      progress[`${direction}-${point}`] = await captureProgress(browser, direction, point);
    }
  }
  progress["future-mobile-0.5"] = await captureProgress(
    browser,
    "future",
    0.5,
    { width: 390, height: 844 },
    "future-mobile-50",
  );
  progress["past-mobile-0.5"] = await captureProgress(
    browser,
    "past",
    0.5,
    { width: 390, height: 844 },
    "past-mobile-50",
  );

  const reducedMotion = await verifyReducedMotion(browser);
  const fallback = await verifyFallback(browser);
  const failures = [];

  for (const [name, state] of Object.entries(stable)) {
    const expectsDark = name.endsWith("Dark");
    if (
      state.dark !== expectsDark ||
      state.paperOpacity !== (expectsDark ? "0" : "1") ||
      state.techOpacity !== (expectsDark ? "1" : "0") ||
      state.backgroundCount !== 1 ||
      state.hiddenEntranceCount !== 0 ||
      state.horizontalOverflow
    ) {
      failures.push(`stable ${name}`);
    }
  }

  for (const [name, result] of Object.entries(progress)) {
    const expectedDirection = name.startsWith("future") ? "to-future" : "to-past";
    const expectedFoldInkPalette = expectedDirection === "to-future" ? "185 251 255" : "255 225 170";
    const expectedFoldAccentPalette = expectedDirection === "to-future" ? "0 240 255" : "213 166 95";
    const expectedFoldSurfacePalette = expectedDirection === "to-future" ? "2 6 13" : "239 229 210";
    const state = result.state;
    if (
      result.errors.length ||
      state.transition !== expectedDirection ||
      state.motion !== "cinematic" ||
      state.direction !== expectedDirection ||
      state.foldInkPalette !== expectedFoldInkPalette ||
      state.foldAccentPalette !== expectedFoldAccentPalette ||
      state.foldSurfacePalette !== expectedFoldSurfacePalette ||
      state.sweep !== "left" ||
      state.foldAnimation !== "era-paper-fold-left" ||
      !state.paperFoldPresent ||
      !state.foldEdgePresent ||
      state.legacyLayerCount !== 0
    ) {
      failures.push(`progress ${name}`);
    }
  }

  if (
    reducedMotion.motion !== "reduced" ||
    reducedMotion.energyRingPresent ||
    reducedMotion.inkCloudPresent ||
    reducedMotion.inkSeamPresent ||
    reducedMotion.scanlinePresent ||
    reducedMotion.grainPresent ||
    reducedMotion.paperFoldPresent ||
    reducedMotion.foldEdgePresent
  ) {
    failures.push("reduced motion");
  }
  if (
    fallback.during.fallback !== "true" ||
    !fallback.after.dark ||
    fallback.after.fallback !== null ||
    fallback.after.motion !== null
  ) {
    failures.push("View Transition fallback");
  }

  const report = {
    passed: failures.length === 0,
    failures,
    outputDir,
    stable,
    progress,
    reducedMotion,
    fallback,
  };
  await writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
