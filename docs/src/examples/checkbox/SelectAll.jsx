import { Checkbox } from "shelf-ui-react";
import { useState } from "react";

const environments = [
  { id: "production", label: "Production" },
  { id: "preview", label: "Preview" },
  { id: "development", label: "Development" },
];

export default function CheckboxSelectAll() {
  const [selected, setSelected] = useState(["production", "preview"]);
  const allSelected = selected.length === environments.length;

  const toggleAll = (checked) => {
    setSelected(checked ? environments.map((environment) => environment.id) : []);
  };

  const toggle = (id, checked) => {
    setSelected((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  };

  return (
    <fieldset style={{ minWidth: 0, margin: 0, padding: 0, border: 0 }}>
      <legend style={{ marginBottom: 12, padding: 0, fontSize: 14, fontWeight: 600 }}>
        Apply DATABASE_URL to
      </legend>
      <Checkbox
        label="All environments"
        checked={allSelected}
        indeterminate={selected.length > 0 && !allSelected}
        onCheckedChange={toggleAll}
      />
      <div style={{ display: "grid", gap: 8, marginTop: 8, paddingInlineStart: 24 }}>
        {environments.map((environment) => (
          <Checkbox
            key={environment.id}
            label={environment.label}
            checked={selected.includes(environment.id)}
            onCheckedChange={(checked) => toggle(environment.id, checked)}
          />
        ))}
      </div>
    </fieldset>
  );
}
