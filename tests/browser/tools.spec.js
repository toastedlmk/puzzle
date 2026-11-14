import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../../src/engine.js";

async function startAt(page, index) {
  await page.goto("/");
  await page.evaluate(
    ({ key, index }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          current: index,
          solved: Object.fromEntries(
            Array.from({ length: index }, (_, i) => [i, { at: 1 }]),
          ),
          hints: {},
          attempts: {},
          notes: {},
          startedAt: 1,
        }),
      );
    },
    { key: STORAGE_KEY, index },
  );
  await page.goto(`/?entry=${index + 1}`);
}

async function fakeClipboard(page) {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedText = text;
        },
      },
    }),
  );
}

for (const width of [1440, 390]) {
  test(`translator search filters, handles no matches, and restores the list at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator('[data-action="decoder"]').click();
    await page.locator("#decode-input").fill("... --- ...");
    const search = page.getByRole("searchbox", { name: "FIND A TRANSLATOR" });
    await search.fill("MoRsE");
    await expect(page.locator("#translator-count")).toHaveText("2 translators");
    await expect(page.locator("#decode-method option")).toHaveCount(2);
    await expect(page.locator("#decode-method")).toHaveValue("morse");
    await expect(page.locator("#decode-input")).toHaveValue("... --- ...");
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(page.locator("#decode-output")).toHaveText("SOS");
    await expect(page.locator("#copy-translation")).toBeEnabled();

    await search.fill("vigenere");
    await expect(page.locator("#decode-method option")).toHaveCount(2);
    await expect(page.locator("#key-controls")).toBeVisible();
    await expect(page.locator("#copy-translation")).toBeDisabled();
    await expect(page.locator("#decode-output")).toHaveText(
      "Your translation will appear here.",
    );
    await search.fill("no-such-translator-xyz");
    await expect(page.locator("#translator-count")).toHaveText("0 translators");
    await expect(page.locator("#decode-method")).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Translate", exact: true }),
    ).toBeDisabled();
    await expect(page.locator("#decode-method-help")).toContainText(
      "No matches",
    );
    await search.press("Enter");
    await expect(page.locator("#decode-output")).toHaveText(
      "Your translation will appear here.",
    );

    await search.fill("");
    await expect(page.locator("#decode-method option")).toHaveCount(32);
    await expect(page.locator("#decode-method")).toHaveValue("vigenere");
    await expect(
      page.getByRole("button", { name: "Translate", exact: true }),
    ).toBeEnabled();
    await search.fill("rot13");
    await expect(page.locator("#translator-count")).toHaveText("1 translator");
    await page.locator("#decode-input").fill("FRPERG");
    await search.press("Enter");
    await expect(page.locator("#decode-method")).toBeFocused();
    await expect(page.locator("#decode-output")).toHaveText(
      "Your translation will appear here.",
    );
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(page.locator("#decode-output")).toHaveText("SECRET");
    expect(
      await page
        .locator("#app-dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  });
}

test("copy the decimal clue from entry 028, translate it, copy the result, and fill the answer", async ({
  page,
}) => {
  await fakeClipboard(page);
  await startAt(page, 27);
  await expect(
    page.getByRole("button", { name: "Copy text", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy clue", exact: true }),
  ).toHaveCount(0);
  await page.locator("#copy-clue").click();
  await expect
    .poll(() => page.evaluate(() => window.copiedText))
    .toBe("83 72 69 76 70");
  await expect(page.locator("#copy-clue")).toContainText("Copied!");
  const clue = await page.evaluate(() => window.copiedText);
  await page.locator('[data-action="decoder"]').click();
  await expect(page.locator("#copy-translation")).toBeDisabled();
  await page.locator("#decode-method").selectOption("ascii");
  await page.locator("#decode-input").fill(clue);
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("SHELF");
  await page.locator("#copy-translation").click();
  await expect.poll(() => page.evaluate(() => window.copiedText)).toBe("SHELF");
  await expect(page.locator("#copy-translation")).toContainText("Copied!");
  await page.locator("#use-translation").click();
  await expect(page.locator("#answer")).toHaveValue("SHELF");
  await expect(page.locator(".header-progress")).toHaveText("27 / 200");
  await page.locator("#answer").press("Enter");
  await expect(page.locator(".header-progress")).toHaveText("28 / 200");
});

test("Morse handles copied puzzle symbols and encodes text; bad input cannot be copied as a result", async ({
  page,
}) => {
  await fakeClipboard(page);
  await startAt(page, 8);
  await page.locator("#copy-clue").click();
  const clue = await page.evaluate(() => window.copiedText);
  await page.locator('[data-action="decoder"]').click();
  await expect(page.locator("#decode-method option")).toHaveCount(32);
  await page.locator("#decode-method").selectOption("morse");
  await page.locator("#decode-input").fill(clue);
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("SOS");
  await page.locator("#decode-method").selectOption("morse-encode");
  await page.locator("#decode-input").fill("SOS PAGE");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText(
    "... --- ... / .--. .- --. .",
  );
  await page.locator("#decode-method").selectOption("morse");
  await page.locator("#decode-input").fill("......");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveClass("decode-error");
  await expect(page.locator("#copy-translation")).toBeDisabled();
  await expect(page.locator("#use-translation")).toBeDisabled();
});

test("rotation amount and direction work, keyed tools reveal their key field, and HTML output stays text", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-action="decoder"]').click();
  await page.locator("#decode-method").selectOption("rotate");
  await expect(page.locator("#rotation-controls")).toBeVisible();
  await expect(page.locator("#key-controls")).not.toBeVisible();
  await page.locator("#decode-input").fill("FRPERG");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("SECRET");
  await page.locator("#decode-shift").fill("3");
  await page.locator("#decode-direction").selectOption("forward");
  await page.locator("#decode-input").fill("XYZ");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("ABC");
  await page.locator("#decode-shift").fill("26");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("XYZ");
  await page.locator("#decode-shift").fill("");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveClass("decode-error");
  await page.locator("#decode-method").selectOption("vigenere");
  await expect(page.locator("#rotation-controls")).not.toBeVisible();
  await expect(page.locator("#key-controls")).toBeVisible();
  await page.locator("#decode-input").fill("YTCX");
  await page.locator("#decode-key").fill("KEY");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("OPEN");
  await page.locator("#decode-method").selectOption("html");
  await page.locator("#decode-input").fill("&lt;em&gt;clue&lt;/em&gt;");
  await page.getByRole("button", { name: "Translate", exact: true }).click();
  await expect(page.locator("#decode-output")).toHaveText("<em>clue</em>");
  await expect(page.locator("#decode-output em")).toHaveCount(0);
});

test("copying visible HTML clues does not expose comments or hidden text", async ({
  page,
}) => {
  await fakeClipboard(page);
  await startAt(page, 41);
  await page.locator("#copy-clue").click();
  await expect
    .poll(() => page.evaluate(() => window.copiedText))
    .toBe("( a note in the margin )");
  await startAt(page, 55);
  await page.locator("#copy-clue").click();
  await expect
    .poll(() => page.evaluate(() => window.copiedText))
    .toBe("an empty display case");
});

test("clipboard denial falls back to selected text without reporting a false copy", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    });
    document.execCommand = () => false;
  });
  await startAt(page, 27);
  await page.locator("#copy-clue").click();
  await expect(page.locator("#copy-text")).toHaveValue("83 72 69 76 70");
  await expect(page.locator("#copy-text")).toBeFocused();
  expect(
    await page
      .locator("#copy-text")
      .evaluate((el) => el.value.slice(el.selectionStart, el.selectionEnd)),
  ).toBe("83 72 69 76 70");
  await expect(page.locator("#toast")).not.toHaveText("Text copied.");
});

test("copy controls and expanded translator settings fit small screens", async ({
  page,
}) => {
  await fakeClipboard(page);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await startAt(page, 28);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#copy-clue").click();
    await expect
      .poll(() => page.evaluate(() => window.copiedText))
      .toBe("F R P E R G");
    await page.locator('[data-action="decoder"]').click();
    await page.locator("#decode-method").selectOption("rotate");
    await page.locator("#decode-input").fill("FRPERG");
    await page.getByRole("button", { name: "Translate", exact: true }).click();
    await expect(page.locator("#decode-output")).toHaveText("SECRET");
    expect(
      await page
        .locator("#app-dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page.locator("#copy-translation").click();
    await expect
      .poll(() => page.evaluate(() => window.copiedText))
      .toBe("SECRET");
    await page.locator("#use-translation").click();
    await expect(page.locator("#answer")).toHaveValue("SECRET");
  }
});
