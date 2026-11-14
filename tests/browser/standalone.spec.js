import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { build } from "vite";
import { puzzles } from "../../src/puzzles.js";

let html;
test.beforeAll(async () => {
  await build({ logLevel: "silent" });
  await promisify(execFile)(process.execPath, [
    "scripts/export-standalone.mjs",
  ]);
  html = await readFile("dist/the-afterword.html", "utf8");
});

test("standalone edition completes all 100 entries with every network request blocked", async ({
  page,
}) => {
  const requests = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    requests.push(route.request().url());
    return route.abort();
  });
  // An inline document has no server URL or file-origin history permissions.
  // This exercises the same server-free branch used by the downloaded file.
  await page.setContent(html);
  await expect(page.locator("#entry-address")).toContainText("entry=1");
  for (const puzzle of puzzles) {
    await expect(page.locator("#puzzle-title")).toHaveText(`${puzzle.title}.`);
    if (puzzle.id === 43)
      await expect(page.locator("#entry-address")).toContainText(
        "#second-thought",
      );
    if (puzzle.id === 49) {
      expect(
        await page
          .locator(".crane-art")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      ).toBe(true);
      await expect(page.locator(".crane-art")).toHaveAttribute(
        "data-filename",
        "paper-crane.svg",
      );
    }
    if (puzzle.id === 57) {
      await expect(page.locator("#entry-address")).toContainText("key=thimble");
      await page.locator('.pocket-tools [data-action="inspect"]').click();
      await page.locator("#details-tab").click();
      await expect(page.locator(".address-detail")).toContainText(
        "key=thimble",
      );
      await page.locator(".dialog-close").click();
    }
    await page.locator("#answer").fill(puzzle.answers[0]);
    await page.locator("#answer").press("Enter");
    await expect(page.locator(".solved-panel")).toBeVisible();
    if (puzzle.id < 99) await page.locator("#next-entry").click();
  }
  await expect(page.locator(".final-panel")).toBeVisible();
  await expect(page.locator(".header-progress")).toHaveText("100 / 100");
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

test("standalone edition preserves notes and progress when browser storage is allowed", async ({
  page,
}) => {
  // Serve only the document through Playwright's local fixture interception.
  // Any attempt to fetch a separate asset is a test failure.
  const externalRequests = [];
  await page.route("**/*", (route) => {
    if (route.request().url() === "http://127.0.0.1:3000/offline-fixture")
      return route.fulfill({ contentType: "text/html", body: html });
    externalRequests.push(route.request().url());
    return route.abort();
  });
  await page.goto("/offline-fixture");
  await page.locator("#field-note").fill("This edition needs no server.");
  await page.locator("#answer").fill("what");
  await page.locator("#answer").press("Enter");
  await page.reload();
  await expect(page.locator(".header-progress")).toHaveText("1 / 100");
  await expect(page.locator("#field-note")).toHaveValue(
    "This edition needs no server.",
  );
  await expect(page.locator(".solved-panel")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(externalRequests).toEqual([]);
});
