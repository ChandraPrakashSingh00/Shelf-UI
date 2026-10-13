import { Button, Calendar, Card } from "shelf-ui-react";
import { useState } from "react";

const formatDay = (date) =>
  date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

export default function CalendarControlled() {
  const [date, setDate] = useState(null);

  return (
    <Card
      footer={
        <Button size="sm" variant="outline" disabled={!date} onClick={() => setDate(null)}>
          Clear date
        </Button>
      }
    >
      <Calendar label="Delivery date" value={date} onValueChange={setDate} />
      <p style={{ margin: 0 }} aria-live="polite">
        {date ? (
          <>
            Your order arrives on <strong>{formatDay(date)}</strong>.
          </>
        ) : (
          "Pick a day for delivery."
        )}
      </p>
    </Card>
  );
}
