import { Accordion } from "@codecps/ui";
import Basic from "../../examples/accordion/Basic.jsx";
import basicCode from "../../examples/accordion/Basic.jsx?raw";
import Controlled from "../../examples/accordion/Controlled.jsx";
import controlledCode from "../../examples/accordion/Controlled.jsx?raw";
import Disabled from "../../examples/accordion/Disabled.jsx";
import disabledCode from "../../examples/accordion/Disabled.jsx?raw";
import Multiple from "../../examples/accordion/Multiple.jsx";
import multipleCode from "../../examples/accordion/Multiple.jsx?raw";

function AccordionThumbnail() {
  return (
    <Accordion defaultValue={["billing"]} style={{ width: "100%", maxWidth: 260 }}>
      <Accordion.Item value="billing" title="How does billing work?">
        Monthly, per project.
      </Accordion.Item>
      <Accordion.Item value="refunds" title="Do you offer refunds?">
        Within 14 days.
      </Accordion.Item>
    </Accordion>
  );
}

export const accordionDoc = {
  slug: "accordion",
  name: "Accordion",
  category: "Navigation",
  summary: "Stacked sections that expand and collapse to show their content.",
  description:
    "A vertical stack of headers that each show or hide a section of content, like the answers in an FAQ or the groups of a long settings page. Compose it from `Accordion.Item`s; by default one item is open at a time, and `multiple` lets several stay open.",
  keywords: [
    "collapse",
    "collapsible",
    "expand",
    "disclosure",
    "faq",
    "expansion panel",
    "details",
    "toggle",
  ],
  imports: ["Accordion"],
  Thumbnail: AccordionThumbnail,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Click a question, or Tab to a header and press Enter. Opening one item closes the others; `defaultValue` opens the first answer.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "multiple",
      title: "Multiple open items",
      description: "With `multiple`, opening an item leaves the others open.",
      Component: Multiple,
      code: multipleCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `value` and `onValueChange` to drive the open items from your own state, here from “Expand all” and “Collapse all” buttons.",
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: "disabled",
      title: "Disabled item",
      description:
        "A disabled item can't be opened, and the arrow keys skip it. Focus a header and try ↑ and ↓.",
      Component: Disabled,
      code: disabledCode,
    },
  ],
  api: [
    {
      title: "Accordion",
      description: "Renders a `<div>` and accepts its native attributes. The `ref` points to it.",
      props: [
        { name: "value", type: "array", description: "Values of the open items (controlled)." },
        {
          name: "defaultValue",
          type: "array",
          default: "[]",
          description: "Items open at first (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(values)",
          description: "Called with the new array of open values.",
        },
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          description:
            "Lets several items be open at once. Otherwise opening an item closes the others. An open item can always be closed.",
        },
        { name: "children", type: "node", description: "`Accordion.Item` elements." },
      ],
    },
    {
      title: "Accordion.Item",
      description:
        "Also exported as `AccordionItem`. Renders a `<div>` holding the heading and the panel; other props and the `ref` go to that `<div>`.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Identifies the item in the accordion's `value`.",
        },
        {
          name: "title",
          type: "node",
          required: true,
          description: "Content of the header button.",
        },
        {
          name: "headingLevel",
          type: "2 | 3 | 4 | 5 | 6",
          default: "3",
          description: "Level of the heading around the header button. Match your page outline.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents toggling the item; the arrow keys skip it.",
        },
        {
          name: "children",
          type: "node",
          description: "Panel content. It stays mounted, hidden, while the item is closed.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Enter", "Space"], description: "Expands or collapses the focused item." },
    {
      keys: ["↓", "↑"],
      description:
        "Moves focus to the next or previous header, skipping disabled items and wrapping around.",
    },
    { keys: ["Home", "End"], description: "Moves focus to the first or last header." },
    {
      keys: ["Tab"],
      description: "Moves through the headers and the content of open panels, in page order.",
    },
  ],
  accessibility: [
    "Follows the WAI-ARIA accordion pattern: each header is a `<button>` with `aria-expanded` and `aria-controls`, inside a heading (`h3` by default; set `headingLevel` to fit your page outline).",
    'Each open panel is a `role="region"` labelled by its header, so screen reader users can find it from the landmarks list.',
    "Closed panels have the `hidden` attribute, so they're hidden from everyone, including screen readers. Their content stays mounted, so form fields keep their values.",
    "Disabled items use the native `disabled` attribute: Tab and the arrow keys skip them.",
    "The chevron is decorative (`aria-hidden`); `aria-expanded` announces whether an item is open.",
  ],
};
