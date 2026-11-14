import { decodeText } from "./decoder.js";

export const inspectionChapters = [
  {
    title: "The outside margins",
    subtitle: "Leave the box",
    numeral: "VI",
    category: "Page archaeology",
  },
  {
    title: "Rules beneath the ink",
    subtitle: "Read the styles",
    numeral: "VII",
    category: "CSS & layout",
  },
  {
    title: "Quiet structures",
    subtitle: "Follow the branches",
    numeral: "VIII",
    category: "DOM relationships",
  },
  {
    title: "Signals in transit",
    subtitle: "Unwrap the record",
    numeral: "IX",
    category: "Hidden encodings",
  },
  {
    title: "The hidden architecture",
    subtitle: "Join the evidence",
    numeral: "X",
    category: "Layered inspection",
  },
];
const a = (target, name, value) => ({ kind: "attribute", target, name, value });
const c = (target, text) => ({ kind: "comment", target, text });
const h = (target, html) => ({ kind: "html", target, html });
const s = (text) => ({ kind: "css", text });
const meta = (name, value) =>
  h("head", `<meta name="${name}" content="${value}">`);
const record = (id, value) =>
  h(
    ".site-footer",
    `<script type="application/json" id="${id}">${JSON.stringify(value)}</script>`,
  );
const hidden = (id, html) =>
  h(".site-footer", `<div id="${id}" hidden>${html}</div>`);
const exhibit = (id, html) =>
  h(".site-footer", `<div id="${id}" class="inspection-exhibit">${html}</div>`);
const hex = (word) => decodeText(word, "hex-encode");
const b64 = (word) => decodeText(word, "base64-encode");
const rot = (word) => decodeText(word, "rot13");
const shift = (word, n) =>
  decodeText(word, "rotate", { shift: n, direction: "forward" });
const seal =
  '<div class="inspection-seal"><svg viewBox="0 0 90 70" width="90" height="70" aria-hidden="true"><path d="M18 12h54v46H18zM27 24h36M27 34h25M27 44h31" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="68" cy="51" r="12" fill="var(--paper)" stroke="currentColor"/><path d="m76 60 9 9" stroke="currentColor"/></svg><span>the visible surface</span></div>';
function q(title, prompt, answer, scene, hint1, hint2, explanation) {
  return {
    title,
    prompt,
    type: "html",
    content: seal,
    answers: [answer],
    scene,
    hints: [hint1, hint2, `The answer is “${answer}”.`],
    explanation,
  };
}

export const inspectionPuzzles = [
  // 101–120: clues leave the central puzzle panel.
  q(
    "The page above the page",
    "The first door is outside the paper. Find what the page has filed under arrival.",
    "threshold",
    [meta("arrival", "threshold")],
    "Start in the document head.",
    "A meta element named arrival has a content value.",
    'The head contains meta[name="arrival"] with content="threshold".',
  ),
  q(
    "A footnote never printed",
    "The bottom of a page can keep a thought without printing it.",
    "bramble",
    [c(".site-footer", "For the returning reader: bramble.")],
    "Inspect the footer, including its non-visible children.",
    "An HTML comment follows the visible footer text.",
    "The footer comment names bramble.",
  ),
  q(
    "The name on the door",
    "The mark that takes you home carries a quieter destination.",
    "harvest",
    [a(".wordmark", "data-destination", "harvest")],
    "Select the home wordmark in Elements.",
    "Read its data-destination attribute.",
    'The home link carries data-destination="harvest".',
  ),
  q(
    "A borrowed description",
    "The writing place has a description beyond its label.",
    "cypress",
    [
      a(
        ".notebook",
        "aria-description",
        "The writing place remembers cypress.",
      ),
    ],
    "Inspect the Field notes container.",
    "Its aria-description contains a tree name.",
    "The notebook accessibility description names cypress.",
  ),
  q(
    "After the language",
    "A familiar language has picked up a private extra.",
    "orchid",
    [a("html", "lang", "en-x-orchid")],
    "Look at the outermost html element.",
    "The private-use part follows -x- in its lang attribute.",
    "The language tag is en-x-orchid. The private word is orchid.",
  ),
  q(
    "A heading with an echo",
    "The heading you see is not the only heading it holds.",
    "hollow",
    [a("#intro-title", "data-echo", "hollow")],
    "Inspect the large page heading outside the puzzle card.",
    "The data-echo attribute is the quiet heading.",
    'The introductory h1 carries data-echo="hollow".',
  ),
  q(
    "A receipt without a counter",
    "Something in the footer has a value, yet never takes up space.",
    "saffron",
    [
      h(
        ".site-footer",
        '<input type="hidden" id="unprinted-receipt" value="saffron" data-puzzle-clue>',
      ),
    ],
    "Look for a hidden input in the footer.",
    "Read its value attribute, not its dimensions.",
    'The hidden receipt has value="saffron".',
  ),
  q(
    "A second kind of link",
    "A link in the head offers an alternate reading. Its fragment is enough.",
    "tangent",
    [
      h(
        "head",
        '<link rel="alternate" href="#tangent" title="another reading">',
      ),
    ],
    "Inspect link elements in the document head.",
    "Read the fragment of the alternate link.",
    "The alternate link points to #tangent.",
  ),
  q(
    "An unopened envelope",
    "A template keeps a small envelope that the page has not opened.",
    "parcel",
    [
      h(
        ".site-footer",
        '<template id="envelope"><span data-seal="parcel">unopened</span></template>',
      ),
    ],
    "Find the footer template and expand its content.",
    "The inner span has a data-seal attribute.",
    'The template contains data-seal="parcel".',
  ),
  q(
    "The observer",
    "An eye was left beside the page, written as a note rather than a mark.",
    "kestrel",
    [c(".field-sidebar", "observer: kestrel")],
    "Inspect children of the notes-and-tools sidebar.",
    "Comments are nodes too.",
    "The sidebar comment identifies the observer as kestrel.",
  ),
  q(
    "A date without a day",
    "A record in the head has a season instead of a calendar date.",
    "winter",
    [meta("edition-date", "winter")],
    "Look among the head metadata.",
    "Find the entry named edition-date.",
    "The edition-date meta content is winter.",
  ),
  q(
    "The upper boundary",
    "The top bar has a boundary you can name without seeing a line.",
    "shore",
    [a(".site-header", "data-boundary", "shore")],
    "Select the site header.",
    "Read data-boundary in its attributes.",
    "The header boundary is shore.",
  ),
  q(
    "A description of light",
    "The footer speaks differently to a reader who listens.",
    "glimmer",
    [
      a(
        ".site-footer",
        "aria-description",
        "A small glimmer at the end of the page.",
      ),
    ],
    "Inspect the footer accessibility attributes.",
    "Read aria-description.",
    "The hidden description contains glimmer.",
  ),
  q(
    "A hidden heading",
    "There is another heading at the very end. It was never invited into the layout.",
    "elsewhere",
    [hidden("uninvited-heading", "<h2>elsewhere</h2>")],
    "Look for a hidden footer container.",
    "Expand its h2 child.",
    "The hidden h2 reads elsewhere.",
  ),
  q(
    "What the tools remember",
    "The tool shelf has kept a receipt of its own.",
    "cobalt",
    [a(".pocket-tools", "data-receipt", "cobalt")],
    "Select the Pocket tools section.",
    "Its data-receipt attribute names a color.",
    "The tool shelf carries cobalt.",
  ),
  q(
    "A number in the margin",
    "The page has numbered a note, but its contents are a word.",
    "ribbon",
    [
      h(
        ".site-footer",
        '<aside hidden id="margin-note-16"><p>ribbon</p></aside>',
      ),
    ],
    "Search Elements for margin-note.",
    "Read the paragraph in margin-note-16.",
    "The hidden margin note contains ribbon.",
  ),
  q(
    "A title behind the title",
    "A page title is not the only way to name a document.",
    "vellum",
    [meta("document-label", "vellum")],
    "Look at metadata rather than the browser tab.",
    "The document-label entry has a content attribute.",
    "The document-label metadata says vellum.",
  ),
  q(
    "The space around everything",
    "The body keeps a single texture in its margins.",
    "linen",
    [a("body", "data-texture", "linen")],
    "Inspect the body element itself.",
    "Read data-texture.",
    "The body texture is linen.",
  ),
  q(
    "A second fold",
    "A template inside a template: the inner fold keeps the word.",
    "nest",
    [
      h(
        ".site-footer",
        '<template id="first-fold"><template id="second-fold"><b>nest</b></template></template>',
      ),
    ],
    "Find first-fold in the footer.",
    "Expand both template contents before reading the b element.",
    "The inner template holds nest.",
  ),
  q(
    "Leave the rectangle",
    "The first section ends where a document begins. Read its opening note.",
    "outside",
    [c("head", "Section VI complete. The next direction is outside.")],
    "Inspect the head, including comments.",
    "A comment gives the next direction.",
    "The head comment says outside.",
  ),

  // 121–140: actual CSS rules, pseudo-elements, and layout order.
  q(
    "A custom murmur",
    "The top bar has a style property that is not part of the standard vocabulary.",
    "willow",
    [s('.site-header { --murmur: "willow"; }')],
    "Select the site header and inspect its styles.",
    "Find the custom property --murmur in the current-entry stylesheet.",
    "The header custom property --murmur contains willow.",
  ),
  q(
    "After the ending",
    "The footer has an afterthought, even though that thought is not displayed.",
    "amber",
    [s('.site-footer::after { content: "amber"; display: none; }')],
    "Inspect the footer’s ::after pseudo-element.",
    "Its content property exists even with display:none.",
    "The footer ::after content is amber.",
  ),
  q(
    "Three voices, one rule",
    "A little footer sample has three competing voices. Which color wins?",
    "purple",
    [
      exhibit(
        "specificity-sample",
        '<span class="tone" id="winning-tone">a quiet sample</span>',
      ),
      s(
        ".tone { color: green; } #winning-tone { color: purple; } .tone { color: orange; }",
      ),
    ],
    "Find winning-tone and compare its matching CSS selectors.",
    "An ID selector outranks a class selector.",
    "The #winning-tone rule wins: purple.",
  ),
  q(
    "The important exception",
    "A footer sample refuses to follow its most specific ordinary rule. Which color remains?",
    "teal",
    [
      exhibit(
        "importance-sample",
        '<span class="stubborn" id="stubborn-note">a stubborn sample</span>',
      ),
      s(
        "#stubborn-note { color: crimson; } .stubborn { color: teal !important; }",
      ),
    ],
    "Inspect the color rules on stubborn-note.",
    "The !important declaration takes precedence here.",
    "The important class declaration sets teal.",
  ),
  q(
    "A value from above",
    "A small seed does not define its own color. What color does it inherit?",
    "indigo",
    [
      exhibit(
        "inheritance-sample",
        '<div class="parent-ink"><span id="seed-ink">seed</span></div>',
      ),
      s(".parent-ink { color: indigo; }"),
    ],
    "Select seed-ink, then inspect its parent.",
    "Color is inherited from .parent-ink.",
    "The parent sets indigo and the child inherits it.",
  ),
  q(
    "The backup word",
    "A missing variable leaves its backup to speak. What word is that backup?",
    "fern",
    [
      s(
        '.site-header::before { content: var(--unassigned-signal, "fern"); display: none; }',
      ),
    ],
    "Look at the header’s ::before style rule.",
    "The second argument of var() is the fallback.",
    "The fallback content is fern.",
  ),
  q(
    "A variable with a neighbor",
    "One property points to another. Follow the reference to its word.",
    "lilac",
    [
      s(
        '.site-header { --first-thread: var(--second-thread); --second-thread: "lilac"; }',
      ),
    ],
    "Read the header’s custom properties.",
    "--first-thread refers to --second-thread.",
    "Following the variable chain leads to lilac.",
  ),
  q(
    "Words before words",
    "A note appears before a sample without being a child text node.",
    "chime",
    [
      exhibit("before-sample", '<span class="before-word">the sample</span>'),
      s('.before-word::before { content: "chime "; }'),
    ],
    "Find before-sample near the footer.",
    "Read the ::before content rule on .before-word.",
    "The generated word is chime.",
  ),
  q(
    "A label made from an attribute",
    "The sample’s generated label reads its own attribute. Which word supplies the label?",
    "marigold",
    [
      exhibit(
        "attribute-sample",
        '<span class="attribute-word" data-label="marigold">a sample</span>',
      ),
      s('.attribute-word::before { content: attr(data-label) " · "; }'),
    ],
    "Select .attribute-word in the footer.",
    "The ::before rule uses attr(data-label).",
    "The data-label attribute supplies marigold.",
  ),
  q(
    "A letter written as a number",
    "A stylesheet writes a word with escaped Unicode values. Decode the content.",
    "moss",
    [
      s(
        '.site-footer::before { content: "\\6d \\6f \\73 \\73"; display: none; }',
      ),
    ],
    "Look at the footer’s ::before rule.",
    "CSS hexadecimal escapes 6d, 6f, 73, 73 spell letters.",
    "The CSS escapes produce moss.",
  ),
  q(
    "Read the visible order",
    "The DOM order is a decoy. Read these footer pieces in their CSS flex order.",
    "path",
    [
      exhibit(
        "flex-message",
        '<span class="f3">T</span><span class="f1">P</span><span class="f4">H</span><span class="f2">A</span>',
      ),
      s(
        "#flex-message { display:flex; gap:12px; } #flex-message .f1{order:1} #flex-message .f2{order:2} #flex-message .f3{order:3} #flex-message .f4{order:4}",
      ),
    ],
    "Inspect the footer’s flex-message and each order property.",
    "Order 1 is P, then A, T, H.",
    "The visual flex order spells PATH.",
  ),
  q(
    "Four columns, one sentence",
    "The grid sets the reading order. Read the first row from left to right.",
    "lamp",
    [
      exhibit(
        "grid-message",
        '<span class="g3">M</span><span class="g1">L</span><span class="g4">P</span><span class="g2">A</span>',
      ),
      s(
        "#grid-message{display:grid;grid-template-columns:repeat(4,1fr)} #grid-message .g1{grid-column:1;grid-row:1} #grid-message .g2{grid-column:2;grid-row:1} #grid-message .g3{grid-column:3;grid-row:1} #grid-message .g4{grid-column:4;grid-row:1}",
      ),
    ],
    "Inspect the grid column assignments.",
    "The letters at columns 1–4 are L, A, M, P.",
    "The grid’s displayed row spells LAMP.",
  ),
  q(
    "A calculated edge",
    "A sample’s CSS width is a small calculation. Give the result in pixels, without the unit.",
    "42",
    [
      exhibit("measured-width", "<span>an edge to measure</span>"),
      s(
        "#measured-width { box-sizing:content-box; width:calc(30px + 12px); padding:0; border:0; margin:8px auto; }",
      ),
    ],
    "Select measured-width in Elements or Layout.",
    "The width rule is calc(30px + 12px).",
    "The content width is 42 pixels.",
  ),
  q(
    "Everything inside the border",
    "A content-box sample is 40px wide, with 5px padding and 2px borders on both sides. Give its outer width.",
    "54",
    [
      exhibit("box-measure", "a measured box"),
      s(
        "#box-measure{box-sizing:content-box;width:40px;padding:5px;border:2px solid #93a27b;margin:8px auto}",
      ),
    ],
    "Inspect box-measure’s box model.",
    "Add width + twice the padding + twice the border.",
    "40 + 10 + 4 = 54 pixels.",
  ),
  q(
    "A silent layer",
    "Two footer elements have names, but one is removed from the layout. Type its data-name.",
    "sable",
    [
      exhibit(
        "display-records",
        '<span class="displayed" data-name="pearl">a visible sample</span><span class="undisplayed" data-name="sable">another sample</span>',
      ),
      s("#display-records .undisplayed{display:none}"),
    ],
    "Compare the display values of the two spans.",
    "The undisplayed span has display:none.",
    "Its data-name is sable.",
  ),
  q(
    "There, but unseen",
    "This time the element keeps its box. Which data-name belongs to visibility:hidden?",
    "mist",
    [
      exhibit(
        "visibility-records",
        '<span data-name="sun">a sample</span><span class="unseen" data-name="mist">a second sample</span>',
      ),
      s("#visibility-records .unseen{visibility:hidden}"),
    ],
    "Inspect visibility-records and its children.",
    "visibility:hidden keeps a layout box; display:none does not.",
    'The element with visibility:hidden has data-name="mist".',
  ),
  q(
    "A quarter of a turn",
    "A footer compass has been rotated 90 degrees. How many quarter-turns is that?",
    "1",
    [
      exhibit("quarter-compass", "↑"),
      s("#quarter-compass { width:32px; transform:rotate(90deg); }"),
    ],
    "Read quarter-compass’s transform rule.",
    "A complete turn is 360 degrees.",
    "90/360 is one quarter-turn, so the answer is 1.",
  ),
  q(
    "A deliberate gap",
    "Three footer boxes have a gap between them. Read that gap’s pixel value.",
    "17",
    [
      exhibit("gap-sample", "<span>1</span><span>2</span><span>3</span>"),
      s("#gap-sample{display:flex;gap:17px;width:max-content}"),
    ],
    "Select gap-sample and inspect the gap property.",
    "The rule sets gap:17px.",
    "The gap is 17 pixels.",
  ),
  q(
    "A name for an animation",
    "An unused keyframe in the stylesheet has the word you need as its name.",
    "drift",
    [s("@keyframes drift { from { opacity:0.9; } to { opacity:1; } }")],
    "Read the current-entry stylesheet.",
    "Look for an @keyframes rule rather than a selector.",
    "The keyframe is named drift.",
  ),
  q(
    "The inherited password",
    "The body holds a word in a custom property. The footer inherits it unchanged.",
    "understory",
    [
      s(
        'body { --understory-key: "understory"; } .site-footer { --inherited-key: var(--understory-key); }',
      ),
    ],
    "Follow --inherited-key from the footer to the body.",
    "The body defines --understory-key.",
    "The inherited custom property resolves to understory.",
  ),

  // 141–160: DOM relationships and inert structures.
  q(
    "Only the immediate children",
    "At the footer, #direct-notes > .keep selects a word. Read the selected text in order.",
    "ink",
    [
      hidden(
        "direct-notes",
        '<span class="keep">I</span><div><span class="keep">X</span></div><span class="keep">N</span><span class="keep">K</span>',
      ),
    ],
    "Find direct-notes and read its direct children.",
    "The nested X does not match the > selector.",
    "Only I, N, K are direct .keep children.",
  ),
  q(
    "Every second child",
    "The even children of the footer ledger each hold one letter.",
    "gate",
    [
      hidden(
        "even-ledger",
        "<i>x</i><i>G</i><i>x</i><i>A</i><i>x</i><i>T</i><i>x</i><i>E</i>",
      ),
    ],
    "Use #even-ledger > :nth-child(even).",
    "Count element children from 1.",
    "Children 2, 4, 6, and 8 spell GATE.",
  ),
  q(
    "The next sibling",
    "Find the marked footer node. The next element sibling carries your word.",
    "birch",
    [
      hidden(
        "sibling-ledger",
        '<span data-mark="start">start</span><!-- ignore this node --><span>birch</span><span>ash</span>',
      ),
    ],
    "Comments are nodes, but not element siblings.",
    'Read the span immediately after [data-mark="start"].',
    "The next element sibling contains birch.",
  ),
  q(
    "Before the marker",
    "The word sits immediately before a marked element in a footer ledger.",
    "reed",
    [
      hidden(
        "previous-ledger",
        '<span>oak</span><span>reed</span><b data-mark="end">end</b>',
      ),
    ],
    "Find previous-ledger.",
    'Read the previous element sibling of [data-mark="end"].',
    "The span before the marker reads reed.",
  ),
  q(
    "Two ends of a branch",
    "Take the first and last element children of the hidden branch, then join their text.",
    "sunrise",
    [
      hidden(
        "edge-branch",
        "<span>sun</span><span>not</span><span>this</span><span>rise</span>",
      ),
    ],
    "Locate edge-branch in the footer.",
    "Use firstElementChild and lastElementChild.",
    "sun + rise makes sunrise.",
  ),
  q(
    "An identity points elsewhere",
    "The notebook describes itself by pointing to another element. Follow that ID.",
    "thistle",
    [
      a(".notebook", "aria-describedby", "notebook-description-key"),
      hidden("notebook-description-key", "thistle"),
    ],
    "Inspect the notebook’s aria-describedby attribute.",
    "Find the element with that exact id.",
    "The referenced description contains thistle.",
  ),
  q(
    "A name made of two pieces",
    "The footer’s aria-labelledby names two elements. Join their text in the listed order.",
    "daybreak",
    [
      a(".site-footer", "aria-labelledby", "name-first name-last"),
      hidden(
        "label-pieces",
        '<span id="name-first">day</span><span id="name-last">break</span>',
      ),
    ],
    "Read the IDs in aria-labelledby, left to right.",
    "Look up name-first and name-last.",
    "day + break gives daybreak.",
  ),
  q(
    "Not a child at all",
    "A comment between two footer elements contains the word.",
    "fallow",
    [
      hidden(
        "comment-ledger",
        "<span>before</span><!-- fallow --><span>after</span>",
      ),
    ],
    "Find comment-ledger and inspect all node types.",
    "The word is in a comment, not an element.",
    "The comment between the spans is fallow.",
  ),
  q(
    "The ordered list lies",
    "The list shows a starting number, but the third element is still the third element. Read its word.",
    "haze",
    [
      hidden(
        "numbered-ledger",
        '<ol start="7"><li>dew</li><li>rain</li><li>haze</li><li>fog</li></ol>',
      ),
    ],
    "Look at numbered-ledger’s ol element.",
    "Count li elements from 1, independently of the start attribute.",
    "The third li contains haze.",
  ),
  q(
    "A different kind of first",
    "Select the first strong element in the ledger, rather than the first child.",
    "elm",
    [
      hidden(
        "typed-ledger",
        "<span>ash</span><strong>elm</strong><strong>oak</strong>",
      ),
    ],
    "Use strong:first-of-type.",
    "A span before the strong element does not count as that type.",
    "The first strong element reads elm.",
  ),
  q(
    "The only one of its kind",
    "One letter element is the sole em child of the hidden ledger.",
    "quartz",
    [
      hidden(
        "only-ledger",
        "<span>glass</span><em>quartz</em><span>stone</span>",
      ),
    ],
    "Find only-ledger.",
    "em:only-of-type selects the unique em.",
    "The em element contains quartz.",
  ),
  q(
    "Follow the address label",
    "A footer link names an ID, not a destination on the web. Read the referenced text.",
    "linden",
    [
      hidden(
        "reference-ledger",
        '<a href="#referenced-word">a local reference</a><p id="referenced-word">linden</p>',
      ),
    ],
    "Inspect reference-ledger’s anchor href.",
    "The fragment points to referenced-word.",
    "The referenced paragraph contains linden.",
  ),
  q(
    "A smaller document",
    "There is a word inside an inert template nested in the page header.",
    "calico",
    [
      h(
        ".site-header",
        '<template id="header-miniature"><article><header><h2>calico</h2></header></article></template>',
      ),
    ],
    "Inspect the site header’s template content.",
    "Follow article → header → h2.",
    "The miniature document’s heading is calico.",
  ),
  q(
    "The sequence in the labels",
    "Sort the footer spans by data-rank, then join their text.",
    "raven",
    [
      hidden(
        "ranked-letters",
        '<span data-rank="4">E</span><span data-rank="1">R</span><span data-rank="5">N</span><span data-rank="3">V</span><span data-rank="2">A</span>',
      ),
    ],
    "Find ranked-letters and inspect the data-rank attributes.",
    "Read ranks 1 through 5.",
    "R A V E N spells RAVEN.",
  ),
  q(
    "A branch that stays",
    "Only spans without data-discard belong in the message.",
    "oath",
    [
      hidden(
        "discard-ledger",
        "<span>O</span><span data-discard>X</span><span>A</span><span>T</span><span data-discard>Q</span><span>H</span>",
      ),
    ],
    "Filter with span:not([data-discard]).",
    "Ignore X and Q.",
    "The remaining text spells OATH.",
  ),
  q(
    "A note inside the picture",
    "A small hidden SVG stores a title for the reader who inspects it.",
    "tamarind",
    [
      h(
        ".site-footer",
        '<svg hidden viewBox="0 0 10 10" id="svg-ledger"><title>tamarind</title><path d="M0 0h10v10Z"/></svg>',
      ),
    ],
    "Find svg-ledger near the footer.",
    "Expand its title child.",
    "The SVG title contains tamarind.",
  ),
  q(
    "The other text of a picture",
    "The footer stores an inert image example. Read the word in its alternate text.",
    "avocet",
    [
      h(
        ".site-footer",
        '<template id="picture-sample"><img alt="avocet" data-file="bird.svg"></template>',
      ),
    ],
    "Expand picture-sample’s template content.",
    "The image’s alt attribute names the bird.",
    "The alternate text is avocet.",
  ),
  q(
    "A text node between tags",
    "The ledger’s answer is plain text between two empty spans.",
    "flint",
    [hidden("text-ledger", "<span></span>flint<span></span>")],
    "Inspect text-ledger, including text nodes.",
    "The answer is not inside either span.",
    "The text node between the empty spans is flint.",
  ),
  q(
    "Initials of the branches",
    "Read the first letter of each direct child tag name in the hidden ledger.",
    "aside",
    [
      hidden(
        "tag-ledger",
        "<article></article><span></span><i></i><div></div><em></em>",
      ),
    ],
    "Inspect the tag names of tag-ledger’s five children.",
    "article, span, i, div, em.",
    "Their initial letters spell ASIDE.",
  ),
  q(
    "The DOM is not the picture",
    "The footer letters are visually reversed. Read their DOM text order.",
    "root",
    [
      exhibit(
        "reverse-display",
        "<span>R</span><span>O</span><span>O</span><span>T</span>",
      ),
      s(
        "#reverse-display{display:flex;flex-direction:row-reverse;gap:10px;width:max-content}",
      ),
    ],
    "Inspect reverse-display’s children in source order.",
    "Ignore the row-reverse presentation.",
    "The DOM order is R O O T.",
  ),

  // 161–180: encoded records and fragments, all stored in the live page.
  q(
    "A hexagonal receipt",
    "The header receipt is written as hexadecimal bytes.",
    "lantern",
    [a(".site-header", "data-receipt", hex("lantern"))],
    "Inspect the header’s data-receipt.",
    "Decode it as hexadecimal ASCII/UTF-8.",
    "The header bytes decode to lantern.",
  ),
  q(
    "A padded note",
    "A footer comment wears Base64 padding.",
    "pollen",
    [c(".site-footer", `encoding=base64; payload=${b64("pollen")}`)],
    "Look for a coded footer comment.",
    "The payload is Base64.",
    "Decoding the payload gives pollen.",
  ),
  q(
    "Halfway around the head",
    "One metadata value has taken half a turn.",
    "meadow",
    [meta("rotated-signal", rot("meadow"))],
    "Find rotated-signal in the head.",
    "Apply ROT13 to its content.",
    "ROT13 returns meadow.",
  ),
  q(
    "Bits in the tools",
    "The tools have stored a binary message instead of a receipt.",
    "iris",
    [a(".pocket-tools", "data-bits", decodeText("iris", "binary-encode"))],
    "Inspect the Pocket tools data-bits attribute.",
    "Read its eight-bit groups as text.",
    "The binary groups decode to iris.",
  ),
  q(
    "A numbered description",
    "A description record uses ordinary decimal bytes.",
    "murmur",
    [meta("decimal-description", decodeText("murmur", "ascii-encode"))],
    "Search the metadata for decimal-description.",
    "Use Decimal ASCII → text.",
    "The decimal values spell murmur.",
  ),
  q(
    "A small radio in the margin",
    "An inert template has a message spoken in radio words.",
    "dove",
    [hidden("radio-record", "Delta Oscar Victor Echo")],
    "Find radio-record in the footer.",
    "The NATO phonetic words contribute one letter each.",
    "D O V E gives DOVE.",
  ),
  q(
    "A percent of a word",
    "The home link has kept a URL-encoded annotation.",
    "field notes",
    [a(".wordmark", "data-annotation", "field%20notes")],
    "Inspect the home link’s data-annotation.",
    "Apply URL percent-decoding.",
    "The annotation decodes to field notes.",
  ),
  q(
    "A record that reads back",
    "The footer record is plain JSON, but its payload faces the other way.",
    "glen",
    [record("backward-record", { direction: "reverse", payload: "nelg" })],
    "Find the application/json record in the footer.",
    "Reverse its payload.",
    "nelg reversed is glen.",
  ),
  q(
    "A mirror in the head",
    "The head names a reversed alphabet as the key.",
    "silver",
    [
      meta("alphabet-key", "atbash"),
      meta("mirrored-message", decodeText("silver", "atbash")),
    ],
    "Read alphabet-key and mirrored-message together.",
    "Apply Atbash to the mirrored text.",
    "Atbash decodes the message as silver.",
  ),
  q(
    "A key on another shelf",
    "The message is in the footer; its Vigenère key is in the header.",
    "open",
    [
      a(".site-header", "data-key", "KEY"),
      record("keyed-message", { cipher: "vigenere", payload: "YTCX" }),
    ],
    "Find keyed-message and the header’s data-key.",
    "Decode YTCX with the key KEY.",
    "Vigenère decryption produces OPEN.",
  ),
  q(
    "Five small choices",
    "The body holds five-bit alphabet groups. Start counting at zero.",
    "bead",
    [a("body", "data-five-bit", "00001 00100 00000 00011")],
    "Inspect the body’s data-five-bit attribute.",
    "Use the five-bit/Bacon tool with A = 0.",
    "The groups decode to BEAD.",
  ),
  q(
    "A square off the paper",
    "A record gives row-column pairs for an alphabet square with I/J together.",
    "clue",
    [
      record("square-message", {
        square: "A-Z, I/J shared",
        pairs: "13 31 45 15",
      }),
    ],
    "Find square-message in the footer.",
    "Decode the pairs using the Polybius tool.",
    "The pairs produce CLUE.",
  ),
  q(
    "Two strands of a label",
    "The notebook’s two rail fragments have been joined in one attribute.",
    "secret",
    [a(".notebook", "data-rails", "SCEERT")],
    "Read data-rails from the notebook.",
    "Decode as a two-rail fence: odd positions first, then even.",
    "Interleaving SCE and ERT gives SECRET.",
  ),
  q(
    "The values that are true",
    "A hidden JSON ledger has true and false records. Keep true, in the existing order.",
    "dawn",
    [
      record("truth-ledger", [
        { ch: "D", keep: true },
        { ch: "X", keep: false },
        { ch: "A", keep: true },
        { ch: "W", keep: true },
        { ch: "Q", keep: false },
        { ch: "N", keep: true },
      ]),
    ],
    "Find truth-ledger in the footer.",
    "Keep only records with the boolean keep:true.",
    "The kept letters are D A W N.",
  ),
  q(
    "A ranked message",
    "A JSON record asks for a sort before you read its letters.",
    "pebble",
    [
      record("sorted-ledger", [
        { n: 4, ch: "B" },
        { n: 1, ch: "P" },
        { n: 6, ch: "E" },
        { n: 3, ch: "B" },
        { n: 2, ch: "E" },
        { n: 5, ch: "L" },
      ]),
    ],
    "Read sorted-ledger.",
    "Sort n from smallest to largest, then join ch.",
    "The sorted letters spell PEBBLE.",
  ),
  q(
    "Eight as a base",
    "The footer’s byte note uses only digits from zero to seven.",
    "key",
    [c(".site-footer", "base=8; bytes=113 105 131")],
    "Inspect the footer comment.",
    "Read the three-digit bytes as octal.",
    "The octal bytes spell KEY.",
  ),
  q(
    "A number written with letters",
    "A receipt contains one Roman numeral. Translate it to decimal.",
    "49",
    [a(".pocket-tools", "data-roman", "XLIX")],
    "Inspect the tools’ data-roman value.",
    "XL is 40 and IX is 9.",
    "XLIX is 49.",
  ),
  q(
    "An entity in an entity",
    "An inert record contains the spelling of HTML entities, not their decoded letters.",
    "key",
    [record("entity-ledger", { payload: "&#107;&#101;&#121;" })],
    "Find entity-ledger and copy the payload.",
    "Use HTML entities → text.",
    "The entities produce key.",
  ),
  q(
    "A certificate of order",
    "An encoded metadata value becomes a word only after you turn it around.",
    "east",
    [meta("certificate", "base64: dHNhZQ==; then reverse")],
    "Read the certificate metadata.",
    "Decode the Base64 first, then reverse tsae.",
    "The two steps produce east.",
  ),
  q(
    "The route home",
    "A hidden record stores a local URL. Read the value named word, then decode it.",
    "waypoint",
    [record("local-route", { href: "./?word=way%70oint#keep-going" })],
    "Find local-route’s href field.",
    "The word parameter is way%70oint.",
    "URL decoding yields waypoint.",
  ),

  // 181–200: multiple surfaces must be combined.
  q(
    "Two halves of one page",
    "The header has the beginning. The footer has the ending. Join the two attributes.",
    "sunflower",
    [
      a(".site-header", "data-beginning", "sun"),
      a(".site-footer", "data-ending", "flower"),
    ],
    "Inspect the outer header and footer.",
    "Join data-beginning, then data-ending.",
    "sun + flower gives sunflower.",
  ),
  q(
    "The shift lives elsewhere",
    "The coded note is below. Its rotation amount is a custom property above.",
    "paper",
    [
      c(".site-footer", `coded-note=${shift("paper", 3)}`),
      s(".site-header { --rotation-places: 3; }"),
    ],
    "Find the footer comment and --rotation-places on the header.",
    "Move the coded note back three letters.",
    "Shifting sdshu back three places gives paper.",
  ),
  q(
    "A key in the first fold",
    "The footer keeps a Vigenère message. Its key was folded into a header template.",
    "door",
    [
      h(".site-header", '<template id="folded-key"><b>KEY</b></template>'),
      record("folded-message", {
        payload: decodeText("DOOR", "vigenere-encode", { key: "KEY" }),
      }),
    ],
    "Inspect folded-key and folded-message.",
    "Use the template text KEY to decode the payload.",
    "Vigenère decryption with KEY yields DOOR.",
  ),
  q(
    "A mirror after the wrapping",
    "Unwrap the Base64 record, then reverse its alphabet.",
    "stone",
    [
      record("wrapped-mirror", {
        encoding: "base64 then atbash",
        payload: b64(decodeText("stone", "atbash")),
      }),
    ],
    "Find wrapped-mirror.",
    "Decode Base64 and then apply Atbash.",
    "The two layers reveal stone.",
  ),
  q(
    "The labels choose their order",
    "The footer has fragments. The notebook names their reading order.",
    "archive",
    [
      a(".notebook", "data-reading-order", "3,1,2"),
      hidden(
        "three-fragments",
        '<span data-piece="1">CHI</span><span data-piece="2">VE</span><span data-piece="3">AR</span>',
      ),
    ],
    "Inspect data-reading-order on the notebook and three-fragments below.",
    "Read pieces 3, 1, then 2.",
    "AR + CHI + VE gives ARCHIVE.",
  ),
  q(
    "The selected boxes",
    "Four footer children have data-state. Keep ready, then read in CSS order.",
    "fern",
    [
      exhibit(
        "ready-boxes",
        '<span class="ready4" data-state="ready">N</span><span data-state="wait">X</span><span class="ready1" data-state="ready">F</span><span class="ready3" data-state="ready">R</span><span class="ready2" data-state="ready">E</span>',
      ),
      s(
        '#ready-boxes{display:flex;gap:10px} #ready-boxes [data-state="wait"]{display:none} .ready1{order:1}.ready2{order:2}.ready3{order:3}.ready4{order:4}',
      ),
    ],
    'Filter to data-state="ready", then inspect order.',
    "Read ready1, ready2, ready3, ready4.",
    "The selected visual order is F E R N.",
  ),
  q(
    "An address points to a rule",
    "A header attribute names a CSS custom property. Read the word stored there.",
    "tendril",
    [
      a(".site-header", "data-property", "--buried-word"),
      s('body { --buried-word: "tendril"; }'),
    ],
    "Read data-property on the header.",
    "Find that exact property in the current-entry stylesheet.",
    "--buried-word holds tendril.",
  ),
  q(
    "A word borrowed by a description",
    "Follow the header’s described-by ID, then decode the referenced Base64 text.",
    "cinder",
    [
      a(".site-header", "aria-describedby", "encoded-description"),
      hidden("encoded-description", b64("cinder")),
    ],
    "Follow aria-describedby from the header.",
    "The description is Base64, not ordinary prose.",
    "The referenced text decodes to cinder.",
  ),
  q(
    "Two messages, one rule",
    "A JSON record names which field to decode. Only that field matters.",
    "spruce",
    [
      record("chosen-field", {
        read: "west",
        east: b64("wrong"),
        west: b64("spruce"),
        encoding: "base64",
      }),
    ],
    "Find chosen-field.",
    "The read property chooses west. Decode that value.",
    "The west field decodes to spruce.",
  ),
  q(
    "Quiet nodes in order",
    "Take the words from footer comments numbered 1–3. Join them without spaces.",
    "afterglow",
    [
      c(".site-footer", "piece 3: glow"),
      c(".site-footer", "piece 1: af"),
      c(".site-footer", "piece 2: ter"),
    ],
    "Read the numbered comments in the footer.",
    "Sort by the piece number instead of DOM order.",
    "af + ter + glow gives afterglow.",
  ),
  q(
    "The dimensions of a message",
    "A footer sample names letters with pixel widths. Use A = 1 through Z = 26, in DOM order.",
    "code",
    [
      exhibit(
        "dimension-message",
        '<span class="d1"></span><span class="d2"></span><span class="d3"></span><span class="d4"></span>',
      ),
      s(
        "#dimension-message{display:flex;gap:5px}.d1{width:3px}.d2{width:15px}.d3{width:4px}.d4{width:5px}#dimension-message span{height:6px;background:#9bad80}",
      ),
    ],
    "Inspect each span’s width in dimension-message.",
    "The widths are 3, 15, 4, and 5.",
    "Alphabet positions 3 15 4 5 spell CODE.",
  ),
  q(
    "Only the unpainted",
    "A footer sample sets opacity to zero on two distractors. Read the remaining DOM letters.",
    "opal",
    [
      exhibit(
        "opacity-message",
        '<span>O</span><span class="faded">X</span><span>P</span><span>A</span><span class="faded">Q</span><span>L</span>',
      ),
      s(
        "#opacity-message{display:flex;gap:8px}#opacity-message .faded{opacity:0}",
      ),
    ],
    "Inspect opacity-message’s children and their opacity.",
    "Skip X and Q, whose opacity is zero.",
    "The remaining letters spell OPAL.",
  ),
  q(
    "The third fold has a key",
    "An outer template says which nested template to read. Follow its ID.",
    "acorn",
    [
      h(
        ".site-footer",
        '<template id="fold-directory" data-read="fold-three"><template id="fold-one">reed</template><template id="fold-two">mist</template><template id="fold-three">acorn</template></template>',
      ),
    ],
    "Find fold-directory and read its data-read attribute.",
    "Expand the template with id fold-three.",
    "The chosen nested template contains acorn.",
  ),
  q(
    "A reversed byte record",
    "The bytes must be reordered before they become letters.",
    "glow",
    [record("reversed-bytes", { order: "reverse", hex: hex("wolg") })],
    "Find reversed-bytes.",
    "Reverse the byte pairs, then decode them as hexadecimal text.",
    "Reversed byte order spells glow.",
  ),
  q(
    "The first letters of the silent",
    "Take the first letter of each footer item whose hidden attribute is present, in DOM order.",
    "root",
    [
      h(
        ".site-footer",
        '<div id="silent-items"><span hidden>river</span><span class="sr-only">decoy</span><span hidden>oak</span><span hidden>orbit</span><span hidden>tide</span></div>',
      ),
    ],
    "Inspect silent-items; distinguish hidden from a CSS class.",
    "The hidden words are river, oak, orbit, tide.",
    "Their initial letters spell ROOT.",
  ),
  q(
    "Both filters apply",
    "A JSON record keeps only true flags, sorts by rank, and then applies ROT13.",
    "moth",
    [
      record("last-filter", [
        { rank: 3, ch: "G", keep: true },
        { rank: 0, ch: "X", keep: false },
        { rank: 1, ch: "Z", keep: true },
        { rank: 4, ch: "U", keep: true },
        { rank: 2, ch: "B", keep: true },
      ]),
    ],
    "Find last-filter.",
    "Filtering and sorting gives Z B G U. Apply ROT13.",
    "ROT13 of ZBGU is MOTH.",
  ),
  q(
    "The earlier names",
    "The first letters of six earlier answers form a word. A footer attribute keeps their entry numbers.",
    "shadow",
    [a(".site-footer", "data-ledger-reference", "112,106,122,166,120,121")],
    "Read the footer reference list, then revisit those solved answers.",
    "The words are shore, hollow, amber, dove, outside, and willow.",
    "Their initial letters spell SHADOW.",
  ),
  q(
    "A final small translation",
    "The head contains a word written one place ahead. The footer reminds you which way to turn.",
    "beyond",
    [
      meta("last-shift", shift("beyond", 1)),
      c(".site-footer", "last-shift: move every letter back one place"),
    ],
    "Combine last-shift metadata with the footer instruction.",
    "Use a Caesar shift of one backwards.",
    "The two surfaces yield beyond.",
  ),
  q(
    "The thread through the page",
    "A footer comment names six earlier doors. Take the first letter of each answer, in that order.",
    "window",
    [
      c(
        ".site-footer",
        "final reference order: 121 / 164 / 119 / 166 / 120 / 180",
      ),
    ],
    "Use the index to recover the six answers.",
    "They are willow, iris, nest, dove, outside, and waypoint.",
    "Their initial letters spell WINDOW.",
  ),
  q(
    "The page keeps its promise",
    "A final document note is split between the first and last surfaces. Join the words.",
    "keep looking",
    [
      c("head", "final promise, first word: keep"),
      c(".site-footer", "final promise, last word: looking"),
    ],
    "Inspect the comments in both the head and footer.",
    "The first word is keep. The last word is looking.",
    "The promise is KEEP LOOKING. Two hundred doors, and still another way of seeing.",
  ),
];
