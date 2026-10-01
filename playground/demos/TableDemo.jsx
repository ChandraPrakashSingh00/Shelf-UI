import { Badge, Button, EmptyState, Switch, Table } from "@codecps/ui";
import { useState } from "react";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const shortDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

const statusVariant = {
  Pending: "warning",
  Processing: "neutral",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "danger",
};
const pipeline = Object.keys(statusVariant);

const orders = [
  {
    id: 1042,
    customer: "Priya Sharma",
    city: "Mumbai",
    date: new Date(2026, 9, 6),
    status: "Pending",
    amount: 2499,
  },
  {
    id: 1041,
    customer: "Rahul Verma",
    city: "Delhi",
    date: new Date(2026, 9, 5),
    status: "Shipped",
    amount: 12999,
  },
  {
    id: 1040,
    customer: "Ananya Iyer",
    city: "Bengaluru",
    date: new Date(2026, 9, 5),
    status: "Processing",
    amount: 849,
  },
  {
    id: 1039,
    customer: "Arjun Reddy",
    city: "Hyderabad",
    date: new Date(2026, 9, 4),
    status: "Delivered",
    amount: 124500,
  },
  {
    id: 1038,
    customer: "Sneha Patel",
    city: "Ahmedabad",
    date: new Date(2026, 9, 3),
    status: "Cancelled",
    amount: 3299,
  },
  {
    id: 1037,
    customer: "Vikram Singh",
    city: "Jaipur",
    date: new Date(2026, 9, 2),
    status: "Delivered",
    amount: 45999,
  },
];

const columns = [
  {
    key: "id",
    header: "Order",
    rowHeader: true,
    sortable: true,
    render: (order) => `#${order.id}`,
  },
  { key: "customer", header: "Customer", sortable: true },
  { key: "city", header: "City", sortable: true },
  { key: "date", header: "Date", sortable: true, render: (order) => shortDate.format(order.date) },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortFn: (a, b) => pipeline.indexOf(a.status) - pipeline.indexOf(b.status),
    render: (order) => <Badge variant={statusVariant[order.status]}>{order.status}</Badge>,
  },
  {
    key: "amount",
    header: "Amount",
    numeric: true,
    sortable: true,
    render: (order) => rupees.format(order.amount),
    footer: rupees.format(orders.reduce((sum, order) => sum + order.amount, 0)),
  },
];

export function TableDemo() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sort, setSort] = useState({ key: "date", direction: "desc" });
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [striped, setStriped] = useState(false);
  const [dense, setDense] = useState(false);

  return (
    <div className="pg-stack">
      <div className="pg-row">
        <Switch label="Loading" checked={loading} onCheckedChange={setLoading} />
        <Switch label="No data" checked={empty} onCheckedChange={setEmpty} />
        <Switch label="Striped" checked={striped} onCheckedChange={setStriped} />
        <Switch label="Dense" checked={dense} onCheckedChange={setDense} />
      </div>
      <div className="pg-row">
        <span className="pg-muted" role="status">
          {selectedIds.length} selected · sorted by{" "}
          {sort ? `${sort.key} (${sort.direction})` : "nothing"}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={selectedIds.length === 0}
          onClick={() => setSelectedIds([])}
        >
          Clear selection
        </Button>
      </div>
      <Table
        caption="Recent orders"
        columns={columns}
        data={empty ? [] : orders}
        sort={sort}
        onSortChange={setSort}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        isRowSelectable={(order) => order.status !== "Cancelled"}
        getRowLabel={(order) => `Select order #${order.id}`}
        loading={loading}
        striped={striped}
        size={dense ? "sm" : "md"}
        emptyState={
          <EmptyState
            size="sm"
            headingLevel={4}
            title="No orders yet"
            description="Orders from your store show up here."
          />
        }
      />
    </div>
  );
}
