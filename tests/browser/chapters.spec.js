import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../../src/engine.js";

async function startAt(page, completed = 25, current = 24) {
  await page.goto("/");
  await page.evaluate(
    ({ key, completed, current }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          current,
          solved: Object.fromEntries(
            Array.from({ length: completed }, (_, i) => [i, { at: 1 }]),
          ),
          hints: {},
          attempts: {},
          notes: { 0: "Keep this note." },
        }),
      ),
    { key: STORAGE_KEY, completed, current },
  );
  await page.goto(`/?entry=${current + 1}`);
}

test("right-clicking chapters lists available questions and revisits without changing progress", async ({
  page,
}) => {
  await startAt(page);
  await page.locator('[data-chapter="0"]').click({ button: "right" });
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.locator("#chapter-menu-title")).toHaveText(
    "First impressions",
  );
  await expect(page.locator("[data-menu-visit]")).toHaveCount(20);
  await page.locator('[data-menu-visit="0"]').click();
  await expect(page.getByRole("menu")).not.toBeVisible();
  await expect(page.locator("#puzzle-title")).toHaveText("A small beginning.");
  await expect(page.locator("#field-note")).toHaveValue("Keep this note.");
  await expect(page.locator(".header-progress")).toHaveText("25 / 100");
  await page.locator('[data-chapter="1"]').click({ button: "right" });
  await expect(page.locator("[data-menu-visit]")).toHaveCount(6);
  await expect(page.locator('[data-menu-visit="25"]')).toBeVisible();
  await expect(page.locator('[data-menu-visit="26"]')).toHaveCount(0);
  await page.locator('[data-menu-visit="25"]').click();
  await expect(page.locator("#answer")).toBeVisible();
  await expect(page).toHaveURL(/entry=26/);
});

test("locked chapters show an empty state and keep their questions locked in the full index", async ({
  page,
}) => {
  await startAt(page);
  await page.locator('[data-chapter="4"]').click({ button: "right" });
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.locator("[data-menu-visit]")).toHaveCount(0);
  await expect(page.locator(".chapter-menu-empty")).toContainText(
    "No questions unlocked",
  );
  await page.locator("[data-menu-index]").click();
  await expect(page.getByRole("menu")).not.toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#chapter-tab-4")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".index-entry:disabled")).toHaveCount(20);
  await expect(page.locator(".header-progress")).toHaveText("25 / 100");
});

test("chapter menus support keyboard navigation, dismissal, and viewport clamping", async ({
  page,
}) => {
  await startAt(page);
  const chapter = page.locator('[data-chapter="0"]');
  await chapter.focus();
  await page.keyboard.press("Shift+F10");
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.locator('[data-menu-visit="0"]')).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator('[data-menu-visit="1"]')).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator("[data-menu-index]")).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.locator('[data-menu-visit="19"]')).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.locator('[data-menu-visit="0"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).not.toBeVisible();
  await expect(chapter).toBeFocused();
  await chapter.dispatchEvent("contextmenu", {
    clientX: 1438,
    clientY: 998,
    bubbles: true,
    cancelable: true,
  });
  const bounds = await page.locator("#chapter-menu").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(8);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(1432);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(992);
  await page.locator(".chapter-menu-list").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await expect(page.getByRole("menu")).toBeVisible();
  await page.locator("#puzzle-title").click();
  await expect(page.getByRole("menu")).not.toBeVisible();
  const prevented = await page.locator("#clue-panel").evaluate((el) => {
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    el.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(false);
});

test("right-click menus inside the index work above the modal and Escape only closes the menu", async ({
  page,
}) => {
  await startAt(page);
  await page.locator(".progress-button").click();
  await page.locator("#chapter-tab-0").click({ button: "right" });
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).not.toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("#chapter-tab-0")).toBeFocused();
  await page.locator("#chapter-tab-1").click({ button: "right" });
  await page.locator('[data-menu-visit="20"]').click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("menu")).not.toBeVisible();
  await expect(page).toHaveURL(/entry=21/);
  await expect(page.locator(".header-progress")).toHaveText("25 / 100");
});

test.describe("touch chapter menus", () => {
  test.use({ hasTouch: true });
  for (const width of [320, 390]) {
    test(`chapter-name dropdown opens the question list on a ${width}px touch screen`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await startAt(page);
      await expect(page.locator(".chapter-sidebar")).not.toBeVisible();
      await page.locator(".chapter-quick-menu").tap();
      await expect(page.getByRole("menu")).toBeVisible();
      await expect(page.locator("[data-menu-visit]")).toHaveCount(6);
      const bounds = await page.locator("#chapter-menu").boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(8);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width - 8);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(836);
      await page.locator('[data-menu-visit="20"]').tap();
      await expect(page).toHaveURL(/entry=21/);
      await expect(page.locator(".header-progress")).toHaveText("25 / 100");
    });
  }
});
