import { Checkbox } from "@codecps/ui";

export default function CheckboxStates() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
    </div>
  );
}
