import test from "node:test";
import assert from "node:assert/strict";
import { decodeText } from "../src/decoder.js";
import { translationMethods } from "../src/translation-methods.js";

test("every listed translator has a verified known-answer example", () => {
  const cases = [
    ["morse", "... --- ...", "SOS"],
    ["morse-encode", "sos", "... --- ..."],
    ["rotate", "FRPERG", "SECRET"],
    ["rot13", "FRPERG", "SECRET"],
    ["caesar1", "EPPS", "DOOR"],
    ["caesar2", "RCRGT", "PAPER"],
    ["atbash", "NVHHZTV", "MESSAGE"],
    ["vigenere", "YTCX", "OPEN", { key: "KEY" }],
    ["vigenere-encode", "OPEN", "YTCX", { key: "KEY" }],
    ["bacon", "00001 00100 00000 00011", "BEAD"],
    ["polybius", "13 · 31 · 45 · 15", "CLUE"],
    ["rail2", "SCE | ERT", "SECRET"],
    ["nato", "Lima Oscar Charlie Kilo", "LOCK"],
    ["nato-encode", "LOCK", "Lima Oscar Charlie Kilo"],
    ["binary", "01001011 01000101 01011001", "KEY"],
    ["binary-encode", "KEY", "01001011 01000101 01011001"],
    ["hex", "0x4E 0x4F 0x54 0x45", "NOTE"],
    ["hex-encode", "NOTE", "4E 4F 54 45"],
    ["ascii", "83 72 69 76 70", "SHELF"],
    ["ascii-encode", "SHELF", "83 72 69 76 70"],
    ["octal", "113 105 131", "KEY"],
    ["alphabet", "16 1 20 8", "PATH"],
    ["alphabet0", "1 4 0 3", "BEAD"],
    ["alphabet-encode", "PATH", "16 1 20 8"],
    ["roman", "XIV", "14"],
    ["roman-encode", "14", "XIV"],
    ["base64", "b3Blbg==", "open"],
    ["base64-encode", "open", "b3Blbg=="],
    ["url", "%6d%61%72%67%69%6e", "margin"],
    ["url-encode", "a clue", "a%20clue"],
    ["html", "&#107;&#101;&#121;", "key"],
    ["reverse", "wodniw", "window"],
  ];
  for (const [method, input, expected, options] of cases)
    assert.equal(decodeText(input, method, options), expected, method);
  assert.equal(new Set(translationMethods.map((m) => m.id)).size, 32);
  assert.deepEqual(
    new Set(cases.map((c) => c[0])),
    new Set(translationMethods.map((m) => m.id)),
  );
});

test("Morse supports the exact puzzle symbols, word breaks, digits, and punctuation", () => {
  assert.equal(decodeText("···  ———  ···", "morse"), "SOS");
  assert.equal(decodeText("... --- ...   .--. .- --. .", "morse"), "SOS PAGE");
  assert.equal(
    decodeText("... --- ...   /   .--. .- --. .", "morse"),
    "SOS PAGE",
  );
  assert.equal(decodeText("... --- ...\n.--. .- --. .", "morse"), "SOS PAGE");
  const message = "HELLO, WORLD! 123 / 456 (OK)?";
  assert.equal(
    decodeText(decodeText(message, "morse-encode"), "morse"),
    message,
  );
  assert.equal(decodeText("-.. --- --- .-.", "morse"), "DOOR");
});

test("rotations wrap correctly in both directions; Vigenere advances only on letters", () => {
  assert.equal(
    decodeText("Abc Xyz!", "rotate", { shift: 3, direction: "backward" }),
    "Xyz Uvw!",
  );
  assert.equal(
    decodeText("Abc Xyz!", "rotate", { shift: 3, direction: "forward" }),
    "Def Abc!",
  );
  assert.equal(decodeText("Abc Xyz!", "rotate", { shift: 26 }), "Abc Xyz!");
  assert.equal(decodeText("Abc Xyz!", "rotate", { shift: 0 }), "Abc Xyz!");
  assert.equal(
    decodeText("LXFOPV EF RNHR", "vigenere", { key: "LEMON" }),
    "ATTACK AT DAWN",
  );
  assert.equal(decodeText("Y T C X", "vigenere", { key: "KEY" }), "O P E N");
  assert.equal(decodeText("AAAAB AABAA AAAAA AAABB", "bacon"), "BEAD");
  assert.equal(decodeText("Alpha Juliet X-ray / Nine", "nato"), "AJX 9");
});

test("byte encoders round trip Unicode and Roman numerals cover subtractive boundaries", () => {
  const text = "Grüße ☕";
  for (const [encode, decode] of [
    ["binary-encode", "binary"],
    ["hex-encode", "hex"],
    ["ascii-encode", "ascii"],
    ["base64-encode", "base64"],
    ["url-encode", "url"],
  ]) {
    assert.equal(decodeText(decodeText(text, encode), decode), text, encode);
  }
  for (const number of [1, 4, 9, 40, 90, 400, 900, 1994, 3999]) {
    assert.equal(
      decodeText(decodeText(String(number), "roman-encode"), "roman"),
      String(number),
    );
  }
  assert.equal(decodeText("&#x1F9E9; &lt; &amp;", "html"), "🧩 < &");
});

test("invalid codes, parameters, and byte sequences produce useful errors", () => {
  for (const [method, input, options] of [
    ["morse", "... nope"],
    ["morse", "......"],
    ["morse", "/ ..."],
    ["morse-encode", "☕"],
    ["rotate", "hello", { shift: -1 }],
    ["rotate", "hello", { shift: 27 }],
    ["rotate", "hello", { shift: 1.5 }],
    ["rotate", "hello", { shift: NaN }],
    ["vigenere", "YTCX", { key: "" }],
    ["vigenere", "YTCX", { key: "K3Y" }],
    ["bacon", "11111"],
    ["bacon", "0001"],
    ["polybius", "66"],
    ["polybius", "123"],
    ["nato", "constructor"],
    ["roman", "IIII"],
    ["roman", "MMMM"],
    ["roman-encode", "0"],
    ["roman-encode", "4000"],
    ["octal", "400"],
    ["binary", "11111111"],
    ["hex", "FF"],
    ["ascii", "255"],
    ["html", "&#xGG;"],
    ["html", "&#xD800;"],
    ["html", "&#1114112;"],
    ["alphabet0", "26"],
  ])
    assert.throws(
      () => decodeText(input, method, options),
      undefined,
      `${method}: ${input}`,
    );
});
