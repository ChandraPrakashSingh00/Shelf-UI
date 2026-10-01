import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  addYears,
  clampDate,
  compareDays,
  endOfWeek,
  formatISODate,
  getDateFormatter,
  getDaysInMonth,
  getMonthGrid,
  getWeekdayNames,
  isDayDisabled,
  isSameDay,
  isSameMonth,
  isValidDate,
  isWithinRange,
  normalizeRange,
  parseISODate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toWeekStart,
} from "./date.js";

// Local dates, like the ones users pick: months are 0-based.
const day = (year, month, date) => new Date(year, month - 1, date);

describe("date helpers", () => {
  it("recognises valid dates", () => {
    expect(isValidDate(day(2026, 10, 6))).toBe(true);
    expect(isValidDate(new Date("not a date"))).toBe(false);
    expect(isValidDate("2026-10-06")).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });

  it("drops the time of day without mutating the argument", () => {
    const evening = new Date(2026, 9, 6, 21, 45, 30);
    const result = startOfDay(evening);
    expect(result).toEqual(day(2026, 10, 6));
    expect(evening.getHours()).toBe(21);
    expect(startOfDay(undefined)).toBeNull();
    expect(startOfDay(new Date(Number.NaN))).toBeNull();
  });

  it("finds the start of the month and its length", () => {
    expect(startOfMonth(day(2026, 10, 31))).toEqual(day(2026, 10, 1));
    expect(startOfMonth(null)).toBeNull();
    expect(getDaysInMonth(2026, 1)).toBe(28);
    expect(getDaysInMonth(2028, 1)).toBe(29);
    expect(getDaysInMonth(2026, 9)).toBe(31);
    expect(getDaysInMonth(2026, 12)).toBe(31); // January 2027
  });

  it("adds days across months and years", () => {
    expect(addDays(day(2026, 10, 30), 3)).toEqual(day(2026, 11, 2));
    expect(addDays(day(2027, 1, 1), -1)).toEqual(day(2026, 12, 31));
    expect(addDays(new Date(2026, 9, 6, 18), 0)).toEqual(day(2026, 10, 6));
  });

  it("adds months, clamping the day to the target month", () => {
    expect(addMonths(day(2026, 1, 31), 1)).toEqual(day(2026, 2, 28));
    expect(addMonths(day(2028, 1, 31), 1)).toEqual(day(2028, 2, 29));
    expect(addMonths(day(2026, 3, 31), -1)).toEqual(day(2026, 2, 28));
    expect(addMonths(day(2026, 10, 31), 1)).toEqual(day(2026, 11, 30));
    expect(addMonths(day(2026, 11, 15), 3)).toEqual(day(2027, 2, 15));
    expect(addMonths(day(2026, 1, 15), -13)).toEqual(day(2024, 12, 15));
  });

  it("adds years, turning 29 February into 28 February", () => {
    expect(addYears(day(2028, 2, 29), 1)).toEqual(day(2029, 2, 28));
    expect(addYears(day(2026, 10, 6), -1)).toEqual(day(2025, 10, 6));
  });

  it("keeps years before 100 instead of mapping them to the 1900s", () => {
    const date = parseISODate("0050-06-15");
    expect(date.getFullYear()).toBe(50);
    expect(addMonths(date, 1).getFullYear()).toBe(50);
    expect(addDays(date, 1).getFullYear()).toBe(50);
    expect(formatISODate(startOfDay(date))).toBe("0050-06-15");
  });

  it("compares and matches dates by day", () => {
    expect(compareDays(day(2026, 10, 6), new Date(2026, 9, 6, 23, 59))).toBe(0);
    expect(compareDays(day(2026, 10, 5), day(2026, 10, 6))).toBe(-1);
    expect(compareDays(day(2027, 1, 1), day(2026, 12, 31))).toBe(1);
    expect(isSameDay(day(2026, 10, 6), new Date(2026, 9, 6, 12))).toBe(true);
    expect(isSameDay(day(2026, 10, 6), null)).toBe(false);
    expect(isSameMonth(day(2026, 10, 1), day(2026, 10, 31))).toBe(true);
    expect(isSameMonth(day(2026, 10, 1), day(2025, 10, 1))).toBe(false);
  });

  it("checks ranges with optional bounds and clamps into them", () => {
    const min = day(2026, 10, 1);
    const max = day(2026, 10, 15);
    expect(isWithinRange(day(2026, 10, 1), min, max)).toBe(true);
    expect(isWithinRange(day(2026, 10, 15), min, max)).toBe(true);
    expect(isWithinRange(day(2026, 10, 16), min, max)).toBe(false);
    expect(isWithinRange(day(2020, 1, 1), null, max)).toBe(true);
    expect(isWithinRange(day(2030, 1, 1), min, undefined)).toBe(true);

    expect(clampDate(day(2026, 9, 20), min, max)).toEqual(min);
    expect(clampDate(day(2026, 11, 20), min, max)).toEqual(max);
    expect(clampDate(new Date(2026, 9, 6, 9), min, max)).toEqual(day(2026, 10, 6));
    expect(clampDate(day(2026, 9, 20))).toEqual(day(2026, 9, 20));
  });

  it("disables days outside min/max or rejected by isDateDisabled", () => {
    const isSunday = (date) => date.getDay() === 0;
    const options = { min: day(2026, 10, 5), max: day(2026, 10, 20), isDateDisabled: isSunday };
    expect(isDayDisabled(day(2026, 10, 6), options)).toBe(false);
    expect(isDayDisabled(day(2026, 10, 11), options)).toBe(true); // a Sunday
    expect(isDayDisabled(day(2026, 10, 4), options)).toBe(true);
    expect(isDayDisabled(day(2026, 10, 21), options)).toBe(true);
    expect(isDayDisabled(day(2026, 10, 6))).toBe(false);
  });

  it("finds the start and end of the week for any first weekday", () => {
    const tuesday = day(2026, 10, 6);
    expect(startOfWeek(tuesday)).toEqual(day(2026, 10, 4));
    expect(endOfWeek(tuesday)).toEqual(day(2026, 10, 10));
    expect(startOfWeek(tuesday, 1)).toEqual(day(2026, 10, 5));
    expect(endOfWeek(tuesday, 1)).toEqual(day(2026, 10, 11));
    expect(startOfWeek(day(2026, 10, 4), 1)).toEqual(day(2026, 9, 28));
    expect(toWeekStart(8)).toBe(1);
    expect(toWeekStart(-1)).toBe(6);
    expect(toWeekStart("1")).toBe(1);
    expect(toWeekStart("oops")).toBe(0);
  });

  it("builds a 6 × 7 month grid starting on weekStartsOn", () => {
    const grid = getMonthGrid(day(2026, 10, 20));
    expect(grid).toHaveLength(6);
    expect(grid.every((week) => week.length === 7)).toBe(true);
    // 1 October 2026 is a Thursday.
    expect(grid[0][0]).toEqual(day(2026, 9, 27));
    expect(grid[0][4]).toEqual(day(2026, 10, 1));
    expect(grid[5][6]).toEqual(day(2026, 11, 7));

    const mondayGrid = getMonthGrid(day(2026, 10, 1), 1);
    expect(mondayGrid[0][0]).toEqual(day(2026, 9, 28));
    expect(mondayGrid[0][0].getDay()).toBe(1);

    // February 2026 starts on a Sunday and fills exactly 4 weeks; 2 more follow.
    const february = getMonthGrid(day(2026, 2, 1));
    expect(february[0][0]).toEqual(day(2026, 2, 1));
    expect(february[5][6]).toEqual(day(2026, 3, 14));
  });

  it("normalises ranges", () => {
    const start = day(2026, 10, 6);
    const end = day(2026, 10, 12);
    expect(normalizeRange({ start, end })).toEqual({ start, end });
    expect(normalizeRange({ start: end, end: start })).toEqual({ start, end });
    expect(normalizeRange({ start: new Date(2026, 9, 6, 10), end: null })).toEqual({
      start,
      end: null,
    });
    expect(normalizeRange({ start: null, end })).toEqual({ start: end, end: null });
    expect(normalizeRange(null)).toEqual({ start: null, end: null });
  });

  it("formats and parses ISO dates in local time", () => {
    // Just after midnight in India is still the previous day in UTC.
    const earlyMorning = new Date(2026, 9, 6, 0, 30);
    expect(formatISODate(earlyMorning)).toBe("2026-10-06");
    expect(formatISODate(day(2026, 1, 5))).toBe("2026-01-05");
    expect(formatISODate(null)).toBe("");

    const parsed = parseISODate("2026-10-06");
    expect(parsed).toEqual(day(2026, 10, 6));
    expect(parsed.getHours()).toBe(0);
    expect(parseISODate(" 2028-02-29 ")).toEqual(day(2028, 2, 29));
  });

  it("rejects malformed and impossible ISO dates", () => {
    expect(parseISODate("2026-02-30")).toBeNull();
    expect(parseISODate("2026-13-01")).toBeNull();
    expect(parseISODate("2026-10-6")).toBeNull();
    expect(parseISODate("06/10/2026")).toBeNull();
    expect(parseISODate("")).toBeNull();
    expect(parseISODate(null)).toBeNull();
  });

  it("round-trips every day of a year through ISO strings", () => {
    let date = day(2028, 1, 1);
    for (let index = 0; index < 366; index += 1) {
      expect(parseISODate(formatISODate(date))).toEqual(date);
      date = addDays(date, 1);
    }
    expect(date).toEqual(day(2029, 1, 1));
  });

  it("caches formatters and falls back from an invalid locale", () => {
    const options = { month: "long", year: "numeric" };
    expect(getDateFormatter("en-IN", options)).toBe(getDateFormatter("en-IN", options));
    expect(getDateFormatter("en-IN", options).format(day(2026, 10, 6))).toBe("October 2026");
    expect(() => getDateFormatter("not a locale!", options)).not.toThrow();
    expect(getDateFormatter("not a locale!", options).format(day(2026, 10, 6))).toMatch(/2026/);
  });

  it("names the weekdays in display order", () => {
    const names = getWeekdayNames("en-IN");
    expect(names.map((name) => name.short)).toEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
    expect(names[0].long).toBe("Sunday");

    const mondayFirst = getWeekdayNames("en-IN", 1);
    expect(mondayFirst[0]).toEqual({ short: "Mon", long: "Monday" });
    expect(mondayFirst[6]).toEqual({ short: "Sun", long: "Sunday" });
    expect(getWeekdayNames("hi-IN", 1)[0].long).toBe("सोमवार");
  });
});
