let restore = [];

export function applyInspectionScene(puzzle) {
  for (const undo of restore.reverse()) undo();
  restore = [];
  const styles = [];
  for (const operation of puzzle.scene || []) {
    if (operation.kind === "css") {
      styles.push(operation.text);
      continue;
    }
    const target = document.querySelector(operation.target);
    if (!target)
      throw new Error(
        `Inspection scene target is missing: ${operation.target}`,
      );
    if (operation.kind === "attribute") {
      const previous = target.getAttribute(operation.name);
      target.setAttribute(operation.name, operation.value);
      restore.push(() =>
        previous === null
          ? target.removeAttribute(operation.name)
          : target.setAttribute(operation.name, previous),
      );
    } else if (operation.kind === "comment") {
      const comment = document.createComment(operation.text);
      target.append(comment);
      restore.push(() => comment.remove());
    } else if (operation.kind === "html") {
      const template = document.createElement("template");
      template.innerHTML = operation.html;
      const nodes = [...template.content.childNodes];
      for (const node of nodes) {
        if (node.nodeType === Node.ELEMENT_NODE)
          node.setAttribute("data-puzzle-clue", "");
        target.append(node);
        restore.push(() => node.remove());
      }
    }
  }
  if (styles.length) {
    const sheet = document.createElement("style");
    sheet.id = "entry-style";
    sheet.setAttribute("data-puzzle-clue", "");
    sheet.textContent = styles.join("\n");
    document.head.append(sheet);
    restore.push(() => sheet.remove());
  }
}
