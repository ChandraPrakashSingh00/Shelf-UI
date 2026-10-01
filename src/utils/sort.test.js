import { describe, expect, it } from "vitest";
import { compareValues, getNextSort, isMissingValue, sortRows } from "./sort.js";

const sortValues = (values) => [...values].sort(compareValues);

describe("isMissingValue", () => {
  it("treats null, undefined, NaN and invalid dates as missing", () => {
    expect(isMissingValue(null)).toBe(true);
    expect(isMissingValue(undefined)).toBe(true);
    expect(isMissingValue(Number.NaN)).toBe(true);
    expect(isMissingValue(new Date("not a date"))).toBe(true);
  });

  it("keeps falsy but real values", () => {
    expect(isMissingValue(0)).toBe(false);
    expect(isMissingValue("")).toBe(false);
    expect(isMissingValue(false)).toBe(false);
    expect(isMissingValue(new Date(2026, 9, 6))).toBe(false);
  });
});

describe("compareValues", () => {
  it("compares numbers numerically, not as strings", () => {
    expect(sortValues([1299, 89, 10500, 0, -40])).toEqual([-40, 0, 89, 1299, 10500]);
    expect(sortValues([Infinity, 1, -Infinity])).toEqual([-Infinity, 1, Infinity]);
    expect(compareValues(5, 5)).toBe(0);
  });

  it("compares bigints and booleans", () => {
    expect(sortValues([10n, 2n, 33n])).toEqual([2n, 10n, 33n]);
    expect(sortValues([true, false, true])).toEqual([false, true, true]);
  });

  it("compares strings with numeric collation", () => {
    expect(sortValues(["Order 10", "Order 9", "Order 100"])).toEqual([
      "Order 9",
      "Order 10",
      "Order 100",
    ]);
    expect(sortValues(["Mumbai", "bengaluru", "Delhi"])).toEqual(["bengaluru", "Delhi", "Mumbai"]);
  });

  it("compares dates by time", () => {
    const oct6 = new Date(2026, 9, 6);
    const oct1 = new Date(2026, 9, 1);
    const sep30 = new Date(2026, 8, 30, 23, 59);
    expect(sortValues([oct6, sep30, oct1])).toEqual([sep30, oct1, oct6]);
    expect(compareValues(new Date(oct6), oct6)).toBe(0);
  });

  it("puts missing values last", () => {
    // (Array.prototype.sort itself moves `undefined` to the very end.)
    expect(sortValues([3, null, 1, Number.NaN, 2, undefined])).toEqual([
      1,
      2,
      3,
      null,
      Number.NaN,
      undefined,
    ]);
    expect(compareValues(null, 1)).toBeGreaterThan(0);
    expect(compareValues(1, undefined)).toBeLessThan(0);
    expect(compareValues(null, undefined)).toBe(0);
  });

  it("compares numbers and numeric text by value", () => {
    expect(compareValues(10, "9")).toBeGreaterThan(0);
    expect(compareValues("1.5", "1.25")).toBeGreaterThan(0);
    expect(compareValues(" 42 ", 42)).toBe(0);
    expect(compareValues(3n, "2.5")).toBeGreaterThan(0);
    expect(sortValues([1299, "89", "-40", 10500n, "1.25"])).toEqual([
      "-40",
      "1.25",
      "89",
      1299,
      10500n,
    ]);
  });

  it("sorts values of different kinds in groups: numbers, dates, booleans, text, other", () => {
    const date = new Date(2026, 9, 6);
    expect(compareValues("abc", 1)).toBeGreaterThan(0);
    expect(sortValues(["abc", true, date, 3, "2", { toString: () => "obj" }])).toEqual([
      "2",
      3,
      date,
      true,
      "abc",
      expect.objectContaining({}),
    ]);
  });

  it("is a consistent order when numbers and numeric text mix", () => {
    // 1.25 < 1.5 as numbers, but compared as text "1.10" fell between them the
    // wrong way round, which made the comparator contradict itself.
    const values = [1.5, "1.10", 1.25, "Order 9", 10, "Order 10", "10", 2n, true, false];
    for (const a of values) {
      expect(compareValues(a, a) === 0).toBe(true);
      for (const b of values) {
        expect(Math.sign(compareValues(a, b)) === -Math.sign(compareValues(b, a))).toBe(true);
        for (const c of values) {
          if (compareValues(a, b) <= 0 && compareValues(b, c) <= 0) {
            expect(compareValues(a, c)).toBeLessThanOrEqual(0);
          }
        }
      }
    }
    expect(sortValues([1.5, "1.10", 1.25])).toEqual(["1.10", 1.25, 1.5]);
  });
});

describe("sortRows", () => {
  const orders = [
    { id: 1, city: "Mumbai", amount: 1299 },
    { id: 2, city: "Delhi", amount: null },
    { id: 3, city: "Bengaluru", amount: 89 },
    { id: 4, city: "Delhi", amount: 10500 },
    { id: 5, city: "Mumbai", amount: 89 },
  ];
  const ids = (rows) => rows.map((row) => row.id);

  it("sorts by a value in either direction without changing the input", () => {
    const copy = [...orders];
    const byAmount = { getValue: (row) => row.amount };

    expect(ids(sortRows(orders, byAmount))).toEqual([3, 5, 1, 4, 2]);
    expect(ids(sortRows(orders, { ...byAmount, direction: "desc" }))).toEqual([4, 1, 3, 5, 2]);
    expect(orders).toEqual(copy);
  });

  it("is stable in both directions", () => {
    const byCity = { getValue: (row) => row.city };
    expect(ids(sortRows(orders, byCity))).toEqual([3, 2, 4, 1, 5]);
    expect(ids(sortRows(orders, { ...byCity, direction: "desc" }))).toEqual([1, 5, 2, 4, 3]);
  });

  it("keeps missing values last in descending order too", () => {
    const rows = sortRows(orders, { getValue: (row) => row.amount, direction: "desc" });
    expect(rows.at(-1).id).toBe(2);
  });

  it("accepts a custom comparator, reversed for descending order", () => {
    const priority = { Delhi: 0, Mumbai: 1, Bengaluru: 2 };
    const compare = (a, b) => priority[a.city] - priority[b.city];

    expect(ids(sortRows(orders, { compare }))).toEqual([2, 4, 1, 5, 3]);
    expect(ids(sortRows(orders, { compare, direction: "desc" }))).toEqual([3, 1, 5, 2, 4]);
  });

  it("falls back to the original order when a comparator returns NaN", () => {
    expect(ids(sortRows(orders, { compare: () => Number.NaN }))).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles empty arrays", () => {
    expect(sortRows([])).toEqual([]);
  });
});

describe("getNextSort", () => {
  it("cycles ascending → descending → unsorted", () => {
    const asc = getNextSort(null, "amount");
    expect(asc).toEqual({ key: "amount", direction: "asc" });
    const desc = getNextSort(asc, "amount");
    expect(desc).toEqual({ key: "amount", direction: "desc" });
    expect(getNextSort(desc, "amount")).toBeNull();
  });

  it("starts at ascending when another column is activated", () => {
    expect(getNextSort({ key: "date", direction: "desc" }, "amount")).toEqual({
      key: "amount",
      direction: "asc",
    });
  });
});
