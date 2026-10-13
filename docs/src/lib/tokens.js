const LIGHT_BLOCK = /:root,\s*\[data-shelf-theme="light"\]\s*\{/;
const DARK_BLOCK = /\[data-shelf-theme="dark"\]\s*\{/;
const ENTRY = /\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]+);/g;

function blockBody(css, start) {
  const match = start.exec(css);
  if (!match) return "";
  const from = match.index + match[0].length;
  return css.slice(from, css.indexOf("}", from));
}

const squash = (value) => value.replace(/\s+/g, " ").trim();

/**
 * Reads the library's tokens.css into groups of tokens. Each group is
 * `{ title, tokens }`, titled by the comment above its declarations in the
 * light theme; each token is `{ name, light, dark }`, where `dark` is the
 * dark theme's override (or `undefined` when the light value applies).
 */
export function parseTokens(css) {
  const dark = new Map();
  for (const match of blockBody(css, DARK_BLOCK).matchAll(ENTRY)) {
    if (match[2]) dark.set(match[2], squash(match[3]));
  }

  const groups = [];
  for (const match of blockBody(css, LIGHT_BLOCK).matchAll(ENTRY)) {
    if (match[1] !== undefined) {
      groups.push({ title: squash(match[1]), tokens: [] });
      continue;
    }
    if (groups.length === 0) groups.push({ title: "Tokens", tokens: [] });
    groups
      .at(-1)
      .tokens.push({ name: match[2], light: squash(match[3]), dark: dark.get(match[2]) });
  }
  return groups.filter((group) => group.tokens.length > 0);
}

/** Whether a token value is a literal color that can be shown as a swatch. */
export function isColorValue(value) {
  return /^(#[0-9a-f]{3,8}|rgba?\(.+\)|hsla?\(.+\))$/i.test(value);
}
