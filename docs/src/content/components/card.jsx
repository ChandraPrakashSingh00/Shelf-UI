import { Button, Card } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Composition from "../../examples/card/Composition.jsx";
import compositionCode from "../../examples/card/Composition.jsx?raw";
import Shorthand from "../../examples/card/Shorthand.jsx";
import shorthandCode from "../../examples/card/Shorthand.jsx?raw";
import Variants from "../../examples/card/Variants.jsx";
import variantsCode from "../../examples/card/Variants.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["outlined", "elevated", "filled"];

function CardThumbnail() {
  return (
    <Card title="Starter" description="For small teams." style={{ width: 200, padding: 16 }} />
  );
}

export const cardDoc = {
  slug: "card",
  name: "Card",
  category: "Layout",
  summary: "Groups related content and actions on a surface.",
  description:
    "A surface for grouping related content, like a plan, a project or a settings section. Compose it from `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content` and `Card.Footer`, or use the `title`, `description` and `footer` shorthand.",
  keywords: ["panel", "container", "surface", "tile", "box", "pricing"],
  imports: ["Card"],
  Thumbnail: CardThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "outlined",
      title: "Deployments",
      description: "Last 24 hours",
      content: "12 successful · 1 failed",
      footer: true,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      title: { type: "text", label: "Title" },
      description: { type: "text", label: "Description" },
      content: { type: "text", label: "Content" },
      footer: { type: "boolean", label: "Footer" },
    },
    render: (values) => (
      <Card
        variant={values.variant}
        title={values.title || undefined}
        description={values.description || undefined}
        footer={values.footer ? <Button size="sm">View all</Button> : undefined}
        style={{ width: "100%", maxWidth: 380 }}
      >
        {values.content}
      </Card>
    ),
    code: (values) =>
      withImport(
        values.footer ? ["Button", "Card"] : ["Card"],
        formatJsx(
          "Card",
          {
            variant: values.variant,
            title: values.title || undefined,
            description: values.description || undefined,
            footer: values.footer ? expr('<Button size="sm">View all</Button>') : undefined,
          },
          values.content,
          { defaults: { variant: "outlined" } },
        ),
      ),
  }),
  examples: [
    {
      id: "composition",
      title: "Composition",
      description: "Build the card from its parts for full control over the layout.",
      Component: Composition,
      code: compositionCode,
    },
    {
      id: "shorthand",
      title: "Shorthand props",
      description:
        "`title`, `description` and `footer` render the header and footer for you; children become the content.",
      Component: Shorthand,
      code: shorthandCode,
    },
    { id: "variants", title: "Variants", Component: Variants, code: variantsCode },
  ],
  api: [
    {
      title: "Card",
      description: "Renders a `<div>` and accepts its native attributes. The `ref` points to it.",
      props: [
        {
          name: "variant",
          type: '"outlined" | "elevated" | "filled"',
          default: '"outlined"',
          description: "Visual style.",
        },
        { name: "title", type: "node", description: "Shorthand for a header with `Card.Title`." },
        {
          name: "description",
          type: "node",
          description: "Shorthand for `Card.Description` in the header.",
        },
        { name: "footer", type: "node", description: "Shorthand for `Card.Footer`." },
        {
          name: "children",
          type: "node",
          description: "Card parts, or the content when you use the shorthand props.",
        },
      ],
    },
    {
      title: "Card.Title",
      description: "Also exported as `CardTitle`.",
      props: [
        {
          name: "as",
          type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',
          default: '"h3"',
          description: "Heading element, so the card fits the page's heading outline.",
        },
      ],
    },
    {
      title: "Card.Header, Card.Description, Card.Content, Card.Footer",
      description:
        "Layout parts. `Card.Description` renders a `<p>`, the others a `<div>`; all accept their element's native attributes. Also exported as `CardHeader`, `CardDescription`, `CardContent` and `CardFooter`.",
      props: [{ name: "children", type: "node", description: "Content of the part." }],
    },
  ],
  accessibility: [
    "Card is a plain `<div>` without a landmark role, so it adds no extra noise for screen readers.",
    "`Card.Title` renders an `<h3>`. Use `as` to keep the page's heading levels in order.",
    "For a clickable card, put a real link or button inside it (for example on the title) rather than making the whole `<div>` clickable.",
  ],
};
