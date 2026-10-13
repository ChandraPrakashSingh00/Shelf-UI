import { AlertDialog, Button } from "shelf-ui-react";
import { useState } from "react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import AsyncConfirm from "../../examples/alert-dialog/AsyncConfirm.jsx";
import asyncConfirmCode from "../../examples/alert-dialog/AsyncConfirm.jsx?raw";
import CancelOrder from "../../examples/alert-dialog/CancelOrder.jsx";
import cancelOrderCode from "../../examples/alert-dialog/CancelOrder.jsx?raw";
import DeleteProduct from "../../examples/alert-dialog/DeleteProduct.jsx";
import deleteProductCode from "../../examples/alert-dialog/DeleteProduct.jsx?raw";
import TypeToConfirm from "../../examples/alert-dialog/TypeToConfirm.jsx";
import typeToConfirmCode from "../../examples/alert-dialog/TypeToConfirm.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["danger", "primary"];
const sizes = ["sm", "md"];

function WarningGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

// A static look-alike: a real AlertDialog would render in a portal and trap focus.
function AlertDialogThumbnail() {
  return (
    <div className="docs-thumb-modal">
      <div className="docs-thumb-modal__panel">
        <div style={{ display: "flex", gap: 10 }}>
          <span
            style={{
              display: "inline-flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "var(--shelf-radius-full)",
              backgroundColor: "var(--shelf-color-danger-subtle)",
              color: "var(--shelf-color-danger)",
            }}
          >
            <WarningGlyph />
          </span>
          <div style={{ display: "grid", gap: 2 }}>
            <strong>Delete product?</strong>
            <span>This can't be undone.</span>
          </div>
        </div>
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

function AlertDialogDemo(values) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={values.variant} onClick={() => setOpen(true)}>
        {values.confirmLabel || "Confirm"}
      </Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        variant={values.variant}
        size={values.size}
        title={values.title || "Are you sure?"}
        description={values.description || undefined}
        confirmLabel={values.confirmLabel || undefined}
        cancelLabel={values.cancelLabel || undefined}
        closeOnOverlayClick={values.closeOnOverlayClick}
      />
    </>
  );
}

export const alertDialogDoc = {
  slug: "alert-dialog",
  name: "AlertDialog",
  category: "Overlays",
  summary: "Confirmation dialog for destructive or important actions, like deleting a product.",
  description:
    "A modal that asks for a decision before something important happens, like deleting a product or cancelling an order. Focus starts on Cancel, the least destructive choice. When `onConfirm` returns a promise, the confirm button shows a spinner until it settles.",
  keywords: [
    "confirm",
    "confirmation",
    "are you sure",
    "delete",
    "destructive",
    "dialog",
    "alertdialog",
    "modal",
    "warning",
  ],
  imports: ["AlertDialog"],
  Thumbnail: AlertDialogThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "danger",
      size: "sm",
      title: "Delete 3 products?",
      description: "They will be removed from your store. This can't be undone.",
      confirmLabel: "Delete products",
      cancelLabel: "Cancel",
      closeOnOverlayClick: false,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      title: { type: "text", label: "Title" },
      description: { type: "text", label: "Description" },
      confirmLabel: { type: "text", label: "Confirm label" },
      cancelLabel: { type: "text", label: "Cancel label" },
      closeOnOverlayClick: { type: "boolean", label: "Close on overlay click" },
    },
    render: (values) => <AlertDialogDemo {...values} />,
    code: (values) =>
      withImport(
        ["AlertDialog"],
        formatJsx(
          "AlertDialog",
          {
            open: expr("open"),
            onClose: expr("() => setOpen(false)"),
            onConfirm: expr("deleteProducts"),
            variant: values.variant,
            size: values.size,
            title: values.title || "Are you sure?",
            description: values.description || undefined,
            confirmLabel: values.confirmLabel || undefined,
            cancelLabel: values.cancelLabel || undefined,
            closeOnOverlayClick: values.closeOnOverlayClick,
          },
          undefined,
          {
            defaults: {
              variant: "danger",
              size: "sm",
              confirmLabel: "Confirm",
              cancelLabel: "Cancel",
            },
          },
        ),
      ),
  }),
  examples: [
    {
      id: "delete-product",
      title: "Delete a product",
      description:
        "The default `danger` variant: a warning icon and a red confirm button. `onConfirm` runs, then the dialog closes through `onClose`.",
      Component: DeleteProduct,
      code: deleteProductCode,
    },
    {
      id: "cancel-order",
      title: "Cancel an order with a reason",
      description:
        "`children` adds content below the description, like a reason field. `confirmDisabled` keeps the confirm button disabled until a reason is chosen.",
      Component: CancelOrder,
      code: cancelOrderCode,
    },
    {
      id: "async-confirm",
      title: "Async confirm",
      description:
        "When `onConfirm` returns a promise, the confirm button shows a spinner and Cancel and Escape are blocked until it settles. It closes when the promise resolves and stays open when it rejects.",
      Component: AsyncConfirm,
      code: asyncConfirmCode,
    },
    {
      id: "type-to-confirm",
      title: "Type to confirm",
      description:
        "For actions that are hard to undo, ask people to type a word first. `initialFocusRef` moves focus to the field instead of Cancel.",
      Component: TypeToConfirm,
      code: typeToConfirmCode,
    },
  ],
  api: [
    {
      title: "AlertDialog",
      description:
        "Other props (such as `className`) and the `ref` go to the dialog panel. The dialog renders in a portal on `document.body`.",
      props: [
        {
          name: "open",
          type: "boolean",
          required: true,
          description: "Whether the dialog is shown.",
        },
        {
          name: "onClose",
          type: "function",
          required: true,
          description:
            "Called to close the dialog: Cancel, Escape, an overlay click (with `closeOnOverlayClick`) and after a successful confirm (with `closeOnConfirm`). Set `open` to `false` here.",
        },
        {
          name: "onConfirm",
          type: "function",
          description:
            "Called by the confirm button. If it returns a promise, the dialog shows a loading state until it settles, closes when it resolves and stays open when it rejects. The rejection isn't caught, so it still reaches your error reporting.",
        },
        {
          name: "title",
          type: "node",
          required: true,
          description: "The question, like “Delete this product?”. Also the accessible name.",
        },
        {
          name: "description",
          type: "node",
          description: "What will happen. Also the accessible description.",
        },
        {
          name: "children",
          type: "node",
          description: "Extra content below the description, like a reason field.",
        },
        {
          name: "confirmLabel",
          type: "node",
          default: '"Confirm"',
          description: "Text of the confirm button. Use a verb: “Delete product”.",
        },
        {
          name: "cancelLabel",
          type: "node",
          default: '"Cancel"',
          description: "Text of the cancel button.",
        },
        {
          name: "variant",
          type: '"danger" | "primary"',
          default: '"danger"',
          description: "Style of the confirm button and of the default icon.",
        },
        {
          name: "icon",
          type: "node",
          description:
            "Replaces the default icon (a warning sign for `danger`, an info sign for `primary`). Pass `null` to hide it.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Shows a spinner on the confirm button and blocks Cancel, Escape and the overlay; both buttons stay focusable. Set automatically while `onConfirm`'s promise is pending.",
        },
        {
          name: "confirmDisabled",
          type: "boolean",
          default: "false",
          description: "Disables the confirm button, e.g. until a confirmation text matches.",
        },
        {
          name: "closeOnConfirm",
          type: "boolean",
          default: "true",
          description:
            "Calls `onClose` after `onConfirm` succeeds. Set to `false` to close the dialog yourself.",
        },
        {
          name: "closeOnOverlayClick",
          type: "boolean",
          default: "false",
          description:
            "Close when the backdrop is clicked. Off by default, so a stray click doesn't dismiss the question.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          description: "Close when Escape is pressed (ignored while loading).",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"sm"',
          description: "Maximum width.",
        },
        {
          name: "initialFocusRef",
          type: "ref",
          description: "Ref of the element to focus on open. Defaults to the Cancel button.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab", "Shift + Tab"],
      description: "Moves focus between the dialog's controls. Focus never leaves the dialog.",
    },
    { keys: ["Enter", "Space"], description: "Activates the focused button." },
    {
      keys: ["Escape"],
      description: "Closes the dialog, unless `closeOnEscape` is `false` or it is loading.",
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA alert dialog pattern: `role="alertdialog"` with `aria-modal="true"`, named by `title` and described by `description`.',
    "Focus moves to Cancel when it opens, so pressing Enter by accident never confirms a destructive action. Use `initialFocusRef` to start somewhere else, like a confirmation field.",
    "Focus is trapped inside while it's open, the page behind can't scroll, and focus returns to the element that opened it when it closes.",
    "There is no close (×) button and the overlay doesn't close it by default: people answer with Cancel or Confirm (or Escape).",
    "While loading, the dialog is marked `aria-busy`, and the confirm button stays focusable with `aria-disabled`, so keyboard users keep their place.",
  ],
};
