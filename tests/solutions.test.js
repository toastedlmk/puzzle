import test from "node:test";
import assert from "node:assert/strict";
import { puzzles } from "../src/puzzles.js";
import { normalizeAnswer } from "../src/engine.js";
import { getSolutionSteps, solutionSteps } from "../src/solution-steps.js";

test("every entry has its own complete walkthrough ending in an accepted answer", () => {
  assert.deepEqual(
    Object.keys(solutionSteps).map(Number),
    puzzles.map((puzzle) => puzzle.id + 1),
  );
  const distinct = new Set();
  for (const puzzle of puzzles) {
    const steps = getSolutionSteps(puzzle);
    assert.ok(steps.length >= 3, `Entry ${puzzle.id + 1} needs a derivation`);
    for (const step of steps) {
      assert.equal(typeof step, "string");
      assert.ok(step.trim(), `Entry ${puzzle.id + 1} has an empty step`);
    }
    assert.ok(
      puzzle.answers.some((answer) =>
        normalizeAnswer(steps.at(-1)).includes(normalizeAnswer(answer)),
      ),
      `Entry ${puzzle.id + 1} must reach its accepted answer`,
    );
    assert.notDeepEqual(
      steps,
      puzzle.hints,
      "A walkthrough must explain the solution beyond its hints",
    );
    distinct.add(JSON.stringify(steps));
  }
  assert.equal(distinct.size, puzzles.length);
});
