import { Skeleton } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import CardPlaceholder from "../../examples/skeleton/CardPlaceholder.jsx";
import cardPlaceholderCode from "../../examples/skeleton/CardPlaceholder.jsx?raw";
import CustomSizes from "../../examples/skeleton/CustomSizes.jsx";
import customSizesCode from "../../examples/skeleton/CustomSizes.jsx?raw";
import Loading from "../../examples/skeleton/Loading.jsx";
import loadingCode from "../../examples/skeleton/Loading.jsx?raw";
import Text from "../../examples/skeleton/Text.jsx";
import textCode from "../../examples/skeleton/Text.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["text", "circular", "rectangular"];
const lineCounts = ["1", "2", "3", "4"];

function SkeletonThumbnail() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 220 }}>
      <Skeleton variant="rectangular" height={44} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Skeleton variant="circular" width={32} />
        <div style={{ flex: 1 }}>
          <Skeleton lines={2} />
        </div>
      </div>
    </div>
  );
}

export const skeletonDoc = {
  slug: "skeleton",
  name: "Skeleton",
  category: "Feedback",
  summary: "Placeholder shapes that stand in for content while it loads.",
  description:
    "Placeholder shapes that show the layout of content before it arrives, so the page feels faster and doesn't jump when the data loads. Combine `text`, `circular` and `rectangular` skeletons to match what they replace.",
  keywords: ["placeholder", "loading", "shimmer", "ghost", "content loader", "lazy", "busy"],
  imports: ["Skeleton"],
  Thumbnail: SkeletonThumbnail,
  Playground: definePlayground({
    defaults: { variant: "text", lines: "3", animated: true },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      lines: { type: "select", label: "Lines (text)", options: lineCounts },
      animated: { type: "boolean", label: "Animated" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Skeleton
          variant={values.variant}
          lines={Number(values.lines)}
          animated={values.animated}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Skeleton"],
        formatJsx(
          "Skeleton",
          {
            variant: values.variant,
            lines:
              values.variant === "text" && values.lines !== "1" ? Number(values.lines) : undefined,
            animated: values.animated ? undefined : expr("false"),
          },
          undefined,
          { defaults: { variant: "text" } },
        ),
      ),
  }),
  examples: [
    {
      id: "text",
      title: "Text",
      description:
        "A text skeleton takes the space of one line of the text around it, so it follows the font size of its container (or its own `style`). Stacked lines keep the spacing of a paragraph. With `lines`, the last line is shorter.",
      Component: Text,
      code: textCode,
    },
    {
      id: "card-placeholder",
      title: "Card placeholder",
      description: "Combine the variants to sketch the layout of the content that's loading.",
      Component: CardPlaceholder,
      code: cardPlaceholderCode,
    },
    {
      id: "loading-state",
      title: "Loading state",
      description:
        "Toggle between the skeleton and the loaded content. The skeleton matches the content's size, so nothing moves when it arrives. The card is `aria-busy` while loading, and a status message tells screen readers what's happening.",
      Component: Loading,
      code: loadingCode,
    },
    {
      id: "custom-sizes",
      title: "Custom sizes",
      description:
        "`width` and `height` take pixels (numbers) or any CSS length (strings). A circle needs only one of them. `animated={false}` turns the shimmer off.",
      Component: CustomSizes,
      code: customSizesCode,
    },
  ],
  api: [
    {
      title: "Skeleton",
      description:
        'Renders a `<span>` (displayed as a block) with `aria-hidden="true"`, and accepts its native attributes. The `ref` points to it.',
      props: [
        {
          name: "variant",
          type: '"text" | "circular" | "rectangular"',
          default: '"text"',
          description:
            "Shape: a line of text, a circle (40px by default) or a rectangle (full width, 96px tall by default).",
        },
        {
          name: "width",
          type: "number | string",
          description:
            "Width. Numbers are pixels, strings any CSS length. Text defaults to the full width.",
        },
        {
          name: "height",
          type: "number | string",
          description:
            "Height. Numbers are pixels, strings any CSS length. For text, it's the thickness of the bar (and of each bar with `lines`); the line keeps some space above and below it, like text.",
        },
        {
          name: "lines",
          type: "number",
          default: "1",
          description: "Number of text lines, for the `text` variant. The last line is 60% wide.",
        },
        {
          name: "animated",
          type: "boolean",
          default: "true",
          description:
            "Shows a subtle shimmer. It stays still when the user prefers reduced motion.",
        },
        {
          name: "style",
          type: "object",
          description: "Inline styles; they win over `width` and `height`.",
        },
      ],
    },
  ],
  accessibility: [
    'Skeletons are always hidden from screen readers (`aria-hidden="true"`): they are only a visual placeholder.',
    'Mark the region that is loading with `aria-busy="true"`, and keep a text status for screen readers, such as a `role="status"` element that says “Loading activity…”.',
    "Replace skeletons with content of the same size, so the layout doesn't shift when it loads.",
    "The shimmer stops when the user prefers reduced motion, and the shapes are outlined in forced-colors (high contrast) mode.",
  ],
};
