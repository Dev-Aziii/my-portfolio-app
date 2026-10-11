import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { launchBrowser, baseUrl, command, openTerminal } from "./terminal-browser.mjs";

const browser = await launchBrowser();
await mkdir("output/playwright/terminal", { recursive: true });
try {
  for (const [name, width, height] of [["desktop", 1440, 1000], ["tablet", 768, 1024], ["mobile", 390, 844], ["narrow", 320, 740]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    await page.addInitScript(() => localStorage.setItem("presentation-mode", "terminal"));
    for (const [routeName, route] of [["home", ""], ["projects", "projects"], ["detail", "projects/teza"], ["skills", "tech-stack"], ["experience", "experience"], ["certifications", "certifications"], ["404", "missing"]]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}/${routeName} overflow`);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(5, 5, 5)");
      assert.equal(await page.locator(".terminal-shell").evaluate((element) => getComputedStyle(element).color), "rgb(245, 245, 245)");
      await page.screenshot({ path: `output/playwright/terminal/${name}-${routeName}.png`, fullPage: true, caret: "initial" });
      if (routeName === "home") {
        await page.screenshot({ path: `output/playwright/terminal/${name}-closed.png`, fullPage: false, caret: "initial" });
        await page.getByRole("button", { name: "Show profile photo" }).click();
        await page.waitForFunction(() => Number(getComputedStyle(document.querySelector("[data-profile-image]")).opacity) === 1);

        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: `output/playwright/terminal/${name}-portrait.png`, fullPage: false, caret: "initial" });
        await page.getByRole("button", { name: "Show ASCII portrait" }).click();
        await page.evaluate(() => window.scrollTo(0, 0));
        await openTerminal(page);
        const handle = page.getByRole("separator", { name: "Resize terminal" });
        for (const [size, key] of [["default", null], ["minimum", "Home"], ["maximum", "End"]]) {
          if (key) await handle.press(key);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.ok(await page.locator("#terminal-console").evaluate((element) => element.getBoundingClientRect().width === innerWidth));
          await page.screenshot({ path: `output/playwright/terminal/${name}-panel-${size}.png`, fullPage: false, caret: "initial" });
        }
        await handle.dblclick();
        await page.getByRole("combobox", { name: "Terminal command" }).focus();
        await page.getByRole("combobox", { name: "Terminal command" }).fill("c");
        await page.screenshot({ path: `output/playwright/terminal/${name}-suggestions.png`, fullPage: false, caret: "initial" });
        await command(page, 'echo "monochrome portfolio, colorful commands"');
        await page.screenshot({ path: `output/playwright/terminal/${name}-command.png`, fullPage: false, caret: "initial" });
      }
    }
    await page.close();
  }
  const animated = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await animated.addInitScript(() => localStorage.setItem("presentation-mode", "terminal"));
  await animated.goto(baseUrl, { waitUntil: "networkidle" });
  await animated.getByRole("button", { name: "Show profile photo" }).click();
  await animated.waitForFunction(() => document.querySelector("[data-profile-dissolve]")?.getAttribute("data-profile-dissolve-state") === "revealing");
  await animated.waitForFunction(() => {
    const canvas = document.querySelector("[data-profile-dissolve] canvas"), pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    return pixels.some((value, index) => index % 4 === 3 && value > 0);
  });
  await animated.screenshot({ path: "output/playwright/terminal/desktop-portrait-transition.png", fullPage: false, caret: "initial" });
  console.log("Terminal visual checks passed at four viewport sizes across all seven route presentations.");
} finally { await browser.close(); }
