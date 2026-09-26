import { describe, expect, it } from "vitest";
import { clampPage, getPageCount, getPaginationItems } from "./pagination.js";

const items = (page, totalPages, options = {}) =>
  getPaginationItems({ page, totalPages, ...options });

describe("getPaginationItems", () => {
  it("lists every page when they all fit", () => {
    expect(items(1, 1)).toEqual([1]);
    expect(items(2, 2)).toEqual([1, 2]);
    expect(items(3, 5)).toEqual([1, 2, 3, 4, 5]);
    // With the defaults, 7 slots: 2 boundary pages, 3 around the current page, 2 gaps.
    expect(items(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the end while the current page is near the start", () => {
    expect(items(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(items(3, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(items(1, 8)).toEqual([1, 2, 3, 4, 5, "ellipsis", 8]);
  });

  it("collapses both sides while the current page is in the middle", () => {
    expect(items(5, 20)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 20]);
    expect(items(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
    expect(items(16, 20)).toEqual([1, "ellipsis", 15, 16, 17, "ellipsis", 20]);
  });

  it("collapses the start while the current page is near the end", () => {
    expect(items(18, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
    expect(items(20, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
  });

  it("shows a page instead of an ellipsis that would hide only that page", () => {
    expect(items(4, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(items(17, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
  });

  it("shows siblingCount pages on each side of the current page", () => {
    expect(items(10, 20, { siblingCount: 0 })).toEqual([1, "ellipsis", 10, "ellipsis", 20]);
    expect(items(10, 20, { siblingCount: 2 })).toEqual([
      1,
      "ellipsis",
      8,
      9,
      10,
      11,
      12,
      "ellipsis",
      20,
    ]);
    expect(items(1, 20, { siblingCount: 2 })).toEqual([1, 2, 3, 4, 5, 6, 7, "ellipsis", 20]);
  });

  it("always shows boundaryCount pages at each end", () => {
    expect(items(10, 20, { boundaryCount: 2 })).toEqual([
      1,
      2,
      "ellipsis",
      9,
      10,
      11,
      "ellipsis",
      19,
      20,
    ]);
    expect(items(10, 20, { boundaryCount: 0 })).toEqual(["ellipsis", 9, 10, 11, "ellipsis"]);
    expect(items(1, 20, { boundaryCount: 0 })).toEqual([1, 2, 3, 4, "ellipsis"]);
    expect(items(10, 20, { boundaryCount: 0, siblingCount: 0 })).toEqual([
      "ellipsis",
      10,
      "ellipsis",
    ]);
  });

  it("keeps a stable length and a consistent shape for every page", () => {
    for (let totalPages = 1; totalPages <= 30; totalPages += 1) {
      for (const siblingCount of [0, 1, 2]) {
        for (const boundaryCount of [0, 1, 2]) {
          const slots = 2 * boundaryCount + 2 * siblingCount + 3;
          for (let page = 1; page <= totalPages; page += 1) {
            const list = items(page, totalPages, { siblingCount, boundaryCount });
            const pages = list.filter((item) => item !== "ellipsis");

            expect(list).toHaveLength(Math.min(totalPages, slots));
            expect(pages).toContain(page);
            // Ascending, without duplicates.
            expect(pages.every((value, index) => index === 0 || value > pages[index - 1])).toBe(
              true,
            );
            if (boundaryCount > 0) {
              expect(pages[0]).toBe(1);
              expect(pages.at(-1)).toBe(totalPages);
            }
            // Pages next to each other are consecutive; every ellipsis hides 2+ pages.
            list.forEach((item, index) => {
              const previous = list[index - 1];
              const next = list[index + 1];
              if (item === "ellipsis") {
                expect(previous === undefined || next === undefined || next - previous > 2).toBe(
                  true,
                );
              } else if (typeof previous === "number") {
                expect(item).toBe(previous + 1);
              }
            });
          }
        }
      }
    }
  });

  it("clamps the current page to the available pages", () => {
    expect(items(50, 10)).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
    expect(items(-3, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
    expect(getPaginationItems({ totalPages: 10 })).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("treats a missing or invalid page count as a single page", () => {
    expect(items(2, 0)).toEqual([1]);
    expect(items(2, Number.NaN)).toEqual([1]);
    expect(getPaginationItems({})).toEqual([1]);
  });
});

describe("getPageCount", () => {
  it("returns a whole number of at least 1, rounding a partial last page up", () => {
    expect(getPageCount(12)).toBe(12);
    expect(getPageCount(45 / 10)).toBe(5);
    expect(getPageCount(0)).toBe(1);
    expect(getPageCount(-4)).toBe(1);
    expect(getPageCount(Number.NaN)).toBe(1);
    expect(getPageCount(undefined)).toBe(1);
  });
});

describe("clampPage", () => {
  it("keeps the page between 1 and the page count", () => {
    expect(clampPage(3, 10)).toBe(3);
    expect(clampPage(0, 10)).toBe(1);
    expect(clampPage(11, 10)).toBe(10);
    expect(clampPage(2.7, 10)).toBe(2);
    expect(clampPage(undefined, 10)).toBe(1);
    expect(clampPage(4, 0)).toBe(1);
  });
});
