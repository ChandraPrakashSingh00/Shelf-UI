// Combining diacritical marks left over after canonical decomposition (NFD).
const DIACRITICS = /[̀-ͯ]/g;

/**
 * Folds text for forgiving search: lowercase, without accents or other
 * diacritics, so "kolhapur" finds "Kolhāpur" and "cafe" finds "Café".
 */
export function normalizeSearchText(text) {
  return String(text).normalize("NFD").replace(DIACRITICS, "").toLowerCase();
}

/**
 * Finds the first case- and diacritic-insensitive occurrence of `query` in
 * `text` and returns its `[start, end)` range in the original `text`, or `null`
 * when the (trimmed) query is empty or not found. Used to highlight matches.
 */
export function findTextMatch(text, query) {
  const needle = normalizeSearchText(query).trim();
  if (needle === "" || typeof text !== "string") return null;

  // Folds one character at a time, remembering which original character every
  // folded unit came from, so a match maps back to the original string.
  let folded = "";
  const starts = [];
  const ends = [];
  for (let index = 0; index < text.length;) {
    const char = String.fromCodePoint(text.codePointAt(index));
    const foldedChar = normalizeSearchText(char);
    for (let unit = 0; unit < foldedChar.length; unit += 1) {
      starts.push(index);
      ends.push(index + char.length);
    }
    folded += foldedChar;
    index += char.length;
  }

  const start = folded.indexOf(needle);
  if (start === -1) return null;

  // Keep combining marks that follow the last matched letter inside the range.
  let end = ends[start + needle.length - 1];
  while (end < text.length) {
    const char = String.fromCodePoint(text.codePointAt(end));
    if (normalizeSearchText(char) !== "") break;
    end += char.length;
  }
  return [starts[start], end];
}

/**
 * Whether every word of `query` appears somewhere in `texts` (strings; other
 * values are ignored), case- and diacritic-insensitively. An empty query matches.
 */
export function matchesAllWords(texts, query) {
  const words = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeSearchText(texts.filter((text) => typeof text === "string").join("\n"));
  return words.every((word) => haystack.includes(word));
}
