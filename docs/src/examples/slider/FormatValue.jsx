import { Slider } from "@shelf-ui/react";

const formatRupees = (value) => `₹${value.toLocaleString("en-IN")}`;

export default function SliderFormatValue() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Slider
        label="Monthly budget"
        min={1000}
        max={100000}
        step={1000}
        defaultValue={25000}
        formatValue={formatRupees}
        helperText="We'll email you when spending reaches this amount."
      />
    </div>
  );
}
