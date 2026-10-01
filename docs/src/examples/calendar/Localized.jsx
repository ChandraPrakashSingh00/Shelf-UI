import { Calendar, Card } from "@codecps/ui";

export default function CalendarLocalized() {
  return (
    <Card lang="hi">
      <Calendar
        locale="hi-IN"
        weekStartsOn={1}
        showOutsideDays={false}
        label="डिलीवरी की तारीख"
        previousMonthLabel="पिछला महीना"
        nextMonthLabel="अगला महीना"
      />
    </Card>
  );
}
