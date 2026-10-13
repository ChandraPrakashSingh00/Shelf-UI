import { DatePicker } from "shelf-ui-react";
import { useState } from "react";

// Pickups can be booked from tomorrow, up to 30 days ahead.
function getPickupWindow() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return {
    first: new Date(year, month, today.getDate() + 1),
    last: new Date(year, month, today.getDate() + 30),
  };
}

// The store is closed on Sundays and on national holidays (month, day).
const HOLIDAYS = [
  [1, 26], // Republic Day
  [8, 15], // Independence Day
  [10, 2], // Gandhi Jayanti
];

const isClosed = (date) =>
  date.getDay() === 0 ||
  HOLIDAYS.some(([month, day]) => date.getMonth() + 1 === month && date.getDate() === day);

export default function DatePickerAvailability() {
  const [{ first, last }] = useState(getPickupWindow);

  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <DatePicker
        label="Store pickup date"
        helperText="Andheri West, Mumbai · closed on Sundays and national holidays."
        min={first}
        max={last}
        isDateDisabled={isClosed}
        weekStartsOn={1}
      />
    </div>
  );
}
