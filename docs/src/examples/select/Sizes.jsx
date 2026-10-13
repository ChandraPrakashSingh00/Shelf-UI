import { Select } from "@shelf-ui/react";

const branches = ["main", "develop", "release/2.4"];

export default function SelectSizes() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 360 }}>
      <Select size="sm" aria-label="Small select" options={branches} />
      <Select size="md" aria-label="Medium select" options={branches} />
      <Select size="lg" aria-label="Large select" options={branches} />
    </div>
  );
}
