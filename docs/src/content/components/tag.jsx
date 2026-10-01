import { Tag } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Disabled from "../../examples/tag/Disabled.jsx";
import disabledCode from "../../examples/tag/Disabled.jsx?raw";
import FilterBar from "../../examples/tag/FilterBar.jsx";
import filterBarCode from "../../examples/tag/FilterBar.jsx?raw";
import Icons from "../../examples/tag/Icons.jsx";
import iconsCode from "../../examples/tag/Icons.jsx?raw";
import Sizes from "../../examples/tag/Sizes.jsx";
import sizesCode from "../../examples/tag/Sizes.jsx?raw";
import Variants from "../../examples/tag/Variants.jsx";
import variantsCode from "../../examples/tag/Variants.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["neutral", "primary", "success", "warning", "danger"];
const sizes = ["sm", "md"];
const noop = () => {};

function TagThumbnail() {
  return (
    <>
      <Tag variant="primary" onRemove={noop}>
        Red
      </Tag>
      <Tag variant="primary" onRemove={noop}>
        Under ₹999
      </Tag>
      <Tag>Cotton</Tag>
    </>
  );
}

export const tagDoc = {
  slug: "tag",
  name: "Tag",
  category: "Data display",
  summary: "Compact label for a category or an applied filter, optionally removable.",
  description:
    "Labels an item with a category or attribute — `Electronics`, `Free delivery` — or shows an applied filter like `Under ₹999` that can be removed with its ✕ button. It uses the Badge palette; use Badge for statuses and counts, and Tag for things people add and remove.",
  keywords: ["chip", "pill", "filter", "label", "token", "removable", "facet", "category"],
  imports: ["Tag"],
  Thumbnail: TagThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "primary",
      size: "md",
      label: "Under ₹999",
      removable: true,
      disabled: false,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      removable: { type: "boolean", label: "Removable (onRemove)" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <Tag
        variant={values.variant}
        size={values.size}
        onRemove={values.removable ? noop : undefined}
        disabled={values.disabled}
      >
        {values.label || "Under ₹999"}
      </Tag>
    ),
    code: (values) =>
      withImport(
        ["Tag"],
        formatJsx(
          "Tag",
          {
            variant: values.variant,
            size: values.size,
            onRemove: values.removable ? expr("() => removeFilter(filter.id)") : undefined,
            disabled: values.disabled,
          },
          values.label || "Under ₹999",
          { defaults: { variant: "neutral", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: "The same palette as Badge. Pick the variant that matches the meaning.",
      Component: Variants,
      code: variantsCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "icons",
      title: "With an icon",
      description: "`icon` adds a decorative icon before the text.",
      Component: Icons,
      code: iconsCode,
    },
    {
      id: "filter-bar",
      title: "Removable filters",
      description:
        "`onRemove` adds a ✕ button, named “Remove filter Red” from `removeLabel` and the tag's text. Backspace and Delete remove the focused tag too. When a tag goes, move focus yourself — here to the next tag, or to the results after the last one or “Clear all”.",
      Component: FilterBar,
      code: filterBarCode,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "`disabled` dims the tag and disables its remove button.",
      Component: Disabled,
      code: disabledCode,
    },
  ],
  api: [
    {
      title: "Tag",
      description: "Root `<span>`; accepts its native attributes, and the `ref` points to it.",
      props: [
        { name: "children", type: "node", description: "The tag's text." },
        {
          name: "variant",
          type: '"neutral" | "primary" | "success" | "warning" | "danger"',
          default: '"neutral"',
          description: "Color scheme.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Height (24 or 32 px) and font size.",
        },
        { name: "icon", type: "node", description: "Decorative icon before the text." },
        {
          name: "onRemove",
          type: "function(event)",
          description:
            "Adds a remove (✕) button, called when it's clicked or when Backspace or Delete is pressed on it.",
        },
        {
          name: "removeLabel",
          type: "string",
          default: '"Remove"',
          description:
            "Start of the remove button's accessible name, followed by the tag's text: “Remove Red”.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Dims the tag and disables its remove button.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Tab"], description: "Moves focus to the next tag's remove button." },
    {
      keys: ["Enter", "Space", "Backspace", "Delete"],
      description: "On a remove button: removes the tag (calls `onRemove`).",
    },
  ],
  accessibility: [
    "The tag itself is plain text; only the remove button is focusable.",
    "The remove button is labelled by its own `aria-label` plus the tag's text (`aria-labelledby`), so each one has a unique name like “Remove Red” instead of many identical “Remove” buttons.",
    "Removing a tag also removes the focused button. Move focus somewhere sensible in `onRemove` — the next tag, the previous one or a “Clear all” button — so keyboard users don't lose their place.",
    "Don't rely on color alone: the text says what the tag means.",
  ],
};
