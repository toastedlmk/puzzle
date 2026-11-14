import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
let html = await readFile(resolve(dist, "index.html"), "utf8");
const scriptTag = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const styleTag = html.match(
  /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,
);
if (!scriptTag || !styleTag)
  throw new Error(
    "Build the site first: expected one JavaScript bundle and stylesheet.",
  );

const cssPath = resolve(dist, styleTag[1]);
let css = await readFile(cssPath, "utf8");
for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
  const path = match[1].replace(/^["']|["']$/g, "");
  if (path.startsWith("data:")) continue;
  const font = await readFile(resolve(dirname(cssPath), path));
  const type = path.endsWith(".woff2") ? "font/woff2" : "font/woff";
  css = css.replaceAll(
    match[0],
    `url(data:${type};base64,${font.toString("base64")})`,
  );
}
const script = await readFile(resolve(dist, scriptTag[1]), "utf8");
const crane = await readFile(resolve(dist, "clues/paper-crane.svg"));
const favicon = await readFile(resolve(dist, "favicon.svg"));
const settings = JSON.stringify({
  crane: `data:image/svg+xml;base64,${crane.toString("base64")}`,
});
// Inline modules have no imports after Vite's bundle step, so this edition does
// not depend on file-origin module fetching, a web server, or network access.
const inlineScript =
  `globalThis.__AFTERWORD_EMBEDDED__=${settings};\n${script}`.replace(
    /<\/script/gi,
    "<\\/script",
  );
html = html.replace(
  scriptTag[0],
  () => `<script type="module">${inlineScript}</script>`,
);
html = html.replace(styleTag[0], () => `<style>${css}</style>`);
html = html.replace(
  'href="./favicon.svg"',
  `href="data:image/svg+xml;base64,${favicon.toString("base64")}"`,
);
const licenses = await Promise.all(
  ["instrument-serif", "dm-sans"].map((name) =>
    readFile(resolve(dist, `licenses/${name}.txt`), "utf8"),
  ),
);
html += `\n<!-- Bundled font licenses\n${licenses.join("\n\n").replaceAll("--", "—")}\n-->\n`;
const output = resolve(dist, "the-afterword.html");
await writeFile(output, html);
console.log(
  `Standalone website written to ${output} (${Buffer.byteLength(html)} bytes).`,
);
