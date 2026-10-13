import { ToggleGroup } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Controlled from "../../examples/toggle-group/Controlled.jsx";
import controlledCode from "../../examples/toggle-group/Controlled.jsx?raw";
import Multiple from "../../examples/toggle-group/Multiple.jsx";
import multipleCode from "../../examples/toggle-group/Multiple.jsx?raw";
import SizePicker from "../../examples/toggle-group/SizePicker.jsx";
import sizePickerCode from "../../examples/toggle-group/SizePicker.jsx?raw";
import Sizes from "../../examples/toggle-group/Sizes.jsx";
import sizesCode from "../../examples/toggle-group/Sizes.jsx?raw";
import VerticalFullWidth from "../../examples/toggle-group/VerticalFullWidth.jsx";
import verticalFullWidthCode from "../../examples/toggle-group/VerticalFullWidth.jsx?raw";
import ViewSwitcher from "../../examples/toggle-group/ViewSwitcher.jsx";
import viewSwitcherCode from "../../examples/toggle-group/ViewSwitcher.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const types = ["single", "multiple"];
const sizes = ["sm", "md", "lg"];
const variants = ["outline", "ghost"];
const orientations = ["horizontal", "vertical"];
const items = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

function ToggleGroupThumbnail() {
  return (
    <ToggleGroup label="Size" defaultValue="m">
      {items.map((item) => (
        <ToggleGroup.Item key={item.value} value={item.value} disabled={item.value === "xl"}>
          {item.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup>
  );
}

// `formatJsx` writes a self-closing tag; give it the items as children.
const withItems = (tag) =>
  [
    tag.replace(/ ?\/>$/, ">"),
    ...items.map(
      (item) => `  <ToggleGroup.Item value="${item.value}">${item.label}</ToggleGroup.Item>`,
    ),
    "</ToggleGroup>",
  ].join("\n");

export const toggleGroupDoc = {
  slug: "toggle-group",
  name: "ToggleGroup",
  category: "Forms",
  summary: "Set of toggle buttons where one or several can be pressed, like a size picker.",
  description:
    'A row of toggle buttons for a quick choice: a size (S / M / L), a grid or list view, a date range or a few filters. With `type="single"` one item is pressed at a time; with `type="multiple"` any number. It\'s one Tab stop, the arrow keys move between items, and `name` submits the value with a form.',
  keywords: [
    "segmented control",
    "button group",
    "toggle",
    "size picker",
    "view switcher",
    "filter",
    "radio buttons",
    "pressed",
  ],
  imports: ["ToggleGroup"],
  Thumbnail: ToggleGroupThumbnail,
  Playground: definePlayground({
    defaults: {
      type: "single",
      size: "md",
      variant: "outline",
      orientation: "horizontal",
      label: "Size",
      allowDeselect: false,
      fullWidth: false,
      disabled: false,
    },
    controls: {
      type: { type: "select", label: "Type", options: types },
      size: { type: "select", label: "Size", options: sizes },
      variant: { type: "select", label: "Variant", options: variants },
      orientation: { type: "select", label: "Orientation", options: orientations },
      label: { type: "text", label: "Label" },
      allowDeselect: { type: "boolean", label: "Allow deselect (single)" },
      fullWidth: { type: "boolean", label: "Full width" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 360, display: "flex", justifyContent: "center" }}>
        <ToggleGroup
          // Switching the type starts over with a matching default value.
          key={values.type}
          type={values.type}
          defaultValue={values.type === "multiple" ? ["m"] : "m"}
          size={values.size}
          variant={values.variant}
          orientation={values.orientation}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Size"}
          allowDeselect={values.allowDeselect}
          fullWidth={values.fullWidth}
          disabled={values.disabled}
        >
          {items.map((item) => (
            <ToggleGroup.Item key={item.value} value={item.value}>
              {item.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </div>
    ),
    code: (values) =>
      withImport(
        ["ToggleGroup"],
        withItems(
          formatJsx(
            "ToggleGroup",
            {
              type: values.type,
              label: values.label || undefined,
              "aria-label": values.label ? undefined : "Size",
              defaultValue: values.type === "multiple" ? expr('["m"]') : "m",
              size: values.size,
              variant: values.variant,
              orientation: values.orientation,
              allowDeselect: values.type === "single" && values.allowDeselect,
              fullWidth: values.fullWidth,
              disabled: values.disabled,
            },
            undefined,
            {
              defaults: {
                type: "single",
                size: "md",
                variant: "outline",
                orientation: "horizontal",
              },
            },
          ),
        ),
      ),
  }),
  examples: [
    {
      id: "size-picker",
      title: "Size picker in a form",
      description:
        "With `name`, the pressed value is submitted with the form. A disabled item (here an out-of-stock size) can't be pressed and the arrow keys skip it — give it an `aria-label` that says why.",
      Component: SizePicker,
      code: sizePickerCode,
    },
    {
      id: "view-switcher",
      title: "Grid or list view",
      description:
        "Icon-only items need an `aria-label`. Without a visible `label`, name the group with `aria-label` too.",
      Component: ViewSwitcher,
      code: viewSwitcherCode,
    },
    {
      id: "multiple",
      title: "Multiple selection",
      description:
        '`type="multiple"` lets any number of items be pressed; the value is an array. The `ghost` variant separates the items and wraps on small screens.',
      Component: Multiple,
      code: multipleCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `value` and `onValueChange` to use the choice elsewhere, like this revenue figure. A second click on the pressed item keeps it pressed; set `allowDeselect` to let it clear the value (`null`).",
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: "vertical-full-width",
      title: "Vertical and full width",
      description:
        '`orientation="vertical"` stacks the items (↑ and ↓ move between them); `fullWidth` stretches them to fill the container.',
      Component: VerticalFullWidth,
      code: verticalFullWidthCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "ToggleGroup",
      description:
        'Root `<div role="group">`; accepts its native attributes, and the `ref` points to it.',
      props: [
        {
          name: "type",
          type: '"single" | "multiple"',
          default: '"single"',
          description: "Whether one or several items can be pressed.",
        },
        {
          name: "value",
          type: "string | array",
          description:
            "Pressed item (controlled): a string or `null` in single mode, an array of strings in multiple mode.",
        },
        {
          name: "defaultValue",
          type: "string | array",
          description:
            "Initially pressed item(s) when uncontrolled. Nothing is pressed by default. Resetting the form restores it.",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description: "Called with the new value — a string or `null`, or an array.",
        },
        {
          name: "allowDeselect",
          type: "boolean",
          default: "false",
          description:
            "Single mode: clicking the pressed item again unpresses it. Off by default, so a choice can't be emptied.",
        },
        {
          name: "label",
          type: "node",
          description:
            "Visible label above the items; it names the group. Without it, pass `aria-label`.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Form field name. The value is submitted with hidden inputs, one per pressed item.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Height, padding and font size of the items.",
        },
        {
          name: "variant",
          type: '"outline" | "ghost"',
          default: '"outline"',
          description: "Joined, segmented buttons, or separate borderless buttons that wrap.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Lays the items out in a row (← → move) or a column (↑ ↓ move).",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Stretches the items to fill the container.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables every item.",
        },
      ],
    },
    {
      title: "ToggleGroup.Item",
      description:
        "A `<button>` with `aria-pressed`; also exported as `ToggleGroupItem`. Accepts native `<button>` attributes, and the `ref` points to it.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Identifies the item in the group's value.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents pressing the item; the arrow keys skip it.",
        },
        {
          name: "children",
          type: "node",
          description: "Text and/or an icon. An icon-only item needs an `aria-label`.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab"],
      description:
        "Moves focus into the group — to the last focused item, else the pressed one, else the first — and on out of it.",
    },
    {
      keys: ["→", "←"],
      description:
        "Moves focus to the next or previous item, skipping disabled items and wrapping around (horizontal).",
    },
    {
      keys: ["↓", "↑"],
      description: "Moves focus to the next or previous item (vertical).",
    },
    { keys: ["Home", "End"], description: "Moves focus to the first or last item." },
    { keys: ["Space", "Enter"], description: "Presses or unpresses the focused item." },
  ],
  accessibility: [
    'The items are native `<button>`s with `aria-pressed`, inside a `role="group"` named by `label` (through `aria-labelledby`) or `aria-label`.',
    "The group is a single Tab stop (roving tabindex): the arrow keys move focus, and Space or Enter press the focused item, so moving around never changes the value by accident.",
    "Icon-only items need an `aria-label`. A disabled item can't be focused; say why in its label, e.g. “XL, out of stock”.",
    "Pressed items are marked with a border and tint, and with system highlight colors in forced-colors mode.",
    "For a choice that must be made in a longer form, a RadioGroup gives the same result with native radios.",
  ],
};
