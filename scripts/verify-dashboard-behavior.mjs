import { access } from "node:fs/promises";
import { chromium } from "playwright-core";

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
      // Try the next standard Windows installation path.
    }
  }
  throw new Error("Microsoft Edge executable was not found.");
}

const browser = await chromium.launch({ executablePath: await findEdge(), headless: true });
const failures = [];

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "Skills" }).click();
  await desktop.waitForTimeout(250);
  const sectionState = await desktop.evaluate(() => ({
    active: document.querySelector(".dashboard-nav__item[aria-current]")?.textContent?.trim(),
    top: document.getElementById("skills")?.getBoundingClientRect().top ?? Infinity,
  }));
  if (sectionState.active !== "Skills" || Math.abs(sectionState.top) > 180) failures.push("home section navigation");

  await desktop.goto(new URL("projects", baseUrl).href, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "Skills" }).click();
  await desktop.waitForTimeout(300);
  if (!desktop.url().endsWith("/tech-stack")) failures.push("route navigation");
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "Open navigation" }).click();
  await mobile.waitForTimeout(260);
  const drawerOpen = await mobile.evaluate(() => {
    const sidebar = document.querySelector(".dashboard-sidebar");
    return Boolean(sidebar && sidebar.getBoundingClientRect().left >= -1 && document.querySelector(".dashboard-drawer-overlay"));
  });
  if (!drawerOpen) failures.push("mobile drawer open");
  await mobile.getByRole("banner").getByRole("button", { name: "Close navigation" }).click();
  await mobile.waitForTimeout(260);
  const drawerClosed = await mobile.evaluate(() => !document.querySelector(".dashboard-drawer-overlay"));
  if (!drawerClosed) failures.push("mobile drawer close");
  await mobile.close();

  const experience = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await experience.goto(new URL("experience", baseUrl).href, { waitUntil: "networkidle" });
  if ((await experience.locator("h1").first().textContent())?.trim() !== "Career Experience") failures.push("career experience route");
  if (await experience.locator(".dashboard-sidebar__bio").count()) failures.push("career experience sidebar bio");
  if (await experience.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push("career experience overflow");
  const experienceGeometry = await experience.locator(".dashboard-route-page, .dashboard-route-page__icon, button").evaluateAll((elements) =>
    elements.every((element) => getComputedStyle(element).borderRadius === "0px")
  );
  if (!experienceGeometry) failures.push("career experience square geometry");
  const skillToggle = experience.locator(".career-timeline__toggle").first();
  if (await skillToggle.count()) {
    const before = await skillToggle.getAttribute("aria-expanded");
    await skillToggle.click();
    if ((await skillToggle.getAttribute("aria-expanded")) === before) failures.push("career experience skill expansion");
  }
  await experience.close();

  const certifications = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await certifications.goto(new URL("certifications", baseUrl).href, { waitUntil: "networkidle" });
  if ((await certifications.locator("h1").first().textContent())?.trim() !== "Certifications") failures.push("certifications route");
  if (!(await certifications.locator("a").count())) failures.push("certification links");
  if (await certifications.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push("certifications overflow");
  await certifications.close();

  const projects = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await projects.goto(new URL("projects", baseUrl).href, { waitUntil: "networkidle" });
  if ((await projects.locator("h1").first().textContent())?.trim() !== "Projects") failures.push("projects route");
  if (!(await projects.locator(".dashboard-project-card, [data-project-card]").count())) failures.push("projects cards");
  if (await projects.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push("projects overflow");
  await projects.close();

  const detail = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await detail.goto(new URL("projects/teza", baseUrl).href, { waitUntil: "networkidle" });
  if ((await detail.locator("h1").first().textContent())?.trim() !== "Tezā") failures.push("project detail route");
  if (await detail.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push("project detail overflow");
  await detail.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await detail.waitForTimeout(250);
  const backToTop = detail.locator("[aria-label='Back to top'][data-visible='true']");
  if (await backToTop.count() !== 1) {
    failures.push("back to top visibility");
  } else {
    await backToTop.click();
    await detail.waitForTimeout(500);
    if (await detail.evaluate(() => window.scrollY > 10)) failures.push("back to top scrolling");
  }
  await detail.getByRole("button", { name: /Show image 2/ }).click();
  if (await detail.locator(".project-detail__thumb[data-active='true']").count() !== 1) failures.push("project thumbnail navigation");
  await detail.locator(".project-detail__gallery-main").click();
  if (await detail.locator(".lightbox").count() !== 1) failures.push("project lightbox open");
  await detail.getByRole("button", { name: "Close" }).click();
  if (await detail.locator(".lightbox").count() !== 0) failures.push("project lightbox close");
  await detail.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify({ passed: failures.length === 0, failures }));
if (failures.length) process.exitCode = 1;
