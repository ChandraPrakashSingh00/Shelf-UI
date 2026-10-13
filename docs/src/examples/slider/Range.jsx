import { Slider } from "shelf-ui-react";

export default function SliderRange() {
  return (
    <div style={{ display: "grid", gap: 24, width: "100%", maxWidth: 360 }}>
      <Slider
        label="Team size"
        min={1}
        max={50}
        defaultValue={8}
        formatValue={(value) => (value === 1 ? "1 member" : `${value} members`)}
      />
      <Slider
        label="Storage"
        min={10}
        max={500}
        step={10}
        defaultValue={100}
        formatValue={(value) => `${value} GB`}
      />
    </div>
  );
}
