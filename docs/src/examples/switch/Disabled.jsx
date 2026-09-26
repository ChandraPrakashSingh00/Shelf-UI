import { Switch } from "@codecps/ui";

export default function SwitchDisabled() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Switch
        label="Two-factor authentication"
        description="Required by your workspace admin."
        defaultChecked
        disabled
      />
      <Switch label="Audit log export" description="Available on the Enterprise plan." disabled />
    </div>
  );
}
