import { DatePicker } from "shelf-ui-react";
import { useState } from "react";

// Report ranges end today; built once, when the page opens.
function getPresets() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const daysAgo = (count) => new Date(year, month, date - count);
  const today = daysAgo(0);
  return [
    { label: "Today", value: { start: today, end: today } },
    { label: "Yesterday", value: { start: daysAgo(1), end: daysAgo(1) } },
    { label: "Last 7 days", value: { start: daysAgo(6), end: today } },
    { label: "Last 30 days", value: { start: daysAgo(29), end: today } },
    { label: "This month", value: { start: new Date(year, month, 1), end: today } },
  ];
}

const formatDay = (date) =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function DatePickerReportPeriod() {
  const [presets] = useState(getPresets);
  const [period, setPeriod] = useState(() => presets[2].value);

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 320 }}>
      <DatePicker
        mode="range"
        label="Report period"
        presets={presets}
        value={period}
        onValueChange={setPeriod}
        clearable={false}
      />
      <p style={{ margin: 0, color: "var(--shelf-color-text-muted)" }}>
        Showing orders placed from {formatDay(period.start)} to {formatDay(period.end)}.
      </p>
    </div>
  );
}
