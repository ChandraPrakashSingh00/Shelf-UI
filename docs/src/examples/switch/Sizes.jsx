import { Switch } from "@shelf-ui/react";

export default function SwitchSizes() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Switch size="sm" label="Small" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
    </div>
  );
}
