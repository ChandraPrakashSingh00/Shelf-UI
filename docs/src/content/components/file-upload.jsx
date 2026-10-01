import { FileUpload } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/file-upload/Basic.jsx";
import basicCode from "../../examples/file-upload/Basic.jsx?raw";
import CustomErrors from "../../examples/file-upload/CustomErrors.jsx";
import customErrorsCode from "../../examples/file-upload/CustomErrors.jsx?raw";
import Form from "../../examples/file-upload/Form.jsx";
import formCode from "../../examples/file-upload/Form.jsx?raw";
import ProductImages from "../../examples/file-upload/ProductImages.jsx";
import productImagesCode from "../../examples/file-upload/ProductImages.jsx?raw";
import States from "../../examples/file-upload/States.jsx";
import statesCode from "../../examples/file-upload/States.jsx?raw";
import Upload from "../../examples/file-upload/Upload.jsx";
import uploadCode from "../../examples/file-upload/Upload.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const accepts = ["image/*", ".pdf", "any"];

// A static look-alike: the real drop zone is taller than a card preview.
function FileUploadThumbnail() {
  const box = {
    border: "1px solid var(--cps-color-border)",
    borderRadius: "var(--cps-radius-md)",
    backgroundColor: "var(--cps-color-surface)",
  };
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        width: "100%",
        maxWidth: 220,
        color: "var(--cps-color-text-muted)",
        fontFamily: "var(--cps-font-sans)",
        fontSize: "var(--cps-font-size-xs)",
      }}
    >
      <div
        style={{
          ...box,
          display: "grid",
          justifyItems: "center",
          gap: 6,
          padding: "12px 8px",
          borderStyle: "dashed",
          borderColor: "var(--cps-color-border-strong)",
          borderRadius: "var(--cps-radius-lg)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "var(--cps-radius-full)",
            backgroundColor: "var(--cps-color-primary-subtle)",
            color: "var(--cps-color-primary-text)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 15V4M7 9l5-5 5 5" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
        </span>
        <span>
          <strong style={{ color: "var(--cps-color-primary-text)" }}>Choose files</strong> or drag
          and drop here
        </span>
      </div>
      <div style={{ ...box, display: "flex", alignItems: "center", gap: 8, padding: "6px 8px" }}>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: "var(--cps-radius-sm)",
            background:
              "linear-gradient(135deg, var(--cps-color-primary-border), var(--cps-color-warning-border))",
          }}
        />
        <span style={{ display: "grid", flex: 1, minWidth: 0 }}>
          <span style={{ color: "var(--cps-color-text)", fontWeight: 500 }}>kurta-front.jpg</span>
          <span>1.2 MB</span>
        </span>
        <span>✕</span>
      </div>
    </div>
  );
}

export const fileUploadDoc = {
  slug: "file-upload",
  name: "FileUpload",
  category: "Forms",
  summary: "Drag-and-drop file picker with validation, image previews and a file list.",
  description:
    'Lets people pick or drop files, like product images, invoices or KYC documents. Files are checked against `accept`, `maxSize` and `maxFiles` the same way whether they\'re picked or dropped, rejected files are explained under the field, and image files get a thumbnail. A real `<input type="file">` underneath keeps keyboard access and native form submission.',
  keywords: [
    "file input",
    "upload",
    "dropzone",
    "drag and drop",
    "attachment",
    "image upload",
    "document",
    "files",
    "form",
  ],
  imports: ["FileUpload"],
  Thumbnail: FileUploadThumbnail,
  Playground: definePlayground({
    defaults: {
      accept: "image/*",
      label: "Product images",
      helperText: "PNG or JPG, up to 5 MB each.",
      error: "",
      multiple: true,
      showPreview: true,
      disabled: false,
    },
    controls: {
      accept: { type: "select", label: "Accept", options: accepts },
      label: { type: "text", label: "Label" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      multiple: { type: "boolean", label: "Multiple" },
      showPreview: { type: "boolean", label: "Show preview" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 420 }}>
        <FileUpload
          accept={values.accept === "any" ? undefined : values.accept}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Product images"}
          helperText={values.helperText || undefined}
          error={values.error || undefined}
          multiple={values.multiple}
          showPreview={values.showPreview}
          disabled={values.disabled}
          maxSize={5 * 1024 * 1024}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["FileUpload"],
        formatJsx(
          "FileUpload",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Product images",
            accept: values.accept === "any" ? undefined : values.accept,
            maxSize: expr("5 * 1024 * 1024"),
            multiple: values.multiple,
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            showPreview: values.showPreview ? undefined : expr("false"),
            disabled: values.disabled,
          },
          undefined,
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Click the drop zone (or focus it with Tab and press Enter) to open the file picker, or drop a file on it. Without `multiple`, a new file replaces the current one.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "product-images",
      title: "Multiple images with previews",
      description:
        "With `multiple`, new files are added to the list. Image files get a thumbnail; files that are the wrong type, too large or over `maxFiles` are listed under the field with the reason.",
      Component: ProductImages,
      code: productImagesCode,
    },
    {
      id: "upload",
      title: "Uploading",
      description:
        "`value` and `onValueChange` hold the files for your own upload request. This demo fakes the upload with a `Progress` bar and disables the field meanwhile.",
      Component: Upload,
      code: uploadCode,
    },
    {
      id: "custom-errors",
      title: "Custom error messages",
      description:
        "`onReject` receives each rejected file with error codes (`file-invalid-type`, `file-too-large`, `too-many-files`). Turn them into your own message with `error`, which replaces the built-in list.",
      Component: CustomErrors,
      code: customErrorsCode,
    },
    { id: "states", title: "Required, invalid and disabled", Component: States, code: statesCode },
    {
      id: "form",
      title: "In a form",
      description:
        "With `name`, the accepted files are submitted with the form, like a native file input. Resetting the form clears the list.",
      Component: Form,
      code: formCode,
    },
  ],
  api: [
    {
      title: "FileUpload",
      description:
        'Also accepts native `<input type="file">` attributes (`capture`, `onChange`, …). The `ref` points to the `<input>`; `className` and `style` go to the field wrapper.',
      props: [
        {
          name: "label",
          type: "node",
          description: "Visible label, linked to the file input. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description:
            'Hint below the drop zone, e.g. "PNG or JPG, up to 5 MB". Exposed as the accessible description.',
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message. Replaces `helperText` and the list of rejected files, and sets `aria-invalid`. Pass `true` to mark the field invalid without a message.",
        },
        {
          name: "value",
          type: "array",
          description: "The chosen `File` objects (controlled).",
        },
        {
          name: "defaultValue",
          type: "array",
          default: "[]",
          description: "Initial files (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(files)",
          description: "Called with the new array of files when files are added or removed.",
        },
        {
          name: "onReject",
          type: "function(rejections)",
          description:
            'Called with the rejected files: `[{ file, errors: [{ code, message }] }]`, with the codes "file-invalid-type", "file-too-large" and "too-many-files".',
        },
        {
          name: "accept",
          type: "string",
          description:
            'Accepted types, like the native attribute: MIME types, wildcards and extensions, e.g. "image/png,image/jpeg" or "image/*,.pdf". Also checked for dropped files.',
        },
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          description: "Allows several files. Without it, a new file replaces the current one.",
        },
        {
          name: "maxSize",
          type: "number",
          description: "Largest file size in bytes, e.g. `5 * 1024 * 1024` for 5 MB.",
        },
        {
          name: "maxFiles",
          type: "number",
          description: "Most files in total, with `multiple`.",
        },
        {
          name: "showPreview",
          type: "boolean",
          default: "true",
          description: "Shows thumbnails of image files. Other files show a file icon.",
        },
        {
          name: "browseText",
          type: "node",
          default: '"Choose files"',
          description: 'Highlighted drop zone text ("Choose a file" without `multiple`).',
        },
        {
          name: "dropText",
          type: "node",
          default: '"or drag and drop here"',
          description: "Drop zone text after `browseText`.",
        },
        {
          name: "getRemoveLabel",
          type: "function(file)",
          description:
            'Returns the accessible name of a remove button. Defaults to "Remove photo.jpg".',
        },
        {
          name: "name",
          type: "string",
          description:
            "Form field name of the file input. The accepted files are submitted with the form.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description:
            "At least one file is needed to submit the form. Adds an asterisk to the label.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents adding and removing files.",
        },
        {
          name: "id",
          type: "string",
          description: "Id of the `<input>`. Defaults to a generated id.",
        },
        {
          name: "className",
          type: "string",
          description: "Class for the field wrapper. `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Tab"], description: "Moves focus to the drop zone, then to each remove button." },
    { keys: ["Enter", "Space"], description: "Opens the file picker, or removes a file." },
  ],
  accessibility: [
    'The drop zone stands for a real, visually hidden `<input type="file">`: it receives focus (the focus ring is drawn on the drop zone), opens the picker with Enter or Space, and is named by the label and the “Choose files” text.',
    "Dragging and dropping is optional: everything can be done with the file picker.",
    "Added, removed and rejected files are announced politely through a visually hidden live region, and the reasons files were rejected are also part of the input's description.",
    "Each file's remove button is named after the file (“Remove photo.jpg”). After a removal, focus moves to the next file's button, or back to the drop zone.",
    'Image thumbnails are decorative (`alt=""`) because the file name is right next to them. Their object URLs are released when a file is removed.',
  ],
};
