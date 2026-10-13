import { Button, ToggleGroup } from "shelf-ui-react";
import { useState } from "react";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export function ToggleGroupDemo() {
  const [range, setRange] = useState("7d");
  const [statuses, setStatuses] = useState(["pending"]);
  const [submitted, setSubmitted] = useState("");

  return (
    <div className="pg-stack">
      <form
        className="pg-row"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(`size=${new FormData(event.currentTarget).get("size")}`);
        }}
      >
        <ToggleGroup label="Size" name="size" defaultValue="M">
          {SIZES.map((size) => (
            <ToggleGroup.Item key={size} value={size} disabled={size === "XL"}>
              {size}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
        <Button type="submit" size="sm">
          Add to cart
        </Button>
        <Button type="reset" size="sm" variant="ghost">
          Reset
        </Button>
        {submitted && <span className="pg-muted">{submitted}</span>}
      </form>

      <div className="pg-row">
        <ToggleGroup aria-label="Date range" size="sm" value={range} onValueChange={setRange}>
          <ToggleGroup.Item value="today">Today</ToggleGroup.Item>
          <ToggleGroup.Item value="7d">7 days</ToggleGroup.Item>
          <ToggleGroup.Item value="30d">30 days</ToggleGroup.Item>
        </ToggleGroup>
        <span className="pg-muted">range: {range}</span>
      </div>

      <div className="pg-row">
        <ToggleGroup
          type="multiple"
          variant="ghost"
          aria-label="Order status"
          value={statuses}
          onValueChange={setStatuses}
        >
          <ToggleGroup.Item value="pending">Pending</ToggleGroup.Item>
          <ToggleGroup.Item value="shipped">Shipped</ToggleGroup.Item>
          <ToggleGroup.Item value="delivered">Delivered</ToggleGroup.Item>
        </ToggleGroup>
        <span className="pg-muted">statuses: {statuses.join(", ") || "none"}</span>
      </div>

      <div className="pg-row" style={{ alignItems: "flex-start" }}>
        <ToggleGroup label="Delivery" orientation="vertical" defaultValue="standard">
          <ToggleGroup.Item value="standard">Standard · Free</ToggleGroup.Item>
          <ToggleGroup.Item value="express">Express · ₹99</ToggleGroup.Item>
        </ToggleGroup>
        <div className="pg-narrow" style={{ flex: 1, minWidth: 220 }}>
          <ToggleGroup label="Pay with" fullWidth defaultValue="upi" size="lg">
            <ToggleGroup.Item value="upi">UPI</ToggleGroup.Item>
            <ToggleGroup.Item value="card">Card</ToggleGroup.Item>
            <ToggleGroup.Item value="cod">COD</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
