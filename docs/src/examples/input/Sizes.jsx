import { Input } from "shelf-ui-react";

export default function InputSizes() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 360 }}>
      <Input size="sm" aria-label="Small input" placeholder="Small" />
      <Input size="md" aria-label="Medium input" placeholder="Medium" />
      <Input size="lg" aria-label="Large input" placeholder="Large" />
    </div>
  );
}
