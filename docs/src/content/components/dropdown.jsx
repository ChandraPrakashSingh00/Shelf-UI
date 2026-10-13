import { Button } from "shelf-ui-react";
import AlignEnd from "../../examples/dropdown/AlignEnd.jsx";
import alignEndCode from "../../examples/dropdown/AlignEnd.jsx?raw";
import Basic from "../../examples/dropdown/Basic.jsx";
import basicCode from "../../examples/dropdown/Basic.jsx?raw";
import WithIcons from "../../examples/dropdown/WithIcons.jsx";
import withIconsCode from "../../examples/dropdown/WithIcons.jsx?raw";

function DropdownThumbnail() {
  return (
    <div className="docs-thumb-menu">
      <Button size="sm" variant="outline">
        Actions
      </Button>
      <ul className="docs-thumb-menu__list">
        <li>Rename</li>
        <li className="docs-thumb-menu__active">Duplicate</li>
        <li className="docs-thumb-menu__danger">Delete</li>
      </ul>
    </div>
  );
}

export const dropdownDoc = {
  slug: "dropdown",
  name: "Dropdown",
  category: "Actions",
  summary: "Menu of actions that opens from a button.",
  description:
    "A menu button: a list of actions that opens from a trigger. Use it to group secondary actions, like a project's rename, duplicate and delete options, without cluttering the page.",
  keywords: ["menu", "menu button", "actions", "context menu", "overflow", "more", "popover"],
  imports: ["Dropdown"],
  Thumbnail: DropdownThumbnail,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "`onSelect` receives the `id` of the chosen item. Try it with the keyboard: Enter, then ↑ ↓.",
      Component: Basic,
      code: basicCode,
      minHeight: "18rem",
    },
    {
      id: "icons-and-states",
      title: "Icons, disabled and danger items",
      description:
        "Disabled items are skipped by the keyboard; `danger` marks destructive actions.",
      Component: WithIcons,
      code: withIconsCode,
      minHeight: "18rem",
    },
    {
      id: "align-end",
      title: "Aligned to the end",
      description: 'Use `align="end"` for triggers on the right edge, like an account menu.',
      Component: AlignEnd,
      code: alignEndCode,
      minHeight: "18rem",
    },
  ],
  api: [
    {
      title: "Dropdown",
      props: [
        {
          name: "trigger",
          type: "element",
          required: true,
          description:
            "Element that opens the menu, e.g. `<Button>`. It must pass `id`, `onClick`, `onKeyDown` and ARIA props to a focusable element.",
        },
        {
          name: "items",
          type: "array",
          required: true,
          description: "The menu items (see below).",
        },
        {
          name: "onSelect",
          type: "function(id)",
          description: "Called with the `id` of the selected item.",
        },
        {
          name: "label",
          type: "string",
          description: "Accessible name for the menu. Defaults to the trigger's text.",
        },
        {
          name: "align",
          type: '"start" | "end"',
          default: '"start"',
          description: "Aligns the menu with the trigger's start or end edge.",
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
          description: "Called when the menu opens or closes.",
        },
        { name: "className", type: "string", description: "Class for the wrapper element." },
      ],
    },
    {
      title: "Dropdown item",
      description: "Each entry in `items` is an object with these keys.",
      props: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Unique key, passed to `onSelect`.",
        },
        { name: "label", type: "node", required: true, description: "Visible text." },
        { name: "icon", type: "node", description: "Decorative icon before the label." },
        {
          name: "disabled",
          type: "boolean",
          description: "Shown but not selectable, and skipped by the keyboard.",
        },
        { name: "danger", type: "boolean", description: "Styles the item as destructive." },
        { name: "onSelect", type: "function", description: "Called when this item is selected." },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Enter", "Space", "↓"],
      description: "On the trigger: opens the menu and focuses the first item.",
    },
    { keys: ["↑"], description: "On the trigger: opens the menu and focuses the last item." },
    {
      keys: ["↓", "↑"],
      description:
        "Moves to the next or previous item, skipping disabled ones and wrapping around.",
    },
    { keys: ["Home", "End"], description: "Moves to the first or last item." },
    { keys: ["Enter", "Space"], description: "On an item: selects it and closes the menu." },
    { keys: ["Escape", "Tab"], description: "Closes the menu and returns focus to the trigger." },
  ],
  accessibility: [
    'Follows the WAI-ARIA menu button pattern: the trigger gets `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`.',
    'The menu has `role="menu"` and is labelled by the trigger (or `label`); items have `role="menuitem"`.',
    "Disabled items stay visible so people know the action exists, but they can't be selected.",
    "Clicking outside the menu closes it.",
  ],
};
