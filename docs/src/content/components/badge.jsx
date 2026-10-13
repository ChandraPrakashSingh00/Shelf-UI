import { Badge } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import InContext from "../../examples/badge/InContext.jsx";
import inContextCode from "../../examples/badge/InContext.jsx?raw";
import Sizes from "../../examples/badge/Sizes.jsx";
import sizesCode from "../../examples/badge/Sizes.jsx?raw";
import Variants from "../../examples/badge/Variants.jsx";
import variantsCode from "../../examples/badge/Variants.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["primary", "success", "warning", "danger", "neutral"];
const sizes = ["sm", "md"];

function BadgeThumbnail() {
  return (
    <>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
    </>
  );
}

export const badgeDoc = {
  slug: "badge",
  name: "Badge",
  category: "Data display",
  summary: "Short label for a status, category or count.",
  description:
    "A compact label for statuses (`Active`, `Failed`), categories and counts. Pick the variant that matches the meaning, and always include text — color alone isn't enough.",
  keywords: ["tag", "label", "chip", "status", "pill", "count"],
  imports: ["Badge"],
  Thumbnail: BadgeThumbnail,
  Playground: definePlayground({
    defaults: { variant: "success", size: "md", label: "Active" },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
    },
    render: (values) => (
      <Badge variant={values.variant} size={values.size}>
        {values.label}
      </Badge>
    ),
    code: (values) =>
      withImport(
        ["Badge"],
        formatJsx("Badge", { variant: values.variant, size: values.size }, values.label, {
          defaults: { variant: "neutral", size: "md" },
        }),
      ),
  }),
  examples: [
    { id: "variants", title: "Variants", Component: Variants, code: variantsCode },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "in-context",
      title: "In a list",
      description: "Map your own data to a variant, and keep a readable label next to the color.",
      Component: InContext,
      code: inContextCode,
    },
  ],
  api: [
    {
      title: "Badge",
      description: "Renders a `<span>` and accepts its native attributes. The `ref` points to it.",
      props: [
        {
          name: "variant",
          type: '"primary" | "success" | "warning" | "danger" | "neutral"',
          default: '"neutral"',
          description: "Color scheme.",
        },
        { name: "size", type: '"sm" | "md"', default: '"md"', description: "Height and padding." },
        { name: "children", type: "node", description: "The label." },
      ],
    },
  ],
  accessibility: [
    "Badge is a plain `<span>`; screen readers read its text as part of the surrounding content.",
    "Color is never the only signal: always include a text label such as “Failed”, not just a red badge.",
    "For counts, give context in nearby text (for example “Notifications, 3 unread”) instead of a bare number.",
  ],
};
