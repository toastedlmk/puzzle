import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "./style.css";
import { puzzles, chapters } from "./puzzles.js";
import {
  STORAGE_KEY,
  restoreState,
  freshState,
  solvedCount,
  unlockedIndex,
  canVisit,
  submitAnswer,
  redoQuestion,
  getAddress,
} from "./engine.js";
import { decodeText } from "./decoder.js";
import { translationMethods } from "./translation-methods.js";
import { createChapterMenu } from "./chapter-menu.js";
import { PARTS } from "./game-config.js";
import { applyInspectionScene } from "./inspection-scenes.js";
import { capturePage, renderInspector } from "./inspector.js";

const icons = {
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  smallArrow: '<path d="M6 18 18 6M6 6h12v12"/>',
  book: '<path d="M12 6c-3-3-7-3-10-2v15c3-1 7-1 10 2m0-15c3-3 7-3 10-2v15c-3-1-7-1-10 2Zm0 0v15"/>',
  inspect:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m9 9-3 3 3 3m6-6 3 3-3 3"/>',
  lock: '<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  bulb: '<path d="M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 16.5v.1"/>',
  decoder:
    '<path d="M4 5h6M7 2v6m-4 4 8 8m0-8-8 8m12-2h6m-6-4h6M15 5h6m-3-3v6"/>',
  restart: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  pen: '<path d="m14 5 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14v6Z"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.arrow}</svg>`;
const rosette = `<svg class="rosette" viewBox="0 0 72 72" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="36" cy="36" r="27"/><circle cx="36" cy="36" r="20"/><path d="M36 2v68M2 36h68M12 12l48 48M12 60l48-48M23 5l26 62M5 23l62 26M5 49l62-26M23 67 49 5"/></g><circle cx="36" cy="36" r="6" fill="currentColor"/></svg>`;
const mark =
  '<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M16 1v30M1 16h30M5.4 5.4l21.2 21.2M5.4 26.6 26.6 5.4"/><circle cx="16" cy="16" r="4" fill="currentColor" stroke="none"/></svg>';
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const $ = (selector) => document.querySelector(selector);
const number = (n) => String(n).padStart(3, "0");
const embedded = globalThis.__AFTERWORD_EMBEDDED__;
let entryAddress;
let inspectionSnapshot;
let disposeInspector = () => {};
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw new Error("Storage unavailable");
    },
  };
}
let state = restoreState(storage, puzzles.length);
let persisted = true;
const requested = embedded
  ? -1
  : Number(new URL(location.href).searchParams.get("entry")) - 1;
if (canVisit(state, requested, puzzles.length)) state.current = requested;

$("#app").innerHTML = `
  <a class="skip-link" href="#puzzle-title">Skip to the riddle</a>
  <header class="site-header"><div class="header-inner">
    <a class="wordmark" href="${embedded ? "" : import.meta.env.BASE_URL}" aria-label="The Afterword home"><span class="brand-mark">${mark}</span> the afterword<span class="brand-period">.</span></a>
    <span class="header-caption">TWO CHAPTERS · 200 ENTRIES</span>
    <nav class="header-nav" aria-label="Main navigation"><button class="rules-link" data-action="help">The rules ${icon("smallArrow")}</button><button class="progress-button" data-action="index">${icon("book")}<span>Your index</span><span class="header-progress">0 / ${puzzles.length}</span></button></nav>
  </div></header>
  ${embedded ? '<div class="offline-address"><span>ENTRY ADDRESS</span><output id="entry-address" aria-label="Address clue for this entry"></output><span class="offline-edition">OFFLINE EDITION</span></div>' : ""}
  <main class="page-shell">
    <section class="intro" aria-labelledby="intro-title"><div><p class="eyebrow"><span class="little-star">${mark}</span> A SMALL EXERCISE IN CURIOSITY</p><h1 id="intro-title">Look a little <em>closer.</em></h1></div><div class="intro-aside"><p>Two hundred entries. A trail of hidden clues.<br>All you need is a different way of looking.</p><svg class="handdrawn-arrow" viewBox="0 0 70 65" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10C36-1 58 14 51 52M39 39l12 14 14-13"/><path d="M8 13C31 5 51 12 52 34" opacity=".35"/></svg></div></section>
    <div class="game-layout">
      <aside class="chapter-sidebar" aria-label="Chapters"><div class="sidebar-label">THE CONTENTS <span>001—200</span></div><nav id="part-list" aria-label="Story chapters"></nav><nav id="chapter-list" aria-label="Sections"></nav><div id="journey-progress"></div></aside>
      <section id="puzzle-card" class="puzzle-card" aria-label="Current riddle"></section>
      <aside class="field-sidebar" aria-label="Notes and tools">
        <section class="notebook"><div class="notebook-header"><h2>Field notes</h2>${icon("pen")}</div><p class="notebook-description">A thought worth keeping?</p><label class="sr-only" for="field-note">Your private notes for this entry</label><textarea id="field-note" maxlength="5000" placeholder="Follow a thought.\nLeave yourself a clue…" spellcheck="false"></textarea><div class="notebook-footer"><span class="note-entry">ENTRY 001</span><span id="note-status">Saved locally</span></div></section>
        <section class="pocket-tools"><h2 class="eyebrow">POCKET TOOLS</h2><button data-action="inspect">${icon("inspect")}<span>Inspect this page</span>${icon("smallArrow")}</button><button data-action="decoder">${icon("decoder")}<span>Decoder desk</span>${icon("smallArrow")}</button><button data-action="help">${icon("help")}<span>A little guidance</span>${icon("smallArrow")}</button></section>
        <div class="patience-note">${rosette}<p>Take your time.<br><em>Wonder a little.</em></p></div>
      </aside>
    </div>
    <footer class="site-footer"><span>A little less scrolling. A little more noticing.</span><span class="save-status"><i></i> YOUR PLACE IS KEPT ON THIS DEVICE</span><span>Made for the curious <span class="footer-star">${mark}</span></span></footer>
  </main>
  <dialog id="app-dialog" aria-labelledby="dialog-title"><div class="dialog-shell"><header class="dialog-header"><p class="eyebrow" id="dialog-eyebrow">A LITTLE GUIDANCE</p><button class="icon-button dialog-close" aria-label="Close dialog">${icon("close")}</button></header><div id="dialog-content"></div></div></dialog>
  <div id="toast" class="toast" role="status"></div>
`;

const chapterMenu = createChapterMenu({
  chapters,
  puzzles,
  getState: () => state,
  onVisit: visit,
  onIndex: openIndex,
  icon,
});

function save() {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    persisted = true;
  } catch {
    persisted = false;
  }
  const label = $(".save-status");
  label.classList.toggle("not-saved", !persisted);
  label.innerHTML = `<i></i> ${persisted ? "YOUR PLACE IS KEPT ON THIS DEVICE" : "STORAGE UNAVAILABLE · KEEP THIS TAB OPEN"}`;
  $("#note-status").textContent = persisted
    ? "Saved locally"
    : "In this tab only";
}

function renderNavigation() {
  chapterMenu.close();
  const completed = solvedCount(state);
  const part = PARTS[puzzles[state.current].part];
  const offset = part.start / 20;
  $(".header-progress").textContent = `${completed} / ${puzzles.length}`;
  $("#part-list").innerHTML = PARTS.map(
    (item, i) =>
      `<button type="button" class="part-button ${item === part ? "active" : ""}" data-part="${i}" ${!canVisit(state, item.start, puzzles.length) ? "disabled" : ""}><span>${item.name}</span><small>${number(item.start + 1)}—${number(item.start + item.count)}</small>${!canVisit(state, item.start, puzzles.length) ? icon("lock") : ""}</button>`,
  ).join("");
  $("#chapter-list").innerHTML = chapters
    .slice(offset, offset + 5)
    .map((chapter, local) => {
      const i = offset + local;
      const done = puzzles
        .slice(i * 20, (i + 1) * 20)
        .filter((p) => state.solved[p.id]).length;
      const active = Math.floor(state.current / 20) === i;
      const locked = !canVisit(state, i * 20, puzzles.length);
      return `<button class="chapter-button ${active ? "active" : ""} ${locked ? "locked" : ""}" data-chapter="${i}" title="Right-click for questions you can revisit" aria-label="Section ${chapter.numeral}: ${chapter.title}${locked ? ", locked" : ""}" ${active ? 'aria-current="step"' : ""}><span class="chapter-numeral">${chapter.numeral}.</span><span class="chapter-copy"><strong>${escapeHtml(chapter.title)}</strong><span>Entries ${number(i * 20 + 1)}—${number((i + 1) * 20)}</span></span>${locked ? icon("lock") : done === 20 ? icon("check") : '<span class="chapter-dot"></span>'}</button>`;
    })
    .join("");
  const percent = Math.round((completed / puzzles.length) * 100);
  $("#journey-progress").innerHTML =
    `<div class="journey-label"><span>YOUR JOURNEY</span><span>${percent}%</span></div><div class="journey-track" role="progressbar" aria-label="Entries solved" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${puzzles.length}"><span style="width:${percent}%"></span></div><p><strong>${completed}</strong> of ${puzzles.length} doors opened.</p><span class="journey-footnote">A little further, one entry at a time.</span>`;
}

function solvedMarkup(puzzle) {
  const part = PARTS[puzzle.part];
  const partDone = puzzle.id === part.start + part.count - 1;
  const final = partDone && puzzle.part === PARTS.length - 1;
  const hints = Object.entries(state.hints)
    .filter(
      ([id]) =>
        Number(id) >= part.start && Number(id) < part.start + part.count,
    )
    .reduce((total, [, count]) => total + count, 0);
  return `<section class="solved-panel ${partDone ? "final-panel" : ""}" ${partDone ? `data-part-complete="${puzzle.part + 1}"` : ""} aria-label="Entry solved"><div class="solved-heading"><span class="solved-check">${icon("check")}</span><div><span class="eyebrow">${partDone ? `${part.name.toUpperCase()} COMPLETE` : "THE DOOR IS OPEN"}</span><h3>${partDone ? (final ? "You saw beyond the surface." : "You followed the thread.") : puzzle.id % 20 === 19 ? "A section, complete." : "A little closer."}</h3></div>${partDone ? rosette : ""}</div><p>${escapeHtml(puzzle.explanation)}</p><div class="solution-word">THE ANSWER <strong>${escapeHtml(puzzle.answers[0])}</strong></div>${partDone ? `<p class="final-note">${part.count} discoveries in ${part.name}. ${hints} hints along the way.${final ? " All two hundred doors are open." : ""}</p><button class="primary-button" data-action="index">Revisit the journey ${icon("book")}</button><button class="text-button share-button" data-action="share">Copy your result ${icon("smallArrow")}</button>${!final ? `<button type="button" class="primary-button chapter-two-button" id="begin-chapter-two">Chapter 2 · Behind the page ${icon("arrow")}</button>` : ""}` : `<button class="primary-button next-button" id="next-entry">${puzzle.id % 20 === 19 ? "Begin the next section" : "The next entry"} ${icon("arrow")}</button>`}</section>`;
}

function renderArt(puzzle) {
  const content = puzzle.content;
  switch (puzzle.type) {
    case "quote":
      return `<div class="riddle-quote">${escapeHtml(content)}</div>`;
    case "code":
      return `<pre class="riddle-code"><code>${escapeHtml(content)}</code></pre>`;
    case "lines":
      return `<div class="riddle-lines">${content.map((line, i) => `<p><span class="line-number" aria-hidden="true">${i + 1}</span>${escapeHtml(line)}</p>`).join("")}</div>`;
    case "sequence":
      return `<div class="riddle-sequence">${content.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
    case "grid":
    case "polybius":
      return `${puzzle.type === "polybius" ? '<span class="grid-legend">ROWS ↓ &nbsp; COLUMNS → &nbsp; COUNT FROM 1</span>' : ""}<div class="letter-grid" style="--columns:${content.columns}">${content.cells.map((cell, i) => `<span title="Row ${Math.floor(i / content.columns) + 1}, column ${(i % content.columns) + 1}">${escapeHtml(cell)}</span>`).join("")}</div>${content.caption ? `<div class="grid-caption">${escapeHtml(content.caption)}</div>` : ""}`;
    case "html":
      return embedded
        ? content.replace(
            'src="/clues/paper-crane.svg"',
            `src="${embedded.crane}" data-filename="paper-crane.svg"`,
          )
        : content.replace(
            "/clues/paper-crane.svg",
            `${import.meta.env.BASE_URL}clues/paper-crane.svg`,
          );
    default:
      return "";
  }
}

function renderPuzzle(focus = false) {
  const puzzle = puzzles[state.current];
  const chapter = chapters[puzzle.chapter];
  const redoing = !!state.redos[puzzle.id];
  const solved = !!state.solved[puzzle.id] && !redoing;
  const part = PARTS[puzzle.part];
  const partDone = puzzle.id === part.start + part.count - 1;
  document.title = `${puzzle.tabClue ? `${puzzle.tabClue} | ` : ""}The Afterword — Entry ${number(puzzle.id + 1)}`;
  // Standalone files cannot reliably rewrite file:// query strings. An explicit
  // entry address preserves URL-based clues without navigation or a server.
  entryAddress = getAddress(
    puzzle,
    embedded ? "file:///the-afterword.html" : location.href,
  );
  if (embedded) {
    $("#entry-address").textContent =
      `the-afterword.html${entryAddress.search}${entryAddress.hash}`;
  } else {
    history.replaceState(null, "", entryAddress);
  }
  const prompt = embedded
    ? puzzle.prompt.replace("your address bar", "the entry address shown above")
    : puzzle.prompt;
  $("#puzzle-card").innerHTML = `
    <div class="card-topline"><span class="entry-label"><span class="status-dot ${solved ? "solved" : ""}"></span> ENTRY ${number(puzzle.id + 1)}${redoing ? '<span class="redo-badge">REDO</span>' : ""}</span><span class="category-label">${escapeHtml(chapter.category)} <span>↗</span></span></div>
    <div class="card-body"><div class="entry-overline">${PARTS[puzzle.part].name.toUpperCase()} <span>·</span> SECTION ${chapter.numeral} <span>·</span> <button class="chapter-quick-menu" type="button" data-chapter-menu="${puzzle.chapter}" aria-haspopup="menu" aria-expanded="false" aria-label="Questions in ${escapeHtml(chapter.title)}">${escapeHtml(chapter.title)} ${icon("chevron")}</button></div><h2 id="puzzle-title" tabindex="-1">${escapeHtml(puzzle.title)}<span class="title-period">.</span></h2><p class="puzzle-prompt">${escapeHtml(prompt)}</p>
    <div class="clue-toolbar"><button id="redo-question" class="copy-button" type="button" title="Start a fresh attempt. Your overall progress and field notes are kept.">${icon("restart")} Redo question</button><button id="copy-clue" class="copy-button" type="button" data-copy-label="Copy text">${icon("copy")} <span class="copy-label" aria-live="polite">Copy text</span></button></div>
    <div id="clue-panel" class="clue-panel clue-${puzzle.type}">${renderArt(puzzle)}</div>
    ${
      solved
        ? solvedMarkup(puzzle)
        : `
      <form id="answer-form" novalidate><div class="answer-label-row"><label class="eyebrow" for="answer">YOUR ANSWER</label><span class="input-caption">a little thought goes a long way</span></div><div class="answer-control"><input id="answer" name="answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="200" placeholder="What do you think?" aria-describedby="answer-feedback"><button type="submit" class="submit-button">Enter ${icon("arrow")}</button></div><p id="answer-feedback" class="answer-feedback" role="status" aria-live="polite"></p></form>
      <div class="hint-container"><div class="hint-controls"><button id="hint-button" class="text-button">${icon("bulb")}<span>A gentle nudge</span></button><span class="hint-counter"></span></div><div id="hint-list" aria-live="polite"></div></div>
    `
    }</div>
    <div class="card-footer"><span><span class="tiny-star">${mark}</span> ${solved ? "CURIOSITY LOOKS GOOD ON YOU" : "THE PAGE IS PART OF THE PUZZLE"}</span><button class="small-link" data-action="inspect">Look around ${icon("smallArrow")}</button></div>`;
  const note = $("#field-note");
  note.value = state.notes[puzzle.id] || "";
  note.setAttribute(
    "aria-label",
    `Your private notes for entry ${number(puzzle.id + 1)}`,
  );
  $(".note-entry").textContent = `ENTRY ${number(puzzle.id + 1)}`;
  renderNavigation();
  $("#redo-question").addEventListener("click", () => {
    if (!redoQuestion(state, puzzle.id, puzzles.length)) return;
    save();
    renderPuzzle();
    $("#answer").focus();
    showToast("Fresh attempt started. Your progress and notes are kept.");
  });
  $("#copy-clue").addEventListener("click", () => {
    const text = getClueText(puzzle);
    if (text) copyText(text, "Text copied.", $("#copy-clue"));
    else
      showToast(
        "This puzzle uses an image. Open the inspector for its details.",
      );
  });
  if (!solved) {
    renderHints();
    $("#answer-form").addEventListener("submit", onAnswer);
    $("#answer").addEventListener("input", () => {
      $("#answer").removeAttribute("aria-invalid");
      $(".answer-control").classList.remove("has-error");
      $("#answer-feedback").textContent = "";
    });
    $("#hint-button").addEventListener("click", () => {
      const redo = state.redos[puzzle.id];
      if (redo) redo.hints = Math.min(3, redo.hints + 1);
      else
        state.hints[puzzle.id] = Math.min(3, (state.hints[puzzle.id] || 0) + 1);
      save();
      renderHints();
    });
  } else if (partDone) {
    $("#begin-chapter-two")?.addEventListener("click", () =>
      visit(PARTS[1].start),
    );
  } else {
    $("#next-entry").addEventListener("click", () => visit(puzzle.id + 1));
  }
  $(".lift-paper")?.addEventListener("click", (event) => {
    $(".concealed-word").classList.toggle("uncovered");
    event.currentTarget.textContent = $(".concealed-word").classList.contains(
      "uncovered",
    )
      ? "Replace the paper ↘"
      : "Lift the paper ↗";
  });
  $(".clue-mark")?.addEventListener("click", (event) => {
    let tooltip = $("#mark-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("p");
      tooltip.id = "mark-tooltip";
      tooltip.className = "mark-tooltip";
      event.currentTarget.after(tooltip);
    }
    tooltip.textContent = event.currentTarget.title;
  });
  applyInspectionScene(puzzle);
  if (focus) $("#puzzle-title").focus({ preventScroll: true });
}

function renderHints() {
  const puzzle = puzzles[state.current];
  const count = state.redos[puzzle.id]?.hints ?? state.hints[puzzle.id] ?? 0;
  $("#hint-list").innerHTML = puzzle.hints
    .slice(0, count)
    .map(
      (hint, i) =>
        `<p class="hint-note"><span>${i === 2 ? "THE ANSWER" : `NUDGE ${i + 1}`}</span>${escapeHtml(hint)}</p>`,
    )
    .join("");
  $(".hint-counter").textContent = `${count} OF 3`;
  $("#hint-button span").textContent =
    count === 0
      ? "A gentle nudge"
      : count === 1
        ? "A little more help"
        : count === 2
          ? "Reveal the answer"
          : "No more secrets";
  $("#hint-button").disabled = count === 3;
}

function onAnswer(event) {
  event.preventDefault();
  const answer = $("#answer");
  const result = submitAnswer(state, puzzles[state.current], answer.value);
  if (result.status === "empty") {
    $("#answer-feedback").textContent =
      "Every door needs a word. Try an answer first.";
    answer.focus();
    return;
  }
  save();
  if (result.status === "correct") {
    renderPuzzle(true);
    return;
  }
  if (result.status === "incorrect") {
    $("#answer-feedback").textContent =
      "Not quite. Take another look — the door is still waiting.";
    answer.setAttribute("aria-invalid", "true");
    $(".answer-control").classList.add("has-error");
    answer.focus();
    answer.select();
  }
}

function visit(index) {
  if (!canVisit(state, index, puzzles.length)) {
    showToast("One door at a time. Solve your current entry to go further.");
    return;
  }
  chapterMenu.close();
  state.current = index;
  save();
  if ($("#app-dialog").open) $("#app-dialog").close();
  renderPuzzle(true);
  if (window.innerWidth < 1050)
    $("#puzzle-card").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("visible"), 4500);
}

function getClueText(puzzle) {
  if (Array.isArray(puzzle.content))
    return puzzle.content.join(puzzle.type === "lines" ? "\n" : " ");
  if (puzzle.type === "polybius") return puzzle.content.caption;
  if (puzzle.type === "grid") {
    const { cells, columns } = puzzle.content;
    return Array.from({ length: Math.ceil(cells.length / columns) }, (_, row) =>
      cells.slice(row * columns, (row + 1) * columns).join(" "),
    ).join("\n");
  }
  if (puzzle.type !== "html") return String(puzzle.content);
  // Only rendered text belongs on the clipboard. Do not reveal hidden elements,
  // HTML comments, image descriptions, or tooltips while copying a visible clue.
  const walker = document.createTreeWalker(
    $("#clue-panel"),
    NodeFilter.SHOW_TEXT,
  );
  const parts = [];
  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement;
    if (
      !parent.closest("button, svg, summary, [hidden]") &&
      parent.getClientRects().length &&
      getComputedStyle(parent).visibility !== "hidden"
    ) {
      parts.push(walker.currentNode.textContent.trim());
    }
  }
  return parts.filter(Boolean).join(" ");
}

async function copyText(text, message, button) {
  function confirmCopy() {
    showToast(message);
    const label = button?.querySelector(".copy-label");
    if (label) {
      label.textContent = "Copied!";
      clearTimeout(button.copyFeedbackTimer);
      button.copyFeedbackTimer = setTimeout(() => {
        if (button.isConnected) label.textContent = button.dataset.copyLabel;
      }, 1800);
    }
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      confirmCopy();
      return;
    }
  } catch {
    /* Try the browser's selection-based copy below. */
  }
  const focused = document.activeElement;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("aria-label", "Text to copy");
  area.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
  ($("#app-dialog").open ? $(".dialog-shell") : document.body).append(area);
  area.focus();
  area.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    /* Offer manual selection. */
  }
  area.remove();
  if (focused?.isConnected) focused.focus({ preventScroll: true });
  if (copied) {
    confirmCopy();
    return;
  }
  dialog(
    'Copy this text<span class="title-period">.</span>',
    "READY TO TAKE WITH YOU",
    '<p class="dialog-lede">Your browser could not copy automatically. The text is selected below: use Copy from its context menu, or press Ctrl+C (⌘C on Mac).</p><textarea id="copy-text" rows="5" readonly aria-label="Selected text to copy"></textarea>',
  );
  $("#copy-text").value = text;
  $("#copy-text").focus();
  $("#copy-text").select();
}

function dialog(title, eyebrow, body, wide = false) {
  chapterMenu.close();
  disposeInspector();
  disposeInspector = () => {};
  $("#app-dialog").classList.remove("inspector-dialog");
  $("#dialog-eyebrow").textContent = eyebrow;
  $("#dialog-content").innerHTML = `<h2 id="dialog-title">${title}</h2>${body}`;
  $("#app-dialog").classList.toggle("wide-dialog", wide);
  if (!$("#app-dialog").open) $("#app-dialog").showModal();
}

function openIndex(chapter = Math.floor(state.current / 20)) {
  const partIndex = Math.floor(chapter / 5);
  const offset = partIndex * 5;
  dialog(
    'Your index<span class="title-period">.</span>',
    `${solvedCount(state)} OF ${puzzles.length} DOORS OPENED`,
    `
    <p class="dialog-lede">Every answer leaves a little mark. Revisit any open entry.</p>
    <div class="index-part-picker">${PARTS.map((part, i) => `<button type="button" data-index-part="${i}" aria-pressed="${i === partIndex}" ${!canVisit(state, part.start, puzzles.length) ? "disabled" : ""}>${part.name}<span>${number(part.start + 1)}—${number(part.start + part.count)}</span></button>`).join("")}</div>
    <div class="index-tabs" role="tablist" aria-label="Sections">${chapters
      .slice(offset, offset + 5)
      .map((c, local) => {
        const i = offset + local;
        return `<button role="tab" tabindex="${i === chapter ? 0 : -1}" aria-selected="${i === chapter}" id="chapter-tab-${i}" aria-controls="index-panel" data-index-chapter="${i}" class="${i === chapter ? "selected" : ""}">${c.numeral}<span>${c.title}</span></button>`;
      })
      .join("")}</div>
    <div id="index-panel" role="tabpanel" aria-labelledby="chapter-tab-${chapter}" class="index-list">${puzzles
      .slice(chapter * 20, (chapter + 1) * 20)
      .map((p) => {
        const solved = !!state.solved[p.id];
        const open = canVisit(state, p.id);
        return `<button class="index-entry ${solved ? "complete" : ""} ${p.id === state.current ? "current" : ""}" data-visit="${p.id}" ${!open ? "disabled" : ""}><span class="index-number">${number(p.id + 1)}</span><span class="index-title">${escapeHtml(p.title)}</span><span class="index-answer">${solved ? escapeHtml(p.answers[0]) : open ? "your next door" : "not yet"}</span>${icon(solved ? "check" : open ? "arrow" : "lock")}</button>`;
      })
      .join("")}</div>
    <div class="index-bottom"><p>Your progress and notes stay in this browser.</p><button class="text-button reset-link" data-action="reset">${icon("restart")} Start over</button></div>
  `,
    true,
  );
}

function openHelp() {
  dialog(
    'A different way of looking<span class="title-period">.</span>',
    "A NOTE BEFORE YOU BEGIN",
    `
    <p class="dialog-lede">No hurry. No timer. Just you, a page, and what you notice.</p>
    <ol class="rules-list"><li><span>01</span><div><h3>Read closely.</h3><p>Every entry has a word, phrase, or number for an answer. Wording, patterns, and tiny details all matter. Capitalization, spaces, and punctuation in your answers do not.</p></div></li><li><span>02</span><div><h3>Look around the page.</h3><p>Later clues live in image descriptions, HTML comments, styles, or the address bar. “Inspect this page” puts those details within reach, on desktop and mobile.</p></div></li><li><span>03</span><div><h3>Bring a little help.</h3><p>The decoder desk translates common encodings. Field notes keep your thoughts for each entry. A gentle nudge offers up to three hints; the last one reveals the answer.</p></div></li><li><span>04</span><div><h3>Follow your thread.</h3><p>Solve an entry to open the next. Your index remembers every solved answer. Progress saves in this browser, so return whenever curiosity calls.</p></div></li></ol>
    <div class="help-footnote">An original collection inspired by the tradition of browser riddles. No accounts. No downloads. Two hundred little discoveries.</div><button class="primary-button" data-action="close">Back to the riddle ${icon("arrow")}</button>
  `,
  );
}

function openInspector(tab = "source") {
  const continuing =
    $("#app-dialog").open &&
    $("#app-dialog").classList.contains("inspector-dialog");
  if (!continuing)
    inspectionSnapshot = capturePage(puzzles[state.current], entryAddress.href);
  const tabs = [
    ["source", "Page source"],
    ["details", "Page details"],
    ["elements", "Elements"],
    ["layout", "Layout"],
  ];
  dialog(
    'Behind the page<span class="title-period">.</span>',
    `FULL PAGE INSPECTOR · ENTRY ${number(state.current + 1)}`,
    `<p class="dialog-lede">Explore the full document, from its head to the edges of its layout.</p><div class="inspector-tabs" role="tablist" aria-label="Inspector view">${tabs.map(([id, label]) => `<button id="${id}-tab" role="tab" tabindex="${tab === id ? 0 : -1}" aria-controls="inspector-panel" aria-selected="${tab === id}" data-inspector-tab="${id}" class="${tab === id ? "selected" : ""}">${label}</button>`).join("")}</div><div id="inspector-panel" role="tabpanel" aria-labelledby="${tab}-tab"></div><p class="inspector-footnote">Full page structure and styles. Private field-note text, application JavaScript, and binary font data are omitted from code views. The layout preview is read-only.</p>`,
    true,
  );
  $("#app-dialog").classList.add("inspector-dialog");
  disposeInspector = renderInspector({
    panel: $("#inspector-panel"),
    snapshot: inspectionSnapshot,
    tab,
    onCopy: (text) => copyText(text, "Inspection text copied."),
    onTab: openInspector,
  });
}

function openDecoder() {
  function methodOptions(methods, selected) {
    const groups = [...new Set(methods.map((method) => method.group))];
    return groups
      .map(
        (group) =>
          `<optgroup label="${escapeHtml(group)}">${methods
            .filter((method) => method.group === group)
            .map(
              (method) =>
                `<option value="${method.id}" ${method.id === selected ? "selected" : ""}>${escapeHtml(method.label)}</option>`,
            )
            .join("")}</optgroup>`,
      )
      .join("");
  }
  dialog(
    'The decoder desk<span class="title-period">.</span>',
    "A LITTLE HELP WITH TRANSLATION",
    `
    <p class="dialog-lede">Change the language. Keep the curiosity. This desk translates text; it never runs code.</p>
    <form id="decoder-form" novalidate>
      <div class="translator-search-label"><label for="translator-search" class="eyebrow form-label">FIND A TRANSLATOR</label><span id="translator-count" role="status" aria-live="polite">32 translators</span></div>
      <input id="translator-search" type="search" maxlength="100" autocomplete="off" spellcheck="false" placeholder="Search Morse, rotation, Base64…" aria-controls="decode-method" aria-describedby="translator-count">
      <label for="decode-method" class="eyebrow form-label">TRANSLATION</label>
      <select id="decode-method" aria-describedby="decode-method-help">${methodOptions(translationMethods, "base64")}</select>
      <p id="decode-method-help" class="decoder-method-help"></p>
      <div id="rotation-controls" class="decoder-settings" hidden>
        <label for="decode-shift">Places (0–26)<input id="decode-shift" type="number" min="0" max="26" step="1" value="13" inputmode="numeric"></label>
        <label for="decode-direction">Direction<select id="decode-direction"><option value="backward">Backward</option><option value="forward">Forward</option></select></label>
      </div>
      <div id="key-controls" class="decoder-settings" hidden><label for="decode-key">Vigenère key<input id="decode-key" type="text" maxlength="100" autocomplete="off" spellcheck="false" placeholder="For example: KEY"></label></div>
      <label class="eyebrow form-label" for="decode-input">TEXT TO TRANSLATE</label>
      <textarea id="decode-input" rows="4" maxlength="5000" placeholder="Paste or type a small mystery…" spellcheck="false"></textarea>
      <button class="primary-button" type="submit">Translate ${icon("arrow")}</button>
      <div class="decoder-result" aria-live="polite"><div class="decoder-result-heading"><span class="eyebrow">THE OTHER SIDE</span><button id="copy-translation" class="copy-button" type="button" data-copy-label="Copy result" disabled>${icon("copy")} <span class="copy-label" aria-live="polite">Copy result</span></button></div><output id="decode-output">Your translation will appear here.</output><div class="decoder-result-actions"><button id="use-translation" class="secondary-button decoder-use-answer" type="button" aria-describedby="decode-use-hint" disabled>Use as answer ${icon("arrow")}</button><span id="decode-use-hint">Translate some text to use it as your answer.</span></div></div>
    </form>
  `,
  );
  let translatedText = "";
  const useButton = $("#use-translation");
  const useHint = $("#decode-use-hint");
  const copyButton = $("#copy-translation");
  let activeMethodId;
  let lastSelectedId = "base64";
  function updateMethod() {
    const method = translationMethods.find(
      (method) => method.id === $("#decode-method").value,
    );
    if (activeMethodId !== method?.id) {
      translatedText = "";
      $("#decode-output").textContent = "Your translation will appear here.";
      $("#decode-output").classList.remove("decode-error");
      copyButton.disabled = true;
      clearTimeout(copyButton.copyFeedbackTimer);
      copyButton.querySelector(".copy-label").textContent =
        copyButton.dataset.copyLabel;
      updateUseButton();
      activeMethodId = method?.id;
    }
    if (method) lastSelectedId = method.id;
    $("#decode-method-help").textContent =
      method?.help || "No matches. Try another name or clear the search.";
    $("#decode-input").placeholder =
      method?.placeholder || "Paste or type text to translate…";
    $("#rotation-controls").hidden = method?.controls !== "rotation";
    $("#key-controls").hidden = method?.controls !== "key";
    $("#decoder-form > button[type=submit]").disabled = !method;
  }
  const searchText = (value) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  $("#translator-search").addEventListener("input", (event) => {
    const terms = searchText(event.target.value)
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const matches = translationMethods.filter((method) => {
      const text = searchText(`${method.label} ${method.id} ${method.group}`);
      return terms.every((term) => text.includes(term));
    });
    const previous = $("#decode-method").value || lastSelectedId;
    const selected = matches.some((method) => method.id === previous)
      ? previous
      : matches[0]?.id;
    $("#decode-method").innerHTML = matches.length
      ? methodOptions(matches, selected)
      : '<option value="">No translators found</option>';
    $("#decode-method").disabled = !matches.length;
    $("#translator-count").textContent =
      `${matches.length} ${matches.length === 1 ? "translator" : "translators"}`;
    updateMethod();
  });
  $("#translator-search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!$("#decode-method").disabled) $("#decode-method").focus();
    }
  });
  $("#decode-method").addEventListener("change", updateMethod);
  updateMethod();
  copyButton.addEventListener("click", () =>
    copyText(translatedText, "Translation copied.", copyButton),
  );
  function updateUseButton() {
    const answer = $("#answer");
    useButton.disabled = true;
    if (!translatedText.trim()) {
      useHint.textContent = "Translate some text to use it as your answer.";
    } else if (!answer) {
      useHint.textContent = "Open an unsolved entry to use this as an answer.";
    } else if (translatedText.length > answer.maxLength) {
      useHint.textContent = `The answer box accepts up to ${answer.maxLength} characters.`;
    } else {
      useButton.disabled = false;
      useHint.textContent = "Fills your answer box. Submit when you are ready.";
    }
  }
  useButton.addEventListener("click", () => {
    updateUseButton();
    if (useButton.disabled) return;
    const answer = $("#answer");
    answer.value = translatedText;
    answer.dispatchEvent(new Event("input", { bubbles: true }));
    $("#app-dialog").close();
    answer.focus();
    answer.setSelectionRange(answer.value.length, answer.value.length);
  });
  $("#decoder-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!$("#decode-method").value) return;
    translatedText = "";
    copyButton.disabled = true;
    try {
      const result = decodeText(
        $("#decode-input").value,
        $("#decode-method").value,
        {
          shift:
            $("#decode-shift").value === ""
              ? NaN
              : Number($("#decode-shift").value),
          direction: $("#decode-direction").value,
          key: $("#decode-key").value,
        },
      );
      $("#decode-output").textContent =
        result || "Add some text to translate first.";
      $("#decode-output").classList.remove("decode-error");
      translatedText = result;
      copyButton.disabled = !result.trim();
    } catch (error) {
      $("#decode-output").textContent =
        error.message === "The string to be decoded is not correctly encoded."
          ? "That does not look like valid Base64. Check the letters and padding."
          : error.message;
      $("#decode-output").classList.add("decode-error");
    }
    updateUseButton();
  });
}

function openReset() {
  dialog(
    'A fresh piece of paper<span class="title-period">.</span>',
    "START AGAIN?",
    `<p class="dialog-lede">This clears all ${puzzles.length} entries, hints, and field notes from this browser. Your current journey cannot be recovered.</p><div class="reset-actions"><button class="primary-button danger-button" id="confirm-reset">Clear my journey</button><button class="secondary-button" data-action="index">Keep my place</button></div>`,
  );
  $("#confirm-reset").addEventListener("click", () => {
    state = freshState();
    save();
    $("#app-dialog").close();
    renderPuzzle(true);
    showToast("A fresh beginning. Your journey has been reset.");
  });
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "help") openHelp();
  if (action === "index") openIndex();
  if (action === "inspect") openInspector();
  if (action === "decoder") openDecoder();
  if (action === "reset") openReset();
  if (action === "close") $("#app-dialog").close();
  if (action === "share") {
    const part = PARTS[puzzles[state.current].part];
    const message = `I finished ${part.name} (${part.count} entries) of The Afterword — ${solvedCount(state)} of ${puzzles.length} doors opened.`;
    if (navigator.clipboard?.writeText)
      navigator.clipboard
        .writeText(message)
        .then(() =>
          showToast("Your result is copied. Pass a little curiosity along."),
        )
        .catch(() => showShareText(message));
    else showShareText(message);
  }
  const chapter = event.target.closest("[data-chapter]");
  if (chapter) openIndex(Number(chapter.dataset.chapter));
  const partButton = event.target.closest("[data-part]");
  if (partButton && !partButton.disabled) {
    const part = PARTS[Number(partButton.dataset.part)];
    if (canVisit(state, part.start, puzzles.length))
      visit(
        Math.min(
          unlockedIndex(state, puzzles.length),
          part.start + part.count - 1,
        ),
      );
  }
  const indexPart = event.target.closest("[data-index-part]");
  if (indexPart && !indexPart.disabled)
    openIndex(Number(indexPart.dataset.indexPart) * 5);
  const indexChapter = event.target.closest("[data-index-chapter]");
  if (indexChapter) {
    openIndex(Number(indexChapter.dataset.indexChapter));
    $(`#chapter-tab-${indexChapter.dataset.indexChapter}`).focus();
  }
  const entry = event.target.closest("[data-visit]");
  if (entry && !entry.disabled) visit(Number(entry.dataset.visit));
  const tab = event.target.closest("[data-inspector-tab]");
  if (tab) {
    openInspector(tab.dataset.inspectorTab);
    $(`#${tab.dataset.inspectorTab}-tab`).focus();
  }
});

function showShareText(message) {
  dialog(
    'Pass it along<span class="title-period">.</span>',
    "YOUR FINISHED JOURNEY",
    '<p class="dialog-lede">Copy the text below to share your result.</p><textarea id="share-text" rows="4" readonly aria-label="Your result to copy"></textarea>',
  );
  $("#share-text").value = message;
  $("#share-text").select();
}

$("#field-note").addEventListener("input", (event) => {
  state.notes[state.current] = event.target.value;
  save();
});
$(".wordmark").addEventListener("click", (event) => {
  event.preventDefault();
  visit(unlockedIndex(state));
});
$(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  $("#puzzle-title").focus();
  $("#puzzle-title").scrollIntoView({ block: "start" });
});
$("#app-dialog").addEventListener("close", () => {
  disposeInspector();
  disposeInspector = () => {};
});
$(".dialog-close").addEventListener("click", () => $("#app-dialog").close());
$("#app-dialog").addEventListener("click", (event) => {
  if (event.target === $("#app-dialog")) $("#app-dialog").close();
});
document.addEventListener("keydown", (event) => {
  if (
    event.target.matches('[role="tab"]') &&
    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
  ) {
    event.preventDefault();
    const tabs = [
      ...event.target
        .closest('[role="tablist"]')
        .querySelectorAll('[role="tab"]'),
    ];
    const current = tabs.indexOf(event.target);
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
            tabs.length;
    tabs[target].click();
  }
  if (
    event.key === "?" &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) &&
    !$("#app-dialog").open
  ) {
    event.preventDefault();
    openHelp();
  }
});
window.addEventListener("popstate", () => {
  const index = Number(new URL(location.href).searchParams.get("entry")) - 1;
  if (canVisit(state, index)) {
    state.current = index;
    renderPuzzle(true);
  }
});
// Keep progress coherent if another tab finishes an entry or resets the journey.
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    state = restoreState(storage, puzzles.length);
    renderPuzzle();
    showToast("Your journey was updated in another tab.");
  }
});
renderPuzzle();
save();
