import { DatePicker } from "shelf-ui-react";
import { useState } from "react";

// Report presets ending today, built once.
function getPresets() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysAgo = (count) => new Date(year, month, now.getDate() - count);
  return [
    { label: "Today", value: { start: daysAgo(0), end: daysAgo(0) } },
    { label: "Last 7 days", value: { start: daysAgo(6), end: daysAgo(0) } },
    { label: "Last 30 days", value: { start: daysAgo(29), end: daysAgo(0) } },
    { label: "This month", value: { start: new Date(year, month, 1), end: daysAgo(0) } },
  ];
}

const isSunday = (date) => date.getDay() === 0;
const orderDate = new Date(2026, 9, 6);

export function DatePickerDemo() {
  const [presets] = useState(getPresets);
  const [period, setPeriod] = useState(null);

  return (
    <div className="pg-grid" style={{ minHeight: "26rem", alignItems: "start" }}>
      <DatePicker
        label="Delivery date"
        helperText="We deliver Monday to Saturday."
        isDateDisabled={isSunday}
        weekStartsOn={1}
      />
      <DatePicker
        mode="range"
        label="Report period"
        presets={presets}
        value={period}
        onValueChange={setPeriod}
        helperText={period ? "Orders report is ready." : "Pick a range or a preset."}
      />
      <DatePicker label="Return pickup" required error="Choose a pickup date." size="sm" />
      <DatePicker label="Order date" defaultValue={orderDate} disabled size="lg" align="end" />
    </div>
  );
}
