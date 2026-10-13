import { Badge, Table } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Inventory from "../../examples/table/Inventory.jsx";
import inventoryCode from "../../examples/table/Inventory.jsx?raw";
import Orders from "../../examples/table/Orders.jsx";
import ordersCode from "../../examples/table/Orders.jsx?raw";
import Selection from "../../examples/table/Selection.jsx";
import selectionCode from "../../examples/table/Selection.jsx?raw";
import ServerSide from "../../examples/table/ServerSide.jsx";
import serverSideCode from "../../examples/table/ServerSide.jsx?raw";
import States from "../../examples/table/States.jsx";
import statesCode from "../../examples/table/States.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md"];
const formatRupees = (amount) => `₹${amount.toLocaleString("en-IN")}`;

const thumbnailColumns = [
  { key: "id", header: "Order", render: (order) => `#${order.id}` },
  {
    key: "status",
    header: "Status",
    render: (order) => (
      <Badge size="sm" variant={order.variant}>
        {order.status}
      </Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    numeric: true,
    sortable: true,
    render: (order) => formatRupees(order.amount),
  },
];

const thumbnailOrders = [
  { id: 1042, status: "Paid", variant: "success", amount: 12999 },
  { id: 1041, status: "Pending", variant: "warning", amount: 849 },
];

function TableThumbnail() {
  return (
    <Table
      aria-label="Orders"
      size="sm"
      columns={thumbnailColumns}
      data={thumbnailOrders}
      defaultSort={{ key: "amount", direction: "desc" }}
      style={{ maxWidth: 240, fontSize: "var(--shelf-font-size-xs)" }}
    />
  );
}

const playgroundColumns = [
  { key: "id", header: "Order", rowHeader: true, render: (order) => `#${order.id}` },
  { key: "customer", header: "Customer", sortable: true },
  { key: "city", header: "City" },
  {
    key: "amount",
    header: "Amount",
    numeric: true,
    sortable: true,
    render: (order) => formatRupees(order.amount),
  },
];

const playgroundOrders = [
  { id: 1042, customer: "Priya Sharma", city: "Mumbai", amount: 2499 },
  { id: 1041, customer: "Rahul Verma", city: "Delhi", amount: 12999 },
  { id: 1040, customer: "Ananya Iyer", city: "Bengaluru", amount: 849 },
  { id: 1039, customer: "Arjun Reddy", city: "Hyderabad", amount: 124500 },
];

const playgroundSetup = `const columns = [
  { key: "id", header: "Order", rowHeader: true, render: (order) => \`#\${order.id}\` },
  { key: "customer", header: "Customer", sortable: true },
  { key: "city", header: "City" },
  {
    key: "amount",
    header: "Amount",
    numeric: true,
    sortable: true,
    render: (order) => \`₹\${order.amount.toLocaleString("en-IN")}\`,
  },
];

`;

export const tableDoc = {
  slug: "table",
  name: "Table",
  category: "Data display",
  summary: "Data table with sortable columns, row selection, and empty and loading states.",
  description:
    "Shows rows of data — orders, products, customers — in a native `<table>` built from a `columns` definition. Columns can sort (numbers, text and dates each the right way), rows can be selected with checkboxes, and the table scrolls sideways on small screens instead of breaking the layout.",
  keywords: [
    "data table",
    "datagrid",
    "grid",
    "sort",
    "sortable",
    "select rows",
    "bulk actions",
    "orders",
    "admin",
    "rows",
    "columns",
  ],
  imports: ["Table"],
  Thumbnail: TableThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      selectable: false,
      striped: false,
      hoverable: true,
      loading: false,
      empty: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      selectable: { type: "boolean", label: "Selectable" },
      striped: { type: "boolean", label: "Striped" },
      hoverable: { type: "boolean", label: "Hoverable" },
      loading: { type: "boolean", label: "Loading" },
      empty: { type: "boolean", label: "No data" },
    },
    render: (values) => (
      <Table
        caption="Recent orders"
        columns={playgroundColumns}
        data={values.empty ? [] : playgroundOrders}
        size={values.size}
        selectable={values.selectable}
        getRowLabel={(order) => `Select order #${order.id}`}
        striped={values.striped}
        hoverable={values.hoverable}
        loading={values.loading}
        loadingRows={4}
      />
    ),
    code: (values) =>
      withImport(
        ["Table"],
        playgroundSetup +
          formatJsx(
            "Table",
            {
              caption: "Recent orders",
              columns: expr("columns"),
              data: expr(values.empty ? "[]" : "orders"),
              size: values.size,
              selectable: values.selectable,
              getRowLabel: values.selectable
                ? expr("(order) => `Select order #${order.id}`")
                : undefined,
              striped: values.striped,
              hoverable: values.hoverable ? undefined : expr("false"),
              loading: values.loading,
            },
            undefined,
            { defaults: { size: "md" } },
          ),
      ),
  }),
  examples: [
    {
      id: "orders",
      title: "Sortable orders",
      description:
        "Click a sortable header, or focus it and press Enter, to sort ascending, then descending, then back to the original order. Amounts sort as numbers and dates by time; the status column uses `sortFn` to follow the order pipeline. The order id is the row header (`rowHeader`), so screen readers announce it with every cell.",
      Component: Orders,
      code: ordersCode,
      responsive: true,
    },
    {
      id: "selection",
      title: "Row selection and bulk actions",
      description:
        "`selectable` adds a checkbox column; the header checkbox selects every row and shows a mixed state in between. `isRowSelectable` disables rows that can't take the action — here, orders that have already shipped — and `getRowLabel` gives each checkbox a unique name.",
      Component: Selection,
      code: selectionCode,
    },
    {
      id: "server-side",
      title: "Server-side sorting and pagination",
      description:
        "With `manualSort`, the table shows `data` as it is and only reports the new sort order through `onSortChange`, so your API can sort. While `loading`, the current rows are dimmed (or skeleton rows fill an empty table) and screen readers hear `loadingLabel`.",
      Component: ServerSide,
      code: serverSideCode,
    },
    {
      id: "states",
      title: "Empty and loading states",
      description:
        "`emptyState` fills a full-width row when there's no data — plain text, or an `EmptyState` with an icon and a next step. With `loading` and no data, `loadingRows` skeleton rows keep the layout steady.",
      Component: States,
      code: statesCode,
    },
    {
      id: "inventory",
      title: "Dense, striped, with a sticky header",
      description:
        '`size="sm"` and `striped` suit long lists. `maxHeight` makes the table scroll inside its container and `stickyHeader` keeps the column headers in view; a column\'s `footer` adds a totals row.',
      Component: Inventory,
      code: inventoryCode,
    },
  ],
  api: [
    {
      title: "Table",
      description:
        "Other props (`aria-label`, `aria-describedby`, `id`, …) and the `ref` go to the `<table>`; `className` and `style` go to the scrolling container around it.",
      props: [
        {
          name: "columns",
          type: "array",
          required: true,
          description: "Column definitions, in display order. See **Column** below.",
        },
        { name: "data", type: "array", default: "[]", description: "The rows to show." },
        {
          name: "getRowId",
          type: "function(row)",
          default: "(row) => row.id",
          description: "Returns a row's stable, unique id, used as its key and in the selection.",
        },
        {
          name: "caption",
          type: "node",
          description:
            "Title of the table, rendered as its `<caption>`; it also names the scrolling region. Without it, pass `aria-label`.",
        },
        {
          name: "captionHidden",
          type: "boolean",
          default: "false",
          description: "Keeps the caption for screen readers only.",
        },
        {
          name: "sort",
          type: "object | null",
          description:
            'Current sort (controlled): `{ key, direction: "asc" | "desc" }`, or `null`.',
        },
        {
          name: "defaultSort",
          type: "object | null",
          default: "null",
          description: "Initial sort (uncontrolled).",
        },
        {
          name: "onSortChange",
          type: "function(sort)",
          description:
            "Called with the new sort when a sortable header is activated: ascending, then descending, then `null`.",
        },
        {
          name: "manualSort",
          type: "boolean",
          default: "false",
          description:
            "Shows `data` in the given order and leaves sorting to you, e.g. on the server. The headers still update the sort state and `aria-sort`.",
        },
        {
          name: "selectable",
          type: "boolean",
          default: "false",
          description: 'Adds a checkbox column with a "select all" checkbox in the header.',
        },
        {
          name: "selectedIds",
          type: "array",
          description: "Ids of the selected rows (controlled).",
        },
        {
          name: "defaultSelectedIds",
          type: "array",
          default: "[]",
          description: "Initially selected ids (uncontrolled).",
        },
        {
          name: "onSelectionChange",
          type: "function(ids)",
          description:
            'Called with the new array of selected ids. "Select all" only adds or removes the rows in `data`, so ids from other pages stay selected.',
        },
        {
          name: "isRowSelectable",
          type: "function(row)",
          description: "Return `false` to disable a row's checkbox and leave it out of select all.",
        },
        {
          name: "getRowLabel",
          type: "function(row)",
          default: '"Select " + row header value',
          description:
            'Accessible name of a row\'s checkbox, e.g. `(order) => "Select order #" + order.id`. By default it\'s "Select" followed by the value of the `rowHeader` column when that is text or a number ("Select Priya Sharma"), else "Select row".',
        },
        {
          name: "selectAllLabel",
          type: "string",
          default: '"Select all rows"',
          description: "Accessible name of the header checkbox.",
        },
        {
          name: "emptyState",
          type: "node",
          default: '"No data"',
          description: "Shown in a full-width row when `data` is empty, e.g. an `EmptyState`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Marks the table `aria-busy` and announces `loadingLabel`. Shows skeleton rows while there's no data, otherwise dims the current rows.",
        },
        {
          name: "loadingLabel",
          type: "string",
          default: '"Loading…"',
          description: "Text announced to screen readers when loading starts.",
        },
        {
          name: "loadingRows",
          type: "number",
          default: "5",
          description: "Number of skeleton rows while loading without data.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Row height and cell padding.",
        },
        {
          name: "striped",
          type: "boolean",
          default: "false",
          description: "Shades every other row.",
        },
        {
          name: "hoverable",
          type: "boolean",
          default: "true",
          description: "Highlights the row under the pointer.",
        },
        {
          name: "bordered",
          type: "boolean",
          default: "true",
          description:
            "Draws a rounded border around the table. Turn it off inside a card that has its own border.",
        },
        {
          name: "stickyHeader",
          type: "boolean",
          default: "false",
          description:
            "Keeps the column headers visible while the rows scroll. Use with `maxHeight`.",
        },
        {
          name: "maxHeight",
          type: "string | number",
          description: "Maximum height of the container, which then scrolls vertically.",
        },
        {
          name: "className",
          type: "string",
          description: "Class for the scrolling container. `style` goes there too.",
        },
      ],
    },
    {
      title: "Column",
      description: "Each entry of `columns`.",
      props: [
        {
          name: "key",
          type: "string",
          required: true,
          description:
            "Unique id of the column, used in the sort state. Also the field read from each row by default.",
        },
        { name: "header", type: "node", description: "Content of the column header." },
        {
          name: "accessor",
          type: "function(row)",
          default: "(row) => row[key]",
          description: "Returns the cell's value, used for sorting and when there's no `render`.",
        },
        {
          name: "render",
          type: "function(row)",
          description:
            "Returns the cell's content, e.g. a `Badge` or a formatted price. Without it, dates show as `YYYY-MM-DD` (the same on the server and in the browser); use `render` for localized dates.",
        },
        {
          name: "sortable",
          type: "boolean",
          default: "false",
          description: "Makes the header a button that sorts by this column.",
        },
        {
          name: "sortFn",
          type: "function(rowA, rowB)",
          description:
            'Custom comparator for ascending order; the table reverses it for descending. By default, numbers (and numeric text like "1.25") compare numerically, other text with numeric collation ("Order 9" before "Order 10"), dates by time, and empty values go last.',
        },
        {
          name: "align",
          type: '"start" | "center" | "end"',
          default: '"start"',
          description: 'Text alignment of the column (`"end"` for `numeric` columns).',
        },
        {
          name: "numeric",
          type: "boolean",
          default: "false",
          description: "Tabular figures and end alignment, for amounts, counts and quantities.",
        },
        {
          name: "rowHeader",
          type: "boolean",
          default: "false",
          description:
            'Renders the column\'s cells as row headers (`<th scope="row">`). Use it on the column that identifies the row, like the order id.',
        },
        {
          name: "width",
          type: "string | number",
          description: "Width of the column (numbers are pixels).",
        },
        {
          name: "footer",
          type: "node",
          description: "Content of the column's footer cell; any footer adds a `<tfoot>` row.",
        },
        {
          name: "className",
          type: "string",
          description: "Class for the column's header, body and footer cells.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab"],
      description:
        "Moves to the table when it scrolls, then through the sort buttons, checkboxes and any links or buttons in the cells.",
    },
    {
      keys: ["Enter", "Space"],
      description: "On a sort button: sorts ascending, then descending, then clears the sort.",
    },
    { keys: ["Space"], description: "On a checkbox: selects or clears the row, or all rows." },
    {
      keys: ["←", "→", "↑", "↓"],
      description: "When the table itself has focus, scrolls it.",
    },
  ],
  accessibility: [
    'A native `<table>` with `<th scope="col">` headers, so screen readers announce the column header with each cell. Set `rowHeader` on the identifying column (like the order id) to announce it too.',
    'Sortable headers contain a `<button>`; the sorted column\'s header has `aria-sort="ascending"` or `"descending"`. The arrow icons are decorative.',
    'When the table is wider (or taller) than its container, the container becomes a focusable `role="region"` named after the caption, so keyboard users can scroll it with the arrow keys. It isn\'t a Tab stop when nothing scrolls.',
    "Selection uses real checkboxes: the header one is named “Select all rows” and shows a mixed state when only some rows are selected. Row checkboxes are named after the row header by default (“Select Priya Sharma”); pass `getRowLabel` for other names. Selected rows are highlighted and outlined in forced-colors mode; `aria-selected` isn't used, as it only applies to grids.",
    'While `loading`, the table has `aria-busy="true"` and a status message announces `loadingLabel`. Skeleton rows are hidden from screen readers.',
    "Rows aren't clickable: put a link or button in a cell (e.g. the order id) so every action is reachable from the keyboard.",
  ],
};
