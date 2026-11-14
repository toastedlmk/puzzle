import { test, expect } from "@playwright/test";
import { puzzles } from "../../src/puzzles.js";
import { STORAGE_KEY } from "../../src/engine.js";

test("wrong answers, hints, notes, reload, replay, and chapter locks work together", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#puzzle-title")).toHaveText("A small beginning.");
  await page.locator("#field-note").fill("Read the question literally.");
  await page.locator("#answer").fill("wrong");
  await page.locator("#answer-form").evaluate((form) => form.requestSubmit());
  await expect(page.locator("#answer-feedback")).toContainText("Not quite");
  await expect(page.locator(".header-progress")).toHaveText("0 / 200");
  await page.locator("#hint-button").click();
  await expect(page.locator(".hint-note")).toHaveCount(1);
  await page.locator("#hint-button").click();
  await expect(page.locator("#hint-button")).toContainText("Reveal the answer");
  await page.locator("#hint-button").click();
  await expect(page.locator("#hint-list")).toContainText("“what”");
  await page.locator("#answer").fill("WHAT?");
  await page.locator("#answer").press("Enter");
  await expect(page.locator(".solved-panel")).toBeVisible();
  await expect(page.locator(".header-progress")).toHaveText("1 / 200");
  await page.reload();
  await expect(page.locator(".solved-panel")).toBeVisible();
  await expect(page.locator("#field-note")).toHaveValue(
    "Read the question literally.",
  );
  await page.locator("#next-entry").click();
  await expect(page.locator("#puzzle-title")).toHaveText("Quiet beginnings.");
  await expect(page.locator("#field-note")).toHaveValue("");
  await page.locator(".progress-button").click();
  await page.locator('[data-index-chapter="4"]').click();
  await expect(page.locator(".index-entry:disabled")).toHaveCount(20);
  await page.locator('[data-index-chapter="0"]').click();
  await page.locator('[data-visit="0"]').click();
  await expect(page.locator("#field-note")).toHaveValue(
    "Read the question literally.",
  );
  await expect(page.locator(".header-progress")).toHaveText("1 / 200");
});

test("help, source inspector, details tab, and decoder desk are functional", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".rules-link").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".rules-list li")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.locator('.pocket-tools [data-action="inspect"]').click();
  await expect(page.locator(".inspector-source")).toContainText(
    "What is the first word",
  );
  await page.getByRole("tab", { name: "Page details" }).click();
  await expect(page.locator(".page-details")).toContainText(
    "The Afterword — Entry 001",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Page source" })).toBeFocused();
  await expect(page.locator(".inspector-source")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator('[data-action="decoder"]').click();
  await page.locator("#decode-method").selectOption("hex");
  await page.locator("#decode-input").fill("4E 4F 54 45");
  await page.getByRole("button", { name: "Translate" }).click();
  await expect(page.locator("#decode-output")).toHaveText("NOTE");
  await page.locator("#decode-input").fill("not hex");
  await page.getByRole("button", { name: "Translate" }).click();
  await expect(page.locator("#decode-output")).toHaveClass("decode-error");
  await expect(
    page.getByRole("button", { name: "Use as answer" }),
  ).toBeDisabled();
});

for (const width of [1440, 390]) {
  test(`decoder result fills the answer without submitting at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("#answer").fill("wrong");
    await page.locator("#answer").press("Enter");
    await expect(page.locator("#answer")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await page.locator('[data-action="decoder"]').click();
    const useButton = page.getByRole("button", { name: "Use as answer" });
    await expect(useButton).toBeDisabled();

    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(useButton).toBeDisabled();
    await page
      .locator("#decode-input")
      .fill(Buffer.from("x".repeat(201)).toString("base64"));
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(useButton).toBeDisabled();
    await expect(page.locator("#decode-use-hint")).toContainText(
      "200 characters",
    );

    await page.locator("#decode-method").selectOption("hex");
    await page.locator("#decode-input").fill("57 48 41 54");
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(page.locator("#decode-output")).toHaveText("WHAT");
    await expect(useButton).toBeEnabled();
    await useButton.click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("#answer")).toHaveValue("WHAT");
    await expect(page.locator("#answer")).toBeFocused();
    await expect(page.locator("#answer")).not.toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.locator("#answer-feedback")).toBeEmpty();
    await expect(page.locator(".header-progress")).toHaveText("0 / 200");
    await page.locator("#answer").press("Enter");
    await expect(page.locator(".header-progress")).toHaveText("1 / 200");

    await page.locator('[data-action="decoder"]').click();
    await page.locator("#decode-input").fill("d2hhdA==");
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Use as answer" }),
    ).toBeDisabled();
    await expect(page.locator("#decode-use-hint")).toContainText(
      "unsolved entry",
    );
  });
}

test("all 200 entries can be completed and browser-specific clues are really present", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const puzzle of puzzles) {
    await expect(page.locator("#puzzle-title")).toHaveText(`${puzzle.title}.`);
    if (puzzle.id === 40)
      await expect(page.locator(".clue-mark")).toHaveAttribute(
        "title",
        /lantern/,
      );
    if (puzzle.id === 41)
      expect(await page.locator("#clue-panel").innerHTML()).toContain(
        "<!-- The word is velvet. -->",
      );
    if (puzzle.id === 43)
      expect(new URL(page.url()).hash).toBe("#second-thought");
    if (puzzle.id === 44) {
      await page.locator(".lift-paper").click();
      await expect(page.locator(".concealed-word")).toHaveClass(/uncovered/);
    }
    if (puzzle.id === 47)
      expect(
        await page
          .locator(".before-ticket")
          .evaluate((el) => getComputedStyle(el, "::before").content),
      ).toBe('"POCKET"');
    if (puzzle.id === 49)
      expect(
        await page
          .locator(".crane-art")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      ).toBe(true);
    if (puzzle.id === 50) expect(await page.title()).toMatch(/^HARBOR/);
    if (puzzle.id === 54) {
      await page.locator(".clue-details summary").click();
      await expect(page.locator(".clue-details p")).toBeVisible();
    }
    if (puzzle.id === 57)
      expect(new URL(page.url()).searchParams.get("key")).toBe("thimble");
    await page.locator("#answer").fill(puzzle.answers[0]);
    await page.locator("#answer").press("Enter");
    await expect(page.locator(".solved-panel")).toBeVisible();
    await expect(page.locator(".header-progress")).toHaveText(
      `${puzzle.id + 1} / 200`,
    );
    if (puzzle.id === 99) await page.locator("#begin-chapter-two").click();
    else if (puzzle.id < puzzles.length - 1)
      await page.locator("#next-entry").click();
  }
  await expect(page.locator(".final-panel")).toContainText(
    "You saw beyond the surface.",
  );
  await page.reload();
  await expect(page.locator(".header-progress")).toHaveText("200 / 200");
  await expect(page.locator(".final-panel")).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile layouts fit narrow viewports and clues remain usable", async ({
  browser,
}) => {
  for (const width of [320, 390, 768]) {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      isMobile: width < 500,
      hasTouch: true,
    });
    const page = await context.newPage();
    for (const id of [0, 14, 22, 37, 42, 49, 70, 74, 79, 98]) {
      await page.addInitScript(
        ({ key, id }) => {
          const solved = Object.fromEntries(
            Array.from({ length: id }, (_, i) => [i, { at: 1 }]),
          );
          localStorage.setItem(
            key,
            JSON.stringify({
              version: 1,
              current: id,
              solved,
              hints: {},
              attempts: {},
              notes: {},
              startedAt: 1,
            }),
          );
        },
        { key: STORAGE_KEY, id },
      );
      await page.goto(`/?entry=${id + 1}`);
      await expect(page.locator("#puzzle-title")).toHaveText(
        `${puzzles[id].title}.`,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Entry ${id + 1} fits ${width}px`,
      ).toBe(true);
      await page.locator("#answer").fill(puzzles[id].answers[0]);
      await page.locator(".submit-button").click();
      await expect(page.locator(".solved-panel")).toBeVisible();
    }
    await page.locator('.pocket-tools [data-action="inspect"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator(".dialog-close").click();
    await context.close();
  }
});

test("locked URLs, corrupted storage, and disabled storage recover safely", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(
    (key) => localStorage.setItem(key, "{corrupt"),
    STORAGE_KEY,
  );
  await page.goto("/?entry=100");
  await expect(page.locator("#puzzle-title")).toHaveText("A small beginning.");
  await context.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked");
      },
    }),
  );
  const blockedPage = await blocked.newPage();
  await blockedPage.goto("/");
  await expect(blockedPage.locator(".save-status")).toContainText(
    "STORAGE UNAVAILABLE",
  );
  await blockedPage.locator("#answer").fill("what");
  await blockedPage.locator("#answer").press("Enter");
  await expect(blockedPage.locator(".solved-panel")).toBeVisible();
  await blocked.close();
});

test("reset requires an explicit choice and clears the saved journey", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#answer").fill("what");
  await page.locator("#answer").press("Enter");
  await page.locator(".progress-button").click();
  await page.locator('[data-action="reset"]').click();
  await page.getByRole("button", { name: "Keep my place" }).click();
  await expect(page.locator(".header-progress")).toHaveText("1 / 200");
  await page.locator('[data-action="reset"]').click();
  await page.locator("#confirm-reset").click();
  await expect(page.locator(".header-progress")).toHaveText("0 / 200");
  await expect(page.locator("#answer")).toBeVisible();
});
