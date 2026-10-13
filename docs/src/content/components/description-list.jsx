import { DescriptionList } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Compact from "../../examples/description-list/Compact.jsx";
import compactCode from "../../examples/description-list/Compact.jsx?raw";
import CustomerDetails from "../../examples/description-list/CustomerDetails.jsx";
import customerDetailsCode from "../../examples/description-list/CustomerDetails.jsx?raw";
import OrderSummary from "../../examples/description-list/OrderSummary.jsx";
import orderSummaryCode from "../../examples/description-list/OrderSummary.jsx?raw";
import Specifications from "../../examples/description-list/Specifications.jsx";
import specificationsCode from "../../examples/description-list/Specifications.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const layouts = ["horizontal", "vertical"];
const columnCounts = ["1", "2", "3"];
const sizes = ["sm", "md"];
const alignments = ["start", "end"];

const playgroundItems = [
  { term: "Order", description: "#1042" },
  { term: "Placed on", description: "6 Oct 2026" },
  { term: "Payment", description: "UPI" },
  { term: "Items", description: "3" },
  { term: "Delivery", description: "Andheri West, Mumbai" },
  { term: "Total", description: "₹2,866" },
];

const playgroundSetup = `const items = [
  { term: "Order", description: "#1042" },
  { term: "Placed on", description: "6 Oct 2026" },
  { term: "Payment", description: "UPI" },
  // …
];

`;

function DescriptionListThumbnail() {
  return (
    <DescriptionList
      size="sm"
      align="end"
      divided
      items={[
        { term: "Subtotal", description: "₹2,598" },
        { term: "Shipping", description: "Free" },
        { term: "Total", description: <strong>₹2,866</strong> },
      ]}
      style={{ maxWidth: 272 }}
    />
  );
}

export const descriptionListDoc = {
  slug: "description-list",
  name: "DescriptionList",
  category: "Data display",
  summary: "Term and description pairs, like an order summary or product specifications.",
  description:
    "Lists label–value pairs — an order summary, product specifications, customer details — as a semantic `<dl>`. Pairs sit side by side or stacked, in one to three columns, and adapt to the width of their container.",
  keywords: [
    "dl",
    "definition list",
    "key value",
    "details",
    "properties",
    "specifications",
    "specs",
    "summary",
    "order summary",
  ],
  imports: ["DescriptionList"],
  Thumbnail: DescriptionListThumbnail,
  Playground: definePlayground({
    defaults: { layout: "horizontal", columns: "1", divided: true, size: "md", align: "start" },
    controls: {
      layout: { type: "select", label: "Layout", options: layouts },
      columns: { type: "select", label: "Columns", options: columnCounts },
      size: { type: "select", label: "Size", options: sizes },
      align: { type: "select", label: "Align", options: alignments },
      divided: { type: "boolean", label: "Divided" },
    },
    render: (values) => (
      <DescriptionList
        items={playgroundItems}
        layout={values.layout}
        columns={Number(values.columns)}
        size={values.size}
        align={values.align}
        divided={values.divided}
        style={{ maxWidth: values.columns === "1" ? 420 : undefined }}
      />
    ),
    code: (values) =>
      withImport(
        ["DescriptionList"],
        playgroundSetup +
          formatJsx(
            "DescriptionList",
            {
              items: expr("items"),
              layout: values.layout,
              columns: Number(values.columns),
              size: values.size,
              align: values.align,
              divided: values.divided,
            },
            undefined,
            { defaults: { layout: "horizontal", columns: 1, size: "md", align: "start" } },
          ),
      ),
  }),
  examples: [
    {
      id: "order-summary",
      title: "Order summary",
      description:
        '`align="end"` lines the amounts up on the right and `divided` adds lines between rows. Pairs can come from `items`, from `DescriptionList.Item` children, or both — here the bold total is a child.',
      Component: OrderSummary,
      code: orderSummaryCode,
    },
    {
      id: "specifications",
      title: "Product specifications",
      description:
        "`columns={2}` puts the pairs in two columns, which become one when the list is narrower than 36rem. Switch the preview to mobile to see it.",
      Component: Specifications,
      code: specificationsCode,
      responsive: true,
    },
    {
      id: "customer-details",
      title: "Customer details",
      description:
        '`layout="vertical"` puts each term above its value, which suits cards. `fullWidth` lets a long value, like an address, span both columns.',
      Component: CustomerDetails,
      code: customerDetailsCode,
    },
    {
      id: "compact",
      title: "Compact, with a fixed term width",
      description:
        '`size="sm"` tightens the rows, and `termWidth` sets the width of the term column instead of a third of the row.',
      Component: Compact,
      code: compactCode,
    },
  ],
  api: [
    {
      title: "DescriptionList",
      description:
        "Renders a `<dl>` and accepts its native attributes. The `ref` points to it. The layout adapts to the list's own width (a CSS container), not the viewport.",
      props: [
        {
          name: "items",
          type: "array",
          description:
            "Pairs to render, as `{ term, description, key?, fullWidth? }` objects. Rendered before any children.",
        },
        {
          name: "children",
          type: "node",
          description: "`DescriptionList.Item` elements.",
        },
        {
          name: "layout",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description:
            "`horizontal` puts the term beside its description, stacking them when the list is narrower than 16rem; `vertical` puts the term above.",
        },
        {
          name: "columns",
          type: "1 | 2 | 3",
          default: "1",
          description:
            "Number of columns of pairs. Three become two below 52rem, and any become one below 36rem.",
        },
        {
          name: "divided",
          type: "boolean",
          default: "false",
          description: "Draws lines between the rows.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Text size and row spacing.",
        },
        {
          name: "align",
          type: '"start" | "end"',
          default: '"start"',
          description:
            "Alignment of the descriptions in the horizontal layout, e.g. `end` for the amounts of an order summary.",
        },
        {
          name: "termWidth",
          type: "string | number",
          description:
            "Width of the term column in the horizontal layout (numbers are pixels). Defaults to a third of the row.",
        },
      ],
    },
    {
      title: "DescriptionList.Item",
      description:
        "Also exported as `DescriptionListItem`. Renders a `<div>` around a `<dt>` and a `<dd>`; other props and the `ref` go to the `<div>`.",
      props: [
        { name: "term", type: "node", required: true, description: 'The label, e.g. "Shipping".' },
        { name: "children", type: "node", description: 'The description, e.g. "Free".' },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Spans every column of a multi-column list, e.g. for an address.",
        },
      ],
    },
  ],
  accessibility: [
    "Renders a native description list: a `<dl>` of `<dt>` terms and `<dd>` descriptions, each pair wrapped in a `<div>` (valid HTML). Screen readers announce the list and its number of items, and read each term with its description.",
    "The visual order always matches the source order, in every layout and column count.",
    "Put a heading before the list (like the card titles above) so people know what the pairs describe; don't rely on `aria-label`, which isn't reliably announced on a `<dl>`.",
  ],
};
