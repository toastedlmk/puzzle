import test from "node:test";
import assert from "node:assert/strict";
import { puzzles, chapters } from "../src/puzzles.js";
import {
  normalizeAnswer,
  isCorrect,
  freshState,
  submitAnswer,
  redoQuestion,
  solvedCount,
  canVisit,
  restoreState,
  STORAGE_KEY,
  getAddress,
} from "../src/engine.js";
import { decodeText } from "../src/decoder.js";

test("100 complete entries form five sequential chapters", () => {
  assert.equal(puzzles.length, 100);
  assert.equal(chapters.length, 5);
  const titles = new Set();
  for (const [id, puzzle] of puzzles.entries()) {
    assert.equal(puzzle.id, id);
    assert.equal(puzzle.chapter, Math.floor(id / 20));
    assert.equal(puzzle.hints.length, 3);
    assert.ok(
      puzzle.explanation.trim().length > 0,
      `Entry ${id + 1} needs an explanation`,
    );
    assert.ok(puzzle.prompt && puzzle.content && puzzle.answers.length);
    assert.ok(!titles.has(puzzle.title), "Every entry has its own title");
    titles.add(puzzle.title);
    for (const answer of puzzle.answers) assert.ok(normalizeAnswer(answer));
  }
});

test("answers ignore case and punctuation without accepting blank values or partial answers", () => {
  assert.equal(normalizeAnswer("  SECOND–THOUGHT!  "), "secondthought");
  assert.ok(isCorrect(puzzles[43], "Second thought!"));
  assert.ok(isCorrect(puzzles[0], " WHAT? "));
  assert.ok(!isCorrect(puzzles[0], "wha"));
  assert.ok(!isCorrect(puzzles[0], "!!"));
  assert.ok(
    !isCorrect(puzzles[72], "110"),
    "Leading zero in a four-bit answer matters",
  );
});

test("progress is sequential; wrong and duplicate answers cannot unlock or inflate progress", () => {
  const state = freshState();
  assert.equal(submitAnswer(state, puzzles[0], "").status, "empty");
  assert.equal(state.attempts[0], undefined);
  assert.equal(submitAnswer(state, puzzles[0], "nope").status, "incorrect");
  assert.ok(!canVisit(state, 1));
  assert.equal(
    submitAnswer(state, puzzles[2], puzzles[2].answers[0]).status,
    "locked",
  );
  for (const puzzle of puzzles) {
    assert.ok(canVisit(state, puzzle.id));
    assert.equal(
      submitAnswer(state, puzzle, puzzle.answers[0]).status,
      "correct",
    );
    assert.equal(
      submitAnswer(state, puzzle, puzzle.answers[0]).status,
      "already-solved",
    );
  }
  assert.equal(Object.keys(state.solved).length, 100);
  assert.ok(!canVisit(state, 100));
  assert.ok(!canVisit(state, -1));
  assert.equal(state.attempts[0], 2);
});

test("broken storage recovers; noncontiguous progress and future deep links cannot bypass entries", () => {
  for (const json of ["{broken", "null", '{"version":99}']) {
    assert.equal(
      Object.keys(restoreState({ getItem: () => json }, 100).solved).length,
      0,
    );
  }
  assert.equal(
    Object.keys(
      restoreState(
        {
          getItem: () => {
            throw Error("blocked");
          },
        },
        100,
      ).solved,
    ).length,
    0,
  );
  const data = {
    version: 1,
    current: 99,
    solved: { 0: { at: 1 }, 2: { at: 2 } },
    hints: { 0: 45 },
    notes: { 0: "a note", 2: 55 },
    attempts: { 0: -1 },
  };
  const restored = restoreState(
    { getItem: (key) => (key === STORAGE_KEY ? JSON.stringify(data) : null) },
    100,
  );
  assert.equal(restored.current, 1);
  assert.deepEqual(restored.solved, { 0: { at: 1 } });
  assert.equal(restored.hints[0], 3);
  assert.equal(restored.notes[0], "a note");
  assert.equal(restored.notes[2], undefined);
  assert.equal(restored.attempts[0], undefined);
});

test("redoing a completed entry preserves earned progress and original statistics across reloads", () => {
  const state = freshState();
  submitAnswer(state, puzzles[0], "what");
  submitAnswer(state, puzzles[1], "star");
  state.hints[0] = 2;
  state.notes[0] = "A note to keep.";
  const solved = structuredClone(state.solved);
  const attempts = state.attempts[0];
  assert.equal(redoQuestion(state, 0), true);
  assert.equal(solvedCount(state), 2);
  assert.ok(canVisit(state, 2));
  assert.equal(submitAnswer(state, puzzles[0], "wrong").status, "incorrect");
  assert.equal(state.redos[0].attempts, 1);
  state.redos[0].hints = 1;
  const restored = restoreState({ getItem: () => JSON.stringify(state) }, 100);
  assert.deepEqual(restored.redos[0], { hints: 1, attempts: 1 });
  assert.equal(restored.hints[0], 2);
  assert.equal(restored.notes[0], "A note to keep.");
  assert.equal(submitAnswer(restored, puzzles[0], "WHAT").status, "correct");
  assert.equal(restored.redos[0], undefined);
  assert.equal(solvedCount(restored), 2);
  assert.deepEqual(restored.solved, solved);
  assert.equal(restored.attempts[0], attempts);
  assert.equal(
    submitAnswer(restored, puzzles[0], "what").status,
    "already-solved",
  );
  assert.equal(redoQuestion(restored, 3), false);
  assert.equal(redoQuestion(restored, -1), false);
});

test("redoing an unsolved question resets that attempt and preserves notes", () => {
  const state = freshState();
  state.hints[0] = 3;
  state.notes[0] = "Keep these thoughts.";
  submitAnswer(state, puzzles[0], "wrong");
  assert.equal(redoQuestion(state, 0), true);
  assert.equal(state.hints[0], 0);
  assert.equal(state.attempts[0], 0);
  assert.equal(state.notes[0], "Keep these thoughts.");
  assert.deepEqual(state.redos, {});
  assert.equal(solvedCount(state), 0);
  assert.equal(submitAnswer(state, puzzles[0], "what").status, "correct");
  assert.equal(solvedCount(state), 1);
});

test("restoring retries clamps malformed counts and ignores retries for unearned entries", () => {
  const state = freshState();
  state.solved[0] = { at: 1 };
  state.redos = {
    0: { hints: 100, attempts: 999999999 },
    1: { hints: 0, attempts: 0 },
    99: { hints: 0, attempts: 0 },
  };
  const restored = restoreState({ getItem: () => JSON.stringify(state) }, 100);
  assert.deepEqual(restored.redos, { 0: { hints: 3, attempts: 100000 } });
  assert.equal(solvedCount(restored), 1);
  assert.ok(!canVisit(restored, 99));
});

test("per-entry address clues appear only on their intended entry", () => {
  const base = "https://example.test/?entry=58&key=old#old";
  assert.equal(getAddress(puzzles[43], base).hash, "#second-thought");
  assert.equal(
    getAddress(puzzles[57], base).searchParams.get("key"),
    "thimble",
  );
  const plain = getAddress(puzzles[0], base);
  assert.equal(plain.hash, "");
  assert.equal(plain.searchParams.has("key"), false);
  assert.equal(plain.searchParams.get("entry"), "1");
});

test("decoder handles each encoding and diagnoses malformed input", () => {
  const samples = [
    ["b3Blbg==", "base64", "open"],
    ["01001011 01000101 01011001", "binary", "KEY"],
    ["4E 4F 54 45", "hex", "NOTE"],
    ["83 72 69 76 70", "ascii", "SHELF"],
    ["16 1 20 8", "alphabet", "PATH"],
    ["FRPERG", "rot13", "SECRET"],
    ["EPPS", "caesar1", "DOOR"],
    ["RCRGT", "caesar2", "PAPER"],
    ["%6d%61%72%67%69%6e", "url", "margin"],
    ["wodniw", "reverse", "window"],
  ];
  for (const [input, method, expected] of samples)
    assert.equal(decodeText(input, method), expected);
  for (const [input, method] of [
    ["?", "hex"],
    ["0110", "binary"],
    ["999", "ascii"],
    ["27", "alphabet"],
    ["%%", "url"],
    ["!invalid!", "base64"],
  ])
    assert.throws(() => decodeText(input, method));
  assert.equal(decodeText("", "hex"), "");
});

test("layered clue solutions agree with independent decoding and code execution", () => {
  const from64 = (text) => Buffer.from(text, "base64").toString();
  assert.equal(from64(puzzles[24].content), puzzles[24].answers[0]);
  assert.equal(
    from64(puzzles[83].content).split("").reverse().join(""),
    puzzles[83].answers[0],
  );
  assert.equal(
    decodeText(from64(puzzles[97].content), "rot13").toLowerCase(),
    puzzles[97].answers[0],
  );
  assert.equal(
    "YTCX"
      .split("")
      .map((c, i) =>
        String.fromCharCode(
          ((c.charCodeAt(0) - 65 - ("KEYK".charCodeAt(i) - 65) + 26) % 26) + 65,
        ),
      )
      .join("")
      .toLowerCase(),
    puzzles[74].answers[0],
  );
  const spiral = [0, 1, 2, 5, 8, 7, 6, 3, 4]
    .map((i) => puzzles[70].content.cells[i])
    .join("")
    .toLowerCase();
  assert.equal(spiral, puzzles[70].answers[0]);
  const polybius = ["13", "31", "45", "15"]
    .map(
      (pair) =>
        puzzles[37].content.cells[
          (Number(pair[0]) - 1) * 5 + Number(pair[1]) - 1
        ],
    )
    .join("")
    .toLowerCase();
  assert.equal(polybius, puzzles[37].answers[0]);
  for (const id of [60, 63, 66, 67, 68, 69, 77]) {
    const result = Function(`"use strict"; return (${puzzles[id].content});`)();
    assert.ok(
      isCorrect(puzzles[id], result),
      `Code clue ${id + 1} should produce its accepted answer`,
    );
  }
  const firstLetters = [67, 51, 98, 77, 85, 21]
    .map((n) => puzzles[n - 1].answers[0][0])
    .join("");
  assert.equal(firstLetters, puzzles[98].answers[0]);
  assert.equal(puzzles[99].answers[0], puzzles[0].answers[0]);
});
