import { Button, CommandPalette } from "shelf-ui-react";
import { useState } from "react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/command-palette/Basic.jsx";
import basicCode from "../../examples/command-palette/Basic.jsx?raw";
import Hotkey from "../../examples/command-palette/Hotkey.jsx";
import hotkeyCode from "../../examples/command-palette/Hotkey.jsx?raw";
import IconsAndShortcuts from "../../examples/command-palette/IconsAndShortcuts.jsx";
import iconsAndShortcutsCode from "../../examples/command-palette/IconsAndShortcuts.jsx?raw";
import KeepOpen from "../../examples/command-palette/KeepOpen.jsx";
import keepOpenCode from "../../examples/command-palette/KeepOpen.jsx?raw";
import SearchOrders from "../../examples/command-palette/SearchOrders.jsx";
import searchOrdersCode from "../../examples/command-palette/SearchOrders.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const playgroundItems = [
  { id: "orders", label: "Orders", description: "18 waiting to be packed", group: "Go to" },
  { id: "products", label: "Products", description: "1,204 in your catalogue", group: "Go to" },
  { id: "customers", label: "Customers", group: "Go to", keywords: ["buyers"] },
  { id: "new-product", label: "Add a product", group: "Actions", shortcut: ["N"] },
  { id: "export", label: "Export orders", group: "Actions", keywords: ["csv", "download"] },
];

const footerHints = "↑ ↓ to move · Enter to run · Esc to close";

// The docs site's search already owns Ctrl/⌘ K, so the live preview has no hotkey.
function PaletteDemo(values) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={null}
        items={playgroundItems}
        label={values.label || undefined}
        placeholder={values.placeholder || undefined}
        emptyMessage={values.emptyMessage || undefined}
        closeOnSelect={values.closeOnSelect}
        footer={values.footer ? footerHints : undefined}
      />
    </>
  );
}

const kbdStyle = {
  padding: "1px 5px",
  border: "1px solid var(--shelf-color-border)",
  borderBottomWidth: 2,
  borderRadius: "var(--shelf-radius-sm)",
  backgroundColor: "var(--shelf-color-surface-muted)",
  color: "var(--shelf-color-text-muted)",
  fontFamily: "inherit",
  fontSize: 10,
  lineHeight: 1.2,
};

// Static look-alike: no dialog, portal or hotkey inside the inert card preview.
function CommandPaletteThumbnail() {
  const rows = [
    { label: "Orders", keys: ["G", "O"] },
    { label: "Products", keys: ["G", "P"] },
    { label: "Add a product", keys: ["N"] },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 230,
        overflow: "hidden",
        border: "1px solid var(--shelf-color-border)",
        borderRadius: "var(--shelf-radius-lg)",
        backgroundColor: "var(--shelf-color-surface)",
        boxShadow: "var(--shelf-shadow-md)",
        color: "var(--shelf-color-text)",
        fontFamily: "var(--shelf-font-sans)",
        fontSize: "var(--shelf-font-size-xs)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 10px",
          borderBottom: "1px solid var(--shelf-color-border)",
          color: "var(--shelf-color-text-subtle)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        Type a command or search…
      </div>
      <div style={{ display: "grid", gap: 1, padding: 4 }}>
        <span
          style={{
            padding: "2px 6px",
            color: "var(--shelf-color-text-subtle)",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          Go to
        </span>
        {rows.map((row, index) => (
          <span
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 6px",
              borderRadius: "var(--shelf-radius-sm)",
              backgroundColor: index === 0 ? "var(--shelf-color-primary-subtle)" : undefined,
              color: index === 0 ? "var(--shelf-color-primary-text)" : undefined,
              fontWeight: 500,
            }}
          >
            {row.label}
            <span style={{ display: "inline-flex", gap: 2 }}>
              {row.keys.map((key) => (
                <kbd key={key} style={kbdStyle}>
                  {key}
                </kbd>
              ))}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export const commandPaletteDoc = {
  slug: "command-palette",
  name: "CommandPalette",
  category: "Overlays",
  summary: "Searchable list of commands in a dialog, opened with Ctrl + K or ⌘ K.",
  description:
    "A search dialog for jumping to pages and running actions from the keyboard, like the Ctrl + K / ⌘ K menu of an admin dashboard. Commands can be grouped, with icons, descriptions and shortcut hints; typing filters them by label, description and keywords, and Enter runs the highlighted one.",
  keywords: [
    "command menu",
    "cmdk",
    "ctrl k",
    "cmd k",
    "spotlight",
    "quick search",
    "launcher",
    "hotkey",
    "keyboard shortcut",
  ],
  imports: ["CommandPalette"],
  Thumbnail: CommandPaletteThumbnail,
  Playground: definePlayground({
    defaults: {
      label: "Command palette",
      placeholder: "Type a command or search…",
      emptyMessage: "No results found.",
      closeOnSelect: true,
      footer: false,
    },
    controls: {
      label: { type: "text", label: "Label" },
      placeholder: { type: "text", label: "Placeholder" },
      emptyMessage: { type: "text", label: "Empty message" },
      closeOnSelect: { type: "boolean", label: "Close on select" },
      footer: { type: "boolean", label: "Footer" },
    },
    render: (values) => <PaletteDemo {...values} />,
    code: (values) =>
      withImport(
        ["CommandPalette"],
        formatJsx(
          "CommandPalette",
          {
            items: expr("commands"),
            onSelect: expr("(item) => runCommand(item.id)"),
            label: values.label || undefined,
            placeholder: values.placeholder || undefined,
            emptyMessage: values.emptyMessage || undefined,
            closeOnSelect: values.closeOnSelect ? undefined : expr("false"),
            footer: values.footer ? footerHints : undefined,
          },
          undefined,
          {
            defaults: {
              label: "Command palette",
              placeholder: "Type a command or search…",
              emptyMessage: "No results found.",
            },
          },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Give each command an `id`, a `label` and optionally a `group`; `onSelect` receives the chosen item. Here a button opens it (`open` and `onOpenChange`), and `hotkey={null}` leaves Ctrl / ⌘ K to this site's search.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "icons-and-shortcuts",
      title: "Icons, descriptions and shortcuts",
      description:
        "`icon`, `description` and `shortcut` (keys shown as a visual hint; handling them is up to your app) make commands easier to scan. A `disabled` command is shown but can't be run, and `footer` adds hints below the list.",
      Component: IconsAndShortcuts,
      code: iconsAndShortcutsCode,
    },
    {
      id: "hotkey",
      title: "Keyboard shortcut",
      description:
        '`hotkey` toggles the palette from anywhere on the page. It defaults to `"mod+k"` (Ctrl + K, or ⌘ K on a Mac); this site\'s search already uses that, so this example uses `"mod+j"`. Key presses that something else already handled (`preventDefault`) are ignored.',
      Component: Hotkey,
      code: hotkeyCode,
    },
    {
      id: "keep-open",
      title: "Keep open after selecting",
      description:
        "With `closeOnSelect={false}` the palette stays open, so you can add several products to the cart in a row. A live region in the footer confirms each addition.",
      Component: KeepOpen,
      code: keepOpenCode,
    },
    {
      id: "search-orders",
      title: "Searching records",
      description:
        "Commands can be data, like recent orders. `keywords` make the customer's city and the order status searchable, and every word typed must match. Items keep the order you give them.",
      Component: SearchOrders,
      code: searchOrdersCode,
    },
  ],
  api: [
    {
      title: "CommandPalette",
      description:
        "Other props (such as `aria-describedby`) go to the dialog panel, and the `ref` points to it (`null` while closed). It renders in a portal on `document.body`.",
      props: [
        {
          name: "items",
          type: "array",
          default: "[]",
          description:
            'Commands: `{ id, label, description, icon, group, keywords, shortcut, disabled, onSelect }` objects. `id` (unique) and `label` are required. `group` is a heading to list it under (groups appear in order of first use), `keywords` an array of extra search terms, `shortcut` an array of keys shown as a hint, e.g. `["G", "O"]`, and `onSelect` is called with the item when it runs.',
        },
        {
          name: "onSelect",
          type: "function(item)",
          description: "Called with the command that was run, after the item's own `onSelect`.",
        },
        {
          name: "closeOnSelect",
          type: "boolean",
          default: "true",
          description:
            "Closes the palette when a command runs. It closes first, so the command can move focus or open another dialog.",
        },
        { name: "open", type: "boolean", description: "Controlled open state." },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state when uncontrolled.",
        },
        {
          name: "onOpenChange",
          type: "function(open)",
          description: "Called when the palette opens or closes, including from the hotkey.",
        },
        {
          name: "hotkey",
          type: "string | null",
          default: '"mod+k"',
          description:
            'Shortcut that toggles the palette anywhere on the page, like `"mod+k"`, `"ctrl+shift+p"` or `"alt+j"`. `mod` is Ctrl, or ⌘ on Apple devices. `null` turns it off. A shortcut without Ctrl, ⌘ or Alt is ignored while typing in a field.',
        },
        {
          name: "filter",
          type: "function(item, query) | null",
          description:
            "Whether an item matches the search. By default every word must appear in the label, description or keywords, ignoring case and accents. `null` shows every item.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Type a command or search…"',
          description: "Placeholder of the search input.",
        },
        {
          name: "emptyMessage",
          type: "node",
          default: '"No results found."',
          description: "Shown, and announced, when nothing matches.",
        },
        {
          name: "label",
          type: "string",
          default: '"Command palette"',
          description: "Accessible name of the dialog and of the list of commands.",
        },
        {
          name: "searchLabel",
          type: "string",
          default: '"Search commands"',
          description: "Accessible name of the search input.",
        },
        { name: "footer", type: "node", description: "Content below the list, e.g. key hints." },
        { name: "className", type: "string", description: "Class for the dialog panel." },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Ctrl + K", "⌘ K"],
      description: "Opens or closes the palette from anywhere (the default `hotkey`).",
    },
    {
      keys: ["↓", "↑"],
      description:
        "Moves to the next or previous command, across groups, skipping disabled ones and wrapping around.",
    },
    { keys: ["Home", "End"], description: "Moves to the first or last command." },
    { keys: ["Enter"], description: "Runs the highlighted command." },
    { keys: ["Escape"], description: "Closes the palette and returns focus." },
    { keys: ["Tab", "Shift + Tab"], description: "Cycle through the controls inside the dialog." },
  ],
  accessibility: [
    'A modal `role="dialog"` named by `label`. It traps focus, locks page scroll, closes on Escape or an overlay click and returns focus to where it was, like `Modal`.',
    'The search input is a `role="combobox"` that controls a `role="listbox"`. Focus stays in the input while the highlighted command is announced through `aria-activedescendant` and marked `aria-selected`.',
    'Groups are `role="group"` elements named by their visible heading. Commands are named by their label and described by their description; icons and shortcut hints are hidden from screen readers.',
    "“No results” is announced through a polite live region, and the search starts empty every time the palette opens.",
    "Each shortcut hint is only a visual hint: use `aria-keyshortcuts` on the element that really handles a shortcut. Pick a `hotkey` that doesn't clash with the browser or with your page, and make the palette reachable from a visible button too.",
  ],
};
