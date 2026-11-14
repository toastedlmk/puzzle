import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { puzzles } from "../src/puzzles.js";
import { PARTS, ENTRY_COUNT } from "../src/game-config.js";
import { decodeText } from "../src/decoder.js";
import { restoreState, canVisit, submitAnswer } from "../src/engine.js";

test("the original 100 questions retain their exact text, answers, hints, and numbering", () => {
  const retained = puzzles
    .slice(0, 100)
    .map(({ part, ...original }) => original);
  const hash = createHash("sha256")
    .update(JSON.stringify(retained))
    .digest("hex");
  assert.equal(
    hash,
    "61f7625f9357beb20bc81fb0883c63f4a84478085e5cb6eaf2f72cd7c3498723",
  );
  assert.equal(puzzles.length, ENTRY_COUNT);
  assert.equal(PARTS.length, 2);
});

test("all 100 new questions place their evidence outside the central box", () => {
  for (const puzzle of puzzles.slice(100)) {
    assert.equal(puzzle.part, 1);
    assert.ok(
      puzzle.scene.length > 0,
      `Entry ${puzzle.id + 1} needs actual page evidence`,
    );
    assert.ok(
      !puzzle.content
        .replace(/<svg[\s\S]*?<\/svg>/g, "")
        .replace(/<[^>]*>/g, "")
        .includes(puzzle.answers[0]),
      `Entry ${puzzle.id + 1} must not print its answer in the box`,
    );
    for (const operation of puzzle.scene) {
      assert.ok(
        ["attribute", "comment", "html", "css"].includes(operation.kind),
      );
      assert.ok(!operation.target?.includes("clue-panel"));
    }
  }
});

test("old completed saves unlock Chapter 2 without changing earned answers or notes", () => {
  const old = {
    version: 1,
    current: 99,
    solved: Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [i, { at: 123 }]),
    ),
    hints: { 0: 2 },
    notes: { 28: "A note from Chapter 1." },
    attempts: { 0: 3 },
  };
  const state = restoreState(
    { getItem: () => JSON.stringify(old) },
    ENTRY_COUNT,
  );
  assert.equal(Object.keys(state.solved).length, 100);
  assert.equal(state.current, 99);
  assert.equal(state.notes[28], old.notes[28]);
  assert.ok(canVisit(state, 100));
  assert.ok(!canVisit(state, 101));
  assert.equal(
    submitAnswer(state, puzzles[100], "threshold").status,
    "correct",
  );
  assert.equal(Object.keys(state.solved).length, 101);
  assert.equal(state.solved[0].at, 123);
});

test("encoded page evidence and the final reference puzzles decode to their declared answers", () => {
  const attr = (id) =>
    puzzles[id - 1].scene.find((op) => op.kind === "attribute").value;
  const json = (id) =>
    JSON.parse(
      puzzles[id - 1].scene
        .find((op) => op.kind === "html")
        .html.match(/<script[^>]*>([\s\S]*)<\/script>/)[1],
    );
  assert.equal(decodeText(attr(161), "hex"), puzzles[160].answers[0]);
  assert.equal(decodeText(attr(164), "binary"), puzzles[163].answers[0]);
  assert.equal(decodeText(attr(167), "url"), puzzles[166].answers[0]);
  assert.equal(
    decodeText(json(168).payload, "reverse"),
    puzzles[167].answers[0],
  );
  assert.equal(
    decodeText(json(170).payload, "vigenere", { key: attr(170) }).toLowerCase(),
    puzzles[169].answers[0],
  );
  assert.equal(
    decodeText(json(172).pairs, "polybius").toLowerCase(),
    puzzles[171].answers[0],
  );
  assert.equal(
    json(174)
      .filter((row) => row.keep)
      .map((row) => row.ch)
      .join("")
      .toLowerCase(),
    puzzles[173].answers[0],
  );
  assert.equal(
    json(175)
      .sort((a, b) => a.n - b.n)
      .map((row) => row.ch)
      .join("")
      .toLowerCase(),
    puzzles[174].answers[0],
  );
  assert.equal(
    decodeText(decodeText(json(184).payload, "base64"), "atbash"),
    puzzles[183].answers[0],
  );
  assert.equal(
    decodeText(json(194).hex.split(" ").reverse().join(" "), "hex"),
    puzzles[193].answers[0],
  );
  const references = [
    [197, [112, 106, 122, 166, 120, 121]],
    [199, [121, 164, 119, 166, 120, 180]],
  ];
  for (const [id, entries] of references)
    assert.equal(
      entries.map((n) => puzzles[n - 1].answers[0][0]).join(""),
      puzzles[id - 1].answers[0],
    );
});
