import { Input } from "@codecps/ui";

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
