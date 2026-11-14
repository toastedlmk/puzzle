import { canVisit } from "./engine.js";

// Chapter shortcuts share the normal navigation path, so locked questions stay
// locked and revisiting an entry keeps its saved notes and completion record.
export function createChapterMenu({
  chapters,
  puzzles,
  getState,
  onVisit,
  onIndex,
  icon,
}) {
  const menu = document.createElement("div");
  menu.id = "chapter-menu";
  menu.className = "chapter-menu";
  menu.hidden = true;
  menu.setAttribute("popover", "manual");
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-labelledby", "chapter-menu-title");
  menu.tabIndex = -1;
  document.body.append(menu);
  let anchor = null;
  let selectedChapter = 0;
  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  function close(restoreFocus = false) {
    const previous = anchor;
    anchor = null;
    if (typeof menu.hidePopover === "function" && menu.matches(":popover-open"))
      menu.hidePopover();
    menu.hidden = true;
    previous?.setAttribute("aria-expanded", "false");
    if (restoreFocus && previous?.isConnected)
      previous.focus({ preventScroll: true });
  }

  function focusItem(item) {
    menu.querySelectorAll('[role="menuitem"]').forEach((button) => {
      button.tabIndex = button === item ? 0 : -1;
    });
    item.focus({ preventScroll: true });
    const list = menu.querySelector(".chapter-menu-list");
    if (list.contains(item)) {
      const top = item.offsetTop;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (top + item.offsetHeight > list.scrollTop + list.clientHeight)
        list.scrollTop = top + item.offsetHeight - list.clientHeight;
    }
  }

  function open(chapterIndex, source, point) {
    const chapter = chapters[chapterIndex];
    if (!chapter || !source) return;
    close();
    anchor = source;
    selectedChapter = chapterIndex;
    const state = getState();
    const available = puzzles
      .slice(chapterIndex * 20, (chapterIndex + 1) * 20)
      .filter((puzzle) => canVisit(state, puzzle.id, puzzles.length));
    menu.innerHTML = `
      <div class="chapter-menu-heading"><span>CHAPTER ${escape(chapter.numeral)}</span><h3 id="chapter-menu-title">${escape(chapter.title)}</h3><p>${available.length} ${available.length === 1 ? "question" : "questions"} available</p></div>
      <div class="chapter-menu-list">${available.length ? available.map((puzzle) => `<button type="button" role="menuitem" tabindex="-1" class="chapter-menu-item" data-menu-visit="${puzzle.id}" ${puzzle.id === state.current ? 'aria-current="page"' : ""}><span class="chapter-menu-number">${String(puzzle.id + 1).padStart(3, "0")}</span><span class="chapter-menu-question">${escape(puzzle.title)}</span>${icon(state.solved[puzzle.id] ? "check" : "arrow")}</button>`).join("") : '<p class="chapter-menu-empty">No questions unlocked in this chapter yet.</p>'}</div>
      <div class="chapter-menu-footer"><button type="button" role="menuitem" tabindex="-1" data-menu-index>Open full chapter index ${icon("arrow")}</button></div>
    `;
    // A popover inside a modal must belong to that dialog to remain interactive.
    const dialog = document.querySelector("#app-dialog");
    (dialog.open
      ? dialog.querySelector(".dialog-shell")
      : document.body
    ).append(menu);
    menu.hidden = false;
    menu.style.left = "0px";
    menu.style.top = "0px";
    if (typeof menu.showPopover === "function") menu.showPopover();
    const rect = source.getBoundingClientRect();
    const x = point?.x ?? rect.left;
    const y = point?.y ?? rect.bottom + 6;
    const bounds = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - bounds.width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - bounds.height - 8))}px`;
    source.setAttribute("aria-expanded", "true");
    focusItem(
      menu.querySelector('[aria-current="page"]') ||
        menu.querySelector('[role="menuitem"]'),
    );
  }

  function chapterTarget(target) {
    return target instanceof Element
      ? target.closest(
          "[data-chapter], [data-index-chapter], [data-chapter-menu]",
        )
      : null;
  }
  function chapterNumber(target) {
    return Number(
      target.dataset.chapter ??
        target.dataset.indexChapter ??
        target.dataset.chapterMenu,
    );
  }

  menu.addEventListener("click", (event) => {
    const entry = event.target.closest("[data-menu-visit]");
    const index = event.target.closest("[data-menu-index]");
    if (entry) {
      event.stopPropagation();
      close();
      onVisit(Number(entry.dataset.menuVisit));
    } else if (index) {
      event.stopPropagation();
      const chapter = selectedChapter;
      close();
      onIndex(chapter);
    }
  });
  document.addEventListener("contextmenu", (event) => {
    const source = chapterTarget(event.target);
    if (!source) {
      close();
      return;
    }
    event.preventDefault();
    const pointer = event.clientX || event.clientY;
    open(
      chapterNumber(source),
      source,
      pointer ? { x: event.clientX, y: event.clientY } : undefined,
    );
  });
  document.addEventListener("click", (event) => {
    const source = event.target.closest("[data-chapter-menu]");
    if (!source) return;
    if (!menu.hidden && anchor === source) close(true);
    else open(chapterNumber(source), source);
  });
  document.addEventListener("pointerdown", (event) => {
    if (
      !menu.hidden &&
      !menu.contains(event.target) &&
      !event.target.closest("[data-chapter-menu]")
    )
      close();
  });
  document.addEventListener("keydown", (event) => {
    if (!menu.hidden) {
      if (event.key === "Escape" || event.key === "Tab") {
        close(true);
        if (event.key === "Escape") event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const items = [...menu.querySelectorAll('[role="menuitem"]')];
        const current = items.indexOf(document.activeElement);
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : (current +
                  (event.key === "ArrowDown" ? 1 : -1) +
                  items.length) %
                items.length;
        focusItem(items[next]);
        return;
      }
    }
    const source = chapterTarget(event.target);
    if (
      source &&
      (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      open(chapterNumber(source), source);
    }
  });
  window.addEventListener("resize", () => close());
  window.addEventListener(
    "scroll",
    (event) => {
      if (
        !menu.hidden &&
        (!(event.target instanceof Node) || !menu.contains(event.target))
      )
        close();
    },
    true,
  );
  document
    .querySelector("#app-dialog")
    .addEventListener("close", () => close());
  return { close };
}
