import { access } from "node:fs/promises";
import { chromium } from "playwright-core";

export const baseUrl = process.env.DASHBOARD_BASE_URL ?? "http://localhost:5173/";
export async function launchBrowser() {
  for (const executablePath of ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"]) {
    try { await access(executablePath); return await chromium.launch({ executablePath, headless: true }); } catch { /* try next location */ }
  }
  throw new Error("Microsoft Edge executable was not found.");
}
export async function openTerminal(page) {
  if (await page.locator("#terminal-console").getAttribute("data-open") !== "true") {
    await page.locator("[data-terminal-launcher]").click();
    await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Terminal command");
  }
}
export async function command(page, text) {
  await openTerminal(page);
  const input = page.getByRole("combobox", { name: "Terminal command" });
  await input.fill(text);
  if (await input.getAttribute("aria-expanded") === "true") await input.press("Escape");
  await input.press("Enter");
}
