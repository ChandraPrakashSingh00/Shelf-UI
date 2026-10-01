import { Badge, Button, Table } from "@codecps/ui";
import { useState } from "react";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const statusVariant = { Pending: "warning", Processing: "neutral", Shipped: "primary" };

const initialOrders = [
  { id: 1052, customer: "Aarav Mehta", city: "Pune", items: 3, status: "Pending", amount: 4297 },
  {
    id: 1051,
    customer: "Isha Kapoor",
    city: "Delhi",
    items: 1,
    status: "Processing",
    amount: 1899,
  },
  { id: 1050, customer: "Rohan Das", city: "Kolkata", items: 2, status: "Shipped", amount: 7450 },
  { id: 1049, customer: "Meera Joshi", city: "Mumbai", items: 5, status: "Pending", amount: 15990 },
  { id: 1048, customer: "Karan Patel", city: "Surat", items: 1, status: "Processing", amount: 649 },
];

const columns = [
  { key: "id", header: "Order", rowHeader: true, render: (order) => `#${order.id}` },
  { key: "customer", header: "Customer" },
  { key: "city", header: "City" },
  { key: "items", header: "Items", numeric: true },
  {
    key: "status",
    header: "Status",
    render: (order) => <Badge variant={statusVariant[order.status]}>{order.status}</Badge>,
  },
  {
    key: "amount",
    header: "Amount",
    numeric: true,
    render: (order) => rupees.format(order.amount),
  },
];

// Orders that have already shipped can't be selected.
const canShip = (order) => order.status !== "Shipped";

export default function TableSelection() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedIds, setSelectedIds] = useState([1049]);

  const markAsShipped = () => {
    setOrders((current) =>
      current.map((order) =>
        selectedIds.includes(order.id) ? { ...order, status: "Shipped" } : order,
      ),
    );
    setSelectedIds([]);
  };

  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span role="status">
          {selectedIds.length === 0
            ? "Select orders to ship"
            : `${selectedIds.length} ${selectedIds.length === 1 ? "order" : "orders"} selected`}
        </span>
        <Button size="sm" disabled={selectedIds.length === 0} onClick={markAsShipped}>
          Mark as shipped
        </Button>
      </div>
      <Table
        caption="Orders to fulfil"
        captionHidden
        columns={columns}
        data={orders}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        isRowSelectable={canShip}
        getRowLabel={(order) => `Select order #${order.id}`}
        selectAllLabel="Select all orders"
      />
    </div>
  );
}
