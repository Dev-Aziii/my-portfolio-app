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

  const overviewState = await desktop.evaluate(() => {
    const sectionIds = [...document.querySelectorAll("[data-dashboard-section]")].map((section) => section.id);
    const contact = document.getElementById("contact");
    const pageText = document.body.innerText;
    return {
      sectionIds,
      navItems: document.querySelectorAll(".dashboard-nav__item").length,
      sidebarName: document.querySelector(".dashboard-profile__name")?.textContent?.trim(),
      sidebarRole: document.querySelector(".dashboard-profile__role"),
      contactNav: [...document.querySelectorAll(".dashboard-nav__item")].some((item) => item.textContent?.trim() === "Contact"),
      sidebarEmail: document.querySelector(".dashboard-sidebar__footer[href^='mailto:']")?.getAttribute("href"),
      hasContactSection: Boolean(contact),
      hasContactCopy: pageText.includes("Let's work together"),
    };
  });
  if (overviewState.sectionIds.includes("about") || overviewState.sectionIds.includes("experience") || overviewState.sectionIds.includes("education") || overviewState.sectionIds.includes("github")) {
    failures.push("overview redundant sections");
  }
  if (overviewState.navItems !== 5 || overviewState.sidebarName !== "Azi" || overviewState.sidebarRole || overviewState.contactNav) failures.push("compact sidebar navigation");
  if (overviewState.hasContactSection || overviewState.hasContactCopy) failures.push("contact removal");
  if (overviewState.sidebarEmail !== "mailto:adzyl.jipos@gmail.com") failures.push("sidebar email link");

  await desktop.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await desktop.waitForTimeout(250);
  const scrollState = await desktop.evaluate(() => ({
    active: document.querySelector(".dashboard-nav__item[aria-current]")?.textContent?.trim(),
    activeCount: document.querySelectorAll(".dashboard-nav__item[aria-current]").length,
  }));
  if (scrollState.active !== "Overview" || scrollState.activeCount !== 1) failures.push("scroll changes active navigation");

  const sidebarRoutes = [
    ["Projects", "/projects"],
    ["Skills", "/tech-stack"],
    ["Experience", "/experience"],
    ["Certifications", "/certifications"],
  ];
  for (const [label, route] of sidebarRoutes) {
    await desktop.goto(baseUrl, { waitUntil: "networkidle" });
    await desktop.getByRole("button", { name: label, exact: true }).click();
    await desktop.waitForTimeout(300);
    const routeState = await desktop.evaluate(() => ({
      path: window.location.pathname,
      active: document.querySelector(".dashboard-nav__item[aria-current]")?.textContent?.trim(),
      activeCount: document.querySelectorAll(".dashboard-nav__item[aria-current]").length,
    }));
    if (routeState.path !== route || routeState.active !== label || routeState.activeCount !== 1) failures.push(`${label.toLowerCase()} route navigation`);
  }

  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  const githubButton = desktop.getByRole("button", { name: "View GitHub contributions" });
  if (await githubButton.count() !== 1) {
    failures.push("github modal trigger");
  } else {
    await githubButton.click();
    if (await desktop.getByRole("dialog").count() !== 1 || !(await desktop.getByRole("dialog").getByText("[ 06 // GITHUB ]").count())) failures.push("github modal open");
    await desktop.keyboard.press("Escape");
    await desktop.waitForTimeout(200);
    if (await desktop.getByRole("dialog").count() !== 0 || await desktop.evaluate(() => document.body.style.overflow !== "")) failures.push("github modal escape close");
    await githubButton.click();
    await desktop.getByRole("button", { name: "Close GitHub dialog" }).click();
    if (await desktop.getByRole("dialog").count() !== 0) failures.push("github modal button close");
    await githubButton.click();
    await desktop.locator(".github-modal").click({ position: { x: 5, y: 5 } });
    if (await desktop.getByRole("dialog").count() !== 0) failures.push("github modal backdrop close");
  }

  const artworkFilters = await desktop.evaluate(() => ({
    hero: getComputedStyle(document.querySelector(".dashboard-hero__art img")).filter,
    profile: getComputedStyle(document.querySelector(".dashboard-profile__image")).filter,
    project: getComputedStyle(document.querySelector(".dashboard-project-card__image img")).filter,
  }));
  const heroHoverFilter = await desktop.evaluate(() => getComputedStyle(document.querySelector(".dashboard-hero__art img")).filter);
  await desktop.locator(".dashboard-profile").hover();
  await desktop.waitForTimeout(350);
  const profileHoverFilter = await desktop.evaluate(() => getComputedStyle(document.querySelector(".dashboard-profile__image")).filter);
  await desktop.locator(".dashboard-project-card-link").first().hover();
  await desktop.waitForTimeout(350);
  const projectHoverFilter = await desktop.evaluate(() => getComputedStyle(document.querySelector(".dashboard-project-card__image img")).filter);
  if (artworkFilters.hero !== heroHoverFilter || artworkFilters.profile === profileHoverFilter || artworkFilters.project === projectHoverFilter) failures.push("image color hover treatment");

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
