import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useToday } from "./useToday.js";

describe("useToday", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns today's local date at midnight", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 6, 23, 50));
    const { result } = renderHook(() => useToday());
    expect(result.current).toEqual(new Date(2026, 9, 6));
  });

  it("keeps the same Date object while the day doesn't change", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 6, 10));
    const { result, rerender } = renderHook(() => useToday());
    const first = result.current;
    vi.setSystemTime(new Date(2026, 9, 6, 18));
    rerender();
    expect(result.current).toBe(first);
  });

  it("moves to the next day at midnight and when the page becomes visible again", () => {
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(new Date(2026, 9, 6, 23, 59));
    const { result, unmount } = renderHook(() => useToday());
    expect(result.current).toEqual(new Date(2026, 9, 6));

    act(() => vi.advanceTimersByTime(2 * 60 * 1000));
    expect(result.current).toEqual(new Date(2026, 9, 7));

    // A sleeping laptop pauses timers: the date is checked again when the page shows.
    vi.setSystemTime(new Date(2026, 9, 9, 8));
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current).toEqual(new Date(2026, 9, 9));

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("is null during server rendering", () => {
    let serverValue;
    function Probe() {
      serverValue = useToday();
      return null;
    }
    renderToString(createElement(Probe));
    expect(serverValue).toBeNull();
  });
});
