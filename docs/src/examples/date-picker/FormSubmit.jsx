import { Button, DatePicker } from "shelf-ui-react";
import { useState } from "react";

export default function DatePickerFormSubmit() {
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
      <DatePicker
        name="dispatchDate"
        label="Dispatch date"
        helperText="When the warehouse in Bengaluru ships the order."
        required
      />
      <DatePicker mode="range" name="sale" label="Flash sale" />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit">Save schedule</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
      {submitted && (
        <pre style={{ margin: 0, fontSize: "var(--shelf-font-size-xs)" }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  );
}
