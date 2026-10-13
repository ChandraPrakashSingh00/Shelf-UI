import { Button, ToggleGroup } from "@shelf-ui/react";
import { useState } from "react";

const revenue = {
  today: 48250,
  "7d": 312900,
  "30d": 1245600,
  "90d": 3890400,
};

const formatRupees = (amount) => `₹${amount.toLocaleString("en-IN")}`;

export default function ToggleGroupControlled() {
  const [range, setRange] = useState("7d");

  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <ToggleGroup aria-label="Date range" size="sm" value={range} onValueChange={setRange}>
        <ToggleGroup.Item value="today">Today</ToggleGroup.Item>
        <ToggleGroup.Item value="7d">7 days</ToggleGroup.Item>
        <ToggleGroup.Item value="30d">30 days</ToggleGroup.Item>
        <ToggleGroup.Item value="90d">90 days</ToggleGroup.Item>
      </ToggleGroup>
      <div>
        <div style={{ color: "var(--shelf-color-text-muted)", fontSize: 14 }}>Revenue</div>
        <div style={{ fontSize: 28, fontWeight: 600 }}>{formatRupees(revenue[range])}</div>
      </div>
      <Button size="sm" variant="ghost" onClick={() => setRange("7d")}>
        Reset to 7 days
      </Button>
    </div>
  );
}
