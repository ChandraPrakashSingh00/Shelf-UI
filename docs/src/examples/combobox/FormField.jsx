import { Button, Combobox } from "@codecps/ui";
import { useState } from "react";

const states = [
  { value: "DL", label: "Delhi" },
  { value: "GJ", label: "Gujarat" },
  { value: "KA", label: "Karnataka" },
  { value: "KL", label: "Kerala" },
  { value: "MH", label: "Maharashtra" },
  { value: "RJ", label: "Rajasthan" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "WB", label: "West Bengal" },
];

export default function ComboboxFormField() {
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const state = new FormData(event.currentTarget).get("state");
    if (!state) {
      setError("Choose a state so we can add the right GST.");
      setSaved(null);
      return;
    }
    setError(null);
    setSaved(state);
  };

  const handleReset = () => {
    setError(null);
    setSaved(null);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onReset={handleReset}
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360 }}
    >
      <Combobox
        label="Billing state"
        name="state"
        required
        defaultValue="MH"
        placeholder="Search states"
        options={states}
        helperText="Used to calculate GST on your invoice."
        error={error}
        onValueChange={() => setError(null)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button type="submit">Save address</Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </div>
      {saved && (
        <p role="status" style={{ margin: 0, fontSize: 14 }}>
          Saved with <code>state={saved}</code>
        </p>
      )}
    </form>
  );
}
