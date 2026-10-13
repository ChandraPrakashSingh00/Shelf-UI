import { Divider } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/divider/Basic.jsx";
import basicCode from "../../examples/divider/Basic.jsx?raw";
import DashedSpacing from "../../examples/divider/DashedSpacing.jsx";
import dashedSpacingCode from "../../examples/divider/DashedSpacing.jsx?raw";
import Vertical from "../../examples/divider/Vertical.jsx";
import verticalCode from "../../examples/divider/Vertical.jsx?raw";
import WithLabel from "../../examples/divider/WithLabel.jsx";
import withLabelCode from "../../examples/divider/WithLabel.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const orientations = ["horizontal", "vertical"];
const labelPositions = ["start", "center", "end"];
const variants = ["solid", "dashed"];
const spacings = ["sm", "md", "lg"];

const previewText = { color: "var(--shelf-color-text-muted)", fontSize: 14 };

function DividerThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 200, fontSize: 13 }}>
      <ButtonShape />
      <Divider label="OR" spacing="sm" />
      <ButtonShape />
    </div>
  );
}

// A decorative stand-in for a button in the thumbnail.
function ButtonShape() {
  return (
    <div
      style={{
        height: 28,
        border: "1px solid var(--shelf-color-border-strong)",
        borderRadius: "var(--shelf-radius-md)",
        backgroundColor: "var(--shelf-color-surface)",
      }}
    />
  );
}

export const dividerDoc = {
  slug: "divider",
  name: "Divider",
  category: "Layout",
  summary: "Line that separates content, horizontally or vertically, with an optional label.",
  description:
    "A thin line between groups of content — the rows of an order summary, the stats in a dashboard header, or the two ways to log in with an “OR” label in the middle. Without a label it's a real separator (`<hr>`); with a label, the text stays readable by screen readers.",
  keywords: ["separator", "hr", "rule", "line", "or", "section break", "vertical"],
  imports: ["Divider"],
  Thumbnail: DividerThumbnail,
  Playground: definePlayground({
    defaults: {
      orientation: "horizontal",
      label: "OR",
      labelPosition: "center",
      variant: "solid",
      spacing: "md",
      decorative: false,
    },
    controls: {
      orientation: { type: "select", label: "Orientation", options: orientations },
      label: { type: "text", label: "Label" },
      labelPosition: { type: "select", label: "Label position", options: labelPositions },
      variant: { type: "select", label: "Variant", options: variants },
      spacing: { type: "select", label: "Spacing", options: spacings },
      decorative: { type: "boolean", label: "Decorative" },
    },
    render: (values) => {
      const vertical = values.orientation === "vertical";
      return (
        <div
          style={{
            display: "flex",
            flexDirection: vertical ? "row" : "column",
            alignItems: vertical ? "stretch" : undefined,
            width: "100%",
            maxWidth: 360,
            minHeight: vertical ? 120 : undefined,
          }}
        >
          <span style={previewText}>Log in with OTP</span>
          <Divider
            orientation={values.orientation}
            label={values.label || undefined}
            labelPosition={values.labelPosition}
            variant={values.variant}
            spacing={values.spacing}
            decorative={values.decorative}
          />
          <span style={previewText}>Continue with email</span>
        </div>
      );
    },
    code: (values) =>
      withImport(
        ["Divider"],
        formatJsx(
          "Divider",
          {
            orientation: values.orientation,
            label: values.label || undefined,
            labelPosition: values.label ? values.labelPosition : undefined,
            variant: values.variant,
            spacing: values.spacing,
            decorative: values.decorative,
          },
          undefined,
          {
            defaults: {
              orientation: "horizontal",
              labelPosition: "center",
              variant: "solid",
              spacing: "md",
            },
          },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        'A horizontal divider is an `<hr>` with `1rem` of space above and below it (`spacing="md"`).',
      Component: Basic,
      code: basicCode,
    },
    {
      id: "with-label",
      title: "With a label",
      description:
        "`label` puts text between two lines; `labelPosition` moves it to the `start` or `end`. The label is plain text that screen readers read.",
      Component: WithLabel,
      code: withLabelCode,
    },
    {
      id: "vertical",
      title: "Vertical",
      description:
        '`orientation="vertical"` stretches to the height of a flex row, or matches the text height between inline items. `decorative` hides dividers that only add visual rhythm.',
      Component: Vertical,
      code: verticalCode,
    },
    {
      id: "dashed-spacing",
      title: "Dashed and spacing",
      description: '`variant="dashed"` draws a dashed line; `spacing` sets the space around it.',
      Component: DashedSpacing,
      code: dashedSpacingCode,
    },
  ],
  api: [
    {
      title: "Divider",
      description:
        'Renders an `<hr>` (horizontal), a `<span role="separator">` (vertical, so it can also sit inside a `<p>`) or, with a `label`, a `<div>`. Accepts native attributes; the `ref` points to the root element.',
      props: [
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Direction of the line.",
        },
        {
          name: "label",
          type: "node",
          description: "Text between two lines, e.g. “OR” or “More options”.",
        },
        {
          name: "labelPosition",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description: "Where the label sits along the line.",
        },
        {
          name: "variant",
          type: '"solid" | "dashed"',
          default: '"solid"',
          description: "Line style.",
        },
        {
          name: "spacing",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description:
            "Margin on both sides of the line: 0.5, 1 or 1.5 rem (above and below, or left and right when vertical).",
        },
        {
          name: "decorative",
          type: "boolean",
          default: "false",
          description: "Hides the divider from assistive technology (`aria-hidden`).",
        },
      ],
    },
  ],
  accessibility: [
    'Without a label, the divider is a separator: a native `<hr>`, or `role="separator"` with `aria-orientation="vertical"`. Screen readers can announce it as a boundary between sections.',
    "A separator's content is presentational, so a labelled divider is a plain `<div>` instead: its label is read as normal text, and the lines are drawn with CSS.",
    "Use `decorative` for lines that only add visual rhythm, like between inline links; they're then hidden with `aria-hidden`.",
    "Don't use a divider instead of headings: sections that need names should have them.",
  ],
};
