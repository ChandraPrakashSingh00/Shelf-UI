import { Textarea } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import AutoResize from "../../examples/textarea/AutoResize.jsx";
import autoResizeCode from "../../examples/textarea/AutoResize.jsx?raw";
import Basic from "../../examples/textarea/Basic.jsx";
import basicCode from "../../examples/textarea/Basic.jsx?raw";
import CharacterCount from "../../examples/textarea/CharacterCount.jsx";
import characterCountCode from "../../examples/textarea/CharacterCount.jsx?raw";
import Sizes from "../../examples/textarea/Sizes.jsx";
import sizesCode from "../../examples/textarea/Sizes.jsx?raw";
import Validation from "../../examples/textarea/Validation.jsx";
import validationCode from "../../examples/textarea/Validation.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];
const resizeModes = ["vertical", "none", "both"];

// The "Max length" control is free text; only a positive whole number is a limit.
const toMaxLength = (text) => {
  const number = Number.parseInt(text, 10);
  return number > 0 ? number : undefined;
};

function TextareaThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Textarea
        size="sm"
        rows={2}
        resize="none"
        label="Release notes"
        defaultValue="Faster builds and a new CLI."
        showCount
        maxLength={140}
      />
    </div>
  );
}

export const textareaDoc = {
  slug: "textarea",
  name: "Textarea",
  category: "Forms",
  summary: "Multi-line text field with a label, character count and auto-resize.",
  description:
    "A multi-line text field for longer input, like a project description or release notes. It wires up its label, helper text and error message the same way as `Input`, and can show a character count or grow with its content.",
  keywords: [
    "text area",
    "multi-line",
    "multiline",
    "form",
    "message",
    "comment",
    "character count",
    "autosize",
    "auto-resize",
    "validation",
  ],
  imports: ["Textarea"],
  Thumbnail: TextareaThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      resize: "vertical",
      label: "Project description",
      placeholder: "What are you building?",
      helperText: "Shown on the project's overview page.",
      error: "",
      maxLength: "",
      showCount: false,
      autoResize: false,
      required: false,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      resize: { type: "select", label: "Resize", options: resizeModes },
      label: { type: "text", label: "Label" },
      placeholder: { type: "text", label: "Placeholder" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      maxLength: { type: "text", label: "Max length" },
      showCount: { type: "boolean", label: "Show count" },
      autoResize: { type: "boolean", label: "Auto-resize" },
      required: { type: "boolean", label: "Required" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Textarea
          size={values.size}
          resize={values.resize}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Textarea"}
          placeholder={values.placeholder}
          helperText={values.helperText || undefined}
          error={values.error || undefined}
          maxLength={toMaxLength(values.maxLength)}
          showCount={values.showCount}
          autoResize={values.autoResize}
          required={values.required}
          disabled={values.disabled}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Textarea"],
        formatJsx(
          "Textarea",
          {
            size: values.size,
            // `resize` has no effect with `autoResize`.
            resize: values.autoResize ? undefined : values.resize,
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Textarea",
            placeholder: values.placeholder || undefined,
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            maxLength: toMaxLength(values.maxLength),
            showCount: values.showCount,
            autoResize: values.autoResize,
            required: values.required,
            disabled: values.disabled,
          },
          undefined,
          { defaults: { size: "md", resize: "vertical" } },
        ),
      ),
  }),
  examples: [
    { id: "basic", title: "Basic", Component: Basic, code: basicCode },
    {
      id: "character-count",
      title: "Character count",
      description:
        "`showCount` adds a count below the field. With `maxLength`, it shows the limit too, and the browser stops typing when it's reached.",
      Component: CharacterCount,
      code: characterCountCode,
    },
    {
      id: "auto-resize",
      title: "Auto-resize",
      description:
        "With `autoResize`, the field starts at `rows` lines and grows as you type: add a few lines to try it. To cap the growth, give the textarea a `max-height` through `textareaClassName`; past it, the content scrolls.",
      Component: AutoResize,
      code: autoResizeCode,
    },
    {
      id: "validation",
      title: "Validation",
      description:
        "Pass a message to `error` to show it in place of the helper text and mark the field invalid. Type a few more words to clear it.",
      Component: Validation,
      code: validationCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "Textarea",
      description:
        "Also accepts every native `<textarea>` attribute (`name`, `value`, `defaultValue`, `onChange`, …). The `ref` points to the `<textarea>` element.",
      props: [
        { name: "label", type: "node", description: "Visible label, linked to the textarea." },
        {
          name: "placeholder",
          type: "string",
          description: "Hint shown while the field is empty. Not a replacement for a label.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the field, exposed as the textarea's accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message. Replaces `helperText`, highlights the field and sets `aria-invalid`. Pass `true` to mark the field invalid without a message.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Font size and padding.",
        },
        {
          name: "rows",
          type: "number",
          default: "3",
          description: "Number of visible lines. With `autoResize`, the minimum height.",
        },
        {
          name: "resize",
          type: '"vertical" | "none" | "both"',
          default: '"vertical"',
          description:
            "Which way people can resize the field by dragging its corner. Ignored with `autoResize`.",
        },
        {
          name: "autoResize",
          type: "boolean",
          default: "false",
          description:
            "Grows the field to fit its content and hides the resize handle and scrollbar while it fits. A CSS `max-height` (through `textareaClassName`) caps the growth; past it, the content scrolls.",
        },
        {
          name: "showCount",
          type: "boolean",
          default: "false",
          description:
            "Shows a character count below the field: `n / maxLength` with `maxLength`, otherwise `n characters`. Works controlled and uncontrolled, and turns red if a value is longer than `maxLength`.",
        },
        {
          name: "maxLength",
          type: "number",
          description: "Native limit on the number of characters. Also shown by `showCount`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description: "Native `required`, plus an asterisk after the label.",
        },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the field." },
        {
          name: "className",
          type: "string",
          description:
            "Class for the field wrapper (label, textarea and messages). `style` goes there too.",
        },
        {
          name: "textareaClassName",
          type: "string",
          description: "Class for the `<textarea>` element itself.",
        },
      ],
    },
  ],
  accessibility: [
    "The `label` is linked to the textarea with `htmlFor`, so clicking it focuses the field and screen readers announce it.",
    "`helperText`, `error` and the character count are connected with `aria-describedby`, so screen readers read them when the field is focused. An error also sets `aria-invalid`.",
    "The count isn't a live region, so it isn't announced after every keystroke.",
    "`required` uses the native attribute. The asterisk is visual only and hidden from screen readers.",
    "Without a visible label, pass `aria-label`. Placeholder text disappears while typing and is not a label.",
  ],
};
