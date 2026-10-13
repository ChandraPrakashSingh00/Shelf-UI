import { describe, expect, it } from "vitest";
import { componentDocs } from "../content/components/index.js";
import { tokenize } from "./highlight.js";

const typesOf = (tokens, value) =>
  tokens.filter((token) => token.value === value).map((token) => token.type);

describe("tokenize", () => {
  it("reproduces every example's source exactly", () => {
    for (const doc of componentDocs) {
      for (const example of doc.examples) {
        const tokens = tokenize(example.code, "jsx");
        expect(tokens.map((token) => token.value).join("")).toBe(example.code);
      }
    }
  });

  it("highlights keywords, strings, JSX tags and attributes", () => {
    const tokens = tokenize(
      'import { Button } from "@shelf-ui/react";\n<Button variant="primary" loading>Save</Button>',
      "jsx",
    );

    expect(typesOf(tokens, "import")).toEqual(["keyword"]);
    expect(typesOf(tokens, '"@shelf-ui/react"')).toEqual(["string"]);
    // Imported name, opening tag, closing tag (after text).
    expect(typesOf(tokens, "Button")).toEqual(["type", "tag", "tag"]);
    expect(typesOf(tokens, "variant")).toEqual(["attr"]);
    expect(typesOf(tokens, '"primary"')).toEqual(["string"]);
  });

  it("keeps JSX text plain, even when it starts with a capital letter", () => {
    const tokens = tokenize(
      '<Navbar.Link href="#home" active>\n  Home\n</Navbar.Link>\n<Button>Open {option}</Button>',
      "jsx",
    );
    expect(tokens.filter((token) => token.type === "type")).toEqual([]);
    expect(typesOf(tokens, "Navbar.Link")).toEqual(["tag", "tag"]);
  });

  it("still highlights code after an arrow function", () => {
    const tokens = tokenize("onClick={() => setOpen(true)}>", "jsx");
    expect(typesOf(tokens, "setOpen")).toEqual(["function"]);
    expect(typesOf(tokens, "true")).toEqual(["keyword"]);
  });

  it("doesn't mistake comparisons for JSX tags", () => {
    const tokens = tokenize("if (a < b && c<d) {}\nconst full = items.length<Limit;", "jsx");
    expect(tokens.filter((token) => token.type === "tag")).toEqual([]);
    expect(typesOf(tokens, "Limit")).toEqual(["type"]);
  });

  it("highlights the JSX `type` attribute as an attribute", () => {
    const tokens = tokenize('<Button type="submit">Save</Button>', "jsx");
    expect(typesOf(tokens, "type")).toEqual(["attr"]);
  });

  it("highlights CSS custom properties, colors and functions", () => {
    const tokens = tokenize(
      ":root {\n  --shelf-color-primary: #086ffd;\n  --shelf-color-primary-hover: color-mix(in srgb, #086ffd 88%, black);\n}",
      "css",
    );
    expect(typesOf(tokens, "--shelf-color-primary")).toEqual(["property"]);
    expect(typesOf(tokens, "#086ffd")).toEqual(["number", "number"]);
    expect(typesOf(tokens, "color-mix")).toEqual(["function"]);
  });

  it("highlights package manager commands and comments in shell snippets", () => {
    const tokens = tokenize("npm install @shelf-ui/react # add the package", "bash");
    expect(tokens[0]).toEqual({ type: "function", value: "npm" });
    expect(tokens.at(-1)).toEqual({ type: "comment", value: "# add the package" });
  });
});
