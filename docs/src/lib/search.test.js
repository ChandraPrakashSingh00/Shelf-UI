import { describe, expect, it } from "vitest";
import { searchIndex } from "../content/searchIndex.js";
import { searchEntries } from "./search.js";

const titles = (query) => searchEntries(searchIndex, query).map((entry) => entry.title);

describe("searchEntries", () => {
  it("ranks the component whose name matches first", () => {
    expect(titles("button")[0]).toBe("Button");
    expect(titles("tabs")[0]).toBe("Tabs");
    expect(titles("table")[0]).toBe("Table");
    expect(titles("BADGE")[0]).toBe("Badge");
  });

  it("finds components by keyword and by prop name", () => {
    expect(titles("lightbox")[0]).toBe("Modal");
    expect(titles("dialog")).toEqual(expect.arrayContaining(["AlertDialog", "Modal"]));
    expect(titles("snackbar")[0]).toBe("Toast");
    expect(titles("helperText")).toContain("Input");
  });

  it("requires every word of the query to match", () => {
    expect(titles("button loading")).toEqual(expect.arrayContaining(["Button", "Loading"]));
    expect(titles("button qwerty")).toEqual([]);
  });

  it("finds docs pages, guide sections, articles and examples", () => {
    expect(titles("dark")[0]).toBe("Dark mode");
    expect(titles("nextjs")[0]).toBe("Next.js");
    expect(titles("tailwind")[0]).toBe("Tailwind CSS");
    expect(titles("tokens")).toContain("Design tokens");
    expect(searchEntries(searchIndex, "sign-in")[0]).toMatchObject({
      category: "Blog",
      href: "/blog/sign-in-screen-with-vite",
    });
    const example = searchEntries(searchIndex, "validation")[0];
    expect(example).toMatchObject({ section: "Input", href: "/components/input#validation" });
  });

  it("shows getting started and every component for an empty query", () => {
    const results = searchEntries(searchIndex, "   ");
    expect(results.slice(0, 2).map((entry) => entry.title)).toEqual([
      "Introduction",
      "Installation",
    ]);
    expect(results.slice(2, 12).map((entry) => entry.section)).toEqual(
      Array(10).fill("Components"),
    );
  });

  it("gives every entry a category for the search page filters", () => {
    expect(searchIndex.every((entry) => typeof entry.category === "string")).toBe(true);
    expect(searchEntries(searchIndex, "button")[0]?.category).toBe("Actions");
  });
});
