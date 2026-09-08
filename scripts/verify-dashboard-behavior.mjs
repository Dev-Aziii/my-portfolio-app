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
    const projects = document.querySelector(".dashboard-panel--projects");
    const skills = document.querySelector(".dashboard-content-grid__secondary > section");
    const certifications = document.querySelector(".dashboard-content-grid__full");
    const projectBounds = projects?.getBoundingClientRect();
    const skillsBounds = skills?.getBoundingClientRect();
    const certificationsBounds = certifications?.getBoundingClientRect();
    const asciiPortrait = document.querySelector("[data-profile-ascii]");
    const profileToggle = document.querySelector("[data-profile-toggle]");
    const profileImage = document.querySelector("[data-profile-image]");
    const profileArt = document.querySelector(".dashboard-profile-art");
    const profileCard = document.querySelector(".dashboard-profile");
    const profileDissolve = document.querySelector("[data-profile-dissolve]");
    const asciiLines = asciiPortrait?.textContent?.split("\n") ?? [];
    const rectSnapshot = (element) => {
      const bounds = element?.getBoundingClientRect();
      return bounds ? { top: bounds.top, left: bounds.left, width: bounds.width, height: bounds.height } : null;
    };
    return {
      sectionIds,
      navItems: document.querySelectorAll(".dashboard-nav__item").length,
      sidebarName: document.querySelector(".dashboard-profile__name")?.textContent?.trim(),
      sidebarTagline: document.querySelector(".dashboard-profile__tagline")?.textContent?.trim(),
      hasSidebarAvailability: Boolean(document.querySelector(".dashboard-profile__availability")),
      sidebarOverflowX: getComputedStyle(document.querySelector(".dashboard-sidebar")).overflowX,
      sidebarOverflowY: getComputedStyle(document.querySelector(".dashboard-sidebar")).overflowY,
      sidebarMiddleOverflowX: getComputedStyle(document.querySelector(".dashboard-sidebar__middle")).overflowX,
      sidebarMiddleOverflowY: getComputedStyle(document.querySelector(".dashboard-sidebar__middle")).overflowY,
      profileCardRadius: getComputedStyle(document.querySelector(".dashboard-profile")).borderRadius,
      profileCardMinHeight: getComputedStyle(document.querySelector(".dashboard-profile")).minHeight,
      profileCardMarginTop: getComputedStyle(document.querySelector(".dashboard-profile")).marginTop,
      sidebarInnerFrameBorder: getComputedStyle(document.querySelector(".dashboard-sidebar"), "::before").borderTopWidth,
      asciiHidden: asciiPortrait?.getAttribute("aria-hidden"),
      asciiLineCount: asciiLines.length,
      asciiLineWidths: [...new Set(asciiLines.map((line) => line.length))],
      asciiCharactersValid: /^[01\s]+$/.test(asciiPortrait?.textContent ?? ""),
      profileToggleTag: profileToggle?.tagName.toLowerCase() ?? "",
      profileTogglePressed: profileToggle?.getAttribute("aria-pressed"),
      profileToggleLabel: profileToggle?.getAttribute("aria-label"),
      profileImageSrc: profileImage?.getAttribute("src") ?? "",
      profileImageLoaded: Boolean(profileImage && profileImage.complete && profileImage.naturalWidth > 0),
      profileArtHeight: profileArt ? getComputedStyle(profileArt).height : "",
      profileCardHeight: profileCard ? getComputedStyle(profileCard).height : "",
      profileDissolveTag: profileDissolve?.tagName.toLowerCase() ?? "",
      profileDissolveCanvas: Boolean(profileDissolve?.querySelector("canvas")),
      profileDissolveState: profileDissolve?.getAttribute("data-profile-dissolve-state") ?? "",
      profileArtBounds: rectSnapshot(profileArt),
      profileCardBounds: rectSnapshot(profileCard),
      contactNav: [...document.querySelectorAll(".dashboard-nav__item")].some((item) => item.textContent?.trim() === "Contact"),
      sidebarEmail: document.querySelector(".dashboard-sidebar__footer-email[href^='mailto:']")?.getAttribute("href"),
      footerLabel: document.querySelector(".dashboard-sidebar__footer-label")?.textContent?.trim(),
      quickLinks: [...document.querySelectorAll(".dashboard-sidebar__quick-link")].map((item) => item.textContent?.trim()),
      contactLinks: [...document.querySelectorAll(".dashboard-sidebar__contact-link")].map((item) => item.textContent?.trim()),
      hasSidebarConnectSection: Boolean(document.getElementById("sidebar-connect")),
      hasPortraitPurpose: Boolean(document.querySelector(".dashboard-profile-art__purpose")),
      footerSignature: document.querySelector(".dashboard-sidebar__signature")?.textContent?.trim(),
      hasContactSection: Boolean(contact),
      hasContactCopy: pageText.includes("Let's work together"),
      featuredDetailAccent: getComputedStyle(document.querySelector("[data-featured-project-detail]")).getPropertyValue("--project-accent").trim(),
      activeSelectorAccent: getComputedStyle(document.querySelector("[data-project-selector][data-active='true']")).getPropertyValue("--project-accent").trim(),
      selectorJustifyContent: getComputedStyle(document.querySelector(".dashboard-featured-projects__selector")).justifyContent,
      activityRows: document.querySelectorAll(".dashboard-activity__item").length,
      desktopGrid: {
        projectSkillsShareRow: Boolean(projectBounds && skillsBounds && Math.abs(projectBounds.top - skillsBounds.top) <= 2),
        projectsBeforeSkills: Boolean(projectBounds && skillsBounds && projectBounds.left < skillsBounds.left),
        certificationsSpansGrid: certifications ? getComputedStyle(certifications).gridColumn === "1 / -1" : false,
        certificationsBelowProjects: Boolean(projectBounds && certificationsBounds && certificationsBounds.top > projectBounds.top),
      },
    };
  });
  if (overviewState.sectionIds.includes("about") || overviewState.sectionIds.includes("experience") || overviewState.sectionIds.includes("education") || overviewState.sectionIds.includes("github")) {
    failures.push("overview redundant sections");
  }
  if (overviewState.navItems !== 5 || overviewState.sidebarName !== "Azi" || overviewState.sidebarTagline !== "> Turning ideas into solutions" || overviewState.contactNav) failures.push("sidebar navigation");
  if (overviewState.sidebarOverflowX !== "hidden" || overviewState.sidebarOverflowY !== "hidden" || overviewState.sidebarMiddleOverflowX !== "hidden" || overviewState.sidebarMiddleOverflowY !== "auto") failures.push("sidebar scroll ownership");
  if (overviewState.profileCardRadius !== "12px" || overviewState.profileCardMinHeight !== "94px" || overviewState.profileCardMarginTop !== "-100px" || overviewState.sidebarInnerFrameBorder !== "0px") failures.push("profile card geometry");
  if (overviewState.hasSidebarAvailability || overviewState.asciiHidden !== "true") failures.push("ascii profile semantics");
  if (!overviewState.asciiCharactersValid || overviewState.asciiLineCount < 40 || overviewState.asciiLineWidths.length !== 1 || overviewState.asciiLineWidths[0] !== 72) failures.push("ascii profile grid");
  if (overviewState.profileToggleTag !== "button" || overviewState.profileTogglePressed !== "false" || overviewState.profileToggleLabel !== "Show profile photo" || !overviewState.profileImageLoaded || !overviewState.profileImageSrc.endsWith("/images/profile.webp") || overviewState.profileArtHeight !== "300px" || overviewState.profileCardHeight !== "94px" || overviewState.profileDissolveTag !== "div" || !overviewState.profileDissolveCanvas || overviewState.profileDissolveState !== "closed") {
    failures.push("profile reveal control");
  }
  if (overviewState.quickLinks.join("|") !== "GitHub|LinkedIn|Download CV" || overviewState.contactLinks.length !== 0 || overviewState.hasSidebarConnectSection) failures.push("sidebar utility groups");
  if (overviewState.footerLabel !== "For work and collaboration contact me at" || overviewState.footerSignature || overviewState.hasPortraitPurpose) failures.push("sidebar contact footer");
  if (overviewState.hasContactSection || overviewState.hasContactCopy) failures.push("contact removal");
  if (overviewState.sidebarEmail !== "mailto:adzyl.jipos@gmail.com") failures.push("sidebar email link");
  if (!overviewState.featuredDetailAccent || !overviewState.activeSelectorAccent || overviewState.selectorJustifyContent !== "center" || overviewState.activityRows !== 3) {
    failures.push("themed featured projects and compact activity");
  }
  const selectorAccents = await desktop.locator("[data-project-selector]").evaluateAll((selectors) => selectors.map((selector) => getComputedStyle(selector).getPropertyValue("--project-accent").trim()));
  if (selectorAccents.length !== 3 || selectorAccents.some((accent) => !accent) || new Set(selectorAccents).size !== selectorAccents.length) {
    failures.push("project selector themes");
  }
  if (!overviewState.desktopGrid.projectSkillsShareRow || !overviewState.desktopGrid.projectsBeforeSkills || !overviewState.desktopGrid.certificationsSpansGrid || !overviewState.desktopGrid.certificationsBelowProjects) {
    failures.push("desktop overview grid placement");
  }

  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  const profileClosed = await desktop.evaluate(() => {
    const art = document.querySelector(".dashboard-profile-art")?.getBoundingClientRect();
    const card = document.querySelector(".dashboard-profile")?.getBoundingClientRect();
    const dissolveCanvas = document.querySelector("[data-profile-dissolve] canvas");
    return {
      path: window.location.pathname,
      dissolveGrid: dissolveCanvas?.getAttribute("data-profile-dissolve-grid") ?? "",
      art: art ? { top: art.top, left: art.left, width: art.width, height: art.height } : null,
      card: card ? { top: card.top, left: card.left, width: card.width, height: card.height } : null,
    };
  });
  if (profileClosed.dissolveGrid !== "24x36") failures.push("profile dissolve granularity");
  const profileToggle = desktop.locator("[data-profile-toggle]");
  if (await profileToggle.count() !== 1) {
    failures.push("profile reveal interaction control");
  } else {
    await profileToggle.click();
    await desktop.waitForTimeout(120);
    const profileRevealMid = await desktop.evaluate(() => {
      const dissolve = document.querySelector("[data-profile-dissolve]");
      const image = document.querySelector("[data-profile-image]");
      return {
        state: dissolve?.getAttribute("data-profile-dissolve-state"),
        dissolveOpacity: dissolve ? getComputedStyle(dissolve).opacity : "",
        imageOpacity: image ? getComputedStyle(image).opacity : "",
      };
    });
    if (profileRevealMid.state !== "revealing" || profileRevealMid.dissolveOpacity === "0" || profileRevealMid.imageOpacity !== "0") failures.push("profile reveal mid-transition");
    await desktop.waitForTimeout(780);
    const profileRevealSlow = await desktop.evaluate(() => document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"));
    if (profileRevealSlow !== "revealing") failures.push("profile reveal duration");
    await desktop.waitForTimeout(600);
    await desktop.evaluate(() => document.activeElement?.blur());
    await desktop.mouse.move(500, 500);
    await desktop.waitForTimeout(220);
    const profileOpen = await desktop.evaluate(() => {
      const art = document.querySelector(".dashboard-profile-art")?.getBoundingClientRect();
      const card = document.querySelector(".dashboard-profile")?.getBoundingClientRect();
      const image = document.querySelector("[data-profile-image]");
      const dissolve = document.querySelector("[data-profile-dissolve]");
      return {
        path: window.location.pathname,
        pressed: document.querySelector("[data-profile-toggle]")?.getAttribute("aria-pressed"),
        state: document.querySelector(".dashboard-profile-art")?.getAttribute("data-profile-revealed"),
        label: document.querySelector("[data-profile-toggle]")?.getAttribute("aria-label"),
        imageOpacity: image ? getComputedStyle(image).opacity : "",
        dissolveState: dissolve?.getAttribute("data-profile-dissolve-state"),
        dissolveOpacity: dissolve ? getComputedStyle(dissolve).opacity : "",
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        art: art ? { top: art.top, left: art.left, width: art.width, height: art.height } : null,
        card: card ? { top: card.top, left: card.left, width: card.width, height: card.height } : null,
      };
    });
    if (profileOpen.path !== profileClosed.path || profileOpen.pressed !== "true" || profileOpen.state !== "true" || profileOpen.label !== "Show ASCII portrait" || profileOpen.overflow || profileOpen.dissolveState !== "open" || profileOpen.dissolveOpacity !== "0" || profileOpen.imageOpacity === "0" || JSON.stringify(profileOpen.art) !== JSON.stringify(profileClosed.art) || JSON.stringify(profileOpen.card) !== JSON.stringify(profileClosed.card)) {
      failures.push("profile reveal open state");
    }
    await profileToggle.click();
    await desktop.waitForTimeout(120);
    const profileHideMid = await desktop.evaluate(() => {
      const dissolve = document.querySelector("[data-profile-dissolve]");
      const image = document.querySelector("[data-profile-image]");
      return {
        state: dissolve?.getAttribute("data-profile-dissolve-state"),
        dissolveOpacity: dissolve ? getComputedStyle(dissolve).opacity : "",
        imageOpacity: image ? getComputedStyle(image).opacity : "",
      };
    });
    if (profileHideMid.state !== "hiding" || profileHideMid.dissolveOpacity === "0" || Number.parseFloat(profileHideMid.imageOpacity) >= 1) failures.push("profile reveal reverse mid-transition");
    await desktop.waitForTimeout(780);
    const profileHideSlow = await desktop.evaluate(() => document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"));
    if (profileHideSlow !== "hiding") failures.push("profile reveal reverse duration");
    await desktop.waitForTimeout(600);
    const profileReversed = await desktop.evaluate(() => ({
      path: window.location.pathname,
      pressed: document.querySelector("[data-profile-toggle]")?.getAttribute("aria-pressed"),
      state: document.querySelector(".dashboard-profile-art")?.getAttribute("data-profile-revealed"),
      label: document.querySelector("[data-profile-toggle]")?.getAttribute("aria-label"),
      dissolveState: document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    if (profileReversed.path !== profileClosed.path || profileReversed.pressed !== "false" || profileReversed.state !== "false" || profileReversed.label !== "Show profile photo" || profileReversed.dissolveState !== "closed" || profileReversed.overflow) {
      failures.push("profile reveal reverse state");
    }
  }

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

  await desktop.goto(new URL("tech-stack", baseUrl).href, { waitUntil: "networkidle" });
  const techStackState = await desktop.evaluate(() => {
    const pills = [...document.querySelectorAll(".dashboard-skill-pill--tech")];
    const firstPill = pills[0];
    const firstIcon = firstPill?.querySelector("svg");
    const firstIconStyles = firstIcon ? getComputedStyle(firstIcon) : null;
    return {
      pillCount: pills.length,
      everyPillHasOneIcon: pills.every((pill) => pill.querySelectorAll("svg").length === 1),
      everyIconIsDecorative: pills.every((pill) => pill.querySelector("svg")?.getAttribute("aria-hidden") === "true"),
      everyPillHasBrandColor: pills.every((pill) => pill.style.getPropertyValue("--tech-brand-color").trim()),
      fontSize: firstPill ? getComputedStyle(firstPill).fontSize : "",
      padding: firstPill ? getComputedStyle(firstPill).padding : "",
      iconSize: firstIconStyles ? `${firstIconStyles.width} ${firstIconStyles.height}` : "",
    };
  });
  if (techStackState.pillCount === 0 || !techStackState.everyPillHasOneIcon || !techStackState.everyIconIsDecorative || !techStackState.everyPillHasBrandColor) {
    failures.push("tech-stack pill icons");
  }
  if (techStackState.fontSize !== "10.4px" || techStackState.padding !== "6px 10px" || techStackState.iconSize !== "14px 14px") {
    failures.push("tech-stack pill sizing");
  }

  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  const githubButton = desktop.getByRole("button", { name: "View GitHub contributions" });
  if (await githubButton.count() !== 1) {
    failures.push("github modal trigger");
  } else {
    await githubButton.click();
    if (await desktop.getByRole("dialog").count() !== 1 || !(await desktop.getByRole("dialog").getByText("[ - GITHUB - ]").count())) failures.push("github modal open");
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
    featuredLogo: getComputedStyle(document.querySelector("[data-project-selector] img")).filter,
    featuredHero: getComputedStyle(document.querySelector("[data-featured-project-detail] img")).filter,
  }));
  const themeToggleState = await desktop.locator("[data-theme-toggle]").evaluateAll((toggles) => toggles.map((toggle) => ({
    role: toggle.getAttribute("role"),
    options: [...toggle.querySelectorAll("[data-theme-option]")].map((option) => ({
      value: option.getAttribute("data-theme-option"),
      role: option.getAttribute("role"),
      checked: option.getAttribute("aria-checked"),
      icon: option.querySelectorAll("svg").length,
    })),
  })));
  const heroHoverFilter = await desktop.evaluate(() => getComputedStyle(document.querySelector(".dashboard-hero__art img")).filter);
  await desktop.locator("[data-project-selector]").first().hover();
  await desktop.waitForTimeout(350);
  const featuredLogoHoverFilter = await desktop.evaluate(() => getComputedStyle(document.querySelector("[data-project-selector] img")).filter);
  if (artworkFilters.hero !== "none" || artworkFilters.featuredLogo !== "none" || artworkFilters.featuredHero !== "none" || artworkFilters.hero !== heroHoverFilter || artworkFilters.featuredLogo !== featuredLogoHoverFilter) failures.push("image color treatment");
  if (themeToggleState.some((toggle) => toggle.role !== "radiogroup" || toggle.options.length !== 3 || toggle.options.some((option) => option.role !== "radio" || !["true", "false"].includes(option.checked) || option.icon !== 1))) failures.push("theme switch semantics");

  await desktop.goto(new URL("projects", baseUrl).href, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "Skills" }).click();
  await desktop.waitForTimeout(300);
  if (!desktop.url().endsWith("/tech-stack")) failures.push("route navigation");
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  const mobileOverviewState = await mobile.evaluate(() => {
    const mobileBar = document.querySelector(".dashboard-mobile-bar");
    const menu = mobileBar?.querySelector(".dashboard-icon-button");
    const artwork = document.querySelector(".dashboard-featured-projects__detail-art");
    const artworkImage = artwork?.querySelector("img");
    const sections = [
      document.querySelector(".dashboard-panel--projects"),
      document.querySelector(".dashboard-content-grid__full"),
      document.querySelector(".dashboard-content-grid__secondary > section"),
      document.querySelector(".dashboard-activity"),
    ];
    return {
      mobileHeaderHasProfileImage: Boolean(mobileBar?.querySelector("img")),
      mobileHeaderHasThemeToggle: Boolean(mobileBar?.querySelector("[data-theme-toggle]")),
      mobileHeaderButtonCount: mobileBar?.querySelectorAll("button").length ?? 0,
      mobileHeaderRightInset: menu ? window.innerWidth - menu.getBoundingClientRect().right : 0,
      sectionTops: sections.map((section) => section?.getBoundingClientRect().top ?? -1),
      artworkHeight: artwork ? Number.parseFloat(getComputedStyle(artwork).height) : 0,
      artworkObjectFit: artworkImage ? getComputedStyle(artworkImage).objectFit : "",
    };
  });
  if (mobileOverviewState.mobileHeaderHasProfileImage || mobileOverviewState.mobileHeaderHasThemeToggle || mobileOverviewState.mobileHeaderButtonCount !== 1 || mobileOverviewState.mobileHeaderRightInset < 20) {
    failures.push("mobile header controls and inset");
  }
  if (mobileOverviewState.sectionTops.some((top, index, tops) => index > 0 && top <= tops[index - 1])) {
    failures.push("mobile overview section order");
  }
  if (mobileOverviewState.artworkHeight < 200 || mobileOverviewState.artworkObjectFit !== "contain") {
    failures.push("mobile overview artwork sizing");
  }
  await mobile.getByRole("button", { name: "Open navigation" }).click();
  await mobile.waitForTimeout(260);
  const drawerOpen = await mobile.evaluate(() => {
    const sidebar = document.querySelector(".dashboard-sidebar");
    return Boolean(sidebar && sidebar.getBoundingClientRect().left >= -1 && document.querySelector(".dashboard-drawer-overlay"));
  });
  if (!drawerOpen) failures.push("mobile drawer open");
  const mobileProfileToggle = mobile.locator("[data-profile-toggle]");
  if (await mobileProfileToggle.count() !== 1) {
    failures.push("mobile profile reveal control");
  } else {
    await mobileProfileToggle.click();
    await mobile.waitForTimeout(1600);
    const mobileProfileOpen = await mobile.evaluate(() => ({
      path: window.location.pathname,
      pressed: document.querySelector("[data-profile-toggle]")?.getAttribute("aria-pressed"),
      sidebarOpen: document.querySelector(".dashboard-sidebar")?.classList.contains("is-open"),
      dissolveState: document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    if (mobileProfileOpen.path !== "/" || mobileProfileOpen.pressed !== "true" || mobileProfileOpen.dissolveState !== "open" || !mobileProfileOpen.sidebarOpen || mobileProfileOpen.overflow) failures.push("mobile profile reveal");
  }
  await mobile.keyboard.press("Escape");
  await mobile.waitForTimeout(260);
  const drawerClosed = await mobile.evaluate(() => !document.querySelector(".dashboard-drawer-overlay"));
  if (!drawerClosed) failures.push("mobile drawer escape close");
  await mobile.getByRole("button", { name: "Open navigation" }).click();
  await mobile.getByRole("banner").getByRole("button", { name: "Close navigation" }).click();
  await mobile.waitForTimeout(260);
  if (await mobile.locator(".dashboard-drawer-overlay").count()) failures.push("mobile drawer button close");
  await mobile.close();

  const reducedMotion = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await reducedMotion.emulateMedia({ reducedMotion: "reduce" });
  await reducedMotion.goto(baseUrl, { waitUntil: "networkidle" });
  await reducedMotion.getByRole("button", { name: "Open navigation" }).click();
  await reducedMotion.waitForTimeout(260);
  const reducedMotionToggle = reducedMotion.locator("[data-profile-toggle]");
  if (await reducedMotionToggle.count() !== 1) {
    failures.push("reduced-motion profile reveal control");
  } else {
    await reducedMotionToggle.click();
    await reducedMotion.waitForTimeout(80);
    const reducedOpen = await reducedMotion.evaluate(() => ({
      state: document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"),
      imageOpacity: getComputedStyle(document.querySelector("[data-profile-image]")).opacity,
    }));
    if (reducedOpen.state !== "open" || reducedOpen.imageOpacity === "0") failures.push("reduced-motion profile reveal");
    await reducedMotionToggle.click();
    await reducedMotion.waitForTimeout(80);
    const reducedClosed = await reducedMotion.evaluate(() => document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state"));
    if (reducedClosed !== "closed") failures.push("reduced-motion profile reverse");
  }
  await reducedMotion.close();

  const experience = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await experience.goto(new URL("experience", baseUrl).href, { waitUntil: "networkidle" });
  if ((await experience.locator("h1").first().textContent())?.trim() !== "Career Experience") failures.push("career experience route");
  if (await experience.locator(".dashboard-sidebar__bio").count()) failures.push("career experience sidebar bio");
  if (await experience.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push("career experience overflow");
  const experienceGeometry = await experience.locator(".dashboard-route-page__icon, button:not(.theme-toggle):not(.theme-toggle__option)").evaluateAll((elements) =>
    elements.every((element) => getComputedStyle(element).borderRadius !== "0px")
  );
  if (!experienceGeometry) failures.push("career experience rounded geometry");
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
  const projectCatalogState = await projects.evaluate(() => {
    const catalog = document.querySelector("[data-project-catalog]");
    const cards = [...document.querySelectorAll("[data-project-catalog-card]")];
    const logos = [...document.querySelectorAll("[data-project-catalog-card] img[data-project-logo]")];
    const gridColumns = catalog ? getComputedStyle(catalog).gridTemplateColumns.split(" ").filter(Boolean).length : 0;
    return {
      cards: cards.length,
      logos: logos.length,
      logosLoaded: logos.every((logo) => logo.complete && logo.naturalWidth > 0),
      heroImages: document.querySelectorAll("[data-project-catalog-card] img[src*='/hero.webp']").length,
      detailLinks: document.querySelectorAll("[data-project-catalog-link][href^='/projects/']").length,
      demoLinks: document.querySelectorAll("[data-project-demo]").length,
      demoLinksSafe: [...document.querySelectorAll("[data-project-demo]")].every((link) => link.target === "_blank" && link.rel.includes("noopener")),
      localStatuses: document.querySelectorAll("[data-project-local-status]").length,
      themedCards: cards.filter((card) => getComputedStyle(card).getPropertyValue("--project-accent").trim()).length,
      gridColumns,
    };
  });
  if (projectCatalogState.cards !== 4 || projectCatalogState.logos !== 4 || !projectCatalogState.logosLoaded) failures.push("projects logo catalog");
  if (projectCatalogState.heroImages !== 0) failures.push("projects catalog hero image removal");
  if (projectCatalogState.detailLinks !== 4 || projectCatalogState.demoLinks !== 3 || !projectCatalogState.demoLinksSafe || projectCatalogState.localStatuses !== 1) failures.push("projects catalog actions");
  if (projectCatalogState.themedCards !== 4) failures.push("projects catalog accents");
  if (projectCatalogState.gridColumns !== 2) failures.push("projects tablet columns");
  if (await projects.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push("projects overflow");
  const firstLogoBounds = await projects.locator("[data-project-catalog-card]").first().locator("[data-project-logo]").boundingBox();
  if (!firstLogoBounds) {
    failures.push("projects card navigation target");
  } else {
    await Promise.all([
      projects.waitForURL(new URL("projects/teza", baseUrl).href),
      projects.mouse.click(firstLogoBounds.x + firstLogoBounds.width / 2, firstLogoBounds.y + firstLogoBounds.height / 2),
    ]);
  }
  if (!projects.url().endsWith("/projects/teza")) failures.push("projects card navigation");
  await projects.close();

  const projectsMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await projectsMobile.goto(new URL("projects", baseUrl).href, { waitUntil: "networkidle" });
  const mobileCatalogState = await projectsMobile.evaluate(() => {
    const catalog = document.querySelector("[data-project-catalog]");
    return {
      columns: catalog ? getComputedStyle(catalog).gridTemplateColumns.split(" ").filter(Boolean).length : 0,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  if (mobileCatalogState.columns !== 1 || mobileCatalogState.overflow) failures.push("projects mobile layout");
  await projectsMobile.close();

  const detail = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await detail.goto(new URL("projects/teza", baseUrl).href, { waitUntil: "networkidle" });
  if ((await detail.locator("h1").first().textContent())?.trim() !== "Tezā") failures.push("project detail route");
  const detailAccent = await detail.evaluate(() => {
    const element = document.querySelector("[data-project-detail-theme]");
    return element ? getComputedStyle(element).getPropertyValue("--project-accent").trim() : "";
  });
  if (!detailAccent) failures.push("project detail accents");
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
