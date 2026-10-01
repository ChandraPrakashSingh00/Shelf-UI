import { Button, NumberInput } from "@codecps/ui";
import { useState } from "react";

export default function NumberInputForm() {
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(Object.fromEntries(new FormData(event.currentTarget)));
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={() => setSubmitted(null)}
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 320 }}
    >
      <NumberInput
        label="Stock in Bengaluru warehouse"
        name="stock"
        min={0}
        defaultValue={120}
        required
      />
      <NumberInput
        label="MRP"
        name="mrp"
        min={0}
        defaultValue={1999}
        formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit">Save</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      {submitted && (
        <p style={{ margin: 0, color: "var(--cps-color-text-muted)", fontSize: 14 }}>
          Submitted: stock={submitted.stock}, mrp={submitted.mrp}
        </p>
      )}
    </form>
  );
}
