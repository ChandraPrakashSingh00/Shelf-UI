import { NumberInput } from "@codecps/ui";

export default function NumberInputBasic() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 320 }}>
      <NumberInput
        label="Quantity"
        min={1}
        max={10}
        defaultValue={1}
        helperText="Maximum 10 per order."
      />
      <NumberInput
        label="Low-stock alert"
        min={0}
        defaultValue={15}
        helperText="Get an email when fewer units than this are left."
      />
    </div>
  );
}
