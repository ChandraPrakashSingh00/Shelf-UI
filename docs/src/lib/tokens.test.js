import { describe, expect, it } from "vitest";
import tokensSource from "../../../src/styles/tokens.css?raw";
import { isColorValue, parseTokens } from "./tokens.js";

const css = `
/* File comment, outside any block. */
:root,
[data-shelf-theme="light"] {
  /* Brand */
  --shelf-blue: #086ffd;

  /* Typography */
  --shelf-font:
    "Inter",
    sans-serif;
  --shelf-text: var(--shelf-blue);
}

[data-shelf-theme="light"] {
  color-scheme: light;
}

[data-shelf-theme="dark"] {
  color-scheme: dark;
  --shelf-text: #f3f5f8;
}
`;

describe("parseTokens", () => {
  it("groups tokens by their comment and pairs light and dark values", () => {
    expect(parseTokens(css)).toEqual([
      { title: "Brand", tokens: [{ name: "--shelf-blue", light: "#086ffd", dark: undefined }] },
      {
        title: "Typography",
        tokens: [
          { name: "--shelf-font", light: '"Inter", sans-serif', dark: undefined },
          { name: "--shelf-text", light: "var(--shelf-blue)", dark: "#f3f5f8" },
        ],
      },
    ]);
  });

  it("reads every token in the library's stylesheet", () => {
    const groups = parseTokens(tokensSource);
    const names = groups.flatMap((group) => group.tokens.map((token) => token.name));
    expect(groups.map((group) => group.title)).toContain("Primary");
    expect(names).toContain("--shelf-color-primary");
    expect(names.every((name) => name.startsWith("--shelf-"))).toBe(true);

    const background = groups
      .flatMap((group) => group.tokens)
      .find((t) => t.name === "--shelf-color-bg");
    expect(background?.dark).toBe("var(--shelf-brand-dark)");
  });
});

describe("isColorValue", () => {
  it.each([
    ["#086ffd", true],
    ["rgba(8, 111, 253, 0.2)", true],
    ["var(--shelf-brand-primary)", false],
    ["12px", false],
  ])("%s → %s", (value, expected) => {
    expect(isColorValue(value)).toBe(expected);
  });
});
