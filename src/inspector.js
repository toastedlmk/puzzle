const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const readable = (text) =>
  text.replace(
    /data:font\/[^;"')]+;base64,[a-z0-9+/=]+/gi,
    "[embedded font data]",
  );
const omitted = "#app-dialog, #chapter-menu, #toast, [data-inspector-overlay]";
const userFields = new Set([
  "answer",
  "field-note",
  "translator-search",
  "decode-input",
  "decode-key",
]);

export function capturePage(puzzle, address) {
  const records = [];
  function copy(node, depth = 0) {
    if (node.nodeType === Node.ELEMENT_NODE && node.matches(omitted))
      return null;
    if (
      ![Node.ELEMENT_NODE, Node.TEXT_NODE, Node.COMMENT_NODE].includes(
        node.nodeType,
      )
    )
      return null;
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim())
      return node.cloneNode();
    const clone = node.cloneNode(false);
    const id = records.length;
    const record = {
      id,
      depth,
      type: node.nodeType,
      live: node,
      clone,
      tag: node.nodeName.toLowerCase(),
    };
    records.push(record);
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (userFields.has(node.id)) {
        clone.removeAttribute("value");
        clone.value = "";
      } else if (
        node.tagName === "SCRIPT" &&
        !(
          node.type === "application/json" &&
          node.hasAttribute("data-puzzle-clue")
        )
      ) {
        if (!node.src)
          clone.append(
            document.createComment(
              "Application JavaScript omitted from inspection.",
            ),
          );
      } else {
        const from = node instanceof HTMLTemplateElement ? node.content : node;
        const into =
          clone instanceof HTMLTemplateElement ? clone.content : clone;
        for (const child of from.childNodes) {
          const copied = copy(child, depth + 1);
          if (copied) into.append(copied);
        }
      }
    } else clone.textContent = node.textContent;
    return clone;
  }
  const root = copy(document.documentElement);
  for (const record of records) {
    const clone = record.clone;
    record.source = readable(
      record.type === Node.ELEMENT_NODE
        ? clone.outerHTML
        : record.type === Node.COMMENT_NODE
          ? `<!--${clone.textContent}-->`
          : clone.textContent,
    );
    record.attributes =
      record.type === Node.ELEMENT_NODE
        ? [...clone.attributes].map((attr) => [attr.name, attr.value])
        : [];
    record.label =
      record.type === Node.COMMENT_NODE
        ? `<!-- ${clone.textContent.trim().slice(0, 110)} -->`
        : record.type === Node.TEXT_NODE
          ? `“${clone.textContent.trim().slice(0, 100)}”`
          : `<${record.tag}${record.attributes
              .slice(0, 6)
              .map(
                ([name, value]) =>
                  ` ${name}="${value.length > 90 ? value.slice(0, 90) + "…" : value}"`,
              )
              .join("")}>`;
    record.search =
      `${record.label} ${record.attributes.map((pair) => pair.join("=")).join(" ")} ${record.type === Node.ELEMENT_NODE ? "" : clone.textContent}`.toLowerCase();
  }
  const source =
    "<!doctype html>\n" + readable(root.outerHTML.replace(/></g, ">\n<"));
  // Preview IDs belong only to the read-only copy, never to the real page or its source view.
  for (const record of records)
    if (record.type === Node.ELEMENT_NODE) {
      record.clone.setAttribute("data-inspector-node", String(record.id));
      if (
        userFields.has(record.clone.id) &&
        ["INPUT", "TEXTAREA"].includes(record.clone.tagName)
      )
        record.clone.readOnly = true;
    }
  root.querySelectorAll("script").forEach((script) => {
    if (script.type !== "application/json") script.remove();
  });
  const base = document.createElement("base");
  base.href = location.href;
  root.querySelector("head").prepend(base);
  const preview = "<!doctype html>\n" + root.outerHTML;
  const entryCss = [...document.querySelectorAll("#entry-style")]
    .map((node) => node.textContent)
    .join("\n");
  const selected =
    records.find((record) => record.clone.id === "puzzle-card")?.id ?? 0;
  return {
    records,
    source,
    preview,
    entryCss,
    extraStyle: puzzle.styleClue || "",
    address,
    title: document.title,
    width: document.documentElement.clientWidth,
    height: Math.max(document.documentElement.scrollHeight, innerHeight),
    selected,
  };
}

function stylesFor(record, snapshot) {
  if (record.type !== Node.ELEMENT_NODE || !record.live.isConnected)
    return { properties: [], pseudo: [], rect: null };
  const css = getComputedStyle(record.live);
  const names = [
    "display",
    "visibility",
    "position",
    "width",
    "height",
    "box-sizing",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
    "color",
    "background-color",
    "opacity",
    "overflow",
    "gap",
    "order",
    "flex-direction",
    "grid-template-columns",
    "grid-column",
    "grid-row",
    "transform",
    "z-index",
    "font-family",
    "font-size",
  ];
  const custom = new Set([...css].filter((name) => name.startsWith("--")));
  for (const match of snapshot.entryCss.matchAll(/(--[\w-]+)\s*:/g))
    custom.add(match[1]);
  const properties = [...custom, ...names]
    .map((name) => [name, css.getPropertyValue(name).trim()])
    .filter((pair) => pair[1]);
  const pseudo = ["::before", "::after"]
    .map((name) => {
      const value = getComputedStyle(record.live, name);
      return { name, content: value.content, display: value.display };
    })
    .filter(
      (value) => value.content && !["none", "normal"].includes(value.content),
    );
  return { properties, pseudo, rect: record.live.getBoundingClientRect() };
}

function detailsMarkup(record, snapshot) {
  const styles = stylesFor(record, snapshot);
  return `<h3 class="selected-element-title">${escape(record.label)}</h3><div class="inspector-section-label">SELECTED NODE</div><pre class="selected-source"><code>${escape(record.source)}</code></pre><button type="button" class="copy-button" data-copy-node>Copy selected code</button>${record.attributes.length ? `<h4>Attributes</h4><dl class="inspector-properties">${record.attributes.map(([name, value]) => `<dt>${escape(name)}</dt><dd>${escape(value)}</dd>`).join("")}</dl>` : ""}${styles.rect ? `<h4>Layout box</h4><p class="box-measurement">${Math.round(styles.rect.width * 100) / 100} × ${Math.round(styles.rect.height * 100) / 100} px</p>` : ""}${styles.pseudo.map((pseudo) => `<h4>${pseudo.name}</h4><dl class="inspector-properties"><dt>content</dt><dd>${escape(pseudo.content)}</dd><dt>display</dt><dd>${escape(pseudo.display)}</dd></dl>`).join("")}${styles.properties.length ? `<h4>Computed styles</h4><dl class="inspector-properties">${styles.properties.map(([name, value]) => `<dt>${escape(name)}</dt><dd>${escape(value)}</dd>`).join("")}</dl>` : ""}`;
}

export function renderInspector({ panel, snapshot, tab, onCopy, onTab }) {
  let dispose = () => {};
  const selected = () => snapshot.records[snapshot.selected];
  if (tab === "source") {
    panel.innerHTML =
      '<div class="source-search-row"><label class="sr-only" for="source-search">Find in full page source</label><input id="source-search" type="search" placeholder="Find in full page source…" maxlength="200"><button type="button" class="copy-button" id="source-next">Find next</button><button type="button" class="copy-button" id="copy-full-source">Copy HTML</button></div><p id="source-match-count" class="inspector-status" role="status">Full current page: head, header, content, sidebars, and footer.</p><pre class="inspector-source"><code></code></pre>';
    const code = panel.querySelector("code");
    code.textContent = snapshot.source;
    const input = panel.querySelector("#source-search");
    let cursor = -1;
    function find(next = false) {
      const query = input.value.toLowerCase();
      if (!query) {
        cursor = -1;
        code.textContent = snapshot.source;
        panel.querySelector("#source-match-count").textContent =
          "Full current page: head, header, content, sidebars, and footer.";
        return;
      }
      const positions = [];
      let at = snapshot.source.toLowerCase().indexOf(query);
      while (at !== -1 && positions.length < 10000) {
        positions.push(at);
        at = snapshot.source.toLowerCase().indexOf(query, at + query.length);
      }
      if (!positions.length) {
        code.textContent = snapshot.source;
        panel.querySelector("#source-match-count").textContent = "No matches.";
        return;
      }
      cursor = next ? (cursor + 1) % positions.length : 0;
      const start = positions[cursor];
      code.innerHTML =
        escape(snapshot.source.slice(0, start)) +
        "<mark>" +
        escape(snapshot.source.slice(start, start + query.length)) +
        "</mark>" +
        escape(snapshot.source.slice(start + query.length));
      panel.querySelector("#source-match-count").textContent =
        `Match ${cursor + 1} of ${positions.length}`;
      code.querySelector("mark").scrollIntoView({ block: "center" });
    }
    input.addEventListener("input", () => {
      cursor = -1;
      find();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        find(true);
      }
    });
    panel.querySelector("#source-next").onclick = () => find(true);
    panel.querySelector("#copy-full-source").onclick = () =>
      onCopy(snapshot.source);
  } else if (tab === "details") {
    const descriptions = snapshot.records.flatMap((record) =>
      record.attributes
        .filter(([name]) =>
          ["aria-label", "aria-description", "alt", "title"].includes(name),
        )
        .map(
          ([name, value]) =>
            `${record.tag}${record.clone.id ? "#" + record.clone.id : ""} · ${name}: ${value}`,
        ),
    );
    const metadata = snapshot.records
      .filter((record) => record.tag === "meta")
      .map((record) =>
        record.attributes.map((pair) => pair.join("=")).join(" · "),
      );
    panel.innerHTML = `<dl class="page-details"><dt>Tab title</dt><dd>${escape(snapshot.title)}</dd><dt>Page address</dt><dd class="address-detail">${escape(snapshot.address)}</dd><dt>Head metadata</dt><dd>${metadata.map(escape).join("<br>")}</dd><dt>Accessible descriptions & tooltips across the page</dt><dd>${descriptions.map(escape).join("<br>") || "No additional descriptions."}</dd><dt>Current-entry stylesheet</dt><dd><pre>${escape([snapshot.entryCss, snapshot.extraStyle].filter(Boolean).join("\n") || "No additional style rules for this entry.")}</pre></dd></dl>`;
  } else if (tab === "elements") {
    panel.innerHTML =
      '<div class="elements-workspace"><section class="dom-browser"><label class="sr-only" for="element-search">Find an element, attribute or text</label><input id="element-search" type="search" placeholder="Find an element, attribute, or text…"><div class="dom-list" aria-label="Full page document structure"></div></section><section class="selected-element" aria-label="Selected element details"></section></div>';
    const list = panel.querySelector(".dom-list");
    function select(id) {
      snapshot.selected = id;
      list
        .querySelectorAll("[data-node]")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(Number(button.dataset.node) === id),
          ),
        );
      const target = panel.querySelector(".selected-element");
      target.innerHTML =
        detailsMarkup(selected(), snapshot) +
        '<button type="button" class="secondary-button" data-see-layout>Show in layout</button>';
      target.querySelector("[data-copy-node]").onclick = () =>
        onCopy(selected().source);
      target.querySelector("[data-see-layout]").onclick = () => onTab("layout");
    }
    function filter() {
      const query = panel.querySelector("#element-search").value.toLowerCase();
      const records = snapshot.records.filter(
        (record) => !query || record.search.includes(query),
      );
      list.innerHTML =
        records
          .map(
            (record) =>
              `<button type="button" class="dom-node" data-node="${record.id}" style="--depth:${Math.min(record.depth, 10)}" aria-pressed="${record.id === snapshot.selected}">${escape(record.label)}</button>`,
          )
          .join("") || '<p class="inspector-status">No elements found.</p>';
    }
    panel.querySelector("#element-search").oninput = filter;
    list.onclick = (event) => {
      const button = event.target.closest("[data-node]");
      if (button) select(Number(button.dataset.node));
    };
    filter();
    select(snapshot.selected);
  } else if (tab === "layout") {
    panel.innerHTML =
      '<p class="inspector-status">Click a part of the page preview to inspect its element and box.</p><div class="layout-workspace"><section class="layout-stage" aria-label="Full page layout preview"><div class="layout-canvas"><iframe title="Read-only full page layout" sandbox="allow-same-origin"></iframe><div class="layout-highlight" hidden></div></div></section><section class="layout-details selected-element" aria-label="Layout selection details"></section></div>';
    const stage = panel.querySelector(".layout-stage"),
      canvas = panel.querySelector(".layout-canvas"),
      frame = panel.querySelector("iframe"),
      highlight = panel.querySelector(".layout-highlight");
    let scale = 1;
    function draw() {
      scale = stage.clientWidth / snapshot.width;
      frame.style.width = snapshot.width + "px";
      frame.style.height = snapshot.height + "px";
      frame.style.transform = `scale(${scale})`;
      canvas.style.height = snapshot.height * scale + "px";
      const target = frame.contentDocument?.querySelector(
        `[data-inspector-node="${snapshot.selected}"]`,
      );
      const box = target?.getBoundingClientRect();
      highlight.hidden = !box || !box.width || !box.height;
      if (!highlight.hidden)
        Object.assign(highlight.style, {
          left: box.x * scale + "px",
          top: box.y * scale + "px",
          width: box.width * scale + "px",
          height: box.height * scale + "px",
        });
    }
    function select(id) {
      snapshot.selected = id;
      const target = panel.querySelector(".layout-details");
      target.innerHTML =
        detailsMarkup(selected(), snapshot) +
        '<button type="button" class="secondary-button" data-see-elements>Show in Elements</button>';
      target.querySelector("[data-copy-node]").onclick = () =>
        onCopy(selected().source);
      target.querySelector("[data-see-elements]").onclick = () =>
        onTab("elements");
      draw();
    }
    frame.onload = () => {
      frame.contentDocument.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          const node = event.target.closest("[data-inspector-node]");
          if (node) select(Number(node.dataset.inspectorNode));
        },
        true,
      );
      frame.contentDocument.fonts.ready.then(draw);
      select(snapshot.selected);
    };
    frame.srcdoc = snapshot.preview;
    const observer = new ResizeObserver(draw);
    observer.observe(stage);
    dispose = () => {
      observer.disconnect();
      frame.onload = null;
    };
  }
  return dispose;
}
