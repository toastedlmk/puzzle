import { test, expect } from "@playwright/test";
import { STORAGE_KEY, freshState } from "../../src/engine.js";

async function startAt(page, index, hints = 0) {
  await page.goto("/");
  const state = freshState();
  state.current = index;
  state.solved = Object.fromEntries(
    Array.from({ length: index }, (_, id) => [id, { at: 1 }]),
  );
  state.hints[index] = hints;
  await page.evaluate(
    ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
    { key: STORAGE_KEY, state },
  );
  await page.goto(`/?entry=${index + 1}`);
}

for (const width of [1440, 390]) {
  test(`answer reveal explains the solution, survives reload, and respects redo at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".solution-steps")).toHaveCount(0);
    await page.locator("#hint-button").click();
    await page.locator("#hint-button").click();
    await expect(page.locator(".answer-reveal")).toHaveCount(0);
    await expect(page.locator("#hint-button")).toHaveText("Reveal the answer");
    await page.locator("#hint-button").click();

    const reveal = page.getByRole("region", { name: "The answer is “what”." });
    await expect(reveal).toBeVisible();
    await expect(reveal.locator("ol > li")).toHaveCount(3);
    await expect(reveal.locator("li").nth(0)).toContainText(
      "What is the first word of this question?",
    );
    await expect(reveal.locator("li").nth(1)).toContainText(
      "its own first word",
    );
    await expect(reveal.locator("li").nth(2)).toContainText(
      "The answer is what",
    );
    await expect(page.locator("#hint-button")).toBeDisabled();
    await expect(page.locator(".header-progress")).toHaveText("0 / 200");
    await expect(page.locator("#answer")).toHaveValue("");

    await page.reload();
    await expect(reveal).toBeVisible();
    await expect(reveal.locator("ol > li")).toHaveCount(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await page.locator("#answer").fill("what");
    await page.locator("#answer").press("Enter");
    await page.locator(".solution-recap summary").click();
    await expect(page.locator(".solution-recap li")).toHaveCount(3);
    await expect(page.locator(".solution-recap li").last()).toBeVisible();
    await expect(page.locator(".header-progress")).toHaveText("1 / 200");
    await page.reload();
    await page.locator(".solution-recap summary").click();
    await expect(page.locator(".solution-recap li").last()).toBeVisible();

    await page.locator("#redo-question").click();
    await expect(page.locator(".solution-steps")).toHaveCount(0);
    await expect(page.locator("#hint-button")).toBeEnabled();
    await expect(page.locator(".header-progress")).toHaveText("1 / 200");
    await page.locator("#hint-button").click();
    await page.locator("#hint-button").click();
    await page.locator("#hint-button").click();
    await expect(reveal).toBeVisible();
    await page.reload();
    await expect(reveal).toBeVisible();
  });
}

test("hidden-page walkthroughs explain where to look without inserting their example HTML", async ({
  page,
}) => {
  await startAt(page, 100, 2);
  await expect(page.locator(".solution-steps")).toHaveCount(0);
  await page.locator("#hint-button").click();
  const reveal = page.locator(".answer-reveal");
  await expect(reveal.locator("li").first()).toContainText("document head");
  await expect(reveal.locator("li").nth(1)).toContainText(
    '<meta name="arrival" content="threshold">',
  );
  await expect(reveal.locator("meta")).toHaveCount(0);
  await expect(page.locator('meta[name="arrival"]')).toHaveCount(1);
  await expect(page.locator(".header-progress")).toHaveText("100 / 200");
  await page.locator("#answer").fill("threshold");
  await page.locator("#answer").press("Enter");
  await page.locator("#next-entry").click();
  await expect(page.locator(".solution-steps")).toHaveCount(0);
  await expect(page.locator('meta[name="arrival"]')).toHaveCount(0);
  await expect(page.locator(".hint-counter")).toHaveText("0 OF 3");
});

test("layered decoding walkthroughs show intermediate results and keep the answer unsubmitted", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await startAt(page, 195, 2);
  await page.locator("#hint-button").click();
  const steps = page.locator(".answer-reveal li");
  await expect(steps).toHaveCount(4);
  await expect(steps.nth(0)).toContainText("keep flag is false");
  await expect(steps.nth(1)).toContainText("ZBGU");
  await expect(steps.nth(2)).toContainText("ROT13");
  await expect(steps.nth(3)).toContainText("moth");
  await expect(page.locator("#answer")).toHaveValue("");
  await expect(page.locator(".header-progress")).toHaveText("195 / 200");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("previously completed entries expose their walkthrough without spending another hint", async ({
  page,
}) => {
  await startAt(page, 100);
  await page.goto("/?entry=75");
  await page.locator(".solution-recap summary").click();
  await expect(page.locator(".solution-recap li")).toHaveCount(4);
  await expect(page.locator(".solution-recap")).toContainText("−22");
  const state = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    STORAGE_KEY,
  );
  expect(state.hints[74]).toBeUndefined();
  await expect(page.locator(".header-progress")).toHaveText("100 / 200");
});
