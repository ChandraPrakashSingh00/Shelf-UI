import { Input } from "@shelf-ui/react";

export default function InputStates() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}>
      <Input label="Full name" required placeholder="Priya Sharma" />
      <Input
        label="Plan"
        defaultValue="Enterprise"
        disabled
        helperText="Contact sales to change your plan."
      />
    </div>
  );
}
