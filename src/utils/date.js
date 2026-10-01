/*
 * Date-only helpers for Calendar and DatePicker. They work on whole days in
 * local time: every returned Date is at the start of its day, arguments are
 * never mutated, and ISO strings are built from the local year, month and day
 * (never with `toISOString()`, which converts to UTC and can shift the date by
 * a day, e.g. in India, UTC+5:30).
 */

/** Whether `value` is a Date object holding a real time (not `new Date("oops")`). */
export const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

// `new Date(year, …)` maps years 0–99 to 1900–1999; `setFullYear` doesn't. Months
// and days overflow into the next month or year, like the Date constructor.
function makeDate(year, month, day) {
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, month, day);
  return date;
}

/** The same calendar day at 00:00 local time, or `null` when `date` isn't a valid Date. */
export function startOfDay(date) {
  return isValidDate(date) ? makeDate(date.getFullYear(), date.getMonth(), date.getDate()) : null;
}

/** The first day of `date`'s month, or `null` when `date` isn't a valid Date. */
export function startOfMonth(date) {
  return isValidDate(date) ? makeDate(date.getFullYear(), date.getMonth(), 1) : null;
}

/** Number of days in a month (`month` is 0–11 and may overflow into other years). */
export function getDaysInMonth(year, month) {
  return makeDate(year, month + 1, 0).getDate();
}

/** `date` moved by `amount` days (negative to go back). Calendar days, so DST changes don't matter. */
export function addDays(date, amount) {
  return makeDate(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * `date` moved by `amount` months. The day is clamped to the length of the
 * target month, so 31 January + 1 month is 28 (or 29) February, not 3 March.
 */
export function addMonths(date, amount) {
  const year = date.getFullYear();
  const month = date.getMonth() + amount;
  return makeDate(year, month, Math.min(date.getDate(), getDaysInMonth(year, month)));
}

/** `date` moved by `amount` years; 29 February becomes 28 February in a non-leap year. */
export function addYears(date, amount) {
  return addMonths(date, amount * 12);
}

// A number that sorts like the day it stands for: 2026-10-06 → 20260906.
const dayKey = (date) => date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();

/**
 * Compares two dates by day, ignoring the time: a negative number when `a` is
 * earlier, 0 on the same day, a positive number when `a` is later.
 */
export function compareDays(a, b) {
  return Math.sign(dayKey(a) - dayKey(b));
}

/** Whether `a` and `b` are valid dates on the same calendar day. */
export function isSameDay(a, b) {
  return isValidDate(a) && isValidDate(b) && compareDays(a, b) === 0;
}

/** Whether `a` and `b` are valid dates in the same month of the same year. */
export function isSameMonth(a, b) {
  return (
    isValidDate(a) &&
    isValidDate(b) &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

/**
 * Whether `date` falls between `start` and `end`, both included. A missing
 * (`null` or invalid) bound leaves that side open.
 */
export function isWithinRange(date, start, end) {
  return (
    (!isValidDate(start) || compareDays(date, start) >= 0) &&
    (!isValidDate(end) || compareDays(date, end) <= 0)
  );
}

/** The day of `date`, moved inside `min`…`max` when it falls outside. Either bound is optional. */
export function clampDate(date, min, max) {
  if (isValidDate(min) && compareDays(date, min) < 0) return startOfDay(min);
  if (isValidDate(max) && compareDays(date, max) > 0) return startOfDay(max);
  return startOfDay(date);
}

/**
 * Whether a day can't be picked: it's before `min`, after `max`, or
 * `isDateDisabled(date)` returns true (e.g. no deliveries on Sundays).
 */
export function isDayDisabled(date, { min, max, isDateDisabled } = {}) {
  return !isWithinRange(date, min, max) || Boolean(isDateDisabled?.(date));
}

/** Normalises `weekStartsOn` to a whole number from 0 (Sunday) to 6 (Saturday). */
export function toWeekStart(value) {
  const day = Math.trunc(Number(value));
  return Number.isFinite(day) ? ((day % 7) + 7) % 7 : 0;
}

/** The first day of `date`'s week, for weeks starting on `weekStartsOn` (0 = Sunday). */
export function startOfWeek(date, weekStartsOn = 0) {
  const offset = (date.getDay() - toWeekStart(weekStartsOn) + 7) % 7;
  return addDays(date, -offset);
}

/** The last day of `date`'s week, for weeks starting on `weekStartsOn` (0 = Sunday). */
export function endOfWeek(date, weekStartsOn = 0) {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

/**
 * The days shown for `month` (any date in it) in a calendar: always 6 weeks of
 * 7 days, starting on the week that contains the 1st, so the grid's height never
 * changes. Days from the months before and after fill the first and last weeks.
 */
export function getMonthGrid(month, weekStartsOn = 0) {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day)),
  );
}

/**
 * Orders a `{ start, end }` range (swapping the dates when `end` comes first)
 * and drops the time. Missing or invalid dates become `null`; a lone `end`
 * becomes the `start`. Accepts `null` for an empty range.
 */
export function normalizeRange(range) {
  const start = startOfDay(range?.start);
  const end = startOfDay(range?.end);
  if (!start) return { start: end, end: null };
  if (end && compareDays(end, start) < 0) return { start: end, end: start };
  return { start, end };
}

const pad = (number, length) => String(number).padStart(length, "0");

/** "YYYY-MM-DD" for the local day of `date` (e.g. for forms and APIs), or "" when it isn't valid. */
export function formatISODate(date) {
  if (!isValidDate(date)) return "";
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`;
}

/**
 * Parses "YYYY-MM-DD" into a local Date at 00:00, unlike `new Date("2026-10-06")`,
 * which is UTC midnight. Returns `null` for anything else, including days that
 * don't exist, such as "2026-02-30".
 */
export function parseISODate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof value === "string" ? value.trim() : "");
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = makeDate(year, month - 1, day);
  return date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

const formatterCache = new Map();

/**
 * A cached `Intl.DateTimeFormat` for `locale` (undefined = the user's locale).
 * An invalid locale tag falls back to the default locale instead of throwing.
 */
export function getDateFormatter(locale, options) {
  const key = `${String(locale)}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat(locale, options);
    } catch {
      formatter = new Intl.DateTimeFormat(undefined, options);
    }
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Weekday names in display order for weeks starting on `weekStartsOn`:
 * `[{ short: "Mon", long: "Monday" }, …]` in the given locale.
 */
export function getWeekdayNames(locale, weekStartsOn = 0) {
  const short = getDateFormatter(locale, { weekday: "short" });
  const long = getDateFormatter(locale, { weekday: "long" });
  const start = toWeekStart(weekStartsOn);
  // 4 January 2026 is a Sunday.
  return Array.from({ length: 7 }, (_, index) => {
    const date = makeDate(2026, 0, 4 + ((start + index) % 7));
    return { short: short.format(date), long: long.format(date) };
  });
}
