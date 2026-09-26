import { Pagination } from "@codecps/ui";
import { useState } from "react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/pagination/Basic.jsx";
import basicCode from "../../examples/pagination/Basic.jsx?raw";
import Controlled from "../../examples/pagination/Controlled.jsx";
import controlledCode from "../../examples/pagination/Controlled.jsx?raw";
import SiblingCount from "../../examples/pagination/SiblingCount.jsx";
import siblingCountCode from "../../examples/pagination/SiblingCount.jsx?raw";
import Sizes from "../../examples/pagination/Sizes.jsx";
import sizesCode from "../../examples/pagination/Sizes.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const pageCounts = ["5", "10", "20", "50"];
const counts = ["0", "1", "2"];
const sizes = ["sm", "md"];

function PaginationDemo({ totalPages, siblingCount, boundaryCount, size }) {
  const [page, setPage] = useState(5);
  return (
    <Pagination
      totalPages={Number(totalPages)}
      page={page}
      onPageChange={setPage}
      siblingCount={Number(siblingCount)}
      boundaryCount={Number(boundaryCount)}
      size={size}
    />
  );
}

function PaginationThumbnail() {
  return <Pagination totalPages={10} defaultPage={2} siblingCount={0} size="sm" label="Preview" />;
}

export const paginationDoc = {
  slug: "pagination",
  name: "Pagination",
  category: "Navigation",
  summary: "Moves between the pages of a long list or table.",
  description:
    "Previous and Next buttons around the page numbers, for lists and tables split into pages, like projects, invoices or build logs. Long ranges collapse into ellipses, and the number of buttons stays the same as the current page moves.",
  keywords: ["pager", "pages", "paging", "page numbers", "next", "previous", "table", "list"],
  imports: ["Pagination"],
  Thumbnail: PaginationThumbnail,
  Playground: definePlayground({
    defaults: { totalPages: "20", siblingCount: "1", boundaryCount: "1", size: "md" },
    controls: {
      totalPages: { type: "select", label: "Total pages", options: pageCounts },
      siblingCount: { type: "select", label: "Sibling count", options: counts },
      boundaryCount: { type: "select", label: "Boundary count", options: counts },
      size: { type: "select", label: "Size", options: sizes },
    },
    render: (values) => <PaginationDemo {...values} />,
    code: (values) =>
      withImport(
        ["Pagination"],
        formatJsx(
          "Pagination",
          {
            totalPages: Number(values.totalPages),
            page: expr("page"),
            onPageChange: expr("setPage"),
            siblingCount: Number(values.siblingCount),
            boundaryCount: Number(values.boundaryCount),
            size: values.size,
          },
          undefined,
          { defaults: { siblingCount: 1, boundaryCount: 1, size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Click a page, or use Previous and Next. Without `page`, the component keeps track of the current page itself.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `page` and `onPageChange`, then render the matching slice of your data. The status line tells screen reader users what changed.",
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: "sibling-count",
      title: "Many pages",
      description:
        "`siblingCount` sets how many pages surround the current one, and `boundaryCount` how many stay visible at each end. From top to bottom: `siblingCount={0}`, the defaults, and `siblingCount={2}` with `boundaryCount={2}`.",
      Component: SiblingCount,
      code: siblingCountCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "Pagination",
      description:
        "Renders a `<nav>` around a `<ul>` of buttons. Other props and the `ref` go to the `<nav>`.",
      props: [
        {
          name: "totalPages",
          type: "number",
          required: true,
          description: "Number of pages, at least 1: for example `Math.ceil(total / pageSize)`.",
        },
        {
          name: "page",
          type: "number",
          description: "Current page, counting from 1 (controlled). Clamped to `totalPages`.",
        },
        {
          name: "defaultPage",
          type: "number",
          default: "1",
          description: "Initial page (uncontrolled).",
        },
        {
          name: "onPageChange",
          type: "function(page)",
          description: "Called with the page the user chose.",
        },
        {
          name: "siblingCount",
          type: "number",
          default: "1",
          description: "Pages shown on each side of the current page.",
        },
        {
          name: "boundaryCount",
          type: "number",
          default: "1",
          description: "Pages always shown at the start and at the end.",
        },
        { name: "size", type: '"sm" | "md"', default: '"md"', description: "Button size." },
        {
          name: "label",
          type: "string",
          default: '"Pagination"',
          description: "Accessible name of the `<nav>` landmark.",
        },
        {
          name: "previousLabel",
          type: "string",
          default: '"Previous page"',
          description: "Accessible name of the Previous button.",
        },
        {
          name: "nextLabel",
          type: "string",
          default: '"Next page"',
          description: "Accessible name of the Next button.",
        },
        {
          name: "getPageLabel",
          type: "function(page)",
          description:
            'Returns the accessible name of a page\'s button. By default: "Page 1", "Page 2", …',
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab"],
      description: "Moves through Previous, the page buttons and Next. Ellipses aren't focusable.",
    },
    {
      keys: ["Enter", "Space"],
      description: "Goes to the focused page, or to the previous or next page.",
    },
  ],
  accessibility: [
    'Renders a `<nav>` landmark named "Pagination". With several on one page, give each its own `label`, like "Invoices pages".',
    'The current page\'s button has `aria-current="page"`. Page buttons are named "Page 1", "Page 2", …; `getPageLabel`, `previousLabel` and `nextLabel` let you translate every name.',
    "Previous and Next are native `disabled` buttons on the first and last page. If the one that becomes disabled had focus, focus moves to the current page instead of being lost.",
    "Ellipses are decorative (`aria-hidden`) and never focusable.",
    "Otherwise focus stays where it is when the page changes. Tell screen reader users what changed, for example with a “Showing 4–6 of 12 projects” status message.",
  ],
};
