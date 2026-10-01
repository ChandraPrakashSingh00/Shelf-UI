/**
 * Number helpers for NumberInput: decimal places, rounding without
 * floating-point noise, clamping, and parsing / sanitizing typed text.
 */

/** Digits after the decimal point, also for exponent notation (`1e-7` → 7). */
export function countDecimals(number) {
  if (!Number.isFinite(number)) return 0;
  const [mantissa, exponent = "0"] = String(number).toLowerCase().split("e");
  const decimals = mantissa.split(".")[1]?.length ?? 0;
  return Math.max(0, decimals - Number(exponent));
}

// Moves the decimal point by `places` using the string form, so 1.005 stays 1.005
// instead of 1.00499999…, which `number * 100` would give.
function shift(number, places) {
  const [mantissa, exponent = "0"] = String(number).toLowerCase().split("e");
  return Number(`${mantissa}e${Number(exponent) + places}`);
}

/**
 * Rounds to `precision` decimal places (half away from zero) and drops
 * floating-point noise: `roundToPrecision(0.1 + 0.2, 2)` is `0.3`.
 */
export function roundToPrecision(number, precision = 0) {
  if (!Number.isFinite(number)) return number;
  const places = Math.min(Math.max(Math.round(precision), 0), 20);
  const rounded = Math.sign(number) * Math.round(shift(Math.abs(number), places));
  const result = shift(rounded, -places);
  // Avoids -0, which would render as "0" but compare oddly.
  return result === 0 ? 0 : result;
}

/**
 * The number as plain decimal text, never in exponent notation, so it can be
 * edited digit by digit: `5e-7` → "0.0000005", `1e21` → "1000000000000000000000".
 * Non-finite numbers are returned as `String(number)`.
 */
export function toDecimalString(number) {
  const text = String(number);
  if (!Number.isFinite(number) || !/e/i.test(text)) return text;
  const [mantissa, exponent] = text.toLowerCase().split("e");
  const negative = mantissa.startsWith("-");
  const [whole, fraction = ""] = mantissa.replace("-", "").split(".");
  const digits = whole + fraction;
  // Where the decimal point lands among `digits` once the exponent is applied.
  const point = whole.length + Number(exponent);
  let decimal;
  if (point <= 0) decimal = `0.${"0".repeat(-point)}${digits}`;
  else if (point >= digits.length) decimal = digits + "0".repeat(point - digits.length);
  else decimal = `${digits.slice(0, point)}.${digits.slice(point)}`;
  return negative ? `-${decimal}` : decimal;
}

/** Clamps a number to `min` and `max`; either bound may be `undefined` or `null`. */
export function clampNumber(number, min, max) {
  if (min != null && number < min) return min;
  if (max != null && number > max) return max;
  return number;
}

/** Converts a prop to a finite number, or `null` (for `null`, `""`, `NaN`, …). */
export function toFiniteNumber(value) {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

const COMPLETE_NUMBER = /^-?(\d+\.?\d*|\.\d+)$/;

/**
 * Parses text typed into a number field. Returns `null` for empty or
 * incomplete text such as `"-"` or `"."`.
 */
export function parseNumber(text) {
  const trimmed = text.trim();
  return COMPLETE_NUMBER.test(trimmed) ? Number(trimmed) : null;
}

/**
 * Cleans text typed or pasted into a number field. Spaces, digit grouping and
 * currency symbols are dropped ("₹1,299" → "1299"). Returns `null` when what's
 * left isn't the beginning of a valid number — a second decimal point, a minus
 * sign that isn't first, or a minus sign / decimal point that isn't allowed — so
 * the caller can ignore the keystroke.
 */
export function sanitizeNumberText(text, { allowNegative = true, allowDecimal = true } = {}) {
  const cleaned = text.replace(/[^\d.-]/g, "");
  // Only letters or symbols, e.g. "abc" pasted over the whole value.
  if (cleaned === "" && text.trim() !== "") return null;
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return null;
  if (!allowNegative && cleaned.startsWith("-")) return null;
  if (!allowDecimal && cleaned.includes(".")) return null;
  return cleaned;
}
