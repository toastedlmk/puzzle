import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../../src/engine.js";

for (const width of [1440, 320]) {
  test(`redo resets only this question and replays completed entries at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("#field-note").fill("Keep my note.");
    await page.locator("#hint-button").click();
    await page.locator("#answer").fill("wrong");
    await page.locator("#answer").press("Enter");
    await page
      .getByRole("button", { name: "Redo question", exact: true })
      .click();
    await expect(page.locator("#answer")).toHaveValue("");
    await expect(page.locator("#answer")).toBeFocused();
    await expect(page.locator("#answer-feedback")).toBeEmpty();
    await expect(page.locator(".hint-note")).toHaveCount(0);
    await expect(page.locator("#field-note")).toHaveValue("Keep my note.");
    await expect(page.locator(".header-progress")).toHaveText("0 / 200");
    await page.locator("#answer").fill("what");
    await page.locator("#answer").press("Enter");
    await page.locator("#next-entry").click();
    await page.locator("#answer").fill("star");
    await page.locator("#answer").press("Enter");
    await page.locator(".progress-button").click();
    await page.locator('[data-visit="0"]').click();
    await expect(page.locator(".solved-panel")).toBeVisible();
    await page
      .getByRole("button", { name: "Redo question", exact: true })
      .click();
    await expect(page.locator("#answer")).toBeVisible();
    await expect(page.locator(".solved-panel")).toHaveCount(0);
    await expect(page.locator(".redo-badge")).toHaveText("REDO");
    await expect(page.locator(".header-progress")).toHaveText("2 / 200");
    await expect(page.locator(".hint-note")).toHaveCount(0);
    await page.locator("#hint-button").click();
    await page.reload();
    await expect(page.locator("#answer")).toHaveValue("");
    await expect(page.locator(".redo-badge")).toBeVisible();
    await expect(page.locator(".hint-note")).toHaveCount(1);
    await expect(page.locator("#field-note")).toHaveValue("Keep my note.");
    await expect(page.locator(".header-progress")).toHaveText("2 / 200");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Redo question", exact: true })
      .click();
    await expect(page.locator(".hint-note")).toHaveCount(0);
    await page.locator('[data-action="decoder"]').click();
    await page.locator("#decode-input").fill("d2hhdA==");
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await page.locator("#use-translation").click();
    await page.locator("#answer").press("Enter");
    await expect(page.locator(".solved-panel")).toBeVisible();
    await expect(page.locator(".redo-badge")).toHaveCount(0);
    await expect(page.locator(".header-progress")).toHaveText("2 / 200");
    await page.locator("#next-entry").click();
    await expect(page.locator("#puzzle-title")).toHaveText("Quiet beginnings.");
    await expect(page.locator(".solved-panel")).toBeVisible();
    await page.locator(".progress-button").click();
    await expect(page.locator('[data-visit="2"]')).toBeEnabled();
    await expect(page.locator('[data-visit="3"]')).toBeDisabled();
  });
}

test("the first chapter completion can be redone without losing its progress", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          current: 99,
          solved: Object.fromEntries(
            Array.from({ length: 100 }, (_, i) => [i, { at: 1 }]),
          ),
          hints: {},
          attempts: {},
          notes: {},
        }),
      ),
    STORAGE_KEY,
  );
  await page.goto("/?entry=100");
  await expect(page.locator(".final-panel")).toBeVisible();
  await page
    .getByRole("button", { name: "Redo question", exact: true })
    .click();
  await expect(page.locator(".final-panel")).toHaveCount(0);
  await expect(page.locator("#answer")).toBeVisible();
  await expect(page.locator(".header-progress")).toHaveText("100 / 200");
  await page.locator("#answer").fill("what");
  await page.locator("#answer").press("Enter");
  await expect(page.locator(".final-panel")).toBeVisible();
  await expect(page.locator(".header-progress")).toHaveText("100 / 200");
  await page.reload();
  await expect(page.locator(".final-panel")).toBeVisible();
});
