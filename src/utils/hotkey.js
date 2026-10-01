const MODIFIERS = {
  mod: "mod",
  ctrl: "ctrl",
  control: "ctrl",
  meta: "meta",
  cmd: "meta",
  command: "meta",
  alt: "alt",
  option: "alt",
  shift: "shift",
};

const KEY_ALIASES = {
  esc: "escape",
  return: "enter",
  space: " ",
  spacebar: " ",
  plus: "+",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
  del: "delete",
};

/**
 * Parses a shortcut such as `"mod+k"`, `"ctrl+shift+p"` or `"alt+/"` into
 * `{ key, mod, ctrl, meta, alt, shift }`. Case-insensitive. `mod` is Ctrl on
 * Windows and Linux and ⌘ on Apple platforms. The key is a character or a
 * `KeyboardEvent.key` name ("enter", "escape", "arrowup", "f2"; aliases: "esc",
 * "space", "plus", "up"…). Returns `null` for anything else, e.g. `"ctrl+"`.
 */
export function parseHotkey(hotkey) {
  if (typeof hotkey !== "string") return null;
  const text = hotkey.trim().toLowerCase();
  if (text === "") return null;

  // "+" can itself be the key: "mod++" or just "+".
  let keyPart;
  let modifierPart;
  if (text === "+") {
    keyPart = "+";
    modifierPart = "";
  } else if (text.endsWith("++")) {
    keyPart = "+";
    modifierPart = text.slice(0, -2);
  } else {
    const separator = text.lastIndexOf("+");
    keyPart = text.slice(separator + 1).trim();
    modifierPart = separator === -1 ? "" : text.slice(0, separator);
  }

  const key = Object.hasOwn(KEY_ALIASES, keyPart) ? KEY_ALIASES[keyPart] : keyPart;
  if (key === "" || Object.hasOwn(MODIFIERS, key)) return null;

  const result = { key, mod: false, ctrl: false, meta: false, alt: false, shift: false };
  if (modifierPart !== "") {
    for (const part of modifierPart.split("+")) {
      const name = part.trim();
      if (!Object.hasOwn(MODIFIERS, name)) return null;
      result[MODIFIERS[name]] = true;
    }
  }
  return result;
}

const LETTER_OR_DIGIT = /^[a-z0-9]$/;
const PRINTABLE_ASCII = /^[\x20-\x7e]$/;

// Physical keys of the US-layout symbols, for Option on macOS ("alt+/" types "÷").
const SYMBOL_CODES = {
  "/": "Slash",
  ".": "Period",
  ",": "Comma",
  ";": "Semicolon",
  "'": "Quote",
  "[": "BracketLeft",
  "]": "BracketRight",
  "\\": "Backslash",
  "-": "Minus",
  "=": "Equal",
  "`": "Backquote",
};

function keyMatches(event, key, { alt }) {
  const eventKey = typeof event.key === "string" ? event.key : "";
  if (eventKey.toLowerCase() === key) return true;

  // Non-Latin layouts (and Option on macOS) change `event.key` for letters: fall
  // back to the physical key then, but not for another Latin layout's letter.
  if (/^[a-z]$/.test(key)) {
    return !PRINTABLE_ASCII.test(eventKey) && event.code === `Key${key.toUpperCase()}`;
  }
  // Shift, AZERTY and Option turn the digit row into symbols ("!", "&", "¡").
  if (/^[0-9]$/.test(key)) {
    return !/^[a-z0-9]$/i.test(eventKey) && event.code === `Digit${key}`;
  }
  if (alt && Object.hasOwn(SYMBOL_CODES, key)) {
    return !PRINTABLE_ASCII.test(eventKey) && event.code === SYMBOL_CODES[key];
  }
  return false;
}

/**
 * Whether a keyboard event matches a shortcut (a string, or the result of
 * `parseHotkey`). Modifiers must match exactly, except that Shift is not
 * checked for a symbol typed with it when the shortcut doesn't mention Shift
 * (`"?"` matches Shift + /). Pass `isMac` to resolve `mod` to ⌘ instead of Ctrl.
 */
export function matchesHotkey(event, hotkey, { isMac = false } = {}) {
  const parsed = typeof hotkey === "string" ? parseHotkey(hotkey) : hotkey;
  if (!parsed) return false;

  const wantsCtrl = parsed.ctrl || (parsed.mod && !isMac);
  const wantsMeta = parsed.meta || (parsed.mod && isMac);
  if (Boolean(event.ctrlKey) !== wantsCtrl) return false;
  if (Boolean(event.metaKey) !== wantsMeta) return false;
  if (Boolean(event.altKey) !== parsed.alt) return false;

  const isSymbol = parsed.key.length === 1 && !LETTER_OR_DIGIT.test(parsed.key);
  if (Boolean(event.shiftKey) !== parsed.shift && (parsed.shift || !isSymbol)) return false;

  return keyMatches(event, parsed.key, parsed);
}

/** Whether a parsed shortcut uses Ctrl, ⌘, Alt or `mod` (so it can't clash with typing). */
export function hasCommandModifier(parsed) {
  return Boolean(parsed && (parsed.mod || parsed.ctrl || parsed.meta || parsed.alt));
}

/** Whether the browser runs on macOS or iOS, where `mod` means ⌘. Browser-only. */
export function isApplePlatform() {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}
