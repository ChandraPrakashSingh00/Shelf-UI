import { describe, expect, it } from "vitest";
import {
  clampNumber,
  countDecimals,
  parseNumber,
  roundToPrecision,
  sanitizeNumberText,
  toDecimalString,
  toFiniteNumber,
} from "./number.js";

describe("toDecimalString", () => {
  it("leaves ordinary numbers as String() writes them", () => {
    expect(toDecimalString(0)).toBe("0");
    expect(toDecimalString(1299)).toBe("1299");
    expect(toDecimalString(-12.125)).toBe("-12.125");
    expect(toDecimalString(0.000001)).toBe("0.000001");
  });

  it("writes small and large numbers without exponent notation", () => {
    expect(toDecimalString(5e-7)).toBe("0.0000005");
    expect(toDecimalString(1.5e-7)).toBe("0.00000015");
    expect(toDecimalString(-2.25e-8)).toBe("-0.0000000225");
    expect(toDecimalString(1e21)).toBe("1000000000000000000000");
    expect(toDecimalString(-1.23e21)).toBe("-1230000000000000000000");
  });

  it("returns non-finite numbers unchanged", () => {
    expect(toDecimalString(Number.NaN)).toBe("NaN");
    expect(toDecimalString(Infinity)).toBe("Infinity");
  });
});

describe("countDecimals", () => {
  it("counts the digits after the decimal point", () => {
    expect(countDecimals(1)).toBe(0);
    expect(countDecimals(0.5)).toBe(1);
    expect(countDecimals(0.25)).toBe(2);
    expect(countDecimals(-12.125)).toBe(3);
  });

  it("handles exponent notation and non-finite numbers", () => {
    expect(countDecimals(1e-7)).toBe(7);
    expect(countDecimals(1.5e-7)).toBe(8);
    expect(countDecimals(1e21)).toBe(0);
    expect(countDecimals(Number.NaN)).toBe(0);
    expect(countDecimals(Infinity)).toBe(0);
  });
});

describe("roundToPrecision", () => {
  it("drops floating-point noise", () => {
    expect(roundToPrecision(0.1 + 0.2, 1)).toBe(0.3);
    expect(roundToPrecision(0.1 * 3, 2)).toBe(0.3);
    expect(roundToPrecision(1.1 + 2.2, 1)).toBe(3.3);
  });

  it("rounds half away from zero, including values that binary floats misrepresent", () => {
    expect(roundToPrecision(1.005, 2)).toBe(1.01);
    expect(roundToPrecision(2.5, 0)).toBe(3);
    expect(roundToPrecision(-2.5, 0)).toBe(-3);
    expect(roundToPrecision(1234.5678, 2)).toBe(1234.57);
  });

  it("never returns -0 and leaves non-finite numbers alone", () => {
    expect(Object.is(roundToPrecision(-0.001, 1), 0)).toBe(true);
    expect(roundToPrecision(Number.NaN, 2)).toBeNaN();
    expect(roundToPrecision(1e-7, 7)).toBe(1e-7);
  });
});

describe("clampNumber", () => {
  it("clamps to the bounds that are set", () => {
    expect(clampNumber(15, 1, 10)).toBe(10);
    expect(clampNumber(-3, 1, 10)).toBe(1);
    expect(clampNumber(5, 1, 10)).toBe(5);
    expect(clampNumber(500, undefined, 100)).toBe(100);
    expect(clampNumber(-500, null, 100)).toBe(-500);
    expect(clampNumber(-500, 0)).toBe(0);
  });
});

describe("toFiniteNumber", () => {
  it("returns a number or null", () => {
    expect(toFiniteNumber(4)).toBe(4);
    expect(toFiniteNumber("4.5")).toBe(4.5);
    expect(toFiniteNumber(null)).toBeNull();
    expect(toFiniteNumber(undefined)).toBeNull();
    expect(toFiniteNumber("")).toBeNull();
    expect(toFiniteNumber("abc")).toBeNull();
    expect(toFiniteNumber(Infinity)).toBeNull();
  });
});

describe("parseNumber", () => {
  it("parses complete numbers", () => {
    expect(parseNumber("42")).toBe(42);
    expect(parseNumber("-7")).toBe(-7);
    expect(parseNumber("1.")).toBe(1);
    expect(parseNumber(".5")).toBe(0.5);
    expect(parseNumber(" 12.50 ")).toBe(12.5);
  });

  it("returns null for empty or incomplete text", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("-")).toBeNull();
    expect(parseNumber(".")).toBeNull();
    expect(parseNumber("-.")).toBeNull();
  });
});

describe("sanitizeNumberText", () => {
  it("drops grouping, spaces and currency symbols", () => {
    expect(sanitizeNumberText("₹1,299")).toBe("1299");
    expect(sanitizeNumberText("1 00 000")).toBe("100000");
    expect(sanitizeNumberText("12a")).toBe("12");
  });

  it("keeps partial numbers that are still being typed", () => {
    expect(sanitizeNumberText("")).toBe("");
    expect(sanitizeNumberText("-")).toBe("-");
    expect(sanitizeNumberText("3.")).toBe("3.");
  });

  it("rejects text that can't become a valid number", () => {
    expect(sanitizeNumberText("1.2.3")).toBeNull();
    expect(sanitizeNumberText("1-2")).toBeNull();
    expect(sanitizeNumberText("--1")).toBeNull();
    expect(sanitizeNumberText("abc")).toBeNull();
  });

  it("rejects a minus sign or decimal point that isn't allowed", () => {
    expect(sanitizeNumberText("-5", { allowNegative: false })).toBeNull();
    expect(sanitizeNumberText("2.5", { allowDecimal: false })).toBeNull();
    expect(sanitizeNumberText("25", { allowNegative: false, allowDecimal: false })).toBe("25");
  });
});
