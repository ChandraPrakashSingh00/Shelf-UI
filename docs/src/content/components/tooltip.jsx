import { Button, Tooltip } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/tooltip/Basic.jsx";
import basicCode from "../../examples/tooltip/Basic.jsx?raw";
import Controlled from "../../examples/tooltip/Controlled.jsx";
import controlledCode from "../../examples/tooltip/Controlled.jsx?raw";
import DisabledButton from "../../examples/tooltip/DisabledButton.jsx";
import disabledButtonCode from "../../examples/tooltip/DisabledButton.jsx?raw";
import IconButtons from "../../examples/tooltip/IconButtons.jsx";
import iconButtonsCode from "../../examples/tooltip/IconButtons.jsx?raw";
import Sides from "../../examples/tooltip/Sides.jsx";
import sidesCode from "../../examples/tooltip/Sides.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sides = ["top", "right", "bottom", "left"];
const delays = ["0", "300", "700"];
const playgroundTrigger = '<Button variant="outline">Deploy</Button>';

// formatJsx writes text children only: turn its self-closing tag into an
// opening tag and nest the trigger element inside.
const wrapTrigger = (tag) => `${tag.replace(/\s*\/>$/, ">")}\n  ${playgroundTrigger}\n</Tooltip>`;

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}

function TooltipThumbnail() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <span
        style={{
          padding: "0.375rem 0.625rem",
          borderRadius: "var(--cps-radius-sm)",
          backgroundColor: "var(--cps-color-text)",
          boxShadow: "var(--cps-shadow-md)",
          color: "var(--cps-color-bg)",
          fontFamily: "var(--cps-font-sans)",
          fontSize: "var(--cps-font-size-xs)",
          fontWeight: "var(--cps-font-weight-medium)",
        }}
      >
        Copy a link to this deployment
      </span>
      <Button size="sm" variant="outline" aria-label="Copy link">
        <LinkIcon />
      </Button>
    </div>
  );
}

export const tooltipDoc = {
  slug: "tooltip",
  name: "Tooltip",
  category: "Overlays",
  summary: "Short hint that appears when an element is hovered or focused.",
  description:
    "A small bubble with a short hint about an element, like what an icon button does. It appears on hover (after a short delay) and on keyboard focus, and it's linked to its trigger with `aria-describedby`. A tooltip supplements a label; it never replaces one.",
  keywords: ["hint", "title", "hover", "help text", "describedby", "info", "label", "icon button"],
  imports: ["Tooltip"],
  Thumbnail: TooltipThumbnail,
  Playground: definePlayground({
    defaults: {
      content: "Deploys the latest commit on main",
      side: "top",
      delay: "300",
      disabled: false,
    },
    controls: {
      content: { type: "text", label: "Content" },
      side: { type: "select", label: "Side", options: sides },
      delay: { type: "select", label: "Delay (ms)", options: delays },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <Tooltip
        content={values.content}
        side={values.side}
        delay={Number(values.delay)}
        disabled={values.disabled}
      >
        <Button variant="outline">Deploy</Button>
      </Tooltip>
    ),
    code: (values) =>
      withImport(
        ["Button", "Tooltip"],
        wrapTrigger(
          formatJsx(
            "Tooltip",
            {
              content: values.content || undefined,
              side: values.side,
              delay: Number(values.delay),
              disabled: values.disabled,
            },
            undefined,
            { defaults: { side: "top", delay: 300 } },
          ),
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Hover over the button, or Tab to it: keyboard focus shows the tooltip right away. Press Escape to hide it.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "icon-buttons",
      title: "Icon buttons",
      description:
        "An icon-only button still needs an `aria-label` to name it. The tooltip adds a visible hint on top.",
      Component: IconButtons,
      code: iconButtonsCode,
    },
    {
      id: "sides",
      title: "Sides",
      description:
        "`side` picks where the tooltip opens. It flips to the opposite side when there isn't room, and never leaves the viewport.",
      Component: Sides,
      code: sidesCode,
    },
    {
      id: "disabled-button",
      title: "On a disabled button",
      description:
        "Disabled buttons can't be focused and don't fire pointer events. Wrap one in a focusable `<span tabIndex={0}>` so people can still find out why it's disabled.",
      Component: DisabledButton,
      code: disabledButtonCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description: "Pass `open` and `onOpenChange` to keep the open state in your own component.",
      Component: Controlled,
      code: controlledCode,
    },
  ],
  api: [
    {
      title: "Tooltip",
      description:
        "Every other prop, and the `ref`, go to the trigger, so a Tooltip can itself be the `trigger` of a `Dropdown` or `Popover`. The tooltip renders in a portal on `document.body`.",
      props: [
        {
          name: "content",
          type: "node",
          required: true,
          description: "What the tooltip shows. Keep it short, plain text.",
        },
        {
          name: "children",
          type: "element",
          required: true,
          description:
            "The trigger: one element that accepts a ref and event props, like a DOM element or `Button`.",
        },
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"top"',
          description: "Preferred side. Flips to the opposite side when there isn't room.",
        },
        {
          name: "delay",
          type: "number",
          default: "300",
          description:
            "Milliseconds before it opens on hover. Keyboard focus opens it immediately.",
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
          description: "Called when the tooltip opens or closes.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Never shows the tooltip.",
        },
        { name: "className", type: "string", description: "Class for the tooltip bubble." },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab"],
      description: "Focusing the trigger shows the tooltip right away; moving focus away hides it.",
    },
    {
      keys: ["Escape"],
      description: "Hides the tooltip without moving focus or the pointer.",
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA tooltip pattern: the bubble has `role="tooltip"`, and while it\'s visible the trigger points to it with `aria-describedby`.',
    "A tooltip supplements a label and never replaces one: icon-only buttons still need an `aria-label`. Touch screens can't hover, so don't hide essential information in a tooltip.",
    "Meets WCAG 1.4.13: it stays open while the pointer is over it or the trigger has focus, and Escape hides it without moving focus.",
    "Disabled buttons don't fire pointer events and can't be focused, so wrap them in a `<span tabIndex={0}>`.",
    "Don't put links, buttons or other interactive content in a tooltip: it can't be reached with the keyboard. Use a Popover instead.",
  ],
};
