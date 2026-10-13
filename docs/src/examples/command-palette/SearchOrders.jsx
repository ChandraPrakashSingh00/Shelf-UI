import { Button, CommandPalette } from "shelf-ui-react";
import { useState } from "react";

const orders = [
  { number: 1042, customer: "Priya Sharma", city: "Pune", total: 2499, status: "Unpaid" },
  { number: 1043, customer: "Rahul Verma", city: "Delhi", total: 899, status: "Packed" },
  { number: 1044, customer: "Ananya Iyer", city: "Chennai", total: 5120, status: "Shipped" },
  { number: 1045, customer: "Arjun Nair", city: "Kochi", total: 1350, status: "Packed" },
  { number: 1046, customer: "Sneha Reddy", city: "Hyderabad", total: 3780, status: "Unpaid" },
  { number: 1047, customer: "Vikram Singh", city: "Jaipur", total: 640, status: "Shipped" },
];

const groupFor = (status) => (status === "Shipped" ? "On the way" : "Needs action");

// Each order becomes a command: the customer and city are searchable through keywords.
const items = orders.map((order) => ({
  id: String(order.number),
  label: `#${order.number} · ${order.customer}`,
  description: `₹${order.total.toLocaleString("en-IN")} · ${order.status} · ${order.city}`,
  group: groupFor(order.status),
  keywords: [order.city, order.status, "order"],
}));

export default function CommandPaletteSearchOrders() {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Find an order
      </Button>
      <p style={{ margin: 0, fontSize: 14 }}>
        {orderId ? `Opening order #${orderId}…` : "Search by number, customer, city or status."}
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={null}
        label="Find an order"
        searchLabel="Search orders"
        placeholder="Try “1044”, “packed” or “pune”"
        emptyMessage="No orders match. Check the order number and try again."
        items={items}
        onSelect={(item) => setOrderId(item.id)}
      />
    </div>
  );
}
