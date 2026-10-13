import { DatePicker } from "@shelf-ui/react";

const formatShort = (date) =>
  date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" });

export default function DatePickerFormatting() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 320 }}>
      <DatePicker label="Delivery date" formatDate={formatShort} placeholder="Any weekday" />
      <div lang="hi">
        <DatePicker
          locale="hi-IN"
          weekStartsOn={1}
          label="डिलीवरी की तारीख"
          placeholder="तारीख चुनें"
          clearLabel="तारीख हटाएँ"
          previousMonthLabel="पिछला महीना"
          nextMonthLabel="अगला महीना"
        />
      </div>
    </div>
  );
}
