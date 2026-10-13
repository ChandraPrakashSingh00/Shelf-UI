import { Calendar, Card } from "shelf-ui-react";
import { useState } from "react";

const formatDay = (date) => date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// Whole days between two local dates, both included.
const countDays = (start, end) => Math.round((end - start) / 86_400_000) + 1;

export default function CalendarRange() {
  const [range, setRange] = useState(null);

  let summary = "Pick the first day of the sale.";
  if (range?.start && !range.end) summary = "Now pick the last day.";
  if (range?.start && range.end) {
    const days = countDays(range.start, range.end);
    summary = `Festive sale: ${formatDay(range.start)} – ${formatDay(range.end)} (${days} ${days === 1 ? "day" : "days"})`;
  }

  return (
    <Card>
      <Calendar mode="range" label="Sale period" value={range} onValueChange={setRange} />
      <p style={{ margin: 0 }} aria-live="polite">
        {summary}
      </p>
    </Card>
  );
}
