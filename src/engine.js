export const STORAGE_KEY = "afterword-progress-v1";

export function normalizeAnswer(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function isCorrect(puzzle, value) {
  const normalized = normalizeAnswer(value);
  return (
    normalized.length > 0 &&
    puzzle.answers.some((answer) => normalizeAnswer(answer) === normalized)
  );
}

export function freshState() {
  return {
    version: 1,
    current: 0,
    solved: {},
    hints: {},
    attempts: {},
    notes: {},
    redos: {},
    startedAt: Date.now(),
  };
}

export function restoreState(storage, count) {
  const fallback = freshState();
  try {
    const data = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!data || data.version !== 1) return fallback;
    // Keep the saved format bounded. A broken or outdated save should never break the game.
    for (const key of ["hints", "attempts", "notes"]) {
      for (let i = 0; i < count; i++) {
        const value = data[key]?.[i];
        if (key === "notes" && typeof value === "string")
          fallback.notes[i] = value.slice(0, 5000);
        if (key !== "notes" && Number.isInteger(value) && value >= 0)
          fallback[key][i] = Math.min(value, key === "hints" ? 3 : 100000);
      }
    }
    for (let i = 0; i < count; i++) {
      if (!data.solved?.[i] || typeof data.solved[i] !== "object") break;
      fallback.solved[i] = { at: Number(data.solved[i].at) || 0 };
    }
    for (let i = 0; i < count; i++) {
      const redo = data.redos?.[i];
      if (fallback.solved[i] && redo && typeof redo === "object") {
        fallback.redos[i] = {
          hints:
            Number.isInteger(redo.hints) && redo.hints >= 0
              ? Math.min(redo.hints, 3)
              : 0,
          attempts:
            Number.isInteger(redo.attempts) && redo.attempts >= 0
              ? Math.min(redo.attempts, 100000)
              : 0,
        };
      }
    }
    fallback.current = Math.max(
      0,
      Math.min(
        Number.isInteger(data.current) ? data.current : 0,
        unlockedIndex(fallback, count),
      ),
    );
    if (Number.isFinite(data.startedAt) && data.startedAt > 0)
      fallback.startedAt = data.startedAt;
    return fallback;
  } catch {
    return fallback;
  }
}

export function solvedCount(state) {
  return Object.keys(state.solved).length;
}
export function unlockedIndex(state, count = 100) {
  return Math.min(solvedCount(state), count - 1);
}
export function canVisit(state, index, count = 100) {
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < count &&
    index <= unlockedIndex(state, count)
  );
}

export function submitAnswer(state, puzzle, value) {
  const redo = state.redos?.[puzzle.id];
  if (state.solved[puzzle.id] && !redo) return { status: "already-solved" };
  if (!String(value).trim()) return { status: "empty" };
  if (!canVisit(state, puzzle.id)) return { status: "locked" };
  if (redo) redo.attempts++;
  else state.attempts[puzzle.id] = (state.attempts[puzzle.id] || 0) + 1;
  if (!isCorrect(puzzle, value)) return { status: "incorrect" };
  if (redo) {
    delete state.redos[puzzle.id];
    return { status: "correct" };
  }
  state.solved[puzzle.id] = { at: Date.now() };
  return { status: "correct" };
}

export function redoQuestion(state, index, count = 100) {
  if (!canVisit(state, index, count)) return false;
  if (state.solved[index]) {
    state.redos ||= {};
    state.redos[index] = { hints: 0, attempts: 0 };
  } else {
    state.hints[index] = 0;
    state.attempts[index] = 0;
  }
  return true;
}

export function getAddress(puzzle, base) {
  const url = new URL(base);
  url.search = "";
  url.searchParams.set("entry", String(puzzle.id + 1));
  if (puzzle.queryClue) url.searchParams.set("key", puzzle.queryClue);
  url.hash = puzzle.hashClue || "";
  return url;
}
