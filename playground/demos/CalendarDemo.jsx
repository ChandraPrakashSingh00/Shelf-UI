import { Calendar } from "shelf-ui-react";
import { useState } from "react";

const formatDay = (date) =>
  date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

// Deliveries from tomorrow, up to two weeks ahead.
function getDeliveryWindow() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return {
    first: new Date(year, month, today.getDate() + 1),
    last: new Date(year, month, today.getDate() + 14),
  };
}

const isSunday = (date) => date.getDay() === 0;

export function CalendarDemo() {
  const [{ first, last }] = useState(getDeliveryWindow);
  const [delivery, setDelivery] = useState(null);
  const [sale, setSale] = useState(null);

  return (
    <div className="pg-row" style={{ alignItems: "flex-start", gap: "2rem" }}>
      <div className="pg-stack">
        <Calendar
          label="Delivery date"
          min={first}
          max={last}
          isDateDisabled={isSunday}
          weekStartsOn={1}
          value={delivery}
          onValueChange={setDelivery}
        />
        <p className="pg-muted">
          {delivery ? `Delivery on ${formatDay(delivery)}` : "Next 14 days, no Sundays"}
        </p>
      </div>
      <div className="pg-stack">
        <Calendar mode="range" label="Sale period" value={sale} onValueChange={setSale} />
        <p className="pg-muted">
          {sale?.end
            ? `Sale: ${formatDay(sale.start)} – ${formatDay(sale.end)}`
            : "Pick the first and last day of the sale"}
        </p>
      </div>
      <div className="pg-stack" lang="hi">
        <Calendar
          locale="hi-IN"
          weekStartsOn={1}
          showOutsideDays={false}
          label="डिलीवरी की तारीख"
          previousMonthLabel="पिछला महीना"
          nextMonthLabel="अगला महीना"
        />
      </div>
    </div>
  );
}
