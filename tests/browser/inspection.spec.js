import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../../src/engine.js";

async function startAt(page, index, completed = index) {
  await page.goto("/");
  await page.evaluate(
    ({ key, index, completed }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          current: index,
          solved: Object.fromEntries(
            Array.from({ length: completed }, (_, i) => [i, { at: 1 }]),
          ),
          notes: { [index]: "PRIVATE FIELD NOTE 4182" },
          hints: {},
          attempts: {},
        }),
      ),
    { key: STORAGE_KEY, index, completed },
  );
  await page.goto(`/?entry=${index + 1}`);
}

test("Chapter 2 starts below Copy your result and preserves the first hundred entries", async ({
  page,
}) => {
  await startAt(page, 99, 100);
  await expect(page.locator('[data-part-complete="1"]')).toBeVisible();
  const share = await page.locator(".share-button").boundingBox();
  const chapter = await page.locator("#begin-chapter-two").boundingBox();
  expect(chapter.y).toBeGreaterThan(share.y + share.height);
  await page.locator("#begin-chapter-two").click();
  await expect(page).toHaveURL(/entry=101/);
  await expect(page.locator("#puzzle-title")).toHaveText(
    "The page above the page.",
  );
  await expect(page.locator(".header-progress")).toHaveText("100 / 200");
  await expect(page.locator('meta[name="arrival"]')).toHaveAttribute(
    "content",
    "threshold",
  );
  await expect(page.locator("#clue-panel")).not.toContainText("threshold");
  await page.locator("#answer").fill("threshold");
  await page.locator("#answer").press("Enter");
  await page.locator("#next-entry").click();
  await expect(page.locator('meta[name="arrival"]')).toHaveCount(0);
  expect(await page.locator(".site-footer").innerHTML()).toContain(
    "For the returning reader: bramble.",
  );
  await page.locator('[data-part="0"]').click();
  await expect(page).toHaveURL(/entry=100/);
  await expect(page.locator('[data-part-complete="1"]')).toBeVisible();
});

test("the inspector includes the full document, hides private notes, and finds head metadata", async ({
  page,
}) => {
  await startAt(page, 100);
  await page.locator('.pocket-tools [data-action="inspect"]').click();
  const source = page.locator(".inspector-source");
  await expect(source).toContainText("<html");
  await expect(source).toContainText("<head>");
  await expect(source).toContainText('class="site-header"');
  await expect(source).toContainText('class="site-footer"');
  await expect(source).toContainText('name="arrival" content="threshold"');
  await expect(source).not.toContainText("PRIVATE FIELD NOTE 4182");
  await expect(source).not.toContainText("inspectionPuzzles");
  await page.locator("#source-search").fill("arrival");
  await expect(page.locator(".inspector-source mark")).toHaveText("arrival");
  await page.locator("#elements-tab").click();
  await page.locator("#element-search").fill("arrival");
  await expect(
    page.locator(".dom-node").filter({ hasText: "<meta " }),
  ).toHaveCount(1);
  await page.locator(".dom-node").filter({ hasText: "<meta " }).click();
  await expect(page.locator(".selected-source")).toContainText(
    'content="threshold"',
  );
  await expect(page.locator(".selected-element")).toContainText("threshold");
});

test("the layout tab shows the page, selects real elements, and keeps the preview read-only", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await startAt(page, 100);
  await page.locator('.pocket-tools [data-action="inspect"]').click();
  await page.locator("#layout-tab").click();
  const frame = page.frameLocator('iframe[title="Read-only full page layout"]');
  await expect(frame.locator(".site-header")).toBeVisible();
  await expect(frame.locator(".site-footer")).toHaveCount(1);
  await expect(frame.locator("#field-note")).toHaveValue("");
  await expect(frame.locator("#answer")).toHaveAttribute("readonly", "");
  await frame.locator("#puzzle-title").click();
  await expect(page.locator(".layout-details .selected-source")).toContainText(
    'id="puzzle-title"',
  );
  await expect(page.locator(".layout-highlight")).toBeVisible();
  await page.locator(".dialog-close").click();
  await expect(page.locator("#field-note")).toHaveValue(
    "PRIVATE FIELD NOTE 4182",
  );
  expect(errors).toEqual([]);
});

test("computed style evidence and box dimensions are available outside the puzzle panel", async ({
  page,
}) => {
  await startAt(page, 132);
  expect(
    await page
      .locator("#measured-width")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBe(42);
  await page.locator('.pocket-tools [data-action="inspect"]').click();
  await page.locator("#elements-tab").click();
  await page.locator("#element-search").fill("measured-width");
  await page
    .locator(".dom-node")
    .filter({ hasText: '<div id="measured-width"' })
    .click();
  await expect(page.locator(".box-measurement")).toContainText("42 ×");
  await expect(page.locator(".selected-element")).toContainText("42px");
  await page.locator(".dialog-close").click();
  await page.locator("#answer").fill("42");
  await page.locator("#answer").press("Enter");
  await page.locator("#next-entry").click();
  expect(
    await page
      .locator("#box-measure")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBe(54);
});

test("full-page source expands nested templates and current styles clean up between questions", async ({
  page,
}) => {
  await startAt(page, 118);
  await page.locator('.pocket-tools [data-action="inspect"]').click();
  await expect(page.locator(".inspector-source")).toContainText(
    'id="second-fold"',
  );
  await expect(page.locator(".inspector-source")).toContainText("<b>nest</b>");
  await page.locator(".dialog-close").click();
  await startAt(page, 121);
  expect(
    await page
      .locator(".site-footer")
      .evaluate((el) => getComputedStyle(el, "::after").content),
  ).toBe('"amber"');
  await page.locator("#answer").fill("amber");
  await page.locator("#answer").press("Enter");
  await page.locator("#next-entry").click();
  expect(
    await page
      .locator(".site-footer")
      .evaluate((el) => getComputedStyle(el, "::after").content),
  ).toBe("none");
});

for (const width of [320, 390]) {
  test(`Chapter 2 inspector and section navigation work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await startAt(page, 100);
    await page.locator(".progress-button").click();
    await expect(page.locator('[data-index-part="1"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("[data-index-chapter]")).toHaveCount(5);
    await page.locator('[data-index-part="0"]').click();
    await expect(page.locator('[data-visit="99"]')).toHaveCount(0);
    await page.locator('[data-index-part="1"]').click();
    await page.locator('[data-visit="100"]').click();
    await page.locator('.pocket-tools [data-action="inspect"]').click();
    await page.locator("#elements-tab").click();
    await page.locator("#element-search").fill("arrival");
    await page.locator(".dom-node").filter({ hasText: "<meta " }).click();
    expect(
      await page
        .locator("#app-dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page.locator("#layout-tab").click();
    await expect(
      page.frameLocator("iframe").locator("#puzzle-title"),
    ).toBeVisible();
    expect(
      await page
        .locator("#app-dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  });
}
