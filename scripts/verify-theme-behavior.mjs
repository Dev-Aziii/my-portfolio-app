import { chromium } from "playwright-core";
import { access } from "node:fs/promises";

const baseUrl = process.env.THEME_VISUAL_BASE_URL ?? "http://127.0.0.1:5173/";
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
      // Continue through the standard installation locations.
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

async function visibleToggle(page) {
  const toggles = page.getByRole("button", { name: /Time Machine:/ });
  for (let index = 0; index < (await toggles.count()); index += 1) {
    if (await toggles.nth(index).isVisible()) return toggles.nth(index);
  }
  throw new Error("No visible theme toggle was found.");
}

async function prepare(page, theme, route = "") {
  await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle" });
  await page.evaluate((nextTheme) => {
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Storage-denial scenarios intentionally exercise this path.
    }
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, theme);
  await page.reload({ waitUntil: "networkidle" });
}

async function waitForCleanup(page) {
  await page.waitForFunction(() => !document.documentElement.dataset.eraTransition, null, {
    timeout: 5000,
  });
  await page.waitForTimeout(60);
}

async function state(page) {
  return page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    lock: document.documentElement.dataset.eraTransition ?? null,
    run: document.documentElement.dataset.eraTransitionRun ?? null,
    motion: document.documentElement.dataset.eraMotion ?? null,
    capture: document.documentElement.dataset.eraMaterialCapture ?? null,
    fallback: document.documentElement.dataset.eraTransitionFallback ?? null,
    transitionExists: Boolean(document.querySelector(".era-material-transition")),
    backgroundCount: document.querySelectorAll(".adaptive-theme-background").length,
    oldBackgroundCount: document.querySelectorAll(".interactive-bg").length,
  }));
}

const browser = await chromium.launch({ executablePath: await edgePath(), headless: true });
const results = {};

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await prepare(page, "light");
    const toggle = await visibleToggle(page);
    await toggle.focus();
    await toggle.press("Enter");
    await waitForCleanup(page);
    results.keyboardFuture = {
      ...(await state(page)),
      focused: await toggle.evaluate((element) => document.activeElement === element),
    };
    await toggle.press("Space");
    await waitForCleanup(page);
    results.keyboardPast = {
      ...(await state(page)),
      focused: await toggle.evaluate((element) => document.activeElement === element),
    };
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await prepare(page, "light");
    const toggle = await visibleToggle(page);
    await toggle.evaluate((element) => {
      element.click();
      element.click();
    });
    await waitForCleanup(page);
    results.mobileRapidActivation = await state(page);
    await page.close();
  }

  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    await prepare(page, "light");
    const toggles = page.getByRole("button", { name: /Time Machine:/ });
    await (await visibleToggle(page)).click();
    await page.waitForTimeout(20);
    const duringBusy = await toggles.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-busy")),
    );
    const duringDisabled = await toggles.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-disabled")),
    );
    await waitForCleanup(page);
    const afterBusy = await toggles.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-busy")),
    );
    const afterDisabled = await toggles.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("aria-disabled")),
    );
    results.reducedMotionSync = {
      ...(await state(page)),
      duringBusy,
      duringDisabled,
      afterBusy,
      afterDisabled,
    };
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("Storage denied", "SecurityError");
      };
    });
    await prepare(page, "light");
    await (await visibleToggle(page)).click();
    await waitForCleanup(page);
    results.storageDenial = await state(page);
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await prepare(page, "light");
    await (await visibleToggle(page)).click();
    await page.waitForTimeout(280);
    await page.setViewportSize({ width: 900, height: 700 });
    await waitForCleanup(page);
    results.resize = {
      ...(await state(page)),
      viewport: await page.evaluate(() => [window.innerWidth, window.innerHeight]),
    };
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await prepare(page, "light");
    await (await visibleToggle(page)).click();
    await page.waitForTimeout(220);
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await waitForCleanup(page);
    results.visibilityInterruption = await state(page);
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    const routes = ["", "experience", "tech-stack", "projects", "projects/teza", "certifications"];
    results.routes = {};
    for (const route of routes) {
      await prepare(page, "dark", route);
      results.routes[route || "/"] = {
        ...(await state(page)),
        toggles: await page.getByRole("button", { name: /Time Machine:/ }).count(),
        horizontalOverflow: await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
      };
    }
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await prepare(page, "light");
    await page.evaluate(() => {
      window.__themeLongTasks = [];
      new PerformanceObserver((list) => {
        window.__themeLongTasks.push(...list.getEntries().map((entry) => entry.duration));
      }).observe({ type: "longtask" });
    });
    await (await visibleToggle(page)).click();
    await waitForCleanup(page);
    const durations = await page.evaluate(() => window.__themeLongTasks ?? []);
    results.performance = {
      count: durations.length,
      maxMs: durations.length ? Math.max(...durations) : 0,
      thresholdMs: 180,
      durations,
    };
    await page.close();
  }

  const failures = [];
  if (!results.keyboardFuture.dark || !results.keyboardFuture.focused) failures.push("keyboard future");
  if (results.keyboardPast.dark || !results.keyboardPast.focused) failures.push("keyboard past");
  if (!results.mobileRapidActivation.dark) failures.push("rapid activation");
  if (
    results.reducedMotionSync.duringBusy.length < 2 ||
    results.reducedMotionSync.duringBusy.some((value) => value !== "true") ||
    results.reducedMotionSync.duringDisabled.some((value) => value !== "true") ||
    results.reducedMotionSync.afterBusy.some((value) => value !== "false") ||
    results.reducedMotionSync.afterDisabled.some((value) => value !== "false")
  ) {
    failures.push("reduced-motion toggle state synchronization");
  }
  if (!results.storageDenial.dark) failures.push("storage denial");
  if (!results.resize.dark) failures.push("resize");
  if (!results.visibilityInterruption.dark) failures.push("visibility interruption");
  if (results.performance.maxMs > results.performance.thresholdMs) {
    failures.push("transition long-task threshold");
  }

  for (const [name, value] of Object.entries(results)) {
    if (name === "routes" || name === "performance") continue;
    if (value.lock || value.run || value.motion || value.capture || value.fallback) {
      failures.push(`${name} cleanup`);
    }
    if (value.coreName && value.coreName !== "none") failures.push(`${name} material participant cleanup`);
    if (value.backgroundCount !== 1 || value.oldBackgroundCount !== 0) {
      failures.push(`${name} background mount`);
    }
  }

  for (const [route, value] of Object.entries(results.routes)) {
    if (
      value.toggles < 1 ||
      value.horizontalOverflow ||
      value.backgroundCount !== 1 ||
      value.oldBackgroundCount !== 0
    ) {
      failures.push(`route ${route}`);
    }
  }

  console.log(JSON.stringify({ passed: failures.length === 0, failures, results }));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
