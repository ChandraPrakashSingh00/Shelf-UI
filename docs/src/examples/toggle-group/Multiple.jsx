import { ToggleGroup } from "@codecps/ui";
import { useState } from "react";

const orders = [
  { id: "#10421", city: "Mumbai", status: "pending" },
  { id: "#10422", city: "Delhi", status: "shipped" },
  { id: "#10423", city: "Bengaluru", status: "delivered" },
  { id: "#10424", city: "Chennai", status: "pending" },
  { id: "#10425", city: "Hyderabad", status: "returned" },
  { id: "#10426", city: "Kolkata", status: "shipped" },
];

export default function ToggleGroupMultiple() {
  const [statuses, setStatuses] = useState(["pending", "shipped"]);
  const visible = orders.filter((order) => statuses.includes(order.status));

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 440 }}>
      <ToggleGroup
        type="multiple"
        label="Show orders that are"
        variant="ghost"
        size="sm"
        value={statuses}
        onValueChange={setStatuses}
      >
        <ToggleGroup.Item value="pending">Pending</ToggleGroup.Item>
        <ToggleGroup.Item value="shipped">Shipped</ToggleGroup.Item>
        <ToggleGroup.Item value="delivered">Delivered</ToggleGroup.Item>
        <ToggleGroup.Item value="returned">Returned</ToggleGroup.Item>
      </ToggleGroup>
      <p aria-live="polite" style={{ margin: 0, color: "var(--cps-color-text-muted)" }}>
        {visible.length === 0
          ? "No orders match these filters."
          : `${visible.length} orders: ${visible.map((order) => `${order.id} (${order.city})`).join(", ")}`}
      </p>
    </div>
  );
}
