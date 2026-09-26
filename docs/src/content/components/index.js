import { alertDoc } from "./alert.jsx";
import { badgeDoc } from "./badge.jsx";
import { buttonDoc } from "./button.jsx";
import { cardDoc } from "./card.jsx";
import { dropdownDoc } from "./dropdown.jsx";
import { inputDoc } from "./input.jsx";
import { modalDoc } from "./modal.jsx";
import { navbarDoc } from "./navbar.jsx";
import { tabsDoc } from "./tabs.jsx";
import { toastDoc } from "./toast.jsx";

/**
 * Every documented component, in alphabetical order. Each doc is an object with:
 *
 * - `slug`, `name` and `category` (one of `categoryOrder`).
 * - `summary`: one sentence for cards and search results.
 * - `description`: lead paragraph on the component page (inline markdown).
 * - `keywords`: extra search terms.
 * - `imports`: named exports shown in the import snippet.
 * - `Thumbnail`: small decorative preview for the components grid.
 * - `Playground` (optional): interactive props playground, made with `definePlayground`.
 * - `examples`: `{ id, title, description, Component, code, responsive, minHeight }` objects.
 *   `code` is the example file's own source (imported with `?raw`); `responsive` adds a
 *   width switcher; `minHeight` (a CSS length) makes room for content that opens below
 *   its trigger, like menus, and aligns the preview to the top.
 * - `api`: props tables — `{ title, description, props }`, where each prop is
 *   `{ name, type, default, description, required }`.
 * - `keyboard` (optional): `{ keys, description }` rows; a key combination is one string,
 *   e.g. "Shift + Tab".
 * - `accessibility`: notes (inline markdown).
 */
export const componentDocs = [
  alertDoc,
  badgeDoc,
  buttonDoc,
  cardDoc,
  dropdownDoc,
  inputDoc,
  modalDoc,
  navbarDoc,
  tabsDoc,
  toastDoc,
].sort((a, b) => a.name.localeCompare(b.name));

export const categoryOrder = [
  "Actions",
  "Forms",
  "Data display",
  "Feedback",
  "Overlays",
  "Navigation",
];

export function getComponentDoc(slug) {
  return componentDocs.find((doc) => doc.slug === slug);
}
