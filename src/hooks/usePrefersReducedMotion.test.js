import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

function mockMatchMedia(initialMatches) {
  let matches = initialMatches;
  const listeners = new Set();
  window.matchMedia = vi.fn((media) => ({
    media,
    get matches() {
      return matches;
    },
    addEventListener: (type, listener) => listeners.add(listener),
    removeEventListener: (type, listener) => listeners.delete(listener),
  }));

  return {
    listeners,
    setMatches(next) {
      matches = next;
      for (const listener of listeners) listener();
    },
  };
}

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    // jsdom has no matchMedia of its own.
    delete window.matchMedia;
  });

  it("is false when matchMedia is not available", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reads the prefers-reduced-motion media query", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });

  it("follows changes to the setting and unsubscribes on unmount", () => {
    const media = mockMatchMedia(false);
    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => media.setMatches(true));
    expect(result.current).toBe(true);

    unmount();
    expect(media.listeners.size).toBe(0);
  });
});
