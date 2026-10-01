import { Calendar, Card } from "@codecps/ui";
import { useState } from "react";

// Deliveries start tomorrow and can be booked up to two weeks ahead.
function getDeliveryWindow() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return {
    first: new Date(year, month, today.getDate() + 1),
    last: new Date(year, month, today.getDate() + 14),
  };
}

// No deliveries on Sundays.
const isSunday = (date) => date.getDay() === 0;

export default function CalendarDeliverySlots() {
  const [{ first, last }] = useState(getDeliveryWindow);
  const [date, setDate] = useState(null);

  return (
    <Card title="Book a delivery slot" description="Pincode 400001, Mumbai · Monday to Saturday">
      <Calendar
        label="Delivery date"
        min={first}
        max={last}
        isDateDisabled={isSunday}
        weekStartsOn={1}
        value={date}
        onValueChange={setDate}
      />
    </Card>
  );
}
