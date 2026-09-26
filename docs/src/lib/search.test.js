import { describe, expect, it } from "vitest";
import { searchIndex } from "../content/searchIndex.js";
import { searchEntries } from "./search.js";

const titles = (query) => searchEntries(searchIndex, query).map((entry) => entry.title);

describe("searchEntries", () => {
  it("ranks the component whose name matches first", () => {
    expect(titles("button")[0]).toBe("Button");
    expect(titles("tab")[0]).toBe("Tabs");
    expect(titles("BADGE")[0]).toBe("Badge");
  });

  it("finds components by keyword and by prop name", () => {
    expect(titles("dialog")[0]).toBe("Modal");
    expect(titles("snackbar")[0]).toBe("Toast");
    expect(titles("helperText")).toContain("Input");
  });

  it("requires every word of the query to match", () => {
    expect(titles("button loading")).toEqual(expect.arrayContaining(["Button", "Loading"]));
    expect(titles("button qwerty")).toEqual([]);
  });

  it("finds guide sections and examples", () => {
    expect(titles("dark")[0]).toBe("Dark mode");
    expect(titles("nextjs")[0]).toBe("Next.js");
    const example = searchEntries(searchIndex, "validation")[0];
    expect(example).toMatchObject({ section: "Input", href: "/components/input#validation" });
  });

  it("shows installation and every component for an empty query", () => {
    const results = searchEntries(searchIndex, "   ");
    expect(results[0]?.title).toBe("Installation");
    expect(results.slice(1, 11).map((entry) => entry.section)).toEqual(
      Array(10).fill("Components"),
    );
  });
});
