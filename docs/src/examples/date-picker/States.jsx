import { DatePicker } from "shelf-ui-react";

const orderDate = new Date(2026, 9, 6);

export default function DatePickerStates() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 320 }}>
      <DatePicker size="sm" label="Small" defaultValue={orderDate} />
      <DatePicker size="md" label="Medium" defaultValue={orderDate} />
      <DatePicker size="lg" label="Large" defaultValue={orderDate} />
      <DatePicker
        label="Return pickup"
        required
        error="Choose a pickup date within 7 days of delivery."
      />
      <DatePicker
        label="Order date"
        defaultValue={orderDate}
        helperText="Can't be changed after the order is placed."
        disabled
      />
    </div>
  );
}
