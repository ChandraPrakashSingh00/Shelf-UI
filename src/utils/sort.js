// Locale-aware and numeric, so "Item 2" sorts before "Item 10".
const collator = new Intl.Collator(undefined, { numeric: true });

// A plain decimal number written as text, e.g. "1299", "-3.5", "1.25" or "2e3".
const NUMERIC_TEXT = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

const compareOrdered = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// Numbers, bigints and numeric text form one group that compares by value, so
// 1.25, "1.3" and 1.5 sort together. Every other value sorts within its own type.
function toNumber(value) {
  if (typeof value === "number" || typeof value === "bigint") return value;
  if (typeof value === "string" && NUMERIC_TEXT.test(value.trim())) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return undefined;
}

// The order of the groups when two values of different kinds meet.
const RANK = { number: 0, date: 1, boolean: 2, string: 3, other: 4 };

function rankOf(value) {
  if (toNumber(value) !== undefined) return RANK.number;
  if (value instanceof Date) return RANK.date;
  if (typeof value === "boolean") return RANK.boolean;
  if (typeof value === "string") return RANK.string;
  return RANK.other;
}

/**
 * Whether a value counts as missing when sorting: `null`, `undefined`, `NaN` or
 * an invalid `Date`. Missing values always sort last.
 */
export function isMissingValue(value) {
  if (value == null) return true;
  if (typeof value === "number") return Number.isNaN(value);
  if (value instanceof Date) return Number.isNaN(value.getTime());
  return false;
}

/**
 * Compares two values in ascending order and returns a negative number, zero or a
 * positive number, like an `Array.prototype.sort` comparator.
 *
 * - Numbers, bigints and numeric text ("1.25", "-40") compare numerically with
 *   each other, so a column mixing `1299` and `"89"` still sorts by amount.
 * - Dates compare by time and booleans with `false` first.
 * - Other strings use a locale-aware collation that compares digits as numbers
 *   ("Order 9" before "Order 10").
 * - Values of different kinds sort in groups — numbers, then dates, booleans,
 *   text and anything else (compared as text) — so the order is always consistent.
 * - Missing values (see `isMissingValue`) come after everything else.
 */
export function compareValues(a, b) {
  const aMissing = isMissingValue(a);
  const bMissing = isMissingValue(b);
  if (aMissing || bMissing) return aMissing === bMissing ? 0 : aMissing ? 1 : -1;

  const rank = rankOf(a);
  if (rank !== rankOf(b)) return rank - rankOf(b);

  switch (rank) {
    case RANK.number:
      return compareOrdered(toNumber(a), toNumber(b));
    case RANK.date:
      return compareOrdered(a.getTime(), b.getTime());
    case RANK.boolean:
      return compareOrdered(Number(a), Number(b));
    case RANK.string:
      return collator.compare(a, b);
    default:
      return collator.compare(String(a), String(b));
  }
}

/**
 * Returns a sorted copy of `rows`; the original array is left untouched. The sort
 * is stable: rows that compare equal keep their original order.
 *
 * - `direction`: "asc" (default) or "desc".
 * - `getValue(row)`: the value compared for each row (default: the row itself).
 * - `compare(a, b)`: ascending comparator for those values (default `compareValues`).
 *   The direction is applied on top of it.
 *
 * Rows whose value is missing (see `isMissingValue`) go last in both directions.
 */
export function sortRows(
  rows,
  { direction = "asc", getValue = (row) => row, compare = compareValues } = {},
) {
  const sign = direction === "desc" ? -1 : 1;

  return rows
    .map((row, index) => ({ row, index, value: getValue(row) }))
    .sort((a, b) => {
      const aMissing = isMissingValue(a.value);
      const bMissing = isMissingValue(b.value);
      if (aMissing !== bMissing) return aMissing ? 1 : -1;
      const result = aMissing ? 0 : compare(a.value, b.value) * sign;
      // `||` also turns a comparator's NaN into the original order.
      return result || a.index - b.index;
    })
    .map(({ row }) => row);
}

/**
 * The sort state after activating the column `key`, cycling ascending →
 * descending → unsorted. Another column starts again at ascending.
 * A sort state is `{ key, direction: "asc" | "desc" }` or `null`.
 */
export function getNextSort(sort, key) {
  if (sort?.key !== key) return { key, direction: "asc" };
  return sort.direction === "asc" ? { key, direction: "desc" } : null;
}
