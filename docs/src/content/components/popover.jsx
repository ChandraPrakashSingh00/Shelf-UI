import { Button, Popover } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Controlled from "../../examples/popover/Controlled.jsx";
import controlledCode from "../../examples/popover/Controlled.jsx?raw";
import InfoLink from "../../examples/popover/InfoLink.jsx";
import infoLinkCode from "../../examples/popover/InfoLink.jsx?raw";
import Placement from "../../examples/popover/Placement.jsx";
import placementCode from "../../examples/popover/Placement.jsx?raw";
import QuickSettings from "../../examples/popover/QuickSettings.jsx";
import quickSettingsCode from "../../examples/popover/QuickSettings.jsx?raw";
import ShareLink from "../../examples/popover/ShareLink.jsx";
import shareLinkCode from "../../examples/popover/ShareLink.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sides = ["bottom", "top", "left", "right"];
const alignments = ["start", "center", "end"];
const playgroundContent = "Anyone with the link can view this project.";

function PopoverThumbnail() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        width: "100%",
        maxWidth: 220,
      }}
    >
      <Button size="sm" variant="outline">
        Share
      </Button>
      <div
        style={{
          display: "grid",
          gap: 8,
          width: "100%",
          padding: 12,
          border: "1px solid var(--shelf-color-border)",
          borderRadius: "var(--shelf-radius-lg)",
          backgroundColor: "var(--shelf-color-surface)",
          boxShadow: "var(--shelf-shadow-md)",
          color: "var(--shelf-color-text)",
          fontFamily: "var(--shelf-font-sans)",
          fontSize: "var(--shelf-font-size-xs)",
        }}
      >
        <strong style={{ fontSize: "var(--shelf-font-size-sm)" }}>Share project</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              padding: "4px 8px",
              overflow: "hidden",
              border: "1px solid var(--shelf-color-border-strong)",
              borderRadius: "var(--shelf-radius-sm)",
              color: "var(--shelf-color-text-muted)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            example.com/p/storefront-web
          </span>
          <Button size="sm">Copy</Button>
        </div>
      </div>
    </div>
  );
}

export const popoverDoc = {
  slug: "popover",
  name: "Popover",
  category: "Overlays",
  summary: "Small non-modal dialog that opens from a button, for quick interactive content.",
  description:
    "A small, non-modal dialog anchored to a button, for quick interactive content like a share link, a few settings or a short explanation with a link. Focus moves into it when it opens, Tab flows through it to the rest of the page, and Escape or a click outside closes it.",
  keywords: ["popup", "dialog", "flyout", "overlay", "share", "quick settings", "popper", "bubble"],
  imports: ["Popover"],
  Thumbnail: PopoverThumbnail,
  Playground: definePlayground({
    defaults: {
      side: "bottom",
      align: "start",
      title: "Share project",
      showCloseButton: false,
    },
    controls: {
      side: { type: "select", label: "Side", options: sides },
      align: { type: "select", label: "Align", options: alignments },
      title: { type: "text", label: "Title" },
      showCloseButton: { type: "boolean", label: "Close button" },
    },
    render: (values) => (
      <Popover
        trigger={<Button variant="outline">Share</Button>}
        side={values.side}
        align={values.align}
        title={values.title || undefined}
        showCloseButton={values.showCloseButton}
      >
        {playgroundContent}
      </Popover>
    ),
    code: (values) =>
      withImport(
        ["Button", "Popover"],
        formatJsx(
          "Popover",
          {
            trigger: expr('<Button variant="outline">Share</Button>'),
            side: values.side,
            align: values.align,
            title: values.title || undefined,
            showCloseButton: values.showCloseButton,
          },
          playgroundContent,
          { defaults: { side: "bottom", align: "start" } },
        ),
      ),
  }),
  examples: [
    {
      id: "share-link",
      title: "Share link",
      description:
        "Focus moves to the first field when it opens, so the link is selected and ready to copy. Tab on from the Copy button to leave the popover.",
      Component: ShareLink,
      code: shareLinkCode,
      minHeight: "20rem",
    },
    {
      id: "quick-settings",
      title: "Quick settings",
      description:
        "Toggle buttons with `aria-pressed` for a few settings, and a close button in the header (`showCloseButton`).",
      Component: QuickSettings,
      code: quickSettingsCode,
      minHeight: "20rem",
    },
    {
      id: "info-link",
      title: "Explanation with a link",
      description:
        "Without a `title`, name the dialog with `label`. Unlike a tooltip, a popover can hold links and buttons.",
      Component: InfoLink,
      code: infoLinkCode,
      minHeight: "15rem",
    },
    {
      id: "placement",
      title: "Sides and alignment",
      description:
        "`side` picks the edge of the trigger it opens from, and `align` lines it up with the trigger's start, center or end.",
      Component: Placement,
      code: placementCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Drive it with `open` and `onOpenChange`. When your code closes it while focus is inside, like the Save button here, focus returns to the trigger.",
      Component: Controlled,
      code: controlledCode,
      minHeight: "19rem",
    },
  ],
  api: [
    {
      title: "Popover",
      description:
        "Other props (such as `style` or `aria-describedby`) go to the content panel, and the `ref` points to it (`null` while closed). Like `Dropdown`, it's positioned with CSS next to its trigger: it doesn't flip near the edges of the viewport, and an `overflow: hidden` ancestor can clip it.",
      props: [
        {
          name: "trigger",
          type: "element",
          required: true,
          description:
            "Element that toggles the popover, e.g. `<Button>`. It must pass `id`, `onClick`, `onKeyDown` and ARIA props to a focusable element.",
        },
        { name: "children", type: "node", description: "The popover's content." },
        {
          name: "title",
          type: "node",
          description: "Heading at the top, and the dialog's accessible name.",
        },
        {
          name: "label",
          type: "string",
          description: "Accessible name when there's no `title`. Defaults to the trigger's text.",
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
          description: "Called when the popover opens or closes.",
        },
        {
          name: "side",
          type: '"bottom" | "top" | "left" | "right"',
          default: '"bottom"',
          description: "Edge of the trigger it opens from.",
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          default: '"start"',
          description: "Alignment with the trigger along that edge.",
        },
        {
          name: "showCloseButton",
          type: "boolean",
          default: "false",
          description: "Adds a × button to the header.",
        },
        {
          name: "closeLabel",
          type: "string",
          default: '"Close"',
          description: "Accessible name of the close button.",
        },
        {
          name: "initialFocusRef",
          type: "ref",
          description:
            "Ref of the element to focus on open. Defaults to the first focusable element, or the panel itself.",
        },
        { name: "className", type: "string", description: "Class for the content panel." },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Enter", "Space"],
      description: "On the trigger: opens or closes the popover. Opening moves focus inside.",
    },
    {
      keys: ["Tab", "Shift + Tab"],
      description:
        "Moves through the popover's controls in page order. Moving focus out of the popover closes it.",
    },
    { keys: ["Escape"], description: "Closes the popover and returns focus to the trigger." },
  ],
  accessibility: [
    'The panel is a non-modal `role="dialog"`, named by `title` (or `label`, or the trigger\'s text). The trigger gets `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.',
    "When it opens, focus moves to `initialFocusRef`, the first focusable element or the panel. When it closes with focus inside (Escape, the close button or your own code), focus returns to the trigger.",
    "It renders right after its trigger, so the Tab order runs from the trigger through the popover to the rest of the page. Focus isn't trapped: tabbing out closes it.",
    "A click outside closes it without moving focus, so the click still lands where it was aimed.",
    "For a short, non-interactive hint use a Tooltip; for a task that needs full attention use a Modal.",
  ],
};
