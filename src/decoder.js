export function decodeText(value, method) {
  const text = value.trim();
  if (!text) return "";
  switch (method) {
    case "reverse":
      return [...text].reverse().join("");
    case "rot13":
      return shift(text, 13);
    case "caesar1":
      return shift(text, -1);
    case "caesar2":
      return shift(text, -2);
    case "base64": {
      const decoded = atob(text.replace(/\s/g, ""));
      return new TextDecoder().decode(
        Uint8Array.from(decoded, (char) => char.charCodeAt(0)),
      );
    }
    case "url":
      return decodeURIComponent(text);
    case "hex": {
      const compact = text.replace(/[\s%,]/g, "");
      if (!/^[0-9a-f]+$/i.test(compact) || compact.length % 2)
        throw new Error(
          "Use complete two-digit hexadecimal bytes, such as 4E 4F 54 45.",
        );
      return new TextDecoder().decode(
        Uint8Array.from(compact.match(/../g), (n) => parseInt(n, 16)),
      );
    }
    case "binary": {
      const compact = text.replace(/[\s,]/g, "");
      if (!/^[01]+$/.test(compact) || compact.length % 8)
        throw new Error("Use eight-bit binary bytes, such as 01001011.");
      return String.fromCharCode(
        ...compact.match(/.{8}/g).map((n) => parseInt(n, 2)),
      );
    }
    case "ascii":
    case "alphabet": {
      const numbers = text.split(/[\s,]+/);
      const alphabet = method === "alphabet";
      if (
        numbers.some(
          (n) =>
            !/^\d+$/.test(n) ||
            Number(n) < (alphabet ? 1 : 0) ||
            Number(n) > (alphabet ? 26 : 255),
        )
      ) {
        throw new Error(
          alphabet
            ? "Use alphabet positions from 1 to 26."
            : "Use decimal ASCII values from 0 to 255.",
        );
      }
      return String.fromCharCode(
        ...numbers.map((n) => Number(n) + (alphabet ? 64 : 0)),
      );
    }
    default:
      throw new Error("Choose a translation.");
  }
}

function shift(text, amount) {
  return text.replace(/[a-z]/gi, (char) => {
    const start = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - start + amount + 26) % 26) + start,
    );
  });
}
