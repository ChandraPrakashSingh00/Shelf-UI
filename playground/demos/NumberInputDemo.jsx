import { NumberInput } from "@codecps/ui";
import { useState } from "react";

export function NumberInputDemo() {
  const [quantity, setQuantity] = useState(2);
  return (
    <div className="pg-grid">
      <NumberInput
        label="Quantity"
        min={1}
        max={10}
        value={quantity}
        onValueChange={setQuantity}
        helperText={`₹${((quantity ?? 0) * 1299).toLocaleString("en-IN")} for ${quantity ?? 0} × boAt Airdopes 141`}
      />
      <NumberInput
        label="Selling price"
        min={0}
        step={50}
        defaultValue={2499}
        formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
      />
      <div className="pg-stack">
        <NumberInput
          aria-label="Cart quantity"
          variant="compact"
          size="sm"
          min={1}
          max={5}
          defaultValue={1}
          allowEmpty={false}
        />
        <NumberInput
          label="Discount (%)"
          size="sm"
          max={90}
          defaultValue={95}
          clampOnBlur={false}
        />
      </div>
      <NumberInput
        label="Stock"
        defaultValue={0}
        disabled
        helperText="Synced from the warehouse."
      />
    </div>
  );
}
