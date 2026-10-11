import assert from "node:assert/strict";
import { launchBrowser, baseUrl, command, openTerminal } from "./terminal-browser.mjs";

const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const controls = await page.evaluate(() => {
    const theme = document.querySelector(".dashboard-sidebar .theme-toggle").getBoundingClientRect();
    const mode = document.querySelector(".dashboard-sidebar .presentation-toggle").getBoundingClientRect();
    return { aligned: Math.abs(theme.top - mode.top) < 2, beside: mode.left >= theme.right };
  });
  assert.deepEqual(controls, { aligned: true, beside: true }, "theme and presentation controls share a row");
  await page.getByRole("button", { name: "Terminal Mode", exact: true }).click();
  const input = page.getByRole("combobox", { name: "Terminal command" });
  await openTerminal(page);
  await input.waitFor();
  await input.focus();
  assert.equal(await input.evaluate((element) => getComputedStyle(element).outlineStyle), "none", "inline prompt has no separate field box");
  assert.equal(await input.evaluate((element) => !!element.closest(".terminal-transcript")), true, "prompt belongs to transcript");
  assert.ok(await page.locator("#terminal-console").evaluate((element) => element.getBoundingClientRect().height <= 360));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  assert.ok(await page.locator(".terminal-header").evaluate((element) => Math.abs(element.getBoundingClientRect().top) < 2), "portfolio header stays pinned");
  await input.fill('echo "hello world"');
  assert.equal(await page.locator(".terminal-live-command .terminal-token-command").innerText(), "echo");
  assert.equal(await page.locator(".terminal-live-command .terminal-token-argument").innerText(), '"hello world"');
  assert.notEqual(await page.locator(".terminal-live-command .terminal-token-command").evaluate((element) => getComputedStyle(element).color), await page.locator(".terminal-live-command .terminal-token-argument").evaluate((element) => getComputedStyle(element).color));
  await input.press("Enter");
  assert.match(await page.locator("[data-terminal-output]").innerText(), /hello world/);
  assert.equal(await page.locator(".terminal-submitted-command .terminal-token-command").last().innerText(), "echo");
  await input.fill("echo submitted");
  await page.getByRole("button", { name: "Run command" }).click();
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Terminal command", "submit retains prompt focus");
  // Native editing, horizontal highlight scrolling, and IME remain intact.
  await input.fill("echo " + "a".repeat(260));
  await input.press("End");
  await page.waitForFunction(() => {
    const input = document.querySelector(".terminal-live-command input");
    const mirror = document.querySelector(".terminal-command-mirror");
    return input.scrollLeft > 0 && Math.abs(input.scrollLeft - mirror.scrollLeft) <= 1;
  });
  await input.press("Home");
  await input.press("ArrowRight");
  await input.press("x");
  assert.ok((await input.inputValue()).startsWith("excho"));
  await input.fill("cd pro text");
  await input.press("Home");
  for (let i = 0; i < 6; i++) await input.press("ArrowRight");
  await page.getByRole("option", { name: /projects/ }).waitFor();
  await input.press("Tab");
  assert.equal(await input.inputValue(), "cd projects/ text");
  assert.equal(await input.evaluate((element) => element.selectionStart), 12, "completion preserves caret after active token");
  await command(page, "clear");
  await command(page, "help");
  const transcript = page.locator(".terminal-transcript");
  await input.fill("");
  await transcript.evaluate((element) => { element.scrollTop = 0; });
  await input.blur();
  const scrollBefore = await transcript.evaluate((element) => element.scrollTop);
  const oldHeader = await page.locator("#terminal-console .terminal-panel-heading").boundingBox();
  await transcript.evaluate((element) => { element.scrollTop = 10; });
  const newHeader = await page.locator("#terminal-console .terminal-panel-heading").boundingBox();
  assert.equal(oldHeader.y, newHeader.y, "console header does not scroll with output");
  assert.equal(scrollBefore, 0);
  // Reading output does not focus the input; clicking blank terminal space does.
  await page.locator(".terminal-output-line").first().click();
  assert.notEqual(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Terminal command");
  await command(page, "clear");
  await input.blur();
  await transcript.click({ position: { x: 10, y: 100 } });
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Terminal command");
  await command(page, "cd /");
  await page.getByRole("button", { name: "Close terminal" }).click();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => { await document.fonts.ready; await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    await page.evaluate(() => window.scrollTo(0, 0));
    const before = await page.locator(".terminal-profile-art").boundingBox();
    await page.getByRole("button", { name: "Show profile photo" }).click();
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector("[data-profile-image]")).opacity) === 1);
    const proportions = await page.locator(".terminal-profile-art").evaluate((element) => {
      const frame = element.getBoundingClientRect(), image = element.querySelector("img").getBoundingClientRect(), ascii = element.querySelector("pre").getBoundingClientRect();
      const scale = image.width / 806;
      return { heightRatio: 869 * scale / ascii.height, widthRatio: 609 * scale / ascii.width, topDifference: Math.abs(image.top + 211 * scale - ascii.top) / frame.height };
    });
    assert.ok(Math.abs(proportions.heightRatio - 1) <= .1 && Math.abs(proportions.widthRatio - 1) <= .1, `portrait subject matches ASCII at ${width}px: ${JSON.stringify(proportions)}`);
    assert.ok(proportions.topDifference <= .05);
    assert.ok(await page.locator("[data-profile-dissolve] canvas").evaluate((canvas) => {
      const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      return data.some((value, index) => index % 4 === 3 && value > 0);
    }), "portrait canvas contains visible subject pixels");
    assert.deepEqual(await page.locator(".terminal-profile-art").boundingBox(), before, "portrait frame stays stable");
    await page.getByRole("button", { name: "Show ASCII portrait" }).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await page.setViewportSize({ width: 390, height: 400 });
  await openTerminal(page);
  await input.fill("open ");
  await page.waitForFunction(() => { const rect = document.querySelector("[role=listbox]")?.getBoundingClientRect(); return rect && rect.top >= 0 && rect.bottom <= innerHeight; });
  assert.ok(await input.evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight));
  // Simulate a keyboard shrinking only the visual viewport, including a panned viewport.
  await page.evaluate(() => {
    Object.defineProperty(visualViewport, "height", { configurable: true, value: 240 });
    Object.defineProperty(visualViewport, "offsetTop", { configurable: true, value: 40 });
    visualViewport.dispatchEvent(new Event("resize"));
  });
  await page.waitForFunction(() => Math.abs(document.querySelector("#terminal-console").getBoundingClientRect().bottom - 280) < 2);
  await page.waitForFunction(() => document.querySelector(".terminal-live-command input").getBoundingClientRect().bottom <= 280);
  assert.ok(await input.evaluate((element) => element.getBoundingClientRect().bottom <= 280));
  assert.ok(await page.locator(".terminal-header").evaluate((element) => Math.abs(element.getBoundingClientRect().top - 40) < 2), "header follows panned visual viewport");
  assert.ok(await page.getByRole("listbox").evaluate((element) => element.getBoundingClientRect().top >= 40 && element.getBoundingClientRect().bottom <= 280));
  await page.evaluate(() => { delete visualViewport.height; delete visualViewport.offsetTop; visualViewport.dispatchEvent(new Event("resize")); });
  await input.press("Escape");
  await page.getByRole("button", { name: "Close terminal" }).click();
  assert.equal(await page.locator("#terminal-console").isVisible(), false);
  await page.emulateMedia({ forcedColors: "active" });
  await openTerminal(page);
  assert.notEqual(await input.evaluate((element) => getComputedStyle(element).color), "rgba(0, 0, 0, 0)");
  const mobile = await browser.newPage({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "Open navigation" }).click();
  assert.equal(await mobile.locator(".dashboard-sidebar").evaluate((element) => {
    const theme = element.querySelector(".theme-toggle").getBoundingClientRect(), mode = element.querySelector(".presentation-toggle").getBoundingClientRect();
    return Math.abs(theme.top - mode.top) < 2 && mode.left >= theme.right && mode.right <= innerWidth;
  }), true, "mobile drawer controls share a row");
  console.log("Compact terminal checks passed: controls, pinned headers, inline prompt, colors, editing, framing, mobile and forced colors.");
} finally { await browser.close(); }
