const STRING = String.raw`"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'`;

const JSX_KEYWORDS = [
  "import", "from", "export", "default", "const", "let", "var", "function", "return",
  "if", "else", "for", "of", "in", "new", "extends", "as", "async", "await", "typeof",
  "null", "undefined", "true", "false", "void",
].join("|");

// Order matters: the first rule that matches at the current position wins.
// Every pattern is sticky (`y`), so it only matches at `lastIndex`.
const RULES = {
  jsx: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    // JSX text: after a tag's `>`, up to the next tag or `{expression}`. Code
    // characters are excluded so `=>` and comparisons aren't mistaken for text.
    ["plain", /(?<=>)[^<>{}();=]+(?=[<{])/y],
    ["string", new RegExp(`${STRING}|\`(?:[^\`\\\\]|\\\\.)*\``, "y")],
    ["keyword", new RegExp(`\\b(?:${JSX_KEYWORDS})\\b`, "y")],
    // A JSX tag name follows `</`, or a `<` that isn't preceded by an identifier
    // (which would make it a comparison like `count<limit`).
    ["tag", /(?<=<\/|(?:^|[^\w$)\]])<)[A-Za-z][\w.]*/y],
    ["attr", /[A-Za-z_$][\w$-]*(?==)/y],
    ["function", /[a-z_$][\w$]*(?=\()/y],
    ["type", /[A-Z][\w$]*/y],
    ["plain", /[a-z_$][\w$]*/y],
    ["number", /\d[\d_]*(?:\.\d+)?/y],
    ["punctuation", /[{}()[\];,.<>/=+\-*!?:&|]/y],
  ],
  css: [
    ["comment", /\/\*[\s\S]*?\*\//y],
    ["string", new RegExp(STRING, "y")],
    ["keyword", /@[\w-]+/y],
    ["property", /-{0,2}[A-Za-z][\w-]*(?=\s*:(?!:))/y],
    ["function", /[A-Za-z-]+(?=\()/y],
    ["number", /#[\dA-Fa-f]{3,8}\b|\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|vh|vw)?/y],
    ["plain", /[A-Za-z_-][\w-]*/y],
    ["punctuation", /[{}():;,.[\]=>+~*]/y],
  ],
  bash: [
    ["comment", /#[^\n]*/y],
    ["string", new RegExp(STRING, "y")],
    ["function", /\b(?:npm|npx|pnpm|yarn|bun)\b/y],
    ["plain", /[^\s#"']+/y],
  ],
};

function push(tokens, type, value) {
  const last = tokens[tokens.length - 1];
  // Merge runs of the same low-importance token to keep the DOM small.
  if (last && last.type === type && (type === "plain" || type === "punctuation")) {
    last.value += value;
  } else {
    tokens.push({ type, value });
  }
}

/**
 * Splits source code into `{ type, value }` tokens for syntax highlighting.
 * `language` is "jsx", "css" or "bash". It is a small, dependency-free
 * highlighter tuned for the snippets in these docs; joining every token's
 * `value` always reproduces the input exactly.
 */
export function tokenize(code, language) {
  const rules = RULES[language];
  const tokens = [];
  let index = 0;

  while (index < code.length) {
    let matched = false;
    for (const [type, pattern] of rules) {
      pattern.lastIndex = index;
      const match = pattern.exec(code);
      if (match && match[0].length > 0) {
        push(tokens, type, match[0]);
        index += match[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      push(tokens, "plain", code.charAt(index));
      index += 1;
    }
  }

  return tokens;
}
