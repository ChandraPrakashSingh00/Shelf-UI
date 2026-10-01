import { NumberInput } from "@codecps/ui";

export default function NumberInputStates() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 20,
        width: "100%",
        maxWidth: 600,
      }}
    >
      <NumberInput label="Small" size="sm" defaultValue={2} />
      <NumberInput label="Medium" defaultValue={2} />
      <NumberInput label="Large" size="lg" defaultValue={2} />
      <NumberInput
        label="Read-only"
        readOnly
        defaultValue={48}
        helperText="Synced from the warehouse."
      />
      <NumberInput label="Disabled" disabled defaultValue={0} />
      <NumberInput label="Compact" variant="compact" defaultValue={1} min={1} />
    </div>
  );
}
