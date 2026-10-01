import { afterEach, describe, expect, it, vi } from "vitest";
import { hasCommandModifier, isApplePlatform, matchesHotkey, parseHotkey } from "./hotkey.js";

const none = { mod: false, ctrl: false, meta: false, alt: false, shift: false };

// A minimal KeyboardEvent-like object.
const press = (key, modifiers = {}, code) => ({
  key,
  code,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
  ...modifiers,
});

describe("parseHotkey", () => {
  it("parses modifiers and the key, case-insensitively", () => {
    expect(parseHotkey("mod+k")).toEqual({ ...none, key: "k", mod: true });
    expect(parseHotkey("Ctrl+Shift+P")).toEqual({ ...none, key: "p", ctrl: true, shift: true });
    expect(parseHotkey(" alt + / ")).toEqual({ ...none, key: "/", alt: true });
    expect(parseHotkey("j")).toEqual({ ...none, key: "j" });
  });

  it("understands modifier and key aliases", () => {
    expect(parseHotkey("cmd+option+esc")).toEqual({
      ...none,
      key: "escape",
      meta: true,
      alt: true,
    });
    expect(parseHotkey("control+space")).toEqual({ ...none, key: " ", ctrl: true });
    expect(parseHotkey("command+up")).toEqual({ ...none, key: "arrowup", meta: true });
    expect(parseHotkey("shift+F2")).toEqual({ ...none, key: "f2", shift: true });
  });

  it("accepts + as the key", () => {
    expect(parseHotkey("mod++")).toEqual({ ...none, key: "+", mod: true });
    expect(parseHotkey("ctrl+plus")).toEqual({ ...none, key: "+", ctrl: true });
    expect(parseHotkey("+")).toEqual({ ...none, key: "+" });
  });

  it("returns null for invalid shortcuts", () => {
    expect(parseHotkey("")).toBeNull();
    expect(parseHotkey("ctrl+")).toBeNull();
    expect(parseHotkey("ctrl+shift")).toBeNull();
    expect(parseHotkey("hyper+k")).toBeNull();
    expect(parseHotkey(null)).toBeNull();
    expect(parseHotkey(undefined)).toBeNull();
  });
});

describe("matchesHotkey", () => {
  it("resolves mod to Ctrl, or to ⌘ on Apple platforms", () => {
    expect(matchesHotkey(press("k", { ctrlKey: true }), "mod+k")).toBe(true);
    expect(matchesHotkey(press("k", { metaKey: true }), "mod+k")).toBe(false);
    expect(matchesHotkey(press("k", { metaKey: true }), "mod+k", { isMac: true })).toBe(true);
    expect(matchesHotkey(press("k", { ctrlKey: true }), "mod+k", { isMac: true })).toBe(false);
  });

  it("requires the exact modifiers", () => {
    expect(matchesHotkey(press("k"), "mod+k")).toBe(false);
    expect(matchesHotkey(press("k", { ctrlKey: true, altKey: true }), "mod+k")).toBe(false);
    expect(matchesHotkey(press("K", { ctrlKey: true, shiftKey: true }), "mod+k")).toBe(false);
    expect(matchesHotkey(press("P", { ctrlKey: true, shiftKey: true }), "ctrl+shift+p")).toBe(true);
    expect(matchesHotkey(press("p", { ctrlKey: true }), "ctrl+shift+p")).toBe(false);
  });

  it("compares the key case-insensitively and by name", () => {
    expect(matchesHotkey(press("Escape"), "esc")).toBe(true);
    expect(matchesHotkey(press("ArrowUp", { altKey: true }), "alt+up")).toBe(true);
    expect(matchesHotkey(press("j", { ctrlKey: true }), "mod+k")).toBe(false);
  });

  it("ignores Shift for symbols typed with it, unless the shortcut names Shift", () => {
    expect(matchesHotkey(press("?", { shiftKey: true }), "?")).toBe(true);
    expect(matchesHotkey(press("?", { shiftKey: true }), "shift+?")).toBe(true);
    expect(matchesHotkey(press("/"), "shift+/")).toBe(false);
  });

  it("falls back to the physical key when the layout changes event.key", () => {
    // Option + K on macOS types "˚"; a Devanagari layout types a different letter.
    expect(matchesHotkey(press("˚", { altKey: true }, "KeyK"), "alt+k")).toBe(true);
    expect(matchesHotkey(press("क", { ctrlKey: true }, "KeyK"), "mod+k")).toBe(true);
    expect(matchesHotkey(press("१", { ctrlKey: true }, "Digit1"), "mod+1")).toBe(true);
    // A Latin layout's own letter wins over the physical position (AZERTY).
    expect(matchesHotkey(press("q", { ctrlKey: true }, "KeyA"), "mod+a")).toBe(false);
  });

  it("matches digit shortcuts when Shift or the layout turns the digit into a symbol", () => {
    expect(
      matchesHotkey(press("!", { ctrlKey: true, shiftKey: true }, "Digit1"), "ctrl+shift+1"),
    ).toBe(true);
    // AZERTY types "&" on the 1 key.
    expect(matchesHotkey(press("&", { ctrlKey: true }, "Digit1"), "mod+1")).toBe(true);
    // Another digit or letter on that key is not a match.
    expect(matchesHotkey(press("2", { ctrlKey: true }, "Digit1"), "mod+1")).toBe(false);
  });

  it("matches Option + symbol on macOS by its physical key", () => {
    // Option + / types "÷" on a US Mac keyboard.
    expect(matchesHotkey(press("÷", { altKey: true }, "Slash"), "alt+/")).toBe(true);
    expect(matchesHotkey(press("/", { altKey: true }, "Slash"), "alt+/")).toBe(true);
    // Without Alt, a symbol is only matched by the character itself.
    expect(matchesHotkey(press("÷", {}, "Slash"), "/")).toBe(false);
  });

  it("accepts a parsed shortcut and rejects an invalid one", () => {
    const parsed = parseHotkey("mod+j");
    expect(matchesHotkey(press("j", { ctrlKey: true }), parsed)).toBe(true);
    expect(matchesHotkey(press("j", { ctrlKey: true }), "ctrl+")).toBe(false);
    expect(matchesHotkey(press("j", { ctrlKey: true }), null)).toBe(false);
  });
});

describe("hasCommandModifier", () => {
  it("is true for shortcuts with Ctrl, ⌘, Alt or mod", () => {
    expect(hasCommandModifier(parseHotkey("mod+k"))).toBe(true);
    expect(hasCommandModifier(parseHotkey("alt+n"))).toBe(true);
    expect(hasCommandModifier(parseHotkey("shift+?"))).toBe(false);
    expect(hasCommandModifier(parseHotkey("/"))).toBe(false);
    expect(hasCommandModifier(null)).toBe(false);
  });
});

describe("isApplePlatform", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("detects macOS and iOS from the navigator", () => {
    vi.stubGlobal("navigator", { platform: "MacIntel" });
    expect(isApplePlatform()).toBe(true);
    vi.stubGlobal("navigator", { platform: "", userAgentData: { platform: "macOS" } });
    expect(isApplePlatform()).toBe(true);
    vi.stubGlobal("navigator", { platform: "iPhone" });
    expect(isApplePlatform()).toBe(true);
  });

  it("is false elsewhere", () => {
    vi.stubGlobal("navigator", { platform: "Win32" });
    expect(isApplePlatform()).toBe(false);
    vi.stubGlobal("navigator", { platform: "Linux x86_64" });
    expect(isApplePlatform()).toBe(false);
  });
});
