import { Progress } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/progress/Basic.jsx";
import basicCode from "../../examples/progress/Basic.jsx?raw";
import Indeterminate from "../../examples/progress/Indeterminate.jsx";
import indeterminateCode from "../../examples/progress/Indeterminate.jsx?raw";
import Sizes from "../../examples/progress/Sizes.jsx";
import sizesCode from "../../examples/progress/Sizes.jsx?raw";
import Upload from "../../examples/progress/Upload.jsx";
import uploadCode from "../../examples/progress/Upload.jsx?raw";
import Variants from "../../examples/progress/Variants.jsx";
import variantsCode from "../../examples/progress/Variants.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const valueOptions = ["10", "45", "75", "100"];
const variants = ["primary", "success", "warning", "danger"];
const sizes = ["sm", "md", "lg"];

function ProgressThumbnail() {
  return (
    <div style={{ display: "grid", gap: 14, width: "100%", maxWidth: 220 }}>
      <Progress label="Deploying" value={62} showValue size="sm" />
      <Progress label="Backup" value={100} showValue size="sm" variant="success" />
    </div>
  );
}

export const progressDoc = {
  slug: "progress",
  name: "Progress",
  category: "Feedback",
  summary: "Shows how far a task, like an upload or a deployment, has come.",
  description:
    "A progress bar for tasks that take a while, such as uploads, imports and deployments. Pass a `value` to show how much is done, or leave it out when you can't tell (indeterminate).",
  keywords: [
    "progress bar",
    "progressbar",
    "loading",
    "upload",
    "percentage",
    "completion",
    "indeterminate",
  ],
  imports: ["Progress"],
  Thumbnail: ProgressThumbnail,
  Playground: definePlayground({
    defaults: {
      value: "45",
      indeterminate: false,
      variant: "primary",
      size: "md",
      label: "Deploying codecps-web",
      showValue: true,
    },
    controls: {
      value: { type: "select", label: "Value", options: valueOptions },
      indeterminate: { type: "boolean", label: "Indeterminate" },
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      showValue: { type: "boolean", label: "Show value" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Progress
          value={values.indeterminate ? undefined : Number(values.value)}
          variant={values.variant}
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Progress"}
          showValue={values.showValue}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Progress"],
        formatJsx(
          "Progress",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Progress",
            value: values.indeterminate ? undefined : Number(values.value),
            showValue: values.showValue,
            variant: values.variant,
            size: values.size,
          },
          undefined,
          { defaults: { variant: "primary", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "`label` names the bar, and `showValue` shows the percentage next to it. `value` goes from 0 to `max` (100 by default).",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "variants",
      title: "Variants",
      description:
        "Match the color to the outcome, and say it in the label too: color alone isn't enough.",
      Component: Variants,
      code: variantsCode,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "`size` sets the thickness of the bar.",
      Component: Sizes,
      code: sizesCode,
    },
    {
      id: "indeterminate",
      title: "Indeterminate",
      description:
        "Leave out `value` when you can't tell how long a task will take. The bar keeps sliding until you pass a value.",
      Component: Indeterminate,
      code: indeterminateCode,
    },
    {
      id: "upload",
      title: "Upload",
      description:
        "Click “Start upload”. `formatValue` shows megabytes instead of a percentage, and screen readers hear the same text. A status message announces when the upload is done.",
      Component: Upload,
      code: uploadCode,
    },
  ],
  api: [
    {
      title: "Progress",
      description:
        "Renders a `<div>` and accepts its native attributes; the `ref` points to it. `aria-label`, `aria-labelledby` and `aria-describedby` go to the progress bar element inside.",
      props: [
        {
          name: "value",
          type: "number",
          description:
            "Progress from 0 to `max`; values outside are clamped. Leave it out (or pass `null`) for an indeterminate bar.",
        },
        { name: "max", type: "number", default: "100", description: "Value of a finished task." },
        {
          name: "label",
          type: "node",
          description: "Visible label above the bar, and its accessible name.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "false",
          description: "Shows the percentage (or the `formatValue` text) next to the label.",
        },
        {
          name: "formatValue",
          type: "function(value, max)",
          description:
            "Returns the value text as a string, e.g. “12 MB of 24 MB”. Also used as `aria-valuetext`.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Thickness of the bar: 4, 8 or 12 px.",
        },
        {
          name: "variant",
          type: '"primary" | "success" | "warning" | "danger"',
          default: '"primary"',
          description: "Color of the bar.",
        },
        {
          name: "aria-label",
          type: "string",
          description: "Accessible name when there is no visible `label`.",
        },
      ],
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA progressbar pattern: `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`, named by `label` through `aria-labelledby`. Without a visible label, pass `aria-label`.',
    "`formatValue` also sets `aria-valuetext`, so screen readers read “12 MB of 24 MB” instead of a bare number.",
    "An indeterminate bar leaves out `aria-valuenow`, as the pattern requires.",
    'Screen readers don\'t announce a progress bar as it changes. Announce important moments, like “Uploaded”, with a `role="status"` message.',
    "The sliding animation slows down when the user prefers reduced motion, and the bar stays visible in forced-colors (high contrast) mode.",
  ],
};
