import { ToggleGroup } from "@codecps/ui";

export default function ToggleGroupVerticalFullWidth() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 32,
        width: "100%",
        maxWidth: 520,
      }}
    >
      {/* Vertical: ↑ and ↓ move between the options. */}
      <ToggleGroup label="Delivery speed" orientation="vertical" defaultValue="standard">
        <ToggleGroup.Item value="standard">Standard · Free</ToggleGroup.Item>
        <ToggleGroup.Item value="express">Express · ₹99</ToggleGroup.Item>
        <ToggleGroup.Item value="same-day" disabled>
          Same day · Mumbai only
        </ToggleGroup.Item>
      </ToggleGroup>

      <div style={{ flex: "1 1 220px" }}>
        <ToggleGroup label="Pay with" fullWidth defaultValue="upi">
          <ToggleGroup.Item value="upi">UPI</ToggleGroup.Item>
          <ToggleGroup.Item value="card">Card</ToggleGroup.Item>
          <ToggleGroup.Item value="cod">COD</ToggleGroup.Item>
        </ToggleGroup>
      </div>
    </div>
  );
}
