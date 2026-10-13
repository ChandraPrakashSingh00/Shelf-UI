import { Badge, Table } from "shelf-ui-react";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const shortDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const statusVariant = {
  Pending: "warning",
  Processing: "neutral",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "danger",
};
// Sort statuses by where the order is in the pipeline, not alphabetically.
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
  {
    id: 1036,
    customer: "Kavya Menon",
    city: "Kochi",
    date: new Date(2026, 9, 1),
    status: "Delivered",
    amount: 599,
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
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (order) => shortDate.format(order.date),
  },
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
  },
];

export default function TableOrders() {
  return (
    <Table
      caption="Recent orders"
      columns={columns}
      data={orders}
      defaultSort={{ key: "date", direction: "desc" }}
    />
  );
}
