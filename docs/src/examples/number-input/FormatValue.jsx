import { NumberInput } from "@shelf-ui/react";

const formatRupees = (value) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function NumberInputFormatValue() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 320 }}>
      <NumberInput
        label="Selling price"
        min={0}
        step={50}
        precision={2}
        defaultValue={2499}
        formatValue={formatRupees}
        helperText="Including GST."
      />
      <NumberInput
        label="Discount"
        min={0}
        max={90}
        step={0.5}
        defaultValue={12.5}
        formatValue={(value) => `${value}% off`}
      />
    </div>
  );
}
