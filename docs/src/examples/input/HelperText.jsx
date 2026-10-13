import { Input } from "@shelf-ui/react";

export default function InputHelperText() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Input
        label="Workspace URL"
        placeholder="acme"
        helperText="Lowercase letters, numbers and dashes only."
      />
    </div>
  );
}
