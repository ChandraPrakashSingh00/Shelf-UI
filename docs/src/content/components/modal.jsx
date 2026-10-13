import { Button, Modal } from "@shelf-ui/react";
import { useState } from "react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/modal/Basic.jsx";
import basicCode from "../../examples/modal/Basic.jsx?raw";
import Sizes from "../../examples/modal/Sizes.jsx";
import sizesCode from "../../examples/modal/Sizes.jsx?raw";
import WithForm from "../../examples/modal/WithForm.jsx";
import withFormCode from "../../examples/modal/WithForm.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];

function ModalDemo(values) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={values.size}
        title={values.title || undefined}
        aria-label={values.title ? undefined : "Example dialog"}
        description={values.description || undefined}
        closeOnOverlayClick={values.closeOnOverlayClick}
        closeOnEscape={values.closeOnEscape}
        hideCloseButton={values.hideCloseButton}
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        Modal content goes here.
      </Modal>
    </>
  );
}

function ModalThumbnail() {
  return (
    <div className="docs-thumb-modal">
      <div className="docs-thumb-modal__panel">
        <strong>Delete project?</strong>
        <span>This can't be undone.</span>
        <div className="docs-thumb-modal__actions">
          <Button size="sm" variant="secondary">
            Cancel
          </Button>
          <Button size="sm" variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export const modalDoc = {
  slug: "modal",
  name: "Modal",
  category: "Overlays",
  summary: "Dialog that focuses attention on a single task or decision.",
  description:
    "A dialog that sits above the page and asks for a decision or a short task, like confirming a deletion or filling in a small form. It traps focus, closes on Escape and returns focus when it closes.",
  keywords: ["dialog", "popup", "overlay", "confirm", "lightbox", "sheet"],
  imports: ["Modal"],
  Thumbnail: ModalThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      title: "Create project",
      description: "Projects group your deployments and environment variables.",
      closeOnOverlayClick: true,
      closeOnEscape: true,
      hideCloseButton: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      title: { type: "text", label: "Title" },
      description: { type: "text", label: "Description" },
      closeOnOverlayClick: { type: "boolean", label: "Close on overlay click" },
      closeOnEscape: { type: "boolean", label: "Close on Escape" },
      hideCloseButton: { type: "boolean", label: "Hide close button" },
    },
    render: (values) => <ModalDemo {...values} />,
    code: (values) =>
      withImport(
        ["Button", "Modal"],
        formatJsx(
          "Modal",
          {
            open: expr("open"),
            onClose: expr("() => setOpen(false)"),
            size: values.size,
            title: values.title || undefined,
            "aria-label": values.title ? undefined : "Example dialog",
            description: values.description || undefined,
            closeOnOverlayClick: values.closeOnOverlayClick ? undefined : expr("false"),
            closeOnEscape: values.closeOnEscape ? undefined : expr("false"),
            hideCloseButton: values.hideCloseButton,
            footer: expr("<Button onClick={() => setOpen(false)}>Done</Button>"),
          },
          "Modal content goes here.",
          { defaults: { size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "confirm",
      title: "Confirmation",
      description:
        "Ask before destructive actions. Keep the title a question and label buttons with verbs.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "with-form",
      title: "With a form",
      description:
        "`autoFocus` (or `initialFocusRef`) puts focus in the first field. The footer button submits the form through its `form` attribute.",
      Component: WithForm,
      code: withFormCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "Modal",
      description:
        "Other props (such as `className` or `aria-label`) go to the dialog panel. The modal renders in a portal on `document.body`.",
      props: [
        {
          name: "open",
          type: "boolean",
          required: true,
          description: "Whether the modal is shown.",
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
          description: "Heading, and the dialog's accessible name. Without it, pass `aria-label`.",
        },
        {
          name: "description",
          type: "node",
          description: "Supporting text; the dialog's accessible description.",
        },
        { name: "children", type: "node", description: "Body content." },
        { name: "footer", type: "node", description: "Actions area, typically buttons." },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Maximum width.",
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
        "Moves focus between the dialog's controls. Focus wraps around and never leaves the dialog.",
    },
    { keys: ["Escape"], description: "Closes the dialog, unless `closeOnEscape` is `false`." },
  ],
  accessibility: [
    'Renders `role="dialog"` with `aria-modal="true"`, named by `title` and described by `description`.',
    "When it opens, focus moves inside: to `initialFocusRef`, an `autoFocus` element, or the first focusable element. When it closes, focus returns to the element that opened it.",
    "Focus stays trapped inside while it's open, and the page behind it can't scroll.",
    "It renders in a portal, so parent `overflow` or `z-index` never clips it.",
  ],
};
