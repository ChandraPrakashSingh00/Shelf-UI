import { describe, expect, it } from "vitest";
import tokensSource from "../../../src/styles/tokens.css?raw";
import { isColorValue, parseTokens } from "./tokens.js";

const css = `
/* File comment, outside any block. */
:root,
[data-cps-theme="light"] {
  /* Brand */
  --cps-blue: #086ffd;

  /* Typography */
  --cps-font:
    "Inter",
    sans-serif;
  --cps-text: var(--cps-blue);
}

[data-cps-theme="light"] {
  color-scheme: light;
}

[data-cps-theme="dark"] {
  color-scheme: dark;
  --cps-text: #f3f5f8;
}
`;

describe("parseTokens", () => {
  it("groups tokens by their comment and pairs light and dark values", () => {
    expect(parseTokens(css)).toEqual([
      { title: "Brand", tokens: [{ name: "--cps-blue", light: "#086ffd", dark: undefined }] },
      {
        title: "Typography",
        tokens: [
          { name: "--cps-font", light: '"Inter", sans-serif', dark: undefined },
          { name: "--cps-text", light: "var(--cps-blue)", dark: "#f3f5f8" },
        ],
      },
    ]);
  });

  it("reads every token in the library's stylesheet", () => {
    const groups = parseTokens(tokensSource);
    const names = groups.flatMap((group) => group.tokens.map((token) => token.name));
    expect(groups.map((group) => group.title)).toContain("Primary");
    expect(names).toContain("--cps-color-primary");
    expect(names.every((name) => name.startsWith("--cps-"))).toBe(true);

    const background = groups
      .flatMap((group) => group.tokens)
      .find((t) => t.name === "--cps-color-bg");
    expect(background?.dark).toBe("var(--cps-brand-dark)");
  });
});

describe("isColorValue", () => {
  it.each([
    ["#086ffd", true],
    ["rgba(8, 111, 253, 0.2)", true],
    ["var(--cps-brand-blue)", false],
    ["12px", false],
  ])("%s → %s", (value, expected) => {
    expect(isColorValue(value)).toBe(expected);
  });
});
