import { Spinner } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Centered from "../../examples/spinner/Centered.jsx";
import centeredCode from "../../examples/spinner/Centered.jsx?raw";
import CustomLabel from "../../examples/spinner/CustomLabel.jsx";
import customLabelCode from "../../examples/spinner/CustomLabel.jsx?raw";
import InlineText from "../../examples/spinner/InlineText.jsx";
import inlineTextCode from "../../examples/spinner/InlineText.jsx?raw";
import Sizes from "../../examples/spinner/Sizes.jsx";
import sizesCode from "../../examples/spinner/Sizes.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];

function SpinnerThumbnail() {
  return (
    <>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </>
  );
}

export const spinnerDoc = {
  slug: "spinner",
  name: "Spinner",
  category: "Feedback",
  summary: "Accessible loading indicator for a section or page.",
  description:
    'A loading indicator for content that is on its way, like a panel or a page. It is a `role="status"` with a label for screen readers. For buttons, use the `loading` prop of `Button` instead.',
  keywords: ["loader", "loading", "busy", "activity indicator", "throbber", "wait", "status"],
  imports: ["Spinner"],
  Thumbnail: SpinnerThumbnail,
  Playground: definePlayground({
    defaults: { size: "md", label: "Loading…" },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label (screen readers)" },
    },
    render: (values) => <Spinner size={values.size} label={values.label} />,
    code: (values) =>
      withImport(
        ["Spinner"],
        formatJsx("Spinner", { size: values.size, label: values.label }, undefined, {
          defaults: { size: "md", label: "Loading…" },
        }),
      ),
  }),
  examples: [
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "inline-text",
      title: "Inline with text",
      description:
        'When visible text already says what\'s loading, pass `label=""`: the spinner becomes decorative, and the text (in a `role="status"` element) is what screen readers hear.',
      Component: InlineText,
      code: inlineTextCode,
    },
    {
      id: "centered",
      title: "Centered in a card",
      description: "Center it in the area that's loading, and mark that area `aria-busy`.",
      Component: Centered,
      code: centeredCode,
    },
    {
      id: "custom-label",
      title: "Custom label and color",
      description:
        "`label` is read by screen readers, not shown. The spinner uses the primary color; set `color` with `style` or a `className` to change it.",
      Component: CustomLabel,
      code: customLabelCode,
    },
  ],
  api: [
    {
      title: "Spinner",
      description:
        'Renders a `<span role="status">` and accepts its native attributes. The `ref` points to it.',
      props: [
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "16, 24 or 36 px (at the default font size).",
        },
        {
          name: "label",
          type: "string",
          default: '"Loading…"',
          description:
            'Visually hidden text for screen readers. Pass `""` to make the spinner decorative: no role, and hidden from screen readers.',
        },
        {
          name: "className",
          type: "string",
          description: "Extra class for the root. A class that sets `color` recolors the spinner.",
        },
      ],
    },
  ],
  accessibility: [
    'Renders `role="status"` with a visually hidden `label` (“Loading…” by default) that names what is loading.',
    "A status region is announced when its content changes. Screen readers don't all announce one that appears with its text already in place, so for important updates keep a status message on the page and change its text.",
    'With `label=""`, the spinner is decorative (`aria-hidden`, no role). Use it when nearby text already describes the loading state.',
    "For buttons, use `Button`'s `loading` prop: it shows the same spinner and marks the button `aria-busy` while keeping it focusable.",
    "The rotation slows down when the user prefers reduced motion.",
  ],
};
