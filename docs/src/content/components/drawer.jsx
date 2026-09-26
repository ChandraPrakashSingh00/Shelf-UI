import { Button, Drawer } from "@codecps/ui";
import { useState } from "react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import BottomSheet from "../../examples/drawer/BottomSheet.jsx";
import bottomSheetCode from "../../examples/drawer/BottomSheet.jsx?raw";
import Filters from "../../examples/drawer/Filters.jsx";
import filtersCode from "../../examples/drawer/Filters.jsx?raw";
import Navigation from "../../examples/drawer/Navigation.jsx";
import navigationCode from "../../examples/drawer/Navigation.jsx?raw";
import Sizes from "../../examples/drawer/Sizes.jsx";
import sizesCode from "../../examples/drawer/Sizes.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sides = ["right", "left", "bottom"];
const sizes = ["sm", "md", "lg"];

function DrawerDemo(values) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={values.side}
        size={values.size}
        title={values.title || undefined}
        aria-label={values.title ? undefined : "Example drawer"}
        description={values.description || undefined}
        closeOnOverlayClick={values.closeOnOverlayClick}
        closeOnEscape={values.closeOnEscape}
        hideCloseButton={values.hideCloseButton}
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        Drawer content goes here.
      </Drawer>
    </>
  );
}

const bar = (width) => ({
  display: "block",
  width,
  height: 8,
  borderRadius: 4,
  backgroundColor: "var(--cps-color-surface-hover)",
});

function DrawerThumbnail() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ display: "grid", gap: 12, width: "40%", padding: 18 }}>
        <span style={{ ...bar("80%"), backgroundColor: "var(--cps-color-border-strong)" }} />
        <span style={{ ...bar("100%"), backgroundColor: "var(--cps-color-border-strong)" }} />
        <span style={{ ...bar("65%"), backgroundColor: "var(--cps-color-border-strong)" }} />
        <span style={{ ...bar("90%"), backgroundColor: "var(--cps-color-border-strong)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "var(--cps-color-overlay)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "56%",
            padding: "14px 14px 12px",
            borderLeft: "1px solid var(--cps-color-border)",
            backgroundColor: "var(--cps-color-surface)",
            boxShadow: "var(--cps-shadow-lg)",
            color: "var(--cps-color-text)",
            fontSize: 13,
          }}
        >
          <strong>Filters</strong>
          <span style={bar("90%")} />
          <span style={bar("70%")} />
          <span style={bar("80%")} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: "auto" }}>
            <Button size="sm" variant="ghost">
              Reset
            </Button>
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const drawerDoc = {
  slug: "drawer",
  name: "Drawer",
  category: "Overlays",
  summary: "Panel that slides in from an edge of the screen, for filters, navigation or details.",
  description:
    "A panel that slides in from the right, the left or the bottom of the screen for secondary tasks, like filtering a list, app navigation on small screens or sharing a link, without leaving the page. It is a modal dialog, like `Modal`: it traps focus, closes on Escape and returns focus when it closes.",
  keywords: [
    "sheet",
    "bottom sheet",
    "side panel",
    "sidebar",
    "offcanvas",
    "slide-over",
    "flyout",
    "side dialog",
  ],
  imports: ["Drawer"],
  Thumbnail: DrawerThumbnail,
  Playground: definePlayground({
    defaults: {
      side: "right",
      size: "md",
      title: "Project settings",
      description: "Changes apply to every deployment of this project.",
      closeOnOverlayClick: true,
      closeOnEscape: true,
      hideCloseButton: false,
    },
    controls: {
      side: { type: "select", label: "Side", options: sides },
      size: { type: "select", label: "Size", options: sizes },
      title: { type: "text", label: "Title" },
      description: { type: "text", label: "Description" },
      closeOnOverlayClick: { type: "boolean", label: "Close on overlay click" },
      closeOnEscape: { type: "boolean", label: "Close on Escape" },
      hideCloseButton: { type: "boolean", label: "Hide close button" },
    },
    render: (values) => <DrawerDemo {...values} />,
    code: (values) =>
      withImport(
        ["Button", "Drawer"],
        formatJsx(
          "Drawer",
          {
            open: expr("open"),
            onClose: expr("() => setOpen(false)"),
            side: values.side,
            size: values.size,
            title: values.title || undefined,
            "aria-label": values.title ? undefined : "Example drawer",
            description: values.description || undefined,
            closeOnOverlayClick: values.closeOnOverlayClick ? undefined : expr("false"),
            closeOnEscape: values.closeOnEscape ? undefined : expr("false"),
            hideCloseButton: values.hideCloseButton,
            footer: expr("<Button onClick={() => setOpen(false)}>Done</Button>"),
          },
          "Drawer content goes here.",
          { defaults: { side: "right", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "filters",
      title: "Filters panel",
      description:
        "A drawer on the right with its actions in the footer. The body scrolls on its own, so the header and footer stay in view.",
      Component: Filters,
      code: filtersCode,
    },
    {
      id: "navigation",
      title: "Navigation",
      description:
        '`side="left"` suits app navigation on small screens. Choosing a link closes the drawer, and focus returns to the menu button.',
      Component: Navigation,
      code: navigationCode,
    },
    {
      id: "bottom-sheet",
      title: "Bottom sheet",
      description:
        '`side="bottom"` makes a sheet that grows with its content, up to a share of the screen height set by `size`.',
      Component: BottomSheet,
      code: bottomSheetCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "Drawer",
      description:
        "Other props (such as `className` or `aria-label`) go to the drawer panel, and the `ref` points to it while it is open. The drawer renders in a portal on `document.body`.",
      props: [
        {
          name: "open",
          type: "boolean",
          required: true,
          description: "Whether the drawer is shown.",
        },
        {
          name: "onClose",
          type: "function",
          required: true,
          description:
            "Called on Escape, an overlay click or the close button. Set `open` to `false` here.",
        },
        {
          name: "title",
          type: "node",
          description: "Heading, and the drawer's accessible name. Without it, pass `aria-label`.",
        },
        {
          name: "description",
          type: "node",
          description: "Supporting text; the drawer's accessible description.",
        },
        { name: "children", type: "node", description: "Body content. It scrolls when it's long." },
        {
          name: "footer",
          type: "node",
          description: "Actions area below the body, typically buttons.",
        },
        {
          name: "side",
          type: '"right" | "left" | "bottom"',
          default: '"right"',
          description: "Edge of the screen the drawer slides in from.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description:
            "Width of a side drawer (20rem, 26rem or 36rem, never wider than the screen), or maximum height of a bottom drawer (40%, 60% or 85% of the screen).",
        },
        {
          name: "closeOnOverlayClick",
          type: "boolean",
          default: "true",
          description: "Close when the backdrop is clicked.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          description: "Close when Escape is pressed.",
        },
        {
          name: "hideCloseButton",
          type: "boolean",
          default: "false",
          description: "Hide the × button in the header.",
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
            "Ref (from `useRef`) of the element to focus on open. Defaults to an `autoFocus` element or the first focusable element.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab", "Shift + Tab"],
      description:
        "Moves focus between the drawer's controls. Focus wraps around and never leaves the drawer.",
    },
    { keys: ["Escape"], description: "Closes the drawer, unless `closeOnEscape` is `false`." },
  ],
  accessibility: [
    'Renders `role="dialog"` with `aria-modal="true"`, named by `title` and described by `description`.',
    "When it opens, focus moves inside: to `initialFocusRef`, an `autoFocus` element, or the first focusable element. When it closes, focus returns to the element that opened it.",
    "Focus stays trapped inside while it's open, and the page behind it can't scroll.",
    "The slide-in animation is turned off when the user prefers reduced motion.",
    "For navigation, put the links in a `<nav>` with an `aria-label` and mark the current page with `aria-current`.",
  ],
};
