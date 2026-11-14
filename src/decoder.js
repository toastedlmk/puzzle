const MORSE = Object.freeze({
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
});
const FROM_MORSE = Object.fromEntries(
  Object.entries(MORSE).map(([letter, code]) => [code, letter]),
);
const NATO = [
  "Alfa",
  "Bravo",
  "Charlie",
  "Delta",
  "Echo",
  "Foxtrot",
  "Golf",
  "Hotel",
  "India",
  "Juliett",
  "Kilo",
  "Lima",
  "Mike",
  "November",
  "Oscar",
  "Papa",
  "Quebec",
  "Romeo",
  "Sierra",
  "Tango",
  "Uniform",
  "Victor",
  "Whiskey",
  "X-ray",
  "Yankee",
  "Zulu",
];
const NATO_DIGITS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const FROM_NATO = Object.fromEntries([
  ...NATO.map((word, i) => [
    word.toLowerCase().replace("-", ""),
    String.fromCharCode(65 + i),
  ]),
  ...NATO_DIGITS.map((word, i) => [word.toLowerCase(), String(i)]),
  ["alpha", "A"],
  ["juliet", "J"],
]);
const POLYBIUS = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  middot: "·",
  bull: "•",
  times: "×",
  divide: "÷",
};

export function decodeText(value, method, options = {}) {
  const text = String(value).trim();
  if (!text) return "";
  switch (method) {
    case "morse":
      return decodeMorse(text);
    case "morse-encode":
      return mapWords(text, (letter) => {
        if (!MORSE[letter])
          throw new Error(
            `Morse code does not support “${letter}”. Use letters, numbers, or common punctuation.`,
          );
        return MORSE[letter];
      });
    case "reverse":
      return [...text].reverse().join("");
    case "rot13":
      return shift(text, 13);
    case "caesar1":
      return shift(text, -1);
    case "caesar2":
      return shift(text, -2);
    case "rotate": {
      const amount = Number(options.shift ?? 13);
      if (!Number.isInteger(amount) || amount < 0 || amount > 26)
        throw new Error("Choose a whole-number rotation from 0 to 26.");
      if (!["forward", "backward", undefined].includes(options.direction))
        throw new Error("Choose forward or backward rotation.");
      return shift(text, options.direction === "forward" ? amount : -amount);
    }
    case "atbash":
      return text.replace(/[a-z]/gi, (char) => {
        const start = char <= "Z" ? 65 : 97;
        return String.fromCharCode(start + 25 - (char.charCodeAt(0) - start));
      });
    case "vigenere":
    case "vigenere-encode": {
      const key = String(options.key || "")
        .trim()
        .toUpperCase();
      if (!/^[A-Z]+$/.test(key))
        throw new Error("Enter a Vigenère key using letters A–Z only.");
      let index = 0;
      return text.replace(/[a-z]/gi, (char) => {
        const amount = key.charCodeAt(index++ % key.length) - 65;
        return shift(char, method === "vigenere" ? -amount : amount);
      });
    }
    case "bacon": {
      const bits = text
        .toUpperCase()
        .replace(/A/g, "0")
        .replace(/B/g, "1")
        .replace(/\s/g, "");
      if (!/^[01]+$/.test(bits) || bits.length % 5)
        throw new Error(
          "Use five-bit groups, such as 00001 or AAAAB (A = 0, B = 1).",
        );
      const values = bits.match(/.{5}/g).map((n) => parseInt(n, 2));
      if (values.some((n) => n > 25))
        throw new Error(
          "Five-bit alphabet values must be between 0 (A) and 25 (Z).",
        );
      return values.map((n) => String.fromCharCode(65 + n)).join("");
    }
    case "polybius":
      return text
        .split(/\s*\/\s*/)
        .map((word) => {
          const digits = word.replace(/[\s,.·-]/g, "");
          if (!/^[1-5]+$/.test(digits) || digits.length % 2)
            throw new Error(
              "Use row-column pairs from 11 to 55, such as 13 31 45 15.",
            );
          return digits
            .match(/../g)
            .map(
              (pair) =>
                POLYBIUS[(Number(pair[0]) - 1) * 5 + Number(pair[1]) - 1],
            )
            .join("");
        })
        .join(" ");
    case "rail2": {
      const compact = [...text.replace(/[\s|]/g, "")];
      const middle = Math.ceil(compact.length / 2);
      const first = compact.slice(0, middle),
        second = compact.slice(middle);
      return first.map((char, i) => char + (second[i] || "")).join("");
    }
    case "nato":
      return text
        .split(/\s*\/\s*/)
        .map((word) =>
          word
            .split(/[\s,]+/)
            .map((token) => {
              const name = token.toLowerCase().replace("-", "");
              if (!Object.hasOwn(FROM_NATO, name))
                throw new Error(
                  `“${token}” is not a NATO phonetic word. Try Alfa, Bravo, or Charlie.`,
                );
              return FROM_NATO[name];
            })
            .join(""),
        )
        .join(" ");
    case "nato-encode":
      return mapWords(text, (letter) => {
        if (/^[A-Z]$/.test(letter)) return NATO[letter.charCodeAt(0) - 65];
        if (/^\d$/.test(letter)) return NATO_DIGITS[Number(letter)];
        throw new Error("Use letters and digits for NATO phonetic encoding.");
      });
    case "base64": {
      const decoded = atob(text.replace(/\s/g, ""));
      return decodeBytes(
        Uint8Array.from(decoded, (char) => char.charCodeAt(0)),
      );
    }
    case "base64-encode":
      return btoa(
        Array.from(new TextEncoder().encode(text), (n) =>
          String.fromCharCode(n),
        ).join(""),
      );
    case "url":
      return decodeURIComponent(text);
    case "url-encode":
      return encodeURIComponent(text);
    case "hex": {
      const compact = text.replace(/\b0x/gi, "").replace(/[\s%,]/g, "");
      if (!/^[0-9a-f]+$/i.test(compact) || compact.length % 2)
        throw new Error(
          "Use complete two-digit hexadecimal bytes, such as 4E 4F 54 45.",
        );
      return decodeBytes(
        Uint8Array.from(compact.match(/../g), (n) => parseInt(n, 16)),
      );
    }
    case "binary": {
      const compact = text.replace(/\b0b/gi, "").replace(/[\s,]/g, "");
      if (!/^[01]+$/.test(compact) || compact.length % 8)
        throw new Error("Use eight-bit binary bytes, such as 01001011.");
      return decodeBytes(
        Uint8Array.from(compact.match(/.{8}/g), (n) => parseInt(n, 2)),
      );
    }
    case "octal": {
      const compact = text.replace(/[\s,]/g, "");
      if (!/^[0-7]+$/.test(compact) || compact.length % 3)
        throw new Error("Use three-digit octal bytes from 000 to 377.");
      const bytes = compact.match(/.{3}/g).map((n) => parseInt(n, 8));
      if (bytes.some((n) => n > 255))
        throw new Error("Octal bytes must be between 000 and 377.");
      return decodeBytes(Uint8Array.from(bytes));
    }
    case "binary-encode":
      return encodeBytes(text, 2, 8);
    case "hex-encode":
      return encodeBytes(text, 16, 2).toUpperCase();
    case "ascii-encode":
      return Array.from(new TextEncoder().encode(text)).join(" ");
    case "ascii": {
      const numbers = text.split(/[\s,]+/);
      if (numbers.some((n) => !/^\d+$/.test(n) || Number(n) > 255)) {
        throw new Error("Use decimal ASCII values from 0 to 255.");
      }
      return decodeBytes(Uint8Array.from(numbers, Number));
    }
    case "alphabet":
    case "alphabet0": {
      const offset = method === "alphabet0" ? 0 : 1;
      return text
        .split(/\s*\/\s*/)
        .map((word) => {
          const numbers = word.split(/[\s,]+/);
          if (
            numbers.some(
              (n) =>
                !/^\d+$/.test(n) ||
                Number(n) < offset ||
                Number(n) > 25 + offset,
            )
          )
            throw new Error(
              `Use alphabet positions from ${offset} to ${25 + offset}.`,
            );
          return numbers
            .map((n) => String.fromCharCode(Number(n) + 65 - offset))
            .join("");
        })
        .join(" ");
    }
    case "alphabet-encode":
      return mapWords(text, (letter) => {
        if (!/^[A-Z]$/.test(letter))
          throw new Error("Use letters A–Z for alphabet-position encoding.");
        return String(letter.charCodeAt(0) - 64);
      });
    case "roman": {
      const roman = text.toUpperCase();
      if (
        !/^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(
          roman,
        )
      )
        throw new Error("Enter one valid Roman numeral from I to MMMCMXCIX.");
      const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      return String(
        [...roman].reduce(
          (sum, char, i) =>
            sum +
            (values[char] < (values[roman[i + 1]] || 0)
              ? -values[char]
              : values[char]),
          0,
        ),
      );
    }
    case "roman-encode": {
      let n = Number(text);
      if (!/^\d+$/.test(text) || !Number.isInteger(n) || n < 1 || n > 3999)
        throw new Error("Enter a whole number from 1 to 3999.");
      let roman = "";
      for (const [value, letters] of [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"],
      ]) {
        while (n >= value) {
          roman += letters;
          n -= value;
        }
      }
      return roman;
    }
    case "html":
      return text.replace(/&([^\s&;]+);/g, (entity, name) => {
        if (name[0] !== "#") {
          if (Object.hasOwn(ENTITIES, name.toLowerCase()))
            return ENTITIES[name.toLowerCase()];
          throw new Error(
            `Unsupported named entity ${entity}. Use numeric entities or common names such as &amp;.`,
          );
        }
        const hex = /^#x[0-9a-f]+$/i.test(name),
          decimal = /^#\d+$/.test(name);
        const code = hex
          ? parseInt(name.slice(2), 16)
          : decimal
            ? Number(name.slice(1))
            : NaN;
        if (
          !Number.isInteger(code) ||
          code < 1 ||
          code > 0x10ffff ||
          (code >= 0xd800 && code <= 0xdfff)
        )
          throw new Error(`Invalid character entity ${entity}.`);
        return String.fromCodePoint(code);
      });
    default:
      throw new Error("Choose a translation.");
  }
}

function mapWords(text, mapper) {
  return text
    .toUpperCase()
    .split(/\s+/)
    .map((word) => [...word].map(mapper).join(" "))
    .join(" / ");
}

function decodeMorse(text) {
  const normalized = text
    .replace(/[·•∙⋅]/g, ".")
    .replace(/[‐‑‒–—−_]/g, "-")
    .replace(/…/g, "...")
    .replace(/\s*\/\s*/g, "/")
    .replace(/[ \t]{3,}|\r?\n/g, "/");
  if (/[^.\-/\s]/.test(normalized))
    throw new Error(
      "Use Morse dots and dashes, spaces between letters, and / between words.",
    );
  return normalized
    .split(/\s*\/\s*/)
    .map((word) => {
      if (!word.trim())
        throw new Error("Put Morse letters between word separators.");
      return word
        .trim()
        .split(/\s+/)
        .map((code) => {
          if (!FROM_MORSE[code])
            throw new Error(
              `Unknown Morse group “${code}”. Separate each letter with a space.`,
            );
          return FROM_MORSE[code];
        })
        .join("");
    })
    .join(" ");
}

function decodeBytes(bytes) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error(
      "These bytes are not valid UTF-8 text. Check the byte values and order.",
    );
  }
}

function encodeBytes(text, radix, width) {
  return Array.from(new TextEncoder().encode(text), (byte) =>
    byte.toString(radix).padStart(width, "0"),
  ).join(" ");
}

function shift(text, amount) {
  return text.replace(/[a-z]/gi, (char) => {
    const start = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - start + amount + 26) % 26) + start,
    );
  });
}
