import { Kbd } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/kbd/Basic.jsx";
import basicCode from "../../examples/kbd/Basic.jsx?raw";
import Combinations from "../../examples/kbd/Combinations.jsx";
import combinationsCode from "../../examples/kbd/Combinations.jsx?raw";
import ShortcutList from "../../examples/kbd/ShortcutList.jsx";
import shortcutListCode from "../../examples/kbd/ShortcutList.jsx?raw";
import Sizes from "../../examples/kbd/Sizes.jsx";
import sizesCode from "../../examples/kbd/Sizes.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md"];

// "Ctrl + Shift + P" → ["Ctrl", "Shift", "P"]; a lone "+" stays a key.
const parseKeys = (text) =>
  text.trim() === "+"
    ? ["+"]
    : text
        .split("+")
        .map((key) => key.trim())
        .filter(Boolean);

function KbdThumbnail() {
  return (
    <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
      <Kbd keys={["Ctrl", "Shift", "P"]} />
      <span style={{ display: "flex", gap: 8 }}>
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
      </span>
    </div>
  );
}

export const kbdDoc = {
  slug: "kbd",
  name: "Kbd",
  category: "Data display",
  summary: "Shows a keyboard key or shortcut, like Ctrl + S, styled as a physical key.",
  description:
    "Shows a key (`Enter`) or a keyboard shortcut (`Ctrl + S`) in help text, menus and shortcut lists, styled like a physical key. It renders `<kbd>`; a combination nests one `<kbd>` per key inside it, the HTML way to mark up key combinations.",
  keywords: ["keyboard", "key", "shortcut", "hotkey", "keybinding", "keystroke", "kbd"],
  imports: ["Kbd"],
  Thumbnail: KbdThumbnail,
  Playground: definePlayground({
    defaults: { keys: "Ctrl + Shift + P", separator: "+", size: "md" },
    controls: {
      keys: { type: "text", label: "Keys (split on +)" },
      separator: { type: "text", label: "Separator" },
      size: { type: "select", label: "Size", options: sizes },
    },
    render: (values) => {
      const keys = parseKeys(values.keys);
      return keys.length > 1 ? (
        <Kbd keys={keys} separator={values.separator || "+"} size={values.size} />
      ) : (
        <Kbd size={values.size}>{keys[0] ?? "Esc"}</Kbd>
      );
    },
    code: (values) => {
      const keys = parseKeys(values.keys);
      const code =
        keys.length > 1
          ? formatJsx(
              "Kbd",
              {
                keys: expr(JSON.stringify(keys).replaceAll(",", ", ")),
                separator: values.separator || "+",
                size: values.size,
              },
              undefined,
              { defaults: { separator: "+", size: "md" } },
            )
          : formatJsx("Kbd", { size: values.size }, keys[0] ?? "Esc", {
              defaults: { size: "md" },
            });
      return withImport(["Kbd"], code);
    },
  }),
  examples: [
    {
      id: "basic",
      title: "Single keys",
      description: "Pass one key as `children`. It sits on the text baseline, so it works inline.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "combinations",
      title: "Key combinations",
      description:
        "`keys` renders a combination: one nested `<kbd>` per key, joined by `+` with spaces around it, so screen readers read “Ctrl plus S”.",
      Component: Combinations,
      code: combinationsCode,
    },
    {
      id: "shortcut-list",
      title: "Shortcut list",
      description:
        'For a sequence of keys, change the separator: `separator="then"` reads as “G then O”.',
      Component: ShortcutList,
      code: shortcutListCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "Kbd",
      description: "Renders a `<kbd>` that accepts its native attributes; the `ref` points to it.",
      props: [
        { name: "children", type: "node", description: "A single key, e.g. “Esc”." },
        {
          name: "keys",
          type: "array",
          description:
            'A key combination instead of `children`, e.g. `["Ctrl", "K"]`. Each key renders as a nested `<kbd>`.',
        },
        {
          name: "separator",
          type: "node",
          default: '"+"',
          description:
            "Shown between `keys`, with a space on each side, e.g. “then” for a sequence.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Key height (20 or 24 px) and font size.",
        },
      ],
    },
  ],
  accessibility: [
    "Uses `<kbd>`, the HTML element for keyboard input; combinations nest one `<kbd>` per key inside an outer one.",
    "The separator is real text with spaces around it, so screen readers read “Ctrl plus Shift plus P” rather than running the keys together.",
    "Symbols such as ⌘, ⌥ or ↵ may be read oddly or not at all. Prefer words (“Ctrl”, “Enter”), or add visually hidden text next to the symbol.",
    "Showing a shortcut doesn't create one: bind the keys in your own code, and avoid shortcuts that browsers or screen readers already use.",
  ],
};
