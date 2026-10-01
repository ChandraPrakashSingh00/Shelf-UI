import { describe, expect, it } from "vitest";
import { findTextMatch, matchesAllWords, normalizeSearchText } from "./textSearch.js";

describe("normalizeSearchText", () => {
  it("lowercases text and strips diacritics", () => {
    expect(normalizeSearchText("Kolhāpur")).toBe("kolhapur");
    expect(normalizeSearchText("CAFÉ Crème")).toBe("cafe creme");
    expect(normalizeSearchText("São Tomé")).toBe("sao tome");
  });

  it("leaves other scripts intact and accepts non-strings", () => {
    expect(normalizeSearchText("मुंबई")).toBe("मुंबई".normalize("NFD"));
    expect(normalizeSearchText(1042)).toBe("1042");
  });
});

describe("findTextMatch", () => {
  it("returns the range of the first case-insensitive match", () => {
    expect(findTextMatch("Navi Mumbai", "mum")).toEqual([5, 8]);
    expect(findTextMatch("Mumbai", "MUMBAI")).toEqual([0, 6]);
  });

  it("maps matches on folded text back to the original characters", () => {
    // "ā" is one character; the match covers it whole.
    expect(findTextMatch("Kolhāpur", "hapu")).toEqual([3, 7]);
    // A decomposed "é" (e + combining accent) stays in the highlighted range.
    const decomposed = "Café Day";
    const [start, end] = findTextMatch(decomposed, "café");
    expect(decomposed.slice(start, end)).toBe("Café");
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(findTextMatch("Pune", "  pu ")).toEqual([0, 2]);
  });

  it("returns null for an empty query, no match or a non-string text", () => {
    expect(findTextMatch("Delhi", "")).toBeNull();
    expect(findTextMatch("Delhi", "   ")).toBeNull();
    expect(findTextMatch("Delhi", "mum")).toBeNull();
    expect(findTextMatch(null, "mum")).toBeNull();
  });
});

describe("matchesAllWords", () => {
  const texts = ["Export orders", "Download a CSV of this month's orders", undefined, 42];

  it("matches when every word appears in any of the texts", () => {
    expect(matchesAllWords(texts, "orders csv")).toBe(true);
    expect(matchesAllWords(texts, "EXP month")).toBe(true);
  });

  it("fails when any word is missing", () => {
    expect(matchesAllWords(texts, "orders pdf")).toBe(false);
  });

  it("ignores non-string values, diacritics and extra spaces", () => {
    expect(matchesAllWords(texts, "42")).toBe(false);
    expect(matchesAllWords(["Crème brûlée"], "  creme   brulee ")).toBe(true);
  });

  it("matches everything for an empty query", () => {
    expect(matchesAllWords(texts, "")).toBe(true);
    expect(matchesAllWords([], "  ")).toBe(true);
  });
});
